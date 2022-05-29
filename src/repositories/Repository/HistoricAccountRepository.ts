import { HistoricAccountRepositoryModel } from '@repositories/Models/HistoricAccountRepositoryModel';
import { HistoricAccount } from 'src/entities/HistoricAccount';
import { IHistoricAccountRepository } from './IHistoricAccountRepository';
import * as DateFns from 'date-fns'
import Datetimezone from 'date-fns-tz';

class HistoricAccountRepository implements IHistoricAccountRepository {

    async create(entity: Partial<HistoricAccount>): Promise<HistoricAccount> {
        return HistoricAccountRepositoryModel.create(entity)
    }

    async getAccountHistoricByData(cpf: string, startDate: string, endDate: string): Promise<Partial<HistoricAccount[]>> {
        const startDateTimeStamp = DateFns.startOfDay(new Date(startDate).getTime()).getTime() - Datetimezone.getTimezoneOffset("America/Sao_Paulo")
        const endDateTimeStamp = DateFns.endOfDay(new Date(endDate).getTime()).getTime() - Datetimezone.getTimezoneOffset("America/Sao_Paulo")
        

        const historic: any = await HistoricAccountRepositoryModel.query("cpf").
            eq(cpf).
            filter('dateCreation').ge(startDateTimeStamp).
            filter('dateCreation').le(endDateTimeStamp).exec()
        
       return historic.map((item: any) => {
            return {
                balanceMoved: item.balanceMoved,
                accountId: item.accountId,
                typeOperation: item.typeOperation,
                updatedAt: item.updatedAt,
                cpf: item.cpf,
                createdAt: item.createdAt,
                historicId: item.historicId,
                dateCreation: item.dateCreation

            }
        })

    }

    async getAccountHistoricPerDay(cpf: string, startDate: number, endDate: number): Promise<Partial<HistoricAccount[]>> {
        const historic: any = await HistoricAccountRepositoryModel.query("cpf").
            eq(cpf).
            filter('dateCreation').ge(startDate).
            filter('dateCreation').le(endDate).exec()

        return historic.map((item: any) => {
            return {
                balanceMoved: item.balanceMoved,
                accountId: item.accountId,
                typeOperation: item.typeOperation,
                updatedAt: item.updatedAt,
                cpf: item.cpf,
                createdAt: item.createdAt,
                historicId: item.historicId,
                dateCreation: item.dateCreation

            }
        })
    }
}

export { HistoricAccountRepository }