# Implementation Plan: Notification System and Prescription/Allergy Management

## Overview

This implementation plan breaks down the notification system and prescription/allergy management features into discrete, incremental coding tasks. The plan follows a bottom-up approach: first implementing database models and migrations, then backend API endpoints, and finally frontend components. Each task builds on previous work, with testing integrated throughout to catch errors early.

## Tasks

- [x] 1. Set up database models and migrations
  - [x] 1.1 Create Prescription model in Backend/app/models/prescription.py
    - Define Prescription SQLAlchemy model with fields: id, patient_id, medication_name, dosage, frequency, duration, notes, prescribed_by, prescribed_at
    - Add relationship to PatientProfile and User models
    - _Requirements: 6.2, 9.2_
  
  - [x] 1.2 Create Allergy model in Backend/app/models/allergy.py
    - Define Allergy SQLAlchemy model with fields: id, patient_id, allergen_name, reaction_type, severity, notes, documented_by, documented_at
    - Define AllergySeverity enum (mild, moderate, severe)
    - Add relationship to PatientProfile and User models
    - _Requirements: 7.2, 9.3_
  
  - [x] 1.3 Update PatientProfile model to include prescription and allergy relationships
    - Add prescriptions relationship with cascade delete
    - Add allergies relationship with cascade delete
    - Update Backend/app/models/patient.py
    - _Requirements: 9.5_
  
  - [x] 1.4 Update Notification model if needed
    - Verify existing notification model supports all required notification types
    - Ensure metadata field can store JSON data
    - Update Backend/app/models/notification.py if necessary
    - _Requirements: 1.1, 2.1-2.9_
  
  - [x] 1.5 Create database migration script
    - Create Alembic migration for new tables (prescriptions, allergies)
    - Create migration for PatientProfile relationship updates
    - Test migration on development database
    - _Requirements: 9.1, 9.2, 9.3_

- [x] 2. Create Pydantic schemas for API validation
  - [x] 2.1 Create prescription schemas in Backend/app/schemas/prescription.py
    - Define PrescriptionBase, PrescriptionCreate, PrescriptionUpdate, PrescriptionSchema
    - Add field validation (required fields, max lengths)
    - _Requirements: 6.2, 10.4_
  
  - [x] 2.2 Create allergy schemas in Backend/app/schemas/allergy.py
    - Define AllergyBase, AllergyCreate, AllergyUpdate, AllergySchema
    - Add field validation and severity enum validation
    - _Requirements: 7.2, 10.5_
  
  - [x] 2.3 Create notification schemas in Backend/app/schemas/notification.py
    - Define NotificationBase, NotificationCreate, NotificationSchema, UnreadCountSchema
    - Add notification type validation
    - _Requirements: 1.4, 10.1, 10.3_

- [x] 3. Implement notification API endpoints
  - [x] 3.1 Create notification router in Backend/app/routers/notifications.py
    - Implement GET /api/notifications endpoint (retrieve all for current user)
    - Implement GET /api/notifications/unread-count endpoint
    - Implement PATCH /api/notifications/{id}/read endpoint
    - Implement POST /api/notifications/mark-all-read endpoint
    - Add authentication and authorization checks
    - _Requirements: 1.1, 1.3, 3.1, 3.2, 4.1, 10.1, 10.2, 10.3, 10.6_
  
  - [ ]* 3.2 Write property test for notification ordering
    - **Property 1: Notification ordering consistency**
    - **Validates: Requirements 1.3**
  
  - [ ]* 3.3 Write property test for notification completeness
    - **Property 2: Notification completeness**
    - **Validates: Requirements 1.4**
  
  - [ ]* 3.4 Write property test for read status persistence
    - **Property 6: Read status persistence round-trip**
    - **Validates: Requirements 3.2, 3.3**
  
  - [ ]* 3.5 Write property test for unread count accuracy
    - **Property 7: Unread count accuracy**
    - **Validates: Requirements 4.2, 4.3**
  
  - [ ]* 3.6 Write unit tests for notification endpoints
    - Test GET /api/notifications returns notifications for authenticated user
    - Test unread count endpoint returns correct count
    - Test mark as read endpoint updates status
    - Test authentication requirement
    - _Requirements: 10.1, 10.2, 10.3, 10.6_

