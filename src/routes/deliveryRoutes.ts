import { Request, Response, Router } from 'express';
import { DeliveryAddress, DeliveryPrice } from '../models/Delivery';

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

  // updateDeliveryPrice(req: Request, res: Response) {
  //   const options = { new: true, upsert: true, runValidators: true, context: 'query' };
  //   // DeliveryPrice.update({}, req.body, options)
  //   DeliveryPrice.findOneAndUpdate({}, req.body, options)
  //     .then((deliveryPriceUpdated: any) => {
  //       res.status(200).json({
  //         message: 'Precio del delivery actualizado',
  //         order: deliveryPriceUpdated
  //       });
  //     })
  //     .catch((err: any) => {
  //       res.status(500).json({
  //         message: 'Error al obtener el precio del delivery',
  //         errors: err
  //       });
  //     });
  // }

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
    this.router.get('/delivery-prices', this.getLastDeliveryPrice);
    this.router.post('/delivery-prices', this.createDeliveryPrice);
    //this.router.put('/delivery-prices', this.updateDeliveryPrice);

    this.router.get('/delivery-address', this.getDeliveryAddress);
    this.router.post('/delivery-address', this.createDeliveryAddress);
    this.router.put('/delivery-address/:id', this.updateDeliveryAddress);
    this.router.delete('/delivery-address/:id', this.deleteDeliveryAddress);
  }
}

const deliveryRotues = new DeliveryRoutes();

export default deliveryRotues.router;