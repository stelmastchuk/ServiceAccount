import aws from "aws-sdk";
import nodemailer from "nodemailer";
import HandlebarsMailTemplate from "./HandlebarsMailTemplate";
import mailConfig from "./mail";

interface IMailContact {
  name: string;
  email: string;
}

interface ITemplateVariable {
  [key: string]: string | number;
}

interface IParseMailTemplate {
  file: Buffer;
  variables: ITemplateVariable;
}

interface ISendMail {
  to: IMailContact;
  templateData: IParseMailTemplate;
  from?: IMailContact;
  subject: string;
}
export default class SESMail {
  static async sendMail({
    to,
    subject,
    templateData,
  }: ISendMail): Promise<void> {
    const mailTemplate = new HandlebarsMailTemplate();

    const transporter = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: "2010-12-01",
      }),
    });

    const { email, name } = mailConfig.defaults.from;

    await transporter.sendMail({
      from: {
        name: name,
        address: email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await mailTemplate.parse(templateData),
    });
  }
}
