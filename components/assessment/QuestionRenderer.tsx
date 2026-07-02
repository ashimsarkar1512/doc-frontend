import React from "react";
import Image from "next/image";
import { Question, QuestionOption as Option } from "@/Redux/features/patient/assesmentcategory";
import { AnswerStore } from "./types";
import {
  getQuestionOptions,
  getQuestionTitle,
  getMediaUrl,
  getOptionSubQuestions,
  isFileInputType,
} from "./helpers";
import { FileUploadField } from "./FileUploadField";

// ─── Recursive Option renderer ────────────────────────────────────────────────
// Renders one option button, and if selected renders its subQuestions recursively.

export function RenderOption({
  option,
  isSelected,
  isCheckbox,
  onToggle,
  answers,
  setAnswers,
  depth,
}: {
  option: Option;
  isSelected: boolean;
  isCheckbox: boolean;
  onToggle: () => void;
  answers: AnswerStore;
  setAnswers: React.Dispatch<React.SetStateAction<AnswerStore>>;
  depth: number;
}) {
  const subQuestions = getOptionSubQuestions(option);

  return (
    <div className="flex flex-col">
      {/* Option button */}
      <button
        onClick={onToggle}
        className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl border text-left transition-all duration-150 ${
          isSelected
            ? "bg-white border-blue-500 shadow-sm"
            : "bg-white border-transparent hover:border-gray-300"
        }`}
      >
        <span
          className={`flex-shrink-0 w-7 h-7 ${isCheckbox ? "rounded-md" : "rounded-full"} border-2 flex items-center justify-center transition-colors duration-150 ${
            isSelected
              ? "border-blue-600 bg-blue-600"
              : "border-gray-400 bg-gray-300"
          }`}
        >
          {isSelected &&
            (isCheckbox ? (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
            ))}
        </span>
        <span className="text-gray-800 text-[15px] font-medium">
          {option.label}
        </span>
      </button>

      {/* SubQuestions — recursive, shown only when selected */}
      {isSelected && subQuestions.length > 0 && (
        <div className="mt-2 ml-4 pl-4 border-l-2 border-gray-300 flex flex-col gap-3">
          {subQuestions.map((sub) => (
            <RenderQuestion
              key={sub.id}
              question={sub}
              answers={answers}
              setAnswers={setAnswers}
              depth={depth + 1}
              isNested
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Recursive Question renderer ──────────────────────────────────────────────

export function RenderQuestion({
  question,
  answers,
  setAnswers,
  depth = 0,
  isNested = false,
}: {
  question: Question;
  answers: AnswerStore;
  setAnswers: React.Dispatch<React.SetStateAction<AnswerStore>>;
  depth?: number;
  isNested?: boolean;
}) {
  const options = getQuestionOptions(question);
  const title = getQuestionTitle(question);
  const mediaUrl = getMediaUrl(question.media ?? null);
  const alignClass =
    question.contentAlignment === "CENTER"
      ? "text-center"
      : question.contentAlignment === "RIGHT"
        ? "text-right"
        : "text-left";

  // ── INFORMATION_ONLY (only at top level, nested ones are unusual but handled) ──
  if (question.type === "INFORMATION_ONLY") {
    const wrapperClass = isNested
      ? "rounded-xl p-4 mb-3 bg-gray-100"
      : "rounded-2xl p-5 mb-7";
    return (
      <div
        className={wrapperClass}
        style={isNested ? {} : { backgroundColor: "#EFEFEF" }}
      >
        {mediaUrl && (
          <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-4">
            <Image
              src={mediaUrl}
              alt={title || "Info"}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}
        <div className={`px-1 pb-1 ${alignClass}`}>
          {question.heading?.trim() && (
            <h2 className="text-gray-900 text-[18px] font-bold mb-2 leading-snug">
              {question.heading}
            </h2>
          )}
          {question.description?.trim() && (
            <p className="text-gray-700 text-[15px] leading-relaxed">
              {question.description}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── SINGLE_CHOICE ──
  if (question.type === "SINGLE_CHOICE") {
    const selectedId = answers.single[question.id] ?? "";
    const wrapperClass = isNested
      ? "rounded-xl p-4 bg-gray-100"
      : "rounded-2xl p-6 mb-7";

    return (
      <div
        className={wrapperClass}
        style={isNested ? {} : { backgroundColor: "#EFEFEF" }}
      >
        {!isNested && mediaUrl && (
          <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-5">
            <Image
              src={mediaUrl}
              alt={title || "Question"}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}
        {!isNested && question.heading?.trim() && (
          <h2 className="text-gray-900 text-[18px] font-bold mb-2">
            {question.heading}
          </h2>
        )}
        {title && (
          <p className="text-gray-900 text-[17px] font-semibold mb-1 leading-snug">
            {title}
            {question.isRequired && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </p>
        )}
        {question.description?.trim() && (
          <p className="text-gray-500 text-[14px] mb-5">
            {question.description}
          </p>
        )}
        <div className={title || question.description ? "mt-4" : ""}>
          {options.length === 0 ? (
            <p className="text-gray-400 text-[14px] italic">
              No options available.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {options.map((option) => (
                <RenderOption
                  key={option.id}
                  option={option}
                  isSelected={selectedId === option.id}
                  isCheckbox={false}
                  onToggle={() =>
                    setAnswers((prev) => ({
                      ...prev,
                      single: { ...prev.single, [question.id]: option.id },
                    }))
                  }
                  answers={answers}
                  setAnswers={setAnswers}
                  depth={depth}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── MULTIPLE_CHOICE ──
  if (question.type === "MULTIPLE_CHOICE") {
    const selectedIds = answers.multi[question.id] ?? [];
    const wrapperClass = isNested
      ? "rounded-xl p-4 bg-gray-100"
      : "rounded-2xl p-6 mb-7";

    return (
      <div
        className={wrapperClass}
        style={isNested ? {} : { backgroundColor: "#EFEFEF" }}
      >
        {!isNested && mediaUrl && (
          <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-5">
            <Image
              src={mediaUrl}
              alt={title || "Question"}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}
        {!isNested && question.heading?.trim() && (
          <h2 className="text-gray-900 text-[18px] font-bold mb-2">
            {question.heading}
          </h2>
        )}
        {title && (
          <p className="text-gray-900 text-[17px] font-semibold mb-1 leading-snug">
            {title}
            {question.isRequired && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </p>
        )}
        {question.description?.trim() && (
          <p className="text-gray-500 text-[14px] mb-5">
            {question.description}
          </p>
        )}
        <div className={title || question.description ? "mt-4" : ""}>
          {options.length === 0 ? (
            <p className="text-gray-400 text-[14px] italic">
              No options available.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {options.map((option) => (
                <RenderOption
                  key={option.id}
                  option={option}
                  isSelected={selectedIds.includes(option.id)}
                  isCheckbox
                  onToggle={() =>
                    setAnswers((prev) => {
                      const current = prev.multi[question.id] ?? [];
                      return {
                        ...prev,
                        multi: {
                          ...prev.multi,
                          [question.id]: current.includes(option.id)
                            ? current.filter((id) => id !== option.id)
                            : [...current, option.id],
                        },
                      };
                    })
                  }
                  answers={answers}
                  setAnswers={setAnswers}
                  depth={depth}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── INPUT ──
  if (question.type === "INPUT") {
    const wrapperClass = isNested
      ? "rounded-xl p-4 bg-gray-100"
      : "rounded-2xl p-6 mb-7";

    return (
      <div
        className={wrapperClass}
        style={isNested ? {} : { backgroundColor: "#EFEFEF" }}
      >
        {!isNested && mediaUrl && (
          <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-5">
            <Image
              src={mediaUrl}
              alt={title || "Question"}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}
        {title && (
          <p className="text-gray-900 text-[17px] font-semibold mb-1 leading-snug">
            {title}
            {question.isRequired && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </p>
        )}
        {question.description?.trim() && (
          <p className="text-gray-500 text-[14px] mb-4">
            {question.description}
          </p>
        )}

        {options.length === 0 ? (
          // No options defined: render a plain text input keyed by questionId
          <div className={title || question.description ? "mt-3" : ""}>
            <input
              type="text"
              placeholder="Write here..."
              value={answers.text[question.id] ?? ""}
              onChange={(e) =>
                setAnswers((prev) => ({
                  ...prev,
                  text: { ...prev.text, [question.id]: e.target.value },
                }))
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 text-[15px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-150"
            />
          </div>
        ) : (
          <div
            className={`flex flex-col gap-4 ${title || question.description ? "mt-3" : ""}`}
          >
            {options.map((option) => {
              if (isFileInputType(option.inputType)) {
                return (
                  <FileUploadField
                    key={option.id}
                    label={option.label ?? undefined}
                    files={answers.files[option.id] ?? []}
                    onFileChange={(files) =>
                      setAnswers((prev) => ({
                        ...prev,
                        files: { ...prev.files, [option.id]: files },
                      }))
                    }
                  />
                );
              }

              const isNumber = option.inputType === "number";
              return (
                <div key={option.id}>
                  {option.label?.trim() && (
                    <label className="block text-gray-800 text-[15px] font-medium mb-2">
                      {option.label}
                    </label>
                  )}
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      {isNumber ? (
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      )}
                    </div>
                    <input
                      type={isNumber ? "number" : "text"}
                      placeholder={
                        option.placeholder?.trim() ||
                        (isNumber ? "Enter a number..." : "Write here...")
                      }
                      value={answers.text[option.id] ?? ""}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          text: { ...prev.text, [option.id]: e.target.value },
                        }))
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 text-[15px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-150"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return null;
}
