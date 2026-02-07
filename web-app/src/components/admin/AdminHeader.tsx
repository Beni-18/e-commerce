import { Bell, Search, User, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes.constants';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminHeader() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate(ROUTES.LOGIN, { replace: true });
    };

    return (
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 md:px-8 h-16">
                {/* Search */}
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 ml-4">
                    {/* Notifications */}
                    <button className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                        <Bell className="w-5 h-5 text-neutral-700" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Settings */}
                    <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                        <Settings className="w-5 h-5 text-neutral-700" />
                    </button>

                    {/* User Menu */}
                    <div className="flex items-center gap-3 pl-3 border-l border-neutral-200">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-semibold text-neutral-900">Admin User</p>
                            <p className="text-xs text-neutral-500">admin@shophub.com</p>
                        </div>

                        <div className="relative group">
                            <button className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center text-white font-semibold">
                                <User className="w-5 h-5" />
                            </button>

                            {/* Dropdown */}
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                <Link
                                    to={ROUTES.HOME}
                                    className="flex items-center gap-2 px-4 py-3 hover:bg-neutral-50 transition-colors"
                                >
                                    <User className="w-4 h-4" />
                                    <span className="text-sm">View Store</span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-neutral-50 transition-colors text-red-600"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="text-sm">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}