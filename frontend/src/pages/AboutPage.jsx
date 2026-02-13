import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Shield, Share2, Zap, ArrowLeft, CheckCircle2, CreditCard } from 'lucide-react';

const AboutPage = () => {
    const steps = [
        {
            title: "1. Secure Your Account",
            desc: "Sign up and log in using our encrypted authentication. Your data is your own.",
            icon: <Shield className="h-8 w-8 text-blue-500" />
        },
        {
            title: "2. Fast Uploads",
            desc: "Drag and drop or click 'Upload' to move files to your cloud storage in seconds.",
            icon: <Upload className="h-8 w-8 text-indigo-500" />
        },
        {
            title: "3. Manage & Share",
            desc: "Toggle privacy settings and generate secure shareable links for public files.",
            icon: <Share2 className="h-8 w-8 text-purple-500" />
        },
        {
            title: "4. Scale with Pro",
            desc: "Upgrade for 100GB+ storage, priority support, and larger file size limits.",
            icon: <Zap className="h-8 w-8 text-amber-500" />
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 blur-[100px] rounded-full" />
            </div>

            <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-between items-center bg-slate-950/50 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800/50">
                <Link to="/" className="flex items-center gap-2 group">
                    <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">CloudShare</span>
                </Link>
                <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl font-semibold shadow-lg shadow-blue-900/20 transition-all active:scale-95">
                    Go to Dashboard
                </Link>
            </nav>

            <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center space-y-4 mb-20">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                        How to use <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">CloudShare</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Your simple, secure, and blazing-fast home for all your important files.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {steps.map((step, idx) => (
                        <div key={idx} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl hover:border-slate-700 transition-all hover:shadow-2xl hover:shadow-blue-900/10 group">
                            <div className="mb-6 bg-slate-800/50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:rotate-6 transition-transform">
                                {step.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 p-8 md:p-12 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-400 font-bold tracking-wider uppercase text-sm">
                            <CreditCard className="h-5 w-5" />
                            <span>Pro Membership</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white leading-tight">Ready for more power?</h2>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-slate-300">
                                <CheckCircle2 className="h-5 w-5 text-green-500" /> 100GB Premium Cloud Space
                            </li>
                            <li className="flex items-center gap-2 text-slate-300">
                                <CheckCircle2 className="h-5 w-5 text-green-500" /> Priority File Streaming
                            </li>
                        </ul>
                    </div>
                    <Link to="/dashboard" className="w-full md:w-auto px-10 py-4 bg-white text-slate-950 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all text-center">
                        Get Started Free
                    </Link>
                </div>
            </main>

            <footer className="py-12 text-center text-slate-500 border-t border-slate-900">
                <p>&copy; 2026 CloudShare. Built for extreme performance.</p>
            </footer>
        </div>
    );
};

export default AboutPage;
