import dynamoose from "dynamoose"
import { ModelType } from 'dynamoose/dist/General'
import { HistoricAccount } from 'src/entities/HistoricAccount';
import { v4 as uuid } from 'uuid';

const schema = new dynamoose.Schema({
    historicId: {
        type: String,
        required: true,
        default: uuid,
        hashKey: true
    },
    accountId: {
        type: String,
        required: true,
        index: {
            global: true,
            name: "accountId"
        }
    },
    cpf: {
        type: String,
        required: true,
        index: {
            global: true,
            name: "cpf"
        },
    },
    balanceMoved: {
        type: Number,
        required: true,
    },
    typeOperation: {
        type: String,
        required: true,
    },
    dateCreation: {
        type: Number,
        rangeKey: true,
        default: new Date().getTime()
    }
},{
    "saveUnknown": true,
    "timestamps": true,
});

export const HistoricAccountRepositoryModel: ModelType<HistoricAccount> = dynamoose.model<HistoricAccount>("HistoricAccount", schema, {
    throughput: 'ON_DEMAND',
})


