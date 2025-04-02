export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

// 400 - Requisição inválida
export class BadRequestError extends ApiError {
  constructor(message = "Requisição inválida") {
    super(message, 400);
  }
}

// 401 - Não autorizado
export class UnauthorizedError extends ApiError {
  constructor(message = "Não autorizado") {
    super(message, 401);
  }
}

// 403 - Proibido (ação não permitida)
export class ForbiddenError extends ApiError {
  constructor(message = "Ação não permitida") {
    super(message, 403);
  }
}

// 404 - Não encontrado
export class NotFoundError extends ApiError {
  constructor(message = "Recurso não encontrado") {
    super(message, 404);
  }
}

// 409 - Conflito (ex: usuário já existe)
export class ConflictError extends ApiError {
  constructor(message = "Conflito de dados") {
    super(message, 409);
  }
}

// 422 - Dados inválidos (ex: validação falhou)
export class UnprocessableEntityError extends ApiError {
  constructor(message = "Dados inválidos") {
    super(message, 422);
  }
}
