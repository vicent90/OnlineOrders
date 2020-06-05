import express from 'express';
import mongoose from 'mongoose';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config() {

  }

  routes() {

  }

  start() {
    const port = this.app.get('port');
    this.app.listen(port, () => {
      console.log('Server on port ', port);
    });
  }
}

const server = new Server();
server.start();