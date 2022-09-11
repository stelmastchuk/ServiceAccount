import handlebars from "handlebars";

interface ITemplateVariable {
  [key: string]: string | number;
}

interface IParseMailTemplate {
  file: Buffer;
  variables: ITemplateVariable;
}
export default class HandlebarsMailTemplate {
  async parse({ file, variables }: IParseMailTemplate): Promise<string> {
    const templateFileContent = file.toString("utf-8");
    console.log("teste", templateFileContent);
    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}
