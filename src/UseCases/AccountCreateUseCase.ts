import { IAccountRepository } from '@repositories/Repository/IAccountRepository';
import { Account } from 'src/entities/Account';
import { inject, injectable } from 'tsyringe';


@injectable()
class AccountCreateUseCase {

    constructor(
        @inject("AccountRepository")
        private accountRepository: IAccountRepository
    ) { }

    async execute(cpf: string): Promise<Account> {
        return this.accountRepository.create({ cpf: cpf}) 
    }
}

export { AccountCreateUseCase }