'use client';

import { checkContrast, validateColorTheme } from './colorContrast';

// Accessibility Testing Utilities for WCAG 2.1 AA Compliance

export interface AccessibilityIssue {
  element: HTMLElement;
  type: 'error' | 'warning' | 'info';
  rule: string;
  message: string;
  help?: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
}

export interface AccessibilityReport {
  passed: AccessibilityIssue[];
  failed: AccessibilityIssue[];
  warnings: AccessibilityIssue[];
  score: number;
  totalChecks: number;
}

/**
 * Comprehensive accessibility audit
 */
export async function auditAccessibility(container: HTMLElement = document.body): Promise<AccessibilityReport> {
  const issues: AccessibilityIssue[] = [];
  
  // Run all checks
  const checks = [
    checkImages,
    checkHeadings,
    checkLinks,
    checkButtons,
    checkForms,
    checkContrasts,
    checkLandmarks,
    checkKeyboardAccess,
    checkARIALabels,
    checkFocus,
    checkTables
  ];
  
  for (const check of checks) {
    const checkIssues = await check(container);
    issues.push(...checkIssues);
  }
  
  // Categorize issues
  const failed = issues.filter(issue => issue.type === 'error');
  const warnings = issues.filter(issue => issue.type === 'warning'); 
  const passed = issues.filter(issue => issue.type === 'info');
  
  // Calculate score (100 - (errors * 10 + warnings * 2))
  const score = Math.max(0, 100 - (failed.length * 10 + warnings.length * 2));
  
  return {
    passed,
    failed,
    warnings,
    score,
    totalChecks: issues.length
  };
}

/**
 * Check images for alt text
 */
async function checkImages(container: HTMLElement): Promise<AccessibilityIssue[]> {
  const issues: AccessibilityIssue[] = [];
  const images = container.querySelectorAll('img');
  
  images.forEach(img => {
    const alt = img.getAttribute('alt');
    const role = img.getAttribute('role');
    
    if (role === 'presentation' || role === 'none') {
      // Decorative images should have empty alt or role
      if (alt && alt.trim()) {
        issues.push({
          element: img,
          type: 'warning',
          rule: 'WCAG 1.1.1',
          message: 'Decorative image has non-empty alt text',
          help: 'Decorative images should have empty alt="" or role="presentation"',
          impact: 'minor'
        });
      }
    } else {
      // Content images must have meaningful alt text
      if (!alt) {
        issues.push({
          element: img,
          type: 'error',
          rule: 'WCAG 1.1.1',
          message: 'Image missing alt attribute',
          help: 'All images must have an alt attribute describing the image content',
          impact: 'critical'
        });
      } else if (!alt.trim()) {
        issues.push({
          element: img,
          type: 'warning',
          rule: 'WCAG 1.1.1',
          message: 'Image has empty alt text but may not be decorative',
          help: 'If image conveys information, provide descriptive alt text',
          impact: 'moderate'
        });
      }
    }
  });
  
  return issues;
}

/**
 * Check heading hierarchy
 */
async function checkHeadings(container: HTMLElement): Promise<AccessibilityIssue[]> {
  const issues: AccessibilityIssue[] = [];
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  let previousLevel = 0;
  let hasH1 = false;
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    
    if (level === 1) {
      hasH1 = true;
      if (index > 0) {
        issues.push({
          element: heading,
          type: 'warning',
          rule: 'WCAG 1.3.1',
          message: 'Multiple H1 elements found',
          help: 'Pages should typically have only one H1 element',
          impact: 'moderate'
        });
      }
    }
    
    // Check for skipped levels
    if (previousLevel > 0 && level > previousLevel + 1) {
      issues.push({
        element: heading,
        type: 'error',
        rule: 'WCAG 1.3.1',
        message: `Heading level skipped from H${previousLevel} to H${level}`,
        help: 'Heading levels should not skip (e.g., H2 should not jump to H4)',
        impact: 'serious'
      });
    }
    
    // Check for empty headings
    if (!heading.textContent?.trim()) {
      issues.push({
        element: heading,
        type: 'error',
        rule: 'WCAG 1.3.1',
        message: 'Empty heading element',
        help: 'Headings must contain text',
        impact: 'serious'
      });
    }
    
    previousLevel = level;
  });
  
  // Check for missing H1
  if (headings.length > 0 && !hasH1) {
    issues.push({
      element: container,
      type: 'warning',
      rule: 'WCAG 1.3.1',
      message: 'No H1 element found',
      help: 'Pages should have an H1 element for the main heading',
      impact: 'moderate'
    });
  }
  
  return issues;
}

