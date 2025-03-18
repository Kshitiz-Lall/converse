import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Globe, CheckCircle } from 'lucide-react';
import { devTools, aiTools } from '@/routes';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState<'dev' | 'ai'>('dev');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-extrabold mb-6 leading-tight">
          DevToolkit: <span className="text-primary">Supercharge</span> Your Workflow
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          A streamlined suite of tools to optimize development efficiency.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Button asChild size="lg">
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>

      {/* Tools Showcase */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Explore Our Tools</h2>
          <div className="flex justify-center space-x-4 mb-8">
            <Button
              variant={activeTab === 'dev' ? 'default' : 'outline'}
              onClick={() => setActiveTab('dev')}
            >
              Developer Tools
            </Button>
            <Button
              variant={activeTab === 'ai' ? 'default' : 'outline'}
              onClick={() => setActiveTab('ai')}
            >
              AI-Powered Tools
            </Button>
          </div>

          <div className="flex justify-center">
            <Card className="w-full max-w-xl p-6 text-center">
              {activeTab === 'dev' ? (
                <>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Top Developer Tool</h3>
                    <CardDescription>{devTools[0]?.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <Link to={devTools[0]?.path}>Explore</Link>
                    </Button>
                  </CardContent>
                </>
              ) : (
                <>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">AI Tool Preview</h3>
                    <CardDescription>{aiTools[0]?.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <Link to={aiTools[0]?.path}>Explore</Link>
                    </Button>
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Why Choose DevToolkit?</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <Card className="w-full max-w-xs">
              <CardHeader>
                <div className="p-3 rounded-full bg-primary/10 w-max mx-auto">
                  <Zap className="text-primary h-6 w-6" />
                </div>
                <CardTitle className="text-lg mt-4">Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Automate repetitive tasks and focus on code.</CardDescription>
              </CardContent>
            </Card>

            <Card className="w-full max-w-xs">
              <CardHeader>
                <div className="p-3 rounded-full bg-primary/10 w-max mx-auto">
                  <Globe className="text-primary h-6 w-6" />
                </div>
                <CardTitle className="text-lg mt-4">Anywhere Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Use tools from any device, no installation.</CardDescription>
              </CardContent>
            </Card>

            <Card className="w-full max-w-xs">
              <CardHeader>
                <div className="p-3 rounded-full bg-primary/10 w-max mx-auto">
                  <CheckCircle className="text-primary h-6 w-6" />
                </div>
                <CardTitle className="text-lg mt-4">All-in-One</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All tools in one platform, no multiple subscriptions.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-16 text-center">
        <h2 className="text-3xl font-bold">Get Started Today</h2>
        <p className="text-white/80 max-w-xl mx-auto mt-3 mb-6">
          Join thousands of developers improving productivity.
        </p>
        <Button asChild size="lg" variant="secondary">
          <Link to="/signup">Sign Up for Free</Link>
        </Button>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-lg font-bold">DevToolkit</h3>
          <p className="text-gray-400 mt-2">Making development simpler.</p>
          <div className="mt-4 space-x-4">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
