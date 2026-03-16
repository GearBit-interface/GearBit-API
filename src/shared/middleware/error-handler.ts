import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  request.log.error(error);
  const statusCode = error.statusCode ?? 500;

  reply.status(statusCode).send({
    success: false,
    message: error.message ?? 'Erro interno do servidor',
    statusCode,
  });
}
