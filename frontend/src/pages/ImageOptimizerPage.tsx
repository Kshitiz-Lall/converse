import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { imageApi, ImageOptimizationOptions, OptimizedImageStats } from '@/services/imageApi';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Download,
  Image,
  Info,
  Loader2,
  RefreshCcw,
  Upload,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { ChangeEvent, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ABOUT_CONTENT,
  FORMATS_CONTENT,
  IMAGE_FORMATS,
  TAB_DATA,
  TIPS_CONTENT,
} from './../../constants/image-optimization-constants';

export default function ImageOptimizerPage() {
  // File handling state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [optimizedUrl, setOptimizedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<OptimizedImageStats | null>(null);

  // Image optimization options
  const [quality, setQuality] = useState(80);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [format, setFormat] = useState('webp');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  // File input reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset previous results
    setOptimizedUrl(null);
    setStats(null);
    setError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      toast.error('Invalid file type', {
        description: 'Please select a valid image file (JPEG, PNG, WebP, AVIF)',
        icon: <XCircle className="h-4 w-4" />,
      });
      event.target.value = '';
      return;
    }

    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit');
      toast.error('File too large', {
        description: 'Maximum file size is 10MB',
        icon: <XCircle className="h-4 w-4" />,
      });
      event.target.value = '';
      return;
    }

    setSelectedFile(file);

    // Create a preview URL
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result as string);
      toast.success('Image uploaded', {
        description: `${file.name} (${formatFileSize(file.size)})`,
        icon: <CheckCircle className="h-4 w-4" />,
      });
    };
    fileReader.readAsDataURL(file);
  };

  // Clear selected file
  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setOptimizedUrl(null);
    setStats(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('Image cleared', {
      description: 'Upload a new image to optimize',
    });
  };

  // Process image optimization
  const handleOptimizeImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    toast.loading('Optimizing image...', {
      description: 'This may take a few seconds',
      id: 'optimize-image',
    });

    try {
      // Prepare options
      const options: ImageOptimizationOptions = {
        quality,
        format,
        maintain_aspect_ratio: maintainAspectRatio,
      };

      if (width) options.width = width;
      if (height) options.height = height;

      // Get optimized image blob
      const optimizedBlob = await imageApi.optimizeImage(selectedFile, options);

      // Create URL for optimized image
      const blobUrl = URL.createObjectURL(optimizedBlob);
      setOptimizedUrl(blobUrl);

      // Get stats
      const optimizationStats = await imageApi.getOptimizedImageStats(selectedFile, options);
      setStats(optimizationStats);

      // Show success toast
      toast.success('Image optimized successfully', {
        description: `Reduced by ${optimizationStats.compressionRatio}`,
        icon: <CheckCircle className="h-4 w-4" />,
        id: 'optimize-image',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to optimize image';
      setError(errorMessage);
      toast.error('Optimization failed', {
        description: errorMessage,
        icon: <XCircle className="h-4 w-4" />,
        id: 'optimize-image',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Download optimized image
  const handleDownload = () => {
    if (!optimizedUrl || !selectedFile) return;

    const extension = format === 'jpeg' ? 'jpg' : format;
    const fileName = `optimized-${selectedFile.name.split('.')[0]}.${extension}`;

    const link = document.createElement('a');
    link.href = optimizedUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show download success toast
    toast.success('Image downloaded', {
      description: fileName,
      icon: <Download className="h-4 w-4" />,
    });
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-center">Image Optimizer</h1>
          <Link
            to="/image-optimizer/docs"
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <span>Goto Documentation</span>
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Panel - Upload & Settings */}
          <div className="flex flex-col gap-5 bg-white rounded-lg shadow-md p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Upload Image</h2>
            </div>

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                selectedFile ? 'border-primary' : 'border-gray-300'
              }`}
            >
              {!selectedFile ? (
                <div className="flex flex-col items-center">
                  <Image className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="mb-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400">JPEG, PNG, WebP or AVIF (max 10MB)</p>
                  <Button
                    variant="ghost"
                    className="mt-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select File
                  </Button>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                    ref={fileInputRef}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {previewUrl && (
                    <div className="mb-4 overflow-hidden max-h-32">
                      <img src={previewUrl} alt="Preview" className="max-h-32 object-contain" />
                    </div>
                  )}
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={handleClearFile}>
                      Choose Different
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-4">Optimization Settings</h3>

              {/* Quality Slider */}
              <div className="mb-5">
                <div className="flex justify-between mb-2">
                  <Label htmlFor="quality">Quality</Label>
                  <span className="text-sm text-gray-500">{quality}%</span>
                </div>
                <Slider
                  id="quality"
                  min={1}
                  max={100}
                  step={1}
                  value={[quality]}
                  onValueChange={value => setQuality(value[0])}
                  disabled={isProcessing}
                />
                <p className="text-xs text-gray-500 mt-1">Lower quality = smaller file size</p>
              </div>

              {/* Width & Height */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    placeholder="Auto"
                    value={width || ''}
                    onChange={e => setWidth(e.target.value ? parseInt(e.target.value) : undefined)}
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Auto"
                    value={height || ''}
                    onChange={e => setHeight(e.target.value ? parseInt(e.target.value) : undefined)}
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {/* Format Selection */}
              <div className="mb-5">
                <Label htmlFor="format">Output Format</Label>
                <Select value={format} onValueChange={setFormat} disabled={isProcessing}>
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {IMAGE_FORMATS.map(format => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Aspect Ratio */}
              <div className="flex items-center space-x-2 mb-5">
                <Switch
                  id="aspect-ratio"
                  checked={maintainAspectRatio}
                  onCheckedChange={setMaintainAspectRatio}
                  disabled={isProcessing}
                />
                <Label htmlFor="aspect-ratio">Maintain aspect ratio</Label>
              </div>

              {/* Optimize Button */}
              <Button
                className="w-full"
                onClick={handleOptimizeImage}
                disabled={!selectedFile || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Optimize Image
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Panel - Result */}
          <div className="flex flex-col gap-4 bg-white rounded-lg shadow-md p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Result</h2>
              {optimizedUrl && (
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </div>

            {/* Result Content */}
            <div className="flex-1 flex flex-col items-center justify-center border rounded-lg p-4">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-gray-500">Processing your image...</p>
                </div>
              ) : optimizedUrl ? (
                <div className="flex flex-col items-center w-full">
                  <div className="max-h-[300px] overflow-hidden mb-4 w-full flex justify-center">
                    <img
                      src={optimizedUrl}
                      alt="Optimized"
                      className="max-h-[300px] object-contain"
                    />
                  </div>

                  {stats && (
                    <div className="w-full mt-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-medium mb-3 flex items-center">
                        <Info className="h-4 w-4 mr-1" />
                        Optimization Results
                      </h3>

                      {/* File size comparison */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">File Size Comparison</span>
                          <span className="font-medium">{stats.compressionRatio} reduced</span>
                        </div>

                        {/* Size comparison bars */}
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Original</span>
                              <span>{formatFileSize(stats.originalSize)}</span>
                            </div>
                            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gray-400 rounded-full"
                                style={{ width: '100%' }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Optimized</span>
                              <span>{formatFileSize(stats.newSize)}</span>
                            </div>
                            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${(stats.newSize / stats.originalSize) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Circular progress for reduction percentage */}
                      <div className="flex items-center justify-between">
                        <div className="grid grid-cols-2 gap-y-2 text-sm flex-1">
                          <div className="text-gray-500">Format:</div>
                          <div className="font-medium">{stats.format.toUpperCase()}</div>

                          <div className="text-gray-500">Dimensions:</div>
                          <div className="font-medium">
                            {stats.width} × {stats.height}px
                          </div>
                        </div>

                        <div className="relative h-20 w-20 flex items-center justify-center">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            {/* Background circle */}
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="10"
                            />

                            {/* Progress circle */}
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="#22c55e"
                              strokeWidth="10"
                              strokeLinecap="round"
                              strokeDasharray={`${2 * Math.PI * 45}`}
                              strokeDashoffset={`${2 * Math.PI * 45 * (1 - parseFloat(stats.compressionRatio) / 100)}`}
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center font-medium text-lg">
                            {stats.compressionRatio}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Image className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500">Optimized image will appear here</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Upload an image and click "Optimize" to get started
                  </p>
                </div>
              )}
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Information Tabs */}
        <Tabs defaultValue="about" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            {TAB_DATA.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {TAB_DATA.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.value === 'about' &&
                ABOUT_CONTENT.map((content, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold mb-2">{content.title}</h3>
                    <p className="mb-4">{content.text}</p>
                    <h4 className="font-medium mb-2">Features:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {content.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              {tab.value === 'tips' &&
                TIPS_CONTENT.map((content, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold mb-2">{content.title}</h3>
                    <ul className="list-disc pl-5 space-y-3">
                      {content.tips.map((tip, idx) => (
                        <li key={idx}>{tip.text}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              {tab.value === 'formats' &&
                FORMATS_CONTENT.map((formatContent, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-1">{formatContent.format}</h4>
                    <p className="text-sm mb-2">{formatContent.description}</p>
                    <ul className="text-xs text-gray-500">
                      {formatContent.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
