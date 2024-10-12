import React, { useEffect, useState } from "react"; // Import useEffect and useState
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import "./Main.css";

const Main = (async) => {
    const [response, setResponse] = useState(null);   //  --------> API data here
    const [data, setData] = useState(null); // Define state for data     -------> list of lists go here i think
    const [error, setError] = useState(null); // Define state for error
    const [showModal, setShowModal] = useState(false);

    //       setShowModal(true);                 
    const viewTableau = () => {
        // Define what happens when the button is clicked
            //send data to a showModal (i guess this is where the tabeleau goes)
        console.log("Button clicked!");
    };

   
  // Example function to fetch data from your Django backend
const fetchData = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/your-endpoint/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Handle your data




        console.log(data);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

// Call fetchData when your component mounts
useEffect(() => {
    fetchData();
}, []);

  
const closeModal = () => {
    setShowModal(false);
};

 
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
    <h1>Byte-Sized Terms?? i forgor the name already</h1>
    <p>There definitely does not exsit another app that look slike this</p>
    <button onClick={viewTableau} className= "tableauButton" style={{ padding: "10px 20px", fontSize: "16px" }}>
        View Details
    </button>
</div>
);
}
//      <Modal show={showModal} message={error} onClose={closeModal} />


export default Main;