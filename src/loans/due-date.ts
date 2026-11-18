const CALENDAR_DAYS_TO_ADD = 14;
const SAO_PAULO_TIME_ZONE = 'America/Sao_Paulo';

function getLocalDateParts(date: Date): {
  year: number;
  month: number;
  day: number;
} {
  if (Number.isNaN(date.getTime())) {
    throw new RangeError('Data do pedido inválida.');
  }

  const parts = new Intl.DateTimeFormat('en', {
    timeZone: SAO_PAULO_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = new Map(parts.map(({ type, value }) => [type, value]));

  return {
    year: Number(values.get('year')),
    month: Number(values.get('month')),
    day: Number(values.get('day')),
  };
}

export function calculateDueDate(requestedAt: Date): string {
  const { year, month, day } = getLocalDateParts(requestedAt);
  const dueDate = new Date(Date.UTC(year, month - 1, day));
  dueDate.setUTCDate(dueDate.getUTCDate() + CALENDAR_DAYS_TO_ADD);

  const dueYear = dueDate.getUTCFullYear();
  const dueMonth = String(dueDate.getUTCMonth() + 1).padStart(2, '0');
  const dueDay = String(dueDate.getUTCDate()).padStart(2, '0');

  return `${dueYear}-${dueMonth}-${dueDay}`;
}
