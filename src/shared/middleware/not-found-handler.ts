import { FastifyReply, FastifyRequest } from 'fastify';

export function notFoundHandler(request: FastifyRequest, reply: FastifyReply) {
  const statusCode = 404;

  reply.status(statusCode).send({
    success: false,
    message: `Rota ${request.method} ${request.url} nao encontrada`,
    statusCode,
  });
}
