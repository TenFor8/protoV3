"use client";

import React, { useState } from "react";
import { Instructor, TAProfile } from "@/types";
import { LEARNING_STYLE_OPTIONS } from "@/data/mockData";
import {
  GraduationCap,
  Award,
  Eye,
  Lock,
  Sparkles,
  CheckCircle2,
  BookOpen,
  MessageSquarePlus,
  Share2,
  Shield,
  Sliders,
  UserCheck,
  Lightbulb,
} from "lucide-react";

interface TAAndInstructorHubProps {
  tas: TAProfile[];
  instructors: Instructor[];
  selectedTAName: string | null;
  onSelectTAName: (name: string) => void;
  onToggleTAPublic: (taId: string) => void;
  onToggleEndorsementPublic: (taId: string, endorsementId: string) => void;
  onOpenReviewModal: (courseCode?: string, taName?: string) => void;
}

export default function TAAndInstructorHub({
  tas,
  instructors,
  selectedTAName,
  onSelectTAName,
  onToggleTAPublic,
  onToggleEndorsementPublic,
  onOpenReviewModal,
}: TAAndInstructorHubProps) {
  const [viewMode, setViewMode] = useState<"public-student" | "ta-self-portal">(
    "ta-self-portal"
  );
  const [copiedPortfolio, setCopiedPortfolio] = useState(false);

  const activeTA =
    tas.find((t) => t.name === selectedTAName) || tas[0];

  const handleCopyShareLink = () => {
    setCopiedPortfolio(true);
    setTimeout(() => setCopiedPortfolio(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Explainer & View Mode Switcher */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-lg border border-indigo-800/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-2">
              <GraduationCap className="w-4 h-4" />
              Solving the &ldquo;Hidden TA Evaluation&rdquo; Problem
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold">
              TA Teaching Portfolios &amp; Instructor Style Profiles
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Traditionally at UW, end-of-term TA evaluations are locked in a
              silo—students don&apos;t know which tutorials or office hours fit
              their learning needs, and TAs can&apos;t showcase their teaching
              impact. Here, TAs get{" "}
              <strong>opt-in public teaching portfolios</strong> for recognition
              plus a <strong>private growth feed</strong> for safe, constructive
              coaching.
            </p>
          </div>

          {/* Perspective Toggle */}
          <div className="bg-slate-900/90 p-1.5 rounded-xl border border-indigo-700/60 flex items-center gap-1 shrink-0 self-start lg:self-center">
            <button
              onClick={() => setViewMode("ta-self-portal")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === "ta-self-portal"
                  ? "bg-amber-400 text-slate-950 shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              TA Self-View (Manage Visibility)
            </button>
            <button
              onClick={() => setViewMode("public-student")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === "public-student"
                  ? "bg-amber-400 text-slate-950 shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Student Public Directory View
            </button>
          </div>
        </div>
      </div>

      {/* TA Section: Left Selector + Right Portfolio/Coaching View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left TA Directory List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Teaching Assistant
              </span>
              <span className="text-[11px] font-semibold text-indigo-600">
                {tas.length} Verified TAs
              </span>
            </div>

            <div className="space-y-2.5">
              {tas.map((ta) => {
                const isSelected = ta.id === activeTA.id;
                return (
                  <button
                    key={ta.id}
                    onClick={() => onSelectTAName(ta.name)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-md"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm">{ta.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          ta.isPublicOptIn
                            ? isSelected
                              ? "bg-emerald-400/20 text-emerald-300"
                              : "bg-emerald-100 text-emerald-800"
                            : isSelected
                            ? "bg-slate-700 text-slate-300"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {ta.isPublicOptIn ? (
                          <>
                            <Eye className="w-3 h-3" /> Public Portfolio
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3" /> Private Only
                          </>
                        )}
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        isSelected ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {ta.role}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {ta.coursesTaught.map((ct, i) => (
                        <span
                          key={i}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            isSelected
                              ? "bg-slate-800 text-amber-300"
                              : "bg-white border border-slate-200 text-slate-700"
                          }`}
                        >
                          {ct.code} ({ct.section})
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Why Split Public Recognition vs Private Coaching */}
          <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-2xl p-4 text-xs text-indigo-950 space-y-2">
            <div className="font-bold text-sm flex items-center gap-1.5 text-indigo-900">
              <Shield className="w-4 h-4 text-indigo-600" />
              Psychological Safety for TAs
            </div>
            <p className="leading-relaxed">
              TAs are students too! Putting raw, unfiltered complaints on a
              public wall discourages TAs. Instead, our dual-channel model
              publishes <strong>verified teaching strengths &amp; endorsements</strong>{" "}
              while routing <strong>tactical room/pacing tips</strong> privately
              to the TA.
            </p>
          </div>
        </div>

        {/* Right TA Portfolio & Controls */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs">
                    Verified UW Teaching Assistant
                  </span>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {activeTA.department}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                  {activeTA.name}
                </h2>
                <p className="text-sm font-medium text-slate-600">
                  {activeTA.role}
                </p>
                <p className="text-xs text-slate-600 mt-2 max-w-2xl leading-relaxed">
                  {activeTA.bio}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                  {copiedPortfolio
                    ? "Copied Portfolio Link!"
                    : "Share TA Portfolio"}
                </button>
                <button
                  onClick={() =>
                    onOpenReviewModal(
                      activeTA.coursesTaught[0]?.code || "CS 246",
                      activeTA.name
                    )
                  }
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 transition-colors"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  Endorse / Give TA Feedback
                </button>
              </div>
            </div>

            {/* TA Self-Portal Privacy Control Banner */}
            {viewMode === "ta-self-portal" && (
              <div className="mt-4 p-4 rounded-xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-amber-700" />
                    TA Visibility Control (You are viewing as {activeTA.name})
                  </div>
                  <p className="text-xs text-amber-900">
                    Control whether prospective students can see your teaching
                    metrics &amp; curated endorsements on course pages.
                  </p>
                </div>
                <button
                  onClick={() => onToggleTAPublic(activeTA.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                    activeTA.isPublicOptIn
                      ? "bg-emerald-700 text-white hover:bg-emerald-800"
                      : "bg-slate-800 text-white hover:bg-slate-900"
                  }`}
                >
                  {activeTA.isPublicOptIn
                    ? "✓ Public Portfolio Enabled (Click to Make Private)"
                    : "🔒 Portfolio Private (Click to Opt-In Publicly)"}
                </button>
              </div>
            )}

            {/* Metrics & Superpowers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="text-[11px] font-semibold text-slate-500">
                  Tutorial &amp; OH Helpfulness
                </div>
                <div className="text-xl font-extrabold text-emerald-700 mt-0.5">
                  {activeTA.metrics.helpfulness}%
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="text-[11px] font-semibold text-slate-500">
                  Explanation Clarity
                </div>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {activeTA.metrics.clarity}%
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="text-[11px] font-semibold text-slate-500">
                  Ed Stem / Piazza Speed
                </div>
                <div className="text-xl font-extrabold text-indigo-700 mt-0.5">
                  {activeTA.metrics.responsiveness}%
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="text-[11px] font-semibold text-slate-500">
                  Verified Student Reviews
                </div>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {activeTA.metrics.totalReviews}
                </div>
              </div>
            </div>

            {/* Verified Superpower Badges */}
            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Student-Verified Teaching Superpowers
              </h3>
              <div className="flex flex-wrap gap-2">
                {activeTA.superpowers.map((sp, i) => (
                  <div
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-950 text-xs font-semibold flex items-center gap-2"
                  >
                    <span>★ {sp.label}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                      {sp.count} students
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Endorsements */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Substantive Student Endorsements (Tutorials, Labs &amp; Office
                  Hours)
                </h3>
                {viewMode === "ta-self-portal" && (
                  <span className="text-[11px] text-slate-500">
                    Click any quote badge to toggle public portfolio visibility
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {activeTA.studentEndorsements
                  .filter((e) => viewMode === "ta-self-portal" || e.isPublic)
                  .map((endorsement) => (
                    <div
                      key={endorsement.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 text-xs font-bold">
                            {endorsement.courseCode}
                          </span>
                          <span className="text-xs font-medium text-slate-600">
                            {endorsement.term} • {endorsement.context}
                          </span>
                        </div>

                        {viewMode === "ta-self-portal" && (
                          <button
                            onClick={() =>
                              onToggleEndorsementPublic(
                                activeTA.id,
                                endorsement.id
                              )
                            }
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                              endorsement.isPublic
                                ? "bg-emerald-100 border-emerald-300 text-emerald-900"
                                : "bg-slate-200 border-slate-300 text-slate-700"
                            }`}
                          >
                            {endorsement.isPublic
                              ? "Public on Portfolio (Hide)"
                              : "Hidden from Public (Show)"}
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed italic">
                        &ldquo;{endorsement.quote}&rdquo;
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Private Constructive Coaching Notes (ONLY visible in TA Self-Portal Mode!) */}
            {viewMode === "ta-self-portal" ? (
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-extrabold text-white">
                        Private Constructive Coaching Notes (Visible ONLY to{" "}
                        {activeTA.name})
                      </h3>
                    </div>
                    <span className="text-[11px] bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full font-semibold">
                      Never Shown Publicly
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    When students submit tactical suggestions about tutorial
                    pacing, chalkboard visibility, or lab queues, our engine
                    routes them privately here with an actionable micro-tip so
                    you can improve mid-term without public stress.
                  </p>

                  <div className="space-y-3 pt-1">
                    {activeTA.privateConstructiveFeedback.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2"
                      >
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <span className="font-bold text-amber-300">
                            {item.courseCode} ({item.term})
                          </span>
                          <span>• Student Observation:</span>
                        </div>
                        <p className="text-xs text-slate-200">{item.note}</p>
                        <div className="p-2.5 rounded-lg bg-indigo-950/80 border border-indigo-700/60 text-xs text-indigo-200 flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-amber-300">
                              Suggested Micro-Adjustment:{" "}
                            </strong>
                            {item.actionableTip}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  Switch to <strong>TA Self-View</strong> above to see how{" "}
                  {activeTA.name} receives private, constructive mid-term
                  coaching tips.
                </p>
              </div>
            )}
          </div>

          {/* Instructor Teaching Style Comparison Matrix */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Instructor Teaching Style Matrix
              </h2>
              <p className="text-xs text-slate-600">
                A tough professor for a slide-learner might be a 10/10 mentor
                for a live-coding learner. Compare instructors by delivery style
                and pace instead of polarized star ratings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {instructors.map((inst) => (
                <div
                  key={inst.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-slate-900">
                          {inst.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {inst.title} • {inst.courses.join(", ")}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 text-amber-300 text-xs font-bold">
                        {inst.pace}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg inline-block">
                      Delivery: {inst.deliveryMode}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {inst.teachingStyleSummary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {inst.styleTags.map((tagId) => {
                        const label = LEARNING_STYLE_OPTIONS.find(
                          (o) => o.id === tagId
                        )?.label;
                        return (
                          <span
                            key={tagId}
                            className="text-[10px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700"
                          >
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {inst.recentNoteToStudents && (
                    <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200/70 text-[11px] text-emerald-950">
                      <strong className="text-emerald-800 block mb-0.5">
                        ✓ Recent Response to Student Feedback:
                      </strong>
                      &ldquo;{inst.recentNoteToStudents}&rdquo;
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
