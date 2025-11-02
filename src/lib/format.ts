import { formatUnits } from 'viem';

/**
 * Formatea un valor de USDC (6 decimales) a string legible
 * @param value - Valor en formato BigInt con 6 decimales
 * @returns String formateado con 2 decimales y símbolo de dólar
 */
export function formatUSDC(value: bigint | undefined): string {
  if (!value) return '$0.00';
  const formatted = formatUnits(value, 6);
  const number = parseFloat(formatted);
  return `$${number.toFixed(2)}`;
}

/**
 * Formatea un valor de MXN a string legible
 * @param value - Valor en formato BigInt
 * @returns String formateado con 2 decimales y símbolo de peso
 */
export function formatMXN(value: bigint | undefined): string {
  if (!value) return '$0.00 MXN';
  const formatted = formatUnits(value, 2);
  const number = parseFloat(formatted);
  return `$${number.toFixed(2)} MXN`;
}

/**
 * Formatea un valor de MXN desde el contrato (con bug de división)
 * @param value - Valor en formato BigInt con el bug del contrato
 * @returns String formateado con 2 decimales y símbolo de peso
 */
export function formatMXNFromContract(value: bigint | undefined): string {
  if (!value) return '$0.00 MXN';
  // El contrato divide por 100 en lugar de 10000
  // Compensamos tratando como 4 decimales
  const formatted = formatUnits(value, 4);
  const number = parseFloat(formatted);
  return `$${number.toFixed(2)} MXN`;
}

/**
 * Formatea el tipo de cambio (2 decimales)
 * @param rate - Tipo de cambio en formato BigInt (multiplicado por 100)
 * @returns String formateado
 */
export function formatExchangeRate(rate: bigint | undefined): string {
  if (!rate) return '0.00';
  const formatted = formatUnits(rate, 2);
  return parseFloat(formatted).toFixed(2);
}

/**
 * Formatea un porcentaje (2 decimales)
 * @param pct - Porcentaje en formato BigInt (multiplicado por 100)
 * @returns String formateado con símbolo de porcentaje
 */
export function formatPercentage(pct: bigint | undefined): string {
  if (!pct) return '0.00%';
  const formatted = formatUnits(pct, 2);
  return `${parseFloat(formatted).toFixed(2)}%`;
}

/**
 * Trunca una dirección de Ethereum para mostrar
 * @param address - Dirección completa
 * @returns Dirección truncada (0x1234...5678)
 */
export function truncateAddress(address: string | undefined): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Formatea una fecha desde timestamp
 * @param timestamp - Timestamp en segundos
 * @returns Fecha formateada
 */
export function formatTimestamp(timestamp: bigint | undefined): string {
  if (!timestamp) return '';
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Genera un código aleatorio de 6 caracteres alfanuméricos
 * @returns Código único
 */
export function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Convierte el estado de la remesa a texto legible
 * @param status - Estado como número (0=Pending, 1=Locked, 2=ReadyForPickup, 3=Claimed, 4=Expired, 5=Cancelled)
 * @returns Texto del estado
 */
export function getRemittanceStatusText(status: number | undefined): string {
  if (status === undefined) return 'Desconocido';
  const statusMap: Record<number, string> = {
    0: 'Pendiente',
    1: 'Bloqueada',
    2: 'Lista para retirar',
    3: 'Reclamada',
    4: 'Expirada',
    5: 'Cancelada',
  };
  return statusMap[status] || 'Desconocido';
}

/**
 * Obtiene el color del badge según el estado
 * @param status - Estado como número
 * @returns Clase de Tailwind para el color
 */
export function getRemittanceStatusColor(status: number | undefined): string {
  if (status === undefined) return 'bg-gray-500';
  const colorMap: Record<number, string> = {
    0: 'bg-yellow-500',  // Pendiente
    1: 'bg-orange-500',  // Bloqueada
    2: 'bg-green-500',   // Lista para retirar (Ready)
    3: 'bg-blue-500',    // Reclamada (Claimed)
    4: 'bg-gray-500',    // Expirada
    5: 'bg-red-500',     // Cancelada
  };
  return colorMap[status] || 'bg-gray-500';
}
