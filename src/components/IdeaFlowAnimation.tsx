
import React, { useEffect, useState } from 'react';
import { Lightbulb, ArrowRight, DollarSign } from 'lucide-react';

interface IdeaFlowAnimationProps {
  activeFeature?: string;
}

const IdeaFlowAnimation: React.FC<IdeaFlowAnimationProps> = ({ activeFeature }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([]);
  const [pulseActive, setPulseActive] = useState(false);

  useEffect(() => {
    if (activeFeature) {
      setPulseActive(true);
      const timer = setTimeout(() => setPulseActive(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [activeFeature]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticles = prev
          .map(p => ({ ...p, x: p.x + 2, opacity: p.opacity - 0.02 }))
          .filter(p => p.opacity > 0);
        
        // Add new particle occasionally
        if (Math.random() < 0.3) {
          newParticles.push({
            id: Date.now() + Math.random(),
            x: 0,
            y: Math.random() * 100,
            opacity: 1
          });
        }
        
        return newParticles;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-8">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-gray-700">Transform Ideas into Impact</h3>
        <p className="text-gray-500 max-w-md">
          Watch your ideas flow through our AI-powered pipeline, from concept to completion
        </p>
      </div>

      {/* Main Flow Visualization */}
      <div className="relative w-full max-w-4xl h-32 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-gray-200 overflow-hidden">
        {/* Background gradient flow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/50 to-transparent animate-pulse"></div>
        
        {/* Flowing particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              transition: 'all 0.05s linear'
            }}
          />
        ))}

        {/* Main flow stages */}
        <div className="relative z-10 flex items-center justify-between h-full px-8">
          {/* Ideas (Lightbulbs) */}
          <div className={`flex flex-col items-center space-y-2 transition-all duration-500 ${pulseActive ? 'scale-110' : ''}`}>
            <Lightbulb 
              className={`h-8 w-8 transition-colors duration-500 ${
                pulseActive ? 'text-yellow-500 animate-pulse' : 'text-yellow-400'
              }`} 
            />
            <span className="text-xs font-medium text-gray-600">Ideas</span>
          </div>

          {/* Flow Arrow 1 */}
          <div className="flex-1 flex items-center justify-center">
            <ArrowRight className="h-6 w-6 text-blue-400 animate-pulse" />
            <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-2"></div>
            <ArrowRight className="h-6 w-6 text-purple-400 animate-pulse" />
          </div>

          {/* Pipeline Processing */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm animate-spin"></div>
            </div>
            <span className="text-xs font-medium text-gray-600">AI Pipeline</span>
          </div>

          {/* Flow Arrow 2 */}
          <div className="flex-1 flex items-center justify-center">
            <ArrowRight className="h-6 w-6 text-purple-400 animate-pulse" />
            <div className="flex-1 h-0.5 bg-gradient-to-r from-purple-400 to-green-400 mx-2"></div>
            <ArrowRight className="h-6 w-6 text-green-400 animate-pulse" />
          </div>

          {/* Jira Tickets */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 bg-blue-600 rounded text-white text-xs font-bold flex items-center justify-center">
              J
            </div>
            <span className="text-xs font-medium text-gray-600">Jira</span>
          </div>

          {/* Flow Arrow 3 */}
          <div className="flex-1 flex items-center justify-center">
            <ArrowRight className="h-6 w-6 text-green-400 animate-pulse" />
            <div className="flex-1 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500 mx-2"></div>
            <ArrowRight className="h-6 w-6 text-emerald-500 animate-pulse" />
          </div>

          {/* Value (Money) */}
          <div className="flex flex-col items-center space-y-2">
            <DollarSign className="h-8 w-8 text-green-600 animate-bounce" />
            <span className="text-xs font-medium text-gray-600">Value</span>
          </div>
        </div>
      </div>

      {/* Feature Status Indicators */}
      <div className="flex space-x-6 text-sm text-gray-500">
        <div className={`flex items-center space-x-2 ${activeFeature === 'release-matcher' ? 'text-blue-600' : ''}`}>
          <div className={`w-2 h-2 rounded-full ${activeFeature === 'release-matcher' ? 'bg-blue-600 animate-pulse' : 'bg-gray-300'}`}></div>
          <span>Release Matcher</span>
        </div>
        <div className={`flex items-center space-x-2 ${activeFeature === 'idea-doppelganger' ? 'text-purple-600' : ''}`}>
          <div className={`w-2 h-2 rounded-full ${activeFeature === 'idea-doppelganger' ? 'bg-purple-600 animate-pulse' : 'bg-gray-300'}`}></div>
          <span>Doppelgänger</span>
        </div>
        <div className={`flex items-center space-x-2 ${activeFeature === 'show-money' ? 'text-green-600' : ''}`}>
          <div className={`w-2 h-2 rounded-full ${activeFeature === 'show-money' ? 'bg-green-600 animate-pulse' : 'bg-gray-300'}`}></div>
          <span>Show Money</span>
        </div>
      </div>
    </div>
  );
};

export default IdeaFlowAnimation;
