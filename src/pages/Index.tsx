
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Logo from "@/components/ui/logo";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center kala-pattern">
      <div className="container px-4 py-12 md:py-16 mx-auto text-center">
        <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 animate-fade-in">
          <div className="flex flex-col items-center">
            <Logo size="xlarge" withText={false} />
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-kala-dark mt-3">
              <span className="text-kala-primary">Kala</span>
              <span className="text-kala-accent">kriti</span>
            </h1>
          </div>
          
          <p className="text-lg md:text-2xl text-kala-dark/80 mt-3 md:mt-4 px-2">
            Empowering artisans to showcase their craft through AI-enhanced videos and marketing
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mt-6 md:mt-8">
            <Link to="/login">
              <Button className="btn-primary text-base md:text-lg py-5 md:py-6 px-6 md:px-8 w-full sm:w-auto flex items-center gap-2">
                Sign In
                <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="btn-secondary text-base md:text-lg py-5 md:py-6 px-6 md:px-8 w-full sm:w-auto mt-3 sm:mt-0">
                Create Account
              </Button>
            </Link>
          </div>
          
          <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="feature-card">
              <div className="w-16 h-16 rounded-full bg-kala-light flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-kala-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-kala-dark mb-2">AI Video Enhancer</h3>
              <p className="text-kala-neutral">Improve quality and add multilingual narration to your craft videos</p>
            </div>
            
            <div className="feature-card">
              <div className="w-16 h-16 rounded-full bg-kala-light flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-kala-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polygon points="21 15 16 10 5 21" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-kala-dark mb-2">Ad Generator</h3>
              <p className="text-kala-neutral">Create professional ad templates for your handicraft products</p>
            </div>
            
            <div className="feature-card">
              <div className="w-16 h-16 rounded-full bg-kala-light flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-kala-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-kala-dark mb-2">Community Connect</h3>
              <p className="text-kala-neutral">Join a community of artisans, share ideas and collaborate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
