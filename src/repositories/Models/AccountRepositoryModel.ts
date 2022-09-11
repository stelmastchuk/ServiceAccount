import dynamoose from "dynamoose";
import { ModelType } from "dynamoose/dist/General";
import { Account } from "src/entities/Account";
import { getRandomIntegerInclusive } from "src/utils/getRandomInteger";
import { v4 as uuid } from "uuid";

const schema = new dynamoose.Schema(
  {
    accountId: {
      type: String,
      required: true,
      default: uuid,
      hashKey: true,
    },
    cpf: {
      type: String,
      required: true,
      index: {
        global: true,
        name: "cpf",
      },
    },
    issuerId: {
      type: String,
      required: true,
      index: {
        global: true,
        name: "issuerId",
      },
    },
    accountStatus: {
      type: Boolean,
      required: true,
      default: false,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    accountNumber: {
      type: Number,
      required: true,
      default: getRandomIntegerInclusive(1000, 99999),
    },
    agencyAccount: {
      type: String,
      required: true,
      default: "0109-2",
    },
  },
  {
    saveUnknown: true,
    timestamps: true,
  }
);

export const AccountRepositoryModel: ModelType<Account> =
  dynamoose.model<Account>("Account", schema, {
    throughput: "ON_DEMAND",
  });
