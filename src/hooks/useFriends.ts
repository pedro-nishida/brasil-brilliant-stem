
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
      
      // Fetch accepted friends
      const { data: friendsData, error: friendsError } = await supabase
        .from('user_friends')
        .select(`
          *,
          friend_profile:users_profile!user_friends_friend_id_fkey(nome, avatar)
        `)
        .eq('user_id', user!.id)
        .eq('status', 'accepted');

      if (friendsError) throw friendsError;

      // Fetch pending requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('user_friends')
        .select(`
          *,
          friend_profile:users_profile!user_friends_user_id_fkey(nome, avatar)
        `)
        .eq('friend_id', user!.id)
        .eq('status', 'pending');

      if (requestsError) throw requestsError;

      setFriends(friendsData || []);
      setFriendRequests(requestsData || []);
    } catch (error) {
      console.error('Erro ao buscar amigos:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (friendEmail: string) => {
    try {
      // First find user by email (we'll need to add email to users_profile or use a different approach)
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "Em breve você poderá adicionar amigos por email.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
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
