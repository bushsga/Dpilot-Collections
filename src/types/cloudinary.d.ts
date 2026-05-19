// src/types/cloudinary.d.ts

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: Record<string, any>,
        callback: (error: any, result: any) => void
      ) => {
        open: () => void;
        close: () => void;
      };
    };
  }
}

export {};