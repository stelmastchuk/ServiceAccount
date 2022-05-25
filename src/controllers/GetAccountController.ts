import { container } from 'tsyringe'
import { validarCpf } from 'src/utils/validarcpf';
import { treatError } from 'src/utils/errors';
import { schemaCreateAccount } from 'src/utils/joiValidation';
import { AppError } from 'src/errors/AppError';
import { IGetAccountDTO } from '@repositories/DTO/IGetExtractByDataDTO copy 2';
import { GetAccountUseCase } from 'src/UseCases/getAccountUseCase';

class GetAccountController {

    async handler(event: any): Promise<any> {

        try {

            const queryStringParameters = 'queryStringParameters' in event ? event.queryStringParameters ?? {} : {}

            const { cpf } = queryStringParameters as IGetAccountDTO

            const { error } = schemaCreateAccount.validate({ cpf: cpf })

            if (error) {
                throw new AppError(error.message)
            }

            const cpfvalidado = validarCpf(cpf)

            const getAccountUseCase = container.resolve(GetAccountUseCase)

            const response = await getAccountUseCase.execute(cpfvalidado)

            return {
                statusCode: 201,
                body: JSON.stringify({ response }),
                headers: { "Content-type": "application/json" },
            }

        } catch (err) {
            return treatError(err)
        }

    }

}

export { GetAccountController }