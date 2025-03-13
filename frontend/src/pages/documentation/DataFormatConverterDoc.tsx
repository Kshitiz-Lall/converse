// src/pages/DataFormatConverterDocs.tsx
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
import { ArrowLeft, ArrowLeftRight, Copy, Download, FileDown, Home, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DataFormatConverterDocs() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/data-format"
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Data Format Converter</span>
          </Link>
          <h1 className="text-3xl font-bold text-center">Data Format Converter Documentation</h1>
          <div className="w-32"></div> {/* Spacer for balance */}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="formats">Supported Formats</TabsTrigger>
            <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">What is Data Format Conversion?</h2>
                    <p className="mb-4 text-gray-700">
                      Data format conversion is the process of transforming data between different
                      structured formats like JSON, YAML, XML, and more. This is crucial for
                      interoperability between different systems, tools, and programming languages.
                    </p>
                    <p className="mb-4 text-gray-700">
                      Our Data Format Converter tool provides a simple, intuitive interface to
                      convert and format data across various popular formats, ensuring your data
                      remains consistent and readable.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-3">
                      Why Use a Data Format Converter?
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 mb-6 text-gray-700">
                      <li>
                        <strong>Cross-Platform Compatibility:</strong> Convert data between formats
                        used by different programming languages and tools.
                      </li>
                      <li>
                        <strong>Configuration Management:</strong> Easily switch between
                        configuration formats like JSON and YAML.
                      </li>
                      <li>
                        <strong>Data Standardization:</strong> Ensure consistent data representation
                        across different systems.
                      </li>
                      <li>
                        <strong>Improved Readability:</strong> Format and prettify your data for
                        better human readability.
                      </li>
                      <li>
                        <strong>Easy File Transformation:</strong> Convert files between different
                        data formats quickly.
                      </li>
                    </ul>

                    <Button asChild className="mt-4">
                      <Link to="/data-format">
                        <ArrowLeftRight className="mr-2 h-4 w-4" />
                        Try Data Format Converter
                      </Link>
                    </Button>
                  </div>

                  <div className="md:w-1/3 bg-gray-100 rounded-lg p-5">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <FileDown className="h-5 w-5 mr-2 text-primary" />
                      Quick Facts
                    </h3>
                    <ul className="space-y-4">
                      <li className="border-b border-gray-200 pb-2">
                        <p className="text-sm text-gray-500">Supported Formats</p>
                        <p className="font-medium">JSON, YAML, XML</p>
                      </li>
                      <li className="border-b border-gray-200 pb-2">
                        <p className="text-sm text-gray-500">Max File Size</p>
                        <p className="font-medium">1MB</p>
                      </li>
                      <li className="border-b border-gray-200 pb-2">
                        <p className="text-sm text-gray-500">Processing</p>
                        <p className="font-medium">Server-side</p>
                      </li>
                      <li className="border-b border-gray-200 pb-2">
                        <p className="text-sm text-gray-500">Supported Operations</p>
                        <p className="font-medium">Convert & Format</p>
                      </li>
                      <li>
                        <p className="text-sm text-gray-500">Best Practice</p>
                        <p className="font-medium">Validate after conversion</p>
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
                        <ArrowLeftRight className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Format Conversion</h3>
                        <p className="text-gray-600 text-sm">
                          Convert between multiple data formats
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Seamlessly convert data between JSON, YAML, and XML formats while maintaining
                      the original data structure and integrity.
                    </p>
                  </div>

                  <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <div className="rounded-full bg-primary/10 p-2 mr-3">
                        <Copy className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Inline Formatting</h3>
                        <p className="text-gray-600 text-sm">Pretty print and format data</p>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Automatically format your data with consistent indentation, making it more
                      readable and easier to understand.
                    </p>
                  </div>

                  <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <div className="rounded-full bg-primary/10 p-2 mr-3">
                        <Upload className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">File Upload</h3>
                        <p className="text-gray-600 text-sm">Upload files for conversion</p>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Easily upload files in various formats and convert them directly in the
                      browser without server-side processing.
                    </p>
                  </div>

                  <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-3">
                      <div className="rounded-full bg-primary/10 p-2 mr-3">
                        <Download className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Download & Copy</h3>
                        <p className="text-gray-600 text-sm">Export and share converted data</p>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Download converted files or copy the transformed data directly to your
                      clipboard for easy sharing.
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Detailed Capabilities</h3>
                  <p className="mb-4 text-gray-700">
                    The Data Format Converter provides comprehensive data transformation:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Preserve original data structure</li>
                    <li>Detect input format automatically</li>
                    <li>Handle nested and complex data structures</li>
                    <li>Validate data during conversion</li>
                    <li>Support for comments and metadata</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Formats Tab */}
          <TabsContent value="formats">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Supported Data Formats</h2>
                <p className="mb-6 text-gray-700">
                  Choosing the right data format can impact readability, file size, and
                  compatibility. Here's a comparison of the formats supported by our Converter:
                </p>

                <Table>
                  <TableCaption>Comparison of data formats supported by the converter</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Format</TableHead>
                      <TableHead>Best For</TableHead>
                      <TableHead>Readability</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>File Size</TableHead>
                      <TableHead>Use Cases</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">JSON</TableCell>
                      <TableCell>Web APIs, Configuration</TableCell>
                      <TableCell>Medium</TableCell>
                      <TableCell>No</TableCell>
                      <TableCell>Compact</TableCell>
                      <TableCell>Web, JavaScript</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">YAML</TableCell>
                      <TableCell>Configuration, Readable Data</TableCell>
                      <TableCell>High</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>Larger</TableCell>
                      <TableCell>DevOps, Kubernetes</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">XML</TableCell>
                      <TableCell>Complex Data Structures</TableCell>
                      <TableCell>Low</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>Verbose</TableCell>
                      <TableCell>Enterprise Systems</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <h3 className="text-xl font-semibold mt-8 mb-4">Format Recommendations</h3>

                <div className="grid md:grid-cols-3 gap-6 mt-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-primary">JSON - Recommended</h4>
                    <p className="text-sm text-gray-700 mt-2">
                      Ideal for web APIs, configuration files, and data exchange. Lightweight and
                      easily parsed by most programming languages.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700">YAML - For Readability</h4>
                    <p className="text-sm text-gray-700 mt-2">
                      Great for configuration files and human-readable data. Supports comments and
                      more complex data representations.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700">XML - For Complex Systems</h4>
                    <p className="text-sm text-gray-700 mt-2">
                      Best for enterprise systems, legacy applications, and scenarios requiring
                      extensive metadata and validation.
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
                <h2 className="text-2xl font-bold mb-6">
                  Best Practices for Data Format Conversion
                </h2>

                <div className="space-y-6">
                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">Validate Input Data</h3>
                    <p className="text-gray-700">
                      Always validate your input data before conversion. Ensure the source data is
                      well-formed and follows the expected structure for the input format.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">Choose the Right Format</h3>
                    <p className="text-gray-700">
                      Select the output format based on your target system, readability
                      requirements, and compatibility needs. Consider factors like parsing
                      complexity, human readability, and the destination application's preferences.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">Handle Large Datasets Carefully</h3>
                    <p className="text-gray-700">
                      For large datasets, be mindful of memory constraints. Consider breaking down
                      large files into smaller chunks or using streaming conversion methods when
                      possible. Our tool supports files up to 1MB for Server-side conversion.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">Preserve Data Types</h3>
                    <p className="text-gray-700">
                      Be aware that some conversions may impact data type precision. For example,
                      converting between formats can sometimes change how numbers or dates are
                      represented. Always verify the converted data maintains its original semantic
                      meaning.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">Remove Sensitive Information</h3>
                    <p className="text-gray-700">
                      Before converting files, review and remove any sensitive or confidential
                      information. Our tool processes data entirely Server-side, but it's always
                      best to be cautious when handling potentially sensitive data.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-1">
                    <h3 className="text-lg font-semibold mb-2">Use Consistent Formatting</h3>
                    <p className="text-gray-700">
                      Maintain consistent indentation and formatting across your converted files.
                      This improves readability and makes version control and collaboration easier.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-lg p-5 mt-8">
                  <h3 className="text-lg font-semibold mb-3">Recommended File Sizes</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      <strong>Configuration files:</strong> Under 100KB
                    </li>
                    <li>
                      <strong>API Response samples:</strong> 50-500KB
                    </li>
                    <li>
                      <strong>Development datasets:</strong> Up to 1MB
                    </li>
                    <li>
                      <strong>Large datasets:</strong> Consider external tools or server-side
                      processing
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
                  While our current Data Format Converter is a Server-side tool, we provide insights
                  into potential API integration and future developments.
                </p>

                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-2">Potential Future Endpoint</h3>
                  <code className="block bg-gray-800 text-white p-3 rounded">
                    POST /api/data/convert
                  </code>
                </div>

                <h3 className="text-lg font-semibold mb-3">Proposed Request Parameters</h3>
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
                      <TableCell className="font-medium">data</TableCell>
                      <TableCell>String</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>The data to be converted</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">input_format</TableCell>
                      <TableCell>String</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>Input data format (json, yaml, xml)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">output_format</TableCell>
                      <TableCell>String</TableCell>
                      <TableCell>Yes</TableCell>
                      <TableCell>Desired output format (json, yaml, xml)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">pretty_print</TableCell>
                      <TableCell>Boolean</TableCell>
                      <TableCell>No</TableCell>
                      <TableCell>Whether to format output (default: true)</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <h3 className="text-lg font-semibold mt-6 mb-3">Example Usage (Conceptual)</h3>
                <div className="bg-gray-800 text-white p-4 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-sm">
                    {`// Conceptual API Call
fetch('https://api.example.com/data/convert', {
  method: 'POST',
  body: JSON.stringify({
    data: '{"name": "John", "age": 30}',
    input_format: 'json',
    output_format: 'yaml',
    pretty_print: true
  })
})
.then(response => response.text())
.then(convertedData => {
  console.log(convertedData);
});`}
                  </pre>
                </div>

                <h3 className="text-lg font-semibold mb-3">Potential Response</h3>
                <div className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    {`{
  "success": true,
  "data": "name: John\nage: 30",
  "input_format": "json",
  "output_format": "yaml",
  "original_size": 28,
  "converted_size": 22
}`}
                  </pre>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6">
                  <p className="text-yellow-800">
                    <strong>Note:</strong> This is a conceptual API design. The actual
                    implementation may vary. Currently, conversion is performed Server-side in the
                    browser.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
