import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

exports.copyToPublicPosts = functions.firestore
  .document("users/{userId}/posts/{postId}")
  .onCreate((snap, context) => {
    const postData = snap.data();

    return admin.firestore().collection("publicPosts").add(postData);
  });
