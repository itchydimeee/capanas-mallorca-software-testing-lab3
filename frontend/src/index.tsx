import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import { Auth0Provider } from '@auth0/auth0-react'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain='dev-eu8aiywpss3vtys4.us.auth0.com'
      clientId='SF07cvV5Glzax1ieezv28gT0q8bSMMJn'
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
)
