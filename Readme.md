# Spingere facile (Push easy)
> Ti piace spingere facile? Easy push notifications for people that have no time
to loose.

"Spingere facile" provides you with **push notifications** for top platforms:
- iOS
- Android
- Browsers

It is based on **Firebase Cloud Messaging** and adds value to it **managing tokens**
and linking them to your **users**. It will provide you with a simple HTTP API to
manage your notification sending.


This piece of software must be deployed on *Firebase Cloud Functions*, and stores
data into *Firebase Cloud Firestore*.

## Requirements
On your local machine:
- Node.js
- npm

You also need:
- A Firebase account

## Deployment
Start with installing the Firebase CLI via npm.
```sh
npm install -g firebase-tools
```

Run firebase login to log in via the browser and authenticate the firebase tool.
```sh
firebase login
```

Clone this repository.
```sh
git clone https://github.com/hotello/spingere-facile.git
```
