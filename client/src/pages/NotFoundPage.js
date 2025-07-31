import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
  padding: var(--spacing-2xl);
`;

const ErrorCode = styled(motion.div)`
  font-size: 8rem;
  font-weight: var(--font-bold);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-lg);
`;

const Title = styled(motion.h1)`
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
`;

const Description = styled(motion.p)`
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-2xl);
  max-width: 500px;
  line-height: var(--leading-relaxed);
`;

const Actions = styled(motion.div)`
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
  justify-content: center;
`;

const HomeButton = styled(Link)`
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius);
  font-weight: var(--font-medium);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: all var(--transition-fast);

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
`;

const BackButton = styled(Link)`
  background: var(--color-surface);
  color: var(--color-text-primary);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius);
  font-weight: var(--font-medium);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  border: 2px solid var(--color-border);
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
`;

function NotFoundPage() {
  return (
    <Container>
      <ErrorCode
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        404
      </ErrorCode>
      
      <Title
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Page Not Found
      </Title>
      
      <Description
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        Sorry, we couldn't find the page you're looking for. 
        It might have been moved, deleted, or you entered the wrong URL.
      </Description>
      
      <Actions
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <HomeButton to="/">
          <Home size={20} />
          Go Home
        </HomeButton>
        <BackButton onClick={() => window.history.back()}>
          <ArrowLeft size={20} />
          Go Back
        </BackButton>
      </Actions>
    </Container>
  );
}

export default NotFoundPage;