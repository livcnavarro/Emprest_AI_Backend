import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { throwLoanRequestError } from '../src/loans/loan-errors';

describe('resultados de request_loan', () => {
  it.each([
    ['OVERDUE_LOAN', ConflictException],
    ['LIMIT_REACHED', ConflictException],
    ['EQUIPMENT_UNAVAILABLE', ConflictException],
    ['PROFILE_NOT_FOUND', ForbiddenException],
    ['EQUIPMENT_NOT_FOUND', NotFoundException],
  ])('mapeia %s para um erro REST explícito', (outcome, ErrorType) => {
    expect(() => throwLoanRequestError(outcome)).toThrow(ErrorType);
  });

  it('rejeita resultados de banco desconhecidos', () => {
    expect(() => throwLoanRequestError('UNKNOWN')).toThrow(
      'resultado inesperado',
    );
  });
});
