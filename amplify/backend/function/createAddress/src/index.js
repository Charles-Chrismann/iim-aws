const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(client);

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    try {
        const body = JSON.parse(event.body);
        const addresses = Array.isArray(body) ? body : [body];

        if (addresses.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "No addresses provided." }),
            };
        }

        const userId = event.requestContext.authorizer?.claims?.sub || "anonymous";
        const savedAddresses = [];

        for (const address of addresses) {
            const { country, street, postalCode } = address;

            if (!country || !street || !postalCode) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: "Missing required fields in one of the addresses." }),
                };
            }

            const addressId = uuidv4();

            const command = new PutCommand({
                TableName: "addresses",
                Item: {
                    userId,
                    addressId,
                    country,
                    street,
                    postalCode,
                },
            });

            await ddbDocClient.send(command);
            savedAddresses.push({ addressId });
        }

        return {
            statusCode: 201,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
            body: JSON.stringify({
                message: "Addresses added successfully",
                addresses: savedAddresses,
            }),
        };

    } catch (error) {
        console.error("Error saving addresses:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to add addresses" }),
        };
    }
};


