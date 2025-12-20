// apps/vsm-school-web/src/components/AARSuccessModal.tsx
// Optimized for 375px phone viewports

export const AARSuccessModal = ({ cardId, onComplete }) => {
  return (
    <div className="vsm-aar-modal">
      <header>
        <h3>Mission Complete: Card {cardId}</h3>
        <p>Closing the Loop: AAR</p>
      </header>

      {/* The 4 Pillars of AAR [cite: 30-33] */}
      <section className="aar-pillars">
        <div className="field">
          <label>Intent vs. Reality</label>
          <textarea placeholder="What actually happened compared to the plan?" />
        </div>
        
        <div className="field">
          <label>Analysis & Adjustment</label>
          <textarea placeholder="Why? What will we do differently next time?" />
        </div>
      </section>

      {/* Optional Telemetry */}
      <footer className="telemetry-input">
        <input type="number" name="intensity" placeholder="Intensity (1-10)" />
        <input type="number" name="reps" placeholder="Rep Count (Optional)" />
        <button onClick={onComplete}>Ship to Checkbook</button>
      </footer>
    </div>
  );
};
