import express, { response } from "express";
import { randomUUID } from "crypto";
import fs from "fs";

const server = express();
server.use(express.json());

let products: { id: string; name: string; price: number }[] = [];

fs.readFile("products.json", "utf-8", (err: any, data: string) => {
  if (err) {
    console.log(err);
  } else {
    products = JSON.parse(data);
  }
});

server.post("/products", (req, res) => {
  const { name, price } = req.body;

  const product = {
    id: randomUUID(),
    name,
    price,
  };

  products.push(product);

  productFile();

  return res.json(product);
});

server.get("/products", (req, res) => {
  return res.json(products);
});

server.get("/products/:id", (req, res) => {
  const { id } = req.params;

  const product = products.find((product) => product.id === id);
  return res.json(product);
});

server.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const productIndex = products.findIndex((product) => product.id === id);
  products[productIndex] = {
    ...products[productIndex],
    name,
    price,
  };

  productFile();

  return response.json({ message: "Product updated" });
});

server.delete("/products/:id", (req, res) => {
  const { id } = req.params;

  const productIndex = products.findIndex((product) => product.id === id);

  products.splice(productIndex, 1);

  productFile();

  return res.json({ message: "Product deleted" });
});

const productFile = () => {
  fs.writeFile("products.json", JSON.stringify(products), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Product added");
    }
  });
};

export default server;
