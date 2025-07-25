export function hasGlyph(fontFamily: string, testChar: string): boolean {
  // Create a test element
  const testElement = document.createElement('span');
  testElement.style.fontFamily = `"${fontFamily}", serif`;
  testElement.style.fontSize = '32px';
  testElement.style.position = 'absolute';
  testElement.style.visibility = 'hidden';
  testElement.style.whiteSpace = 'nowrap';
  testElement.textContent = testChar;
  
  // Add to DOM to measure
  document.body.appendChild(testElement);
  const targetWidth = testElement.offsetWidth;
  const targetHeight = testElement.offsetHeight;
  
  // Test with fallback font
  testElement.style.fontFamily = 'serif';
  const fallbackWidth = testElement.offsetWidth;
  const fallbackHeight = testElement.offsetHeight;
  
  // Clean up
  document.body.removeChild(testElement);
  
  // If dimensions are different, the font likely has the glyph
  // Also check if the character actually rendered (not zero dimensions)
  return (targetWidth !== fallbackWidth || targetHeight !== fallbackHeight) && 
         targetWidth > 0 && targetHeight > 0;
}