import { IAccountRepository } from "@repositories/Repository/IAccountRepository";
import { Account } from "src/entities/Account";
import { inject, injectable } from "tsyringe";
import SESMail from "src/email/SesMail";
import aws from "aws-sdk";

@injectable()
class AccountCreateUseCase {
  constructor(
    @inject("AccountRepository")
    private accountRepository: IAccountRepository
  ) {}

  async execute(
    cpf: string,
    issuerId: string,
    email: string,
    name: string
  ): Promise<Account> {
    const account = await this.accountRepository.create({
      cpf: cpf,
      issuerId: issuerId,
    });

    if (account) {
      await this.sendEmailWelcome(email, name);
    }

    return account;
  }

  private async sendEmailWelcome(email: string, name: string): Promise<void> {
    const s3 = new aws.S3({ region: "us-east-2" });

    const options = {
      Bucket: "templateemailbanking",
      Key: "forgot_password.hbs",
    };

    const arquivo = (await s3.getObject(options).promise()).Body as Buffer;

    try {
      await SESMail.sendMail({
        to: {
          name: name,
          email: email,
        },
        subject: "[Digital Bank] Conta criado com Sucesso! Bem Vindo(a)!",
        templateData: {
          file: arquivo,
          variables: {
            name: name,
          },
        },
      });
    } catch (error) {
      console.log(error);
      console.log("Email não enviado!");
    }
  }
}

export { AccountCreateUseCase };
