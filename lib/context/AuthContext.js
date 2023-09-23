import { createContext, useContext, useEffect, useState } from 'react'
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    deleteUser,
    sendPasswordResetEmail,
    updatePassword
} from 'firebase/auth'
import { 
    auth, 
    db 
} from '../firebase'
import { 
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    updateDoc,
    where
} from '@firebase/firestore'
const AuthContext = createContext({})
export const useAuth = () => useContext(AuthContext)
export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null)
    // const [localUser, setLocalUser] = useState()
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        //get user when app refreshes
        if (user) {
            setUser({
            uid:user.uid,
            email: user.email,
            displayName: user.displayName
            })        
        } else {
            setUser(null)
        }
        setLoading(false)
        })

        return () => unsubscribe()
    }, [])
    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            const docRef = doc(db, "users",userCredential.user.uid)
            const querySnapshot = await getDoc(docRef)
            const queryUser = querySnapshot.data()
            let userData = {  
                email: userCredential.user.email,
                uid: userCredential.user.uid,
                loggedIn: true,
                first_login: queryUser.first_login
            };
            setUser(userData);
            setErrors('');
            return true
            } catch (error) {
            const errorMessage = error.code
            if (errorMessage === 'auth/user-not-found'){
                setErrors("Usuario no Registrado")
            }
            if (errorMessage === 'auth/wrong-password'){
                setErrors("Contraseña Incorrecta")
            }
            console.log(error);
            return false
            }
        };
        
        const deleteUserById = async (userId) => {
            try {
            await deleteUser(auth, userId);
            console.log(`Usuario con ID ${userId} ha sido eliminado`);
            return true;
            } catch (error) {
            console.log(error);
            return false;
            }
        };
        const updateUserPassword = async (newPassword) => {
            try {
            //Updating password
            await updatePassword(user, newPassword);
            
            //login
            const usersCollection = collection(db, "users");
            const q = query(usersCollection, where("user_code", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const docID = querySnapshot.docs[0].id;
            const userRef = doc(db, "users", docID);
            await updateDoc(userRef, { first_login: false });
            return true;
            } catch (e) {
            setErrors("Hubo un problema actualizando sus datos");
            return false;
            }
        };
        
        const logout = async () => {
            try{
            setUser(null)
            await signOut(auth)
            return true
            }catch(e){
            setErrors("No fue posible cerrar la sesión")
            return false;
            }
            
        }
        const forgotPassword = async (sendToEmail)=>{
            try{
            await sendPasswordResetEmail(auth,sendToEmail)
            return true
            }catch(e){
            const errorMessage = e.code
            if (errorMessage === "auth/user-not-found"){
                setErrors("El Usuario no está Registrado")
            }
            else{
                setErrors("Error Enviando el Correo")
            }
            return false      
            }
        }
        return (
            <AuthContext.Provider value={{ 
            user, 
            loading,
            errors,
            login, 
            logout,
            deleteUserById,
            forgotPassword, 
            updateUserPassword,
            setUser,
            setErrors }}>
            {loading ? null : children}
            </AuthContext.Provider>
        )
}