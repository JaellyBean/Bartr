import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030712] text-gray-50 flex flex-col items-center overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="w-full max-w-7xl px-6 py-6 flex items-center justify-between border-b border-gray-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xl tracking-tighter shadow-lg shadow-indigo-500/20">B</div>
          <span className="text-2xl font-bold tracking-tight">Bartr</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden sm:block">How it works</Link>
          <Link href="/signup" className="px-5 py-2 text-sm font-semibold bg-white text-black rounded-full hover:bg-gray-200 transition-all">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl px-6 py-20 flex flex-col items-center justify-center text-center relative mt-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Now available in your community
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-6">
          Trade your skills.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Build your community.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
          Bartr is the modern platform to swap personal and professional services. Need a plumber? Offer your graphic design skills in return. No money, just value.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md sm:max-w-none mx-auto">
          <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold text-lg transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]">
            Create an Account
          </Link>
          <button className="w-full sm:w-auto px-8 py-4 bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-white rounded-full font-semibold text-lg transition-all flex items-center justify-center gap-3 backdrop-blur-md">
            Download App
          </button>
        </div>

        {/* Features Section */}
        <div id="features" className="w-full mt-40 grid grid-cols-1 md:grid-cols-3 gap-8 text-left relative z-10">
          <div className="p-8 rounded-3xl bg-gray-900/40 border border-gray-800/50 hover:border-gray-700/80 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 text-xl font-bold">
              1
            </div>
            <h3 className="text-xl font-bold mb-3">Offer Your Expertise</h3>
            <p className="text-gray-400 leading-relaxed">Create a profile highlighting the professional or personal services you can provide to others in your area.</p>
          </div>
          <div className="p-8 rounded-3xl bg-gray-900/40 border border-gray-800/50 hover:border-gray-700/80 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6 text-xl font-bold">
              2
            </div>
            <h3 className="text-xl font-bold mb-3">Find What You Need</h3>
            <p className="text-gray-400 leading-relaxed">Browse your local community for members offering the exact skills, labor, or services you are looking for.</p>
          </div>
          <div className="p-8 rounded-3xl bg-gray-900/40 border border-gray-800/50 hover:border-gray-700/80 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 text-xl font-bold">
              3
            </div>
            <h3 className="text-xl font-bold mb-3">Make the Trade</h3>
            <p className="text-gray-400 leading-relaxed">Chat directly, negotiate the terms of your swap, and exchange value without spending a single dime.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-800/50 py-10 mt-20 flex flex-col items-center justify-center text-gray-500 text-sm gap-4">
        <div className="flex items-center gap-2 opacity-50 grayscale">
          <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-xs text-white">B</div>
          <span className="font-bold tracking-tight text-white">Bartr</span>
        </div>
        <p>&copy; {new Date().getFullYear()} Bartr App. All rights reserved.</p>
      </footer>
    </div>
  );
}
