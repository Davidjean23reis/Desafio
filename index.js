const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const sqs = new SQSClient();
const {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} = require("@aws-sdk/client-dynamodb");
const dynamoDB = new DynamoDBClient();

const producer = async (event) => {
  let statusCode = 200;
  let message;

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "No body was found",
      }),
    };
  }

  try {
    await sqs.send(
      new SendMessageCommand({
        QueueUrl: process.env.QUEUE_URL,
        MessageBody: event.body,
        MessageAttributes: {
          AttributeName: {
            StringValue: "Attribute Value",
            DataType: "String",
          },
        },
      })
    );

    message = "Message accepted!";
  } catch (error) {
    console.log(error);
    message = error;
    statusCode = 500;
  }

  return {
    statusCode,
    body: JSON.stringify({
      message,
    }),
  };
};

const consumer = async (event) => {
  for (const record of event.Records) {
    try {
      const messageAttributes = record.messageAttributes;
      const messageBody = JSON.parse(record.body);

      const { id, amount, type } = messageBody;

      const params = {
        TableName: "Transaction",
        Item: {
          id: { S: id },
          amount: { S: amount.toString() },
          type: { S: type },
        },
      };

      await dynamoDB.send(new PutItemCommand(params));

      console.log("Mensagem salva no DynamoDB:", params);
    } catch (error) {
      console.error("Erro ao processar a mensagem:", error);
    }
  }
};

const getAll = async (event) => {
  try {
    const page =
      event.queryStringParameters && event.queryStringParameters.page
        ? parseInt(event.queryStringParameters.page, 10)
        : 1;
    const pageSize = 50;

    const startIdx = (page - 1) * pageSize;

    const scanParams = {
      TableName: "Transaction",
      Limit: pageSize,
      ExclusiveStartKey:
        startIdx > 0 ? { id: { S: startIdx.toString() } } : undefined,
    };

    const data = await dynamoDB.send(new ScanCommand(scanParams));

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Erro ao obter dados:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Erro ao obter dados.",
      }),
    };
  }
};
module.exports = {
  producer,
  consumer,
  getAll,
};
