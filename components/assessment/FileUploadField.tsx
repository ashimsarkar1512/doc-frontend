import { useState } from "react";
import { getFileIcon, formatBytes } from "./helpers";

export function FileUploadField({
  label,
  description,
  files,
  onFileChange,
}: {
  label?: string;
  description?: string;
  files: File[];
  onFileChange: (files: File[]) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (incoming: File[]) => onFileChange([...files, ...incoming]);

  return (
    <div className="mt-2">
      {label && (
        <p className="text-gray-800 text-[15px] font-semibold mb-1">{label}</p>
      )}
      {description && (
        <p className="text-gray-500 text-[13px] mb-3">{description}</p>
      )}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(Array.from(e.dataTransfer.files));
        }}
        className={`flex flex-col items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed py-8 px-4 cursor-pointer transition-all duration-150 ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/40"
        }`}
      >
        <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center mb-1">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4"
            />
          </svg>
        </div>
        <p className="text-gray-700 text-[14px] font-medium">
          <span className="text-blue-600 font-semibold">Click to upload</span>{" "}
          or drag &amp; drop
        </p>
        <p className="text-gray-400 text-[12px]">
          PDF, JPG, PNG, DOC up to 10MB each
        </p>
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          className="hidden"
          onChange={(e) => {
            addFiles(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      </label>

      {files.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {files.map((file, idx) => {
            const icon = getFileIcon(file.name);
            return (
              <li
                key={idx}
                className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 border border-gray-200"
              >
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-lg ${icon.bg} flex items-center justify-center`}
                >
                  <span className={`text-[10px] font-bold ${icon.text}`}>
                    {icon.label}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-[13px] font-medium truncate">
                    {file.name}
                  </p>
                  <p className="text-gray-400 text-[11px]">
                    {formatBytes(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onFileChange(files.filter((_, i) => i !== idx))
                  }
                  className="flex-shrink-0 w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                  aria-label="Remove"
                >
                  <svg
                    className="w-3.5 h-3.5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
