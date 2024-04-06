// GetStreams.js

import React, {useRef} from 'react';
import lesst from '../Assets/less-than.png';
import moret from '../Assets/more-than.png'
import { useNavigate } from 'react-router-dom';

const GetStreams = ({ streamsData, handleStreamClick }) => {
    const scrollRef = useRef(null);
    const navigate = useNavigate();

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= 100; // Adjust the scrolling amount as needed
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += 100; // Adjust the scrolling amount as needed
    }
  };

  if (!streamsData || streamsData.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>No streams available at the moment. Please <span style={{ color: '#1B4375', cursor: 'pointer' }} onClick={() => navigate('/setup')}>create one here</span>.</p>
      </div>
    );
  }

  const mainStreams = streamsData.filter(stream => stream.main === 1);
  const otherStreams = streamsData.filter(stream => stream.main !== 1);
  return (
    <div>
    
    <div className="scrollv" ref={scrollRef} style={{ marginLeft:"80px",scrollBehavior: "smooth", display: 'flex', flexDirection: 'row', overflowX: 'auto', padding: '13px', boxShadow: "0 4px 8px 0 rgba(0,0,0,0.3)" }}>
        {/* Render streams with stream.main equal to 1 first */}
        {mainStreams.map((stream, index) => (
          <div key={index} className="stream-item" style={{ marginRight: '12px', padding: '10px', border: '1.5px solid #1B4375', borderRadius: '5px', transition: 'transform 0.3s ease', boxShadow: "1px 4px 8px 2px rgba(0,185,0,3)", display: 'flex', alignItems: 'center', justifyContent: 'center', width:"10vw" }} onClick={() => handleStreamClick(stream)} onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.03)';
          }} onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}>
            <div style={{}}>
              <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: "column" }}>
                <h3 style={{ color: "#1B4375" }}>{stream.name}</h3>
                <p style={{ color: "#1B4375" }}>{stream.color} {stream.main}</p>
              </div>
              <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: "column" }}><img src={stream.logo} alt="logo" style={{ width: '50px', height: '50px', borderRadius: '5px', color: "#1B4375" }} /></div>
            </div>
          </div>
        ))}
        {/* Render other streams */}
        {otherStreams.map((stream, index) => (
          <div key={index} className="stream-item" style={{  width: "10vw", 
          height: "10vw", marginRight: '12px', padding: '10px', border: '1.5px solid #1B4375', borderRadius: '5px', transition: 'transform 0.3s ease', boxShadow: "1px 4px 8px 1px rgba(0,0,0,0.3)", display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleStreamClick(stream)} onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.03)';
          }} onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}>
            <div style={{}}>
              <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: "column" }}>
                <h3 style={{ color: "#1B4375" }}>{stream.name}</h3>
                <p style={{ color: "#1B4375" }}>{stream.color} {stream.main}</p>
              </div>
              <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: "column" }}><img src={stream.logo} alt="logo" style={{ width: '50px', height: '50px', borderRadius: '5px', color: "#1B4375" }} /></div>
            </div>
          </div>
        ))}
      </div>
<div style={{ textAlign: 'center',width:"80%", paddingTop:"10px"}}>
<img style={{ width: "50px", height: "50px", transform: "scale(0.3)", cursor:"pointer", transition: "transform 0.3s ease", marginLeft: '10px'  }}  onMouseEnter={(e) => {
      e.target.style.transform = "scale(0.4)"; // Increase scale
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = "scale(0.3)"; // Restore original scale
    }} src={lesst} alt="lt" onClick={scrollLeft} />
  <img style={{ width: "50px", height: "50px", transform: "scale(0.3)", cursor:"pointer", transition: "transform 0.3s ease", marginLeft: '10px'  }}  onMouseEnter={(e) => {
      e.target.style.transform = "scale(0.4)"; // Increase scale
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = "scale(0.3)"; // Restore original scale
    }} src={moret} alt="gt" onClick={scrollRight} />
      </div>
    </div>



  );
};

export default GetStreams;
