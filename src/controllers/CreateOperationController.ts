import { ICreateOperationDTO, operationType } from '@repositories/DTO/ICreateOperationDTO'
import { CreateOperationDepositUseCase } from 'src/UseCases/CreateOperationDepositUseCase'
import { CreateOperationWithdrawUseCase } from 'src/UseCases/CreateOperationWithdrawUseCase'
import { container } from 'tsyringe'
import { validarCpf } from 'src/utils/validarcpf';
import { treatError } from 'src/utils/errors';
import { schemaCreateOperation } from 'src/utils/joiValidation';
import { AppError } from 'src/errors/AppError';

class CreateOperationController {

    async handler(event: any): Promise<any> {
        
        try {

            const { balanceMoved, cpf, typeOperation } = JSON.parse(event.body) as ICreateOperationDTO

            const { error } = schemaCreateOperation.validate({ cpf: cpf, typeOperation: typeOperation, balanceMoved: balanceMoved })
            
            if (error) {
                throw new AppError(error.message)
            }

            const cpfvalidado = validarCpf(cpf)

            const operationUseCase = operationType.deposit === typeOperation ? container.resolve(CreateOperationDepositUseCase) :
                container.resolve(CreateOperationWithdrawUseCase)

            const response = await operationUseCase.execute(balanceMoved, cpfvalidado)

            return {
                statusCode: 201,
                body: JSON.stringify({ succesOperation: response }),
                headers: { "Content-type": "application/json" },
            }
            
        } catch (err) {
            return treatError(err)
        }

    }

}

export { CreateOperationController }