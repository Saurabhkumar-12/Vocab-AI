import type { LearningUnit } from '../types/learning';

export const LEARNING_UNITS: LearningUnit[] = [
  {
    id: 'es-basics',
    languageCode: 'es',
    title: 'Spanish Basics',
    summary: 'Start with greetings, introductions, and everyday confidence.',
    order: 1,
    lessonIds: ['es-introductions', 'es-daily-life'],
  },
  {
    id: 'fr-basics',
    languageCode: 'fr',
    title: 'French Foundations',
    summary: 'Learn polite greetings, travel phrases, and everyday conversation starters.',
    order: 2,
    lessonIds: ['fr-introductions', 'fr-travel'],
  },
  {
    id: 'ja-basics',
    languageCode: 'ja',
    title: 'Japanese Essentials',
    summary: 'Practice simple phrases for polite introductions and common routines.',
    order: 3,
    lessonIds: ['ja-greetings', 'ja-routines'],
  },
];
