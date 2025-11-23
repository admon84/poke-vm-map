import { Map } from './components/Map'

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return <div>Error: Google Maps API key not found</div>
  }

  return <Map apiKey={apiKey} />
}

export default App
