import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import api from "../api/client";

function ApplyODS() {
  const navigate = useNavigate();

  // ==============================
  // FORM DATA
  // ==============================
  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "",
    organizer: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    purpose: "",
    eventLink: "",
    mentor: "",
  });

  const [proof, setProof] = useState(null);

  // ==============================
  // UI STATES
  // ==============================
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ==============================
  // HANDLE INPUT CHANGE
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove old error when user starts editing
    if (error) {
      setError("");
    }
  };

  // ==============================
  // HANDLE PROOF FILE
  // ==============================
  const handleProofChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setProof(null);
      return;
    }

    // Allowed file types
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload only PDF, JPG, JPEG or PNG files.");
      e.target.value = "";
      setProof(null);
      return;
    }

    // 5 MB limit
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Proof file must be smaller than 5 MB.");
      e.target.value = "";
      setProof(null);
      return;
    }

    setProof(file);
    setError("");
  };

  // ==============================
  // HANDLE FORM SUBMIT
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) {
      return;
    }

    setError("");

    // ==============================
    // BASIC VALIDATION
    // ==============================

    if (!formData.eventName.trim()) {
      setError("Please enter the event name.");
      return;
    }

    if (!formData.eventType) {
      setError("Please select an event type.");
      return;
    }

    if (!formData.organizer.trim()) {
      setError("Please enter the organizer name.");
      return;
    }

    if (!formData.location.trim()) {
      setError("Please enter the event location.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter the event description.");
      return;
    }

    if (!formData.startDate) {
      setError("Please select the start date.");
      return;
    }

    if (!formData.endDate) {
      setError("Please select the end date.");
      return;
    }

    if (!formData.startTime) {
      setError("Please select the start time.");
      return;
    }

    if (!formData.endTime) {
      setError("Please select the end time.");
      return;
    }

    if (!formData.purpose.trim()) {
      setError("Please enter the purpose of the ODS.");
      return;
    }

    if (!proof) {
      setError("Please upload event registration proof.");
      return;
    }

    if (!formData.mentor) {
      setError("Please select a mentor.");
      return;
    }

    // ==============================
    // DATE VALIDATION
    // ==============================

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("End date cannot be before start date.");
      return;
    }

    // ==============================
    // TIME VALIDATION
    // ==============================

    if (
      formData.startDate === formData.endDate &&
      formData.endTime <= formData.startTime
    ) {
      setError("End time must be after start time.");
      return;
    }

    // ==============================
    // SEND TO BACKEND
    // ==============================

    try {
      setSubmitting(true);

      console.log("Submitting ODS:", formData);

      const response = await api.post("/ods", {
        eventName: formData.eventName.trim(),
        eventType: formData.eventType,
        organizer: formData.organizer.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        purpose: formData.purpose.trim(),
        eventLink: formData.eventLink.trim(),
        mentor: formData.mentor,

        // The actual file is NOT sent yet.
        // Your current backend needs file-upload
        // support before this can be uploaded.
      });
      if (response.data?.success) {
  alert("ODS application submitted successfully!");
  navigate("/student/dashboard");
}

      console.log("ODS Response:", response.data);

      // ==============================
      // SUCCESS
      // ==============================

      if (response.data?.success) {
        alert(
          "ODS application submitted successfully!"
        );

        // Clear form
        setFormData({
          eventName: "",
          eventType: "",
          organizer: "",
          description: "",
          location: "",
          startDate: "",
          endDate: "",
          startTime: "",
          endTime: "",
          purpose: "",
          eventLink: "",
          mentor: "",
        });

        setProof(null);

        // ==============================
        // GO TO DASHBOARD
        // ==============================

        navigate("/student/dashboard");

      } else {
        setError(
          response.data?.message ||
          "Application could not be submitted."
        );
      }

    } catch (error) {
      console.error("ODS submission error:", error);

      if (error.response) {
        console.error(
          "Backend response:",
          error.response.data
        );

        setError(
          error.response.data?.message ||
          "Server rejected the application."
        );
      } else if (error.request) {
        setError(
          "Cannot connect to the backend server."
        );
      } else {
        setError(
          "Something went wrong while submitting the application."
        );
      }

    } finally {
      setSubmitting(false);
    }
  };

  // ==============================
  // SAVE AS DRAFT
  // ==============================

  const handleSaveDraft = () => {
    localStorage.setItem(
      "odsDraft",
      JSON.stringify(formData)
    );

    alert("ODS draft saved on this device.");
  };

  // ==============================
  // JSX
  // ==============================

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <Sidebar role="student" />

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* NAVBAR */}
        <Navbar title="Apply for ODS" />

        <section className="form-page">

          {/* PAGE HEADING */}
          <div className="page-heading">
            <h1>ODS Application</h1>

            <p>
              Submit your request for attending an event.
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div
              className="error-message"
              style={{
                padding: "12px 16px",
                marginBottom: "20px",
                borderRadius: "8px",
                background: "#fee2e2",
                color: "#b91c1c",
                border: "1px solid #fecaca",
              }}
            >
              {error}
            </div>
          )}

          {/* FORM */}
          <form
            className="ods-form"
            onSubmit={handleSubmit}
          >

            {/* ==============================
                EVENT INFORMATION
            ============================== */}

            <div className="form-section">

              <h2>Event Information</h2>

              <div className="form-grid">

                {/* EVENT NAME */}
                <div>
                  <label>
                    Event Name *
                  </label>

                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    placeholder="Enter event name"
                    required
                  />
                </div>

                {/* EVENT TYPE */}
                <div>
                  <label>
                    Event Type *
                  </label>

                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Event Type
                    </option>

                    <option value="Hackathon">
                      Hackathon
                    </option>

                    <option value="Competition">
                      Competition
                    </option>

                    <option value="Workshop">
                      Workshop
                    </option>

                    <option value="Seminar">
                      Seminar
                    </option>

                    <option value="Internship">
                      Internship
                    </option>

                    <option value="Technical Event">
                      Technical Event
                    </option>

                    <option value="Sports Event">
                      Sports Event
                    </option>

                    <option value="Cultural Event">
                      Cultural Event
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                {/* ORGANIZER */}
                <div>
                  <label>
                    Organizer *
                  </label>

                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                    placeholder="Organizer name"
                    required
                  />
                </div>

                {/* LOCATION */}
                <div>
                  <label>
                    Event Location *
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Event location"
                    required
                  />
                </div>

              </div>

              {/* DESCRIPTION */}
              <label>
                Event Description *
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the event..."
                rows="4"
                required
              />

            </div>


            {/* ==============================
                DATE & TIME
            ============================== */}

            <div className="form-section">

              <h2>Date & Time</h2>

              <div className="form-grid">

                {/* START DATE */}
                <div>
                  <label>
                    Start Date *
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* END DATE */}
                <div>
                  <label>
                    End Date *
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* START TIME */}
                <div>
                  <label>
                    Start Time *
                  </label>

                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* END TIME */}
                <div>
                  <label>
                    End Time *
                  </label>

                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

            </div>


            {/* ==============================
                ODS PURPOSE
            ============================== */}

            <div className="form-section">

              <h2>ODS Purpose</h2>

              <label>
                Purpose / Reason *
              </label>

              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="Why do you want to attend this event?"
                rows="4"
                required
              />

            </div>


            {/* ==============================
                SUPPORTING INFORMATION
            ============================== */}

            <div className="form-section">

              <h2>Supporting Information</h2>

              <label>
                Event Registration Proof *
              </label>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleProofChange}
                required
              />

              {proof && (
                <p
                  className="helper-text"
                  style={{
                    marginTop: "8px",
                  }}
                >
                  Selected file:{" "}
                  <strong>
                    {proof.name}
                  </strong>
                </p>
              )}

              <label>
                Event Website / Link
              </label>

              <input
                type="url"
                name="eventLink"
                value={formData.eventLink}
                onChange={handleChange}
                placeholder="https://example.com"
              />

            </div>


            {/* ==============================
                MENTOR SELECTION
            ============================== */}

            <div className="form-section">

              <h2>Mentor Selection</h2>

              <label>
                Select Mentor *
              </label>

              <select
                name="mentor"
                value={formData.mentor}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Mentor
                </option>

                <option value="faculty1">
                  Dr. Faculty One - CSE
                </option>

                <option value="faculty2">
                  Prof. Faculty Two - CSE
                </option>

                <option value="faculty3">
                  Dr. Faculty Three - CSE
                </option>

              </select>

              <p className="helper-text">
                Mentors will be filtered according
                to your department.
              </p>

            </div>


            {/* ==============================
                BUTTONS
            ============================== */}

            <div className="form-actions">

              {/* SAVE DRAFT */}
              <button
                type="button"
                className="secondary-btn"
                onClick={handleSaveDraft}
                disabled={submitting}
              >
                Save as Draft
              </button>


              {/* SUBMIT */}
              <button
                type="submit"
                className="primary-btn"
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit ODS Application"}
              </button>

            </div>

          </form>

        </section>

      </main>

    </div>
  );
}

export default ApplyODS;