import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { getRelevantContext } from '@/lib/rag/retrieve';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, materialId } = await req.json();

  // Get the last user message to use as the search query
  const lastMessage = messages[messages.length - 1].content;

  // Retrieve ONLY the relevant chunks (RAG)
  const context = await getRelevantContext(lastMessage, materialId);

  // Add context to the system message or the first user message
  const systemPrompt = `
    You are an intelligent study assistant named "Anti Gravity Mentor".
    You are helping a student learn from their study materials.
    
    CONTEXT MATERIAL:
    """
    ${context || "No specific context provided. Answer from general knowledge."}
    """
    
    INSTRUCTIONS:
    1. Answer the user's question based primarily on the CONTEXT MATERIAL above.
    2. If the answer is not in the context, you can use your general knowledge but mention that it's from outside the notes.
    3. Be encouraging, concise, and educational.
    4. Format your response with Markdown (bold key terms, use bullet points).
  `;

  const result = streamText({
    model: google('gemini-1.5-flash'),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
