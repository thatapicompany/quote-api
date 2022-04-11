import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { readFileSync } from 'fs';
import * as path from 'path';

export function readBaseJsonFile(fileName: string) {
  const filePath = path.resolve(process.cwd(), `${fileName}.json`);
  const fileContent = readFileSync(filePath).toString();

  return JSON.parse(fileContent);
}/*
try{
  const serviceAccount = readBaseJsonFile('../creds/firebase-creds')

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://thatapiplatform.firebaseio.com'
  })
}catch(err){
*/
  admin.initializeApp({
    credential: admin.credential.cert({
      privateKey: functions.config().private.key.replace(/\\n/g, '\n'),
      projectId: functions.config().project.id,
      clientEmail: functions.config().client.email
    }),
    databaseURL: 'https://thatapiplatform.firebaseio.com'
  })/*
  

  console.log(err)
}
*/

const db = admin.firestore()
export { admin, db }