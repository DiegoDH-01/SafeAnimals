import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Genera un PDF con la información del servicio entregado
 * @param {Object} servicio - Servicio entregado con campos completos
 */
export function generarReportePDF(servicio) {
  console.log("📄 Generando PDF con:", servicio); // 🔍 Añadir este log

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Reporte de Entrega de Mascota', 14, 20);

  doc.setFontSize(12);
  doc.text(`Fecha de entrega: ${servicio.fechaFinalizacion}`, 14, 30);
  doc.text(`Referencia: ${servicio.referencia}`, 14, 38);
  doc.text(`Usuario: ${servicio.usuario?.nombres || ''} ${servicio.usuario?.apellidos || ''}`, 14, 46);
  doc.text(`Estado: ${servicio.estado?.nombreEstado || ''}`, 14, 54);

  doc.text('Datos de la Mascota:', 14, 66);
  autoTable(doc, {
    startY: 70,
    head: [['Nombre', 'Raza', 'Dueño', 'Contacto']],
    body: [[
      servicio.mascota?.nombre || '',
      servicio.mascota?.raza || '',
      `${servicio.mascota?.dueno?.nombres || ''} ${servicio.mascota?.dueno?.apellidos || ''}`,
      servicio.mascota?.dueno?.celular || ''
    ]]
  });

  doc.save(`Reporte_Entrega_Servicio_${servicio.idServicio}.pdf`);
}
