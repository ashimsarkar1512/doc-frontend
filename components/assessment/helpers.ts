import { Question, QuestionOption as Option } from "@/Redux/features/patient/assesmentcategory";
import { AnswerStore } from "./types";

export function getMediaUrl(media: string | null | undefined): string | null {
  if (!media || !media.trim()) return null;
  if (media.startsWith("http")) return media;
  return `https://storage.weightlossmdcherrycreek.com/testing/${media}`;
}

export function getQuestionTitle(question: Question) {
  return question.questionText?.trim() || question.heading?.trim() || "";
}

export function getQuestionOptions(question: Question): Option[] {
  return Array.isArray(question.options) ? question.options : [];
}

export function getOptionSubQuestions(option: Option): Question[] {
  return Array.isArray(option.subQuestions) ? option.subQuestions : [];
}

export function sortQuestionsByCreationOrder(questions: Question[]) {
  return [...questions].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return aTime - bTime;
  });
}

export function isFileInputType(inputType: string | null | undefined): boolean {
  if (!inputType) return false;
  return (
    inputType.toLowerCase().replace(/\s+/g, "") === "fileupload" ||
    inputType.toLowerCase() === "file"
  );
}

export function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf")
    return { bg: "bg-red-50", text: "text-red-600", label: "PDF" };
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext ?? ""))
    return { bg: "bg-blue-50", text: "text-blue-600", label: "IMG" };
  if (["doc", "docx"].includes(ext ?? ""))
    return { bg: "bg-indigo-50", text: "text-indigo-600", label: "DOC" };
  return {
    bg: "bg-gray-100",
    text: "text-gray-600",
    label: (ext ?? "FILE").toUpperCase().slice(0, 4),
  };
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function isMissingRequired(question: Question, answers: AnswerStore): boolean {
  if (!question.isRequired) return false;
  if (question.type === "INFORMATION_ONLY") return false;

  const options = getQuestionOptions(question);

  if (question.type === "SINGLE_CHOICE") {
    if (options.length === 0) return false;
    const selectedId = answers.single[question.id];
    if (!selectedId) return true;
    const selectedOpt = options.find((o) => o.id === selectedId);
    if (selectedOpt) {
      for (const sub of getOptionSubQuestions(selectedOpt)) {
        if (isMissingRequired(sub, answers)) return true;
      }
    }
    return false;
  }

  if (question.type === "MULTIPLE_CHOICE") {
    if (options.length === 0) return false;
    const selected = answers.multi[question.id] ?? [];
    if (selected.length === 0) return true;
    for (const optId of selected) {
      const opt = options.find((o) => o.id === optId);
      if (opt) {
        for (const sub of getOptionSubQuestions(opt)) {
          if (isMissingRequired(sub, answers)) return true;
        }
      }
    }
    return false;
  }

  if (question.type === "INPUT") {
    if (options.length === 0) {
      return !(answers.text[question.id] ?? "").trim();
    }
    for (const option of options) {
      if (isFileInputType(option.inputType)) {
        if (!answers.files[option.id]?.length) return true;
      } else {
        if (!(answers.text[option.id] ?? "").trim()) return true;
      }
    }
    return false;
  }

  return false;
}
