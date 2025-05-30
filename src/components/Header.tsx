
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Menu, Flame } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
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
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              Cursos
            </Button>
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              Prática
            </Button>
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              Comunidade
            </Button>
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              ENEM
            </Button>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Streak */}
            <div className="hidden sm:flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-semibold text-orange-700">7 dias</span>
            </div>

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

            {/* Profile */}
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=32&h=32&fit=crop&crop=face" />
              <AvatarFallback>MA</AvatarFallback>
            </Avatar>

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
