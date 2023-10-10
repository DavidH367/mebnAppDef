import Link from "next/link";
import { Card, Image, CardHeader, CardBody, Divider } from "@nextui-org/react";
import React, { useEffect } from "react";
import { useAuth } from "../../lib/context/AuthContext";
import { useRouter } from "next/router";

export default function Users() {
  //Valida acceso a la pagina
  const router = useRouter();
  const { user, errors, setErrors } = useAuth();
  useEffect(() => {
    if (!user) {
      setErrors("");
      router.push("/auth/Login");
    }
  }, []);
  return (
    <div className={"homeSearches"}>
      <h2 className="text-lg font-semibold mb-2 p-4 text-center">USUARIOS</h2>

      <div className="justify-center">
        <div className=" p-4 grid gap-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2  justify-items-center">
          <div>
            <Link href="../users/RegisterUser">
              <Card
                className="py-4"
                isPressable
                onPress={() => console.log("item pressed")}
              >
                <CardHeader className="pb-0 pt-1 px-4 flex-col text-center">
                  <h4 className="font-bold text-large">Registrar Usuario</h4>
                  <Divider />
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <Image
                    alt="Card background"
                    className="object-cover rounded-xl h-40 w-full"
                    src="../img/newUser.svg"
                    width={270}
                  />
                </CardBody>
              </Card>
            </Link>
          </div>
          <div>
            <Link href="../auth/ResetPassword">
              <Card
                className="py-4 "
                isPressable
                onPress={() => console.log("item pressed")}
              >
                <CardHeader className="pb-0 pt-1 px-4 flex-col text-center">
                  <h4 className="font-bold text-large">Actualizar Contraseña</h4>
                  <Divider />
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <Image
                    alt="Card background"
                    className="object-cover rounded-xl h-40 w-full"
                    src="../img/pas.svg"
                    width={270}
                  />
                </CardBody>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
