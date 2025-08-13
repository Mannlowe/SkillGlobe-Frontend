#!/usr/bin/env node

/**
 * Button Consistency Audit Tool for SkillGlobe
 * 
 * This tool scans all TypeScript/TSX files and analyzes button implementations
 * for consistency issues in styling, accessibility, and best practices.
 */

import fs from 'fs';
import path from 'path';

interface ButtonIssue {
  file: string;
  line: number;
  issue: string;
  severity: 'error' | 'warning' | 'info';
  currentCode: string;
  suggestedFix?: string;
}

interface ButtonAnalysis {
  totalButtons: number;
  inconsistencies: ButtonIssue[];
  variants: Record<string, number>;
  sizes: Record<string, number>;
  colors: Record<string, number>;
  accessibility: {
    missingFocusStates: number;
    missingAriaLabels: number;
    improperRoles: number;
  };
}

class ButtonAuditor {
  private analysis: ButtonAnalysis = {
    totalButtons: 0,
    inconsistencies: [],
    variants: {},
    sizes: {},
    colors: {},
    accessibility: {
      missingFocusStates: 0,
      missingAriaLabels: 0,
      improperRoles: 0
    }
  };

  private buttonPatterns = {
    // HTML button elements
    htmlButton: /<button[\s\S]*?<\/button>/g,
    
    // Elements with role="button"
    roleButton: /\brole=["']button["']/g,
    
    // Common button class patterns
    buttonClasses: /className=["'][^"']*(?:button|btn)[^"']*["']/g,
    
    // Click handlers (potential buttons)
    clickHandlers: /onClick=\{[^}]*\}/g
  };

  private stylingPatterns = {
    // Border radius patterns
    borderRadius: /(rounded-(?:none|sm|md|lg|xl|2xl|3xl|full))/g,
    
    // Background colors
    backgroundColors: /(bg-(?:gray|blue|green|red|yellow|orange|purple|pink|indigo)-\d+)/g,
    
    // Padding patterns
    padding: /(p[xy]?-\d+)/g,
    
    // Height patterns
    height: /(h-\d+)/g,
    
    // Width patterns  
    width: /(w-\d+|w-full|w-auto)/g,
    
    // Font weight
    fontWeight: /(font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black))/g,
    
    // Hover states
    hoverStates: /(hover:[^"\s]+)/g,
    
    // Focus states
    focusStates: /(focus:[^"\s]+)/g
  };

  private accessibilityChecks = {
    ariaLabel: /aria-label=["'][^"']*["']/g,
    ariaDescribedBy: /aria-describedby=["'][^"']*["']/g,
    focusOutline: /focus:outline-none/g,
    focusRing: /focus:ring-\d+/g,
    disabled: /disabled=\{[^}]*\}/g
  };

  scanDirectory(dir: string): void {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !this.shouldSkipDirectory(file)) {
        this.scanDirectory(fullPath);
      } else if (this.isReactFile(file)) {
        this.analyzeFile(fullPath);
      }
    }
  }

  private shouldSkipDirectory(dirname: string): boolean {
    const skipDirs = ['node_modules', '.git', '.next', 'dist', 'build'];
    return skipDirs.includes(dirname);
  }

  private isReactFile(filename: string): boolean {
    return /\.(tsx|ts|jsx|js)$/.test(filename);
  }

  private analyzeFile(filePath: string): void {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // Find all button-like elements
    const buttons = this.findButtons(content);
    
    buttons.forEach(button => {
      this.analysis.totalButtons++;
      this.analyzeButton(button, filePath, lines);
    });
  }

  private findButtons(content: string): Array<{ code: string; line: number }> {
    const buttons: Array<{ code: string; line: number }> = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Check for button elements
      if (line.includes('<button') || line.includes('role="button"') || line.includes("role='button'")) {
        buttons.push({ code: line.trim(), line: index + 1 });
      }
      
      // Check for clickable divs/spans with onClick
      if ((line.includes('<div') || line.includes('<span')) && line.includes('onClick')) {
        buttons.push({ code: line.trim(), line: index + 1 });
      }
    });
    
