import React from 'react';
import UserList from '.src/components/UserList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Full-Stack Deployment Practice</h1>
        <p>Node.js + Express + PostgreSQL + React</p>
      </header>
      <main>
        <UserList />
      </main>
    </div>
  );
}

export default App;