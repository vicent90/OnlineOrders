import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import SEED from '../config/config';


class Authentication {

  verifyToken = (req: any, res: Response, next: NextFunction) => {
    const token = req.query.token;
    jwt.verify(token, SEED, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({
          message: 'Token no valido',
          errors: err
        });
      }
      if (decoded.user.locked) {
        return res.status(401).json({
          message: 'Usuario no activo'
        });
      }
      req.user = decoded.user;
      next();
    });
  }

  verifyAdminRole = (req: any, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user.role !== 'ADMIN') {
      return res.status(401).json({
        mensaje: 'Token incorrecto - No es admin',
      });
    } else {
      next();
    }
  }

}

const authentication = new Authentication();

export default authentication;