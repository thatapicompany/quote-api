import * as functions from 'firebase-functions'
import * as express from 'express'
import { addQuote,getAllQuotes, updateQuote, deleteQuote ,getRandomQuote } from './quotesController'

import { admin } from './config/firebase'
import TheAuthAPI from 'theauthapi'

const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const app =  express();


const THE_AUTH_API_KEY = process.env.THE_AUTH_API_KEY || "1234";
const auth = new TheAuthAPI(THE_AUTH_API_KEY);

const apiKeyAuth = async(req:any, res:any, next:any) => {
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

const isAuthenticated = (req:any, res:any, next:any) => {
    if(! req.user ) {
        res.status(403).send('Unauthorized User');
        return;
    }
    next();
}
// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = async (req:any, res:any, next:any) => {

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
      !(req.cookies && req.cookies.__session)) {
    /*functions.logger.error(
      'No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.'
    );*/
    //res.status(403).send('Unauthorized');
    next()
    return;
  }

  functions.logger.log('Check if request is authorized with Firebase ID token');
  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    functions.logger.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if(req.cookies) {
    functions.logger.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send('Unauthorized');
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    functions.logger.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch (error) {
    functions.logger.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
    return;
  }
  next();
};

app.use(cors);
app.use(cookieParser);

app.use(apiKeyAuth);
app.use(validateFirebaseIdToken);
app.use(isAuthenticated);

app.get('/', (req:any, res:any) => res.status(200).send(`The Quote API (v${process.env.npm_package_version}), another fine product from ThatAPICompany.`));
app.post('/quotes', addQuote)
app.get('/quotes', getAllQuotes)
app.get('/quotes/random', getRandomQuote)
app.patch('/quotes/:quoteId', updateQuote)
app.delete('/quotes/:quoteId', deleteQuote)

exports.QuoteAPI = functions.https.onRequest(app)