import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyAccessToken } from '../../lib/token.js';
import prisma from '#database';

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const accessToken = request.cookies['accessToken'];

  if (!accessToken) {
    return reply.status(401).send({
      success: false,
      message: 'Usuario nao autenticado',
      statusCode: 401,
    });
  }

  try {
    const payload = verifyAccessToken(accessToken);

    // Fetch user and session
    const session = await prisma.session.findFirst({
      where: { userId: payload.sub },
      include: { user: true },
    });

    if (!session) {
      return reply.status(401).send({
        success: false,
        message: 'Sessao nao encontrada',
        statusCode: 401,
      });
    }


    // Pass user and session to controllers
    request.user = { id: payload.sub, sessionId: session.id, isAdmin: session.user.role === 'ADMIN' };
  } catch {
    return reply.status(401).send({
      success: false,
      message: 'Token invalido ou expirado',
      statusCode: 401,
    });
  }
}
