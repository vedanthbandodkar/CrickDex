import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://azlboygatbmkupnqeswc.supabase.co";
const supabaseAnonKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6bGJveWdhdGJta3VwbnFlc3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MTgyMjMsImV4cCI6MjA3MDI5NDIyM30.NAhRnxhj-MvfYCfx-aMuEqI0ASoJ4lm813clzquiaVo";


if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Player {
  id: string;
  name: string;
  country: string;
  role: string;
  batting_style: string;
  bowling_style: string;
  matches: number;
  runs: number;
  average: number;
  hundreds?: number;
  wickets?: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  created_at: string;
}

export interface CricketFact {
  id: string;
  fact: string;
  created_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  player_id: string;
  created_at: string;
}

export interface QuizScore {
  id: string;
  user_id: string;
  score: number;
  total_questions: number;
  completed_at: string;
}