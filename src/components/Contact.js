
import React, { useState, useEffect } from 'react';

const Contact = ({size}) => {
    const [fontSize, setFontSize] = useState(size);
    useEffect(() => {
        setFontSize(size);
      }, [size]);
  return (
    <>
    <div style={{paddingLeft:"10px", paddingTop:"5px"}}>
    <h3 style={{
        fontSize,
        color: "#E3ECF2",
        textAlign: "center",
        padding: "2px 0.3vw 2px 2px",
        width: "17vw",
        // border: "1px solid "
      }}>
        
      </h3>
      </div>
      
      <div style={{height:"40vh", display: "flex", flexDirection: "column", justifyContent: "flex-end" }} >
      <h3 style={{
        fontSize,
        color: "#E3ECF2",
        textAlign: "center",
        padding: "2px 0.3vw 2px 2px",
        width: "17vw",
        // border: "1px solid "
      }}>
      © BEAWARE 2024.
      Made with love for the d/Deaf community.</h3>
      </div>
      </>
  );
};

export default Contact;
