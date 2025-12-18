export interface Phase {
  id: string;
  name: string;
  duration: number;
  color: string;
  borderColor: string;
  textColor: string;
  gesture: string;
  prompt: string;
}

export const PHASES: Phase[] = [
  {
    id: 'plan',
    name: 'Plan',
    duration: 300, // 5 minutes
    color: 'bg-amber-500',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-500',
    gesture: 'Define your intent. What will you accomplish in this sprint?',
    prompt: 'What is your focus?'
  },
  {
    id: 'sprint',
    name: 'Sprint',
    duration: 1500, // 25 minutes
    color: 'bg-emerald-500',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-500',
    gesture: 'Execute with full presence. No distractions, no context-switching.',
    prompt: 'What did you accomplish?'
  },
  {
    id: 'rest',
    name: 'Rest',
    duration: 300, // 5 minutes
    color: 'bg-sky-500',
    borderColor: 'border-sky-500',
    textColor: 'text-sky-500',
    gesture: 'Step away. Let the mind wander and reset.',
    prompt: 'How do you feel?'
  },
  {
    id: 'reflect',
    name: 'Reflect',
    duration: 300, // 5 minutes
    color: 'bg-violet-500',
    borderColor: 'border-violet-500',
    textColor: 'text-violet-500',
    gesture: 'What worked? What didn\'t? Capture the insight.',
    prompt: 'What did you learn?'
  },
  {
    id: 'recover',
    name: 'Recover',
    duration: 600, // 10 minutes
    color: 'bg-rose-500',
    borderColor: 'border-rose-500',
    textColor: 'text-rose-500',
    gesture: 'Optional deep rest. Take it if you need it.',
    prompt: 'Any notes before the next cycle?'
  }
];
