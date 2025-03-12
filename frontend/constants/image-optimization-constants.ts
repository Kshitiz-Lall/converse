// Static data for image formats
export const IMAGE_FORMATS = [
  { value: 'jpeg', label: 'JPEG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WebP (recommended)' },
  { value: 'avif', label: 'AVIF' },
];

// Static data for the information tabs
export const TAB_DATA = [
  {
    value: 'about',
    label: 'About',
  },
  {
    value: 'tips',
    label: 'Tips',
  },
  {
    value: 'formats',
    label: 'Format Guide',
  },
];

// Content data for each tab
export const ABOUT_CONTENT = [
  {
    title: 'About Image Optimizer',
    text: 'This tool helps you optimize images for web use by compressing them and converting to more efficient formats. Properly optimized images load faster and use less bandwidth, improving your website performance.',
    features: [
      'Compress images with adjustable quality levels',
      'Resize images to specific dimensions',
      'Convert between formats (JPEG, PNG, WebP, AVIF)',
      'Maintain aspect ratio option',
      'Instant preview of results',
    ],
  },
];

export const TIPS_CONTENT = [
  {
    title: 'Tips for Optimization',
    tips: [
      {
        text: 'Choose the right format: WebP is the best all-around format for most images. JPEG is good for photos, PNG for images with transparency, and AVIF for maximum compression.',
      },
      {
        text: 'Adjust quality wisely: For most web images, a quality setting between 70-85% offers a good balance between size and visual quality.',
      },
      {
        text: "Resize to actual display size: There's no need to load a 2000px image if it will display at 800px on your site.",
      },
      {
        text: 'Check file sizes: For typical web images, aim for under 200KB per image, ideally under 100KB for better performance.',
      },
    ],
  },
];

export const FORMATS_CONTENT = [
  {
    format: 'WebP',
    description: 'Modern format with excellent compression and quality.',
    features: [
      '✅ Excellent compression',
      '✅ Supports transparency',
      '✅ Supported by all modern browsers',
      '❌ Limited support in older browsers',
    ],
  },
  {
    format: 'JPEG',
    description: 'Standard format for photos and complex images.',
    features: [
      '✅ Universal compatibility',
      '✅ Good for photographs',
      '❌ No transparency support',
      '❌ Lossy compression artifacts',
    ],
  },
  {
    format: 'PNG',
    description: 'Lossless format ideal for graphics with transparency.',
    features: [
      '✅ Supports transparency',
      '✅ No quality loss',
      '❌ Larger file sizes',
      '❌ Not ideal for photos',
    ],
  },
  {
    format: 'AVIF',
    description: 'Newest format with best compression ratios.',
    features: [
      '✅ Superior compression',
      '✅ Excellent quality',
      '❌ Limited browser support',
      '❌ Slower encoding',
    ],
  },
];
