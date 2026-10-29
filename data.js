/* =========================================================
   MediCare+ Demo Data
   Central source of truth for demo doctors, appointments,
   notifications, records and prescriptions. Frontend only —
   nothing here talks to a real backend.
   ========================================================= */

const SPECIALIZATIONS = [
  { name: "Cardiology", icon: "fa-heart-pulse", count: 42 },
  { name: "Dermatology", icon: "fa-hand-dots", count: 31 },
  { name: "Neurology", icon: "fa-brain", count: 27 },
  { name: "Orthopedics", icon: "fa-bone", count: 38 },
  { name: "Pediatrics", icon: "fa-child-reaching", count: 45 },
  { name: "Dentistry", icon: "fa-tooth", count: 29 },
  { name: "Gynecology", icon: "fa-venus", count: 24 },
  { name: "General Medicine", icon: "fa-stethoscope", count: 58 }
];

const DOCTORS = [
  { id: "D101", name: "Dr. Ananya Sharma", gender: "Female", specialization: "Cardiology", qualification: "MD, DM Cardiology", experience: 14, hospital: "Sunrise Heart Institute", location: "Dehradun", rating: 4.9, reviews: 214, fee: 900, available: true, languages: ["English", "Hindi"], img: "https://randomuser.me/api/portraits/women/68.jpg",
    about: "Dr. Sharma specializes in interventional cardiology and preventive heart care, with a focus on early detection of coronary artery disease.",
    education: ["MBBS — AIIMS New Delhi, 2006", "MD Internal Medicine — PGI Chandigarh, 2010", "DM Cardiology — AIIMS New Delhi, 2013"],
    services: ["ECG & Echocardiography", "Angioplasty", "Cardiac Rehabilitation", "Hypertension Management"],
    days: ["Mon","Tue","Wed","Fri","Sat"] },
  { id: "D102", name: "Dr. Rohan Verma", gender: "Male", specialization: "Dermatology", qualification: "MD Dermatology", experience: 9, hospital: "Clearskin Clinic", location: "Dehradun", rating: 4.7, reviews: 158, fee: 700, available: true, languages: ["English", "Hindi"], img: "https://randomuser.me/api/portraits/men/32.jpg",
    about: "Dr. Verma treats acne, pigmentation and hair-related concerns using evidence-based dermatology and minimally invasive procedures.",
    education: ["MBBS — Grant Medical College, 2012", "MD Dermatology — KEM Hospital, 2016"],
    services: ["Acne Treatment", "Laser Therapy", "Skin Allergy Testing", "Cosmetic Dermatology"],
    days: ["Mon","Wed","Thu","Sat"] },
  { id: "D103", name: "Dr. Meera Nair", gender: "Female", specialization: "Neurology", qualification: "DM Neurology", experience: 17, hospital: "NeuroCare Hospital", location: "Rishikesh", rating: 4.8, reviews: 261, fee: 1100, available: false, languages: ["English", "Malayalam", "Hindi"], img: "https://randomuser.me/api/portraits/women/44.jpg",
    about: "Dr. Nair is a senior neurologist with expertise in stroke management, epilepsy and chronic migraine treatment.",
    education: ["MBBS — CMC Vellore, 2003", "MD Medicine — CMC Vellore, 2007", "DM Neurology — NIMHANS Bangalore, 2011"],
    services: ["EEG", "Stroke Management", "Migraine Clinic", "Epilepsy Care"],
    days: ["Tue","Wed","Thu"] },
  { id: "D104", name: "Dr. Karan Malhotra", gender: "Male", specialization: "Orthopedics", qualification: "MS Orthopedics", experience: 12, hospital: "Bonecare Ortho Center", location: "Dehradun", rating: 4.6, reviews: 189, fee: 800, available: true, languages: ["English", "Hindi", "Punjabi"], img: "https://randomuser.me/api/portraits/men/54.jpg",
    about: "Dr. Malhotra focuses on sports injuries, joint replacement and spine care with a conservative-first treatment philosophy.",
    education: ["MBBS — MAMC Delhi, 2008", "MS Orthopedics — Safdarjung Hospital, 2012"],
    services: ["Joint Replacement", "Arthroscopy", "Fracture Care", "Physiotherapy Referral"],
    days: ["Mon","Tue","Thu","Fri","Sat"] },
  { id: "D105", name: "Dr. Priya Iyer", gender: "Female", specialization: "Pediatrics", qualification: "MD Pediatrics", experience: 10, hospital: "Little Stars Children's Hospital", location: "Haridwar", rating: 4.9, reviews: 302, fee: 600, available: true, languages: ["English", "Hindi", "Tamil"], img: "https://randomuser.me/api/portraits/women/65.jpg",
    about: "Dr. Iyer provides comprehensive newborn to adolescent care, including vaccination planning and growth monitoring.",
    education: ["MBBS — Madras Medical College, 2011", "MD Pediatrics — JIPMER, 2015"],
    services: ["Vaccination", "Growth Monitoring", "Newborn Care", "Nutrition Counselling"],
    days: ["Mon","Tue","Wed","Thu","Fri"] },
  { id: "D106", name: "Dr. Arjun Kapoor", gender: "Male", specialization: "Dentistry", qualification: "MDS Prosthodontics", experience: 8, hospital: "Smile Studio Dental", location: "Dehradun", rating: 4.5, reviews: 143, fee: 500, available: true, languages: ["English", "Hindi"], img: "https://randomuser.me/api/portraits/men/76.jpg",
    about: "Dr. Kapoor specializes in cosmetic dentistry, dental implants and full-mouth rehabilitation.",
    education: ["BDS — Manipal College of Dental Sciences, 2013", "MDS Prosthodontics — Manipal, 2016"],
    services: ["Dental Implants", "Root Canal", "Teeth Whitening", "Braces & Aligners"],
    days: ["Wed","Thu","Fri","Sat"] },
  { id: "D107", name: "Dr. Sneha Reddy", gender: "Female", specialization: "Gynecology", qualification: "MS Obstetrics & Gynecology", experience: 15, hospital: "Motherhood Women's Hospital", location: "Rishikesh", rating: 4.8, reviews: 276, fee: 850, available: true, languages: ["English", "Hindi", "Telugu"], img: "https://randomuser.me/api/portraits/women/50.jpg",
    about: "Dr. Reddy offers complete women's health services from adolescent gynecology to high-risk pregnancy management.",
    education: ["MBBS — Osmania Medical College, 2005", "MS Obstetrics & Gynecology — NIMS Hyderabad, 2009"],
    services: ["Prenatal Care", "High-Risk Pregnancy", "PCOS Management", "Laparoscopic Surgery"],
    days: ["Mon","Tue","Wed","Fri"] },
  { id: "D108", name: "Dr. Vikram Singh", gender: "Male", specialization: "General Medicine", qualification: "MD General Medicine", experience: 11, hospital: "CityCare General Hospital", location: "Dehradun", rating: 4.6, reviews: 198, fee: 500, available: true, languages: ["English", "Hindi"], img: "https://randomuser.me/api/portraits/men/22.jpg",
    about: "Dr. Singh is a trusted general physician managing chronic conditions like diabetes, thyroid and hypertension.",
    education: ["MBBS — HIMS Dehradun, 2009", "MD General Medicine — HIMS Dehradun, 2013"],
    services: ["Diabetes Management", "Thyroid Care", "Fever & Infection", "Annual Health Checkup"],
    days: ["Mon","Tue","Wed","Thu","Fri","Sat"] },
  { id: "D109", name: "Dr. Ishaan Bhatt", gender: "Male", specialization: "Cardiology", qualification: "DM Cardiology", experience: 7, hospital: "Sunrise Heart Institute", location: "Haridwar", rating: 4.4, reviews: 96, fee: 750, available: false, languages: ["English", "Hindi", "Gujarati"], img: "https://randomuser.me/api/portraits/men/41.jpg",
    about: "Dr. Bhatt is a young cardiologist focused on preventive cardiology and lifestyle-based risk reduction.",
    education: ["MBBS — BJ Medical College, 2014", "DM Cardiology — SMS Medical College, 2019"],
    services: ["Preventive Cardiology", "Lipid Clinic", "Cardiac Screening"],
    days: ["Tue","Thu","Sat"] },
  { id: "D110", name: "Dr. Kavita Joshi", gender: "Female", specialization: "Dermatology", qualification: "MD Dermatology", experience: 13, hospital: "Clearskin Clinic", location: "Dehradun", rating: 4.7, reviews: 172, fee: 650, available: true, languages: ["English", "Hindi"], img: "https://randomuser.me/api/portraits/women/23.jpg",
    about: "Dr. Joshi has a special interest in pediatric dermatology and chronic skin conditions like eczema and psoriasis.",
    education: ["MBBS — GMC Nagpur, 2007", "MD Dermatology — GMC Nagpur, 2011"],
    services: ["Eczema & Psoriasis Care", "Pediatric Dermatology", "Patch Testing"],
    days: ["Mon","Tue","Fri","Sat"] },
  { id: "D111", name: "Dr. Devansh Rao", gender: "Male", specialization: "Neurology", qualification: "DM Neurology", experience: 6, hospital: "NeuroCare Hospital", location: "Dehradun", rating: 4.3, reviews: 74, fee: 900, available: true, languages: ["English", "Hindi"], img: "https://randomuser.me/api/portraits/men/85.jpg",
    about: "Dr. Rao manages headache disorders, sleep issues and peripheral neuropathy with a patient-centred approach.",
    education: ["MBBS — MGIMS Wardha, 2015", "DM Neurology — AIIMS Rishikesh, 2020"],
    services: ["Headache Clinic", "Sleep Disorders", "Nerve Conduction Studies"],
    days: ["Wed","Thu","Fri"] },
  { id: "D112", name: "Dr. Neha Chauhan", gender: "Female", specialization: "Orthopedics", qualification: "MS Orthopedics", experience: 5, hospital: "Bonecare Ortho Center", location: "Rishikesh", rating: 4.2, reviews: 58, fee: 550, available: true, languages: ["English", "Hindi"], img: "https://randomuser.me/api/portraits/women/12.jpg",
    about: "Dr. Chauhan treats sports injuries and post-surgical rehabilitation with a focus on faster, safer recovery.",
    education: ["MBBS — Government Doon Medical College, 2016", "MS Orthopedics — HIMS Dehradun, 2020"],
    services: ["Sports Injury", "Rehabilitation", "Minor Fracture Care"],
    days: ["Mon","Wed","Sat"] }
];

