import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-lg);
`;

function ReportPage() {
  const { id, reportNumber, productId } = useParams();
  
  return (
    <Container>
      <h1>Transparency Report</h1>
      {id && <p>Report ID: {id}</p>}
      {reportNumber && <p>Report Number: {reportNumber}</p>}
      {productId && <p>Product ID: {productId}</p>}
      <p>This page will display the comprehensive product transparency report.</p>
    </Container>
  );
}

export default ReportPage;