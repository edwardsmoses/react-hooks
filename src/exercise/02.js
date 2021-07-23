// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorageState = (
  storageKey,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) => {
  const [value, setValue] = React.useState(() => {
    const valueInStorage = window.localStorage.getItem(storageKey)
    if (valueInStorage) {
      return deserialize(valueInStorage)
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyRef = React.useRef(storageKey)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== storageKey) {
      window.localStorage.removeItem(prevKey)
    }

    prevKeyRef.current = storageKey;
    window.localStorage.setItem(storageKey, serialize(value))
  }, [value, storageKey, serialize])

  return [value, setValue]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
