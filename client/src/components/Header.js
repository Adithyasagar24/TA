import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Search, Menu, X, Shield, Heart, Leaf, Eye } from 'lucide-react';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
  z-index: var(--z-fixed);
  transition: all var(--transition-normal);

  @media (max-width: 768px) {
    background: var(--color-surface);
  }
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;

  @media (max-width: 768px) {
    padding: 0 var(--spacing-md);
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  text-decoration: none;
  transition: color var(--transition-fast);

  &:hover {
    color: var(--color-primary);
  }
`;

const LogoIcon = styled(Shield)`
  width: 32px;
  height: 32px;
  color: var(--color-primary);
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius);
  transition: all var(--transition-fast);
  position: relative;

  &:hover {
    color: var(--color-primary);
    background: var(--color-surface-hover);
  }

  &.active {
    color: var(--color-primary);
    background: var(--color-primary);
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(16, 185, 129, 0.1));
  }

  &.active::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    background: var(--color-primary);
    border-radius: 50%;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-surface-hover);
    color: var(--color-primary);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-lg);
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const MobileNavLink = styled(Link)`
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: var(--spacing-md);
  border-radius: var(--radius);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);

  &:hover {
    color: var(--color-primary);
    background: var(--color-surface-hover);
  }

  &.active {
    color: var(--color-primary);
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(16, 185, 129, 0.1));
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-surface-hover);
    color: var(--color-primary);
  }
`;

const CTAButton = styled(Link)`
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius);
  font-weight: var(--font-medium);
  text-decoration: none;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow);

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const navItems = [
  { path: '/', label: 'Home', icon: Shield },
  { path: '/products', label: 'Products', icon: Search },
  { path: '/reports', label: 'Reports', icon: Eye },
  { path: '/about', label: 'About', icon: Heart },
];

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          <LogoIcon />
          <span>TransparencyHub</span>
        </Logo>

        <NavLinks>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={isActiveRoute(item.path) ? 'active' : ''}
            >
              {item.label}
            </NavLink>
          ))}
        </NavLinks>

        <SearchContainer>
          <SearchButton>
            <Search size={20} />
          </SearchButton>
          
          <CTAButton to="/products">
            Start Analysis
          </CTAButton>

          <MobileMenuButton onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </SearchContainer>
      </Nav>

      {isMobileMenuOpen && (
        <MobileMenu
          variants={mobileMenuVariants}
          initial="closed"
          animate="open"
          exit="closed"
        >
          <MobileNavLinks>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <MobileNavLink
                  key={item.path}
                  to={item.path}
                  className={isActiveRoute(item.path) ? 'active' : ''}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <IconComponent size={20} />
                  {item.label}
                </MobileNavLink>
              );
            })}
            <MobileNavLink
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Search size={20} />
              Start Analysis
            </MobileNavLink>
          </MobileNavLinks>
        </MobileMenu>
      )}
    </HeaderContainer>
  );
}

export default Header;