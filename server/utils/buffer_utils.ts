//@ts-ignore
import sharp, { SharpOptions } from 'sharp';

export class BufferUtils {


  static async urlToBuffer(url: String, options: SharpOptions = {}) {
    try {
      // Fetch the image
      //@ts-ignore
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      // Get the image buffer
      const imageBuffer = await response.arrayBuffer();

      // Process with Sharp
      return await sharp(imageBuffer)
        // Optional: Resize if dimensions provided
        .resize(options.width, options.height, {
          fit: options.fit || 'cover',
          background: options.background || { r: 255, g: 255, b: 255, alpha: 1 },
        })
        // Optional: Format conversion
        .toFormat(options.format || 'png', options.formatOptions || {})
        // Get buffer
        .toBuffer();


    } catch (error) {
      //@ts-ignore
      throw new Error(`Error processing image: ${error.message}`);
    }
  }

  static async createCircularBuffer(imageBuffer: Buffer, options: SharpOptions = {}) {
    const {
      size = 342,
    } = options;

    const radius = size * 0.5; // 40% of smallest dimension

    // Create a circular mask
    const roundedCorners = Buffer.from(
      `<svg><circle cx="${size / 2}" cy="${size / 2}" r="${radius}" /></svg>`,
    );

    // Process the image
    const roundedImage = await sharp(imageBuffer)
      // Resize the image to be square (optional, but recommended for perfect circles)
      .resize(size, size, { fit: 'contain' })
      // Composite the circular mask over the image
      .composite([{
        input: roundedCorners,
        blend: 'dest-in',
      }])
      .png()
      .toBuffer();

    return roundedImage;
  }

  static textToSvg(text: String, options: SharpOptions = {}) {
    const {

      height = 600,
      width = 1000,
      x = 0,
      y = 0,
      fontSize = 50,
      fontFamily = 'FuturaPT',
      textColor = '#fff',
      base64Font,
    } = options;

    return `
    <svg width="${width}" height="${height}">
      <style>
        @font-face {
          font-family: 'FuturaPT';
          src: url('data:font/ttf;base64,${base64Font}') format('truetype');
        }
        text {
          font-weight: 700;
          line-clamp: 2;
          -webkit-line-clamp: 2;
          overflow: clip;
        }
      </style>
      <text x="${x}" y="${y}" fill="${textColor}" font-size="${fontSize}px" font-family="${fontFamily}">${text}</text>
    </svg>
  `;
  }

  static async createCircleWithText(text: String, options: SharpOptions = {}) {
    // Default options
    const {
      size = 172,
      circleColor = '#0c29ff',
      textColor = 'white',
      fontSize = 120,
      fontFamily = 'FuturaPt',
    } = options;


    // Calculate circle properties
    const centerPoint = size / 2;
    const radius = size * 0.5;

    // Create SVG with dynamic text
    const svgBuffer = Buffer.from(`
    <svg width="${size}" height="${size}">
    
    <style>
        text {
          font-family: 'FuturaPT',monospace;
          fill: #1c1c1f;
          /*font-size: 140px;*/
          font-weight: 500;
        }
      </style>
      <circle 
        cx="${centerPoint}" 
        cy="${centerPoint}" 
        r="${radius}" 
        fill="${circleColor}"
      />
      <text
        x="${centerPoint}" 
        y="${centerPoint}"
        dy=".35em"
        text-anchor="middle"
        dominant-baseline="central"
        font-family="${fontFamily}"
        font-size="${size / 2}"
        fill="${textColor}"
      >
        ${text}
      </text>
    </svg>
  `);

    try {
      const info = await sharp(svgBuffer)
        .toBuffer();
      return { success: true, info };
    } catch (error) {
      return { success: false, error };
    }
  }


}