import React from 'react';
import styled from 'styled-components';
import '../index.css';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-background-dark, #121212);
`;

const HeroSection = styled.section`
  flex-grow: 1;
  background-image: url('AbootHD.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  min-height: 100vh;
`;

const TextOverlayBox = styled.div`
  background-color: #ffffff;
  color: #000000;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 850px;
  text-align: left;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
`;

const PageTitle = styled.h1`
  font-family: var(--font-heading, 'Lilita One', cursive);
  font-size: clamp(2.5rem, 8vw, 3.5rem);
  color: var(--color-accent-pink, #FFD9EB);
  margin-bottom: 1.5rem;
  text-align: left;
`;

const PageText = styled.p`
  font-size: 17px;
  line-height: 1.7;
  color: #000000;
  margin-bottom: 1.25rem;
`;

const TermsConditions = () => {
  return (
    <PageWrapper>
      <HeroSection>
        <TextOverlayBox>
          <PageTitle>Terms & Conditions</PageTitle>
          <PageText>By using This Side Up’s website, you agree to the following terms.</PageText>
          <PageText><strong>Order acceptance:</strong> We reserve the right to decline orders for any reason.</PageText>
          <PageText><strong>Pricing & availability:</strong> Subject to change without prior notice.</PageText>
          <PageText><strong>Intellectual property:</strong> All images, logos, and designs belong to This Side Up.</PageText>
          <PageText><strong>Liability:</strong> Not liable for damages from the use of our site or products.</PageText>
          <PageText><strong>Jurisdiction:</strong> Governed by the laws of Singapore.</PageText>
        </TextOverlayBox>
      </HeroSection>
    </PageWrapper>
  );
};

export default TermsConditions;
