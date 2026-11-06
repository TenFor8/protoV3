import {
  Course,
  DepartmentIssue,
  Instructor,
  LearningStyleOption,
  Review,
  TAProfile,
} from "@/types";

export const LEARNING_STYLE_OPTIONS: LearningStyleOption[] = [
  {
    id: "hands-on",
    label: "Hands-On & Project Driven",
    shortDesc: "Learn best by building real systems, labs, and iterative code",
  },
  {
    id: "structured-slides",
    label: "Structured Notes & Slides",
    shortDesc: "Prefer well-organized course notes, clear rubrics, and predictable pacing",
  },
  {
    id: "live-coding",
    label: "Live Problem Solving",
    shortDesc: "Thrive on interactive chalkboard proofs or live terminal walkthroughs",
  },
  {
    id: "theory-rigor",
    label: "Deep Theory & Proofs",
    shortDesc: "Enjoy mathematical rigor, formal foundations, and conceptual depth",
  },
  {
    id: "ta-mentorship",
    label: "High TA & Office Hour Support",
    shortDesc: "Value accessible tutorials, debugging clinics, and 1-on-1 TA mentorship",
  },
  {
    id: "continuous-eval",
    label: "Continuous Assessment",
    shortDesc: "Prefer steady assignments/checkpoints over high-stakes final exams",
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: "cs246",
    code: "CS 246",
    name: "Object-Oriented Software Development",
    faculty: "Mathematics",
    department: "Cheriton School of Computer Science",
    description:
      "Introduction to object-oriented programming in C++, design patterns, memory management, RAII, shell scripting, and large-scale group software architecture.",
    prereqs: "CS 136 or CS 146",
    intellectualValue: 94,
    structureClarity: 82,
    assessmentFairness: 76,
    taSupportScore: 91,
    weeklyHours: 14,
    midTermPulsePositive: 86,
    endOfTermPositive: 79,
    responseRate: 74,
    styleTags: ["hands-on", "live-coding", "ta-mentorship"],
    bestFor: [
      "Students who learn by writing and debugging real C++ code",
      "Learners who actively use TA debugging clinics and tutorial walkthroughs",
      "Anyone preparing for software engineering co-op interviews",
    ],
    watchOutFor: [
      "Weeks 8–11 workload spike during the final group project (DD2)",
      "Marmoset secret tests punish last-minute submissions without local unit tests",
    ],
    changelog: [
      {
        id: "cl-1",
        term: "Fall 2026",
        author: "CS 246 Course Coordination Team",
        role: "Undergraduate Curriculum Committee",
        issueRaised:
          "34 substantive reviews in Winter/Spring 2026 flagged an abrupt workload spike between Assignment 4 and the final C++ group project (DD1/DD2).",
        actionTaken:
          "Split the final project milestone into two graded architecture check-ins with dedicated TA design reviews in Week 9, and reduced A4 problem count by 20%.",
        impactMetric: "Late token burnout dropped by 41% in mid-term pulse",
      },
      {
        id: "cl-2",
        term: "Spring 2026",
        author: "Lead Instructional Support Tutor (ISC)",
        role: "Course Staff & TAs",
        issueRaised:
          "Students reported cryptic Marmoset memory-leak errors on Assignment 3 with insufficient valgrind tutorial examples.",
        actionTaken:
          "Created a dedicated Tutorial 4 Valgrind & GDB live debugging lab led by TAs, plus released a pre-submission memory diagnostic script.",
        impactMetric: "91% of students rated Tutorial 4 'Extremely Helpful'",
      },
    ],
  },
  {
    id: "cs341",
    code: "CS 341",
    name: "Algorithms",
    faculty: "Mathematics",
    department: "Cheriton School of Computer Science",
    description:
      "The study of efficient algorithms and effective algorithm design techniques including divide-and-conquer, greedy strategies, dynamic programming, graph algorithms, and NP-completeness.",
    prereqs: "CS 240, MATH 239",
    intellectualValue: 96,
    structureClarity: 89,
    assessmentFairness: 84,
    taSupportScore: 87,
    weeklyHours: 11,
    midTermPulsePositive: 88,
    endOfTermPositive: 85,
    responseRate: 69,
    styleTags: ["theory-rigor", "structured-slides", "live-coding"],
    bestFor: [
      "Analytical learners who enjoy puzzle-solving and formal correctness proofs",
      "Students who appreciate structured lecture slides paired with tutorial problem sets",
    ],
    watchOutFor: [
      "Proof rigor expectations on Written Assignment 2 (Dynamic Programming)",
      "Pacing moves quickly during network flow & NP-reductions",
    ],
    changelog: [
      {
        id: "cl-3",
        term: "Fall 2026",
        author: "CS 341 Instruction Team",
        role: "Department of Computer Science",
        issueRaised:
          "Students noted inconsistent TA grading deductions on Dynamic Programming correctness proofs when runtime bounds were stated informally.",
        actionTaken:
          "Published a standardized 'Proof & Runtime Rubric Template' before A1 and held TA calibration sessions across all marking teams.",
        impactMetric: "Regrade requests decreased by 58%",
      },
    ],
  },
  {
    id: "ece252",
    code: "ECE 252",
    name: "Systems Programming and Concurrency",
    faculty: "Engineering",
    department: "Electrical and Computer Engineering",
    description:
      "Process management, inter-process communication, threads, synchronization primitives, deadlocks, asynchronous I/O, and high-performance network servers in C.",
    prereqs: "ECE 150, ECE 222",
    intellectualValue: 92,
    structureClarity: 78,
    assessmentFairness: 74,
    taSupportScore: 88,
    weeklyHours: 15,
    midTermPulsePositive: 81,
    endOfTermPositive: 75,
    responseRate: 78,
    styleTags: ["hands-on", "ta-mentorship", "continuous-eval"],
    bestFor: [
      "Hands-on systems builders who want to understand POSIX threads, mutexes, and cURL/network internals",
      "Students who attend lab sessions to debug race conditions with TAs",
    ],
    watchOutFor: [
      "Heisenbugs and non-deterministic race conditions in Lab 3 & Lab 4",
      "Server load on lab machines 24 hours before deadlines",
    ],
    changelog: [
      {
        id: "cl-4",
        term: "Fall 2026",
        author: "ECE Systems Lab Coordinator",
        role: "ECE Undergraduate Studies",
        issueRaised:
          "Substantive student feedback highlighted severe SSH congestion on `ecetesla` servers during Lab 3 concurrency benchmarking.",
        actionTaken:
          "Provisioned 4 additional dedicated benchmarking nodes and added a Docker container environment for local Helgrind/ThreadSanitizer testing.",
        impactMetric: "Zero server outage reports during Fall 2026 Lab 3 deadline",
      },
    ],
  },
  {
    id: "stat231",
    code: "STAT 231",
    name: "Statistics",
    faculty: "Mathematics",
    department: "Statistics and Actuarial Science",
    description:
      "Empirical problem solving, maximum likelihood estimation, confidence intervals, hypothesis testing, Gaussian linear models, and R data analysis.",
    prereqs: "MATH 138, STAT 230",
    intellectualValue: 74,
    structureClarity: 64,
    assessmentFairness: 68,
    taSupportScore: 85,
    weeklyHours: 9,
    midTermPulsePositive: 67,
    endOfTermPositive: 61,
    responseRate: 71,
    styleTags: ["structured-slides", "ta-mentorship", "continuous-eval"],
    bestFor: [
      "Students who follow the course notes closely and use TA tutorials to bridge theory to R assignments",
    ],
    watchOutFor: [
      "Notation density in the 300-page course notes PDF",
      "Strict wording requirements when interpreting Confidence Intervals on quizzes",
    ],
    changelog: [
      {
        id: "cl-5",
        term: "Fall 2026",
        author: "STAT 231 Course Coordinator",
        role: "Dept of Statistics & Actuarial Science",
        issueRaised:
          "47 student reviews pointed out that R coding assignments were disconnected from lecture derivations and had vague plotting rubrics.",
        actionTaken:
          "Added 15-minute R walkthrough segments to weekly TA tutorials and published exact rubric checklists for all PPDAC data reports.",
        impactMetric: "R Assignment satisfaction rose from 52% to 81%",
      },
    ],
  },
];

