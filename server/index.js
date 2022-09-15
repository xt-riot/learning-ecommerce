const server = require('./server');
const { closeConnection } = require('./database/dbUtils');

global.serverUrl = `http://localhost:${process.env.NODE_PORT || 1337}`;

server.listen(process.env.NODE_PORT || 1337, () => {
  console.log(
    `Server Listening - http://localhost:${process.env.NODE_PORT || 1337}. ${process.env.NODE_ENV || 'development'}`
       + ' environment',
  );
});

process.on('uncaughtException', (error) => {
  console.log('Uncaught exception: ', error);
});

process.on('unhandledRejection', (error) => {
  console.log('Unhandled rejection: ', error);
});

process.on('SIGKILL', async () => {
  await closeConnection();
  console.log('Exit signal received.');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeConnection();
  console.log('Terminate signal received.');
  process.exit(0);
});
