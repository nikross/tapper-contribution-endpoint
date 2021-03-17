import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'

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

  // Rest of the API logic
  res.json({
    client_secret: 'pi_1DnXbp2eZvKYlo2Czed9qnYW_secret_3lcAu1nfO54uQUjWZ6gNNI7qn',
    publishable_key: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
  })
}
