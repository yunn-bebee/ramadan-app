import { NavLink } from 'react-router-dom';
import { HiHome, HiHeart, HiBookOpen, HiPencilAlt, HiCog } from 'react-icons/hi';

export default function BottomNav() {
  const getLinkStyles = (isActive: boolean) => {
    const base = "relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ease-in-out";
    const active = "text-olive-600 dark:text-gold-400";
    const inactive = "text-night-400 dark:text-night-300 hover:text-olive-500";
    
    return `${base} ${isActive ? active : inactive}`;
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex flex-col items-center pointer-events-none">
      <nav className="
        pointer-events-auto
        w-full max-w-md
        h-20 
        bg-sand/90 dark:bg-night-950/90 
        backdrop-blur-xl 
        border border-olive-100/50 dark:border-night-800 
        flex items-center justify-around 
        px-1
        rounded-[24px] 
        shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)]
      ">
        
        <NavItem to="/" icon={<HiHome size={24} />} label="Home" getStyles={getLinkStyles} />
        <NavItem to="/ibadah" icon={<HiHeart size={24} />} label="Ibadah" getStyles={getLinkStyles} />
        
        <NavItem to="/quran" icon={<HiBookOpen size={26} />} label="Quran" getStyles={getLinkStyles} />

        <NavItem to="/journal" icon={<HiPencilAlt size={24} />} label="Journal" getStyles={getLinkStyles} />
        <NavItem to="/settings" icon={<HiCog size={24} />} label="Settings" getStyles={getLinkStyles} />

      </nav>

      {/* --- The "Made with love" Tag --- */}
      <div className="mt-1 pointer-events-auto flex items-center gap-1">
        <span className="text-[10px] font-medium tracking-wider text-night-400/60 dark:text-sand/40">
          Made with love by
        </span>
        <a 
          href="https://github.com/yunn-bebee" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] font-bold tracking-wider text-olive-600 dark:text-gold-500/60 hover:dark:text-gold-400 transition-colors"
        >
          bebee ♡
        </a>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label, getStyles }: { to: string; icon: React.ReactNode; label: string; getStyles: (isActive: boolean) => string }) {
  return (
    <NavLink to={to} className={({ isActive }) => getStyles(isActive)}>
      {({ isActive }) => (
        <>
          <div 
            className={`absolute bottom-2 w-1 h-1 rounded-full transition-all duration-300 
              ${isActive 
                ? 'bg-gold-500 shadow-[0_0_8px_rgba(197,160,89,0.8)] scale-100' 
                : 'bg-transparent scale-0'
              }`} 
          />
          
          <div className={`relative mb-1 ${isActive ? '-translate-y-1 scale-110' : 'translate-y-0 scale-100'} transition-all duration-200`}>
            {icon}
          </div>
          
          <span className={`text-[10px] font-semibold tracking-wide uppercase transition-all duration-200 
            ${isActive ? 'opacity-100' : 'opacity-60'}`}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}