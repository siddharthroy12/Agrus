const express = require('express')
const request = require('request')
const router = express.Router()

// Redirect request to https://api.imgur.com/3/image
// If uploading image, image should be in image form and url will be returned
// If uploading video, video should be in video form and a ticket will be returned
// Use https://imgur.com/upload/poll?client_id=546c25a59c58ad7&tickets[]={ticket here}
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

module.exports = router