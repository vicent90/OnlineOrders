import { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import helpers from '../middlewares/helpers';
import Order from '../models/Orders';

class OrdersRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  getOrders(req: Request, res: Response) {
    const { date, dateFrom, dateTo } = req.query;
    // Verify how to filter dates, in DB is with timestamp
    // ** Add a day with momentjs ?
    // ** Format createdAt ? 
    const query = date || (dateFrom && dateTo) ?
      {
        createdAt:
        {
          $gte: date || dateFrom,
          $lte: date || dateTo
        }
      } : {};

    Order.find(query)
      .then(orders => {
        res.status(200).json({ orders });
      })
      .catch((err: any) => {
        res.status(500).json({
          message: 'Error al obtener los pedidos',
          errors: err
        });
      });
  }

  getOrder(req: Request, res: Response) {
    const id = req.params.id;
    Order.findById(id)
      .then(order => {
        res.status(200).json({ order });
      })
      .catch((err: any) => {
        res.status(500).json({
          message: 'Error al obtener el pedido',
          errors: err
        });
      });
  }

  updateOrder(req: Request, res: Response) {
    const id = req.params.id;
    Order.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
      .then(orderUpdated => {
        if (!orderUpdated) {
          res.status(400).json({
            message: 'El pedido con el id ' + id + ' no existe',
          });
        }
        res.status(200).json({
          message: 'Pedido actualizado',
          order: orderUpdated
        });
      })
      .catch((err: any) => {
        res.status(500).json({
          message: 'Error al obtener el pedido',
          errors: err
        });
      });
  }

  createOrder(req: Request, res: Response) {
    const newOrder = new Order(req.body);
    newOrder.save()
      .then(orderCreated => {
        res.status(201).json({
          message: 'Pedido creado',
          order: orderCreated
        })
      })
      .catch((err: any) => {
        res.status(500).json({
          message: 'Error al crear el pedido',
          errors: err
        });
      });
  }

  deteleOrder(req: Request, res: Response) {
    const id = req.params.id;
    Order.findByIdAndDelete(id)
      .then(orderDeleted => {
        if (!orderDeleted) {
          res.status(400).json({
            message: 'El pedido con el id ' + id + ' no existe',
          });
        }
        res.status(200).json({
          message: 'Pedido borrado correctamente',
          order: orderDeleted
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'Error borrar el pedido',
          errors: err
        });
      });
  }

  getOrdersStatusValues(req: Request, res: Response) {
    res.status(200).json(Order.schema.path("status").enumValues);
  }

  routes() {
    this.router.get('/orders', this.getOrders);
    this.router.get('/orders-status-values', this.getOrdersStatusValues);
    this.router.get('/orders/:id', this.getOrder);
    this.router.put('/orders/:id', this.updateOrder);
    this.router.post('/orders', [helpers.decreaseProductsQuantity, this.createOrder]);
    // this.router.put('/orders/:url', this.updateOrder);
    this.router.delete('/orders/:id', this.deteleOrder);
  }
}

const ordersRoutes = new OrdersRoutes();

export default ordersRoutes.router;