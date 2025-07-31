import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
`;

const Spinner = styled.div`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 3px solid var(--color-gray-200);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: var(--spacing-md);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
`;

function LoadingSpinner({ size, text = 'Loading...' }) {
  return (
    <SpinnerContainer>
      <Spinner size={size} />
      {text && <LoadingText>{text}</LoadingText>}
    </SpinnerContainer>
  );
}

export default LoadingSpinner;