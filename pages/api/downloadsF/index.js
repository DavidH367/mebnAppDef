import fs from 'fs';
import path from 'path';

export default function DownloadPDF(req, res) {
  const pdfPath = path.join(process.cwd(), 'public','facturas', 'factura.pdf');

  fs.readFile(pdfPath, (err, data) => {
    if (err) {
      console.error('Error al leer el archivo PDF:', err);
      res.status(500).end();
    } else {
      // Establece las cabeceras de la respuesta HTTP para descargar el archivo
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="factura.pdf"');
      res.end(data);
    }
  });
}