const TIME_SLOTS = ["09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","02:00 PM","02:30 PM","04:00 PM","04:30 PM","05:00 PM","05:30 PM"];

const TESTIMONIALS = [
  { name: "Rahul Mehta", role: "Patient, Dehradun", quote: "Booking an appointment took less than two minutes. The reminders meant I never missed a follow-up visit.", img: "https://randomuser.me/api/portraits/men/11.jpg" },
  { name: "Sunita Rawat", role: "Patient, Rishikesh", quote: "I could compare doctors by fee and rating before choosing. My daughter's pediatrician turned out to be excellent.", img: "https://randomuser.me/api/portraits/women/33.jpg" },
  { name: "Aman Thapa", role: "Patient, Haridwar", quote: "The video consultation option saved me a two-hour drive for a routine dermatology check-up.", img: "https://randomuser.me/api/portraits/men/62.jpg" }
];

const NOTIFICATIONS_SEED = [
  { id: "N1", type: "confirmed", title: "Appointment confirmed", message: "Your appointment with Dr. Ananya Sharma on 26 Sep, 10:00 AM is confirmed.", time: "2 hours ago", read: false },
  { id: "N2", type: "reminder", title: "Appointment reminder", message: "Your video consultation with Dr. Priya Iyer starts tomorrow at 11:30 AM.", time: "5 hours ago", read: false },
  { id: "N3", type: "prescription", title: "Prescription uploaded", message: "Dr. Rohan Verma has uploaded a new prescription for your visit on 18 Sep.", time: "1 day ago", read: false },
  { id: "N4", type: "cancelled", title: "Appointment cancelled", message: "Your appointment with Dr. Ishaan Bhatt on 14 Sep was cancelled by the clinic.", time: "3 days ago", read: true },
  { id: "N5", type: "available", title: "Doctor now available", message: "Dr. Meera Nair has opened new slots for this Friday.", time: "4 days ago", read: true },
  { id: "N6", type: "confirmed", title: "Appointment confirmed", message: "Your appointment with Dr. Vikram Singh on 10 Sep, 09:30 AM is confirmed.", time: "1 week ago", read: true }
];

