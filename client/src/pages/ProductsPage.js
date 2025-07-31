import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-lg);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2xl);
  flex-wrap: wrap;
  gap: var(--spacing-lg);
`;

const Title = styled.h1`
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
`;

const Actions = styled.div`
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
`;

const SearchContainer = styled.div`
  position: relative;
  min-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-md) 40px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  font-size: var(--text-base);
  transition: border-color var(--transition-fast);

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
`;

const AddButton = styled(Link)`
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

const FilterButton = styled.button`
  padding: var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-secondary);
`;

const EmptyTitle = styled.h2`
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
`;

const EmptyDescription = styled.p`
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--spacing-xl);
`;

function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Container>
      <Header>
        <Title>Product Analysis</Title>
        <Actions>
          <SearchContainer>
            <SearchIcon size={20} />
            <SearchInput
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
          <FilterButton>
            <Filter size={20} />
          </FilterButton>
          <AddButton to="/products/new">
            <Plus size={20} />
            Add Product
          </AddButton>
        </Actions>
      </Header>

      <EmptyState
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <EmptyTitle>Start Your First Analysis</EmptyTitle>
        <EmptyDescription>
          Add a product to begin analyzing its transparency, health impact, 
          sustainability, and ethical considerations.
        </EmptyDescription>
        <AddButton to="/products/new">
          <Plus size={20} />
          Add Your First Product
        </AddButton>
      </EmptyState>
    </Container>
  );
}

export default ProductsPage;