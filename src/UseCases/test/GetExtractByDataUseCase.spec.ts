import "reflect-metadata";
import { container } from 'tsyringe'
import { IAccountRepository } from '@repositories/Repository/IAccountRepository';
import { AppError } from 'src/errors/AppError';
import { HistoricAccount } from 'src/entities/HistoricAccount';
import { operationType } from '../../repositories/DTO/ICreateOperationDTO';
import { IHistoricAccountRepository } from '@repositories/Repository/IHistoricAccountRepository';
import { GetExtractByDataUseCase } from '../GetExtractByDataUseCase';

describe("Get Account", () => {

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

    const historicMock2: Partial<HistoricAccount>[] = [{
        historicId: 'string',
        accountId: 'string',
        balanceMoved: 2000,
        cpf: 'string',
        typeOperation: operationType.withdraw,
        dateCreation: 2131232,
        createdAt: new Date(),
        updatedAt: new Date(),
    }, {
        historicId: 'string',
        accountId: 'string',
        balanceMoved: 2000,
        cpf: 'string',
        typeOperation: operationType.deposit,
        dateCreation: 2131232,
        createdAt: new Date(),
        updatedAt: new Date(),
        }]
    
    const account1 = {
        accountStatus: false,
        createdA: new Date(),
        updatedAt: new Date()
    }
    
    const mockreturn = {
        response: {
            0: {
                balanceMoved: 2000,
                typeOperation: "deposit",
                updatedAt: 1653607922463,
                createdAt: 1653607922463
            },
            1: {
                balanceMoved: 2000,
                typeOperation: "withdraw",
                updatedAt: 1653607922463,
                createdAt: 1653607922463
            }

        },
        balanceTotal: 0
    }
   


    const createAccountRepo: jest.Mocked<IAccountRepository> = {
        create: jest.fn().mockImplementation(() => Promise.resolve(account)),
        update: jest.fn().mockImplementation(() => Promise.resolve(account)),
        delete: jest.fn().mockImplementation(() => Promise.resolve(account)),
        findByCpf: jest.fn().mockImplementation(() => Promise.resolve(account))
    }

    const createHistoricAccountRepo: jest.Mocked<IHistoricAccountRepository> = {
        create: jest.fn().mockImplementation(() => Promise.resolve(account)),
        getAccountHistoricByData: jest.fn().mockImplementation(() => Promise.resolve(historicMock2)),
        getAccountHistoricPerDay: jest.fn().mockImplementation(() => Promise.resolve(historicMock2))
    }

    beforeEach(() => {
        container.clearInstances()
    });


    it("should be able to create a delete Account", async () => {
        const usecase = new GetExtractByDataUseCase(createAccountRepo, createHistoricAccountRepo)
        const response = await usecase.execute("42845684002","2022-05-24","2022-05-27")
        expect(response.balanceTotal).toEqual(mockreturn.balanceTotal)
    });



    it("should not be able to delete Account, if account not exist", async () => {
        const createAccountRepo: jest.Mocked<IAccountRepository> = {
            create: jest.fn().mockImplementation(() => Promise.resolve(account)),
            update: jest.fn().mockImplementation(() => Promise.resolve(account)),
            delete: jest.fn().mockImplementation(() => Promise.resolve(account)),
            findByCpf: jest.fn().mockImplementation(() => Promise.resolve(undefined))
        }
        const usecase = new GetExtractByDataUseCase(createAccountRepo, createHistoricAccountRepo)
        const mockError = new AppError("Account not exists!")
        await (expect(usecase.execute("42845684002", "2022-05-24", "2022-05-27"))).rejects.toEqual(mockError)
    });


    it("should not be able to Withdraw Account, if account blocked", async () => {
        const createAccountRepo: jest.Mocked<IAccountRepository> = {
            create: jest.fn().mockImplementation(() => Promise.resolve(account)),
            update: jest.fn().mockImplementation(() => Promise.resolve(account)),
            delete: jest.fn().mockImplementation(() => Promise.resolve(account)),
            findByCpf: jest.fn().mockImplementation(() => Promise.resolve(account1))
        }
        const usecase = new GetExtractByDataUseCase(createAccountRepo, createHistoricAccountRepo)
        const mockError = new AppError("Account blocked!")
        await (expect(usecase.execute("42845684002", "2022-05-24", "2022-05-27"))).rejects.toEqual(mockError)
    });



})