import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import "firebase/firestore";

import {
  Card,
  CardFooter,
  Image,
  Button,
  CardHeader,
  CardBody,
  Divider,
} from "@nextui-org/react";


const MainComponent = () => {
  
  return (
    <div className={"homeSearches"}>
      <Head>
        <title>CURSOS Y MATRICULAS</title>
        <meta name="description" content="CURSOS Y MATRICULAS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/logo_paginas.png" />
      </Head>
      <h2 className="text-lg font-semibold mb-2 p-4 text-center">CURSOS Y MATRICULAS</h2>
      <div className="justify-center">
        <div className=" p-4 grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3  justify-items-center">
          <div>
            <Link href="../../purchasing_history">
              <Card
                className="py-4"
                isPressable
                onPress={() => console.log("item pressed")}
              >
                <CardHeader className="pb-0 pt-1 px-4 flex-col text-center">
                  <h4 className="font-bold text-large">REGISTRAR ASIGNATURA</h4>
                  <Divider />
                  <small className="text-default-500 font-bold">
                    Crear o Modificar Clases.
                  </small>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <Image
                    alt="Card background"
                    className="object-cover rounded-xl h-40 w-360"
                    src="../img/modificar_clase.jpeg"
                    width={270}
                  />
                </CardBody>
              </Card>
            </Link>
          </div>
          <div>
            <Link href="../../expenses_history">
              <Card
                className="py-4 "
                isPressable
                onPress={() => console.log("item pressed")}
              >
                <CardHeader className="pb-0 pt-1 px-4 flex-col text-center">
                  <h4 className="font-bold text-large">HORARIOS DE CLASES</h4>
                  <Divider />
                  <small className="text-default-500 font-bold">
                    Registrar y Actualizar horarios.
                  </small>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <Image
                    alt="Card background"
                    className="object-cover rounded-xl h-40 w-360"
                    src="../img/horario.jpeg"
                    width={270}
                  />
                </CardBody>
              </Card>
            </Link>
          </div>

          <div>
            <Link href="../../expenses_history">
              <Card
                className="py-4 "
                isPressable
                onPress={() => console.log("item pressed")}
              >
                <CardHeader className="pb-0 pt-1 px-4 flex-col text-center">
                  <h4 className="font-bold text-large">ASIGNAR DOCENTES</h4>
                  <Divider />
                  <small className="text-default-500 font-bold">
                    Registrar docentes para asignaturas y horarios.
                  </small>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <Image
                    alt="Card background"
                    className="object-cover rounded-xl h-40 w-360"
                    src="../img/registrar_docente.jpeg"
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
};

export default MainComponent;
