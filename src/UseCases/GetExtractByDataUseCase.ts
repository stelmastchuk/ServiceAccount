import { operationType } from '../repositories/DTO/ICreateOperationDTO';
import { IAccountRepository } from '@repositories/Repository/IAccountRepository';
import { IHistoricAccountRepository } from '@repositories/Repository/IHistoricAccountRepository';
import { HistoricAccount } from 'src/entities/HistoricAccount';
import { AppError } from 'src/errors/AppError';
import { inject, injectable } from 'tsyringe';

@injectable()
class GetExtractByDataUseCase {
    constructor(
        @inject("AccountRepository")
        private accountRepository: IAccountRepository,
        @inject("HistoricAccountRepository")
        private historicAccountRepository: IHistoricAccountRepository
    ) { }

    async execute(cpf: string, startDate: string, endDate: string) {
        
        const account = await this.accountRepository.findByCpf(cpf)

        if (!account) {
            throw new AppError("Account not exists!")
        }

        if (!account.accountStatus) {
            throw new AppError("Account blocked!")
        }

        const accountHistoric: Partial<HistoricAccount>[] = await this.historicAccountRepository.getAccountHistoricByData(cpf, startDate, endDate)

        const totalAmounDeposit = accountHistoric.
            map((item) => item.typeOperation === operationType.deposit ? item.balanceMoved : 0).
            reduce((ac, vt) => ac + vt, 0)
        
        const totalAmounwithdraw = accountHistoric.
            map((item) => item.typeOperation === operationType.withdraw ? item.balanceMoved : 0).
            reduce((ac, vt) => ac + vt, 0)
        
    
        const balanceTotal = totalAmounDeposit - totalAmounwithdraw

        const accountHistoricResponse = accountHistoric.map(item => {
            return {
                balanceMoved: item.balanceMoved,
                typeOperation: item.typeOperation,
                updatedAt: new Date(item.updatedAt).getTime(),
                createdAt: new Date(item.createdAt).getTime(),
            }
        })

        return {
            ...accountHistoricResponse,
            balanceTotal
        }

    }

}

export { GetExtractByDataUseCase}