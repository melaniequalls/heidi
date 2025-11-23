import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  notes?: string | null;
  evidence_link?: string | null;
  warnings?: string[] | null;
  document_generated?: boolean;
};

export type Diagnosis = {
  id: string;
  diagnosis: string;
  codes: string[];
  created_at: string;
  updated_at: string;
};

export type Condition = {
  id: string;
  name: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

export type Allergy = {
  id: string;
  name: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
};
