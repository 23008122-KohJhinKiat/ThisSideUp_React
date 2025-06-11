// File: src/pages/DesignSkimboard.js
import React, { useState, useEffect } from 'react'; // Added useEffect
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDesign } from '../contexts/DesignContext';
import { useCart } from '../contexts/CartContext'; // <<<<<<<<<<< ADD THIS IMPORT
// Assuming generateId is exported from Data.js and Data.js is in src/
import { generateId } from '../Data'; // <<<<<<<<<<< ADD THIS IMPORT (adjust path if Data.js is elsewhere)
import { SketchPicker } from 'react-color';
import { GradientPicker } from 'react-linear-gradient-picker';
import 'react-linear-gradient-picker/dist/index.css';

const rgbToRgba = (rgb, a = 1) => rgb.replace('rgb(', 'rgba(').replace(')', `, ${a})`);

const WrappedSketchPicker = ({ onSelect, ...rest }) => {
  return (
    <SketchPicker
      {...rest}
      width="220px"
      color={rgbToRgba(rest.color, rest.opacity)}
      onChange={c => {
        const { r, g, b, a } = c.rgb;
        onSelect(`rgb(${r}, ${g}, ${b})`, a);
      }}
    />
  );
};

// --- STYLED COMPONENTS (Keep your existing styled components) ---
const PageWrapper = styled.div`
  min-height: 100vh;
  background: #181818;
  color: #fff;
  padding: 32px 0;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px; 
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 24px;
  }
`;

const PreviewArea = styled.div`
  background-image: url('/waves-beach.jpg'); // Ensure this image is in public folder
  background-size: cover;
  background-position: center;
  flex: 1 1 0;
  border-radius: 12px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
`;

const SkimboardShape = styled.div`
  width: 400px;
  height: 200px;
  border-radius: 200px / 100px;
  border: 2px solid #fff;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bg};
  box-shadow: 0 0 15px rgba(0,0,0,0.5);
   @media (max-width: 480px) {
    width: 300px;
    height: 150px;
    border-radius: 150px / 75px;
  }
`;

const PreviewText = styled.div`
  position: absolute;
  color: ${props => props.color || '#000'};
  font-family: ${props => props.font || 'Arial'};
  font-size: ${props => props.size || 36}px;
  font-weight: ${props => props.weight || 'bold'};
  width: 80%;
  text-align: center;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  word-wrap: break-word;
`;

const PreviewDecal = styled.img`
  position: absolute;
  max-width: 70%; 
  max-height: 70%; 
  left: 15%; 
  top: 15%; 
  pointer-events: none;
  object-fit: contain;
`;

const ControlsParent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 20px;
  @media (max-width: 768px) { 
    flex-direction: column;
  }
`;

const Controls = styled.div`
  flex: 1 1 0;
  background: #3F2A56; 
  border-radius: 12px;
  padding: 24px; 
  display: flex;
  flex-direction: column;
  gap: 20px; 
  min-width: 0; 

  input[type="text"],
  input[type="number"],
  select {
    background-color: #FFF; 
    color: #333; 
    border: 1px solid #D1C4E9; 
    border-radius: 6px;
    padding: 10px 12px; 
    font-size: 1rem; 
    width: 100%; 
    box-sizing: border-box;
    margin-top: 4px; 
  }
  
  input[type="color"] {
    height: 40px; 
    width: 60px; 
    padding: 2px;
    border-radius: 4px;
  }

  input[type="file"] {
    color: #FFDAB9; 
    font-size: 0.9rem;
  }
  input[type="file"]::file-selector-button {
    background: #FFDAB9;
    color: #232323;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
  }
`;

const Section = styled.div`
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem; 
  color: #FFDAB9; 
  margin-bottom: 12px;
  font-family: 'Inria Serif', serif; 
`;

const StyledLabel = styled.label`
  font-size: 1.1rem; 
  color: #EDE7F6; 
  display: block; 
  margin-bottom: 6px; 
  font-family: 'Instrument Sans', sans-serif; 
`;

const Inline = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap; 
`;

const ToggleGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
`;

const ToggleBtn = styled.button`
  background: ${props => props.active ? '#FFDAB9' : 'rgba(255,255,255,0.1)'};
  color: ${props => props.active ? '#3F2A56' : '#FFDAB9'};
  border: 1px solid #FFDAB9;
  border-radius: 6px; 
  padding: 10px 20px; 
  font-size: 1rem; 
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  flex-grow: 1; 
  font-family: 'Instrument Sans', sans-serif;
`;

const AddToCartBtn = styled.button`
  background: #9C27B0; 
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 1.25rem; 
  font-weight: bold;
  padding: 16px 0; 
  margin-top: 24px;
  width: 100%;
  cursor: pointer;
  transition: background 0.2s;
  font-family: 'Instrument Sans', sans-serif;
  &:hover { background: #7B1FA2; } 
`;

const ResetButton = styled.button`
  background: transparent;
  color: #FFDAB9;
  border: 2px solid #FFDAB9; 
  border-radius: 8px;
  font-size: 1.25rem; 
  padding: 14px 0; 
  margin-top: 12px;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Instrument Sans', sans-serif;
  &:hover {
    background: rgba(255, 218, 185, 0.1); 
    border-color: #FFA07A;
    color: #FFA07A;
  }
`;

const DesignSkimboard = () => {
  const navigate = useNavigate();
  const {
    currentDesign, // This is the object with all design configurations
    updateDesign,
    // updateGradientStop2, // We'll use palette from local state to drive this
    resetDesign: resetContextDesign, // Renamed to avoid conflict
    initialDesignState // Get initial state for resetting palette
  } = useDesign();
  
  const { addItemToCart } = useCart(); // <<<<<<<<<<< GET addItemToCart from CartContext

  // Local state for the gradient palette, initialized from context or default
  const [palette, setPalette] = useState(
    currentDesign.gradientDetails.stops || initialDesignState.gradientDetails.stops
  );

  // Sync local palette changes back to DesignContext
  const updatePaletteAndContext = (newPalette) => {
    setPalette(newPalette);
    updateDesign({ gradientDetails: { ...currentDesign.gradientDetails, stops: newPalette } });
  }

  // Ensure an effect updates local palette if currentDesign.gradientDetails.stops changes from elsewhere (e.g., loading a design)
  useEffect(() => {
    setPalette(currentDesign.gradientDetails.stops);
  }, [currentDesign.gradientDetails.stops]);


  const colorMode = currentDesign.baseType;
  const setColorMode = (mode) => updateDesign({ baseType: mode });

  const solidColor = currentDesign.solidColor || '#FFDAB9'; // Fallback just in case
  const setSolidColor = (color) => updateDesign({ solidColor: color.hex || color }); // react-color might pass object

  const gradientType = currentDesign.gradientDetails.type;
  const setGradientType = (type) => updateDesign({ gradientDetails: { ...currentDesign.gradientDetails, type } });
  const gradientAngle = currentDesign.gradientDetails.angle;
  const setGradientAngle = (angle) => updateDesign({ gradientDetails: { ...currentDesign.gradientDetails, angle: Number(angle) } });
  // gradientStops are now managed by local `palette` state, synced to context

  let feature = 'none';
  if (currentDesign.isTextEnabled) feature = 'text';
  else if (currentDesign.isDecalEnabled) feature = 'decal';

  const setFeature = (f) => {
    updateDesign({ 
      isTextEnabled: f === 'text', 
      isDecalEnabled: f === 'decal' 
    });
  };

  const text = currentDesign.customText.text;
  const setText = (val) => updateDesign({ customText: { ...currentDesign.customText, text: val } });
  const textColor = currentDesign.customText.color;
  const setTextColor = (color) => updateDesign({ customText: { ...currentDesign.customText, color: color.hex || color } });
  const textFont = currentDesign.customText.font;
  const setTextFont = (val) => updateDesign({ customText: { ...currentDesign.customText, font: val } });
  const textSize = currentDesign.customText.size;
  const setTextSize = (val) => updateDesign({ customText: { ...currentDesign.customText, size: Number(val) } });
  const textWeight = currentDesign.customText.weight;
  const setTextWeight = (val) => updateDesign({ customText: { ...currentDesign.customText, weight: val } });

  const decalUrl = currentDesign.decal.url;
  const decalName = currentDesign.decal.name;
  const handleDecalUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateDesign({
          decal: { ...currentDesign.decal, url: reader.result, name: file.name },
          isDecalEnabled: true, // Automatically enable decal feature on upload
          isTextEnabled: false
        });
      };
      reader.readAsDataURL(file);
    }
  };

  function getGradientString(type, angle, stopsArray) {
    const sortedStops = [...stopsArray].sort((a, b) => parseFloat(a.offset) - parseFloat(b.offset));
    const stopsString = sortedStops
      .map(stop => `${stop.color} ${Math.round(parseFloat(stop.offset) * 100)}%`)
      .join(', ');
    return type === 'linear'
      ? `linear-gradient(${angle}deg, ${stopsString})`
      : `radial-gradient(circle, ${stopsString})`;
  }
  
  const previewBg = colorMode === 'solid'
    ? solidColor
    : getGradientString(gradientType, gradientAngle, palette); // Use local palette for preview

  const handleAddToCart = () => {
    // Prepare the custom design object to be added to the cart
    const designToAdd = {
      ...currentDesign, // Spread all properties of the current design
      _id: generateId('custom_design'), // Generate a NEW unique ID for this cart item instance
      name: currentDesign.name || "Custom Skimboard", // Use default or current name
      // imageUrl is already in currentDesign from DesignContext's initial state
      // price is already in currentDesign
      isCustom: true // This flag is important for CartContext
    };

    // console.log("Adding custom design to cart:", designToAdd);
    addItemToCart(designToAdd, 1); // Add one unit of this custom design
    alert('Custom skimboard added to cart!');
    navigate('/shoppingCart'); // Navigate to the shopping cart page
  };

  const handleResetDesign = () => {
    resetContextDesign(); // Resets the design in the context
    setPalette(initialDesignState.gradientDetails.stops); // Reset local palette to initial
  };

  return (
    <div className="design-page">
      <PageWrapper>
        <Layout>
          <PreviewArea >
            <h1 style={{ textAlign: 'center', color: '#632B6C', marginBottom: 32, fontSize: 36 }}>
              Customise Your Skimboard
            </h1>
            <SkimboardShape bg={previewBg}>
              {feature === 'text' && text && (
                <PreviewText color={textColor} font={textFont} size={textSize} weight={textWeight}>
                  {text || "Enter text here"}
                </PreviewText>
              )}
              {feature === 'decal' && decalUrl && (
                <PreviewDecal src={decalUrl} alt="Decal Preview" />
              )}
            </SkimboardShape>
          </PreviewArea>
          
          <ControlsParent>
            <Controls>
            <Section>
              <SectionTitle>Board Colour</SectionTitle>
              <ToggleGroup>
                <ToggleBtn active={colorMode === 'solid'} onClick={() => setColorMode('solid')}>Solid</ToggleBtn>
                <ToggleBtn active={colorMode === 'gradient'} onClick={() => setColorMode('gradient')}>Gradient</ToggleBtn>
              </ToggleGroup>
              {colorMode === 'solid' && (
                <>
                  <StyledLabel htmlFor="solidColorPicker">Pick Colour:</StyledLabel>
                  <SketchPicker 
                      id="solidColorPicker"
                      color={solidColor}
                      onChangeComplete={(color) => setSolidColor(color.hex)} // Use onChangeComplete for less frequent updates
                      width="100%" // Make picker responsive
                  />
                </>
              )}
              {colorMode === 'gradient' && (
                <div>
                  <Inline style={{ alignItems: 'flex-end', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <StyledLabel htmlFor="gradientTypeSelect">Type:</StyledLabel>
                      <select id="gradientTypeSelect" value={gradientType} onChange={e => setGradientType(e.target.value)}>
                        <option value="linear">Linear</option>
                        <option value="radial">Radial</option>
                      </select>
                    </div>
                    {gradientType === 'linear' && (
                      <div style={{ flex: 1 }}>
                        <StyledLabel htmlFor="gradientAngleInput">Angle:</StyledLabel>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <input
                            id="gradientAngleInput"
                            type="number"
                            value={gradientAngle}
                            min={0}
                            max={360}
                            onChange={e => setGradientAngle(e.target.value)}
                            style={{ width: '80px', marginRight: '5px' }}
                          />
                          <span style={{color: '#EDE7F6'}}>deg</span>
                        </div>
                      </div>
                    )}
                  </Inline>
                  <StyledLabel>Adjust Gradient:</StyledLabel>
                  <GradientPicker
                    width={280} 
                    paletteHeight={28} 
                    palette={palette} // Use local palette state
                    onPaletteChange={updatePaletteAndContext} // Update local state and sync to context
                  >
                    <WrappedSketchPicker />
                  </GradientPicker>
                </div>
              )}
            </Section>
          </Controls>

          <Controls>
              <Section>
              <SectionTitle>Add Detail</SectionTitle>
              <ToggleGroup>
                <ToggleBtn active={feature === 'none'} onClick={() => setFeature('none')}>None</ToggleBtn>
                <ToggleBtn active={feature === 'text'} onClick={() => setFeature('text')}>Text</ToggleBtn>
                <ToggleBtn active={feature === 'decal'} onClick={() => setFeature('decal')}>Decal</ToggleBtn>
              </ToggleGroup>
              
              {feature === 'text' && (
                <>
                  <div>
                    <StyledLabel htmlFor="textInput">Text:</StyledLabel>
                    <input id="textInput" type="text" value={text} onChange={e => setText(e.target.value)} placeholder="Enter text here" />
                  </div>
                  <Inline>
                    <div style={{flex: 1}}>
                      <StyledLabel htmlFor="textColorPicker">Colour:</StyledLabel>
                      {/* For text color, a simple input type color might be less intrusive than SketchPicker */}
                      <input id="textColorPicker" type="color" value={textColor} onChange={e => setTextColor(e.target.value)} />
                    </div>
                    <div style={{flex: 2}}>
                      <StyledLabel htmlFor="textFontSelect">Font:</StyledLabel>
                      <select id="textFontSelect" value={textFont} onChange={e => setTextFont(e.target.value)}>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="'Instrument Sans', sans-serif">Instrument Sans</option>
                        <option value="'Inria Serif', serif">Inria Serif</option>
                        <option value="'Lilita One', cursive">Lilita One</option>
                        <option value="Verdana, sans-serif">Verdana</option>
                        <option value="'Times New Roman', Times, serif">Times New Roman</option>
                        <option value="'Courier New', Courier, monospace">Courier New</option>
                      </select>
                    </div>
                  </Inline>
                  <Inline>
                    <div style={{flex: 1}}>
                      <StyledLabel htmlFor="textSizeInput">Size (px):</StyledLabel>
                      <input id="textSizeInput" type="number" value={textSize} min={12} max={80} onChange={e => setTextSize(e.target.value)} />
                    </div>
                    <div style={{flex: 1}}>
                      <StyledLabel htmlFor="textWeightSelect">Weight:</StyledLabel>
                      <select id="textWeightSelect" value={textWeight} onChange={e => setTextWeight(e.target.value)}>
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="bolder">Bolder</option>
                        <option value="lighter">Lighter</option>
                        {[100,200,300,400,500,600,700,800,900].map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                    </div>
                  </Inline>
                </>
              )}
              
              {feature === 'decal' && (
                <>
                  <div>
                    <StyledLabel htmlFor="decalUpload">Upload Image:</StyledLabel>
                    <input id="decalUpload" type="file" accept="image/*" onChange={handleDecalUpload} />
                  </div>
                  {decalUrl && <div style={{ color: '#FFDAB9', fontSize: '0.9rem', marginTop: 8 }}>Uploaded: {decalName}</div>}
                </>
              )}
            </Section>
            <AddToCartBtn onClick={handleAddToCart}>Add to Cart</AddToCartBtn>
            <ResetButton onClick={handleResetDesign}>Reset Design</ResetButton>
          </Controls>
          </ControlsParent>
        </Layout>
      </PageWrapper>
    </div>
  );
};

export default DesignSkimboard;