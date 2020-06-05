import { Request, Response, Router } from 'express';

class IndexRoutes {
  router: Router;

  constructor() {
    this.router = Router();
  }

  routes() {
    this.router.get('/', (req, res) => res.send("Index page"));
  }
}

const indexRoutes = new IndexRoutes();
indexRoutes.routes();

export default indexRoutes.router;