import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Search, BarChart3, Users, Heart, Leaf, Eye, CheckCircle } from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, 
    rgba(37, 99, 235, 0.05) 0%, 
    rgba(16, 185, 129, 0.05) 50%, 
    rgba(139, 92, 246, 0.05) 100%
  );
  padding: var(--spacing-3xl) 0;
  text-align: center;
`;

const HeroContent = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
  
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: var(--text-xl);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--spacing-2xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAContainer = styled(motion.div)`
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  padding: var(--spacing-lg) var(--spacing-2xl);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  font-size: var(--text-lg);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-lg);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
  }
`;

const SecondaryButton = styled(Link)`
  background: var(--color-surface);
  color: var(--color-text-primary);
  padding: var(--spacing-lg) var(--spacing-2xl);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  font-size: var(--text-lg);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: all var(--transition-normal);
  border: 2px solid var(--color-border);

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
`;

const FeaturesSection = styled.section`
  padding: var(--spacing-3xl) 0;
  background: var(--color-surface);
`;

const SectionTitle = styled.h2`
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  text-align: center;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xl);
`;

const FeaturesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-2xl);
`;

const FeatureCard = styled(motion.div)`
  background: var(--color-background);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-xl);
  text-align: center;
  box-shadow: var(--shadow);
  transition: all var(--transition-normal);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, 
    ${props => props.gradient || 'var(--color-primary), var(--color-secondary)'}
  );
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-lg);
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
`;

const FeatureDescription = styled.p`
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
`;

const StepsSection = styled.section`
  padding: var(--spacing-3xl) 0;
  background: var(--color-background);
`;

const StepsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-xl);
  margin-top: var(--spacing-2xl);
`;

const StepCard = styled(motion.div)`
  text-align: center;
  position: relative;
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  margin: 0 auto var(--spacing-lg);
`;

const StepTitle = styled.h3`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
`;

const StepDescription = styled.p`
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
`;

const StatsSection = styled.section`
  padding: var(--spacing-3xl) 0;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  text-align: center;
`;

const StatsGrid = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-2xl);
`;

const StatCard = styled(motion.div)`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--spacing-sm);
`;

const StatLabel = styled.div`
  font-size: var(--text-lg);
  opacity: 0.9;
`;

const features = [
  {
    icon: Search,
    title: 'Intelligent Analysis',
    description: 'AI-powered questioning system that adapts to your product and uncovers key transparency information.',
    gradient: 'var(--color-primary), var(--color-accent)'
  },
  {
    icon: Heart,
    title: 'Health-First Focus',
    description: 'Comprehensive health impact analysis including ingredients, allergens, and safety considerations.',
    gradient: 'var(--color-error), var(--color-warning)'
  },
  {
    icon: Leaf,
    title: 'Sustainability Insights',
    description: 'Environmental impact assessment covering packaging, carbon footprint, and sustainable sourcing.',
    gradient: 'var(--color-secondary), #22c55e'
  },
  {
    icon: Eye,
    title: 'Transparency Scoring',
    description: 'Clear scoring system that rates products on transparency, ethics, and information availability.',
    gradient: 'var(--color-accent), #06b6d4'
  }
];

const steps = [
  {
    number: 1,
    title: 'Add Your Product',
    description: 'Enter basic product information or scan a barcode to get started with the analysis.'
  },
  {
    number: 2,
    title: 'Answer Smart Questions',
    description: 'Our AI generates personalized questions based on your product category and available data.'
  },
  {
    number: 3,
    title: 'Get Transparency Report',
    description: 'Receive a comprehensive report with scores, insights, and actionable recommendations.'
  },
  {
    number: 4,
    title: 'Make Informed Decisions',
    description: 'Use the insights to make healthier, more ethical, and sustainable purchasing choices.'
  }
];

const stats = [
  { number: '10,000+', label: 'Products Analyzed' },
  { number: '95%', label: 'User Satisfaction' },
  { number: '50+', label: 'Health Factors' },
  { number: '24/7', label: 'Available Access' }
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function HomePage() {
  return (
    <Container>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          <HeroTitle variants={fadeInUp}>
            Discover Product Truth
          </HeroTitle>
          <HeroSubtitle variants={fadeInUp}>
            Make informed, ethical, and health-conscious decisions with our AI-powered 
            product transparency platform. Get comprehensive insights in minutes.
          </HeroSubtitle>
          <CTAContainer variants={fadeInUp}>
            <PrimaryButton to="/products">
              Start Analysis
              <ArrowRight size={20} />
            </PrimaryButton>
            <SecondaryButton to="/about">
              Learn More
            </SecondaryButton>
          </CTAContainer>
        </HeroContent>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <SectionTitle>Why Choose TransparencyHub?</SectionTitle>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureIcon gradient={feature.gradient}>
                <feature.icon size={40} />
              </FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      {/* How It Works Section */}
      <StepsSection>
        <StepsContainer>
          <SectionTitle>How It Works</SectionTitle>
          <StepsGrid>
            {steps.map((step, index) => (
              <StepCard
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <StepNumber>{step.number}</StepNumber>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </StepCard>
            ))}
          </StepsGrid>
        </StepsContainer>
      </StepsSection>

      {/* Stats Section */}
      <StatsSection>
        <SectionTitle style={{ color: 'white', marginBottom: 'var(--spacing-2xl)' }}>
          Trusted by Thousands
        </SectionTitle>
        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </StatsSection>
    </Container>
  );
}

export default HomePage;