"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Copy, Settings, Globe, Palette, Upload, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { highlightCode, highlightCodeSync, renderHighlightedCode, getTokenColor, type HighlightedLine } from '@/lib/syntax-highlighter';

const themes = [
  { name: 'Dracula', bg: '#282a36', text: '#f8f8f2' },
  { name: 'Nord', bg: '#2e3440', text: '#d8dee9' },
  { name: 'Monokai', bg: '#272822', text: '#f8f8f2' },
  { name: 'One Dark', bg: '#1e1e1e', text: '#abb2bf' },
  { name: 'Tokyo Night', bg: '#1a1b26', text: '#a9b1d6' },
];

const languages = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'PHP', 'Ruby', 'HTML', 'CSS', 'SQL', 'Shell', 'JSON'
];

const windowStyles = [
  { name: 'macOS', dots: true },
  { name: 'Windows', dots: false },
  { name: 'Terminal', dots: null, terminal: true },
  { name: 'None', dots: null },
];

// Helper function to get file extension for languages
const getFileExtension = (language: string): string => {
  const extensions: { [key: string]: string } = {
    'JavaScript': 'js',
    'TypeScript': 'ts',
    'Python': 'py',
    'Java': 'java',
    'C++': 'cpp',
    'Go': 'go',
    'Rust': 'rs',
    'PHP': 'php',
    'Ruby': 'rb',
    'HTML': 'html',
    'CSS': 'css',
    'SQL': 'sql',
    'Shell': 'sh',
    'JSON': 'json'
  };
  return extensions[language] || 'txt';
};

