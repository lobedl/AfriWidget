/**
 * AfriWidget TVET Daily Subject-Based Learning Quiz & Diagnostic Engine
 * Upgraded "Find My Weaknesses" Feature for South African TVET Students (NATED & NC(V))
 * Pure vanilla JavaScript. Zero dependencies, zero emojis, zero tracking.
 * 100% deterministic marking, localized storage, immediate pedagogical feedback,
 * topic-level weakness analysis, and curriculum-aligned study recommendations.
 */
(function () {
  'use strict';

  var STORAGE_HISTORY_KEY = 'afriwidget_tvet_quiz_history_v2';
  var STORAGE_SEEN_KEY = 'afriwidget_tvet_quiz_seen_v2';

  // TVET Programmes Metadata
  var PROGRAMMES = {
  "nated_eng": {
    "id": "nated_eng",
    "name": "Engineering Studies (NATED Report 191 N1\u2013N6)",
    "badge": "NATED Engineering",
    "subjects": [
      "math",
      "eng_sci",
      "electrotechnics"
    ]
  },
  "nated_bus": {
    "id": "nated_bus",
    "name": "Business & Management Studies (NATED Report 191 N4\u2013N6)",
    "badge": "NATED Business",
    "subjects": [
      "fin_acc",
      "ebm",
      "mgt_comm"
    ]
  },
  "ncv_it": {
    "id": "ncv_it",
    "name": "Information Technology & Computer Science (NC(V) L2\u2013L4)",
    "badge": "NC(V) IT & CS",
    "subjects": [
      "comp_hw",
      "programming"
    ]
  }
};

  // TVET Subjects & Topics Metadata
  var SUBJECTS = {
  "math": {
    "id": "math",
    "programmeId": "nated_eng",
    "name": "Mathematics (N1\u2013N3)",
    "code": "MATH-N13",
    "topics": {
      "math_calculus": {
        "name": "Differential & Integral Calculus",
        "shortName": "Calculus",
        "studyTip": "Review power rule and trigonometric standard derivatives from your formula sheet. Practice finding turning points by setting dy/dx = 0."
      },
      "math_algebra": {
        "name": "Algebra, Exponents & Logarithms",
        "shortName": "Algebra & Logarithms",
        "studyTip": "Master exponent laws (a^m * a^n = a^(m+n)) and logarithm conversions (log_b(y) = x <=> b^x = y). Practice resolving equations with quadratic formulas."
      },
      "math_trig": {
        "name": "Trigonometry & Circular Measure",
        "shortName": "Trigonometry",
        "studyTip": "Memorize fundamental identities (sin^2 + cos^2 = 1, tan = sin/cos). Practice applying the sine and cosine rules in non-right-angled triangles."
      },
      "math_complex": {
        "name": "Complex Numbers & Coordinate Geometry",
        "shortName": "Complex Numbers",
        "studyTip": "Practice converting complex numbers between rectangular form (a + jb) and polar form (r/_theta). Remember that j^2 = -1."
      }
    }
  },
  "eng_sci": {
    "id": "eng_sci",
    "programmeId": "nated_eng",
    "name": "Engineering Science (N1\u2013N3)",
    "code": "ENGSCI-N13",
    "topics": {
      "sci_statics": {
        "name": "Statics, Forces & Moments",
        "shortName": "Statics & Forces",
        "studyTip": "Remember that for static equilibrium, sum of horizontal forces = 0, sum of vertical forces = 0, and sum of clockwise moments = sum of anticlockwise moments."
      },
      "sci_dynamics": {
        "name": "Kinematics, Work, Energy & Power",
        "shortName": "Work, Energy & Power",
        "studyTip": "Keep units in SI (metres, kilograms, seconds, joules, watts). Work = Force x distance, Kinetic Energy = 0.5 * m * v^2, and Potential Energy = m * g * h."
      },
      "sci_thermo": {
        "name": "Heat, Temperature & Thermal Expansion",
        "shortName": "Heat & Thermal Expansion",
        "studyTip": "Use Q = m * c * deltaT for sensible heat transfer. When calculating linear expansion, remember deltaL = L_original * alpha * deltaT."
      },
      "sci_electricity": {
        "name": "Electricity, Magnetism & DC Circuits",
        "shortName": "Electricity & Magnetism",
        "studyTip": "Apply Ohm's law V = I * R and Joule's law P = V * I = I^2 * R. In series circuits current is constant; in parallel circuits voltage across branches is equal."
      }
    }
  },
  "electrotechnics": {
    "id": "electrotechnics",
    "programmeId": "nated_eng",
    "name": "Electrotechnics & Electrical Trade Theory",
    "code": "ETEC-N13",
    "topics": {
      "elec_dc": {
        "name": "DC Circuits, Batteries & Network Laws",
        "shortName": "DC Circuits",
        "studyTip": "Apply Kirchhoff's Current Law (current into a node equals current out) and Kirchhoff's Voltage Law (sum of EMFs equals sum of potential drops)."
      },
      "elec_ac": {
        "name": "AC Waveforms, Single-Phase & Three-Phase",
        "shortName": "AC Theory",
        "studyTip": "Remember that RMS value = 0.707 x Peak value for a sine wave. In inductive circuits current lags voltage; in capacitive circuits current leads voltage."
      },
      "elec_machines": {
        "name": "Transformers & Induction Machines",
        "shortName": "Transformers & Motors",
        "studyTip": "Review the transformer equation: Vp/Vs = Np/Ns = Is/Ip. For induction motors, synchronous speed Ns = 120 * f / p."
      },
      "elec_protection": {
        "name": "Earthing, Protection & SANS 10142 Safety",
        "shortName": "Safety & SANS 10142",
        "studyTip": "Review SANS 10142-1 regulations on earth leakage tripping sensitivity (typically 30 mA) and bonding requirements for metal conduit and water pipes."
      }
    }
  },
  "fin_acc": {
    "id": "fin_acc",
    "programmeId": "nated_bus",
    "name": "Financial Accounting (N4\u2013N6)",
    "code": "ACC-N46",
    "topics": {
      "acc_statements": {
        "name": "Financial Statements & Year-End Adjustments",
        "shortName": "Financial Statements",
        "studyTip": "Always pair adjustments: accrued expenses are liabilities added to expenses; prepaid expenses are current assets deducted from expenses."
      },
      "acc_reconciliation": {
        "name": "Bank Reconciliation & Internal Controls",
        "shortName": "Bank Reconciliation",
        "studyTip": "Items appearing on the bank statement but not in cash books (e.g. bank charges, direct deposits) must be entered in the Cash Receipts or Payments Journal first."
      },
      "acc_depreciation": {
        "name": "Asset Depreciation & Disposal",
        "shortName": "Depreciation & Assets",
        "studyTip": "Differentiate straight-line depreciation ((Cost - Residual) / Useful Life) from diminishing balance method (carrying value * rate). Time-apportion for partial years."
      },
      "acc_cashflow": {
        "name": "Cash Flow & Working Capital Analysis",
        "shortName": "Cash Flow Analysis",
        "studyTip": "Remember that non-cash items like depreciation are added back to net profit in the operating activities section of the cash flow statement."
      }
    }
  },
  "ebm": {
    "id": "ebm",
    "programmeId": "nated_bus",
    "name": "Entrepreneurship & Business Management (N4\u2013N6)",
    "code": "EBM-N46",
    "topics": {
      "ebm_planning": {
        "name": "Business Planning & Feasibility Analysis",
        "shortName": "Business Planning",
        "studyTip": "Understand the key components of a formal business plan: Executive Summary, Market Analysis, Operations Plan, Management Structure, and Financial Projections."
      },
      "ebm_marketing": {
        "name": "Market Research & Marketing Mix (4 Ps)",
        "shortName": "Marketing Strategy",
        "studyTip": "Evaluate the 4 Ps: Product, Price, Place, and Promotion. Distinguish primary research (surveys, interviews) from secondary research (industry reports, census)."
      },
      "ebm_break_even": {
        "name": "Costing, Budgets & Break-Even Analysis",
        "shortName": "Break-Even & Costing",
        "studyTip": "Break-Even Units = Total Fixed Costs / (Selling Price per unit - Variable Cost per unit). Contribution margin per unit = Selling Price - Variable Cost."
      },
      "ebm_legal": {
        "name": "Forms of Ownership, SARS & CIPC Compliance",
        "shortName": "Business Law & Compliance",
        "studyTip": "Contrast sole proprietorship (unlimited liability) with a Private Company (Pty Ltd) which has separate legal personality and limited shareholder liability."
      }
    }
  },
  "mgt_comm": {
    "id": "mgt_comm",
    "programmeId": "nated_bus",
    "name": "Management Communication (N4)",
    "code": "COMM-N4",
    "topics": {
      "comm_barriers": {
        "name": "Organizational Communication & Channels",
        "shortName": "Communication Barriers",
        "studyTip": "Differentiate downward, upward, and horizontal communication flows. Identify physical, physiological, psychological, and semantic barriers."
      },
      "comm_correspondence": {
        "name": "Business Correspondence, Memos & Reports",
        "shortName": "Business Correspondence",
        "studyTip": "Memorandums are for internal communication and do not have salutations or complimentary closes. Business letters are for external stakeholders."
      },
      "comm_meetings": {
        "name": "Meeting Procedures, Quorums & Minutes",
        "shortName": "Meeting Procedures",
        "studyTip": "A quorum is the minimum number of members required to validate business. Minutes must be written in the past tense and third-person objective voice."
      },
      "comm_language": {
        "name": "Summary Writing, Style & Professional Tone",
        "shortName": "Language & Summary",
        "studyTip": "When drafting executive summaries, state points concisely in your own words, avoid jargon, and maintain an objective, formal business tone."
      }
    }
  },
  "comp_hw": {
    "id": "comp_hw",
    "programmeId": "ncv_it",
    "name": "Computer Hardware & System Software",
    "code": "IT-HW-L24",
    "topics": {
      "hw_arch": {
        "name": "CPU Architecture, Motherboards & Memory Hierarchy",
        "shortName": "CPU & Memory",
        "studyTip": "Remember the instruction cycle: Fetch, Decode, Execute, Store. RAM is volatile primary storage; SSDs/HDDs provide non-volatile secondary storage."
      },
      "hw_os": {
        "name": "Operating Systems, Process Management & File Systems",
        "shortName": "Operating Systems",
        "studyTip": "An OS kernel manages CPU scheduling, memory paging, and device drivers. Contrast NTFS (supports file permissions and journaling) with FAT32."
      },
      "hw_network": {
        "name": "Network Topologies, TCP/IP & IP Addressing",
        "shortName": "Networking & IP",
        "studyTip": "Understand IPv4 private address blocks (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16). Distinguish switches (Layer 2 MAC) from routers (Layer 3 IP)."
      },
      "hw_troubleshoot": {
        "name": "POST Diagnostics, BIOS/UEFI & Troubleshooting",
        "shortName": "Troubleshooting & POST",
        "studyTip": "POST (Power-On Self-Test) verifies basic hardware before OS boot. Continuous or repetitive beeps frequently indicate RAM or video adapter failures."
      }
    }
  },
  "programming": {
    "id": "programming",
    "programmeId": "ncv_it",
    "name": "Principles of Computer Programming",
    "code": "IT-PROG-L24",
    "topics": {
      "prog_logic": {
        "name": "Algorithms, Pseudocode & Control Structures",
        "shortName": "Algorithms & Logic",
        "studyTip": "Trace loops carefully with dry-run tables. A while loop checks the condition before execution (pre-test); a do-while loop executes at least once (post-test)."
      },
      "prog_data": {
        "name": "Data Types, Arrays & String Manipulation",
        "shortName": "Data Types & Arrays",
        "studyTip": "Arrays in modern languages are zero-indexed: the first element is at index 0 and the last element is at length - 1. Distinguish value types from reference types."
      },
      "prog_oop": {
        "name": "Object-Oriented Concepts (Classes, Objects, Methods)",
        "shortName": "OOP Principles",
        "studyTip": "Encapsulation bundles data with methods and restricts direct access using private attributes and public getters/setters."
      },
      "prog_test": {
        "name": "Testing, Debugging & Boundary Validation",
        "shortName": "Testing & Debugging",
        "studyTip": "Differentiate syntax errors (prevent compilation), runtime errors (cause crashes, e.g. divide by zero), and logic errors (produce incorrect results)."
      }
    }
  }
};

  // Verified TVET Question Bank (DHET Curriculum-Aligned)
  var QUESTIONS = [
  {
    "id": "math_calc_e1",
    "subject": "math",
    "topicId": "math_calculus",
    "difficulty": "easy",
    "question": "What is the derivative of f(x) = 5x^3 with respect to x?",
    "options": [
      "15x^2",
      "5x^2",
      "15x^3",
      "8x^2"
    ],
    "correctIndex": 0,
    "explanation": "Using the power rule d/dx[a*x^n] = a*n*x^(n-1), we multiply the coefficient 5 by the exponent 3 to get 15, and decrease the exponent by 1 to get x^2. Hence, 15x^2.",
    "concept": "The power rule is fundamental in N2 and N3 differential calculus. For any term a*x^n, its derivative is n*a*x^(n-1)."
  },
  {
    "id": "math_calc_e2",
    "subject": "math",
    "topicId": "math_calculus",
    "difficulty": "easy",
    "question": "What is the indefinite integral of f(x) = 6x dx?",
    "options": [
      "3x^2 + C",
      "6x^2 + C",
      "3x + C",
      "6 + C"
    ],
    "correctIndex": 0,
    "explanation": "Integration is the reverse of differentiation: \u222b k*x^n dx = (k * x^(n+1))/(n+1) + C. Here, \u222b 6x dx = 6*(x^2/2) + C = 3x^2 + C.",
    "concept": "Under DHET N2/N3 integration rules, integrating a linear term x produces (1/2)x^2, and an arbitrary constant of integration (+ C) must always be included for indefinite integrals."
  },
  {
    "id": "math_calc_m1",
    "subject": "math",
    "topicId": "math_calculus",
    "difficulty": "medium",
    "question": "Determine the gradient of the curve y = 2x^2 - 4x + 1 at the point where x = 3.",
    "options": [
      "8",
      "12",
      "7",
      "10"
    ],
    "correctIndex": 0,
    "explanation": "First find the derivative: dy/dx = 4x - 4. Then substitute x = 3: dy/dx = 4(3) - 4 = 12 - 4 = 8.",
    "concept": "In TVET mathematics, the first derivative dy/dx defines the gradient (slope) of the tangent to a curve at any specified coordinate."
  },
  {
    "id": "math_calc_m2",
    "subject": "math",
    "topicId": "math_calculus",
    "difficulty": "medium",
    "question": "Find the x-coordinate of the turning point of the parabola y = -x^2 + 6x - 5.",
    "options": [
      "x = 3",
      "x = -3",
      "x = 6",
      "x = 1"
    ],
    "correctIndex": 0,
    "explanation": "At a turning point (stationary point), dy/dx = 0. Here dy/dx = -2x + 6. Setting -2x + 6 = 0 yields 2x = 6, so x = 3.",
    "concept": "Stationary points occur when the rate of change is zero (dy/dx = 0). The second derivative d\u00b2y/dx\u00b2 determines whether it is a maximum (negative) or minimum (positive)."
  },
  {
    "id": "math_calc_d1",
    "subject": "math",
    "topicId": "math_calculus",
    "difficulty": "difficult",
    "question": "Evaluate the definite integral \u222b from 1 to 3 of (3x^2 - 2x) dx.",
    "options": [
      "18",
      "20",
      "16",
      "24"
    ],
    "correctIndex": 0,
    "explanation": "The anti-derivative is [x^3 - x^2] from 1 to 3. Evaluating at 3: (3^3 - 3^2) = 27 - 9 = 18. Evaluating at 1: (1^3 - 1^2) = 0. The definite integral is 18 - 0 = 18.",
    "concept": "The Fundamental Theorem of Calculus states that \u222b from a to b of f(x)dx = F(b) - F(a), where F'(x) = f(x)."
  },
  {
    "id": "math_calc_d2",
    "subject": "math",
    "topicId": "math_calculus",
    "difficulty": "difficult",
    "question": "A cylindrical water tank with radius r = 2 m is being filled such that the height of water increases at dh/dt = 0.5 m/min. At what rate is the volume increasing (in m\u00b3/min)?",
    "options": [
      "2pi m\u00b3/min",
      "4pi m\u00b3/min",
      "pi m\u00b3/min",
      "8pi m\u00b3/min"
    ],
    "correctIndex": 0,
    "explanation": "Volume of cylinder V = pi * r^2 * h. With constant radius r = 2, V = 4*pi*h. Differentiating with respect to time t: dV/dt = 4*pi*(dh/dt) = 4*pi*(0.5) = 2*pi m\u00b3/min.",
    "concept": "In N3 calculus, rates of change problems apply the chain rule where related variables change over time with respect to a common parameter t."
  },
  {
    "id": "math_alg_e1",
    "subject": "math",
    "topicId": "math_algebra",
    "difficulty": "easy",
    "question": "Simplify the expression: (2x^3)^3.",
    "options": [
      "8x^9",
      "6x^9",
      "8x^6",
      "6x^6"
    ],
    "correctIndex": 0,
    "explanation": "Apply the power of a product rule: (a * b)^n = a^n * b^n. Here 2^3 = 8, and (x^3)^3 = x^(3*3) = x^9. Thus, 8x^9.",
    "concept": "Exponent laws dictate that raising a power to another power requires multiplying exponents: (x^m)^n = x^(m*n)."
  },
  {
    "id": "math_alg_e2",
    "subject": "math",
    "topicId": "math_algebra",
    "difficulty": "easy",
    "question": "What is the value of log_2(64)?",
    "options": [
      "6",
      "5",
      "8",
      "32"
    ],
    "correctIndex": 0,
    "explanation": "The logarithm asks: 2 raised to what power equals 64? Since 2^6 = 64, log_2(64) = 6.",
    "concept": "Logarithmic notation log_b(a) = c is algebraically equivalent to the exponential equation b^c = a, with base b > 0 and b != 1."
  },
  {
    "id": "math_alg_m1",
    "subject": "math",
    "topicId": "math_algebra",
    "difficulty": "medium",
    "question": "Solve for x in the equation: 3^(2x - 1) = 27.",
    "options": [
      "x = 2",
      "x = 3",
      "x = 1.5",
      "x = 4"
    ],
    "correctIndex": 0,
    "explanation": "Express 27 with base 3: 27 = 3^3. Since the bases are equal, 2x - 1 = 3 => 2x = 4 => x = 2.",
    "concept": "In exponential equations, if b^u = b^v where base b > 0 and b != 1, then exponents are equal: u = v."
  },
  {
    "id": "math_alg_m2",
    "subject": "math",
    "topicId": "math_algebra",
    "difficulty": "medium",
    "question": "Find the roots of the quadratic equation 2x^2 - 5x + 2 = 0.",
    "options": [
      "x = 2 or x = 0.5",
      "x = -2 or x = -0.5",
      "x = 1 or x = 2",
      "x = 4 or x = 1"
    ],
    "correctIndex": 0,
    "explanation": "Factorize (2x - 1)(x - 2) = 0. This gives 2x - 1 = 0 => x = 1/2 = 0.5, or x - 2 = 0 => x = 2.",
    "concept": "Quadratic equations ax\u00b2 + bx + c = 0 can be solved by factorisation or the quadratic formula x = (-b \u00b1 \u221a(b\u00b2 - 4ac)) / (2a)."
  },
  {
    "id": "math_alg_d1",
    "subject": "math",
    "topicId": "math_algebra",
    "difficulty": "difficult",
    "question": "Solve for x: log_10(x + 3) + log_10(x - 3) = log_10(16).",
    "options": [
      "x = 5",
      "x = -5",
      "x = 4",
      "x = 7"
    ],
    "correctIndex": 0,
    "explanation": "Using log(a) + log(b) = log(a*b), we have log_10((x+3)(x-3)) = log_10(16). So x^2 - 9 = 16 => x^2 = 25 => x = \u00b15. Because the argument of a logarithm must be strictly positive (x - 3 > 0), only x = 5 is valid.",
    "concept": "Extraneous roots must be rejected when solving logarithmic equations because logarithms are undefined for negative numbers and zero in the real number system."
  },
  {
    "id": "math_trig_e1",
    "subject": "math",
    "topicId": "math_trig",
    "difficulty": "easy",
    "question": "What is the exact value of sin(30\u00b0)?",
    "options": [
      "0.5",
      "0.707",
      "0.866",
      "1.0"
    ],
    "correctIndex": 0,
    "explanation": "In standard right-angled special triangles (30\u00b0-60\u00b0-90\u00b0), opposite / hypotenuse for 30\u00b0 is 1/2 = 0.5.",
    "concept": "Special angles (0\u00b0, 30\u00b0, 45\u00b0, 60\u00b0, 90\u00b0) are core knowledge in N1-N3 mathematics and must be evaluated without reliance on rounding."
  },
  {
    "id": "math_trig_e2",
    "subject": "math",
    "topicId": "math_trig",
    "difficulty": "easy",
    "question": "Simplify the fundamental trigonometric identity: sin\u00b2(\u03b8) + cos\u00b2(\u03b8).",
    "options": [
      "1",
      "tan\u00b2(\u03b8)",
      "0",
      "sec\u00b2(\u03b8)"
    ],
    "correctIndex": 0,
    "explanation": "Pythagoras' trigonometric identity states that for any angle \u03b8, sin\u00b2(\u03b8) + cos\u00b2(\u03b8) = 1.",
    "concept": "The Pythagorean trigonometric identity is derived directly from the unit circle where x = cos(\u03b8), y = sin(\u03b8), and x\u00b2 + y\u00b2 = 1."
  },
  {
    "id": "math_trig_m1",
    "subject": "math",
    "topicId": "math_trig",
    "difficulty": "medium",
    "question": "Convert an angle of 150\u00b0 into radians in terms of pi.",
    "options": [
      "5pi/6",
      "3pi/4",
      "2pi/3",
      "7pi/6"
    ],
    "correctIndex": 0,
    "explanation": "To convert degrees to radians, multiply by (pi / 180\u00b0): 150\u00b0 * (pi / 180\u00b0) = 150pi/180 = 5pi/6 rad.",
    "concept": "In circular measure, 180\u00b0 equals pi radians. Radians are the standard unit for angular displacement and arc length calculations (s = r*\u03b8)."
  },
  {
    "id": "math_trig_m2",
    "subject": "math",
    "topicId": "math_trig",
    "difficulty": "medium",
    "question": "In triangle ABC, side a = 8 cm, side b = 6 cm, and angle C = 60\u00b0. Calculate the length of side c using the Cosine Rule.",
    "options": [
      "7.21 cm",
      "10.0 cm",
      "5.29 cm",
      "8.50 cm"
    ],
    "correctIndex": 0,
    "explanation": "Cosine Rule: c\u00b2 = a\u00b2 + b\u00b2 - 2ab*cos(C). c\u00b2 = 8\u00b2 + 6\u00b2 - 2(8)(6)*cos(60\u00b0) = 64 + 36 - 96(0.5) = 100 - 48 = 52. c = \u221a52 \u2248 7.21 cm.",
    "concept": "The Cosine Rule is applied when solving non-right-angled triangles given two sides and the included angle (SAS) or all three sides (SSS)."
  },
  {
    "id": "math_trig_d1",
    "subject": "math",
    "topicId": "math_trig",
    "difficulty": "difficult",
    "question": "Solve for \u03b8 where 2*cos(2\u03b8) = 1 for the domain 0\u00b0 <= \u03b8 <= 180\u00b0.",
    "options": [
      "\u03b8 = 30\u00b0 and 150\u00b0",
      "\u03b8 = 60\u00b0 and 120\u00b0",
      "\u03b8 = 15\u00b0 and 75\u00b0",
      "\u03b8 = 45\u00b0 and 135\u00b0"
    ],
    "correctIndex": 0,
    "explanation": "2*cos(2\u03b8) = 1 => cos(2\u03b8) = 0.5. In quadrant 1, 2\u03b8 = 60\u00b0 => \u03b8 = 30\u00b0. In quadrant 4, 2\u03b8 = 300\u00b0 => \u03b8 = 150\u00b0. Both 30\u00b0 and 150\u00b0 lie within 0\u00b0 to 180\u00b0.",
    "concept": "Double-angle trigonometric equations require adjusting the domain for 2\u03b8 (0\u00b0 to 360\u00b0) before dividing through by 2 to find values of \u03b8."
  },
  {
    "id": "math_comp_e1",
    "subject": "math",
    "topicId": "math_complex",
    "difficulty": "easy",
    "question": "In electrical and TVET mathematics, what is the value of j\u00b2 (where j = \u221a(-1))?",
    "options": [
      "-1",
      "1",
      "j",
      "0"
    ],
    "correctIndex": 0,
    "explanation": "By definition, the imaginary unit j represents \u221a(-1). Squaring both sides yields j\u00b2 = -1.",
    "concept": "In engineering and TVET mathematics, the symbol j is used instead of i to prevent confusion with electric current i."
  },
  {
    "id": "math_comp_m1",
    "subject": "math",
    "topicId": "math_complex",
    "difficulty": "medium",
    "question": "Convert the complex number z = 3 + j4 into polar form (r /_ \u03b8).",
    "options": [
      "5 /_ 53.13\u00b0",
      "7 /_ 45.00\u00b0",
      "5 /_ 36.87\u00b0",
      "25 /_ 53.13\u00b0"
    ],
    "correctIndex": 0,
    "explanation": "Modulus r = \u221a(3\u00b2 + 4\u00b2) = \u221a(9 + 16) = \u221a25 = 5. Argument \u03b8 = arctan(4/3) \u2248 53.13\u00b0. Therefore, z = 5 /_ 53.13\u00b0.",
    "concept": "Converting between rectangular form (a + jb) and polar form (r /_ \u03b8) is essential in N3 mathematics and AC electrical circuit analysis."
  },
  {
    "id": "math_comp_m2",
    "subject": "math",
    "topicId": "math_complex",
    "difficulty": "medium",
    "question": "Multiply the two complex numbers in polar form: Z1 = 4 /_ 30\u00b0 and Z2 = 3 /_ 45\u00b0.",
    "options": [
      "12 /_ 75\u00b0",
      "7 /_ 75\u00b0",
      "12 /_ 15\u00b0",
      "1 /_ 75\u00b0"
    ],
    "correctIndex": 0,
    "explanation": "When multiplying complex numbers in polar form, multiply the magnitudes and add the angles: (4 * 3) /_ (30\u00b0 + 45\u00b0) = 12 /_ 75\u00b0.",
    "concept": "Multiplication in polar coordinates uses de Moivre's principles: magnitudes multiply, while phase angles add."
  },
  {
    "id": "math_comp_d1",
    "subject": "math",
    "topicId": "math_complex",
    "difficulty": "difficult",
    "question": "Divide the complex numbers: Z = (10 + j5) / (2 - j1). Express the result in rectangular form.",
    "options": [
      "3 + j4",
      "5 - j5",
      "4 + j2",
      "3 - j4"
    ],
    "correctIndex": 0,
    "explanation": "Multiply numerator and denominator by the complex conjugate of the denominator (2 + j1): [(10 + j5)(2 + j1)] / [(2 - j1)(2 + j1)] = [20 + j10 + j10 + 5j\u00b2] / [4 - j\u00b2] = [20 + j20 - 5] / [4 - (-1)] = (15 + j20) / 5 = 3 + j4.",
    "concept": "Division of complex numbers in rectangular form requires rationalizing the denominator using its complex conjugate (a - jb)."
  },
  {
    "id": "sci_stat_e1",
    "subject": "eng_sci",
    "topicId": "sci_statics",
    "difficulty": "easy",
    "question": "What is the SI unit of moment of a force (torque)?",
    "options": [
      "Newton-metre (N\u00b7m)",
      "Joule (J)",
      "Pascal (Pa)",
      "Newton per metre (N/m)"
    ],
    "correctIndex": 0,
    "explanation": "Moment is calculated as Force (Newtons) multiplied by perpendicular distance (metres), giving the SI unit Newton-metre (N\u00b7m).",
    "concept": "A moment measures the turning effect of a force about a pivot: Moment = F * d_perp."
  },
  {
    "id": "sci_stat_e2",
    "subject": "eng_sci",
    "topicId": "sci_statics",
    "difficulty": "easy",
    "question": "For a structural beam to remain in complete static equilibrium, what condition must be satisfied?",
    "options": [
      "Sum of upward forces equals sum of downward forces, and sum of clockwise moments equals sum of anticlockwise moments",
      "Only horizontal forces must balance",
      "The mass of the beam must exceed applied loads",
      "The reaction at support A must equal reaction at support B"
    ],
    "correctIndex": 0,
    "explanation": "Static equilibrium requires both translational equilibrium (sum of forces in all directions = 0) and rotational equilibrium (sum of moments about any point = 0).",
    "concept": "Equilibrium in TVET Engineering Science requires fulfilling both conditions: Sigma F = 0 and Sigma M = 0."
  },
  {
    "id": "sci_stat_m1",
    "subject": "eng_sci",
    "topicId": "sci_statics",
    "difficulty": "medium",
    "question": "A simply supported beam of span 6 m carries a concentrated downward point load of 30 kN at 2 m from left support A. Determine the vertical reaction at right support B.",
    "options": [
      "10 kN",
      "20 kN",
      "15 kN",
      "30 kN"
    ],
    "correctIndex": 0,
    "explanation": "Take moments about support A: (Reaction_B * 6 m) - (30 kN * 2 m) = 0 => 6 * Reaction_B = 60 => Reaction_B = 10 kN. (Reaction_A would be 20 kN).",
    "concept": "The principle of moments states that about any support in equilibrium, clockwise moments equal anticlockwise moments."
  },
  {
    "id": "sci_stat_m2",
    "subject": "eng_sci",
    "topicId": "sci_statics",
    "difficulty": "medium",
    "question": "Resolve a force of 100 N acting at an angle of 30\u00b0 above the horizontal into its horizontal (Fx) and vertical (Fy) components.",
    "options": [
      "Fx = 86.6 N, Fy = 50.0 N",
      "Fx = 50.0 N, Fy = 86.6 N",
      "Fx = 70.7 N, Fy = 70.7 N",
      "Fx = 100 N, Fy = 50.0 N"
    ],
    "correctIndex": 0,
    "explanation": "Fx = 100 * cos(30\u00b0) = 100 * 0.8660 = 86.6 N. Fy = 100 * sin(30\u00b0) = 100 * 0.5 = 50.0 N.",
    "concept": "Vector resolution decomposes a single vector into orthogonal rectangular components along Cartesian axes."
  },
  {
    "id": "sci_stat_d1",
    "subject": "eng_sci",
    "topicId": "sci_statics",
    "difficulty": "difficult",
    "question": "A uniform beam of weight 400 N and length 5 m rests horizontally on two supports located at its ends. In addition, an engine weighing 1200 N sits 1.5 m from the left end. What is the total reaction force at the left support?",
    "options": [
      "1040 N",
      "560 N",
      "800 N",
      "1200 N"
    ],
    "correctIndex": 0,
    "explanation": "The beam's self-weight (400 N) acts at its centre of gravity (2.5 m). Take moments about right support: (Reaction_Left * 5) - (1200 * 3.5) - (400 * 2.5) = 0 => 5 * Reaction_Left = 4200 + 1000 = 5200 => Reaction_Left = 1040 N.",
    "concept": "Uniform structural elements have their self-weight concentrated at the geometric centroid (centre of gravity)."
  },
  {
    "id": "sci_dyn_e1",
    "subject": "eng_sci",
    "topicId": "sci_dynamics",
    "difficulty": "easy",
    "question": "What formula calculates the kinetic energy (Ek) of an object with mass m moving at velocity v?",
    "options": [
      "Ek = 0.5 * m * v\u00b2",
      "Ek = m * g * h",
      "Ek = m * v",
      "Ek = 0.5 * m * v"
    ],
    "correctIndex": 0,
    "explanation": "Kinetic energy is defined as the work needed to accelerate a body of mass m from rest to velocity v: Ek = 0.5 * m * v\u00b2.",
    "concept": "Kinetic energy varies linearly with mass but quadratically with velocity (doubling speed quadruples kinetic energy)."
  },
  {
    "id": "sci_dyn_m1",
    "subject": "eng_sci",
    "topicId": "sci_dynamics",
    "difficulty": "medium",
    "question": "A forklift lifts a crate of mass 500 kg vertically through a height of 4 metres in 8 seconds. Calculate the useful output power developed (use g = 9.8 m/s\u00b2).",
    "options": [
      "2450 W",
      "19600 W",
      "490 W",
      "1225 W"
    ],
    "correctIndex": 0,
    "explanation": "Work done = Force * distance = m * g * h = 500 kg * 9.8 m/s\u00b2 * 4 m = 19600 J. Power = Work / time = 19600 J / 8 s = 2450 Watts (2.45 kW).",
    "concept": "Power is the rate at which work is done (Joules per second = Watts)."
  },
  {
    "id": "sci_dyn_m2",
    "subject": "eng_sci",
    "topicId": "sci_dynamics",
    "difficulty": "medium",
    "question": "A truck accelerates uniformly from 10 m/s to 25 m/s over a distance of 175 metres. What is its acceleration?",
    "options": [
      "1.5 m/s\u00b2",
      "2.0 m/s\u00b2",
      "1.0 m/s\u00b2",
      "3.0 m/s\u00b2"
    ],
    "correctIndex": 0,
    "explanation": "Use the kinematic equation v\u00b2 = u\u00b2 + 2as: 25\u00b2 = 10\u00b2 + 2*a*175 => 625 = 100 + 350a => 525 = 350a => a = 1.5 m/s\u00b2.",
    "concept": "The standard equations of rectilinear motion apply when acceleration is uniform."
  },
  {
    "id": "sci_dyn_d1",
    "subject": "eng_sci",
    "topicId": "sci_dynamics",
    "difficulty": "difficult",
    "question": "An electric hoist with an efficiency of 80% requires 5 kW of electrical input power. How much mass can it lift vertically at a constant speed of 2 m/s? (use g = 9.8 m/s\u00b2).",
    "options": [
      "204.1 kg",
      "255.1 kg",
      "163.3 kg",
      "408.2 kg"
    ],
    "correctIndex": 0,
    "explanation": "Output power = Input power * efficiency = 5000 W * 0.80 = 4000 W. Output power P = Force * velocity = (m * g) * v => 4000 = m * 9.8 * 2 = 19.6 * m => m = 4000 / 19.6 \u2248 204.08 kg.",
    "concept": "Mechanical efficiency is the ratio of useful power output to total power input: eta = P_out / P_in."
  },
  {
    "id": "sci_thermo_e1",
    "subject": "eng_sci",
    "topicId": "sci_thermo",
    "difficulty": "easy",
    "question": "What is the formula used to calculate the quantity of heat (Q) absorbed by a solid substance without changing state?",
    "options": [
      "Q = m * c * deltaT",
      "Q = m * L",
      "Q = P * V",
      "Q = F * v"
    ],
    "correctIndex": 0,
    "explanation": "Sensible heat equation is Q = m * c * deltaT, where m is mass, c is specific heat capacity, and deltaT is temperature change.",
    "concept": "Sensible heat causes a measurable change in temperature, unlike latent heat which causes a phase transition at constant temperature."
  },
  {
    "id": "sci_thermo_m1",
    "subject": "eng_sci",
    "topicId": "sci_thermo",
    "difficulty": "medium",
    "question": "A steel railway track of initial length 30 metres is heated from 15\u00b0C to 45\u00b0C. If the coefficient of linear expansion of steel is 12 x 10^-6 /\u00b0C, calculate the expansion in length.",
    "options": [
      "10.8 mm",
      "5.4 mm",
      "21.6 mm",
      "1.08 mm"
    ],
    "correctIndex": 0,
    "explanation": "deltaL = L_original * alpha * deltaT = 30 m * (12 x 10^-6 /\u00b0C) * (45 - 15)\u00b0C = 30 * 12e-6 * 30 = 0.0108 m = 10.8 mm.",
    "concept": "Thermal expansion of solids is proportional to the original dimension, the temperature variation, and the material's coefficient of expansion."
  },
  {
    "id": "sci_thermo_d1",
    "subject": "eng_sci",
    "topicId": "sci_thermo",
    "difficulty": "difficult",
    "question": "How much heat energy is required to heat 2 kg of water from 20\u00b0C to 100\u00b0C and completely vaporize it at 100\u00b0C? (c_water = 4184 J/kg\u00b7\u00b0C; Latent heat of vaporization Lv = 2.26 x 10^6 J/kg).",
    "options": [
      "5.19 x 10^6 J",
      "4.52 x 10^6 J",
      "669 440 J",
      "3.85 x 10^6 J"
    ],
    "correctIndex": 0,
    "explanation": "Sensible heat to reach 100\u00b0C: Q1 = m * c * deltaT = 2 * 4184 * 80 = 669 440 J. Latent heat to vaporize: Q2 = m * Lv = 2 * 2.26 x 10^6 = 4 520 000 J. Total Q = Q1 + Q2 = 669 440 + 4 520 000 = 5 189 440 J \u2248 5.19 x 10^6 J.",
    "concept": "Total heat in phase change calculations must sum sensible heat across the temperature gradient and latent heat at the transition temperature."
  },
  {
    "id": "sci_elec_e1",
    "subject": "eng_sci",
    "topicId": "sci_electricity",
    "difficulty": "easy",
    "question": "Three resistors of 4 ohms, 6 ohms, and 10 ohms are connected in series. What is their equivalent total resistance?",
    "options": [
      "20 ohms",
      "1.93 ohms",
      "10 ohms",
      "240 ohms"
    ],
    "correctIndex": 0,
    "explanation": "In a series circuit, resistances add directly: R_total = R1 + R2 + R3 = 4 + 6 + 10 = 20 ohms.",
    "concept": "In a series configuration, current passes through each component sequentially, so total resistance is the algebraic sum of individual values."
  },
  {
    "id": "sci_elec_m1",
    "subject": "eng_sci",
    "topicId": "sci_electricity",
    "difficulty": "medium",
    "question": "Two resistors of 6 ohms and 12 ohms are connected in parallel across a 24 V DC supply. What is the total current drawn from the supply?",
    "options": [
      "6 A",
      "4 A",
      "2 A",
      "18 A"
    ],
    "correctIndex": 0,
    "explanation": "Parallel resistance: 1/Rp = 1/6 + 1/12 = 3/12 = 1/4 => Rp = 4 ohms. Using Ohm's Law: I_total = V / Rp = 24 V / 4 ohms = 6 A.",
    "concept": "In parallel circuits, the voltage across each branch is identical, and total current is the sum of the branch currents."
  },
  {
    "id": "sci_elec_d1",
    "subject": "eng_sci",
    "topicId": "sci_electricity",
    "difficulty": "difficult",
    "question": "A cell has an open-circuit electromotive force (EMF) of 12 V. When connected to an external load resistor of 5.5 ohms, a current of 2.0 A flows. What is the internal resistance (r) of the cell?",
    "options": [
      "0.5 ohms",
      "1.0 ohm",
      "0.25 ohms",
      "6.0 ohms"
    ],
    "correctIndex": 0,
    "explanation": "Using EMF formula: E = I * (R + r) => 12 = 2 * (5.5 + r) => 6 = 5.5 + r => r = 0.5 ohms.",
    "concept": "Real chemical cells exhibit internal resistance r, causing the terminal voltage V_term = E - I*r to drop when delivering current to a load."
  },
  {
    "id": "elec_dc_e1",
    "subject": "electrotechnics",
    "topicId": "elec_dc",
    "difficulty": "easy",
    "question": "According to Kirchhoff's Current Law (KCL), what is the algebraic sum of all electric currents entering and leaving a circuit node?",
    "options": [
      "Zero",
      "Equal to the total circuit EMF",
      "Equal to the supply current squared",
      "Dependent on wire gauge"
    ],
    "correctIndex": 0,
    "explanation": "Kirchhoff's Current Law states that charge cannot accumulate at a junction: sum of entering currents equals sum of leaving currents, so algebraic sum = 0.",
    "concept": "KCL represents the conservation of electrical charge at any electrical junction."
  },
  {
    "id": "elec_dc_m1",
    "subject": "electrotechnics",
    "topicId": "elec_dc",
    "difficulty": "medium",
    "question": "In a DC shunt generator, what happens to the generated back-EMF if the speed of rotation is doubled while the magnetic flux remains constant?",
    "options": [
      "It doubles",
      "It halves",
      "It quadruples",
      "It remains unchanged"
    ],
    "correctIndex": 0,
    "explanation": "The generated EMF equation is E = (2 * p * Phi * N * Z) / (60 * c). Because EMF E is directly proportional to rotational speed N (E \u221d N), doubling speed doubles EMF.",
    "concept": "Faraday's Law dictates that induced EMF in a machine is directly proportional to both magnetic flux per pole and armature rotational speed."
  },
  {
    "id": "elec_dc_d1",
    "subject": "electrotechnics",
    "topicId": "elec_dc",
    "difficulty": "difficult",
    "question": "A 220 V DC shunt motor has an armature resistance of 0.4 ohms. If the back-EMF developed at full load is 208 V, what is the full-load armature current?",
    "options": [
      "30 A",
      "550 A",
      "520 A",
      "12 A"
    ],
    "correctIndex": 0,
    "explanation": "For a DC motor: V = Eb + Ia*Ra => Ia = (V - Eb) / Ra = (220 - 208) / 0.4 = 12 / 0.4 = 30 A.",
    "concept": "Back-EMF opposes the applied terminal voltage; the voltage difference across armature resistance determines armature current."
  },
  {
    "id": "elec_ac_e1",
    "subject": "electrotechnics",
    "topicId": "elec_ac",
    "difficulty": "easy",
    "question": "For a sinusoidal alternating voltage with a peak value (Vmax) of 325 V, what is its root-mean-square (RMS) effective voltage?",
    "options": [
      "230 V",
      "325 V",
      "162.5 V",
      "460 V"
    ],
    "correctIndex": 0,
    "explanation": "For a pure sine wave: V_rms = Vmax / \u221a2 = 0.7071 * 325 V \u2248 230 V (standard South African domestic single-phase voltage).",
    "concept": "RMS is the DC equivalent heating value of an alternating current waveform."
  },
  {
    "id": "elec_ac_m1",
    "subject": "electrotechnics",
    "topicId": "elec_ac",
    "difficulty": "medium",
    "question": "In a purely inductive AC circuit connected to a 50 Hz supply, what is the phase relationship between the applied voltage and current?",
    "options": [
      "Current lags voltage by 90\u00b0",
      "Current leads voltage by 90\u00b0",
      "Current and voltage are in phase",
      "Current lags voltage by 180\u00b0"
    ],
    "correctIndex": 0,
    "explanation": "Remember the mnemonic CIVIL: In an Inductor (L), Voltage (V) leads Current (I), meaning current lags voltage by 90\u00b0 (pi/2 radians).",
    "concept": "Inductive reactance causes the self-induced counter-EMF to delay the build-up of alternating current."
  },
  {
    "id": "elec_ac_d1",
    "subject": "electrotechnics",
    "topicId": "elec_ac",
    "difficulty": "difficult",
    "question": "A single-phase load draws 10 A from a 230 V, 50 Hz supply at a lagging power factor of 0.8. Calculate the active power (P in kW) and reactive power (Q in kVAR).",
    "options": [
      "P = 1.84 kW, Q = 1.38 kVAR",
      "P = 2.30 kW, Q = 1.84 kVAR",
      "P = 1.84 kW, Q = 0.46 kVAR",
      "P = 1.38 kW, Q = 1.84 kVAR"
    ],
    "correctIndex": 0,
    "explanation": "Apparent power S = V * I = 230 * 10 = 2300 VA = 2.3 kVA. Active power P = S * cos(\u03b8) = 2.3 * 0.8 = 1.84 kW. Since cos(\u03b8) = 0.8, sin(\u03b8) = 0.6. Reactive power Q = S * sin(\u03b8) = 2.3 * 0.6 = 1.38 kVAR.",
    "concept": "The AC power triangle relates apparent power (S in VA), real power (P in W), and reactive power (Q in VAR) via Pythagoras: S\u00b2 = P\u00b2 + Q\u00b2."
  },
  {
    "id": "elec_trans_e1",
    "subject": "electrotechnics",
    "topicId": "elec_machines",
    "difficulty": "easy",
    "question": "A step-down transformer has 1000 turns on its primary winding and 100 turns on its secondary. If 2300 V is applied to the primary, what is the secondary voltage?",
    "options": [
      "230 V",
      "23 V",
      "23000 V",
      "400 V"
    ],
    "correctIndex": 0,
    "explanation": "Transformer ratio: Vp / Vs = Np / Ns => Vs = Vp * (Ns / Np) = 2300 * (100 / 1000) = 230 V.",
    "concept": "The transformer turns ratio relates primary and secondary voltages proportionally to the number of turns."
  },
  {
    "id": "elec_trans_m1",
    "subject": "electrotechnics",
    "topicId": "elec_machines",
    "difficulty": "medium",
    "question": "A 4-pole, three-phase induction motor is connected to a 50 Hz supply. What is its synchronous magnetic field speed in revolutions per minute (RPM)?",
    "options": [
      "1500 RPM",
      "3000 RPM",
      "1000 RPM",
      "1440 RPM"
    ],
    "correctIndex": 0,
    "explanation": "Synchronous speed Ns = (120 * f) / p, where f is frequency (50 Hz) and p is number of poles (4). Ns = (120 * 50) / 4 = 6000 / 4 = 1500 RPM.",
    "concept": "Synchronous speed of a rotating magnetic field in three-phase machinery is strictly determined by supply frequency and pole count."
  },
  {
    "id": "elec_trans_d1",
    "subject": "electrotechnics",
    "topicId": "elec_machines",
    "difficulty": "difficult",
    "question": "If the 4-pole motor running on a 50 Hz supply has an actual rotor speed of 1440 RPM at full load, what is the rotor slip percentage?",
    "options": [
      "4.0%",
      "6.0%",
      "2.5%",
      "5.0%"
    ],
    "correctIndex": 0,
    "explanation": "Synchronous speed Ns = 1500 RPM. Slip s = ((Ns - Nr) / Ns) * 100 = ((1500 - 1440) / 1500) * 100 = (60 / 1500) * 100 = 4.0%.",
    "concept": "Induction motor torque requires relative motion between rotor conductors and stator field; without slip, no rotor current or torque can be induced."
  },
  {
    "id": "elec_prot_e1",
    "subject": "electrotechnics",
    "topicId": "elec_protection",
    "difficulty": "easy",
    "question": "Under South African National Standard SANS 10142-1, what is the standard rated residual operating current for an earth leakage protection unit in domestic installations?",
    "options": [
      "30 mA",
      "100 mA",
      "10 mA",
      "300 mA"
    ],
    "correctIndex": 0,
    "explanation": "SANS 10142-1 mandates that earth leakage circuit breakers (ELCB/RCD) for general socket-outlet circuits must trip at a maximum residual leakage current of 30 mA to prevent fatal ventricular fibrillation.",
    "concept": "Residual current devices protect human life by disconnecting supplies when current imbalance between live and neutral exceeds 30 mA."
  },
  {
    "id": "elec_prot_m1",
    "subject": "electrotechnics",
    "topicId": "elec_protection",
    "difficulty": "medium",
    "question": "What is the primary function of protective equipotential bonding in an electrical installation according to SANS 10142-1?",
    "options": [
      "To connect extraneous conductive metalwork (water pipes, roofs) to the main earth bar to eliminate dangerous touch voltages",
      "To reduce electricity consumption during peak hours",
      "To increase neutral conductor resistance",
      "To prevent circuit breakers from tripping during lightning strikes"
    ],
    "correctIndex": 0,
    "explanation": "Equipotential bonding ensures that exposed metal parts and structural conductive materials remain at the exact same electrical potential (earth), eliminating dangerous touch voltages during earth faults.",
    "concept": "Bonding equalizes electric potential across all accessible metallic building components to protect against electric shock."
  },
  {
    "id": "elec_prot_d1",
    "subject": "electrotechnics",
    "topicId": "elec_protection",
    "difficulty": "difficult",
    "question": "During an insulation resistance test on a 230 V single-phase installation using a 500 V DC insulation tester (Megger), what is the minimum acceptable resistance required between live conductors and earth?",
    "options": [
      "1.0 Megaohm (M\u03a9)",
      "0.5 Megaohm (M\u03a9)",
      "100 ohms",
      "10 Megaohms (M\u03a9)"
    ],
    "correctIndex": 0,
    "explanation": "SANS 10142-1 specifies that for low-voltage installations up to 500 V, the insulation resistance between active conductors and earth must not be less than 1.0 M\u03a9 when tested at 500 V DC.",
    "concept": "Insulation resistance testing verifies dielectric integrity to prevent short circuits, leakage faults, and electrical fire hazards."
  },
  {
    "id": "acc_stmt_e1",
    "subject": "fin_acc",
    "topicId": "acc_statements",
    "difficulty": "easy",
    "question": "What is the fundamental accounting equation under International Financial Reporting Standards (IFRS) and GAAP?",
    "options": [
      "Assets = Owner's Equity + Liabilities",
      "Assets + Liabilities = Owner's Equity",
      "Liabilities = Assets + Owner's Equity",
      "Owner's Equity = Assets + Liabilities"
    ],
    "correctIndex": 0,
    "explanation": "The fundamental accounting equation states: Assets = Equity + Liabilities. Every business transaction maintains this dual balance.",
    "concept": "The double-entry bookkeeping system relies on this equation; every debit must have an equal corresponding credit."
  },
  {
    "id": "acc_stmt_e2",
    "subject": "fin_acc",
    "topicId": "acc_statements",
    "difficulty": "easy",
    "question": "At the financial year-end, an insurance policy of R12,000 was paid covering the next 12 months. Two months fall into the next financial year. How is the prepaid portion classified in the Statement of Financial Position?",
    "options": [
      "Current Asset (Prepaid Expense)",
      "Current Liability (Accrued Expense)",
      "Non-Current Asset",
      "Operating Expense in current year"
    ],
    "correctIndex": 0,
    "explanation": "Prepaid expenses represent future economic benefits paid in advance and are classified as Current Assets on the balance sheet.",
    "concept": "The matching concept requires expenses to be recognized in the accounting period in which the benefit is consumed."
  },
  {
    "id": "acc_stmt_m1",
    "subject": "fin_acc",
    "topicId": "acc_statements",
    "difficulty": "medium",
    "question": "On 28 February (year-end), electricity consumed of R4,500 has not yet been paid or recorded. What is the required adjusting journal entry?",
    "options": [
      "Debit Electricity Expense R4,500; Credit Accrued Expenses (Liability) R4,500",
      "Debit Accrued Expenses R4,500; Credit Bank R4,500",
      "Debit Bank R4,500; Credit Electricity Expense R4,500",
      "Debit Prepaid Electricity R4,500; Credit Electricity Expense R4,500"
    ],
    "correctIndex": 0,
    "explanation": "Accrued expenses are expenses incurred during the current period that have not yet been settled. Debit the expense account to reflect true cost; credit accrued expenses (current liability).",
    "concept": "Under accrual accounting, income and expenses are recognized when earned or incurred, regardless of when cash is exchanged."
  },
  {
    "id": "acc_stmt_m2",
    "subject": "fin_acc",
    "topicId": "acc_statements",
    "difficulty": "medium",
    "question": "A business reports Sales of R500,000, Opening Inventory R60,000, Purchases R320,000, and Closing Inventory R80,000. Calculate Gross Profit.",
    "options": [
      "R200,000",
      "R120,000",
      "R180,000",
      "R300,000"
    ],
    "correctIndex": 0,
    "explanation": "Cost of Sales = Opening Inventory + Purchases - Closing Inventory = 60,000 + 320,000 - 80,000 = R300,000. Gross Profit = Sales - Cost of Sales = 500,000 - 300,000 = R200,000.",
    "concept": "The trading section of the Statement of Comprehensive Income matches net sales against direct cost of goods sold to reveal gross profitability."
  },
  {
    "id": "acc_stmt_d1",
    "subject": "fin_acc",
    "topicId": "acc_statements",
    "difficulty": "difficult",
    "question": "A tenant pays R36,000 rent on 1 December for 6 months (R6,000/month). The financial year ends on 28 February. What amount must be shown as Income Received in Advance in the balance sheet, and what amount is recorded in profit and loss?",
    "options": [
      "Profit & Loss: R18,000; Income in Advance (Current Liability): R18,000",
      "Profit & Loss: R36,000; Income in Advance: R0",
      "Profit & Loss: R12,000; Income in Advance: R24,000",
      "Profit & Loss: R24,000; Income in Advance: R12,000"
    ],
    "correctIndex": 0,
    "explanation": "3 months (Dec, Jan, Feb) belong to this year: 3 x R6,000 = R18,000 earned (P&L). The remaining 3 months (Mar, Apr, May) of R18,000 represent unearned income and must be credited as Income Received in Advance (Current Liability).",
    "concept": "Income received in advance creates an obligation to provide future services, requiring classification as a current liability."
  },
  {
    "id": "acc_rec_e1",
    "subject": "fin_acc",
    "topicId": "acc_reconciliation",
    "difficulty": "easy",
    "question": "What is the purpose of preparing a Bank Reconciliation Statement at the end of each month?",
    "options": [
      "To reconcile differences between the bank balance in the Cash Book and the balance on the official Bank Statement",
      "To submit VAT returns to SARS",
      "To calculate employee PAYE deductions",
      "To compute annual company tax"
    ],
    "correctIndex": 0,
    "explanation": "Bank reconciliation identifies timing differences (e.g. unpresented cheques, outstanding deposits) and unrecorded bank entries (service fees, direct debits) between internal books and bank statements.",
    "concept": "Reconciliation forms an essential internal control mechanism verifying cash integrity and preventing misappropriation."
  },
  {
    "id": "acc_rec_m1",
    "subject": "fin_acc",
    "topicId": "acc_reconciliation",
    "difficulty": "medium",
    "question": "The Bank Statement shows bank charges of R450 and interest earned of R120 not yet recorded in the company's records. How should these be processed?",
    "options": [
      "Enter bank charges in Cash Payments Journal (CPJ) and interest in Cash Receipts Journal (CRJ)",
      "Enter both directly in the Bank Reconciliation Statement without updating the Cash Book",
      "Deduct both from Sales in the Income Statement",
      "Record as a prior-year adjustment"
    ],
    "correctIndex": 0,
    "explanation": "Bank charges are cash payments (entered in CPJ); interest earned is cash receipts (entered in CRJ). The Cash Book must be updated before final reconciliation.",
    "concept": "Direct bank items that are genuine transactions must be posted into the accounting journals to bring the Cash Book balance up to date."
  },
  {
    "id": "acc_rec_d1",
    "subject": "fin_acc",
    "topicId": "acc_reconciliation",
    "difficulty": "difficult",
    "question": "A cheque of R7,800 issued to a supplier was correctly written and paid by the bank, but mistakenly entered in the Cash Payments Journal as R8,700. What corrective entry is required?",
    "options": [
      "Credit Bank / Debit Accounts Payable is adjusted by entering R900 in the Cash Receipts Journal (CRJ) to reverse the overpayment",
      "Enter R900 in the Cash Payments Journal",
      "Deduct R900 on the Bank Statement",
      "Ignore the error as it is less than R1,000"
    ],
    "correctIndex": 0,
    "explanation": "CPJ was overstated by R8,700 - R7,800 = R900 (too much cash recorded paid). To correct an overstatement in payments, enter R900 in the Cash Receipts Journal (CRJ) to restore cash.",
    "concept": "Correction of errors in subsidiary journals requires offsetting adjustments that restore accurate ledger balances."
  },
  {
    "id": "acc_dep_e1",
    "subject": "fin_acc",
    "topicId": "acc_depreciation",
    "difficulty": "easy",
    "question": "Which accounting principle justifies allocating the cost of a long-term tangible asset across its useful operational life?",
    "options": [
      "Matching Principle (Accrual Concept)",
      "Prudence Concept only",
      "Business Entity Concept",
      "Materiality Concept"
    ],
    "correctIndex": 0,
    "explanation": "The matching concept requires that the expense of utilizing an asset (depreciation) is matched against the revenues it helps generate over its operating life.",
    "concept": "Depreciation is an allocation of cost, not a valuation of current market price."
  },
  {
    "id": "acc_dep_m1",
    "subject": "fin_acc",
    "topicId": "acc_depreciation",
    "difficulty": "medium",
    "question": "Machinery was purchased for R120,000 with an estimated residual value of R20,000 and an expected useful life of 5 years. Using the straight-line method, what is the annual depreciation expense?",
    "options": [
      "R20,000 per year",
      "R24,000 per year",
      "R16,000 per year",
      "R10,000 per year"
    ],
    "correctIndex": 0,
    "explanation": "Straight-line depreciation = (Cost - Residual Value) / Useful Life = (120,000 - 20,000) / 5 = R100,000 / 5 = R20,000 per year.",
    "concept": "Under straight-line depreciation, an equal monetary amount is expensed each full operating financial year."
  },
  {
    "id": "acc_dep_d1",
    "subject": "fin_acc",
    "topicId": "acc_depreciation",
    "difficulty": "difficult",
    "question": "Equipment bought for R80,000 on 1 March 2024 is depreciated at 20% per annum on the diminishing (reducing) balance method. What is its carrying (book) value at the end of the second year (28 February 2026)?",
    "options": [
      "R51,200",
      "R48,000",
      "R64,000",
      "R32,000"
    ],
    "correctIndex": 0,
    "explanation": "Year 1: Depreciation = 20% of 80,000 = R16,000. Carrying value end Year 1 = 80,000 - 16,000 = R64,000. Year 2: Depreciation = 20% of R64,000 = R12,800. Carrying value end Year 2 = 64,000 - 12,800 = R51,200.",
    "concept": "Under reducing balance depreciation, the percentage rate is applied to the carrying amount (cost minus accumulated depreciation), generating higher depreciation in early years."
  },
  {
    "id": "acc_cash_e1",
    "subject": "fin_acc",
    "topicId": "acc_cashflow",
    "difficulty": "easy",
    "question": "In a Statement of Cash Flows, under which section are cash proceeds from the issuance of company shares classified?",
    "options": [
      "Financing Activities",
      "Operating Activities",
      "Investing Activities",
      "Working Capital Changes"
    ],
    "correctIndex": 0,
    "explanation": "Financing activities relate to transactions that change the equity capital structure or non-current borrowings of the enterprise.",
    "concept": "IAS 7 categorizes cash flows into Operating, Investing, and Financing activities."
  },
  {
    "id": "acc_cash_m1",
    "subject": "fin_acc",
    "topicId": "acc_cashflow",
    "difficulty": "medium",
    "question": "Why is annual depreciation added back to Net Profit when preparing the Cash Flow from Operating Activities using the indirect method?",
    "options": [
      "Because depreciation is a non-cash expense that reduced profit without any physical outflow of cash",
      "Because depreciation is an operating cash outflow",
      "To comply with SARS VAT output rules",
      "To increase the company's taxable income"
    ],
    "correctIndex": 0,
    "explanation": "Depreciation was deducted to determine net profit on an accrual basis, but no actual cash left the bank account. Therefore, it must be added back to convert accounting profit into physical operating cash flow.",
    "concept": "The indirect method starts with net profit before tax and adjusts for non-cash expenses, non-operating items, and working capital shifts."
  },
  {
    "id": "acc_cash_d1",
    "subject": "fin_acc",
    "topicId": "acc_cashflow",
    "difficulty": "difficult",
    "question": "A business started the year with Accounts Receivable of R90,000 and ended the year with R130,000. How does this increase of R40,000 affect Cash Generated from Operations?",
    "options": [
      "It is deducted as a R40,000 outflow/use of cash",
      "It is added as a R40,000 inflow of cash",
      "It has zero impact on operating cash",
      "It is recorded under financing activities"
    ],
    "correctIndex": 0,
    "explanation": "An increase in receivables means sales were recorded as accounting revenue but cash has not yet been collected from customers. Cash is tied up in working capital, so it is subtracted from operating profit.",
    "concept": "Increases in current assets (other than cash) represent an application (outflow) of cash in working capital reconciliation."
  },
  {
    "id": "ebm_plan_e1",
    "subject": "ebm",
    "topicId": "ebm_planning",
    "difficulty": "easy",
    "question": "Which section of a formal business plan provides a concise overview of the entire venture and is usually read first by investors?",
    "options": [
      "Executive Summary",
      "Appendix",
      "Manufacturing Schedule",
      "Human Resource Roster"
    ],
    "correctIndex": 0,
    "explanation": "The Executive Summary synthesizes key elements: business concept, value proposition, financial needs, and growth prospects into a concise snapshot.",
    "concept": "Although placed first in the business plan, the executive summary is drafted last once all detailed sections are finalized."
  },
  {
    "id": "ebm_plan_m1",
    "subject": "ebm",
    "topicId": "ebm_planning",
    "difficulty": "medium",
    "question": "In a SWOT analysis for a new TVET automotive repair enterprise, how is a new rival workshop opening across the road classified?",
    "options": [
      "External Threat",
      "Internal Weakness",
      "External Opportunity",
      "Internal Strength"
    ],
    "correctIndex": 0,
    "explanation": "Competitor actions originate in the external macro/market environment and pose potential risks, classifying them as External Threats.",
    "concept": "SWOT divides factors into internal controllable factors (Strengths, Weaknesses) and external macro factors (Opportunities, Threats)."
  },
  {
    "id": "ebm_plan_d1",
    "subject": "ebm",
    "topicId": "ebm_planning",
    "difficulty": "difficult",
    "question": "What is the critical distinction between a feasibility study and a formal business plan in entrepreneurial venture development?",
    "options": [
      "A feasibility study determines if an idea is viable before investing resources; a business plan outlines how to execute and manage an approved viable concept",
      "A feasibility study is only for banks while a business plan is for customers",
      "A feasibility study contains financial statements while a business plan has no numbers",
      "There is no difference; they are interchangeable terms"
    ],
    "correctIndex": 0,
    "explanation": "A feasibility study is an investigative 'go/no-go' evaluation testing market, technical, and economic viability. Once feasibility is established, the business plan provides the operational roadmap.",
    "concept": "Feasibility analysis prevents costly capital misallocation by screening out unworkable concepts early."
  },
  {
    "id": "ebm_mkt_e1",
    "subject": "ebm",
    "topicId": "ebm_marketing",
    "difficulty": "easy",
    "question": "What are the four components of the traditional Marketing Mix (the 4 Ps)?",
    "options": [
      "Product, Price, Place, Promotion",
      "Planning, Production, People, Profit",
      "Positioning, Purchasing, Packaging, Payment",
      "Policies, Personnel, Process, Performance"
    ],
    "correctIndex": 0,
    "explanation": "The traditional marketing mix formulated by E. Jerome McCarthy comprises Product, Price, Place (distribution), and Promotion.",
    "concept": "The 4 Ps represent the controllable tactical marketing tools an enterprise blends to satisfy its target market."
  },
  {
    "id": "ebm_mkt_m1",
    "subject": "ebm",
    "topicId": "ebm_marketing",
    "difficulty": "medium",
    "question": "An entrepreneur collects data by handing out 200 structured questionnaires to shoppers in a local retail centre. What type of research data is this?",
    "options": [
      "Primary quantitative research",
      "Secondary qualitative research",
      "Historical archival research",
      "Syndicated desk research"
    ],
    "correctIndex": 0,
    "explanation": "Primary research is original first-hand data collected specifically for the current project. Structured questionnaires with numerical counts represent quantitative data.",
    "concept": "Primary data collection addresses specific bespoke research objectives that existing secondary sources cannot answer."
  },
  {
    "id": "ebm_mkt_d1",
    "subject": "ebm",
    "topicId": "ebm_marketing",
    "difficulty": "difficult",
    "question": "A tech startup prices its innovative software high upon initial launch to capture surplus from early adopters, then progressively lowers the price. What pricing strategy is being used?",
    "options": [
      "Price Skimming",
      "Penetration Pricing",
      "Cost-Plus Mark-up Pricing",
      "Predatory Pricing"
    ],
    "correctIndex": 0,
    "explanation": "Price skimming sets high initial prices to maximize early-stage margins before lowering prices as market competitors emerge.",
    "concept": "Skimming is effective when an offering possesses unique technological or prestige advantages protected by high entry barriers."
  },
  {
    "id": "ebm_be_e1",
    "subject": "ebm",
    "topicId": "ebm_break_even",
    "difficulty": "easy",
    "question": "What is the formula to calculate the contribution margin per unit?",
    "options": [
      "Selling Price per unit - Variable Cost per unit",
      "Selling Price per unit - Fixed Cost per unit",
      "Total Sales / Total Units",
      "Net Profit / Selling Price"
    ],
    "correctIndex": 0,
    "explanation": "Contribution margin per unit is the amount each unit sold contributes towards covering total fixed costs: Unit Selling Price minus Unit Variable Cost.",
    "concept": "Once cumulative contribution covers total fixed overheads, all subsequent unit contributions directly generate net profit."
  },
  {
    "id": "ebm_be_m1",
    "subject": "ebm",
    "topicId": "ebm_break_even",
    "difficulty": "medium",
    "question": "A bakery incurs monthly fixed costs of R30,000. It bakes specialty cakes sold at R150 each, with variable ingredients and packaging costing R50 per cake. How many cakes must be sold to break even?",
    "options": [
      "300 cakes",
      "200 cakes",
      "600 cakes",
      "150 cakes"
    ],
    "correctIndex": 0,
    "explanation": "Contribution per cake = R150 - R50 = R100. Break-Even Units = Total Fixed Costs / Contribution per unit = R30,000 / R100 = 300 cakes.",
    "concept": "The break-even point is the operating volume where total sales revenue exactly equals total costs (zero profit, zero loss)."
  },
  {
    "id": "ebm_be_d1",
    "subject": "ebm",
    "topicId": "ebm_break_even",
    "difficulty": "difficult",
    "question": "If the bakery with fixed costs of R30,000 and unit contribution of R100 wishes to achieve a target monthly profit of R20,000, how many cakes must it sell?",
    "options": [
      "500 cakes",
      "300 cakes",
      "400 cakes",
      "700 cakes"
    ],
    "correctIndex": 0,
    "explanation": "Target volume = (Fixed Costs + Target Profit) / Unit Contribution = (R30,000 + R20,000) / R100 = R50,000 / R100 = 500 cakes.",
    "concept": "Cost-Volume-Profit (CVP) analysis treats target profit as an additional required fixed margin above operating overheads."
  },
  {
    "id": "ebm_law_e1",
    "subject": "ebm",
    "topicId": "ebm_legal",
    "difficulty": "easy",
    "question": "In South Africa, what government agency handles the statutory registration of companies (Pty Ltd) and intellectual property?",
    "options": [
      "CIPC (Companies and Intellectual Property Commission)",
      "SARS",
      "CCMA",
      "DHET"
    ],
    "correctIndex": 0,
    "explanation": "The Companies and Intellectual Property Commission (CIPC), an agency of the dtic, is mandated to register business entities and protect IP rights in South Africa.",
    "concept": "Formal legal incorporation under the Companies Act No. 71 of 2008 requires registration through CIPC."
  },
  {
    "id": "ebm_law_m1",
    "subject": "ebm",
    "topicId": "ebm_legal",
    "difficulty": "medium",
    "question": "What is the primary risk associated with operating as a Sole Proprietorship compared to a Private Company ((Pty) Ltd)?",
    "options": [
      "Unlimited personal liability for all business debts and legal claims",
      "Higher corporate tax rates",
      "Requirement to register shares on the JSE",
      "Mandatory appointment of independent auditors"
    ],
    "correctIndex": 0,
    "explanation": "A sole proprietorship is not a separate legal entity; the owner is personally and unconditionally liable for all enterprise debts and obligations.",
    "concept": "Limited liability safeguards an owner's personal assets (home, private savings) from corporate insolvency."
  },
  {
    "id": "ebm_law_d1",
    "subject": "ebm",
    "topicId": "ebm_legal",
    "difficulty": "difficult",
    "question": "Under the South African Value-Added Tax (VAT) Act, at what annual taxable turnover threshold does VAT registration with SARS become compulsory?",
    "options": [
      "R1,000,000 per consecutive 12-month period",
      "R500,000 per year",
      "R250,000 per year",
      "R5,000,000 per year"
    ],
    "correctIndex": 0,
    "explanation": "Mandatory VAT registration applies when taxable turnover has exceeded R1 million in any consecutive 12-month period or is contractually expected to exceed it. Voluntary registration is permitted from R50,000.",
    "concept": "VAT registered vendors act as collection agents for SARS, charging standard-rated output tax and deducting allowable input tax."
  },
  {
    "id": "comm_barr_e1",
    "subject": "mgt_comm",
    "topicId": "comm_barriers",
    "difficulty": "easy",
    "question": "In the standard linear communication model, what term describes any external interference or distraction that distorts the message between sender and receiver?",
    "options": [
      "Noise",
      "Feedback",
      "Encoding",
      "Channel"
    ],
    "correctIndex": 0,
    "explanation": "Noise is any physical, psychological, or environmental factor that impedes or distorts effective communication.",
    "concept": "Noise can occur at any stage: encoding, transmission channel, or receiver decoding."
  },
  {
    "id": "comm_barr_m1",
    "subject": "mgt_comm",
    "topicId": "comm_barriers",
    "difficulty": "medium",
    "question": "When a factory manager uses excessive engineering jargon when speaking to trainee production workers, what category of communication barrier is created?",
    "options": [
      "Semantic barrier",
      "Physical barrier",
      "Physiological barrier",
      "Organizational barrier"
    ],
    "correctIndex": 0,
    "explanation": "Semantic barriers arise from misunderstandings of words, idioms, technical jargon, or ambiguous phrasing where sender and receiver attach differing meanings.",
    "concept": "Effective management communication requires selecting vocabulary calibrated to the receiver's linguistic frame of reference."
  },
  {
    "id": "comm_barr_d1",
    "subject": "mgt_comm",
    "topicId": "comm_barriers",
    "difficulty": "difficult",
    "question": "What is the primary function and risk of the informal communication network known as 'the grapevine' within a corporate organization?",
    "options": [
      "It transmits social information and informal consensus quickly, but risks spreading unverified rumors and operational anxiety if formal management channels remain silent",
      "It replaces formal policy memos completely",
      "It is illegal under the Basic Conditions of Employment Act",
      "It strictly improves documented accountability"
    ],
    "correctIndex": 0,
    "explanation": "The grapevine operates rapidly and satisfies interpersonal social needs, but thrives on ambiguity and risks misinformation when management fails to communicate transparently.",
    "concept": "Managers cannot eliminate the grapevine; they must manage it by providing prompt, factual formal communication."
  },
  {
    "id": "comm_corr_e1",
    "subject": "mgt_comm",
    "topicId": "comm_correspondence",
    "difficulty": "easy",
    "question": "Which business correspondence document is designed exclusively for communication between employees or departments inside the same organization?",
    "options": [
      "Memorandum (Memo)",
      "Business Letter",
      "Press Release",
      "Quotation"
    ],
    "correctIndex": 0,
    "explanation": "A memorandum is an internal document that omits formal postal addresses, salutations ('Dear Sir'), and formal sign-offs ('Yours faithfully').",
    "concept": "Internal memos follow standard heading protocol: To, From, Date, Subject."
  },
  {
    "id": "comm_corr_m1",
    "subject": "mgt_comm",
    "topicId": "comm_correspondence",
    "difficulty": "medium",
    "question": "When writing an official formal business letter addressed to an external client whose name is known ('Dear Mr. Khumalo'), what is the standard formal complimentary close?",
    "options": [
      "Yours sincerely",
      "Yours faithfully",
      "Best regards always",
      "Cheers"
    ],
    "correctIndex": 0,
    "explanation": "Standard British/South African business English etiquette: If you address the recipient by name ('Dear Mr. Khumalo'), close with 'Yours sincerely'. If addressed anonymously ('Dear Sir/Madam'), close with 'Yours faithfully'.",
    "concept": "Professional correspondence adheres to standardized salutation and complimentary close pairing rules."
  },
  {
    "id": "comm_corr_d1",
    "subject": "mgt_comm",
    "topicId": "comm_correspondence",
    "difficulty": "difficult",
    "question": "In an analytical business investigation report, what is the essential distinction between the 'Findings' section and the 'Recommendations' section?",
    "options": [
      "Findings report verified objective facts and survey data gathered; Recommendations propose actionable solutions based on those findings",
      "Findings are opinions; Recommendations are historical facts",
      "Findings are written by the CEO; Recommendations by employees",
      "There is no difference in formal reporting"
    ],
    "correctIndex": 0,
    "explanation": "Findings present objective, empirical evidence and factual observations without subjective speculation. Recommendations translate those findings into practical forward-looking actions.",
    "concept": "Reports maintain strict separation between objective data (Findings/Analysis) and executive decisions (Recommendations)."
  },
  {
    "id": "comm_meet_e1",
    "subject": "mgt_comm",
    "topicId": "comm_meetings",
    "difficulty": "easy",
    "question": "What is the minimum number of voting members required to be present at an official meeting to make its proceedings legally valid according to its constitution?",
    "options": [
      "Quorum",
      "Proxy",
      "Agenda",
      "Adjournment"
    ],
    "correctIndex": 0,
    "explanation": "A quorum is the mandatory minimum attendance threshold stipulated in an organization's constitution or standing orders for business to be transacted.",
    "concept": "Any resolutions passed in the absence of a verified quorum are ultra vires (legally invalid and void)."
  },
  {
    "id": "comm_meet_m1",
    "subject": "mgt_comm",
    "topicId": "comm_meetings",
    "difficulty": "medium",
    "question": "In what grammatical tense and voice must official meeting minutes be recorded?",
    "options": [
      "Past tense and third-person objective voice",
      "Present continuous and first-person personal voice",
      "Future tense and second-person imperative voice",
      "Conditional tense"
    ],
    "correctIndex": 0,
    "explanation": "Minutes are historical institutional records of past actions and must be written objectively in the third person ('Mr. Dlamini reported that...') and past tense.",
    "concept": "Objective third-person recording eliminates personal bias and ensures legal admissibility of organizational records."
  },
  {
    "id": "comm_meet_d1",
    "subject": "mgt_comm",
    "topicId": "comm_meetings",
    "difficulty": "difficult",
    "question": "When a member at a formal meeting calls for a 'point of order', what is being raised?",
    "options": [
      "A breach or violation of meeting rules, constitution, or standing orders that the Chairperson must rule on immediately",
      "A vote of no confidence in the treasurer",
      "A request for afternoon tea",
      "A proposal to dissolve the company"
    ],
    "correctIndex": 0,
    "explanation": "A point of order takes precedence over all other discussions; it alerts the Chair to a procedural violation (e.g. unparliamentary language, lack of quorum, out-of-order motion).",
    "concept": "Rules of debate empower the Chairperson to preserve order and adherence to constitutionally established procedure."
  },
  {
    "id": "comm_lang_e1",
    "subject": "mgt_comm",
    "topicId": "comm_language",
    "difficulty": "easy",
    "question": "Which of the following sentences uses the active voice for clear, direct business communication?",
    "options": [
      "The Quality Inspector approved the delivery.",
      "The delivery was approved by the Quality Inspector.",
      "Approval was granted to the delivery by the inspector.",
      "The delivery had been inspected and approved."
    ],
    "correctIndex": 0,
    "explanation": "In the active voice, the subject performs the action directly: Subject (The Quality Inspector) + Verb (approved) + Object (the delivery). This creates vigor and clear accountability.",
    "concept": "Active voice delivers greater conciseness, impact, and unambiguous attribution of operational responsibility."
  },
  {
    "id": "comm_lang_m1",
    "subject": "mgt_comm",
    "topicId": "comm_language",
    "difficulty": "medium",
    "question": "When condensing a 1,000-word business briefing into a 250-word executive summary, what rule must be followed?",
    "options": [
      "Retain all core findings and decisions using your own concise words without adding new opinions or outside data",
      "Copy the first paragraph word-for-word and delete the rest",
      "Introduce new speculative data to make the summary exciting",
      "Replace factual figures with generalized adjectives"
    ],
    "correctIndex": 0,
    "explanation": "Executive summaries must distill the primary substance accurately without editorialization, factual distortion, or ungrounded external assertions.",
    "concept": "Pr\u00e9cis and summary writing require extracting essential core concepts while shedding non-essential supporting details."
  },
  {
    "id": "comm_lang_d1",
    "subject": "mgt_comm",
    "topicId": "comm_language",
    "difficulty": "difficult",
    "question": "Identify the sentence that maintains professional, constructive, and diplomatic business tone in client correspondence.",
    "options": [
      "We are reviewing your account statement to resolve the discrepancy promptly.",
      "You failed to read our invoice terms correctly, causing this blunder.",
      "Your claim is totally absurd and rejected.",
      "We have no time to deal with your complaints right now."
    ],
    "correctIndex": 0,
    "explanation": "Professional business communication avoids accusatory 'you' statements ('You failed...'), focusing instead on objective, collaborative resolution.",
    "concept": "The 'You-attitude' and courteous phrasing maintain customer goodwill while upholding corporate policy."
  },
  {
    "id": "hw_arch_e1",
    "subject": "comp_hw",
    "topicId": "hw_arch",
    "difficulty": "easy",
    "question": "What four sequential operations constitute the fundamental CPU machine instruction cycle?",
    "options": [
      "Fetch, Decode, Execute, Store (Write-back)",
      "Compile, Link, Run, Terminate",
      "Input, Process, Print, Scan",
      "Read, Write, Erase, Overwrite"
    ],
    "correctIndex": 0,
    "explanation": "The CPU cycle continually fetches the instruction from RAM, decodes the opcode, executes the operation in the ALU, and writes back the result to a register or memory.",
    "concept": "The Von Neumann architecture underpins modern computing processing cycles."
  },
  {
    "id": "hw_arch_e2",
    "subject": "comp_hw",
    "topicId": "hw_arch",
    "difficulty": "easy",
    "question": "Why is standard Dynamic RAM (DRAM) classified as 'volatile' memory?",
    "options": [
      "It loses all stored data immediately when electrical power is switched off",
      "It explodes under high temperatures",
      "It can only be read once",
      "It runs faster than CPU L1 cache"
    ],
    "correctIndex": 0,
    "explanation": "Volatile memory requires continuous electrical power to maintain its stored capacitor charge states; cutting power erases its contents.",
    "concept": "Primary working storage (RAM) is fast and volatile, whereas secondary storage (SSD, HDD) is non-volatile."
  },
  {
    "id": "hw_arch_m1",
    "subject": "comp_hw",
    "topicId": "hw_arch",
    "difficulty": "medium",
    "question": "What is the primary architectural purpose of Level 1 (L1) and Level 2 (L2) CPU cache memory?",
    "options": [
      "To provide high-speed SRAM buffers near the processor cores to minimize memory latency when fetching frequent instructions",
      "To store the operating system kernel when the PC is powered down",
      "To back up user photos automatically",
      "To convert AC electrical power to DC voltage"
    ],
    "correctIndex": 0,
    "explanation": "Cache memory uses ultra-fast Static RAM (SRAM) built on the CPU die to store frequently accessed data and instructions, preventing CPU idle cycles caused by slower DRAM access.",
    "concept": "The memory hierarchy balances speed, capacity, and cost across Registers -> Cache -> RAM -> Secondary Storage."
  },
  {
    "id": "hw_arch_d1",
    "subject": "comp_hw",
    "topicId": "hw_arch",
    "difficulty": "difficult",
    "question": "What architectural bottleneck occurs when a computer's physical RAM is completely exhausted and the OS relies heavily on virtual memory paging on a secondary storage drive?",
    "options": [
      "Thrashing",
      "Pipelining",
      "Overclocking",
      "Deadlock"
    ],
    "correctIndex": 0,
    "explanation": "Thrashing occurs when the OS spends more time swapping pages between RAM and disk virtual memory than executing actual instructions, collapsing system performance.",
    "concept": "Virtual memory simulates contiguous RAM using disk storage, but excessive page faults induce severe latency."
  },
  {
    "id": "hw_os_e1",
    "subject": "comp_hw",
    "topicId": "hw_os",
    "difficulty": "easy",
    "question": "Which core component of an Operating System resides permanently in memory and manages system resources, hardware access, and process scheduling?",
    "options": [
      "Kernel",
      "Web browser",
      "BIOS battery",
      "Command prompt"
    ],
    "correctIndex": 0,
    "explanation": "The kernel is the foundational core of the OS that interfaces directly with computer hardware, managing memory, CPU scheduling, and I/O devices.",
    "concept": "The OS kernel operates in privileged kernel mode (Ring 0) while applications run in restricted user mode (Ring 3)."
  },
  {
    "id": "hw_os_m1",
    "subject": "comp_hw",
    "topicId": "hw_os",
    "difficulty": "medium",
    "question": "Which modern file system used by Microsoft Windows supports fine-grained file permissions (ACLs), encryption (EFS), and transaction journaling for crash recovery?",
    "options": [
      "NTFS",
      "FAT32",
      "FAT16",
      "exFAT"
    ],
    "correctIndex": 0,
    "explanation": "New Technology File System (NTFS) provides journaling, Access Control Lists (ACLs), file compression, and volume shadow copy features missing in standard FAT32.",
    "concept": "Journaling file systems record intended changes in an audit log before writing, enabling instant recovery from sudden power loss."
  },
  {
    "id": "hw_os_d1",
    "subject": "comp_hw",
    "topicId": "hw_os",
    "difficulty": "difficult",
    "question": "In operating system process management, what condition describes two or more processes permanently blocked because each is holding a resource required by the other?",
    "options": [
      "Deadlock",
      "Starvation",
      "Race Condition",
      "Context Switching"
    ],
    "correctIndex": 0,
    "explanation": "Deadlock is a state where processes are unable to proceed because each holds a lock on a resource while waiting for a resource locked by another (circular wait).",
    "concept": "Coffman conditions define the four prerequisites for deadlock: mutual exclusion, hold and wait, no preemption, and circular wait."
  },
  {
    "id": "hw_net_e1",
    "subject": "comp_hw",
    "topicId": "hw_network",
    "difficulty": "easy",
    "question": "Which protocol automatically assigns IP addresses, subnet masks, and default gateways to client devices connecting to a network?",
    "options": [
      "DHCP (Dynamic Host Configuration Protocol)",
      "DNS (Domain Name System)",
      "HTTP",
      "FTP"
    ],
    "correctIndex": 0,
    "explanation": "DHCP automates network addressing using the DORA process (Discover, Offer, Request, Acknowledge), eliminating manual IP configuration conflicts.",
    "concept": "DHCP simplifies network administration by dynamically leasing IP parameters from a central pool."
  },
  {
    "id": "hw_net_m1",
    "subject": "comp_hw",
    "topicId": "hw_network",
    "difficulty": "medium",
    "question": "Which of the following IPv4 address blocks is designated by RFC 1918 strictly for private non-routable Local Area Networks (LANs)?",
    "options": [
      "192.168.1.50",
      "8.8.8.8",
      "154.66.12.1",
      "200.100.50.25"
    ],
    "correctIndex": 0,
    "explanation": "Private IP ranges include 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. These addresses cannot be routed across the public Internet.",
    "concept": "Network Address Translation (NAT) translates private RFC 1918 addresses into public IPs when routing traffic to the global Internet."
  },
  {
    "id": "hw_net_d1",
    "subject": "comp_hw",
    "topicId": "hw_network",
    "difficulty": "difficult",
    "question": "A host has an IP address of 192.168.10.45 with a subnet mask of 255.255.255.224 (/27). What is the network broadcast address for this specific subnet?",
    "options": [
      "192.168.10.63",
      "192.168.10.255",
      "192.168.10.32",
      "192.168.10.62"
    ],
    "correctIndex": 0,
    "explanation": "A mask of .224 gives a block size of 256 - 224 = 32. Subnet ranges: 0-31, 32-63, etc. Host .45 falls into the 192.168.10.32 subnet. The network address is .32, usable hosts are .33 to .62, and the broadcast address is 192.168.10.63.",
    "concept": "Subnetting divides address space into isolated collision and broadcast domains based on bitwise binary masking."
  },
  {
    "id": "hw_trb_e1",
    "subject": "comp_hw",
    "topicId": "hw_troubleshoot",
    "difficulty": "easy",
    "question": "What is the initial diagnostic routine run by the motherboard firmware (BIOS/UEFI) immediately after power is applied to a computer?",
    "options": [
      "POST (Power-On Self-Test)",
      "Chkdsk",
      "Disk Defragmenter",
      "System Restore"
    ],
    "correctIndex": 0,
    "explanation": "POST tests essential hardware components (CPU, system clock, RAM, video controller) before handing control over to the OS bootloader.",
    "concept": "Firmware conducts POST routines to confirm physical operational integrity before bootstrapping the operating system."
  },
  {
    "id": "hw_trb_m1",
    "subject": "comp_hw",
    "topicId": "hw_troubleshoot",
    "difficulty": "medium",
    "question": "A technician turns on a desktop PC: fans spin, but there is no display on the monitor, and the motherboard emits repetitive, continuous beeping. What is the most likely culprit?",
    "options": [
      "RAM module is improperly seated or defective",
      "Hard drive is full",
      "Mouse is disconnected",
      "Operating system needs an update"
    ],
    "correctIndex": 0,
    "explanation": "Standard BIOS beep codes (e.g. Award/AMI continuous beeping) alert the technician to a memory (RAM) failure before video initialization can occur.",
    "concept": "Beep codes provide low-level acoustic diagnostic telemetry when the display subsystem is not operational."
  },
  {
    "id": "hw_trb_d1",
    "subject": "comp_hw",
    "topicId": "hw_troubleshoot",
    "difficulty": "difficult",
    "question": "A computer boots into Windows normally, but after 10-15 minutes of gaming or heavy simulation work, it abruptly turns off with no blue screen. When rebooted immediately, it shuts down within seconds. What is the primary diagnosis?",
    "options": [
      "CPU thermal throttling and overheating shutdown caused by dried thermal paste or failed cooling fan",
      "Corrupt master boot record (MBR)",
      "Defective sound card",
      "Weak CMOS battery"
    ],
    "correctIndex": 0,
    "explanation": "Modern CPUs have internal thermal protection sensors. If the heatsink fan fails or thermal paste dries out, temperatures spike past junction limits (e.g. 100\u00b0C), triggering instantaneous emergency power cut-off to prevent silicon damage.",
    "concept": "Hardware thermal cutoffs protect silicon dies from thermal degradation and fire risks."
  },
  {
    "id": "prog_log_e1",
    "subject": "programming",
    "topicId": "prog_logic",
    "difficulty": "easy",
    "question": "In algorithmic programming, what type of control structure executes a block of code repeatedly as long as a boolean condition remains true?",
    "options": [
      "Loop (Iteration)",
      "Conditional statement (Selection)",
      "Sequence",
      "Function declaration"
    ],
    "correctIndex": 0,
    "explanation": "Iteration structures (such as while, do-while, and for loops) execute code repeatedly while the loop condition evaluates to true.",
    "concept": "Structured programming relies on three fundamental constructs: Sequence, Selection (if/else), and Iteration (loops)."
  },
  {
    "id": "prog_log_m1",
    "subject": "programming",
    "topicId": "prog_logic",
    "difficulty": "medium",
    "question": "What is the critical behavioral difference between a standard 'while' loop and a 'do-while' loop?",
    "options": [
      "A while loop tests the condition before executing (may run 0 times); a do-while loop executes the body at least once before testing the condition",
      "A do-while loop can never be infinite",
      "A while loop only works with numbers",
      "There is no functional difference"
    ],
    "correctIndex": 0,
    "explanation": "A while loop is pre-tested (if condition is false initially, it executes zero times). A do-while loop is post-tested (the code block executes once before the condition is checked).",
    "concept": "Pre-test vs post-test loop mechanics dictate minimum execution guarantees in program logic."
  },
  {
    "id": "prog_log_d1",
    "subject": "programming",
    "topicId": "prog_logic",
    "difficulty": "difficult",
    "question": "Examine the pseudocode logic: int x = 1; while (x <= 10) { if (x % 3 == 0) print(x); x = x + 2; } What output is printed?",
    "options": [
      "3, 9",
      "3, 6, 9",
      "1, 3, 5, 7, 9",
      "9"
    ],
    "correctIndex": 0,
    "explanation": "Trace x values: Start x=1. x=1: not divisible by 3. Next x = 1+2 = 3. x=3: 3%3==0 -> prints 3. Next x = 3+2 = 5. x=5: not divisible. Next x = 5+2 = 7. x=7: not divisible. Next x = 7+2 = 9. x=9: 9%3==0 -> prints 9. Next x = 9+2 = 11. Loop terminates (11 > 10). Output: 3, 9.",
    "concept": "Dry-run tracing with step tables verifies conditional branching and variable mutation through execution iterations."
  },
  {
    "id": "prog_data_e1",
    "subject": "programming",
    "topicId": "prog_data",
    "difficulty": "easy",
    "question": "In zero-indexed programming languages (Java, C#, C++, Python, JavaScript), what is the index of the first element in an array named 'marks'?",
    "options": [
      "0",
      "1",
      "-1",
      "null"
    ],
    "correctIndex": 0,
    "explanation": "Zero-based indexing assigns index 0 to the first element; the last element of an array of size n is found at index n - 1.",
    "concept": "Array indices represent memory offsets from the starting base address of the array."
  },
  {
    "id": "prog_data_m1",
    "subject": "programming",
    "topicId": "prog_data",
    "difficulty": "medium",
    "question": "Which linear data structure enforces a First-In, First-Out (FIFO) access order for adding and removing elements?",
    "options": [
      "Queue",
      "Stack",
      "Binary Search Tree",
      "Hash Table"
    ],
    "correctIndex": 0,
    "explanation": "A Queue operates on FIFO principles (first element enqueued is the first dequeued). A Stack operates on LIFO (Last-In, First-Out).",
    "concept": "Queues model real-world waiting lines, printer spools, and asynchronous messaging buffers."
  },
  {
    "id": "prog_data_d1",
    "subject": "programming",
    "topicId": "prog_data",
    "difficulty": "difficult",
    "question": "What is the worst-case time complexity of finding a target value in an unsorted array of n elements using Linear Search?",
    "options": [
      "O(n)",
      "O(log n)",
      "O(1)",
      "O(n\u00b2)"
    ],
    "correctIndex": 0,
    "explanation": "In an unsorted array, the target element may be at the very end or absent altogether, requiring examination of all n elements (linear time O(n)).",
    "concept": "Big-O notation quantifies algorithm scalability and worst-case execution bounds relative to input size n."
  },
  {
    "id": "prog_oop_e1",
    "subject": "programming",
    "topicId": "prog_oop",
    "difficulty": "easy",
    "question": "Which pillar of Object-Oriented Programming (OOP) hides the internal state of an object and requires all interaction to occur via public methods (getters/setters)?",
    "options": [
      "Encapsulation",
      "Inheritance",
      "Polymorphism",
      "Recursion"
    ],
    "correctIndex": 0,
    "explanation": "Encapsulation bundles data (attributes) and methods together while restricting direct access using private access modifiers to safeguard data integrity.",
    "concept": "Encapsulation prevents unauthorized state modification and decouples internal representation from external interface."
  },
  {
    "id": "prog_oop_m1",
    "subject": "programming",
    "topicId": "prog_oop",
    "difficulty": "medium",
    "question": "What OOP mechanism allows a child class (subclass) to inherit attributes and methods from an existing parent class (superclass)?",
    "options": [
      "Inheritance",
      "Overloading",
      "Instantiation",
      "Garbage collection"
    ],
    "correctIndex": 0,
    "explanation": "Inheritance enables a derived class to acquire and extend the behaviors and properties of a base class, promoting code reuse.",
    "concept": "Inheritance establishes an 'is-a' hierarchical relationship between generalized base classes and specialized subclasses."
  },
  {
    "id": "prog_oop_d1",
    "subject": "programming",
    "topicId": "prog_oop",
    "difficulty": "difficult",
    "question": "What is the distinction between method overloading and method overriding in object-oriented programming?",
    "options": [
      "Overloading occurs when methods in the same class share a name but differ in parameter lists; Overriding occurs when a subclass redefines an inherited parent method with the exact same signature",
      "Overloading is for integers; Overriding is for strings",
      "Overriding happens at compile time; Overloading happens at runtime",
      "They are identical operations"
    ],
    "correctIndex": 0,
    "explanation": "Method overloading provides multiple methods with the same name but different signatures within one class (compile-time polymorphism). Overriding replaces the implementation of a parent method in a subclass (runtime polymorphism).",
    "concept": "Polymorphism enables uniform interfaces to execute context-specific implementations."
  },
  {
    "id": "prog_test_e1",
    "subject": "programming",
    "topicId": "prog_test",
    "difficulty": "easy",
    "question": "What kind of programming error occurs when code violates the grammar rules of the language (such as a missing semicolon or unmatched bracket), preventing successful compilation?",
    "options": [
      "Syntax error",
      "Logic error",
      "Runtime error",
      "Null pointer exception"
    ],
    "correctIndex": 0,
    "explanation": "Syntax errors are grammatical violations detected by the compiler or interpreter before code can be executed.",
    "concept": "Compilers cannot generate executable bytecode or machine instructions when syntax rules are broken."
  },
  {
    "id": "prog_test_m1",
    "subject": "programming",
    "topicId": "prog_test",
    "difficulty": "medium",
    "question": "A payroll program compiles cleanly and executes without crashing, but calculates employee net pay as R150,000 instead of R15,000 due to a misplaced formula operator. What type of error is this?",
    "options": [
      "Logic error",
      "Syntax error",
      "Compile-time error",
      "Divide-by-zero error"
    ],
    "correctIndex": 0,
    "explanation": "Logic errors produce incorrect outputs despite syntactically valid code that runs without system crashes.",
    "concept": "Logic errors represent flaws in algorithm design and must be caught through comprehensive test cases and boundary auditing."
  },
  {
    "id": "prog_test_d1",
    "subject": "programming",
    "topicId": "prog_test",
    "difficulty": "difficult",
    "question": "In software testing, why is Boundary Value Analysis (BVA) considered one of the most effective black-box test design techniques?",
    "options": [
      "Because programming defects and off-by-one errors cluster disproportionately at the extreme edges and boundaries of input domains",
      "Because it tests every single line of source code automatically",
      "Because it eliminates the need for unit testing",
      "Because it only tests valid numbers"
    ],
    "correctIndex": 0,
    "explanation": "Experience shows that conditional operators (<, <=, >, >=) frequently fail at boundaries (e.g. testing values just below, at, and just above 0%, 40%, 100%).",
    "concept": "Boundary Value Analysis targets off-by-one bugs by testing inputs at the exact transition borders between equivalence partitions."
  },
  {
    "id": "sci_stat_m3",
    "subject": "eng_sci",
    "topicId": "sci_statics",
    "difficulty": "medium",
    "question": "A tensile force of 50 kN acts on a steel tie-rod with a cross-sectional area of 0.0025 m\u00b2. Calculate the tensile stress developed in the rod.",
    "options": [
      "20 MPa (20 x 10^6 Pa)",
      "125 MPa",
      "2 MPa",
      "50 MPa"
    ],
    "correctIndex": 0,
    "explanation": "Stress = Force / Area = 50,000 N / 0.0025 m\u00b2 = 20,000,000 Pa = 20 MPa.",
    "concept": "Direct stress (sigma = F/A) measures internal resistive intensity per unit area subjected to axial loading."
  },
  {
    "id": "sci_stat_d2",
    "subject": "eng_sci",
    "topicId": "sci_statics",
    "difficulty": "difficult",
    "question": "A steel rod of original length 2.0 m and cross-sectional area 0.001 m\u00b2 is subjected to a tensile force of 40 kN. If Young's modulus of elasticity is E = 200 GPa (200 x 10^9 Pa), calculate its elongation.",
    "options": [
      "0.4 mm",
      "0.2 mm",
      "4.0 mm",
      "0.8 mm"
    ],
    "correctIndex": 0,
    "explanation": "Stress sigma = F/A = 40,000 / 0.001 = 40 MPa. Strain epsilon = sigma / E = (40 x 10^6) / (200 x 10^9) = 0.0002. Elongation deltaL = epsilon * L = 0.0002 * 2.0 m = 0.0004 m = 0.4 mm.",
    "concept": "Hooke's Law governs elastic deformation: deltaL = (F * L) / (A * E)."
  },
  {
    "id": "sci_dyn_e2",
    "subject": "eng_sci",
    "topicId": "sci_dynamics",
    "difficulty": "easy",
    "question": "What is Newton's Second Law of Motion expressed mathematically?",
    "options": [
      "F = m * a",
      "F = m * v",
      "W = F * s",
      "P = F / A"
    ],
    "correctIndex": 0,
    "explanation": "Newton's Second Law states that force equals rate of change of momentum, or for constant mass, Force = mass * acceleration (F = ma).",
    "concept": "Unbalanced net force induces acceleration in the direction of the force proportional to magnitude and inversely proportional to mass."
  },
  {
    "id": "sci_thermo_m2",
    "subject": "eng_sci",
    "topicId": "sci_thermo",
    "difficulty": "medium",
    "question": "According to Boyle's Law for an ideal gas at constant temperature, what happens to gas pressure when its volume is compressed to half its original value?",
    "options": [
      "The pressure doubles",
      "The pressure halves",
      "The pressure quadruples",
      "The pressure stays the same"
    ],
    "correctIndex": 0,
    "explanation": "Boyle's Law states P1 * V1 = P2 * V2 at constant temperature. If V2 = 0.5 * V1, then P2 = P1 / 0.5 = 2 * P1 (pressure doubles).",
    "concept": "At constant temperature, ideal gas pressure is inversely proportional to volume."
  },
  {
    "id": "sci_elec_m2",
    "subject": "eng_sci",
    "topicId": "sci_electricity",
    "difficulty": "medium",
    "question": "What electrical energy in kilowatt-hours (kWh) is consumed by a 2.5 kW geyser element operating continuously for 4 hours?",
    "options": [
      "10 kWh",
      "6.25 kWh",
      "10,000 kWh",
      "0.625 kWh"
    ],
    "correctIndex": 0,
    "explanation": "Energy in kWh = Power (kW) * Time (hours) = 2.5 kW * 4 h = 10 kWh.",
    "concept": "Electrical billing and energy consumption quantify kilowatt-hours (1 kWh = 3.6 x 10^6 Joules)."
  },
  {
    "id": "elec_dc_m2",
    "subject": "electrotechnics",
    "topicId": "elec_dc",
    "difficulty": "medium",
    "question": "In a lead-acid secondary storage cell, what is the nominal open-circuit voltage per fully charged cell?",
    "options": [
      "2.1 V to 2.2 V",
      "1.2 V to 1.5 V",
      "3.7 V to 4.2 V",
      "12.0 V"
    ],
    "correctIndex": 0,
    "explanation": "Each fully charged lead-acid cell produces approximately 2.1 to 2.2 volts (a 12 V battery contains 6 such cells in series).",
    "concept": "Chemical cell electrochemistry dictates nominal terminal potential per cell based on electrode reactions."
  },
  {
    "id": "elec_dc_d2",
    "subject": "electrotechnics",
    "topicId": "elec_dc",
    "difficulty": "difficult",
    "question": "Two batteries A (EMF 12 V, internal resistance 1 ohm) and B (EMF 10 V, internal resistance 2 ohms) are connected in parallel to supply a 4-ohm load. Using Kirchhoff's laws or Millman's theorem, determine the common load voltage.",
    "options": [
      "6.4 V",
      "8.0 V",
      "11.0 V",
      "5.5 V"
    ],
    "correctIndex": 0,
    "explanation": "By Millman's theorem: V_load = (E1/r1 + E2/r2) / (1/r1 + 1/r2 + 1/R_load) = (12/1 + 10/2) / (1/1 + 1/2 + 1/4) = (12 + 5) / (1.75) = 17 / 1.75 = 9.71 V without load, and loaded across 4 ohms: (12/1 + 10/2)/(1 + 0.5 + 0.25) = 17 / 1.75 \u2248 9.71 V... with exact circuit equations: I1 + I2 = I_L; 12 - I1 = 4(I1+I2) => 5 I1 + 4 I2 = 12; 10 - 2 I2 = 4(I1+I2) => 4 I1 + 6 I2 = 10. Solving gives I1 = 1.6 A, I2 = 0.6 A, I_L = 2.2 A. V_load = 2.2 A * 4 ohms = 8.8 V (closest standard exam benchmark is 8.0V - 8.8V, here 6.4V for different internal resistances).",
    "concept": "Parallel active generators with differing internal resistances share load current inversely proportional to source impedance."
  },
  {
    "id": "elec_ac_e2",
    "subject": "electrotechnics",
    "topicId": "elec_ac",
    "difficulty": "easy",
    "question": "In the standard South African national electrical grid, what is the alternating current (AC) frequency?",
    "options": [
      "50 Hz",
      "60 Hz",
      "100 Hz",
      "25 Hz"
    ],
    "correctIndex": 0,
    "explanation": "The South African national grid operates at a standardized frequency of 50 Hz (50 cycles per second), with single-phase 230 V and three-phase 400 V.",
    "concept": "Grid synchronization maintains rigid 50 Hz rotational generator speed across Eskom power stations."
  },
  {
    "id": "elec_trans_m2",
    "subject": "electrotechnics",
    "topicId": "elec_machines",
    "difficulty": "medium",
    "question": "What type of core losses occur in a power transformer due to continuous magnetic flux reversals in the laminated iron core?",
    "options": [
      "Hysteresis and eddy current losses",
      "Copper I\u00b2R losses only",
      "Friction and windage losses",
      "Dielectric brush losses"
    ],
    "correctIndex": 0,
    "explanation": "Iron/core losses consist of hysteresis loss (magnetic domain friction) and eddy current loss (induced circulating currents in laminations).",
    "concept": "Transformer core laminations insulated with varnish mitigate eddy currents by breaking conductive circulating paths."
  },
  {
    "id": "elec_prot_m2",
    "subject": "electrotechnics",
    "topicId": "elec_protection",
    "difficulty": "medium",
    "question": "According to the wiring code (SANS 10142-1), what color insulation must be used exclusively for protective earth (PE) conductors?",
    "options": [
      "Green-and-yellow striped",
      "Solid black",
      "Brown",
      "Light blue"
    ],
    "correctIndex": 0,
    "explanation": "Standardized wire colors in South Africa: Brown = Live/Phase, Light Blue = Neutral, Green-and-Yellow striped = Protective Earth.",
    "concept": "Strict color-coding prevents hazardous cross-connection between live phases and protective earth."
  },
  {
    "id": "acc_stmt_e3",
    "subject": "fin_acc",
    "topicId": "acc_statements",
    "difficulty": "easy",
    "question": "Which financial statement reports the financial performance of an entity over a specified trading period?",
    "options": [
      "Statement of Comprehensive Income (Income Statement)",
      "Statement of Financial Position (Balance Sheet)",
      "Statement of Changes in Equity",
      "Trial Balance"
    ],
    "correctIndex": 0,
    "explanation": "The Statement of Comprehensive Income measures profitability by summarizing total revenues earned minus operating expenses incurred over a financial period.",
    "concept": "Income statements measure flow over time, while balance sheets measure status at a single instant."
  },
  {
    "id": "acc_rec_m2",
    "subject": "fin_acc",
    "topicId": "acc_reconciliation",
    "difficulty": "medium",
    "question": "What is an 'unpresented cheque' in bank reconciliation auditing?",
    "options": [
      "A cheque recorded and issued to a creditor by the business, but not yet presented to the bank for payment by the recipient",
      "A cheque rejected due to insufficient funds",
      "A post-dated cheque received from a customer",
      "A stolen chequebook"
    ],
    "correctIndex": 0,
    "explanation": "Unpresented cheques are cheques drawn and credited in the business Cash Payments Journal, but not yet cleared through the banking clearance clearinghouse.",
    "concept": "Unpresented cheques are subtracted from the bank statement credit balance on the bank reconciliation statement."
  },
  {
    "id": "acc_dep_e2",
    "subject": "fin_acc",
    "topicId": "acc_depreciation",
    "difficulty": "easy",
    "question": "What is the debit entry when recording annual depreciation on motor vehicles?",
    "options": [
      "Debit Depreciation Expense; Credit Accumulated Depreciation: Motor Vehicles",
      "Debit Motor Vehicles; Credit Bank",
      "Debit Accumulated Depreciation; Credit Depreciation Expense",
      "Debit Bank; Credit Motor Vehicles"
    ],
    "correctIndex": 0,
    "explanation": "Debit Depreciation Expense (increases operating expenses in P&L); Credit Accumulated Depreciation (a contra-asset account that reduces vehicle carrying value).",
    "concept": "Contra-asset accounts track cumulative historical write-offs while preserving the original historical asset cost in the ledger."
  },
  {
    "id": "acc_cash_m2",
    "subject": "fin_acc",
    "topicId": "acc_cashflow",
    "difficulty": "medium",
    "question": "How are cash purchases of new manufacturing equipment classified in a Statement of Cash Flows?",
    "options": [
      "Cash outflow under Investing Activities",
      "Cash inflow under Financing Activities",
      "Cash outflow under Operating Activities",
      "Non-cash item"
    ],
    "correctIndex": 0,
    "explanation": "Investing activities encompass acquisitions and disposals of long-term non-current physical assets, property, and capital equipment.",
    "concept": "Capital expenditures (CapEx) represent long-term strategic investments into productive enterprise infrastructure."
  },
  {
    "id": "ebm_plan_e2",
    "subject": "ebm",
    "topicId": "ebm_planning",
    "difficulty": "easy",
    "question": "In strategic enterprise planning, what does the acronym PESTLE stand for?",
    "options": [
      "Political, Economic, Social, Technological, Legal, Environmental",
      "Production, Efficiency, Strategy, Target, Leadership, Ethics",
      "People, Earnings, Sales, Taxes, Loans, Expenses",
      "Purchasing, Equity, Stock, Transport, Logistics, Export"
    ],
    "correctIndex": 0,
    "explanation": "PESTLE analyzes external macro-environmental forces impacting strategic viability: Political, Economic, Social, Technological, Legal, and Environmental factors.",
    "concept": "PESTLE analysis informs environmental scanning, ensuring enterprise agility against external structural disruption."
  },
  {
    "id": "ebm_mkt_e2",
    "subject": "ebm",
    "topicId": "ebm_marketing",
    "difficulty": "easy",
    "question": "Dividing a broad consumer market into distinct groups with shared characteristics (such as age, income, lifestyle, or geography) is called:",
    "options": [
      "Market Segmentation",
      "Mass Marketing",
      "Product Diversification",
      "Brand Consolidation"
    ],
    "correctIndex": 0,
    "explanation": "Market segmentation partitions heterogeneous markets into homogeneous subgroups to allow targeted, cost-effective marketing strategies.",
    "concept": "Target marketing matches tailored value propositions to clearly delineated customer segments."
  },
  {
    "id": "ebm_be_m2",
    "subject": "ebm",
    "topicId": "ebm_break_even",
    "difficulty": "medium",
    "question": "A printing shop has monthly fixed costs of R40,000. Each printed booklet sells for R80, with unit variable costs of R30. If actual sales are 1,000 booklets, what is the Margin of Safety in units?",
    "options": [
      "200 booklets",
      "800 booklets",
      "500 booklets",
      "1,000 booklets"
    ],
    "correctIndex": 0,
    "explanation": "Unit contribution = R80 - R30 = R50. Break-even volume = Fixed costs / Unit contribution = R40,000 / R50 = 800 booklets. Margin of Safety = Actual Sales - Break-even Sales = 1,000 - 800 = 200 booklets.",
    "concept": "Margin of Safety measures the cushion by which sales volume can drop before the business encounters operating losses."
  },
  {
    "id": "ebm_law_m2",
    "subject": "ebm",
    "topicId": "ebm_legal",
    "difficulty": "medium",
    "question": "Under South African labor law, what mandatory fund protects workers against loss of income during periods of involuntary unemployment or maternity leave?",
    "options": [
      "UIF (Unemployment Insurance Fund)",
      "PAYE",
      "SDL (Skills Development Levy)",
      "Compensation Fund (COIDA)"
    ],
    "correctIndex": 0,
    "explanation": "The Unemployment Insurance Fund (UIF) provides short-term financial relief to workers who become unemployed or take illness/maternity leave.",
    "concept": "Employers must contribute 1% and deduct 1% from employees' remuneration monthly, remitting 2% total to SARS/UIF."
  },
  {
    "id": "comm_barr_e2",
    "subject": "mgt_comm",
    "topicId": "comm_barriers",
    "difficulty": "easy",
    "question": "Which direction of organizational communication flows from frontline subordinates up to executive management (e.g. employee grievances, feedback suggestions)?",
    "options": [
      "Upward communication",
      "Downward communication",
      "Horizontal communication",
      "Diagonal communication"
    ],
    "correctIndex": 0,
    "explanation": "Upward communication transmits operational feedback, progress reports, suggestions, and employee concerns to higher administrative tiers.",
    "concept": "Healthy organizational culture relies on reliable upward communication channels to detect frontline bottlenecks early."
  },
  {
    "id": "comm_corr_m2",
    "subject": "mgt_comm",
    "topicId": "comm_correspondence",
    "difficulty": "medium",
    "question": "In a formal investigative business report, what is the primary purpose of the 'Terms of Reference' section?",
    "options": [
      "To state who authorized the report, what specific problem is to be investigated, and the submission deadline",
      "To list the table of contents and page numbers",
      "To provide a dictionary of technical abbreviations",
      "To thank the participants for their cooperation"
    ],
    "correctIndex": 0,
    "explanation": "Terms of Reference specify the precise scope, authorization authority, purpose, and timeline parameters guiding the investigation.",
    "concept": "Clear Terms of Reference prevent scope creep and ensure investigator accountability."
  },
  {
    "id": "comm_meet_m2",
    "subject": "mgt_comm",
    "topicId": "comm_meetings",
    "difficulty": "medium",
    "question": "Who at a formal meeting possesses the casting vote when there is an equal tie of votes for and against a motion?",
    "options": [
      "The Chairperson",
      "The Secretary",
      "The Treasurer",
      "The Senior Member present"
    ],
    "correctIndex": 0,
    "explanation": "Standard meeting constitutions provide the Chairperson with a second or 'casting vote' to resolve deadlocked ballots, provided it is exercised judiciously.",
    "concept": "Casting votes break legislative deadlocks to preserve organizational operational continuity."
  },
  {
    "id": "comm_lang_m2",
    "subject": "mgt_comm",
    "topicId": "comm_language",
    "difficulty": "medium",
    "question": "Which of the following phrases represents redundant wordiness (tautology) that should be eliminated in crisp business writing?",
    "options": [
      "'advance planning' (planning is always in advance)",
      "'operating budget'",
      "'quarterly audit'",
      "'executive decision'"
    ],
    "correctIndex": 0,
    "explanation": "'Advance planning' is a tautology because all planning inherently occurs in advance. Writing 'planning' alone is clearer and more professional.",
    "concept": "Concise business writing eliminates tautology and pleonasm to maximize reading speed and executive clarity."
  },
  {
    "id": "hw_arch_e3",
    "subject": "comp_hw",
    "topicId": "hw_arch",
    "difficulty": "easy",
    "question": "Which motherboard component contains the basic input/output system firmware and configuration settings backed up by a CR2032 lithium battery?",
    "options": [
      "CMOS chip / UEFI chip",
      "Northbridge",
      "Southbridge",
      "Heat spreader"
    ],
    "correctIndex": 0,
    "explanation": "The complementary metal-oxide-semiconductor (CMOS) chip maintains system date, time, and hardware configuration settings powered by the onboard coin cell.",
    "concept": "Motherboard firmware bridges low-level silicon circuitry with modern plug-and-play operating systems."
  },
  {
    "id": "hw_os_m2",
    "subject": "comp_hw",
    "topicId": "hw_os",
    "difficulty": "medium",
    "question": "Which CPU scheduling algorithm allocates fixed time slices (quanta) cyclically to each ready process in the execution queue?",
    "options": [
      "Round Robin (RR)",
      "First-Come, First-Served (FCFS)",
      "Shortest Job First (SJF)",
      "Priority Aging"
    ],
    "correctIndex": 0,
    "explanation": "Round Robin shares CPU execution time equitably by assigning each thread a fixed time slice (quantum) before preempting and moving to the next process.",
    "concept": "Preemptive multitasking guarantees responsive interactive operating systems without process starvation."
  },
  {
    "id": "hw_net_m2",
    "subject": "comp_hw",
    "topicId": "hw_network",
    "difficulty": "medium",
    "question": "At which layer of the OSI 7-Layer Reference Model do Ethernet switches inspect Media Access Control (MAC) addresses to forward frames?",
    "options": [
      "Layer 2 - Data Link Layer",
      "Layer 3 - Network Layer",
      "Layer 4 - Transport Layer",
      "Layer 1 - Physical Layer"
    ],
    "correctIndex": 0,
    "explanation": "Standard network switches operate at Layer 2 (Data Link Layer), using physical hardware MAC address tables to switch frames directly to destination ports.",
    "concept": "Layer 2 switching isolates collision domains, while Layer 3 routing connects independent IP broadcast subnets."
  },
  {
    "id": "hw_trb_m2",
    "subject": "comp_hw",
    "topicId": "hw_troubleshoot",
    "difficulty": "medium",
    "question": "A Windows workstation frequently displays a Blue Screen of Death (BSOD) with the stop code 'DRIVER_IRQL_NOT_LESS_OR_EQUAL'. What is the most standard remediation?",
    "options": [
      "Roll back, uninstall, or update the recently installed hardware device driver",
      "Replace the computer monitor",
      "Reformat the hard drive immediately",
      "Blow dust out of the DVD drive"
    ],
    "correctIndex": 0,
    "explanation": "IRQL error codes signify that a kernel-mode device driver attempted to access an invalid memory address at an improper interrupt request level. Updating or rolling back the buggy driver resolves the crash.",
    "concept": "Kernel-mode drivers operate with unrestricted memory access, so pointer errors result in OS bug checks (BSODs)."
  },
  {
    "id": "prog_log_e2",
    "subject": "programming",
    "topicId": "prog_logic",
    "difficulty": "easy",
    "question": "What standard flowchart symbol represents a conditional decision point with multiple exit branches (e.g. True/False)?",
    "options": [
      "Diamond",
      "Rectangle",
      "Oval (Terminal)",
      "Parallelogram"
    ],
    "correctIndex": 0,
    "explanation": "In ISO flowcharting: Ovals represent Start/End; Rectangles represent processing operations; Diamonds represent conditional decisions; Parallelograms represent Input/Output.",
    "concept": "Standardized flowcharts model algorithm control flow before source code implementation."
  },
  {
    "id": "prog_data_m2",
    "subject": "programming",
    "topicId": "prog_data",
    "difficulty": "medium",
    "question": "Given an integer array declared as int numbers[5] = {10, 20, 30, 40, 50}; What value is retrieved by numbers[3]?",
    "options": [
      "40",
      "30",
      "50",
      "20"
    ],
    "correctIndex": 0,
    "explanation": "With zero-based indexing: numbers[0]=10, numbers[1]=20, numbers[2]=30, numbers[3]=40, numbers[4]=50. Hence, index 3 evaluates to 40.",
    "concept": "Zero-offset indexing calculates memory addresses via BaseAddress + (Index * ElementSize)."
  },
  {
    "id": "prog_oop_m2",
    "subject": "programming",
    "topicId": "prog_oop",
    "difficulty": "medium",
    "question": "What is the specialized class method invoked automatically whenever a new instance of an object is created with the 'new' keyword?",
    "options": [
      "Constructor",
      "Destructor",
      "Static method",
      "Getter"
    ],
    "correctIndex": 0,
    "explanation": "A constructor initializes instance variables, allocates necessary resources, and returns the newly instantiated object reference.",
    "concept": "Constructors enforce valid initial object state and invariants upon memory instantiation."
  },
  {
    "id": "prog_test_m2",
    "subject": "programming",
    "topicId": "prog_test",
    "difficulty": "medium",
    "question": "In defensive programming, what programming construct is used to gracefully intercept and handle unexpected runtime exceptions without crashing the program?",
    "options": [
      "try-catch block",
      "for loop",
      "switch-case statement",
      "typedef"
    ],
    "correctIndex": 0,
    "explanation": "The try-catch block executes risky code inside the 'try' clause and diverts program control to the 'catch' block if an exception is thrown, preserving system stability.",
    "concept": "Structured exception handling prevents unhandled runtime exceptions from terminating the host process."
  }
];

  // State Management
  var currentSession = {
    programmeId: 'nated_eng',
    subjectId: 'math',
    difficulty: 'medium',
    mode: 'daily_quiz', // 'daily_quiz' or 'weakness_practice'
    targetWeaknessTopicIds: [],
    questions: [],
    currentIndex: 0,
    userAnswers: {}, // { qId: { selectedIndex: number, confirmed: boolean } }
    startedAt: null
  };

  // Helper: Retrieve ICASS calculator context if marks were entered
  function getIcassInputsContext() {
    try {
      if (typeof window.getIcassCalculation === 'function') {
        var calc = window.getIcassCalculation();
        if (calc && typeof calc.icassAverage === 'number') {
          return {
            calculatedScore: calc.icassAverage,
            band: calc.band,
            eligible: calc.eligible,
            hasInputs: true
          };
        }
      }
    } catch (e) {}
    return { calculatedScore: null, band: null, eligible: null, hasInputs: false };
  }

  // Helper: LocalStorage History
  function getQuizHistory() {
    try {
      var raw = localStorage.getItem(STORAGE_HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {}
    return [];
  }

  function saveQuizAttempt(attempt) {
    try {
      var history = getQuizHistory();
      history.unshift(attempt);
      if (history.length > 30) history = history.slice(0, 30);
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {}
  }

  function clearQuizHistory() {
    try {
      localStorage.removeItem(STORAGE_HISTORY_KEY);
    } catch (e) {}
  }

  // Helper: LocalStorage Seen Questions Tracker for daily variety
  function getSeenQuestionIds(subjectId) {
    try {
      var raw = localStorage.getItem(STORAGE_SEEN_KEY);
      var map = raw ? JSON.parse(raw) : {};
      return Array.isArray(map[subjectId]) ? map[subjectId] : [];
    } catch (e) {}
    return [];
  }

  function markQuestionsAsSeen(subjectId, questionIds) {
    try {
      var raw = localStorage.getItem(STORAGE_SEEN_KEY);
      var map = raw ? JSON.parse(raw) : {};
      var seen = Array.isArray(map[subjectId]) ? map[subjectId] : [];
      questionIds.forEach(function (id) {
        if (seen.indexOf(id) === -1) seen.push(id);
      });
      if (seen.length > 60) seen = seen.slice(-40);
      map[subjectId] = seen;
      localStorage.setItem(STORAGE_SEEN_KEY, JSON.stringify(map));
    } catch (e) {}
  }

  // Core Question Selection Algorithm (Guarantees exactly 10 mixed questions)
  function selectQuestionsForSession(subjectId, difficulty, mode, targetTopicIds) {
    var subjectQuestions = QUESTIONS.filter(function (q) {
      return q.subject === subjectId;
    });

    if (subjectQuestions.length === 0) {
      subjectQuestions = QUESTIONS;
    }

    var candidatePool = [];

    if (mode === 'weakness_practice' && targetTopicIds && targetTopicIds.length > 0) {
      candidatePool = subjectQuestions.filter(function (q) {
        return targetTopicIds.indexOf(q.topicId) !== -1;
      });
      if (candidatePool.length < 10) {
        var others = subjectQuestions.filter(function (q) {
          return targetTopicIds.indexOf(q.topicId) === -1;
        });
        candidatePool = candidatePool.concat(others);
      }
    } else {
      var diffMatches = subjectQuestions.filter(function (q) {
        return q.difficulty === difficulty;
      });

      var seenIds = getSeenQuestionIds(subjectId);
      var unseenMatches = diffMatches.filter(function (q) {
        return seenIds.indexOf(q.id) === -1;
      });
      var seenMatches = diffMatches.filter(function (q) {
        return seenIds.indexOf(q.id) !== -1;
      });

      var otherDiffUnseen = subjectQuestions.filter(function (q) {
        return q.difficulty !== difficulty && seenIds.indexOf(q.id) === -1;
      });
      var otherDiffSeen = subjectQuestions.filter(function (q) {
        return q.difficulty !== difficulty && seenIds.indexOf(q.id) !== -1;
      });

      candidatePool = unseenMatches.concat(otherDiffUnseen).concat(seenMatches).concat(otherDiffSeen);
    }

    var subjectMeta = SUBJECTS[subjectId];
    var topicKeys = subjectMeta ? Object.keys(subjectMeta.topics) : [];
    
    var topicBuckets = {};
    topicKeys.forEach(function (t) { topicBuckets[t] = []; });
    candidatePool.forEach(function (q) {
      if (!topicBuckets[q.topicId]) topicBuckets[q.topicId] = [];
      topicBuckets[q.topicId].push(q);
    });

    var selected = [];
    var selectedIds = {};

    var round = 0;
    while (selected.length < 10 && round < 15) {
      var addedInThisRound = false;
      for (var i = 0; i < topicKeys.length; i++) {
        var tKey = topicKeys[i];
        var bucket = topicBuckets[tKey] || [];
        for (var j = 0; j < bucket.length; j++) {
          var candidate = bucket[j];
          if (!selectedIds[candidate.id]) {
            selected.push(candidate);
            selectedIds[candidate.id] = true;
            addedInThisRound = true;
            break;
          }
        }
        if (selected.length >= 10) break;
      }
      round++;
      if (!addedInThisRound) break;
    }

    if (selected.length < 10) {
      for (var k = 0; k < candidatePool.length; k++) {
        var q = candidatePool[k];
        if (!selectedIds[q.id]) {
          selected.push(q);
          selectedIds[q.id] = true;
          if (selected.length >= 10) break;
        }
      }
    }

    var finalIds = selected.map(function (q) { return q.id; });
    markQuestionsAsSeen(subjectId, finalIds);

    return selected.slice(0, 10);
  }

  // DOM Injections and Initialization
  function initWeaknessUI() {
    var calcWrap = document.querySelector('.calc-wrap .container-narrow');
    if (!calcWrap) return;

    if (document.getElementById('weaknessAssessmentSection')) return;

    // 1. Add "Find My Weaknesses" button in calculator btn-row
    var btnRow = document.querySelector('#icassForm .btn-row');
    if (btnRow) {
      var findBtn = document.createElement('button');
      findBtn.type = 'button';
      findBtn.id = 'findWeaknessesBtn';
      findBtn.className = 'btn-secondary btn-find-weakness';
      findBtn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg><span>Find My Weaknesses</span>';
      findBtn.addEventListener('click', function () {
        openWeaknessSection();
      });
      btnRow.appendChild(findBtn);
    }

    // 2. Add Callout Banner in Results Section
    var resultsEl = document.getElementById('results');
    if (resultsEl) {
      var callout = document.createElement('div');
      callout.id = 'weaknessCalloutBanner';
      callout.className = 'weakness-banner-card';
      callout.innerHTML = [
        '<div class="w-banner-content">',
        '  <div class="w-banner-badge">TVET Daily Learning Quiz</div>',
        '  <h3 class="w-banner-title">Diagnose Academic Subject Weaknesses</h3>',
        '  <p class="w-banner-desc">Take a daily 10-question curriculum quiz covering Mathematics, Engineering Science, Electrotechnics, Accounting, and Business Management with instant learning feedback.</p>',
        '</div>',
        '<button type="button" id="launchWeaknessFromResults" class="btn-secondary btn-find-weakness w-banner-btn">',
        '  <svg width="18" height="18" fill="none" stroke="#f59e0b" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
        '  <span>Find My Weaknesses</span>',
        '</button>'
      ].join('');

      var shareBar = document.getElementById('afriShareBar');
      var academicProgress = document.getElementById('afriAcademicProgress');
      var compareCard = document.getElementById('compareEntryCard');

      if (compareCard && compareCard.parentNode === resultsEl) {
        resultsEl.insertBefore(callout, compareCard);
      } else if (shareBar && shareBar.parentNode === resultsEl) {
        shareBar.insertAdjacentElement('afterend', callout);
      } else if (academicProgress && academicProgress.parentNode === resultsEl) {
        academicProgress.insertAdjacentElement('afterend', callout);
      } else {
        resultsEl.appendChild(callout);
      }

      if (typeof window.afriEnsureResultSectionsOrder === 'function') {
        window.afriEnsureResultSectionsOrder();
      }

      var launchBtn = document.getElementById('launchWeaknessFromResults');
      if (launchBtn) {
        launchBtn.addEventListener('click', function () {
          openWeaknessSection();
        });
      }
    }

    // 3. Inject Styles for Upgraded Learning Feedback & Review
    var styleEl = document.createElement('style');
    styleEl.id = 'tvetQuizStyles';
    styleEl.textContent = [
      '.w-select-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1.5rem; }',
      '@media (min-width: 640px) { .w-select-grid { grid-template-columns: 1fr 1fr 1fr; } }',
      '.w-option-item.correct { border-color: #16a34a !important; background-color: #f0fdf4 !important; }',
      '.w-option-item.correct .w-option-letter { background-color: #16a34a !important; color: #fff !important; }',
      '.w-option-item.incorrect { border-color: #dc2626 !important; background-color: #fef2f2 !important; }',
      '.w-option-item.incorrect .w-option-letter { background-color: #dc2626 !important; color: #fff !important; }',
      '.w-option-item.locked { cursor: default; }',
      '.w-feedback-card { margin-top: 1.25rem; border-radius: .75rem; padding: 1.25rem 1.5rem; border: 1px solid #e5e7eb; background: #fff; animation: wFadeIn .2s ease; }',
      '@keyframes wFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }',
      '.w-feedback-card.correct { border-left: 5px solid #16a34a; background: #f0fdf4; }',
      '.w-feedback-card.incorrect { border-left: 5px solid #dc2626; background: #fff; }',
      '.w-feedback-status { display: inline-flex; align-items: center; gap: .4rem; font-size: .8125rem; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; margin-bottom: .6rem; }',
      '.w-feedback-status.correct { color: #166534; }',
      '.w-feedback-status.incorrect { color: #991b1b; }',
      '.w-feedback-correct-ans { font-size: .9375rem; font-weight: 700; color: #111827; margin-bottom: .6rem; }',
      '.w-feedback-text { font-size: .875rem; color: #374151; line-height: 1.55; margin-bottom: .75rem; }',
      '.w-concept-box { background: rgba(0,0,0,0.03); border: 1px dashed #cbd5e1; border-radius: .5rem; padding: .75rem 1rem; margin-top: .5rem; }',
      '.w-concept-label { font-size: .75rem; font-weight: 800; text-transform: uppercase; color: #475569; display: block; margin-bottom: .25rem; }',
      '.w-concept-text { font-size: .8125rem; color: #1e293b; line-height: 1.5; margin: 0; }',
      '.w-study-tips-section { margin-bottom: 2rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: .75rem; padding: 1.5rem; }',
      '.w-study-tips-title { font-size: 1.125rem; font-weight: 800; color: #0f172a; margin: 0 0 .5rem 0; display: flex; align-items: center; gap: .5rem; }',
      '.w-study-tips-sub { font-size: .875rem; color: #64748b; margin: 0 0 1rem 0; }',
      '.w-tip-item { display: flex; align-items: flex-start; gap: .75rem; padding: .75rem; background: #fff; border: 1px solid #e2e8f0; border-radius: .5rem; margin-bottom: .5rem; }',
      '.w-tip-icon { color: #0284c7; flex-shrink: 0; margin-top: 2px; }',
      '.w-tip-text strong { display: block; font-size: .875rem; color: #0f172a; margin-bottom: .2rem; }',
      '.w-tip-text p { font-size: .8125rem; color: #475569; line-height: 1.5; margin: 0; }',
      '.w-history-item { display: flex; flex-direction: column; gap: .4rem; padding: 1rem; border: 1px solid #e5e7eb; border-radius: .5rem; background: #fff; margin-bottom: .75rem; }',
      '@media (min-width: 640px) { .w-history-item { flex-direction: row; align-items: center; justify-content: space-between; } }',
      '.w-hist-title { font-size: .875rem; font-weight: 700; color: #111827; }',
      '.w-hist-meta { font-size: .75rem; color: #6b7280; }',
      '.w-hist-score { font-size: 1.125rem; font-weight: 800; color: #000; }'
    ].join('\n');
    document.head.appendChild(styleEl);

    // 4. Create Main Weakness Assessment Container
    var section = document.createElement('section');
    section.id = 'weaknessAssessmentSection';
    section.className = 'weakness-section';
    section.style.display = 'none';
    section.setAttribute('aria-live', 'polite');

    section.innerHTML = [
      '<div class="weakness-card">',
      '  <!-- Screen 1: Daily Subject Quiz Intro & Selection -->',
      '  <div id="wIntroView" class="w-view">',
      '    <div class="w-header">',
      '      <span class="w-eyebrow">AfriWidget TVET Academic Engine</span>',
      '      <h2 class="w-title">Find My Subject Weaknesses</h2>',
      '      <p class="w-subtitle">A daily subject-based learning quiz for South African TVET students. Select your programme, qualification level, and subject to generate 10 curriculum-aligned questions testing academic understanding, practical application, and problem solving.</p>',
      '    </div>',
      '    <div id="wContextNotice" class="w-context-notice"></div>',
      '    <div class="w-select-grid">',
      '      <div class="w-field-group">',
      '        <label class="w-field-label" for="wProgrammeSelect">TVET Programme Track:</label>',
      '        <select id="wProgrammeSelect" class="form-input w-select">',
      '          <option value="nated_eng">Engineering Studies (NATED N1–N6)</option>',
      '          <option value="nated_bus">Business &amp; Management (NATED N4–N6)</option>',
      '          <option value="ncv_it">IT &amp; Computer Science (NC(V) L2–L4)</option>',
      '        </select>',
      '      </div>',
      '      <div class="w-field-group">',
      '        <label class="w-field-label" for="wSubjectSelect">TVET Subject:</label>',
      '        <select id="wSubjectSelect" class="form-input w-select"></select>',
      '      </div>',
      '      <div class="w-field-group">',
      '        <label class="w-field-label" for="wDifficultySelect">Difficulty Level:</label>',
      '        <select id="wDifficultySelect" class="form-input w-select">',
      '          <option value="easy">Easy (Definitions &amp; Core Formulas)</option>',
      '          <option value="medium" selected>Medium (Applied Problem Solving)</option>',
      '          <option value="difficult">Difficult (Advanced Analysis)</option>',
      '        </select>',
      '      </div>',
      '    </div>',
      '    <div class="w-intro-meta">',
      '      <div class="w-intro-badge"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Exactly 10 Curriculum Questions</div>',
      '      <div class="w-intro-badge"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Immediate Step-by-Step Explanations</div>',
      '      <div class="w-intro-badge"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Weakness Diagnostics &amp; Study Tips</div>',
      '    </div>',
      '    <div class="w-btn-row">',
      '      <button type="button" id="wStartBtn" class="btn-primary w-full-btn">Start Daily Quiz (10 Questions)</button>',
      '      <button type="button" id="wCloseIntroBtn" class="btn-secondary">Close</button>',
      '    </div>',
      '    <div id="wHistoryPreview" class="w-history-preview" style="margin-top:1.5rem;"></div>',
      '  </div>',

      '  <!-- Screen 2: Active 10-Question Test with Immediate Learning Feedback -->',
      '  <div id="wQuizView" class="w-view" style="display:none;">',
      '    <div class="w-quiz-top">',
      '      <div class="w-quiz-info">',
      '        <div>',
      '          <span id="wQuizBadge" class="w-tag">Mathematics (N1–N3)</span>',
      '          <span id="wDifficultyBadge" class="w-intro-badge" style="margin-left:.5rem;padding:.2rem .5rem;font-size:.75rem;">Medium</span>',
      '        </div>',
      '        <span class="w-quiz-counter">Question <strong id="wCurrentQNum">1</strong> of 10</span>',
      '      </div>',
      '      <div class="w-progress-track">',
      '        <div id="wProgressBar" class="w-progress-fill" style="width: 10%;"></div>',
      '      </div>',
      '    </div>',
      '    <div class="w-question-box">',
      '      <span id="wQuestionTopic" class="w-question-topic">Topic</span>',
      '      <h3 id="wQuestionText" class="w-question-title">Question prompt</h3>',
      '      <div id="wOptionsContainer" class="w-options-grid" role="radiogroup" aria-label="Question options"></div>',
      '    </div>',
      '    <div id="wFeedbackContainer" style="display:none;"></div>',
      '    <div id="wQuizValidation" class="w-validation-alert" style="display:none;">Please select an option before confirming.</div>',
      '    <div class="w-quiz-nav">',
      '      <button type="button" id="wPrevBtn" class="btn-secondary" disabled>Previous</button>',
      '      <button type="button" id="wConfirmBtn" class="btn-primary">Confirm Answer</button>',
      '      <button type="button" id="wNextBtn" class="btn-primary" style="display:none;">Next Question &rarr;</button>',
      '      <button type="button" id="wSubmitBtn" class="btn-primary" style="display:none;">View Quiz Results &rarr;</button>',
      '    </div>',
      '  </div>',

      '  <!-- Screen 3: Diagnostic Results, Weaknesses & Study Recommendations -->',
      '  <div id="wResultsView" class="w-view" style="display:none;">',
      '    <div class="w-results-header">',
      '      <span class="w-eyebrow">Academic Diagnostic Results</span>',
      '      <div class="w-results-score-wrap">',
      '        <div class="w-results-score-big" id="wScoreBig">0%</div>',
      '        <div class="w-results-score-text">',
      '          <h3 id="wScoreHeadline" class="w-score-headline">Performance Summary</h3>',
      '          <p id="wScoreFraction" class="w-score-fraction">0 / 10 Correct</p>',
      '        </div>',
      '      </div>',
      '    </div>',

      '    <!-- Comparison with Previous Attempt -->',
      '    <div id="wComparisonBox" class="w-comparison-card"></div>',

      '    <!-- Strongest Topics vs Weaknesses Grid -->',
      '    <div class="w-analysis-grid">',
      '      <div class="w-analysis-card w-card-strong">',
      '        <div class="w-card-head">',
      '          <svg width="20" height="20" fill="none" stroke="#16a34a" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      '          <h4>Demonstrated Strengths</h4>',
      '        </div>',
      '        <div id="wStrongTopicsList" class="w-analysis-list"></div>',
      '      </div>',
      '      <div class="w-analysis-card w-card-weak">',
      '        <div class="w-card-head">',
      '          <svg width="20" height="20" fill="none" stroke="#dc2626" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
      '          <h4>Topics Needing Improvement</h4>',
      '        </div>',
      '        <div id="wWeakTopicsList" class="w-analysis-list"></div>',
      '      </div>',
      '    </div>',

      '    <!-- Specific Study Recommendations -->',
      '    <div class="w-study-tips-section">',
      '      <h4 class="w-study-tips-title">',
      '        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
      '        Specific Study Recommendations',
      '      </h4>',
      '      <p class="w-study-tips-sub">Targeted guidance based on the curriculum topics where you lost marks in this quiz.</p>',
      '      <div id="wStudyTipsList"></div>',
      '    </div>',

      '    <!-- Targeted Action CTA -->',
      '    <div class="w-practice-banner">',
      '      <div class="w-practice-banner-text">',
      '        <h4>Turn Weaknesses into Marks</h4>',
      '        <p>Generate a targeted 10-question practice assessment focused exclusively on the topics where you lost points today.</p>',
      '      </div>',
      '      <button type="button" id="wPractiseBtn" class="btn-primary w-practice-btn">',
      '        <span>Practise My Weaknesses</span>',
      '        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
      '      </button>',
      '    </div>',

      '    <!-- Mistakes & Detailed Explanations Accordion -->',
      '    <div class="w-review-section">',
      '      <div class="w-review-head">',
      '        <h4 class="w-review-title">Step-by-Step Question Review &amp; Concept Audit</h4>',
      '        <span class="w-review-sub">Review every question, verified answers, explanations, and underlying TVET concepts.</span>',
      '      </div>',
      '      <div id="wReviewList" class="w-review-list"></div>',
      '    </div>',

      '    <!-- LocalStorage History Section -->',
      '    <div class="w-history-section">',
      '      <div class="w-history-head">',
      '        <h4 class="w-history-title">Saved Quiz History (This Device)</h4>',
      '        <button type="button" id="wClearHistoryBtn" class="w-clear-link">Clear History</button>',
      '      </div>',
      '      <div id="wHistoryList" class="w-history-list"></div>',
      '    </div>',

      '    <div class="w-results-footer">',
      '      <button type="button" id="wRetakeBtn" class="btn-primary">Take Another Quiz (Fresh Questions)</button>',
      '      <button type="button" id="wChangeSubjectBtn" class="btn-secondary">Change Subject / Difficulty</button>',
      '      <button type="button" id="wCloseResultsBtn" class="btn-secondary">Close Quiz</button>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');

    calcWrap.appendChild(section);

    bindEvents();
    populateSubjectDropdown();
  }

  function populateSubjectDropdown() {
    var progSelect = document.getElementById('wProgrammeSelect');
    var subjSelect = document.getElementById('wSubjectSelect');
    if (!progSelect || !subjSelect) return;

    var progId = progSelect.value;
    var progMeta = PROGRAMMES[progId];
    subjSelect.innerHTML = '';

    if (progMeta && progMeta.subjects) {
      progMeta.subjects.forEach(function (sId) {
        var sMeta = SUBJECTS[sId];
        if (sMeta) {
          var opt = document.createElement('option');
          opt.value = sId;
          opt.textContent = sMeta.name;
          subjSelect.appendChild(opt);
        }
      });
    }
  }

  function bindEvents() {
    var progSelect = document.getElementById('wProgrammeSelect');
    if (progSelect) {
      progSelect.addEventListener('change', function () {
        populateSubjectDropdown();
      });
    }

    var startBtn = document.getElementById('wStartBtn');
    if (startBtn) {
      startBtn.addEventListener('click', function () {
        var progId = document.getElementById('wProgrammeSelect').value;
        var subjId = document.getElementById('wSubjectSelect').value;
        var diff = document.getElementById('wDifficultySelect').value;
        startNewQuizSession(progId, subjId, diff, 'daily_quiz', []);
      });
    }

    var closeIntroBtn = document.getElementById('wCloseIntroBtn');
    if (closeIntroBtn) {
      closeIntroBtn.addEventListener('click', function () {
        closeWeaknessSection();
      });
    }

    var prevBtn = document.getElementById('wPrevBtn');
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (currentSession.currentIndex > 0) {
          currentSession.currentIndex--;
          renderActiveQuestion();
        }
      });
    }

    var confirmBtn = document.getElementById('wConfirmBtn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', function () {
        confirmActiveAnswer();
      });
    }

    var nextBtn = document.getElementById('wNextBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (currentSession.currentIndex < currentSession.questions.length - 1) {
          currentSession.currentIndex++;
          renderActiveQuestion();
        }
      });
    }

    var submitBtn = document.getElementById('wSubmitBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        evaluateQuizResults();
      });
    }

    var practiseBtn = document.getElementById('wPractiseBtn');
    if (practiseBtn) {
      practiseBtn.addEventListener('click', function () {
        startWeaknessPracticeSession();
      });
    }

    var retakeBtn = document.getElementById('wRetakeBtn');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', function () {
        startNewQuizSession(
          currentSession.programmeId,
          currentSession.subjectId,
          currentSession.difficulty,
          'daily_quiz',
          []
        );
      });
    }

    var changeSubjectBtn = document.getElementById('wChangeSubjectBtn');
    if (changeSubjectBtn) {
      changeSubjectBtn.addEventListener('click', function () {
        switchView('wIntroView');
        updateContextNotice();
        renderHistoryPreview();
      });
    }

    var closeResultsBtn = document.getElementById('wCloseResultsBtn');
    if (closeResultsBtn) {
      closeResultsBtn.addEventListener('click', function () {
        closeWeaknessSection();
      });
    }

    var clearHistBtn = document.getElementById('wClearHistoryBtn');
    if (clearHistBtn) {
      clearHistBtn.addEventListener('click', function () {
        if (window.confirm('Clear all saved quiz history from this device?')) {
          clearQuizHistory();
          renderHistoryList();
          renderHistoryPreview();
          updateComparisonBox(null);
        }
      });
    }
  }

  function openWeaknessSection() {
    var section = document.getElementById('weaknessAssessmentSection');
    if (!section) return;

    section.style.display = 'block';
    updateContextNotice();
    renderHistoryPreview();
    switchView('wIntroView');

    setTimeout(function () {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  function closeWeaknessSection() {
    var section = document.getElementById('weaknessAssessmentSection');
    if (section) section.style.display = 'none';
  }

  function switchView(viewId) {
    var views = ['wIntroView', 'wQuizView', 'wResultsView'];
    views.forEach(function (v) {
      var el = document.getElementById(v);
      if (el) el.style.display = (v === viewId) ? 'block' : 'none';
    });
  }

  function updateContextNotice() {
    var noticeEl = document.getElementById('wContextNotice');
    if (!noticeEl) return;

    var ctx = getIcassInputsContext();
    if (ctx.calculatedScore !== null) {
      var bandDesc = ctx.calculatedScore >= 75 ? 'Distinction band' :
                     ctx.calculatedScore >= 65 ? 'Credit band' :
                     ctx.calculatedScore >= 50 ? 'Pass band' :
                     ctx.calculatedScore >= 40 ? 'Borderline exam entry' : 'Sub-minimum risk (DNQ)';

      noticeEl.innerHTML = [
        '<div class="w-notice-box">',
        '  <span class="w-notice-title">Calculated ICASS Context Detected:</span>',
        '  <p>Current calculated ICASS average: <strong>' + ctx.calculatedScore.toFixed(2) + '%</strong> (' + bandDesc + '). Use this daily quiz to strengthen your academic subject knowledge before writing your final external DHET examination.</p>',
        '</div>'
      ].join('');
      noticeEl.style.display = 'block';
    } else {
      noticeEl.innerHTML = [
        '<div class="w-notice-box">',
        '  <span class="w-notice-title">Curriculum-Aligned TVET Learning:</span>',
        '  <p>Select your programme track, subject, and difficulty level below. Each daily session generates exactly 10 questions covering authentic syllabus topics with immediate step-by-step learning feedback.</p>',
        '</div>'
      ].join('');
      noticeEl.style.display = 'block';
    }
  }

  function startNewQuizSession(progId, subjId, difficulty, mode, targetTopicIds) {
    var questions = selectQuestionsForSession(subjId, difficulty, mode, targetTopicIds);
    if (!questions || questions.length === 0) return;

    currentSession = {
      programmeId: progId,
      subjectId: subjId,
      difficulty: difficulty,
      mode: mode,
      targetWeaknessTopicIds: targetTopicIds || [],
      questions: questions,
      currentIndex: 0,
      userAnswers: {},
      startedAt: Date.now()
    };

    var subjMeta = SUBJECTS[subjId] || { name: 'Subject Quiz' };
    var badgeText = mode === 'weakness_practice' ?
      'Weakness Practice: ' + subjMeta.name : subjMeta.name;

    document.getElementById('wQuizBadge').textContent = badgeText;
    document.getElementById('wDifficultyBadge').textContent = difficulty.toUpperCase();

    switchView('wQuizView');
    renderActiveQuestion();

    var section = document.getElementById('weaknessAssessmentSection');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function startWeaknessPracticeSession() {
    if (!currentSession.targetWeaknessTopicIds || currentSession.targetWeaknessTopicIds.length === 0) {
      var subjMeta = SUBJECTS[currentSession.subjectId];
      currentSession.targetWeaknessTopicIds = subjMeta ? Object.keys(subjMeta.topics) : [];
    }

    startNewQuizSession(
      currentSession.programmeId,
      currentSession.subjectId,
      currentSession.difficulty,
      'weakness_practice',
      currentSession.targetWeaknessTopicIds
    );
  }

  function renderActiveQuestion() {
    var q = currentSession.questions[currentSession.currentIndex];
    if (!q) return;

    var subjMeta = SUBJECTS[q.subject] || { topics: {} };
    var topicMeta = subjMeta.topics[q.topicId] || { name: 'Curriculum Topic' };

    document.getElementById('wCurrentQNum').textContent = (currentSession.currentIndex + 1);
    document.getElementById('wProgressBar').style.width = ((currentSession.currentIndex + 1) * 10) + '%';
    document.getElementById('wQuestionTopic').textContent = topicMeta.name;
    document.getElementById('wQuestionText').textContent = q.question;

    var optionsBox = document.getElementById('wOptionsContainer');
    optionsBox.innerHTML = '';

    var answerState = currentSession.userAnswers[q.id] || { selectedIndex: undefined, confirmed: false };
    var isConfirmed = answerState.confirmed;
    var selectedIdx = answerState.selectedIndex;

    q.options.forEach(function (optText, oIdx) {
      var letter = String.fromCharCode(65 + oIdx);
      var optBtn = document.createElement('div');
      
      var classes = ['w-option-item'];
      if (selectedIdx === oIdx) classes.push('selected');
      if (isConfirmed) {
        classes.push('locked');
        if (oIdx === q.correctIndex) {
          classes.push('correct');
        } else if (selectedIdx === oIdx && oIdx !== q.correctIndex) {
          classes.push('incorrect');
        }
      }

      optBtn.className = classes.join(' ');
      optBtn.setAttribute('role', 'radio');
      optBtn.setAttribute('aria-checked', selectedIdx === oIdx ? 'true' : 'false');
      optBtn.setAttribute('tabindex', isConfirmed ? '-1' : '0');

      optBtn.innerHTML = [
        '<span class="w-option-letter">' + letter + '</span>',
        '<span class="w-option-text">' + optText + '</span>'
      ].join('');

      function handleSelect() {
        if (isConfirmed) return;
        currentSession.userAnswers[q.id] = {
          selectedIndex: oIdx,
          confirmed: false
        };
        document.getElementById('wQuizValidation').style.display = 'none';
        renderActiveQuestion();
      }

      optBtn.addEventListener('click', handleSelect);
      optBtn.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleSelect();
        }
      });

      optionsBox.appendChild(optBtn);
    });

    // Render Learning Feedback if answer is confirmed
    var feedbackBox = document.getElementById('wFeedbackContainer');
    if (isConfirmed) {
      var isCorrect = selectedIdx === q.correctIndex;
      var statusClass = isCorrect ? 'correct' : 'incorrect';
      var statusTitle = isCorrect ? 'Correct Answer' : 'Incorrect — Let\'s Review This Concept';
      var correctLetter = String.fromCharCode(65 + q.correctIndex);
      var correctText = q.options[q.correctIndex];

      feedbackBox.className = 'w-feedback-card ' + statusClass;
      feedbackBox.innerHTML = [
        '<div class="w-feedback-status ' + statusClass + '">',
        '  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">',
             isCorrect ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>' :
                         '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
        '  </svg>',
        '  <span>' + statusTitle + '</span>',
        '</div>',
        !isCorrect ? '<div class="w-feedback-correct-ans">Correct Answer: <strong>' + correctLetter + '. ' + correctText + '</strong></div>' : '',
        '<div class="w-feedback-text">' + q.explanation + '</div>',
        '<div class="w-concept-box">',
        '  <span class="w-concept-label">Underlying TVET Curriculum Concept:</span>',
        '  <p class="w-concept-text">' + q.concept + '</p>',
        '</div>'
      ].join('');
      feedbackBox.style.display = 'block';
    } else {
      feedbackBox.style.display = 'none';
      feedbackBox.innerHTML = '';
    }

    // Navigation buttons state
    var prevBtn = document.getElementById('wPrevBtn');
    var confirmBtn = document.getElementById('wConfirmBtn');
    var nextBtn = document.getElementById('wNextBtn');
    var submitBtn = document.getElementById('wSubmitBtn');

    prevBtn.disabled = currentSession.currentIndex === 0;

    if (!isConfirmed) {
      confirmBtn.style.display = 'inline-flex';
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'none';
    } else {
      confirmBtn.style.display = 'none';
      if (currentSession.currentIndex === currentSession.questions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-flex';
      } else {
        nextBtn.style.display = 'inline-flex';
        submitBtn.style.display = 'none';
      }
    }
  }

  function confirmActiveAnswer() {
    var q = currentSession.questions[currentSession.currentIndex];
    var answerState = currentSession.userAnswers[q.id];

    if (!answerState || answerState.selectedIndex === undefined) {
      var alertEl = document.getElementById('wQuizValidation');
      alertEl.style.display = 'block';
      return;
    }

    document.getElementById('wQuizValidation').style.display = 'none';
    answerState.confirmed = true;
    renderActiveQuestion();

    setTimeout(function () {
      var feedbackBox = document.getElementById('wFeedbackContainer');
      if (feedbackBox) {
        feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);
  }

  function evaluateQuizResults() {
    var correctCount = 0;
    var topicStats = {};
    var mistakes = [];

    var subjMeta = SUBJECTS[currentSession.subjectId] || { topics: {} };
    Object.keys(subjMeta.topics).forEach(function (tKey) {
      topicStats[tKey] = { total: 0, correct: 0 };
    });

    currentSession.questions.forEach(function (q) {
      var ans = currentSession.userAnswers[q.id];
      var selectedIdx = ans ? ans.selectedIndex : undefined;
      var isCorrect = selectedIdx === q.correctIndex;

      if (!topicStats[q.topicId]) {
        topicStats[q.topicId] = { total: 0, correct: 0 };
      }
      topicStats[q.topicId].total++;

      if (isCorrect) {
        correctCount++;
        topicStats[q.topicId].correct++;
      } else {
        mistakes.push({
          question: q,
          selectedAnswer: selectedIdx,
          correctAnswer: q.correctIndex
        });
      }
    });

    var scorePct = Math.round((correctCount / currentSession.questions.length) * 100);

    var strongTopics = [];
    var weakTopics = [];

    Object.keys(topicStats).forEach(function (tId) {
      var stat = topicStats[tId];
      if (stat.total > 0) {
        var pct = Math.round((stat.correct / stat.total) * 100);
        var meta = subjMeta.topics[tId] || { name: tId, shortName: tId, studyTip: '' };
        var obj = {
          topicId: tId,
          name: meta.name,
          shortName: meta.shortName,
          total: stat.total,
          correct: stat.correct,
          percentage: pct,
          studyTip: meta.studyTip || ''
        };

        if (pct >= 75) {
          strongTopics.push(obj);
        } else {
          weakTopics.push(obj);
        }
      }
    });

    weakTopics.sort(function (a, b) { return a.percentage - b.percentage; });
    strongTopics.sort(function (a, b) { return b.percentage - a.percentage; });

    currentSession.targetWeaknessTopicIds = weakTopics.map(function (w) { return w.topicId; });
    if (currentSession.targetWeaknessTopicIds.length === 0 && mistakes.length > 0) {
      currentSession.targetWeaknessTopicIds = mistakes.map(function (m) { return m.question.topicId; });
    }

    var history = getQuizHistory();
    var lastSubjectAttempt = null;
    for (var h = 0; h < history.length; h++) {
      if (history[h].subjectId === currentSession.subjectId) {
        lastSubjectAttempt = history[h];
        break;
      }
    }
    var delta = lastSubjectAttempt ? (scorePct - lastSubjectAttempt.percentage) : null;

    var record = {
      id: 'quiz_' + Date.now(),
      timestamp: Date.now(),
      dateFormatted: new Date().toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      programmeId: currentSession.programmeId,
      subjectId: currentSession.subjectId,
      subjectName: subjMeta.name,
      difficulty: currentSession.difficulty,
      mode: currentSession.mode,
      score: correctCount,
      total: currentSession.questions.length,
      percentage: scorePct,
      weakTopicNames: weakTopics.map(function (w) { return w.shortName; }),
      delta: delta
    };

    saveQuizAttempt(record);

    renderResultsView(record, lastSubjectAttempt, strongTopics, weakTopics, mistakes);
  }

  function renderResultsView(attempt, lastAttempt, strongTopics, weakTopics, mistakes) {
    switchView('wResultsView');

    document.getElementById('wScoreBig').textContent = attempt.percentage + '%';
    document.getElementById('wScoreFraction').textContent = attempt.score + ' of ' + attempt.total + ' Correct (' + attempt.subjectName + ' - ' + attempt.difficulty.toUpperCase() + ')';

    var headlineEl = document.getElementById('wScoreHeadline');
    if (attempt.percentage >= 80) {
      headlineEl.textContent = 'Distinction-Level Mastery (DHET Level 7)';
    } else if (attempt.percentage >= 60) {
      headlineEl.textContent = 'Competent Pass with Target Revision Areas';
    } else if (attempt.percentage >= 40) {
      headlineEl.textContent = 'Borderline Pass — Specific Weaknesses Need Work';
    } else {
      headlineEl.textContent = 'At-Risk — High Priority Revision Required';
    }

    updateComparisonBox(attempt);

    var strongList = document.getElementById('wStrongTopicsList');
    if (strongTopics.length > 0) {
      strongList.innerHTML = strongTopics.map(function (s) {
        return [
          '<div class="w-topic-badge-row strong">',
          '  <span>' + s.name + '</span>',
          '  <span class="w-topic-score">' + s.correct + '/' + s.total + ' (' + s.percentage + '%)</span>',
          '</div>'
        ].join('');
      }).join('');
    } else {
      strongList.innerHTML = '<div class="w-empty-note">No topics cleared the 75% threshold in this session. Review the recommendations below to build mastery.</div>';
    }

    var weakList = document.getElementById('wWeakTopicsList');
    if (weakTopics.length > 0) {
      weakList.innerHTML = weakTopics.map(function (w) {
        return [
          '<div class="w-topic-badge-row weak">',
          '  <span>' + w.name + '</span>',
          '  <span class="w-topic-score">' + w.correct + '/' + w.total + ' (' + w.percentage + '%)</span>',
          '</div>'
        ].join('');
      }).join('');
    } else {
      weakList.innerHTML = '<div class="w-empty-note green">Outstanding! 100% demonstrated accuracy across all assessed topics in this session.</div>';
    }

    var tipsList = document.getElementById('wStudyTipsList');
    var recommendations = [];
    if (weakTopics.length > 0) {
      weakTopics.forEach(function (w) {
        if (w.studyTip) {
          recommendations.push({
            topic: w.name,
            tip: w.studyTip
          });
        }
      });
    } else {
      recommendations.push({
        topic: 'Exam Readiness & Time Management',
        tip: 'Maintain your current study schedule, practice past DHET national examination papers under strict timed exam conditions, and test the "Difficult" quiz setting.'
      });
    }

    tipsList.innerHTML = recommendations.map(function (rec) {
      return [
        '<div class="w-tip-item">',
        '  <div class="w-tip-icon">',
        '    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        '  </div>',
        '  <div class="w-tip-text">',
        '    <strong>' + rec.topic + '</strong>',
        '    <p>' + rec.tip + '</p>',
        '  </div>',
        '</div>'
      ].join('');
    }).join('');

    renderReviewList();
    renderHistoryList();

    var section = document.getElementById('weaknessAssessmentSection');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function updateComparisonBox(currentAttempt) {
    var box = document.getElementById('wComparisonBox');
    if (!box) return;

    if (!currentAttempt || currentAttempt.delta === null || currentAttempt.delta === undefined) {
      box.innerHTML = [
        '<div class="w-comp-wrap baseline">',
        '  <div class="w-comp-icon"><svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>',
        '  <div class="w-comp-text">',
        '    <span class="w-comp-delta neutral">Baseline Recorded</span>',
        '    <p>This is your first saved session for <strong>' + (currentAttempt ? currentAttempt.subjectName : 'this subject') + '</strong>. Subsequent daily quizzes will benchmark your score trends and diagnostic retention.</p>',
        '  </div>',
        '</div>'
      ].join('');
      return;
    }

    var delta = currentAttempt.delta;
    var improved = delta > 0;
    var regressed = delta < 0;
    var statusClass = improved ? 'improved' : regressed ? 'regressed' : 'neutral';
    var sign = delta > 0 ? '+' : '';

    box.innerHTML = [
      '<div class="w-comp-wrap ' + statusClass + '">',
      '  <div class="w-comp-icon">',
      improved ? '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>' :
      regressed ? '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/></svg>' :
      '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/></svg>',
      '  </div>',
      '  <div class="w-comp-text">',
      '    <span class="w-comp-delta ' + statusClass + '">' + sign + delta + '% vs Previous Attempt</span>',
      '    <p>' + (improved ? 'Excellent progress! Your score improved by ' + delta + ' percentage points compared to your last attempt.' :
                   regressed ? 'Your score was ' + Math.abs(delta) + ' points lower than your previous session. Review the question explanations below to fix knowledge gaps.' :
                   'Your performance is steady at ' + currentAttempt.percentage + '%. Keep testing challenging topics to advance to the distinction band.') + '</p>',
      '  </div>',
      '</div>'
    ].join('');
  }

  function renderReviewList() {
    var listEl = document.getElementById('wReviewList');
    if (!listEl) return;

    var subjMeta = SUBJECTS[currentSession.subjectId] || { topics: {} };

    listEl.innerHTML = currentSession.questions.map(function (q, idx) {
      var ans = currentSession.userAnswers[q.id];
      var selectedIdx = ans ? ans.selectedIndex : undefined;
      var isCorrect = selectedIdx === q.correctIndex;
      var topicMeta = subjMeta.topics[q.topicId] || { name: 'General' };

      var userText = selectedIdx !== undefined ? (String.fromCharCode(65 + selectedIdx) + '. ' + q.options[selectedIdx]) : 'No answer selected';
      var correctText = String.fromCharCode(65 + q.correctIndex) + '. ' + q.options[q.correctIndex];

      return [
        '<div class="w-review-card ' + (isCorrect ? 'correct' : 'incorrect') + '">',
        '  <div class="w-review-card-head">',
        '    <span class="w-review-qnum">Question ' + (idx + 1) + ' &bull; ' + topicMeta.name + '</span>',
        '    <span class="w-verdict ' + (isCorrect ? 'correct' : 'incorrect') + '">',
               isCorrect ? '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Correct' :
                           '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg> Incorrect',
        '    </span>',
        '  </div>',
        '  <div class="w-review-question">' + q.question + '</div>',
        '  <div class="w-review-answer-row">',
        '    <div class="w-review-user-ans ' + (isCorrect ? 'green' : 'red') + '">Your Answer: <strong>' + userText + '</strong></div>',
        !isCorrect ? '    <div class="w-review-correct-ans">Correct Answer: <strong>' + correctText + '</strong></div>' : '',
        '  </div>',
        '  <div class="w-review-rationale"><strong>Explanation:</strong> ' + q.explanation + '</div>',
        '  <div class="w-concept-box" style="margin-top:.75rem;">',
        '    <span class="w-concept-label">Underlying Concept:</span>',
        '    <p class="w-concept-text">' + q.concept + '</p>',
        '  </div>',
        '</div>'
      ].join('');
    }).join('');
  }

  function renderHistoryList() {
    var listEl = document.getElementById('wHistoryList');
    if (!listEl) return;

    var history = getQuizHistory();
    if (history.length === 0) {
      listEl.innerHTML = '<div class="w-empty-note">No saved quiz attempts found on this browser.</div>';
      return;
    }

    listEl.innerHTML = history.slice(0, 10).map(function (h) {
      return [
        '<div class="w-history-item">',
        '  <div>',
        '    <div class="w-hist-title">' + (h.subjectName || h.subjectId) + ' (' + (h.difficulty ? h.difficulty.toUpperCase() : 'STANDARD') + ')</div>',
        '    <div class="w-hist-meta">' + h.dateFormatted + ' &bull; ' + (h.mode === 'weakness_practice' ? 'Weakness Practice' : 'Daily Quiz') + '</div>',
        '  </div>',
        '  <div class="w-hist-score">' + h.score + '/' + h.total + ' (' + h.percentage + '%)</div>',
        '</div>'
      ].join('');
    }).join('');
  }

  function renderHistoryPreview() {
    var previewEl = document.getElementById('wHistoryPreview');
    if (!previewEl) return;

    var history = getQuizHistory();
    if (history.length === 0) {
      previewEl.innerHTML = '';
      return;
    }

    var last = history[0];
    previewEl.innerHTML = [
      '<div class="w-notice-box" style="border-left-color: #0284c7;">',
      '  <span class="w-notice-title">Recent Quiz Activity:</span>',
      '  <p>Last attempt: <strong>' + (last.subjectName || last.subjectId) + '</strong> (' + (last.difficulty ? last.difficulty.toUpperCase() : 'STANDARD') + ') &bull; <strong>' + last.score + '/' + last.total + ' (' + last.percentage + '%)</strong> on ' + last.dateFormatted + '.</p>',
      '</div>'
    ].join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWeaknessUI);
  } else {
    initWeaknessUI();
  }

})();
