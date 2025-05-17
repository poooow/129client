import { useEffect, useState } from "react";
import "./App.css";
import { useWebSocket } from "./contexts/webSocketContext";
import datetimeToLocalTime from "./utils/datetimeToLocalTime";
import vowelFilter from "./utils/vowelFilter";
import Modal from "./components/Modal";
import { type DataRow } from "./types";
import Table from "./components/Table";

export default function WebSocketControls() {
  const { socket, isConnected, startReceiving, stopReceiving, isRecieving } =
    useWebSocket();
  const [data, setData] = useState<DataRow[]>([]);
  const [vowelFilterEnabled, setVowelFilterEnabled] = useState<boolean>(false);
  const [showRowModal, setShowRowModal] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    if (isRecieving) {
      socket.onmessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data);

        // Ignore messages with no content to show
        if (!message.data && !message.timeStamp) return;

        setData((prevData) => {
          message.receivedAt = new Date();
          const newData = [...prevData, message];
          return newData.length > 20 ? newData.slice(1) : newData;
        });
      };
    } else {
      socket.onmessage = () => {};
    }
  }, [isRecieving]);

  const handleRowClick = (row: DataRow) => {
    if (row.data && vowelFilter(row.data)) {
      setShowRowModal("Ano");
    } else {
      setShowRowModal("Ne");
    }
  };

  const lastTimeStampReceived = datetimeToLocalTime(
    data.find((item) => item.timeStamp)?.timeStamp
  );

  return (
    <div>
      <h1>WebSocket Demo</h1>
      <div className="card">
        <p>
          Websocket status:{" "}
          <strong>{isConnected ? "Connected" : "Disconnected"}</strong>
        </p>
        <p>
          Message status:{" "}
          <strong>
            {isRecieving === true
              ? "Started"
              : isRecieving === false
              ? "Stopped"
              : "Waiting for response"}
          </strong>
        </p>
        <p>Last timeStamp received: {lastTimeStampReceived}</p>
        {isRecieving ? (
          <div style={{ marginTop: "20px" }}>
            <button onClick={stopReceiving} disabled={!isRecieving}>
              Stop
            </button>
          </div>
        ) : (
          <div style={{ marginTop: "20px" }}>
            <button onClick={startReceiving} disabled={!isConnected}>
              Start
            </button>
          </div>
        )}
      </div>
      <div style={{ marginTop: "20px", textAlign: "left" }}>
        <input
          id="vowelFilter"
          type="checkbox"
          onClick={() => setVowelFilterEnabled(!vowelFilterEnabled)}
          style={{ marginRight: "6px" }}
        />
        <label htmlFor="vowelFilter">Vowel Filter</label>
      </div>
      <div className="table-container">
        <Table
          data={data}
          onRowClick={handleRowClick}
          vowelFilterEnabled={vowelFilterEnabled}
        />
        {showRowModal && (
          <Modal onClose={() => setShowRowModal(null)}>{showRowModal}</Modal>
        )}
      </div>
    </div>
  );
}
