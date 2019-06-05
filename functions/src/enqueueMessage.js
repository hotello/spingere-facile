const admin = require('firebase-admin')
const chunks = require('lodash.chunk')

const db = admin.firestore()
const messaging = admin.messaging()

module.exports = async function enqueueMessage(message) {
  // Use a dry run message send to validate the provided message, trows if
  // invalid
  const { userIds, ...testMessage } = message // Exclude property from object
  if (message.topic || message.token || message.condition) {
    await messaging.send(testMessage, true)
  } else {
    await messaging.send(Object.assign(testMessage, { topic: 'dryRun' }), true)
  }

  // If message contains userIds use a separate procedure
  if (message.userIds && Array.isArray(message.userIds)) {
    if (message.userIds.length >= 5000) {
      throw new Error(
        'Max userIds length exceeded. Provide less than 5000 ids.'
      )
    }
    // Get a new write batch
    const batch = db.batch()
    // Split the userIds array into chunks of 25 userIds
    const chunkedUserIds = chunks(message.userIds, 25)
    // Add a message for each chunk of 25 userIds
    chunkedUserIds.forEach(chunk =>
      batch.set(
        db.collection('messages').doc(),
        Object.assign(message, { userIds: chunk })
      )
    )
    // Commit the batch
    return batch.commit()
  } else {
    return db.collection('messages').add(message)
  }
}
