# Crypto Price Alert API

This project consists of two AWS Lambda-based microservices deployed using AWS SAM. It enables users to:

- Get the current price of a cryptocurrency via email.
- Retrieve their previous search history of crypto price checks.

---

## Microservices

### 1. EmailPriceFunction

**Purpose:** Fetch the current USD price of a given cryptocurrency and email it to the user.

#### Endpoint
GET https://c9fwy9r8k5.execute-api.ap-southeast-2.amazonaws.com/Prod/emailPrice

**Query Parameters:**

| Name   | Type   | Required | Description                   |
|--------|--------|----------|-------------------------------|
| crypto | string | ✅        | The cryptocurrency ID (e.g. `bitcoin`) |
| email  | string | ✅        | The recipient's email address |

The email address is static (vanshikalal815@gmail.com) as we are using sandbox SES

**Example:**
https://c9fwy9r8k5.execute-api.ap-southeast-2.amazonaws.com/Prod/emailPrice?crypto=bitcoin&email=vanshikalal815@gmail.com

### 2. GetSearchHistoryFunction

**Purpose:** Retrieve previous searches made by a specific user (email address).

#### Endpoint
GET https://c9fwy9r8k5.execute-api.ap-southeast-2.amazonaws.com/Prod/history

**Query Parameters:**

| Name   | Type   | Required | Description                   |
|--------|--------|----------|-------------------------------|
| email  | string | ✅        | The recipient's email address |

The email address is static (vanshikalal815@gmail.com) as we are using sandbox SES

**Example:**
https://c9fwy9r8k5.execute-api.ap-southeast-2.amazonaws.com/Prod/history?email=vanshikalal815@gmail.com

