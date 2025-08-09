/*
  # Cricket Pokédex Database Schema

  1. New Tables
    - `players`
      - `id` (uuid, primary key)
      - `name` (text)
      - `country` (text)
      - `role` (text)
      - `batting_style` (text)
      - `bowling_style` (text)
      - `matches` (integer)
      - `runs` (integer)
      - `average` (decimal)
      - `hundreds` (integer, nullable)
      - `wickets` (integer, nullable)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `quiz_questions`
      - `id` (uuid, primary key)
      - `question` (text)
      - `options` (jsonb array)
      - `correct_answer` (integer)
      - `explanation` (text)
      - `created_at` (timestamp)

    - `cricket_facts`
      - `id` (uuid, primary key)
      - `fact` (text)
      - `created_at` (timestamp)

    - `user_favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `player_id` (uuid, references players)
      - `created_at` (timestamp)

    - `quiz_scores`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `score` (integer)
      - `total_questions` (integer)
      - `completed_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Public read access for players, quiz_questions, and cricket_facts
    - User-specific access for favorites and quiz scores
*/

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL,
  role text NOT NULL,
  batting_style text NOT NULL,
  bowling_style text NOT NULL,
  matches integer NOT NULL DEFAULT 0,
  runs integer NOT NULL DEFAULT 0,
  average decimal(5,2) NOT NULL DEFAULT 0.00,
  hundreds integer DEFAULT 0,
  wickets integer DEFAULT 0,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  explanation text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create cricket_facts table
CREATE TABLE IF NOT EXISTS cricket_facts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fact text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, player_id)
);

-- Create quiz_scores table
CREATE TABLE IF NOT EXISTS quiz_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  completed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cricket_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_scores ENABLE ROW LEVEL SECURITY;

-- Create policies for players (public read)
CREATE POLICY "Players are viewable by everyone"
  ON players
  FOR SELECT
  TO public
  USING (true);

-- Create policies for quiz_questions (public read)
CREATE POLICY "Quiz questions are viewable by everyone"
  ON quiz_questions
  FOR SELECT
  TO public
  USING (true);

-- Create policies for cricket_facts (public read)
CREATE POLICY "Cricket facts are viewable by everyone"
  ON cricket_facts
  FOR SELECT
  TO public
  USING (true);

-- Create policies for user_favorites
CREATE POLICY "Users can view their own favorites"
  ON user_favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON user_favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON user_favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for quiz_scores
CREATE POLICY "Users can view their own quiz scores"
  ON quiz_scores
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz scores"
  ON quiz_scores
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert sample players data
INSERT INTO players (name, country, role, batting_style, bowling_style, matches, runs, average, hundreds, wickets, image_url) VALUES
('Virat Kohli', 'India', 'Batsman', 'Right-hand bat', 'Right-arm medium', 274, 12898, 53.62, 43, 4, 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Babar Azam', 'Pakistan', 'Batsman', 'Right-hand bat', 'Right-arm off break', 102, 4442, 54.17, 17, 1, 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Kane Williamson', 'New Zealand', 'Batsman', 'Right-hand bat', 'Right-arm off break', 161, 7115, 47.67, 24, 29, 'https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Jasprit Bumrah', 'India', 'Bowler', 'Right-hand bat', 'Right-arm fast', 72, 99, 8.25, 0, 128, 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Ben Stokes', 'England', 'All-rounder', 'Left-hand bat', 'Right-arm fast-medium', 104, 3061, 35.89, 4, 74, 'https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Steve Smith', 'Australia', 'Batsman', 'Right-hand bat', 'Right-arm leg break', 109, 4378, 43.34, 12, 17, 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Kagiso Rabada', 'South Africa', 'Bowler', 'Right-hand bat', 'Right-arm fast', 64, 246, 12.30, 0, 114, 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Shakib Al Hasan', 'Bangladesh', 'All-rounder', 'Left-hand bat', 'Slow left-arm orthodox', 71, 1969, 33.62, 2, 47, 'https://images.pexels.com/photos/1374510/pexels-photo-1374510.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Jos Buttler', 'England', 'Wicket-keeper', 'Right-hand bat', 'Right-arm off break', 162, 4120, 34.03, 9, 2, 'https://images.pexels.com/photos/209728/pexels-photo-209728.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Trent Boult', 'New Zealand', 'Bowler', 'Left-hand bat', 'Left-arm fast-medium', 93, 188, 7.83, 0, 169, 'https://images.pexels.com/photos/262524/pexels-photo-262524.jpeg?auto=compress&cs=tinysrgb&w=400');

-- Insert quiz questions
INSERT INTO quiz_questions (question, options, correct_answer, explanation) VALUES
('Which bowler has taken the most wickets in Test cricket history?', '["Shane Warne", "Muttiah Muralitharan", "James Anderson", "Anil Kumble"]', 1, 'Muttiah Muralitharan from Sri Lanka holds the record with 800 Test wickets.'),
('What is the highest team score in ODI cricket?', '["481/6", "444/3", "443/9", "439/2"]', 0, 'England scored 481/6 against Australia in 2018, the highest ODI team total.'),
('Which country won the first Cricket World Cup in 1975?', '["England", "Australia", "West Indies", "India"]', 2, 'The West Indies won the inaugural Cricket World Cup in 1975 at Lord''s.'),
('What does LBW stand for in cricket?', '["Left Before Wicket", "Leg Before Wicket", "Last Ball Wide", "Low Bounce Wide"]', 1, 'LBW stands for ''Leg Before Wicket'', one of the ways a batsman can be dismissed.'),
('Which player scored the fastest century in ODI cricket?', '["AB de Villiers", "Corey Anderson", "Shahid Afridi", "Chris Gayle"]', 0, 'AB de Villiers scored a century in just 31 balls against West Indies in 2015.'),
('How many players are there in a cricket team on the field?', '["10", "11", "12", "9"]', 1, 'There are 11 players in a cricket team on the field at any given time.'),
('Which ground is known as the ''Home of Cricket''?', '["The Oval", "Lord''s", "Old Trafford", "Headingley"]', 1, 'Lord''s Cricket Ground in London is traditionally known as the ''Home of Cricket''.');

-- Insert cricket facts
INSERT INTO cricket_facts (fact) VALUES
('The longest cricket match in history lasted 12 days between England and South Africa in 1939, but was still declared a draw.'),
('Cricket was played at the Olympics in 1900, with only two teams participating: Great Britain and France.'),
('The highest individual score in Test cricket is 400 not out by Brian Lara for the West Indies against England in 2004.'),
('India has never lost a Test series at home to Australia since 1969.'),
('The fastest delivery ever bowled was 161.3 km/h (100.2 mph) by Shoaib Akhtar of Pakistan in 2003.'),
('The term ''duck'' for zero runs comes from ''duck''s egg'' because the number 0 resembles an egg.'),
('Cricket stumps are exactly 28 inches high and 9 inches wide.'),
('The first international cricket match was played between USA and Canada in 1844.'),
('Sachin Tendulkar played his first Test match at age 16 and his last at 40, spanning 24 years.'),
('The shortest completed Test match lasted just 5.5 hours between Australia and South Africa in 1932.'),
('Cricket balls are traditionally made with cork centers and leather exteriors, hand-stitched with six rows of stitching.'),
('The Cricket World Cup trophy weighs 11 kilograms and stands 60 centimeters tall.'),
('Don Bradman''s Test batting average of 99.94 is considered the greatest achievement in any major sport.'),
('The term ''hat-trick'' originated in cricket, referring to taking three wickets in three consecutive deliveries.');