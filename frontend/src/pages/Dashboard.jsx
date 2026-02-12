import React, { useState, useEffect } from 'react';
import { MoreVertical, Folder, FileText, Image, Film, Music, Download, Share2, Trash, Upload } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import PaymentButton from '../components/PaymentButton';
import api, { setAuthToken } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const { currentUser } = useAuth();

    const fetchFiles = async () => {
        try {
            await setAuthToken();
            const response = await api.get('/files');
            setFiles(response.data);
        } catch (error) {
            console.error("Error fetching files:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this file?")) return;
        try {
            await setAuthToken();
            await api.delete(`/files/${id}`);
            setFiles(prev => prev.filter(f => f.id !== id));
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    const handleTogglePublic = async (file) => {
        try {
            await setAuthToken();
            const response = await api.patch(`/files/${file.id}/toggle-public`);
            setFiles(prev => prev.map(f => f.id === file.id ? response.data : f));
        } catch (error) {
            console.error("Error toggling public status:", error);
        }
    };

    const handleShare = (file) => {
        if (!file.public) {
            alert("File defaults to private. Please make it public first to share via link.");
            return;
        }
        // Assuming we serve files statically or via an endpoint for now
        // In reality, this would be a dedicated public URL
        const link = `${window.location.origin}/shared/${file.id}`;
        navigator.clipboard.writeText(link);
        alert("Link copied to clipboard!");
    };

    useEffect(() => {
        fetchFiles();
    }, [currentUser]);

    const handleUploadComplete = () => {
        fetchFiles();
    };

    const getFileIcon = (type) => {
        if (type.startsWith('image/')) return <Image className="h-10 w-10 text-purple-500" />;
        if (type.startsWith('video/')) return <Film className="h-10 w-10 text-pink-500" />;
        if (type.startsWith('audio/')) return <Music className="h-10 w-10 text-yellow-500" />;
        if (type === 'application/pdf') return <FileText className="h-10 w-10 text-red-500" />;
        return <FileText className="h-10 w-10 text-gray-400" />;
    };

    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const filteredFiles = files.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || file.type.startsWith(filterType) || (filterType === 'application/pdf' && file.type === 'application/pdf');
        return matchesSearch && matchesType;
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">My Files</h1>
                <div className="flex space-x-4">
                    <PaymentButton />
                    <button
                        onClick={() => setIsUploadOpen(true)}
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <Upload className="h-5 w-5 mr-2" />
                        Upload
                    </button>
                    <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="8" y1="6" x2="21" y2="6"></line>
                                <line x1="8" y1="12" x2="21" y2="12"></line>
                                <line x1="8" y1="18" x2="21" y2="18"></line>
                                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                <line x1="3" y1="18" x2="3.01" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <FileUpload
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onUploadComplete={() => console.log('Upload complete, refresh list')}
            />

            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                        placeholder="Search files..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-48">
                    <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="image">Images</option>
                        <option value="video">Videos</option>
                        <option value="audio">Audio</option>
                        <option value="application/pdf">PDFs</option>
                    </select>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredFiles.map((file) => (
                        <div key={file.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                {getFileIcon(file.type)}
                                <div className="relative group">
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block hover:block">
                                        <button
                                            onClick={() => handleTogglePublic(file)}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {file.public ? "Make Private" : "Make Public"}
                                        </button>
                                        <button
                                            onClick={() => handleShare(file)}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Share Link
                                        </button>
                                        <button
                                            onClick={() => handleDelete(file.id)}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="block group">
                                <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors" title={file.name}>{file.name}</h3>
                            </a>
                            <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB • {new Date(file.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Modified</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredFiles.map((file) => (
                                <tr key={file.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center">
                                                {getFileIcon(file.type)}
                                            </div>
                                            <div className="ml-4">
                                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">{file.name}</a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.size}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.owner}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <MoreVertical className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
