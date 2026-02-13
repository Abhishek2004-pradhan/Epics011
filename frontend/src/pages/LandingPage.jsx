import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Shield, Share2, Zap, ArrowRight, Github, Twitter, Mail } from 'lucide-react';
import HelpModal from '../components/HelpModal';

const LandingPage = () => {
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const features = [
        {
            title: "Lightning Fast Uploads",
            desc: "Powered by edge-accelerated ingestion for near-instant file transfers.",
            icon: <Zap className="h-6 w-6 text-blue-400" />
        },
        {
            title: "Bank-Grade Security",
            desc: "AES-256 encryption at rest and TLS 1.3 in transit keeps your data private.",
            icon: <Shield className="h-6 w-6 text-indigo-400" />
        },
        {
            title: "Smart Sharing",
            desc: "Fine-grained privacy controls and secure public links for collaboration.",
            icon: <Share2 className="h-6 w-6 text-purple-400" />
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Navbar */}
            <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center z-50">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
                        <Zap className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">CloudShare</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
                    <Link to="/about" className="text-slate-400 hover:text-white transition-colors">Features</Link>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors">Pricing</a>
                    <Link to="/sign-in" className="text-slate-400 hover:text-white transition-colors">Sign In</Link>
                    <Link to="/sign-up" className="bg-white text-slate-950 px-6 py-2.5 rounded-full hover:bg-slate-200 transition-all active:scale-95">
                        Get Started
                    </Link>
                </div>
                <button className="md:hidden text-slate-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-4">
                <div className="max-w-7xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold animate-fade-in">
                        <Zap className="h-4 w-4" />
                        <span>Now with 100GB Free Storage</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.1] tracking-tight max-w-4xl mx-auto">
                        Your files, <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">reimagined</span> for the web.
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Securely store, share, and collaborate on your files with a platform built for speed and privacy. No compromises.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Link to="/sign-up" className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 group flex items-center justify-center gap-2">
                            Start for Free
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/about" className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg border border-slate-800 hover:bg-slate-800 transition-all text-center">
                            How it works
                        </Link>
                    </div>

                    {/* Dashboard Preview / Mockup */}
                    <div className="mt-20 relative px-4">
                        <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
                            <img
                                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
                                alt="Dashboard Preview"
                                className="w-full h-auto opacity-80 grayscale hover:grayscale-0 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 bg-slate-900/30">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-blue-400 font-bold uppercase tracking-widest text-sm">Engineered for Excellence</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-white">Full-stack functionality. <br />Zero complexity.</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="bg-slate-900/50 border border-slate-800/80 p-8 rounded-3xl hover:border-blue-500/50 transition-all group">
                                <div className="bg-slate-800/80 w-14 h-14 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                                    {f.icon}
                                </div>
                                <h4 className="text-xl font-bold text-white mb-4">{f.title}</h4>
                                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-slate-900 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <Zap className="h-6 w-6 text-blue-500" />
                            <span className="text-2xl font-bold text-white">CloudShare</span>
                        </div>
                        <p className="text-slate-500 max-w-sm">
                            The next generation of file sharing is here. Secure, fast, and designed for you.
                        </p>
                        <div className="flex gap-4">
                            <Twitter className="h-5 w-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
                            <Github className="h-5 w-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
                            <Mail className="h-5 w-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
                        </div>
                    </div>
                    <div>
                        <h5 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Platform</h5>
                        <ul className="space-y-4 text-slate-500">
                            <li className="hover:text-white transition-colors cursor-pointer">Security</li>
                            <li className="hover:text-white transition-colors cursor-pointer">API</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Releases</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Company</h5>
                        <ul className="space-y-4 text-slate-500">
                            <li className="hover:text-white transition-colors cursor-pointer">About</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Support</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Legal</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-20 text-center text-slate-600 text-sm">
                    &copy; 2026 CloudShare Inc. All rights reserved.
                </div>
            </footer>

            <HelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
            />
        </div>
    );
};

export default LandingPage;

