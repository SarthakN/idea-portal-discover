
import React, { useEffect, useState } from 'react';
import { Lightbulb, Bot, Users, DollarSign } from 'lucide-react';

interface IdeaFlowAnimationProps {
  activeFeature?: string;
}

const IdeaFlowAnimation: React.FC<IdeaFlowAnimationProps> = ({ activeFeature }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; opacity: number; targetX: number; targetY: number }>>([]);
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
          .map(p => ({
            ...p,
            x: p.x + (p.targetX - p.x) * 0.02,
            y: p.y + (p.targetY - p.y) * 0.02,
            opacity: p.opacity - 0.005
          }))
          .filter(p => p.opacity > 0);
        
        // Add new particles from center occasionally
        if (Math.random() < 0.2) {
          const centerX = 50;
          const centerY = 50;
          const targets = [
            { x: 25, y: 30 }, // Top left AI bot
            { x: 75, y: 30 }, // Top right AI bot
            { x: 25, y: 70 }, // Bottom left AI bot
            { x: 75, y: 70 }, // Bottom right AI bot
          ];
          const target = targets[Math.floor(Math.random() * targets.length)];
          
          newParticles.push({
            id: Date.now() + Math.random(),
            x: centerX,
            y: centerY,
            targetX: target.x,
            targetY: target.y,
            opacity: 1
          });
        }
        
        return newParticles;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-8">
      <div className="text-center space-y-4">
        <h3 className="text-4xl font-bold text-gray-700">From Spark to Shipping 🚀</h3>
        <p className="text-gray-500 max-w-md">
          See how ideas move through our AI engine — turning customer voices into real, valuable outcomes.
        </p>
      </div>

      {/* Main Flow Visualization */}
      <div className="relative w-full max-w-5xl h-80 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 rounded-xl border border-gray-200 overflow-hidden">
        {/* Background gradient flow */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/30 to-transparent animate-pulse"></div>
        
        {/* Flowing particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              transition: 'all 0.1s linear'
            }}
          />
        ))}

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          {/* Lines from center to AI bots */}
          <line x1="50%" y1="50%" x2="25%" y2="30%" stroke="#8B5CF6" strokeWidth="2" opacity="0.4" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="50%" y1="50%" x2="75%" y2="30%" stroke="#8B5CF6" strokeWidth="2" opacity="0.4" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="50%" y1="50%" x2="25%" y2="70%" stroke="#8B5CF6" strokeWidth="2" opacity="0.4" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1="50%" y1="50%" x2="75%" y2="70%" stroke="#8B5CF6" strokeWidth="2" opacity="0.4" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
          </line>
          
          {/* Lines from AI bots to outcomes */}
          <line x1="25%" y1="30%" x2="15%" y2="15%" stroke="#10B981" strokeWidth="2" opacity="0.4" strokeDasharray="3,3">
            <animate attributeName="stroke-dashoffset" values="0;6" dur="1.5s" repeatCount="indefinite" />
          </line>
          <line x1="25%" y1="30%" x2="35%" y2="15%" stroke="#10B981" strokeWidth="2" opacity="0.4" strokeDasharray="3,3">
            <animate attributeName="stroke-dashoffset" values="0;6" dur="1.5s" repeatCount="indefinite" />
          </line>
          <line x1="75%" y1="30%" x2="65%" y2="15%" stroke="#10B981" strokeWidth="2" opacity="0.4" strokeDasharray="3,3">
            <animate attributeName="stroke-dashoffset" values="0;6" dur="1.5s" repeatCount="indefinite" />
          </line>
          <line x1="75%" y1="30%" x2="85%" y2="15%" stroke="#10B981" strokeWidth="2" opacity="0.4" strokeDasharray="3,3">
            <animate attributeName="stroke-dashoffset" values="0;6" dur="1.5s" repeatCount="indefinite" />
          </line>
          <line x1="25%" y1="70%" x2="15%" y2="85%" stroke="#10B981" strokeWidth="2" opacity="0.4" strokeDasharray="3,3">
            <animate attributeName="stroke-dashoffset" values="0;6" dur="1.5s" repeatCount="indefinite" />
          </line>
          <line x1="25%" y1="70%" x2="35%" y2="85%" stroke="#10B981" strokeWidth="2" opacity="0.4" strokeDasharray="3,3">
            <animate attributeName="stroke-dashoffset" values="0;6" dur="1.5s" repeatCount="indefinite" />
          </line>
          <line x1="75%" y1="70%" x2="65%" y2="85%" stroke="#10B981" strokeWidth="2" opacity="0.4" strokeDasharray="3,3">
            <animate attributeName="stroke-dashoffset" values="0;6" dur="1.5s" repeatCount="indefinite" />
          </line>
          <line x1="75%" y1="70%" x2="85%" y2="85%" stroke="#10B981" strokeWidth="2" opacity="0.4" strokeDasharray="3,3">
            <animate attributeName="stroke-dashoffset" values="0;6" dur="1.5s" repeatCount="indefinite" />
          </line>
        </svg>

        {/* Center - Ideas */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
          <div className={`flex flex-col items-center space-y-2 transition-all duration-500 ${pulseActive ? 'scale-125' : ''}`}>
            <div className="relative">
              <Lightbulb 
                className={`h-12 w-12 transition-colors duration-500 ${
                  pulseActive ? 'text-yellow-500 animate-pulse' : 'text-yellow-400'
                }`} 
              />
              <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-20 animate-ping"></div>
            </div>
            <span className="text-sm font-bold text-gray-700 bg-white/80 px-2 py-1 rounded">Ideas</span>
          </div>
        </div>

        {/* AI Bots - Four corners around center */}
        <div className="absolute" style={{ left: '25%', top: '30%', zIndex: 2 }}>
          <div className="flex flex-col items-center space-y-1">
            <Bot className="h-8 w-8 text-purple-500 animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="text-xs font-medium text-gray-600 bg-white/80 px-1 py-0.5 rounded">AI</span>
          </div>
        </div>
        
        <div className="absolute" style={{ left: '75%', top: '30%', zIndex: 2 }}>
          <div className="flex flex-col items-center space-y-1">
            <Bot className="h-8 w-8 text-purple-500 animate-bounce" style={{ animationDelay: '0.5s' }} />
            <span className="text-xs font-medium text-gray-600 bg-white/80 px-1 py-0.5 rounded">AI</span>
          </div>
        </div>
        
        <div className="absolute" style={{ left: '25%', top: '70%', zIndex: 2 }}>
          <div className="flex flex-col items-center space-y-1">
            <Bot className="h-8 w-8 text-purple-500 animate-bounce" style={{ animationDelay: '1s' }} />
            <span className="text-xs font-medium text-gray-600 bg-white/80 px-1 py-0.5 rounded">AI</span>
          </div>
        </div>
        
        <div className="absolute" style={{ left: '75%', top: '70%', zIndex: 2 }}>
          <div className="flex flex-col items-center space-y-1">
            <Bot className="h-8 w-8 text-purple-500 animate-bounce" style={{ animationDelay: '1.5s' }} />
            <span className="text-xs font-medium text-gray-600 bg-white/80 px-1 py-0.5 rounded">AI</span>
          </div>
        </div>

        {/* Voice of Customer - Top corners */}
        <div className="absolute" style={{ left: '15%', top: '15%', zIndex: 2 }}>
          <div className="flex flex-col items-center space-y-1">
            <Users className="h-6 w-6 text-blue-500 animate-pulse" />
            <span className="text-xs font-medium text-gray-600 bg-white/80 px-1 py-0.5 rounded">Voice of Customer</span>
          </div>
        </div>
        
        <div className="absolute" style={{ left: '35%', top: '15%', zIndex: 2 }}>
          <div className="flex flex-col items-center space-y-1">
            <Users className="h-6 w-6 text-blue-500 animate-pulse" />
            <span className="text-xs font-medium text-gray-600 bg-white/80 px-1 py-0.5 rounded">Voice of Customer</span>
          </div>
        </div>
        
        <div className="absolute" style={{ left: '65%', top: '15%', zIndex: 2 }}>
          <div className="flex flex-col items-center space-y-1">
            <Users className="h-6 w-6 text-blue-500 animate-pulse" />
            <span className="text-xs font-medium text-gray-600 bg-white/80 px-1 py-0.5 rounded">Voice of Customer</span>
          </div>
        </div>
        
        <div className="absolute" style={{ left: '85%', top: '15%', zIndex: 2 }}>
          <div className="flex flex-col items-center space-y-1">
            <Users className="h-6 w-6 text-blue-500 animate-pulse" />
            <span className="text-xs font-medium text-gray-600 bg-white/80 px-1 py-0.5 rounded">Voice of Customer</span>
          </div>
        </div>

        {/* Dollar Values - Bottom corners */}
        <div className="absolute" style={{ left: '15%', top: '85%', zIndex: 2 }}>
          <div className="flex flex-col items-center space-y-1">
            <DollarSign className="h-6 w-6 text-green-600 animate-bounce" />
            <span className="text-xs font-medium text-gray-600 bg-white/80 px-1 py-0.5 rounded">Value</span>
          </div>
        </div>
        
        <div className="absolute" style={{ left: '35%', top: '85%', zIndex: 2 }}>
          <div className="flex flex-col items-center space-y-1">
            <DollarSign className="h-6 w-6 text-green-600 animate-bounce" />
            <span className="text-xs font-medium text-gray-600 bg-white/80 px-1 py-0.5 rounded">Value</span>
          </div>
        </div>
        
        <div className="absolute" style={{ left: '65%', top: '85%', zIndex: 2 }}>
          <div className="flex flex-col items-center space-y-1">
            <DollarSign className="h-6 w-6 text-green-600 animate-bounce" />
            <span className="text-xs font-medium text-gray-600 bg-white/80 px-1 py-0.5 rounded">Value</span>
          </div>
        </div>
        
        <div className="absolute" style={{ left: '85%', top: '85%', zIndex: 2 }}>
          <div className="flex flex-col items-center space-y-1">
            <DollarSign className="h-6 w-6 text-green-600 animate-bounce" />
            <span className="text-xs font-medium text-gray-600 bg-white/80 px-1 py-0.5 rounded">Value</span>
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
