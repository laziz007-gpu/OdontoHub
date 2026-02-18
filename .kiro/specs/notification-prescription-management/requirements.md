# Requirements Document

## Introduction

This document specifies requirements for implementing an active notification system and prescription/allergy management features for a dental clinic management application. The notification system will display real-time notifications from the database with support for multiple notification types and multilingual content. The prescription and allergy management system will allow doctors to track patient medications and allergies within patient profiles.

## Glossary

- **Notification_System**: The component responsible for creating, storing, retrieving, and displaying notifications to users
- **Notification**: A message sent to a user about an event or reminder in the system
- **Patient_Profile**: The data record containing patient information including personal details, prescriptions, and allergies
- **Prescription**: A medication or treatment prescribed by a doctor to a patient
- **Allergy**: A documented allergic reaction or sensitivity that a patient has to medications, materials, or substances
- **Doctor**: A dentist user with permissions to view and modify patient data
- **Badge_Count**: The visual indicator showing the number of unread notifications
- **Notification_Type**: The category of notification (appointment reminder, rating change, payment reminder, etc.)
- **Read_Status**: Boolean indicator of whether a notification has been viewed by the user
- **Multilingual_Support**: The ability to display content in multiple languages (Russian, Uzbek, English, Kazakh)

## Requirements

### Requirement 1: Notification Data Retrieval

**User Story:** As a user, I want to see real notifications from the database, so that I receive accurate and timely information about my appointments and clinic activities.

#### Acceptance Criteria

1. WHEN the notification page loads, THE Notification_System SHALL retrieve all notifications for the current user from the database
2. WHEN a new notification is created in the database, THE Notification_System SHALL make it available for retrieval within 5 seconds
3. THE Notification_System SHALL order notifications by creation timestamp in descending order (newest first)
4. WHEN retrieving notifications, THE Notification_System SHALL include all notification metadata (type, title, message, read status, timestamp)

### Requirement 2: Multiple Notification Types

**User Story:** As a user, I want to receive different types of notifications, so that I am informed about various events in the clinic system.

#### Acceptance Criteria

1. WHEN an appointment is 30 minutes away, THE Notification_System SHALL create an appointment reminder notification
2. WHEN a patient reschedules an appointment, THE Notification_System SHALL create a rescheduled notification containing the new appointment date and time
3. WHEN a patient cancels an appointment, THE Notification_System SHALL create a cancellation notification containing the cancellation reason if provided, otherwise "причины нет"
4. WHEN analytics data requires review, THE Notification_System SHALL create an analytics check reminder notification
5. WHEN a doctor's rating decreases by 1 or more points, THE Notification_System SHALL create a rating decreased notification
6. WHEN a doctor's rating increases by 1 or more points, THE Notification_System SHALL create a rating increased notification
7. WHEN a patient rates an appointment, THE Notification_System SHALL create a notification containing the rating value in stars
8. WHEN a patient leaves a review, THE Notification_System SHALL create a notification containing the review text
9. WHEN a payment is due in 3 days, THE Notification_System SHALL create a payment reminder notification

### Requirement 3: Notification Read/Unread Management

**User Story:** As a user, I want to mark notifications as read or unread, so that I can track which notifications I have already reviewed.

#### Acceptance Criteria

1. WHEN a user clicks on a notification, THE Notification_System SHALL mark that notification as read
2. WHEN a notification is marked as read, THE Notification_System SHALL update the read status in the database immediately
3. THE Notification_System SHALL allow users to mark a read notification as unread
4. WHEN displaying notifications, THE Notification_System SHALL visually distinguish between read and unread notifications
5. THE Notification_System SHALL persist read/unread status across user sessions

### Requirement 4: Notification Count Badge

**User Story:** As a user, I want to see a count of unread notifications, so that I know when I have new information to review.

#### Acceptance Criteria

1. THE Notification_System SHALL display a badge showing the count of unread notifications
2. WHEN a notification is marked as read, THE Notification_System SHALL decrease the badge count by 1
3. WHEN a notification is marked as unread, THE Notification_System SHALL increase the badge count by 1
4. WHEN the badge count is zero, THE Notification_System SHALL hide the badge or display zero
5. THE Notification_System SHALL update the badge count in real-time when notification read status changes

### Requirement 5: Multilingual Notification Support

**User Story:** As a user, I want to see notifications in my preferred language, so that I can understand the information clearly.

#### Acceptance Criteria

