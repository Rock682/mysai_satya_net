export interface Job {
  id: string | number;
  jobTitle: string;
  description: string;
  lastDate: any;
  startDate: any;
  salary?: string;
  responsibilities?: string;
  syllabusLink?: string;
  employmentType?: string;
  requiredDocuments?: string;
  sourceSheetLink?: string;
  blogContent?: string;
  category?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  affiliateLink: string;
  category: string;
}

export interface MockExam {
  examId: string;
  examName:string;
  examType: string;
  totalQuestions: number;
  durationMinutes: number;
  negativeMarking: number;
  published: string;
}

export interface Question {
  questionId: number;
  examId: string;
  questionText: string;
  imageUrl?: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
  subject: string;
}

export interface UserAnswer {
  questionId: number;
  selectedOption: string | null;
  status: 'answered' | 'unanswered' | 'review';
}

export type Page = 'home' | 'contact' | 'calculators' | 'services' | 'gift-articles' | 'about' | 'store';