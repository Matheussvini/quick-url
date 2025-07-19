import { FastifyRequest, FastifyReply } from 'fastify';

export function verifyJwt({ allowAnonymous = false } = {}) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.headers.authorization;
    if (!token && allowAnonymous) return;

    try {
      await request.jwtVerify();
    } catch (err) {
      return reply
        .status(401)
        .send({ message: 'Unauthorized or invalid token.' });
    }
  };
}
