export const getSaludoFecha = (): { saludo: string; fecha: string } => {
  const now = new Date();
  const hora = now.getHours();

  let saludo;
  // Determinar saludo
  if (hora >= 6 && hora < 12) {
    saludo = "Buenos días";
  } else if (hora >= 12 && hora < 19) {
    saludo = "Buenas tardes";
  } else {
    saludo = "Buenas noches";
  }

  // Formatear fecha
  const opcionesFecha: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const fecha = now.toLocaleDateString("es-ES", opcionesFecha);

  return {
    saludo,
    fecha, // ejemplo: "20 de mayo de 2025"
  };
};
