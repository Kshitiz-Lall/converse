// src/pages/RegexPlaygroundDocs.tsx
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
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  FileDown,
  Home,
  Search,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Constants for documentation content
const QUICK_FACTS = [
  { label: 'Implementation', value: 'JavaScript RegExp' },
  { label: 'Processing', value: 'Client-side only' },
  { label: 'Supported Flags', value: 'g, i, m, s, u, y' },
  { label: 'Special Features', value: 'Real-time highlighting, Group capture' },
  { label: 'Best Practice', value: 'Keep patterns specific and simple' },
];

const WHY_USE_REGEX = [
  {
    title: 'Data Validation',
    description:
      'Verify formats like emails, phone numbers, and postal codes with precise patterns.',
  },
  {
    title: 'Text Extraction',
    description: 'Pull specific information from larger text blocks like log files or documents.',
  },
  {
    title: 'Search and Replace',
    description: 'Perform complex find-and-replace operations with pattern matching.',
  },
  {
    title: 'Text Processing',
    description: 'Transform text in consistent ways across large datasets.',
  },
  {
    title: 'Parsing and Tokenization',
    description: 'Break down strings into meaningful components for further processing.',
  },
];

const BASIC_CHARACTERS = [
  {
    char: '.',
    description: 'Matches any character except newline',
    example: 'a.c matches "abc", "adc", "a3c", etc.',
  },
  {
    char: '^',
    description: 'Matches start of string',
    example: '^abc matches "abc" only at the beginning',
  },
  {
    char: '$',
    description: 'Matches end of string',
    example: 'abc$ matches "abc" only at the end',
  },
  {
    char: '*',
    description: 'Matches 0 or more occurrences',
    example: 'ab*c matches "ac", "abc", "abbc", etc.',
  },
  {
    char: '+',
    description: 'Matches 1 or more occurrences',
    example: 'ab+c matches "abc", "abbc", but not "ac"',
  },
  { char: '?', description: 'Matches 0 or 1 occurrence', example: 'ab?c matches "ac" and "abc"' },
];

const CHARACTER_CLASSES = [
  {
    class: '[abc]',
    description: 'Matches any character in the brackets',
    example: 'a[bcd]e matches "abe", "ace", "ade"',
  },
  {
    class: '[^abc]',
    description: 'Matches any character not in the brackets',
    example: 'a[^bc]e matches "ade", "aee", but not "abe"',
  },
  {
    class: '[a-z]',
    description: 'Matches any character in the range',
    example: '[a-z] matches any lowercase letter',
  },
  {
    class: '\\d',
    description: 'Matches any digit (equivalent to [0-9])',
    example: '\\d{3} matches three digits like "123"',
  },
  {
    class: '\\w',
    description: 'Matches any word character (a-z, A-Z, 0-9, _)',
    example: '\\w+ matches any word',
  },
  {
    class: '\\s',
    description: 'Matches any whitespace character',
    example: 'a\\sb matches "a b" with a space',
  },
];

const QUANTIFIERS = [
  {
    quantifier: '{n}',
    description: 'Exactly n occurrences',
    example: '\\d{3} matches exactly 3 digits',
  },
  {
    quantifier: '{n,}',
    description: 'n or more occurrences',
    example: '\\d{2,} matches 2 or more digits',
  },
  {
    quantifier: '{n,m}',
    description: 'Between n and m occurrences',
    example: '\\d{2,4} matches 2 to 4 digits',
  },
];

const GROUPS_AND_ALTERNATION = [
  {
    syntax: '(abc)',
    description: 'Captures group for extraction or backreferences',
    example: '(ab)+ matches "ab", "abab", "ababab"',
  },
  {
    syntax: '(?:abc)',
    description: 'Non-capturing group (for alternation/repetition)',
    example: "(?:ab)+ matches same as above but doesn't capture",
  },
  {
    syntax: 'a|b',
    description: 'Matches either a or b',
    example: 'cat|dog matches "cat" or "dog"',
  },
  {
    syntax: '(?<name>abc)',
    description: 'Named capturing group',
    example: '(?<year>\\d{4}) captures year in 4 digits',
  },
];

