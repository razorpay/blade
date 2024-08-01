import Fastify from 'fastify';
import { getChatCompletion } from './getChatCompletion.mjs';

const fastify = Fastify();

// Declare a route
fastify.post('/chat/completions', async (request, reply) => {
  // Access the body of the request
  const body = request.body;

  const data = await getChatCompletion(body.messages);

  // Send a response
  return data;
});

// Run the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is running at http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
