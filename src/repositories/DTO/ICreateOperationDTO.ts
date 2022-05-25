interface ICreateOperationDTO {
    cpf: string;
    balanceMoved: number,
    typeOperation: string,
}

export enum operationType {
    deposit = "deposit",
    withdraw = "withdraw"
}

export { ICreateOperationDTO }