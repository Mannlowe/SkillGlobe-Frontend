#!/usr/bin/env node

/**
 * Accessibility Button Fixer for SkillGlobe
 * 
 * Step-by-step tool to fix critical accessibility issues in buttons:
 * Priority 1: Missing focus states (23 buttons)
 * Priority 2: Missing ARIA labels (18 icon buttons) 
 * Priority 3: Improper semantic HTML (8 clickable divs)
 */

import fs from 'fs';
import path from 'path';

interface AccessibilityFix {
  file: string;
  line: number;
  issue: 'missing-focus' | 'missing-aria' | 'improper-semantic';
  before: string;
  after: string;
  description: string;
}

interface FixStats {
  filesScanned: number;
  issuesFound: number;
  issuesFixed: number;
  fixesByType: Record<string, number>;
  errors: Array<{ file: string; error: string }>;
}

class AccessibilityButtonFixer {
  private stats: FixStats = {
    filesScanned: 0,
    issuesFound: 0,
    issuesFixed: 0,
    fixesByType: {
      'missing-focus': 0,
      'missing-aria': 0,
      'improper-semantic': 0
    },
    errors: []
  };

  private fixes: AccessibilityFix[] = [];

  // Priority 1: Fix missing focus states
  private fixMissingFocusStates(content: string, filePath: string): string {
    const lines = content.split('\n');
    let modified = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Find button elements without focus styles
      if (line.includes('<button') && line.includes('className=')) {
        const classNameMatch = line.match(/className=["']([^"']*)["']/);
        if (classNameMatch) {
          const className = classNameMatch[1];
          
          // Check if focus styles are missing
          if (!className.includes('focus:')) {
            const newClassName = this.addFocusStyles(className);
            const newLine = line.replace(classNameMatch[0], `className="${newClassName}"`);
            
            this.fixes.push({
              file: filePath,
              line: i + 1,
              issue: 'missing-focus',
              before: line.trim(),
              after: newLine.trim(),
              description: 'Added focus ring for keyboard accessibility'
            });

            lines[i] = newLine;
            modified = true;
            this.stats.fixesByType['missing-focus']++;
          }
        }
      }
    }