/**
 * Check links for accessibility
 */
async function checkLinks(container: HTMLElement): Promise<AccessibilityIssue[]> {
  const issues: AccessibilityIssue[] = [];
  const links = container.querySelectorAll('a');
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    const text = link.textContent?.trim();
    const ariaLabel = link.getAttribute('aria-label');
    const title = link.getAttribute('title');
    
    // Check for missing href
    if (!href) {
      issues.push({
        element: link,
        type: 'warning',
        rule: 'WCAG 2.1.1',
        message: 'Link missing href attribute',
        help: 'Links should have href attributes for keyboard navigation',
        impact: 'moderate'
      });
    }
    
    // Check for accessible name
    if (!text && !ariaLabel && !title) {
      issues.push({
        element: link,
        type: 'error',
        rule: 'WCAG 2.4.4',
        message: 'Link has no accessible name',
        help: 'Links must have visible text, aria-label, or title',
        impact: 'critical'
      });
    }
    
    // Check for generic link text
    const genericTexts = ['click here', 'read more', 'more', 'link'];
    if (text && genericTexts.includes(text.toLowerCase())) {
      issues.push({
        element: link,
        type: 'warning',
        rule: 'WCAG 2.4.4',
        message: 'Link has generic text',
        help: 'Link text should be descriptive and meaningful out of context',
        impact: 'moderate'
      });
    }
    
    // Check external links
    if (href && (href.startsWith('http') && !href.includes(window.location.hostname))) {
      const hasIndicator = link.querySelector('[aria-label*="external"]') || 
                          ariaLabel?.includes('external') ||
                          title?.includes('external');
      
      if (!hasIndicator) {
        issues.push({
          element: link,
          type: 'warning',
          rule: 'WCAG 3.2.5',
          message: 'External link not indicated',
          help: 'External links should indicate they open in a new context',
          impact: 'minor'
        });
      }
    }
  });
  
  return issues;
}

/**
 * Check buttons for accessibility
 */
async function checkButtons(container: HTMLElement): Promise<AccessibilityIssue[]> {
  const issues: AccessibilityIssue[] = [];
  const buttons = container.querySelectorAll('button, [role="button"]');
  
  buttons.forEach(button => {
    const text = button.textContent?.trim();
    const ariaLabel = button.getAttribute('aria-label');
    const ariaLabelledby = button.getAttribute('aria-labelledby');
    
    // Check for accessible name
    if (!text && !ariaLabel && !ariaLabelledby) {
      issues.push({
        element: button,
        type: 'error',
        rule: 'WCAG 2.4.6',
        message: 'Button has no accessible name',
        help: 'Buttons must have visible text or aria-label',
        impact: 'critical'
      });
    }
    
    // Check disabled state
    const disabled = button.hasAttribute('disabled') || button.getAttribute('aria-disabled') === 'true';
    if (disabled && button.getAttribute('tabindex') !== '-1') {
      issues.push({
        element: button,
        type: 'warning',
        rule: 'WCAG 2.1.1',
        message: 'Disabled button may still be focusable',
        help: 'Disabled buttons should have tabindex="-1" or be properly disabled',
        impact: 'minor'
      });
    }
  });
  
  return issues;
}

