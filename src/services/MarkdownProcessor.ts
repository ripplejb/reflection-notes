// Markdown processor service following SRP and OCP
export interface IMarkdownProcessor {
  process(text: string): string;
}

interface MarkdownRule {
  test: (line: string) => boolean;
  transform: (line: string) => string;
}

export class MarkdownProcessor implements IMarkdownProcessor {
  private rules: MarkdownRule[] = [
    // Numbered list rule
    {
      test: (line: string) => /^\s*\d+\.\s/.test(line),
      transform: (line: string) => {
        const indent = line.match(/^(\s*)/)?.[1] || '';
        if (indent.length > 0) {
          const spaces = '   '; // 3 spaces for proper markdown nesting
          return line.replace(/^\s*/, spaces);
        }
        return line;
      }
    },
    // Bullet list rule
    {
      test: (line: string) => /^\s*[-*]\s/.test(line),
      transform: (line: string) => {
        const indent = line.match(/^(\s*)/)?.[1] || '';
        if (indent.length > 0) {
          const spaces = '   '; // 3 spaces for proper markdown nesting
          return line.replace(/^\s*/, spaces);
        }
        return line;
      }
    }
  ];

  addRule(rule: MarkdownRule): void {
    this.rules.push(rule);
  }

  process(text: string): string {
    const lines = text.split('\n');
    const processedLines: string[] = [];
    
    for (const line of lines) {
      let processedLine = line;
      
      for (const rule of this.rules) {
        if (rule.test(line)) {
          processedLine = rule.transform(line);
          break;
        }
      }
      
      processedLines.push(processedLine);
    }
    
    return processedLines.join('\n');
  }
}
