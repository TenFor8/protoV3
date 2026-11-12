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
  CheckCircle2,
  AlertTriangle,
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
  Search,
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
      {/* Learning Style Matcher Bar - Minimal & Clear */}
      <div className="bg-white border border-stone-200/80 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-stone-600" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Learning Style Matcher
            </h2>
            <span className="text-xs text-stone-400">|</span>
            <span className="text-xs text-stone-500">
              Align courses, instructors &amp; TAs to how you learn best
            </span>
          </div>
          <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200/60 self-start sm:self-auto">
            {selectedStyles.length} active preferences
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-3">
          {LEARNING_STYLE_OPTIONS.map((option) => {
            const active = selectedStyles.includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => toggleStyle(option.id)}
                className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                  active
                    ? "bg-stone-900 border-stone-900 text-white shadow-xs"
                    : "bg-stone-50 hover:bg-stone-100/80 border-stone-200/70 text-stone-700"
                }`}
              >
                <div className="flex items-center justify-between gap-1 font-medium">
                  <span className="truncate">{option.label}</span>
                  <span
                    className={`text-[10px] font-mono ${
                      active ? "text-stone-300" : "text-stone-400"
                    }`}
                  >
                    {active ? "✓" : "+"}
                  </span>
                </div>
                <p
                  className={`text-[10px] mt-1 line-clamp-1 leading-snug ${
                    active ? "text-stone-300" : "text-stone-500"
                  }`}
                >
                  {option.shortDesc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Sidebar + Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Course List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Courses
              </label>
              <span className="text-[11px] font-mono text-stone-400">
                {filteredCourses.length} available
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search code or title..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-stone-50/50 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-stone-400 transition-colors"
              />
            </div>

            <div className="space-y-1.5 pt-1">
              {filteredCourses.map((course) => {
                const isSelected = course.id === activeCourse.id;
                const matchPct = calculateStyleMatch(course.styleTags);
                return (
                  <button
                    key={course.id}
                    onClick={() => onSelectCourse(course.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                        : "bg-white hover:bg-stone-50 text-stone-800 border-stone-200/70"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs tracking-tight">
                        {course.code}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          isSelected
                            ? "bg-white/10 text-emerald-300 border border-white/10"
                            : "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                        }`}
                      >
                        {matchPct}% Fit
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-1 truncate ${
                        isSelected ? "text-stone-300" : "text-stone-600"
                      }`}
                    >
                      {course.name}
                    </p>
                    <div
                      className={`flex items-center gap-3 mt-2 text-[10px] font-mono ${
                        isSelected ? "text-stone-400" : "text-stone-500"
                      }`}
                    >
                      <span>TA: {course.taSupportScore}%</span>
                      <span>~{course.weeklyHours}h/wk</span>
                      <span
                        className={`ml-auto ${
                          isSelected ? "text-emerald-300" : "text-stone-600"
                        }`}
                      >
                        {course.changelog.length} fixes
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quality Standards Card */}
          <div className="bg-stone-50/70 border border-stone-200/80 rounded-xl p-4 text-xs text-stone-600 space-y-2">
            <div className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
              Substance-First Philosophy
            </div>
            <p className="text-[11px] leading-relaxed text-stone-500">
              Evaluations are collected mid-term to avoid post-exam emotion.
              Critical reviews cite specific labs and exams; low-effort rants
              are coached into actionable feedback.
            </p>
          </div>
        </div>

        {/* Right Main Column: Course Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Course Header Bento */}
          <div className="bg-white rounded-xl p-6 border border-stone-200/80 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-900 text-white">
                    {activeCourse.code}
                  </span>
                  <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200/60">
                    {activeCourse.department}
                  </span>
                  <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200/70 px-2 py-0.5 rounded flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {courseFitScore}% Match
                  </span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-stone-900 mt-2">
                  {activeCourse.name}
                </h1>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  {activeCourse.description}
                </p>
                <p className="text-[11px] text-stone-500 mt-2 font-mono">
                  Prerequisites: {activeCourse.prereqs}
                </p>
              </div>

              <button
                onClick={() => onOpenReviewModal(activeCourse.code)}
                className="shrink-0 inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs px-3.5 py-2 rounded-lg transition-colors shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Write Review
              </button>
            </div>

            {/* 5-Metric Clean Bento Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-4 border-t border-stone-100">
              <div className="p-3 rounded-lg bg-stone-50/80 border border-stone-200/60">
                <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
                  Intellectual Value
                </div>
                <div className="text-base font-mono font-bold text-stone-900 mt-1">
                  {activeCourse.intellectualValue}%
                </div>
                <div className="w-full bg-stone-200 h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-stone-800 h-1 rounded-full"
                    style={{ width: `${activeCourse.intellectualValue}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-stone-50/80 border border-stone-200/60">
                <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
                  Clarity &amp; Structure
                </div>
                <div className="text-base font-mono font-bold text-stone-900 mt-1">
                  {activeCourse.structureClarity}%
                </div>
                <div className="w-full bg-stone-200 h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-stone-800 h-1 rounded-full"
                    style={{ width: `${activeCourse.structureClarity}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-stone-50/80 border border-stone-200/60">
                <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
                  Assessment Fairness
                </div>
                <div className="text-base font-mono font-bold text-stone-900 mt-1">
                  {activeCourse.assessmentFairness}%
                </div>
                <div className="w-full bg-stone-200 h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-stone-800 h-1 rounded-full"
                    style={{ width: `${activeCourse.assessmentFairness}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-stone-50/80 border border-stone-200/60">
                <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
                  TA Support
                </div>
                <div className="text-base font-mono font-bold text-stone-900 mt-1">
                  {activeCourse.taSupportScore}%
                </div>
                <div className="w-full bg-stone-200 h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-stone-800 h-1 rounded-full"
                    style={{ width: `${activeCourse.taSupportScore}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-stone-50/80 border border-stone-200/60 col-span-2 sm:col-span-1">
                <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
                  Mid vs. End Pulse
                </div>
                <div className="text-base font-mono font-bold text-stone-900 mt-1">
                  {activeCourse.midTermPulsePositive}% →{" "}
                  <span className="text-stone-500 text-xs">
                    {activeCourse.endOfTermPositive}%
                  </span>
                </div>
                <div className="text-[10px] text-stone-500 font-mono mt-1">
                  {activeCourse.responseRate}% cohort
                </div>
              </div>
            </div>

            {/* Who Thrives vs Watch Out */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-lg bg-stone-50/50 border border-stone-200/70 text-xs">
                <h3 className="font-semibold text-stone-900 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Who Thrives
                </h3>
                <ul className="mt-2 space-y-1 text-stone-600">
                  {activeCourse.bestFor.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-stone-400 font-mono text-[10px]">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-lg bg-stone-50/50 border border-stone-200/70 text-xs">
                <h3 className="font-semibold text-stone-900 flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Things to Note
                </h3>
                <ul className="mt-2 space-y-1 text-stone-600">
                  {activeCourse.watchOutFor.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-stone-400 font-mono text-[10px]">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Course Changelog */}
          <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-stone-600" />
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                    Course Changelog &amp; Faculty Fixes
                  </h2>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Substantive student reviews feed directly into department action
                  tickets.
                </p>
              </div>
              <button
                onClick={() => onNavigateToBackendIssue()}
                className="inline-flex items-center gap-1 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/70 px-2.5 py-1.5 rounded-md transition-colors self-start sm:self-auto"
              >
                <span>Department Backend</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {activeCourse.changelog.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-lg bg-stone-50/60 border border-stone-200/70 text-xs space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-200 text-stone-800">
                        {log.term}
                      </span>
                      <span className="font-semibold text-stone-800">
                        {log.author}
                      </span>
                      <span className="text-stone-500 text-[11px]">
                        ({log.role})
                      </span>
                    </div>
                    {log.impactMetric && (
                      <span className="text-[10px] font-mono font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded">
                        {log.impactMetric}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded bg-white border border-stone-200/60 text-stone-700">
                      <span className="text-[10px] uppercase font-semibold text-stone-500 block mb-0.5">
                        Issue Raised:
                      </span>
                      {log.issueRaised}
                    </div>
                    <div className="p-2.5 rounded bg-white border border-stone-200/60 text-stone-700">
                      <span className="text-[10px] uppercase font-semibold text-stone-500 block mb-0.5">
                        Action Taken:
                      </span>
                      {log.actionTaken}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Teaching Team: Instructors & TAs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Instructor */}
            <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-1.5 pb-2 border-b border-stone-100">
                <BookOpen className="w-3.5 h-3.5 text-stone-600" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                  Instructor Profile
                </h3>
              </div>
              {courseInstructors.map((inst) => {
                const instFit = calculateStyleMatch(inst.styleTags);
                return (
                  <div
                    key={inst.id}
                    className="p-3 rounded-lg bg-stone-50/60 border border-stone-200/70 text-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-stone-900">
                          {inst.name}
                        </div>
                        <div className="text-[11px] text-stone-500 font-mono">
                          {inst.deliveryMode} • {inst.pace}
                        </div>
                      </div>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {instFit}% Fit
                      </span>
                    </div>
                    <p className="text-stone-600 leading-relaxed text-[11px]">
                      {inst.teachingStyleSummary}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {inst.strengths.map((s, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-white border border-stone-200 px-1.5 py-0.5 rounded text-stone-600"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Course TAs */}
            <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-stone-600" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                    Teaching Assistants
                  </h3>
                </div>
                <span className="text-[10px] text-stone-500 font-mono">
                  Opt-In
                </span>
              </div>
              <div className="space-y-2">
                {courseTAs.map((ta) => (
                  <div
                    key={ta.id}
                    className="p-3 rounded-lg bg-stone-50/60 border border-stone-200/70 text-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                          {ta.name}
                          <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-stone-200 text-stone-700">
                            {
                              ta.coursesTaught.find(
                                (c) => c.code === activeCourse.code
                              )?.section
                            }
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {ta.role}
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigateToTA(ta.name)}
                        className="text-[11px] font-medium text-stone-700 hover:text-stone-900 flex items-center gap-0.5"
                      >
                        Portfolio
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-stone-600 text-[11px] line-clamp-2">
                      {ta.bio}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {ta.superpowers.slice(0, 2).map((sp, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-white text-stone-700 border border-stone-200 px-1.5 py-0.5 rounded font-mono"
                        >
                          {sp.label} ({sp.count})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Student Reviews Section */}
          <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-stone-600" />
                  Peer Reviews &amp; Institutional Feedback ({courseReviews.length})
                </h2>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Dual-purpose: Student study strategies + actionable curriculum
                  feedback.
                </p>
              </div>

              {/* Substance Filter Toggle */}
              <button
                onClick={() => setHideLowSubstance(!hideLowSubstance)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 transition-colors self-start sm:self-auto"
              >
                {hideLowSubstance ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-stone-500" />
                    <span>Filter Active ({hiddenLowSubstanceCount} unvetted hidden)</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                    <span>Showing All Reviews</span>
                  </>
                )}
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[11px] text-stone-400 mr-1">Topic:</span>
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
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      selectedComponent === comp
                        ? "bg-stone-900 text-white font-medium"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200/60"
                    }`}
                  >
                    {comp}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[11px] text-stone-400 mr-1">Tone:</span>
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
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      selectedSentiment === sent
                        ? "bg-stone-900 text-white font-medium"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200/60"
                    }`}
                  >
                    {sent}
                  </button>
                ))}
              </div>
            </div>

            {/* Review Cards */}
            <div className="space-y-3 pt-1">
              {courseReviews.map((review) => {
                const isLowSubstance = review.substanceScore < 55;
                const voted = helpfulVotes[review.id] || false;

                return (
                  <div
                    key={review.id}
                    className="rounded-lg p-4 border border-stone-200/80 bg-white hover:border-stone-300 transition-colors space-y-3"
                  >
                    {/* Top Metadata */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-stone-100">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                            review.overallExperience === "Positive"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : review.overallExperience ===
                                "Mixed / Constructive"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-rose-50 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {review.overallExperience}
                        </span>

                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-100 text-stone-700 border border-stone-200/60 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-stone-500" />
                          Substance: {review.substanceScore}/100
                        </span>

                        <span className="text-[10px] font-mono text-stone-500 bg-stone-50 px-1.5 py-0.5 rounded">
                          {review.checkpointType}
                        </span>

                        <span className="text-[11px] text-stone-500">
                          {review.term} • {review.instructorName}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono text-stone-400">
                        {review.createdAt}
                      </span>
                    </div>

                    {/* Reviewer Context */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-stone-500">
                      <span className="bg-stone-50 border border-stone-200/60 px-1.5 py-0.5 rounded">
                        {review.reviewerContext.attendance}
                      </span>
                      <span className="bg-stone-50 border border-stone-200/60 px-1.5 py-0.5 rounded">
                        {review.reviewerContext.officeHoursUsed}
                      </span>
                      <span className="bg-stone-50 border border-stone-200/60 px-1.5 py-0.5 rounded">
                        Workload: {review.reviewerContext.workloadFelt}
                      </span>
                    </div>

                    {/* Dual-Column Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                      <div className="p-3 rounded-lg bg-stone-50/70 border border-stone-200/60 space-y-1">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                          <Users className="w-3 h-3 text-stone-600" />
                          For Future Students (Strategy)
                        </div>
                        <p className="text-stone-700 leading-relaxed text-xs">
                          {review.studentAdvice}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-stone-50/70 border border-stone-200/60 space-y-1">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-stone-600" />
                          For Course Faculty (Actionable)
                        </div>
                        <p className="text-stone-700 leading-relaxed text-xs">
                          {review.schoolFeedback}
                        </p>
                      </div>
                    </div>

                    {/* TA Feedback Callout */}
                    {review.taFeedback && (
                      <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 flex items-start justify-between gap-2 text-xs">
                        <div className="text-stone-700">
                          <span className="font-semibold text-stone-900">
                            TA Feedback ({review.taName || "TA"}):{" "}
                          </span>
                          {review.taFeedback}
                        </div>
                        {review.taName && (
                          <button
                            onClick={() => onNavigateToTA(review.taName!)}
                            className="shrink-0 text-[11px] font-medium text-stone-800 hover:underline"
                          >
                            View TA →
                          </button>
                        )}
                      </div>
                    )}

                    {/* Official Response */}
                    {review.schoolResponse && (
                      <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/70 text-xs space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[9px] uppercase px-1 py-0.2 rounded bg-emerald-700 text-white font-bold">
                            Official Resolution
                          </span>
                          <span className="font-semibold text-emerald-950">
                            {review.schoolResponse.responder}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-mono">
                            • {review.schoolResponse.date}
                          </span>
                        </div>
                        <p className="text-emerald-900 text-xs pt-0.5">
                          {review.schoolResponse.message}
                        </p>
                      </div>
                    )}

                    {/* Tags & Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
                      <div className="flex flex-wrap items-center gap-1">
                        {review.componentTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono text-stone-500 bg-stone-50 border border-stone-200/60 px-1.5 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        {review.linkedIssueId && (
                          <button
                            onClick={() =>
                              onNavigateToBackendIssue(review.linkedIssueId)
                            }
                            className="text-[11px] font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1"
                          >
                            <Layers className="w-3 h-3" />
                            Backend Ticket
                          </button>
                        )}
                        <button
                          onClick={() =>
                            setHelpfulVotes((prev) => ({
                              ...prev,
                              [review.id]: !prev[review.id],
                            }))
                          }
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                            voted
                              ? "bg-stone-900 text-white border-stone-900"
                              : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>Helpful ({review.helpfulCount + (voted ? 1 : 0)})</span>
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
