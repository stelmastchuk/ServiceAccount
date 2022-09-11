import { ICreateAccountDTO } from "@repositories/DTO/ICreatePortadorDTO";
import { SQSEvent } from "aws-lambda";
import { AccountCreateUseCase } from "src/UseCases/AccountCreateUseCase";
import { schemaCreateAccount } from "src/utils/joiValidation";
import { sqsEventNormalizer } from "src/utils/sqsEventNormalizer";
import { container } from "tsyringe";

class CreateAccountController {
  async handler(event: SQSEvent): Promise<object> {
    try {
      const data = sqsEventNormalizer(event, true) as ICreateAccountDTO;

      const { error } = schemaCreateAccount.validate({
        cpf: data.cpf,
        email: data.email,
        issuerId: data.issuerId,
        name: data.name,
      });

      if (error) {
        return {
          statusCode: 500,
          body: JSON.stringify(error),
          headers: { "Content-type": "application/json" },
        };
      }

      const accountCreateUseCase = container.resolve(AccountCreateUseCase);

      const response = await accountCreateUseCase.execute(
        data.cpf,
        data.issuerId,
        data.email,
        data.name
      );

      return {
        statusCode: 201,
        body: JSON.stringify(response),
        headers: { "Content-type": "application/json" },
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify(err),
        headers: { "Content-type": "application/json" },
      };
    }
  }
}

export { CreateAccountController };
