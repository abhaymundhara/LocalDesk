/**
 * Write Tool - Create new files
 */

import { writeFile, mkdir } from 'fs/promises';
import { dirname, resolve } from 'path';
import type { ToolDefinition, ToolResult, ToolExecutionContext } from './base-tool.js';

export const WriteToolDefinition: ToolDefinition = {
  type: "function",
  function: {
    name: "Write",
    description: "Create a new file with the given content. Use this to create new files.",
    parameters: {
      type: "object",
      properties: {
        explanation: {
          type: "string",
          description: "Why you're creating this file"
        },
        file_path: {
          type: "string",
          description: "Path where to create the file"
        },
        content: {
          type: "string",
          description: "Content to write to the file"
        }
      },
      required: ["explanation", "file_path", "content"]
    }
  }
};

export async function executeWriteTool(
  args: { file_path: string; content: string; explanation: string },
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
    const dir = dirname(fullPath);
    
    // Create directory if it doesn't exist
    await mkdir(dir, { recursive: true });
    
    await writeFile(fullPath, args.content, 'utf-8');
    return {
      success: true,
      output: `File created: ${args.file_path}`
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Failed to write file: ${error.message}`
    };
  }
}

