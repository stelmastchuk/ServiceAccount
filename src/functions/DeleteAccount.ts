import "reflect-metadata";
import { DeleteAccountController } from 'src/controllers/DeleteAccountController';
import "../containers/index";

export const handler = async (event: any) => {

    const deleteAccountController = new DeleteAccountController()
    const response = deleteAccountController.handler(event)

    return response

};