import Head from "next/head";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, onSnapshot } from "@firebase/firestore";
import { useAuth } from "../lib/context/AuthContext";
import { useRouter } from "next/router";
import { Card, CardBody, Image, Button, Progress } from "@nextui-org/react";

import CafePerformance from "../Components/Form/coffee_performance";


export default function Home() {
  const { user, setErrors } = useAuth();
  const [localUser, setLocalUser] = useState({});
  const [loadedUser, setLoadedUser] = useState(false);
  const router = useRouter();
  useEffect(() => {
    //entrar a la pagina
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
          displayname: `${updatedUser.firstName} ${updatedUser.lastName}`,
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
    <>
      <div className={"homeContainer"}>
        <h1 className="text-lg font-bold mb-4 p-4 text-center">
          BIENVENIDO(A): {localUser.displayname}
        </h1>

        { }
        <div>
          <CafePerformance />
        </div>
      </div>


    </>
  );
}