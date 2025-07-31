import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-lg);
`;

const Title = styled(motion.h1)`
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: var(--spacing-2xl);
`;

const Content = styled(motion.div)`
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--color-text-secondary);
  
  p {
    margin-bottom: var(--spacing-lg);
  }
`;

function AboutPage() {
  return (
    <Container>
      <Title
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        About TransparencyHub
      </Title>
      
      <Content
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <p>
          TransparencyHub is a comprehensive platform designed to help consumers make 
          informed decisions about the products they use every day. We believe everyone 
          deserves access to transparent, accurate information about product health, 
          sustainability, and ethical considerations.
        </p>
        
        <p>
          Our AI-powered analysis system asks intelligent questions tailored to each 
          product category, gathering detailed information to generate comprehensive 
          transparency reports. These reports provide clear insights into health impacts, 
          environmental sustainability, ethical manufacturing practices, and overall 
          product transparency.
        </p>
        
        <p>
          Join us in building a more transparent marketplace where informed consumers 
          can drive positive change towards healthier, more sustainable, and ethically 
          produced products.
        </p>
      </Content>
    </Container>
  );
}

export default AboutPage;