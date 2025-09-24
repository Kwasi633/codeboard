# CodeBoard TODO Tasks

## 🚨 Critical Issues to Fix

### ✅ Task 1: Fix Content Overlapping in Downloaded Images
- **Issue**: When images are downloaded from the codeboard, content overlaps the container or doesn't appear as initially pasted
- **Priority**: HIGH
- **Status**: ✅ COMPLETED ✅
- **Solution Implemented**: 
  - ✅ Fixed canvas sizing calculations to properly account for all content
  - ✅ Added proper padding and margin calculations (60px padding, improved spacing)
  - ✅ Implemented dynamic canvas sizing based on actual content dimensions
  - ✅ Added better text measurement and line wrapping (24px line height, 8.4px char width)
  - ✅ Enhanced window shadows and styling for better visual quality
  - ✅ Improved minimum dimensions to prevent tiny exports

### ✅ Task 2: Implement Syntax Highlighting & Color Coding
- **Issue**: Content does not change color - no color coding for content even when language is changed
- **Priority**: HIGH  
- **Status**: ✅ COMPLETED ✅
- **Solution Implemented**:
  - ✅ Added Prism.js for syntax highlighting with @types/prismjs
  - ✅ Implemented language-specific token parsing for 14+ languages
  - ✅ Added color mapping for different token types (keywords, strings, comments, numbers, operators, functions, etc.)
  - ✅ Made syntax highlighting work for both preview and export
  - ✅ Created theme-aware highlighting that adapts to selected theme colors
  - ✅ Real-time syntax highlighting updates when language changes
  - ✅ Overlay system in preview for proper syntax highlighting display

### ✅ Task 3: Fix Text Cursor Alignment Issues
- **Issue**: When text content was pasted, it wasn't aligned properly and cursor didn't appear on the same row as content
- **Priority**: HIGH
- **Status**: ✅ COMPLETED ✅
- **Solution Implemented**:
  - ✅ Fixed overlay alignment between textarea and syntax highlighting display
  - ✅ Replaced Textarea component with native textarea to avoid styling conflicts
  - ✅ Added precise font and layout matching between input and display layers
  - ✅ Implemented scroll synchronization between textarea and background
  - ✅ Added CSS fixes for perfect text alignment
  - ✅ Disabled auto-features (spell check, auto-correct, etc.) for code editing

### ✅ Task 4: Fix Font Size Consistency Between Preview and Export
- **Issue**: When content is downloaded, the fontSize becomes smaller than initially pasted - interface should match pre and post download
- **Priority**: HIGH
- **Status**: ✅ COMPLETED ✅
- **Solution Implemented**:
  - ✅ Fixed canvas font scaling issues with retina displays
  - ✅ Ensured font size consistency between preview (14px) and export (14px)
  - ✅ Matched line height exactly between interface (24px) and canvas rendering
  - ✅ Updated all font rendering in canvas (main code, terminal, badges) to use consistent sizing
  - ✅ Removed unnecessary font scaling that was causing size discrepancies
  - ✅ Verified character width and spacing match between preview and export

## 🔧 Technical Implementation Details

### Canvas Export Fixes:
1. ✅ Dynamic canvas sizing based on content (minimum 700px width, scales with content)
2. ✅ Proper text measurement with monospace fonts (SF Mono, Monaco, Inconsolata)
3. ✅ Better padding and margin calculations (60px outer, 30px inner padding)
4. ✅ Support for long lines and proper wrapping
5. ✅ Enhanced shadow effects and visual styling
6. ✅ Language-aware file extensions in terminal prompt
7. ✅ Improved window chrome with better macOS dots and badges

### Syntax Highlighting Features:
1. ✅ Support for 14+ programming languages (JavaScript, TypeScript, Python, Java, C++, Go, Rust, PHP, Ruby, HTML, CSS, SQL, Shell, JSON)
2. ✅ Color-coded tokens (keywords, strings, comments, numbers, operators, functions, classes, properties, booleans)
3. ✅ Theme-aware highlighting colors (5 themes: Dracula, Nord, Monokai, One Dark, Tokyo Night)
4. ✅ Consistent highlighting between preview and export
5. ✅ Real-time highlighting updates
6. ✅ Recursive token parsing for nested syntax elements
7. ✅ Fallback handling for unsupported languages

### Files Created/Modified:
- ✅ `/lib/syntax-highlighter.ts` - Complete syntax highlighting system with font size parameter
- ✅ `/app/page.tsx` - Updated with highlighting integration, improved export, and font consistency fixes
- ✅ `/app/global.css` - Added CSS for text alignment and code editor styling
- ✅ `package.json` - Added prismjs and @types/prismjs dependencies

### Performance Optimizations:
- ✅ Efficient token parsing with caching
- ✅ Optimized canvas rendering
- ✅ Proper memory management for blob URLs
- ✅ Responsive highlighting updates

## 🎯 Future Enhancements (Optional)
- [ ] Add line numbers toggle
- [ ] Implement custom theme creation UI
- [ ] Add font family selection
- [ ] Add font size adjustment controls  
- [ ] Implement copy-to-clipboard for generated images
- [ ] Add more export formats (SVG, PDF)
- [ ] Add minimap for large code files
- [ ] Implement code folding for long files