const FLAGS = [
  {
    flag: 'g',
    name: 'Global',
    description: 'Finds all matches rather than stopping after the first',
  },
  { flag: 'i', name: 'Case Insensitive', description: 'Makes the regex case insensitive' },
  {
    flag: 'm',
    name: 'Multiline',
    description: '^ and $ match start/end of each line, not just start/end of string',
  },
  { flag: 's', name: 'Dot All', description: '. matches newlines as well' },
  { flag: 'u', name: 'Unicode', description: 'Treats pattern as Unicode code points' },
  {
    flag: 'y',
    name: 'Sticky',
    description: 'Matches only from lastIndex position (and does not advance)',
  },
];

const LOOKBEHIND_LOOKAHEAD = [
  {
    assertion: '(?=pattern)',
    description: 'Positive lookahead: Asserts that what follows matches pattern',
    example: '\\d+(?=px) matches numbers followed by "px"',
  },
  {
    assertion: '(?!pattern)',
    description: 'Negative lookahead: Asserts that what follows does not match pattern',
    example: '\\d+(?!px) matches numbers not followed by "px"',
  },
  {
    assertion: '(?<=pattern)',
    description: 'Positive lookbehind: Asserts that what precedes matches pattern',
    example: '(?<=\\$)\\d+ matches numbers preceded by "$"',
  },
  {
    assertion: '(?<!pattern)',
    description: 'Negative lookbehind: Asserts that what precedes does not match pattern',
    example: '(?<!\\$)\\d+ matches numbers not preceded by "$"',
  },
];

const COMMON_PATTERNS = [
  {
    name: 'Email Validation',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    description:
      'Validates common email formats like name@domain.com. Allows letters, numbers, and some special characters in the username portion.',
  },
  {
    name: 'URL Validation',
    pattern: 'https?:\\/\\/[\\w\\d.-]+\\.[a-zA-Z]{2,}(?:\\/[\\w\\d.\\/?=#%&-]*)?',
    description:
      'Matches HTTP and HTTPS URLs with optional paths, query parameters and fragments. Validates common web address formats.',
  },
  {
    name: 'Phone Number (US)',
    pattern: '\\(?\\d{3}\\)?[-.\s]?\\d{3}[-.\s]?\\d{4}',
    description:
      'Matches US phone numbers in various formats: (123) 456-7890, 123-456-7890, 123.456.7890, etc.',
  },
  {
    name: 'Date (MM/DD/YYYY)',
    pattern: '(0[1-9]|1[0-2])\\/(0[1-9]|[12][0-9]|3[01])\\/\\d{4}',
    description:
      'Validates dates in MM/DD/YYYY format with basic validation for valid months and days.',
  },
  {
    name: 'Password Strength',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
    description:
      'Validates passwords that contain at least one lowercase letter, one uppercase letter, one number, one special character, and are at least 8 characters long.',
  },
  {
    name: 'IP Address',
    pattern:
      '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
    description: 'Matches valid IPv4 addresses with proper validation for each octet (0-255).',
  },
  {
    name: 'Credit Card Number',
    pattern:
      '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$',
    description:
      'Validates major credit card formats (Visa, MasterCard, American Express, Discover) with appropriate lengths and prefixes.',
  },
  {
    name: 'ZIP Code (US)',
    pattern: '^\\d{5}(?:-\\d{4})?$',
    description: 'Matches US ZIP codes in both 5-digit (12345) and 9-digit (12345-6789) formats.',
  },
  {
    name: 'Time (HH:MM)',
    pattern: '^([01]?[0-9]|2[0-3]):([0-5][0-9])$',
    description:
      'Validates time in the format HH:MM (24-hour clock), ensuring hours range from 00 to 23 and minutes from 00 to 59.',
  },
  {
    name: 'Hexadecimal Color Code',
    pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b',
    description:
      'Matches hexadecimal color codes, handling both 3-character and 6-character formats (e.g., #FFF or #FFFFFF).',
  },
  {
    name: 'Alphanumeric String',
    pattern: '^[a-zA-Z0-9]+$',
    description:
      'Matches strings that only contain alphanumeric characters, excluding special symbols or spaces.',
  },
  {
    name: 'Alpha-only String',
    pattern: '^[a-zA-Z]+$',
    description:
      'Matches strings that only contain alphabetic characters (no numbers or special characters).',
  },
  {
    name: 'Match Any Number',
    pattern: '^-?\\d+(?:\\.\\d+)?$',
    description:
      'Matches integers and floating point numbers, including negative numbers. Does not allow commas or any non-numeric symbols.',
  },
  {
    name: 'UUID (Version 4)',
    pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$',
    description: 'Matches UUID v4 format (e.g., 123e4567-e89b-12d3-a456-426614174000).',
  },
  {
    name: 'Extract Query Parameters from URL',
    pattern: '[?&]([^=]+)=([^&]*)',
    description:
      'Extracts key-value pairs from the query string of a URL (e.g., ?id=123&name=test).',
  },
  {
    name: 'Extract All Numbers',
    pattern: '\\d+',
    description: 'Extracts all sequences of digits from text.',
  },
  {
    name: 'Base64 Encoding/Decoding',
    pattern: '^(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{3}=|[A-Za-z0-9+\\/]{2}==)?$',
    description:
      'Validates Base64-encoded strings, which consist of letters, digits, and special characters (+, /, and =).',
  },
  {
    name: 'Extract IPv6 Address',
    pattern: '([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4})',
    description:
      'Extracts valid IPv6 addresses, consisting of eight groups of four hexadecimal digits separated by colons.',
  },
];

