import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (message: any) => void;
  startReceiving: () => void;
  stopReceiving: () => void;
  isRecieving: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  sendMessage: () => { },
  startReceiving: () => { },
  stopReceiving: () => { },
  isRecieving: false
});

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecieving, setIsRecieving] = useState(false);

  // Initialize WebSocket connection on mount
  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_API_URL);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    setSocket(ws);

    return () => {
      ws.close()
    }
  }, [])

  const startReceiving = () => {
    if (socket && isConnected) {
      sendMessage({ command: "start" });
      setIsRecieving(true);
    } else {
      console.error('Cannot send message, socket not connected');
    }
  }

  const stopReceiving = () => {
    if (socket && isConnected) {
      sendMessage({ command: "stop" });
      setIsRecieving(false);
    } else {
      console.error('Cannot send message, socket not connected');
    }
  }

  const sendMessage = (message: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    } else {
      console.error('Cannot send message, socket not connected');
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, sendMessage, startReceiving, stopReceiving, isRecieving }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);