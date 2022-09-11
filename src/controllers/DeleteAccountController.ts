import { container } from "tsyringe";
import { validarCpf } from "src/utils/validarcpf";
import { treatError } from "src/utils/errors";
import { IGetExtractByDataDTO } from "@repositories/DTO/IGetExtractByDataDTO";
import { DeleteAccountUseCase } from "src/UseCases/DeleteAccountUseCase";

class DeleteAccountController {
  async handler(event: any): Promise<any> {
    try {
      const queryStringParameters =
        "queryStringParameters" in event
          ? event.queryStringParameters ?? {}
          : {};

      const { cpf } = queryStringParameters as IGetExtractByDataDTO;

      const cpfvalidado = validarCpf(cpf);

      const deleteAccountUseCase = container.resolve(DeleteAccountUseCase);

      const response = await deleteAccountUseCase.execute(cpfvalidado);

      return {
        statusCode: 200,
        body: JSON.stringify({ accountDeleted: response }),
        headers: { "Content-type": "application/json" },
      };
    } catch (err) {
      return treatError(err);
    }
  }
}

export { DeleteAccountController };
