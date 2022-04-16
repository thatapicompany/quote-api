import { Response } from 'express'
//import { IAuthenticatedUser } from '.'
import {
  //addQuote,
  getAllQuotes//, updateQuote, deleteQuote 
  ,getRandomQuote} from './quotesService.local'

const handleAddQuote = async (req: Request, res: Response) => {

  res.status(501).send({ })

}
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

export interface IQuote {
  author:string;
  text:string
}


const handleGetRandomQuote = async (req: Request, res: Response) => {
  console.log("handleGetRandomQuote")

    const randomQuote = await getRandomQuote()
    res.status(200).send(randomQuote)
}

const handleGetAllQuotes = async (req: Request, res: Response) => {
  console.log("handleGetAllQuotes")
    try{
      const quotes = await getAllQuotes()

      return res.status(200).json(quotes)

    } catch(error) { return res.status(500).json(error.message) }
}
  

const handleUpdateQuote = async (req: Request, res: Response) => {
  res.status(501).send({ })
}

const handleDeleteQuote = async (req: Request, res: Response) => {
  res.status(501).send({ })

  }


export { handleAddQuote,handleGetAllQuotes, handleUpdateQuote, handleDeleteQuote,handleGetRandomQuote }