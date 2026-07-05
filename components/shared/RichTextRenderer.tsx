import React from "react";
import "react-quill-new/dist/quill.snow.css";

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export default function RichTextRenderer({
  content,
  className = "",
}: RichTextRendererProps) {
  return (
    <div className={`rich-text-renderer-container ql-snow ${className}`}>
      <div
        className="ql-editor !p-0"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <style>{`
        .rich-text-renderer-container .ql-editor {
          color: #000;
          font-family: inherit;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
        }

        .rich-text-renderer-container .ql-editor img {
          max-width: 100% !important;
          height: auto !important;
        }

        .rich-text-renderer-container .ql-editor table {
          display: block;
          overflow-x: auto;
          white-space: nowrap;
          max-width: 100%;
        }

        /* ---------------- Headings ---------------- */

        .rich-text-renderer-container .ql-editor h1 {
          font-size: clamp(1.75rem, 5vw, 2.25rem);
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: .5em;
          color: #000;
        }

        .rich-text-renderer-container .ql-editor h2 {
          font-size: clamp(1.5rem, 4vw, 1.875rem);
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: .5em;
          color: #000;
        }

        .rich-text-renderer-container .ql-editor h3 {
          font-size: clamp(1.25rem, 3.5vw, 1.5rem);
          font-weight: 600;
          line-height: 1.4;
          margin-bottom: .5em;
          color: #000;
        }

        .rich-text-renderer-container .ql-editor h4 {
          font-size: clamp(1.125rem, 3vw, 1.25rem);
          font-weight: 600;
          line-height: 1.5;
          margin-bottom: .5em;
          color: #000;
        }

        .rich-text-renderer-container .ql-editor h5 {
          font-size: clamp(1rem, 2.5vw, 1.125rem);
          font-weight: 600;
          line-height: 1.5;
          margin-bottom: .5em;
          color: #000;
        }

        .rich-text-renderer-container .ql-editor h6 {
          font-size: clamp(.875rem, 2vw, 1rem);
          font-weight: 600;
          line-height: 1.5;
          margin-bottom: .5em;
          color: #000;
        }

        /* ---------------- Paragraph ---------------- */

        .rich-text-renderer-container .ql-editor p {
          margin-bottom: 1em;
          line-height: 1.7;
        }

        /* ---------------- Text ---------------- */

        .rich-text-renderer-container .ql-editor strong,
        .rich-text-renderer-container .ql-editor b {
          font-weight: 700;
        }

        .rich-text-renderer-container .ql-editor em,
        .rich-text-renderer-container .ql-editor i {
          font-style: italic;
        }

        .rich-text-renderer-container .ql-editor u {
          text-decoration: underline;
        }

        .rich-text-renderer-container .ql-editor s {
          text-decoration: line-through;
        }

        /* ---------------- Lists ---------------- */

        .rich-text-renderer-container .ql-editor ul,
        .rich-text-renderer-container .ql-editor ol {
          margin: 1rem 0;
          padding-left: 2.5rem;
        }

        .rich-text-renderer-container .ql-editor li {
          margin: .35rem 0;
          padding-left: 0.3rem;
        }

        .rich-text-renderer-container .ql-editor ul > li {
          list-style-type: disc;
        }

        .rich-text-renderer-container .ql-editor ol > li {
          list-style-type: decimal;
        }

        /* Nested Lists */

        .rich-text-renderer-container .ql-editor ul ul {
          list-style-type: circle;
        }

        .rich-text-renderer-container .ql-editor ul ul ul {
          list-style-type: square;
        }

        .rich-text-renderer-container .ql-editor ol ol {
          list-style-type: lower-alpha;
        }

        .rich-text-renderer-container .ql-editor ol ol ol {
          list-style-type: lower-roman;
        }

        /* IMPORTANT */
        /* এগুলো Quill-এর spacing নষ্ট করছিল, তাই remove করা হয়েছে */

        .rich-text-renderer-container .ql-editor li::before {
          content: none !important;
          display: none !important;
        }

        .rich-text-renderer-container .ql-editor li[data-list] {
          padding-left: 0 !important;
        }
      `}</style>
    </div>
  );
}