
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Check, X, Users } from 'lucide-react';
import { useFriends } from '@/hooks/useFriends';

export const FriendsManager = () => {
  const { friends, friendRequests, loading, sendFriendRequest, acceptFriendRequest, removeFriend } = useFriends();
  const [friendId, setFriendId] = useState('');

  const handleSendRequest = () => {
    if (friendId.trim()) {
      sendFriendRequest(friendId.trim());
      setFriendId('');
    }
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
      {/* Add Friend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Adicionar Amigo
          </CardTitle>
          <CardDescription>
            Digite o ID do usuário para enviar uma solicitação de amizade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="ID do usuário"
              value={friendId}
              onChange={(e) => setFriendId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendRequest()}
            />
            <Button onClick={handleSendRequest} disabled={!friendId.trim()}>
              Enviar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      {friendRequests && friendRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Solicitações Pendentes</CardTitle>
            <CardDescription>
              Solicitações de amizade recebidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {friendRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={request.friend_profile?.avatar} />
                      <AvatarFallback>
                        {request.friend_profile?.nome?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{request.friend_profile?.nome || 'Usuário'}</div>
                      <div className="text-sm text-gray-500">
                        Solicitação pendente
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => acceptFriendRequest(request.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFriend(request.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Friends List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Meus Amigos ({friends?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {friends && friends.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={friend.friend_profile?.avatar} />
                      <AvatarFallback>
                        {friend.friend_profile?.nome?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{friend.friend_profile?.nome || 'Usuário'}</div>
                      <Badge variant="secondary">
                        Amigo
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeFriend(friend.id)}
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Você ainda não tem amigos</p>
              <p className="text-sm">Adicione amigos para interagir na comunidade!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
