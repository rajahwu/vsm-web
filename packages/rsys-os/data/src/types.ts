export interface TrainingWindowRow {
  id: string;
  window_type: string;
  duration_minutes: number;
  display_name: string;
  description: string | null;
}

export interface TrainingBlockRow {
  id: string;
  block_code: string;
  window_type: string;
  title: string;
  theme: string;
  category: 'school' | 'generic' | 'custom';
  sort_order: number;
  physical_skill_name: string;
  physical_skill_description: string;
  mental_skill_name: string;
  mental_skill_description: string;
  created_at: string;
  is_active: boolean;
}

export interface TrainingCardRow {
  id: string;
  block_id: string;
  card_order: number;
  front_text: string;
  back_text: string;
  created_at: string;
  // Metadata column will be added in migration 001
  metadata?: Record<string, any>;
}

export interface Database {
  public: {
    Tables: {
      training_windows: {
        Row: TrainingWindowRow;
        Insert: Partial<TrainingWindowRow>;
        Update: Partial<TrainingWindowRow>;
      };
      training_blocks: {
        Row: TrainingBlockRow;
        Insert: Partial<TrainingBlockRow>;
        Update: Partial<TrainingBlockRow>;
      };
      training_cards: {
        Row: TrainingCardRow;
        Insert: Partial<TrainingCardRow>;
        Update: Partial<TrainingCardRow>;
      };
      atoms: {
        Row: {
          id: string;
          type: string;
          val: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          val: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          val?: any;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never
    };
    Functions: {
      [_ in never]: never
    };
    Enums: {
      [_ in never]: never
    };
  };
}
