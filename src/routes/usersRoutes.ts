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
      .then((user: any) => {
        if (!user) {
          return res.status(400).json({
            message: 'El usuario con el id ' + id + ' no existe',
          });
        }
        user.passDB = '********';
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
      .then(user => {
        res.status(201).json({
          message: 'Usuario creado',
          user,
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
    const { id } = req.params;
    const query = req.user.role === 'SA_ROLE' ?
      { _id: id } : { _id: id, client: req.user.client };
    if (req.body.passDB) {
      req.body.passDB = bcrypt.hashSync(req.body.passDB, 10);
    } else { delete req.body.passDB; }
    if (req.user.role === 'USER_ROLE' && req.body.role !== 'USER_ROLE') {
      return res.status(400).json({
        ok: false,
        message: 'Un usuario normal no se puede cambiar el role',
        errors: { message: 'Un usuario normal no se puede cambiar el role' }
      })
    }
    User.findOneAndUpdate(query, req.body, { new: true }, (err, userUpdated) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: 'Error al buscar usuario',
          errors: err
        });
      }

      if (!userUpdated) {
        return res.status(400).json({
          ok: false,
          message: 'El usuario con el id ' + id + ' no existe',
          errors: { message: 'No existe un usuario con ese ID' }
        });
      }

      res.status(200).json({
        ok: true,
        message: 'Usuario actualizado',
        user: userUpdated
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
    User.findByIdAndDelete(id)
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
    //this.router.post('/users', [this.createUser]);
    this.router.post('/users', [autenticacion.verifyToken, autenticacion.verifyAdminRole, this.createUser]);
    this.router.put('/users/:id', [autenticacion.verifyToken, autenticacion.verifyAdminRole, this.updateUser]);
    this.router.delete('/users/:id', [autenticacion.verifyToken, autenticacion.verifyAdminRole, this.deteleUser]);
  }
}

const userRoutes = new UserRoutes();

export default userRoutes.router;