import express from 'express';
import mongoose from 'mongoose';

import indexRoutes from './routes/indexRoutes';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config() {
    const MONGO_LOCAL = '';
    mongoose.set('useFindAndModify', true);
    mongoose.connect(process.env.MONGODB_URI || MONGO_LOCAL, {
      useNewUrlParser: true,
      useCreateIndex: true
    })
      .then(() => {
        console.log(process.env.MONGODB_URI);
        console.log('Base de datos conectada');
      })
      .catch(() => {
        console.log(process.env.MONGODB_URI);
        console.log('Error al conectar a db Heroku')
      });

    this.app.set('port', process.env.PORT || 3000);
    // Middlewares
    this.app.use(express.json()); // Replace of body parser
    this.app.use(express.urlencoded({ extended: false }));
  }

  routes() {
    this.app.use(indexRoutes);
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