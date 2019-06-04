const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

const { send } = require('./src')

exports.send = functions.https.onRequest(async (req, res) => {
  try {
    // Send the FCM message to users from userIds
    await send(req.body)
    // Respond with a successful status
    res.status(200).json({ ok: true })
  } catch (error) {
    // Log error to console for debugging
    console.error(error)
    // Respond with an error status and some details
    res
      .status(500)
      .json({ ok: false, error: error.name, message: error.message })
  }
})
