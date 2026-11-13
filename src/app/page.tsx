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
    <div className="min-h-screen flex flex-col bg-stone-50/50 text-stone-900 font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Brand Logo matching reference */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-stone-950 text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-xs">
                CG
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-base tracking-tight text-stone-900">
                  Course<span className="text-amber-500">Glide</span>
                </span>
                <span className="text-xs text-stone-400 font-normal hidden sm:inline">
                  UW Course &amp; TA Reviews
                </span>
              </div>
            </div>

            <button
              onClick={() => handleOpenReviewModal("CS 246")}
              className="sm:hidden inline-flex items-center gap-1.5 bg-stone-950 hover:bg-stone-800 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-amber-400" />
              Write Review
            </button>
          </div>

          {/* 3-Portal Floating Pill Switcher */}
          <div className="flex items-center gap-1 bg-stone-100/90 p-1 rounded-full border border-stone-200/70 text-xs">
            <button
              onClick={() => setActiveTab("student-explorer")}
              className={`px-3.5 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                activeTab === "student-explorer"
                  ? "bg-white text-stone-950 shadow-xs font-semibold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-stone-600" />
              <span>Courses</span>
            </button>

            <button
              onClick={() => setActiveTab("ta-instructor-hub")}
              className={`px-3.5 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                activeTab === "ta-instructor-hub"
                  ? "bg-white text-stone-950 shadow-xs font-semibold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-stone-600" />
              <span>TAs &amp; Instructors</span>
            </button>

            <button
              onClick={() => setActiveTab("school-backend")}
              className={`px-3.5 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                activeTab === "school-backend"
                  ? "bg-white text-stone-950 shadow-xs font-semibold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-stone-600" />
              <span>School Dashboard</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-stone-200/80 text-stone-700">
                {issues.filter((i) => i.status === "Needs Action").length}
              </span>
            </button>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => handleOpenReviewModal("CS 246")}
            className="hidden sm:inline-flex items-center gap-1.5 bg-stone-950 hover:bg-stone-800 text-white font-medium text-xs px-3.5 py-2 rounded-lg transition-colors shadow-xs shrink-0"
          >
            <span className="text-amber-400 font-bold">+</span>
            <span>Write Review</span>
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-stone-900 text-stone-100 border border-stone-800 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
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

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-stone-200/80 bg-white/60 py-6 text-xs text-stone-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">CourseGlide</span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-500">University of Waterloo</span>
          </div>
          <p className="text-[11px] text-stone-400">
            Substantive peer evaluations • Opt-in TA portfolios • Closed-loop department action
          </p>
        </div>
      </footer>

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
