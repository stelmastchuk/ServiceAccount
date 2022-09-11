import { operationType } from "../repositories/DTO/ICreateOperationDTO";
import { IAccountRepository } from "@repositories/Repository/IAccountRepository";
import { IHistoricAccountRepository } from "@repositories/Repository/IHistoricAccountRepository";
import { AppError } from "src/errors/AppError";
import { inject, injectable } from "tsyringe";
import * as DateFns from "date-fns";
import Datetimezone from "date-fns-tz";
import { HistoricAccount } from "src/entities/HistoricAccount";
import { ReturnOperation } from "@repositories/DTO/types";
@injectable()
class CreateOperationWithdrawUseCase {
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

    const balanceCalculator = account.balance - balanceMoved;

    const validationWithdraw = Math.sign(balanceCalculator);

    account.balance = balanceCalculator;

    if (validationWithdraw === -1) {
      throw new AppError("Insufficient balance to complete the transaction!");
    }

    await this.validateWithdrawPerDay(cpf, balanceMoved);

    const updatedAccount = !!(await this.accountRepository.update({
      cpf: account.cpf,
      accountId: account.accountId,
      balance: account.balance,
    }));

    const createHistoric = !!(await this.historicAccountRepository.create({
      accountId: account.accountId,
      balanceMoved: balanceMoved,
      cpf: cpf,
      typeOperation: operationType.withdraw,
    }));

    const transactionSucces = !!(updatedAccount && createHistoric);

    return {
      transactionSucces: transactionSucces,
      currentBalance: account.balance,
    };
  }

  private async validateWithdrawPerDay(
    cpf: string,
    balancedMoved: number
  ): Promise<void> {
    const now =
      new Date().getTime() +
      Datetimezone.getTimezoneOffset("America/Sao_Paulo");

    const data = new Date(now).toISOString();
    const dataformatted = data.split("T");

    const startDay =
      DateFns.startOfDay(new Date(dataformatted[0]).getTime()).getTime() -
      Datetimezone.getTimezoneOffset("America/Sao_Paulo");

    const endDay =
      DateFns.endOfDay(new Date(dataformatted[0]).getTime()).getTime() -
      Datetimezone.getTimezoneOffset("America/Sao_Paulo");

    const accountHistoric: Partial<HistoricAccount>[] =
      await this.historicAccountRepository.getAccountHistoricPerDay(
        cpf,
        startDay,
        endDay
      );

    const totalAmounWithdraw = accountHistoric
      .map((item) =>
        item.typeOperation === operationType.withdraw ? item.balanceMoved : 0
      )
      .reduce((ac, vt) => ac + vt, 0);

    const withdrawalAvailable = 2000 - totalAmounWithdraw;

    if (balancedMoved > withdrawalAvailable) {
      throw new AppError(
        `Insufficient balance, you can only withdraw more : $${withdrawalAvailable} today and $2000 Per Day!`
      );
    }
  }
}

export { CreateOperationWithdrawUseCase };
