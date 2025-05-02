import React from 'react'
import ReactDOM from 'react-dom/client'
import '../index.css'

function Popup() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Hello from FocusForge!</h1>
      <p className="text-gray-700">Your Chrome Extension Popup</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Popup />)
