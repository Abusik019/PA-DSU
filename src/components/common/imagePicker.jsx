import { useDropzone } from 'react-dropzone';
import { useState } from 'react';

export default function ImagePicker({ onImageSelected }) {
    const [preview, setPreview] = useState(null);

    const onDrop = acceptedFiles => {
        const file = acceptedFiles[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            if (onImageSelected) onImageSelected(file);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'image/*': [] },
        onDrop,
        multiple: false
    });

    return (
        <div
            {...getRootProps()}
            className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-400 transition"
        >
            <input {...getInputProps()} />
            {preview ? (
                <img src={preview} alt="preview" className="max-w-xs max-h-48 mb-2 rounded" />
            ) : (
                <div className="text-gray-500 text-center">
                    {isDragActive
                        ? "Отпустите файл для загрузки"
                        : "Перетащите или выберите фото для новости"}
                </div>
            )}
        </div>
    );
}