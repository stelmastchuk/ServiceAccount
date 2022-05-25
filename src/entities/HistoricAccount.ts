import { Document } from 'dynamoose/dist/Document'

export interface HistoricAccount extends Document {
    historicId?: string,
    accountId?: string
    balanceMoved: number
    cpf: string
    typeOperation: string
    dateCreation?: number
    createdAt?: Date
    updatedAt?: Date
}