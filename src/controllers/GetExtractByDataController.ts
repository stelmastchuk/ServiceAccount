import { container } from 'tsyringe'
import { validarCpf } from 'src/utils/validarcpf';
import { treatError } from 'src/utils/errors';
import { IGetExtractByDataDTO } from '@repositories/DTO/IGetExtractByDataDTO';
import { GetExtractByDataUseCase } from 'src/UseCases/GetExtractByDataUseCase';
import { schemaGetExtract } from 'src/utils/joiValidation';
import { AppError } from 'src/errors/AppError';

class GetExtractByDataController {

    async handler(event: any): Promise<any> {

        try {

            const queryStringParameters = 'queryStringParameters' in event ? event.queryStringParameters ?? {} : {}

            const { cpf, startDate, endDate } = queryStringParameters as IGetExtractByDataDTO

            const { error } = schemaGetExtract.validate({ cpf: cpf, startDate: startDate, endDate: endDate })
            
            if (error) {
                throw new AppError(error.message)
            }

            const cpfvalidado = validarCpf(cpf)

            const getExtractByDataUseCase = container.resolve(GetExtractByDataUseCase)

            const response = await getExtractByDataUseCase.execute(cpfvalidado, startDate, endDate)

            return {
                statusCode: 200,
                body: JSON.stringify({ response }),
                headers: { "Content-type": "application/json" },
            }

        } catch (err) {
            return treatError(err)
        }

    }

}

export { GetExtractByDataController }