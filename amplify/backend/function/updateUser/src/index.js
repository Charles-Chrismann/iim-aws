const { DynamoDB, DynamoDBClient, ListTablesCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand, GetCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const AWS = require('aws-sdk');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const documentClient = new AWS.DynamoDB.DocumentClient();

  const { id, ...fieldsToUpdate } = JSON.parse(event.body);

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing 'id' in event" }),
    };
  }

  // Génère dynamiquement les expressions pour l'update
  const updateExpressions = [];
  const expressionAttributeValues = {};
  const expressionAttributeNames = {};

  for (const key in fieldsToUpdate) {
    updateExpressions.push(`#${key} = :${key}`);
    expressionAttributeValues[`:${key}`] = fieldsToUpdate[key];
    expressionAttributeNames[`#${key}`] = key;
  }

  const updateExpression = `SET ${updateExpressions.join(", ")}`;

  const params = {
    TableName: "users",
    Key: { id },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "UPDATED_NEW",
  };

  let data;
  try {
    data = await documentClient.update(params).promise();
  } catch (error) {
    console.error("Update error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update item", details: error.message }),
    };
  }

  return {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    },
    body: JSON.stringify(data),
  };
};