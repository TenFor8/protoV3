"use client";

import React, { useState, useMemo } from "react";
import {
  Course,
  Instructor,
  LearningStyleTag,
  Review,
  TAProfile,
} from "@/types";
import { LEARNING_STYLE_OPTIONS } from "@/data/mockData";
import { analyzeReviewSubstance } from "@/utils/substanceAnalyzer";
import {
  X,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Ban,
  Wand2,
  CheckCircle2,
  Send,
  GraduationCap,
  Building2,
  Users,
  Lock,
} from "lucide-react";

interface GuidedReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  instructors: Instructor[];
  tas: TAProfile[];
  initialCourseCode?: string;
  initialTAName?: string;
  onSubmitReview: (
    newReview: Review,
    newTAEndorsement?: { taName: string; quote: string; context: string },
    newTAPrivateTip?: { taName: string; note: string; actionableTip: string },
    autoCreateBackendIssue?: {
      courseCode: string;
      title: string;
      summary: string;
      quote: string;
    }
  ) => void;
}

export default function GuidedReviewModal({
  isOpen,
  onClose,
  courses,
  instructors,
  tas,
  initialCourseCode = "CS 246",
  initialTAName = "Maya Chen",
  onSubmitReview,
}: GuidedReviewModalProps) {
  const [courseCode, setCourseCode] = useState(initialCourseCode);
  const [checkpointType, setCheckpointType] = useState<
    Review["checkpointType"]
  >("Mid-Term Pulse");
  const [overallExperience, setOverallExperience] = useState<
    Review["overallExperience"]
  >("Mixed / Constructive");
  const [attendance, setAttendance] = useState<
    Review["reviewerContext"]["attendance"]
  >("Attended 80%+ lectures");
  const [officeHoursUsed, setOfficeHoursUsed] = useState<
    Review["reviewerContext"]["officeHoursUsed"]
  >("Regular TA/Prof OH user");
  const [workloadFelt, setWorkloadFelt] = useState<
    Review["reviewerContext"]["workloadFelt"]
  >("Heavy but fair");

  const [studentAdvice, setStudentAdvice] = useState(
    "Start assignments at least 5 days before the due date and attend the weekly tutorials. If you prefer structured slides, pair the lectures with the tutorial problem sets."
  );
  const [schoolFeedback, setSchoolFeedback] = useState(
    "Assignment 3 and the midterm fell in the same week, creating a severe workload spike. Spacing the A3 deadline by 48 hours or releasing practice test cases earlier would improve learning."
  );
  const [selectedTA, setSelectedTA] = useState(initialTAName);
  const [taFeedback, setTaFeedback] = useState(
    "Walked through pointer edge cases step-by-step on the whiteboard during Tutorial 101 and stayed after class to answer questions."
  );
  const [privateTATip, setPrivateTATip] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<LearningStyleTag[]>([
    "hands-on",
    "ta-mentorship",
  ]);
  const [wasCoached, setWasCoached] = useState(false);

  const courseInstructor =
    instructors.find((i) => i.courses.includes(courseCode))?.name ||
    "Course Instructor";

  const analysis = useMemo(() => {
    return analyzeReviewSubstance(studentAdvice, schoolFeedback, taFeedback, true);
  }, [studentAdvice, schoolFeedback, taFeedback]);

  if (!isOpen) return null;

  const applyPreset = (
    type:
      | "inappropriate-rant"
      | "vague-complaint"
      | "substantive-critical"
      | "constructive-ta"
  ) => {
    setWasCoached(false);
    if (type === "inappropriate-rant") {
      setOverallExperience("Critical / Needs Reform");
      setStudentAdvice(
        "Worst person ever, total idiot prof who can't teach. Trash course avoid at all costs!"
      );
      setSchoolFeedback("Fire him immediately, this bullshit course ruined my term.");
      setTaFeedback("");
    } else if (type === "vague-complaint") {
      setOverallExperience("Critical / Needs Reform");
      setStudentAdvice("Trash course avoid at all costs. Way too hard.");
      setSchoolFeedback("Make the exams easier.");
      setTaFeedback("");
    } else if (type === "substantive-critical") {
      setOverallExperience("Critical / Needs Reform");
      setStudentAdvice(
        "Honest warning: do not rely solely on the lecture slides because exam questions test multi-step proof variations not shown in class. Form a study group in Week 2 and work through every tutorial sheet."
      );
      setSchoolFeedback(
        "There is a major disconnect between lecture examples and the Midterm/Assignment 3 grading rubric. We recommend publishing past midterm rubrics and splitting Assignment 3 into an earlier checkpoint."
      );
      setTaFeedback(
        "Tutorial walkthroughs were the one bright spot that helped bridge the gap between lecture and assignments."
      );
    } else if (type === "constructive-ta") {
      setOverallExperience("Positive");
      setStudentAdvice(
        "Hands-on learners will love this course if you code along in lecture and use the TA debugging clinics before submitting to Marmoset."
      );
      setSchoolFeedback(
        "Adding a starter Valgrind script to Assignment 2 (just like Assignment 3) would help students catch memory leaks earlier in the term."
      );
      setTaFeedback(
        "Explained RAII and move constructors visually on the whiteboard—best tutorial section this term!"
      );
      setPrivateTATip(
        "Writing slightly larger on the right side of the chalkboard would help students in the back row of MC 4041."
      );
    }
  };

  const handleApplyCoachRewrite = () => {
    if (!analysis.suggestedRewrite) return;
    setStudentAdvice(analysis.suggestedRewrite.studentAdvice);
    setSchoolFeedback(analysis.suggestedRewrite.schoolFeedback);
    setWasCoached(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysis.isPublishable) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      courseCode,
      term: "Fall 2026",
      instructorName: courseInstructor,
      taName: selectedTA || undefined,
      checkpointType,
      reviewerContext: {
        attendance,
        officeHoursUsed,
        reasonForTaking: "Core Requirement",
        workloadFelt,
      },
      studentAdvice: studentAdvice.trim(),
      schoolFeedback: schoolFeedback.trim(),
      taFeedback: taFeedback.trim() || undefined,
      overallExperience,
      substanceScore: analysis.score,
      substanceStatus: wasCoached ? "Coached & Refined" : "Verified Substantive",
      substanceBreakdown: analysis.breakdown,
      styleTags: selectedStyles,
      componentTags: analysis.detectedThemes,
      helpfulCount: 1,
      createdAt: "Just now",
    };

    const newEndorsement =
      selectedTA && taFeedback.trim().length > 15
        ? {
            taName: selectedTA,
            quote: taFeedback.trim(),
            context: `${checkpointType} • ${officeHoursUsed}`,
          }
        : undefined;

    const newPrivateTip =
      selectedTA && privateTATip.trim().length > 10
        ? {
            taName: selectedTA,
            note: privateTATip.trim(),
            actionableTip:
              "Actionable student suggestion routed privately from Fall 2026 pulse check.",
          }
        : undefined;

    const autoBackendIssue =
      overallExperience === "Critical / Needs Reform" && analysis.score >= 70
        ? {
            courseCode,
            title: `Student-Flagged Friction (${analysis.detectedThemes.join(
              " & "
            )}): Alignment & Pacing`,
            summary: schoolFeedback.trim(),
            quote: schoolFeedback.trim(),
          }
        : undefined;

    onSubmitReview(
      newReview,
      newEndorsement,
      newPrivateTip,
      autoBackendIssue
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Top Modal Header */}
        <div className="sticky top-0 z-10 bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[11px] font-extrabold">
                Substance-Guided Composer
              </span>
              <span className="text-xs text-slate-300">
                Helps Future Students + Feeds the School Curriculum Backend
              </span>
            </div>
            <h2 className="text-lg font-extrabold mt-0.5">
              Submit Structured Course, Instructor &amp; TA Feedback
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Interactive Test Presets Bar */}
          <div className="p-4 rounded-xl bg-indigo-50/90 border border-indigo-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Try Instant Demo Scenarios (Test the Substance vs. Rant Filter!)
              </span>
              <span className="text-[11px] text-indigo-700">
                Click any preset to see live analysis below
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => applyPreset("inappropriate-rant")}
                className="text-left p-2.5 rounded-lg bg-white hover:bg-rose-50 border border-rose-200 text-xs transition-colors"
              >
                <div className="font-bold text-rose-800">
                  1. Personal Attack / Rant
                </div>
                <div className="text-[11px] text-slate-500">
                  Blocked + offers constructive rewrite
                </div>
              </button>
              <button
                type="button"
                onClick={() => applyPreset("vague-complaint")}
                className="text-left p-2.5 rounded-lg bg-white hover:bg-amber-50 border border-amber-200 text-xs transition-colors"
              >
                <div className="font-bold text-amber-900">
                  2. Vague 1-Liner Complaint
                </div>
                <div className="text-[11px] text-slate-500">
                  Flagged for low substance + coached
                </div>
              </button>
              <button
                type="button"
                onClick={() => applyPreset("substantive-critical")}
                className="text-left p-2.5 rounded-lg bg-white hover:bg-emerald-50 border border-emerald-300 text-xs transition-colors"
              >
                <div className="font-bold text-emerald-900">
                  3. Harsh Critique WITH Substance
                </div>
                <div className="text-[11px] text-slate-500">
                  Allowed! Routed to School Backend
                </div>
              </button>
              <button
                type="button"
                onClick={() => applyPreset("constructive-ta")}
                className="text-left p-2.5 rounded-lg bg-white hover:bg-indigo-100 border border-indigo-200 text-xs transition-colors"
              >
                <div className="font-bold text-indigo-900">
                  4. Constructive + TA Praise
                </div>
                <div className="text-[11px] text-slate-500">
                  Public TA quote + private TA tip
                </div>
              </button>
            </div>
          </div>

          {/* Step 1: Course, Timing & Reviewer Context */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Course
              </label>
              <select
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Review Checkpoint (Anti-Bias Timing)
              </label>
              <select
                value={checkpointType}
                onChange={(e) =>
                  setCheckpointType(
                    e.target.value as Review["checkpointType"]
                  )
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
              >
                <option value="Mid-Term Pulse">
                  Mid-Term Pulse (Week 6 — Pre-Final Exam)
                </option>
                <option value="Post-Course Reflection">
                  Post-Course Reflection (End of Term)
                </option>
                <option value="Alumni Retro">
                  Alumni Retro (After Co-op / Next Course)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Overall Experience
              </label>
              <select
                value={overallExperience}
                onChange={(e) =>
                  setOverallExperience(
                    e.target.value as Review["overallExperience"]
                  )
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
              >
                <option value="Positive">Positive</option>
                <option value="Mixed / Constructive">
                  Mixed / Constructive
                </option>
                <option value="Critical / Needs Reform">
                  Critical / Needs Reform (Substantive Critique)
                </option>
              </select>
            </div>
          </div>

          {/* Context Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Lecture Engagement Context
              </label>
              <select
                value={attendance}
                onChange={(e) =>
                  setAttendance(
                    e.target.value as Review["reviewerContext"]["attendance"]
                  )
                }
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
              >
                <option value="Attended 80%+ lectures">
                  Attended 80%+ lectures
                </option>
                <option value="Watched recordings">Watched recordings</option>
                <option value="Mostly self-studied">Mostly self-studied</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                TA / Office Hours Usage
              </label>
              <select
                value={officeHoursUsed}
                onChange={(e) =>
                  setOfficeHoursUsed(
                    e.target
                      .value as Review["reviewerContext"]["officeHoursUsed"]
                  )
                }
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
              >
                <option value="Regular TA/Prof OH user">
                  Regular TA/Prof OH user
                </option>
                <option value="Occasional Piazza/Ed">
                  Occasional Piazza/Ed
                </option>
                <option value="Did not use OH">Did not use OH</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Workload Pacing Felt
              </label>
              <select
                value={workloadFelt}
                onChange={(e) =>
                  setWorkloadFelt(
                    e.target.value as Review["reviewerContext"]["workloadFelt"]
                  )
                }
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
              >
                <option value="Manageable">Manageable</option>
                <option value="Heavy but fair">Heavy but fair</option>
                <option value="Overwhelming spikes">Overwhelming spikes</option>
              </select>
            </div>
          </div>

          {/* Dual-Purpose Guided Text Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                1. For Future Students (Learning Style &amp; Prep Advice)
              </label>
              <p className="text-[11px] text-slate-500">
                How does the instructor teach? Who will thrive here, and what
                study/tutorial habits helped you succeed?
              </p>
              <textarea
                rows={4}
                value={studentAdvice}
                onChange={(e) => setStudentAdvice(e.target.value)}
                placeholder="e.g., Great for hands-on learners who code along in lecture. Start A3 early..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
              <label className="block text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-600" />
                2. For the School / Department Backend (Actionable Reform)
              </label>
              <p className="text-[11px] text-amber-900/80">
                What specific lab, assignment rubric, server bottleneck, or
                pacing jump should the course team fix for next term?
              </p>
              <textarea
                rows={4}
                value={schoolFeedback}
                onChange={(e) => setSchoolFeedback(e.target.value)}
                placeholder="e.g., Assignment 4 overlaps with the project design doc. Splitting DD1 into an earlier checkpoint would..."
                className="w-full p-3 rounded-xl border border-amber-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Step 3: TA Feedback (Public Endorsement + Private Coaching Note) */}
          <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                3. Teaching Assistant (TA) Recognition &amp; Private Growth Note
              </div>
              <select
                value={selectedTA}
                onChange={(e) => setSelectedTA(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-indigo-200 text-xs font-semibold bg-white"
              >
                <option value="">No specific TA selected</option>
                {tas.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name} ({t.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-indigo-900 mb-1">
                  Public TA Endorsement (Tutorials / Office Hours / Debugging)
                </label>
                <input
                  type="text"
                  value={taFeedback}
                  onChange={(e) => setTaFeedback(e.target.value)}
                  placeholder="How did this TA help bridge lecture concepts or debug labs?"
                  className="w-full px-3 py-2 rounded-lg border border-indigo-200 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-600" />
                  Private Constructive Tip for TA Only (Never Public)
                </label>
                <input
                  type="text"
                  value={privateTATip}
                  onChange={(e) => setPrivateTATip(e.target.value)}
                  placeholder="Optional: e.g., Writing larger on the board or posting tutorial code earlier"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                />
              </div>
            </div>
          </div>

          {/* LIVE SUBSTANCE & TONE ANALYZER PANEL */}
          <div
            className={`p-5 rounded-2xl border-2 transition-all ${
              analysis.status === "Blocked: Inappropriate / Personal Attack"
                ? "bg-rose-50 border-rose-400"
                : analysis.status === "Flagged: Low Substance / Rant"
                ? "bg-amber-50 border-amber-400"
                : "bg-emerald-50/70 border-emerald-400"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {analysis.status ===
                "Blocked: Inappropriate / Personal Attack" ? (
                  <Ban className="w-6 h-6 text-rose-600 shrink-0" />
                ) : analysis.status === "Flagged: Low Substance / Rant" ? (
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900">
                      Live Substance Score: {analysis.score}/100
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        analysis.isPublishable
                          ? "bg-emerald-700 text-white"
                          : "bg-rose-700 text-white"
                      }`}
                    >
                      {analysis.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                    {analysis.coachingTip}
                  </p>
                </div>
              </div>

              {!analysis.isPublishable && analysis.suggestedRewrite && (
                <button
                  type="button"
                  onClick={handleApplyCoachRewrite}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-extrabold shadow-sm transition-colors"
                >
                  <Wand2 className="w-4 h-4" />
                  1-Click Reframe into Constructive Critique
                </button>
              )}
            </div>

            {/* 4-Check Diagnostic Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-200/70 text-xs">
              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    analysis.breakdown.respectfulTone
                      ? "text-emerald-600"
                      : "text-rose-500"
                  }`}
                />
                <span className="font-medium text-slate-800">
                  No Personal Attacks
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    analysis.breakdown.hasSpecifics
                      ? "text-emerald-600"
                      : "text-amber-500"
                  }`}
                />
                <span className="font-medium text-slate-800">
                  Cites Specific Course Elements
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    analysis.breakdown.hasActionableCritique
                      ? "text-emerald-600"
                      : "text-amber-500"
                  }`}
                />
                <span className="font-medium text-slate-800">
                  Actionable School Suggestion
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-slate-800">
                  Verified Engagement Context
                </span>
              </div>
            </div>
          </div>

          {/* Submit Footer */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Auto-tagged for School Backend:{" "}
              <strong>{analysis.detectedThemes.join(", ") || "General"}</strong>
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!analysis.isPublishable}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                  analysis.isPublishable
                    ? "bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4" />
                {analysis.isPublishable
                  ? "Publish Substantive Review & Sync to Backend"
                  : "Reframe Review Above to Publish"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
