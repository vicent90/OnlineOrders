import { Request, Response, Router } from 'express';
import helpers from '../middlewares/helpers';
import Order from '../models/Orders';

class OrdersRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  getOrders(req: Request, res: Response) {
    // const { all, date, dateFrom, dateTo } = req.query;
    // Verify how to filter dates, in DB is with timestamp
    // ** Add a day with momentjs ?
    // ** Format createdAt ? 
    // const query = date || (dateFrom && dateTo) ?
    //   {
    //     createdAt:
    //     {
    //       $gte: date || dateFrom,
    //       $lte: date || dateTo
    //     }
    //   } : {};
    const { all, orderNumber } = req.query;
    let query = all ? {}
      : { $and: [{ status: { $ne: 'CANCELADO' } }, { status: { $ne: 'ENTREGADO' } }] };

    query = orderNumber ? req.query : {};

    Order.find(query)
      .sort({ estimatedDeliveryDate: 1 })
      .then((orders: any) => {
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
      .then((order: any) => {
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
      .then((orderUpdated: any) => {
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

  createOrder = async (req: Request, res: Response) => {
    try {
      req.body.orderNumber = (await Order.find().count() + 1) % 1000;
      const newOrder = new Order(req.body);
      const orderCreated = await newOrder.save();
      res.status(201).json({
        message: 'Pedido creado',
        order: orderCreated
      });
    } catch (err) {
      res.status(500).json({
        message: 'Error al crear el pedido',
        errors: err
      });
    }
  }

  deteleOrder(req: Request, res: Response) {
    const id = req.params.id;
    Order.findByIdAndDelete(id)
      .then((orderDeleted: any) => {
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
      .catch((err: any) => {
        res.status(500).json({
          message: 'Error borrar el pedido',
          errors: err
        });
      });
  }

  getOrdersStatusValues(req: Request, res: Response) {
    const orderStatus: any = Order.schema.path("status");
    res.status(200).json(orderStatus.enumValues);
  }


  routes() {
    this.router.get('/orders', this.getOrders);
    this.router.get('/orders-status-values', this.getOrdersStatusValues);
    this.router.get('/orders/:id', this.getOrder);
    this.router.put('/orders/:id', this.updateOrder);
    this.router.post('/orders', [helpers.decreaseProductsQuantity, this.createOrder]);
    this.router.delete('/orders/:id', this.deteleOrder);
  }
}

const ordersRoutes = new OrdersRoutes();

export default ordersRoutes.router;