- [x] 4. Implement prescription API endpoints
  - [x] 4.1 Create prescription router in Backend/app/routers/prescriptions.py
    - Implement GET /api/patients/{patient_id}/prescriptions endpoint
    - Implement POST /api/patients/{patient_id}/prescriptions endpoint
    - Implement PUT /api/prescriptions/{id} endpoint
    - Implement DELETE /api/prescriptions/{id} endpoint
    - Add doctor role authorization checks
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.6, 10.4, 10.6_
  
  - [ ]* 4.2 Write property test for prescription CRUD completeness
    - **Property 9: Prescription CRUD completeness**
    - **Validates: Requirements 6.2, 6.3, 6.4**
  
  - [ ]* 4.3 Write property test for prescription ordering
    - **Property 10: Prescription ordering consistency**
    - **Validates: Requirements 6.5**
  
  - [ ]* 4.4 Write property test for doctor-only authorization
    - **Property 12: Doctor-only prescription and allergy operations**
    - **Validates: Requirements 6.6**
  
  - [ ]* 4.5 Write unit tests for prescription endpoints
    - Test GET endpoint returns all prescriptions for patient
    - Test POST endpoint creates prescription with all fields
    - Test PUT endpoint updates prescription
    - Test DELETE endpoint removes prescription
    - Test non-doctor users are rejected
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.6_

- [x] 5. Implement allergy API endpoints
  - [x] 5.1 Create allergy router in Backend/app/routers/allergies.py
    - Implement GET /api/patients/{patient_id}/allergies endpoint
    - Implement POST /api/patients/{patient_id}/allergies endpoint
    - Implement PUT /api/allergies/{id} endpoint
    - Implement DELETE /api/allergies/{id} endpoint
    - Add doctor role authorization checks
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.6, 10.5, 10.6_
  
  - [ ]* 5.2 Write property test for allergy CRUD completeness
    - **Property 11: Allergy CRUD completeness**
    - **Validates: Requirements 7.2, 7.3, 7.4**
  
  - [ ]* 5.3 Write property test for referential integrity
    - **Property 13: Referential integrity on patient deletion**
    - **Validates: Requirements 9.5**
  
  - [ ]* 5.4 Write unit tests for allergy endpoints
    - Test GET endpoint returns all allergies for patient
    - Test POST endpoint creates allergy with all fields
    - Test PUT endpoint updates allergy
    - Test DELETE endpoint removes allergy
    - Test cascade delete when patient is deleted
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 9.5_

- [-] 6. Register new routers in main application
  - [x] 6.1 Update Backend/app/main.py to include new routers
    - Import and register notification router
    - Import and register prescription router
    - Import and register allergy router
    - Verify router prefixes and tags
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 7. Checkpoint - Backend API complete
  - Ensure all tests pass, ask the user if questions arise.

- [-] 8. Create TypeScript interfaces and types
  - [x] 8.1 Create notification types in OdontoHub-1/src/types/notification.ts
    - Define Notification interface
    - Define NotificationType union type
    - Define notification metadata types for each notification type
    - _Requirements: 1.4, 2.1-2.9_
  
  - [x] 8.2 Create prescription types in OdontoHub-1/src/types/prescription.ts
    - Define Prescription interface
    - Define PrescriptionCreate interface
    - Define PrescriptionUpdate interface
    - _Requirements: 6.2_
  
  - [x] 8.3 Create allergy types in OdontoHub-1/src/types/allergy.ts
    - Define Allergy interface
    - Define AllergyCreate interface
    - Define AllergyUpdate interface
    - Define AllergySeverity type
    - _Requirements: 7.2_

