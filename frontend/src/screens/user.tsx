import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import useNavigation from '../components/navigation'

const UserPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0()
  const [pogs, setPogs] = useState([])
  const {ToAdminLogin} = useNavigation()

  useEffect(() => {
    getPogs()
  }, [])

  const getPogs = async () => {
    try {
      const response = await fetch('http://localhost:3000/pogs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch Pogs')
      }
      const pogsData = await response.json()
      setPogs(pogsData)
    } catch (error) {
      console.error('Error fetching Pogs:', error)
    }
  }

  const handleLogout = async () => {
    await logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">User Page</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : isAuthenticated ? (
        <div>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mb-6"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            type="button"
            onClick={ToAdminLogin}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
          >
            Admin Login
          </button>
          {pogs.length > 0 ? (
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
              {pogs.map((pog: any) => (
                <div
                  key={pog.id}
                  className="bg-white rounded-lg shadow-md p-6 mb-6"
                >
                  <h2 className="text-xl font-bold mb-2">{pog.name}</h2>
                  <p className="text-gray-600 mb-2">
                    Ticker Symbol: {pog.ticker_symbol}
                  </p>
                  <p className="text-gray-600 mb-2">Price: {pog.price}</p>
                  <p className="text-gray-600 mb-2">Color: {pog.color}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No pogs available.</p>
          )}
        </div>
      ) : (
        <p>Please log in to view pogs.</p>
      )}
    </div>
  )
}

export default UserPage