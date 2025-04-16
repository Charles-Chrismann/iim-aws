const { DynamoDBClient, ListTablesCommand } = require("@aws-sdk/client-dynamodb");
const {
  PutCommand,
  GetCommand,
  PostCommand,
  DynamoDBDocumentClient
} = require("@aws-sdk/lib-dynamodb");


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const client = new DynamoDBClient({ region: "eu-west-1" });
    const ddbDocClient = DynamoDBDocumentClient.from(client);

    // Ajouter une entrée 
    await ddbDocClient.send(new PutCommand({
      TableName: "users-charles",
      Item: {
        id: "123",
        name: "Alice",
        age: 30
      }
    }));

    // try {
    //   const command = new ListTablesCommand({});
    //   const response = await client.send(command);
    //   console.log("Tables:", response.TableNames);
    // } catch (err) {
    //   console.error("Erreur lors du listing des tables :", err.message);
    // }

    console.log('DONE !')

    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-  -Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
        body: JSON.stringify({h: "w"}),
    };
};
