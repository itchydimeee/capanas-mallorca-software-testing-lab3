import express from "express";
import { pool } from "./db";
import cors from 'cors';

export const app = express();

async function startServer() {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app
    .post("/pogs", async (request, response) => {
      try {
        const { name, ticker_symbol, price, color } = request.body;
        const connection = await pool.connect();
        const newPogs = await connection.query(
          "INSERT INTO pogs (name, ticker_symbol, price, color) VALUES ($1, $2, $3, $4) RETURNING *",
          [name, ticker_symbol, price, color]
        );
        response.status(201).json(newPogs.rows);
      } catch (err) {
        console.log("error", err);
        response.status(500).json({ error: "failed to add pogs" });
      }
    })
    .get("/pogs", async (_, response) => {
      try {
        const connection = await pool.connect();
        const result = await connection.query("SELECT * FROM pogs");
        response.status(200).json(result.rows);
      } catch (err) {
        console.log("error", err);
        response.status(404).send("Not Found");
      }
    })
    .get("/pogs/:id", async (request, response) => {
      try {
        const id = request.params.id;
        const connection = await pool.connect();
        const result = await connection.query(
          "SELECT * FROM pogs WHERE id = $1",
          [id]
        );
        response.status(200).json(result.rows);
      } catch (err) {
        console.log("error", err);
        response.status(404).send("Not found");
      }
    })
    .put("/pogs/:id", async (request, response) => {
      try {
        const { name, ticker_symbol, price, color } = request.body;
        const connection = await pool.connect();
        const result = await connection.query(
          "UPDATE pogs SET name = $1, ticker_symbol = $2, price = $3, color = $4 WHERE id = $5 RETURNING *",
          [name, ticker_symbol, price, color, request.params.id]
        );
        response.status(200).json(result.rows);
      } catch (err) {
        console.log("error", err);
        response.status(404).send("not found");
      }
    })
    .delete("/pogs/:id", async (request, response) => {
      try {
        const connection = await pool.connect();
        const result = await connection.query(
          "DELETE FROM pogs WHERE id = $1 RETURNING *",
          [request.params.id]
        );
        response.status(200).json(result.rows);
      } catch (err) {
        console.log("error", err);
        response.status(404).send("Not found");
      }
    })
    .post("/checkout", async (request, response) => {
      try {
        const cartIds  = request.body;
        console.log('Received request body:' , request.body)
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

        // Update the order status or perform any other necessary actions
        // ...

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