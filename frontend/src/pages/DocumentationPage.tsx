import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Code2, Command, LifeBuoy, Users } from 'lucide-react';

const DocumentationPage = () => {
  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <ScrollArea className="h-[calc(100vh-100px)] md:w-1/4">
          <div className="space-y-4 pr-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Getting Started</h2>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  Introduction
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Installation
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Configuration
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Core Concepts</h2>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  Authentication
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Authorization
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  API Reference
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Guides</h2>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  Deployment
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Security
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Troubleshooting
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Main Content */}
        <div className="flex-1">
          <div className="space-y-8">
            {/* Introduction Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  Introduction
                </CardTitle>
                <CardDescription>
                  Overview of the application architecture and core features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Our application is built using modern web technologies with a focus on scalability
                  and security. The stack includes:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Frontend</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>React + TypeScript</li>
                      <li>Tailwind CSS</li>
                      <li>Shadcn UI Components</li>
                      <li>React Hook Form</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Backend</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Node.js + Express</li>
                      <li>MongoDB + Mongoose</li>
                      <li>JWT Authentication</li>
                      <li>Redis Caching</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Authentication Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Authentication
                </CardTitle>
                <CardDescription>
                  Secure user authentication flow and token management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold">JWT Flow</h3>
                <div className="space-y-2">
                  <p>1. User logs in with credentials</p>
                  <p>2. Server returns access token and refresh token</p>
                  <p>3. Access token is used for API requests</p>
                  <p>4. Refresh token maintains session validity</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Token Types</h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Access Token</Badge>
                        <span className="text-sm">15min expiration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Refresh Token</Badge>
                        <span className="text-sm">7 days expiration</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Reference Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-6 w-6" />
                  API Reference
                </CardTitle>
                <CardDescription>
                  Comprehensive guide to available endpoints and parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">User Endpoints</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-muted">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">GET</Badge>
                        <span>/api/users</span>
                        <Badge className="ml-auto">Requires Admin</Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground">Retrieve list of all users</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Error Codes</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-4 bg-muted p-2 font-medium">
                      <div>Code</div>
                      <div>Message</div>
                      <div>Description</div>
                      <div>Solution</div>
                    </div>
                    <div className="grid grid-cols-4 p-2 text-sm">
                      <div>401</div>
                      <div>Unauthorized</div>
                      <div>Invalid or missing token</div>
                      <div>Re-authenticate user</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deployment Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Command className="h-6 w-6" />
                  Deployment
                </CardTitle>
                <CardDescription>Step-by-step guide to deploying the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="docker" className="w-full">
                  <TabsList>
                    <TabsTrigger value="docker">Docker</TabsTrigger>
                    <TabsTrigger value="manual">Manual</TabsTrigger>
                    <TabsTrigger value="ci">CI/CD</TabsTrigger>
                  </TabsList>
                  <TabsContent value="docker"></TabsContent>
                  <TabsContent value="manual">Manual installation steps...</TabsContent>
                  <TabsContent value="ci">CI/CD configuration examples...</TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="mt-8 border-t pt-8">
        <div className="flex flex-col items-center text-center">
          <LifeBuoy className="h-8 w-8 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Need Help?</h2>
          <p className="text-muted-foreground mb-4">
            Contact our support team or visit our community forum
          </p>
          <div className="flex gap-4">
            <Button variant="default">Contact Support</Button>
            <Button variant="outline">Community Forum</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
