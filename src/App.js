import React from 'react'; // Import React
import Main from './pages/Main'; // Import Main.js
import './App.css';
import BackgroundGrid3D from './components/BackgroundGrid3D';

function App() {
  return (
    <div className="App">
      <BackgroundGrid3D />
      <Main />
    </div>
  );
}

export default App;