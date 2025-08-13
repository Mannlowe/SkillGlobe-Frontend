#!/usr/bin/env node

/**
 * Button Migration Tool for SkillGlobe
 * 
 * Automatically converts common inconsistent button patterns to use StandardizedButton component
 */

import fs from 'fs';
import path from 'path';

interface MigrationRule {
  name: string;
  pattern: RegExp;
  replacement: (match: string, ...groups: string[]) => string;
  description: string;
}

interface MigrationStats {
  filesProcessed: number;
  totalReplacements: number;
  ruleStats: Record<string, number>;
  errors: Array<{ file: string; error: string }>;
}

class ButtonMigrator {
  private stats: MigrationStats = {
    filesProcessed: 0,
    totalReplacements: 0,
    ruleStats: {},
    errors: []
  };

  private migrationRules: MigrationRule[] = [
    // Rule 1: Basic gradient primary button
    {
      name: 'gradient-primary',
      pattern: /<button\s+className=["']([^"']*bg-gradient-to-r from-orange-500 to-blue-500[^"']*)["']([^>]*)>\s*([^<]+)\s*<\/button>/g,
      replacement: (match, className, attributes, children) => {
        const size = this.extractSize(className);
        const fullWidth = className.includes('w-full') ? ' fullWidth' : '';
        const additionalProps = this.extractAdditionalProps(attributes);
        return `<StandardizedButton variant="primary" size="${size}"${fullWidth}${additionalProps}>${children.trim()}</StandardizedButton>`;
      },
      description: 'Convert gradient primary buttons to StandardizedButton'
    },

    // Rule 2: Secondary gray buttons
    {
      name: 'gray-secondary',
      pattern: /<button\s+className=["']([^"']*bg-gray-(?:100|200)[^"']*)["']([^>]*)>\s*([^<]+)\s*<\/button>/g,
      replacement: (match, className, attributes, children) => {
        const size = this.extractSize(className);
        const fullWidth = className.includes('w-full') ? ' fullWidth' : '';
        const additionalProps = this.extractAdditionalProps(attributes);
        return `<StandardizedButton variant="secondary" size="${size}"${fullWidth}${additionalProps}>${children.trim()}</StandardizedButton>`;
      },
      description: 'Convert gray secondary buttons to StandardizedButton'
    },

    // Rule 3: Outline/border buttons
    {
      name: 'outline-button',
      pattern: /<button\s+className=["']([^"']*border\s+border-gray-[^"']*)["']([^>]*)>\s*([^<]+)\s*<\/button>/g,
      replacement: (match, className, attributes, children) => {
        const size = this.extractSize(className);
        const fullWidth = className.includes('w-full') ? ' fullWidth' : '';
        const additionalProps = this.extractAdditionalProps(attributes);
        return `<StandardizedButton variant="outline" size="${size}"${fullWidth}${additionalProps}>${children.trim()}</StandardizedButton>`;
      },
      description: 'Convert outline buttons to StandardizedButton'
    },

    // Rule 4: Solid color buttons (blue, orange, etc.)
    {
      name: 'solid-color',
      pattern: /<button\s+className=["']([^"']*bg-(blue|orange|red|green)-500[^"']*)["']([^>]*)>\s*([^<]+)\s*<\/button>/g,
      replacement: (match, className, color, attributes, children) => {
        const variant = color === 'red' ? 'destructive' : 
                      color === 'green' ? 'success' : 
                      color; // blue or orange
        const size = this.extractSize(className);
        const fullWidth = className.includes('w-full') ? ' fullWidth' : '';
        const additionalProps = this.extractAdditionalProps(attributes);
        return `<StandardizedButton variant="${variant}" size="${size}"${fullWidth}${additionalProps}>${children.trim()}</StandardizedButton>`;
      },
      description: 'Convert solid color buttons to StandardizedButton'
    },

    // Rule 5: skillglobe-button class
    {
      name: 'skillglobe-class',
      pattern: /<button\s+className=["']([^"']*skillglobe-button[^"']*)["']([^>]*)>\s*([^<]+)\s*<\/button>/g,
      replacement: (match, className, attributes, children) => {
        const size = this.extractSize(className);
        const fullWidth = className.includes('w-full') ? ' fullWidth' : '';
        const additionalProps = this.extractAdditionalProps(attributes);
        return `<StandardizedButton variant="primary" size="${size}"${fullWidth}${additionalProps}>${children.trim()}</StandardizedButton>`;
      },
      description: 'Convert skillglobe-button class to StandardizedButton'
    },

    // Rule 6: Icon buttons
    {
      name: 'icon-button',
      pattern: /<button\s+className=["']([^"']*w-(?:8|10|12)\s+h-(?:8|10|12)[^"']*)["']([^>]*?)>\s*<([^>]+)>\s*<\/button>/g,
      replacement: (match, className, attributes, iconElement) => {
        const size = className.includes('w-8') || className.includes('h-8') ? 'icon-sm' :
                    className.includes('w-12') || className.includes('h-12') ? 'icon-lg' : 'icon';
        const variant = className.includes('bg-') ? 'secondary' : 'ghost';
        const additionalProps = this.extractAdditionalProps(attributes);
        const ariaLabel = this.extractAriaLabel(attributes) || ' aria-label="Action"';
        return `<StandardizedButton variant="${variant}" size="${size}"${additionalProps}${ariaLabel}>\n  <${iconElement}>\n</StandardizedButton>`;
      },
      description: 'Convert icon buttons to StandardizedButton'
    },

    // Rule 7: Link-style buttons
    {
      name: 'link-button',
      pattern: /<button\s+className=["']([^"']*text-(blue|orange)-[^"']*underline[^"']*)["']([^>]*)>\s*([^<]+)\s*<\/button>/g,
      replacement: (match, className, color, attributes, children) => {
        const additionalProps = this.extractAdditionalProps(attributes);
        return `<StandardizedButton variant="link"${additionalProps}>${children.trim()}</StandardizedButton>`;
      },
      description: 'Convert link-style buttons to StandardizedButton'
    }
  ];

  private importStatements = [
    `import { StandardizedButton } from '@/components/ui/StandardizedButton';`
  ];

  migrateFile(filePath: string): boolean {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      let modifiedContent = content;
      let hasChanges = false;
      let fileReplacements = 0;

      // Apply each migration rule
      for (const rule of this.migrationRules) {
        const matches = modifiedContent.match(rule.pattern);
        if (matches) {
          const beforeLength = modifiedContent.length;
          modifiedContent = modifiedContent.replace(rule.pattern, rule.replacement);
          const afterLength = modifiedContent.length;
          
          if (beforeLength !== afterLength) {
            const replacements = matches.length;
            hasChanges = true;
            fileReplacements += replacements;
            this.stats.ruleStats[rule.name] = (this.stats.ruleStats[rule.name] || 0) + replacements;
            console.log(`  ✓ Applied ${rule.name}: ${replacements} replacements`);
          }
        }
      }

      // Add import statement if changes were made
      if (hasChanges) {
        modifiedContent = this.addImportStatement(modifiedContent);

        // Write the modified content back
        fs.writeFileSync(filePath, modifiedContent, 'utf-8');
        this.stats.totalReplacements += fileReplacements;
        console.log(`✅ Migrated ${filePath}: ${fileReplacements} buttons converted`);
      }

      return hasChanges;
    } catch (error) {
      this.stats.errors.push({
        file: filePath,
        error: error instanceof Error ? error.message : String(error)
      });
      console.error(`❌ Error processing ${filePath}:`, error);
      return false;
    }
  }

