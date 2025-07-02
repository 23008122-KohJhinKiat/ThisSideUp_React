
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import videoBG from '../icons/anSkimVignette.mp4';
import '../index.css';
import BG1 from '../icons/bg1.jpg';
import BG2 from '../icons/bg2.jpg';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';



const slides = [
  '/bannerHD.jpg',
  '/aizat2.jpeg',
  '/an2.jpeg',
  '/manonwakeboard.jpg',
];

const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.div`
  background-image: url(${props => props.bgImage});
  background-size: cover;
  position: relative;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center center;
  min-height: 100vh;
  width: auto;
  display: flex;
  align-items: center;
  padding: 2rem 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
  @media (min-width: 1200px) {
  }
`;

const InfoBox = styled.div`
  background-color: rgba(32, 32, 32, 0.85);
  padding: 1.5rem; /* Base padding */
  height: 750px;
  width: 90%; /* More responsive width for mobile */
  max-width: 560px; /* Keep the max-width for desktop */
  /* min-height: 700px; /* Consider if fixed height is needed or if content should dictate it */
  text-shadow: 2px 2px 5px rgba(0,0,0,0.50);
  border-radius: 8px; /* Optional: add some rounded corners */
  margin-left: auto; /* Default: center the box on mobile if HeroSection is full width */
  margin-right: auto;
  position: relative;
  z-index: 2;
  color: var(--color-text-light, #FFFFFF); /* Default text color */

  @media (min-width: 768px) {
    padding: 2rem;
    margin-left: 5%; /* Push it a bit to the left on tablets */
    margin-right: auto; /* Keep it from stretching too far right */
  }

  @media (min-width: 1024px) {
    padding: 2.5rem 2rem; /* More padding on desktop */
    margin-left: 80px; /* Recreate the original left offset for desktop */
    margin-right: auto;
  }
`;

const Subtitle = styled.p`
  font-size: clamp(1.5rem, 4vw, 2.25rem); /* 24px, 36px */
  color: var(--color-accent-orange, #FE9C7F); /* Using CSS variable from index.css */
  margin-bottom: 0.5em;
  font-family: "Inria Serif", serif;
  font-weight: bold;
`;

const Title = styled.p`
  font-size: clamp(2.5rem, 8vw, 4rem); /* 40px, 64px */
  color: var(--color-text-light, #FFFFFF);
  line-height: 1.1; /* Adjusted line height */
  padding-bottom: 0.5em;
  font-family: "Inria Serif", serif;
  font-weight: bold;
`;

const Tagline = styled.p`
  font-size: 24px;
  color: var(--color-accent-orange, #FDDDFD);
  line-height: 1.4;
  margin-bottom: 1.5em; /* Space before divider */
  font-family: "Inria Serif", serif;
  font-weight: bold;
`;

const Description = styled.p`
  font-size: 20px;
  color: var(--color-text-light, #FFFFFF);
  line-height: 1.6;
  font-family: "Inria Serif", serif;

`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0; /* Use rem for scalable margins */

  &::before,
  &::after {
    content: '';
    flex-grow: 1; /* Allow lines to take available space */
    border-bottom: 2px solid var(--color-accent-orange, #FE9C7F);
  }

  img {
    width: clamp(24px, 5vw, 28px); /* Responsive icon size */
    height: auto;
    margin: 0 clamp(10px, 3vw, 16px); /* Responsive margins */
  }
`
const SlideBackground = styled.div`
  background-image: url(${props => props.bgImage});
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: ${props => (props.active ? 1 : 0)};
  transition: opacity 1s ease-in-out;
  z-index: 0;
  pointer-events: none;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
`;

const VideoSection = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: 1;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;


const Home = () => {
  const { currentUser } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = 8000;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, slideInterval);
    return () => clearInterval(interval);
  }, []);

  const dividerIcon = "/assets/icons/icons8-surfguy.png";

  return (
    <PageWrapper>
      <HeroSection>
        {slides.map((slide, index) => (
          <SlideBackground
            key={index}
            bgImage={slide}
            active={index === currentSlide}
          />
        ))}
        <InfoBox>
          <Subtitle>Skim & Ride</Subtitle>
          <Title>Find Your Next Adventure</Title>
          <Tagline>
            Premium skimboards and beach gear, crafted for wave chasers
          </Tagline>

          <Divider>
            <img src={dividerIcon} alt="Surfer icon" />
          </Divider>

          <Description>
            This Side Up is an online store for skimboards, beach
            supplies, and custom board designs. This website
            makes it easy for customers to shop for skim-
            boarding gear and personalise their boards. This
            shop offers a simple and convenient way to get
            everything you need for your next beach adventure to the shore.
          </Description>
        </InfoBox>
      </HeroSection>

      <div style={{alignItems: 'center', display: 'flex', justifyContent: 'center', gap: '.75rem', padding: '15px 0px 10px 0px', backgroundColor: '#222'}}>
        {slides.map((_, index) => (
          <button style={index === currentSlide ? {backgroundColor: '#7600AD'} : {}} id='buttonSlideshow' onClick={() => setCurrentSlide(index)}></button>
        ))}
      </div>

      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div style={{width: '50%', position: 'relative'}}>
          <img id='ad' src={BG1} alt="The Bananas skimboard" />
          <div id='overlay'>
            <h2 id='overlayHeader'>SKIMBOARDS</h2>
            
            <Link to='/products/category/Skimboards'>
            <button id='overlayButton'>BROWSE</button>
            </Link>
          </div>
        </div>
        <div style={{width: '50%', position: 'relative'}}>
          <img id='ad' src={BG2} alt="Skimboard being maintained" />
          <div id='overlay'>
            <h2 id='overlayHeader'>CUSTOMISE YOUR BOARD</h2>
            { currentUser ? 
            <Link to='/design-skimboard'>
            <button id='overlayButton'>CUSTOMISE</button>
            </Link> :
            <Link to='/login'>
            <button id='overlayButton'>SIGN IN TO CUSTOMISE</button>
            </Link>  
          }
          </div>
        </div>
      </div>

      <VideoSection>
        <video src={videoBG} autoPlay loop muted />
      </VideoSection>
      
    </PageWrapper>
  );
};

export default Home;