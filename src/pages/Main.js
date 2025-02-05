import React, { useEffect, useState } from "react"; // Import useEffect and useState
import Modal from "../components/Modal";
import BackgroundGrid3D from '../components/BackgroundGrid3D'; 
import "./Main.css";

const Main = (async) => {
    const [response, setResponse] = useState(null);   //  --------> API data here
    const [bullets, setBullets] = useState(null);     //-------> list of lists go here i think
    const [error, setError] = useState(null); 
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [docId, setDocId] = useState('');
    const [url, setUrl] = useState('');

    // In your React component or wherever needed
    function getTabURL() {
        return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
            resolve(tabs[0].url);
            } else {
                reject('No active tab found');
            }
        });
    });
  }
  
  

    //       setShowModal(true);                 
    const viewTableau = () => {
   
            //send data to a showModal (i guess this is where the tabeleau goes)
        setModalMessage(url);                   // DEBUG: PRINTING THE URL HERE WORKS!!!!!
        setShowModal(true); // Show the modal
        console.log("Button clicked!");
    };


    const summarizeTOS = async (content) => {
        try {
            const response = await fetch('http://localhost:8000/api/summarize_tos/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ text: content }),
            });
            const data = await response.json();
            if(response.ok) {
                setDocId(data.id);
                fetchBullets(data.id);
            }
            else {
                console.error(data.error);
            }
        }
        catch (error){
            console.log("ToS Summarization Error: ", error);
        }

    }


   
const fetchBullets = async (docId) => {
    try {
        const response = await fetch(`http://localhost:8000/api/get_bullets/?doc_id=${docId}`);
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

    // const tosText = "Your Terms of Service text here.";  // --> we can just use sample data here....?

    useEffect(() => {
        getTabURL()
            .then((activeUrl) => {
                console.log('Current Tab URL:', activeUrl);
                setUrl(activeUrl); // Store the URL in state
                // somehow we need to detect and store ToS data here into tosText

                const tosText = "Your Terms of Service text here.";  // You can later pass real data or use the URL to scrape ToS from the active tab
                summarizeTOS(tosText);  // Use the fetched ToS text here
            })
            .catch((error) => {
                console.error('Error retrieving URL:', error);
            });
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
                <h2>What you missed out on...</h2>
                {bullets && (
                    <div>
                        <h3>Good:</h3>
                        <ul>{bullets.good.map((bullet, index) => <li key={index}>{bullet}</li>)}</ul>
                        <h3>Neutral:</h3>
                        <ul>{bullets.neutral.map((bullet, index) => <li key={index}>{bullet}</li>)}</ul>
                        <h3>Bad:</h3>
                        <ul>{bullets.bad.map((bullet, index) => <li key={index}>{bullet}</li>)}</ul>
                    </div>
                )}
            </div>
        </div>
    </div>
);

  
}
//      <Modal show={showModal} message={error} onClose={closeModal} />


export default Main;