    return buttons;
  }

  private analyzeButton(button: { code: string; line: number }, filePath: string, lines: string[]): void {
    const { code, line } = button;
    
    // Check for styling inconsistencies
    this.checkStylingConsistency(code, filePath, line);
    
    // Check accessibility issues
    this.checkAccessibility(code, filePath, line);
    
    // Extract and categorize styling patterns
    this.extractStylingPatterns(code);
  }

  private checkStylingConsistency(code: string, filePath: string, line: number): void {
    const issues: ButtonIssue[] = [];
    
    // Check for inline styles vs className inconsistencies
    if (code.includes('style=') && code.includes('className=')) {
      issues.push({
        file: filePath,
        line,
        issue: 'Mixed inline styles and className usage',
        severity: 'warning',
        currentCode: code,
        suggestedFix: 'Use only className for consistency'
      });
    }
    
    // Check for missing hover states
    if (code.includes('className=') && !code.includes('hover:')) {
      issues.push({
        file: filePath,
        line,
        issue: 'Missing hover state',
        severity: 'warning',
        currentCode: code,
        suggestedFix: 'Add hover state for better UX'
      });
    }
    
    // Check for inconsistent border radius
    const borderRadiusMatch = code.match(this.stylingPatterns.borderRadius);
    if (borderRadiusMatch) {
      const radius = borderRadiusMatch[0];
      if (!['rounded-md', 'rounded-lg', 'rounded-xl'].includes(radius)) {
        issues.push({
          file: filePath,
          line,
          issue: `Non-standard border radius: ${radius}`,
          severity: 'info',
          currentCode: code,
          suggestedFix: 'Use rounded-md, rounded-lg, or rounded-xl for consistency'
        });
      }
    }
    
    // Check for hard-coded colors vs design system
    if (code.includes('bg-') && !code.includes('bg-gradient')) {
      const colorMatch = code.match(this.stylingPatterns.backgroundColors);
      if (colorMatch) {
        const color = colorMatch[0];
        if (!this.isDesignSystemColor(color)) {
          issues.push({
            file: filePath,
            line,
            issue: `Non-standard color: ${color}`,
            severity: 'info',
            currentCode: code,
            suggestedFix: 'Use design system colors (orange-500, blue-500, gray-100)'
          });
        }
      }
    }
    
    // Check for inconsistent padding
    const paddingMatch = code.match(this.stylingPatterns.padding);
    if (paddingMatch && paddingMatch.length > 2) {
      issues.push({
        file: filePath,
        line,
        issue: 'Complex padding pattern',
        severity: 'info',
        currentCode: code,
        suggestedFix: 'Use standardized button sizes (sm, default, lg)'
      });
    }

    this.analysis.inconsistencies.push(...issues);
  }

  private checkAccessibility(code: string, filePath: string, line: number): void {
    const issues: ButtonIssue[] = [];
    
    // Check for missing focus states
    if (!code.match(this.accessibilityChecks.focusRing) && !code.includes('focus:')) {
      issues.push({
        file: filePath,
        line,
        issue: 'Missing focus state for accessibility',
        severity: 'error',
        currentCode: code,
        suggestedFix: 'Add focus:ring-2 focus:ring-offset-2 focus:ring-primary'
      });
      this.analysis.accessibility.missingFocusStates++;
    }
    
    // Check for focus:outline-none without replacement
    if (code.includes('focus:outline-none') && !code.includes('focus:ring')) {
      issues.push({
        file: filePath,
        line,
        issue: 'Removed focus outline without alternative',
        severity: 'error',
        currentCode: code,
        suggestedFix: 'Add focus:ring styles when removing outline'
      });
    }
    
    // Check for missing aria-label on icon-only buttons
    if (this.isIconOnlyButton(code) && !code.match(this.accessibilityChecks.ariaLabel)) {
      issues.push({
        file: filePath,
        line,
        issue: 'Icon-only button missing aria-label',
        severity: 'error',
        currentCode: code,
        suggestedFix: 'Add aria-label to describe button action'
      });
      this.analysis.accessibility.missingAriaLabels++;
    }
    
    // Check for clickable divs without proper role
    if (code.includes('<div') && code.includes('onClick') && !code.includes('role="button"')) {
      issues.push({
        file: filePath,
        line,
        issue: 'Clickable div missing role="button"',
        severity: 'error',
        currentCode: code,
        suggestedFix: 'Add role="button" and tabIndex="0" for accessibility'
      });
      this.analysis.accessibility.improperRoles++;
    }

    this.analysis.inconsistencies.push(...issues);
  }

  private extractStylingPatterns(code: string): void {
    // Extract border radius variants
    const borderRadius = code.match(this.stylingPatterns.borderRadius);
    if (borderRadius) {
      borderRadius.forEach(radius => {
        this.analysis.variants[radius] = (this.analysis.variants[radius] || 0) + 1;
      });
    }
    
    // Extract height patterns
    const heights = code.match(this.stylingPatterns.height);
    if (heights) {
      heights.forEach(height => {
        this.analysis.sizes[height] = (this.analysis.sizes[height] || 0) + 1;
      });
    }
    
    // Extract color patterns
    const colors = code.match(this.stylingPatterns.backgroundColors);
    if (colors) {
      colors.forEach(color => {
        this.analysis.colors[color] = (this.analysis.colors[color] || 0) + 1;
      });
    }
  }

  private isDesignSystemColor(color: string): boolean {
    const allowedColors = [
      'bg-orange-500', 'bg-blue-500', 'bg-gray-100', 'bg-gray-200',
      'bg-red-500', 'bg-green-500', 'bg-white'
    ];
    return allowedColors.includes(color);
  }

  private isIconOnlyButton(code: string): boolean {
    // Simple heuristic: if it contains icon classes but minimal text content
    return (code.includes('w-') && code.includes('h-') && 
            (code.includes('Icon') || code.includes('svg'))) ||
           (code.includes('p-2') && !code.includes('>'));
  }

  generateReport(): string {
    const report = `
# SkillGlobe Button Consistency Audit Report

## Summary
- **Total Buttons Found**: ${this.analysis.totalButtons}
- **Total Issues**: ${this.analysis.inconsistencies.length}
- **Critical Issues**: ${this.analysis.inconsistencies.filter(i => i.severity === 'error').length}
- **Warnings**: ${this.analysis.inconsistencies.filter(i => i.severity === 'warning').length}
- **Info/Suggestions**: ${this.analysis.inconsistencies.filter(i => i.severity === 'info').length}

## Accessibility Issues
- **Missing Focus States**: ${this.analysis.accessibility.missingFocusStates}
- **Missing ARIA Labels**: ${this.analysis.accessibility.missingAriaLabels}  
- **Improper Roles**: ${this.analysis.accessibility.improperRoles}

## Styling Patterns Found

### Border Radius Usage
${Object.entries(this.analysis.variants)
  .sort(([,a], [,b]) => b - a)
  .map(([variant, count]) => `- ${variant}: ${count} occurrences`)
  .join('\n')}

### Button Heights
${Object.entries(this.analysis.sizes)
  .sort(([,a], [,b]) => b - a)
  .map(([size, count]) => `- ${size}: ${count} occurrences`)
  .join('\n')}

### Color Usage
${Object.entries(this.analysis.colors)
  .sort(([,a], [,b]) => b - a)
  .map(([color, count]) => `- ${color}: ${count} occurrences`)
  .join('\n')}

## Critical Issues Requiring Immediate Attention

${this.analysis.inconsistencies
  .filter(issue => issue.severity === 'error')
  .slice(0, 10)
  .map(issue => `
### ${issue.file}:${issue.line}
**Issue**: ${issue.issue}
**Code**: \`${issue.currentCode}\`
**Fix**: ${issue.suggestedFix}
`).join('\n')}

