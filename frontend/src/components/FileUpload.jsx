import React, { useCallback, useState } from 'react';
import { Upload, X, File, CheckCircle, AlertCircle } from 'lucide-react';
import api, { setAuthToken } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const FileUpload = ({ isOpen, onClose, onUploadComplete }) => {
    const { currentUser } = useAuth();
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    if (!isOpen) return null;

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (fileList) => {
        const newFiles = Array.from(fileList).map(file => ({
            file,
            name: file.name,
            size: file.size,
            status: 'pending' // pending, uploading, success, error
        }));
        setFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (idx) => {
        setFiles(prev => prev.filter((_, i) => i !== idx));
    };

    const uploadFiles = async () => {
        setUploading(true);

        try {
            await setAuthToken();

            for (let i = 0; i < files.length; i++) {
                const fileItem = files[i];
                if (fileItem.status === 'success') continue;

                const formData = new FormData();
                formData.append('file', fileItem.file);

                try {
                    await api.post('/files/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        onUploadProgress: (progressEvent) => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadProgress(percentCompleted);
                        }
                    });

                    setFiles(prev => prev.map((f, index) => index === i ? { ...f, status: 'success' } : f));
                } catch (err) {
                    console.error("Upload failed", err);
                    setFiles(prev => prev.map((f, index) => index === i ? { ...f, status: 'error' } : f));
                }
            }
        } catch (error) {
            console.error("Auth error", error);
        } finally {
            setUploading(false);
            setUploadProgress(0);

            // Retrieve successful uploads count
            const successCount = files.filter(f => f.status === 'success').length;
            if (successCount === files.length) {
                setTimeout(() => {
                    onUploadComplete && onUploadComplete();
                    onClose();
                    setFiles([]);
                }, 1000);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Upload Files</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            multiple
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleChange}
                        />
                        <div className="flex flex-col items-center pointer-events-none">
                            <div className="bg-blue-100 p-3 rounded-full mb-4">
                                <Upload className="h-8 w-8 text-blue-600" />
                            </div>
                            <p className="text-lg font-medium text-gray-700">Click to upload or drag and drop</p>
                            <p className="text-sm text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 10MB)</p>
                        </div>
                    </div>

                    {files.length > 0 && (
                        <div className="mt-6 space-y-3 max-h-60 overflow-y-auto">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Selected Files</h3>
                            {files.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center overflow-hidden">
                                        <File className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-medium text-gray-700 truncate">{item.name}</span>
                                            <span className="text-xs text-gray-500">{(item.size / 1024).toFixed(1)} KB</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center ml-4">
                                        {item.status === 'success' ? (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        ) : item.status === 'error' ? (
                                            <AlertCircle className="h-5 w-5 text-red-500" />
                                        ) : (
                                            <button onClick={() => removeFile(idx)} className="text-gray-400 hover:text-red-500">
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {uploading && (
                        <div className="mt-4">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium text-gray-700">Uploading...</span>
                                <span className="text-gray-500">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                        disabled={uploading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={uploadFiles}
                        className={`px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg ${files.length === 0 || uploading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        disabled={files.length === 0 || uploading}
                    >
                        {uploading ? 'Uploading...' : 'Upload Files'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
