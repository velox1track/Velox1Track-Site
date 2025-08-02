import React from 'react'
import RouletteWheel from './components/RouletteWheel'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto">
        <RouletteWheel />
      </div>
    </div>
  )
}

export default App 