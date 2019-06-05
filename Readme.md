![Logo](https://media.giphy.com/media/5R2PZEojwtFkXOrU0y/200w_d.gif)

# SpingereFacile
> Ti piace spingere facile? Scalable HTTP API for sending push notifications to
users, not tokens.

"SpingereFacile" is a service for sending **push notifications** and **managing
registration tokens** for top platforms:
- iOS
- Android
- Browsers

It is based on **Firebase Cloud Messaging** and adds value to it with **token
management** and linking tokens to **users**. It provides a simple HTTP API to
manage notification sending and token management.


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

Run firebase login to log in via the browser and authenticate the Firebase tool.
```sh
firebase login
```

Clone this repository, change to its directory and install dependencies.
```sh
git clone https://github.com/hotello/spingere-facile.git

cd spingere-facile

cd functions && npm install && cd ..
```

Set the current Firebase project.
```sh
firebase use your-project-name
```

Provide an API key to secure HTTP calls to the service.
```sh
firebase functions:config:set api.key="<SOME_LONG_API_KEY>"
```
Otherwise the default API key is *replaceme*.

Deploy the application.
```sh
firebase deploy
```

## HTTP API Docs
The HTTP API has two endpoints. The base URL is generated for your Firebase
project and resembles https://us-central1-your-project-name.cloudfunctions.net.

Always provide an **X-API-Key** header with each request. The following is an
example using curl.
```sh
curl --request POST \
  --url https://us-central1-your-project-name.cloudfunctions.net/refresh \
  --header 'content-type: application/json' \
  --header 'x-api-key: replaceme' \
  --data '{ "token": "<VALID_FCM_REGISTRATION_TOKEN>", "userId": "carlo" }'
```

### POST /refresh
Use this endpoint to refresh a token for a user. When the token is refreshed in
your client app, post the token with the user id as a JSON body.
```json
{
  "token": "<VALID_FCM_REGISTRATION_TOKEN>",
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
