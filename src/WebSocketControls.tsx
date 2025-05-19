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

    // Disable message receiving
    if (!isRecieving) {
      socket.onmessage = () => {};
      return;
    }

    // Enable message receiving
    socket.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data) as DataRow;

      /* Update data */
      if (message.data) {
        setData((prevData) => {
          if (!prevData.length) return []; // Timestamp not yet received

          const newData = [...prevData];
          const lastRow = { ...newData[newData.length - 1] };
          lastRow.data = [...lastRow.data, ...message.data];
          newData[newData.length - 1] = lastRow;
          return newData;
        });
        /* Insert new timestamp */
      } else if (message.timeStamp) {
        setData((prevData) => {
          const newData = [...prevData];

          if (newData.length && newData[newData.length - 1].data.length === 0) {
            newData[newData.length - 1].timeStamp = message.timeStamp;
          } else {
            newData.push({
              clientId: message.clientId,
              timeStamp: message.timeStamp,
              data: [],
            });
          }

          return newData.length > 20 ? newData.slice(1) : newData;
        });
      }
    };
  }, [isRecieving]);

  const handleRowClick = (row: DataRow) => {
    if (row.data && vowelFilter(row.data)) {
      setShowRowModal("Ano");
    } else {
      setShowRowModal("Ne");
    }
  };

  const lastTimeStampReceived = datetimeToLocalTime(
    data[data.length - 1]?.timeStamp
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
            <button
              onClick={stopReceiving}
              disabled={!isRecieving}
              style={{ backgroundColor: "#920c0c" }}
            >
              Stop
            </button>
          </div>
        ) : (
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={startReceiving}
              disabled={!isConnected}
              style={{ backgroundColor: "#34920c" }}
            >
              Start
            </button>
          </div>
        )}
      </div>
      <div
        style={{ marginTop: "20px", marginBottom: "20px", textAlign: "left" }}
      >
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
