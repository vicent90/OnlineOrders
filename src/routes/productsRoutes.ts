import { Request, Response, Router } from 'express';
const { readdir } = require('fs').promises;
import path from "path";
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

  updateProduct(req: Request, res: Response) {
    const id = req.params.id;
    Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true, context: 'query' })
      .then(productUpdated => {
        if (!productUpdated) {
          res.status(400).json({
            message: 'El producto con el id ' + id + ' no existe'
          });
        } else {
          res.status(200).json({
            message: 'Producto actualizado',
            product: productUpdated
          });
        }
      })
      .catch((err: any) => {
        res.status(500).json({
          message: 'Error al actualizar el producto',
          errors: err
        });
      });
  }

  createProduct(req: Request, res: Response) {
    const newProduct = new Product(req.body);
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

  deteleProduct(req: Request, res: Response) {
    const { id } = req.params;
    Product.findByIdAndDelete(id)
      .then(productDeleted => {
        if (!productDeleted) {
          res.status(400).json({
            message: 'El producto con el id ' + id + ' no existe',
          });
        }
        res.status(200).json({
          message: 'Producto borrado correctamente',
          product: productDeleted
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'Error borrar el producto',
          errors: err
        });
      });
  }

  getProductsValues(req: Request, res: Response) {
    const value = req.query.value;
    if (value === "meats" ||
      value === "meatsPreparation" ||
      value === "unitMeasure" ||
      value === "fruits") {
      const productStatus: any = Product.schema.path(value);
      res.status(200).json(productStatus.enumValues);
    }
    res.status(400).json({ message: value + " no es un valor permitido" })
  }

  getImagesMeatsNames(req: Request, res: Response) {
    readdir(path.join(__dirname, '..', './images/meats'), { withFileTypes: true })
      .then((images: any) => {
        res.status(200).json({ images });
      })
      .catch((err: Error) => {
        res.status(400).json({
          message: 'No se pudo obtener el nombres de las imágenes',
          errors: err
        });
      });
  }

  getImagesFruitsNames(req: Request, res: Response) {
    readdir(path.join(__dirname, '..', './images/fruits'), { withFileTypes: true })
      .then((images: any) => {
        res.status(200).json({ images });
      })
      .catch((err: Error) => {
        res.status(400).json({
          message: 'No se pudo obtener el nombres de las imágenes',
          errors: err
        });
      });
  }

  routes() {
    this.router.get('/products', this.getProducts);
    this.router.get('/products-values', this.getProductsValues)
    this.router.get('/products/:id', this.getProduct);
    this.router.put('/products/:id', this.updateProduct);
    this.router.post('/products', this.createProduct);
    this.router.delete('/products/:id', this.deteleProduct);
    this.router.get('/images-meats-names', this.getImagesMeatsNames);
    this.router.get('/images-fruits-names', this.getImagesFruitsNames);
  }
}

const productsRoutes = new ProductsRoutes();

export default productsRoutes.router;