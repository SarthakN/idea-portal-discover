
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

  // Initialize floating background elements
  useEffect(() => {
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
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
        if (Math.random() < 0.3) {
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
            x: centerX + (Math.random() - 0.5) * 4,
            y: centerY + (Math.random() - 0.5) * 4,
            targetX: target.x + (Math.random() - 0.5) * 8,
            targetY: target.y + (Math.random() - 0.5) * 8,
            opacity: 1
          });
        }
        
        return newParticles;
      });
    }, 80);

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
    { icon: Users, label: 'Feedback', color: 'text-indigo-500', bgColor: 'bg-indigo-100' },
    { icon: DollarSign, label: 'Revenue', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  ];

  const topOutcomes = outcomeElements.slice(0, 4);
  const bottomOutcomes = outcomeElements.slice(4, 8);

  return (
    <div className="relative w-full py-16 overflow-hidden">
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
          <Lightbulb className="h-8 w-8 text-gray-300" />
        </div>
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        <div className="text-center space-y-4">
          <h3 className="text-4xl text-gray-500">From Spark to Shipping 🚀</h3>
          <p className="text-gray-500 max-w-md">
            See how ideas move through our AI engine — turning customer voices into real, valuable outcomes.
          </p>
        </div>

        {/* Main Flow Visualization - Blended with background */}
        <div className="relative w-full max-w-6xl h-96">
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
                boxShadow: `0 0 ${particle.opacity * 10}px rgba(147, 51, 234, 0.5)`
              }}
            />
          ))}

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {/* Lines from center to AI bots with gradient */}
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            
            {/* Center to AI bots */}
            <line x1="50%" y1="50%" x2="25%" y2="30%" stroke="url(#gradient1)" strokeWidth="3" strokeDasharray="8,4">
              <animate attributeName="stroke-dashoffset" values="0;12" dur="2s" repeatCount="indefinite" />
            </line>
            <line x1="50%" y1="50%" x2="75%" y2="30%" stroke="url(#gradient1)" strokeWidth="3" strokeDasharray="8,4">
              <animate attributeName="stroke-dashoffset" values="0;12" dur="2.2s" repeatCount="indefinite" />
            </line>
            <line x1="50%" y1="50%" x2="25%" y2="70%" stroke="url(#gradient1)" strokeWidth="3" strokeDasharray="8,4">
              <animate attributeName="stroke-dashoffset" values="0;12" dur="1.8s" repeatCount="indefinite" />
            </line>
            <line x1="50%" y1="50%" x2="75%" y2="70%" stroke="url(#gradient1)" strokeWidth="3" strokeDasharray="8,4">
              <animate attributeName="stroke-dashoffset" values="0;12" dur="2.4s" repeatCount="indefinite" />
            </line>
            
            {/* AI bots to outcomes */}
            {topOutcomes.map((_, index) => (
              <g key={`top-${index}`}>
                <line 
                  x1="25%" y1="30%" 
                  x2={`${15 + index * 20}%`} y2="15%" 
                  stroke="url(#gradient2)" 
                  strokeWidth="2" 
                  strokeDasharray="4,2"
                >
                  <animate attributeName="stroke-dashoffset" values="0;6" dur={`${1.2 + index * 0.2}s`} repeatCount="indefinite" />
                </line>
                <line 
                  x1="75%" y1="30%" 
                  x2={`${15 + index * 20}%`} y2="15%" 
                  stroke="url(#gradient2)" 
                  strokeWidth="2" 
                  strokeDasharray="4,2"
                >
                  <animate attributeName="stroke-dashoffset" values="0;6" dur={`${1.4 + index * 0.2}s`} repeatCount="indefinite" />
                </line>
              </g>
            ))}
            
            {bottomOutcomes.map((_, index) => (
              <g key={`bottom-${index}`}>
                <line 
                  x1="25%" y1="70%" 
                  x2={`${15 + index * 20}%`} y2="85%" 
                  stroke="url(#gradient2)" 
                  strokeWidth="2" 
                  strokeDasharray="4,2"
                >
                  <animate attributeName="stroke-dashoffset" values="0;6" dur={`${1.6 + index * 0.2}s`} repeatCount="indefinite" />
                </line>
                <line 
                  x1="75%" y1="70%" 
                  x2={`${15 + index * 20}%`} y2="85%" 
                  stroke="url(#gradient2)" 
                  strokeWidth="2" 
                  strokeDasharray="4,2"
                >
                  <animate attributeName="stroke-dashoffset" values="0;6" dur={`${1.8 + index * 0.2}s`} repeatCount="indefinite" />
                </line>
              </g>
            ))}
          </svg>

          {/* Center - Ideas */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
            <div className={`flex flex-col items-center space-y-2 transition-all duration-500 ${pulseActive ? 'scale-125' : ''}`}>
              <div className="relative">
                <Lightbulb 
                  className={`h-16 w-16 transition-colors duration-500 ${
                    pulseActive ? 'text-yellow-400 animate-pulse' : 'text-yellow-500'
                  }`} 
                />
                <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-20 animate-ping"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-10 animate-pulse"></div>
              </div>
              <span className="text-lg font-bold text-gray-700 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">💡 Ideas</span>
            </div>
          </div>

          {/* AI Bots - Four corners around center */}
          <div className="absolute" style={{ left: '25%', top: '30%', zIndex: 2 }}>
            <div className="flex flex-col items-center space-y-1">
              <div className="relative">
                <Bot className="h-10 w-10 text-purple-500 animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="absolute inset-0 bg-purple-400 rounded-full opacity-20 animate-ping"></div>
              </div>
              <span className="text-xs font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm">🤖 AI</span>
            </div>
          </div>
          
          <div className="absolute" style={{ left: '75%', top: '30%', zIndex: 2 }}>
            <div className="flex flex-col items-center space-y-1">
              <div className="relative">
                <Bot className="h-10 w-10 text-purple-500 animate-bounce" style={{ animationDelay: '0.5s' }} />
                <div className="absolute inset-0 bg-purple-400 rounded-full opacity-20 animate-ping"></div>
              </div>
              <span className="text-xs font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm">🤖 AI</span>
            </div>
          </div>
          
          <div className="absolute" style={{ left: '25%', top: '70%', zIndex: 2 }}>
            <div className="flex flex-col items-center space-y-1">
              <div className="relative">
                <Bot className="h-10 w-10 text-purple-500 animate-bounce" style={{ animationDelay: '1s' }} />
                <div className="absolute inset-0 bg-purple-400 rounded-full opacity-20 animate-ping"></div>
              </div>
              <span className="text-xs font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm">🤖 AI</span>
            </div>
          </div>
          
          <div className="absolute" style={{ left: '75%', top: '70%', zIndex: 2 }}>
            <div className="flex flex-col items-center space-y-1">
              <div className="relative">
                <Bot className="h-10 w-10 text-purple-500 animate-bounce" style={{ animationDelay: '1.5s' }} />
                <div className="absolute inset-0 bg-purple-400 rounded-full opacity-20 animate-ping"></div>
              </div>
              <span className="text-xs font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm">🤖 AI</span>
            </div>
          </div>

          {/* Top Outcomes - Mixed customer voice and value */}
          {topOutcomes.map((outcome, index) => {
            const IconComponent = outcome.icon;
            return (
              <div 
                key={`top-${index}`}
                className="absolute" 
                style={{ left: `${15 + index * 20}%`, top: '15%', zIndex: 2 }}
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className="relative">
                    <IconComponent className={`h-7 w-7 ${outcome.color} animate-pulse`} />
                    <div className={`absolute inset-0 ${outcome.bgColor} rounded-full opacity-30 animate-ping`}></div>
                  </div>
                  <span className="text-xs font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm text-center">
                    {outcome.label}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Bottom Outcomes - Mixed customer voice and value */}
          {bottomOutcomes.map((outcome, index) => {
            const IconComponent = outcome.icon;
            return (
              <div 
                key={`bottom-${index}`}
                className="absolute" 
                style={{ left: `${15 + index * 20}%`, top: '85%', zIndex: 2 }}
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className="relative">
                    <IconComponent className={`h-7 w-7 ${outcome.color} animate-bounce`} />
                    <div className={`absolute inset-0 ${outcome.bgColor} rounded-full opacity-30 animate-ping`}></div>
                  </div>
                  <span className="text-xs font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm text-center">
                    {outcome.label}
                  </span>
                </div>
              </div>
            );
          })}
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
    </div>
  );
};

export default IdeaFlowAnimation;