/**
 * Check form accessibility
 */
async function checkForms(container: HTMLElement): Promise<AccessibilityIssue[]> {
  const issues: AccessibilityIssue[] = [];
  const inputs = container.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    const type = input.getAttribute('type');
    const id = input.getAttribute('id');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledby = input.getAttribute('aria-labelledby');
    const label = id ? container.querySelector(`label[for="${id}"]`) : null;
    
    // Check for labels
    if (!label && !ariaLabel && !ariaLabelledby) {
      issues.push({
        element: input,
        type: 'error',
        rule: 'WCAG 1.3.1',
        message: 'Form control missing label',
        help: 'All form controls must have associated labels',
        impact: 'critical'
      });
    }
    
    // Check required fields
    const required = input.hasAttribute('required') || input.getAttribute('aria-required') === 'true';
    if (required) {
      const requiredIndicator = label?.textContent?.includes('*') || 
                               ariaLabel?.includes('required') ||
                               input.getAttribute('aria-describedby');
      
      if (!requiredIndicator) {
        issues.push({
          element: input,
          type: 'warning',
          rule: 'WCAG 3.3.2',
          message: 'Required field not clearly indicated',
          help: 'Required fields should be clearly marked for all users',
          impact: 'moderate'
        });
      }
    }
    
    // Check error handling
    const invalid = input.getAttribute('aria-invalid') === 'true';
    if (invalid) {
      const errorDescription = input.getAttribute('aria-describedby');
      if (!errorDescription) {
        issues.push({
          element: input,
          type: 'error',
          rule: 'WCAG 3.3.1',
          message: 'Invalid field missing error description',
          help: 'Invalid fields must have error messages via aria-describedby',
          impact: 'serious'
        });
      }
    }
  });
  
  return issues;
}

/**
 * Check color contrast
 */
async function checkContrasts(container: HTMLElement): Promise<AccessibilityIssue[]> {
  const issues: AccessibilityIssue[] = [];
  
  // Get all text elements
  const textElements = container.querySelectorAll('*');
  
  textElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    const color = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;
    
    if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
      const fontSize = parseFloat(computedStyle.fontSize);
      const fontWeight = computedStyle.fontWeight;
      
      try {
        const contrast = checkContrast(
          rgbToHex(color),
          rgbToHex(backgroundColor),
          fontSize,
          parseInt(fontWeight) || 400
        );
        
        if (!contrast.passes) {
          issues.push({
            element: element as HTMLElement,
            type: 'error',
            rule: 'WCAG 1.4.3',
            message: `Insufficient color contrast (${contrast.ratio.toFixed(2)}:1)`,
            help: `Text needs at least ${fontSize >= 18 || parseInt(fontWeight) >= 700 ? '3:1' : '4.5:1'} contrast ratio`,
            impact: 'serious'
          });
        }
      } catch (e) {
        // Skip elements with complex color values
      }
    }
  });
  
  return issues;
}

/**
 * Check landmarks and page structure
 */
async function checkLandmarks(container: HTMLElement): Promise<AccessibilityIssue[]> {
  const issues: AccessibilityIssue[] = [];
  
  const main = container.querySelector('main, [role="main"]');
  if (!main) {
    issues.push({
      element: container,
      type: 'error',
      rule: 'WCAG 1.3.1',
      message: 'No main landmark found',
      help: 'Pages should have a main element or role="main"',
      impact: 'serious'
    });
  }
  
  const nav = container.querySelector('nav, [role="navigation"]');
  if (!nav) {
    issues.push({
      element: container,
      type: 'warning',
      rule: 'WCAG 1.3.1',
      message: 'No navigation landmark found',
      help: 'Pages should have navigation elements',
      impact: 'moderate'
    });
  }
  
  return issues;
}

/**
 * Check keyboard accessibility
 */
