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
  GraduationCap,
  Building2,
  Search,
  Eye,
  EyeOff,
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

type CourseSubTab = "reviews" | "changelog" | "teaching-team" | "guide";

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
  const [currentTab, setCurrentTab] = useState<CourseSubTab>("reviews");
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

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* 1. Search Bar & Learning Style Preferences Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course code or topic (e.g. CS 246, Algorithms, Concurrency)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200/90 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all shadow-xs"
          />
        </div>

        <button
          onClick={() => setIsStyleMatcherOpen(!isStyleMatcherOpen)}
          className={`shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all shadow-xs ${
            isStyleMatcherOpen
              ? "bg-stone-950 text-white border-stone-950"
              : "bg-stone-950 hover:bg-stone-900 text-white border-stone-950"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Learning Style Preferences ({selectedStyles.length})</span>
          {isStyleMatcherOpen ? (
            <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          )}
        </button>
      </div>

      {/* 2. Collapsible Learning Style Preferences Drawer */}
      {isStyleMatcherOpen && (
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <h3 className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Customize Fit Based on Your Learning Habits
              </h3>
              <p className="text-[11px] text-stone-500">
                Select how you learn best to personalize course and instructor fit scores across Waterloo.
              </p>
            </div>
            <span className="text-[10px] font-mono text-stone-600 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded">
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
                      ? "bg-stone-900 text-white border-stone-900 shadow-xs ring-1 ring-amber-400/40"
                      : "bg-stone-50 hover:bg-stone-100/80 text-stone-700 border-stone-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 font-medium">
                    <span className="truncate">{option.label}</span>
                    <span className={`text-[10px] ${active ? "text-amber-400 font-bold" : "text-stone-400"}`}>
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

      {/* 3. Popular Course Quick Switcher Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-stone-400 text-xs font-medium shrink-0">Popular:</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {filteredCourses.map((c) => {
            const isSelected = c.id === activeCourse.id;
            const shortTag =
              c.code === "CS 246"
                ? "Object-Oriented"
                : c.code === "CS 341"
                ? "Algorithms"
                : c.code === "ECE 252"
                ? "Systems"
                : "Statistics";

            return (
              <button
                key={c.id}
                onClick={() => {
                  onSelectCourse(c.id);
                  if (searchQuery) setSearchQuery("");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-stone-950 text-white font-semibold shadow-xs"
                    : "bg-white hover:bg-stone-100/80 text-stone-700 border border-stone-200/80"
                }`}
              >
                <span className="font-mono">{c.code}</span>
                <span className={`text-[11px] font-normal ${isSelected ? "text-stone-300" : "text-stone-500"}`}>
                  {shortTag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Course Hero Card */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-5">
        {/* Top Badges & Action */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200/60">
                {activeCourse.department}
              </span>
              <span className="text-xs text-stone-400 font-normal">
                Prerequisites: {activeCourse.prereqs}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              <span className="font-mono">{activeCourse.code}:</span> {activeCourse.name}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              {activeCourse.description}
            </p>
          </div>

          <button
            onClick={() => onOpenReviewModal(activeCourse.code)}
            className="shrink-0 inline-flex items-center gap-1.5 bg-stone-950 hover:bg-stone-900 text-white font-medium text-xs px-4 py-2 rounded-xl transition-colors shadow-xs self-start"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>Review {activeCourse.code}</span>
          </button>
        </div>

        {/* 5-Metric Clean Bento Grid matching reference */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          <div className="bg-stone-50/70 border border-stone-100/90 rounded-xl p-3.5">
            <div className="text-[11px] text-stone-500 font-medium">
              Intellectual Value
            </div>
            <div className="text-xl font-bold font-mono text-stone-900 mt-1">
              {activeCourse.intellectualValue}%
            </div>
          </div>

          <div className="bg-stone-50/70 border border-stone-100/90 rounded-xl p-3.5">
            <div className="text-[11px] text-stone-500 font-medium">
              Structure &amp; Clarity
            </div>
            <div className="text-xl font-bold font-mono text-stone-900 mt-1">
              {activeCourse.structureClarity}%
            </div>
          </div>

          <div className="bg-stone-50/70 border border-stone-100/90 rounded-xl p-3.5">
            <div className="text-[11px] text-stone-500 font-medium">
              Assessment Fairness
            </div>
            <div className="text-xl font-bold font-mono text-stone-900 mt-1">
              {activeCourse.assessmentFairness}%
            </div>
          </div>

          <div className="bg-stone-50/70 border border-stone-100/90 rounded-xl p-3.5">
            <div className="text-[11px] text-stone-500 font-medium">
              TA Support
            </div>
            <div className="text-xl font-bold font-mono text-stone-900 mt-1">
              {activeCourse.taSupportScore}%
            </div>
          </div>

          <div className="bg-stone-50/70 border border-stone-100/90 rounded-xl p-3.5 col-span-2 sm:col-span-1">
            <div className="text-[11px] text-stone-500 font-medium">
              Weekly Hours
            </div>
            <div className="text-xl font-bold font-mono text-stone-900 mt-1">
              ~{activeCourse.weeklyHours}h
            </div>
          </div>
        </div>

        {/* Course Sub-Tabs Row */}
        <div className="flex items-center gap-4 sm:gap-6 pt-3 border-t border-stone-100 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setCurrentTab("reviews")}
            className={`pb-2 flex items-center gap-1.5 transition-all relative whitespace-nowrap ${
              currentTab === "reviews"
                ? "text-stone-950 font-bold border-b-2 border-stone-950"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
            <span>Student Reviews ({courseReviews.length})</span>
          </button>

          <button
            onClick={() => setCurrentTab("changelog")}
            className={`pb-2 flex items-center gap-1.5 transition-all relative whitespace-nowrap ${
              currentTab === "changelog"
                ? "text-stone-950 font-bold border-b-2 border-stone-950"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-stone-500" />
            <span>School Changelog ({activeCourse.changelog.length})</span>
          </button>

          <button
            onClick={() => setCurrentTab("teaching-team")}
            className={`pb-2 flex items-center gap-1.5 transition-all relative whitespace-nowrap ${
              currentTab === "teaching-team"
                ? "text-stone-950 font-bold border-b-2 border-stone-950"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-stone-500" />
            <span>Instructors &amp; TAs</span>
          </button>

          <button
            onClick={() => setCurrentTab("guide")}
            className={`pb-2 flex items-center gap-1.5 transition-all relative whitespace-nowrap ${
              currentTab === "guide"
                ? "text-stone-950 font-bold border-b-2 border-stone-950"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-stone-500" />
            <span>Course Guide</span>
          </button>
        </div>
      </div>

      {/* 5. Sub-Tab Content Views */}

      {/* TAB 1: REVIEWS */}
      {currentTab === "reviews" && (
        <div className="space-y-3 animate-in fade-in duration-150">
          {/* Review Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-stone-400 text-xs mr-1">Topic:</span>
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
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    selectedComponent === comp
                      ? "bg-stone-950 text-white font-medium"
                      : "bg-stone-100 hover:bg-stone-200/70 text-stone-700"
                  }`}
                >
                  {comp}
                </button>
              ))}
            </div>

            <button
              onClick={() => setHideLowSubstance(!hideLowSubstance)}
              className="inline-flex items-center gap-1.5 text-emerald-800 text-xs font-medium hover:text-emerald-900 transition-colors self-start sm:self-auto"
            >
              {hideLowSubstance ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Filtered out {hiddenLowSubstanceCount} unhelpful rants</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                  <span>Showing all {reviews.filter(r => r.courseCode === activeCourse.code).length} reviews</span>
                </>
              )}
            </button>
          </div>

          {/* Review Cards matching reference */}
          <div className="space-y-3 pt-1">
            {courseReviews.map((review) => {
              const voted = helpfulVotes[review.id] || false;

              return (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-3.5 hover:border-stone-300 transition-colors"
                >
                  {/* Review Meta Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-[11px] font-medium">
                        {review.overallExperience}
                      </span>
                      <span className="text-stone-400 font-normal">•</span>
                      <span className="text-stone-500 font-normal">
                        {review.term}
                      </span>
                      <span className="text-stone-400 font-normal">•</span>
                      <span className="text-stone-500 font-normal">
                        {review.instructorName}
                      </span>
                      <span className="text-stone-400 font-normal">•</span>
                      <span className="text-stone-500 font-normal">
                        {review.checkpointType}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-800 text-xs font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Substance score: {review.substanceScore}/100</span>
                    </div>
                  </div>

                  {/* Review Content Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-stone-500" />
                        Advice for Future Students
                      </div>
                      <p className="text-stone-600 leading-relaxed text-xs">
                        {review.studentAdvice}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-stone-500" />
                        Constructive Note for Course Staff
                      </div>
                      <p className="text-stone-600 leading-relaxed text-xs">
                        {review.schoolFeedback}
                      </p>
                    </div>
                  </div>

                  {/* TA Feedback Callout Strip */}
                  {review.taFeedback && (
                    <div className="p-3 rounded-xl bg-stone-50/80 border border-stone-200/60 flex items-center justify-between text-xs gap-3">
                      <div className="text-stone-700 leading-relaxed">
                        <span className="font-semibold text-stone-900">
                          TA Feedback ({review.taName || "Course TA"}):{" "}
                        </span>
                        {review.taFeedback}
                      </div>
                      {review.taName && (
                        <button
                          onClick={() => onNavigateToTA(review.taName!)}
                          className="shrink-0 text-xs font-medium text-stone-800 hover:text-amber-600 underline whitespace-nowrap"
                        >
                          TA Profile →
                        </button>
                      )}
                    </div>
                  )}

                  {/* Official School Response if present */}
                  {review.schoolResponse && (
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-xs space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-700 text-white font-bold">
                          School Resolution
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

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex flex-wrap gap-1">
                      {review.componentTags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        setHelpfulVotes((prev) => ({
                          ...prev,
                          [review.id]: !prev[review.id],
                        }))
                      }
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        voted
                          ? "bg-amber-50 border-amber-300 text-amber-900"
                          : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      <ThumbsUp className={`w-3 h-3 ${voted ? "text-amber-600" : ""}`} />
                      <span>Helpful ({review.helpfulCount + (voted ? 1 : 0)})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CHANGELOG */}
      {currentTab === "changelog" && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-stone-600" />
                &ldquo;You Spoke, The School Updated&rdquo; — Course Changelog
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Verified curriculum modifications enacted by course teams in response to student review clusters.
              </p>
            </div>

            <button
              onClick={() => onNavigateToBackendIssue()}
              className="inline-flex items-center gap-1 text-xs font-medium text-stone-800 hover:text-stone-950 bg-stone-100 hover:bg-stone-200/70 px-3 py-1.5 rounded-lg transition-colors self-start sm:self-auto"
            >
              <span>Department Backend</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {activeCourse.changelog.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-stone-50/70 border border-stone-200/70 space-y-2 text-xs"
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
                    <span className="text-[10px] font-mono font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                      {log.impactMetric}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-white border border-stone-200/60 space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-stone-500 block">
                      Student Friction Surfaced:
                    </span>
                    <p className="text-stone-700">{log.issueRaised}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-stone-200/60 space-y-1">
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
      )}

      {/* TAB 3: TEACHING TEAM */}
      {currentTab === "teaching-team" && (
        <div className="space-y-4 animate-in fade-in duration-150">
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
                    className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs space-y-2.5 text-xs"
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
                          className="text-[10px] bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-md text-stone-600"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {inst.recentNoteToStudents && (
                      <div className="mt-2 p-2 rounded-lg bg-stone-50 border border-stone-200/60 text-[11px] text-stone-600">
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

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-stone-600" />
              Teaching Assistants (Opt-In Public Portfolios)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {courseTAs.map((ta) => (
                <div
                  key={ta.id}
                  className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs space-y-2.5 text-xs"
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
                      className="text-xs font-medium text-stone-800 hover:text-amber-600 flex items-center gap-0.5"
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
                        className="text-[10px] font-mono bg-stone-50 text-stone-700 border border-stone-200 px-2 py-0.5 rounded-md"
                      >
                        <span className="text-amber-500">★</span> {sp.label} ({sp.count})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COURSE GUIDE */}
      {currentTab === "guide" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs text-xs space-y-3">
            <h3 className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Who Thrives in {activeCourse.code}
            </h3>
            <ul className="space-y-2 text-stone-600">
              {activeCourse.bestFor.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs text-xs space-y-3">
            <h3 className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Things to Keep in Mind
            </h3>
            <ul className="space-y-2 text-stone-600">
              {activeCourse.watchOutFor.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-stone-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
