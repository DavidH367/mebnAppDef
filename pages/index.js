import Head from "next/head";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, onSnapshot } from "@firebase/firestore";
import { useAuth } from "../lib/context/AuthContext";
import { useRouter } from "next/router";

export default function Home() {
  const { user, setErrors } = useAuth();
  const [localUser, setLocalUser] = useState({});
  const [loadedUser, setLoadedUser] = useState(false);
  const router = useRouter();
  useEffect(() => {
    //verifying
    if (!user) {
      setErrors("");
      router.push("/auth/Login");
    } else if (user.first_login) {
        router.push("/auth/ResetPassword");
    }
    //get rest of user information
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const updatedUser = doc.data();
        const newUser = {
          userDocID: doc.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          cellphone: updatedUser.cellphone,
          role: updatedUser.user_role,
          state: updatedUser.user_state,
          firstLogin: updatedUser.first_login,
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        //saving user data in local storage
        setLocalUser(newUser);
        setLoadedUser(true);
      }
    });
    return () => unsubscribe();
  }, [loadedUser, router, setErrors, user]);
  return (
    <div>
      <h1>{localUser.firstName}</h1>
    </div>
  );
}