import React from "react";
import "react-quill-new/dist/quill.snow.css";

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export default function RichTextRenderer({ content, className = "" }: RichTextRendererProps) {
  return (
    <div className={`rich-text-renderer-container ql-snow ${className}`}>
      <div 
        className="ql-editor !p-0"
        dangerouslySetInnerHTML={{ __html: content }} 
      />
      <style>{`
        /* EXACT match with Admin Dashboard Styles */
        .rich-text-renderer-container .ql-editor { color: #000000; font-family: inherit; }
        .rich-text-renderer-container .ql-editor h1 { font-size: 2.25rem !important; font-weight: 700 !important; line-height: 1.2 !important; margin-bottom: 0.5em !important; color: #000000; }
        .rich-text-renderer-container .ql-editor h2 { font-size: 1.875rem !important; font-weight: 700 !important; line-height: 1.3 !important; margin-bottom: 0.5em !important; color: #000000; }
        .rich-text-renderer-container .ql-editor h3 { font-size: 1.5rem !important; font-weight: 600 !important; line-height: 1.4 !important; margin-bottom: 0.5em !important; color: #000000; }
        .rich-text-renderer-container .ql-editor h4 { font-size: 1.25rem !important; font-weight: 600 !important; line-height: 1.5 !important; margin-bottom: 0.5em !important; color: #000000; }
        .rich-text-renderer-container .ql-editor h5 { font-size: 1.125rem !important; font-weight: 600 !important; line-height: 1.5 !important; margin-bottom: 0.5em !important; color: #000000; }
        .rich-text-renderer-container .ql-editor h6 { font-size: 1rem !important; font-weight: 600 !important; line-height: 1.5 !important; margin-bottom: 0.5em !important; color: #000000; }
        .rich-text-renderer-container .ql-editor p { margin-bottom: 1em !important; line-height: 1.6 !important; }
        .rich-text-renderer-container .ql-editor em, 
        .rich-text-renderer-container .ql-editor i { font-style: italic !important; font-family: system-ui, 'Segoe UI', sans-serif !important; }
        .rich-text-renderer-container .ql-editor strong, 
        .rich-text-renderer-container .ql-editor b { font-weight: bold !important; }
        .rich-text-renderer-container .ql-editor u { text-decoration: underline !important; }
        .rich-text-renderer-container .ql-editor s { text-decoration: line-through !important; }
        .rich-text-renderer-container .ql-editor ul { list-style-type: disc !important; padding-left: 1.5em !important; margin-bottom: 1em !important; }
        .rich-text-renderer-container .ql-editor ol { list-style-type: decimal !important; padding-left: 1.5em !important; margin-bottom: 1em !important; }
        .rich-text-renderer-container .ql-editor li { margin-bottom: 0.25em !important; }
      `}</style>
    </div>
  );
}
