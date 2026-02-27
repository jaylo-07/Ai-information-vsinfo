import React from 'react';
import './App.css';
import Sidebar from './Pages/Sidebar';
import Header from './Pages/Header';

function App() {
  return (
    <div className="min-h-screen flex bg-[#131314] text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-[#131314]">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 lg:px-12">
          <div className="max-w-2xl w-full text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-4">
              Hello, I&apos;m Nexus AI
            </h1>
            <p className="text-sm md:text-base text-[#c4c7c5] mb-8">
              Ask anything and I&apos;ll help you with answers, ideas, and code.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
