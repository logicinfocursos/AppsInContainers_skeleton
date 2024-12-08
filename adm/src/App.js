import React, { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  const [databases, setDatabases] = useState([])

  const baseUrl = process.env.REACT_APP_API_URL || 3000

  useEffect(() => {
    fetch(`${baseUrl}/databases`)
      .then(response => response.json())
      .then(data => setDatabases(data))
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Adm</h1>
        <h1>Databases</h1>
      <ul>
        {databases.map((db, index) => (
          <li key={index}>{db.Database}</li>
        ))}
      </ul>
      </header>
    </div>
  )
}

export default App
