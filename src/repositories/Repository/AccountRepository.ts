import { AccountRepositoryModel } from "@repositories/Models/AccountRepositoryModel";
import { Account } from "src/entities/Account";
import { mapAccount } from "src/utils/maps";
import { IAccountRepository } from "./IAccountRepository";

class AccountRepository implements IAccountRepository {
  async create(entity: Partial<Account>): Promise<Account> {
    return AccountRepositoryModel.create(entity);
  }
  async findByCpf(cpf: string): Promise<Partial<Account> | undefined> {
    const account = await AccountRepositoryModel.query("cpf").eq(cpf).exec();
    return mapAccount(account);
  }
  async update(entity: Partial<Account>): Promise<Account> {
    return AccountRepositoryModel.update(entity);
  }

  async delete(accountId: string): Promise<void> {
    await AccountRepositoryModel.delete(accountId);
  }
}

export { AccountRepository };
