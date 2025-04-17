const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const client = DynamoDBDocumentClient.from(new DynamoDBClient());

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log("DELETE EVENT:", JSON.stringify(event));

    const userId = event.pathParameters?.userId;
    const addressId = event.pathParameters?.addressId;

    if (!userId || !addressId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing userId or addressId" }),
        };
    }

    try {
        await client.send(
            new DeleteCommand({
                TableName: "addresses",
                Key: { userId, addressId },
            })
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Address deleted successfully" }),
        };
    } catch (err) {
        console.error("Error deleting address:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error deleting address" }),
        };
    }
};
