import admin from "../../lib/firebase/firebaseAdmin";

export default async function handler(req, res) {
  const {
    email,
    displayName,
    firstName,
    lastName,
    cellphone,
    role,
    state,
    adminRegister,
  } = req.body;

  try {
    const password = "CAFE2023!";
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });
    const userId = userRecord.uid;
    await admin.firestore().collection("users").doc(userId).set({
      email: email,
      firstName: firstName,
      lastName: lastName,
      cellphone: cellphone,
      user_role: role,
      user_state: state,
      user_code: userId,
      registered_by: adminRegister,
      first_login: true,
    });
    res
      .status(201)
      .json({ success: true, message: "Usuario creado con éxito" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}
