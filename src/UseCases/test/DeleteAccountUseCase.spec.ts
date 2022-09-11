import "reflect-metadata";
import { container } from "tsyringe";
import { IAccountRepository } from "@repositories/Repository/IAccountRepository";
import { DeleteAccountUseCase } from "../DeleteAccountUseCase";
import { AppError } from "src/errors/AppError";
import AWSMock from "aws-sdk-mock";

describe("Delete Account", () => {
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
    delete: jest.fn().mockImplementation(() => Promise.resolve(true)),
    findByCpf: jest.fn().mockImplementation(() => Promise.resolve(account)),
  };

  beforeEach(() => {
    container.clearInstances();
    AWSMock.restore();
  });

  it("should be able to delete Account", async () => {
    // @ts-ignore
    AWSMock.mock("SNS", "snsService", (params: any, callback: any) => {
      callback(null, "message");
    });

    const usecase = new DeleteAccountUseCase(createAccountRepo);
    const response = await usecase.execute("42845684002");
    expect(response).toBe(true);
  });

  it("should not be able to delete Account, if account not exist", async () => {
    const createAccountRepo: jest.Mocked<IAccountRepository> = {
      create: jest.fn().mockImplementation(() => Promise.resolve(account)),
      update: jest.fn().mockImplementation(() => Promise.resolve(account)),
      delete: jest.fn().mockImplementation(() => Promise.resolve(account)),
      findByCpf: jest.fn().mockImplementation(() => Promise.resolve(undefined)),
    };
    const usecase = new DeleteAccountUseCase(createAccountRepo);
    const mockError = new AppError("Account not found!");
    await expect(usecase.execute("42845684002")).rejects.toEqual(mockError);
  });
});