export const INITIAL_INSTRUCTORS: Instructor[] = [
  {
    id: "inst-1",
    name: "Prof. Jordan Bradfield",
    title: "Associate Professor, Teaching Stream",
    department: "Cheriton School of Computer Science",
    courses: ["CS 246"],
    teachingStyleSummary:
      "Interactive live-coding in terminal + Socratic questioning. Rarely reads off slides; builds C++ programs from scratch and intentionally triggers compiler errors to show how to reason through them.",
    styleTags: ["live-coding", "hands-on", "ta-mentorship"],
    strengths: [
      "Live terminal debugging in lecture",
      "Deep intuition for C++ memory models & RAII",
      "Co-designs weekly TA tutorial sheets",
    ],
    pace: "Fast-paced",
    deliveryMode: "Live Terminal Coding + Chalkboard Diagrams",
    clarityScore: 93,
    approachabilityScore: 95,
    recentNoteToStudents:
      "Thanks for the Winter/Spring feedback on the Week 9 project crunch—we've restructured Milestone 1 so your TA mentors review your UML & class interfaces before you write 2,000 lines of code.",
  },
  {
    id: "inst-2",
    name: "Prof. Elena Rostova",
    title: "Professor",
    department: "Cheriton School of Computer Science",
    courses: ["CS 341"],
    teachingStyleSummary:
      "Highly structured, crystal-clear annotated slides combined with step-by-step algorithm trace walkthroughs. Emphasizes *why* a greedy choice fails before proving the optimal substructure.",
    styleTags: ["structured-slides", "theory-rigor"],
    strengths: [
      "Annotated PDF notes posted within 1 hour of class",
      "Transparent exam expectations & proof templates",
      "Calm, methodical pacing",
    ],
    pace: "Methodical",
    deliveryMode: "iPad Annotated Slides + Visual Graph Traces",
    clarityScore: 96,
    approachabilityScore: 91,
    recentNoteToStudents:
      "Based on student feedback, every DP and Graph lecture now ends with a 'Common Proof Pitfalls' slide co-authored with our head TAs.",
  },
  {
    id: "inst-3",
    name: "Prof. Marcus Vance",
    title: "Lecturer",
    department: "Electrical and Computer Engineering",
    courses: ["ECE 252"],
    teachingStyleSummary:
      "Industry storytelling paired with systems architecture diagrams. Connects every OS concurrency concept to real production outages and distributed systems war stories.",
    styleTags: ["hands-on", "live-coding", "continuous-eval"],
    strengths: [
      "Real-world systems engineering context",
      "Practical C debugging workflows",
      "Responsive on Ed Stem / Piazza",
    ],
    pace: "Moderate",
    deliveryMode: "Whiteboard Architecture + Live C Concurrency Demos",
    clarityScore: 87,
    approachabilityScore: 92,
  },
  {
    id: "inst-4",
    name: "Prof. Hannah Lin",
    title: "Continuing Lecturer",
    department: "Statistics and Actuarial Science",
    courses: ["STAT 231"],
    teachingStyleSummary:
      "Structured worked examples that translate dense course-note notation into plain-English statistical intuition and R workflows.",
    styleTags: ["structured-slides", "ta-mentorship", "continuous-eval"],
    strengths: [
      "Translates dense notation into step-by-step recipes",
      "Weekly exam-style clicker warmups",
      "Coordinates closely with tutorial TAs",
    ],
    pace: "Methodical",
    deliveryMode: "Guided Workbook Fill-ins + RStudio Demos",
    clarityScore: 89,
    approachabilityScore: 94,
  },
];

