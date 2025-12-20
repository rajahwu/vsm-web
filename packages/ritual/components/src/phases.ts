export interface Phase {
  id: string;
  name: string;
  duration: number;
  color: string;
  textColor: string;
  borderColor: string;
  gesture: string;
  prompt: string;
}

export const PHASES: Phase[] = [
  {
    id: 'plan',
    name: 'Plan',
    duration: 300, // 5 minutes
    color: 'bg-blue-600',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500',
    gesture: 'Palms open, facing up. Visualize the path ahead.',
    prompt: 'What is the single most important outcome?'
  },
  {
    id: 'sprint',
    name: 'Sprint',
    duration: 1500, // 25 minutes
    color: 'bg-amber-600',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500',
    gesture: 'Fists closed, focus forward. Engage the work.',
    prompt: 'Current blocking issue or primary focus:'
  },
  {
    id: 'rest',
    name: 'Rest',
    duration: 300, // 5 minutes
    color: 'bg-emerald-600',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500',
    gesture: 'Hands released, shake out tension. Breathe deeply.',
    prompt: 'How does the body feel right now?'
  },
  {
    id: 'reflect',
    name: 'Reflect',
    duration: 600, // 10 minutes
    color: 'bg-purple-600',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500',
    gesture: 'Hand over heart. Internalize the learning.',
    prompt: 'What went well? What was difficult?'
  },
  {
    id: 'recover',
    name: 'Recover',
    duration: 300, // 5 minutes
    color: 'bg-rose-600',
    textColor: 'text-rose-400',
    borderColor: 'border-rose-500',
    gesture: 'Palms together. Gratitude for the effort.',
    prompt: 'What do you need to let go of?'
  }
];