## Recommendations

1. **Implement StandardizedButton Component**: Replace inline button styles with the standardized component
2. **Fix Accessibility Issues**: Priority focus on missing focus states and ARIA labels
3. **Standardize Border Radius**: Migrate to rounded-lg for consistency
4. **Color System**: Use design system colors consistently
5. **Focus Management**: Ensure all interactive elements have proper focus indicators

## Migration Strategy

1. **Phase 1**: Fix critical accessibility issues (${this.analysis.inconsistencies.filter(i => i.severity === 'error').length} items)
2. **Phase 2**: Replace most common inconsistent patterns
3. **Phase 3**: Migrate all buttons to StandardizedButton component
4. **Phase 4**: Remove deprecated button classes and patterns

Generated on: ${new Date().toISOString()}
`;

    return report;
  }

  saveReport(outputPath: string): void {
    const report = this.generateReport();
    fs.writeFileSync(outputPath, report);
    console.log(`Button audit report saved to: ${outputPath}`);
  }

  getAnalysis(): ButtonAnalysis {
    return this.analysis;
  }
}

// CLI usage
if (require.main === module) {
  const auditor = new ButtonAuditor();
  const srcPath = path.join(process.cwd(), 'components');
  
  console.log('Starting button consistency audit...');
  auditor.scanDirectory(srcPath);
  
  const reportPath = path.join(process.cwd(), 'button-audit-report.md');
  auditor.saveReport(reportPath);
  
  const analysis = auditor.getAnalysis();
  console.log(`\nAudit Complete!`);
  console.log(`- Found ${analysis.totalButtons} buttons`);
  console.log(`- Identified ${analysis.inconsistencies.length} issues`);
  console.log(`- Critical issues: ${analysis.inconsistencies.filter(i => i.severity === 'error').length}`);
}

export { ButtonAuditor };