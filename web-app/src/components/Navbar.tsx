import {
  ShoppingCart,
  Search,
  Menu,
  X,
  User as UserIcon,
  Heart,
  Package,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ROUTES } from '../config/routes.constants';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { NAVBAR, BRAND } from '../config/ui.config';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { itemCount: cartCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: NAVBAR.nav.home, path: ROUTES.HOME },
    { label: NAVBAR.nav.products, path: ROUTES.PRODUCTS },
    { label: NAVBAR.nav.cart, path: ROUTES.CART },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate(ROUTES.HOME);
  };

  const getUserInitial = () =>
    user?.name?.charAt(0)?.toUpperCase() || 'U';

  const getUserFirstName = () =>
    user?.name?.split(' ')[0] || 'User';

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to={ROUTES.HOME} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text hidden sm:block">
                {BRAND.name}
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-neutral-700 hover:text-primary-600 font-medium relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder={NAVBAR.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <Link to="#" className="hidden sm:flex p-2.5 hover:bg-neutral-100 rounded-lg">
              <Heart className="w-5 h-5 text-neutral-700" />
            </Link>

            <Link to={ROUTES.CART} className="relative p-2.5 hover:bg-neutral-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-neutral-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="hidden sm:flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-neutral-50"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center text-white font-bold">
                    {getUserInitial()}
                  </div>
                  <span className="text-sm font-medium text-neutral-700">
                    {getUserFirstName()}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border py-2 z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-neutral-500">{user.email}</p>
                    </div>

                    <div className="py-1">
                      {/* My Profile */}
                      <Link
                        to={ROUTES.PROFILE}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-50"
                      >
                        <UserIcon className="w-4 h-4" />
                        My Profile
                      </Link>

                      {/* My Orders */}
                      <Link
                        to="/profile?tab=orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-50"
                      >
                        <Package className="w-4 h-4" />
                        {NAVBAR.menu.myOrders}
                      </Link>

                      {/* Admin Dashboard */}
                      {user.role === 'admin' && (
                        <Link
                          to={ROUTES.ADMIN_DASHBOARD}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-50"
                        >
                          <Settings className="w-4 h-4" />
                          {NAVBAR.menu.adminDashboard}
                        </Link>
                      )}
                    </div>

                    <div className="border-t mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        {NAVBAR.menu.signOut}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="hidden sm:flex px-4 py-2 bg-primary-600 text-white rounded-lg"
              >
                {NAVBAR.login}
              </Link>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}