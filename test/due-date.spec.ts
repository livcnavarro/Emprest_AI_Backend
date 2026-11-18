import { calculateDueDate } from '../src/loans/due-date';

describe('calculateDueDate — 14 dias corridos', () => {
  it('inclui fins de semana no prazo', () => {
    expect(calculateDueDate(new Date('2026-11-13T15:00:00.000Z'))).toBe(
      '2026-11-27',
    );
  });

  it('interpreta a data do pedido no fuso de São Paulo', () => {
    const beforeLocalMidnight = new Date('2026-11-18T02:30:00.000Z');
    const afterLocalMidnight = new Date('2026-11-18T03:30:00.000Z');

    expect(calculateDueDate(beforeLocalMidnight)).toBe('2026-12-01');
    expect(calculateDueDate(afterLocalMidnight)).toBe('2026-12-02');
  });

  it('rejeita uma data inválida', () => {
    expect(() => calculateDueDate(new Date(Number.NaN))).toThrow(
      'Data do pedido inválida.',
    );
  });
});