    return modified ? lines.join('\n') : content;
  }

  private addFocusStyles(className: string): string {
    // Determine appropriate focus color based on existing styles
    let focusColor = 'orange-500'; // default
    
    if (className.includes('bg-blue-')) focusColor = 'blue-500';
    else if (className.includes('bg-red-')) focusColor = 'red-500';
    else if (className.includes('bg-green-')) focusColor = 'green-500';
    else if (className.includes('bg-gray-')) focusColor = 'gray-500';

    // Add focus styles if not present
    const focusStyles = `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${focusColor}`;
    
    return `${className} ${focusStyles}`;
  }

  // Priority 2: Fix missing ARIA labels on icon buttons
  private fixMissingAriaLabels(content: string, filePath: string): string {
    const lines = content.split('\n');
    let modified = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Find icon-only buttons without aria-label
      if (this.isIconOnlyButton(line) && !line.includes('aria-label=')) {
        const ariaLabel = this.generateAriaLabel(line, lines, i);
        const newLine = this.addAriaLabel(line, ariaLabel);
        
        this.fixes.push({
          file: filePath,
          line: i + 1,
          issue: 'missing-aria',
          before: line.trim(),
          after: newLine.trim(),
          description: `Added aria-label: "${ariaLabel}"`
        });

        lines[i] = newLine;
        modified = true;
        this.stats.fixesByType['missing-aria']++;
      }
    }

    return modified ? lines.join('\n') : content;
  }

  private isIconOnlyButton(line: string): boolean {
    // Heuristics to identify icon-only buttons
    return (
      line.includes('<button') &&
      (
        // Has icon class names or SVG elements
        /\b(w-\d+\s+h-\d+|Icon|svg|lucide)/i.test(line) ||
        // Button with minimal content that looks like an icon
        (/className=["'][^"']*p-\d+[^"']*["']/.test(line) && !/>[\w\s]{3,}</i.test(line))
      )
    );
  }

  private generateAriaLabel(line: string, lines: string[], lineIndex: number): string {
    // Context-based aria-label generation
    const context = this.getButtonContext(line, lines, lineIndex);
    
    // Common icon patterns and their labels
    const iconPatterns = [
      { pattern: /close|x|times/i, label: 'Close' },
      { pattern: /edit|pencil/i, label: 'Edit' },
      { pattern: /delete|trash|remove/i, label: 'Delete' },
      { pattern: /add|plus/i, label: 'Add' },
      { pattern: /search|magnify/i, label: 'Search' },
      { pattern: /menu|hamburger|bars/i, label: 'Menu' },
      { pattern: /settings|gear|cog/i, label: 'Settings' },
      { pattern: /info|information/i, label: 'Information' },
      { pattern: /download/i, label: 'Download' },
      { pattern: /upload/i, label: 'Upload' },
      { pattern: /save|floppy/i, label: 'Save' },
      { pattern: /share/i, label: 'Share' },
      { pattern: /copy/i, label: 'Copy' },
      { pattern: /expand|chevron-down/i, label: 'Expand' },
      { pattern: /collapse|chevron-up/i, label: 'Collapse' },
      { pattern: /next|arrow-right/i, label: 'Next' },
      { pattern: /prev|arrow-left/i, label: 'Previous' },
      { pattern: /home/i, label: 'Home' },
      { pattern: /back/i, label: 'Back' },
      { pattern: /refresh|reload/i, label: 'Refresh' }
    ];

    // Try to match icon patterns
    for (const { pattern, label } of iconPatterns) {
      if (pattern.test(line) || pattern.test(context)) {
        return label;
      }
    }

    // Fallback based on context
    if (context.includes('header')) return 'Menu';
    if (context.includes('modal') || context.includes('dialog')) return 'Close';
    if (context.includes('form')) return 'Submit';
    if (context.includes('card')) return 'Action';

    return 'Action button';
  }

  private getButtonContext(line: string, lines: string[], lineIndex: number): string {
    // Get surrounding context (3 lines before and after)
    const start = Math.max(0, lineIndex - 3);
    const end = Math.min(lines.length, lineIndex + 4);
    return lines.slice(start, end).join(' ').toLowerCase();
  }

  private addAriaLabel(line: string, ariaLabel: string): string {
    // Find the end of the opening button tag to insert aria-label
    const buttonTagEnd = line.indexOf('>');
    if (buttonTagEnd === -1) return line;

    const beforeClosing = line.substring(0, buttonTagEnd);
    const afterClosing = line.substring(buttonTagEnd);

    return `${beforeClosing} aria-label="${ariaLabel}"${afterClosing}`;
  }

  // Priority 3: Fix improper semantic HTML (clickable divs)
  private fixImproperSemanticHTML(content: string, filePath: string): string {
    const lines = content.split('\n');
    let modified = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Find clickable divs that should be buttons
      if (this.isClickableDiv(line)) {
        const newLine = this.convertToSemanticButton(line);
        
        this.fixes.push({
          file: filePath,
          line: i + 1,
          issue: 'improper-semantic',
          before: line.trim(),
          after: newLine.trim(),
          description: 'Converted clickable div to semantic button with proper role and tabIndex'
        });

        lines[i] = newLine;
        modified = true;
        this.stats.fixesByType['improper-semantic']++;
      }
    }

    return modified ? lines.join('\n') : content;
  }

  private isClickableDiv(line: string): boolean {
    return (
      line.includes('<div') &&
      line.includes('onClick') &&
      !line.includes('role="button"') &&
      !line.includes('role=\'button\'')
    );
  }

  private convertToSemanticButton(line: string): string {
    let newLine = line;

    // Add role="button" if not present
    if (!newLine.includes('role=')) {
      newLine = newLine.replace('<div', '<div role="button"');
    }

    // Add tabIndex="0" if not present
    if (!newLine.includes('tabIndex') && !newLine.includes('tabindex')) {
      newLine = newLine.replace('<div', '<div tabIndex="0"');
    }

    // Add keyboard event handler if not present
    if (!newLine.includes('onKeyDown')) {
      const onClickMatch = newLine.match(/onClick=\{([^}]+)\}/);
      if (onClickMatch) {
        const clickHandler = onClickMatch[1];
        const keyHandler = `onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ${clickHandler}; } }}`;
        newLine = newLine.replace(onClickMatch[0], `${onClickMatch[0]} ${keyHandler}`);
      }
    }

    return newLine;
  }

  // Main processing function
  processFile(filePath: string): boolean {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      let modifiedContent = content;
      let hasChanges = false;

      console.log(`\n📄 Processing: ${filePath}`);

      // Apply fixes in priority order
      const withFocusFixes = this.fixMissingFocusStates(modifiedContent, filePath);
      if (withFocusFixes !== modifiedContent) {
        modifiedContent = withFocusFixes;
        hasChanges = true;
      }

      const withAriaFixes = this.fixMissingAriaLabels(modifiedContent, filePath);
      if (withAriaFixes !== modifiedContent) {
        modifiedContent = withAriaFixes;
        hasChanges = true;
      }

      const withSemanticFixes = this.fixImproperSemanticHTML(modifiedContent, filePath);
      if (withSemanticFixes !== modifiedContent) {
        modifiedContent = withSemanticFixes;
        hasChanges = true;
      }

      if (hasChanges) {
        fs.writeFileSync(filePath, modifiedContent, 'utf-8');
        this.stats.issuesFixed += this.fixes.filter(f => f.file === filePath).length;
        console.log(`  ✅ Fixed ${this.fixes.filter(f => f.file === filePath).length} accessibility issues`);
      } else {
        console.log(`  ✓ No accessibility issues found`);
      }

      this.stats.filesScanned++;
      return hasChanges;

    } catch (error) {
      this.stats.errors.push({
        file: filePath,
        error: error instanceof Error ? error.message : String(error)
      });
      console.error(`  ❌ Error processing file:`, error);
      return false;
    }
  }

  scanDirectory(dir: string): void {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !this.shouldSkipDirectory(file)) {
        this.scanDirectory(fullPath);
      } else if (this.isReactFile(file)) {
        this.processFile(fullPath);
      }
    }
  }

  private shouldSkipDirectory(dirname: string): boolean {
    const skipDirs = ['node_modules', '.git', '.next', 'dist', 'build', 'coverage'];
    return skipDirs.includes(dirname);
  }

  private isReactFile(filename: string): boolean {
    return /\.(tsx|jsx)$/.test(filename);
  }

  generateReport(): string {
    const report = `# Accessibility Button Fixes Report

## Summary
- **Files Scanned**: ${this.stats.filesScanned}
- **Issues Found**: ${this.stats.issuesFound}
- **Issues Fixed**: ${this.stats.issuesFixed}
- **Errors**: ${this.stats.errors.length}

## Fixes by Type
- **Missing Focus States**: ${this.stats.fixesByType['missing-focus']} fixed
- **Missing ARIA Labels**: ${this.stats.fixesByType['missing-aria']} fixed  
- **Improper Semantic HTML**: ${this.stats.fixesByType['improper-semantic']} fixed

## Detailed Fixes Applied

${this.fixes.slice(0, 20).map((fix, index) => `
### Fix ${index + 1}: ${fix.file}:${fix.line}
**Issue**: ${fix.issue}
**Description**: ${fix.description}

**Before:**
\`\`\`tsx
${fix.before}
\`\`\`

**After:**
\`\`\`tsx
${fix.after}
\`\`\`
`).join('\n')}

