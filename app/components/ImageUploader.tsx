'use client';

import { useState, useCallback, useRef } from 'react';

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
}

export default function ImageUploader({ onImagesSelected, multiple = true, maxFiles = 10 }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));

    if (!multiple && imageFiles.length > 0) {
      // Tek resim modu
      const file = imageFiles[0];
      setSelectedFiles([file]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls([reader.result as string]);
      };
      reader.readAsDataURL(file);

      onImagesSelected([file]);
    } else {
      // Çoklu resim modu
      const remainingSlots = maxFiles - selectedFiles.length;
      const filesToAdd = imageFiles.slice(0, remainingSlots);

      if (filesToAdd.length === 0) return;

      const newFiles = [...selectedFiles, ...filesToAdd];
      setSelectedFiles(newFiles);

      // Preview URL'leri oluştur
      filesToAdd.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });

      onImagesSelected(newFiles);
    }
  }, [selectedFiles, multiple, maxFiles, onImagesSelected]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const removeImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);

    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
    onImagesSelected(newFiles);
  };

  const clearAll = () => {
    setSelectedFiles([]);
    setPreviewUrls([]);
    onImagesSelected([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Sürükle-Bırak Alanı */}
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging
            ? 'border-amber-500 bg-amber-50'
            : 'border-gray-300 hover:border-amber-400 bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              {isDragging ? 'Resimleri buraya bırakın' : 'Resimleri sürükleyip bırakın'}
            </p>
            <p className="text-sm text-gray-500 mb-4">veya</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Bilgisayardan Seç
            </button>
          </div>

          <p className="text-xs text-gray-400">
            {multiple ? `Maksimum ${maxFiles} resim yükleyebilirsiniz` : 'Tek resim seçebilirsiniz'}
          </p>
        </div>
      </div>

      {/* Önizlemeler */}
      {previewUrls.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="font-semibold text-gray-700">
              Seçilen Resimler ({selectedFiles.length})
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="text-sm text-red-600 hover:text-red-700 font-semibold"
            >
              Tümünü Temizle
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  {selectedFiles[index].name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
