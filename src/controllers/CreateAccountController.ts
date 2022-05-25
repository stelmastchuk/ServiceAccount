import { ICreateAccountDTO } from '@repositories/DTO/ICreatePortadorDTO'
import { SQSEvent } from 'aws-lambda';
import { AccountCreateUseCase } from 'src/UseCases/AccountCreateUseCase';
import { schemaCreateAccount } from 'src/utils/joiValidation';
import { sqsEventNormalizer } from 'src/utils/sqsEventNormalizer';
import { container } from 'tsyringe';

class CreateAccountController {

    async handler(event: SQSEvent): Promise<any> {

        try {
            const data = sqsEventNormalizer(event, true) as ICreateAccountDTO

            console.log("Teste DATA", data)

            const { error } = schemaCreateAccount.validate({ cpf: data.cpf })

            if (error) {
                return{
                statusCode: 500,
                body: JSON.stringify(error),
                headers: { "Content-type": "application/json" },
            }
            }

            const portadorCreateUseCase = container.resolve(AccountCreateUseCase);

            const response = await portadorCreateUseCase.execute(data.cpf)

            return {
                statusCode: 201,
                body: JSON.stringify(response),
                headers: { "Content-type": "application/json" },
            }

        } catch (err) {
            return {
                statusCode: 500,
                body: JSON.stringify(err),
                headers: { "Content-type": "application/json" },
            }
        }

    }
}

export { CreateAccountController }