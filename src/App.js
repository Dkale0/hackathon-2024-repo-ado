import React from 'react';
import ADOCardGame from './game/ADOCardGame';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>ADO Card Game</h1>
      </header>
      <main>
        <ADOCardGame />
      </main>
    </div>
  );
}

export default App;