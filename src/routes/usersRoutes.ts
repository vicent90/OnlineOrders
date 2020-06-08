import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/Users';
import autenticacion from '../middlewares/authentication';

class UserRoutes {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  getUsers(req: any, res: Response) {
    User.find()
      .select('-passDB')
      .then(users => {
        res.status(200).json({ users });
      })
      .catch(err => {
        return res.status(500).json({
          message: 'Error cargando usuarios',
          errors: err
        });
      });
  }

  getUser(req: any, res: Response) {
    const { id } = req.params;
    User.findById(id)
      .select('-passDB')
      .then((user: any) => {
        if (!user) {
          return res.status(400).json({
            message: 'El usuario con el id ' + id + ' no existe',
          });
        }
        res.status(200).json({ user });
      })
      .catch(err => {
        return res.status(500).json({
          message: 'Error al buscar usuario',
          errors: err
        });
      });
  }

  createUser(req: any, res: Response) {
    const { userName, pass, role } = req.body;
    if (!pass || !userName) {
      return res.status(400).json({
        message: 'El userName/pass no puede ser nulo'
      });
    }
    const passDB = bcrypt.hashSync(pass, 10);
    const newUser = new User({ userName, passDB, role });
    newUser.save()
      .then(userCreatead => {
        res.status(201).json({
          message: 'Usuario creado',
          user: userCreatead,
          usuarioToken: req.user
        });
      })
      .catch((err: any) => {
        return res.status(400).json({
          message: 'Error al crear usuario',
          errors: err
        });
      });
  }


  updateUser(req: any, res: Response) {
    const id = req.params.id;
    // delete req.body.userName;
    if (req.body.passDB) {
      req.body.passDB = bcrypt.hashSync(req.body.passDB, 10);
    } else {
      delete req.body.passDB;
    }
    console.log(req.body)
    User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true, context: 'query' })
      .select('-passDB')
      .then(userUpdated => {
        if (!userUpdated) {
          return res.status(400).json({
            message: 'El usuario con el id ' + id + ' no existe',
          });
        }
        res.status(200).json({
          message: 'Usuario actualizado',
          user: userUpdated
        });
      })
      .catch(err => {
        return res.status(500).json({
          message: 'Error al actualizar el usuario',
          errors: err
        });
      });
  }

  deteleUser(req: any, res: Response) {
    const { id } = req.params;
    if (id === req.user._id) {
      return res.status(400).json({
        message: 'No se puede eliminar a si mismo'
      });
    }
    User.findByIdAndDelete(id, { select: -'passDB' })
      .select('-passDB')
      .then(userDeleted => {
        if (!userDeleted) {
          return res.status(400).json({
            message: 'El usuario con el id ' + id + ' no existe',
          });
        } else {
          return res.status(200).json({
            message: 'Usuario borrado',
            user: userDeleted
          });
        }
      })
      .catch(err => {
        return res.status(500).json({
          message: 'Error al borrar usuario',
          errors: err
        });
      });
  }

  routes() {
    this.router.get('/users', [autenticacion.verifyToken, this.getUsers]);
    //this.router.get('/users', [this.getUsers]);
    this.router.get('/users/:id', [autenticacion.verifyToken, this.getUser]);
    this.router.put('/users/:id', [autenticacion.verifyToken, autenticacion.verifyAdminRole, this.updateUser]);
    this.router.post('/users', [this.createUser]);
    //this.router.post('/users', [autenticacion.verifyToken, autenticacion.verifyAdminRole, this.createUser]);
    this.router.delete('/users/:id', [autenticacion.verifyToken, autenticacion.verifyAdminRole, this.deteleUser]);
  }
}

const userRoutes = new UserRoutes();

export default userRoutes.router;