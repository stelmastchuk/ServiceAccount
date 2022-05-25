import { HistoricAccount } from 'src/entities/HistoricAccount';

interface IHistoricAccountRepository {
    create(entity: Partial<HistoricAccount>): Promise<HistoricAccount>
    getAccountHistoricByData(cpf: string, startDate: string, endDate: string): Promise<any>
}

export { IHistoricAccountRepository }
