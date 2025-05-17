import "./modal.css";

export default function Modal({ onClose, children }: { onClose: () => void, children: React.ReactNode }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <p>{children}</p>
      </div>
    </div>
  );
}