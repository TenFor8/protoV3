# CourseGlide — Two-Sided Course, TA & Curriculum Intelligence

An interactive Next.js + TypeScript + Tailwind CSS web application designed to solve the core limitations of traditional course review platforms like UWFlow:

1. **Combating Negativity & Selection Bias**:
   - Replaces raw, polarized "Liked %" ratings with a **Personal Learning Style Matcher** (*Hands-on Project Driven*, *Structured Notes & Slides*, *Live Problem Solving*, *Deep Theory & Proofs*, *High TA & Office Hour Support*, *Continuous Assessment*).
   - Tracks **Mid-Term Pulse Check-ins (Week 6)** alongside **Post-Course Reflections** to eliminate pure post-final-exam grade saltiness.

2. **Filtering for Substance Without Censoring Critical Feedback**:
   - The real-time **Substance & Constructiveness Analyzer** (`src/utils/substanceAnalyzer.ts`) distinguishes between **inappropriate personal attacks / 1-line rants** vs. **harsh but substantive critiques**.
   - Critical reviews that cite specific course elements (labs, rubrics, pacing spikes, infrastructure bottlenecks) are **highlighted** and automatically routed to the School Backend.
   - Flagged low-substance rants receive a **1-Click Constructive Reframe** suggestion.

3. **Elevating TA Reviews Beyond Internal Silos**:
   - Gives Teaching Assistants **Opt-In Public Teaching Portfolios** showcasing verified student superpowers (e.g., *Valgrind & GDB Debugging Lifesaver*, *Bridges Lecture-to-Assignment Gap*) and curated tutorial/office-hour endorsements.
   - Separates public recognition from a **Private Constructive Coaching Feed** visible only to the TA, ensuring psychological safety while helping TAs grow mid-term.

4. **Closing the Feedback Loop with the School / Department Backend**:
   - Every review separates **Advice for Future Students** from **Actionable Feedback for the School**.
   - The **Department Curriculum Intelligence Backend** clusters recurring student bottlenecks across terms into prioritized tickets.
   - Coordinators and instructors can publish resolutions directly to the course's public **"You Spoke, The School Updated" Course Changelog**, updating linked student reviews in real time.

## Running Locally

```bash
npm.cmd run dev
```

Open `http://localhost:3000` in your browser.
