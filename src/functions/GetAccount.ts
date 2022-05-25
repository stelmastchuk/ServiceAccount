import "reflect-metadata";
import { GetAccountController } from 'src/controllers/GetAccountController';
import "../containers/index";

export const handler = async (event: any) => {

    const getAccountController = new GetAccountController()
    const response = getAccountController.handler(event)

    return response

};