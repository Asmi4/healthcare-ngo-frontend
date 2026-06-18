import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({ name: '', role: 'Patient', message: '' });
  const [aiSummary, setAiSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pointing directly to your local Spring Boot backend we tested in Postman
  const BACKEND_URL = "https://healthcare-ngo-backend.onrender.com/api/triage"; 

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAiSummary(null); // Clear previous metrics

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error("Backend server responded with an error status.");
      }

      const data = await response.json();
      setAiSummary(data);
    } catch (error) {
      console.error("Error connecting to Java backend:", error);
      alert("Could not connect to the Java Spring Boot backend. Ensure your server is running on port 8080.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Jarurat Care</h1>
        <p>AI-Powered Healthcare Intake Portall</p>
      </header>

      <div className="dashboard-grid">
        {/* Left Side: Form Panel */}
        <div className="card-form">
          <h2 className="card-title">Registration Intake Form</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" required value={formData.name} onChange={handleInputChange} placeholder="e.g., Jane Doe" />
            </div>

            <div className="form-group">
              <label htmlFor="role">I am registering as a:</label>
              <select id="role" name="role" value={formData.role} onChange={handleInputChange}>
                <option value="Patient">Patient (Seeking Assistance)</option>
                <option value="Volunteer">Volunteer (Offering Support)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Describe your situation or background details</label>
              <textarea id="message" name="message" rows="5" required value={formData.message} onChange={handleInputChange} placeholder="Type your message here... (Try words like 'urgent' or 'pain' to test the AI prioritization algorithm)"></textarea>
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Processing via Spring Boot API...' : 'Submit to Intake'}
            </button>
          </form>
        </div>

        {/* Right Side: Admin Dashboard Panel */}
        <div className="card-admin">
          <div>
            <h2 className="card-title admin-title">⚡ NGO Live Admin Dashboard</h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '-1rem', marginBottom: '2rem' }}>
              Real-time LLM Metrics & Automation Pipeline
            </p>

            {isLoading && (
              <div className="loading-text">
                <h3>Analyzing payload token context...</h3>
                <p style={{ fontSize: '0.85rem' }}>Invoking Llama-3.1 model engine via Java backend.</p>
              </div>
            )}

            {aiSummary && !isLoading && (
              <div style={{ animation: 'pulse 0.5s ease-out' }}>
                <div className="log-box">
                  <span className="log-label">Triage Priority Level</span>
                  <span className="log-value">{aiSummary.urgencyLevel}</span>
                </div>

                <div className="log-box purple">
                  <span className="log-label">Auto-Categorization</span>
                  <span className="log-value" style={{ fontSize: '1rem' }}>{aiSummary.category}</span>
                </div>

                <div className="log-box emerald">
                  <span className="log-label">AI Smart Insight Extract</span>
                  <p className="log-text">"{aiSummary.keyTakeaway}"</p>
                </div>

                <div className="log-box" style={{ borderLeftColor: '#f59e0b', marginTop: '1.5rem' }}>
                  <span className="log-label" style={{ color: '#fbcfe8' }}>✨ Automated Communication Draft</span>
                  <p className="log-text" style={{ color: '#f8fafc', fontStyle: 'normal', marginTop: '0.5rem' }}>
                    {aiSummary.suggestedAutoResponse}
                  </p>
                  <button 
                    type="button" 
                    onClick={() => { navigator.clipboard.writeText(aiSummary.suggestedAutoResponse); alert("Copied response draft to clipboard!"); }}
                    style={{ background: '#334155', fontSize: '0.75rem', padding: '0.4rem', marginTop: '0.75rem', width: 'auto' }}
                  >
                    Copy Draft
                  </button>
                </div>
              </div>
            )}

            {!aiSummary && !isLoading && (
              <div className="placeholder-text">
                <p>Awaiting form submission...</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  Submit the configuration on the left to witness the decoupling lifecycle and live LLM stream logic.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
