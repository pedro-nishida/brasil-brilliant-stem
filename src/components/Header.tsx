
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Menu, Flame, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";

export const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">BrilhanteBR</h1>
              <p className="text-xs text-gray-500">STEM para o Ensino Médio</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900" onClick={() => navigate('/')}>
              Cursos
            </Button>
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900" onClick={() => navigate('/mathematics')}>
              Matemática
            </Button>
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900" onClick={() => navigate('/practice')}>
              Prática
            </Button>
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900" onClick={() => navigate('/community')}>
              Comunidade
            </Button>
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900" onClick={() => navigate('/enem')}>
              ENEM
            </Button>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Streak */}
            {profile && (
              <div className="hidden sm:flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-semibold text-orange-700">{profile.streak_atual} dias</span>
              </div>
            )}

            {/* Search */}
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                3
              </Badge>
            </Button>

            {/* Profile and Logout */}
            {user && (
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 cursor-pointer" onClick={() => navigate('/profile')}>
                  <AvatarImage src={profile?.avatar || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {profile?.nome?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700"
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
