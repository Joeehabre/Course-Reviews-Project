import { useState, useEffect, useRef } from "react";
import "../styles/landing.css";
import api from "../api";

function Landing({ onViewCourseDetails, onViewProfessorReviews }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [filteredProfessors, setFilteredProfessors] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [professorsLoading, setProfessorsLoading] = useState(true);
  const [coursesPage, setCoursesPage] = useState(1);
  const [professorsPage, setProfessorsPage] = useState(1);
  const [courseColumns, setCourseColumns] = useState(1);
  const [professorColumns, setProfessorColumns] = useState(1);

  const coursesGridRef = useRef(null);
  const professorsGridRef = useRef(null);

  const getProfessorInitials = (prof) => {
    const first = prof.first_name?.[0] || "";
    const last = prof.last_name?.[0] || "";
    return `${first}${last}`.toUpperCase() || "P";
  };

  const getVisiblePages = (current, total) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 4) {
      return [1, 2, 3, 4, 5, "...", total];
    }

    if (current >= total - 3) {
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    }

    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  useEffect(() => {
    let isActive = true;

    const fetchDepartments = async () => {
      try {
        const depts = await api.courses.getDepartments();
        if (isActive && Array.isArray(depts)) {
          setDepartments(depts);
        }
      } catch (err) {
        console.error("Failed to load departments:", err);
      }
    };

    const fetchCourses = async () => {
      try {
        const coursesData = await api.courses.listAll();
        if (!isActive) return;
        setCourses(coursesData || []);
        setFilteredCourses(coursesData || []);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        if (isActive) setCoursesLoading(false);
      }
    };

    const fetchProfessors = async () => {
      try {
        const professorsData = await api.professors.listAll();
        if (!isActive) return;
        setProfessors(professorsData || []);
        setFilteredProfessors(professorsData || []);
      } catch (err) {
        console.error("Failed to load professors:", err);
      } finally {
        if (isActive) setProfessorsLoading(false);
      }
    };

    const frameId = window.requestAnimationFrame(() => {
      fetchDepartments();
      fetchCourses();
      fetchProfessors();
    });

    return () => {
      isActive = false;
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    let filtered = courses;
    if (selectedDepartment) {
      filtered = filtered.filter(
        (c) => (c.department || "").toLowerCase() === selectedDepartment.toLowerCase()
      );
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          (c.title || "").toLowerCase().includes(q) ||
          (c.code || "").toLowerCase().includes(q)
      );
    }
    setFilteredCourses(filtered);

    let profFiltered = professors;
    if (selectedDepartment) {
      profFiltered = profFiltered.filter(
        (p) => (p.department || "").toLowerCase() === selectedDepartment.toLowerCase()
      );
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      profFiltered = profFiltered.filter((p) =>
        (`${p.first_name || ""} ${p.last_name || ""}`)
          .toLowerCase()
          .includes(q) ||
        (p.department || "").toLowerCase().includes(q)
      );
    }
    setFilteredProfessors(profFiltered);
  }, [searchQuery, selectedDepartment, courses, professors]);

  useEffect(() => {
    setCoursesPage(1);
    setProfessorsPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const getGridColumns = (el) => {
      if (!el) return 1;
      const cols = window.getComputedStyle(el).gridTemplateColumns.split(" ").filter(Boolean).length;
      return Math.max(1, cols);
    };

    const updateColumns = () => {
      setCourseColumns(getGridColumns(coursesGridRef.current));
      setProfessorColumns(getGridColumns(professorsGridRef.current));
    };

    updateColumns();
    const observer = new ResizeObserver(updateColumns);
    if (coursesGridRef.current) observer.observe(coursesGridRef.current);
    if (professorsGridRef.current) observer.observe(professorsGridRef.current);
    window.addEventListener("resize", updateColumns);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateColumns);
    };
  }, []);

  const coursesPerPage = Math.max(1, courseColumns * 2);
  const professorsPerPage = Math.max(1, professorColumns * 2);

  const totalCoursePages = Math.max(1, Math.ceil(filteredCourses.length / coursesPerPage));
  const totalProfessorPages = Math.max(1, Math.ceil(filteredProfessors.length / professorsPerPage));

  const safeCoursesPage = Math.min(coursesPage, totalCoursePages);
  const safeProfessorsPage = Math.min(professorsPage, totalProfessorPages);

  const visibleCourses = filteredCourses.slice(
    (safeCoursesPage - 1) * coursesPerPage,
    safeCoursesPage * coursesPerPage
  );

  const visibleProfessors = filteredProfessors.slice(
    (safeProfessorsPage - 1) * professorsPerPage,
    safeProfessorsPage * professorsPerPage
  );

  return (
    <div className="landing-page">
      <main className="landing-main">
        <div className="search-section">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-bar"
              placeholder="🔍 Search courses by code or title, professors by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {departments.length > 0 && (
            <div className="department-pills">
              <button
                type="button"
                className={`dept-pill ${!selectedDepartment ? "active" : ""}`}
                onClick={() => setSelectedDepartment("")}
              >
                All Departments
              </button>
              {departments.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  className={`dept-pill ${selectedDepartment === dept ? "active" : ""}`}
                  onClick={() => setSelectedDepartment(selectedDepartment === dept ? "" : dept)}
                >
                  {dept}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="courses-section">
          <h2>All Courses</h2>
          <div className="courses-grid" ref={coursesGridRef}>
            {coursesLoading ? (
              <div className="no-courses"><p>Loading courses...</p></div>
            ) : visibleCourses.length > 0 ? (
              visibleCourses.map((course) => (
                <div key={course.id} className="course-card">
                  <div className="course-content">
                    <div className="course-header-row">
                      <span className="course-dept-tag">{course.department}</span>
                      <span className="course-rating-pill">
                        ⭐ {course.average_rating != null ? course.average_rating.toFixed(1) : "N/A"}
                      </span>
                    </div>
                    <h3>{course.code} - {course.title}</h3>
                    <div className="course-meta">
                      <span className="students">
                        💬 {course.review_count || 0} review{course.review_count === 1 ? "" : "s"}
                      </span>
                    </div>
                    <button className="enroll-btn" onClick={() => onViewCourseDetails?.(course.id)}>
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-courses">
                <p>No courses found.</p>
              </div>
            )}
          </div>

          {!coursesLoading && totalCoursePages > 1 && (
            <div className="pagination">
              {getVisiblePages(safeCoursesPage, totalCoursePages).map((page, index) =>
                page === "..." ? (
                  <span key={`course-ellipsis-${index}`} className="page-ellipsis">
                    ...
                  </span>
                ) : (
                  <button
                    key={`course-page-${page}`}
                    className={`page-btn ${safeCoursesPage === page ? "active" : ""}`}
                    onClick={() => setCoursesPage(page)}
                    type="button"
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        <div className="professors-section">
          <h2>Professors</h2>
          <div className="professors-grid" ref={professorsGridRef}>
            {professorsLoading ? (
              <div className="no-courses"><p>Loading professors...</p></div>
            ) : visibleProfessors.length > 0 ? (
              visibleProfessors.map((prof) => (
                <div key={prof.id} className="professor-card">
                  <div className="prof-avatar">{getProfessorInitials(prof)}</div>
                  <h3>{prof.first_name} {prof.last_name}</h3>
                  <p className="prof-subtitle">{prof.department ? `${prof.department} Department` : "AUB Professor"}</p>
                  <div className="prof-stats-row">
                    <span className="prof-rating">
                      ⭐ {prof.average_rating != null ? prof.average_rating.toFixed(1) : "N/A"}
                    </span>
                    <span className="prof-reviews-count">
                      ({prof.review_count || 0} review{prof.review_count === 1 ? "" : "s"})
                    </span>
                  </div>
                  <button className="view-btn" onClick={() => onViewProfessorReviews?.(prof.id)}>
                    View Reviews
                  </button>
                </div>
              ))
            ) : (
              <div className="no-courses"><p>No professors found.</p></div>
            )}
          </div>

          {!professorsLoading && totalProfessorPages > 1 && (
            <div className="pagination">
              {getVisiblePages(safeProfessorsPage, totalProfessorPages).map((page, index) =>
                page === "..." ? (
                  <span key={`prof-ellipsis-${index}`} className="page-ellipsis">
                    ...
                  </span>
                ) : (
                  <button
                    key={`prof-page-${page}`}
                    className={`page-btn ${safeProfessorsPage === page ? "active" : ""}`}
                    onClick={() => setProfessorsPage(page)}
                    type="button"
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </main>
      <footer className="landing-footer">
        <p>© 2026 AfterClass · Independent Build by Joe Habre (CMPS 271, AUB)</p>
      </footer>
    </div>
  );
}

export default Landing;