require('dotenv').config();

import http from 'http';
import { app } from './app';
import { origin, port } from './env';
import { server } from './server';

require('events').EventEmitter.defaultMaxListeners = 50;

server.applyMiddleware({
  app,
  path: '/graphql',
  cors: { credentials: true, origin },
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
