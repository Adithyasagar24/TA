import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Shield, Heart, Github, Twitter, Mail } from 'lucide-react';

const FooterContainer = styled.footer`
  background: var(--color-gray-900);
  color: var(--color-gray-300);
  padding: var(--spacing-3xl) 0 var(--spacing-xl);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-2xl);
  margin-bottom: var(--spacing-2xl);
`;

const FooterSection = styled.div`
  h3 {
    color: white;
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    margin-bottom: var(--spacing-lg);
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const FooterLink = styled(Link)`
  color: var(--color-gray-300);
  text-decoration: none;
  transition: color var(--transition-fast);

  &:hover {
    color: var(--color-primary-light);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--color-gray-800);
  border-radius: var(--radius);
  color: var(--color-gray-300);
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-primary);
    color: white;
    transform: translateY(-2px);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid var(--color-gray-800);
  padding-top: var(--spacing-xl);
  text-align: center;
  color: var(--color-gray-400);
  font-size: var(--text-sm);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: white;
  margin-bottom: var(--spacing-md);
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterTop>
          <FooterSection>
            <Logo>
              <Shield size={24} />
              TransparencyHub
            </Logo>
            <p>
              Empowering consumers to make informed, ethical, and health-conscious 
              decisions through transparent product analysis.
            </p>
            <SocialLinks>
              <SocialLink href="#" aria-label="Twitter">
                <Twitter size={20} />
              </SocialLink>
              <SocialLink href="#" aria-label="GitHub">
                <Github size={20} />
              </SocialLink>
              <SocialLink href="#" aria-label="Email">
                <Mail size={20} />
              </SocialLink>
            </SocialLinks>
          </FooterSection>

          <FooterSection>
            <h3>Platform</h3>
            <FooterLinks>
              <FooterLink to="/products">Analyze Products</FooterLink>
              <FooterLink to="/reports">View Reports</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <h3>Resources</h3>
            <FooterLinks>
              <FooterLink to="/help">Help Center</FooterLink>
              <FooterLink to="/api">API Documentation</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <h3>Legal</h3>
            <FooterLinks>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/cookies">Cookie Policy</FooterLink>
            </FooterLinks>
          </FooterSection>
        </FooterTop>

        <FooterBottom>
          <p>
            © 2024 TransparencyHub. Made with <Heart size={16} style={{ color: 'var(--color-error)', display: 'inline' }} /> for a healthier world.
          </p>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;