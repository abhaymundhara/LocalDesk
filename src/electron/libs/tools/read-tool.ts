/**
 * Read Tool - Read file contents
 */

import { readFile } from 'fs/promises';
import { resolve } from 'path';
import type { ToolDefinition, ToolResult, ToolExecutionContext } from './base-tool.js';

export const ReadToolDefinition: ToolDefinition = {
  type: "function",
  function: {
    name: "Read",
    description: "Read the contents of a file. Use this to view file contents before editing or analyzing code.",
    parameters: {
      type: "object",
      properties: {
        explanation: {
          type: "string",
          description: "Why you need to read this file"
        },
        file_path: {
          type: "string",
          description: "Path to the file to read (relative or absolute)"
        }
      },
      required: ["explanation", "file_path"]
    }
  }
};

export async function executeReadTool(
  args: { file_path: string; explanation: string },
  context: ToolExecutionContext
): Promise<ToolResult> {
  // Security check
  if (!context.isPathSafe(args.file_path)) {
    return {
      success: false,
      error: `Access denied: Path is outside the working directory (${context.cwd})`
    };
  }
  
  try {
    const fullPath = resolve(context.cwd, args.file_path);
    const content = await readFile(fullPath, 'utf-8');
    return {
      success: true,
      output: content
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Failed to read file: ${error.message}`
    };
  }
}

