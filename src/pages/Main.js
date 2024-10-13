/* eslint-disable no-undef */
import React, { useState } from "react";
import BackgroundGrid3D from '../components/BackgroundGrid3D'; 
import "./Main.css";

const Main = () => {
    const [bullets, setBullets] = useState(null);  // Bullet points go here
    const [error, setError] = useState(null); 
    const [docId, setDocId] = useState('');

    // Fetch the summarized ToS content
    const summarizeTOS = async (content) => {
        try {
            const response = await fetch('http://localhost:8000/api/tos-summarize/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });
            const data = await response.json();
            if (response.ok) {
                setDocId(data.id);
                fetchBullets(data.id); // Fetch the bullet points after ToS summary is generated
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError("ToS Summarization Error: " + error.message);
        }
    };

    // Fetch the bullets using docId
    const fetchBullets = async (docId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/get_bullets/?doc_id=${docId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setBullets(data);  // Store bullet points in state
        } catch (error) {
            setError('Fetch operation error: ' + error.message);
        }
    };

    // Function to send a message to the content script to detect ToS
    const handleDetectToS = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'getToS' }, (response) => {
                if (response && response.termsContent && response.termsContent !== 'No ToS found on this page.') {
                    summarizeTOS(response.termsContent);  // Send ToS content to the backend
                } else {
                    setError('No Terms of Service detected.');
                }
            });
        });
    };

    return (
        <div>
            <BackgroundGrid3D />

            <div style={{ padding: "20px", textAlign: "center", position: "relative", zIndex: 3 }}>
                <div className="translucent-rectangle">
                    <h1>Byte-Sized Terms</h1>
                    <p>Quick and easy summaries of your Terms of Service</p>

                    {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Display errors if any */}

                    <button 
                        onClick={handleDetectToS}  // Detect ToS when clicked
                        className="tableauButton" 
                        style={{ padding: "10px 20px", fontSize: "16px", position: 'relative', zIndex: 4, marginTop: '20px' }}
                    >
                        Detect ToS
                    </button>
                </div>

                <div className="api-content">
                    <h2>API Content</h2>
                    {bullets ? (
                        <div>
                            <h3>Good:</h3>
                            <ul>{bullets.good.map((bullet, index) => <li key={index}>{bullet}</li>)}</ul>
                            <h3>Neutral:</h3>
                            <ul>{bullets.neutral.map((bullet, index) => <li key={index}>{bullet}</li>)}</ul>
                            <h3>Bad:</h3>
                            <ul>{bullets.bad.map((bullet, index) => <li key={index}>{bullet}</li>)}</ul>
                        </div>
                    ) : (
                        <p>Loading bullet points...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Main;
