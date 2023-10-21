import React, { useState } from 'react';
import { Card, CardBody, Image, Button, Progress } from "@nextui-org/react";
import { Input } from "@nextui-org/react";


const CafePerformance = () => {
    const [pesoPergaminoLbs, setPesoPergaminoLbs] = useState(0);
    const [pesoUvaLbs, setPesoUvaLbs] = useState(0);
    const [rendimiento, setRendimiento] = useState(0);

    // Función para calcular el rendimiento en kilogramos
    const calcularRendimiento = () => {
        // Convertir pesos de libras a kilogramos
        const pesoPergaminoKg = pesoPergaminoLbs * 0.453592;
        const pesoUvaKg = pesoUvaLbs * 0.453592;

        // Calcular el rendimiento en kilogramos
        const rendimientoKg = (pesoPergaminoKg / pesoUvaKg) * 100;

        // Redondear a dos decimales
        const rendimientoRedondeado = rendimientoKg.toFixed(2);
        setRendimiento(rendimientoRedondeado);
    };

    return (
        <div className="bg-white py-12 sm:py-16 ">
            <div className="mx-auto max-w-md grid grid-rows-1 grid-flow-col gap-4">
                <Card
                    isBlurred
                    className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
                    shadow="sm"
                >
                    <CardBody>
                        <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
                            <div className="relative col-span-6 md:col-span-4">
                                <Image
                                    alt="Album cover"
                                    className="object-cover"
                                    height={200}
                                    shadow="md"
                                    src="../../img/rendimiento.jpg"
                                    width="100%"
                                />
                            </div>
                            <div className="flex flex-col col-span-6 md:col-span-8">
                                <div className="flex justify-center items-start">
                                    <div className="flex flex-col gap-0">
                                        <h1 className="text-large font-medium mt-2">Verificar rendimiento de Café</h1>
                                        <Input
                                            type="number"
                                            label="Peso en Pergamino:"
                                            placeholder="0.00"
                                            labelPlacement="outside"
                                            step="0.01"
                                            min={0.01}
                                            startContent={
                                                <div className="pointer-events-none flex items-center">
                                                    <span className="text-default-400 text-small">Lbs</span>
                                                </div>
                                            }
                                            value={pesoPergaminoLbs}
                                            onChange={(e) => setPesoPergaminoLbs(e.target.value)}
                                        />
                                        <Input
                                            type="number"
                                            label="Peso en Uva:"
                                            placeholder="0.00"
                                            labelPlacement="outside"
                                            step="0.01"
                                            min={0.01}
                                            startContent={
                                                <div className="pointer-events-none flex items-center">
                                                    <span className="text-default-400 text-small">Lbs</span>
                                                </div>
                                            }
                                            value={pesoUvaLbs}
                                            onChange={(e) => setPesoUvaLbs(e.target.value)}
                                        />
                                        <Card>
                                            <CardBody>
                                                <p> {rendimiento} %</p>
                                            </CardBody>
                                        </Card>
                                        <button onClick={calcularRendimiento}>Calcular Rendimiento</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default CafePerformance;


