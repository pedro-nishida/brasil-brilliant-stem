
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
  friend_profile?: {
    nome: string;
    avatar?: string;
    xp?: number;
  };
}

export const useFriends = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
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
          friend_profile:users_profile!user_friends_friend_id_fkey(nome, avatar, xp)
        `)
        .eq('user_id', user!.id)
        .eq('status', 'accepted');

      if (friendsError) throw friendsError;

      // Fetch pending requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('user_friends')
        .select(`
          *,
          friend_profile:users_profile!user_friends_user_id_fkey(nome, avatar, xp)
        `)
        .eq('friend_id', user!.id)
        .eq('status', 'pending');

      if (requestsError) throw requestsError;

      setFriends(friendsData || []);
      setPendingRequests(requestsData || []);
    } catch (error) {
      console.error('Erro ao buscar amigos:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (friendEmail: string) => {
    try {
      // First find the user by email
      const { data: userData, error: userError } = await supabase
        .from('users_profile')
        .select('id')
        .eq('id', friendEmail)
        .single();

      if (userError) {
        toast({
          title: "Usuário não encontrado",
          description: "Não foi possível encontrar um usuário com este email.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('user_friends')
        .insert({
          user_id: user!.id,
          friend_id: userData.id,
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
        description: error.message || "Erro ao enviar solicitação de amizade.",
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
        title: "Amizade aceita!",
        description: "Vocês agora são amigos.",
      });

      fetchFriends();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao aceitar solicitação.",
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
        description: "A amizade foi removida.",
      });

      fetchFriends();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover amigo.",
        variant: "destructive",
      });
    }
  };

  return {
    friends,
    pendingRequests,
    loading,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
    refetch: fetchFriends
  };
};
