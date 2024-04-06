import React from 'react';

const Loading = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <video autoPlay loop muted style={{ width: '10px', height: '10px' }}>
        <source src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Loading;
