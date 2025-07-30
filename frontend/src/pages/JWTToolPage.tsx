import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Copy,
  Key,
  FileText,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Home,
  ArrowRight,
  LogIn as LoginIcon,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { jwtApi, JWTDecodeResponse, JWTEncodeRequest, JWTVerifyRequest } from '@/services/jwtApi';

const EXAMPLE_PAYLOAD = {
  sub: "1234567890",
  name: "John Doe",
  iat: 1516239022,
  exp: 1516325422
};

const EXAMPLE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export default function JWTToolPage() {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  
  // Decode states
  const [jwtToken, setJwtToken] = useState('');
  const [decodedResult, setDecodedResult] = useState<JWTDecodeResponse | null>(null);
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  
  // Encode states
  const [payload, setPayload] = useState('');
  const [secret, setSecret] = useState('');
  const [algorithm, setAlgorithm] = useState('HS256');
  const [expiresIn, setExpiresIn] = useState('');
  const [encodedToken, setEncodedToken] = useState('');
  const [encodeError, setEncodeError] = useState<string | null>(null);
  const [isEncoding, setIsEncoding] = useState(false);
  
  // Verify states
  const [verifyToken, setVerifyToken] = useState('');
  const [verifySecret, setVerifySecret] = useState('');
  const [verifyAlgorithm, setVerifyAlgorithm] = useState('HS256');
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [supportedAlgorithms, setSupportedAlgorithms] = useState<string[]>(['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512']);

  useEffect(() => {
    loadSupportedAlgorithms();
  }, []);

  const loadSupportedAlgorithms = async () => {
    const { result } = await jwtApi.getSupportedAlgorithms();
    if (result && result.length > 0) {
      setSupportedAlgorithms(result);
    }
  };

  const handleDecode = async () => {
    if (!jwtToken.trim()) {
      setDecodeError('JWT token is required');
      return;
    }

    setIsDecoding(true);
    setDecodeError(null);
    setDecodedResult(null);

    const { result, error } = await jwtApi.decode(jwtToken);
    
    setIsDecoding(false);
    
    if (error) {
      setDecodeError(error);
      toast.error('Decode Failed', {
        description: error,
        icon: <XCircle className="h-4 w-4" />,
      });
    } else {
      setDecodedResult(result);
      toast.success('JWT Decoded', {
        description: 'JWT token decoded successfully',
        icon: <CheckCircle className="h-4 w-4" />,
      });
    }
  };

  const handleEncode = async () => {
    if (!payload.trim()) {
      setEncodeError('Payload is required');
      return;
    }
    
    if (!secret.trim()) {
      setEncodeError('Secret is required');
      return;
    }

    setIsEncoding(true);
    setEncodeError(null);
    setEncodedToken('');

    const request: JWTEncodeRequest = {
      payload,
      secret,
      algorithm,
      ...(expiresIn && { expiresIn }),
    };

    const { result, error } = await jwtApi.encode(request);
    
    setIsEncoding(false);
    
    if (error) {
      setEncodeError(error);
      toast.error('Encode Failed', {
        description: error,
        icon: <XCircle className="h-4 w-4" />,
      });
    } else {
      setEncodedToken(result || '');
      toast.success('JWT Encoded', {
        description: 'JWT token created successfully',
        icon: <CheckCircle className="h-4 w-4" />,
      });
    }
  };

  const handleVerify = async () => {
    if (!verifyToken.trim()) {
      setVerifyError('JWT token is required');
      return;
    }
    
    if (!verifySecret.trim()) {
      setVerifyError('Secret is required');
      return;
    }

    setIsVerifying(true);
    setVerifyError(null);
    setVerifyResult(null);

    const request: JWTVerifyRequest = {
      token: verifyToken,
      secret: verifySecret,
      algorithm: verifyAlgorithm,
    };

    const { result, error } = await jwtApi.verify(request);
    
    setIsVerifying(false);
    
    if (error) {
      setVerifyError(error);
      toast.error('Verification Failed', {
        description: error,
        icon: <XCircle className="h-4 w-4" />,
      });
    } else {
      setVerifyResult(result);
      toast.success('JWT Verified', {
        description: 'JWT token is valid',
        icon: <CheckCircle className="h-4 w-4" />,
      });
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard', {
        description: `${label} copied successfully`,
        icon: <Copy className="h-4 w-4" />,
      });
    } catch (error) {
      toast.error('Failed to copy', {
        description: 'Could not copy to clipboard',
        icon: <XCircle className="h-4 w-4" />,
      });
    }
  };

  const loadExample = (type: 'decode' | 'encode') => {
    if (type === 'decode') {
      setJwtToken(EXAMPLE_JWT);
    } else {
      setPayload(JSON.stringify(EXAMPLE_PAYLOAD, null, 2));
      setSecret('your-256-bit-secret');
    }
    
    toast.success('Example loaded', {
      description: `Example ${type} data loaded`,
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
          <h1 className="text-3xl font-bold text-center">JWT Encoder / Decoder</h1>
          <div className="w-40"></div> {/* Spacer for alignment */}
        </div>

        <Tabs defaultValue="decode" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="decode" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Decode
            </TabsTrigger>
            <TabsTrigger value="encode" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Encode
            </TabsTrigger>
            <TabsTrigger value="verify" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Verify
            </TabsTrigger>
          </TabsList>

          {/* Decode Tab */}
          <TabsContent value="decode" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Decode JWT Token
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="jwt-input">JWT Token</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadExample('decode')}
                    >
                      Load Example
                    </Button>
                  </div>
                  <Textarea
                    id="jwt-input"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={jwtToken}
                    onChange={(e) => setJwtToken(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleDecode}
                  disabled={isDecoding || !jwtToken.trim()}
                  className="w-full"
                >
                  {isDecoding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Decode JWT
                </Button>

                {decodeError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{decodeError}</AlertDescription>
                  </Alert>
                )}

                {decodedResult && (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Header</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="relative">
                            <pre className="text-sm bg-muted p-3 rounded overflow-auto">
                              {JSON.stringify(decodedResult.header, null, 2)}
                            </pre>
                            <Button
                              variant="outline"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => copyToClipboard(JSON.stringify(decodedResult.header, null, 2), 'Header')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Payload</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="relative">
                            <pre className="text-sm bg-muted p-3 rounded overflow-auto">
                              {JSON.stringify(decodedResult.payload, null, 2)}
                            </pre>
                            <Button
                              variant="outline"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => copyToClipboard(JSON.stringify(decodedResult.payload, null, 2), 'Payload')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Signature</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative">
                          <div className="text-sm bg-muted p-3 rounded break-all">
                            {decodedResult.signature}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(decodedResult.signature, 'Signature')}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Encode Tab */}
          <TabsContent value="encode" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Encode JWT Token
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="payload-input">Payload (JSON)</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadExample('encode')}
                      >
                        Load Example
                      </Button>
                    </div>
                    <Textarea
                      id="payload-input"
                      placeholder='{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}'
                      value={payload}
                      onChange={(e) => setPayload(e.target.value)}
                      rows={6}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="secret-input">Secret</Label>
                      <Input
                        id="secret-input"
                        type="password"
                        placeholder="your-256-bit-secret"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="algorithm-select">Algorithm</Label>
                      <Select value={algorithm} onValueChange={setAlgorithm}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {supportedAlgorithms.map((alg) => (
                            <SelectItem key={alg} value={alg}>
                              {alg}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expires-input">Expires In (optional)</Label>
                      <Input
                        id="expires-input"
                        placeholder="1h, 24h, 7d, etc."
                        value={expiresIn}
                        onChange={(e) => setExpiresIn(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleEncode}
                  disabled={isEncoding || !payload.trim() || !secret.trim()}
                  className="w-full"
                >
                  {isEncoding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Encode JWT
                </Button>

                {encodeError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{encodeError}</AlertDescription>
                  </Alert>
                )}

                {encodedToken && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Generated JWT Token</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <div className="text-sm bg-muted p-3 rounded break-all">
                          {encodedToken}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(encodedToken, 'JWT Token')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verify Tab */}
          <TabsContent value="verify" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Verify JWT Token
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verify-token-input">JWT Token</Label>
                  <Textarea
                    id="verify-token-input"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={verifyToken}
                    onChange={(e) => setVerifyToken(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="verify-secret-input">Secret</Label>
                    <Input
                      id="verify-secret-input"
                      type="password"
                      placeholder="your-256-bit-secret"
                      value={verifySecret}
                      onChange={(e) => setVerifySecret(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="verify-algorithm-select">Algorithm</Label>
                    <Select value={verifyAlgorithm} onValueChange={setVerifyAlgorithm}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {supportedAlgorithms.map((alg) => (
                          <SelectItem key={alg} value={alg}>
                            {alg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleVerify}
                  disabled={isVerifying || !verifyToken.trim() || !verifySecret.trim()}
                  className="w-full"
                >
                  {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify JWT
                </Button>

                {verifyError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{verifyError}</AlertDescription>
                  </Alert>
                )}

                {verifyResult && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant={verifyResult.valid ? 'default' : 'destructive'}>
                        {verifyResult.valid ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Valid
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Invalid
                          </>
                        )}
                      </Badge>
                    </div>

                    {verifyResult.valid && verifyResult.decoded && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Decoded Payload</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="relative">
                            <pre className="text-sm bg-muted p-3 rounded overflow-auto">
                              {JSON.stringify(verifyResult.decoded, null, 2)}
                            </pre>
                            <Button
                              variant="outline"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => copyToClipboard(JSON.stringify(verifyResult.decoded, null, 2), 'Decoded Payload')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}