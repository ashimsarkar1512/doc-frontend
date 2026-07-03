"use client";

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, X, FileText, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import {
  SideEffectReportPayload,
  useSubmitSideEffectReportMutation,
  useGetCategoriesNamesQuery,
  useGetActiveProvidersQuery,
  useUploadAttachmentMutation,
  Category,
  Doctor,
} from '@/Redux/features/sideEffect/sideEffectAPi';

type Severity = "MILD" | "MODERATE" | "SEVERE" | "LIFE_THREATENING";

interface SeverityOption {
  id: Severity;
  label: string;
  desc: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  serviceId: string;
  providerId: string;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
}

// ─── Custom Dropdown ──────────────────────────────────────────────────────────

interface DropdownProps {
  placeholder: string;
  options: { id: string; name: string }[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

const CustomDropdown = ({ placeholder, options, value, onChange, disabled, loading }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.id === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between px-4 py-2.5 bg-gray-100 rounded-lg text-lg  transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-60 disabled:cursor-not-allowed ${
          open ? 'ring-2 ring-blue-500/50' : ''
        }`}
      >
        <span className={selected ? 'text-black' : 'text-gray-400'}>
          {loading ? 'Loading...' : selected ? selected.name : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 font-bold transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && !loading && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          {/* Default / clear option */}
          <button
            type="button"
            onClick={() => { onChange(''); setOpen(false); }}
            className="w-full text-left px-4 py-2.5 text-sm text-slate-400 hover:bg-slate-50 transition-colors"
          >
            {placeholder}
          </button>

          <div className="max-h-52 overflow-y-auto">
            {options.length === 0 ? (
              <p className="px-4 py-3 text-sm text-slate-400">No options available</p>
            ) : (
              options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => { onChange(opt.id); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-lg font-bold transition-colors ${
                    value === opt.id
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {opt.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Form ────────────────────────────────────────────────────────────────

const ReportForm = () => {
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    description: '',
    serviceId: '',
    providerId: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitSideEffectReport, { isLoading }] = useSubmitSideEffectReportMutation();
  const [uploadAttachment] = useUploadAttachmentMutation();

  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesNamesQuery();
  const { data: providersData, isLoading: providersLoading } = useGetActiveProvidersQuery({});
  
  console.log(providersData , 'providersData');

  const categories: Category[] = categoriesData?.data ?? [];

  // API returns fullName, map to name for CustomDropdown
  const rawProviders: Doctor[] = providersData?.data ?? [];
  const providers = rawProviders.map((doc) => ({ id: doc.id, name: doc.fullName }));

  const severities: SeverityOption[] = [
    { id: 'MILD', label: 'Mild', desc: 'Manageable, not affecting daily life' },
    { id: 'MODERATE', label: 'Moderate', desc: 'Affecting daily activities' },
    { id: 'SEVERE', label: 'Severe', desc: 'Significant impact, may need medical attention' },
    { id: 'LIFE_THREATENING', label: 'Life-threatening', desc: 'Requires immediate emergency care' },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    for (const file of files) {
      const tempId = `temp-${Date.now()}-${file.name}`;
      setUploadingFiles((prev) => [...prev, tempId]);

      try {
        const formPayload = new FormData();
      formPayload.append("context", "SIDE_EFFECT_REPORT_ATTACHMENT");
formPayload.append("files", file);
       toast.success(`${file.name} uploaded successfully!`);
const res = await uploadAttachment(formPayload).unwrap();
        setUploadedFiles((prev) => [
          ...prev,
          { id: res.data.id, name: file.name, type: file.type, size: file.size },
        ]);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      } finally {
        setUploadingFiles((prev) => prev.filter((id) => id !== tempId));
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!selectedSeverity) {
      toast.error('Please select a severity level');
      return;
    }

    const payload: SideEffectReportPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      description: formData.description,
      severity: selectedSeverity,
      status: 'PENDING',
      serviceId: formData.serviceId || undefined,
      providerId: formData.providerId || undefined,
      attachmentIds: uploadedFiles.map((f) => f.id),
    };

    try {
      await submitSideEffectReport(payload).unwrap();
      toast.success('Report submitted successfully!');
      setFormData({ firstName: '', lastName: '', email: '', description: '', serviceId: '', providerId: '' });
      setSelectedSeverity(null);
      setUploadedFiles([]);
    } catch (error) {
      toast.error('Failed to submit report. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl xl:lg:text-3xl md:text-2xl font-bold text-slate-900 mb-6">Side Effect Report Form</h2>

        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm xl:lg:text-lg  md:text-base font-semibold text-[#2B2922]">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="px-4 py-2.5 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg text-black"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-lg xl:lg:text-lg  md:text-base font-semibold text-[#2B2922]">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="px-4 py-2.5 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg text-black"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5 mb-5">
          <label className="text-sm xl:lg:text-lg  md:text-base font-semibold text-[#2B2922]">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="px-4 py-2.5 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg text-black"
          />
        </div>

        {/* Service */}
        <div className="flex flex-col gap-1.5 mb-5">
          <label className="text-sm xl:lg:text-lg  md:text-base font-semibold text-[#2B2922]">Service</label>
          <CustomDropdown
            placeholder="Select medication / service"
            options={categories}
            value={formData.serviceId}
            onChange={(id) => setFormData((prev) => ({ ...prev, serviceId: id }))}
            loading={categoriesLoading}
          />
        </div>

        {/* Provider */}
        <div className="flex flex-col gap-1.5 mb-5">
          <label className="text-sm xl:lg:text-lg  md:text-base font-semibold text-[#2B2922]">Provider</label>
          <CustomDropdown
            placeholder="Select provider"
            options={providers}
            value={formData.providerId}
            onChange={(id) => setFormData((prev) => ({ ...prev, providerId: id }))}
            loading={providersLoading}
          />
        </div>

        {/* Severity */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-sm xl:lg:text-lg  md:text-base font-semibold text-[#2B2922]">Symptom Severity</label>
          {severities.map((item) => (
            <label
              key={item.id}
              className={`flex items-center gap-3 p-3.5 border rounded-lg cursor-pointer transition-colors ${
                selectedSeverity === item.id
                  ? 'border-blue-500 bg-blue-50/30'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-center w-4 h-4 rounded-full border border-slate-300 bg-white shrink-0">
                {selectedSeverity === item.id && (
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                )}
              </div>
              <input
                type="radio"
                name="severity"
                className="hidden"
                checked={selectedSeverity === item.id}
                onChange={() => setSelectedSeverity(item.id)}
              />
              <span className="text-lg text-[#272628]">
                <span className="font-medium">{item.label}</span> - {item.desc}
              </span>
            </label>
          ))}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-sm xl:lg:text-lg  md:text-base font-semibold text-[#2B2922]">Describe Your Symptoms</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            placeholder="Please describe when symptoms started, how they feel, and any other relevant details..."
            className="px-4 py-3 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg resize-none text-black"
          />
        </div>

        {/* File Upload */}
        <div className="flex flex-col gap-1.5 mb-8">
          <label className="text-sm xl:lg:text-lg  md:text-base font-semibold text-[#2B2922]">Supporting Documents (optional)</label>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 bg-gray-100 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <UploadCloud className="w-6 h-6 text-slate-500 mb-2" />
            <p className="text-sm font-medium text-slate-700 mb-1">
              Upload photos, lab results, or other files
            </p>
            <p className="text-xs text-slate-400">PNG, JPG, PDF up to 10MB each</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          {uploadingFiles.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              {uploadingFiles.map((id) => (
                <div key={id} className="flex items-center gap-3 px-3 py-2 bg-blue-50 rounded-lg">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span className="text-xs text-blue-600">Uploading...</span>
                </div>
              ))}
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              {uploadedFiles.map((file) => {
                const isImage = file.type.startsWith('image/');
                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-lg"
                  >
                    {isImage ? (
                      <ImageIcon className="w-4 h-4 text-blue-500 shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">{file.name}</p>
                      <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file.id)}
                      className="p-1 rounded hover:bg-gray-200 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || uploadingFiles.length > 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 px-6 rounded-full transition-colors text-[22px] w-fit"
        >
          {isLoading ? 'Submitting...' : 'Submit Report'}
        </button>

        <p className="text-lg text-[#272628] mt-4">
          Note: Your report is encrypted and HIPAA-protected.
        </p>
      </div>
    </form>
  );
};

export default ReportForm;