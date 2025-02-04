import { PptxGenJS } from 'pptxgenjs';
// 
// Helper function to validate PowerPoint files
function isPowerPointFile(file) {
  const validTypes = [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/powerpoint',
    'application/mspowerpoint',
    'application/x-mspowerpoint'
  ];
  
  const hasValidMimeType = validTypes.includes(file.type);
  const hasValidExtension = /\.(ppt|pptx)$/i.test(file.name);
  
  return hasValidMimeType || hasValidExtension;
}

// Helper function to read file as ArrayBuffer
const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsArrayBuffer(file);
  });
};

// Helper function to create canvas and get context
const createCanvas = (width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

async function convertPptToImages(file) {
  try {
    if (!isPowerPointFile(file)) {
      console.log('File type check failed:', file.type, file.name);
      throw new Error(`Invalid file type: ${file.type}. File name: ${file.name}`);
    }

    console.log('Processing file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Read the PPTX file
    const arrayBuffer = await readFileAsArrayBuffer(file);
    
    // Create new PptxGenJS instance
    const pptx = new PptxGenJS();
    
    // Load the PPTX file
    await pptx.load(arrayBuffer);
    
    const images = [];
    const slides = pptx.getSlides();
    
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      
      // Create canvas for the slide
      const canvas = createCanvas(1920, 1080); // Standard 16:9 presentation size
      const ctx = canvas.getContext('2d');
      
      // Render slide to canvas
      await slide.render(ctx);
      
      // Convert canvas to PNG
      const dataUrl = canvas.toDataURL('image/png');
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // Create File object
      const imageFile = new File(
        [blob],
        `${file.name.replace(/\.[^/.]+$/, '')}_slide_${i + 1}.png`,
        { type: 'image/png' }
      );
      
      images.push(imageFile);
    }

    if (images.length === 0) {
      throw new Error('No slides found in the PowerPoint file');
    }

    return images;

  } catch (error) {
    console.error('Detailed conversion error:', {
      errorMessage: error.message,
      errorName: error.name,
      errorStack: error.stack,
      fileInfo: {
        name: file.name,
        type: file.type,
        size: file.size
      }
    });
    throw new Error(`Failed to convert PowerPoint to images: ${error.message}`);
  }
}

export { convertPptToImages, isPowerPointFile };