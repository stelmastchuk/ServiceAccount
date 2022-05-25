import { Account } from 'src/entities/Account'

export const mapAccount = (account: any): Partial<Account> | undefined => {

    const accountformat = account[0] ? {
        accountId: account[0].accountId,
        balance: account[0].balance,
        accountNumber: account[0].accountNumber,
        agencyAccount: account[0].agencyAccount,
        cpf: account[0].cpf,
        accountStatus: account[0].accountStatus,
        createdAt: account[0].createdAt,
        updatedAt: account[0].updatedAt

    } : undefined

    return accountformat

}  

