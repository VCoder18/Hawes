import { useRef } from "react";
import { Upload, X, Plus, FileText } from "lucide-react";
import { StepHeader } from "@/components/CreateTrip/StepHeader";
import type { TripData } from "@/imports/types";

interface Step7Props {
  tripData: TripData;
  onCoverImageChange: (file: File) => void;
  onRemoveCoverImage: () => void;
  onAdditionalImagesChange: (files: File[]) => void;
  onRemoveAdditionalImage: (index: number) => void;
  uploadedDocument: { data: string; name: string; type: string } | null;
  onDocumentChange: (files: File[]) => void;
  onRemoveDocument: () => void;
}

export function Step7Media({
  tripData,
  onCoverImageChange,
  onRemoveCoverImage,
  onAdditionalImagesChange,
  onRemoveAdditionalImage,
  uploadedDocument,
  onDocumentChange,
  onRemoveDocument,
}: Step7Props) {
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCoverImageChange(file);
    }
  };

  const handleAdditionalImagesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onAdditionalImagesChange(files);
    }
  };

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onDocumentChange(files);
    }
  };

  return (
    <div className="space-y-6">
      <StepHeader
        title="Media"
        description="Upload images to showcase your trip"
      />

      <div>
        <label className="block font-semibold text-text-[#00b70d] mb-2">
          Cover Image <span className="text-red-500">*</span>
        </label>
        <div
          className="border-2 border-dashed border-[#e2e8f0] rounded-xl p-8 text-center hover:border-[#00b70d] transition-colors cursor-pointer"
          onClick={() => coverImageInputRef.current?.click()}
        >
          {tripData.coverImage ? (
            <div className="relative">
              <img
                src={tripData.coverImage}
                alt="Cover"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveCoverImage();
                }}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <X className="size-5" />
              </button>
            </div>
          ) : (
            <div>
              <Upload className="size-12 text-text-[#ff5900] mx-auto mb-3" />
              <p className="font-medium text-text-[#00b70d] mb-1">Click to upload cover image</p>
              <p className="text-sm text-text-[#ff5900]">PNG, JPG up to 10MB</p>
            </div>
          )}
        </div>
        <input
          ref={coverImageInputRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleCoverImageSelect}
          className="hidden"
        />
      </div>

      <div>
        <label className="block font-semibold text-text-[#00b70d] mb-2">
          Additional Images (Optional) - Max 6
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {tripData.additionalImages.map((fileItem, index) => (
            <div key={index} className="relative">
              {fileItem.type.startsWith('image/') ? (
                <img
                  src={fileItem.data}
                  alt={`Additional ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-32 bg-bg-[#ff5900] rounded-lg flex flex-col items-center justify-center">
                  <FileText className="size-8 text-[#00b70d] mb-2" />
                  <p className="text-xs text-text-[#00b70d] font-medium text-center px-2 line-clamp-2">
                    {fileItem.name}
                  </p>
                </div>
              )}
              <button
                onClick={() => onRemoveAdditionalImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
          {tripData.additionalImages.length < 6 && (
            <div
              className="border-2 border-dashed border-[#e2e8f0] rounded-lg h-32 flex items-center justify-center hover:border-[#00b70d] transition-colors cursor-pointer"
              onClick={() => additionalImagesInputRef.current?.click()}
            >
              <Plus className="size-8 text-text-[#ff5900]" />
            </div>
          )}
        </div>
        <input
          ref={additionalImagesInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg"
          onChange={handleAdditionalImagesSelect}
          className="hidden"
        />
      </div>

      <div>
        <label className="block font-semibold text-text-[#00b70d] mb-2">
          Document (Optional)
        </label>
        <p className="text-sm text-text-[#ff5900] mb-4">Upload one PDF or DOCX file (its link will be saved with the trip)</p>
        <div
          className="border-2 border-dashed border-[#e2e8f0] rounded-xl p-8 text-center hover:border-[#00b70d] transition-colors cursor-pointer"
          onClick={() => documentInputRef.current?.click()}
        >
          {uploadedDocument ? (
            <div className="relative flex flex-col items-center">
              <div className="w-full bg-bg-[#ff5900] rounded-lg p-6 flex flex-col items-center justify-center mb-4">
                <FileText className="size-12 text-[#00b70d] mb-3" />
                <p className="text-sm text-text-[#00b70d] font-medium text-center break-words max-w-xs">
                  {uploadedDocument.name}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveDocument();
                }}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <X className="size-5" />
              </button>
            </div>
          ) : (
            <div>
              <Upload className="size-12 text-text-[#ff5900] mx-auto mb-3" />
              <p className="font-medium text-text-[#00b70d] mb-1">Click to upload document</p>
              <p className="text-sm text-text-[#ff5900]">PDF or DOCX up to 10MB</p>
            </div>
          )}
        </div>
        <input
          ref={documentInputRef}
          type="file"
          accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleDocumentSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