1. THE Notification_System SHALL support notification content in Russian, Uzbek, English, and Kazakh languages
2. WHEN creating a notification, THE Notification_System SHALL store the notification message in the user's current language preference
3. WHEN displaying notifications, THE Notification_System SHALL show content in the user's selected language
4. WHEN a user changes their language preference, THE Notification_System SHALL display existing notifications in the new language if translations are available
5. THE Notification_System SHALL use the user's language preference from their profile settings

### Requirement 6: Prescription Management

**User Story:** As a doctor, I want to add and manage prescriptions for patients, so that I can track medications prescribed during treatment.

#### Acceptance Criteria

1. WHEN viewing a patient profile, THE Patient_Profile SHALL display a list of all active prescriptions for that patient
2. WHEN a doctor adds a prescription, THE Patient_Profile SHALL store the prescription with medication name, dosage, frequency, duration, and prescription date
3. WHEN a doctor edits a prescription, THE Patient_Profile SHALL update the prescription information in the database immediately
4. WHEN a doctor deletes a prescription, THE Patient_Profile SHALL remove the prescription from the patient's record
5. THE Patient_Profile SHALL display prescriptions in chronological order with the most recent first
6. WHEN a prescription is added, edited, or deleted, THE Patient_Profile SHALL validate that the user has doctor permissions

### Requirement 7: Allergy Management

**User Story:** As a doctor, I want to add and manage patient allergies, so that I can avoid prescribing medications or using materials that may cause allergic reactions.

#### Acceptance Criteria

1. WHEN viewing a patient profile, THE Patient_Profile SHALL display a list of all documented allergies for that patient
2. WHEN a doctor adds an allergy, THE Patient_Profile SHALL store the allergy with allergen name, reaction type, severity level, and documentation date
3. WHEN a doctor edits an allergy record, THE Patient_Profile SHALL update the allergy information in the database immediately
4. WHEN a doctor deletes an allergy record, THE Patient_Profile SHALL remove the allergy from the patient's record
5. THE Patient_Profile SHALL display allergies prominently to ensure visibility during treatment planning
6. WHEN an allergy is added, edited, or deleted, THE Patient_Profile SHALL validate that the user has doctor permissions

### Requirement 8: Patient Data Tab Display

**User Story:** As a doctor, I want to see prescriptions and allergies in the patient data tab, so that I have quick access to critical patient information during appointments.

#### Acceptance Criteria

1. WHEN a doctor opens the patient data tab, THE Patient_Profile SHALL display both prescriptions and allergies sections
2. THE Patient_Profile SHALL display prescriptions and allergies in separate, clearly labeled sections
3. WHEN no prescriptions exist, THE Patient_Profile SHALL display a message indicating no prescriptions are recorded
4. WHEN no allergies exist, THE Patient_Profile SHALL display a message indicating no allergies are recorded
5. THE Patient_Profile SHALL provide action buttons for adding new prescriptions and allergies within their respective sections

### Requirement 9: Database Persistence

**User Story:** As a system administrator, I want all notification, prescription, and allergy data stored in the database, so that data is preserved and accessible across sessions.

#### Acceptance Criteria

1. THE Notification_System SHALL persist all notifications to the SQLite database using SQLAlchemy ORM
2. THE Patient_Profile SHALL persist all prescriptions to the SQLite database using SQLAlchemy ORM
3. THE Patient_Profile SHALL persist all allergies to the SQLite database using SQLAlchemy ORM
4. WHEN the application restarts, THE system SHALL retrieve all existing notifications, prescriptions, and allergies from the database
5. THE system SHALL maintain referential integrity between patients, prescriptions, allergies, and notifications

### Requirement 10: API Endpoints

**User Story:** As a frontend developer, I want RESTful API endpoints for notifications, prescriptions, and allergies, so that I can integrate these features into the user interface.

#### Acceptance Criteria

1. THE system SHALL provide a GET endpoint to retrieve all notifications for the authenticated user
2. THE system SHALL provide a PATCH endpoint to mark a notification as read or unread
3. THE system SHALL provide a GET endpoint to retrieve the unread notification count for the authenticated user
4. THE system SHALL provide POST, GET, PUT, and DELETE endpoints for managing patient prescriptions
5. THE system SHALL provide POST, GET, PUT, and DELETE endpoints for managing patient allergies
6. THE system SHALL validate authentication and authorization for all API endpoints
7. THE system SHALL return appropriate HTTP status codes and error messages for invalid requests
