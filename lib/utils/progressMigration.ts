/**
 * Utility for migrating LocalStorage quiz progress to database format
 * This will be used when user logs in to sync their local progress
 */

export type LocalQuizProgress = {
  score: number;
  answeredQuestions: number[];
  incorrectQuestions: number[];
  currentQuestionIndex: number;
  lastUpdated: string;
};

export type DatabaseProgressRecord = {
  userId: number;
  lessonId: number;
  completed: Date | null;
  score: number;
  completedAt: Date | null;
};

export type DatabaseTestResult = {
  userId: number;
  questionId: number;
  userAnswer: string;
  isCorrect: number; // 0 or 1
  answeredAt: Date;
};

/**
 * Read all quiz progress from localStorage
 * Returns a map of lessonId -> progress data
 */
export function readLocalProgress(): Map<number, LocalQuizProgress> {
  const progressMap = new Map<number, LocalQuizProgress>();

  // Iterate through all localStorage keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('quiz-progress-')) {
      // Extract lesson ID from key (format: "quiz-progress-{lessonId}")
      const lessonId = parseInt(key.replace('quiz-progress-', ''));
      const data = localStorage.getItem(key);

      if (data) {
        try {
          const progress: LocalQuizProgress = JSON.parse(data);
          progressMap.set(lessonId, progress);
        } catch (error) {
          console.error(`Failed to parse progress for lesson ${lessonId}:`, error);
        }
      }
    }
  }

  return progressMap;
}

/**
 * Convert LocalStorage progress to database format
 * Note: This doesn't include actual answer data, just overall lesson progress
 */
export function convertProgressToDatabase(
  lessonId: number,
  progress: LocalQuizProgress,
  userId: number,
  totalQuestions: number
): DatabaseProgressRecord {
  const allQuestionsAnswered = progress.answeredQuestions.length >= totalQuestions;
  const scorePercentage = totalQuestions > 0
    ? Math.round((progress.score / totalQuestions) * 100)
    : 0;

  return {
    userId,
    lessonId,
    completed: allQuestionsAnswered ? new Date(progress.lastUpdated) : null,
    score: scorePercentage,
    completedAt: allQuestionsAnswered ? new Date(progress.lastUpdated) : null,
  };
}

/**
 * Generate test result records from progress data
 * Note: We don't have individual answer data in current LocalStorage format,
 * so we can only create records for answered questions with correctness info
 */
export function generateTestResults(
  userId: number,
  questionIds: number[],
  progress: LocalQuizProgress
): DatabaseTestResult[] {
  const results: DatabaseTestResult[] = [];
  const answeredAt = new Date(progress.lastUpdated);

  questionIds.forEach((questionId) => {
    if (progress.answeredQuestions.includes(questionId)) {
      const isCorrect = !progress.incorrectQuestions.includes(questionId);

      results.push({
        userId,
        questionId,
        userAnswer: '', // We don't store individual answers in LocalStorage
        isCorrect: isCorrect ? 1 : 0,
        answeredAt,
      });
    }
  });

  return results;
}

/**
 * Clear local progress after successful migration
 */
export function clearLocalProgress(lessonId?: number) {
  if (lessonId) {
    localStorage.removeItem(`quiz-progress-${lessonId}`);
  } else {
    // Clear all quiz progress
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('quiz-progress-')) {
        keys.push(key);
      }
    }
    keys.forEach(key => localStorage.removeItem(key));
  }
}

/**
 * Client-side migration function
 * Call this after user logs in
 */
export async function migrateLocalProgressToServer(userId: number) {
  const localProgress = readLocalProgress();

  if (localProgress.size === 0) {
    return { migrated: 0, errors: [] };
  }

  const errors: string[] = [];
  let migrated = 0;

  // TODO: Implement API call to migrate data
  // This will be implemented once Supabase Auth is set up

  try {
    // Example API structure:
    // const response = await fetch('/api/progress/migrate', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     userId,
    //     progressData: Array.from(localProgress.entries())
    //   })
    // });

    console.log('Migration data prepared:', {
      userId,
      lessonsToMigrate: localProgress.size,
      data: Array.from(localProgress.entries())
    });

    migrated = localProgress.size;
  } catch (error) {
    errors.push(`Migration failed: ${error}`);
  }

  return { migrated, errors };
}
