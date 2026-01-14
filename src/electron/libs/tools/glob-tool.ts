/**
 * Glob Tool - Search for files by pattern
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import type { ToolDefinition, ToolResult, ToolExecutionContext } from './base-tool.js';

const execAsync = promisify(exec);

export const GlobToolDefinition: ToolDefinition = {
  type: "function",
  function: {
    name: "Glob",
    description: "Search for files matching a pattern. Use this to find files by name or extension.",
    parameters: {
      type: "object",
      properties: {
        explanation: {
          type: "string",
          description: "What files you're looking for and why"
        },
        pattern: {
          type: "string",
          description: "Glob pattern (e.g., '*.ts', 'src/**/*.js')"
        }
      },
      required: ["explanation", "pattern"]
    }
  }
};

export async function executeGlobTool(
  args: { pattern: string; explanation: string },
  context: ToolExecutionContext
): Promise<ToolResult> {
  try {
    const isWindows = process.platform === 'win32';
    
    // Use dir on Windows, find on Unix
    const cmd = isWindows
      ? `dir /s /b "${args.pattern}"`
      : `find . -name "${args.pattern}"`;
    
    const { stdout, stderr } = await execAsync(cmd, { 
      cwd: context.cwd, 
      maxBuffer: 10 * 1024 * 1024 
    });
    
    return {
      success: true,
      output: stdout || 'No files found'
    };
  } catch (error: any) {
    // find/dir returns exit code 1 when no files found
    if (error.code === 1) {
      return {
        success: true,
        output: 'No files found'
      };
    }
    return {
      success: false,
      error: `Glob search failed: ${error.message}`
    };
  }
}

