import "reflect-metadata";
import { CreateOperationController } from 'src/controllers/CreateOperationController';
import "../containers/index";

export const handler = async (event: any) => {
    
    const createPortadorController = new CreateOperationController()
    const response = createPortadorController.handler(event)

    return response

};