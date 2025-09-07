import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading">
      <div className="loadingSpinner"></div>
      <p>Loading books...</p>
    </div>
  );
};

export default LoadingSpinner;
