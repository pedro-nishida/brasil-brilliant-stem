
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Discussion {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[] | null;
  likes_count: number;
  replies_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  author_profile?: {
    nome: string;
    avatar?: string;
  };
}

interface Reply {
  id: string;
  discussion_id: string;
  user_id: string;
  content: string;
  likes_count: number;
  parent_reply_id: string | null;
  created_at: string;
  author_profile?: {
    nome: string;
    avatar?: string;
  };
}

export const useDiscussions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('discussions')
        .select(`
          *,
          author_profile:users_profile!discussions_user_id_fkey(nome, avatar)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiscussions(data || []);
    } catch (error) {
      console.error('Erro ao buscar discussões:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDiscussion = async (title: string, content: string, category: string, tags?: string[]) => {
    try {
      const { error } = await supabase
        .from('discussions')
        .insert({
          user_id: user!.id,
          title,
          content,
          category,
          tags
        });

      if (error) throw error;

      toast({
        title: "Discussão criada!",
        description: "Sua discussão foi publicada na comunidade.",
      });

      fetchDiscussions();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar discussão.",
        variant: "destructive",
      });
    }
  };

  const likeDiscussion = async (discussionId: string) => {
    try {
      const { error } = await supabase
        .from('discussion_likes')
        .insert({
          user_id: user!.id,
          discussion_id: discussionId
        });

      if (error) throw error;
      fetchDiscussions();
    } catch (error: any) {
      // If already liked, remove like
      if (error.code === '23505') {
        await supabase
          .from('discussion_likes')
          .delete()
          .eq('user_id', user!.id)
          .eq('discussion_id', discussionId);
        fetchDiscussions();
      }
    }
  };

  return {
    discussions,
    loading,
    createDiscussion,
    likeDiscussion,
    refetch: fetchDiscussions
  };
};
