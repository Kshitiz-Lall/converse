import { Request, Response } from "express";
import OpenAI from 'openai';
import { DataFormat } from "../types";
import * as formatUtils from "../utils/formatUtils";
import * as responseUtils from "../utils/responseUtils";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const AI_SYSTEM_PROMPT = `You are an expert data format conversion assistant. Your role is to:
1. Convert data between JSON, YAML, and XML formats with high accuracy
2. Fix malformed data structures when possible
3. Optimize and beautify the output format
4. Preserve all data integrity while improving structure
5. Add helpful comments or documentation when appropriate
6. Handle edge cases gracefully

Always respond with valid, well-formatted data in the requested output format. If the input data has issues, fix them intelligently while preserving the original intent.`;

interface AIConversionRequest {
  inputText: string;
  inputFormat: DataFormat;
  outputFormat: DataFormat;
  options?: {
    optimize?: boolean;
    addComments?: boolean;
    fixErrors?: boolean;
  };
}

// AI-powered format conversion with intelligent error handling and optimization
export const aiConvertFormat = async (req: Request, res: Response): Promise<void> => {
  const { inputText, inputFormat, outputFormat, options = {} } = req.body as AIConversionRequest;

  if (!inputText || !inputFormat || !outputFormat) {
    responseUtils.errorResponse(
      res,
      "Missing required fields: inputText, inputFormat, outputFormat"
    );
    return;
  }

  if (
    !["json", "yaml", "xml"].includes(inputFormat) ||
    !["json", "yaml", "xml"].includes(outputFormat)
  ) {
    responseUtils.errorResponse(
      res,
      "Invalid format. Supported formats: json, yaml, xml"
    );
    return;
  }

  try {
    // First try standard conversion
    const standardResult = formatUtils.convertData(inputText, inputFormat, outputFormat);
    
    // If standard conversion works and no optimization requested, return it
    if (!standardResult.error && !options.optimize && !options.addComments && !options.fixErrors) {
      responseUtils.successResponse(res, { 
        result: standardResult.result,
        method: 'standard',
        aiEnhanced: false
      });
      return;
    }

    // Use AI for enhanced conversion
    const userPrompt = createConversionPrompt(inputText, inputFormat, outputFormat, options);
    
    const messages: any = [
      { role: 'system', content: AI_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ];

    const openAIResponse = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.1, // Low temperature for consistent formatting
    });

    const aiResult = openAIResponse.choices[0].message.content?.trim();
    
    if (!aiResult) {
      throw new Error('AI returned empty response');
    }

    // Validate the AI result by trying to parse it
    const validationResult = validateAIOutput(aiResult, outputFormat);
    
    if (validationResult.error) {
      // Fallback to standard conversion if AI result is invalid
      if (!standardResult.error) {
        responseUtils.successResponse(res, { 
          result: standardResult.result,
          method: 'fallback_standard',
          aiEnhanced: false,
          aiError: validationResult.error
        });
        return;
      } else {
        throw new Error(`AI conversion failed: ${validationResult.error}`);
      }
    }

    responseUtils.successResponse(res, { 
      result: aiResult,
      method: 'ai_enhanced',
      aiEnhanced: true
    });

  } catch (error) {
    console.error('AI Format Conversion Error:', error);
    
    // Try fallback to standard conversion
    const fallbackResult = formatUtils.convertData(inputText, inputFormat, outputFormat);
    
    if (!fallbackResult.error) {
      responseUtils.successResponse(res, { 
        result: fallbackResult.result,
        method: 'fallback_standard',
        aiEnhanced: false,
        aiError: error instanceof Error ? error.message : String(error)
      });
    } else {
      responseUtils.errorResponse(
        res, 
        `Both AI and standard conversion failed. AI Error: ${error instanceof Error ? error.message : String(error)}. Standard Error: ${fallbackResult.error}`
      );
    }
  }
};

// AI-powered format beautification and optimization
export const aiBeautifyFormat = async (req: Request, res: Response): Promise<void> => {
  const { inputText, format, options = {} } = req.body;

  if (!inputText || !format) {
    responseUtils.errorResponse(
      res,
      "Missing required fields: inputText, format"
    );
    return;
  }

  if (!["json", "yaml", "xml"].includes(format)) {
    responseUtils.errorResponse(
      res,
      "Invalid format. Supported formats: json, yaml, xml"
    );
    return;
  }

  try {
    // First try standard formatting
    const standardResult = formatUtils.formatData(inputText, format as DataFormat);
    
    // If standard formatting works and no AI enhancement requested, return it
    if (!standardResult.error && !options.optimize && !options.addComments) {
      responseUtils.successResponse(res, { 
        result: standardResult.result,
        method: 'standard',
        aiEnhanced: false
      });
      return;
    }

    const userPrompt = createBeautificationPrompt(inputText, format as DataFormat, options);
    
    const messages: any = [
      { role: 'system', content: AI_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ];

    const openAIResponse = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.1,
    });

    const aiResult = openAIResponse.choices[0].message.content?.trim();
    
    if (!aiResult) {
      throw new Error('AI returned empty response');
    }

    // Validate the AI result
    const validationResult = validateAIOutput(aiResult, format as DataFormat);
    
    if (validationResult.error) {
      // Fallback to standard formatting
      if (!standardResult.error) {
        responseUtils.successResponse(res, { 
          result: standardResult.result,
          method: 'fallback_standard',
          aiEnhanced: false,
          aiError: validationResult.error
        });
        return;
      } else {
        throw new Error(`AI beautification failed: ${validationResult.error}`);
      }
    }

    responseUtils.successResponse(res, { 
      result: aiResult,
      method: 'ai_enhanced',
      aiEnhanced: true
    });

  } catch (error) {
    console.error('AI Format Beautification Error:', error);
    
    // Try fallback to standard formatting
    const fallbackResult = formatUtils.formatData(inputText, format as DataFormat);
    
    if (!fallbackResult.error) {
      responseUtils.successResponse(res, { 
        result: fallbackResult.result,
        method: 'fallback_standard',
        aiEnhanced: false,
        aiError: error instanceof Error ? error.message : String(error)
      });
    } else {
      responseUtils.errorResponse(
        res, 
        `Both AI and standard formatting failed. AI Error: ${error instanceof Error ? error.message : String(error)}. Standard Error: ${fallbackResult.error}`
      );
    }
  }
};

