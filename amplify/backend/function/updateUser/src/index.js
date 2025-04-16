

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const client = new DynamoDB({ region: "eu-west-1" });
    const ddbDocClient = DynamoDBDocumentClient.from(client);
  
    const res = await ddbDocClient.send(
      new GetCommand({
        TableName: 'users-charles',
        Key: {
          id
        }
      })
    );

  return {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    },
    body: JSON.stringify('Hello from Lambda!'),
  };
};
