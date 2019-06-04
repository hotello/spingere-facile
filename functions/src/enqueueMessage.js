const admin = require('firebase-admin')
const chunks = require('array.chunk')

const db = admin.firestore()

module.exports = function enqueueMessage(message) {
  if (message.userIds && Array.isArray(message.userIds)) {
    if (message.userIds.length >= 5000) {
      throw new Error(
        'Max userIds length exceeded. Provide less than 5000 ids.'
      )
    }
    // Get a new write batch
    const batch = db.batch()
    // Split the userIds array into chunks of 50 userIds
    const chunkedUserIds = chunks(message.userIds, 50)
    // Add a message for each chunk of 50 userIds
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
