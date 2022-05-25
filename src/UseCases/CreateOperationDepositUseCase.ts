import { operationType } from '@repositories/DTO/ICreateOperationDTO';
import { IAccountRepository } from '@repositories/Repository/IAccountRepository';
import { IHistoricAccountRepository } from '@repositories/Repository/IHistoricAccountRepository';
import { AppError } from 'src/errors/AppError';
import { inject, injectable } from 'tsyringe';


@injectable()
class CreateOperationDepositUseCase {

    constructor(
        @inject("AccountRepository")
        private accountRepository: IAccountRepository,
        @inject("HistoricAccountRepository")
         private historicAccountRepository: IHistoricAccountRepository
    ) { }

    async execute(balanceMoved: number, cpf: string): Promise<boolean> {

        const account = await this.accountRepository.findByCpf(cpf)

        if (!account) {
            throw new AppError("Account not exists!")
        }

        if (!account.accountStatus) {
            throw new AppError("Account blocked!")
        }

        const balanceCalculator = account.balance + balanceMoved
        
        account.balance = balanceCalculator

        console.log(account)

        const updatedAccount = !!await this.accountRepository.update({
            cpf: account.cpf,
            accountId: account.accountId,
            balance: account.balance
            
        })

        const createHistoric = !!await this.historicAccountRepository.create({
            accountId: account.accountId,
            balanceMoved: balanceMoved,
            cpf: cpf,
            typeOperation: operationType.deposit
        })


        return updatedAccount && createHistoric
        
    }
}

export { CreateOperationDepositUseCase }