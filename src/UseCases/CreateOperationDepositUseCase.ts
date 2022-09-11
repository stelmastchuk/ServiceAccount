import { operationType } from "../repositories/DTO/ICreateOperationDTO";
import { IAccountRepository } from "@repositories/Repository/IAccountRepository";
import { IHistoricAccountRepository } from "@repositories/Repository/IHistoricAccountRepository";
import { AppError } from "src/errors/AppError";
import { inject, injectable } from "tsyringe";
import { ReturnOperation } from "@repositories/DTO/types";

@injectable()
class CreateOperationDepositUseCase {
  constructor(
    @inject("AccountRepository")
    private accountRepository: IAccountRepository,
    @inject("HistoricAccountRepository")
    private historicAccountRepository: IHistoricAccountRepository
  ) {}

  async execute(balanceMoved: number, cpf: string): Promise<ReturnOperation> {
    const account = await this.accountRepository.findByCpf(cpf);

    if (!account) {
      throw new AppError("Account not found!");
    }

    if (!account.accountStatus) {
      throw new AppError("Account blocked!");
    }

    const balanceCalculator = account.balance + balanceMoved;

    account.balance = balanceCalculator;

    console.log(account);

    const updatedAccount = !!(await this.accountRepository.update({
      cpf: account.cpf,
      accountId: account.accountId,
      balance: account.balance,
    }));

    const createHistoric = !!(await this.historicAccountRepository.create({
      accountId: account.accountId,
      balanceMoved: balanceMoved,
      cpf: cpf,
      typeOperation: operationType.deposit,
    }));

    const transactionSucces = !!(updatedAccount && createHistoric);

    return {
      transactionSucces: transactionSucces,
      currentBalance: account.balance,
    };
  }
}

export { CreateOperationDepositUseCase };
