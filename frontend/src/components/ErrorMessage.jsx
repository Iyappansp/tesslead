    import React from 'react';

function ErrorMessage({ message, onClose }) {
  return (
    <div className="error-message">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <span className="error-text">{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="error-close">
          ✕
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