${this.fixes.length > 20 ? `\n... and ${this.fixes.length - 20} more fixes` : ''}

${this.stats.errors.length > 0 ? `
## Errors Encountered
${this.stats.errors.map(error => `- **${error.file}**: ${error.error}`).join('\n')}
` : ''}

## Next Steps
1. **Test all fixed buttons** for proper keyboard navigation
2. **Screen reader testing** for ARIA label effectiveness  
3. **Visual testing** to ensure focus rings are visible
4. **Run accessibility audit** to verify 0 critical issues
5. **Update documentation** with accessibility standards

Generated on: ${new Date().toISOString()}
`;

    return report;
  }

  saveReport(outputPath: string): void {
    const report = this.generateReport();
    fs.writeFileSync(outputPath, report);
    console.log(`\n📊 Accessibility fixes report saved to: ${outputPath}`);
  }

  getStats(): FixStats {
    return this.stats;
  }

  getFixes(): AccessibilityFix[] {
    return this.fixes;
  }
}

// CLI usage
if (require.main === module) {
  const fixer = new AccessibilityButtonFixer();
  const srcPath = path.join(process.cwd(), 'components');
  
  console.log('🚀 Starting accessibility button fixes...');
  console.log('📋 Priority fixes:');
  console.log('  1. Missing focus states (23 buttons expected)');
  console.log('  2. Missing ARIA labels (18 icon buttons expected)');
  console.log('  3. Improper semantic HTML (8 clickable divs expected)');
  console.log(`\n📁 Scanning directory: ${srcPath}`);
  
  fixer.scanDirectory(srcPath);
  
  const reportPath = path.join(process.cwd(), 'accessibility-fixes-report.md');
  fixer.saveReport(reportPath);
  
  const stats = fixer.getStats();
  console.log(`\n🎉 Accessibility Fixes Complete!`);
  console.log(`📁 Files scanned: ${stats.filesScanned}`);
  console.log(`🔧 Issues fixed: ${stats.issuesFixed}`);
  console.log(`  - Focus states: ${stats.fixesByType['missing-focus']}`);
  console.log(`  - ARIA labels: ${stats.fixesByType['missing-aria']}`);
  console.log(`  - Semantic HTML: ${stats.fixesByType['improper-semantic']}`);
  console.log(`❌ Errors: ${stats.errors.length}`);
  
  if (stats.issuesFixed > 0) {
    console.log(`\n📝 Next steps:`);
    console.log(`1. Test keyboard navigation on all fixed buttons`);
    console.log(`2. Use screen reader to verify ARIA labels`);
    console.log(`3. Visual check of focus indicators`);
    console.log(`4. Run button audit tool to verify improvements`);
  }
}

export { AccessibilityButtonFixer };