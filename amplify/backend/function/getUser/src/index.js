const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const body = JSON.parse(event.body)

  const id = body.id

  console.log(id)

  try {
    const client = new DynamoDB({ region: "eu-west-1" });
    const ddbDocClient = DynamoDBDocumentClient.from(client);
  
    const res = await ddbDocClient.send(
      new GetCommand({
        TableName: 'users',
        Key: {
          id
        }
      })
    );
    const user = res.Item
    console.log(user)
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify(user),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify(e),
    };
  }
};
