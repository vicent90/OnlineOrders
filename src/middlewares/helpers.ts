import { Request, Response, NextFunction } from 'express';
import Products from '../models/Products';

class Helpers {

  decreaseProductsQuantity = (req: any, res: Response, next: NextFunction) => {
    const bulkOps = req.body.products.map((product: any) => {
      return {
        updateOne: {
          filter: { _id: product._id },
          update: { $inc: { quantity: -product.quantity } }
        }
      }
    });

    Products.bulkWrite(bulkOps)
      .then(() => next())
      .catch(err => {
        res.status(500).json({
          message: 'Error al actualizar cantidad de productos',
          errors: err
        });
      })
  }
}

const helpers = new Helpers();

export default helpers;