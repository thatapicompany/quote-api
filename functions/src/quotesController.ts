import { Response } from 'express'
import { db } from './config/firebase'
import * as admin from 'firebase-admin'

const QUOTES_COLLECTION = "thequoteapi-quotes"

type QuoteType = {
  author: string,
  text: string,
  coverImageUrl: string
}

type Request = {
  body: QuoteType,
  params: { quoteId: string, category:string }
}


const addQuote = async (req: Request, res: Response) => {
const { author, text } = req.body
try {
    const entry = db.collection(QUOTES_COLLECTION).doc()
    const entryObject = {
    id: entry.id,
    author,
    text,
    }

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
  // 
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

  const { params: { quoteId, category } } = req

  console.log(quoteId, category )
    try {
        const allEntries = await db.collection(QUOTES_COLLECTION).get()

        const rData = allEntries.docs.map(doc => doc.data())

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