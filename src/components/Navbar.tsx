import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, Users, BookOpen, Lightbulb, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/leaderboards', label: 'Stats', icon: Trophy },
    { path: '/compare', label: 'Compare', icon: Users },
    { path: '/quiz', label: 'Quiz', icon: BookOpen },
    { path: '/facts', label: 'Facts', icon: Lightbulb },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <span className="text-xl font-bold text-green-800">Cricket Pokédex</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {user ? (
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                  <span className="text-sm text-gray-600">
                    {user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors ml-4"
                >
                  <User size={18} />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile menu */}
            <div className="md:hidden flex items-center space-x-2 overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-md text-xs font-medium transition-colors min-w-max ${
                      isActive
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-700 hover:text-green-600'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="flex flex-col items-center space-y-1 px-2 py-1 rounded-md text-xs font-medium text-gray-700 hover:text-red-600 min-w-max"
                >
                  <LogOut size={16} />
                  <span>Out</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex flex-col items-center space-y-1 px-2 py-1 rounded-md text-xs font-medium text-green-600 hover:bg-green-50 min-w-max"
                >
                  <User size={16} />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Navbar;