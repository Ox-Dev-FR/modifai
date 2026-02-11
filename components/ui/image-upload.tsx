"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { UploadCloud, X, FileImage } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  label: string;
  onChange: (file: File | null) => void;
  className?: string;
  previewUrl?: string; // Optional initial preview
}

export function ImageUpload({ label, onChange, className, previewUrl }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(previewUrl || null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onChange(file);
      }
      
      if (fileRejections.length > 0) {
         // Handle errors (e.g. file too big)
         console.error("File rejected:", fileRejections);
      }
    },
    [onChange]
  );

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".webp", ".jpg"],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-white">{label}</label>
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px] text-center",
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-white/10 bg-black/20 hover:bg-black/40 hover:border-white/20",
          preview && "border-solid border-white/10 p-0 overflow-hidden bg-black"
        )}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="relative w-full h-full min-h-[200px]">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
            />
            <div className="absolute top-2 right-2">
               <Button 
                size="icon" 
                variant="destructive" 
                className="h-8 w-8 rounded-full shadow-lg"
                onClick={clearImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <div className="p-4 rounded-full bg-white/5">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">
                Cliquez ou glissez-déposez une image
              </p>
              <p className="text-xs">
                JPG, PNG ou WEBP (Max 5MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
