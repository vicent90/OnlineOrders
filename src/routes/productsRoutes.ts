import { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Products';

class ProductsRoutes {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  getProducts(req: Request, res: Response) {
    Product.find()
      .then(products => {
        res.status(200).json({ products });
      })
      .catch((err: any) => {
        res.status(500).json({
          message: 'Error al obtener productos',
          errors: err
        });
      });
  }

  getProduct(req: Request, res: Response) {
    const id = req.params.id;
    Product.findById(id)
      .then(product => {
        res.status(200).json({ product });
      })
      .catch((err: any) => {
        res.status(500).json({
          message: 'Error al obtener el producto',
          errors: err
        });
      });
  }

  createProduct(req: Request, res: Response) {
    const newProduct = new Product(req.body);
    newProduct.save()
      .then(product => {
        res.status(201).json({
          message: 'Producto creado',
          product
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

  deteleProduct(req: Request, res: Response) {
    const { id } = req.params;
    Product.findByIdAndDelete(id)
      .then(product => {
        if (!product) {
          res.status(400).json({
            message: 'El producto con el id ' + id + ' no existe',
          });
        }
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

  getProductsValues(req: Request, res: Response) {
    const value = req.query.value;
    if (value === "meats" ||
      value === "meatsPreparation" ||
      value === "unitMeasure") {
      res.status(200).json(Product.schema.path(value).enumValues)
    }
    res.status(400).json({ message: value + " no es un valor permitido" })
  }

  routes() {
    this.router.get('/products', this.getProducts);
    this.router.get('/products-values', this.getProductsValues)
    this.router.get('/products/:id', this.getProduct);
    this.router.post('/products', this.createProduct);
    // this.router.put('/products/:url', this.updateProduct);
    this.router.delete('/products/:id', this.deteleProduct);
  }
}

const productsRoutes = new ProductsRoutes();

export default productsRoutes.router;