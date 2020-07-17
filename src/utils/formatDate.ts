const formatValue = (date: Date): string =>
  Intl.DateTimeFormat('pt-BR').format(new Date(date));
export default formatValue;