export const INITIAL_TAS: TAProfile[] = [
  {
    id: "ta-1",
    name: "Maya Chen",
    role: "Lead Tutorial & Debugging Clinic TA (MMath CS)",
    department: "Cheriton School of Computer Science",
    bio: "3x CS 246 & CS 341 TA. Focused on making C++ memory models, Valgrind traces, and DP recurrences click visually without making anyone feel intimidated in office hours.",
    isPublicOptIn: true,
    coursesTaught: [
      { code: "CS 246", term: "Fall 2026", section: "TUT 101 / 102", roleType: "Tutorial" },
      { code: "CS 246", term: "Spring 2026", section: "Debugging Clinic", roleType: "Lab & Debugging" },
      { code: "CS 341", term: "Winter 2026", section: "TUT 104", roleType: "Office Hours" },
    ],
    superpowers: [
      { label: "Bridges Lecture-to-Assignment Gap", count: 42 },
      { label: "Valgrind & GDB Debugging Lifesaver", count: 37 },
      { label: "Patient & Zero-Judgment in Office Hours", count: 31 },
      { label: "Visualizes Edge Cases on Whiteboard", count: 29 },
    ],
    studentEndorsements: [
      {
        id: "end-1",
        courseCode: "CS 246",
        term: "Spring 2026",
        quote:
          "Maya's Tutorial 101 walkthrough of move semantics and the Rule of 5 saved my Assignment 3. Instead of just giving the answer in office hours, she drew the stack/heap pointers on the whiteboard until I spotted my dangling pointer myself.",
        context: "Attended weekly tutorials + 3 Office Hour sessions",
        isPublic: true,
      },
      {
        id: "end-2",
        courseCode: "CS 341",
        term: "Winter 2026",
        quote:
          "Best TA I've had at Waterloo. She created a 1-page checklist for how to structure Exchange Argument greedy proofs that the whole class ended up using for the midterm.",
        context: "Regular tutorial attendee",
        isPublic: true,
      },
      {
        id: "end-3",
        courseCode: "CS 246",
        term: "Spring 2026",
        quote:
          "During the Week 10 group project crunch, Maya stayed an extra 30 minutes at the debugging clinic to help our team untangle a circular dependency in our observer pattern.",
        context: "Final Project Milestone Review",
        isPublic: true,
      },
    ],
    privateConstructiveFeedback: [
      {
        id: "priv-1",
        courseCode: "CS 246",
        term: "Spring 2026",
        note: "Sometimes the last 10 minutes of Tutorial 101 felt rushed when covering bash one-liners because so many students asked questions during the C++ section.",
        actionableTip:
          "Try posting the bash cheat-sheet 10 minutes before tutorial starts and reserving a hard 15-minute mark for the second topic.",
      },
      {
        id: "priv-2",
        courseCode: "CS 341",
        term: "Winter 2026",
        note: "Back row in MC 4041 had trouble reading the bottom third of the chalkboard during graph trace examples.",
        actionableTip:
          "Use the upper two-thirds of the sliding board or project the graph skeleton on the screen.",
      },
    ],
    metrics: {
      helpfulness: 98,
      clarity: 96,
      responsiveness: 95,
      totalReviews: 48,
    },
  },
  {
    id: "ta-2",
    name: "Devon Patel",
    role: "Systems Lab & Concurrency TA (MASc ECE)",
    department: "Electrical and Computer Engineering",
    bio: "ECE 252 Head Lab TA. Passionate about helping students hunt down race conditions, deadlocks, and memory corruption using ThreadSanitizer and GDB.",
    isPublicOptIn: true,
    coursesTaught: [
      { code: "ECE 252", term: "Fall 2026", section: "LAB 001 / 003", roleType: "Lab & Debugging" },
      { code: "ECE 252", term: "Winter 2026", section: "LAB 002", roleType: "Office Hours" },
    ],
    superpowers: [
      { label: "Concurrency & Deadlock Whisperer", count: 34 },
      { label: "Fast & Detailed Ed Stem Answers", count: 28 },
      { label: "Clear Lab Spec Clarifications", count: 24 },
    ],
    studentEndorsements: [
      {
        id: "end-4",
        courseCode: "ECE 252",
        term: "Winter 2026",
        quote:
          "Our Lab 3 producer-consumer queue was deadlocking once every 50 runs. Devon taught us how to reproduce it deterministically with ThreadSanitizer in 10 minutes instead of us guessing for 6 hours.",
        context: "Lab 002 Debugging Session",
        isPublic: true,
      },
      {
        id: "end-5",
        courseCode: "ECE 252",
        term: "Winter 2026",
        quote:
          "Devon's Ed Stem posts explaining condition variable spurious wakeups were clearer than any textbook. He also flagged the `ecetesla` server bottleneck to the department so they added Docker support!",
        context: "Ed Stem + Lab Checkoff",
        isPublic: true,
      },
    ],
    privateConstructiveFeedback: [
      {
        id: "priv-3",
        courseCode: "ECE 252",
        term: "Winter 2026",
        note: "Lab checkoff queue got backed up by 25+ minutes on Friday afternoons when pairs needed live debugging help at the same time as grading.",
        actionableTip:
          "Separate 3-minute grading checkoffs from 15-minute debugging help queues using two whiteboard columns.",
      },
    ],
    metrics: {
      helpfulness: 95,
      clarity: 94,
      responsiveness: 97,
      totalReviews: 36,
    },
  },
  {
    id: "ta-3",
    name: "Liam O'Connor",
    role: "Undergraduate Tutorial TA (4B Math / STAT)",
    department: "Statistics and Actuarial Science",
    bio: "STAT 231 & MATH 239 TA. I focus on turning dense theorem notation into intuitive stories and giving practical R debugging templates.",
    isPublicOptIn: true,
    coursesTaught: [
      { code: "STAT 231", term: "Fall 2026", section: "TUT 103", roleType: "Tutorial" },
      { code: "STAT 231", term: "Spring 2026", section: "Office Hours", roleType: "Office Hours" },
    ],
    superpowers: [
      { label: "Demystifies Dense Course Notes", count: 29 },
      { label: "Practical RStudio Walkthroughs", count: 26 },
      { label: "Exam Wording Precision Coach", count: 21 },
    ],
    studentEndorsements: [
      {
        id: "end-6",
        courseCode: "STAT 231",
        term: "Spring 2026",
        quote:
          "STAT 231 notes felt like reading another language until I started going to Liam's tutorials. He breaks down Likelihood Ratio Tests into a 4-step recipe and shows the exact phrasing markers look for.",
        context: "Attended all 10 tutorials",
        isPublic: true,
      },
    ],
    privateConstructiveFeedback: [
      {
        id: "priv-4",
        courseCode: "STAT 231",
        term: "Spring 2026",
        note: "Would love if the annotated R script from tutorial was uploaded to LEARN before Friday evening so we can reference it while working on the weekend quiz.",
        actionableTip: "Upload the `.Rmd` solution file right after the last tutorial section on Thursday.",
      },
    ],
    metrics: {
      helpfulness: 94,
      clarity: 95,
      responsiveness: 91,
      totalReviews: 29,
    },
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    courseCode: "CS 246",
    term: "Spring 2026",
    instructorName: "Prof. Jordan Bradfield",
    taName: "Maya Chen",
    checkpointType: "Post-Course Reflection",
    reviewerContext: {
      attendance: "Attended 80%+ lectures",
      officeHoursUsed: "Regular TA/Prof OH user",
      reasonForTaking: "Core Requirement",
      workloadFelt: "Heavy but fair",
    },
    studentAdvice:
      "If you learn best by seeing live code built and broken in real time, take Prof. Bradfield's section. Don't passively watch lectures—type along or review the terminal logs the same day. For assignments, write your test suite (A1–A4) BEFORE writing the C++ implementation, and go to Maya Chen's Tutorial 101 for Valgrind/RAII pointers.",
    schoolFeedback:
      "The jump from Assignment 4 to the final group project (DD2) in Week 9–11 is brutal because students are learning Observer/Decorator patterns while simultaneously architecting a 3-person codebase. Splitting DD1 into an earlier graded architecture review with a TA would prevent massive Week 11 burnout.",
    taFeedback:
      "Maya Chen's Tutorial 101 was the single highest-ROI hour of my week. Her diagram of lvalue/rvalue references and move constructors made A3 click immediately.",
    overallExperience: "Positive",
    substanceScore: 96,
    substanceStatus: "Verified Substantive",
    substanceBreakdown: {
      hasSpecifics: true,
      hasActionableCritique: true,
      respectfulTone: true,
      contextProvided: true,
    },
    styleTags: ["hands-on", "live-coding", "ta-mentorship"],
    componentTags: ["Lectures", "Assignments/Labs", "TA & Tutorials"],
    helpfulCount: 42,
    createdAt: "2 weeks ago",
    linkedIssueId: "iss-1",
    schoolResponse: {
      responder: "CS 246 Course Coordination Team",
      role: "Cheriton School of CS",
      date: "Fall 2026 Curriculum Update",
      message:
        "Addressed! Based on this and 33 similar reviews, we split the final project design phase into two checkpoints and added a mandatory Week 9 TA Architecture Review.",
      status: "Addressed",
    },
  },
  {
    id: "rev-2",
    courseCode: "CS 246",
    term: "Spring 2026",
    instructorName: "Prof. Jordan Bradfield",
    taName: "Maya Chen",
    checkpointType: "Mid-Term Pulse",
    reviewerContext: {
      attendance: "Watched recordings",
      officeHoursUsed: "Occasional Piazza/Ed",
      reasonForTaking: "Core Requirement",
      workloadFelt: "Overwhelming spikes",
    },
    studentAdvice:
      "Honest warning for visual/slide learners: there are almost no polished PowerPoint slides in this course. You rely on student-taken or official stripped lecture notes. If you fall behind on bash and C++ references in Week 3, Assignment 3 will take 20+ hours. Pair up with someone for study prep early.",
    schoolFeedback:
      "Marmoset secret test feedback on Assignment 3 is overly punitive: failing one edge case in the copy constructor cascades into 6 failed release tests with zero diagnostic output beyond 'Segmentation Fault'. Please release a starter Valgrind harness or give partial diagnostics on release tokens.",
    taFeedback:
      "Attended the TA debugging clinic before A3 due date—TAs were super helpful, though the queue was 40 mins long on Thursday night.",
    overallExperience: "Critical / Needs Reform",
    substanceScore: 92,
    substanceStatus: "Verified Substantive",
    substanceBreakdown: {
      hasSpecifics: true,
      hasActionableCritique: true,
      respectfulTone: true,
      contextProvided: true,
    },
    styleTags: ["structured-slides", "hands-on"],
    componentTags: ["Assignments/Labs", "Course Infrastructure", "TA & Tutorials"],
    helpfulCount: 38,
    createdAt: "1 month ago",
    linkedIssueId: "iss-2",
    schoolResponse: {
      responder: "Lead Instructional Support Tutor",
      role: "CS 246 Staff",
      date: "Fall 2026 Update",
      message:
        "We heard you on cascading Marmoset failures. Release tests now isolate copy/move constructors independently, and we ship a pre-check memory script with A3 starter code.",
      status: "Addressed",
    },
  },
  {
    id: "rev-low-1",
    courseCode: "CS 246",
    term: "Spring 2026",
    instructorName: "Prof. Jordan Bradfield",
    checkpointType: "Post-Course Reflection",
    reviewerContext: {
      attendance: "Mostly self-studied",
      officeHoursUsed: "Did not use OH",
      reasonForTaking: "Core Requirement",
      workloadFelt: "Overwhelming spikes",
    },
    studentAdvice:
      "Trash course avoid at all costs. Marmoset is pure evil and ruined my GPA. Worst experience of 2A.",
    schoolFeedback: "Delete Marmoset and make exams easier.",
    overallExperience: "Critical / Needs Reform",
    substanceScore: 22,
    substanceStatus: "Flagged: Low Substance / Rant",
    substanceBreakdown: {
      hasSpecifics: false,
      hasActionableCritique: false,
      respectfulTone: true,
      contextProvided: true,
    },
    styleTags: [],
    componentTags: ["Course Infrastructure"],
    helpfulCount: 2,
    createdAt: "1 month ago",
  },
  {
    id: "rev-3",
    courseCode: "CS 341",
    term: "Winter 2026",
    instructorName: "Prof. Elena Rostova",
    taName: "Maya Chen",
    checkpointType: "Post-Course Reflection",
    reviewerContext: {
      attendance: "Attended 80%+ lectures",
      officeHoursUsed: "Regular TA/Prof OH user",
      reasonForTaking: "Core Requirement",
      workloadFelt: "Manageable",
    },
    studentAdvice:
      "Prof. Rostova's section is gold if you like structured, step-by-step visual traces of algorithms before diving into formal proofs. Do every single tutorial problem before attempting the written assignments—the midterm questions closely mirror the level of rigor practiced in tutorial.",
    schoolFeedback:
      "Written Assignment 2 (Dynamic Programming) had inconsistent marking across different TA graders regarding how much justification was needed for subproblem array bounds. A standardized proof rubric checklist distributed to both students and markers would make grading much fairer.",
    taFeedback:
      "Maya Chen's greedy exchange argument proof template in TUT 104 should be included in the official course notes!",
    overallExperience: "Positive",
    substanceScore: 95,
    substanceStatus: "Verified Substantive",
    substanceBreakdown: {
      hasSpecifics: true,
      hasActionableCritique: true,
      respectfulTone: true,
      contextProvided: true,
    },
    styleTags: ["structured-slides", "theory-rigor", "ta-mentorship"],
    componentTags: ["Lectures", "Assignments/Labs", "TA & Tutorials"],
    helpfulCount: 31,
    createdAt: "3 weeks ago",
    linkedIssueId: "iss-3",
    schoolResponse: {
      responder: "Prof. Elena Rostova",
      role: "CS 341 Instructor",
      date: "Fall 2026",
      message:
        "Adopted! We published a standardized DP & Greedy Proof Rubric Template on LEARN and integrated Maya's exchange argument checklist into Week 4 tutorials.",
      status: "Addressed",
    },
  },
  {
    id: "rev-4",
    courseCode: "ECE 252",
    term: "Winter 2026",
    instructorName: "Prof. Marcus Vance",
    taName: "Devon Patel",
    checkpointType: "Post-Course Reflection",
    reviewerContext: {
      attendance: "Attended 80%+ lectures",
      officeHoursUsed: "Regular TA/Prof OH user",
      reasonForTaking: "Core Requirement",
      workloadFelt: "Heavy but fair",
    },
    studentAdvice:
      "Prof. Vance explains concurrency with awesome real-world server outage stories. Don't wait until the weekend before Lab 3 or Lab 4 is due—concurrency bugs are non-deterministic and cannot be brute-forced at 2 AM. Learn `valgrind --tool=helgrind` in Week 2.",
    schoolFeedback:
      "The `ecetesla` lab servers became completely unresponsive for 6 hours before the Lab 3 deadline because 180 students were running multi-threaded cURL benchmarks simultaneously. Please provide a local Docker image or expand server cluster capacity.",
    taFeedback:
      "Devon Patel saved our lab group twice—he showed us how to use ThreadSanitizer to pinpoint a lock-ordering inversion in 10 minutes.",
    overallExperience: "Positive",
    substanceScore: 94,
    substanceStatus: "Verified Substantive",
    substanceBreakdown: {
      hasSpecifics: true,
      hasActionableCritique: true,
      respectfulTone: true,
      contextProvided: true,
    },
    styleTags: ["hands-on", "ta-mentorship", "continuous-eval"],
    componentTags: ["Assignments/Labs", "Course Infrastructure", "TA & Tutorials"],
    helpfulCount: 29,
    createdAt: "1 month ago",
    linkedIssueId: "iss-4",
  },
  {
    id: "rev-5",
    courseCode: "STAT 231",
    term: "Spring 2026",
    instructorName: "Prof. Hannah Lin",
    taName: "Liam O'Connor",
    checkpointType: "Mid-Term Pulse",
    reviewerContext: {
      attendance: "Attended 80%+ lectures",
      officeHoursUsed: "Regular TA/Prof OH user",
      reasonForTaking: "Core Requirement",
      workloadFelt: "Manageable",
    },
    studentAdvice:
      "Ignore the intimidating 300-page course notes PDF at first and attend Prof. Lin's lectures + Liam O'Connor's tutorials. They translate the Greek-letter notation into a clear 4-step recipe. Memorize the exact PPDAC and Confidence Interval conclusion templates because grading is very strict on phrasing.",
    schoolFeedback:
      "The R assignments feel completely disconnected from the lectures—we spend zero lecture time on R syntax, yet the assignment deducts marks for minor plot formatting details not specified in the prompt. Please publish explicit grading rubrics for R plots and add a 10-minute R demo in tutorial.",
    taFeedback:
      "Liam O'Connor's tutorial summary sheets are way clearer than the official textbook.",
    overallExperience: "Mixed / Constructive",
    substanceScore: 91,
    substanceStatus: "Verified Substantive",
    substanceBreakdown: {
      hasSpecifics: true,
      hasActionableCritique: true,
      respectfulTone: true,
      contextProvided: true,
    },
    styleTags: ["structured-slides", "ta-mentorship"],
    componentTags: ["Lectures", "Assignments/Labs", "Midterm/Final", "TA & Tutorials"],
    helpfulCount: 45,
    createdAt: "3 weeks ago",
    linkedIssueId: "iss-5",
  },
];

