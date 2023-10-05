import Link from "next/link";
import NavBar from '../../Components/Layout/NavBar';
import { Card, CardFooter, Image, Button, CardHeader, CardBody } from "@nextui-org/react";


export default function Searches() {

    return <div >
        <NavBar />
        <h2 className="text-lg font-semibold mb-2 p-4 text-center">
            CONSULTAS
        </h2>

        <div className="justify-center">
            <div className=" p-4 grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2  justify-items-center">

                <div>
                    <Link href="../../purchasing_history">
                        <Card className="py-4" isPressable
                            onPress={() => console.log("item pressed")}>
                            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                <p className="text-tiny uppercase font-bold">Consultar:</p>
                                <small className="text-default-500">Historial de Clientes</small>
                                <h4 className="font-bold text-large">COMPRAS</h4>
                            </CardHeader>
                            <CardBody className="overflow-visible py-2">
                                <Image
                                    alt="Card background"
                                    className="object-cover rounded-xl h-48 w-full"
                                    src="../img/compras.jpg"
                                    width={270}
                                />
                            </CardBody>
                        </Card>

                    </Link>
                </div>



                <div>
                    <Link href="../../sales_history">
                        <Card className="py-4 " isPressable onPress={() => console.log("item pressed")}>
                            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                <p className="text-tiny uppercase font-bold">Consultar:</p>
                                <small className="text-default-500">Historial de Cafe Vendido</small>
                                <h4 className="font-bold text-large">VENTAS</h4>
                            </CardHeader>
                            <CardBody className="overflow-visible py-2">
                                <Image
                                    alt="Card background"
                                    className="object-cover rounded-xl h-48 w-full"
                                    src="../img/ventas.png"
                                    width={270}

                                />
                            </CardBody>
                        </Card>
                    </Link>
                </div>

            </div>
            <div className="p-4 grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 justify-items-center">

                <div>
                    <Link href="../../inventory_control">
                        <Card className="py-4 " isPressable onPress={() => console.log("item pressed")}>
                            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                <p className="text-tiny uppercase font-bold">Consultar:</p>
                                <small className="text-default-500">Control de Inventario de café</small>
                                <h4 className="font-bold text-large">INGRESOS Y EGRESOS</h4>
                            </CardHeader>
                            <CardBody className="overflow-visible py-2">
                                <Image
                                    alt="Card background"
                                    className="object-cover rounded-xl h-48 w-full"
                                    src="../img/control.jpg"
                                    width={270}
                                />
                            </CardBody>
                        </Card>
                    </Link>
                </div>

                <div>
                    <Link href="../../supliers_history">
                        <Card className="py-4 " isPressable onPress={() => console.log("item pressed")}>
                            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                <p className="text-tiny uppercase font-bold">Consultar:</p>
                                <small className="text-default-500">Abonos pendientes y Capital</small>
                                <h4 className="font-bold text-large">COMPRADORES</h4>
                            </CardHeader>
                            <CardBody className="overflow-visible py-2">
                                <Image
                                    alt="Card background"
                                    className="object-cover rounded-xl h-48 w-full"
                                    src="../img/inversion.jpg"
                                    width={270}
                                />
                            </CardBody>
                        </Card>
                    </Link>
                </div>

            </div>
        </div>
    </div>
}