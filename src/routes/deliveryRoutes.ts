import { Request, Response, Router } from 'express';
import { DeliveryAddress, DeliveryPrice } from '../models/Delivery';
import autenticacion from '../middlewares/authentication';

class DeliveryRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  getLastDeliveryPrice(req: Request, res: Response) {
    DeliveryPrice
      .findOne()
      .sort({ createdAt: -1 })
      .exec()
      .then((deliveryPrice: any) => {
        res.status(200).json({ deliveryPrice });
      })
      .catch((err: any) => {
        res.status(500).json({
          message: 'Error al obtener el precio del delivery',
          errors: err
        });
      });
  }

  getDeliveryPrice(req: Request, res: Response) {
    DeliveryPrice.find()
      .then((deliveryPrices: any) => {
        res.status(200).json({ deliveryPrices });
      })
      .catch((err: any) => {
        res.status(500).json({
          message: 'Error al obtener el precio del delivery',
          errors: err
        });
      });
  }

  createDeliveryPrice(req: Request, res: Response) {
    const newDeliveryPrice = new DeliveryPrice(req.body);
    newDeliveryPrice.save()
      .then((deliveryPriceCreated: any) => {
        res.status(201).json({
          message: 'Precio de delivery creado',
          deliveryPrice: deliveryPriceCreated
        })
      })
      .catch((err: any) => {
        res.status(500).json({
          message: 'Error al crear el precio del delivery',
          errors: err
        });
      });
  }

  updateDeliveryPrice(req: Request, res: Response) {
    const id = req.params.id;
    const options = { new: true, runValidators: true, context: 'query' };
    DeliveryPrice.findByIdAndUpdate(id, req.body, options)
      .then((deliveryPriceUpdated: any) => {
        if (!deliveryPriceUpdated) {
          res.status(400).json({
            message: 'La dirección de delivery con el id ' + id + ' no existe',
          });
        } else {
          res.status(200).json({
            message: 'Precio de delivery actualizado',
            deliveryPrice: deliveryPriceUpdated
          });
        }
      })
      .catch((err: any) => {
        res.status(500).json({
          message: 'Error al actualizar el precio de delivery',
          errors: err
        });
      });

  }

  deleteDeliveryPrice(req: Request, res: Response) {
    const id = req.params.id;
    DeliveryPrice.findByIdAndDelete(id)
      .then((deliveryPriceDeleted: any) => {
        if (!deliveryPriceDeleted) {
          res.status(400).json({
            message: 'El precio de delivery con el id ' + id + ' no existe',
          });
        } else {
          res.status(200).json({
            message: 'Precio de delivery borrada correctamente',
            deliveryPrice: deliveryPriceDeleted
          });
        }
      })
      .catch((err: any) => {
        res.status(500).json({
          message: 'Error borrar la dirección de delivery',
          errors: err
        });
      });
  }


  getDeliveryAddress(req: Request, res: Response) {
    DeliveryAddress.find()
      .then((deliveryAddresses: any) => {
        res.status(200).json({ deliveryAddresses });
      })
      .catch((err: any) => {
        res.status(500).json({
          message: 'Error al obtener las direcciones de delivery',
          errors: err
        });
      });
  }

  createDeliveryAddress(req: Request, res: Response) {
    const newDeliveryAddress = new DeliveryAddress(req.body);
    newDeliveryAddress.save()
      .then((deliveryAddressCreated: any) => {
        res.status(201).json({
          message: 'Dirección de delivery creada',
          deliveryPrice: deliveryAddressCreated
        })
      })
      .catch((err: any) => {
        res.status(500).json({
          message: 'Error al crear la dirección del delivery',
          errors: err
        });
      });
  }

  updateDeliveryAddress(req: Request, res: Response) {
    const id = req.params.id;
    const options = { new: true, runValidators: true, context: 'query' };
    DeliveryAddress.findByIdAndUpdate(id, req.body, options)
      .then((deliveryAddressUpdated: any) => {
        if (!deliveryAddressUpdated) {
          res.status(400).json({
            message: 'La dirección de delivery con el id ' + id + ' no existe',
          });
        } else {
          res.status(200).json({
            message: 'Dirección de delivery actualizada',
            deliveryAddress: deliveryAddressUpdated
          });
        }
      })
      .catch((err: any) => {
        res.status(500).json({
          message: 'Error al actualizar la dirección de delivery',
          errors: err
        });
      });

  }

  deleteDeliveryAddress(req: Request, res: Response) {
    const id = req.params.id;
    DeliveryAddress.findByIdAndDelete(id)
      .then((deliveryAddressDeleted: any) => {
        if (!deliveryAddressDeleted) {
          res.status(400).json({
            message: 'La dirección de delivery con el id ' + id + ' no existe',
          });
        } else {
          res.status(200).json({
            message: 'Dirección de delivery borrada correctamente',
            deliveryAddress: deliveryAddressDeleted
          });
        }
      })
      .catch((err: any) => {
        res.status(500).json({
          message: 'Error borrar la dirección de delivery',
          errors: err
        });
      });
  }

  routes() {
    this.router.get('/delivery-prices-last', this.getLastDeliveryPrice);
    this.router.get('/delivery-prices', this.getDeliveryPrice);
    this.router.post('/delivery-prices', [autenticacion.verifyToken, this.createDeliveryPrice]);
    this.router.put('/delivery-prices/:id', [autenticacion.verifyToken, this.updateDeliveryPrice]);
    this.router.delete('/delivery-prices/:id', [autenticacion.verifyToken, this.deleteDeliveryPrice]);
    //this.router.put('/delivery-prices', this.updateDeliveryPrice);

    this.router.get('/delivery-address', this.getDeliveryAddress);
    this.router.post('/delivery-address', [autenticacion.verifyToken, this.createDeliveryAddress]);
    this.router.put('/delivery-address/:id', [autenticacion.verifyToken, this.updateDeliveryAddress]);
    this.router.delete('/delivery-address/:id', [autenticacion.verifyToken, this.deleteDeliveryAddress]);
  }
}

const deliveryRotues = new DeliveryRoutes();

export default deliveryRotues.router;