async function checkKeyboardAccess(container: HTMLElement): Promise<AccessibilityIssue[]> {
  const issues: AccessibilityIssue[] = [];
  
  const focusableElements = container.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="button"], [role="link"]'
  );
  
  focusableElements.forEach(element => {
    const tabindex = element.getAttribute('tabindex');
    
    // Check for positive tabindex (anti-pattern)
    if (tabindex && parseInt(tabindex) > 0) {
      issues.push({
        element: element as HTMLElement,
        type: 'warning',
        rule: 'WCAG 2.4.3',
        message: 'Positive tabindex found',
        help: 'Avoid positive tabindex values; use 0 or -1',
        impact: 'moderate'
      });
    }
    
    // Check clickable elements without keyboard support
    if (element.tagName === 'DIV' || element.tagName === 'SPAN') {
      const hasClickHandler = element.getAttribute('onclick') || 
                             element.addEventListener.length > 0;
      
      if (hasClickHandler && !element.getAttribute('role') && tabindex !== '0') {
        issues.push({
          element: element as HTMLElement,
          type: 'error',
          rule: 'WCAG 2.1.1',
          message: 'Clickable element not keyboard accessible',
          help: 'Add role="button" and tabindex="0" to clickable elements',
          impact: 'serious'
        });
      }
    }
  });
  
  return issues;
}

/**
 * Check ARIA labels and states
 */
async function checkARIALabels(container: HTMLElement): Promise<AccessibilityIssue[]> {
  const issues: AccessibilityIssue[] = [];
  
  const elementsWithARIA = container.querySelectorAll('[aria-labelledby], [aria-describedby]');
  
  elementsWithARIA.forEach(element => {
    const labelledby = element.getAttribute('aria-labelledby');
    const describedby = element.getAttribute('aria-describedby');
    
    // Check labelledby references
    if (labelledby) {
      const ids = labelledby.split(' ');
      ids.forEach(id => {
        if (!container.querySelector(`#${id}`)) {
          issues.push({
            element: element as HTMLElement,
            type: 'error',
            rule: 'WCAG 1.3.1',
            message: `aria-labelledby references non-existent element: ${id}`,
            help: 'Ensure all aria-labelledby IDs exist in the document',
            impact: 'serious'
          });
        }
      });
    }
    
    // Check describedby references
    if (describedby) {
      const ids = describedby.split(' ');
      ids.forEach(id => {
        if (!container.querySelector(`#${id}`)) {
          issues.push({
            element: element as HTMLElement,
            type: 'error',
            rule: 'WCAG 1.3.1',
            message: `aria-describedby references non-existent element: ${id}`,
            help: 'Ensure all aria-describedby IDs exist in the document',
            impact: 'serious'
          });
        }
      });
    }
  });
  
  return issues;
}

/**
 * Check focus management
 */
async function checkFocus(container: HTMLElement): Promise<AccessibilityIssue[]> {
  const issues: AccessibilityIssue[] = [];
  
  const focusableElements = container.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  focusableElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    
    // Check for removed focus indicators
    if (computedStyle.outline === 'none' || computedStyle.outline === '0') {
      const hasCustomFocus = computedStyle.boxShadow.includes('focus') ||
                            element.classList.toString().includes('focus');
      
      if (!hasCustomFocus) {
        issues.push({
          element: element as HTMLElement,
          type: 'warning',
          rule: 'WCAG 2.4.7',
          message: 'Focus indicator removed without replacement',
          help: 'Provide visible focus indicators for keyboard users',
          impact: 'moderate'
        });
      }
    }
  });
  
  return issues;
}

/**
 * Check table accessibility
 */
