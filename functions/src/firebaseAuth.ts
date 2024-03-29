import * as functions from 'firebase-functions'
import { admin } from './config/firebase'

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

const getFirebaseUserByEmail = async (email:string) => {

    const userRecord = await admin.auth().getUserByEmail(email);
    return userRecord;
}

const signupUserByEmail = async (email:string, password:string) => {
  console.log("signupUserByEmail", email, password)
    const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
        emailVerified: true,
        disabled: false
    });
    return userRecord;
}

export { signupUserByEmail, validateFirebaseIdToken,getFirebaseUserByEmail }