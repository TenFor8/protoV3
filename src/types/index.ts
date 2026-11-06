export type LearningStyleTag =
  | "hands-on"
  | "structured-slides"
  | "live-coding"
  | "theory-rigor"
  | "ta-mentorship"
  | "continuous-eval";

export interface LearningStyleOption {
  id: LearningStyleTag;
  label: string;
  shortDesc: string;
}

export interface CourseChangelogItem {
  id: string;
  term: string;
  author: string;
  role: string;
  issueRaised: string;
  actionTaken: string;
  impactMetric?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  faculty: string;
  department: string;
  description: string;
  prereqs: string;
  intellectualValue: number;
  structureClarity: number;
  assessmentFairness: number;
  taSupportScore: number;
  weeklyHours: number;
  midTermPulsePositive: number;
  endOfTermPositive: number;
  responseRate: number;
  styleTags: LearningStyleTag[];
  bestFor: string[];
  watchOutFor: string[];
  changelog: CourseChangelogItem[];
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  department: string;
  courses: string[];
  teachingStyleSummary: string;
  styleTags: LearningStyleTag[];
  strengths: string[];
  pace: "Fast-paced" | "Moderate" | "Methodical";
  deliveryMode: string;
  clarityScore: number;
  approachabilityScore: number;
  recentNoteToStudents?: string;
}

export interface TAEndorsement {
  id: string;
  courseCode: string;
  term: string;
  quote: string;
  context: string;
  isPublic: boolean;
}

export interface TAPrivateFeedback {
  id: string;
  courseCode: string;
  term: string;
  note: string;
  actionableTip: string;
}

export interface TAProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  isPublicOptIn: boolean;
  coursesTaught: {
    code: string;
    term: string;
    section: string;
    roleType: "Tutorial" | "Lab & Debugging" | "Office Hours" | "Discussion & Marking";
  }[];
  superpowers: {
    label: string;
    count: number;
  }[];
  studentEndorsements: TAEndorsement[];
  privateConstructiveFeedback: TAPrivateFeedback[];
  metrics: {
    helpfulness: number;
    clarity: number;
    responsiveness: number;
    totalReviews: number;
  };
}

export type ReviewComponentTag =
  | "Lectures"
  | "Assignments/Labs"
  | "Midterm/Final"
  | "TA & Tutorials"
  | "Course Infrastructure";

export interface Review {
  id: string;
  courseCode: string;
  term: string;
  instructorName: string;
  taName?: string;
  checkpointType: "Mid-Term Pulse" | "Post-Course Reflection" | "Alumni Retro";
  reviewerContext: {
    attendance: "Attended 80%+ lectures" | "Mostly self-studied" | "Watched recordings";
    officeHoursUsed: "Regular TA/Prof OH user" | "Occasional Piazza/Ed" | "Did not use OH";
    reasonForTaking: "Core Requirement" | "Technical Elective" | "Interest / Minor";
    workloadFelt: "Manageable" | "Heavy but fair" | "Overwhelming spikes";
  };
  studentAdvice: string;
  schoolFeedback: string;
  taFeedback?: string;
  overallExperience: "Positive" | "Mixed / Constructive" | "Critical / Needs Reform";
  substanceScore: number;
  substanceStatus:
    | "Verified Substantive"
    | "Coached & Refined"
    | "Flagged: Low Substance / Rant"
    | "Blocked: Inappropriate / Personal Attack";
  substanceBreakdown: {
    hasSpecifics: boolean;
    hasActionableCritique: boolean;
    respectfulTone: boolean;
    contextProvided: boolean;
  };
  styleTags: LearningStyleTag[];
  componentTags: ReviewComponentTag[];
  helpfulCount: number;
  createdAt: string;
  linkedIssueId?: string;
  schoolResponse?: {
    responder: string;
    role: string;
    date: string;
    message: string;
    status: "Addressed" | "In Progress" | "Acknowledged";
  };
}

export interface DepartmentIssue {
  id: string;
  courseCode: string;
  title: string;
  category:
    | "Workload & Pacing"
    | "Assessment Alignment"
    | "Lab & Tooling Infra"
    | "TA & Tutorial Capacity"
    | "Lecture Delivery";
  severity: "High" | "Medium" | "Emerging";
  mentionCount: number;
  termsAffected: string[];
  aiSynthesizedSummary: string;
  sampleQuotes: string[];
  recommendedAction: string;
  status: "Needs Action" | "In Progress" | "Addressed in Curriculum";
  officialResolution?: string;
  updatedBy?: string;
}
