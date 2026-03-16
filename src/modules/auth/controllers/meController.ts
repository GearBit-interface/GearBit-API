import { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '#database';

export async function meController(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.user;

  const user = await prisma.user.findUnique({
    where: { id },
    include: { sessions: true, activeLogs: true, oauthAccounts: true },
  });

  return reply.status(200).send({
    success: true,
    message: 'Usuario recuperado com sucesso',
    statusCode: 200,
    data: user,
  });
}
