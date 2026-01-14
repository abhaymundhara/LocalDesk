/**
 * ExtractPageContentTool - Extract full content from web pages using Tavily API
 */

import fetch from 'node-fetch';
import type { ToolDefinition, ToolResult, ToolExecutionContext } from './base-tool.js';

export interface ExtractPageParams {
  urls: string[];
  reasoning: string;
}

export interface PageContent {
  url: string;
  content: string;
  char_count: number;
  success: boolean;
  error?: string;
}

export interface TavilyExtractResponse {
  results: Array<{
    url: string;
    raw_content: string;
  }>;
  failed_results: Array<{
    url: string;
    error: string;
  }>;
}

export const ExtractPageContentToolDefinition: ToolDefinition = {
  type: "function",
  function: {
    name: "ExtractPageContent",
    description: "Extract full detailed content from specific web pages. Use AFTER WebSearch to get complete page content from URLs found in search results. Returns full page content in readable format. Best for deep analysis of specific pages and extracting structured data.",
    parameters: {
      type: "object",
      properties: {
        reasoning: {
          type: "string",
          description: "Why extract these specific pages"
        },
        urls: {
          type: "array",
          items: {
            type: "string"
          },
          description: "List of URLs to extract full content from (1-5 URLs)",
          minItems: 1,
          maxItems: 5
        }
      },
      required: ["reasoning", "urls"]
    }
  }
};

export class ExtractPageContentTool {
  private apiKey: string;
  private baseUrl = 'https://api.tavily.com';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async extract(params: ExtractPageParams): Promise<PageContent[]> {
    const { urls } = params;

    console.log(`[ExtractPage] Extracting ${urls.length} URLs`);

    if (!this.apiKey || this.apiKey === 'dummy-key') {
      throw new Error('Tavily API key not configured. Please set it in Settings.');
    }

    if (urls.length === 0 || urls.length > 5) {
      throw new Error('Must provide 1-5 URLs to extract');
    }

    try {
      const response = await fetch(`${this.baseUrl}/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          urls,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Tavily API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as TavilyExtractResponse;

      const results: PageContent[] = [];

      // Add successful extractions
      data.results?.forEach((result) => {
        results.push({
          url: result.url,
          content: result.raw_content,
          char_count: result.raw_content.length,
          success: true,
        });
      });

      // Add failed extractions
      data.failed_results?.forEach((failed) => {
        results.push({
          url: failed.url,
          content: '',
          char_count: 0,
          success: false,
          error: failed.error,
        });
      });

      console.log(`[ExtractPage] Extracted ${results.filter(r => r.success).length}/${urls.length} pages`);
      return results;

    } catch (error) {
      console.error('[ExtractPage] Error:', error);
      throw error;
    }
  }

  formatResults(results: PageContent[], contentLimit: number = 5000): string {
    let formatted = 'Extracted Page Content:\n\n';

    results.forEach((result, index) => {
      formatted += `${index + 1}. ${result.url}\n`;
      
      if (result.success) {
        const preview = result.content.substring(0, contentLimit);
        formatted += `**Content** (${result.char_count} characters):\n`;
        formatted += `${preview}${result.content.length > contentLimit ? '\n\n...[truncated]...' : ''}\n\n`;
      } else {
        formatted += `**Failed**: ${result.error || 'Unknown error'}\n\n`;
      }

      formatted += '---\n\n';
    });

    return formatted;
  }
}

