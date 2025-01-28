// app/api/polls/route.js
import dbConnect from '@/app/lib/dbConnect';
import Poll from '@/app/models/Poll';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  const polls = await Poll.find({ sessionId });
  return NextResponse.json(polls, { status: 200 });
}

// app/api/polls/route.js
export async function POST(request) {
    await dbConnect();
    const { sessionId, question, options } = await request.json();
  
    if (!sessionId || !question || !options || !Array.isArray(options)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
  
    const pollOptions = options.map((option) => ({ text: option }));
  
    const poll = new Poll({
      sessionId,
      question,
      options: pollOptions,
      voters: [],
      isActive: true, // Ensure poll is active upon creation
      isPaused: false,
    });
  
    await poll.save();
  
    return NextResponse.json(poll, { status: 201 });
  }