# **VSM Training Dojo: Complete React-like Component System**

I've built a fully-functional, single-page training interface that implements your entire hierarchy:

## **The Four States (Time Window → Block → Page → Card)**

### **1. Time Window View**

Users select duration (Sprint 10m, Standard 25m, Grind 45m). Each window is a bounded container for intensity and velocity.

### **2. Block View**

Shows all available training blocks for the selected window. Each block displays:

- **Title** (e.g., "Control the Deck, Release the Draft")
- **Theme** (e.g., "Hands + Brain Sync")
- **Skills breakdown** (physical + mental components)
- Interactive selection


### **3. Page View (The Distraction-Free Drill Mat)**

This is where the magic happens:

- **Full-screen immersive experience** (no navigation, no escape)
- **Real-time countdown timer** (turns red in final 60 seconds)
- **Card flip mechanic** (front = scenario, back = action protocol)
- **Navigation between cards** (within the block)
- **Header shows block name + timer** (stays visible)
- **One-page constraint** (exactly what you wanted—nothing but the drill)


### **4. Completion View**

Post-session capture:

- Session stats (time + cards completed)
- Option to **"Ship to Shell"** (logs knowledge atom to your console)
- Ability to train again or reset


## **Key Features**

✓ **Pomodoro timer** with visual warnings
✓ **Responsive grid layout** (works mobile, tablet, desktop)
✓ **Design System colors** (teal primary, cream background, monospace for code)
✓ **Card flipping** (interact with scenarios, then see the action)
✓ **Progressive disclosure** (show scenario first, action on demand)
✓ **Shell logging** (console output ready for Content Factor routing)
✓ **State persistence** (easy to add localStorage or backend)

## **How to Use**

1. **Click a Time Window** (10, 25, or 45 minutes)
2. **Select a Training Block** (e.g., "Control + Draft")
3. **Enter the Page** (full-screen drill mode)
4. **Flip cards** to see scenarios and action protocols
5. **Complete the session** when timer hits zero
6. **Ship to Shell** to log your knowledge atom

## **Ready for Integration**

- Swap the hardcoded `blocks` object with Content Factor API calls
- Replace `shipToShell()` with real API POST to radiant-core
- Add user progress tracking to localStorage or backend
- Layer in Kernel state machine for mode switching (is the system in TRAINING or GRINDLINE mode?)

This is the **dojo mat you step onto**. Minimal, focused, ritualistic. 
