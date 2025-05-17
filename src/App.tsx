import { WebSocketProvider } from './contexts/webSocketContext'
import WebSocketControls from './WebSocketControls'

function App() {
  return (
    <WebSocketProvider>
      <WebSocketControls />
    </WebSocketProvider>
  )
}

export default App
