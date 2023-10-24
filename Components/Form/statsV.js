import React from "react";
import "firebase/firestore";
import { Card, CardHeader, Divider, Chip } from "@nextui-org/react";

const Estados = (props) => {
  // Puedes acceder a las props totalVentas y totalCompras
  const { totalVentas } = props;
  // Usar async/await para esperar a que se resuelva la promesa

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-sm grid grid-rows-1 grid-flow-col gap-4">
        <div>
          <Card className="pt-4 pb-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col text-center">
              <p className="uppercase font-bold text-large">TOTAL EN VENTAS</p>
              <small className="text-default-500 text-medium">
                Valor en Lempiras
              </small>
              <Divider />
              <Chip
                classNames={{
                  base: "mt-5 mb-3",
                }}
                variant="flat"
                color="secondary"
              >
                <h4 className="font-bold text-large text-lg">
                  {parseFloat(totalVentas).toLocaleString("es-ES", {
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
