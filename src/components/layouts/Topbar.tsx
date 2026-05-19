import { ShoppingBagIcon } from '../icons/ShoppingBagIcon';
import { BellIcon } from '../icons/BellIcon';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';

import { useAuth } from '../../context/AuthContext';

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md">
      {/* Brand */}
      <div className="flex items-center gap-2.5 text-lg font-bold text-slate-800">
        <ShoppingBagIcon size={20} className="text-slate-900" />
        InternShop
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 uppercase">ADMIN</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100" title="Notifications">
          <BellIcon size={17} />
        </button>
        <button className="flex items-center gap-2.5 rounded-full border border-slate-200 py-1.5 pl-1.5 pr-3 transition-all hover:bg-slate-50">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white uppercase">
            {user?.username?.substring(0, 2) || 'US'}
          </div>
          <span className="text-sm font-medium text-slate-700">{user?.username || 'User'}</span>
          <ChevronDownIcon size={14} className="opacity-50" />
        </button>
      </div>
    </header>
  );
}
