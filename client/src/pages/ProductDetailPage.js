import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-lg);
`;

function ProductDetailPage() {
  const { id } = useParams();
  
  return (
    <Container>
      <h1>Product Detail Page</h1>
      <p>Product ID: {id}</p>
      <p>This page will show detailed product information and allow users to start the questionnaire.</p>
    </Container>
  );
}

export default ProductDetailPage;