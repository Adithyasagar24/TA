import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Import pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import QuestionnairePage from './pages/QuestionnairePage';
import ReportPage from './pages/ReportPage';
import ReportsListPage from './pages/ReportsListPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

// Styled components
const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
`;

const MainContent = styled(motion.main)`
  flex: 1;
  padding-top: 80px; /* Account for fixed header */
`;

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
};

function App() {
  return (
    <AppContainer>
      <Header />
      
      <MainContent
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<HomePage />} />
          
          {/* Products */}
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          
          {/* Questionnaire */}
          <Route path="/products/:id/questions" element={<QuestionnairePage />} />
          
          {/* Reports */}
          <Route path="/reports" element={<ReportsListPage />} />
          <Route path="/reports/:id" element={<ReportPage />} />
          <Route path="/reports/number/:reportNumber" element={<ReportPage />} />
          <Route path="/products/:productId/report" element={<ReportPage />} />
          
          {/* About */}
          <Route path="/about" element={<AboutPage />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainContent>
      
      <Footer />
    </AppContainer>
  );
}

export default App;