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
      {/* Top Header & Perspective Control */}
      <div className="bg-white border border-stone-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-stone-600" />
              <h1 className="text-base font-bold tracking-tight text-stone-900">
                TA Teaching Portfolios &amp; Instructor Profiles
              </h1>
            </div>
            <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
              Opt-in public portfolios for student tutorial discovery, paired with a
              private coaching feed for safe mid-term growth.
            </p>
          </div>

          {/* Perspective Toggle */}
          <div className="bg-stone-100 p-1 rounded-lg border border-stone-200/80 flex items-center gap-1 shrink-0 self-start md:self-auto text-xs">
            <button
              onClick={() => setViewMode("ta-self-portal")}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                viewMode === "ta-self-portal"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>TA Self-View</span>
            </button>
            <button
              onClick={() => setViewMode("public-student")}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                viewMode === "public-student"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Public Directory</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Directory Sidebar + Portfolio Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left TA Directory */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Teaching Assistants
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                {tas.length} verified
              </span>
            </div>

            <div className="space-y-1.5">
              {tas.map((ta) => {
                const isSelected = ta.id === activeTA.id;
                return (
                  <button
                    key={ta.id}
                    onClick={() => onSelectTAName(ta.name)}
                    className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                      isSelected
                        ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                        : "bg-white hover:bg-stone-50 text-stone-800 border-stone-200/70"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs">{ta.name}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1 ${
                          ta.isPublicOptIn
                            ? isSelected
                              ? "bg-white/10 text-emerald-300 border border-white/10"
                              : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : isSelected
                            ? "bg-stone-800 text-stone-400 border border-stone-700"
                            : "bg-stone-100 text-stone-600 border border-stone-200"
                        }`}
                      >
                        {ta.isPublicOptIn ? (
                          <>
                            <Eye className="w-2.5 h-2.5" /> Public
                          </>
                        ) : (
                          <>
                            <Lock className="w-2.5 h-2.5" /> Private
                          </>
                        )}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] mt-1 ${
                        isSelected ? "text-stone-300" : "text-stone-500"
                      }`}
                    >
                      {ta.role}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ta.coursesTaught.map((ct, i) => (
                        <span
                          key={i}
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                            isSelected
                              ? "bg-stone-800 text-stone-300"
                              : "bg-stone-50 text-stone-600 border border-stone-200/60"
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

          {/* Privacy & Safety Note */}
          <div className="bg-stone-50/70 border border-stone-200/80 rounded-xl p-4 text-xs text-stone-600 space-y-2">
            <div className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs">
              <Shield className="w-3.5 h-3.5 text-stone-700" />
              Safe Dual-Channel Structure
            </div>
            <p className="text-[11px] leading-relaxed text-stone-500">
              Verified teaching strengths and student endorsements are published
              on public portfolios. Constructive tips regarding tutorial pace or
              board work remain strictly private to the TA.
            </p>
          </div>
        </div>

        {/* Right TA Portfolio Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl p-6 border border-stone-200/80 shadow-xs space-y-5">
            {/* TA Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-stone-900 text-white">
                    Teaching Assistant
                  </span>
                  <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200/60">
                    {activeTA.department}
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-stone-900 mt-2">
                  {activeTA.name}
                </h2>
                <p className="text-xs font-medium text-stone-600 mt-0.5">
                  {activeTA.role}
                </p>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {activeTA.bio}
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-stone-500" />
                  <span>{copiedPortfolio ? "Link Copied" : "Share Portfolio"}</span>
                </button>
                <button
                  onClick={() =>
                    onOpenReviewModal(
                      activeTA.coursesTaught[0]?.code || "CS 246",
                      activeTA.name
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-900 hover:bg-stone-800 text-white transition-colors"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>Endorse TA</span>
                </button>
              </div>
            </div>

            {/* Visibility Toggle Strip (TA Self-Portal Mode) */}
            {viewMode === "ta-self-portal" && (
              <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-stone-700" />
                    Portfolio Visibility Setting
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Choose whether prospective students can discover your teaching
                    endorsements.
                  </p>
                </div>
                <button
                  onClick={() => onToggleTAPublic(activeTA.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0 ${
                    activeTA.isPublicOptIn
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
                      : "bg-stone-200 text-stone-800 hover:bg-stone-300"
                  }`}
                >
                  {activeTA.isPublicOptIn
                    ? "✓ Public (Click to set Private)"
                    : "🔒 Private (Click to Opt-In)"}
                </button>
              </div>
            )}

            {/* Metrics Bento Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-lg bg-stone-50/80 border border-stone-200/60">
                <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
                  Tutorial Helpfulness
                </div>
                <div className="text-base font-mono font-bold text-stone-900 mt-1">
                  {activeTA.metrics.helpfulness}%
                </div>
              </div>
              <div className="p-3 rounded-lg bg-stone-50/80 border border-stone-200/60">
                <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
                  Explanation Clarity
                </div>
                <div className="text-base font-mono font-bold text-stone-900 mt-1">
                  {activeTA.metrics.clarity}%
                </div>
              </div>
              <div className="p-3 rounded-lg bg-stone-50/80 border border-stone-200/60">
                <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
                  Ed / Piazza Speed
                </div>
                <div className="text-base font-mono font-bold text-stone-900 mt-1">
                  {activeTA.metrics.responsiveness}%
                </div>
              </div>
              <div className="p-3 rounded-lg bg-stone-50/80 border border-stone-200/60">
                <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
                  Verified Reviews
                </div>
                <div className="text-base font-mono font-bold text-stone-900 mt-1">
                  {activeTA.metrics.totalReviews}
                </div>
              </div>
            </div>

            {/* Verified Teaching Superpowers */}
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-stone-600" />
                Verified Teaching Superpowers
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeTA.superpowers.map((sp, i) => (
                  <div
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-stone-50 border border-stone-200/70 text-stone-800 text-xs font-medium flex items-center gap-2"
                  >
                    <span>★ {sp.label}</span>
                    <span className="font-mono text-[10px] text-stone-500 bg-white border border-stone-200 px-1.5 py-0.2 rounded">
                      {sp.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Endorsements */}
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-stone-600" />
                  Student Endorsements
                </h3>
                {viewMode === "ta-self-portal" && (
                  <span className="text-[11px] text-stone-400">
                    Toggle visibility per quote below
                  </span>
                )}
              </div>

              <div className="space-y-2.5">
                {activeTA.studentEndorsements
                  .filter((e) => viewMode === "ta-self-portal" || e.isPublic)
                  .map((endorsement) => (
                    <div
                      key={endorsement.id}
                      className="p-3.5 rounded-lg bg-stone-50/60 border border-stone-200/70 space-y-2 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-stone-200 text-stone-800">
                            {endorsement.courseCode}
                          </span>
                          <span className="text-stone-500 text-[11px]">
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
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                              endorsement.isPublic
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                : "bg-stone-100 border-stone-200 text-stone-600"
                            }`}
                          >
                            {endorsement.isPublic ? "Public on Portfolio" : "Hidden"}
                          </button>
                        )}
                      </div>
                      <p className="text-stone-700 italic leading-relaxed">
                        &ldquo;{endorsement.quote}&rdquo;
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Private Constructive Coaching Notes (TA Self-View Only) */}
            {viewMode === "ta-self-portal" ? (
              <div className="space-y-3 pt-3 border-t border-stone-100">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-stone-700" />
                      <h3 className="font-semibold text-stone-900">
                        Private Constructive Coaching (Visible Only to You)
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-stone-500 bg-white border border-stone-200 px-2 py-0.5 rounded">
                      Confidential
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    Tactical student suggestions about tutorial pacing, board
                    visibility, and problem pacing are routed here with actionable
                    tips.
                  </p>

                  <div className="space-y-2.5 pt-1">
                    {activeTA.privateConstructiveFeedback.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg bg-white border border-stone-200/80 space-y-2 text-xs"
                      >
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-stone-600">
                          <span className="font-bold text-stone-800">
                            {item.courseCode} ({item.term})
                          </span>
                          <span>• Student Note:</span>
                        </div>
                        <p className="text-stone-700 leading-relaxed">
                          {item.note}
                        </p>
                        <div className="p-2.5 rounded bg-stone-50 border border-stone-200/60 text-[11px] text-stone-700 flex items-start gap-2">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-stone-900">
                              Suggested Adjustment:{" "}
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
              <div className="pt-3 border-t border-stone-100 text-center">
                <p className="text-xs text-stone-400">
                  Switch to <strong>TA Self-View</strong> to inspect private
                  coaching feedback.
                </p>
              </div>
            )}
          </div>

          {/* Instructor Teaching Style Matrix */}
          <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs space-y-4">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-stone-600" />
                Instructor Teaching Style Matrix
              </h2>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Compare faculty delivery approaches, lecture pace, and responsiveness.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {instructors.map((inst) => (
                <div
                  key={inst.id}
                  className="p-3.5 rounded-lg bg-stone-50/60 border border-stone-200/70 text-xs space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-stone-900">
                          {inst.name}
                        </div>
                        <div className="text-[11px] text-stone-500 font-mono">
                          {inst.title} • {inst.courses.join(", ")}
                        </div>
                      </div>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-stone-200 text-stone-800">
                        {inst.pace}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-stone-600 bg-white border border-stone-200/60 px-2 py-0.5 rounded inline-block">
                      Delivery: {inst.deliveryMode}
                    </div>

                    <p className="text-stone-600 leading-relaxed text-[11px]">
                      {inst.teachingStyleSummary}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {inst.styleTags.map((tagId) => {
                        const label = LEARNING_STYLE_OPTIONS.find(
                          (o) => o.id === tagId
                        )?.label;
                        return (
                          <span
                            key={tagId}
                            className="text-[10px] font-mono bg-white border border-stone-200 px-1.5 py-0.5 rounded text-stone-600"
                          >
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {inst.recentNoteToStudents && (
                    <div className="mt-2 p-2 rounded bg-white border border-stone-200/60 text-[11px] text-stone-600">
                      <strong className="text-stone-800 block mb-0.5">
                        Response to Student Feedback:
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
