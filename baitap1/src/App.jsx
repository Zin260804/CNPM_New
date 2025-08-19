import { useState } from 'react'
import reactLogo from './assets/avatar.jpg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <img src={reactLogo} className="logo react img" alt="React logo" />
      </div>
      <h1>Nguyễn Hữu Vinh MSSV:22110458</h1>
    </>
  )
}

export default App
