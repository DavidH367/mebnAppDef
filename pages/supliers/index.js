import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Card,
  CardFooter,
  Image,
  Button,
  CardHeader,
  CardBody,
  Divider,
} from "@nextui-org/react";
import "firebase/firestore";


const Providers = () => {
  
  return (
    <div className={"homeSearches"}>
      <Head>
        <title>EVALUACIONES</title>
        <meta name="description" content="EVALUACIONES" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/logo_paginas.png" />
      </Head>
      <h2 className="text-lg font-semibold mb-2 p-4 text-center">EVALUACIONES DE ALUMNOS</h2>
      <div className="justify-center">
        <div className=" p-4 grid gap-12 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2  justify-items-center">
          <div>
            <Link href="../../purchasing_history">
              <Card
                className="py-4"
                isPressable
                onPress={() => console.log("item pressed")}
              >
                <CardHeader className="pb-0 pt-1 px-4 flex-col text-center">
                  <h4 className="font-bold text-large">INGRESO DE CALIFICACIONES</h4>
                  <Divider />
                  <small className="text-default-500 font-bold">
                    Calificaciones de Alumnos.
                  </small>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <Image
                    alt="Card background"
                    className="object-cover rounded-xl h-40 w-360"
                    src="../img/ingreso_calificaciones.jpeg"
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
                  <h4 className="font-bold text-large">HISTORIAL DE CALIFICACIONES</h4>
                  <Divider />
                  <small className="text-default-500 font-bold">
                    Historial de Calificaciones en Asignaturas.
                  </small>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <Image
                    alt="Card background"
                    className="object-cover rounded-xl h-40 w-360"
                    src="../img/historial_calificaciones.jpeg"
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

export default Providers;
