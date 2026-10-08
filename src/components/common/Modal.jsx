export default function Modal({ title, message, onClose }) {
  return (
    <div
      data-testid="modal"
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal">
        <div className="modal-content">
          <h2 id="modal-title">{title}</h2>
          <p>{message}</p>
          <button
            className="btn"
            data-testid="btn-modal-close"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
