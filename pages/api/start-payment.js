import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'
import { startPayment } from '../../lib/laterpay'

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow POST requests
    methods: ['POST'],
  })
)

export default async function handler(req, res) {
  // Run cors
  await cors(req, res)

  const { amount = 100, email, name } = req.body
  if (req.method !== 'POST' || !amount || !email) {
    res.status(400).json({
      error: 'Bad request'
    })
  } else {
    const { client_secret, publishable_key } = await startPayment({
      amount: amount,
      userEmail: email,
      userName: name
    })
    // Rest of the API logic
    res.json({
      client_secret,
      publishable_key
    })
  }
}
