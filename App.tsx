import React, { useState } from 'react';
import { AppMode, DesignStyle, DESIGN_STYLES } from './types';
import { generateRedesign } from './services/geminiService';
import ComparisonSlider from './components/ComparisonSlider';
import StyleSelector from './components/StyleSelector';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.UPLOAD);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setMode(AppMode.DESIGN);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate Style Handler
  const handleStyleSelect = async (style: DesignStyle) => {
    if (!originalImage || isGenerating) return;

    setSelectedStyle(style);
    setIsGenerating(true);
    setGeneratedImage(null); // Reset generated image to show loading state if desired, or keep old one. 
    
    try {
      const result = await generateRedesign(originalImage, style.prompt);
      setGeneratedImage(result);
    } catch (error) {
      alert("Failed to generate design. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpdate = (newImage: string) => {
    setGeneratedImage(newImage);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-50">
      {/* Navbar */}
      <nav className="h-16 border-b border-slate-800 flex items-center px-6 bg-slate-900 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight">MakeMy<span className="text-indigo-500">Room</span></h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          {mode === AppMode.DESIGN && (
            <button 
              onClick={() => {
                setMode(AppMode.UPLOAD);
                setOriginalImage(null);
                setGeneratedImage(null);
                setSelectedStyle(null);
              }}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Start Over
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Visualization */}
        <div className={`flex-1 flex flex-col p-6 transition-all duration-500 overflow-y-auto ${mode === AppMode.DESIGN ? 'md:w-2/3 lg:w-3/4' : 'w-full'}`}>
          
          {mode === AppMode.UPLOAD && (
             <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-700 rounded-3xl bg-slate-900/50 hover:bg-slate-900 transition-all">
                <div className="max-w-md text-center">
                  <div className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-indigo-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold mb-3">Upload your room</h2>
                  <p className="text-slate-400 mb-8 text-lg">Take a photo of your current space and let AI reimagine it in seconds.</p>
                  
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
                 {isGenerating ? (
                   <div className="w-full h-[300px] md:h-[500px] bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-slate-800 animate-pulse">
                      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-indigo-400 font-medium">Reimagining your space...</p>
                   </div>
                 ) : generatedImage ? (
                   <ComparisonSlider 
                    originalImage={originalImage} 
                    generatedImage={generatedImage} 
                   />
                 ) : (
                  <div className="w-full h-[300px] md:h-[500px] relative rounded-xl overflow-hidden border border-slate-700 group">
                    <img src={originalImage} className="w-full h-full object-cover" alt="Original" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <p className="text-white/80 font-medium bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm">Select a style below to begin</p>
                    </div>
                  </div>
                 )}
              </div>

              {/* Styles Carousel */}
              <div className="flex-1 flex flex-col justify-end min-h-[150px]">
                <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-3 px-1">
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

        {/* Right Side: Chat (Only visible in Design mode on large screens, or via toggle on mobile - for simplicity, fixed sidebar on md+) */}
        {mode === AppMode.DESIGN && (
          <div className="hidden md:flex w-1/3 lg:w-1/4 h-full border-l border-slate-800 bg-slate-900">
             <ChatInterface 
                currentImageBase64={generatedImage || originalImage} 
                onImageUpdate={handleImageUpdate}
             />
          </div>
        )}
      </div>
      
      {/* Mobile Chat Drawer/Toggle could go here, for now relying on responsive layout above */}
    </div>
  );
};

export default App;