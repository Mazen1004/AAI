// identifyArtifact/prompts.js

// This file contains all the prompt templates for the IdentifyArtifact subsystem.
// Update these prompts as needed for your AI models.

// Prompt for OpenAIAPI (with image support)
export const OPENAIAPI_PROMPT_TEMPLATE = (
`Below is an image in base64 format:\n\n{base64_image}\n\n` +
"You are a professional historian that has a vast knowledge about a variety of historical artifacts." +
"Please analyze the image and provide details about the artifact. What time period it came from, a fun fact about it, and any interesting info."
);

// Prompt for Gemini (with no image support)
export const GEMINI_PROMPT_TEMPLATE = (
`Below is an image in base64 format:\n\n{base64_image}\n\n` +
"Please analyze the image and provide details about the artifact. " +
"Additional context: {description}"
);