  private extractSize(className: string): string {
    // Extract size based on height or padding patterns
    if (className.includes('h-8') || className.includes('py-1')) return 'sm';
    if (className.includes('h-12') || className.includes('py-4')) return 'lg';
    if (className.includes('h-14') || className.includes('py-5')) return 'xl';
    if (className.includes('text-lg') || className.includes('text-xl')) return 'lg';
    return 'default';
  }

  private extractAdditionalProps(attributes: string): string {
    const props: string[] = [];
    
    // Extract common props
    const onClickMatch = attributes.match(/onClick=\{([^}]+)\}/);
    if (onClickMatch) {
      props.push(`onClick={${onClickMatch[1]}}`);
    }

    const disabledMatch = attributes.match(/disabled=\{([^}]+)\}/);
    if (disabledMatch) {
      props.push(`disabled={${disabledMatch[1]}}`);
    }

    const typeMatch = attributes.match(/type=["']([^"']+)["']/);
    if (typeMatch) {
      props.push(`type="${typeMatch[1]}"`);
    }

    return props.length > 0 ? ` ${props.join(' ')}` : '';
  }

  private extractAriaLabel(attributes: string): string | null {
    const ariaLabelMatch = attributes.match(/aria-label=["']([^"']+)["']/);
    return ariaLabelMatch ? ` aria-label="${ariaLabelMatch[1]}"` : null;
  }

  private addImportStatement(content: string): string {
    // Check if StandardizedButton is already imported
    if (content.includes('StandardizedButton')) {
      return content;
    }

    // Find the best place to add the import
    const importRegex = /import\s+.*?from\s+['"][^'"]*['"];?\n/g;
    const lastImportMatch = [...content.matchAll(importRegex)].pop();
    
    if (lastImportMatch) {
      const insertPosition = lastImportMatch.index! + lastImportMatch[0].length;
      return content.slice(0, insertPosition) + 
             this.importStatements[0] + '\n' + 
             content.slice(insertPosition);
    } else {
      // If no imports found, add at the beginning after 'use client' if present
      const useClientMatch = content.match(/^['"]use client['"];\s*\n/);
      if (useClientMatch) {
        return content.replace(useClientMatch[0], useClientMatch[0] + '\n' + this.importStatements[0] + '\n');
      } else {
        return this.importStatements[0] + '\n\n' + content;
      }
    }
  }

  migrateDirectory(dir: string): void {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !this.shouldSkipDirectory(file)) {
        this.migrateDirectory(fullPath);
      } else if (this.isReactFile(file)) {
        console.log(`\n📄 Processing: ${fullPath}`);
        const changed = this.migrateFile(fullPath);
        if (changed) {
          this.stats.filesProcessed++;
        }
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
    const report = `
# Button Migration Report

## Summary
- **Files Processed**: ${this.stats.filesProcessed}
- **Total Replacements**: ${this.stats.totalReplacements}
- **Errors**: ${this.stats.errors.length}

## Replacements by Rule
${Object.entries(this.stats.ruleStats)
  .sort(([,a], [,b]) => b - a)
  .map(([rule, count]) => `- **${rule}**: ${count} replacements`)
  .join('\n')}

## Migration Rules Applied
${this.migrationRules.map(rule => `
### ${rule.name}
${rule.description}
`).join('\n')}

${this.stats.errors.length > 0 ? `
## Errors Encountered
${this.stats.errors.map(error => `
- **${error.file}**: ${error.error}
`).join('\n')}
` : ''}

## Next Steps
1. Review migrated files for correctness
2. Run tests to ensure functionality is preserved  
3. Update remaining complex button patterns manually
4. Remove deprecated button CSS classes
5. Run button audit tool to verify improvements

Generated on: ${new Date().toISOString()}
`;

    return report;
  }

  saveReport(outputPath: string): void {
    const report = this.generateReport();
    fs.writeFileSync(outputPath, report);
    console.log(`\n📊 Migration report saved to: ${outputPath}`);
  }

  getStats(): MigrationStats {
    return this.stats;
  }
}

// CLI usage
if (require.main === module) {
  const migrator = new ButtonMigrator();
  const srcPath = path.join(process.cwd(), 'components');
  
  console.log('🚀 Starting button migration...');
  console.log(`📁 Scanning directory: ${srcPath}`);
  
  migrator.migrateDirectory(srcPath);
  
  const reportPath = path.join(process.cwd(), 'button-migration-report.md');
  migrator.saveReport(reportPath);
  
  const stats = migrator.getStats();
  console.log(`\n🎉 Migration Complete!`);
  console.log(`✅ Files processed: ${stats.filesProcessed}`);
  console.log(`🔄 Total replacements: ${stats.totalReplacements}`);
  console.log(`❌ Errors: ${stats.errors.length}`);
  
  if (stats.totalReplacements > 0) {
    console.log(`\n📝 Next steps:`);
    console.log(`1. Review migrated files for correctness`);
    console.log(`2. Run 'npm run test' to ensure functionality`);
    console.log(`3. Run button audit tool to verify improvements`);
    console.log(`4. Manual review of complex patterns`);
  }
}

export { ButtonMigrator };