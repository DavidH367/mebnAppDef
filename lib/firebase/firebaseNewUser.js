import { getFirestore, setDoc, doc} from "firebase/firestore";


const addNewUser = async ( user, firstName, lastName, phoneNumber, userRole, userState) => { 
    const db = getFirestore(); 

    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        firstName: firstName.toUpperCase(),
        lastName: lastName.toUpperCase(),
        displayName: `${firstName.toUpperCase()} ${lastName.toUpperCase()}`,
        cellphone: phoneNumber,
        role: userRole,
        state: userState,
    }) 
}


export default addNewUser