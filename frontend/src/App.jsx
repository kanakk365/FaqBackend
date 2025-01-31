import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Faq from './components/Faq'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Faq/>
    </>
  )
}

export default App
