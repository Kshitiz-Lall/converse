// src/pages/ImageOptimizerDocs.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ExternalLink, FileDown, Image as ImageIcon, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ImageOptimizerDocs() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/image-optimizer"
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Image Optimizer</span>
          </Link>
          <h1 className="text-3xl font-bold text-center">Image Optimizer Documentation</h1>
          <div className="w-32"></div> {/* Spacer for balance */}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="formats">Image Formats</TabsTrigger>
            <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">What is Image Optimization?</h2>
                    <p className="mb-4 text-gray-700">
                      Image optimization is the process of reducing image file size while
                      maintaining acceptable visual quality. This is essential for improving website
                      performance, reducing bandwidth usage, and enhancing user experience.
                    </p>
                    <p className="mb-4 text-gray-700">
                      Our Image Optimizer tool uses advanced compression algorithms to significantly
                      reduce image file sizes while preserving image quality, making your websites
                      and applications load faster.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-3">Why Optimize Images?</h3>
                    <ul className="list-disc pl-5 space-y-2 mb-6 text-gray-700">
                      <li>
                        <strong>Faster page load times:</strong> Smaller images load more quickly,
                        improving overall site performance.
                      </li>
                      <li>
                        <strong>Reduced bandwidth usage:</strong> Optimized images use less data,
                        important for mobile users.
                      </li>
                      <li>
                        <strong>Improved SEO:</strong> Page speed is a ranking factor for search
                        engines.
                      </li>
                      <li>
                        <strong>Better user experience:</strong> Fast-loading pages lead to higher
                        engagement and lower bounce rates.
                      </li>
                      <li>
                        <strong>Lower storage requirements:</strong> Smaller files mean less storage
                        space needed.
                      </li>
                    </ul>

                    <Button asChild className="mt-4">
                      <Link to="/image-optimizer">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Try Image Optimizer
                      </Link>
                    </Button>
                  </div>

                  <div className="md:w-1/3 bg-gray-100 rounded-lg p-5">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                      Quick Facts
                    </h3>
                    <ul className="space-y-4">
                      <li className="border-b border-gray-200 pb-2">
                        <p className="text-sm text-gray-500">Average Size Reduction</p>
                        <p className="font-medium">50-80%</p>
                      </li>
                      <li className="border-b border-gray-200 pb-2">
                        <p className="text-sm text-gray-500">Supported Formats</p>
                        <p className="font-medium">JPEG, PNG, WebP, AVIF</p>
                      </li>
                      <li className="border-b border-gray-200 pb-2">
                        <p className="text-sm text-gray-500">Max File Size</p>
                        <p className="font-medium">10MB</p>
                      </li>
                      <li className="border-b border-gray-200 pb-2">
                        <p className="text-sm text-gray-500">Processing</p>
                        <p className="font-medium">Server-side</p>
                      </li>
                      <li>
                        <p className="text-sm text-gray-500">Best Format For Web</p>
                        <p className="font-medium">WebP</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Key Features</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <div className="rounded-full bg-primary/10 p-2 mr-3">
                        <ImageIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Intelligent Compression</h3>
                        <p className="text-gray-600 text-sm">
                          Applies optimal compression based on image content
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Our algorithm analyzes your image to apply the right amount of compression,
                      preserving details in complex areas while aggressively compressing simpler
                      regions.
                    </p>
                  </div>

                  <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <div className="rounded-full bg-primary/10 p-2 mr-3">
                        <FileDown className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Format Conversion</h3>
                        <p className="text-gray-600 text-sm">
                          Convert between image formats for optimal results
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Easily convert images to modern formats like WebP and AVIF that offer superior
                      compression compared to traditional JPEG and PNG formats.
                    </p>
                  </div>

                  <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <div className="rounded-full bg-primary/10 p-2 mr-3">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Batch Processing</h3>
                        <p className="text-gray-600 text-sm">
                          Process multiple images at once (coming soon)
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Save time by optimizing multiple images simultaneously with consistent
                      settings. Perfect for preparing image assets for websites and applications.
                    </p>
                  </div>

                  <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <div className="rounded-full bg-primary/10 p-2 mr-3">
                        <ExternalLink className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Dimension Control</h3>
                        <p className="text-gray-600 text-sm">
                          Resize images while maintaining aspect ratio
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Specify custom dimensions to resize your images, with the option to maintain
                      the original aspect ratio for consistent results.
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Detailed Statistics</h3>
                  <p className="mb-4 text-gray-700">
                    After optimization, you'll receive comprehensive statistics about your image:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Original vs. optimized file size</li>
                    <li>Compression ratio</li>
                    <li>Image dimensions</li>
                    <li>Format details</li>
                    <li>Visual quality assessment</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Image Formats Tab */}
          <TabsContent value="formats">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Image Format Comparison</h2>
                <p className="mb-6 text-gray-700">
                  Choosing the right image format can significantly impact file size and quality.
                  Here's a comparison of the formats supported by our Image Optimizer:
                </p>

                <Table>
                  <TableCaption>
                    Comparison of image formats supported by the optimizer
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Format</TableHead>
                      <TableHead>Best For</TableHead>
                      <TableHead>Transparency</TableHead>
                      <TableHead>Compression</TableHead>
                      <TableHead>Browser Support</TableHead>
                      <TableHead>Recommended Quality</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">JPEG</TableCell>
                      <TableCell>Photos, complex images</TableCell>
                      <TableCell>No</TableCell>
                      <TableCell>Lossy</TableCell>
                      <TableCell>Universal</TableCell>
                      <TableCell>70-85%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">PNG</TableCell>
                      <TableCell>Graphics, transparency</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>Lossless</TableCell>
                      <TableCell>Universal</TableCell>
                      <TableCell>N/A</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">WebP</TableCell>
                      <TableCell>General purpose</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>Lossy & Lossless</TableCell>
                      <TableCell>All modern browsers</TableCell>
                      <TableCell>75-90%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">AVIF</TableCell>
                      <TableCell>Maximum compression</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>Lossy & Lossless</TableCell>
                      <TableCell>Limited</TableCell>
                      <TableCell>50-75%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <h3 className="text-xl font-semibold mt-8 mb-4">Format Recommendations</h3>

                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-primary">WebP - Recommended</h4>
                    <p className="text-sm text-gray-700 mt-2">
                      WebP offers an excellent balance of quality, compression, and compatibility.
                      It's the best all-around choice for most web images, offering file sizes up to
                      30% smaller than JPEG with comparable quality.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700">JPEG - For compatibility</h4>
                    <p className="text-sm text-gray-700 mt-2">
                      Still the most universal format, JPEG is ideal when maximum compatibility is
                      needed. Best suited for photographs and complex images with no transparency.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700">PNG - For transparency</h4>
                    <p className="text-sm text-gray-700 mt-2">
                      Use PNG when you need transparency or for graphics with text, line art, or
                      areas of solid color. It's lossless but generally creates larger files than
                      other formats.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700">AVIF - For cutting-edge</h4>
                    <p className="text-sm text-gray-700 mt-2">
                      AVIF offers the best compression of all formats, but has limited browser
                      support. Consider using it if you can provide fallbacks for unsupported
                      browsers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Best Practices Tab */}
          <TabsContent value="best-practices">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Best Practices for Image Optimization</h2>

                <div className="space-y-6">
                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">Choose the Right Format</h3>
                    <p className="text-gray-700">
                      Select the appropriate format based on image content. Use WebP as your default
                      choice for most web images, JPEG for photographs without transparency, PNG for
                      graphics with transparency, and AVIF for maximum compression when browser
                      support isn't a concern.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">Resize to Display Dimensions</h3>
                    <p className="text-gray-700">
                      Don't display images at smaller dimensions than their actual size. Resize
                      images to the maximum size they'll be displayed on your website. For
                      responsive designs, consider creating multiple sizes using the srcset
                      attribute.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">Balance Quality and File Size</h3>
                    <p className="text-gray-700">
                      Find the sweet spot between quality and file size. For most images, you can
                      reduce quality to 80% with no noticeable difference. For background images or
                      less important visuals, you can go as low as 60-70%.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">Consider Responsive Images</h3>
                    <p className="text-gray-700">
                      Use the HTML <code>srcset</code> attribute to serve different image sizes
                      based on viewport dimensions. This allows mobile users to download smaller
                      images, saving bandwidth and improving load times.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">Lazy Load Images</h3>
                    <p className="text-gray-700">
                      Implement lazy loading for images that appear below the fold. This defers
                      loading images until they're about to enter the viewport, reducing initial
                      page load times. Modern browsers support this natively with the{' '}
                      <code>loading="lazy"</code> attribute.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">Remove Metadata</h3>
                    <p className="text-gray-700">
                      Images often contain unnecessary metadata (EXIF data) that increases file size
                      without providing any visual benefit. Our optimizer automatically removes this
                      data to further reduce file size.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-lg p-5 mt-8">
                  <h3 className="text-lg font-semibold mb-3">Recommended File Sizes for Web</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      <strong>Hero images:</strong> 200-400KB
                    </li>
                    <li>
                      <strong>Standard content images:</strong> 70-150KB
                    </li>
                    <li>
                      <strong>Thumbnails:</strong> 20-50KB
                    </li>
                    <li>
                      <strong>Icons and decorative elements:</strong> 5-20KB
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">API Documentation</h2>
                <p className="mb-6 text-gray-700">
                  The Image Optimizer is available as an API endpoint that you can integrate into
                  your own applications.
                </p>

                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-2">Endpoint</h3>
                  <code className="block bg-gray-800 text-white p-3 rounded">
                    POST /api/image/optimize
                  </code>
                </div>

                <h3 className="text-lg font-semibold mb-3">Request Parameters</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">image</TableCell>
                      <TableCell>File</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>The image file to optimize</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">quality</TableCell>
                      <TableCell>Number</TableCell>
                      <TableCell>No</TableCell>
                      <TableCell>Quality setting (1-100, default: 80)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">format</TableCell>
                      <TableCell>String</TableCell>
                      <TableCell>No</TableCell>
                      <TableCell>Output format (jpeg, png, webp, avif)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">width</TableCell>
                      <TableCell>Number</TableCell>
                      <TableCell>No</TableCell>
                      <TableCell>Width in pixels</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">height</TableCell>
                      <TableCell>Number</TableCell>
                      <TableCell>No</TableCell>
                      <TableCell>Height in pixels</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">maintain_aspect_ratio</TableCell>
                      <TableCell>Boolean</TableCell>
                      <TableCell>No</TableCell>
                      <TableCell>Whether to maintain aspect ratio (default: true)</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <h3 className="text-lg font-semibold mt-6 mb-3">Query Parameters</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">stats</TableCell>
                      <TableCell>Boolean</TableCell>
                      <TableCell>If true, returns JSON stats instead of the image file</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <h3 className="text-lg font-semibold mt-6 mb-3">Example Usage</h3>
                <div className="bg-gray-800 text-white p-4 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-sm">
                    {`curl -X POST http://localhost:3000/api/image/optimize \\
  -F "image=@path/to/image.jpg" \\
  -F "quality=80" \\
  -F "format=webp" \\
  -F "width=800" \\
  -F "maintain_aspect_ratio=true"`}
                  </pre>
                </div>

                <h3 className="text-lg font-semibold mb-3">Response</h3>
                <p className="mb-3 text-gray-700">
                  By default, the endpoint returns the optimized image file with appropriate
                  Content-Type headers. If <code>stats=true</code> is used, it returns a JSON object
                  with optimization statistics:
                </p>

                <div className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    {`{
  "success": true,
  "data": {
    "format": "webp",
    "width": 800,
    "height": 600,
    "originalSize": 1024000,
    "newSize": 256000,
    "compressionRatio": "75.0%"
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
