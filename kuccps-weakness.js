/**
 * AfriWidget Kenya KCSE & KUCCPS Daily Subject Learning Quiz Engine (v2.0)
 * Vanilla JS — Zero External Dependencies — LocalStorage Variety & Progress Tracking
 *
 * Curriculum Scope:
 * - 10 Official KNEC KCSE Subjects (Mathematics 121, English 101, Kiswahili 102,
 *   Biology 231, Chemistry 233, Physics 232, History & Government 311,
 *   Geography 312, Business Studies 565, Computer Studies 451)
 * - 50 Syllabus Topics with Targeted Study Recommendations
 * - 300 Verified Questions across Easy, Medium, and Difficult Levels
 * - KUCCPS Degree Cluster Presets + Flexible Multi-Subject KCSE Selection
 */
(function () {
  'use strict';

  var STORAGE_HISTORY_KEY = 'afriwidget_kcse_quiz_history_v2';
  var STORAGE_SEEN_KEY = 'afriwidget_kcse_quiz_seen_v2';
  var QUESTIONS_PER_SESSION = 10;

  var KUCCPS_CLUSTERS = {
    custom: {
      id: 'custom',
      label: 'Custom KCSE Subject Selection (Choose Any Subjects Below)',
      subjects: ['mathematics', 'english', 'biology', 'chemistry']
    },
    calc_sync: {
      id: 'calc_sync',
      label: 'Use Subjects From My Calculator Above',
      subjects: ['mathematics', 'english', 'kiswahili', 'biology', 'chemistry']
    },
    medicine: {
      id: 'medicine',
      label: 'Cluster 13: Medicine, Pharmacy, Dental & Health Sciences',
      subjects: ['biology', 'chemistry', 'mathematics', 'english']
    },
    nursing: {
      id: 'nursing',
      label: 'Cluster 13B: Nursing, Clinical Medicine & Midwifery',
      subjects: ['biology', 'chemistry', 'mathematics', 'english']
    },
    engineering: {
      id: 'engineering',
      label: 'Cluster 5: Civil, Electrical, Mechanical & Mechatronic Engineering',
      subjects: ['mathematics', 'physics', 'chemistry', 'computer']
    },
    computing: {
      id: 'computing',
      label: 'Cluster 7: Computer Science, Software Engineering & IT',
      subjects: ['mathematics', 'physics', 'computer', 'english']
    },
    architecture: {
      id: 'architecture',
      label: 'Cluster 6 & 12: Architecture, Quantity Surveying & Construction',
      subjects: ['mathematics', 'physics', 'geography', 'english']
    },
    actuarial: {
      id: 'actuarial',
      label: 'Cluster 10: Actuarial Science, Financial Engineering & Statistics',
      subjects: ['mathematics', 'english', 'physics', 'business']
    },
    business: {
      id: 'business',
      label: 'Cluster 2: Commerce (BCom), Economics, Finance & Accounting',
      subjects: ['mathematics', 'english', 'business', 'geography']
    },
    law: {
      id: 'law',
      label: 'Cluster 1: Bachelor of Laws (LLB) & Legal Studies',
      subjects: ['english', 'kiswahili', 'history', 'mathematics']
    },
    agriculture: {
      id: 'agriculture',
      label: 'Cluster 8 & 17: Agriculture, Agribusiness & Environmental Science',
      subjects: ['biology', 'chemistry', 'geography', 'mathematics']
    },
    education_science: {
      id: 'education_science',
      label: 'Cluster 14A: Bachelor of Education (Science Teaching)',
      subjects: ['mathematics', 'biology', 'chemistry', 'physics']
    },
    education_arts: {
      id: 'education_arts',
      label: 'Cluster 14B: Bachelor of Education (Arts Teaching)',
      subjects: ['english', 'kiswahili', 'history', 'geography']
    },
    media: {
      id: 'media',
      label: 'Cluster 3: Journalism, Media, Communication & Social Sciences',
      subjects: ['english', 'kiswahili', 'history', 'business']
    }
  };

  var SUBJECT_ORDER = [
    'mathematics', 'english', 'kiswahili',
    'biology', 'chemistry', 'physics',
    'history', 'geography', 'business', 'computer'
  ];

  var SUBJECTS = {
  "mathematics": {
    "id": "mathematics",
    "code": "121",
    "name": "Mathematics (121)",
    "shortName": "Mathematics",
    "group": "Group I Compulsory",
    "topics": {
      "math_alg": {
        "name": "Algebra, Indices, Logarithms & Quadratics",
        "shortName": "Algebra & Logs",
        "studyTip": "Practise rewriting exponential equations into a common prime base before equating powers, and always verify logarithmic roots against domain restrictions (arguments of logs must be strictly positive)."
      },
      "math_trig": {
        "name": "Trigonometry, Mensuration & 3D Geometry",
        "shortName": "Trig & Mensuration",
        "studyTip": "Draw clear right-angled projection triangles for 3D geometry problems, memorise exact trig ratios for 30, 45, and 60 degrees, and check whether angles lie in Quadrant I, II, III, or IV using the CAST rule."
      },
      "math_vec": {
        "name": "Matrices, Vectors & Transformations",
        "shortName": "Matrices & Vectors",
        "studyTip": "Review determinant calculation (ad - bc), singular matrix conditions (det = 0), matrix inverse swapping/sign rules, and collinearity tests using scalar multiples of vectors."
      },
      "math_calc": {
        "name": "Commercial Arithmetic, Sequences & Calculus",
        "shortName": "Calculus & Commercial Maths",
        "studyTip": "Distinguish arithmetic progressions (common difference d) from geometric progressions (common ratio r), and remember stationary points occur where dy/dx = 0 while kinematics links displacement s, velocity ds/dt, and acceleration dv/dt."
      },
      "math_stat": {
        "name": "Statistics, Probability & Linear Programming",
        "shortName": "Statistics & Probability",
        "studyTip": "For grouped data, use class midpoints for the mean and cumulative frequency up to the lower class boundary for the median. Draw probability tree diagrams without replacement carefully by reducing both numerator and denominator."
      }
    }
  },
  "english": {
    "id": "english",
    "code": "101",
    "name": "English (101)",
    "shortName": "English",
    "group": "Group I Compulsory",
    "topics": {
      "eng_gram": {
        "name": "Grammar, Clauses, Question Tags & Rewrites",
        "shortName": "Grammar & Syntax",
        "studyTip": "Revise KNEC Paper 2 rewrite transformations: inversion after negative adverbs (\"No sooner... than\", \"Hardly... when\"), question tags for imperatives and indefinite pronouns, and subject-verb concord with collective/intervening phrases."
      },
      "eng_func": {
        "name": "Functional Writing (Minutes, Reports & Official Letters)",
        "shortName": "Functional Writing",
        "studyTip": "Master exact KNEC Paper 1 layouts: formal minutes require a title with venue/date/time, Members Present, Apologies, Preliminaries, Confirmation of Previous Minutes, Matters Arising, Agenda items, AOB, and Adjournment."
      },
      "eng_oral": {
        "name": "Oral Skills: Phonology, Silent Letters & Stress",
        "shortName": "Oral Skills & Phonology",
        "studyTip": "Practise homophones, silent consonants (such as b in subtle/debt, p in psalm/receipt, g in phlegm), and noun-versus-verb syllable stress shifts (PRO-duce as noun vs pro-DUCE as verb)."
      },
      "eng_poet": {
        "name": "Oral Literature & Poetry Analysis",
        "shortName": "Poetry & Oral Lit",
        "studyTip": "Distinguish the poet from the persona, identify sound patterns (alliteration, assonance, consonance, rhyme scheme) by sound rather than spelling, and state the specific effect of each stylistic device in context."
      },
      "eng_comp": {
        "name": "Comprehension, Summary, Register & Phrasal Verbs",
        "shortName": "Summary & Phrasal Verbs",
        "studyTip": "In KNEC summary questions, adhere strictly to the word limit, write in continuous prose using connectors rather than bullet points unless told otherwise, and study high-frequency phrasal verbs (call off, put up with, make out)."
      }
    }
  },
  "kiswahili": {
    "id": "kiswahili",
    "code": "102",
    "name": "Kiswahili (102)",
    "shortName": "Kiswahili",
    "group": "Group I Compulsory",
    "topics": {
      "kis_sar": {
        "name": "Sarufi: Ngeli za Nomino na Mnyambuliko wa Vitenzi",
        "shortName": "Ngeli na Mnyambuliko",
        "studyTip": "Panga nomino katika ngeli kwa kuzingatia upatanisho wa kisarufi (k.m. A-WA, U-I, LI-YA, KI-VI, I-ZI) badala ya kuangalia silabi ya kwanza pekee, na ufanye mazoezi ya kauli za vitenzi (tendewa, tendeshwa, tendana)."
      },
      "kis_nya": {
        "name": "Nyakati, Hali, Ukanushaji na Uchanganuzi wa Sentensi",
        "shortName": "Ukanushaji na Sentensi",
        "studyTip": "Kumbuka mabadiliko ya ukanushaji wa hali: -na- huwa ha-...-i, -li- huwa ha-...-ku-, -me- huwa ha-...-ja-, na -ta- huwa ha-...-ta-. Tofautisha sentensi sahili, ambatano, na changamano."
      },
      "kis_isi": {
        "name": "Isimujamii: Sajili za Lugha",
        "shortName": "Isimujamii",
        "studyTip": "Tambua sifa mahususi za sajili mbalimbali (mahakamani, bungeni, hospitalini, matangazo ya mpira, maabadini) pamoja na sababu za kubadili au kuchanganya ndimi katika mawasiliano."
      },
      "kis_fas": {
        "name": "Fasihi Simulizi na Ushairi",
        "shortName": "Ushairi na Fasihi",
        "studyTip": "Katika ushairi, hesabu mizani kwa silabi na utambue vina vya kati na vya mwisho, bahari za mashairi (tarbia, takhmisa, ukara, ukaraguni), na uhuru wa mshairi (inkisari, mazida, tabdila, kuboronga sarufi)."
      },
      "kis_ins": {
        "name": "Insha za Kiamilifu, Methali na Nahau",
        "shortName": "Insha na Semi",
        "studyTip": "Zingatia muundo rasmi wa insha za kiamilifu (kumbukumbu, ripoti, tawasifu, wasifu, barua rasmi, hotuba) na utumizi sahihi wa methali, nahau, na tanakali za sauti."
      }
    }
  },
  "biology": {
    "id": "biology",
    "code": "231",
    "name": "Biology (231)",
    "shortName": "Biology",
    "group": "Group II Science",
    "topics": {
      "bio_cell": {
        "name": "Cell Physiology, Microscopy, Osmosis & Active Transport",
        "shortName": "Cell Physiology",
        "studyTip": "Compare diffusion, osmosis, and active transport carefully: active transport moves ions/molecules against a concentration gradient using ATP and carrier proteins and stops when respiratory inhibitors or low oxygen are introduced."
      },
      "bio_nutr": {
        "name": "Nutrition, Enzymes, Transport & Gaseous Exchange",
        "shortName": "Nutrition & Transport",
        "studyTip": "Revise photolysis vs carbon fixation in photosynthesis, mammalian double circulation, blood clotting cascade (prothrombin -> thrombin -> fibrinogen -> fibrin), and counter-current flow in fish gills."
      },
      "bio_homeo": {
        "name": "Respiration, Excretion & Homeostasis",
        "shortName": "Excretion & Homeostasis",
        "studyTip": "Trace nephron ultrafiltration in the glomerulus, selective reabsorption of all glucose and amino acids in the proximal convoluted tubule, ADH action on collecting ducts, and insulin vs glucagon regulation."
      },
      "bio_ecol": {
        "name": "Classification, Ecology & Nitrogen Cycle",
        "shortName": "Ecology & Classification",
        "studyTip": "Memorise dichotomous key rules, capture-recapture population formula P = (FM x SC) / MR, and bacterial roles in the nitrogen cycle (Rhizobium, Nitrosomonas, Nitrobacter, denitrifying bacteria)."
      },
      "bio_gen": {
        "name": "Reproduction, Genetics, Evolution & Coordination",
        "shortName": "Genetics & Coordination",
        "studyTip": "Set up Punnett squares clearly showing parental genotypes, gametes (circled), and F1/F2 phenotypic ratios, especially for X-linked traits (haemophilia, colour blindness) and ABO blood group codominance."
      }
    }
  },
  "chemistry": {
    "id": "chemistry",
    "code": "233",
    "name": "Chemistry (233)",
    "shortName": "Chemistry",
    "group": "Group II Science",
    "topics": {
      "chem_atom": {
        "name": "Atomic Structure, Periodic Table & Chemical Bonding",
        "shortName": "Structure & Bonding",
        "studyTip": "Link physical properties (melting point, electrical conductivity) directly to structure and bond type: giant ionic (conducts only when molten/aqueous), giant covalent (diamond vs graphite), giant metallic, and simple molecular."
      },
      "chem_mole": {
        "name": "The Mole Concept, Titration & Gas Laws",
        "shortName": "Mole & Gas Laws",
        "studyTip": "Always convert cm3 to dm3 (divide by 1000) when calculating moles from molarity (n = M x V), write balanced stoichiometric ratios before finding mass/volume, and convert Celsius to Kelvin (T = t + 273) for gas laws."
      },
      "chem_org": {
        "name": "Organic Chemistry: Hydrocarbons, Alkanols & Polymers",
        "shortName": "Organic Chemistry",
        "studyTip": "Review homologous series general formulas, bromine water/acidified KMnO4 tests for unsaturation, esterification (alkanol + alkanoic acid with conc. H2SO4 catalyst), and addition vs condensation polymerisation."
      },
      "chem_elec": {
        "name": "Thermochemistry, Reaction Rates & Electrochemistry",
        "shortName": "Electrochemistry & Rates",
        "studyTip": "Use Q = I x t and 1 Faraday = 96,500 C per mole of electrons transferred (so Cu2+ needs 2F, Al3+ needs 3F), apply Le Chatelier's principle to gaseous equilibria, and check E-cell = E(reduced) - E(oxidised)."
      },
      "chem_ind": {
        "name": "Industrial Chemistry & Extraction of Metals",
        "shortName": "Industrial Chemistry",
        "studyTip": "Compare catalysts and conditions across KNEC industrial processes: Haber (finely divided iron, 450 C, 200 atm), Contact (V2O5, 450 C, 2-3 atm), Ostwald (Pt-Rh gauze, 900 C), Solvay (ammonia recycling), and Hall-Heroult cryolite role."
      }
    }
  },
  "physics": {
    "id": "physics",
    "code": "232",
    "name": "Physics (232)",
    "shortName": "Physics",
    "group": "Group II Science",
    "topics": {
      "phy_mech": {
        "name": "Mechanics: Moments, Hooke's Law, Pressure & Motion",
        "shortName": "Mechanics & Motion",
        "studyTip": "Convert all units to SI (cm -> m, g -> kg) before applying F = ke, P = h*rho*g, Principle of Moments, equations of uniformly accelerated motion, or conservation of linear momentum."
      },
      "phy_heat": {
        "name": "Thermal Physics: Heat Capacity, Latent Heat & Gas Laws",
        "shortName": "Heat & Gas Laws",
        "studyTip": "Separate sensible heat (Q = mc*delta_T, temperature changes) from latent heat of phase change (Q = mL, constant temperature), and always convert gas temperatures to Kelvin (T = t + 273)."
      },
      "phy_opt": {
        "name": "Geometrical Optics, Refraction, Thin Lenses & Waves",
        "shortName": "Light, Lenses & Waves",
        "studyTip": "Use real-is-positive sign conventions in 1/f = 1/u + 1/v (convex f > 0, concave f < 0, virtual v < 0), n = 1 / sin c for critical angle, and v = f * lambda for progressive/echo wave calculations."
      },
      "phy_elec": {
        "name": "Electricity, Capacitance, Domestic Wiring & Electromagnetism",
        "shortName": "Electricity & Magnetism",
        "studyTip": "Remember resistors add in series (R = R1 + R2) whereas capacitors add in parallel (C = C1 + C2)! Use E = I(R + r) for internal resistance and V_s / V_p = N_s / N_p with efficiency = (P_out / P_in) x 100% for transformers."
      },
      "phy_mod": {
        "name": "Modern Physics: Photoelectric Effect, X-Rays, Radioactivity & Electronics",
        "shortName": "Modern Physics & Electronics",
        "studyTip": "Master Einstein's photoelectric equation hf = hf_0 + eV_s, distinguish tube voltage (controls X-ray hardness/penetrating power) from filament current (controls X-ray intensity), and revise p-n diode rectification."
      }
    }
  },
  "history": {
    "id": "history",
    "code": "311",
    "name": "History & Government (311)",
    "shortName": "History & Govt",
    "group": "Group III Humanity",
    "topics": {
      "hist_pre": {
        "name": "Pre-Colonial Kenyan Communities, Migration & Trade",
        "shortName": "Pre-Colonial Kenya",
        "studyTip": "Compare Nilotic (River-Lake, Plains, Highland), Bantu (Western, Central, Coastal), and Cushitic migrations alongside decentralized council-of-elders systems vs centralized Wanga (Nabongo) rule."
      },
      "hist_col": {
        "name": "Colonial Rule, Land Policies & Struggle for Independence",
        "shortName": "Colonialism & Nationalism",
        "studyTip": "Trace key milestones chronologically: Berlin Conference (1884-85), Devonshire White Paper (1923), Kipande/Land Ordinances, early associations, KAU, Mau Mau, Lyttelton (1954), Lennox-Boyd (1958), and Lancaster House Conferences (1960, 1962, 1963)."
      },
      "hist_con": {
        "name": "2010 Constitution of Kenya, Citizenship & Bill of Rights",
        "shortName": "Constitution & Rights",
        "studyTip": "Memorise non-derogable rights under Article 25 (freedom from torture, slavery, fair trial, habeas corpus), dual citizenship rules, and when a national referendum is mandatory under Article 255."
      },
      "hist_gov": {
        "name": "Arms of National Government, Judiciary, IEBC & Devolution",
        "shortName": "Arms of Govt & Devolution",
        "studyTip": "Distinguish exclusive functions of the National Assembly vs Senate, superior vs subordinate courts in Kenya, and composition/roles of the 47 County Assemblies and County Executive Committees."
      },
      "hist_int": {
        "name": "Public Finance, World Wars & International Organizations",
        "shortName": "Public Finance & World History",
        "studyTip": "Review Consolidated Fund vs Equalisation Fund vs Contingencies Fund, the Auditor-General vs Controller of Budget, and organs of the UN, African Union, and East African Community."
      }
    }
  },
  "geography": {
    "id": "geography",
    "code": "312",
    "name": "Geography (312)",
    "shortName": "Geography",
    "group": "Group III Humanity",
    "topics": {
      "geo_map": {
        "name": "Mapwork (1:50,000), Bearing, Gradient & Fieldwork",
        "shortName": "Mapwork & Fieldwork",
        "studyTip": "On 1:50,000 KNEC maps, 1 cm represents 0.5 km (1 grid square = 1 km^2). Express gradient as a unit ratio 1 : X after converting both vertical rise and horizontal distance to metres."
      },
      "geo_int": {
        "name": "Internal Land-Forming Processes: Folding, Faulting & Vulcanicity",
        "shortName": "Internal Landforms",
        "studyTip": "Contrast compressional vs tensional Rift Valley theories, identify extrusive vs intrusive volcanic features (dykes cut across strata; sills lie parallel to bedding planes), and distinguish P, S, and L seismic waves."
      },
      "geo_ext": {
        "name": "Rocks, Weathering, Rivers, Glaciation & Karst Scenery",
        "shortName": "External Landforms & Rocks",
        "studyTip": "Group features into erosional vs depositional for rivers (gorges/interlocking spurs vs levees/ox-bow lakes/deltas), glaciated highlands (cirques/aretes/pyramidal peaks), and limestone karst (stalactites/stalagmites/dolines)."
      },
      "geo_clim": {
        "name": "Weather Instruments, Climate, Natural Vegetation & Soils",
        "shortName": "Weather, Climate & Soils",
        "studyTip": "Review Stevenson screen specifications (louvred sides, white paint, 1.2 m above ground), ITCZ seasonal shifts in East Africa, mountain vegetation zonation, and leaching/laterisation in soils."
      },
      "geo_econ": {
        "name": "Economic Geography: Agriculture, Mining, Energy, Fishing & Trade",
        "shortName": "Economic Geography",
        "studyTip": "Compare Mwea-Tebere irrigation factors, Lake Magadi trona dredging, Seven Forks hydroelectric cascade along River Tana, Olkaria geothermal power, and Lake Victoria vs marine fishing in Kenya."
      }
    }
  },
  "business": {
    "id": "business",
    "code": "565",
    "name": "Business Studies (565)",
    "shortName": "Business Studies",
    "group": "Group V Applied",
    "topics": {
      "bus_mkt": {
        "name": "Production, Demand, Supply & Product Market Structures",
        "shortName": "Demand, Supply & Markets",
        "studyTip": "Separate movements ALONG a demand/supply curve (caused solely by own-price change) from SHIFTS of the entire curve (income, tastes, substitutes, costs), and compare perfect competition, monopoly, and oligopoly."
      },
      "bus_trd": {
        "name": "Home Trade Documents, Business Units, Insurance & Warehousing",
        "shortName": "Trade, Insurance & Units",
        "studyTip": "Memorise debit note (corrects undercharge) vs credit note (corrects overcharge/returns), insurance principles (utmost good faith, insurable interest, indemnity, subrogation, proximate cause), and cooperative vs company features."
      },
      "bus_acc": {
        "name": "Accounting Equation, Ledgers, Cash Books & Financial Ratios",
        "shortName": "Accounting & Ratios",
        "studyTip": "Master Assets = Capital + Liabilities, contra entries in three-column cash books, and mark-up vs margin conversion: if Mark-up = 1/4 (25%), then Margin = 1/(4+1) = 1/5 (20%)!"
      },
      "bus_fin": {
        "name": "Money, Central Bank Monetary Policy & Public Finance",
        "shortName": "Banking & Public Finance",
        "studyTip": "Trace how the Central Bank of Kenya contracts money supply during inflation: raising Central Bank Rate (CBR), raising Cash Reserve Ratio, selling government securities in Open Market Operations, and selective credit control."
      },
      "bus_dev": {
        "name": "National Income, Inflation, Population & International Trade",
        "shortName": "Macroeconomics & Trade",
        "studyTip": "Distinguish GDP (within borders) from GNP/GNI (GDP + net factor income from abroad), Terms of Trade vs Balance of Payments, and demand-pull vs cost-push inflation."
      }
    }
  },
  "computer": {
    "id": "computer",
    "code": "451",
    "name": "Computer Studies (451)",
    "shortName": "Computer Studies",
    "group": "Group IV Technical",
    "topics": {
      "comp_sys": {
        "name": "Computer Hardware, CPU Architecture, Memory & OS Security",
        "shortName": "Hardware & OS",
        "studyTip": "Compare ALU, Control Unit, registers, cache, volatile RAM vs non-volatile ROM, operating system interrupt/deadlock handling, and logical security controls (firewalls, encryption, audit trails, UPS power backup)."
      },
      "comp_app": {
        "name": "Spreadsheets, Relational Databases, Word Processing & DTP",
        "shortName": "Spreadsheets & Databases",
        "studyTip": "Practise relative vs absolute cell references ($B$2) when copying spreadsheet formulas, IF/COUNTIF/SUMIF syntax, and database primary keys, foreign keys, normalisation, and validation rules."
      },
      "comp_num": {
        "name": "Number Systems (Binary, Octal, Hex) & Two's Complement",
        "shortName": "Binary & Number Systems",
        "studyTip": "Group bits in threes from the binary point for octal and in fours for hexadecimal; for 8-bit two's complement negative integers, write 8-bit positive binary, invert all bits (ones' complement), and add 1."
      },
      "comp_prog": {
        "name": "Elementary Programming: Algorithms, Flowcharts & Pseudocode",
        "shortName": "Programming & Algorithms",
        "studyTip": "Contrast pre-test WHILE...DO loops (0 or more iterations) with post-test REPEAT...UNTIL loops (at least 1 iteration), trace variable values in dry-run tables, and distinguish syntax, logical, and runtime errors."
      },
      "comp_net": {
        "name": "Systems Development Life Cycle (SDLC) & Computer Networking",
        "shortName": "SDLC & Networking",
        "studyTip": "Compare system changeover strategies (parallel, direct/straight, phased, pilot), transmission media (twisted pair, coaxial, fibre-optic total internal reflection), and LAN topologies (star, bus, ring, mesh)."
      }
    }
  }
};

  var QUESTIONS = [
  {
    "id": "kcse_math_e1",
    "subject": "mathematics",
    "topicId": "math_alg",
    "difficulty": "easy",
    "question": "Solve for x in the exponential equation 3^(2x - 1) = 27.",
    "options": [
      "x = 3",
      "x = 2",
      "x = 4",
      "x = 1.5"
    ],
    "correctIndex": 1,
    "explanation": "Express 27 in base 3: 27 = 3^3. Equating the indices gives 2x - 1 = 3, so 2x = 4 and x = 2.",
    "concept": "When a^m = a^n for a positive base a != 1, the exponents must be equal (m = n)."
  },
  {
    "id": "kcse_math_e2",
    "subject": "mathematics",
    "topicId": "math_alg",
    "difficulty": "easy",
    "question": "Factorise completely the quadratic expression 2x^2 - 5x - 3.",
    "options": [
      "(2x - 1)(x + 3)",
      "(2x + 1)(x - 3)",
      "(2x - 3)(x + 1)",
      "(2x + 3)(x - 1)"
    ],
    "correctIndex": 1,
    "explanation": "Find two numbers whose product is 2 x (-3) = -6 and sum is -5: these are -6 and +1. Splitting the middle term gives 2x^2 - 6x + x - 3 = 2x(x - 3) + 1(x - 3) = (2x + 1)(x - 3).",
    "concept": "To factorise ax^2 + bx + c, find factors p and q such that pq = ac and p + q = b."
  },
  {
    "id": "kcse_math_e3",
    "subject": "mathematics",
    "topicId": "math_trig",
    "difficulty": "easy",
    "question": "Given that sin theta = 3/5 and theta is an acute angle, find the exact value of tan theta.",
    "options": [
      "5/4",
      "3/4",
      "4/3",
      "4/5"
    ],
    "correctIndex": 1,
    "explanation": "In a right-angled triangle with opposite = 3 and hypotenuse = 5, Pythagoras gives adjacent = sqrt(5^2 - 3^2) = sqrt(16) = 4. Therefore tan theta = opposite / adjacent = 3/4.",
    "concept": "Pythagorean triples (3, 4, 5) link sin theta = opp/hyp, cos theta = adj/hyp, and tan theta = opp/adj for acute angles."
  },
  {
    "id": "kcse_math_e4",
    "subject": "mathematics",
    "topicId": "math_trig",
    "difficulty": "easy",
    "question": "Calculate the curved surface area of a right circular cone of base radius 7 cm and slant height 10 cm (take pi = 22/7).",
    "options": [
      "374 cm^2",
      "220 cm^2",
      "154 cm^2",
      "440 cm^2"
    ],
    "correctIndex": 1,
    "explanation": "Curved surface area of a cone = pi * r * l = (22/7) * 7 * 10 = 220 cm^2. Note that 374 cm^2 would be the total surface area including the circular base (220 + 154).",
    "concept": "For a cone of base radius r and slant height l, Curved Surface Area = pi*r*l while Total Surface Area = pi*r*l + pi*r^2."
  },
  {
    "id": "kcse_math_e5",
    "subject": "mathematics",
    "topicId": "math_vec",
    "difficulty": "easy",
    "question": "Find the determinant of the 2x2 matrix M = [[4, -3], [2, 5]].",
    "options": [
      "20",
      "26",
      "-26",
      "14"
    ],
    "correctIndex": 1,
    "explanation": "For matrix [[a, b], [c, d]], determinant = ad - bc = (4)(5) - (-3)(2) = 20 - (-6) = 26.",
    "concept": "Subtracting a negative product bc reverses its sign: ad - bc must be evaluated with strict sign care."
  },
  {
    "id": "kcse_math_e6",
    "subject": "mathematics",
    "topicId": "math_vec",
    "difficulty": "easy",
    "question": "Calculate the magnitude of the column vector p = (-6, 8).",
    "options": [
      "2 units",
      "10 units",
      "14 units",
      "100 units"
    ],
    "correctIndex": 1,
    "explanation": "Magnitude |p| = sqrt((-6)^2 + 8^2) = sqrt(36 + 64) = sqrt(100) = 10 units.",
    "concept": "The modulus (magnitude) of a 2D vector (x, y) is always non-negative and equals sqrt(x^2 + y^2)."
  },
  {
    "id": "kcse_math_e7",
    "subject": "mathematics",
    "topicId": "math_calc",
    "difficulty": "easy",
    "question": "Find the 12th term of the arithmetic progression (AP): 5, 9, 13, 17, ...",
    "options": [
      "53",
      "49",
      "45",
      "48"
    ],
    "correctIndex": 1,
    "explanation": "First term a = 5 and common difference d = 9 - 5 = 4. Using T_n = a + (n - 1)d: T_12 = 5 + (12 - 1)(4) = 5 + 44 = 49.",
    "concept": "The nth term of an arithmetic progression with first term a and common difference d is T_n = a + (n - 1)d."
  },
  {
    "id": "kcse_math_e8",
    "subject": "mathematics",
    "topicId": "math_calc",
    "difficulty": "easy",
    "question": "Differentiate y = 3x^4 - 6x^2 + 9 with respect to x.",
    "options": [
      "12x^3 - 12x + 9",
      "12x^3 - 12x",
      "3x^3 - 6x",
      "12x^4 - 12x^2"
    ],
    "correctIndex": 1,
    "explanation": "Applying d/dx(ax^n) = n*ax^(n-1) term by term: d/dx(3x^4) = 12x^3, d/dx(-6x^2) = -12x, and the derivative of the constant 9 is 0.",
    "concept": "Under polynomial differentiation, the power rule reduces each exponent by 1 and any standalone constant differentiates to zero."
  },
  {
    "id": "kcse_math_e9",
    "subject": "mathematics",
    "topicId": "math_stat",
    "difficulty": "easy",
    "question": "Find the median of the set of marks: 14, 8, 21, 11, 19, 16, 9.",
    "options": [
      "21",
      "14",
      "19",
      "16"
    ],
    "correctIndex": 1,
    "explanation": "Arrange the 7 values in ascending order first: 8, 9, 11, 14, 16, 19, 21. The middle ((7 + 1)/2 = 4th) value is 14.",
    "concept": "Raw data must always be sorted in ascending or descending order before locating the middle value for the median."
  },
  {
    "id": "kcse_math_e10",
    "subject": "mathematics",
    "topicId": "math_stat",
    "difficulty": "easy",
    "question": "A fair six-sided die is rolled once. What is the probability of obtaining a prime number?",
    "options": [
      "1/2",
      "5/6",
      "1/3",
      "2/3"
    ],
    "correctIndex": 0,
    "explanation": "The sample space is {1, 2, 3, 4, 5, 6}. Note that 1 is NOT prime; the prime outcomes are {2, 3, 5}, which is 3 outcomes out of 6 = 3/6 = 1/2.",
    "concept": "By definition, 2 is the smallest prime number (1 has only one factor and is not prime)."
  },
  {
    "id": "kcse_math_m1",
    "subject": "mathematics",
    "topicId": "math_alg",
    "difficulty": "medium",
    "question": "Solve for x without using tables: log_10(2x + 4) - log_10(x - 1) = 1.",
    "options": [
      "x = 0.75",
      "x = 2.5",
      "x = 3",
      "x = 1.75"
    ],
    "correctIndex": 3,
    "explanation": "Combine logs using the quotient law: log_10((2x + 4)/(x - 1)) = 1. Since log_10(10) = 1, (2x + 4)/(x - 1) = 10 -> 2x + 4 = 10x - 10 -> 8x = 14 -> x = 14/8 = 1.75 (valid since x > 1).",
    "concept": "log_b(A) - log_b(B) = log_b(A/B), and 1 = log_10(10)."
  },
  {
    "id": "kcse_math_m2",
    "subject": "mathematics",
    "topicId": "math_alg",
    "difficulty": "medium",
    "question": "Simplify the surd expression 6 / (3 - sqrt(3)) into the form a + b*sqrt(3).",
    "options": [
      "2 + sqrt(3)",
      "3 - sqrt(3)",
      "6 + 2*sqrt(3)",
      "3 + sqrt(3)"
    ],
    "correctIndex": 3,
    "explanation": "Multiply numerator and denominator by the conjugate (3 + sqrt(3)): [6(3 + sqrt(3))] / [3^2 - (sqrt(3))^2] = [6(3 + sqrt(3))] / (9 - 3) = [6(3 + sqrt(3))] / 6 = 3 + sqrt(3).",
    "concept": "Rationalising a binomial surd denominator a - sqrt(b) uses difference of squares: (a - sqrt(b))(a + sqrt(b)) = a^2 - b."
  },
  {
    "id": "kcse_math_m3",
    "subject": "mathematics",
    "topicId": "math_trig",
    "difficulty": "medium",
    "question": "Solve 2 cos x = -1 for 0 degrees <= x <= 360 degrees.",
    "options": [
      "60 degrees and 300 degrees",
      "150 degrees and 210 degrees",
      "120 degrees and 300 degrees",
      "120 degrees and 240 degrees"
    ],
    "correctIndex": 3,
    "explanation": "cos x = -1/2. The acute reference angle is cos^-1(1/2) = 60 degrees. Cosine is negative in Quadrants II and III: x = 180 - 60 = 120 degrees and x = 180 + 60 = 240 degrees.",
    "concept": "Under the CAST rule, cosine is negative in the 2nd (180 - alpha) and 3rd (180 + alpha) quadrants."
  },
  {
    "id": "kcse_math_m4",
    "subject": "mathematics",
    "topicId": "math_trig",
    "difficulty": "medium",
    "question": "In triangle ABC, AB = 8 cm, AC = 10 cm, and angle BAC = 30 degrees. Calculate the area of triangle ABC.",
    "options": [
      "34.64 cm^2",
      "40 cm^2",
      "80 cm^2",
      "20 cm^2"
    ],
    "correctIndex": 3,
    "explanation": "Area = (1/2) * b * c * sin A = (1/2) * 10 * 8 * sin(30 degrees) = 40 * 0.5 = 20 cm^2.",
    "concept": "The area of any triangle given two sides and the included angle is (1/2)ab sin C."
  },
  {
    "id": "kcse_math_m5",
    "subject": "mathematics",
    "topicId": "math_vec",
    "difficulty": "medium",
    "question": "Find the values of k for which the matrix A = [[k + 1, 4], [3, k]] is singular.",
    "options": [
      "k = -3 or k = 4",
      "k = 12 only",
      "k = 2 or k = -6",
      "k = 3 or k = -4"
    ],
    "correctIndex": 3,
    "explanation": "A matrix is singular when its determinant equals zero: (k + 1)(k) - (4)(3) = 0 -> k^2 + k - 12 = 0 -> (k + 4)(k - 3) = 0, so k = 3 or k = -4.",
    "concept": "A square matrix has no inverse (is singular) if and only if its determinant is zero."
  },
  {
    "id": "kcse_math_m6",
    "subject": "mathematics",
    "topicId": "math_vec",
    "difficulty": "medium",
    "question": "Point P divides the line segment joining A(2, -1, 4) and B(7, 9, -6) internally in the ratio 2:3. Find the coordinates of P.",
    "options": [
      "(3, 1, 2)",
      "(5, 5, -2)",
      "(4.5, 4, -1)",
      "(4, 3, 0)"
    ],
    "correctIndex": 3,
    "explanation": "By the ratio theorem, OP = (3*OA + 2*OB) / (2 + 3) = [3(2, -1, 4) + 2(7, 9, -6)] / 5 = [(6 + 14), (-3 + 18), (12 - 12)] / 5 = (20/5, 15/5, 0/5) = (4, 3, 0).",
    "concept": "If P divides AB internally in ratio m:n, then OP = (n*OA + m*OB) / (m + n)."
  },
  {
    "id": "kcse_math_m7",
    "subject": "mathematics",
    "topicId": "math_calc",
    "difficulty": "medium",
    "question": "A machine bought for KES 250,000 depreciates at 12% per annum on a reducing-balance basis. Calculate its value after 2 years.",
    "options": [
      "KES 220,000",
      "KES 186,400",
      "KES 190,000",
      "KES 193,600"
    ],
    "correctIndex": 3,
    "explanation": "Using V = P(1 - r/100)^n: V = 250,000 * (1 - 0.12)^2 = 250,000 * (0.88)^2 = 250,000 * 0.7744 = KES 193,600.",
    "concept": "Reducing-balance depreciation compounds annually by multiplying by (1 - r/100)^n rather than subtracting a flat amount."
  },
  {
    "id": "kcse_math_m8",
    "subject": "mathematics",
    "topicId": "math_calc",
    "difficulty": "medium",
    "question": "Find the gradient of the tangent to the curve y = 2x^3 - 5x^2 + 4x - 1 at the point where x = 2.",
    "options": [
      "4",
      "7",
      "12",
      "8"
    ],
    "correctIndex": 3,
    "explanation": "Differentiate first: dy/dx = 6x^2 - 10x + 4. Substitute x = 2: dy/dx = 6(4) - 10(2) + 4 = 24 - 20 + 4 = 8.",
    "concept": "The first derivative dy/dx evaluated at x = x_0 gives the instantaneous gradient of the tangent at that point."
  },
  {
    "id": "kcse_math_m9",
    "subject": "mathematics",
    "topicId": "math_stat",
    "difficulty": "medium",
    "question": "A bag contains 5 red balls and 3 blue balls. Two balls are drawn one after another without replacement. Find the probability that both balls are of different colours.",
    "options": [
      "5/14",
      "13/28",
      "15/32",
      "15/28"
    ],
    "correctIndex": 3,
    "explanation": "Different colours occur as (Red then Blue) OR (Blue then Red): P = (5/8 * 3/7) + (3/8 * 5/7) = 15/56 + 15/56 = 30/56 = 15/28.",
    "concept": "When sampling without replacement, account for both mutually exclusive orderings (RB and BR) and reduce total count from 8 to 7 on the second draw."
  },
  {
    "id": "kcse_math_m10",
    "subject": "mathematics",
    "topicId": "math_stat",
    "difficulty": "medium",
    "question": "The mean of six numbers is 15. When a seventh number is added, the new mean becomes 17. What is the seventh number?",
    "options": [
      "32",
      "19",
      "29",
      "27"
    ],
    "correctIndex": 2,
    "explanation": "Original sum of 6 numbers = 6 * 15 = 90. New sum of 7 numbers = 7 * 17 = 119. Therefore the 7th number = 119 - 90 = 29.",
    "concept": "Total sum = Mean * Number of items; comparing sums before and after adding an item isolates the added value."
  },
  {
    "id": "kcse_math_d1",
    "subject": "mathematics",
    "topicId": "math_alg",
    "difficulty": "difficult",
    "question": "Find the constant term (independent of x) in the binomial expansion of (2x - 1/x)^6.",
    "options": [
      "-160",
      "240",
      "160",
      "-20"
    ],
    "correctIndex": 0,
    "explanation": "General term T_(r+1) = C(6, r) * (2x)^(6-r) * (-1/x)^r = C(6, r) * 2^(6-r) * (-1)^r * x^(6 - 2r). For the term independent of x, 6 - 2r = 0 -> r = 3. Substituting r = 3: C(6, 3) * 2^3 * (-1)^3 = 20 * 8 * (-1) = -160.",
    "concept": "The constant term in a binomial expansion occurs where the net exponent of x equals zero."
  },
  {
    "id": "kcse_math_d2",
    "subject": "mathematics",
    "topicId": "math_alg",
    "difficulty": "difficult",
    "question": "The quantity P varies directly as the square of Q and inversely as the square root of R. If Q increases by 20% and R decreases by 36%, find the percentage change in P.",
    "options": [
      "Increases by 50%",
      "Decreases by 10%",
      "Increases by 80%",
      "Increases by 125%"
    ],
    "correctIndex": 2,
    "explanation": "P = k * Q^2 / sqrt(R). New Q_1 = 1.2Q so Q_1^2 = 1.44 Q^2. New R_1 = 0.64R so sqrt(R_1) = 0.8 sqrt(R). Thus P_1 = k * (1.44 Q^2) / (0.8 sqrt(R)) = (1.44 / 0.8) P = 1.80 P, which is an 80% increase.",
    "concept": "In joint variation, substitute multiplier factors (1 + p/100) into each power/root to obtain the exact ratio P_new / P_old."
  },
  {
    "id": "kcse_math_d3",
    "subject": "mathematics",
    "topicId": "math_trig",
    "difficulty": "difficult",
    "question": "A right square-based pyramid VABCD has a square base ABCD of side 12 cm and slant edges VA = VB = VC = VD = 10 cm. Find the vertical height VO of the pyramid to 2 decimal places.",
    "options": [
      "5.29 cm",
      "6.32 cm",
      "8.00 cm",
      "7.48 cm"
    ],
    "correctIndex": 0,
    "explanation": "First find the base diagonal AC = sqrt(12^2 + 12^2) = sqrt(288). Half-diagonal AO = AC/2 = sqrt(288)/2 = sqrt(72). In right triangle VOA, VO^2 = VA^2 - AO^2 = 10^2 - 72 = 100 - 72 = 28. Hence VO = sqrt(28) = 5.29 cm.",
    "concept": "In a right pyramid, the vertical apex drops to the centre O of the base, so use half the base diagonal AO (not half the side!) with slant edge VA."
  },
  {
    "id": "kcse_math_d4",
    "subject": "mathematics",
    "topicId": "math_trig",
    "difficulty": "difficult",
    "question": "Two towns X(60 degrees N, 25 degrees W) and Y(60 degrees N, 35 degrees E) lie on the same parallel of latitude. Calculate the distance between X and Y along the parallel of latitude in nautical miles (nm).",
    "options": [
      "3,600 nm",
      "3,118 nm",
      "1,800 nm",
      "900 nm"
    ],
    "correctIndex": 2,
    "explanation": "Longitude difference theta = 25 + 35 = 60 degrees (since one is West and the other is East). Distance along a parallel of latitude in nautical miles = 60 * theta * cos(latitude) = 60 * 60 * cos(60 degrees) = 3,600 * 0.5 = 1,800 nm.",
    "concept": "Along a small circle of latitude alpha, distance in nautical miles is 60 * delta_longitude * cos(alpha)."
  },
  {
    "id": "kcse_math_d5",
    "subject": "mathematics",
    "topicId": "math_vec",
    "difficulty": "difficult",
    "question": "A triangle of area 15 cm^2 undergoes a linear transformation represented by matrix T = [[3, -1], [2, 2]] followed by N = [[2, 0], [1, 3]]. Find the area of the final image.",
    "options": [
      "720 cm^2",
      "210 cm^2",
      "480 cm^2",
      "360 cm^2"
    ],
    "correctIndex": 0,
    "explanation": "Area scale factor of T is |det(T)| = |(3)(2) - (-1)(2)| = |6 + 2| = 8. Area scale factor of N is |det(N)| = |(2)(3) - (0)(1)| = 6. Combined area scale factor = 8 * 6 = 48. Final image area = 48 * 15 = 720 cm^2.",
    "concept": "Under composite matrix transformations, the overall area scale factor equals |det(N) * det(T)|."
  },
  {
    "id": "kcse_math_d6",
    "subject": "mathematics",
    "topicId": "math_vec",
    "difficulty": "difficult",
    "question": "Given OA = 2a + b, OB = 5a - 2b, and OC = 11a + kb, find the scalar value of k if points A, B, and C are collinear.",
    "options": [
      "k = 8",
      "k = -7",
      "k = -8",
      "k = -6"
    ],
    "correctIndex": 2,
    "explanation": "AB = OB - OA = (5a - 2b) - (2a + b) = 3a - 3b. AC = OC - OA = (11a + kb) - (2a + b) = 9a + (k - 1)b. For collinearity, AC = m * AB. Comparing coefficients of a: 9 = 3m -> m = 3. Comparing coefficients of b: k - 1 = 3(-3) = -9 -> k = -8.",
    "concept": "Three points A, B, C are collinear if and only if AB and AC are parallel (AC = m*AB) and share point A."
  },
  {
    "id": "kcse_math_d7",
    "subject": "mathematics",
    "topicId": "math_calc",
    "difficulty": "difficult",
    "question": "A particle moves in a straight line so that its displacement s metres after t seconds is s = t^3 - 6t^2 + 9t + 4. Find its acceleration at the instant when it first comes to instantaneous rest.",
    "options": [
      "-6 m/s^2",
      "0 m/s^2",
      "6 m/s^2",
      "-12 m/s^2"
    ],
    "correctIndex": 0,
    "explanation": "Velocity v = ds/dt = 3t^2 - 12t + 9 = 3(t^2 - 4t + 3) = 3(t - 1)(t - 3). Instantaneous rest occurs when v = 0, first at t = 1 s (and later at t = 3 s). Acceleration a = dv/dt = 6t - 12. At t = 1 s, a = 6(1) - 12 = -6 m/s^2.",
    "concept": "Instantaneous rest means v = ds/dt = 0; substitute the smaller positive root into a = d^2s/dt^2."
  },
  {
    "id": "kcse_math_d8",
    "subject": "mathematics",
    "topicId": "math_calc",
    "difficulty": "difficult",
    "question": "Evaluate the exact area bounded by the curve y = 4x - x^2 and the x-axis.",
    "options": [
      "12 square units",
      "8 square units",
      "32/3 square units",
      "16/3 square units"
    ],
    "correctIndex": 2,
    "explanation": "x-intercepts occur where 4x - x^2 = 0 -> x(4 - x) = 0 -> x = 0 and x = 4. Integrating (4x - x^2) from 0 to 4 gives [2x^2 - x^3/3]_0^4 = (2(16) - 64/3) - 0 = 32 - 64/3 = (96 - 64)/3 = 32/3 square units.",
    "concept": "Area enclosed between y = f(x) >= 0 and the x-axis is the definite integral of f(x) between consecutive x-intercepts."
  },
  {
    "id": "kcse_math_d9",
    "subject": "mathematics",
    "topicId": "math_stat",
    "difficulty": "difficult",
    "question": "In a grouped frequency distribution of 40 students, the median class is 50 - 59 with class frequency 12, and the cumulative frequency of all classes below 50 is 14. Calculate the median mark to 2 decimal places.",
    "options": [
      "54.50",
      "55.00",
      "54.17",
      "53.67"
    ],
    "correctIndex": 0,
    "explanation": "Exact class boundaries of 50 - 59 are 49.5 to 59.5, so lower boundary L = 49.5 and class width i = 10. With N/2 = 40/2 = 20, C = 14, and f = 12: Median = L + ((N/2 - C)/f) * i = 49.5 + ((20 - 14)/12) * 10 = 49.5 + (6/12)*10 = 49.5 + 5.00 = 54.50.",
    "concept": "In KNEC grouped data (50-59, 60-69), use continuous boundary L = 49.5 and class width i = 10 in L + ((N/2 - cf)/f)*i."
  },
  {
    "id": "kcse_math_d10",
    "subject": "mathematics",
    "topicId": "math_stat",
    "difficulty": "difficult",
    "question": "Archer A hits a target with probability 3/5 and Archer B hits the same target independently with probability 2/3. If both shoot once, what is the probability that at least one of them hits the target?",
    "options": [
      "7/15",
      "13/15",
      "2/5",
      "11/15"
    ],
    "correctIndex": 1,
    "explanation": "P(at least one hits) = 1 - P(both miss). P(A misses) = 1 - 3/5 = 2/5 and P(B misses) = 1 - 2/3 = 1/3. Since they shoot independently, P(both miss) = (2/5)(1/3) = 2/15. Hence P(at least one hits) = 1 - 2/15 = 13/15.",
    "concept": "For independent events, P(A union B) = 1 - P(A' intersection B') avoids omitting the overlap where both succeed."
  },
  {
    "id": "kcse_eng_e1",
    "subject": "english",
    "topicId": "eng_gram",
    "difficulty": "easy",
    "question": "Supply the correct question tag: \"Let us revise the Biology notes together, ________?\"",
    "options": [
      "let's not",
      "shall we",
      "aren't we",
      "will you"
    ],
    "correctIndex": 1,
    "explanation": "Imperative invitations beginning with \"Let us\" (or \"Let's\") always take the question tag \"shall we?\". By contrast, \"Let him/them...\" (asking permission) takes \"will you?\".",
    "concept": "First-person plural suggestions (\"Let's / Let us...\") require \"shall we?\" regardless of polarity."
  },
  {
    "id": "kcse_eng_e2",
    "subject": "english",
    "topicId": "eng_gram",
    "difficulty": "easy",
    "question": "Choose the grammatically correct sentence under subject-verb agreement rules:",
    "options": [
      "Every student and teacher were informed of the delay.",
      "Neither the principal nor the teachers were informed of the delay.",
      "Neither the principal nor the teachers was informed of the delay.",
      "Neither the teachers nor the principal were informed of the delay."
    ],
    "correctIndex": 1,
    "explanation": "Under the proximity rule for correlative conjunctions (\"neither... nor\", \"either... or\"), the verb agrees in number with the nearer subject (\"teachers\", plural -> \"were\").",
    "concept": "With \"either... or\" and \"neither... nor\", the verb agrees with the noun phrase closest to it."
  },
  {
    "id": "kcse_eng_e3",
    "subject": "english",
    "topicId": "eng_func",
    "difficulty": "easy",
    "question": "In a formal letter of application to an unknown recipient addressed as \"Dear Sir/Madam,\", which complimentary close is required?",
    "options": [
      "Yours truly,",
      "Yours faithfully,",
      "Warm regards,",
      "Yours sincerely,"
    ],
    "correctIndex": 1,
    "explanation": "When the salutation does not name the recipient (\"Dear Sir/Madam\"), standard formal convention requires \"Yours faithfully,\". \"Yours sincerely,\" is paired with a named salutation such as \"Dear Ms Wanjiku,\".",
    "concept": "Formal letter etiquette pairs unnamed salutations with \"Yours faithfully,\" and named salutations with \"Yours sincerely,\"."
  },
  {
    "id": "kcse_eng_e4",
    "subject": "english",
    "topicId": "eng_func",
    "difficulty": "easy",
    "question": "Which document is strictly used for internal official communication within the same school, ministry, or company rather than to external organizations?",
    "options": [
      "Affidavit",
      "Internal Memorandum (Memo)",
      "Letter of Inquiry",
      "Curriculum Vitae"
    ],
    "correctIndex": 1,
    "explanation": "An internal memorandum (memo) uses TO, FROM, DATE, REF, and SUBJECT headers without external postal addresses to convey official notices inside one institution.",
    "concept": "Memos handle internal institutional communication, whereas formal letters carry two postal addresses for external correspondence."
  },
  {
    "id": "kcse_eng_e5",
    "subject": "english",
    "topicId": "eng_oral",
    "difficulty": "easy",
    "question": "Identify the silent letter in the word \"subtle\".",
    "options": [
      "l",
      "b",
      "e",
      "t"
    ],
    "correctIndex": 1,
    "explanation": "The word \"subtle\" is pronounced /s^tl/; the letter \"b\" is completely silent, just as in \"debt\" and \"doubt\".",
    "concept": "English orthography retains historical Latin consonants (such as b in subtle, debt, plumber) that are silent in speech."
  },
  {
    "id": "kcse_eng_e6",
    "subject": "english",
    "topicId": "eng_oral",
    "difficulty": "easy",
    "question": "Which word below is a true homophone (pronounced identically) of the word \"heir\"?",
    "options": [
      "hare",
      "air",
      "hair",
      "here"
    ],
    "correctIndex": 1,
    "explanation": "In \"heir\", the initial \"h\" is completely silent (/e@/), making it an exact homophone of \"air\". By contrast, \"hair\" and \"hare\" begin with a pronounced /h/ sound.",
    "concept": "Homophones share identical phonetic pronunciation despite differing in spelling and meaning (e.g. heir/air, ewe/you,flour/flower)."
  },
  {
    "id": "kcse_eng_e7",
    "subject": "english",
    "topicId": "eng_poet",
    "difficulty": "easy",
    "question": "In poetry analysis, what does the term \"persona\" refer to?",
    "options": [
      "The biographical poet who wrote the poem",
      "The voice or character speaking inside the poem",
      "The villain opposing the central message",
      "The reader or audience addressed by the poem"
    ],
    "correctIndex": 1,
    "explanation": "A poet often adopts an imagined voice—such as a child, an outcast, or a grieving parent—to speak in the poem. That speaking voice is the persona and must never be conflated with the poet.",
    "concept": "Always distinguish the persona (dramatic speaker within the text) from the author/poet."
  },
  {
    "id": "kcse_eng_e8",
    "subject": "english",
    "topicId": "eng_poet",
    "difficulty": "easy",
    "question": "Identify the stylistic device in the line: \"The greedy goats gobbled the green grass.\"",
    "options": [
      "Onomatopoeia",
      "Alliteration",
      "Assonance",
      "Oxymoron"
    ],
    "correctIndex": 1,
    "explanation": "Repetition of the initial consonant sound /g/ at the start of closely placed words (\"greedy goats gobbled... green grass\") is alliteration.",
    "concept": "Alliteration repeats initial consonant sounds in neighbouring words to create rhythm, musicality, or emphasis."
  },
  {
    "id": "kcse_eng_e9",
    "subject": "english",
    "topicId": "eng_comp",
    "difficulty": "easy",
    "question": "Replace the underlined words with the correct phrasal verb: \"The games master cancelled the tournament because of heavy rain.\"",
    "options": [
      "put off",
      "called off",
      "turned down",
      "called out"
    ],
    "correctIndex": 1,
    "explanation": "\"Call off\" means to cancel completely, whereas \"put off\" means to postpone to a later date and \"turn down\" means to reject an offer.",
    "concept": "Precision with phrasal verb particles is essential: \"call off\" = cancel; \"put off\" = postpone."
  },
  {
    "id": "kcse_eng_e10",
    "subject": "english",
    "topicId": "eng_comp",
    "difficulty": "easy",
    "question": "Fill in the blank with the correct preposition: \"The suspect was charged ________ obtaining money by false pretences.\"",
    "options": [
      "with",
      "on",
      "of",
      "for"
    ],
    "correctIndex": 0,
    "explanation": "In standard legal and grammatical collocation, a person is \"accused of\" an offence, \"arrested for\" an offence, and formally \"charged with\" an offence.",
    "concept": "Verb-preposition collocations are fixed: accuse of, charge with, convict of, acquit of."
  },
  {
    "id": "kcse_eng_m1",
    "subject": "english",
    "topicId": "eng_gram",
    "difficulty": "medium",
    "question": "Choose the sentence that correctly rewrites: \"As soon as the invigilator entered the hall, the bell rang,\" beginning with \"No sooner...\"",
    "options": [
      "No sooner the invigilator entered the hall than the bell rang.",
      "No sooner did the invigilator entered the hall than the bell rang.",
      "No sooner had the invigilator entered the hall when the bell rang.",
      "No sooner had the invigilator entered the hall than the bell rang."
    ],
    "correctIndex": 3,
    "explanation": "Fronting the negative adverbial \"No sooner\" triggers subject-auxiliary inversion (\"had the invigilator entered\") and strictly pairs with the conjunction \"than\" (never \"when\", which pairs with \"Hardly/Scarcely\").",
    "concept": "\"No sooner + had + subject + past participle + than...\" vs \"Hardly/Scarcely + had + subject + past participle + when...\"."
  },
  {
    "id": "kcse_eng_m2",
    "subject": "english",
    "topicId": "eng_gram",
    "difficulty": "medium",
    "question": "Identify the grammatical function of the underlined clause: \"The laboratory technician who repaired the microscope has been promoted.\" (\"who repaired the microscope\")",
    "options": [
      "Noun clause acting as complement of the subject",
      "Adverbial clause of reason modifying \"has been promoted\"",
      "Non-defining relative clause adding parenthetical detail",
      "Defining (restrictive) adjectival/relative clause modifying \"technician\""
    ],
    "correctIndex": 3,
    "explanation": "Without commas, \"who repaired the microscope\" restricts and identifies which specific technician is meant, functioning as a defining relative (adjectival) clause post-modifying the noun \"technician\".",
    "concept": "Defining relative clauses lack commas and restrict the antecedent noun; non-defining clauses use commas and add extra info."
  },
  {
    "id": "kcse_eng_m3",
    "subject": "english",
    "topicId": "eng_func",
    "difficulty": "medium",
    "question": "When recording official club minutes, under which specific section do members discuss follow-up actions from the previous meeting that are NOT standalone items on today's main agenda?",
    "options": [
      "Confirmation of Previous Minutes",
      "Preliminaries",
      "Any Other Business (AOB)",
      "Matters Arising"
    ],
    "correctIndex": 3,
    "explanation": "\"Confirmation of Previous Minutes\" verifies accuracy (proposed and seconded), while \"Matters Arising\" tracks the status or implementation of resolutions passed in that previous meeting.",
    "concept": "In KNEC minute structure, Confirmation establishes accuracy of the record; Matters Arising audits execution of prior resolutions."
  },
  {
    "id": "kcse_eng_m4",
    "subject": "english",
    "topicId": "eng_func",
    "difficulty": "medium",
    "question": "In a formal investigative report commissioned by a school principal, which section states the scope, mandate, who commissioned the report, and the submission deadline?",
    "options": [
      "Conclusion",
      "Findings",
      "Recommendations",
      "Introduction / Terms of Reference"
    ],
    "correctIndex": 3,
    "explanation": "The Introduction (incorporating Terms of Reference) specifies who authorized the inquiry, the exact issue investigated, scope, and deadline before Methodology, Findings, Conclusion, and Recommendations.",
    "concept": "Formal reports follow a logical sequence: Title -> Introduction/Terms of Reference -> Procedure/Methodology -> Findings -> Conclusion -> Recommendations -> Signing off."
  },
  {
    "id": "kcse_eng_m5",
    "subject": "english",
    "topicId": "eng_oral",
    "difficulty": "medium",
    "question": "Where does primary syllable stress fall in the underlined word: \"The factory will produce solar panels in Nakuru\"? (\"produce\")",
    "options": [
      "PRO-duce (first syllable)",
      "Unstressed throughout",
      "Equal stress on both syllables",
      "pro-DUCE (second syllable)"
    ],
    "correctIndex": 3,
    "explanation": "For two-syllable English noun/verb pairs (produce, export, record, rebel, conduct), nouns/adjectives carry stress on the first syllable (PRO-duce), whereas verbs shift stress to the second syllable (pro-DUCE).",
    "concept": "Disyllabic word-class pairs place stress on syllable 1 for nouns/adjectives and syllable 2 for verbs."
  },
  {
    "id": "kcse_eng_m6",
    "subject": "english",
    "topicId": "eng_oral",
    "difficulty": "medium",
    "question": "During an oral narrative performance, the narrator suddenly lowers their voice to a whisper and leans forward before naming the ogre. Which delivery feature is being combined here?",
    "options": [
      "Audience participation and ideophones",
      "Opening formula and code-switching",
      "Rhetorical questioning and mimicry",
      "Tonal/volume variation (paralinguistic) and body posture (non-verbal cue)"
    ],
    "correctIndex": 3,
    "explanation": "Whispering varies vocal volume/projection (a vocal/paralinguistic cue), while leaning forward uses posture/proxemics (a non-verbal kinesic cue) to heighten suspense.",
    "concept": "KNEC Oral Skills distinguishes verbal/vocal cues (pitch, pace, volume, pause) from non-verbal kinesic cues (gestures, facial expressions, posture)."
  },
  {
    "id": "kcse_eng_m7",
    "subject": "english",
    "topicId": "eng_poet",
    "difficulty": "medium",
    "question": "A four-line stanza ends with the words: \"light\", \"stone\", \"bright\", \"alone\". What is its rhyme scheme, and is it regular or irregular?",
    "options": [
      "abba — regular enclosed rhyme scheme",
      "abcb — irregular rhyme scheme",
      "aabb — regular coupled rhyme scheme",
      "abab — regular alternate rhyme scheme"
    ],
    "correctIndex": 3,
    "explanation": "\"light\" (/lait/) = a, \"stone\" (/stoun/) = b, \"bright\" (/brait/) = a, \"alone\" (/aloun/) = b. Because the pattern abab is predictable and systematic, it is a regular rhyme scheme.",
    "concept": "Assign rhyme letters strictly by terminal vowel-consonant sounds (/lait/ and /brait/), not visual spelling."
  },
  {
    "id": "kcse_eng_m8",
    "subject": "english",
    "topicId": "eng_poet",
    "difficulty": "medium",
    "question": "In Kenyan oral literature, what is the primary social function of a \"dilemma narrative\"?",
    "options": [
      "To lull infants to sleep using repetitive soothing rhythms",
      "To explain the natural origin of physical features such as lakes or mountains",
      "To praise the military ancestry of a historical warrior",
      "To sharpen critical thinking, moral reasoning, and debate among listeners"
    ],
    "correctIndex": 3,
    "explanation": "A dilemma story ends with an unresolved moral or practical choice between two difficult options, inviting the audience to debate ethical priorities and sharpen analytical judgement.",
    "concept": "Oral narrative sub-genres serve distinct functions: aetiological/explanatory myths explain origins, legends honour heroes, and dilemma tales cultivate moral debate."
  },
  {
    "id": "kcse_eng_m9",
    "subject": "english",
    "topicId": "eng_comp",
    "difficulty": "medium",
    "question": "In a KNEC Paper 2 summary question stating \"In not more than 55 words, summarise the causes of soil erosion,\" what happens if a candidate writes 72 words or uses bulleted fragments instead of continuous prose?",
    "options": [
      "Only spelling errors are penalized while all 72 words are marked normally",
      "The entire Paper 2 script is disqualified",
      "Bullet points earn bonus marks for clarity and neatness",
      "Anything beyond 55 words is crossed out/unscored, and note-form attracts a 50% mark deduction per point"
    ],
    "correctIndex": 3,
    "explanation": "KNEC summary marking rules stop awarding points past the word-count cut-off line and penalize non-prose (bulleted/numbered notes) by deducting half the marks earned (or penalizing expression) when continuous prose is required.",
    "concept": "Summary writing tests synthesis and conciseness: draft rough points first, then connect them into grammatically complete sentences strictly inside the word limit."
  },
  {
    "id": "kcse_eng_m10",
    "subject": "english",
    "topicId": "eng_comp",
    "difficulty": "medium",
    "question": "Choose the correct pronoun case: \"Between you and ________, nobody expected the debate motion to be so contentious.\"",
    "options": [
      "we",
      "myself",
      "me",
      "I"
    ],
    "correctIndex": 2,
    "explanation": "\"Between\" is a preposition and requires object-case pronouns for its entire compound object (\"you and me\"). \"Between you and I\" is a hypercorrection error, and \"myself\" is reflexive (used only when \"I\" is already the clause subject).",
    "concept": "All prepositions govern the objective pronoun case (me, him, her, us, them, whom)."
  },
  {
    "id": "kcse_eng_d1",
    "subject": "english",
    "topicId": "eng_gram",
    "difficulty": "difficult",
    "question": "Identify the sentence that is completely free of dangling or misplaced participial modifiers:",
    "options": [
      "Walking past the chemistry laboratory, Wanjiru noticed pungent fumes escaping from the window.",
      "Walking past the chemistry laboratory, pungent fumes were noticed escaping from the window.",
      "Exhausted after the marathon, the medal was presented to Kiprop by the governor.",
      "Having been left open overnight, the watchman locked the main gate at dawn."
    ],
    "correctIndex": 0,
    "explanation": "An introductory participial phrase (\"Walking past the chemistry laboratory\") must grammatically modify the subject of the main clause immediately following the comma. Only Wanjiru (not fumes, a medal, or the watchman who wasn't left open!) performs that action.",
    "concept": "To eliminate a dangling participle, ensure the noun immediately after the introductory phrase is the logical doer/experiencer of the participle."
  },
  {
    "id": "kcse_eng_d2",
    "subject": "english",
    "topicId": "eng_gram",
    "difficulty": "difficult",
    "question": "Supply the accurate question tag for the sentence: \"Everyone attended the career guidance seminar, ________?\"",
    "options": [
      "didn't he",
      "wasn't it",
      "didn't they",
      "did they"
    ],
    "correctIndex": 2,
    "explanation": "Although \"everyone\" takes a singular verb in a statement, question tags replace human indefinite pronouns (everyone, someone, nobody, anybody) with the plural pronoun \"they\". Positive past simple \"attended\" takes negative auxiliary \"didn't\" -> \"didn't they?\".",
    "concept": "Indefinite human pronouns (everyone, nobody, somebody) take \"they\" in question tags; note also that \"Nobody came\" is negative, so it takes positive \"did they?\"."
  },
  {
    "id": "kcse_eng_d3",
    "subject": "english",
    "topicId": "eng_func",
    "difficulty": "difficult",
    "question": "When formatting a Book Review in KNEC Paper 1, which essential bibliographic header block must precede the body critique?",
    "options": [
      "Title, Author, Publisher, Year of Publication, Price/Pages, and Reviewer's Name",
      "Members Present, Absent with Apology, In Attendance, and Agenda",
      "Sender's Address, Recipient's Address, Salutation, and Reference Number",
      "Plaintiff, Defendant, Affidavit Oath, and Commissioner of Oaths Stamp"
    ],
    "correctIndex": 0,
    "explanation": "A standard KNEC book review opens with structured publication metadata (Book Title, Author, Publisher, Year, Pages/ISBN/Price, Reviewer) before summarizing plot/themes, evaluating strengths/weaknesses, and recommending a target readership without spoiling every twist.",
    "concept": "Book reviews combine publication metadata with analytical evaluation (style, characterization, relevance) rather than mere plot retelling."
  },
  {
    "id": "kcse_eng_d4",
    "subject": "english",
    "topicId": "eng_func",
    "difficulty": "difficult",
    "question": "In formal parliamentary or board meeting minutes, what does the heading \"IN ATTENDANCE\" signify?",
    "options": [
      "Committee members who sent written apologies prior to the meeting",
      "Members who walked out before adjournment",
      "Non-members invited to attend in an advisory or technical capacity without voting rights",
      "Regular committee members who arrived on time and signed the register"
    ],
    "correctIndex": 2,
    "explanation": "\"Members Present\" lists bona fide committee members; \"In Attendance\" specifically records invited guests or resource persons (e.g., an external auditor, architect, or patron) who are not voting members of that committee.",
    "concept": "Distinguish Members Present (voting members), Absent with Apology, Absent without Apology, and In Attendance (invited non-members)."
  },
  {
    "id": "kcse_eng_d5",
    "subject": "english",
    "topicId": "eng_oral",
    "difficulty": "difficult",
    "question": "Which set of words below contains the exact same vowel sound /3:/ (as in \"bird\") in all three words?",
    "options": [
      "word, journey, colonel",
      "Bury, furry, hurry",
      "beard, heard, heart",
      "blood, flood, brood"
    ],
    "correctIndex": 0,
    "explanation": "\"word\" (/w3:d/), \"journey\" (/d33:ni/), and \"colonel\" (/k3:nl/) all share the long central vowel /3:/. In the distractors: beard (/i@/), heart (/a:/); brood (/u:/); bury (/e/).",
    "concept": "English vowel spelling is non-phonemic; \"colonel\" is pronounced identically to \"kernel\" (/k3:nl/)."
  },
  {
    "id": "kcse_eng_d6",
    "subject": "english",
    "topicId": "eng_oral",
    "difficulty": "difficult",
    "question": "During formal group negotiations over a disputed boundary, which strategy exemplifies principled win-win negotiation skill?",
    "options": [
      "Changing the subject whenever the opposing speaker presents factual evidence",
      "Issuing a non-negotiable ultimatum at the opening of talks to anchor authority",
      "Listening actively without interrupting, acknowledging the other party's underlying interests, and proposing objective middle-ground options",
      "Raising vocal volume to dominate turn-taking until the other side concedes out of fatigue"
    ],
    "correctIndex": 2,
    "explanation": "Effective negotiation relies on polite turn-taking, active listening, separating people from the problem, acknowledging shared/legitimate interests, and generating mutually acceptable compromises.",
    "concept": "KNEC Oral Skills assesses negotiation etiquette through concession-making, courteous hedging, turn-taking, and interest-based compromise."
  },
  {
    "id": "kcse_eng_d7",
    "subject": "english",
    "topicId": "eng_poet",
    "difficulty": "difficult",
    "question": "Read the lines: \"The ambulance screeched past the luxurious banquet hall / Where senators toasted famine relief budgets with champagne.\" Which literary device dominates this juxtaposition?",
    "options": [
      "Situational/Satiric Irony",
      "Euphemism",
      "Apostrophe",
      "Litotes"
    ],
    "correctIndex": 0,
    "explanation": "Toasting \"famine relief\" with luxury champagne inside a banquet hall exposes a sharp, biting contradiction between professed public duty and self-indulgent reality—classic satiric/situational irony.",
    "concept": "Irony highlights incongruity between appearance/expectation and reality to critique hypocrisy or social injustice."
  },
  {
    "id": "kcse_eng_d8",
    "subject": "english",
    "topicId": "eng_poet",
    "difficulty": "difficult",
    "question": "When an oral literature researcher translates a Luo or Agikuyu dirge into English for written archiving, what inevitable limitation occurs?",
    "options": [
      "Complete preservation of every paralinguistic gesture, pitch contour, and facial expression",
      "Conversion of the dirge into a proverb",
      "Loss of original tonal nuances, performance spontaneity, drum/musical accompaniment, and live audience response",
      "Automatic elimination of all metaphors and imagery from the text"
    ],
    "correctIndex": 2,
    "explanation": "Written translation freezes a dynamic live performance into static text: indigenous tonal patterns, ideophonic cadence, dance/accompaniment, and live audience interaction are lost in transcription and translation.",
    "concept": "Oral literature lives in performance; transcription and translation suffer loss of visual, musical, tonal, and participatory dimensions."
  },
  {
    "id": "kcse_eng_d9",
    "subject": "english",
    "topicId": "eng_comp",
    "difficulty": "difficult",
    "question": "Explain the exact difference in meaning between: (i) \"The delegates stopped to smoke\" and (ii) \"The delegates stopped smoking.\"",
    "options": [
      "(i) means they paused another journey/activity in order to smoke; (ii) means they quit/ceased the habit or act of smoking",
      "Both sentences have identical meaning in formal English",
      "(i) means they quit smoking permanently; (ii) means they paused walking so they could smoke",
      "(i) refers to past habit whereas (ii) refers to future intention"
    ],
    "correctIndex": 0,
    "explanation": "After \"stop\", the to-infinitive (\"to smoke\") expresses purpose (\"in order to smoke\"), whereas the gerund (\"smoking\") functions as direct object denoting the activity that was discontinued.",
    "concept": "Verbs like stop, remember, forget, and regret change meaning depending on whether they take a gerund (-ing) or a to-infinitive."
  },
  {
    "id": "kcse_eng_d10",
    "subject": "english",
    "topicId": "eng_comp",
    "difficulty": "difficult",
    "question": "Rewrite correctly in indirect (reported) speech: \"\"If I had seen the circular yesterday, I would have submitted my form,\" Kamau said.\"",
    "options": [
      "Kamau said that had he seen the circular tomorrow, he will have submitted his form.",
      "Kamau said that if he had seen the circular the previous day, he would have submitted his form.",
      "Kamau said that if he saw the circular yesterday, he would submit his form.",
      "Kamau said if I had seen the circular the day before, I would have submitted my form."
    ],
    "correctIndex": 1,
    "explanation": "Third-conditional verbs (\"had seen... would have submitted\") are already in the past perfect / modal perfect and cannot backshift further, while pronouns (\"I/my\" -> \"he/his\") and time deictics (\"yesterday\" -> \"the previous day / the day before\") must shift.",
    "concept": "In reported speech, Type 3 conditionals retain their past perfect verb forms while shifting pronouns and time/place adverbs."
  },
  {
    "id": "kcse_kis_e1",
    "subject": "kiswahili",
    "topicId": "kis_sar",
    "difficulty": "easy",
    "question": "Nomino \"kipofu\" na \"kiziwi\" huainishwa katika ngeli ipi ya kisasa (kisarufi)?",
    "options": [
      "A - WA",
      "I - ZI",
      "KI - VI",
      "U - I"
    ],
    "correctIndex": 0,
    "explanation": "Ingawa nomino \"kipofu\" huanza kwa kiambishi \"ki-\", inataja kiumbe hai na huchukua upatanisho wa kisarufi wa ngeli ya A-WA: \"Kipofu amefika / Vipofu wamefika\".",
    "concept": "Uainishaji wa kisasa wa ngeli huzingatia upatanisho wa kisarufi kwenye kitenzi (a- / wa-), si silabi ya kwanza ya nomino."
  },
  {
    "id": "kcse_kis_e2",
    "subject": "kiswahili",
    "topicId": "kis_sar",
    "difficulty": "easy",
    "question": "Kitenzi \"someana\" kiko katika kauli ipi ya mnyambuliko wa vitenzi?",
    "options": [
      "Kauli ya kutendeka",
      "Kauli ya kutendesha",
      "Kauli ya kutendeana",
      "Kauli ya kutendewa"
    ],
    "correctIndex": 2,
    "explanation": "Kutokana na mzizi \"som-\", kuongeza viambishi \"-ean-a\" (\"someana\") huonyesha kutendeana (kufanyiana kitendo kwa pamoja/kupokezana).",
    "concept": "Kauli ya kutendeana huishia kwa -ana / -iana / -eana kuonyesha ushirikiano kati ya watendaji wawili au zaidi."
  },
  {
    "id": "kcse_kis_e3",
    "subject": "kiswahili",
    "topicId": "kis_nya",
    "difficulty": "easy",
    "question": "Kanusha sentensi ifuatayo kwa usahihi: \"Mwanafunzi amemaliza mtihani.\"",
    "options": [
      "Mwanafunzi hajamaliza mtihani.",
      "Mwanafunzi hakumaliza mtihani.",
      "Mwanafunzi hamalizi mtihani.",
      "Mwanafunzi hatamaliza mtihani."
    ],
    "correctIndex": 0,
    "explanation": "Hali timilifu (-me-) hukanushwa kwa kutumia kiambishi cha ukanusho wa hali ya kutotimia bado (-ja-): \"amemaliza\" -> \"hajamaliza\". \"-ku-\" ni ukanusho wa wakati uliopita (-li-).",
    "concept": "Katika ukanushaji wa Kiswahili sanifu, kiambishi cha hali timilifu (-me-) hubadilika kuwa (-ja-)."
  },
  {
    "id": "kcse_kis_e4",
    "subject": "kiswahili",
    "topicId": "kis_nya",
    "difficulty": "easy",
    "question": "Tambua kiambishi cha wakati au hali katika kitenzi: \"Watakapowasili\".",
    "options": [
      "wa- (nafsi ya tatu wingi)",
      "-po- (kirejeshi cha wakati)",
      "-ta- (wakati ujao)",
      "-ka- (hali ya mfuatano)"
    ],
    "correctIndex": 2,
    "explanation": "Katika \"wa-ta-ka-po-wasil-i\": \"wa-\" ni kiambishi cha nafsi/ngeli, \"-ta-\" ni wakati ujao (\"-taka-\" hutumika kabla ya kirejeshi \"-po-\"), na \"wasil\" ni mzizi.",
    "concept": "Wakati ujao unapofuatwa na kirejeshi (-po-, -cho-, -ye-), kiambishi \"-ta-\" hurefushwa kuwa \"-taka-\"."
  },
  {
    "id": "kcse_kis_e5",
    "subject": "kiswahili",
    "topicId": "kis_isi",
    "difficulty": "easy",
    "question": "Kauli kama \"Mheshimiwa Spika, naomba kuwasilisha hoja ya dharura kuhusu bajeti\" hutumika katika sajili gani?",
    "options": [
      "Sajili ya bungeni",
      "Sajili ya mahakamani",
      "Sajili ya hospitalini",
      "Sajili ya sokoni"
    ],
    "correctIndex": 0,
    "explanation": "Maneno kama \"Mheshimiwa Spika\", \"hoja\", \"mswada\", na \"kanuni za kudumu\" ni msamiati maalum wa sajili ya bungeni.",
    "concept": "Kila sajili ya lugha huwa na msamiati wa kiufundi unaotambulisha muktadha wa mawasiliano."
  },
  {
    "id": "kcse_kis_e6",
    "subject": "kiswahili",
    "topicId": "kis_isi",
    "difficulty": "easy",
    "question": "Mzungumzaji anapochopeka maneno ya Kiingereza ndani ya sentensi moja ya Kiswahili (k.m. \"Nimetuma ile report kwa email\"), hali hii huitwaje katika Isimujamii?",
    "options": [
      "Kuhamisha msimbo wa kudumu",
      "Lahaja ya kijiografia",
      "Kuchanganya ndimi",
      "Kubadili ndimi"
    ],
    "correctIndex": 2,
    "explanation": "Kuchanganya ndimi (code-mixing) hutokea ndani ya sentensi moja, ilhali kubadili ndimi (code-switching) ni kuhama kutoka lugha moja hadi nyingine katika sentensi kamili zinazofuatana.",
    "concept": "Tofautisha kuchanganya ndimi (ndani ya sentensi moja) na kubadili ndimi (kutoka sentensi moja hadi nyingine)."
  },
  {
    "id": "kcse_kis_e7",
    "subject": "kiswahili",
    "topicId": "kis_fas",
    "difficulty": "easy",
    "question": "Shairi lenye mishororo minne katika kila ubeti huitwaje?",
    "options": [
      "Tarbia",
      "Tathnia",
      "Tathlitha",
      "Takhmisa"
    ],
    "correctIndex": 0,
    "explanation": "Tathnia = mishororo 2; Tathlitha = mishororo 3; Tarbia = mishororo 4; Takhmisa = mishororo 5 katika kila ubeti.",
    "concept": "Bahari za mashairi kulingana na idadi ya mishororo kwa ubeti: Tathnia (2), Tathlitha (3), Tarbia (4), Takhmisa (5)."
  },
  {
    "id": "kcse_kis_e8",
    "subject": "kiswahili",
    "topicId": "kis_fas",
    "difficulty": "easy",
    "question": "Katika Fasihi Simulizi, hadithi ambazo wahusika wake wakuu ni wanyama wanaopewa tabia za kibinadamu (kama Sungura mjanja na Fisi mlafi) huitwaje?",
    "options": [
      "Tarihi",
      "Visasili",
      "Hurafa",
      "Mighani (Visakale)"
    ],
    "correctIndex": 2,
    "explanation": "Hurafa (fables) ni ngano zinazotumia wanyama kuwakilisha tabia za binadamu; Visasili hueleza asili ya mambo, na Mighani huzungumzia mashujaa wa jamii.",
    "concept": "Vipera vya hadithi za Fasihi Simulizi: Hurafa (wanyama), Hekaya (visa vya ujanja wa binadamu), Mighani (mashujaa), Visasili (asili)."
  },
  {
    "id": "kcse_kis_e9",
    "subject": "kiswahili",
    "topicId": "kis_ins",
    "difficulty": "easy",
    "question": "Nini maana ya nahau \"kupiga darubini\"?",
    "options": [
      "Kuchunguza jambo kwa makini sana",
      "Kutazama nyota angani usiku",
      "Kuvunja kifaa cha maabara",
      "Kusafiri mwendo mrefu"
    ],
    "correctIndex": 0,
    "explanation": "Nahau \"kupiga darubini\" ina maana fiche ya kutafiti, kukagua, au kuchunguza jambo kwa undani na umakini.",
    "concept": "Nahau huwa na maana ya kimafumbo (isiyo ya moja kwa moja ya maneno yaliyounda nahau hiyo)."
  },
  {
    "id": "kcse_kis_e10",
    "subject": "kiswahili",
    "topicId": "kis_ins",
    "difficulty": "easy",
    "question": "Tofauti kuu kati ya \"Tawasifu\" na \"Wasifu\" katika uandishi wa insha ni ipi?",
    "options": [
      "Tawasifu hutumia nafsi ya tatu pekee, ilhali Wasifu hutumia nafsi ya kwanza",
      "Tawasifu huandikwa na mtu kuhusu maisha yake mwenyewe (nafsi ya kwanza), ilhali Wasifu huandikwa na mtu mwingine kumhusu mtu fulani (nafsi ya tatu)",
      "Tawasifu huandikwa kuhusu marehemu pekee, ilhali Wasifu ni fomu ya kuomba kazi",
      "Hakuna tofauti kati ya Tawasifu na Wasifu"
    ],
    "correctIndex": 1,
    "explanation": "Tawasifu (autobiography) hutumia nafsi ya kwanza (\"Nilizaliwa...\"), ilhali Wasifu (biography) husimulia maisha ya mtu mwingine kwa nafsi ya tatu (\"Alizaliwa...\"). Orodha ya sifa za kuomba kazi ni Wasifukazi (CV).",
    "concept": "Zingatia tofauti ya Tawasifu (maisha yako mwenyewe), Wasifu (maisha ya mwingine), na Wasifukazi (CV)."
  },
  {
    "id": "kcse_kis_m1",
    "subject": "kiswahili",
    "topicId": "kis_sar",
    "difficulty": "medium",
    "question": "Andika kwa wingi sentensi ifuatayo: \"Uzi mrefu umenunuliwa na fundi.\"",
    "options": [
      "Mizi mirefu imenunuliwa na mafundi.",
      "Nyuzi mirefu zimenunuliwa na wafundi.",
      "Nyuzi ndefu zimenunuliwa na mafundi.",
      "Uzi ndefu zimenunuliwa na mafundi."
    ],
    "correctIndex": 2,
    "explanation": "\"Uzi\" iko katika ngeli ya U-ZI (umoja: uzi mrefu umenunuliwa; wingi: nyuzi ndefu zimenunuliwa), na \"fundi\" iko katika ngeli ya A-WA yenye kiambishi cha wingi \"ma-\" (\"mafundi\").",
    "concept": "Nomino za ngeli ya U-ZI hubadilisha kivumishi cha -refu kuwa \"ndefu\" katika wingi kutokana na athari ya nazali N + r -> nd."
  },
  {
    "id": "kcse_kis_m2",
    "subject": "kiswahili",
    "topicId": "kis_sar",
    "difficulty": "medium",
    "question": "Changanua mofimu katika kitenzi \"Alimchezea\" kwa kubainisha mzizi wake sahihi.",
    "options": [
      "a- (nafsi) + -li- (wakati) + -m- (yambwa/mtendewa) + -chez- (mzizi) + -e- (kauli ya kutendea) + -a (kiishio)",
      "ali- (wakati) + -m- (nafsi) + -cheze- (mzizi) + -a (kiishio)",
      "a- (ngeli) + -li- (hali) + -m- (kirejeshi) + -cheza (mzizi)",
      "a- (nafsi) + -li- (wakati) + -mchez- (mzizi) + -ea (kiishio)"
    ],
    "correctIndex": 0,
    "explanation": "Mzizi wa kitenzi \"cheza\" ni \"-chez-\". Kabla ya mzizi kuna viambishi awali (a-li-m-) na baada ya mzizi kuna kiambishi tamati cha mnyambuliko (-e-) cha kauli ya kutendea pamoja na kiishio (-a).",
    "concept": "Mzizi wa kitenzi cha Kibantu hubaki thabiti bila viambishi awali wala kiishio (-chez-, -som-, -lim-)."
  },
  {
    "id": "kcse_kis_m3",
    "subject": "kiswahili",
    "topicId": "kis_nya",
    "difficulty": "medium",
    "question": "Sentensi \"Ingawa mvua ilinyesha sana, wakulima walipanda mahindi mapema\" ni aina gani ya sentensi kimuundo?",
    "options": [
      "Kirai nomino",
      "Sentensi ambatano",
      "Sentensi changamano",
      "Sentensi sahili"
    ],
    "correctIndex": 2,
    "explanation": "Sentensi hii ina kishazi tegemezi (\"Ingawa mvua ilinyesha sana\") kinachoongozwa na kiunganishi tegemezi \"ingawa\", kikifuatwa na kishazi huru (\"wakulima walipanda mahindi mapema\")—huu ni muundo wa sentensi changamano.",
    "concept": "Sentensi changamano huundwa kwa kishazi tegemezi kimoja au zaidi pamoja na kishazi huru; sentensi ambatano huunganisha vishazi huru kwa viunganishi kama \"na\", \"lakini\", \"au\"."
  },
  {
    "id": "kcse_kis_m4",
    "subject": "kiswahili",
    "topicId": "kis_nya",
    "difficulty": "medium",
    "question": "Tambua aina ya shamirisho (yambwa) iliyopigiwa mstari katika sentensi: \"Mama alimpikia mgeni wali kwa chungu.\" (neno: \"mgeni\")",
    "options": [
      "Shamirisho kitondo",
      "Shamirisho ala",
      "Chagizo cha mahali",
      "Shamirisho kipozi"
    ],
    "correctIndex": 0,
    "explanation": "Katika sentensi hii: \"wali\" ni shamirisho kipozi (kitu kinachotendwa moja kwa moja), \"mgeni\" ni shamirisho kitondo (mnufaika anayetendewa kitendo), na \"chungu\" ni shamirisho ala (kifaa kilichotumika).",
    "concept": "Katika uchanganuzi wa kikazi: Kipozi = kitendwa moja kwa moja; Kitondo = mtendewa/mnufaika; Ala = kifaa kilichotumiwa."
  },
  {
    "id": "kcse_kis_m5",
    "subject": "kiswahili",
    "topicId": "kis_isi",
    "difficulty": "medium",
    "question": "Ni sifa ipi kati ya hizi inayoitofautisha sajili ya mahakamani na sajili ya matangazo ya mpira?",
    "options": [
      "Sajili ya mahakamani haina utaratibu wa zamu za kuzungumza",
      "Sajili ya mahakamani hutumia chuku nyingi, lugha ya utani, na sentensi fupifupi zisizokamilika",
      "Sajili ya mahakamani hutumia vifungu vya sheria, msamiati rasmi/wa kale (k.m. mlalamishi, mshtakiwa, rufaa), na sentensi ndefu zenye urasmi mkubwa",
      "Sajili ya matangazo ya mpira hutumia vifungu vya katiba na kiapo cha mahakama pekee"
    ],
    "correctIndex": 2,
    "explanation": "Lugha ya mahakamani ni rasmi mno, inazingatia itifaki (\"Mheshimiwa Jaji\"), maneno ya kisheria (dhamana, shahidi, mlalamishi), na marejeleo ya vifungu vya sheria ili kuepuka utata.",
    "concept": "Sajili ya sheria/mahakamani hudumisha urasmi, utohozi/msamiati maalum, na uwazi usioruhusu fasiri mbili."
  },
  {
    "id": "kcse_kis_m6",
    "subject": "kiswahili",
    "topicId": "kis_isi",
    "difficulty": "medium",
    "question": " Lahaja za Kiswahili kama Kimvita (Mombasa), Kiamu (Lamu), na Kiunguja (Zanzibar) zilitokana hasa na sababu gani?",
    "options": [
      "Umbali wa kijiografia na mwingiliano tofauti wa kijamii/kibiashara kando ya Pwani ya Afrika Mashariki",
      "Amri ya Bunge la Afrika Mashariki mwaka wa 1963",
      "Kukosekana kwa bahari kati ya miji ya Pwani",
      "Matumizi ya mitandao ya kijamii pekee katika karne ya ishirini na moja"
    ],
    "correctIndex": 0,
    "explanation": "Kutengana kijiografia (visiwa na miji ya pwani) pamoja na mwingiliano na jamii tofauti kulizua tofauti za kimatamshi na kimsamiati (lahaja). Kiunguja ndicho kilichoteuliwa kuwa msingi wa Kiswahili Sanifu mwaka 1930.",
    "concept": "Lahaja za kijiografia huzuka kutokana na umbali wa maeneo na vizuizi vya kimaumbile; Kiswahili Sanifu kilijengwa juu ya lahaja ya Kiunguja."
  },
  {
    "id": "kcse_kis_m7",
    "subject": "kiswahili",
    "topicId": "kis_fas",
    "difficulty": "medium",
    "question": "Hesabu idadi ya mizani katika mshororo huu wa shairi la kimapokeo: \"Elimu ni taa yetu, gizani inatuongoza\" — je, mshororo \"Elimu ni taa yetu, njia inatuonyesha\" una mizani mingapi?",
    "options": [
      "Mizani 12 (6 + 6)",
      "Mizani 14 (7 + 7)",
      "Mizani 16 (8 + 8)",
      "Mizani 18 (9 + 9)"
    ],
    "correctIndex": 2,
    "explanation": "Kipande cha ukwapi: E-li-mu ni ta-a ye-tu = silabi 8. Kipande cha utao: nji-a i-na-tu-o-nye-sha = silabi 8. Jumla ni mizani 16 (8 ukwapi, 8 utao).",
    "concept": "Katika ushairi wa Kiswahili, kila silabi inayotamkwa (ikiwemo irabu zinazofuatana kama ta-a na u-o) huhesabiwa kama mzani mmoja."
  },
  {
    "id": "kcse_kis_m8",
    "subject": "kiswahili",
    "topicId": "kis_fas",
    "difficulty": "medium",
    "question": "Mshairi anapofupisha neno \"walipokuja\" kuwa \"walipokuya\" au \"mema\" kuwa \"memaye\" ili kupata urari wa vina au mizani: je, kurefusha neno kwa kuongeza silabi (k.m. \"kenda\" -> \"kuenda\" au \"leta\" -> \"letea/letewa\" bila kubadili maana kama \"sana\" -> \"sanaye\") huitwaje?",
    "options": [
      "Mazida",
      "Inkisari",
      "Kuboronga sarufi",
      "Tabdila"
    ],
    "correctIndex": 0,
    "explanation": "Mazida ni uhuru wa mshairi wa kurefusha neno kwa kuongeza silabi ili kutimiza idadi ya mizani; Inkisari ni kufupisha neno; Tabdila ni kubadili sauti ya mwisho ili kupata kina bila kubadili idadi ya mizani.",
    "concept": "Uhuru wa mshairi: Inkisari (kufupisha), Mazida (kurefusha), Tabdila (kubadili herufi/kina), na Kuboronga sarufi (kupangua mpangilio wa maneno)."
  },
  {
    "id": "kcse_kis_m9",
    "subject": "kiswahili",
    "topicId": "kis_ins",
    "difficulty": "medium",
    "question": "Methali ipi kati ya hizi inalandana kimaana na methali \"Mpanda ovyo hula ovyo\"?",
    "options": [
      "Asiyesikia la mkuu huvunjika guu",
      "Damu ni nzito kuliko maji",
      "Utavuna ulichopanda",
      "Fimbo ya mbali haiui nyoka"
    ],
    "correctIndex": 2,
    "explanation": "\"Mpanda ovyo hula ovyo\" na \"Utavuna ulichopanda\" zote mbili husisitiza kuwa matokeo anayopata mtu hutegemea maandalizi au matendo yake ya awali.",
    "concept": "Methali hufumbata hekima kuhusu uhusiano wa chanzo na matokeo; kulinganisha methali huzingatia maana ya ndani badala ya maneno ya nje."
  },
  {
    "id": "kcse_kis_m10",
    "subject": "kiswahili",
    "topicId": "kis_ins",
    "difficulty": "medium",
    "question": "Katika uandishi wa Kumbukumbu za Mkutano (Minutes) kwa Kiswahili, sehemu ya \"Yaliyotokana na Kumbukumbu za Mkutano Uliopita\" huwekwa wapi?",
    "options": [
      "Kabla ya Ufunguzi na Orodha ya Waliohudhuria",
      "Mwishoni kabisa baada ya Mengineyo na Kufunga Mkutano",
      "Katika anwani ya barua ya mwaliko pekee",
      "Mara tu baada ya Kusomwa na Kuthibitishwa kwa Kumbukumbu za Mkutano Uliopita, kabla ya Agenda Kuu za siku hiyo"
    ],
    "correctIndex": 3,
    "explanation": "Mtiririko rasmi wa kumbukumbu ni: Kichwa -> Waliohudhuria -> Waliotuma Udhuru -> Waliokosa bila Udhuru -> Waalikwa -> Ufunguzi -> Kuthibitisha Kumbukumbu zilizopita -> Yaliyotokana na Kumbukumbu hizo -> Agenda za siku -> Mengineyo -> Kufunga.",
    "concept": "Kumbukumbu rasmi hufuata mpangilio maalum wa nambari (KUMB. 1/2026, KUMB. 2/2026...) na hutamatishwa kwa sahihi za Mwenyekiti na Katibu."
  },
  {
    "id": "kcse_kis_d1",
    "subject": "kiswahili",
    "topicId": "kis_sar",
    "difficulty": "difficult",
    "question": "Bainisha matumizi sahihi ya kiambishi \"ku-\" katika sentensi: \"Kuimba kwake kulimfurahisha mwalimu kule ukumbini.\"",
    "options": [
      "\"Kuimba\" na \"kule\" zote ni alama za ukanusho wa wakati uliopita",
      "\"Kuimba\" ni ngeli ya KU (kitenzi-jina), na \"kule\" ni kionyeshi cha mahali pasipodhihirika (ngeli ya PA-KU-MU)",
      "\"Ku-\" katika maneno yote mawili ni kiambishi cha ukubwa wa nomino",
      "\"Kuimba\" ni kiambishi cha mtendewa wa nafsi ya pili, na \"kule\" ni wakati ujao"
    ],
    "correctIndex": 1,
    "explanation": "Katika \"Kuimba kwake... kulimfurahisha\", \"ku-\" huunda nomino ya kitenzi-jina (ngeli ya KU-KU). Katika \"kule ukumbini\", \"ku-\" ni upatanisho wa mahali pa jumla au mbali kidogo katika ngeli ya mahali (PA-KU-MU).",
    "concept": "Kiambishi \"ku-\" kina dhima nyingi: kitenzi-jina (ngeli ya KU), ngeli ya mahali (PA-KU-MU), ukanusho wa -li- (hakusoma), mtendewa nafsi ya 2 (anakupenda), na shina la silabi moja (kula)."
  },
  {
    "id": "kcse_kis_d2",
    "subject": "kiswahili",
    "topicId": "kis_sar",
    "difficulty": "difficult",
    "question": "Geuza sentensi ifuatayo katika hali ya ukubwa (umoja): \"Mti huo mrefu umeanguka karibu na mto.\"",
    "options": [
      "Miti hiyo mirefu imeanguka karibu na mito.",
      "Jiti hilo refu limeanguka karibu na jito.",
      "Kijiti hicho kirefu kimeanguka karibu na kijito.",
      "Majiti hayo marefu yameanguka karibu na majito."
    ],
    "correctIndex": 1,
    "explanation": "Nomino zenye shina la silabi moja baada ya kuondoa \"m-\" (\"m-ti\", \"m-to\") huchukua kiambishi \"ji-\" katika hali ya ukubwa umoja (\"jiti\", \"jito\") na huingia katika ngeli ya LI-YA (\"Jiti hilo refu limeanguka...\").",
    "concept": "Katika hali ya ukubwa, nomino zote huingia katika ngeli ya LI-YA (umoja: jiti limeanguka; wingi: majiti yameanguka)."
  },
  {
    "id": "kcse_kis_d3",
    "subject": "kiswahili",
    "topicId": "kis_nya",
    "difficulty": "difficult",
    "question": "Tofautisha maana kati ya sentensi (i) \"Ningesoma kwa bidii ningefaulu\" na (ii) \"Ningalisoma kwa bidii ningalifaulu.\"",
    "options": [
      "Sentensi zote mbili zina maana sawa kabisa bila tofauti yoyote ya kisemantiki",
      "(i) \"-nge-\" inaonyesha bado kuna uwezekano wa kutimiza masharti na kufaulu; (ii) \"-ngali-\" inaonyesha wakati umeshapita na hakuna tena uwezekano (majuto)",
      "(i) ni ukanusho wa (ii)",
      "(i) \"-nge-\" inaonyesha wakati uliopita kabisa; (ii) \"-ngali-\" inaonyesha wakati ujao wenye uhakika"
    ],
    "correctIndex": 1,
    "explanation": "Katika sarufi ya Kiswahili, hali ya masharti ya \"-nge-\" hudokeza uwezekano bado upo, ilhali \"-ngali-\" hudokeza masharti yasiyowezekana tena kwa sababu tukio lilishapita.",
    "concept": "Hali ya masharti: -nge- (uwezekano upo; ukanusho: -singe-) dhidi ya -ngali- (wakati ulishapita/majuto; ukanusho: -singali-)."
  },
  {
    "id": "kcse_kis_d4",
    "subject": "kiswahili",
    "topicId": "kis_nya",
    "difficulty": "difficult",
    "question": "Tambua aina ya kishazi kilichopigiwa mstari katika sentensi: \"Kitabu kilichopotea jana kimepatikana maktabani.\" (\"kilichopotea jana\")",
    "options": [
      "Kirai kihusishi",
      "Kishazi tegemezi kivumishi (kirejeshi)",
      "Kishazi tegemezi kielezi cha jinsi",
      "Kishazi huru arifu"
    ],
    "correctIndex": 1,
    "explanation": "\"Kilichopotea jana\" kina kirejeshi \"-cho-\" kinachorejelea na kufafanua nomino \"Kitabu\"; hivyo kinafanya kazi ya kivumishi na ni kishazi tegemezi kivumishi.",
    "concept": "Vishazi tegemezi vyenye O-rejeshi vinavyofafanua nomino iliyotangulia hufanya kazi ya kivumishi (kishazi tegemezi kivumishi)."
  },
  {
    "id": "kcse_kis_d5",
    "subject": "kiswahili",
    "topicId": "kis_isi",
    "difficulty": "difficult",
    "question": "Katika mchakato wa usanifishaji wa Kiswahili nchini Kenya na Afrika Mashariki, ni hatua ipi hutangulia kabisa kabla ya kuunda kamusi na sarufi rasmi?",
    "options": [
      "Ufutaji wa lugha zote za kiasili",
      "Uteuzi wa lahaja moja msingi (Selection — kama ilivyoteuliwa Kiunguja mwaka 1930)",
      "Utungaji wa mashairi ya huru",
      "Usambazaji wa vitabu kupitia vyombo vya habari (Elaboration/Acceptance)"
    ],
    "correctIndex": 1,
    "explanation": "Kwa mujibu wa nadharia ya Einar Haugen katika Isimujamii, hatua nne za usanifishaji hufuatana: (1) Uteuzi wa lahaja (Selection), (2) Usimbaji/Ukodishaji wa sarufi na kamusi (Codification), (3) Upanuzi wa matumizi/istilahi (Elaboration), na (4) Ukubalifu (Acceptance).",
    "concept": "Hatua nne za usanifishaji wa lugha: Uteuzi -> Usimbaji (Codification) -> Upanuzi wa Dhima -> Ukubalifu."
  },
  {
    "id": "kcse_kis_d6",
    "subject": "kiswahili",
    "topicId": "kis_isi",
    "difficulty": "difficult",
    "question": "Kwa nini katiba ya Kenya ya mwaka 2010 (Kifungu cha 7) iliipa Kiswahili hadhi mbili tofauti za kisheria nchini Kenya?",
    "options": [
      "Ilipiga marufuku matumizi ya Kiingereza na lugha za ishara nchini Kenya",
      "Ilikifanya Kiswahili kuwa Lugha ya Taifa (kuunganisha wananchi kijamii) na pia Lugha Rasmi sambamba na Kiingereza (kutumika bungeni, mahakamani, na ofisini)",
      "Ilikifanya Kiswahili kuwa lugha ya masoko pekee bila kuruhusiwa bungeni",
      "Iliamuru Kiswahili kiandikwe kwa herufi za Kiarabu pekee"
    ],
    "correctIndex": 1,
    "explanation": "Katiba ya Kenya (2010), Kifungu cha 7(1) kinatangaza Kiswahili kuwa Lugha ya Taifa ya Jamhuri, na Kifungu cha 7(2) kinatangaza Kiingereza na Kiswahili kuwa Lugha Rasmi za Jamhuri ya Kenya.",
    "concept": "Chini ya Katiba ya Kenya 2010 (Ibara ya 7), Kiswahili ni Lugha ya Taifa na pia Lugha Rasmi pamoja na Kiingereza."
  },
  {
    "id": "kcse_kis_d7",
    "subject": "kiswahili",
    "topicId": "kis_fas",
    "difficulty": "difficult",
    "question": "Shairi ambalo kila mshororo wake umegawanyika katika vipande vitatu (ukwapi, utao, na mwandamizi) huainishwa katika bahari gani?",
    "options": [
      "Kikwamba",
      "Ukawafi (Utatu)",
      "Msuko",
      "Tathlitha"
    ],
    "correctIndex": 1,
    "explanation": "Bahari yenye vipande vitatu katika kila mshororo (ukwapi, utao, na mwandamizi) huitwa Ukawafi au Utatu. Usiichanganye na Tathlitha, ambayo ni shairi lenye mishororo mitatu katika kila ubeti.",
    "concept": "Usichanganye Tathlitha (mishororo 3 kwa ubeti) na Ukawafi/Utatu (vipande 3 katika mshororo mmoja: ukwapi, utao, mwandamizi)."
  },
  {
    "id": "kcse_kis_d8",
    "subject": "kiswahili",
    "topicId": "kis_fas",
    "difficulty": "difficult",
    "question": "Katika shairi ambapo vina vya kati vinafanana kuanzia ubeti wa kwanza hadi wa mwisho, lakini vina vya mwisho vinabadilika ubeti hadi ubeti (au kinyume chake: upande mmoja unatiririka na mwingine unabadilika), bahari hiyo huitwaje?",
    "options": [
      "Mtiririko",
      "Ukara",
      "Ukaraguni",
      "Pindu (Mkufu)"
    ],
    "correctIndex": 1,
    "explanation": "Mtiririko vina vyote (vya kati na vya mwisho) hufanana shairi zima; Ukaraguni vina vyote hubadilika ubeti hadi ubeti; Ukara upande mmoja wa vina unafanana shairi zima na upande wa pili unabadilika ubeti hadi ubeti.",
    "concept": "Bahari za vina: Mtiririko (vyote sawa), Ukaraguni (vyote tofauti), na Ukara (upande mmoja sawa, mwingine hubadilika)."
  },
  {
    "id": "kcse_kis_d9",
    "subject": "kiswahili",
    "topicId": "kis_ins",
    "difficulty": "difficult",
    "question": "Unapoandika Insha ya Methali katika Karatasi ya Kwanza ya KCSE (102/1), ni kosa gani huwakosesha watahiniwa alama za maudhui na mtindo?",
    "options": [
      "Kutumia lugha fasaha yenye tamathali za usemi zinazofaa muktadha",
      "Kutoa maana ya kamusi au kufafanua methali kiinsha cha maelezo badala ya kusimulia kisa kimoja thabiti kinachodhihirisha pande zote mbili za methali hiyo",
      "Kujenga kisa kinachoonyesha chanzo na matokeo yanayolandana na funzo la methali",
      "Kuanza kisa moja kwa moja bila kutoa fasili ya methali katika aya ya kwanza"
    ],
    "correctIndex": 1,
    "explanation": "Katika KCSE 102/1, mwanafunzi hatakiwi kufafanua maana ya methali kinadharia katika utangulizi; anapaswa kubuni kisa kinachojitosheleza ambacho kinaonyesha pande zote mbili za methali hiyo kivitendo.",
    "concept": "Insha ya methali hujengwa kwa kisa kimoja chenye pande mbili za methali bila kuanza kwa fasili ya \"Methali hii ina maana kuwa...\"."
  },
  {
    "id": "kcse_kis_d10",
    "subject": "kiswahili",
    "topicId": "kis_ins",
    "difficulty": "difficult",
    "question": "Tambua tamathali ya usemi katika kauli: \"Kijana huyo mwenye nidhamu aliaga dunia baada ya kuugua kwa muda mfupi\" (\"aliaga dunia\").",
    "options": [
      "Tafsida (Tasifida)",
      "Tashihisi",
      "Tanakuzi",
      "Kejeli (Dhihaka)"
    ],
    "correctIndex": 0,
    "explanation": "\"Kuaga dunia\" hutumika badala ya neno kali \"kufa\" ili kupunguza ukali wa maneno na kuhifadhi adabu na heshima—hii ndiyo Tafsida (au Tasifida / euphemism).",
    "concept": "Tafsida (tasifida) hutumia lugha laini na ya staha kuficha ukali, aibu, au machukizo katika mawasiliano."
  },
  {
    "id": "kcse_bio_e1",
    "subject": "biology",
    "topicId": "bio_cell",
    "difficulty": "easy",
    "question": "Which cell organelle is the primary site of aerobic respiration and ATP synthesis?",
    "options": [
      "Ribosome",
      "Lysosome",
      "Golgi apparatus",
      "Mitochondrion"
    ],
    "correctIndex": 3,
    "explanation": "Mitochondria contain respiratory enzymes on their folded inner membrane (cristae) and in the matrix to oxidise glucose and generate ATP. Ribosomes synthesise proteins.",
    "concept": "Cristae foldings increase the internal surface area of mitochondria for ATP-generating respiratory enzyme attachment."
  },
  {
    "id": "kcse_bio_e2",
    "subject": "biology",
    "topicId": "bio_cell",
    "difficulty": "easy",
    "question": "A light microscope has an eyepiece lens marked x10 and an objective lens marked x40. What is the total magnification?",
    "options": [
      "x4000",
      "x50",
      "x4",
      "x400"
    ],
    "correctIndex": 3,
    "explanation": "Total magnification = Eyepiece magnification x Objective lens magnification = 10 x 40 = x400.",
    "concept": "Compound microscope magnification is the product (not the sum) of the ocular and objective lens magnifications."
  },
  {
    "id": "kcse_bio_e3",
    "subject": "biology",
    "topicId": "bio_nutr",
    "difficulty": "easy",
    "question": "Which reagent is used in the school laboratory to test for the presence of non-reducing sugars AFTER boiling with dilute hydrochloric acid and neutralising with sodium hydrogen carbonate?",
    "options": [
      "Biuret reagent",
      "DCPIP solution",
      "Iodine solution",
      "Benedict's solution (heated to boiling)"
    ],
    "correctIndex": 3,
    "explanation": "Non-reducing sugars (such as sucrose) must first be hydrolysed to monosaccharides with dilute HCl, neutralised with NaHCO3, and then heated with Benedict's solution to yield a brick-red/orange precipitate.",
    "concept": "Dilute HCl hydrolyses glycosidic bonds in sucrose; NaHCO3 neutralises excess acid because Benedict's reagent only works in alkaline conditions."
  },
  {
    "id": "kcse_bio_e4",
    "subject": "biology",
    "topicId": "bio_nutr",
    "difficulty": "easy",
    "question": "Which blood vessel in mammals carries oxygenated blood directly from the lungs to the left atrium of the heart?",
    "options": [
      "Vena cava",
      "Pulmonary artery",
      "Aorta",
      "Pulmonary vein"
    ],
    "correctIndex": 3,
    "explanation": "The pulmonary vein is the unique vein in adult mammals that transports oxygenated blood from the lungs to the left atrium; the pulmonary artery carries deoxygenated blood from the right ventricle to the lungs.",
    "concept": "Arteries carry blood away from the heart while veins carry blood back to the heart; oxygenation reverses in the pulmonary circuit."
  },
  {
    "id": "kcse_bio_e5",
    "subject": "biology",
    "topicId": "bio_homeo",
    "difficulty": "easy",
    "question": "Which hormone secreted by the islets of Langerhans in the pancreas lowers blood glucose concentration after a carbohydrate-rich meal?",
    "options": [
      "Antidiuretic hormone (ADH)",
      "Aldosterone",
      "Glucagon",
      "Insulin"
    ],
    "correctIndex": 3,
    "explanation": "Beta cells of the islets of Langerhans secrete insulin, stimulating liver and muscle cells to convert excess glucose into glycogen, increase glucose oxidation, and lower blood sugar.",
    "concept": "Insulin lowers high blood glucose (glucose -> glycogen), whereas glucagon raises low blood glucose (glycogen -> glucose)."
  },
  {
    "id": "kcse_bio_e6",
    "subject": "biology",
    "topicId": "bio_homeo",
    "difficulty": "easy",
    "question": "What are the end products of anaerobic respiration (alcoholic fermentation) in yeast cells?",
    "options": [
      "Lactic acid and energy only",
      "Water, carbon(IV) oxide, and 38 ATP",
      "Ethanol and lactic acid",
      "Ethanol, carbon(IV) oxide, and a small amount of energy (ATP)"
    ],
    "correctIndex": 3,
    "explanation": "In plants and yeast, anaerobic breakdown of glucose produces ethanol + carbon(IV) oxide + 2 ATP. By contrast, anaerobic respiration in mammalian skeletal muscle produces lactic acid + 2 ATP without CO2.",
    "concept": "Never confuse plant/yeast fermentation (ethanol + CO2) with animal muscle anaerobic respiration (lactic acid only)."
  },
  {
    "id": "kcse_bio_e7",
    "subject": "biology",
    "topicId": "bio_ecol",
    "difficulty": "easy",
    "question": "Under binomial nomenclature rules introduced by Carolus Linnaeus, which formatting of the scientific name for maize is correct in print?",
    "options": [
      "ZEA MAYS (all capitals)",
      "zea mays (both lowercase)",
      "Zea Mays (both capitalised)",
      "Zea mays (italicised, genus capitalised, species lowercase)"
    ],
    "correctIndex": 3,
    "explanation": "In binomial nomenclature, the generic name starts with an uppercase letter (Zea), the specific epithet starts with a lowercase letter (mays), and both are italicised in print (or underlined separately when handwritten).",
    "concept": "Handwritten scientific names must be underlined separately (Zea mays) with only the Genus capitalised."
  },
  {
    "id": "kcse_bio_e8",
    "subject": "biology",
    "topicId": "bio_ecol",
    "difficulty": "easy",
    "question": "Which group of bacteria lives symbiotically inside root nodules of leguminous plants (such as beans) and fixes atmospheric nitrogen into ammonia/ammonium compounds?",
    "options": [
      "Nitrobacter",
      "Nitrosomonas",
      "Pseudomonas denitrificans",
      "Rhizobium"
    ],
    "correctIndex": 3,
    "explanation": "Rhizobium is a symbiotic nitrogen-fixing bacterium in legume root nodules; Azotobacter is free-living nitrogen-fixing; Nitrosomonas oxidises ammonium to nitrites; Nitrobacter oxidises nitrites to nitrates.",
    "concept": "Nitrogen cycle roles: Rhizobium/Azotobacter (N2 -> NH4+), Nitrosomonas (NH4+ -> NO2-), Nitrobacter (NO2- -> NO3-)."
  },
  {
    "id": "kcse_bio_e9",
    "subject": "biology",
    "topicId": "bio_gen",
    "difficulty": "easy",
    "question": "In a flowering plant, which part of the flower develops into the seed and which part develops into the fruit after double fertilisation?",
    "options": [
      "Ovary develops into the seed; ovule develops into the fruit",
      "Integuments develop into the fruit; calyx develops into the seed",
      "Stigma develops into the seed; style develops into the fruit",
      "Ovule develops into the seed; ovary develops into the fruit"
    ],
    "correctIndex": 3,
    "explanation": "After fertilisation, the fertilised ovule becomes the seed (with integuments forming the testa/seed coat), while the surrounding ovary wall enlarges and matures into the pericarp (fruit).",
    "concept": "Post-fertilisation fates: Ovule -> Seed; Integuments -> Testa; Ovary -> Fruit; Ovary wall -> Pericarp."
  },
  {
    "id": "kcse_bio_e10",
    "subject": "biology",
    "topicId": "bio_gen",
    "difficulty": "easy",
    "question": "Which division of the vertebrate nervous system coordinates balance, posture, and muscular dexterity?",
    "options": [
      "Medulla oblongata",
      "Cerebrum",
      "Cerebellum",
      "Hypothalamus"
    ],
    "correctIndex": 2,
    "explanation": "The cerebellum coordinates muscular movement, posture, and body balance; the medulla oblongata controls involuntary vital reflexes (heartbeat, breathing); the hypothalamus regulates homeostasis.",
    "concept": "Brain regions: Cerebrum (memory/intelligence/voluntary motor), Cerebellum (balance/posture), Medulla (breathing/heartbeat)."
  },
  {
    "id": "kcse_bio_m1",
    "subject": "biology",
    "topicId": "bio_cell",
    "difficulty": "medium",
    "question": "A strip of raw potato tissue placed in a concentrated sucrose solution becomes flaccid and shorter after 30 minutes. Which cellular process explains this observation?",
    "options": [
      "Sucrose molecules moved into the potato cells by active transport, bursting the cell wall",
      "Water molecules moved out of the potato cell sap into the hypertonic sucrose solution by osmosis, causing plasmolysis",
      "Potato cells underwent haemolysis due to excess osmotic pressure",
      "Water moved into the potato cells by osmosis, creating turgor pressure"
    ],
    "correctIndex": 1,
    "explanation": "Concentrated sucrose is hypertonic to potato cell sap; water leaves the vacuoles across the semi-permeable cell membrane by osmosis, shrinking the cytoplasm away from the cell wall (plasmolysis) and making the strip flaccid. Note: haemolysis only occurs in animal red blood cells lacking cell walls.",
    "concept": "Plant cells in hypertonic solutions become plasmolysed (flaccid); animal cells crenate in hypertonic and haemolyse in hypotonic solutions."
  },
  {
    "id": "kcse_bio_m2",
    "subject": "biology",
    "topicId": "bio_cell",
    "difficulty": "medium",
    "question": "Why does treating plant roots with potassium cyanide (a respiratory poison) sharply reduce mineral ion uptake even when mineral ions remain abundant in soil water?",
    "options": [
      "Mineral ions can only enter root hairs by osmosis",
      "Mineral uptake against a concentration gradient occurs via active transport, which requires ATP from cellular respiration",
      "Potassium cyanide blocks simple diffusion by freezing water molecules in the soil",
      "Cyanide thickens the cellulose cell wall, making it impermeable to water"
    ],
    "correctIndex": 1,
    "explanation": "Root hair cells accumulate mineral ions against a concentration gradient via active transport. Cyanide inhibits cytochrome oxidase in aerobic respiration, halting ATP synthesis and stopping active transport.",
    "concept": "Sensitivity to respiratory inhibitors, oxygen concentration, pH, and temperature distinguishes active transport from passive diffusion."
  },
  {
    "id": "kcse_bio_m3",
    "subject": "biology",
    "topicId": "bio_nutr",
    "difficulty": "medium",
    "question": "Why does human pepsin work optimally in the stomach (around pH 1.5 - 2.0) but become inactive once chyme enters the duodenum?",
    "options": [
      "Pepsin is completely digested into glucose inside the pyloric sphincter",
      "Alkaline pancreatic juice and bile raise duodenal pH (~7.5 - 8.5), altering ionic bonds at pepsin's active site and denaturing it",
      "Bile salts are enzymes that competitively bind starch instead of protein",
      "Temperature in the duodenum drops below 10 degrees Celsius, inactivating all enzymes"
    ],
    "correctIndex": 1,
    "explanation": "Every enzyme has a narrow optimum pH. Sodium hydrogen carbonate in bile and pancreatic juice neutralises acidic chyme to create an alkaline medium (~pH 8) suitable for trypsin, pancreatic amylase, and lipase, which denatures acid-adapted pepsin. (Also note: bile contains no enzymes!)",
    "concept": "Extreme pH shifts disrupt ionic/hydrogen bonds maintaining the 3D active site of an enzyme; bile emulsifies lipids physically without enzymes."
  },
  {
    "id": "kcse_bio_m4",
    "subject": "biology",
    "topicId": "bio_nutr",
    "difficulty": "medium",
    "question": "How does the counter-current flow system in bony fish gill lamellae maximize gaseous exchange efficiency?",
    "options": [
      "Gill rakers absorb dissolved oxygen directly into the operculum",
      "Blood flows in the opposite direction to water across the gill lamellae, maintaining a steep diffusion gradient along the entire exchange surface",
      "Blood and water flow in the same direction until equilibrium stops gas transfer halfway along the gill",
      "Water is pumped directly into fish capillaries to mix with haemoglobin"
    ],
    "correctIndex": 1,
    "explanation": "Because blood and water move in opposite directions, blood leaving the lamellae encounters incoming fresh water with maximum oxygen tension, maintaining a continuous concentration gradient so >80% of dissolved O2 diffuses into blood.",
    "concept": "Counter-current flow prevents the 50% equilibrium ceiling of parallel flow, sustaining diffusion across the full length of gill lamellae."
  },
  {
    "id": "kcse_bio_m5",
    "subject": "biology",
    "topicId": "bio_homeo",
    "difficulty": "medium",
    "question": "Desert kangaroo rats possess extraordinarily long loops of Henle in their kidney nephrons compared with aquatic beavers. What is the physiological advantage of a long loop of Henle?",
    "options": [
      "It enables glucose excretion into urine during dehydration",
      "It creates a steeper medullary osmotic gradient for maximum water reabsorption, producing small volumes of highly concentrated urine",
      "It converts toxic ammonia directly into uric acid crystals",
      "It increases glomerular blood pressure to excrete large volumes of dilute urine"
    ],
    "correctIndex": 1,
    "explanation": "A longer loop of Henle acts as a stronger counter-current multiplier in the kidney medulla, raising interstitial osmolarity so maximum water is osmotically reabsorbed from the loop and collecting duct.",
    "concept": "Loop of Henle length correlates directly with aridity of habitat: xerocoles/desert mammals have long loops; aquatic mammals have very short loops."
  },
  {
    "id": "kcse_bio_m6",
    "subject": "biology",
    "topicId": "bio_homeo",
    "difficulty": "medium",
    "question": "During vigorous exercise on a hot afternoon in Mombasa, how do superficial skin arterioles respond to regulate core body temperature?",
    "options": [
      "Vasoconstriction: skin arterioles narrow to trap heat inside deep organs",
      "Vasodilation: smooth muscles in skin arteriole walls relax, widening the lumen so more blood flows near the skin surface to lose heat by radiation and conduction",
      "Capillaries migrate physically upward through the epidermis toward sweat pores",
      "Erector pili muscles contract to make hairs stand upright and trap an insulating air layer"
    ],
    "correctIndex": 1,
    "explanation": "Note the classic KNEC distinction: arterioles vasodilate (widen their lumen) to bring more warm blood close to the epidermis—blood capillaries NEVER move closer to or further from the skin surface!",
    "concept": "KNEC marking trap: never write \"capillaries move closer to the skin\"; state \"superficial arterioles vasodilate, increasing blood flow near the skin surface\"."
  },
  {
    "id": "kcse_bio_m7",
    "subject": "biology",
    "topicId": "bio_ecol",
    "difficulty": "medium",
    "question": "In an ecological study of grasshoppers in a school field, students captured, marked, and released 60 grasshoppers. Two days later, they captured 50 grasshoppers, of which 12 bore the paint mark. Estimate the grasshopper population.",
    "options": [
      "98",
      "250",
      "300",
      "122"
    ],
    "correctIndex": 1,
    "explanation": "Using the Lincoln Index (capture-recapture formula) P = (FM x SC) / MR: P = (60 x 50) / 12 = 3,000 / 12 = 250 grasshoppers.",
    "concept": "Capture-recapture P = (First Marked x Second Captured) / Marked Recaptured assumes random mixing, no immigration/emigration, and non-toxic marks."
  },
  {
    "id": "kcse_bio_m8",
    "subject": "biology",
    "topicId": "bio_ecol",
    "difficulty": "medium",
    "question": "Why do food chains in terrestrial and aquatic ecosystems rarely exceed four or five trophic levels?",
    "options": [
      "Decomposers destroy herbivores before tertiary consumers can feed",
      "Roughly 90% of energy is lost at each trophic transfer via respiration, heat, egestion, and excretion, leaving insufficient energy to sustain higher levels",
      "Top predators lack digestive enzymes to break down quaternary prey",
      "Producers absorb 100% of incident solar radiation, leaving none for consumers"
    ],
    "correctIndex": 1,
    "explanation": "Only about 10% of chemical energy stored in biomass at one trophic level is converted into new biomass at the next level; progressive respiratory heat and excretory losses exhaust available energy by level 4 or 5.",
    "concept": "Energy flows unidirectionally and diminishes by ~90% per trophic step, whereas nutrients (C, N) are recycled by saprophytic decomposers."
  },
  {
    "id": "kcse_bio_m9",
    "subject": "biology",
    "topicId": "bio_gen",
    "difficulty": "medium",
    "question": "A woman who has normal blood clotting but whose father had haemophilia marries a man with normal blood clotting. What is the probability that their first son will have haemophilia?",
    "options": [
      "1/4 (25% of sons)",
      "1/2 (50% of sons)",
      "1 (100% of sons)",
      "0 (0% of sons)"
    ],
    "correctIndex": 1,
    "explanation": "Haemophilia is X-linked recessive (X^h). Because the woman's father was X^h Y, she inherited his X^h chromosome and is a carrier (X^H X^h). Her husband is X^H Y. A son receives Y from his father and has an equal 1/2 chance of inheriting X^H (normal) or X^h (haemophiliac) from his mother. (Note: probability among sons = 1/2; probability among all children = 1/4.)",
    "concept": "Read genetics wording carefully: \"probability that their son is haemophiliac\" has denominator 2 (XY outcomes only), whereas \"probability of having a haemophiliac son\" among all children has denominator 4."
  },
  {
    "id": "kcse_bio_m10",
    "subject": "biology",
    "topicId": "bio_gen",
    "difficulty": "medium",
    "question": "When a young maize coleoptile is illuminated unilaterally (from one side only), why does the shoot bend toward the light source (positive phototropism)?",
    "options": [
      "Auxins (IAA) diffuse laterally from the illuminated side to the shaded side, stimulating faster cell elongation on the shaded side of the shoot",
      "High auxin concentration inhibits shoot elongation on the shaded side",
      "Auxins accumulate on the lit side and stimulate rapid cell division toward the lamp",
      "Light destroys all cells on the shaded side, pulling the shoot backward"
    ],
    "correctIndex": 0,
    "explanation": "Unilateral light causes indole-3-acetic acid (IAA/auxin) to migrate laterally to the darker side. In shoots (unlike roots!), higher auxin concentration promotes faster cell elongation, making the shaded side grow longer and curving the shoot toward light.",
    "concept": "High auxin concentration stimulates cell elongation in shoots (causing positive phototropism) but inhibits elongation in roots (causing positive geotropism)."
  },
  {
    "id": "kcse_bio_d1",
    "subject": "biology",
    "topicId": "bio_cell",
    "difficulty": "difficult",
    "question": "Under a microscope with a field of view diameter of 2.4 mm, a student counts 8 identical onion epidermal cells stretched end-to-end across the diameter. Express the length of one cell in micrometres (um).",
    "options": [
      "30 um",
      "0.3 um",
      "300 um",
      "3,000 um"
    ],
    "correctIndex": 2,
    "explanation": "Convert field of view diameter to micrometres first: 1 mm = 1,000 um, so 2.4 mm = 2,400 um. Dividing by 8 cells gives Cell Length = 2,400 um / 8 = 300 um.",
    "concept": "1 mm = 1,000 um; Cell Size (um) = (Diameter of Field of View in mm x 1,000) / Number of cells across diameter."
  },
  {
    "id": "kcse_bio_d2",
    "subject": "biology",
    "topicId": "bio_nutr",
    "difficulty": "difficult",
    "question": "People living natively at high altitude (such as Iten, ~2,400 m above sea level) develop higher red blood cell counts and haemoglobin levels. Which physiological sequence triggers this adaptation?",
    "options": [
      "Lower atmospheric partial pressure of oxygen -> mild tissue hypoxia -> kidneys secrete erythropoietin -> bone marrow increases erythropoiesis",
      "Higher atmospheric carbon(IV) oxide -> spleen destroys leucocytes -> liver synthesises extra plasma albumin",
      "Higher oxygen percentage at altitude -> lungs shrink alveoli -> haemoglobin affinity drops to zero",
      "Lower air temperature -> thyroid secretes calcitonin -> platelets convert into erythrocytes"
    ],
    "correctIndex": 0,
    "explanation": "Although oxygen remains ~21% of air, total atmospheric pressure (and thus pO2) is lower at high altitude. Reduced blood oxygen tension stimulates the kidneys to release erythropoietin, accelerating red blood cell production in red bone marrow to boost oxygen-carrying capacity.",
    "concept": "High-altitude acclimatisation increases erythrocyte count and haemoglobin content to compensate for lower partial pressure of O2."
  },
  {
    "id": "kcse_bio_d3",
    "subject": "biology",
    "topicId": "bio_nutr",
    "difficulty": "difficult",
    "question": "During the light-independent (dark) stage of photosynthesis in the chloroplast stroma, what happens immediately if light is switched off?",
    "options": [
      "Oxygen gas continues evolving from the stroma through photolysis of glucose",
      "Carbon(IV) oxide fixation accelerates indefinitely because dark reactions hate light",
      "Photolysis stops, cutting off ATP and NADPH (hydrogen atoms) from the grana, so carbon(IV) oxide fixation soon halts even though dark-stage enzymes do not directly use light",
      "Chlorophyll molecules break down water into starch without enzymes"
    ],
    "correctIndex": 2,
    "explanation": "The \"dark\" (Calvin) stage occurs in the stroma and does not require light directly, but it strictly depends on ATP and reduced NADP (hydrogen atoms) produced during the light-dependent photolysis stage on the grana.",
    "concept": "Light-stage products (ATP and hydrogen atoms from photolysis in grana) are essential inputs for CO2 reduction to simple sugars in the stroma."
  },
  {
    "id": "kcse_bio_d4",
    "subject": "biology",
    "topicId": "bio_homeo",
    "difficulty": "difficult",
    "question": "Calculate the Respiratory Quotient (RQ) for the complete aerobic oxidation of tripalmitin (a lipid, C51H98O6) according to: 2 C51H98O6 + 145 O2 -> 102 CO2 + 98 H2O.",
    "options": [
      "0.70",
      "0.90",
      "1.42",
      "1.00"
    ],
    "correctIndex": 0,
    "explanation": "Respiratory Quotient RQ = (Moles of CO2 produced) / (Moles of O2 consumed) = 102 / 145 = 0.703 -> 0.70. Notice lipids have high hydrogen-to-oxygen ratios and require more O2 for oxidation than carbohydrates (RQ = 1.0).",
    "concept": "RQ = CO2 produced / O2 consumed: ~1.0 for carbohydrates, ~0.7 for lipids/fats, ~0.8-0.9 for proteins, and >1.0 when anaerobic respiration occurs."
  },
  {
    "id": "kcse_bio_d5",
    "subject": "biology",
    "topicId": "bio_homeo",
    "difficulty": "difficult",
    "question": "A patient presents with passing large volumes of very dilute, tasteless (sugar-free) urine and intense thirst, yet blood glucose tests are completely normal. Which condition and hormonal deficiency explain these signs?",
    "options": [
      "Diabetes mellitus caused by deficiency of insulin from the pancreas",
      "Nephritis caused by bacterial inflammation of the glomerulus",
      "Diabetes insipidus caused by deficiency of antidiuretic hormone (ADH / vasopressin) from the posterior pituitary gland",
      "Addison's disease caused by excess aldosterone secretion"
    ],
    "correctIndex": 2,
    "explanation": "Without ADH, distal convoluted tubules and collecting ducts remain impermeable to water, causing copious dilute sugar-free urine (diabetes insipidus). Diabetes mellitus involves hyperglycaemia and glycosuria (glucose in urine) due to insulin deficiency/resistance.",
    "concept": "Distinguish Diabetes mellitus (insulin deficit -> glucose in urine) from Diabetes insipidus (ADH deficit -> copious dilute, glucose-free urine)."
  },
  {
    "id": "kcse_bio_d6",
    "subject": "biology",
    "topicId": "bio_ecol",
    "difficulty": "difficult",
    "question": "Why does untreated domestic sewage discharged into a Freshwater lake (such as Winam Gulf of Lake Victoria) eventually cause mass fish mortality (eutrophication)?",
    "options": [
      "Mineral nutrients trigger algal blooms that block light; dead algae are decomposed aerobically by saprophytic bacteria, depleting dissolved oxygen (high BOD) and suffocating fish",
      "Nitrate ions freeze lake water at tropical temperatures",
      "Saprophytic bacteria release excess pure oxygen that poisons fish haemoglobin",
      "Algae directly bite and parasitise fish gills during photosynthesis"
    ],
    "correctIndex": 0,
    "explanation": "Nitrates and phosphates enrich the water (eutrophication), causing dense algal blooms. Shading kills submerged plants and dead algae sink; aerobic decomposers multiply rapidly, consuming dissolved O2 (raising Biochemical Oxygen Demand) and causing fish asphyxiation.",
    "concept": "Eutrophication sequence: Nutrient enrichment -> Algal bloom -> Light blockage & plant death -> Aerobic bacterial decomposition -> Dissolved O2 depletion -> Fish suffocation."
  },
  {
    "id": "kcse_bio_d7",
    "subject": "biology",
    "topicId": "bio_gen",
    "difficulty": "difficult",
    "question": "A mother has blood group A and her child has blood group O. Which blood group could NEVER belong to the biological father of this child?",
    "options": [
      "Blood group O",
      "Blood group B",
      "Blood group AB",
      "Blood group A"
    ],
    "correctIndex": 2,
    "explanation": "A child of blood group O has homozygous recessive genotype ii, meaning one i allele came from the mother (who must be I^A i) and one i allele MUST come from the father. A man of blood group AB has genotype I^A I^B (no i allele) and can never father a group O child.",
    "concept": "ABO blood groups involve three alleles (I^A and I^B codominant; both dominant over i): group AB (I^A I^B) cannot pass on an i allele."
  },
  {
    "id": "kcse_bio_d8",
    "subject": "biology",
    "topicId": "bio_gen",
    "difficulty": "difficult",
    "question": "How are pentadactyl forelimbs of a bat, whale, mole, and human interpreted in evolutionary biology?",
    "options": [
      "Homologous structures arising from divergent evolution (adaptive radiation) from a common ancestor to suit different habitats",
      "Analogous structures arising from convergent evolution of unrelated lineages",
      "Acquired Lamarckian traits inherited through muscle stretching during one lifetime",
      "Vestigial organs that have completely lost all function in mammals"
    ],
    "correctIndex": 0,
    "explanation": "Despite performing different functions (flying, swimming, digging, grasping), all four limbs share the exact same underlying pentadactyl bone plan (humerus, radius, ulna, carpals, metacarpals, phalanges)—homologous structures proving divergent evolution.",
    "concept": "Homologous structures = same fundamental anatomical origin, different functions (divergent evolution); Analogous structures (insect wing vs bird wing) = different origins, similar function (convergent evolution)."
  },
  {
    "id": "kcse_bio_d9",
    "subject": "biology",
    "topicId": "bio_gen",
    "difficulty": "difficult",
    "question": "In someone with myopia (short-sightedness), where do light rays from a distant object converge, and what spectacle lens corrects the defect?",
    "options": [
      "Rays converge directly on the blind spot; corrected using a cylindrical prism only",
      "Rays converge behind the retina (eyeball too short); corrected using a converging (biconvex) lens",
      "Rays converge in front of the retina (eyeball too long or lens too curved); corrected using a diverging (biconcave) lens",
      "Rays fail to refract at the cornea; corrected using an opaque plane mirror"
    ],
    "correctIndex": 2,
    "explanation": "In myopia, an elongated eyeball or excessively powerful lens focuses parallel rays from distant objects in front of the retina. A diverging (concave) lens spreads incoming rays slightly before they enter the eye so they focus sharply on the fovea.",
    "concept": "Myopia (short sight) = focus in front of retina -> concave (diverging) lens; Hypermetropia (long sight) = focus behind retina -> convex (converging) lens."
  },
  {
    "id": "kcse_bio_d10",
    "subject": "biology",
    "topicId": "bio_gen",
    "difficulty": "difficult",
    "question": "During transmission of a nerve impulse across a cholinergic chemical synapse, what is the exact role of calcium ions (Ca2+) and acetylcholinesterase?",
    "options": [
      "Acetylcholinesterase pumps potassium ions into the pre-synaptic knob to generate ATP",
      "Ca2+ destroys neurotransmitters in the synaptic cleft while acetylcholinesterase synthesises myelin",
      "Ca2+ blocks sodium channels permanently on the post-synaptic membrane",
      "Ca2+ influx triggers synaptic vesicles to fuse with the pre-synaptic membrane releasing acetylcholine; acetylcholinesterase hydrolyses acetylcholine afterward to prevent continuous firing"
    ],
    "correctIndex": 3,
    "explanation": "Arrival of an action potential opens voltage-gated Ca2+ channels in the pre-synaptic knob; Ca2+ causes vesicles to exocytose acetylcholine across the cleft to depolarise the post-synaptic membrane. Acetylcholinesterase rapidly breaks down acetylcholine into choline and ethanoic acid so the membrane can repolarise.",
    "concept": "Organophosphate insecticides inhibit acetylcholinesterase, leaving acetylcholine bound to post-synaptic receptors and causing spastic paralysis."
  },
  {
    "id": "kcse_chem_e1",
    "subject": "chemistry",
    "topicId": "chem_atom",
    "difficulty": "easy",
    "question": "An atom of element X has atomic number 13 and mass number 27. State its electronic configuration and Period/Group in the Periodic Table.",
    "options": [
      "2.8.3 — Period 3, Group III",
      "2.8.4 — Period 3, Group IV",
      "2.8.8.9 — Period 4, Group IX",
      "2.8.7 — Period 3, Group VII"
    ],
    "correctIndex": 0,
    "explanation": "In a neutral atom, number of electrons = atomic number = 13, distributed as 2.8.3. Three occupied energy levels place X (Aluminium) in Period 3, and 3 valence electrons place it in Group III.",
    "concept": "Number of occupied energy shells = Period number; number of outermost (valence) electrons = Group number."
  },
  {
    "id": "kcse_chem_e2",
    "subject": "chemistry",
    "topicId": "chem_atom",
    "difficulty": "easy",
    "question": "Why does graphite conduct electricity in the solid state whereas diamond does not, even though both are allotropes of pure carbon?",
    "options": [
      "Graphite is a giant ionic lattice whereas diamond is simple molecular",
      "Diamond has weak van der Waals forces that trap free ions",
      "Each carbon atom in graphite bonds covalently to only 3 others, leaving 1 delocalised electron per atom free to move along hexagonal layers",
      "Graphite contains mobile positive carbon cations dissolved in water"
    ],
    "correctIndex": 2,
    "explanation": "Carbon has 4 valence electrons. In diamond, all 4 are locked in tetrahedral covalent bonds; in graphite, each carbon forms 3 covalent bonds in flat hexagonal rings, leaving 1 delocalised electron per atom to conduct charge.",
    "concept": "Electrical conductivity requires mobile charge carriers: delocalised electrons (metals & graphite) or mobile ions (molten/aqueous electrolytes)."
  },
  {
    "id": "kcse_chem_e3",
    "subject": "chemistry",
    "topicId": "chem_mole",
    "difficulty": "easy",
    "question": "Calculate the relative formula mass (RFM) of hydrated sodium carbonate, Na2CO3.10H2O (Na = 23, C = 12, O = 16, H = 1).",
    "options": [
      "286",
      "106",
      "124",
      "263"
    ],
    "correctIndex": 0,
    "explanation": "Na2CO3 = (2 x 23) + 12 + (3 x 16) = 46 + 12 + 48 = 106. Ten water molecules = 10 x (2(1) + 16) = 10 x 18 = 180. Total RFM = 106 + 180 = 286.",
    "concept": "The dot in a hydrated salt formula (Na2CO3.10H2O) denotes addition of the mass of water of crystallisation (106 + 180), never multiplication!"
  },
  {
    "id": "kcse_chem_e4",
    "subject": "chemistry",
    "topicId": "chem_mole",
    "difficulty": "easy",
    "question": "How many moles of sodium hydroxide are present in 250 cm^3 of 0.4 M NaOH solution?",
    "options": [
      "0.01 moles",
      "100 moles",
      "0.10 moles",
      "1.00 mole"
    ],
    "correctIndex": 2,
    "explanation": "Convert volume to dm^3: 250 / 1000 = 0.25 dm^3. Moles n = Molarity x Volume (dm^3) = 0.4 mol/dm^3 x 0.25 dm^3 = 0.10 moles.",
    "concept": "Moles in solution = (Molarity x Volume in cm^3) / 1000."
  },
  {
    "id": "kcse_chem_e5",
    "subject": "chemistry",
    "topicId": "chem_org",
    "difficulty": "easy",
    "question": "What is the general molecular formula of the alkyne homologous series, and what is the molecular formula of butyne?",
    "options": [
      "C_n H_(2n - 2); C4H6",
      "C_n H_(2n + 1)OH; C4H9OH",
      "C_n H_(2n); C4H8",
      "C_n H_(2n + 2); C4H10"
    ],
    "correctIndex": 0,
    "explanation": "Alkynes contain a carbon-carbon triple bond (-C#C-) and follow C_n H_(2n - 2). For n = 4 (butyne), 2(4) - 2 = 6, giving C4H6.",
    "concept": "Hydrocarbon homologous series: Alkanes C_nH_(2n+2), Alkenes C_nH_(2n), Alkynes C_nH_(2n-2)."
  },
  {
    "id": "kcse_chem_e6",
    "subject": "chemistry",
    "topicId": "chem_org",
    "difficulty": "easy",
    "question": "What observation is made when ethene gas is bubbled through reddish-brown bromine water?",
    "options": [
      "A white precipitate of ethene bromide settles at the bottom",
      "Effervescence of hydrogen gas occurs",
      "The reddish-brown bromine water is immediately decolourised to colourless",
      "Bromine water turns from orange to green"
    ],
    "correctIndex": 2,
    "explanation": "Unsaturated hydrocarbons (alkenes and alkynes) undergo rapid addition across their C=C or C#C multiple bonds with bromine water (HOBr/Br2), decolourising it from yellow/reddish-brown to colourless.",
    "concept": "Decolourisation of bromine water or acidified purple KMnO4 is the standard laboratory test for carbon-carbon unsaturation."
  },
  {
    "id": "kcse_chem_e7",
    "subject": "chemistry",
    "topicId": "chem_elec",
    "difficulty": "easy",
    "question": "Which salt below is insoluble in water and is therefore prepared in the laboratory by double decomposition (precipitation)?",
    "options": [
      "Lead(II) sulphate (PbSO4)",
      "Potassium carbonate (K2CO3)",
      "Sodium nitrate (NaNO3)",
      "Copper(II) sulphate (CuSO4)"
    ],
    "correctIndex": 0,
    "explanation": "All nitrates and all sodium/potassium/ammonium salts are soluble, and CuSO4 is soluble. Sulphates of barium, lead(II), and calcium (sparingly) are insoluble; hence PbSO4 is prepared by mixing soluble Pb(NO3)2(aq) with Na2SO4(aq).",
    "concept": "Insoluble salts (PbSO4, BaSO4, AgCl, PbCl2, most carbonates) are prepared by precipitation from two soluble aqueous solutions."
  },
  {
    "id": "kcse_chem_e8",
    "subject": "chemistry",
    "topicId": "chem_elec",
    "difficulty": "easy",
    "question": "During electrolysis of molten lead(II) bromide (PbBr2) using inert graphite electrodes, what is formed at the cathode and anode respectively?",
    "options": [
      "Cathode: lead(II) oxide; Anode: carbon(IV) oxide",
      "Cathode: hydrogen gas; Anode: oxygen gas",
      "Cathode: silvery molten lead metal; Anode: red-brown bromine vapour",
      "Cathode: bromine vapour; Anode: lead metal"
    ],
    "correctIndex": 2,
    "explanation": "Positive Pb^2+ cations migrate to the negative cathode and gain electrons (reduction: Pb^2+ + 2e- -> Pb(l)); negative Br^- anions migrate to the positive anode and lose electrons (oxidation: 2Br^- -> Br2(g) + 2e-).",
    "concept": "Molten binary electrolytes contain no water ions (H+/OH-), so the metal forms at the cathode and the non-metal at the anode."
  },
  {
    "id": "kcse_chem_e9",
    "subject": "chemistry",
    "topicId": "chem_ind",
    "difficulty": "easy",
    "question": "In the Haber process for the industrial manufacture of ammonia (N2 + 3H2 <-> 2NH3), which catalyst is used?",
    "options": [
      "Finely divided iron (promoted with aluminium oxide)",
      "Vanadium(V) oxide (V2O5)",
      "Platinum-rhodium gauze at 900 degrees Celsius",
      "Manganese(IV) oxide (MnO2)"
    ],
    "correctIndex": 0,
    "explanation": "Haber process uses finely divided iron catalyst (~450 C, 200 atm). Vanadium(V) oxide is used in the Contact process (H2SO4), and Platinum-rhodium is used in the Ostwald process (HNO3).",
    "concept": "Industrial catalysts: Haber = Finely divided Iron; Contact = Vanadium(V) oxide; Ostwald = Platinum-rhodium; Hydrogenation = Nickel."
  },
  {
    "id": "kcse_chem_e10",
    "subject": "chemistry",
    "topicId": "chem_ind",
    "difficulty": "easy",
    "question": "In the Frasch process for extracting sulphur from underground deposits, why is superheated water pumped down at 170 degrees Celsius under ~10 atm pressure?",
    "options": [
      "To dissolve sulphur completely in hot water into sulphuric acid",
      "To melt the underground sulphur (m.p. ~113-119 C) while keeping water liquid above 100 C under high pressure",
      "To oxidise underground sulphur into sulphur(IV) oxide gas",
      "To freeze impurities of sand and clay"
    ],
    "correctIndex": 1,
    "explanation": "Sulphur is insoluble in water and melts around 115 C. High pressure prevents water from boiling at 100 C so liquid water at 170 C melts the sulphur, which is then forced up the middle concentric pipe by hot compressed air.",
    "concept": "Frasch process exploits two physical properties of sulphur: low melting point (~115 C) and insolubility in water."
  },
  {
    "id": "kcse_chem_m1",
    "subject": "chemistry",
    "topicId": "chem_atom",
    "difficulty": "medium",
    "question": "Why is the melting point of magnesium (650 C) much higher than that of sodium (98 C) across Period 3?",
    "options": [
      "Sodium has stronger van der Waals forces than magnesium",
      "Magnesium forms a giant covalent network whereas sodium is a simple monoatomic gas",
      "Magnesium contributes 2 delocalised electrons per atom (vs 1 in sodium) and has a smaller atomic/ionic radius with higher nuclear charge, creating a much stronger metallic bond",
      "Magnesium has more occupied electron shells than sodium"
    ],
    "correctIndex": 2,
    "explanation": "Both Na (2.8.1) and Mg (2.8.2) are Period 3 metals (3 shells), but Mg^2+ ions are smaller, carry double the positive charge, and sit in a sea of twice as many delocalised electrons per atom, requiring much more thermal energy to overcome metallic attraction.",
    "concept": "Metallic bond strength increases across a period (Na -> Mg -> Al) as delocalised valence electrons increase and cationic radius decreases."
  },
  {
    "id": "kcse_chem_m2",
    "subject": "chemistry",
    "topicId": "chem_mole",
    "difficulty": "medium",
    "question": "25.0 cm^3 of sodium carbonate solution required 20.0 cm^3 of 0.25 M hydrochloric acid for complete neutralisation: Na2CO3(aq) + 2HCl(aq) -> 2NaCl(aq) + CO2(g) + H2O(l). Calculate the molarity of the Na2CO3 solution.",
    "options": [
      "0.10 M",
      "0.05 M",
      "0.40 M",
      "0.20 M"
    ],
    "correctIndex": 0,
    "explanation": "Moles of HCl = (0.25 x 20.0) / 1000 = 0.0050 mol. From the 1 : 2 mole ratio, moles of Na2CO3 = 0.0050 / 2 = 0.0025 mol in 25.0 cm^3. Molarity of Na2CO3 = (0.0025 x 1000) / 25.0 = 0.10 M.",
    "concept": "Always apply the stoichiometric mole ratio from the balanced equation (here 1 Na2CO3 : 2 HCl) before scaling back to 1,000 cm^3."
  },
  {
    "id": "kcse_chem_m3",
    "subject": "chemistry",
    "topicId": "chem_mole",
    "difficulty": "medium",
    "question": "An organic hydrocarbon contains 85.7% carbon and 14.3% hydrogen by mass and has a relative molecular mass of 42 (C = 12, H = 1). Determine its molecular formula.",
    "options": [
      "CH2",
      "C3H8",
      "C3H6",
      "C2H4"
    ],
    "correctIndex": 2,
    "explanation": "Mole ratio C : H = (85.7 / 12) : (14.3 / 1) = 7.14 : 14.3 = 1 : 2, so empirical formula is CH2 (empirical mass = 12 + 2 = 14). Multiplier n = 42 / 14 = 3, giving molecular formula (CH2)_3 = C3H6.",
    "concept": "Empirical formula gives the simplest whole-number atom ratio; Molecular Formula = (Empirical Formula)_n where n = RMM / Empirical Mass."
  },
  {
    "id": "kcse_chem_m4",
    "subject": "chemistry",
    "topicId": "chem_mole",
    "difficulty": "medium",
    "question": "A fixed mass of gas occupies 400 cm^3 at 27 degrees Celsius and 750 mmHg. What volume will it occupy at 127 degrees Celsius and 1,000 mmHg?",
    "options": [
      "400 cm^3",
      "533.3 cm^3",
      "1,407 cm^3",
      "300 cm^3"
    ],
    "correctIndex": 0,
    "explanation": "Convert temperatures to Kelvin: T1 = 27 + 273 = 300 K; T2 = 127 + 273 = 400 K. Using the combined gas law (P1*V1)/T1 = (P2*V2)/T2: V2 = (750 * 400 * 400) / (300 * 1000) = 120,000,000 / 300,000 = 400 cm^3.",
    "concept": "Combined gas law calculations MUST use absolute Kelvin temperature (K = C + 273); here the 4/3 temperature expansion cancels the 3/4 pressure compression!"
  },
  {
    "id": "kcse_chem_m5",
    "subject": "chemistry",
    "topicId": "chem_org",
    "difficulty": "medium",
    "question": "Name the organic compound formed when propan-1-ol is warmed with ethanoic acid in the presence of a few drops of concentrated sulphuric(VI) acid.",
    "options": [
      "Pentan-2-one",
      "Ethyl propanoate",
      "Propyl ethanoate",
      "Propanoic acid"
    ],
    "correctIndex": 2,
    "explanation": "In esterification, the alkyl prefix (\"Propyl-\") comes from the alkanol (propan-1-ol) and the alkanoate surname (\"ethanoate\") comes from the alkanoic acid (ethanoic acid), forming fruity-smelling propyl ethanoate + water.",
    "concept": "Ester naming rule: Alkanol gives the \"-yl\" first word; Alkanoic acid gives the \"-oate\" second word (Propanol + Ethanoic acid -> Propyl ethanoate)."
  },
  {
    "id": "kcse_chem_m6",
    "subject": "chemistry",
    "topicId": "chem_org",
    "difficulty": "medium",
    "question": "Why are soapyless detergents (alkylbenzenesulphonates) preferred over ordinary soaps for washing clothes in borehole hard water?",
    "options": [
      "Their calcium and magnesium salts are soluble in water, so they lather readily without forming insoluble scum",
      "They precipitate calcium ions as insoluble calcium stearate curds",
      "They neutralise borehole water by turning it into concentrated hydrochloric acid",
      "They are 100% biodegradable even when branched-chain hydrocarbons are used"
    ],
    "correctIndex": 0,
    "explanation": "Hard water contains dissolved Ca^2+ and Mg^2+ ions. Ordinary soaps (RCOO^-Na^+) react with Ca^2+/Mg^2+ to form insoluble scum, wasting soap, whereas soapyless detergents form water-soluble calcium/magnesium sulphonate salts.",
    "concept": "Soap forms insoluble Ca/Mg scum in hard water; soapyless detergents do not form scum (though non-biodegradable branched types can pollute water)."
  },
  {
    "id": "kcse_chem_m7",
    "subject": "chemistry",
    "topicId": "chem_elec",
    "difficulty": "medium",
    "question": "Consider the exothermic reversible Contact Process reaction: 2SO2(g) + O2(g) <-> 2SO3(g), delta H = -197 kJ/mol. Which change shifts equilibrium to the RIGHT to increase the equilibrium yield of SO3?",
    "options": [
      "Adding more vanadium(V) oxide catalyst at constant pressure",
      "Decreasing total pressure and raising temperature to 1,000 C",
      "Increasing total pressure (and/or lowering temperature moderately)",
      "Removing oxygen gas from the reaction chamber"
    ],
    "correctIndex": 2,
    "explanation": "There are 3 moles of gas on the left (2 + 1) and 2 moles of gas on the right. By Le Chatelier's principle, increasing pressure favours fewer gas moles (right), and since forward reaction is exothermic, lowering temperature favours the right (450 C is an optimum compromise for rate). Catalysts never shift equilibrium position!",
    "concept": "Catalysts speed up forward and reverse rates equally without altering equilibrium yield; pressure shifts only affect reactions with unequal gas moles."
  },
  {
    "id": "kcse_chem_m8",
    "subject": "chemistry",
    "topicId": "chem_elec",
    "difficulty": "medium",
    "question": "Given standard electrode potentials: Zn^2+(aq) + 2e- <-> Zn(s), E^0 = -0.76 V; Cu^2+(aq) + 2e- <-> Cu(s), E^0 = +0.34 V. Calculate the standard e.m.f. of the Zn | Zn^2+ || Cu^2+ | Cu electrochemical cell.",
    "options": [
      "+1.10 V",
      "-0.42 V",
      "+0.42 V",
      "-1.10 V"
    ],
    "correctIndex": 0,
    "explanation": "Cu^2+ has the more positive E^0 (+0.34 V) so it is reduced at the cathode; Zn has the more negative E^0 (-0.76 V) so it is oxidised at the anode. E^0_cell = E^0_reduced - E^0_oxidised = (+0.34) - (-0.76) = +1.10 V.",
    "concept": "E^0_cell = E^0(cathode / reduction) - E^0(anode / oxidation); a positive E^0_cell indicates a spontaneous redox reaction."
  },
  {
    "id": "kcse_chem_m9",
    "subject": "chemistry",
    "topicId": "chem_ind",
    "difficulty": "medium",
    "question": "In the electrolytic extraction of aluminium from purified bauxite (Al2O3), why is molten cryolite (Na3AlF6) added to aluminium oxide?",
    "options": [
      "To act as a reducing agent that displaces aluminium chemically without electricity",
      "To prevent oxygen gas at the carbon anodes from reacting with carbon",
      "To lower the operating melting temperature from ~2,050 C down to ~950 C, saving electrical/thermal energy and improving conductivity",
      "To precipitate iron(III) oxide impurities during Bayer digestion"
    ],
    "correctIndex": 2,
    "explanation": "Pure alumina (Al2O3) melts at ~2,054 C, which would be prohibitively expensive to maintain. Dissolving Al2O3 in molten cryolite (with a little fluorspar) lowers the electrolyte operating temperature to ~950 C.",
    "concept": "In Hall-Heroult aluminium extraction, cryolite lowers the fusion point of Al2O3, while carbon anodes must be replaced periodically because evolved O2 burns them to CO2."
  },
  {
    "id": "kcse_chem_m10",
    "subject": "chemistry",
    "topicId": "chem_ind",
    "difficulty": "medium",
    "question": "Why is the Solvay process for manufacturing sodium carbonate (Na2CO3) considered highly economical in industrial chemistry?",
    "options": [
      "Sodium chloride and limestone are synthesised inside the plant from gold",
      "It requires zero heat energy in both the kiln and carbonator tower",
      "Ammonium chloride is discarded into rivers so no lime is needed",
      "Expensive ammonia is regenerated in the slaker from ammonium chloride and calcium hydroxide, while carbon(IV) oxide is recycled from the kiln and roaster"
    ],
    "correctIndex": 3,
    "explanation": "In the Solvay plant, NH4Cl filtrate reacts with slaked lime Ca(OH)2 -> CaCl2 + 2NH3 + 2H2O, recycling nearly all the costly ammonia; CO2 from thermal decomposition of NaHCO3 is also recycled, leaving CaCl2 as the only major by-product.",
    "concept": "Solvay efficiency rests on continuous recycling of NH3 and CO2; CaCl2 is the principal by-product."
  },
  {
    "id": "kcse_chem_d1",
    "subject": "chemistry",
    "topicId": "chem_mole",
    "difficulty": "difficult",
    "question": "When 50 cm^3 of 1.0 M HCl is mixed with 50 cm^3 of 1.0 M NaOH in a plastic cup, the temperature rises by 6.5 C. Calculate the molar enthalpy of neutralisation (specific heat capacity = 4.2 J g^-1 K^-1, solution density = 1.0 g/cm^3).",
    "options": [
      "-6.5 kJ/mol",
      "-54.6 kJ/mol",
      "+54.6 kJ/mol",
      "-27.3 kJ/mol"
    ],
    "correctIndex": 1,
    "explanation": "Total solution volume = 50 + 50 = 100 cm^3 -> mass m = 100 g = 0.1 kg. Heat evolved Q = m * c * delta_T = 100 g * 4.2 J/(g K) * 6.5 K = 2,730 J = 2.73 kJ. Moles of water formed = (1.0 x 50)/1000 = 0.050 mol. Since temperature rose (exothermic), delta_H_neut = -2.73 kJ / 0.050 mol = -54.6 kJ/mol.",
    "concept": "Sum BOTH solution volumes for total mass m, divide Q by moles of H2O formed, and include the negative sign (-) for exothermic temperature rise!"
  },
  {
    "id": "kcse_chem_d2",
    "subject": "chemistry",
    "topicId": "chem_elec",
    "difficulty": "difficult",
    "question": "A steady current of 2.5 A is passed through aqueous copper(II) sulphate for 32 minutes 10 seconds using inert electrodes. Calculate the mass of copper deposited at the cathode (Cu = 63.5, 1 F = 96,500 C).",
    "options": [
      "0.794 g",
      "1.5875 g (1.59 g)",
      "3.175 g (3.18 g)",
      "6.35 g"
    ],
    "correctIndex": 1,
    "explanation": "Convert time to seconds: t = (32 x 60) + 10 = 1,920 + 10 = 1,930 s. Charge Q = I x t = 2.5 x 1,930 = 4,825 C. Since Cu^2+(aq) + 2e- -> Cu(s) requires 2 Faradays (2 x 96,500 = 193,000 C) to deposit 63.5 g of Cu: Mass = (4,825 / 193,000) x 63.5 = 0.025 x 63.5 = 1.5875 g (~1.59 g).",
    "concept": "Faraday's first law: Mass = (Q x RAM) / (z x F), where z is ionic charge (2 for Cu^2+) and t MUST be in seconds."
  },
  {
    "id": "kcse_chem_d3",
    "subject": "chemistry",
    "topicId": "chem_mole",
    "difficulty": "difficult",
    "question": "60 cm^3 of oxygen gas diffused through a porous plug in 50 seconds. Under identical temperature and pressure, how long will 90 cm^3 of sulphur(IV) oxide gas (SO2) take to diffuse through the same plug? (O = 16, S = 32)",
    "options": [
      "70.7 seconds",
      "106.1 seconds",
      "53.0 seconds",
      "150.0 seconds"
    ],
    "correctIndex": 1,
    "explanation": "Molar masses: M(O2) = 32, M(SO2) = 32 + 32 = 64. Rate of O2: R1 = 60 / 50 = 1.2 cm^3/s. By Graham's Law, R1 / R2 = sqrt(M2 / M1) = sqrt(64 / 32) = sqrt(2) = 1.4142. Thus R2(SO2) = 1.2 / sqrt(2) cm^3/s. Time for 90 cm^3 of SO2: t2 = 90 / (1.2 / sqrt(2)) = 75 * sqrt(2) = 106.07 -> 106.1 s.",
    "concept": "When gas volumes differ in Graham's Law problems, compare diffusion RATES (V/t), never raw times directly unless volumes are equal!"
  },
  {
    "id": "kcse_chem_d4",
    "subject": "chemistry",
    "topicId": "chem_atom",
    "difficulty": "difficult",
    "question": "Why is aluminium chloride (AlCl3) able to sublime at a relatively low temperature (~180 C) whereas magnesium chloride (MgCl2) melts only above 710 C?",
    "options": [
      "AlCl3 contains strong intermolecular hydrogen bonds that boil easily",
      "Small, highly charged Al^3+ strongly polarises Cl^- ions so AlCl3 forms covalent dimers (Al2Cl6) held by weak van der Waals forces, whereas MgCl2 has a giant ionic lattice",
      "Magnesium chloride is a simple molecular gas whereas aluminium chloride is giant metallic",
      "Aluminium is in Period 2 whereas magnesium is in Period 5"
    ],
    "correctIndex": 1,
    "explanation": "Across Period 3 chlorides, NaCl and MgCl2 have giant ionic structures with strong electrostatic attractions. Because Al^3+ has very high charge density, it polarises Cl^- electron clouds into predominantly covalent Al2Cl6 molecules attracted to each other by weak intermolecular van der Waals forces.",
    "concept": "Across Period 3 chlorides (NaCl, MgCl2 -> Al2Cl6, SiCl4, PCl3/PCl5), bonding transitions from giant ionic to simple molecular covalent."
  },
  {
    "id": "kcse_chem_d5",
    "subject": "chemistry",
    "topicId": "chem_org",
    "difficulty": "difficult",
    "question": "How many structural isomers exist for the saturated alkane pentane, C5H12, and what are their systematic IUPAC names?",
    "options": [
      "4 isomers: pentane, 2-methylbutane, 3-methylbutane, and 2,2-dimethylpropane",
      "3 isomers: pentane, 2-methylbutane, and 2,2-dimethylpropane",
      "5 isomers including cyclopentane",
      "2 isomers: pentane and 2-methylbutane"
    ],
    "correctIndex": 1,
    "explanation": "Note the classic IUPAC trap: \"3-methylbutane\" is identical to \"2-methylbutane\" numbered from the opposite end! Cyclopentane is C5H10, not C5H12. Thus C5H12 has exactly 3 chain isomers: pentane, 2-methylbutane, and 2,2-dimethylpropane.",
    "concept": "Always number the longest carbon chain from BOTH ends to verify you have not double-counted identical branched isomers."
  },
  {
    "id": "kcse_chem_d6",
    "subject": "chemistry",
    "topicId": "chem_elec",
    "difficulty": "difficult",
    "question": "During electrolysis of concentrated sodium chloride solution (brine) using inert graphite electrodes, which gases are discharged at the cathode and anode respectively, and how does the solution pH change?",
    "options": [
      "Cathode: Sodium metal; Anode: Oxygen gas; solution becomes strongly acidic",
      "Cathode: Hydrogen gas; Anode: Chlorine gas; remaining solution becomes alkaline (pH rises due to NaOH)",
      "Cathode: Chlorine gas; Anode: Hydrogen gas; solution remains neutral pH 7",
      "Cathode: Hydrogen gas; Anode: Oxygen gas; NaCl precipitates out"
    ],
    "correctIndex": 1,
    "explanation": "At the cathode, H+ is lower than Na+ in the electrochemical series and discharges as H2(g). At the anode, although OH- is lower than Cl-, high concentration of Cl- causes preferential discharge of Cl2(g). Na+ and OH- remain in solution, forming NaOH(aq) and raising pH.",
    "concept": "Preferential ion discharge depends on position in the electrochemical series, ion concentration (halides in concentrated brine), and nature of electrode (e.g. mercury cathode)."
  },
  {
    "id": "kcse_chem_d7",
    "subject": "chemistry",
    "topicId": "chem_elec",
    "difficulty": "difficult",
    "question": "In a chemistry qualitative analysis test, adding aqueous ammonia drop by drop and then in excess to colourless solution Z produces a white precipitate that dissolves in excess aqueous ammonia to give a colourless solution. Adding dilute NaOH(aq) in excess also gives a white precipitate soluble in excess. Identify the cation in Z.",
    "options": [
      "Ca^2+",
      "Zn^2+",
      "Pb^2+",
      "Al^3+"
    ],
    "correctIndex": 1,
    "explanation": "Zn^2+, Al^3+, and Pb^2+ all form amphoteric white hydroxides soluble in excess NaOH(aq), ONLY Zn(OH)2 dissolves in excess aqueous ammonia to form the colourless tetraamminezinc(II) complex ion [Zn(NH3)4]^2+. Al^3+ and Pb^2+ precipitates remain insoluble in excess NH3(aq).",
    "concept": "KNEC qualitative cation key: Zn^2+ gives white ppt soluble in BOTH excess NaOH(aq) and excess NH3(aq); Al^3+ and Pb^2+ dissolve in excess NaOH(aq) ONLY."
  },
  {
    "id": "kcse_chem_d8",
    "subject": "chemistry",
    "topicId": "chem_ind",
    "difficulty": "difficult",
    "question": "In the Contact Process for manufacturing sulphuric(VI) acid, why is sulphur(VI) oxide (SO3) absorbed in 98% concentrated sulphuric(VI) acid to form oleum (H2S2O7) rather than dissolved directly in water?",
    "options": [
      "Dissolving SO3 in water reduces sulphur back to hydrogen sulphide gas",
      "Direct reaction of SO3 with water is violently exothermic and produces a corrosive acid mist/fog of fine droplets that is very difficult to condense",
      "SO3 is completely insoluble in liquid water at room temperature",
      "Water poisons the vanadium(V) oxide catalyst inside the dilution tank"
    ],
    "correctIndex": 1,
    "explanation": "SO3(g) + H2O(l) -> H2SO4(l) releases intense heat that vaporises water and creates a hazardous, uncondensable sulphuric acid mist. Absorbing SO3 smoothly into conc. H2SO4 forms oleum (H2S2O7), which is then safely diluted with controlled water: H2S2O7 + H2O -> 2H2SO4.",
    "concept": "Contact Process safety step: SO3 + H2SO4(l) -> H2S2O7(l) (oleum), followed by controlled dilution with water."
  },
  {
    "id": "kcse_chem_d9",
    "subject": "chemistry",
    "topicId": "chem_mole",
    "difficulty": "difficult",
    "question": "10.6 g of impure anhydrous sodium carbonate was dissolved to make 250 cm^3 of solution. 25.0 cm^3 of this solution required 18.0 cm^3 of 0.50 M nitric(V) acid for complete neutralisation (Na2CO3 + 2HNO3 -> 2NaNO3 + CO2 + H2O; Na=23, C=12, O=16). Calculate the percentage purity of the Na2CO3.",
    "options": [
      "90.0%",
      "45.0%",
      "84.9%",
      "50.0%"
    ],
    "correctIndex": 1,
    "explanation": "Moles of HNO3 in 18.0 cm^3 = (0.50 x 18.0)/1000 = 0.0090 mol. Mole ratio Na2CO3 : HNO3 = 1 : 2, so moles of Na2CO3 in 25.0 cm^3 = 0.0090 / 2 = 0.0045 mol. Scaling to 250 cm^3 (x10) gives 0.045 mol of pure Na2CO3. Pure mass = 0.045 mol x 106 g/mol = 4.77 g. Percentage purity = (4.77 / 10.6) x 100% = 45.0%.",
    "concept": "In back/purity titrations, remember to scale moles from the 25 cm^3 aliquot up to the total 250 cm^3 volumetric flask before computing pure mass!"
  },
  {
    "id": "kcse_chem_d10",
    "subject": "chemistry",
    "topicId": "chem_elec",
    "difficulty": "difficult",
    "question": "Radioactive nuclide X (mass 234, atomic number 90) decays by emitting two beta (B-) particles and one alpha (4_2 He) particle to form nuclide Y. Determine the mass number and atomic number of Y.",
    "options": [
      "Mass number = 230, Atomic number = 90 (an isotope of X)",
      "Mass number = 226, Atomic number = 88",
      "Mass number = 234, Atomic number = 92",
      "Mass number = 230, Atomic number = 86"
    ],
    "correctIndex": 0,
    "explanation": "Each beta (0_-1 e) emission leaves mass number unchanged and increases atomic number by +1 (2 betas -> +2 atomic number). One alpha (4_2 He) emission decreases mass number by 4 and atomic number by 2. Net change: Mass = 234 - 4 = 230; Atomic number = 90 + 2 - 2 = 90 (an isotope of X!).",
    "concept": "Alpha decay subtracts 4 from mass number and 2 from atomic number; beta decay leaves mass number unchanged and adds 1 to atomic number."
  },
  {
    "id": "kcse_phy_e1",
    "subject": "physics",
    "topicId": "phy_mech",
    "difficulty": "easy",
    "question": "A helical spring of spring constant k = 250 N/m is stretched by a load of 15 N within its elastic limit. Calculate its extension in centimetres.",
    "options": [
      "6.0 cm",
      "0.06 cm",
      "16.7 cm",
      "37.5 cm"
    ],
    "correctIndex": 0,
    "explanation": "By Hooke's Law, F = k * e -> e = F / k = 15 N / 250 N/m = 0.06 m. Converting metres to centimetres: 0.06 x 100 = 6.0 cm.",
    "concept": "Hooke's Law states extension is directly proportional to stretching force provided the elastic limit is not exceeded (F = ke)."
  },
  {
    "id": "kcse_phy_e2",
    "subject": "physics",
    "topicId": "phy_mech",
    "difficulty": "easy",
    "question": "Calculate the liquid pressure alone at a depth of 12 m in fresh water of density 1,000 kg/m^3 (take g = 10 N/kg).",
    "options": [
      "12,000 Pa",
      "1,200,000 Pa",
      "120,000 Pa (120 kPa)",
      "83.3 Pa"
    ],
    "correctIndex": 2,
    "explanation": "Hydrostatic pressure due to liquid column P = h * rho * g = 12 m * 1,000 kg/m^3 * 10 N/kg = 120,000 N/m^2 (Pa).",
    "concept": "Fluid pressure increases linearly with depth h and fluid density rho (P = h*rho*g) and acts equally in all directions at a given depth."
  },
  {
    "id": "kcse_phy_e3",
    "subject": "physics",
    "topicId": "phy_heat",
    "difficulty": "easy",
    "question": "Why is the inner glass wall of a vacuum (thermos) flask silvered?",
    "options": [
      "To minimise heat loss or gain by thermal radiation since shiny silvered surfaces are poor emitters and good reflectors of infrared radiation",
      "To increase heat conduction into the surrounding plastic casing",
      "To prevent heat loss by convection through the glass",
      "To stop evaporation at the mouth of the flask"
    ],
    "correctIndex": 0,
    "explanation": "In a vacuum flask: the vacuum stops conduction and convection; the cork/plastic stopper reduces conduction and evaporation/convection; the silvered glass surfaces minimise radiation.",
    "concept": "Shiny, polished silver surfaces reflect infrared radiation and have very low emissivity."
  },
  {
    "id": "kcse_phy_e4",
    "subject": "physics",
    "topicId": "phy_heat",
    "difficulty": "easy",
    "question": "How much heat energy is required to raise the temperature of 2.0 kg of water from 25 C to 75 C? (Specific heat capacity of water = 4,200 J kg^-1 K^-1)",
    "options": [
      "630 kJ",
      "84 kJ",
      "420 kJ",
      "210 kJ"
    ],
    "correctIndex": 2,
    "explanation": "Q = m * c * delta_T = 2.0 kg * 4,200 J/(kg K) * (75 - 25) K = 2.0 * 4,200 * 50 = 420,000 J = 420 kJ.",
    "concept": "Sensible heat absorbed without change of state is Q = mc*delta_T."
  },
  {
    "id": "kcse_phy_e5",
    "subject": "physics",
    "topicId": "phy_opt",
    "difficulty": "easy",
    "question": "A radio station broadcasts electromagnetic waves at a frequency of 100 MHz. Given the speed of electromagnetic waves in air c = 3.0 x 10^8 m/s, calculate the wavelength.",
    "options": [
      "3.0 m",
      "3.0 x 10^6 m",
      "0.33 m",
      "300 m"
    ],
    "correctIndex": 0,
    "explanation": "Convert 100 MHz to Hz: f = 100 x 10^6 Hz = 1.0 x 10^8 Hz. Using v = f * lambda: lambda = c / f = (3.0 x 10^8 m/s) / (1.0 x 10^8 Hz) = 3.0 m.",
    "concept": "Remember 1 MHz = 10^6 Hz; all electromagnetic waves travel in vacuum/air at 3.0 x 10^8 m/s."
  },
  {
    "id": "kcse_phy_e6",
    "subject": "physics",
    "topicId": "phy_opt",
    "difficulty": "easy",
    "question": "Two plane mirrors are inclined at an angle of 60 degrees to each other. How many images of a point object placed symmetrically between them are formed?",
    "options": [
      "7 images",
      "4 images",
      "5 images",
      "6 images"
    ],
    "correctIndex": 2,
    "explanation": "Number of images formed by two inclined plane mirrors is n = (360 / theta) - 1 = (360 / 60) - 1 = 6 - 1 = 5 images.",
    "concept": "Inclined plane mirror formula: n = (360 degrees / theta) - 1."
  },
  {
    "id": "kcse_phy_e7",
    "subject": "physics",
    "topicId": "phy_elec",
    "difficulty": "easy",
    "question": "Three resistors of 2 ohms, 3 ohms, and 6 ohms are connected in parallel across a battery. Calculate their combined (effective) resistance.",
    "options": [
      "1.0 ohm",
      "2.0 ohms",
      "11.0 ohms",
      "0.5 ohms"
    ],
    "correctIndex": 0,
    "explanation": "1 / R_eff = 1/2 + 1/3 + 1/6 = 3/6 + 2/6 + 1/6 = 6/6 = 1 ohm^-1. Taking the reciprocal gives R_eff = 1.0 ohm.",
    "concept": "The effective resistance of resistors in parallel is always smaller than the smallest individual resistor in the branch."
  },
  {
    "id": "kcse_phy_e8",
    "subject": "physics",
    "topicId": "phy_elec",
    "difficulty": "easy",
    "question": "In standard three-pin domestic mains wiring in Kenya (240 V AC), on which wire MUST the fuse and wall switch always be connected, and what is its modern insulation colour?",
    "options": [
      "Neutral wire (Blue insulation)",
      "Earth wire (Red insulation)",
      "Live wire (Brown insulation)",
      "Earth wire (Green/Yellow striped insulation)"
    ],
    "correctIndex": 2,
    "explanation": "Connecting the switch and fuse on the Live (Brown) wire ensures that when the switch is turned off or the fuse blows, the appliance is completely isolated from the high 240 V potential.",
    "concept": "Domestic wiring safety: Live = Brown (carries fuse & switch); Neutral = Blue; Earth = Green/Yellow."
  },
  {
    "id": "kcse_phy_e9",
    "subject": "physics",
    "topicId": "phy_mod",
    "difficulty": "easy",
    "question": "A radioactive isotope has a half-life of 8 days. What fraction of its original undecayed nuclei remains after 24 days?",
    "options": [
      "1/8",
      "1/4",
      "1/3",
      "1/16"
    ],
    "correctIndex": 0,
    "explanation": "Number of half-lives n = Total time / t_(1/2) = 24 / 8 = 3 half-lives. Remaining fraction = (1/2)^3 = 1/8.",
    "concept": "After n half-lives, the remaining undecayed fraction is (1/2)^n and the decayed fraction is 1 - (1/2)^n."
  },
  {
    "id": "kcse_phy_e10",
    "subject": "physics",
    "topicId": "phy_mod",
    "difficulty": "easy",
    "question": "In an X-ray tube, why is the target anode made of tungsten embedded in a thick copper block?",
    "options": [
      "Copper emits harder X-rays than tungsten when cooled",
      "Tungsten has a very high melting point (~3,400 C) to withstand intense electron bombardment, while copper conducts away the ~99% waste heat rapidly",
      "Tungsten has a very low work function for thermionic emission of electrons",
      "Tungsten focuses cathode rays magnetically toward the filament"
    ],
    "correctIndex": 1,
    "explanation": "Over 99% of kinetic energy of fast electrons striking the target turns into heat (less than 1% becomes X-rays). Tungsten resists melting due to its high melting point, and high-conductivity copper dissipates heat to cooling fins/oil.",
    "concept": "X-ray tube design: Tungsten target = high melting point + high atomic number; Copper anode block = high thermal conductivity."
  },
  {
    "id": "kcse_phy_m1",
    "subject": "physics",
    "topicId": "phy_mech",
    "difficulty": "medium",
    "question": "A uniform metre rule of negligible weight is pivoted at the 40 cm mark. A 6.0 N weight hangs at the 10 cm mark. What downward force must hang at the 85 cm mark to balance the metre rule horizontally?",
    "options": [
      "4.5 N",
      "3.0 N",
      "4.0 N",
      "2.1 N"
    ],
    "correctIndex": 2,
    "explanation": "Distances MUST be measured from the pivot (40 cm mark): anticlockwise distance d1 = 40 - 10 = 30 cm; clockwise distance d2 = 85 - 40 = 45 cm. By Principle of Moments: 6.0 x 30 = F x 45 -> 180 = 45F -> F = 4.0 N.",
    "concept": "Always measure perpendicular moment arms strictly from the pivot/fulcrum, never from the 0 cm end unless pivoted there!"
  },
  {
    "id": "kcse_phy_m2",
    "subject": "physics",
    "topicId": "phy_mech",
    "difficulty": "medium",
    "question": "A trolley of mass 3.0 kg moving at 4.0 m/s collides with and sticks to a stationary trolley of mass 1.0 kg on a frictionless track. Calculate their common velocity immediately after collision.",
    "options": [
      "3.0 m/s",
      "2.0 m/s",
      "12.0 m/s",
      "4.0 m/s"
    ],
    "correctIndex": 0,
    "explanation": "By conservation of linear momentum in an inelastic collision: m1*u1 + m2*u2 = (m1 + m2)*v -> (3.0 * 4.0) + (1.0 * 0) = (3.0 + 1.0)v -> 12.0 = 4.0v -> v = 3.0 m/s.",
    "concept": "Total linear momentum is conserved in both elastic and inelastic collisions provided no external resultant force acts."
  },
  {
    "id": "kcse_phy_m3",
    "subject": "physics",
    "topicId": "phy_heat",
    "difficulty": "medium",
    "question": "Calculate the total heat energy needed to convert 0.5 kg of ice at 0 C completely into liquid water at 20 C (specific latent heat of fusion of ice = 336,000 J/kg; specific heat capacity of water = 4,200 J kg^-1 K^-1).",
    "options": [
      "378,000 J (378 kJ)",
      "168,000 J (168 kJ)",
      "210,000 J (210 kJ)",
      "42,000 J (42 kJ)"
    ],
    "correctIndex": 2,
    "explanation": "Two distinct thermal stages occur: (1) Melting 0.5 kg ice at 0 C to water at 0 C: Q1 = m*L_f = 0.5 * 336,000 = 168,000 J. (2) Warming 0.5 kg water from 0 C to 20 C: Q2 = m*c*delta_T = 0.5 * 4,200 * 20 = 42,000 J. Total Q = 168,000 + 42,000 = 210,000 J (210 kJ).",
    "concept": "Sum latent heat (Q = mL_f at constant 0 C) and sensible heat (Q = mc*delta_T from 0 C to final temperature)."
  },
  {
    "id": "kcse_phy_m4",
    "subject": "physics",
    "topicId": "phy_opt",
    "difficulty": "medium",
    "question": "An object is placed 30 cm in front of a converging (biconvex) lens of focal length 10 cm. Find the image distance and describe the nature of the image.",
    "options": [
      "15 cm behind the lens; real, inverted, and diminished",
      "7.5 cm behind the lens; real, inverted, and magnified",
      "20 cm behind the lens; real, inverted, and same size",
      "15 cm in front of the lens; virtual, upright, and magnified"
    ],
    "correctIndex": 0,
    "explanation": "Using 1/f = 1/u + 1/v with f = +10 cm and u = +30 cm: 1/v = 1/10 - 1/30 = (3 - 1)/30 = 2/30 = 1/15 -> v = +15 cm. Since v > 0, the image is real and inverted; magnification m = v/u = 15/30 = 0.5 (< 1, diminished).",
    "concept": "For a convex lens, an object placed beyond 2F (u = 30 cm > 20 cm) forms a real, inverted, diminished image between F and 2F."
  },
  {
    "id": "kcse_phy_m5",
    "subject": "physics",
    "topicId": "phy_opt",
    "difficulty": "medium",
    "question": "Calculate the critical angle for glass of refractive index n = 1.50 at a glass-air boundary.",
    "options": [
      "60.0 degrees",
      "48.6 degrees",
      "41.8 degrees",
      "30.0 degrees"
    ],
    "correctIndex": 2,
    "explanation": "sin c = 1 / n = 1 / 1.50 = 0.6667. Taking the inverse sine gives c = sin^-1(0.6667) = 41.81 degrees (~41.8 degrees).",
    "concept": "Total internal reflection occurs when light travels from an optically denser to a less dense medium at an angle of incidence exceeding c = sin^-1(1/n)."
  },
  {
    "id": "kcse_phy_m6",
    "subject": "physics",
    "topicId": "phy_opt",
    "difficulty": "medium",
    "question": "A girl standing 170 m in front of a vertical cliff claps her hands once and hears the echo 1.0 second later. Calculate the speed of sound in air.",
    "options": [
      "340 m/s",
      "510 m/s",
      "85 m/s",
      "170 m/s"
    ],
    "correctIndex": 0,
    "explanation": "For an echo, the sound wave travels TO the cliff and BACK (2d = 2 x 170 m = 340 m). Speed v = 2d / t = 340 m / 1.0 s = 340 m/s.",
    "concept": "Echo problems involve a round-trip path of 2d, so v = 2d / t."
  },
  {
    "id": "kcse_phy_m7",
    "subject": "physics",
    "topicId": "phy_elec",
    "difficulty": "medium",
    "question": "Two capacitors of 4 uF and 12 uF are connected in SERIES across a 24 V DC supply. Calculate the effective capacitance and the charge stored on each capacitor.",
    "options": [
      "16 uF; 384 uC",
      "3 uF; 36 uC",
      "3 uF; 72 uC",
      "8 uF; 192 uC"
    ],
    "correctIndex": 2,
    "explanation": "For capacitors in series: C_eff = (C1 * C2) / (C1 + C2) = (4 * 12) / (4 + 12) = 48 / 16 = 3 uF. Total charge Q = C_eff * V = 3 uF * 24 V = 72 uC (series capacitors carry identical charge Q!).",
    "concept": "Capacitors in series combine reciprocally (1/C = 1/C1 + 1/C2) and store the exact same charge Q on every capacitor."
  },
  {
    "id": "kcse_phy_m8",
    "subject": "physics",
    "topicId": "phy_elec",
    "difficulty": "medium",
    "question": "A dry cell of e.m.f. E = 1.5 V and internal resistance r = 0.5 ohms is connected across an external resistor R = 2.5 ohms. Calculate the terminal potential difference across R.",
    "options": [
      "1.25 V",
      "0.25 V",
      "0.50 V",
      "1.50 V"
    ],
    "correctIndex": 0,
    "explanation": "Circuit current I = E / (R + r) = 1.5 / (2.5 + 0.5) = 1.5 / 3.0 = 0.5 A. Terminal p.d. V = I * R = 0.5 A * 2.5 ohms = 1.25 V (with 0.25 V \"lost volts\" across r).",
    "concept": "E = V + Ir = I(R + r); terminal voltage V = E - Ir drops below e.m.f. whenever current is drawn."
  },
  {
    "id": "kcse_phy_m9",
    "subject": "physics",
    "topicId": "phy_mod",
    "difficulty": "medium",
    "question": "How does increasing the accelerating potential difference (kV) between the cathode and anode of an X-ray tube affect the X-rays produced?",
    "options": [
      "It increases only the number of electrons emitted without changing X-ray wavelength",
      "It produces longer-wavelength (\"softer\") X-rays with lower penetrating power",
      "It increases the kinetic energy of electrons, producing shorter-wavelength, higher-frequency (\"harder\") X-rays with greater penetrating power",
      "It stops thermionic emission at the filament"
    ],
    "correctIndex": 2,
    "explanation": "By eV = hf_max = hc / lambda_min, raising accelerating voltage V increases f_max and decreases minimum wavelength, yielding harder, more penetrating X-rays. By contrast, filament heating current controls intensity (quantity of electrons).",
    "concept": "X-ray tube controls: Accelerating kV -> quality/hardness (wavelength/penetration); Filament current -> intensity (rate of X-ray photons)."
  },
  {
    "id": "kcse_phy_m10",
    "subject": "physics",
    "topicId": "phy_mod",
    "difficulty": "medium",
    "question": "When a p-n junction diode is connected in reverse bias (p-type to negative terminal, n-type to positive terminal), why does negligible current flow?",
    "options": [
      "The silicon crystal melts into an insulator",
      "Holes and electrons flood across the junction, reducing resistance to zero",
      "Protons migrate from the n-type side into the external copper wire",
      "Majority charge carriers (holes and electrons) are pulled away from the junction, widening the depletion layer and raising the potential barrier"
    ],
    "correctIndex": 3,
    "explanation": "Reverse bias attracts holes toward the negative battery terminal and electrons toward the positive terminal, widening the charge-free depletion region so only a tiny microampere leakage current of minority carriers flows.",
    "concept": "Forward bias narrows the p-n depletion layer (conducts); reverse bias widens the depletion layer (blocks current)."
  },
  {
    "id": "kcse_phy_d1",
    "subject": "physics",
    "topicId": "phy_mech",
    "difficulty": "difficult",
    "question": "A stone is projected vertically upwards from the top of a 25 m tower with an initial velocity of 20 m/s. Taking g = 10 m/s^2 and neglecting air resistance, calculate the total time taken for the stone to hit the ground at the base of the tower.",
    "options": [
      "6.5 seconds",
      "5.0 seconds",
      "3.0 seconds",
      "4.0 seconds"
    ],
    "correctIndex": 1,
    "explanation": "Taking upward as positive from the tower top, final displacement at the ground is s = -25 m, u = +20 m/s, a = -10 m/s^2. Using s = ut + (1/2)at^2: -25 = 20t - 5t^2 -> 5t^2 - 20t - 25 = 0 -> t^2 - 4t - 5 = 0 -> (t - 5)(t + 1) = 0. Since t > 0, t = 5.0 seconds.",
    "concept": "Using vector displacement s = -25 m solves upward-then-downward projectile motion in a single step without splitting at maximum height."
  },
  {
    "id": "kcse_phy_d2",
    "subject": "physics",
    "topicId": "phy_mech",
    "difficulty": "difficult",
    "question": "A solid metal block weighs 4.8 N in air, 3.6 N when completely immersed in water (density 1,000 kg/m^3), and 3.84 N when completely immersed in a liquid L. Calculate the density of liquid L.",
    "options": [
      "960 kg/m^3",
      "800 kg/m^3",
      "1,200 kg/m^3",
      "750 kg/m^3"
    ],
    "correctIndex": 1,
    "explanation": "By Archimedes' Principle, upthrust in liquid L = 4.8 - 3.84 = 0.96 N; upthrust in water = 4.8 - 3.6 = 1.20 N. Relative density of liquid L = (Upthrust in liquid L) / (Upthrust in equal volume of water) = 0.96 / 1.20 = 0.80. Density = 0.80 x 1,000 kg/m^3 = 800 kg/m^3.",
    "concept": "Relative density of a liquid = (Apparent loss of weight of sinker in liquid) / (Apparent loss of weight of same sinker in water)."
  },
  {
    "id": "kcse_phy_d3",
    "subject": "physics",
    "topicId": "phy_mech",
    "difficulty": "difficult",
    "question": "A 0.4 kg bob attached to an inextensible string of length 0.5 m is whirled in a vertical circle at a constant speed of 5.0 m/s. Calculate the maximum tension in the string (take g = 10 m/s^2).",
    "options": [
      "20.0 N",
      "24.0 N",
      "4.0 N",
      "16.0 N"
    ],
    "correctIndex": 1,
    "explanation": "Maximum tension in a vertical circle occurs at the lowest point, where tension must both support weight mg AND provide upward centripetal force mv^2/r: T_max = mv^2/r + mg = (0.4 * 25 / 0.5) + (0.4 * 10) = 20.0 + 4.0 = 24.0 N.",
    "concept": "In vertical circular motion: T_bottom = mv^2/r + mg (maximum tension, where string is most likely to snap); T_top = mv^2/r - mg (minimum tension)."
  },
  {
    "id": "kcse_phy_d4",
    "subject": "physics",
    "topicId": "phy_elec",
    "difficulty": "difficult",
    "question": "A step-down transformer has 1,200 turns in its primary coil connected to a 240 V AC mains and 60 turns in its secondary coil. If the transformer is 80% efficient and delivers a secondary current of 5.0 A, calculate the primary current drawn from the mains.",
    "options": [
      "0.20 A",
      "0.3125 A",
      "0.25 A",
      "1.25 A"
    ],
    "correctIndex": 1,
    "explanation": "First find secondary voltage: V_s / 240 = 60 / 1,200 -> V_s = 12 V. Power output P_out = V_s * I_s = 12 V * 5.0 A = 60 W. Since efficiency = (P_out / P_in) = 0.80, P_in = 60 / 0.80 = 75 W. Primary current I_p = P_in / V_p = 75 W / 240 V = 0.3125 A.",
    "concept": "For a real (<100% efficient) transformer, V_s/V_p = N_s/N_p still holds approximately, while I_p must be found via Efficiency = (V_s * I_s) / (V_p * I_p)."
  },
  {
    "id": "kcse_phy_d5",
    "subject": "physics",
    "topicId": "phy_elec",
    "difficulty": "difficult",
    "question": "A Kenyan household runs two 100 W bulbs for 5 hours a day and a 2,000 W electric kettle for 30 minutes a day for 30 days. At KES 22.00 per kilowatt-hour (kWh), calculate the monthly electricity cost for these appliances.",
    "options": [
      "KES 660",
      "KES 1,320",
      "KES 1,100",
      "KES 1,980"
    ],
    "correctIndex": 1,
    "explanation": "Daily energy: Bulbs = 2 x 0.1 kW x 5 h = 1.0 kWh; Kettle = 2.0 kW x 0.5 h = 1.0 kWh. Total per day = 2.0 kWh. Over 30 days = 2.0 x 30 = 60 kWh. Monthly cost = 60 kWh x KES 22.00 = KES 1,320.",
    "concept": "1 commercial unit of electricity = 1 kWh = Power (in kW) x Time (in hours)."
  },
  {
    "id": "kcse_phy_d6",
    "subject": "physics",
    "topicId": "phy_mod",
    "difficulty": "difficult",
    "question": "Monochromatic ultraviolet radiation of frequency 1.0 x 10^15 Hz illuminates a metal surface of work function 2.2 eV. Calculate the maximum kinetic energy of emitted photoelectrons in Joules (h = 6.63 x 10^-34 J s; 1 eV = 1.6 x 10^-19 J).",
    "options": [
      "6.63 x 10^-19 J",
      "3.11 x 10^-19 J",
      "3.52 x 10^-19 J",
      "1.01 x 10^-18 J"
    ],
    "correctIndex": 1,
    "explanation": "Convert work function W_0 to Joules: W_0 = 2.2 x 1.6 x 10^-19 = 3.52 x 10^-19 J. Photon energy E = hf = 6.63 x 10^-34 x 1.0 x 10^15 = 6.63 x 10^-19 J. By Einstein's photoelectric equation: KE_max = hf - W_0 = (6.63 - 3.52) x 10^-19 = 3.11 x 10^-19 J.",
    "concept": "Always convert electron-volts (eV) to Joules by multiplying by 1.6 x 10^-19 J/eV before subtracting from hf."
  },
  {
    "id": "kcse_phy_d7",
    "subject": "physics",
    "topicId": "phy_mod",
    "difficulty": "difficult",
    "question": "On the screen of a Cathode Ray Oscilloscope (CRO) with time-base sensitivity set to 5 ms/cm and Y-gain set to 2 V/cm, a sinusoidal AC waveform has a peak-to-peak height of 6 cm and one complete cycle spans 4 cm horizontally. Determine the peak voltage and frequency of the AC signal.",
    "options": [
      "Peak voltage = 12 V; Frequency = 200 Hz",
      "Peak voltage = 6 V; Frequency = 50 Hz",
      "Peak voltage = 6 V; Frequency = 20 Hz",
      "Peak voltage = 12 V; Frequency = 50 Hz"
    ],
    "correctIndex": 1,
    "explanation": "Peak-to-peak height = 6 cm, so amplitude (peak height from centre line) = 6 / 2 = 3 cm -> Peak voltage V_0 = 3 cm x 2 V/cm = 6 V! Period T = 4 cm x 5 ms/cm = 20 ms = 0.020 s -> Frequency f = 1 / T = 1 / 0.020 = 50 Hz.",
    "concept": "CRO trap: halve the peak-to-peak vertical height first to get peak amplitude, and convert milliseconds to seconds (x 10^-3) before taking f = 1/T."
  },
  {
    "id": "kcse_phy_d8",
    "subject": "physics",
    "topicId": "phy_opt",
    "difficulty": "difficult",
    "question": "A concave (diverging) lens of focal length 12 cm forms an image of an object placed 24 cm in front of it. Calculate the image distance and linear magnification.",
    "options": [
      "v = -24.0 cm (virtual); magnification = 1.0",
      "v = -8.0 cm (virtual, 8 cm on same side as object); magnification = 1/3",
      "v = +24.0 cm (real); magnification = 1.0",
      "v = +8.0 cm (real); magnification = 3.0"
    ],
    "correctIndex": 1,
    "explanation": "Under real-is-positive convention, a diverging (concave) lens has negative focal length f = -12 cm, while real object u = +24 cm. Using 1/f = 1/u + 1/v: -1/12 = 1/24 + 1/v -> 1/v = -1/12 - 1/24 = -3/24 = -1/8 -> v = -8.0 cm (virtual). Magnification m = |v|/u = 8/24 = 1/3.",
    "concept": "A diverging lens ALWAYS has negative focal length (f < 0) and forms a virtual, upright, diminished image for any real object."
  },
  {
    "id": "kcse_phy_d9",
    "subject": "physics",
    "topicId": "phy_heat",
    "difficulty": "difficult",
    "question": "An electric immersion heater rated 1,500 W is placed in boiling water at 100 C on a top-pan balance. In 4 minutes, the balance reading decreases by 150 g as steam escapes. Neglecting heat losses, calculate the specific latent heat of vaporisation of water.",
    "options": [
      "1.00 x 10^4 J/kg",
      "2.40 x 10^6 J/kg",
      "3.60 x 10^6 J/kg",
      "4.00 x 10^4 J/kg"
    ],
    "correctIndex": 1,
    "explanation": "Convert time t = 4 x 60 = 240 s and mass boiled off m = 150 / 1000 = 0.15 kg. Electrical energy supplied E = P x t = 1,500 W x 240 s = 360,000 J. Equating P*t = m*L_v gives L_v = 360,000 J / 0.15 kg = 2,400,000 J/kg = 2.40 x 10^6 J/kg.",
    "concept": "At constant boiling point, electrical energy P*t equals latent heat of vaporisation m*L_v (convert minutes -> seconds and grams -> kg!)."
  },
  {
    "id": "kcse_phy_d10",
    "subject": "physics",
    "topicId": "phy_elec",
    "difficulty": "difficult",
    "question": "According to Lenz's Law, when the North pole of a strong bar magnet is pushed rapidly INTO one end of a stationary solenoid connected to a galvanometer, what polarity is induced at that near end of the solenoid, and why?",
    "options": [
      "A North pole is induced to repel the approaching magnet, so mechanical work done against repulsion is converted into electrical energy",
      "Both ends of the solenoid become North poles simultaneously",
      "No pole is induced until the magnet stops moving inside the coil",
      "A South pole is induced to attract the magnet faster and create free electrical energy"
    ],
    "correctIndex": 0,
    "explanation": "Lenz's Law is a direct consequence of conservation of energy: the induced current flows in a direction such that its magnetic field opposes the change causing it (inducing a North pole to repel an approaching North pole). Attracting it would violate conservation of energy!",
    "concept": "Lenz's Law expresses conservation of energy in electromagnetic induction: induced e.m.f. always opposes the flux change producing it."
  },
  {
    "id": "kcse_hist_e1",
    "subject": "history",
    "topicId": "hist_pre",
    "difficulty": "easy",
    "question": "Which pre-colonial Kenyan community had a centralized hereditary kingship led by a ruler titled the \"Nabongo\"?",
    "options": [
      "The Luo",
      "The Ameru",
      "The Agikuyu",
      "The Abawanga (Wanga sub-group of the Abaluhya)"
    ],
    "correctIndex": 3,
    "explanation": "While almost all pre-colonial Kenyan societies were governed by decentralized councils of elders, the Abawanga Kingdom in Western Kenya had a centralized hereditary monarchy headed by the Nabongo (notably Nabongo Mumia).",
    "concept": "The Wanga Kingdom (under the Nabongo) is the prime KNEC example of centralized pre-colonial political organization in Kenya."
  },
  {
    "id": "kcse_hist_e2",
    "subject": "history",
    "topicId": "hist_pre",
    "difficulty": "easy",
    "question": "Into which major linguistic sub-group of Nilotes are the Luo of Kenya classified?",
    "options": [
      "Highland Nilotes",
      "Plains Nilotes",
      "Southern Cushites",
      "River-Lake Nilotes"
    ],
    "correctIndex": 3,
    "explanation": "Kenyan Nilotes comprise three sub-groups: River-Lake Nilotes (the Luo), Plains Nilotes (Maasai, Samburu, Turkana, Iteso, Njemps), and Highland Nilotes (Kalenjin sub-groups).",
    "concept": "The Luo are the sole representatives of River-Lake Nilotes in Kenya, having migrated from Bahr-el-Ghazal through Pubungu Pakwach."
  },
  {
    "id": "kcse_hist_e3",
    "subject": "history",
    "topicId": "hist_col",
    "difficulty": "easy",
    "question": "What was the historic declaration of the Devonshire White Paper of 1923 regarding competing racial interests in Kenya Colony?",
    "options": [
      "European settlers were granted immediate internal self-government similar to Southern Rhodesia",
      "Africans were granted universal adult suffrage in the Legislative Council in 1923",
      "The Kenya Highlands were opened immediately to unrestricted Asian and African purchase",
      "Kenya was primarily an African territory, and whenever African interests conflicted with immigrant settler or Asian interests, African interests must be paramount"
    ],
    "correctIndex": 3,
    "explanation": "Issued by Colonial Secretary the Duke of Devonshire in 1923, the paper declared African paramountcy in principle, blocked settler demands for minority self-rule, allowed 5 Asian LegCo seats, and appointed a missionary (Dr John Arthur) to represent African interests.",
    "concept": "The 1923 Devonshire White Paper thwarted settler self-rule ambitions by proclaiming the paramountcy of African interests (even if poorly enforced in practice)."
  },
  {
    "id": "kcse_hist_e4",
    "subject": "history",
    "topicId": "hist_col",
    "difficulty": "easy",
    "question": "Who became the first African to be nominated to the Legislative Council (LegCo) in colonial Kenya in October 1944?",
    "options": [
      "Jaramogi Oginga Odinga",
      "Benaiah Ohanga",
      "Ronald Ngala",
      "Eliud Mathu"
    ],
    "correctIndex": 3,
    "explanation": "Eliud Mathu was nominated to the LegCo in 1944 to represent African interests, replacing missionary representation; Benaiah Ohanga later became the first African minister under the 1954 Lyttelton Constitution.",
    "concept": "Colonial representation milestones: 1944 = Eliud Mathu (first African in LegCo); 1954 = Benaiah Ohanga (first African Minister); 1957 = first 8 elected African LegCo members."
  },
  {
    "id": "kcse_hist_e5",
    "subject": "history",
    "topicId": "hist_con",
    "difficulty": "easy",
    "question": "On what exact date was the current Constitution of Kenya formally promulgated?",
    "options": [
      "4 August 2010",
      "1 June 1963",
      "12 December 1963",
      "27 August 2010"
    ],
    "correctIndex": 3,
    "explanation": "Kenyans approved the draft constitution in the national referendum on 4 August 2010, and President Mwai Kibaki formally promulgated it at Uhuru Park on 27 August 2010.",
    "concept": "Distinguish the constitutional referendum date (4 August 2010) from the official promulgation date (27 August 2010)."
  },
  {
    "id": "kcse_hist_e6",
    "subject": "history",
    "topicId": "hist_con",
    "difficulty": "easy",
    "question": "How many devolved County Governments were established under the First Schedule of the 2010 Constitution of Kenya?",
    "options": [
      "42 Counties",
      "8 Provinces",
      "290 Counties",
      "47 Counties"
    ],
    "correctIndex": 3,
    "explanation": "The 2010 Constitution abolished provincial administration tiers and established 47 devolved County Governments (while 290 is the number of parliamentary constituencies).",
    "concept": "Kenya has 1 National Government, 47 County Governments, and 290 single-member National Assembly constituencies."
  },
  {
    "id": "kcse_hist_e7",
    "subject": "history",
    "topicId": "hist_gov",
    "difficulty": "easy",
    "question": "Which court is the highest court of appeal and final interpreter of the Constitution in Kenya's judicial hierarchy?",
    "options": [
      "The Kadhis' Court",
      "The High Court",
      "The Court of Appeal",
      "The Supreme Court of Kenya"
    ],
    "correctIndex": 3,
    "explanation": "Established under Article 163 of the 2010 Constitution and headed by the Chief Justice, the Supreme Court is the apex court in Kenya and also holds exclusive original jurisdiction over presidential election petitions.",
    "concept": "Superior courts in Kenya (highest downward): Supreme Court -> Court of Appeal -> High Court (plus Employment & Labour Relations and Environment & Land Courts)."
  },
  {
    "id": "kcse_hist_e8",
    "subject": "history",
    "topicId": "hist_gov",
    "difficulty": "easy",
    "question": "Who is the chief legal adviser to the National Government of Kenya under Article 156 of the Constitution?",
    "options": [
      "The Director of Public Prosecutions (DPP)",
      "The Chief Justice",
      "The Speaker of the National Assembly",
      "The Attorney-General"
    ],
    "correctIndex": 3,
    "explanation": "The Attorney-General is the principal legal adviser to the Government and represents the national government in civil proceedings, whereas criminal prosecutions are headed independently by the DPP (Article 157).",
    "concept": "The 2010 Constitution separated the Attorney-General (civil legal adviser) from the Director of Public Prosecutions (criminal prosecutions)."
  },
  {
    "id": "kcse_hist_e9",
    "subject": "history",
    "topicId": "hist_int",
    "difficulty": "easy",
    "question": "Which assassination on 28 June 1914 served as the immediate spark that triggered the outbreak of the First World War?",
    "options": [
      "Sinking of the passenger liner Lusitania",
      "Invasion of Poland by Adolf Hitler",
      "Assassination of Tsar Nicholas II in St Petersburg",
      "Assassination of Archduke Franz Ferdinand of Austria-Hungary and his wife Sophie in Sarajevo"
    ],
    "correctIndex": 3,
    "explanation": "Bosnian Serb nationalist Gavrilo Princip assassinated Austro-Hungarian heir Archduke Franz Ferdinand in Sarajevo, activating rival European alliance blocs (Triple Entente vs Triple Alliance).",
    "concept": "Distinguish long-term causes of WWI (alliances, imperialism, arms race, nationalism) from the immediate Sarajevo trigger (28 June 1914)."
  },
  {
    "id": "kcse_hist_e10",
    "subject": "history",
    "topicId": "hist_int",
    "difficulty": "easy",
    "question": "Where is the permanent headquarters of the East African Community (EAC) located?",
    "options": [
      "Nairobi, Kenya",
      "Kampala, Uganda",
      "Arusha, Tanzania",
      "Addis Ababa, Ethiopia"
    ],
    "correctIndex": 2,
    "explanation": "The EAC Secretariat and East African Legislative Assembly (EALA) are headquartered in Arusha, Tanzania (while the African Union headquarters is in Addis Ababa, Ethiopia).",
    "concept": "Key headquarters: EAC = Arusha; African Union = Addis Ababa; UN = New York; ICJ = The Hague."
  },
  {
    "id": "kcse_hist_m1",
    "subject": "history",
    "topicId": "hist_pre",
    "difficulty": "medium",
    "question": "Which council of elders served as the supreme judicial and legislative authority among the Ameru during the pre-colonial period?",
    "options": [
      "Kokwet",
      "Njuri Ncheke",
      "Buch Piny",
      "Kiama kia Athamaki"
    ],
    "correctIndex": 1,
    "explanation": "Among the Ameru, the Njuri Ncheke stood at the apex of governance, settling major inter-clan disputes, officiating religious rituals, conserving sacred forests, and enacting moral laws.",
    "concept": "Match indigenous councils accurately: Ameru = Njuri Ncheke; Nandi/Kalenjin = Kokwet; Luo = Buch Piny; Mijikenda = Kambi."
  },
  {
    "id": "kcse_hist_m2",
    "subject": "history",
    "topicId": "hist_pre",
    "difficulty": "medium",
    "question": "Why did Sultan Seyyid Said transfer his capital from Muscat (Oman) to Zanzibar in 1840?",
    "options": [
      "The Uganda Railway terminated directly on Zanzibar Island",
      "Zanzibar had a deep natural harbour, cool fertile climate ideal for clove plantations, abundant fresh water, strategic island defence, and proximity to mainland trade caravans",
      "Muscat had been annexed by Germany during the Scramble for Africa in 1840",
      "Portuguese Viceroys invited Seyyid Said to rule Mombasa from Fort Jesus"
    ],
    "correctIndex": 1,
    "explanation": "Zanzibar was loyal to Oman during Mazrui rebellions, easily defensible as an island, blessed with fertile soil/rainfall for cloves and fresh water, and centrally positioned to control Indian Ocean and interior caravan trade.",
    "concept": "Seyyid Said's 1840 move to Zanzibar catalyzed clove plantation agriculture and Akamba/Nyamwezi/Swahili long-distance caravan trade."
  },
  {
    "id": "kcse_hist_m3",
    "subject": "history",
    "topicId": "hist_col",
    "difficulty": "medium",
    "question": "What was the main constitutional breakthrough of the Lyttelton Constitution of 1954 in colonial Kenya?",
    "options": [
      "It granted Kenya full Madaraka internal self-government under Jomo Kenyatta",
      "It established the first multiracial Council of Ministers (including one African minister, Benaiah Ohanga) and lifted the total ban on African political associations at district level (from 1955)",
      "It drafted the independence Majimbo constitution at Lancaster House",
      "It introduced parity of elected seats between Africans and Europeans (14 each)"
    ],
    "correctIndex": 1,
    "explanation": "Colonial Secretary Oliver Lyttelton introduced a multiracial Council of Ministers in 1954 (B. A. Ohanga became Minister for Community Development). Parity of 14 African elected seats came later under the 1958 Lennox-Boyd Constitution.",
    "concept": "Colonial constitutions: 1954 Lyttelton = multiracial Council of Ministers; 1958 Lennox-Boyd = 14 African elected LegCo seats + 12 specially elected members."
  },
  {
    "id": "kcse_hist_m4",
    "subject": "history",
    "topicId": "hist_col",
    "difficulty": "medium",
    "question": "Why did the British colonial administration construct the Uganda Railway from Mombasa to Kisumu (Port Florence) between 1896 and 1901?",
    "options": [
      "To link Nairobi directly to Cairo by standard-gauge electric rail",
      "Primarily for strategic control of Uganda and the headwaters of the River Nile, alongside easing troop deployment, abolishing slave porterage, and opening the interior to commerce",
      "Primarily to export gold discovered in Kakamega in 1895",
      "At the request of Imperial Germany to connect Dar es Salaam to Mombasa"
    ],
    "correctIndex": 1,
    "explanation": "Britain's overriding geopolitical motive in 1896 was securing Uganda—the source of the Nile vital to Egypt and the Suez Canal route to India—followed by administrative troop mobility and economic exploitation (later inviting white settlers to make the railway pay).",
    "concept": "Strategic imperial control of Uganda and the Nile headwaters was the #1 reason for building the 1896-1901 Uganda Railway; settler farming followed afterward to offset construction costs."
  },
  {
    "id": "kcse_hist_m5",
    "subject": "history",
    "topicId": "hist_con",
    "difficulty": "medium",
    "question": "Under Article 25 of the Constitution of Kenya (2010), which four fundamental rights and freedoms may NEVER be limited under any circumstances, even during a state of emergency?",
    "options": [
      "Freedom of assembly, freedom of movement, right to strike, and right to own land",
      "Freedom from torture and cruel/degrading treatment; freedom from slavery or servitude; right to a fair trial; and right to an order of habeas corpus",
      "Political campaign rights, dual citizenship, and tax exemption",
      "Freedom of expression, freedom of the media, privacy, and access to information"
    ],
    "correctIndex": 1,
    "explanation": "Article 25 explicitly lists exactly four non-derogable rights: (a) freedom from torture/cruel treatment, (b) freedom from slavery/servitude, (c) right to a fair trial, and (d) right to an order of habeas corpus.",
    "concept": "Memorise the four non-derogable rights in Article 25—all other Bill of Rights provisions can be reasonably limited by law under Article 24."
  },
  {
    "id": "kcse_hist_m6",
    "subject": "history",
    "topicId": "hist_gov",
    "difficulty": "medium",
    "question": "What is the distinctive constitutional mandate of the Senate under Article 96 of the Constitution of Kenya?",
    "options": [
      "To appoint Cabinet Secretaries and vet Principal Secretaries",
      "To represent the counties, protect the interests of counties and their governments, determine allocation of national revenue among counties, and try impeachment charges against Presidents/Governors",
      "To prepare the national budget estimates on behalf of the National Treasury",
      "To command the Kenya Defence Forces during wartime"
    ],
    "correctIndex": 1,
    "explanation": "Vetting of Cabinet Secretaries, Principal Secretaries, and Diplomats belongs exclusively to the National Assembly; the Senate safeguards devolution, legislates on Bills concerning counties, allocates county equitable share, and conducts impeachment trials.",
    "concept": "Separate bicameral powers carefully: National Assembly vets CSs/PSs and originates Money Bills; Senate protects counties and hears Governor/Presidential impeachment trials."
  },
  {
    "id": "kcse_hist_m7",
    "subject": "history",
    "topicId": "hist_gov",
    "difficulty": "medium",
    "question": "Who chairs the County Executive Committee (CEC) of each devolved County Government in Kenya, and how are CEC members appointed?",
    "options": [
      "Chaired by the Senator; CEC members are nominated by political parties",
      "Chaired by the County Governor; CEC members are nominated by the Governor from persons who are NOT members of the County Assembly and vetted/approved by the County Assembly",
      "Chaired by the County Speaker; CEC members are appointed by the Public Service Commission",
      "Chaired by the County Commissioner; CEC members are elected from sitting MCAs"
    ],
    "correctIndex": 1,
    "explanation": "Under Article 179, executive authority of the county vests in the County Executive Committee comprising the Governor, Deputy Governor, and CEC members appointed by the Governor (with County Assembly approval) from outside the Assembly (separation of powers).",
    "concept": "Both Cabinet Secretaries (national) and CEC Members (county) must be non-legislators under Kenya's 2010 presidential/devolved separation of powers."
  },
  {
    "id": "kcse_hist_m8",
    "subject": "history",
    "topicId": "hist_int",
    "difficulty": "medium",
    "question": "In Kenya's public finance architecture, what is the critical constitutional difference between the Controller of Budget and the Auditor-General?",
    "options": [
      "Both offices are held by the Cabinet Secretary for the National Treasury",
      "The Controller of Budget authorises withdrawals from public funds BEFORE money is spent after verifying lawfulness, whereas the Auditor-General audits accounts AFTER expenditure to verify value for money and legality",
      "The Controller of Budget collects income taxes for KRA, whereas the Auditor-General prints currency notes at CBK",
      "The Auditor-General approves county loans, whereas the Controller of Budget prosecutes felonies"
    ],
    "correctIndex": 1,
    "explanation": "Article 228 vests ex-ante withdrawal oversight in the Controller of Budget (no money leaves the Consolidated or County Revenue Fund without CoB approval), while Article 229 vests ex-post audit and reporting to Parliament/County Assemblies in the Auditor-General.",
    "concept": "Controller of Budget = gatekeeper BEFORE withdrawal; Auditor-General = independent watchdog auditing accounts within 6 months AFTER the financial year ends."
  },
  {
    "id": "kcse_hist_m9",
    "subject": "history",
    "topicId": "hist_int",
    "difficulty": "medium",
    "question": "Why did Britain apply the policy of Indirect Rule in Northern Nigeria (through Fulani Emirs) so successfully compared with Southern Nigeria (Igboland)?",
    "options": [
      "Southern Nigeria had a shortage of British missionaries and palm oil",
      "Northern Nigeria already possessed a centralized Sokoto Caliphate with Islamic courts, regular taxation, and Emirate administrative hierarchy, whereas Igboland was decentralized without Warrant-style chiefs",
      "Northern Nigerians spoke fluent French prior to British arrival",
      "Frederick Lugard abolished all traditional rulers in Northern Nigeria in 1900"
    ],
    "correctIndex": 1,
    "explanation": "Lord Lugard's Indirect Rule relied on pre-existing centralized authority and tax machinery (present in the Sokoto Emirate). Imposing artificial \"Warrant Chiefs\" on egalitarian, village-based Igbo society provoked fierce resistance such as the 1929 Aba Women's War.",
    "concept": "Indirect Rule succeeded only where centralized indigenous kingdoms (Northern Nigeria Emirs, Buganda Kabaka, Wanga Nabongo) already existed."
  },
  {
    "id": "kcse_hist_m10",
    "subject": "history",
    "topicId": "hist_int",
    "difficulty": "medium",
    "question": "Which organ of the United Nations bears primary responsibility for maintaining international peace and security, and which five nations hold permanent veto power?",
    "options": [
      "UN Security Council — China, France, Russia, United Kingdom, and United States",
      "UN Trusteeship Council — Russia, United States, Canada, China, and South Africa",
      "International Court of Justice — United Kingdom, France, Germany, Italy, and China",
      "UN General Assembly — Germany, Japan, India, Brazil, and United States"
    ],
    "correctIndex": 0,
    "explanation": "The 15-member UN Security Council has 10 non-permanent members elected for 2-year terms and 5 permanent members (P5: USA, UK, France, Russia, China), any one of whom can veto a substantive resolution.",
    "concept": "Only the P5 members of the UN Security Council (USA, UK, France, Russia, China) exercise veto power over substantive resolutions."
  },
  {
    "id": "kcse_hist_d1",
    "subject": "history",
    "topicId": "hist_col",
    "difficulty": "difficult",
    "question": "Compare the key ideological difference between the Kenya African National Union (KANU) and the Kenya African Democratic Union (KADU) at the Second Lancaster House Conference of 1962.",
    "options": [
      "Both parties demanded the abolition of the Senate and regional boundaries in 1962",
      "KANU demanded continued British Crown Colony status until 1980, whereas KADU demanded immediate Marxist nationalisation of all land",
      "KANU advocated a strong unitary central government, whereas KADU championed a federalist \"Majimbo\" constitution with regional assemblies to safeguard minority ethnic communities from domination",
      "KADU opposed multiparty elections, whereas KANU supported white settler minority rule"
    ],
    "correctIndex": 2,
    "explanation": "Formed in 1960 by leaders of smaller communities (Ronald Ngala, Masinde Muliro, Daniel arap Moi), KADU feared domination by larger communities in KANU and negotiated the 1963 independence Majimbo (regionalist + bicameral) framework at the 1962 Lancaster House Conference.",
    "concept": "Second Lancaster House Conference (1962) produced the compromise Majimbo independence constitution reconciling KANU unitarism and KADU regionalism."
  },
  {
    "id": "kcse_hist_d2",
    "subject": "history",
    "topicId": "hist_con",
    "difficulty": "difficult",
    "question": "Under Article 255 of the Constitution of Kenya (2010), an amendment touching on which of the following matters CANNOT be enacted by Parliament alone and MUST be approved in a national referendum?",
    "options": [
      "Supremacy of the Constitution, territory of Kenya, sovereignty of the people, Bill of Rights, term of office of the President, judicial independence, or objects/structure of devolution",
      "Adjusting Value Added Tax rates in the annual Finance Act",
      "Creating a new public university charter by Act of Parliament",
      "Changing the salaries of county clerks through the Salaries and Remuneration Commission"
    ],
    "correctIndex": 0,
    "explanation": "Article 255(1) entrenches ten core pillars (including presidential term limits, Bill of Rights, judicial independence, parliamentary/IEBC functions, and devolution); any Bill amending them requires a national referendum with >=20% registered voter turnout in at least half (24) of the counties and a simple majority of voters.",
    "concept": "Distinguish Parliamentary Initiative amendments (Art. 256, two-thirds majority of both Houses) from entrenched Art. 255 matters requiring a national referendum."
  },
  {
    "id": "kcse_hist_d3",
    "subject": "history",
    "topicId": "hist_gov",
    "difficulty": "difficult",
    "question": "Under Article 138 of the Constitution of Kenya, what dual threshold must a presidential candidate satisfy in the first round to be declared elected without a run-off?",
    "options": [
      "A simple plurality (highest number of votes) nationwide and 50% in at least 10 counties",
      "Two-thirds (66.7%) of the national vote regardless of county distribution",
      "More than half (50% + 1) of all valid votes cast in the election AND at least 25% of the votes cast in each of more than half of the counties (at least 24 out of 47 counties)",
      "Approval by a joint sitting of the National Assembly and Senate"
    ],
    "correctIndex": 2,
    "explanation": "To promote national unity beyond regional strongholds, Article 138(4) requires >50% of total votes cast nationally PLUS >=25% of votes cast in more than half of the 47 counties (>=24 counties); otherwise a run-off is held within 30 days between the top two candidates.",
    "concept": "Kenyan first-round presidential victory rule (Art. 138(4)): >50% national vote + >=25% in at least 24 counties."
  },
  {
    "id": "kcse_hist_d4",
    "subject": "history",
    "topicId": "hist_int",
    "difficulty": "difficult",
    "question": "Under Article 204 of the Constitution of Kenya, what is the specific constitutional purpose of the Equalisation Fund, and what minimum share of national revenue is paid into it?",
    "options": [
      "0.5% (one-half per cent) of all national revenue collected nationally each year, used exclusively to provide basic services (water, roads, health, electricity) to marginalised areas",
      "15% of all national revenue, distributed equally to all 47 County Assemblies for recurrent salaries",
      "50% of external sovereign borrowing, used to service Eurobonds",
      "2.5% of VAT collections, reserved for unexpected natural disasters under the Contingencies Fund"
    ],
    "correctIndex": 0,
    "explanation": "Do not confuse the 15% minimum Equitable Share for all 47 counties (Article 203(2)) with the 0.5% Equalisation Fund (Article 204), which specifically uplifts basic infrastructure in historically marginalised areas to the national average.",
    "concept": "Constitutional revenue floors: Equitable Share to all 47 counties >= 15% of audited national revenue (Art. 203); Equalisation Fund for marginalised areas = 0.5% (Art. 204)."
  },
  {
    "id": "kcse_hist_d5",
    "subject": "history",
    "topicId": "hist_col",
    "difficulty": "difficult",
    "question": "How did the Swynnerton Plan of 1954 fundamentally transform African land tenure and agriculture in colonial Kenya?",
    "options": [
      "It abolished individual land ownership in favour of communal Ujamaa villages across Central Kenya",
      "It confiscated all African reserves and converted them into European Crown Leases",
      "It introduced land consolidation, adjudication, individual freehold title deeds (usable as bank loan collateral), and lifted restrictions allowing Africans to grow lucrative cash crops like coffee, tea, and pyrethrum",
      "It transferred the White Highlands free of charge to squatters in 1954 without surveys"
    ],
    "correctIndex": 2,
    "explanation": "Proposed by Roger Swynnerton during the State of Emergency, the 1954 plan consolidated fragmented plots, issued individual title deeds to create a stable landed African middle class, and permitted Africans to cultivate coffee and tea with agricultural extension credit.",
    "concept": "The 1954 Swynnerton Plan ended communal tenure in consolidated reserves, introduced individual title deeds, and opened cash-crop farming to Africans."
  },
  {
    "id": "kcse_hist_d6",
    "subject": "history",
    "topicId": "hist_int",
    "difficulty": "difficult",
    "question": "Why did the French policy of Assimilation in Senegal largely fail outside the Four Communes (Saint-Louis, Gorée, Rufisque, and Dakar) and give way to the policy of Association?",
    "options": [
      "Deep cultural/religious resistance from Muslim and traditional communities (e.g. monogamy vs polygamy), high financial cost of equal schools/services, opposition by French merchants fearing competition, and fear of African deputies outnumbering French MPs in Paris",
      "Senegal lacked agricultural exports such as groundnuts",
      "Britain conquered Dakar in 1914 and imposed Indirect Rule",
      "Africans in the interior already held French citizenship prior to 1848"
    ],
    "correctIndex": 0,
    "explanation": "Full assimilation required Africans to abandon Islam/customary law (including polygamy), threatened French metropolitan parliamentary dominance if millions became citizens, and proved prohibitively expensive—forcing France to pivot to Association (respecting indigenous institutions under French supremacy).",
    "concept": "French Assimilation succeeded only in Senegal's Four Communes (Originaires); cultural resistance and metropolitan political/economic costs forced a shift to Association."
  },
  {
    "id": "kcse_hist_d7",
    "subject": "history",
    "topicId": "hist_gov",
    "difficulty": "difficult",
    "question": "Trace the constitutional stages through which a Bill in Kenya's National Assembly passes BEFORE Presidential Assent.",
    "options": [
      "Public Referendum -> First Reading -> Cabinet Approval -> Second Reading",
      "Committee Stage -> First Reading -> Presidential Assent -> Second Reading -> Gazette",
      "First Reading (formal introduction, no debate) -> Second Reading (debate on general principles & vote) -> Committee Stage (clause-by-clause scrutiny/amendments) -> Report Stage -> Third Reading (final vote, minimal/no substantive amendments)",
      "Third Reading -> First Reading -> Supreme Court Advisory -> Second Reading"
    ],
    "correctIndex": 2,
    "explanation": "In Kenyan parliamentary procedure: 1st Reading introduces title only and refers the Bill to the relevant Departmental Committee (with public participation); 2nd Reading debates policy/principles; Committee of the Whole House amends clause by clause; Report Stage reports amendments back to the House; 3rd Reading takes the final passage vote before transmission (to Senate if concerning counties, then to the President for Assent within 14 days).",
    "concept": "Substantive policy debate happens at Second Reading; detailed clause-by-clause amendments happen at Committee Stage."
  },
  {
    "id": "kcse_hist_d8",
    "subject": "history",
    "topicId": "hist_int",
    "difficulty": "difficult",
    "question": "Which structural weaknesses caused the League of Nations (1920 - 1946) to fail to prevent the outbreak of the Second World War?",
    "options": [
      "Absence of the USA (and at times USSR/Germany/Japan), lack of a standing peace-enforcement army, requirement for unanimous Council decisions, and Anglo-French appeasement during the Manchurian and Abyssinian crises",
      "Relocation of League headquarters from Geneva to Tokyo in 1931",
      "Refusal of Britain and France to join the League in 1920",
      "Excessive military aggression by the League's own standing nuclear army"
    ],
    "correctIndex": 0,
    "explanation": "Although Woodrow Wilson championed the League, the US Senate refused to ratify Versailles, depriving the League of economic/military clout. Unanimity rules paralyzed decisions, and without its own armed force it could not stop Japanese aggression in Manchuria (1931) or Italian invasion of Ethiopia/Abyssinia (1935).",
    "concept": "Key League of Nations flaws: US non-membership, no standing military force, unanimity paralysis, and Anglo-French appeasement."
  },
  {
    "id": "kcse_hist_d9",
    "subject": "history",
    "topicId": "hist_gov",
    "difficulty": "difficult",
    "question": "Under what constitutional grounds and procedure can a sitting Judge of a Superior Court in Kenya be removed from office (Article 168)?",
    "options": [
      "By a simple majority vote of censure passed by any County Assembly",
      "By direct summary dismissal letter signed by the Attorney-General",
      "Only for inability to perform functions (mental/physical incapacity), breach of code of conduct, bankruptcy, incompetence, or gross misconduct—initiated by the Judicial Service Commission (JSC) and investigated by an independent Tribunal appointed by the President",
      "By order of the Inspector-General of Police"
    ],
    "correctIndex": 2,
    "explanation": "To safeguard judicial independence (security of tenure), neither the President nor Parliament can summarily fire a judge. The JSC petitions the President (either on its own motion or on public petition), who suspends the judge and MUST appoint a constitutionally prescribed Tribunal whose binding recommendation governs removal (subject to Supreme Court appeal within 10 days).",
    "concept": "Security of judicial tenure (Art. 168) insulates judges from political interference by requiring JSC vetting + an independent Tribunal for removal."
  },
  {
    "id": "kcse_hist_d10",
    "subject": "history",
    "topicId": "hist_int",
    "difficulty": "difficult",
    "question": "What were the three post-independence Sessional Papers and philosophies that guided Kenya's national development during the Jomo Kenyatta and Daniel arap Moi eras?",
    "options": [
      "Marxist-Leninist Collectivisation, Apartheid Separate Development, and Assimilation",
      "Arusha Declaration of Ujamaa (1967), Common Man's Charter, and Mulungushi Reforms",
      "Structural Adjustment Abolition Act of 1963 and Gold Standard Charter",
      "African Socialism and its Application to Planning in Kenya (Sessional Paper No. 10 of 1965), Harambee motto, and Nyayo philosophy (Peace, Love, and Unity)"
    ],
    "correctIndex": 3,
    "explanation": "Authored largely under Tom Mboya's Ministry of Economic Planning, Sessional Paper No. 10 of 1965 established Kenya's mixed-economy African Socialism framework alongside Harambee self-help spirit, followed in 1978 by Nyayoism (Peace, Love, and Unity). (Ujamaa belonged to Tanzania and Common Man's Charter to Uganda.)",
    "concept": "Kenya's three national philosophies in KCSE History: African Socialism (Sessional Paper No. 10 of 1965), Harambee, and Nyayoism."
  },
  {
    "id": "kcse_geo_e1",
    "subject": "geography",
    "topicId": "geo_map",
    "difficulty": "easy",
    "question": "On a standard KNEC 1:50,000 topographical map, a straight tarmac road measures 8.4 cm on your ruler. What is its actual ground distance in kilometres?",
    "options": [
      "8.4 km",
      "16.8 km",
      "4.2 km",
      "0.42 km"
    ],
    "correctIndex": 2,
    "explanation": "At 1:50,000 scale, 1 cm on the map represents 50,000 cm = 500 m = 0.5 km on the ground. Therefore 8.4 cm x 0.5 km/cm = 4.2 km.",
    "concept": "On 1:50,000 maps, divide centimetres by 2 (multiply by 0.5) to get kilometres directly."
  },
  {
    "id": "kcse_geo_e2",
    "subject": "geography",
    "topicId": "geo_int",
    "difficulty": "easy",
    "question": "Which igneous intrusive feature is formed when magma solidifies vertically or steeply cutting ACROSS horizontal bedding planes of sedimentary country rock?",
    "options": [
      "Dyke",
      "Laccolith",
      "Lopolith",
      "Sill"
    ],
    "correctIndex": 0,
    "explanation": "A dyke is discordant—it cuts vertically or obliquely across existing rock strata. A sill is concordant—it intrudes horizontally parallel between bedding planes.",
    "concept": "Discordant sheet intrusion across strata = Dyke; Concordant sheet intrusion parallel to strata = Sill."
  },
  {
    "id": "kcse_geo_e3",
    "subject": "geography",
    "topicId": "geo_int",
    "difficulty": "easy",
    "question": "What is the difference between the \"focus\" (hypocentre) and the \"epicentre\" of an earthquake?",
    "options": [
      "They refer to the exact same underground point",
      "The epicentre is deep inside the Earth's core, while the focus is on the ocean surface",
      "The focus is the point inside the Earth's crust/mantle where seismic waves originate, while the epicentre is the point on the Earth's surface vertically above the focus",
      "The focus measures earthquake damage (Mercalli), while the epicentre measures magnitude (Richter)"
    ],
    "correctIndex": 2,
    "explanation": "Crustal rock rupture releases energy at the underground seismic focus; seismic waves reach the surface first at the epicentre directly overhead.",
    "concept": "Seismic origin underground = Focus; vertically above it on the surface = Epicentre."
  },
  {
    "id": "kcse_geo_e4",
    "subject": "geography",
    "topicId": "geo_ext",
    "difficulty": "easy",
    "question": "Into which rock class are marble, quartzite, and slate classified, and from which parent rocks do they form?",
    "options": [
      "Metamorphic rocks — formed from limestone (marble), sandstone (quartzite), and clay/shale (slate)",
      "Plutonic igneous rocks — formed from granite, gabbro, and peridotite",
      "Volcanic extrusive rocks — formed from basalt, pumice, and obsidian",
      "Organically formed sedimentary rocks — formed from coral polyps and peat"
    ],
    "correctIndex": 0,
    "explanation": "Intense heat and/or pressure (thermal/regional metamorphism) recrystallises limestone into marble, sandstone into quartzite, and clay/shale into slate.",
    "concept": "Classic KNEC metamorphic pairs: Limestone -> Marble; Sandstone -> Quartzite; Clay/Shale -> Slate; Granite -> Gneiss."
  },
  {
    "id": "kcse_geo_e5",
    "subject": "geography",
    "topicId": "geo_ext",
    "difficulty": "easy",
    "question": "In which stage of a river's profile are ox-bow lakes, raised natural levees, braided channels, and deferred tributaries predominantly found?",
    "options": [
      "Source catchment cliff",
      "Youthful (upper / torrent) stage",
      "Old (lower / senile) stage",
      "Subterranean sinkhole stage"
    ],
    "correctIndex": 2,
    "explanation": "In the gently sloping lower (old) stage, river velocity drops and lateral erosion/deposition dominate across a wide floodplain, forming meanders that cut off into ox-bow lakes alongside levees and deltas.",
    "concept": "Youthful river = vertical erosion (V-shaped valleys, gorges, waterfalls, potholes); Old river = deposition (floodplains, levees, ox-bow lakes, deltas)."
  },
  {
    "id": "kcse_geo_e6",
    "subject": "geography",
    "topicId": "geo_clim",
    "difficulty": "easy",
    "question": "Why is a Stevenson screen at a weather station painted white and built with louvred wooden sides?",
    "options": [
      "White reflects direct solar radiation while louvres allow free air circulation without letting direct sunlight or rain hit the thermometers",
      "To keep insects warm around the wet-bulb thermometer",
      "To measure wind speed and rainfall directly inside the wooden box",
      "White absorbs maximum infrared heat at night while louvres trap moist air inside"
    ],
    "correctIndex": 0,
    "explanation": "Weather stations measure true shade air temperature ~1.2 m above ground: white paint reflects solar heat, double insulated roof blocks overhead sun, and slated louvres ensure free ambient airflow.",
    "concept": "A Stevenson screen houses Four instruments: Maximum thermometer, Minimum thermometer (or Six's thermometer), Wet-bulb and Dry-bulb hygrometer."
  },
  {
    "id": "kcse_geo_e7",
    "subject": "geography",
    "topicId": "geo_clim",
    "difficulty": "easy",
    "question": "What type of rainfall commonly falls on the windward eastern slopes of Mount Kenya when moist South-East Trade Winds are forced to rise, cool adiabatically, and condense?",
    "options": [
      "Convectional rainfall",
      "Frontal (Cyclonic) rainfall",
      "Relief (Orographic) rainfall",
      "Advection fog"
    ],
    "correctIndex": 2,
    "explanation": "Moist onshore winds encounter a highland barrier (Mt Kenya/Aberdares), ascend the windward slope, cool, and drop heavy relief (orographic) rain, leaving the leeward side (e.g., Nanyuki/Laikipia) in a drier rain shadow.",
    "concept": "Moist air forced over mountains gives Relief rainfall on windward slopes and a dry Rain Shadow (Fohn effect) on leeward slopes."
  },
  {
    "id": "kcse_geo_e8",
    "subject": "geography",
    "topicId": "geo_econ",
    "difficulty": "easy",
    "question": "Which mineral is mined at Lake Magadi in Kajiado County, and what extraction method is used?",
    "options": [
      "Trona (processed into soda ash) — extracted by dredging",
      "Titanium — extracted by underground adit mining",
      "Diatomite — extracted by oil-rig drilling",
      "Fluorspar — extracted by deep shaft mining"
    ],
    "correctIndex": 0,
    "explanation": "At Lake Magadi, a floating mechanical dredger scoops crystalline trona (sodium sesquicarbonate) from the lake bed, crushes it into slurry, pumps it to the factory, washes, and calcines it in kilns into soda ash (Na2CO3).",
    "concept": "Kenyan minerals & sites: Trona = Lake Magadi (dredging); Diatomite = Kariandusi; Titanium = Kwale; Limestone = Bamburi/Athi River."
  },
  {
    "id": "kcse_geo_e9",
    "subject": "geography",
    "topicId": "geo_econ",
    "difficulty": "easy",
    "question": "Along which Kenyan river is the Seven Forks hydroelectric power (HEP) scheme (Masinga, Kamburu, Gitaru, Kindaruma, Kiambere) constructed?",
    "options": [
      "River Sondu-Miriu",
      "River Athi-Galana",
      "River Tana",
      "River Nzoia"
    ],
    "correctIndex": 2,
    "explanation": "Kenya's flagship Seven Forks HEP cascade harnesses the steep basement-complex falls and regulated reservoir storage (headed by Masinga Dam) along River Tana.",
    "concept": "Masinga Dam acts as the upper storage/silt-trap reservoir regulating water flow across the Seven Forks HEP stations on River Tana."
  },
  {
    "id": "kcse_geo_e10",
    "subject": "geography",
    "topicId": "geo_econ",
    "difficulty": "easy",
    "question": "Which two main rice irrigation blocks make up the Mwea-Tebere Irrigation Scheme in Kirinyaga County, fed by Rivers Thiba and Nyamindi?",
    "options": [
      "Perkerra and Galole sections",
      "Ahero and Bunyala sections",
      "Turkwel and Kano sections",
      "Mwea and Tebere sections (on black cotton clay soils that retain standing water)"
    ],
    "correctIndex": 3,
    "explanation": "Mwea-Tebere in Kirinyaga County uses gravity-fed canal water from Rivers Thiba and Nyamindi on gently sloping impervious black cotton soils ideal for flooded paddy rice (Basmati/Pishori).",
    "concept": "Physical factors favouring Mwea-Tebere: perennial Rivers Thiba & Nyamindi, impervious black cotton clay, gentle slope allowing gravity flow, and warm sunny ripening weather."
  },
  {
    "id": "kcse_geo_m1",
    "subject": "geography",
    "topicId": "geo_map",
    "difficulty": "medium",
    "question": "On a 1:50,000 topographical map, point P lies on the 1,640 m contour and point Q lies on the 1,890 m contour. The map distance between P and Q is 10.0 cm. Calculate the gradient of the slope PQ.",
    "options": [
      "1 : 20 (or 1 in 20)",
      "1 : 200",
      "1 : 40",
      "1 : 50"
    ],
    "correctIndex": 0,
    "explanation": "Vertical Interval (VI) = 1,890 - 1,640 = 250 m. Horizontal Equivalent (HE) = 10.0 cm x 500 m/cm = 5,000 m. Gradient = VI / HE = 250 m / 5,000 m = 1 / 20 (1 in 20).",
    "concept": "Gradient = Vertical Interval (m) / Horizontal Equivalent (m), always simplified to unit numerator 1 : X using identical units."
  },
  {
    "id": "kcse_geo_m2",
    "subject": "geography",
    "topicId": "geo_map",
    "difficulty": "medium",
    "question": "In January 2020, the magnetic declination (variation) shown on a map sheet was 2 degrees 30' West, decreasing (moving East) at an annual rate of 5' per year. What was the magnetic declination in January 2026?",
    "options": [
      "2 degrees 25' West",
      "1 degree 30' West",
      "2 degrees 00' West",
      "3 degrees 00' West"
    ],
    "correctIndex": 2,
    "explanation": "Elapsed time = 2026 - 2020 = 6 years. Total change = 6 x 5' = 30' Eastward (decreasing West declination). Subtracting 30' from 2 degrees 30' W gives 2 degrees 00' West.",
    "concept": "Remember 1 degree = 60 minutes (60'); an eastward shift reduces westerly magnetic declination and increases easterly declination."
  },
  {
    "id": "kcse_geo_m3",
    "subject": "geography",
    "topicId": "geo_int",
    "difficulty": "medium",
    "question": "Explain how the East African Rift Valley was formed by tensional forces.",
    "options": [
      "Crustal layers were pulled apart by tensional forces, developing two parallel normal faults; the middle block subsided between the faults under gravity while side blocks remained standing as fault scarps (escarpments)",
      "Underground limestone caves collapsed along River Nile",
      "Crustal layers were squeezed together, thrusting side blocks up over reverse faults while overhanging edges eroded",
      "Glacial ice sheets gouged a continuous U-shaped trough from Red Sea to Mozambique"
    ],
    "correctIndex": 0,
    "explanation": "In the tensional hypothesis (Gregory), horizontal pull creates parallel normal faults, allowing the central graben block to sink downward relative to the flanking horst/escarpment blocks. (Overthrust reverse faults belong to the compressional theory!)",
    "concept": "Distinguish Tensional Rift theory (normal faults, central block subsides) from Compressional Rift theory (reverse faults, side blocks override central block)."
  },
  {
    "id": "kcse_geo_m4",
    "subject": "geography",
    "topicId": "geo_ext",
    "difficulty": "medium",
    "question": "When three or more cirques (corries / tarns) cut backward headward into different sides of a glaciated mountain summit (such as Mt Kenya's Batian/Nelion), what sharp, steep-sided peak is left at the centre?",
    "options": [
      "Drumlin",
      "Crag and tail",
      "Pyramidal peak (horn)",
      "Esker"
    ],
    "correctIndex": 2,
    "explanation": "Frost shattering and plucking enlarge adjacent armchair-shaped cirques; two meeting cirques form a knife-edged ridge (arete), and three or more converging cirques carve a sharp pyramidal peak. Drumlins and eskers are lowland glacial depositional features.",
    "concept": "Highland glacial erosion features: Cirque/Corrie -> Arete (2 cirques) -> Pyramidal Peak (3+ cirques), U-shaped valley, Hanging valley."
  },
  {
    "id": "kcse_geo_m5",
    "subject": "geography",
    "topicId": "geo_ext",
    "difficulty": "medium",
    "question": "Which chemical weathering process specifically dissolves jointed limestone (CaCO3) rock in karst regions like Nyari/Shimoni when rainwater absorbs atmospheric and soil carbon(IV) oxide?",
    "options": [
      "Carbonation",
      "Oxidation",
      "Exfoliation (onion-peeling)",
      "Frost wedging"
    ],
    "correctIndex": 0,
    "explanation": "Rainwater dissolves CO2 to form weak carbonic acid (H2CO3), which reacts with insoluble calcium carbonate (limestone) to form soluble calcium hydrogen carbonate Ca(HCO3)2, enlarging joints into grikes, swallow holes, and caves.",
    "concept": "Carbonation (H2O + CO2 + CaCO3 -> Ca(HCO3)2) is the dominant chemical weathering process shaping surface and underground karst scenery."
  },
  {
    "id": "kcse_geo_m6",
    "subject": "geography",
    "topicId": "geo_clim",
    "difficulty": "medium",
    "question": "Why does Temperature Inversion sometimes occur in highland valleys (such as Limuru/Kericho) on calm, cloudless nights, posing a frost hazard to tea bushes?",
    "options": [
      "Thick cloud cover reflects all terrestrial heat out into space",
      "Anabatic warm winds blow downward from snowfields during midday",
      "Rapid terrestrial radiation cools upper slopes; dense cold air drains downslope by gravity (katabatic flow) and settles on the valley floor beneath warmer displaced air",
      "Solar radiation heats valley floors faster at midnight than mountain ridges"
    ],
    "correctIndex": 2,
    "explanation": "Normally temperature drops with altitude (normal lapse rate). On calm, clear nights, ground loses heat rapidly by long-wave radiation; heavy cold katabatic air flows down into valley bottoms under warmer air, causing temperature to increase temporarily with height (inversion) and triggering frost.",
    "concept": "Katabatic wind = cold dense night air draining downslope into valleys; Anabatic wind = warm daytime air rising upslope."
  },
  {
    "id": "kcse_geo_m7",
    "subject": "geography",
    "topicId": "geo_clim",
    "difficulty": "medium",
    "question": "Why are equatorial rainforest soils (latosols/ferralsols) often surprisingly low in soluble mineral nutrients once natural forest cover is cleared?",
    "options": [
      "Heavy year-round rainfall causes intense leaching of soluble bases downward, while high temperatures drive rapid bacterial decomposition of humus that was only sustained by continuous leaf-litter recycling",
      "Equatorial soils remain permanently frozen in permafrost throughout the year",
      "Trees in equatorial rainforests never shed leaves or organic litter",
      "Capillary action draws excess desert salt crusts to the surface"
    ],
    "correctIndex": 0,
    "explanation": "Lush equatorial vegetation survives on a tight, rapid nutrient cycle in the thin top humus layer. Once cleared, torrential rains rapidly leach soluble nitrates/potassium/calcium below root reach and oxidise humus, leaving infertile iron/aluminium-rich lateritic soils.",
    "concept": "High rainfall + high heat = rapid bacterial humification + severe downward leaching (ferrallitisation); clearing forest breaks the nutrient cycle."
  },
  {
    "id": "kcse_geo_m8",
    "subject": "geography",
    "topicId": "geo_econ",
    "difficulty": "medium",
    "question": "Why is marine (Indian Ocean) fishing in Kenya much less productive in total tonnage than inland freshwater fishing (especially Lake Victoria), despite Kenya's long coastline?",
    "options": [
      "The Indian Ocean along Mombasa and Lamu freezes over for four months every winter",
      "Kenya has no coastal ports or tourism market for marine fish",
      "Kenya has a narrow continental shelf, warm tropical waters with less plankton upwelling than cold-current coasts, coral reefs that snag trawl nets, and largely artisanal craft unable to exploit the deep Exclusive Economic Zone",
      "Lake Victoria is ten times deeper and saltier than the Indian Ocean"
    ],
    "correctIndex": 2,
    "explanation": "Rich marine fisheries require wide shallow continental shelves and cold/warm ocean current mixing (like Japan's Kuroshio-Oyashio or Namibia's Benguela). East Africa has a narrow continental shelf, coral reef obstacles, and capital constraints for deep-sea fleets.",
    "concept": "Major world marine fishing grounds thrive on wide continental shelves (<200 m deep), indented coastlines, and plankton-rich cold/warm current convergence."
  },
  {
    "id": "kcse_geo_m9",
    "subject": "geography",
    "topicId": "geo_econ",
    "difficulty": "medium",
    "question": "Compare softwood forestry in Kenya (e.g., Londiani, Timboroa, Kaptagat) with softwood forestry in British Columbia / Eastern Canada regarding tree maturity period.",
    "options": [
      "Exotic softwoods in Kenya (cypress, pine) mature rapidly in 15 - 30 years due to warm tropical highland temperatures and bimodal rain, whereas Canadian conifers take 60 - 100 years due to long freezing winters",
      "Kenya harvests only natural boreal spruce during winter snowmelt",
      "Canadian trees mature in 5 years because snow fertilises pine needles, whereas Kenyan trees take 120 years",
      "Both countries have identical 50-year tree maturity periods"
    ],
    "correctIndex": 0,
    "explanation": "Warm year-round equatorial highland sunshine and reliable rainfall give Kenya rapid tree growth (15-30 years for exotic pines/cypress), whereas severe sub-zero Canadian winters shorten the growing season, stretching maturity to 60-100 years (though winter snow aids log skidding in Canada).",
    "concept": "Kenya vs Canada forestry: Kenya has exotic plantations + fast growth (15-30 yrs) + road transport; Canada has vast natural coniferous forests + slow growth (60-100 yrs) + river/snow transport & massive pulp/newsprint exports."
  },
  {
    "id": "kcse_geo_m10",
    "subject": "geography",
    "topicId": "geo_econ",
    "difficulty": "medium",
    "question": "Why has Kenya prioritized expanding Olkaria Geothermal Power in Nakuru County alongside River Tana Hydroelectric Power?",
    "options": [
      "Geothermal power stations can be built anywhere in Kenya including flat sedimentary plains without volcanic heat",
      "Geothermal steam from Rift Valley superheated aquifers generates reliable 24/7 baseload electricity unaffected by seasonal droughts or reservoir siltation that reduce HEP output",
      "Geothermal wells require zero initial drilling capital or turbine maintenance",
      "Hydroelectric dams emit more sulphur gases than coal plants"
    ],
    "correctIndex": 1,
    "explanation": "HEP output drops sharply during prolonged East African droughts and suffers siltation from upstream soil erosion; Olkaria taps endogenous Rift Valley magmatic heat for clean, weather-independent baseload power.",
    "concept": "Geothermal energy is renewable and drought-resilient, though geographically restricted to tectonically active volcanic zones (Olkaria, Menengai, Eburru) with high initial drilling costs."
  },
  {
    "id": "kcse_geo_d1",
    "subject": "geography",
    "topicId": "geo_map",
    "difficulty": "difficult",
    "question": "On a 1:50,000 map, a rectangular coffee estate measures 6.0 cm by 4.0 cm. If the map is photographically reduced so its linear scale becomes 1:100,000, what will be the new dimensions of the estate on the reduced map, and what remains its true ground area?",
    "options": [
      "New map dimensions: 3.0 cm by 2.0 cm; True ground area shrinks to 1.5 km^2",
      "New map dimensions: 6.0 cm by 4.0 cm; True ground area becomes 24.0 km^2",
      "New map dimensions: 12.0 cm by 8.0 cm; True ground area doubles to 12.0 km^2",
      "New map dimensions: 3.0 cm by 2.0 cm; True ground area remains unchanged at 6.0 km^2"
    ],
    "correctIndex": 3,
    "explanation": "Changing scale from 1:50,000 to 1:100,000 is a linear reduction by factor 1/2 (map area shrinks to 1/4: from 24 cm^2 to 6 cm^2, i.e., 3.0 cm by 2.0 cm). However, real ground area NEVER changes when a map is redrawn: (6.0 x 0.5 km) x (4.0 x 0.5 km) = 3.0 km x 2.0 km = 6.0 km^2 (check on reduced map: 3.0 km x 2.0 km = 6.0 km^2!).",
    "concept": "Reducing a map from 1:50,000 to 1:100,000 halves linear map dimensions and quarters map paper area, while actual ground area stays constant."
  },
  {
    "id": "kcse_geo_d2",
    "subject": "geography",
    "topicId": "geo_map",
    "difficulty": "difficult",
    "question": "When drawing a cross-section (profile) from a 1:50,000 map using a vertical scale of 1 cm represents 50 m, calculate the Vertical Exaggeration (VE) of the cross-section.",
    "options": [
      "100 times (x100)",
      "5 times (x5)",
      "1,000 times (x1,000)",
      "10 times (x10)"
    ],
    "correctIndex": 3,
    "explanation": "Convert Vertical Scale (VS) to a representative fraction in the same units: 50 m = 5,000 cm, so VS = 1 / 5,000. Horizontal Scale (HS) = 1 / 50,000. Vertical Exaggeration VE = VS / HS = (1 / 5,000) / (1 / 50,000) = 50,000 / 5,000 = 10 times.",
    "concept": "Vertical Exaggeration = Vertical Scale / Horizontal Scale (express both as 1:X in cm first; 1 m = 100 cm)."
  },
  {
    "id": "kcse_geo_d3",
    "subject": "geography",
    "topicId": "geo_int",
    "difficulty": "difficult",
    "question": "When it is 12:00 noon Local Mean Time at Nairobi (37 degrees E), what is the Local Mean Time at Town W located at longitude 23 degrees W?",
    "options": [
      "9:28 a.m. the same day",
      "10:36 a.m. the same day",
      "4:00 p.m. the same day",
      "8:00 a.m. the same day"
    ],
    "correctIndex": 3,
    "explanation": "Since Nairobi is East of Greenwich (37 E) and W is West of Greenwich (23 W), add longitudes: 37 + 23 = 60 degrees difference. Earth rotates 15 degrees per hour (4 minutes per degree), so time difference = 60 / 15 = 4 hours. Because W lies WEST of Nairobi, local time at W is behind (subtract 4 hours): 12:00 noon - 4 hours = 8:00 a.m.",
    "concept": "Add longitudes across the Prime Meridian (E + W), convert at 15 degrees = 1 hour (1 degree = 4 min), and subtract going West (\"East Gain Add, West Lose Subtract\")."
  },
  {
    "id": "kcse_geo_d4",
    "subject": "geography",
    "topicId": "geo_ext",
    "difficulty": "difficult",
    "question": "Which exact physical conditions are required for a large arcuate or bird's-foot river delta (such as the Tana, Omo, or Rufiji/Nile delta) to build up at a river's mouth?",
    "options": [
      "Rapid vertical downcutting at the river mouth with zero suspended load",
      "Steep continental cliff drop-off, powerful destructive tsunami waves, and series of deep upstream lakes",
      "Submergence of a glaciated U-shaped valley under rising sea levels",
      "Large load of river sediment, absence of large lakes along the river course to trap silt, slow velocity at a shallow sheltered sea coast, weak tidal/longshore currents, and salty seawater encouraging flocculation of fine clay"
    ],
    "correctIndex": 3,
    "explanation": "Delta growth requires deposition rate at the mouth to exceed wave removal: abundant sediment load, no upstream sediment-trapping lakes, shallow coastal gradient, sheltered/tideless sea, and saline coagulation (flocculation) of colloidal clay particles.",
    "concept": "Saline seawater causes fine clay particles to clump together (flocculate) and settle at river mouths when wave/longshore drift is weak."
  },
  {
    "id": "kcse_geo_d5",
    "subject": "geography",
    "topicId": "geo_int",
    "difficulty": "difficult",
    "question": "Why do seismic S-waves (Secondary / Shear waves) disappear completely at the Gutenberg discontinuity (~2,900 km depth) whereas P-waves continue through, refracting sharply?",
    "options": [
      "S-waves travel faster than P-waves and escape into the atmosphere",
      "S-waves travel exclusively along the Earth's surface like Love waves",
      "The outer core is made of solid diamond that reflects longitudinal P-waves only",
      "S-waves are transverse shear waves that can propagate ONLY through rigid solids, proving that the Earth's outer core is molten liquid"
    ],
    "correctIndex": 3,
    "explanation": "Longitudinal P-waves (push-pull compressional) travel through solids, liquids, and gases; transverse S-waves require shear rigidity and cannot pass through liquids. Their sudden disappearance at 2,900 km creates the S-wave shadow zone and proves the outer core is liquid iron-nickel.",
    "concept": "P-waves = fastest, longitudinal, pass through solids & liquids; S-waves = slower, transverse, blocked by liquid outer core."
  },
  {
    "id": "kcse_geo_d6",
    "subject": "geography",
    "topicId": "geo_clim",
    "difficulty": "difficult",
    "question": "Trace the correct sequence of natural mountain vegetation zones ascending the wetter windward south-eastern slopes of Mount Kenya from ~1,800 m up to the summit (~5,199 m).",
    "options": [
      "Bamboo forest -> Savannah grassland -> Montane rainforest -> Heath and moorland",
      "Heath and moorland -> Bamboo forest -> Montane rainforest -> Mangrove swamp -> Snow",
      "Equatorial desert -> Acacia scrub -> Coconut palms -> Coniferous taiga",
      "Savannah/cultivation foothills -> Montane rainforest -> Bamboo forest -> Heath and moorland (giant lobelia/senecio) -> Bare rock and snow/ice"
    ],
    "correctIndex": 3,
    "explanation": "On windward East African mountains, rising rainfall up to ~2,500-3,000 m supports dense montane forest followed by pure bamboo stands; above ~3,200 m, falling temperatures and reduced moisture produce Afro-alpine heath & moorland (tussock grass, giant heather, groundsel, lobelia) and finally bare rock/glaciers above ~4,500 m.",
    "concept": "Windward Mt Kenya altitudinal zonation: Savanna -> Rainforest -> Bamboo -> Heath & Moorland -> Bare Rock / Ice."
  },
  {
    "id": "kcse_geo_d7",
    "subject": "geography",
    "topicId": "geo_econ",
    "difficulty": "difficult",
    "question": "Compare land reclamation in the Netherlands (Zuiderzee / Delta Works polders) with land reclamation in Kenya (Mwea / Perkerra / Yala Swamp).",
    "options": [
      "Both countries reclaim land exclusively from open-cast gold mines",
      "Polder soils in the Netherlands are immediately planted with coffee the day seawater is pumped out",
      "Kenya builds sea dykes across the Indian Ocean in Mombasa to grow tulips, whereas the Netherlands irrigates hot deserts",
      "The Netherlands reclaims submerged coastal sea floors using protective dykes, ring canals, and pumping stations plus desalination with reeds/lime, whereas Kenya mainly reclaims arid lands via river irrigation and inland swamps via drainage/tsetse control"
    ],
    "correctIndex": 3,
    "explanation": "Dutch polders are reclaimed from the North Sea below sea level by enclosing lagoons with massive dykes, pumping seawater into ring canals, planting reeds to transpire water/desalinate soil before rye/grass/horticulture/dairy; Kenya reclaims ASAL plains (Perkerra, Bura) by irrigation and swamps (Yala, Bunyala) by drainage.",
    "concept": "Key polder steps in the Netherlands: Protective dyke construction -> Ring canal digging -> Pumping out water -> Reed planting & rain flushing to remove salinity -> Crop/dairy farming."
  },
  {
    "id": "kcse_geo_d8",
    "subject": "geography",
    "topicId": "geo_econ",
    "difficulty": "difficult",
    "question": "In demographic transition comparisons between Kenya and Sweden, what does a population pyramid with a very broad base that tapers rapidly upward indicate, and what economic pressure does it create?",
    "options": [
      "Sub-replacement fertility, shrinking labour force, and high old-age pension/geriatric care burden (typical of Sweden)",
      "Zero natural population increase and net emigration of children",
      "Equal numbers of 80-year-olds and newborn infants",
      "High birth rate, large youth cohort (<15 years), and high youth dependency ratio requiring heavy public investment in schools, paediatric healthcare, and future job creation (typical of developing economies like Kenya)"
    ],
    "correctIndex": 3,
    "explanation": "A wide-base pyramid reflects high fertility and rapid youth growth (high youth dependency), whereas Sweden's beehive/columnar pyramid with a narrow base and wide top reflects low birth rates, long life expectancy, an ageing workforce, and high old-age dependency.",
    "concept": "Broad-base pyramid = high birth rate + youth dependency (Kenya); Narrow-base beehive pyramid = low birth rate + ageing population (Sweden/Japan)."
  },
  {
    "id": "kcse_geo_d9",
    "subject": "geography",
    "topicId": "geo_map",
    "difficulty": "difficult",
    "question": "In geographical statistics, what is the prime advantage of using a Divided Rectangle or Compound (Cumulative) Bar Graph over Simple Bar Graphs when representing Kenya's mineral export values over 5 years?",
    "options": [
      "It requires no vertical scale or key",
      "Individual middle segments can be read directly from the zero baseline without subtraction",
      "It eliminates the need to calculate cumulative subtotals before plotting",
      "It displays BOTH the grand total export value for each year AND the proportional breakdown of individual constituent minerals simultaneously on one visual chart"
    ],
    "correctIndex": 3,
    "explanation": "A compound (cumulative) bar graph stacks constituent components cleanly so top bar heights compare annual grand totals while shaded subdivisions show component shares (though reading middle components requires subtracting lower cumulative boundaries).",
    "concept": "Compound bar graphs show both grand totals and constituent breakdowns, whereas simple bar graphs show only a single variable per bar."
  },
  {
    "id": "kcse_geo_d10",
    "subject": "geography",
    "topicId": "geo_econ",
    "difficulty": "difficult",
    "question": "Why did motor-vehicle and iron-and-steel manufacturing historically cluster inside the Ruhr Industrial Region of Germany (Dortmund, Essen, Duisburg)?",
    "options": [
      "Vast tropical bauxite and crude oil fields discovered beneath Essen in 1990",
      "Total absence of rail or river transport forcing factories to stay small",
      "Abundant local coking coal in the Ruhr valley, navigable Rhine-Ruhr-Lippe waterways & Dortmund-Ems canal for importing iron ore, dense skilled labour, large affluent European market, and substantial capital",
      "Cheap hydroelectric power from Mount Kilimanjaro"
    ],
    "correctIndex": 2,
    "explanation": "Exposed and concealed Ruhr coalfields supplied coking coal for blast furnaces, while the Rhine river and canal network cheaply brought Swedish/French/overseas iron ore to Ruhr steelworks serving dense Central European markets.",
    "concept": "Ruhr industrial location factors: local Ruhr coking coal, Rhine/canal water transport, iron ore access, skilled workforce, capital, and central European market."
  },
  {
    "id": "kcse_bus_e1",
    "subject": "business",
    "topicId": "bus_mkt",
    "difficulty": "easy",
    "question": "A maize miller in Eldoret grinds raw maize grain into packaged sifted flour. Which type of economic utility is primarily created by changing the physical state of the maize?",
    "options": [
      "Place utility",
      "Form utility",
      "Possession utility",
      "Time utility"
    ],
    "correctIndex": 1,
    "explanation": "Manufacturing/processing raw materials into a more usable physical state creates form utility. Transport creates place utility, warehousing creates time utility, and trade/exchange creates possession utility.",
    "concept": "Four main utilities: Form (manufacturing), Place (transport), Time (storage/warehousing), Possession (trade/ownership transfer)."
  },
  {
    "id": "kcse_bus_e2",
    "subject": "business",
    "topicId": "bus_mkt",
    "difficulty": "easy",
    "question": "Which factor of production earns \"profit\" as its factor reward and bears the ultimate risk of business uncertainty?",
    "options": [
      "Labour",
      "Entrepreneurship",
      "Capital",
      "Land"
    ],
    "correctIndex": 1,
    "explanation": "Factors of production and their rewards: Land -> Rent/rates/royalties; Labour -> Wages/salaries; Capital -> Interest; Entrepreneurship -> Profit.",
    "concept": "Match each factor of production strictly to its economic reward: Land (rent), Labour (wages), Capital (interest), Entrepreneurship (profit)."
  },
  {
    "id": "kcse_bus_e3",
    "subject": "business",
    "topicId": "bus_trd",
    "difficulty": "easy",
    "question": "In home trade, which commercial document is sent by the SELLER to the BUYER to correct an UNDERCHARGE on a previously issued invoice?",
    "options": [
      "Pro-forma Invoice",
      "Debit Note",
      "Advice Note",
      "Credit Note"
    ],
    "correctIndex": 1,
    "explanation": "A Debit Note increases the buyer's indebtedness when the original invoice undercharged (e.g., arithmetic error or omitted items). A Credit Note (often printed in red) reduces the buyer's debt when overcharged or when damaged goods/empty crates are returned.",
    "concept": "Seller -> Buyer corrections: Debit Note corrects an undercharge (adds to bill); Credit Note corrects an overcharge or goods returned (reduces bill)."
  },
  {
    "id": "kcse_bus_e4",
    "subject": "business",
    "topicId": "bus_trd",
    "difficulty": "easy",
    "question": "Which principle of insurance prohibits an insured motorist from insuring their neighbour's car because they would suffer no direct financial loss if the neighbour's car were damaged?",
    "options": [
      "Subrogation",
      "Insurable interest",
      "Contribution",
      "Proximate cause"
    ],
    "correctIndex": 1,
    "explanation": "Insurable interest requires the insured to own or have a legal financial stake in the subject matter such that they personally suffer financial loss if the insured risk occurs (preventing wagering/moral hazard).",
    "concept": "Without insurable interest (direct financial loss upon destruction of the property/life), an insurance contract is legally void."
  },
  {
    "id": "kcse_bus_e5",
    "subject": "business",
    "topicId": "bus_acc",
    "difficulty": "easy",
    "question": "At 31 December 2025, a trader's business had total Assets of KES 920,000 and total Liabilities of KES 275,000. Calculate the owner's Capital (Net Worth).",
    "options": [
      "KES 920,000",
      "KES 645,000",
      "KES 275,000",
      "KES 1,195,000"
    ],
    "correctIndex": 1,
    "explanation": "From the fundamental accounting equation Assets = Capital + Liabilities: Capital = Assets - Liabilities = 920,000 - 275,000 = KES 645,000.",
    "concept": "Fundamental Balance Sheet Equation: Assets (A) = Capital (C) + Liabilities (L)."
  },
  {
    "id": "kcse_bus_e6",
    "subject": "business",
    "topicId": "bus_acc",
    "difficulty": "easy",
    "question": "Under double-entry bookkeeping rules, when a business buys office furniture worth KES 45,000 paying by cheque, which accounts are debited and credited?",
    "options": [
      "Debit Bank Account; Credit Office Furniture Account",
      "Debit Office Furniture Account; Credit Bank Account",
      "Debit Purchases Account; Credit Cash Account",
      "Debit Capital Account; Credit Office Furniture Account"
    ],
    "correctIndex": 1,
    "explanation": "Office Furniture is a fixed asset increasing (Debit asset increases), and Bank is a current asset decreasing via cheque payment (Credit asset decreases). Note: \"Purchases Account\" is used ONLY for goods bought specifically for resale!",
    "concept": "Never record acquisition of fixed assets (furniture, vehicles, machinery) in the Purchases Account; debit the named Fixed Asset Account."
  },
  {
    "id": "kcse_bus_e7",
    "subject": "business",
    "topicId": "bus_fin",
    "difficulty": "easy",
    "question": "Which institution in Kenya has the sole statutory authority to issue Kenyan currency notes and coins and act as lender of last resort to commercial banks?",
    "options": [
      "Kenya Revenue Authority (KRA)",
      "Central Bank of Kenya (CBK)",
      "Kenya Commercial Bank (KCB)",
      "Nairobi Securities Exchange (NSE)"
    ],
    "correctIndex": 1,
    "explanation": "Under Article 231 of the Constitution and the CBK Act, the Central Bank of Kenya issues currency, formulates monetary policy, holds foreign exchange reserves, and acts as banker to government and commercial banks.",
    "concept": "Only the Central Bank issues legal tender currency and regulates commercial banks; commercial banks accept public deposits and create credit."
  },
  {
    "id": "kcse_bus_e8",
    "subject": "business",
    "topicId": "bus_fin",
    "difficulty": "easy",
    "question": "How is Value Added Tax (VAT) classified in public finance, and why?",
    "options": [
      "Capital grant — refunded to every shopper at the supermarket till",
      "Indirect tax — its legal impact falls on the trader/supplier, while the final tax incidence (burden) is shifted forward onto the consumer through commodity prices",
      "Direct tax — deducted directly from an employee's monthly salary slip like PAYE",
      "Progressive poll tax — paid equally by unemployed citizens regardless of spending"
    ],
    "correctIndex": 1,
    "explanation": "In an indirect tax (VAT, excise duty, customs duty), impact (initial payment to KRA) and incidence (ultimate money burden) rest on different persons because the seller shifts the tax onto the buyer.",
    "concept": "Direct tax (PAYE, corporate tax) = impact and incidence on the same person; Indirect tax (VAT, excise) = burden shifted to final consumers."
  },
  {
    "id": "kcse_bus_e9",
    "subject": "business",
    "topicId": "bus_dev",
    "difficulty": "easy",
    "question": "In the circular flow of national income in a simple two-sector closed economy, who are the two economic agents?",
    "options": [
      "Central Bank and World Bank",
      "Households and Firms",
      "Wholesalers and Retailers",
      "Government and Foreign Sector only"
    ],
    "correctIndex": 1,
    "explanation": "A simplified two-sector circular flow model assumes no government (no taxes/subsidies), no foreign trade (closed), and no savings/investment leakages—comprising solely Households (supplying factor services) and Firms (producing goods/services).",
    "concept": "In the two-sector circular flow, leakages/withdrawals (Savings, Taxes, Imports) and injections (Investment, Govt spending, Exports) are assumed absent."
  },
  {
    "id": "kcse_bus_e10",
    "subject": "business",
    "topicId": "bus_dev",
    "difficulty": "easy",
    "question": "What term describes persistent general rise in prices caused when aggregate demand for goods and services exceeds aggregate supply at full employment (\"too much money chasing too few goods\")?",
    "options": [
      "Demand-pull inflation",
      "Cost-push inflation",
      "Stagflation",
      "Deflation"
    ],
    "correctIndex": 0,
    "explanation": "Excess aggregate demand pulls general price levels upward (demand-pull inflation), whereas rising production input costs such as fuel, electricity, or wages drive cost-push inflation.",
    "concept": "Distinguish Demand-pull inflation (excess aggregate spending) from Cost-push inflation (rising wage/fuel/raw-material costs)."
  },
  {
    "id": "kcse_bus_m1",
    "subject": "business",
    "topicId": "bus_mkt",
    "difficulty": "medium",
    "question": "Tea and coffee are close consumption substitutes. Holding other factors constant, how will a sharp increase in the retail price of coffee affect the market for tea?",
    "options": [
      "The supply curve of coffee shifts right due to cheaper tea",
      "The demand curve for tea shifts inward to the left, lowering the price of tea",
      "There is a downward movement along the existing demand curve for tea without any shift",
      "The demand curve for tea shifts outward to the right, raising both equilibrium price and equilibrium quantity of tea"
    ],
    "correctIndex": 3,
    "explanation": "As coffee becomes expensive, consumers switch to tea even at tea's old price. Because this change comes from a non-own-price determinant (price of a substitute), the entire demand curve for tea shifts right, raising tea's equilibrium price and quantity.",
    "concept": "A change in a product's OWN price causes movement along its curve; a change in substitute/complement prices or income shifts the entire curve."
  },
  {
    "id": "kcse_bus_m2",
    "subject": "business",
    "topicId": "bus_mkt",
    "difficulty": "medium",
    "question": "Why does an individual firm in an oligopolistic market (such as fuel retailers or mobile telecom operators) face a \"kinked\" demand curve at the prevailing market price?",
    "options": [
      "There are millions of identical small farmers unable to advertise",
      "Government fixes all oligopoly prices by weekly parliamentary decree",
      "Demand is perfectly horizontal above the kink and vertical at zero output",
      "Rivals ignore a price increase (making demand elastic above the kink) but swiftly match any price cut to protect market share (making demand inelastic below the kink), resulting in price rigidity"
    ],
    "correctIndex": 3,
    "explanation": "Interdependence among a few large firms creates asymmetric rival reactions: raise price alone and lose many customers (elastic); cut price and trigger a matched price war gaining few customers (inelastic). Consequently firms prefer non-price competition (promotions, branding, loyalty rewards).",
    "concept": "Oligopoly kinked demand curve: elastic above current price, inelastic below current price -> explains sticky/rigid prices and heavy non-price competition."
  },
  {
    "id": "kcse_bus_m3",
    "subject": "business",
    "topicId": "bus_trd",
    "difficulty": "medium",
    "question": "Otieno insured his shop stock worth KES 1,000,000 for only KES 600,000 (under-insurance) with an average clause in the policy. A fire destroyed stock worth KES 400,000. Calculate the compensation payable by the insurer.",
    "options": [
      "KES 400,000",
      "KES 1,000,000",
      "KES 600,000",
      "KES 240,000"
    ],
    "correctIndex": 3,
    "explanation": "Under the under-insurance average clause: Compensation = (Sum Insured / Actual Value of Property) x Actual Loss = (600,000 / 1,000,000) x 400,000 = 0.60 x 400,000 = KES 240,000 (Otieno bears 40% of the loss himself).",
    "concept": "Insurance Compensation Formula (under-insurance): (Sum Insured / Real Value) x Loss suffered."
  },
  {
    "id": "kcse_bus_m4",
    "subject": "business",
    "topicId": "bus_trd",
    "difficulty": "medium",
    "question": "After fully compensating a client KES 1,200,000 for a vehicle written off in an accident, why does the insurance company take legal ownership of the metallic wreck?",
    "options": [
      "Because motor insurance is an assurance contract that cannot be indemnified",
      "Under the principle of Utmost Good Faith (Uberrimae Fidei)",
      "Under the principle of Contribution between two life policies",
      "Under the principle of Subrogation (a corollary of Indemnity), preventing the insured from making a profit by both receiving full compensation and selling the scrap"
    ],
    "correctIndex": 3,
    "explanation": "Indemnity restores the insured to their pre-loss financial position without profit. Under Subrogation, once full indemnity is paid, all salvage rights in the damaged wreck and legal claims against negligent third parties pass to the insurer.",
    "concept": "Subrogation transfers salvage rights and third-party recovery rights to the insurer after full indemnity is paid."
  },
  {
    "id": "kcse_bus_m5",
    "subject": "business",
    "topicId": "bus_acc",
    "difficulty": "medium",
    "question": "A hardware trader applies a uniform Mark-up of 25% on cost. If annual Sales (Turnover) were KES 1,500,000, calculate the Gross Profit and Cost of Goods Sold.",
    "options": [
      "Gross Profit = KES 375,000; Cost of Goods Sold = KES 1,125,000",
      "Gross Profit = KES 500,000; Cost of Goods Sold = KES 1,000,000",
      "Gross Profit = KES 250,000; Cost of Goods Sold = KES 1,250,000",
      "Gross Profit = KES 300,000; Cost of Goods Sold = KES 1,200,000"
    ],
    "correctIndex": 3,
    "explanation": "Mark-up = GP / Cost = 25% = 1/4. Convert Mark-up (1/4) to Margin (GP / Sales): if Mark-up = a/b = 1/4, then Margin = a / (b + a) = 1 / (4 + 1) = 1/5 (20%). Therefore Gross Profit = (1/5) x 1,500,000 = KES 300,000, and Cost of Goods Sold = 1,500,000 - 300,000 = KES 1,200,000 (check: 300,000 / 1,200,000 = 25%!).",
    "concept": "Mark-up <-> Margin conversion: if Mark-up = 1/n, Margin = 1/(n + 1); if Margin = 1/m, Mark-up = 1/(m - 1)."
  },
  {
    "id": "kcse_bus_m6",
    "subject": "business",
    "topicId": "bus_acc",
    "difficulty": "medium",
    "question": "In a Three-Column Cash Book, how is the transaction \"Deposited KES 35,000 office cash into the business bank account\" recorded?",
    "options": [
      "Enter KES 35,000 in the Discount Allowed and Discount Received columns",
      "Debit Cash column KES 35,000 and Credit Bank column KES 35,000",
      "Debit Capital Account KES 35,000 and Credit Cash column KES 35,000",
      "Contra entry (marked \"C\" in folio): Debit Bank column KES 35,000 and Credit Cash column KES 35,000"
    ],
    "correctIndex": 3,
    "explanation": "Both Cash and Bank columns sit inside the Cash Book, so depositing office cash into the bank is a Contra Entry (\"C\"): Bank receives value (Debit Bank column) and Cash gives out value (Credit Cash column).",
    "concept": "Cash-to-Bank (Dr Bank, Cr Cash) and Bank-to-Office-Cash (Dr Cash, Cr Bank) are Contra Entries completed entirely inside the Cash Book."
  },
  {
    "id": "kcse_bus_m7",
    "subject": "business",
    "topicId": "bus_fin",
    "difficulty": "medium",
    "question": "If the Kenyan economy is experiencing severe demand-pull inflation, which combination of Monetary Policy actions should the Central Bank of Kenya (CBK) implement to contract money supply?",
    "options": [
      "Print additional currency notes and abolish commercial bank liquidity requirements",
      "Instruct commercial banks to offer zero-interest unsecured consumer loans",
      "Buy government securities from the public, lower the CBR, and reduce the Cash Reserve Ratio",
      "Sell government Treasury bills/bonds in Open Market Operations (OMO), raise the Central Bank Rate (CBR), and increase the Cash Reserve Ratio (CRR)"
    ],
    "correctIndex": 3,
    "explanation": "Selling Treasury securities mops up excess liquidity from the public/banks, raising CBR makes borrowing costlier, and raising CRR locks a larger fraction of deposits at CBK, curbing credit creation and cooling inflation.",
    "concept": "Contractionary monetary policy (fighting inflation): SELL securities in OMO + RAISE Bank Rate + RAISE Cash/Liquidity Ratio."
  },
  {
    "id": "kcse_bus_m8",
    "subject": "business",
    "topicId": "bus_trd",
    "difficulty": "medium",
    "question": "What is the fundamental governance difference between how voting power and surplus distribution work in a Producer/SACCO Cooperative Society versus a Public Limited Company?",
    "options": [
      "Cooperatives have unlimited liability and a maximum of 20 members",
      "Cooperatives grant 100 votes to the wealthiest shareholder only",
      "Public limited companies prohibit transfer of shares on the Nairobi Securities Exchange",
      "Cooperatives apply democratic \"one member, one vote\" regardless of shares held and distribute dividends/rebates by patronage, whereas companies apply \"one share, one vote\" and pay dividends per share owned"
    ],
    "correctIndex": 3,
    "explanation": "Rochdale cooperative principles vest democratic control in members equally (one member, one vote) and share surpluses as patronage rebates/dividends on member transactions, whereas joint-stock companies weight voting and dividends strictly by shareholding.",
    "concept": "Cooperative democracy = one member, one vote; Joint-stock company = one ordinary share, one vote."
  },
  {
    "id": "kcse_bus_m9",
    "subject": "business",
    "topicId": "bus_dev",
    "difficulty": "medium",
    "question": "A country's Export Price Index rose from 100 to 120 while its Import Price Index rose from 100 to 150 over the same period. Calculate the Terms of Trade (ToT) index and interpret the result.",
    "options": [
      "30% — favourable balance of payments surplus",
      "100% — unchanged purchasing power of exports",
      "125% (or 125) — favourable improvement in Terms of Trade",
      "80% (or 80) — unfavourable deterioration in Terms of Trade because import prices rose faster than export prices"
    ],
    "correctIndex": 3,
    "explanation": "Terms of Trade Index = (Export Price Index / Import Price Index) x 100 = (120 / 150) x 100 = 80%. Because 80 < 100, a unit of exports now buys fewer imports—an unfavourable shift in Terms of Trade.",
    "concept": "Terms of Trade = (P_x / P_m) x 100: >100 is favourable; <100 is unfavourable (not to be confused with Balance of Trade, which compares export/import VALUES!)."
  },
  {
    "id": "kcse_bus_m10",
    "subject": "business",
    "topicId": "bus_trd",
    "difficulty": "medium",
    "question": "Why do importers store dutiable imported vehicles or electronics in a Bonded Warehouse at Mombasa Port before finding buyers?",
    "options": [
      "Goods cannot be inspected by potential buyers while inside a bonded warehouse",
      "Bonded warehouses are owned exclusively by street hawkers without customs supervision",
      "Customs duty payment is deferred until the goods are released from bond, freeing working capital and allowing re-export without paying local duty, or grading/blending/branding while in bond",
      "Goods placed in a bonded warehouse become permanently exempt from all KRA customs duties when sold locally"
    ],
    "correctIndex": 2,
    "explanation": "Bonded warehouses are licensed and supervised by Customs (KRA) to hold dutiable goods until duty is paid. Importers can prepare goods, look for buyers, sell goods in bond (shifting duty payment to the buyer), or re-export duty-free.",
    "concept": "Bonded warehouses hold dutiable goods UNTIL customs duty is paid; Free warehouses hold non-dutiable or duty-paid goods."
  },
  {
    "id": "kcse_bus_d1",
    "subject": "business",
    "topicId": "bus_acc",
    "difficulty": "difficult",
    "question": "Which bookkeeping error below WILL STILL ALLOW the Trial Balance debit and credit totals to agree (balance), failing to be revealed by a Trial Balance?",
    "options": [
      "Error of Principle — e.g., debiting KES 80,000 paid for a new delivery van to the Motor Expenses Account instead of the Motor Vehicles Account while crediting Bank KES 80,000",
      "Undercasting the Purchases Day Book total transferred to Purchases Account while crediting individual creditors accurately",
      "Posting KES 15,000 to the debit of Rent Account and KES 51,000 to the credit of Cash Account",
      "Entering a cash sale of KES 12,000 on the debit side of Cash ONLY and omitting the Sales Account completely"
    ],
    "correctIndex": 0,
    "explanation": "Six classic errors are NOT disclosed by a Trial Balance because equal debits and credits were still posted: Error of Omission (whole transaction), Error of Commission (wrong personal account), Error of Principle (wrong class of account), Complete Reversal of Entries, Error of Original Entry, and Compensating Errors.",
    "concept": "A balanced Trial Balance proves arithmetical equality of debits and credits, NOT absence of Errors of Principle, Commission, Omission, Original Entry, Reversal, or Compensation."
  },
  {
    "id": "kcse_bus_d2",
    "subject": "business",
    "topicId": "bus_acc",
    "difficulty": "difficult",
    "question": "From the following records of Wema Traders for 2025: Opening Stock = KES 80,000; Closing Stock = KES 120,000; Purchases = KES 640,000; Carriage Inwards = KES 20,000; Purchases Returns = KES 10,000. Calculate the Rate of Stock Turnover (ROSTO).",
    "options": [
      "5.08 times",
      "7.625 times",
      "6.1 times",
      "6.3 times"
    ],
    "correctIndex": 2,
    "explanation": "Net Purchases + Carriage Inwards = 640,000 - 10,000 + 20,000 = 650,000. Cost of Goods Sold (COGS) = Opening Stock + 650,000 - Closing Stock = 80,000 + 650,000 - 120,000 = KES 610,000. Average Stock = (80,000 + 120,000) / 2 = KES 100,000. ROSTO = COGS / Average Stock = 610,000 / 100,000 = 6.1 times.",
    "concept": "Carriage Inwards ADDS to cost of purchases in the Trading Account (whereas Carriage Outwards goes to Profit & Loss expenses); ROSTO = COGS / Average Stock."
  },
  {
    "id": "kcse_bus_d3",
    "subject": "business",
    "topicId": "bus_acc",
    "difficulty": "difficult",
    "question": "At 1 January 2025, Kamau's Capital was KES 500,000. During the year he introduced additional personal cash of KES 120,000 into the business, withdrew goods worth KES 45,000 for family use (Drawings), and ended the year with Closing Capital of KES 710,000. Calculate the Net Profit for 2025.",
    "options": [
      "KES 135,000",
      "KES 285,000",
      "KES 210,000",
      "KES 45,000"
    ],
    "correctIndex": 0,
    "explanation": "Using the Capital Continuity Equation: Closing Capital = Opening Capital + Additional Investment + Net Profit - Drawings -> 710,000 = 500,000 + 120,000 + Net Profit - 45,000 -> 710,000 = 575,000 + Net Profit -> Net Profit = 710,000 - 575,000 = KES 135,000.",
    "concept": "Incomplete records profit formula: Net Profit = Closing Capital + Drawings - Opening Capital - Additional Capital."
  },
  {
    "id": "kcse_bus_d4",
    "subject": "business",
    "topicId": "bus_acc",
    "difficulty": "difficult",
    "question": "A company reports: Stock = KES 90,000; Debtors = KES 110,000; Cash at Bank = KES 40,000; Creditors = KES 80,000; Short-term Bank Overdraft = KES 20,000; 5-Year Mortgage Loan = KES 500,000. Calculate the Current Ratio and Quick (Acid-Test) Ratio.",
    "options": [
      "Current Ratio = 2.4 : 1; Acid-Test Ratio = 2.4 : 1",
      "Current Ratio = 3.0 : 1; Acid-Test Ratio = 1.875 : 1",
      "Current Ratio = 2.4 : 1; Acid-Test Ratio = 1.5 : 1",
      "Current Ratio = 0.4 : 1; Acid-Test Ratio = 0.25 : 1"
    ],
    "correctIndex": 2,
    "explanation": "Current Assets = Stock (90k) + Debtors (110k) + Bank (40k) = KES 240,000. Current Liabilities = Creditors (80k) + Overdraft (20k) = KES 100,000 (exclude the 5-year long-term mortgage!). Current Ratio = 240,000 / 100,000 = 2.4 : 1. Acid-Test Ratio excludes illiquid Stock: (240,000 - 90,000) / 100,000 = 150,000 / 100,000 = 1.5 : 1.",
    "concept": "Current Ratio = Current Assets / Current Liabilities; Quick (Acid-Test) Ratio = (Current Assets - Closing Stock) / Current Liabilities."
  },
  {
    "id": "kcse_bus_d5",
    "subject": "business",
    "topicId": "bus_fin",
    "difficulty": "difficult",
    "question": "If the Central Bank of Kenya sets the statutory Cash Reserve Ratio at 5% and a customer deposits KES 200,000 of fresh primary cash into a commercial bank (assuming no cash leakage and banks lend out all excess reserves), what is the theoretical maximum total deposits created across the banking system?",
    "options": [
      "KES 4,000,000",
      "KES 1,000,000",
      "KES 3,800,000",
      "KES 10,000,000"
    ],
    "correctIndex": 0,
    "explanation": "Credit Multiplier k = 1 / r = 1 / 0.05 = 20. Maximum Total Deposits created = Initial Deposit x (1 / r) = KES 200,000 x 20 = KES 4,000,000.",
    "concept": "Total Deposit Creation = Initial Primary Deposit / Cash Reserve Ratio (r); higher reserve ratios shrink the credit multiplier."
  },
  {
    "id": "kcse_bus_d6",
    "subject": "business",
    "topicId": "bus_dev",
    "difficulty": "difficult",
    "question": "Why must Transfer Payments (such as Inua Jamii elderly stipends, student bursaries, and unemployment relief) be EXCLUDED when computing National Income via the Income Approach?",
    "options": [
      "They represent depreciation of capital machinery",
      "Recipients save 100% of stipends in offshore banks",
      "They are unilateral redistributions of existing tax revenue for which no corresponding current productive output of goods or services was rendered, so including them causes double counting",
      "They are paid exclusively in foreign currency outside Kenya's borders"
    ],
    "correctIndex": 2,
    "explanation": "National income measures only factor incomes earned in exchange for current production of goods and services (wages, rent, interest, profit). Counting taxes inside gross wages and counting the same money again as bursaries/pensions would double-count output.",
    "concept": "Avoid double counting in National Income: exclude transfer payments (pensions/bursaries/gifts) in the Income Approach, and use Value Added (or final goods only) in the Output Approach."
  },
  {
    "id": "kcse_bus_d7",
    "subject": "business",
    "topicId": "bus_dev",
    "difficulty": "difficult",
    "question": "Given that a nation's Gross Domestic Product (GDP) at market prices is KES 14,500 billion, factor income earned by citizens abroad is KES 400 billion, factor income paid to foreigners working domestically is KES 650 billion, and capital consumption (depreciation) is KES 850 billion, calculate Net National Product (NNP) at market prices.",
    "options": [
      "KES 13,400 billion",
      "KES 14,250 billion",
      "KES 14,750 billion",
      "KES 13,900 billion"
    ],
    "correctIndex": 0,
    "explanation": "First find Gross National Product (GNP): Net Factor Income from Abroad (NFIA) = Receipts from abroad - Payments to abroad = 400 - 650 = -250 billion. GNP = GDP + NFIA = 14,500 + (-250) = KES 14,250 billion. Subtract Depreciation for NNP: 14,250 - 850 = KES 13,400 billion.",
    "concept": "GNP = GDP + (Income from abroad - Income to abroad); NNP = GNP - Depreciation; Factor Cost = Market Price - Indirect Taxes + Subsidies."
  },
  {
    "id": "kcse_bus_d8",
    "subject": "business",
    "topicId": "bus_mkt",
    "difficulty": "difficult",
    "question": "Suppose the government imposes a legally binding Maximum Price (Price Ceiling) on essential maize flour BELOW the free-market equilibrium price without releasing buffer stocks. What market outcome follows?",
    "options": [
      "Market price rises legally above equilibrium to clear excess supply",
      "Supply curve shifts instantaneously rightward without subsidies",
      "Quantity demanded exceeds quantity supplied, creating persistent shortages, long queues, rationing, and emergence of black-market hoarding above the legal ceiling",
      "Unsold surpluses of maize flour pile up in millers' warehouses"
    ],
    "correctIndex": 2,
    "explanation": "At an effective price ceiling P_max < P_eq, consumers demand more while producers find milling less profitable and supply less (Q_d > Q_s), generating excess demand (shortage) and illegal parallel/black markets unless government subsidises supply or releases strategic grain reserves.",
    "concept": "Effective Price Ceiling (below equilibrium) -> Excess Demand (Shortage); Effective Price Floor / Minimum Price (above equilibrium) -> Excess Supply (Surplus)."
  },
  {
    "id": "kcse_bus_d9",
    "subject": "business",
    "topicId": "bus_fin",
    "difficulty": "difficult",
    "question": "Which canon (principle) of taxation formulated by Adam Smith requires that the time, manner, and method of paying tax should suit the taxpayer's circumstances (for example, deducting PAYE at month-end when salary is paid, or collecting VAT at the moment of purchase)?",
    "options": [
      "Principle of Convenience",
      "Principle of Elasticity",
      "Principle of Certainty",
      "Principle of Economy"
    ],
    "correctIndex": 0,
    "explanation": "Adam Smith's four classic canons: Equity (according to ability to pay), Certainty (amount/date/method clear, not arbitrary), Convenience (collected at a time/manner easy for taxpayer), and Economy (cost of collection minimal relative to revenue raised).",
    "concept": "Distinguish Certainty (knowing exact tax amount/rules clearly) from Convenience (timing and mode of payment suiting the taxpayer)."
  },
  {
    "id": "kcse_bus_d10",
    "subject": "business",
    "topicId": "bus_dev",
    "difficulty": "difficult",
    "question": "In a Balance of Payments (BoP) statement, under which specific account are foreign direct investments (FDI), external sovereign loans from the World Bank, and portfolio equity inflows recorded?",
    "options": [
      "Invisible Trade Account (Current Account Services)",
      "Capital and Financial Account",
      "Visible Trade Balance (Merchandise Account)",
      "Official Petty Cash Ledger"
    ],
    "correctIndex": 1,
    "explanation": "The Current Account records visible trade (goods exports/imports), invisible trade (shipping, tourism, insurance, investment income), and current transfers (diaspora remittances/grants). Cross-border asset acquisitions, FDI, and long/short-term external loans belong in the Capital and Financial Account.",
    "concept": "Balance of Payments structure: Current Account (visible goods + invisible services + transfers) vs Capital & Financial Account (FDI, loans, capital flows) + Official Reserves."
  },
  {
    "id": "kcse_comp_e1",
    "subject": "computer",
    "topicId": "comp_sys",
    "difficulty": "easy",
    "question": "Which internal component of the Central Processing Unit (CPU) performs arithmetic operations (addition, subtraction) and logical comparisons (AND, OR, NOT, > , =)?",
    "options": [
      "Arithmetic and Logic Unit (ALU)",
      "Control Unit (CU)",
      "Read-Only Memory (ROM)",
      "CMOS Battery"
    ],
    "correctIndex": 0,
    "explanation": "The CPU comprises the Control Unit (fetches/decodes instructions and coordinates timing signals), the Arithmetic and Logic Unit (executes all arithmetic and Boolean logic comparisons), and high-speed Registers.",
    "concept": "CPU functional triad: Control Unit (coordination), ALU (math & logic), and Registers (immediate operand/address holding)."
  },
  {
    "id": "kcse_comp_e2",
    "subject": "computer",
    "topicId": "comp_sys",
    "difficulty": "easy",
    "question": "Why is an Uninterruptible Power Supply (UPS) essential in a school computer laboratory?",
    "options": [
      "It generates permanent solar electricity for the entire school for weeks",
      "It doubles CPU clock speed from 2.4 GHz to 4.8 GHz",
      "It regulates voltage surges/brownouts and provides temporary battery backup during a mains blackout so users can save work and shut down computers safely",
      "It encrypts student files against Trojan horses and worms"
    ],
    "correctIndex": 2,
    "explanation": "Because RAM is volatile, a sudden mains power cut erases unsaved work and risks corrupting hard disk file tables. A UPS conditions unstable power (spike/brownout protection) and supplies short-term battery power for orderly saving and shutdown.",
    "concept": "Two primary functions of a UPS: (1) voltage surge/brownout conditioning and (2) temporary standby power for safe data saving and shutdown."
  },
  {
    "id": "kcse_comp_e3",
    "subject": "computer",
    "topicId": "comp_app",
    "difficulty": "easy",
    "question": "In a spreadsheet such as Microsoft Excel, what error code is displayed when a column is too narrow to display a numeric or date result in full?",
    "options": [
      "#####",
      "#NAME?",
      "#DIV/0!",
      "#VALUE!"
    ],
    "correctIndex": 0,
    "explanation": "##### indicates column width is insufficient (or a negative date/time); #DIV/0! means division by zero/empty cell; #NAME? means unrecognised function/range name (e.g. =SUMM(A1:A5)); #VALUE! means wrong operand data type (e.g. adding text to a number).",
    "concept": "Spreadsheet error diagnostics: ##### (narrow column), #DIV/0! (zero divisor), #NAME? (misspelt function), #REF! (deleted cell reference)."
  },
  {
    "id": "kcse_comp_e4",
    "subject": "computer",
    "topicId": "comp_app",
    "difficulty": "easy",
    "question": "In a relational school database, what is the main purpose of defining Admission_Number as the Primary Key of the Students table?",
    "options": [
      "To encrypt student exam marks with a password",
      "To allow two siblings to share the exact same Admission_Number",
      "To uniquely identify every student record in the table and prevent duplicate or null (empty) Admission_Number entries",
      "To sort students alphabetically by first name automatically"
    ],
    "correctIndex": 2,
    "explanation": "A Primary Key enforces entity integrity: every record must have a non-null, strictly unique value in that field so no two student records can ever be confused.",
    "concept": "Primary Key properties: strictly unique across all rows and never NULL."
  },
  {
    "id": "kcse_comp_e5",
    "subject": "computer",
    "topicId": "comp_num",
    "difficulty": "easy",
    "question": "Convert the decimal (base 10) integer 45_10 into its 8-bit unsigned binary (base 2) equivalent.",
    "options": [
      "00101101_2",
      "00110101_2",
      "00101011_2",
      "01011010_2"
    ],
    "correctIndex": 0,
    "explanation": "Place values: 32 + 8 + 4 + 1 = 45 -> 0(128) 0(64) 1(32) 0(16) 1(8) 1(4) 0(2) 1(1) = 00101101_2.",
    "concept": "8-bit binary place weights from left to right are 128, 64, 32, 16, 8, 4, 2, 1."
  },
  {
    "id": "kcse_comp_e6",
    "subject": "computer",
    "topicId": "comp_num",
    "difficulty": "easy",
    "question": "How many bytes are required to represent the 7-character string \"NAIROBI\" in standard 8-bit Extended ASCII coding?",
    "options": [
      "8 bytes (64 bits)",
      "14 bytes (112 bits)",
      "7 bytes (56 bits)",
      "1 byte (8 bits)"
    ],
    "correctIndex": 2,
    "explanation": "In 8-bit ASCII, each character occupies 1 byte (8 bits). Since \"NAIROBI\" has 7 characters, it requires 7 bytes (7 x 8 = 56 bits). (14 bytes would apply to 16-bit UTF-16 Unicode.)",
    "concept": "1 byte = 8 bits = 1 character in standard 8-bit ASCII; 1 nibble = 4 bits."
  },
  {
    "id": "kcse_comp_e7",
    "subject": "computer",
    "topicId": "comp_prog",
    "difficulty": "easy",
    "question": "In standard program flowcharting, which geometric symbol is used for Input/Output operations (such as READ mark or PRINT average)?",
    "options": [
      "Parallelogram",
      "Diamond",
      "Rectangle",
      "Oval (Rounded rectangle)"
    ],
    "correctIndex": 0,
    "explanation": "Flowchart symbols in KNEC 451: Oval = Start/Stop terminal; Parallelogram = Input/Output; Rectangle = Process/Assignment; Diamond = Decision/Condition; Circle = On-page connector.",
    "concept": "Never confuse Rectangle (internal calculation/assignment like SUM = A + B) with Parallelogram (external Input/Output like READ A, PRINT SUM)."
  },
  {
    "id": "kcse_comp_e8",
    "subject": "computer",
    "topicId": "comp_prog",
    "difficulty": "easy",
    "question": "Which translator converts an entire high-level source code program into an independent machine-code object file all at once before execution?",
    "options": [
      "Interpreter",
      "Linker",
      "Compiler",
      "Assembler"
    ],
    "correctIndex": 2,
    "explanation": "A compiler translates the whole high-level source program into object code in one pass before execution; an interpreter translates and executes high-level statements line by line; an assembler translates low-level Assembly mnemonics into machine code.",
    "concept": "Translators: Assembler (Assembly -> Machine), Interpreter (High-level line-by-line), Compiler (High-level whole program -> Object code)."
  },
  {
    "id": "kcse_comp_e9",
    "subject": "computer",
    "topicId": "comp_net",
    "difficulty": "easy",
    "question": "In which Local Area Network (LAN) topology is every workstation connected by its own dedicated cable to a central switch or hub?",
    "options": [
      "Star topology",
      "Ring topology",
      "Bus topology",
      "Linear daisy-chain topology"
    ],
    "correctIndex": 0,
    "explanation": "In a Star topology, all nodes radiate from a central switch: if one workstation cable breaks, the rest of the network continues operating normally, though failure of the central switch brings down the whole LAN.",
    "concept": "Star topology isolates single cable faults and simplifies troubleshooting, with the central switch acting as the single point of failure."
  },
  {
    "id": "kcse_comp_e10",
    "subject": "computer",
    "topicId": "comp_net",
    "difficulty": "easy",
    "question": "Why are fibre-optic cables immune to electromagnetic interference (EMI) and lightning crosstalk compared with twisted-pair copper cables?",
    "options": [
      "Fibre-optic cables carry 10,000 V DC current that overpowers radio noise",
      "Fibre-optic cables transmit data as pulses of light via total internal reflection inside glass/plastic cores rather than electrical currents",
      "Fibre-optic cables are made of solid lead-coated iron rods",
      "Light pulses travel slower than sound inside glass cores"
    ],
    "correctIndex": 1,
    "explanation": "Because signals travel as guided light pulses inside a high-refractive-index glass core surrounded by lower-index cladding (total internal reflection), external magnetic/electrical fields cannot induce noise.",
    "concept": "Fibre-optic advantages: ultra-high bandwidth, very low attenuation over long distances, immunity to EMI, and high eavesdropping security."
  },
  {
    "id": "kcse_comp_m1",
    "subject": "computer",
    "topicId": "comp_sys",
    "difficulty": "medium",
    "question": "Distinguish between a \"Computer Worm\" and a \"Trojan Horse\" in data security.",
    "options": [
      "A Trojan self-replicates across routers automatically, whereas a worm is a hardware surge protector",
      "Both require physically swapping RAM chips between computers to spread",
      "A worm self-replicates automatically across networks exploiting vulnerabilities without needing user action, whereas a Trojan disguises itself as legitimate useful software without self-replicating",
      "A worm speeds up disk defragmentation whereas a Trojan is an antivirus firewall"
    ],
    "correctIndex": 2,
    "explanation": "Worms propagate autonomously over network connections (consuming bandwidth/memory); Trojans masquerade as desirable programs (e.g., a free utility) to trick users into installing hidden backdoors/spyware, and do not self-replicate.",
    "concept": "Malware taxonomy: Virus (attaches to host file), Worm (standalone network self-replicator), Trojan Horse (disguised non-replicating payload)."
  },
  {
    "id": "kcse_comp_m2",
    "subject": "computer",
    "topicId": "comp_app",
    "difficulty": "medium",
    "question": "Cell D2 in a spreadsheet contains the formula =B2*$C$1. If this formula is copied (autofilled) down from cell D2 into cell D5, what exact formula will appear in cell D5?",
    "options": [
      "=B5*$C$1",
      "=B5*$C$4",
      "=B5*C4",
      "=B2*$C$1"
    ],
    "correctIndex": 0,
    "explanation": "B2 is a relative reference, so moving 3 rows down (row 2 -> row 5) updates it to B5. $C$1 is an absolute reference locked in both column ($C) and row ($1), so it stays $C$1.",
    "concept": "Dollar signs ($) lock column and/or row coordinates during formula copying: B2 (relative), $C$1 (absolute), $C1 or C$1 (mixed)."
  },
  {
    "id": "kcse_comp_m3",
    "subject": "computer",
    "topicId": "comp_app",
    "difficulty": "medium",
    "question": "In a relational database linking a Classes table (ClassID [PK], ClassName) and a Students table (AdmNo [PK], Name, ClassID), what type of relationship exists and what role does ClassID play inside the Students table?",
    "options": [
      "Many-to-Many relationship without any keys",
      "One-to-One relationship; ClassID is the Primary Key of the Students table",
      "One-to-Many relationship; ClassID in the Students table is a Foreign Key referencing ClassID in the Classes table",
      "Flat-file relationship; AdmNo is a Foreign Key in the Classes table"
    ],
    "correctIndex": 2,
    "explanation": "One class contains many students, while each student belongs to one class (1:M). Placing the \"one\" side's Primary Key (ClassID) inside the \"many\" table (Students) creates a Foreign Key enforcing referential integrity.",
    "concept": "In a 1:M relational design, the Primary Key of the parent (\"One\") table is placed as a Foreign Key inside the child (\"Many\") table."
  },
  {
    "id": "kcse_comp_m4",
    "subject": "computer",
    "topicId": "comp_num",
    "difficulty": "medium",
    "question": "Convert the hexadecimal number 2F_16 into its octal (base 8) equivalent.",
    "options": [
      "57_8",
      "217_8",
      "67_8",
      "47_8"
    ],
    "correctIndex": 0,
    "explanation": "Convert each hex digit to 4-bit binary first: 2 = 0010_2, F (15) = 1111_2 -> 00101111_2. Now regroup bits in threes from the right: 000 101 111_2 -> 101_2 = 5 and 111_2 = 7 -> 57_8 (check in decimal: 2x16 + 15 = 47_10; 5x8 + 7 = 47_10!).",
    "concept": "Fast Hex <-> Octal bridge: expand each Hex digit to 4-bit binary, then regroup from the right into 3-bit Octal triads."
  },
  {
    "id": "kcse_comp_m5",
    "subject": "computer",
    "topicId": "comp_num",
    "difficulty": "medium",
    "question": "Represent the negative decimal integer -29_10 in 8-bit Two's Complement binary notation.",
    "options": [
      "00011101_2",
      "11100010_2",
      "11100011_2",
      "10011101_2"
    ],
    "correctIndex": 2,
    "explanation": "Step 1: +29 in 8-bit binary = 00011101_2 (16+8+4+1). Step 2: Ones' complement (invert all bits) = 11100010_2. Step 3: Add 1 for Two's complement: 11100010 + 1 = 11100011_2. (Check: -128 + 64 + 32 + 2 + 1 = -128 + 99 = -29!)",
    "concept": "Note the distractors: 10011101 is Sign-and-Magnitude, 11100010 is Ones' Complement, and 11100011 is Two's Complement!"
  },
  {
    "id": "kcse_comp_m6",
    "subject": "computer",
    "topicId": "comp_prog",
    "difficulty": "medium",
    "question": "What is the critical control-flow difference between a WHILE...DO loop and a REPEAT...UNTIL loop?",
    "options": [
      "WHILE...DO tests the condition BEFORE entering the loop body (so it may execute 0 times), whereas REPEAT...UNTIL tests the exit condition AFTER the body (executing at least once)",
      "Both loops always execute the exact same minimum of 1 iteration",
      "WHILE...DO can only count backwards using integers",
      "REPEAT...UNTIL tests the condition at the top and never executes if True"
    ],
    "correctIndex": 0,
    "explanation": "Pre-test WHILE loops skip the body completely if the entry condition is initially False; post-test REPEAT...UNTIL loops run the body once before checking the termination condition (stopping when the condition becomes True).",
    "concept": "WHILE...DO = pre-test (0 or more runs, loops while True); REPEAT...UNTIL = post-test (1 or more runs, stops when True)."
  },
  {
    "id": "kcse_comp_m7",
    "subject": "computer",
    "topicId": "comp_prog",
    "difficulty": "medium",
    "question": "A student writes a pseudocode program to compute the average of two marks as AVG = MARK1 + MARK2 / 2 instead of AVG = (MARK1 + MARK2) / 2. The program compiles and runs without crashing, printing wrong answers. Classify this bug.",
    "options": [
      "Syntax error",
      "Runtime overflow error",
      "Logical (semantic) error",
      "Hardware parity error"
    ],
    "correctIndex": 2,
    "explanation": "Because operator precedence divides MARK2 / 2 before adding MARK1, the statement obeys language grammar rules (no syntax error) and does not divide by zero (no runtime crash), but implements flawed math—a logical error, detected via dry running with test data.",
    "concept": "Compilers catch syntax errors; only dry runs, trace tables, and test cases uncover logical errors."
  },
  {
    "id": "kcse_comp_m8",
    "subject": "computer",
    "topicId": "comp_net",
    "difficulty": "medium",
    "question": "When a hospital replaces a manual patient-records system with a computerized system, why is \"Parallel Changeover\" safer than \"Direct (Straight) Changeover\"?",
    "options": [
      "Both the old manual system and the new computerized system run concurrently for a trial period so outputs can be cross-verified and operations continue safely if the new system fails",
      "Direct changeover runs in one small ward first before expanding",
      "Parallel changeover eliminates duplicate data-entry workload",
      "Parallel changeover is the cheapest and fastest method because old staff are dismissed overnight"
    ],
    "correctIndex": 0,
    "explanation": "Parallel running operates old and new systems side by side until the new system is proven accurate—minimising catastrophic risk in mission-critical environments like hospitals or banks (at the cost of temporary double workload). Running in one branch/ward first is Pilot changeover.",
    "concept": "System changeover strategies: Direct (cheapest, highest risk), Parallel (safest, costliest double work), Phased (module by module), Pilot (one branch/site first)."
  },
  {
    "id": "kcse_comp_m9",
    "subject": "computer",
    "topicId": "comp_net",
    "difficulty": "medium",
    "question": "Compare \"Real-Time Processing\" (such as Kenya Airways seat reservation or ICU patient monitoring) with \"Batch Processing\" (such as monthly payroll generation).",
    "options": [
      "Payroll systems fail if salaries are not calculated every 2 milliseconds",
      "Batch processing updates airline seats within milliseconds of each customer click",
      "Real-time processing processes transactions immediately upon input to provide instant feedback that updates master files before the next event, whereas batch processing accumulates transactions over a period and processes them together",
      "Real-time processing requires punching paper cards for end-of-month sorting"
    ],
    "correctIndex": 2,
    "explanation": "An airline booking system must lock and update seat availability instantaneously so two agents in Nairobi and Mombasa cannot sell the exact same seat; monthly payroll has no need for millisecond updates and is efficiently processed in a scheduled batch.",
    "concept": "Choose Real-Time when immediate feedback/master-file currency is critical; choose Batch for periodic high-volume routine jobs (payroll, utility billing)."
  },
  {
    "id": "kcse_comp_m10",
    "subject": "computer",
    "topicId": "comp_sys",
    "difficulty": "medium",
    "question": "Why does adding High-Speed Cache Memory (L1/L2/L3 SRAM) between the CPU registers and main DRAM significantly boost system performance?",
    "options": [
      "Cache converts analogue telephone signals into digital packets",
      "Cache permanently replaces the hard disk when power is switched off",
      "Cache cools the processor fan during graphics rendering",
      "Cache stores frequently accessed instructions and data on ultra-fast static RAM right on the processor die, reducing CPU idle wait states caused by slower main RAM access"
    ],
    "correctIndex": 3,
    "explanation": "CPU clock speeds far exceed main DRAM access speeds (the von Neumann bottleneck). Fast SRAM cache exploits locality of reference so ~90%+ of memory fetches hit cache without waiting on external RAM buses.",
    "concept": "Memory speed hierarchy (fastest/costliest per byte downward): CPU Registers -> Cache (SRAM) -> Main RAM (DRAM) -> SSD/Magnetic Disk."
  },
  {
    "id": "kcse_comp_d1",
    "subject": "computer",
    "topicId": "comp_num",
    "difficulty": "difficult",
    "question": "Convert the fractional binary number 1101.101_2 into its exact decimal (base 10) equivalent.",
    "options": [
      "13.75_10",
      "13.625_10",
      "11.625_10",
      "13.5_10"
    ],
    "correctIndex": 1,
    "explanation": "Integer part 1101_2 = 8 + 4 + 0 + 1 = 13. Fractional place weights to the right of the binary point are 2^-1 (0.5), 2^-2 (0.25), and 2^-3 (0.125): (1 x 0.5) + (0 x 0.25) + (1 x 0.125) = 0.5 + 0.125 = 0.625. Total = 13.625_10.",
    "concept": "Fractional binary weights right of the radix point are 1/2 (0.5), 1/4 (0.25), 1/8 (0.125), 1/16 (0.0625)."
  },
  {
    "id": "kcse_comp_d2",
    "subject": "computer",
    "topicId": "comp_num",
    "difficulty": "difficult",
    "question": "Using 8-bit Two's Complement arithmetic, evaluate 23_10 - 35_10 and state the 8-bit binary result.",
    "options": [
      "10001100_2",
      "11110100_2",
      "00001100_2",
      "11110011_2"
    ],
    "correctIndex": 1,
    "explanation": "+23_10 = 00010111_2. For -35_10: +35 = 00100011_2 -> Ones' complement = 11011100_2 -> Add 1 = 11011101_2. Now add 00010111 + 11011101 = 11110100_2 (no carry out). Verify: -128 + 64 + 32 + 16 + 4 = -128 + 116 = -12_10!",
    "concept": "In Two's Complement subtraction A - B = A + (2's complement of B); any 9th carry-out bit when positive > negative is discarded (whereas in Ones' Complement it is added end-around)."
  },
  {
    "id": "kcse_comp_d3",
    "subject": "computer",
    "topicId": "comp_prog",
    "difficulty": "difficult",
    "question": "Dry-run the following pseudocode and state the exact output printed:\nSET S = 0\nSET K = 1\nWHILE K <= 7 DO\n  S = S + K\n  K = K + 2\nENDWHILE\nPRINT S, K",
    "options": [
      "9, 7",
      "16, 9",
      "25, 9",
      "16, 7"
    ],
    "correctIndex": 1,
    "explanation": "Trace each pass: Pass 1 (K=1<=7): S=0+1=1, K=3. Pass 2 (K=3<=7): S=1+3=4, K=5. Pass 3 (K=5<=7): S=4+5=9, K=7. Pass 4 (K=7<=7): S=9+7=16, K=9. Next check: K=9 <= 7 is False -> loop exits and prints S = 16, K = 9!",
    "concept": "In dry-run trace tables, always check the final increment of the loop counter K that caused the WHILE condition to fail (K reaches 9, not 7!)."
  },
  {
    "id": "kcse_comp_d4",
    "subject": "computer",
    "topicId": "comp_app",
    "difficulty": "difficult",
    "question": "In a KCSE mark-sheet spreadsheet, cell E4 holds a student's score and the grading rules are: >=75 is \"A\", 60 to 74 is \"B\", 45 to 59 is \"C\", otherwise \"D\". Which nested IF formula in cell F4 is syntactically and logically valid?",
    "options": [
      "=IF(75<=E4,\"A\") + IF(60<=E4,\"B\",\"D\")",
      "=IF(E4>=75,\"A\",IF(E4>=60,\"B\",IF(E4>=45,\"C\",\"D\")))",
      "=IF(E4>=45,\"C\",IF(E4>=60,\"B\",IF(E4>=75,\"A\",\"D\")))",
      "=IF(E4>=75=\"A\",E4>=60=\"B\",E4>=45=\"C\",\"D\")"
    ],
    "correctIndex": 1,
    "explanation": "Nested IF statements evaluate conditions strictly left-to-right and stop at the FIRST True branch! Testing E4>=45 first (distractor 2) would wrongly award grade \"C\" to a student scoring 90! Descending thresholds (>=75, then >=60, then >=45, else \"D\") work accurately.",
    "concept": "Always order nested IF thresholds monotonically (highest-to-lowest with >=, or lowest-to-highest with <) so an earlier looser test never masks higher bands."
  },
  {
    "id": "kcse_comp_d5",
    "subject": "computer",
    "topicId": "comp_app",
    "difficulty": "difficult",
    "question": "In relational database normalisation, what anomaly is eliminated when moving a table from Second Normal Form (2NF) to Third Normal Form (3NF)?",
    "options": [
      "Use of Primary Keys in parent tables",
      "Transitive dependency — where a non-key attribute depends on another non-key attribute rather than solely on the Primary Key (e.g., AdmNo -> HouseCode -> HousePatronName)",
      "Ability to run SQL SELECT queries across two tables",
      "Repeating multi-valued groups within a single cell (eliminated in 1NF)"
    ],
    "correctIndex": 1,
    "explanation": "1NF removes repeating groups/non-atomic fields; 2NF removes partial dependencies on composite primary keys; 3NF removes transitive dependencies (non-key -> non-key), preventing update/deletion anomalies (such as losing a House Patron's details if the last student in that house transfers).",
    "concept": "Normalisation summary: 1NF = atomic values; 2NF = no partial key dependency; 3NF = no transitive non-key dependency (\"the key, the whole key, and nothing but the key\")."
  },
  {
    "id": "kcse_comp_d6",
    "subject": "computer",
    "topicId": "comp_net",
    "difficulty": "difficult",
    "question": "In the 7-layer ISO Open Systems Interconnection (OSI) reference model, at which layers do a Network Switch (using MAC addresses) and a Router (using logical IP addresses for inter-network path determination) operate respectively?",
    "options": [
      "Switch: Layer 4 (Transport Layer); Router: Layer 2 (Data Link Layer)",
      "Switch: Layer 2 (Data Link Layer); Router: Layer 3 (Network Layer)",
      "Switch: Layer 1 (Physical Layer); Router: Layer 7 (Application Layer)",
      "Both operate exclusively at Layer 1 (Physical Layer) like a passive hub"
    ],
    "correctIndex": 1,
    "explanation": "A passive hub/repeater regenerates raw bits at Layer 1 (Physical); a Layer 2 Switch reads hardware MAC addresses inside frames (Data Link Layer); a Router inspects logical IP packet headers to route traffic between separate networks at Layer 3 (Network Layer).",
    "concept": "OSI device mapping: Hub/Repeater = Layer 1 (Physical); Bridge/Switch = Layer 2 (Data Link, MAC); Router = Layer 3 (Network, IP); Gateway = up to Layer 7."
  },
  {
    "id": "kcse_comp_d7",
    "subject": "computer",
    "topicId": "comp_sys",
    "difficulty": "difficult",
    "question": "In Operating System resource management, what term describes the permanent standstill where Process A holds the Printer while waiting for the Scanner held by Process B, and Process B simultaneously waits for the Printer held by Process A?",
    "options": [
      "Thrashing (disk paging)",
      "Deadlock",
      "Time-slicing",
      "Spooling"
    ],
    "correctIndex": 1,
    "explanation": "Circular wait over mutually exclusive, non-preemptible resources locks both processes indefinitely—a Deadlock. Spooling queues print jobs onto disk buffer so the fast CPU is not held up by a slow printer; Thrashing is excessive virtual-memory page swapping.",
    "concept": "Distinguish OS terms: Deadlock (mutual resource standoff), Spooling (peripheral print buffering), Interrupt (hardware/software attention signal), Thrashing (excessive virtual memory swapping)."
  },
  {
    "id": "kcse_comp_d8",
    "subject": "computer",
    "topicId": "comp_net",
    "difficulty": "difficult",
    "question": "During the Feasibility Study stage of the Systems Development Life Cycle (SDLC), which specific feasibility dimension evaluates whether benefits/savings of the proposed system will outweigh its total development and running costs (Cost-Benefit Analysis)?",
    "options": [
      "Technical feasibility",
      "Economic feasibility",
      "Operational feasibility",
      "Schedule feasibility"
    ],
    "correctIndex": 1,
    "explanation": "Four classic SDLC feasibility pillars: Technical (is required hardware/software technology available?), Operational (will staff/users accept and run it smoothly?), Schedule (can it be delivered within deadline?), and Economic (is it cost-effective with positive ROI?).",
    "concept": "Feasibility pillars in KNEC 451: Technical, Economic (Cost-Benefit), Operational (user readiness), and Schedule (timeframe)."
  },
  {
    "id": "kcse_comp_d9",
    "subject": "computer",
    "topicId": "comp_net",
    "difficulty": "difficult",
    "question": "Compare \"Baseband\" and \"Broadband\" signal transmission across communication channels.",
    "options": [
      "Baseband transmits hundreds of cable TV channels simultaneously on different frequencies, whereas Broadband carries one Morse code pulse per hour",
      "Baseband transmits a single digital signal occupying the entire bandwidth of the medium (using time-division multiplexing), whereas Broadband transmits multiple analogue/modulated signals simultaneously over different frequency channels (frequency-division multiplexing)",
      "Broadband cannot use coaxial or fibre-optic media",
      "Baseband works only over satellite microwaves in space"
    ],
    "correctIndex": 1,
    "explanation": "Baseband (such as standard Ethernet LAN frames) puts digital voltage/light pulses directly onto the medium using its full bandwidth at a given instant; Broadband splits the medium into multiple non-overlapping frequency bands so voice, video, and data travel concurrently.",
    "concept": "Baseband = bidirectional digital signal using full channel bandwidth (TDM); Broadband = unidirectional/split multi-frequency analogue carrier channels (FDM)."
  },
  {
    "id": "kcse_comp_d10",
    "subject": "computer",
    "topicId": "comp_prog",
    "difficulty": "difficult",
    "question": "Why does Object-Oriented Programming (OOP) enforce \"Encapsulation\" by declaring internal class attributes private and exposing controlled public getter/setter methods?",
    "options": [
      "To bundle data and methods together while hiding internal state from accidental or unauthorized direct modification by external code (data hiding)",
      "To allow a subclass to inherit attributes from a parent superclass",
      "To translate Python code directly into Assembly mnemonics",
      "To let different classes respond differently to the same method name"
    ],
    "correctIndex": 0,
    "explanation": "OOP's three core pillars are distinct: Encapsulation bundles state + behaviour and restricts direct external tampering (data hiding); Inheritance derives child classes from base classes; Polymorphism lets one method interface behave contextually across types.",
    "concept": "Keep OOP pillars distinct: Encapsulation (bundling + data hiding), Inheritance (code reuse via parent-child classes), Polymorphism (many forms of a method)."
  }
];

  var DIFFICULTY_LABELS = {
    easy: 'Easy',
    medium: 'Medium',
    difficult: 'Difficult'
  };

  var DIFFICULTY_DESCRIPTIONS = {
    easy: 'Form 1-2 foundational concepts, definitions, grammar rules, and direct single-step calculations.',
    medium: 'Form 2-3 applied problem solving, quantitative stoichiometry, circuits, mapwork, and double-entry accounting.',
    difficult: 'Form 3-4 multi-step synthesis, calculus/3D geometry, electrolysis, constitutional law, and exam traps.'
  };

  var sessionCounter = 0;
  var clearConfirmArmed = false;

  var currentSession = {
    clusterId: 'medicine',
    selectedSubjects: ['biology', 'chemistry', 'mathematics', 'english'],
    difficulty: 'medium',
    mode: 'daily_quiz', // 'daily_quiz' | 'weakness_practice'
    targetWeakKeys: [], // array of 'subject::topicId'
    questions: [],
    currentIndex: 0,
    userAnswers: {}, // { qId: { selectedIndex: number, confirmed: boolean } }
    startedAt: null
  };

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getTodaySeed() {
    var now = new Date();
    var y = now.getFullYear();
    var m = String(now.getMonth() + 1).padStart(2, '0');
    var d = String(now.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
  }

  function seededRandomGenerator(seedStr) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < seedStr.length; i++) {
      h ^= seedStr.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return function () {
      h += 0x6D2B79F5;
      var t = Math.imul(h ^ (h >>> 15), 1 | h);
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffleArray(arr, rng) {
    var copy = arr.slice();
    var rand = rng || Math.random;
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(rand() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function mapKuccpsLabelToSubject(labelText, fallbackIdx, presetSubjects) {
    var txt = String(labelText || '').toLowerCase();
    if (txt.indexOf('math') !== -1) return 'mathematics';
    if (txt.indexOf('phys') !== -1) return 'physics';
    if (txt.indexOf('biol') !== -1) return 'biology';
    if (txt.indexOf('chem') !== -1) return 'chemistry';
    if (txt.indexOf('engl') !== -1) return 'english';
    if (txt.indexOf('kisw') !== -1) return 'kiswahili';
    if (txt.indexOf('hist') !== -1) return 'history';
    if (txt.indexOf('geog') !== -1) return 'geography';
    if (txt.indexOf('busi') !== -1 || txt.indexOf('comm') !== -1 || txt.indexOf('econ') !== -1) return 'business';
    if (txt.indexOf('comp') !== -1) return 'computer';
    return (presetSubjects && presetSubjects[fallbackIdx]) || 'mathematics';
  }

  function pointsToKcseGrade(pts) {
    var map = { 12: 'A', 11: 'A-', 10: 'B+', 9: 'B', 8: 'B-', 7: 'C+', 6: 'C', 5: 'C-', 4: 'D+', 3: 'D', 2: 'D-', 1: 'E' };
    return map[pts] || String(pts);
  }

  // Detect host page context (KCSE Mean Grade Calculator vs KUCCPS Cluster Points Calculator)
  function detectCalculatorContext() {
    var kcseForm = document.getElementById('kcseForm');
    var kuccpsForm = document.getElementById('kuccpsForm');

    if (kuccpsForm) {
      var clusterEl = document.getElementById('cluster');
      var wcpEl = document.getElementById('wcpValue');
      var resultsEl = document.getElementById('results');
      var clusterVal = clusterEl && clusterEl.value ? clusterEl.value : 'medicine';
      var wcpText = wcpEl ? wcpEl.textContent.trim() : '';
      var hasWcp = Boolean(
        resultsEl && resultsEl.classList.contains('visible') &&
        wcpText && wcpText !== '—' && wcpText !== '-' && !isNaN(parseFloat(wcpText))
      );
      var preset = KUCCPS_CLUSTERS[clusterVal] || KUCCPS_CLUSTERS.medicine;

      var lowestSub = null;
      for (var i = 1; i <= 4; i++) {
        var subSel = document.getElementById('sub' + i);
        var lblEl = document.getElementById('lblSub' + i);
        if (subSel && subSel.value !== '') {
          var pts = parseInt(subSel.value, 10);
          if (!isNaN(pts)) {
            var mappedSubj = mapKuccpsLabelToSubject(lblEl ? lblEl.textContent : '', i - 1, preset.subjects);
            if (!lowestSub || pts < lowestSub.pts) {
              lowestSub = {
                subj: mappedSubj,
                pts: pts,
                grade: pointsToKcseGrade(pts),
                name: SUBJECTS[mappedSubj] ? SUBJECTS[mappedSubj].shortName : 'Mathematics'
              };
            }
          }
        }
      }

      var hasAny = hasWcp || Boolean(lowestSub);
      var recSubj = lowestSub ? lowestSub.subj : (preset.subjects[0] || 'mathematics');
      var recDiff = lowestSub ? (lowestSub.pts <= 6 ? 'easy' : (lowestSub.pts <= 9 ? 'medium' : 'difficult')) : null;
      var summary = 'Choose a KCSE subject below to start a 10-question practice quiz.';
      if (hasWcp && lowestSub) {
        summary = 'Your cluster score is ' + wcpText + ', with ' + lowestSub.name + ' (' + lowestSub.grade + ') as your lowest prerequisite. We recommend practising ' + lowestSub.name + ', or choose another subject below.';
      } else if (hasWcp) {
        var firstSubName = SUBJECTS[recSubj] ? SUBJECTS[recSubj].shortName : 'Mathematics';
        summary = 'Your cluster score is ' + wcpText + '. We recommend practising ' + firstSubName + ', or choose another subject below.';
      } else if (lowestSub) {
        summary = lowestSub.name + ' (' + lowestSub.grade + ') is currently your lowest prerequisite grade. We recommend practising ' + lowestSub.name + ', or choose another subject below.';
      }

      return {
        pageType: 'kuccps',
        clusterId: KUCCPS_CLUSTERS[clusterVal] ? clusterVal : 'medicine',
        clusterLabel: preset.label,
        subjects: preset.subjects.slice(),
        recommendedSubject: hasAny ? recSubj : null,
        recommendedDifficulty: recDiff,
        hasCalculatedResult: hasAny,
        summaryText: summary
      };
    }

    if (kcseForm) {
      var fieldMap = [
        { id: 'subMaths', subj: 'mathematics' },
        { id: 'subEnglish', subj: 'english' },
        { id: 'subKiswahili', subj: 'kiswahili' },
        { id: 'subBiology', subj: 'biology' },
        { id: 'subChemistry', subj: 'chemistry' },
        { id: 'subPhysics', subj: 'physics' },
        { id: 'subHistory', subj: 'history' },
        { id: 'subGeography', subj: 'geography' },
        { id: 'subApplied', subj: 'business' }
      ];
      var detected = [];
      var lowestKcse = null;
      fieldMap.forEach(function (m) {
        var el = document.getElementById(m.id);
        if (el && el.value !== '') {
          detected.push(m.subj);
          var pts = parseInt(el.value, 10);
          if (!isNaN(pts) && (!lowestKcse || pts < lowestKcse.pts)) {
            lowestKcse = {
              subj: m.subj,
              pts: pts,
              grade: pointsToKcseGrade(pts),
              name: SUBJECTS[m.subj] ? SUBJECTS[m.subj].shortName : m.subj
            };
          }
        }
      });

      var meanEl = document.getElementById('meanGradeValue');
      var resEl = document.getElementById('results');
      var meanText = meanEl ? meanEl.textContent.trim() : '';
      var hasGrade = Boolean(resEl && resEl.classList.contains('visible') && meanText && meanText !== '—' && meanText !== '-');
      var hasInputs = hasGrade || detected.length > 0;

      var activeSubjs = detected.length > 0
        ? detected
        : ['mathematics'];

      var kcseSummary = 'Choose a KCSE subject below to start a 10-question practice quiz.';
      if (hasGrade && lowestKcse) {
        kcseSummary = 'Your KCSE mean grade is ' + meanText + ', with ' + lowestKcse.name + ' (' + lowestKcse.grade + ') as your lowest subject. We recommend practising ' + lowestKcse.name + ', or choose another subject below.';
      } else if (lowestKcse) {
        kcseSummary = lowestKcse.name + ' (' + lowestKcse.grade + ') is your lowest entered grade. We recommend practising ' + lowestKcse.name + ', or choose another subject below.';
      }

      return {
        pageType: 'kcse',
        clusterId: 'custom',
        clusterLabel: 'Single Subject',
        subjects: activeSubjs,
        recommendedSubject: lowestKcse ? lowestKcse.subj : null,
        recommendedDifficulty: lowestKcse ? (lowestKcse.pts <= 6 ? 'easy' : (lowestKcse.pts <= 9 ? 'medium' : 'difficult')) : null,
        hasCalculatedResult: hasInputs,
        summaryText: kcseSummary
      };
    }

    return {
      pageType: 'general',
      clusterId: 'custom',
      clusterLabel: 'Single Subject',
      subjects: ['mathematics'],
      recommendedSubject: null,
      recommendedDifficulty: null,
      hasCalculatedResult: false,
      summaryText: 'Choose a KCSE subject below to start a 10-question practice quiz.'
    };
  }

  // LocalStorage helpers
  function getQuizHistory() {
    try {
      var raw = localStorage.getItem(STORAGE_HISTORY_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveQuizAttempt(record) {
    try {
      var history = getQuizHistory();
      history.unshift(record);
      if (history.length > 25) history = history.slice(0, 25);
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {}
  }

  function clearQuizHistory() {
    try {
      localStorage.removeItem(STORAGE_HISTORY_KEY);
      localStorage.removeItem(STORAGE_SEEN_KEY);
    } catch (e) {}
  }

  function getSeenMap() {
    try {
      var raw = localStorage.getItem(STORAGE_SEEN_KEY);
      var parsed = raw ? JSON.parse(raw) : {};
      return (parsed && typeof parsed === 'object') ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function getSeenIdsForSubject(subjectId) {
    var map = getSeenMap();
    return Array.isArray(map[subjectId]) ? map[subjectId] : [];
  }

  function markQuestionsSeen(questionsList) {
    try {
      var map = getSeenMap();
      questionsList.forEach(function (q) {
        var list = Array.isArray(map[q.subject]) ? map[q.subject] : [];
        var idx = list.indexOf(q.id);
        if (idx !== -1) list.splice(idx, 1);
        list.push(q.id);
        // Keep most recent 24 seen per subject (out of 30) so unseen items always rotate cleanly
        if (list.length > 24) {
          list = list.slice(list.length - 24);
        }
        map[q.subject] = list;
      });
      localStorage.setItem(STORAGE_SEEN_KEY, JSON.stringify(map));
    } catch (e) {}
  }

  // Core 10-question generator: balanced across selected subjects & topics, strict difficulty priority, zero session duplicates
  function generateSessionQuestions(subjectIds, difficulty, mode, targetWeakKeys) {
    var validSubjects = (subjectIds || []).filter(function (s) { return Boolean(SUBJECTS[s]); });
    if (validSubjects.length === 0) {
      validSubjects = ['mathematics', 'english', 'biology', 'chemistry'];
    }

    sessionCounter += 1;
    var rng = seededRandomGenerator(getTodaySeed() + '::' + sessionCounter + '::' + validSubjects.join(',') + '::' + difficulty + '::' + (mode || 'daily'));

    var seenLookup = {};
    validSubjects.forEach(function (sId) {
      getSeenIdsForSubject(sId).forEach(function (qId) {
        seenLookup[qId] = true;
      });
    });

    var subjectPool = QUESTIONS.filter(function (q) {
      return validSubjects.indexOf(q.subject) !== -1;
    });

    // Build ordered priority tiers so exact difficulty + unseen ALWAYS comes first
    var tiers = [];
    if (mode === 'weakness_practice' && Array.isArray(targetWeakKeys) && targetWeakKeys.length > 0) {
      var weakSet = {};
      targetWeakKeys.forEach(function (k) { weakSet[k] = true; });

      tiers.push(shuffleArray(subjectPool.filter(function (q) {
        return weakSet[q.subject + '::' + q.topicId] && q.difficulty === difficulty && !seenLookup[q.id];
      }), rng));
      tiers.push(shuffleArray(subjectPool.filter(function (q) {
        return weakSet[q.subject + '::' + q.topicId] && !seenLookup[q.id] && q.difficulty !== difficulty;
      }), rng));
      tiers.push(shuffleArray(subjectPool.filter(function (q) {
        return weakSet[q.subject + '::' + q.topicId] && q.difficulty === difficulty && seenLookup[q.id];
      }), rng));
      tiers.push(shuffleArray(subjectPool.filter(function (q) {
        return weakSet[q.subject + '::' + q.topicId] && seenLookup[q.id] && q.difficulty !== difficulty;
      }), rng));
    }

    // Standard daily quiz tiers (also fallback if weakness topics had <10 items)
    tiers.push(shuffleArray(subjectPool.filter(function (q) {
      return q.difficulty === difficulty && !seenLookup[q.id];
    }), rng));
    tiers.push(shuffleArray(subjectPool.filter(function (q) {
      return q.difficulty === difficulty && seenLookup[q.id];
    }), rng));
    tiers.push(shuffleArray(subjectPool.filter(function (q) {
      return q.difficulty !== difficulty && !seenLookup[q.id];
    }), rng));
    tiers.push(shuffleArray(subjectPool.filter(function (q) {
      return q.difficulty !== difficulty && seenLookup[q.id];
    }), rng));

    var orderedCandidates = [];
    var seenCandidate = {};
    tiers.forEach(function (tierList) {
      tierList.forEach(function (q) {
        if (!seenCandidate[q.id]) {
          seenCandidate[q.id] = true;
          orderedCandidates.push(q);
        }
      });
    });

    // Organize by subject -> topic buckets for balanced round-robin coverage across subjects and topics
    var subjectTopicQueues = {};
    var shuffledSubjects = shuffleArray(validSubjects, rng);
    shuffledSubjects.forEach(function (sId) {
      var topicKeys = shuffleArray(Object.keys(SUBJECTS[sId].topics), rng);
      subjectTopicQueues[sId] = {
        topicOrder: topicKeys,
        topicCursor: 0,
        byTopic: {}
      };
      topicKeys.forEach(function (tId) {
        subjectTopicQueues[sId].byTopic[tId] = [];
      });
    });

    // First try filling strictly from exact-difficulty candidates when in daily_quiz mode
    var primaryCandidates = (mode === 'weakness_practice' && targetWeakKeys && targetWeakKeys.length > 0)
      ? orderedCandidates
      : orderedCandidates.filter(function (q) { return q.difficulty === difficulty; });

    primaryCandidates.forEach(function (q) {
      var sq = subjectTopicQueues[q.subject];
      if (sq && sq.byTopic[q.topicId]) {
        sq.byTopic[q.topicId].push(q);
      }
    });

    var selected = [];
    var selectedMap = {};

    // Round-robin across selected subjects, rotating through distinct syllabus topics within each subject
    var safety = 0;
    while (selected.length < QUESTIONS_PER_SESSION && safety < 40) {
      var addedAny = false;
      for (var sIdx = 0; sIdx < shuffledSubjects.length; sIdx++) {
        if (selected.length >= QUESTIONS_PER_SESSION) break;
        var sKey = shuffledSubjects[sIdx];
        var sqObj = subjectTopicQueues[sKey];
        var tLen = sqObj.topicOrder.length;
        for (var attempts = 0; attempts < tLen; attempts++) {
          var tKey = sqObj.topicOrder[(sqObj.topicCursor + attempts) % tLen];
          var bucket = sqObj.byTopic[tKey];
          while (bucket.length > 0 && selectedMap[bucket[0].id]) {
            bucket.shift();
          }
          if (bucket.length > 0) {
            var picked = bucket.shift();
            selected.push(picked);
            selectedMap[picked.id] = true;
            sqObj.topicCursor = (sqObj.topicCursor + attempts + 1) % tLen;
            addedAny = true;
            break;
          }
        }
      }
      if (!addedAny) break;
      safety++;
    }

    // Fallback fill if needed (e.g. narrow single-topic weakness drill)
    for (var c = 0; c < orderedCandidates.length && selected.length < QUESTIONS_PER_SESSION; c++) {
      var cand = orderedCandidates[c];
      if (!selectedMap[cand.id]) {
        selected.push(cand);
        selectedMap[cand.id] = true;
      }
    }

    markQuestionsSeen(selected);
    return selected.slice(0, QUESTIONS_PER_SESSION);
  }

  function injectQuizStyles() {
    if (document.getElementById('afriKcseQuizStyles')) return;
    var style = document.createElement('style');
    style.id = 'afriKcseQuizStyles';
    style.textContent = [
      '#wIntroView .w-intro-top-bar{display:flex;align-items:center;justify-content:space-between;gap:.75rem;margin-bottom:.75rem}',
      '#wIntroView .w-intro-heading{font-size:1.125rem;font-weight:800;color:#000;margin:0;letter-spacing:-.01em}',
      '#wIntroView .w-intro-rec{font-size:.9375rem;line-height:1.5;color:#171717;background:#fafafa;border:1px solid #e5e5e5;border-radius:.5rem;padding:.75rem .875rem;margin:0 0 1rem 0}',
      '#wIntroView .w-intro-field{margin-bottom:.875rem}',
      '#wIntroView .w-intro-row-two{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:.875rem}',
      '@media (max-width:479px){#wIntroView .w-intro-row-two{grid-template-columns:1fr}}',
      '#wIntroView .w-intro-label{display:block;font-size:.8125rem;font-weight:700;color:#171717;margin-bottom:.35rem}',
      '#wIntroView .w-intro-diff-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem}',
      '#wIntroView .w-intro-diff-btn{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:.5rem .5rem;background:#fff;color:#171717;border:1.5px solid #d4d4d4;border-radius:.5rem;font-size:.875rem;font-weight:700;cursor:pointer;transition:border-color .15s ease,background .15s ease,color .15s ease}',
      '#wIntroView .w-intro-diff-btn:hover{border-color:#000}',
      '#wIntroView .w-intro-diff-btn.active{background:#000;border-color:#000;color:#facc15}',
      '#wIntroView .w-intro-start-btn{width:100%;min-height:48px;margin-top:.25rem;padding:.75rem 1.25rem;background:#facc15;color:#000;border:1.5px solid #facc15;border-radius:.5rem;font-size:.9375rem;font-weight:800;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:background .15s ease,border-color .15s ease}',
      '#wIntroView .w-intro-start-btn:hover{background:#fde047;border-color:#fde047;color:#000}',
      '.kcse-quiz-action-row{display:flex;flex-direction:column;gap:.75rem;margin-top:1.5rem}',
      '@media (min-width:640px){.kcse-quiz-action-row{flex-direction:row;align-items:stretch}}',
      '.kcse-quiz-action-row .btn-primary{flex:1;margin-top:0!important}',
      '.btn-secondary{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;padding:.75rem 1.25rem;background:#fff;color:#000;border:1px solid #d4d4d4;font-weight:700;font-size:.9375rem;border-radius:.5rem;min-height:46px;cursor:pointer;transition:background .15s ease,border-color .15s ease,color .15s ease}',
      '.btn-secondary:hover:not(:disabled){background:#fafafa;border-color:#000;color:#000}',
      '.btn-secondary:disabled{opacity:.45;cursor:not-allowed}',
      '.btn-find-weakness{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;background:#fff;color:#000;border:1px solid #000;font-weight:800;font-size:.9375rem;border-radius:.5rem;padding:.875rem 1.25rem;min-height:52px;cursor:pointer;transition:background .15s ease,color .15s ease}',
      '.btn-find-weakness:hover{background:#000;color:#facc15}',
      '.btn-find-weakness svg{color:#ca8a04;flex-shrink:0;transition:color .15s ease}',
      '.btn-find-weakness:hover svg{color:#facc15}',
      '.btn-find-weakness:focus-visible,.btn-secondary:focus-visible,.kcse-subj-btn:focus-visible,.kcse-diff-btn:focus-visible,.kcse-preset-link:focus-visible,.w-option-item:focus-visible{outline:2px solid #000;outline-offset:2px;box-shadow:0 0 0 4px rgba(250,204,21,.45)}',
      '.weakness-banner-card{margin-top:1.5rem;padding:1.25rem 1.5rem;background:#ffffff;color:#111827;border-radius:.875rem;border:1px solid #e5e7eb;display:flex;flex-direction:column;gap:1rem;box-shadow:0 1px 3px rgba(0,0,0,.04)}',
      '@media (min-width:640px){.weakness-banner-card{flex-direction:row;align-items:center;justify-content:space-between;padding:1.25rem 1.75rem;gap:1.5rem}}',
      '.w-banner-content{flex:1}',
      '.w-banner-badge,.w-banner-kicker{display:none}',
      '.w-banner-title{font-size:1.0625rem;font-weight:700;color:#111827;margin:0 0 .25rem 0;letter-spacing:-.01em}',
      '.w-banner-desc{font-size:.875rem;color:#4b5563;line-height:1.5;margin:0}',
      '.weakness-banner-card .w-banner-btn,.w-banner-btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;background:#ffffff;color:#000000;border:1px solid #000000;font-weight:700;font-size:.9375rem;border-radius:.5rem;padding:.875rem 1.5rem;min-height:50px;cursor:pointer;white-space:nowrap;transition:background .15s ease,transform .1s ease;flex-shrink:0}',
      '.weakness-banner-card .w-banner-btn:hover,.w-banner-btn:hover{background:#f9fafb;color:#000000;border-color:#000000}',
      '.weakness-banner-card .w-banner-btn:active,.w-banner-btn:active{transform:scale(.99)}',
      '.weakness-banner-card .w-banner-btn svg,.w-banner-btn svg{width:1.125rem;height:1.125rem;stroke:#f59e0b;color:#f59e0b;flex-shrink:0}',
      '.weakness-banner-card .w-banner-btn:hover svg,.w-banner-btn:hover svg{stroke:#f59e0b;color:#f59e0b}',
      '@media (max-width:639px){.weakness-banner-card .w-banner-btn,.w-banner-btn{width:100%}}',
      '.weakness-section{margin-top:2rem}',
      '.weakness-card{background:#fff;border:1px solid #e5e5e5;border-radius:.875rem;padding:1.25rem}',
      '@media (min-width:640px){.weakness-card{padding:2rem}}',
      '.w-header{margin-bottom:1.25rem;padding-bottom:1.125rem;border-bottom:1px solid #f5f5f5}',
      '.w-header-top{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem}',
      '.w-eyebrow{display:block;font-size:.6875rem;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:#ca8a04;margin-bottom:.375rem}',
      '.w-title{font-size:1.375rem;font-weight:900;color:#000;letter-spacing:-.02em;margin:0 0 .5rem 0;line-height:1.2}',
      '@media (min-width:640px){.w-title{font-size:1.625rem}}',
      '.w-subtitle{font-size:.9375rem;color:#404040;line-height:1.6;margin:0}',
      '.w-close-icon-btn{display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;border:1px solid #e5e5e5;border-radius:.5rem;background:#fff;color:#404040;font-size:1.25rem;font-weight:700;cursor:pointer;flex-shrink:0;transition:border-color .15s,color .15s}',
      '.w-close-icon-btn:hover{border-color:#000;color:#000}',
      '.w-context-box{background:#fafafa;border:1px solid #e5e5e5;border-radius:.625rem;padding:.875rem 1rem;margin-bottom:1.25rem;font-size:.8125rem;color:#262626;line-height:1.55}',
      '.w-context-box strong{color:#000;font-weight:800}',
      '.w-config-block{margin-bottom:1.375rem}',
      '.w-label-row{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:.5rem;margin-bottom:.5rem}',
      '.w-field-label{font-size:.8125rem;font-weight:800;color:#000}',
      '.w-field-meta{font-size:.75rem;color:#525252}',
      '.w-preset-links{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:.625rem}',
      '.kcse-preset-link{font-size:.75rem;font-weight:700;color:#262626;background:#f5f5f5;border:1px solid #e5e5e5;border-radius:.375rem;padding:.5rem .75rem;min-height:44px;cursor:pointer;transition:background .15s,color .15s,border-color .15s}',
      '.kcse-preset-link:hover{background:#000;color:#fde047;border-color:#000}',
      '.kcse-subj-grid{display:grid;grid-template-columns:1fr;gap:.5rem}',
      '@media (min-width:480px){.kcse-subj-grid{grid-template-columns:1fr 1fr}}',
      '@media (min-width:768px){.kcse-subj-grid{grid-template-columns:repeat(2,1fr)}}',
      '.kcse-subj-btn{display:flex;align-items:center;justify-content:space-between;gap:.625rem;width:100%;min-height:46px;padding:.625rem .875rem;background:#fff;border:1px solid #d4d4d4;border-radius:.5rem;text-align:left;cursor:pointer;transition:border-color .15s,background .15s}',
      '.kcse-subj-btn:hover{border-color:#000;background:#fafafa}',
      '.kcse-subj-btn.active{background:#fefce8;border-color:#000}',
      '.kcse-subj-left{display:flex;align-items:center;gap:.625rem;min-width:0}',
      '.kcse-subj-check{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:.25rem;border:1.5px solid #a3a3a3;background:#fff;color:transparent;flex-shrink:0;transition:all .15s}',
      '.kcse-subj-btn.active .kcse-subj-check{background:#000;border-color:#000;color:#facc15}',
      '.kcse-subj-name{font-size:.875rem;font-weight:700;color:#000;line-height:1.25}',
      '.kcse-subj-group{font-size:.6875rem;color:#525252;white-space:nowrap}',
      '.kcse-diff-grid{display:grid;grid-template-columns:1fr;gap:.5rem}',
      '@media (min-width:640px){.kcse-diff-grid{grid-template-columns:repeat(3,1fr)}}',
      '.kcse-diff-btn{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding:.75rem 1rem;min-height:56px;background:#fff;border:1px solid #d4d4d4;border-radius:.5rem;text-align:left;cursor:pointer;transition:border-color .15s,background .15s}',
      '.kcse-diff-btn:hover{border-color:#000;background:#fafafa}',
      '.kcse-diff-btn.active{background:#000;border-color:#000;color:#fff}',
      '.kcse-diff-title{font-size:.875rem;font-weight:800;color:#000;margin-bottom:.125rem}',
      '.kcse-diff-btn.active .kcse-diff-title{color:#fde047}',
      '.kcse-diff-sub{font-size:.75rem;color:#525252;line-height:1.35}',
      '.kcse-diff-btn.active .kcse-diff-sub{color:#e5e5e5}',
      '.w-meta-line{font-size:.8125rem;color:#404040;margin:1rem 0 1.25rem;line-height:1.5}',
      '.w-btn-row{display:flex;flex-direction:column;gap:.75rem}',
      '@media (min-width:640px){.w-btn-row{flex-direction:row;align-items:center}}',
      '.w-btn-row .btn-primary{margin-top:0!important;flex:1}',
      '.w-quiz-top{margin-bottom:1.25rem}',
      '.w-quiz-meta-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.5rem;font-size:.8125rem;color:#404040;margin-bottom:.625rem}',
      '.w-quiz-meta-left{font-weight:700;color:#000}',
      '.w-quiz-meta-right{font-weight:700;color:#000}',
      '.w-progress-track{width:100%;height:6px;background:#e5e5e5;border-radius:999px;overflow:hidden}',
      '.w-progress-fill{height:100%;background:#facc15;transition:width .25s ease}',
      '.w-question-box{margin-bottom:1.25rem}',
      '.w-question-kicker{font-size:.75rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#ca8a04;display:block;margin-bottom:.5rem}',
      '.w-question-title{font-size:1.0625rem;font-weight:800;color:#000;line-height:1.55;margin:0 0 1.125rem 0;white-space:pre-line}',
      '@media (min-width:640px){.w-question-title{font-size:1.125rem}}',
      '.w-options-grid{display:flex;flex-direction:column;gap:.625rem}',
      '.w-option-item{display:flex;align-items:flex-start;gap:.875rem;width:100%;min-height:52px;padding:.875rem 1rem;background:#fff;border:1.5px solid #d4d4d4;border-radius:.625rem;text-align:left;cursor:pointer;transition:border-color .15s,background .15s}',
      '.w-option-item:hover:not(.locked){border-color:#000;background:#fafafa}',
      '.w-option-item.selected:not(.locked){border-color:#000;background:#fefce8}',
      '.w-option-letter{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:.375rem;background:#f5f5f5;color:#000;font-weight:800;font-size:.8125rem;flex-shrink:0;margin-top:1px}',
      '.w-option-item.selected:not(.locked) .w-option-letter{background:#000;color:#facc15}',
      '.w-option-item.correct{border-color:#16a34a;background:#f0fdf4}',
      '.w-option-item.correct .w-option-letter{background:#16a34a;color:#fff}',
      '.w-option-item.incorrect{border-color:#dc2626;background:#fef2f2}',
      '.w-option-item.incorrect .w-option-letter{background:#dc2626;color:#fff}',
      '.w-option-item.locked{cursor:default}',
      '.w-option-text{font-size:.9375rem;color:#000;line-height:1.5;font-weight:600;padding-top:2px}',
      '.w-validation-alert{padding:.75rem 1rem;background:#fef2f2;border:1px solid #fecaca;color:#991b1b;font-weight:700;font-size:.8125rem;border-radius:.5rem;margin-top:.875rem}',
      '.w-feedback-card{margin-top:1.125rem;border-radius:.75rem;padding:1.125rem 1.25rem;border:1px solid #e5e5e5;background:#fafafa}',
      '.w-feedback-card.correct{background:#f0fdf4;border-color:#bbf7d0}',
      '.w-feedback-card.incorrect{background:#fef2f2;border-color:#fecaca}',
      '.w-feedback-status{display:flex;align-items:center;gap:.45rem;font-size:.8125rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.5rem}',
      '.w-feedback-status.correct{color:#166534}',
      '.w-feedback-status.incorrect{color:#991b1b}',
      '.w-feedback-ans{font-size:.875rem;color:#000;margin:0 0 .625rem 0;line-height:1.5}',
      '.w-feedback-exp{font-size:.875rem;color:#171717;line-height:1.6;margin:0 0 .75rem 0}',
      '.w-concept-box{background:#fff;border:1px solid #e5e5e5;border-radius:.5rem;padding:.75rem .875rem}',
      '.w-concept-label{font-size:.6875rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#ca8a04;display:block;margin-bottom:.25rem}',
      '.w-concept-text{font-size:.8125rem;color:#171717;line-height:1.55;margin:0}',
      '.w-quiz-nav{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.75rem;margin-top:1.25rem;padding-top:1rem;border-top:1px solid #f5f5f5}',
      '.w-quiz-nav .btn-primary{width:auto;min-width:190px;margin-top:0!important;padding:.875rem 1.375rem;min-height:46px}',
      '@media (max-width:639px){.w-quiz-nav .btn-primary,.w-quiz-nav .btn-secondary{width:100%}}',
      '.w-results-hero{background:#000000;color:#ffffff;border:1px solid #262626;border-radius:.875rem;padding:1.5rem;margin-bottom:1.25rem;display:flex;flex-direction:column;gap:1rem}',
      '@media (min-width:640px){.w-results-hero{flex-direction:row;align-items:center;gap:1.5rem;padding:1.75rem}}',
      '.w-results-score-big{font-size:2.75rem;font-weight:900;line-height:1;color:#fde047}',
      '@media (min-width:640px){.w-results-score-big{font-size:3.25rem}}',
      '.w-score-headline{font-size:1.125rem;font-weight:800;color:#ffffff;margin:0 0 .25rem 0}',
      '.w-score-sub{font-size:.875rem;color:#d4d4d4;margin:0;line-height:1.5}',
      '.w-comp-card{padding:.875rem 1rem;border:1px solid #e5e5e5;border-radius:.625rem;background:#fafafa;margin-bottom:1.25rem;font-size:.8125rem;color:#262626;line-height:1.55}',
      '.w-comp-card strong{color:#000}',
      '.w-analysis-grid{display:grid;grid-template-columns:1fr;gap:1rem;margin-bottom:1.5rem}',
      '@media (min-width:640px){.w-analysis-grid{grid-template-columns:1fr 1fr}}',
      '.w-analysis-card{padding:1.125rem;border-radius:.75rem;border:1px solid #e5e5e5;background:#fff}',
      '.w-analysis-head{display:flex;align-items:center;gap:.5rem;margin-bottom:.75rem}',
      '.w-analysis-head h4{font-size:.9375rem;font-weight:800;color:#000;margin:0}',
      '.w-topic-list{display:flex;flex-direction:column;gap:.5rem}',
      '.w-topic-row{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.5rem 0;border-bottom:1px solid #f5f5f5;font-size:.8125rem}',
      '.w-topic-row:last-child{border-bottom:none}',
      '.w-topic-name{color:#000;font-weight:600;line-height:1.4}',
      '.w-topic-name span{display:block;font-size:.6875rem;color:#525252;font-weight:500}',
      '.w-topic-stat-strong{font-weight:800;color:#166534;white-space:nowrap}',
      '.w-topic-stat-weak{font-weight:800;color:#991b1b;white-space:nowrap}',
      '.w-empty-note{font-size:.8125rem;color:#525252;line-height:1.5;margin:0}',
      '.w-study-section{margin-bottom:1.5rem;padding:1.25rem;background:#fafafa;border:1px solid #e5e5e5;border-radius:.75rem}',
      '.w-study-title{font-size:1rem;font-weight:800;color:#000;margin:0 0 .25rem 0}',
      '.w-study-sub{font-size:.8125rem;color:#525252;margin:0 0 1rem 0}',
      '.w-tip-card{padding:.875rem 1rem;background:#fff;border:1px solid #e5e5e5;border-radius:.5rem;margin-bottom:.625rem}',
      '.w-tip-card:last-child{margin-bottom:0}',
      '.w-tip-card strong{display:block;font-size:.8125rem;color:#000;margin-bottom:.25rem}',
      '.w-tip-card p{font-size:.8125rem;color:#262626;line-height:1.55;margin:0}',
      '.w-practice-cta{padding:1.25rem 1.5rem;background:#000000;color:#ffffff;border:1px solid #262626;border-radius:.875rem;display:flex;flex-direction:column;gap:1rem;margin-bottom:1.5rem}',
      '@media (min-width:640px){.w-practice-cta{flex-direction:row;align-items:center;justify-content:space-between}}',
      '.w-practice-cta h4{font-size:1rem;font-weight:800;color:#ffffff;margin:0 0 .25rem 0}',
      '.w-practice-cta p{font-size:.8125rem;color:#d4d4d4;margin:0;line-height:1.5}',
      '.w-practice-btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;padding:.875rem 1.25rem;min-height:46px;background:#facc15;color:#000000;font-weight:800;font-size:.875rem;border-radius:.5rem;border:none;cursor:pointer;white-space:nowrap;transition:background .15s}',
      '.w-practice-btn:hover{background:#fde047}',
      '.w-review-section{margin-bottom:1.5rem}',
      '.w-review-title{font-size:1rem;font-weight:800;color:#000;margin:0 0 .25rem 0}',
      '.w-review-sub{font-size:.8125rem;color:#525252;margin:0 0 1rem 0}',
      '.w-review-list{display:flex;flex-direction:column;gap:.75rem}',
      '.w-review-item{padding:1rem;border:1px solid #e5e5e5;border-radius:.625rem;background:#fff}',
      '.w-review-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.5rem;font-size:.75rem;margin-bottom:.5rem}',
      '.w-review-meta{font-weight:700;color:#525252}',
      '.w-review-verdict-ok{font-weight:800;color:#166534}',
      '.w-review-verdict-err{font-weight:800;color:#991b1b}',
      '.w-review-q{font-size:.9375rem;font-weight:700;color:#000;line-height:1.5;margin:0 0 .625rem 0;white-space:pre-line}',
      '.w-review-ans{font-size:.8125rem;color:#171717;margin:0 0 .5rem 0;line-height:1.5}',
      '.w-review-exp{font-size:.8125rem;color:#262626;line-height:1.55;margin:0 0 .5rem 0}',
      '.w-history-section{padding-top:1.25rem;border-top:1px solid #e5e5e5;margin-bottom:1.25rem}',
      '.w-history-head{display:flex;align-items:center;justify-content:space-between;gap:.75rem;margin-bottom:.75rem}',
      '.w-history-title{font-size:.9375rem;font-weight:800;color:#000;margin:0}',
      '.w-clear-btn{background:none;border:1px solid transparent;color:#525252;font-size:.75rem;font-weight:700;text-decoration:underline;cursor:pointer;padding:.5rem .625rem;min-height:44px;border-radius:.375rem}',
      '.w-clear-btn:hover{color:#991b1b}',
      '.w-clear-btn.armed{background:#fef2f2;border-color:#fecaca;color:#991b1b;text-decoration:none}',
      '.w-hist-row{display:flex;flex-direction:column;gap:.25rem;padding:.75rem .875rem;border:1px solid #f5f5f5;background:#fafafa;border-radius:.5rem;margin-bottom:.5rem;font-size:.8125rem}',
      '@media (min-width:640px){.w-hist-row{flex-direction:row;align-items:center;justify-content:space-between}}',
      '.w-results-footer{display:flex;flex-direction:column;gap:.75rem}',
      '@media (min-width:640px){.w-results-footer{flex-direction:row;flex-wrap:wrap}}',
      '.w-results-footer .btn-primary{margin-top:0!important;flex:1}',
      '.w-disclaimer-note{margin-top:1.25rem;padding-top:1rem;border-top:1px solid #f5f5f5;font-size:.75rem;color:#525252;line-height:1.55}',
      '#weaknessAssessmentSection{scroll-margin-top:5rem;overflow-anchor:none}',
      '#weaknessAssessmentSection *{overflow-anchor:none}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function getScrollY() {
    return window.pageYOffset !== undefined
      ? window.pageYOffset
      : document.documentElement.scrollTop || 0;
  }

  function setScrollYInstant(y) {
    var htmlEl = document.documentElement;
    var prevBehavior = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = 'auto';
    window.scrollTo(0, Math.max(0, Math.round(y)));
    htmlEl.style.scrollBehavior = prevBehavior;
  }

  function smoothScrollToY(y) {
    var target = Math.max(0, Math.round(y));
    if (Math.abs(target - getScrollY()) <= 4) return;
    try {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } catch (e) {
      window.scrollTo(0, target);
    }
  }

  function getStickyHeaderOffset() {
    var navInner = document.querySelector('.site-nav .nav-inner');
    var nav = document.querySelector('.site-nav');
    var navH = 64;
    var el = navInner || nav;
    if (el && typeof el.getBoundingClientRect === 'function') {
      var h = el.getBoundingClientRect().height;
      if (h > 0) navH = h;
    }
    var pad = window.innerWidth && window.innerWidth < 640 ? 12 : 16;
    return Math.round(navH + pad);
  }

  function blurActiveQuizControl() {
    var active = document.activeElement;
    var sec = document.getElementById('weaknessAssessmentSection');
    if (active && sec && sec.contains(active) && typeof active.blur === 'function') {
      active.blur();
    }
  }

  function scrollWeaknessSectionIntoView(targetEl) {
    var el = targetEl || document.getElementById('weaknessAssessmentSection');
    if (!el || typeof el.getBoundingClientRect !== 'function') return;
    var card = el.querySelector('.weakness-card') || el;
    var rect = card.getBoundingClientRect();
    var targetY = getScrollY() + rect.top - getStickyHeaderOffset();
    smoothScrollToY(targetY);
  }

  function ensureQuizQuestionVisible() {
    var section = document.getElementById('weaknessAssessmentSection');
    var quizView = document.getElementById('wQuizView');
    if (!section || !quizView || quizView.style.display === 'none') return;

    var card = section.querySelector('.weakness-card') || quizView;
    var questionBox = quizView.querySelector('.w-question-box') || quizView;
    var optionsBox = document.getElementById('wOptionsContainer') || questionBox;

    var offset = getStickyHeaderOffset();
    var viewportH = window.innerHeight || document.documentElement.clientHeight || 700;
    var curScrollY = getScrollY();

    var cardRect = card.getBoundingClientRect();
    var quizRect = quizView.getBoundingClientRect();
    var qBoxRect = questionBox.getBoundingClientRect();
    var optRect = optionsBox.getBoundingClientRect();

    var topClear = quizRect.top >= offset - 8;
    var nearTop = qBoxRect.top <= Math.max(offset + 140, Math.round(viewportH * 0.34));
    var optionsVisible = optRect.bottom <= viewportH - 16;

    if (topClear && nearTop && optionsVisible) {
      return;
    }

    var cardDocTop = curScrollY + cardRect.top;
    var quizDocTop = curScrollY + quizRect.top;
    var qBoxDocTop = curScrollY + qBoxRect.top;
    var optDocBottom = curScrollY + optRect.bottom;

    var targetY = cardDocTop - offset;
    if (optDocBottom - targetY > viewportH - 12) {
      targetY = quizDocTop - offset;
    }
    if (optDocBottom - targetY > viewportH - 12) {
      targetY = qBoxDocTop - offset;
    }

    smoothScrollToY(targetY);
  }

  function revealFeedbackIfNeeded(feedbackEl) {
    if (!feedbackEl || feedbackEl.style.display === 'none') return;
    var viewportH = window.innerHeight || document.documentElement.clientHeight || 700;
    var rect = feedbackEl.getBoundingClientRect();
    if (rect.top > viewportH - 80) {
      var nudge = Math.min(rect.top - (viewportH - 140), 140);
      if (nudge > 8) {
        smoothScrollToY(getScrollY() + nudge);
      }
    }
  }

  function renderClusterOptions(pageType) {
    var compactLabels = {
      custom: 'Single Subject',
      calc_sync: 'Calculator Subjects',
      medicine: 'Medicine & Pharmacy',
      nursing: 'Nursing & Clinical Med.',
      engineering: 'Engineering',
      computing: 'Computing & IT',
      architecture: 'Architecture',
      actuarial: 'Actuarial Science',
      business: 'Business & Economics',
      law: 'Law (LLB)',
      agriculture: 'Agriculture',
      education_science: 'Education (Science)',
      education_arts: 'Education (Arts)',
      media: 'Media & Journalism'
    };
    var order = pageType === 'kcse'
      ? ['custom', 'calc_sync', 'medicine', 'engineering', 'computing', 'actuarial', 'business', 'law', 'architecture', 'nursing', 'agriculture', 'education_science', 'education_arts', 'media']
      : ['custom', 'medicine', 'engineering', 'computing', 'law', 'business', 'architecture', 'nursing', 'actuarial', 'agriculture', 'education_science', 'education_arts', 'media'];

    return order.map(function (cId) {
      var c = KUCCPS_CLUSTERS[cId];
      return '<option value="' + escapeHtml(c.id) + '">' + escapeHtml(compactLabels[c.id] || c.label) + '</option>';
    }).join('');
  }

  function initWeaknessUI() {
    var calcWrap = document.querySelector('.calc-wrap .container-narrow');
    if (!calcWrap) return;
    if (document.getElementById('weaknessAssessmentSection')) return;

    injectQuizStyles();

    var ctx = detectCalculatorContext();
    currentSession.userCustomizedSubject = false;
    currentSession.clusterId = 'custom';
    currentSession.selectedSubjects = [ctx.recommendedSubject || 'mathematics'];

    // 1. Add trigger button inside calculator form without altering existing submit handlers
    var hostForm = document.getElementById('kuccpsForm') || document.getElementById('kcseForm');
    if (hostForm && !document.getElementById('findWeaknessesBtn')) {
      var submitBtn = hostForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        var actionRow = hostForm.querySelector('.action-row, .btn-row, .kcse-quiz-action-row');
        if (!actionRow) {
          actionRow = document.createElement('div');
          actionRow.className = 'kcse-quiz-action-row';
          submitBtn.parentNode.insertBefore(actionRow, submitBtn);
          actionRow.appendChild(submitBtn);
        }
        var findBtn = document.createElement('button');
        findBtn.type = 'button';
        findBtn.id = 'findWeaknessesBtn';
        findBtn.className = 'btn-find-weakness';
        findBtn.innerHTML = [
          '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
          '<span>Daily KCSE Subject Quiz</span>'
        ].join('');
        findBtn.addEventListener('click', function () {
          openWeaknessSection(true);
        });
        actionRow.appendChild(findBtn);
      }
    }

    // 2. Add Results Callout Banner (#weaknessCalloutBanner is positioned automatically by academic-progress.js after #afriShareBar)
    var resultsEl = document.getElementById('results');
    if (resultsEl && !document.getElementById('weaknessCalloutBanner')) {
      var callout = document.createElement('div');
      callout.id = 'weaknessCalloutBanner';
      callout.className = 'weakness-banner-card';
      callout.innerHTML = [
        '<div class="w-banner-content">',
        '  <h3 class="w-banner-title">Diagnose KCSE Subject Weaknesses</h3>',
        '  <p class="w-banner-desc">Practise 10 mixed KNEC syllabus questions across your selected KCSE subjects and target KUCCPS degree cluster with instant concept explanations.</p>',
        '</div>',
        '<button type="button" id="launchWeaknessFromResults" class="btn-secondary btn-find-weakness w-banner-btn">',
        '  <svg width="18" height="18" fill="none" stroke="#f59e0b" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
        '  <span>Find My Weaknesses</span>',
        '</button>'
      ].join('');

      var shareBar = document.getElementById('afriShareBar');
      var compareCard = document.getElementById('compareEntryCard');
      if (compareCard && compareCard.parentNode === resultsEl) {
        resultsEl.insertBefore(callout, compareCard);
      } else if (shareBar && shareBar.parentNode === resultsEl) {
        shareBar.insertAdjacentElement('afterend', callout);
      } else {
        resultsEl.appendChild(callout);
      }

      if (typeof window.afriEnsureResultSectionsOrder === 'function') {
        window.afriEnsureResultSectionsOrder();
      }

      document.getElementById('launchWeaknessFromResults').addEventListener('click', function () {
        openWeaknessSection(true);
      });
    }

    // 3. Create Main Quiz Section inside .calc-wrap .container-narrow
    var section = document.createElement('section');
    section.id = 'weaknessAssessmentSection';
    section.className = 'weakness-section';
    section.style.display = 'none';
    section.setAttribute('aria-live', 'polite');

    section.innerHTML = [
      '<div class="weakness-card">',
      '  <!-- View 1: Subject, Cluster & Difficulty Setup -->',
      '  <div id="wIntroView" class="w-view">',
      '    <div class="w-intro-top-bar">',
      '      <h2 class="w-intro-heading">Practice Quiz</h2>',
      '      <button type="button" id="wCloseIntroBtn" class="w-close-icon-btn" aria-label="Close quiz">&times;</button>',
      '    </div>',
      '    <p id="wContextNotice" class="w-intro-rec"></p>',
      '    <div class="w-intro-row-two">',
      '      <div>',
      '        <label class="w-intro-label" for="wSubjectSelect">Subject</label>',
      '        <select id="wSubjectSelect" class="form-select"></select>',
      '      </div>',
      '      <div>',
      '        <label class="w-intro-label" for="wClusterSelect">Cluster (Optional)</label>',
      '        <select id="wClusterSelect" class="form-select">' + renderClusterOptions(ctx.pageType) + '</select>',
      '      </div>',
      '    </div>',
      '    <div class="w-intro-field">',
      '      <span class="w-intro-label" id="wDiffGroupLabel">Difficulty</span>',
      '      <div id="wDifficultyGrid" class="w-intro-diff-grid" role="radiogroup" aria-labelledby="wDiffGroupLabel">',
      '        <button type="button" class="w-intro-diff-btn" data-diff="easy" role="radio" aria-checked="false">Easy</button>',
      '        <button type="button" class="w-intro-diff-btn active" data-diff="medium" role="radio" aria-checked="true">Medium</button>',
      '        <button type="button" class="w-intro-diff-btn" data-diff="difficult" role="radio" aria-checked="false">Difficult</button>',
      '      </div>',
      '    </div>',
      '    <button type="button" id="wStartQuizBtn" class="w-intro-start-btn">Start Quiz</button>',
      '  </div>',

      '  <!-- View 2: Active 10-Question Session -->',
      '  <div id="wQuizView" class="w-view" style="display:none;">',
      '    <div class="w-quiz-top">',
      '      <div class="w-quiz-meta-bar">',
      '        <span id="wQuizMetaLeft" class="w-quiz-meta-left">Mathematics &middot; Medium</span>',
      '        <span id="wQuizMetaRight" class="w-quiz-meta-right">Question 1 of 10 &middot; Score: 0 / 0</span>',
      '      </div>',
      '      <div class="w-progress-track">',
      '        <div id="wProgressBar" class="w-progress-fill" style="width:10%;"></div>',
      '      </div>',
      '    </div>',
      '    <div class="w-question-box">',
      '      <span id="wQuestionKicker" class="w-question-kicker">Subject &middot; Topic</span>',
      '      <h3 id="wQuestionText" class="w-question-title"></h3>',
      '      <div id="wOptionsContainer" class="w-options-grid" role="radiogroup" aria-label="Answer choices"></div>',
      '    </div>',
      '    <div id="wQuizValidation" class="w-validation-alert" style="display:none;">Select one answer option before checking your answer.</div>',
      '    <div id="wFeedbackContainer" style="display:none;"></div>',
      '    <div class="w-quiz-nav">',
      '      <button type="button" id="wPrevBtn" class="btn-secondary" disabled>Previous</button>',
      '      <div style="display:flex;gap:.75rem;flex-wrap:wrap;">',
      '        <button type="button" id="wQuitQuizBtn" class="btn-secondary">Change Subjects</button>',
      '        <button type="button" id="wConfirmBtn" class="btn-primary">Check Answer</button>',
      '        <button type="button" id="wNextBtn" class="btn-primary" style="display:none;">Next Question &rarr;</button>',
      '        <button type="button" id="wFinishBtn" class="btn-primary" style="display:none;">View Quiz Results &rarr;</button>',
      '      </div>',
      '    </div>',
      '  </div>',

      '  <!-- View 3: Results, Strengths, Weaknesses & Study Recommendations -->',
      '  <div id="wResultsView" class="w-view" style="display:none;">',
      '    <div class="w-results-hero">',
      '      <div id="wScoreBig" class="w-results-score-big">0%</div>',
      '      <div>',
      '        <h3 id="wScoreHeadline" class="w-score-headline">KCSE Quiz Summary</h3>',
      '        <p id="wScoreSub" class="w-score-sub">0 of 10 Correct</p>',
      '      </div>',
      '    </div>',
      '    <div id="wComparisonBox" class="w-comp-card"></div>',
      '    <div class="w-analysis-grid">',
      '      <div class="w-analysis-card">',
      '        <div class="w-analysis-head">',
      '          <svg width="18" height="18" fill="none" stroke="#16a34a" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>',
      '          <h4>Demonstrated Strengths</h4>',
      '        </div>',
      '        <div id="wStrongList" class="w-topic-list"></div>',
      '      </div>',
      '      <div class="w-analysis-card">',
      '        <div class="w-analysis-head">',
      '          <svg width="18" height="18" fill="none" stroke="#dc2626" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"/></svg>',
      '          <h4>Topics Needing Improvement</h4>',
      '        </div>',
      '        <div id="wWeakList" class="w-topic-list"></div>',
      '      </div>',
      '    </div>',
      '    <div class="w-study-section">',
      '      <h4 class="w-study-title">Specific KCSE Study Recommendations</h4>',
      '      <p class="w-study-sub">Targeted Form 1-4 KNEC syllabus revision steps based on your session performance.</p>',
      '      <div id="wStudyTipsList"></div>',
      '    </div>',
      '    <div class="w-practice-cta">',
      '      <div>',
      '        <h4 id="wPracticeCtaTitle">Practise Weak Topics With Fresh Questions</h4>',
      '        <p id="wPracticeCtaDesc">Generate a new 10-question session prioritising unseen questions in the topics you missed.</p>',
      '      </div>',
      '      <button type="button" id="wPractiseWeakBtn" class="w-practice-btn">Practise Weak Topics</button>',
      '    </div>',
      '    <div class="w-review-section">',
      '      <h4 class="w-review-title">Full 10-Question Review &amp; Concept Notes</h4>',
      '      <p class="w-review-sub">Every question from this session with verified answers, explanations, and underlying KCSE concepts.</p>',
      '      <div id="wReviewList" class="w-review-list"></div>',
      '    </div>',
      '    <div class="w-history-section">',
      '      <div class="w-history-head">',
      '        <h4 class="w-history-title">Recent Quiz Sessions (This Browser)</h4>',
      '        <button type="button" id="wClearHistoryBtn" class="w-clear-btn">Clear History</button>',
      '      </div>',
      '      <div id="wHistoryList"></div>',
      '    </div>',
      '    <div class="w-results-footer">',
      '      <button type="button" id="wRetakeFreshBtn" class="btn-primary">New Daily Quiz (10 Fresh Questions)</button>',
      '      <button type="button" id="wChangeSetupBtn" class="btn-secondary">Change Subjects / Difficulty</button>',
      '      <button type="button" id="wCloseResultsBtn" class="btn-secondary">Close Quiz</button>',
      '    </div>',
      '    <p class="w-disclaimer-note">Disclaimer: Quiz scores and topic diagnostics are study estimates based on a 10-question sample of KNEC secondary syllabus concepts. They do not predict official KNEC KCSE grades or guarantee KUCCPS university placement.</p>',
      '  </div>',
      '</div>'
    ].join('');

    calcWrap.appendChild(section);

    var clusterSelect = document.getElementById('wClusterSelect');
    if (clusterSelect && KUCCPS_CLUSTERS[currentSession.clusterId]) {
      clusterSelect.value = currentSession.clusterId;
    }

    renderSubjectButtons();
    updateContextNotice();
    bindQuizEvents();
  }

  function renderSubjectButtons() {
    var subjSelect = document.getElementById('wSubjectSelect');
    if (!subjSelect) return;

    var clusterId = currentSession.clusterId;
    var hasMix = clusterId && clusterId !== 'custom';
    var mixList = [];
    if (clusterId === 'calc_sync') {
      mixList = detectCalculatorContext().subjects.slice();
    } else if (KUCCPS_CLUSTERS[clusterId] && Array.isArray(KUCCPS_CLUSTERS[clusterId].subjects)) {
      mixList = KUCCPS_CLUSTERS[clusterId].subjects.slice();
    }

    var html = '';
    if (hasMix && mixList.length > 0) {
      var shortNames = mixList.map(function (id) {
        return SUBJECTS[id] ? SUBJECTS[id].shortName : id;
      }).join(', ');
      html += '<option value="cluster_mix">Cluster Mix (' + escapeHtml(shortNames) + ')</option>';
    }

    html += SUBJECT_ORDER.map(function (sId) {
      var meta = SUBJECTS[sId];
      return '<option value="' + escapeHtml(sId) + '">' + escapeHtml(meta.shortName) + '</option>';
    }).join('');

    subjSelect.innerHTML = html;

    if (hasMix && currentSession.selectedSubjects.length > 1) {
      subjSelect.value = 'cluster_mix';
    } else if (currentSession.selectedSubjects.length > 0 && SUBJECTS[currentSession.selectedSubjects[0]]) {
      subjSelect.value = currentSession.selectedSubjects[0];
    } else {
      subjSelect.value = 'mathematics';
      currentSession.selectedSubjects = ['mathematics'];
    }
  }

  function setDifficultyUI(diff) {
    if (!DIFFICULTY_LABELS[diff]) return;
    currentSession.difficulty = diff;
    var grid = document.getElementById('wDifficultyGrid');
    if (grid) {
      Array.prototype.forEach.call(grid.querySelectorAll('[data-diff]'), function (btn) {
        var active = btn.getAttribute('data-diff') === diff;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-checked', active ? 'true' : 'false');
      });
    }
  }

  function updateContextNotice() {
    var box = document.getElementById('wContextNotice');
    if (!box) return;
    var ctx = detectCalculatorContext();
    box.textContent = ctx.summaryText;
  }

  function renderHistoryPreview() {}

  function bindQuizEvents() {
    var clusterSelect = document.getElementById('wClusterSelect');
    var subjSelect = document.getElementById('wSubjectSelect');

    if (clusterSelect) {
      clusterSelect.addEventListener('change', function () {
        currentSession.userCustomizedSubject = true;
        var val = clusterSelect.value || 'custom';
        currentSession.clusterId = val;
        if (val === 'calc_sync') {
          var ctx = detectCalculatorContext();
          currentSession.selectedSubjects = ctx.subjects.slice();
        } else if (val !== 'custom' && KUCCPS_CLUSTERS[val]) {
          currentSession.selectedSubjects = KUCCPS_CLUSTERS[val].subjects.slice();
        } else {
          var single = (subjSelect && SUBJECTS[subjSelect.value]) ? subjSelect.value : 'mathematics';
          currentSession.selectedSubjects = [single];
        }
        renderSubjectButtons();
      });
    }

    if (subjSelect) {
      subjSelect.addEventListener('change', function () {
        currentSession.userCustomizedSubject = true;
        var val = subjSelect.value;
        if (val === 'cluster_mix') {
          if (currentSession.clusterId === 'calc_sync') {
            currentSession.selectedSubjects = detectCalculatorContext().subjects.slice();
          } else if (KUCCPS_CLUSTERS[currentSession.clusterId]) {
            currentSession.selectedSubjects = KUCCPS_CLUSTERS[currentSession.clusterId].subjects.slice();
          }
        } else if (SUBJECTS[val]) {
          currentSession.selectedSubjects = [val];
        }
      });
    }

    Array.prototype.forEach.call(document.querySelectorAll('#wDifficultyGrid [data-diff]'), function (btn) {
      btn.addEventListener('click', function () {
        setDifficultyUI(btn.getAttribute('data-diff'));
      });
    });

    document.getElementById('wStartQuizBtn').addEventListener('click', function () {
      if (!currentSession.selectedSubjects || currentSession.selectedSubjects.length === 0) {
        currentSession.selectedSubjects = ['mathematics'];
      }
      startSession('daily_quiz', []);
    });

    document.getElementById('wCloseIntroBtn').addEventListener('click', closeWeaknessSection);
    document.getElementById('wCloseResultsBtn').addEventListener('click', closeWeaknessSection);

    document.getElementById('wQuitQuizBtn').addEventListener('click', function () {
      blurActiveQuizControl();
      switchView('wIntroView');
      updateContextNotice();
      scrollWeaknessSectionIntoView();
    });

    document.getElementById('wPrevBtn').addEventListener('click', function () {
      if (currentSession.currentIndex > 0) {
        blurActiveQuizControl();
        currentSession.currentIndex -= 1;
        renderActiveQuestion();
        ensureQuizQuestionVisible();
      }
    });

    document.getElementById('wConfirmBtn').addEventListener('click', confirmActiveAnswer);

    document.getElementById('wNextBtn').addEventListener('click', function () {
      if (currentSession.currentIndex < currentSession.questions.length - 1) {
        blurActiveQuizControl();
        currentSession.currentIndex += 1;
        renderActiveQuestion();
        ensureQuizQuestionVisible();
      }
    });

    document.getElementById('wFinishBtn').addEventListener('click', function () {
      blurActiveQuizControl();
      evaluateAndRenderResults();
    });

    document.getElementById('wPractiseWeakBtn').addEventListener('click', function () {
      startSession('weakness_practice', currentSession.targetWeakKeys.slice());
    });

    document.getElementById('wRetakeFreshBtn').addEventListener('click', function () {
      startSession('daily_quiz', []);
    });

    document.getElementById('wChangeSetupBtn').addEventListener('click', function () {
      blurActiveQuizControl();
      switchView('wIntroView');
      updateContextNotice();
      renderHistoryPreview();
      scrollWeaknessSectionIntoView();
    });

    var clearBtn = document.getElementById('wClearHistoryBtn');
    clearBtn.addEventListener('click', function () {
      if (!clearConfirmArmed) {
        clearConfirmArmed = true;
        clearBtn.textContent = 'Confirm Clear History';
        clearBtn.classList.add('armed');
        return;
      }
      clearConfirmArmed = false;
      clearBtn.textContent = 'Clear History';
      clearBtn.classList.remove('armed');
      clearQuizHistory();
      renderHistoryList();
      renderHistoryPreview();
    });

    // Non-invasive listeners on host calculator so context refreshes when user updates grades/cluster
    var hostCluster = document.getElementById('cluster');
    if (hostCluster) {
      hostCluster.addEventListener('change', function () {
        if (currentSession.clusterId !== 'custom') {
          var newVal = hostCluster.value;
          if (KUCCPS_CLUSTERS[newVal]) {
            currentSession.clusterId = newVal;
            currentSession.selectedSubjects = KUCCPS_CLUSTERS[newVal].subjects.slice();
            var cSel = document.getElementById('wClusterSelect');
            if (cSel) cSel.value = newVal;
            renderSubjectButtons();
          }
        }
        updateContextNotice();
      });
    }

    var hostForm = document.getElementById('kuccpsForm') || document.getElementById('kcseForm');
    if (hostForm) {
      hostForm.addEventListener('submit', function () {
        setTimeout(updateContextNotice, 60);
      });
    }
  }

  function openWeaknessSection(syncFromCalc) {
    var section = document.getElementById('weaknessAssessmentSection');
    if (!section) return;

    var ctx = detectCalculatorContext();
    if (syncFromCalc || !currentSession.userCustomizedSubject) {
      if (ctx.hasCalculatedResult && ctx.recommendedSubject && SUBJECTS[ctx.recommendedSubject]) {
        currentSession.clusterId = 'custom';
        currentSession.selectedSubjects = [ctx.recommendedSubject];
        var cSel = document.getElementById('wClusterSelect');
        if (cSel) cSel.value = 'custom';
        if (ctx.recommendedDifficulty && DIFFICULTY_LABELS[ctx.recommendedDifficulty]) {
          setDifficultyUI(ctx.recommendedDifficulty);
        }
      }
    }

    renderSubjectButtons();
    section.style.display = 'block';
    updateContextNotice();
    switchView('wIntroView');

    setTimeout(function () {
      scrollWeaknessSectionIntoView(section);
    }, 40);
  }

  function closeWeaknessSection() {
    var section = document.getElementById('weaknessAssessmentSection');
    if (section) section.style.display = 'none';
  }

  function switchView(viewId) {
    ['wIntroView', 'wQuizView', 'wResultsView'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.style.display = (id === viewId) ? 'block' : 'none';
    });
  }

  function getRunningTallies() {
    var answered = 0;
    var correct = 0;
    currentSession.questions.forEach(function (q) {
      var st = currentSession.userAnswers[q.id];
      if (st && st.confirmed) {
        answered += 1;
        if (st.selectedIndex === q.correctIndex) correct += 1;
      }
    });
    return { answered: answered, correct: correct };
  }

  function formatSelectedSubjectsSummary(subjectIds) {
    var names = subjectIds.map(function (sId) {
      return SUBJECTS[sId] ? SUBJECTS[sId].shortName : sId;
    });
    if (names.length <= 4) return names.join(', ');
    return names.slice(0, 3).join(', ') + ' +' + (names.length - 3) + ' more';
  }

  function startSession(mode, targetWeakKeys) {
    var questions = generateSessionQuestions(
      currentSession.selectedSubjects,
      currentSession.difficulty,
      mode,
      targetWeakKeys
    );
    if (!questions || questions.length === 0) return;

    currentSession.mode = mode;
    currentSession.targetWeakKeys = targetWeakKeys || [];
    currentSession.questions = questions;
    currentSession.currentIndex = 0;
    currentSession.userAnswers = {};
    currentSession.startedAt = Date.now();

    blurActiveQuizControl();
    switchView('wQuizView');
    renderActiveQuestion();

    var section = document.getElementById('weaknessAssessmentSection');
    if (section) scrollWeaknessSectionIntoView(section);
  }

  function renderActiveQuestion() {
    var q = currentSession.questions[currentSession.currentIndex];
    if (!q) return;

    var savedScrollY = getScrollY();

    var subjMeta = SUBJECTS[q.subject] || { name: q.subject, shortName: q.subject, topics: {} };
    var topicMeta = subjMeta.topics[q.topicId] || { name: 'KCSE Topic' };
    var tallies = getRunningTallies();

    var modePrefix = currentSession.mode === 'weakness_practice' ? 'Weakness Drill · ' : '';
    document.getElementById('wQuizMetaLeft').textContent =
      modePrefix + formatSelectedSubjectsSummary(currentSession.selectedSubjects) + ' · ' + (DIFFICULTY_LABELS[currentSession.difficulty] || currentSession.difficulty);
    document.getElementById('wQuizMetaRight').textContent =
      'Question ' + (currentSession.currentIndex + 1) + ' of ' + currentSession.questions.length +
      ' · Score: ' + tallies.correct + ' / ' + tallies.answered;

    var pct = Math.round(((currentSession.currentIndex + 1) / currentSession.questions.length) * 100);
    document.getElementById('wProgressBar').style.width = pct + '%';

    document.getElementById('wQuestionKicker').textContent =
      subjMeta.name + ' · ' + topicMeta.name + ' · ' + (DIFFICULTY_LABELS[q.difficulty] || q.difficulty);
    document.getElementById('wQuestionText').textContent = q.question;

    var state = currentSession.userAnswers[q.id] || { selectedIndex: undefined, confirmed: false };
    var isConfirmed = Boolean(state.confirmed);
    var selectedIdx = state.selectedIndex;

    var optionsContainer = document.getElementById('wOptionsContainer');
    optionsContainer.innerHTML = '';

    q.options.forEach(function (optText, idx) {
      var letter = String.fromCharCode(65 + idx);
      var btn = document.createElement('button');
      btn.type = 'button';

      var classes = ['w-option-item'];
      if (selectedIdx === idx) classes.push('selected');
      if (isConfirmed) {
        classes.push('locked');
        if (idx === q.correctIndex) {
          classes.push('correct');
        } else if (selectedIdx === idx && idx !== q.correctIndex) {
          classes.push('incorrect');
        }
      }

      btn.className = classes.join(' ');
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', selectedIdx === idx ? 'true' : 'false');
      if (isConfirmed) btn.setAttribute('aria-disabled', 'true');

      btn.innerHTML = [
        '<span class="w-option-letter">' + letter + '</span>',
        '<span class="w-option-text">' + escapeHtml(optText) + '</span>'
      ].join('');

      btn.addEventListener('click', function (e) {
        if (isConfirmed) return;
        var fromKeyboard = Boolean(e && e.detail === 0);
        currentSession.userAnswers[q.id] = {
          selectedIndex: idx,
          confirmed: false
        };
        document.getElementById('wQuizValidation').style.display = 'none';
        renderActiveQuestion();
        if (fromKeyboard && optionsContainer) {
          var refreshed = optionsContainer.children[idx];
          if (refreshed && typeof refreshed.focus === 'function') {
            refreshed.focus({ preventScroll: true });
          }
        }
      });

      optionsContainer.appendChild(btn);
    });

    var feedbackEl = document.getElementById('wFeedbackContainer');
    if (isConfirmed) {
      var isCorrect = selectedIdx === q.correctIndex;
      var correctLetter = String.fromCharCode(65 + q.correctIndex);
      var chosenLetter = selectedIdx !== undefined ? String.fromCharCode(65 + selectedIdx) : '';

      feedbackEl.className = 'w-feedback-card ' + (isCorrect ? 'correct' : 'incorrect');
      feedbackEl.innerHTML = [
        '<div class="w-feedback-status ' + (isCorrect ? 'correct' : 'incorrect') + '">',
        isCorrect
          ? '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span>Correct Answer</span>'
          : '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span>Incorrect</span>',
        '</div>',
        isCorrect
          ? '<p class="w-feedback-ans">Verified Answer: <strong>' + correctLetter + '. ' + escapeHtml(q.options[q.correctIndex]) + '</strong></p>'
          : '<p class="w-feedback-ans">You chose <strong>' + chosenLetter + '. ' + escapeHtml(q.options[selectedIdx]) + '</strong> &middot; Correct Answer: <strong>' + correctLetter + '. ' + escapeHtml(q.options[q.correctIndex]) + '</strong></p>',
        '<p class="w-feedback-exp"><strong>Why:</strong> ' + escapeHtml(q.explanation) + '</p>',
        '<div class="w-concept-box">',
        '  <span class="w-concept-label">KCSE Concept Takeaway (' + escapeHtml(subjMeta.shortName) + ')</span>',
        '  <p class="w-concept-text">' + escapeHtml(q.concept) + '</p>',
        '</div>'
      ].join('');
      feedbackEl.style.display = 'block';
    } else {
      feedbackEl.style.display = 'none';
      feedbackEl.innerHTML = '';
    }

    var prevBtn = document.getElementById('wPrevBtn');
    var confirmBtn = document.getElementById('wConfirmBtn');
    var nextBtn = document.getElementById('wNextBtn');
    var finishBtn = document.getElementById('wFinishBtn');

    prevBtn.disabled = currentSession.currentIndex === 0;
    document.getElementById('wQuizValidation').style.display = 'none';

    if (!isConfirmed) {
      confirmBtn.style.display = 'inline-flex';
      nextBtn.style.display = 'none';
      finishBtn.style.display = 'none';
    } else {
      confirmBtn.style.display = 'none';
      if (currentSession.currentIndex === currentSession.questions.length - 1) {
        nextBtn.style.display = 'none';
        finishBtn.style.display = 'inline-flex';
      } else {
        nextBtn.style.display = 'inline-flex';
        finishBtn.style.display = 'none';
      }
    }

    if (Math.abs(getScrollY() - savedScrollY) > 1) {
      setScrollYInstant(savedScrollY);
    }
  }

  function confirmActiveAnswer() {
    var q = currentSession.questions[currentSession.currentIndex];
    if (!q) return;
    var state = currentSession.userAnswers[q.id];
    if (!state || state.selectedIndex === undefined) {
      document.getElementById('wQuizValidation').style.display = 'block';
      return;
    }
    blurActiveQuizControl();
    state.confirmed = true;
    renderActiveQuestion();
    revealFeedbackIfNeeded(document.getElementById('wFeedbackContainer'));
  }

  function evaluateAndRenderResults() {
    var correctCount = 0;
    var topicMap = {}; // key: 'subject::topicId'

    currentSession.questions.forEach(function (q) {
      var ans = currentSession.userAnswers[q.id];
      var selectedIdx = ans ? ans.selectedIndex : undefined;
      var isCorrect = selectedIdx === q.correctIndex;
      if (isCorrect) correctCount += 1;

      var key = q.subject + '::' + q.topicId;
      if (!topicMap[key]) {
        var sMeta = SUBJECTS[q.subject] || { name: q.subject, shortName: q.subject, topics: {} };
        var tMeta = sMeta.topics[q.topicId] || { name: q.topicId, shortName: q.topicId, studyTip: '' };
        topicMap[key] = {
          key: key,
          subjectId: q.subject,
          subjectName: sMeta.shortName,
          topicId: q.topicId,
          topicName: tMeta.name,
          shortName: tMeta.shortName,
          studyTip: tMeta.studyTip || '',
          total: 0,
          correct: 0
        };
      }
      topicMap[key].total += 1;
      if (isCorrect) topicMap[key].correct += 1;
    });

    var totalQ = currentSession.questions.length;
    var pct = Math.round((correctCount / totalQ) * 100);

    var strongTopics = [];
    var weakTopics = [];

    Object.keys(topicMap).forEach(function (k) {
      var item = topicMap[k];
      item.percentage = Math.round((item.correct / item.total) * 100);
      if (item.percentage >= 75) {
        strongTopics.push(item);
      } else {
        weakTopics.push(item);
      }
    });

    strongTopics.sort(function (a, b) { return b.percentage - a.percentage; });
    weakTopics.sort(function (a, b) { return a.percentage - b.percentage; });

    currentSession.targetWeakKeys = weakTopics.map(function (w) { return w.key; });

    var history = getQuizHistory();
    var prevAttempt = history.length > 0 ? history[0] : null;
    var delta = prevAttempt ? (pct - prevAttempt.percentage) : null;

    var subjectsSummary = formatSelectedSubjectsSummary(currentSession.selectedSubjects);
    var record = {
      id: 'kcse_quiz_' + Date.now(),
      timestamp: Date.now(),
      dateFormatted: new Date().toLocaleDateString('en-KE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      clusterId: currentSession.clusterId,
      selectedSubjects: currentSession.selectedSubjects.slice(),
      subjectsSummary: subjectsSummary,
      difficulty: currentSession.difficulty,
      mode: currentSession.mode,
      score: correctCount,
      total: totalQ,
      percentage: pct,
      weakTopics: weakTopics.map(function (w) { return w.subjectName + ': ' + w.shortName; }),
      delta: delta
    };

    saveQuizAttempt(record);
    renderResultsScreen(record, strongTopics, weakTopics);
  }

  function renderResultsScreen(record, strongTopics, weakTopics) {
    switchView('wResultsView');
    clearConfirmArmed = false;
    var clearBtn = document.getElementById('wClearHistoryBtn');
    if (clearBtn) {
      clearBtn.textContent = 'Clear History';
      clearBtn.classList.remove('armed');
    }

    document.getElementById('wScoreBig').textContent = record.percentage + '%';

    var headline = '';
    if (record.percentage >= 80) {
      headline = 'Strong KCSE Mastery (A / A- Trajectory)';
    } else if (record.percentage >= 60) {
      headline = 'Solid Credit Mastery (B+ / B / C+ Band) — Refine Missed Topics';
    } else if (record.percentage >= 40) {
      headline = 'Developing Foundation — Targeted KNEC Topic Revision Needed';
    } else {
      headline = 'Priority Revision Needed — Rebuild Core Form 1-4 Concepts';
    }
    document.getElementById('wScoreHeadline').textContent = headline;
    document.getElementById('wScoreSub').textContent =
      record.score + ' / ' + record.total + ' Correct · ' +
      record.subjectsSummary + ' · ' +
      (DIFFICULTY_LABELS[record.difficulty] || record.difficulty) + ' Difficulty';

    var compBox = document.getElementById('wComparisonBox');
    if (record.delta === null || record.delta === undefined) {
      compBox.innerHTML = '<strong>Baseline Session Saved:</strong> Your score of <strong>' + record.percentage + '%</strong> has been saved on this browser. Complete another daily session to track your progress.';
    } else if (record.delta > 0) {
      compBox.innerHTML = '<strong>Progress Update (+' + record.delta + ' percentage points):</strong> You improved by ' + record.delta + ' points compared with your previous session.';
    } else if (record.delta < 0) {
      compBox.innerHTML = '<strong>Progress Update (' + record.delta + ' percentage points):</strong> Your score dipped by ' + Math.abs(record.delta) + ' points vs your last run. Review the missed concepts and study steps below.';
    } else {
      compBox.innerHTML = '<strong>Steady Performance (0 change):</strong> You matched your previous score of <strong>' + record.percentage + '%</strong>.';
    }

    var strongEl = document.getElementById('wStrongList');
    if (strongTopics.length > 0) {
      strongEl.innerHTML = strongTopics.map(function (s) {
        return [
          '<div class="w-topic-row">',
          '  <div class="w-topic-name">' + escapeHtml(s.topicName) + '<span>' + escapeHtml(s.subjectName) + '</span></div>',
          '  <span class="w-topic-stat-strong">' + s.correct + '/' + s.total + ' (' + s.percentage + '%)</span>',
          '</div>'
        ].join('');
      }).join('');
    } else {
      strongEl.innerHTML = '<p class="w-empty-note">No assessed topic reached 75% in this run. Work through the study recommendations below and re-test.</p>';
    }

    var weakEl = document.getElementById('wWeakList');
    if (weakTopics.length > 0) {
      weakEl.innerHTML = weakTopics.map(function (w) {
        return [
          '<div class="w-topic-row">',
          '  <div class="w-topic-name">' + escapeHtml(w.topicName) + '<span>' + escapeHtml(w.subjectName) + '</span></div>',
          '  <span class="w-topic-stat-weak">' + w.correct + '/' + w.total + ' (' + w.percentage + '%)</span>',
          '</div>'
        ].join('');
      }).join('');
    } else {
      weakEl.innerHTML = '<p class="w-empty-note">Zero weak topics in this session — 100% accuracy across every assessed KCSE topic.</p>';
    }

    var tipsEl = document.getElementById('wStudyTipsList');
    var practiceBtn = document.getElementById('wPractiseWeakBtn');
    var practiceTitle = document.getElementById('wPracticeCtaTitle');
    var practiceDesc = document.getElementById('wPracticeCtaDesc');

    if (weakTopics.length > 0) {
      tipsEl.innerHTML = weakTopics.map(function (w) {
        return [
          '<div class="w-tip-card">',
          '  <strong>' + escapeHtml(w.subjectName + ' — ' + w.topicName) + '</strong>',
          '  <p>' + escapeHtml(w.studyTip) + '</p>',
          '</div>'
        ].join('');
      }).join('');
      practiceTitle.textContent = 'Drill Your ' + weakTopics.length + ' Weak Topic' + (weakTopics.length === 1 ? '' : 's');
      practiceDesc.textContent = 'Generate 10 fresh unseen questions targeting the exact syllabus topics where you lost marks.';
      practiceBtn.textContent = 'Practise Weak Topics';
    } else {
      tipsEl.innerHTML = [
        '<div class="w-tip-card">',
        '  <strong>Next Challenge — Step Up Difficulty or Broaden Subjects</strong>',
        '  <p>You answered every topic accurately in this session. Switch difficulty to Difficult (Form 3-4 synthesis) or include all 7-8 of your KCSE subjects to test full exam stamina under timed conditions.</p>',
        '</div>'
      ].join('');
      practiceTitle.textContent = 'Keep Your Streak Going With Unseen Questions';
      practiceDesc.textContent = 'Start another 10-question session drawing from unseen items across your selected KCSE subjects.';
      practiceBtn.textContent = 'Practise 10 More Questions';
    }

    renderReviewCards();
    renderHistoryList();

    var section = document.getElementById('weaknessAssessmentSection');
    if (section) scrollWeaknessSectionIntoView(section);
  }

  function renderReviewCards() {
    var listEl = document.getElementById('wReviewList');
    if (!listEl) return;

    listEl.innerHTML = currentSession.questions.map(function (q, i) {
      var ans = currentSession.userAnswers[q.id];
      var sel = ans ? ans.selectedIndex : undefined;
      var ok = sel === q.correctIndex;
      var sMeta = SUBJECTS[q.subject] || { shortName: q.subject, topics: {} };
      var tMeta = sMeta.topics[q.topicId] || { shortName: q.topicId };

      var chosenStr = sel !== undefined
        ? (String.fromCharCode(65 + sel) + '. ' + q.options[sel])
        : 'Not answered';
      var rightStr = String.fromCharCode(65 + q.correctIndex) + '. ' + q.options[q.correctIndex];

      return [
        '<div class="w-review-item">',
        '  <div class="w-review-head">',
        '    <span class="w-review-meta">Q' + (i + 1) + ' &middot; ' + escapeHtml(sMeta.shortName) + ' &middot; ' + escapeHtml(tMeta.shortName) + '</span>',
        '    <span class="' + (ok ? 'w-review-verdict-ok' : 'w-review-verdict-err') + '">' + (ok ? 'Correct' : 'Incorrect') + '</span>',
        '  </div>',
        '  <p class="w-review-q">' + escapeHtml(q.question) + '</p>',
        '  <p class="w-review-ans">Your Answer: <strong>' + escapeHtml(chosenStr) + '</strong>' +
             (!ok ? ' &middot; Correct Answer: <strong>' + escapeHtml(rightStr) + '</strong>' : '') + '</p>',
        '  <p class="w-review-exp"><strong>Explanation:</strong> ' + escapeHtml(q.explanation) + '</p>',
        '  <div class="w-concept-box">',
        '    <span class="w-concept-label">Underlying KCSE Concept</span>',
        '    <p class="w-concept-text">' + escapeHtml(q.concept) + '</p>',
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
      listEl.innerHTML = '<p class="w-empty-note">No saved KCSE quiz sessions on this browser yet.</p>';
      return;
    }

    listEl.innerHTML = history.slice(0, 8).map(function (h) {
      return [
        '<div class="w-hist-row">',
        '  <div><strong>' + escapeHtml(h.subjectsSummary || 'KCSE Subjects') + '</strong> &middot; ' + escapeHtml(DIFFICULTY_LABELS[h.difficulty] || h.difficulty) + ' &middot; ' + escapeHtml(h.dateFormatted) + '</div>',
        '  <div><strong>' + h.score + ' / ' + h.total + ' (' + h.percentage + '%)</strong></div>',
        '</div>'
      ].join('');
    }).join('');
  }

  // Expose read/test helpers for verification without polluting global namespace
  window.AfriKcseDailyQuiz = {
    version: '2.0.0',
    getSubjects: function () { return SUBJECTS; },
    getClusters: function () { return KUCCPS_CLUSTERS; },
    getQuestionCount: function () { return QUESTIONS.length; },
    getQuestionBank: function () { return QUESTIONS.slice(); },
    generateSessionQuestions: generateSessionQuestions,
    openQuiz: function () { openWeaknessSection(true); }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWeaknessUI);
  } else {
    initWeaknessUI();
  }
})();