const ADVANCED_PATTERNS = [
  {
    name: 'Balanced Parentheses',
    pattern: '\\((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*\\)',
    description:
      'Matches nested parentheses with balanced opening and closing. This pattern handles up to three levels of nesting.',
  },
  {
    name: 'Extract Domain from URL',
    pattern: '(?:https?:\\/\\/)?(?:www\\.)?([a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+)',
    description:
      'Extracts the domain name from URLs, handling variations with or without protocol and www prefix.',
  },
  {
    name: 'Find Duplicate Words',
    pattern: '\\b(\\w+)\\s+\\1\\b',
    description:
      'Finds repeated words in text, such as "the the" or "is is", which are often typos.',
  },
  {
    name: 'Password Complexity Validation',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
    description:
      'Uses multiple positive lookaheads to enforce password rules: lowercase, uppercase, numbers, special characters, and minimum length.',
  },
  {
    name: 'Extract Email Address',
    pattern: '([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})',
    description:
      'Extracts valid email addresses from text, handling various characters allowed in local parts and domain names.',
  },
  {
    name: 'Find Dates (MM/DD/YYYY)',
    pattern: '\\b(0[1-9]|1[0-2])\\/([0-2][0-9]|3[01])\\/([0-9]{4})\\b',
    description:
      'Matches dates in MM/DD/YYYY format, ensuring valid months and days, but not checking for actual valid dates (e.g., February 30).',
  },
  {
    name: 'Phone Number Validation (US)',
    pattern: '\\(?\\d{3}\\)?[-\\s]?\\d{3}[-\\s]?\\d{4}',
    description:
      'Matches US phone numbers, handling optional parentheses around the area code and optional separators (e.g., spaces or hyphens).',
  },
  {
    name: 'Extract Hashtags from Text',
    pattern: '#([a-zA-Z0-9_]+)',
    description:
      'Extracts hashtags from text, which can consist of letters, numbers, and underscores.',
  },
  {
    name: 'Extract Credit Card Numbers',
    pattern: '\\b(?:\\d{4}[- ]?){3}\\d{4}\\b',
    description:
      'Extracts credit card numbers, allowing spaces or hyphens as separators between every four digits.',
  },
  {
    name: 'Extract HTML Tags',
    pattern: '<([a-zA-Z][a-zA-Z0-9]*)[^>]*>',
    description:
      'Matches HTML tags, extracting both opening and self-closing tags, but does not handle the closing tags.',
  },
  {
    name: 'Match IP Address (IPv4)',
    pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b',
    description:
      'Matches IPv4 addresses, ensuring they have four sets of digits separated by periods.',
  },
  {
    name: 'Extract Hexadecimal Color Codes',
    pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b',
    description:
      'Extracts valid hexadecimal color codes, handling both 3-character and 6-character formats (e.g., #FFF or #FFFFFF).',
  },
  {
    name: 'Validate URL (basic)',
    pattern: '^(https?|ftp):\\/\\/([\\w.-]+)+(:\\d+)?(\\/([\\w/_.#-]*(\\?[^#]*)?)?)?$',
    description:
      'Validates basic URLs with support for protocols (HTTP/HTTPS/FTP), optional ports, and query strings.',
  },
  {
    name: 'Match Only Alphanumeric Characters',
    pattern: '^[a-zA-Z0-9]+$',
    description:
      'Matches strings that only contain alphanumeric characters, excluding special symbols or spaces.',
  },
  {
    name: 'Extract Time in HH:MM (24-hour format)',
    pattern: '([01]?[0-9]|2[0-3]):([0-5][0-9])',
    description:
      'Extracts time in 24-hour format, ensuring valid hours (00-23) and minutes (00-59).',
  },
];

