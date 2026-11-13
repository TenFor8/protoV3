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
  Sliders,
  UserCheck,
  Lightbulb,
  ArrowUpRight,
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
  const [hubSection, setHubSection] = useState<"tas" | "instructors">("tas");
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
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Top Bar: Clean Section Switcher (TAs vs Instructors) & Mode */}
      <div className="bg-white border border-stone-200/80 rounded-xl p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Hub Section Tabs */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setHubSection("tas")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              hubSection === "tas"
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Teaching Assistants ({tas.length})</span>
          </button>

          <button
            onClick={() => setHubSection("instructors")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              hubSection === "instructors"
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Course Instructors ({instructors.length})</span>
          </button>
        </div>

        {/* Perspective Mode Switcher (Visible in TAs section) */}
        {hubSection === "tas" && (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-stone-400 text-[11px] mr-1 hidden sm:inline">
              Viewing as:
            </span>
            <div className="bg-stone-100 p-1 rounded-lg flex items-center gap-1 border border-stone-200/60">
              <button
                onClick={() => setViewMode("ta-self-portal")}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  viewMode === "ta-self-portal"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Sliders className="w-3 h-3 inline mr-1 text-stone-500" />
                TA Self-View
              </button>
              <button
                onClick={() => setViewMode("public-student")}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  viewMode === "public-student"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Eye className="w-3 h-3 inline mr-1 text-stone-500" />
                Public View
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 1: TEACHING ASSISTANTS */}
      {hubSection === "tas" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left TA Directory */}
          <div className="lg:col-span-4 bg-white rounded-xl p-3.5 border border-stone-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-xs font-semibold text-stone-800">
                TA Directory
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                {tas.length} profiles
              </span>
            </div>

            <div className="space-y-1.5">
              {tas.map((ta) => {
                const isSelected = ta.id === activeTA.id;
                return (
                  <button
                    key={ta.id}
                    onClick={() => onSelectTAName(ta.name)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs ${
                      isSelected
                        ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                        : "bg-white hover:bg-stone-50 text-stone-800 border-stone-200/70"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs">{ta.name}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                          ta.isPublicOptIn
                            ? isSelected
                              ? "bg-white/15 text-emerald-300"
                              : "bg-emerald-50 text-emerald-800"
                            : isSelected
                            ? "bg-stone-800 text-stone-400"
                            : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {ta.isPublicOptIn ? "Public" : "Private"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {ta.coursesTaught.map((ct, i) => (
                        <span
                          key={i}
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                            isSelected
                              ? "bg-stone-800 text-stone-300"
                              : "bg-stone-50 text-stone-600 border border-stone-200/60"
                          }`}
                        >
                          {ct.code}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right TA Detail */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs space-y-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-stone-900 text-white">
                      Teaching Assistant
                    </span>
                    <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200/60">
                      {activeTA.department}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold tracking-tight text-stone-900 mt-1.5">
                    {activeTA.name}
                  </h2>
                  <p className="text-xs text-stone-500">{activeTA.role}</p>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {activeTA.bio}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                  <button
                    onClick={handleCopyShareLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5 text-stone-500" />
                    <span>{copiedPortfolio ? "Copied" : "Share"}</span>
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

              {/* TA Self-View Privacy Strip */}
              {viewMode === "ta-self-portal" && (
                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-stone-700" />
                    <span className="text-stone-700">
                      Portfolio Visibility:{" "}
                      <strong>
                        {activeTA.isPublicOptIn ? "Publicly Discoverable" : "Private (Hidden)"}
                      </strong>
                    </span>
                  </div>
                  <button
                    onClick={() => onToggleTAPublic(activeTA.id)}
                    className="px-2.5 py-1 rounded text-xs font-medium border border-stone-300 bg-white hover:bg-stone-100 text-stone-800"
                  >
                    {activeTA.isPublicOptIn ? "Make Private" : "Enable Public View"}
                  </button>
                </div>
              )}

              {/* 4 Metrics in Minimalist Bento */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/60">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
                    Tutorial Helpfulness
                  </div>
                  <div className="text-base font-mono font-bold text-stone-900 mt-1">
                    {activeTA.metrics.helpfulness}%
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/60">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
                    Explanation Clarity
                  </div>
                  <div className="text-base font-mono font-bold text-stone-900 mt-1">
                    {activeTA.metrics.clarity}%
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/60">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
                    Ed / Piazza Speed
                  </div>
                  <div className="text-base font-mono font-bold text-stone-900 mt-1">
                    {activeTA.metrics.responsiveness}%
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/60">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
                    Verified Reviews
                  </div>
                  <div className="text-base font-mono font-bold text-stone-900 mt-1">
                    {activeTA.metrics.totalReviews}
                  </div>
                </div>
              </div>

              {/* Teaching Superpowers */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-stone-600" />
                  Student-Verified Superpowers
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeTA.superpowers.map((sp, i) => (
                    <div
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-stone-50 border border-stone-200/70 text-stone-800 text-xs font-mono flex items-center gap-2"
                    >
                      <span><span className="text-amber-500">★</span> {sp.label}</span>
                      <span className="text-[10px] text-stone-500 bg-white border border-stone-200 px-1.5 py-0.2 rounded">
                        {sp.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Endorsements */}
              <div className="space-y-2.5 pt-3 border-t border-stone-100">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Student Endorsements ({activeTA.studentEndorsements.length})
                </h3>

                <div className="space-y-2">
                  {activeTA.studentEndorsements
                    .filter((e) => viewMode === "ta-self-portal" || e.isPublic)
                    .map((endorsement) => (
                      <div
                        key={endorsement.id}
                        className="p-3 rounded-lg bg-stone-50/70 border border-stone-200/70 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-stone-200 text-stone-800">
                            {endorsement.courseCode} • {endorsement.term}
                          </span>

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
                                  : "bg-stone-100 border-stone-200 text-stone-500"
                              }`}
                            >
                              {endorsement.isPublic ? "Visible Publicly" : "Hidden"}
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

              {/* Private Coaching Notes (TA Self-View Mode) */}
              {viewMode === "ta-self-portal" && (
                <div className="space-y-2.5 pt-3 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-stone-600" />
                      Private Coaching Tips (Only You See This)
                    </h3>
                    <span className="text-[10px] font-mono text-stone-400">
                      Confidential
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activeTA.privateConstructiveFeedback.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg bg-stone-50 border border-stone-200/80 space-y-1.5 text-xs"
                      >
                        <div className="font-mono text-[11px] text-stone-700 font-medium">
                          {item.courseCode} ({item.term}):
                        </div>
                        <p className="text-stone-600">{item.note}</p>
                        <div className="p-2 rounded bg-white border border-stone-200/60 text-[11px] text-stone-700 flex items-start gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-stone-800">Suggested Action: </strong>
                            {item.actionableTip}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: INSTRUCTORS COMPARISON MATRIX */}
      {hubSection === "instructors" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between text-xs">
            <div>
              <h2 className="font-semibold text-stone-900">
                Course Instructor Delivery Matrix
              </h2>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Understand teaching styles, pace, and expectations across UW departments.
              </p>
            </div>
            <span className="font-mono text-stone-400 text-[11px]">
              {instructors.length} faculty profiles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {instructors.map((inst) => (
              <div
                key={inst.id}
                className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs space-y-2.5 text-xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-stone-900 text-sm">
                        {inst.name}
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                        {inst.title} • {inst.courses.join(", ")}
                      </div>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200/60">
                      {inst.pace}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-stone-700 bg-stone-50 border border-stone-200/60 px-2 py-0.5 rounded inline-block">
                    Format: {inst.deliveryMode}
                  </div>

                  <p className="text-stone-600 leading-relaxed text-xs">
                    {inst.teachingStyleSummary}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {inst.styleTags.map((tagId) => {
                      const label = LEARNING_STYLE_OPTIONS.find(
                        (o) => o.id === tagId
                      )?.label;
                      return (
                        <span
                          key={tagId}
                          className="text-[10px] font-mono bg-stone-50 border border-stone-200 px-1.5 py-0.5 rounded text-stone-600"
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
