import React, { useEffect, useState } from "react"; // Import useEffect and useState
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { CyberEl88 } from 'react-cyber-elements'
import BackgroundGrid3D from '../components/BackgroundGrid3D'; 
import "./Main.css";

const Main = (async) => {
    const [response, setResponse] = useState(null);   //  --------> API data here
    const [data, setData] = useState(null);     //-------> list of lists go here i think
    const [error, setError] = useState(null); 
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    //       setShowModal(true);                 
    const viewTableau = () => {
   
            //send data to a showModal (i guess this is where the tabeleau goes)
        setModalMessage('Graphical Data Representation!'); 
        setShowModal(true); // Show the modal
        console.log("Button clicked!");
    };

   
  // Example function to fetch data from your Django backend
const fetchData = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/bullets-get/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Handle data




        console.log(data);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

useEffect(() => {
    fetchData();
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
                <p>There definitely does not exist another app that looks like this</p>
                
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
                    View Details
                </button>
            </div>

            <Modal show={showModal} message={modalMessage} onClose={closeModal} />

            <div className="api-content">
                <h2>API Content</h2>
                <p>Displaying data here</p>
            </div>
        </div>
    </div>
);

  
}
//      <Modal show={showModal} message={error} onClose={closeModal} />


export default Main;