const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');

admin.initializeApp();
const firestore = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  firestore
    .collection('users')
    .get()
    .then(docs => {
      docs.forEach(doc => {
        let data = doc.data()
        firestore.collection('users').doc(doc.id).collection('animes').get()
          .then(aDocs => {
            console.log(aDocs)
            aDocs.forEach(aDoc => {
              firestore.collection('users').doc(doc.id).collection('animes').doc(aDoc.id)
              .set({ r: Math.random() }, {merge: true})
            })
            return aDocs
          })
          .then(() => {
            response.send("OK");
            return null
          }).catch(() => {
            response.send("Error Animes");
          })
      });
      return docs
    })
    .catch(() => {
      response.send("Error Users");
    })

});
