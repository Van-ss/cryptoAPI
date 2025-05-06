import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  ScanCommand
} from '@aws-sdk/lib-dynamodb';

const REGION = 'ap-southeast-2';
const client = new DynamoDBClient({ region: REGION });
const ddb = DynamoDBDocumentClient.from(client);

export const lambdaHandler = async (event) => {
  try {
    const queryParams = event.queryStringParameters || {};
    const email = queryParams.email;

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing email query parameter.' }),
      };
    }

    const params = {
        TableName: 'CryptoSearchHistory',
        FilterExpression: 'email = :e',
        ExpressionAttributeValues: {
          ':e': email,
        },
      };
      
      const result = await ddb.send(new ScanCommand(params));
      const filteredHistory = (result.Items || []).map(({ id, email, ...rest }) => rest);

    return {
      statusCode: 200,
      body: JSON.stringify({ history: filteredHistory }),
    };
  } catch (err) {
    console.error('Error fetching history:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve search history.' }),
    };
  }
};
