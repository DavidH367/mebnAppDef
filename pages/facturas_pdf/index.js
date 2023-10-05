import { jsPDF } from "jspdf";
import React from "react";
import { Button } from "@nextui-org/react";


const FacturaPDF = () => {

    const newData = {
        n_transaction: 30,
        date: '21 de septiembre de 2023, 22:55:16',
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
        const doc = new jsPDF({unit: 'mm', format: [215, 140]});
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('BODEGA - GAD', 50, 10);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('Compra Venta de Café', 53, 15);
        doc.setFontSize(8);
        doc.text('RTN: 0313198500469', 58, 19);
        doc.setFontSize(10);
        doc.text('Telefono: (504) 9541-9092', 50, 24);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`Fecha: ${newData.date}`, 3, 35);
        doc.text(`N° de Factura: ${newData.n_transaction}`, 95, 35);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`RTN: ${newData.rtn}`, 5, 45);
        doc.text(`Nombre Cliente: ${newData.name}, ${newData.last_name}`, 5, 52);
        doc.text(`Zona: ${newData.zone}`, 95, 52);
        doc.setFont('helvetica', 'bold');
        doc.text(`Quintales en Unidades: ${newData.bags}`, 5, 59);
        doc.text(`Tipo de Café: ${newData.coffee_type}`, 5, 66);
        doc.text(`Peso Neto en Libras: ${newData.weight}`, 5, 73);
        doc.text(`TOTAL FACTURADO: ${newData.total} L`, 80, 73);
        doc.text('¡GRACIAS POR TU PREFERENCIA!', 40, 90);
        //guardar el PDF con un identificador
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