const BEST_PRACTICES = [
  {
    title: 'Keep Them Simple',
    description:
      'The most maintainable regex is the simplest one that gets the job done. Break complex patterns into smaller components when possible. Complex regular expressions are hard to debug and maintain.',
  },
  {
    title: 'Use Capturing Groups Sparingly',
    description:
      "Capturing groups add overhead to regex processing. Use non-capturing groups (?:pattern) when you only need grouping for alternation or repetition but don't need to extract the matched content.",
  },
  {
    title: 'Beware of Greediness',
    description:
      'Quantifiers like *, +, and {n,m} are greedy by default and will match as much as possible. Add ? after these quantifiers to make them lazy (matching as little as possible): *?, +?, {n,m}?.',
  },
  {
    title: 'Anchor Your Patterns',
    description:
      'Use ^ and $ to anchor your regex to the start and end of the string when validating. Without anchors, a pattern will match anywhere within a string, which can lead to false positives.',
  },
  {
    title: 'Watch for Catastrophic Backtracking',
    description:
      'Certain regex patterns can cause exponential performance issues on certain inputs. Avoid nested quantifiers where possible and test with worst-case scenarios.',
  },
  {
    title: 'Use Character Classes Intelligently',
    description:
      "Instead of alternation for single characters, use character classes. For example, use [abc] instead of (a|b|c) as it's more efficient and readable.",
  },
  {
    title: 'Comment Complex Regexes',
    description:
      'For complex patterns, add comments or break them down with variables. In JavaScript, you can use the RegExp constructor to build regex from strings with variables for better readability.',
  },
];

const TEST_DRIVEN_STEPS = [
  { step: 'Start with test cases', description: "Define what should match and what shouldn't" },
  { step: 'Write a simple regex', description: 'Begin with the most basic pattern' },
  { step: 'Test and refine', description: 'Use our Regex Playground to validate' },
  { step: 'Add constraints', description: 'Gradually add anchors, quantifiers, and constraints' },
  { step: 'Test edge cases', description: 'Try empty strings, very long inputs, etc.' },
];

const APP_TEXT = {
  title: 'Regular Expressions Documentation',
  overview: {
    title: 'What are Regular Expressions?',
    description:
      'Regular expressions (regex) are sequences of characters that define a search pattern. They are used for pattern matching within strings and are incredibly powerful for tasks like validation, extraction, and text replacement.',
    toolDescription:
      'Our Regex Playground tool provides an interactive environment to create, test, and refine regular expressions in real-time, helping you understand how patterns match against your test strings.',
  },
};

