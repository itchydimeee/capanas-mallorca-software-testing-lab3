import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useLocation, useNavigate } from 'react-router-dom'
import useNavigation from '../components/navigation'

interface Pog {
  id: number
  name: string
  ticker_symbol: string
  price: number
  color: string
  quantity: number
}

const CheckoutPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth0()
  const location = useLocation()
  const { selectedPogs } = location.state as { selectedPogs: Pog[] }
  const [cart, setCart] = useState<Pog[]>(selectedPogs)
  const [totalPrice, setTotalPrice] = useState(0)
  const navigate = useNavigate()
  const { ToUserPage } = useNavigation()

  useEffect(() => {
    // Calculate the total price of the items in the cart
    let total = 0
    cart.forEach((item) => {
      total += item.price * item.quantity
    })
    setTotalPrice(total)
  }, [cart])

  const handleQuantityChange = (index: number, change: number) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = Math.max(updatedCart[index].quantity + change, 1);
    setCart(updatedCart);
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch('http://localhost:3000/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cartData: cart,
          userId: user?.sub
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      const { totalPrice } = await response.json()
      setTotalPrice(totalPrice)

      // Clear the cart after successful checkout
      setCart([])
      navigate('/user')
    } catch (error) {
      console.error('Error during checkout:', error)
      // Handle the error, e.g., display an error message to the user
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : isAuthenticated ? (
        <div>
          {cart.length > 0 ? (
            <div>
              <div className="bg-gray-100 rounded-lg p-6 mb-6">
                {user?.picture && (
                  <img
                    src={user.picture}
                    alt={user?.name}
                    className="w-20 h-20 rounded-full mb-4"
                  />
                )}
                <h2 className="text-2xl font-bold mb-2">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md p-6 mb-6"
                >
                  <h2 className="text-xl font-bold mb-2">{item.name}</h2>
                  <p className="text-gray-600 mb-2">
                    Ticker Symbol: {item.ticker_symbol}
                  </p>
                  <p className="text-gray-600 mb-2">Price: {item.price}</p>
                  <p className="text-gray-600 mb-2">Color: {item.color}</p>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-l-md"
                      onClick={() => handleQuantityChange(index, -1)}
                    >
                      -
                    </button>
                    <p className="px-4">{item.quantity}</p>
                    <button
                      type="button"
                      className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-r-md"
                      onClick={() => handleQuantityChange(index, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-2">Total Price</h2>
                <p className="text-gray-600">${totalPrice.toFixed(2)}</p>
                <button
                  type="button"
                  className="bg-green-600 hover:bg-green-500 px-4 py-2 text-white rounded-md mt-4"
                  onClick={handleCheckout}
                >
                  Complete Checkout
                </button>
                <button type="button" 
                className="bg-red-600 hover:bg-red-500 px-4 py-2 text-white rounded-md mt-4"
                onClick={ToUserPage}
                > Cancel Transaction</button>
              </div>
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
      ) : (
        <p>Please log in to view your cart.</p>
      )}
    </div>
  )
}

export default CheckoutPage