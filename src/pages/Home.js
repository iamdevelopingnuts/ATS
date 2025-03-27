import React from 'react';
import { Container } from 'react-bootstrap';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import FeaturedJobs from '../components/home/FeaturedJobs';
import HowItWorks from '../components/home/HowItWorks';
import CTASection from '../components/home/CTASection';
import '../components/styles/CustomStyles.css';

const Home = () => {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedJobs />
      <HowItWorks />
      <CTASection />
    </>
  );
};

export default Home;