- [ ] 9. Create API client functions
  - [x] 9.1 Create notification API client in OdontoHub-1/src/api/notifications.ts
    - Implement getNotifications function
    - Implement getUnreadCount function
    - Implement markAsRead function
    - Implement markAllAsRead function
    - Add error handling
    - _Requirements: 1.1, 3.1, 3.2, 4.1_
  
  - [x] 9.2 Create prescription API client in OdontoHub-1/src/api/prescriptions.ts
    - Implement getPrescriptions function
    - Implement addPrescription function
    - Implement updatePrescription function
    - Implement deletePrescription function
    - Add error handling
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [x] 9.3 Create allergy API client in OdontoHub-1/src/api/allergies.ts
    - Implement getAllergies function
    - Implement addAllergy function
    - Implement updateAllergy function
    - Implement deleteAllergy function
    - Add error handling
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 10. Implement notification UI components
  - [x] 10.1 Update Notifications page in OdontoHub-1/src/Pages/Notifications.tsx
    - Replace mock data with API call to fetch real notifications
    - Implement notification list rendering with proper types
    - Add click handler to mark notifications as read
    - Display notification metadata based on type
    - Add loading and error states
    - Implement multilingual support using i18n
    - _Requirements: 1.1, 1.3, 1.4, 3.1, 3.4, 5.3_
  
  - [x] 10.2 Create NotificationBadge component in OdontoHub-1/src/components/Shared/NotificationBadge.tsx
    - Display unread notification count
    - Fetch count from API on mount
    - Update count when notifications are marked as read
    - Hide badge when count is zero
    - Add click handler to navigate to notifications page
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [x] 10.3 Integrate NotificationBadge into navigation/header
    - Add NotificationBadge to appropriate layout component
    - Position badge according to design
    - _Requirements: 4.1_
  
  - [ ]* 10.4 Write unit tests for notification components
    - Test Notifications page renders notification list
    - Test clicking notification marks it as read
    - Test NotificationBadge displays correct count
    - Test badge updates when count changes
    - _Requirements: 1.1, 3.1, 4.1_

- [ ] 11. Implement prescription UI components
  - [x] 11.1 Create PrescriptionSection component in OdontoHub-1/src/components/Patients/PrescriptionSection.tsx
    - Display list of prescriptions for patient
    - Show all prescription fields (medication, dosage, frequency, duration, date)
    - Add "Add Prescription" button
    - Add edit and delete buttons for each prescription
    - Display empty state when no prescriptions exist
    - Add loading and error states
    - _Requirements: 6.1, 6.5, 8.3_
  
  - [x] 11.2 Create AddPrescriptionModal component in OdontoHub-1/src/components/Patients/AddPrescriptionModal.tsx
    - Create form with fields: medication_name, dosage, frequency, duration, notes
    - Add form validation (required fields)
    - Implement submit handler to call API
    - Add success and error handling
    - Support multilingual labels
    - _Requirements: 6.2_
  
  - [x] 11.3 Create EditPrescriptionModal component in OdontoHub-1/src/components/Patients/EditPrescriptionModal.tsx
    - Pre-fill form with existing prescription data
    - Implement update handler to call API
    - Add success and error handling
    - _Requirements: 6.3_
  
  - [ ]* 11.4 Write unit tests for prescription components
    - Test PrescriptionSection renders prescription list
    - Test add prescription modal creates new prescription
    - Test edit prescription modal updates prescription
    - Test delete button removes prescription
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 12. Implement allergy UI components
  - [x] 12.1 Create AllergySection component in OdontoHub-1/src/components/Patients/AllergySection.tsx
    - Display list of allergies for patient with prominent styling
    - Show all allergy fields (allergen, reaction, severity, date)
    - Add "Add Allergy" button
    - Add edit and delete buttons for each allergy
    - Display empty state when no allergies exist
    - Add loading and error states
    - Use color coding for severity levels (mild=yellow, moderate=orange, severe=red)
    - _Requirements: 7.1, 7.5, 8.4_
  
  - [x] 12.2 Create AddAllergyModal component in OdontoHub-1/src/components/Patients/AddAllergyModal.tsx
    - Create form with fields: allergen_name, reaction_type, severity, notes
    - Add dropdown for severity selection
    - Add form validation (required fields)
    - Implement submit handler to call API
    - Add success and error handling
    - Support multilingual labels
    - _Requirements: 7.2_
  
  - [x] 12.3 Create EditAllergyModal component in OdontoHub-1/src/components/Patients/EditAllergyModal.tsx
    - Pre-fill form with existing allergy data
    - Implement update handler to call API
    - Add success and error handling
    - _Requirements: 7.3_
  
  - [ ]* 12.4 Write unit tests for allergy components
    - Test AllergySection renders allergy list
    - Test add allergy modal creates new allergy
    - Test edit allergy modal updates allergy
    - Test delete button removes allergy
    - Test severity color coding
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 13. Integrate prescription and allergy sections into patient profile
  - [x] 13.1 Update patient profile page to include prescription and allergy sections
    - Add PrescriptionSection component to patient data tab
    - Add AllergySection component to patient data tab
    - Ensure sections are clearly separated and labeled
    - Fetch patient prescriptions and allergies on page load
    - Handle loading states for both sections
    - _Requirements: 8.1, 8.2, 8.5_
  
  - [ ] 13.2 Update patient profile layout for better organization
    - Create tabs or sections for different patient data categories
    - Ensure prescriptions and allergies are easily accessible
    - Maintain responsive design
    - _Requirements: 8.1, 8.2_

