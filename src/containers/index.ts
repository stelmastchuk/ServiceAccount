import { IAccountRepository } from '@repositories/Repository/IAccountRepository';
import { AccountRepository } from '@repositories/Repository/AccountRepository';
import { container } from 'tsyringe';
import { HistoricAccountRepository } from '@repositories/Repository/HistoricAccountRepository';
import { IHistoricAccountRepository } from '@repositories/Repository/IHistoricAccountRepository';

container.registerSingleton<IAccountRepository>(
    "AccountRepository",
    AccountRepository
);

container.registerSingleton<IHistoricAccountRepository>(
    "HistoricAccountRepository",
    HistoricAccountRepository
);