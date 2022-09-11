import "reflect-metadata";
import { container } from "tsyringe";
import { IAccountRepository } from "@repositories/Repository/IAccountRepository";
import { BlockOrUnlockAccountUseCase } from "../BlockOrUnlockAccountUseCase";
import { AppError } from "src/errors/AppError";

describe("Unlock Account", () => {
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

  it("should be able to unlock Account", async () => {
    const usecase = new BlockOrUnlockAccountUseCase(createAccountRepo);
    const response = await usecase.execute("42845684002", true);
    expect(response).toBe(true);
  });

  it("should not be able to unlock Account, if account not exist", async () => {
    const createAccountRepo: jest.Mocked<IAccountRepository> = {
      create: jest.fn().mockImplementation(() => Promise.resolve(account)),
      update: jest.fn().mockImplementation(() => Promise.resolve(account)),
      delete: jest.fn().mockImplementation(() => Promise.resolve(account)),
      findByCpf: jest.fn().mockImplementation(() => Promise.resolve(undefined)),
    };
    const usecase = new BlockOrUnlockAccountUseCase(createAccountRepo);
    const mockError = new AppError("Account not found!");
    await expect(usecase.execute("42845684002", true)).rejects.toEqual(
      mockError
    );
  });
});
