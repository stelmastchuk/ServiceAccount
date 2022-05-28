import { Document } from 'dynamoose/dist/Document'

export interface Account extends Document  {
    accountId?: string
    balance: number
    accountNumber: number
    agencyAccount: number
    cpf: string
    accountStatus: boolean
    createdAt?: Date | number
    updatedAt?: Date | number
}