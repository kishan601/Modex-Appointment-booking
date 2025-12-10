// src/data/softwareData.js
export const softwareCategories = [
    "All Software",
    "Electronic Health Records (EHR)",
    "Practice Management",
    "Telemedicine",
    "Medical Billing",
    "Patient Portal",
    "Medical Imaging",
    "Clinical Decision Support",
    "Healthcare Analytics",
    "Inventory Management",
    "Healthcare CRM"
  ];
  
  export const softwareProducts = [
    {
      id: 1,
      name: "MediChart Pro",
      category: "Electronic Health Records (EHR)",
      description: "Comprehensive EHR solution designed for hospitals and large medical practices with integrated patient records, medication management, and clinical documentation.",
      price: "₹40,000/month",
      pricing: "Subscription",
      features: [
        "Secure patient records",
        "E-prescribing",
        "Lab integration",
        "Clinical documentation",
        "HIPAA compliant",
        "Custom templates",
        "Mobile access"
      ],
      deployment: "Cloud & On-premise",
      bestFor: "Hospitals and Large Practices",
      image: "https://img.freepik.com/free-vector/hospital-management-system-abstract-concept_335657-3012.jpg",
      mobileSupport: true,
      trainingIncluded: true,
      freeTrial: "30 days"
    },
    {
      id: 2,
      name: "PracticeFusion",
      category: "Practice Management",
      description: "All-in-one practice management system that streamlines scheduling, billing, and patient management for small to mid-sized medical practices.",
      price: "₹15,000/month",
      pricing: "Subscription",
      features: [
        "Appointment scheduling",
        "Patient registration",
        "Insurance verification",
        "Claims management",
        "Billing and invoicing",
        "Reporting and analytics",
        "Patient reminders"
      ],
      deployment: "Cloud",
      bestFor: "Small to Mid-sized Practices",
      image: "https://img.freepik.com/free-vector/medical-management-abstract-concept-illustration-patient-database-digital-medical-records-practice-administrative-assessment-management-healthcare-system_335657-824.jpg",
      mobileSupport: true,
      trainingIncluded: true,
      freeTrial: "14 days"
    },
    {
      id: 3,
      name: "TeleMed Connect",
      category: "Telemedicine",
      description: "HIPAA-compliant telemedicine platform enabling healthcare providers to conduct virtual consultations, remote monitoring, and secure messaging with patients.",
      price: "₹25,000/month",
      pricing: "Subscription",
      features: [
        "HD video consultations",
        "Screen sharing",
        "Digital waiting room",
        "Instant messaging",
        "E-prescriptions",
        "Patient history access",
        "Appointment scheduling"
      ],
      deployment: "Cloud",
      bestFor: "All Healthcare Providers",
      image: "https://img.freepik.com/free-photo/telemedicine-doctor-using-tablet-computer_23-2149328691.jpg",
      mobileSupport: true,
      trainingIncluded: true,
      freeTrial: "7 days"
    },
    {
      id: 4,
      name: "BillRight",
      category: "Medical Billing",
      description: "Advanced medical billing software that automates claims processing, payment tracking, and revenue cycle management to maximize reimbursements.",
      price: "₹20,000/month",
      pricing: "Subscription + Transaction Fee",
      features: [
        "Claims processing",
        "Payment tracking",
        "Insurance verification",
        "Denial management",
        "Automated billing",
        "Financial reporting",
        "Compliance tools"
      ],
      deployment: "Cloud",
      bestFor: "Billing Departments",
      image: "https://img.freepik.com/free-vector/financial-transaction-online-mobile-banking-technology-internet-payment-system-businessman-using-smartphone-paying-bills-analyzing-budget-expenditure-vector-isolated-concept-metaphor-illustration_335657-965.jpg",
      mobileSupport: true,
      trainingIncluded: true,
      freeTrial: "14 days"
    },
    {
      id: 5,
      name: "PatientPortal Plus",
      category: "Patient Portal",
      description: "Secure online patient portal that allows patients to schedule appointments, access medical records, request prescription refills, and communicate with healthcare providers.",
      price: "₹10,000/month",
      pricing: "Subscription",
      features: [
        "Online appointment booking",
        "Medical record access",
        "Secure messaging",
        "Prescription refill requests",
        "Lab results",
        "Payment processing",
        "Educational resources"
      ],
      deployment: "Cloud",
      bestFor: "All Healthcare Providers",
      image: "https://img.freepik.com/free-vector/time-management-abstract-concept-vector-illustration-office-workflow-efficiency-project-management-goal-achievement-time-control-deadline-workplace-business-productivity-abstract-metaphor_335657-2203.jpg",
      mobileSupport: true,
      trainingIncluded: true,
      freeTrial: "30 days"
    },
    {
      id: 6,
      name: "ImageDiagnostics",
      category: "Medical Imaging",
      description: "Advanced medical imaging software with powerful visualization tools, AI-assisted diagnosis, and secure storage for radiologists and imaging centers.",
      price: "₹50,000/month",
      pricing: "Subscription",
      features: [
        "3D visualization",
        "AI diagnostic assistance",
        "PACS integration",
        "Multi-modality support",
        "Advanced measurements",
        "Report generation",
        "Cloud storage"
      ],
      deployment: "Cloud & On-premise",
      bestFor: "Radiology Departments",
      image: "https://img.freepik.com/free-photo/doctor-scanning-brain-with-mri-medical-imaging-futuristic_117023-83.jpg",
      mobileSupport: false,
      trainingIncluded: true,
      freeTrial: "21 days"
    },
    {
      id: 7,
      name: "Clinical Advisor AI",
      category: "Clinical Decision Support",
      description: "AI-powered clinical decision support system that provides evidence-based recommendations, drug interaction alerts, and diagnostic assistance to healthcare providers.",
      price: "₹35,000/month",
      pricing: "Subscription",
      features: [
        "Evidence-based guidelines",
        "Drug interaction alerts",
        "Diagnostic suggestions",
        "Risk assessments",
        "Clinical calculators",
        "Medical literature access",
        "AI-driven insights"
      ],
      deployment: "Cloud",
      bestFor: "Physicians and Clinical Staff",
      image: "https://img.freepik.com/free-photo/ai-nuclear-energy-background-future-innovation-disruptive-technology_53876-129784.jpg",
      mobileSupport: true,
      trainingIncluded: true,
      freeTrial: "14 days"
    },
    {
      id: 8,
      name: "HealthAnalytics Pro",
      category: "Healthcare Analytics",
      description: "Comprehensive healthcare analytics platform that transforms medical data into actionable insights for improving clinical outcomes, operational efficiency, and financial performance.",
      price: "₹45,000/month",
      pricing: "Subscription",
      features: [
        "Clinical outcomes tracking",
        "Financial analytics",
        "Population health management",
        "Custom dashboards",
        "Predictive analytics",
        "Benchmarking",
        "Data visualization"
      ],
      deployment: "Cloud",
      bestFor: "Healthcare Administrators",
      image: "https://img.freepik.com/free-vector/big-data-analytics-abstract-concept-illustration_335657-4817.jpg",
      mobileSupport: true,
      trainingIncluded: true,
      freeTrial: "21 days"
    }
  ];