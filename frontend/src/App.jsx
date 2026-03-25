import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Placeholder pages
import Home from './pages/Home';
import WomenSafety from './pages/WomenSafety';
import Documents from './pages/Documents';
import DocumentFlow from './pages/DocumentFlow';
import TriageResult from './pages/TriageResult';
import LawyerDashboard from './pages/LawyerDashboard';
import FindLawyer from './pages/FindLawyer';
import LawyerProfile from './pages/LawyerProfile';
import HowItWorks from './pages/HowItWorks';
import ChatPage from './pages/ChatPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import FindHelp from './pages/FindHelp';
import SaveEvidence from './pages/SaveEvidence';
import KnowYourRights from './pages/KnowYourRights';
import MyCases from './pages/MyCases';
import MyEvidence from './pages/MyEvidence';
import NgoDetails from './pages/NgoDetails';
import LawyerChat from './pages/LawyerChat';
import EvidenceDetails from './pages/EvidenceDetails';

// Simple placeholders for now
// const FindLawyer = () => <div className="container" style={{ padding: '40px' }}><h1>Find a Lawyer</h1><p>Coming soon...</p></div>;
// const HowItWorks = () => <div className="container" style={{ padding: '40px' }}><h1>How it works</h1><p>Coming soon...</p></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="women-safety" element={<WomenSafety />} />
          <Route path="documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
          <Route path="document-flow" element={<DocumentFlow />} />
          <Route path="triage" element={<TriageResult />} />
          <Route path="lawyer-dashboard" element={<ProtectedRoute><LawyerDashboard /></ProtectedRoute>} />
          <Route path="find-lawyer" element={<FindLawyer />} />
          <Route path="lawyer-profile" element={<LawyerProfile />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="/find-help" element={<FindHelp />} />
          <Route path="/ngo/:id" element={<NgoDetails />} />
          <Route path="/save-evidence" element={<ProtectedRoute><SaveEvidence /></ProtectedRoute>} />
          <Route path="/know-your-rights" element={<KnowYourRights />} />
          <Route path="/lawyer-chat" element={<ProtectedRoute><LawyerChat /></ProtectedRoute>} />
          <Route path="/my-cases" element={<ProtectedRoute><MyCases /></ProtectedRoute>} />
          <Route path="/evidence/:id" element={<ProtectedRoute><EvidenceDetails /></ProtectedRoute>} />
          <Route path="/my-evidence" element={<ProtectedRoute><MyEvidence /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
