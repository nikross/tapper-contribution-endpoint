import axios from 'axios'
import { nanoid } from 'nanoid'
import qs from 'qs'

// Get the merchant's Laterpay credentials
const { LATERPAY_CLIENT_ID, LATERPAY_CLIENT_SECRET } = process.env

const getAccessToken = async () => {
  const response = await axios({
    url: 'https://auth.laterpay.net/oauth2/token',
    method: 'post',
    headers: {
      Authorization: 'Basic ' + Buffer.from((LATERPAY_CLIENT_ID + ':' + LATERPAY_CLIENT_SECRET)).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
      grant_type: 'client_credentials',
      scope: 'read write'
    })
  })
  const { access_token = null } = response.data
  return access_token
}

const createTab = async ({ accessToken, amount, userName, userEmail }) => {
  let tabId = null
  await axios({
    url: 'https://tapi.laterpay.net/v1/purchase',
    method: 'post',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    data: {
      offering_id: 'bulletlink-contribution',
      metadata: {
        user_email: userEmail,
        user_name: userName
      },
      price: {
        amount,
        currency: 'USD'
      },
      payment_model: 'pay_now',
      sales_model: 'contribution',
      summary: 'Contribution',
      user_id: nanoid() // random ID
    }
  })
  .catch(error => {
    // The expected response has a status of 402 (Payment required)
    tabId = error.response?.data?.tab?.id
  })
  return tabId
}

const getPaymentIntent = async ({ accessToken, tabId }) => {
  const response = await axios({
    url: `https://tapi.laterpay.net/v1/payment/start/${tabId}`,
    method: 'get',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .catch(error => {
    console.log(error.resonse)
  })
  return response.data
}

export const startPayment = async ({ amount, userName, userEmail }) => {
  const accessToken = await getAccessToken()
  const tabId = await createTab({ accessToken, amount, userName, userEmail })
  const stripeCredentials = await getPaymentIntent({ accessToken, tabId })
  return stripeCredentials
}