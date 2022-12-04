import { SegmentsProvider } from "./contexts/segments"
import { Scene } from "./Scene"

function App() {
  return (
    <SegmentsProvider>
      <Scene />
    </SegmentsProvider>
  )
}

export default App
