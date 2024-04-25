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
        const userId = request.params.userId
        const user = await prisma.user.findUnique({
          where: { auth0_id: userId },
          include: { Inventory: true }
        })
        if (!user) {
          response.status(404).send('User not found')
        } else {
          response.status(200).json(user)
        }
        console.log('User Balance: ', user?.balance)
      } catch (err) {
        console.log('error', err)
        response.status(500).json({ error: 'Failed to fetch user' })
      }
    })
    .post('/users', async (request, response) => {
      try {
        const { auth0_id, email, name } = request.body;
    
        // Check if a user with the same email already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          return response.status(400).json({ error: 'User with this email already exists' });
        }
    
        const newUser = await prisma.user.create({
          data: { auth0_id, email, name },
        });
        response.status(201).json(newUser);
      } catch (err) {
        console.log('error', err);
        response.status(500).json({ error: 'failed to create user' });
      }
    })
    .put('/users/:userId', async (request, response) => {
      try {
        const userId = Number(request.params.userId)
        const { name, email, balance } = request.body

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
    
        if (!user) {
          response.status(404).send('User not found');
          return;
        }

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
    .put('/pogs-update-price', async (request, response) => {
      try {
        const pogsData = await prisma.pogs.findMany()
        for (let pogs of pogsData) {
          // number generated between -5 and 5
          let randomAmountChange = Math.floor(Math.random() * 10) - 5
          let currentPrice = pogs.price
          let newPrice = currentPrice + randomAmountChange
          await prisma.pogs.update({
            where: { id: pogs.id },
            data: { price: newPrice, prevPrice: currentPrice }
          })
        }
        response.status(200).json(pogsData)
      } catch (err) {
        console.log('error', err)
        response.status(404).send('not found')
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
      const { cartData, userId } = request.body

      try {
        // Check if the user has enough balance
        const user = await prisma.user.findUnique({
          where: { auth0_id: userId }
        })
        if (!user) {
          return response.status(404).json({ error: 'User not found' })
        }

        let totalPrice = 0
        await Promise.all(
          cartData.map(async (item: { id: number; quantity: number }) => {
            const pog = await prisma.pogs.findUnique({ where: { id: item.id } })
            if (!pog) {
              throw new Error(`Pog with ID ${item.id} not found`)
            }

            totalPrice += pog.price * item.quantity

            if (user.balance < totalPrice) {
              throw new Error('Insufficient balance')
            }

            await prisma.inventory.create({
              data: {
                userId: user.id,
                pogId: item.id,
                quantity: item.quantity
              }
            })
          })
        )

        // Update the user's balance
        await prisma.user.update({
          where: { id: user.id },
          data: { balance: user.balance - totalPrice }
        })

        response.status(200).json({ totalPrice })
      } catch (error) {
        console.error(error)
        if (
          error instanceof Error &&
          error.message === 'Insufficient balance'
        ) {
          response.status(400).json({ error: error.message })
        } else {
          response
            .status(500)
            .json({ error: 'An error occurred while processing the checkout' })
        }
      }
    })
    .post('/sell', async (request, response) => {
      try {
        const { userId, pogId, quantityToSell } = request.body;
    
        // Find the user
        const user = await prisma.user.findUnique({
          where: { auth0_id: userId },
        });
        if (!user) {
          return response.status(404).json({ error: 'User not found' });
        }
    
        // Find the pog
        const pog = await prisma.pogs.findUnique({
          where: { id: pogId },
        });
        if (!pog) {
          return response.status(404).json({ error: 'Pog not found' });
        }
    
        // Find the inventory item
        const inventoryItem = await prisma.inventory.findFirst({
          where: {
            userId: user.id,
            pogId: pog.id,
          },
        });
        if (!inventoryItem) {
          return response.status(404).json({ error: 'Inventory item not found' });
        }
    
        // Check if the user has enough quantity to sell
        if (inventoryItem.quantity < quantityToSell) {
          return response.status(400).json({ error: 'Insufficient quantity to sell' });
        }
    
        // Calculate the total sale amount
        const totalSaleAmount = pog.price * quantityToSell;
    
        // Update the user's balance
        await prisma.user.update({
          where: { id: user.id },
          data: { balance: user.balance + totalSaleAmount },
        });
    
        // Update the inventory item
        await prisma.inventory.update({
          where: { id: inventoryItem.id },
          data: { quantity: inventoryItem.quantity - quantityToSell },
        });
    
        response.status(200).json({ totalSaleAmount });
      } catch (err) {
        console.error('Error selling pogs:', err);
        response.status(500).json({ error: 'Failed to sell pogs' });
      }
    })
    .get('/inventory/:userId', async (request, response) => {
      try {
        const userId = request.params.userId;
        const user = await prisma.user.findUnique({
          where: { auth0_id: userId },
        });
        if (!user) {
          console.log('User not found');
          return response.status(404).json({ error: 'User not found' });
        }
    
        console.log('User found:', user);
    
        const inventory = await prisma.inventory.findMany({
          where: { userId: user.id },
          include: {
            pog: true,
          },
        });
    
        console.log('Inventory response:', inventory);
        response.status(200).json(inventory);
      } catch (err) {
        console.log('Error fetching inventory:', err);
        response.status(500).json({ error: 'Failed to fetch inventory' });
      }
    })
    .use(express.static('src'))
    .listen(3000, () => {
      console.log('server started at http://localhost:3000')
    })
}

startServer()
