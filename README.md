<!--  
title: 'Framework Serverless Node SQS Produtor-Consumidor na AWS'  
description: 'Este modelo demonstra como desenvolver e implantar um serviço simples de produtor-consumidor baseado em SQS executando no AWS Lambda usando o Framework Serverless tradicional.'  
layout: Doc  
framework: v3  
platform: AWS  
language: nodeJS  
priority: 1  
authorLink: 'https://github.com/serverless'  
authorName: 'Serverless, Inc.'  
authorAvatar: 'https://avatars1.githubusercontent.com/u/13742415?s=200&v=4'  
-->  

# Framework Serverless Node SQS Produtor-Consumidor na AWS  

Este modelo demonstra como desenvolver e implantar um serviço simples de produtor-consumidor baseado em SQS executando no AWS Lambda usando o Framework Serverless e o plugin [Lift](https://github.com/getlift/lift). Ele permite aceitar mensagens cujo processamento pode ser intensivo em tempo ou recursos e transferir esse processamento para um processo assíncrono em segundo plano, tornando o sistema mais rápido e resiliente.  

## Estrutura do modelo  

Este modelo define uma função `producer` e uma construção Lift - `jobs`. A função `producer` é acionada por um evento do tipo `http`, aceita payloads JSON e os envia para uma fila SQS para processamento assíncrono. A fila SQS é criada pela construção `jobs` do plugin Lift. A fila é configurada com uma "fila de mensagens mortas" (para armazenar mensagens com falha) e uma função Lambda `worker` que processa as mensagens da SQS.  

Para saber mais:  

- Sobre as opções de configuração do evento `http`, consulte a [documentação do evento http](https://www.serverless.com/framework/docs/providers/aws/events/apigateway/)  
- Sobre a construção `queue`, consulte a [documentação da `queue` no Lift](https://github.com/getlift/lift/blob/master/docs/queue.md)  
- Sobre o plugin Lift em geral, consulte o [projeto Lift](https://github.com/getlift/lift)  
- Sobre o processamento SQS com AWS Lambda, consulte a [documentação oficial da AWS](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html)  

### Implantacão  

Instale as dependências com:  

```bash
npm install
```  

Depois, implante o serviço:  

```bash
serverless deploy
```  

Após a execução da implantação, você verá uma saída semelhante a:  

```bash
Implantando aws-node-sqs-worker-project no estágio dev (us-east-1)

✔ Serviço implantado na stack aws-node-sqs-worker-project-dev (175s)

endpoint: POST - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/produce
functions:
  producer: aws-node-sqs-worker-project-dev-producer (167 kB)
  jobsWorker: aws-node-sqs-worker-project-dev-jobsWorker (167 kB)
jobs: https://sqs.us-east-1.amazonaws.com/000000000000/aws-node-sqs-worker-project-dev-jobs
```  

_Nota_: Na forma atual, após a implantação, sua API é pública e pode ser acessada por qualquer pessoa. Para implantações em produção, você pode querer configurar um autorizador. Para mais detalhes sobre como fazer isso, consulte a [documentação do evento http](https://www.serverless.com/framework/docs/providers/aws/events/apigateway/).  

### Invocação  

Após a implantação bem-sucedida, agora você pode chamar o endpoint da API criado com uma solicitação `POST` para acionar a função `producer`:  

```bash
curl --request POST 'https://xxxxxx.execute-api.us-east-1.amazonaws.com/produce' --header 'Content-Type: application/json' --data-raw '{"name": "John"}'
```  

Como resposta, você verá uma saída semelhante a:  

```bash
{"message": "Mensagem aceita!"}
```

