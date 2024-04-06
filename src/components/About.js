import React, { useEffect, useState } from 'react';
import '../css/ManageProfile.css';
import MenuItems from './MenuItems';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

function Toast({ message }) {
  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#333', color: '#fff', padding: '10px 20px', borderRadius: '5px', zIndex: '9999' }}>
      {message}
    </div>
  );
}

const About = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  const [toastMessage, setToastMessage] = useState('');
  const [ab, setab] = useState(false);
  const [mis, setmis] = useState(false);
  const [com, setcom] = useState(false);
  const [ch, setch] = useState(false);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000); // Hide the toast after 3 seconds
  };

  useEffect(() => {
    if (!userLoggedIn) {
      navigate('/signin'); // Redirect to signin page if user not logged in
    }
  }, [userLoggedIn, navigate]);

  return (
    <div className="custom-cursor" >
      <table style={{ width: "100%", height: "100%" }}>
        <tr>
          <td className="signupd" style={{ width: "20%" }}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ marginBottom: "auto" }}>
                <MenuItems initialActiveItem="dashboard" />
              </div>
            </div>
          </td>
          <td className="rtab" colSpan="2" style={{ overflowY: 'auto', textAlign: 'center' }}>
            <div class="rtab" style={{ transform: 'scale(0.8)', transformOrigin: 'center', display: 'inline-block' }}>
              
                
                <div style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.3)", padding:"10px", backgroundColor: ab ? "#E5E5E5" : "#1b4375", transition: "background-color 0.3s ease",}} onMouseEnter={(e)=>{setab(true);}} onMouseLeave={(e)=>{
                  setab(false);
                }}>
                  {!ab &&(<h1 style={{ color: "#E5E5E5" }}>About Us</h1>)}
                    {ab && (<h2 style={{ color: "#1b4375" }}>
                      Welcome to BeAware, where we are dedicated to revolutionizing
                      accessibility and inclusivity for the Deaf and hard of hearing
                      community. Our journey began with a simple yet powerful vision –
                      to empower individuals with innovative technology that enhances
                      their daily lives, fosters independence, and promotes equal
                      opportunities for all.
                    </h2> )}
                    
                    </div>                 
                <div className="row">
                <div className="col-md-2">
                  <div style={{marginTop:"20px", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.3)", padding:"10px", backgroundColor: mis ? "#E5E5E5" : "#1b4375", transition: "background-color 0.3s ease",}} onMouseEnter={(e)=>{setmis(true);}} onMouseLeave={(e)=>{
                  setmis(false);
                }}>
                {!mis && ( <h1 style={{ color: "#E5E5E5" }}>Our Mission</h1>)}
                {mis && (<h2 style={{ color: "#1b4375" }}>
                      At BeAware, our mission is clear: to break down barriers and
                      create a world where communication knows no bounds. We strive to
                      develop cutting-edge solutions that bridge the gap between the
                      Deaf and hard of hearing and the rest of the world, ensuring
                      seamless interaction in all aspects of life.
                    </h2>)}
                   
                    
                  </div></div><p></p>
                  <div className="col-md-2">
                  <div style={{marginTop:"20px", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.3)", padding:"10px", backgroundColor: com ? "#E5E5E5" : "#1b4375", transition: "background-color 0.3s ease",}} onMouseEnter={(e)=>{setcom(true);}} onMouseLeave={(e)=>{
                  setcom(false);
                }}>
                    {!com && (<h1 style={{ color: "#E5E5E5" }}>Our Commitment</h1>)}
                    {com && ( <h2 style={{ color: "#1b4375" }}>
                      We are committed to providing top-notch, award-winning
                      applications tailored specifically for the Deaf and hard of
                      hearing. Our products are not just tools; they are lifelines,
                      empowering individuals to navigate the complexities of the modern
                      world with confidence and ease.
                    </h2>)}
                  </div></div></div>
                
                         <br></br>     
                         <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
  <div style={{marginTop:"20px", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.3)", padding:"10px", backgroundColor: ch ? "#E5E5E5" : "#1b4375"}} onMouseEnter={()=>{setch(true);}} onMouseLeave={()=>{setch(false)}}>
  <div >
  {!ch && (<h1 style={{ color: "#E5E5E5" }}>
      Why Choose BeAware?
    </h1>)}
  </div>
  {ch && (<div style={{ minWidth: "250px", flex: "1 1 auto" }}>
    <div style={{width: "100%", margin: "0"}}>
      <h3>
        <strong style={{ color: "#1b4375" }}>Innovation:</strong> We leverage
        the latest advancements in machine learning and mobile
        technology to deliver unparalleled solutions that cater to the
        unique needs of our community.
      </h3>
    </div><p></p>
    <div>
      <h3>
        <strong style={{ color: "#1b4375" }}>Accessibility:</strong> Our
        applications are designed with accessibility in mind, offering
        intuitive features that enhance communication, alerting, and
        transcription in real-time.
      </h3>
    </div><p></p>
    <div>
      <h3>
        <strong style={{ color: "#1b4375" }}>Privacy:</strong> We prioritize
        the privacy and security of our users, ensuring that their
        personal data remains confidential and protected at all times.
      </h3>
    </div><p></p>
    <div>
      <h3>
        <strong style={{ color: "#1b4375" }}>Community-Centric:</strong> We
        believe in the power of community-driven development. By
        embracing open-source principles and actively engaging with our
        users, we continuously refine and improve our products to better
        serve the needs of our community.
      </h3>
    </div>
  </div>)}</div>
                  </div>
                  <p></p><p></p>
                <br></br><br></br>
                  <a href="https://docs.google.com/forms/d/e/1FAIpQLScQxVBU0Howdjz2VJaj13mHBTaTDtURpUcRovsKt-tBaJ-Drw/viewform" target="_blank" rel="noopener noreferrer" class="button"><span>Contact Us</span></a>

            </div>
          </td>
        </tr>
      </table>
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}

export default About;
