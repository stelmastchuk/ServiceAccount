import Joi from "joi";

export const schemaCreateOperation = Joi.object({
  cpf: Joi.string().required(),
  typeOperation: Joi.string().required(),
  balanceMoved: Joi.number().positive().strict(),
});

export const schemaGetExtract = Joi.object({
  cpf: Joi.string().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
});

export const schemaCreateAccount = Joi.object({
  cpf: Joi.string().required(),
  email: Joi.string().email().required(),
  issuerId: Joi.string().required(),
  name: Joi.string().required(),
});

export const schemaGetAccount = Joi.object({
  cpf: Joi.string().required(),
});

export const schemaBlockOrDesblockAccount = Joi.object({
  accountStatus: Joi.boolean().required().strict(),
  cpf: Joi.string().required(),
});
