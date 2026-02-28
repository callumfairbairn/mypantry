import { useState } from 'react'
import './App.css'

interface PantryItem {
  id: string;
  name: string;
  isRemoving?: boolean;
}

function App() {
  const [items, setItems] = useState<PantryItem[]>([])
  const [inputValue, setInputValue] = useState('')

  const addItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      const newItem: PantryItem = {
        id: crypto.randomUUID(),
        name: inputValue.trim(),
      }
      setItems([...items, newItem])
      setInputValue('')
    }
  }

  const startRemoval = (id: string) => {
    // Mark item as removing to trigger CSS animation
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isRemoving: true } : item
    ))

    // Actually remove after animation completes (300ms)
    setTimeout(() => {
      setItems(prev => prev.filter(item => item.id !== id))
    }, 300)
  }

  return (
    <div className="container">
      <h1>MyPantry</h1>
      <p className="subtitle">Coming soon...</p>

      <form onSubmit={addItem} className="input-group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add an ingredient..."
          className="pantry-input"
        />
        <button type="submit" className="add-button">Add</button>
      </form>

      <ul className="pantry-list">
        {items.map((item) => (
          <li 
            key={item.id} 
            className={`pantry-item ${item.isRemoving ? 'removing' : ''}`}
          >
            <span>{item.name}</span>
            <button 
              onClick={() => startRemoval(item.id)} 
              className="remove-button"
              aria-label={`Remove ${item.name}`}
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
