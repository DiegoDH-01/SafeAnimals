import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Genera un PDF con la información del servicio entregado
 * @param {Object} servicio - Servicio entregado con campos completos
 */
export function generarReportePDF(servicio) {
  console.log("📄 Generando PDF con:", servicio); // 🔍 Añadir este log

  const doc = new jsPDF();

  // Agregar el logo en la parte superior
  try {
    // Crear un elemento de imagen para obtener las dimensiones
    const img = new Image();
    img.src = '/src/assets/logo.png';
    
    // Agregar el logo en la esquina superior izquierda
    doc.addImage('/src/assets/logo.png', 'PNG', 14, 10, 30, 15);
    
    // Mover el título hacia la derecha para dar espacio al logo
    doc.setFontSize(18);
    doc.text('Reporte de Entrega de Mascota', 50, 20);
  } catch (error) {
    console.log('No se pudo cargar el logo, continuando sin él');
    // Si no se puede cargar el logo, mostrar solo el título
    doc.setFontSize(18);
    doc.text('Reporte de Entrega de Mascota', 14, 20);
  }

  doc.setFontSize(12);
  doc.text(`Fecha de entrega: ${servicio.fechaFinalizacion}`, 14, 35);
  doc.text(`Servicio: ${servicio.referencia}`, 14, 43);
  doc.text(`Encargado: ${servicio.usuario?.nombres || ''} ${servicio.usuario?.apellidos || ''}`, 14, 51);
  doc.text(`Estado: ${servicio.estado?.nombreEstado || ''}`, 14, 59);

  doc.text('Datos de la Mascota:', 14, 71);
  autoTable(doc, {
    startY: 75,
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
