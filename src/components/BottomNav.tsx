import React from 'react';
import { 
  Home, 
  Music2, 
  Film, 
  Search, 
  User,
  Compass
} from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  downloadCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  activeTab, 
  setActiveTab, 
  downloadCount 
}) => {
  const tabs = [
    {
      id: 'home' as TabType,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'music' as TabType,
      label: 'Music',
      icon: Music2,
    },
    {
      id: 'videos' as TabType,
      label: 'Videos',
      icon: Film,
      badge: 'EP 01',
    },
    {
      id: 'search' as TabType,
      label: 'Search',
      icon: Search,
    },
    {
      id: 'profile' as TabType,
      label: 'Profile',
      icon: User,
      badge: downloadCount > 0 ? `${downloadCount}` : undefined,
    },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0e17]/95 backdrop-blur-xl border-t border-white/[0.08] px-2 py-1 pb-[env(safe-area-inset-bottom,8px)] transition-all"
      aria-label="Bottom Navigation"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative min-h-[48px] min-w-[44px] flex flex-col items-center justify-center py-1.5 transition-all select-none group focus:outline-none ${
                isActive 
                  ? 'text-rose-500 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'group-hover:scale-105 stroke-[1.8]'
                  }`} 
                />
                
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-3.5 bg-rose-600 text-white text-[9px] font-extrabold px-1 rounded-full leading-tight shadow-sm shadow-rose-900/50">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] tracking-tight mt-1 transition-colors ${
                isActive ? 'text-rose-400 font-bold' : 'text-slate-400 font-medium'
              }`}>
                {tab.label}
              </span>

              {/* Active glow indicator */}
              {isActive && (
                <span className="absolute bottom-0 w-5 h-0.5 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
