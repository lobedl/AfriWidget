#!/usr/bin/env python3
import json
import sys

# Define TVET Programmes & Subjects metadata
PROGRAMMES = {
    "nated_eng": {
        "id": "nated_eng",
        "name": "Engineering Studies (NATED Report 191 N1–N6)",
        "badge": "NATED Engineering",
        "subjects": ["math", "eng_sci", "electrotechnics"]
    },
    "nated_bus": {
        "id": "nated_bus",
        "name": "Business & Management Studies (NATED Report 191 N4–N6)",
        "badge": "NATED Business",
        "subjects": ["fin_acc", "ebm", "mgt_comm"]
    },
    "ncv_it": {
        "id": "ncv_it",
        "name": "Information Technology & Computer Science (NC(V) L2–L4)",
        "badge": "NC(V) IT & CS",
        "subjects": ["comp_hw", "programming"]
    }
}

SUBJECTS = {
    "math": {
        "id": "math",
        "programmeId": "nated_eng",
        "name": "Mathematics (N1–N3)",
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
        "name": "Engineering Science (N1–N3)",
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
        "name": "Financial Accounting (N4–N6)",
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
        "name": "Entrepreneurship & Business Management (N4–N6)",
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
}

print(f"Loaded {len(PROGRAMMES)} programmes and {len(SUBJECTS)} subjects successfully.")
