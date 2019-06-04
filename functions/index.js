const admin = require('firebase-admin')
const functions = require('firebase-functions')

admin.initializeApp()

const { enqueueMessage, sendMessage } = require('./src')

exports.send = functions.https.onRequest(async (req, res) => {
  try {
    // Send the FCM message to users from userIds
    await enqueueMessage(req.body)
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

exports.sendMessage = functions.firestore
  .document('messages/{messageId}')
  .onCreate((snap, context) => sendMessage(snap.data(), snap))
