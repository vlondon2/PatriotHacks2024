import React, { useEffect, useState } from "react"; // Import useEffect and useState
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { CyberEl88 } from 'react-cyber-elements'
import BackgroundGrid3D from '../components/BackgroundGrid3D'; 
import "./Main.css";

const Main = (async) => {
    const [response, setResponse] = useState(null);   //  --------> API data here
    const [bullets, setBullets] = useState(null);     //-------> list of lists go here i think
    const [error, setError] = useState(null); 
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [docId, setDocId] = useState('');


    //       setShowModal(true);                 
    const viewTableau = () => {
   
            //send data to a showModal (i guess this is where the tabeleau goes)
        setModalMessage('Summary!'); 
        setShowModal(true); // Show the modal
        console.log("Button clicked!");
    };


    const summarizeTOS = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/tos-summarize/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: "paypal" }), // Hardcoded the text "Paypal"
            });
            console.log("paypal sent paypal")
            const data = await response.json();
            if (response.ok) {
                setDocId(data.id);
                fetchBullets(data.id);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.log("ToS Summarization Error: ", error);
        }
    };
    


   
const fetchBullets = async (docId) => {
    try {
        const response = await fetch('http://localhost:8000/api/bullets-get/?doc_id=${docId}');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Handle data
        setBullets(data);



        console.log(data);
    } catch (error) {
        console.error('Fetch operation error:', error);
    }
};

useEffect(() => {
    const tosText = "Your Terms of Service text here.";  // --> we can just use sample data here....?
    //summarizeTOS(tosText); 
}, []);

  
const closeModal = () => {
    setShowModal(false);
};

return (
    <div>
        <BackgroundGrid3D />

        <div style={{ padding: "20px", textAlign: "center", position: "relative", zIndex: 3 }}>
            <div className="translucent-rectangle">
                <h1>Byte-Sized Terms</h1>
                <p>Simple Summary of your TOS</p>
                
                <button 
                    onClick={viewTableau} 
                    className="tableauButton" 
                    style={{ 
                        padding: "10px 20px", 
                        fontSize: "16px", 
                        position: 'relative', 
                        zIndex: 4, 
                        marginTop: '20px'
                    }}
                >
                    View Summary
                </button>
            </div>

            <Modal show={showModal} message={modalMessage} onClose={closeModal} />``
        </div>
    </div>
);

  
}
//      <Modal show={showModal} message={error} onClose={closeModal} />


export default Main;