const admin = require('firebase-admin')
const chunks = require('array.chunk')

const db = admin.firestore()
const messaging = admin.messaging()

module.exports = async function sendMessage(message) {
  // userIds is considered as an optional parameter, so check if it exists and
  // execute a dedicated scenario if it is provided
  if (message.userIds && Array.isArray(message.userIds)) {
    // Use multiple queries to get all tokens owned by all userIds
    const promises = message.userIds.map(userId =>
      db
        .collection('push-tokens')
        .where('userId', '==', userId)
        .get()
    )
    // Wait for all queries to resolve
    const allSnapshots = await Promise.all(promises)
    // Get all document instances
    const unflattenedDocs = allSnapshots.map(snapshot => snapshot.docs)
    const pushTokens = unflattenedDocs.reduce((a, b) => a.concat(b), [])

    // Split the array of tokens in multiple arrays of 100 tokens, as Firebase
    // SDK accept a maximum number of 100 tokens per call
    const tokenChunks = chunks(pushTokens, 100)
    // Send multiple API calls to FCM with 100 target tokens each
    const sendPromises = tokenChunks.map(async tokens => {
      // Keep trace of token ids to eventually remove them later
      const tokenIds = tokens.map(tokenDoc => tokenDoc.id)
      const strippedTokens = tokens.map(t => t.data().token)
      const pushMessage = Object.assign(message, { tokens: strippedTokens })
      const response = await messaging.sendMulticast(pushMessage)
      // For each notification we check if there was an error.
      const tokensDelete = []
      response.responses.map((result, index) => {
        const { error } = result
        if (error) {
          // Cleanup the tokens who are not registered anymore.
          if (
            error.code === 'messaging/invalid-registration-token' ||
            error.code === 'messaging/registration-token-not-registered'
          ) {
            const deleteTask = admin
              .firestore()
              .collection('push-tokens')
              .doc(tokenIds[index])
              .delete()
            tokensDelete.push(deleteTask)
          }
        }
      })

      return Promise.all(tokensDelete)
    })

    await Promise.all(sendPromises)
  } else {
    await messaging.sendMulticast(message)
  }
}
