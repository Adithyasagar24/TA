import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-lg);
`;

function QuestionnairePage() {
  const { id } = useParams();
  
  return (
    <Container>
      <h1>Questionnaire Page</h1>
      <p>Product ID: {id}</p>
      <p>This page will contain the intelligent questioning system for product analysis.</p>
    </Container>
  );
}

export default QuestionnairePage;