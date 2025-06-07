export const getInitials = (nombre?: string, apellido?: string) => {
  const n = nombre?.trim()?.[0]?.toUpperCase() ?? "";
  const a = apellido?.trim()?.[0]?.toUpperCase() ?? "";
  return `${n}${a}`;
};
