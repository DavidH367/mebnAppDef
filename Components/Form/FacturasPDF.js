import { jsPDF } from "jspdf";
import React from "react";
import { Button } from "@nextui-org/react";


const FacturaPDF = () => {

    const newData = {
        n_transaction: 30,
        date: '21 de septiembre de 2023, 22:55:16 UTC-6',
        rtn: "3123312312311",
        name: "Chris David Fuentez",
        last_name: "Hernandez",
        zone: "San José de Pane",
        bags: 123,
        coffee_type: "Pergamino Seco",
        weight: 123,
        total: 123.00,
    }
    const generarPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);

        doc.text('FACTURA', 95, 20);
        doc.text(`N° de Factura: ${newData.n_transaction}`, 10, 30);
        doc.text(`Fecha: ${newData.date}`, 10, 40);
        doc.text(`RTN: ${newData.rtn}`, 10, 50);
        doc.text(`Nombre: ${newData.name}`, 10, 60);
        doc.text(`Apellido: ${newData.last_name}`, 10, 70);
        doc.text(`Zona de Procedencia: ${newData.zone}`, 10, 80);
        doc.text(`Quintales en Unidades: ${newData.bags}`, 10, 90);
        doc.text(`Tipo de Café: ${newData.coffee_type}`, 10, 100);
        doc.text(`Peso Neto en Libras: ${newData.weight}`, 10, 110);
        doc.text(`Total Facturado: ${newData.total}`, 10, 120);


        //guardar el PDF con un identificador
        //doc.save(`factura_${facturaData.n_transaction}.pdf`)
        // Set the document to automatically print via JS
        doc.autoPrint();
        doc.output('dataurlnewwindow');

    }

    return (
        <Button
            onPress={generarPDF}>
            Generar Factura
        </Button>
    );
}

export default FacturaPDF;