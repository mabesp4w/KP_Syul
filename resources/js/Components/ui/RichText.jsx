import { Editor } from '@tinymce/tinymce-react';
import { useRef, useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function RichText({ value, onChange, error, apiKey, height = 400, ...props }) {
    const editorRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const page = usePage();
    const csrf = page?.props?.csrf || page?.props?.csrf_token;

    // Get API key from props or environment
    const tinymceApiKey = apiKey || import.meta.env.VITE_TINYMCE_API_KEY || '';

    useEffect(() => {
        // Ensure value is synced when changed externally
        if (editorRef.current) {
            const currentContent = editorRef.current.getContent();
            const newValue = value || '';
            if (currentContent !== newValue) {
                editorRef.current.setContent(newValue);
            }
        }
    }, [value]);

    return (
        <div className="w-full relative">
            {isLoading && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-base-200/80 backdrop-blur-sm rounded-lg z-10"
                    style={{ minHeight: `${height}px` }}
                >
                    <div className="flex flex-col items-center gap-3">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="text-sm text-base-content/70 font-medium">Memuat editor...</p>
                    </div>
                </div>
            )}
            <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
                <Editor
                    apiKey={tinymceApiKey}
                    onInit={(evt, editor) => {
                        editorRef.current = editor;
                        setIsLoading(false);
                    }}
                    value={value || ''}
                    onEditorChange={(content) => {
                        if (onChange) {
                            onChange(content);
                        }
                    }}
                init={{
                    height: height,
                    menubar: true,
                    plugins: [
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'image',
                        'charmap',
                        'preview',
                        'anchor',
                        'searchreplace',
                        'visualblocks',
                        'code',
                        'fullscreen',
                        'insertdatetime',
                        'media',
                        'table',
                        'code',
                        'help',
                        'wordcount',
                    ],
                    toolbar:
                        'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help | image | link | code',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    branding: false,
                    promotion: false,
                    images_upload_handler: async (blobInfo) => {
                        try {
                            const formData = new FormData();
                            formData.append('file', blobInfo.blob(), blobInfo.filename());

                            const csrfToken = csrf || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

                            const response = await fetch('/admin/upload-image', {
                                method: 'POST',
                                headers: {
                                    'X-CSRF-TOKEN': csrfToken,
                                    'Accept': 'application/json',
                                },
                                body: formData,
                            });

                            if (!response.ok) {
                                const errorData = await response.json().catch(() => ({}));
                                throw new Error(errorData.message || 'Upload failed');
                            }

                            const data = await response.json();
                            return data.url || data.path || data.location;
                        } catch (error) {
                            console.error('Image upload error:', error);
                            throw new Error(error.message || 'Image upload failed');
                        }
                    },
                    file_picker_types: 'image',
                    automatic_uploads: true,
                    ...props.init,
                }}
                {...props}
                />
            </div>
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
}

