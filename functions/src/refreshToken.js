const admin = require('firebase-admin')
const isString = require('is-string')

const db = admin.firestore()
const messaging = admin.messaging()

module.exports = async function refreshToken({ token, userId }) {
  // Run some checks to avoid garbage into the DB
  if (!isString(token)) {
    throw new Error('"token" property must be a string.')
  }
  if (!isString(userId)) {
    throw new Error('"userId" property must be a string.')
  }

  // Check if a push token with the provided token already exists
  const pushTokens = await db
    .collection('push-tokens')
    .where('token', '==', token)
    .get()

  // If it exists just return it else create a new push token and return it
  if (pushTokens.size > 0) {
    return pushTokens.docs[0]
  } else {
    // Use a dry run message send to validate the provided token, throws if
    // invalid
    await messaging.send({ token }, true)
    // Proceed to save the token
    const newToken = await db.collection('push-tokens').add({ token, userId })
    return newToken.get()
  }
}
