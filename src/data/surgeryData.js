// src/data/surgeryData.js
export const surgeryCategories = [
    "All Surgeries",
    "Orthopedic",
    "Cardiac",
    "Neurosurgery",
    "Gastrointestinal",
    "Cosmetic",
    "Ophthalmology",
    "ENT",
    "Dental",
    "Gynecology",
    "Urology"
  ];
  
  export const surgeries = [
{
    id: 1,
    name: "Total Knee Replacement",
    category: "Orthopedic",
    description: "A surgical procedure to replace the weight-bearing surfaces of the knee joint to relieve pain and disability.",
    estimatedCost: 350000,
    recoveryTime: "4-6 weeks",
    hospitalStay: "3-5 days",
    complexity: "High",
    risks: [
      "Infection",
      "Blood clots",
      "Nerve damage",
      "Limited range of motion"
    ],
    successRate: 90,
    preRequisites: [
      "Complete medical evaluation",
      "Blood tests",
      "X-rays and MRI",
      "Physician clearance"
    ],
    
    image: "https://eremedium.in/wp-content/uploads/2024/04/Total-Knee-Replacement.jpg",
    popularHospitals: [
      "Apollo Hospitals",
      "Fortis Healthcare",
      "Max Super Speciality Hospital"
    ]
  },
    {
      id: 2,
      name: "LASIK Eye Surgery",
      category: "Ophthalmology",
      description: "A type of refractive surgery for correcting myopia, hyperopia, and astigmatism.",
      estimatedCost: 80000,
      recoveryTime: "24-48 hours",
      hospitalStay: "Outpatient",
      complexity: "Low",
      risks: [
        "Dry eyes",
        "Glare",
        "Halos",
        "Under or over correction"
      ],
      successRate: 96,
      preRequisites: [
        "Eye examination",
        "Corneal topography",
        "Tear film evaluation",
        "No contact lenses for 2 weeks prior"
      ],
      image: "https://img.freepik.com/free-photo/doctor-examining-patient-eye-with-specialized-equipment-ophtalmology-clinic_1170-2150.jpg",
      popularHospitals: [
        "Centre for Sight",
        "Eye-Q Super Speciality Eye Hospitals",
        "Vasan Eye Care"
      ]
    },
    {
      id: 3,
      name: "Coronary Artery Bypass Grafting (CABG)",
      category: "Cardiac",
      description: "A surgical procedure to restore normal blood flow to an obstructed coronary artery.",
      estimatedCost: 450000,
      recoveryTime: "6-12 weeks",
      hospitalStay: "7-10 days",
      complexity: "Very High",
      risks: [
        "Bleeding",
        "Heart attack",
        "Stroke",
        "Kidney failure",
        "Infection"
      ],
      successRate: 95,
      preRequisites: [
        "Cardiac catheterization",
        "Complete blood work",
        "ECG",
        "Chest X-ray",
        "Cardiac stress test"
      ],
      image: "https://img.freepik.com/free-photo/3d-medical-background-with-heart-ecg-design_1048-7077.jpg",
      popularHospitals: [
        "Medanta - The Medicity",
        "Narayana Health",
        "Asian Heart Institute"
      ]
    },
    {
      id: 4,
      name: "Laparoscopic Cholecystectomy",
      category: "Gastrointestinal",
      description: "Minimally invasive surgery to remove the gallbladder using small incisions and a camera.",
      estimatedCost: 120000,
      recoveryTime: "1-2 weeks",
      hospitalStay: "Same day or overnight",
      complexity: "Moderate",
      risks: [
        "Bile leak",
        "Infection",
        "Bleeding",
        "Injury to surrounding structures"
      ],
      successRate: 98,
      preRequisites: [
        "Ultrasound of abdomen",
        "Blood tests",
        "Stop certain medications"
      ],
      image: "https://img.freepik.com/free-photo/medical-banner-with-doctor-holding-stethoscope_23-2149611240.jpg",
      popularHospitals: [
        "Indraprastha Apollo Hospitals",
        "Lilavati Hospital",
        "Sir Ganga Ram Hospital"
      ]
    },
    {
      id: 5,
      name: "Rhinoplasty",
      category: "Cosmetic",
      description: "Surgical procedure to reshape the nose for aesthetic or functional purposes.",
      estimatedCost: 150000,
      recoveryTime: "2-3 weeks",
      hospitalStay: "Outpatient",
      complexity: "Moderate",
      risks: [
        "Asymmetry",
        "Difficulty breathing",
        "Scarring",
        "Numbness"
      ],
      successRate: 85,
      preRequisites: [
        "Physical examination",
        "Facial analysis",
        "Photography",
        "Stop smoking 2 weeks before"
      ],
      image: "https://img.freepik.com/free-photo/close-up-woman-with-perfect-skin-beauty-face_186202-4355.jpg",
      popularHospitals: [
        "Fortis Memorial Research Institute",
        "Manipal Hospitals",
        "BLK Super Speciality Hospital"
      ]
    },
    {
      id: 6,
      name: "Spinal Fusion",
      category: "Neurosurgery",
      description: "Surgery to join two or more vertebrae into a single structure to prevent movement between them.",
      estimatedCost: 380000,
      recoveryTime: "3-6 months",
      hospitalStay: "3-7 days",
      complexity: "High",
      risks: [
        "Failed fusion",
        "Nerve damage",
        "Blood clots",
        "Hardware fracture"
      ],
      successRate: 80,
      preRequisites: [
        "MRI",
        "CT scan",
        "Physical examination",
        "Nerve tests"
      ],
      image: "https://img.freepik.com/free-photo/3d-medical-image-showing-spine-technology-design_1048-7063.jpg",
      popularHospitals: [
        "AIIMS",
        "Kokilaben Dhirubhai Ambani Hospital",
        "Artemis Hospital"
      ]
    },
    {
      id: 7,
      name: "Cochlear Implant Surgery",
      category: "ENT",
      description: "Procedure to provide sound perception for those with severe hearing loss by implanting an electronic device.",
      estimatedCost: 700000,
      recoveryTime: "4-6 weeks",
      hospitalStay: "1-2 days",
      complexity: "High",
      risks: [
        "Infection",
        "Device failure",
        "Meningitis",
        "Facial nerve damage"
      ],
      successRate: 95,
      preRequisites: [
        "Audiological evaluation",
        "Ear examination",
        "CT or MRI scan",
        "Psychological assessment"
      ],
      image: "https://img.freepik.com/free-photo/young-female-doctor-examining-patient-with-otoscope_176474-9118.jpg",
      popularHospitals: [
        "Apollo Hospitals",
        "Max Healthcare",
        "Manipal Hospitals"
      ]
    },
    {
      id: 8,
      name: "Hysterectomy",
      category: "Gynecology",
      description: "Surgical removal of the uterus, possibly along with the fallopian tubes and ovaries.",
      estimatedCost: 180000,
      recoveryTime: "4-6 weeks",
      hospitalStay: "1-3 days",
      complexity: "Moderate",
      risks: [
        "Bleeding",
        "Infection",
        "Urinary issues",
        "Early menopause (if ovaries removed)"
      ],
      successRate: 95,
      preRequisites: [
        "Pelvic examination",
        "Pap test",
        "Endometrial biopsy",
        "Ultrasound"
      ],
      image: "https://img.freepik.com/free-photo/gynecologist-diagnosing-patient-with-sonography_23-2149143003.jpg",
      popularHospitals: [
        "Fortis La Femme",
        "Cloud Nine Hospital",
        "CK Birla Hospital for Women"
      ]
    }
  ];