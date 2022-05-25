import { IAccountRepository } from '@repositories/Repository/IAccountRepository';
import { Account } from 'src/entities/Account';
import { AppError } from 'src/errors/AppError';
import { inject, injectable } from 'tsyringe';


@injectable()
class GetAccountUseCase {

    constructor(
        @inject("AccountRepository")
        private accountRepository: IAccountRepository
    ) { }

    async execute(cpf: string): Promise<Partial<Account>> {
        const account = await this.accountRepository.findByCpf(cpf)
        if (!account) {
            throw new AppError("Account not exists!")
        }
        return account
    }
}

export { GetAccountUseCase }