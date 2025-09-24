// Syntax highlighting utility for CodeBoard
let Prism: any = null;
let isPrismLoaded = false;

// Simple regex-based syntax highlighting as fallback
const simpleHighlight = (code: string, language: string): HighlightedLine[] => {
  const lines = code.split('\n');
  const highlightedLines: HighlightedLine[] = [];

  // Simple patterns for basic syntax highlighting
  const patterns: { [key: string]: Array<{regex: RegExp, type: string}> } = {
    javascript: [
      { regex: /(\/\/.*$)/gm, type: 'comment' },
      { regex: /(\/\*[\s\S]*?\*\/)/g, type: 'comment' },
      { regex: /(['"])((?:(?!\1)[^\\]|\\.)*)(\1)/g, type: 'string' },
      { regex: /\b(function|var|let|const|if|else|for|while|return|class|extends|import|export|default|async|await|try|catch|throw|new|this|true|false|null|undefined)\b/g, type: 'keyword' },
      { regex: /\b\d+\.?\d*\b/g, type: 'number' },
      { regex: /[{}[\]()]/g, type: 'punctuation' },
      { regex: /[=+\-*/<>!&|]/g, type: 'operator' }
    ],
    typescript: [
      { regex: /(\/\/.*$)/gm, type: 'comment' },
      { regex: /(\/\*[\s\S]*?\*\/)/g, type: 'comment' },
      { regex: /(['"])((?:(?!\1)[^\\]|\\.)*)(\1)/g, type: 'string' },
      { regex: /\b(function|var|let|const|if|else|for|while|return|class|extends|implements|interface|type|enum|import|export|default|async|await|try|catch|throw|new|this|true|false|null|undefined|string|number|boolean|object|any|void|never)\b/g, type: 'keyword' },
      { regex: /\b\d+\.?\d*\b/g, type: 'number' },
      { regex: /[{}[\]()]/g, type: 'punctuation' },
      { regex: /[=+\-*/<>!&|]/g, type: 'operator' }
    ],
    python: [
      { regex: /(#.*$)/gm, type: 'comment' },
      { regex: /('''[\s\S]*?'''|"""[\s\S]*?""")/g, type: 'comment' },
      { regex: /(['"])((?:(?!\1)[^\\]|\\.)*)(\1)/g, type: 'string' },
      { regex: /\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|with|lambda|and|or|not|in|is|True|False|None|pass|break|continue|global|nonlocal|yield|async|await)\b/g, type: 'keyword' },
      { regex: /\b\d+\.?\d*\b/g, type: 'number' },
      { regex: /[{}[\]()]/g, type: 'punctuation' },
      { regex: /[=+\-*/<>!]/g, type: 'operator' }
    ],
    java: [
      { regex: /(\/\/.*$)/gm, type: 'comment' },
      { regex: /(\/\*[\s\S]*?\*\/)/g, type: 'comment' },
      { regex: /(['"])((?:(?!\1)[^\\]|\\.)*)(\1)/g, type: 'string' },
      { regex: /\b(public|private|protected|static|final|abstract|class|interface|extends|implements|import|package|if|else|for|while|do|switch|case|default|return|try|catch|finally|throw|throws|new|this|super|true|false|null|void|int|long|short|byte|char|float|double|boolean|String)\b/g, type: 'keyword' },
      { regex: /\b\d+\.?\d*[lLfFdD]?\b/g, type: 'number' },
      { regex: /[{}[\]()]/g, type: 'punctuation' },
      { regex: /[=+\-*/<>!&|]/g, type: 'operator' }
    ]
  };

  lines.forEach(line => {
    const tokens: Token[] = [];
    const languagePatterns = patterns[language.toLowerCase()] || patterns.javascript;
    
    if (line.trim() === '') {
      tokens.push({ type: 'default', content: line, length: line.length });
    } else {
      let remaining = line;
      let processed = '';
      
      // Apply patterns in order
      while (remaining.length > 0) {
        let matched = false;
        
        for (const pattern of languagePatterns) {
          const match = remaining.match(pattern.regex);
          if (match && match.index === 0) {
            if (processed.length > 0) {
              tokens.push({ type: 'default', content: processed, length: processed.length });
              processed = '';
            }
            tokens.push({ type: pattern.type, content: match[0], length: match[0].length });
            remaining = remaining.slice(match[0].length);
            matched = true;
            break;
          }
        }
        
        if (!matched) {
          processed += remaining[0];
          remaining = remaining.slice(1);
        }
      }
      
      if (processed.length > 0) {
        tokens.push({ type: 'default', content: processed, length: processed.length });
      }
    }
    
    highlightedLines.push({ tokens, text: line });
  });

  return highlightedLines;
};

// Dynamic import for client-side only
const loadPrism = async () => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  if (isPrismLoaded && Prism) {
    return Prism;
  }

  try {
    // Load Prism core
    const PrismCore = await import('prismjs');
    Prism = PrismCore.default || PrismCore;
    
    // Try to load language components individually
    try { await import('prismjs/components/prism-javascript' as any); } catch {}
    try { await import('prismjs/components/prism-typescript' as any); } catch {}
    try { await import('prismjs/components/prism-python' as any); } catch {}
    try { await import('prismjs/components/prism-java' as any); } catch {}
    try { await import('prismjs/components/prism-cpp' as any); } catch {}
    try { await import('prismjs/components/prism-go' as any); } catch {}
    try { await import('prismjs/components/prism-rust' as any); } catch {}
    try { await import('prismjs/components/prism-php' as any); } catch {}
    try { await import('prismjs/components/prism-ruby' as any); } catch {}
    try { await import('prismjs/components/prism-css' as any); } catch {}
    try { await import('prismjs/components/prism-sql' as any); } catch {}
    try { await import('prismjs/components/prism-bash' as any); } catch {}
    try { await import('prismjs/components/prism-json' as any); } catch {}
    try { await import('prismjs/components/prism-markup' as any); } catch {}
    
    isPrismLoaded = true;
    console.log('Prism languages available:', Object.keys(Prism.languages));
    
    return Prism;
  } catch (error) {
    console.warn('Failed to load Prism.js, using simple highlighting:', error);
    return null;
  }
};

export interface Token {
  type: string;
  content: string;
  length: number;
}

export interface HighlightedLine {
  tokens: Token[];
  text: string;
}

// Language mapping for Prism.js
const languageMap: { [key: string]: string } = {
  'JavaScript': 'javascript',
  'TypeScript': 'typescript',
  'Python': 'python',
  'Java': 'java',
  'C++': 'cpp',
  'Go': 'go',
  'Rust': 'rust',
  'PHP': 'php',
  'Ruby': 'ruby',
  'HTML': 'markup',
  'CSS': 'css',
  'SQL': 'sql',
  'Shell': 'bash',
  'JSON': 'json',
};

// Color mapping for different token types based on theme
const getTokenColors = (themeName: string) => {
  const colorSchemes: { [theme: string]: { [tokenType: string]: string } } = {
    'Dracula': {
      'keyword': '#ff79c6',
      'string': '#f1fa8c',
      'comment': '#6272a4',
      'number': '#bd93f9',
      'operator': '#ff79c6',
      'punctuation': '#f8f8f2',
      'function': '#50fa7b',
      'variable': '#f8f8f2',
      'class-name': '#8be9fd',
      'property': '#50fa7b',
      'boolean': '#bd93f9',
      'default': '#f8f8f2'
    },
    'Nord': {
      'keyword': '#81a1c1',
      'string': '#a3be8c',
      'comment': '#616e88',
      'number': '#b48ead',
      'operator': '#81a1c1',
      'punctuation': '#d8dee9',
      'function': '#88c0d0',
      'variable': '#d8dee9',
      'class-name': '#8fbcbb',
      'property': '#88c0d0',
      'boolean': '#b48ead',
      'default': '#d8dee9'
    },
    'Monokai': {
      'keyword': '#f92672',
      'string': '#e6db74',
      'comment': '#75715e',
      'number': '#ae81ff',
      'operator': '#f92672',
      'punctuation': '#f8f8f2',
      'function': '#a6e22e',
      'variable': '#f8f8f2',
      'class-name': '#a6e22e',
      'property': '#a6e22e',
      'boolean': '#ae81ff',
      'default': '#f8f8f2'
    },
    'One Dark': {
      'keyword': '#c678dd',
      'string': '#98c379',
      'comment': '#5c6370',
      'number': '#d19a66',
      'operator': '#56b6c2',
      'punctuation': '#abb2bf',
      'function': '#61afef',
      'variable': '#e06c75',
      'class-name': '#e5c07b',
      'property': '#e06c75',
      'boolean': '#d19a66',
      'default': '#abb2bf'
    },
    'Tokyo Night': {
      'keyword': '#bb9af7',
      'string': '#9ece6a',
      'comment': '#565f89',
      'number': '#ff9e64',
      'operator': '#89ddff',
      'punctuation': '#a9b1d6',
      'function': '#7aa2f7',
      'variable': '#a9b1d6',
      'class-name': '#2ac3de',
      'property': '#7aa2f7',
      'boolean': '#ff9e64',
      'default': '#a9b1d6'
    }
  };

  return colorSchemes[themeName] || colorSchemes['Dracula'];
};

// Parse tokens recursively
const parseTokens = (tokens: (string | Prism.Token)[]): Token[] => {
  const result: Token[] = [];

  for (const token of tokens) {
    if (typeof token === 'string') {
      result.push({
        type: 'default',
        content: token,
        length: token.length
      });
    } else {
      const tokenType = Array.isArray(token.type) ? token.type[0] : token.type;
      if (Array.isArray(token.content)) {
        // Recursively parse nested tokens
        const nestedTokens = parseTokens(token.content);
        result.push(...nestedTokens.map(t => ({
          ...t,
          type: t.type === 'default' ? tokenType : t.type
        })));
      } else if (typeof token.content === 'string') {
        result.push({
          type: tokenType,
          content: token.content,
          length: token.content.length
        });
      }
    }
  }

  return result;
};

// Synchronous fallback function for plain text
export const highlightCodeSync = (code: string, language: string): HighlightedLine[] => {
  return code.split('\n').map(line => ({
    tokens: [{ type: 'default', content: line, length: line.length }],
    text: line
  }));
};

// Main highlighting function
export const highlightCode = async (code: string, language: string): Promise<HighlightedLine[]> => {
  // Try to load Prism on client-side
  const PrismInstance = await loadPrism();
  
  if (!PrismInstance) {
    console.log(`Prism not loaded, using simple highlighting for ${language}`);
    return simpleHighlight(code, language);
  }

  const prismLanguage = languageMap[language] || 'javascript';
  const grammar = PrismInstance.languages[prismLanguage];
  
  console.log(`Highlighting for language: ${language} -> ${prismLanguage}`);
  console.log(`Grammar available:`, !!grammar);
  console.log(`Available languages:`, Object.keys(PrismInstance.languages));
  
  if (!grammar) {
    console.log(`No grammar found for language: ${prismLanguage}, using simple highlighting`);
    return simpleHighlight(code, language);
  }

  const lines = code.split('\n');
  const highlightedLines: HighlightedLine[] = [];

  for (const line of lines) {
    if (line.trim() === '') {
      highlightedLines.push({
        tokens: [{ type: 'default', content: line, length: line.length }],
        text: line
      });
      continue;
    }

    try {
      const tokens = PrismInstance.tokenize(line, grammar);
      const parsedTokens = parseTokens(tokens);
      
      highlightedLines.push({
        tokens: parsedTokens,
        text: line
      });
    } catch (error) {
      // Fallback to simple highlighting
      console.log(`Error with Prism for line "${line}", using simple highlighting`);
      const simpleLine = simpleHighlight(line, language);
      highlightedLines.push(simpleLine[0] || {
        tokens: [{ type: 'default', content: line, length: line.length }],
        text: line
      });
    }
  }

  return highlightedLines;
};

// Get color for token type and theme
export const getTokenColor = (tokenType: string, themeName: string): string => {
  const colors = getTokenColors(themeName);
  return colors[tokenType] || colors.default;
};

// Render highlighted code to canvas
export const renderHighlightedCode = (
  ctx: CanvasRenderingContext2D,
  highlightedLines: HighlightedLine[],
  startX: number,
  startY: number,
  lineHeight: number,
  themeName: string,
  charWidth: number,
  fontSize?: number
) => {
  const colors = getTokenColors(themeName);
  
  // Ensure font is set correctly for rendering
  if (fontSize) {
    ctx.font = `${fontSize}px "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace`;
  }
  
  highlightedLines.forEach((line, lineIndex) => {
    let x = startX;
    const y = startY + (lineIndex + 1) * lineHeight;

    line.tokens.forEach((token) => {
      ctx.fillStyle = colors[token.type] || colors.default;
      ctx.fillText(token.content, x, y);
      x += token.content.length * charWidth;
    });
  });
};