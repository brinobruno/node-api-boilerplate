ref: https://github.com/brinobruno/agriculture-api/blob/main/README.md

create migration:
pnpm typeorm migration:create src/migrations/MIGRATION_NAME

example redis caching
import Redis from 'ioredis';
const redis = new Redis();

async getAll(_request: FastifyRequest, reply: FastifyReply) {
  const cachedUsers = await redis.get('users');
  if (cachedUsers) {
    return reply.code(200).send({ users: JSON.parse(cachedUsers) });
  }

  const users = await User.find();
  await redis.set('users', JSON.stringify(users), 'EX', 60); // Cache for 60 seconds
  return reply.code(200).send({ users });
}