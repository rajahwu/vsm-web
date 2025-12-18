#!/bin/bash

echo "🔍 STARTING VSM MISSION ARCHITECTURE AUDIT..."
echo "--------------------------------------------"

# 1. Registry Integrity
if [ -f "apps/vsm-school-web/src/lib/registry.ts" ]; then
    echo "✅ [REGISTRY] Found Mission Registry."
    CARDS=$(grep -c "id:" apps/vsm-school-web/src/lib/registry.ts)
    echo "📊 [REGISTRY] Detected $CARDS card definitions."
else
    echo "❌ [REGISTRY] Mission Registry missing at apps/vsm-school-web/src/lib/registry.ts."
fi

# 2. Component Readiness
COMPONENTS=("MissionSurface" "CardRitual" "ForgeEditor" "StoryPlayer")
for COMP in "${COMPONENTS[@]}"; do
    if find apps/vsm-school-web/src -name "$COMP.tsx" | grep -q "$COMP"; then
        echo "✅ [COMPONENT] $COMP found."
    else
        echo "⚠️  [COMPONENT] $COMP is missing or improperly named."
    fi
done

# 3. Environment & Supabase
if [ -f "apps/vsm-school-web/.env.local" ]; then
    echo "✅ [ENV] .env.local detected."
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" apps/vsm-school-web/.env.local; then
        echo "🔗 [SUPABASE] Connection strings present."
    else
        echo "❌ [SUPABASE] Missing Supabase environment variables."
    fi
else
    echo "❌ [ENV] .env.local missing in vsm-school-web."
fi

# 4. Progress Hook
if [ -f "apps/vsm-school-web/src/hooks/useMissionProgress.ts" ]; then
    echo "✅ [HOOK] useMissionProgress is present."
else
    echo "❌ [HOOK] useMissionProgress hook missing."
fi

echo "--------------------------------------------"
echo "🏁 AUDIT COMPLETE."
