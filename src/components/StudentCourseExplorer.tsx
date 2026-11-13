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
  GraduationCap,
  Building2,
  Layers,
  Search,
  ChevronDown,
  ChevronUp,
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

type CourseSubTab = "overview" | "reviews" | "teaching-team" | "changelog";

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
  const [currentTab, setCurrentTab] = useState<CourseSubTab>("overview");
  const [isStyleMatcherOpen, setIsStyleMatcherOpen] = useState(false);
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
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* 1. Clean Course Bar: Fast Course Selection & Style Match Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-stone-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {filteredCourses.map((c) => {
            const isSelected = c.id === activeCourse.id;
            const fit = calculateStyleMatch(c.styleTags);
            return (
              <button
                key={c.id}
                onClick={() => {
                  onSelectCourse(c.id);
                  if (searchQuery) setSearchQuery("");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 ${
                  isSelected
                    ? "bg-stone-900 text-white font-semibold shadow-xs"
                    : "bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/60"
                }`}
              >
                <span>{c.code}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded ${
                    isSelected
                      ? "bg-white/15 text-emerald-300"
                      : "bg-emerald-50 text-emerald-800"
                  }`}
                >
                  {fit}%
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course..."
              className="w-32 sm:w-40 pl-7 pr-2.5 py-1 text-xs rounded-lg border border-stone-200 bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-stone-400"
            />
          </div>

          {/* Style Matcher Toggle Pill */}
          <button
            onClick={() => setIsStyleMatcherOpen(!isStyleMatcherOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isStyleMatcherOpen
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white hover:bg-stone-50 text-stone-700 border-stone-200"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>My Style ({selectedStyles.length})</span>
            {isStyleMatcherOpen ? (
              <ChevronUp className="w-3 h-3 text-stone-400" />
            ) : (
              <ChevronDown className="w-3 h-3 text-stone-400" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Collapsible Learning Style Preferences Drawer */}
      {isStyleMatcherOpen && (
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <h3 className="text-xs font-semibold text-stone-900">
                Personal Learning Style Matcher
              </h3>
              <p className="text-[11px] text-stone-500">
                Choose the preferences that describe your learning habits to customize fit scores across all courses.
              </p>
            </div>
            <span className="text-[10px] font-mono text-stone-500 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded">
              {selectedStyles.length} active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {LEARNING_STYLE_OPTIONS.map((option) => {
              const active = selectedStyles.includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => toggleStyle(option.id)}
                  className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                    active
                      ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                      : "bg-stone-50 hover:bg-stone-100/80 text-stone-700 border-stone-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 font-medium">
                    <span className="truncate">{option.label}</span>
                    <span className={`text-[10px] ${active ? "text-stone-300" : "text-stone-400"}`}>
                      {active ? "✓" : "+"}
                    </span>
                  </div>
                  <p className={`text-[10px] mt-1 line-clamp-1 ${active ? "text-stone-300" : "text-stone-500"}`}>
                    {option.shortDesc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Course Hero Card: Calm & Minimalist */}
      <div className="bg-white rounded-xl p-6 border border-stone-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-900 text-white">
                {activeCourse.code}
              </span>
              <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200/60">
                {activeCourse.department}
              </span>
              <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200/70 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3" />
                {courseFitScore}% Match for Your Style
              </span>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-stone-900">
              {activeCourse.name}
            </h1>

            <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
              {activeCourse.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-stone-500 font-mono">
              <span>Prereqs: {activeCourse.prereqs}</span>
              <span>•</span>
              <span>~{activeCourse.weeklyHours}h weekly workload</span>
              <span>•</span>
              <span>TA Support: {activeCourse.taSupportScore}%</span>
            </div>
          </div>

          <button
            onClick={() => onOpenReviewModal(activeCourse.code)}
            className="shrink-0 inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs px-3.5 py-2 rounded-lg transition-colors shadow-xs self-start"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Write Review</span>
          </button>
        </div>

        {/* 4. Sub-Navigation Tabs: Clean, Focused, Progressive Disclosure */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-stone-100 text-xs font-medium">
          <button
            onClick={() => setCurrentTab("overview")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              currentTab === "overview"
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setCurrentTab("reviews")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              currentTab === "reviews"
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            <span>Reviews</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                currentTab === "reviews"
                  ? "bg-white/20 text-white"
                  : "bg-stone-100 text-stone-600"
              }`}
            >
              {courseReviews.length}
            </span>
          </button>

          <button
            onClick={() => setCurrentTab("teaching-team")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              currentTab === "teaching-team"
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Teaching Team</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                currentTab === "teaching-team"
                  ? "bg-white/20 text-white"
                  : "bg-stone-100 text-stone-600"
              }`}
            >
              {courseInstructors.length + courseTAs.length}
            </span>
          </button>

          <button
            onClick={() => setCurrentTab("changelog")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              currentTab === "changelog"
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Curriculum Fixes</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                currentTab === "changelog"
                  ? "bg-white/20 text-white"
                  : "bg-emerald-50 text-emerald-800"
              }`}
            >
              {activeCourse.changelog.length}
            </span>
          </button>
        </div>
      </div>

      {/* 5. Tab Content Panes */}

      {/* TAB 1: OVERVIEW */}
      {currentTab === "overview" && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Key Score Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-xs">
              <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
                Intellectual Value
              </div>
              <div className="text-xl font-mono font-bold text-stone-900 mt-1">
                {activeCourse.intellectualValue}%
              </div>
              <div className="w-full bg-stone-100 h-1 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-stone-900 h-1 rounded-full"
                  style={{ width: `${activeCourse.intellectualValue}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-xs">
              <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
                Clarity &amp; Structure
              </div>
              <div className="text-xl font-mono font-bold text-stone-900 mt-1">
                {activeCourse.structureClarity}%
              </div>
              <div className="w-full bg-stone-100 h-1 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-stone-900 h-1 rounded-full"
                  style={{ width: `${activeCourse.structureClarity}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-xs">
              <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
                Assessment Fairness
              </div>
              <div className="text-xl font-mono font-bold text-stone-900 mt-1">
                {activeCourse.assessmentFairness}%
              </div>
              <div className="w-full bg-stone-100 h-1 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-stone-900 h-1 rounded-full"
                  style={{ width: `${activeCourse.assessmentFairness}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-xs">
              <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
                TA Support Score
              </div>
              <div className="text-xl font-mono font-bold text-stone-900 mt-1">
                {activeCourse.taSupportScore}%
              </div>
              <div className="w-full bg-stone-100 h-1 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-stone-900 h-1 rounded-full"
                  style={{ width: `${activeCourse.taSupportScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Who Thrives vs Things to Note */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs text-xs space-y-2">
              <h3 className="font-semibold text-stone-900 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Who Thrives in {activeCourse.code}
              </h3>
              <ul className="space-y-1.5 text-stone-600">
                {activeCourse.bestFor.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-stone-400 font-mono">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs text-xs space-y-2">
              <h3 className="font-semibold text-stone-900 flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Things to Keep in Mind
              </h3>
              <ul className="space-y-1.5 text-stone-600">
                {activeCourse.watchOutFor.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-stone-400 font-mono">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Snapshot Previews: Team & Recent Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Teaching Team Snapshot */}
            <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-stone-600" />
                  Instructors &amp; TAs
                </span>
                <button
                  onClick={() => setCurrentTab("teaching-team")}
                  className="text-[11px] text-stone-500 hover:text-stone-900 flex items-center gap-0.5"
                >
                  View Details →
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {courseInstructors.map((inst) => (
                  <div key={inst.id} className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/60">
                    <div className="font-medium text-stone-900">{inst.name}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5 font-mono">
                      {inst.deliveryMode} • {inst.pace}
                    </div>
                  </div>
                ))}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {courseTAs.map((ta) => (
                    <button
                      key={ta.id}
                      onClick={() => onNavigateToTA(ta.name)}
                      className="px-2 py-1 rounded bg-stone-50 hover:bg-stone-100 border border-stone-200/60 text-stone-700 text-[11px] font-mono flex items-center gap-1"
                    >
                      <span>TA: {ta.name}</span>
                      <ArrowUpRight className="w-2.5 h-2.5 text-stone-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Curriculum Changelog Snapshot */}
            <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-stone-600" />
                  Recent Curriculum Action
                </span>
                <button
                  onClick={() => setCurrentTab("changelog")}
                  className="text-[11px] text-stone-500 hover:text-stone-900 flex items-center gap-0.5"
                >
                  Full Changelog →
                </button>
              </div>

              {activeCourse.changelog[0] ? (
                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/60 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold px-1.5 py-0.2 rounded bg-stone-200 text-stone-800">
                      {activeCourse.changelog[0].term}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      Live on Course
                    </span>
                  </div>
                  <div className="text-stone-800 font-medium text-[11px]">
                    {activeCourse.changelog[0].actionTaken}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-400 italic">No recent updates.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REVIEWS */}
      {currentTab === "reviews" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Review Filter Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Tone Filter */}
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[11px] text-stone-400 mr-1">Perspective:</span>
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
                  className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                    selectedSentiment === sent
                      ? "bg-stone-900 text-white font-medium"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200/60"
                  }`}
                >
                  {sent}
                </button>
              ))}
            </div>

            {/* Substance Filter Toggle */}
            <button
              onClick={() => setHideLowSubstance(!hideLowSubstance)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
              <span>
                {hideLowSubstance
                  ? `Substance Filter ON (${hiddenLowSubstanceCount} unvetted hidden)`
                  : "Showing All Reviews"}
              </span>
            </button>
          </div>

          {/* Reviews Feed */}
          <div className="space-y-3">
            {courseReviews.map((review) => {
              const voted = helpfulVotes[review.id] || false;

              return (
                <div
                  key={review.id}
                  className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs space-y-3 hover:border-stone-300 transition-colors"
                >
                  {/* Review Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-stone-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                          review.overallExperience === "Positive"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : review.overallExperience === "Mixed / Constructive"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-rose-50 text-rose-800 border border-rose-200"
                        }`}
                      >
                        {review.overallExperience}
                      </span>

                      <span className="font-mono text-[10px] text-stone-500 bg-stone-50 border border-stone-200/60 px-2 py-0.5 rounded">
                        Substance: {review.substanceScore}/100
                      </span>

                      <span className="text-[11px] text-stone-500 font-mono">
                        {review.term} • {review.instructorName}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-stone-400">
                      {review.createdAt}
                    </span>
                  </div>

                  {/* Context Note */}
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-stone-500">
                    <span>{review.reviewerContext.attendance}</span>
                    <span>•</span>
                    <span>{review.reviewerContext.officeHoursUsed}</span>
                    <span>•</span>
                    <span>Workload: {review.reviewerContext.workloadFelt}</span>
                  </div>

                  {/* Review Body */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="p-3 rounded-lg bg-stone-50/70 border border-stone-200/60 space-y-1">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                        <Users className="w-3 h-3 text-stone-600" />
                        Advice for Future Students
                      </div>
                      <p className="text-stone-700 leading-relaxed">
                        {review.studentAdvice}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-stone-50/70 border border-stone-200/60 space-y-1">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-stone-600" />
                        Feedback for Course Faculty
                      </div>
                      <p className="text-stone-700 leading-relaxed">
                        {review.schoolFeedback}
                      </p>
                    </div>
                  </div>

                  {/* TA Feedback Note if present */}
                  {review.taFeedback && (
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/70 flex items-center justify-between text-xs">
                      <div className="text-stone-700">
                        <span className="font-semibold text-stone-900">
                          TA Note ({review.taName || "Course TA"}):{" "}
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

                  {/* Official School Response if present */}
                  {review.schoolResponse && (
                    <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/70 text-xs space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[9px] uppercase px-1 py-0.2 rounded bg-emerald-700 text-white font-bold">
                          Closed Loop Fix
                        </span>
                        <span className="font-semibold text-emerald-950">
                          {review.schoolResponse.responder}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-mono">
                          • {review.schoolResponse.date}
                        </span>
                      </div>
                      <p className="text-emerald-900 text-xs">
                        {review.schoolResponse.message}
                      </p>
                    </div>
                  )}

                  {/* Review Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                    <div className="flex flex-wrap gap-1">
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
      )}

      {/* TAB 3: TEACHING TEAM */}
      {currentTab === "teaching-team" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Instructors */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-stone-600" />
              Instructors for {activeCourse.code}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {courseInstructors.map((inst) => {
                const instFit = calculateStyleMatch(inst.styleTags);
                return (
                  <div
                    key={inst.id}
                    className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs space-y-2.5 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-stone-900 text-sm">
                          {inst.name}
                        </div>
                        <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                          {inst.deliveryMode} • {inst.pace}
                        </div>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {instFit}% Style Fit
                      </span>
                    </div>

                    <p className="text-stone-600 leading-relaxed text-xs">
                      {inst.teachingStyleSummary}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {inst.strengths.map((s, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-stone-50 border border-stone-200 px-1.5 py-0.5 rounded text-stone-600"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {inst.recentNoteToStudents && (
                      <div className="mt-2 p-2 rounded bg-stone-50 border border-stone-200/60 text-[11px] text-stone-600">
                        <strong className="text-stone-800 block mb-0.5">
                          Response to Student Feedback:
                        </strong>
                        &ldquo;{inst.recentNoteToStudents}&rdquo;
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Teaching Assistants */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-stone-600" />
              Verified Teaching Assistants (Opt-In Public Profiles)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {courseTAs.map((ta) => (
                <div
                  key={ta.id}
                  className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs space-y-2.5 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-stone-900 text-sm flex items-center gap-1.5">
                        {ta.name}
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-100 text-stone-700">
                          {
                            ta.coursesTaught.find(
                              (c) => c.code === activeCourse.code
                            )?.section
                          }
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500">{ta.role}</div>
                    </div>
                    <button
                      onClick={() => onNavigateToTA(ta.name)}
                      className="text-xs font-medium text-stone-800 hover:underline flex items-center gap-0.5"
                    >
                      Portfolio
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-stone-600 text-xs leading-relaxed">
                    {ta.bio}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {ta.superpowers.map((sp, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono bg-stone-50 text-stone-700 border border-stone-200 px-1.5 py-0.5 rounded"
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
      )}

      {/* TAB 4: CHANGELOG */}
      {currentTab === "changelog" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-stone-600" />
                  &ldquo;You Spoke, The School Updated&rdquo; — Course Changelog
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Verified curriculum modifications enacted by course teams in response to student review clusters.
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

            <div className="space-y-3">
              {activeCourse.changelog.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-lg bg-stone-50/70 border border-stone-200/70 space-y-2 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-900 text-white">
                        {log.term}
                      </span>
                      <span className="font-semibold text-stone-900">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded bg-white border border-stone-200/60 space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-stone-500 block">
                        Student Friction Surfaced:
                      </span>
                      <p className="text-stone-700">{log.issueRaised}</p>
                    </div>

                    <div className="p-3 rounded bg-white border border-stone-200/60 space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-stone-500 block">
                        Faculty Action Taken:
                      </span>
                      <p className="text-stone-700">{log.actionTaken}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
