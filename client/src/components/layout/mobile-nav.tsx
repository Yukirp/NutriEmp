import { useLocation } from "wouter";
import { NavItem } from "@/types";

export default function MobileNav() {
  const [location, navigate] = useLocation();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Home', icon: 'ri-home-line', path: '/' },
    { id: 'add-meal', label: 'Adicionar', icon: 'ri-add-circle-line', path: '/add-meal' },
    { id: 'reports', label: 'Relatórios', icon: 'ri-bar-chart-line', path: '/reports' },
    { id: 'profile', label: 'Perfil', icon: 'ri-user-line', path: '/profile' },
    { id: 'contact', label: 'Contato', icon: 'ri-customer-service-line', path: '/contact' }
  ];

  return (
    <nav className="md:hidden fixed bottom-2 left-4 right-4 z-20">
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-2xl overflow-hidden shadow-xl">
        <div className="grid grid-cols-5 relative p-1">
          {/* Indicador animado de posição */}
          <div 
            className={`absolute transition-all duration-300 ease-out h-full top-0 w-1/5 bg-gradient-to-r from-primary-500/20 via-primary-500/10 to-transparent rounded-xl z-0`}
            style={{
              left: `${navItems.findIndex(item => item.path === location) * 20}%`,
            }}
          />
          
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`
                flex flex-col items-center justify-center py-3 relative z-10
                ${location === item.path 
                  ? 'text-primary-700' 
                  : 'text-slate-500 hover:text-primary-600'}
              `}
            >
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center mb-1
                ${location === item.path 
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30 scale-110 transform' 
                  : 'bg-slate-100/70'}
                transition-all duration-300
              `}>
                <i className={`${item.icon} text-xl`}></i>
              </div>
              <span className={`text-xs font-medium transition-all duration-300 ${location === item.path ? 'opacity-100' : 'opacity-70'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Botão de adicionar no centro */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
        <button 
          onClick={() => navigate('/add-meal')}
          className={`
            w-14 h-14 rounded-full flex items-center justify-center shadow-lg
            ${location === '/add-meal' 
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white scale-110 transform shadow-green-600/30'
              : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-primary-500/30'}
            transition-all duration-300 hover:scale-105
          `}
        >
          <i className="ri-add-line text-2xl"></i>
        </button>
      </div>
    </nav>
  );
}
