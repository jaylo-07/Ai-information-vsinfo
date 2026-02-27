import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-5xl font-extrabold text-blue-600 mb-4 tracking-tight">
        Welcome Home
      </h1>
      <p className="text-lg text-gray-600 max-w-md text-center">
        This is a demo showcasing how React Router and Tailwind CSS can be used seamlessly together.
      </p>
    </div>
  );
}

function About() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-5xl font-extrabold text-green-600 mb-4 tracking-tight">
        About Us
      </h1>
      <p className="text-lg text-gray-600 max-w-md text-center">
        Learn more about our mission and journey on this modern platform.
      </p>
    </div>
  );
}

function Contact() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-5xl font-extrabold text-purple-600 mb-4 tracking-tight">
        Contact
      </h1>
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-md w-full">
        <p className="text-gray-600 mb-6 text-center">Feel free to reach out to us!</p>
        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
          Send a Message
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <nav className="bg-white shadow-sm sticky top-0 z-10 w-full border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0 flex items-center">
                <span className="font-bold text-xl text-indigo-600 tracking-wide">ReactApp</span>
              </div>
              <div className="flex space-x-8">
                <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition duration-150">Home</Link>
                <Link to="/about" className="text-gray-600 hover:text-indigo-600 font-medium transition duration-150">About</Link>
                <Link to="/contact" className="text-gray-600 hover:text-indigo-600 font-medium transition duration-150">Contact</Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
