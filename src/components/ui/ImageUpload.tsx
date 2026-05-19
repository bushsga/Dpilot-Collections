'use client';

import { useCallback, useRef } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import Image from 'next/image';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const widgetRef = useRef<any>(null);

  const handleUpload = useCallback(() => {
    // Check if Cloudinary script is loaded
    if (!window.cloudinary) {
      alert('Image uploader is still loading. Please wait a moment and try again.');
      return;
    }

    // Close previous widget if open
    if (widgetRef.current) {
      widgetRef.current.close();
    }

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: 'dpilot-products',
        maxFiles: maxImages - images.length,
        multiple: true,
        sources: ['local', 'url', 'camera'],
        showAdvancedOptions: false,
        cropping: false,
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#1B3A4B',
            tabIcon: '#1B3A4B',
            menuIcons: '#0A0A0A',
            textDark: '#0A0A0A',
            textLight: '#FFFFFF',
            link: '#1B3A4B',
            action: '#1B3A4B',
            inProgress: '#1B3A4B',
            complete: '#0A0A0A',
            error: '#CC0000',
          },
        },
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          // Add the new image URL to our array
          const newImageUrl = result.info.secure_url;
          onChange([...images, newImageUrl]);
        }
        if (error) {
          console.error('Upload error:', error);
        }
      }
    );

    widgetRef.current.open();
  }, [images, onChange, maxImages]);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div>
      {/* Image Previews */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative w-24 h-24 border border-brand-muted/20">
              <Image
                src={image}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <FiX size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {images.length < maxImages && (
        <button
          type="button"
          onClick={handleUpload}
          className="flex items-center gap-2 border-2 border-dashed border-brand-muted/30 px-6 py-4 text-sm text-brand-muted hover:border-brand-accent hover:text-brand-accent transition-colors"
        >
          <FiUpload />
          Upload Images ({images.length}/{maxImages})
        </button>
      )}

      <p className="text-xs text-brand-muted mt-2">
        Supported formats: JPG, PNG, WEBP. Max 10MB per image.
      </p>
    </div>
  );
}