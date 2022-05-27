import { IAccountRepository } from '@repositories/Repository/IAccountRepository';
import { AppError } from 'src/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { SNS } from 'aws-sdk'


@injectable()
class DeleteAccountUseCase {

    constructor(
        @inject("AccountRepository")
        private accountRepository: IAccountRepository
    ) { }

    async execute(cpf: string): Promise<boolean> {
        const account = await this.accountRepository.findByCpf(cpf)
        if (!account) {
            throw new AppError("Account not exists!")
        }
        await this.accountRepository.delete(account.accountId)
        await this.snsService(cpf)
        return true
    }
    private async snsService(cpf: string): Promise<void> {
        const sns = new SNS({ region: 'us-east-2' })
        const msg = { cpf }
        await sns.publish({
            TopicArn: `arn:aws:sns:us-east-2:532362042466:delete-portador`,
            Subject: 'Delete Account',
            Message: `${JSON.stringify(msg)}`
        }).promise()
    }
}

export { DeleteAccountUseCase }