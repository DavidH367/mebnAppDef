import React from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  // Define tus estilos aquí
});

export const PDFDocument = ({ nombre, apellido, zona, tipoCafe, precio, quintales, peso }) => {

  const pdfContent = (
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
          {/* Agrega más elementos y estilos según sea necesario */}
        </View>
      </Page>
    </Document>
  );

return pdfContent; // Devuelve el contenido del PDF como una cadena
};







