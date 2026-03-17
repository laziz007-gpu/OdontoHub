export const paths = {
    welcome: '/',          // 👈 MUHIM
    login: '/login',
    registrDoc: "/register_doc",
    registerPat: "/register_pat",
    doctorProfileSetup: "/doctor-profile-setup",
    patient: '/patients',
    patientProfile: '/patients/:id',
    profile: '/profile',
    editProfile: '/profile/edit',
    menu: '/menu',
    settings: '/settings',
    appointments: '/appointments',
    analytics: '/analytics',
    finance: '/analytics/finance',
    chats: '/chats',
    chatDetail: '/chats/:id',
    patientHome: '/home',
    patientCalendar: '/calendar',
    patientHistory: '/history',
    patientProfileSettings: '/profile_pat',
    patientAppointmentDetail: '/appointment/:id',
    patientChats: '/patient/chats',
    patientChatDetail: '/patient/chats/:id',
    doctors: '/doctors',
    specialties: '/specialties',
    notifications: '/notifications',
    booking: '/booking',
    checkupPreview: '/booking/checkup-preview',
    myDentist: '/my-dentist',
    patientChatProfile: '/patient/chats/:id/profile',
    treatments: '/treatments',
<<<<<<< HEAD
    activeAppointment: '/appointments/active/:id'
=======
    doctorServices: '/doctor-services',
    doctorCases: '/doctor-cases',
    videoCall: '/video-call'
>>>>>>> 5a553df4cba3528c9d0f8757cfab166f5ee26e83
} as const;
