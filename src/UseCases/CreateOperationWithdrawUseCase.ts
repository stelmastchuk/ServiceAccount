import { operationType } from '@repositories/DTO/ICreateOperationDTO';
import { IAccountRepository } from '@repositories/Repository/IAccountRepository';
import { IHistoricAccountRepository } from '@repositories/Repository/IHistoricAccountRepository';
import { AppError } from 'src/errors/AppError';
import { inject, injectable } from 'tsyringe';
import * as DateFns from 'date-fns'
import { HistoricAccount } from 'src/entities/HistoricAccount';

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

        await this.validateWithdrawPerDay(cpf)

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

    private async validateWithdrawPerDay(cpf: string): Promise<void> {

        const now = new Date()

        const startDay = DateFns.startOfDay(now).getTime()

        const endDay = DateFns.endOfDay(now).getTime()

        const accountHistoric: Partial<HistoricAccount>[] = await this.historicAccountRepository.getAccountHistoricPerDay(cpf, startDay, endDay)

        const totalAmounWithdraw = accountHistoric.
            map((item) => item.typeOperation === operationType.withdraw ? item.balanceMoved : 0).
            reduce((ac, vt) => ac + vt, 0)

        if (totalAmounWithdraw >= 2000) {
            throw new AppError("Limit Withdraw : 2000")
        }
    }
}

export { CreateOperationWithdrawUseCase }