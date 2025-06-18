import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  onUpload: (url: string) => void;
  currentAvatar?: string;
  className?: string;
}

export function AvatarUpload({
  onUpload,
  currentAvatar,
  className,
}: AvatarUploadProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);

    try {
      // Create a preview URL for now (in real app, upload to cloud storage)
      const previewUrl = URL.createObjectURL(file);

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would upload to your backend/cloud storage here
      // const formData = new FormData();
      // formData.append('avatar', file);
      // const response = await fetch('/api/upload/avatar', { method: 'POST', body: formData });
      // const { url } = await response.json();

      onUpload(previewUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className="relative group cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={triggerFileSelect}
      >
        <Avatar className="w-20 h-20 ring-4 ring-white shadow-lg">
          <AvatarImage src={currentAvatar} />
          <AvatarFallback className="bg-gradient-crimson text-white text-xl">
            <Camera className="w-8 h-8" />
          </AvatarFallback>
        </Avatar>

        {/* Upload overlay */}
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-black/50 flex items-center justify-center transition-opacity",
            isHovering || isUploading ? "opacity-100" : "opacity-0",
          )}
        >
          {isUploading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-6 h-6 text-white" />
          )}
        </div>

        {/* Remove button */}
        {currentAvatar && !isUploading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="text-center mt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={triggerFileSelect}
          disabled={isUploading}
          className="text-xs text-nihongo-ink-600 hover:text-nihongo-crimson-600"
        >
          {currentAvatar ? "Change Photo" : "Add Photo"}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-nihongo-ink-500 text-center mt-1">
        PNG, JPG up to 5MB
      </p>
    </div>
  );
}
