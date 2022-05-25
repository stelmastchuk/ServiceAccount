import { operationType } from '@repositories/DTO/ICreateOperationDTO';
import { IAccountRepository } from '@repositories/Repository/IAccountRepository';
import { IHistoricAccountRepository } from '@repositories/Repository/IHistoricAccountRepository';
import { AppError } from 'src/errors/AppError';
import { inject, injectable } from 'tsyringe';


@injectable()
class CreateOperationWithdrawUseCase {

    constructor(
        @inject("AccountRepository")
        private accountRepository: IAccountRepository,
        @inject("HistoricAccountRepository")
        private historicAccountRepository: IHistoricAccountRepository
    ) { }

    async execute(balanceMoved: number, cpf: string): Promise<any> {

        const account = await this.accountRepository.findByCpf(cpf)

        if (!account) {
            throw new AppError("Account not exists!")
        }

        if (!account.accountStatus) {
            throw new AppError("Account blocked!")
        }

        const balanceCalculator = account.balance - balanceMoved

        const validationWithdraw = Math.sign(balanceCalculator)

        if (validationWithdraw === -1) {
            throw new AppError("Insufficient balance to complete the transaction!")
        }

        account.balance = balanceCalculator
         
        const updatedAccount = !!await this.accountRepository.update({
            cpf: account.cpf,
            accountId: account.accountId,
            balance: account.balance
        })

        const createHistoric = !!await this.historicAccountRepository.create({
            accountId: account.accountId,
            balanceMoved: balanceMoved,
            cpf: cpf,
            typeOperation: operationType.withdraw
        })


        return updatedAccount && createHistoric


    }
}

export { CreateOperationWithdrawUseCase }