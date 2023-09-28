import React, { useState } from 'react';
import { PDFDocument } from '..//Form/InvoicePDF'; // Ajusta la ruta a tu archivo PDFDocument
import { saveAs } from 'file-saver'; // Asegúrate de importar FileSaver.js
import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';


const VerPDFButton = ({ nombre, apellido, zona, tipoCafe, precio, quintales, peso }) => {
  const [pdfBlob, setPdfBlob] = useState(null);

  const handleVerPDF = async () => {
    try {
      // Genera el PDF con los datos proporcionados
      const pdfContent = generatePDF({ nombre, apellido, zona, tipoCafe, precio, quintales, peso });

      // Convierte el PDF en una cadena
      const pdfString = pdfContent.toString();

      // Crea un Blob a partir de la cadena del PDF
      const pdfBlob = new Blob([pdfString], { type: 'application/pdf' });

      // Guarda el PDF en una ubicación accesible (puedes cambiar la ruta según tus necesidades)
      saveAs(pdfBlob, 'factura.pdf');

      // Establece el blob del PDF en el estado para mostrarlo
      setPdfBlob(pdfBlob);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  };

  return (
    <div>
      <button onClick={handleVerPDF}>Ver PDF</button>
      {pdfBlob && (
        <div>
          <PDFViewer width="100%" height="500px">
            <Document>
              <Page>
                <View>
                  <Text>Nombre: {nombre}</Text>
                  <Text>Apellido: {apellido}</Text>
                  <Text>Zona: {zona}</Text>
                  <Text>Tipo de Café: {tipoCafe}</Text>
                  <Text>Precio: {precio}</Text>
                  <Text>Quintales: {quintales}</Text>
                  <Text>Peso Total: {peso}</Text>
                </View>
              </Page>
            </Document>
          </PDFViewer>
        </div>
      )}
    </div>
  );
};

export default VerPDFButton;










