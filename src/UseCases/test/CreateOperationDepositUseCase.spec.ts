import "reflect-metadata";
import { container } from 'tsyringe'
import { IAccountRepository } from '@repositories/Repository/IAccountRepository';
import { CreateOperationDepositUseCase } from '../CreateOperationDepositUseCase';
import { IHistoricAccountRepository } from '@repositories/Repository/IHistoricAccountRepository';
import { AppError } from 'src/errors/AppError';
import { ReturnOperation } from '@repositories/DTO/types';


describe("Create Operation Deposit", () => {

    const account = {
        accountId: 'string',
        balance: 1,
        accountNumber: 1,
        agencyAccount: 1,
        cpf: 'string',
        accountStatus: true,
        createdA: new Date(),
        updatedAt: new Date()
    }

    const account1 = {
        accountStatus: false,
        createdA: new Date(),
        updatedAt: new Date()
    }

    const returnMock: ReturnOperation = {
        transactionSucces: true,
        currentBalance: 1001
    }

    const createAccountRepo: jest.Mocked<IAccountRepository> = {
        create: jest.fn().mockImplementation(() => Promise.resolve(account)),
        update: jest.fn().mockImplementation(() => Promise.resolve(account)),
        delete: jest.fn().mockImplementation(() => Promise.resolve(account)),
        findByCpf: jest.fn().mockImplementation(() => Promise.resolve(account))
    }


    const createHistoricAccountRepo: jest.Mocked<IHistoricAccountRepository> = {
        create: jest.fn().mockImplementation(() => Promise.resolve(account)),
        getAccountHistoricByData: jest.fn().mockImplementation(() => Promise.resolve(undefined)),
        getAccountHistoricPerDay: jest.fn().mockImplementation(() => Promise.resolve(undefined))
    }

    beforeEach(() => {
        container.clearInstances()
    });


    it("should be able to deposit in Account", async () => {
        const usecase = new CreateOperationDepositUseCase(createAccountRepo, createHistoricAccountRepo)
        const response = await usecase.execute(1000, "42845684002")
        expect(response).toEqual(returnMock)
    });


    it("should not be able to deposit in Account, if account not exist", async () => {
        const createAccountRepo: jest.Mocked<IAccountRepository> = {
            create: jest.fn().mockImplementation(() => Promise.resolve(account)),
            update: jest.fn().mockImplementation(() => Promise.resolve(account)),
            delete: jest.fn().mockImplementation(() => Promise.resolve(account)),
            findByCpf: jest.fn().mockImplementation(() => Promise.resolve(undefined))
        }
        const usecase = new CreateOperationDepositUseCase(createAccountRepo, createHistoricAccountRepo)
        const mockError = new AppError("Account not found!")
        await (expect(usecase.execute(1000, "42845684002"))).rejects.toEqual(mockError)
    });

    it("should not be able to deposit in Account, if account is blocked ", async () => {
        const createAccountRepo: jest.Mocked<IAccountRepository> = {
            create: jest.fn().mockImplementation(() => Promise.resolve(account)),
            update: jest.fn().mockImplementation(() => Promise.resolve(account)),
            delete: jest.fn().mockImplementation(() => Promise.resolve(account)),
            findByCpf: jest.fn().mockImplementation(() => Promise.resolve(account1))
        }
        const usecase = new CreateOperationDepositUseCase(createAccountRepo, createHistoricAccountRepo)
        const mockError = new AppError("Account blocked!")
        await (expect(usecase.execute(1000, "42845684002"))).rejects.toEqual(mockError)
    });


})