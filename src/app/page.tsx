"use client";

import React, { useState } from "react";
import {
  INITIAL_COURSES,
  INITIAL_DEPARTMENT_ISSUES,
  INITIAL_INSTRUCTORS,
  INITIAL_REVIEWS,
  INITIAL_TAS,
} from "@/data/mockData";
import { Course, DepartmentIssue, Review, TAProfile } from "@/types";
import StudentCourseExplorer from "@/components/StudentCourseExplorer";
import TAAndInstructorHub from "@/components/TAAndInstructorHub";
import SchoolBackendDashboard from "@/components/SchoolBackendDashboard";
import GuidedReviewModal from "@/components/GuidedReviewModal";
import {
  Compass,
  GraduationCap,
  Building2,
  MessageSquarePlus,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

type ActiveTab = "student-explorer" | "ta-instructor-hub" | "school-backend";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("student-explorer");
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [instructors] = useState(INITIAL_INSTRUCTORS);
  const [tas, setTas] = useState<TAProfile[]>(INITIAL_TAS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [issues, setIssues] = useState<DepartmentIssue[]>(
    INITIAL_DEPARTMENT_ISSUES
  );

  const [selectedCourseId, setSelectedCourseId] = useState<string>("cs246");
  const [selectedTAName, setSelectedTAName] = useState<string | null>(
    "Maya Chen"
  );
  const [highlightedIssueId, setHighlightedIssueId] = useState<string | null>(
    null
  );

  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [modalCourseCode, setModalCourseCode] = useState<string>("CS 246");
  const [modalTAName, setModalTAName] = useState<string>("Maya Chen");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleOpenReviewModal = (courseCode?: string, taName?: string) => {
    if (courseCode) setModalCourseCode(courseCode);
    if (taName) setModalTAName(taName);
    setIsReviewModalOpen(true);
  };

  const handleNavigateToTA = (taName: string) => {
    setSelectedTAName(taName);
    setActiveTab("ta-instructor-hub");
  };

  const handleNavigateToBackendIssue = (issueId?: string) => {
    if (issueId) setHighlightedIssueId(issueId);
    setActiveTab("school-backend");
  };

  const handleJumpToCourse = (courseCode: string) => {
    const found = courses.find((c) => c.code === courseCode);
    if (found) {
      setSelectedCourseId(found.id);
      setActiveTab("student-explorer");
    }
  };

  const handleToggleTAPublic = (taId: string) => {
    setTas((prev) =>
      prev.map((ta) =>
        ta.id === taId ? { ...ta, isPublicOptIn: !ta.isPublicOptIn } : ta
      )
    );
    triggerToast("Updated TA public portfolio visibility preference.");
  };

  const handleToggleEndorsementPublic = (
    taId: string,
    endorsementId: string
  ) => {
    setTas((prev) =>
      prev.map((ta) =>
        ta.id === taId
          ? {
              ...ta,
              studentEndorsements: ta.studentEndorsements.map((e) =>
                e.id === endorsementId ? { ...e, isPublic: !e.isPublic } : e
              ),
            }
          : ta
      )
    );
  };

  const handleResolveIssue = (
    issueId: string,
    newStatus: DepartmentIssue["status"],
    resolutionText: string,
    responderRole: string
  ) => {
    const targetIssue = issues.find((i) => i.id === issueId);
    if (!targetIssue) return;

    setIssues((prev) =>
      prev.map((iss) =>
        iss.id === issueId
          ? {
              ...iss,
              status: newStatus,
              officialResolution: resolutionText,
              updatedBy: responderRole,
            }
          : iss
      )
    );

    // Also append to the Course's Public "You Spoke, We Updated" Changelog
    setCourses((prev) =>
      prev.map((course) => {
        if (course.code !== targetIssue.courseCode) return course;
        const newLog = {
          id: `cl-${Date.now()}`,
          term: "Fall 2026",
          author: responderRole,
          role: "Department Action Loop",
          issueRaised: `${targetIssue.title} (${targetIssue.mentionCount} substantive reviews)`,
          actionTaken: resolutionText,
          impactMetric:
            newStatus === "Addressed in Curriculum"
              ? "Live on Course Changelog"
              : "Implementation In Progress",
        };
        return {
          ...course,
          changelog: [newLog, ...course.changelog],
        };
      })
    );

    // Also badge any student review linked to this issueId
    setReviews((prev) =>
      prev.map((rev) =>
        rev.linkedIssueId === issueId
          ? {
              ...rev,
              schoolResponse: {
                responder: responderRole,
                role: `${targetIssue.courseCode} Course Team`,
                date: "Just updated",
                message: resolutionText,
                status:
                  newStatus === "Addressed in Curriculum"
                    ? "Addressed"
                    : "In Progress",
              },
            }
          : rev
      )
    );

    triggerToast(
      `Closed the loop! Published "${newStatus}" update to ${targetIssue.courseCode}'s public Course Changelog.`
    );
  };

  const handleSubmitReview = (
    newReview: Review,
    newTAEndorsement?: { taName: string; quote: string; context: string },
    newTAPrivateTip?: { taName: string; note: string; actionableTip: string },
    autoCreateBackendIssue?: {
      courseCode: string;
      title: string;
      summary: string;
      quote: string;
    }
  ) => {
    let createdIssueId: string | undefined = undefined;

    if (autoCreateBackendIssue) {
      createdIssueId = `iss-${Date.now()}`;
      const newIssue: DepartmentIssue = {
        id: createdIssueId,
        courseCode: autoCreateBackendIssue.courseCode,
        title: autoCreateBackendIssue.title,
        category: "Assessment Alignment",
        severity: "High",
        mentionCount: 1,
        termsAffected: ["Fall 2026"],
        aiSynthesizedSummary: autoCreateBackendIssue.summary,
        sampleQuotes: [autoCreateBackendIssue.quote],
        recommendedAction:
          "Review assessment rubric alignment and publish milestone checkpoints before midterm week.",
        status: "Needs Action",
      };
      setIssues((prev) => [newIssue, ...prev]);
    }

    const reviewWithLink: Review = {
      ...newReview,
      linkedIssueId: createdIssueId,
    };

    setReviews((prev) => [reviewWithLink, ...prev]);

    if (newTAEndorsement || newTAPrivateTip) {
      setTas((prev) =>
        prev.map((ta) => {
          const matchesEndorsement =
            newTAEndorsement && ta.name === newTAEndorsement.taName;
          const matchesPrivate =
            newTAPrivateTip && ta.name === newTAPrivateTip.taName;

          if (!matchesEndorsement && !matchesPrivate) return ta;

          return {
            ...ta,
            metrics: {
              ...ta.metrics,
              totalReviews: ta.metrics.totalReviews + 1,
            },
            studentEndorsements: matchesEndorsement
              ? [
                  {
                    id: `end-${Date.now()}`,
                    courseCode: newReview.courseCode,
                    term: "Fall 2026",
                    quote: newTAEndorsement!.quote,
                    context: newTAEndorsement!.context,
                    isPublic: true,
                  },
                  ...ta.studentEndorsements,
                ]
              : ta.studentEndorsements,
            privateConstructiveFeedback: matchesPrivate
              ? [
                  {
                    id: `priv-${Date.now()}`,
                    courseCode: newReview.courseCode,
                    term: "Fall 2026",
                    note: newTAPrivateTip!.note,
                    actionableTip: newTAPrivateTip!.actionableTip,
                  },
                  ...ta.privateConstructiveFeedback,
                ]
              : ta.privateConstructiveFeedback,
          };
        })
      );
    }

    const matchedCourse = courses.find((c) => c.code === newReview.courseCode);
    if (matchedCourse) {
      setSelectedCourseId(matchedCourse.id);
    }

    triggerToast(
      `Published substantive review (${newReview.substanceScore}/100)! Synced to ${newReview.courseCode} student feed, TA portfolio, and School Backend.`
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Brand Logo + Tagline */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-base shadow-sm">
                CG
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-white">
                    Course<span className="text-amber-400">Glide</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                    Two-Sided Course &amp; TA Intelligence
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Style-matched student reviews • Opt-in TA teaching portfolios
                  • Closed-loop school curriculum action
                </p>
              </div>
            </div>

            <button
              onClick={() => handleOpenReviewModal("CS 246")}
              className="lg:hidden inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs px-3 py-2 rounded-xl"
            >
              <MessageSquarePlus className="w-4 h-4" />
              Write Review
            </button>
          </div>

          {/* 3-Portal Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("student-explorer")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "student-explorer"
                  ? "bg-amber-400 text-slate-950 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Compass className="w-4 h-4" />
              1. Student Course &amp; Style Matcher
            </button>

            <button
              onClick={() => setActiveTab("ta-instructor-hub")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "ta-instructor-hub"
                  ? "bg-amber-400 text-slate-950 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              2. TA &amp; Instructor Portfolios
            </button>

            <button
              onClick={() => setActiveTab("school-backend")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "school-backend"
                  ? "bg-amber-400 text-slate-950 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Building2 className="w-4 h-4" />
              3. School / Dept Action Backend
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-extrabold">
                {issues.filter((i) => i.status === "Needs Action").length}
              </span>
            </button>
          </div>

          {/* CTA Button: Write Review / Test Substance Filter */}
          <button
            onClick={() => handleOpenReviewModal("CS 246")}
            className="hidden lg:inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            + Write Review (Test Substance Filter)
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-slate-900 text-white border border-amber-400/60 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === "student-explorer" && (
          <StudentCourseExplorer
            courses={courses}
            instructors={instructors}
            tas={tas}
            reviews={reviews}
            selectedCourseId={selectedCourseId}
            onSelectCourse={setSelectedCourseId}
            onOpenReviewModal={(code) => handleOpenReviewModal(code)}
            onNavigateToTA={handleNavigateToTA}
            onNavigateToBackendIssue={handleNavigateToBackendIssue}
          />
        )}

        {activeTab === "ta-instructor-hub" && (
          <TAAndInstructorHub
            tas={tas}
            instructors={instructors}
            selectedTAName={selectedTAName}
            onSelectTAName={setSelectedTAName}
            onToggleTAPublic={handleToggleTAPublic}
            onToggleEndorsementPublic={handleToggleEndorsementPublic}
            onOpenReviewModal={handleOpenReviewModal}
          />
        )}

        {activeTab === "school-backend" && (
          <SchoolBackendDashboard
            issues={issues}
            courses={courses}
            highlightedIssueId={highlightedIssueId}
            onResolveIssue={handleResolveIssue}
            onJumpToCourse={handleJumpToCourse}
          />
        )}
      </main>

      {/* Guided Review Composer Modal */}
      <GuidedReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        courses={courses}
        instructors={instructors}
        tas={tas}
        initialCourseCode={modalCourseCode}
        initialTAName={modalTAName}
        onSubmitReview={handleSubmitReview}
      />
    </div>
  );
}
