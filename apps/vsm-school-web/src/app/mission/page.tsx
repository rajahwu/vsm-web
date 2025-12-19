'use client';

import { FEATURES } from '@/lib/features';
import { MissionSurface } from '@/components/MissionSurface';

export default function MissionSurfacePage() {
  if (!FEATURES.USE_MISSION_SURFACE) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-200 p-8">
        <div className="max-w-xl text-center space-y-4">
          <h1 className="text-3xl font-bold">Mission Surface (Preview)</h1>
          <p className="text-zinc-400">
            The unified Transmission → Dojo → Forge flow will live here. Enable
            <code className="mx-1 px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200">
              NEXT_PUBLIC_USE_MISSION_SURFACE=true
            </code>
            to turn on the new experience.
          </p>
          <p className="text-sm text-zinc-500">
            Feature flag currently disabled.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <MissionSurface />
    </main>
  );
}
