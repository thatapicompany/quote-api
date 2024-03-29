import * as functions from "firebase-functions";
import * as express from "express";
import {
  handleAddQuote,
  handleGetAllQuotes,
  handleUpdateQuote,
  handleDeleteQuote,
  handleGetRandomQuote,
} from "./quotesController";
import { v4 as uuidv4 } from "uuid";
import { signupUserByEmail, getFirebaseUserByEmail } from "./firebaseAuth";

const THE_AUTH_API_KEY = process.env.THE_AUTH_API_KEY || "1234";
const THE_AUTH_API_PROJECT_ID = process.env.THE_AUTH_API_PROJECT_ID || "";

const SENDGRID_KEY = process.env.SENDGRID_KEY || "";

// @ts-ignore

const cookieParser = require("cookie-parser")();
const cors = require("cors")({ origin: true });
const app = express();

app.use(cors);
app.use(cookieParser);

const isAuthenticated = (req: any, res: any, next: any) => {
  console.log("isAuthenticated", req.path, req.method);
  if (!res.locals.user && !["/api/signup", "/api/"].includes(req.path)) {
    res.status(403).send("Unauthorized User");
    return;
  }
  next();
};

export interface IAuthenticatedUser {
  accountId: string;
  isDemo?: boolean;
}

/**
 *
 * Benefits of using The Auth API
 * - you no longer need to worry about the security of your API keys
 * - you can use the Auth API to verify the validity of your API keys
 * - you nolonger need to store them in your database
 * - rate limit requests by API Key and User
 * - provide secure access without User logging in
 * - let users rotate keys
 *
 * - monitor usage by User and Key
 * - securely rotate demo key
 * - get webhooks based on usage
 * - audit log of actions
 *
 */

import TheAuthAPI from "theauthapi";

const auth = new TheAuthAPI(THE_AUTH_API_KEY);

const apiKeyAuthMiddleware = async (req: any, res: any, next: any) => {
  const key: string = req.header("x-api-key") || req.header("api_key"); //.apiKey;

  if (key) {
    try {
      console.log(`Verifying x-api-key with TheAuthAPI.com: ${key}`);
      const authedKey: any = await auth.authenticateAPIKey(key);

      if (authedKey) {
        console.log(`Verified as ${JSON.stringify(authedKey)}`);

        res.locals.user = { accountId: authedKey.customAccountId };

        if (authedKey.customMetadata.isDemo === "demo") {
          res.locals.user.isDemo = true;
        }
      } else {
        console.log(`Invalid key: ${key}`);

        return res.status(401).json({
          status: "error",
          message: "Invalid API Key",
        });
      }
    } catch (err) {
      console.log(err.message);
      return res.status(401).json({
        status: "error",
        message: "Invalid API Key",
      });
    }
  }
  next();
};

const sendUserNewKey = async (user: any) => {
  // create a new api key with the user id as the key
  const apiKey = await auth.apiKeys.createKey({
    projectId: THE_AUTH_API_PROJECT_ID,
    customAccountId: user.uid,
    name: "API Key for " + user.displayName,
  });
  //send them the welcome email via sendgrid
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(SENDGRID_KEY);
  const msg = {
    to: user.email,
    from: "keys@thequoteapi.com",
    subject: "Welcome to The Quote API",
    text: `Your API Key is: ${apiKey.key}. If you need to change it just reply to this email.`,
    html: `<strong>Your API Key is: ${apiKey.key}</strong>. If you need to change it just reply to this email.`,
  };
  sgMail.send(msg);
};

const signupOrRotate = async (req: any, res: any) => {
  console.log(`Signup ${req.query.email}`);

  const email = req.body.email || req.query.email;

  try {
    const user = await getFirebaseUserByEmail(email);
    if (user) {
      //get existing key from the Auth API
      const existingKeys = await auth.apiKeys.getKeys(THE_AUTH_API_PROJECT_ID);
      const existingKey = existingKeys.find(
        (key) => key.customAccountId === user.uid
      );
      //create new key, send email with key
      if (existingKey) {
        console.log(`Deactivating existing key: ${existingKey.key}`);
        await auth.apiKeys.deleteKey(existingKey.key);
      }

      // add test for number of existing keys that have been used

      await sendUserNewKey(user);
      res.status(200).send("New Key sent to User");
      return;
    }
  } catch (err) {
    console.log(err.message);
  }

  try {
    await signupUserByEmail(email, uuidv4());
    res.status(200).send("User created");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
app.use(apiKeyAuthMiddleware);

app.use(isAuthenticated);

var router = express.Router();

//root
router.get("/", (req: any, res: any) =>
  res
    .status(200)
    .send(`The Quote API, another fine product from ThatAPICompany.`)
);

router.post("/signup-rotate", signupOrRotate);
//Quote related endpoints
router.post("/quotes", handleAddQuote);
router.get("/quotes", handleGetAllQuotes);
router.get("/quotes/random", handleGetRandomQuote);
router.patch("/quotes/:quoteId", handleUpdateQuote);
router.delete("/quotes/:quoteId", handleDeleteQuote);

app.use("/api/", router);
exports.APIFunctions = functions.https.onRequest(app);

// when a new user signs up, then we create then a key and email it to them
exports.sendWelcomeEmailWithAPIKey = functions.auth
  .user()
  .onCreate(async (user) => {
    console.log("User has signed up", user);
    await sendUserNewKey(user);
  });
