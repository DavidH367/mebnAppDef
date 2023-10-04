import {Divider} from "@nextui-org/react";
import React, { useState, useEffect } from 'react';
import 'firebase/firestore';
import { db } from '../../lib/firebase';
import { addDoc, collection, query, getDocs, orderBy, limit, where} from 'firebase/firestore';
import {Card, CardHeader, CardBody} from "@nextui-org/react";


const Estados = () => {
    const [tsales, setTsales] = useState(0); // Definir tsales en el estado inicial
    const [tpurchases, setPurchases] = useState(0); // Definir tsales en el estado inicial

         // Usar async/await para esperar a que se resuelva la promesa
         useEffect(() => {

          //suma de total en ventas
          const fetchData = async () => {
            const querySnapshot1 = await getDocs(
              query(collection(db, 'inventories'), where('tran_type', '==', 'VENTA'))
            );

            let latestTsales = 0;

            querySnapshot1.forEach((doc) => {
              const data = doc.data();
              // Asegúrate de que la propiedad 'value' exista en el documento
              if (data.hasOwnProperty('value')) {
                latestTsales += data.value; // Suma el valor de 'value' al total
              }
            });

            //suma total de compras
             
            const querySnapshot2 = await getDocs(
              query(collection(db, 'inventories'), where('tran_type', '==', 'COMPRA'))
            );
              
              let latestPurchases = 0;

              querySnapshot2.forEach((doc) => {
                const data = doc.data();
                // Asegúrate de que la propiedad 'value' exista en el documento
                if (data.hasOwnProperty('value')) {
                  latestPurchases += data.value; // Suma el valor de 'value' al total
                }
              });
  
              setTsales(latestTsales);
              setPurchases(latestPurchases); // Actualizar el estado de tsales con el valor obtenido
            };
        
            fetchData();
          }, []); // El segundo argumento [] asegura que useEffect se ejecute solo una vez al montar el componente
      
        return (
          <div className="bg-white py-12 sm:py-16 ">
            <div className="mx-auto max-w-md grid grid-rows-1 grid-flow-col gap-4">
                
                <div>
                  <Card className="py-4">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                        <p className="text-tiny uppercase font-bold">TOTAL EN COMPRAS</p>
                        <small className="text-default-500">Valor en Lempiras</small>
                        <h4 className="font-bold text-large">
                          {tpurchases.toFixed(2)} L
                        </h4>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2">
                        
                    </CardBody>
                </Card>  
                </div>
                <div>
                    <Card className="py-4">
                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                            <p className="text-tiny uppercase font-bold">TOTAL EN VENTAS</p>
                            <small className="text-default-500">Valor en Lempiras</small>
                            <h4 className="font-bold text-large">
                              {tsales.toFixed(2)} L
                            </h4>
                        </CardHeader>
                        <CardBody className="overflow-visible py-2">
                            
                        </CardBody>
                    </Card> 
                </div>
                
            </div>
          </div>
        )
      }
      



export default Estados;