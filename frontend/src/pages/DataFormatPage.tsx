import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeftRight,
  Copy,
  Download,
  Upload,
  Trash2,
  Check,
  AlertCircle,
  Home,
  ArrowRight,
  CheckCircle,
  XCircle,
  FileText,
  LogIn as LoginIcon,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

// Import constants and utils
import { APP_TEXT, DataFormat, EXAMPLE_DATA, FORMAT_OPTIONS } from './../../constants/converter';
import {
  convertData,
  copyToClipboard,
  detectFormatFromFilename,
  downloadFile,
  formatData,
} from '@/utils/converter';

export default function DataFormatPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [inputFormat, setInputFormat] = useState<DataFormat>('json');
  const [outputFormat, setOutputFormat] = useState<DataFormat>('yaml');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);

  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

  // Process the conversion
  const handleConvert = async () => {
    setError(null);
    setIsConverting(true);

    toast.loading('Converting data...', {
      id: 'convert-data',
      description: `${inputFormat.toUpperCase()} → ${outputFormat.toUpperCase()}`,
    });

    try {
      const { result, error } = await convertData(inputText, inputFormat, outputFormat);

      if (error) {
        setError(error);
        setOutputText('');

        toast.error('Conversion failed', {
          id: 'convert-data',
          description: error,
          icon: <XCircle className="h-4 w-4" />,
        });
      } else {
        setOutputText(result);

        toast.success('Conversion complete', {
          id: 'convert-data',
          description: `${inputFormat.toUpperCase()} → ${outputFormat.toUpperCase()}`,
          icon: <CheckCircle className="h-4 w-4" />,
        });
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred during conversion';
      setError(errorMessage);
      setOutputText('');

      toast.error('Conversion failed', {
        id: 'convert-data',
        description: errorMessage,
        icon: <XCircle className="h-4 w-4" />,
      });
    } finally {
      setIsConverting(false);
    }
  };

  // Format the current input
  const handleFormat = async () => {
    setError(null);
    setIsFormatting(true);

    toast.loading('Formatting data...', {
      id: 'format-data',
      description: inputFormat.toUpperCase(),
    });

    try {
      const { result, error } = await formatData(inputText, inputFormat);

      if (error) {
        setError(error);

        toast.error('Formatting failed', {
          id: 'format-data',
          description: error,
          icon: <XCircle className="h-4 w-4" />,
        });
      } else {
        setInputText(result);

        toast.success('Data formatted', {
          id: 'format-data',
          description: `${inputFormat.toUpperCase()} formatted successfully`,
          icon: <CheckCircle className="h-4 w-4" />,
        });
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred during formatting';
      setError(errorMessage);

      toast.error('Formatting failed', {
        id: 'format-data',
        description: errorMessage,
        icon: <XCircle className="h-4 w-4" />,
      });
    } finally {
      setIsFormatting(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    toast.loading('Reading file...', {
      id: 'file-upload',
    });

    const reader = new FileReader();

    reader.onload = e => {
      const content = e.target?.result as string;
      setInputText(content);

      // Try to detect format from file extension
      const detectedFormat = detectFormatFromFilename(file.name);
      if (detectedFormat) {
        setInputFormat(detectedFormat);

        toast.success('File loaded successfully', {
          id: 'file-upload',
          description: `${file.name} (${detectedFormat.toUpperCase()})`,
          icon: <FileText className="h-4 w-4" />,
        });
      } else {
        toast.success('File loaded successfully', {
          id: 'file-upload',
          description: file.name,
          icon: <FileText className="h-4 w-4" />,
        });
      }
    };

    reader.onerror = () => {
      toast.error('Failed to read file', {
        id: 'file-upload',
        description: 'Please try another file',
        icon: <XCircle className="h-4 w-4" />,
      });
    };

    reader.readAsText(file);

    // Reset the input value so the same file can be uploaded again
    event.target.value = '';
  };

  // Handle file download
  const handleDownload = () => {
    if (!outputText) return;

    downloadFile(outputText, outputFormat);

    toast.success('File downloaded', {
      description: `${outputFormat.toUpperCase()} file saved`,
      icon: <Download className="h-4 w-4" />,
    });
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    if (!outputText) return;

    const success = await copyToClipboard(outputText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      toast.success('Copied to clipboard', {
        icon: <Check className="h-4 w-4" />,
      });
    } else {
      toast.error('Failed to copy to clipboard', {
        icon: <XCircle className="h-4 w-4" />,
      });
    }
  };

  // Clear input and output
  const handleClear = () => {
    if (!inputText && !outputText) return;

    setInputText('');
    setOutputText('');
    setError(null);

    toast.info('Content cleared', {
      description: 'Input and output have been cleared',
      icon: <Trash2 className="h-4 w-4" />,
    });
  };

  // Swap input and output formats
  const handleSwapFormats = () => {
    setInputFormat(outputFormat);
    setOutputFormat(inputFormat);

    // If there's output text, move it to input
    if (outputText) {
      setInputText(outputText);
      setOutputText('');

      toast.info('Formats swapped', {
        description: `Input: ${outputFormat.toUpperCase()}, Output: ${inputFormat.toUpperCase()}`,
        icon: <ArrowLeftRight className="h-4 w-4" />,
      });
    } else {
      toast.info('Formats swapped', {
        description: `Input: ${outputFormat.toUpperCase()}, Output: ${inputFormat.toUpperCase()}`,
        icon: <ArrowLeftRight className="h-4 w-4" />,
      });
    }
  };

  // Load example data
  const handleLoadExample = (format: DataFormat) => {
    setInputFormat(format);
    setInputText(EXAMPLE_DATA[format]);

    toast.success('Example loaded', {
      description: `${format.toUpperCase()} example loaded`,
      icon: <FileText className="h-4 w-4" />,
    });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 py-8">
        <div className="flex items-center justify-between mb-8">
          {token ? (
            <Link
              to="/dashboard"
              className="flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              <span>Back to Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <LoginIcon className="h-5 w-5 mr-2" />
              <span>Sign In</span>
            </Link>
          )}
          <h1 className="text-3xl font-bold text-center">{APP_TEXT.title}</h1>
          <Link
            to="/data-format/docs"
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <span>Goto Documentation</span>
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="flex flex-col gap-4 rounded-lg shadow-md p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{APP_TEXT.input}</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFormat}
                  title="Format"
                  className="hover:bg-primary/10"
                  disabled={isFormatting || !inputText}
                >
                  {isFormatting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleClear}
                  title="Clear"
                  className="hover:bg-red-50"
                  disabled={isConverting || isFormatting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="relative">
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative hover:bg-blue-50"
                    title="Upload File"
                    disabled={isConverting || isFormatting}
                  >
                    <Upload className="h-4 w-4" />
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileUpload}
                      accept=".json,.yaml,.yml,.xml"
                      disabled={isConverting || isFormatting}
                    />
                  </Button>
                </div>
              </div>
            </div>

            <Select
              value={inputFormat}
              onValueChange={value => setInputFormat(value as DataFormat)}
              disabled={isConverting || isFormatting}
            >
              <SelectTrigger className=" border">
                <SelectValue placeholder="Select input format" />
              </SelectTrigger>
              <SelectContent>
                {FORMAT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Textarea
              placeholder={
                FORMAT_OPTIONS.find(f => f.value === inputFormat)?.placeholder ||
                'Enter your data here...'
              }
              className="min-h-[300px] font-mono text-sm  border"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              disabled={isConverting || isFormatting}
            />
          </div>

          {/* Controls for mobile */}
          <div className="flex items-center justify-center md:hidden">
            <div className="flex gap-2">
              <Button
                onClick={handleConvert}
                className="flex gap-2 bg-primary hover:bg-primary/90"
                disabled={isConverting || isFormatting || !inputText}
              >
                {isConverting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
                    Converting...
                  </>
                ) : (
                  <>
                    <ArrowLeftRight className="h-4 w-4" />
                    {APP_TEXT.convert}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapFormats}
                title="Swap Formats"
                disabled={isConverting || isFormatting}
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex flex-col gap-4 rounded-lg shadow-md p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{APP_TEXT.output}</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  disabled={!outputText || isConverting}
                  title="Copy to Clipboard"
                  className="hover:bg-green-50"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDownload}
                  disabled={!outputText || isConverting}
                  title="Download"
                  className="hover:bg-blue-50"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Select
              value={outputFormat}
              onValueChange={value => setOutputFormat(value as DataFormat)}
              disabled={isConverting || isFormatting}
            >
              <SelectTrigger className=" border">
                <SelectValue placeholder="Select output format" />
              </SelectTrigger>
              <SelectContent>
                {FORMAT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Converted output will appear here..."
              className="min-h-[300px] font-mono text-sm  border"
              value={outputText}
              readOnly
            />
          </div>
        </div>

        {/* Controls for desktop */}
        <div className="hidden md:flex justify-center mt-6 mb-6">
          <div className="flex gap-2">
            <Button
              onClick={handleConvert}
              className="flex gap-2 bg-primary hover:bg-primary/90"
              disabled={isConverting || isFormatting || !inputText}
            >
              {isConverting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
                  Converting...
                </>
              ) : (
                <>
                  <ArrowLeftRight className="h-4 w-4" />
                  {APP_TEXT.convert}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapFormats}
              title="Swap Formats"
              disabled={isConverting || isFormatting}
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Examples Tab */}
        <Tabs defaultValue="about" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">{APP_TEXT.about.title}</h3>
                <p className="mb-4">{APP_TEXT.about.description}</p>
                <h4 className="font-medium mb-2">Features:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {APP_TEXT.about.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">{APP_TEXT.examples.title}</h3>
                <p className="mb-2">{APP_TEXT.examples.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {FORMAT_OPTIONS.map(option => (
                    <Button
                      key={option.value}
                      variant="outline"
                      onClick={() => handleLoadExample(option.value)}
                      disabled={isConverting || isFormatting}
                    >
                      {option.label} Example
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="help">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">{APP_TEXT.help.title}</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  {APP_TEXT.help.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>

                <h4 className="font-medium mt-4 mb-2">Tips:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {APP_TEXT.help.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
