const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");

const client = DynamoDBDocumentClient.from(new DynamoDBClient());

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log("EVENT:", JSON.stringify(event));

    const userId = event.pathParameters?.userId;

    if (!userId) {
        return {
            statusCode: 400,
            headers: corsHeaders(),
            body: JSON.stringify({ message: "Missing userId in path parameters" }),
        };
    }

    try {
        const result = await client.send(
            new QueryCommand({
                TableName: "addresses",
                KeyConditionExpression: "userId = :uid",
                ExpressionAttributeValues: {
                    ":uid": userId,
                },
            })
        );

        console.log("Query result:", result);

        const addresses = (result.Items ?? []).map((item) => ({
            addressId: item.addressId,
            country: item.country,
            street: item.street,
            postalCode: item.postalCode,
        }));

        return {
            statusCode: 200,
            headers: corsHeaders(),
            body: JSON.stringify(addresses),
        };
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return {
            statusCode: 500,
            headers: corsHeaders(),
            body: JSON.stringify({ message: "Error fetching addresses" }),
        };
    }
};

function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
    };
}