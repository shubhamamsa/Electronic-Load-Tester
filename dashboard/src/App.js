import './App.css';
// import React from 'react'
import Dashboard from './Dashboard.js';
import FormHandler from './FormHandler.js';

function App() {
  return (
    <div className="box">
      <div id="formHandler">
        <FormHandler />
      </div>
      <div id="dashboard">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
