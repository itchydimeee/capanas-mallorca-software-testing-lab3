import express from 'express'
import { PrismaClient } from '@prisma/client'
import cors from 'cors'

const prisma = new PrismaClient()

export const app = express()

async function startServer () {
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app
    .get('/users/:userId', async (request, response) => {
      try {
        const userId = Number(request.params.userId);
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { Inventory: true }
        })
        if (!user) {
          response.status(404).send('User not found')
        } else {
          response.status(200).json(user)
        }
      } catch (err) {
        console.log('error', err)
        response.status(500).json({ error: 'Failed to fetch user' })
      }
    })
    .post('/users', async (request, response) => {
      try {
        const { auth0_id, email, name } = request.body
        const newUser = await prisma.user.create({
          data: { auth0_id, email, name }
        })
        response.status(201).json(newUser)
      } catch (err) {
        console.log('error', err)
        response.status(500).json({ error: 'failed to create user' })
      }
    })
    .put('/users/:userId', async (request, response) => {
      try {
        const userId = Number(request.params.userId);
        const { name, email, balance } = request.body
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { name, email, balance }
        })
        if (!updatedUser) {
          response.status(404).send('User not found')
        } else {
          response.status(200).json(updatedUser)
        }
      } catch (err) {
        console.log('error', err)
        response.status(500).json({ error: 'failed to update user' })
      }
    })
    .post('/pogs', async (request, response) => {
      try {
        const { name, ticker_symbol, price, color } = request.body
        const priceToInt = Number(price)
        const newPogs = await prisma.pogs.create({
          data: { name, ticker_symbol, price: priceToInt, color }
        })
        response.status(201).send(newPogs)
      } catch (err) {
        console.log('error', err)
        response.status(500).json({ error: 'failed to add pogs' })
      }
    })
    .get('/pogs', async (_, response) => {
      try {
        const result = await prisma.pogs.findMany()
        response.status(200).json(result)
      } catch (err) {
        console.log('error', err)
        response.status(404).send('Not Found')
      }
    })
    .get('/pogs/:id', async (request, response) => {
      try {
        const user_id = Number(request.params.id)
        const result = await prisma.pogs.findUnique({
          where: { id: user_id }
        })
        response.status(200).json(result)
      } catch (err) {
        console.log('error', err)
        response.status(404).send('Not found')
      }
    })
    .put('/pogs/:id', async (request, response) => {
      try {
        const { name, ticker_symbol, price, color } = request.body
        const result = await prisma.pogs.update({
          where: { id: Number(request.params.id) },
          data: { name, ticker_symbol, price, color }
        })
        response.status(200).json(result)
      } catch (err) {
        console.log('error', err)
        response.status(404).send('not found')
      }
    })
    .delete('/pogs/:id', async (request, response) => {
      try {
        const result = await prisma.pogs.delete({
          where: { id: Number(request.params.id) }
        })
        response.status(200).json(result)
      } catch (err) {
        console.log('error', err)
        response.status(404).send('Not found')
      }
    })
    .post('/checkout', async (request, response) => {
      const { cartData, userId } = request.body;

      try {
        // Check if the user has enough balance
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
          return response.status(404).json({ error: 'User not found' });
        }

        let totalPrice = 0;
        const inventoryItems = await Promise.all(
          cartData.map(async (item: { id: number; quantity: number }) => {
            const pog = await prisma.pogs.findUnique({ where: { id: item.id } });
            if (!pog) {
              throw new Error(`Pog with ID ${item.id} not found`);
            }

            totalPrice += pog.price * item.quantity;

            if (user.balance < totalPrice) {
              throw new Error('Insufficient balance');
            }

            return prisma.inventory.create({
              data: {
                userId,
                pogId: item.id,
                quantity: item.quantity,
              },
            });
          })
        );

        // Update the user's balance
        await prisma.user.update({
          where: { id: userId },
          data: { balance: user.balance - totalPrice },
        });

        response.status(200).json({ totalPrice });
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          response.status(400).json({ error: error.message });
        } else {
          response.status(500).json({ error: 'An error occurred while processing the checkout' });
        }
      }
    })
    .post('/inventory', async (request, response) => {
      try {
        const { userId, pogIds, quantities } = request.body;
    
        // Check if the user has enough balance
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { balance: true },
        });
    
        if (!user) {
          return response.status(404).json({ error: 'User not found' });
        }
        const inventoryItems = await Promise.all(
          pogIds.map(async (pogId: number, index: number) => {
            const pog = await prisma.pogs.findUnique({
              where: { id: pogId },
            });
    
            if (!pog) {
              throw new Error(`Pog with ID ${pogId} not found`);
            }
    
            return prisma.inventory.create({
              data: {
                userId,
                pogId,
                quantity: quantities[index],
              },
            });
          })
        );
        response.status(201).json(inventoryItems);
      } catch (err) {
        console.log('error', err);
        response.status(500).json({ error: 'Failed to create inventory' });
      }
    })
    .use(express.static('src'))
    .listen(3000, () => {
      console.log('server started at http://localhost:3000')
    })
}

startServer()