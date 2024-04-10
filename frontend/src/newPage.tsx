import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewPage = () => {

    const navigate = useNavigate();

    const [ pogs, setPogs ] = useState({ 
        name: '',
        ticker_symbol: '',
        price: 0,
        color: ''
    })

    const handleChange = (e: any) => {
        setPogs({
            ...pogs,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        try {
            const response = await axios.post('http://localhost:3000/pogs', pogs)
            if (response.status === 201) {
                console.log('Pogs created successfully')
            } else {
                console.error('Error submitting form:', response.statusText)
            }
            navigate('/readPogs')
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

  return (
    <form onSubmit={handleSubmit}>
        <input type="text" name='name' value={pogs.name} onChange={handleChange} placeholder='pogs name' />
        <input type="text" name='ticker_symbol' value={pogs.ticker_symbol} onChange={handleChange} placeholder='pogs ticker symbol' />
        <input type="number" name='price' value={pogs.price} onChange={handleChange} placeholder='pogs price' />
        <input type="text" name='color' value={pogs.color} onChange={handleChange} placeholder='pogs color' />
        <button type='submit'>Submit</button>
    </form>
  )
}

export default NewPage