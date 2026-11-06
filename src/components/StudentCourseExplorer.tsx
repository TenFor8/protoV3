"use client";

import React, { useState, useMemo } from "react";
import {
  Course,
  Instructor,
  LearningStyleTag,
  Review,
  ReviewComponentTag,
  TAProfile,
} from "@/types";
import { LEARNING_STYLE_OPTIONS } from "@/data/mockData";
import {
  Sparkles,
  ShieldCheck,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  Users,
  MessageSquare,
  ThumbsUp,
  ArrowUpRight,
  SlidersHorizontal,
  Eye,
  EyeOff,
  GraduationCap,
  Building2,
  Layers,
} from "lucide-react";

interface StudentCourseExplorerProps {
  courses: Course[];
  instructors: Instructor[];
  tas: TAProfile[];
  reviews: Review[];
  selectedCourseId: string;
  onSelectCourse: (id: string) => void;
  onOpenReviewModal: (courseCode: string) => void;
  onNavigateToTA: (taName: string) => void;
  onNavigateToBackendIssue: (issueId?: string) => void;
}

export default function StudentCourseExplorer({
  courses,
  instructors,
  tas,
  reviews,
  selectedCourseId,
  onSelectCourse,
  onOpenReviewModal,
  onNavigateToTA,
  onNavigateToBackendIssue,
}: StudentCourseExplorerProps) {
  const [selectedStyles, setSelectedStyles] = useState<LearningStyleTag[]>([
    "hands-on",
    "ta-mentorship",
  ]);
  const [hideLowSubstance, setHideLowSubstance] = useState<boolean>(true);
  const [selectedComponent, setSelectedComponent] = useState<
    ReviewComponentTag | "All"
  >("All");
  const [selectedSentiment, setSelectedSentiment] = useState<
    Review["overallExperience"] | "All"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});

  const toggleStyle = (style: LearningStyleTag) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const calculateStyleMatch = (itemStyles: LearningStyleTag[]) => {
    if (selectedStyles.length === 0) return 85;
    const overlap = itemStyles.filter((s) => selectedStyles.includes(s)).length;
    const ratio = overlap / Math.min(selectedStyles.length, 3);
    return Math.min(99, Math.round(58 + ratio * 40));
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(
      (c) =>
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  const activeCourse =
    courses.find((c) => c.id === selectedCourseId) || courses[0];

  const courseInstructors = instructors.filter((inst) =>
    inst.courses.includes(activeCourse.code)
  );
  const courseTAs = tas.filter((ta) =>
    ta.coursesTaught.some((ct) => ct.code === activeCourse.code)
  );

  const courseReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (r.courseCode !== activeCourse.code) return false;
      if (hideLowSubstance && r.substanceScore < 55) return false;
      if (
        selectedComponent !== "All" &&
        !r.componentTags.includes(selectedComponent)
      )
        return false;
      if (
        selectedSentiment !== "All" &&
        r.overallExperience !== selectedSentiment
      )
        return false;
      return true;
    });
  }, [
    reviews,
    activeCourse.code,
    hideLowSubstance,
    selectedComponent,
    selectedSentiment,
  ]);

  const hiddenLowSubstanceCount = useMemo(() => {
    return reviews.filter(
      (r) => r.courseCode === activeCourse.code && r.substanceScore < 55
    ).length;
  }, [reviews, activeCourse.code]);

  const courseFitScore = calculateStyleMatch(activeCourse.styleTags);

  return (
    <div className="space-y-6">
      {/* Personal Learning Style Matcher Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-700/80">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Anti-Bias Style Matcher (Replaces Raw &ldquo;Liked %&rdquo;)
            </div>
            <h2 className="text-lg font-bold">
              How do you learn best? Select your preferences to match with
              courses, instructors &amp; TAs
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Instead of a single polarized rating from upset students, see how
              each course aligns with your actual learning style.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/90 px-3 py-2 rounded-xl border border-slate-700">
            <SlidersHorizontal className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>{selectedStyles.length}</strong> learning preferences
              active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-4">
          {LEARNING_STYLE_OPTIONS.map((option) => {
            const active = selectedStyles.includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => toggleStyle(option.id)}
                className={`text-left p-3 rounded-xl border transition-all ${
                  active
                    ? "bg-amber-400/15 border-amber-400 text-white shadow-sm"
                    : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold leading-tight">
                    {option.label}
                  </span>
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                      active
                        ? "bg-amber-400 text-slate-950 font-bold"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {active ? "✓" : "+"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-snug">
                  {option.shortDesc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Course Selector Sidebar + Active Course Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Course List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Explore UW Courses
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search CS 246, CS 341, ECE 252, STAT 231..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />

            <div className="mt-3 space-y-2.5">
              {filteredCourses.map((course) => {
                const isSelected = course.id === activeCourse.id;
                const matchPct = calculateStyleMatch(course.styleTags);
                return (
                  <button
                    key={course.id}
                    onClick={() => onSelectCourse(course.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-md"
                        : "bg-slate-50/70 hover:bg-slate-100 text-slate-900 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{course.code}</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          matchPct >= 85
                            ? isSelected
                              ? "bg-emerald-400/20 text-emerald-300"
                              : "bg-emerald-100 text-emerald-800"
                            : isSelected
                            ? "bg-amber-400/20 text-amber-300"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {matchPct}% Style Fit
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-1 font-medium line-clamp-1 ${
                        isSelected ? "text-slate-200" : "text-slate-600"
                      }`}
                    >
                      {course.name}
                    </p>
                    <div className="flex items-center gap-3 mt-2.5 text-[11px]">
                      <span
                        className={
                          isSelected ? "text-slate-300" : "text-slate-500"
                        }
                      >
                        TA Support: <strong>{course.taSupportScore}%</strong>
                      </span>
                      <span
                        className={
                          isSelected ? "text-slate-300" : "text-slate-500"
                        }
                      >
                        ~{course.weeklyHours}h/wk
                      </span>
                      <span
                        className={`ml-auto ${
                          isSelected ? "text-amber-300" : "text-emerald-700"
                        } font-medium`}
                      >
                        {course.changelog.length} School Fixes
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Why Our Metrics Differ From UWFlow Explainer Card */}
          <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-950 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-900 text-sm">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              How We Prevent &ldquo;Salty Grade Bias&rdquo;
            </div>
            <p className="leading-relaxed text-amber-900/90">
              On traditional sites like UWFlow, reviews spike right after final
              grades drop—skewing heavily toward frustrated students.
            </p>
            <ul className="space-y-1.5 pt-1 text-amber-900/90">
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-amber-700">1.</span>
                <span>
                  <strong>Mid-Term Pulse vs. Post-Exam:</strong> We collect
                  structured check-ins in Week 6 before final exam saltiness.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-amber-700">2.</span>
                <span>
                  <strong>Substance ≠ Censorship:</strong> Harsh critiques are{" "}
                  <em>highlighted</em> when they cite specific labs, exams, or
                  pacing—while zero-substance personal attacks are coached into
                  actionable feedback.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Main Column: Course Details, Changelog, Teaching Team & Reviews */}
        <div className="lg:col-span-8 space-y-6">
          {/* Course Header Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-amber-400 font-extrabold text-sm">
                    {activeCourse.code}
                  </span>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {activeCourse.department}
                  </span>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {courseFitScore}% Match for Your Learning Style
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
                  {activeCourse.name}
                </h1>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {activeCourse.description}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  <strong>Prerequisites:</strong> {activeCourse.prereqs}
                </p>
              </div>

              <button
                onClick={() => onOpenReviewModal(activeCourse.code)}
                className="shrink-0 inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Write Structured Review
              </button>
            </div>

            {/* 4-Pillar Nuanced Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-100">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="text-[11px] font-semibold text-slate-500">
                  Intellectual Value
                </div>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {activeCourse.intellectualValue}%
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full"
                    style={{ width: `${activeCourse.intellectualValue}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="text-[11px] font-semibold text-slate-500">
                  Structure &amp; Clarity
                </div>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {activeCourse.structureClarity}%
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full"
                    style={{ width: `${activeCourse.structureClarity}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="text-[11px] font-semibold text-slate-500">
                  Assessment Fairness
                </div>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {activeCourse.assessmentFairness}%
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
                  <div
                    className="bg-amber-500 h-1.5 rounded-full"
                    style={{ width: `${activeCourse.assessmentFairness}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="text-[11px] font-semibold text-slate-500">
                  TA &amp; Tutorial Support
                </div>
                <div className="text-xl font-extrabold text-emerald-700 mt-0.5">
                  {activeCourse.taSupportScore}%
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: `${activeCourse.taSupportScore}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 col-span-2 sm:col-span-1">
                <div className="text-[11px] font-semibold text-slate-500">
                  Mid-Term vs. Final
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-lg font-extrabold text-slate-900">
                    {activeCourse.midTermPulsePositive}%
                  </span>
                  <span className="text-xs text-slate-500">
                    → {activeCourse.endOfTermPositive}%
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1.5">
                  {activeCourse.responseRate}% verified cohort pulse
                </div>
              </div>
            </div>

            {/* Best For vs Watch Out For */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Who Thrives in {activeCourse.code}
                </h3>
                <ul className="mt-2 space-y-1.5 text-xs text-emerald-950">
                  {activeCourse.bestFor.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Constructive Heads-Up (From Past Cohorts)
                </h3>
                <ul className="mt-2 space-y-1.5 text-xs text-amber-950">
                  {activeCourse.watchOutFor.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Closed-Loop School Action Log ("You Spoke, We Updated") */}
          <div className="bg-white rounded-2xl p-6 border-2 border-indigo-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                  <Building2 className="w-3.5 h-3.5" />
                  Closed-Loop Department Accountability
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-1">
                  &ldquo;You Spoke, The School Updated&rdquo; — Course Changelog
                </h2>
                <p className="text-xs text-slate-600">
                  On UWFlow, recurring course issues go unaddressed for years.
                  Here, substantive student critiques feed directly into the
                  Department Backend and track official curriculum fixes.
                </p>
              </div>
              <button
                onClick={() => onNavigateToBackendIssue()}
                className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-colors"
              >
                Open School Backend
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {activeCourse.changelog.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-xs font-bold">
                        {log.term} Fix
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {log.author}
                      </span>
                      <span className="text-xs text-slate-500">
                        ({log.role})
                      </span>
                    </div>
                    {log.impactMetric && (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        Impact: {log.impactMetric}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-1">
                    <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200/60 text-rose-950">
                      <span className="font-bold text-rose-800 block mb-0.5">
                        Student Issue Surfaced on Backend:
                      </span>
                      {log.issueRaised}
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/60 text-emerald-950">
                      <span className="font-bold text-emerald-800 block mb-0.5">
                        Concrete School / Instructor Action Taken:
                      </span>
                      {log.actionTaken}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructors & Public TA Teaching Profiles for this Course */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Instructor Style Match */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  Instructor Teaching Style
                </h3>
                <span className="text-[11px] text-slate-500">
                  Style fit over raw star ratings
                </span>
              </div>
              {courseInstructors.map((inst) => {
                const instFit = calculateStyleMatch(inst.styleTags);
                return (
                  <div
                    key={inst.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-slate-900">
                          {inst.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {inst.deliveryMode} • {inst.pace}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">
                        {instFit}% Fit
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {inst.teachingStyleSummary}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {inst.strengths.map((s, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Course TAs (Opt-In Public Visibility!) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  Verified Course TAs &amp; Tutorials
                </h3>
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Opt-In Public Profiles
                </span>
              </div>
              <div className="space-y-3">
                {courseTAs.map((ta) => (
                  <div
                    key={ta.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          {ta.name}
                          <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">
                            {
                              ta.coursesTaught.find(
                                (c) => c.code === activeCourse.code
                              )?.section
                            }
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {ta.role}
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigateToTA(ta.name)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 shrink-0"
                      >
                        TA Portfolio
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {ta.bio}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {ta.superpowers.slice(0, 2).map((sp, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-indigo-50 text-indigo-900 border border-indigo-200/60 px-2 py-0.5 rounded-md font-medium"
                        >
                          ★ {sp.label} ({sp.count})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Substance-Filtered Student Reviews Section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-amber-500" />
                  Dual-Purpose Student Reviews ({courseReviews.length})
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Every substantive review includes{" "}
                  <strong>(1) Peer Advice for Students</strong> and{" "}
                  <strong>(2) Actionable Feedback for the School</strong>.
                  Negative reviews with real substance are never hidden.
                </p>
              </div>

              {/* Substance Filter Toggle */}
              <button
                onClick={() => setHideLowSubstance(!hideLowSubstance)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                  hideLowSubstance
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                    : "bg-rose-50 border-rose-300 text-rose-900"
                }`}
              >
                {hideLowSubstance ? (
                  <>
                    <Eye className="w-4 h-4 text-emerald-600" />
                    Substance Filter ON ({hiddenLowSubstanceCount} low-effort
                    rant hidden)
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4 text-rose-600" />
                    Showing All (Including {hiddenLowSubstanceCount} flagged
                    low-substance rant)
                  </>
                )}
              </button>
            </div>

            {/* Component & Experience Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500 mr-1">
                  Topic:
                </span>
                {(
                  [
                    "All",
                    "Lectures",
                    "Assignments/Labs",
                    "Midterm/Final",
                    "TA & Tutorials",
                    "Course Infrastructure",
                  ] as const
                ).map((comp) => (
                  <button
                    key={comp}
                    onClick={() => setSelectedComponent(comp)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedComponent === comp
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {comp}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500 mr-1">
                  Perspective:
                </span>
                {(
                  [
                    "All",
                    "Positive",
                    "Mixed / Constructive",
                    "Critical / Needs Reform",
                  ] as const
                ).map((sent) => (
                  <button
                    key={sent}
                    onClick={() => setSelectedSentiment(sent)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedSentiment === sent
                        ? "bg-amber-400 text-slate-950 font-bold"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {sent}
                  </button>
                ))}
              </div>
            </div>

            {/* Review Cards */}
            <div className="space-y-4">
              {courseReviews.map((review) => {
                const isLowSubstance = review.substanceScore < 55;
                const voted = helpfulVotes[review.id] || false;

                return (
                  <div
                    key={review.id}
                    className={`rounded-2xl p-5 border transition-all ${
                      isLowSubstance
                        ? "bg-rose-50/40 border-rose-300 border-dashed"
                        : "bg-white border-slate-200 shadow-sm"
                    }`}
                  >
                    {/* Top Metadata Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                            review.overallExperience === "Positive"
                              ? "bg-emerald-100 text-emerald-800"
                              : review.overallExperience ===
                                "Mixed / Constructive"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {review.overallExperience}
                        </span>

                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                            isLowSubstance
                              ? "bg-rose-200 text-rose-900"
                              : "bg-slate-900 text-amber-300"
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Substance: {review.substanceScore}/100 (
                          {review.substanceStatus})
                        </span>

                        <span className="text-xs font-semibold bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-lg">
                          {review.checkpointType}
                        </span>

                        <span className="text-xs text-slate-500">
                          {review.term} • {review.instructorName}
                        </span>
                      </div>

                      <span className="text-xs text-slate-400">
                        {review.createdAt}
                      </span>
                    </div>

                    {/* Reviewer Context Strip */}
                    <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-700">
                        Reviewer Context:
                      </span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                        {review.reviewerContext.attendance}
                      </span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                        {review.reviewerContext.officeHoursUsed}
                      </span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                        {review.reviewerContext.reasonForTaking}
                      </span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                        Workload: {review.reviewerContext.workloadFelt}
                      </span>
                    </div>

                    {/* Dual-Purpose Review Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                          <Users className="w-3.5 h-3.5 text-indigo-600" />
                          For Future Students (Fit &amp; Study Strategy)
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {review.studentAdvice}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/80">
                        <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5 mb-1.5">
                          <Building2 className="w-3.5 h-3.5 text-amber-600" />
                          For the School / Course Team (Backend Feed)
                        </div>
                        <p className="text-xs text-slate-800 leading-relaxed">
                          {review.schoolFeedback}
                        </p>
                      </div>
                    </div>

                    {/* Optional TA Feedback Highlight */}
                    {review.taFeedback && (
                      <div className="mt-3 p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/70 flex items-start justify-between gap-3">
                        <div className="text-xs text-indigo-950">
                          <span className="font-bold text-indigo-800">
                            TA &amp; Tutorial Feedback (
                            {review.taName || "Course TAs"}):{" "}
                          </span>
                          {review.taFeedback}
                        </div>
                        {review.taName && (
                          <button
                            onClick={() => onNavigateToTA(review.taName!)}
                            className="shrink-0 text-[11px] font-bold text-indigo-700 hover:underline"
                          >
                            View {review.taName} →
                          </button>
                        )}
                      </div>
                    )}

                    {/* Official School / Department Response (Closed Loop!) */}
                    {review.schoolResponse && (
                      <div className="mt-3 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-bold uppercase">
                              School Action: {review.schoolResponse.status}
                            </span>
                            <span className="text-xs font-bold text-emerald-950">
                              {review.schoolResponse.responder}
                            </span>
                            <span className="text-[11px] text-emerald-700">
                              • {review.schoolResponse.date}
                            </span>
                          </div>
                          <p className="text-xs text-emerald-900 pt-1">
                            {review.schoolResponse.message}
                          </p>
                        </div>
                        {review.linkedIssueId && (
                          <button
                            onClick={() =>
                              onNavigateToBackendIssue(review.linkedIssueId)
                            }
                            className="shrink-0 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            View Dept Ticket
                          </button>
                        )}
                      </div>
                    )}

                    {/* Bottom Tags + Helpful Counter */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {review.componentTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        {review.linkedIssueId && !review.schoolResponse && (
                          <button
                            onClick={() =>
                              onNavigateToBackendIssue(review.linkedIssueId)
                            }
                            className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1 mr-2"
                          >
                            <Layers className="w-3.5 h-3.5" />
                            Tracked in School Backend
                          </button>
                        )}
                        <button
                          onClick={() =>
                            setHelpfulVotes((prev) => ({
                              ...prev,
                              [review.id]: !prev[review.id],
                            }))
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                            voted
                              ? "bg-amber-400/20 border-amber-400 text-slate-900"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          Helpful ({review.helpfulCount + (voted ? 1 : 0)})
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
