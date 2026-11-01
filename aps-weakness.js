/**
 * AfriWidget South African NSC (CAPS Grades 10–12) Daily Subject Learning Quiz Engine (v2.0)
 * Pure Vanilla JS — Zero External Dependencies — LocalStorage Variety & Progress Tracking
 *
 * Curriculum Scope:
 * - 10 Official South African DBE / IEB CAPS FET Subjects (Mathematics, Mathematical Literacy,
 *   English HL & FAL, Physical Sciences, Life Sciences, Accounting, Business Studies,
 *   Economics, Geography, History)
 * - 50 Official CAPS Syllabus Topics with Targeted Matric Revision Recommendations
 * - 300 Verified Questions across Easy (Grade 10 / Core), Medium (Grade 11 / Applied),
 *   and Difficult (Grade 12 Matric / Synthesis) Levels
 * - Grade 10–12 Selector + South African University Faculty Programme Presets + Custom Subject Toggles
 */
(function () {
  'use strict';

  var STORAGE_HISTORY_KEY = 'afriwidget_nsc_quiz_history_v2';
  var STORAGE_SEEN_KEY = 'afriwidget_nsc_quiz_seen_v2';
  var QUESTIONS_PER_SESSION = 10;

  var NSC_GRADES = {
    grade12: {
      id: 'grade12',
      label: 'Grade 12 (Matric / NSC Final)',
      shortLabel: 'Grade 12',
      recommendedDifficulty: 'difficult'
    },
    grade11: {
      id: 'grade11',
      label: 'Grade 11 (FET Provisional Admission Year)',
      shortLabel: 'Grade 11',
      recommendedDifficulty: 'medium'
    },
    grade10: {
      id: 'grade10',
      label: 'Grade 10 (FET Foundation Year)',
      shortLabel: 'Grade 10',
      recommendedDifficulty: 'easy'
    }
  };

  var SA_PROGRAMMES = {
    medicine: {
      id: 'medicine',
      label: 'Medicine & Health Sciences (MBChB, BPharm, Physiotherapy)',
      subjects: ['mathematics', 'physical_sciences', 'life_sciences', 'english'],
      note: 'Requires Pure Mathematics, Physical Sciences, Life Sciences, and English.'
    },
    engineering: {
      id: 'engineering',
      label: 'Engineering & Built Environment (BEng / BSc Eng)',
      subjects: ['mathematics', 'physical_sciences', 'english', 'geography'],
      note: 'Requires Pure Mathematics and Physical Sciences (typically Level 6+).'
    },
    computing: {
      id: 'computing',
      label: 'Computer Science, Data Science & Information Systems (BSc)',
      subjects: ['mathematics', 'physical_sciences', 'english', 'accounting'],
      note: 'Requires Pure Mathematics alongside strong analytical sciences.'
    },
    commerce_ca: {
      id: 'commerce_ca',
      label: 'Commerce: Chartered Accountancy (CA-Stream) & Actuarial',
      subjects: ['mathematics', 'accounting', 'economics', 'english'],
      note: 'Requires Pure Mathematics alongside Accounting, Economics, and English.'
    },
    commerce_gen: {
      id: 'commerce_gen',
      label: 'Commerce: General BCom, Management & Marketing',
      subjects: ['mathematics', 'accounting', 'business_studies', 'economics', 'english'],
      note: 'Covers core EMS/Commerce Matric subjects for BCom degrees.'
    },
    science_bsc: {
      id: 'science_bsc',
      label: 'Biological, Chemical & Environmental Sciences (BSc)',
      subjects: ['mathematics', 'physical_sciences', 'life_sciences', 'geography'],
      note: 'Covers core BSc natural and earth science Matric subjects.'
    },
    law: {
      id: 'law',
      label: 'Bachelor of Laws (LLB / BA Law / BCom Law)',
      subjects: ['english', 'history', 'business_studies', 'math_lit'],
      note: 'Emphasises high English proficiency, argumentation, History, and quantitative literacy.'
    },
    education: {
      id: 'education',
      label: 'Bachelor of Education (BEd) & Teaching Pathways',
      subjects: ['english', 'math_lit', 'life_sciences', 'geography', 'history'],
      note: 'Broad NSC subject mix suitable for Foundation, Intermediate, and FET teaching.'
    },
    humanities: {
      id: 'humanities',
      label: 'Humanities, Journalism, Social Sciences & Arts (BA)',
      subjects: ['english', 'history', 'geography', 'economics', 'math_lit'],
      note: 'Covers language, social science, and Mathematical Literacy streams.'
    },
    custom: {
      id: 'custom',
      label: 'Custom NSC Subject Selection (Choose Any Subjects Below)',
      subjects: ['mathematics', 'english', 'physical_sciences', 'life_sciences'],
      note: 'Select any combination of your NSC 20-credit subjects below.'
    }
  };

  var SUBJECT_ORDER = [
    'mathematics',
    'math_lit',
    'english',
    'physical_sciences',
    'life_sciences',
    'accounting',
    'business_studies',
    'economics',
    'geography',
    'history'
  ];

  var SUBJECTS = {
    mathematics: {
      id: 'mathematics',
      name: 'Mathematics (CAPS)',
      shortName: 'Mathematics',
      stream: 'Core Quantitative',
      topics: {
        math_alg: {
          name: 'Algebra, Exponents, Surds & Inequalities',
          shortName: 'Algebra & Surds',
          studyTip: 'Practise standard-form quadratic inequalities using sign/parabola sketches, check surd equations by substituting roots back into the original equation to reject extraneous solutions, and test nature of roots with delta = b^2 - 4ac.'
        },
        math_seq: {
          name: 'Number Patterns, Series & Financial Maths',
          shortName: 'Patterns & Finance',
          studyTip: 'Separate quadratic number patterns (constant second difference = 2a) from arithmetic and geometric series, and distinguish future-value (F) vs present-value (P) annuities on a clear timeline.'
        },
        math_func: {
          name: 'Functions, Inverses & Graphs',
          shortName: 'Functions & Graphs',
          studyTip: 'Revise asymptotes of hyperbolas y = a/(x - p) + q, turning-point form y = a(x - p)^2 + q, exponential-logarithmic inverses (swap x and y), and domain restrictions needed to make a parabola one-to-one.'
        },
        math_calc: {
          name: 'Differential Calculus & Cubic Graphs',
          shortName: 'Differential Calculus',
          studyTip: 'Keep first-principles notation lim(h->0) exact on every line until substituting h = 0, set f\'(x) = 0 for stationary points, set f\'\'(x) = 0 for the point of inflection, and build area/volume formulas in one variable for optimisation.'
        },
        math_geom: {
          name: 'Trigonometry, Analytical & Euclidean Geometry',
          shortName: 'Trig & Geometry',
          studyTip: 'Memorise CAST reductions, compound/double-angle identities, circle completion of the square (x - a)^2 + (y - b)^2 = r^2, and official DBE acceptable Euclidean geometry reasons (tan-chord theorem, opp angles of cyclic quad, prop theorem with parallel lines stated).'
        }
      }
    },
    math_lit: {
      id: 'math_lit',
      name: 'Mathematical Literacy (CAPS)',
      shortName: 'Maths Literacy',
      stream: 'Core Quantitative',
      topics: {
        mlit_fin: {
          name: 'Tariffs, VAT (15%), SARS Tax & Budgets',
          shortName: 'Finance & Tax',
          studyTip: 'Divide by 1,15 (never subtract 15% directly) to remove South African 15% VAT from a VAT-inclusive price, apply stepped municipal water/electricity blocks bracket-by-bracket, and subtract SARS tax rebates only after computing bracket tax.'
        },
        mlit_meas: {
          name: 'Measurement, Conversions, Volume & BMI',
          shortName: 'Measurement & BMI',
          studyTip: 'Convert all lengths to the same unit BEFORE calculating area or volume (1 m^3 = 1 000 litres), subtract doors/windows before multiplying by coats of paint, and round up whole boxes/tins in practical purchasing contexts.'
        },
        mlit_maps: {
          name: 'Maps, Floor Plans, Scales & Travel Planning',
          shortName: 'Maps & Scales',
          studyTip: 'Remember that bar scales stay accurate when a map is enlarged or reduced whereas number scales (1 : 50 000) become distorted; convert minutes to decimal hours (divide by 60) in speed-distance-time formulas.'
        },
        mlit_data: {
          name: 'Data Handling, Box Plots & Percentiles',
          shortName: 'Data Handling',
          studyTip: 'Arrange data in ascending order before finding quartiles, interpret percentiles on Road-to-Health charts as comparative rankings (not test scores), and choose the median over the mean when extreme outliers skew salaries or house prices.'
        },
        mlit_prob: {
          name: 'Probability, Exchange Rates, Inflation & Break-Even',
          shortName: 'Probability & Inflation',
          studyTip: 'Compound inflation year-on-year rather than adding percentages, locate break-even where the income and total-cost lines intersect, and adjust both numerator and denominator on probability tree diagrams without replacement.'
        }
      }
    },
    english: {
      id: 'english',
      name: 'English (HL & FAL)',
      shortName: 'English',
      stream: 'Compulsory Language',
      topics: {
        eng_comp: {
          name: 'Comprehension, Critical Language Awareness & Tone',
          shortName: 'Comprehension & CLA',
          studyTip: 'Answer Paper 1 comprehension questions in your own words unless asked to quote, distinguish denotation (literal dictionary meaning) from connotation (emotional association), and explain HOW diction creates tone or bias.'
        },
        eng_gram: {
          name: 'Grammar, Concord, Clauses & Punctuation',
          shortName: 'Grammar & Concord',
          studyTip: 'Match the verb to the true head noun rather than phrases after "along with" or "as well as", fix dangling participles by naming the doer immediately after the comma, and distinguish hyphens (compound words) from dashes (parenthetical pauses).'
        },
        eng_voice: {
          name: 'Active/Passive Voice & Direct/Indirect Speech',
          shortName: 'Voice & Reported Speech',
          studyTip: 'Preserve the original verb tense when converting between active and passive voice, and backshift tenses, pronouns, and time/place markers ("today" -> "that day", "tomorrow" -> "the next day") in indirect speech after a past reporting verb.'
        },
        eng_fig: {
          name: 'Figures of Speech, Sound Devices & Poetry',
          shortName: 'Poetry & Figurative Language',
          studyTip: 'In NSC Paper 2 poetry, follow the three-step method for imagery: identify the literal comparison, link it to the speaker\'s context, and state its emotional or thematic effectiveness (never stop at naming "metaphor" or "oxymoron").'
        },
        eng_vis: {
          name: 'Summary Writing, Cartoons & Advertising (AIDA)',
          shortName: 'Summary & Visual Literacy',
          studyTip: 'Keep Paper 1 summaries strictly within the word limit in coherent prose (with an honest word count), and back every cartoon/advertisement answer with BOTH visual clues (facial expression, posture, font) and verbal clues.'
        }
      }
    },
    physical_sciences: {
      id: 'physical_sciences',
      name: 'Physical Sciences (CAPS)',
      shortName: 'Physical Sciences',
      stream: 'Sciences (Paper 1 & 2)',
      topics: {
        phys_mech: {
          name: 'Mechanics: Newton\'s Laws, Momentum & Work-Energy',
          shortName: 'Mechanics',
          studyTip: 'Draw a labelled free-body diagram (arrows starting on the dot, never include components alongside the resultant), keep vector sign conventions consistent in impulse-momentum and vertical projectile motion, and use W_net = delta E_k.'
        },
        phys_wave: {
          name: 'Doppler Effect, Electrostatics & Electric Circuits',
          shortName: 'Waves & Electricity',
          studyTip: 'In Doppler problems f_L = ((v +- v_L)/(v +- v_s))f_s, choose signs so approaching increases f_L and receding decreases f_L; in internal resistance circuits emf = I(R + r), remember V_load drops when total external R decreases.'
        },
        phys_equil: {
          name: 'Reaction Rates & Chemical Equilibrium (Kc)',
          shortName: 'Rates & Equilibrium',
          studyTip: 'Omit pure solids (s) and pure liquids (l) from the Kc expression, remember ONLY temperature changes the numerical value of Kc, and structure Le Chatelier explanations clearly: disturbance -> system opposes disturbance -> favoured reaction -> shift.'
        },
        phys_elec: {
          name: 'Acids, Bases & Electrochemistry (Galvanic/Electrolytic)',
          shortName: 'Acids & Electrochemistry',
          studyTip: 'Use AN OIL RIG (Anode = Oxidation, Cathode = Reduction) for BOTH galvanic and electrolytic cells; remember E_cell = E_cathode - E_anode using standard reduction potentials without multiplying E values by stoichiometric coefficients.'
        },
        phys_org: {
          name: 'Organic Chemistry: IUPAC, Isomers & Intermolecular Forces',
          shortName: 'Organic Chemistry',
          studyTip: 'Link boiling points and vapour pressures directly to intermolecular force strength (Hydrogen bonding in carboxylic acids/alcohols > Dipole-dipole in ketones/esters/haloalkanes > London forces in alkanes), and distinguish Zaitsev elimination (conc. strong base + ethanol + heat) from substitution.'
        }
      }
    },
    life_sciences: {
      id: 'life_sciences',
      name: 'Life Sciences (CAPS)',
      shortName: 'Life Sciences',
      stream: 'Sciences (Paper 1 & 2)',
      topics: {
        life_dna: {
          name: 'DNA, RNA, Protein Synthesis & Meiosis',
          shortName: 'DNA & Meiosis',
          studyTip: 'Distinguish DNA replication (both strands copied in interphase) from transcription (one DNA template strand copied into mRNA codons) and translation (tRNA anticodons bring specific amino acids at the ribosome); track crossing over in Prophase I and non-disjunction in Anaphase I/II.'
        },
        life_gen: {
          name: 'Genetics, Pedigrees, Sex-Linkage & Biotechnology',
          shortName: 'Genetics & Inheritance',
          studyTip: 'Follow the official CAPS genetic cross layout (P1 phenotype/genotype, Meiosis, Gametes, Fertilisation/Punnett square, F1 genotype/phenotype) to secure full format marks, and write X-linked alleles as superscripts on X (never on Y).'
        },
        life_repr: {
          name: 'Vertebrate Reproductive Strategies & Human Reproduction',
          shortName: 'Reproduction',
          studyTip: 'Compare ovipary, ovovivipary, and vivipary plus precocial vs altricial development, and master the menstrual cycle hormone feedback loop: FSH -> Graafian follicle -> Oestrogen (builds endometrium & inhibits FSH) -> LH surge (ovulation -> corpus luteum) -> Progesterone.'
        },
        life_homeo: {
          name: 'Nervous, Sense Organs, Endocrine & Homeostasis',
          shortName: 'Nervous & Homeostasis',
          studyTip: 'Learn eye accommodation (near vision: ciliary muscles contract, suspensory ligaments slacken, lens becomes more convex) vs pupillary mechanism, and write full negative-feedback loops for thyroxin (TSH), blood glucose (insulin/glucagon), water (ADH), and salt (aldosterone).'
        },
        life_evol: {
          name: 'Evolution by Natural Selection & Hominid Studies',
          shortName: 'Evolution & Hominids',
          studyTip: 'Never use Lamarckian "need/trying" phrasing when explaining Darwinian natural selection; memorise anatomical shifts toward bipedalism (anterior foramen magnum, S-shaped spine, short wide pelvis) and key South African Australopithecus fossils (Taung Child, Mrs Ples, Little Foot, Karabo).'
        }
      }
    },
    accounting: {
      id: 'accounting',
      name: 'Accounting (CAPS)',
      shortName: 'Accounting',
      stream: 'Commerce (Paper 1 & 2)',
      topics: {
        acc_comp: {
          name: 'Companies: Share Capital, Buy-Backs & Retained Income',
          shortName: 'Companies & Shares',
          studyTip: 'In share buy-backs, reduce Ordinary Share Capital by the AVERAGE issue price per share (never the buy-back price) and charge the excess above average price to Retained Income; include both interim paid and final declared dividends in Dividends on Ordinary Shares.'
        },
        acc_stmt: {
          name: 'Financial Statements, Adjustments & Audit Reports',
          shortName: 'Statements & Audit',
          studyTip: 'Separate prepaid expenses (receivable asset) from accrued expenses (payable liability) and income received in advance (deferred income), and distinguish Unqualified (clean), Qualified ("except for"), and Disclaimer/Adverse independent audit opinions.'
        },
        acc_cash: {
          name: 'Cash Flow Statement & Financial Indicators',
          shortName: 'Cash Flow & Ratios',
          studyTip: 'Exclude inventory from the Acid-Test Ratio, compare Return on Total Capital Employed (ROTCE) against the interest rate on loans to evaluate positive vs negative gearing, and reconcile Cash Generated from Operations carefully.'
        },
        acc_inv: {
          name: 'Inventory Valuation (FIFO / Weighted Average) & VAT',
          shortName: 'Inventory & VAT',
          studyTip: 'Under FIFO, closing stock consists of the MOST RECENT purchases on hand whereas under Weighted Average you divide total cost of available units by total net units; track Output VAT (payable to SARS on sales) minus Input VAT (claimable on purchases).'
        },
        acc_cost: {
          name: 'Cost Accounting (Manufacturing), Budgets & Reconciliations',
          shortName: 'Manufacturing & Recon',
          studyTip: 'Prime Cost = Direct Material Cost + Direct Labour Cost; add Factory Overhead Cost and adjust opening/closing Work-in-Process to get Cost of Production of Finished Goods, and exclude non-cash items like depreciation from a Cash Budget.'
        }
      }
    },
    business_studies: {
      id: 'business_studies',
      name: 'Business Studies (CAPS)',
      shortName: 'Business Studies',
      stream: 'Commerce (Paper 1 & 2)',
      topics: {
        bus_leg: {
          name: 'Business Environments & SA Legislation (CPA, NCA, BCEA, LRA)',
          shortName: 'Environments & Legislation',
          studyTip: 'Link Micro (full control), Market (some influence), and Macro (no control) environments to SWOT and PESTLE, and match each South African Act precisely to its purpose (LRA = collective bargaining/CCMA, BCEA = working hours/leave, NCA = reckless credit, CPA = consumer rights, COIDA = workplace injuries).'
        },
        bus_strat: {
          name: 'Business Strategies, Creative Thinking & Quality',
          shortName: 'Strategies & Quality',
          studyTip: 'Distinguish Forward/Backward/Horizontal integration from Concentric/Horizontal/Conglomerate diversification, apply Porter\'s Five Forces, and separate Quality Control (inspecting final products) from Quality Assurance (preventing defects during every process).'
        },
        bus_hr: {
          name: 'Human Resources, Team Dynamics & Conflict Management',
          shortName: 'HR & Team Dynamics',
          studyTip: 'Contrast Recruitment -> Selection -> Interviewing -> Employment Contract -> Induction -> Placement, distinguish Piecemeal vs Time-related salary determination, and know Tuckman\'s stages of team development (Forming, Storming, Norming, Performing, Adjourning).'
        },
        bus_inv: {
          name: 'Investments, Insurance & Forms of Ownership',
          shortName: 'Investments & Insurance',
          studyTip: 'Apply the Average Clause formula (Insured Amount / Market Value x Loss) for under-insurance, distinguish compulsory insurance (UIF, RAF, COIDA) from non-compulsory short/long-term cover, and compare JSE shares, unit trusts, RSA Retail Savings Bonds, and fixed deposits.'
        },
        bus_eth: {
          name: 'Ethics, Professionalism, CSR/CSI & Leadership',
          shortName: 'Ethics, CSI & Leadership',
          studyTip: 'Differentiate King Code corporate governance principles (transparency, accountability, responsibility), Ethics (moral right/wrong) vs Professionalism (competence/conduct), CSR vs CSI (actual community upliftment projects), and Democratic vs Autocratic vs Transactional leadership.'
        }
      }
    },
    economics: {
      id: 'economics',
      name: 'Economics (CAPS)',
      shortName: 'Economics',
      stream: 'Commerce (Paper 1 & 2)',
      topics: {
        econ_flow: {
          name: 'Circular Flow, Multiplier, Business Cycles & Public Sector',
          shortName: 'Macro & Circular Flow',
          studyTip: 'Remember injections (J = I + G + X) and leakages (L = S + T + M), compute the Keynesian multiplier k = 1 / (1 - MPC) = 1 / MPS, convert GDP at market prices to factor cost/basic prices using taxes and subsidies, and trace SARB monetary vs Treasury fiscal tools.'
        },
        econ_fx: {
          name: 'Foreign Exchange, Balance of Payments & Protectionism',
          shortName: 'Forex & BoP',
          studyTip: 'Distinguish Currency Depreciation/Appreciation (free-floating market forces) from Devaluation/Revaluation (fixed regime policy), and separate the Current Account (merchandise trade, services, primary/secondary income) from the Financial Account in the SARB Balance of Payments.'
        },
        econ_mkt: {
          name: 'Perfect & Imperfect Markets, Cost/Revenue & Market Failure',
          shortName: 'Market Structures',
          studyTip: 'Every profit-maximising firm produces where MR = MC; under Perfect Competition the individual firm is a price taker facing a horizontal demand curve (P = AR = MR) and earns normal profit in the long run, whereas Oligopolies face a kinked demand curve.'
        },
        econ_grow: {
          name: 'Economic Growth, SA Industrial Development & Regional Policy',
          shortName: 'Growth & SA Policy',
          studyTip: 'Contrast Economic Growth (increase in real GDP / production capacity) with Economic Development (standard of living / HDI), and link South Africa\'s NDP,NIPF, Special Economic Zones (SEZs), and Spatial Development Initiatives (SDIs) to export-led job creation.'
        },
        econ_infl: {
          name: 'Inflation (SARB 3–6%), Tourism & Environmental Sustainability',
          shortName: 'Inflation & Sustainability',
          studyTip: 'Know South Africa\'s SARB inflation target band (3%–6% CPI), distinguish Demand-Pull from Cost-Push inflation (and stagflation), and evaluate market-based environmental tools (carbon taxes, tradable pollution permits, subsidies for renewables).'
        }
      }
    },
    geography: {
      id: 'geography',
      name: 'Geography (CAPS)',
      shortName: 'Geography',
      stream: 'Humanities & Earth Science',
      topics: {
        geo_clim: {
          name: 'Climate & Weather: Cyclones, Berg Winds & Local Climates',
          shortName: 'Climate & Weather',
          studyTip: 'Remember Southern Hemisphere clockwise circulation around low-pressure systems (mid-latitude & tropical cyclones) and anticlockwise outflow around the South Atlantic and South Indian anticyclones; trace adiabatic heating (+1 C per 100 m descent) in warm, dry Berg winds.'
        },
        geo_geom: {
          name: 'Geomorphology: Drainage Basins, Fluvial Landforms & Capture',
          shortName: 'Geomorphology',
          studyTip: 'Link high drainage density to impermeable rock, steep slopes, sparse vegetation, and heavy downpours; master Strahler stream ordering, graded vs ungraded longitudinal profiles, slip-off vs undercut banks on meanders, and features of river capture (captor, elbow of capture, wind gap, misfit stream).'
        },
        geo_sett: {
          name: 'Rural & Urban Settlement Geography in South Africa',
          shortName: 'Rural & Urban Settlement',
          studyTip: 'Distinguish site (exact physical ground) from situation (surrounding regional transport/market position), nucleated vs dispersed rural patterns, urban land-use zones (CBD, transition zone, rural-urban fringe), and post-apartheid urban land reform & service-delivery challenges.'
        },
        geo_econ: {
          name: 'Economic Geography of SA: Primary, Secondary, IDZs & SDIs',
          shortName: 'SA Economic Geography',
          studyTip: 'Revise food security factors, gold/coal/platinum mining contributions and challenges, South Africa\'s four core industrial regions (PWV/Gauteng, Durban-Pinetown, Southwestern Cape, Port Elizabeth-Uitenhage/Nelson Mandela Bay), and specific IDZs/SEZs (Coega, Saldanha Bay, East London, Dube TradePort).'
        },
        geo_map: {
          name: 'Mapwork, Topographic 1:50 000 Calculations & GIS',
          shortName: 'Mapwork & GIS',
          studyTip: 'On South African 1:50 000 topographic maps (contour interval 20 m), add annual westerly change to magnetic declination when declination is West of True North; distinguish vector (points/lines/polygons) vs raster (grid pixels) GIS data and spatial resolution vs buffering.'
        }
      }
    },
    history: {
      id: 'history',
      name: 'History (CAPS)',
      shortName: 'History',
      stream: 'Humanities (Paper 1 & 2)',
      topics: {
        hist_cold: {
          name: 'The Cold War: Origins, Berlin, Cuba & Vietnam',
          shortName: 'Cold War',
          studyTip: 'Connect Truman Doctrine + Marshall Plan containment to Comecon/Cominform, trace brinkmanship in the 1962 Cuban Missile Crisis, and explain why conventional US military superiority failed against Viet Cong guerrilla tactics and Ho Chi Minh Trail logistics in Vietnam.'
        },
        hist_afr: {
          name: 'Independent Africa: Congo, Tanzania (Ujamaa) & Angola',
          shortName: 'Independent Africa',
          studyTip: 'Compare Mobutu Sese Seko\'s centralised capitalist kleptocracy/Zaireanisation in the Congo with Julius Nyerere\'s Arusha Declaration (1967) and African Socialism (Ujamaa villagisation) in Tanzania, and analyse Angola (MPLA, UNITA, FNLA, Cuito Cuanavale 1987–88) as a Cold War proxy theatre.'
        },
        hist_civ: {
          name: 'Civil Society Protests 1950s–1970s: US Civil Rights & Black Power',
          shortName: 'Civil Rights & Black Power',
          studyTip: 'Contrast Martin Luther King Jr.\'s non-violent civil disobedience (Montgomery Bus Boycott, Greensboro sit-ins, Birmingham, 1963 March on Washington, 1964 Civil Rights Act, 1965 Voting Rights Act) with Malcolm X, Stokely Carmichael, and the Black Panther Party\'s self-reliance and Black pride.'
        },
        hist_res: {
          name: 'Civil Resistance in SA 1970s–1980s: BCM, Soweto 1976 & UDF',
          shortName: 'SA Resistance 1970s–80s',
          studyTip: 'Explain Steve Biko\'s Black Consciousness philosophy of psychological liberation, link Bantu Education\'s Afrikaans-medium decree to the 16 June 1976 Soweto Uprising, and trace how PW Botha\'s 1983 Tricameral Constitution sparked the UDF, COSATU, mass civic rolling action, and international sanctions.'
        },
        hist_dem: {
          name: 'Coming of Democracy in SA (1990–1994), TRC & Globalisation',
          shortName: 'SA Democracy & TRC',
          studyTip: 'Master the 1990–1994 negotiation turning points (2 Feb 1990 unbannings, Groote Schuur/Pretoria Minutes, CODESA I & II, Boipatong, Bisho, Record of Understanding, Chris Hani\'s assassination, Joe Slovo\'s Sunset Clauses, April 1994 election) and compare retributive vs restorative justice in the TRC.'
        }
      }
    }
  };

  var DIFFICULTY_LABELS = {
    easy: 'Easy',
    medium: 'Medium',
    difficult: 'Difficult'
  };

  var DIFFICULTY_DESCRIPTIONS = {
    easy: 'Grade 10 & foundational CAPS definitions, direct concepts, and one-step recall',
    medium: 'Grade 11 & applied CAPS problem-solving, interpretation, and multi-step calculations',
    difficult: 'Grade 12 Matric Paper 1 & 2 higher-order synthesis, proofs, and exam traps'
  };

  var QUESTIONS = [
    // =========================================================================
    // 1. MATHEMATICS (CAPS) — 30 Questions (10 Easy, 10 Medium, 10 Difficult)
    // =========================================================================
    {
      id: 'nsc_math_e1',
      subject: 'mathematics',
      topicId: 'math_alg',
      difficulty: 'easy',
      question: 'Solve for x: (x - 5)(x + 2) = 0.',
      options: [
        'x = 5 or x = -2',
        'x = -5 or x = 2',
        'x = 5 only',
        'x = 10 or x = -10'
      ],
      correctIndex: 0,
      explanation: 'By the zero-product property, if (x - 5)(x + 2) = 0, then either x - 5 = 0 (giving x = 5) or x + 2 = 0 (giving x = -2).',
      concept: 'Zero-product rule: A * B = 0 if and only if A = 0 or B = 0. Always equate the expression to 0 before factorising.'
    },
    {
      id: 'nsc_math_e2',
      subject: 'mathematics',
      topicId: 'math_alg',
      difficulty: 'easy',
      question: 'Simplify without a calculator: (3^(x + 2) - 3^x) / 3^x.',
      options: [
        '9',
        '8',
        '6',
        '3^2'
      ],
      correctIndex: 1,
      explanation: 'Split the exponent and take out the common factor 3^x in the numerator: (3^x * 3^2 - 3^x * 1) / 3^x = 3^x(9 - 1) / 3^x = 8.',
      concept: 'When exponential terms are separated by + or -, factor out the common exponential base (3^x) rather than cancelling across addition/subtraction.'
    },
    {
      id: 'nsc_math_e3',
      subject: 'mathematics',
      topicId: 'math_seq',
      difficulty: 'easy',
      question: 'Determine the 20th term (T_20) of the arithmetic sequence: 7; 11; 15; 19; ...',
      options: [
        '79',
        '83',
        '87',
        '80'
      ],
      correctIndex: 1,
      explanation: 'First term a = 7 and constant first difference d = 11 - 7 = 4. Using T_n = a + (n - 1)d: T_20 = 7 + (20 - 1)(4) = 7 + 76 = 83.',
      concept: 'Arithmetic (linear) sequences have a constant first difference d and general term T_n = a + (n - 1)d.'
    },
    {
      id: 'nsc_math_e4',
      subject: 'mathematics',
      topicId: 'math_seq',
      difficulty: 'easy',
      question: 'R12 000 is invested for 3 years at 8% per annum compounded annually. Calculate the accumulated amount A at the end of 3 years.',
      options: [
        'R14 880,00',
        'R15 116,54',
        'R15 600,00',
        'R13 996,80'
      ],
      correctIndex: 1,
      explanation: 'Using the compound growth formula A = P(1 + i)^n: A = 12 000(1 + 0,08)^3 = 12 000(1,08)^3 = 12 000 x 1,259712 = R15 116,54.',
      concept: 'Compound growth A = P(1 + i)^n earns interest on previously accumulated interest, unlike simple growth A = P(1 + in).'
    },
    {
      id: 'nsc_math_e5',
      subject: 'mathematics',
      topicId: 'math_func',
      difficulty: 'easy',
      question: 'Write down the equations of the vertical and horizontal asymptotes of the hyperbola f(x) = 4 / (x - 3) - 2.',
      options: [
        'x = -3 and y = -2',
        'x = 3 and y = 2',
        'x = 3 and y = -2',
        'x = 4 and y = -3'
      ],
      correctIndex: 2,
      explanation: 'In standard form f(x) = a / (x - p) + q, the denominator cannot be zero so x = 3 is the vertical asymptote, and the fraction cannot equal zero so y = -2 is the horizontal asymptote.',
      concept: 'For f(x) = a / (x - p) + q, the vertical asymptote is x = p (opposite sign to bracket) and the horizontal asymptote is y = q.'
    },
    {
      id: 'nsc_math_e6',
      subject: 'mathematics',
      topicId: 'math_func',
      difficulty: 'easy',
      question: 'State the coordinates of the turning point of the parabola g(x) = -2(x + 1)^2 + 9.',
      options: [
        '(1; 9)',
        '(-1; 9)',
        '(-2; 9)',
        '(-1; -9)'
      ],
      correctIndex: 1,
      explanation: 'Comparing g(x) = -2(x - (-1))^2 + 9 with y = a(x - p)^2 + q gives p = -1 and q = 9, so the maximum turning point is (-1; 9).',
      concept: 'Turning-point form y = a(x - p)^2 + q has vertex (p; q); because a = -2 < 0, the parabola is concave down with maximum value q = 9.'
    },
    {
      id: 'nsc_math_e7',
      subject: 'mathematics',
      topicId: 'math_calc',
      difficulty: 'easy',
      question: 'Determine f\'(x) if f(x) = 4x^3 - 6x^2 + 5x - 9.',
      options: [
        '12x^2 - 12x + 5',
        '12x^2 - 6x + 5 - 9',
        '4x^2 - 12x + 5',
        '12x^3 - 12x^2 + 5'
      ],
      correctIndex: 0,
      explanation: 'Applying the power rule d/dx(ax^n) = anx^(n-1) term by term: d/dx(4x^3) = 12x^2, d/dx(-6x^2) = -12x, d/dx(5x) = 5, and the derivative of constant -9 is 0.',
      concept: 'Power rule of differentiation: multiply by the exponent and subtract 1 from the exponent; the derivative of any constant term is zero.'
    },
    {
      id: 'nsc_math_e8',
      subject: 'mathematics',
      topicId: 'math_calc',
      difficulty: 'easy',
      question: 'Find the gradient of the tangent to the curve y = x^2 - 4x + 1 at the point where x = 3.',
      options: [
        '-2',
        '2',
        '-4',
        '6'
      ],
      correctIndex: 1,
      explanation: 'Differentiate first: dy/dx = 2x - 4. Substitute x = 3 into the derivative: m_tan = 2(3) - 4 = 6 - 4 = 2.',
      concept: 'The derivative f\'(a) gives the instantaneous gradient of the tangent to y = f(x) at x = a.'
    },
    {
      id: 'nsc_math_e9',
      subject: 'mathematics',
      topicId: 'math_geom',
      difficulty: 'easy',
      question: 'Calculate the coordinates of the midpoint M of line segment AB if A(-2; 5) and B(6; -1).',
      options: [
        'M(4; 4)',
        'M(2; 2)',
        'M(-4; 3)',
        'M(2; 3)'
      ],
      correctIndex: 1,
      explanation: 'Midpoint M = ((x_1 + x_2)/2 ; (y_1 + y_2)/2) = ((-2 + 6)/2 ; (5 + (-1))/2) = (4/2 ; 4/2) = M(2; 2).',
      concept: 'The midpoint formula averages the x-coordinates and averages the y-coordinates (do not subtract as in the distance/gradient formulas).'
    },
    {
      id: 'nsc_math_e10',
      subject: 'mathematics',
      topicId: 'math_geom',
      difficulty: 'easy',
      question: 'Cyclic quadrilateral ABCD has all four vertices on the circumference of a circle. If angle A = 78 degrees, what is the size of opposite angle C?',
      options: [
        '78 degrees',
        '102 degrees',
        '156 degrees',
        '12 degrees'
      ],
      correctIndex: 1,
      explanation: 'Opposite interior angles of a cyclic quadrilateral are supplementary (add up to 180 degrees): angle C = 180 - 78 = 102 degrees.',
      concept: 'CAPS acceptable Euclidean reason: [opp angles of cyclic quad] -> opposite angles sum to 180 degrees, whereas an exterior angle equals the interior opposite angle.'
    },
    {
      id: 'nsc_math_m1',
      subject: 'mathematics',
      topicId: 'math_alg',
      difficulty: 'medium',
      question: 'Solve the quadratic inequality: x^2 - 3x - 10 <= 0.',
      options: [
        '-2 <= x <= 5',
        'x <= -2 or x >= 5',
        '-5 <= x <= 2',
        'x < -2 or x > 5'
      ],
      correctIndex: 0,
      explanation: 'Factorising gives (x - 5)(x + 2) <= 0, with critical values x = -2 and x = 5. Because the coefficient of x^2 is positive (+1), the parabola lies on or below the x-axis between the roots: -2 <= x <= 5.',
      concept: 'Never split a quadratic inequality directly into two linear inequalities; find critical values and read the interval from a sign line or parabola sketch.'
    },
    {
      id: 'nsc_math_m2',
      subject: 'mathematics',
      topicId: 'math_alg',
      difficulty: 'medium',
      question: 'Determine the nature of the roots of the equation 2x^2 - 5x + 4 = 0 without solving for x.',
      options: [
        'Real, rational, and unequal',
        'Real, irrational, and unequal',
        'Real and equal',
        'Non-real (no real roots)'
      ],
      correctIndex: 3,
      explanation: 'Calculate the discriminant delta = b^2 - 4ac = (-5)^2 - 4(2)(4) = 25 - 32 = -7. Because delta < 0, the equation has no real roots (roots are non-real).',
      concept: 'Discriminant rules: delta < 0 -> non-real; delta = 0 -> real and equal; delta > 0 and perfect square -> real, rational, unequal; delta > 0 not square -> real, irrational.'
    },
    {
      id: 'nsc_math_m3',
      subject: 'mathematics',
      topicId: 'math_seq',
      difficulty: 'medium',
      question: 'Calculate the sum to infinity (S_infinity) of the convergent geometric series: 18 + 6 + 2 + ...',
      options: [
        '26',
        '27',
        '36',
        '54'
      ],
      correctIndex: 1,
      explanation: 'First term a = 18 and common ratio r = 6 / 18 = 1/3. Since -1 < r < 1, the series converges and S_infinity = a / (1 - r) = 18 / (1 - 1/3) = 18 / (2/3) = 27.',
      concept: 'A geometric series converges if and only if -1 < r < 1 (r != 0), with sum to infinity S_infinity = a / (1 - r).'
    },
    {
      id: 'nsc_math_m4',
      subject: 'mathematics',
      topicId: 'math_seq',
      difficulty: 'medium',
      question: 'Determine the general term T_n of the quadratic number pattern: 4; 9; 18; 31; ...',
      options: [
        'T_n = 2n^2 - n + 3',
        'T_n = 4n^2 - 7n + 7',
        'T_n = 2n^2 + n + 1',
        'T_n = n^2 + 3'
      ],
      correctIndex: 0,
      explanation: 'First differences are 5; 9; 13 and constant second difference is 4. Using 2a = 4 gives a = 2; 3a + b = 5 gives 6 + b = 5 -> b = -1; a + b + c = 4 gives 2 - 1 + c = 4 -> c = 3. Thus T_n = 2n^2 - n + 3.',
      concept: 'For quadratic sequence T_n = an^2 + bn + c: 2a = 2nd difference, 3a + b = first 1st difference (T_2 - T_1), and a + b + c = T_1.'
    },
    {
      id: 'nsc_math_m5',
      subject: 'mathematics',
      topicId: 'math_func',
      difficulty: 'medium',
      question: 'Given f(x) = 3^x for all real x, determine the equation and domain of the inverse function f^(-1).',
      options: [
        'f^(-1)(x) = log_3(x), domain: x > 0',
        'f^(-1)(x) = 3^(-x), domain: x in R',
        'f^(-1)(x) = x^3, domain: x >= 0',
        'f^(-1)(x) = log_x(3), domain: x != 0'
      ],
      correctIndex: 0,
      explanation: 'Write y = 3^x, interchange x and y to get x = 3^y, and rewrite in logarithmic form: y = log_3(x). Because the range of f(x) = 3^x is y > 0, the domain of f^(-1) is x > 0.',
      concept: 'Reflecting y = b^x across the line y = x yields y = log_b(x); the range of f (y > 0) becomes the domain of f^(-1) (x > 0).'
    },
    {
      id: 'nsc_math_m6',
      subject: 'mathematics',
      topicId: 'math_func',
      difficulty: 'medium',
      question: 'Determine the range of the quadratic function f(x) = x^2 - 2x - 8.',
      options: [
        'y >= -8',
        'y >= -9',
        'y <= -9',
        'y in R'
      ],
      correctIndex: 1,
      explanation: 'Axis of symmetry x = -b / (2a) = -(-2) / (2 * 1) = 1. Minimum turning-point y-value is f(1) = (1)^2 - 2(1) - 8 = -9. Since a = 1 > 0, the parabola opens upward so the range is y >= -9.',
      concept: 'Do not confuse the y-intercept c (-8) with the minimum y-value q (-9); always evaluate f(-b/2a) to find the range of a parabola.'
    },
    {
      id: 'nsc_math_m7',
      subject: 'mathematics',
      topicId: 'math_calc',
      difficulty: 'medium',
      question: 'Find the x-coordinates of the stationary (turning) points of the cubic function f(x) = x^3 - 6x^2 + 9x + 2.',
      options: [
        'x = -1 and x = -3',
        'x = 1 and x = 3',
        'x = 0 and x = 6',
        'x = 2 only'
      ],
      correctIndex: 1,
      explanation: 'At stationary points f\'(x) = 0: 3x^2 - 12x + 9 = 0 -> 3(x^2 - 4x + 3) = 0 -> 3(x - 1)(x - 3) = 0, giving x = 1 (local maximum) and x = 3 (local minimum).',
      concept: 'Stationary points occur where the gradient f\'(x) = 0; x = 2 here is the point of inflection where f\'\'(x) = 6x - 12 = 0.'
    },
    {
      id: 'nsc_math_m8',
      subject: 'mathematics',
      topicId: 'math_calc',
      difficulty: 'medium',
      question: 'When differentiating f(x) = 2x^2 from first principles, which expression represents (f(x + h) - f(x)) / h simplified BEFORE taking the limit as h -> 0?',
      options: [
        '4x + 2h',
        '2x + h',
        '4x + h^2',
        '4xh'
      ],
      correctIndex: 0,
      explanation: 'f(x + h) = 2(x + h)^2 = 2x^2 + 4xh + 2h^2. Subtracting f(x) = 2x^2 leaves 4xh + 2h^2 = h(4x + 2h). Dividing by h (h != 0) gives 4x + 2h, whose limit as h -> 0 is 4x.',
      concept: 'In CAPS Paper 1 first-principles questions, keep "lim_(h->0)" written on every step until h is cancelled from the denominator and h = 0 is substituted.'
    },
    {
      id: 'nsc_math_m9',
      subject: 'mathematics',
      topicId: 'math_geom',
      difficulty: 'medium',
      question: 'Determine the centre and radius of the circle given by x^2 - 6x + y^2 + 8y = 0.',
      options: [
        'Centre (-3; 4), radius 5',
        'Centre (3; -4), radius 5',
        'Centre (3; -4), radius 25',
        'Centre (6; -8), radius 10'
      ],
      correctIndex: 1,
      explanation: 'Complete the square for x and y: (x^2 - 6x + 9) + (y^2 + 8y + 16) = 0 + 9 + 16 -> (x - 3)^2 + (y + 4)^2 = 25. Thus the centre is (3; -4) and radius r = sqrt(25) = 5.',
      concept: 'Add (b/2)^2 to both sides for both x and y when completing the square for a circle, and take the square root of r^2 to state the radius.'
    },
    {
      id: 'nsc_math_m10',
      subject: 'mathematics',
      topicId: 'math_geom',
      difficulty: 'medium',
      question: 'Simplify fully (for sin(theta) != 0): [sin(180 - theta) * cos(90 - theta)] / sin^2(theta).',
      options: [
        'cot(theta)',
        '1',
        '-1',
        'tan^2(theta)'
      ],
      correctIndex: 1,
      explanation: 'Using reduction formulas: sin(180 - theta) = sin(theta) (Quadrant II) and co-function cos(90 - theta) = sin(theta). Numerator = sin(theta) * sin(theta) = sin^2(theta), so sin^2(theta) / sin^2(theta) = 1.',
      concept: 'Co-ratios at 90 degrees swap sin <-> cos, while 180-degree reductions keep the same trig ratio and check quadrant sign via CAST.'
    },
    {
      id: 'nsc_math_d1',
      subject: 'mathematics',
      topicId: 'math_alg',
      difficulty: 'difficult',
      question: 'Solve for x: sqrt(2x + 5) = x - 5.',
      options: [
        'x = 10 or x = 2',
        'x = 10 only',
        'x = 2 only',
        'No real solution'
      ],
      correctIndex: 1,
      explanation: 'Restriction: since sqrt(2x + 5) >= 0, we require x - 5 >= 0, so x >= 5. Squaring gives 2x + 5 = x^2 - 10x + 25 -> x^2 - 12x + 20 = 0 -> (x - 10)(x - 2) = 0. x = 2 fails the check (LHS = 3, RHS = -3), leaving x = 10 only.',
      concept: 'Squaring both sides of a surd equation can introduce extraneous roots; always test each root in the original equation (or enforce RHS >= 0).'
    },
    {
      id: 'nsc_math_d2',
      subject: 'mathematics',
      topicId: 'math_alg',
      difficulty: 'difficult',
      question: 'Given f(x) = x^2 - 4x + 3, for which values of k will the equation x^2 - 4x + 3 = k have TWO DISTINCT POSITIVE real roots?',
      options: [
        'k > -1',
        '-1 < k < 3',
        '-1 <= k <= 3',
        '0 < k < 3'
      ],
      correctIndex: 1,
      explanation: 'f(x) = (x - 2)^2 - 1 has turning point (2; -1) and y-intercept (0; 3). A horizontal line y = k cuts the parabola at two distinct positive x-values strictly above the minimum (-1) and strictly below the y-intercept (3, where one root is x = 0, which is not positive): -1 < k < 3.',
      concept: 'Graphical root analysis y = f(x) vs y = k is the fastest way in Grade 12 Paper 1 to enforce sign conditions (both roots positive) alongside distinctness.'
    },
    {
      id: 'nsc_math_d3',
      subject: 'mathematics',
      topicId: 'math_seq',
      difficulty: 'difficult',
      question: 'Delivery equipment costing R250 000 depreciates at 15% p.a. on the reducing-balance method. How many years will it take to depreciate to half its original value (R125 000)?',
      options: [
        '3,33 years',
        '4,27 years',
        '4,98 years',
        '6,67 years'
      ],
      correctIndex: 1,
      explanation: 'Using A = P(1 - i)^n: 125 000 = 250 000(1 - 0,15)^n -> 0,5 = (0,85)^n. Taking logs: n = log(0,5) / log(0,85) = -0,30103 / -0,07058 = 4,27 years.',
      concept: 'Reducing-balance depreciation uses A = P(1 - i)^n; solving for time n requires logarithms: n = log(A/P) / log(1 - i).'
    },
    {
      id: 'nsc_math_d4',
      subject: 'mathematics',
      topicId: 'math_seq',
      difficulty: 'difficult',
      question: 'A graduate takes a car loan of R180 000 at 12% p.a. compounded monthly, repaid in 60 equal monthly instalments starting one month after the loan is granted. Calculate the monthly instalment x.',
      options: [
        'R3 600,00',
        'R4 004,00',
        'R2 204,19',
        'R4 800,00'
      ],
      correctIndex: 1,
      explanation: 'Use the present-value annuity formula P = x[1 - (1 + i)^(-n)] / i with P = 180 000, i = 0,12 / 12 = 0,01, and n = 60: x = (180 000 * 0,01) / [1 - (1,01)^(-60)] = 1 800 / 0,4495504 = R4 004,00.',
      concept: 'Loans repaid in equal instalments use the Present Value annuity formula P = x[1 - (1 + i)^(-n)] / i, whereas savings/sinking funds use Future Value F.'
    },
    {
      id: 'nsc_math_d5',
      subject: 'mathematics',
      topicId: 'math_func',
      difficulty: 'difficult',
      question: 'Given the parabola f(x) = -(x - 2)^2 + 5, how can the domain of f be restricted so that its inverse f^(-1) is a function, and what will the domain of f^(-1) be?',
      options: [
        'Restrict domain of f to x >= 2 (or x <= 2); domain of f^(-1) is x <= 5',
        'Restrict domain of f to x >= 0; domain of f^(-1) is x >= 5',
        'Restrict domain of f to x <= 5; domain of f^(-1) is x >= 2',
        'No restriction needed; domain of f^(-1) is all real numbers'
      ],
      correctIndex: 0,
      explanation: 'A parabola fails the horizontal line test unless restricted to one branch from its axis of symmetry x = 2 (either x >= 2 or x <= 2). The range of f is y <= 5, which swaps to become the domain x <= 5 of f^(-1).',
      concept: 'To make a quadratic\'s inverse a function, restrict the domain of f at the axis of symmetry x = p; the range of f becomes the domain of f^(-1).'
    },
    {
      id: 'nsc_math_d6',
      subject: 'mathematics',
      topicId: 'math_func',
      difficulty: 'difficult',
      question: 'Parabola f(x) = x^2 - 4 (roots at -2 and 2) and straight line g(x) = x - 2 (root at 2) are sketched on the same axes. For which values of x is f(x) * g(x) <= 0?',
      options: [
        'x <= -2 or x = 2',
        '-2 <= x <= 2',
        'x >= 2',
        'x <= -2 only'
      ],
      correctIndex: 0,
      explanation: 'f(x) * g(x) = (x + 2)(x - 2)(x - 2) = (x + 2)(x - 2)^2 <= 0. Since (x - 2)^2 >= 0 for all real x (and equals 0 at x = 2), the product is <= 0 when x + 2 <= 0 (so x <= -2) OR at the shared root x = 2!',
      concept: 'Watch repeated roots in product inequalities f(x)*g(x) <= 0: at x = 2 the expression equals 0, so x = 2 must be included alongside x <= -2.'
    },
    {
      id: 'nsc_math_d7',
      subject: 'mathematics',
      topicId: 'math_calc',
      difficulty: 'difficult',
      question: 'Determine the coordinates of the point of inflection of f(x) = -x^3 + 6x^2 - 9x + 4 and state for which x-values f is concave up.',
      options: [
        '(2; 2); concave up for x < 2',
        '(2; 2); concave up for x > 2',
        '(1; 0); concave up for x > 1',
        '(-2; 62); concave up for x < -2'
      ],
      correctIndex: 0,
      explanation: 'f\'(x) = -3x^2 + 12x - 9 and f\'\'(x) = -6x + 12. Setting f\'\'(x) = 0 gives x = 2, and f(2) = -8 + 24 - 18 + 4 = 2, so the point of inflection is (2; 2). Concave up occurs where f\'\'(x) > 0: -6x + 12 > 0 -> x < 2.',
      concept: 'Concavity test: f is concave up where f\'\'(x) > 0, concave down where f\'\'(x) < 0, and changes concavity at the point of inflection where f\'\'(x) = 0.'
    },
    {
      id: 'nsc_math_d8',
      subject: 'mathematics',
      topicId: 'math_calc',
      difficulty: 'difficult',
      question: 'A farmer has 120 m of fencing to enclose a rectangular kraal built against a straight stone wall (no fencing is needed along the wall). What is the maximum area that can be enclosed?',
      options: [
        '900 m^2',
        '1 600 m^2',
        '1 800 m^2',
        '3 600 m^2'
      ],
      correctIndex: 2,
      explanation: 'Let width perpendicular to the wall be x; then length parallel to the wall is L = 120 - 2x. Area A(x) = x(120 - 2x) = 120x - 2x^2. Differentiating: A\'(x) = 120 - 4x = 0 -> x = 30 m and L = 60 m. Maximum area = 30 * 60 = 1 800 m^2.',
      concept: 'Calculus optimisation steps: express the target quantity in one variable using the constraint, set derivative = 0, and substitute back for the optimum value.'
    },
    {
      id: 'nsc_math_d9',
      subject: 'mathematics',
      topicId: 'math_geom',
      difficulty: 'difficult',
      question: 'If sin(26 degrees) = p, express cos(52 degrees) in terms of p without using a calculator.',
      options: [
        '1 - 2p^2',
        '2p^2 - 1',
        'sqrt(1 - p^2)',
        '2p'
      ],
      correctIndex: 0,
      explanation: 'Notice 52 degrees = 2 * 26 degrees. Using the cosine double-angle identity involving sine: cos(2A) = 1 - 2sin^2(A), so cos(52 degrees) = 1 - 2sin^2(26 degrees) = 1 - 2p^2.',
      concept: 'Choose whichever of the three forms of cos(2A) — cos^2A - sin^2A, 2cos^2A - 1, or 1 - 2sin^2A — matches the given ratio directly.'
    },
    {
      id: 'nsc_math_d10',
      subject: 'mathematics',
      topicId: 'math_geom',
      difficulty: 'difficult',
      question: 'In triangle PQR, S lies on PQ and T lies on PR such that ST || QR and PS : SQ = 3 : 2. Determine the ratio Area(triangle PST) : Area(triangle PQR).',
      options: [
        '3 : 5',
        '3 : 2',
        '9 : 25',
        '9 : 4'
      ],
      correctIndex: 2,
      explanation: 'Because PS : SQ = 3 : 2, PS : PQ = 3 : (3 + 2) = 3 : 5. Since ST || QR, triangle PST is similar to triangle PQR (AAA). The ratio of areas of similar triangles equals the square of the ratio of corresponding sides: (3 / 5)^2 = 9 / 25.',
      concept: 'Common Paper 2 trap: add parts first to get the whole side PQ = 3 + 2 = 5, and square the linear scale factor (3/5)^2 when comparing areas of similar triangles.'
    },

    // =========================================================================
    // 2. MATHEMATICAL LITERACY (CAPS) — 30 Questions
    // =========================================================================
    {
      id: 'nsc_mlit_e1',
      subject: 'math_lit',
      topicId: 'mlit_fin',
      difficulty: 'easy',
      question: 'A pair of school shoes in South Africa has a VAT-inclusive price tag of R460,00 (VAT = 15%). Calculate the price excluding VAT.',
      options: [
        'R391,00',
        'R400,00',
        'R445,00',
        'R529,00'
      ],
      correctIndex: 1,
      explanation: 'A VAT-inclusive price represents 115% (1,15) of the VAT-exclusive price. Dividing R460,00 by 1,15 gives R400,00 (with R60,00 VAT). Never subtract 15% of R460!',
      concept: 'To remove 15% South African VAT from a VAT-inclusive total, divide by 1,15 (or multiply by 15/115 to isolate the VAT amount directly).'
    },
    {
      id: 'nsc_mlit_e2',
      subject: 'math_lit',
      topicId: 'mlit_fin',
      difficulty: 'easy',
      question: 'Thabo invests R8 000 in an account paying 9,5% per annum simple interest for 4 years. How much interest does he earn over the 4 years?',
      options: [
        'R760,00',
        'R3 040,00',
        'R11 040,00',
        'R3 501,30'
      ],
      correctIndex: 1,
      explanation: 'Simple interest I = P * r * t = R8 000 * 0,095 * 4 = R760 * 4 = R3 040,00. (R11 040,00 is the total accumulated amount, whereas the question asks for the interest earned.)',
      concept: 'Read carefully whether a finance question asks for Interest Earned (I) or Total Final Amount (A = P + I).'
    },
    {
      id: 'nsc_mlit_e3',
      subject: 'math_lit',
      topicId: 'mlit_meas',
      difficulty: 'easy',
      question: 'A catering recipe requires 2,5 litres of sunflower oil. How many millilitres (mL) is this (1 L = 1 000 mL)?',
      options: [
        '250 mL',
        '2 500 mL',
        '25 000 mL',
        '0,0025 mL'
      ],
      correctIndex: 1,
      explanation: 'Multiply litres by 1 000 to convert to millilitres: 2,5 * 1 000 = 2 500 mL.',
      concept: 'Metric capacity conversions: kL -(x1000)-> L -(x1000)-> mL (and 1 mL = 1 cm^3; 1 kL = 1 m^3).'
    },
    {
      id: 'nsc_mlit_e4',
      subject: 'math_lit',
      topicId: 'mlit_meas',
      difficulty: 'easy',
      question: 'An imported muffin recipe specifies an oven temperature of 356 degrees Fahrenheit. Convert this to degrees Celsius using: C = (F - 32) / 1,8.',
      options: [
        '162 degrees Celsius',
        '180 degrees Celsius',
        '198 degrees Celsius',
        '215 degrees Celsius'
      ],
      correctIndex: 1,
      explanation: 'Substitute F = 356 into the given formula: C = (356 - 32) / 1,8 = 324 / 1,8 = 180 degrees Celsius.',
      concept: 'Follow BODMAS strictly in temperature formulas: complete the bracket subtraction (F - 32) before dividing by 1,8.'
    },
    {
      id: 'nsc_mlit_e5',
      subject: 'math_lit',
      topicId: 'mlit_maps',
      difficulty: 'easy',
      question: 'A regional road map uses a number scale of 1 : 50 000. Two clinics are 4 cm apart on the map. What is the actual straight-line distance between them in kilometres?',
      options: [
        '0,2 km',
        '2 km',
        '20 km',
        '200 km'
      ],
      correctIndex: 1,
      explanation: 'Actual distance = 4 cm * 50 000 = 200 000 cm. Since 1 km = 100 000 cm (100 cm/m * 1 000 m/km), 200 000 / 100 000 = 2 km.',
      concept: '1 km equals 100 000 cm; multiply map measurement (cm) by the scale factor and divide by 100 000 to get kilometres.'
    },
    {
      id: 'nsc_mlit_e6',
      subject: 'math_lit',
      topicId: 'mlit_maps',
      difficulty: 'easy',
      question: 'A bus travels 405 km from Polokwane to Pretoria/Johannesburg stops in 4 hours 30 minutes. Calculate its average speed in km/h (Speed = Distance / Time).',
      options: [
        '94,2 km/h',
        '90 km/h',
        '81 km/h',
        '101,25 km/h'
      ],
      correctIndex: 1,
      explanation: 'Convert 4 hours 30 minutes to decimal hours first: 4 + (30 / 60) = 4,5 hours (NEVER 4,3 hours!). Average speed = 405 km / 4,5 h = 90 km/h.',
      concept: '30 minutes is 30/60 = 0,5 hours, not 0,3 hours—always divide minutes by 60 before substituting into speed-distance-time formulas.'
    },
    {
      id: 'nsc_mlit_e7',
      subject: 'math_lit',
      topicId: 'mlit_data',
      difficulty: 'easy',
      question: 'Determine the median of the following eight test marks: 42; 48; 51; 55; 60; 64; 72; 80.',
      options: [
        '55',
        '57,5',
        '59',
        '60'
      ],
      correctIndex: 1,
      explanation: 'The 8 values are already in ascending order. With an even number of values, the median is the average of the two middle values (4th and 5th): (55 + 60) / 2 = 57,5.',
      concept: 'For an even count n of ordered data values, the median lies halfway between position n/2 and position (n/2) + 1.'
    },
    {
      id: 'nsc_mlit_e8',
      subject: 'math_lit',
      topicId: 'mlit_data',
      difficulty: 'easy',
      question: 'How is "the number of passengers inside a minibus taxi" classified in Data Handling?',
      options: [
        'Continuous numerical data',
        'Discrete numerical data',
        'Categorical nominal data',
        'Qualitative data'
      ],
      correctIndex: 1,
      explanation: 'Passengers are counted in whole numbers only (you cannot have 11,4 passengers), making this discrete numerical data. Measurements like height or mass are continuous.',
      concept: 'Discrete data comes from counting whole items; continuous data comes from measuring on a scale where decimals/fractions are possible.'
    },
    {
      id: 'nsc_mlit_e9',
      subject: 'math_lit',
      topicId: 'mlit_prob',
      difficulty: 'easy',
      question: 'A bag contains 5 red, 7 blue, and 8 yellow counters. One counter is drawn at random. What is the probability (as a percentage) that it is NOT blue?',
      options: [
        '35%',
        '65%',
        '40%',
        '70%'
      ],
      correctIndex: 1,
      explanation: 'Total counters = 5 + 7 + 8 = 20. Counters that are not blue = 5 red + 8 yellow = 13. Probability = 13 / 20 = 0,65 = 65%.',
      concept: 'Complementary probability: P(not A) = 1 - P(A) = 100% - 35% = 65%.'
    },
    {
      id: 'nsc_mlit_e10',
      subject: 'math_lit',
      topicId: 'mlit_prob',
      difficulty: 'easy',
      question: 'If the exchange rate is R18,50 = $1,00 USD, how many South African Rand equal $240 USD (ignoring bank commission)?',
      options: [
        'R12,97',
        'R4 440,00',
        'R4 200,00',
        'R258,50'
      ],
      correctIndex: 1,
      explanation: 'Multiply US dollars by the Rand-per-dollar rate: 240 * R18,50 = R4 440,00.',
      concept: 'Set up currency conversions as an equivalent ratio ($1 : R18,50 = $240 : x) so you never confuse multiplying vs dividing.'
    },
    {
      id: 'nsc_mlit_m1',
      subject: 'math_lit',
      topicId: 'mlit_fin',
      difficulty: 'medium',
      question: 'A municipality charges residential water on a stepped tariff (excl. VAT):\nBlock 1 (0 - 6 kL): R0,00/kL\nBlock 2 (>6 - 15 kL): R18,00/kL\nBlock 3 (>15 - 30 kL): R26,00/kL\nCalculate the charge (excl. VAT) for a household that uses 22 kL in one month.',
      options: [
        'R572,00',
        'R344,00',
        'R416,00',
        'R396,00'
      ],
      correctIndex: 1,
      explanation: 'Split 22 kL across the blocks: Block 1 uses 6 kL @ R0 = R0; Block 2 uses maximum 9 kL (15 - 6) @ R18 = R162; Block 3 uses remaining 7 kL (22 - 15) @ R26 = R182. Total = 0 + 162 + 182 = R344,00.',
      concept: 'Stepped tariffs never charge all units at the top rate—allocate consumption sequentially into each block width (6 + 9 + 7 = 22 kL).'
    },
    {
      id: 'nsc_mlit_m2',
      subject: 'math_lit',
      topicId: 'mlit_fin',
      difficulty: 'medium',
      question: 'Lerato earns a gross monthly salary of R14 500 (below the UIF ceiling). How much is deducted from HER payslip for the Unemployment Insurance Fund (UIF), and what is paid over to SARS/UIF in total?',
      options: [
        'R145,00 deducted from payslip; R290,00 paid over in total (including employer\'s 1%)',
        'R290,00 deducted from payslip; R290,00 paid over in total',
        'R145,00 deducted from payslip; R145,00 paid over in total',
        'R2 175,00 deducted from payslip (15%)'
      ],
      correctIndex: 0,
      explanation: 'In South Africa, an employee contributes 1% of gross remuneration (0,01 * R14 500 = R145,00 deducted from her salary) and the employer contributes a matching 1% (R145,00), giving 2% (R290,00) remitted in total.',
      concept: 'South African UIF rule: 1% employee deduction on the payslip + 1% employer contribution = 2% total remittance (capped at the statutory UIF earnings ceiling).'
    },
    {
      id: 'nsc_mlit_m3',
      subject: 'math_lit',
      topicId: 'mlit_meas',
      difficulty: 'medium',
      question: 'A cylindrical rainwater tank has an internal radius of 0,8 m and height of 2,5 m. Calculate its capacity to the nearest litre (use V = pi * r^2 * h, pi = 3,142, and 1 m^3 = 1 000 L).',
      options: [
        '6 284 L',
        '5 027 L',
        '503 L',
        '2 011 L'
      ],
      correctIndex: 1,
      explanation: 'Volume V = 3,142 * (0,8)^2 * 2,5 = 3,142 * 0,64 * 2,5 = 5,0272 m^3. Multiplying by 1 000 L/m^3 gives 5 027,2 L -> 5 027 litres.',
      concept: 'Square the radius (not the diameter!) in V = pi * r^2 * h, and remember 1 cubic metre holds exactly 1 000 litres (1 kilolitre).'
    },
    {
      id: 'nsc_mlit_m4',
      subject: 'math_lit',
      topicId: 'mlit_meas',
      difficulty: 'medium',
      question: 'Calculate the Body Mass Index (BMI) of an adult with a mass of 73,5 kg and a height of 175 cm (BMI = mass in kg / [height in m]^2).',
      options: [
        '42,0 kg/m^2',
        '24,0 kg/m^2',
        '0,0024 kg/m^2',
        '21,0 kg/m^2'
      ],
      correctIndex: 1,
      explanation: 'Convert height to metres first: 175 cm / 100 = 1,75 m. BMI = 73,5 / (1,75)^2 = 73,5 / 3,0625 = 24,0 kg/m^2 (within the normal 18,5 - 24,9 range).',
      concept: 'Always convert height from centimetres to metres (divide by 100) and square the height before dividing mass in BMI calculations.'
    },
    {
      id: 'nsc_mlit_m5',
      subject: 'math_lit',
      topicId: 'mlit_maps',
      difficulty: 'medium',
      question: 'Why do CAPS examiners prefer a bar (linear) scale over a number (ratio) scale when a tourist map is photocopied onto a smaller A5 handout?',
      options: [
        'A bar scale shrinks or enlarges in exact proportion with the map image, whereas a printed ratio like 1 : 20 000 becomes inaccurate after resizing',
        'Number scales can only measure straight roads in miles',
        'Bar scales never require any measurement with a ruler',
        'Number scales automatically update themselves when photocopied'
      ],
      correctIndex: 0,
      explanation: 'When a page is reduced or enlarged, 1 cm on the new printout no longer represents the original real-world distance stated in 1 : 20 000, whereas the printed bar scale shrinks by the exact same factor as the map.',
      concept: 'Advantage of a bar scale: remains valid after image resizing/photocopying; disadvantage: requires measuring the bar segments carefully.'
    },
    {
      id: 'nsc_mlit_m6',
      subject: 'math_lit',
      topicId: 'mlit_maps',
      difficulty: 'medium',
      question: 'On a house floor plan drawn to a scale of 1 : 75, a rectangular bedroom measures 6,0 cm by 4,8 cm. Calculate the actual floor area of the bedroom in m^2.',
      options: [
        '21,6 m^2',
        '16,2 m^2',
        '2,16 m^2',
        '162 m^2'
      ],
      correctIndex: 1,
      explanation: 'Convert BOTH dimensions to real metres BEFORE multiplying for area: Real length = (6,0 * 75) / 100 = 4,5 m; Real width = (4,8 * 75) / 100 = 3,6 m. Actual area = 4,5 m * 3,6 m = 16,2 m^2.',
      concept: 'Convert scaled lengths to real metres BEFORE calculating area—never multiply 6 * 4,8 = 28,8 cm^2 by 75 only once!'
    },
    {
      id: 'nsc_mlit_m7',
      subject: 'math_lit',
      topicId: 'mlit_data',
      difficulty: 'medium',
      question: 'A box-and-whisker plot of Grade 12 trial marks shows: Minimum = 28, Q1 = 44, Median = 58, Q3 = 73, Maximum = 91. Calculate the interquartile range (IQR) and explain what percentage of learners fall inside it.',
      options: [
        'IQR = 63; middle 75% of learners',
        'IQR = 29; middle 50% of learners',
        'IQR = 15; bottom 25% of learners',
        'IQR = 29; top 75% of learners'
      ],
      correctIndex: 1,
      explanation: 'IQR = Q3 - Q1 = 73 - 44 = 29 marks. Because 25% of values lie below Q1 and 25% lie above Q3, the box from Q1 to Q3 spans the middle 50% of the class.',
      concept: 'Each section of a box-and-whisker plot (Min-Q1, Q1-Q2, Q2-Q3, Q3-Max) contains 25% of the dataset regardless of how wide or narrow that section looks.'
    },
    {
      id: 'nsc_mlit_m8',
      subject: 'math_lit',
      topicId: 'mlit_data',
      difficulty: 'medium',
      question: 'On a South African clinic Road-to-Health chart, a 2-year-old boy\'s mass plots on the 75th percentile curve. What does this mean?',
      options: [
        'The boy weighs 75% of an adult\'s ideal mass',
        '75% of boys of the same age weigh the same as or less than this boy (and 25% weigh more)',
        'The boy is 75% overweight and requires urgent medical treatment',
        'The boy gained 75 grams during the past month'
      ],
      correctIndex: 1,
      explanation: 'A growth percentile compares a child against a reference population of the same age and biological sex: being at the 75th percentile means 75% of 2-year-old boys weigh at or below his mass and 25% weigh more.',
      concept: 'Percentiles indicate relative standing out of 100 peers (ranking), never a percentage of total mass or a test mark.'
    },
    {
      id: 'nsc_mlit_m9',
      subject: 'math_lit',
      topicId: 'mlit_prob',
      difficulty: 'medium',
      question: 'Nomsa sells kotas at a taxi rank. Her fixed monthly stall rent is R1 800, ingredients cost R16 per kota, and she sells each kota for R31. How many kotas must she sell per month to break even?',
      options: [
        '58 kotas',
        '113 kotas',
        '120 kotas',
        '150 kotas'
      ],
      correctIndex: 2,
      explanation: 'At break-even, Total Income = Total Cost: 31n = 1 800 + 16n -> 15n = 1 800 -> n = 1 800 / 15 = 120 kotas (where both income and total cost equal R3 720).',
      concept: 'Break-even quantity = Fixed Costs / (Selling Price per unit - Variable Cost per unit); at break-even, profit is R0.'
    },
    {
      id: 'nsc_mlit_m10',
      subject: 'math_lit',
      topicId: 'mlit_prob',
      difficulty: 'medium',
      question: 'A loaf of brown bread costs R18,00. If annual food inflation is 6% in Year 1 and 5% in Year 2, what will the loaf cost at the end of Year 2?',
      options: [
        'R19,98',
        'R20,03',
        'R19,80',
        'R29,00'
      ],
      correctIndex: 1,
      explanation: 'Inflation compounds on the previous year\'s price: End of Year 1 = R18,00 * 1,06 = R19,08. End of Year 2 = R19,08 * 1,05 = R20,034 -> R20,03. (Adding 6% + 5% = 11% gives R19,98, which misses compounding!)',
      concept: 'Multi-year inflation works like compound interest: multiply sequentially by (1 + rate_1)(1 + rate_2) rather than summing the rates.'
    },
    {
      id: 'nsc_mlit_d1',
      subject: 'math_lit',
      topicId: 'mlit_fin',
      difficulty: 'difficult',
      question: 'A 34-year-old teacher has an annual taxable income of R320 000 (no medical aid credits). Using the SARS bracket:\nR237 101 - R370 500: R42 678 + 26% of taxable income above R237 100\nand Primary Rebate (under 65) = R17 235, calculate her annual income tax payable.',
      options: [
        'R64 232,00',
        'R46 997,00',
        'R65 965,00',
        'R25 443,00'
      ],
      correctIndex: 1,
      explanation: 'Step 1 (Bracket tax): 42 678 + 0,26 * (320 000 - 237 100) = 42 678 + 0,26 * 82 900 = 42 678 + 21 554 = R64 232. Step 2 (Subtract primary rebate): 64 232 - 17 235 = R46 997,00 per year.',
      concept: 'SARS tax sequence: determine annual taxable income (gross - pension), apply bracket formula to excess above bracket floor, then subtract age rebates (and medical tax credits if applicable).'
    },
    {
      id: 'nsc_mlit_d2',
      subject: 'math_lit',
      topicId: 'mlit_fin',
      difficulty: 'difficult',
      question: 'A fridge has a cash price of R10 000. On hire-purchase (HP), a buyer pays a 10% deposit, a once-off R750 initiation fee, and 24 monthly instalments of R485,00. How much MORE does the HP option cost than buying cash?',
      options: [
        'R1 640,00',
        'R2 640,00',
        'R3 390,00',
        'R13 390,00'
      ],
      correctIndex: 2,
      explanation: 'Deposit = 10% of R10 000 = R1 000. Instalments = 24 * R485 = R11 640. Total HP cost = R1 000 + R750 + R11 640 = R13 390. Extra paid above R10 000 cash price = 13 390 - 10 000 = R3 390,00.',
      concept: 'Total Hire-Purchase Cost = Deposit + Admin/Initiation Fees + (Number of Months * Monthly Instalment); subtract Cash Price to find the extra cost of credit.'
    },
    {
      id: 'nsc_mlit_d3',
      subject: 'math_lit',
      topicId: 'mlit_meas',
      difficulty: 'difficult',
      question: 'A rectangular lounge measures 5,0 m by 4,0 m. Porcelain tiles are sold ONLY in full boxes covering 1,44 m^2 per box, and the tiler adds 10% extra area for cutting and breakage. How many boxes must be bought?',
      options: [
        '14 boxes',
        '15 boxes',
        '15,28 boxes',
        '16 boxes'
      ],
      correctIndex: 3,
      explanation: 'Floor area = 5,0 * 4,0 = 20 m^2. Adding 10% wastage: 20 * 1,10 = 22 m^2 needed. Boxes = 22 / 1,44 = 15,28 boxes. Because shops sell full boxes only and 15 boxes (21,6 m^2) is short, you MUST round UP to 16 boxes.',
      concept: 'Contextual rounding rule: round UP to the next whole box/tin/bag when buying building materials, but round DOWN when calculating how many full items can be made from a fixed supply.'
    },
    {
      id: 'nsc_mlit_d4',
      subject: 'math_lit',
      topicId: 'mlit_meas',
      difficulty: 'difficult',
      question: 'The four interior walls of a room have a total perimeter of 18 m and height of 2,6 m. The room has one door (0,8 m by 2,0 m) and one window (1,5 m by 1,2 m) that are NOT painted. If TWO coats of paint are applied at a spread rate of 8 m^2 per litre, how many litres of paint are needed?',
      options: [
        '5,43 L',
        '10,85 L',
        '11,70 L',
        '8,68 L'
      ],
      correctIndex: 1,
      explanation: 'Gross wall area = 18 * 2,6 = 46,8 m^2. Door = 1,6 m^2; Window = 1,8 m^2. Net area for 1 coat = 46,8 - 1,6 - 1,8 = 43,4 m^2. Two coats = 43,4 * 2 = 86,8 m^2. Litres = 86,8 / 8 = 10,85 L.',
      concept: 'Subtract unpainted openings (doors/windows) from gross wall area BEFORE multiplying by the number of coats and dividing by spread rate.'
    },
    {
      id: 'nsc_mlit_d5',
      subject: 'math_lit',
      topicId: 'mlit_maps',
      difficulty: 'difficult',
      question: 'A family drives from Johannesburg to Durban (570 km one way) and back along the N3. Their car\'s average fuel consumption is 6,5 litres per 100 km and petrol costs R22,40 per litre. Calculate the total petrol cost for the RETURN trip.',
      options: [
        'R829,92',
        'R1 659,84',
        'R3 931,20',
        'R1 456,00'
      ],
      correctIndex: 1,
      explanation: 'Return distance = 570 km * 2 = 1 140 km. Fuel required = (1 140 / 100) * 6,5 = 11,4 * 6,5 = 74,1 litres. Total petrol cost = 74,1 * R22,40 = R1 659,84.',
      concept: 'Watch the word "return trip" (multiply one-way distance by 2!) and divide distance by 100 when fuel consumption is quoted in L / 100 km.'
    },
    {
      id: 'nsc_mlit_d6',
      subject: 'math_lit',
      topicId: 'mlit_maps',
      difficulty: 'difficult',
      question: 'A direct flight departs OR Tambo International Airport (Johannesburg, UTC+2) at 21:40 on Tuesday for London Heathrow (winter time, UTC+0). If the flight takes 11 hours 15 minutes, at what local London time and day does it land?',
      options: [
        '08:55 on Wednesday',
        '06:55 on Wednesday',
        '10:55 on Wednesday',
        '18:55 on Tuesday'
      ],
      correctIndex: 1,
      explanation: 'Landing time in SAST (UTC+2): 21:40 Tuesday + 11 h 15 min = 08:55 Wednesday (SA time). London (UTC+0) is 2 hours BEHIND South Africa (UTC+2), so 08:55 - 2 hours = 06:55 on Wednesday local London time.',
      concept: 'Time-zone travel method: convert departure + flight duration in one time zone first, then add (flying east) or subtract (flying west) the UTC offset difference.'
    },
    {
      id: 'nsc_mlit_d7',
      subject: 'math_lit',
      topicId: 'mlit_data',
      difficulty: 'difficult',
      question: 'Six staff members at a small workshop earn monthly salaries of: R8 500; R9 000; R9 500; R10 000; R11 000; and R72 000 (the owner). Why is the median (R9 750) a fairer measure of typical worker pay than the mean (R20 000)?',
      options: [
        'The mean of R20 000 is inflated by the extreme outlier (R72 000) and exceeds the pay of 5 out of the 6 staff, whereas the median is unaffected by outliers',
        'The median always uses every digit of the highest salary in its calculation',
        'The mean was calculated incorrectly because salaries cannot be averaged',
        'The mode is R20 000 so the mean is redundant'
      ],
      correctIndex: 0,
      explanation: 'Sum = R120 000, so Mean = R120 000 / 6 = R20 000—nearly double what any non-owner earns! Because the R72 000 outlier pulls the mean sharply upward, the median (average of R9 500 and R10 000 = R9 750) accurately reflects typical staff earnings.',
      concept: 'Always justify choosing the median over the mean by naming the specific outlier value and showing how it skews the mean away from most data points.'
    },
    {
      id: 'nsc_mlit_d8',
      subject: 'math_lit',
      topicId: 'mlit_data',
      difficulty: 'difficult',
      question: 'Sipho\'s mean mark across 5 assessments is 64%. What mark must he score in Assessment 6 (equally weighted) to raise his overall mean across all 6 assessments to 68%?',
      options: [
        '72%',
        '66%',
        '88%',
        '84%'
      ],
      correctIndex: 2,
      explanation: 'Current total across 5 tests = 5 * 64 = 320. Target total across 6 tests = 6 * 68 = 408. Required mark in Test 6 = 408 - 320 = 88%.',
      concept: 'Reverse-mean strategy: multiply Mean * Count to compare total sums (Target Sum - Current Sum = Missing Value).'
    },
    {
      id: 'nsc_mlit_d9',
      subject: 'math_lit',
      topicId: 'mlit_prob',
      difficulty: 'difficult',
      question: 'A gift box holds 6 milk chocolates and 4 dark chocolates. Two chocolates are chosen and eaten one after the other at random (without replacement). What is the probability that BOTH chocolates eaten are dark?',
      options: [
        '16 / 100 (16%)',
        '2 / 15 (13,3%)',
        '8 / 10 (80%)',
        '1 / 5 (20%)'
      ],
      correctIndex: 1,
      explanation: 'First draw P(dark) = 4 / 10. Because the first chocolate is eaten (no replacement), 3 dark chocolates remain out of 9 total: second draw P(dark) = 3 / 9. Combined probability = (4 / 10) * (3 / 9) = 12 / 90 = 2 / 15 (approx. 13,3%).',
      concept: 'Without replacement, reduce BOTH the total denominator (10 -> 9) and the matching category numerator (4 -> 3) on the second branch.'
    },
    {
      id: 'nsc_mlit_d10',
      subject: 'math_lit',
      topicId: 'mlit_prob',
      difficulty: 'difficult',
      question: 'An employee\'s monthly salary increases from R15 000 to R15 750 while annual CPI inflation over the same period is 6,8%. What happened to her real purchasing power?',
      options: [
        'Her purchasing power increased by 5,0% because she earns R750 more in cash',
        'Her purchasing power decreased because her 5,0% salary increase was lower than the 6,8% CPI inflation rate',
        'Her purchasing power increased by 1,8% above inflation',
        'Her purchasing power stayed identical because CPI does not affect salaries'
      ],
      correctIndex: 1,
      explanation: 'Percentage salary increase = (750 / 15 000) * 100 = 5,0%. To maintain the same buying power at 6,8% inflation she needed R15 000 * 1,068 = R16 020. Because 5,0% < 6,8%, her real purchasing power declined.',
      concept: 'Real wage comparison: whenever % salary growth < % CPI inflation, real purchasing power falls even though nominal Rand pay is higher.'
    },

    // =========================================================================
    // 3. ENGLISH (HL & FAL) — 30 Questions
    // =========================================================================
    {
      id: 'nsc_eng_e1',
      subject: 'english',
      topicId: 'eng_comp',
      difficulty: 'easy',
      question: 'In Critical Language Awareness (Paper 1), what is the difference between the DENOTATION and CONNOTATION of a word?',
      options: [
        'Denotation is its literal dictionary definition; connotation is the emotional or cultural association it carries',
        'Denotation means a negative insult; connotation means a formal synonym',
        'Denotation applies only to verbs; connotation applies only to adjectives',
        'They are exact synonyms with no difference in meaning'
      ],
      correctIndex: 0,
      explanation: 'Denotation is the objective, literal dictionary meaning (e.g., "home" = a place where one lives), whereas connotation refers to implied emotional/cultural associations (warmth, safety, family).',
      concept: 'Writers manipulate connotations (e.g., "thrifty" vs "stingy") to shape reader attitude and tone even when literal denotations overlap.'
    },
    {
      id: 'nsc_eng_e2',
      subject: 'english',
      topicId: 'eng_comp',
      difficulty: 'easy',
      question: 'Which statement below is an OPINION rather than a verifiable FACT?',
      options: [
        'South Africa recognizes twelve official languages following the inclusion of South African Sign Language.',
        'Cape Town hosts the seat of the Parliament of South Africa.',
        'Physical Sciences is the most exciting and rewarding subject in the entire NSC curriculum.',
        'The National Senior Certificate uses a seven-level achievement scale.'
      ],
      correctIndex: 2,
      explanation: 'Evaluative adjectives like "most exciting and rewarding" express a personal value judgement that varies from person to person and cannot be objectively proved true or false.',
      concept: 'Facts can be verified with objective evidence; opinions contain subjective value judgements ("best", "most exciting", "unfair").'
    },
    {
      id: 'nsc_eng_e3',
      subject: 'english',
      topicId: 'eng_gram',
      difficulty: 'easy',
      question: 'Choose the verb form that maintains correct subject-verb concord: "Neither the coach nor the players ___ satisfied with the referee\'s call."',
      options: [
        'was',
        'were',
        'is',
        'has been'
      ],
      correctIndex: 1,
      explanation: 'Under the proximity rule for "neither... nor" and "either... or", the verb agrees with the subject closer to it ("the players", plural), so "were" is correct.',
      concept: 'Concord with correlative conjunctions ("neither A nor B", "either A or B"): match the verb in number to the nearer noun B.'
    },
    {
      id: 'nsc_eng_e4',
      subject: 'english',
      topicId: 'eng_gram',
      difficulty: 'easy',
      question: 'Identify the function of the apostrophe in the sentence: "The learners\' portfolios were moderated on Friday."',
      options: [
        'Omission (contraction of "learners are")',
        'Pluralisation of the noun "learner"',
        'Possession/ownership belonging to plural learners',
        'Possession belonging to one learner only'
      ],
      correctIndex: 2,
      explanation: 'Placed after the plural "-s" ("learners\'"), the apostrophe indicates plural possession—the portfolios belonging to multiple learners. (Never use an apostrophe simply to form a normal plural!)',
      concept: 'Apostrophes have ONLY two grammatical functions in English: contraction/omission ("don\'t", "it\'s") and possession ("learner\'s" singular vs "learners\'" plural).'
    },
    {
      id: 'nsc_eng_e5',
      subject: 'english',
      topicId: 'eng_voice',
      difficulty: 'easy',
      question: 'Rewrite in the passive voice: "The school choir sang the national anthem."',
      options: [
        'The national anthem is sung by the school choir.',
        'The national anthem was sung by the school choir.',
        'The national anthem had been sang by the school choir.',
        'The school choir was singing the national anthem.'
      ],
      correctIndex: 1,
      explanation: '"Sang" is simple past tense. In the passive voice, the object ("The national anthem") becomes the subject, paired with "was/were + past participle": "was sung by the school choir".',
      concept: 'Active-to-passive golden rule: NEVER change the tense—simple past active ("sang") becomes simple past passive ("was/were sung").'
    },
    {
      id: 'nsc_eng_e6',
      subject: 'english',
      topicId: 'eng_voice',
      difficulty: 'easy',
      question: 'Rewrite in indirect (reported) speech: Sipho said, "I am revising my Life Sciences notes today."',
      options: [
        'Sipho said that I am revising my Life Sciences notes today.',
        'Sipho said that he was revising his Life Sciences notes that day.',
        'Sipho said that he is revising his Life Sciences notes yesterday.',
        'Sipho asked if he was revising his Life Sciences notes that day.'
      ],
      correctIndex: 1,
      explanation: 'After past reporting verb "said", remove quotation marks, shift pronouns ("I/my" -> "he/his"), backshift present continuous to past continuous ("am revising" -> "was revising"), and change "today" to "that day".',
      concept: 'Indirect speech checklist: drop inverted commas, add "that/if", shift pronouns, backshift verb tense, and shift time/place adverbs ("today" -> "that day").'
    },
    {
      id: 'nsc_eng_e7',
      subject: 'english',
      topicId: 'eng_fig',
      difficulty: 'easy',
      question: 'Identify the figure of speech in: "The drought-stricken veld begged the dark clouds for mercy."',
      options: [
        'Simile',
        'Personification',
        'Euphemism',
        'Pun'
      ],
      correctIndex: 1,
      explanation: 'Attributing the human action and emotion of "begging for mercy" to the inanimate veld is personification.',
      concept: 'Personification gives human qualities, intentions, or emotions to non-human objects or abstract ideas to heighten vividness and empathy.'
    },
    {
      id: 'nsc_eng_e8',
      subject: 'english',
      topicId: 'eng_fig',
      difficulty: 'easy',
      question: 'Identify the figure of speech in the phrase "deafening silence".',
      options: [
        'Oxymoron',
        'Alliteration',
        'Litotes',
        'Hyperbole only'
      ],
      correctIndex: 0,
      explanation: 'Placing two directly contradictory words side-by-side ("deafening" and "silence") creates an oxymoron, emphasising how tense and overwhelming the silence felt.',
      concept: 'Oxymoron = two contradictory words placed directly next to each other; Paradox = a seemingly self-contradictory statement that reveals a deeper truth.'
    },
    {
      id: 'nsc_eng_e9',
      subject: 'english',
      topicId: 'eng_vis',
      difficulty: 'easy',
      question: 'In NSC Paper 1 advertising analysis, what do the letters AIDA stand for?',
      options: [
        'Audience, Imagery, Diction, Attitude',
        'Attention, Interest, Desire, Action',
        'Argument, Irony, Detail, Appeal',
        'Alliteration, Inference, Design, Authority'
      ],
      correctIndex: 1,
      explanation: 'Advertisers structure persuasive texts using AIDA: grab Attention (bold headline/visual), sustain Interest, build Desire for the benefit, and prompt Action (call to action / contact / "Buy now").',
      concept: 'When asked how an advert persuades using AIDA, link each stage to a specific feature in the text rather than merely listing the four words.'
    },
    {
      id: 'nsc_eng_e10',
      subject: 'english',
      topicId: 'eng_vis',
      difficulty: 'easy',
      question: 'Which practice loses marks in an NSC Paper 1 Question 2 prose summary?',
      options: [
        'Writing the 7 main points in a single coherent paragraph in your own words',
        'Recording an accurate word count at the end of the summary',
        'Exceeding the 90-word limit and lifting full sentences verbatim with quotations from the passage',
        'Crossing out your rough draft clearly before writing the final neat version'
      ],
      correctIndex: 2,
      explanation: 'Markers stop reading past the permitted word ceiling and penalise wholesale verbatim lifting/quoting; summaries must synthesise the required points concisely in your own words.',
      concept: 'NSC Summary rules: stick strictly to the word limit, omit examples/quotations/figurative fluff, write in full sentences, and state the exact word count.'
    },
    {
      id: 'nsc_eng_m1',
      subject: 'english',
      topicId: 'eng_comp',
      difficulty: 'medium',
      question: 'How should you structure a full-mark answer to a Paper 1 or Paper 2 question asking: "Comment on the effectiveness of the writer\'s diction in lines 10–12"?',
      options: [
        'Quote or identify the specific word/phrase, state its connotation, and explain how it reinforces the writer\'s message or tone in context',
        'Simply copy out lines 10–12 without explanation',
        'State "The writer\'s diction is very effective because it makes the reader want to read more"',
        'Count the number of syllables in lines 10–12'
      ],
      correctIndex: 0,
      explanation: 'Generic praise ("very effective / easy to understand") earns zero marks. Examiners require specific textual evidence (word choice) + unpacking its connotation + linking it to purpose/tone.',
      concept: 'NSC PEE/PEA rule for diction & imagery: Quote/Pinpoint the word -> Unpack its literal/connotative meaning -> Explain its contextual impact on tone or meaning.'
    },
    {
      id: 'nsc_eng_m2',
      subject: 'english',
      topicId: 'eng_comp',
      difficulty: 'medium',
      question: 'Identify the error of reasoning/language in the headline: "All teenagers are glued to their phones and refuse to read books."',
      options: [
        'Malapropism',
        'Stereotyping / Sweeping generalisation',
        'Spoonerism',
        'Euphemism'
      ],
      correctIndex: 1,
      explanation: 'Using the absolute quantifier "All teenagers" to assign an exaggerated negative habit to an entire age group without evidence is a sweeping generalisation / stereotype.',
      concept: 'In Critical Language Awareness, watch absolute words ("all", "never", "every") and emotive verbs ("glued") as markers of bias and stereotyping.'
    },
    {
      id: 'nsc_eng_m3',
      subject: 'english',
      topicId: 'eng_gram',
      difficulty: 'medium',
      question: 'Identify and correct the grammatical error in: "Walking through the school gate, the bell rang loudly."',
      options: [
        'Comma splice — replace the comma with a semicolon',
        'Misrelated / dangling participle — rewrite as: "As I was walking through the school gate, the bell rang loudly."',
        'Split infinitive — move "loudly" before "rang"',
        'Tautology — delete the word "loudly"'
      ],
      correctIndex: 1,
      explanation: 'As written, the participial phrase "Walking through the school gate" grammatically attaches to "the bell", absurdly implying the bell was walking! Supplying the human subject fixes the dangling participle.',
      concept: 'A participial phrase at the start of a sentence MUST be followed immediately after the comma by the noun/pronoun performing that action.'
    },
    {
      id: 'nsc_eng_m4',
      subject: 'english',
      topicId: 'eng_gram',
      difficulty: 'medium',
      question: 'Which error appears in the sentence: "The principal reiterated the announcement again at Monday\'s assembly"?',
      options: [
        'Malapropism',
        'Redundancy / Tautology ("reiterated" already means "said again")',
        'Ambiguity',
        'Incorrect concord'
      ],
      correctIndex: 1,
      explanation: '"Reiterate" means to state again/repeatedly, so adding "again" repeats the exact same meaning unnecessarily (redundancy / tautology). Correct by deleting "again".',
      concept: 'High-frequency Paper 1 Question 5 tautologies: "repeat again", "return back", "free gift", "past history", "reverse backwards", "in my opinion I think".'
    },
    {
      id: 'nsc_eng_m5',
      subject: 'english',
      topicId: 'eng_voice',
      difficulty: 'medium',
      question: 'Why might a newspaper editor deliberately choose the passive sentence "Three protesters were injured outside the municipality" instead of active voice?',
      options: [
        'To foreground the victims ("Three protesters") and omit or obscure the agent responsible when responsibility is unknown or politically sensitive',
        'Because passive voice is always shorter and punchier than active voice',
        'Because English grammar forbids active voice in headlines',
        'To turn the statement into a direct command'
      ],
      correctIndex: 0,
      explanation: 'Agentless passive constructions place focus on the receiver of the action while hiding or downplaying who performed the action—a key Critical Language Awareness concept in NSC Paper 1.',
      concept: 'Passive voice is appropriate when the recipient matters most, in objective scientific procedures, or (critically!) when a speaker conceals agency/blame.'
    },
    {
      id: 'nsc_eng_m6',
      subject: 'english',
      topicId: 'eng_voice',
      difficulty: 'medium',
      question: 'Convert into indirect speech: "Did you submit your SBA task yesterday?" the teacher asked Zanele.',
      options: [
        'The teacher asked Zanele did she submit her SBA task yesterday.',
        'The teacher asked Zanele whether she had submitted her SBA task the previous day.',
        'The teacher asked Zanele that had she submitted her SBA task the day before.',
        'The teacher told Zanele to submit her SBA task the previous day.'
      ],
      correctIndex: 1,
      explanation: 'Yes/No questions use "if" or "whether" (never "that"), restore statement word order ("she had submitted", NOT inverted "had she"), backshift simple past to past perfect ("did submit" -> "had submitted"), and shift "yesterday" -> "the previous day".',
      concept: 'Reported questions revert to statement word order (subject before verb) with a full stop—never keep question-mark inversion after "asked if/whether"!'
    },
    {
      id: 'nsc_eng_m7',
      subject: 'english',
      topicId: 'eng_fig',
      difficulty: 'medium',
      question: 'In unseen poetry analysis, what is ENJAMBMENT (run-on lines) and what effect does it typically create?',
      options: [
        'Repeating vowel sounds inside words to slow down the stanza',
        'Continuation of a sentence across a line break without terminal punctuation, accelerating rhythm, mimicking continuous motion, or building tension into the next line',
        'Ending every single line with a full stop to create a march-like beat',
        'Addressing a dead or absent person as though present'
      ],
      correctIndex: 1,
      explanation: 'Enjambment carries syntax and thought seamlessly from one poetic line into the next without a pause, creating forward momentum, natural speech flow, or suspense on the turn of the line.',
      concept: 'Always connect structural devices (enjambment, caesura, stanza length, volta) to the specific movement or emotion of that poem.'
    },
    {
      id: 'nsc_eng_m8',
      subject: 'english',
      topicId: 'eng_fig',
      difficulty: 'medium',
      question: 'Distinguish verbal IRONY from SARCASM in English Paper 1 and Paper 2.',
      options: [
        'Verbal irony expresses the opposite of what is literally meant (often subtly or wryly), whereas sarcasm is harsh, biting verbal irony specifically intended to mock or wound someone',
        'Irony only occurs in cartoons whereas sarcasm only occurs in Shakespearean drama',
        'Sarcasm means polite understatement whereas irony means exaggeration',
        'There is no distinction; examiners prohibit the word irony'
      ],
      correctIndex: 0,
      explanation: 'All sarcasm uses verbal irony (saying the opposite of what is meant), but sarcasm adds a sharp, ridiculing, or contemptuous tone aimed at a target, whereas irony can be situational, dramatic, or gently wry.',
      concept: 'Types of irony: Verbal (says opposite of meaning), Situational (outcome contradicts expectation), Dramatic (audience knows a truth hidden from a character).'
    },
    {
      id: 'nsc_eng_m9',
      subject: 'english',
      topicId: 'eng_vis',
      difficulty: 'medium',
      question: 'In a Paper 1 cartoon question: "How does the cartoonist show that the father is furious? Refer to BOTH visual and verbal clues (3)", what must your answer include?',
      options: [
        'Only a quote from the speech bubble',
        'At least one specific body-language/facial detail (e.g., clenched fists, wide eyes, sweat/motion lines) AND at least one text/speech-bubble feature (e.g., bold capital letters, exclamation marks, jagged bubble)',
        'Your personal opinion on parenting styles in South Africa',
        'A biography of the cartoonist'
      ],
      correctIndex: 1,
      explanation: 'Cartoon questions explicitly split marks between visual evidence (posture, facial features, motion lines) and verbal/typographic evidence (bold font, capitals, punctuation, jagged speech bubble, word choice).',
      concept: 'Never write vague cartoon answers like "He looks angry on his face"—describe exact physical features ("furrowed eyebrows, wide open mouth, pointing finger").'
    },
    {
      id: 'nsc_eng_m10',
      subject: 'english',
      topicId: 'eng_vis',
      difficulty: 'medium',
      question: 'Identify the specific language error in: "The municipal manager promised to illusion all residents about the new water schedule."',
      options: [
        'Spoonerism',
        'Malapropism ("illusion" confused with "enlighten" / "inform" or "allude")',
        'Comma splice',
        'Litotes'
      ],
      correctIndex: 1,
      explanation: 'A malapropism is the unintentional misuse of a word that sounds somewhat similar to the intended word (e.g., "comprehend" / "enlighten" / "inform" confused with a similar-sounding word, or classic "dance a flamingo" for "flamenco").',
      concept: 'Malapropism = wrong similar-sounding word ("flamingo" for "flamenco"); Spoonerism = swapping initial consonant sounds ("you have hissed all my mystery lectures").'
    },
    {
      id: 'nsc_eng_d1',
      subject: 'english',
      topicId: 'eng_comp',
      difficulty: 'difficult',
      question: 'Compare these two headlines reporting the exact same strike:\nText A: "Militant unionists paralyse commuter rail network"\nText B: "Exhausted rail workers stage peaceful safety protest"\nWhat does this contrast illustrate in Critical Language Awareness?',
      options: [
        'Both headlines use completely neutral, objective denotative register',
        'Positioning and ideological bias through emotive diction: Text A uses loaded words ("militant", "paralyse") to vilify strikers, whereas Text B ("exhausted", "peaceful safety") elicits reader sympathy',
        'Text A is written in passive voice whereas Text B is an oxymoron',
        'Grammatical concord errors in both headlines'
      ],
      correctIndex: 1,
      explanation: 'In CLA comparative questions, contrast specific loaded words from both texts to show how lexical choices position the reader for or against a group despite describing the same event.',
      concept: 'Comparative Paper 1 Question 1.10/1.11 strategy: quote contrasting diction from Text A and Text B and explain how each shapes reader attitude/tone.'
    },
    {
      id: 'nsc_eng_d2',
      subject: 'english',
      topicId: 'eng_comp',
      difficulty: 'difficult',
      question: 'In a comprehension passage, the author writes: "Sure, cutting library budgets will definitely create a generation of world-class thinkers—just as unplugging a fridge keeps milk fresh." Identify the tone and device.',
      options: [
        'Sincere, optimistic tone using literal description',
        'Sardonic / ironic tone combining verbal irony ("Sure... definitely") with a satirical analogy to expose the absurdity of cutting library funding',
        'Nostalgic, sentimental tone praising household appliances',
        'Neutral, encyclopaedic register'
      ],
      correctIndex: 1,
      explanation: 'The writer states the opposite of what is meant ("definitely create...") and pairs it with a ridiculous analogy ("unplugging a fridge") to mock the policy—producing an ironic/satirical tone.',
      concept: 'Avoid vague tone words like "nice", "bad", or "emotional"; use precise tone adjectives (ironic, sardonic, indignant, reverent, sombre, cynical).'
    },
    {
      id: 'nsc_eng_d3',
      subject: 'english',
      topicId: 'eng_gram',
      difficulty: 'difficult',
      question: 'Identify the error and correct punctuation fix in: "The Matric preliminary exams are demanding, learners must manage their sleep carefully."',
      options: [
        'Split infinitive — move "carefully" before "manage"',
        'Comma splice — two independent main clauses are joined by a comma alone; replace the comma with a semicolon, full stop, or subordinating conjunction ("because/so")',
        'Apostrophe error — write "learner\'s"',
        'No error; commas can join any two sentences'
      ],
      correctIndex: 1,
      explanation: 'Joining two complete finite main clauses ("exams are demanding" + "learners must manage...") with only a comma is a comma splice—one of the most frequently tested Paper 1 Q5 errors.',
      concept: 'Fix a comma splice in one of three ways: (1) full stop, (2) semicolon (;), or (3) coordinating/subordinating conjunction (", so" / "because").'
    },
    {
      id: 'nsc_eng_d4',
      subject: 'english',
      topicId: 'eng_gram',
      difficulty: 'difficult',
      question: 'Choose the grammatically correct sentence testing concord AND formal pronoun case:',
      options: [
        'The Principal, together with the HoDs, have invited Thandi and I to speak.',
        'The Principal, together with the HoDs, has invited Thandi and me to speak.',
        'The Principal, together with the HoDs, have invited Thandi and me to speak.',
        'The Principal, together with the HoDs, has invited Thandi and myself to speak.'
      ],
      correctIndex: 1,
      explanation: '1) Concord: parenthetical phrases introduced by "together with / as well as / accompanied by" do NOT pluralise a singular head subject ("The Principal... has"). 2) Object pronoun: after transitive verb "invited", use objective case "me" (test without "Thandi and": "invited me", not "invited I").',
      concept: 'Strip away ", together with..." to check singular concord, and strip away "Thandi and" to test subject ("I") vs object ("me") pronouns.'
    },
    {
      id: 'nsc_eng_d5',
      subject: 'english',
      topicId: 'eng_voice',
      difficulty: 'difficult',
      question: 'Choose the sentence that correctly uses the subjunctive mood for a hypothetical/contrary-to-fact condition in formal English:',
      options: [
        'If I was the Minister of Finance, I wouldhave abolish VAT on textbooks.',
        'If I were the Minister of Finance, I would exempt textbooks from VAT.',
        'If I am the Minister of Finance, I would exempted textbooks from VAT.',
        'Was I the Minister of Finance, I will exempt textbooks from VAT.'
      ],
      correctIndex: 1,
      explanation: 'Unreal or contrary-to-fact "if" clauses take the subjunctive "were" for all persons (including "I" and "he/she") paired with "would + bare infinitive" in the main clause.',
      concept: 'Formal hypothetical conditional (Type 2): "If + subject + were..., subject + would + base verb" (e.g., "If she were here, she would agree").'
    },
    {
      id: 'nsc_eng_d6',
      subject: 'english',
      topicId: 'eng_voice',
      difficulty: 'difficult',
      question: 'Convert into the passive voice, preserving exact modal and perfect aspect: "The admissions committee must have reviewed every application before noon."',
      options: [
        'Every application must be reviewed by the admissions committee before noon.',
        'Every application must have been reviewed by the admissions committee before noon.',
        'Every application had to be reviewed by the admissions committee before noon.',
        'Every application must has been reviewed by the admissions committee before noon.'
      ],
      correctIndex: 1,
      explanation: 'Modal perfect active ("must have + past participle") converts to modal perfect passive ("must have been + past participle"): "must have been reviewed".',
      concept: 'Modal passive patterns: "must review" -> "must be reviewed" (present) vs "must have reviewed" -> "must have been reviewed" (past modal).'
    },
    {
      id: 'nsc_eng_d7',
      subject: 'english',
      topicId: 'eng_fig',
      difficulty: 'difficult',
      question: 'In a Petrarchan (Italian) sonnet vs a Shakespearean (English) sonnet, where does the VOLTA (turn in thought/argument) characteristically occur?',
      options: [
        'Petrarchan: at line 9 between the octave (8 lines) and sestet (6 lines); Shakespearean: often at line 13 in the final rhyming couplet (or line 9)',
        'Both sonnets consist of 12 lines with no rhyme scheme or turn',
        'Petrarchan: in line 2; Shakespearean: in line 4',
        'Neither sonnet form ever shifts tone or argument'
      ],
      correctIndex: 0,
      explanation: 'A Petrarchan sonnet divides into an octave (abbaabba) posing a problem/tension and a sestet (line 9 volta) resolving or reframing it; a Shakespearean sonnet uses three quatrains (abab cdcd efef) climaxing in a epigrammatic rhyming couplet (gg) at lines 13–14.',
      concept: 'Identifying sonnet structure in NSC Paper 2 immediately tells you where to look for the shift in tone, perspective, or resolution (the volta).'
    },
    {
      id: 'nsc_eng_d8',
      subject: 'english',
      topicId: 'eng_fig',
      difficulty: 'difficult',
      question: 'Identify the two distinct figures of speech combined in: "The Crown announced that fifty extra hands had been hired at the royal dockyard."',
      options: [
        'Metonymy ("The Crown" representing the monarchy) and Synecdoche ("hands" — a part representing whole workers)',
        'Simile and Onomatopoeia',
        'Litotes and Pun',
        'Hyperbole and Anti-climax'
      ],
      correctIndex: 0,
      explanation: '"The Crown" substitutes a closely associated symbol/object for the monarch/state (metonymy), whereas "hands" uses a physical part of a person to stand for the whole worker (synecdoche).',
      concept: 'Metonymy = closely associated attribute/symbol ("the bench" for judges, "Luthuli House / Union Buildings" for leadership); Synecdoche = part-for-whole ("wheels" for car, "hands" for workers).'
    },
    {
      id: 'nsc_eng_d9',
      subject: 'english',
      topicId: 'eng_vis',
      difficulty: 'difficult',
      question: 'In satirical cartoons (such as Zapiro\'s political cartoons in Paper 1), how does CARICATURE work alongside SYMBOLISM to convey critique?',
      options: [
        'Caricature draws photorealistic portraits so no reader can recognise the public figure',
        'Caricature exaggerates distinctive physical traits of a recognisable figure while visual symbols/labels compress complex political issues into an instant visual metaphor',
        'Caricature removes all facial expressions so only the caption carries meaning',
        'Symbolism means writing a 500-word essay underneath the cartoon frame'
      ],
      correctIndex: 1,
      explanation: 'Political satirists distort/exaggerate signature features (caricature) for instant recognition and ridicule, while symbolic props (e.g., a sinking ship labelled "SOE Budget") dramatise abstract public issues.',
      concept: 'For satirical cartoons in Paper 1, identify: (1) who/what is caricatured or symbolised, (2) the incongruity/irony shown, and (3) the social/political message criticised.'
    },
    {
      id: 'nsc_eng_d10',
      subject: 'english',
      topicId: 'eng_vis',
      difficulty: 'difficult',
      question: 'Explain the structural ambiguity in the notice: "Visiting relatives can be exhausting" and how to remove it.',
      options: [
        'There is no ambiguity; "relatives" is misspelled',
        '"Visiting" can function either as a gerund verb ("Going to visit one\'s relatives is exhausting") OR as a participial adjective ("Relatives who come to visit us are exhausting")',
        '"Exhausting" is a malapropism for "exhausted"',
        'The modal verb "can" creates a split infinitive'
      ],
      correctIndex: 1,
      explanation: 'Double syntactic role of "Visiting" creates two valid readings: (1) the act of visiting relatives tires you out, or (2) relatives who visit you tire you out. Rewriting clearly specifies the intended subject.',
      concept: 'When explaining ambiguity in NSC Paper 1 Q5, ALWAYS state BOTH distinct meanings clearly in your answer to earn full marks.'
    },

    // =========================================================================
    // 4. PHYSICAL SCIENCES (CAPS Paper 1 & 2) — 30 Questions
    // =========================================================================
    {
      id: 'nsc_phys_e1',
      subject: 'physical_sciences',
      topicId: 'phys_mech',
      difficulty: 'easy',
      question: 'A resultant (net) horizontal force accelerates a 15 kg crate at 2,4 m.s^(-2) across a warehouse floor. Calculate the magnitude of the net force.',
      options: [
        '6,25 N',
        '36 N',
        '17,4 N',
        '147 N'
      ],
      correctIndex: 1,
      explanation: 'By Newton\'s Second Law, F_net = m * a = 15 kg * 2,4 m.s^(-2) = 36 N in the direction of acceleration.',
      concept: 'Newton\'s Second Law: F_net = m * a (in newtons when mass is in kg and acceleration is in m.s^(-2)).'
    },
    {
      id: 'nsc_phys_e2',
      subject: 'physical_sciences',
      topicId: 'phys_mech',
      difficulty: 'easy',
      question: 'Calculate the linear momentum of a 1 200 kg sedan travelling due east at 20 m.s^(-1).',
      options: [
        '60 kg.m.s^(-1) east',
        '24 000 kg.m.s^(-1) east',
        '240 000 J',
        '24 000 N'
      ],
      correctIndex: 1,
      explanation: 'Linear momentum p = m * v = 1 200 kg * 20 m.s^(-1) = 24 000 kg.m.s^(-1) due east (momentum is a vector and requires direction!).',
      concept: 'Momentum p = mv is a vector quantity pointing in the exact same direction as velocity v.'
    },
    {
      id: 'nsc_phys_e3',
      subject: 'physical_sciences',
      topicId: 'phys_wave',
      difficulty: 'easy',
      question: 'A stationary siren emits sound waves of frequency 850 Hz in air where the speed of sound is 340 m.s^(-1). Calculate the wavelength of the sound.',
      options: [
        '2,50 m',
        '0,40 m',
        '289 000 m',
        '0,25 m'
      ],
      correctIndex: 1,
      explanation: 'Using the wave speed equation v = f * lambda: lambda = v / f = 340 / 850 = 0,40 m.',
      concept: 'Wave speed v depends only on the medium (e.g., air temperature); increasing frequency f shortens wavelength lambda proportionally.'
    },
    {
      id: 'nsc_phys_e4',
      subject: 'physical_sciences',
      topicId: 'phys_wave',
      difficulty: 'easy',
      question: 'A 6 ohm resistor carries a steady direct current of 2,5 A. Calculate the potential difference across it and the electrical power dissipated.',
      options: [
        'V = 15 V; P = 37,5 W',
        'V = 2,4 V; P = 6,0 W',
        'V = 15 V; P = 15 W',
        'V = 8,5 V; P = 37,5 W'
      ],
      correctIndex: 0,
      explanation: 'Potential difference V = I * R = 2,5 * 6 = 15 V. Power P = I^2 * R = (2,5)^2 * 6 = 6,25 * 6 = 37,5 W (also V * I = 15 * 2,5 = 37,5 W).',
      concept: 'CAPS circuit formulas: V = IR and P = VI = I^2R = V^2/R.'
    },
    {
      id: 'nsc_phys_e5',
      subject: 'physical_sciences',
      topicId: 'phys_equil',
      difficulty: 'easy',
      question: 'For a chemical reaction with enthalpy change delta H = -196 kJ.mol^(-1), which statement is correct?',
      options: [
        'The reaction is endothermic and absorbs net energy from the surroundings',
        'The reaction is exothermic; the total chemical potential energy of the products is lower than that of the reactants',
        'Activation energy is negative',
        'No bonds are broken during the reaction'
      ],
      correctIndex: 1,
      explanation: 'delta H = E_products - E_reactants < 0 means more energy is released forming product bonds than absorbed breaking reactant bonds—an exothermic reaction.',
      concept: 'delta H < 0 -> Exothermic (releases heat, warms surroundings); delta H > 0 -> Endothermic (absorbs heat, cools surroundings).'
    },
    {
      id: 'nsc_phys_e6',
      subject: 'physical_sciences',
      topicId: 'phys_equil',
      difficulty: 'easy',
      question: 'How does adding a suitable positive catalyst affect a reversible chemical reaction?',
      options: [
        'It increases delta H and shifts equilibrium toward products',
        'It provides an alternative reaction pathway of lower activation energy, increasing both forward and reverse rates equally without changing Kc or yield',
        'It increases only the forward reaction rate while stopping the reverse reaction',
        'It raises the average kinetic energy of the gas molecules'
      ],
      correctIndex: 1,
      explanation: 'A catalyst lowers activation energy E_a equally for both the forward and reverse reactions, so equilibrium is reached faster with zero change in equilibrium yield or delta H.',
      concept: 'Catalysts speed up how fast equilibrium is attained, never the equilibrium position or Kc.'
    },
    {
      id: 'nsc_phys_e7',
      subject: 'physical_sciences',
      topicId: 'phys_elec',
      difficulty: 'easy',
      question: 'According to the Lowry-Bronsted theory prescribed in CAPS, what is an ACID?',
      options: [
        'A substance that donates hydroxide ions (OH^-) in water',
        'A proton (H^+ ion) donor',
        'A proton (H^+ ion) acceptor',
        'An electron-pair donor'
      ],
      correctIndex: 1,
      explanation: 'In CAPS Grade 12 Chemistry, Lowry-Bronsted defines an acid as a proton (H^+) donor and a base as a proton (H^+) acceptor. (Arrhenius defines acids by producing H_3O^+ in aqueous solution.)',
      concept: 'Keep Arrhenius (H_3O^+ / OH^- in water) distinct from Lowry-Bronsted (proton H^+ donor / acceptor)—quote the exact definition requested!'
    },
    {
      id: 'nsc_phys_e8',
      subject: 'physical_sciences',
      topicId: 'phys_elec',
      difficulty: 'easy',
      question: 'Which statement holds true in BOTH galvanic (voltaic) cells AND electrolytic cells?',
      options: [
        'The anode is always the positive electrode',
        'Oxidation always occurs at the anode and reduction always occurs at the cathode',
        'Electrical energy is always converted into chemical energy',
        'Electrons flow through the salt bridge'
      ],
      correctIndex: 1,
      explanation: 'Electrode polarity flips between galvanic (anode -, cathode +) and electrolytic (anode +, cathode -), but AN OIL RIG never changes: Oxidation at Anode, Reduction at Cathode. Ions (never electrons!) move in the electrolyte/salt bridge.',
      concept: 'AN OIL RIG: Anode = Oxidation (loss of e^-), Cathode = Reduction (gain of e^-); electrons travel ONLY in external metal wires.'
    },
    {
      id: 'nsc_phys_e9',
      subject: 'physical_sciences',
      topicId: 'phys_org',
      difficulty: 'easy',
      question: 'To which homologous series does CH_3CH_2COOH belong, and what is its IUPAC name?',
      options: [
        'Alcohols; propan-1-ol',
        'Carboxylic acids; propanoic acid',
        'Esters; methyl ethanoate',
        'Aldehydes; propanal'
      ],
      correctIndex: 1,
      explanation: 'The -COOH carboxyl functional group identifies a carboxylic acid, and a 3-carbon chain (including the carboxyl carbon) gives the IUPAC name propanoic acid.',
      concept: 'Always include the carboxyl carbon as Carbon-1 when counting the longest continuous carbon chain in carboxylic acids.'
    },
    {
      id: 'nsc_phys_e10',
      subject: 'physical_sciences',
      topicId: 'phys_org',
      difficulty: 'easy',
      question: 'Which observation rapidly distinguishes propene (an alkene) from propane (an alkane) in a darkened school laboratory?',
      options: [
        'Propane immediately decolourises reddish-brown bromine water without UV light',
        'Propene immediately decolourises reddish-brown bromine water without UV light via an addition reaction',
        'Propene dissolves in water to turn red litmus blue',
        'Propane forms a silver mirror with Tollens\' reagent'
      ],
      correctIndex: 1,
      explanation: 'Unsaturated propene contains a C=C double bond that undergoes fast electrophilic addition with Br_2 at room temperature in the dark, turning reddish-brown bromine water colourless. Saturated propane needs UV light/heat for slow substitution.',
      concept: 'Instant decolourisation of Br_2(aq) or Br_2(CCl_4) without UV light is the standard CAPS chemical test for unsaturation.'
    },
    {
      id: 'nsc_phys_m1',
      subject: 'physical_sciences',
      topicId: 'phys_mech',
      difficulty: 'medium',
      question: 'A 0,40 kg rubber ball strikes a vertical wall horizontally at 15 m.s^(-1) east and rebounds horizontally at 10 m.s^(-1) west. Calculate the magnitude and direction of the impulse exerted by the wall on the ball.',
      options: [
        '2,0 N.s west',
        '10,0 N.s west',
        '10,0 N.s east',
        '2,0 N.s east'
      ],
      correctIndex: 1,
      explanation: 'Choose east as positive (+): v_i = +15 m.s^(-1) and v_f = -10 m.s^(-1). Impulse = delta p = m(v_f - v_i) = 0,40(-10 - 15) = 0,40(-25) = -10,0 N.s = 10,0 N.s west.',
      concept: 'Rebound sign trap: when an object reverses direction, v_f and v_i have OPPOSITE signs, so |v_f - v_i| adds magnitudes (10 + 15 = 25, never 15 - 10)!'
    },
    {
      id: 'nsc_phys_m2',
      subject: 'physical_sciences',
      topicId: 'phys_mech',
      difficulty: 'medium',
      question: 'A 4,0 kg block initially at rest has 72 J of net work done on it as it slides along a rough surface. Using the Work-Energy Theorem, calculate its final speed.',
      options: [
        '36 m.s^(-1)',
        '6,0 m.s^(-1)',
        '4,2 m.s^(-1)',
        '18 m.s^(-1)'
      ],
      correctIndex: 1,
      explanation: 'Work-Energy Theorem: W_net = delta E_k = 1/2 m(v_f^2 - v_i^2). Substituting 72 = 1/2 (4,0)(v_f^2 - 0) gives 72 = 2v_f^2 -> v_f^2 = 36 -> v_f = 6,0 m.s^(-1).',
      concept: 'Work-Energy Theorem (W_net = delta E_k) holds on both frictionless and rough surfaces because W_net already includes the negative work done by friction.'
    },
    {
      id: 'nsc_phys_m3',
      subject: 'physical_sciences',
      topicId: 'phys_wave',
      difficulty: 'medium',
      question: 'A patrol car approaches a stationary observer at a constant speed of 30 m.s^(-1) while sounding a 620 Hz siren. Take the speed of sound in air as 340 m.s^(-1). Calculate the frequency heard by the observer.',
      options: [
        '569,7 Hz',
        '680,0 Hz',
        '674,7 Hz',
        '620,0 Hz'
      ],
      correctIndex: 1,
      explanation: 'Using Doppler formula f_L = [v / (v - v_s)] * f_s for an approaching source and stationary listener: f_L = [340 / (340 - 30)] * 620 = (340 / 310) * 620 = 340 * 2 = 680,0 Hz.',
      concept: 'Approaching source compresses wavefronts in front of it, so subtract v_s in the denominator to produce a higher observed frequency f_L > f_s.'
    },
    {
      id: 'nsc_phys_m4',
      subject: 'physical_sciences',
      topicId: 'phys_wave',
      difficulty: 'medium',
      question: 'A battery of emf 12,0 V and internal resistance r = 0,5 ohm is connected to a single external resistor of 5,5 ohm. Calculate the current in the circuit and the terminal potential difference across the battery.',
      options: [
        'I = 2,18 A; V_load = 12,0 V',
        'I = 2,0 A; V_load = 11,0 V',
        'I = 2,0 A; V_load = 1,0 V',
        'I = 24,0 A; V_load = 11,5 V'
      ],
      correctIndex: 1,
      explanation: 'Using emf = I(R + r): 12,0 = I(5,5 + 0,5) = 6,0 * I -> I = 2,0 A. Terminal voltage V_load = I * R = 2,0 * 5,5 = 11,0 V (with 1,0 V "lost volts" across internal resistance r).',
      concept: 'When current flows, a high-resistance voltmeter across the battery reads V_ext = emf - Ir, which is always less than the open-circuit emf.'
    },
    {
      id: 'nsc_phys_m5',
      subject: 'physical_sciences',
      topicId: 'phys_equil',
      difficulty: 'medium',
      question: 'Write the correct equilibrium constant expression (Kc) for the heterogeneous thermal decomposition in a sealed container: CaCO_3(s) <-> CaO(s) + CO_2(g).',
      options: [
        'Kc = ([CaO][CO_2]) / [CaCO_3]',
        'Kc = [CO_2]',
        'Kc = 1 / [CO_2]',
        'Kc = [CaO] / [CaCO_3]'
      ],
      correctIndex: 1,
      explanation: 'Pure solids (s) and pure liquids (l) have constant density/concentration and are omitted from Kc expressions, leaving only the gas: Kc = [CO_2].',
      concept: 'Include ONLY gases (g) and aqueous solutes (aq) in Kc—never write [solid] or [H_2O(l)] in the numerator or denominator.'
    },
    {
      id: 'nsc_phys_m6',
      subject: 'physical_sciences',
      topicId: 'phys_equil',
      difficulty: 'medium',
      question: 'Consider the Haber equilibrium at constant temperature: N_2(g) + 3H_2(g) <-> 2NH_3(g), delta H = -92 kJ.mol^(-1). What happens when the volume of the reaction vessel is halved?',
      options: [
        'The reverse reaction is favoured and Kc decreases',
        'Pressure increases; the forward reaction (4 gas moles -> 2 gas moles) is favoured, increasing NH_3 yield while Kc remains unchanged',
        'Both rates decrease and NH_3 yield drops',
        'Kc doubles because pressure doubled'
      ],
      correctIndex: 1,
      explanation: 'Halving volume increases gas pressure. By Le Chatelier\'s Principle, the system opposes the pressure rise by favouring the reaction producing fewer moles of gas—the forward reaction (4 mol -> 2 mol). Since temperature is constant, Kc is unchanged.',
      concept: 'Pressure/volume/concentration disturbances shift the equilibrium position, but ONLY a change in temperature alters the value of Kc.'
    },
    {
      id: 'nsc_phys_m7',
      subject: 'physical_sciences',
      topicId: 'phys_elec',
      difficulty: 'medium',
      question: 'Calculate the pH at 25 degrees Celsius of a 0,02 mol.dm^(-3) solution of strong diprotic sulphuric acid, H_2SO_4(aq), assuming complete ionisation.',
      options: [
        '1,70',
        '1,40',
        '2,00',
        '0,40'
      ],
      correctIndex: 1,
      explanation: 'Complete ionisation of diprotic H_2SO_4 yields 2 moles of H_3O^+ per mole of acid: [H_3O^+] = 2 * 0,02 = 0,04 mol.dm^(-3). pH = -log[H_3O^+] = -log(0,04) = 1,40.',
      concept: 'Check whether a strong acid is monoprotic (HCl, HNO_3: [H_3O^+] = c) or diprotic (H_2SO_4: [H_3O^+] = 2c) before applying pH = -log[H_3O^+].'
    },
    {
      id: 'nsc_phys_m8',
      subject: 'physical_sciences',
      topicId: 'phys_elec',
      difficulty: 'medium',
      question: 'Given standard reduction potentials E_theta(Zn^(2+)/Zn) = -0,76 V and E_theta(Cu^(2+)/Cu) = +0,34 V, calculate the initial emf of the standard galvanic cell Zn(s) | Zn^(2+)(aq) || Cu^(2+)(aq) | Cu(s).',
      options: [
        '-1,10 V',
        '+1,10 V',
        '-0,42 V',
        '+0,42 V'
      ],
      correctIndex: 1,
      explanation: 'Cu^(2+) has the higher reduction potential (+0,34 V > -0,76 V) so Cu is the cathode and Zn is the anode: E_theta(cell) = E_theta(cathode) - E_theta(anode) = (+0,34) - (-0,76) = +1,10 V.',
      concept: 'Copy the exact CAPS formula from the data sheet: E_theta(cell) = E_theta(cathode) - E_theta(anode), substituting raw reduction potentials with their signs intact.'
    },
    {
      id: 'nsc_phys_m9',
      subject: 'physical_sciences',
      topicId: 'phys_org',
      difficulty: 'medium',
      question: 'Why does propan-1-ol (M = 60 g.mol^(-1), b.p. 97 C) have a much higher boiling point than propanone (M = 58 g.mol^(-1), b.p. 56 C) despite almost identical molecular masses?',
      options: [
        'Propan-1-ol has stronger covalent C-C bonds that break during boiling',
        'Propan-1-ol molecules form strong intermolecular hydrogen bonds (-OH) in addition to dipole-dipole and London forces, whereas propanone has only dipole-dipole and London forces',
        'Propanone is completely non-polar with London forces only',
        'Propan-1-ol has a longer branched carbon chain than propanone'
      ],
      correctIndex: 1,
      explanation: 'Boiling overcomes INTERMOLECULAR forces, NEVER covalent bonds! Propan-1-ol has an -OH group capable of hydrogen bonding between molecules, requiring more energy to separate than propanone\'s dipole-dipole attractions.',
      concept: 'CAPS Paper 2 marking trap: NEVER write "covalent bonds break during boiling"—always state "more energy is needed to overcome stronger intermolecular forces".'
    },
    {
      id: 'nsc_phys_m10',
      subject: 'physical_sciences',
      topicId: 'phys_org',
      difficulty: 'medium',
      question: 'Give the IUPAC name of the organic ester formed when methanol is heated with butanoic acid in the presence of concentrated H_2SO_4.',
      options: [
        'Butyl methanoate',
        'Methyl butanoate',
        'Pentan-2-one',
        'Methoxybutane'
      ],
      correctIndex: 1,
      explanation: 'In ester nomenclature, the alkyl first word ("Methyl") comes from the alcohol (methanol) and the "-oate" second word ("butanoate") comes from the carboxylic acid (butanoic acid): methyl butanoate.',
      concept: 'Concentrated H_2SO_4 serves two roles in esterification: acid catalyst AND dehydrating agent (removing H_2O to shift equilibrium right).'
    },
    {
      id: 'nsc_phys_d1',
      subject: 'physical_sciences',
      topicId: 'phys_mech',
      difficulty: 'difficult',
      question: 'A stone is thrown vertically upwards at 10 m.s^(-1) from the edge of a 40 m high roof (ignore air resistance; g = 9,8 m.s^(-2)). Calculate the speed of the stone just before it hits the ground below the roof.',
      options: [
        '26,15 m.s^(-1)',
        '29,73 m.s^(-1)',
        '28,00 m.s^(-1)',
        '39,80 m.s^(-1)'
      ],
      correctIndex: 1,
      explanation: 'Take upwards as positive (+): v_i = +10 m.s^(-1), a = -9,8 m.s^(-2), and net displacement from roof to ground delta y = -40 m. Using v_f^2 = v_i^2 + 2a(delta y) in one step: v_f^2 = (10)^2 + 2(-9,8)(-40) = 100 + 784 = 884 -> |v_f| = sqrt(884) = 29,73 m.s^(-1).',
      concept: 'Equations of motion use vector displacement delta y (final minus initial position = -40 m), letting you solve roof-to-ground projectile motion in a single step!'
    },
    {
      id: 'nsc_phys_d2',
      subject: 'physical_sciences',
      topicId: 'phys_mech',
      difficulty: 'difficult',
      question: 'Block A (2 kg) and Block B (3 kg) rest on a frictionless horizontal table joined by a light inextensible string. A horizontal force of 20 N pulls Block B to the right. Calculate the tension T in the string.',
      options: [
        '20,0 N',
        '12,0 N',
        '8,0 N',
        '10,0 N'
      ],
      correctIndex: 2,
      explanation: 'For Block A: T = m_A * a = 2a (Eq. 1). For Block B: 20 - T = m_B * a = 3a (Eq. 2). Adding Eq. 1 and Eq. 2 gives 20 = 5a -> a = 4,0 m.s^(-2). Substituting into Eq. 1 gives T = 2 * 4,0 = 8,0 N.',
      concept: 'In two-body connected systems, write separate F_net = ma equations for each mass—internal tensions (+T and -T) cancel when summed to find acceleration a.'
    },
    {
      id: 'nsc_phys_d3',
      subject: 'physical_sciences',
      topicId: 'phys_wave',
      difficulty: 'difficult',
      question: 'Ultraviolet light of frequency 1,0 x 10^15 Hz shines onto a metal cathode of work function W_0 = 3,40 x 10^(-19) J (h = 6,63 x 10^(-34) J.s). Calculate E_k(max) of the emitted photoelectrons, and state what happens to E_k(max) if UV intensity is doubled at the same frequency.',
      options: [
        '3,23 x 10^(-19) J; E_k(max) remains unchanged (more electrons per second are emitted)',
        '3,23 x 10^(-19) J; E_k(max) doubles to 6,46 x 10^(-19) J',
        '10,03 x 10^(-19) J; E_k(max) halves',
        '0 J; frequency is below threshold frequency'
      ],
      correctIndex: 0,
      explanation: 'Photon energy E = hf = 6,63 x 10^(-34) * 1,0 x 10^15 = 6,63 x 10^(-19) J. Using E = W_0 + E_k(max): E_k(max) = (6,63 - 3,40) x 10^(-19) = 3,23 x 10^(-19) J. Doubling intensity sends twice as many photons per second (doubling photocurrent), but each photon still has the same energy hf so E_k(max) is unchanged.',
      concept: 'Photoelectric golden rule: Frequency controls kinetic energy E_k(max) of each photoelectron; Intensity (above f_0) controls number of photoelectrons per second (current).'
    },
    {
      id: 'nsc_phys_d4',
      subject: 'physical_sciences',
      topicId: 'phys_wave',
      difficulty: 'difficult',
      question: 'A battery with significant internal resistance r is connected to resistor R_1 and an open parallel branch containing switch S and resistor R_2. A voltmeter is connected across the battery terminals. When switch S is CLOSED, how does the voltmeter reading change?',
      options: [
        'Remains equal to the emf',
        'Decreases, because adding R_2 in parallel lowers total external resistance, increasing total current I and increasing internal "lost volts" (I*r)',
        'Increases, because adding R_2 increases total resistance',
        'Drops to zero volts'
      ],
      correctIndex: 1,
      explanation: '4-step CAPS causal chain: (1) Closing S connects R_2 in parallel, decreasing R_ext; (2) Total current I = emf / (R_ext + r) increases; (3) V_internal = I * r increases (r constant); (4)Since emf is constant, V_terminal = emf - V_internal DECREASES.',
      concept: 'Memorise this 4-step internal-resistance chain (R_ext -> I_total -> V_internal = Ir -> V_ext = emf - Ir) for guaranteed 4/4 explanation marks in Paper 1.'
    },
    {
      id: 'nsc_phys_d5',
      subject: 'physical_sciences',
      topicId: 'phys_equil',
      difficulty: 'difficult',
      question: 'Initially, 2,0 mol of SO_3(g) is sealed in an empty 2,0 dm^3 container and reaches equilibrium: 2SO_3(g) <-> 2SO_2(g) + O_2(g). At equilibrium, 0,40 mol of O_2(g) is present. Calculate Kc.',
      options: [
        '0,178',
        '0,089',
        '0,267',
        '0,400'
      ],
      correctIndex: 1,
      explanation: 'Mole ratio 2 : 2 : 1 means forming 0,40 mol O_2 also forms 0,80 mol SO_2 and uses 0,80 mol SO_3, leaving 2,0 - 0,80 = 1,20 mol SO_3. Divide by volume V = 2,0 dm^3: [SO_3] = 0,60; [SO_2] = 0,40; [O_2] = 0,20. Kc = ([SO_2]^2 [O_2]) / [SO_3]^2 = (0,40^2 * 0,20) / (0,60^2) = 0,032 / 0,36 = 0,089.',
      concept: 'RICE table discipline: track Moles in R-I-C-E first, ALWAYS divide equilibrium moles by container volume V (in dm^3) to get concentration, then substitute into Kc.'
    },
    {
      id: 'nsc_phys_d6',
      subject: 'physical_sciences',
      topicId: 'phys_equil',
      difficulty: 'difficult',
      question: 'For a reversible gas reaction X(g) + Y(g) <-> 2Z(g), Kc is 4,8 at 300 K and drops to 1,1 when the temperature is raised to 500 K. Deduce whether the forward reaction is exothermic or endothermic.',
      options: [
        'Endothermic (delta H > 0)',
        'Exothermic (delta H < 0), because raising temperature favoured the endothermic reverse reaction, lowering [Z] relative to [X][Y]',
        'Thermoneutral (delta H = 0)',
        'Impossible to deduce without container volume'
      ],
      correctIndex: 1,
      explanation: 'Increasing temperature ALWAYS favours the endothermic direction. Because Kc decreased when temperature rose, [products] fell and [reactants] rose—meaning the reverse reaction was favoured (reverse is endothermic, so forward is exothermic, delta H < 0).',
      concept: 'Quick Kc-temperature rule: T up & Kc up -> forward is endothermic; T up & Kc down -> forward is exothermic.'
    },
    {
      id: 'nsc_phys_d7',
      subject: 'physical_sciences',
      topicId: 'phys_elec',
      difficulty: 'difficult',
      question: 'During an acid-base titration of weak ethanoic acid (CH_3COOH) against strong sodium hydroxide (NaOH), why is phenolphthalein (pH range 8,2–10,0) chosen instead of methyl orange (pH range 3,1–4,4)?',
      options: [
        'Because strong bases always turn every indicator pink at pH 7,0',
        'Because the salt formed (sodium ethanoate) undergoes anion hydrolysis (CH_3COO^- + H_2O <-> CH_3COOH + OH^-), making the equivalence point basic (pH > 7)',
        'Because Na^+ ions donate protons to water to lower pH below 4',
        'Because ethanoic acid does not react with NaOH'
      ],
      correctIndex: 1,
      explanation: 'Weak acid + strong base produces a basic salt: the conjugate base CH_3COO^- hydrolyses water to generate excess OH^- ions, placing the equivalence point around pH 8,5–9—inside phenolphthalein\'s colour-change range.',
      concept: 'Titration indicator rules: Weak Acid + Strong Base -> basic salt (pH > 7, phenolphthalein); Strong Acid + Weak Base -> acidic salt (pH < 7, methyl orange); Strong + Strong -> bromothymol blue.'
    },
    {
      id: 'nsc_phys_d8',
      subject: 'physical_sciences',
      topicId: 'phys_elec',
      difficulty: 'difficult',
      question: 'In the industrial electrolysis of concentrated aqueous sodium chloride (brine) in a membrane cell, why is H_2(g) formed at the cathode instead of metallic sodium, Na(s)?',
      options: [
        'Na^+ ions migrate to the anode instead of the cathode',
        'H_2O is a much stronger oxidising agent (E_theta = -0,83 V) than Na^+ (E_theta = -2,71 V), so water is preferentially reduced at the cathode to H_2(g) and OH^-(aq)',
        'Sodium metal forms first and sublimates into H_2 gas',
        'The cation-exchange membrane blocks electrons from reaching Na^+'
      ],
      correctIndex: 1,
      explanation: 'At the cathode of an aqueous electrolytic cell, water competes with the metal cation. Because E_theta(H_2O/H_2) = -0,83 V is far less negative than E_theta(Na^+/Na) = -2,71 V, water is much more easily reduced: 2H_2O + 2e^- -> H_2(g) + 2OH^-(aq).',
      concept: 'Active metal cations (Group 1, Group 2, Al^(3+)) are NEVER reduced to metal from aqueous solution—H_2O is reduced instead, producing H_2(g) and OH^-(aq).'
    },
    {
      id: 'nsc_phys_d9',
      subject: 'physical_sciences',
      topicId: 'phys_org',
      difficulty: 'difficult',
      question: '2-bromobutane (CH_3CHBrCH_2CH_3) is heated strongly under reflux with concentrated KOH dissolved in pure ethanol. Identify the reaction type and the IUPAC name of the MAJOR organic product.',
      options: [
        'Substitution (hydrolysis); butan-2-ol',
        'Elimination (dehydrohalogenation); but-2-ene',
        'Elimination (dehydrohalogenation); but-1-ene',
        'Addition (hydrohalogenation); 2,3-dibromobutane'
      ],
      correctIndex: 1,
      explanation: 'Concentrated strong base (KOH/NaOH) in ethanol + strong heat triggers dehydrohalogenation (elimination of HBr). By Zaitsev\'s rule, the H atom is preferentially removed from the adjacent C atom that has FEWER H atoms (C-3 rather than C-1), giving but-2-ene as the major product.',
      concept: 'Haloalkane conditions trap: Dilute aqueous KOH + mild heat -> Substitution (alcohol); Concentrated ethanolic KOH + strong heat -> Elimination (alkene via Zaitsev\'s rule).'
    },
    {
      id: 'nsc_phys_d10',
      subject: 'physical_sciences',
      topicId: 'phys_org',
      difficulty: 'difficult',
      question: 'How are butanoic acid (CH_3CH_2CH_2COOH) and ethyl ethanoate (CH_3COOCH_2CH_3) related structurally?',
      options: [
        'Chain isomers',
        'Positional isomers',
        'Functional isomers sharing molecular formula C_4H_8O_2',
        'Homologues differing by a -CH_2- unit'
      ],
      correctIndex: 2,
      explanation: 'Both compounds have the exact same molecular formula C_4H_8O_2, but belong to different homologous series with different functional groups (carboxylic acid vs ester)—defining functional isomers.',
      concept: 'CAPS functional isomer pairs to memorise: Carboxylic acids <-> Esters (C_nH_(2n)O_2) and Aldehydes <-> Ketones (C_nH_(2n)O).'
    },

    // =========================================================================
    // 5. LIFE SCIENCES (CAPS Paper 1 & 2) — 30 Questions
    // =========================================================================
    {
      id: 'nsc_life_e1',
      subject: 'life_sciences',
      topicId: 'life_dna',
      difficulty: 'easy',
      question: 'Which nitrogenous base is found in RNA molecules (mRNA and tRNA) in place of thymine (T) in DNA?',
      options: [
        'Cytosine (C)',
        'Uracil (U)',
        'Guanine (G)',
        'Adenine (A)'
      ],
      correctIndex: 1,
      explanation: 'RNA contains ribose sugar, is single-stranded, and uses the pyrimidine base Uracil (U) instead of Thymine (T), so Adenine on a DNA template pairs with Uracil on mRNA.',
      concept: 'Three structural differences between DNA and RNA: deoxyribose vs ribose sugar, double helix vs single strand, and Thymine (T) vs Uracil (U).'
    },
    {
      id: 'nsc_life_e2',
      subject: 'life_sciences',
      topicId: 'life_dna',
      difficulty: 'easy',
      question: 'During which phase of Meiosis I does crossing over (exchange of genetic material between non-sister chromatids of homologous chromosomes) occur?',
      options: [
        'Prophase I',
        'Metaphase I',
        'Anaphase I',
        'Telophase II'
      ],
      correctIndex: 0,
      explanation: 'During Prophase I, homologous chromosomes pair up into bivalents and exchange segments at chiasmata (crossing over), generating genetic variation in gametes.',
      concept: 'Two sources of genetic variation in meiosis: Crossing over (Prophase I) and Random arrangement of chromosomes at the equator (Metaphase I & II).'
    },
    {
      id: 'nsc_life_e3',
      subject: 'life_sciences',
      topicId: 'life_gen',
      difficulty: 'easy',
      question: 'In pea plants, tall stems (T) are completely dominant over short stems (t). Two heterozygous tall plants (Tt x Tt) are crossed. What is the expected phenotypic ratio in the F1 offspring?',
      options: [
        '1 tall : 1 short',
        '3 tall : 1 short',
        '1 TT : 2 Tt : 1 tt',
        'All tall (100%)'
      ],
      correctIndex: 1,
      explanation: 'Tt x Tt produces genotypes 1 TT : 2 Tt : 1 tt. Because T is completely dominant, both TT and Tt are tall, giving a phenotypic ratio of 3 tall : 1 short.',
      concept: 'Read carefully whether a CAPS genetics question asks for the GENOTYPIC ratio (1 TT : 2 Tt : 1 tt) or the PHENOTYPIC ratio (3 tall : 1 short).'
    },
    {
      id: 'nsc_life_e4',
      subject: 'life_sciences',
      topicId: 'life_gen',
      difficulty: 'easy',
      question: 'What term describes all the genes and alleles present across all individuals of an interbreeding population at a given time?',
      options: [
        'Karyotype',
        'Gene pool',
        'Genome of one gamete',
        'Phenotype'
      ],
      correctIndex: 1,
      explanation: 'A population\'s gene pool is the total set of different alleles of all genes carried by reproductive members of that population.',
      concept: ' Distinguish Genome (complete DNA set of an organism), Karyotype (visual chart of paired chromosomes), and Gene Pool (all alleles in a population).'
    },
    {
      id: 'nsc_life_e5',
      subject: 'life_sciences',
      topicId: 'life_repr',
      difficulty: 'easy',
      question: 'In the human female reproductive system, where does fertilisation normally take place?',
      options: [
        'Uterus (endometrium)',
        'Fallopian tube (oviduct)',
        'Ovary',
        'Cervix'
      ],
      correctIndex: 1,
      explanation: 'Sperm fertilise the secondary oocyte in the upper third of the Fallopian tube (oviduct) to form a diploid zygote, which divides by mitosis into a blastocyst before implanting in the endometrium.',
      concept: 'Fertilisation occurs in the Fallopian tube; implantation and gestation occur in the endometrium of the uterus.'
    },
    {
      id: 'nsc_life_e6',
      subject: 'life_sciences',
      topicId: 'life_repr',
      difficulty: 'easy',
      question: 'Ground-nesting birds such as ostriches and guinea fowl hatch with open eyes, down feathers, and the ability to walk and feed themselves almost immediately. Which reproductive strategy is this?',
      options: [
        'Altricial development',
        'Precocial development',
        'Vivipary',
        'External fertilisation'
      ],
      correctIndex: 1,
      explanation: 'Precocial hatchlings come from large-yolked eggs, hatch well-developed and mobile to escape ground predators, and require less intensive post-hatching feeding than helpless, blind altricial nestlings.',
      concept: 'Precocial = high yolk energy before hatching, mobile & independent young; Altricial = low yolk energy, helpless young, intensive parental care in safe nests.'
    },
    {
      id: 'nsc_life_e7',
      subject: 'life_sciences',
      topicId: 'life_homeo',
      difficulty: 'easy',
      question: 'Which part of the human brain regulates involuntary homeostatic functions such as core body temperature, osmoregulation (thirst), and hunger?',
      options: [
        'Cerebellum',
        'Corpus callosum',
        'Hypothalamus',
        'Spinal cord'
      ],
      correctIndex: 2,
      explanation: 'The hypothalamus contains thermoregulatory and osmoreceptor centres and controls the pituitary gland. (Cerebellum coordinates balance/muscle tone; medulla controls breathing/heartbeat; corpus callosum connects cerebral hemispheres.)',
      concept: 'Brain summary: Cerebrum (voluntary actions, higher thought, senses), Corpus callosum (links hemispheres), Cerebellum (balance), Hypothalamus (thermoregulation/ADH), Medulla (breathing/heartbeat).'
    },
    {
      id: 'nsc_life_e8',
      subject: 'life_sciences',
      topicId: 'life_homeo',
      difficulty: 'easy',
      question: 'Which photoreceptors in the human retina enable sharp colour vision in bright light and are densely packed in the yellow spot (fovea centralis)?',
      options: [
        'Rods',
        'Cones',
        'Cristae',
        ' Hair cells of the organ of Corti'
      ],
      correctIndex: 1,
      explanation: 'Cones detect bright light and colour (red, green, blue) with high visual acuity in the yellow spot; rods are sensitive to dim light for black-and-white night vision.',
      concept: 'Cones = Colour + bright light + yellow spot; Rods = dim light + black-and-white peripheral vision; Blind spot = zero rods or cones where optic nerve exits.'
    },
    {
      id: 'nsc_life_e9',
      subject: 'life_sciences',
      topicId: 'life_evol',
      difficulty: 'easy',
      question: 'Which iconic Australopithecus africanus fossil skull was discovered at Taung in South Africa and described by Raymond Dart in 1924/1925?',
      options: [
        'Lucy (AL 288-1)',
        'The Taung Child',
        'Nutcracker Man (Paranthropus boisei)',
        'Turkana Boy'
      ],
      correctIndex: 1,
      explanation: 'Raymond Dart identified the juvenile Australopithecus africanus skull ("Taung Child") from Taung, noting its anteriorly placed foramen magnum as evidence of upright bipedal posture in Africa.',
      concept: 'Key South African hominid fossils (CAPS): Taung Child (Dart), Mrs Ples (Broom, Sterkfontein), Little Foot (Clarke, Sterkfontein), and Karabo / A. sediba (Berger, Malapa).'
    },
    {
      id: 'nsc_life_e10',
      subject: 'life_sciences',
      topicId: 'life_evol',
      difficulty: 'easy',
      question: 'Why was Jean-Baptiste Lamarck\'s theory of evolution rejected by modern genetics?',
      options: [
        'Lamarck denied that environments ever change',
        'Acquired physical characteristics developed through use or disuse during an organism\'s lifetime do NOT alter DNA in gametes and therefore cannot be inherited by offspring',
        'Lamarck claimed fossils never existed',
        'Organisms never show variation within a species'
      ],
      correctIndex: 1,
      explanation: 'Lamarck proposed two laws: Law of Use and Disuse, and Law of Inheritance of Acquired Characteristics. Because somatic traits (like stretched muscles) do not change allele sequences in sperm/ova, acquired traits are not heritable.',
      concept: 'Standard 2-mark CAPS rejection of Lamarck: acquired phenotypes are not encoded in DNA/genes and cannot be passed from parents to offspring.'
    },
    {
      id: 'nsc_life_m1',
      subject: 'life_sciences',
      topicId: 'life_dna',
      difficulty: 'medium',
      question: 'A base triplet on the coding/template strand of a DNA molecule is TAC-GGA. Determine (1) the complementary mRNA codons transcribed and (2) the tRNA anticodons that pair with them.',
      options: [
        'mRNA: ATG-CCT; tRNA: TAC-GGA',
        'mRNA: AUG-CCU; tRNA: UAC-GGA',
        'mRNA: UAC-GGA; tRNA: AUG-CCU',
        'mRNA: AUG-CCT; tRNA: UAC-GGA'
      ],
      correctIndex: 1,
      explanation: 'During transcription (DNA -> mRNA), A->U, T->A, C->G, G->C: TAC-GGA transcribes into mRNA codons AUG-CCU. During translation (mRNA -> tRNA), AUG-CCU pairs with tRNA anticodons UAC-GGA (note U, NOT T, in tRNA!).',
      concept: 'Base-pairing trap: BOTH mRNA and tRNA are RNA molecules, so NEITHER can ever contain Thymine (T)—tRNA uses UAC, never TAC!'
    },
    {
      id: 'nsc_life_m2',
      subject: 'life_sciences',
      topicId: 'life_dna',
      difficulty: 'medium',
      question: 'A somatic (body) cell of a horse has 64 chromosomes before interphase. How many chromosomes and how many DNA chromatids/molecules are present in each daughter cell at the END of Meiosis I vs at the END of Meiosis II?',
      options: [
        'End of Meiosis I: 64 chromosomes; End of Meiosis II: 32 chromosomes',
        'End of Meiosis I: 32 replicated chromosomes (2 chromatids each); End of Meiosis II: 32 unreplicated chromosomes (1 chromatid each)',
        'End of Meiosis I: 32 chromosomes; End of Meiosis II: 16 chromosomes',
        'End of Meiosis I: 128 chromosomes; End of Meiosis II: 64 chromosomes'
      ],
      correctIndex: 1,
      explanation: 'Meiosis I is the reduction division (separating homologous pairs in Anaphase I), halving chromosome count from diploid (2n = 64) to haploid (n = 32 double-stranded chromosomes). Meiosis II separates sister chromatids in Anaphase II, leaving n = 32 single-stranded chromosomes.',
      concept: 'Chromosome number halves in Meiosis I (2n -> n) and stays haploid (n) through Meiosis II as sister chromatids separate.'
    },
    {
      id: 'nsc_life_m3',
      subject: 'life_sciences',
      topicId: 'life_gen',
      difficulty: 'medium',
      question: 'Red-green colour blindness is caused by a recessive allele (d) on the X chromosome. A woman with normal vision whose father is colour-blind marries a colour-blind man. What percentage of ALL their children are expected to be colour-blind daughters?',
      options: [
        '0%',
        '25%',
        '50%',
        '75%'
      ],
      correctIndex: 1,
      explanation: 'Mother inherited X^d from her colour-blind father (X^d Y), so she is a carrier (X^D X^d). Father is colour-blind (X^d Y). Cross X^D X^d x X^d Y gives 4 equally likely genotypes: X^D X^d (carrier girl, 25%), X^d X^d (colour-blind girl, 25%), X^D Y (normal boy, 25%), X^d Y (colour-blind boy, 25%). Thus 25% of all children are colour-blind daughters.',
      concept: 'A female expresses an X-linked recessive disorder (X^d X^d) ONLY if her father is affected (X^d Y) AND her mother is at least a carrier (X^D X^d or X^d X^d).'
    },
    {
      id: 'nsc_life_m4',
      subject: 'life_sciences',
      topicId: 'life_gen',
      difficulty: 'medium',
      question: 'In snapdragons, crossing a pure-breeding red-flowered plant (CR CR) with a pure-breeding white-flowered plant (CW CW) produces 100% uniform pink-flowered F1 plants (CR CW). Which inheritance pattern is this?',
      options: [
        'Complete dominance',
        'Incomplete dominance',
        'Codominance',
        'Polygenic inheritance'
      ],
      correctIndex: 1,
      explanation: 'Neither allele dominates, producing an intermediate blended third phenotype (pink) in the heterozygote—incomplete dominance. (In codominance, BOTH parental phenotypes appear distinctly side-by-side, such as red-and-white patches in roan cattle or blood group AB.)',
      concept: 'Incomplete dominance = intermediate third phenotype (pink); Codominance = both alleles expressed equally and distinctly together (roan / AB blood).'
    },
    {
      id: 'nsc_life_m5',
      subject: 'life_sciences',
      topicId: 'life_repr',
      difficulty: 'medium',
      question: 'During the human menstrual cycle, why do FSH levels remain suppressed while a woman is pregnant?',
      options: [
        'High levels of progesterone secreted by the corpus luteum (and later the placenta) inhibit the pituitary gland from secreting FSH, preventing new follicles from maturing and ovulating during pregnancy',
        'High testosterone destroys the ovaries during gestation',
        'Oestrogen converts the pituitary gland into the thyroid gland',
        'LH stimulates continuous menstruation throughout pregnancy'
      ],
      correctIndex: 0,
      explanation: 'High progesterone maintains the thick, vascularised, glandular endometrium for the implanted embryo AND exerts negative feedback on the anterior pituitary to inhibit FSH (and LH), preventing super-ovulation during pregnancy.',
      concept: 'Progesterone negative feedback on FSH is the core CAPS explanation for why ovulation stops during pregnancy and how progesterone-based contraceptives work.'
    },
    {
      id: 'nsc_life_m6',
      subject: 'life_sciences',
      topicId: 'life_repr',
      difficulty: 'medium',
      question: 'Why are human testes suspended outside the abdominal cavity inside the scrotum?',
      options: [
        'To maintain testis temperature at 2–3 degrees Celsius ABOVE core body temperature (37 C)',
        'To maintain testis temperature at ~2–3 degrees Celsius BELOW core body temperature (~34–35 C), which is optimal for normal spermatogenesis',
        'To shorten the urethra during urination',
        'To store mature sperm in the seminal vesicles'
      ],
      correctIndex: 1,
      explanation: 'Normal meiotic sperm production (spermatogenesis) in the seminiferous tubules is heat-sensitive and requires a temperature roughly 2 to 3 degrees Celsius cooler than 37 C abdominal body temperature.',
      concept: 'In cold conditions scrotal muscles contract to pull testes closer to body warmth; in hot conditions they relax to allow cooling.'
    },
    {
      id: 'nsc_life_m7',
      subject: 'life_sciences',
      topicId: 'life_homeo',
      difficulty: 'medium',
      question: 'Describe the exact sequence of changes during ACCOMMODATION of the human eye when a learner shifts focus from the distant whiteboard to a textbook held 20 cm away (near vision).',
      options: [
        'Ciliary muscles relax -> suspensory ligaments tighten -> lens becomes flatter (less convex)',
        'Ciliary muscles contract -> tension in suspensory ligaments decreases (slackens) -> elastic lens bulges (becomes more convex) -> refractive power increases to focus rays on the retina',
        'Radial iris muscles contract -> pupil dilates to bend light rays more strongly',
        'Cornea moves backward toward the optic nerve'
      ],
      correctIndex: 1,
      explanation: 'Do NOT confuse accommodation (lens curvature controlled by ciliary muscles + suspensory ligaments for distance) with the pupillary mechanism (iris circular/radial muscles for light intensity)! For near vision (<6 m), ciliary muscles CONTRACT, slackening suspensory ligaments so the lens becomes MORE convex.',
      concept: 'Near vision (<6 m): Ciliary Contract -> Suspensory Slacken -> Lens Bulges (more convex, more refraction). Distant vision (>6 m): Ciliary Relax -> Suspensory Taut -> Lens Flatter.'
    },
    {
      id: 'nsc_life_m8',
      subject: 'life_sciences',
      topicId: 'life_homeo',
      difficulty: 'medium',
      question: 'Trace the negative-feedback loop when thyroxin levels in human blood drop BELOW normal.',
      options: [
        'Pituitary secretes LESS TSH -> thyroid secretes more thyroxin',
        'Pituitary gland detects low thyroxin and secretes MORE TSH -> stimulates thyroid gland to secrete MORE thyroxin -> metabolic rate and blood thyroxin rise back to normal (inhibiting further TSH)',
        'Adrenal gland secretes adrenaline to replace thyroxin permanently',
        'Pancreas secretes glucagon to convert iodine into thyroxin'
      ],
      correctIndex: 1,
      explanation: 'Thyroxin and TSH operate in a classic reciprocal negative-feedback loop between the pituitary gland and thyroid gland: low thyroxin -> MORE TSH -> thyroid releases MORE thyroxin -> normal level restored.',
      concept: 'Hypothyroidism (persistently low thyroxin) slows basal metabolic rate, lowers body temperature, and causes weight gain/lethargy (and goitre if due to iodine deficiency).'
    },
    {
      id: 'nsc_life_m9',
      subject: 'life_sciences',
      topicId: 'life_evol',
      difficulty: 'medium',
      question: 'Which set of anatomical features distinguishes an obligate bipedal human (Homo sapiens) skeleton from a quadrupedal chimpanzee (Pan troglodytes) skeleton?',
      options: [
        'Posterior foramen magnum, C-shaped spine, long narrow pelvis, opposable big toe',
        'More anterior (central) foramen magnum under the skull, S-shaped spine, short and wide bowl-shaped pelvis, non-opposable aligned hallux (big toe)',
        'Prominent brow ridges, prognathous jaw, large canines with diastema',
        'Forelimbs much longer than hindlimbs for knuckle-walking'
      ],
      correctIndex: 1,
      explanation: 'Habitual bipedalism balances the skull directly atop an S-shaped shock-absorbing spine via a forward/central foramen magnum, supported by a short, broad pelvis carrying visceral weight and an aligned big toe for push-off.',
      concept: 'Distinguish CRANIAL trends (cranium size, prognathism, brow ridges, dentition) from BIPEDAL skeletal trends (foramen magnum, spine, pelvis, femur angle, foot arch).'
    },
    {
      id: 'nsc_life_m10',
      subject: 'life_sciences',
      topicId: 'life_evol',
      difficulty: 'medium',
      question: 'According to the "Out of Africa" hypothesis in CAPS Paper 2, what two main lines of evidence confirm Africa as the cradle of anatomically modern Homo sapiens?',
      options: [
        'Fossilised dinosaur footprints in the Karoo and identical blood groups worldwide',
        '(1) Fossil record: Ardipithecus, Australopithecus, Homo habilis, and the oldest Homo sapiens fossils occur in Africa; and (2) Mitochondrial DNA (mtDNA) studies showing the highest genetic diversity (oldest mutations) among African populations',
        'Complete absence of Homo erectus fossils outside Africa',
        'Identical language families spoken across Africa and Europe'
      ],
      correctIndex: 1,
      explanation: 'Africa uniquely holds the unbroken early hominid lineage (Ardipithecus & Australopithecus are found ONLY in Africa) plus the oldest Homo sapiens fossils (~195–300 kya), corroborated by maternal mtDNA showing highest diversity in African lineages.',
      concept: 'mtDNA is inherited exclusively down the maternal line (via the ovum\'s mitochondria) without meiotic recombination, acting as a molecular clock for human migrations.'
    },
    {
      id: 'nsc_life_d1',
      subject: 'life_sciences',
      topicId: 'life_dna',
      difficulty: 'difficult',
      question: 'A point mutation changes a DNA template triplet from CTT to CAT. Using an mRNA codon table where GAA = Glutamic acid, GUA = Valine, CUU = Leucine, and CAU = Histidine, explain the exact molecular consequence on the protein.',
      options: [
        'Silent mutation: both code for Leucine so the protein is unchanged',
        'DNA CTT -> CAT changes the mRNA codon from GAA to GUA, substituting Valine in place of Glutamic acid in the polypeptide chain, altering its 3D folding/function (as in sickle-cell anaemia)',
        'DNA CTT -> CAT changes the mRNA codon from CUU to CAU, substituting Histidine for Leucine',
        'Translation stops immediately because GUA is a stop codon'
      ],
      correctIndex: 1,
      explanation: 'Step 1 (Transcribe DNA template -> mRNA): original DNA CTT -> mRNA GAA (Glutamic acid); mutated DNA CAT -> mRNA GUA (Valine). Step 2: Replacing hydrophilic Glutamic acid with hydrophobic Valine alters the primary amino acid sequence and protein shape/function.',
      concept: ' CAPS 5-mark gene mutation template: state old DNA -> new DNA, old mRNA codon -> new mRNA codon, old amino acid -> new amino acid, leading to a different/non-functional protein.'
    },
    {
      id: 'nsc_life_d2',
      subject: 'life_sciences',
      topicId: 'life_dna',
      difficulty: 'difficult',
      question: 'How does chromosomal NON-DISJUNCTION during human meiosis give rise to Down syndrome (Trisomy 21)?',
      options: [
        'Failure of chromosome pair 21 (in Anaphase I) or sister chromatids of chromosome 21 (in Anaphase II) to separate produces a gamete with n + 1 = 24 chromosomes; fertilisation with a normal gamete (n = 23) yields a zygote with 47 chromosomes (three copies of chromosome 21)',
        'Crossing over fails during Interphase, leaving 45 chromosomes in every body cell',
        'Two normal sperm fertilise an enucleated ovum to produce 46 chromosomes',
        'A single base substitution occurs on the Y chromosome'
      ],
      correctIndex: 0,
      explanation: 'Non-disjunction at chromosome 21 yields one abnormal gamete with an extra chromosome 21 (24 chromosomes total) and one lacking chromosome 21 (22 chromosomes). Fusion of the 24-chromosome gamete with a normal 23-chromosome gamete forms a 47-chromosome zygote (Trisomy 21).',
      concept: 'Always state the specific chromosome number (pair 21), the stage (Anaphase I or II), the gamete count (24 + 23), and the zygote count (47 with 3 copies of #21).'
    },
    {
      id: 'nsc_life_d3',
      subject: 'life_sciences',
      topicId: 'life_gen',
      difficulty: 'difficult',
      question: 'At a maternity hospital, two newborns\' wristbands were accidentally swapped: Baby X has blood group O and Baby Y has blood group AB. Couple 1 consists of a blood group A mother and a blood group B father. Couple 2 consists of a blood group AB mother and a blood group A father. Correctly match the babies to their biological parents.',
      options: [
        'Baby X belongs to Couple 2; Baby Y belongs to Couple 1',
        'Baby X (genotype ii) MUST belong to Couple 1 (heterozygous I^A i x I^B i) because the blood group AB mother in Couple 2 (I^A I^B) carries no recessive i allele; therefore Baby Y (I^A I^B) belongs to Couple 2',
        'Both babies belong to Couple 2',
        'ABO blood groups can never exclude parentage in newborn swaps'
      ],
      correctIndex: 1,
      explanation: 'A blood group O baby has genotype ii and must inherit one recessive i allele from EACH parent. Because the mother in Couple 2 has blood group AB (genotype I^A I^B, with zero i alleles), Couple 2 is genetically excluded from being Baby X\'s parents. Couple 1 (I^A i x I^B i) produces Baby X (ii), while Couple 2 (I^A I^B x I^A _) produces Baby Y (I^A I^B).',
      concept: 'ABO parentage exclusion rule: a blood group AB parent (I^A I^B) can NEVER produce a blood group O child (ii), and a blood group O parent (ii) can NEVER produce a blood group AB child (I^A I^B).'
    },
    {
      id: 'nsc_life_d4',
      subject: 'life_sciences',
      topicId: 'life_gen',
      difficulty: 'difficult',
      question: 'During somatic cell nuclear transfer (reproductive cloning, such as Dolly the sheep), Donor Sheep P supplies an udder (mammary) cell nucleus, Donor Sheep Q supplies an enucleated ovum, and Surrogate Ewe R carries the pregnancy. To which sheep is the cloned lamb genetically identical in nuclear DNA, and why was a somatic nucleus used?',
      options: [
        'Sheep R, because placental blood mixes nuclear DNA into the foetus',
        'Sheep Q, because an enucleated ovum still retains its 2n chromosomes',
        'Sheep P, because P supplied the diploid (2n) somatic nucleus containing the full set of chromosomes without needing fertilisation by a sperm',
        'An equal 33% genetic blend of P, Q, and R'
      ],
      correctIndex: 2,
      explanation: 'Sheep Q\'s haploid nucleus was removed (enucleated), and Sheep R only provides uterine nutrition/protection. All nuclear chromosomes come from Sheep P\'s diploid (2n) somatic cell, so electric shock triggers mitotic cleavage directly into an embryo genetically identical to P.',
      concept: 'Cloning roles: Nucleus donor = genetic twin (diploid 2n); Ovum donor = cytoplasm/cellular machinery; Surrogate mother = endometrium for gestation.'
    },
    {
      id: 'nsc_life_d5',
      subject: 'life_sciences',
      topicId: 'life_repr',
      difficulty: 'difficult',
      question: 'In the human placenta, maternal blood in uterine sinuses and foetal blood in chorionic villus capillaries flow very close together WITHOUT mixing. Why is keeping the two bloodstreams separate essential for foetal survival?',
      options: [
        'Foetal blood contains zero red blood cells until birth',
        '(1) Prevents high maternal arterial blood pressure from rupturing delicate foetal capillaries; (2) prevents agglutination if maternal and foetal ABO/Rhesus blood groups are incompatible; and (3) blocks larger maternal pathogens while allowing diffusion of O_2, glucose, amino acids, and antibodies',
        'Prevents oxygen and glucose from ever crossing into the umbilical vein',
        'Ensures the umbilical artery carries oxygenated blood to the foetus'
      ],
      correctIndex: 1,
      explanation: 'A thin barrier separates maternal and foetal blood to protect fragile foetal vessels from maternal blood pressure, prevent fatal blood-group agglutination, and screen out many bacteria—while umbilical VEIN carries oxygenated, nutrient-rich blood TO the foetus and umbilical ARTERIES carry deoxygenated, waste-laden blood AWAY.',
      concept: 'Umbilical vessel reversal (just like pulmonary vessels!): Umbilical VEIN = oxygenated blood + nutrients (placenta -> foetus); Umbilical ARTERIES = deoxygenated blood + CO_2/urea (foetus -> placenta).'
    },
    {
      id: 'nsc_life_d6',
      subject: 'life_sciences',
      topicId: 'life_homeo',
      difficulty: 'difficult',
      question: 'Compare the homeostatic roles of ADH (antidiuretic hormone) and ALDOSTERONE on the kidney tubules when a marathon runner sweats heavily on Comrades Marathon day.',
      options: [
        'Both ADH and aldosterone decrease so the runner excretes maximum water and sodium',
        'ADH (from pituitary) increases water permeability of distal tubules/collecting ducts to reabsorb MORE water; Aldosterone (from adrenal cortex) stimulates active sodium ion (Na^+) reabsorption into blood when blood sodium drops—and if sweat lost mostly water (hypertonic blood), ADH rises while aldosterone is adjusted specifically to blood Na^+ concentration!',
        'ADH reabsorbs glucose in the glomerulus while aldosterone secretes urea',
        'Both hormones are secreted by the islets of Langerhans'
      ],
      correctIndex: 1,
      explanation: 'Heavy sweating causes water loss (low blood water / high osmolarity -> hypothalamus/pituitary release MORE ADH -> collecting ducts become MORE permeable to water -> small volume of concentrated urine). Meanwhile, aldosterone from the adrenal cortex specifically regulates Na^+ reabsorption whenever blood sodium drops.',
      concept: 'Keep kidney hormones distinct: ADH (hypothalamus/pituitary) = WATER permeability (osmoregulation); Aldosterone (adrenal cortex) = SODIUM ion uptake (salt balance).'
    },
    {
      id: 'nsc_life_d7',
      subject: 'life_sciences',
      topicId: 'life_homeo',
      difficulty: 'difficult',
      question: 'In a plant investigation, three agar-treated clinostat/unilateral-light setups are compared. What is the exact purpose of mounting a potted seedling on a ROTATING clinostat while illuminating it from one side?',
      options: [
        'To accelerate photosynthesis by spinning chloroplasts',
        'To serve as a control in which all sides of the stem receive equal illumination over time, causing auxins to remain evenly distributed so the stem grows straight upwards',
        'To destroy auxins using centrifugal force so roots grow upwards',
        'To test positive hydrotropism'
      ],
      correctIndex: 1,
      explanation: 'Slow rotation of a clinostat cancels out unilateral directional stimuli (light or gravity), keeping auxin concentration uniform on all sides of the shoot/root so cells elongate equally and growth remains straight.',
      concept: 'Clinostat rule in CAPS Paper 1: Stationary clinostat = unilateral stimulus acts -> tropic curvature occurs; Rotating clinostat = uniform stimulus -> even auxin -> straight growth.'
    },
    {
      id: 'nsc_life_d8',
      subject: 'life_sciences',
      topicId: 'life_evol',
      difficulty: 'difficult',
      question: 'How does Darwinian Natural Selection explain the rise of multidrug-resistant Mycobacterium tuberculosis (MDR-TB) in patients who stop taking their antibiotics halfway through treatment?',
      options: [
        'Individual TB bacteria realise they are dying and deliberately mutate their cell walls in order to survive the antibiotic',
        'Genetic variation already exists in the TB population (some bacteria have random pre-existing resistance mutations); incomplete antibiotic treatment kills susceptible bacteria while resistant bacteria survive, reproduce rapidly by binary fission, and pass the resistance allele to offspring, increasing resistant frequency',
        'Antibiotics inject resistance genes into human lung cells',
        'Stopping treatment turns viruses into TB bacteria'
      ],
      correctIndex: 1,
      explanation: 'Crucial CAPS natural-selection rule: antibiotics do NOT cause directed mutations, and bacteria do NOT "adapt because they need to"! Pre-existing variation + selective pressure (antibiotic) + differential survival of resistant mutants + inheritance increases resistance proportion.',
      concept: 'Lamarckian phrasing trap: NEVER write "bacteria mutated in order to survive the antibiotic"—write "there was pre-existing variation; bacteria with the favourable resistance allele survived".'
    },
    {
      id: 'nsc_life_d9',
      subject: 'life_sciences',
      topicId: 'life_evol',
      difficulty: 'difficult',
      question: 'Distinguish ALLOPATRIC speciation (the mechanism prescribed in CAPS Grade 12) from artificial selection.',
      options: [
        'Allopatric speciation occurs when humans breed domestic dogs for coat colour',
        'Allopatric speciation occurs when a population is split by a geographical barrier blocking gene flow; each sub-population experiences independent natural selection under different environmental pressures until they become genotypically/phenotypically different and can no longer interbreed to produce fertile offspring',
        'Allopatric speciation occurs inside a single pond with uninterrupted interbreeding',
        'Artificial selection always increases genetic diversity and creates geographical barriers'
      ],
      correctIndex: 1,
      explanation: 'CAPS requires 5 steps for speciation through geographic isolation: (1) Population split by specific geographic barrier; (2) No gene flow; (3) Different environmental conditions on each side; (4) Independent natural selection; (5) Even if mixed again, cannot interbreed to produce fertile offspring -> new species.',
      concept: 'Always end a CAPS speciation answer with the reproductive isolation test: "even if allowed to mix again, they cannot interbreed to produce fertile offspring".'
    },
    {
      id: 'nsc_life_d10',
      subject: 'life_sciences',
      topicId: 'life_evol',
      difficulty: 'difficult',
      question: 'Why is Australopithecus sediba ("Karabo", discovered at Malapa in the Cradle of Humankind by Lee Berger\'s team) considered a transitional species between Australopithecus and early Homo?',
      options: [
        'It possessed wings alongside human teeth',
        'It displays a mosaic of primitive Australopithecine traits (small ~420 cm^3 brain, long arms suited for climbing) AND derived Homo-like traits (more human-like pelvis, smaller teeth, less prognathous face, precision-grip hand)',
        'It had a larger cranial capacity (1 800 cm^3) than modern Homo sapiens',
        'It walked exclusively on four legs while forging iron tools'
      ],
      correctIndex: 1,
      explanation: 'A transitional fossil exhibits intermediate/mosaic characteristics of both ancestral (ape-like/Australopithecine) and descendant (Homo) groups—A. sediba combines a small brain and long climbing arms with a precision-capable hand, smaller dentition, and Homo-like pelvic features.',
      concept: 'For any transitional fossil question in CAPS, explicitly pair at least ONE ancestral trait with at least ONE advanced/derived trait.'
    },

    // =========================================================================
    // 6. ACCOUNTING (CAPS Paper 1 & 2) — 30 Questions
    // =========================================================================
    {
      id: 'nsc_acc_e1',
      subject: 'accounting',
      topicId: 'acc_comp',
      difficulty: 'easy',
      question: 'Protea Ltd issues 50 000 new ordinary shares to the public at R8,00 per share and receives R400 000 EFT into its bank account. State the effect on the Accounting Equation (Assets = Owner\'s Equity + Liabilities).',
      options: [
        'Assets +R400 000; Owner\'s Equity 0; Liabilities +R400 000',
        'Assets +R400 000; Owner\'s Equity +R400 000; Liabilities 0',
        'Assets -R400 000; Owner\'s Equity +R400 000; Liabilities 0',
        'Assets +R400 000; Owner\'s Equity -R400 000; Liabilities 0'
      ],
      correctIndex: 1,
      explanation: 'Bank (an Asset) increases by R400 000 (debit) and Ordinary Share Capital (Owner\'s Equity) increases by R400 000 (credit); Liabilities are unaffected.',
      concept: 'Issuing ordinary shares raises permanent equity capital (Owner\'s Equity increases), NOT a repayable loan liability.'
    },
    {
      id: 'nsc_acc_e2',
      subject: 'accounting',
      topicId: 'acc_comp',
      difficulty: 'easy',
      question: 'Karoo Ltd earned a Net Profit Before Tax of R1 200 000. If company income tax is levied at 27%, calculate the Net Profit After Tax.',
      options: [
        'R324 000',
        'R876 000',
        'R924 000',
        'R1 524 000'
      ],
      correctIndex: 1,
      explanation: 'Income tax = 27% of R1 200 000 = R324 000. Net Profit After Tax = R1 200 000 - R324 000 = R876 000 (73% of pre-tax profit).',
      concept: 'Companies are separate legal entities (juristic persons) taxed directly on corporate profits before declaring dividends to shareholders.'
    },
    {
      id: 'nsc_acc_e3',
      subject: 'accounting',
      topicId: 'acc_stmt',
      difficulty: 'easy',
      question: 'A retailer uses a constant mark-up of 60% on cost. Calculate the Cost of Sales for merchandise sold for R9 600.',
      options: [
        'R3 840',
        'R6 000',
        'R5 760',
        'R3 600'
      ],
      correctIndex: 1,
      explanation: 'Selling price = 100% + 60% = 160% of cost. Cost of Sales = R9 600 * (100 / 160) = R6 000 (and Gross Profit = R3 600).',
      concept: 'Mark-up on cost formula: Cost of Sales = Sales * [100 / (100 + Mark-up %)]. Never take 40% of Sales!'
    },
    {
      id: 'nsc_acc_e4',
      subject: 'accounting',
      topicId: 'acc_stmt',
      difficulty: 'easy',
      question: 'Which independent auditor\'s opinion should shareholders be pleased to see in a public company\'s annual report?',
      options: [
        'Disclaimer of opinion',
        'Qualified audit report ("except for...")',
        'Unqualified ("clean") audit report stating the financial statements fairly present the company\'s position',
        'Adverse opinion'
      ],
      correctIndex: 2,
      explanation: 'An Unqualified ("clean") opinion means the independent external auditors found no material misstatements and confirmed compliance with IFRS and the Companies Act.',
      concept: 'Terminology trap: in auditing, UNQUALIFIED = clean/good (no reservations), whereas QUALIFIED = flawed ("fair, except for a specific material issue")!'
    },
    {
      id: 'nsc_acc_e5',
      subject: 'accounting',
      topicId: 'acc_cash',
      difficulty: 'easy',
      question: 'Calculate the Current Ratio if Current Assets total R540 000 and Current Liabilities total R300 000.',
      options: [
        '0,56 : 1',
        '1,8 : 1',
        '2,8 : 1',
        '180%'
      ],
      correctIndex: 1,
      explanation: 'Current Ratio = Current Assets : Current Liabilities = 540 000 : 300 000 = (540 000 / 300 000) : 1 = 1,8 : 1.',
      concept: 'Liquidity ratios (Current Ratio and Acid-Test Ratio) MUST always be expressed in the ratio format "x : 1", never as percentages!'
    },
    {
      id: 'nsc_acc_e6',
      subject: 'accounting',
      topicId: 'acc_cash',
      difficulty: 'easy',
      question: 'Under which section of a Company Cash Flow Statement are "Proceeds from issue of shares" and "Repayment of long-term loan" reported?',
      options: [
        'Cash effects of operating activities',
        'Cash effects of investing activities',
        'Cash effects of financing activities',
        'Cash equivalents note'
      ],
      correctIndex: 2,
      explanation: 'Financing activities cover long-term capital structure changes: share issues (+), share buy-backs (-), new long-term loans received (+), and long-term loan repayments (-).',
      concept: 'Cash Flow 3 sections: Operating (trading cash, interest, tax, dividends paid), Investing (fixed assets & financial assets), Financing (shares & long-term loans).'
    },
    {
      id: 'nsc_acc_e7',
      subject: 'accounting',
      topicId: 'acc_inv',
      difficulty: 'easy',
      question: 'How is Cost of Sales determined at year-end in a business that uses the PERIODIC inventory system?',
      options: [
        'Read directly off a continuous Cost of Sales ledger account updated on every invoice',
        'Opening Stock + Net Purchases + Carriage on Purchases (+ Custom Duties) - Closing Stock',
        'Total Sales minus Operating Expenses',
        'Closing Stock minus Opening Stock'
      ],
      correctIndex: 1,
      explanation: 'Under the periodic system, Cost of Sales is not recorded at each sale; instead, a physical stock count at period-end determines Closing Stock, and Cost of Sales = Opening Stock + Net Purchases + Carriage Inwards - Closing Stock.',
      concept: 'Carriage on PURCHASES increases the cost of stock available for sale, whereas Carriage on SALES is an operating selling expense.'
    },
    {
      id: 'nsc_acc_e8',
      subject: 'accounting',
      topicId: 'acc_inv',
      difficulty: 'easy',
      question: 'When a VAT-registered business buys trading stock from a supplier, how does the 15% VAT on that invoice affect its VAT position with SARS?',
      options: [
        'It is Output VAT that increases the liability owed to SARS',
        'It is Input VAT claimable from SARS, which reduces the net VAT payable to SARS',
        'Trading stock is exempt from VAT in South Africa',
        'It is recorded as part of the Cost of Sales expense'
      ],
      correctIndex: 1,
      explanation: 'VAT paid/incurred on business purchases and expenses is Input VAT (an asset/claim from SARS), which offsets Output VAT collected from customers on sales.',
      concept: 'Net VAT payable to SARS = Output VAT (collected on sales) - Input VAT (paid on business inputs); trading stock itself is recorded in the ledger EXCLUDING VAT.'
    },
    {
      id: 'nsc_acc_e9',
      subject: 'accounting',
      topicId: 'acc_cost',
      difficulty: 'easy',
      question: 'A clothing factory incurred Direct Material Cost of R240 000, Direct Labour Cost of R185 000, Factory Overhead Cost of R95 000, and Selling Cost of R40 000. Calculate Prime (Direct) Cost.',
      options: [
        'R520 000',
        'R425 000',
        'R560 000',
        'R335 000'
      ],
      correctIndex: 1,
      explanation: 'Prime (Direct) Cost = Direct Material Cost + Direct Labour Cost = R240 000 + R185 000 = R425 000. Factory Overheads are indirect manufacturing costs, and Selling Costs are non-manufacturing period costs.',
      concept: 'Prime Cost = Direct Material + Direct Labour; Total Manufacturing Cost = Prime Cost + Factory Overheads.'
    },
    {
      id: 'nsc_acc_e10',
      subject: 'accounting',
      topicId: 'acc_cost',
      difficulty: 'easy',
      question: 'On 31 March, cash takings of R12 400 were recorded in the Cash Receipts Journal and deposited late that afternoon, so they do not yet appear on the March bank statement. How is R12 400 treated?',
      options: [
        'Reversed out of the Cash Payments Journal',
        'Entered as Credit Outstanding Deposit (+R12 400) on the March Bank Reconciliation Statement',
        'Written off as a bank charge',
        'Deducted from the favourable bank statement balance'
      ],
      correctIndex: 1,
      explanation: 'The business\'s Bank ledger account is already correct; it is the bank statement that lags behind. Therefore, record R12 400 as a Credit Outstanding Deposit on the Bank Reconciliation Statement.',
      concept: 'Bank Recon golden rule: items missing from the JOURNALS (bank charges, interest, dishonoured EFTs, direct deposits) go into CRJ/CPJ; items missing from the BANK STATEMENT (outstanding deposits/EFTs) go onto the Bank Recon Statement.'
    },
    {
      id: 'nsc_acc_m1',
      subject: 'accounting',
      topicId: 'acc_comp',
      difficulty: 'medium',
      question: 'Sabi Ltd has 200 000 issued ordinary shares with Ordinary Share Capital of R1 200 000. The directors repurchase (buy back) 30 000 shares at R8,50 per share (total EFT R255 000). How is the R255 000 split between Ordinary Share Capital and Retained Income?',
      options: [
        'Ordinary Share Capital -R255 000; Retained Income R0',
        'Ordinary Share Capital -R180 000 (at R6,00 average issue price); Retained Income -R75 000 (at R2,50 above average)',
        'Ordinary Share Capital R0; Retained Income -R255 000',
        'Ordinary Share Capital -R75 000; Retained Income -R180 000'
      ],
      correctIndex: 1,
      explanation: 'Step 1 (Average issue price): R1 200 000 / 200 000 shares = R6,00 per share. Step 2: Ordinary Share Capital decreases by 30 000 * R6,00 = R180 000. Step 3: Excess paid above average price = 30 000 * (R8,50 - R6,00) = 30 000 * R2,50 = R75 000 deducted from Retained Income.',
      concept: 'CAPS Share Buy-Back rule: ALWAYS remove repurchased shares from Ordinary Share Capital at the AVERAGE issue price, charging any excess paid to Retained Income.'
    },
    {
      id: 'nsc_acc_m2',
      subject: 'accounting',
      topicId: 'acc_comp',
      difficulty: 'medium',
      question: 'At year-end, Ordinary Shareholders\' Equity is R4 320 000 and 480 000 ordinary shares are in issue. Calculate the Net Asset Value (NAV) per share in cents.',
      options: [
        '1 111 cents',
        '900 cents (R9,00)',
        '90 cents',
        '480 cents'
      ],
      correctIndex: 1,
      explanation: 'NAV per share = (Ordinary Shareholders\' Equity / Number of issued shares at year-end) * 100 = (4 320 000 / 480 000) * 100 = 9 * 100 = 900 cents (R9,00).',
      concept: 'Compare NAV per share (underlying book value) against the JSE market price per share to assess whether the market prices the shares at a premium or discount.'
    },
    {
      id: 'nsc_acc_m3',
      subject: 'accounting',
      topicId: 'acc_stmt',
      difficulty: 'medium',
      question: 'A company\'s financial year ends on 28 February 2026. Included in Insurance is an annual premium of R18 000 paid on 1 November 2025 for the 12-month period 1 November 2025 to 31 October 2026. Calculate the year-end Prepaid Expense adjustment.',
      options: [
        'R6 000 deducted from Insurance',
        'R12 000 deducted from Insurance and added to Trade and Other Receivables',
        'R12 000 added to Insurance and Trade and Other Payables',
        'R9 000 deducted from Insurance'
      ],
      correctIndex: 1,
      explanation: 'Only 4 months (Nov, Dec, Jan, Feb) fall inside the current financial year; 8 months (1 March 2026 – 31 October 2026) belong to the NEXT financial year. Prepaid Expense = R18 000 * (8 / 12) = R12 000.',
      concept: 'Matching principle (accrual accounting): deduct expenses paid for the next period (Prepaid Expense -> Current Asset) and add unpaid expenses incurred this period (Accrued Expense -> Current Liability).'
    },
    {
      id: 'nsc_acc_m4',
      subject: 'accounting',
      topicId: 'acc_stmt',
      difficulty: 'medium',
      question: 'On 28 February 2026, Trade Debtors total R160 000 and the Provision for Bad Debts (pre-adjustment trial balance) stands at R9 200. Provision is maintained at 5% of Trade Debtors. How does this adjustment affect the Statement of Comprehensive Income?',
      options: [
        'R8 000 Operating Expense',
        'R1 200 Operating Income (Provision for bad debts adjustment)',
        'R1 200 Operating Expense',
        'R9 200 Operating Income'
      ],
      correctIndex: 1,
      explanation: 'New required provision = 5% of R160 000 = R8 000. Because the existing provision (R9 200) must DECREASE by R1 200 to R8 000, the R1 200 reduction is credited as Operating Income ("Provision for bad debts adjustment").',
      concept: 'Increase in Provision for Bad Debts -> Operating Expense; Decrease in Provision for Bad Debts -> Operating Income; on the Balance Sheet, deduct the FULL R8 000 from Trade Debtors.'
    },
    {
      id: 'nsc_acc_m5',
      subject: 'accounting',
      topicId: 'acc_cash',
      difficulty: 'medium',
      question: 'Current Assets total R680 000 (which includes Trading Stock of R290 000) and Current Liabilities total R300 000. Calculate the Acid-Test (Quick) Ratio.',
      options: [
        '2,3 : 1',
        '1,3 : 1',
        '1,0 : 1',
        '0,97 : 1'
      ],
      correctIndex: 1,
      explanation: 'Acid-Test Ratio = (Current Assets - Inventories) : Current Liabilities = (680 000 - 290 000) : 300 000 = 390 000 : 300 000 = 1,3 : 1.',
      concept: 'Trading stock is excluded from the Acid-Test Ratio because inventory is the least liquid current asset and may take months (or discounts) to convert into cash.'
    },
    {
      id: 'nsc_acc_m6',
      subject: 'accounting',
      topicId: 'acc_cash',
      difficulty: 'medium',
      question: 'Calculate "Income tax paid" for the Cash Flow Statement given:\n- SARS (Income tax) on 1 March 2025: R42 000 (Credit / owed to SARS)\n- Income tax per Income Statement for the year: R295 000\n- SARS (Income tax) on 28 February 2026: R18 000 (Debit / receivable from SARS)',
      options: [
        'R319 000 outflow',
        'R355 000 outflow',
        'R271 000 outflow',
        'R235 000 outflow'
      ],
      correctIndex: 1,
      explanation: 'The company paid off last year\'s R42 000 tax liability + paid the full R295 000 current-year tax assessment + overpaid an extra R18 000 (creating the closing debit asset): 42 000 + 295 000 + 18 000 = R355 000 cash outflow.',
      concept: 'Watch Debit vs Credit signs on SARS (Income Tax): an opening Credit is added to cash paid, and a closing Debit (overpayment) is ALSO added to cash paid!'
    },
    {
      id: 'nsc_acc_m7',
      subject: 'accounting',
      topicId: 'acc_inv',
      difficulty: 'medium',
      question: 'A sports shop values hockey sticks using FIFO:\n- Opening stock: 100 sticks @ R400 each\n- May purchase: 250 sticks @ R460 each\n- Nov purchase: 150 sticks @ R520 each\nAt year-end, 180 sticks remain unsold. Calculate the value of Closing Stock.',
      options: [
        'R73 800',
        'R91 800',
        'R82 800',
        'R93 600'
      ],
      correctIndex: 1,
      explanation: 'Under First-In-First-Out (FIFO), the oldest units are sold first, so the 180 unsold sticks come from the MOST RECENT purchases: all 150 Nov sticks @ R520 (R78 000) + 30 May sticks @ R460 (R13 800) = R91 800.',
      concept: 'FIFO Closing Stock shortcut: work BACKWARDS from the latest purchase batch until you account for all closing units on hand.'
    },
    {
      id: 'nsc_acc_m8',
      subject: 'accounting',
      topicId: 'acc_inv',
      difficulty: 'medium',
      question: 'Using the Weighted-Average method, calculate the value of 160 closing units given:\n- Opening stock: 200 units = R10 000\n- Net purchases: 800 units = R44 400\n- Carriage on purchases: R3 600',
      options: [
        'R8 704',
        'R9 280',
        'R8 880',
        'R10 000'
      ],
      correctIndex: 1,
      explanation: 'Weighted-average unit cost = (Opening Stock + Net Purchases + Carriage on Purchases) / Total Available Units = (10 000 + 44 400 + 3 600) / (200 + 800) = R58 000 / 1 000 = R58,00 per unit. Closing stock = 160 * R58,00 = R9 280.',
      concept: 'Include Carriage on Purchases in the numerator of the weighted-average unit cost formula, and subtract any returns to suppliers from both Rand cost and unit count.'
    },
    {
      id: 'nsc_acc_m9',
      subject: 'accounting',
      topicId: 'acc_cost',
      difficulty: 'medium',
      question: 'A solar-lamp manufacturer has total Fixed Costs of R360 000, Variable Costs of R90 per lamp, and a Selling Price of R150 per lamp. Calculate the Break-Even Point (BEP) in units.',
      options: [
        '2 400 lamps',
        '4 000 lamps',
        '6 000 lamps',
        '1 500 lamps'
      ],
      correctIndex: 2,
      explanation: 'Contribution per unit = Selling Price - Variable Cost per unit = R150 - R90 = R60. Break-Even Point = Total Fixed Costs / Contribution per unit = R360 000 / R60 = 6 000 lamps.',
      concept: 'Compare actual units produced/sold against the BEP AND against last year\'s BEP when commenting on cost control and profitability in Paper 2.'
    },
    {
      id: 'nsc_acc_m10',
      subject: 'accounting',
      topicId: 'acc_cost',
      difficulty: 'medium',
      question: 'Why are "Depreciation on vehicles (R24 000)" and "Discount allowed to debtors (R3 200)" included in a Projected Income Statement but OMITTED from a Cash Budget?',
      options: [
        'Because vehicles and debtors are illegal in a Cash Budget',
        'Because a Cash Budget records ONLY expected cash inflows and cash outflows affecting the Bank balance, whereas depreciation and discount allowed are non-cash expenses',
        'Because depreciation is paid only once every five years in cash',
        'Because both items are capital liabilities'
      ],
      correctIndex: 1,
      explanation: 'A Cash Budget forecasts timing of actual Bank receipts and payments; non-cash expenses (depreciation, bad debts, discount allowed, loss on disposal) reduce accounting profit in the Projected Income Statement without any cash leaving Bank.',
      concept: 'Items in Cash Budget ONLY (not Income Statement): loan repayments, capital asset purchases, drawings in cash, VAT settlements; Items in Income Statement ONLY: depreciation, bad debts, discounts.'
    },
    {
      id: 'nsc_acc_d1',
      subject: 'accounting',
      topicId: 'acc_comp',
      difficulty: 'difficult',
      question: 'Calculate the closing balance of the Retained Income note given:\n- Opening balance (1 March 2025): R640 000\n- Net profit after tax: R920 000\n- Repurchase of 30 000 shares at R3,00 ABOVE average issue price: R90 000\n- Interim dividends paid: R180 000\n- Final dividends declared at year-end: R250 000',
      options: [
        'R1 290 000',
        'R1 040 000',
        'R1 130 000',
        'R1 220 000'
      ],
      correctIndex: 1,
      explanation: 'Closing Retained Income = Opening (640 000) + Net Profit After Tax (920 000) - Buy-back excess above average price (90 000) - Total Ordinary Dividends (180 000 interim + 250 000 final = 430 000) = R1 040 000.',
      concept: 'Retained Income deducts BOTH interim dividends paid AND final dividends declared (whereas the Cash Flow Statement\'s "Dividends paid" uses Shareholders for Dividends balances!).'
    },
    {
      id: 'nsc_acc_d2',
      subject: 'accounting',
      topicId: 'acc_comp',
      difficulty: 'difficult',
      question: 'Impala Ltd increased its long-term loan this year, raising its Debt-Equity Ratio from 0,3 : 1 to 0,8 : 1. The interest rate on loans is 13,0% p.a., and Return on Total Capital Employed (ROTCE) is 19,5%. Evaluate this decision.',
      options: [
        'Poor decision: any Debt-Equity Ratio above 0,5 : 1 automatically causes bankruptcy',
        'Higher financial risk (0,8 : 1), BUT the company enjoys POSITIVE GEARING because ROTCE (19,5%) exceeds the borrowing interest rate (13,0%), meaning borrowed funds generate surplus return for shareholders',
        'Negative gearing because 0,8 is smaller than 13%',
        'No effect on risk or gearing'
      ],
      correctIndex: 1,
      explanation: 'CAPS gearing commentary MUST always quote TWO indicators together: (1) Risk via Debt-Equity Ratio (0,3 : 1 -> 0,8 : 1 = higher financial risk) AND (2) Gearing via ROTCE (19,5%) vs Loan Interest Rate (13,0%) -> ROTCE > Interest = Positive Gearing!',
      concept: ' CAPS 6-mark gearing formula: quote Debt-Equity change (risk) + compare ROTCE % against Interest Rate % (ROTCE > interest = positively geared; ROTCE < interest = negatively geared).'
    },
    {
      id: 'nsc_acc_d3',
      subject: 'accounting',
      topicId: 'acc_stmt',
      difficulty: 'difficult',
      question: 'A delivery van (original cost R300 000) had Accumulated Depreciation of R160 000 on 1 March 2025. It was sold on 31 August 2025 (6 months into the year) for R125 000 cash. Depreciation is 20% p.a. on the DIMINISHING-BALANCE method. Calculate the profit or loss on disposal.',
      options: [
        'R15 000 loss on disposal',
        'R1 000 loss on disposal',
        'R15 000 profit on disposal',
        'R19 000 profit on disposal'
      ],
      correctIndex: 1,
      explanation: 'Carrying value on 1 March 2025 = 300 000 - 160 000 = R140 000. Six months\' diminishing-balance depreciation (1 Mar – 31 Aug) = 140 000 * 20% * (6 / 12) = R14 000. Carrying value on disposal date = 140 000 - 14 000 = R126 000. Sold for R125 000 -> R1 000 Loss on Disposal of Asset.',
      concept: 'Always update pro-rata depreciation up to the exact date of sale BEFORE comparing carrying value against proceeds to find Profit/Loss on Disposal.'
    },
    {
      id: 'nsc_acc_d4',
      subject: 'accounting',
      topicId: 'acc_stmt',
      difficulty: 'difficult',
      question: 'External auditors discover that directors refused to provide source documents for R4,2 million in "director travel expenses" and could not verify physical inventory across three warehouses, making it impossible to express an opinion on the statements as a whole. Which audit report will be issued, and what is the likely consequence?',
      options: [
        'Unqualified audit report; share price rises',
        'Disclaimer of opinion; severe drop in investor/lender confidence, JSE investigation, and potential disciplinary/legal action against directors under the Companies Act',
        'Informal verbal warning with no published report',
        'Clean King IV governance certificate'
      ],
      correctIndex: 1,
      explanation: 'When scope limitations/missing evidence are so pervasive and material that auditors cannot obtain sufficient audit evidence to form an opinion, they issue a Disclaimer of Opinion—triggering severe market, lender, and regulatory repercussions.',
      concept: 'Audit report ladder: Unqualified (clean) -> Qualified ("except for" isolated material item) -> Disclaimer (insufficient evidence to express an opinion) / Adverse (pervasive misstatement).'
    },
    {
      id: 'nsc_acc_d5',
      subject: 'accounting',
      topicId: 'acc_cash',
      difficulty: 'difficult',
      question: 'Compute "Proceeds from sale of fixed assets" (sold at carrying value) given:\n- Tangible assets carrying value (start of year): R2 400 000\n- Additions to land & equipment at cost: R750 000\n- Depreciation for the year: R310 000\n- Tangible assets carrying value (end of year): R2 620 000',
      options: [
        'R530 000 inflow',
        'R220 000 inflow',
        'R840 000 inflow',
        'R190 000 inflow'
      ],
      correctIndex: 1,
      explanation: 'Fixed Asset Note equation: Opening CV + Additions - Disposals at CV - Depreciation = Closing CV -> 2 400 000 + 750 000 - Disposals - 310 000 = 2 620 000 -> 2 840 000 - Disposals = 2 620 000 -> Disposals at CV = R220 000 cash inflow.',
      concept: 'If assets are sold at a profit/loss, Cash Proceeds = Carrying Value of Disposals + Profit on Sale (or minus Loss on Sale).'
    },
    {
      id: 'nsc_acc_d6',
      subject: 'accounting',
      topicId: 'acc_cash',
      difficulty: 'difficult',
      question: 'A furniture store reports a Current Ratio of 2,9 : 1 alongside an Acid-Test Ratio of 0,5 : 1. What financial problem do these two ratios reveal when analysed together?',
      options: [
        'The store holds far too much idle cash in its bank account',
        'Severe liquidity risk: 2,4 of the 2,9 current-asset cover is tied up in slow-moving/excess Trading Stock, leaving only R0,50 in liquid cash/debtors per R1,00 of short-term liabilities',
        'The store has zero Trading Stock and cannot fulfil customer orders',
        'Long-term solvency is negative'
      ],
      correctIndex: 1,
      explanation: 'A wide gap between Current Ratio (2,9 : 1) and Acid-Test Ratio (0,5 : 1, well below 1 : 1) proves that working capital is stockpiled in unsold inventory, risking inability to pay creditors on time.',
      concept: 'Never praise a high Current Ratio in isolation—always check the Acid-Test Ratio alongside Stock Turnover Rate / Stock Holding Period!'
    },
    {
      id: 'nsc_acc_d7',
      subject: 'accounting',
      topicId: 'acc_inv',
      difficulty: 'difficult',
      question: 'Calculate the closing balance payable to SARS in the VAT Control Account given:\n- Opening balance owed to SARS: R14 200\n- VAT on cash & credit sales: R84 000\n- VAT on trading stock & expense invoices: R51 000\n- VAT on sales returns (debtors\' allowances): R3 000\n- VAT on stock taken by owner for personal use: R1 200\n- VAT on bad debts written off: R900',
      options: [
        'R44 500 payable to SARS',
        'R46 300 payable to SARS',
        'R42 100 payable to SARS',
        'R48 500 payable to SARS'
      ],
      correctIndex: 0,
      explanation: 'Credits (increase payable to SARS): Opening 14 200 + Sales Output VAT 84 000 + Drawings of stock 1 200 = R99 400. Debits (reduce payable to SARS): Input VAT 51 000 + Debtors\' allowances 3 000 + Bad debts written off 900 = R54 900. Net payable = 99 400 - 54 900 = R44 500.',
      concept: 'Tricky VAT Control items: Drawings of stock INCREASES VAT owed to SARS (owner acts as final consumer); Debtors\' allowances & Bad debts written off REDUCE VAT owed to SARS!'
    },
    {
      id: 'nsc_acc_d8',
      subject: 'accounting',
      topicId: 'acc_inv',
      difficulty: 'difficult',
      question: 'An electronics shop had 320 headphones at the start of the year, purchased 1 480 units, returned 50 damaged units to suppliers, and sold 1 390 units according to sales invoices. Physical stocktaking counted 335 units on the shelves. Calculate the number of missing/stolen units.',
      options: [
        '75 units missing',
        '25 units missing',
        '15 units surplus',
        '50 units missing'
      ],
      correctIndex: 1,
      explanation: 'Expected units on hand = Opening (320) + Purchases (1 480) - Returns to supplier (50) - Units sold (1 390) = 1 750 - 1 390 = 360 units. Physical count = 335 units -> 360 - 335 = 25 units missing through shrinkage/theft.',
      concept: 'Internal controls to prevent stock shrinkage: regular surprise stock counts, CCTV/security tags, division of duties between receiving/dispatch/recording, and checking delivery notes against invoices.'
    },
    {
      id: 'nsc_acc_d9',
      subject: 'accounting',
      topicId: 'acc_cost',
      difficulty: 'difficult',
      question: 'Calculate the Cost of Production of Finished Goods for the Production Cost Statement given:\n- Direct Material Cost: R420 000\n- Direct Labour Cost: R310 000\n- Factory Overhead Cost: R210 000\n- Work-in-Process (start of year): R65 000\n- Work-in-Process (end of year): R85 000',
      options: [
        'R940 000',
        'R920 000',
        'R960 000',
        'R730 000'
      ],
      correctIndex: 1,
      explanation: 'Total Manufacturing Costs = 420 000 + 310 000 + 210 000 = R940 000. Add Opening Work-in-Process (+65 000) and subtract Closing Work-in-Process (-85 000) = R920 000 Cost of Production of Finished Goods.',
      concept: 'Production Cost Statement bottom section: Total Manufacturing Costs + Opening WIP - Closing WIP = Cost of Production of Finished Goods (transferred to Finished Goods Stock).'
    },
    {
      id: 'nsc_acc_d10',
      subject: 'accounting',
      topicId: 'acc_cost',
      difficulty: 'difficult',
      question: 'A wholesaler\'s credit terms are strictly 30 days and every customer\'s credit limit is R20 000. A Debtors\' Age Analysis shows Debtor P. Mokoena owes R28 500 in total (R12 500 in 30 days, R9 000 in 60 days, and R7 000 in 90+ days), and Mokoena has just submitted a new R6 000 credit order. Identify TWO internal control failures and the correct action.',
      options: [
        'Approve the R6 000 order immediately to boost sales revenue',
        'Failures: (1) Credit limit of R20 000 was breached by R8 500, and (2) R16 000 is overdue in 60–90+ days without suspension. Action: Block further credit sales to Mokoena until overdue arrears are settled and charge interest on overdue balances',
        'Write off the entire R28 500 immediately without contacting the debtor',
        'Transfer Mokoena\'s balance to Creditors\' Control'
      ],
      correctIndex: 1,
      explanation: 'Debtors\' Age Analysis questions test whether you spot BOTH credit-limit violations (R28 500 > R20 000) AND aging breaches (60/90+ day arrears), paired with practical remedies (freeze credit until arrears are cleared, send reminders/statements, charge interest).',
      concept: 'Always quote exact Rand figures and days from the Age Analysis table when identifying internal control weaknesses in CAPS Paper 2.'
    },

    // =========================================================================
    // 7. BUSINESS STUDIES (CAPS Paper 1 & 2) — 30 Questions
    // =========================================================================
    {
      id: 'nsc_bus_e1',
      subject: 'business_studies',
      topicId: 'bus_leg',
      difficulty: 'easy',
      question: 'Over which business environment does management exercise FULL control (including vision, mission, organisational culture, and the eight business functions)?',
      options: [
        'Macro environment',
        'Market environment',
        'Micro environment',
        'Global environment'
      ],
      correctIndex: 2,
      explanation: 'Management has full internal control over the Micro environment, limited/partial influence over the Market environment (customers, suppliers, competitors), and zero control over the Macro environment (PESTLE).',
      concept: 'Control hierarchy: Micro = full control (SWOT Strengths/Weaknesses); Market = some influence (Porter\'s Five Forces); Macro = no control (PESTLE).'
    },
    {
      id: 'nsc_bus_e2',
      subject: 'business_studies',
      topicId: 'bus_leg',
      difficulty: 'easy',
      question: 'Which South African Act regulates maximum ordinary working hours (45 hours per week), overtime pay rates, meal intervals, and annual/maternity leave?',
      options: [
        'National Credit Act (NCA) 34 of 2005',
        'Basic Conditions of Employment Act (BCEA) 75 of 1997',
        'Consumer Protection Act (CPA) 68 of 2008',
        'Broad-Based Black Economic Empowerment Act (BBBEE)'
      ],
      correctIndex: 1,
      explanation: 'The Basic Conditions of Employment Act (BCEA) establishes minimum statutory floor conditions for working hours, leave, overtime (1,5x normal pay; 2x on Sundays/public holidays), and termination notice.',
      concept: 'Do not confuse BCEA (working hours, leave, overtime, child-labour ban) with LRA (trade unions, strikes, collective bargaining, CCMA).'
    },
    {
      id: 'nsc_bus_e3',
      subject: 'business_studies',
      topicId: 'bus_strat',
      difficulty: 'easy',
      question: 'What is the main difference between Quality Control (QC) and Quality Assurance (QA)?',
      options: [
        'QC inspects finished products at the END of production to remove defects, whereas QA builds preventative checks into EVERY stage of the production process to prevent defects from occurring',
        'QC applies only to banks whereas QA applies only to farms',
        'QA ignores customer requirements completely',
        'They are identical terms in CAPS Business Studies'
      ],
      correctIndex: 0,
      explanation: 'Quality Control is reactive inspection of final batches to catch rejects; Quality Assurance is proactive process management ("getting it right the first time") at every stage.',
      concept: 'Memory hook: Quality Control = Inspect finished output; Quality Assurance = Prevent defects during every process step.'
    },
    {
      id: 'nsc_bus_e4',
      subject: 'business_studies',
      topicId: 'bus_strat',
      difficulty: 'easy',
      question: 'A dairy farm buys its own fleet of refrigerated retail milk-delivery stores so it can sell directly to households. Which integration strategy is this?',
      options: [
        'Backward vertical integration',
        'Forward vertical integration',
        'Horizontal integration',
        'Divestiture'
      ],
      correctIndex: 1,
      explanation: 'Taking over a distributor or retailer closer to the final consumer is Forward Vertical Integration. Taking over a raw-material supplier is Backward Integration; taking over a rival dairy farm is Horizontal Integration.',
      concept: 'Integration directions: Backward = buy supplier; Forward = buy distributor/retailer; Horizontal = buy competitor in the same industry stage.'
    },
    {
      id: 'nsc_bus_e5',
      subject: 'business_studies',
      topicId: 'bus_hr',
      difficulty: 'easy',
      question: 'In the Human Resources function, distinguish a Job Description from a Job Specification.',
      options: [
        'Job Description outlines duties, responsibilities, and working conditions of the post; Job Specification outlines minimum qualifications, skills, and experience required of the candidate',
        'Job Description states the candidate\'s university degree; Job Specification lists daily tasks',
        'Both documents are written by the applicant during the interview',
        'Job Specification is another name for an employment contract'
      ],
      correctIndex: 0,
      explanation: 'Job Description describes the JOB itself (title, duties, responsibilities, authority); Job Specification specifies the PERSON needed (qualifications, experience, skills).',
      concept: 'Both Job Description and Job Specification are compiled via Job Analysis BEFORE advertising a vacancy.'
    },
    {
      id: 'nsc_bus_e6',
      subject: 'business_studies',
      topicId: 'bus_hr',
      difficulty: 'easy',
      question: 'Which salary determination method pays workers a fixed rate for each completed unit/garment produced rather than for hours spent at work?',
      options: [
        'Time-related salary determination',
        'Piecemeal salary determination',
        'Fringe benefit allowance',
        'Golden handshake'
      ],
      correctIndex: 1,
      explanation: 'Piecemeal remuneration pays per unit produced (common in manufacturing/fruit picking), whereas Time-related remuneration pays according to hours/months worked.',
      concept: 'Piecemeal motivates higher output volume but requires strict Quality Control so workers do not rush and compromise product quality.'
    },
    {
      id: 'nsc_bus_e7',
      subject: 'business_studies',
      topicId: 'bus_inv',
      difficulty: 'easy',
      question: 'Which three schemes make up COMPULSORY insurance prescribed by law in South Africa?',
      options: [
        'Household contents cover, vehicle comprehensive cover, and life assurance',
        'Unemployment Insurance Fund (UIF), Road Accident Fund (RAF), and Compensation for Occupational Injuries and Diseases (COIDA)',
        'Unit trusts, endowment policies, and medical aid',
        'Fidelity insurance, public liability, and fire insurance'
      ],
      correctIndex: 1,
      explanation: 'In CAPS Business Studies, the three statutory compulsory insurance schemes are UIF, RAF (funded via the fuel levy), and COIDA (employer-funded workplace injury/disease fund).',
      concept: 'Never list medical aid, pension funds, or car theft insurance under compulsory state insurance—only UIF, RAF, and COIDA qualify!'
    },
    {
      id: 'nsc_bus_e8',
      subject: 'business_studies',
      topicId: 'bus_inv',
      difficulty: 'easy',
      question: 'Which form of ownership in South Africa is a public company allowed to list its shares on the Johannesburg Stock Exchange (JSE), and what letters must end its registered name?',
      options: [
        'Private Company — ends in (Pty) Ltd',
        'Public Company — ends in Ltd',
        'Personal Liability Company — ends in Inc.',
        'Sole Proprietorship'
      ],
      correctIndex: 1,
      explanation: 'A Public Company ("Ltd") may invite the general public to buy shares via a prospectus and list on the JSE, whereas a Private Company ("(Pty) Ltd") restricts share transfers and cannot offer shares to the public.',
      concept: 'Company suffixes under the Companies Act: Ltd = Public; (Pty) Ltd = Private; Inc. = Personal Liability (directors jointly/severally liable); SOC Ltd = State-Owned.'
    },
    {
      id: 'nsc_bus_e9',
      subject: 'business_studies',
      topicId: 'bus_eth',
      difficulty: 'easy',
      question: 'Which three core corporate governance principles of the King Code are emphasised in CAPS Business Studies?',
      options: [
        'Secrecy, Monopoly, and Tax Avoidance',
        'Transparency, Accountability, and Responsibility',
        'Autocracy, Deregulation, and Speculation',
        'Retrenchment, Liquidation, and Sequestration'
      ],
      correctIndex: 1,
      explanation: 'The King Reports on Corporate Governance establish Transparency (open honest disclosure), Accountability (answering to stakeholders for decisions), and Responsibility (ethical, sustainable stewardship).',
      concept: 'Link King Code answers directly to real board actions (independent audits, accurate reporting, environmental & social responsibility).'
    },
    {
      id: 'nsc_bus_e10',
      subject: 'business_studies',
      topicId: 'bus_eth',
      difficulty: 'easy',
      question: 'What are the three pillars of the Triple Bottom Line in Corporate Social Responsibility?',
      options: [
        'Sales, Imports, and Exports',
        'Profit (Economic), People (Social), and Planet (Environmental)',
        'Micro, Market, and Macro',
        'Forming, Storming, and Norming'
      ],
      correctIndex: 1,
      explanation: 'Triple Bottom Line reporting evaluates a company not solely on financial Profit, but equally on its impact on People (employees/communities) and the Planet (environmental sustainability).',
      concept: 'CSR is the broad ongoing commitment to socio-economic/environmental responsibility; CSI is the practical spending/projects (e.g., bursaries, school labs) executing that commitment.'
    },
    {
      id: 'nsc_bus_m1',
      subject: 'business_studies',
      topicId: 'bus_leg',
      difficulty: 'medium',
      question: 'A telemarketer phones a consumer unsolicited and sells her a gym contract. Three business days later she changes her mind and cancels in writing. Which South African Act and consumer right protect her from paying a cancellation penalty?',
      options: [
        'Labour Relations Act — right to strike',
        'Consumer Protection Act (CPA) — 5-business-day cooling-off period under the right to privacy / direct marketing protection',
        'Skills Development Act — workplace skills plan',
        'COIDA — occupational injury claim'
      ],
      correctIndex: 1,
      explanation: 'Under the Consumer Protection Act (CPA), consumers who enter an agreement resulting from direct marketing have a 5-business-day cooling-off right to cancel in writing without reason or penalty.',
      concept: 'Key CPA consumer rights: Right to choose, privacy (cooling-off & opt-out registry), fair/honest dealing, disclosure/plain language, fair value/good quality/safety (6-month implied warranty).'
    },
    {
      id: 'nsc_bus_m2',
      subject: 'business_studies',
      topicId: 'bus_leg',
      difficulty: 'medium',
      question: 'A micro-lender grants a R90 000 loan to an applicant without checking her payslip, monthly living expenses, or credit bureau record. Which Act has the lender violated, and what is this unlawful practice called?',
      options: [
        'National Credit Act (NCA) — reckless credit granting',
        'Employment Equity Act — affirmative action',
        'BBBEE Act — fronting',
        'BCEA — overtime violation'
      ],
      correctIndex: 0,
      explanation: 'The National Credit Act (NCA) compels credit providers to conduct a thorough affordability assessment before granting credit; failing to do so constitutes reckless credit, allowing a court/tribunal to suspend the credit agreement.',
      concept: 'NCA protects consumers against reckless lending, over-indebtedness, negative option marketing, and hidden credit costs while capping maximum interest/fees.'
    },
    {
      id: 'nsc_bus_m3',
      subject: 'business_studies',
      topicId: 'bus_strat',
      difficulty: 'medium',
      question: 'A successful smartphone manufacturer starts producing smartwatches and wireless earbuds using its existing audio/screen technology to attract NEW customers. Which diversification strategy is this?',
      options: [
        'Conglomerate diversification',
        'Concentric diversification',
        'Horizontal diversification',
        'Liquidation'
      ],
      correctIndex: 1,
      explanation: 'Adding new products that are technologically or commercially related to existing products in order to attract NEW customers is Concentric Diversification. (Unrelated products = Conglomerate; unrelated products for existing customers = Horizontal.)',
      concept: 'Diversification trio: Concentric = related tech/product + new customers; Horizontal = new/unrelated product + existing loyal customers; Conglomerate = completely unrelated industry + new customers.'
    },
    {
      id: 'nsc_bus_m4',
      subject: 'business_studies',
      topicId: 'bus_strat',
      difficulty: 'medium',
      question: 'Which creative-thinking problem-solving technique gathers opinions anonymously via sequential questionnaires from a panel of geographically dispersed experts without bringing them face-to-face?',
      options: [
        'Brainstorming',
        'Delphi technique',
        'Force-field analysis',
        'Empty-chair technique'
      ],
      correctIndex: 1,
      explanation: 'The Delphi technique uses structured, iterative rounds of anonymous questionnaires summarised by a coordinator so experts can refine solutions without groupthink or dominant personalities taking over.',
      concept: 'Problem-solving map: Delphi = anonymous expert questionnaires; Nominal Group = silent individual ideas then group voting/ranking; Force-Field = driving vs restraining forces for change.'
    },
    {
      id: 'nsc_bus_m5',
      subject: 'business_studies',
      topicId: 'bus_hr',
      difficulty: 'medium',
      question: 'In Tuckman\'s stages of team development, during which stage do team members clash over roles, challenge authority, and compete for status before agreeing on shared ground rules?',
      options: [
        'Forming',
        'Storming',
        'Norming',
        'Performing'
      ],
      correctIndex: 1,
      explanation: 'In Forming, members are polite and cautious; in Storming, true personalities surface and interpersonal conflict/power struggles emerge; in Norming, consensus rules form; in Performing, the team works cohesively at peak output.',
      concept: 'Storming is a normal, necessary phase—effective team leaders mediate openly rather than suppressing disagreements so the team can progress to Norming.'
    },
    {
      id: 'nsc_bus_m6',
      subject: 'business_studies',
      topicId: 'bus_hr',
      difficulty: 'medium',
      question: 'Distinguish an employee GRIEVANCE from workplace CONFLICT, and state the correct first step in the formal grievance procedure.',
      options: [
        'They are identical; the employee immediately goes on an unprotected strike',
        'Conflict is a clash of views/ideas between two or more people, whereas a grievance is a formal work-related complaint by an employee (e.g., unfair treatment/pay error); step 1 is reporting it verbally/informally to the immediate supervisor',
        'A grievance is reported directly to the Constitutional Court on Day 1',
        'Only shareholders can lodge a workplace grievance'
      ],
      correctIndex: 1,
      explanation: 'A grievance follows an internal ladder: (1) raise verbally with immediate supervisor -> (2) lodge formal written grievance to middle/senior HR management -> (3) internal hearing -> (4) refer unresolved dispute to CCMA/bargaining council.',
      concept: 'Know the escalation path of a grievance from immediate supervisor up to HR/senior management and finally CCMA conciliation/arbitration.'
    },
    {
      id: 'nsc_bus_m7',
      subject: 'business_studies',
      topicId: 'bus_inv',
      difficulty: 'medium',
      question: 'A warehouse has a true market value of R2 000 000, but the owner insured it for only R1 500 000. A fire causes R400 000 worth of structural damage. Apply the Average Clause to calculate how much the insurer will pay out.',
      options: [
        'R400 000',
        'R300 000',
        'R533 333',
        'R1 500 000'
      ],
      correctIndex: 1,
      explanation: 'Because the property is under-insured (1 500 000 < 2 000 000), the Average Clause applies: Payout = (Amount Insured / Market Value) * Damage = (1 500 000 / 2 000 000) * 400 000 = 0,75 * 400 000 = R300 000 (the owner bears the remaining R100 000 loss).',
      concept: 'Average Clause applies to UNDER-insurance; Reinstatement applies to OVER-insurance (where the insurer repairs/replaces rather than paying more than actual market value, preserving indemnity).'
    },
    {
      id: 'nsc_bus_m8',
      subject: 'business_studies',
      topicId: 'bus_inv',
      difficulty: 'medium',
      question: 'Which type of preference share entitles the holder to have unpaid dividends carried forward and paid out in full in future profitable years before ordinary shareholders receive any dividend?',
      options: [
        'Non-cumulative preference shares',
        'Cumulative preference shares',
        'Founders\' shares',
        'Bonus shares'
      ],
      correctIndex: 1,
      explanation: 'Cumulative preference shares accumulate any missed fixed dividends in a loss-making year as arrears that must be settled in subsequent profitable years ahead of ordinary dividends.',
      concept: 'Preference share types: Cumulative (missed dividends carry forward), Participating (share in surplus profits), Redeemable (bought back by company at fixed date), Convertible (convert into ordinary shares).'
    },
    {
      id: 'nsc_bus_m9',
      subject: 'business_studies',
      topicId: 'bus_eth',
      difficulty: 'medium',
      question: 'Classify the following two behaviours accurately: (1) Three rival bakeries secretly collude to fix the price of bread; (2) An accountant arrives late every morning and streams movies during office hours.',
      options: [
        '(1) Unprofessional behaviour; (2) Unethical behaviour',
        '(1) Unethical (and illegal) business practice; (2) Unprofessional business practice (abuse of work time)',
        'Both are legal marketing strategies',
        'Both are examples of Corporate Social Investment'
      ],
      correctIndex: 1,
      explanation: 'CAPS distinguishes Unethical practices (violating moral/legal standards: price fixing, tax evasion, unfair/false advertising) from Unprofessional practices (violating workplace conduct standards: abuse of work time, unauthorised use of business resources, sexual harassment).',
      concept: 'Keep CAPS lists separate: Unethical = unfair advertising, pricing goods in rural areas unfairly, tax evasion; Unprofessional = abuse of work time, unauthorised resource use, sexual harassment.'
    },
    {
      id: 'nsc_bus_m10',
      subject: 'business_studies',
      topicId: 'bus_eth',
      difficulty: 'medium',
      question: 'During a chemical spill emergency in a factory, the plant manager issues immediate, non-negotiable evacuation orders without consulting staff committees. Which leadership style is applied, and why is it appropriate here?',
      options: [
        'Laissez-faire — workers should vote over two weeks',
        'Autocratic leadership — appropriate in crises/emergencies where rapid, decisive action is essential to protect life and safety',
        'Democratic leadership — ideal when there is zero time available',
        'Charismatic leadership — relies purely on charm'
      ],
      correctIndex: 1,
      explanation: 'Situational leadership theory teaches that no single style suits every moment: Autocratic leadership is optimal in emergencies or with untrained staff needing clear direction, whereas Democratic/Laissez-faire suits experienced creative teams.',
      concept: 'Match leadership style to context: Autocratic (crisis/urgent safety), Democratic (complex planning needing buy-in), Laissez-faire (highly skilled autonomous experts), Transactional (target/incentive driven).'
    },
    {
      id: 'nsc_bus_d1',
      subject: 'business_studies',
      topicId: 'bus_leg',
      difficulty: 'difficult',
      question: 'A logistics company appoints its illiterate gardener as "51% Managing Director" on tender documents while paying him a gardener\'s wage and excluding him from all board decisions and dividends in order to win a state contract. Identify this offence and its statutory consequences under the BBBEE Act.',
      options: [
        'Legitimate Ownership & Management Control empowerment',
        'BBBEE Fronting — a criminal offence punishable by fines up to 10% of annual turnover, up to 10 years\' imprisonment for individuals, cancellation of state contracts, and blacklisting from government tenders',
        'Affirmative Action under the EEA',
        'Workplace Forum co-determination under the LRA'
      ],
      correctIndex: 1,
      explanation: 'Misrepresenting Black ownership or management control via window-dressing/tokenism without real economic benefit or decision-making power is BBBEE Fronting—criminalised under the BBBEE Amendment Act with severe turnover fines, prison terms, and tender bans.',
      concept: 'Five revised BBBEE scorecard pillars: Ownership, Management Control, Skills Development, Enterprise and Supplier Development (ESD), and Socio-Economic Development.'
    },
    {
      id: 'nsc_bus_d2',
      subject: 'business_studies',
      topicId: 'bus_leg',
      difficulty: 'difficult',
      question: 'Under the Skills Development Act (SDA) and Skills Development Levies Act, how is SETA workplace training funded and how can a South African employer claim part of its levy back?',
      options: [
        'Employees pay 5% of their wages to SARS',
        'Employers whose annual payroll exceeds R500 000 pay a 1% Skills Development Levy (SDL) to SARS; by appointing a Skills Development Facilitator and submitting an approved Workplace Skills Plan (WSP) and Annual Training Report (ATR), the employer claims mandatory/discretionary grants back from its SETA',
        'SETAs are funded via the Road Accident Fuel Levy',
        'Levies are voluntary donations to universities'
      ],
      correctIndex: 1,
      explanation: 'Employers above the R500 000 annual payroll threshold contribute 1% SDL monthly via SARS; submitting a WSP and ATR to the relevant SETA unlocks mandatory grant rebates and discretionary learnership grants.',
      concept: 'Connect SDA roles clearly: Employer pays 1% SDL -> SARS collects -> SETA develops sector skills plans, registers learnerships, and pays WSP/ATR grants -> QCTO/SAQA assure qualifications.'
    },
    {
      id: 'nsc_bus_d3',
      subject: 'business_studies',
      topicId: 'bus_strat',
      difficulty: 'difficult',
      question: 'Apply Porter\'s Five Forces to a new airline planning to launch domestic flights between Johannesburg and Cape Town: why is "Barriers to New Entrants" considered HIGH whereas "Buyer Power" of leisure travellers is ALSO relatively HIGH?',
      options: [
        'Launching an airline requires R100 and passengers cannot compare ticket prices',
        'New entrants face massive capital requirements (aircraft leasing, fuel hedging), strict CAA licensing, and airport slot scarcity (high entry barriers), YET passengers easily compare prices online across rival airlines/low-cost carriers with low switching costs (high buyer power)',
        'Train travel takes 1 hour between Johannesburg and Cape Town',
        'Porter\'s Five Forces applies only to micro-environment SWOT strengths'
      ],
      correctIndex: 1,
      explanation: 'Porter\'s Five Forces analyses Market-environment competitiveness independently across 5 dimensions: (1) Competitive rivalry, (2) Threat of new entrants (barriers), (3) Threat of substitutes, (4) Power of buyers, and (5) Power of suppliers.',
      concept: 'High barriers to entry protect incumbents from new rivals, whereas low customer switching costs and transparent online price comparison strengthen Buyer Power.'
    },
    {
      id: 'nsc_bus_d4',
      subject: 'business_studies',
      topicId: 'bus_strat',
      difficulty: 'difficult',
      question: 'In Total Quality Management (TQM), how does failing to maintain continuous skills development and adequate maintenance in the Production function create a domino effect on the Marketing and Financial functions?',
      options: [
        'It lowers costs permanently and doubles market share',
        'High defect/rework rates raise unit production costs and cause late deliveries -> tarnishes brand reputation, triggers CPA product recalls/returns, and shrinks market share (Marketing) -> erodes cash flow, raises warranty losses, and reduces profitability/ROI (Financial)',
        'Only the HR function is affected by TQM failures',
        'TQM eliminates the need for monitoring and evaluation (PDCA)'
      ],
      correctIndex: 1,
      explanation: 'All eight business functions are interdependent: poor quality in Production increases scrap/warranty costs and damages brand equity, hurting Marketing sales and Financial return on investment.',
      concept: 'PDCA continuous-improvement cycle in TQM: Plan -> Do -> Check/Analyse -> Act as necessary.'
    },
    {
      id: 'nsc_bus_d5',
      subject: 'business_studies',
      topicId: 'bus_hr',
      difficulty: 'difficult',
      question: 'Under the Labour Relations Act (LRA) and BCEA, which dismissal below would the CCMA rule AUTOMATICALLY UNFAIR?',
      options: [
        'Dismissing a cashier after a fair disciplinary hearing proved theft on CCTV',
        'Retrenching staff after full Section 189 consultation due to genuine insolvency',
        'Dismissing an employee because she disclosed her pregnancy or participated in a lawful, protected strike',
        'Placing a new employee on a reasonable probation period with coaching'
      ],
      correctIndex: 2,
      explanation: 'Section 187 of the LRA classifies dismissal for pregnancy, participating in a protected strike, or arbitrary discrimination (race, gender, religion, union membership) as automatically unfair. Substantive + procedural fairness is mandatory for misconduct, incapacity, and operational retrenchments.',
      concept: 'Three lawful grounds for dismissal (requiring BOTH substantive reason and fair procedure): Misconduct, Incapacity (poor performance/ill health), and Operational Requirements (retrenchment).'
    },
    {
      id: 'nsc_bus_d6',
      subject: 'business_studies',
      topicId: 'bus_hr',
      difficulty: 'difficult',
      question: 'Evaluate INTERNAL recruitment vs EXTERNAL recruitment when filling a Senior Operations Manager post.',
      options: [
        'Internal recruitment brings fresh outside ideas and never causes resentment among unsuccessful colleagues',
        'Internal recruitment boosts staff morale, is cheaper/faster, and selects a candidate who already knows the organisational culture, BUT it limits the talent pool, may stagnate innovation, and leaves another internal vacancy to fill',
        'External recruitment costs R0 and requires zero induction',
        'South African law prohibits external recruitment'
      ],
      correctIndex: 1,
      explanation: 'Balanced evaluation in CAPS Paper 1 requires weighing positives (morale, lower cost, known track record, faster induction) against negatives (narrower pool, "new ideas" deficit, peer jealousy, chain vacancy).',
      concept: 'Recruitment sequence: Job Analysis -> Choose Internal/External method -> Advertise -> Screen CVs & Shortlist -> Interview & Reference checks -> Employment Offer & Contract -> Induction -> Placement.'
    },
    {
      id: 'nsc_bus_d7',
      subject: 'business_studies',
      topicId: 'bus_inv',
      difficulty: 'difficult',
      question: 'An investor compares Option A (R50 000 fixed deposit at 11% p.a. simple interest for 3 years) with Option B (R50 000 fixed deposit at 10,5% p.a. compounded annually for 3 years). Calculate the INTEREST earned on each and identify the better return.',
      options: [
        'Option A interest = R16 500,00; Option B interest = R17 461,64 -> Option B earns R961,64 more despite the slightly lower nominal rate',
        'Option A interest = R16 500,00; Option B interest = R15 750,00 -> Option A is better',
        'Option A interest = R66 500,00; Option B interest = R67 461,64',
        'Both options earn exactly R16 500,00'
      ],
      correctIndex: 0,
      explanation: 'Option A simple interest: I = 50 000 * 0,11 * 3 = R16 500,00. Option B compound total: A = 50 000(1,105)^3 = 50 000 * 1,3492326 = R67 461,63 -> Interest = 67 461,63 - 50 000 = R17 461,63 (or ,64). Compounding interest-on-interest outweighs the 0,5% rate gap!',
      concept: 'CAPS Paper 2 investment calculation trap: subtract principal P at the end of A = P(1 + i)^n when the question asks for Compound INTEREST earned rather than final maturity value!'
    },
    {
      id: 'nsc_bus_d8',
      subject: 'business_studies',
      topicId: 'bus_inv',
      difficulty: 'difficult',
      question: 'Why must an insurance policy satisfy BOTH "Insurable Interest" AND "Utmost Good Faith (uberrima fides)" to be legally enforceable?',
      options: [
        'So anyone can insure a stranger\'s sports car and profit if it crashes',
        'Insurable interest proves the policyholder will suffer a direct financial loss if the insured risk occurs (preventing gambling/moral hazard), while utmost good faith requires honest disclosure of all material risk facts (e.g., medical history/security) so accurate premiums can be set',
        'So the insurer is forced to pay double the replacement value on every claim',
        'Because insurance is an investment instrument rather than risk transfer'
      ],
      correctIndex: 1,
      explanation: 'Four pillars of insurance contracts: Indemnification/Security, Insurable Interest (direct financial stake), Utmost Good Faith (honest disclosure of material facts—hiding facts voids claims!), and Proximate Cause.',
      concept: 'Distinguish Short-term property/casualty INSURANCE (principle of Indemnity—restores pre-loss position) from Long-term life ASSURANCE (principle of Security—covers certain events like death/retirement).'
    },
    {
      id: 'nsc_bus_d9',
      subject: 'business_studies',
      topicId: 'bus_eth',
      difficulty: 'difficult',
      question: 'Critically evaluate why a company\'s Corporate Social Investment (CSI) spending on a local township STEM tutoring centre benefits BOTH the community AND the business\'s long-term sustainability.',
      options: [
        'CSI funds are taken directly out of employees\' UIF deductions',
        'Community gains scarce Maths/Science skills and youth employability (reducing poverty), while the business earns BBBEE Socio-Economic Development points, SARS Section 18A tax deductions (on qualifying PBOs), stronger brand goodwill, and a skilled future talent pipeline',
        'CSI guarantees the company is exempt from the Consumer Protection Act',
        'CSI replaces the legal duty to pay company tax'
      ],
      correctIndex: 1,
      explanation: 'CSI is NOT meant solely to market products—its primary focus is community upliftment—yet well-aligned CSI creates shared value: community socio-economic upliftment + BBBEE SED scorecard points + stakeholder trust + future skilled workforce.',
      concept: 'Keep CSI focus areas clear in CAPS: Education, Job creation/SMME support, Rural development, Primary healthcare/HIV-AIDS programmes, and Environmental conservation.'
    },
    {
      id: 'nsc_bus_d10',
      subject: 'business_studies',
      topicId: 'bus_eth',
      difficulty: 'difficult',
      question: 'When presenting annual financial performance to a diverse stakeholder audience, what should a presenter do DURING and AFTER the presentation (handling feedback professionally)?',
      options: [
        'Read slides word-for-word facing the screen and argue personally with any shareholder who asks a tough question',
        'Maintain eye contact, pace voice clearly, use concise visual aids without clutter, listen attentively to questions without interrupting, address the question (not the person) calmly and factually, and admit honestly if a figure needs follow-up verification',
        'Refuse to take questions and distribute 80-page unformatted spreadsheets',
        'Use technical jargon exclusively so non-accountants cannot follow'
      ],
      correctIndex: 1,
      explanation: 'CAPS Paper 2 presentation skills divide strictly into BEFORE (prepare visual aids, rehearse, check venue), DURING (eye contact, audible tone, highlight key trends), and AFTER/FEEDBACK (listen respectfully, stay calm/non-defensive, answer concisely, thank questioner).',
      concept: 'Never mix BEFORE, DURING, and FEEDBACK points in CAPS Paper 2—markers award zero if you list preparation steps when asked how to handle post-presentation questions!'
    },

    // =========================================================================
    // 8. ECONOMICS (CAPS Paper 1 & 2) — 30 Questions
    // =========================================================================
    {
      id: 'nsc_econ_e1',
      subject: 'economics',
      topicId: 'econ_flow',
      difficulty: 'easy',
      question: 'In the four-sector circular flow model of an open economy, which group represents the three INJECTIONS (J) into the income stream?',
      options: [
        'Savings (S), Taxes (T), and Imports (M)',
        'Investment (I), Government Spending (G), and Exports (X)',
        'Consumption (C), Savings (S), and Imports (M)',
        'Wages, Rent, and Taxes'
      ],
      correctIndex: 1,
      explanation: 'Injections (J = I + G + X) add spending power into the domestic circular flow of income, whereas Leakages/Withdrawals (L = S + T + M) remove money from domestic circulation.',
      concept: 'Macroeconomic equilibrium in the 4-sector model occurs where Total Injections equal Total Leakages: I + G + X = S + T + M.'
    },
    {
      id: 'nsc_econ_e2',
      subject: 'economics',
      topicId: 'econ_flow',
      difficulty: 'easy',
      question: 'Which institution is legally responsible for conducting Monetary Policy (including setting the repurchase/repo rate) in South Africa?',
      options: [
        'National Treasury',
        'South African Reserve Bank (SARB)',
        'South African Revenue Service (SARS)',
        'Johannesburg Stock Exchange (JSE)'
      ],
      correctIndex: 1,
      explanation: 'The South African Reserve Bank\'s Monetary Policy Committee (MPC) sets the repo rate to protect the value of the Rand in the interest of balanced and sustainable economic growth, whereas National Treasury manages Fiscal Policy (taxation and government expenditure).',
      concept: 'Monetary policy = SARB (repo rate, open-market operations, cash reserve requirements, moral suasion); Fiscal policy = Minister of Finance / National Treasury (Budget: T and G).'
    },
    {
      id: 'nsc_econ_e3',
      subject: 'economics',
      topicId: 'econ_fx',
      difficulty: 'easy',
      question: 'South Africa operates a free-floating exchange rate system. If market forces move the exchange rate from R18,00 = $1,00 to R19,20 = $1,00, what has happened to the Rand?',
      options: [
        'The Rand appreciated against the US dollar',
        'The Rand depreciated against the US dollar',
        'The SARB revalued the Rand under a fixed gold standard',
        'South African imports from the USA became cheaper in Rand terms'
      ],
      correctIndex: 1,
      explanation: 'Needing MORE Rand (R19,20 instead of R18,00) to buy $1 means the Rand has lost external purchasing power through supply and demand—currency depreciation.',
      concept: 'Free-floating market movements = Appreciation / Depreciation; Fixed-regime central bank changes = Revaluation / Devaluation.'
    },
    {
      id: 'nsc_econ_e4',
      subject: 'economics',
      topicId: 'econ_fx',
      difficulty: 'easy',
      question: 'An ad valorem import tariff levied by customs authorities is calculated as:',
      options: [
        'A fixed Rand amount per physical kilogram or litre imported',
        'A percentage of the monetary value of the imported goods',
        'A complete physical ban (embargo) on foreign goods',
        'A cash export subsidy paid to local farmers'
      ],
      correctIndex: 1,
      explanation: 'Ad valorem ("according to value") tariffs charge a percentage of the customs value (e.g., 25% of vehicle invoice value), whereas specific tariffs charge a fixed amount per physical unit.',
      concept: 'Ad valorem tariffs automatically keep pace with price inflation, whereas specific tariffs lose real protective strength as world prices rise.'
    },
    {
      id: 'nsc_econ_e5',
      subject: 'economics',
      topicId: 'econ_mkt',
      difficulty: 'easy',
      question: 'What is the shape of the demand curve facing an INDIVIDUAL maize farmer in a Perfectly Competitive market, and why?',
      options: [
        'Downward-sloping from left to right because the farmer sets the national price',
        'Perfectly horizontal (perfectly elastic) at the market equilibrium price, because the individual firm is a price taker producing a homogeneous product',
        'Kinked at the prevailing price',
        'Vertical (perfectly inelastic)'
      ],
      correctIndex: 1,
      explanation: 'The INDUSTRY demand curve slopes downward, but each tiny individual firm in perfect competition is a price taker—charging 1 cent above market price loses all buyers, so its individual demand curve is horizontal where P = AR = MR.',
      concept: 'Perfect competition distinction: Industry demand curve = downward sloping; Individual firm\'s demand curve = horizontal (P = AR = MR).'
    },
    {
      id: 'nsc_econ_e6',
      subject: 'economics',
      topicId: 'econ_mkt',
      difficulty: 'easy',
      question: 'At which output level does ANY profit-maximising firm (whether in perfect competition, monopoly, monopolistic competition, or oligopoly) maximise profit?',
      options: [
        'Where Total Revenue (TR) is zero',
        'Where Marginal Revenue equals Marginal Cost (MR = MC, with MC rising)',
        'Where Average Fixed Cost (AFC) is at a maximum',
        'Where Marginal Cost is zero'
      ],
      correctIndex: 1,
      explanation: 'As long as MR > MC, producing one more unit adds more to revenue than to cost; once MC > MR, extra units reduce profit. Therefore profit is maximised where MR = MC (on the rising arm of MC).',
      concept: 'Profit-maximisation condition MR = MC applies across ALL four market structures.'
    },
    {
      id: 'nsc_econ_e7',
      subject: 'economics',
      topicId: 'econ_grow',
      difficulty: 'easy',
      question: 'Distinguish Economic Growth from Economic Development in CAPS Economics.',
      options: [
        'They mean the exact same thing',
        'Economic growth is an increase in the real production capacity/output of goods and services (real GDP), whereas economic development is an improvement in the standard of living and well-being of people (measured by HDI: life expectancy, education, per capita GNI)',
        'Economic growth measures literacy whereas economic development measures gold exports only',
        'Economic development occurs without any production of goods'
      ],
      correctIndex: 1,
      explanation: 'Growth focuses on real GDP output ("size of the pie"); Development focuses on human welfare, poverty reduction, healthcare, education, and living standards (Human Development Index).',
      concept: 'Economic growth is a necessary foundation for sustainable funding of economic development, though unequal growth can occur without broad development.'
    },
    {
      id: 'nsc_econ_e8',
      subject: 'economics',
      topicId: 'econ_grow',
      difficulty: 'easy',
      question: 'What does a Gini coefficient close to 1 (or 100 on the Gini index) indicate about a country\'s income distribution?',
      options: [
        'Perfectly equal income distribution across all households',
        'Extreme income inequality (the Lorenz curve bows far away from the 45-degree line of equality)',
        'Zero unemployment',
        'Zero inflation'
      ],
      correctIndex: 1,
      explanation: 'A Gini coefficient ranges from 0 (perfect equality, on the 45-degree line) to 1 (complete inequality, one household receives all income). South Africa\'s high Gini (~0,63+) reflects deep structural income inequality.',
      concept: 'Gini = Area A (between 45-degree line and Lorenz curve) / Total Area (A + B) under the 45-degree line.'
    },
    {
      id: 'nsc_econ_e9',
      subject: 'economics',
      topicId: 'econ_infl',
      difficulty: 'easy',
      question: 'What is the official Consumer Price Index (CPI) inflation target band used by the South African Reserve Bank (SARB)?',
      options: [
        '0% to 2%',
        '3% to 6%',
        '8% to 12%',
        '10% to 15%'
      ],
      correctIndex: 1,
      explanation: 'South Africa\'s inflation-targeting framework sets a 3%–6% annual headline CPI band (with the MPC anchoring expectations near the 4,5% midpoint).',
      concept: 'When demand-driven CPI threatens to breach 6%, the SARB MPC typically raises the repo rate (contractionary monetary policy) to cool credit extension and aggregate demand.'
    },
    {
      id: 'nsc_econ_e10',
      subject: 'economics',
      topicId: 'econ_infl',
      difficulty: 'easy',
      question: 'How is an inbound German holidaymaker flying from Frankfurt to tour Kruger National Park and Cape Town classified in South African tourism accounts?',
      options: [
        'Outbound tourist (import leakages)',
        'Inbound international tourist (recorded as a service export earning foreign exchange for South Africa)',
        'Transit commuter',
        'Domestic tourist'
      ],
      correctIndex: 1,
      explanation: 'Foreign visitors spending money inside South Africa bring foreign currency inflows into the country—acting economically just like an invisible/service export on the Current Account.',
      concept: 'Inbound foreign tourists = Service Exports (forex inflow); Outbound SA residents travelling abroad = Service Imports (forex outflow).'
    },
    {
      id: 'nsc_econ_m1',
      subject: 'economics',
      topicId: 'econ_flow',
      difficulty: 'medium',
      question: 'In a two-sector closed economy, households have a Marginal Propensity to Consume (MPC) of 0,75. Calculate the Keynesian multiplier (k) and the total increase in national income (delta Y) from a R25 billion autonomous investment injection.',
      options: [
        'k = 1,33; delta Y = R33,25 billion',
        'k = 4,0; delta Y = R100 billion',
        'k = 0,25; delta Y = R6,25 billion',
        'k = 3,0; delta Y = R75 billion'
      ],
      correctIndex: 1,
      explanation: 'Multiplier k = 1 / (1 - MPC) = 1 / (1 - 0,75) = 1 / 0,25 = 4,0. Change in national income delta Y = k * delta J = 4,0 * R25 billion = R100 billion.',
      concept: 'Since MPC + MPS = 1, a higher MPC (smaller leakage MPS) creates a LARGER multiplier effect across successive spending rounds.'
    },
    {
      id: 'nsc_econ_m2',
      subject: 'economics',
      topicId: 'econ_flow',
      difficulty: 'medium',
      question: 'Calculate Gross Domestic Product (GDP) at Market Prices from the following SARB national accounts data:\n- Gross Value Added (GVA) at Basic Prices: R4 200 billion\n- Taxes on products (VAT, excise, customs): R520 billion\n- Subsidies on products: R70 billion',
      options: [
        'R3 750 billion',
        'R4 650 billion',
        'R4 790 billion',
        'R4 200 billion'
      ],
      correctIndex: 1,
      explanation: 'GDP at Market Prices = GVA at Basic Prices + Taxes on products - Subsidies on products = 4 200 + 520 - 70 = R4 650 billion.',
      concept: 'National accounts ladder: Factor Cost + Other taxes on production - Other subsidies on production = Basic Prices; Basic Prices + Taxes on products - Subsidies on products = Market Prices.'
    },
    {
      id: 'nsc_econ_m3',
      subject: 'economics',
      topicId: 'econ_fx',
      difficulty: 'medium',
      question: 'South Africa\'s Index of Export Prices rose from 100 to 132 while its Index of Import Prices rose from 100 to 120. Calculate the Terms of Trade and interpret the result.',
      options: [
        '90,9 — Terms of trade deteriorated',
        '110,0 — Terms of trade improved (a given volume of SA exports now buys a larger volume of imports)',
        '12,0 — Trade deficit widened',
        '152,0 — Rand devalued'
      ],
      correctIndex: 1,
      explanation: 'Terms of Trade = (Index of Export Prices / Index of Import Prices) * 100 = (132 / 120) * 100 = 110,0. Rising from 100 to 110 means export prices grew faster than import prices, improving South Africa\'s economic welfare per unit traded.',
      concept: 'Do not confuse Terms of Trade (ratio of export vs import PRICE indices) with the Balance of Trade (monetary value of merchandise exports minus imports).'
    },
    {
      id: 'nsc_econ_m4',
      subject: 'economics',
      topicId: 'econ_fx',
      difficulty: 'medium',
      question: 'On which sub-account of South Africa\'s Balance of Payments are dividends and interest paid to foreign investors who own JSE shares/bonds recorded?',
      options: [
        'Capital Transfer Account',
        'Primary Income payments on the Current Account',
        'Merchandise Exports on the Current Account',
        'Official Reserve Assets'
      ],
      correctIndex: 1,
      explanation: 'Buying/selling the shares themselves is a Portfolio Investment flow on the Financial Account, whereas the subsequent dividend and interest returns on factors of production are recorded as Primary Income receipts/payments on the Current Account!',
      concept: 'BoP trap: Capital purchase of shares/factories = Financial Account (Portfolio/Direct investment); Dividend/interest/wage returns earned on them = Current Account (Primary income).'
    },
    {
      id: 'nsc_econ_m5',
      subject: 'economics',
      topicId: 'econ_mkt',
      difficulty: 'medium',
      question: 'Why does an oligopolist face a KINKED demand curve (elastic above the prevailing price P_0, inelastic below P_0), creating price rigidity?',
      options: [
        'Because there are thousands of small firms with zero market power',
        'If one firm raises its price above P_0, rivals do NOT follow so it loses many customers (elastic); if it cuts price below P_0, rivals immediately match the cut to protect market share so it gains very few sales (inelastic)',
        'Because the government fixes all oligopoly prices by law',
        'Because marginal cost is always negative'
      ],
      correctIndex: 1,
      explanation: 'Mutual interdependence means price hikes go unmatched (elastic upper segment) and price cuts trigger destructive price wars (inelastic lower segment), so oligopolists keep prices rigid and compete via non-price strategies (branding, loyalty rewards, extended hours, after-sales service).',
      concept: 'Oligopoly hallmark: mutual interdependence -> kinked demand curve -> sticky prices -> intense NON-PRICE competition (advertising, packaging, loyalty programmes).'
    },
    {
      id: 'nsc_econ_m6',
      subject: 'economics',
      topicId: 'econ_mkt',
      difficulty: 'medium',
      question: 'A firm produces 500 units and sells them at R40 each. At 500 units, its Average Variable Cost (AVC) is R26 and its Average Total Cost (ATC) is R32. Calculate the firm\'s short-run economic profit or loss.',
      options: [
        'R7 000 economic profit',
        'R4 000 economic (supernormal) profit',
        'R4 000 economic loss',
        'R0 normal profit'
      ],
      correctIndex: 1,
      explanation: 'Total Revenue TR = 500 * R40 = R20 000; Total Cost TC = 500 * R32 = R16 000. Economic profit = TR - TC = R20 000 - R16 000 = R4 000 (equivalently, (AR - ATC) * Q = (40 - 32) * 500 = R4 000).',
      concept: 'Short-run profit check: AR > ATC -> Economic (supernormal) profit; AR = ATC -> Normal profit (economic profit = 0); AVC <= AR < ATC -> Economic loss (keep operating in short run); AR < AVC -> Shut down!'
    },
    {
      id: 'nsc_econ_m7',
      subject: 'economics',
      topicId: 'econ_grow',
      difficulty: 'medium',
      question: 'How do South Africa\'s Special Economic Zones (SEZs) — such as Coega, Dube TradePort, East London, and Richards Bay — differ from older Industrial Development Zones (IDZs)?',
      options: [
        'SEZs are banned from exporting manufactured goods',
        'While IDZs were strictly restricted to international airports or seaports for export manufacturing, SEZs broaden geographic placement (including inland mineral/agro-processing hubs) and offer targeted incentives like a reduced 15% corporate tax rate, customs-controlled areas, and employment tax incentives',
        'SEZs charge a 45% penalty tax on factories',
        'IDZs were agricultural communes with no factories'
      ],
      correctIndex: 1,
      explanation: 'The SEZ Act expanded the narrower port/airport-only IDZ model to support regional decentralisation, mineral beneficiation, and industrial clusters across all provinces, backed by tax/customs incentives.',
      concept: 'Distinguish Spatial Development Initiatives (SDIs = transport/investment corridors linking nodes, e.g., Maputo Corridor) from IDZs/SEZs (ring-fenced industrial estates with tax/customs incentives).'
    },
    {
      id: 'nsc_econ_m8',
      subject: 'economics',
      topicId: 'econ_grow',
      difficulty: 'medium',
      question: 'Which economic indicator measures average output per resident after adjusting for both inflation AND population growth, and why must it still be supplemented with the Gini coefficient?',
      options: [
        'Nominal GDP at current prices',
        'Real GDP per capita — it adjusts for price rises and population size, but as an average it hides how unevenly that income is distributed between rich and poor',
        'Producer Price Index (PPI)',
        'Repo rate'
      ],
      correctIndex: 1,
      explanation: 'Real GDP per capita divides constant-price GDP by total population to gauge average living standards, but an average cannot reveal whether wealth is concentrated in the top 10%—requiring the Lorenz curve / Gini coefficient.',
      concept: 'Limitations of Real GDP per capita as a welfare measure: ignores income inequality, informal/unpaid work, leisure time, and environmental pollution externalities.'
    },
    {
      id: 'nsc_econ_m9',
      subject: 'economics',
      topicId: 'econ_infl',
      difficulty: 'medium',
      question: 'Sharp increases in Eskom electricity tariffs, imported Brent crude oil prices, and wage settlements above labour productivity trigger rising prices alongside falling output. Identify this type of inflation and macroeconomic condition.',
      options: [
        'Demand-pull inflation during an economic boom',
        'Cost-push inflation leading to stagflation (simultaneous high inflation and stagnant output / rising unemployment)',
        'Hyper-deflation',
        'Pure monetary expansion'
      ],
      correctIndex: 1,
      explanation: 'Rising input costs shift Aggregate Supply (AS) leftward, pushing the general price level UP while real GDP falls and unemployment rises—stagflation.',
      concept: 'Demand-pull = "too much money chasing too few goods" (AD shifts right); Cost-push = rising production costs (wages, energy, oil, weaker Rand) shifting AS left -> stagflation.'
    },
    {
      id: 'nsc_econ_m10',
      subject: 'economics',
      topicId: 'econ_infl',
      difficulty: 'medium',
      question: 'Why does pollution from a coal-fired factory represent a NEGATIVE EXTERNALITY (market failure) in an unregulated free market?',
      options: [
        'Because the factory pays more than the full social cost',
        'Because third parties/communities suffer health and environmental costs not reflected in the firm\'s Private Cost, so Marginal Social Cost exceeds Marginal Private Cost (MSC > MPC) and the market overproduces the polluting good at too low a price',
        'Because coal is a non-excludable public good like street lighting',
        'Because Marginal Social Benefit exceeds Marginal Private Benefit'
      ],
      correctIndex: 1,
      explanation: 'When external spill-over costs are ignored by producers, MSC > MPC, causing market equilibrium quantity Q_m to exceed the socially optimal quantity Q_s (allocative inefficiency). Levying a Pigouvian carbon/environmental tax internalises the externality.',
      concept: 'Negative externality (pollution, alcohol/tobacco): MSC > MPC -> overproduction -> tax to shift supply left; Positive externality (education, vaccines): MSB > MPB -> underconsumption -> subsidise!'
    },
    {
      id: 'nsc_econ_d1',
      subject: 'economics',
      topicId: 'econ_flow',
      difficulty: 'difficult',
      question: 'Explain what the LAFFER CURVE demonstrates to South Africa\'s Minister of Finance when setting marginal tax rates in the National Budget.',
      options: [
        'Raising the tax rate to 100% maximises government tax revenue',
        'Tax revenue initially rises with higher tax rates up to an optimal peak rate t*, beyond which excessive tax rates discourage work, saving, and investment and encourage tax avoidance/evasion/emigration, causing total tax revenue collected to FALL',
        'Inflation and unemployment are inversely related in the short run',
        'Income inequality rises before falling during industrialisation'
      ],
      correctIndex: 1,
      explanation: 'At 0% tax, revenue is R0; at 100% tax, nobody works legally so revenue is also R0. Beyond the peak rate t* on the Laffer Curve, disincentive effects shrink the tax base faster than the rate increase, lowering SARS collections.',
      concept: 'Curve trio in CAPS Paper 1 & 2: Laffer Curve (Tax revenue vs Tax rate), Phillips Curve (Inflation vs Unemployment), Lorenz Curve (Cumulative % income vs Cumulative % population).'
    },
    {
      id: 'nsc_econ_d2',
      subject: 'economics',
      topicId: 'econ_flow',
      difficulty: 'difficult',
      question: 'Why is South Africa\'s Gross National Product / Gross National Income (GNP / GNI) consistently slightly LOWER than its Gross Domestic Product (GDP)?',
      options: [
        'Because South Africa exports zero minerals',
        'Because primary factor income (dividends, interest, profits) paid OUT to foreign investors operating/investing inside South Africa exceeds primary factor income earned BY South African residents from abroad (negative net primary income)',
        'Because VAT is subtracted from GNP',
        'Because depreciation is added twice to GDP'
      ],
      correctIndex: 1,
      explanation: 'GNI = GDP + Primary income receipts from rest of world - Primary income payments to rest of world. Because foreign ownership of SA bonds, JSE equities, and multinationals generates larger outflows than SA inflows from abroad, GNI < GDP.',
      concept: 'GDP = location/borders concept ("within SA borders regardless of nationality"); GNP/GNI = ownership/residency concept ("earned by SA permanent residents anywhere").'
    },
    {
      id: 'nsc_econ_d3',
      subject: 'economics',
      topicId: 'econ_fx',
      difficulty: 'difficult',
      question: 'Under the Marshall-Lerner condition and J-Curve effect, why can a sharp depreciation of the Rand initially WORSEN South Africa\'s trade balance in the short run before improving it in the medium term?',
      options: [
        'Exporters immediately cancel all contracts when the Rand weakens',
        'In the immediate short run, import and export volumes are inelastic (bound by existing contracts—e.g., essential crude oil/machinery imports immediately cost more in Rand), deepening the deficit; over time, demand responds elastically as cheaper Rand exports grow and costly imports are substituted, provided |PED_x| + |PED_m| > 1',
        'Depreciation makes foreign imports cheaper in Rand immediately',
        'The SARB fixes export volumes by decree'
      ],
      correctIndex: 1,
      explanation: 'Price effects hit immediately (higher Rand import bill -> initial dip of the "J"), whereas quantity adjustments take months until combined export + import price elasticities exceed 1 (Marshall-Lerner condition), lifting the trade balance.',
      concept: 'Depreciation helps exporters and domestic import-competing industries in the medium term, but fuels imported cost-push inflation (fuel, fertiliser, capital machinery).'
    },
    {
      id: 'nsc_econ_d4',
      subject: 'economics',
      topicId: 'econ_mkt',
      difficulty: 'difficult',
      question: 'Suppose every firm in a Perfectly Competitive industry is currently earning economic (supernormal) profit in the short run. Trace the exact mechanism that restores NORMAL profit in the long run.',
      options: [
        'Incumbent firms form a legal cartel to block new entrants permanently',
        'Supernormal profits attract new firms (zero barriers to entry) -> industry supply shifts RIGHT -> market equilibrium price P falls -> each firm\'s horizontal demand curve (P = AR = MR) shifts DOWN until P = minimum Long-Run Average Cost (normal profit only)',
        'Industry demand shifts left to zero',
        'Government imposes a maximum price above equilibrium'
      ],
      correctIndex: 1,
      explanation: 'Freedom of entry and exit is the self-correcting engine of long-run perfect competition: short-run economic profits attract entry -> market supply increases -> price falls until AR = AC (normal profit); short-run losses trigger exit -> supply decreases -> price rises back to AR = AC.',
      concept: 'In long-run equilibrium under Perfect Competition, a firm achieves BOTH productive efficiency (produces at minimum AC) AND allocative efficiency (P = MC), earning normal profit.'
    },
    {
      id: 'nsc_econ_d5',
      subject: 'economics',
      topicId: 'econ_mkt',
      difficulty: 'difficult',
      question: 'In a Cost-Benefit Analysis (CBA) conducted by a municipality before building a Bus Rapid Transit (BRT) corridor, Total Present Value of Social Benefits is R4,8 billion and Total Present Value of Social Costs is R3,2 billion. Calculate the Cost-Benefit Ratio (CBR) and state the decision rule.',
      options: [
        'CBR = 0,67 < 1 -> Reject the project',
        'CBR = 1,50 > 1 -> Proceed with the public project because discounted social benefits (including time saved, lower congestion/emissions) exceed discounted social costs',
        'CBR = R1,6 billion -> Reject unless private fare revenue alone exceeds R4,8 billion',
        'CBA ignores all external social benefits and externalities'
      ],
      correctIndex: 1,
      explanation: 'CBR = Present Value of Social Benefits / Present Value of Social Costs = 4,8 / 3,2 = 1,50. Whenever CBR > 1 (Net Present Social Value > 0), society\'s welfare improves so the public project is economically justified.',
      concept: 'Public-sector CBA differs from private investment appraisal by pricing EXTERNAL social benefits (time saved, safety, clean air) and social costs alongside financial cash flows.'
    },
    {
      id: 'nsc_econ_d6',
      subject: 'economics',
      topicId: 'econ_mkt',
      difficulty: 'difficult',
      question: 'What happens in a market when the government sets a binding MINIMUM PRICE (price floor, such as an agricultural support floor or minimum wage) ABOVE the free-market equilibrium price?',
      options: [
        'Quantity demanded exceeds quantity supplied, creating queues and black markets',
        'Quantity supplied exceeds quantity demanded, creating a persistent MARKET SURPLUS (excess supply)',
        'No effect on market price or quantity',
        'Both producers and consumers buy infinite quantities'
      ],
      correctIndex: 1,
      explanation: 'A binding minimum price (floor) sits ABOVE equilibrium (raising quantity supplied while reducing quantity demanded -> Surplus). Conversely, a binding maximum price (ceiling, e.g., rent/paraffin cap) sits BELOW equilibrium (-> Shortage / black markets).',
      concept: 'Visual memory trick: Floor sits HIGH (above equilibrium -> surplus); Ceiling sits LOW (below equilibrium -> shortage).'
    },
    {
      id: 'nsc_econ_d7',
      subject: 'economics',
      topicId: 'econ_grow',
      difficulty: 'difficult',
      question: 'Contrast DEMAND-SIDE macroeconomic policies with SUPPLY-SIDE policies for accelerating South Africa\'s economic growth.',
      options: [
        'Demand-side builds ports and trains engineers; supply-side raises VAT',
        'Demand-side uses fiscal/monetary stimulus (lower repo rate, higher G, tax cuts) to boost Aggregate Demand C + I + G + (X - M); Supply-side removes production bottlenecks (reliable energy/logistics, STEM skills training, competition reform, R&D incentives) to lower unit costs and shift Aggregate Supply right without stoking inflation',
        'Supply-side policies always increase inflation while shrinking potential GDP',
        'South Africa uses only demand-side policies'
      ],
      correctIndex: 1,
      explanation: 'In an economy constrained by structural bottlenecks (electricity, rail/ports, skills mismatches), pure demand stimulus risks hitting capacity limits and causing inflation/imports unless paired with supply-side reforms expanding potential GDP.',
      concept: 'South African growth frameworks: RDP (1994 basic needs), GEAR (1996 fiscal discipline/export growth), AsgiSA (binding constraints), NGP (decent jobs), and NDP 2030 (poverty/inequality elimination).'
    },
    {
      id: 'nsc_econ_d8',
      subject: 'economics',
      topicId: 'econ_grow',
      difficulty: 'difficult',
      question: 'Why does South Africa promote MINERAL BENEFICIATION (processing raw platinum, iron ore, manganese, and chrome locally into catalytic converters, steel, and battery chemicals) rather than exporting unrefined ore?',
      options: [
        'Unrefined ore always earns a higher unit price than finished manufactured goods',
        'Beneficiation captures higher value-added manufacturing margins locally, creates skilled domestic industrial jobs, diversifies exports away from volatile raw commodity price swings, and improves the Terms of Trade and Balance of Payments',
        'Beneficiation eliminates the need for electricity or skilled engineers',
        'WTO rules ban all exports of raw minerals'
      ],
      correctIndex: 1,
      explanation: 'Exporting raw primary ore and re-importing expensive finished goods locks developing countries into deteriorating terms of trade and low employment multipliers; local beneficiation builds downstream industrial value chains.',
      concept: 'Link beneficiation directly to South Africa\'s National Industrial Policy Framework (NIPF), IPAP, and SEZ mineral-processing clusters.'
    },
    {
      id: 'nsc_econ_d9',
      subject: 'economics',
      topicId: 'econ_infl',
      difficulty: 'difficult',
      question: 'Why is raising the SARB repo rate a blunt instrument when inflation in South Africa is driven primarily by COST-PUSH shocks (e.g., global oil spikes and municipal utility tariff hikes) rather than excess consumer credit demand?',
      options: [
        'Higher interest rates directly lower global Brent crude oil prices',
        'Repo rate hikes curb domestic borrowing and Aggregate Demand (helping anchor inflation expectations and support the Rand), but they do NOT directly fix supply-side energy/oil costs and can further depress investment, GDP growth, and employment',
        'Lowering the repo rate cures cost-push inflation immediately',
        'The SARB is prohibited from changing the repo rate during oil shocks'
      ],
      correctIndex: 1,
      explanation: 'Monetary policy works via the credit/demand transmission mechanism and exchange-rate expectations; while keeping expectations anchored is vital, curing underlying cost-push inflation requires productivity gains, competition policy, and energy/logistics reform.',
      concept: 'Evaluative Paper 2 distinction marks come from showing BOTH why SARB acts (anchoring inflation expectations & supporting the Rand) AND the output/employment trade-off under supply shocks.'
    },
    {
      id: 'nsc_econ_d10',
      subject: 'economics',
      topicId: 'econ_infl',
      difficulty: 'difficult',
      question: 'How does a Marketable (Tradable) Pollution Permit ("cap-and-trade") system reduce industrial carbon emissions more cost-effectively than uniform rigid quotas?',
      options: [
        'It allows factories to emit unlimited greenhouse gases free of charge',
        'Government sets a strict declining cap on total emissions and issues permits; firms that can innovate to cut emissions cheaply sell their surplus permits to firms facing high abatement costs, achieving the exact environmental cap at the lowest total economic cost while rewarding green innovation',
        'Only households buy pollution permits',
        'It abolishes property rights over clean air'
      ],
      correctIndex: 1,
      explanation: 'Cap-and-trade combines environmental certainty (the hard total cap) with market efficiency (price signal rewards low-cost abaters and clean tech R&D).',
      concept: 'International environmental milestones in CAPS: Stockholm (1972), Rio Earth Summit (1992 Agenda 21), Kyoto Protocol (1997), Johannesburg WSSD (2002), COP17 Durban (2011), Paris Agreement (2015).'
    },

    // =========================================================================
    // 9. GEOGRAPHY (CAPS Paper 1 & 2) — 30 Questions
    // =========================================================================
    {
      id: 'nsc_geo_e1',
      subject: 'geography',
      topicId: 'geo_clim',
      difficulty: 'easy',
      question: 'In the Southern Hemisphere (including South Africa), in which direction does air circulate around the centre of a Low-Pressure cell (cyclone) vs a High-Pressure cell (anticyclone)?',
      options: [
        'Low Pressure: anticlockwise; High Pressure: clockwise',
        'Low Pressure: clockwise inward and rising; High Pressure: anticlockwise outward and subsiding',
        'Both circulate clockwise',
        'Air moves straight across isobars without Coriolis deflection'
      ],
      correctIndex: 1,
      explanation: 'Leftward Coriolis deflection in the Southern Hemisphere causes air converging into a Low Pressure to spiral CLOCKWISE (rising -> cooling -> condensation/rain) and air diverging from a High Pressure to spiral ANTICLOCKWISE (subsiding -> warming -> clear dry skies).',
      concept: 'Southern Hemisphere synoptic rule: Low = Clockwise + Rising (rain/cloud); High = Anticlockwise + Subsiding (dry/stable).'
    },
    {
      id: 'nsc_geo_e2',
      subject: 'geography',
      topicId: 'geo_clim',
      difficulty: 'easy',
      question: 'In a Southern Hemisphere valley (such as the Hex River Valley in the Western Cape), which valley slope receives more direct solar insolation at midday and is therefore warmer and preferred for sun-loving crops/settlements?',
      options: [
        'South-facing slope',
        'North-facing slope',
        'Valley floor frost pocket',
        'Shadow zone'
      ],
      correctIndex: 1,
      explanation: 'Because South Africa lies south of the Tropic of Capricorn (mostly), the midday sun stands to the NORTH; therefore NORTH-facing slopes receive direct rays while south-facing slopes lie in the cooler, moister shadow zone.',
      concept: 'Southern Hemisphere aspect rule: North-facing slope = warmer, drier, sunnier; South-facing slope = cooler, higher soil moisture, denser forest/plantation.'
    },
    {
      id: 'nsc_geo_e3',
      subject: 'geography',
      topicId: 'geo_geom',
      difficulty: 'easy',
      question: 'What term describes the high-lying ridge of land separating two adjacent drainage basins?',
      options: [
        'Confluence',
        'Watershed (interfluve separates tributaries within one basin)',
        'Floodplain',
        'Delta'
      ],
      correctIndex: 1,
      explanation: 'A watershed is the elevated boundary dividing one entire river drainage basin from a neighbouring drainage basin (whereas an interfluve separates two individual tributary streams inside the SAME basin).',
      concept: 'Drainage basin vocabulary: Catchment area (whole area drained), Watershed (high ground between basins), Interfluve (spur between tributaries), Confluence (where two streams join).'
    },
    {
      id: 'nsc_geo_e4',
      subject: 'geography',
      topicId: 'geo_geom',
      difficulty: 'easy',
      question: 'On a river meander, where do erosion (forming a steep undercut bluff/cliff) and deposition (forming a gentle slip-off slope) occur?',
      options: [
        'Erosion on the inner bank; deposition on the outer bank',
        'Erosion on the outer concave bank (fastest water flow / thalweg); deposition on the inner convex bank (slowest water flow)',
        'Deposition occurs equally on both banks',
        'Meanders occur only in steep mountain torrents'
      ],
      correctIndex: 1,
      explanation: 'Centrifugal swing throws the line of maximum velocity (thalweg) against the OUTER bank, undercutting it into a steep river cliff, while slower corkscrew (helicoidal) flow deposits point-bar sediment on the shallow INNER slip-off slope.',
      concept: 'Cross-section of a meander bend is ASYMMETRICAL: deep steep undercut slope on the outside, shallow gentle slip-off slope on the inside.'
    },
    {
      id: 'nsc_geo_e5',
      subject: 'geography',
      topicId: 'geo_sett',
      difficulty: 'easy',
      question: 'Distinguish the SITE of a settlement from its SITUATION.',
      options: [
        'Site is the population count; situation is the mayor\'s office',
        'Site is the exact physical piece of land occupied by the settlement (water supply, relief, soil, fuel); Situation is the settlement\'s broader location relative to surrounding features, transport routes, and markets',
        'Site applies only to cities; situation applies only to farms',
        'Situation refers only to soil pH'
      ],
      correctIndex: 1,
      explanation: 'Site = exact local ground characteristics (e.g., defensive hill, spring water = wet-point site, flood-free terrace = dry-point site); Situation = regional connectivity (distance to N1 highway, port, railway, neighbouring towns).',
      concept: 'Wet-point settlements cluster near scarce water in arid areas (Karoo); Dry-point settlements perch on raised ground above marshy floodplains.'
    },
    {
      id: 'nsc_geo_e6',
      subject: 'geography',
      topicId: 'geo_sett',
      difficulty: 'easy',
      question: 'Which urban land-use zone typically has the highest land values, tallest skyscrapers, highest daytime pedestrian/traffic density, and maximum accessibility?',
      options: [
        'Rural-urban fringe',
        'Central Business District (CBD)',
        'Heavy industrial zone',
        'Greenbelt'
      ],
      correctIndex: 1,
      explanation: 'Convergence of transport routes makes the CBD the point of maximum accessibility; intense competition for limited plots drives bid-rent land prices sky-high, forcing vertical skyscraper intensification.',
      concept: 'Bid-rent curve: land value peaks in the CBD and declines outward toward the rural-urban fringe (with secondary peaks at outlying suburban shopping/office nodes like Sandton or Umhlanga).'
    },
    {
      id: 'nsc_geo_e7',
      subject: 'geography',
      topicId: 'geo_econ',
      difficulty: 'easy',
      question: 'Into which economic sector is commercial maize farming and platinum mining classified, vs motor-vehicle assembly in Gqeberha/East London?',
      options: [
        'Both are Tertiary activities',
        'Farming & mining = Primary sector (extraction of raw materials); Vehicle assembly = Secondary sector (manufacturing/processing)',
        'Farming = Quaternary; Vehicle assembly = Primary',
        'Mining = Secondary; Vehicle assembly = Quaternary'
      ],
      correctIndex: 1,
      explanation: 'Economic sectors: Primary (farming, forestry, fishing, mining), Secondary (manufacturing, construction, electricity/water), Tertiary (services, retail, transport, finance), Quaternary (IT, R&D, data analytics).',
      concept: 'Moving an economy from Primary extraction up into Secondary manufacturing and Quaternary knowledge services increases GDP value-added and wage levels.'
    },
    {
      id: 'nsc_geo_e8',
      subject: 'geography',
      topicId: 'geo_econ',
      difficulty: 'easy',
      question: 'Which core industrial region generates the largest share of South Africa\'s manufacturing output and GDP?',
      options: [
        'Port Elizabeth-Uitenhage (Nelson Mandela Bay)',
        'PWV / Gauteng (Pretoria-Witwatersrand-Vereeniging)',
        'Southwestern Cape',
        'East London'
      ],
      correctIndex: 1,
      explanation: 'The PWV/Gauteng heartland grew around Witwatersrand gold discovery, abundant Mpumalanga coal/power, dense rail/road/air links (OR Tambo), skilled labour, and South Africa\'s largest consumer market (main physical constraint: water scarcity, solved via Lesotho Highlands & Tugela-Vaal water transfer schemes!).',
      concept: 'PWV\'s #1 physical limiting factor in CAPS Geography is inland WATER scarcity, mitigated by inter-basin water transfer schemes (LHWP & Tugela-Vaal).'
    },
    {
      id: 'nsc_geo_e9',
      subject: 'geography',
      topicId: 'geo_map',
      difficulty: 'easy',
      question: 'What is the standard contour interval on an official South African 1 : 50 000 topographic map?',
      options: [
        '5 metres',
        '20 metres',
        '50 metres',
        '100 metres'
      ],
      correctIndex: 1,
      explanation: 'South African 1 : 50 000 topographic maps use a 20-metre contour interval (with bold index contours every 100 m), whereas 1 : 10 000 orthophoto maps typically use a 5-metre contour interval.',
      concept: 'Closely spaced contours = steep slope; widely spaced contours = gentle slope; contours touching/merging = vertical cliff/waterfall.'
    },
    {
      id: 'nsc_geo_e10',
      subject: 'geography',
      topicId: 'geo_map',
      difficulty: 'easy',
      question: 'In Geographical Information Systems (GIS), distinguish VECTOR data from RASTER data.',
      options: [
        'Vector data uses satellite pixels; Raster data uses points, lines, and polygons',
        'Vector data represents features using coordinate Points (schools/trig beacons), Lines (roads/rivers), and Polygons (dams/cultivated lands); Raster data represents space as a grid of cells/pixels (orthophotos & satellite imagery)',
        'Vector data cannot store attribute tables',
        'Raster data uses zero computer memory'
      ],
      correctIndex: 1,
      explanation: 'Topographic map symbols map cleanly to Vector geometry (point, line, area/polygon linked to attribute tables), while aerial photographs and satellite images are Raster pixel grids.',
      concept: 'Higher spatial resolution in raster imagery = smaller ground area per pixel = sharper detail (larger file size).'
    },
    {
      id: 'nsc_geo_m1',
      subject: 'geography',
      topicId: 'geo_clim',
      difficulty: 'medium',
      question: 'Dry winter air on the interior plateau (1 500 m above sea level) starts at 14 degrees Celsius and descends down the escarpment to coastal Durban (0 m) as a BERG WIND. Using the Dry Adiabatic Lapse Rate (+1 C per 100 m descent), calculate the air temperature reaching Durban and state its hazard.',
      options: [
        '-1 degrees Celsius; frost damage',
        '29 degrees Celsius; hot, desiccating gusts create extreme runaway veld/forest fire danger ahead of an approaching coastal low and cold front',
        '14 degrees Celsius; heavy snow on the beach',
        '21,5 degrees Celsius; tropical cyclone formation'
      ],
      correctIndex: 1,
      explanation: 'Vertical descent = 1 500 m = 15 x 100 m. Compressional adiabatic heating adds 15 x 1 C = +15 C: 14 C + 15 C = 29 C. Hot, very low-humidity Berg winds dry out winter vegetation, creating severe runaway veldfire risk until the cold front sweeps through.',
      concept: 'Berg wind synoptic setup (late autumn/winter): strong Kalahari High over interior + Coastal Low / approaching Cold Front along coast -> offshore down-escarpment flow.'
    },
    {
      id: 'nsc_geo_m2',
      subject: 'geography',
      topicId: 'geo_clim',
      difficulty: 'medium',
      question: 'Why does the South-Western Cape (Cape Town) receive winter frontal rainfall whereas the interior Highveld (Johannesburg) experiences dry, sunny winters with frost?',
      options: [
        'Because the Benguela Current turns warm in July',
        'In winter, the pressure belts (ITCZ) migrate north with the sun so mid-latitude cyclones/cold fronts clip the SW Cape; simultaneously, the Kalahari High descends closer to the plateau surface BELOW the escarpment inversion layer, blocking moist Indian Ocean air from reaching the interior',
        'Tropical cyclones hit Johannesburg every July',
        'The Drakensberg flattens during winter'
      ],
      correctIndex: 1,
      explanation: 'Two classic CAPS mechanisms in winter: (1) northward shift of the westerly wind belt brings cold fronts across the SW Cape; (2) strong subsidence of the Kalahari Anticyclone lowers the temperature inversion BELOW the eastern escarpment rim, shutting out moist maritime air from the interior.',
      concept: 'CAPS Inversion Layer diagram: Winter = inversion BELOW escarpment -> dry clear interior; Summer = heated plateau weakens Kalahari High, lifting inversion ABOVE escarpment -> moist NE Indian Ocean air flows in -> summer line thunderstorms!'
    },
    {
      id: 'nsc_geo_m3',
      subject: 'geography',
      topicId: 'geo_geom',
      difficulty: 'medium',
      question: 'Two catchments receive the same annual rainfall total, yet Basin X has a much HIGHER drainage density (more stream channels per km^2) than Basin Y. Which combination of factors explains Basin X\'s high drainage density?',
      options: [
        'Porous sandy soil, flat relief, dense indigenous forest, and gentle drizzle',
        'Impermeable granite/clay rock, steep gradient, sparse vegetation cover, and intense convective downpours (maximising surface runoff over infiltration)',
        'High evaporation and karst limestone sinkholes',
        'Zero surface runoff'
      ],
      correctIndex: 1,
      explanation: 'Anything that reduces infiltration and increases rapid overland runoff carves more rills and stream channels per km^2, raising drainage density: impermeable rock/baked clay, saturated soil, steep slopes, deforestation/overgrazing, and intense storms.',
      concept: 'Drainage density = Total length of all streams in basin (km) / Total area of drainage basin (km^2).'
    },
    {
      id: 'nsc_geo_m4',
      subject: 'geography',
      topicId: 'geo_geom',
      difficulty: 'medium',
      question: 'During RIVER CAPTURE (stream piracy), an energetic tributary eroding headwards through a watershed intercepts a higher-lying sluggish river. Match the resulting landforms accurately:',
      options: [
        'Wind gap = rejuvenated energetic river; Captor = dried-up valley',
        'Elbow of capture = sharp ~90-degree bend where diversion occurred; Wind gap (dry gap) = dry gravel-strewn valley floor just downstream of the elbow; Misfit (beheaded) stream = shrunken stream too small for its wide valley below the wind gap',
        'Misfit stream gains volume and carves a deep gorge',
        'Abstraction and river capture never change watershed position'
      ],
      correctIndex: 1,
      explanation: 'The lower, steeper-gradient Captor stream cuts headwards to pirate the Captive headwaters at the Elbow of Capture, leaving a dry Wind Gap with river gravels and an underfit Misfit Stream starved of water downstream.',
      concept: 'Conditions triggering headward erosion & capture: steeper gradient, softer/jointed rock along a fault, or higher rainfall on one side of a watershed.'
    },
    {
      id: 'nsc_geo_m5',
      subject: 'geography',
      topicId: 'geo_sett',
      difficulty: 'medium',
      question: 'Why did apartheid spatial planning (Group Areas Act of 1950) leave South African cities with an "inverted" population density and long-commute spatial mismatch that persists today?',
      options: [
        'Low-income workers were housed right inside the CBD walking distance from factories',
        'Black, Coloured, and Indian communities were forcibly relocated to peripheral townships/homelands separated by buffer strips (railways/industrial belts) far from CBD/suburban jobs, imposing high transport costs and long daily commutes on low-income households',
        'Apartheid cities followed the concentric Burgess model identically to Chicago',
        'Greenbelts were banned in South Africa'
      ],
      correctIndex: 1,
      explanation: 'Unlike classic Western cities where low-income workers lived near inner-city jobs, apartheid spatial engineering pushed the poorest majority to the urban periphery—creating fragmented cities that post-1994 Spatial Development Frameworks and BRT corridors work to integrate.',
      concept: 'Post-apartheid urban remedies: densification along transit corridors (TOD), mixed-income inclusionary housing near jobs, inner-city regeneration, and informal-settlement upgrading.'
    },
    {
      id: 'nsc_geo_m6',
      subject: 'geography',
      topicId: 'geo_sett',
      difficulty: 'medium',
      question: 'What is RURAL DEPOPULATION, and what economic cycle ("spiral of decline") does it trigger in small Karoo or Free State country towns?',
      options: [
        'Rapid movement of young adults FROM cities INTO remote farms',
        'Out-migration of economically active young adults (18–39) to cities (push: mechanisation, drought, low wages; pull: tertiary jobs/universities), leaving an ageing population, shrinking purchasing power, shop/bank/school closures, and ghost towns',
        'Expansion of rural shopping malls and universities',
        'Higher rural birth rates than urban areas'
      ],
      correctIndex: 1,
      explanation: 'Loss of young working/spending households shrinks threshold population below what local shops, schools, and clinics need to survive—causing business closures, further job losses, and accelerating out-migration.',
      concept: 'Sustainable strategies to counter rural depopulation: agro-processing value chains, eco-/heritage tourism/festivals (e.g., Clarens, Nieu-Bethesda), renewable-energy wind/solar farms, and land/agrarian support.'
    },
    {
      id: 'nsc_geo_m7',
      subject: 'geography',
      topicId: 'geo_econ',
      difficulty: 'medium',
      question: 'Distinguish FOOD SECURITY from FOOD INSECURITY, and identify TWO physical + economic threats to food security in South Africa.',
      options: [
        'Food security means exporting 100% of crops while locals fast',
        'Food security exists when all people at all times have physical and economic access to sufficient, safe, nutritious food for an active healthy life; threatened in SA by El Nino droughts/climate variability, soil erosion, rising fuel/fertiliser/electricity input costs, and household unemployment/poverty',
        'South Africa has abundant uniform rainfall across 90% of its land',
        'Small-scale subsistence farmers receive too much irrigation water'
      ],
      correctIndex: 1,
      explanation: 'Even when national commercial harvests are sufficient, household food insecurity persists when high food inflation and unemployment prevent low-income families from affording nutritious diets, compounded by erratic rainfall (<500 mm over most of SA).',
      concept: 'Solutions for SA food security: drought-tolerant cultivars, drip irrigation & water harvesting, supporting emerging smallholder farmers (finance/extension/markets), agro-processing, and zero-rating staple foods from VAT.'
    },
    {
      id: 'nsc_geo_m8',
      subject: 'geography',
      topicId: 'geo_econ',
      difficulty: 'medium',
      question: 'Match the following South African Industrial Development Zones / Special Economic Zones to their flagship economic focus:',
      options: [
        'Saldanha Bay = sugarcane refining; Dube TradePort = deep-level gold mining',
        'Coega (Gqeberha) = deep-water port heavy industry/auto/green hydrogen & logistics; Saldanha Bay (West Coast) = marine engineering, oil/gas servicing & steel/iron-ore export corridor; Dube TradePort (KZN) = King Shaka airfreight perishable electronics/agro-export hub',
        'East London IDZ = inland coal power generation in Limpopo',
        'Richards Bay IDZ = wine bottling in Stellenbosch'
      ],
      correctIndex: 1,
      explanation: 'CAPS tests specific prescribed SA IDZs/SEZs and SDIs every cycle—know each zone\'s province, port/airport anchor, key industries, multiplier benefits, and infrastructure/skills constraints.',
      concept: 'Quick SA IDZ/SDI locator: Coega (Eastern Cape, Ngqura port), East London (Eastern Cape, Mercedes/auto), Saldanha Bay (Western Cape, iron ore/marine), Dube TradePort (KZN, King Shaka Airport), Maputo Corridor SDI (Gauteng-Mpumalanga-Maputo N4).'
    },
    {
      id: 'nsc_geo_m9',
      subject: 'geography',
      topicId: 'geo_map',
      difficulty: 'medium',
      question: 'On a 1 : 50 000 topographic map, Trig Beacon 142 (altitude 1 480 m) and a Spot Height (altitude 1 360 m) are 4,8 cm apart in a straight line. Calculate the average GRADIENT between them.',
      options: [
        '1 : 25',
        '1 : 20',
        '20 : 1',
        '1 : 40'
      ],
      correctIndex: 1,
      explanation: 'Vertical Interval VI = 1 480 - 1 360 = 120 m. Horizontal Equivalent HE = 4,8 cm * 500 m/cm (since 50 000 cm = 500 m) = 2 400 m. Gradient = VI / HE = 120 / 2 400 = 1 / (2 400 / 120) = 1 : 20.',
      concept: 'Always express topographic gradient as a unit ratio "1 : x" (1 m vertical rise/fall for every x metres horizontal distance) with BOTH VI and HE in metres!'
    },
    {
      id: 'nsc_geo_m10',
      subject: 'geography',
      topicId: 'geo_map',
      difficulty: 'medium',
      question: 'A 1 : 50 000 map sheet states: "Mean magnetic declination 24 degrees 18\' West of True North (July 2018). Mean annual change 6\' Westwards." Calculate the updated magnetic declination for 2026.',
      options: [
        '23 degrees 30\' West of True North',
        '25 degrees 06\' West of True North',
        '24 degrees 66\' East of True North',
        '24 degrees 26\' West of True North'
      ],
      correctIndex: 1,
      explanation: 'Difference in years = 2026 - 2018 = 8 years. Total change = 8 * 6\' = 48\' Westwards. Rule: Westwards change INCREASES a West declination (ADD): 24 degrees 18\' + 48\' = 24 degrees 66\' = 25 degrees 06\' West of True North (since 60\' = 1 degree!).',
      concept: 'Magnetic declination update rules: Annual change Westwards -> ADD; Annual change Eastwards -> SUBTRACT; convert every 60 minutes (60\') into 1 whole degree.'
    },
    {
      id: 'nsc_geo_d1',
      subject: 'geography',
      topicId: 'geo_clim',
      difficulty: 'difficult',
      question: 'A mature Tropical Cyclone ("Cyclone Freddy / Eloise" type) tracks south-westwards down the warm Mozambique Channel (>27 C) before making landfall over southern Mozambique and moving inland toward Limpopo/Mpumalanga. Explain why it rapidly WEAKENS and dissipates after landfall, yet still causes catastrophic inland flooding.',
      options: [
        'Land is hotter than 27 C so the eye freezes solid without rain',
        'Moving overland cuts off its primary energy source (evaporation & latent heat of condensation from warm >=26,5 C ocean water) AND increases surface friction over rough terrain; however, orographic uplift of residual moisture-laden air against the eastern escarpment dumps torrential rainfall onto steep catchments',
        'Coriolis force becomes infinite at the Limpopo River',
        'Subsiding air in the eye wall triggers hailstorms only'
      ],
      correctIndex: 1,
      explanation: 'Tropical cyclones are powered by latent heat released when vast amounts of warm ocean vapour condense; landfall starves the storm of warm moisture and increases friction (collapsing wind speeds), while residual moisture lifted up the Drakensberg/Lebombo escarpment causes devastating flash floods.',
      concept: 'Why tropical cyclones NEVER form within 5 degrees of the Equator: Coriolis force is too weak near 0 degrees latitude to initiate cyclonic vortex spin!'
    },
    {
      id: 'nsc_geo_d2',
      subject: 'geography',
      topicId: 'geo_clim',
      difficulty: 'difficult',
      question: 'During OCCLUSION of a Mid-Latitude Cyclone south of Cape Town, distinguish a Cold Front Occlusion from a Warm Front Occlusion, and explain why urban areas like Johannesburg experience a strong URBAN HEAT ISLAND.',
      options: [
        'Warm fronts travel faster than cold fronts; cities are cooler than rural farms',
        'A dense cold front overtakes the slower warm front (lifting all warm sector air off the surface—Cold Front Occlusion when air behind the cold front is COLDER than the cool air ahead); meanwhile cities trap heat via dark tarmac/concrete, tall-building multiple reflection, minimal vegetation/evapotranspiration, and vehicle/HVAC anthropogenic heat',
        'Mid-latitude cyclones move from east to west in the tropical easterlies',
        'Urban heat islands reduce afternoon thunderstorm frequency to zero'
      ],
      correctIndex: 1,
      explanation: 'Cold air behind the cold front travels faster than the warm front, narrowing the warm sector until lifted aloft (occlusion -> dissipation stage). Separately, urban heat islands create thermal lows (pollution domes by night; taller plume & enhanced convective rain downwind by day).',
      concept: 'Sustainable ways to cool Urban Heat Islands: rooftop/vertical gardens, planting urban street trees/greenbelts, reflective light-coloured ("cool") roofs, permeable paving, and electrified public transit.'
    },
    {
      id: 'nsc_geo_d3',
      subject: 'geography',
      topicId: 'geo_geom',
      difficulty: 'difficult',
      question: 'A river flowing across a flat floodplain experiences REJUVENATION after a drop in sea level (or tectonic uplift of the land). Identify TWO landforms proving rejuvenation occurred and explain why its longitudinal profile becomes UNGRADED.',
      options: [
        'Oxbow lakes and braided deltas; profile becomes completely flat',
        'Incised/entrenched meanders, paired river terraces, and a knickpoint waterfall/rapids—rejuvenation lowers the ultimate/temporary base level, restoring vertical downward erosion and creating a sharp break in slope (knickpoint) that interrupts the smooth concave graded profile',
        'Natural levees and marshes only; downward erosion stops',
        'Dendritic drainage converts instantly into radial drainage'
      ],
      correctIndex: 1,
      explanation: 'Rejuvenation injects fresh potential energy (steeper drop to base level), causing the river to cut vertically downward into its old floodplain—leaving step-like terraces on the valley sides, incised meanders in bedrock, and a knickpoint waterfall eroding headwards.',
      concept: 'Graded profile = smooth concave curve from source to mouth in dynamic equilibrium (erosion = deposition) with NO knickpoints/lakes/dams; Ungraded = interrupted by temporary base levels/knickpoints.'
    },
    {
      id: 'nsc_geo_d4',
      subject: 'geography',
      topicId: 'geo_geom',
      difficulty: 'difficult',
      question: 'Compare SUPERIMPOSED drainage with ANTECEDENT drainage where a river cuts a gorge (poort) straight through a hard quartzite ridge instead of flowing around it.',
      options: [
        'Both rivers formed after the ridge eroded completely flat',
        'Superimposed = the river is YOUNGER than the buried underlying rock structure (developed on younger horizontal cover rocks that later eroded away, lowering the river onto older folded strata); Antecedent = the river is OLDER than the uplift/folding (the river maintained its course by cutting down as fast as tectonic uplift raised the ridge)',
        'Superimposed = river is older than rock; Antecedent = river is younger than rock',
        'Both occur only on flat coastal sand dunes'
      ],
      correctIndex: 1,
      explanation: 'Classic CAPS memory anchor: "Super-imposed" = placed ON TOP of older buried rocks later exposed by denudation (e.g., Vaal River across Vredefort Dome); "Ante-cedent" ("ante" = before) = river existed BEFORE slow folding/faulting uplifted the land beneath it.',
      concept: 'Prefix shortcut: ANTE-cedent = river came BEFORE tectonic uplift; SUPER-imposed = river was laid ON TOP of older buried geology.'
    },
    {
      id: 'nsc_geo_d5',
      subject: 'geography',
      topicId: 'geo_sett',
      difficulty: 'difficult',
      question: 'Apply Christaller\'s Central Place Theory to explain the difference between a LOW-ORDER good/service (bread, milk, spaza shop) and a HIGH-ORDER good/service (neurosurgeon, luxury car dealership, university).',
      options: [
        'Bread has a huge threshold population and a 300 km sphere of influence',
        'Low-order = bought frequently, low price, small threshold population, and small range/sphere of influence (many convenience outlets); High-order = bought infrequently, expensive/specialised, requires a large threshold population to break even, and draws customers from a vast range/sphere of influence (few regional cities)',
        'High-order services locate inside every small farmstead',
        'Range and sphere of influence mean minimum customers needed to earn profit'
      ],
      correctIndex: 1,
      explanation: 'Keep Christaller\'s three terms razor-sharp: Threshold population = minimum number of customers needed for a service to be profitable; Range = maximum distance consumers are willing to travel for a good; Sphere of influence = geographic market area from which a central place draws customers.',
      concept: 'Higher settlement hierarchy (Hamlet -> Village -> Town -> City -> Metropolis/Conurbation -> Megalopolis) = fewer settlements, larger population, wider sphere of influence, more high-order functions.'
    },
    {
      id: 'nsc_geo_d6',
      subject: 'geography',
      topicId: 'geo_econ',
      difficulty: 'difficult',
      question: 'Evaluate the role of South Africa\'s INFORMAL SECTOR (street traders, spaza shops, backyard mechanics, hair salons) in urban economies and identify practical municipal support measures rather than heavy-handed evictions.',
      options: [
        'The informal sector contributes 0% to livelihoods and should be banned',
        'Provides vital self-employment/poverty relief with low entry barriers and affordable goods in townships/commuter nodes, despite lacking UIF/pension security, tax registration, and bank credit; municipalities should provide sheltered trading stalls, clean water/ablutions, waste collection, micro-credit, and streamlined affordable trading permits',
        'Informal traders pay 27% corporate company tax on the JSE',
        'Informal traders operate exclusively inside SEZ customs zones'
      ],
      correctIndex: 1,
      explanation: 'Informal enterprises act as an essential socio-economic safety net and link closely with formal wholesalers (buying stock from formal manufacturers/cash-and-carry stores while paying VAT on inputs!).',
      concept: 'Always mention the formal-informal linkage in CAPS essays: informal traders distribute products manufactured in the formal sector to low-income commuters.'
    },
    {
      id: 'nsc_geo_d7',
      subject: 'geography',
      topicId: 'geo_map',
      difficulty: 'difficult',
      question: 'A cross-section is drawn from a 1 : 50 000 topographic map using a vertical scale where 1 cm represents 20 m. Calculate the Vertical Exaggeration (VE) of the cross-section.',
      options: [
        '2,5 times',
        '25 times',
        '0,04 times',
        '10 times'
      ],
      correctIndex: 1,
      explanation: 'Convert Vertical Scale to a ratio in centimetres: 1 cm = 20 m = 2 000 cm -> VS = 1 : 2 000. Horizontal Scale HS = 1 : 50 000. VE = VS / HS = (1 / 2 000) / (1 / 50 000) = 50 000 / 2 000 = 25 times.',
      concept: 'Cross-sections exaggerate vertical height (here 25x) so subtle relief features like river terraces and gentle spurs are clearly visible rather than looking like a flat line.'
    },
    {
      id: 'nsc_geo_d8',
      subject: 'geography',
      topicId: 'geo_map',
      difficulty: 'difficult',
      question: 'On a 1 : 50 000 topographic map, the True Bearing from Dam Wall A to Windpump B is measured with a protractor as 132 degrees. If the current Magnetic Declination is 25 degrees 06\' West of True North, calculate the Magnetic Bearing from A to B.',
      options: [
        '106 degrees 54\'',
        '157 degrees 06\'',
        '132 degrees 00\'',
        '312 degrees 00\''
      ],
      correctIndex: 1,
      explanation: 'across South Africa, Magnetic North lies WEST of True North, so the angle from Magnetic North clockwise around to B is LARGER than from True North: Magnetic Bearing = True Bearing + Magnetic Declination = 132 degrees 00\' + 25 degrees 06\' = 157 degrees 06\'.',
      concept: 'South African bearing rhyme: "Declination WEST -> Magnetic is BEST (ADD)"; "Declination EAST -> Magnetic is LEAST (SUBTRACT)".'
    },
    {
      id: 'nsc_geo_d9',
      subject: 'geography',
      topicId: 'geo_map',
      difficulty: 'difficult',
      question: 'On a 1 : 50 000 topographic map, a rectangular orchard measures 3,0 cm long by 2,0 cm wide. Calculate its actual ground area in square kilometres (km^2) AND in hectares (1 km^2 = 100 ha).',
      options: [
        '6,0 km^2 (600 ha)',
        '1,5 km^2 (150 ha)',
        '0,3 km^2 (30 ha)',
        '15 km^2 (1 500 ha)'
      ],
      correctIndex: 1,
      explanation: 'At 1 : 50 000, 1 cm = 0,5 km. Real length = 3,0 * 0,5 = 1,5 km; Real width = 2,0 * 0,5 = 1,0 km. Area = 1,5 km * 1,0 km = 1,5 km^2. Multiplying by 100 ha/km^2 gives 150 hectares.',
      concept: 'At 1 : 50 000 scale, multiply cm by 0,5 to get km (or by 500 to get m) BEFORE multiplying length by breadth; at 1 : 10 000 orthophoto scale, multiply cm by 0,1 to get km (or by 100 to get m).'
    },
    {
      id: 'nsc_geo_d10',
      subject: 'geography',
      topicId: 'geo_map',
      difficulty: 'difficult',
      question: 'A municipality uses GIS to demarcate a 100-metre flood-exclusion zone on both sides of the Jukskei River where no new residential houses may be built, and then overlays soil-type, contour-slope, and parcel-ownership layers. Name the TWO GIS spatial analysis techniques applied.',
      options: [
        'Raster pixelation and remote sensing only',
        'Buffering (creating a fixed-distance polygon corridor around the river line feature) and Data Layering / Thematic Overlay (combining multiple geo-referenced spatial layers)',
        'Magnetic declination and vertical exaggeration',
        'Data encryption and manual sketching'
      ],
      correctIndex: 1,
      explanation: 'Drawing a uniform distance boundary (e.g., 100 m floodline, noise zone along a highway, clinic catchment radius) around a point/line/polygon is Buffering; stacking thematic layers (hydrology, relief, cadastre, geology) on shared coordinates is Data Layering / Overlay.',
      concept: 'GIS Paper 1 & 2 favourites: Buffering (floodlines/conservation zones), Data Layering (site suitability), Querying attribute tables, Remote Sensing (satellites/drones without physical contact), and Data Standardisation/Security.'
    },

    // =========================================================================
    // 10. HISTORY (CAPS Paper 1 & 2) — 30 Questions
    // =========================================================================
    {
      id: 'nsc_hist_e1',
      subject: 'history',
      topicId: 'hist_cold',
      difficulty: 'easy',
      question: 'What was the core geopolitical aim of the US Truman Doctrine and Marshall Plan introduced in 1947?',
      options: [
        'To spread Soviet communism across Western Europe',
        'Containment — providing military/financial aid and economic reconstruction to prevent war-torn countries from turning to communism',
        'To dismantle NATO and withdraw US involvement from Europe',
        'To reunify Korea under Chinese rule'
      ],
      correctIndex: 1,
      explanation: 'President Truman\'s policy of Containment sought to halt the further expansion of Soviet communist influence via political/military support (Truman Doctrine) and $13+ billion in European Recovery aid (Marshall Plan), which Stalin countered via Cominform and Comecon.',
      concept: 'Pair Cold War rivals cleanly: Truman Doctrine/Marshall Plan <-> Cominform/Comecon; NATO (1949) <-> Warsaw Pact (1955).'
    },
    {
      id: 'nsc_hist_e2',
      subject: 'history',
      topicId: 'hist_cold',
      difficulty: 'easy',
      question: 'Why did the East German government (backed by the USSR) erect the Berlin Wall in August 1961?',
      options: [
        'To stop West Berliners from migrating into prosperous East Germany',
        'To stop the mass brain drain of millions of skilled East Germans defecting through West Berlin to the democratic capitalist West',
        'To protect Berlin from Cuban missiles',
        'To celebrate the end of the Cold War'
      ],
      correctIndex: 1,
      explanation: 'Between 1949 and 1961 over 2,5 million East Germans (engineers, doctors, teachers, youth) fled via West Berlin, threatening East Germany\'s economic viability and embarrassing the Soviet bloc—prompting construction of the Berlin Wall on 13 August 1961.',
      concept: 'Distinguish the 1948–1949 Berlin Blockade & Airlift (Stalin cutting rail/road links, defeated by Allied airlift) from the 1961 Berlin Wall (stood until November 1989).'
    },
    {
      id: 'nsc_hist_e3',
      subject: 'history',
      topicId: 'hist_afr',
      difficulty: 'easy',
      question: 'Which economic and social policy did President Julius Nyerere launch in Tanzania through the 1967 Arusha Declaration?',
      options: [
        'Zaireanisation kleptocracy',
        'Ujamaa ("familyhood") — African Socialism based on self-reliance, nationalisation of key banks/industries, and communal rural villagisation',
        'Unrestricted foreign multinational privatisation',
        'Apartheid separate development'
      ],
      correctIndex: 1,
      explanation: 'Nyerere\'s 1967 Arusha Declaration committed Tanzania to African Socialism (Ujamaa) and self-reliance (kujitegemea), achieving major gains in Swahili national unity, primary literacy, and rural clinics despite severe agricultural output declines after compulsory villagisation.',
      concept: 'CAPS Comparative Essay core: contrast Tanzania\'s egalitarian socialist Ujamaa under Nyerere with the Congo\'s pro-Western authoritarian kleptocracy under Mobutu Sese Seko.'
    },
    {
      id: 'nsc_hist_e4',
      subject: 'history',
      topicId: 'hist_afr',
      difficulty: 'easy',
      question: 'Name the three main rival nationalist liberation movements in Angola at independence from Portugal in November 1975.',
      options: [
        'ANC, PAC, and IFP',
        'MPLA (Agostinho Neto), FNLA (Holden Roberto), and UNITA (Jonas Savimbi)',
        'ZANU, ZAPU, and FRELIMO',
        'SWAPO, KANU, and TANU'
      ],
      correctIndex: 1,
      explanation: 'Following the collapse of the January 1975 Alvor Agreement, civil war erupted among the Marxist-oriented MPLA (backed by USSR & Cuba), FNLA (backed by USA/Zaire), and UNITA (backed by apartheid South Africa & USA).',
      concept: 'Angola became a classic Cold War proxy battlefield linking superpower rivalry directly to Southern African liberation and Namibian independence.'
    },
    {
      id: 'nsc_hist_e5',
      subject: 'history',
      topicId: 'hist_civ',
      difficulty: 'easy',
      question: 'Which December 1955 event in Alabama, sparked by Rosa Parks refusing to give up her bus seat under Jim Crow segregation laws, launched Martin Luther King Jr. into national leadership?',
      options: [
        'The Selma-to-Montgomery marches',
        'The 381-day Montgomery Bus Boycott',
        'The Little Rock Nine crisis',
        'The Woodstock festival'
      ],
      correctIndex: 1,
      explanation: 'Rosa Parks\' arrest on 1 December 1955 catalysed the 381-day Montgomery Bus Boycott led by the Montgomery Improvement Association under Dr Martin Luther King Jr., culminating in the US Supreme Court ruling bus segregation unconstitutional (Browder v. Gayle, 1956).',
      concept: 'Non-violent civil disobedience (inspired by Mahatma Gandhi\'s satyagraha) used peaceful boycotts, sit-ins, Freedom Rides, and marches to expose the brutality of Jim Crow segregation.'
    },
    {
      id: 'nsc_hist_e6',
      subject: 'history',
      topicId: 'hist_civ',
      difficulty: 'easy',
      question: 'Who coined/popularised the slogan "Black Power" during the 1966 March Against Fear in Mississippi?',
      options: [
        'Lyndon B. Johnson',
        'Stokely Carmichael (Kwame Ture)',
        'John F. Kennedy',
        'Rosa Parks'
      ],
      correctIndex: 1,
      explanation: 'SNCC chairperson Stokely Carmichael popularised "Black Power" in June 1966, expressing frustration with slow integration and ongoing violence against peaceful marchers and calling for Black political/economic self-determination and racial pride.',
      concept: 'Key Black Power figures in CAPS: Malcolm X (intellectual forerunner), Stokely Carmichael ("Black Power" slogan), and Huey P. Newton & Bobby Seale (co-founders of the Black Panther Party in Oakland, 1966).'
    },
    {
      id: 'nsc_hist_e7',
      subject: 'history',
      topicId: 'hist_res',
      difficulty: 'easy',
      question: 'Which immediate apartheid education policy sparked the student march in Soweto on 16 June 1976?',
      options: [
        'Abolition of school uniforms',
        'The Bantu Education Department decree enforcing Afrikaans alongside English on a 50-50 basis as the compulsory medium of instruction for key high-school subjects',
        'Opening all white universities to Black students',
        'Introduction of free textbooks in Soweto'
      ],
      correctIndex: 1,
      explanation: 'Regional Bantu Education circulars enforcing Afrikaans—viewed by students as the "language of the oppressor" and a barrier to learning Mathematics/Social Studies—triggered SASM/SSRC mobilisation and the peaceful 16 June 1976 march met with deadly police gunfire (killing Hector Pieterson, Hastings Ndlovu, and hundreds across SA).',
      concept: 'Connect long-term causes (underfunded Bantu Education, overcrowded township schools, Black Consciousness confidence) with the immediate trigger (1975/76 Afrikaans medium decree).'
    },
    {
      id: 'nsc_hist_e8',
      subject: 'history',
      topicId: 'hist_res',
      difficulty: 'easy',
      question: 'Who was the primary founder of the South African Students\' Organisation (SASO, 1968/69) and leading philosopher of the Black Consciousness Movement in South Africa?',
      options: [
        'Helen Suzman',
        'Steve Biko',
        'PW Botha',
        'Constand Viljoen'
      ],
      correctIndex: 1,
      explanation: 'Stephen Bantu Biko led SASO and articulated Black Consciousness: psychological emancipation from inferiority complexes ("the most potent weapon in the hands of the oppressor is the mind of the oppressed"), Black self-reliance, and solidarity among African, Coloured, and Indian oppressed communities.',
      concept: 'Black Consciousness filled the internal political vacuum of the late 1960s–1970s after Rivonia/Sharpeville bannings and built community clinics (Zanempilo) before Biko\'s murder in detention in September 1977.'
    },
    {
      id: 'nsc_hist_e9',
      subject: 'history',
      topicId: 'hist_dem',
      difficulty: 'easy',
      question: 'What historic announcements did President FW de Klerk make in Parliament on 2 February 1990?',
      options: [
        'Declaration of a nationwide State of Emergency and Tricameral Parliament',
        'Unbanning of the ANC, PAC, SACP, and 30+ anti-apartheid organisations, lifting media restrictions, suspending executions, and announcing the unconditional release of Nelson Mandela (freed 11 February 1990)',
        'Adoption of the final 1996 Constitution',
        'Withdrawal from the United Nations'
      ],
      correctIndex: 1,
      explanation: 'De Klerk\'s 2 February 1990 speech unbanned liberation movements and cleared the path for Nelson Mandela\'s release from Victor Verster Prison nine days later (11 February 1990), opening formal negotiations toward a non-racial democracy.',
      concept: 'Why 1989/1990 became the turning point: collapse of the USSR/Berlin Wall (ending the NP\'s "rooi gevaar" excuse) + biting economic sanctions/debt standstill + internal UDF/COSATU ungovernability + Cuito Cuanavale military stalemate.'
    },
    {
      id: 'nsc_hist_e10',
      subject: 'history',
      topicId: 'hist_dem',
      difficulty: 'easy',
      question: 'Who chaired South Africa\'s Truth and Reconciliation Commission (TRC) established in 1995, and what type of justice formed its philosophical foundation?',
      options: [
        'Judge Richard Goldstone — purely retributive Nuremberg-style trials',
        'Archbishop Desmond Tutu — restorative justice aimed at uncovering truth, acknowledging victims\' dignity, and fostering national healing rather than blanket amnesia or mass vengeance',
        'Eugene de Kock — military tribunal justice',
        'Thabo Mbeki — secret closed hearings'
      ],
      correctIndex: 1,
      explanation: 'Chaired by Archbishop Desmond Tutu (with Alex Boraine as deputy chair), the TRC pursued restorative justice (Ubuntu) through three committees: Human Rights Violations, Reparation and Rehabilitation, and Amnesty.',
      concept: 'Crucial TRC fact: amnesty was NEVER automatic or blanket—perpetrators had to apply individually, prove a political motive, and make FULL disclosure of their crimes!'
    },
    {
      id: 'nsc_hist_m1',
      subject: 'history',
      topicId: 'hist_cold',
      difficulty: 'medium',
      question: 'How was the October 1962 Cuban Missile Crisis peacefully resolved after 13 days on the brink of nuclear war between the USA (Kennedy) and USSR (Khrushchev)?',
      options: [
        'A full-scale US amphibious invasion of Havana overthrew Fidel Castro',
        'Khrushchev agreed to dismantle and withdraw Soviet nuclear missiles from Cuba in exchange for Kennedy\'s public pledge not to invade Cuba AND a secret US agreement to remove Jupiter nuclear missiles from Turkey',
        'Cuba joined NATO and broke ties with Moscow',
        'The United Nations confiscated all US and Soviet nuclear weapons'
      ],
      correctIndex: 1,
      explanation: 'Kennedy rejected air strikes/invasion in favour of a naval "quarantine" (blockade) giving diplomacy breathing room. Both leaders stepped back from Mutually Assured Destruction (MAD), subsequently installing the Moscow-Washington Hotline (1963) and signing the Limited Nuclear Test Ban Treaty (1963).',
      concept: 'CAPS source-based skill: evaluate Khrushchev vs Kennedy perspectives—publicly Kennedy looked victorious because the Turkey Jupiter missile deal was kept secret at the time!'
    },
    {
      id: 'nsc_hist_m2',
      subject: 'history',
      topicId: 'hist_cold',
      difficulty: 'medium',
      question: 'Why did the January 1968 TET OFFENSIVE prove to be a decisive political and psychological turning point in the Vietnam War even though Viet Cong / NVA forces suffered heavy military casualties?',
      options: [
        'The US Army captured Hanoi and ended the war in February 1968',
        'Coordinated Viet Cong attacks on over 100 South Vietnamese cities—including inside the US Embassy compound in Saigon—shattered US government claims that victory was imminent, turning televised US public opinion sharply against the war',
        'China signed a peace alliance with South Vietnam',
        'President Nixon immediately sent 1 million extra US ground troops in 1969'
      ],
      correctIndex: 1,
      explanation: 'Televised footage of fierce urban fighting during Tet exposed a massive "credibility gap" between optimistic Pentagon statements and reality on the ground, prompting LBJ not to seek re-election, halting escalation, and leading to Nixon\'s "Vietnamisation" withdrawal.',
      concept: 'Why the superpower USA failed in Vietnam: Viet Cong guerrilla warfare (booby traps, Cu Chi tunnels, blending with peasantry), Ho Chi Minh Trail supply lines, unpopular US tactics (Operation Rolling Thunder, Napalm, Agent Orange, My Lai massacre), and domestic anti-war protests.'
    },
    {
      id: 'nsc_hist_m3',
      subject: 'history',
      topicId: 'hist_afr',
      difficulty: 'medium',
      question: 'What was Mobutu Sese Seko\'s 1973 policy of "Zaireanisation" in the Congo, and why did it trigger severe economic collapse?',
      options: [
        'Investing copper revenues into free rural primary schools and clinics across every province',
        'Confiscating ~2 000 foreign-owned farms, shops, and enterprises and handing them as political patronage to untrained Mobutu cronies/elites who stripped assets rather than managing production, causing food shortages, hyperinflation, and eventual "retrocession"',
        'Joining the East African Community with Tanzania',
        'Establishing an independent multi-party constitutional court'
      ],
      correctIndex: 1,
      explanation: 'Paired with falling world copper prices after 1974 and rising oil bills, Zaireanisation turned productive businesses into personal spoils for Mobutu\'s kleptocratic elite, devastating agriculture and infrastructure while Mobutu retained Cold War Western backing as an anti-communist ally.',
      concept: 'Compare economic vulnerability in BOTH Congo and Tanzania: over-reliance on single primary exports (copper in Congo; sisal/coffee in Tanzania) exposed both to 1970s oil shocks and falling terms of trade.'
    },
    {
      id: 'nsc_hist_m4',
      subject: 'history',
      topicId: 'hist_afr',
      difficulty: 'medium',
      question: 'Why was the 1987–1988 Battle of Cuito Cuanavale in south-eastern Angola a watershed moment for Southern African history?',
      options: [
        'Portugal recolonised Angola and Mozambique',
        'Combined Angolan FAPLA, Cuban, and SWAPO forces halted the SADF/UNITA advance and ended South African air superiority, forcing tripartite negotiations (New York Accords, Dec 1988) that secured Cuban troop withdrawal AND South Africa\'s withdrawal from Namibia (UN Resolution 435 -> Namibian independence in March 1990)',
        'UNITA captured Luanda in 1988 and abolished elections',
        'The Cold War intensified for another twenty years in Namibia'
      ],
      correctIndex: 1,
      explanation: 'Cuito Cuanavale shattered the myth of apartheid military invincibility, raised the human and financial cost of cross-border war for Pretoria, and directly unlocked Namibian independence (1990) while accelerating South Africa\'s own transition.',
      concept: 'In CAPS Paper 1 essays/sources on Angola, note contested historical interpretations of Cuito Cuanavale (tactical stalemate vs strategic defeat of SADF objectives) while emphasising its undisputed diplomatic outcome: New York Accords & Namibian independence.'
    },
    {
      id: 'nsc_hist_m5',
      subject: 'history',
      topicId: 'hist_civ',
      difficulty: 'medium',
      question: 'Why did Martin Luther King Jr. and the SCLC deliberately select BIRMINGHAM, Alabama ("Project C", April–May 1963) for mass non-violent protests and the Children\'s Crusade?',
      options: [
        'Birmingham had already desegregated all schools and restaurants peacefully',
        'Birmingham was the most rigidly segregated city in the South with a notoriously violent Public Safety Commissioner ("Bull" Connor); televised images of police dogs and high-pressure fire hoses used on peaceful schoolchildren shocked national/global conscience and compelled President Kennedy to propose sweeping federal Civil Rights legislation',
        'To campaign against the Vietnam War draft',
        'To launch the Black Panther Free Breakfast Programme'
      ],
      correctIndex: 1,
      explanation: 'King explained in his "Letter from Birmingham Jail" that non-violent direct action creates constructive crisis tension forcing negotiation. Televised brutality in Birmingham built momentum for the August 1963 March on Washington and passage of the landmark Civil Rights Act of 1964.',
      concept: 'Differentiate the TWO landmark Acts signed by LBJ: Civil Rights Act of 1964 (outlawed segregation in public accommodations & employment discrimination) vs Voting Rights Act of 1965 (after Selma "Bloody Sunday"—outlawed literacy tests & sent federal voter registrars).'
    },
    {
      id: 'nsc_hist_m6',
      subject: 'history',
      topicId: 'hist_civ',
      difficulty: 'medium',
      question: 'Beyond armed self-defence patrols monitoring police brutality in Oakland, how did the Black Panther Party\'s "Survival Programs" serve inner-city African American communities?',
      options: [
        'They operated exclusively in rural Southern cotton plantations',
        'They ran over 60 practical community upliftment initiatives—most famously the Free Breakfast for School Children Program (feeding tens of thousands daily), free people\'s health clinics (testing for sickle-cell anaemia), free clothing/food giveaways, and liberation schools',
        'They campaigned for the repeal of the Voting Rights Act',
        'They rejected all education and healthcare programmes'
      ],
      correctIndex: 1,
      explanation: 'CAPS Paper 1 requires balanced evaluation of the Black Panther Party: pairing their Ten-Point Platform and militant self-defence posture with concrete socialist community programmes (free children\'s breakfasts, sickle-cell screening clinics, legal aid).',
      concept: 'Avoid one-sided caricatures of Black Power: show both how it instilled racial pride, cultural identity ("Black is Beautiful"), and community self-help AND how FBI COINTELPRO repression and internal splits weakened the BPP.'
    },
    {
      id: 'nsc_hist_m7',
      subject: 'history',
      topicId: 'hist_res',
      difficulty: 'medium',
      question: 'Why did PW Botha\'s 1983 Constitutional "reforms" (the Tricameral Parliament) backfire and trigger the launch of the United Democratic Front (UDF) at Mitchells Plain in August 1983?',
      options: [
        'Because the Tricameral Parliament granted one-person-one-vote to every South African',
        'Because it created powerless subordinate chambers for Coloured (House of Representatives) and Indian (House of Delegates) voters to co-opt them while COMPLETELY EXCLUDING the Black African majority (~73% of the population)—uniting over 600 civic, youth, church, student, and sporting organisations under the non-racial Charterist UDF to boycott the elections',
        'Because white voters rejected the 1983 referendum',
        'Because COSATU merged into the National Party'
      ],
      correctIndex: 1,
      explanation: 'Botha\'s "Total Strategy" tried to divide oppressed groups through cosmetic power-sharing while entrenching white NP control (4:2:1 ratio). Instead, UDF\'s "Million Signatures" and "Don\'t Vote" campaigns kept Coloured/Indian turnout below ~20–30% and ignited nationwide civic rent/consumer boycotts.',
      concept: 'PW Botha\'s twin policy: "Total Onslaught" propaganda justified "Total Strategy" = cosmetic socio-economic/constitutional reforms (Wiehahn trade union legalisation, Tricameral Parliament) + harsh securocrat repression (States of Emergency 1985/86).'
    },
    {
      id: 'nsc_hist_m8',
      subject: 'history',
      topicId: 'hist_res',
      difficulty: 'medium',
      question: 'How did the 1985 debt-standstill crisis (triggered when Chase Manhattan and international banks refused to roll over short-term loans after PW Botha\'s defiant "Rubicon Speech") combine with international anti-apartheid campaigns to pressure Pretoria?',
      options: [
        'The Rand strengthened to $5,00 and foreign investment doubled',
        'Capital flight, disinvestment by major multinationals, US Comprehensive Anti-Apartheid Act (1986) sanctions, sports/cultural/academic boycotts, and consumer boycotts starved the apartheid economy of foreign capital, caused stagflation and a collapsing Rand, and convinced SA business leaders to meet the exiled ANC in Lusaka/Dakar',
        'Sanctions affected only neighbouring Botswana',
        'Britain and the USA immediately invaded Pretoria militarily'
      ],
      correctIndex: 1,
      explanation: 'External pillars of struggle (AAM consumer boycotts, Gleneagles sporting isolation, Free Nelson Mandela concerts, disinvestment, and the 1985 financial sanction shock after the Rubicon speech) worked hand-in-hand with internal UDF/COSATU mass action to make apartheid economically unsustainable.',
      concept: 'Always integrate INTERNAL mass resistance (UDF, COSATU, End Conscription Campaign, SACC churches, MK) with EXTERNAL pressure (AAM boycotts, sanctions, disinvestment, Frontline States) in Paper 2.'
    },
    {
      id: 'nsc_hist_m9',
      subject: 'history',
      topicId: 'hist_dem',
      difficulty: 'medium',
      question: 'Why did the assassination of SACP leader Chris Hani outside his Boksburg home on 10 April 1993 paradoxically ACCELERATE rather than derail South Africa\'s multiparty negotiations?',
      options: [
        'Right-wing conspirators successfully installed a military dictatorship',
        'Although far-right assassins (Janusz Walus and Clive Derby-Lewis) hoped to ignite a race war, Nelson Mandela\'s statesmanlike televised broadcast calmed the nation (demonstrating that moral authority had already shifted from De Klerk to Mandela) and shocked negotiators into setting a firm democratic election date (27 April 1994) to prevent further bloodshed',
        'All political parties cancelled elections until 2004',
        'CODESA I convened for the first time in May 1993'
      ],
      correctIndex: 1,
      explanation: 'Hani\'s murder brought South Africa to the precipice of civil war, exposing the extreme danger of dragging out talks; Mandela stepped into a presidential unifying role on national TV and the Multiparty Negotiating Forum urgently locked in April 1994 as the election date.',
      concept: 'Key 1992–1993 turning points: CODESA II deadlock (May 1992) -> Boipatong massacre (June 1992) -> Rolling Mass Action & Bisho massacre (Sept 1992) -> Record of Understanding (26 Sept 1992, Mandela & Roelf Meyer/Cyril Ramaphosa channel) -> Hani\'s assassination (April 1993).'
    },
    {
      id: 'nsc_hist_m10',
      subject: 'history',
      topicId: 'hist_dem',
      difficulty: 'medium',
      question: 'What were Joe Slovo\'s "Sunset Clauses" (1992), and why were they crucial in breaking the negotiation deadlock with the National Party?',
      options: [
        'A proposal to ban evening political rallies',
        'A strategic compromise proposing a 5-year Government of National Unity (GNU) sharing executive cabinet posts with parties winning >=5% of the vote AND guaranteeing existing civil servants, police, and SADF generals their jobs and pensions—neutralising threat of a white civil-service/security-force coup',
        'Permanent minority veto power forever',
        'Immediate dismissal of every teacher and police officer on 28 April 1994'
      ],
      correctIndex: 1,
      explanation: 'SACP strategist Joe Slovo recognised neither side had won an outright military victory: offering temporary 5-year power-sharing ("sunsetting" in 1999) and civil-service job/pension guarantees reassured the NP and security apparatus without surrendering majority rule.',
      concept: 'Negotiated settlements require mutual compromise: NP dropped permanent racial group vetoes; ANC accepted temporary 5-year GNU, Sunset Clauses, and property/provincial compromises in the Interim Constitution.'
    },
    {
      id: 'nsc_hist_d1',
      subject: 'history',
      topicId: 'hist_cold',
      difficulty: 'difficult',
      question: 'When analysing Cold War primary sources in CAPS Paper 1 (e.g., Churchill\'s March 1946 "Iron Curtain" speech alongside Stalin\'s Pravda reply), how do you evaluate the RELIABILITY vs USEFULNESS of a clearly biased political speech?',
      options: [
        'State "This source is unreliable because it is biased and therefore completely useless to a historian"',
        'Explain that its RELIABILITY as an objective factual account is limited by partisan Cold War propaganda/omissions (proven by language/context), YET it remains HIGHLY USEFUL as primary evidence of official US/Western attitudes, fears, and ideological framing in March 1946 when corroborated against Soviet sources',
        'Check only the font size and date of printing',
        'Assume every government speech is 100% objective truth'
      ],
      correctIndex: 1,
      explanation: 'CAPS Level 3 source-work gold standard: bias limits factual reliability, NEVER historical usefulness! Always identify: (1) Author/Origin & Date, (2) Audience & Purpose/Agenda, (3) Specific loaded language/omissions, and (4) What perspective it usefully reveals.',
      concept: 'Never write generic one-liners like "biased because he was American"—quote a phrase from the source and link it to exact 1946 historical context!'
    },
    {
      id: 'nsc_hist_d2',
      subject: 'history',
      topicId: 'hist_cold',
      difficulty: 'difficult',
      question: 'Synthesise why Mikhail Gorbachev\'s twin domestic reforms of PERESTROIKA ("economic restructuring") and GLASNOST ("political openness", 1985–1991)—intended to revitalise Soviet socialism—instead precipitated the end of the Cold War and the collapse of the USSR.',
      options: [
        'Gorbachev invaded West Berlin in 1989',
        'Glasnost lifted censorship, unleashing pent-up criticism of Communist Party corruption and nationalist independence movements in the Baltic/Eastern bloc, while Perestroika dismantled central planning faster than market mechanisms formed (causing shortages)—and abandoning the Brezhnev Doctrine ("Sinatra Doctrine") allowed peaceful 1989 revolutions across Eastern Europe and the fall of the Berlin Wall',
        'Perestroika tripled Soviet military spending in Afghanistan',
        'Ronald Reagan annexed Moscow in 1988'
      ],
      correctIndex: 1,
      explanation: 'Crucial link between Paper 1 and Paper 2: Gorbachev\'s reforms + ending costly foreign proxy wars (Afghanistan, Angola) ended Soviet financial/military backing for liberation movements AND removed Pretoria\'s "Total Onslaught / anti-communist" justification with the West, directly forcing FW de Klerk toward the negotiating table in 1989–1990!',
      concept: 'CAPS Topic 6 Paper 2 essay ("End of the Cold War and a New World Order"): connect Perestroika + Glasnost + Fall of Berlin Wall (Nov 1989) directly to SA\'s 1990 transition.'
    },
    {
      id: 'nsc_hist_d3',
      subject: 'history',
      topicId: 'hist_afr',
      difficulty: 'difficult',
      question: 'In a comparative essay on post-independence Congo and Tanzania (1960s–1980s), which nuanced judgement accurately evaluates their EDUCATIONAL and SOCIAL outcomes alongside their economic struggles?',
      options: [
        'Congo achieved 98% literacy while Tanzania suffered civil war and ethnic secession',
        'While BOTH economies suffered external shocks, debt crises, and Structural Adjustment Programmes by the 1980s, Tanzania forged enduring national unity through Kiswahili, avoided ethnic civil war/coups, and raised adult literacy above ~85% via Education for Self-Reliance—whereas Mobutu\'s Congo neglected public schools/health while enriching a narrow elite amid regional secessionism',
        'Neither country inherited any colonial borders or monocrop economies',
        'Tanzania relied exclusively on Belgian mining engineers until 1990'
      ],
      correctIndex: 1,
      explanation: 'Distinction comparative essays weave side-by-side thematic comparisons (Political leadership/stability, Economic policies, Social/Cultural/Educational legacies) rather than writing two disconnected halves, showing where Tanzania\'s nation-building succeeded despite Ujamaa\'s agricultural failures.',
      concept: 'Structure CAPS Paper 1 Comparative Essays thematically paragraph-by-paragraph (Political -> Economic -> Social/Cultural) using explicit comparative connectors ("Whereas in the Congo..., by contrast in Tanzania...").'
    },
    {
      id: 'nsc_hist_d4',
      subject: 'history',
      topicId: 'hist_civ',
      difficulty: 'difficult',
      question: 'Evaluate the relationship between the non-violent Civil Rights Movement (1950s–1965) and the Black Power Movement (mid-1960s–1970s) in transforming African American lives.',
      options: [
        'Black Power achieved the 1954 Brown v. Board ruling while MLK rejected voting rights',
        'Civil Rights dismantled legal de jure Jim Crow segregation in the South (1964 Civil Rights Act, 1965 Voting Rights Act), while Black Power addressed persistent de facto Northern ghetto poverty, police brutality, economic exclusion, and psychological/cultural pride (Afrocentric studies, community clinics/breakfasts)—complementing legal rights with identity and socio-economic militancy',
        'Neither movement had any lasting legal or cultural impact in the USA',
        'Both movements used identical tactics and agreed on every issue'
      ],
      correctIndex: 1,
      explanation: 'Distinguish DE JURE segregation (laws on the statute books in the South—defeated by non-violent Civil Rights campaigns) from DE FACTO inequality (housing, jobs, inner-city policing in Northern/Western cities like Watts, Newark, Oakland—confronted by Black Power).',
      concept: 'Using "de jure" vs "de facto" segregation accurately in CAPS Paper 1 essays elevates your historical analysis into Level 7 distinction territory.'
    },
    {
      id: 'nsc_hist_d5',
      subject: 'history',
      topicId: 'hist_res',
      difficulty: 'difficult',
      question: 'Evaluate the historical role of the Black Consciousness Movement (BCM) in bridging the quietude of the 1960s and the mass resistance of 1976–1980s in South Africa.',
      options: [
        'BCM organised the 1955 Congress of the People in Kliptown',
        'BCM broke psychological fear/passivity after Rivonia through SASO, Black People\'s Convention (BPC), Black Community Programmes, and SASM in high schools—directly inspiring the 1976 Soweto generation; after 1976–77 bannings, thousands of BC-conscientised youth joined MK/APLA in exile or later anchored 1980s civic and union leadership',
        'BCM supported Homeland Bantustan "independence" under Kaiser Matanzima',
        'BCM relied exclusively on white liberal leadership inside Parliament'
      ],
      correctIndex: 1,
      explanation: 'Note Biko\'s nuanced critique of white liberals ("do your own anti-racist work in white society rather than speaking on behalf of Black people"), rejection of Bantustan collaboration, inclusive definition of "Black" (African, Coloured, Indian), and enduring influence on SASM/SSRC leaders like Tsietsi Mashinini.',
      concept: 'To answer "To what extent did BCM cause the 1976 Soweto Uprising?", weigh BCM\'s ideological/organisational catalyst (SASM) alongside socioeconomic pressures (1973 Durban strikes, oil recession, Mozambican/Angolan independence in 1975, and Bantu Education/Afrikaans).'
    },
    {
      id: 'nsc_hist_d6',
      subject: 'history',
      topicId: 'hist_res',
      difficulty: 'difficult',
      question: 'How did the Congress of South African Trade Unions (COSATU, launched December 1985) transform workplace struggles into a formidable political force against apartheid?',
      options: [
        'COSATU restricted itself strictly to canteen menus and banned strikes',
        'Following the 1979 Wiehahn Commission legalisation of Black trade unions, COSATU united >500 000 workers under "One Industry, One Union", linking shop-floor wage/safety demands ("Living Wage") directly with community UDF civic struggles through nationwide stayaways, consumer boycotts, and sanctions advocacy',
        'COSATU was founded by the apartheid Department of Manpower',
        'COSATU dissolved in 1986 before the State of Emergency'
      ],
      correctIndex: 1,
      explanation: 'Social Movement Unionism meant workers realised workplace exploitation could not be separated from township pass laws, rent hikes, and political disenfranchisement—making coordinated UDF-COSATU stayaways (especially when UDF was restricted in Feb 1988 under the Mass Democratic Movement) impossible for business to ignore.',
      concept: 'Unintended consequence of Botha\'s 1979 Wiehahn reform: legalising Black unions to "register and control" them instead handed workers legal strike leverage at the heart of the apartheid economy!'
    },
    {
      id: 'nsc_hist_d7',
      subject: 'history',
      topicId: 'hist_dem',
      difficulty: 'difficult',
      question: 'How did "spoilers" from across the political spectrum attempt to derail South Africa\'s 1990–1994 transition right up to April 1994, and how were the 27 April 1994 elections salvaged?',
      options: [
        'There was zero political violence in South Africa between 1990 and 1994',
        'State-sponsored "Third Force" Hostel/train violence in KwaZulu-Natal & Reef townships, AWB storming of the Kempton Park World Trade Centre (June 1993) and failed Bophuthatswana incursion (March 1994), PAC/APLA attacks (St James Church), and IFP election boycott threatened chaos—until Constand Viljoen registered the Freedom Front and last-minute constitutional/royal guarantees brought Mangosuthu Buthelezi\'s IFP onto the ballot via sticker strips just days before 27 April 1994',
        'UN peacekeepers cancelled voting in KwaZulu-Natal and Gauteng',
        'Lucas Mangope won the 1994 presidential election'
      ],
      correctIndex: 1,
      explanation: 'Over 14 000 South Africans died in political violence between 1990 and 1994—more than in previous decades! Splitting the white right (Viljoen choosing constitutional participation via Freedom Front after the Bophuthatswana fiasco) and securing IFP\'s eleventh-hour entry on 19 April 1994 averted civil war.',
      concept: 'CAPS Paper 2 Essay ("The road to democracy 1990–1994 was rocky and fraught with violence"): balance spoilers/violence against leadership, compromise, and mass participation.'
    },
    {
      id: 'nsc_hist_d8',
      subject: 'history',
      topicId: 'hist_dem',
      difficulty: 'difficult',
      question: 'What were the major CRITICISMS levelled against the Truth and Reconciliation Commission (TRC) from different segments of South African society?',
      options: [
        'Everyone in South Africa agreed the TRC had zero limitations',
        '(1) Families of victims (such as Steve Biko\'s, Griffiths Mxenge\'s, and Fabian Ribeiro\'s families) challenged conditional amnesty for letting confessed killers walk free without courtroom punishment; (2) focus on individual gross physical atrocities neglected systemic socio-economic beneficiaries of apartheid (pass laws, forced removals, corporate profit) and delayed/modest reparations; and (3) senior apartheid politicians (like PW Botha) defied subpoenas or denied chain-of-command responsibility while NP critics alleged bias',
        'The TRC sentenced 50 000 people to life imprisonment',
        'The TRC refused to hold public hearings anywhere in South Africa'
      ],
      correctIndex: 1,
      explanation: 'Evaluating the TRC ("To what extent did the TRC achieve reconciliation?") requires weighing major achievements (uncovering hidden graves/truth across >21 000 victim statements, forestalling vengeance, establishing an undeniable public record) against real limitations (amnesty pain for families like Biko/Mxenge, top politicians evading accountability, narrow mandate excluding structural economic dispossession, slow reparations).',
      concept: 'Quoting the Biko/AZAPO & Mxenge Constitutional Court challenge to amnesty alongside systemic economic critique earns top analytical marks in TRC essays.'
    },
    {
      id: 'nsc_hist_d9',
      subject: 'history',
      topicId: 'hist_dem',
      difficulty: 'difficult',
      question: 'In CAPS Topic 6 ("Globalisation and a New World Order post-1989"), what critique is frequently directed at Bretton Woods institutions (IMF & World Bank) and WTO trade rules by developing nations of the Global South (and groupings like BRICS)?',
      options: [
        'They give African nations 90% of voting shares on the IMF board',
        'Structural Adjustment Programmes imposed austerity (cutting health/education subsidies, privatisation, rapid tariff liberalisation) while wealthy Global North economies continued heavily subsidising their own agricultural farmers, reinforcing unequal North-South trade and governance representation',
        'They abolished international trade and the internet in 1995',
        'BRICS nations oppose all forms of trade and infrastructure banking'
      ],
      correctIndex: 1,
      explanation: 'Post-Cold War globalisation integrated supply chains and ICT rapidly, but asymmetric agricultural subsidies, debt conditionalities, and outdated Bretton Woods/UN Security Council voting structures spurred South-South cooperation (IBSA, BRICS & the New Development Bank, African Union Agenda 2063).',
      concept: 'Always show both sides of globalisation for Africa: technological/market access & FDI opportunities vs deindustrialisation from cheap imports, brain drain, and commodity dependence.'
    },
    {
      id: 'nsc_hist_d10',
      subject: 'history',
      topicId: 'hist_res',
      difficulty: 'difficult',
      question: 'Why did the End Conscription Campaign (ECC, founded 1983) alarm the apartheid securocrat state sufficiently to ban it in August 1988?',
      options: [
        'Because the ECC organised armed guerrilla attacks from Angola',
        'Because white male conscripts refusing SADF military call-ups in townships and Namibia/Angola eroded cohesion INSIDE the apartheid state\'s own white constituency and moralised conscientious objection against fighting fellow South Africans in township deployments',
        'Because conscription applied only to foreign tourists',
        'Because the ECC campaigned for longer 10-year military service'
      ],
      correctIndex: 1,
      explanation: 'When SADF troops were deployed into South African townships from 1984 onwards ("Troops Out of the Townships"), white conscientious objectors and the ECC (alongside Black Sash) fractured white consensus from within, prompting harsh detention and the 1988 banning of the ECC.',
      concept: 'Highlighting anti-apartheid resistance inside white civil society (Black Sash, NUSAS, ECC, progressive clergy like Beyers Naude) demonstrates multi-dimensional historical understanding in Paper 2.'
    }
  ];

  // =========================================================================
  // 4. STATE, SEEDING, STORAGE & QUESTION SELECTION ENGINE
  // =========================================================================

  let currentSession = {
    gradeId: 'grade12',
    programmeId: 'custom',
    selectedSubjects: ['mathematics'],
    userCustomizedSubject: false,
    difficulty: 'medium',
    mode: 'daily_quiz', // 'daily_quiz' | 'weakness_drill'
    targetWeakKeys: [],  // array of "subject::topicId"
    questions: [],
    currentIndex: 0,
    userAnswers: {}      // index -> { selectedIndex, confirmed }
  };

  let sessionCounter = 0;
  let clearConfirmArmed = false;

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function seededRandomGenerator(seedStr) {
    let h = 1779033703 ^ seedStr.length;
    for (let i = 0; i < seedStr.length; i++) {
      h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      h ^= h >>> 16;
      return (h >>> 0) / 4294967296;
    };
  }

  function getTodaySeed() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function shuffleArray(arr, rng) {
    const copy = arr.slice();
    const rand = rng || Math.random;
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function getGradeLabel(gradeId) {
    const found = NSC_GRADES[gradeId];
    return found ? found.shortLabel : 'Grade 12';
  }

  // Non-invasively read current APS Calculator context on south-african-aps-calculator.html
  function detectCalculatorContext() {
    const ctx = {
      hasResult: false,
      apsScore: null,
      scaleLabel: '',
      enteredPercentages: [],
      borderlineMarks: [],
      recommendedSubject: 'mathematics',
      recommendedDifficulty: null,
      message: 'Choose an NSC subject below to start a 10-question practice quiz.'
    };

    try {
      const subInputs = [];
      for (let i = 1; i <= 6; i++) {
        const el = document.getElementById('sub' + i);
        if (el && el.value !== '') {
          const val = parseFloat(el.value);
          if (!isNaN(val) && val >= 0 && val <= 100) {
            subInputs.push({ label: 'Subject ' + i, pct: val });
          }
        }
      }

      const includeLoEl = document.getElementById('includeLO');
      const loInput = document.getElementById('loPercent');
      const includeLO = !!(includeLoEl && includeLoEl.checked);
      if (includeLO && loInput && loInput.value !== '') {
        const loVal = parseFloat(loInput.value);
        if (!isNaN(loVal) && loVal >= 0 && loVal <= 100) {
          subInputs.push({ label: 'Life Orientation', pct: loVal });
        }
      }

      ctx.enteredPercentages = subInputs;

      const coreInputs = subInputs.filter((item) => item.label !== 'Life Orientation');
      let lowestItem = null;
      coreInputs.forEach((item) => {
        if (!lowestItem || item.pct < lowestItem.pct) {
          lowestItem = item;
        }
      });

      const thresholds = [40, 50, 60, 70, 80];
      let borderlineItem = null;
      coreInputs.forEach((item) => {
        for (let t = 0; t < thresholds.length; t++) {
          const diff = thresholds[t] - item.pct;
          if (diff > 0 && diff <= 3) {
            ctx.borderlineMarks.push(`${item.label} (${item.pct}% is ${diff}% shy of ${thresholds[t]}%)`);
            if (!borderlineItem) {
              borderlineItem = { label: item.label, pct: item.pct, diff: diff, target: thresholds[t] };
            }
            break;
          }
        }
      });

      const resultsBox = document.getElementById('results');
      const apsValueEl = document.getElementById('apsValue');
      const apsNoteEl = document.getElementById('apsNote');
      if (resultsBox && resultsBox.classList.contains('visible') && apsValueEl) {
        const parsedAps = parseInt((apsValueEl.textContent || '').trim(), 10);
        if (!isNaN(parsedAps)) {
          ctx.hasResult = true;
          ctx.apsScore = parsedAps;
          ctx.scaleLabel = apsNoteEl ? (apsNoteEl.textContent || '').trim() : '';
        }
      }

      if (lowestItem) {
        ctx.recommendedDifficulty = lowestItem.pct < 50 ? 'easy' : (lowestItem.pct < 70 ? 'medium' : 'difficult');
      }

      if (ctx.hasResult && ctx.apsScore !== null) {
        const maxPts = includeLO ? 49 : 42;
        if (lowestItem && lowestItem.pct < 60) {
          ctx.message = `Your APS is ${ctx.apsScore}/${maxPts}, and ${lowestItem.label} (${lowestItem.pct}%) is your lowest mark. Practise Mathematics or select that subject below.`;
        } else if (borderlineItem) {
          ctx.message = `Your APS is ${ctx.apsScore}/${maxPts}, with ${borderlineItem.label} (${borderlineItem.pct}%) just ${borderlineItem.diff}% below the next level. Practise Mathematics or select another subject below.`;
        } else if (lowestItem) {
          ctx.message = `Your APS is ${ctx.apsScore}/${maxPts}, and ${lowestItem.label} (${lowestItem.pct}%) is your lowest mark. Practise Mathematics or select that subject below.`;
        } else {
          ctx.message = `Your APS is ${ctx.apsScore}/${maxPts}. Practise Mathematics or choose another NSC subject below.`;
        }
      } else if (lowestItem) {
        ctx.hasResult = true;
        ctx.message = `${lowestItem.label} (${lowestItem.pct}%) is your lowest entered mark. Practise Mathematics or select that subject below.`;
      }
    } catch (e) {
      // Safe fallback
    }

    return ctx;
  }

  // LocalStorage helpers
  function getQuizHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveQuizAttempt(record) {
    try {
      const history = getQuizHistory();
      history.unshift(record);
      if (history.length > 25) history.length = 25;
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      // Ignore quota errors
    }
  }

  function clearQuizHistory() {
    try {
      localStorage.removeItem(STORAGE_HISTORY_KEY);
      localStorage.removeItem(STORAGE_SEEN_KEY);
    } catch (e) {}
  }

  function getSeenMap() {
    try {
      const raw = localStorage.getItem(STORAGE_SEEN_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function getSeenIdsForSubject(subjectId) {
    const map = getSeenMap();
    return Array.isArray(map[subjectId]) ? map[subjectId] : [];
  }

  function markQuestionsSeen(questionsList) {
    try {
      const map = getSeenMap();
      questionsList.forEach((q) => {
        if (!Array.isArray(map[q.subject])) {
          map[q.subject] = [];
        }
        const existingIdx = map[q.subject].indexOf(q.id);
        if (existingIdx !== -1) {
          map[q.subject].splice(existingIdx, 1);
        }
        map[q.subject].push(q.id);
        // Each subject has 30 questions (10 per difficulty); retain last 24 so unseen items rotate cleanly
        if (map[q.subject].length > 24) {
          map[q.subject] = map[q.subject].slice(map[q.subject].length - 24);
        }
      });
      localStorage.setItem(STORAGE_SEEN_KEY, JSON.stringify(map));
    } catch (e) {}
  }

  /**
   * Generates a 10-question mixed NSC CAPS quiz across selected subjects,
   * prioritizing unseen questions at the chosen difficulty and ensuring broad topic diversity.
   */
  function generateSessionQuestions(subjectIds, difficulty, mode, targetWeakKeys) {
    const validSubjects = subjectIds.filter((s) => SUBJECTS[s]);
    const activeSubjects = validSubjects.length > 0 ? validSubjects : ['mathematics', 'english'];

    sessionCounter += 1;
    const historyCount = getQuizHistory().length;
    const seedStr = `${getTodaySeed()}-nsc-${activeSubjects.slice().sort().join(',')}-${difficulty}-${mode}-${historyCount}-${sessionCounter}`;
    const rng = seededRandomGenerator(seedStr);

    const picked = [];
    const pickedIds = new Set();

    function pickCandidate(pool, seenSet, allowSeen) {
      const unseen = pool.filter((q) => !pickedIds.has(q.id) && !seenSet.has(q.id));
      if (unseen.length > 0) {
        const shuffled = shuffleArray(unseen, rng);
        return shuffled[0];
      }
      if (allowSeen !== false) {
        const unpicked = pool.filter((q) => !pickedIds.has(q.id));
        if (unpicked.length > 0) {
          const shuffled = shuffleArray(unpicked, rng);
          return shuffled[0];
        }
      }
      return null;
    }

    // 1. If in weakness_drill mode, first pull unseen questions from weak subject::topic pairs, then seen if needed
    if (mode === 'weakness_drill' && Array.isArray(targetWeakKeys) && targetWeakKeys.length > 0) {
      const shuffledWeakKeys = shuffleArray(targetWeakKeys, rng);
      for (let allowSeenPass = 0; allowSeenPass <= 1 && picked.length < QUESTIONS_PER_SESSION; allowSeenPass++) {
        const allowSeen = allowSeenPass === 1;
        let pass = 0;
        while (picked.length < QUESTIONS_PER_SESSION && pass < 3) {
          for (let i = 0; i < shuffledWeakKeys.length && picked.length < QUESTIONS_PER_SESSION; i++) {
            const parts = shuffledWeakKeys[i].split('::');
            const subjId = parts[0];
            const topId = parts[1];
            const seenSet = new Set(getSeenIdsForSubject(subjId));
            const exactDiffPool = QUESTIONS.filter(
              (q) => q.subject === subjId && q.topicId === topId && q.difficulty === difficulty
            );
            let chosen = pickCandidate(exactDiffPool, seenSet, allowSeen);
            if (!chosen) {
              const anyDiffTopicPool = QUESTIONS.filter(
                (q) => q.subject === subjId && q.topicId === topId
              );
              chosen = pickCandidate(anyDiffTopicPool, seenSet, allowSeen);
            }
            if (chosen) {
              picked.push(chosen);
              pickedIds.add(chosen.id);
            }
          }
          pass += 1;
        }
      }
    }

    // 2. Round-robin across selected NSC subjects and shuffled CAPS topics at the chosen difficulty
    const subjectTopicQueues = {};
    activeSubjects.forEach((subjId) => {
      const topicIds = Object.keys(SUBJECTS[subjId].topics);
      subjectTopicQueues[subjId] = shuffleArray(topicIds, rng);
    });

    const orderedSubjects = shuffleArray(activeSubjects, rng);
    let safety = 0;

    while (picked.length < QUESTIONS_PER_SESSION && safety < 50) {
      let addedInRound = false;
      for (let s = 0; s < orderedSubjects.length && picked.length < QUESTIONS_PER_SESSION; s++) {
        const subjId = orderedSubjects[s];
        const seenSet = new Set(getSeenIdsForSubject(subjId));
        const topicQueue = subjectTopicQueues[subjId];

        let chosen = null;
        // First pass across all topics of this subject: strictly unseen at chosen difficulty
        for (let t = 0; t < topicQueue.length; t++) {
          const topId = topicQueue[t];
          const topicDiffPool = QUESTIONS.filter(
            (q) => q.subject === subjId && q.topicId === topId && q.difficulty === difficulty
          );
          const candidate = pickCandidate(topicDiffPool, seenSet, false);
          if (candidate) {
            chosen = candidate;
            topicQueue.splice(t, 1);
            topicQueue.push(topId);
            break;
          }
        }

        // Second pass: unseen across any difficulty for this subject
        if (!chosen) {
          const subjAnyPool = QUESTIONS.filter((q) => q.subject === subjId);
          chosen = pickCandidate(subjAnyPool, seenSet, false);
        }

        // Third pass: allow previously seen items at chosen difficulty if all unseen items in this subject are exhausted
        if (!chosen) {
          const subjDiffPool = QUESTIONS.filter(
            (q) => q.subject === subjId && q.difficulty === difficulty
          );
          chosen = pickCandidate(subjDiffPool, seenSet, true);
        }

        if (!chosen) {
          const subjAnyPool = QUESTIONS.filter((q) => q.subject === subjId);
          chosen = pickCandidate(subjAnyPool, seenSet, true);
        }

        if (chosen) {
          picked.push(chosen);
          pickedIds.add(chosen.id);
          addedInRound = true;
        }
      }
      if (!addedInRound) break;
      safety += 1;
    }

    // 3. Final fallback across entire CAPS bank at chosen difficulty if < 10
    if (picked.length < QUESTIONS_PER_SESSION) {
      const remainingPool = shuffleArray(
        QUESTIONS.filter((q) => q.difficulty === difficulty && !pickedIds.has(q.id)),
        rng
      );
      for (let i = 0; i < remainingPool.length && picked.length < QUESTIONS_PER_SESSION; i++) {
        picked.push(remainingPool[i]);
        pickedIds.add(remainingPool[i].id);
      }
    }

    return shuffleArray(picked, rng).slice(0, QUESTIONS_PER_SESSION);
  }

  // =========================================================================
  // 5. SCOPED STYLESHEET INJECTION (AFRIWIDGET BLACK / GOLD / WHITE PALETTE)
  // =========================================================================

  function injectQuizStyles() {
    if (document.getElementById('afriNscQuizStyles')) return;
    const style = document.createElement('style');
    style.id = 'afriNscQuizStyles';
    style.textContent = `
      .weakness-banner-card {
        margin-top: 1.5rem;
        padding: 1.25rem 1.5rem;
        background: #ffffff;
        color: #111827;
        border-radius: 0.875rem;
        border: 1px solid #e5e7eb;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      }
      @media (min-width: 640px) {
        .weakness-banner-card {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.75rem;
          gap: 1.5rem;
        }
      }
      .weakness-banner-card .w-banner-content {
        flex: 1;
      }
      .weakness-banner-card .w-banner-badge,
      .weakness-banner-card .w-banner-kicker {
        display: none;
      }
      .weakness-banner-card .w-banner-title {
        font-size: 1.0625rem;
        font-weight: 700;
        color: #111827;
        margin: 0 0 0.25rem 0;
        letter-spacing: -0.01em;
      }
      .weakness-banner-card .w-banner-desc {
        font-size: 0.875rem;
        color: #4b5563;
        line-height: 1.5;
        margin: 0;
      }
      .weakness-banner-card .w-banner-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        background: #ffffff;
        color: #000000;
        border: 1px solid #000000;
        font-weight: 700;
        font-size: 0.9375rem;
        border-radius: 0.5rem;
        padding: 0.875rem 1.5rem;
        min-height: 50px;
        cursor: pointer;
        white-space: nowrap;
        transition: background 0.15s ease, transform 0.1s ease;
        flex-shrink: 0;
      }
      .weakness-banner-card .w-banner-btn:hover {
        background: #f9fafb;
        border-color: #000000;
        color: #000000;
      }
      .weakness-banner-card .w-banner-btn:active {
        transform: scale(0.99);
      }
      .weakness-banner-card .w-banner-btn svg {
        width: 1.125rem;
        height: 1.125rem;
        stroke: #f59e0b;
        color: #f59e0b;
        flex-shrink: 0;
      }
      .weakness-banner-card .w-banner-btn:hover svg {
        stroke: #f59e0b;
        color: #f59e0b;
      }
      @media (max-width: 639px) {
        .weakness-banner-card .w-banner-btn {
          width: 100%;
        }
      }

      /* Setup Controls */
      .w-setup-grid-two {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      @media (min-width: 640px) {
        .w-setup-grid-two {
          grid-template-columns: 1fr 1.6fr;
        }
      }
      .w-setup-section {
        margin-bottom: 1.5rem;
      }
      .w-setup-label-row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
      }
      .w-setup-label {
        font-size: 0.875rem;
        font-weight: 800;
        color: #000000;
      }
      .w-setup-meta {
        font-size: 0.75rem;
        font-weight: 600;
        color: #525252;
      }
      .w-prog-note {
        font-size: 0.8125rem;
        color: #525252;
        line-height: 1.55;
        margin: -0.75rem 0 1.25rem 0;
      }
      .w-preset-bar {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 0.875rem;
      }
      .w-preset-btn {
        padding: 0.5rem 0.875rem;
        min-height: 40px;
        font-size: 0.75rem;
        font-weight: 700;
        color: #171717;
        background: #f5f5f5;
        border: 1px solid #d4d4d4;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
      }
      .w-preset-btn:hover {
        border-color: #000000;
        background: #ffffff;
      }
      .w-preset-btn.active {
        background: #000000;
        color: #facc15;
        border-color: #000000;
      }

      /* Subject Toggle Grid */
      .w-subjects-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.625rem;
      }
      @media (min-width: 640px) {
        .w-subjects-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      .w-subj-btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        padding: 0.75rem 0.875rem;
        min-height: 48px;
        background: #ffffff;
        border: 1.5px solid #d4d4d4;
        border-radius: 0.5rem;
        text-align: left;
        cursor: pointer;
        transition: border-color 0.15s ease, background 0.15s ease;
      }
      .w-subj-btn:hover {
        border-color: #000000;
        background: #fafafa;
      }
      .w-subj-btn:focus-visible,
      .w-diff-btn:focus-visible,
      .w-preset-btn:focus-visible,
      .w-option-item:focus-visible,
      .w-form-select:focus-visible {
        outline: 2px solid #000000;
        outline-offset: 2px;
      }
      .w-subj-btn.selected {
        background: #fefce8;
        border-color: #000000;
      }
      .w-subj-name {
        font-size: 0.8125rem;
        font-weight: 700;
        color: #000000;
        line-height: 1.25;
      }
      .w-subj-code {
        display: block;
        font-size: 0.6875rem;
        font-weight: 600;
        color: #737373;
        margin-top: 0.125rem;
      }
      .w-subj-check {
        width: 18px;
        height: 18px;
        border-radius: 0.25rem;
        border: 1.5px solid #a3a3a3;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: #ffffff;
        color: transparent;
      }
      .w-subj-btn.selected .w-subj-check {
        background: #000000;
        border-color: #000000;
        color: #facc15;
      }

      /* Simplified Setup View (#wIntroView) */
      #wIntroView .w-intro-top-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
      }
      #wIntroView .w-intro-heading {
        font-size: 1.125rem;
        font-weight: 800;
        color: #000000;
        margin: 0;
        letter-spacing: -0.01em;
      }
      #wIntroView .w-intro-rec {
        font-size: 0.9375rem;
        line-height: 1.5;
        color: #171717;
        background: #fafafa;
        border: 1px solid #e5e5e5;
        border-radius: 0.5rem;
        padding: 0.75rem 0.875rem;
        margin: 0 0 1rem 0;
      }
      #wIntroView .w-intro-field {
        margin-bottom: 0.875rem;
      }
      #wIntroView .w-intro-row-two {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
        margin-bottom: 0.875rem;
      }
      @media (max-width: 479px) {
        #wIntroView .w-intro-row-two {
          grid-template-columns: 1fr;
        }
      }
      #wIntroView .w-intro-label {
        display: block;
        font-size: 0.8125rem;
        font-weight: 700;
        color: #171717;
        margin-bottom: 0.35rem;
      }
      #wIntroView .w-intro-diff-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
      }
      #wIntroView .w-intro-diff-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        padding: 0.5rem 0.5rem;
        background: #ffffff;
        color: #171717;
        border: 1.5px solid #d4d4d4;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 700;
        cursor: pointer;
        transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
      }
      #wIntroView .w-intro-diff-btn:hover {
        border-color: #000000;
      }
      #wIntroView .w-intro-diff-btn.selected {
        background: #000000;
        border-color: #000000;
        color: #facc15;
      }
      #wIntroView .w-intro-start-btn {
        width: 100%;
        min-height: 48px;
        margin-top: 0.25rem;
        padding: 0.75rem 1.25rem;
        background: #facc15;
        color: #000000;
        border: 1.5px solid #facc15;
        border-radius: 0.5rem;
        font-size: 0.9375rem;
        font-weight: 800;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.15s ease, border-color 0.15s ease;
      }
      #wIntroView .w-intro-start-btn:hover {
        background: #fde047;
        border-color: #fde047;
        color: #000000;
      }

      /* Difficulty Segmented Selector */
      .w-diff-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.625rem;
      }
      @media (min-width: 640px) {
        .w-diff-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      .w-diff-btn {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        padding: 0.875rem 1rem;
        min-height: 56px;
        background: #ffffff;
        border: 1.5px solid #d4d4d4;
        border-radius: 0.5rem;
        text-align: left;
        cursor: pointer;
        transition: border-color 0.15s ease, background 0.15s ease;
      }
      .w-diff-btn:hover {
        border-color: #000000;
      }
      .w-diff-btn.selected {
        background: #000000;
        border-color: #000000;
        color: #ffffff;
      }
      .w-diff-title {
        font-size: 0.875rem;
        font-weight: 800;
        color: inherit;
        margin-bottom: 0.15rem;
      }
      .w-diff-btn.selected .w-diff-title {
        color: #facc15;
      }
      .w-diff-sub {
        font-size: 0.75rem;
        font-weight: 500;
        color: #525252;
        line-height: 1.35;
      }
      .w-diff-btn.selected .w-diff-sub {
        color: #d4d4d4;
      }

      /* Clean Unboxed Metadata Strip */
      .w-clean-meta-line {
        font-size: 0.8125rem;
        color: #525252;
        line-height: 1.6;
        margin: 1rem 0 1.5rem 0;
        padding-top: 0.875rem;
        border-top: 1px solid #e5e5e5;
      }
      .w-clean-meta-line strong {
        color: #000000;
        font-weight: 700;
      }

      /* Active Quiz Header & Immediate Learning Feedback */
      .w-quiz-meta-line {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        margin-bottom: 0.625rem;
        font-size: 0.8125rem;
        color: #525252;
      }
      .w-quiz-meta-left {
        font-weight: 700;
        color: #000000;
      }
      .w-quiz-meta-sep {
        margin: 0 0.375rem;
        color: #a3a3a3;
      }
      .w-question-kicker {
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #a16207;
        margin-bottom: 0.5rem;
        display: block;
      }

      .w-option-item.locked {
        cursor: default;
      }
      .w-option-item.locked:hover {
        background: #ffffff;
        border-color: #e5e5e5;
      }
      .w-option-item.correct-choice {
        border-color: #15803d !important;
        background: #f0fdf4 !important;
      }
      .w-option-item.correct-choice .w-option-letter {
        background: #15803d !important;
        color: #ffffff !important;
      }
      .w-option-item.wrong-choice {
        border-color: #b91c1c !important;
        background: #fef2f2 !important;
      }
      .w-option-item.wrong-choice .w-option-letter {
        background: #b91c1c !important;
        color: #ffffff !important;
      }

      .w-feedback-panel {
        margin-top: 1.25rem;
        padding: 1.125rem 1.25rem;
        border-radius: 0.625rem;
        border: 1px solid #e5e5e5;
        background: #fafafa;
      }
      .w-feedback-panel.is-correct {
        background: #f0fdf4;
        border-color: #86efac;
      }
      .w-feedback-panel.is-wrong {
        background: #fef2f2;
        border-color: #fecaca;
      }
      .w-feedback-status {
        font-size: 0.8125rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.375rem;
        display: flex;
        align-items: center;
        gap: 0.4rem;
      }
      .w-feedback-panel.is-correct .w-feedback-status {
        color: #166534;
      }
      .w-feedback-panel.is-wrong .w-feedback-status {
        color: #991b1b;
      }
      .w-feedback-correct-ans {
        font-size: 0.875rem;
        font-weight: 700;
        color: #000000;
        margin: 0 0 0.5rem 0;
      }
      .w-feedback-expl {
        font-size: 0.875rem;
        color: #262626;
        line-height: 1.6;
        margin: 0 0 0.75rem 0;
      }
      .w-feedback-concept {
        padding: 0.75rem 0.875rem;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 0.5rem;
        font-size: 0.8125rem;
        color: #171717;
        line-height: 1.55;
      }
      .w-feedback-concept strong {
        color: #a16207;
        font-weight: 800;
        text-transform: uppercase;
        font-size: 0.6875rem;
        letter-spacing: 0.05em;
        display: block;
        margin-bottom: 0.2rem;
      }

      /* Study Recommendations & Disclaimer */
      .w-recs-section {
        margin-bottom: 1.75rem;
        padding: 1.25rem 1.375rem;
        background: #fafafa;
        border: 1px solid #e5e5e5;
        border-radius: 0.75rem;
      }
      .w-recs-title {
        font-size: 1rem;
        font-weight: 800;
        color: #000000;
        margin: 0 0 0.25rem 0;
      }
      .w-recs-sub {
        font-size: 0.8125rem;
        color: #525252;
        margin: 0 0 1rem 0;
      }
      .w-recs-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .w-rec-item {
        padding: 0.875rem 1rem;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 0.5rem;
      }
      .w-rec-topic {
        font-size: 0.8125rem;
        font-weight: 800;
        color: #000000;
        margin-bottom: 0.25rem;
      }
      .w-rec-tip {
        font-size: 0.8125rem;
        color: #262626;
        line-height: 1.55;
        margin: 0;
      }
      .w-disclaimer-box {
        margin-top: 1.5rem;
        padding: 0.875rem 1rem;
        background: #fafafa;
        border: 1px solid #e5e5e5;
        border-radius: 0.5rem;
        font-size: 0.75rem;
        color: #525252;
        line-height: 1.55;
      }
      .w-disclaimer-box strong {
        color: #171717;
      }

      .w-btn-secondary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        min-height: 46px;
        background: #ffffff;
        color: #000000;
        border: 1.5px solid #000000;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.15s ease, color 0.15s ease;
      }
      .w-btn-secondary:hover {
        background: #000000;
        color: #facc15;
      }
      .w-btn-secondary:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .w-btn-gold {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.875rem 1.5rem;
        min-height: 48px;
        background: #facc15;
        color: #000000;
        border: 1.5px solid #facc15;
        border-radius: 0.5rem;
        font-size: 0.9375rem;
        font-weight: 800;
        cursor: pointer;
        transition: background 0.15s ease;
      }
      .w-btn-gold:hover {
        background: #fde047;
        border-color: #fde047;
      }
      #weaknessAssessmentSection {
        scroll-margin-top: 5rem;
        overflow-anchor: none;
      }
      #weaknessAssessmentSection * {
        overflow-anchor: none;
      }
    `;
    document.head.appendChild(style);
  }

  // =========================================================================
  // 6. UI MOUNTING, SCROLL POSITIONING & INTERACTIVE CONTROLLERS
  // =========================================================================

  function getScrollY() {
    return window.pageYOffset !== undefined
      ? window.pageYOffset
      : document.documentElement.scrollTop || 0;
  }

  function setScrollYInstant(y) {
    const htmlEl = document.documentElement;
    const prevBehavior = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = 'auto';
    window.scrollTo(0, Math.max(0, Math.round(y)));
    htmlEl.style.scrollBehavior = prevBehavior;
  }

  function smoothScrollToY(y) {
    const target = Math.max(0, Math.round(y));
    if (Math.abs(target - getScrollY()) <= 4) return;
    try {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } catch (e) {
      window.scrollTo(0, target);
    }
  }

  function getStickyHeaderOffset() {
    const navInner = document.querySelector('.site-nav .nav-inner');
    const nav = document.querySelector('.site-nav');
    let navH = 64;
    const el = navInner || nav;
    if (el && typeof el.getBoundingClientRect === 'function') {
      const h = el.getBoundingClientRect().height;
      if (h > 0) navH = h;
    }
    const pad = window.innerWidth && window.innerWidth < 640 ? 12 : 16;
    return Math.round(navH + pad);
  }

  function blurActiveQuizControl() {
    const active = document.activeElement;
    const sec = document.getElementById('weaknessAssessmentSection');
    if (active && sec && sec.contains(active) && typeof active.blur === 'function') {
      active.blur();
    }
  }

  function scrollWeaknessSectionIntoView(targetEl) {
    const el = targetEl || document.getElementById('weaknessAssessmentSection');
    if (!el || typeof el.getBoundingClientRect !== 'function') return;
    const card = el.querySelector('.weakness-card') || el;
    const rect = card.getBoundingClientRect();
    const targetY = getScrollY() + rect.top - getStickyHeaderOffset();
    smoothScrollToY(targetY);
  }

  function ensureQuizQuestionVisible() {
    const section = document.getElementById('weaknessAssessmentSection');
    const quizView = document.getElementById('wQuizView');
    if (!section || !quizView || quizView.style.display === 'none') return;

    const card = section.querySelector('.weakness-card') || quizView;
    const questionBox = quizView.querySelector('.w-question-box') || quizView;
    const optionsBox = document.getElementById('wOptionsList') || questionBox;

    const offset = getStickyHeaderOffset();
    const viewportH = window.innerHeight || document.documentElement.clientHeight || 700;
    const curScrollY = getScrollY();

    const cardRect = card.getBoundingClientRect();
    const quizRect = quizView.getBoundingClientRect();
    const qBoxRect = questionBox.getBoundingClientRect();
    const optRect = optionsBox.getBoundingClientRect();

    const topClear = quizRect.top >= offset - 8;
    const nearTop = qBoxRect.top <= Math.max(offset + 140, Math.round(viewportH * 0.34));
    const optionsVisible = optRect.bottom <= viewportH - 16;

    if (topClear && nearTop && optionsVisible) {
      return;
    }

    const cardDocTop = curScrollY + cardRect.top;
    const quizDocTop = curScrollY + quizRect.top;
    const qBoxDocTop = curScrollY + qBoxRect.top;
    const optDocBottom = curScrollY + optRect.bottom;

    let targetY = cardDocTop - offset;
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
    const viewportH = window.innerHeight || document.documentElement.clientHeight || 700;
    const rect = feedbackEl.getBoundingClientRect();
    if (rect.top > viewportH - 80) {
      const nudge = Math.min(rect.top - (viewportH - 140), 140);
      if (nudge > 8) {
        smoothScrollToY(getScrollY() + nudge);
      }
    }
  }

  function initWeaknessUI() {
    const calcContainer = document.querySelector('.calc-wrap .container-narrow');
    if (!calcContainer) return;

    injectQuizStyles();

    // 1. Add secondary trigger button next to "Calculate APS"
    const actionRow = document.querySelector('#apsForm .action-row');
    if (actionRow && !document.getElementById('findWeaknessesBtn')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'findWeaknessesBtn';
      btn.className = 'btn-find-weakness';
      btn.innerHTML = `
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
        </svg>
        <span>Daily NSC Subject Quiz</span>
      `;
      btn.addEventListener('click', () => openDiagnosticSection('daily_quiz'));
      actionRow.appendChild(btn);
    }

    // 2. Add result-card callout banner inside #results AFTER .breakdown-panel
    const resultsBox = document.getElementById('results');
    if (resultsBox && !document.getElementById('weaknessCalloutBanner')) {
      const banner = document.createElement('div');
      banner.id = 'weaknessCalloutBanner';
      banner.className = 'weakness-banner-card';
      banner.innerHTML = `
        <div class="w-banner-content">
          <h3 class="w-banner-title">Diagnose NSC Subject Weaknesses</h3>
          <p class="w-banner-desc">Take a daily 10-question CAPS curriculum quiz across your Matric subjects at Easy, Medium, or Difficult level with instant learning feedback.</p>
        </div>
        <button type="button" class="btn-secondary btn-find-weakness w-banner-btn" id="bannerStartWeaknessBtn">
          <svg width="18" height="18" fill="none" stroke="#f59e0b" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          <span>Find My Weaknesses</span>
        </button>
      `;

      const aiSection = resultsBox.querySelector('.ai-section');
      if (aiSection) {
        resultsBox.insertBefore(banner, aiSection);
      } else {
        resultsBox.appendChild(banner);
      }

      if (typeof window.afriEnsureResultSectionsOrder === 'function') {
        window.afriEnsureResultSectionsOrder(resultsBox);
      }

      const startBannerBtn = document.getElementById('bannerStartWeaknessBtn');
      if (startBannerBtn) {
        startBannerBtn.addEventListener('click', () => openDiagnosticSection('daily_quiz'));
      }
    }

    // 3. Create main assessment container inside .calc-wrap .container-narrow
    if (document.getElementById('weaknessAssessmentSection')) return;

    const gradeOptionsHtml = Object.values(NSC_GRADES).map(
      (g) => `<option value="${escapeHtml(g.id)}">${escapeHtml(g.shortLabel)}</option>`
    ).join('');

    const compactFacultyLabels = {
      custom: 'Single Subject',
      medicine: 'Medicine & Health',
      engineering: 'Engineering',
      computing: 'Computing & IT',
      commerce_ca: 'Commerce (CA)',
      commerce_gen: 'Commerce (General)',
      science_bsc: 'BSc Sciences',
      law: 'Law (LLB)',
      education: 'Education (BEd)',
      humanities: 'Humanities & Arts'
    };
    const programmeOrder = ['custom', 'medicine', 'engineering', 'computing', 'commerce_ca', 'commerce_gen', 'science_bsc', 'law', 'education', 'humanities'];
    const programmeOptionsHtml = programmeOrder.map((pId) => {
      const p = SA_PROGRAMMES[pId];
      if (!p) return '';
      return `<option value="${escapeHtml(p.id)}">${escapeHtml(compactFacultyLabels[p.id] || p.label)}</option>`;
    }).join('');

    const section = document.createElement('div');
    section.id = 'weaknessAssessmentSection';
    section.className = 'weakness-section';
    section.style.display = 'none';
    section.setAttribute('aria-live', 'polite');

    section.innerHTML = `
      <div class="weakness-card">
        <!-- VIEW 1: SETUP & SUBJECT SELECTION -->
        <div id="wIntroView" class="w-view">
          <div class="w-intro-top-bar">
            <h3 class="w-intro-heading">Practice Quiz</h3>
            <button type="button" id="wCloseBtn" class="w-close-btn" aria-label="Close quiz">&times;</button>
          </div>

          <p id="wContextBanner" class="w-intro-rec"></p>

          <div class="w-intro-field">
            <label for="wSubjectSelect" class="w-intro-label">Subject</label>
            <select id="wSubjectSelect" class="w-form-select"></select>
          </div>

          <div class="w-intro-row-two">
            <div>
              <label for="wGradeSelect" class="w-intro-label">Grade</label>
              <select id="wGradeSelect" class="w-form-select">
                ${gradeOptionsHtml}
              </select>
            </div>
            <div>
              <label for="wProgrammeSelect" class="w-intro-label">Faculty (Optional)</label>
              <select id="wProgrammeSelect" class="w-form-select">
                ${programmeOptionsHtml}
              </select>
            </div>
          </div>

          <div class="w-intro-field">
            <span class="w-intro-label" id="wDiffLabel">Difficulty</span>
            <div id="wDifficultyGrid" class="w-intro-diff-grid" role="radiogroup" aria-labelledby="wDiffLabel">
              <button type="button" class="w-intro-diff-btn" data-diff="easy" role="radio" aria-checked="false">Easy</button>
              <button type="button" class="w-intro-diff-btn selected" data-diff="medium" role="radio" aria-checked="true">Medium</button>
              <button type="button" class="w-intro-diff-btn" data-diff="difficult" role="radio" aria-checked="false">Difficult</button>
            </div>
          </div>

          <button type="button" id="wBeginQuizBtn" class="w-intro-start-btn">Start Quiz</button>
        </div>

        <!-- VIEW 2: ACTIVE 10-QUESTION QUIZ WITH IMMEDIATE LEARNING FEEDBACK -->
        <div id="wQuizView" class="w-view" style="display: none;">
          <div class="w-quiz-top">
            <div class="w-quiz-meta-line">
              <div class="w-quiz-meta-left" id="wQuizModeLabel">Daily NSC Quiz</div>
              <div class="w-quiz-counter" id="wQuizCounter">Question 1 of 10 · Score: 0 / 0</div>
            </div>
            <div class="w-progress-track" aria-hidden="true">
              <div id="wProgressBar" class="w-progress-fill" style="width: 10%;"></div>
            </div>
          </div>

          <div class="w-question-box">
            <span id="wQuestionKicker" class="w-question-kicker">Mathematics · Calculus</span>
            <h4 id="wQuestionPrompt" class="w-question-title">Question text</h4>
            <div id="wOptionsList" class="w-options-grid" role="radiogroup" aria-labelledby="wQuestionPrompt"></div>
          </div>

          <div id="wValidationAlert" class="w-validation-alert" style="display: none;">
            Select one answer option above, then click Check Answer to view the explanation.
          </div>

          <div id="wImmediateFeedback" style="display: none;"></div>

          <div class="w-quiz-nav">
            <button type="button" id="wPrevBtn" class="w-btn-secondary">
              Previous
            </button>
            <div style="display:flex; gap:0.625rem; flex-wrap:wrap; justify-content:flex-end;">
              <button type="button" id="wCheckBtn" class="w-btn-gold">
                Check Answer
              </button>
              <button type="button" id="wNextBtn" class="w-btn-gold" style="display: none;">
                <span>Next Question</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- VIEW 3: DIAGNOSTIC RESULTS, STRENGTHS, WEAKNESSES & STUDY PLAN -->
        <div id="wResultsView" class="w-view" style="display: none;">
          <div class="w-results-header">
            <span class="w-eyebrow">NSC CAPS Subject Diagnostic Summary</span>
            <div class="w-results-score-wrap">
              <div class="w-results-score-big" id="wScorePercent">0%</div>
              <div class="w-score-meta">
                <h3 class="w-score-headline" id="wScoreHeadline">Session Complete</h3>
                <p class="w-score-fraction" id="wScoreFraction">0 out of 10 correct</p>
              </div>
            </div>
          </div>

          <div id="wComparisonBox" class="w-comparison-card"></div>

          <div class="w-analysis-grid">
            <div class="w-analysis-card w-card-strong">
              <div class="w-card-head">
                <svg width="18" height="18" fill="none" stroke="#16a34a" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h4>Demonstrated Strengths</h4>
              </div>
              <div id="wStrengthsList" class="w-analysis-list"></div>
            </div>

            <div class="w-analysis-card w-card-weak">
              <div class="w-card-head">
                <svg width="18" height="18" fill="none" stroke="#dc2626" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <h4>Topics Needing Improvement</h4>
              </div>
              <div id="wWeaknessesList" class="w-analysis-list"></div>
            </div>
          </div>

          <div id="wStudyRecsSection" class="w-recs-section">
            <h4 class="w-recs-title">Specific NSC CAPS Study Recommendations</h4>
            <p class="w-recs-sub" id="wStudyRecsSub">Targeted revision steps based on the CAPS syllabus topics tested in this session.</p>
            <div id="wStudyRecsList" class="w-recs-list"></div>
          </div>

          <div id="wPracticeWeakWrap" class="w-practice-banner" style="display: none;">
            <div class="w-practice-banner-text">
              <h4>Drill Your Weak Topics Now</h4>
              <p>Start a focused 10-question session targeting the CAPS topics you missed, using fresh unseen questions first.</p>
            </div>
            <button type="button" id="wPractiseWeakBtn" class="w-practice-btn">
              <span>Practise Weak Topics</span>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>

          <div class="w-review-section">
            <div class="w-review-head">
              <h4 class="w-review-title">Full 10-Question Review &amp; Concept Notes</h4>
              <span class="w-review-sub">Review every question, verified CAPS answer, and underlying principle</span>
            </div>
            <div id="wReviewList" class="w-review-list"></div>
          </div>

          <div id="wHistorySection" class="w-history-section">
            <div class="w-history-head">
              <h4 class="w-history-title">Recent Quiz Sessions (Saved Locally)</h4>
              <button type="button" id="wClearHistoryBtn" class="w-clear-link">Clear History</button>
            </div>
            <div id="wHistoryList" class="w-history-list"></div>
          </div>

          <div class="w-results-footer">
            <button type="button" id="wRetakeFreshBtn" class="w-btn-gold">
              New Daily Quiz (10 Fresh Questions)
            </button>
            <button type="button" id="wChangeSetupBtn" class="w-btn-secondary">
              Change Subjects / Difficulty
            </button>
            <button type="button" id="wDoneCloseBtn" class="w-btn-secondary">
              Close Quiz
            </button>
          </div>

          <div class="w-disclaimer-box">
            <strong>Disclaimer:</strong> Results from this CAPS learning quiz measure conceptual mastery on a 10-question sample and do not constitute official DBE/IEB examination grading or university admissions advice. Check official university admission booklets for exact APS rules, NBT requirements, and subject minimums.
          </div>
        </div>
      </div>
    `;

    calcContainer.appendChild(section);

    renderSubjectButtons();
    updateDifficultyUI();
    bindDiagnosticEvents();
  }

  function renderSubjectButtons() {
    const subjSelect = document.getElementById('wSubjectSelect');
    if (!subjSelect) return;

    const prog = SA_PROGRAMMES[currentSession.programmeId];
    const hasFacultyMix = currentSession.programmeId && currentSession.programmeId !== 'custom' && prog && Array.isArray(prog.subjects);

    let html = '';
    if (hasFacultyMix) {
      const shortList = prog.subjects.map((id) => (SUBJECTS[id] ? SUBJECTS[id].shortName : id)).join(', ');
      html += `<option value="programme_mix">All Faculty Subjects (${escapeHtml(shortList)})</option>`;
    }
    html += SUBJECT_ORDER.map((subjId) => {
      const s = SUBJECTS[subjId];
      return `<option value="${escapeHtml(subjId)}">${escapeHtml(s.name)}</option>`;
    }).join('');

    subjSelect.innerHTML = html;

    if (hasFacultyMix && currentSession.selectedSubjects.length > 1) {
      subjSelect.value = 'programme_mix';
    } else if (currentSession.selectedSubjects.length > 0 && SUBJECTS[currentSession.selectedSubjects[0]]) {
      subjSelect.value = currentSession.selectedSubjects[0];
    } else {
      subjSelect.value = 'mathematics';
      currentSession.selectedSubjects = ['mathematics'];
    }
  }

  function updateProgrammeNote() {}

  function updateDifficultyUI() {
    document.querySelectorAll('#wDifficultyGrid [data-diff]').forEach((btn) => {
      const d = btn.getAttribute('data-diff');
      const isSelected = d === currentSession.difficulty;
      btn.classList.toggle('selected', isSelected);
      btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });
  }

  function bindDiagnosticEvents() {
    const closeBtn = document.getElementById('wCloseBtn');
    const doneCloseBtn = document.getElementById('wDoneCloseBtn');
    const beginBtn = document.getElementById('wBeginQuizBtn');
    const prevBtn = document.getElementById('wPrevBtn');
    const checkBtn = document.getElementById('wCheckBtn');
    const nextBtn = document.getElementById('wNextBtn');
    const retakeFreshBtn = document.getElementById('wRetakeFreshBtn');
    const changeSetupBtn = document.getElementById('wChangeSetupBtn');
    const practiseWeakBtn = document.getElementById('wPractiseWeakBtn');
    const clearHistBtn = document.getElementById('wClearHistoryBtn');
    const gradeSelect = document.getElementById('wGradeSelect');
    const progSelect = document.getElementById('wProgrammeSelect');
    const subjSelect = document.getElementById('wSubjectSelect');

    if (closeBtn) closeBtn.addEventListener('click', closeDiagnosticSection);
    if (doneCloseBtn) doneCloseBtn.addEventListener('click', closeDiagnosticSection);

    if (gradeSelect) {
      gradeSelect.addEventListener('change', () => {
        currentSession.gradeId = gradeSelect.value || 'grade12';
      });
    }

    if (progSelect) {
      progSelect.addEventListener('change', () => {
        currentSession.userCustomizedSubject = true;
        const val = progSelect.value || 'custom';
        currentSession.programmeId = val;
        const chosen = SA_PROGRAMMES[val];
        if (val !== 'custom' && chosen && Array.isArray(chosen.subjects) && chosen.subjects.length > 0) {
          currentSession.selectedSubjects = chosen.subjects.slice();
        } else {
          const single = (subjSelect && SUBJECTS[subjSelect.value]) ? subjSelect.value : 'mathematics';
          currentSession.selectedSubjects = [single];
        }
        renderSubjectButtons();
      });
    }

    if (subjSelect) {
      subjSelect.addEventListener('change', () => {
        currentSession.userCustomizedSubject = true;
        const val = subjSelect.value;
        if (val === 'programme_mix') {
          const chosen = SA_PROGRAMMES[currentSession.programmeId];
          if (chosen && Array.isArray(chosen.subjects) && chosen.subjects.length > 0) {
            currentSession.selectedSubjects = chosen.subjects.slice();
          }
        } else if (SUBJECTS[val]) {
          currentSession.selectedSubjects = [val];
        }
      });
    }

    document.querySelectorAll('#wDifficultyGrid [data-diff]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const diff = btn.getAttribute('data-diff');
        if (diff && DIFFICULTY_LABELS[diff]) {
          currentSession.difficulty = diff;
          updateDifficultyUI();
        }
      });
    });

    if (beginBtn) {
      beginBtn.addEventListener('click', () => {
        if (!currentSession.selectedSubjects || currentSession.selectedSubjects.length === 0) {
          currentSession.selectedSubjects = ['mathematics'];
        }
        startQuiz('daily_quiz', []);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentSession.currentIndex > 0) {
          blurActiveQuizControl();
          currentSession.currentIndex -= 1;
          renderCurrentQuestion();
          ensureQuizQuestionVisible();
        }
      });
    }

    if (checkBtn) {
      checkBtn.addEventListener('click', handleCheckAnswer);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', handleNextOrFinish);
    }

    if (retakeFreshBtn) {
      retakeFreshBtn.addEventListener('click', () => {
        startQuiz('daily_quiz', []);
      });
    }

    if (changeSetupBtn) {
      changeSetupBtn.addEventListener('click', () => {
        openDiagnosticSection('daily_quiz');
      });
    }

    if (practiseWeakBtn) {
      practiseWeakBtn.addEventListener('click', () => {
        const history = getQuizHistory();
        const latest = history[0];
        if (latest && Array.isArray(latest.weakKeys) && latest.weakKeys.length > 0) {
          startQuiz('weakness_drill', latest.weakKeys);
        } else {
          startQuiz('daily_quiz', []);
        }
      });
    }

    if (clearHistBtn) {
      clearHistBtn.addEventListener('click', () => {
        if (!clearConfirmArmed) {
          clearConfirmArmed = true;
          clearHistBtn.textContent = 'Click again to confirm reset';
          setTimeout(() => {
            if (clearConfirmArmed) {
              clearConfirmArmed = false;
              if (clearHistBtn) clearHistBtn.textContent = 'Clear History';
            }
          }, 4000);
          return;
        }
        clearConfirmArmed = false;
        clearHistBtn.textContent = 'Clear History';
        clearQuizHistory();
        renderHistoryList();
        renderIntroHistoryPreview();
        const compBox = document.getElementById('wComparisonBox');
        if (compBox) {
          compBox.innerHTML = `<div class="w-comp-wrap neutral"><div class="w-comp-text"><p>Saved session history and seen-question log cleared from this browser.</p></div></div>`;
        }
      });
    }
  }

  function openDiagnosticSection(mode) {
    const section = document.getElementById('weaknessAssessmentSection');
    if (!section) return;

    section.style.display = 'block';
    showView('wIntroView');

    const ctx = detectCalculatorContext();
    const banner = document.getElementById('wContextBanner');
    if (banner) {
      banner.textContent = ctx.message;
    }

    if (ctx.hasResult && !currentSession.userCustomizedSubject) {
      if (ctx.recommendedSubject && SUBJECTS[ctx.recommendedSubject]) {
        currentSession.programmeId = 'custom';
        currentSession.selectedSubjects = [ctx.recommendedSubject];
        const progSelect = document.getElementById('wProgrammeSelect');
        if (progSelect) progSelect.value = 'custom';
      }
      if (ctx.recommendedDifficulty && DIFFICULTY_LABELS[ctx.recommendedDifficulty]) {
        currentSession.difficulty = ctx.recommendedDifficulty;
      }
    }

    renderSubjectButtons();
    updateDifficultyUI();

    if (mode === 'scroll' || mode === 'daily_quiz') {
      blurActiveQuizControl();
      scrollWeaknessSectionIntoView(section);
    }
  }

  function closeDiagnosticSection() {
    const section = document.getElementById('weaknessAssessmentSection');
    if (section) {
      section.style.display = 'none';
    }
  }

  function showView(viewId) {
    ['wIntroView', 'wQuizView', 'wResultsView'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = id === viewId ? 'block' : 'none';
    });
  }

  function renderIntroHistoryPreview() {
    const box = document.getElementById('wHistoryPreview');
    if (!box) return;
    const history = getQuizHistory();
    if (history.length === 0) {
      box.innerHTML = '';
      return;
    }
    const last = history[0];
    const d = new Date(last.timestamp);
    const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const subjSummary = Array.isArray(last.subjects)
      ? last.subjects.map((id) => (SUBJECTS[id] ? SUBJECTS[id].shortName : id)).join(', ')
      : 'Mixed NSC';
    box.innerHTML = `
      <div class="w-hist-mini-banner">
        <span class="w-mini-label">Previous Session:</span>
        <strong>${last.score}/${last.total} (${last.percentage}%)</strong>
        <span class="w-mini-date">· ${escapeHtml(DIFFICULTY_LABELS[last.difficulty] || 'Medium')} · ${escapeHtml(subjSummary)} · ${escapeHtml(dateStr)}</span>
      </div>
    `;
  }

  function startQuiz(mode, weakKeys) {
    const questions = generateSessionQuestions(
      currentSession.selectedSubjects,
      currentSession.difficulty,
      mode,
      weakKeys
    );

    currentSession.mode = mode;
    currentSession.targetWeakKeys = weakKeys || [];
    currentSession.questions = questions;
    currentSession.currentIndex = 0;
    currentSession.userAnswers = {};

    blurActiveQuizControl();
    showView('wQuizView');
    renderCurrentQuestion();

    const section = document.getElementById('weaknessAssessmentSection');
    if (section) scrollWeaknessSectionIntoView(section);
  }

  function getRunningScore() {
    let confirmedCount = 0;
    let correctCount = 0;
    currentSession.questions.forEach((q, idx) => {
      const entry = currentSession.userAnswers[idx];
      if (entry && entry.confirmed) {
        confirmedCount += 1;
        if (entry.selectedIndex === q.correctIndex) {
          correctCount += 1;
        }
      }
    });
    return { confirmedCount, correctCount };
  }

  function renderCurrentQuestion() {
    const idx = currentSession.currentIndex;
    const total = currentSession.questions.length;
    const q = currentSession.questions[idx];
    if (!q) return;

    const savedScrollY = getScrollY();

    const answerState = currentSession.userAnswers[idx] || { selectedIndex: undefined, confirmed: false };
    const isConfirmed = !!answerState.confirmed;
    const selectedIdx = answerState.selectedIndex;

    const modeLabel = document.getElementById('wQuizModeLabel');
    const counter = document.getElementById('wQuizCounter');
    const bar = document.getElementById('wProgressBar');
    const kickerEl = document.getElementById('wQuestionKicker');
    const promptEl = document.getElementById('wQuestionPrompt');
    const optionsEl = document.getElementById('wOptionsList');
    const prevBtn = document.getElementById('wPrevBtn');
    const checkBtn = document.getElementById('wCheckBtn');
    const nextBtn = document.getElementById('wNextBtn');
    const alertEl = document.getElementById('wValidationAlert');
    const feedbackEl = document.getElementById('wImmediateFeedback');

    if (alertEl) alertEl.style.display = 'none';

    const subjMeta = SUBJECTS[q.subject] || { name: q.subject, topics: {} };
    const topicMeta = subjMeta.topics[q.topicId] || { name: q.topicId };
    const diffLabel = DIFFICULTY_LABELS[q.difficulty] || 'Medium';
    const gradeLabel = getGradeLabel(currentSession.gradeId);

    if (modeLabel) {
      const baseTitle = currentSession.mode === 'weakness_drill' ? 'Targeted Weak-Topic Drill' : 'Daily NSC CAPS Quiz';
      modeLabel.innerHTML = `${escapeHtml(baseTitle)}<span class="w-quiz-meta-sep">·</span><span>${escapeHtml(gradeLabel)}</span><span class="w-quiz-meta-sep">·</span><span>${escapeHtml(diffLabel)}</span>`;
    }

    const tally = getRunningScore();
    if (counter) {
      counter.textContent = `Question ${idx + 1} of ${total} · Score: ${tally.correctCount} / ${tally.confirmedCount}`;
    }

    if (bar) {
      bar.style.width = `${Math.round(((idx + 1) / total) * 100)}%`;
    }

    if (kickerEl) {
      kickerEl.textContent = `${subjMeta.name} · ${topicMeta.name}`;
    }

    if (promptEl) {
      promptEl.textContent = q.question;
    }

    if (optionsEl) {
      optionsEl.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];

      q.options.forEach((optText, optIndex) => {
        let extraClass = '';
        if (isConfirmed) {
          extraClass = 'locked';
          if (optIndex === q.correctIndex) {
            extraClass += ' correct-choice';
          } else if (optIndex === selectedIdx && selectedIdx !== q.correctIndex) {
            extraClass += ' wrong-choice';
          }
        } else if (selectedIdx === optIndex) {
          extraClass = 'selected';
        }

        const item = document.createElement('div');
        item.className = `w-option-item ${extraClass}`.trim();
        item.setAttribute('role', 'radio');
        item.setAttribute('aria-checked', selectedIdx === optIndex ? 'true' : 'false');
        item.tabIndex = isConfirmed ? -1 : 0;

        item.innerHTML = `
          <span class="w-option-letter">${letters[optIndex]}</span>
          <span class="w-option-text">${escapeHtml(optText)}</span>
        `;

        if (!isConfirmed) {
          const selectHandler = (fromKeyboard) => {
            currentSession.userAnswers[idx] = {
              selectedIndex: optIndex,
              confirmed: false
            };
            if (alertEl) alertEl.style.display = 'none';
            renderCurrentQuestion();
            if (fromKeyboard && optionsEl) {
              const refreshed = optionsEl.children[optIndex];
              if (refreshed && typeof refreshed.focus === 'function') {
                refreshed.focus({ preventScroll: true });
              }
            }
          };

          item.addEventListener('click', () => selectHandler(false));
          item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              selectHandler(true);
            }
          });
        }

        optionsEl.appendChild(item);
      });
    }

    // Immediate post-answer explanation & CAPS concept teaching
    if (feedbackEl) {
      if (isConfirmed) {
        const isRight = selectedIdx === q.correctIndex;
        const letters = ['A', 'B', 'C', 'D'];
        const correctLetter = letters[q.correctIndex] || '';
        const correctText = q.options[q.correctIndex] || '';

        feedbackEl.style.display = 'block';
        feedbackEl.innerHTML = `
          <div class="w-feedback-panel ${isRight ? 'is-correct' : 'is-wrong'}">
            <div class="w-feedback-status">
              ${isRight ? 'Correct Answer' : 'Incorrect — Review the CAPS Concept Below'}
            </div>
            <p class="w-feedback-correct-ans">
              Verified Answer: ${escapeHtml(correctLetter)}. ${escapeHtml(correctText)}
            </p>
            <p class="w-feedback-expl">
              <strong>Why:</strong> ${escapeHtml(q.explanation)}
            </p>
            <div class="w-feedback-concept">
              <strong>NSC CAPS Concept Takeaway</strong>
              ${escapeHtml(q.concept)}
            </div>
          </div>
        `;
      } else {
        feedbackEl.style.display = 'none';
        feedbackEl.innerHTML = '';
      }
    }

    if (prevBtn) {
      prevBtn.disabled = idx === 0;
      prevBtn.style.visibility = idx === 0 ? 'hidden' : 'visible';
    }

    if (checkBtn && nextBtn) {
      if (isConfirmed) {
        checkBtn.style.display = 'none';
        nextBtn.style.display = 'inline-flex';
        if (idx === total - 1) {
          nextBtn.innerHTML = `
            <span>View Quiz Results</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
          `;
        } else {
          nextBtn.innerHTML = `
            <span>Next Question</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
            </svg>
          `;
        }
      } else {
        checkBtn.style.display = 'inline-flex';
        nextBtn.style.display = 'none';
      }
    }

    if (Math.abs(getScrollY() - savedScrollY) > 1) {
      setScrollYInstant(savedScrollY);
    }
  }

  function handleCheckAnswer() {
    const idx = currentSession.currentIndex;
    const entry = currentSession.userAnswers[idx];
    const alertEl = document.getElementById('wValidationAlert');

    if (!entry || entry.selectedIndex === undefined) {
      if (alertEl) alertEl.style.display = 'block';
      return;
    }

    blurActiveQuizControl();
    currentSession.userAnswers[idx] = {
      selectedIndex: entry.selectedIndex,
      confirmed: true
    };

    renderCurrentQuestion();
    revealFeedbackIfNeeded(document.getElementById('wImmediateFeedback'));
  }

  function handleNextOrFinish() {
    const idx = currentSession.currentIndex;
    const total = currentSession.questions.length;
    const entry = currentSession.userAnswers[idx];

    if (!entry || !entry.confirmed) {
      handleCheckAnswer();
      return;
    }

    blurActiveQuizControl();
    if (idx < total - 1) {
      currentSession.currentIndex += 1;
      renderCurrentQuestion();
      ensureQuizQuestionVisible();
    } else {
      finalizeAndRenderResults();
    }
  }

  // =========================================================================
  // 7. DIAGNOSTIC SCORING, TOPIC STRENGTHS/WEAKNESSES & STUDY RECOMMENDATIONS
  // =========================================================================

  function finalizeAndRenderResults() {
    const questions = currentSession.questions;
    const total = questions.length;
    let correctCount = 0;

    // Group performance by subject::topicId
    const topicStats = {};

    questions.forEach((q, idx) => {
      const entry = currentSession.userAnswers[idx];
      const userChoice = entry ? entry.selectedIndex : -1;
      const isCorrect = userChoice === q.correctIndex;
      if (isCorrect) correctCount += 1;

      const key = `${q.subject}::${q.topicId}`;
      const subjMeta = SUBJECTS[q.subject] || { name: q.subject, shortName: q.subject, topics: {} };
      const topMeta = subjMeta.topics[q.topicId] || { name: q.topicId, studyTip: '' };

      if (!topicStats[key]) {
        topicStats[key] = {
          key,
          subjectId: q.subject,
          subjectLabel: subjMeta.name,
          subjectShort: subjMeta.shortName,
          topicId: q.topicId,
          topicLabel: topMeta.name,
          studyTip: topMeta.studyTip || q.concept,
          correct: 0,
          total: 0
        };
      }
      topicStats[key].total += 1;
      if (isCorrect) topicStats[key].correct += 1;
    });

    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    const strongTopics = [];
    const weakTopics = [];

    Object.values(topicStats).forEach((stat) => {
      const ratio = stat.correct / stat.total;
      if (ratio >= 0.75) {
        strongTopics.push(stat);
      } else {
        weakTopics.push(stat);
      }
    });

    weakTopics.sort((a, b) => (a.correct / a.total) - (b.correct / b.total));
    strongTopics.sort((a, b) => (b.correct / b.total) - (a.correct / a.total));

    const previousHistory = getQuizHistory();
    const lastAttempt = previousHistory.length > 0 ? previousHistory[0] : null;

    // Persist seen questions so subsequent sessions serve fresh CAPS questions
    markQuestionsSeen(questions);

    const attemptRecord = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      gradeId: currentSession.gradeId,
      mode: currentSession.mode,
      difficulty: currentSession.difficulty,
      subjects: currentSession.selectedSubjects.slice(),
      score: correctCount,
      total,
      percentage,
      weakKeys: weakTopics.map((w) => w.key),
      weakLabels: weakTopics.map((w) => `${w.subjectShort}: ${w.topicLabel}`),
      strongLabels: strongTopics.map((s) => `${s.subjectShort}: ${s.topicLabel}`)
    };

    saveQuizAttempt(attemptRecord);

    // Populate Results Header
    const scorePctEl = document.getElementById('wScorePercent');
    const scoreHeadEl = document.getElementById('wScoreHeadline');
    const scoreFracEl = document.getElementById('wScoreFraction');

    if (scorePctEl) scorePctEl.textContent = `${percentage}%`;

    let headline = 'NSC Level 7 Distinction Mastery';
    if (percentage < 50) {
      headline = 'Foundational CAPS Gaps Identified — Focus on Core Concepts';
    } else if (percentage < 70) {
      headline = 'Solid NSC Level 4–5 Base — Ready to Push for 70%+';
    } else if (percentage < 80) {
      headline = 'Strong NSC Level 6 (Meritorious) Command';
    }
    if (scoreHeadEl) scoreHeadEl.textContent = headline;

    const subjNames = currentSession.selectedSubjects
      .map((id) => (SUBJECTS[id] ? SUBJECTS[id].shortName : id))
      .join(', ');
    const gradeLabel = getGradeLabel(currentSession.gradeId);

    if (scoreFracEl) {
      scoreFracEl.textContent = `${correctCount} / ${total} Correct · ${gradeLabel} · ${DIFFICULTY_LABELS[currentSession.difficulty]} · ${subjNames}`;
    }

    renderComparisonBox(attemptRecord, lastAttempt);

    // Render Strengths & Weaknesses
    const strengthsEl = document.getElementById('wStrengthsList');
    const weaknessesEl = document.getElementById('wWeaknessesList');

    if (strengthsEl) {
      if (strongTopics.length === 0) {
        strengthsEl.innerHTML = `<div class="w-empty-note">No topic reached 75%+ in this round. Read the CAPS concept notes below and drill the weak topics.</div>`;
      } else {
        strengthsEl.innerHTML = strongTopics
          .map(
            (t) => `
          <div class="w-topic-badge-row strong">
            <span class="w-topic-name">${escapeHtml(t.subjectShort)} · ${escapeHtml(t.topicLabel)}</span>
            <span class="w-topic-score">${t.correct}/${t.total}</span>
          </div>
        `
          )
          .join('');
      }
    }

    if (weaknessesEl) {
      if (weakTopics.length === 0) {
        weaknessesEl.innerHTML = `<div class="w-empty-note green">Zero weak topics in this 10-question session. Step up to Difficult or add another NSC subject.</div>`;
      } else {
        weaknessesEl.innerHTML = weakTopics
          .map(
            (t) => `
          <div class="w-topic-badge-row weak">
            <span class="w-topic-name">${escapeHtml(t.subjectShort)} · ${escapeHtml(t.topicLabel)}</span>
            <span class="w-topic-score">${t.correct}/${t.total}</span>
          </div>
        `
          )
          .join('');
      }
    }

    // Render Specific NSC CAPS Study Recommendations
    const recsListEl = document.getElementById('wStudyRecsList');
    const recsSubEl = document.getElementById('wStudyRecsSub');
    if (recsListEl) {
      if (weakTopics.length > 0) {
        if (recsSubEl) {
          recsSubEl.textContent = 'Prioritize these CAPS syllabus revision actions before your next practice session to raise your subject levels and APS:';
        }
        recsListEl.innerHTML = weakTopics
          .map(
            (t) => `
          <div class="w-rec-item">
            <div class="w-rec-topic">${escapeHtml(t.subjectLabel)} — ${escapeHtml(t.topicLabel)} (${t.correct}/${t.total} correct)</div>
            <p class="w-rec-tip">${escapeHtml(t.studyTip)}</p>
          </div>
        `
          )
          .join('');
      } else {
        if (recsSubEl) {
          recsSubEl.textContent = 'You scored cleanly across every tested CAPS topic. To stretch toward an 80%+ Level 7 distinction:';
        }
        const nextDiff =
          currentSession.difficulty === 'easy'
            ? 'Medium'
            : currentSession.difficulty === 'medium'
            ? 'Difficult'
            : 'Difficult across additional NSC subjects';
        recsListEl.innerHTML = strongTopics
          .slice(0, 3)
          .map(
            (t) => `
          <div class="w-rec-item">
            <div class="w-rec-topic">${escapeHtml(t.subjectLabel)} — ${escapeHtml(t.topicLabel)} (Mastered)</div>
            <p class="w-rec-tip">Next step: Attempt ${escapeHtml(nextDiff)} questions under timed DBE/IEB Paper conditions. ${escapeHtml(t.studyTip)}</p>
          </div>
        `
          )
          .join('');
      }
    }

    // Toggle "Practise Weak Topics" CTA
    const practiceWrap = document.getElementById('wPracticeWeakWrap');
    if (practiceWrap) {
      practiceWrap.style.display = weakTopics.length > 0 ? 'flex' : 'none';
    }

    renderQuestionReview(questions);
    renderHistoryList();

    showView('wResultsView');
    const section = document.getElementById('weaknessAssessmentSection');
    if (section) scrollWeaknessSectionIntoView(section);
  }

  function renderComparisonBox(current, previous) {
    const box = document.getElementById('wComparisonBox');
    if (!box) return;

    if (!previous) {
      box.innerHTML = `
        <div class="w-comp-wrap baseline">
          <div class="w-comp-text">
            <strong>Baseline Session Saved Locally:</strong> Your score (${current.percentage}%) and seen question IDs are stored in this browser so your next session serves fresh CAPS questions and tracks your progress.
          </div>
        </div>
      `;
      return;
    }

    const diff = current.percentage - previous.percentage;
    const prevWeakSet = new Set(previous.weakLabels || []);
    const currStrongSet = new Set(current.strongLabels || []);
    const masteredNow = [];
    currStrongSet.forEach((label) => {
      if (prevWeakSet.has(label)) masteredNow.push(label);
    });

    let statusClass = 'neutral';
    let headline = `Matched your previous session (${current.percentage}%)`;
    if (diff > 0) {
      statusClass = 'improved';
      headline = `Up +${diff}% compared with your previous session (${previous.percentage}% to ${current.percentage}%)`;
    } else if (diff < 0) {
      statusClass = 'regressed';
      headline = `${diff}% compared with your previous session (${previous.percentage}% to ${current.percentage}%)`;
    }

    let extraDetail = '';
    if (masteredNow.length > 0) {
      extraDetail = ` Turning into strengths: ${escapeHtml(masteredNow.join(', '))}.`;
    }

    box.innerHTML = `
      <div class="w-comp-wrap ${statusClass}">
        <div class="w-comp-text">
          <p><strong>${escapeHtml(headline)}.</strong>${extraDetail}</p>
        </div>
      </div>
    `;
  }

  function renderQuestionReview(questions) {
    const listEl = document.getElementById('wReviewList');
    if (!listEl) return;
    const letters = ['A', 'B', 'C', 'D'];

    listEl.innerHTML = questions
      .map((q, idx) => {
        const entry = currentSession.userAnswers[idx];
        const userIdx = entry ? entry.selectedIndex : -1;
        const isCorrect = userIdx === q.correctIndex;
        const userAnsText = userIdx >= 0 ? `${letters[userIdx]}. ${q.options[userIdx]}` : 'No answer';
        const correctAnsText = `${letters[q.correctIndex]}. ${q.options[q.correctIndex]}`;
        const subjMeta = SUBJECTS[q.subject] || { shortName: q.subject, topics: {} };
        const topMeta = subjMeta.topics[q.topicId] || { name: q.topicId };

        return `
        <div class="w-review-card ${isCorrect ? 'correct' : 'incorrect'}">
          <div class="w-review-card-head">
            <span class="w-review-qnum">Q${idx + 1} · ${escapeHtml(subjMeta.shortName)} · ${escapeHtml(topMeta.name)} · ${escapeHtml(DIFFICULTY_LABELS[q.difficulty] || '')}</span>
            <span class="w-verdict ${isCorrect ? 'correct' : 'incorrect'}">
              ${isCorrect ? 'Correct' : 'Incorrect'}
            </span>
          </div>
          <p class="w-review-prompt">${escapeHtml(q.question)}</p>
          <div class="w-review-answers">
            <div class="w-answer-line user ${isCorrect ? 'correct' : 'incorrect'}">
              <strong>Your Answer:</strong> ${escapeHtml(userAnsText)}
            </div>
            ${
              !isCorrect
                ? `
              <div class="w-answer-line correct">
                <strong>Correct Answer:</strong> ${escapeHtml(correctAnsText)}
              </div>
            `
                : ''
            }
          </div>
          <div class="w-review-explanation">
            <strong>Explanation &amp; CAPS Concept</strong>
            <p>${escapeHtml(q.explanation)} <em>Concept: ${escapeHtml(q.concept)}</em></p>
          </div>
        </div>
      `;
      })
      .join('');
  }

  function renderHistoryList() {
    const histSection = document.getElementById('wHistorySection');
    const listEl = document.getElementById('wHistoryList');
    if (!listEl || !histSection) return;

    const history = getQuizHistory();
    if (history.length === 0) {
      histSection.style.display = 'none';
      return;
    }

    histSection.style.display = 'block';
    listEl.innerHTML = history
      .slice(0, 6)
      .map((item, idx) => {
        const d = new Date(item.timestamp);
        const dateStr =
          d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
          ' ' +
          d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        const subjText = Array.isArray(item.subjects)
          ? item.subjects.map((id) => (SUBJECTS[id] ? SUBJECTS[id].shortName : id)).join(', ')
          : 'Mixed NSC';
        const diffLabel = DIFFICULTY_LABELS[item.difficulty] || 'Medium';
        const gradeShort = getGradeLabel(item.gradeId || 'grade12');
        const modeText = item.mode === 'weakness_drill' ? 'Weak-Topic Drill' : 'Daily Quiz';

        let deltaText = '';
        if (idx < history.length - 1) {
          const older = history[idx + 1];
          const delta = item.percentage - older.percentage;
          if (delta > 0) deltaText = ` (+${delta}%)`;
          else if (delta < 0) deltaText = ` (${delta}%)`;
        }

        const weakSummary =
          item.weakLabels && item.weakLabels.length > 0
            ? `Review: ${item.weakLabels.slice(0, 2).join(', ')}${item.weakLabels.length > 2 ? '...' : ''}`
            : 'All tested topics >= 75%';

        return `
        <div class="w-hist-item">
          <div class="w-hist-left">
            <span class="w-hist-date">${escapeHtml(dateStr)} · ${escapeHtml(modeText)} · ${escapeHtml(gradeShort)} · ${escapeHtml(diffLabel)}</span>
            <span class="w-hist-mode">${escapeHtml(subjText)}</span>
            <span class="w-hist-weaks">${escapeHtml(weakSummary)}</span>
          </div>
          <div class="w-hist-right">
            <span class="w-hist-score">${item.score}/${item.total} (${item.percentage}%)${escapeHtml(deltaText)}</span>
          </div>
        </div>
      `;
      })
      .join('');
  }

  // Expose pure read/test helper for programmatic inspection without polluting global scope
  window.AfriNscDailyQuiz = {
    version: '2.0.0',
    getGrades: function () {
      return Object.values(NSC_GRADES);
    },
    getProgrammes: function () {
      return Object.values(SA_PROGRAMMES);
    },
    getSubjects: function () {
      return SUBJECT_ORDER.map((id) => ({
        id,
        label: SUBJECTS[id].name,
        shortLabel: SUBJECTS[id].shortName,
        stream: SUBJECTS[id].stream,
        topicCount: Object.keys(SUBJECTS[id].topics).length
      }));
    },
    getQuestionCount: function () {
      return QUESTIONS.length;
    },
    getQuestionBank: function () {
      return QUESTIONS.slice();
    },
    generateSessionQuestions: generateSessionQuestions,
    openQuiz: function () {
      openDiagnosticSection('daily_quiz');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWeaknessUI);
  } else {
    initWeaknessUI();
  }
})();
