import admin from "../../lib/firebase/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { userId, newEmail } = req.body;

      // Use the Firebase Admin SDK to update the user's email
      await admin.auth().updateUser(userId, {
        email: newEmail,
      });

      res
        .status(201)
        .json({ success: true, message: "User created successfully" });
    } catch (error) {
      // console.log(error);
      res
        .status(500)
        .json({ success: false, message: error.message, code: error.code });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
