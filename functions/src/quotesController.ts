import { Response } from 'express'
import { db } from './config/firebase'
import * as admin from 'firebase-admin'
import { IAuthenticatedUser } from '.'
//import { collection, query, orderBy, startAfter, limit, getDocs } from "firebase/firestore";  

const QUOTES_COLLECTION = "thequoteapi-quotes"
const ROOT_ACCOUNT_ID="1"

type QuoteType = {
  author: string,
  text: string,
  coverImageUrl: string
  category?: string
}

type Request = {
  body: QuoteType,
  params: { quoteId: string, category:string, author:string, text:string }
}


const addQuote = async (req: Request, res: Response) => {

  const user = res.locals.user as IAuthenticatedUser;
  const accountId = user.accountId;

  const { author, text,category } = req.body

  console.log(`addQuote category author: ${author} | t: ${text} uid: ${user.accountId}` )

  try {
    const entry = db.collection(QUOTES_COLLECTION).doc()
    let entryObject:any = {
      id: entry.id,
      author,
      text,
      accountId,
      createdAt: admin.firestore.Timestamp.now()
    }
    if(category)entryObject.category = category

    await entry.set(entryObject)

    res.status(200).send({
    status: 'success',
    message: 'Quote added successfully',
    data: entryObject
    })
} catch(error) {
    res.status(500).json(error.message)
}
}


const getRandomQuote = async (req: Request, res: Response) => {

  console.log(`getRandomQuote category ${req.params.category || "any"}` )
  
  const { params: { category } } = req
  console.log( category )

  //var db = admin.firestore();
const quotes = db.collection(QUOTES_COLLECTION);

const key = quotes.doc().id;

quotes.where(admin.firestore.FieldPath.documentId(), '>=', key).limit(1).get()
.then(snapshot => {
    if(snapshot.size > 0) {
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            return res.status(200).json(doc.data())
        });
    }
    else {
      quotes.where(admin.firestore.FieldPath.documentId(), '<', key).limit(1).get()
        .then(snapshot2 => {
            snapshot2.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                return res.status(200).json(doc.data())
            });
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
    }
})
.catch(err => {
    console.log('Error getting documents', err);
});

/*
    try {
        const allEntries = await db.collection(QUOTES_COLLECTION).get()

        const rData = allEntries.docs.map(doc => doc.data())

        return res.status(200).json(rData)
    } catch(error) { return res.status(500).json(error.message) }*/
}

const getAllQuotes = async (req: Request, res: Response) => {

  const user = res.locals.user as IAuthenticatedUser;
  const accountId = user.accountId;

  let  { quoteId, category, author, text ,orderBy, startAfter,page, limit}  = req.params as any

  if(limit > 10 || limit < 1) limit = 10
  if(!page) page = 0
  console.log(`getAllQuotes filter by ${JSON.stringify(req.params)}` )
  
    try {
      
      const first = db.collection(QUOTES_COLLECTION)
    .orderBy('createdAt')
    .limit(page * limit);

    if(author)first.where('author', '==', author)
    if(text)first.where('author', '==', text)
    if(category)first.where('category', '==', category)
  
  const snapshot = await first.get();
  
  // Get the last document
  const last = snapshot.docs[snapshot.docs.length - 1];
  
  // Construct a new query starting at this document.
  // Note: this will not have the desired effect if multiple
  // cities have the exact same population value.
  const next = db.collection(QUOTES_COLLECTION)
    .orderBy('createdAt')
    .startAfter(last.data().createdAt)
    .limit(limit);
  
  // Use the query for pagination
  // .
        // @ts-ignore
        const rData = next.docs.map(doc => doc.data())

        return res.status(200).json(rData)

    } catch(error) { return res.status(500).json(error.message) }
}
  

const updateQuote = async (req: Request, res: Response) => {
    const { body: { text, author }, params: { quoteId } } = req
  
    try {
      const entry = db.collection(QUOTES_COLLECTION).doc(quoteId)
      const currentData = (await entry.get()).data() || {}
      const entryObject = {
        author: author || currentData.author,
        text: text || currentData.text,
      }
  
      await entry.set(entryObject).catch(error => {
        return res.status(400).json({
          status: 'error',
          message: error.message
        })
      })
  
      return res.status(200).json({
        status: 'success',
        message: 'entry updated successfully',
        data: entryObject
      })
    }
    catch(error) { return res.status(500).json(error.message) }
}

const deleteQuote = async (req: Request, res: Response) => {
    const { quoteId } = req.params
  
    try {
      const entry = db.collection(QUOTES_COLLECTION).doc(quoteId)
  
      await entry.delete().catch(error => {
        return res.status(400).json({
          status: 'error',
          message: error.message
        })
      })
  
      return res.status(200).json({
        status: 'success',
        message: 'entry deleted successfully',
      })
    }
    catch(error) { return res.status(500).json(error.message) }
  }


export { addQuote,getAllQuotes, updateQuote, deleteQuote,getRandomQuote }