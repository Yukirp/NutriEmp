import { useLocation } from "wouter";
import { useUser } from "@/hooks/use-user";
import { NavItem } from "@/types";

export default function Sidebar() {
  const [location, navigate] = useLocation();
  const { user } = useUser();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line', path: '/' },
    { id: 'add-meal', label: 'Adicionar Refeição', icon: 'ri-restaurant-line', path: '/add-meal' },
    { id: 'reports', label: 'Relatórios', icon: 'ri-bar-chart-line', path: '/reports' },
    { id: 'profile', label: 'Perfil', icon: 'ri-user-line', path: '/profile' },
    { id: 'contact', label: 'Fale Conosco', icon: 'ri-customer-service-line', path: '/contact' }
  ];

  return (
    <aside className="hidden md:flex md:w-72 flex-col bg-white border-r border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-primary-50 to-white">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
          NutriTrack
        </h1>
        <p className="text-sm text-slate-500 mt-1">Sua jornada para uma alimentação saudável</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 pl-4">Menu Principal</div>
        <ul className="space-y-1.5">
          {navItems.map((item) => (
            <li key={item.id}>
              <button 
                onClick={() => navigate(item.path)}
                className={`
                  flex items-center w-full p-3 rounded-lg text-left transition-all
                  ${location === item.path 
                    ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 font-medium shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'}
                `}
              >
                <i className={`${item.icon} text-xl mr-3 ${location === item.path ? 'text-primary-600' : 'text-slate-400'}`}></i>
                <span>{item.label}</span>
                {location === item.path && (
                  <div className="ml-auto w-1.5 h-8 bg-primary-500 rounded-full"></div>
                )}
              </button>
            </li>
          ))}
        </ul>
        
        <div className="mt-12 mx-4">
          <div className="rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 p-4 shadow-sm border border-primary-100">
            <h3 className="font-medium text-primary-700 mb-2">Dica do dia</h3>
            <p className="text-sm text-slate-600">
              Lembre-se de beber água regularmente. A hidratação adequada é essencial para uma boa nutrição.
            </p>
          </div>
        </div>
      </nav>
      
      {user && (
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white shadow-sm">
              <span className="text-lg font-medium">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
            </div>
            <div>
              <p className="font-medium text-slate-700">{user.name || 'Usuário'}</p>
              <p className="text-sm text-slate-500 flex items-center">
                <i className="ri-fire-fill text-orange-400 mr-1"></i>
                {user.dailyCalorieGoal ? `${user.dailyCalorieGoal} kcal/dia` : '0 kcal/dia'}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
