import { ReviewComponentTag } from "@/types";

export interface SubstanceAnalysisResult {
  score: number;
  status:
    | "Verified Substantive"
    | "Coached & Refined"
    | "Flagged: Low Substance / Rant"
    | "Blocked: Inappropriate / Personal Attack";
  isPublishable: boolean;
  breakdown: {
    hasSpecifics: boolean;
    hasActionableCritique: boolean;
    respectfulTone: boolean;
    contextProvided: boolean;
  };
  detectedThemes: ReviewComponentTag[];
  inappropriateTriggers: string[];
  coachingTip: string;
  suggestedRewrite?: {
    studentAdvice: string;
    schoolFeedback: string;
  };
}

const PERSONAL_ATTACK_PATTERNS = [
  /\b(idiot|moron|stupid|dumb|incompetent|trash human|garbage person|fire him|fire her|should be fired|hate him|hate her|evil|pathetic|useless human|worst person)\b/i,
  /\b(wtf|stfu|fuck|shit|bullshit|asshole|bitch)\b/i,
];

const PURE_VENT_PATTERNS = [
  /^(worst course ever|avoid at all costs|trash course|garbage course|do not take|ruined my gpa|0\/10)\.?$/i,
];

const SPECIFIC_ARTIFACT_KEYWORDS = [
  "assignment",
  "lab",
  "midterm",
  "final",
  "exam",
  "lecture",
  "slide",
  "tutorial",
  "office hour",
  "ta",
  "rubric",
  "project",
  "pacing",
  "prereq",
  "proof",
  "coding",
  "c++",
  "marmoset",
  "autograder",
  "textbook",
  "practice",
  "quiz",
  "week",
  "debugging",
  "workload",
];

const ACTIONABLE_KEYWORDS = [
  "should",
  "could",
  "recommend",
  "suggest",
  "improve",
  "add",
  "reduce",
  "clarify",
  "provide",
  "more examples",
  "practice problems",
  "earlier",
  "split",
  "checkpoint",
  "helpful if",
  "would be better",
  "start early",
  "attend",
  "focus on",
  "watch out",
];

