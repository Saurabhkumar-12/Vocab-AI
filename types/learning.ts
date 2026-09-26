export type LanguageCode = 'es' | 'fr' | 'ja' | 'ko' | 'de' | 'zh';
export type DifficultyLevel = 'beginner' | 'elementary' | 'intermediate';
export type LessonActivityType =
  | 'listen'
  | 'repeat'
  | 'flashcards'
  | 'matching'
  | 'roleplay'
  | 'picture'
  | 'conversation';
export type TeacherPromptPurpose = 'warmup' | 'listen' | 'speak' | 'review' | 'vision';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  region: string;
  accent: string;
  emoji: string;
  description: string;
  learners: number;
  isPopular?: boolean;
}

export interface LessonGoal {
  id: string;
  text: string;
}

export interface VocabularyItem {
  id: string;
  term: string;
  translation: string;
  pronunciation?: string;
  notes?: string;
  category: string;
}

export interface PhraseItem {
  id: string;
  phrase: string;
  translation: string;
  pronunciation?: string;
  context: string;
}

export interface LessonActivity {
  id: string;
  type: LessonActivityType;
  title: string;
  instructions: string;
  prompt?: string;
  durationSeconds?: number;
}

export interface AiTeacherPrompt {
  id: string;
  purpose: TeacherPromptPurpose;
  prompt: string;
}

export interface LearningUnit {
  id: string;
  languageCode: LanguageCode;
  title: string;
  summary: string;
  order: number;
  lessonIds: string[];
}

export interface Lesson {
  id: string;
  languageCode: LanguageCode;
  unitId: string;
  title: string;
  slug: string;
  difficulty: DifficultyLevel;
  description: string;
  estimatedMinutes: number;
  goals: LessonGoal[];
  vocabulary: VocabularyItem[];
  phrases: PhraseItem[];
  activities: LessonActivity[];
  aiTeacherPrompts: AiTeacherPrompt[];
}