const APPOINTMENTS_SEED = [
  { id: "APT-48213", doctorId: "D101", date: "2026-09-26", time: "10:00 AM", type: "In-person", status: "upcoming", reason: "Routine heart checkup" },
  { id: "APT-48190", doctorId: "D105", date: "2026-09-27", time: "11:30 AM", type: "Video", status: "upcoming", reason: "Child vaccination follow-up" },
  { id: "APT-47932", doctorId: "D102", date: "2026-09-18", time: "03:00 PM", type: "In-person", status: "completed", reason: "Acne consultation" },
  { id: "APT-47810", doctorId: "D108", date: "2026-09-10", time: "09:30 AM", type: "In-person", status: "completed", reason: "Diabetes review" },
  { id: "APT-47655", doctorId: "D109", date: "2026-09-14", time: "04:00 PM", type: "Video", status: "cancelled", reason: "Preventive screening" }
];

const RECORDS_SEED = [
  { id: "R1", name: "Blood Test Report — CBC", type: "Lab Report", date: "18 Sep 2026", doctor: "Dr. Rohan Verma" },
  { id: "R2", name: "ECG Report", type: "Diagnostic", date: "10 Sep 2026", doctor: "Dr. Ananya Sharma" },
  { id: "R3", name: "Diagnosis Summary — Diabetes Review", type: "Doctor Notes", date: "10 Sep 2026", doctor: "Dr. Vikram Singh" },
  { id: "R4", name: "X-Ray — Left Knee", type: "Diagnostic", date: "02 Sep 2026", doctor: "Dr. Karan Malhotra" },
  { id: "R5", name: "Lipid Profile Report", type: "Lab Report", date: "25 Aug 2026", doctor: "Dr. Ishaan Bhatt" }
];

