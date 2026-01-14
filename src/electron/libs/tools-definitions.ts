/**
 * OpenAI-compatible tool definitions for Qwen and other models
 */

import { ALL_TOOL_DEFINITIONS } from './tools/index.js';
import { getSystemPrompt, SYSTEM_PROMPT } from './prompt-loader.js';

// Export tools array
export const TOOLS = ALL_TOOL_DEFINITIONS;

// Export prompt functions
export { getSystemPrompt, SYSTEM_PROMPT };
