import { IAccountRepository } from "@repositories/Repository/IAccountRepository";
import { AppError } from "src/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class BlockOrUnlockAccountUseCase {
  constructor(
    @inject("AccountRepository")
    private accountRepository: IAccountRepository
  ) {}

  async execute(cpf: string, accountStatus: boolean): Promise<boolean> {
    const account = await this.accountRepository.findByCpf(cpf);

    if (!account) {
      throw new AppError("Account not found!");
    }

    await this.accountRepository.update({
      accountId: account.accountId,
      cpf: cpf,
      accountStatus: accountStatus,
    });

    return accountStatus;
  }
}

export { BlockOrUnlockAccountUseCase };