export function analyzeReviewSubstance(
  studentAdvice: string,
  schoolFeedback: string,
  taFeedback: string = "",
  hasFullContext: boolean = true
): SubstanceAnalysisResult {
  const combined = `${studentAdvice} ${schoolFeedback} ${taFeedback}`.trim();
  const lower = combined.toLowerCase();

  // 1. Check for personal attacks / inappropriate language
  const inappropriateTriggers: string[] = [];
  for (const pattern of PERSONAL_ATTACK_PATTERNS) {
    const match = combined.match(pattern);
    if (match) {
      inappropriateTriggers.push(match[0]);
    }
  }

  const respectfulTone = inappropriateTriggers.length === 0;

  // 2. Check for specific course artifacts
  const matchedSpecifics = SPECIFIC_ARTIFACT_KEYWORDS.filter((kw) =>
    lower.includes(kw)
  );
  const hasSpecifics = matchedSpecifics.length >= 2 && combined.length >= 60;

  // 3. Check for actionable advice/feedback
  const matchedActionable = ACTIONABLE_KEYWORDS.filter((kw) =>
    lower.includes(kw)
  );
  const hasActionableCritique =
    (matchedActionable.length >= 1 && schoolFeedback.trim().length >= 25) ||
    (studentAdvice.trim().length >= 40 && schoolFeedback.trim().length >= 30);

  // 4. Detect component themes automatically for the School Backend
  const detectedThemes: ReviewComponentTag[] = [];
  if (/\b(lecture|slide|pace|chalkboard|recording|prof|explain)\b/i.test(lower)) {
    detectedThemes.push("Lectures");
  }
  if (/\b(assignment|lab|project|homework|a1|a2|a3|a4|a5|coding)\b/i.test(lower)) {
    detectedThemes.push("Assignments/Labs");
  }
  if (/\b(midterm|final|exam|test|quiz|curve|grading|rubric)\b/i.test(lower)) {
    detectedThemes.push("Midterm/Final");
  }
  if (/\b(ta|tutorial|office hour|oh|piazza|ed stem|debugging)\b/i.test(lower)) {
    detectedThemes.push("TA & Tutorials");
  }
  if (/\b(marmoset|learn|git|server|board|autograder|infra|vm)\b/i.test(lower)) {
    detectedThemes.push("Course Infrastructure");
  }

  // Calculate substance score (independent of whether the review is positive or negative!)
  let score = 0;
  if (hasFullContext) score += 20;
  if (studentAdvice.trim().length >= 45) score += 20;
  else if (studentAdvice.trim().length >= 20) score += 10;

  if (schoolFeedback.trim().length >= 45) score += 25;
  else if (schoolFeedback.trim().length >= 20) score += 12;

  if (hasSpecifics) score += 20;
  else if (matchedSpecifics.length === 1) score += 10;

  if (hasActionableCritique) score += 15;

  if (!respectfulTone) {
    score = Math.min(score, 25);
  } else if (
    PURE_VENT_PATTERNS.some((p) => p.test(studentAdvice.trim())) ||
    combined.length < 35
  ) {
    score = Math.min(score, 30);
  }

  score = Math.min(100, Math.max(5, score));

  // Determine status & coaching suggestion
  if (!respectfulTone) {
    return {
      score,
      status: "Blocked: Inappropriate / Personal Attack",
      isPublishable: false,
      breakdown: {
        hasSpecifics,
        hasActionableCritique,
        respectfulTone: false,
        contextProvided: hasFullContext,
      },
      detectedThemes,
      inappropriateTriggers,
      coachingTip:
        "We never censor negative or critical reviews—in fact, critical feedback drives school reform! However, personal insults or profanity (" +
        inappropriateTriggers.map((t) => `"${t}"`).join(", ") +
        ") get dismissed by departments. Reframe your frustration around specific lectures, grading rubrics, or workload spikes so future students and the department take action.",
      suggestedRewrite: {
        studentAdvice:
          "Be prepared for a steep learning curve and fast-paced lectures. Don't rely solely on lecture slides—start assignments at least a week early and use TA office hours to clarify edge cases.",
        schoolFeedback:
          "There is a major disconnect between lecture examples and the complexity of the assignments/exams. Providing clearer grading rubrics, sample practice problems, and better pacing in the second half of the term would significantly improve student learning.",
      },
    };
  }

  if (score < 55) {
    return {
      score,
      status: "Flagged: Low Substance / Rant",
      isPublishable: false,
      breakdown: {
        hasSpecifics,
        hasActionableCritique,
        respectfulTone: true,
        contextProvided: hasFullContext,
      },
      detectedThemes,
      inappropriateTriggers: [],
      coachingTip:
        "Right now this reads like a quick UWFlow vent without enough detail for future students or the department. Try mentioning *which* component (e.g., Assignment 3, midterm pacing, lecture slides) caused friction and *one concrete change* the course team should make.",
      suggestedRewrite: {
        studentAdvice:
          studentAdvice.trim().length > 15
            ? `${studentAdvice.trim()} Specifically, students who prefer structured examples should review tutorial notes and form a study group before the midterm.`
            : "This course moves quickly and assumes strong prerequisite foundations. Make sure to attend tutorials and budget extra time for the mid-semester project spike.",
        schoolFeedback:
          schoolFeedback.trim().length > 15
            ? `${schoolFeedback.trim()} Concretely, the department should align assignment instructions more closely with lecture topics and release practice test cases earlier.`
            : "The jump in difficulty between lectures and assessments felt abrupt. Adding intermediate checkpoints and clearer specification docs would reduce unnecessary student frustration.",
      },
    };
  }

  return {
    score,
    status: "Verified Substantive",
    isPublishable: true,
    breakdown: {
      hasSpecifics: true,
      hasActionableCritique: true,
      respectfulTone: true,
      contextProvided: hasFullContext,
    },
    detectedThemes:
      detectedThemes.length > 0 ? detectedThemes : ["Lectures", "Assignments/Labs"],
    inappropriateTriggers: [],
    coachingTip:
      "High-substance review! Your specific context helps students match their learning style AND feeds directly into the Department Action Tracker.",
  };
}
