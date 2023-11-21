// Imports global types
import "@twilio-labs/serverless-runtime-types";
// Fetches specific types
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
} from "@twilio-labs/serverless-runtime-types/types";
import { VoiceGrant } from "twilio/lib/jwt/AccessToken";

type MyContext = {
  ACCOUNT_SID: string;
  TWILIO_API_KEY: string;
  TWILIO_API_SECRET: string;
  TWIML_APP_SID: string;
};

type MyEvent = {
  identity: string;
};

const TOKEN_TTL_IN_SECONDS = 60 * 60 * 6;

export const handler: ServerlessFunctionSignature<MyContext, MyEvent> =
  async function (
    context: Context<MyContext>,
    event: MyEvent,
    callback: ServerlessCallback
  ) {
    console.log(">>> INCOMING TOKEN REQUEST >>>");
    console.log(event);

    const response = new Twilio.Response();
    // Set the CORS headers to allow Flex to make an error-free HTTP request
    // to this Function
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
    response.appendHeader("Content-Type", "application/json");

    if (!event.identity) {
      response.setBody({ error: "Identity not provided" });
      response.setStatusCode(400);
      console.error("Missing identity in request");
      callback(null, response);
    }

    const AccessToken = Twilio.jwt.AccessToken;

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: context.TWIML_APP_SID,
      incomingAllow: true,
    });

    const accessToken = new AccessToken(
      context.ACCOUNT_SID,
      context.TWILIO_API_KEY,
      context.TWILIO_API_SECRET,
      {
        identity: event.identity,
        ttl: TOKEN_TTL_IN_SECONDS,
      }
    );

    accessToken.addGrant(voiceGrant);
    accessToken.identity = event.identity;

    response.setBody({
      identity: event.identity,
      token: accessToken.toJwt(),
    });

    console.log(response);
    callback(null, response);
  };
