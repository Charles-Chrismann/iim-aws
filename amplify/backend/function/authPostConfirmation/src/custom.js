const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

/**
 * @type {import('@types/aws-lambda').PostConfirmationTriggerHandler}
 */
exports.handler = async (event) => {
  console.log("EVENT: ", JSON.stringify(event));

  const { userAttributes } = event.request;

  // Set up the DynamoDB client
  const client = new DynamoDB({ region: "eu-west-1" });
  const ddbDocClient = DynamoDBDocumentClient.from(client);

  const user = {
    id: userAttributes.sub,
    name: userAttributes.name || '',
    lastname: userAttributes.family_name || '',
    birthdate: userAttributes.birthdate || '',
    email: userAttributes.email || '',
    phone: userAttributes.phone_number || '',
    nickname: userAttributes.nickname || '',
    createdAt: new Date().toISOString()
  };

  try {
    await ddbDocClient.send(new PutCommand({
      TableName: "users",
      Item: user
    }));
  } catch (err) {
    console.error("Error adding user to DynamoDB:", err);
  }

  return event;
};
