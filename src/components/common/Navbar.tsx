import { NavLink } from 'react-router-dom';
import { Home, Image, FolderHeart, Users } from 'lucide-react';
import { useWorksStore } from '@/store/worksStore';
import { useState } from 'react';

export default function Navbar() {
  const { user } = useWorksStore();
  const [showTooltip, setShowTooltip] = useState(false);

  const navItems = [
    { to: '/', label: '编辑器', icon: Home },
    { to: '/materials', label: '素材库', icon: Image },
    { to: '/works', label: '我的作品', icon: FolderHeart },
    { to: '/community', label: '社区广场', icon: Users },
  ];

  return (
    <nav className="glass sticky top-0 z-50 h-16 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="font-display text-2xl text-gradient-neon bg-gradient-neon bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_200%]">
          🎨 MemeCraft
        </h1>
      </div>

      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-white after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-3/4 after:h-0.5 after:bg-gradient-neon after:rounded-full after:shadow-neon-pink'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="relative">
        <img
          src={user?.avatar || 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=default'}
          alt="用户头像"
          className="w-10 h-10 rounded-full cursor-pointer border-2 border-neon-purple shadow-neon-pink hover:scale-105 transition-transform duration-300 object-cover bg-bg-card"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
        />
        {showTooltip && user?.nickname && (
          <div className="absolute top-full right-0 mt-2 px-3 py-1.5 glass rounded-lg text-sm text-white whitespace-nowrap animate-fade-in-up z-50">
            <div className="font-medium text-neon-pink">{user.nickname}</div>
          </div>
        )}
      </div>
    </nav>
  );
}
