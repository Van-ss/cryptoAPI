import axios from 'axios';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';

// Initialize SES and DynamoDB clients
const sesClient = new SESClient({ region: 'ap-southeast-2' });
const dynamoClient = DynamoDBDocumentClient.from(new DynamoDB({ region: 'ap-southeast-2' }));

export const lambdaHandler = async (event) => {
  try {
    const {crypto, email} = event.queryStringParameters || {};

    if (!crypto || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing crypto in request.' }),
      };
    }

    // Fetch the current crypto price
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?x_cg_api_key=CG-Nutcgchh8N7Gdv6uPf3d8qPm', {
      params: { ids: crypto, vs_currencies: 'usd' },
    });

    const price = response.data[crypto]?.usd;

    if (!price) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid crypto symbol or price not found.' }),
      };
    }

    const message = `The current price of ${crypto} is $${price} USD.`;

    // Send email using SES
    const sendEmailCommand = new SendEmailCommand({
      Source: 'vanshikalal815@gmail.com',
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: `Crypto Price: ${crypto}` },
        Body: { Text: { Data: message } },
      },
    });

    await sesClient.send(sendEmailCommand);

    // Store the search in DynamoDB
    const putCommand = new PutCommand({
      TableName: 'CryptoSearchHistory',
      Item: {
        id: `${Date.now()}-${crypto}`,
        email,
        crypto,
        timestamp: new Date().toISOString(),
      },
    });

    await dynamoClient.send(putCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully!', price }),
    };
  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
