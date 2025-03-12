export type DataFormat = 'json' | 'yaml' | 'xml';

export interface FormatOption {
  value: DataFormat;
  label: string;
  extension: string;
  placeholder: string;
}

export const FORMAT_OPTIONS: FormatOption[] = [
  {
    value: 'json',
    label: 'JSON',
    extension: 'json',
    placeholder: 'Enter your JSON here...',
  },
  {
    value: 'yaml',
    label: 'YAML',
    extension: 'yaml',
    placeholder: 'Enter your YAML here...',
  },
  {
    value: 'xml',
    label: 'XML',
    extension: 'xml',
    placeholder: 'Enter your XML here...',
  },
];

export const EXAMPLE_DATA = {
  json: JSON.stringify(
    {
      person: {
        name: 'John Doe',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
        },
        hobbies: ['reading', 'hiking', 'coding'],
      },
    },
    null,
    2
  ),

  yaml: `person:
  name: John Doe
  age: 30
  address:
    street: 123 Main St
    city: Anytown
    state: CA
  hobbies:
    - reading
    - hiking
    - coding`,

  xml: `<?xml version="1.0" encoding="UTF-8"?>
<person>
  <name>John Doe</name>
  <age>30</age>
  <address>
    <street>123 Main St</street>
    <city>Anytown</city>
    <state>CA</state>
  </address>
  <hobbies>
    <hobby>reading</hobby>
    <hobby>hiking</hobby>
    <hobby>coding</hobby>
  </hobbies>
</person>`,
};

export const APP_TEXT = {
  title: 'Data Format Converter',
  input: 'Input',
  output: 'Output',
  convert: 'Convert',
  about: {
    title: 'About This Tool',
    description:
      "This Data Format Converter allows you to easily convert between JSON, YAML, and XML formats. It's perfect for developers working with APIs, configuration files, or data transformation tasks.",
    features: [
      'Convert between JSON, YAML, and XML',
      'Format and beautify your data',
      'Upload files for conversion',
      'Download converted data',
      'Copy results to clipboard',
    ],
  },
  examples: {
    title: 'Example Data',
    description: 'Try these examples by clicking on them:',
  },
  help: {
    title: 'How to Use',
    steps: [
      'Select your input format (JSON, YAML, or XML)',
      'Enter or paste your data in the input field',
      'Select your desired output format',
      'Click the Convert button',
      'View, copy, or download the converted result',
    ],
    tips: [
      'Use the Format button to beautify your input',
      'Upload files directly by clicking the upload button',
      'Clear the form at any time with the clear button',
      'Use the swap button to quickly convert back and forth',
    ],
  },
};
