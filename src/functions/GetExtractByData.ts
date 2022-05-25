import "reflect-metadata";
import { GetExtractByDataController } from 'src/controllers/GetExtractByDataController';
import "../containers/index";

export const handler = async (event: any) => {

    const getExtractByDataController = new GetExtractByDataController()
    const response = getExtractByDataController.handler(event)

    return response

};