// JavaScript code example
const JS_CODE_EXAMPLE = `// Creating regex objects
const pattern1 = /pattern/flags;           // Literal notation
const pattern2 = new RegExp('pattern', 'flags');  // Constructor

// Testing for matches
if (pattern1.test(string)) {
  console.log('Match found');
}

// Finding matches
const matches = string.match(/pattern/g);  // Returns array of matches

// Using exec with global flag for iteration
const regex = /pattern/g;
let match;
while ((match = regex.exec(string)) !== null) {
  console.log(match[0]);       // The matched text
  console.log(match.index);    // The position of the match
}

// Using named capture groups
const dateRegex = /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/;
const match = dateRegex.exec('2024-03-15');
console.log(match.groups.year);   // 2024
console.log(match.groups.month);  // 03
console.log(match.groups.day);    // 15

// Find and replace
const result = string.replace(/pattern/g, 'replacement');

// Using function for dynamic replacement
const result = string.replace(/\\b(\\w+)\\b/g, (match, p1) => {
  return p1.toUpperCase();
});`;

export default function RegexPlaygroundDocs() {
  return (
    <div className="bg-background min-h-screen text-foreground">
      <div className="container mx-auto p-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/regex-playground"
            className="flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Regex Playground</span>
          </Link>
          <h1 className="text-3xl font-bold text-center">{APP_TEXT.title}</h1>
          <div className="w-32"></div> {/* Spacer for balance */}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="syntax">Syntax Guide</TabsTrigger>
            <TabsTrigger value="patterns">Common Patterns</TabsTrigger>
            <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Usage</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">{APP_TEXT.overview.title}</h2>
                    <p className="mb-4 text-gray-700">{APP_TEXT.overview.description}</p>
                    <p className="mb-4 text-gray-700">{APP_TEXT.overview.toolDescription}</p>

                    <h3 className="text-xl font-semibold mt-6 mb-3">
                      Why Use Regular Expressions?
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 mb-6 text-gray-700">
                      {WHY_USE_REGEX.map((item, index) => (
                        <li key={index}>
                          <strong>{item.title}:</strong> {item.description}
                        </li>
                      ))}
                    </ul>

                    <Button asChild className="mt-4">
                      <Link to="/regex-playground">
                        <Wand2 className="mr-2 h-4 w-4" />
                        Try Regex Playground
                      </Link>
                    </Button>
                  </div>

                  <div className="md:w-1/3 bg-muted rounded-lg p-5">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <FileDown className="h-5 w-5 mr-2 text-primary" />
                      Quick Facts
                    </h3>
                    <ul className="space-y-4">
                      {QUICK_FACTS.map((fact, index) => (
                        <li
                          key={index}
                          className={
                            index < QUICK_FACTS.length - 1 ? 'border-b border-muted pb-2' : ''
                          }
                        >
                          <p className="text-sm text-muted-foreground">{fact.label}</p>
                          <p className="font-medium text-foreground">{fact.value}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Syntax Guide Tab */}
          <TabsContent value="syntax">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Regular Expression Syntax</h2>

                <h3 className="text-xl font-semibold mb-4">Basic Characters</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Character</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Example</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {BASIC_CHARACTERS.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono font-medium">{item.char}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="font-mono">
                          <code>{item.example}</code>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <h3 className="text-xl font-semibold mt-8 mb-4">Character Classes</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Example</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CHARACTER_CLASSES.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono font-medium">{item.class}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="font-mono">
                          <code>{item.example}</code>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <h3 className="text-xl font-semibold mt-8 mb-4">Quantifiers</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quantifier</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Example</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {QUANTIFIERS.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono font-medium">{item.quantifier}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="font-mono">
                          <code>{item.example}</code>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <h3 className="text-xl font-semibold mt-8 mb-4">Groups and Alternation</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Syntax</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Example</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {GROUPS_AND_ALTERNATION.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono font-medium">{item.syntax}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="font-mono">
                          <code>{item.example}</code>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <h3 className="text-xl font-semibold mt-8 mb-4">Flags</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Flag</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {FLAGS.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono font-medium">{item.flag}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Common Patterns Tab */}
          <TabsContent value="patterns">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Common Regex Patterns</h2>
                <p className="mb-6 text-gray-700">
                  Here are some frequently used regular expression patterns for common validation
                  and extraction tasks:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {COMMON_PATTERNS.map((pattern, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-5 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-lg mb-3">{pattern.name}</h3>
                      <div className="bg-gray-100 p-3 rounded-md font-mono text-sm mb-3 overflow-x-auto">
                        {pattern.pattern}
                      </div>
                      <p className="text-gray-700 text-sm">{pattern.description}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-muted/20 border-l-4 border-primary p-4 mt-8 rounded-md">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <p className="text-muted-foreground">
                        <strong>Note:</strong> These patterns are starting points and may need to be
                        adjusted based on your specific requirements. For production use, consider
                        the trade-offs between strictness and flexibility in your validation logic.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Best Practices Tab */}
          <TabsContent value="best-practices">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Regular Expression Best Practices</h2>

                <div className="space-y-6">
                  {BEST_PRACTICES.map((practice, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4 py-1">
                      <h3 className="text-lg font-semibold mb-2">{practice.title}</h3>
                      <p className="text-gray-700">{practice.description}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-100 rounded-lg p-5 mt-8">
                  <h3 className="text-lg font-semibold mb-3">Test-Driven Regex Development</h3>
                  <ol className="space-y-2 list-decimal pl-5 text-gray-700">
                    {TEST_DRIVEN_STEPS.map((step, index) => (
                      <li key={index}>
                        <strong>{step.step}:</strong> {step.description}
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Usage Tab */}
          <TabsContent value="advanced">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Advanced Regex Techniques</h2>

                <h3 className="text-xl font-semibold mb-4">Lookahead and Lookbehind Assertions</h3>
                <Table>
                  <TableCaption>Zero-width assertions that don't consume characters</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assertion</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Example</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {LOOKBEHIND_LOOKAHEAD.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono font-medium">{item.assertion}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="font-mono">
                          <code>{item.example}</code>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <h3 className="text-xl font-semibold mt-8 mb-4">Backreferences</h3>
                <div className="bg-gray-100 p-4 rounded-md mb-4">
                  <p className="mb-2 text-gray-700">
                    Backreferences allow you to match the same text previously matched by a
                    capturing group.
                  </p>
                  <div className="font-mono bg-gray-200 p-3 rounded-lg text-sm">
                    <p>
                      <code>&lt;(\\w+)&gt;.*?&lt;/\\1&gt;</code>
                    </p>
                    <p className="text-gray-600 mt-1">
                      Matches HTML tags like &lt;div&gt;content&lt;/div&gt;, ensuring opening and
                      closing tags match
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mt-8 mb-4">Named Capture Groups</h3>
                <div className="bg-gray-100 p-4 rounded-md mb-6">
                  <p className="mb-2 text-gray-700">
                    Use named groups to make your regexes more readable and to access matches by
                    name.
                  </p>
                  <div className="font-mono bg-gray-200 p-3 rounded-lg text-sm">
                    <p>
                      <code>
                        (?&lt;year&gt;\\d{4})-(?&lt;month&gt;\\d{2})-(?&lt;day&gt;\\d{2})
                      </code>
                    </p>
                    <p className="text-gray-600 mt-1">
                      Captures year, month, and day from dates like "2024-03-15"
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-4">Common Advanced Patterns</h3>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {ADVANCED_PATTERNS.map((pattern, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-5 hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-semibold text-lg mb-3">{pattern.name}</h4>
                      <div className="bg-muted p-3 rounded-md font-mono text-sm mb-3 overflow-x-auto">
                        {pattern.pattern}
                      </div>
                      <p className="text-gray-700 text-sm">{pattern.description}</p>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mb-4">Regex in JavaScript</h3>
                <div className="bg-gray-800 text-white p-5 rounded-lg overflow-x-auto">
                  <pre className="text-sm">{JS_CODE_EXAMPLE}</pre>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-8">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-yellow-800">
                        <strong>Performance Note:</strong> Complex regular expressions, especially
                        those with lookaheads, lookbehinds, and backreferences, can be
                        computationally expensive. For high-volume processing, consider breaking
                        down patterns into simpler ones or using specialized parsing libraries.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
