import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import "tailwindcss/tailwind.css"


const PogsForm: React.FC = () => {
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const formObject: { [key: string]: string } = {}
    formData.forEach((value, key) => {
      formObject[key] = value.toString()
    })

    try {
      const response = await fetch('http://localhost:3000/pogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formObject),
      })

      if (response.ok) {
        navigate('/readPogs') // Redirect after successful form submission
      } else {
        console.error('Error submitting form:', response.statusText)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleViewPogsClick = () => {
    navigate('/readPogs')
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Create Pogs Form</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
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
            onClick={handleViewPogsClick}
            className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300'
          >
            View Current Pogs
          </button>
        </div>
      </form>
    </div>
  )
}

export default PogsForm