import { HistoricAccount } from 'src/entities/HistoricAccount';

interface IHistoricAccountRepository {
    create(entity: Partial<HistoricAccount>): Promise<HistoricAccount>
    getAccountHistoricByData(cpf: string, startDate: string, endDate: string): Promise<Partial<HistoricAccount[]>>
    getAccountHistoricPerDay(cpf: string, startDate: number, endDate: number): Promise<Partial<HistoricAccount[]>>
}

export { IHistoricAccountRepository }
