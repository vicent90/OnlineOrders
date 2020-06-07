import { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Products';

class ProductsRoutes {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  public getProducts(req: Request, res: Response) {
    Product.find()
      .then(products => {
        res.status(200).json({ products });
      })
      .catch((err: any) => {
        res.json({
          message: 'Error al obtener productos',
          errors: err
        });
      });
  }

  public async getProduct(req: Request, res: Response): Promise<void> {
    console.log(req.params.url);
    const product = await Product.findOne({ url: req.params.url });
    res.json(product);
  }

  public createProduct(req: Request, res: Response) {
    const { name, price, description, shop, meats, meatsPreparation,
      unitMeasure, stockQuantity, imageUrl, active, updateAt } = req.body;
    const newProduct = new Product({
      name, price, description, shop, meats, meatsPreparation,
      unitMeasure, stockQuantity, imageUrl, active, updateAt
    });
    newProduct.save()
      .then(productCreated => {
        res.status(201).json({
          message: 'Producto creado',
          product: productCreated
        })
      })
      .catch((err: any) => {
        res.status(500).json({
          message: 'Error al crear el producto',
          errors: err
        });
      });
  }

  public async updateProduct(req: Request, res: Response): Promise<void> {
    const { url } = req.params;
    const product = await Product.findOneAndUpdate({ url }, req.body, { new: true });
    res.send({ message: 'product updated', product });
  }

  public deteleProduct(req: Request, res: Response) {
    const { id } = req.params;
    Product.findByIdAndDelete(id)
      .then(product => {
        res.status(200).json({
          message: 'Producto borrado correctamente',
          product
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'Error borrar el prodcuto',
          errors: err
        });
      });
  }

  routes() {
    this.router.get('/products', this.getProducts);
    // this.router.get('/products/:id', this.getProduct);
    this.router.post('/products', this.createProduct);
    // this.router.put('/products/:url', this.updateProduct);
    this.router.delete('/products/:id', this.deteleProduct);
  }
}

const productsRoutes = new ProductsRoutes();

export default productsRoutes.router;