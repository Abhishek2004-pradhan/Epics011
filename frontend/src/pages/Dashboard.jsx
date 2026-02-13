import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    MoreVertical, Folder, FileText, Image, Film, Music, Download,
    Share2, Trash, Upload, HelpCircle, Search, LayoutGrid, List, Plus
} from 'lucide-react';
import FileUpload from '../components/FileUpload';
import PaymentButton from '../components/PaymentButton';
import HelpModal from '../components/HelpModal';
import api, { setAuthToken } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'name', 'size'
    const [filterType, setFilterType] = useState('all');
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const { currentUser } = useAuth();

    const fetchFiles = async () => {
        try {
            await setAuthToken();
            const response = await api.get('/files', {
                params: { name: searchTerm }
            });
            setFiles(response.data);
        } catch (error) {
            console.error("Error fetching files:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [searchTerm, currentUser]);

    const handleDelete = async (file) => {
        const id = file.id || file._id;
        if (!id) return;
        if (!window.confirm(`Are you sure you want to delete "${file.name}"?`)) return;
        try {
            await setAuthToken();
            await api.delete(`/files/${id}`);
            setFiles(prev => prev.filter(f => (f.id || f._id) !== id));
        } catch (error) {
            console.error("Error deleting file:", error);
            alert("Failed to delete file.");
        }
    };

    const handleTogglePublic = async (file) => {
        const id = file.id || file._id;
        try {
            await setAuthToken();
            const response = await api.patch(`/files/${id}/toggle-public`);
            setFiles(prev => prev.map(f => (f.id || f._id) === id ? response.data : f));
        } catch (error) {
            console.error("Error toggling public status:", error);
        }
    };

    const handleRename = async (file) => {
        const newName = window.prompt("Enter new file name:", file.name);
        if (!newName || newName === file.name) return;

        const id = file.id || file._id;
        try {
            await setAuthToken();
            const response = await api.patch(`/files/${id}/rename`, { name: newName });
            setFiles(prev => prev.map(f => (f.id || f._id) === id ? response.data : f));
        } catch (error) {
            console.error("Error renaming file:", error);
            alert("Failed to rename file.");
        }
    };

    const handleDownload = (file) => {
        const url = `${file.url}?download=true`;
        window.open(url, '_blank');
    };

    const handleShare = (file) => {
        if (!file.isPublic) {
            alert("File is private. Please make it public first to share.");
            return;
        }
        navigator.clipboard.writeText(file.url);
        alert("Public link copied to clipboard!");
    };

    const handleUploadComplete = () => {
        fetchFiles();
    };

    const getFileIcon = (type = '') => {
        if (type.startsWith('image/')) return <Image className="h-10 w-10 text-purple-500" />;
        if (type.startsWith('video/')) return <Film className="h-10 w-10 text-pink-500" />;
        if (type.startsWith('audio/')) return <Music className="h-10 w-10 text-yellow-500" />;
        if (type === 'application/pdf') return <FileText className="h-10 w-10 text-red-500" />;
        return <FileText className="h-10 w-10 text-gray-400" />;
    };

    const sortedFiles = [...files].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
        if (sortBy === 'size') return b.size - a.size;
        return 0;
    });

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white">My Library</h1>
                        <p className="text-slate-500 mt-2">Manage and share your secure files.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <PaymentButton />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name">Name (A-Z)</option>
                            <option value="size">Size (Largest)</option>
                        </select>
                        <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                        <button
                            onClick={() => setIsUploadOpen(true)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95 group"
                        >
                            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                            Upload
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Find a file..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {sortedFiles.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-[2.5rem]">
                        <div className="bg-slate-800 w-20 h-20 flex items-center justify-center rounded-3xl mx-auto mb-6">
                            <Plus className="h-10 w-10 text-slate-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No files found</h3>
                        <p className="text-slate-500 mb-8">Upload your first file to get started with CloudShare.</p>
                        <button
                            onClick={() => setIsUploadOpen(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/40"
                        >
                            Upload Now
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedFiles.map(file => (
                            <div key={file.id || file._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 group hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-900/10 relative">
                                <div className="absolute top-4 right-4 z-10">
                                    <div className="relative">
                                        <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-500 hover:text-white transition-colors">
                                            <MoreVertical className="h-5 w-5" />
                                        </button>
                                        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 overflow-hidden">
                                            <button onClick={() => handleDownload(file)} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                                                <Download className="h-4 w-4" /> Download
                                            </button>
                                            <button onClick={() => handleRename(file)} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                                                <FileText className="h-4 w-4" /> Rename
                                            </button>
                                            <button onClick={() => handleTogglePublic(file)} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                                                <Share2 className="h-4 w-4" /> {file.isPublic ? "Make Private" : "Make Public"}
                                            </button>
                                            <button onClick={() => handleShare(file)} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                                                <Share2 className="h-4 w-4" /> Share Link
                                            </button>
                                            <div className="h-[1px] bg-slate-700 my-1"></div>
                                            <button onClick={() => handleDelete(file)} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                                                <Trash className="h-4 w-4" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <Link to={`/view/${file.id || file._id}`} target="_blank" className="block cursor-pointer">
                                    <div className="h-40 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-[1.02] transition-transform">
                                        {getFileIcon(file.type)}
                                    </div>
                                    <h3 className="font-bold text-white truncate text-lg">{file.name}</h3>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                        <div className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${file.isPublic ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                                            {file.isPublic ? 'Public' : 'Private'}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase tracking-widest font-bold bg-slate-800/20">
                                    <th className="px-6 py-5">File Name</th>
                                    <th className="px-6 py-5">Size</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {sortedFiles.map(file => (
                                    <tr key={file.id || file._id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <Link to={`/view/${file.id || file._id}`} target="_blank" className="flex items-center gap-4">
                                                <div className="p-2 bg-slate-800 rounded-lg group-hover:scale-110 transition-transform">
                                                    {React.cloneElement(getFileIcon(file.type), { className: 'h-6 w-6' })}
                                                </div>
                                                <span className="font-semibold text-slate-200 truncate max-w-xs">{file.name}</span>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${file.isPublic ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                                                {file.isPublic ? 'Public' : 'Private'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleDownload(file)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors" title="Download">
                                                    <Download className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleRename(file)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors" title="Rename">
                                                    <FileText className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleTogglePublic(file)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors" title="Toggle Private/Public">
                                                    <Share2 className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(file)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-colors" title="Delete">
                                                    <Trash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <FileUpload
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onUploadComplete={handleUploadComplete}
            />

            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
            />
        </div>
    );
};

export default Dashboard;