// Smart data analysis and suggestions
export const analyzeData = async (req: Request, res: Response): Promise<void> => {
  const { inputText, format } = req.body;

  if (!inputText || !format) {
    responseUtils.errorResponse(
      res,
      "Missing required fields: inputText, format"
    );
    return;
  }

  if (!["json", "yaml", "xml"].includes(format)) {
    responseUtils.errorResponse(
      res,
      "Invalid format. Supported formats: json, yaml, xml"
    );
    return;
  }

  try {
    const analysisPrompt = `Analyze this ${format.toUpperCase()} data and provide structured insights:

${inputText}

Please provide a detailed analysis and format your response as valid JSON with exactly these fields:
{
  "issues": [
    {
      "description": "Description of the issue",
      "impact": "Impact explanation"
    }
  ],
  "recommendations": [
    {
      "description": "Recommendation description",
      "action": "Specific action to take"
    }
  ],
  "optimizations": [
    {
      "description": "Optimization description", 
      "action": "Specific action to implement",
      "benefit": "Benefit of this optimization"
    }
  ],
  "validation_notes": [
    {
      "field": "field name",
      "validation": "Validation rule description"
    }
  ]
}

Focus on practical, actionable insights. Each array should contain objects with the exact field names shown above. Return only valid JSON, no markdown formatting.`;

    const messages: any = [
      { 
        role: 'system', 
        content: 'You are a data analysis expert. Provide detailed, actionable insights about data structures and formats. Always respond with valid JSON.' 
      },
      { role: 'user', content: analysisPrompt },
    ];

    const openAIResponse = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.3,
    });

    const aiAnalysis = openAIResponse.choices[0].message.content?.trim();
    
    if (!aiAnalysis) {
      throw new Error('AI returned empty analysis');
    }

    // Try to parse the analysis as JSON
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(aiAnalysis);
    } catch {
      // If not valid JSON, return as plain text
      parsedAnalysis = { analysis: aiAnalysis };
    }

    responseUtils.successResponse(res, { 
      analysis: parsedAnalysis,
      originalFormat: format
    });

  } catch (error) {
    console.error('AI Data Analysis Error:', error);
    responseUtils.errorResponse(
      res, 
      `Data analysis failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

// Helper functions
function createConversionPrompt(
  inputText: string, 
  inputFormat: DataFormat, 
  outputFormat: DataFormat, 
  options: any
): string {
  let prompt = `Convert this ${inputFormat.toUpperCase()} data to ${outputFormat.toUpperCase()} format:\n\n${inputText}\n\n`;
  
  if (options.fixErrors) {
    prompt += "Please fix any structural errors or malformed data while preserving the original intent.\n";
  }
  
  if (options.optimize) {
    prompt += "Optimize the structure for better readability and maintainability.\n";
  }
  
  if (options.addComments && outputFormat !== 'json') {
    prompt += "Add helpful comments where appropriate.\n";
  }
  
  prompt += `\nRespond with ONLY the converted ${outputFormat.toUpperCase()} data, no explanations or markdown formatting.`;
  
  return prompt;
}

function createBeautificationPrompt(inputText: string, format: DataFormat, options: any): string {
  let prompt = `Beautify and format this ${format.toUpperCase()} data:\n\n${inputText}\n\n`;
  
  if (options.optimize) {
    prompt += "Optimize the structure and improve readability.\n";
  }
  
  if (options.addComments && format !== 'json') {
    prompt += "Add helpful comments where appropriate.\n";
  }
  
  prompt += `\nRespond with ONLY the formatted ${format.toUpperCase()} data, no explanations or markdown formatting.`;
  
  return prompt;
}

function validateAIOutput(output: string, format: DataFormat): { error: string | null } {
  try {
    switch (format) {
      case 'json':
        JSON.parse(output);
        break;
      case 'yaml':
        // Basic YAML validation - just check if it can be processed
        if (!output.trim()) {
          throw new Error('Empty YAML output');
        }
        break;
      case 'xml':
        // Basic XML validation - check for basic XML structure
        if (!output.includes('<') || !output.includes('>')) {
          throw new Error('Invalid XML structure');
        }
        break;
    }
    return { error: null };
  } catch (error) {
    return { 
      error: `Invalid ${format.toUpperCase()} format: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}