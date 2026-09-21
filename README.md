# 🎓 College ODS Management System
# Jenkins automatic trigger test
A full-stack **College On-Duty (ODS) Management System** designed to digitize and streamline the complete process of applying for, approving, managing, and completing On-Duty requests for students participating in hackathons, workshops, competitions, internships, seminars, sports, cultural activities, and other academic/extracurricular events.

The system replaces the traditional paper-based/manual ODS process with a centralized ERP-style platform involving **Students, Mentors/Faculty, Coordinators, and Administrators**.

---

## 🚀 Project Overview

In many colleges, students participating in external events need to:

- Apply for On-Duty permission
- Select a mentor
- Get mentor approval
- Get approval from designated faculty/coordinators
- Receive the approved ODS document
- Attend the event
- Submit proof after returning
- Upload certificates, reports, photographs, or project evidence
- Get the submitted proof verified

Managing this manually can lead to:

- Delayed approvals
- Lost documents
- Repeated paperwork
- Difficulty tracking application status
- Lack of centralized records
- Communication gaps between students and faculty

### 💡 Our Solution

The **College ODS Management System** provides a centralized digital workflow where every ODS application can be created, reviewed, approved, tracked, and completed online.

---

# ✨ Key Features

## 👨‍🎓 Student Module

Students can:

- Create an account using their official college email
- Login securely
- Access a personalized dashboard
- Apply for ODS
- Select the type of event
- Enter event details
- Select a mentor
- Upload event registration proof
- Add event website/link
- Track application status
- View approval history
- View approved ODS applications
- Submit post-event proof
- Upload:
  - Certificate
  - Event report
  - Photographs
  - Project/demo evidence
  - Other supporting documents
- Receive notifications and reminders
- View completed ODS records
- Manage profile information

---

# 👨‍🏫 Mentor / Faculty Module

Faculty members can:

- Login to the system
- View assigned student ODS requests
- Review event details
- Review supporting documents
- Approve or reject applications
- Provide remarks/comments
- View approval history
- Verify student submissions
- Track pending requests

Mentor approval is an important stage before the application moves through the coordinator approval workflow.

---

# 🏛️ Coordinator Module

Faculty coordinators can:

- View applications requiring approval
- Review student and event information
- Review mentor approval
- Approve or reject ODS requests
- Add remarks
- Track pending approvals
- View approval history
- Verify submitted post-event proof
- Track completed ODS applications

The system supports a multi-level approval workflow involving designated coordinators.

---

# 🛠️ Admin Module

Administrators can manage the overall system.

### Administrative capabilities include:

- Student management
- Faculty management
- Mentor management
- Coordinator management
- Department management
- Event type management
- ODS application management
- User role management
- Application monitoring
- Reports
- Analytics
- System-level configuration

---

# 🔄 ODS Application Workflow

The complete application lifecycle follows a structured approval process:

```text
                    ┌──────────────────┐
                    │ Student Registers│
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Student Login    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Apply for ODS    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Select Mentor    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Mentor Review    │
                    └────────┬─────────┘
                         ┌───┴───┐
                         │       │
                       Reject   Approve
                         │       │
                         ▼       ▼
                       END   Coordinator
                              Approval
                                 │
                         ┌───────┴────────┐
                         │                │
                       Reject          Approve
                         │                │
                         ▼                ▼
                       END        ODS Approved
                                         │
                                         ▼
                                ODS PDF Generation
                                         │
                                         ▼
                                  Student attends
                                    the event
                                         │
                                         ▼
                                Submit Event Proof
                                         │
                                         ▼
                                Proof Verification
                                         │
                              ┌──────────┴─────────┐
                              │                    │
                           Reject                Verify
                              │                    │
                              ▼                    ▼
                        Resubmission           Completed