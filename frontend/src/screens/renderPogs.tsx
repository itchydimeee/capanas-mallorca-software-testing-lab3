import React, { useState, useEffect } from 'react'
import axios from 'axios'

const RenderPogs = () => {

  const [ pogs, setPogs ] = useState<{
    id: number;
    name: string;
    ticker_symbol: string;
    price: number;
    color: string
  }[]>([])

  // const [updatePogs, setUpdatePogs] = useState({
  //   id: '',
  //   name: '',
  //   ticker_symbol: '',
  //   price: 0,
  //   color: ''
  // })

  // const handleUpdatePogs = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setUpdatePogs({
  //     ...updatePogs,
  //     [e.target.name]: e.target.value
  //   })
  // }

  // const handleEditClick = (pog: any) => {
  //   setUpdatePogs({
  //     id: pog.id,
  //     name: pog.name,
  //     ticker_symbol: pog.ticker_symbol,
  //     price: pog.price,
  //     color: pog.color
  //   })
  // }

  // const handleSubmitUpdatePogs = async (event: any) => {
  //   event.preventDefault()
  //   try {
  //     const response = await axios.put(`http://localhost:3000/pogs/${updatePogs.id}`, updatePogs)
  //     console.log(response.data)
  //   } catch (err) {
  //     console.error('Error updating Pogs:', err)
  //   }
  // }

  useEffect(() => {
    getPogs()
  }, [])

  const getPogs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/pogs')
      if (response.status !== 200) {
        throw new Error('Failed to fetch Pogs')
      } else {
        const pogsData = response.data
        setPogs(pogsData)
      }
    } catch (error) {
      console.error('Error fetching Pogs:', error)
    }
  }

  return (
    <div>
      <h2>Pogs List</h2>
      <ul>
        {pogs.map(pog => (
          <li key={pog.id}>
            <h3>{pog.name}</h3>
            <p>Ticker Symbol: {pog.ticker_symbol}</p>
            <p>Price: {pog.price}</p>
            <p>Color: {pog.color}</p>
            {/* <button onClick={() => handleEditClick(pog)}>update</button> */}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RenderPogs