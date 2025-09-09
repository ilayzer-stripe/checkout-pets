import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthForm from './components/AuthForm';
import PetDisplay from './components/PetDisplay';
import Header from './components/Header';
import './styles/common.css';
import './styles/App.css';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        Loading...
      </div>
    );
  }

  return (
    <div className="App">
      <Header />

      <main className="app-main">
        {user ? <PetDisplay /> : <AuthForm />}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
