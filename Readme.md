![Logo](https://media.giphy.com/media/5R2PZEojwtFkXOrU0y/200w_d.gif)

# SpingereFacile
> Ti piace spingere facile? Scalable HTTP API for sending push notifications.

"SpingereFacile" provides you with **push notifications** for top platforms:
- iOS
- Android
- Browsers

It is based on **Firebase Cloud Messaging** and adds value to it with **token
management** and linking tokens to **users**. It will provide you with a simple
HTTP API to manage your notification sending.


This piece of software must be deployed on *Firebase Cloud Functions*, and
stores data into *Firebase Cloud Firestore*.

## Requirements
On your local machine:
- Node.js
- npm

You also need:
- A Firebase account
- A dedicated Firebase project with Firestore enabled

## Deployment
Start with installing the Firebase CLI via npm.
```sh
npm install -g firebase-tools
```

Run firebase login to log in via the browser and authenticate the Firebase Tool.
```sh
firebase login
```

Clone this repository and change to its directory.
```sh
git clone https://github.com/hotello/spingere-facile.git
cd spingere-facile
```

Deploy the application.
```sh
firebase deploy --project your-project-name
```

Provide an API key to secure HTTP calls to the service.
```sh
firebase functions:config:set api.key="SOMELONGAPIKEY"
```
Otherwise the default API key is *replaceme*.

## HTTP API Docs
The HTTP API has two endpoints. The base URL is generated for your Firebase
project and resembles https://us-central1-your-project-name.cloudfunctions.net.

Always provide an **X-API-Key** header with each request. The following is an
example using curl.
```sh
curl --request POST \
  --url http://localhost:5001/spingere-facile-test-us/us-central1/refresh \
  --header 'content-type: application/json' \
  --header 'x-api-key: replaceme' \
  --data '{ "token": "somevalidfcmtoken", "userId": "carlo" }'
```

### POST /refresh
Use this endpoint to refresh a token for a user. When the token is refreshed in
your client app, post the token with the user id as a JSON body.
```json
{
  "token": "<FCM_REGISTRATION_TOKEN>",
  "userId": "<USER_ID_AS_STRING>"
}
```

### POST /send
Use this endpoint to send a push notification. The posted JSON body is passed
to official FCM npm module .send() method, plus registration tokens for provided
user ids are retrieved from the internal database.

Notable properties:
- **userIds**: Array of up to 5000 user ids provided through the /refresh endpoint.

For all other properties refer to https://firebase.google.com/docs/reference/admin/node/admin.messaging.Message.html

This is an example of JSON body:
```json
{
  "data": {
    "hello": "Hello World!"
  },
  "userIds": ["user1", "user2", "user-3"]
}
