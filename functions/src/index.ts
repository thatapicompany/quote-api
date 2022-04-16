import * as functions from 'firebase-functions'
import * as express from 'express'
import { addQuote,getAllQuotes, updateQuote, deleteQuote ,getRandomQuote } from './quotesController'
import { v4 as uuidv4 } from 'uuid';
import { signupUserByEmail, getFirebaseUserByEmail } from './firebaseAuth'

const THE_AUTH_API_KEY=process.env.THE_AUTH_API_KEY||"1234"
const THE_AUTH_API_PROJECT_ID =process.env.THE_AUTH_API_PROJECT_ID||""

const SENDGRID_KEY =process.env.SENDGRID_KEY||""

//const NETLIFY_API_KEY = process.env.NETLIFY_API_KEY || "";
//const NETLIFY_SITE_ID=process.env.NETLIFY_SITE_ID||""

//const axios = require('axios');
const multer  = require('multer');
// @ts-ignore

const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const app =  express();

app.use(cors);
app.use(cookieParser);

const isAuthenticated = (req:any, res:any, next:any) => {
  if(! req.user ) {
      res.status(403).send('Unauthorized User');
      return;
  }
  next();
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

 import TheAuthAPI from 'theauthapi'

 const auth = new TheAuthAPI(THE_AUTH_API_KEY);
 
 const apiKeyAuthMiddleware = async(req:any, res:any, next:any) => {
     const key:string = req.header('x-api-key') || req.header('api_key');//.apiKey;
 
     if(key) {
 
       try{
         console.log(`Verifying x-api-key with TheAuthAPI.com: ${key}`)
         const authedKey:any = await auth.authenticateAPIKey(key);
 
         if(authedKey)
         {
           console.log(`Verified as ${JSON.stringify(authedKey)}`)
 
           req.user = {
           ...authedKey, 
           accountId: authedKey.customAccountId, 
           userId: authedKey.customUserId, 
           type:"API_KEY_LIB" };
 
         }else{
 
           console.log(`Invalid key: ${key}`)
           
           return res.status(401).json({
             status: 'error',
             message: 'Invalid API Key'
           })
         }
 
       }catch(err){
         
         console.log(err.message)
         return res.status(401).json({
             status: 'error',
             message: 'Invalid API Key'
         })
       }
     }
     next();
 }
 
const sendUserNewKey = async(user:any) => {
  // create a new api key with the user id as the key
  const apiKey = await auth.apiKeys.createKey({
    projectId: THE_AUTH_API_PROJECT_ID,
    customAccountId: user.uid,
    name:"API Key for " + user.displayName
  });
  //send them the welcome email via sendgrid
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(SENDGRID_KEY);
  const msg = {
    to: user.email,
    from: 'keys@thequoteapi.com',
    subject: 'Welcome to The Quote API',
    text: `Your API Key is: ${apiKey.key}. If you need to change it just reply to this email.`,
    html: `<strong>Your API Key is: ${apiKey.key}</strong>. If you need to change it just reply to this email.`
  };
  sgMail.send(msg);

}

app.use(apiKeyAuthMiddleware);

app.use(isAuthenticated);

//root
app.get('/', (req:any, res:any) => res.status(200).send(`The Quote API (v${process.env.npm_package_version}), another fine product from ThatAPICompany.`));

app.post('/signup', async(req:any, res:any) =>{
  
  try{
    const user = await getFirebaseUserByEmail(req.body.email);
    if(user) {
      //get existing key from the Auth API
      const existingKeys = await auth.apiKeys.getKeys(THE_AUTH_API_PROJECT_ID);
      const existingKey = existingKeys.find(key => key.customAccountId === user.uid);
      //create new key, send email with key
      if(existingKey) {
        console.log(`Deactivating existing key: ${existingKey.key}`);
        await auth.apiKeys.deleteKey(existingKey.key);
      }
        
      await sendUserNewKey(user);
    }
  }catch(err){
    console.log(err.message)
    return res.status(500).json({
      status: 'error',
      message: err.message
    })
  } 

  try{
    await signupUserByEmail(req.body.email, uuidv4())
    res.status(200).send("User created")
  }catch(error)
  {
    console.log(error)
    res.status(500).send(error)
  }

})
//Quote related endpoints
app.post('/quotes', addQuote)
app.get('/quotes', getAllQuotes)
app.get('/quotes/random', getRandomQuote)
app.patch('/quotes/:quoteId', updateQuote)
app.delete('/quotes/:quoteId', deleteQuote)

const upload = multer();
app.post('/receive-email', upload.none(), async(req, res) => {
  const body = req.body;

  console.log(`From: ${body.from}`);
  console.log(`To: ${body.to}`);
  console.log(`Subject: ${body.subject}`);
  console.log(`Text: ${body.text}`);

  //lookup user from email, get any existing keys using that ID, deactivate them
  const user = await getFirebaseUserByEmail(body.from);

  //get existing key from the Auth API
  const existingKeys = await auth.apiKeys.getKeys(THE_AUTH_API_PROJECT_ID);
  const existingKey = existingKeys.find(key => key.customAccountId === user.uid);
  //create new key, send email with key
  if(existingKey) {
    console.log(`Deactivating existing key: ${existingKey.key}`);
    await auth.apiKeys.deleteKey(existingKey.key);
  }
    
  await sendUserNewKey(user);

  return res.status(200).send();
});

exports.QuoteAPI = functions.https.onRequest(app)

// when a new user signs up, then we create then a key and email it to them
exports.sendWelcomeEmailWithAPIKey = functions.auth.user().onCreate(async(user) => {
  console.log("User has signed up",user)
  await sendUserNewKey(user);
})

/*const updateNetlifyDemoKey = async(demoKey:string) => {
//https://github.com/netlify/js-client
  const netlify = new NetlifyAPI(NETLIFY_API_KEY);
  await netlify.updateSite({build_settings:{env:{ DEMO_KEY: demoKey}}}, NETLIFY_SITE_ID);
  const key = await netlify.createDeployKey({
    site_id: NETLIFY_SITE_ID
  });
  console.log(`Created new demo key: ${key.key}`);

}*/


// rotate demo key
exports.rotateDemoKey = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  
  console.log('This will be run every 24 hours');

  // create new key which will auto expire in 48 hours
  await auth.apiKeys.createKey({
    name:"Demo Key",
    projectId: THE_AUTH_API_PROJECT_ID,
    customAccountId: "demo",
  });
  // update env var in Netlify
  //await updateNetlifyDemoKey(demoKey.key);
  
});

/*
exports.scheduledFunction = functions.pubsub.schedule('every 7 days').onRun((context) => {
  
  console.log('This will be run every 7 days');

  // send the user an email with their usage


  return null;
});*/
