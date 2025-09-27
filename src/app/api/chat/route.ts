import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { topicId, sessionId, action, message, messages } = await request.json()

    if (action === 'start') {
      // Load session prompt
      const sessionPromptPath = join(process.cwd(), 'src', 'system-prompts', topicId, `${sessionId}.txt`)
      const stylePromptPath = join(process.cwd(), 'src', 'styles', 'coaching.txt') // Default to coaching
      
      let sessionPrompt = ''
      let stylePrompt = ''

      try {
        sessionPrompt = readFileSync(sessionPromptPath, 'utf-8')
      } catch (error) {
        console.error('Error reading session prompt:', error)
        return NextResponse.json({ error: 'Session prompt not found' }, { status: 404 })
      }

      try {
        stylePrompt = readFileSync(stylePromptPath, 'utf-8')
      } catch (error) {
        console.error('Error reading style prompt:', error)
        // Continue without style prompt
      }

      // Combine prompts
      const systemPrompt = `${stylePrompt}\n\n${sessionPrompt}`

      // Get initial response from AI
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Hello, I\'m ready to start this session.' }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      })

      return NextResponse.json({
        message: completion.choices[0].message.content
      })

    } else if (action === 'message') {
      // Continue conversation
      const sessionPromptPath = join(process.cwd(), 'src', 'system-prompts', topicId, `${sessionId}.txt`)
      const stylePromptPath = join(process.cwd(), 'src', 'styles', 'coaching.txt')
      
      let sessionPrompt = ''
      let stylePrompt = ''

      try {
        sessionPrompt = readFileSync(sessionPromptPath, 'utf-8')
      } catch (error) {
        console.error('Error reading session prompt:', error)
        return NextResponse.json({ error: 'Session prompt not found' }, { status: 404 })
      }

      try {
        stylePrompt = readFileSync(stylePromptPath, 'utf-8')
      } catch (error) {
        console.error('Error reading style prompt:', error)
      }

      const systemPrompt = `${stylePrompt}\n\n${sessionPrompt}`

      // Convert messages to OpenAI format
      const openaiMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        }))
      ]

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: openaiMessages,
        max_tokens: 1000,
        temperature: 0.7,
      })

      return NextResponse.json({
        message: completion.choices[0].message.content
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

