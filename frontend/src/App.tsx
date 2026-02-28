import { useState } from 'react'
import './App.css'

interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  expiryEstimate: number | null;
  isRemoving?: boolean;
}

const ingredientEmojiMap: Record<string, string> = {
  'milk': '🥛',
  'egg': '🥚',
  'eggs': '🥚',
  'bread': '🍞',
  'butter': '🧈',
  'cheese': '🧀',
  'chicken': '🍗',
  'beef': '🥩',
  'pork': '🥓',
  'fish': '🐟',
  'apple': '🍎',
  'apples': '🍎',
  'banana': '🍌',
  'bananas': '🍌',
  'orange': '🍊',
  'oranges': '🍊',
  'tomato': '🍅',
  'tomatoes': '🍅',
  'potato': '🥔',
  'potatoes': '🥔',
  'onion': '🧅',
  'onions': '🧅',
  'garlic': '🧄',
  'carrot': '🥕',
  'carrots': '🥕',
  'broccoli': '🥦',
  'flour': '🌾',
  'sugar': '🍚',
  'salt': '🧂',
  'pepper': '🌶️',
  'coffee': '☕',
  'tea': '🍵',
  'water': '💧',
  'juice': '🧃',
  'wine': '🍷',
  'beer': '🍺',
  'honey': '🍯',
  'olive oil': '🫒',
  'rice': '🍚',
  'pasta': '🍝',
  'lemon': '🍋',
  'lemons': '🍋',
  'strawberry': '🍓',
  'strawberries': '🍓',
  'blueberry': '🫐',
  'blueberries': '🫐',
  'avocado': '🥑',
  'avocados': '🥑',
  'cucumber': '🥒',
  'cucumbers': '🥒',
}

const shelfLifeMap: Record<string, number> = {
  'milk': 7,
  'egg': 21,
  'eggs': 21,
  'bread': 5,
  'butter': 30,
  'cheese': 14,
  'chicken': 2,
  'beef': 3,
  'pork': 3,
  'fish': 2,
  'apple': 21,
  'apples': 21,
  'banana': 5,
  'bananas': 5,
  'orange': 14,
  'oranges': 14,
  'tomato': 7,
  'tomatoes': 7,
  'potato': 30,
  'potatoes': 30,
  'onion': 30,
  'onions': 30,
  'garlic': 60,
  'carrot': 21,
  'carrots': 21,
  'broccoli': 7,
  'flour': 365,
  'sugar': 365,
  'salt': 999,
  'pepper': 365,
  'rice': 365,
  'pasta': 365,
  'avocado': 3,
  'avocados': 3,
  'cucumber': 7,
  'cucumbers': 7,
}

const getEmoji = (name: string) => {
  const lowerName = name.toLowerCase().trim()
  const words = lowerName.split(/\s+/)
  if (ingredientEmojiMap[lowerName]) return ingredientEmojiMap[lowerName]
  for (const word of words) {
    if (ingredientEmojiMap[word]) return ingredientEmojiMap[word]
  }
  return '📦'
}

const getExpiryEstimate = (name: string) => {
  const lowerName = name.toLowerCase().trim()
  const words = lowerName.split(/\s+/)
  if (shelfLifeMap[lowerName]) return shelfLifeMap[lowerName]
  for (const word of words) {
    if (shelfLifeMap[word]) return shelfLifeMap[word]
  }
  return null // Use null for unknown items
}

function App() {
  const [items, setItems] = useState<PantryItem[]>([])
  const [nameValue, setNameValue] = useState('')
  const [qtyValue, setQtyValue] = useState('1')

  const addItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (nameValue.trim()) {
      const numQty = parseFloat(qtyValue) || 1
      const newItem: PantryItem = {
        id: crypto.randomUUID(),
        name: nameValue.trim(),
        quantity: numQty,
        expiryEstimate: getExpiryEstimate(nameValue.trim()),
      }
      setItems([...items, newItem])
      setNameValue('')
      setQtyValue('1')
    }
  }

  const updateQuantity = (id: string, amount: number) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id)
      if (item && item.quantity + amount <= 0) {
        setTimeout(() => startRemoval(id), 0)
        return prev
      }
      return prev.map(item => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + amount }
        }
        return item
      })
    })
  }

  const startRemoval = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isRemoving: true } : item
    ))

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
          type="number"
          step="0.5"
          min="0"
          value={qtyValue}
          onChange={(e) => setQtyValue(e.target.value)}
          placeholder="Qty"
          className="pantry-input qty-input"
        />
        <input
          type="text"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          placeholder="Add an ingredient..."
          className="pantry-input name-input"
        />
        <button type="submit" className="add-button">Add</button>
      </form>

      <ul className="pantry-list">
        {items.map((item) => (
          <li 
            key={item.id} 
            className={`pantry-item ${item.isRemoving ? 'removing' : ''}`}
          >
            <div className="item-details">
              <span className="item-emoji">{getEmoji(item.name)}</span>
              <span className="item-qty">{item.quantity}</span>
              <div className="item-text">
                <span className="item-name">{item.name}</span>
                <span className={`expiry-tag ${item.expiryEstimate !== null && item.expiryEstimate <= 3 ? 'urgent' : ''}`}>
                  {item.expiryEstimate !== null ? `~${item.expiryEstimate} days left` : '? days left'}
                </span>
              </div>
            </div>
            
            <div className="item-actions">
              <button 
                onClick={() => startRemoval(item.id)} 
                className="remove-button"
                aria-label={`Remove all ${item.name}`}
              >
                -All
              </button>
              <button 
                onClick={() => updateQuantity(item.id, -1)} 
                className="qty-btn"
                title="Remove 1"
              >
                -1
              </button>
              <button 
                onClick={() => updateQuantity(item.id, -0.5)} 
                className="qty-btn"
                title="Remove 0.5"
              >
                -0.5
              </button>
              <button 
                onClick={() => updateQuantity(item.id, 1)} 
                className="qty-btn plus-btn"
                title="Add 1"
              >
                +1
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