- [-] 14. Implement notification generation service (optional background service)
  - [x] 14.1 Create notification service in Backend/app/services/notification_service.py
    - Implement create_notification helper function
    - Implement notification creation for each type with proper metadata
    - Add functions: create_appointment_reminder, create_reschedule_notification, create_cancellation_notification, etc.
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9_
  
  - [ ] 14.2 Integrate notification creation into existing appointment endpoints
    - Add notification creation when appointments are rescheduled
    - Add notification creation when appointments are cancelled
    - Add notification creation when appointments are rated
    - Update Backend/app/routers/appointments.py
    - _Requirements: 2.2, 2.3, 2.7, 2.8_
  
  - [ ]* 14.3 Write unit tests for notification service
    - Test each notification creation function
    - Test metadata is correctly formatted for each type
    - Test cancellation reason defaults to "причины нет"
    - _Requirements: 2.2, 2.3, 2.7, 2.8_

- [ ] 15. Add multilingual support for notifications
  - [ ] 15.1 Add notification translations to translation files
    - Update OdontoHub-1/src/translations/ru.json
    - Update OdontoHub-1/src/translations/uz.json
    - Update OdontoHub-1/src/translations/en.json
    - Update OdontoHub-1/src/translations/kz.json
    - Add translations for notification titles and common messages
    - _Requirements: 5.1, 5.3_
  
  - [ ] 15.2 Implement notification message formatting with i18n
    - Update Notifications page to use translation keys
    - Format notification messages based on type and metadata
    - Ensure dates and times are formatted according to locale
    - _Requirements: 5.1, 5.3_

- [ ] 16. Checkpoint - Full feature integration complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 17. Write property-based tests for API error handling
  - [ ]* 17.1 Write property test for authentication requirement
    - **Property 14: Authentication requirement**
    - **Validates: Requirements 10.6**
  
  - [ ]* 17.2 Write property test for error response format
    - **Property 15: Error response format**
    - **Validates: Requirements 10.7**

- [ ]* 18. Write integration tests
  - [ ]* 18.1 Write integration test for complete notification flow
    - Test: create notification → retrieve → mark read → verify count
    - _Requirements: 1.1, 3.1, 3.2, 4.1_
  
  - [ ]* 18.2 Write integration test for complete prescription flow
    - Test: create prescription → update → delete → verify removal
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ]* 18.3 Write integration test for complete allergy flow
    - Test: create allergy → update → delete → verify removal
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 19. Final testing and polish
  - [ ] 19.1 Manual testing of all features
    - Test notification display and read/unread functionality
    - Test prescription CRUD operations
    - Test allergy CRUD operations
    - Test multilingual support
    - Test error handling and edge cases
    - _Requirements: All_
  
  - [ ] 19.2 Code review and cleanup
    - Review all new code for consistency with existing codebase
    - Remove console.logs and debug code
    - Ensure proper error handling throughout
    - Verify all TypeScript types are correct
    - _Requirements: All_
  
  - [ ] 19.3 Update API documentation
    - Document all new endpoints in API documentation
    - Include request/response examples
    - Document error codes and messages
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at major milestones
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end flows
- The implementation follows existing codebase patterns for consistency
- Database migrations should be tested on a development database before production
- All API endpoints require authentication and appropriate authorization
- Frontend components should follow the existing TailwindCSS design system
