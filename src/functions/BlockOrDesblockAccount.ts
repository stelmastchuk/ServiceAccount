import "reflect-metadata";
import { BlockOrUnlockAccountController } from 'src/controllers/BlockOrUnlockAccountcontroller';
import "../containers/index";

export const handler = async (event: any) => {

    const blockOrDesblockAccountController = new BlockOrUnlockAccountController()
    const response = blockOrDesblockAccountController.handler(event)

    return response

};