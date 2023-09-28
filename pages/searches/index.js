import Link from "next/link";
import NavBar from '../../Components/Layout/NavBar';
import { Card, CardFooter, Image, Button, CardHeader, CardBody } from "@nextui-org/react";


export default function Searches() {

    return <div>
        <NavBar />
        <h2 className="text-lg font-semibold mb-2 p-12">
            <p className='text-center'>
                CONSULTAS
            </p>
        </h2>

        <div className="p-10 grid grid-cols-2 justify-items-center mx-96">

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
                                className="object-cover rounded-xl"
                                src="../img/compras.jpg"
                                width={270}
                            />
                        </CardBody>
                    </Card>

                </Link>
            </div>



            <div>
                <Link href="../../purchasing_history">
                    <Card className="py-4 " isPressable onPress={() => console.log("item pressed")}>
                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                            <p className="text-tiny uppercase font-bold">Consultar:</p>
                            <small className="text-default-500">Historial de Cafe Vendido</small>
                            <h4 className="font-bold text-large">VENTAS</h4>
                        </CardHeader>
                        <CardBody className="overflow-visible py-2">
                            <Image
                                alt="Card background"
                                className="object-cover rounded-xl"
                                src="../img/ventas.png"
                                width={270}

                            />
                        </CardBody>
                    </Card>
                </Link>
            </div>

        </div>
        <div className="p-10 grid grid-cols-2 justify-items-center mx-96">

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
                                className="object-cover rounded-xl"
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
                                className="object-cover rounded-xl"
                                src="../img/inversion.jpg"
                                width={270}
                            />
                        </CardBody>
                    </Card>
                </Link>
            </div>

        </div>
    </div>
}