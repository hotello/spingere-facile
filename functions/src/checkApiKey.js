const functions = require('firebase-functions')

module.exports = function checkApiKey(req) {
  const apiKey = functions.config().api.key || 'replaceme'
  // The API Key must be provided
  if (!req.headers['x-api-key']) {
    throw new Error('Provide the API Key via "X-API-Key" header.')
  }
  // Throw an error if the provided key is invalid
  if (req.headers['x-api-key'] !== apiKey) {
    throw new Error('The provided API Key is invalid.')
  }
}
