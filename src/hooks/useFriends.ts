
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  updated_at: string;
  friend_profile?: {
    nome: string;
    avatar?: string;
  };
}

export const useFriends = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFriends();
    }
  }, [user]);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      
      // Fetch accepted friends - simplified query without join
      const { data: friendsData, error: friendsError } = await supabase
        .from('user_friends')
        .select('*')
        .eq('user_id', user!.id)
        .eq('status', 'accepted');

      if (friendsError) throw friendsError;

      // Fetch pending requests - simplified query without join
      const { data: requestsData, error: requestsError } = await supabase
        .from('user_friends')
        .select('*')
        .eq('friend_id', user!.id)
        .eq('status', 'pending');

      if (requestsError) throw requestsError;

      // For now, set mock profile data since the relationship doesn't exist
      const friendsWithProfiles = (friendsData || []).map(friend => ({
        ...friend,
        status: friend.status as 'pending' | 'accepted' | 'blocked',
        friend_profile: {
          nome: 'Usuário',
          avatar: undefined
        }
      }));

      const requestsWithProfiles = (requestsData || []).map(request => ({
        ...request,
        status: request.status as 'pending' | 'accepted' | 'blocked',
        friend_profile: {
          nome: 'Usuário',
          avatar: undefined
        }
      }));

      setFriends(friendsWithProfiles);
      setFriendRequests(requestsWithProfiles);
    } catch (error) {
      console.error('Erro ao buscar amigos:', error);
      setFriends([]);
      setFriendRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (friendId: string) => {
    try {
      const { error } = await supabase
        .from('user_friends')
        .insert({
          user_id: user!.id,
          friend_id: friendId,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Solicitação enviada!",
        description: "Sua solicitação de amizade foi enviada.",
      });

      fetchFriends();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar solicitação.",
        variant: "destructive",
      });
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('user_friends')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Solicitação aceita!",
        description: "Vocês agora são amigos.",
      });

      fetchFriends();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeFriend = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('user_friends')
        .delete()
        .eq('id', friendshipId);

      if (error) throw error;

      toast({
        title: "Amigo removido",
        description: "A amizade foi desfeita.",
      });

      fetchFriends();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    friends,
    friendRequests,
    loading,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
    refetch: fetchFriends
  };
};
