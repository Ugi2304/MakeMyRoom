import React, { useState, useEffect } from 'react';
import { AppMode, DesignStyle, DESIGN_STYLES } from './types';
import { generateRedesign } from './services/geminiService';
import ComparisonSlider from './components/ComparisonSlider';
import StyleSelector from './components/StyleSelector';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.UPLOAD);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  
  // History State
  const [history, setHistory] = useState<(string | null)[]>([null]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [selectedStyle, setSelectedStyle] = useState<DesignStyle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Dark mode state
  const [darkMode, setDarkMode] = useState(true);

  // Derived state for current view
  const currentGeneratedImage = history[historyIndex];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setMode(AppMode.DESIGN);
        // Reset history
        setHistory([null]);
        setHistoryIndex(0);
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to add new state to history
  const pushToHistory = (newImage: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newImage);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Generate Style Handler
  const handleStyleSelect = async (style: DesignStyle) => {
    if (!originalImage || isGenerating) return;

    setSelectedStyle(style);
    setIsGenerating(true);
    
    try {
      const result = await generateRedesign(originalImage, style.prompt);
      pushToHistory(result);
    } catch (error) {
      alert("Failed to generate design. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpdate = (newImage: string) => {
    pushToHistory(newImage);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      {/* Navbar */}
      <nav className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center px-6 bg-white dark:bg-slate-900 z-10 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight">MakeMy<span className="text-indigo-600 dark:text-indigo-500">Room</span></h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          {mode === AppMode.DESIGN && (
            <button 
              onClick={() => {
                setMode(AppMode.UPLOAD);
                setOriginalImage(null);
                setHistory([null]);
                setHistoryIndex(0);
                setSelectedStyle(null);
              }}
              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Start Over
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? (
              // Sun Icon
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              // Moon Icon
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Visualization */}
        <div className={`flex-1 flex flex-col p-6 transition-all duration-500 overflow-y-auto ${mode === AppMode.DESIGN ? 'md:w-2/3 lg:w-3/4' : 'w-full'}`}>
          
          {mode === AppMode.UPLOAD && (
             <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition-all">
                <div className="max-w-md text-center">
                  <div className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-indigo-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">Upload your room</h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">Take a photo of your current space and let AI reimagine it in seconds.</p>
                  
                  <label className="inline-flex cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-indigo-600/20 transition-all transform hover:scale-105">
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    Select Photo
                  </label>
                </div>
             </div>
          )}

          {mode === AppMode.DESIGN && originalImage && (
            <div className="space-y-6 max-w-5xl mx-auto w-full h-full flex flex-col">
              
              {/* Visualization Container */}
              <div className="relative flex-shrink-0">
                 {/* Undo/Redo Controls */}
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-1">
                    <button 
                      onClick={handleUndo} 
                      disabled={historyIndex === 0}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                      title="Undo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                      </svg>
                    </button>
                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                    <button 
                      onClick={handleRedo}
                      disabled={historyIndex === history.length - 1}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                      title="Redo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
                      </svg>
                    </button>
                 </div>

                 {isGenerating ? (
                   <div className="w-full h-[300px] md:h-[500px] bg-white dark:bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800 animate-pulse transition-colors">
                      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-indigo-600 dark:text-indigo-400 font-medium">Reimagining your space...</p>
                   </div>
                 ) : currentGeneratedImage ? (
                   <ComparisonSlider 
                    originalImage={originalImage} 
                    generatedImage={currentGeneratedImage} 
                   />
                 ) : (
                  <div className="w-full h-[300px] md:h-[500px] relative rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 group shadow-sm dark:shadow-none">
                    <img src={originalImage} className="w-full h-full object-cover" alt="Original" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <p className="text-white font-medium bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">Select a style below to begin</p>
                    </div>
                  </div>
                 )}
              </div>

              {/* Styles Carousel */}
              <div className="flex-1 flex flex-col justify-end min-h-[150px]">
                <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-3 px-1">
                  Choose a Style
                </h3>
                <StyleSelector 
                  onSelect={handleStyleSelect} 
                  selectedStyleId={selectedStyle?.id}
                  disabled={isGenerating}
                />
              </div>

            </div>
          )}
        </div>

        {/* Right Side: Chat */}
        {mode === AppMode.DESIGN && (
          <div className="hidden md:flex w-1/3 lg:w-1/4 h-full border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300">
             <ChatInterface 
                currentImageBase64={currentGeneratedImage || originalImage} 
                onImageUpdate={handleImageUpdate}
             />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;