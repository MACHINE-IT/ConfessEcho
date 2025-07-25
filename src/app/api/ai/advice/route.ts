import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ApiResponse, AIAdviceResponse } from '@/types';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'OpenAI API key not configured',
      }, { status: 500 });
    }

    // Initialize OpenAI client only when we have the API key
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const { confession, title }: { confession: string; title: string } = await req.json();
    
    if (!confession || !title) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Confession content and title are required',
      }, { status: 400 });
    }
    
    const prompt = `
You are a compassionate and professional counselor providing advice for someone's anonymous confession. 

Title: "${title}"
Confession: "${confession}"

Please provide:
1. Thoughtful, empathetic advice (2-3 paragraphs)
2. Categorize the main theme (Love, Career, School, Family, Friendship, Health, Money, Personal, Other)
3. Suggest 2-3 helpful resources or next steps

Keep your response supportive, non-judgmental, and constructive. If the confession involves serious issues like self-harm or illegal activities, recommend professional help.

Format your response as JSON with this structure:
{
  "advice": "Your thoughtful advice here...",
  "category": "The main category",
  "resources": ["Resource 1", "Resource 2", "Resource 3"]
}
`;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful, empathetic counselor who provides supportive advice. Always respond with valid JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });
    
    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }
    
    try {
      const aiAdvice: AIAdviceResponse = JSON.parse(response);
      
      return NextResponse.json<ApiResponse>({
        success: true,
        data: aiAdvice,
      });
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          advice: response,
          category: 'Personal',
          resources: [
            'Consider talking to a trusted friend or family member',
            'Professional counseling services',
            'Online support communities',
          ],
        },
      });
    }
    
  } catch (error) {
    console.error('Error generating AI advice:', error);
    
    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'AI service is currently busy. Please try again later.',
      }, { status: 429 });
    }
    
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to generate advice. Please try again later.',
    }, { status: 500 });
  }
}
