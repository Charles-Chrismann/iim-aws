const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = DynamoDBDocumentClient.from(new DynamoDBClient());

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log("PUT EVENT:", JSON.stringify(event));

    const userId = event.pathParameters?.userId;
    const addressId = event.pathParameters?.addressId;
    const body = JSON.parse(event.body || "{}");

    if (!userId || !addressId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing userId or addressId" }),
        };
    }

    try {
        await client.send(
            new UpdateCommand({
                TableName: "addresses",
                Key: { userId, addressId },
                UpdateExpression: "SET country = :country, street = :street, postalCode = :postalCode",
                ExpressionAttributeValues: {
                    ":country": body.country,
                    ":street": body.street,
                    ":postalCode": body.postalCode,
                },
            })
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Address updated successfully" }),
        };
    } catch (err) {
        console.error("Error updating address:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error updating address" }),
        };
    }
};
