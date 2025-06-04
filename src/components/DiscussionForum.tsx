
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageCircle, ThumbsUp, Clock, Plus, Pin } from 'lucide-react';
import { useDiscussions } from '@/hooks/useDiscussions';

export const DiscussionForum = () => {
  const { discussions, loading, createDiscussion, likeDiscussion } = useDiscussions();
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Geral');

  const handleCreateDiscussion = async () => {
    if (newTitle.trim() && newContent.trim()) {
      await createDiscussion(newTitle.trim(), newContent.trim(), newCategory);
      setNewTitle('');
      setNewContent('');
      setIsCreating(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora';
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Discussion Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Fórum da Comunidade</h2>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Discussão
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Discussão</DialogTitle>
              <DialogDescription>
                Compartilhe suas dúvidas ou conhecimento com a comunidade
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Título da discussão"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <select
                className="w-full p-2 border rounded-md"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                <option value="Matemática">Matemática</option>
                <option value="Física">Física</option>
                <option value="Química">Química</option>
                <option value="Biologia">Biologia</option>
                <option value="ENEM">ENEM</option>
                <option value="Geral">Geral</option>
              </select>
              <Textarea
                placeholder="Descreva sua dúvida ou compartilhe seu conhecimento..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={4}
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateDiscussion}>
                  Publicar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {discussions.map((discussion) => (
          <Card key={discussion.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {discussion.is_pinned && (
                      <Pin className="h-4 w-4 text-yellow-600" />
                    )}
                    <h3 className="font-semibold text-lg">{discussion.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">{discussion.content}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={discussion.author_profile?.avatar} />
                      <AvatarFallback>
                        {discussion.author_profile?.nome?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">
                      {discussion.author_profile?.nome}
                    </span>
                  </div>
                  <Badge variant="outline">{discussion.category}</Badge>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(discussion.created_at)}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => likeDiscussion(discussion.id)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    {discussion.likes_count}
                  </button>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <MessageCircle className="h-4 w-4" />
                    {discussion.replies_count}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {discussions.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Nenhuma discussão encontrada
              </h3>
              <p className="text-gray-500 mb-4">
                Seja o primeiro a iniciar uma discussão na comunidade!
              </p>
              <Button onClick={() => setIsCreating(true)}>
                Criar Primeira Discussão
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
