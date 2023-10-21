import React, { useState, useEffect } from "react";
import "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  addDoc,
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { Card, CardHeader, CardBody, Divider, Chip } from "@nextui-org/react";

const Estados = (props) => {
   // Puedes acceder a las props totalVentas y totalCompras
  const {totalCompras } = props;


  // Usar async/await para esperar a que se resuelva la promesa
  

  return (
    <div className="bg-white py-12 sm:py-16 ">
      <div className="mx-auto max-w-md grid grid-rows-1 grid-flow-col gap-4">
        <div>
          <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col text-center">
              <p className="uppercase font-bold text-large">TOTAL EN COMPRAS</p>
              <small className="text-default-500 text-medium">
                Valor en Lempiras
              </small>
              <Divider />
              <Chip
                variant="shadow"
                classNames={{
                  base: " mt-2 bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                  content: "drop-shadow shadow-black text-white",
                }}
              >
                <h4 className="font-bold text-large">
                {parseFloat(totalCompras).toLocaleString("es-ES", {
                                style: "currency",
                                currency: "HNL",
                                minimumFractionDigits: 2,
                            })} 
                </h4>
              </Chip>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Estados;
