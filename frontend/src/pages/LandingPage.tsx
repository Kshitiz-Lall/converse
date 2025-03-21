import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Globe, CheckCircle } from 'lucide-react';
import { devTools, aiTools } from '@/routes';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('dev');

  const heroRef = useRef(null);
  const toolsRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  const footerRef = useRef(null);

  // Individual feature card refs
  const featureRefs = useRef<HTMLDivElement[]>([]);
  featureRefs.current = [];

  const addToFeatureRefs = (el: HTMLDivElement) => {
    if (el && !featureRefs.current.includes(el)) {
      featureRefs.current.push(el);
    }
  };

  useEffect(() => {
    // Initial animation for hero section when page loads
    gsap.from(heroRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power4.out',
    });

    // Tools section animation on scroll
    gsap.from(toolsRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: toolsRef.current,
        start: 'top 80%', // Animation starts when top of element hits 80% down the viewport
        toggleActions: 'play none none none',
      },
    });

    // Features section title animation
    gsap.from(featuresRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: featuresRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    // Individual feature cards with staggered animation
    featureRefs.current.forEach((feature, index) => {
      gsap.from(feature, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: 'power3.out',
        delay: index * 0.2, // Stagger effect
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    });

    // CTA section animation
    gsap.from(ctaRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: ctaRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    // Footer animation
    gsap.from(footerRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    });

    // Clean up ScrollTrigger instances when the component unmounts
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-24 text-center" ref={heroRef}>
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
      <div className="bg-white py-16" ref={toolsRef}>
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
        <div className="container mx-auto px-6 text-center" ref={featuresRef}>
          <h2 className="text-3xl font-bold mb-6">Why Choose DevToolkit?</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <Card className="w-full max-w-xs" ref={addToFeatureRefs}>
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

            <Card className="w-full max-w-xs" ref={addToFeatureRefs}>
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

            <Card className="w-full max-w-xs" ref={addToFeatureRefs}>
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
      <div className="bg-primary text-white py-16 text-center" ref={ctaRef}>
        <h2 className="text-3xl font-bold">Get Started Today</h2>
        <p className="text-white/80 max-w-xl mx-auto mt-3 mb-6">
          Join thousands of developers improving productivity.
        </p>
        <Button asChild size="lg" variant="secondary">
          <Link to="/signup">Sign Up for Free</Link>
        </Button>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12" ref={footerRef}>
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
