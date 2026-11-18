import {
  BadGatewayException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export function throwLoanRequestError(outcome: string): never {
  switch (outcome) {
    case 'UNAUTHENTICATED':
      throw new UnauthorizedException('Sessão obrigatória.');
    case 'PROFILE_NOT_FOUND':
      throw new ForbiddenException('Perfil do colaborador não cadastrado.');
    case 'OVERDUE_LOAN':
      throw new ConflictException(
        'Você tem um empréstimo em atraso e não pode solicitar outro.',
      );
    case 'LIMIT_REACHED':
      throw new ConflictException(
        'Você já possui três empréstimos em aberto.',
      );
    case 'EQUIPMENT_NOT_FOUND':
      throw new NotFoundException('Equipamento não encontrado.');
    case 'EQUIPMENT_UNAVAILABLE':
      throw new ConflictException(
        'Este equipamento não está disponível para empréstimo.',
      );
    default:
      throw new BadGatewayException(
        'O banco retornou um resultado inesperado ao solicitar o empréstimo.',
      );
  }
}
