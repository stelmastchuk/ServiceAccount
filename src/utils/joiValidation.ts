import Joi from 'joi';

export const schemaCreateOperation = Joi.object({
    cpf: Joi.string().required(),
    typeOperation: Joi.string().required(),
    balanceMoved: Joi.number().required()
})

export const schemaGetExtract = Joi.object({
    cpf: Joi.string().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required()
})

export const schemaCreateAccount = Joi.object({
    cpf: Joi.string().required(),
})
export const schemaBlockOrDesblockAccount = Joi.object({
    accountStatus: Joi.boolean().required(),
    cpf: Joi.string().required(),
})
