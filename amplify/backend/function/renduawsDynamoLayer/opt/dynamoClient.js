// opt/dynamoClient.js

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");

const REGION = process.env.AWS_REGION || "eu-west-1";

const client = new DynamoDBClient({ region: REGION });
const ddbDocClient = DynamoDBDocumentClient.from(client);

const USERS_TABLE = process.env.USERS_TABLE || 'users';

const putUser = async (user) => {
  try {
    await ddbDocClient.send(new PutCommand({
      TableName: USERS_TABLE,
      Item: user
    }));
  } catch (err) {
    console.error("Error in putUser:", err);
    throw err;
  }
};

const getUser = async (id) => {
  try {
    const result = await ddbDocClient.send(new GetCommand({
      TableName: USERS_TABLE,
      Key: { id }
    }));
    return result.Item;
  } catch (err) {
    
    console.error("Error in getUser:", err);
    throw err;
  }
};

module.exports = {
  putUser,
  getUser,
};
