const express = require('express')
const request = require('request')
const asyncHandler = require('express-async-handler')
const axios = require('axios')
const router = express.Router()

// Redirect request to https://api.imgur.com/3/image
// If uploading image, image should be in image form and url will be returned
// If uploading video, video should be in video form and a ticket will be returned
// Use https://imgur.com/upload/poll?tickets[]={ticket here}
// the id will in be res.data.done.{ticket here}
// the final link will be i.imgur.com/{id}

router.post('/', (req ,res, next) => {
	req.headers['Authorization'] = `Client-ID ${process.env.IMGUR_CLIENT_ID}`
	req.headers['Content-Type'] = 'multipart/form-data'
  const forwardReqConfig = {
    url: 'https://api.imgur.com/3/image',
  }
  req.pipe(request.post(forwardReqConfig)).pipe(res)
})

router.get('/poll', asyncHandler(async (req, res, next) => {
  const { ticket } = req.query

  if (!ticket) {
    res.status(400)
    throw new Error('Where is the ticket?')
  }

  try {
    const { data } = await axios.get(`https://imgur.com/upload/poll?tickets[]=${ticket}`)

    const finalLink = `https://i.imgur.com/${data.data.done[ticket]}${data.data.images[data.data.done[ticket]].ext}`
    
    res.status(200)

    res.json({link: finalLink})

  } catch (error) {
    res.status(500)
    throw new Error('Unknown error')
  }
}))

module.exports = router