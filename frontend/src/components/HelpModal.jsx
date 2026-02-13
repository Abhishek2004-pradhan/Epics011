import React from 'react';
import { X, Upload, Share2, Shield, Zap, CreditCard } from 'lucide-react';

const HelpModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const sections = [
        {
            title: "Getting Started: Uploading",
            icon: <Upload className="h-5 w-5 text-blue-500" />,
            content: "Click the 'Upload' button in the top right to select files from your computer. We support all file types including images, videos, and documents."
        },
        {
            title: "Privacy & Visibility",
            icon: <Shield className="h-5 w-5 text-indigo-500" />,
            content: "By default, your files are Private. Use the '...' menu on any file to toggle its visibility. 'Public' files can be shared via links."
        },
        {
            title: "Sharing Your Files",
            icon: <Share2 className="h-5 w-5 text-purple-500" />,
            content: "Once a file is set to Public, you can copy its unique link from the 'Share Link' option in the file menu to send it to anyone."
        },
        {
            title: "Upgrade to Pro",
            icon: <CreditCard className="h-5 w-5 text-green-500" />,
            content: "Need more storage? Click 'Upgrade to Pro' in the sidebar to get 100GB of secure storage and higher upload limits."
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600/20 p-2 rounded-xl border border-blue-500/20">
                            <Zap className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">CloudShare Guide</h2>
                            <p className="text-sm text-slate-400">Master your file management</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-white"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-3">
                            <div className="flex items-center gap-2">
                                {section.icon}
                                <h3 className="font-semibold text-slate-200">{section.title}</h3>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-800/30 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
