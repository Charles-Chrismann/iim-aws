const { ddbDocClient } = require('dynamo-client');

/**
 * @type {import('@types/aws-lambda').PostConfirmationTriggerHandler}
 */
exports.handler = async (event) => {
  console.log("EVENT: ", JSON.stringify(event));

  const { userAttributes } = event.request;

  // Set up the DynamoDB client

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