export default function CodeBoard() {
  const [code, setCode] = useState(`function generateBeautifulCode() {
  const magic = ['creativity', 'innovation', 'elegance'];
  
  return magic.map(element => ({
    type: element,
    power: Math.random() * 100,
    impact: 'extraordinary'
  })).filter(item => item.power > 50);
}`);
  
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const [selectedWindow, setSelectedWindow] = useState(windowStyles[0]);
  const [isExporting, setIsExporting] = useState(false);
  const [highlightedLines, setHighlightedLines] = useState<HighlightedLine[]>([]);
  const [isClient, setIsClient] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Get highlighted lines for current code and language
      const highlighted = await highlightCode(code, selectedLanguage);
      
      // Set canvas dimensions for high quality export
      const scale = 2; // For retina quality
      const padding = 60;
      const windowPadding = selectedWindow.dots !== null ? 50 : 20;
      const terminalPadding = selectedWindow.terminal ? 30 : 0;
      const codePadding = 30;
      
      // Font settings that match the interface exactly
      const baseFontSize = 14; // Same as interface  
      const baseLineHeight = 24; // Same as interface (1.5rem = 24px)
      
      // Calculate text dimensions more accurately
      ctx.font = `${baseFontSize}px "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace`;
      const lines = code.split('\n');
      const lineHeight = baseLineHeight; // Use base line height
      const charWidth = 8.4;
      
      // Calculate actual content dimensions
      const maxLineLength = Math.max(...lines.map(line => line.length), 20); // Minimum width
      const contentWidth = Math.max(700, maxLineLength * charWidth + codePadding * 2);
      const contentHeight = Math.max(200, lines.length * lineHeight + codePadding * 2);
      
      const totalWidth = contentWidth + padding * 2;
      const totalHeight = contentHeight + padding * 2 + windowPadding + terminalPadding;
      
      canvas.width = totalWidth * scale;
      canvas.height = totalHeight * scale;
      
      ctx.scale(scale, scale);
      
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, totalWidth, totalHeight);
      gradient.addColorStop(0, '#f8fafc');
      gradient.addColorStop(0.5, '#e2e8f0');
      gradient.addColorStop(1, '#cbd5e1');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, totalWidth, totalHeight);
      
      // Window background with shadow
      const windowX = padding;
      const windowY = padding;
      const windowWidth = contentWidth;
      const windowHeight = contentHeight + windowPadding + terminalPadding;
      
      // Enhanced window shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 15;
      
      ctx.fillStyle = selectedTheme.bg;
      ctx.roundRect(windowX, windowY, windowWidth, windowHeight, 16);
      ctx.fill();
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      let codeStartY = windowY + codePadding;
      
      // Window chrome
      if (selectedWindow.dots !== null) {
        // Title bar with better styling
        const titleBarHeight = 44;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.roundRect(windowX, windowY, windowWidth, titleBarHeight, [16, 16, 0, 0]);
        ctx.fill();
        
        // Add subtle separator line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(windowX, windowY + titleBarHeight);
        ctx.lineTo(windowX + windowWidth, windowY + titleBarHeight);
        ctx.stroke();
        
        if (selectedWindow.dots) {
          // macOS dots with better positioning
          const dotY = windowY + titleBarHeight / 2;
          const colors = ['#ff5f57', '#ffbd2e', '#28ca42'];
          colors.forEach((color, i) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(windowX + 22 + i * 20, dotY, 6.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Add subtle highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(windowX + 22 + i * 20, dotY - 1, 2, 0, Math.PI * 2);
            ctx.fill();
          });
        }
        
        // Language badge with better styling
        const badgeWidth = 80;
        const badgeHeight = 20;
        const badgeX = windowX + windowWidth - badgeWidth - 15;
        const badgeY = windowY + (titleBarHeight - badgeHeight) / 2;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 10);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = `bold 11px system-ui`;
        ctx.textAlign = 'center';
        ctx.fillText(selectedLanguage, badgeX + badgeWidth / 2, badgeY + 14);
        
        codeStartY = windowY + titleBarHeight + codePadding;
      }
      
      // Terminal header with improvements
      if (selectedWindow.terminal) {
        const terminalHeaderHeight = 28;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.roundRect(windowX, codeStartY - terminalHeaderHeight, windowWidth, terminalHeaderHeight, [0, 0, 0, 0]);
        ctx.fill();
        
        // Terminal prompt with better styling
        ctx.fillStyle = '#00ff88';
        ctx.font = `bold 12px "SF Mono", monospace`;
        ctx.textAlign = 'left';
        ctx.fillText('❯ ', windowX + 20, codeStartY - 8);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = `12px "SF Mono", monospace`;
        ctx.fillText(`cat ${selectedLanguage.toLowerCase()}_code.${getFileExtension(selectedLanguage)}`, windowX + 40, codeStartY - 8);
      }
      
      // Render syntax-highlighted code
      ctx.font = `${baseFontSize}px "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace`;
      ctx.textAlign = 'left';
      
      renderHighlightedCode(
        ctx,
        highlighted,
        windowX + codePadding,
        codeStartY,
        lineHeight,
        selectedTheme.name,
        charWidth,
        baseFontSize
      );
      
      // Download the image
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `codeboard-${selectedLanguage.toLowerCase()}-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        setIsExporting(false);
      }, 'image/png');
      
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Auto-detect language from file extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      const languageMap: { [key: string]: string } = {
        'js': 'JavaScript',
        'jsx': 'JavaScript',
        'ts': 'TypeScript',
        'tsx': 'TypeScript',
        'py': 'Python',
        'java': 'Java',
        'cpp': 'C++',
        'c': 'C++',
        'go': 'Go',
        'rs': 'Rust',
        'php': 'PHP',
        'rb': 'Ruby',
        'html': 'HTML',
        'css': 'CSS',
        'json': 'JavaScript',
        'xml': 'HTML',
        'sql': 'SQL',
        'sh': 'Shell',
        'bash': 'Shell',
        'zsh': 'Shell'
      };
      
      if (extension && languageMap[extension]) {
        setSelectedLanguage(languageMap[extension]);
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
      };
      reader.readAsText(file);
    }
  };

  // Update syntax highlighting when code or language changes
  useEffect(() => {
    if (!isClient) return;
    
    const updateHighlighting = async () => {
      try {
        const highlighted = await highlightCode(code, selectedLanguage);
        setHighlightedLines(highlighted);
      } catch (error) {
        console.warn('Failed to highlight code:', error);
        // Fallback to plain text
        const fallback = highlightCodeSync(code, selectedLanguage);
        setHighlightedLines(fallback);
      }
    };
    
    updateHighlighting();
  }, [code, selectedLanguage, isClient]);

  useEffect(() => {
    // Set client-side flag and add floating animation to particles
    setIsClient(true);
    
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
      (particle as HTMLElement).style.animationDelay = `${index * 0.5}s`;
    });
  }, []);
  
  // Initialize highlighting on first render
  useEffect(() => {
    if (isClient) {
      const initialHighlighted = highlightCodeSync(code, selectedLanguage);
      setHighlightedLines(initialHighlighted);
    }
  }, [isClient, code, selectedLanguage]);

  // Synchronize scroll position between textarea and background
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleScroll = () => {
      const backgrounds = document.querySelectorAll('.syntax-background');
      backgrounds.forEach(bg => {
        if (bg instanceof HTMLElement) {
          bg.scrollTop = textarea.scrollTop;
          bg.scrollLeft = textarea.scrollLeft;
        }
      });
    };

    textarea.addEventListener('scroll', handleScroll);
    return () => textarea.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-purple-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-200">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                CodeBoard
              </h1>
              <p className="text-sm text-gray-400">Professional Code Visualization</p>
            </div>
          </div>
          <Button variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-colors duration-200">
            <Copy className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto p-6">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/20 rounded-full backdrop-blur-sm border border-purple-500/30 mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-purple-200">Transform code into art</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
            codeboard
          </h1>
          
          <div className="space-y-2 max-w-2xl mx-auto">
            <p className="text-xl text-gray-300 leading-relaxed">
              Transform your source code into stunning visual masterpieces.
            </p>
            <p className="text-gray-400">
              Paste your code below, customize the appearance, and create professional screenshots in seconds.
            </p>
          </div>
        </div>

        {/* Editor Interface */}
        <Card className="bg-black/20 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-purple-400" />
              <Select value={selectedTheme.name} onValueChange={(value) => setSelectedTheme(themes.find(t => t.name === value) || themes[0])}>
                <SelectTrigger className="w-32 bg-black/20 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {themes.map((theme) => (
                    <SelectItem key={theme.name} value={theme.name} className="text-white hover:bg-gray-800">
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-32 bg-black/20 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang} className="text-white hover:bg-gray-800">
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-green-400" />
              <Select value={selectedWindow.name} onValueChange={(value) => setSelectedWindow(windowStyles.find(w => w.name === value) || windowStyles[0])}>
                <SelectTrigger className="w-32 bg-black/20 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {windowStyles.map((style) => (
                    <SelectItem key={style.name} value={style.name} className="text-white hover:bg-gray-800">
                      {style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 ml-auto">
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="outline" className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/20 transition-colors duration-200" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </span>
                </Button>
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.go,.rs,.php,.rb,.html,.css,.json,.xml,.sql,.sh,.bash,.zsh,.txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <Button 
                onClick={handleExport}
                disabled={isExporting}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
              >
                {isExporting ? (
                  <div className="animate-spin w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export
              </Button>
            </div>
          </div>

          {/* Code Preview */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-2xl shadow-inner">
            <div 
              className="relative rounded-xl overflow-hidden shadow-2xl transform hover:shadow-3xl transition-shadow duration-300"
              style={{ backgroundColor: selectedTheme.bg }}
            >
              {/* Window Chrome */}
              {(selectedWindow.dots !== null || selectedWindow.terminal) && (
                <div className="flex items-center px-4 py-3 bg-black/20 border-b border-white/10">
                  {selectedWindow.dots && (
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors cursor-pointer" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors cursor-pointer" />
                      <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors cursor-pointer" />
                    </div>
                  )}
                  {selectedWindow.terminal && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-400 font-mono text-xs">terminal</span>
                    </div>
                  )}
                  <div className="flex-1 text-center">
                    <Badge variant="secondary" className="bg-white/10 text-gray-300 text-xs">
                      {selectedLanguage}
                    </Badge>
                  </div>
                </div>
              )}
              
              {/* Terminal Prompt */}
              {selectedWindow.terminal && (
                <div className="px-6 py-2 bg-black/10 border-b border-white/5 font-mono text-sm">
                  <span className="text-green-400">$ </span>
                  <span className="text-gray-300">cat code.{selectedLanguage.toLowerCase()}</span>
                </div>
              )}
              
              {/* Code Content */}
              <div className="p-6 relative">
                <div className="relative min-h-[300px] code-editor-container">
                  {/* Syntax highlighted background */}
                  <div 
                    className="syntax-background absolute inset-0 font-mono text-sm whitespace-pre-wrap break-words pointer-events-none overflow-hidden"
                    style={{ 
                      lineHeight: '1.5rem',
                      fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                      fontSize: '14px',
                      padding: '0',
                      margin: '0'
                    }}
                  >
                    {highlightedLines.length > 0 && code.trim() ? (
                      highlightedLines.map((line, lineIndex) => (
                        <div key={lineIndex} style={{ minHeight: '1.5rem' }}>
                          {line.tokens.length > 0 ? (
                            line.tokens.map((token, tokenIndex) => (
                              <span 
                                key={tokenIndex}
                                style={{ 
                                  color: getTokenColor(token.type, selectedTheme.name),
                                }}
                              >
                                {token.content}
                              </span>
                            ))
                          ) : (
                            <span>&nbsp;</span>
                          )}
                        </div>
                      ))
                    ) : null}
                  </div>
                  
                  {/* Interactive textarea */}
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="absolute inset-0 w-full h-full bg-transparent resize-none font-mono text-sm caret-white"
                    style={{ 
                      lineHeight: '1.5rem',
                      fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                      fontSize: '14px',
                      color: highlightedLines.length > 0 && code.trim() ? 'transparent' : selectedTheme.text,
                      padding: '0',
                      margin: '0',
                      border: 'none',
                      outline: 'none',
                      boxShadow: 'none',
                      background: 'transparent',
                      minHeight: '300px',
                      zIndex: 10
                    }}
                    placeholder={highlightedLines.length === 0 || !code.trim() ? "Paste your code here or drag and drop a file..." : ""}
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                  />
                </div>
                
                <div className="absolute top-4 right-4 opacity-0 hover:opacity-100 transition-opacity duration-200 z-20">
                  <Button size="sm" variant="ghost" className="text-white/50 hover:text-white hover:bg-white/10">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              title: "Beautiful Themes",
              description: "Choose from carefully crafted color schemes",
              icon: Palette,
              color: "purple"
            },
            {
              title: "Multiple Languages",
              description: "Support for all major programming languages",
              icon: Globe,
              color: "blue"
            },
            {
              title: "High Quality Export",
              description: "Export in multiple formats with crisp quality",
              icon: Download,
              color: "green"
            }
          ].map((feature, index) => (
            <Card key={index} className="bg-black/20 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/5 transition-colors duration-300 group">
              <div className={`w-12 h-12 bg-${feature.color}-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 p-6 border-t border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            Made with ❤️ for developers who appreciate beautiful code
          </p>
        </div>
      </footer>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}