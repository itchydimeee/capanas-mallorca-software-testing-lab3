import express from "express";
import { pool } from "./db";
import { PrismaClient } from "@prisma/client";
import cors from 'cors';

const prisma = new PrismaClient();

export const app = express();

async function startServer() {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app
    .post("/pogs", async (request, response) => {
      try {
        const { name, ticker_symbol, price, color } = request.body;
        const priceToInt = Number(price)
        const newPogs = await prisma.pogs.create({
          data: { name, ticker_symbol, price: priceToInt, color }
        })
        response.status(201).send(newPogs);
      } catch (err) {
        console.log("error", err);
        response.status(500).json({ error: "failed to add pogs" });
      }
    })
    .get("/pogs", async (_, response) => {
      try {
        const result = await prisma.pogs.findMany();
        response.status(200).json(result);
      } catch (err) {
        console.log("error", err);
        response.status(404).send("Not Found");
      }
    })
    .get("/pogs/:id", async (request, response) => {
      try {
        const user_id = Number(request.params.id);
        const result = await prisma.pogs.findUnique({
          where: { id: user_id }
        })
        response.status(200).json(result);
      } catch (err) {
        console.log("error", err);
        response.status(404).send("Not found");
      }
    })
    .put("/pogs/:id", async (request, response) => {
      try {
        const { name, ticker_symbol, price, color } = request.body;
        const result = await prisma.pogs.update({
          where: { id: Number(request.params.id) },
          data: { name, ticker_symbol, price, color }
        })
        response.status(200).json(result);
      } catch (err) {
        console.log("error", err);
        response.status(404).send("not found");
      }
    })

    .put("/pogs-update-price", async (request, response) => {
      try {
        const pogsData = await prisma.pogs.findMany();
        for (let pogs of pogsData) {

          // number generated between -5 and 5
          let randomAmountChange = Math.floor(Math.random() * 10) - 5;
          let currentPrice = pogs.price;
          let newPrice = currentPrice + randomAmountChange;
          await prisma.pogs.update({
            where: { id: pogs.id },
            data: { price: newPrice, prevPrice: currentPrice }
          })
        }
        response.status(200).json(pogsData);
      } catch (err) {
        console.log("error", err);
        response.status(404).send("not found");
      }
    })

    .delete("/pogs/:id", async (request, response) => {
      try {
        const result = await prisma.pogs.delete({
          where: { id: Number(request.params.id) }
        })
        response.status(200).json(result);
      } catch (err) {
        console.log("error", err);
        response.status(404).send("Not found");
      }
    })
    .post("/checkout", async (request, response) => {
      try {
        const cartIds = request.body;
        console.log('Received request body:', request.body)
        console.log('Received cartIds:', cartIds)
        const connection = await pool.connect();

        // Calculate the total price
        const result = await connection.query(
          "SELECT SUM(price) AS total_price FROM pogs WHERE id = ANY ($1::int[])",
          [cartIds]
        );
        console.log('Query result:', result);
        const { total_price } = result.rows[0];
        console.log('total price:', total_price)

        response.status(200).json({ totalPrice: total_price });
      } catch (err) {
        console.log("error", err);
        response.status(500).json({ error: "Failed to process checkout" });
      }

    })
    .use(express.static("src"))
    .listen(3000, () => {
      console.log("server started at http://localhost:3000");
    });
}



startServer();