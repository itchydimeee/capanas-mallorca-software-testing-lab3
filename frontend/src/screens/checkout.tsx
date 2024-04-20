import React from 'react';
import { Pog } from '../screens/user';
import { useNavigate, useLocation } from 'react-router-dom';
import useNavigation from '../components/navigation';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { ToUserPage } = useNavigation()
  const location = useLocation();
  const { cart, totalPrice } = location.state as { cart: Pog[]; totalPrice: number };

  const handleConfirmPayment = async () => {
    try {
      // Implement the logic to process the payment here
      alert('Payment processed successfully!');
      navigate('/user');
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
        {cart.map((pog) => (
          <div key={pog.id} className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-bold">{pog.name}</h3>
              <p className="text-gray-600">Ticker Symbol: {pog.ticker_symbol}</p>
              <p className="text-gray-600">Price: {pog.price}</p>
            </div>
            <p className="font-bold">${pog.price}</p>
          </div>
        ))}
        <hr className="my-4" />
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Total</h3>
          <p className="text-xl font-bold">${totalPrice}</p>
        </div>
        <div className='flex justify-between mt-4'>
        <button
          className="bg-green-600 hover:bg-green-500 px-4 py-2 text-white rounded-md mt-4"
          onClick={handleConfirmPayment}
        >
          Confirm Payment
        </button>
        <button onClick={ ToUserPage } className='bg-red-600 hovere:bg-red-500 px-4 py-2 text-white rounded-md mt-4'> Cancel Transaction</button>
      </div>
      </div>
    </div>
  );
};

export default CheckoutPage;