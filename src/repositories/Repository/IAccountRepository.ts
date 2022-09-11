import { Account } from "src/entities/Account";

interface IAccountRepository {
  create(entity: Partial<Account>): Promise<Account>;
  update(entity: Partial<Account>): Promise<Account>;
  delete(account: string): Promise<void>;
  findByCpf(cpf: string): Promise<Partial<Account> | undefined>;
}

export { IAccountRepository };
