import { Question, QuestionOption as Option } from "@/Redux/features/patient/assesmentcategory";

export interface AnswerStore {
  text: Record<string, string>;
  files: Record<string, File[]>;
  single: Record<string, string>;
  multi: Record<string, string[]>;
}
