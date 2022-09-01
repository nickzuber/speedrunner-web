import { SegmentsProvider } from "./contexts/segments"
import { Scene } from "./Scene"
import "./App.css"

function App() {
  return (
    <SegmentsProvider>
      <Scene />
    </SegmentsProvider>
  )
}

export default App
