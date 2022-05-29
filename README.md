
![alt_text](https://github.com/stelmastchuk/desafio-dev-api-rest-ServicePortador/blob/master/arquitetura.png)

Arquitetura :
A arquitetura foi desenvolvida pensando no uso de microservices com event Driven.


1- Service Portador - Responsabilidade: Criar o portador e notificar o ServiceAccount para criar uma account ao portador | Receber uma notificação do ServiceAccount para deletar o portador se a Account for excluida.


2- Service Account - Responsabilidade: Receber notificação do Service Portador para criar a account e executar as operações de transações (depositar,sacar,filtrar extrato, mostrar/deletar/desbloquear account) | Notificar a exclusão da account vinculada ao portador para o ServicePortador deletar o mesmo.



Tech Stack Utilizada: Serverless Framework, nodejs/typescript, odm-dynamoose, jest para teste unitarios, swagger para documentação.


AwsServices Utilizado: lambdaFunctions, dynamoDB, SNS, SQS , ApiGateway + CloudFront, CloudFormation, S3, terraform.


Pipeline: (não totalmente funcional) : jenkins, groovy, docker.


Observação: foram feito testes unitarios, para conferir basta olhar na pasta dos UseCases ou executar npm/yarn test || test-coverage 


Como Utilizar:

1- Crie o portador com um cpf valido, automaticamente uma account sera gerada.

2- Confirme se a conta do portador foi criado utilizando o cpf no getAccount.

3- Desbloquei a account pelo cpf para executar as operações

4- Crie uma operação de deposito ou saque, passando o cpf, valor, e o tipo da operação "deposit", "withdraw"

5- Obtenha o extrato da conta, durante o periodo desejado, Exemplo:  2022-05-29 - 2022-05-30 

6- Delete a account pelo cpf, automaticamente o portador sera deletado tb.


LINK DOCUMENTAÇÃO SWAGGER ( Para teste e melhor uso ) -> https://app.swaggerhub.com/apis-docs/VitorOrganization/DigitalBank/1.0.0#/




Qualquer dúvida estou a disposição!











 
