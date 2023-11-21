# Web RTC Web UI Demo
A simple react based Web UI that uses Twilio Voice SDK to place calls over the net

## Requirements
- A Twilio account
- Someone to call :)

## Twilio setup
1. Create an API Token and Secret to be used to mint end user tokens
2. In the Twilio console create a `TwimlApp`, point the URL to a Twilio Studio flow or TwiML document
3. Copy the Twilio App SID, you'll put this in the `.env` file

## Configuration
In the `serverless` folder create an `.env` file using the `.env.example`, populate the required values (from above)

## Deploy
Deploy the application to Twilio serverless