export const INITIAL_DEPARTMENT_ISSUES: DepartmentIssue[] = [
  {
    id: "iss-1",
    courseCode: "CS 246",
    title: "Week 9–11 Workload Spike & Group Project Architecture Bottleneck",
    category: "Workload & Pacing",
    severity: "High",
    mentionCount: 34,
    termsAffected: ["Winter 2026", "Spring 2026"],
    aiSynthesizedSummary:
      "Students consistently report that Assignment 4 overlaps too closely with the design phase (DD1) of the final C++ group project. Teams write thousands of lines of code before receiving TA feedback on their UML class design, causing severe Week 11 refactoring crunch.",
    sampleQuotes: [
      "Splitting DD1 into an earlier graded architecture review with a TA would prevent massive Week 11 burnout.",
      "We didn't get feedback on our Observer pattern design until 4 days before the final code freeze.",
    ],
    recommendedAction:
      "Trim Assignment 4 by 20% and introduce a mandatory 15-minute TA Architecture Check-in during Week 9 tutorials.",
    status: "Addressed in Curriculum",
    officialResolution:
      "Implemented for Fall 2026: Reduced A4 scope and added graded Week 9 TA Design Review in tutorials. Mid-term pulse shows 41% fewer late token usages.",
    updatedBy: "CS Undergraduate Curriculum Committee",
  },
  {
    id: "iss-2",
    courseCode: "CS 246",
    title: "Cascading Marmoset Release Test Failures on Assignment 3 (Memory / RAII)",
    category: "Lab & Tooling Infra",
    severity: "High",
    mentionCount: 28,
    termsAffected: ["Spring 2026"],
    aiSynthesizedSummary:
      "Even students who enjoy the course flag that a single edge-case bug in the copy constructor causes 6+ release tests to fail with 'Segmentation Fault' and no Valgrind trace, encouraging guesswork instead of systematic debugging.",
    sampleQuotes: [
      "Failing one edge case in the copy constructor cascades into 6 failed release tests with zero diagnostic output.",
      "Release a starter Valgrind harness or isolate move/copy tests on Marmoset.",
    ],
    recommendedAction:
      "Decouple copy/move constructor release test suites on Marmoset and provide a pre-submission Valgrind diagnostic script.",
    status: "Addressed in Curriculum",
    officialResolution:
      "Updated Marmoset test harness for Fall 2026 to isolate constructor tests and bundled `run-valgrind-check.sh` in starter repo.",
    updatedBy: "Lead Instructional Support Tutor",
  },
  {
    id: "iss-4",
    courseCode: "ECE 252",
    title: "SSH & CPU Starvation on `ecetesla` Cluster Before Concurrency Lab Deadlines",
    category: "Lab & Tooling Infra",
    severity: "High",
    mentionCount: 41,
    termsAffected: ["Fall 2025", "Winter 2026"],
    aiSynthesizedSummary:
      "Concurrent execution of multi-threaded Lab 3/4 benchmarks by 150+ students saturates the shared `ecetesla` servers, causing false-positive timeout failures and SSH lockouts on deadline nights.",
    sampleQuotes: [
      "The `ecetesla` lab servers became completely unresponsive for 6 hours before the Lab 3 deadline.",
      "Please provide a local Docker image with ThreadSanitizer so we don't have to develop on laggy SSH.",
    ],
    recommendedAction:
      "Publish an official local Docker development container and isolate grading benchmark nodes from interactive student SSH nodes.",
    status: "In Progress",
    officialResolution:
      "Docker container shipped for Fall 2026; IT is currently provisioning 4 isolated benchmark blades before Lab 3 opens.",
    updatedBy: "ECE Systems Lab Coordinator",
  },
  {
    id: "iss-5",
    courseCode: "STAT 231",
    title: "Disconnect Between Lecture Derivations and R Data Analysis Rubric Expectations",
    category: "Assessment Alignment",
    severity: "High",
    mentionCount: 47,
    termsAffected: ["Winter 2026", "Spring 2026"],
    aiSynthesizedSummary:
      "Substantive reviews across both positive and critical students highlight that R coding assignments deduct marks for undocumented plot formatting rules and R functions never demonstrated in lecture.",
    sampleQuotes: [
      "We spend zero lecture time on R syntax, yet the assignment deducts marks for minor plot formatting details not specified in the prompt.",
      "Adding a 10-minute R walkthrough in weekly TA tutorials and publishing the rubric checklist would fix 90% of student frustration.",
    ],
    recommendedAction:
      "Publish item-level R plotting rubrics alongside each assignment spec and dedicate 15 minutes of TA tutorials to RStudio demos.",
    status: "Needs Action",
  },
  {
    id: "iss-3",
    courseCode: "CS 341",
    title: "Inter-TA Grading Variance on Dynamic Programming Correctness Proofs",
    category: "Assessment Alignment",
    severity: "Medium",
    mentionCount: 19,
    termsAffected: ["Winter 2026"],
    aiSynthesizedSummary:
      "Students noticed varying point deductions across Crowdmark graders for how formally base cases and subproblem ordering were justified on Written Assignment 2.",
    sampleQuotes: [
      "A standardized proof rubric checklist distributed to both students and markers would make grading much fairer.",
    ],
    recommendedAction:
      "Distribute a 1-page 'Standard Proof & Runtime Justification Checklist' prior to A1 and run a pre-marking calibration check.",
    status: "Addressed in Curriculum",
    officialResolution:
      "Published Proof Rubric Template on LEARN and integrated TA Maya Chen's proof checklist into Week 4 tutorials.",
    updatedBy: "Prof. Elena Rostova",
  },
];
