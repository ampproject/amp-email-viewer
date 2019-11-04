const server = require('./server');

/** @const {number} */
const port = process.env.PORT || 3000;

server.start(port).then(() => {
  console.log(`Server listening on port ${port}`);
});
