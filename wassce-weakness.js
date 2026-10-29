/**
 * AfriWidget WASSCE (WAEC Ghana & Nigeria) Daily Subject Learning Quiz Engine (v2.0)
 * Pure Vanilla JS — Zero External Dependencies — LocalStorage Variety & Progress Tracking
 *
 * Curriculum Scope:
 * - 12 Official WAEC WASSCE Subjects across Ghana & Nigeria:
 *   1. English Language (Core / Compulsory)
 *   2. Core Mathematics / General Mathematics
 *   3. Integrated Science (Ghana Core / General Science)
 *   4. Social Studies (Ghana Core) & Civic Education (Nigeria Compulsory)
 *   5. Elective Mathematics / Further Mathematics
 *   6. Physics
 *   7. Chemistry
 *   8. Biology
 *   9. Economics
 *   10. Financial Accounting
 *   11. Government
 *   12. Literature-in-English
 * - 60 Official WAEC Syllabus Topics with Practical Study Recommendations
 * - 360 Verified Subject Questions across Easy, Medium, and Difficult Levels
 *   (Zero aggregate-point or A1-F9 grade-mapping questions — 100% real WASSCE subject mastery)
 */
(function () {
  'use strict';

  var STORAGE_HISTORY_KEY = 'afriwidget_wassce_quiz_history_v2';
  var STORAGE_SEEN_KEY = 'afriwidget_wassce_quiz_seen_v2';
  var QUESTIONS_PER_SESSION = 10;

  var WASSCE_COUNTRIES = {
    ghana: {
      id: 'ghana',
      label: 'Ghana (WAEC Ghana — SHS 1–3 / GTEC)',
      shortLabel: 'Ghana'
    },
    nigeria: {
      id: 'nigeria',
      label: 'Nigeria (WAEC Nigeria — SS 1–3 / JAMB-UTME)',
      shortLabel: 'Nigeria'
    }
  };

  var WASSCE_PROGRAMMES = {
    medicine: {
      id: 'medicine',
      label: 'Medicine, Pharmacy, Dentistry & Nursing (MBChB / BPharm / BSc)',
      subjectsByCountry: {
        ghana: ['english', 'core_maths', 'integrated_science', 'chemistry', 'biology', 'physics'],
        nigeria: ['english', 'core_maths', 'biology', 'chemistry', 'physics']
      },
      note: 'Requires strong credits in English Language, Mathematics, Chemistry, Biology, and Physics (plus Integrated Science in Ghana).'
    },
    engineering: {
      id: 'engineering',
      label: 'Engineering, Architecture & Built Environment (BSc Eng / BEng)',
      subjectsByCountry: {
        ghana: ['english', 'core_maths', 'integrated_science', 'elective_maths', 'physics', 'chemistry'],
        nigeria: ['english', 'core_maths', 'elective_maths', 'physics', 'chemistry']
      },
      note: 'Requires English, Core/General Mathematics, Physics, Chemistry, and Elective/Further Mathematics.'
    },
    computing: {
      id: 'computing',
      label: 'Computer Science, Data Science & Information Technology (BSc)',
      subjectsByCountry: {
        ghana: ['english', 'core_maths', 'integrated_science', 'elective_maths', 'physics'],
        nigeria: ['english', 'core_maths', 'elective_maths', 'physics', 'economics']
      },
      note: 'Emphasises Core/General Mathematics, Elective/Further Mathematics, Physics, and English Language.'
    },
    business: {
      id: 'business',
      label: 'Business Administration, Accounting, Banking & Finance (BSc)',
      subjectsByCountry: {
        ghana: ['english', 'core_maths', 'social_civic', 'accounting', 'economics', 'elective_maths'],
        nigeria: ['english', 'core_maths', 'accounting', 'economics', 'government']
      },
      note: 'Requires English Language, Core/General Mathematics, Financial Accounting, and Economics.'
    },
    law: {
      id: 'law',
      label: 'Bachelor of Laws (LLB)',
      subjectsByCountry: {
        ghana: ['english', 'core_maths', 'social_civic', 'government', 'literature', 'economics'],
        nigeria: ['english', 'core_maths', 'literature', 'government', 'social_civic']
      },
      note: 'Demands top grades in English Language, Literature-in-English, and Government alongside Core/General Mathematics.'
    },
    sciences: {
      id: 'sciences',
      label: 'Biological, Physical & Agricultural Sciences (BSc)',
      subjectsByCountry: {
        ghana: ['english', 'core_maths', 'integrated_science', 'biology', 'chemistry', 'physics'],
        nigeria: ['english', 'core_maths', 'biology', 'chemistry', 'physics']
      },
      note: 'Covers core natural and physical science WASSCE subjects required across West African science faculties.'
    },
    economics_soc: {
      id: 'economics_soc',
      label: 'Economics, Political Science & Social Sciences (BA / BSc)',
      subjectsByCountry: {
        ghana: ['english', 'core_maths', 'social_civic', 'economics', 'government', 'elective_maths'],
        nigeria: ['english', 'core_maths', 'economics', 'government', 'social_civic']
      },
      note: 'Combines Economics, Government, English Language, and Core/General Mathematics.'
    },
    humanities: {
      id: 'humanities',
      label: 'General Arts, Mass Communication, Languages & Education (BA / BEd)',
      subjectsByCountry: {
        ghana: ['english', 'core_maths', 'social_civic', 'literature', 'government'],
        nigeria: ['english', 'core_maths', 'social_civic', 'literature', 'government']
      },
      note: 'Focuses on English Language, Literature-in-English, Government, and Social Studies / Civic Education.'
    },
    custom: {
      id: 'custom',
      label: 'Custom WASSCE Subject Combination (Select Any Subjects Below)',
      subjectsByCountry: {
        ghana: ['english', 'core_maths', 'integrated_science', 'social_civic'],
        nigeria: ['english', 'core_maths', 'social_civic', 'economics']
      },
      note: 'Toggle any combination of your WASSCE core and elective subjects below.'
    }
  };

  var SUBJECT_ORDER = [
    'english',
    'core_maths',
    'integrated_science',
    'social_civic',
    'elective_maths',
    'physics',
    'chemistry',
    'biology',
    'economics',
    'accounting',
    'government',
    'literature'
  ];

  var SUBJECTS = {
    english: {
      id: 'english',
      name: 'English Language',
      countryNames: {
        ghana: 'Core English Language',
        nigeria: 'English Language (Compulsory)'
      },
      shortName: 'English Language',
      stream: 'Compulsory Core',
      topics: {
        eng_lex: {
          name: 'Lexis, Idioms, Collocations & Register',
          shortName: 'Lexis & Register',
          studyTip: 'Study WAEC Paper 1 lexical registers by domain (medicine, aviation, law, publishing, agriculture) and learn idioms in full sentence context rather than guessing literal word meanings.'
        },
        eng_gram: {
          name: 'Grammar: Concord, Clauses, Tense & Question Tags',
          shortName: 'Grammar & Clauses',
          studyTip: 'Master grammatical names and functions (noun clause, adjectival/relative clause, adverbial clause) for Paper 2, and apply concord carefully after "together with", "as well as", and "neither... nor".'
        },
        eng_oral: {
          name: 'Oral English: Vowels, Consonants, Stress & Intonation',
          shortName: 'Oral English (Paper 3)',
          studyTip: 'Practise silent letters (b in plumber/debt, p in psalm/receipt), vowel contrasts (/i:/ vs /I/, /ae/ vs /a:/), and penultimate stress before suffixes "-tion", "-ic", and "-ial".'
        },
        eng_comp: {
          name: 'Comprehension, Figurative Expressions & Inference',
          shortName: 'Comprehension',
          studyTip: 'In WAEC Paper 2 comprehension, replace target vocabulary words with synonyms that match the exact part of speech and tense in the passage, and distinguish noun phrases from clauses.'
        },
        eng_sum: {
          name: 'Summary Writing & Formal / Essay Conventions',
          shortName: 'Summary & Essay',
          studyTip: 'Write every WAEC summary answer as a complete, concise autonomous sentence in your own words—avoid preamble-only fragments, wholesale lifting, and conjunctions like "and/also" that pack two points into one sentence.'
        }
      }
    },
    core_maths: {
      id: 'core_maths',
      name: 'Core / General Mathematics',
      countryNames: {
        ghana: 'Core Mathematics',
        nigeria: 'General Mathematics'
      },
      shortName: 'Core / Gen Maths',
      stream: 'Compulsory Core',
      topics: {
        cmath_num: {
          name: 'Number Bases, Modular Arithmetic, Surds & Indices',
          shortName: 'Number & Surds',
          studyTip: 'Convert non-decimal bases via base 10 to verify operations, rationalise surd denominators by multiplying by the conjugate, and express numbers in common prime bases when solving exponential equations.'
        },
        cmath_alg: {
          name: 'Sets, Venn Diagrams, Quadratics, Variation & Sequences',
          shortName: 'Sets, Algebra & AP/GP',
          studyTip: 'Fill the innermost intersection first on two- and three-set Venn diagrams, write explicit constant k in joint/inverse variation problems, and separate AP common difference d from GP common ratio r.'
        },
        cmath_geom: {
          name: 'Mensuration, Circle Theorems, Bearings & Trigonometry',
          shortName: 'Geometry & Bearings',
          studyTip: 'Draw North lines at every point in three-figure bearing problems to spot alternate angles, memorise circle theorems (angle at centre = 2 × angle at circumference; cyclic quad opposite angles sum to 180°), and distinguish slant height l from perpendicular height h in cones.'
        },
        cmath_fin: {
          name: 'Commercial Arithmetic: Percentages, Tax, Profit & Depreciation',
          shortName: 'Commercial Maths',
          studyTip: 'Always compute profit/loss and percentage discount on the original cost or marked price (never the final price unless specified), and apply compound interest/depreciation period-by-period.'
        },
        cmath_stat: {
          name: 'Statistics & Probability (Grouped Data, Dispersion & Trees)',
          shortName: 'Statistics & Probability',
          studyTip: 'Use class midpoints x in grouped mean (sum fx / sum f), locate median and interquartile range accurately on cumulative frequency (ogive) curves, and reduce totals on probability draws without replacement.'
        }
      }
    },
    integrated_science: {
      id: 'integrated_science',
      name: 'Integrated Science',
      countryNames: {
        ghana: 'Integrated Science (Core)',
        nigeria: 'Integrated / Basic Science Foundation'
      },
      shortName: 'Integrated Science',
      stream: 'Core Science',
      topics: {
        isci_bio: {
          name: 'Cells, Human Systems, Nutrition & Disease Control',
          shortName: 'Cells & Human Biology',
          studyTip: 'Compare plant vs animal organelles, trace digestion enzymes and end-products (starch -> maltose -> glucose; protein -> peptides -> amino acids), and link vector-borne diseases like malaria and cholera to specific preventive breaks in transmission.'
        },
        isci_chem: {
          name: 'Matter, Atomic Structure, Acids/Bases, Water & Rusting',
          shortName: 'Matter, Acids & Water',
          studyTip: 'Distinguish temporary water hardness (Ca(HCO3)2, removed by boiling) from permanent hardness (CaSO4/MgSO4, removed by washing soda Na2CO3 or ion exchange), and remember rusting requires BOTH oxygen and water.'
        },
        isci_phys: {
          name: 'Energy, Machines, Simple Circuits, Heat & Light',
          shortName: 'Energy, Machines & Electricity',
          studyTip: 'Use Efficiency = (Work Output / Work Input) × 100% = (MA / VR) × 100%, convert watts to kilowatts when calculating household kWh electricity bills, and separate conduction, convection, and radiation.'
        },
        isci_agri: {
          name: 'Soil Science, Crop Production & Animal Husbandry',
          shortName: 'Soil & Agriculture',
          studyTip: 'Compare sandy, clayey, and loamy soils by drainage, capillarity, and humus content, practise N-P-K fertiliser roles and crop-rotation sequences (always include a nitrogen-fixing legume), and revise ruminant vs non-ruminant digestion.'
        },
        isci_env: {
          name: 'Ecosystems, Carbon/Nitrogen Cycles & Environmental Safety',
          shortName: 'Ecosystems & Environment',
          studyTip: 'Trace nitrogen-fixing (Rhizobium, Azotobacter), nitrifying (Nitrosomonas, Nitrobacter), and denitrifying bacteria in the nitrogen cycle, and distinguish greenhouse warming from stratospheric ozone depletion.'
        }
      }
    },
    social_civic: {
      id: 'social_civic',
      name: 'Social Studies & Civic Education',
      countryNames: {
        ghana: 'Social Studies (Core)',
        nigeria: 'Civic Education (Compulsory)'
      },
      shortName: 'Social / Civic Ed',
      stream: 'Compulsory Citizenship',
      topics: {
        sciv_gov: {
          name: 'Constitution, Rule of Law, Democracy & Human Rights',
          shortName: 'Rule of Law & Rights',
          studyTip: 'Link Dicey\'s three pillars of the Rule of Law (supremacy of law, equality before the law, fundamental liberties) to constitutional safeguards such as judicial independence, press freedom, and periodic credible elections.'
        },
        sciv_cit: {
          name: 'Citizenship, National Integration, Values & Public Integrity',
          shortName: 'Citizenship & Values',
          studyTip: 'Distinguish civic rights from civic duties/obligations (tax compliance, voting, obeying laws, defending national unity), and revise practical mechanisms for curbing corruption, cultism, and electoral malpractice.'
        },
        sciv_fam: {
          name: 'Family Systems, Socialisation, Youth & Population Dynamics',
          shortName: 'Family & Population',
          studyTip: 'Contrast nuclear and extended family roles, differentiate primary socialisation (family) from secondary agents (school, peer group, media, religious bodies), and calculate dependency ratios from population pyramids.'
        },
        sciv_env: {
          name: 'Physical Environment, Resource Conservation & Public Health',
          shortName: 'Environment & Health',
          studyTip: 'Connect illegal mining, deforestation, improper waste disposal, and bush burning to downstream flooding and waterborne disease, and distinguish HIV/AIDS transmission routes from everyday non-infectious contact.'
        },
        sciv_dev: {
          name: 'National Development, Entrepreneurship & ECOWAS Cooperation',
          shortName: 'Development & ECOWAS',
          studyTip: 'Separate economic growth (rise in output/GDP) from economic development (sustained improvement in living standards, health, literacy, and infrastructure), and revise ECOWAS protocols on free movement and trade.'
        }
      }
    },
    elective_maths: {
      id: 'elective_maths',
      name: 'Elective / Further Mathematics',
      countryNames: {
        ghana: 'Elective Mathematics',
        nigeria: 'Further Mathematics'
      },
      shortName: 'Elective / Further Maths',
      stream: 'Quantitative Elective',
      topics: {
        emath_alg: {
          name: 'Polynomials, Partial Fractions, Binomial Theorem & Roots',
          shortName: 'Polynomials & Binomial',
          studyTip: 'Use alpha + beta = -b/a and alpha*beta = c/a without solving quadratics directly, include repeated linear factors as A/(x - r) + B/(x - r)² in partial fractions, and factor out a^n when expanding (a + bx)^n for fractional/negative n.'
        },
        emath_coord: {
          name: 'Coordinate Geometry, Circles, Functions & Matrices',
          shortName: 'Coord Geom & Matrices',
          studyTip: 'Complete the square to read circle centre (-g, -f) and radius sqrt(g² + f² - c), verify perpendicular gradients m1 * m2 = -1, and check det(A) = ad - bc != 0 before inverting a 2×2 matrix.'
        },
        emath_calc: {
          name: 'Differential & Integral Calculus (Rates, Maxima & Area)',
          shortName: 'Calculus',
          studyTip: 'Apply chain, product, and quotient rules systematically, test stationary points with the second derivative d²y/dx², and split definite integrals wherever a curve crosses the x-axis when finding total enclosed area.'
        },
        emath_mech: {
          name: 'Vectors & Mechanics (Statics, Kinematics & Momentum)',
          shortName: 'Vectors & Mechanics',
          studyTip: 'Use scalar (dot) product a . b = |a||b|cos(theta) = 0 to prove perpendicularity, resolve forces along horizontal and perpendicular axes in equilibrium/Lami\'s theorem problems, and conserve vector momentum in collisions.'
        },
        emath_stat: {
          name: 'Permutations, Combinations, Binomial Probability & Correlation',
          shortName: 'Combinatorics & Prob',
          studyTip: 'Treat grouped items as one super-unit multiplied by internal arrangements in permutations, subtract complement cases for "at least one" selections, and apply P(X = r) = nCr * p^r * q^(n - r) for independent Bernoulli trials.'
        }
      }
    },
    physics: {
      id: 'physics',
      name: 'Physics',
      countryNames: {
        ghana: 'Physics (Elective)',
        nigeria: 'Physics'
      },
      shortName: 'Physics',
      stream: 'Science Elective',
      topics: {
        phy_mech: {
          name: 'Mechanics, Projectiles, Moments, Elasticity & Fluids',
          shortName: 'Mechanics & Projectiles',
          studyTip: 'Resolve projectile initial velocity u into horizontal u*cos(theta) (constant) and vertical u*sin(theta) (accelerated by g), take clockwise = anticlockwise moments about a chosen pivot, and apply Hooke\'s law F = ke up to the elastic limit.'
        },
        phy_therm: {
          name: 'Thermal Physics: Specific Heat, Latent Heat & Gas Laws',
          shortName: 'Thermal & Gas Laws',
          studyTip: 'Always convert Celsius to Kelvin (T = theta + 273) in Boyle\'s, Charles\'s, and general gas law P1V1/T1 = P2V2/T2, and include BOTH sensible heat (mc*delta_theta) and latent heat (mL) during phase changes.'
        },
        phy_wave: {
          name: 'Waves, Sound, Reflection, Refraction & Lenses',
          shortName: 'Waves & Optics',
          studyTip: 'Use echo formula v = 2d/t for reflected sound pulses, apply Snell\'s law n = sin i / sin r = 1 / sin C for critical angle, and keep sign conventions consistent in 1/f = 1/u + 1/v (convex f positive, concave f negative).'
        },
        phy_elec: {
          name: 'Electrostatics, DC Circuits, Magnetism & AC Induction',
          shortName: 'Electricity & Magnetism',
          studyTip: 'Remember capacitors combine opposite to resistors (parallel C_total = C1 + C2; series 1/C_total = 1/C1 + 1/C2), apply E = I(R + r) for internal resistance, and use Vs/Vp = Ns/Np for ideal transformers.'
        },
        phy_mod: {
          name: 'Atomic Models, Photoelectric Effect & Radioactivity',
          shortName: 'Modern & Nuclear Physics',
          studyTip: 'Conserve mass number A and atomic number Z in alpha (4,2 He) and beta (0,-1 e) decays, count number of half-lives n = t / T_half so remaining mass = M0 / 2^n, and apply Einstein\'s photoelectric equation hf = W0 + K_max.'
        }
      }
    },
    chemistry: {
      id: 'chemistry',
      name: 'Chemistry',
      countryNames: {
        ghana: 'Chemistry (Elective)',
        nigeria: 'Chemistry'
      },
      shortName: 'Chemistry',
      stream: 'Science Elective',
      topics: {
        chem_atom: {
          name: 'Atomic Structure, Periodicity & Chemical Bonding',
          shortName: 'Bonding & Periodicity',
          studyTip: 'Link periodic trends (ionisation energy, atomic radius, electronegativity) to nuclear charge and shielding, and connect giant ionic, giant covalent, metallic, and simple molecular bonding to melting points and electrical conductivity.'
        },
        chem_stoich: {
          name: 'Stoichiometry, Gas Laws, Mole Concept & Volumetric Analysis',
          shortName: 'Stoichiometry & Moles',
          studyTip: 'Use C_A * V_A / (C_B * V_B) = n_A / n_B from the balanced titration equation, convert cm³ to dm³ (divide by 1000) when finding molar mass or mass concentration (g/dm³ = mol/dm³ × molar mass), and apply 22.4 dm³ at STP.'
        },
        chem_acid: {
          name: 'Acids, Bases, Salts, pH, Redox & Electrochemistry',
          shortName: 'Acids, Redox & Electrolysis',
          studyTip: 'Match acid-base indicators to titration strength (methyl orange for strong acid + weak base; phenolphthalein for weak acid + strong base), and apply Faraday\'s First Law m = (I * t * M) / (z * F) with F = 96 500 C/mol.'
        },
        chem_kin: {
          name: 'Rates of Reaction, Energetics, Equilibrium & Solubility',
          shortName: 'Rates, Equilibrium & Solubility',
          studyTip: 'Apply Le Chatelier\'s principle separately for pressure (count газовые/gaseous moles only!), temperature (endo vs exo), and concentration, and compute solubility in mol/dm³ scaled strictly to 1000 g (1 dm³) of solvent.'
        },
        chem_org: {
          name: 'Organic Chemistry: Hydrocarbons, Alkanols, Esters & Polymers',
          shortName: 'Organic Chemistry',
          studyTip: 'Distinguish alkane substitution, alkene/alkyne addition, esterification (alkanol + alkanoic acid ⇌ ester + water with conc. H2SO4), saponification (alkaline hydrolysis of fats), and addition vs condensation polymerisation.'
        }
      }
    },
    biology: {
      id: 'biology',
      name: 'Biology',
      countryNames: {
        ghana: 'Biology (Elective)',
        nigeria: 'Biology'
      },
      shortName: 'Biology',
      stream: 'Science Elective',
      topics: {
        bio_cell: {
          name: 'Classification, Cell Structure, Osmosis & Mitosis/Meiosis',
          shortName: 'Cells, Osmosis & Division',
          studyTip: 'Track water movement from higher water potential (hypotonic/dilute) to lower water potential (hypertonic/concentrated) across a selectively permeable membrane, causing plasmolysis in plant cells and haemolysis/crenation in red blood cells.'
        },
        bio_phys: {
          name: 'Plant & Mammalian Nutrition, Transport, Respiration & Excretion',
          shortName: 'Nutrition, Transport & Excretion',
          studyTip: 'Know exact food-test reagents (iodine -> blue-black starch; Benedict\'s + heat -> brick-red reducing sugar; Biuret -> purple protein), trace double circulation through heart chambers, and distinguish ultrafiltration in Bowman\'s capsule from selective reabsorption in the proximal convoluted tubule.'
        },
        bio_coord: {
          name: 'Nervous/Hormonal Coordination, Sense Organs & Reproduction',
          shortName: 'Coordination & Reproduction',
          studyTip: 'Follow the reflex arc (receptor -> sensory neurone -> relay neurone in spinal cord grey matter -> motor neurone -> effector), distinguish myopia (concave diverging lens) from hypermetropia (convex converging lens), and revise pollination/double fertilisation in flowering plants.'
        },
        bio_ecol: {
          name: 'Ecology, Biomes, Sampling Instruments & Conservation',
          shortName: 'Ecology & Biomes',
          studyTip: 'Match ecological instruments accurately (secchi disc -> turbidity; anemometer -> wind speed; hygrometer -> relative humidity; quadrat -> plant/sessile density; Lincoln index capture-recapture -> mobile fauna), and compare Guinea/Sudan/Sahel savanna traits with tropical rainforest.'
        },
        bio_gen: {
          name: 'Genetics, Sickle-Cell / ABO Inheritance, Variation & Evolution',
          shortName: 'Genetics & Evolution',
          studyTip: 'Set up Punnett squares systematically for monohybrid, sex-linked (X-chromosome haemophilia/colour blindness), ABO multiple alleles (IA, IB codominant over IO), and sickle-cell trait carriers (HbA HbS), and contrast Lamarck\'s acquired characters with Darwin\'s natural selection.'
        }
      }
    },
    economics: {
      id: 'economics',
      name: 'Economics',
      countryNames: {
        ghana: 'Economics (Elective)',
        nigeria: 'Economics'
      },
      shortName: 'Economics',
      stream: 'Business & Social Science',
      topics: {
        econ_dem: {
          name: 'Scarcity, Demand, Supply, Price Controls & Elasticity',
          shortName: 'Demand, Supply & Elasticity',
          studyTip: 'Distinguish a movement along a demand curve (caused ONLY by own-price change) from a shift of the entire curve, link PED > 1 (elastic) vs PED < 1 (inelastic) to total revenue changes, and identify shortages under binding maximum price ceilings.'
        },
        econ_prod: {
          name: 'Production, Cost/Revenue Curves & Market Structures',
          shortName: 'Costs & Market Structures',
          studyTip: 'Memorise TFC + TVC = TC, AFC + AVC = AC, MC cuts AC and AVC at their minimum points, profit maximisation occurs where MR = MC, and contrast perfect competition (P = MR = AR horizontal) with monopoly price-setting.'
        },
        econ_macro: {
          name: 'National Income (GDP/GNP), Money, Banking & Inflation',
          shortName: 'National Income & Money',
          studyTip: 'Avoid double counting in National Income by summing ONLY value added at each stage (or final output), convert GDP at market prices to factor cost (subtract indirect taxes, add subsidies), and use credit multiplier = 1 / cash reserve ratio.'
        },
        econ_pub: {
          name: 'Public Finance, Taxation, Budgets & Economic Planning',
          shortName: 'Taxation & Public Finance',
          studyTip: 'Contrast progressive, proportional, and regressive tax systems, know Adam Smith\'s canons of taxation (equity, certainty, convenience, economy), and trace tax incidence: inelastic demand shifts indirect tax burden mostly onto consumers.'
        },
        econ_intl: {
          name: 'International Trade, Balance of Payments & ECOWAS / AfCFTA',
          shortName: 'International Trade & BoP',
          studyTip: 'Apply Ricardo\'s law of comparative cost advantage (specialise in lower opportunity cost), compute Terms of Trade = (Index of Export Prices / Index of Import Prices) × 100, and separate Current Account (visible + invisible trade) from Capital/Financial Account.'
        }
      }
    },
    accounting: {
      id: 'accounting',
      name: 'Financial Accounting',
      countryNames: {
        ghana: 'Financial Accounting (Elective)',
        nigeria: 'Financial Accounting'
      },
      shortName: 'Financial Accounting',
      stream: 'Business Elective',
      topics: {
        acc_books: {
          name: 'Accounting Concepts, Double Entry, Cash Book & Bank Reconciliation',
          shortName: 'Concepts & Bank Recon',
          studyTip: 'Match every GAAP concept (going concern, accruals/matching, prudence, business entity, consistency, materiality), treat Cash/Bank contra entries cleanly in the three-column cash book, and watch whether Bank Reconciliation starts with a debit (favourable) or credit (overdraft) balance.'
        },
        acc_sole: {
          name: 'Final Accounts Adjustments: Accruals, Prepayments & Bad Debts',
          shortName: 'Sole Trader Adjustments',
          studyTip: 'Add expenses owing and deduct expenses prepaid in Profit or Loss; carry ONLY the CHANGE in Provision for Doubtful Debts to Profit or Loss while deducting the full closing provision from Trade Receivables on the Statement of Financial Position.'
        },
        acc_depr: {
          name: 'Depreciation, Control Accounts & Correction of Errors',
          shortName: 'Depreciation & Errors',
          studyTip: 'Separate errors NOT affecting Trial Balance agreement (commission, principle, omission, original entry, complete reversal, compensating) from one-sided errors corrected through the Suspense Account, and track asset disposal gain/loss against Net Book Value.'
        },
        acc_part: {
          name: 'Partnership, Manufacturing & Non-Profit (Club) Accounts',
          shortName: 'Partnership, Mfg & Clubs',
          studyTip: 'In Manufacturing Accounts, Prime Cost = Direct Materials + Direct Labour + Direct Expenses (add Factory Overheads + opening WIP - closing WIP for Production Cost); in Clubs, convert Receipts & Payments into Subscriptions for the year by adjusting arrears and advances.'
        },
        acc_comp: {
          name: 'Incomplete Records, Mark-Up vs Margin & Accounting Ratios',
          shortName: 'Single Entry & Ratios',
          studyTip: 'Memorise the fraction conversion between Mark-up (Gross Profit / Cost of Sales) and Margin (Gross Profit / Sales): if Mark-up = 1/4 (25%), Margin = 1/(4+1) = 1/5 (20%); if Margin = 1/4, Mark-up = 1/(4-1) = 1/3.'
        }
      }
    },
    government: {
      id: 'government',
      name: 'Government',
      countryNames: {
        ghana: 'Government (Elective)',
        nigeria: 'Government'
      },
      shortName: 'Government',
      stream: 'Arts & Humanities Elective',
      topics: {
        gov_prin: {
          name: 'Political Concepts: Sovereignty, Power, Legitimacy & Constitutions',
          shortName: 'Core Political Concepts',
          studyTip: 'Distinguish power (capacity to compel compliance through sanctions) from authority (legitimate right to command) and sovereignty (supreme legal authority inside a state, popularized by Jean Bodin), and compare written/rigid vs unwritten/flexible constitutions.'
        },
        gov_org: {
          name: 'Organs & Systems: Presidential, Parliamentary, Federal & Electoral',
          shortName: 'Systems & Organs of Govt',
          studyTip: 'Contrast Parliamentary cabinet fusion + collective responsibility (PM ≠ ceremonial Head of State) with Presidential strict separation + individual responsibility (President is both Head of State and Head of Government), and compare unitary vs federal division of powers.'
        },
        gov_hist: {
          name: 'Pre-Colonial Political Systems & Colonial Administration',
          shortName: 'Pre-Colonial & Colonial Rule',
          studyTip: 'Compare centralized pre-colonial kingdoms (Hausa-Fulani Emirate, Asante Confederacy with Asantehene & Golden Stool, Oyo Empire checks and balances between Alaafin, Oyomesi, and Ogboni) with acephalous/decentralized Igbo village democracy, and contrast British Indirect Rule with French Assimilation and Association.'
        },
        gov_nat: {
          name: 'Nationalism, Constitutional Evolution, Military Rule & Civil Service',
          shortName: 'Constitutions & Civil Service',
          studyTip: 'Track landmark West African constitutional milestones (1922 Clifford elective principle; 1946 Richards/Burns; 1949 Coussey; 1951 Macpherson; 1954 Lyttelton federalism; independence & republican constitutions), civil service neutrality/permanence/anonymity, and public corporations.'
        },
        gov_intl: {
          name: 'Foreign Policy & International Organisations (ECOWAS, AU, UN)',
          shortName: 'ECOWAS, AU & UN',
          studyTip: 'Know founding dates, headquarters, and organs: ECOWAS (28 May 1975 Treaty of Lagos, HQ Abuja), OAU (1963) -> African Union (2002 Durban, HQ Addis Ababa), Commonwealth of Nations, and UN Security Council permanent members\' veto power.'
        }
      }
    },
    literature: {
      id: 'literature',
      name: 'Literature-in-English',
      countryNames: {
        ghana: 'Literature-in-English (Elective)',
        nigeria: 'Literature-in-English'
      },
      shortName: 'Literature-in-English',
      stream: 'Arts & Humanities Elective',
      topics: {
        lit_fig: {
          name: 'Literary Devices: Tropes, Irony, Contrast & Sound Patterns',
          shortName: 'Literary Figures & Devices',
          studyTip: 'Keep look-alike devices sharp for WAEC Paper 1: Synecdoche (part for whole) vs Metonymy (associated symbol), Oxymoron (adjacent contradiction) vs Paradox (self-contradictory statement with deeper truth), Apostrophe (addressing absent/dead/inanimate), Litotes (negated understatement), and Euphemism.'
        },
        lit_poet: {
          name: 'Poetic Forms, Metre, Rhyme, Stanza & Persona',
          shortName: 'Poetic Forms & Prosody',
          studyTip: 'Distinguish elegy/dirge (mourning the dead — dirge is sung/performed at funerals), ode (elevated tribute/address), ballad (narrative folk stanza), pastoral, epic, and Petrarchan (8+6) vs Shakespearean (4+4+4+2) sonnets, plus iambic pentameter (5 unstressed-stressed feet).'
        },
        lit_dram: {
          name: 'Dramatic Elements: Tragedy, Comedy, Stagecraft & Structure',
          shortName: 'Drama & Stagecraft',
          studyTip: 'Know Aristotelian tragic terms (hamartia = tragic flaw/error; hubris = excessive pride; peripeteia = reversal of fortune; anagnorisis = discovery/recognition; catharsis = emotional purgation), and separate soliloquy (alone on stage) from aside and dramatic monologue.'
        },
        lit_pros: {
          name: 'Prose Narrative: Point of View, Plot, Characterisation & Setting',
          shortName: 'Prose Narrative Technique',
          studyTip: 'Compare first-person, third-person limited, epistolary (letters), and omniscient narration; contrast dynamic/round characters with flat/static characters and foils; and identify in medias res, flashback (analepsis), foreshadowing, and satire/allegory.'
        },
        lit_app: {
          name: 'Unseen Prose & Poetry Appreciation (Tone, Mood, Diction & Theme)',
          shortName: 'Unseen Appreciation',
          studyTip: 'Never confuse TONE (the writer/persona\'s attitude toward the subject) with MOOD/ATMOSPHERE (the emotional feeling evoked in the reader), and always express THEME as a universal insight rather than a single word.'
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
    easy: 'Core WAEC Paper 1 definitions, foundational rules, and direct calculations',
    medium: 'Standard WAEC Paper 1 & Paper 2 multi-step structured application questions',
    difficult: 'Grade A1–B2 synthesis, analytical edge cases, and higher-order problem solving'
  };

  // ===========================================================================
  // VERIFIED WAEC WASSCE QUESTION BANK — 360 QUESTIONS (12 SUBJECTS × 30 ITEMS)
  // ===========================================================================
  var QUESTIONS = [
    // =========================================================================
    // 1. ENGLISH LANGUAGE — 30 Questions (10 Easy, 10 Medium, 10 Difficult)
    // =========================================================================
    {
      id: 'was_eng_e1',
      subject: 'english',
      topicId: 'eng_lex',
      difficulty: 'easy',
      question: 'Choose the option that is NEAREST IN MEANING to the capitalised word: "The witness gave a CANDID account of what happened at the junction."',
      options: [
        'secretive',
        'frank and honest',
        'brief and hurried',
        'rehearsed'
      ],
      correctIndex: 1,
      explanation: '"Candid" means truthful, straightforward, and frank without hiding unpleasant details.',
      concept: 'In WAEC Lexis & Structure synonym items, check both dictionary meaning and positive/negative register in the sentence context.'
    },
    {
      id: 'was_eng_e2',
      subject: 'english',
      topicId: 'eng_lex',
      difficulty: 'easy',
      question: 'Choose the option MOST NEARLY OPPOSITE IN MEANING to the capitalised word: "The Prefect\'s FRUGAL lifestyle surprised his wealthy classmates."',
      options: [
        'extravagant',
        'cautious',
        'modest',
        'diligent'
      ],
      correctIndex: 0,
      explanation: '"Frugal" means economical and sparing with money or resources; its direct antonym is "extravagant" (wasteful/lavish spending).',
      concept: 'Antonym items in WAEC Paper 1 often include near-synonyms ("cautious", "modest") as distractors—read the instruction ("OPPOSITE" vs "NEAREST") carefully.'
    },
    {
      id: 'was_eng_e3',
      subject: 'english',
      topicId: 'eng_gram',
      difficulty: 'easy',
      question: 'Complete the sentence with the grammatically correct verb: "Neither the coach nor the players ___ happy with the referee\'s final whistle."',
      options: [
        'was',
        'were',
        'is',
        'has been'
      ],
      correctIndex: 1,
      explanation: 'Under the proximity concord rule for "neither... nor" and "either... or", the verb agrees in number with the nearer subject ("the players", plural), taking "were".',
      concept: 'Proximity concord: with "either... or" / "neither... nor", match the verb to the noun immediately preceding the verb.'
    },
    {
      id: 'was_eng_e4',
      subject: 'english',
      topicId: 'eng_gram',
      difficulty: 'easy',
      question: 'Supply the correct question tag: "Ama rarely arrives late for morning prep, ___?"',
      options: [
        'doesn\'t she',
        'does she',
        'isn\'t it',
        'did she'
      ],
      correctIndex: 1,
      explanation: 'Semi-negative adverbs ("rarely", "seldom", "hardly", "scarcely", "barely", "little") make the main statement negative in meaning, so it requires a POSITIVE tag in the same simple present tense: "does she?".',
      concept: 'Question-tag golden rule: negative or semi-negative main clause ("rarely/seldom/hardly") -> positive auxiliary tag ("does she?").'
    },
    {
      id: 'was_eng_e5',
      subject: 'english',
      topicId: 'eng_oral',
      difficulty: 'easy',
      question: 'Which word below contains a SILENT consonant letter "b"?',
      options: [
        'timber',
        'plumber',
        'number',
        'rumble'
      ],
      correctIndex: 1,
      explanation: 'In final or stem-final "-mb" words such as "plumber", "comb", "lamb", "thumb", and "climb" (as well as "debt", "doubt", "subtle"), the letter "b" is completely silent (/plʌmə/).',
      concept: 'WAEC Paper 3 (Test of Orals) regularly contrasts silent "-mb" stems ("plumber", "bomb", "comb") against pronounced /mb/ clusters ("timber", "number").'
    },
    {
      id: 'was_eng_e6',
      subject: 'english',
      topicId: 'eng_oral',
      difficulty: 'easy',
      question: 'Which word has the SAME vowel sound as the underlined letters in "sEA" (/i:/)?',
      options: [
        'bread',
        'people',
        'great',
        'heart'
      ],
      correctIndex: 1,
      explanation: '"Sea" has the long close front vowel /i:/. In "people" (/pi:pl/), "eo" represents the exact same long /i:/ sound, whereas "bread" has /e/, "great" has /eI/, and "heart" has /ɑ:/.',
      concept: 'Judge Oral English items strictly by pronunciation (phonetic sound), never by English spelling!'
    },
    {
      id: 'was_eng_e7',
      subject: 'english',
      topicId: 'eng_comp',
      difficulty: 'easy',
      question: 'Identify the figure of speech in: "The angry harmattan wind slapped the corrugated rooftops all night."',
      options: [
        'Simile',
        'Personification',
        'Euphemism',
        'Hyperbole'
      ],
      correctIndex: 1,
      explanation: 'Giving the non-human wind human emotion ("angry") and human physical action ("slapped") is personification.',
      concept: 'Personification attributes human feelings, intentions, or actions to inanimate objects or natural forces.'
    },
    {
      id: 'was_eng_e8',
      subject: 'english',
      topicId: 'eng_comp',
      difficulty: 'easy',
      question: 'In a WASSCE comprehension passage, if you are asked to replace the past-tense verb "relinquished" in "The chief relinquished his claim", which replacement form is grammatically valid?',
      options: [
        'surrender',
        'surrendered',
        'surrendering',
        'to surrender'
      ],
      correctIndex: 1,
      explanation: 'WAEC comprehension marking schemes require a vocabulary replacement to fit straight back into the original sentence without altering grammar: since "relinquished" is simple past tense, the synonym must also be simple past ("surrendered" / "abandoned").',
      concept: 'Vocabulary-in-context rule: match BOTH contextual meaning AND exact grammatical form (tense, number, part of speech).'
    },
    {
      id: 'was_eng_e9',
      subject: 'english',
      topicId: 'eng_sum',
      difficulty: 'easy',
      question: 'Which practice attracts a heavy mark deduction in WASSCE English Paper 2 Summary writing?',
      options: [
        'Writing each required point as a concise, complete sentence in your own words',
        'Copying whole sentences word-for-word ("mindless lifting") directly from the passage',
        'Omitting illustrative examples and figurative padding',
        'Numbering or lettering your summary sentences clearly as instructed'
      ],
      correctIndex: 1,
      explanation: 'WAEC summary marking rules award zero marks for wholesale verbatim lifting from the passage and deduct 50% of the point\'s mark for grammatical errors or inclusion of extraneous material.',
      concept: 'Summary discipline: 1 point = 1 complete, grammatical sentence in your own words with zero examples or lifted clauses.'
    },
    {
      id: 'was_eng_e10',
      subject: 'english',
      topicId: 'eng_sum',
      difficulty: 'easy',
      question: 'What is the appropriate complimentary close for a FORMAL letter in WASSCE Paper 2 that opens with the salutation "Dear Sir," or "Dear Madam,"?',
      options: [
        'Yours affectionately,',
        'Yours faithfully,',
        'Yours ever,',
        'Best wishes,'
      ],
      correctIndex: 1,
      explanation: 'In WAEC formal letter conventions, an impersonal salutation ("Dear Sir," / "Dear Madam,") pairs strictly with "Yours faithfully," followed by your signature and full name.',
      concept: 'Formal letter pairing: "Dear Sir/Madam," -> "Yours faithfully," (capital Y, lowercase f, followed by a comma, signature, and full name).'
    },
    {
      id: 'was_eng_m1',
      subject: 'english',
      topicId: 'eng_lex',
      difficulty: 'medium',
      question: 'Choose the interpretation most appropriate for the idiom: "By refusing to apologise to the panel, Kofi burnt his boats."',
      options: [
        'He set fire to his family\'s fishing vessels',
        'He took an irreversible action that made it impossible to return to his former position',
        'He won the panel\'s admiration through bravery',
        'He postponed the hearing until the next month'
      ],
      correctIndex: 1,
      explanation: 'To "burn one\'s boats" (or bridges) means to commit oneself irrevocably to a course of action, leaving no way back.',
      concept: 'Never choose literal surface meanings ("fishing vessels") for English idioms in WAEC Paper 1.'
    },
    {
      id: 'was_eng_m2',
      subject: 'english',
      topicId: 'eng_lex',
      difficulty: 'medium',
      question: 'Fill the gap with the correct medical register word: "Before prescribing antibiotics, the physician carried out a thorough ___ to identify the exact illness."',
      options: [
        'prognosis',
        'diagnosis',
        'autopsy',
        'quarantine'
      ],
      correctIndex: 1,
      explanation: '"Diagnosis" is identifying the nature/cause of an illness from symptoms and tests; "prognosis" is forecasting the likely future course/recovery of a disease; "autopsy" is a post-mortem examination.',
      concept: 'Medical register contrasts: diagnosis (identifying disease) vs prognosis (predicted outcome) vs prophylaxis (preventive treatment).'
    },
    {
      id: 'was_eng_m3',
      subject: 'english',
      topicId: 'eng_gram',
      difficulty: 'medium',
      question: 'Choose the correct option: "The Principal, together with the two Vice-Principals and the Senior Housemaster, ___ inspecting the dormitories right now."',
      options: [
        'are',
        'is',
        'were',
        'have been'
      ],
      correctIndex: 1,
      explanation: 'Phrases introduced by "together with", "as well as", "along with", "in addition to", or "accompanied by" are parenthetical and do NOT make a singular head subject plural. "The Principal" is singular and "right now" signals present continuous -> "is".',
      concept: 'Accompaniment concord rule: ignore ", together with..." when matching the verb to the true head noun.'
    },
    {
      id: 'was_eng_m4',
      subject: 'english',
      topicId: 'eng_gram',
      difficulty: 'medium',
      question: 'What is the grammatical name and function of the bracketed expression in: "The textbook [that I borrowed from Chidi yesterday] has a torn cover"?',
      options: [
        'Adverbial clause of time modifying "borrowed"',
        'Adjectival (relative) clause qualifying the noun "textbook"',
        'Noun clause acting as subject of the verb "has"',
        'Adjectival phrase qualifying "cover"'
      ],
      correctIndex: 1,
      explanation: 'It contains a finite verb ("borrowed"), making it a clause (not a phrase), and it describes/specifies which textbook is meant—so it is an adjectival (relative) clause qualifying the noun "textbook".',
      concept: 'WAEC Clause vs Phrase test: check for a finite verb first (finite verb = clause; no finite verb = phrase), then ask what word in the main clause it modifies or serves.'
    },
    {
      id: 'was_eng_m5',
      subject: 'english',
      topicId: 'eng_oral',
      difficulty: 'medium',
      question: 'Identify the correct primary syllable stress pattern (shown in CAPITALS) for the word "education".',
      options: [
        'ED-u-ca-tion',
        'ed-U-ca-tion',
        'ed-u-CA-tion',
        'ed-u-ca-TION'
      ],
      correctIndex: 2,
      explanation: 'Words ending in "-tion", "-sion", "-ic", and "-ial" place primary stress on the penultimate (second-from-last) syllable: ed-u-CA-tion.',
      concept: 'Suffix stress shortcut for WAEC Oral English: "-tion / -sion / -ic" -> stress falls immediately BEFORE the suffix; "-ee / -eer / -ese" -> stress falls ON the suffix.'
    },
    {
      id: 'was_eng_m6',
      subject: 'english',
      topicId: 'eng_oral',
      difficulty: 'medium',
      question: 'In WAEC emphatic stress: "Amina bought a BLUE handbag at Makola Market." Which question is this emphatic statement answering?',
      options: [
        'Did Fatima buy a blue handbag at Makola Market?',
        'Did Amina buy a black handbag at Makola Market?',
        'Did Amina buy a blue shoe at Makola Market?',
        'Did Amina steal a blue handbag at Makola Market?'
      ],
      correctIndex: 1,
      explanation: 'In WAEC Paper 3 emphatic stress, the capitalised word ("BLUE") contradicts an alternative item in the exact same slot ("black"), while every other word in the correct question stays identical.',
      concept: 'Emphatic stress rule: choose the question option that changes ONLY the capitalised word (keeping all other words unchanged).'
    },
    {
      id: 'was_eng_m7',
      subject: 'english',
      topicId: 'eng_comp',
      difficulty: 'medium',
      question: 'What is the grammatical name and function of the bracketed expression in: "[What the bursar revealed during the audit] shocked the entire board"?',
      options: [
        'Adjectival clause qualifying "board"',
        'Noun clause functioning as subject of the verb "shocked"',
        'Adverbial clause of reason modifying "shocked"',
        'Noun phrase functioning as object of "shocked"'
      ],
      correctIndex: 1,
      explanation: 'The expression has a finite verb ("revealed") and stands in the exact slot of a noun ("It shocked the entire board"), functioning as the grammatical subject of the main verb "shocked".',
      concept: 'Pronoun substitution test: if a clause can be replaced cleanly by "It" or "Something", it is a Noun Clause!'
    },
    {
      id: 'was_eng_m8',
      subject: 'english',
      topicId: 'eng_comp',
      difficulty: 'medium',
      question: 'Choose the correct preposition to complete: "The accused clerk was acquitted ___ all charges of embezzlement by the High Court."',
      options: [
        'from',
        'of',
        'for',
        'with'
      ],
      correctIndex: 1,
      explanation: 'Standard English collocation pairs "acquitted" and "accused" and "convicted" with the preposition "of" ("acquitted of charges"), whereas one is "discharged from" custody or "charged with" an offence.',
      concept: 'Legal collocations tested by WAEC: charged WITH, accused OF, convicted OF, acquitted OF, sentenced TO.'
    },
    {
      id: 'was_eng_m9',
      subject: 'english',
      topicId: 'eng_sum',
      difficulty: 'medium',
      question: 'A WASSCE summary question asks: "In THREE sentences, one for each, state three causes of urban traffic congestion." Why does a candidate lose marks for writing: "(i) Because roads are narrow and street traders occupy walkways."?',
      options: [
        'Because Roman numerals are forbidden',
        'Because it is a dependent fragment ("Because...") rather than a complete sentence AND packs two separate points into one sentence',
        'Because "congestion" was not repeated',
        'Because the sentence is under twenty words'
      ],
      correctIndex: 1,
      explanation: 'Starting with "Because..." without a main clause creates an ungrammatical sentence fragment (50% penalty), and combining two causes ("narrow roads" + "street traders") violates the "one sentence for each" rule.',
      concept: 'Every summary sentence must have a clear grammatical subject + finite main verb (e.g., "Narrow roads cause urban traffic congestion.").'
    },
    {
      id: 'was_eng_m10',
      subject: 'english',
      topicId: 'eng_sum',
      difficulty: 'medium',
      question: 'How does an ARTICLE FOR PUBLICATION in a school magazine or national newspaper differ structurally from a FORMAL LETTER in WASSCE Paper 2?',
      options: [
        'An article requires two addresses, a date, "Dear Editor,", and "Yours faithfully,"',
        'An article has a clear title/headline and writer\'s name/designation (at the end or byline), with NO postal addresses, NO salutation ("Dear Sir"), and NO "Yours faithfully"',
        'An article must be written entirely in bullet points',
        'There is zero format difference between an article and a letter to the editor'
      ],
      correctIndex: 1,
      explanation: 'Confusing an article for publication with a letter to the editor is a classic Paper 2 pitfall: articles NEVER include sender/recipient addresses, "Dear Sir,", or "Yours faithfully,"—they use a title and the author\'s full name (+ class/town as required).',
      concept: 'Read the Paper 2 prompt carefully: "Write an article suitable for publication..." != "Write a letter to the editor...".'
    },
    {
      id: 'was_eng_d1',
      subject: 'english',
      topicId: 'eng_gram',
      difficulty: 'difficult',
      question: 'Choose the grammatically correct completion after negative inversion: "No sooner had the invigilator distributed the question papers ___ the heavy downpour began."',
      options: [
        'when',
        'than',
        'before',
        'that'
      ],
      correctIndex: 1,
      explanation: '"No sooner..." is a comparative structure and strictly pairs with "than" (whereas "Hardly / Scarcely / Barely had..." pairs with "when"). Note also the inverted auxiliary "had the invigilator".',
      concept: 'Correlative time pairs: "No sooner + had + subject + past participle... THAN" vs "Hardly/Scarcely + had + subject + past participle... WHEN".'
    },
    {
      id: 'was_eng_d2',
      subject: 'english',
      topicId: 'eng_gram',
      difficulty: 'difficult',
      question: 'Choose the correct verb form after "It is high time": "It is high time the municipal assembly ___ the collapsed drainage channel."',
      options: [
        'repairs',
        'repaired',
        'should repair',
        'has repaired'
      ],
      correctIndex: 1,
      explanation: 'After "It is time / It is high time / It is about time + subject", formal English uses the past subjunctive ("repaired") to express an action that should already have happened.',
      concept: 'High-yield WAEC structure rule: "It is high time + subject + simple past verb" (e.g., "It is high time we left", never "leave" or "should leave").'
    },
    {
      id: 'was_eng_d3',
      subject: 'english',
      topicId: 'eng_gram',
      difficulty: 'difficult',
      question: 'Complete the sentence accurately: "Had the goalkeeper dived a split second earlier, he ___ the penalty kick."',
      options: [
        'would save',
        'would have saved',
        'will have saved',
        'had saved'
      ],
      correctIndex: 1,
      explanation: '"Had the goalkeeper dived..." is an inverted Third Conditional ("If the goalkeeper had dived..."), referring to an unfulfilled past condition; the main clause requires "would have + past participle" ("would have saved").',
      concept: 'Inverted conditionals in WAEC Paper 1: "Had + S + V3..., S + would have + V3" (Type 3); "Were + S + to V1..., S + would + V1" (Type 2).'
    },
    {
      id: 'was_eng_d4',
      subject: 'english',
      topicId: 'eng_lex',
      difficulty: 'difficult',
      question: 'Choose the correct order of adjectives to fill the blank: "The alumni association donated a ___ podium to the assembly hall."',
      options: [
        'carved mahogany rectangular magnificent new',
        'magnificent new rectangular carved mahogany',
        'mahogany magnificent rectangular new carved',
        'new rectangular mahogany magnificent carved'
      ],
      correctIndex: 1,
      explanation: 'Standard English pre-nominal adjective order follows Opinion ("magnificent") -> Age ("new") -> Shape ("rectangular") -> Participle/Style ("carved") -> Material ("mahogany") + Noun ("podium").',
      concept: 'OSASCOMP adjective order: Opinion -> Size -> Age -> Shape -> Colour -> Origin -> Material -> Purpose + Noun.'
    },
    {
      id: 'was_eng_d5',
      subject: 'english',
      topicId: 'eng_oral',
      difficulty: 'difficult',
      question: 'Which pair of words exhibits a shift of primary stress from the FIRST syllable (when used as a noun) to the SECOND syllable (when used as a verb)?',
      options: [
        'VISit (noun) / VISit (verb)',
        'EXport (noun: EX-port) / exPORT (verb: ex-PORT)',
        'WAter (noun) / WAter (verb)',
        'ANSwer (noun) / ANSwer (verb)'
      ],
      correctIndex: 1,
      explanation: 'Two-syllable noun/verb homographs like "export", "import", "rebel", "record", "conduct", "protest", and "permit" take first-syllable stress as nouns/adjectives (EX-port) and second-syllable stress as verbs (ex-PORT). Words like "visit", "water", and "answer" keep first-syllable stress in both roles.',
      concept: 'Watch exceptions in WAEC Oral English: "visit", "promise", "answer", and "travel" do NOT shift stress between noun and verb!'
    },
    {
      id: 'was_eng_d6',
      subject: 'english',
      topicId: 'eng_oral',
      difficulty: 'difficult',
      question: 'Which word contains the VOICED dental fricative /ð/ (as in "THis") rather than the voiceless dental fricative /θ/ (as in "THin")?',
      options: [
        'author',
        'breathe',
        'breath',
        'anthem'
      ],
      correctIndex: 1,
      explanation: 'The verb "breathe" (/bri:ð/) ends in the voiced dental fricative /ð/, whereas the noun "breath" (/breθ/), "author" (/ɔ:θə/), and "anthem" (/ænθəm/) all contain voiceless /θ/.',
      concept: 'Voiceless vs voiced pairs in Oral English: noun "breath" /θ/, "cloth" /θ/, "bath" /θ/ -> verb "breathe" /ð/, "clothe" /ð/, "bathe" /ð/.'
    },
    {
      id: 'was_eng_d7',
      subject: 'english',
      topicId: 'eng_comp',
      difficulty: 'difficult',
      question: 'Identify the grammatical name and function of the bracketed expression in: "[Although the laboratory lacked piped water], the candidates completed their titration accurately."',
      options: [
        'Adverbial clause of concession modifying the verb "completed"',
        'Adverbial phrase of condition modifying "titration"',
        'Noun clause in apposition to "candidates"',
        'Adjectival clause qualifying "laboratory"'
      ],
      correctIndex: 0,
      explanation: 'Introduced by subordinating conjunction "Although" and containing finite verb "lacked", it expresses contrast/concession and modifies the main clause verb "completed".',
      concept: 'Subordinators of concession ("although", "though", "even though", "whereas") introduce Adverbial Clauses of Concession modifying the main verb.'
    },
    {
      id: 'was_eng_d8',
      subject: 'english',
      topicId: 'eng_comp',
      difficulty: 'difficult',
      question: 'Distinguish grammatical error in: "Being a scorching afternoon, Musa rested under the baobab tree."',
      options: [
        'Correct sentence — "Musa" is the subject',
        'Dangling / unattached participle — "Being a scorching afternoon" attaches grammatically to "Musa", implying Musa himself was an afternoon; rewrite as "It being a scorching afternoon, Musa rested..."',
        'Wrong tense — change "rested" to "has rested"',
        'Double negative'
      ],
      correctIndex: 1,
      explanation: 'Without dummy subject "It", the participial phrase "Being a scorching afternoon" modifies "Musa". Supplying "It" ("It being a scorching afternoon..." or "Because it was a scorching afternoon...") resolves the dangling participle.',
      concept: 'Always check that an opening "-ing" or "-ed" participial phrase logically describes the subject immediately following the comma.'
    },
    {
      id: 'was_eng_d9',
      subject: 'english',
      topicId: 'eng_lex',
      difficulty: 'difficult',
      question: 'Choose the correct option: "The board commended the accountant for not giving ___ to pressure to falsify the vouchers, even after several colleagues had given ___ hope."',
      options: [
        'out / in',
        'in / up',
        'away / off',
        'up / out'
      ],
      correctIndex: 1,
      explanation: 'Phrasal verb contrast: "give in (to)" means yield or surrender to pressure/demands, whereas "give up" means abandon hope or stop trying ("give out" means distribute or become exhausted).',
      concept: 'WAEC Paper 1 phrasal verbs: distinguish give in (yield), give up (quit/abandon), give out (distribute/fail), and give away (donate/betray a secret).'
    },
    {
      id: 'was_eng_d10',
      subject: 'english',
      topicId: 'eng_sum',
      difficulty: 'difficult',
      question: 'In a WASSCE formal debate speech ("You are the chief speaker in a debate on the motion..."), what opening vocative order does WAEC expect?',
      options: [
        '"Dear Sir, I am writing to oppose the motion..."',
        '"Mr Chairman, Panel of Judges, Accurate Timekeeper, Co-Debaters, Ladies and Gentlemen," followed by a clear stance FOR or AGAINST the motion',
        '"Hello everyone, let us look at both sides equally without taking a stand."',
        'Sender\'s address in the top-right corner followed by a subject heading'
      ],
      correctIndex: 1,
      explanation: 'A debate is an oral argumentative speech, NOT a letter: begin with formal debate protocol vocatives, take an unambiguous stand for OR against the motion (never sit on the fence!), anticipate and refute at least one opposing argument, and conclude emphatically.',
      concept: 'In WAEC Paper 2 debates, sitting on the fence (arguing 50/50 for both sides) forfeits content and organisation marks—take one clear side!'
    },

    // =========================================================================
    // 2. CORE / GENERAL MATHEMATICS — 30 Questions (10 Easy, 10 Medium, 10 Difficult)
    // =========================================================================
    {
      id: 'was_cmath_e1',
      subject: 'core_maths',
      topicId: 'cmath_num',
      difficulty: 'easy',
      question: 'Convert the binary number 11011 (base 2) to a numeral in base 10.',
      options: [
        '25',
        '27',
        '29',
        '19'
      ],
      correctIndex: 1,
      explanation: 'Expand powers of 2 from right to left: 1(2^4) + 1(2^3) + 0(2^2) + 1(2^1) + 1(2^0) = 16 + 8 + 0 + 2 + 1 = 27 (base 10).',
      concept: 'Place values in base b increase right-to-left as b^0, b^1, b^2, b^3, b^4.'
    },
    {
      id: 'was_cmath_e2',
      subject: 'core_maths',
      topicId: 'cmath_num',
      difficulty: 'easy',
      question: 'Evaluate (23 + 18) mod 7.',
      options: [
        '5',
        '6',
        '4',
        '1'
      ],
      correctIndex: 1,
      explanation: '23 + 18 = 41. Dividing 41 by 7 gives 5 remainder 6 (since 7 × 5 = 35 and 41 - 35 = 6). Therefore (23 + 18) mod 7 = 6.',
      concept: 'In modular arithmetic, a mod n is the non-negative remainder r (0 <= r < n) when a is divided by n.'
    },
    {
      id: 'was_cmath_e3',
      subject: 'core_maths',
      topicId: 'cmath_alg',
      difficulty: 'easy',
      question: 'Solve the quadratic equation x² - 7x + 12 = 0.',
      options: [
        'x = -3 or x = -4',
        'x = 3 or x = 4',
        'x = 2 or x = 6',
        'x = -3 or x = 4'
      ],
      correctIndex: 1,
      explanation: 'Factorise into two numbers whose product is +12 and sum is -7: (x - 3)(x - 4) = 0, giving x = 3 or x = 4.',
      concept: 'After factorising (x - p)(x - q) = 0, remember to flip signs when setting each factor equal to zero!'
    },
    {
      id: 'was_cmath_e4',
      subject: 'core_maths',
      topicId: 'cmath_alg',
      difficulty: 'easy',
      question: 'In a class of 40 students, 25 study Economics, 20 study Government, and every student studies at least one of the two subjects. How many students study BOTH Economics and Government?',
      options: [
        '10',
        '5',
        '15',
        '20'
      ],
      correctIndex: 1,
      explanation: 'Using n(E union G) = n(E) + n(G) - n(E intersect G): 40 = 25 + 20 - x -> 40 = 45 - x -> x = 5 students.',
      concept: 'Two-set union formula: n(A union B) = n(A) + n(B) - n(A intersect B) + n(neither).'
    },
    {
      id: 'was_cmath_e5',
      subject: 'core_maths',
      topicId: 'cmath_geom',
      difficulty: 'easy',
      question: 'Each interior angle of a regular polygon is 140°. How many sides does the polygon have?',
      options: [
        '8',
        '9',
        '10',
        '12'
      ],
      correctIndex: 1,
      explanation: 'Each exterior angle = 180° - 140° = 40°. Since the sum of exterior angles of any convex polygon is 360°, number of sides n = 360° / 40° = 9 (a regular nonagon).',
      concept: 'Fastest polygon shortcut: Exterior angle = 180° - Interior angle, then n = 360° / Exterior angle.'
    },
    {
      id: 'was_cmath_e6',
      subject: 'core_maths',
      topicId: 'cmath_geom',
      difficulty: 'easy',
      question: 'Points P and Q lie on the circumference of a circle with centre O. If the reflex-free angle subtended by arc PQ at the circumference is 54°, what is angle POQ at the centre?',
      options: [
        '27°',
        '108°',
        '126°',
        '54°'
      ],
      correctIndex: 1,
      explanation: 'By the circle theorem, the angle subtended by an arc at the centre of a circle is twice the angle it subtends at any point on the remaining circumference: 2 × 54° = 108°.',
      concept: 'Circle Theorem 1: Angle at centre = 2 × angle at circumference standing on the same arc.'
    },
    {
      id: 'was_cmath_e7',
      subject: 'core_maths',
      topicId: 'cmath_fin',
      difficulty: 'easy',
      question: 'Calculate the simple interest on GH₵ 2,400 invested for 3 years at 12.5% per annum.',
      options: [
        'GH₵ 600',
        'GH₵ 900',
        'GH₵ 300',
        'GH₵ 1,200'
      ],
      correctIndex: 1,
      explanation: 'Simple Interest I = (P × R × T) / 100 = (2400 × 12.5 × 3) / 100 = 24 × 37.5 = GH₵ 900.',
      concept: 'Keep time T in years when rate R is quoted "per annum" (if given in months, divide months by 12).'
    },
    {
      id: 'was_cmath_e8',
      subject: 'core_maths',
      topicId: 'cmath_fin',
      difficulty: 'easy',
      question: 'A trader buys a crate of eggs for ₦4,000 and sells it for ₦4,600. Calculate her percentage profit.',
      options: [
        '13.0%',
        '15.0%',
        '16.7%',
        '12.5%'
      ],
      correctIndex: 1,
      explanation: 'Profit = ₦4,600 - ₦4,000 = ₦600. Percentage profit = (Profit / Cost Price) × 100% = (600 / 4000) × 100% = 15.0%.',
      concept: 'Percentage profit or loss is ALWAYS calculated over Cost Price (never Selling Price) unless explicitly asked otherwise.'
    },
    {
      id: 'was_cmath_e9',
      subject: 'core_maths',
      topicId: 'cmath_stat',
      difficulty: 'easy',
      question: 'Find the median of the data set: 14, 9, 21, 7, 18, 12, 16.',
      options: [
        '21',
        '14',
        '15',
        '12'
      ],
      correctIndex: 1,
      explanation: 'First arrange the 7 values in ascending order: 7, 9, 12, 14, 16, 18, 21. The middle (4th) value is 14.',
      concept: 'Never pick the middle number of an unsorted list—always sort in ascending order first!'
    },
    {
      id: 'was_cmath_e10',
      subject: 'core_maths',
      topicId: 'cmath_stat',
      difficulty: 'easy',
      question: 'A fair six-sided die is rolled once. What is the probability of obtaining a PRIME number?',
      options: [
        '1/3',
        '1/2',
        '2/3',
        '1/6'
      ],
      correctIndex: 1,
      explanation: 'Sample space = {1, 2, 3, 4, 5, 6}. Note that 1 is NOT prime and 2 IS prime, so prime outcomes = {2, 3, 5} -> 3 outcomes out of 6 = 3/6 = 1/2.',
      concept: 'Classic WAEC prime-number trap: 1 is NOT a prime number, and 2 is the only even prime number.'
    },
    {
      id: 'was_cmath_m1',
      subject: 'core_maths',
      topicId: 'cmath_num',
      difficulty: 'medium',
      question: 'Solve for x: 9^(x - 1) = 27^(2 - x).',
      options: [
        'x = 1',
        'x = 8/5 (1.6)',
        'x = 4/5 (0.8)',
        'x = 2'
      ],
      correctIndex: 1,
      explanation: 'Express both sides in base 3: (3²)^(x - 1) = (3³)^(2 - x) -> 3^(2x - 2) = 3^(6 - 3x). Equating exponents: 2x - 2 = 6 - 3x -> 5x = 8 -> x = 8/5 = 1.6.',
      concept: 'Index equation strategy: rewrite 4, 8, 16 in base 2 and 9, 27, 81 in base 3, then multiply powers using (a^m)^n = a^(mn).'
    },
    {
      id: 'was_cmath_m2',
      subject: 'core_maths',
      topicId: 'cmath_num',
      difficulty: 'medium',
      question: 'Simplify and rationalise the denominator: 6 / (3 - sqrt(3)).',
      options: [
        '2 + sqrt(3)',
        '3 + sqrt(3)',
        '3 - sqrt(3)',
        '6 + 2*sqrt(3)'
      ],
      correctIndex: 1,
      explanation: 'Multiply numerator and denominator by the conjugate (3 + sqrt(3)): [6(3 + sqrt(3))] / [3² - (sqrt(3))²] = [6(3 + sqrt(3))] / (9 - 3) = [6(3 + sqrt(3))] / 6 = 3 + sqrt(3).',
      concept: 'Conjugate identity: (a - sqrt(b))(a + sqrt(b)) = a² - b eliminates the square root cleanly.'
    },
    {
      id: 'was_cmath_m3',
      subject: 'core_maths',
      topicId: 'cmath_alg',
      difficulty: 'medium',
      question: 'Variable y varies directly as x² and inversely as z. When x = 3 and z = 2, y = 18. Find the value of y when x = 5 and z = 10.',
      options: [
        '20',
        '10',
        '15',
        '50'
      ],
      correctIndex: 1,
      explanation: 'Write y = k * x² / z. Substitute x = 3, z = 2, y = 18: 18 = k(9)/2 -> 9k = 36 -> k = 4. Now when x = 5 and z = 10: y = 4(25)/10 = 100/10 = 10.',
      concept: 'Joint variation 3-step method: (1) write formula with k, (2) substitute initial values to find k, (3) rewrite explicit law before computing the target value.'
    },
    {
      id: 'was_cmath_m4',
      subject: 'core_maths',
      topicId: 'cmath_alg',
      difficulty: 'medium',
      question: 'The 3rd term of a Geometric Progression (GP) with positive common ratio is 12, and its 6th term is 96. Find the first term a.',
      options: [
        '6',
        '3',
        '4',
        '2'
      ],
      correctIndex: 1,
      explanation: 'In a GP, T_n = a * r^(n - 1). So a * r² = 12 and a * r^5 = 96. Dividing: r³ = 96 / 12 = 8 -> r = 2. Substituting r = 2 into a(2²) = 12 gives 4a = 12 -> a = 3.',
      concept: 'Divide GP term equations (rather than subtracting as in AP) to cancel first term a and solve for common ratio r.'
    },
    {
      id: 'was_cmath_m5',
      subject: 'core_maths',
      topicId: 'cmath_geom',
      difficulty: 'medium',
      question: 'The three-figure bearing of town Q from town P is 065°. What is the back-bearing of town P from town Q?',
      options: [
        '115°',
        '245°',
        '295°',
        '155°'
      ],
      correctIndex: 1,
      explanation: 'Because 065° < 180°, add 180° to obtain the opposite (back) bearing: 065° + 180° = 245°.',
      concept: 'Back-bearing rule: if bearing < 180°, add 180°; if bearing >= 180°, subtract 180° (and always write three digits, e.g., 065°).'
    },
    {
      id: 'was_cmath_m6',
      subject: 'core_maths',
      topicId: 'cmath_geom',
      difficulty: 'medium',
      question: 'Calculate the curved surface area of a solid right circular cone of base radius 7 cm and perpendicular height 24 cm. (Take pi = 22/7)',
      options: [
        '528 cm²',
        '550 cm²',
        '704 cm²',
        '1,232 cm²'
      ],
      correctIndex: 1,
      explanation: 'First find slant height l by Pythagoras: l = sqrt(r² + h²) = sqrt(7² + 24²) = sqrt(49 + 576) = sqrt(625) = 25 cm. Curved surface area = pi * r * l = (22/7) × 7 × 25 = 550 cm².',
      concept: 'Cone trap: Curved Surface Area uses SLANT height l (pi * r * l), whereas Volume uses PERPENDICULAR height h ((1/3) * pi * r² * h).'
    },
    {
      id: 'was_cmath_m7',
      subject: 'core_maths',
      topicId: 'cmath_fin',
      difficulty: 'medium',
      question: 'After allowing a cash discount of 15% on the marked price of a refrigerator, a shopkeeper receives GH₵ 3,400. What was the original marked price?',
      options: [
        'GH₵ 3,910',
        'GH₵ 4,000',
        'GH₵ 3,850',
        'GH₵ 4,200'
      ],
      correctIndex: 1,
      explanation: 'A 15% discount means the customer paid 85% (0.85) of the marked price M: 0.85M = 3400 -> M = 3400 / 0.85 = GH₵ 4,000.',
      concept: 'Reverse-percentage rule: never add 15% onto the discounted price (3400 × 1.15 = 3910 is wrong!); divide by (1 - discount rate).'
    },
    {
      id: 'was_cmath_m8',
      subject: 'core_maths',
      topicId: 'cmath_fin',
      difficulty: 'medium',
      question: 'A delivery van bought for ₦8,000,000 depreciates at 20% per annum on the reducing-balance method. What is its value at the end of 2 years?',
      options: [
        '₦4,800,000',
        '₦5,120,000',
        '₦6,400,000',
        '₦5,000,000'
      ],
      correctIndex: 1,
      explanation: 'Reducing-balance value V = P(1 - r/100)^n = 8,000,000 × (0.80)² = 8,000,000 × 0.64 = ₦5,120,000.',
      concept: 'Compound depreciation multiplies by (1 - r/100)^n each year rather than subtracting 2 × 20% = 40%.'
    },
    {
      id: 'was_cmath_m9',
      subject: 'core_maths',
      topicId: 'cmath_stat',
      difficulty: 'medium',
      question: 'The mean of 6 numbers is 15. When a 7th number is included, the new mean becomes 17. What is the 7th number?',
      options: [
        '19',
        '29',
        '27',
        '32'
      ],
      correctIndex: 1,
      explanation: 'Sum of the first 6 numbers = 6 × 15 = 90. Sum of all 7 numbers = 7 × 17 = 119. Therefore the 7th number = 119 - 90 = 29.',
      concept: 'Mean-sum identity: Total Sum = Mean × Number of items.'
    },
    {
      id: 'was_cmath_m10',
      subject: 'core_maths',
      topicId: 'cmath_stat',
      difficulty: 'medium',
      question: 'A bag contains 5 red balls and 3 blue balls. Two balls are drawn one after the other WITHOUT replacement. Find the probability that both balls are of DIFFERENT colours.',
      options: [
        '15/64',
        '15/28',
        '15/56',
        '5/14'
      ],
      correctIndex: 1,
      explanation: 'Different colours can occur in TWO mutually exclusive orders: P(Red then Blue) + P(Blue then Red) = (5/8 × 3/7) + (3/8 × 5/7) = 15/56 + 15/56 = 30/56 = 15/28.',
      concept: 'When order is not specified ("different colours" / "one of each"), remember to add BOTH branch orders (RB + BR)!'
    },
    {
      id: 'was_cmath_d1',
      subject: 'core_maths',
      topicId: 'cmath_num',
      difficulty: 'difficult',
      question: 'Find the number base x if 234 (base x) = 123 (base 10).',
      options: [
        'x = 6',
        'x = 7',
        'x = 8',
        'x = 5'
      ],
      correctIndex: 1,
      explanation: 'Expand in base x: 2x² + 3x + 4 = 123 -> 2x² + 3x - 119 = 0. Factorise: (2x + 17)(x - 7) = 0. Since a number base must be a positive integer strictly greater than every digit in the numeral (x > 4), x = 7. Check: 2(49) + 3(7) + 4 = 98 + 21 + 4 = 123.',
      concept: 'Base validity check: any base x must be a positive integer greater than the largest digit appearing in that numeral.'
    },
    {
      id: 'was_cmath_d2',
      subject: 'core_maths',
      topicId: 'cmath_num',
      difficulty: 'difficult',
      question: 'Solve for x: log10(x + 2) + log10(x - 1) = 1.',
      options: [
        'x = 3 or x = -4',
        'x = 3 only',
        'x = 4 only',
        'x = 2 only'
      ],
      correctIndex: 1,
      explanation: 'Combine using log10(AB): log10[(x + 2)(x - 1)] = 1 -> (x + 2)(x - 1) = 10^1 = 10 -> x² + x - 12 = 0 -> (x + 4)(x - 3) = 0. Because logarithms of negative numbers are undefined in real numbers (x - 1 > 0 -> x > 1), reject x = -4; hence x = 3 only.',
      concept: 'Always test logarithmic roots in the original expression and discard values that make any log argument <= 0!'
    },
    {
      id: 'was_cmath_d3',
      subject: 'core_maths',
      topicId: 'cmath_alg',
      difficulty: 'difficult',
      question: 'In a group of 60 WASSCE science students, 32 study Physics, 30 study Chemistry, and 28 study Biology. Exactly 15 study Physics and Chemistry, 12 study Chemistry and Biology, 14 study Physics and Biology, and every student studies at least one of the three subjects. How many students study ALL THREE subjects?',
      options: [
        '9',
        '11',
        '13',
        '7'
      ],
      correctIndex: 1,
      explanation: 'By the three-set inclusion-exclusion principle: n(P union C union B) = n(P) + n(C) + n(B) - n(P&C) - n(C&B) - n(P&B) + n(all three). Substituting: 60 = (32 + 30 + 28) - (15 + 12 + 14) + x -> 60 = 90 - 41 + x = 49 + x -> x = 11 students.',
      concept: 'Three-set inclusion-exclusion: Union = Sum(singles) - Sum(pairwise intersections) + Triple intersection.'
    },
    {
      id: 'was_cmath_d4',
      subject: 'core_maths',
      topicId: 'cmath_alg',
      difficulty: 'difficult',
      question: 'The sum of the first n terms of a sequence is given by S_n = 3n² + 2n. Find the 8th term (T_8) of the sequence.',
      options: [
        '208',
        '47',
        '41',
        '53'
      ],
      correctIndex: 1,
      explanation: 'Any individual term equals T_n = S_n - S_(n - 1). Thus T_8 = S_8 - S_7 = [3(64) + 2(8)] - [3(49) + 2(7)] = (192 + 16) - (147 + 14) = 208 - 161 = 47.',
      concept: 'Universal partial-sum identity for any sequence: T_n = S_n - S_(n - 1) for n >= 2 (with T_1 = S_1).'
    },
    {
      id: 'was_cmath_d5',
      subject: 'core_maths',
      topicId: 'cmath_geom',
      difficulty: 'difficult',
      question: 'Line PT is a tangent to a circle at point T, and triangle TQR is inscribed in the circle. If acute angle QTP (between tangent PT and chord TQ) is 58° and interior angle TQR is 74°, find angle QTR.',
      options: [
        '58°',
        '48°',
        '64°',
        '32°'
      ],
      correctIndex: 1,
      explanation: 'By the Alternate Segment Theorem, angle TRQ in the alternate segment equals angle QTP = 58°. Summing angles in triangle TQR: angle QTR = 180° - (74° + 58°) = 180° - 132° = 48°.',
      concept: 'Alternate Segment Theorem: the angle between a tangent and a chord at the point of contact equals the angle subtended by that chord in the alternate segment.'
    },
    {
      id: 'was_cmath_d6',
      subject: 'core_maths',
      topicId: 'cmath_geom',
      difficulty: 'difficult',
      question: 'From the top of a vertical cliff 60 m above calm sea level, the angles of depression of two boats in line due east of the cliff are 60° and 30°. Calculate the exact horizontal distance between the two boats.',
      options: [
        '20*sqrt(3) m',
        '40*sqrt(3) m',
        '60*sqrt(3) m',
        '30*sqrt(3) m'
      ],
      correctIndex: 1,
      explanation: 'By alternate interior angles, angles of elevation from the boats are 60° (nearer boat, d1) and 30° (farther boat, d2). Thus d1 = 60 / tan 60° = 60 / sqrt(3) = 20*sqrt(3) m, and d2 = 60 / tan 30° = 60 * sqrt(3) m. Distance apart = d2 - d1 = 60*sqrt(3) - 20*sqrt(3) = 40*sqrt(3) m.',
      concept: 'Depression angles are measured downward from the HORIZONTAL line of sight (never from the vertical cliff wall!).'
    },
    {
      id: 'was_cmath_d7',
      subject: 'core_maths',
      topicId: 'cmath_fin',
      difficulty: 'difficult',
      question: 'A civil servant earns GH₵ 6,000 monthly. Under a progressive tax schedule, the first GH₵ 1,000 is tax-free, the next GH₵ 2,000 is taxed at 10%, and any remaining income above GH₵ 3,000 is taxed at 20%. Calculate her monthly net (take-home) pay.',
      options: [
        'GH₵ 4,800',
        'GH₵ 5,200',
        'GH₵ 5,000',
        'GH₵ 5,400'
      ],
      correctIndex: 1,
      explanation: 'Band 1 (GH₵ 1,000): GH₵ 0 tax. Band 2 (GH₵ 2,000 × 10%): GH₵ 200 tax. Band 3 (GH₵ 6,000 - GH₵ 3,000 = GH₵ 3,000 × 20%): GH₵ 600 tax. Total tax = 200 + 600 = GH₵ 800. Net pay = GH₵ 6,000 - GH₵ 800 = GH₵ 5,200.',
      concept: 'Progressive income tax is sliced band-by-band—never apply the top 20% rate to the entire gross salary!'
    },
    {
      id: 'was_cmath_d8',
      subject: 'core_maths',
      topicId: 'cmath_fin',
      difficulty: 'difficult',
      question: 'Calculate the compound interest earned when ₦200,000 is invested for 1 year at 20% per annum compounded HALF-YEARLY.',
      options: [
        '₦40,000',
        '₦42,000',
        '₦44,000',
        '₦242,000'
      ],
      correctIndex: 1,
      explanation: 'Half-yearly compounding over 1 year gives n = 2 periods at r = 20% / 2 = 10% per half-year. Total Amount A = 200,000 × (1.10)² = 200,000 × 1.21 = ₦242,000. Compound Interest CI = A - P = 242,000 - 200,000 = ₦42,000.',
      concept: 'Read carefully whether a WAEC question asks for Compound Interest (A - P) or Total Amount (A), and halve the annual rate for semi-annual compounding.'
    },
    {
      id: 'was_cmath_d9',
      subject: 'core_maths',
      topicId: 'cmath_stat',
      difficulty: 'difficult',
      question: 'Calculate the population standard deviation of the five observations: 4, 6, 8, 10, 12.',
      options: [
        '8',
        '2*sqrt(2) (approx. 2.83)',
        '2',
        'sqrt(10) (approx. 3.16)'
      ],
      correctIndex: 1,
      explanation: 'Mean = (4 + 6 + 8 + 10 + 12) / 5 = 40 / 5 = 8. Squared deviations from 8: (-4)² + (-2)² + 0² + 2² + 4² = 16 + 4 + 0 + 4 + 16 = 40. Variance = 40 / 5 = 8; Standard deviation = sqrt(8) = 2*sqrt(2) ≈ 2.83.',
      concept: 'Variance is the mean of squared deviations; remember to take the square root at the final step to obtain standard deviation!'
    },
    {
      id: 'was_cmath_d10',
      subject: 'core_maths',
      topicId: 'cmath_stat',
      difficulty: 'difficult',
      question: 'Kweku\'s probability of solving a WASSCE Mathematics puzzle is 2/3, and Ngozi\'s independent probability of solving the same puzzle is 3/4. If both attempt it independently, what is the probability that the puzzle IS SOLVED (by at least one of them)?',
      options: [
        '1/2',
        '11/12',
        '5/7',
        '7/12'
      ],
      correctIndex: 1,
      explanation: 'The puzzle is solved unless BOTH fail. P(Kweku fails) = 1 - 2/3 = 1/3; P(Ngozi fails) = 1 - 3/4 = 1/4. Since independent, P(both fail) = (1/3)(1/4) = 1/12. Hence P(solved) = 1 - 1/12 = 11/12.',
      concept: 'Complement shortcut for "problem is solved / at least one succeeds": compute 1 - P(all fail).'
    },

    // =========================================================================
    // 3. INTEGRATED SCIENCE — 30 Questions (10 Easy, 10 Medium, 10 Difficult)
    // =========================================================================
    {
      id: 'was_isci_e1',
      subject: 'integrated_science',
      topicId: 'isci_bio',
      difficulty: 'easy',
      question: 'Which organelle is known as the powerhouse of the eukaryotic cell because it carries out aerobic respiration to generate ATP?',
      options: [
        'Ribosome',
        'Mitochondrion',
        'Golgi apparatus',
        'Lysosome'
      ],
      correctIndex: 1,
      explanation: 'Mitochondria oxidise glucose derivatives in aerobic respiration to synthesise ATP; ribosomes synthesise proteins and chloroplasts perform photosynthesis.',
      concept: 'Cells with high energy demand (sperm tails, flight muscle, kidney tubules) are densely packed with mitochondria.'
    },
    {
      id: 'was_isci_e2',
      subject: 'integrated_science',
      topicId: 'isci_bio',
      difficulty: 'easy',
      question: 'Which female insect vector transmits the Plasmodium parasite that causes malaria in West Africa?',
      options: [
        'Aedes aegypti mosquito',
        'Female Anopheles mosquito',
        'Tsetse fly (Glossina)',
        'Blackfly (Simulium)'
      ],
      correctIndex: 1,
      explanation: 'Female Anopheles mosquitoes transmit Plasmodium (malaria); Aedes transmits yellow fever/dengue, tsetse fly transmits trypanosomiasis (sleeping sickness), and Simulium blackfly transmits onchocerciasis (river blindness).',
      concept: 'Know both the causative pathogen (Plasmodium protozoan) and the biological vector (female Anopheles mosquito) for WASSCE Integrated Science.'
    },
    {
      id: 'was_isci_e3',
      subject: 'integrated_science',
      topicId: 'isci_chem',
      difficulty: 'easy',
      question: 'What are the two essential environmental substances required simultaneously for the rusting of iron?',
      options: [
        'Nitrogen and carbon dioxide',
        'Oxygen (air) and water (moisture)',
        'Dry oxygen and sunlight only',
        'Hydrogen and argon'
      ],
      correctIndex: 1,
      explanation: 'Rusting is electrochemical oxidation forming hydrated iron(III) oxide (Fe2O3.xH2O); iron will NOT rust in boiled oil-sealed water (no O2) or in air dried over anhydrous CaCl2 (no H2O).',
      concept: 'Preventing rust (painting, greasing, galvanising with zinc) works by blocking water/oxygen or providing sacrificial protection.'
    },
    {
      id: 'was_isci_e4',
      subject: 'integrated_science',
      topicId: 'isci_chem',
      difficulty: 'easy',
      question: 'An aqueous solution has a pH of 2.5 at 25°C. How is this solution classified and what effect does it have on litmus paper?',
      options: [
        'Weakly alkaline; turns red litmus blue',
        'Strongly acidic; turns damp blue litmus red',
        'Neutral; leaves both litmus papers unchanged',
        'Strongly alkaline; bleaches litmus white'
      ],
      correctIndex: 1,
      explanation: 'On the 0–14 pH scale, pH < 7 is acidic (with 0–3 strongly acidic), pH = 7 is neutral, and pH > 7 is alkaline. Acids turn blue litmus paper red.',
      concept: 'Memory aid: BRA — Blue litmus turns Red in Acid; RBB — Red litmus turns Blue in Base/Alkali.'
    },
    {
      id: 'was_isci_e5',
      subject: 'integrated_science',
      topicId: 'isci_phys',
      difficulty: 'easy',
      question: 'Which mode of heat transfer enables thermal energy from the Sun to travel through the vacuum of space to reach the Earth?',
      options: [
        'Conduction',
        'Radiation',
        'Convection',
        'Evaporation'
      ],
      correctIndex: 1,
      explanation: 'Thermal (infrared) radiation consists of electromagnetic waves that require no material medium, whereas conduction and convection both require matter.',
      concept: 'Dull black surfaces are the best absorbers and emitters of thermal radiation; shiny silver surfaces are poor emitters and good reflectors.'
    },
    {
      id: 'was_isci_e6',
      subject: 'integrated_science',
      topicId: 'isci_phys',
      difficulty: 'easy',
      question: 'Calculate the kinetic energy of a 4 kg stone moving at a speed of 5 m/s.',
      options: [
        '10 J',
        '50 J',
        '20 J',
        '100 J'
      ],
      correctIndex: 1,
      explanation: 'Kinetic energy KE = (1/2)mv² = 0.5 × 4 × 5² = 2 × 25 = 50 J.',
      concept: 'Because speed v is squared in KE = (1/2)mv², doubling speed quadruples kinetic energy.'
    },
    {
      id: 'was_isci_e7',
      subject: 'integrated_science',
      topicId: 'isci_agri',
      difficulty: 'easy',
      question: 'Which soil type is generally best suited for arable crop farming because it combines balanced drainage, good aeration, water retention, and rich humus?',
      options: [
        'Pure coarse sand',
        'Loamy soil',
        'Heavy waterlogged clay',
        'Gravel subsoil'
      ],
      correctIndex: 1,
      explanation: 'Loam balances sand, silt, clay, and organic humus—avoiding both the rapid leaching/droughtiness of sand and the poor aeration/waterlogging of heavy clay.',
      concept: 'Adding organic manure/compost improves both sandy soil (boosts water retention) and clay soil (crumbles structure for aeration).'
    },
    {
      id: 'was_isci_e8',
      subject: 'integrated_science',
      topicId: 'isci_agri',
      difficulty: 'easy',
      question: 'Why are leguminous crops such as cowpea, groundnut, or soyabean always included in a farm crop-rotation programme?',
      options: [
        'They strip all nitrates from the soil to starve weeds',
        'Their root nodules harbour symbiotic Rhizobium bacteria that fix atmospheric nitrogen into soil nitrates',
        'They prevent rainfall from reaching deeper soil layers',
        'They share identical pests with maize and cassava'
      ],
      correctIndex: 1,
      explanation: 'Rhizobium bacteria in legume root nodules convert atmospheric N2 into ammonium/nitrate compounds, naturally replenishing soil fertility for subsequent cereal or root crops.',
      concept: 'Crop rotation principles: alternate deep-rooted with shallow-rooted crops, alternate pest families, and include a nitrogen-fixing legume.'
    },
    {
      id: 'was_isci_e9',
      subject: 'integrated_science',
      topicId: 'isci_env',
      difficulty: 'easy',
      question: 'In a terrestrial food chain: Guinea grass -> Grasshopper -> Toad -> Hawk, which trophic level does the Grasshopper occupy?',
      options: [
        'Producer (1st trophic level)',
        'Primary consumer / herbivore (2nd trophic level)',
        'Secondary consumer (3rd trophic level)',
        'Decomposer'
      ],
      correctIndex: 1,
      explanation: 'Guinea grass is the autotrophic producer (1st trophic level); the herbivorous grasshopper feeding directly on the producer is the primary consumer (2nd trophic level).',
      concept: 'Only ~10% of energy transfers from one trophic level to the next; ~90% is lost via respiration, heat, movement, and egestion.'
    },
    {
      id: 'was_isci_e10',
      subject: 'integrated_science',
      topicId: 'isci_env',
      difficulty: 'easy',
      question: 'What is the primary ecological role of stratospheric ozone (O3)?',
      options: [
        'Causing acid rain over tropical forests',
        'Absorbing harmful ultraviolet (UV) radiation from the Sun before it reaches living organisms',
        'Providing oxygen for deep-sea fish',
        'Fixing nitrogen directly into soil'
      ],
      correctIndex: 1,
      explanation: 'The stratospheric ozone layer shields Earth from mutagenic solar UV-B radiation that increases skin cancer, cataracts, and phytoplankton damage; CFCs deplete this protective layer.',
      concept: 'Keep ozone depletion (CFCs -> UV radiation) distinct from enhanced greenhouse warming (CO2, CH4 -> trapped infrared heat)!'
    },
    {
      id: 'was_isci_m1',
      subject: 'integrated_science',
      topicId: 'isci_bio',
      difficulty: 'medium',
      question: 'What are the final absorbable end-products of digesting (i) starch, (ii) proteins, and (iii) fats/oils in the human ileum?',
      options: [
        'Maltose, polypeptides, and glycerol only',
        'Glucose, amino acids, and fatty acids plus glycerol',
        'Glycogen, urea, and bile salts',
        'Sucrose, pepsin, and emulsified droplets'
      ],
      correctIndex: 1,
      explanation: 'Carbohydrases complete starch digestion to glucose; proteases digest proteins down to amino acids; lipase hydrolyses emulsified lipids into fatty acids and glycerol for absorption across villi.',
      concept: 'Remember that bile (produced in the liver, stored in the gallbladder) contains NO digestive enzymes—it emulsifies fats physically and neutralises stomach chyme.'
    },
    {
      id: 'was_isci_m2',
      subject: 'integrated_science',
      topicId: 'isci_bio',
      difficulty: 'medium',
      question: 'Which blood vessel in the mammalian circulatory system is the ONLY artery that carries deoxygenated blood (in an adult)?',
      options: [
        'Aorta',
        'Pulmonary artery',
        'Pulmonary vein',
        'Hepatic portal vein'
      ],
      correctIndex: 1,
      explanation: 'Arteries are defined as vessels carrying blood AWAY from the heart: the pulmonary artery carries deoxygenated blood from the right ventricle to the lungs, whereas the pulmonary vein returns oxygenated blood to the left atrium.',
      concept: 'Define arteries vs veins by direction of flow (Arteries = Away from heart; Veins = toward heart), not oxygen content!'
    },
    {
      id: 'was_isci_m3',
      subject: 'integrated_science',
      topicId: 'isci_chem',
      difficulty: 'medium',
      question: 'Why does boiling remove TEMPORARY hardness in water but fail to remove PERMANENT hardness?',
      options: [
        'Boiling evaporates calcium sulphate into steam',
        'Boiling decomposes soluble calcium hydrogencarbonate Ca(HCO3)2 into insoluble calcium carbonate (limescale), whereas dissolved CaSO4 and MgSO4 are thermally stable',
        'Permanent hardness is caused by dissolved sodium chloride',
        'Temporary hardness contains no calcium or magnesium ions'
      ],
      correctIndex: 1,
      explanation: 'Temporary hardness is due to Ca(HCO3)2 / Mg(HCO3)2, which precipitates on heating: Ca(HCO3)2(aq) -> CaCO3(s) + H2O(l) + CO2(g). Permanent hardness (CaSO4, MgSO4) requires washing soda (Na2CO3), distillation, or ion-exchange resin.',
      concept: 'Both temporary and permanent hard water waste soap by forming insoluble calcium/magnesium stearate scum before lathering.'
    },
    {
      id: 'was_isci_m4',
      subject: 'integrated_science',
      topicId: 'isci_chem',
      difficulty: 'medium',
      question: 'Which laboratory separation technique best recovers pure dry crystals of copper(II) sulphate (CuSO4.5H2O) from its aqueous solution without decomposing the water of crystallisation?',
      options: [
        'Heating fiercely to complete dryness over a roaring Bunsen flame',
        'Crystallisation (concentrating gently to saturation, cooling to form crystals, filtering, and drying between filter papers)',
        'Separating funnel decantation',
        'Paper chromatography'
      ],
      correctIndex: 1,
      explanation: 'Evaporating to complete dryness drives off water of crystallisation, turning blue hydrated CuSO4.5H2O into white anhydrous CuSO4 powder; controlled crystallisation preserves intact hydrated crystals.',
      concept: 'Use simple evaporation to dryness for thermally stable NaCl, but use crystallisation for hydrated salts (CuSO4.5H2O, FeSO4.7H2O) and thermally labile NH4Cl/sugar.'
    },
    {
      id: 'was_isci_m5',
      subject: 'integrated_science',
      topicId: 'isci_phys',
      difficulty: 'medium',
      question: 'A block-and-tackle pulley system with Velocity Ratio (VR) = 5 lifts a load of 600 N when an effort of 150 N is applied. Calculate the efficiency of the pulley system.',
      options: [
        '75%',
        '80%',
        '85%',
        '60%'
      ],
      correctIndex: 1,
      explanation: 'Mechanical Advantage MA = Load / Effort = 600 / 150 = 4. Efficiency = (MA / VR) × 100% = (4 / 5) × 100% = 80%. (The remaining 20% overcomes friction and the weight of the movable lower block.)',
      concept: 'Real machines always have Efficiency < 100% (MA < VR) because work is expended lifting movable pulley parts and overcoming friction.'
    },
    {
      id: 'was_isci_m6',
      subject: 'integrated_science',
      topicId: 'isci_phys',
      difficulty: 'medium',
      question: 'An electric pressing iron rated 1,500 W is used for 2 hours every day for 10 days. If electricity costs GH₵ 1.20 per kWh, calculate the total cost of operating the iron.',
      options: [
        'GH₵ 18.00',
        'GH₵ 36.00',
        'GH₵ 30.00',
        'GH₵ 24.00'
      ],
      correctIndex: 1,
      explanation: 'Convert power to kilowatts: 1,500 W = 1.5 kW. Total hours = 2 × 10 = 20 h. Electrical energy consumed = 1.5 kW × 20 h = 30 kWh. Cost = 30 × GH₵ 1.20 = GH₵ 36.00.',
      concept: 'Household electricity formula: Energy (kWh) = Power (W / 1000) × Time (hours); Cost = kWh × tariff rate.'
    },
    {
      id: 'was_isci_m7',
      subject: 'integrated_science',
      topicId: 'isci_agri',
      difficulty: 'medium',
      question: 'In ruminant livestock (cattle, sheep, goats), which of the four stomach chambers is the "true stomach" that secretes gastric juice (HCl and pepsin) for chemical digestion?',
      options: [
        'Rumen',
        'Abomasum',
        'Reticulum',
        'Omasum'
      ],
      correctIndex: 1,
      explanation: 'In ruminants, microbial fermentation of cellulose occurs first in the rumen and reticulum (with cud regurgitation), water is absorbed in the omasum, and enzymatic gastric digestion occurs in the abomasum (true stomach).',
      concept: 'Ruminant stomach sequence: Rumen -> Reticulum -> (regurgitate cud) -> Omasum -> Abomasum (true enzymatic stomach).'
    },
    {
      id: 'was_isci_m8',
      subject: 'integrated_science',
      topicId: 'isci_agri',
      difficulty: 'medium',
      question: 'A maize plot shows stunted growth and yellowing (chlorosis) starting on the OLDER lower leaves first. Which major plant macronutrient is most likely deficient?',
      options: [
        'Calcium',
        'Nitrogen',
        'Boron',
        'Iron'
      ],
      correctIndex: 1,
      explanation: 'Nitrogen is a mobile macronutrient essential for chlorophyll and amino acid synthesis; when scarce, the plant translocates nitrogen from older lower leaves to young growing shoots, causing older leaves to turn yellow first.',
      concept: 'NPK summary: N = leafy green growth/chlorophyll; P = strong roots, ATP & early maturity; K = flowering, fruiting & disease resistance.'
    },
    {
      id: 'was_isci_m9',
      subject: 'integrated_science',
      topicId: 'isci_env',
      difficulty: 'medium',
      question: 'What chain of events causes EUTROPHICATION when excess nitrate/phosphate fertiliser and raw sewage wash into a freshwater lake?',
      options: [
        'Water freezes rapidly and kills fish by hypothermia',
        'Algal bloom blocks light to submerged plants -> dead algae/plants are decomposed aerobically by bacteria -> dissolved oxygen plummets -> fish suffocate',
        'Fertiliser directly increases dissolved oxygen to toxic levels',
        'Nitrates turn the lake strongly alkaline and petrify fish gills'
      ],
      correctIndex: 1,
      explanation: 'Nutrient enrichment triggers rapid surface algal blooms; when algae die and sink, aerobic decomposers multiply rapidly and consume dissolved O2 (high BOD), causing mass asphyxiation of fish and aquatic fauna.',
      concept: 'Eutrophication sequence for Paper 2 essays: Nutrient runoff -> Algal bloom -> Light blocked -> Death & aerobic bacterial decay -> Dissolved O2 depletion -> Death of aquatic animals.'
    },
    {
      id: 'was_isci_m10',
      subject: 'integrated_science',
      topicId: 'isci_env',
      difficulty: 'medium',
      question: 'In the nitrogen cycle, which pair of chemoautotrophic soil bacteria carries out NITRIFICATION (oxidising ammonium ions to nitrites and then to nitrates)?',
      options: [
        'Rhizobium and Clostridium',
        'Nitrosomonas and Nitrobacter',
        'Pseudomonas denitrificans and yeast',
        'Plasmodium and Vibrio'
      ],
      correctIndex: 1,
      explanation: 'Nitrosomonas oxidises ammonium ions (NH4+) to nitrites (NO2-), and Nitrobacter oxidises nitrites (NO2-) to plant-absorbable nitrates (NO3-) under well-aerated soil conditions.',
      concept: 'Waterlogged anaerobic soils inhibit nitrifying bacteria and favour denitrifying bacteria (Pseudomonas), which reduce soil nitrates back to N2 gas!'
    },
    {
      id: 'was_isci_d1',
      subject: 'integrated_science',
      topicId: 'isci_bio',
      difficulty: 'difficult',
      question: 'A man with blood group A (heterozygous, I^A I^O) marries a woman with blood group B (heterozygous, I^B I^O). What is the probability that their first child will have blood group O?',
      options: [
        '0% (impossible)',
        '25% (1/4)',
        '50% (1/2)',
        '75% (3/4)'
      ],
      correctIndex: 1,
      explanation: 'Crossing I^A I^O × I^B I^O yields four equally likely genotypes: I^A I^B (group AB), I^A I^O (group A), I^B I^O (group B), and I^O I^O (group O). Thus all four ABO phenotypes are possible, each with probability 1/4 = 25%.',
      concept: 'Heterozygous group A and group B parents is the classic WAEC cross capable of producing ALL FOUR ABO blood groups (A, B, AB, and O).'
    },
    {
      id: 'was_isci_d2',
      subject: 'integrated_science',
      topicId: 'isci_bio',
      difficulty: 'difficult',
      question: 'Why does a potted leafy shoot placed on a potometer record its FASTEST rate of water uptake on a hot, sunny, windy afternoon with low relative humidity?',
      options: [
        'Root hairs actively pump water upward faster when wind shakes the pot',
        'Sunlight opens stomata while heat, dry air, and wind steepen the water-vapour diffusion gradient outside the leaf, accelerating transpiration pull',
        'Photosynthesis converts 100% of absorbed water into sucrose',
        'High humidity blocks evaporation so xylem vessels expand'
      ],
      correctIndex: 1,
      explanation: 'Light stimulates guard cells to open stomata; high temperature increases evaporation from mesophyll cell walls, while wind blows away saturated boundary-layer air—steepening the vapour concentration gradient and increasing transpiration pull.',
      concept: 'Four factors increasing transpiration rate: high light intensity, high temperature, wind/air movement, and LOW relative humidity.'
    },
    {
      id: 'was_isci_d3',
      subject: 'integrated_science',
      topicId: 'isci_chem',
      difficulty: 'difficult',
      question: 'Neutral atom X has mass number 39 and atomic number 19. What is its ground-state electronic configuration and the formula of the oxide it forms with oxygen (atomic number 8)?',
      options: [
        '2, 8, 9; XO',
        '2, 8, 8, 1; X2O',
        '2, 8, 8, 1; XO2',
        '2, 8, 7, 2; X2O3'
      ],
      correctIndex: 1,
      explanation: 'Atomic number 19 (potassium) arranges 19 electrons as 2, 8, 8, 1 (Group 1 alkali metal, valency +1). Oxygen (Z = 8: 2, 6) has valency -2. Crossing valencies gives ionic oxide X2O (K2O).',
      concept: 'For Z = 19 (K) and Z = 20 (Ca), the 4s shell fills after 8 electrons in the 3rd shell: K = 2,8,8,1 and Ca = 2,8,8,2 (never 2,8,9!).'
    },
    {
      id: 'was_isci_d4',
      subject: 'integrated_science',
      topicId: 'isci_chem',
      difficulty: 'difficult',
      question: 'Calculate the mass of pure sodium hydroxide (NaOH) required to prepare 250 cm³ of a 0.40 mol/dm³ aqueous solution. (Relative atomic masses: Na = 23, O = 16, H = 1)',
      options: [
        '16.0 g',
        '4.0 g',
        '10.0 g',
        '2.0 g'
      ],
      correctIndex: 1,
      explanation: 'Molar mass M(NaOH) = 23 + 16 + 1 = 40 g/mol. Volume V = 250 / 1000 = 0.25 dm³. Moles n = C × V = 0.40 × 0.25 = 0.10 mol. Required mass m = n × M = 0.10 × 40 = 4.0 g.',
      concept: 'Always convert cm³ to dm³ (divide by 1000) before applying n = C × V!'
    },
    {
      id: 'was_isci_d5',
      subject: 'integrated_science',
      topicId: 'isci_phys',
      difficulty: 'difficult',
      question: 'Two resistors of 6 ohms and 12 ohms are connected in PARALLEL, and this parallel combination is connected in SERIES with a 2 ohm resistor across a 12 V battery of negligible internal resistance. Find the total current supplied by the battery.',
      options: [
        '0.60 A',
        '2.00 A',
        '3.00 A',
        '1.50 A'
      ],
      correctIndex: 1,
      explanation: 'Parallel equivalent R_p = (6 × 12) / (6 + 12) = 72 / 18 = 4 ohms. Total series resistance R_total = R_p + 2 = 4 + 2 = 6 ohms. Total battery current I = V / R_total = 12 V / 6 ohms = 2.00 A.',
      concept: 'Two-resistor parallel product-over-sum shortcut: R_p = (R1 × R2) / (R1 + R2), which is always smaller than the smallest branch resistor.'
    },
    {
      id: 'was_isci_d6',
      subject: 'integrated_science',
      topicId: 'isci_phys',
      difficulty: 'difficult',
      question: 'Why are high-voltage household appliances (such as air conditioners, electric kettles, and refrigerators) wired in PARALLEL rather than in series, and fitted with a green/yellow EARTH wire on metal casings?',
      options: [
        'Parallel wiring halves the mains voltage to each appliance',
        'Parallel wiring supplies each appliance the full mains voltage independently, while the low-resistance earth wire safely conducts fault current to ground to blow the fuse/trip the breaker if a live wire touches the metal casing',
        'Series wiring uses too much copper wire',
        'The earth wire supplies extra power when mains voltage drops'
      ],
      correctIndex: 1,
      explanation: 'In parallel, each appliance receives full 230/240 V mains PD and operates independently if another switches off. Earthing prevents lethal electrocution if insulation fails and a live conductor contacts a metal body.',
      concept: 'Remember also that fuses and switches MUST always be placed in the LIVE wire—never the neutral wire—so opening them isolates the appliance from high potential.'
    },
    {
      id: 'was_isci_d7',
      subject: 'integrated_science',
      topicId: 'isci_agri',
      difficulty: 'difficult',
      question: 'A farmer dries 50 g of fresh garden soil in an oven at 105°C to constant mass of 41 g, then heats it strongly to red heat in a crucible to burn off humus, leaving 38 g of mineral ash. Calculate the percentage of WATER in the original fresh soil sample.',
      options: [
        '9%',
        '18%',
        '6%',
        '24%'
      ],
      correctIndex: 1,
      explanation: 'Mass of water evaporated at 105°C = 50 g - 41 g = 9 g (heating above 105°C to red heat burns off 41 - 38 = 3 g of organic humus, not free soil water). Percentage water in fresh soil = (9 / 50) × 100% = 18%.',
      concept: 'Soil gravimetric experiment stages: 105°C drives off soil moisture ONLY; strong ignition to red heat oxidises organic matter/humus.'
    },
    {
      id: 'was_isci_d8',
      subject: 'integrated_science',
      topicId: 'isci_agri',
      difficulty: 'difficult',
      question: 'Distinguish INBREEDING from CROSSBREEDING (outbreeding) in farm animal improvement.',
      options: [
        'Inbreeding mates unrelated breeds to create hybrid vigour; crossbreeding mates siblings',
        'Inbreeding mates closely related animals to fix desirable uniform traits (but risks inbreeding depression from harmful recessive alleles), whereas crossbreeding mates different breeds to produce hybrid vigour (heterosis)',
        'Neither method involves genetic inheritance',
        'Crossbreeding only works in vegetative plant propagation'
      ],
      correctIndex: 1,
      explanation: 'Crossbreeding (e.g., crossing exotic high-milk Friesian cattle with heat/trypanosome-tolerant West African White Fulani or N\'Dama cattle) produces F1 offspring combining disease tolerance with higher yield (heterosis).',
      concept: 'West African livestock breeding exams frequently test crossing exotic high-yielding breeds with hardy indigenous breeds to achieve heterosis.'
    },
    {
      id: 'was_isci_d9',
      subject: 'integrated_science',
      topicId: 'isci_env',
      difficulty: 'difficult',
      question: 'Why is carbon monoxide (CO) emitted by poorly ventilated generators and vehicle exhausts in enclosed rooms rapidly fatal even at low concentrations?',
      options: [
        'It freezes lung alveoli on contact',
        'It binds irreversibly (with ~200× higher affinity than oxygen) to haemoglobin to form carboxyhaemoglobin, starving the brain and heart of oxygen',
        'It dissolves in saliva to form concentrated sulphuric acid',
        'It smells strongly of rotten eggs and triggers sneezing'
      ],
      correctIndex: 1,
      explanation: 'Carbon monoxide is colourless and odourless ("silent killer") and forms stable carboxyhaemoglobin, drastically reducing blood oxygen-carrying capacity and causing tissue hypoxia and death.',
      concept: 'Never operate petrol/diesel generators indoors or near bedroom windows—incomplete combustion of hydrocarbons produces lethal CO.'
    },
    {
      id: 'was_isci_d10',
      subject: 'integrated_science',
      topicId: 'isci_env',
      difficulty: 'difficult',
      question: 'In artisanal and illegal small-scale gold mining, why does discharging elemental MERCURY into rivers pose a severe long-term threat to human communities downstream?',
      options: [
        'Mercury evaporates completely within ten minutes of entering river water',
        'Mercury is non-biodegradable and converts to neurotoxic methylmercury, which bioaccumulates in aquatic organisms and biomagnifies to highest concentrations in predatory fish and humans',
        'Mercury acts as a plant fertiliser that turns river water sweet',
        'Boiling river water removes dissolved heavy metals completely'
      ],
      correctIndex: 1,
      explanation: 'Persistent heavy metals (mercury, lead, cadmium) cannot be broken down biologically or removed by boiling; they bioaccumulate within tissues and biomagnify up aquatic food chains, damaging the human central nervous system and kidneys.',
      concept: 'Boiling kills microbes (cholera, typhoid) but NEVER removes dissolved toxic heavy metals or chemical pollutants!'
    },

    // =========================================================================
    // 4. SOCIAL STUDIES & CIVIC EDUCATION — 30 Questions (10 Easy, 10 Medium, 10 Difficult)
    // =========================================================================
    {
      id: 'was_sciv_e1',
      subject: 'social_civic',
      topicId: 'sciv_gov',
      difficulty: 'easy',
      question: 'According to Professor A.V. Dicey, what is the core meaning of the principle of EQUALITY BEFORE THE LAW under the Rule of Law?',
      options: [
        'Only wealthy citizens can hire legal counsel',
        'Every person, regardless of rank or status, is subject to the ordinary laws of the land and ordinary courts without arbitrary privilege',
        'Every citizen receives the exact same monthly salary',
        'Judges are appointed directly by political party youth wings'
      ],
      correctIndex: 1,
      explanation: 'Equality before the law means both rulers and ordinary citizens answer to the same body of constitutional and statutory laws before impartial courts.',
      concept: 'Dicey\'s 3 pillars of Rule of Law: Supremacy of the law, Equality before the law, and Guarantee of fundamental individual liberties.'
    },
    {
      id: 'was_sciv_e2',
      subject: 'social_civic',
      topicId: 'sciv_gov',
      difficulty: 'easy',
      question: 'Which fundamental human right protects a citizen from being detained indefinitely by police without being charged before a competent court?',
      options: [
        'Right to own private land',
        'Right to personal liberty (enforced via writ of habeas corpus)',
        'Right to form trade unions',
        'Freedom of artistic expression'
      ],
      correctIndex: 1,
      explanation: 'Constitutional guarantees of personal liberty require arrested persons to be informed of their offence and brought before a court within the statutory time limit (e.g., 48 hours).',
      concept: 'Habeas corpus ("produce the body") is the judicial writ compelling authorities to justify a detainee\'s custody before a judge.'
    },
    {
      id: 'was_sciv_e3',
      subject: 'social_civic',
      topicId: 'sciv_cit',
      difficulty: 'easy',
      question: 'Which of the following is a CIVIC OBLIGATION (duty) of a citizen rather than a constitutional right?',
      options: [
        'Freedom of conscience and religion',
        'Honest payment of taxes and rates to fund public infrastructure',
        'Right to fair hearing',
        'Freedom of movement'
      ],
      correctIndex: 1,
      explanation: 'Rights are legal entitlements protected by the state, whereas duties/obligations (paying taxes, obeying laws, defending the nation, respecting others\' rights) are responsibilities citizens owe the state.',
      concept: 'Rights and duties are reciprocal: public services (schools, clinics, roads) depend on citizens fulfilling fiscal and legal obligations.'
    },
    {
      id: 'was_sciv_e4',
      subject: 'social_civic',
      topicId: 'sciv_cit',
      difficulty: 'easy',
      question: 'Acquiring citizenship of Ghana or Nigeria automatically because one\'s parents or grandparents are citizens of that country is known as citizenship by:',
      options: [
        'Naturalisation',
        'Birth / Descent (jus sanguinis)',
        'Honorary conferment',
        'Diplomatic immunity'
      ],
      correctIndex: 1,
      explanation: 'In West African constitutions (both Ghana\'s 1992 Constitution and Nigeria\'s 1999 Constitution), citizenship by birth is anchored primarily on blood descent (jus sanguinis) through parents or grandparents.',
      concept: 'Contrast jus sanguinis (citizenship by blood/parentage) with naturalisation (application by long-term legal residents meeting statutory conditions).'
    },
    {
      id: 'was_sciv_e5',
      subject: 'social_civic',
      topicId: 'sciv_fam',
      difficulty: 'easy',
      question: 'Which social institution serves as the PRIMARY agent of socialisation during infancy and early childhood?',
      options: [
        'Political party',
        'The family',
        'Mass media',
        'Professional association'
      ],
      correctIndex: 1,
      explanation: 'The family provides a child\'s earliest language, moral norms, emotional security, and cultural identity before secondary agents (school, peer group, religious bodies, mass media) take over.',
      concept: 'Primary socialisation = family (infancy/early childhood); Secondary socialisation = school, peers, media, workplace, religious institutions.'
    },
    {
      id: 'was_sciv_e6',
      subject: 'social_civic',
      topicId: 'sciv_fam',
      difficulty: 'easy',
      question: 'A household consisting exclusively of a father, a mother, and their biological or adopted children is termed:',
      options: [
        'An extended family',
        'A nuclear family',
        'A matrilineal clan',
        'A gerontocracy'
      ],
      correctIndex: 1,
      explanation: 'A nuclear family comprises parents and their immediate children, whereas an extended family incorporates grandparents, uncles, aunts, cousins, and wider kin.',
      concept: 'Urbanisation, formal schooling, and rising housing costs in West African cities have strengthened nuclear households while preserving extended-family mutual support.'
    },
    {
      id: 'was_sciv_e7',
      subject: 'social_civic',
      topicId: 'sciv_env',
      difficulty: 'easy',
      question: 'Which human activity directly accelerates urban flash flooding across major West African cities such as Accra and Lagos?',
      options: [
        'Dredging storm drains before the rainy season',
        'Dumping solid plastic waste into open gutters and building structures across natural waterways/wetlands',
        'Planting avenue trees along highways',
        'Separating recyclable household plastics'
      ],
      correctIndex: 1,
      explanation: 'Choked storm drains and concrete encroachment onto floodplains/wetlands block surface runoff infiltration and channel capacity during intense tropical rainfall.',
      concept: 'Sustainable flood control combines physical drainage engineering, wetland zoning enforcement, and behavioural sanitation discipline.'
    },
    {
      id: 'was_sciv_e8',
      subject: 'social_civic',
      topicId: 'sciv_env',
      difficulty: 'easy',
      question: 'Which statement about HIV transmission is medically accurate in Civic Education and Social Studies?',
      options: [
        'HIV is spread by sharing classroom desks, hugging, or mosquito bites',
        'HIV is transmitted through unprotected sexual intercourse, unscreened blood transfusion, sharing contaminated sharp instruments, and mother-to-child transmission',
        'Persons living with HIV always look visibly ill from the first week of infection',
        'Antiretroviral therapy (ART) worsens viral replication'
      ],
      correctIndex: 1,
      explanation: 'HIV is NOT spread by casual social contact, sharing utensils, sweat, or insect bites—understanding true routes prevents both new infections and unfair stigmatisation of people living with HIV.',
      concept: 'Eliminating stigma encourages voluntary counselling and testing (VCT) and consistent adherence to antiretroviral therapy (ART).'
    },
    {
      id: 'was_sciv_e9',
      subject: 'social_civic',
      topicId: 'sciv_dev',
      difficulty: 'easy',
      question: 'Who is an ENTREPRENEUR in national economic life?',
      options: [
        'A salaried clerk who avoids all financial decisions',
        'An innovator who identifies market opportunities, mobilises land, labour, and capital, and bears business risk to create value',
        'A customs officer who inspects imported containers',
        'A consumer who spends 100% of household income on imports'
      ],
      correctIndex: 1,
      explanation: 'Entrepreneurship is the fourth factor of production that organises land, labour, and capital, introduces innovation, creates youth employment, and bears uncertainty.',
      concept: 'Youth entrepreneurship reduces over-reliance on scarce public-sector white-collar vacancies.'
    },
    {
      id: 'was_sciv_e10',
      subject: 'social_civic',
      topicId: 'sciv_dev',
      difficulty: 'easy',
      question: 'What does the acronym ECOWAS stand for?',
      options: [
        'Economic Council of Western and Southern States',
        'Economic Community of West African States',
        'Environmental Commission of West African Societies',
        'Educational Cooperation of West African Schools'
      ],
      correctIndex: 1,
      explanation: 'ECOWAS (Economic Community of West African States) was established by the Treaty of Lagos on 28 May 1975 to promote economic integration and collective self-reliance across West Africa.',
      concept: 'Always write regional acronyms out accurately in WASSCE Paper 2 essays before using the abbreviation.'
    },
    {
      id: 'was_sciv_m1',
      subject: 'social_civic',
      topicId: 'sciv_gov',
      difficulty: 'medium',
      question: 'Under what constitutional circumstance may fundamental freedoms such as freedom of movement be lawfully restricted in a democratic West African state?',
      options: [
        'Whenever an opposition rally is scheduled peacefully',
        'During a constitutionally declared state of emergency, public-health quarantine, or lawful custodial sentence ordered by a court',
        'Whenever a traditional ruler dislikes a journalist\'s opinion',
        'Fundamental rights are 100% absolute with zero legal limitations'
      ],
      correctIndex: 1,
      explanation: 'Fundamental rights are not absolute: constitutions permit proportionate, law-backed limitations for public safety, public health emergencies, lawful court-ordered imprisonment, and protection of others\' rights (laws of defamation/libel).',
      concept: 'Know both guarantees AND lawful limitations of rights (libel/slander limits speech; lawful arrest/curfew limits movement; eminent domain with prompt compensation limits property).'
    },
    {
      id: 'was_sciv_m2',
      subject: 'social_civic',
      topicId: 'sciv_gov',
      difficulty: 'medium',
      question: 'Why is an independent Electoral Management Body (such as EC in Ghana or INEC in Nigeria) indispensable to representative democracy?',
      options: [
        'It drafts all bills debated by the legislature',
        'It ensures impartial voter registration, transparent ballot counting, and credible peaceful transfer of political mandate',
        'It appoints Supreme Court justices',
        'It selects party flagbearers without party primaries'
      ],
      correctIndex: 1,
      explanation: 'Without financial, operational, and tenure independence for the electoral commission, incumbents or partisan actors could manipulate voter rolls or results, undermining government legitimacy and civic peace.',
      concept: 'Pillars of free and fair elections: independent electoral commission, universal adult suffrage, secret ballot, impartial security, and judicial election petitions.'
    },
    {
      id: 'was_sciv_m3',
      subject: 'social_civic',
      topicId: 'sciv_cit',
      difficulty: 'medium',
      question: 'What is POLITICAL APATHY, and how does it weaken governance?',
      options: [
        'Active peaceful campaigning for legislative reform',
        'Indifference and non-participation of citizens in voting, civic debates, and public accountability, allowing incompetent or corrupt leaders to hold office unchecked',
        'Registering to vote immediately upon turning 18',
        'Cross-checking manifesto promises against public budgets'
      ],
      correctIndex: 1,
      explanation: 'Political apathy manifests as refusal to register, low voter turnout, and indifference toward governance—reducing democratic accountability and enabling state capture.',
      concept: 'Causes of political apathy include unfulfilled campaign promises, electoral violence, lack of civic education, and perceived rigging; remedies centre on electoral credibility and civic empowerment.'
    },
    {
      id: 'was_sciv_m4',
      subject: 'social_civic',
      topicId: 'sciv_cit',
      difficulty: 'medium',
      question: 'Why do West African secondary schools and universities strictly prohibit secret campus CULTS?',
      options: [
        'Because cult groups organise open academic tutorials',
        'Because campus cultism breeds violent clashes, extortion, examination malpractice, drug abuse, intimidation, and loss of young lives',
        'Because student clubs are never allowed to elect presidents',
        'Because cults encourage inter-ethnic sports competitions'
      ],
      correctIndex: 1,
      explanation: 'Campus cultism destroys academic peace, erodes meritocracy through intimidation, fuels substance abuse and armed violence, and ruins students\' futures through expulsion or imprisonment.',
      concept: 'In Civic Education essays, pair root causes of cultism (peer pressure, quest for protection/power, broken family supervision) with preventive counselling, security, and positive student societies.'
    },
    {
      id: 'was_sciv_m5',
      subject: 'social_civic',
      topicId: 'sciv_fam',
      difficulty: 'medium',
      question: 'A country has 9 million children aged 0–14, 20 million working-age persons aged 15–64, and 1 million elderly persons aged 65+. Calculate its age DEPENDENCY RATIO.',
      options: [
        '45%',
        '50%',
        '33.3%',
        '100%'
      ],
      correctIndex: 1,
      explanation: 'Dependents = (Pop 0–14) + (Pop 65+) = 9 million + 1 million = 10 million. Working-age population (15–64) = 20 million. Dependency ratio = (10 / 20) × 100% = 50% (or 1 : 2).',
      concept: 'High youth dependency ratios require heavy public investment in schools, immunisation, and job creation, reducing household savings rates.'
    },
    {
      id: 'was_sciv_m6',
      subject: 'social_civic',
      topicId: 'sciv_fam',
      difficulty: 'medium',
      question: 'Distinguish MATRILINEAL inheritance from PATRILINEAL inheritance in traditional West African kinship systems.',
      options: [
        'Matrilineal traces descent and lineage property through the mother\'s bloodline (e.g., Akan); patrilineal traces descent and inheritance through the father\'s bloodline (e.g., Ewe, Ga, Yoruba, Igbo, Hausa)',
        'Matrilineal means women hold all political offices exclusively',
        'Patrilineal means children belong to neither parent\'s family',
        'Both systems prohibit statutory wills and intestate succession laws'
      ],
      correctIndex: 0,
      explanation: 'Lineage systems determine clan membership and customary succession; modern statutory laws (such as Ghana\'s Intestate Succession Law PNDC Law 111) protect surviving spouses and children from customary disinheritance.',
      concept: 'Know why statutory intestate succession reforms were enacted: to safeguard nuclear spouses and children when a breadwinner dies without a written will.'
    },
    {
      id: 'was_sciv_m7',
      subject: 'social_civic',
      topicId: 'sciv_env',
      difficulty: 'medium',
      question: 'How does repeated annual BUSH BURNING degrade West African savanna and forest-fringe farmland over time?',
      options: [
        'It permanently multiplies earthworm and nitrogen-fixing bacterial populations',
        'It destroys surface organic humus and beneficial soil microbes, volatilises nitrogen, and leaves bare soil exposed to sheet and gully erosion',
        'It raises the water table during the dry harmattan season',
        'It prevents desert encroachment in the Sahel'
      ],
      correctIndex: 1,
      explanation: 'Although ash gives a brief potash flush, repeated bush burning destroys litter/humus, kills soil decomposers, drives off nitrogen/sulphur as oxides, and strips vegetative cover before heavy onset rains.',
      concept: 'Sustainable alternatives to bush burning include mulching, composting, alley cropping, and controlled firebreaks.'
    },
    {
      id: 'was_sciv_m8',
      subject: 'social_civic',
      topicId: 'sciv_env',
      difficulty: 'medium',
      question: 'What is DRUG ABUSE in Social Studies and Civic Education?',
      options: [
        'Completing a full course of prescribed antimalarial tablets as directed by a pharmacist',
        'Self-medication, overdosing, or non-medical use of psychoactive or prescription substances in a manner harmful to physical, mental, or social functioning',
        'Receiving childhood polio vaccination at a public clinic',
        'Drinking oral rehydration salts (ORS) during diarrhoea'
      ],
      correctIndex: 1,
      explanation: 'Drug abuse encompasses both illicit narcotics (cocaine, heroin, cannabis, tramadol/codeine misuse) AND improper unprescribed use/under-dosing/overdosing of legal medicines such as antibiotics.',
      concept: 'Incomplete antibiotic self-medication also breeds antimicrobial resistance—a major public-health hazard.'
    },
    {
      id: 'was_sciv_m9',
      subject: 'social_civic',
      topicId: 'sciv_dev',
      difficulty: 'medium',
      question: 'What is the fundamental distinction between ECONOMIC GROWTH and ECONOMIC DEVELOPMENT?',
      options: [
        'They mean the exact same thing in all circumstances',
        'Economic growth is a quantitative increase in real national output (GDP), whereas economic development combines sustained growth with qualitative improvements in literacy, healthcare, equity, infrastructure, and living standards',
        'Economic growth measures literacy while economic development measures crude oil barrels only',
        'A country can achieve full economic development while real output shrinks to zero'
      ],
      correctIndex: 1,
      explanation: 'An enclave extractive boom can raise GDP (economic growth) while leaving poverty, unemployment, clinics, and rural roads unchanged; true development transforms human welfare and productive structure.',
      concept: 'Growth without broad human welfare gains is often called "growth without development" in WASSCE Social Studies & Economics.'
    },
    {
      id: 'was_sciv_m10',
      subject: 'social_civic',
      topicId: 'sciv_dev',
      difficulty: 'medium',
      question: 'Why does a weak "maintenance culture" toward public assets (roads, school laboratories, hospitals, power plants) retard national development in West Africa?',
      options: [
        'Routine maintenance costs more than rebuilding collapsed bridges from scratch',
        'Neglecting timely repairs causes premature asset breakdown, diverts scarce capital budgets from new projects into expensive replacements, and disrupts essential services',
        'Public infrastructure belongs to nobody and never wears out',
        'Foreign donors prohibit routine servicing of public equipment'
      ],
      correctIndex: 1,
      explanation: 'Preventive maintenance extends infrastructure lifespan at a fraction of capital replacement cost; neglecting minor potholes or transformer servicing forces costly emergency reconstruction later.',
      concept: 'Positive maintenance culture combines scheduled preventive budgets, technical training, and citizen ownership of community facilities.'
    },
    {
      id: 'was_sciv_d1',
      subject: 'social_civic',
      topicId: 'sciv_gov',
      difficulty: 'difficult',
      question: 'How does JUDICIAL REVIEW strengthen constitutionalism in countries like Ghana and Nigeria?',
      options: [
        'It allows Supreme Court judges to contest parliamentary seats directly',
        'It empowers superior courts to declare any executive action or legislative statute unconstitutional, null, and void to the extent of its inconsistency with the supreme Constitution',
        'It lets the President rewrite court judgements before publication',
        'It abolishes separation of powers between legislature and judiciary'
      ],
      correctIndex: 1,
      explanation: 'Under constitutional supremacy (unlike parliamentary supremacy), any Act of Parliament/National Assembly or executive order that violates the written Constitution can be struck down through judicial review.',
      concept: 'Judicial independence is protected via security of tenure, consolidated-fund salaries, and bipartisan appointment procedures.'
    },
    {
      id: 'was_sciv_d2',
      subject: 'social_civic',
      topicId: 'sciv_gov',
      difficulty: 'difficult',
      question: 'Compare FIRST-PAST-THE-POST (simple plurality) voting with PROPORTIONAL REPRESENTATION in democratic elections.',
      options: [
        'First-past-the-post guarantees every minor party parliamentary seats equal to its national vote share',
        'First-past-the-post awards each single-member constituency to the candidate with the highest vote count (strong local accountability, may under-represent smaller parties), whereas proportional representation allocates seats by party vote percentage',
        'Proportional representation requires a 100% unanimous vote to win any seat',
        'First-past-the-post is used only in military regimes'
      ],
      correctIndex: 1,
      explanation: 'Simple plurality produces clear constituency accountability and stable majorities but can skew seat shares relative to national popular votes; proportional representation mirrors national vote shares more closely.',
      concept: 'Note also that Presidential elections in Ghana (50% + 1 vote) and Nigeria (plurality + >=25% in two-thirds of states + FCT) add stricter threshold rules beyond simple plurality!'
    },
    {
      id: 'was_sciv_d3',
      subject: 'social_civic',
      topicId: 'sciv_cit',
      difficulty: 'difficult',
      question: 'In multi-ethnic West African nations, which policy combination most constructively promotes NATIONAL INTEGRATION without erasing cultural diversity?',
      options: [
        'Banning indigenous languages and reserving all federal/national appointments for one region',
        'Equitable regional character/inclusion in public appointments, inter-regional youth service/boarding education, impartial rule of law, and fair resource allocation',
        'Creating ethnic-only political parties',
        'Replacing constitutional courts with partisan tribunals'
      ],
      correctIndex: 1,
      explanation: 'Unity in diversity thrives when every ethnic and regional group sees fair representation, equal infrastructure access, cross-cultural youth interaction (e.g., NSS in Ghana, NYSC in Nigeria), and non-discriminatory justice.',
      concept: 'Cite concrete national-integration programmes (NYSC/Unity Schools in Nigeria; NSS/inter-regional SHS placement & Constitutional directive principles in Ghana) in Paper 2 essays.'
    },
    {
      id: 'was_sciv_d4',
      subject: 'social_civic',
      topicId: 'sciv_cit',
      difficulty: 'difficult',
      question: 'How does systemic PUBLIC-SECTOR CORRUPTION (bribery, procurement inflation, ghost workers) distort both economic efficiency and social equity?',
      options: [
        'It speeds up merit-based contracting and lowers construction costs',
        'It inflates public project costs, produces substandard roads/schools, deters productive investment, and regressive-taxes poor citizens who rely most on public services',
        'It increases domestic tax morale among honest businesses',
        'It has zero impact on inflation or national debt'
      ],
      correctIndex: 1,
      explanation: 'Procurement kickbacks and ghost-payroll leakage drain scarce revenue, deliver unsafe infrastructure, reward rent-seeking over productivity, and disproportionately hurt low-income households.',
      concept: 'Effective anti-corruption combines digital e-procurement/biometric payrolls, asset declaration, whistleblower protection, and independent prosecution (CHRAJ/OSP in Ghana; ICPC/EFCC in Nigeria).'
    },
    {
      id: 'was_sciv_d5',
      subject: 'social_civic',
      topicId: 'sciv_fam',
      difficulty: 'difficult',
      question: 'Rapid RURAL-URBAN MIGRATION of young school-leavers across West Africa creates a dual socio-economic strain. Which pair accurately captures BOTH rural and urban impacts?',
      options: [
        'Rural labour surplus and falling urban house rents',
        'Ageing agricultural labour force and declining food output in rural areas, paired with informal housing slums, youth underemployment, and overstretched sanitation/transport in cities',
        'Complete elimination of urban unemployment and rural poverty simultaneously',
        'Declining urban population density'
      ],
      correctIndex: 1,
      explanation: 'Rural push factors (low farm incomes, weak amenities) and urban pull factors drain energetic youth from agriculture while overwhelming urban housing, water, power, and formal job absorption.',
      concept: 'Sustainable mitigation focuses on rural agro-processing, electrification, feeder roads, and decentralised tertiary/TVET hubs.'
    },
    {
      id: 'was_sciv_d6',
      subject: 'social_civic',
      topicId: 'sciv_fam',
      difficulty: 'difficult',
      question: 'According to demographic transition analysis, why does expanding girls\' secondary and tertiary education consistently lower total fertility rates and maternal/infant mortality?',
      options: [
        'Educated women are legally barred from marrying',
        'Extended schooling delays early/child marriage, increases health/nutrition literacy and antenatal care uptake, and expands women\'s labour-force autonomy and family-planning choices',
        'Schooling reduces household income',
        'Education affects male life expectancy only'
      ],
      correctIndex: 1,
      explanation: 'Female education is one of the highest-return development levers: delaying first pregnancy past adolescence sharply cuts obstetric complications while boosting child immunisation, nutrition, and school retention.',
      concept: 'Connect demographic policy to human-capital investments (girl-child education, maternal healthcare, reproductive health literacy) rather than coercive rules.'
    },
    {
      id: 'was_sciv_d7',
      subject: 'social_civic',
      topicId: 'sciv_env',
      difficulty: 'difficult',
      question: 'Why does SUSTAINABLE DEVELOPMENT require balancing present resource extraction (forestry, fisheries, minerals) with ecological regeneration and intergenerational equity?',
      options: [
        'Because renewable resources like forests and fish stocks can never collapse regardless of harvest rate',
        'Exceeding regeneration rates depletes natural capital permanently, imposing environmental collapse and poverty on future generations ("meeting present needs without compromising future generations\' ability to meet theirs")',
        'Sustainable development bans all agriculture, mining, and industry',
        'Environmental costs never appear in real household livelihoods'
      ],
      correctIndex: 1,
      explanation: 'Even theoretically renewable resources (timber, groundwater, coastal fisheries) become non-renewable if harvested faster than their natural replenishment threshold.',
      concept: 'Brundtland definition of Sustainable Development: meeting the needs of the present without compromising the ability of future generations to meet their own needs.'
    },
    {
      id: 'was_sciv_d8',
      subject: 'social_civic',
      topicId: 'sciv_env',
      difficulty: 'difficult',
      question: 'Which disaster-management distinction correctly separates MITIGATION/PREVENTION from PREPAREDNESS and RESPONSE?',
      options: [
        'Distributing blankets after a flood is prevention; zoning laws are relief',
        'Mitigation reduces long-term hazard risk before disaster strikes (enforcing building codes, dredging drains, afforestation), whereas preparedness/response covers early-warning drills, evacuation, and emergency relief (NADMO / NEMA)',
        'Emergency agencies only operate after all casualties have recovered',
        'Floods and building collapses are purely supernatural and cannot be mitigated'
      ],
      correctIndex: 1,
      explanation: 'Pre-disaster structural mitigation (zoning, engineering standards, fire hydrants) saves far more lives and money than post-disaster relief hand-outs alone.',
      concept: 'Disaster management cycle: Mitigation -> Preparedness -> Emergency Response -> Recovery/Reconstruction.'
    },
    {
      id: 'was_sciv_d9',
      subject: 'social_civic',
      topicId: 'sciv_dev',
      difficulty: 'difficult',
      question: 'What structural vulnerability arises when a West African economy relies overwhelmingly on exporting unprocessed primary commodities (crude oil, raw cocoa beans, raw gold/bauxite) while importing refined fuels, machinery, and processed foods?',
      options: [
        'Permanently favourable and stable terms of trade',
        'Exposure to volatile global commodity price shocks, loss of domestic value-addition and manufacturing jobs, and chronic foreign-exchange/balance-of-payments pressure',
        'Automatic elimination of imported inflation',
        'Surplus domestic industrial employment'
      ],
      correctIndex: 1,
      explanation: 'Primary commodity prices swing sharply on world markets while manufactured/refined imports carry high value-added margins—exporting raw cocoa and importing chocolate exports jobs and foreign exchange.',
      concept: 'Agro-processing and local beneficiation capture value-added margins, stabilise export earnings, and create skilled technical jobs.'
    },
    {
      id: 'was_sciv_d10',
      subject: 'social_civic',
      topicId: 'sciv_dev',
      difficulty: 'difficult',
      question: 'Despite the ECOWAS Protocol on Free Movement of Persons and Trade Liberalisation Scheme, which structural obstacle continues to limit intra-West African formal trade?',
      options: [
        'Every ECOWAS state uses identical rail gauges and zero border checkpoints',
        'Similar undiversified primary export structures, multiple non-convertible currencies, non-tariff roadblocks/customs delays, and weak cross-border transport corridors',
        'West African countries share no land borders',
        'ECOWAS treaties prohibit manufacturing trade between member states'
      ],
      correctIndex: 1,
      explanation: 'When neighbours export the same raw commodities to Europe/Asia rather than complementary manufactures, combined with currency conversion friction and border delays, intra-regional trade stays well below potential.',
      concept: 'ECOWAS & AfCFTA trade integration requires industrial complementarity, payment settlement systems (PAPSS), and removal of non-tariff barriers.'
    },

    // =========================================================================
    // 5. ELECTIVE / FURTHER MATHEMATICS — 30 Questions (10 Easy, 10 Medium, 10 Difficult)
    // =========================================================================
    {
      id: 'was_emath_e1',
      subject: 'elective_maths',
      topicId: 'emath_alg',
      difficulty: 'easy',
      question: 'Using the Remainder Theorem, find the remainder when f(x) = 2x³ - 5x² + 3x - 4 is divided by (x - 2).',
      options: [
        '6',
        '-2',
        '2',
        '-10'
      ],
      correctIndex: 1,
      explanation: 'By the Remainder Theorem, dividing f(x) by (x - 2) leaves remainder f(2) = 2(2³) - 5(2²) + 3(2) - 4 = 16 - 20 + 6 - 4 = -2.',
      concept: 'Remainder Theorem: when polynomial f(x) is divided by (ax - b), the remainder is f(b/a).'
    },
    {
      id: 'was_emath_e2',
      subject: 'elective_maths',
      topicId: 'emath_alg',
      difficulty: 'easy',
      question: 'If alpha and beta are the roots of the quadratic equation 2x² - 7x + 3 = 0, find the values of (alpha + beta) and (alpha * beta).',
      options: [
        'alpha + beta = -7/2; alpha * beta = 3/2',
        'alpha + beta = 7/2; alpha * beta = 3/2',
        'alpha + beta = 7; alpha * beta = 3',
        'alpha + beta = 3/2; alpha * beta = -7/2'
      ],
      correctIndex: 1,
      explanation: 'For ax² + bx + c = 0 with a = 2, b = -7, c = 3: sum of roots alpha + beta = -b/a = -(-7)/2 = 7/2, and product alpha * beta = c/a = 3/2.',
      concept: 'Never forget to divide by leading coefficient a AND negate b in alpha + beta = -b/a!'
    },
    {
      id: 'was_emath_e3',
      subject: 'elective_maths',
      topicId: 'emath_coord',
      difficulty: 'easy',
      question: 'Find the gradient of any straight line PERPENDICULAR to the line 3x + 4y - 12 = 0.',
      options: [
        '-3/4',
        '4/3',
        '3/4',
        '-4/3'
      ],
      correctIndex: 1,
      explanation: 'Rearrange 3x + 4y - 12 = 0 into slope-intercept form: 4y = -3x + 12 -> y = (-3/4)x + 3, so m1 = -3/4. For perpendicular lines, m1 * m2 = -1 -> m2 = -1 / (-3/4) = 4/3.',
      concept: 'Perpendicular gradient = negative reciprocal (-1 / m1); parallel lines share the exact same gradient m1.'
    },
    {
      id: 'was_emath_e4',
      subject: 'elective_maths',
      topicId: 'emath_coord',
      difficulty: 'easy',
      question: 'Evaluate the determinant of the 2×2 matrix M = [[5, 3], [2, 4]].',
      options: [
        '26',
        '14',
        '-14',
        '11'
      ],
      correctIndex: 1,
      explanation: 'For a 2×2 matrix [[a, b], [c, d]], det(M) = ad - bc = (5)(4) - (3)(2) = 20 - 6 = 14.',
      concept: 'A matrix is singular (has NO inverse) if and only if its determinant equals zero (ad - bc = 0).'
    },
    {
      id: 'was_emath_e5',
      subject: 'elective_maths',
      topicId: 'emath_calc',
      difficulty: 'easy',
      question: 'Given y = 3x^4 - 5x² + 7x - 9, evaluate dy/dx when x = 1.',
      options: [
        '5',
        '9',
        '-5',
        '19'
      ],
      correctIndex: 1,
      explanation: 'Differentiate term-by-term: dy/dx = 12x³ - 10x + 7. At x = 1: dy/dx = 12(1) - 10(1) + 7 = 9.',
      concept: 'Power rule: d/dx(a*x^n) = n*a*x^(n - 1), and the derivative of any constant (-9) is 0.'
    },
    {
      id: 'was_emath_e6',
      subject: 'elective_maths',
      topicId: 'emath_calc',
      difficulty: 'easy',
      question: 'Evaluate the definite integral from x = 0 to x = 3 of (2x + 1) dx.',
      options: [
        '9',
        '12',
        '7',
        '15'
      ],
      correctIndex: 1,
      explanation: 'Antiderivative of (2x + 1) is [x² + x]. Evaluating from 0 to 3 gives (3² + 3) - (0 + 0) = 9 + 3 = 12.',
      concept: 'Fundamental Theorem of Calculus: integral from a to b of f(x) dx = F(b) - F(a).'
    },
    {
      id: 'was_emath_e7',
      subject: 'elective_maths',
      topicId: 'emath_mech',
      difficulty: 'easy',
      question: 'Find the magnitude (modulus) of the vector p = 6i - 8j.',
      options: [
        '2',
        '10',
        '14',
        '100'
      ],
      correctIndex: 1,
      explanation: '|p| = sqrt(6² + (-8)²) = sqrt(36 + 64) = sqrt(100) = 10 units.',
      concept: 'To find the unit vector in the direction of p, divide p by its magnitude: p_hat = (6i - 8j)/10 = 0.6i - 0.8j.'
    },
    {
      id: 'was_emath_e8',
      subject: 'elective_maths',
      topicId: 'emath_mech',
      difficulty: 'easy',
      question: 'A constant net force of 15 N acts on a 3 kg body initially at rest for 0.4 s. Calculate the magnitude of the impulse imparted to the body.',
      options: [
        '18.0 N s',
        '6.0 N s',
        '2.0 N s',
        '37.5 N s'
      ],
      correctIndex: 1,
      explanation: 'Impulse J = F × t = 15 N × 0.4 s = 6.0 N s (which also equals the change in momentum m*v = 6.0 kg m/s, giving final speed 2.0 m/s).',
      concept: 'Impulse-momentum theorem: F × t = m(v - u), measured in N s or equivalently kg m/s.'
    },
    {
      id: 'was_emath_e9',
      subject: 'elective_maths',
      topicId: 'emath_stat',
      difficulty: 'easy',
      question: 'Evaluate 7C3 (the number of ways of choosing 3 prefects from 7 finalists when order does not matter).',
      options: [
        '210',
        '35',
        '21',
        '42'
      ],
      correctIndex: 1,
      explanation: '7C3 = 7! / (3! × 4!) = (7 × 6 × 5) / (3 × 2 × 1) = 210 / 6 = 35.',
      concept: 'Use Combinations (nCr) when selecting an unordered group/committee; use Permutations (nPr) when assigning ordered ranks/offices.'
    },
    {
      id: 'was_emath_e10',
      subject: 'elective_maths',
      topicId: 'emath_stat',
      difficulty: 'easy',
      question: 'In how many distinct ways can all 5 letters of the word "LAGOS" be arranged in a row?',
      options: [
        '25',
        '120',
        '60',
        '20'
      ],
      correctIndex: 1,
      explanation: 'All 5 letters in "LAGOS" are distinct, so the number of permutations is 5! = 5 × 4 × 3 × 2 × 1 = 120.',
      concept: 'n distinct objects in a row can be arranged in n! ways; in a circle (fixing rotational symmetry), (n - 1)! ways.'
    },
    {
      id: 'was_emath_m1',
      subject: 'elective_maths',
      topicId: 'emath_alg',
      difficulty: 'medium',
      question: 'If alpha and beta are the roots of x² - 5x + 3 = 0, evaluate alpha² + beta² without solving the equation.',
      options: [
        '22',
        '19',
        '31',
        '16'
      ],
      correctIndex: 1,
      explanation: 'Here alpha + beta = 5 and alpha * beta = 3. Using the symmetric identity alpha² + beta² = (alpha + beta)² - 2(alpha * beta) = 5² - 2(3) = 25 - 6 = 19.',
      concept: 'Essential WAEC symmetric root identities: alpha² + beta² = (alpha + beta)² - 2*alpha*beta; (alpha - beta)² = (alpha + beta)² - 4*alpha*beta.'
    },
    {
      id: 'was_emath_m2',
      subject: 'elective_maths',
      topicId: 'emath_alg',
      difficulty: 'medium',
      question: 'Find the coefficient of x³ in the binomial expansion of (2 - x)^5.',
      options: [
        '+40',
        '-40',
        '-80',
        '+20'
      ],
      correctIndex: 1,
      explanation: 'General term T_(r+1) = 5Cr * 2^(5 - r) * (-x)^r. Setting r = 3 gives 5C3 * 2² * (-1)³ * x³ = 10 × 4 × (-1)x³ = -40x³, so the coefficient is -40.',
      concept: 'Keep the minus sign attached inside (-x)^r: odd powers of (-x) produce negative coefficients!'
    },
    {
      id: 'was_emath_m3',
      subject: 'elective_maths',
      topicId: 'emath_coord',
      difficulty: 'medium',
      question: 'Find the coordinates of the centre and the length of the radius of the circle x² + y² - 6x + 8y - 11 = 0.',
      options: [
        'Centre (-3, 4), radius = 6',
        'Centre (3, -4), radius = 6',
        'Centre (3, -4), radius = 36',
        'Centre (6, -8), radius = 5'
      ],
      correctIndex: 1,
      explanation: 'Complete the square: (x² - 6x + 9) + (y² + 8y + 16) = 11 + 9 + 16 -> (x - 3)² + (y + 4)² = 36 = 6². Thus centre = (3, -4) and radius r = 6.',
      concept: 'General circle x² + y² + 2gx + 2fy + c = 0 has centre (-g, -f) and radius sqrt(g² + f² - c).'
    },
    {
      id: 'was_emath_m4',
      subject: 'elective_maths',
      topicId: 'emath_coord',
      difficulty: 'medium',
      question: 'Two functions are defined on real numbers by f(x) = 2x + 3 and g(x) = x² - 1. Evaluate the composite value f(g(2)).',
      options: [
        '48',
        '9',
        '15',
        '7'
      ],
      correctIndex: 1,
      explanation: 'Work from the inside out: first g(2) = 2² - 1 = 3; then f(g(2)) = f(3) = 2(3) + 3 = 9. (Note that g(f(2)) = g(7) = 48 is the reverse order!)',
      concept: 'Function composition is NOT commutative: f(g(x)) applies g first and f second.'
    },
    {
      id: 'was_emath_m5',
      subject: 'elective_maths',
      topicId: 'emath_calc',
      difficulty: 'medium',
      question: 'Find the equation of the tangent to the curve y = x² - 4x + 5 at the point (3, 2).',
      options: [
        'y = 2x + 4',
        'y = 2x - 4',
        'x + 2y - 7 = 0',
        'y = 6x - 16'
      ],
      correctIndex: 1,
      explanation: 'Gradient function dy/dx = 2x - 4. At x = 3, gradient m = 2(3) - 4 = 2. Tangent line through (3, 2): y - 2 = 2(x - 3) -> y = 2x - 4.',
      concept: 'For the NORMAL line at the same point, use gradient -1/m = -1/2 -> y - 2 = (-1/2)(x - 3) -> x + 2y - 7 = 0.'
    },
    {
      id: 'was_emath_m6',
      subject: 'elective_maths',
      topicId: 'emath_calc',
      difficulty: 'medium',
      question: 'Calculate the exact area bounded by the curve y = 3x², the x-axis, and the vertical lines x = 1 and x = 2.',
      options: [
        '9 sq. units',
        '7 sq. units',
        '8 sq. units',
        '6 sq. units'
      ],
      correctIndex: 1,
      explanation: 'Since y = 3x² >= 0 on [1, 2], Area = integral from 1 to 2 of 3x² dx = [x³] from 1 to 2 = 2³ - 1³ = 8 - 1 = 7 square units.',
      concept: 'Check sign of y on [a, b] before integrating: if part of the curve dips below the x-axis, integrate |y| by splitting at x-intercepts.'
    },
    {
      id: 'was_emath_m7',
      subject: 'elective_maths',
      topicId: 'emath_mech',
      difficulty: 'medium',
      question: 'Find the scalar constant k such that the vectors p = 3i + kj and q = 4i - 6j are mutually PERPENDICULAR.',
      options: [
        'k = -2',
        'k = 2',
        'k = 9/2',
        'k = -9/2'
      ],
      correctIndex: 1,
      explanation: 'Two non-zero vectors are perpendicular if and only if their dot (scalar) product is zero: p . q = (3)(4) + (k)(-6) = 12 - 6k = 0 -> 6k = 12 -> k = 2.',
      concept: 'Orthogonality test: a . b = ax*bx + ay*by = 0 <=> angle between a and b is 90°.'
    },
    {
      id: 'was_emath_m8',
      subject: 'elective_maths',
      topicId: 'emath_mech',
      difficulty: 'medium',
      question: 'A 2 kg sphere moving at 6 m/s collides with a 4 kg sphere moving in the SAME direction at 3 m/s along a smooth horizontal track. If the two spheres coalesce (stick together) upon impact, find their common speed immediately after collision.',
      options: [
        '4.5 m/s',
        '4.0 m/s',
        '0.0 m/s',
        '2.0 m/s'
      ],
      correctIndex: 1,
      explanation: 'By conservation of linear momentum: m1*u1 + m2*u2 = (m1 + m2)v -> 2(6) + 4(3) = (2 + 4)v -> 12 + 12 = 6v -> 24 = 6v -> v = 4.0 m/s in the original direction.',
      concept: 'Watch directions carefully in momentum problems: if the second sphere had been moving in the OPPOSITE direction, u2 would be -3 m/s!'
    },
    {
      id: 'was_emath_m9',
      subject: 'elective_maths',
      topicId: 'emath_stat',
      difficulty: 'medium',
      question: 'A quiz team of 4 students is to be selected from 5 boys and 4 girls. In how many ways can the team be formed if it must contain AT LEAST 3 girls?',
      options: [
        '20',
        '21',
        '126',
        '16'
      ],
      correctIndex: 1,
      explanation: '"At least 3 girls" in a team of 4 splits into two mutually exclusive cases: Case 1 (3 girls and 1 boy) = 4C3 × 5C1 = 4 × 5 = 20; Case 2 (4 girls and 0 boys) = 4C4 × 5C0 = 1 × 1 = 1. Total = 20 + 1 = 21 ways.',
      concept: 'Break "at least / at most" committee restrictions into disjoint exact-count cases, multiply within each case, and add across cases.'
    },
    {
      id: 'was_emath_m10',
      subject: 'elective_maths',
      topicId: 'emath_stat',
      difficulty: 'medium',
      question: 'A fair coin is tossed 5 times independently. Calculate the probability of obtaining EXACTLY 3 heads.',
      options: [
        '3/5',
        '5/16',
        '1/8',
        '3/32'
      ],
      correctIndex: 1,
      explanation: 'Using X ~ Binomial(n = 5, p = 1/2): P(X = 3) = 5C3 × (1/2)³ × (1/2)² = 10 × (1/32) = 10/32 = 5/16.',
      concept: 'Binomial probability formula: P(X = r) = nCr * p^r * (1 - p)^(n - r).'
    },
    {
      id: 'was_emath_d1',
      subject: 'elective_maths',
      topicId: 'emath_alg',
      difficulty: 'difficult',
      question: 'Decompose (5x + 1) / [(x - 1)(x + 2)] into partial fractions.',
      options: [
        '3/(x - 1) + 2/(x + 2)',
        '2/(x - 1) + 3/(x + 2)',
        '2/(x - 1) - 3/(x + 2)',
        '4/(x - 1) + 1/(x + 2)'
      ],
      correctIndex: 1,
      explanation: 'Set 5x + 1 = A(x + 2) + B(x - 1). Substitute x = 1: 6 = 3A -> A = 2. Substitute x = -2: -9 = -3B -> B = 3. Hence 2/(x - 1) + 3/(x + 2).',
      concept: 'Always verify your partial fractions mentally by recombining numerators: 2(x + 2) + 3(x - 1) = 5x + 1.'
    },
    {
      id: 'was_emath_d2',
      subject: 'elective_maths',
      topicId: 'emath_alg',
      difficulty: 'difficult',
      question: 'If alpha and beta are the roots of 3x² - 5x + 2 = 0, form the quadratic equation with integer coefficients whose roots are 1/alpha and 1/beta.',
      options: [
        '3x² + 5x + 2 = 0',
        '2x² - 5x + 3 = 0',
        '2x² + 5x + 3 = 0',
        'x² - 5x + 6 = 0'
      ],
      correctIndex: 1,
      explanation: 'Here alpha + beta = 5/3 and alpha * beta = 2/3. New sum S = 1/alpha + 1/beta = (alpha + beta)/(alpha * beta) = (5/3)/(2/3) = 5/2. New product P = 1/(alpha * beta) = 3/2. Equation: x² - (5/2)x + 3/2 = 0 -> 2x² - 5x + 3 = 0.',
      concept: 'Reciprocal-roots shortcut: replacing x with 1/x in ax² + bx + c = 0 immediately gives cx² + bx + a = 0!'
    },
    {
      id: 'was_emath_d3',
      subject: 'elective_maths',
      topicId: 'emath_coord',
      difficulty: 'difficult',
      question: 'Find the inverse matrix A^(-1) of A = [[4, 7], [2, 5]].',
      options: [
        '(1/6)[[5, 7], [2, 4]]',
        '(1/6)[[5, -7], [-2, 4]]',
        '(1/34)[[5, -7], [-2, 4]]',
        '(1/6)[[-4, 7], [2, -5]]'
      ],
      correctIndex: 1,
      explanation: 'det(A) = (4)(5) - (7)(2) = 20 - 14 = 6. Swap the leading diagonal (4 and 5), negate the off-diagonal (-7 and -2), and divide by det(A): A^(-1) = (1/6)[[5, -7], [-2, 4]].',
      concept: 'Check your 2×2 matrix inverse by multiplying the first row of A by the first column of A^(-1): (1/6)(20 - 14) = 1.'
    },
    {
      id: 'was_emath_d4',
      subject: 'elective_maths',
      topicId: 'emath_coord',
      difficulty: 'difficult',
      question: 'Given the one-to-one rational function f(x) = (2x - 1) / (x + 3) for x != -3, find its inverse function f^(-1)(x) and state the excluded value in the domain of f^(-1).',
      options: [
        'f^(-1)(x) = (x + 3) / (2x - 1), x != 1/2',
        'f^(-1)(x) = (3x + 1) / (2 - x), x != 2',
        'f^(-1)(x) = (3x - 1) / (x - 2), x != 2',
        'f^(-1)(x) = (2x + 1) / (x - 3), x != 3'
      ],
      correctIndex: 1,
      explanation: 'Let y = (2x - 1)/(x + 3) -> y(x + 3) = 2x - 1 -> xy + 3y = 2x - 1 -> 3y + 1 = x(2 - y) -> x = (3y + 1)/(2 - y). Replacing y with x gives f^(-1)(x) = (3x + 1)/(2 - x), undefined when 2 - x = 0 (x != 2).',
      concept: 'Never confuse reciprocal 1/f(x) with inverse function f^(-1)(x)—solve y = f(x) algebraically for x!'
    },
    {
      id: 'was_emath_d5',
      subject: 'elective_maths',
      topicId: 'emath_calc',
      difficulty: 'difficult',
      question: 'Determine the local MAXIMUM value of the cubic function y = x³ - 6x² + 9x + 1.',
      options: [
        '1 (at x = 3)',
        '5 (at x = 1)',
        '9 (at x = 1)',
        '3 (at x = 2)'
      ],
      correctIndex: 1,
      explanation: 'Set dy/dx = 3x² - 12x + 9 = 3(x - 1)(x - 3) = 0 -> stationary points at x = 1 and x = 3. Second derivative d²y/dx² = 6x - 12: at x = 1, d²y/dx² = -6 < 0 (local maximum). Substituting x = 1 gives y_max = 1 - 6 + 9 + 1 = 5.',
      concept: 'Second-derivative test: d²y/dx² < 0 indicates a local maximum; d²y/dx² > 0 indicates a local minimum; remember to return the y-value when asked for the maximum VALUE!'
    },
    {
      id: 'was_emath_d6',
      subject: 'elective_maths',
      topicId: 'emath_calc',
      difficulty: 'difficult',
      question: 'A particle moves along a straight line such that its velocity at time t seconds is v(t) = 3t² - 6t + 4 m/s. If its displacement s from the origin O is 0 m at t = 0, find its displacement from O when t = 3 s.',
      options: [
        '13 m',
        '12 m',
        '9 m',
        '15 m'
      ],
      correctIndex: 1,
      explanation: 'Integrate velocity to obtain displacement: s(t) = integral of (3t² - 6t + 4) dt = t³ - 3t² + 4t + C. Since s(0) = 0, C = 0. At t = 3: s(3) = 3³ - 3(3²) + 4(3) = 27 - 27 + 12 = 12 m.',
      concept: 'Kinematics calculus ladder: differentiate s -> v -> a; integrate a -> v -> s (using initial conditions to evaluate +C).'
    },
    {
      id: 'was_emath_d7',
      subject: 'elective_maths',
      topicId: 'emath_mech',
      difficulty: 'difficult',
      question: 'A heavy lamp of weight 30 N hangs in static equilibrium from a knot supported by a horizontal cord (tension T1) attached to a wall and an inclined cord at 45° above the horizontal (tension T2) attached to a ceiling. Find T1 and T2.',
      options: [
        'T1 = 15 N, T2 = 30 N',
        'T1 = 30 N, T2 = 30*sqrt(2) N',
        'T1 = 30*sqrt(2) N, T2 = 30 N',
        'T1 = 15*sqrt(2) N, T2 = 15*sqrt(2) N'
      ],
      correctIndex: 1,
      explanation: 'Resolve forces at the knot: Vertically, T2 * sin 45° = 30 -> T2 * (1/sqrt(2)) = 30 -> T2 = 30*sqrt(2) N. Horizontally, T1 = T2 * cos 45° = 30*sqrt(2) * (1/sqrt(2)) = 30 N.',
      concept: 'In static equilibrium, sum of horizontal components = 0 AND sum of vertical components = 0.'
    },
    {
      id: 'was_emath_d8',
      subject: 'elective_maths',
      topicId: 'emath_mech',
      difficulty: 'difficult',
      question: 'Calculate the acute angle theta between the vectors a = i + sqrt(3)j and b = sqrt(3)i + j.',
      options: [
        '60°',
        '30°',
        '45°',
        '15°'
      ],
      correctIndex: 1,
      explanation: 'Dot product a . b = (1)(sqrt(3)) + (sqrt(3))(1) = 2*sqrt(3). Magnitudes: |a| = sqrt(1 + 3) = 2 and |b| = sqrt(3 + 1) = 2. Therefore cos(theta) = (a . b) / (|a||b|) = (2*sqrt(3)) / (2 × 2) = sqrt(3)/2 -> theta = 30°.',
      concept: 'Vector angle formula: cos(theta) = (a . b) / (|a||b|).'
    },
    {
      id: 'was_emath_d9',
      subject: 'elective_maths',
      topicId: 'emath_stat',
      difficulty: 'difficult',
      question: 'How many distinct 7-letter arrangements can be made using all the letters of the word "SUCCESS"?',
      options: [
        '5,040',
        '420',
        '840',
        '210'
      ],
      correctIndex: 1,
      explanation: '"SUCCESS" has 7 letters in total, with S repeated 3 times and C repeated 2 times (U and E once each). Distinct arrangements = 7! / (3! × 2!) = 5040 / (6 × 2) = 5040 / 12 = 420.',
      concept: 'Permutations with identical letters: divide n! by the factorial of the frequency of each repeated letter (n! / (p! * q! ...)).'
    },
    {
      id: 'was_emath_d10',
      subject: 'elective_maths',
      topicId: 'emath_stat',
      difficulty: 'difficult',
      question: 'Five students are ranked in Elective Mathematics and Physics, with no tied ranks. If the sum of squared rank differences (sum of d²) is 4, calculate Spearman\'s rank correlation coefficient r_s.',
      options: [
        '+0.60',
        '+0.80',
        '+0.20',
        '+0.90'
      ],
      correctIndex: 1,
      explanation: 'Using Spearman\'s formula r_s = 1 - (6 × sum d²) / [n(n² - 1)] with n = 5 and sum d² = 4: r_s = 1 - (6 × 4) / [5(25 - 1)] = 1 - 24 / 120 = 1 - 0.20 = +0.80 (strong positive rank correlation).',
      concept: 'Always check that -1 <= r_s <= +1; forgetting the "1 -" at the front of Spearman\'s formula is a common WAEC exam slip!'
    },
    // =========================================================================
    // 6. PHYSICS — 30 Questions (10 Easy, 10 Medium, 10 Difficult)
    // =========================================================================
    {
      id: 'was_phy_e1',
      subject: 'physics',
      topicId: 'phy_mech',
      difficulty: 'easy',
      question: 'A saloon car accelerates uniformly along a straight highway from 10 m/s to 30 m/s in 5.0 s. Calculate the distance covered during this 5.0 s interval.',
      options: [
        '50 m',
        '100 m',
        '150 m',
        '200 m'
      ],
      correctIndex: 1,
      explanation: 'Under uniform acceleration, distance s = ((u + v) / 2) × t = ((10 + 30) / 2) × 5.0 = 20 × 5.0 = 100 m.',
      concept: 'Average-velocity kinematics equation s = ((u + v)/2)t works directly whenever acceleration a is constant.'
    },
    {
      id: 'was_phy_e2',
      subject: 'physics',
      topicId: 'phy_mech',
      difficulty: 'easy',
      question: 'A spiral spring of force constant k = 200 N/m obeys Hooke\'s law. What tensile force is needed to produce an extension of 5.0 cm?',
      options: [
        '1,000 N',
        '10 N',
        '40 N',
        '1.0 N'
      ],
      correctIndex: 1,
      explanation: 'Convert extension to SI metres first: e = 5.0 cm = 0.05 m. By Hooke\'s law, F = k × e = 200 N/m × 0.05 m = 10 N.',
      concept: 'Always convert cm or mm extensions into metres when k is stated in N/m!'
    },
    {
      id: 'was_phy_e3',
      subject: 'physics',
      topicId: 'phy_therm',
      difficulty: 'easy',
      question: 'Calculate the quantity of thermal energy required to raise the temperature of 2.0 kg of water from 25°C to 45°C. (Specific heat capacity of water = 4,200 J/(kg K))',
      options: [
        '84 kJ',
        '168 kJ',
        '210 kJ',
        '42 kJ'
      ],
      correctIndex: 1,
      explanation: 'Q = m × c × delta_theta = 2.0 kg × 4,200 J/(kg K) × (45 - 25) K = 8,400 × 20 = 168,000 J = 168 kJ.',
      concept: 'A temperature CHANGE (delta_theta) has the exact same numerical size in °C and in Kelvin (45 - 25 = 20 K).'
    },
    {
      id: 'was_phy_e4',
      subject: 'physics',
      topicId: 'phy_therm',
      difficulty: 'easy',
      question: 'A fixed mass of dry gas occupies 600 cm³ at a pressure of 100 kPa. Assuming temperature remains constant, what volume will it occupy at a pressure of 150 kPa?',
      options: [
        '900 cm³',
        '400 cm³',
        '300 cm³',
        '450 cm³'
      ],
      correctIndex: 1,
      explanation: 'By Boyle\'s law (P1V1 = P2V2 at constant temperature): 100 × 600 = 150 × V2 -> V2 = 60,000 / 150 = 400 cm³.',
      concept: 'Boyle\'s Law: pressure is inversely proportional to volume for a fixed mass of ideal gas at constant temperature.'
    },
    {
      id: 'was_phy_e5',
      subject: 'physics',
      topicId: 'phy_wave',
      difficulty: 'easy',
      question: 'An FM radio station broadcasts electromagnetic waves at a frequency of 100 MHz (1.0 × 10^8 Hz). If the speed of radio waves in air is 3.0 × 10^8 m/s, calculate the wavelength.',
      options: [
        '0.33 m',
        '3.0 m',
        '30 m',
        '300 m'
      ],
      correctIndex: 1,
      explanation: 'Using c = f × lambda: lambda = c / f = (3.0 × 10^8 m/s) / (1.0 × 10^8 Hz) = 3.0 m.',
      concept: 'All electromagnetic waves (radio, microwaves, IR, visible, UV, X-rays, gamma) travel at 3.0 × 10^8 m/s in vacuum.'
    },
    {
      id: 'was_phy_e6',
      subject: 'physics',
      topicId: 'phy_wave',
      difficulty: 'easy',
      question: 'A student standing in front of a vertical rock cliff claps her hands and hears the echo 1.6 s later. If the speed of sound in air is 340 m/s, how far is she from the cliff?',
      options: [
        '544 m',
        '272 m',
        '136 m',
        '212.5 m'
      ],
      correctIndex: 1,
      explanation: 'Sound travels to the cliff and back (total distance 2d) in time t = 1.6 s: d = (v × t) / 2 = (340 × 1.6) / 2 = 272 m.',
      concept: 'Echo and sonar range formula: always divide v × t by 2 because the wave makes a round trip!'
    },
    {
      id: 'was_phy_e7',
      subject: 'physics',
      topicId: 'phy_elec',
      difficulty: 'easy',
      question: 'Two capacitors of capacitances 4 microfarads and 6 microfarads are connected in PARALLEL. What is their combined equivalent capacitance?',
      options: [
        '2.4 microfarads',
        '10 microfarads',
        '2 microfarads',
        '24 microfarads'
      ],
      correctIndex: 1,
      explanation: 'Capacitors in parallel share the same potential difference and add their effective plate areas directly: C_eq = C1 + C2 = 4 + 6 = 10 microfarads.',
      concept: 'Capacitor formulas are the exact reverse of resistor formulas: parallel C adds (C1 + C2), whereas series C uses 1/C_eq = 1/C1 + 1/C2.'
    },
    {
      id: 'was_phy_e8',
      subject: 'physics',
      topicId: 'phy_elec',
      difficulty: 'easy',
      question: 'An ideal step-down transformer has 2,000 turns on its primary coil connected to a 240 V AC mains supply, and 200 turns on its secondary coil. Calculate the secondary output voltage.',
      options: [
        '2,400 V',
        '24 V',
        '12 V',
        '48 V'
      ],
      correctIndex: 1,
      explanation: 'Using the transformer turns ratio Vs / Vp = Ns / Np: Vs = 240 × (200 / 2,000) = 240 × 0.1 = 24 V.',
      concept: 'Transformers operate ONLY on alternating current (AC) via changing magnetic flux—steady DC produces zero continuous secondary induced EMF.'
    },
    {
      id: 'was_phy_e9',
      subject: 'physics',
      topicId: 'phy_mod',
      difficulty: 'easy',
      question: 'How many NEUTRONS are present in one nucleus of Uranium-238 (mass number A = 238, atomic number Z = 92)?',
      options: [
        '92',
        '146',
        '238',
        '330'
      ],
      correctIndex: 1,
      explanation: 'Neutron number N = Mass number (nucleon number A) - Atomic number (proton number Z) = 238 - 92 = 146 neutrons.',
      concept: 'A = Z + N (protons + neutrons); isotopes of the same element share Z but differ in N.'
    },
    {
      id: 'was_phy_e10',
      subject: 'physics',
      topicId: 'phy_mod',
      difficulty: 'easy',
      question: 'Iodine-131 has a radioactive half-life of 8 days. What mass of an initial 48 g pure sample remains undecayed after 24 days?',
      options: [
        '16 g',
        '6 g',
        '12 g',
        '3 g'
      ],
      correctIndex: 1,
      explanation: 'Number of half-lives elapsed n = 24 days / 8 days = 3 half-lives. Remaining undecayed mass M = M0 / 2^n = 48 / 2³ = 48 / 8 = 6 g (48 -> 24 -> 12 -> 6 g).',
      concept: 'Note the wording in WAEC nuclear questions: "remains undecayed" = M0 / 2^n (6 g), whereas "mass decayed" = M0 - M (42 g).'
    },
    {
      id: 'was_phy_m1',
      subject: 'physics',
      topicId: 'phy_mech',
      difficulty: 'medium',
      question: 'A projectile is launched from level ground with an initial speed of 40 m/s at an angle of 30° above the horizontal. Neglecting air resistance, calculate the maximum vertical height reached. (Take g = 10 m/s²)',
      options: [
        '40 m',
        '20 m',
        '80 m',
        '60 m'
      ],
      correctIndex: 1,
      explanation: 'Initial vertical velocity u_y = u * sin 30° = 40 × 0.5 = 20 m/s. At maximum height v_y = 0, so H = u_y² / (2g) = 20² / (2 × 10) = 400 / 20 = 20 m.',
      concept: 'Projectile summary on level ground: H = (u² sin² theta)/(2g), Time of flight T = (2u sin theta)/g, Range R = (u² sin 2theta)/g (maximum at 45°).'
    },
    {
      id: 'was_phy_m2',
      subject: 'physics',
      topicId: 'phy_mech',
      difficulty: 'medium',
      question: 'A uniform metre rule (100 cm long) of mass 120 g balances horizontally on a knife-edge placed at the 35 cm mark when an unknown mass M is suspended at the 5 cm mark. Calculate M.',
      options: [
        '45 g',
        '60 g',
        '80 g',
        '90 g'
      ],
      correctIndex: 1,
      explanation: 'The weight of a uniform metre rule acts at its 50 cm midpoint (15 cm to the right of the 35 cm pivot). Mass M at the 5 cm mark is 35 - 5 = 30 cm to the left of the pivot. Taking moments about 35 cm: M × 30 = 120 × 15 -> 30M = 1,800 -> M = 60 g.',
      concept: 'Always measure lever arms from the PIVOT (fulcrum) to each line of action—never use the raw ruler mark without subtracting from the pivot position!'
    },
    {
      id: 'was_phy_m3',
      subject: 'physics',
      topicId: 'phy_therm',
      difficulty: 'medium',
      question: 'A fixed mass of ideal gas occupies 300 cm³ at 27°C and 1.0 atm pressure. What volume will it occupy at 127°C and 2.0 atm pressure?',
      options: [
        '400 cm³',
        '200 cm³',
        '150 cm³',
        '705 cm³'
      ],
      correctIndex: 1,
      explanation: 'Convert temperatures to Kelvin first: T1 = 27 + 273 = 300 K; T2 = 127 + 273 = 400 K. By P1V1/T1 = P2V2/T2: (1.0 × 300) / 300 = (2.0 × V2) / 400 -> 1 = V2 / 200 -> V2 = 200 cm³.',
      concept: 'Gas-law golden rule: NEVER substitute °C into P1V1/T1 = P2V2/T2—always convert to absolute Kelvin (T = theta + 273)!'
    },
    {
      id: 'was_phy_m4',
      subject: 'physics',
      topicId: 'phy_therm',
      difficulty: 'medium',
      question: 'Calculate the total heat energy required to convert 0.50 kg of pure ice at 0°C completely into liquid water at 20°C. (Specific latent heat of fusion of ice = 3.36 × 10^5 J/kg; specific heat capacity of water = 4,200 J/(kg K))',
      options: [
        '168 kJ',
        '210 kJ',
        '42 kJ',
        '252 kJ'
      ],
      correctIndex: 1,
      explanation: 'Total heat = Latent heat to melt ice at 0°C + Sensible heat to warm liquid water from 0°C to 20°C: Q = m*L_f + m*c_w*delta_theta = (0.50 × 336,000) + (0.50 × 4,200 × 20) = 168,000 + 42,000 = 210,000 J = 210 kJ.',
      concept: 'Phase changes occur at constant temperature (Q = mL); temperature rises occur within a single phase (Q = mc*delta_theta).'
    },
    {
      id: 'was_phy_m5',
      subject: 'physics',
      topicId: 'phy_wave',
      difficulty: 'medium',
      question: 'An object is placed 18 cm in front of a thin converging (convex) lens of focal length 12 cm. Find the image distance v and linear magnification m.',
      options: [
        'v = 7.2 cm; m = 0.4',
        'v = 36 cm; m = 2.0',
        'v = 24 cm; m = 1.5',
        'v = 30 cm; m = 2.5'
      ],
      correctIndex: 1,
      explanation: 'Using 1/f = 1/u + 1/v: 1/12 = 1/18 + 1/v -> 1/v = 1/12 - 1/18 = (3 - 2) / 36 = 1/36 -> v = 36 cm (real image). Linear magnification m = v / u = 36 / 18 = 2.0.',
      concept: 'An object placed between F and 2F (12 cm < 18 cm < 24 cm) of a convex lens always forms a real, inverted, magnified image beyond 2F.'
    },
    {
      id: 'was_phy_m6',
      subject: 'physics',
      topicId: 'phy_wave',
      difficulty: 'medium',
      question: 'A transparent optical crystal has a refractive index n = 2.0 relative to air. What is the critical angle C for light travelling from this crystal into air, and under what condition does total internal reflection occur?',
      options: [
        'C = 60°; light travels from air into the crystal',
        'C = 30°; light travels from the optically denser crystal toward air at an angle of incidence greater than 30°',
        'C = 45°; light strikes the boundary along the normal (i = 0°)',
        'C = 30°; light travels from air into the crystal at i > 30°'
      ],
      correctIndex: 1,
      explanation: 'sin C = 1 / n = 1 / 2.0 = 0.50 -> C = 30°. Total internal reflection requires TWO conditions: (1) light must travel from an optically denser medium toward a less dense medium, and (2) angle of incidence i > C.',
      concept: 'Optical fibres, prism periscopes, and diamond brilliance all rely on total internal reflection (dense -> less dense, i > C).'
    },
    {
      id: 'was_phy_m7',
      subject: 'physics',
      topicId: 'phy_elec',
      difficulty: 'medium',
      question: 'A cell of EMF 3.0 V and internal resistance 0.5 ohms is connected across a 5.5 ohm external resistor. Calculate the terminal potential difference V across the external resistor.',
      options: [
        '3.00 V',
        '2.75 V',
        '2.50 V',
        '0.25 V'
      ],
      correctIndex: 1,
      explanation: 'Circuit current I = E / (R + r) = 3.0 / (5.5 + 0.5) = 3.0 / 6.0 = 0.50 A. Terminal PD across external load V = I × R = 0.50 × 5.5 = 2.75 V (with "lost volts" I*r = 0.25 V dropped inside the cell).',
      concept: 'EMF E = V_terminal + I*r; terminal PD equals EMF only on open circuit (when current I = 0).'
    },
    {
      id: 'was_phy_m8',
      subject: 'physics',
      topicId: 'phy_elec',
      difficulty: 'medium',
      question: 'Calculate the electrostatic energy stored in a 20 microfarad capacitor when charged to a potential difference of 100 V.',
      options: [
        '1.00 J',
        '0.10 J',
        '2.00 J',
        '0.02 J'
      ],
      correctIndex: 1,
      explanation: 'Energy stored U = (1/2)CV² = 0.5 × (20 × 10^-6 F) × (100 V)² = (10 × 10^-6) × 10,000 = 0.10 J.',
      concept: 'Capacitor energy formulas: U = (1/2)CV² = (1/2)QV = Q²/(2C).'
    },
    {
      id: 'was_phy_m9',
      subject: 'physics',
      topicId: 'phy_mod',
      difficulty: 'medium',
      question: 'A Radium-226 nucleus (A = 226, Z = 88) undergoes one alpha decay followed immediately by one beta-minus decay. What are the mass number A and atomic number Z of the resulting daughter nuclide?',
      options: [
        'A = 222, Z = 85',
        'A = 222, Z = 87',
        'A = 220, Z = 86',
        'A = 222, Z = 86'
      ],
      correctIndex: 1,
      explanation: 'Alpha emission (4,2 He) reduces A by 4 (226 -> 222) and Z by 2 (88 -> 86). Beta-minus emission (0,-1 e: neutron -> proton + electron) leaves A unchanged at 222 and INCREASES Z by 1 (86 -> 87).',
      concept: 'Radioactive decay rules: Alpha -> (A - 4, Z - 2); Beta-minus -> (A unchanged, Z + 1); Gamma -> (A and Z both unchanged).'
    },
    {
      id: 'was_phy_m10',
      subject: 'physics',
      topicId: 'phy_mod',
      difficulty: 'medium',
      question: 'A clean potassium surface has a photoelectric work function W0 = 2.2 eV. When monochromatic ultraviolet light of photon energy 3.8 eV shines on it, what is the maximum kinetic energy of the emitted photoelectrons?',
      options: [
        '6.0 eV',
        '1.6 eV',
        '2.2 eV',
        '0.0 eV'
      ],
      correctIndex: 1,
      explanation: 'By Einstein\'s photoelectric equation hf = W0 + K_max: K_max = hf - W0 = 3.8 eV - 2.2 eV = 1.6 eV.',
      concept: 'In the photoelectric effect, increasing light INTENSITY increases photoelectron current (number emitted per second), whereas only increasing FREQUENCY increases K_max!'
    },
    {
      id: 'was_phy_d1',
      subject: 'physics',
      topicId: 'phy_mech',
      difficulty: 'difficult',
      question: 'A solid alloy block weighs 40 N in air and has an apparent weight of 32 N when completely submerged in pure water (density = 1,000 kg/m³). Calculate the density of the alloy.',
      options: [
        '4,000 kg/m³',
        '5,000 kg/m³',
        '8,000 kg/m³',
        '1,250 kg/m³'
      ],
      correctIndex: 1,
      explanation: 'By Archimedes\' principle, upthrust in water = Weight in air - Apparent weight in water = 40 N - 32 N = 8 N. Relative density of solid = Weight in air / Upthrust in water = 40 / 8 = 5.0. Therefore density = 5.0 × 1,000 kg/m³ = 5,000 kg/m³.',
      concept: 'Relative density shortcut via Archimedes\' principle: RD_solid = W_air / (W_air - W_water).'
    },
    {
      id: 'was_phy_d2',
      subject: 'physics',
      topicId: 'phy_mech',
      difficulty: 'difficult',
      question: 'A steel wire stretches elastically by 2.0 mm when a steady load of 400 N is hung from its lower end (within the limit of proportionality). How much elastic potential (strain) energy is stored in the wire?',
      options: [
        '0.80 J',
        '0.40 J',
        '400 J',
        '0.20 J'
      ],
      correctIndex: 1,
      explanation: 'Because the stretching force increases linearly from 0 to F = 400 N as extension grows to e = 2.0 × 10^-3 m, work done = area under F-e triangle = (1/2)Fe = 0.5 × 400 N × 0.002 m = 0.40 J.',
      concept: 'Don\'t forget the factor of 1/2 in strain energy W = (1/2)Fe = (1/2)ke² (gravity loses F*e = 0.80 J, half stored elastically and half dissipated as oscillations damp out).'
    },
    {
      id: 'was_phy_d3',
      subject: 'physics',
      topicId: 'phy_therm',
      difficulty: 'difficult',
      question: 'A 0.20 kg brass block heated to 100°C is transferred quickly into 0.15 kg of water at 20°C inside a well-lagged vessel of negligible heat capacity. If the final steady equilibrium temperature is 28°C, calculate the specific heat capacity of brass. (c_water = 4,200 J/(kg K))',
      options: [
        '420 J/(kg K)',
        '350 J/(kg K)',
        '380 J/(kg K)',
        '250 J/(kg K)'
      ],
      correctIndex: 1,
      explanation: 'Assuming zero heat loss to surroundings: Heat lost by brass = Heat gained by water -> 0.20 × c_b × (100 - 28) = 0.15 × 4,200 × (28 - 20) -> 14.4 × c_b = 630 × 8 = 5,040 -> c_b = 5,040 / 14.4 = 350 J/(kg K).',
      concept: 'If the calorimeter itself has thermal capacity m_c * c_c, add m_c * c_c * (theta_f - theta_i) to the heat-gained side.'
    },
    {
      id: 'was_phy_d4',
      subject: 'physics',
      topicId: 'phy_mech',
      difficulty: 'difficult',
      question: 'Calculate the TOTAL (absolute) pressure experienced by a diver 25 m below the surface of Lake Volta, given freshwater density = 1,000 kg/m³, g = 10 m/s², and atmospheric pressure P_atm = 1.0 × 10^5 Pa.',
      options: [
        '2.5 × 10^5 Pa',
        '3.5 × 10^5 Pa',
        '1.25 × 10^5 Pa',
        '2.6 × 10^5 Pa'
      ],
      correctIndex: 1,
      explanation: 'Hydrostatic gauge pressure due to water column = rho × g × h = 1,000 × 10 × 25 = 2.5 × 10^5 Pa. Total absolute pressure = P_atm + rho*g*h = 1.0 × 10^5 + 2.5 × 10^5 = 3.5 × 10^5 Pa.',
      concept: 'Distinguish hydrostatic pressure (rho*g*h) from TOTAL pressure below an open liquid surface (P_atm + rho*g*h).'
    },
    {
      id: 'was_phy_d5',
      subject: 'physics',
      topicId: 'phy_wave',
      difficulty: 'difficult',
      question: 'A resonance tube closed at one end has an effective air-column length of 0.85 m. Taking the speed of sound in air as 340 m/s, find its fundamental frequency f0 and its first overtone frequency.',
      options: [
        'f0 = 200 Hz; first overtone = 400 Hz',
        'f0 = 100 Hz; first overtone = 300 Hz',
        'f0 = 100 Hz; first overtone = 200 Hz',
        'f0 = 200 Hz; first overtone = 600 Hz'
      ],
      correctIndex: 1,
      explanation: 'For a pipe closed at one end (node at closed end, antinode at open end), L = lambda_0 / 4 -> lambda_0 = 4 × 0.85 = 3.40 m, so f0 = v / lambda_0 = 340 / 3.40 = 100 Hz. Closed pipes support ONLY odd harmonics (f0, 3f0, 5f0...), so the first overtone is 3f0 = 300 Hz.',
      concept: 'Closed pipe harmonics = odd multiples only (f0, 3f0, 5f0); Open pipe & stretched string harmonics = all integer multiples (f0, 2f0, 3f0).'
    },
    {
      id: 'was_phy_d6',
      subject: 'physics',
      topicId: 'phy_wave',
      difficulty: 'difficult',
      question: 'A sonometer wire of fixed vibrating length emits a fundamental note of 200 Hz when stretched by tension T. What becomes its fundamental frequency if the tension is increased to 4T while length and mass per unit length stay constant?',
      options: [
        '800 Hz',
        '400 Hz',
        '100 Hz',
        '283 Hz'
      ],
      correctIndex: 1,
      explanation: 'For a stretched string, f = (1 / 2L) * sqrt(T / mu), so f is directly proportional to sqrt(T). Quadrupling tension (4T) multiplies frequency by sqrt(4) = 2: f_new = 2 × 200 Hz = 400 Hz.',
      concept: 'Sonometer proportionality laws: f is proportional to 1/L, proportional to sqrt(T), and proportional to 1/sqrt(mu).'
    },
    {
      id: 'was_phy_d7',
      subject: 'physics',
      topicId: 'phy_elec',
      difficulty: 'difficult',
      question: 'In a series R-L-C alternating-current circuit, resistance R = 40 ohms, inductive reactance X_L = 40 ohms, and capacitive reactance X_C = 10 ohms. Calculate the total circuit impedance Z.',
      options: [
        '90 ohms',
        '50 ohms',
        '70 ohms',
        '30 ohms'
      ],
      correctIndex: 1,
      explanation: 'Net reactance X = X_L - X_C = 40 - 10 = 30 ohms (90° out of phase with R). By phasor Pythagoras, impedance Z = sqrt(R² + (X_L - X_C)²) = sqrt(40² + 30²) = sqrt(1,600 + 900) = sqrt(2,500) = 50 ohms.',
      concept: 'Never add R, X_L, and X_C arithmetically—X_L and X_C oppose each other by 180° and combine perpendicular to R (at resonance X_L = X_C, so Z_min = R).'
    },
    {
      id: 'was_phy_d8',
      subject: 'physics',
      topicId: 'phy_elec',
      difficulty: 'difficult',
      question: 'A moving-coil galvanometer of coil resistance 9.0 ohms gives full-scale deflection for a current of 0.10 A. How should a resistor be connected to convert it into an ammeter reading up to 1.0 A?',
      options: [
        '90 ohms connected in series',
        '1.0 ohm shunt connected in parallel',
        '1.0 ohm multiplier connected in series',
        '0.9 ohm connected in series'
      ],
      correctIndex: 1,
      explanation: 'Converting a galvanometer to an ammeter requires a low-resistance SHUNT R_s in parallel to carry the excess current (I - I_g = 1.0 - 0.10 = 0.90 A). Equal parallel PD gives I_g * R_g = (I - I_g) * R_s -> 0.10 × 9.0 = 0.90 × R_s -> R_s = 1.0 ohm in parallel.',
      concept: 'Instrument conversions: Ammeter = low-resistance SHUNT in PARALLEL; Voltmeter = high-resistance MULTIPLIER in SERIES.'
    },
    {
      id: 'was_phy_d9',
      subject: 'physics',
      topicId: 'phy_mod',
      difficulty: 'difficult',
      question: 'In a hydrogen atom, the electron energy levels for n = 2 and n = 3 are -3.40 eV and -1.51 eV respectively. What happens when an electron transitions from n = 3 down to n = 2?',
      options: [
        'A photon of energy 4.91 eV is absorbed',
        'A photon of energy 1.89 eV is emitted',
        'A photon of energy 1.89 eV is absorbed',
        'An electron of kinetic energy 3.40 eV is ejected from the nucleus'
      ],
      correctIndex: 1,
      explanation: 'Dropping from a higher energy level (E3 = -1.51 eV) to a lower energy level (E2 = -3.40 eV) releases an electromagnetic photon of energy delta_E = E3 - E2 = -1.51 - (-3.40) = 1.89 eV.',
      concept: 'Downward electronic transitions EMIT line-spectrum photons; upward transitions ABSORB photons of exact matching energy hf = E_high - E_low.'
    },
    {
      id: 'was_phy_d10',
      subject: 'physics',
      topicId: 'phy_mod',
      difficulty: 'difficult',
      question: 'A nuclear fusion reaction results in a mass defect (loss of rest mass) of 2.0 × 10^-29 kg. Using Einstein\'s mass-energy relation, calculate the energy released. (c = 3.0 × 10^8 m/s)',
      options: [
        '6.0 × 10^-21 J',
        '1.8 × 10^-12 J',
        '9.0 × 10^-13 J',
        '1.8 × 10^-20 J'
      ],
      correctIndex: 1,
      explanation: 'By E = delta_m × c²: E = (2.0 × 10^-29 kg) × (3.0 × 10^8 m/s)² = (2.0 × 10^-29) × (9.0 × 10^16) = 18.0 × 10^-13 J = 1.8 × 10^-12 J.',
      concept: 'Remember to SQUARE the speed of light c² = 9.0 × 10^16 m²/s² in E = delta_m * c².'
    },

    // =========================================================================
    // 7. CHEMISTRY — 30 Questions (10 Easy, 10 Medium, 10 Difficult)
    // =========================================================================
    {
      id: 'was_chem_e1',
      subject: 'chemistry',
      topicId: 'chem_atom',
      difficulty: 'easy',
      question: 'Why do Chlorine-35 (Z = 17, A = 35) and Chlorine-37 (Z = 17, A = 37) exhibit virtually identical chemical properties?',
      options: [
        'They have the same number of neutrons in their nuclei',
        'They are isotopes with the exact same number of protons and valence electrons (2, 8, 7)',
        'They have identical densities and diffusion rates',
        'Both are noble gases in Group 18'
      ],
      correctIndex: 1,
      explanation: 'Chemical reactions depend on outer-shell electronic configuration (7 valence electrons for Z = 17), which is identical in both isotopes; differing neutron counts (18 vs 20) affect only physical properties like mass and density.',
      concept: 'Isotopes: same atomic number Z -> identical chemical properties, slightly different physical properties.'
    },
    {
      id: 'was_chem_e2',
      subject: 'chemistry',
      topicId: 'chem_atom',
      difficulty: 'easy',
      question: 'What type of chemical bond and empirical formula are formed when Calcium (Z = 20) reacts with Chlorine (Z = 17)?',
      options: [
        'Covalent bond; CaCl',
        'Electrovalent (ionic) bond; CaCl2',
        'Metallic bond; Ca2Cl',
        'Coordinate (dative) bond; CaCl3'
      ],
      correctIndex: 1,
      explanation: 'Calcium (2,8,8,2) loses 2 valence electrons to form Ca^(2+), transferring 1 electron to each of two chlorine atoms (2,8,7 -> Cl^-) to form giant ionic CaCl2.',
      concept: 'Metal (low ionisation energy) + non-metal (high electronegativity) -> electron transfer -> electrovalent/ionic lattice.'
    },
    {
      id: 'was_chem_e3',
      subject: 'chemistry',
      topicId: 'chem_stoich',
      difficulty: 'easy',
      question: 'What volume does 0.25 mol of carbon(IV) oxide (CO2) gas occupy at Standard Temperature and Pressure (STP)? (Molar gas volume at STP = 22.4 dm³/mol)',
      options: [
        '11.2 dm³',
        '5.6 dm³',
        '2.8 dm³',
        '44.8 dm³'
      ],
      correctIndex: 1,
      explanation: 'At STP, Volume V = n × V_m = 0.25 mol × 22.4 dm³/mol = 5.6 dm³.',
      concept: 'By Avogadro\'s law, equal moles of ANY ideal gas occupy equal volumes (22.4 dm³ at STP) regardless of molar mass.'
    },
    {
      id: 'was_chem_e4',
      subject: 'chemistry',
      topicId: 'chem_stoich',
      difficulty: 'easy',
      question: 'A gaseous hydrocarbon contains 80.0% carbon and 20.0% hydrogen by mass. Determine its empirical formula. (C = 12, H = 1)',
      options: [
        'CH2',
        'CH3',
        'C2H5',
        'CH4'
      ],
      correctIndex: 1,
      explanation: 'Divide mass percentages by relative atomic masses: C = 80.0 / 12 = 6.67; H = 20.0 / 1 = 20.0. Divide both by the smaller value (6.67): C = 1, H = 20.0 / 6.67 = 3 -> empirical formula CH3 (e.g., ethane C2H6).',
      concept: 'Empirical formula gives the simplest whole-number mole ratio; multiply by n = (Molar mass / Empirical mass) to get molecular formula.'
    },
    {
      id: 'was_chem_e5',
      subject: 'chemistry',
      topicId: 'chem_acid',
      difficulty: 'easy',
      question: 'Determine the oxidation number of Manganese (Mn) in potassium tetraoxomanganate(VII), KMnO4.',
      options: [
        '+4',
        '+7',
        '+6',
        '+2'
      ],
      correctIndex: 1,
      explanation: 'Assign K = +1 and O = -2 in neutral KMnO4: (+1) + Mn + 4(-2) = 0 -> Mn - 7 = 0 -> Mn = +7 (reflected directly in its IUPAC name tetraoxomanganate(VII)).',
      concept: 'Sum of oxidation states in a neutral compound = 0; in a polyatomic ion (such as MnO4^-), it equals the ion\'s charge (-1).'
    },
    {
      id: 'was_chem_e6',
      subject: 'chemistry',
      topicId: 'chem_acid',
      difficulty: 'easy',
      question: 'Calculate the pH of a 0.001 mol/dm³ (1.0 × 10^-3 mol/dm³) aqueous solution of hydrochloric acid (HCl) assuming complete ionisation.',
      options: [
        '1.0',
        '3.0',
        '11.0',
        '2.0'
      ],
      correctIndex: 1,
      explanation: 'HCl is a strong monobasic acid, so [H+] = 1.0 × 10^-3 mol/dm³. pH = -log10[H+] = -log10(10^-3) = 3.0.',
      concept: 'For a strong dibasic acid like 0.005 mol/dm³ H2SO4, multiply concentration by 2 first ([H+] = 0.01 = 10^-2 -> pH = 2.0)!'
    },
    {
      id: 'was_chem_e7',
      subject: 'chemistry',
      topicId: 'chem_kin',
      difficulty: 'easy',
      question: 'Why does powdered calcium trioxocarbonate(IV) (CaCO3) react much faster with dilute HCl than an equal mass of large marble lumps at the same temperature?',
      options: [
        'Grinding increases the molar mass of CaCO3',
        'Powdered CaCO3 exposes a much larger total surface area, increasing the frequency of effective H+ ion collisions per second',
        'Grinding makes the reaction endothermic',
        'Powdered CaCO3 acts as a catalyst that is not consumed'
      ],
      correctIndex: 1,
      explanation: 'Subdividing a solid reactant exposes many more surface ions to attack simultaneously, raising collision frequency without altering total gas volume produced (assuming CaCO3 is limiting).',
      concept: 'Surface area changes initial gradient (rate) on a gas-volume vs time curve, NOT the final plateau volume!'
    },
    {
      id: 'was_chem_e8',
      subject: 'chemistry',
      topicId: 'chem_kin',
      difficulty: 'easy',
      question: 'When solid ammonium chloride (NH4Cl) dissolves in a beaker of water at room temperature, the outside of the beaker feels noticeably cold. What does this observation show?',
      options: [
        'Dissolution is exothermic with delta H < 0',
        'Dissolution is endothermic (delta H > 0), absorbing thermal energy from the water and glass',
        'Ammonium chloride has undergone nuclear fission',
        'Activation energy is zero'
      ],
      correctIndex: 1,
      explanation: 'Endothermic processes absorb heat from their immediate surroundings (lowering solution temperature, delta H > 0), whereas exothermic dissolutions (e.g., NaOH pellets or conc. H2SO4 in water) warm the beaker (delta H < 0).',
      concept: 'Surroundings temperature test: Beaker gets COLD -> Endothermic (+delta H); Beaker gets HOT -> Exothermic (-delta H).'
    },
    {
      id: 'was_chem_e9',
      subject: 'chemistry',
      topicId: 'chem_org',
      difficulty: 'easy',
      question: 'What is the general molecular formula of the ALKENE homologous series?',
      options: [
        'C_n H_(2n + 2)',
        'C_n H_2n',
        'C_n H_(2n - 2)',
        'C_n H_(2n + 1) OH'
      ],
      correctIndex: 1,
      explanation: 'Open-chain alkenes contain one C=C double bond and follow C_n H_2n (starting at n = 2, ethene C2H4); alkanes are C_n H_(2n+2) and alkynes are C_n H_(2n-2).',
      concept: 'Adjacent members of any homologous series differ by a -CH2- unit (molar mass difference of 14 g/mol).'
    },
    {
      id: 'was_chem_e10',
      subject: 'chemistry',
      topicId: 'chem_org',
      difficulty: 'easy',
      question: 'Warming ethanol with ethanoic acid in the presence of a few drops of concentrated H2SO4 produces a sweet, fruity-smelling liquid. Name this reaction and the organic product.',
      options: [
        'Saponification; sodium ethanoate',
        'Esterification; ethyl ethanoate',
        'Fermentation; ethanal',
        'Hydrogenation; butane'
      ],
      correctIndex: 1,
      explanation: 'Alkanol + alkanoic acid ⇌ alkyl alkanoate (ester) + water: C2H5OH + CH3COOH ⇌ CH3COOC2H5 (ethyl ethanoate) + H2O, with conc. H2SO4 acting as both catalyst and dehydrating agent.',
      concept: 'Ester naming rule: the first part ("ethyl") comes from the alkanol; the "-oate" part ("ethanoate") comes from the alkanoic acid.'
    },
    {
      id: 'was_chem_m1',
      subject: 'chemistry',
      topicId: 'chem_atom',
      difficulty: 'medium',
      question: 'Naturally occurring chlorine consists of 75% Chlorine-35 and 25% Chlorine-37. Calculate the relative atomic mass of chlorine.',
      options: [
        '36.0',
        '35.5',
        '36.5',
        '35.2'
      ],
      correctIndex: 1,
      explanation: 'Relative atomic mass A_r = (75 × 35 + 25 × 37) / 100 = (2,625 + 925) / 100 = 3,550 / 100 = 35.5.',
      concept: 'Weighted average A_r always lies closer to the mass of the more abundant isotope (35).'
    },
    {
      id: 'was_chem_m2',
      subject: 'chemistry',
      topicId: 'chem_atom',
      difficulty: 'medium',
      question: 'Diamond and graphite are both allotropes of pure carbon. Why does graphite conduct electricity whereas diamond is an electrical insulator?',
      options: [
        'Graphite contains free sodium ions between its layers',
        'Each carbon atom in graphite bonds covalently to 3 neighbours (sp²), leaving 1 delocalised mobile electron per atom along its hexagonal layers, whereas diamond uses all 4 valence electrons in rigid sp³ covalent bonds',
        'Diamond is a simple molecular gas at room temperature',
        'Graphite is held together by metallic bonding'
      ],
      correctIndex: 1,
      explanation: 'Graphite\'s 4th valence electron is delocalised across hexagonal sheets (allowing electrical conduction) while weak van der Waals forces between sheets let layers slide as a dry lubricant.',
      concept: 'Allotropes are different structural forms of the same element in the same physical state (e.g., diamond/graphite/fullerenes; rhombic/monoclinic sulphur).'
    },
    {
      id: 'was_chem_m3',
      subject: 'chemistry',
      topicId: 'chem_stoich',
      difficulty: 'medium',
      question: 'In an acid-base titration, 25.0 cm³ of aqueous Na2CO3 required 20.0 cm³ of 0.25 mol/dm³ HCl for complete neutralisation: Na2CO3 + 2HCl -> 2NaCl + H2O + CO2. Calculate the molar concentration of the Na2CO3 solution.',
      options: [
        '0.20 mol/dm³',
        '0.10 mol/dm³',
        '0.40 mol/dm³',
        '0.05 mol/dm³'
      ],
      correctIndex: 1,
      explanation: 'Using (C_A × V_A) / (C_B × V_B) = n_A / n_B = 2 / 1: (0.25 × 20.0) / (C_B × 25.0) = 2 -> 5.0 / (25.0 × C_B) = 2 -> 50.0 × C_B = 5.0 -> C_B = 0.10 mol/dm³.',
      concept: 'Always write the balanced titration equation first so you never miss the 2 : 1 mole ratio between HCl and Na2CO3!'
    },
    {
      id: 'was_chem_m4',
      subject: 'chemistry',
      topicId: 'chem_stoich',
      difficulty: 'medium',
      question: 'Calculate the mass of quicklime (CaO) produced when 25.0 g of pure limestone (CaCO3) is heated to constant mass: CaCO3(s) -> CaO(s) + CO2(g). (Ca = 40, C = 12, O = 16)',
      options: [
        '11.0 g',
        '14.0 g',
        '12.5 g',
        '28.0 g'
      ],
      correctIndex: 1,
      explanation: 'M(CaCO3) = 40 + 12 + 48 = 100 g/mol; M(CaO) = 40 + 16 = 56 g/mol. Moles of CaCO3 = 25.0 / 100 = 0.25 mol. From 1 : 1 stoichiometry, 0.25 mol CaO is formed -> mass = 0.25 × 56 = 14.0 g (and 11.0 g CO2 escapes).',
      concept: 'Conservation of mass check: 14.0 g CaO + 11.0 g CO2 = 25.0 g CaCO3 starting mass.'
    },
    {
      id: 'was_chem_m5',
      subject: 'chemistry',
      topicId: 'chem_acid',
      difficulty: 'medium',
      question: 'Which acid-base indicator is strictly appropriate when titrating aqueous ethanoic acid (CH3COOH, a weak acid) against sodium hydroxide (NaOH, a strong base)?',
      options: [
        'Methyl orange (pH range 3.1–4.4)',
        'Phenolphthalein (pH range 8.2–10.0)',
        'Universal indicator paper',
        'Litmus paper strips dipped into the conical flask'
      ],
      correctIndex: 1,
      explanation: 'Sodium ethanoate hydrolyses slightly in water to give an alkaline equivalence point (pH ~8.7), so only phenolphthalein changes sharply on the steep vertical section of the titration curve.',
      concept: 'WAEC indicator table: Strong acid + Strong base -> Methyl orange or Phenolphthalein; Strong acid + Weak base -> Methyl orange; Weak acid + Strong base -> Phenolphthalein.'
    },
    {
      id: 'was_chem_m6',
      subject: 'chemistry',
      topicId: 'chem_acid',
      difficulty: 'medium',
      question: 'A steady direct current of 2.0 A is passed through aqueous copper(II) tetraoxosulphate(VI) (CuSO4) for 965 seconds. Calculate the mass of copper deposited at the cathode. (Cu = 64; 1 Faraday = 96,500 C/mol)',
      options: [
        '1.28 g',
        '0.64 g',
        '0.32 g',
        '6.40 g'
      ],
      correctIndex: 1,
      explanation: 'Quantity of charge Q = I × t = 2.0 A × 965 s = 1,930 C. Moles of electrons = 1,930 / 96,500 = 0.020 mol. Cathode half-equation Cu^(2+) + 2e^- -> Cu requires 2 mol e^- per 1 mol Cu, so moles of Cu = 0.020 / 2 = 0.010 mol. Mass = 0.010 × 64 = 0.64 g.',
      concept: 'Faraday\'s law formula: m = (I × t × M) / (z × F), where z is the ionic charge (z = 2 for Cu^(2+), z = 3 for Al^(3+), z = 1 for Ag^+).'
    },
    {
      id: 'was_chem_m7',
      subject: 'chemistry',
      topicId: 'chem_kin',
      difficulty: 'medium',
      question: 'In the Haber process: N2(g) + 3H2(g) ⇌ 2NH3(g), delta H = -92 kJ/mol. According to Le Chatelier\'s principle, which change shifts the equilibrium position to the RIGHT (increasing equilibrium NH3 yield)?',
      options: [
        'Decreasing total pressure and raising temperature to 900°C',
        'Increasing total pressure (4 gas moles -> 2 gas moles) and lowering temperature moderately',
        'Adding finely divided iron catalyst without changing T or P',
        'Removing N2(g) from the reaction vessel'
      ],
      correctIndex: 1,
      explanation: 'High pressure favours the side with fewer gaseous moles (2 mol NH3 vs 4 mol reactants), and lower temperature favours the exothermic forward reaction (-92 kJ/mol). (Industrially ~450°C + iron catalyst compromises between rate and yield.)',
      concept: 'Iron catalyst speeds up rate of attaining equilibrium in the Haber process but has ZERO effect on equilibrium percentage yield.'
    },
    {
      id: 'was_chem_m8',
      subject: 'chemistry',
      topicId: 'chem_kin',
      difficulty: 'medium',
      question: 'At 30°C, 10.1 g of potassium trioxonitrate(V) (KNO3) dissolves in 50 cm³ of distilled water to form a saturated solution. Calculate the solubility of KNO3 at 30°C in mol/dm³. (K = 39, N = 14, O = 16)',
      options: [
        '0.20 mol/dm³',
        '2.0 mol/dm³',
        '1.0 mol/dm³',
        '0.50 mol/dm³'
      ],
      correctIndex: 1,
      explanation: 'Molar mass M(KNO3) = 39 + 14 + 48 = 101 g/mol. Moles dissolved in 50 cm³ = 10.1 / 101 = 0.10 mol. Scaling to 1,000 cm³ (1 dm³) of water: Solubility = 0.10 × (1,000 / 50) = 0.10 × 20 = 2.0 mol/dm³.',
      concept: 'WAEC solubility definition: maximum moles (or grams) of solute that saturate 1 dm³ (1,000 g) of solvent at a stated temperature.'
    },
    {
      id: 'was_chem_m9',
      subject: 'chemistry',
      topicId: 'chem_org',
      difficulty: 'medium',
      question: 'Which chemical reagent cleanly distinguishes ethyne (a terminal alkyne) from ethene (an alkene) in the school laboratory?',
      options: [
        'Bromine water (Br2(aq))',
        'Ammoniacal silver trioxonitrate(V) (Tollens\' reagent) or ammoniacal copper(I) chloride',
        'Acidified potassium tetraoxomanganate(VII)',
        'Blue litmus paper'
      ],
      correctIndex: 1,
      explanation: 'BOTH ethene and ethyne are unsaturated and decolourise bromine water and acidified KMnO4! Only terminal alkynes (-C≡C-H, such as ethyne or propyne) have a weakly acidic terminal hydrogen that precipitates white silver dicarbide with ammoniacal AgNO3 (or reddish-brown copper(I) dicarbide with ammoniacal CuCl).',
      concept: 'High-frequency WAEC organic trap: Br2 water distinguishes alkane vs alkene/alkyne; ammoniacal AgNO3/CuCl distinguishes alkene vs terminal alkyne!'
    },
    {
      id: 'was_chem_m10',
      subject: 'chemistry',
      topicId: 'chem_org',
      difficulty: 'medium',
      question: 'What organic products are formed when (i) propan-1-ol and (ii) propan-2-ol are refluxed with excess acidified potassium heptaoxodichromate(VI) (K2Cr2O7 / H+)?',
      options: [
        '(i) propanone and (ii) propanoic acid',
        '(i) propanoic acid and (ii) propanone',
        'Both form propene gas',
        'Neither reacts with acidified K2Cr2O7'
      ],
      correctIndex: 1,
      explanation: 'Primary alkanols (propan-1-ol) oxidise via alkanal (propanal) to alkanoic acid (propanoic acid) under reflux, turning orange Cr2O7^(2-) green (Cr^(3+)). Secondary alkanols (propan-2-ol) oxidise to alkanones (propanone); tertiary alkanols (2-methylpropan-2-ol) resist oxidation.',
      concept: 'Alkanol oxidation summary: 1° -> alkanal -> alkanoic acid; 2° -> alkanone; 3° -> no reaction.'
    },
    {
      id: 'was_chem_d1',
      subject: 'chemistry',
      topicId: 'chem_atom',
      difficulty: 'difficult',
      question: 'Across Period 3, first ionisation energy generally increases, yet Magnesium (Z = 12) has a HIGHER first ionisation energy than Aluminium (Z = 13). What accounts for this periodic anomaly?',
      options: [
        'Magnesium has a larger atomic number than Aluminium',
        'Aluminium\'s outermost electron occupies a higher-energy 3p orbital that is shielded by the filled inner 3s² subshell, making it easier to remove than a 3s² electron in Magnesium',
        'Aluminium is a noble gas with a complete octet',
        'Magnesium forms covalent molecules in the solid state'
      ],
      correctIndex: 1,
      explanation: 'Mg = [Ne] 3s² vs Al = [Ne] 3s² 3p¹. The single 3p¹ electron in Al sits slightly farther from the nucleus at higher energy and experiences shielding from the complete 3s² pair, lowering IE1(Al) below IE1(Mg).',
      concept: 'Remember BOTH Period 3 IE1 dips tested by WAEC: Al < Mg (3p¹ subshell shielding) and S < P (spin-pair repulsion in doubly occupied 3p_x² orbital of S).'
    },
    {
      id: 'was_chem_d2',
      subject: 'chemistry',
      topicId: 'chem_atom',
      difficulty: 'difficult',
      question: 'Methane (CH4), ammonia (NH3), and water (H2O) each have four electron pairs around their central atom, yet their bond angles decrease from 109.5° (CH4) to ~107° (NH3) to ~104.5° (H2O). Why?',
      options: [
        'Hydrogen atoms become heavier from CH4 to H2O',
        'Lone-pair repulsion is stronger than bond-pair repulsion (LP-LP > LP-BP > BP-BP); NH3 has 1 lone pair and H2O has 2 lone pairs compressing the bonding pairs closer together',
        'Water contains double covalent bonds',
        'Methane is planar whereas water is linear'
      ],
      correctIndex: 1,
      explanation: 'By VSEPR theory, non-bonding lone pairs sit closer to the central nucleus and exert greater electrostatic repulsion than shared bond pairs, progressively squeezing H-X-H bond angles from tetrahedral (109.5°) to trigonal pyramidal (107°) to bent/V-shaped (104.5°).',
      concept: 'VSEPR shapes: CH4 = tetrahedral (109.5°), NH3 = trigonal pyramidal (107°), H2O = V-shaped/bent (104.5°), CO2/BeCl2 = linear (180°), BF3 = trigonal planar (120°).'
    },
    {
      id: 'was_chem_d3',
      subject: 'chemistry',
      topicId: 'chem_stoich',
      difficulty: 'difficult',
      question: '100 cm³ of carbon(II) oxide (CO) is sparked with 80 cm³ of oxygen (O2) in a closed eudiometer: 2CO(g) + O2(g) -> 2CO2(g). What is the total volume of the residual gas mixture when cooled back to the initial temperature and pressure?',
      options: [
        '180 cm³',
        '130 cm³',
        '100 cm³',
        '150 cm³'
      ],
      correctIndex: 1,
      explanation: 'By Gay-Lussac\'s law of combining volumes (2 : 1 : 2): 100 cm³ CO reacts completely with 50 cm³ O2 to form 100 cm³ CO2. Unreacted excess O2 = 80 - 50 = 30 cm³. Total residual gas = 100 cm³ CO2 + 30 cm³ unreacted O2 = 130 cm³.',
      concept: 'In WAEC gas-sparking problems, ALWAYS add any unreacted excess reactant gas to the gaseous products! (If subsequently passed through aqueous KOH/NaOH, the 100 cm³ acidic CO2 is absorbed, leaving 30 cm³ O2.)'
    },
    {
      id: 'was_chem_d4',
      subject: 'chemistry',
      topicId: 'chem_stoich',
      difficulty: 'difficult',
      question: '2.50 g of an impure sample of CaCO3 (containing inert sand impurities) reacted completely with 40.0 cm³ of 1.00 mol/dm³ HCl: CaCO3 + 2HCl -> CaCl2 + H2O + CO2. Calculate the percentage purity of the CaCO3 sample. (Ca = 40, C = 12, O = 16)',
      options: [
        '64.0%',
        '80.0%',
        '75.0%',
        '90.0%'
      ],
      correctIndex: 1,
      explanation: 'Moles of HCl reacted = 1.00 × (40.0 / 1000) = 0.040 mol. By 1 : 2 mole ratio, moles of pure CaCO3 = 0.040 / 2 = 0.020 mol. Mass of pure CaCO3 = 0.020 × 100 g/mol = 2.00 g. Percentage purity = (2.00 / 2.50) × 100% = 80.0%.',
      concept: 'Never convert the impure sample mass directly into moles—always work backwards from the moles of pure standard acid consumed!'
    },
    {
      id: 'was_chem_d5',
      subject: 'chemistry',
      topicId: 'chem_acid',
      difficulty: 'difficult',
      question: 'During the electrolysis of CONCENTRATED aqueous sodium chloride (brine) using inert graphite electrodes, what gases are liberated at the cathode and anode, and what happens to the pH of the remaining electrolyte?',
      options: [
        'Sodium metal at cathode, oxygen at anode; pH drops to 2',
        'Hydrogen gas at cathode, chlorine gas at anode; remaining solution becomes strongly alkaline (NaOH, pH > 12)',
        'Chlorine at cathode, hydrogen at anode; solution stays neutral (pH = 7)',
        'Oxygen at both electrodes; pH stays 7'
      ],
      correctIndex: 1,
      explanation: 'At the cathode, H+ is lower in the electrochemical series than Na+ and discharges as H2(g). At the anode, high Cl- concentration overrides OH- to discharge Cl2(g). Leaving Na+ and OH- ions in solution produces industrial NaOH (alkaline, pH rises sharply).',
      concept: 'Three factors govern preferential ion discharge: (1) position in electrochemical series, (2) relative ionic concentration (brine!), and (3) nature of electrodes (e.g., mercury cathode or active copper anode).'
    },
    {
      id: 'was_chem_d6',
      subject: 'chemistry',
      topicId: 'chem_acid',
      difficulty: 'difficult',
      question: 'In the acidified reduction half-equation: Cr2O7^(2-)(aq) + 14H^+(aq) + n e^- -> 2Cr^(3+)(aq) + 7H2O(l), what is the stoichiometric number of electrons n?',
      options: [
        '3',
        '6',
        '5',
        '12'
      ],
      correctIndex: 1,
      explanation: 'Balance total ionic charge on both sides: Left = (-2) + 14(+1) + n(-1) = 12 - n; Right = 2(+3) + 0 = +6. Thus 12 - n = 6 -> n = 6 electrons (matching two Cr atoms each reduced from +6 to +3).',
      concept: 'Every balanced ionic half-equation must conserve BOTH atoms of each element AND net electrical charge!'
    },
    {
      id: 'was_chem_d7',
      subject: 'chemistry',
      topicId: 'chem_kin',
      difficulty: 'difficult',
      question: 'At 450°C, an equilibrium mixture of H2(g) + I2(g) ⇌ 2HI(g) in a sealed 2.0 dm³ vessel contains 0.40 mol H2, 0.40 mol I2, and 1.60 mol HI. Calculate the equilibrium constant Kc.',
      options: [
        '4.0',
        '16',
        '8.0',
        '32'
      ],
      correctIndex: 1,
      explanation: 'Divide moles by volume (2.0 dm³) to obtain equilibrium concentrations: [H2] = 0.20, [I2] = 0.20, [HI] = 0.80 mol/dm³. Kc = [HI]² / ([H2][I2]) = (0.80)² / (0.20 × 0.20) = 0.64 / 0.04 = 16.',
      concept: 'Always convert moles to molar concentrations (mol/dm³) before substituting into Kc (even when volumes happen to cancel for equal gas moles, showing [X] = n/V earns method marks in Paper 2).'
    },
    {
      id: 'was_chem_d8',
      subject: 'chemistry',
      topicId: 'chem_kin',
      difficulty: 'difficult',
      question: 'Given standard enthalpies of combustion: C(s) = -394 kJ/mol, H2(g) = -286 kJ/mol, and CH4(g) = -890 kJ/mol, apply Hess\'s Law to calculate the standard enthalpy of formation of methane: C(s) + 2H2(g) -> CH4(g).',
      options: [
        '+76 kJ/mol',
        '-76 kJ/mol',
        '-210 kJ/mol',
        '-1,570 kJ/mol'
      ],
      correctIndex: 1,
      explanation: 'Using combustion data: delta H_rxn = sum(delta H_c of reactants) - sum(delta H_c of products) = [-394 + 2(-286)] - (-890) = (-394 - 572) + 890 = -966 + 890 = -76 kJ/mol.',
      concept: 'Hess\'s Law cycle rule: from FORMATION data use Products - Reactants; from COMBUSTION data use Reactants - Products!'
    },
    {
      id: 'was_chem_d9',
      subject: 'chemistry',
      topicId: 'chem_org',
      difficulty: 'difficult',
      question: 'How many distinct structural (chain) isomers exist for the saturated alkane molecular formula C5H12, and what are their IUPAC names?',
      options: [
        '2: pentane and 2-methylbutane',
        '3: pentane, 2-methylbutane, and 2,2-dimethylpropane',
        '4: pentane, 2-methylbutane, 3-methylbutane, and 2,2-dimethylpropane',
        '5 distinct chain isomers'
      ],
      correctIndex: 1,
      explanation: 'C5H12 has exactly 3 structural isomers: straight-chain pentane, branched 2-methylbutane (note that "3-methylbutane" is the exact same molecule numbered from the wrong end!), and 2,2-dimethylpropane.',
      concept: 'Always apply IUPAC lowest-locant numbering to candidate structures so you don\'t double-count flipped duplicates like "3-methylbutane"!'
    },
    {
      id: 'was_chem_d10',
      subject: 'chemistry',
      topicId: 'chem_org',
      difficulty: 'difficult',
      question: 'Which pair below contains ONLY CONDENSATION polymers (formed with the elimination of small molecules such as H2O) rather than addition polymers?',
      options: [
        'Poly(ethene) and poly(chloroethene) (PVC)',
        'Nylon-6,6 and Terylene (polyethylene terephthalate)',
        'Polystyrene and Perspex',
        'Poly(propene) and Teflon (PTFE)'
      ],
      correctIndex: 1,
      explanation: 'Nylon-6,6 (a synthetic polyamide with -CONH- links) and Terylene (a synthetic polyester with -COO- links), like natural proteins and starch/cellulose, form by condensation polymerisation eliminating H2O/HCl; poly(ethene), PVC, polystyrene, and PTFE are addition polymers.',
      concept: 'Addition polymer empirical formula = monomer empirical formula; condensation polymer mass < sum of monomer masses because H2O/HCl is eliminated.'
    },
    // =========================================================================
    // 8. BIOLOGY — 30 Questions (10 Easy, 10 Medium, 10 Difficult)
    // =========================================================================
    {
      id: 'was_bio_e1',
      subject: 'biology',
      topicId: 'bio_cell',
      difficulty: 'easy',
      question: 'Which two cellular structures are present in a typical palisade mesophyll PLANT cell but ABSENT from a human cheek ANIMAL cell?',
      options: [
        'Cell membrane and nucleus',
        'Cellulose cell wall and chloroplasts',
        'Mitochondria and ribosomes',
        'Cytoplasm and centrioles'
      ],
      correctIndex: 1,
      explanation: 'Plant palisade cells possess a rigid outer cellulose cell wall, chloroplasts, and a large permanent central sap vacuole—structures absent from animal cells.',
      concept: 'Both plant and animal cells have a plasma membrane, nucleus, cytoplasm, mitochondria, and ribosomes.'
    },
    {
      id: 'was_bio_e2',
      subject: 'biology',
      topicId: 'bio_cell',
      difficulty: 'easy',
      question: 'What happens to a mammalian red blood cell when placed in pure distilled water (a strongly hypotonic medium)?',
      options: [
        'It becomes plasmolysed as its cell wall pulls away',
        'Water enters rapidly by endosmosis until the cell swells and bursts (haemolysis)',
        'Water leaves the cell causing crenation (shrinking)',
        'Nothing changes because red blood cells are impermeable to water'
      ],
      correctIndex: 1,
      explanation: 'Lacking a rigid cellulose cell wall, a red blood cell placed in distilled water gains water by osmosis and bursts (haemolysis); in contrast, a plant cell becomes fully turgid without bursting.',
      concept: 'Reserve the term "plasmolysis" strictly for walled cells (plant/fungal/bacterial); animal cells undergo haemolysis (in hypotonic) or crenation (in hypertonic).'
    },
    {
      id: 'was_bio_e3',
      subject: 'biology',
      topicId: 'bio_phys',
      difficulty: 'easy',
      question: 'In a WASSCE Biology practical food test, adding Biuret reagent (dilute NaOH followed by drops of 1% CuSO4 solution) to egg albumen produces a violet/purple colour. Which food class is confirmed?',
      options: [
        'Reducing sugar',
        'Protein',
        'Starch',
        'Lipid (fats and oils)'
      ],
      correctIndex: 1,
      explanation: 'Peptide bonds (-CO-NH-) in proteins coordinate with Cu^(2+) ions in alkaline Biuret reagent at room temperature (no heating required!) to give a characteristic violet/purple colour.',
      concept: 'Food-test summary: Iodine -> blue-black (starch); Benedict\'s/Fehling\'s + heat -> brick-red ppt (reducing sugar); Biuret -> purple (protein); Sudan III / translucent paper spot -> lipid.'
    },
    {
      id: 'was_bio_e4',
      subject: 'biology',
      topicId: 'bio_phys',
      difficulty: 'easy',
      question: 'Which plant vascular tissue transports manufactured organic food (mainly sucrose and amino acids) from green leaves to roots, fruits, and storage organs?',
      options: [
        'Xylem vessels',
        'Phloem sieve tubes (with companion cells)',
        'Cambium',
        'Sclerenchyma fibres'
      ],
      correctIndex: 1,
      explanation: 'Living phloem sieve-tube elements (assisted metabolically by nucleated companion cells) translocate sucrose bidirectionally from sources to sinks; dead lignified xylem vessels transport water and mineral salts upward.',
      concept: 'Ringing (girdling) the outer bark of a woody stem removes phloem and causes swelling above the ring as downward sucrose translocation is blocked.'
    },
    {
      id: 'was_bio_e5',
      subject: 'biology',
      topicId: 'bio_coord',
      difficulty: 'easy',
      question: 'Which endocrine gland secretes INSULIN to lower elevated blood glucose by stimulating the liver and muscles to convert glucose into glycogen?',
      options: [
        'Thyroid gland',
        'Islets of Langerhans in the pancreas',
        'Adrenal medulla',
        'Pituitary gland'
      ],
      correctIndex: 1,
      explanation: 'Beta cells of the islets of Langerhans in the pancreas secrete insulin when blood glucose rises after a meal; deficiency or resistance causes diabetes mellitus (glucose excreted in urine).',
      concept: 'Homeostatic pair: Insulin lowers blood glucose (glucose -> glycogen); Glucagon raises blood glucose (glycogen -> glucose).'
    },
    {
      id: 'was_bio_e6',
      subject: 'biology',
      topicId: 'bio_coord',
      difficulty: 'easy',
      question: 'In an insect-pollinated (entomophilous) flower such as Hibiscus or Pride of Barbados, which set of floral adaptations would you expect?',
      options: [
        'Small dull green petals, feathery stigmas hanging outside, and huge clouds of smooth light pollen',
        'Large brightly coloured petals, scent/nectaries, and sticky or spiky pollen grains',
        'No petals, no scent, and long pendulous stamens',
        'Pollen grains equipped with air bladders for wind dispersal'
      ],
      correctIndex: 1,
      explanation: 'Bright petals, scent, and nectar attract insect pollinators, while sticky/spiny pollen grains adhere firmly to the insect\'s body and stigma.',
      concept: 'Contrast entomophilous (insect-pollinated: bright, scented, sticky pollen) with anemophilous (wind-pollinated maize/grass: dull, pendulous anthers, feathery stigmas, light smooth pollen).'
    },
    {
      id: 'was_bio_e7',
      subject: 'biology',
      topicId: 'bio_ecol',
      difficulty: 'easy',
      question: 'Which ecological field instrument is lowered into a pond or river to measure WATER TURBIDITY (transparency/light penetration)?',
      options: [
        'Anemometer',
        'Secchi disc',
        'Wet-and-dry bulb hygrometer',
        'Pooter'
      ],
      correctIndex: 1,
      explanation: 'A black-and-white painted Secchi disc measures water transparency/turbidity; anemometer measures wind speed, hygrometer measures relative humidity, and a pooter collects small crevices insects.',
      concept: 'WAEC Paper 3 (Practical Biology) regularly tests identification and function of ecological instruments (Secchi disc, quadrat, sweep net, Tullgren funnel, rain gauge).'
    },
    {
      id: 'was_bio_e8',
      subject: 'biology',
      topicId: 'bio_ecol',
      difficulty: 'easy',
      question: 'Lichens growing on bare rock consist of an alga (which photosynthesises organic food) and a fungus (which absorbs water/minerals and provides shelter). What ecological association is this?',
      options: [
        'Parasitism',
        'Mutualism (symbiosis)',
        'Saprophytism',
        'Predation'
      ],
      correctIndex: 1,
      explanation: 'In mutualism (+/+), both partner species derive essential physiological benefit from living closely together (other classic WAEC examples: Rhizobium in legume nodules, cellulose-digesting protozoa in termite guts).',
      concept: 'Ecological interactions: Mutualism (+/+), Commensalism (+/0, e.g., remora fish on shark or epiphytic fern on palm trunk), Parasitism (+/-).'
    },
    {
      id: 'was_bio_e9',
      subject: 'biology',
      topicId: 'bio_gen',
      difficulty: 'easy',
      question: 'Which human trait below is an example of DISCONTINUOUS (clear-cut categorical) variation rather than continuous variation?',
      options: [
        'Standing height',
        'ABO blood group (A, B, AB, or O)',
        'Body weight',
        'Skin pigmentation shade'
      ],
      correctIndex: 1,
      explanation: 'Discontinuous variation divides individuals into distinct non-overlapping classes controlled by one or few major genes with zero environmental modification (e.g., ABO blood group, Rhesus factor, ability to roll the tongue, sex).',
      concept: 'Continuous variation (height, weight, intelligence, skin colour) is polygenic, environmentally influenced, and plots as a bell-shaped normal distribution curve.'
    },
    {
      id: 'was_bio_e10',
      subject: 'biology',
      topicId: 'bio_gen',
      difficulty: 'easy',
      question: 'In Mendel\'s monohybrid cross between two heterozygous tall pea plants (Tt × Tt), where Tall (T) is completely dominant over dwarf (t), what is the expected PHENOTYPIC ratio among offspring?',
      options: [
        '1 Tall : 2 Medium : 1 Dwarf',
        '3 Tall : 1 Dwarf',
        '1 Tall : 1 Dwarf',
        'All 4 Tall'
      ],
      correctIndex: 1,
      explanation: 'Tt × Tt produces genotypes 1 TT : 2 Tt : 1 tt. Because both TT and Tt express the dominant Tall phenotype, the phenotypic ratio is 3 Tall : 1 Dwarf (while the genotypic ratio is 1 : 2 : 1).',
      concept: 'Read carefully whether WAEC asks for the PHENOTYPIC ratio (3 : 1) or the GENOTYPIC ratio (1 : 2 : 1)!'
    },
    {
      id: 'was_bio_m1',
      subject: 'biology',
      topicId: 'bio_cell',
      difficulty: 'medium',
      question: 'How does MEIOSIS differ functionally and genetically from MITOSIS in sexually reproducing organisms?',
      options: [
        'Meiosis produces 2 genetically identical diploid somatic cells for tissue repair',
        'Meiosis halves the chromosome number to produce 4 genetically varied haploid gametes (n), introducing variation via crossing over at chiasmata and independent assortment',
        'Mitosis occurs only in anthers and ovaries to halve chromosome number',
        'Meiosis doubles chromosome number every generation'
      ],
      correctIndex: 1,
      explanation: 'Meiosis involves two nuclear divisions (Meiosis I reduction division + Meiosis II) following one DNA replication, producing 4 haploid cells so fertilisation (n + n = 2n) restores the constant species diploid number.',
      concept: 'Crossing over between non-sister chromatids of homologous chromosomes occurs specifically during Prophase I of meiosis.'
    },
    {
      id: 'was_bio_m2',
      subject: 'biology',
      topicId: 'bio_phys',
      difficulty: 'medium',
      question: 'In a healthy mammalian kidney nephron, why is GLUCOSE present in the glomerular filtrate inside Bowman\'s capsule but completely ABSENT from final urine?',
      options: [
        'Glucose molecules are too large to pass through glomerular capillaries',
        'All filtered glucose is 100% selectively reabsorbed back into peritubular blood capillaries in the proximal convoluted tubule via active transport',
        'Antidiuretic hormone (ADH) converts glucose into urea in the collecting duct',
        'The urinary bladder digests glucose aerobically'
      ],
      correctIndex: 1,
      explanation: 'Ultrafiltration forces water, glucose, amino acids, salts, and urea into Bowman\'s capsule (blocking only plasma proteins and blood cells), after which proximal convoluted tubule cells actively reabsorb 100% of glucose and amino acids.',
      concept: 'Large plasma proteins stay in blood (too big to filter); glucose filters freely then is 100% reabsorbed in the PCT (powered by abundant mitochondria).'
    },
    {
      id: 'was_bio_m3',
      subject: 'biology',
      topicId: 'bio_phys',
      difficulty: 'medium',
      question: 'Compare the end-products and ATP yield of ANAEROBIC respiration (fermentation) per glucose molecule in (i) yeast cells vs (ii) fatigued human skeletal muscle.',
      options: [
        'Both yield 38 ATP, ethanol, and carbon dioxide',
        'Both yield net 2 ATP; yeast produces ethanol + CO2, whereas human skeletal muscle produces lactic acid ONLY (with zero CO2 gas)',
        'Yeast produces lactic acid; human muscle produces ethanol + CO2',
        'Anaerobic respiration occurs inside mitochondria and requires oxygen'
      ],
      correctIndex: 1,
      explanation: 'In cytoplasm without O2, glycolysis yields 2 net ATP: yeast decarboxylates pyruvate to ethanol + CO2 (used in brewing and bread rising), whereas mammalian muscle reduces pyruvate directly to lactate/lactic acid (causing oxygen debt).',
      concept: 'Crucial WAEC distinction: muscle anaerobic respiration releases NO carbon dioxide gas, whereas yeast alcoholic fermentation releases CO2 (turning limewater milky).'
    },
    {
      id: 'was_bio_m4',
      subject: 'biology',
      topicId: 'bio_coord',
      difficulty: 'medium',
      question: 'A student can read a textbook held close to her eyes clearly, but distant writing on the classroom chalkboard appears blurred because parallel rays focus IN FRONT OF the retina. Name this eye defect and its corrective lens.',
      options: [
        'Hypermetropia (long-sightedness); convex (converging) lens',
        'Myopia (short-sightedness); concave (diverging) lens',
        'Astigmatism; opaque eye patch',
        'Presbyopia; plane mirror'
      ],
      correctIndex: 1,
      explanation: 'Myopia (short-sightedness) is caused by an eyeball that is too long or an eye lens with excessive curvature, focusing distant light ahead of the retina. A concave (diverging) spectacle lens spreads incoming rays slightly so they focus sharply on the retina.',
      concept: 'Memory cue: Myopia (Short-sighted) -> Diverging (Concave) lens; Hypermetropia (Long-sighted, focus behind retina) -> Converging (Convex) lens.'
    },
    {
      id: 'was_bio_m5',
      subject: 'biology',
      topicId: 'bio_coord',
      difficulty: 'medium',
      question: 'Trace the correct sequence of a simple spinal REFLEX ARC when a person accidentally touches a hot pressing iron.',
      options: [
        ' Pain receptor -> Brain cortex -> Motor neurone -> Sensory neurone -> Muscle',
        'Thermoreceptor/pain receptor in skin -> Sensory (afferent) neurone -> Relay (intermediate) neurone in spinal cord grey matter -> Motor (efferent) neurone -> Biceps effector muscle contracts',
        'Effector muscle -> Motor neurone -> Relay neurone -> Sensory neurone -> Skin receptor',
        'Pituitary gland -> Bloodstream -> Sensory neurone -> Bone'
      ],
      correctIndex: 1,
      explanation: 'Spinal withdrawal reflexes bypass conscious deliberation in the cerebrum for split-second tissue protection (though parallel impulses simultaneously ascend to the brain so pain is consciously felt a moment later).',
      concept: 'Dorsal root carries SENSORY neurones (with dorsal root ganglion); ventral root carries MOTOR neurones out to effectors.'
    },
    {
      id: 'was_bio_m6',
      subject: 'biology',
      topicId: 'bio_ecol',
      difficulty: 'medium',
      question: 'Which combination of vegetation features characterises the West African TROPICAL RAINFOREST biome compared with the Sudan/Sahel Savanna?',
      options: [
        'Scattered thorny acacias, tall seasonal tussock grasses, and annual bush fires',
        'Stratified evergreen broadleaf canopy (emergents, middle, understorey), buttress roots, woody lianas/epiphytes, and thin rapid-cycling litter',
        'Succulent leafless cacti and sunken stomata across shifting sand dunes',
        'Breathing pneumatophores rooted in brackish tidal mudflats'
      ],
      correctIndex: 1,
      explanation: 'High year-round rainfall (>2,000 mm) and warmth support stratified evergreen trees with buttress roots, drip-tip leaves, climbing lianas, and epiphytes; mangrove swamps have pneumatophores, while savannas feature fire-resistant thick-barked trees and grasses.',
      concept: 'Know West African vegetation belts south-to-north: Mangrove/Freshwater Swamp -> Tropical Rainforest -> Guinea Savanna -> Sudan Savanna -> Sahel Savanna.'
    },
    {
      id: 'was_bio_m7',
      subject: 'biology',
      topicId: 'bio_ecol',
      difficulty: 'medium',
      question: 'How do XEROPHYTES (desert/arid plants such as Opuntia cactus or Acacia) minimise transpirational water loss?',
      options: [
        'Broad thin leaves with thousands of exposed upper-epidermis stomata',
        'Leaves reduced to spines, thick waxy cuticle, sunken stomata in humid pits, and succulent water-storing stems',
        'Large intercellular air spaces for floating on water (aerenchyma)',
        'Absence of root hairs'
      ],
      correctIndex: 1,
      explanation: 'Reducing leaf lamina to spines drastically cuts evaporating surface area (while green stems photosynthesise), thick cuticles block cuticular transpiration, and sunken stomata trap moist air.',
      concept: 'Contrast Xerophytes (arid: spines, sunken stomata, deep/wide roots) with Hydrophytes (aquatic Waterlily/Pistia: aerenchyma air spaces, stomata on upper leaf surface only or absent).'
    },
    {
      id: 'was_bio_m8',
      subject: 'biology',
      topicId: 'bio_gen',
      difficulty: 'medium',
      question: 'Contrast Jean-Baptiste LAMARCK\'S theory of evolution with Charles DARWIN\'S theory of evolution by natural selection using giraffes\' long necks.',
      options: [
        'Darwin argued giraffes stretched their necks during life and passed stretched muscles to offspring; Lamarck discovered DNA mutations',
        'Lamarck proposed inheritance of acquired characteristics (use and disuse), whereas Darwin proposed pre-existing heritable variation in neck length followed by differential survival and reproduction of longer-necked individuals when low browse grew scarce',
        'Both theories reject adaptation to the environment',
        'Lamarck proved somatic muscle changes rewrite gamete chromosomes'
      ],
      correctIndex: 1,
      explanation: 'Lamarck\'s inheritance of somatically acquired traits was disproved (e.g., Weismann\'s mouse-tail experiments) because somatic changes do not alter germline DNA; Darwinian natural selection acts on heritable genetic variation.',
      concept: 'Pillars of Darwinian natural selection: Overproduction -> Struggle for existence -> Heritable variation -> Survival and reproduction of the fittest.'
    },
    {
      id: 'was_bio_m9',
      subject: 'biology',
      topicId: 'bio_phys',
      difficulty: 'medium',
      question: 'During mammalian INHALATION (inspiration), what coordinated movements occur in the external intercostal muscles, diaphragm, and thoracic cavity?',
      options: [
        'Diaphragm relaxes into a dome, ribs move down and in, thoracic pressure rises',
        'External intercostal muscles contract (ribs move up and outward) AND diaphragm muscle contracts (flattening downward), increasing thoracic volume and lowering thoracic pressure below atmospheric pressure',
        'Air is actively pumped by cilia into the alveoli',
        'Thoracic volume decreases while lung pressure drops'
      ],
      correctIndex: 1,
      explanation: 'By Boyle\'s law, expanding thoracic volume (ribs up/out + diaphragm flattens down) reduces intrapulmonary pressure below outside atmospheric pressure, so air rushes into the lungs passively.',
      concept: 'Diaphragm trap: a relaxed diaphragm is DOME-shaped; when it CONTRACTS during inhalation, it FLATTENS downward!'
    },
    {
      id: 'was_bio_m10',
      subject: 'biology',
      topicId: 'bio_cell',
      difficulty: 'medium',
      question: 'A student strips two identical potato cylinders (each 50 mm long) and immerses Strip X in distilled water and Strip Y in concentrated 1.0 mol/dm³ sucrose solution for 45 minutes. Predict the texture and length changes.',
      options: [
        'Strip X shrinks and turns flaccid; Strip Y elongates and turns turgid',
        'Strip X elongates (>50 mm) and becomes firm/turgid; Strip Y shortens (<50 mm) and becomes soft/flaccid due to plasmolysis',
        'Both strips dissolve completely',
        'Both strips stay exactly 50 mm because potato cells are dead'
      ],
      correctIndex: 1,
      explanation: 'Distilled water has higher water potential than potato cell sap, so water enters Strip X by osmosis (turgidity, length increases). Concentrated 1.0 M sucrose is hypertonic, drawing water out of Strip Y\'s vacuoles (plasmolysis, flaccidity, length shrinks).',
      concept: 'When % change in mass/length = 0 on an osmosis graph, the external sucrose concentration is ISOTONIC to the potato tissue\'s cell sap!'
    },
    {
      id: 'was_bio_d1',
      subject: 'biology',
      topicId: 'bio_coord',
      difficulty: 'difficult',
      question: 'In angiosperm (flowering plant) DOUBLE FERTILISATION, what are the fates of the two male gamete nuclei delivered down the pollen tube into the embryo sac?',
      options: [
        'Both male nuclei fuse with two synergids to form the seed coat (testa)',
        'One haploid male nucleus (n) fuses with the haploid egg cell (n) to form the diploid zygote (2n -> embryo), while the second male nucleus (n) fuses with the two polar nuclei / secondary nucleus (2n) to form the triploid primary endosperm nucleus (3n -> food reserve)',
        'One forms the fruit wall (pericarp) and the other forms pollen',
        'Both fuse with the antipodal cells'
      ],
      correctIndex: 1,
      explanation: 'Double fertilisation is unique to flowering plants: syngamy (n + n = 2n zygote) + triple fusion (n + 2n = 3n nutritive endosperm); afterward, the ovule develops into the seed, integuments into the testa, and ovary wall into the pericarp (fruit).',
      concept: 'Post-fertilisation floral fates: Ovule -> Seed; Zygote -> Embryo; Integuments -> Testa; Ovary -> Fruit; Ovary wall -> Pericarp.'
    },
    {
      id: 'was_bio_d2',
      subject: 'biology',
      topicId: 'bio_phys',
      difficulty: 'difficult',
      question: 'How does the mammalian skin thermoregulate to prevent overheating on a hot afternoon in Tamale or Sokoto?',
      options: [
        'Vasoconstriction of superficial arterioles, shivering, and erection of hair erector pili muscles',
        'Vasodilation of arterioles supplying surface capillaries (increasing radiative/convective heat loss), active sweat secretion (cooling via high latent heat of vaporisation), and relaxation of erector pili muscles so hairs lie flat',
        'Thickening of subcutaneous adipose tissue within five minutes',
        'Stopping blood flow through the dermis completely'
      ],
      correctIndex: 1,
      explanation: 'Note carefully: blood capillaries themselves do NOT move closer to the skin surface! Rather, smooth muscle in precapillary ARTERIOLES vasodilates, routing more warm blood through superficial capillary loops while evaporating sweat absorbs latent heat.',
      concept: 'Classic WAEC marking-scheme warning: NEVER write "capillaries move closer to the skin surface"—always write "arterioles supplying surface capillaries vasodilate"!'
    },
    {
      id: 'was_bio_d3',
      subject: 'biology',
      topicId: 'bio_coord',
      difficulty: 'difficult',
      question: 'Why does a horizontally placed maize coleoptile tip bend UPWARD (negative geotropism) while the primary radicle (root) bends DOWNWARD (positive geotropism) in complete darkness?',
      options: [
        'Auxin (IAA) accumulates on the lower side under gravity: high auxin concentration STIMULATES cell elongation in shoots (lower side grows faster -> bends up) but INHIBITS cell elongation in roots (upper side grows faster -> bends down)',
        'Gravity destroys all auxin on the lower side',
        'Roots contain chlorophyll that seeks soil darkness',
        'Auxin speeds up root elongation identically to shoot elongation'
      ],
      correctIndex: 1,
      explanation: 'Gravity causes lateral redistribution of IAA (auxin) to the lower side of both shoot and root, but root cells are far more sensitive to auxin: concentrations that promote shoot elongation inhibit root-cell elongation.',
      concept: 'Differential sensitivity to IAA explains both phototropism (auxin moves to shaded side -> shoot bends toward light) and geotropism!'
    },
    {
      id: 'was_bio_d4',
      subject: 'biology',
      topicId: 'bio_ecol',
      difficulty: 'difficult',
      question: 'Using the capture-mark-release-recapture (Lincoln index) method, students catch, harmlessly mark, and release 60 grasshoppers in a school field. Two days later, a second random catch of 50 grasshoppers contains 12 marked individuals. Estimate the total grasshopper population.',
      options: [
        '110',
        '250',
        '600',
        '120'
      ],
      correctIndex: 1,
      explanation: 'By the Lincoln index N = (n1 × n2) / m: N = (60 × 50) / 12 = 3,000 / 12 = 250 grasshoppers (assuming random mixing, non-toxic permanent marks, and negligible birth/death/migration between samples).',
      concept: 'Lincoln index assumptions: paint mark must not wash off or attract predators, marked individuals mix thoroughly, and population is closed during the short interval.'
    },
    {
      id: 'was_bio_d5',
      subject: 'biology',
      topicId: 'bio_gen',
      difficulty: 'difficult',
      question: 'A man and a woman who are BOTH healthy carriers of the sickle-cell trait (Hb^A Hb^S × Hb^A Hb^S) plan to marry. What is the probability for EACH pregnancy that their child will suffer from sickle-cell anaemia (Hb^S Hb^S), and why does the Hb^S allele persist at relatively high frequency in West Africa?',
      options: [
        '50% Hb^S Hb^S; carriers are immune to cholera',
        '25% (1/4) Hb^S Hb^S; heterozygous carriers (Hb^A Hb^S) enjoy selective survival advantage against severe Plasmodium falciparum malaria',
        '0% Hb^S Hb^S unless the first child already has it',
        '75% Hb^S Hb^S; caused by iron deficiency'
      ],
      correctIndex: 1,
      explanation: 'Punnett cross Hb^A Hb^S × Hb^A Hb^S gives 1/4 Hb^A Hb^A (normal), 2/4 Hb^A Hb^S (carrier), and 1/4 Hb^S Hb^S (sickle-cell anaemia) independently at EVERY pregnancy. Heterozygote advantage against lethal falciparum malaria maintains the Hb^S allele in malaria-endemic regions.',
      concept: 'Premarital genotype compatibility counselling is vital because two AS carriers face an independent 1-in-4 (25%) risk of SS in every pregnancy.'
    },
    {
      id: 'was_bio_d6',
      subject: 'biology',
      topicId: 'bio_gen',
      difficulty: 'difficult',
      question: 'Red-green colour blindness is an X-linked recessive trait (X^c). A man with normal colour vision (X^C Y) marries a carrier woman with normal colour vision (X^C X^c). What percentage of their SONS are expected to be colour-blind?',
      options: [
        '0%',
        '50% of their sons (and 0% of their daughters)',
        '100% of their sons',
        '50% of their daughters'
      ],
      correctIndex: 1,
      explanation: 'Cross X^C Y × X^C X^c produces daughters: X^C X^C (normal) and X^C X^c (normal carrier) -> 0% colour-blind daughters; and sons: X^C Y (normal) and X^c Y (colour-blind) -> 50% of sons (which equals 25% of total children).',
      concept: 'Fathers NEVER pass X-linked traits (haemophilia, colour blindness) to their sons—a son always inherits his Y chromosome from his father and his sole X chromosome from his mother!'
    },
    {
      id: 'was_bio_d7',
      subject: 'biology',
      topicId: 'bio_gen',
      difficulty: 'difficult',
      question: 'A segment of a template (non-coding) DNA strand has the base triplet sequence 3\'-TAC-GGA-CTT-5\'. What is the complementary messenger RNA (mRNA) codon sequence transcribed from it (5\' to 3\')?',
      options: [
        '5\'-ATG-CCT-GAA-3\'',
        '5\'-AUG-CCU-GAA-3\'',
        '5\'-UAC-GGA-CUU-3\'',
        '5\'-TUG-CCU-GUU-3\''
      ],
      correctIndex: 1,
      explanation: 'RNA contains Uracil (U) instead of Thymine (T). Pairing DNA -> mRNA: T -> A, A -> U, C -> G, G -> C. Thus 3\'-TAC-GGA-CTT-5\' transcribes into 5\'-AUG-CCU-GAA-3\'.',
      concept: 'Check RNA answers immediately for any stray "T": RNA NEVER contains Thymine (A pairs with U; C pairs with G).'
    },
    {
      id: 'was_bio_d8',
      subject: 'biology',
      topicId: 'bio_phys',
      difficulty: 'difficult',
      question: 'Why does carbon(IV) oxide release from tissue respiration shift the oxyhaemoglobin dissociation curve to the right (the Bohr effect), and why is this physiologically advantageous?',
      options: [
        'It prevents haemoglobin from picking up oxygen in the lungs',
        'High CO2 / H+ concentration in actively respiring muscles lowers haemoglobin\'s affinity for O2, causing oxyhaemoglobin to unload MORE free oxygen precisely where tissues need it most for ATP synthesis',
        'It permanently denatures red blood cells',
        'It turns blood blue by dissolving iron atoms'
      ],
      correctIndex: 1,
      explanation: 'In resting lungs (low CO2, high pO2), haemoglobin loads O2 avidly; in exercising muscle (high CO2 -> carbonic acid -> H+ lowers pH), the rightward Bohr shift promotes rapid oxygen dissociation to fuel aerobic respiration.',
      concept: 'Structure-function link: fetal haemoglobin has higher O2 affinity (curve shifted left) than maternal haemoglobin so oxygen transfers across the placenta from mother to fetus.'
    },
    {
      id: 'was_bio_d9',
      subject: 'biology',
      topicId: 'bio_ecol',
      difficulty: 'difficult',
      question: 'Why can a pyramid of NUMBERS for a terrestrial food chain (1 Large Iroko Tree -> 2,000 Caterpillars -> 30 Insectivorous Birds) be inverted at the base while the pyramid of ENERGY for the exact same food chain is ALWAYS upright?',
      options: [
        'Energy increases at higher trophic levels',
        'A single giant tree counts as 1 organism numerically despite huge photosynthetic biomass, whereas thermodynamic respiratory heat losses at every trophic transfer (~90% lost) force energy flow per m² per year to decrease strictly upward',
        'Caterpillars photosynthesise more energy than trees',
        'Birds contain more total energy than caterpillars'
      ],
      correctIndex: 1,
      explanation: 'Pyramids of numbers ignore organism size (1 tree feeds thousands of insects, or 1 dog hosts hundreds of fleas), whereas pyramids of energy obey the Second Law of Thermodynamics and can NEVER be inverted.',
      concept: 'Of the three ecological pyramids (Numbers, Biomass, Energy), ONLY the Pyramid of Energy is universally upright in every ecosystem.'
    },
    {
      id: 'was_bio_d10',
      subject: 'biology',
      topicId: 'bio_cell',
      difficulty: 'difficult',
      question: 'Why does human salivary amylase rapidly hydrolyse boiled starch paste at 37°C and pH 7.0, yet show ZERO activity when boiled to 100°C and cooled back to 37°C?',
      options: [
        'Boiling freezes water molecules around starch',
        'Enzymes are globular proteins; 100°C permanently breaks hydrogen/ionic bonds holding the 3D active site shape (irreversible denaturation), so starch substrate can no longer form an enzyme-substrate complex even after cooling',
        'Salivary amylase only digests cellulose at 100°C',
        'Boiling converts starch into amino acids directly'
      ],
      correctIndex: 1,
      explanation: 'Low temperatures (0–4°C) merely inactivate enzymes reversibly (low kinetic energy), whereas extreme heat (>60–100°C) or extreme pH irreversibly denatures the tertiary protein conformation of the active site.',
      concept: 'Contrast LOW temperature (reversible inactivation—activity returns on warming to 37°C) with HIGH temperature (irreversible active-site denaturation).'
    },

    // =========================================================================
    // 9. ECONOMICS — 30 Questions (10 Easy, 10 Medium, 10 Difficult)
    // =========================================================================
    {
      id: 'was_econ_e1',
      subject: 'economics',
      topicId: 'econ_dem',
      difficulty: 'easy',
      question: 'In Economics, OPPORTUNITY COST (real cost) is defined as:',
      options: [
        'The total cash receipt printed at a supermarket checkout',
        'The next best alternative forgone when a scarce resource is committed to a chosen use',
        'The sum of fixed cost and variable cost in a factory',
        'Government subsidies paid to peasant farmers'
      ],
      correctIndex: 1,
      explanation: 'Because human wants are unlimited while productive resources are scarce, choosing option A forces an individual, firm, or government to sacrifice its next highest-valued alternative B (the opportunity cost).',
      concept: 'Fundamental chain of Economics: Unlimited wants + Scarce resources -> Scale of preference -> Choice -> Opportunity cost.'
    },
    {
      id: 'was_econ_e2',
      subject: 'economics',
      topicId: 'econ_dem',
      difficulty: 'easy',
      question: 'When the price of a brand of fruit juice rises by 10%, the quantity demanded falls by 25%. Calculate the coefficient of Price Elasticity of Demand (|PED|) and interpret it.',
      options: [
        '0.40 (price inelastic)',
        '2.50 (price elastic)',
        '1.50 (unitary elastic)',
        '0.25 (perfectly inelastic)'
      ],
      correctIndex: 1,
      explanation: '|PED| = (% Change in Quantity Demanded) / (% Change in Price) = 25% / 10% = 2.50. Because |PED| > 1, demand is price elastic (consumers have close substitutes and respond more than proportionately).',
      concept: 'Never invert the elasticity fraction: Quantity ALWAYS goes in the numerator (% delta Q / % delta P)!'
    },
    {
      id: 'was_econ_e3',
      subject: 'economics',
      topicId: 'econ_prod',
      difficulty: 'easy',
      question: 'In the economic theory of production, what is the economic reward (factor payment) earned respectively by Land, Labour, Capital, and Entrepreneurship?',
      options: [
        'Wages, Rent, Profit, Interest',
        'Rent, Wages/Salaries, Interest, Profit',
        'Interest, Profit, Rent, Wages',
        'Tax, Subsidy, Dividend, Tariff'
      ],
      correctIndex: 1,
      explanation: 'Each factor of production earns a distinct factor income: Land -> Rent; Labour -> Wages/Salaries; Capital -> Interest; Entrepreneur -> Profit (residual reward for bearing uncertainty).',
      concept: 'Summing Rent + Wages + Interest + Profits across an economy forms the Income Method of measuring National Income.'
    },
    {
      id: 'was_econ_e4',
      subject: 'economics',
      topicId: 'econ_prod',
      difficulty: 'easy',
      question: 'A bakery has Total Fixed Cost (TFC) of GH₵ 1,200 and Total Variable Cost (TVC) of GH₵ 2,800 when baking 100 crates of bread per week. Calculate its Average Total Cost (ATC) per crate.',
      options: [
        'GH₵ 28.00',
        'GH₵ 40.00',
        'GH₵ 12.00',
        'GH₵ 16.00'
      ],
      correctIndex: 1,
      explanation: 'Total Cost TC = TFC + TVC = 1,200 + 2,800 = GH₵ 4,000. Average Total Cost ATC = TC / Q = 4,000 / 100 = GH₵ 40.00 per crate (also AFC 12 + AVC 28 = 40).',
      concept: 'Short-run cost identities: TC = TFC + TVC, and dividing through by Q gives ATC = AFC + AVC.'
    },
    {
      id: 'was_econ_e5',
      subject: 'economics',
      topicId: 'econ_macro',
      difficulty: 'easy',
      question: 'Which institution has the sole statutory authority to issue legal-tender currency notes and coins and act as "lender of last resort" to commercial banks?',
      options: [
        'The Stock Exchange',
        'The Central Bank (Bank of Ghana / Central Bank of Nigeria)',
        'Microfinance savings and loans companies',
        'Insurance brokerage firms'
      ],
      correctIndex: 1,
      explanation: 'The Central Bank (BoG / CBN) issues national currency, manages monetary policy and foreign reserves, acts as banker to the government, and serves as lender of last resort to commercial banks.',
      concept: 'Commercial banks accept retail deposits and create credit via loans; ONLY the Central Bank issues currency and sets the Monetary Policy Rate.'
    },
    {
      id: 'was_econ_e6',
      subject: 'economics',
      topicId: 'econ_macro',
      difficulty: 'easy',
      question: 'If the Central Bank sets a mandatory Cash Reserve Ratio (CRR) of 20% and a new cash deposit of ₦500,000 enters the commercial banking system (assuming zero cash drain and zero excess reserves), what is the maximum total demand deposit that can be created?',
      options: [
        '₦1,000,000',
        '₦2,500,000',
        '₦100,000',
        '₦5,000,000'
      ],
      correctIndex: 1,
      explanation: 'Credit multiplier m = 1 / CRR = 1 / 0.20 = 5. Maximum total deposits = Initial deposit × m = ₦500,000 × 5 = ₦2,500,000 (of which ₦500,000 is initial cash and ₦2,000,000 is newly created derivative credit).',
      concept: 'Raising the Cash Reserve Ratio shrinks the credit multiplier (contractionary monetary policy to curb inflation).'
    },
    {
      id: 'was_econ_e7',
      subject: 'economics',
      topicId: 'econ_pub',
      difficulty: 'easy',
      question: 'Which of the following is a DIRECT tax rather than an indirect tax?',
      options: [
        'Value Added Tax (VAT)',
        'Personal Income Tax (PAYE) / Corporate Income Tax',
        'Excise duty on beverages',
        'Import customs tariff'
      ],
      correctIndex: 1,
      explanation: 'Direct taxes (PAYE, Corporate Income Tax, Capital Gains Tax) are levied directly on a person\'s or company\'s income/wealth and their legal burden cannot easily be shifted; indirect taxes (VAT, excise, customs duties) are levied on goods and services.',
      concept: 'Adam Smith\'s 4 Canons of a Good Tax: Equity (ability to pay), Certainty, Convenience, and Economy (low collection cost).'
    },
    {
      id: 'was_econ_e8',
      subject: 'economics',
      topicId: 'econ_pub',
      difficulty: 'easy',
      question: 'When a government deliberately plans Projected Total Expenditure to EXCEED Projected Total Revenue in a fiscal year to stimulate aggregate demand and employment, what type of budget is it running?',
      options: [
        'A surplus budget',
        'A deficit budget',
        'A balanced budget',
        'A contractionary monetary budget'
      ],
      correctIndex: 1,
      explanation: 'Budget deficit occurs when G > T (expenditure > revenue), stimulating demand during unemployment/recession; a budget surplus (T > G) withdraws purchasing power during demand-pull inflation.',
      concept: 'Fiscal policy uses government spending (G) and taxation (T); Monetary policy uses interest rates, OMO, and reserve ratios.'
    },
    {
      id: 'was_econ_e9',
      subject: 'economics',
      topicId: 'econ_intl',
      difficulty: 'easy',
      question: 'In a country\'s Balance of Payments, export and import of tangible physical goods (such as cocoa beans, crude oil, vehicles, and rice) constitute:',
      options: [
        'Invisible trade',
        'Visible trade (Balance of Trade)',
        'Foreign direct investment',
        'Official reserve transactions'
      ],
      correctIndex: 1,
      explanation: 'Visible trade covers physical merchandise exports and imports (Balance of Trade = Visible Exports - Visible Imports); invisible trade covers services such as shipping, aviation, tourism, banking, and insurance.',
      concept: 'Current Account = Balance of Visible Trade + Balance of Invisible Trade (services) + Net Income & Current Transfers.'
    },
    {
      id: 'was_econ_e10',
      subject: 'economics',
      topicId: 'econ_intl',
      difficulty: 'easy',
      question: 'In a given year, a country\'s Index of Export Prices rises to 120 while its Index of Import Prices remains at 100 (base year = 100). Calculate its Terms of Trade.',
      options: [
        '83.3',
        '120',
        '20',
        '220'
      ],
      correctIndex: 1,
      explanation: 'Terms of Trade (ToT) = (Index of Export Prices / Index of Import Prices) × 100 = (120 / 100) × 100 = 120. Since 120 > 100, a unit of exports now buys 20% more imports (favourable improvement).',
      concept: 'Keep Terms of Trade (ratio of export/import PRICES) distinct from Balance of Trade (difference between export/import VALUES)!'
    },
    {
      id: 'was_econ_m1',
      subject: 'economics',
      topicId: 'econ_dem',
      difficulty: 'medium',
      question: 'Market demand and supply functions for bags of gari are Qd = 80 - 2P and Qs = 20 + 4P, where P is price in Cedis. Determine the equilibrium price P* and equilibrium quantity Q*.',
      options: [
        'P* = 15, Q* = 50',
        'P* = 10, Q* = 60',
        'P* = 12, Q* = 56',
        'P* = 20, Q* = 40'
      ],
      correctIndex: 1,
      explanation: 'At market equilibrium, Qd = Qs: 80 - 2P = 20 + 4P -> 60 = 6P -> P* = 10. Substitute P* = 10 into either equation: Q* = 80 - 2(10) = 60 (and Qs = 20 + 4(10) = 60).',
      concept: 'Always substitute P* into BOTH Qd and Qs to double-check your algebra in WASSCE Paper 2 data-response questions!'
    },
    {
      id: 'was_econ_m2',
      subject: 'economics',
      topicId: 'econ_dem',
      difficulty: 'medium',
      question: 'A 20% increase in the price of Beverage X causes the quantity demanded of Beverage Y to increase by 30%. Calculate the Cross Elasticity of Demand (XED) and state the relationship between X and Y.',
      options: [
        '-1.5; complementary goods',
        '+1.5; competitive substitute goods',
        '+0.67; inferior goods',
        '0.0; unrelated goods'
      ],
      correctIndex: 1,
      explanation: 'XED = (% Change in Qd of Y) / (% Change in Price of X) = +30% / +20% = +1.5. A POSITIVE cross elasticity shows consumers switch to Y when X gets dearer, proving X and Y are substitutes.',
      concept: 'Sign matters in XED and YED: XED > 0 = Substitutes (tea/coffee); XED < 0 = Complements (petrol/cars); YED > 0 = Normal good; YED < 0 = Inferior good.'
    },
    {
      id: 'was_econ_m3',
      subject: 'economics',
      topicId: 'econ_prod',
      difficulty: 'medium',
      question: 'A furniture workshop\'s Total Cost (TC) rises from GH₵ 540 when producing 5 chairs to GH₵ 615 when producing 6 chairs. What is the Marginal Cost (MC) of the 6th chair?',
      options: [
        'GH₵ 102.50',
        'GH₵ 75.00',
        'GH₵ 108.00',
        'GH₵ 115.50'
      ],
      correctIndex: 1,
      explanation: 'Marginal Cost is the addition to Total Cost resulting from producing one extra unit: MC_6 = TC_6 - TC_5 = 615 - 540 = GH₵ 75.00 (note that GH₵ 102.50 is Average Cost 615 / 6, not Marginal Cost!).',
      concept: 'Note also that because TFC is constant, MC_n = TC_n - TC_(n-1) = TVC_n - TVC_(n-1).'
    },
    {
      id: 'was_econ_m4',
      subject: 'economics',
      topicId: 'econ_prod',
      difficulty: 'medium',
      question: 'What happens if the government imposes a legally binding MAXIMUM PRICE (price ceiling) BELOW the free-market equilibrium price of maize without releasing buffer stocks?',
      options: [
        'Excess supply (unsold maize surplus) piles up in markets',
        'Quantity demanded exceeds quantity supplied (persistent shortage), encouraging long queues, rationing, hoarding, and parallel black-market sales above the official ceiling',
        'Equilibrium automatically shifts downward with zero shortage',
        'Farmers expand maize acreage immediately'
      ],
      correctIndex: 1,
      explanation: 'At a ceiling P_max < P*, consumers want more (Qd rises) while farmers supply less (Qs falls), creating excess demand (Qd - Qs > 0) and black markets unless government supplements supply.',
      concept: 'Price control rules: Effective Maximum Price (ceiling) sits BELOW equilibrium (-> shortage); Effective Minimum Price (floor, e.g., minimum wage/farm support) sits ABOVE equilibrium (-> surplus).'
    },
    {
      id: 'was_econ_m5',
      subject: 'economics',
      topicId: 'econ_macro',
      difficulty: 'medium',
      question: 'A country reports Gross Domestic Product at market prices = USD 500 million, Indirect Taxes = USD 60 million, and Government Subsidies = USD 20 million. Calculate GDP at FACTOR COST.',
      options: [
        'USD 540 million',
        'USD 460 million',
        'USD 580 million',
        'USD 420 million'
      ],
      correctIndex: 1,
      explanation: 'Indirect taxes artificially inflate market prices above payments to factors, while subsidies lower market prices below factor cost. Therefore GDP_fc = GDP_mp - Indirect Taxes + Subsidies = 500 - 60 + 20 = USD 460 million.',
      concept: 'National Income conversions: Market Price -> Factor Cost: (- Indirect Taxes + Subsidies); GDP -> GNP: (+ Net Factor Income from Abroad); Gross -> Net: (- Depreciation).'
    },
    {
      id: 'was_econ_m6',
      subject: 'economics',
      topicId: 'econ_macro',
      difficulty: 'medium',
      question: 'According to Keynes\'s Liquidity Preference Theory, why do households and firms hold idle cash balances under the SPECULATIVE motive?',
      options: [
        'To pay predictable daily bus fares and lunch expenses',
        'To take advantage of anticipated future changes in bond/asset prices and interest rates',
        'To pay emergency hospital bills after an unexpected accident',
        'Because commercial banks outlaw savings accounts'
      ],
      correctIndex: 1,
      explanation: 'Keynes identified three motives for holding money: Transactions (routine daily purchases, depends on income), Precautionary (unforeseen emergencies, depends on income), and Speculative (waiting for favourable bond-price / interest-rate shifts, inversely related to interest rates).',
      concept: 'Bond prices and interest rates move INVERSELY: when interest rates are very low (bond prices high), speculative demand for cash is high because investors expect bond prices to fall.'
    },
    {
      id: 'was_econ_m7',
      subject: 'economics',
      topicId: 'econ_pub',
      difficulty: 'medium',
      question: 'Under a municipal levy, Worker A earning ₦100,000 monthly pays ₦15,000, while Worker B earning ₦400,000 monthly pays ₦40,000. How is this tax classified?',
      options: [
        'Progressive, because ₦40,000 is bigger than ₦15,000',
        'Regressive, because the effective tax rate falls from 15% on low income to 10% on higher income',
        'Proportional, because both pay Naira',
        'Value Added Tax'
      ],
      correctIndex: 1,
      explanation: 'Tax classification depends on the PERCENTAGE RATE (Tax / Income × 100%), NEVER the raw cash amount! Worker A pays 15,000 / 100,000 = 15%, whereas Worker B pays 40,000 / 400,000 = 10%. Because the percentage rate drops as income rises, the tax is regressive.',
      concept: 'Always compute % tax rate = (Tax Paid / Income) × 100% before classifying a tax table as progressive, proportional, or regressive!'
    },
    {
      id: 'was_econ_m8',
      subject: 'economics',
      topicId: 'econ_pub',
      difficulty: 'medium',
      question: 'Distinguish COST-PUSH inflation from DEMAND-PULL inflation.',
      options: [
        'Cost-push occurs when excess money chases fixed output at full employment; demand-pull occurs when fuel and wage costs rise',
        'Cost-push arises from rising production input costs (fuel prices, depreciated exchange rate on imported inputs, higher wages) shifting aggregate supply left; demand-pull arises when aggregate spending exceeds full-employment output ("too much money chasing too few goods")',
        'Both lower the Consumer Price Index',
        'Cost-push only occurs when taxes are cut to zero'
      ],
      correctIndex: 1,
      explanation: 'Rising diesel tariffs, imported input costs after currency depreciation, and wage hikes push firms\' unit costs upward (cost-push), whereas deficit money printing or credit booms pull prices up via excess aggregate demand.',
      concept: 'Supply-side agricultural/power/transport bottlenecks in West Africa also create structural/cost-push food inflation.'
    },
    {
      id: 'was_econ_m9',
      subject: 'economics',
      topicId: 'econ_intl',
      difficulty: 'medium',
      question: 'Why do developing countries sometimes apply infant-industry TARIFFS or IMPORT QUOTAS temporarily?',
      options: [
        'To flood local markets with subsidized foreign manufactures',
        'To shield newly established domestic manufacturing firms from mature low-cost foreign competitors while they build economies of scale and technical skill',
        'To reduce government customs revenue to zero immediately',
        'To raise domestic unemployment'
      ],
      correctIndex: 1,
      explanation: 'Young domestic industries lack initial large-scale cost advantages; temporary tariff/quota protection gives them breathing room to achieve economies of scale—though indefinite protection risks complacency and inefficiency.',
      concept: 'Contrast Tariffs (tax on imports—raises price AND generates government revenue) with Quotas (physical quantity ceiling on imports—limits volume directly without tariff revenue unless auctioned).'
    },
    {
      id: 'was_econ_m10',
      subject: 'economics',
      topicId: 'econ_prod',
      difficulty: 'medium',
      question: 'Which market structure features a SINGLE seller of a product with NO close substitutes, strong barriers to entry (patents, statutory licence, natural scale), and downward-sloping AR above MR?',
      options: [
        'Perfect competition',
        'Pure monopoly',
        'Monopolistic competition',
        'Duopsony'
      ],
      correctIndex: 1,
      explanation: 'A monopolist is the sole industry supplier (firm = industry) protected by legal, resource, or natural barriers to entry; to sell extra units it must lower price on all units, so Marginal Revenue lies strictly below Average Revenue (Price).',
      concept: 'In Perfect Competition, P = AR = MR (horizontal); in Monopoly and Monopolistic Competition, P = AR > MR (downward-sloping).'
    },
    {
      id: 'was_econ_d1',
      subject: 'economics',
      topicId: 'econ_dem',
      difficulty: 'difficult',
      question: 'A commuter bus company estimates that peak-hour demand on its route has Price Elasticity of Demand |PED| = 0.40 (inelastic). If management raises the fare by 15%, what happens to Total Revenue?',
      options: [
        'Total Revenue falls because passenger numbers drop by 37.5%',
        'Total Revenue INCREASES because passenger volume drops by only 6% (0.40 × 15%), which is outweighed by the 15% fare increase',
        'Total Revenue remains completely unchanged',
        'Total Revenue drops to zero'
      ],
      correctIndex: 1,
      explanation: 'When demand is price INELASTIC (|PED| < 1), Price and Total Revenue move in the SAME direction (raising price increases TR). Conversely, when demand is price ELASTIC (|PED| > 1), cutting price increases TR!',
      concept: 'PED-Revenue matrix: Inelastic (|PED| < 1) -> raise P to raise TR; Elastic (|PED| > 1) -> lower P to raise TR; Unitary (|PED| = 1) -> TR is already at maximum.'
    },
    {
      id: 'was_econ_d2',
      subject: 'economics',
      topicId: 'econ_pub',
      difficulty: 'difficult',
      question: 'When the government imposes a specific excise tax per packet on a commodity whose demand is HIGHLY PRICE INELASTIC while supply is relatively elastic, who bears the greater share of the tax incidence?',
      options: [
        'Producers bear 100% of the tax burden',
        'Consumers bear the bulk of the tax burden via a steep rise in market price',
        'Foreign importers bear the entire burden',
        'Neither consumers nor producers pay any tax'
      ],
      correctIndex: 1,
      explanation: 'Tax incidence falls more heavily on the less elastic (less responsive) side of the market: when consumers cannot easily cut consumption (inelastic demand, e.g., petrol or addictive goods), sellers pass most of the indirect tax forward into higher retail prices.',
      concept: 'Incidence rule: Inelastic Demand -> Consumer pays most; Elastic Demand -> Producer absorbs most; Perfectly Inelastic Demand -> Consumer pays 100%.'
    },
    {
      id: 'was_econ_d3',
      subject: 'economics',
      topicId: 'econ_prod',
      difficulty: 'difficult',
      question: 'A perfectly competitive firm faces a market price of GH₵ 50 per unit. Its Total Cost (TC) for outputs Q = 1, 2, 3, 4, 5 units is GH₵ 35, GH₵ 65, GH₵ 105, GH₵ 153, and GH₵ 215 respectively. At what output Q does the firm maximise profit, and what is that maximum profit?',
      options: [
        'Q = 3 units; Profit = GH₵ 45',
        'Q = 4 units; Profit = GH₵ 47',
        'Q = 5 units; Profit = GH₵ 35',
        'Q = 2 units; Profit = GH₵ 35'
      ],
      correctIndex: 1,
      explanation: 'Compute TR = 50Q and Profit = TR - TC: Q=1 (50-35=15); Q=2 (100-65=35, MC=30); Q=3 (150-105=45, MC=40); Q=4 (200-153=47, MC=48 <= MR=50); Q=5 (250-215=35, MC=62 > MR=50). Expanding up to Q = 4 where MR >= MC maximises total profit at GH₵ 47.',
      concept: 'Discrete profit-maximisation rule: produce every unit whose Marginal Cost MC <= Marginal Revenue MR, and stop before any unit where MC > MR.'
    },
    {
      id: 'was_econ_d4',
      subject: 'economics',
      topicId: 'econ_prod',
      difficulty: 'difficult',
      question: 'According to the Law of Variable Proportions (Diminishing Returns) in the short run, at what exact point does Total Product (TP) reach its MAXIMUM?',
      options: [
        'When Marginal Product (MP) is at its highest peak',
        'When Marginal Product (MP) equals ZERO (just before MP turns negative)',
        'When Average Product (AP) equals Marginal Product (MP)',
        'When Fixed Factor inputs are doubled'
      ],
      correctIndex: 1,
      explanation: 'As long as MP > 0 (even while MP is declining in Stage II), each extra worker still adds to Total Product. TP peaks precisely when MP = 0, and begins to fall only if MP becomes negative (Stage III overcrowding).',
      concept: 'Production curve landmarks: MP cuts AP at AP\'s maximum; TP reaches its maximum where MP = 0 (rational firms operate in Stage II between max AP and MP = 0).'
    },
    {
      id: 'was_econ_d5',
      subject: 'economics',
      topicId: 'econ_macro',
      difficulty: 'difficult',
      question: 'In a simple closed economy with no taxation, households have a Marginal Propensity to Consume (MPC) of 0.75. If autonomous investment increases by ₦80 billion, by how much will equilibrium National Income eventually rise?',
      options: [
        '₦60 billion',
        '₦320 billion',
        '₦106.7 billion',
        '₦240 billion'
      ],
      correctIndex: 1,
      explanation: 'Marginal Propensity to Save MPS = 1 - MPC = 1 - 0.75 = 0.25. Keynesian expenditure multiplier k = 1 / (1 - MPC) = 1 / 0.25 = 4. Total increase in National Income delta_Y = k × delta_I = 4 × ₦80 billion = ₦320 billion.',
      concept: 'Higher MPC (smaller leakage into saving MPS) creates a LARGER national income multiplier k = 1 / MPS.'
    },
    {
      id: 'was_econ_d6',
      subject: 'economics',
      topicId: 'econ_macro',
      difficulty: 'difficult',
      question: 'Why does counting the full market value of wheat sold by a farmer, flour sold by a miller, AND bread sold by a baker overstate National Income, and how do statisticians prevent this error?',
      options: [
        'It understates GDP because transport is omitted',
        'It commits DOUBLE COUNTING of intermediate inputs; statisticians avoid it either by summing ONLY Value Added at each production stage OR counting ONLY final goods and services',
        'Transfer payments like pensions must be added to bread sales',
        'Bread is a non-market subsistence activity'
      ],
      correctIndex: 1,
      explanation: 'The retail price of bread already embeds the value of flour and wheat. Summing gross sales across stages counts wheat three times and flour twice! Summing Value Added (Output minus Intermediate Purchases) equals final bread value cleanly.',
      concept: 'Also exclude pure TRANSFER PAYMENTS (old-age pensions, student bursaries, unemployment relief, gifts) from National Income because no current output is produced in exchange.'
    },
    {
      id: 'was_econ_d7',
      subject: 'economics',
      topicId: 'econ_macro',
      difficulty: 'difficult',
      question: 'According to Irving Fisher\'s Quantity Theory of Money (MV = PT), if Velocity of circulation (V) and real Volume of transactions/output (T) remain constant in the short run, what happens when Money Supply (M) increases by 18%?',
      options: [
        'General price level P falls by 18%',
        'General price level P rises proportionately by 18% (and the value of money falls)',
        'Real output T rises by 36%',
        'Price level P remains unchanged'
      ],
      correctIndex: 1,
      explanation: 'Rearranging MV = PT gives P = (V / T) × M. With V and T fixed at full capacity, P varies directly and proportionately with M (+18% M -> +18% P), reducing the purchasing power (value) of money.',
      concept: 'Value of money is inversely proportional to the general price level P (if price index doubles from 100 to 200, the value of money halves).'
    },
    {
      id: 'was_econ_d8',
      subject: 'economics',
      topicId: 'econ_intl',
      difficulty: 'difficult',
      question: 'Under the Marshall-Lerner condition, when will a currency DEVALUATION (or sharp depreciation) successfully improve a country\'s trade balance?',
      options: [
        'When both exports and imports have zero price elasticity (PED_x = 0, PED_m = 0)',
        'When the sum of price elasticities of foreign demand for exports and domestic demand for imports exceeds 1 (|PED_x| + |PED_m| > 1), AND domestic export supply can expand',
        'When domestic consumers refuse to substitute away from luxury imports regardless of price',
        'Only when domestic inflation exceeds 100% per year'
      ],
      correctIndex: 1,
      explanation: 'Devaluation makes exports cheaper in foreign currency and imports dearer in local currency. However, if primary exports cannot expand in the short run and essential machinery/fuel imports are price-inelastic, import bills in local currency surge without boosting export earnings!',
      concept: 'This explains why devaluation in primary-exporting, import-dependent West African economies often triggers imported inflation before improving the trade balance.'
    },
    {
      id: 'was_econ_d9',
      subject: 'economics',
      topicId: 'econ_intl',
      difficulty: 'difficult',
      question: 'Using 1 unit of resources, Country Alpha can produce either 20 bags of cocoa OR 10 bales of cloth, whereas Country Beta can produce either 12 bags of cocoa OR 12 bales of cloth. Applying David Ricardo\'s Law of Comparative Cost Advantage, how should they specialise?',
      options: [
        'Alpha should produce both goods and refuse to trade because it has absolute advantage in cocoa',
        'Alpha should specialise in cocoa (opportunity cost = 0.5 cloth < Beta\'s 1.0 cloth) and Beta should specialise in cloth (opportunity cost = 1.0 cocoa < Alpha\'s 2.0 cocoa)',
        'Beta should specialise in cocoa and Alpha in cloth',
        'Mutually beneficial trade is impossible because Beta produces 12 of each'
      ],
      correctIndex: 1,
      explanation: 'Opportunity cost of 1 bale of cloth: in Alpha = 20/10 = 2 cocoa; in Beta = 12/12 = 1 cocoa -> Beta has lower opportunity cost in cloth. Opportunity cost of 1 bag of cocoa: in Alpha = 10/20 = 0.5 cloth; in Beta = 12/12 = 1 cloth -> Alpha has lower opportunity cost in cocoa.',
      concept: 'Comparative advantage depends on LOWER OPPORTUNITY COST, not absolute output per worker (terms of trade between 1 and 2 bags of cocoa per bale of cloth benefit both countries!).'
    },
    {
      id: 'was_econ_d10',
      subject: 'economics',
      topicId: 'econ_prod',
      difficulty: 'difficult',
      question: 'In the SHORT RUN, why will a loss-making firm continue producing temporarily rather than shutting down immediately as long as Market Price P exceeds Average Variable Cost (P > AVC, even though P < ATC)?',
      options: [
        'Because Fixed Costs disappear the moment output drops to zero',
        'Because shutting down incurs a loss equal to 100% of Total Fixed Cost (TFC), whereas producing where P > AVC covers all variable costs PLUS contributes (P - AVC) per unit toward offsetting Fixed Costs',
        'Because P < ATC generates supernormal profit',
        'Because labour works free of charge in the short run'
      ],
      correctIndex: 1,
      explanation: 'Sunk fixed costs (factory lease, insurance) must be paid in the short run even at Q = 0. Whenever TR > TVC (i.e., P > AVC), operating loses LESS money than shutting down; the short-run shut-down point occurs precisely where P falls to minimum AVC.',
      concept: 'Short-run shut-down condition: shut down if P < min AVC; Long-run exit condition: exit industry if P < min LRAC.'
    },
    // =========================================================================
    // 10. FINANCIAL ACCOUNTING (30 Questions: 10 Easy, 10 Medium, 10 Difficult)
    // =========================================================================
    {
      id: 'was_acc_e1',
      subject: 'accounting',
      topicId: 'acc_books',
      difficulty: 'easy',
      question: 'When the owner of a sole proprietorship withdraws goods from business inventory for personal family consumption and records this as Drawings rather than a business expense, which accounting concept is being applied?',
      options: [
        'Going Concern Concept',
        'Business Entity Concept',
        'Materiality Concept',
        'Money Measurement Concept'
      ],
      correctIndex: 1,
      explanation: 'The Business Entity Concept treats the business as completely separate and distinct from its proprietor for accounting purposes, so personal transactions of the owner are kept separate from business operations via Capital and Drawings accounts.',
      concept: 'Business Entity Concept: the business and its owner(s) are treated as separate accounting entities.'
    },
    {
      id: 'was_acc_e2',
      subject: 'accounting',
      topicId: 'acc_books',
      difficulty: 'easy',
      question: 'In a three-column Cash Book, what is a "contra entry" (marked with the letter "C" in the folio column)?',
      options: [
        'A credit sale of goods on 30 days trade credit',
        'A transaction that affects BOTH the Cash column and the Bank column simultaneously (such as depositing office cash into the business bank account or withdrawing cash from the bank for office use)',
        'A bad debt written off at the end of the financial year',
        'A discount allowed to a trade debtor'
      ],
      correctIndex: 1,
      explanation: 'Because both the Cash account and the Bank account sit inside the same Cash Book, paying cash into the bank (Debit Bank, Credit Cash) or withdrawing cash for office till use (Debit Cash, Credit Bank) completes double entry inside the Cash Book itself.',
      concept: 'Contra entries occur only when value moves directly between Cash in Hand and Cash at Bank.'
    },
    {
      id: 'was_acc_e3',
      subject: 'accounting',
      topicId: 'acc_sole',
      difficulty: 'easy',
      question: 'Which fundamental accounting equation must ALWAYS balance on a Statement of Financial Position (Balance Sheet)?',
      options: [
        'Assets = Capital - Liabilities',
        'Assets = Capital + Liabilities',
        'Capital = Assets + Liabilities',
        'Liabilities = Assets + Capital'
      ],
      correctIndex: 1,
      explanation: 'Every resource owned by a business (Assets) was financed either by the owner(s) (Capital / Equity) or by external obligations (Liabilities), giving Assets = Capital + Liabilities.',
      concept: 'Accounting Equation: Assets = Capital + Liabilities (or Capital = Assets - Liabilities).'
    },
    {
      id: 'was_acc_e4',
      subject: 'accounting',
      topicId: 'acc_sole',
      difficulty: 'easy',
      question: 'How is an accrued expense (an expense incurred during the current year that remains unpaid at the year-end) treated in a sole trader\'s Final Accounts?',
      options: [
        'Deducted from the expense in Profit or Loss and shown as a Current Asset',
        'Added to the expense paid in the Profit or Loss Account and shown as a Current Liability on the Statement of Financial Position',
        'Added to Gross Profit and shown as Non-Current Capital',
        'Ignored until cash is actually paid next year'
      ],
      correctIndex: 1,
      explanation: 'Under the Accruals (Matching) Concept, expenses belonging to the current period must be charged in full regardless of payment date, so the unpaid owing amount increases the Profit or Loss expense and stands as a Current Liability at year-end.',
      concept: 'Expense owing (accrued) -> ADD in Profit or Loss, Current Liability on Balance Sheet; Expense prepaid -> DEDUCT in Profit or Loss, Current Asset on Balance Sheet.'
    },
    {
      id: 'was_acc_e5',
      subject: 'accounting',
      topicId: 'acc_depr',
      difficulty: 'easy',
      question: 'A delivery van is purchased for 85,000 Cedis with an estimated useful life of 5 years and an estimated residual (scrap) value of 10,000 Cedis. What is the annual depreciation charge using the Straight-Line Method?',
      options: [
        '15,000 Cedis per year',
        '17,000 Cedis per year',
        '19,000 Cedis per year',
        '10,000 Cedis per year'
      ],
      correctIndex: 0,
      explanation: 'Straight-Line Annual Depreciation = (Cost - Estimated Scrap Value) / Useful Life = (85,000 - 10,000) / 5 = 75,000 / 5 = 15,000 Cedis per year.',
      concept: 'Straight-line depreciation spreads depreciable cost (Cost minus Residual Value) in equal annual instalments over useful life.'
    },
    {
      id: 'was_acc_e6',
      subject: 'accounting',
      topicId: 'acc_depr',
      difficulty: 'easy',
      question: 'When a motor vehicle repair expense of 4,200 Naira is mistakenly debited to the Motor Vehicles (Non-Current Asset) Account instead of the Motor Repairs Expense Account, what type of accounting error has occurred?',
      options: [
        'Error of Omission',
        'Error of Commission',
        'Error of Principle',
        'Error of Original Entry'
      ],
      correctIndex: 2,
      explanation: 'Posting a revenue expense to a capital/asset account violates the accounting classification class of accounts (Capital Expenditure vs Revenue Expenditure), which is an Error of Principle. Note that the Trial Balance still balances.',
      concept: 'Error of Principle = wrong CLASS of account (e.g., Expense vs Asset); Error of Commission = wrong PERSONAL account within the same class (e.g., Debtor Kofi vs Debtor Kwame).'
    },
    {
      id: 'was_acc_e7',
      subject: 'accounting',
      topicId: 'acc_part',
      difficulty: 'easy',
      question: 'In a Partnership where the partners have NOT signed a formal Partnership Deed (or where their agreement is silent on profit sharing), how must profits and losses be shared under the Partnership Act?',
      options: [
        'Strictly in proportion to each partner\'s capital contribution',
        'Equally among all partners regardless of differences in capital contributed',
        'According to the age and seniority of each partner',
        '70% to the managing partner and 30% to sleeping partners'
      ],
      correctIndex: 1,
      explanation: 'In the absence of an express agreement, standard partnership law mandates equal sharing of profits and losses, no interest allowed on capital, no interest charged on drawings, no partner salaries, and 5% p.a. interest on partner loans above capital.',
      concept: 'No Partnership Agreement rules: equal profit/loss share, 0% interest on capital/drawings, no salaries, 5% p.a. interest on partner advances/loans.'
    },
    {
      id: 'was_acc_e8',
      subject: 'accounting',
      topicId: 'acc_part',
      difficulty: 'easy',
      question: 'In a non-profit-making club or society (such as a sports club), what is the equivalent of a trading firm\'s "Capital" called?',
      options: [
        'Receipts and Payments Balance',
        'Accumulated Fund',
        'Subscriptions in Arrears',
        'Debenture Reserve'
      ],
      correctIndex: 1,
      explanation: 'Non-profit clubs do not have proprietors\' Capital; instead, their net worth (Total Club Assets minus Total Club Liabilities) is termed the Accumulated Fund, increased by annual Surpluses or reduced by Deficits from the Income and Expenditure Account.',
      concept: 'Non-profit terminology: Cash Book summary -> Receipts & Payments Account; Profit & Loss -> Income & Expenditure Account (Surplus/Deficit); Capital -> Accumulated Fund.'
    },
    {
      id: 'was_acc_e9',
      subject: 'accounting',
      topicId: 'acc_comp',
      difficulty: 'easy',
      question: 'A business has Current Assets of 120,000 Naira (including Closing Inventory of 30,000 Naira) and Current Liabilities of 60,000 Naira. What is its Current Ratio?',
      options: [
        '1.5 : 1',
        '2.0 : 1',
        '0.5 : 1',
        '2.5 : 1'
      ],
      correctIndex: 1,
      explanation: 'Current Ratio (Working Capital Ratio) = Current Assets / Current Liabilities = 120,000 / 60,000 = 2.0 : 1. (Note: deducting inventory gives the Acid-Test / Quick Ratio = 90,000 / 60,000 = 1.5 : 1.)',
      concept: 'Current Ratio = Current Assets / Current Liabilities; Quick (Acid-Test) Ratio = (Current Assets - Inventory) / Current Liabilities.'
    },
    {
      id: 'was_acc_e10',
      subject: 'accounting',
      topicId: 'acc_books',
      difficulty: 'easy',
      question: 'Which source document is issued by a seller to a credit customer to REDUCE the amount owed when damaged or wrong specification goods are returned?',
      options: [
        'Debit Note',
        'Credit Note',
        'Pro-forma Invoice',
        'Payment Voucher'
      ],
      correctIndex: 1,
      explanation: 'The seller issues a Credit Note (often printed in red) to inform the buyer that the buyer\'s account in the seller\'s Sales Ledger has been credited (reduced) for Returns Inwards or an overcharge.',
      concept: 'Credit Note -> reduces customer\'s debt (source document for Returns Inwards Day Book); Invoice -> source document for credit sales/purchases.'
    },
    {
      id: 'was_acc_m1',
      subject: 'accounting',
      topicId: 'acc_books',
      difficulty: 'medium',
      question: 'An updated Cash Book shows a debit (favourable) bank balance of 18,400 Cedis on 31 December. Unpresented cheques total 5,300 Cedis and uncredited lodgements (deposits in transit) total 3,700 Cedis. What balance appears on the Bank Statement on 31 December?',
      options: [
        '16,800 Cedis',
        '20,000 Cedis',
        '27,400 Cedis',
        '9,400 Cedis'
      ],
      correctIndex: 1,
      explanation: 'Starting from favourable updated Cash Book balance (18,400): ADD unpresented cheques not yet deducted by the bank (+5,300 = 23,700) and DEDUCT uncredited lodgements not yet credited by the bank (-3,700) = 20,000 Cedis credit (favourable) balance on the Bank Statement.',
      concept: 'Bank Reconciliation (from favourable Cash Book to Bank Statement): Cash Book Balance + Unpresented Cheques - Uncredited Lodgements = Bank Statement Balance.'
    },
    {
      id: 'was_acc_m2',
      subject: 'accounting',
      topicId: 'acc_sole',
      difficulty: 'medium',
      question: 'On 1 January, a trader\'s Provision for Doubtful Debts stood at 2,400 Naira. At 31 December, Trade Receivables (after writing off bad debts) are 70,000 Naira, and the trader decides to maintain the provision at 5% of Trade Receivables. How does the provision affect the Profit or Loss Account for the year?',
      options: [
        'Expense debit of 3,500 Naira',
        'Expense debit of 1,100 Naira (increase in provision)',
        'Income credit of 1,100 Naira (decrease in provision)',
        'Expense debit of 5,900 Naira'
      ],
      correctIndex: 1,
      explanation: 'Required closing provision = 5% of 70,000 = 3,500 Naira. Opening provision = 2,400 Naira. Increase in provision = 3,500 - 2,400 = 1,100 Naira. Only the INCREASE (1,100 Naira) is debited as an expense in Profit or Loss, while the full 3,500 Naira is deducted from Trade Receivables on the Balance Sheet.',
      concept: 'Provision for Doubtful Debts: Increase in provision -> Debit Profit or Loss (expense); Decrease in provision -> Credit Profit or Loss (income).'
    },
    {
      id: 'was_acc_m3',
      subject: 'accounting',
      topicId: 'acc_depr',
      difficulty: 'medium',
      question: 'Machinery purchased on 1 January Year 1 for 100,000 Cedis is depreciated at 20% per annum using the Reducing-Balance (Diminishing-Balance) Method. If it is sold on 31 December Year 2 for 68,000 Cedis, what is the profit or loss on disposal?',
      options: [
        'Profit on disposal of 8,000 Cedis',
        'Profit on disposal of 4,000 Cedis',
        'Loss on disposal of 4,000 Cedis',
        'Loss on disposal of 12,000 Cedis'
      ],
      correctIndex: 1,
      explanation: 'Year 1 depreciation = 20% of 100,000 = 20,000 -> NBV end Year 1 = 80,000. Year 2 depreciation = 20% of 80,000 = 16,000 -> NBV end Year 2 = 80,000 - 16,000 = 64,000 Cedis. Sale proceeds (68,000) minus Net Book Value (64,000) = +4,000 Cedis Profit on Disposal.',
      concept: 'Reducing-balance depreciation applies the percentage to the Net Book Value (Cost minus Accumulated Depreciation) each year; Disposal Gain/Loss = Proceeds - NBV.'
    },
    {
      id: 'was_acc_m4',
      subject: 'accounting',
      topicId: 'acc_depr',
      difficulty: 'medium',
      question: 'Which of the following items appears on the CREDIT side of a Sales Ledger Control Account (Total Trade Receivables Account)?',
      options: [
        'Credit sales for the period',
        'Dishonoured cheques from customers',
        'Discounts allowed and Returns inwards from credit customers',
        'Discounts received from suppliers'
      ],
      correctIndex: 2,
      explanation: 'Trade Receivables is an asset account (increased on the Debit side by credit sales and dishonoured cheques; reduced on the Credit side by cash/cheques received from debtors, discounts allowed, returns inwards, bad debts written off, and contra set-offs).',
      concept: 'Sales Ledger Control Account mirrors individual debtor accounts: Debits increase what customers owe; Credits reduce what customers owe.'
    },
    {
      id: 'was_acc_m5',
      subject: 'accounting',
      topicId: 'acc_part',
      difficulty: 'medium',
      question: 'A manufacturing firm reports: Opening Raw Materials 12,000; Purchases of Raw Materials 88,000; Carriage Inwards on Raw Materials 5,000; Closing Raw Materials 15,000; Direct Factory Wages 40,000; Factory Rent & Power 22,000. What is the PRIME COST?',
      options: [
        '130,000',
        '152,000',
        '125,000',
        '145,000'
      ],
      correctIndex: 0,
      explanation: 'Cost of Raw Materials Consumed = Opening (12,000) + Purchases (88,000) + Carriage Inwards (5,000) - Closing (15,000) = 90,000. Prime Cost = Direct Materials Consumed (90,000) + Direct Factory Wages (40,000) = 130,000. (Factory Rent & Power of 22,000 is an indirect factory overhead added AFTER Prime Cost.)',
      concept: 'Prime Cost = Direct Materials Consumed + Direct Labour + Direct Expenses (Royalties). Indirect factory overheads are added afterward to obtain Total Factory Cost.'
    },
    {
      id: 'was_acc_m6',
      subject: 'accounting',
      topicId: 'acc_part',
      difficulty: 'medium',
      question: 'A social club received 46,000 Naira in cash subscriptions during 2025. Subscriptions in arrears were 4,000 Naira on 1 Jan 2025 and 6,500 Naira on 31 Dec 2025. Subscriptions received in advance were 3,000 Naira on 1 Jan 2025 and 2,000 Naira on 31 Dec 2025. What subscription income should be credited to the Income and Expenditure Account for 2025?',
      options: [
        '44,500 Naira',
        '47,500 Naira',
        '49,500 Naira',
        '42,500 Naira'
      ],
      correctIndex: 2,
      explanation: 'Subscriptions belonging to 2025 = Cash received (46,000) - Opening arrears from 2024 (-4,000) + Closing arrears for 2025 (+6,500) + Opening advance paid in 2024 for 2025 (+3,000) - Closing advance paid in 2025 for 2026 (-2,000) = 49,500 Naira.',
      concept: 'Subscriptions Account rule: Cash Received + Closing Arrears + Opening Advance - Opening Arrears - Closing Advance = Subscription Income for the year.'
    },
    {
      id: 'was_acc_m7',
      subject: 'accounting',
      topicId: 'acc_comp',
      difficulty: 'medium',
      question: 'A retailer applies a uniform Mark-up of 25% on Cost. If total Sales Revenue for the year is 250,000 Cedis, what is the Gross Profit?',
      options: [
        '62,500 Cedis',
        '50,000 Cedis',
        '45,000 Cedis',
        '75,000 Cedis'
      ],
      correctIndex: 1,
      explanation: 'Mark-up = 25% = 1/4 on Cost -> Margin on Sales = 1 / (4 + 1) = 1/5 = 20%. Therefore Gross Profit = 20% of 250,000 Cedis = 50,000 Cedis (and Cost of Sales = 200,000 Cedis; verify 50,000 / 200,000 = 25% mark-up!).',
      concept: 'Converting Mark-up (GP/Cost = a/b) to Margin (GP/Sales): Margin = a / (b + a). Never apply a mark-up percentage directly to Sales!'
    },
    {
      id: 'was_acc_m8',
      subject: 'accounting',
      topicId: 'acc_comp',
      difficulty: 'medium',
      question: 'Given Opening Inventory = 18,000 Naira, Closing Inventory = 22,000 Naira, and Cost of Goods Sold = 160,000 Naira, what is the Rate of Inventory (Stock) Turnover?',
      options: [
        '7.27 times',
        '8 times',
        '8.89 times',
        '4 times'
      ],
      correctIndex: 1,
      explanation: 'Average Inventory = (18,000 + 22,000) / 2 = 20,000 Naira. Rate of Stock Turnover = Cost of Goods Sold / Average Inventory = 160,000 / 20,000 = 8 times per year.',
      concept: 'Rate of Inventory Turnover = Cost of Sales / Average Inventory, measuring how rapidly inventory is sold and replenished.'
    },
    {
      id: 'was_acc_m9',
      subject: 'accounting',
      topicId: 'acc_part',
      difficulty: 'medium',
      question: 'Ama and Kofi are partners sharing profits in the ratio 3 : 2. Net Profit for the year is 65,000 Cedis. Interest on Capital is Ama 6,000, Kofi 4,000; Ama receives a salary of 10,000; Interest charged on Drawings is Ama 1,500, Kofi 500. What is Ama\'s share of the residual profit in the Appropriation Account?',
      options: [
        '27,000 Cedis',
        '28,200 Cedis',
        '39,000 Cedis',
        '44,200 Cedis'
      ],
      correctIndex: 1,
      explanation: 'Available profit = Net Profit (65,000) + Interest on Drawings (1,500 + 500 = 2,000) = 67,000 Cedis. Deduct appropriations: Interest on Capital (6,000 + 4,000 = 10,000) and Ama\'s Salary (10,000) -> Residual Profit = 67,000 - 20,000 = 47,000 Cedis. Ama\'s 3/5 share of residual profit = (3/5) × 47,000 = 28,200 Cedis.',
      concept: 'Partnership Appropriation: Net Profit + Interest on Drawings - Interest on Capital - Partner Salaries = Residual Profit shared in PSR.'
    },
    {
      id: 'was_acc_m10',
      subject: 'accounting',
      topicId: 'acc_sole',
      difficulty: 'medium',
      question: 'Why does the Prudence (Conservatism) Concept require closing inventory to be valued at the LOWER of Cost and Net Realisable Value (NRV)?',
      options: [
        'To maximise taxable profit in the current year',
        'To ensure that anticipated losses on damaged or obsolete inventory are recognised immediately while unrealised profits are NOT anticipated before sale',
        'To avoid counting physical stock at year-end',
        'Because market selling prices never exceed historical cost'
      ],
      correctIndex: 1,
      explanation: 'Under IAS 2 and the Prudence Concept, if damaged inventory costing 10,000 can only be sold for 7,500 after repair costs (NRV), valuing it at 7,500 prevents overstating current assets and current profit.',
      concept: 'Inventory valuation rule (IAS 2 / Prudence): value each item or category at the LOWER of Historical Cost and Net Realisable Value (Estimated Selling Price minus Selling/Completion Costs).'
    },
    {
      id: 'was_acc_d1',
      subject: 'accounting',
      topicId: 'acc_books',
      difficulty: 'difficult',
      question: 'A business has an OVERDRAWN Cash Book (bank column credit balance) of 14,200 Naira on 30 June. Examination of the Bank Statement reveals: (i) bank charges of 600 Naira not entered in the Cash Book; (ii) a customer\'s credit transfer of 2,800 Naira paid directly to the bank; (iii) unpresented cheques of 4,500 Naira; and (iv) uncredited lodgements of 1,900 Naira. What balance is shown on the Bank Statement on 30 June?',
      options: [
        'Overdraft of 9,400 Naira',
        'Overdraft of 12,000 Naira',
        'Favourable credit balance of 9,400 Naira',
        'Overdraft of 14,600 Naira'
      ],
      correctIndex: 0,
      explanation: 'Step 1 — Update Cash Book: Start at -14,200 (overdraft) - 600 (bank charges) + 2,800 (credit transfer) = -12,000 Naira updated overdraft. Step 2 — Reconcile to Bank Statement: -12,000 + 4,500 (unpresented cheques have NOT yet increased the overdraft at the bank) - 1,900 (uncredited lodgements have NOT yet reduced the overdraft at the bank) = -9,400 Naira (Overdraft of 9,400 Naira, shown as Debit on the Bank Statement).',
      concept: 'With an OVERDRAFT (negative balance), algebraically track signs carefully: Updated Overdraft (-12,000) + Unpresented Cheques (+4,500) - Uncredited Deposits (-1,900) = -9,400.'
    },
    {
      id: 'was_acc_d2',
      subject: 'accounting',
      topicId: 'acc_depr',
      difficulty: 'difficult',
      question: 'A Trial Balance failed to agree: Total Debits were 4,600 Cedis LESS than Total Credits, so a Suspense Account was opened. Later, two errors were found: (1) The Sales Day Book was overcast by 1,800 Cedis; (2) A cash discount allowed of 1,400 Cedis was wrongly credited (instead of debited) to the Discounts Allowed Account. After correcting both errors, what is the balance on the Suspense Account?',
      options: [
        'Nil (0 Cedis — the Suspense Account closes completely)',
        'Debit balance of 1,400 Cedis',
        'Credit balance of 1,400 Cedis',
        'Debit balance of 3,200 Cedis'
      ],
      correctIndex: 0,
      explanation: 'Initial Trial Balance: Debits were 4,600 less than Credits, so Suspense Account opened with a DEBIT balance of 4,600 Cedis. Error (1): Sales credited 1,800 too much -> Debit Sales 1,800, Credit Suspense 1,800. Error (2): Discounts Allowed (1,400) was credited instead of debited, creating a DOUBLED discrepancy of 2 × 1,400 = 2,800 -> Debit Discounts Allowed 2,800, Credit Suspense 2,800. Total Credits to Suspense = 1,800 + 2,800 = 4,600 Cedis -> Suspense balance becomes Nil!',
      concept: 'Posting an entry to the WRONG side of an account creates a Trial Balance discrepancy equal to TWICE (2×) the amount of the entry.'
    },
    {
      id: 'was_acc_d3',
      subject: 'accounting',
      topicId: 'acc_depr',
      difficulty: 'difficult',
      question: 'Draft Net Profit before error correction was 52,000 Naira. Investigation discovered: (i) Closing inventory was understated by 3,500 Naira; (ii) Office equipment costing 10,000 Naira (depreciated at 10% p.a. on cost) had been charged in full to Office Expenses; (iii) A credit purchase of 2,200 Naira was completely omitted from the books. What is the corrected Net Profit?',
      options: [
        '62,300 Naira',
        '63,300 Naira',
        '64,500 Naira',
        '55,300 Naira'
      ],
      correctIndex: 0,
      explanation: 'Start with Draft Net Profit = 52,000. (i) Understated closing stock understated profit -> ADD 3,500 (= 55,500). (ii) Removing capital asset from expenses adds back +10,000, LESS 10% annual depreciation (-1,000) -> net +9,000 (= 64,500). (iii) Omitted purchase of 2,200 increases Cost of Purchases -> DEDUCT 2,200 (= 62,300 Naira).',
      concept: 'Statement of Corrected Net Profit: trace each error\'s impact on Revenue, Cost of Sales, Expenses, and consequential Depreciation.'
    },
    {
      id: 'was_acc_d4',
      subject: 'accounting',
      topicId: 'acc_comp',
      difficulty: 'difficult',
      question: 'A sole trader keeps incomplete records. On 1 Jan, Net Assets (Capital) were 90,000 Cedis; on 31 Dec, Net Assets were 134,000 Cedis. During the year, the owner introduced personal cash of 15,000 Cedis into the business bank account and withdrew 2,000 Cedis per month for personal living expenses plus 3,000 Cedis of goods at cost. What was the Net Profit for the year?',
      options: [
        '56,000 Cedis',
        '32,000 Cedis',
        '53,000 Cedis',
        '71,000 Cedis'
      ],
      correctIndex: 0,
      explanation: 'Total Drawings = (2,000 × 12 months) + 3,000 goods = 24,000 + 3,000 = 27,000 Cedis. Using the Single-Entry Capital comparison formula: Closing Capital = Opening Capital + Additional Capital + Net Profit - Drawings -> 134,000 = 90,000 + 15,000 + Net Profit - 27,000 -> 134,000 = 78,000 + Net Profit -> Net Profit = 56,000 Cedis.',
      concept: 'Single-Entry Net Profit = Closing Capital - Opening Capital + Total Drawings - Additional Capital Introduced.'
    },
    {
      id: 'was_acc_d5',
      subject: 'accounting',
      topicId: 'acc_comp',
      difficulty: 'difficult',
      question: 'On 30 September, a warehouse fire destroyed most of a trader\'s stock, leaving salvaged undamaged goods worth 6,000 Naira at cost. Records from 1 Jan to 30 Sept show: Opening Stock 25,000; Net Purchases 140,000; Net Sales 180,000. The trader consistently earns a Gross Profit MARGIN of 25% on Sales. What is the cost of inventory destroyed by the fire (insurance claim)?',
      options: [
        '30,000 Naira',
        '24,000 Naira',
        '19,000 Naira',
        '36,000 Naira'
      ],
      correctIndex: 1,
      explanation: 'Cost of Goods Available for Sale = Opening Stock (25,000) + Net Purchases (140,000) = 165,000 Naira. With a 25% Gross Profit Margin on Sales, Gross Profit = 25% of 180,000 = 45,000 Naira, so Cost of Goods Sold = 180,000 - 45,000 = 135,000 Naira. Estimated Total Stock on hand at date of fire = 165,000 - 135,000 = 30,000 Naira. Deduct salvaged stock (6,000) -> Stock destroyed = 24,000 Naira.',
      concept: 'Stock-loss insurance claim: Estimated Closing Stock (Goods Available minus Cost of Sales) minus Salvaged Stock = Value of Stock Destroyed.'
    },
    {
      id: 'was_acc_d6',
      subject: 'accounting',
      topicId: 'acc_part',
      difficulty: 'difficult',
      question: 'Bola and Tunde share profits 3 : 2. They admit Chidi as a new partner, and the new profit-sharing ratio among Bola, Tunde, and Chidi is 2 : 2 : 1. Goodwill is valued at 50,000 Naira, and the partners decide NOT to maintain a Goodwill Account in the books. What adjustment entries are made in the Capital Accounts?',
      options: [
        'Credit Bola 30,000 and Tunde 20,000 only',
        'Debit Chidi 10,000; Credit Bola 10,000 (Tunde nil net change)',
        'Debit Bola 10,000; Credit Chidi 10,000',
        'Debit Bola 20,000, Tunde 20,000, Chidi 10,000'
      ],
      correctIndex: 1,
      explanation: 'Step 1 — Credit Goodwill (50,000) in OLD ratio (3:2): Bola +30,000, Tunde +20,000. Step 2 — Write off Goodwill (debit 50,000) in NEW ratio (2:2:1): Bola -20,000, Tunde -20,000, Chidi -10,000. Net adjustment: Bola = +30,000 - 20,000 = +10,000 Credit; Tunde = +20,000 - 20,000 = 0; Chidi = -10,000 Debit.',
      concept: 'Goodwill written off on admission: Credit Goodwill to old partners in OLD PSR, then Debit Goodwill to all partners in NEW PSR (gaining partner compensates sacrificing partner).'
    },
    {
      id: 'was_acc_d7',
      subject: 'accounting',
      topicId: 'acc_part',
      difficulty: 'difficult',
      question: 'A factory transfers finished goods from its Manufacturing Account to its Trading Account at Cost PLUS a 20% Factory Profit. If Total Cost of Production of finished goods is 200,000 Cedis, and unsold Closing Inventory of finished goods at year-end has a transfer value of 36,000 Cedis (with Nil Opening Inventory), what Provision for Unrealised Profit must be deducted on the Balance Sheet?',
      options: [
        '7,200 Cedis',
        '6,000 Cedis',
        '5,400 Cedis',
        '40,000 Cedis'
      ],
      correctIndex: 1,
      explanation: 'Transfer value includes a 20% mark-up on Production Cost (120% of Cost = 36,000 Cedis). Therefore the unrealised factory profit element inside the 36,000 closing finished stock is (20 / 120) × 36,000 = (1/6) × 36,000 = 6,000 Cedis (True Factory Cost = 30,000 Cedis).',
      concept: 'Provision for Unrealised Profit eliminates internal mark-up from unsold finished goods so inventory is reported at true historical production cost (IAS 2).'
    },
    {
      id: 'was_acc_d8',
      subject: 'accounting',
      topicId: 'acc_comp',
      difficulty: 'difficult',
      question: 'A limited liability company issues 200,000 Ordinary Shares of nominal (par) value 1.00 Cedi each at an issue price of 1.40 Cedis per share, fully paid. How is the 280,000 Cedis received recorded in Equity?',
      options: [
        'Ordinary Share Capital: 280,000 Cedis',
        'Ordinary Share Capital: 200,000 Cedis; Share Premium Account: 80,000 Cedis',
        'Ordinary Share Capital: 200,000 Cedis; Retained Earnings (Revenue Reserve): 80,000 Cedis',
        'Debenture Liability: 280,000 Cedis'
      ],
      correctIndex: 1,
      explanation: 'Ordinary Share Capital is ALWAYS credited strictly at nominal/par value (200,000 × 1.00 = 200,000 Cedis). The excess above par (200,000 × 0.40 = 80,000 Cedis) is credited to the Share Premium Account, a statutory capital reserve that cannot be distributed as cash dividends.',
      concept: 'Shares issued at a premium: credit Share Capital with nominal value and credit Share Premium Account (Capital Reserve) with the excess.'
    },
    {
      id: 'was_acc_d9',
      subject: 'accounting',
      topicId: 'acc_sole',
      difficulty: 'difficult',
      question: 'In Departmental Accounts, how should shared indirect expenses be apportioned most equitably across Sales Departments A, B, and C if no direct metering exists?',
      options: [
        'Split every overhead equally (1/3 each) regardless of size or turnover',
        'Apportion each overhead using its most causal physical or revenue driver — e.g., Rent & Rates by floor area occupied, Canteen/Welfare by number of employees, and Selling Commissions/Advertising by departmental sales turnover',
        'Charge 100% of indirect expenses to the largest department',
        'Omit indirect expenses from departmental Profit or Loss completely'
      ],
      correctIndex: 1,
      explanation: 'Accurate departmental profitability requires matching each common overhead to its closest cost driver: floor space for rent/lighting, asset value for insurance/depreciation of plant, headcount for staff welfare, and sales/purchases for selling or buying expenses.',
      concept: 'Departmental overhead apportionment uses logical cost drivers (floor area, headcount, asset value, sales revenue) rather than arbitrary equal splits.'
    },
    {
      id: 'was_acc_d10',
      subject: 'accounting',
      topicId: 'acc_comp',
      difficulty: 'difficult',
      question: 'A company\'s Trade Receivables at 1 Jan were 32,000 Naira and at 31 Dec were 40,000 Naira. During the year, cash/cheques collected from credit customers totalled 274,000 Naira, Discounts Allowed were 5,000 Naira, Returns Inwards were 6,000 Naira, and Bad Debts written off were 3,000 Naira. What were Total Credit Sales for the year?',
      options: [
        '280,000 Naira',
        '296,000 Naira',
        '288,000 Naira',
        '320,000 Naira'
      ],
      correctIndex: 1,
      explanation: 'Reconstruct the Total Trade Receivables Control Account: Opening Balance (32,000) + Credit Sales (X) = Cash Received (274,000) + Discounts Allowed (5,000) + Returns Inwards (6,000) + Bad Debts (3,000) + Closing Balance (40,000) = 328,000 Naira. Therefore X = 328,000 - 32,000 = 296,000 Naira.',
      concept: 'Credit Sales reconstruction: Closing Debtors + Receipts + Discounts Allowed + Returns Inwards + Bad Debts - Opening Debtors = Credit Sales.'
    },

    // =========================================================================
    // 11. GOVERNMENT (30 Questions: 10 Easy, 10 Medium, 10 Difficult)
    // =========================================================================
    {
      id: 'was_gov_e1',
      subject: 'government',
      topicId: 'gov_prin',
      difficulty: 'easy',
      question: 'Which political concept refers to the supreme, ultimate, and unchallengeable legal authority of a state to make and enforce laws within its territory free from external control?',
      options: [
        'Legitimacy',
        'Sovereignty',
        'Socialism',
        'gerrymandering'
      ],
      correctIndex: 1,
      explanation: 'Sovereignty (systematised by Jean Bodin) is the supreme legal authority of an independent state internally over all citizens/institutions and externally free from foreign subordination.',
      concept: 'Four essential elements of a State: Population, Defined Territory, Government, and Sovereignty (only a State possesses sovereignty).'
    },
    {
      id: 'was_gov_e2',
      subject: 'government',
      topicId: 'gov_prin',
      difficulty: 'easy',
      question: 'Who propounded the classical doctrine of the Separation of Powers among the Legislature, Executive, and Judiciary in his 1748 work "The Spirit of the Laws"?',
      options: [
        'Baron de Montesquieu',
        'A. V. Dicey',
        'Karl Marx',
        'Jean Bodin'
      ],
      correctIndex: 0,
      explanation: 'The French political thinker Baron de Montesquieu formulated Separation of Powers to prevent tyranny by ensuring the same person or body does not make laws, execute them, and adjudicate disputes.',
      concept: 'Key theorists in WASSCE Government: Jean Bodin -> Sovereignty; Baron de Montesquieu -> Separation of Powers; A. V. Dicey -> Rule of Law.'
    },
    {
      id: 'was_gov_e3',
      subject: 'government',
      topicId: 'gov_org',
      difficulty: 'easy',
      question: 'In a Parliamentary (Cabinet) system of government, how are the roles of Head of State and Head of Government structured?',
      options: [
        'Both offices are fused in one executive President',
        'They are SEPARATED: a ceremonial Head of State (Monarch or ceremonial President) is distinct from the Prime Minister, who serves as Head of Government',
        'The Chief Justice serves as Head of Government',
        'There is no legislature in a parliamentary system'
      ],
      correctIndex: 1,
      explanation: 'A dual executive defines the Parliamentary system: the ceremonial Head of State symbolises the nation, while real executive leadership rests with the Prime Minister and Cabinet drawn from Parliament.',
      concept: 'Parliamentary = dual executive + fusion of legislature/executive + collective responsibility; Presidential = single executive + strict separation of powers + individual responsibility.'
    },
    {
      id: 'was_gov_e4',
      subject: 'government',
      topicId: 'gov_org',
      difficulty: 'easy',
      question: 'What is a "bicameral legislature"?',
      options: [
        'A parliament controlled by two political parties only',
        'A law-making body composed of TWO legislative chambers (an Upper House such as a Senate and a Lower House such as a House of Representatives)',
        'A legislature that meets once every two years',
        'A cabinet of two ministers'
      ],
      correctIndex: 1,
      explanation: 'Bicameralism means two legislative houses (as in Nigeria\'s National Assembly: Senate + House of Representatives), whereas unicameralism means a single legislative chamber (as in Ghana\'s Parliament).',
      concept: 'Ghana operates a Unicameral Parliament (275+ MPs); Nigeria operates a Bicameral National Assembly (Senate + House of Representatives).'
    },
    {
      id: 'was_gov_e5',
      subject: 'government',
      topicId: 'gov_hist',
      difficulty: 'easy',
      question: 'Which pre-colonial West African society is the classic textbook example of an "acephalous" (non-centralised / stateless) political system lacking an absolute monarch?',
      options: [
        'The Hausa-Fulani Emirate',
        'The Asante Kingdom',
        'The Pre-Colonial Igbo Political System',
        'The Old Oyo Empire'
      ],
      correctIndex: 2,
      explanation: 'Most pre-colonial Igbo communities operated decentralized village democracies governed collectively through Councils of Elders (Ama-ala / Ndichie), Ofo title holders, Ozo societies, Age-Grades, and Umuada rather than centralized kings.',
      concept: 'Centralized pre-colonial systems: Hausa-Fulani, Asante, Oyo, Benin; Decentralized/acephalous systems: Igbo, Tiv, Tallensi.'
    },
    {
      id: 'was_gov_e6',
      subject: 'government',
      topicId: 'gov_hist',
      difficulty: 'easy',
      question: 'Which British colonial administrator is most famously associated with the introduction and systematisation of Indirect Rule in West Africa?',
      options: [
        'Sir Hugh Clifford',
        'Lord Frederick Lugard',
        'Sir Alan Burns',
        'Sir Arden-Clarke'
      ],
      correctIndex: 1,
      explanation: 'Lord Frederick Lugard introduced Indirect Rule in Northern Nigeria after 1900 (and extended it after the 1914 Amalgamation), governing local populations through existing traditional rulers, native courts, and native treasuries.',
      concept: 'Indirect Rule succeeded best in Northern Nigeria (centralized Emirates + existing tax/Sharia structures), partially in Western Nigeria, and failed in Eastern Nigeria (Warrant Chiefs crisis / 1929 Aba Women\'s Riot).'
    },
    {
      id: 'was_gov_e7',
      subject: 'government',
      topicId: 'gov_nat',
      difficulty: 'easy',
      question: 'Which 1922 British West African constitution introduced the "Elective Principle" for the first time in Nigeria (3 elected seats for Lagos and 1 for Calabar)?',
      options: [
        'The Sir Hugh Clifford Constitution of 1922',
        'The Arthur Richards Constitution of 1946',
        'The Oliver Lyttelton Constitution of 1954',
        'The Independence Constitution of 1960'
      ],
      correctIndex: 0,
      explanation: 'The Clifford Constitution of 1922 introduced the first elective representation into the Legislative Council in British West Africa (prompting Herbert Macaulay to form the NNDP in 1923), followed in the Gold Coast by the 1925 Guggisberg Constitution.',
      concept: 'Elective Principle milestones: 1922 Clifford Constitution (Nigeria — Lagos & Calabar) and 1925 Guggisberg Constitution (Gold Coast — Accra, Cape Coast, Sekondi).'
    },
    {
      id: 'was_gov_e8',
      subject: 'government',
      topicId: 'gov_nat',
      difficulty: 'easy',
      question: 'Which core principle of the Civil Service requires civil servants to serve whichever political party wins power loyally without engaging in partisan politics?',
      options: [
        'Political Neutrality (Impartiality)',
        'Spoils System',
        'Parliamentary Privilege',
        'Judicial Precedent'
      ],
      correctIndex: 0,
      explanation: 'The Civil Service rests on Permanence, Political Neutrality (Impartiality), Anonymity (ministers take public praise/blame in parliament, not civil servants), and Meritocracy.',
      concept: 'Four pillars of the Career Civil Service: Permanence, Political Neutrality, Anonymity, and Expertise/Merit.'
    },
    {
      id: 'was_gov_e9',
      subject: 'government',
      topicId: 'gov_intl',
      difficulty: 'easy',
      question: 'When and where was the Treaty establishing the Economic Community of West African States (ECOWAS) signed?',
      options: [
        '25 May 1963 in Addis Ababa',
        '28 May 1975 in Lagos',
        '9 July 2002 in Durban',
        '24 October 1945 in San Francisco'
      ],
      correctIndex: 1,
      explanation: 'ECOWAS was founded by the Treaty of Lagos on 28 May 1975 (spearheaded by Nigeria\'s Gen. Yakubu Gowon and Togo\'s Gnassingbe Eyadema) to promote West African economic integration; its Commission headquarters is today in Abuja.',
      concept: 'ECOWAS: founded 28 May 1975 (Treaty of Lagos), Administrative HQ in Abuja, ECOWAS Fund/EBID in Lome.'
    },
    {
      id: 'was_gov_e10',
      subject: 'government',
      topicId: 'gov_org',
      difficulty: 'easy',
      question: 'How does a Pressure Group (Interest Group) fundamentally differ from a Political Party?',
      options: [
        'Pressure groups contest general elections to capture state power, whereas political parties do not',
        'Political parties seek to win elections and form the government, whereas pressure groups seek to INFLUENCE government policies in favour of their members/cause without capturing state power',
        'Pressure groups are banned in all democracies',
        'Political parties have no manifestos'
      ],
      correctIndex: 1,
      explanation: 'Trade unions, bar associations, medical associations, and student unions act as pressure groups: they lobby, petition, negotiate, or strike to shape public policy, whereas political parties nominate candidates to win control of government.',
      concept: 'Political Parties -> capture and exercise state power via elections; Pressure Groups -> influence government decisions without forming the government.'
    },
    {
      id: 'was_gov_m1',
      subject: 'government',
      topicId: 'gov_prin',
      difficulty: 'medium',
      question: 'Why do multi-ethnic, geographically diverse states (such as Nigeria or the United States) adopt a FEDERAL system with a written and rigid constitution?',
      options: [
        'To allow the central government to abolish state governments by ordinary simple majority vote',
        'To constitutionally divide powers between the central government and component units (Exclusive, Concurrent, Residual lists) so neither level can unilaterally usurp the other\'s autonomy, promoting unity in diversity',
        'To eliminate local government councils completely',
        'Because federal systems are cheaper to run than unitary systems'
      ],
      correctIndex: 1,
      explanation: 'Federalism protects minority groups and regional autonomy while maintaining national strength; a written, rigid constitution (interpreted by a Supreme Court) prevents either tier from altering the division of powers unilaterally.',
      concept: 'Essential features of Federalism: constitutional division of powers (Exclusive, Concurrent, Residual), written & rigid constitution, bicameral legislature, and independent Supreme Court.'
    },
    {
      id: 'was_gov_m2',
      subject: 'government',
      topicId: 'gov_org',
      difficulty: 'medium',
      question: 'In a Parliamentary Cabinet system, what is the constitutional consequence of the doctrine of "Collective Ministerial Responsibility"?',
      options: [
        'Each minister can publicly campaign against Cabinet decisions while remaining in office',
        'All Cabinet ministers must publicly defend Cabinet policies as one team; a minister who cannot support a Cabinet decision must resign, and if Parliament passes a Vote of No Confidence in the government, the entire Cabinet must resign',
        'Civil servants must resign whenever a Prime Minister loses an election',
        'Judges are appointed by trade unions'
      ],
      correctIndex: 1,
      explanation: 'Cabinet decisions bind every member collectively: ministers deliberate privately in secret, speak with one voice in public, and stand or fall together if defeated on a motion of confidence in Parliament.',
      concept: 'Collective Responsibility (Parliamentary Cabinet stands/falls together) vs Individual Ministerial Responsibility (each minister answers for their own ministry).'
    },
    {
      id: 'was_gov_m3',
      subject: 'government',
      topicId: 'gov_hist',
      difficulty: 'medium',
      question: 'In the pre-colonial Old Oyo Empire, how did the Oyomesi (council of seven kingmakers led by the Bashorun) check an Alaafin who became tyrannical or violated constitutional custom?',
      options: [
        'They appealed to the British Privy Council in London',
        'The Bashorun could present an empty calabash (or parrot\'s eggs) pronouncing rejection by the gods and the people, compelling the Alaafin to commit ritual suicide',
        'They abolished the cavalry army permanently',
        'They transferred the capital to Kumasi'
      ],
      correctIndex: 1,
      explanation: 'Pre-colonial Oyo featured sophisticated checks and balances: the Alaafin was checked by the Oyomesi (who could demand his suicide via an empty calabash), while the Oyomesi itself was checked by the Ogboni society and the requirement that one member (Oremoje) die alongside the Alaafin!',
      concept: 'Old Oyo checks and balances: Alaafin (monarch) <-> Oyomesi (kingmakers led by Bashorun) <-> Ogboni cult <-> Are-Ona-Kakanfo (army commander living outside the capital).'
    },
    {
      id: 'was_gov_m4',
      subject: 'government',
      topicId: 'gov_hist',
      difficulty: 'medium',
      question: 'Why did the French colonial policy of "Assimilation" eventually shift toward the policy of "Association" across French West Africa?',
      options: [
        'Because Africans in the Four Communes of Senegal refused French citizenship',
        'Because full Assimilation proved prohibitively expensive to extend beyond the Four Communes (Dakar, Goree, Rufisque, Saint-Louis), faced strong resistance from African cultural/Islamic institutions, and aroused opposition from French scholars and settlers',
        'Because France handed West Africa to Portugal in 1920',
        'Because Indigenat forced labour was used only under Association'
      ],
      correctIndex: 1,
      explanation: 'Granting full French citizenship rights, metropolitan schools, and equal social welfare to millions of West Africans outside Senegal\'s Four Communes was financially costly and politically threatening to French parliamentary dominance, prompting the shift to Association.',
      concept: 'French Assimilation (Four Communes of Senegal: Citizens vs Subjects under the Indigenat) -> shifted to Association (respecting local institutions while retaining centralized French federation under Dakar).'
    },
    {
      id: 'was_gov_m5',
      subject: 'government',
      topicId: 'gov_nat',
      difficulty: 'medium',
      question: 'What was the major constitutional significance of the 1946 Alan Burns Constitution in the Gold Coast (Ghana) and the 1949 All-African Coussey Committee?',
      options: [
        'The 1946 Burns Constitution granted full republican status immediately',
        'The 1946 Burns Constitution created the first African unofficial majority in a British African Legislative Council (yet left real executive power with the Governor, called "outmoded at birth" by the Watson Commission after the 1948 riots), leading to the 1949 all-African Coussey Committee and the 1951 constitution',
        'They abolished universal adult suffrage until 1992',
        'They merged the Gold Coast with French Togo'
      ],
      correctIndex: 1,
      explanation: 'Following the February 1948 Accra riots and detention of the "Big Six" of the UGCC, the Watson Commission declared the 1946 Burns Constitution outmoded at birth, leading to the 39-member all-African Sir Henley Coussey Committee (1949) and Kwame Nkrumah\'s 1951 Leader of Government Business victory.',
      concept: 'Gold Coast path to independence: 1946 Burns -> 1947 UGCC -> 1948 Riots & Watson Commission -> 1949 Coussey Committee & CPP -> 1951 Arden-Clarke -> 1954 Nkrumah all-African Cabinet -> 6 March 1957 Independence.'
    },
    {
      id: 'was_gov_m6',
      subject: 'government',
      topicId: 'gov_nat',
      difficulty: 'medium',
      question: 'In Nigerian constitutional history, which colonial constitution formally established a TRUE FEDERAL SYSTEM in Nigeria by sharing powers directly between the Federal Government and the three Regions (North, West, East) and regionalising the civil service and judiciary?',
      options: [
        'The 1922 Clifford Constitution',
        'The 1946 Richards Constitution',
        'The 1954 Oliver Lyttelton Constitution',
        'The 1979 Second Republic Constitution'
      ],
      correctIndex: 2,
      explanation: 'While the 1946 Richards Constitution introduced regionalism and 1951 Macpherson created quasi-federalism, the 1954 Lyttelton Constitution established full Nigerian federalism: Exclusive & Concurrent lists, Regional Premiers, regionalised Civil Service/Judiciary, and Lagos as Federal Territory.',
      concept: 'Nigerian constitutional milestones: 1922 Clifford (Elective Principle) -> 1946 Richards (Regionalism) -> 1951 Macpherson (Quasi-federalism) -> 1954 Lyttelton (True Federalism) -> 1960 Independence -> 1963 Republic.'
    },
    {
      id: 'was_gov_m7',
      subject: 'government',
      topicId: 'gov_org',
      difficulty: 'medium',
      question: 'What is a key democratic advantage of Proportional Representation (PR) over the Simple Plurality ("First-Past-The-Post") electoral system?',
      options: [
        'It guarantees single-party landslide majorities even with 35% of the vote',
        'It allocates parliamentary seats closely in proportion to each party\'s share of total votes cast, reducing "wasted votes" and ensuring fair representation of smaller parties and minorities',
        'It requires zero voter registration',
        'It prevents coalition governments from ever forming'
      ],
      correctIndex: 1,
      explanation: 'Under First-Past-The-Post, a party winning 25% of votes spread evenly across constituencies may win zero seats; Proportional Representation reflects voter preferences accurately, though it more frequently produces coalition governments.',
      concept: 'First-Past-The-Post (strong constituency link + stable single-party majority, but disproportional seats) vs Proportional Representation (fair seat-to-vote reflection, coalition politics).'
    },
    {
      id: 'was_gov_m8',
      subject: 'government',
      topicId: 'gov_nat',
      difficulty: 'medium',
      question: 'Why do governments establish Public Corporations (Statutory State Enterprises) by special Acts of Parliament rather than running commercial utilities directly inside regular Civil Service ministries?',
      options: [
        'So politicians can pocket revenues without audit',
        'To provide essential capital-intensive utilities and strategic services free from slow bureaucratic Civil Service red tape, allowing commercial management flexibility while maintaining public accountability',
        'To abolish parliamentary oversight completely',
        'Because private companies are illegal in West Africa'
      ],
      correctIndex: 1,
      explanation: 'Public corporations (such as water, power, ports, or broadcasting authorities) have corporate legal personality managed by a Board of Directors so they can make rapid operational decisions while remaining answerable to a sector Minister and Parliament\'s Public Accounts Committee.',
      concept: 'Public Corporations combine operational autonomy (Board of Directors, separate legal entity) with public ownership and parliamentary audit.'
    },
    {
      id: 'was_gov_m9',
      subject: 'government',
      topicId: 'gov_intl',
      difficulty: 'medium',
      question: 'In the United Nations Security Council (UNSC), what does the "Veto Power" exercised by the five Permanent Members (USA, UK, France, Russia, China) mean?',
      options: [
        'Any single negative vote cast by ONE of the five Permanent Members blocks a substantive Security Council resolution even if all other 14 members vote in favour',
        'Only the UN Secretary-General can veto General Assembly budgets',
        'A resolution passes whenever 3 out of 5 Permanent Members agree',
        'African Union states hold two permanent veto seats on the UNSC'
      ],
      correctIndex: 0,
      explanation: 'Under Article 27 of the UN Charter, substantive UNSC decisions require 9 affirmative votes out of 15 members INCLUDING the concurring votes (or abstention, by practice) of ALL FIVE Permanent Members (P5); one P5 "No" vote defeats the resolution.',
      concept: 'UN Security Council = 15 members (5 Permanent with veto + 10 Non-Permanent elected for 2-year terms by the General Assembly).'
    },
    {
      id: 'was_gov_m10',
      subject: 'government',
      topicId: 'gov_prin',
      difficulty: 'medium',
      question: 'What is "Delegated Legislation", and why is it indispensable in modern states despite criticisms regarding separation of powers?',
      options: [
        'Laws passed directly by national referendum',
        'Rules, statutory instruments, bye-laws, and orders-in-council made by ministers, local authorities, or statutory bodies under authority granted by an enabling Parent Act of Parliament — saving parliamentary time, supplying technical expertise, and responding swiftly to emergencies',
        'Court judgements delivered by magistrates',
        'Military decrees suspending the constitution'
      ],
      correctIndex: 1,
      explanation: 'Parliament lacks the time and technical detail to draft every aviation safety rule or municipal sanitation bye-law, so it passes an enabling Act delegating subsidiary rulemaking power subject to parliamentary scrutiny and judicial review (ultra vires).',
      concept: 'Delegated Legislation safeguards: Parliamentary control (laying instruments before Parliament) and Judicial Review (declaring rules ultra vires if they exceed the Parent Act).'
    },
    {
      id: 'was_gov_d1',
      subject: 'government',
      topicId: 'gov_prin',
      difficulty: 'difficult',
      question: 'When a High Court or Supreme Court strikes down a ministerial regulation or an Act of Parliament as "ultra vires" under Judicial Review, what constitutional principle is being enforced?',
      options: [
        'Parliamentary Supremacy of the Westminster kind',
        'Constitutional Supremacy and the Rule of Law — the body or legislature acted BEYOND the legal powers granted to it by the Parent Act or the written Supreme Constitution',
        'Prerogative of Mercy',
        'Diplomatic Immunity'
      ],
      correctIndex: 1,
      explanation: '"Ultra vires" (Latin: "beyond the powers") means an authority acted outside either its substantive statutory mandate (substantive ultra vires) or mandatory legal procedures (procedural ultra vires), making the act null and void.',
      concept: 'Constitutional Supremacy (written constitution is supreme over Parliament, as in Ghana 1992 and Nigeria 1999) vs Parliamentary Supremacy (UK unwritten constitution).'
    },
    {
      id: 'was_gov_d2',
      subject: 'government',
      topicId: 'gov_hist',
      difficulty: 'difficult',
      question: 'Why did British Indirect Rule provoke intense resistance — culminating in the 1929 Aba Women\'s War (Riot) — in South-Eastern Nigeria while functioning smoothly in the Northern Emirates?',
      options: [
        'Because Northern Nigeria had no taxation prior to British rule',
        'Because the British appointed artificial "Warrant Chiefs" who lacked traditional legitimacy in decentralized Igbo society and attempted to impose direct taxation and census enumeration without popular council consent',
        'Because French troops invaded Aba in 1929',
        'Because Eastern Nigeria had a centralized Sultanate'
      ],
      correctIndex: 1,
      explanation: 'In Northern Nigeria, Emirs already exercised centralized executive/judicial authority and collected Islamic taxes (Jangali/Haraji). In acephalous Igbo communities, British-created Warrant Chiefs wielded autocratic powers alien to indigenous village consensus, sparking the 1929 women\'s uprising.',
      concept: 'Comparative Indirect Rule: pre-existing centralized hierarchy + tax machinery (North) vs artificial Warrant Chiefs + alien direct taxation (East).'
    },
    {
      id: 'was_gov_d3',
      subject: 'government',
      topicId: 'gov_hist',
      difficulty: 'difficult',
      question: 'In the pre-colonial Asante Confederacy, what dual political and spiritual role did the Golden Stool (Sika Dwa Kofi) play in uniting the metropolitan Omanhene states under the Asantehene?',
      options: [
        'It was merely a gold-plated chair sold to European traders at Elmina',
        'Conjured according to tradition by Okomfo Anokye during Osei Tutu I\'s reign, it embodied the collective soul (Sunsum) of the entire Asante nation — commanding allegiance above any individual Omanhene or even the Asantehene himself, who could be destooled if he violated his oath',
        'It abolished the Confederacy Council (Asantemanhyiamu)',
        'It made Asante an acephalous society without chiefs'
      ],
      correctIndex: 1,
      explanation: 'The Golden Stool forged competing Akan states into a cohesive union while constitutional checks — the Queen Mother (Asantehemaa), Kronti/ elders, Asantemanhyiamu, and destoolment — prevented royal absolutism.',
      concept: 'Asante constitutionalism: sacred unity around the Golden Stool + Confederacy structure + formal destoolment checks on chiefs who breached oaths.'
    },
    {
      id: 'was_gov_d4',
      subject: 'government',
      topicId: 'gov_nat',
      difficulty: 'difficult',
      question: 'How did Proto-Nationalism BEFORE World War II (such as J. E. Casely Hayford\'s 1920 National Congress of British West Africa — NCBWA) differ from Militant Mass Nationalism AFTER 1945?',
      options: [
        'Proto-nationalists launched guerrilla wars in 1920 while post-1945 nationalists wanted perpetual colonial rule',
        'Inter-war proto-nationalists were largely Western-educated urban elites petitioning constitutionally for incremental reforms (elective seats, a West African University, Africanisation of the civil service) within the Empire, whereas post-1945 mass parties mobilised workers, ex-servicemen, and youth demanding immediate SELF-GOVERNMENT and INDEPENDENCE',
        'The NCBWA included French and Portuguese colonies in 1920',
        'Post-1945 nationalists opposed universal adult suffrage'
      ],
      correctIndex: 1,
      explanation: 'The 1920 NCBWA (Accra conference) sent a delegation to London seeking Legislative Council elections, judicial separation from the executive, and higher education (leading later to Achimota/Yaba/Legon/Ibadan), whereas post-WWII movements (CPP, NCNC, AG) demanded immediate sovereignty.',
      concept: 'Pre-WWII elite constitutional reformism (ARPS, NCBWA, NNDP) vs Post-1945 mass anti-colonial nationalism driven by WWII ex-servicemen, Atlantic Charter, Pan-African Congress (Manchester 1945), and economic grievances.'
    },
    {
      id: 'was_gov_d5',
      subject: 'government',
      topicId: 'gov_nat',
      difficulty: 'difficult',
      question: 'When a Military Regime seizes power through a coup d\'etat, how does its structure of governance fundamentally alter constitutional rule?',
      options: [
        'It strengthens bicameral parliamentary debates and independent party opposition',
        'It suspends or modifies the supreme Constitution, dissolves elected legislatures and political parties, fuses legislative and executive power in a ruling military council ruling by Decrees/Edicts, and often inserts "ouster clauses" restricting judicial review',
        'It introduces proportional representation immediately',
        'It transfers sovereignty to local governments'
      ],
      correctIndex: 1,
      explanation: 'Military regimes rule via centralized command hierarchy: supreme military councils enact Decrees (central/federal) and Edicts (regional/state), frequently ousting court jurisdiction over decrees and eroding separation of powers and civil liberties.',
      concept: 'Characteristics of Military Rule: suspension of constitution, fusion of legislative & executive organs, rule by Decree/Edict, ban on partisan politics, and ouster clauses.'
    },
    {
      id: 'was_gov_d6',
      subject: 'government',
      topicId: 'gov_org',
      difficulty: 'difficult',
      question: 'Compare how a President is removed from office in a Presidential system (e.g., Nigeria 1999 / Ghana 1992) versus how a Prime Minister is removed in a Parliamentary system (e.g., Nigeria 1960–1966 / Ghana 1969–1972):',
      options: [
        'Both can be dismissed at will by the Chief Justice',
        'A President has a fixed tenure and can only be removed before term-end through a rigorous constitutional IMPEACHMENT process for gross misconduct/constitutional breach, whereas a Prime Minister has an unfixed tenure dependent on parliamentary support and falls immediately upon losing a VOTE OF NO CONFIDENCE',
        'A Prime Minister can only be removed by national referendum',
        'A President loses office automatically whenever an executive bill is defeated in Parliament'
      ],
      correctIndex: 1,
      explanation: 'Defeat of an executive bill in Congress/Parliament does NOT topple an executive President (fixed tenure + separation of powers), whereas defeat on a confidence or budget vote in a Parliamentary system compels Cabinet resignation or dissolution of Parliament.',
      concept: 'Presidential removal -> Impeachment for gross constitutional misconduct; Parliamentary removal -> Vote of No Confidence on policy/support.'
    },
    {
      id: 'was_gov_d7',
      subject: 'government',
      topicId: 'gov_intl',
      difficulty: 'difficult',
      question: 'What crucial doctrinal shift occurred when the Organisation of African Unity (OAU, 1963) transformed into the African Union (AU, launched in Durban in 2002 under the Constitutive Act)?',
      options: [
        'The AU abandoned economic integration and moved its headquarters from Addis Ababa to Cairo',
        'While the 1963 OAU Charter enforced strict absolute non-interference in internal affairs, Article 4(h) of the AU Constitutive Act shifted from "non-interference" to "non-indifference", empowering the AU to intervene in member states in grave circumstances (war crimes, genocide, crimes against humanity) and sanction unconstitutional changes of government',
        'The AU restricted membership to anglophone states only',
        'The AU abolished the Peace and Security Council'
      ],
      correctIndex: 1,
      explanation: 'Alongside creating the Peace and Security Council, Pan-African Parliament, African Peer Review Mechanism (NEPAD), and AfCFTA framework, the AU replaced OAU passivity toward internal atrocities and coups with collective peace-enforcement authority.',
      concept: 'OAU (1963: decolonisation, anti-apartheid, strict non-interference) -> AU (2002: economic integration, Peace & Security Council, Article 4(h) intervention against atrocities & anti-coup sanctions).'
    },
    {
      id: 'was_gov_d8',
      subject: 'government',
      topicId: 'gov_intl',
      difficulty: 'difficult',
      question: 'Which persistent structural challenge most severely limits intra-regional trade and full monetary union among ECOWAS member states?',
      options: [
        'Lack of any shared borders in West Africa',
        'Production of similar primary agricultural/mineral exports directed toward Europe/Asia rather than complementary manufactured goods, compounded by multiple inconvertible currencies (Francophone UEMOA CFA zone vs Anglophone national currencies), non-tariff border barriers, and intermittent political/security crises',
        'Absence of any ECOWAS protocol on free movement of persons',
        'Total absence of seaports in West Africa'
      ],
      correctIndex: 1,
      explanation: 'Although the 1979 ECOWAS Free Movement Protocol abolished short-stay visas and ECOMOG/ECOWAS mediated conflicts in Liberia, Sierra Leone, and The Gambia, low industrial complementarity, parallel colonial currency blocs, and border delays constrain intra-ECOWAS trade.',
      concept: 'ECOWAS achievements (free movement protocol, ECOMOG peacekeeping, common external tariff) vs obstacles (primary-commodity similarity, currency duality, border friction, coups/insurgency).'
    },
    {
      id: 'was_gov_d9',
      subject: 'government',
      topicId: 'gov_nat',
      difficulty: 'difficult',
      question: 'What role does the Ombudsman (such as Ghana\'s CHRAJ or Nigeria\'s Public Complaints Commission) perform in a constitutional democracy?',
      options: [
        'Prosecuting murder trials in place of the Supreme Court',
        'Investigating citizens\' complaints of administrative injustice, maladministration, abuse of office, delay, or unfair treatment by public officials and state agencies cheaply and accessibly without expensive litigation',
        'Printing national currency notes',
        'Conducting national parliamentary elections'
      ],
      correctIndex: 1,
      explanation: 'Originating in Sweden (1809), the Ombudsman provides ordinary citizens with an independent, low-cost watchdog against bureaucratic abuse, corruption, and human-rights violations where court lawsuits would be slow or unaffordable.',
      concept: 'Ombudsman (CHRAJ in Ghana / Public Complaints Commission in Nigeria): independent administrative watchdog redressing maladministration and protecting citizens\' rights.'
    },
    {
      id: 'was_gov_d10',
      subject: 'government',
      topicId: 'gov_org',
      difficulty: 'difficult',
      question: 'Why does Ghana\'s 1992 Fourth Republican Constitution describe its executive-legislative design as a "Hybrid" (semi-presidential / modified presidential) model compared with Nigeria\'s 1999 strict Presidential model?',
      options: [
        'Because Ghana has a hereditary monarch alongside a Prime Minister',
        'Because Ghana has an executive President elected directly for a 4-year term, YET Article 78(1) mandates that the majority of Cabinet Ministers MUST be appointed by the President from among elected Members of Parliament — blending presidential leadership with parliamentary linkage, whereas in Nigeria a legislator appointed Minister must resign their parliamentary seat',
        'Because Ghana has two Senates',
        'Because Nigeria\'s President is chosen by the House of Representatives'
      ],
      correctIndex: 1,
      explanation: 'Under Nigeria\'s 1999 Constitution (like the US), strict separation of personnel forbids a Minister from sitting simultaneously in the National Assembly; Ghana\'s 1992 Constitution deliberately requires >50% of Ministers to come from Parliament to bridge executive-legislative deadlock.',
      concept: 'Comparative West African Constitutions: Nigeria 1999 = federal + bicameral + strict separation of personnel; Ghana 1992 = unitary + unicameral + hybrid majority-MP ministerial rule.'
    },

    // =========================================================================
    // 12. LITERATURE-IN-ENGLISH (30 Questions: 10 Easy, 10 Medium, 10 Difficult)
    // =========================================================================
    {
      id: 'was_lit_e1',
      subject: 'literature',
      topicId: 'lit_fig',
      difficulty: 'easy',
      question: 'Identify the dominant figure of speech in the line: "The restless Harmattan wind whispered secrets through the dry baobab leaves."',
      options: [
        'Simile',
        'Personification',
        'Metonymy',
        'Litotes'
      ],
      correctIndex: 1,
      explanation: 'Attributing human actions ("whispered secrets") and human feelings ("restless") to an inanimate natural force (the Harmattan wind) is Personification.',
      concept: 'Personification endows inanimate objects, natural forces, or abstract ideas with human qualities or actions.'
    },
    {
      id: 'was_lit_e2',
      subject: 'literature',
      topicId: 'lit_fig',
      difficulty: 'easy',
      question: 'Which figure of speech places two contradictory words directly side by side in a compressed phrase, such as "bitter-sweet memories" or "open secret"?',
      options: [
        'Oxymoron',
        'Euphemism',
        'Hyperbole',
        'Pun'
      ],
      correctIndex: 0,
      explanation: 'An oxymoron juxtaposes two opposite or contradictory terms immediately next to each other ("bitter-sweet", "deafening silence", "open secret") for compressed dramatic sharpness.',
      concept: 'Oxymoron = two adjacent contradictory words in a phrase; Paradox = a full self-contradictory statement revealing a deeper truth ("The child is father of the man").'
    },
    {
      id: 'was_lit_e3',
      subject: 'literature',
      topicId: 'lit_poet',
      difficulty: 'easy',
      question: 'How many lines does a traditional SONNET always contain?',
      options: [
        '10 lines',
        '12 lines',
        '14 lines',
        '16 lines'
      ],
      correctIndex: 2,
      explanation: 'Every classical sonnet (Petrarchan, Shakespearean, or Spenserian) is a lyric poem of exactly 14 lines, traditionally written in iambic pentameter.',
      concept: 'Stanza & poem lengths: Couplet (2), Tercet (3), Quatrain (4), Quintet (5), Sestet (6), Septet (7), Octave (8), Sonnet (14).'
    },
    {
      id: 'was_lit_e4',
      subject: 'literature',
      topicId: 'lit_poet',
      difficulty: 'easy',
      question: 'What is a "dirge" in African and English poetry?',
      options: [
        'A humorous four-line epigram',
        'A mournful funeral song or lament performed to express grief for the dead',
        'A joyful wedding praise song',
        'A shepherds\' love song set in green pastures'
      ],
      correctIndex: 1,
      explanation: 'While an elegy is a reflective poem meditating on death or loss, a dirge is specifically a brief, lyrical funeral song or chant performed at a burial or wake.',
      concept: 'Dirge = sung/chanted funeral lament; Elegy = formal meditative poem mourning the dead; Panegyric/Ode = poem of praise or elevated address.'
    },
    {
      id: 'was_lit_e5',
      subject: 'literature',
      topicId: 'lit_dram',
      difficulty: 'easy',
      question: 'In drama, what is a "soliloquy"?',
      options: [
        'A conversation among three characters on stage',
        'A speech delivered by a character who is ALONE on stage (or believes themselves alone), revealing their innermost thoughts and motives to the audience',
        'A list of actors printed at the beginning of a play',
        'The final curtain call after the play ends'
      ],
      correctIndex: 1,
      explanation: 'From Latin "solus" (alone) + "loqui" (to speak), a soliloquy lets the audience hear a character\'s private conscience directly when no other characters are listening.',
      concept: 'Soliloquy = character speaks inner thoughts ALONE on stage; Aside = brief remark to audience/one character that others on stage by convention do not hear; Dramatic Monologue = speech addressed to a silent listener.'
    },
    {
      id: 'was_lit_e6',
      subject: 'literature',
      topicId: 'lit_dram',
      difficulty: 'easy',
      question: 'What do we call the italicised instructions in a play script that guide actors\' movements, gestures, lighting, sound effects, and entrances/exits?',
      options: [
        'Prologue',
        'Stage Directions',
        'Epilogue',
        'Chorus'
      ],
      correctIndex: 1,
      explanation: 'Stage directions are playwright\'s non-spoken performance notes telling the director, actors, and crew how scenes look, sound, and move.',
      concept: 'Play-text mechanics: Cast List (Dramatis Personae), Dialogue, Stage Directions, Acts & Scenes, Prologue (opening), Epilogue (closing).'
    },
    {
      id: 'was_lit_e7',
      subject: 'literature',
      topicId: 'lit_pros',
      difficulty: 'easy',
      question: 'When a novel is narrated throughout by one of the characters inside the story using pronouns such as "I", "me", "my", and "we", what narrative point of view is employed?',
      options: [
        'Third-person omniscient point of view',
        'First-person narrative point of view',
        'Second-person instructional point of view',
        'Dramatic objective point of view'
      ],
      correctIndex: 1,
      explanation: 'First-person narration gives immediacy and intimacy through a participant-narrator ("I"), though the reader\'s knowledge is restricted to what that narrator witnesses or chooses to tell.',
      concept: 'First-person ("I" — intimate but potentially limited/unreliable) vs Third-person Omniscient ("he/she/they" — all-knowing access to multiple minds).'
    },
    {
      id: 'was_lit_e8',
      subject: 'literature',
      topicId: 'lit_pros',
      difficulty: 'easy',
      question: 'In prose fiction, what does "setting" encompass?',
      options: [
        'Only the main character\'s physical height',
        'Both the physical/geographical location AND the historical/social time period and cultural atmosphere in which the events occur',
        'The rhyme scheme of chapters',
        'The publisher\'s copyright page'
      ],
      correctIndex: 1,
      explanation: 'Literary setting combines spatial place (e.g., an urban Lagos compound or rural Northern Ghanaian village), temporal period (colonial 1940s vs contemporary), and social milieu.',
      concept: 'Setting = Spatial Location + Temporal Period + Socio-cultural Environment.'
    },
    {
      id: 'was_lit_e9',
      subject: 'literature',
      topicId: 'lit_fig',
      difficulty: 'easy',
      question: 'Saying "The elder has joined his ancestors" or "He passed away peacefully" instead of "He died" is an example of:',
      options: [
        'Hyperbole',
        'Euphemism',
        'Sarcasm',
        'Onomatopoeia'
      ],
      correctIndex: 1,
      explanation: 'Euphemism substitutes a mild, respectful, or indirect expression for one considered harsh, blunt, or taboo.',
      concept: 'Euphemism softens harsh realities; Dysphemism makes an expression deliberately harsher or more offensive.'
    },
    {
      id: 'was_lit_e10',
      subject: 'literature',
      topicId: 'lit_app',
      difficulty: 'easy',
      question: 'In unseen literary appreciation, what is the "theme" of a poem, play, or novel?',
      options: [
        'The chronological summary of events from chapter one to the end',
        'The central underlying idea, insight into human life, or controlling message explored through the work',
        'The number of syllables per line',
        'The author\'s biography'
      ],
      correctIndex: 1,
      explanation: 'Plot is WHAT happens in the story; Theme is the deeper universal meaning or central concern (such as the corrupting nature of unchecked ambition or the clash between tradition and modernity).',
      concept: 'Subject Matter = the surface topic; Plot = causal sequence of events; Theme = the central universal insight or controlling idea.'
    },
    {
      id: 'was_lit_m1',
      subject: 'literature',
      topicId: 'lit_fig',
      difficulty: 'medium',
      question: 'Carefully distinguish SYNECDOCHE from METONYMY in these two sentences: (1) "All hands must be on deck to harvest the cocoa." (2) "The Crown has pardoned the prisoners, and the Press reported it."',
      options: [
        '(1) is Metonymy and (2) is Synecdoche',
        '(1) is Synecdoche (using a physical PART, "hands", to represent the WHOLE workers), whereas (2) is Metonymy (substituting closely ASSOCIATED symbols, "The Crown" for the monarchy and "the Press" for journalists)',
        'Both are Similes',
        'Both are Litotes'
      ],
      correctIndex: 1,
      explanation: 'Synecdoche relies on a physical PART-FOR-WHOLE (or whole-for-part) relationship ("hands" are physically part of the workers; "roof" is part of a house). Metonymy relies on close ASSOCIATION rather than physical part ("Crown" for King, "Pen/Sword" for writing/military force, "Aso Rock / Jubilee House" for the presidency).',
      concept: 'WAEC Paper 1 favourite: Synecdoche = Part <-> Whole; Metonymy = Closely Associated Attribute/Symbol.'
    },
    {
      id: 'was_lit_m2',
      subject: 'literature',
      topicId: 'lit_fig',
      difficulty: 'medium',
      question: 'Identify the figure of speech in: "O Death, where is thy sting? Roll on, thou deep and dark blue Ocean, roll!"',
      options: [
        'Apostrophe',
        'Epigram',
        'Pun (Paronomasia)',
        'Anticlimax (Bathos)'
      ],
      correctIndex: 0,
      explanation: 'Directly addressing an absent person, dead individual, abstract idea ("O Death"), or inanimate entity ("thou Ocean") in the second person as though capable of hearing and replying is Apostrophe.',
      concept: 'Apostrophe = direct address to an absent, dead, abstract, or inanimate entity (often signalled by "O..." or vocative "thou/you").'
    },
    {
      id: 'was_lit_m3',
      subject: 'literature',
      topicId: 'lit_poet',
      difficulty: 'medium',
      question: 'How does the structure and rhyme scheme of an Italian (Petrarchan) sonnet differ from an English (Shakespearean) sonnet?',
      options: [
        'A Petrarchan sonnet has 12 lines while a Shakespearean sonnet has 14 lines',
        'A Petrarchan sonnet divides into an 8-line Octave (abbaabba) + 6-line Sestet (cdecde / cdcdcd) with the "volta" (turn) at line 9, whereas a Shakespearean sonnet comprises three Quatrains + a concluding Rhyming Couplet (abab cdcd efef gg)',
        'A Petrarchan sonnet never rhymes',
        'A Shakespearean sonnet ends with an 8-line octave'
      ],
      correctIndex: 1,
      explanation: 'Petrarchan sonnets present a problem/question in the Octave (lines 1–8) and resolve/counter it after the volta in the Sestet (lines 9–14); Shakespearean sonnets develop three 4-line stages and deliver an epigrammatic twist or resolution in the final gg couplet (lines 13–14).',
      concept: 'Petrarchan = Octave (8) + Sestet (6); Shakespearean = 3 Quatrains (12) + Final Couplet (2).'
    },
    {
      id: 'was_lit_m4',
      subject: 'literature',
      topicId: 'lit_dram',
      difficulty: 'medium',
      question: 'When the audience in a theatre knows a crucial truth that the character speaking on stage does NOT know (for example, Oedipus swearing to punish King Laius\'s killer without knowing he himself killed Laius, or Duncan praising Macbeth\'s castle as pleasant), what device is operating?',
      options: [
        'Verbal Irony',
        'Dramatic Irony',
        'Comic Relief',
        'Slapstick Farce'
      ],
      correctIndex: 1,
      explanation: 'Dramatic Irony arises when there is a sharp gap between a character\'s limited ignorance and the audience\'s superior knowledge of the true situation, charging the character\'s words with poignant double meaning.',
      concept: 'Three forms of Irony: Verbal (saying opposite of meaning), Situational (outcome contradicts expectation), Dramatic (audience knows crucial truth hidden from character).'
    },
    {
      id: 'was_lit_m5',
      subject: 'literature',
      topicId: 'lit_dram',
      difficulty: 'medium',
      question: 'In classical tragedy, what is "Comic Relief" (such as the drunken Porter scene immediately after King Duncan\'s murder in Macbeth)?',
      options: [
        'Turning the entire tragedy into a happy wedding ending',
        'A brief humorous scene or witty interlude inserted after an intensely tragic episode to ease audience emotional tension momentarily AND heighten the surrounding horror by contrast',
        'Deleting the tragic hero from Act III',
        'An epilogue read by the director'
      ],
      correctIndex: 1,
      explanation: 'Comic relief provides psychological breathing space for spectators while simultaneously sharpening tragic contrast rather than undermining the tragedy.',
      concept: 'Comic Relief both relaxes unbearable tension temporarily and intensifies tragic atmosphere through contrast.'
    },
    {
      id: 'was_lit_m6',
      subject: 'literature',
      topicId: 'lit_pros',
      difficulty: 'medium',
      question: 'What is an "epistolary novel" (such as Mariama Ba\'s "So Long a Letter")?',
      options: [
        'A novel written entirely in rhyming couplets',
        'A prose narrative told wholly or primarily through letters (or diary entries and documents) exchanged between characters',
        'A novel without human characters',
        'A biography of an apostle'
      ],
      correctIndex: 1,
      explanation: 'From Latin "epistola" (letter), an epistolary novel unfolds its plot and psychological intimacy through correspondence — famously exemplified in West African literature by Mariama Ba\'s "So Long a Letter" (Ramatoulaye\'s long letter to Aissatou).',
      concept: 'Epistolary Novel = narrative structured through letters/correspondence; Picaresque Novel = episodic adventures of a roguish hero; Bildungsroman = novel of youth-to-maturity growth.'
    },
    {
      id: 'was_lit_m7',
      subject: 'literature',
      topicId: 'lit_pros',
      difficulty: 'medium',
      question: 'In characterisation, what role does a "foil" character serve?',
      options: [
        'A minor character whose contrasting traits highlight and throw into sharper relief the distinctive qualities of another character (usually the protagonist)',
        'The narrator\'s publisher',
        'Any character who dies in Chapter 1',
        'A character who never speaks'
      ],
      correctIndex: 0,
      explanation: 'Just as bright metal foil behind a gem makes it shine more clearly, a literary foil contrasts with the protagonist (e.g., Unoka or Obierika contrasting with Okonkwo\'s rigid hyper-masculinity in "Things Fall Apart", or Banquo contrasting with Macbeth).',
      concept: 'Character types: Protagonist (central figure), Antagonist (chief adversary), Foil (contrasting illuminator), Dynamic/Round (evolves/complex), Static/Flat (unchanging/one-dimensional).'
    },
    {
      id: 'was_lit_m8',
      subject: 'literature',
      topicId: 'lit_app',
      difficulty: 'medium',
      question: 'In WAEC Unseen Poetry & Prose Appreciation, what is the precise distinction between TONE and MOOD (Atmosphere)?',
      options: [
        'Tone and Mood mean the exact same thing',
        'TONE is the persona\'s or writer\'s attitude toward the subject/listener (e.g., ironic, indignant, reverent, mocking), whereas MOOD is the prevailing emotional feeling or atmosphere evoked IN THE READER (e.g., eerie, melancholic, jubilant, tense)',
        'Tone applies only to prose while Mood applies only to drama',
        'Mood is the rhyme scheme of a stanza'
      ],
      correctIndex: 1,
      explanation: 'A satirical poet may write in a biting, sardonic TONE while creating a grim or uneasy MOOD in the reader; distinguishing speaker\'s attitude (Tone) from reader\'s felt atmosphere (Mood) earns full Paper 1 appreciation marks.',
      concept: 'Tone = Speaker/Author\'s attitude toward subject; Mood/Atmosphere = Emotional effect/feeling generated in the reader.'
    },
    {
      id: 'was_lit_m9',
      subject: 'literature',
      topicId: 'lit_poet',
      difficulty: 'medium',
      question: 'When the sense and grammatical structure of one line of poetry flows directly into the next line WITHOUT a punctuation pause at the end of the line, what prosodic technique is used?',
      options: [
        'Caesura',
        'Enjambment (Run-on line)',
        'End-stopped line',
        'Internal rhyme'
      ],
      correctIndex: 1,
      explanation: 'Enjambment (run-on line) propels rhythm forward smoothly or urgently across line breaks, whereas an end-stopped line pauses with punctuation at the end, and a caesura is a strong pause INSIDE the middle of a line.',
      concept: 'Prosody pauses: End-stopped line (pause at line end), Enjambment / Run-on line (flows across line break), Caesura (pause mid-line).'
    },
    {
      id: 'was_lit_m10',
      subject: 'literature',
      topicId: 'lit_fig',
      difficulty: 'medium',
      question: 'Identify the figure of speech in: "The candidate obtained no small praise for scoring eight A1s" (meaning she earned VERY GREAT praise):',
      options: [
        'Litotes',
        'Hyperbole',
        'Climax',
        'Malapropism'
      ],
      correctIndex: 0,
      explanation: 'Litotes is a deliberate ironic understatement that affirms a strong positive by negating its opposite ("not bad", "no mean achievement", "no small praise", "a citizen of no mean city").',
      concept: 'Litotes = understatement expressing an affirmative by negating its contrary ("no small..." / "not unfamiliar...").'
    },
    {
      id: 'was_lit_d1',
      subject: 'literature',
      topicId: 'lit_dram',
      difficulty: 'difficult',
      question: 'Match the Aristotelian tragic concepts HAMARTIA, PERIPETEIA, ANAGNORISIS, and CATHARSIS to their exact dramatic meanings:',
      options: [
        'Hamartia = stage props; Peripeteia = prologue; Anagnorisis = costume; Catharsis = applause',
        'Hamartia = tragic flaw or fatal error of judgement; Peripeteia = sudden reversal of fortune from prosperity to ruin; Anagnorisis = critical moment of discovery/self-recognition from ignorance to truth; Catharsis = emotional purgation of pity and fear in the audience',
        'Hamartia = comic relief; Peripeteia = happy ending; Anagnorisis = aside; Catharsis = curtain call',
        'All four refer exclusively to slapstick farce'
      ],
      correctIndex: 1,
      explanation: 'In Aristotle\'s "Poetics", a noble protagonist\'s hamartia (often fuelled by hubris/excessive pride) precipitates peripeteia (reversal of intention/fortune) and anagnorisis (tragic recognition), arousing and purging pity and fear (catharsis) in spectators.',
      concept: 'Aristotelian Tragedy chain: Hubris / Hamartia -> Peripeteia + Anagnorisis -> Catastrophe -> Catharsis of pity and fear.'
    },
    {
      id: 'was_lit_d2',
      subject: 'literature',
      topicId: 'lit_poet',
      difficulty: 'difficult',
      question: 'Scan the metrical pattern of the classic line "Shall I compare thee to a summer\'s day?" (da-DUM da-DUM da-DUM da-DUM da-DUM):',
      options: [
        'Trochaic tetrameter (four stressed-unstressed feet)',
        'Iambic pentameter (five iambic feet, each consisting of an unstressed syllable followed by a stressed syllable = 10 syllables)',
        'Dactylic hexameter (six three-syllable feet)',
        'Free verse (vers libre) with no regular metre'
      ],
      correctIndex: 1,
      explanation: 'Shall I | com-PARE | thee TO | a SUM- | mer\'s DAY? contains 5 feet ("pentameter"), each foot rising from unstressed to stressed ("iamb": u /). Note: unrhymed iambic pentameter (used in Shakespearean drama and Milton) is called Blank Verse.',
      concept: 'Metrical feet: Iamb (u /), Trochee (/ u), Anapaest (u u /), Dactyl (/ u u); Blank Verse = unrhymed iambic pentameter; Free Verse = no regular metre or rhyme.'
    },
    {
      id: 'was_lit_d3',
      subject: 'literature',
      topicId: 'lit_fig',
      difficulty: 'difficult',
      question: 'In the line "The weary ploughman plods his lonely way along the sleepless hospital corridor", calling the way "lonely" and the corridor "sleepless" (when in truth it is the ploughman who feels lonely and the patients who cannot sleep) illustrates which literary device?',
      options: [
        'Transferred Epithet (Hypallage)',
        'Chiasmus',
        'Zeugma (Syllepsis)',
        'Onomatopoeia'
      ],
      correctIndex: 0,
      explanation: 'A Transferred Epithet shifts an adjective (epithet) grammatically from the person experiencing the state onto an associated inanimate noun nearby ("sleepless pillow", "condemned cell", "lonely road", "angry pen").',
      concept: 'Transferred Epithet = shifting a descriptive adjective from its logical human subject to a nearby associated object.'
    },
    {
      id: 'was_lit_d4',
      subject: 'literature',
      topicId: 'lit_fig',
      difficulty: 'difficult',
      question: 'Distinguish CHIASMUS from ZEUGMA in these two sentences: (1) "Fair is foul, and foul is fair" / "Ask not what your country can do for you — ask what you can do for your country." (2) "She broke his car windscreen and his heart in the same afternoon."',
      options: [
        '(1) is Zeugma and (2) is Chiasmus',
        '(1) is Chiasmus (a mirror-image A-B-B-A syntactic inversion), whereas (2) is Zeugma/Syllepsis (one verb, "broke", yoking together a literal concrete noun, "windscreen", and a figurative abstract noun, "heart")',
        'Both are Malapropisms',
        'Both are Allegories'
      ],
      correctIndex: 1,
      explanation: 'Chiasmus reverses grammatical or lexical order in symmetrical A-B / B-A cross-patterning, while Zeugma ("yoking") makes a single governing verb govern two objects in starkly different senses (literal + metaphorical) for witty effect.',
      concept: 'Chiasmus = A-B / B-A inverted parallel structure; Zeugma = one verb governing both a literal object and a figurative object.'
    },
    {
      id: 'was_lit_d5',
      subject: 'literature',
      topicId: 'lit_pros',
      difficulty: 'difficult',
      question: 'When an epic or novel opens right in the heat of a critical crisis ("in medias res") and later reconstructs earlier background causes through characters\' memories or embedded episodes, how is the plot structured?',
      options: [
        'Strictly linear ab ovo chronology without interruption',
        'Non-linear plot combining "in medias res" opening with Analepsis (Flashback) to create immediate dramatic hook while gradually unveiling past motivation',
        'Deus ex machina resolution',
        'Didactic fable without conflict'
      ],
      correctIndex: 1,
      explanation: 'Opening "in medias res" ("into the middle of things") grips the reader immediately inside heightened conflict, using flashback (analepsis) for exposition and foreshadowing (prolepsis) to build suspense toward the climax.',
      concept: 'Narrative time techniques: In medias res (opening mid-crisis), Analepsis / Flashback (returning to earlier events), Prolepsis / Foreshadowing (hinting at future outcomes).'
    },
    {
      id: 'was_lit_d6',
      subject: 'literature',
      topicId: 'lit_dram',
      difficulty: 'difficult',
      question: 'In dramatic criticism, what is meant by a "Deus ex machina" ending, and why is it often criticised when overused in realistic drama?',
      options: [
        'A tragedy where the hero dies through logical cause-and-effect choices',
        'An improbable, contrived, external intervention introduced suddenly at the last moment (originally a god lowered onto the Greek stage by crane) to untangle an insoluble plot conflict rather than resolving it organically from character and action',
        'A play performed without stage lighting',
        'A chorus singing between acts'
      ],
      correctIndex: 1,
      explanation: '"Deus ex machina" ("god from the machine") refers to any artificial last-minute rescue — an unexpected inheritance from a forgotten uncle, a sudden lightning strike killing the villain — that bypasses plausible cause-and-effect plot resolution.',
      concept: 'Deus ex machina = contrived external plot rescue vs Organic denouement emerging logically from characters\' choices.'
    },
    {
      id: 'was_lit_d7',
      subject: 'literature',
      topicId: 'lit_pros',
      difficulty: 'difficult',
      question: 'How do SATIRE and ALLEGORY work together in socio-political works such as George Orwell\'s "Animal Farm" or Wole Soyinka\'s / Ayi Kwei Armah\'s political critiques?',
      options: [
        'Satire praises corrupt leaders uncritically while Allegory bans symbolism',
        'Allegory constructs a sustained dual-level narrative where surface characters/events systematically represent real political figures/ideologies, while Satire deploys irony, ridicule, exaggeration, and wit to expose societal or political vices with the aim of moral/social reform',
        'Allegory applies only to 14-line sonnets',
        'Satire forbids any humour or irony'
      ],
      correctIndex: 1,
      explanation: 'Allegory operates on two continuous parallel planes of meaning (literal surface story + deeper moral/political signification), and when coupled with Satire it holds hypocrisy, corruption, and tyranny up to critical ridicule.',
      concept: 'Allegory = extended two-tier symbolic narrative; Satire = use of irony, ridicule, and exaggeration to expose human folly or political corruption.'
    },
    {
      id: 'was_lit_d8',
      subject: 'literature',
      topicId: 'lit_app',
      difficulty: 'difficult',
      question: 'Read the unseen stanza carefully:\n"Beneath the gilded dome the Senators dine,\nTheir silver goblets brimming red like wine;\nOutside the rusted gate the weaver\'s child\nLicks dry dust from a cracked bowl in the wild."\nWhich critical observation best captures how poetic technique reinforces meaning here?',
      options: [
        'Pastoral celebration of nature using blank verse',
        'Sharp visual/gustatory JUXTAPOSITION (antithesis) between opulent elite luxury ("gilded dome", "silver goblets brimming") and destitute hunger ("rusted gate", "licks dry dust", "cracked bowl") inside heroic aabb rhyming couplets to indict social inequality',
        'Joyful panegyric praising generous senators',
        'Use of non-rhyming free verse to depict harmony'
      ],
      correctIndex: 1,
      explanation: 'Every sensory detail pairs an indoor image of gilded excess (lines 1–2) against an outdoor image of deprivation (lines 3–4), while the tight aabb couplets ("dine/wine", "child/wild") sharpen the moral indictment.',
      concept: 'Unseen poetry analysis always links TECHNIQUE (imagery, juxtaposition, diction, rhyme) directly to EFFECT and THEME.'
    },
    {
      id: 'was_lit_d9',
      subject: 'literature',
      topicId: 'lit_fig',
      difficulty: 'difficult',
      question: 'Examine the sound patterns in the line: "Full fathom five thy father lies; / Of his bones are coral made" and "The silken sad uncertain rustling of each purple curtain." Which pair of sound devices dominates the SECOND quotation?',
      options: [
        'Pun and Climax',
        'Sibilance (alliteration/consonance of "s" sounds in "silken sad uncertain rustling") + Internal Rhyme ("uncertain / curtain") + Onomatopoeic texture ("rustling")',
        'End-rhyme only with zero consonance',
        'Oxymoron and Apostrophe'
      ],
      correctIndex: 1,
      explanation: 'Repeating soft /s/ fricatives ("silken sad uncertain rustling") is sibilance, "uncertain" echoes "curtain" via internal rhyme, and "rustling" phonetically imitates the sound of moving drapery (onomatopoeia), creating an eerie auditory atmosphere.',
      concept: 'Sound devices: Alliteration (initial consonants), Sibilance (/s/ or /sh/ hiss), Assonance (internal vowel echo), Consonance (non-initial consonant echo), Onomatopoeia (word imitates sound).'
    },
    {
      id: 'was_lit_d10',
      subject: 'literature',
      topicId: 'lit_pros',
      difficulty: 'difficult',
      question: 'What defines an "Unreliable Narrator" in prose fiction, and how does the attentive reader detect narrative unreliability?',
      options: [
        'Any third-person omniscient narrator who uses chapters',
        'A first-person narrator whose account is skewed by self-deception, prejudice, naivety, or hidden guilt — detected through subtle contradictions between the narrator\'s self-justifying commentary and the objective actions/reactions of other characters in the text',
        'A printer\'s typographical error on the cover page',
        'A narrator who uses dialogue quotation marks'
      ],
      correctIndex: 1,
      explanation: 'With an unreliable narrator, the author creates structural irony behind the narrator\'s back: the reader reads between the lines, noticing rationalisations, omissions, or bias that expose truths the narrator refuses to admit.',
      concept: 'Unreliable Narration relies on ironic distance between what the first-person narrator claims and what the implied author enables the reader to infer.'
    }
  ];

  // ===========================================================================
  // 2. SESSION STATE, HELPERS & LOCAL STORAGE PROGRESS / VARIETY ENGINE
  // ===========================================================================

  var currentSession = {
    countryId: 'ghana',
    programmeId: 'custom',
    selectedSubjects: ['core_maths'],
    userCustomizedSubject: false,
    difficulty: 'medium',
    mode: 'daily_quiz',
    targetWeakKeys: [],
    questions: [],
    currentIndex: 0,
    userAnswers: {}
  };

  var sessionCounter = 0;
  var clearConfirmArmed = false;

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getCountryLabel(countryId) {
    var c = WASSCE_COUNTRIES[countryId];
    return c ? c.shortLabel : 'Ghana';
  }

  function getSubjectDisplayName(subjId, countryId) {
    var s = SUBJECTS[subjId];
    if (!s) return subjId;
    if (s.countryNames && s.countryNames[countryId]) {
      return s.countryNames[countryId];
    }
    return s.name;
  }

  function getTodaySeed() {
    var now = new Date();
    return (
      now.getFullYear() +
      '-' +
      String(now.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(now.getDate()).padStart(2, '0')
    );
  }

  function seededRandomGenerator(seedStr) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < seedStr.length; i++) {
      h ^= seedStr.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return function () {
      h += 0x6d2b79f5;
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

  function getQuizHistory() {
    try {
      var raw = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveQuizAttempt(record) {
    try {
      var history = getQuizHistory();
      history.unshift(record);
      if (history.length > 25) history.length = 25;
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      // Ignore storage quota errors
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
      var raw = localStorage.getItem(STORAGE_SEEN_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
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
        if (!Array.isArray(map[q.subject])) {
          map[q.subject] = [];
        }
        var existingIdx = map[q.subject].indexOf(q.id);
        if (existingIdx !== -1) {
          map[q.subject].splice(existingIdx, 1);
        }
        map[q.subject].push(q.id);
        // Each subject has 30 questions (10 per difficulty); keep last 24 so unseen items rotate cleanly
        if (map[q.subject].length > 24) {
          map[q.subject] = map[q.subject].slice(map[q.subject].length - 24);
        }
      });
      localStorage.setItem(STORAGE_SEEN_KEY, JSON.stringify(map));
    } catch (e) {}
  }

  // ===========================================================================
  // 3. CALCULATOR CONTEXT SYNC (READ-ONLY — NEVER OVERWRITES CALCULATOR LOGIC)
  // ===========================================================================

  function detectCalculatorContext() {
    var gradePoints = { A1: 1, B2: 2, B3: 3, C4: 4, C5: 5, C6: 6, D7: 7, E8: 8, F9: 9 };
    var corePairs = [
      { id: 'coreEnglish', subj: 'english' },
      { id: 'coreMaths', subj: 'core_maths' },
      { id: 'integratedScience', subj: 'integrated_science' },
      { id: 'socialStudies', subj: 'social_civic' }
    ];

    var weakestCore = null;
    var enteredCount = 0;

    corePairs.forEach(function (pair) {
      var el = document.getElementById(pair.id);
      var val = el ? String(el.value || '').trim() : '';
      if (val && gradePoints[val]) {
        enteredCount += 1;
        var pts = gradePoints[val];
        if (!weakestCore || pts > weakestCore.pts) {
          weakestCore = {
            subj: pair.subj,
            grade: val,
            pts: pts,
            name: getSubjectDisplayName(pair.subj, currentSession.countryId)
          };
        }
      }
    });

    var resultsBox = document.getElementById('results');
    var aggEl = document.getElementById('aggregateValue');
    var aggText = aggEl ? String(aggEl.textContent || '').trim() : '';
    var hasCalculatedAggregate = Boolean(
      resultsBox && resultsBox.classList.contains('visible') && /^\d+$/.test(aggText)
    );

    if (enteredCount === 0 && !hasCalculatedAggregate) {
      return {
        hasGrades: false,
        recommendedSubject: null,
        recommendedDifficulty: null,
        message: 'Choose a WASSCE subject below to start a 10-question practice quiz.'
      };
    }

    var recSubj = weakestCore ? weakestCore.subj : 'core_maths';
    var recName = getSubjectDisplayName(recSubj, currentSession.countryId);
    var recDiff = weakestCore
      ? (weakestCore.pts >= 6 ? 'easy' : (weakestCore.pts >= 3 ? 'medium' : 'difficult'))
      : 'medium';

    var msg = '';
    if (hasCalculatedAggregate && weakestCore) {
      msg =
        'Your WASSCE aggregate is ' +
        aggText +
        ', with ' +
        weakestCore.name +
        ' (' +
        weakestCore.grade +
        ') as your weakest core grade. We recommend practising ' +
        recName +
        ', or choose another subject below.';
    } else if (hasCalculatedAggregate) {
      msg =
        'Your WASSCE aggregate is ' +
        aggText +
        '. Practise ' +
        recName +
        ' or choose another subject below.';
    } else if (weakestCore) {
      msg =
        weakestCore.name +
        ' (' +
        weakestCore.grade +
        ') is currently your weakest entered grade. We recommend practising ' +
        recName +
        ', or choose another subject below.';
    }

    return {
      hasGrades: true,
      recommendedSubject: recSubj,
      recommendedDifficulty: recDiff,
      message: msg
    };
  }

  // ===========================================================================
  // 4. 10-QUESTION DAILY QUIZ GENERATOR (UNSEEN PRIORITY & TOPIC DIVERSITY)
  // ===========================================================================

  function generateSessionQuestions(subjectIds, difficulty, mode, targetWeakKeys) {
    var validSubjects = (subjectIds || []).filter(function (s) {
      return !!SUBJECTS[s];
    });
    var activeSubjects =
      validSubjects.length > 0 ? validSubjects : ['english', 'core_maths'];

    sessionCounter += 1;
    var historyCount = getQuizHistory().length;
    var seedStr =
      getTodaySeed() +
      '-wassce-' +
      activeSubjects.slice().sort().join(',') +
      '-' +
      difficulty +
      '-' +
      mode +
      '-' +
      historyCount +
      '-' +
      sessionCounter;
    var rng = seededRandomGenerator(seedStr);

    var picked = [];
    var pickedIds = new Set();

    function pickCandidate(pool, seenSet, allowSeen) {
      var unseen = pool.filter(function (q) {
        return !pickedIds.has(q.id) && !seenSet.has(q.id);
      });
      if (unseen.length > 0) {
        var shuffledUnseen = shuffleArray(unseen, rng);
        return shuffledUnseen[0];
      }
      if (allowSeen !== false) {
        var unpicked = pool.filter(function (q) {
          return !pickedIds.has(q.id);
        });
        if (unpicked.length > 0) {
          var shuffledAny = shuffleArray(unpicked, rng);
          return shuffledAny[0];
        }
      }
      return null;
    }

    // 1. In weakness_drill mode, prioritize unseen items from weak subject::topic pairs first
    if (
      mode === 'weakness_drill' &&
      Array.isArray(targetWeakKeys) &&
      targetWeakKeys.length > 0
    ) {
      var shuffledWeakKeys = shuffleArray(targetWeakKeys, rng);
      for (
        var allowSeenPass = 0;
        allowSeenPass <= 1 && picked.length < QUESTIONS_PER_SESSION;
        allowSeenPass++
      ) {
        var allowSeen = allowSeenPass === 1;
        var pass = 0;
        while (picked.length < QUESTIONS_PER_SESSION && pass < 3) {
          for (
            var i = 0;
            i < shuffledWeakKeys.length && picked.length < QUESTIONS_PER_SESSION;
            i++
          ) {
            var parts = shuffledWeakKeys[i].split('::');
            var wSubj = parts[0];
            var wTop = parts[1];
            var wSeenSet = new Set(getSeenIdsForSubject(wSubj));
            var exactDiffPool = QUESTIONS.filter(function (q) {
              return (
                q.subject === wSubj &&
                q.topicId === wTop &&
                q.difficulty === difficulty
              );
            });
            var chosenWeak = pickCandidate(exactDiffPool, wSeenSet, allowSeen);
            if (!chosenWeak) {
              var anyDiffTopicPool = QUESTIONS.filter(function (q) {
                return q.subject === wSubj && q.topicId === wTop;
              });
              chosenWeak = pickCandidate(anyDiffTopicPool, wSeenSet, allowSeen);
            }
            if (chosenWeak) {
              picked.push(chosenWeak);
              pickedIds.add(chosenWeak.id);
            }
          }
          pass += 1;
        }
      }
    }

    // 2. Round-robin across selected WASSCE subjects and shuffled WAEC topics at chosen difficulty
    var subjectTopicQueues = {};
    activeSubjects.forEach(function (subjId) {
      var topicIds = Object.keys(SUBJECTS[subjId].topics);
      subjectTopicQueues[subjId] = shuffleArray(topicIds, rng);
    });

    var orderedSubjects = shuffleArray(activeSubjects, rng);
    var safety = 0;

    while (picked.length < QUESTIONS_PER_SESSION && safety < 50) {
      var addedInRound = false;
      for (
        var s = 0;
        s < orderedSubjects.length && picked.length < QUESTIONS_PER_SESSION;
        s++
      ) {
        var subjId = orderedSubjects[s];
        var seenSet = new Set(getSeenIdsForSubject(subjId));
        var topicQueue = subjectTopicQueues[subjId];

        var chosen = null;
        // Pass A: strictly unseen at chosen difficulty across topics
        for (var t = 0; t < topicQueue.length; t++) {
          var topId = topicQueue[t];
          var topicDiffPool = QUESTIONS.filter(function (q) {
            return (
              q.subject === subjId &&
              q.topicId === topId &&
              q.difficulty === difficulty
            );
          });
          var candidate = pickCandidate(topicDiffPool, seenSet, false);
          if (candidate) {
            chosen = candidate;
            topicQueue.splice(t, 1);
            topicQueue.push(topId);
            break;
          }
        }

        // Pass B: strictly unseen across any difficulty in this subject
        if (!chosen) {
          var subjAnyUnseenPool = QUESTIONS.filter(function (q) {
            return q.subject === subjId;
          });
          chosen = pickCandidate(subjAnyUnseenPool, seenSet, false);
        }

        // Pass C: allow previously seen items at chosen difficulty if unseen pool exhausted
        if (!chosen) {
          var subjDiffSeenPool = QUESTIONS.filter(function (q) {
            return q.subject === subjId && q.difficulty === difficulty;
          });
          chosen = pickCandidate(subjDiffSeenPool, seenSet, true);
        }

        if (!chosen) {
          var subjFallbackPool = QUESTIONS.filter(function (q) {
            return q.subject === subjId;
          });
          chosen = pickCandidate(subjFallbackPool, seenSet, true);
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

    // 3. Final fallback across entire WASSCE bank at chosen difficulty if < 10
    if (picked.length < QUESTIONS_PER_SESSION) {
      var remainingPool = shuffleArray(
        QUESTIONS.filter(function (q) {
          return q.difficulty === difficulty && !pickedIds.has(q.id);
        }),
        rng
      );
      for (
        var r = 0;
        r < remainingPool.length && picked.length < QUESTIONS_PER_SESSION;
        r++
      ) {
        picked.push(remainingPool[r]);
        pickedIds.add(remainingPool[r].id);
      }
    }

    return shuffleArray(picked, rng).slice(0, QUESTIONS_PER_SESSION);
  }

  // ===========================================================================
  // 5. SCOPED STYLESHEET INJECTION (AFRIWIDGET BLACK / GOLD / WHITE PALETTE)
  // ===========================================================================

  function injectQuizStyles() {
    if (document.getElementById('afriWassceQuizStyles')) return;
    var style = document.createElement('style');
    style.id = 'afriWassceQuizStyles';
    style.textContent =
      '#wIntroView .w-intro-top-bar{display:flex;align-items:center;justify-content:space-between;gap:0.75rem;margin-bottom:0.75rem}' +
      '#wIntroView .w-intro-heading{font-size:1.125rem;font-weight:800;color:#000000;margin:0;letter-spacing:-0.01em}' +
      '#wIntroView .w-intro-rec{font-size:0.9375rem;line-height:1.5;color:#171717;background:#fafafa;border:1px solid #e5e5e5;border-radius:0.5rem;padding:0.75rem 0.875rem;margin:0 0 1rem 0}' +
      '#wIntroView .w-intro-field{margin-bottom:0.875rem}' +
      '#wIntroView .w-intro-row-two{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.875rem}' +
      '@media (max-width:479px){#wIntroView .w-intro-row-two{grid-template-columns:1fr}}' +
      '#wIntroView .w-intro-label{display:block;font-size:0.8125rem;font-weight:700;color:#171717;margin-bottom:0.35rem}' +
      '#wIntroView .w-intro-diff-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem}' +
      '#wIntroView .w-intro-diff-btn{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:0.5rem 0.5rem;background:#ffffff;color:#171717;border:1.5px solid #d4d4d4;border-radius:0.5rem;font-size:0.875rem;font-weight:700;cursor:pointer;transition:border-color 0.15s ease,background 0.15s ease,color 0.15s ease}' +
      '#wIntroView .w-intro-diff-btn:hover{border-color:#000000}' +
      '#wIntroView .w-intro-diff-btn.selected{background:#000000;border-color:#000000;color:#facc15}' +
      '#wIntroView .w-intro-start-btn{width:100%;min-height:48px;margin-top:0.25rem;padding:0.75rem 1.25rem;background:#facc15;color:#000000;border:1.5px solid #facc15;border-radius:0.5rem;font-size:0.9375rem;font-weight:800;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:background 0.15s ease,border-color 0.15s ease}' +
      '#wIntroView .w-intro-start-btn:hover{background:#fde047;border-color:#fde047;color:#000000}' +
      '.weakness-banner-card{margin-top:1.5rem;padding:1.25rem 1.5rem;background:#ffffff;color:#111827;border-radius:0.875rem;border:1px solid #e5e7eb;display:flex;flex-direction:column;gap:1rem;box-shadow:0 1px 3px rgba(0,0,0,0.04)}' +
      '@media (min-width:640px){.weakness-banner-card{flex-direction:row;align-items:center;justify-content:space-between;padding:1.25rem 1.75rem;gap:1.5rem}}' +
      '.weakness-banner-card .w-banner-content{flex:1}' +
      '.weakness-banner-card .w-banner-badge,.weakness-banner-card .w-banner-kicker{display:none}' +
      '.weakness-banner-card .w-banner-title{font-size:1.0625rem;font-weight:700;color:#111827;margin:0 0 0.25rem 0;letter-spacing:-0.01em}' +
      '.weakness-banner-card .w-banner-desc{font-size:0.875rem;color:#4b5563;line-height:1.5;margin:0}' +
      '.weakness-banner-card .w-banner-btn{display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;background:#ffffff;color:#000000;border:1px solid #000000;font-weight:700;font-size:0.9375rem;border-radius:0.5rem;padding:0.875rem 1.5rem;min-height:50px;cursor:pointer;white-space:nowrap;transition:background 0.15s ease,transform 0.1s ease;flex-shrink:0}' +
      '.weakness-banner-card .w-banner-btn:hover{background:#f9fafb;border-color:#000000;color:#000000}' +
      '.weakness-banner-card .w-banner-btn:active{transform:scale(0.99)}' +
      '.weakness-banner-card .w-banner-btn svg{width:1.125rem;height:1.125rem;stroke:#f59e0b;color:#f59e0b;flex-shrink:0}' +
      '.weakness-banner-card .w-banner-btn:hover svg{stroke:#f59e0b;color:#f59e0b}' +
      '@media (max-width:639px){.weakness-banner-card .w-banner-btn{width:100%}}' +
      '.w-setup-grid-two{display:grid;grid-template-columns:1fr;gap:1rem;margin-bottom:1.5rem}' +
      '@media (min-width:640px){.w-setup-grid-two{grid-template-columns:1fr 1.6fr}}' +
      '.w-setup-section{margin-bottom:1.5rem}' +
      '.w-setup-label-row{display:flex;align-items:baseline;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.5rem}' +
      '.w-setup-label{font-size:0.875rem;font-weight:800;color:#000000}' +
      '.w-setup-meta{font-size:0.75rem;font-weight:600;color:#525252}' +
      '.w-prog-note{font-size:0.8125rem;color:#525252;line-height:1.55;margin:-0.75rem 0 1.25rem 0}' +
      '.w-preset-bar{display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.875rem}' +
      '.w-preset-btn{padding:0.5rem 0.875rem;min-height:44px;font-size:0.75rem;font-weight:700;color:#171717;background:#f5f5f5;border:1px solid #d4d4d4;border-radius:0.375rem;cursor:pointer;transition:background 0.15s ease,border-color 0.15s ease,color 0.15s ease}' +
      '.w-preset-btn:hover{border-color:#000000;background:#ffffff}' +
      '.w-preset-btn.active{background:#000000;color:#facc15;border-color:#000000}' +
      '.w-subjects-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:0.625rem}' +
      '@media (min-width:640px){.w-subjects-grid{grid-template-columns:repeat(3,1fr)}}' +
      '.w-subj-btn{display:flex;align-items:center;justify-content:space-between;gap:0.5rem;padding:0.75rem 0.875rem;min-height:48px;background:#ffffff;border:1.5px solid #d4d4d4;border-radius:0.5rem;text-align:left;cursor:pointer;transition:border-color 0.15s ease,background 0.15s ease}' +
      '.w-subj-btn:hover{border-color:#000000;background:#fafafa}' +
      '.w-subj-btn:focus-visible,.w-diff-btn:focus-visible,.w-preset-btn:focus-visible,.w-option-item:focus-visible,.w-form-select:focus-visible{outline:2px solid #000000;outline-offset:2px}' +
      '.w-subj-btn.selected{background:#fefce8;border-color:#000000}' +
      '.w-subj-name{font-size:0.8125rem;font-weight:700;color:#000000;line-height:1.25}' +
      '.w-subj-code{display:block;font-size:0.6875rem;font-weight:600;color:#737373;margin-top:0.125rem}' +
      '.w-subj-check{width:18px;height:18px;border-radius:0.25rem;border:1.5px solid #a3a3a3;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;background:#ffffff;color:transparent}' +
      '.w-subj-btn.selected .w-subj-check{background:#000000;border-color:#000000;color:#facc15}' +
      '.w-diff-grid{display:grid;grid-template-columns:1fr;gap:0.625rem}' +
      '@media (min-width:640px){.w-diff-grid{grid-template-columns:repeat(3,1fr)}}' +
      '.w-diff-btn{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding:0.875rem 1rem;min-height:56px;background:#ffffff;border:1.5px solid #d4d4d4;border-radius:0.5rem;text-align:left;cursor:pointer;transition:border-color 0.15s ease,background 0.15s ease}' +
      '.w-diff-btn:hover{border-color:#000000}' +
      '.w-diff-btn.selected{background:#000000;border-color:#000000;color:#ffffff}' +
      '.w-diff-title{font-size:0.875rem;font-weight:800;color:inherit;margin-bottom:0.15rem}' +
      '.w-diff-btn.selected .w-diff-title{color:#facc15}' +
      '.w-diff-sub{font-size:0.75rem;font-weight:500;color:#525252;line-height:1.35}' +
      '.w-diff-btn.selected .w-diff-sub{color:#d4d4d4}' +
      '.w-clean-meta-line{font-size:0.8125rem;color:#525252;line-height:1.6;margin:1rem 0 1.5rem 0;padding-top:0.875rem;border-top:1px solid #e5e5e5}' +
      '.w-clean-meta-line strong{color:#000000;font-weight:700}' +
      '.w-quiz-meta-line{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.5rem;margin-bottom:0.625rem;font-size:0.8125rem;color:#525252}' +
      '.w-quiz-meta-left{font-weight:700;color:#000000}' +
      '.w-quiz-meta-sep{margin:0 0.375rem;color:#a3a3a3}' +
      '.w-question-kicker{font-size:0.75rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#a16207;margin-bottom:0.5rem;display:block}' +
      '.w-option-item.locked{cursor:default}' +
      '.w-option-item.locked:hover{background:#ffffff;border-color:#d4d4d4}' +
      '.w-option-item.correct-choice{border-color:#15803d!important;background:#f0fdf4!important}' +
      '.w-option-item.correct-choice .w-option-letter{background:#15803d!important;color:#ffffff!important}' +
      '.w-option-item.wrong-choice{border-color:#b91c1c!important;background:#fef2f2!important}' +
      '.w-option-item.wrong-choice .w-option-letter{background:#b91c1c!important;color:#ffffff!important}' +
      '.w-feedback-panel{margin-top:1.25rem;padding:1.125rem 1.25rem;border-radius:0.625rem;border:1px solid #e5e5e5;background:#fafafa}' +
      '.w-feedback-panel.is-correct{background:#f0fdf4;border-color:#86efac}' +
      '.w-feedback-panel.is-wrong{background:#fef2f2;border-color:#fecaca}' +
      '.w-feedback-status{font-size:0.8125rem;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.375rem;display:flex;align-items:center;gap:0.4rem}' +
      '.w-feedback-panel.is-correct .w-feedback-status{color:#166534}' +
      '.w-feedback-panel.is-wrong .w-feedback-status{color:#991b1b}' +
      '.w-feedback-correct-ans{font-size:0.875rem;font-weight:700;color:#000000;margin:0 0 0.5rem 0}' +
      '.w-feedback-expl{font-size:0.875rem;color:#262626;line-height:1.6;margin:0 0 0.75rem 0}' +
      '.w-feedback-concept{padding:0.75rem 0.875rem;background:#ffffff;border:1px solid #e5e5e5;border-radius:0.5rem;font-size:0.8125rem;color:#171717;line-height:1.55}' +
      '.w-feedback-concept strong{color:#a16207;font-weight:800;text-transform:uppercase;font-size:0.6875rem;letter-spacing:0.05em;display:block;margin-bottom:0.2rem}' +
      '.w-recs-section{margin-bottom:1.75rem;padding:1.25rem 1.375rem;background:#fafafa;border:1px solid #e5e5e5;border-radius:0.75rem}' +
      '.w-recs-title{font-size:1rem;font-weight:800;color:#000000;margin:0 0 0.25rem 0}' +
      '.w-recs-sub{font-size:0.8125rem;color:#525252;margin:0 0 1rem 0}' +
      '.w-recs-list{display:flex;flex-direction:column;gap:0.75rem}' +
      '.w-rec-item{padding:0.875rem 1rem;background:#ffffff;border:1px solid #e5e5e5;border-radius:0.5rem}' +
      '.w-rec-topic{font-size:0.8125rem;font-weight:800;color:#000000;margin-bottom:0.25rem}' +
      '.w-rec-tip{font-size:0.8125rem;color:#262626;line-height:1.55;margin:0}' +
      '.w-disclaimer-box{margin-top:1.5rem;padding:0.875rem 1rem;background:#fafafa;border:1px solid #e5e5e5;border-radius:0.5rem;font-size:0.75rem;color:#525252;line-height:1.55}' +
      '.w-disclaimer-box strong{color:#171717}' +
      '.w-btn-secondary{display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;padding:0.75rem 1.25rem;min-height:46px;background:#ffffff;color:#000000;border:1.5px solid #000000;border-radius:0.5rem;font-size:0.875rem;font-weight:700;cursor:pointer;transition:background 0.15s ease,color 0.15s ease}' +
      '.w-btn-secondary:hover{background:#000000;color:#facc15}' +
      '.w-btn-secondary:disabled{opacity:0.45;cursor:not-allowed}' +
      '.w-btn-gold{display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;padding:0.875rem 1.5rem;min-height:48px;background:#facc15;color:#000000;border:1.5px solid #facc15;border-radius:0.5rem;font-size:0.9375rem;font-weight:800;cursor:pointer;transition:background 0.15s ease}' +
      '.w-btn-gold:hover{background:#fde047;border-color:#fde047}' +
      '#weaknessAssessmentSection{scroll-margin-top:5rem;overflow-anchor:none}' +
      '#weaknessAssessmentSection *{overflow-anchor:none}';
    document.head.appendChild(style);
  }

  // ===========================================================================
  // 6. UI MOUNTING, SCROLL POSITIONING & INTERACTIVE CONTROLLERS
  // ===========================================================================

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
    var optionsBox = document.getElementById('wOptionsList') || questionBox;

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

  function initWeaknessUI() {
    var calcContainer = document.querySelector('.calc-wrap .container-narrow');
    if (!calcContainer) return;

    injectQuizStyles();

    // 1. Add secondary trigger button inside #wassceForm .action-row
    var actionRow = document.querySelector('#wassceForm .action-row');
    if (actionRow && !document.getElementById('findWeaknessesBtn')) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'findWeaknessesBtn';
      btn.className = 'btn-find-weakness';
      btn.innerHTML =
        '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>' +
        '</svg>' +
        '<span>Daily WASSCE Subject Quiz</span>';
      btn.addEventListener('click', function () {
        openDiagnosticSection('daily_quiz');
      });
      actionRow.appendChild(btn);
    }

    // 2. Add solid #000000 result-card callout banner inside #results before .ai-section
    var resultsBox = document.getElementById('results');
    if (resultsBox && !document.getElementById('weaknessCalloutBanner')) {
      var banner = document.createElement('div');
      banner.id = 'weaknessCalloutBanner';
      banner.className = 'weakness-banner-card';
      banner.innerHTML =
        '<div class="w-banner-content">' +
        '<h3 class="w-banner-title">Diagnose WASSCE Subject Weaknesses</h3>' +
        '<p class="w-banner-desc">Take a daily 10-question WAEC curriculum quiz across your Core and Elective subjects at Easy, Medium, or Difficult level with instant learning feedback.</p>' +
        '</div>' +
        '<button type="button" class="btn-secondary btn-find-weakness w-banner-btn" id="bannerStartWeaknessBtn">' +
        '<svg width="18" height="18" fill="none" stroke="#f59e0b" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>' +
        '<span>Find My Weaknesses</span>' +
        '</button>';

      var aiSection = resultsBox.querySelector('.ai-section');
      if (aiSection) {
        resultsBox.insertBefore(banner, aiSection);
      } else {
        resultsBox.appendChild(banner);
      }

      if (typeof window.afriEnsureResultSectionsOrder === 'function') {
        window.afriEnsureResultSectionsOrder(resultsBox);
      }

      var startBannerBtn = document.getElementById('bannerStartWeaknessBtn');
      if (startBannerBtn) {
        startBannerBtn.addEventListener('click', function () {
          openDiagnosticSection('daily_quiz');
        });
      }
    }

    // 3. Create main assessment container inside .calc-wrap .container-narrow
    if (document.getElementById('weaknessAssessmentSection')) return;

    var countryOptionsHtml = Object.keys(WASSCE_COUNTRIES)
      .map(function (cid) {
        var c = WASSCE_COUNTRIES[cid];
        return (
          '<option value="' +
          escapeHtml(c.id) +
          '">' +
          escapeHtml(c.shortLabel) +
          '</option>'
        );
      })
      .join('');

    var compactProgLabels = {
      custom: 'Single Subject',
      medicine: 'Medicine & Health',
      engineering: 'Engineering',
      computing: 'Computing & IT',
      business: 'Business & Finance',
      law: 'Law (LLB)',
      sciences: 'BSc Sciences',
      economics_soc: 'Economics & Social Sci.',
      humanities: 'General Arts'
    };
    var progOrder = [
      'custom',
      'medicine',
      'engineering',
      'computing',
      'business',
      'law',
      'sciences',
      'economics_soc',
      'humanities'
    ];
    var programmeOptionsHtml = progOrder
      .map(function (pid) {
        var p = WASSCE_PROGRAMMES[pid];
        if (!p) return '';
        return (
          '<option value="' +
          escapeHtml(p.id) +
          '">' +
          escapeHtml(compactProgLabels[p.id] || p.label) +
          '</option>'
        );
      })
      .join('');

    var section = document.createElement('div');
    section.id = 'weaknessAssessmentSection';
    section.className = 'weakness-section';
    section.style.display = 'none';
    section.setAttribute('aria-live', 'polite');

    section.innerHTML =
      '<div class="weakness-card">' +
      '  <!-- VIEW 1: SETUP & SUBJECT SELECTION -->' +
      '  <div id="wIntroView" class="w-view">' +
      '    <div class="w-intro-top-bar">' +
      '      <h3 class="w-intro-heading">Practice Quiz</h3>' +
      '      <button type="button" id="wCloseBtn" class="w-close-btn" aria-label="Close quiz">&times;</button>' +
      '    </div>' +
      '    <p id="wContextBanner" class="w-intro-rec"></p>' +
      '    <div class="w-intro-field">' +
      '      <label for="wSubjectSelect" class="w-intro-label">Subject</label>' +
      '      <select id="wSubjectSelect" class="w-form-select"></select>' +
      '    </div>' +
      '    <div class="w-intro-row-two">' +
      '      <div>' +
      '        <label for="wCountrySelect" class="w-intro-label">Country</label>' +
      '        <select id="wCountrySelect" class="w-form-select">' +
      countryOptionsHtml +
      '        </select>' +
      '      </div>' +
      '      <div>' +
      '        <label for="wProgrammeSelect" class="w-intro-label">Programme (Optional)</label>' +
      '        <select id="wProgrammeSelect" class="w-form-select">' +
      programmeOptionsHtml +
      '        </select>' +
      '      </div>' +
      '    </div>' +
      '    <div class="w-intro-field">' +
      '      <span class="w-intro-label" id="wDiffLabel">Difficulty</span>' +
      '      <div id="wDifficultyGrid" class="w-intro-diff-grid" role="radiogroup" aria-labelledby="wDiffLabel">' +
      '        <button type="button" class="w-intro-diff-btn" data-diff="easy" role="radio" aria-checked="false">Easy</button>' +
      '        <button type="button" class="w-intro-diff-btn selected" data-diff="medium" role="radio" aria-checked="true">Medium</button>' +
      '        <button type="button" class="w-intro-diff-btn" data-diff="difficult" role="radio" aria-checked="false">Difficult</button>' +
      '      </div>' +
      '    </div>' +
      '    <button type="button" id="wBeginQuizBtn" class="w-intro-start-btn">Start Quiz</button>' +
      '  </div>' +
      '  <!-- VIEW 2: ACTIVE 10-QUESTION QUIZ WITH IMMEDIATE LEARNING FEEDBACK -->' +
      '  <div id="wQuizView" class="w-view" style="display: none;">' +
      '    <div class="w-quiz-top">' +
      '      <div class="w-quiz-meta-line">' +
      '        <div class="w-quiz-meta-left" id="wQuizModeLabel">Daily WASSCE Quiz</div>' +
      '        <div class="w-quiz-counter" id="wQuizCounter">Question 1 of 10 · Score: 0 / 0</div>' +
      '      </div>' +
      '      <div class="w-progress-track" aria-hidden="true">' +
      '        <div id="wProgressBar" class="w-progress-fill" style="width: 10%;"></div>' +
      '      </div>' +
      '    </div>' +
      '    <div class="w-question-box">' +
      '      <span id="wQuestionKicker" class="w-question-kicker">English Language · Lexis &amp; Register</span>' +
      '      <h4 id="wQuestionPrompt" class="w-question-title">Question text</h4>' +
      '      <div id="wOptionsList" class="w-options-grid" role="radiogroup" aria-labelledby="wQuestionPrompt"></div>' +
      '    </div>' +
      '    <div id="wValidationAlert" class="w-validation-alert" style="display: none;">' +
      '      Select one answer option above, then click Check Answer to view the explanation.' +
      '    </div>' +
      '    <div id="wImmediateFeedback" style="display: none;"></div>' +
      '    <div class="w-quiz-nav">' +
      '      <button type="button" id="wPrevBtn" class="w-btn-secondary">' +
      '        Previous' +
      '      </button>' +
      '      <div style="display:flex; gap:0.625rem; flex-wrap:wrap; justify-content:flex-end;">' +
      '        <button type="button" id="wCheckBtn" class="w-btn-gold">' +
      '          Check Answer' +
      '        </button>' +
      '        <button type="button" id="wNextBtn" class="w-btn-gold" style="display: none;">' +
      '          <span>Next Question</span>' +
      '          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">' +
      '            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>' +
      '          </svg>' +
      '        </button>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '  <!-- VIEW 3: DIAGNOSTIC RESULTS, STRENGTHS, WEAKNESSES & STUDY PLAN -->' +
      '  <div id="wResultsView" class="w-view" style="display: none;">' +
      '    <div class="w-results-header">' +
      '      <span class="w-eyebrow">WAEC WASSCE Subject Diagnostic Summary</span>' +
      '      <div class="w-results-score-wrap">' +
      '        <div class="w-results-score-big" id="wScorePercent">0%</div>' +
      '        <div class="w-score-meta">' +
      '          <h3 class="w-score-headline" id="wScoreHeadline">Session Complete</h3>' +
      '          <p class="w-score-fraction" id="wScoreFraction">0 out of 10 correct</p>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      '    <div id="wComparisonBox" class="w-comparison-card"></div>' +
      '    <div class="w-analysis-grid">' +
      '      <div class="w-analysis-card w-card-strong">' +
      '        <div class="w-card-head">' +
      '          <svg width="18" height="18" fill="none" stroke="#16a34a" viewBox="0 0 24 24" aria-hidden="true">' +
      '            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>' +
      '          </svg>' +
      '          <h4>Demonstrated Strengths</h4>' +
      '        </div>' +
      '        <div id="wStrengthsList" class="w-analysis-list"></div>' +
      '      </div>' +
      '      <div class="w-analysis-card w-card-weak">' +
      '        <div class="w-card-head">' +
      '          <svg width="18" height="18" fill="none" stroke="#dc2626" viewBox="0 0 24 24" aria-hidden="true">' +
      '            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>' +
      '          </svg>' +
      '          <h4>Topics Needing Improvement</h4>' +
      '        </div>' +
      '        <div id="wWeaknessesList" class="w-analysis-list"></div>' +
      '      </div>' +
      '    </div>' +
      '    <div id="wStudyRecsSection" class="w-recs-section">' +
      '      <h4 class="w-recs-title">Practical WASSCE Syllabus Study Recommendations</h4>' +
      '      <p class="w-recs-sub" id="wStudyRecsSub">Targeted revision steps based on the WAEC topics tested in this session.</p>' +
      '      <div id="wStudyRecsList" class="w-recs-list"></div>' +
      '    </div>' +
      '    <div id="wPracticeWeakWrap" class="w-practice-banner" style="display: none;">' +
      '      <div class="w-practice-banner-text">' +
      '        <h4>Drill Your Weak Topics Now</h4>' +
      '        <p>Start a focused 10-question session targeting the WAEC topics you missed, using fresh unseen questions first.</p>' +
      '      </div>' +
      '      <button type="button" id="wPractiseWeakBtn" class="w-practice-btn">' +
      '        <span>Practise Weak Topics</span>' +
      '        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">' +
      '          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>' +
      '        </svg>' +
      '      </button>' +
      '    </div>' +
      '    <div class="w-review-section">' +
      '      <div class="w-review-head">' +
      '        <h4 class="w-review-title">Full 10-Question Review &amp; Concept Notes</h4>' +
      '        <span class="w-review-sub">Review every question, verified WAEC answer, and underlying syllabus concept</span>' +
      '      </div>' +
      '      <div id="wReviewList" class="w-review-list"></div>' +
      '    </div>' +
      '    <div id="wHistorySection" class="w-history-section">' +
      '      <div class="w-history-head">' +
      '        <h4 class="w-history-title">Recent Quiz Sessions (Saved Locally)</h4>' +
      '        <button type="button" id="wClearHistoryBtn" class="w-clear-link">Clear History</button>' +
      '      </div>' +
      '      <div id="wHistoryList" class="w-history-list"></div>' +
      '    </div>' +
      '    <div class="w-results-footer">' +
      '      <button type="button" id="wRetakeFreshBtn" class="w-btn-gold">' +
      '        New Daily Quiz (10 Fresh Questions)' +
      '      </button>' +
      '      <button type="button" id="wChangeSetupBtn" class="w-btn-secondary">' +
      '        Change Subjects / Difficulty' +
      '      </button>' +
      '      <button type="button" id="wDoneCloseBtn" class="w-btn-secondary">' +
      '        Close Quiz' +
      '      </button>' +
      '    </div>' +
      '    <div class="w-disclaimer-box">' +
      '      <strong>Disclaimer:</strong> Results from this WASSCE daily learning quiz reflect conceptual understanding on a 10-question practice sample and do not represent official WAEC grading or university admission confirmation. Always consult official WAEC syllabuses and your target university\'s current admission brochure.' +
      '    </div>' +
      '  </div>' +
      '</div>';

    calcContainer.appendChild(section);

    renderSubjectButtons();
    updateDifficultyUI();
    bindDiagnosticEvents();
  }

  function renderSubjectButtons() {
    var subjSelect = document.getElementById('wSubjectSelect');
    if (!subjSelect) return;

    var chosenProg = WASSCE_PROGRAMMES[currentSession.programmeId];
    var progList =
      currentSession.programmeId !== 'custom' && chosenProg && chosenProg.subjectsByCountry
        ? chosenProg.subjectsByCountry[currentSession.countryId] || chosenProg.subjectsByCountry.ghana
        : null;

    var html = '';
    if (Array.isArray(progList) && progList.length > 0) {
      var shortNames = progList
        .map(function (id) {
          return SUBJECTS[id] ? SUBJECTS[id].shortName : id;
        })
        .join(', ');
      html +=
        '<option value="programme_mix">All Programme Subjects (' +
        escapeHtml(shortNames) +
        ')</option>';
    }

    html += SUBJECT_ORDER.map(function (subjId) {
      var displayName = getSubjectDisplayName(subjId, currentSession.countryId);
      return (
        '<option value="' +
        escapeHtml(subjId) +
        '">' +
        escapeHtml(displayName) +
        '</option>'
      );
    }).join('');

    subjSelect.innerHTML = html;

    if (Array.isArray(progList) && currentSession.selectedSubjects.length > 1) {
      subjSelect.value = 'programme_mix';
    } else if (
      currentSession.selectedSubjects.length > 0 &&
      SUBJECTS[currentSession.selectedSubjects[0]]
    ) {
      subjSelect.value = currentSession.selectedSubjects[0];
    } else {
      subjSelect.value = 'core_maths';
      currentSession.selectedSubjects = ['core_maths'];
    }
  }

  function updateProgrammeNote() {}

  function updateDifficultyUI() {
    document
      .querySelectorAll('#wDifficultyGrid [data-diff]')
      .forEach(function (btn) {
        var d = btn.getAttribute('data-diff');
        var isSelected = d === currentSession.difficulty;
        btn.classList.toggle('selected', isSelected);
        btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      });
  }

  function applyProgrammeSubjects(programmeId, countryId) {
    var chosen = WASSCE_PROGRAMMES[programmeId];
    if (!chosen || !chosen.subjectsByCountry) return;
    var list =
      chosen.subjectsByCountry[countryId] || chosen.subjectsByCountry.ghana;
    if (Array.isArray(list) && list.length > 0) {
      currentSession.selectedSubjects = list.slice();
    }
  }

  function bindDiagnosticEvents() {
    var closeBtn = document.getElementById('wCloseBtn');
    var doneCloseBtn = document.getElementById('wDoneCloseBtn');
    var beginBtn = document.getElementById('wBeginQuizBtn');
    var prevBtn = document.getElementById('wPrevBtn');
    var checkBtn = document.getElementById('wCheckBtn');
    var nextBtn = document.getElementById('wNextBtn');
    var retakeFreshBtn = document.getElementById('wRetakeFreshBtn');
    var changeSetupBtn = document.getElementById('wChangeSetupBtn');
    var practiseWeakBtn = document.getElementById('wPractiseWeakBtn');
    var clearHistBtn = document.getElementById('wClearHistoryBtn');
    var countrySelect = document.getElementById('wCountrySelect');
    var progSelect = document.getElementById('wProgrammeSelect');
    var subjSelect = document.getElementById('wSubjectSelect');

    if (closeBtn) closeBtn.addEventListener('click', closeDiagnosticSection);
    if (doneCloseBtn)
      doneCloseBtn.addEventListener('click', closeDiagnosticSection);

    if (countrySelect) {
      countrySelect.addEventListener('change', function () {
        currentSession.countryId =
          WASSCE_COUNTRIES[countrySelect.value] ? countrySelect.value : 'ghana';
        if (currentSession.programmeId !== 'custom' && currentSession.selectedSubjects.length > 1) {
          applyProgrammeSubjects(
            currentSession.programmeId,
            currentSession.countryId
          );
        }
        renderSubjectButtons();
        var ctx = detectCalculatorContext();
        var banner = document.getElementById('wContextBanner');
        if (banner) banner.textContent = ctx.message;
      });
    }

    if (progSelect) {
      progSelect.addEventListener('change', function () {
        currentSession.userCustomizedSubject = true;
        currentSession.programmeId = progSelect.value || 'custom';
        if (currentSession.programmeId !== 'custom') {
          applyProgrammeSubjects(
            currentSession.programmeId,
            currentSession.countryId
          );
        } else {
          var single =
            subjSelect && SUBJECTS[subjSelect.value]
              ? subjSelect.value
              : 'core_maths';
          currentSession.selectedSubjects = [single];
        }
        renderSubjectButtons();
      });
    }

    if (subjSelect) {
      subjSelect.addEventListener('change', function () {
        currentSession.userCustomizedSubject = true;
        var val = subjSelect.value;
        if (val === 'programme_mix') {
          applyProgrammeSubjects(
            currentSession.programmeId,
            currentSession.countryId
          );
        } else if (SUBJECTS[val]) {
          currentSession.selectedSubjects = [val];
        }
      });
    }

    document
      .querySelectorAll('#wDifficultyGrid [data-diff]')
      .forEach(function (btn) {
        btn.addEventListener('click', function () {
          var diff = btn.getAttribute('data-diff');
          if (diff && DIFFICULTY_LABELS[diff]) {
            currentSession.difficulty = diff;
            updateDifficultyUI();
          }
        });
      });

    if (beginBtn) {
      beginBtn.addEventListener('click', function () {
        if (!currentSession.selectedSubjects || currentSession.selectedSubjects.length === 0) {
          currentSession.selectedSubjects = ['core_maths'];
        }
        startQuiz('daily_quiz', []);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
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
      retakeFreshBtn.addEventListener('click', function () {
        startQuiz('daily_quiz', []);
      });
    }

    if (changeSetupBtn) {
      changeSetupBtn.addEventListener('click', function () {
        openDiagnosticSection('daily_quiz');
      });
    }

    if (practiseWeakBtn) {
      practiseWeakBtn.addEventListener('click', function () {
        var history = getQuizHistory();
        var latest = history[0];
        if (
          latest &&
          Array.isArray(latest.weakKeys) &&
          latest.weakKeys.length > 0
        ) {
          startQuiz('weakness_drill', latest.weakKeys);
        } else {
          startQuiz('daily_quiz', []);
        }
      });
    }

    if (clearHistBtn) {
      clearHistBtn.addEventListener('click', function () {
        if (!clearConfirmArmed) {
          clearConfirmArmed = true;
          clearHistBtn.textContent = 'Click again to confirm reset';
          setTimeout(function () {
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
        var compBox = document.getElementById('wComparisonBox');
        if (compBox) {
          compBox.innerHTML =
            '<div class="w-comp-wrap neutral"><div class="w-comp-text"><p>Saved session history and seen-question log cleared from this browser.</p></div></div>';
        }
      });
    }
  }

  function openDiagnosticSection(mode) {
    var section = document.getElementById('weaknessAssessmentSection');
    if (!section) return;

    section.style.display = 'block';
    showView('wIntroView');

    var ctx = detectCalculatorContext();
    var banner = document.getElementById('wContextBanner');
    if (banner) {
      banner.textContent = ctx.message;
    }

    if (ctx.hasGrades && !currentSession.userCustomizedSubject) {
      if (ctx.recommendedSubject && SUBJECTS[ctx.recommendedSubject]) {
        currentSession.programmeId = 'custom';
        currentSession.selectedSubjects = [ctx.recommendedSubject];
        var progSelect = document.getElementById('wProgrammeSelect');
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
    var section = document.getElementById('weaknessAssessmentSection');
    if (section) {
      section.style.display = 'none';
    }
  }

  function showView(viewId) {
    ['wIntroView', 'wQuizView', 'wResultsView'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.style.display = id === viewId ? 'block' : 'none';
    });
  }

  function renderIntroHistoryPreview() {
    var box = document.getElementById('wHistoryPreview');
    if (!box) return;
    var history = getQuizHistory();
    if (history.length === 0) {
      box.innerHTML = '';
      return;
    }
    var last = history[0];
    var d = new Date(last.timestamp);
    var dateStr = d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
    var subjSummary = Array.isArray(last.subjects)
      ? last.subjects
          .map(function (id) {
            return SUBJECTS[id] ? SUBJECTS[id].shortName : id;
          })
          .join(', ')
      : 'Mixed WASSCE';
    var countryText = getCountryLabel(last.countryId || 'ghana');
    box.innerHTML =
      '<div class="w-hist-mini-banner">' +
      '<span class="w-mini-label">Previous Session:</span> ' +
      '<strong>' +
      last.score +
      '/' +
      last.total +
      ' (' +
      last.percentage +
      '%)</strong> ' +
      '<span class="w-mini-date">· WAEC ' +
      escapeHtml(countryText) +
      ' · ' +
      escapeHtml(DIFFICULTY_LABELS[last.difficulty] || 'Medium') +
      ' · ' +
      escapeHtml(subjSummary) +
      ' · ' +
      escapeHtml(dateStr) +
      '</span>' +
      '</div>';
  }

  function startQuiz(mode, weakKeys) {
    var questions = generateSessionQuestions(
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

    var section = document.getElementById('weaknessAssessmentSection');
    if (section) scrollWeaknessSectionIntoView(section);
  }

  function getRunningScore() {
    var confirmedCount = 0;
    var correctCount = 0;
    currentSession.questions.forEach(function (q, idx) {
      var entry = currentSession.userAnswers[idx];
      if (entry && entry.confirmed) {
        confirmedCount += 1;
        if (entry.selectedIndex === q.correctIndex) {
          correctCount += 1;
        }
      }
    });
    return { confirmedCount: confirmedCount, correctCount: correctCount };
  }

  function renderCurrentQuestion() {
    var idx = currentSession.currentIndex;
    var total = currentSession.questions.length;
    var q = currentSession.questions[idx];
    if (!q) return;

    var savedScrollY = getScrollY();

    var answerState = currentSession.userAnswers[idx] || {
      selectedIndex: undefined,
      confirmed: false
    };
    var isConfirmed = !!answerState.confirmed;
    var selectedIdx = answerState.selectedIndex;

    var modeLabel = document.getElementById('wQuizModeLabel');
    var counter = document.getElementById('wQuizCounter');
    var bar = document.getElementById('wProgressBar');
    var kickerEl = document.getElementById('wQuestionKicker');
    var promptEl = document.getElementById('wQuestionPrompt');
    var optionsEl = document.getElementById('wOptionsList');
    var prevBtn = document.getElementById('wPrevBtn');
    var checkBtn = document.getElementById('wCheckBtn');
    var nextBtn = document.getElementById('wNextBtn');
    var alertEl = document.getElementById('wValidationAlert');
    var feedbackEl = document.getElementById('wImmediateFeedback');

    if (alertEl) alertEl.style.display = 'none';

    var subjMeta = SUBJECTS[q.subject] || { name: q.subject, topics: {} };
    var topicMeta = subjMeta.topics[q.topicId] || { name: q.topicId };
    var diffLabel = DIFFICULTY_LABELS[q.difficulty] || 'Medium';
    var countryText = 'WAEC ' + getCountryLabel(currentSession.countryId);
    var displaySubj = getSubjectDisplayName(q.subject, currentSession.countryId);

    if (modeLabel) {
      var baseTitle =
        currentSession.mode === 'weakness_drill'
          ? 'Targeted Weak-Topic Drill'
          : 'Daily WASSCE Quiz';
      modeLabel.innerHTML =
        escapeHtml(baseTitle) +
        '<span class="w-quiz-meta-sep">·</span><span>' +
        escapeHtml(countryText) +
        '</span><span class="w-quiz-meta-sep">·</span><span>' +
        escapeHtml(diffLabel) +
        '</span>';
    }

    var tally = getRunningScore();
    if (counter) {
      counter.textContent =
        'Question ' +
        (idx + 1) +
        ' of ' +
        total +
        ' · Score: ' +
        tally.correctCount +
        ' / ' +
        tally.confirmedCount;
    }

    if (bar) {
      bar.style.width = Math.round(((idx + 1) / total) * 100) + '%';
    }

    if (kickerEl) {
      kickerEl.textContent = displaySubj + ' · ' + topicMeta.name;
    }

    if (promptEl) {
      promptEl.textContent = q.question;
    }

    if (optionsEl) {
      optionsEl.innerHTML = '';
      var letters = ['A', 'B', 'C', 'D'];

      q.options.forEach(function (optText, optIndex) {
        var extraClass = '';
        if (isConfirmed) {
          extraClass = 'locked';
          if (optIndex === q.correctIndex) {
            extraClass += ' correct-choice';
          } else if (
            optIndex === selectedIdx &&
            selectedIdx !== q.correctIndex
          ) {
            extraClass += ' wrong-choice';
          }
        } else if (selectedIdx === optIndex) {
          extraClass = 'selected';
        }

        var item = document.createElement('div');
        item.className = ('w-option-item ' + extraClass).trim();
        item.setAttribute('role', 'radio');
        item.setAttribute(
          'aria-checked',
          selectedIdx === optIndex ? 'true' : 'false'
        );
        item.tabIndex = isConfirmed ? -1 : 0;

        item.innerHTML =
          '<span class="w-option-letter">' +
          letters[optIndex] +
          '</span>' +
          '<span class="w-option-text">' +
          escapeHtml(optText) +
          '</span>';

        if (!isConfirmed) {
          var selectHandler = function (fromKeyboard) {
            currentSession.userAnswers[idx] = {
              selectedIndex: optIndex,
              confirmed: false
            };
            if (alertEl) alertEl.style.display = 'none';
            renderCurrentQuestion();
            if (fromKeyboard && optionsEl) {
              var refreshed = optionsEl.children[optIndex];
              if (refreshed && typeof refreshed.focus === 'function') {
                refreshed.focus({ preventScroll: true });
              }
            }
          };

          item.addEventListener('click', function () {
            selectHandler(false);
          });
          item.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              selectHandler(true);
            }
          });
        }

        optionsEl.appendChild(item);
      });
    }

    if (feedbackEl) {
      if (isConfirmed) {
        var isRight = selectedIdx === q.correctIndex;
        var optLetters = ['A', 'B', 'C', 'D'];
        var correctLetter = optLetters[q.correctIndex] || '';
        var correctText = q.options[q.correctIndex] || '';

        feedbackEl.style.display = 'block';
        feedbackEl.innerHTML =
          '<div class="w-feedback-panel ' +
          (isRight ? 'is-correct' : 'is-wrong') +
          '">' +
          '<div class="w-feedback-status">' +
          (isRight
            ? 'Correct Answer'
            : 'Incorrect — Review the WASSCE Concept Below') +
          '</div>' +
          '<p class="w-feedback-correct-ans">Verified Answer: ' +
          escapeHtml(correctLetter) +
          '. ' +
          escapeHtml(correctText) +
          '</p>' +
          '<p class="w-feedback-expl"><strong>Why:</strong> ' +
          escapeHtml(q.explanation) +
          '</p>' +
          '<div class="w-feedback-concept">' +
          '<strong>WAEC WASSCE Concept Takeaway</strong>' +
          escapeHtml(q.concept) +
          '</div>' +
          '</div>';
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
          nextBtn.innerHTML =
            '<span>View Quiz Results</span>' +
            '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">' +
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>' +
            '</svg>';
        } else {
          nextBtn.innerHTML =
            '<span>Next Question</span>' +
            '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">' +
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>' +
            '</svg>';
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
    var idx = currentSession.currentIndex;
    var entry = currentSession.userAnswers[idx];
    var alertEl = document.getElementById('wValidationAlert');

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
    var idx = currentSession.currentIndex;
    var total = currentSession.questions.length;
    var entry = currentSession.userAnswers[idx];

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

  // ===========================================================================
  // 7. DIAGNOSTIC SCORING, TOPIC STRENGTHS/WEAKNESSES & STUDY RECOMMENDATIONS
  // ===========================================================================

  function finalizeAndRenderResults() {
    var questions = currentSession.questions;
    var total = questions.length;
    var correctCount = 0;
    var topicStats = {};

    questions.forEach(function (q, idx) {
      var entry = currentSession.userAnswers[idx];
      var userChoice = entry ? entry.selectedIndex : -1;
      var isCorrect = userChoice === q.correctIndex;
      if (isCorrect) correctCount += 1;

      var key = q.subject + '::' + q.topicId;
      var subjMeta = SUBJECTS[q.subject] || {
        name: q.subject,
        shortName: q.subject,
        topics: {}
      };
      var topMeta = subjMeta.topics[q.topicId] || {
        name: q.topicId,
        studyTip: ''
      };

      if (!topicStats[key]) {
        topicStats[key] = {
          key: key,
          subjectId: q.subject,
          subjectLabel: getSubjectDisplayName(
            q.subject,
            currentSession.countryId
          ),
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

    var percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    var strongTopics = [];
    var weakTopics = [];

    Object.keys(topicStats).forEach(function (k) {
      var stat = topicStats[k];
      var ratio = stat.correct / stat.total;
      if (ratio >= 0.75) {
        strongTopics.push(stat);
      } else {
        weakTopics.push(stat);
      }
    });

    weakTopics.sort(function (a, b) {
      return a.correct / a.total - b.correct / b.total;
    });
    strongTopics.sort(function (a, b) {
      return b.correct / b.total - a.correct / a.total;
    });

    var previousHistory = getQuizHistory();
    var lastAttempt = previousHistory.length > 0 ? previousHistory[0] : null;

    markQuestionsSeen(questions);

    var attemptRecord = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      countryId: currentSession.countryId,
      programmeId: currentSession.programmeId,
      mode: currentSession.mode,
      difficulty: currentSession.difficulty,
      subjects: currentSession.selectedSubjects.slice(),
      score: correctCount,
      total: total,
      percentage: percentage,
      weakKeys: weakTopics.map(function (w) {
        return w.key;
      }),
      weakLabels: weakTopics.map(function (w) {
        return w.subjectShort + ': ' + w.topicLabel;
      }),
      strongLabels: strongTopics.map(function (s) {
        return s.subjectShort + ': ' + s.topicLabel;
      })
    };

    saveQuizAttempt(attemptRecord);

    var scorePctEl = document.getElementById('wScorePercent');
    var scoreHeadEl = document.getElementById('wScoreHeadline');
    var scoreFracEl = document.getElementById('wScoreFraction');

    if (scorePctEl) scorePctEl.textContent = percentage + '%';

    var headline = 'WASSCE Grade A1–B2 Distinction Readiness';
    if (percentage < 50) {
      headline = 'Foundational WAEC Gaps Identified — Focus on Core Concepts';
    } else if (percentage < 70) {
      headline = 'Credit-Band Foundation (C4–C6) — Push Toward B2/A1';
    } else if (percentage < 80) {
      headline = 'Strong WASSCE Grade B2–B3 Command';
    }
    if (scoreHeadEl) scoreHeadEl.textContent = headline;

    var subjNames = currentSession.selectedSubjects
      .map(function (id) {
        return SUBJECTS[id] ? SUBJECTS[id].shortName : id;
      })
      .join(', ');
    var countryText = 'WAEC ' + getCountryLabel(currentSession.countryId);

    if (scoreFracEl) {
      scoreFracEl.textContent =
        correctCount +
        ' / ' +
        total +
        ' Correct · ' +
        countryText +
        ' · ' +
        DIFFICULTY_LABELS[currentSession.difficulty] +
        ' · ' +
        subjNames;
    }

    renderComparisonBox(attemptRecord, lastAttempt);

    var strengthsEl = document.getElementById('wStrengthsList');
    var weaknessesEl = document.getElementById('wWeaknessesList');

    if (strengthsEl) {
      if (strongTopics.length === 0) {
        strengthsEl.innerHTML =
          '<div class="w-empty-note">No topic reached 75%+ in this round. Review the WAEC concept notes below and drill the weak topics.</div>';
      } else {
        strengthsEl.innerHTML = strongTopics
          .map(function (t) {
            return (
              '<div class="w-topic-badge-row strong">' +
              '<span class="w-topic-name">' +
              escapeHtml(t.subjectShort) +
              ' · ' +
              escapeHtml(t.topicLabel) +
              '</span>' +
              '<span class="w-topic-score">' +
              t.correct +
              '/' +
              t.total +
              '</span>' +
              '</div>'
            );
          })
          .join('');
      }
    }

    if (weaknessesEl) {
      if (weakTopics.length === 0) {
        weaknessesEl.innerHTML =
          '<div class="w-empty-note green">Zero weak topics in this 10-question session. Step up to Difficult or add another WASSCE subject.</div>';
      } else {
        weaknessesEl.innerHTML = weakTopics
          .map(function (t) {
            return (
              '<div class="w-topic-badge-row weak">' +
              '<span class="w-topic-name">' +
              escapeHtml(t.subjectShort) +
              ' · ' +
              escapeHtml(t.topicLabel) +
              '</span>' +
              '<span class="w-topic-score">' +
              t.correct +
              '/' +
              t.total +
              '</span>' +
              '</div>'
            );
          })
          .join('');
      }
    }

    var recsListEl = document.getElementById('wStudyRecsList');
    var recsSubEl = document.getElementById('wStudyRecsSub');
    if (recsListEl) {
      if (weakTopics.length > 0) {
        if (recsSubEl) {
          recsSubEl.textContent =
            'Prioritize these WAEC WASSCE syllabus revision steps before your next practice session to improve your subject grades and lower your aggregate:';
        }
        recsListEl.innerHTML = weakTopics
          .map(function (t) {
            return (
              '<div class="w-rec-item">' +
              '<div class="w-rec-topic">' +
              escapeHtml(t.subjectLabel) +
              ' — ' +
              escapeHtml(t.topicLabel) +
              ' (' +
              t.correct +
              '/' +
              t.total +
              ' correct)</div>' +
              '<p class="w-rec-tip">' +
              escapeHtml(t.studyTip) +
              '</p>' +
              '</div>'
            );
          })
          .join('');
      } else {
        if (recsSubEl) {
          recsSubEl.textContent =
            'You scored cleanly across every tested WAEC topic. To lock in A1 distinction performance:';
        }
        var nextDiff =
          currentSession.difficulty === 'easy'
            ? 'Medium'
            : currentSession.difficulty === 'medium'
            ? 'Difficult'
            : 'Difficult across additional WASSCE subjects';
        recsListEl.innerHTML = strongTopics
          .slice(0, 3)
          .map(function (t) {
            return (
              '<div class="w-rec-item">' +
              '<div class="w-rec-topic">' +
              escapeHtml(t.subjectLabel) +
              ' — ' +
              escapeHtml(t.topicLabel) +
              ' (Mastered)</div>' +
              '<p class="w-rec-tip">Next step: Attempt ' +
              escapeHtml(nextDiff) +
              ' questions under timed WAEC Paper 1 &amp; Paper 2 conditions. ' +
              escapeHtml(t.studyTip) +
              '</p>' +
              '</div>'
            );
          })
          .join('');
      }
    }

    var practiceWrap = document.getElementById('wPracticeWeakWrap');
    if (practiceWrap) {
      practiceWrap.style.display = weakTopics.length > 0 ? 'flex' : 'none';
    }

    renderQuestionReview(questions);
    renderHistoryList();

    showView('wResultsView');
    var section = document.getElementById('weaknessAssessmentSection');
    if (section) scrollWeaknessSectionIntoView(section);
  }

  function renderComparisonBox(current, previous) {
    var box = document.getElementById('wComparisonBox');
    if (!box) return;

    if (!previous) {
      box.innerHTML =
        '<div class="w-comp-wrap baseline">' +
        '<div class="w-comp-text">' +
        '<strong>Baseline Session Saved Locally:</strong> Your score (' +
        current.percentage +
        '%) and seen question IDs are stored in this browser so your next session serves fresh WASSCE questions and tracks your progress.' +
        '</div>' +
        '</div>';
      return;
    }

    var diff = current.percentage - previous.percentage;
    var prevWeakSet = new Set(previous.weakLabels || []);
    var currStrongSet = new Set(current.strongLabels || []);
    var masteredNow = [];
    currStrongSet.forEach(function (label) {
      if (prevWeakSet.has(label)) masteredNow.push(label);
    });

    var statusClass = 'neutral';
    var headline = 'Matched your previous session (' + current.percentage + '%)';
    if (diff > 0) {
      statusClass = 'improved';
      headline =
        'Up +' +
        diff +
        '% compared with your previous session (' +
        previous.percentage +
        '% to ' +
        current.percentage +
        '%)';
    } else if (diff < 0) {
      statusClass = 'regressed';
      headline =
        diff +
        '% compared with your previous session (' +
        previous.percentage +
        '% to ' +
        current.percentage +
        '%)';
    }

    var extraDetail = '';
    if (masteredNow.length > 0) {
      extraDetail =
        ' Turning into strengths: ' + escapeHtml(masteredNow.join(', ')) + '.';
    }

    box.innerHTML =
      '<div class="w-comp-wrap ' +
      statusClass +
      '">' +
      '<div class="w-comp-text">' +
      '<p><strong>' +
      escapeHtml(headline) +
      '.</strong>' +
      extraDetail +
      '</p>' +
      '</div>' +
      '</div>';
  }

  function renderQuestionReview(questions) {
    var listEl = document.getElementById('wReviewList');
    if (!listEl) return;
    var letters = ['A', 'B', 'C', 'D'];

    listEl.innerHTML = questions
      .map(function (q, idx) {
        var entry = currentSession.userAnswers[idx];
        var userIdx = entry ? entry.selectedIndex : -1;
        var isCorrect = userIdx === q.correctIndex;
        var userAnsText =
          userIdx >= 0
            ? letters[userIdx] + '. ' + q.options[userIdx]
            : 'No answer';
        var correctAnsText =
          letters[q.correctIndex] + '. ' + q.options[q.correctIndex];
        var subjMeta = SUBJECTS[q.subject] || {
          shortName: q.subject,
          topics: {}
        };
        var topMeta = subjMeta.topics[q.topicId] || { name: q.topicId };

        return (
          '<div class="w-review-card ' +
          (isCorrect ? 'correct' : 'incorrect') +
          '">' +
          '<div class="w-review-card-head">' +
          '<span class="w-review-qnum">Q' +
          (idx + 1) +
          ' · ' +
          escapeHtml(subjMeta.shortName) +
          ' · ' +
          escapeHtml(topMeta.name) +
          ' · ' +
          escapeHtml(DIFFICULTY_LABELS[q.difficulty] || '') +
          '</span>' +
          '<span class="w-verdict ' +
          (isCorrect ? 'correct' : 'incorrect') +
          '">' +
          (isCorrect ? 'Correct' : 'Incorrect') +
          '</span>' +
          '</div>' +
          '<p class="w-review-prompt">' +
          escapeHtml(q.question) +
          '</p>' +
          '<div class="w-review-answers">' +
          '<div class="w-answer-line user ' +
          (isCorrect ? 'correct' : 'incorrect') +
          '">' +
          '<strong>Your Answer:</strong> ' +
          escapeHtml(userAnsText) +
          '</div>' +
          (!isCorrect
            ? '<div class="w-answer-line correct"><strong>Correct Answer:</strong> ' +
              escapeHtml(correctAnsText) +
              '</div>'
            : '') +
          '</div>' +
          '<div class="w-review-explanation">' +
          '<strong>Explanation &amp; WASSCE Concept</strong>' +
          '<p>' +
          escapeHtml(q.explanation) +
          ' <em>Concept: ' +
          escapeHtml(q.concept) +
          '</em></p>' +
          '</div>' +
          '</div>'
        );
      })
      .join('');
  }

  function renderHistoryList() {
    var histSection = document.getElementById('wHistorySection');
    var listEl = document.getElementById('wHistoryList');
    if (!listEl || !histSection) return;

    var history = getQuizHistory();
    if (history.length === 0) {
      histSection.style.display = 'none';
      return;
    }

    histSection.style.display = 'block';
    listEl.innerHTML = history
      .slice(0, 6)
      .map(function (item, idx) {
        var d = new Date(item.timestamp);
        var dateStr =
          d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
          ' ' +
          d.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit'
          });
        var subjText = Array.isArray(item.subjects)
          ? item.subjects
              .map(function (id) {
                return SUBJECTS[id] ? SUBJECTS[id].shortName : id;
              })
              .join(', ')
          : 'Mixed WASSCE';
        var diffLabel = DIFFICULTY_LABELS[item.difficulty] || 'Medium';
        var countryShort = 'WAEC ' + getCountryLabel(item.countryId || 'ghana');
        var modeText =
          item.mode === 'weakness_drill' ? 'Weak-Topic Drill' : 'Daily Quiz';

        var deltaText = '';
        if (idx < history.length - 1) {
          var older = history[idx + 1];
          var delta = item.percentage - older.percentage;
          if (delta > 0) deltaText = ' (+' + delta + '%)';
          else if (delta < 0) deltaText = ' (' + delta + '%)';
        }

        var weakSummary =
          item.weakLabels && item.weakLabels.length > 0
            ? 'Review: ' +
              item.weakLabels.slice(0, 2).join(', ') +
              (item.weakLabels.length > 2 ? '...' : '')
            : 'All tested topics >= 75%';

        return (
          '<div class="w-hist-item">' +
          '<div class="w-hist-left">' +
          '<span class="w-hist-date">' +
          escapeHtml(dateStr) +
          ' · ' +
          escapeHtml(modeText) +
          ' · ' +
          escapeHtml(countryShort) +
          ' · ' +
          escapeHtml(diffLabel) +
          '</span>' +
          '<span class="w-hist-mode">' +
          escapeHtml(subjText) +
          '</span>' +
          '<span class="w-hist-weaks">' +
          escapeHtml(weakSummary) +
          '</span>' +
          '</div>' +
          '<div class="w-hist-right">' +
          '<span class="w-hist-score">' +
          item.score +
          '/' +
          item.total +
          ' (' +
          item.percentage +
          '%)' +
          escapeHtml(deltaText) +
          '</span>' +
          '</div>' +
          '</div>'
        );
      })
      .join('');
  }

  // Expose read/test API for verification and programmatic access
  window.AfriWassceDailyQuiz = {
    version: '2.0.0',
    getCountries: function () {
      return Object.keys(WASSCE_COUNTRIES).map(function (k) {
        return WASSCE_COUNTRIES[k];
      });
    },
    getProgrammes: function () {
      return Object.keys(WASSCE_PROGRAMMES).map(function (k) {
        return WASSCE_PROGRAMMES[k];
      });
    },
    getSubjects: function () {
      return SUBJECT_ORDER.map(function (id) {
        return {
          id: id,
          label: SUBJECTS[id].name,
          shortLabel: SUBJECTS[id].shortName,
          countryNames: SUBJECTS[id].countryNames,
          stream: SUBJECTS[id].stream,
          topicCount: Object.keys(SUBJECTS[id].topics).length
        };
      });
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
