import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);

export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
);

export type Database = {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string;
          name: string;
          slug: string;
          industry: string | null;
          plan: 'free' | 'pro' | 'business' | 'enterprise';
          message_quota: number;
          message_used: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['workspaces']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['workspaces']['Insert']>;
      };
      chatbots: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          description: string | null;
          system_prompt: string;
          model: string;
          temperature: number;
          pinecone_namespace: string;
          is_active: boolean;
          widget_settings: any;
          use_case: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['chatbots']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['chatbots']['Insert']>;
      };
      conversations: {
        Row: {
          id: string;
          chatbot_id: string;
          visitor_id: string;
          messages: any;
          metadata: any;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>;
      };
      documents: {
        Row: {
          id: string;
          chatbot_id: string;
          filename: string;
          file_url: string;
          file_size: number;
          mime_type: string;
          chunk_count: number;
          status: 'pending' | 'processing' | 'completed' | 'failed';
          error_message: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['documents']['Insert']>;
      };
    };
  };
};
