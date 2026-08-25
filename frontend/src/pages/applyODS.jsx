import { useState } from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

function ApplyODS() {

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
    console.log(proof);

    alert(
      "ODS application submitted successfully!"
    );
  };

  return (
    <div className="dashboard-layout">

      <Sidebar role="student" />

      <main className="main-content">

        <Navbar title="Apply for ODS" />

        <section className="form-page">

          <div className="page-heading">
            <h1>ODS Application</h1>

            <p>
              Submit your request for attending an event.
            </p>
          </div>

          <form
            className="ods-form"
            onSubmit={handleSubmit}
          >

            <div className="form-section">

              <h2>Event Information</h2>

              <div className="form-grid">

                <div>
                  <label>Event Name *</label>

                  <input
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    placeholder="Enter event name"
                    required
                  />
                </div>

                <div>
                  <label>Event Type *</label>

                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Event Type
                    </option>

                    <option>Hackathon</option>
                    <option>Competition</option>
                    <option>Workshop</option>
                    <option>Seminar</option>
                    <option>Internship</option>
                    <option>Technical Event</option>
                    <option>Sports Event</option>
                    <option>Cultural Event</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label>Organizer *</label>

                  <input
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                    placeholder="Organizer name"
                    required
                  />
                </div>

                <div>
                  <label>Event Location *</label>

                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Event location"
                    required
                  />
                </div>

              </div>

              <label>Event Description *</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the event..."
                rows="4"
                required
              />

            </div>

            <div className="form-section">

              <h2>Date & Time</h2>

              <div className="form-grid">

                <div>
                  <label>Start Date *</label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>End Date *</label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>Start Time *</label>

                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>End Time *</label>

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

            <div className="form-section">

              <h2>ODS Purpose</h2>

              <label>Purpose / Reason *</label>

              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="Why do you want to attend this event?"
                rows="4"
                required
              />

            </div>

            <div className="form-section">

              <h2>Supporting Information</h2>

              <label>Event Registration Proof *</label>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  setProof(e.target.files[0])
                }
                required
              />

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

            <div className="form-section">

              <h2>Mentor Selection</h2>

              <label>Select Mentor *</label>

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
                Mentors will be filtered according to your department.
              </p>

            </div>

            <div className="form-actions">

              <button
                type="button"
                className="secondary-btn"
              >
                Save as Draft
              </button>

              <button
                type="submit"
                className="primary-btn"
              >
                Submit ODS Application
              </button>

            </div>

          </form>

        </section>

      </main>

    </div>
  );
}

export default ApplyODS;