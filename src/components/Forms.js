import React from 'react';
import TxtImage from '../Assets/edit.png';
export const ProfileForm = ({ username, email, handleEditUsername, handleEditEmail }) => {

  const clickem = ()=>{
    alert("Email cannot be edited");
  };
  return (
    <form id="profileform" className="slide-in" style={{ paddingLeft: "30px", paddingTop: "30px" }}>
      <div className="form-field" >
        <label htmlFor="username" style={{color:"#1B4375", fontWeight:"bold"}}>Username</label>
        <div className="input-with-icon" style={{ display: "flex", alignItems: "center" }}>
          <input style={{color:"#1B4375"}} type="text" id="username" value={username} onClick={handleEditUsername} 
          onMouseEnter={(e) => {
            if (!e.target.classList.contains("clicked")) {
              e.target.style.cursor = "pointer";
              e.target.value = "Edit Username"; // Change text on hover
            }
          }}
          onMouseLeave={(e) => {
            if (!e.target.classList.contains("clicked")) {
              e.target.value = username; // Restore original text
            }
          }}
          onFocus={(e) => {
            e.target.classList.add("clicked"); // Add a class to indicate clicking
          }}
          onBlur={(e) => {
            e.target.classList.remove("clicked"); // Remove the class when blur
          }} />
          <div style={{}}>
            <img style={{ width: "50px", height: "50px", transform: "scale(0.3)", cursor:"pointer", transition: "transform 0.3s ease"  }}  onMouseEnter={(e) => {
      e.target.style.opacity = "0.6";
      e.target.style.transform = "scale(0.4)"; // Increase scale
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = "transparent";
      e.target.style.transform = "scale(0.3)"; // Restore original scale
    }} src={TxtImage} alt="Edit Icon" onClick={handleEditUsername} />
          </div>
        </div>
      </div>
      <div className="form-field">
        <label style={{color:"#1B4375", fontWeight:"bold"}} htmlFor="email">Email ID</label>
        <div className="input-with-icon" style={{ display: "flex", alignItems: "center" }}>
          <input onClick={clickem} style={{color:"#1B4375"}}   type="email" id="email" value={email} disabled />
          <div style={{}}>
            {/* <img style={{ width: "50px", height: "50px", transform: "scale(0.5)" }} src={TxtImage} alt="Edit Icon" onClick={handleEditEmail} /> */}
          </div>
        </div>
      </div>
    </form>
  );
}

export const PasswordResetForm = ({ oldPassword, setOldPassword, handleChangePassword, email }) => {
  return (
    <form id="passform" className="slide-in" style={{paddingLeft: "30px", paddingTop: "30px" }}>
      <div className="form-field">
        <label style={{color:"#1B4375", fontWeight:"bold"}} htmlFor="oldpassword">Email</label>
        <div className="input-with-icon" style={{ display: "flex", alignItems: "center" }}>
          <input type="email" id="oldpassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required="true" />
        </div>
      </div>
      <button onClick={() => handleChangePassword(email)} style={{ 
      border: "2px solid #1B4375", 
      width: "30%", 
      padding: "10px",
      marginBottom:"10px",
      cursor: "pointer", 
      outline: "none",
      backgroundColor: "transparent",
      borderRadius: "20px",
      color:"#1B4375", fontWeight:"bold"
    }} onMouseEnter={(e) => { 
      e.target.style.backgroundColor = "#1B4375"; 
      e.target.style.color = "#E3ECF2"; // Set text color
    }}
    onMouseLeave={(e) => {e.target.style.backgroundColor = "transparent"; e.target.style.color = "#1B4375";}} >Password Reset</button>
    
    </form>
    
    
  );
}

export const DeleteAccountForm = ({ deleteText, setDeleteText, setiscapv, showToast }) => {
  return (
    <form id="deleteform" className="slide-in" style={{ paddingLeft: "30px", paddingTop: "30px" }}>
      <div className="form-field">
        <label style={{color:"#1B4375", fontWeight:"bold"}} htmlFor="delete">Type "DELETE"</label>
        <div className="input-with-icon" style={{ display: "flex", alignItems: "center" }}>
          <input style={{color:"#1B4375"}} type="text" id="delete" value={deleteText} onChange={(e) => setDeleteText(e.target.value)} />
        </div>
      </div>
      <div className="form-field">
        <p style={{color:"#1B4375", fontWeight:"bold"}}>Deleting your account will remove all your information from the database. This cannot be undone.</p>
      </div>
      <button style={{ 
      border: "2px solid red", 
      width: "30%", 
      padding: "10px", 
      marginBottom:"10px",
      cursor: "pointer", 
      outline: "none",
      backgroundColor: "transparent",
      borderRadius: "20px",
      color:"red",
      fontWeight:"bold"
    }} onClick={(e)=>
      {
      e.preventDefault(); 
      if(deleteText===''){
        showToast("Pease enter 'DELETE' in the given field to proceed");
      }else{
        setiscapv(true);
      }
      
    }} onMouseEnter={(e) => {e.target.style.backgroundColor = "#ff6961";}}
    onMouseLeave={(e) =>{ e.target.style.backgroundColor = "transparent";} }>Delete Account</button>
    </form>
  );
}
