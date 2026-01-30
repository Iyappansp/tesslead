import React from 'react';

function LoadingSpinner({ small }) {
  return (
    <div className={`loading-spinner ${small ? 'small' : ''}`}>
      <div className="spinner"></div>
      {!small && <p>Loading...</p>}
    </div>
  );
}

export default LoadingSpinner;