async function checkTables(container: HTMLElement): Promise<AccessibilityIssue[]> {
  const issues: AccessibilityIssue[] = [];
  const tables = container.querySelectorAll('table');
  
  tables.forEach(table => {
    const caption = table.querySelector('caption');
    const headers = table.querySelectorAll('th');
    
    // Check for caption
    if (!caption) {
      issues.push({
        element: table,
        type: 'warning',
        rule: 'WCAG 1.3.1',
        message: 'Table missing caption',
        help: 'Tables should have captions describing their content',
        impact: 'moderate'
      });
    }
    
    // Check headers
    if (headers.length === 0) {
      issues.push({
        element: table,
        type: 'error',
        rule: 'WCAG 1.3.1',
        message: 'Table missing header cells',
        help: 'Data tables must have header cells (th elements)',
        impact: 'serious'
      });
    } else {
      headers.forEach(header => {
        if (!header.getAttribute('scope')) {
          issues.push({
            element: header,
            type: 'warning',
            rule: 'WCAG 1.3.1',
            message: 'Table header missing scope attribute',
            help: 'Header cells should have scope="col" or scope="row"',
            impact: 'minor'
          });
        }
      });
    }
  });
  
  return issues;
}

/**
 * Helper function to convert RGB to hex
 */
function rgbToHex(rgb: string): string {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return '#000000';
  
  const [, r, g, b] = match;
  return '#' + [r, g, b].map(x => {
    const hex = parseInt(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Generate accessibility report
 */
export function generateAccessibilityReport(report: AccessibilityReport): string {
  let output = '# Accessibility Audit Report\n\n';
  
  output += `**Score: ${report.score}/100**\n`;
  output += `**Total Checks: ${report.totalChecks}**\n`;
  output += `**Errors: ${report.failed.length}**\n`;
  output += `**Warnings: ${report.warnings.length}**\n`;
  output += `**Passed: ${report.passed.length}**\n\n`;
  
  if (report.failed.length > 0) {
    output += '## Errors (Must Fix)\n\n';
    report.failed.forEach((issue, index) => {
      output += `### ${index + 1}. ${issue.message}\n`;
      output += `- **Rule:** ${issue.rule}\n`;
      output += `- **Impact:** ${issue.impact}\n`;
      output += `- **Element:** ${issue.element.tagName.toLowerCase()}`;
      if (issue.element.className) output += `.${issue.element.className.split(' ').join('.')}`;
      output += '\n';
      if (issue.help) output += `- **Help:** ${issue.help}\n`;
      output += '\n';
    });
  }
  
  if (report.warnings.length > 0) {
    output += '## Warnings (Should Fix)\n\n';
    report.warnings.forEach((issue, index) => {
      output += `### ${index + 1}. ${issue.message}\n`;
      output += `- **Rule:** ${issue.rule}\n`;
      output += `- **Impact:** ${issue.impact}\n`;
      output += `- **Element:** ${issue.element.tagName.toLowerCase()}`;
      if (issue.element.className) output += `.${issue.element.className.split(' ').join('.')}`;
      output += '\n';
      if (issue.help) output += `- **Help:** ${issue.help}\n`;
      output += '\n';
    });
  }
  
  return output;
}

/**
 * Live accessibility monitoring
 */
export class AccessibilityMonitor {
  private observer: MutationObserver | null = null;
  private issues: AccessibilityIssue[] = [];
  private callbacks: Array<(issues: AccessibilityIssue[]) => void> = [];
  
  start(container: HTMLElement = document.body) {
    this.observer = new MutationObserver(async () => {
      const report = await auditAccessibility(container);
      this.issues = [...report.failed, ...report.warnings];
      this.notifyCallbacks();
    });
    
    this.observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-label', 'aria-labelledby', 'aria-describedby', 'alt', 'role']
    });
    
    // Initial audit
    auditAccessibility(container).then(report => {
      this.issues = [...report.failed, ...report.warnings];
      this.notifyCallbacks();
    });
  }
  
  stop() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
  
  subscribe(callback: (issues: AccessibilityIssue[]) => void) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }
  
  private notifyCallbacks() {
    this.callbacks.forEach(callback => callback(this.issues));
  }
  
  getIssues() {
    return this.issues;
  }
}