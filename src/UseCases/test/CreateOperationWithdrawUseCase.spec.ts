import "reflect-metadata";
import { container } from "tsyringe";
import { IAccountRepository } from "@repositories/Repository/IAccountRepository";
import { IHistoricAccountRepository } from "@repositories/Repository/IHistoricAccountRepository";
import { CreateOperationWithdrawUseCase } from "../CreateOperationWithdrawUseCase";
import { HistoricAccount } from "src/entities/HistoricAccount";
import { operationType } from "../../repositories/DTO/ICreateOperationDTO";
import { AppError } from "src/errors/AppError";
import { ReturnOperation } from "@repositories/DTO/types";

describe("Create Operation Withdraw", () => {
  const account = {
    accountId: "string",
    balance: 1000,
    accountNumber: 1,
    agencyAccount: 1,
    cpf: "string",
    accountStatus: true,
    createdA: new Date(),
    updatedAt: new Date(),
  };

  const account1 = {
    accountStatus: false,
    createdA: new Date(),
    updatedAt: new Date(),
  };

  const account2 = {
    accountStatus: true,
    balance: 0,
    createdA: new Date(),
    updatedAt: new Date(),
  };

  const account3 = {
    accountId: "string",
    balance: 3000,
    accountNumber: 1,
    agencyAccount: 1,
    cpf: "string",
    accountStatus: true,
    createdA: new Date(),
    updatedAt: new Date(),
  };

  const historicMock: Partial<HistoricAccount>[] = [
    {
      historicId: "string",
      accountId: "string",
      balanceMoved: 1,
      cpf: "string",
      typeOperation: operationType.withdraw,
      dateCreation: 2131232,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const historicMock2: Partial<HistoricAccount>[] = [
    {
      historicId: "string",
      accountId: "string",
      balanceMoved: 2000,
      cpf: "string",
      typeOperation: operationType.withdraw,
      dateCreation: 2131232,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      historicId: "string",
      accountId: "string",
      balanceMoved: 2000,
      cpf: "string",
      typeOperation: operationType.deposit,
      dateCreation: 2131232,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const returnMock: ReturnOperation = {
    transactionSucces: true,
    currentBalance: 0,
  };

  const createAccountRepo: jest.Mocked<IAccountRepository> = {
    create: jest.fn().mockImplementation(() => Promise.resolve(account)),
    update: jest.fn().mockImplementation(() => Promise.resolve(account)),
    delete: jest.fn().mockImplementation(() => Promise.resolve(account)),
    findByCpf: jest.fn().mockImplementation(() => Promise.resolve(account)),
  };

  const createHistoricAccountRepo: jest.Mocked<IHistoricAccountRepository> = {
    create: jest.fn().mockImplementation(() => Promise.resolve(account)),
    getAccountHistoricByData: jest
      .fn()
      .mockImplementation(() => Promise.resolve(undefined)),
    getAccountHistoricPerDay: jest
      .fn()
      .mockImplementation(() => Promise.resolve(historicMock)),
  };

  beforeEach(() => {
    container.clearInstances();
  });

  it("should be able to Withdraw in Account", async () => {
    const usecase = new CreateOperationWithdrawUseCase(
      createAccountRepo,
      createHistoricAccountRepo
    );
    const response = await usecase.execute(1000, "42845684002");
    expect(response).toEqual(returnMock);
  });

  it("should not be able to Withdraw Account, if account not exist", async () => {
    const createAccountRepo: jest.Mocked<IAccountRepository> = {
      create: jest.fn().mockImplementation(() => Promise.resolve(account)),
      update: jest.fn().mockImplementation(() => Promise.resolve(account)),
      delete: jest.fn().mockImplementation(() => Promise.resolve(account)),
      findByCpf: jest.fn().mockImplementation(() => Promise.resolve(undefined)),
    };
    const usecase = new CreateOperationWithdrawUseCase(
      createAccountRepo,
      createHistoricAccountRepo
    );
    const mockError = new AppError("Account not found!");
    await expect(usecase.execute(1000, "42845684002")).rejects.toEqual(
      mockError
    );
  });

  it("should not be able to Withdraw Account, if account blocked", async () => {
    const createAccountRepo: jest.Mocked<IAccountRepository> = {
      create: jest.fn().mockImplementation(() => Promise.resolve(account)),
      update: jest.fn().mockImplementation(() => Promise.resolve(account)),
      delete: jest.fn().mockImplementation(() => Promise.resolve(account)),
      findByCpf: jest.fn().mockImplementation(() => Promise.resolve(account1)),
    };
    const usecase = new CreateOperationWithdrawUseCase(
      createAccountRepo,
      createHistoricAccountRepo
    );
    const mockError = new AppError("Account blocked!");
    await expect(usecase.execute(1000, "42845684002")).rejects.toEqual(
      mockError
    );
  });

  it("should not be able to deposit in Account, if account Insufficient balance  ", async () => {
    const createAccountRepo: jest.Mocked<IAccountRepository> = {
      create: jest.fn().mockImplementation(() => Promise.resolve(account)),
      update: jest.fn().mockImplementation(() => Promise.resolve(account)),
      delete: jest.fn().mockImplementation(() => Promise.resolve(account)),
      findByCpf: jest.fn().mockImplementation(() => Promise.resolve(account2)),
    };
    const usecase = new CreateOperationWithdrawUseCase(
      createAccountRepo,
      createHistoricAccountRepo
    );
    const mockError = new AppError(
      "Insufficient balance to complete the transaction!"
    );
    await expect(usecase.execute(1000, "42845684002")).rejects.toEqual(
      mockError
    );
  });

  it("should not be able to deposit in Account, if account Limit Withdraw : per day 2000  ", async () => {
    const createAccountRepo: jest.Mocked<IAccountRepository> = {
      create: jest.fn().mockImplementation(() => Promise.resolve(account)),
      update: jest.fn().mockImplementation(() => Promise.resolve(account)),
      delete: jest.fn().mockImplementation(() => Promise.resolve(account)),
      findByCpf: jest.fn().mockImplementation(() => Promise.resolve(account3)),
    };
    const createHistoricAccountRepo: jest.Mocked<IHistoricAccountRepository> = {
      create: jest.fn().mockImplementation(() => Promise.resolve(account)),
      getAccountHistoricByData: jest
        .fn()
        .mockImplementation(() => Promise.resolve(undefined)),
      getAccountHistoricPerDay: jest
        .fn()
        .mockImplementation(() => Promise.resolve(historicMock2)),
    };
    const usecase = new CreateOperationWithdrawUseCase(
      createAccountRepo,
      createHistoricAccountRepo
    );
    const mockError = new AppError(
      "Insufficient balance, you can only withdraw more : $0 today and $2000 Per Day!"
    );
    await expect(usecase.execute(1000, "42845684002")).rejects.toEqual(
      mockError
    );
  });
});
