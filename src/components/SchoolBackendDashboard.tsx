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
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-lg border border-indigo-800/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
              <Building2 className="w-4 h-4" />
              School &amp; Department Curriculum Intelligence Backend
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold">
              Turn Recurring Student Friction into Tracked Curriculum Reform
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              On UWFlow, dozens of students complain about the same broken lab
              server, unfair rubric, or workload spike term after term—and
              nothing changes because faculty never see structured,
              noise-filtered synthesis. This backend clusters{" "}
              <strong>verified substantive student feedback</strong> into
              actionable tickets that departments can resolve and publish back
              to the course page.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 shrink-0">
            <div className="bg-slate-900/90 border border-slate-700 p-3.5 rounded-xl">
              <div className="text-[11px] text-slate-400 font-semibold">
                Substantive Mentions Clustered
              </div>
              <div className="text-2xl font-extrabold text-amber-400 mt-0.5">
                {totalMentions}
              </div>
              <div className="text-[10px] text-emerald-400 mt-0.5">
                100% noise/rant filtered
              </div>
            </div>
            <div className="bg-slate-900/90 border border-slate-700 p-3.5 rounded-xl">
              <div className="text-[11px] text-slate-400 font-semibold">
                Closed-Loop Fixes Published
              </div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">
                {addressedCount} / {issues.length}
              </div>
              <div className="text-[10px] text-slate-300 mt-0.5">
                {needsActionCount} awaiting dept action
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">
            Filter by Course:
          </span>
          {["All", ...courses.map((c) => c.code)].map((code) => (
            <button
              key={code}
              onClick={() => setSelectedCourseFilter(code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedCourseFilter === code
                  ? "bg-slate-900 text-amber-300"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {code}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedStatusFilter === st
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
              className={`bg-white rounded-2xl p-6 border transition-all ${
                isHighlighted
                  ? "border-2 border-indigo-500 shadow-md"
                  : "border-slate-200 shadow-sm"
              }`}
            >
              {/* Top Row: Badges + Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onJumpToCourse(issue.courseCode)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 text-amber-300 font-extrabold text-xs hover:bg-slate-800 flex items-center gap-1"
                  >
                    {issue.courseCode}
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                      issue.severity === "High"
                        ? "bg-rose-100 text-rose-800"
                        : issue.severity === "Medium"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {issue.severity} Priority
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 text-xs font-semibold">
                    {issue.category}
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                    {issue.mentionCount} Substantive Reviews (
                    {issue.termsAffected.join(", ")})
                  </span>
                </div>

                {/* Current Status Pill */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                    issue.status === "Addressed in Curriculum"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : issue.status === "In Progress"
                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                      : "bg-rose-100 text-rose-900 border border-rose-300"
                  }`}
                >
                  {issue.status === "Addressed in Curriculum" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : issue.status === "In Progress" ? (
                    <Clock className="w-4 h-4 text-amber-600" />
                  ) : (
                    <AlertOctagon className="w-4 h-4 text-rose-600" />
                  )}
                  {issue.status}
                </span>
              </div>

              {/* Issue Title & Synthesized Root Cause */}
              <div className="mt-4">
                <h2 className="text-lg font-extrabold text-slate-900">
                  {issue.title}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-3">
                  <div className="lg:col-span-7 space-y-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        Synthesized Systemic Bottleneck (Multi-Term Pattern)
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {issue.aiSynthesizedSummary}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200/80">
                      <div className="text-xs font-bold text-indigo-950 flex items-center gap-1.5 mb-1">
                        <Layers className="w-3.5 h-3.5 text-indigo-600" />
                        Recommended Department / Course Team Intervention
                      </div>
                      <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                        {issue.recommendedAction}
                      </p>
                    </div>
                  </div>

                  {/* Representative Student Quotes */}
                  <div className="lg:col-span-5 p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/70 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5 mb-2">
                        <MessageSquareQuote className="w-3.5 h-3.5 text-amber-600" />
                        Verbatim Evidence from Substantive Reviews
                      </div>
                      <div className="space-y-2">
                        {issue.sampleQuotes.map((q, idx) => (
                          <blockquote
                            key={idx}
                            className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-amber-200/60"
                          >
                            &ldquo;{q}&rdquo;
                          </blockquote>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center justify-between">
                      <span className="text-[11px] text-amber-900 font-medium">
                        Want to close the feedback loop for students?
                      </span>
                      <button
                        onClick={() =>
                          isEditing
                            ? setEditingIssueId(null)
                            : handleOpenEditor(issue)
                        }
                        className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline"
                      >
                        {isEditing
                          ? "Hide Action Publisher"
                          : "Respond / Update Status →"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Resolution Banner if already present */}
              {issue.officialResolution && !isEditing && (
                <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-emerald-950">
                    <span className="font-bold text-emerald-800 block mb-0.5">
                      ✓ Published to {issue.courseCode} Public Course Changelog
                      ({issue.updatedBy || "Course Team"}):
                    </span>
                    {issue.officialResolution}
                  </div>
                  <button
                    onClick={() => handleOpenEditor(issue)}
                    className="shrink-0 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-lg"
                  >
                    Edit Resolution
                  </button>
                </div>
              )}

              {isJustPublished && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-between">
                  <span>
                    ✓ Resolution published! It is now live on the{" "}
                    {issue.courseCode} Student Course Page Changelog and linked
                    student reviews.
                  </span>
                  <button
                    onClick={() => onJumpToCourse(issue.courseCode)}
                    className="underline font-extrabold ml-3"
                  >
                    View on {issue.courseCode} Page →
                  </button>
                </div>
              )}

              {/* Interactive Close-the-Loop Publisher Panel */}
              {isEditing && (
                <div className="mt-4 pt-4 border-t border-slate-200 bg-slate-900 text-white p-5 rounded-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-extrabold text-amber-300">
                        Close the Loop: Publish Curriculum Action to{" "}
                        {issue.courseCode}
                      </h3>
                      <p className="text-xs text-slate-300">
                        Publishing an action updates this issue&apos;s status,
                        appends an entry to the course&apos;s public &ldquo;You
                        Spoke, We Updated&rdquo; Changelog, and badges linked
                        student reviews.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                        Responder / Role
                      </label>
                      <input
                        type="text"
                        value={responderRole}
                        onChange={(e) => setResponderRole(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                        Concrete Curriculum / Lab Fix Description
                      </label>
                      <input
                        type="text"
                        value={resolutionDraft}
                        onChange={(e) => setResolutionDraft(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button
                      onClick={() =>
                        handlePublishResolution(issue.id, "In Progress")
                      }
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-amber-300 transition-colors"
                    >
                      Mark &ldquo;In Progress&rdquo;
                    </button>
                    <button
                      onClick={() =>
                        handlePublishResolution(
                          issue.id,
                          "Addressed in Curriculum"
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-extrabold transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Publish Fix to Course Changelog
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
