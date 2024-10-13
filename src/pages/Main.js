/* eslint-disable no-undef */
import React, { useEffect, useState } from "react"; 
import Modal from "../components/Modal";
import BackgroundGrid3D from '../components/BackgroundGrid3D'; 
import "./Main.css";

const Main = () => {
    const [bullets, setBullets] = useState(null); 
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const summarizeTOS = async (content) => {
        try {
            const response = await fetch('http://localhost:8000/api/tos-summarize/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: content }), // Send TOS text to backend
            });
            const data = await response.json();
            if (response.ok) {
                fetchBullets(data.id); // Fetch bullets using the returned doc_id
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.log("ToS Summarization Error: ", error);
        }
    };

    const fetchBullets = async (docId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/bullets-get/?doc_id=${docId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setBullets(data);
            console.log(data);
        } catch (error) {
            console.error('Fetch operation error:', error);
        }
    };

    useEffect(() => {
        // Listen for messages from the background script
        const messageListener = (request) => {
            if (request.docId) {
                summarizeTOS(request.docId); // Summarize ToS when docId is received
            }
        };

        chrome.runtime.onMessage.addListener(messageListener);

        return () => {
            chrome.runtime.onMessage.removeListener(messageListener); // Cleanup listener on component unmount
        };
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
                        onClick={() => { setModalMessage('Graphical Data Representation!'); setShowModal(true); }} 
                        className="tableauButton"
                    >
                        View Details
                    </button>
                </div>

                <Modal show={showModal} message={modalMessage} onClose={closeModal} />

                <div className="api-content">
                    <h2>API Content</h2>
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
};

export default Main;
