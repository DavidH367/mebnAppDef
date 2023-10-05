// pages/api/deleteUser.js
import admin from "../../lib/firebase/firebaseAdmin";
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { userID } = req.body;
      console.log(`user ID is: ${userID}`);
      // Use the Firebase Admin SDK to delete the user
      await admin.auth().deleteUser(userID);
      // Use the Firebase Admin SDK to delete the associated document in Firestore
      const firestore = admin.firestore();
      const userDocRef = firestore.collection("users").doc(userID); // Replace 'your-collection-name' with your Firestore collection name
      await userDocRef.delete();
      res
        .status(201)
        .json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: error.message, code: error.code });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
