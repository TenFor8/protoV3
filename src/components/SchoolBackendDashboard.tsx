"use client";

import React, { useState } from "react";
import { Course, DepartmentIssue } from "@/types";
import {
  Building2,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  MessageSquareQuote,
  Send,
  Layers,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

interface SchoolBackendDashboardProps {
  issues: DepartmentIssue[];
  courses: Course[];
  highlightedIssueId: string | null;
  onResolveIssue: (
    issueId: string,
    newStatus: DepartmentIssue["status"],
    resolutionText: string,
    responderRole: string
  ) => void;
  onJumpToCourse: (courseCode: string) => void;
}

export default function SchoolBackendDashboard({
  issues,
  courses,
  highlightedIssueId,
  onResolveIssue,
  onJumpToCourse,
}: SchoolBackendDashboardProps) {
  const [selectedCourseFilter, setSelectedCourseFilter] =
    useState<string>("All");
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<string>("All");
  const [editingIssueId, setEditingIssueId] = useState<string | null>(
    highlightedIssueId || "iss-5"
  );
  const [resolutionDraft, setResolutionDraft] = useState<string>(
    "Published item-level R plotting rubrics alongside each assignment spec and dedicated 15 minutes of weekly TA tutorials to live RStudio walkthroughs."
  );
  const [responderRole, setResponderRole] = useState<string>(
    "Undergraduate Curriculum Coordinator"
  );
  const [justPublishedId, setJustPublishedId] = useState<string | null>(null);

  const filteredIssues = issues.filter((iss) => {
    if (
      selectedCourseFilter !== "All" &&
      iss.courseCode !== selectedCourseFilter
    )
      return false;
    if (selectedStatusFilter !== "All" && iss.status !== selectedStatusFilter)
      return false;
    return true;
  });

  const addressedCount = issues.filter(
    (i) => i.status === "Addressed in Curriculum"
  ).length;
  const needsActionCount = issues.filter(
    (i) => i.status === "Needs Action"
  ).length;
  const inProgressCount = issues.filter(
    (i) => i.status === "In Progress"
  ).length;
  const totalMentions = issues.reduce((acc, i) => acc + i.mentionCount, 0);

  const handleOpenEditor = (issue: DepartmentIssue) => {
    setEditingIssueId(issue.id);
    setResolutionDraft(
      issue.officialResolution ||
        `Implemented for Upcoming Term: ${issue.recommendedAction}`
    );
  };

  const handlePublishResolution = (
    issueId: string,
    status: DepartmentIssue["status"]
  ) => {
    if (!resolutionDraft.trim()) return;
    onResolveIssue(issueId, status, resolutionDraft.trim(), responderRole);
    setJustPublishedId(issueId);
    setTimeout(() => setJustPublishedId(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Overview & Metric Strip */}
      <div className="bg-white border border-stone-200/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-stone-600" />
              <h1 className="text-base font-bold tracking-tight text-stone-900">
                Department Curriculum Intelligence Backend
              </h1>
            </div>
            <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
              Synthesizes verified substantive student reviews across terms into
              structured curriculum action tickets. Resolving an issue automatically
              publishes an update to the public course changelog.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 shrink-0">
            <div className="bg-stone-50 border border-stone-200/70 p-3 rounded-lg text-center">
              <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
                Clustered Mentions
              </div>
              <div className="text-lg font-mono font-bold text-stone-900 mt-0.5">
                {totalMentions}
              </div>
              <div className="text-[10px] text-stone-400 font-mono">
                Noise-filtered
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200/70 p-3 rounded-lg text-center">
              <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
                Needs Action
              </div>
              <div className="text-lg font-mono font-bold text-rose-700 mt-0.5">
                {needsActionCount}
              </div>
              <div className="text-[10px] text-stone-400 font-mono">
                {inProgressCount} in progress
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200/70 p-3 rounded-lg text-center">
              <div className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
                Fixes Published
              </div>
              <div className="text-lg font-mono font-bold text-emerald-800 mt-0.5">
                {addressedCount}
              </div>
              <div className="text-[10px] text-stone-400 font-mono">
                On changelog
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-3.5 border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-stone-400 mr-1">
            Course:
          </span>
          {["All", ...courses.map((c) => c.code)].map((code) => (
            <button
              key={code}
              onClick={() => setSelectedCourseFilter(code)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                selectedCourseFilter === code
                  ? "bg-stone-900 text-white font-medium"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200/60"
              }`}
            >
              {code}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-stone-400 mr-1">
            Status:
          </span>
          {(
            [
              "All",
              "Needs Action",
              "In Progress",
              "Addressed in Curriculum",
            ] as const
          ).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                selectedStatusFilter === st
                  ? "bg-stone-900 text-white font-medium"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200/60"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Clustered Issues List */}
      <div className="space-y-4">
        {filteredIssues.map((issue) => {
          const isEditing = editingIssueId === issue.id;
          const isHighlighted = highlightedIssueId === issue.id;
          const isJustPublished = justPublishedId === issue.id;

          return (
            <div
              key={issue.id}
              className={`bg-white rounded-xl p-5 border transition-all ${
                isHighlighted
                  ? "border-stone-900 shadow-sm"
                  : "border-stone-200/80 shadow-xs hover:border-stone-300"
              }`}
            >
              {/* Top Row: Meta Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => onJumpToCourse(issue.courseCode)}
                    className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-900 text-white hover:bg-stone-800 flex items-center gap-1"
                  >
                    {issue.courseCode}
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <span
                    className={`font-mono text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1 ${
                      issue.severity === "High"
                        ? "bg-rose-50 text-rose-800 border border-rose-200"
                        : issue.severity === "Medium"
                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                        : "bg-stone-100 text-stone-700 border border-stone-200"
                    }`}
                  >
                    <ShieldAlert className="w-3 h-3" />
                    {issue.severity} Priority
                  </span>

                  <span className="font-mono text-[10px] text-stone-600 bg-stone-50 border border-stone-200/60 px-2 py-0.5 rounded">
                    {issue.category}
                  </span>

                  <span className="font-mono text-[10px] text-stone-500 bg-stone-50 border border-stone-200/60 px-2 py-0.5 rounded flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-stone-500" />
                    {issue.mentionCount} reviews ({issue.termsAffected.join(", ")})
                  </span>
                </div>

                {/* Status Pill */}
                <span
                  className={`font-mono text-[10px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    issue.status === "Addressed in Curriculum"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : issue.status === "In Progress"
                      ? "bg-amber-50 text-amber-800 border border-amber-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {issue.status === "Addressed in Curriculum" ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ) : issue.status === "In Progress" ? (
                    <Clock className="w-3 h-3 text-amber-600" />
                  ) : (
                    <AlertOctagon className="w-3 h-3 text-rose-600" />
                  )}
                  {issue.status}
                </span>
              </div>

              {/* Title & Root Cause */}
              <div className="mt-3.5 space-y-3">
                <h2 className="text-base font-bold tracking-tight text-stone-900">
                  {issue.title}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                  <div className="lg:col-span-7 space-y-2.5">
                    <div className="p-3 rounded-lg bg-stone-50/70 border border-stone-200/70 text-xs space-y-1">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-stone-600" />
                        Synthesized Pattern
                      </div>
                      <p className="text-stone-700 leading-relaxed">
                        {issue.aiSynthesizedSummary}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-stone-50/70 border border-stone-200/70 text-xs space-y-1">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-stone-600" />
                        Recommended Course Team Action
                      </div>
                      <p className="text-stone-800 font-medium leading-relaxed">
                        {issue.recommendedAction}
                      </p>
                    </div>
                  </div>

                  {/* Representative Student Quotes */}
                  <div className="lg:col-span-5 p-3 rounded-lg bg-stone-50/50 border border-stone-200/70 flex flex-col justify-between text-xs space-y-2">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1 mb-1.5">
                        <MessageSquareQuote className="w-3 h-3 text-stone-600" />
                        Verbatim Student Quotes
                      </div>
                      <div className="space-y-1.5">
                        {issue.sampleQuotes.map((q, idx) => (
                          <blockquote
                            key={idx}
                            className="text-[11px] text-stone-600 italic bg-white p-2 rounded border border-stone-200/60 leading-snug"
                          >
                            &ldquo;{q}&rdquo;
                          </blockquote>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
                      <span className="text-[10px] text-stone-500">
                        Close the feedback loop:
                      </span>
                      <button
                        onClick={() =>
                          isEditing
                            ? setEditingIssueId(null)
                            : handleOpenEditor(issue)
                        }
                        className="text-xs font-medium text-stone-900 hover:underline"
                      >
                        {isEditing ? "Cancel" : "Publish Action →"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Resolution Display */}
              {issue.officialResolution && !isEditing && (
                <div className="mt-3 p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="text-emerald-950">
                    <span className="font-semibold text-emerald-900 block mb-0.5">
                      ✓ Published to {issue.courseCode} Changelog ({issue.updatedBy || "Course Team"}):
                    </span>
                    {issue.officialResolution}
                  </div>
                  <button
                    onClick={() => handleOpenEditor(issue)}
                    className="shrink-0 text-[11px] font-medium text-emerald-800 bg-white hover:bg-emerald-100/70 border border-emerald-300 px-2.5 py-1 rounded transition-colors self-start sm:self-auto"
                  >
                    Edit
                  </button>
                </div>
              )}

              {/* Just Published Flash */}
              {isJustPublished && (
                <div className="mt-3 p-2.5 rounded-lg bg-emerald-800 text-white text-xs font-medium flex items-center justify-between">
                  <span>
                    ✓ Published! Live on {issue.courseCode} course page changelog.
                  </span>
                  <button
                    onClick={() => onJumpToCourse(issue.courseCode)}
                    className="underline text-emerald-100 hover:text-white text-xs"
                  >
                    View on Course Page →
                  </button>
                </div>
              )}

              {/* Interactive Publisher Form */}
              {isEditing && (
                <div className="mt-4 pt-3.5 border-t border-stone-200 bg-stone-50 p-4 rounded-lg space-y-3 text-xs">
                  <div>
                    <h3 className="font-semibold text-stone-900">
                      Publish Action to {issue.courseCode} Public Changelog
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      This updates the issue status and adds a verified fix entry to
                      the student course page.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-1">
                        Responder Role
                      </label>
                      <input
                        type="text"
                        value={responderRole}
                        onChange={(e) => setResponderRole(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-md bg-white border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-stone-400"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-semibold uppercase text-stone-500 mb-1">
                        Curriculum / Lab Fix Description
                      </label>
                      <input
                        type="text"
                        value={resolutionDraft}
                        onChange={(e) => setResolutionDraft(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-md bg-white border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-stone-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => setEditingIssueId(null)}
                      className="px-3 py-1.5 rounded-md text-xs font-medium text-stone-600 hover:text-stone-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() =>
                        handlePublishResolution(issue.id, "In Progress")
                      }
                      className="px-3 py-1.5 rounded-md bg-white border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-800"
                    >
                      Mark In Progress
                    </button>
                    <button
                      onClick={() =>
                        handlePublishResolution(
                          issue.id,
                          "Addressed in Curriculum"
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      Publish to Course Changelog
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
