import React, { useState } from 'react'
import useNavigation from '../components/navigation'
import 'tailwindcss/tailwind.css'
import { useAuth0 } from '@auth0/auth0-react'

const PogsForm: React.FC = () => {
  const { ToReadPogs, ToUserPage } = useNavigation()
  const { logout } = useAuth0()
  const [errors, setErrors] = useState<{
    name?: string
    ticker_symbol?: string
    price?: string
    color?: string
  }>({})

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const formObject: { [key: string]: string } = {}
    formData.forEach((value, key) => {
      formObject[key] = value.toString()
    })

    const { name, ticker_symbol, price, color } = formObject
    if (!name) {
      setErrors({ ...errors, name: 'Name is required' })
    }
    if (!ticker_symbol) {
      setErrors({ ...errors, ticker_symbol: 'Ticker symbol is required' })
    }
    if (!price) {
      setErrors({ ...errors, price: 'Price is required' })
    }
    if (!color) {
      setErrors({ ...errors, color: 'Color is required' })
    }

    if (Object.keys(errors).length > 0) {
      return
    }

    try {
      const response = await fetch('http://localhost:3000/pogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObject)
      })

      if (!response.ok) {
        const errorResponse = await response.json()
        setErrors(errorResponse.error)
      } else {
        alert('Submission successful')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleLogout = async () => {
    await logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    })
  }

  return (
    <div className='container mx-auto p-4'>
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4'
        onClick={ToUserPage}
      >
        Back
      </button>
      <h1 className='text-2xl font-bold mb-4'>Create Pogs Form</h1>
      <form
        onSubmit={handleSubmit}
        className='space-y-4'
        data-testid='pogs-form'
      >
        <div className='flex flex-col'>
          <label htmlFor='name' className='text-sm font-bold'>
            Name:
          </label>
          <input
            type='text'
            id='name'
            name='name'
            className='rounded-md border border-gray-300 px-3 py-2'
          />
          {errors?.name && <div className='text-red-500'>{errors.name}</div>}
        </div>
        <div className='flex flex-col'>
          <label htmlFor='ticker_symbol' className='text-sm font-semibold'>
            Ticker Symbol:
          </label>
          <input
            type='text'
            id='ticker_symbol'
            name='ticker_symbol'
            className='rounded-md border border-gray-300 px-3 py-2'
          />
          {errors?.ticker_symbol && (
            <div className='text-red-500'>{errors.ticker_symbol}</div>
          )}
        </div>
        <div className='flex flex-col'>
          <label htmlFor='price' className='text-sm font-semibold'>
            Price:
          </label>
          <input
            type='number'
            id='price'
            name='price'
            className='rounded-md border border-gray-300 px-3 py-2'
          />
          {errors?.price && <div className='text-red-500'>{errors.price}</div>}
        </div>
        <div className='flex flex-col'>
          <label htmlFor='color' className='text-sm font-semibold'>
            Color:
          </label>
          <input
            type='text'
            id='color'
            name='color'
            className='rounded-md border border-gray-300 px-3 py-2'
          />
          {errors?.color && <div className='text-red-500'>{errors.color}</div>}
        </div>
        <div className='flex justify-between'>
          <button
            type='submit'
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300'
          >
            Submit
          </button>
          <button
            type='button'
            onClick={ToReadPogs}
            className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300'
          >
            View Current Pogs
          </button>
        </div>
      </form>
      <div className='flex justify-end mt-4'>
        <button
          type='button'
          className='bg-red-500 px-2 py-1 hover:bg-red-600 text-white rounded-lg'
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default PogsForm
