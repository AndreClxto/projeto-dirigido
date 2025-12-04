import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import Deputados from './pages/Deputados';
import Ranking from './pages/Ranking';
import Gastos from './pages/Gastos';
import Estatisticas from './pages/Estatisticas';
import Propostas from './pages/Propostas';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <Router>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onFinish={handleSplashFinish} />
        ) : (
          <Routes key="main">
            <Route path="/" element={<Home />} />
            <Route path="/deputados" element={<Deputados />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/gastos" element={<Gastos />} />
            <Route path="/estatisticas" element={<Estatisticas />} />
            <Route path="/propostas" element={<Propostas />} />
          </Routes>
        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;
