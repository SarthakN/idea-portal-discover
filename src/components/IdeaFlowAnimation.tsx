import React, { useEffect, useState } from 'react';
import { Lightbulb, Bot, Users, DollarSign, Zap, Target, TrendingUp, Heart } from 'lucide-react';

interface IdeaFlowAnimationProps {
  activeFeature?: string;
}

const IdeaFlowAnimation: React.FC<IdeaFlowAnimationProps> = ({ activeFeature }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; opacity: number; targetX: number; targetY: number }>>([]);
  const [pulseActive, setPulseActive] = useState(false);
  const [floatingElements, setFloatingElements] = useState<Array<{ id: number; x: number; y: number; rotation: number }>>([]);

  useEffect(() => {
    if (activeFeature) {
      setPulseActive(true);
      const timer = setTimeout(() => setPulseActive(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [activeFeature]);

  // Initialize floating background elements with more spread
  useEffect(() => {
    const elements = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      rotation: Math.random() * 360
    }));
    setFloatingElements(elements);
  }, []);

  // Animate floating elements
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingElements(prev => 
        prev.map(el => ({
          ...el,
          rotation: el.rotation + 0.5,
          x: el.x + Math.sin(Date.now() * 0.001 + el.id) * 0.1,
          y: el.y + Math.cos(Date.now() * 0.001 + el.id) * 0.1
        }))
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

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
            { x: 30, y: 25 }, // Top left AI bot
            { x: 70, y: 25 }, // Top right AI bot
            { x: 30, y: 75 }, // Bottom left AI bot
            { x: 70, y: 75 }, // Bottom right AI bot
          ];
          const target = targets[Math.floor(Math.random() * targets.length)];
          
          newParticles.push({
            id: Date.now() + Math.random(),
            x: centerX + (Math.random() - 0.5) * 4,
            y: centerY + (Math.random() - 0.5) * 4,
            targetX: target.x + (Math.random() - 0.5) * 8,
            targetY: target.y + (Math.random() - 0.5) * 8,
            opacity: 1
          });
        }
        
        return newParticles;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Mixed outcome elements - combining customer voice and value
  const outcomeElements = [
    { icon: Users, label: 'Voice of Customer', color: 'text-blue-500', bgColor: 'bg-blue-100' },
    { icon: DollarSign, label: 'Value', color: 'text-green-600', bgColor: 'bg-green-100' },
    { icon: Heart, label: 'Customer Love', color: 'text-pink-500', bgColor: 'bg-pink-100' },
    { icon: TrendingUp, label: 'Growth', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { icon: Target, label: 'Impact', color: 'text-orange-500', bgColor: 'bg-orange-100' },
    { icon: Zap, label: 'Innovation', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  ];

  const topOutcomes = outcomeElements.slice(0, 3);
  const bottomOutcomes = outcomeElements.slice(3, 6);

  return (
    <div className="relative w-full py-10 overflow-hidden">
      {/* Floating background elements */}
      {floatingElements.map(el => (
        <div
          key={el.id}
          className="absolute opacity-5 pointer-events-none"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            transform: `rotate(${el.rotation}deg)`,
            zIndex: 0
          }}
        >
          <Lightbulb className="h-6 w-6 text-gray-300" />
        </div>
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center space-y-12">
        <div className="text-center space-y-4">
          <h3 className="text-4xl text-gray-500">From Spark to Shipping 🚀</h3>
          <p className="text-gray-500 max-w-md">
            See how ideas move through our AI engine — turning customer voices into real, valuable outcomes.
          </p>
        </div>

        {/* Main Flow Visualization - More spacious */}
        <div className="relative w-full max-w-7xl h-[500px]">
          {/* Subtle background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-green-50/30 rounded-3xl"></div>
          
          {/* Flowing particles */}
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                opacity: particle.opacity,
                transition: 'all 0.1s linear',
                boxShadow: `0 0 ${particle.opacity * 8}px rgba(147, 51, 234, 0.4)`
              }}
            />
          ))}

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {/* Lines from center to AI bots with gradient */}
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            
            {/* Center to AI bots - adjusted positions */}
            <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="url(#gradient1)" strokeWidth="2" strokeDasharray="8,4">
              <animate attributeName="stroke-dashoffset" values="0;12" dur="2s" repeatCount="indefinite" />
            </line>
            <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="url(#gradient1)" strokeWidth="2" strokeDasharray="8,4">
              <animate attributeName="stroke-dashoffset" values="0;12" dur="2.2s" repeatCount="indefinite" />
            </line>
            <line x1="50%" y1="50%" x2="20%" y2="75%" stroke="url(#gradient1)" strokeWidth="2" strokeDasharray="8,4">
              <animate attributeName="stroke-dashoffset" values="0;12" dur="1.8s" repeatCount="indefinite" />
            </line>
            <line x1="50%" y1="50%" x2="80%" y2="75%" stroke="url(#gradient1)" strokeWidth="2" strokeDasharray="8,4">
              <animate attributeName="stroke-dashoffset" values="0;12" dur="2.4s" repeatCount="indefinite" />
            </line>
            
            {/* AI bots to outcomes - more spread out */}
            {topOutcomes.map((_, index) => (
              <g key={`top-${index}`}>
                <line 
                  x1="20%" y1="25%" 
                  x2={`${20 + index * 25}%`} y2="8%" 
                  stroke="url(#gradient2)" 
                  strokeWidth="1.5" 
                  strokeDasharray="4,2"
                >
                  <animate attributeName="stroke-dashoffset" values="0;6" dur={`${1.2 + index * 0.3}s`} repeatCount="indefinite" />
                </line>
                <line 
                  x1="80%" y1="25%" 
                  x2={`${20 + index * 25}%`} y2="8%" 
                  stroke="url(#gradient2)" 
                  strokeWidth="1.5" 
                  strokeDasharray="4,2"
                >
                  <animate attributeName="stroke-dashoffset" values="0;6" dur={`${1.4 + index * 0.3}s`} repeatCount="indefinite" />
                </line>
              </g>
            ))}
            
            {bottomOutcomes.map((_, index) => (
              <g key={`bottom-${index}`}>
                <line 
                  x1="20%" y1="75%" 
                  x2={`${20 + index * 25}%`} y2="92%" 
                  stroke="url(#gradient2)" 
                  strokeWidth="1.5" 
                  strokeDasharray="4,2"
                >
                  <animate attributeName="stroke-dashoffset" values="0;6" dur={`${1.6 + index * 0.3}s`} repeatCount="indefinite" />
                </line>
                <line 
                  x1="80%" y1="75%" 
                  x2={`${20 + index * 25}%`} y2="92%" 
                  stroke="url(#gradient2)" 
                  strokeWidth="1.5" 
                  strokeDasharray="4,2"
                >
                  <animate attributeName="stroke-dashoffset" values="0;6" dur={`${1.8 + index * 0.3}s`} repeatCount="indefinite" />
                </line>
              </g>
            ))}
          </svg>

          {/* Center - Ideas */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
            <div className={`flex flex-col items-center space-y-3 transition-all duration-500 ${pulseActive ? 'scale-125' : ''}`}>
              <div className="relative">
                <Lightbulb 
                  className={`h-16 w-16 transition-colors duration-500 ${
                    pulseActive ? 'text-yellow-400 animate-pulse' : 'text-yellow-500'
                  }`} 
                />
                <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-15 animate-ping"></div>
              </div>
              <span className="text-lg font-bold text-gray-700 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">💡 Ideas</span>
            </div>
          </div>

          {/* AI Bots - More spread out positions */}
          <div className="absolute" style={{ left: '30%', top: '25%', zIndex: 2 }}>
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <Bot className="h-12 w-12 text-purple-500 animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="absolute inset-0 bg-purple-400 rounded-full opacity-15 animate-ping"></div>
              </div>
              <span className="text-sm font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-3 py-1 rounded shadow-sm">🤖 AI</span>
            </div>
          </div>
          
          <div className="absolute" style={{ left: '65%', top: '25%', zIndex: 2 }}>
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <Bot className="h-12 w-12 text-purple-500 animate-bounce" style={{ animationDelay: '0.5s' }} />
                <div className="absolute inset-0 bg-purple-400 rounded-full opacity-15 animate-ping"></div>
              </div>
              <span className="text-sm font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-3 py-1 rounded shadow-sm">🤖 AI</span>
            </div>
          </div>
          
          <div className="absolute" style={{ left: '30%', top: '75%', zIndex: 2 }}>
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <Bot className="h-12 w-12 text-purple-500 animate-bounce" style={{ animationDelay: '1s' }} />
                <div className="absolute inset-0 bg-purple-400 rounded-full opacity-15 animate-ping"></div>
              </div>
              <span className="text-sm font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-3 py-1 rounded shadow-sm">🤖 AI</span>
            </div>
          </div>
          
          <div className="absolute" style={{ left: '65%', top: '75%', zIndex: 2 }}>
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <Bot className="h-12 w-12 text-purple-500 animate-bounce" style={{ animationDelay: '1.5s' }} />
                <div className="absolute inset-0 bg-purple-400 rounded-full opacity-15 animate-ping"></div>
              </div>
              <span className="text-sm font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-3 py-1 rounded shadow-sm">🤖 AI</span>
            </div>
          </div>

          {/* Top Outcomes - More spread out */}
          {topOutcomes.map((outcome, index) => {
            const IconComponent = outcome.icon;
            return (
              <div 
                key={`top-${index}`}
                className="absolute" 
                style={{ left: `${20 + index * 25}%`, top: '8%', zIndex: 2 }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative">
                    <IconComponent className={`h-8 w-8 ${outcome.color} animate-pulse`} />
                    <div className={`absolute inset-0 ${outcome.bgColor} rounded-full opacity-25 animate-ping`}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-3 py-1 rounded shadow-sm text-center">
                    {outcome.label}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Bottom Outcomes - More spread out */}
          {bottomOutcomes.map((outcome, index) => {
            const IconComponent = outcome.icon;
            return (
              <div 
                key={`bottom-${index}`}
                className="absolute" 
                style={{ left: `${20 + index * 25}%`, top: '92%', zIndex: 2 }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative">
                    <IconComponent className={`h-8 w-8 ${outcome.color} animate-bounce`} />
                    <div className={`absolute inset-0 ${outcome.bgColor} rounded-full opacity-25 animate-ping`}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-3 py-1 rounded shadow-sm text-center">
                    {outcome.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Status Indicators */}
        <div className="flex space-x-8 text-sm text-gray-500">
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
    </div>
  );
};

export default IdeaFlowAnimation;
