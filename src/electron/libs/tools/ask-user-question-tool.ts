/**
 * AskUserQuestion Tool - Ask user for clarification
 */

import type { ToolDefinition, ToolResult, ToolExecutionContext } from './base-tool.js';

export const AskUserQuestionToolDefinition: ToolDefinition = {
  type: "function",
  function: {
    name: "AskUserQuestion",
    description: "Ask the user a question when you need clarification or more information.",
    parameters: {
      type: "object",
      properties: {
        question: {
          type: "string",
          description: "The question to ask the user"
        }
      },
      required: ["question"]
    }
  }
};

export async function executeAskUserQuestionTool(
  args: { question: string },
  context: ToolExecutionContext
): Promise<ToolResult> {
  // This will be handled by permission system
  return {
    success: true,
    output: `Question: ${args.question}`
  };
}

