import "reflect-metadata";
import { container } from 'tsyringe'
import { AccountCreateUseCase } from '../AccountCreateUseCase';
import { IAccountRepository } from '@repositories/Repository/IAccountRepository';

describe("Create Account", () => {

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
    
    const createAccountRepo: jest.Mocked<IAccountRepository> = {
    create: jest.fn().mockImplementation(() => Promise.resolve(account)),
    update: jest.fn().mockImplementation(() => Promise.resolve(account)),
    delete: jest.fn().mockImplementation(() => Promise.resolve(account)),
    findByCpf: jest.fn().mockImplementation(() => Promise.resolve(account))
    }

    beforeEach(() => {
        container.clearInstances()
    });


    it("should be able to create a new Account", async () => {
        const usecase = new AccountCreateUseCase(createAccountRepo)
        const response = await usecase.execute("42845684002")
        expect(response).toEqual(account)
    });




})