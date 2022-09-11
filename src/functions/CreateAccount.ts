import { SQSEvent } from "aws-lambda";
import "reflect-metadata";
import { CreateAccountController } from "src/controllers/createAccountController";
import "../containers/index";

export const handler = async (event: SQSEvent) => {
  console.log("EVENT", event);

  const createPortadorController = new CreateAccountController();
  const response = createPortadorController.handler(event);

  return response;
};
