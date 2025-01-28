// app/api/polls/[pollId]/route.js
import dbConnect from '@/app/lib/dbConnect';
import Poll from '@/app/models/Poll';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  await dbConnect();
  const { pollId } = params;

  const poll = await Poll.findById(pollId);
  console.log(poll.isActive);
  if (!poll) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
  }

  return NextResponse.json(poll);
}

export async function PATCH(request, { params }) {
  await dbConnect();
  const { pollId } = params;
  const { isActive, isPaused } = await request.json();

  const poll = await Poll.findById(pollId);

  if (!poll) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
  }

  if (typeof isActive !== 'undefined') {
    poll.isActive = isActive;
  }

  if (typeof isPaused !== 'undefined') {
    poll.isPaused = isPaused;
  }

  await poll.save();

  return NextResponse.json(poll);
}

export async function PUT(request, { params }) {
  await dbConnect();
  const { pollId } = params;
  const { optionIndex, sessionId } = await request.json();

  const poll = await Poll.findById(pollId);

  if (!poll) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
  }

  // Check if the poll is active
  if (!poll.isActive) {
    return NextResponse.json({ error: 'This poll is no longer available.' }, { status: 400 });
  }

  // Check if the poll is paused
  if (poll.isPaused) {
    return NextResponse.json({ error: 'This poll is currently paused.' }, { status: 400 });
  }

  if (optionIndex < 0 || optionIndex >= poll.options.length) {
    return NextResponse.json({ error: 'Invalid option' }, { status: 400 });
  }

  poll.voters = poll.voters || [];

  if (poll.voters.includes(sessionId)) {
    return NextResponse.json({ error: 'You have already voted' }, { status: 400 });
  }

  // Increase the vote count
  poll.options[optionIndex].votes += 1;
  poll.voters.push(sessionId);
  await poll.save();

  return NextResponse.json(poll);
}