import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-lg);
`;

function ReportsListPage() {
  return (
    <Container>
      <h1>Reports</h1>
      <p>This page will show a list of all generated transparency reports.</p>
    </Container>
  );
}

export default ReportsListPage;