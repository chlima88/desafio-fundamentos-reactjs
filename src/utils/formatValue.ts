const formatValue = (value: number | string): string => {
  if (typeof value === 'string') {
    return value;
  }
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default formatValue;
