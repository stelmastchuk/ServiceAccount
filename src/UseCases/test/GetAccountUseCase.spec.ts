import "reflect-metadata";
import { container } from "tsyringe";
import { IAccountRepository } from "@repositories/Repository/IAccountRepository";
import { AppError } from "src/errors/AppError";
import { GetAccountUseCase } from "../GetAccountUseCase";

describe("Get Account", () => {
  const account = {
    accountId: "string",
    balance: 1,
    accountNumber: 1,
    agencyAccount: 1,
    cpf: "string",
    accountStatus: true,
    createdA: new Date(),
    updatedAt: new Date(),
  };

  const createAccountRepo: jest.Mocked<IAccountRepository> = {
    create: jest.fn().mockImplementation(() => Promise.resolve(account)),
    update: jest.fn().mockImplementation(() => Promise.resolve(account)),
    delete: jest.fn().mockImplementation(() => Promise.resolve(account)),
    findByCpf: jest.fn().mockImplementation(() => Promise.resolve(account)),
  };

  beforeEach(() => {
    container.clearInstances();
  });

  it("should be able to create a delete Account", async () => {
    const usecase = new GetAccountUseCase(createAccountRepo);
    const response = await usecase.execute("42845684002");
    expect(response).toEqual(account);
  });

  it("should not be able to delete Account, if account not exist", async () => {
    const createAccountRepo: jest.Mocked<IAccountRepository> = {
      create: jest.fn().mockImplementation(() => Promise.resolve(account)),
      update: jest.fn().mockImplementation(() => Promise.resolve(account)),
      delete: jest.fn().mockImplementation(() => Promise.resolve(account)),
      findByCpf: jest.fn().mockImplementation(() => Promise.resolve(undefined)),
    };
    const usecase = new GetAccountUseCase(createAccountRepo);
    const mockError = new AppError("Account not found!!");
    await expect(usecase.execute("42845684002")).rejects.toEqual(mockError);
  });
});
