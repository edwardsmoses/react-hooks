// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [appState, setAppState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    setAppState(prev => {
      return {...prev, status: 'pending'}
    })

    fetchPokemon(pokemonName)
      .then(data => {
        setAppState(prev => {
          return {...prev, pokemon: data, status: 'resolved'}
        })
      })
      .catch(error => {
        setAppState(prev => {
          return {...prev, error: error, status: 'rejected'}
        })
      })
  }, [pokemonName])

  if (appState.status === 'idle') {
    return 'Submit a Pokemon'
  } else if (appState.status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (appState.status === 'rejected') {
    return (
      <>
        <div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{appState.error.message}</pre>
        </div>
      </>
    )
  } else if (appState.status === 'resolved') {
    return <PokemonDataView pokemon={appState.pokemon} />
  }
  throw new Error('This should be impossible')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
