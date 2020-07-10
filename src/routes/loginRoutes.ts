import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/Users';
import { SEED } from '../config/config';

class LoginRoutes {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  loginUser = (req: Request, res: Response) => {
    const body = req.body;
    User.findOne({ userName: body.userName })
      .then((user: any) => {
        if (!body.userName || !body.pass) {
          return res.status(400).json({
            message: 'Error en el body',
          });
        }
        if (!user) {
          return res.status(404).json({
            message: 'Usuario inexistente',
          });
        }
        if (user.locked) {
          return res.status(401).json({
            message: 'Usuario desactivado'
          });
        }
        if (!bcrypt.compareSync(body.pass, user.passDB)) {
          // if (user.pass != body.pass) {
          return res.status(400).json({
            message: 'Credenciales incorrectas'
          });
        }
        user.passDB = '*************';
        const token = jwt.sign({ user }, SEED, { expiresIn: 14400 });

        res.status(200).json({
          token,
          user,
        });
      })
      .catch(err => {
        return res.status(500).json({
          message: 'Error al buscar usuario',
          errors: err
        });
      });


  }

  routes() {
    this.router.post('/login', this.loginUser);
  }
}

const loginRoutes = new LoginRoutes();

export default loginRoutes.router;
