const { putUser } = require('/opt/dynamoClient');

/**
 * @type {import('@types/aws-lambda').PostConfirmationTriggerHandler}
 */
exports.handler = async (event) => {
  console.log("EVENT: ", JSON.stringify(event));

  const { userAttributes } = event.request;

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
    await putUser(user);
  } catch (err) {
    console.error("Error adding user to DynamoDB:", err);
  }

  return event;
};