const PRESCRIPTIONS_SEED = [
  { id: "RX-3312", doctorId: "D102", date: "18 Sep 2026", diagnosis: "Mild acne with post-inflammatory pigmentation",
    medicines: [
      { name: "Adapalene Gel 0.1%", dosage: "Apply at night", duration: "6 weeks" },
      { name: "Doxycycline 100mg", dosage: "1 tablet twice daily", duration: "10 days" }
    ], instructions: "Avoid direct sun exposure. Use sunscreen SPF 30+ daily." },
  { id: "RX-3260", doctorId: "D108", date: "10 Sep 2026", diagnosis: "Type 2 Diabetes — routine review",
    medicines: [
      { name: "Metformin 500mg", dosage: "1 tablet twice daily", duration: "30 days" },
      { name: "Vitamin D3 60000 IU", dosage: "1 sachet weekly", duration: "8 weeks" }
    ], instructions: "Maintain low-carb diet. Repeat HbA1c after 3 months." },
  { id: "RX-3121", doctorId: "D101", date: "25 Aug 2026", diagnosis: "Borderline high cholesterol",
    medicines: [
      { name: "Atorvastatin 10mg", dosage: "1 tablet at night", duration: "90 days" }
    ], instructions: "Follow up with lipid profile after 3 months. Reduce saturated fat intake." }
];

/* --- Helpers shared across pages --- */
function getDoctorById(id){ return DOCTORS.find(d => d.id === id); }

function initialsAvatar(name){
  const initials = name.replace("Dr.","").trim().split(" ").map(w=>w[0]).slice(0,2).join("");
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=0F5C55&color=fff&rounded=true`;
}
