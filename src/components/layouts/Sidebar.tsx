
import { useLocation, useNavigate } from 'react-router';
import { LayoutDashboardIcon } from '../icons/LayoutDashboardIcon';
import { UserGroupIcon } from '../icons/UserGroupIcon';
import { FolderOpenIcon } from '../icons/FolderOpenIcon';
import { PackageIcon } from '../icons/PackageIcon';
import { ShoppingCartIcon } from '../icons/ShoppingCartIcon';
import { SettingsIcon } from '../icons/SettingsIcon';
import { LogOutIcon } from '../icons/LogOutIcon';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',  icon: <LayoutDashboardIcon size={18} />, path: '/dashboard' },
  { label: 'Users',      icon: <UserGroupIcon size={18} />,           path: '/users' },
  { label: 'Categories', icon: <FolderOpenIcon size={18} />,      path: '/categories' },
  { label: 'Products',   icon: <PackageIcon size={18} />,         path: '/products' },
  { label: 'Orders',     icon: <ShoppingCartIcon size={18} />,    path: '/orders' },
  { label: 'Settings',   icon: <SettingsIcon size={18} />,        path: '/settings' },
];

import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-slate-200 bg-white p-4">
      <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Main Menu</p>
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <div
              key={item.path}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                isActive 
                ? 'bg-slate-100 text-slate-900 font-semibold' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              onClick={() => navigate(item.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(item.path)}
            >
              <span className={isActive ? 'text-slate-900' : 'text-slate-400'}>{item.icon}</span>
              {item.label}
            </div>
          );
        })}
      </nav>

      <div className="flex-grow" />
      <div className="my-4 border-t border-slate-100" />

      {/* Logout */}
      <div
        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition-all hover:bg-red-50"
        onClick={handleLogout}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleLogout();
          }
        }}
      >
        <span className="text-red-400"><LogOutIcon size={18} /></span>
        Logout
      </div>
    </aside>
  );
}
