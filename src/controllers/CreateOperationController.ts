import { ICreateOperationDTO, operationType } from '@repositories/DTO/ICreateOperationDTO'
import { CreateOperationDepositUseCase } from 'src/UseCases/CreateOperationDepositUseCase'
import { CreateOperationWithdrawUseCase } from 'src/UseCases/CreateOperationWithdrawUseCase'
import { container } from 'tsyringe'
import { validarCpf } from 'src/utils/validarcpf';
import { treatError } from 'src/utils/errors';
import { schemaCreateOperation } from 'src/utils/joiValidation';
import { AppError } from 'src/errors/AppError';
import { ReturnOperation } from '@repositories/DTO/types';

class CreateOperationController {

    async handler(event: any): Promise<any> {
        
        try {

            const { balanceMoved, cpf, typeOperation } = JSON.parse(event.body) as ICreateOperationDTO

            const { error } = schemaCreateOperation.validate({ cpf: cpf, typeOperation: typeOperation, balanceMoved: balanceMoved })
            
            if (error) {
                throw new AppError(error.message)
            }

            const cpfvalidado = validarCpf(cpf)

            const response = await this.factoryOperation(typeOperation, cpfvalidado, balanceMoved)

            return {
                statusCode: 201,
                body: JSON.stringify({ Operation: response }),
                headers: { "Content-type": "application/json" },
            }
            
        } catch (err) {
            return treatError(err)
        }

    }

    private async factoryOperation(typeOperation: string, cpf: string, balanceMoved: number): Promise<ReturnOperation> { 
        switch (typeOperation) {
            case operationType.deposit:
                const responseDeposit = container.resolve(CreateOperationDepositUseCase)
                return responseDeposit.execute(balanceMoved, cpf)
            case operationType.withdraw:
                const responseWithdraw = container.resolve(CreateOperationWithdrawUseCase)
                return responseWithdraw.execute(balanceMoved, cpf)
            default:
                throw new AppError("Operation not found, SELECT: deposit or withdraw!")
        }
    } 

}

export { CreateOperationController }