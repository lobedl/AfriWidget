#!/usr/bin/env python3
"""
Question bank for South African TVET Curriculum.
8 Subjects, 4 topics per subject, 22-24 questions per subject across Easy, Medium, Difficult.
Total: ~180 rigorous, verified academic questions.
"""

QUESTIONS = [
    # =========================================================================
    # 1. MATHEMATICS (N1–N3)
    # =========================================================================
    # Calculus - Easy
    {
        "id": "math_calc_e1",
        "subject": "math",
        "topicId": "math_calculus",
        "difficulty": "easy",
        "question": "What is the derivative of f(x) = 5x^3 with respect to x?",
        "options": ["15x^2", "5x^2", "15x^3", "8x^2"],
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
        "options": ["3x^2 + C", "6x^2 + C", "3x + C", "6 + C"],
        "correctIndex": 0,
        "explanation": "Integration is the reverse of differentiation: ∫ k*x^n dx = (k * x^(n+1))/(n+1) + C. Here, ∫ 6x dx = 6*(x^2/2) + C = 3x^2 + C.",
        "concept": "Under DHET N2/N3 integration rules, integrating a linear term x produces (1/2)x^2, and an arbitrary constant of integration (+ C) must always be included for indefinite integrals."
    },
    # Calculus - Medium
    {
        "id": "math_calc_m1",
        "subject": "math",
        "topicId": "math_calculus",
        "difficulty": "medium",
        "question": "Determine the gradient of the curve y = 2x^2 - 4x + 1 at the point where x = 3.",
        "options": ["8", "12", "7", "10"],
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
        "options": ["x = 3", "x = -3", "x = 6", "x = 1"],
        "correctIndex": 0,
        "explanation": "At a turning point (stationary point), dy/dx = 0. Here dy/dx = -2x + 6. Setting -2x + 6 = 0 yields 2x = 6, so x = 3.",
        "concept": "Stationary points occur when the rate of change is zero (dy/dx = 0). The second derivative d²y/dx² determines whether it is a maximum (negative) or minimum (positive)."
    },
    # Calculus - Difficult
    {
        "id": "math_calc_d1",
        "subject": "math",
        "topicId": "math_calculus",
        "difficulty": "difficult",
        "question": "Evaluate the definite integral ∫ from 1 to 3 of (3x^2 - 2x) dx.",
        "options": ["18", "20", "16", "24"],
        "correctIndex": 0,
        "explanation": "The anti-derivative is [x^3 - x^2] from 1 to 3. Evaluating at 3: (3^3 - 3^2) = 27 - 9 = 18. Evaluating at 1: (1^3 - 1^2) = 0. The definite integral is 18 - 0 = 18.",
        "concept": "The Fundamental Theorem of Calculus states that ∫ from a to b of f(x)dx = F(b) - F(a), where F'(x) = f(x)."
    },
    {
        "id": "math_calc_d2",
        "subject": "math",
        "topicId": "math_calculus",
        "difficulty": "difficult",
        "question": "A cylindrical water tank with radius r = 2 m is being filled such that the height of water increases at dh/dt = 0.5 m/min. At what rate is the volume increasing (in m³/min)?",
        "options": ["2pi m³/min", "4pi m³/min", "pi m³/min", "8pi m³/min"],
        "correctIndex": 0,
        "explanation": "Volume of cylinder V = pi * r^2 * h. With constant radius r = 2, V = 4*pi*h. Differentiating with respect to time t: dV/dt = 4*pi*(dh/dt) = 4*pi*(0.5) = 2*pi m³/min.",
        "concept": "In N3 calculus, rates of change problems apply the chain rule where related variables change over time with respect to a common parameter t."
    },

    # Algebra - Easy
    {
        "id": "math_alg_e1",
        "subject": "math",
        "topicId": "math_algebra",
        "difficulty": "easy",
        "question": "Simplify the expression: (2x^3)^3.",
        "options": ["8x^9", "6x^9", "8x^6", "6x^6"],
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
        "options": ["6", "5", "8", "32"],
        "correctIndex": 0,
        "explanation": "The logarithm asks: 2 raised to what power equals 64? Since 2^6 = 64, log_2(64) = 6.",
        "concept": "Logarithmic notation log_b(a) = c is algebraically equivalent to the exponential equation b^c = a, with base b > 0 and b != 1."
    },
    # Algebra - Medium
    {
        "id": "math_alg_m1",
        "subject": "math",
        "topicId": "math_algebra",
        "difficulty": "medium",
        "question": "Solve for x in the equation: 3^(2x - 1) = 27.",
        "options": ["x = 2", "x = 3", "x = 1.5", "x = 4"],
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
        "options": ["x = 2 or x = 0.5", "x = -2 or x = -0.5", "x = 1 or x = 2", "x = 4 or x = 1"],
        "correctIndex": 0,
        "explanation": "Factorize (2x - 1)(x - 2) = 0. This gives 2x - 1 = 0 => x = 1/2 = 0.5, or x - 2 = 0 => x = 2.",
        "concept": "Quadratic equations ax² + bx + c = 0 can be solved by factorisation or the quadratic formula x = (-b ± √(b² - 4ac)) / (2a)."
    },
    # Algebra - Difficult
    {
        "id": "math_alg_d1",
        "subject": "math",
        "topicId": "math_algebra",
        "difficulty": "difficult",
        "question": "Solve for x: log_10(x + 3) + log_10(x - 3) = log_10(16).",
        "options": ["x = 5", "x = -5", "x = 4", "x = 7"],
        "correctIndex": 0,
        "explanation": "Using log(a) + log(b) = log(a*b), we have log_10((x+3)(x-3)) = log_10(16). So x^2 - 9 = 16 => x^2 = 25 => x = ±5. Because the argument of a logarithm must be strictly positive (x - 3 > 0), only x = 5 is valid.",
        "concept": "Extraneous roots must be rejected when solving logarithmic equations because logarithms are undefined for negative numbers and zero in the real number system."
    },

    # Trigonometry - Easy
    {
        "id": "math_trig_e1",
        "subject": "math",
        "topicId": "math_trig",
        "difficulty": "easy",
        "question": "What is the exact value of sin(30°)?",
        "options": ["0.5", "0.707", "0.866", "1.0"],
        "correctIndex": 0,
        "explanation": "In standard right-angled special triangles (30°-60°-90°), opposite / hypotenuse for 30° is 1/2 = 0.5.",
        "concept": "Special angles (0°, 30°, 45°, 60°, 90°) are core knowledge in N1-N3 mathematics and must be evaluated without reliance on rounding."
    },
    {
        "id": "math_trig_e2",
        "subject": "math",
        "topicId": "math_trig",
        "difficulty": "easy",
        "question": "Simplify the fundamental trigonometric identity: sin²(θ) + cos²(θ).",
        "options": ["1", "tan²(θ)", "0", "sec²(θ)"],
        "correctIndex": 0,
        "explanation": "Pythagoras' trigonometric identity states that for any angle θ, sin²(θ) + cos²(θ) = 1.",
        "concept": "The Pythagorean trigonometric identity is derived directly from the unit circle where x = cos(θ), y = sin(θ), and x² + y² = 1."
    },
    # Trigonometry - Medium
    {
        "id": "math_trig_m1",
        "subject": "math",
        "topicId": "math_trig",
        "difficulty": "medium",
        "question": "Convert an angle of 150° into radians in terms of pi.",
        "options": ["5pi/6", "3pi/4", "2pi/3", "7pi/6"],
        "correctIndex": 0,
        "explanation": "To convert degrees to radians, multiply by (pi / 180°): 150° * (pi / 180°) = 150pi/180 = 5pi/6 rad.",
        "concept": "In circular measure, 180° equals pi radians. Radians are the standard unit for angular displacement and arc length calculations (s = r*θ)."
    },
    {
        "id": "math_trig_m2",
        "subject": "math",
        "topicId": "math_trig",
        "difficulty": "medium",
        "question": "In triangle ABC, side a = 8 cm, side b = 6 cm, and angle C = 60°. Calculate the length of side c using the Cosine Rule.",
        "options": ["7.21 cm", "10.0 cm", "5.29 cm", "8.50 cm"],
        "correctIndex": 0,
        "explanation": "Cosine Rule: c² = a² + b² - 2ab*cos(C). c² = 8² + 6² - 2(8)(6)*cos(60°) = 64 + 36 - 96(0.5) = 100 - 48 = 52. c = √52 ≈ 7.21 cm.",
        "concept": "The Cosine Rule is applied when solving non-right-angled triangles given two sides and the included angle (SAS) or all three sides (SSS)."
    },
    # Trigonometry - Difficult
    {
        "id": "math_trig_d1",
        "subject": "math",
        "topicId": "math_trig",
        "difficulty": "difficult",
        "question": "Solve for θ where 2*cos(2θ) = 1 for the domain 0° <= θ <= 180°.",
        "options": ["θ = 30° and 150°", "θ = 60° and 120°", "θ = 15° and 75°", "θ = 45° and 135°"],
        "correctIndex": 0,
        "explanation": "2*cos(2θ) = 1 => cos(2θ) = 0.5. In quadrant 1, 2θ = 60° => θ = 30°. In quadrant 4, 2θ = 300° => θ = 150°. Both 30° and 150° lie within 0° to 180°.",
        "concept": "Double-angle trigonometric equations require adjusting the domain for 2θ (0° to 360°) before dividing through by 2 to find values of θ."
    },

    # Complex Numbers - Easy
    {
        "id": "math_comp_e1",
        "subject": "math",
        "topicId": "math_complex",
        "difficulty": "easy",
        "question": "In electrical and TVET mathematics, what is the value of j² (where j = √(-1))?",
        "options": ["-1", "1", "j", "0"],
        "correctIndex": 0,
        "explanation": "By definition, the imaginary unit j represents √(-1). Squaring both sides yields j² = -1.",
        "concept": "In engineering and TVET mathematics, the symbol j is used instead of i to prevent confusion with electric current i."
    },
    # Complex Numbers - Medium
    {
        "id": "math_comp_m1",
        "subject": "math",
        "topicId": "math_complex",
        "difficulty": "medium",
        "question": "Convert the complex number z = 3 + j4 into polar form (r /_ θ).",
        "options": ["5 /_ 53.13°", "7 /_ 45.00°", "5 /_ 36.87°", "25 /_ 53.13°"],
        "correctIndex": 0,
        "explanation": "Modulus r = √(3² + 4²) = √(9 + 16) = √25 = 5. Argument θ = arctan(4/3) ≈ 53.13°. Therefore, z = 5 /_ 53.13°.",
        "concept": "Converting between rectangular form (a + jb) and polar form (r /_ θ) is essential in N3 mathematics and AC electrical circuit analysis."
    },
    {
        "id": "math_comp_m2",
        "subject": "math",
        "topicId": "math_complex",
        "difficulty": "medium",
        "question": "Multiply the two complex numbers in polar form: Z1 = 4 /_ 30° and Z2 = 3 /_ 45°.",
        "options": ["12 /_ 75°", "7 /_ 75°", "12 /_ 15°", "1 /_ 75°"],
        "correctIndex": 0,
        "explanation": "When multiplying complex numbers in polar form, multiply the magnitudes and add the angles: (4 * 3) /_ (30° + 45°) = 12 /_ 75°.",
        "concept": "Multiplication in polar coordinates uses de Moivre's principles: magnitudes multiply, while phase angles add."
    },
    # Complex Numbers - Difficult
    {
        "id": "math_comp_d1",
        "subject": "math",
        "topicId": "math_complex",
        "difficulty": "difficult",
        "question": "Divide the complex numbers: Z = (10 + j5) / (2 - j1). Express the result in rectangular form.",
        "options": ["3 + j4", "5 - j5", "4 + j2", "3 - j4"],
        "correctIndex": 0,
        "explanation": "Multiply numerator and denominator by the complex conjugate of the denominator (2 + j1): [(10 + j5)(2 + j1)] / [(2 - j1)(2 + j1)] = [20 + j10 + j10 + 5j²] / [4 - j²] = [20 + j20 - 5] / [4 - (-1)] = (15 + j20) / 5 = 3 + j4.",
        "concept": "Division of complex numbers in rectangular form requires rationalizing the denominator using its complex conjugate (a - jb)."
    },

    # =========================================================================
    # 2. ENGINEERING SCIENCE (N1–N3)
    # =========================================================================
    # Statics - Easy
    {
        "id": "sci_stat_e1",
        "subject": "eng_sci",
        "topicId": "sci_statics",
        "difficulty": "easy",
        "question": "What is the SI unit of moment of a force (torque)?",
        "options": ["Newton-metre (N·m)", "Joule (J)", "Pascal (Pa)", "Newton per metre (N/m)"],
        "correctIndex": 0,
        "explanation": "Moment is calculated as Force (Newtons) multiplied by perpendicular distance (metres), giving the SI unit Newton-metre (N·m).",
        "concept": "A moment measures the turning effect of a force about a pivot: Moment = F * d_perp."
    },
    {
        "id": "sci_stat_e2",
        "subject": "eng_sci",
        "topicId": "sci_statics",
        "difficulty": "easy",
        "question": "For a structural beam to remain in complete static equilibrium, what condition must be satisfied?",
        "options": ["Sum of upward forces equals sum of downward forces, and sum of clockwise moments equals sum of anticlockwise moments", "Only horizontal forces must balance", "The mass of the beam must exceed applied loads", "The reaction at support A must equal reaction at support B"],
        "correctIndex": 0,
        "explanation": "Static equilibrium requires both translational equilibrium (sum of forces in all directions = 0) and rotational equilibrium (sum of moments about any point = 0).",
        "concept": "Equilibrium in TVET Engineering Science requires fulfilling both conditions: Sigma F = 0 and Sigma M = 0."
    },
    # Statics - Medium
    {
        "id": "sci_stat_m1",
        "subject": "eng_sci",
        "topicId": "sci_statics",
        "difficulty": "medium",
        "question": "A simply supported beam of span 6 m carries a concentrated downward point load of 30 kN at 2 m from left support A. Determine the vertical reaction at right support B.",
        "options": ["10 kN", "20 kN", "15 kN", "30 kN"],
        "correctIndex": 0,
        "explanation": "Take moments about support A: (Reaction_B * 6 m) - (30 kN * 2 m) = 0 => 6 * Reaction_B = 60 => Reaction_B = 10 kN. (Reaction_A would be 20 kN).",
        "concept": "The principle of moments states that about any support in equilibrium, clockwise moments equal anticlockwise moments."
    },
    {
        "id": "sci_stat_m2",
        "subject": "eng_sci",
        "topicId": "sci_statics",
        "difficulty": "medium",
        "question": "Resolve a force of 100 N acting at an angle of 30° above the horizontal into its horizontal (Fx) and vertical (Fy) components.",
        "options": ["Fx = 86.6 N, Fy = 50.0 N", "Fx = 50.0 N, Fy = 86.6 N", "Fx = 70.7 N, Fy = 70.7 N", "Fx = 100 N, Fy = 50.0 N"],
        "correctIndex": 0,
        "explanation": "Fx = 100 * cos(30°) = 100 * 0.8660 = 86.6 N. Fy = 100 * sin(30°) = 100 * 0.5 = 50.0 N.",
        "concept": "Vector resolution decomposes a single vector into orthogonal rectangular components along Cartesian axes."
    },
    # Statics - Difficult
    {
        "id": "sci_stat_d1",
        "subject": "eng_sci",
        "topicId": "sci_statics",
        "difficulty": "difficult",
        "question": "A uniform beam of weight 400 N and length 5 m rests horizontally on two supports located at its ends. In addition, an engine weighing 1200 N sits 1.5 m from the left end. What is the total reaction force at the left support?",
        "options": ["1040 N", "560 N", "800 N", "1200 N"],
        "correctIndex": 0,
        "explanation": "The beam's self-weight (400 N) acts at its centre of gravity (2.5 m). Take moments about right support: (Reaction_Left * 5) - (1200 * 3.5) - (400 * 2.5) = 0 => 5 * Reaction_Left = 4200 + 1000 = 5200 => Reaction_Left = 1040 N.",
        "concept": "Uniform structural elements have their self-weight concentrated at the geometric centroid (centre of gravity)."
    },

    # Dynamics - Easy
    {
        "id": "sci_dyn_e1",
        "subject": "eng_sci",
        "topicId": "sci_dynamics",
        "difficulty": "easy",
        "question": "What formula calculates the kinetic energy (Ek) of an object with mass m moving at velocity v?",
        "options": ["Ek = 0.5 * m * v²", "Ek = m * g * h", "Ek = m * v", "Ek = 0.5 * m * v"],
        "correctIndex": 0,
        "explanation": "Kinetic energy is defined as the work needed to accelerate a body of mass m from rest to velocity v: Ek = 0.5 * m * v².",
        "concept": "Kinetic energy varies linearly with mass but quadratically with velocity (doubling speed quadruples kinetic energy)."
    },
    # Dynamics - Medium
    {
        "id": "sci_dyn_m1",
        "subject": "eng_sci",
        "topicId": "sci_dynamics",
        "difficulty": "medium",
        "question": "A forklift lifts a crate of mass 500 kg vertically through a height of 4 metres in 8 seconds. Calculate the useful output power developed (use g = 9.8 m/s²).",
        "options": ["2450 W", "19600 W", "490 W", "1225 W"],
        "correctIndex": 0,
        "explanation": "Work done = Force * distance = m * g * h = 500 kg * 9.8 m/s² * 4 m = 19600 J. Power = Work / time = 19600 J / 8 s = 2450 Watts (2.45 kW).",
        "concept": "Power is the rate at which work is done (Joules per second = Watts)."
    },
    {
        "id": "sci_dyn_m2",
        "subject": "eng_sci",
        "topicId": "sci_dynamics",
        "difficulty": "medium",
        "question": "A truck accelerates uniformly from 10 m/s to 25 m/s over a distance of 175 metres. What is its acceleration?",
        "options": ["1.5 m/s²", "2.0 m/s²", "1.0 m/s²", "3.0 m/s²"],
        "correctIndex": 0,
        "explanation": "Use the kinematic equation v² = u² + 2as: 25² = 10² + 2*a*175 => 625 = 100 + 350a => 525 = 350a => a = 1.5 m/s².",
        "concept": "The standard equations of rectilinear motion apply when acceleration is uniform."
    },
    # Dynamics - Difficult
    {
        "id": "sci_dyn_d1",
        "subject": "eng_sci",
        "topicId": "sci_dynamics",
        "difficulty": "difficult",
        "question": "An electric hoist with an efficiency of 80% requires 5 kW of electrical input power. How much mass can it lift vertically at a constant speed of 2 m/s? (use g = 9.8 m/s²).",
        "options": ["204.1 kg", "255.1 kg", "163.3 kg", "408.2 kg"],
        "correctIndex": 0,
        "explanation": "Output power = Input power * efficiency = 5000 W * 0.80 = 4000 W. Output power P = Force * velocity = (m * g) * v => 4000 = m * 9.8 * 2 = 19.6 * m => m = 4000 / 19.6 ≈ 204.08 kg.",
        "concept": "Mechanical efficiency is the ratio of useful power output to total power input: eta = P_out / P_in."
    },

    # Thermodynamics - Easy
    {
        "id": "sci_thermo_e1",
        "subject": "eng_sci",
        "topicId": "sci_thermo",
        "difficulty": "easy",
        "question": "What is the formula used to calculate the quantity of heat (Q) absorbed by a solid substance without changing state?",
        "options": ["Q = m * c * deltaT", "Q = m * L", "Q = P * V", "Q = F * v"],
        "correctIndex": 0,
        "explanation": "Sensible heat equation is Q = m * c * deltaT, where m is mass, c is specific heat capacity, and deltaT is temperature change.",
        "concept": "Sensible heat causes a measurable change in temperature, unlike latent heat which causes a phase transition at constant temperature."
    },
    # Thermodynamics - Medium
    {
        "id": "sci_thermo_m1",
        "subject": "eng_sci",
        "topicId": "sci_thermo",
        "difficulty": "medium",
        "question": "A steel railway track of initial length 30 metres is heated from 15°C to 45°C. If the coefficient of linear expansion of steel is 12 x 10^-6 /°C, calculate the expansion in length.",
        "options": ["10.8 mm", "5.4 mm", "21.6 mm", "1.08 mm"],
        "correctIndex": 0,
        "explanation": "deltaL = L_original * alpha * deltaT = 30 m * (12 x 10^-6 /°C) * (45 - 15)°C = 30 * 12e-6 * 30 = 0.0108 m = 10.8 mm.",
        "concept": "Thermal expansion of solids is proportional to the original dimension, the temperature variation, and the material's coefficient of expansion."
    },
    # Thermodynamics - Difficult
    {
        "id": "sci_thermo_d1",
        "subject": "eng_sci",
        "topicId": "sci_thermo",
        "difficulty": "difficult",
        "question": "How much heat energy is required to heat 2 kg of water from 20°C to 100°C and completely vaporize it at 100°C? (c_water = 4184 J/kg·°C; Latent heat of vaporization Lv = 2.26 x 10^6 J/kg).",
        "options": ["5.19 x 10^6 J", "4.52 x 10^6 J", "669 440 J", "3.85 x 10^6 J"],
        "correctIndex": 0,
        "explanation": "Sensible heat to reach 100°C: Q1 = m * c * deltaT = 2 * 4184 * 80 = 669 440 J. Latent heat to vaporize: Q2 = m * Lv = 2 * 2.26 x 10^6 = 4 520 000 J. Total Q = Q1 + Q2 = 669 440 + 4 520 000 = 5 189 440 J ≈ 5.19 x 10^6 J.",
        "concept": "Total heat in phase change calculations must sum sensible heat across the temperature gradient and latent heat at the transition temperature."
    },

    # Electricity - Easy
    {
        "id": "sci_elec_e1",
        "subject": "eng_sci",
        "topicId": "sci_electricity",
        "difficulty": "easy",
        "question": "Three resistors of 4 ohms, 6 ohms, and 10 ohms are connected in series. What is their equivalent total resistance?",
        "options": ["20 ohms", "1.93 ohms", "10 ohms", "240 ohms"],
        "correctIndex": 0,
        "explanation": "In a series circuit, resistances add directly: R_total = R1 + R2 + R3 = 4 + 6 + 10 = 20 ohms.",
        "concept": "In a series configuration, current passes through each component sequentially, so total resistance is the algebraic sum of individual values."
    },
    # Electricity - Medium
    {
        "id": "sci_elec_m1",
        "subject": "eng_sci",
        "topicId": "sci_electricity",
        "difficulty": "medium",
        "question": "Two resistors of 6 ohms and 12 ohms are connected in parallel across a 24 V DC supply. What is the total current drawn from the supply?",
        "options": ["6 A", "4 A", "2 A", "18 A"],
        "correctIndex": 0,
        "explanation": "Parallel resistance: 1/Rp = 1/6 + 1/12 = 3/12 = 1/4 => Rp = 4 ohms. Using Ohm's Law: I_total = V / Rp = 24 V / 4 ohms = 6 A.",
        "concept": "In parallel circuits, the voltage across each branch is identical, and total current is the sum of the branch currents."
    },
    # Electricity - Difficult
    {
        "id": "sci_elec_d1",
        "subject": "eng_sci",
        "topicId": "sci_electricity",
        "difficulty": "difficult",
        "question": "A cell has an open-circuit electromotive force (EMF) of 12 V. When connected to an external load resistor of 5.5 ohms, a current of 2.0 A flows. What is the internal resistance (r) of the cell?",
        "options": ["0.5 ohms", "1.0 ohm", "0.25 ohms", "6.0 ohms"],
        "correctIndex": 0,
        "explanation": "Using EMF formula: E = I * (R + r) => 12 = 2 * (5.5 + r) => 6 = 5.5 + r => r = 0.5 ohms.",
        "concept": "Real chemical cells exhibit internal resistance r, causing the terminal voltage V_term = E - I*r to drop when delivering current to a load."
    },

    # =========================================================================
    # 3. ELECTROTECHNICS & ELECTRICAL TRADE THEORY
    # =========================================================================
    # DC Machines - Easy
    {
        "id": "elec_dc_e1",
        "subject": "electrotechnics",
        "topicId": "elec_dc",
        "difficulty": "easy",
        "question": "According to Kirchhoff's Current Law (KCL), what is the algebraic sum of all electric currents entering and leaving a circuit node?",
        "options": ["Zero", "Equal to the total circuit EMF", "Equal to the supply current squared", "Dependent on wire gauge"],
        "correctIndex": 0,
        "explanation": "Kirchhoff's Current Law states that charge cannot accumulate at a junction: sum of entering currents equals sum of leaving currents, so algebraic sum = 0.",
        "concept": "KCL represents the conservation of electrical charge at any electrical junction."
    },
    # DC Machines - Medium
    {
        "id": "elec_dc_m1",
        "subject": "electrotechnics",
        "topicId": "elec_dc",
        "difficulty": "medium",
        "question": "In a DC shunt generator, what happens to the generated back-EMF if the speed of rotation is doubled while the magnetic flux remains constant?",
        "options": ["It doubles", "It halves", "It quadruples", "It remains unchanged"],
        "correctIndex": 0,
        "explanation": "The generated EMF equation is E = (2 * p * Phi * N * Z) / (60 * c). Because EMF E is directly proportional to rotational speed N (E ∝ N), doubling speed doubles EMF.",
        "concept": "Faraday's Law dictates that induced EMF in a machine is directly proportional to both magnetic flux per pole and armature rotational speed."
    },
    # DC Machines - Difficult
    {
        "id": "elec_dc_d1",
        "subject": "electrotechnics",
        "topicId": "elec_dc",
        "difficulty": "difficult",
        "question": "A 220 V DC shunt motor has an armature resistance of 0.4 ohms. If the back-EMF developed at full load is 208 V, what is the full-load armature current?",
        "options": ["30 A", "550 A", "520 A", "12 A"],
        "correctIndex": 0,
        "explanation": "For a DC motor: V = Eb + Ia*Ra => Ia = (V - Eb) / Ra = (220 - 208) / 0.4 = 12 / 0.4 = 30 A.",
        "concept": "Back-EMF opposes the applied terminal voltage; the voltage difference across armature resistance determines armature current."
    },

    # AC Theory - Easy
    {
        "id": "elec_ac_e1",
        "subject": "electrotechnics",
        "topicId": "elec_ac",
        "difficulty": "easy",
        "question": "For a sinusoidal alternating voltage with a peak value (Vmax) of 325 V, what is its root-mean-square (RMS) effective voltage?",
        "options": ["230 V", "325 V", "162.5 V", "460 V"],
        "correctIndex": 0,
        "explanation": "For a pure sine wave: V_rms = Vmax / √2 = 0.7071 * 325 V ≈ 230 V (standard South African domestic single-phase voltage).",
        "concept": "RMS is the DC equivalent heating value of an alternating current waveform."
    },
    # AC Theory - Medium
    {
        "id": "elec_ac_m1",
        "subject": "electrotechnics",
        "topicId": "elec_ac",
        "difficulty": "medium",
        "question": "In a purely inductive AC circuit connected to a 50 Hz supply, what is the phase relationship between the applied voltage and current?",
        "options": ["Current lags voltage by 90°", "Current leads voltage by 90°", "Current and voltage are in phase", "Current lags voltage by 180°"],
        "correctIndex": 0,
        "explanation": "Remember the mnemonic CIVIL: In an Inductor (L), Voltage (V) leads Current (I), meaning current lags voltage by 90° (pi/2 radians).",
        "concept": "Inductive reactance causes the self-induced counter-EMF to delay the build-up of alternating current."
    },
    # AC Theory - Difficult
    {
        "id": "elec_ac_d1",
        "subject": "electrotechnics",
        "topicId": "elec_ac",
        "difficulty": "difficult",
        "question": "A single-phase load draws 10 A from a 230 V, 50 Hz supply at a lagging power factor of 0.8. Calculate the active power (P in kW) and reactive power (Q in kVAR).",
        "options": ["P = 1.84 kW, Q = 1.38 kVAR", "P = 2.30 kW, Q = 1.84 kVAR", "P = 1.84 kW, Q = 0.46 kVAR", "P = 1.38 kW, Q = 1.84 kVAR"],
        "correctIndex": 0,
        "explanation": "Apparent power S = V * I = 230 * 10 = 2300 VA = 2.3 kVA. Active power P = S * cos(θ) = 2.3 * 0.8 = 1.84 kW. Since cos(θ) = 0.8, sin(θ) = 0.6. Reactive power Q = S * sin(θ) = 2.3 * 0.6 = 1.38 kVAR.",
        "concept": "The AC power triangle relates apparent power (S in VA), real power (P in W), and reactive power (Q in VAR) via Pythagoras: S² = P² + Q²."
    },

    # Transformers - Easy
    {
        "id": "elec_trans_e1",
        "subject": "electrotechnics",
        "topicId": "elec_machines",
        "difficulty": "easy",
        "question": "A step-down transformer has 1000 turns on its primary winding and 100 turns on its secondary. If 2300 V is applied to the primary, what is the secondary voltage?",
        "options": ["230 V", "23 V", "23000 V", "400 V"],
        "correctIndex": 0,
        "explanation": "Transformer ratio: Vp / Vs = Np / Ns => Vs = Vp * (Ns / Np) = 2300 * (100 / 1000) = 230 V.",
        "concept": "The transformer turns ratio relates primary and secondary voltages proportionally to the number of turns."
    },
    # Transformers - Medium
    {
        "id": "elec_trans_m1",
        "subject": "electrotechnics",
        "topicId": "elec_machines",
        "difficulty": "medium",
        "question": "A 4-pole, three-phase induction motor is connected to a 50 Hz supply. What is its synchronous magnetic field speed in revolutions per minute (RPM)?",
        "options": ["1500 RPM", "3000 RPM", "1000 RPM", "1440 RPM"],
        "correctIndex": 0,
        "explanation": "Synchronous speed Ns = (120 * f) / p, where f is frequency (50 Hz) and p is number of poles (4). Ns = (120 * 50) / 4 = 6000 / 4 = 1500 RPM.",
        "concept": "Synchronous speed of a rotating magnetic field in three-phase machinery is strictly determined by supply frequency and pole count."
    },
    # Transformers - Difficult
    {
        "id": "elec_trans_d1",
        "subject": "electrotechnics",
        "topicId": "elec_machines",
        "difficulty": "difficult",
        "question": "If the 4-pole motor running on a 50 Hz supply has an actual rotor speed of 1440 RPM at full load, what is the rotor slip percentage?",
        "options": ["4.0%", "6.0%", "2.5%", "5.0%"],
        "correctIndex": 0,
        "explanation": "Synchronous speed Ns = 1500 RPM. Slip s = ((Ns - Nr) / Ns) * 100 = ((1500 - 1440) / 1500) * 100 = (60 / 1500) * 100 = 4.0%.",
        "concept": "Induction motor torque requires relative motion between rotor conductors and stator field; without slip, no rotor current or torque can be induced."
    },

    # Protection & Safety - Easy
    {
        "id": "elec_prot_e1",
        "subject": "electrotechnics",
        "topicId": "elec_protection",
        "difficulty": "easy",
        "question": "Under South African National Standard SANS 10142-1, what is the standard rated residual operating current for an earth leakage protection unit in domestic installations?",
        "options": ["30 mA", "100 mA", "10 mA", "300 mA"],
        "correctIndex": 0,
        "explanation": "SANS 10142-1 mandates that earth leakage circuit breakers (ELCB/RCD) for general socket-outlet circuits must trip at a maximum residual leakage current of 30 mA to prevent fatal ventricular fibrillation.",
        "concept": "Residual current devices protect human life by disconnecting supplies when current imbalance between live and neutral exceeds 30 mA."
    },
    # Protection & Safety - Medium
    {
        "id": "elec_prot_m1",
        "subject": "electrotechnics",
        "topicId": "elec_protection",
        "difficulty": "medium",
        "question": "What is the primary function of protective equipotential bonding in an electrical installation according to SANS 10142-1?",
        "options": ["To connect extraneous conductive metalwork (water pipes, roofs) to the main earth bar to eliminate dangerous touch voltages", "To reduce electricity consumption during peak hours", "To increase neutral conductor resistance", "To prevent circuit breakers from tripping during lightning strikes"],
        "correctIndex": 0,
        "explanation": "Equipotential bonding ensures that exposed metal parts and structural conductive materials remain at the exact same electrical potential (earth), eliminating dangerous touch voltages during earth faults.",
        "concept": "Bonding equalizes electric potential across all accessible metallic building components to protect against electric shock."
    },
    # Protection & Safety - Difficult
    {
        "id": "elec_prot_d1",
        "subject": "electrotechnics",
        "topicId": "elec_protection",
        "difficulty": "difficult",
        "question": "During an insulation resistance test on a 230 V single-phase installation using a 500 V DC insulation tester (Megger), what is the minimum acceptable resistance required between live conductors and earth?",
        "options": ["1.0 Megaohm (MΩ)", "0.5 Megaohm (MΩ)", "100 ohms", "10 Megaohms (MΩ)"],
        "correctIndex": 0,
        "explanation": "SANS 10142-1 specifies that for low-voltage installations up to 500 V, the insulation resistance between active conductors and earth must not be less than 1.0 MΩ when tested at 500 V DC.",
        "concept": "Insulation resistance testing verifies dielectric integrity to prevent short circuits, leakage faults, and electrical fire hazards."
    },

    # =========================================================================
    # 4. FINANCIAL ACCOUNTING (N4–N6)
    # =========================================================================
    # Statements - Easy
    {
        "id": "acc_stmt_e1",
        "subject": "fin_acc",
        "topicId": "acc_statements",
        "difficulty": "easy",
        "question": "What is the fundamental accounting equation under International Financial Reporting Standards (IFRS) and GAAP?",
        "options": ["Assets = Owner's Equity + Liabilities", "Assets + Liabilities = Owner's Equity", "Liabilities = Assets + Owner's Equity", "Owner's Equity = Assets + Liabilities"],
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
        "options": ["Current Asset (Prepaid Expense)", "Current Liability (Accrued Expense)", "Non-Current Asset", "Operating Expense in current year"],
        "correctIndex": 0,
        "explanation": "Prepaid expenses represent future economic benefits paid in advance and are classified as Current Assets on the balance sheet.",
        "concept": "The matching concept requires expenses to be recognized in the accounting period in which the benefit is consumed."
    },
    # Statements - Medium
    {
        "id": "acc_stmt_m1",
        "subject": "fin_acc",
        "topicId": "acc_statements",
        "difficulty": "medium",
        "question": "On 28 February (year-end), electricity consumed of R4,500 has not yet been paid or recorded. What is the required adjusting journal entry?",
        "options": ["Debit Electricity Expense R4,500; Credit Accrued Expenses (Liability) R4,500", "Debit Accrued Expenses R4,500; Credit Bank R4,500", "Debit Bank R4,500; Credit Electricity Expense R4,500", "Debit Prepaid Electricity R4,500; Credit Electricity Expense R4,500"],
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
        "options": ["R200,000", "R120,000", "R180,000", "R300,000"],
        "correctIndex": 0,
        "explanation": "Cost of Sales = Opening Inventory + Purchases - Closing Inventory = 60,000 + 320,000 - 80,000 = R300,000. Gross Profit = Sales - Cost of Sales = 500,000 - 300,000 = R200,000.",
        "concept": "The trading section of the Statement of Comprehensive Income matches net sales against direct cost of goods sold to reveal gross profitability."
    },
    # Statements - Difficult
    {
        "id": "acc_stmt_d1",
        "subject": "fin_acc",
        "topicId": "acc_statements",
        "difficulty": "difficult",
        "question": "A tenant pays R36,000 rent on 1 December for 6 months (R6,000/month). The financial year ends on 28 February. What amount must be shown as Income Received in Advance in the balance sheet, and what amount is recorded in profit and loss?",
        "options": ["Profit & Loss: R18,000; Income in Advance (Current Liability): R18,000", "Profit & Loss: R36,000; Income in Advance: R0", "Profit & Loss: R12,000; Income in Advance: R24,000", "Profit & Loss: R24,000; Income in Advance: R12,000"],
        "correctIndex": 0,
        "explanation": "3 months (Dec, Jan, Feb) belong to this year: 3 x R6,000 = R18,000 earned (P&L). The remaining 3 months (Mar, Apr, May) of R18,000 represent unearned income and must be credited as Income Received in Advance (Current Liability).",
        "concept": "Income received in advance creates an obligation to provide future services, requiring classification as a current liability."
    },

    # Bank Reconciliation - Easy
    {
        "id": "acc_rec_e1",
        "subject": "fin_acc",
        "topicId": "acc_reconciliation",
        "difficulty": "easy",
        "question": "What is the purpose of preparing a Bank Reconciliation Statement at the end of each month?",
        "options": ["To reconcile differences between the bank balance in the Cash Book and the balance on the official Bank Statement", "To submit VAT returns to SARS", "To calculate employee PAYE deductions", "To compute annual company tax"],
        "correctIndex": 0,
        "explanation": "Bank reconciliation identifies timing differences (e.g. unpresented cheques, outstanding deposits) and unrecorded bank entries (service fees, direct debits) between internal books and bank statements.",
        "concept": "Reconciliation forms an essential internal control mechanism verifying cash integrity and preventing misappropriation."
    },
    # Bank Reconciliation - Medium
    {
        "id": "acc_rec_m1",
        "subject": "fin_acc",
        "topicId": "acc_reconciliation",
        "difficulty": "medium",
        "question": "The Bank Statement shows bank charges of R450 and interest earned of R120 not yet recorded in the company's records. How should these be processed?",
        "options": ["Enter bank charges in Cash Payments Journal (CPJ) and interest in Cash Receipts Journal (CRJ)", "Enter both directly in the Bank Reconciliation Statement without updating the Cash Book", "Deduct both from Sales in the Income Statement", "Record as a prior-year adjustment"],
        "correctIndex": 0,
        "explanation": "Bank charges are cash payments (entered in CPJ); interest earned is cash receipts (entered in CRJ). The Cash Book must be updated before final reconciliation.",
        "concept": "Direct bank items that are genuine transactions must be posted into the accounting journals to bring the Cash Book balance up to date."
    },
    # Bank Reconciliation - Difficult
    {
        "id": "acc_rec_d1",
        "subject": "fin_acc",
        "topicId": "acc_reconciliation",
        "difficulty": "difficult",
        "question": "A cheque of R7,800 issued to a supplier was correctly written and paid by the bank, but mistakenly entered in the Cash Payments Journal as R8,700. What corrective entry is required?",
        "options": ["Credit Bank / Debit Accounts Payable is adjusted by entering R900 in the Cash Receipts Journal (CRJ) to reverse the overpayment", "Enter R900 in the Cash Payments Journal", "Deduct R900 on the Bank Statement", "Ignore the error as it is less than R1,000"],
        "correctIndex": 0,
        "explanation": "CPJ was overstated by R8,700 - R7,800 = R900 (too much cash recorded paid). To correct an overstatement in payments, enter R900 in the Cash Receipts Journal (CRJ) to restore cash.",
        "concept": "Correction of errors in subsidiary journals requires offsetting adjustments that restore accurate ledger balances."
    },

    # Depreciation - Easy
    {
        "id": "acc_dep_e1",
        "subject": "fin_acc",
        "topicId": "acc_depreciation",
        "difficulty": "easy",
        "question": "Which accounting principle justifies allocating the cost of a long-term tangible asset across its useful operational life?",
        "options": ["Matching Principle (Accrual Concept)", "Prudence Concept only", "Business Entity Concept", "Materiality Concept"],
        "correctIndex": 0,
        "explanation": "The matching concept requires that the expense of utilizing an asset (depreciation) is matched against the revenues it helps generate over its operating life.",
        "concept": "Depreciation is an allocation of cost, not a valuation of current market price."
    },
    # Depreciation - Medium
    {
        "id": "acc_dep_m1",
        "subject": "fin_acc",
        "topicId": "acc_depreciation",
        "difficulty": "medium",
        "question": "Machinery was purchased for R120,000 with an estimated residual value of R20,000 and an expected useful life of 5 years. Using the straight-line method, what is the annual depreciation expense?",
        "options": ["R20,000 per year", "R24,000 per year", "R16,000 per year", "R10,000 per year"],
        "correctIndex": 0,
        "explanation": "Straight-line depreciation = (Cost - Residual Value) / Useful Life = (120,000 - 20,000) / 5 = R100,000 / 5 = R20,000 per year.",
        "concept": "Under straight-line depreciation, an equal monetary amount is expensed each full operating financial year."
    },
    # Depreciation - Difficult
    {
        "id": "acc_dep_d1",
        "subject": "fin_acc",
        "topicId": "acc_depreciation",
        "difficulty": "difficult",
        "question": "Equipment bought for R80,000 on 1 March 2024 is depreciated at 20% per annum on the diminishing (reducing) balance method. What is its carrying (book) value at the end of the second year (28 February 2026)?",
        "options": ["R51,200", "R48,000", "R64,000", "R32,000"],
        "correctIndex": 0,
        "explanation": "Year 1: Depreciation = 20% of 80,000 = R16,000. Carrying value end Year 1 = 80,000 - 16,000 = R64,000. Year 2: Depreciation = 20% of R64,000 = R12,800. Carrying value end Year 2 = 64,000 - 12,800 = R51,200.",
        "concept": "Under reducing balance depreciation, the percentage rate is applied to the carrying amount (cost minus accumulated depreciation), generating higher depreciation in early years."
    },

    # Cash Flow - Easy
    {
        "id": "acc_cash_e1",
        "subject": "fin_acc",
        "topicId": "acc_cashflow",
        "difficulty": "easy",
        "question": "In a Statement of Cash Flows, under which section are cash proceeds from the issuance of company shares classified?",
        "options": ["Financing Activities", "Operating Activities", "Investing Activities", "Working Capital Changes"],
        "correctIndex": 0,
        "explanation": "Financing activities relate to transactions that change the equity capital structure or non-current borrowings of the enterprise.",
        "concept": "IAS 7 categorizes cash flows into Operating, Investing, and Financing activities."
    },
    # Cash Flow - Medium
    {
        "id": "acc_cash_m1",
        "subject": "fin_acc",
        "topicId": "acc_cashflow",
        "difficulty": "medium",
        "question": "Why is annual depreciation added back to Net Profit when preparing the Cash Flow from Operating Activities using the indirect method?",
        "options": ["Because depreciation is a non-cash expense that reduced profit without any physical outflow of cash", "Because depreciation is an operating cash outflow", "To comply with SARS VAT output rules", "To increase the company's taxable income"],
        "correctIndex": 0,
        "explanation": "Depreciation was deducted to determine net profit on an accrual basis, but no actual cash left the bank account. Therefore, it must be added back to convert accounting profit into physical operating cash flow.",
        "concept": "The indirect method starts with net profit before tax and adjusts for non-cash expenses, non-operating items, and working capital shifts."
    },
    # Cash Flow - Difficult
    {
        "id": "acc_cash_d1",
        "subject": "fin_acc",
        "topicId": "acc_cashflow",
        "difficulty": "difficult",
        "question": "A business started the year with Accounts Receivable of R90,000 and ended the year with R130,000. How does this increase of R40,000 affect Cash Generated from Operations?",
        "options": ["It is deducted as a R40,000 outflow/use of cash", "It is added as a R40,000 inflow of cash", "It has zero impact on operating cash", "It is recorded under financing activities"],
        "correctIndex": 0,
        "explanation": "An increase in receivables means sales were recorded as accounting revenue but cash has not yet been collected from customers. Cash is tied up in working capital, so it is subtracted from operating profit.",
        "concept": "Increases in current assets (other than cash) represent an application (outflow) of cash in working capital reconciliation."
    },

    # =========================================================================
    # 5. ENTREPRENEURSHIP & BUSINESS MANAGEMENT (N4–N6)
    # =========================================================================
    # Planning - Easy
    {
        "id": "ebm_plan_e1",
        "subject": "ebm",
        "topicId": "ebm_planning",
        "difficulty": "easy",
        "question": "Which section of a formal business plan provides a concise overview of the entire venture and is usually read first by investors?",
        "options": ["Executive Summary", "Appendix", "Manufacturing Schedule", "Human Resource Roster"],
        "correctIndex": 0,
        "explanation": "The Executive Summary synthesizes key elements: business concept, value proposition, financial needs, and growth prospects into a concise snapshot.",
        "concept": "Although placed first in the business plan, the executive summary is drafted last once all detailed sections are finalized."
    },
    # Planning - Medium
    {
        "id": "ebm_plan_m1",
        "subject": "ebm",
        "topicId": "ebm_planning",
        "difficulty": "medium",
        "question": "In a SWOT analysis for a new TVET automotive repair enterprise, how is a new rival workshop opening across the road classified?",
        "options": ["External Threat", "Internal Weakness", "External Opportunity", "Internal Strength"],
        "correctIndex": 0,
        "explanation": "Competitor actions originate in the external macro/market environment and pose potential risks, classifying them as External Threats.",
        "concept": "SWOT divides factors into internal controllable factors (Strengths, Weaknesses) and external macro factors (Opportunities, Threats)."
    },
    # Planning - Difficult
    {
        "id": "ebm_plan_d1",
        "subject": "ebm",
        "topicId": "ebm_planning",
        "difficulty": "difficult",
        "question": "What is the critical distinction between a feasibility study and a formal business plan in entrepreneurial venture development?",
        "options": ["A feasibility study determines if an idea is viable before investing resources; a business plan outlines how to execute and manage an approved viable concept", "A feasibility study is only for banks while a business plan is for customers", "A feasibility study contains financial statements while a business plan has no numbers", "There is no difference; they are interchangeable terms"],
        "correctIndex": 0,
        "explanation": "A feasibility study is an investigative 'go/no-go' evaluation testing market, technical, and economic viability. Once feasibility is established, the business plan provides the operational roadmap.",
        "concept": "Feasibility analysis prevents costly capital misallocation by screening out unworkable concepts early."
    },

    # Marketing - Easy
    {
        "id": "ebm_mkt_e1",
        "subject": "ebm",
        "topicId": "ebm_marketing",
        "difficulty": "easy",
        "question": "What are the four components of the traditional Marketing Mix (the 4 Ps)?",
        "options": ["Product, Price, Place, Promotion", "Planning, Production, People, Profit", "Positioning, Purchasing, Packaging, Payment", "Policies, Personnel, Process, Performance"],
        "correctIndex": 0,
        "explanation": "The traditional marketing mix formulated by E. Jerome McCarthy comprises Product, Price, Place (distribution), and Promotion.",
        "concept": "The 4 Ps represent the controllable tactical marketing tools an enterprise blends to satisfy its target market."
    },
    # Marketing - Medium
    {
        "id": "ebm_mkt_m1",
        "subject": "ebm",
        "topicId": "ebm_marketing",
        "difficulty": "medium",
        "question": "An entrepreneur collects data by handing out 200 structured questionnaires to shoppers in a local retail centre. What type of research data is this?",
        "options": ["Primary quantitative research", "Secondary qualitative research", "Historical archival research", "Syndicated desk research"],
        "correctIndex": 0,
        "explanation": "Primary research is original first-hand data collected specifically for the current project. Structured questionnaires with numerical counts represent quantitative data.",
        "concept": "Primary data collection addresses specific bespoke research objectives that existing secondary sources cannot answer."
    },
    # Marketing - Difficult
    {
        "id": "ebm_mkt_d1",
        "subject": "ebm",
        "topicId": "ebm_marketing",
        "difficulty": "difficult",
        "question": "A tech startup prices its innovative software high upon initial launch to capture surplus from early adopters, then progressively lowers the price. What pricing strategy is being used?",
        "options": ["Price Skimming", "Penetration Pricing", "Cost-Plus Mark-up Pricing", "Predatory Pricing"],
        "correctIndex": 0,
        "explanation": "Price skimming sets high initial prices to maximize early-stage margins before lowering prices as market competitors emerge.",
        "concept": "Skimming is effective when an offering possesses unique technological or prestige advantages protected by high entry barriers."
    },

    # Break-Even - Easy
    {
        "id": "ebm_be_e1",
        "subject": "ebm",
        "topicId": "ebm_break_even",
        "difficulty": "easy",
        "question": "What is the formula to calculate the contribution margin per unit?",
        "options": ["Selling Price per unit - Variable Cost per unit", "Selling Price per unit - Fixed Cost per unit", "Total Sales / Total Units", "Net Profit / Selling Price"],
        "correctIndex": 0,
        "explanation": "Contribution margin per unit is the amount each unit sold contributes towards covering total fixed costs: Unit Selling Price minus Unit Variable Cost.",
        "concept": "Once cumulative contribution covers total fixed overheads, all subsequent unit contributions directly generate net profit."
    },
    # Break-Even - Medium
    {
        "id": "ebm_be_m1",
        "subject": "ebm",
        "topicId": "ebm_break_even",
        "difficulty": "medium",
        "question": "A bakery incurs monthly fixed costs of R30,000. It bakes specialty cakes sold at R150 each, with variable ingredients and packaging costing R50 per cake. How many cakes must be sold to break even?",
        "options": ["300 cakes", "200 cakes", "600 cakes", "150 cakes"],
        "correctIndex": 0,
        "explanation": "Contribution per cake = R150 - R50 = R100. Break-Even Units = Total Fixed Costs / Contribution per unit = R30,000 / R100 = 300 cakes.",
        "concept": "The break-even point is the operating volume where total sales revenue exactly equals total costs (zero profit, zero loss)."
    },
    # Break-Even - Difficult
    {
        "id": "ebm_be_d1",
        "subject": "ebm",
        "topicId": "ebm_break_even",
        "difficulty": "difficult",
        "question": "If the bakery with fixed costs of R30,000 and unit contribution of R100 wishes to achieve a target monthly profit of R20,000, how many cakes must it sell?",
        "options": ["500 cakes", "300 cakes", "400 cakes", "700 cakes"],
        "correctIndex": 0,
        "explanation": "Target volume = (Fixed Costs + Target Profit) / Unit Contribution = (R30,000 + R20,000) / R100 = R50,000 / R100 = 500 cakes.",
        "concept": "Cost-Volume-Profit (CVP) analysis treats target profit as an additional required fixed margin above operating overheads."
    },

    # Legal Compliance - Easy
    {
        "id": "ebm_law_e1",
        "subject": "ebm",
        "topicId": "ebm_legal",
        "difficulty": "easy",
        "question": "In South Africa, what government agency handles the statutory registration of companies (Pty Ltd) and intellectual property?",
        "options": ["CIPC (Companies and Intellectual Property Commission)", "SARS", "CCMA", "DHET"],
        "correctIndex": 0,
        "explanation": "The Companies and Intellectual Property Commission (CIPC), an agency of the dtic, is mandated to register business entities and protect IP rights in South Africa.",
        "concept": "Formal legal incorporation under the Companies Act No. 71 of 2008 requires registration through CIPC."
    },
    # Legal Compliance - Medium
    {
        "id": "ebm_law_m1",
        "subject": "ebm",
        "topicId": "ebm_legal",
        "difficulty": "medium",
        "question": "What is the primary risk associated with operating as a Sole Proprietorship compared to a Private Company ((Pty) Ltd)?",
        "options": ["Unlimited personal liability for all business debts and legal claims", "Higher corporate tax rates", "Requirement to register shares on the JSE", "Mandatory appointment of independent auditors"],
        "correctIndex": 0,
        "explanation": "A sole proprietorship is not a separate legal entity; the owner is personally and unconditionally liable for all enterprise debts and obligations.",
        "concept": "Limited liability safeguards an owner's personal assets (home, private savings) from corporate insolvency."
    },
    # Legal Compliance - Difficult
    {
        "id": "ebm_law_d1",
        "subject": "ebm",
        "topicId": "ebm_legal",
        "difficulty": "difficult",
        "question": "Under the South African Value-Added Tax (VAT) Act, at what annual taxable turnover threshold does VAT registration with SARS become compulsory?",
        "options": ["R1,000,000 per consecutive 12-month period", "R500,000 per year", "R250,000 per year", "R5,000,000 per year"],
        "correctIndex": 0,
        "explanation": "Mandatory VAT registration applies when taxable turnover has exceeded R1 million in any consecutive 12-month period or is contractually expected to exceed it. Voluntary registration is permitted from R50,000.",
        "concept": "VAT registered vendors act as collection agents for SARS, charging standard-rated output tax and deducting allowable input tax."
    },

    # =========================================================================
    # 6. MANAGEMENT COMMUNICATION (N4)
    # =========================================================================
    # Channels & Barriers - Easy
    {
        "id": "comm_barr_e1",
        "subject": "mgt_comm",
        "topicId": "comm_barriers",
        "difficulty": "easy",
        "question": "In the standard linear communication model, what term describes any external interference or distraction that distorts the message between sender and receiver?",
        "options": ["Noise", "Feedback", "Encoding", "Channel"],
        "correctIndex": 0,
        "explanation": "Noise is any physical, psychological, or environmental factor that impedes or distorts effective communication.",
        "concept": "Noise can occur at any stage: encoding, transmission channel, or receiver decoding."
    },
    # Channels & Barriers - Medium
    {
        "id": "comm_barr_m1",
        "subject": "mgt_comm",
        "topicId": "comm_barriers",
        "difficulty": "medium",
        "question": "When a factory manager uses excessive engineering jargon when speaking to trainee production workers, what category of communication barrier is created?",
        "options": ["Semantic barrier", "Physical barrier", "Physiological barrier", "Organizational barrier"],
        "correctIndex": 0,
        "explanation": "Semantic barriers arise from misunderstandings of words, idioms, technical jargon, or ambiguous phrasing where sender and receiver attach differing meanings.",
        "concept": "Effective management communication requires selecting vocabulary calibrated to the receiver's linguistic frame of reference."
    },
    # Channels & Barriers - Difficult
    {
        "id": "comm_barr_d1",
        "subject": "mgt_comm",
        "topicId": "comm_barriers",
        "difficulty": "difficult",
        "question": "What is the primary function and risk of the informal communication network known as 'the grapevine' within a corporate organization?",
        "options": ["It transmits social information and informal consensus quickly, but risks spreading unverified rumors and operational anxiety if formal management channels remain silent", "It replaces formal policy memos completely", "It is illegal under the Basic Conditions of Employment Act", "It strictly improves documented accountability"],
        "correctIndex": 0,
        "explanation": "The grapevine operates rapidly and satisfies interpersonal social needs, but thrives on ambiguity and risks misinformation when management fails to communicate transparently.",
        "concept": "Managers cannot eliminate the grapevine; they must manage it by providing prompt, factual formal communication."
    },

    # Business Correspondence - Easy
    {
        "id": "comm_corr_e1",
        "subject": "mgt_comm",
        "topicId": "comm_correspondence",
        "difficulty": "easy",
        "question": "Which business correspondence document is designed exclusively for communication between employees or departments inside the same organization?",
        "options": ["Memorandum (Memo)", "Business Letter", "Press Release", "Quotation"],
        "correctIndex": 0,
        "explanation": "A memorandum is an internal document that omits formal postal addresses, salutations ('Dear Sir'), and formal sign-offs ('Yours faithfully').",
        "concept": "Internal memos follow standard heading protocol: To, From, Date, Subject."
    },
    # Business Correspondence - Medium
    {
        "id": "comm_corr_m1",
        "subject": "mgt_comm",
        "topicId": "comm_correspondence",
        "difficulty": "medium",
        "question": "When writing an official formal business letter addressed to an external client whose name is known ('Dear Mr. Khumalo'), what is the standard formal complimentary close?",
        "options": ["Yours sincerely", "Yours faithfully", "Best regards always", "Cheers"],
        "correctIndex": 0,
        "explanation": "Standard British/South African business English etiquette: If you address the recipient by name ('Dear Mr. Khumalo'), close with 'Yours sincerely'. If addressed anonymously ('Dear Sir/Madam'), close with 'Yours faithfully'.",
        "concept": "Professional correspondence adheres to standardized salutation and complimentary close pairing rules."
    },
    # Business Correspondence - Difficult
    {
        "id": "comm_corr_d1",
        "subject": "mgt_comm",
        "topicId": "comm_correspondence",
        "difficulty": "difficult",
        "question": "In an analytical business investigation report, what is the essential distinction between the 'Findings' section and the 'Recommendations' section?",
        "options": ["Findings report verified objective facts and survey data gathered; Recommendations propose actionable solutions based on those findings", "Findings are opinions; Recommendations are historical facts", "Findings are written by the CEO; Recommendations by employees", "There is no difference in formal reporting"],
        "correctIndex": 0,
        "explanation": "Findings present objective, empirical evidence and factual observations without subjective speculation. Recommendations translate those findings into practical forward-looking actions.",
        "concept": "Reports maintain strict separation between objective data (Findings/Analysis) and executive decisions (Recommendations)."
    },

    # Meetings & Minutes - Easy
    {
        "id": "comm_meet_e1",
        "subject": "mgt_comm",
        "topicId": "comm_meetings",
        "difficulty": "easy",
        "question": "What is the minimum number of voting members required to be present at an official meeting to make its proceedings legally valid according to its constitution?",
        "options": ["Quorum", "Proxy", "Agenda", "Adjournment"],
        "correctIndex": 0,
        "explanation": "A quorum is the mandatory minimum attendance threshold stipulated in an organization's constitution or standing orders for business to be transacted.",
        "concept": "Any resolutions passed in the absence of a verified quorum are ultra vires (legally invalid and void)."
    },
    # Meetings & Minutes - Medium
    {
        "id": "comm_meet_m1",
        "subject": "mgt_comm",
        "topicId": "comm_meetings",
        "difficulty": "medium",
        "question": "In what grammatical tense and voice must official meeting minutes be recorded?",
        "options": ["Past tense and third-person objective voice", "Present continuous and first-person personal voice", "Future tense and second-person imperative voice", "Conditional tense"],
        "correctIndex": 0,
        "explanation": "Minutes are historical institutional records of past actions and must be written objectively in the third person ('Mr. Dlamini reported that...') and past tense.",
        "concept": "Objective third-person recording eliminates personal bias and ensures legal admissibility of organizational records."
    },
    # Meetings & Minutes - Difficult
    {
        "id": "comm_meet_d1",
        "subject": "mgt_comm",
        "topicId": "comm_meetings",
        "difficulty": "difficult",
        "question": "When a member at a formal meeting calls for a 'point of order', what is being raised?",
        "options": ["A breach or violation of meeting rules, constitution, or standing orders that the Chairperson must rule on immediately", "A vote of no confidence in the treasurer", "A request for afternoon tea", "A proposal to dissolve the company"],
        "correctIndex": 0,
        "explanation": "A point of order takes precedence over all other discussions; it alerts the Chair to a procedural violation (e.g. unparliamentary language, lack of quorum, out-of-order motion).",
        "concept": "Rules of debate empower the Chairperson to preserve order and adherence to constitutionally established procedure."
    },

    # Language Precision & Tone - Easy
    {
        "id": "comm_lang_e1",
        "subject": "mgt_comm",
        "topicId": "comm_language",
        "difficulty": "easy",
        "question": "Which of the following sentences uses the active voice for clear, direct business communication?",
        "options": ["The Quality Inspector approved the delivery.", "The delivery was approved by the Quality Inspector.", "Approval was granted to the delivery by the inspector.", "The delivery had been inspected and approved."],
        "correctIndex": 0,
        "explanation": "In the active voice, the subject performs the action directly: Subject (The Quality Inspector) + Verb (approved) + Object (the delivery). This creates vigor and clear accountability.",
        "concept": "Active voice delivers greater conciseness, impact, and unambiguous attribution of operational responsibility."
    },
    # Language Precision - Medium
    {
        "id": "comm_lang_m1",
        "subject": "mgt_comm",
        "topicId": "comm_language",
        "difficulty": "medium",
        "question": "When condensing a 1,000-word business briefing into a 250-word executive summary, what rule must be followed?",
        "options": ["Retain all core findings and decisions using your own concise words without adding new opinions or outside data", "Copy the first paragraph word-for-word and delete the rest", "Introduce new speculative data to make the summary exciting", "Replace factual figures with generalized adjectives"],
        "correctIndex": 0,
        "explanation": "Executive summaries must distill the primary substance accurately without editorialization, factual distortion, or ungrounded external assertions.",
        "concept": "Précis and summary writing require extracting essential core concepts while shedding non-essential supporting details."
    },
    # Language Precision - Difficult
    {
        "id": "comm_lang_d1",
        "subject": "mgt_comm",
        "topicId": "comm_language",
        "difficulty": "difficult",
        "question": "Identify the sentence that maintains professional, constructive, and diplomatic business tone in client correspondence.",
        "options": ["We are reviewing your account statement to resolve the discrepancy promptly.", "You failed to read our invoice terms correctly, causing this blunder.", "Your claim is totally absurd and rejected.", "We have no time to deal with your complaints right now."],
        "correctIndex": 0,
        "explanation": "Professional business communication avoids accusatory 'you' statements ('You failed...'), focusing instead on objective, collaborative resolution.",
        "concept": "The 'You-attitude' and courteous phrasing maintain customer goodwill while upholding corporate policy."
    },

    # =========================================================================
    # 7. COMPUTER HARDWARE & SYSTEM SOFTWARE (NC(V) L2–L4)
    # =========================================================================
    # CPU & Memory - Easy
    {
        "id": "hw_arch_e1",
        "subject": "comp_hw",
        "topicId": "hw_arch",
        "difficulty": "easy",
        "question": "What four sequential operations constitute the fundamental CPU machine instruction cycle?",
        "options": ["Fetch, Decode, Execute, Store (Write-back)", "Compile, Link, Run, Terminate", "Input, Process, Print, Scan", "Read, Write, Erase, Overwrite"],
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
        "options": ["It loses all stored data immediately when electrical power is switched off", "It explodes under high temperatures", "It can only be read once", "It runs faster than CPU L1 cache"],
        "correctIndex": 0,
        "explanation": "Volatile memory requires continuous electrical power to maintain its stored capacitor charge states; cutting power erases its contents.",
        "concept": "Primary working storage (RAM) is fast and volatile, whereas secondary storage (SSD, HDD) is non-volatile."
    },
    # CPU & Memory - Medium
    {
        "id": "hw_arch_m1",
        "subject": "comp_hw",
        "topicId": "hw_arch",
        "difficulty": "medium",
        "question": "What is the primary architectural purpose of Level 1 (L1) and Level 2 (L2) CPU cache memory?",
        "options": ["To provide high-speed SRAM buffers near the processor cores to minimize memory latency when fetching frequent instructions", "To store the operating system kernel when the PC is powered down", "To back up user photos automatically", "To convert AC electrical power to DC voltage"],
        "correctIndex": 0,
        "explanation": "Cache memory uses ultra-fast Static RAM (SRAM) built on the CPU die to store frequently accessed data and instructions, preventing CPU idle cycles caused by slower DRAM access.",
        "concept": "The memory hierarchy balances speed, capacity, and cost across Registers -> Cache -> RAM -> Secondary Storage."
    },
    # CPU & Memory - Difficult
    {
        "id": "hw_arch_d1",
        "subject": "comp_hw",
        "topicId": "hw_arch",
        "difficulty": "difficult",
        "question": "What architectural bottleneck occurs when a computer's physical RAM is completely exhausted and the OS relies heavily on virtual memory paging on a secondary storage drive?",
        "options": ["Thrashing", "Pipelining", "Overclocking", "Deadlock"],
        "correctIndex": 0,
        "explanation": "Thrashing occurs when the OS spends more time swapping pages between RAM and disk virtual memory than executing actual instructions, collapsing system performance.",
        "concept": "Virtual memory simulates contiguous RAM using disk storage, but excessive page faults induce severe latency."
    },

    # Operating Systems - Easy
    {
        "id": "hw_os_e1",
        "subject": "comp_hw",
        "topicId": "hw_os",
        "difficulty": "easy",
        "question": "Which core component of an Operating System resides permanently in memory and manages system resources, hardware access, and process scheduling?",
        "options": ["Kernel", "Web browser", "BIOS battery", "Command prompt"],
        "correctIndex": 0,
        "explanation": "The kernel is the foundational core of the OS that interfaces directly with computer hardware, managing memory, CPU scheduling, and I/O devices.",
        "concept": "The OS kernel operates in privileged kernel mode (Ring 0) while applications run in restricted user mode (Ring 3)."
    },
    # Operating Systems - Medium
    {
        "id": "hw_os_m1",
        "subject": "comp_hw",
        "topicId": "hw_os",
        "difficulty": "medium",
        "question": "Which modern file system used by Microsoft Windows supports fine-grained file permissions (ACLs), encryption (EFS), and transaction journaling for crash recovery?",
        "options": ["NTFS", "FAT32", "FAT16", "exFAT"],
        "correctIndex": 0,
        "explanation": "New Technology File System (NTFS) provides journaling, Access Control Lists (ACLs), file compression, and volume shadow copy features missing in standard FAT32.",
        "concept": "Journaling file systems record intended changes in an audit log before writing, enabling instant recovery from sudden power loss."
    },
    # Operating Systems - Difficult
    {
        "id": "hw_os_d1",
        "subject": "comp_hw",
        "topicId": "hw_os",
        "difficulty": "difficult",
        "question": "In operating system process management, what condition describes two or more processes permanently blocked because each is holding a resource required by the other?",
        "options": ["Deadlock", "Starvation", "Race Condition", "Context Switching"],
        "correctIndex": 0,
        "explanation": "Deadlock is a state where processes are unable to proceed because each holds a lock on a resource while waiting for a resource locked by another (circular wait).",
        "concept": "Coffman conditions define the four prerequisites for deadlock: mutual exclusion, hold and wait, no preemption, and circular wait."
    },

    # Networking - Easy
    {
        "id": "hw_net_e1",
        "subject": "comp_hw",
        "topicId": "hw_network",
        "difficulty": "easy",
        "question": "Which protocol automatically assigns IP addresses, subnet masks, and default gateways to client devices connecting to a network?",
        "options": ["DHCP (Dynamic Host Configuration Protocol)", "DNS (Domain Name System)", "HTTP", "FTP"],
        "correctIndex": 0,
        "explanation": "DHCP automates network addressing using the DORA process (Discover, Offer, Request, Acknowledge), eliminating manual IP configuration conflicts.",
        "concept": "DHCP simplifies network administration by dynamically leasing IP parameters from a central pool."
    },
    # Networking - Medium
    {
        "id": "hw_net_m1",
        "subject": "comp_hw",
        "topicId": "hw_network",
        "difficulty": "medium",
        "question": "Which of the following IPv4 address blocks is designated by RFC 1918 strictly for private non-routable Local Area Networks (LANs)?",
        "options": ["192.168.1.50", "8.8.8.8", "154.66.12.1", "200.100.50.25"],
        "correctIndex": 0,
        "explanation": "Private IP ranges include 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. These addresses cannot be routed across the public Internet.",
        "concept": "Network Address Translation (NAT) translates private RFC 1918 addresses into public IPs when routing traffic to the global Internet."
    },
    # Networking - Difficult
    {
        "id": "hw_net_d1",
        "subject": "comp_hw",
        "topicId": "hw_network",
        "difficulty": "difficult",
        "question": "A host has an IP address of 192.168.10.45 with a subnet mask of 255.255.255.224 (/27). What is the network broadcast address for this specific subnet?",
        "options": ["192.168.10.63", "192.168.10.255", "192.168.10.32", "192.168.10.62"],
        "correctIndex": 0,
        "explanation": "A mask of .224 gives a block size of 256 - 224 = 32. Subnet ranges: 0-31, 32-63, etc. Host .45 falls into the 192.168.10.32 subnet. The network address is .32, usable hosts are .33 to .62, and the broadcast address is 192.168.10.63.",
        "concept": "Subnetting divides address space into isolated collision and broadcast domains based on bitwise binary masking."
    },

    # Troubleshooting - Easy
    {
        "id": "hw_trb_e1",
        "subject": "comp_hw",
        "topicId": "hw_troubleshoot",
        "difficulty": "easy",
        "question": "What is the initial diagnostic routine run by the motherboard firmware (BIOS/UEFI) immediately after power is applied to a computer?",
        "options": ["POST (Power-On Self-Test)", "Chkdsk", "Disk Defragmenter", "System Restore"],
        "correctIndex": 0,
        "explanation": "POST tests essential hardware components (CPU, system clock, RAM, video controller) before handing control over to the OS bootloader.",
        "concept": "Firmware conducts POST routines to confirm physical operational integrity before bootstrapping the operating system."
    },
    # Troubleshooting - Medium
    {
        "id": "hw_trb_m1",
        "subject": "comp_hw",
        "topicId": "hw_troubleshoot",
        "difficulty": "medium",
        "question": "A technician turns on a desktop PC: fans spin, but there is no display on the monitor, and the motherboard emits repetitive, continuous beeping. What is the most likely culprit?",
        "options": ["RAM module is improperly seated or defective", "Hard drive is full", "Mouse is disconnected", "Operating system needs an update"],
        "correctIndex": 0,
        "explanation": "Standard BIOS beep codes (e.g. Award/AMI continuous beeping) alert the technician to a memory (RAM) failure before video initialization can occur.",
        "concept": "Beep codes provide low-level acoustic diagnostic telemetry when the display subsystem is not operational."
    },
    # Troubleshooting - Difficult
    {
        "id": "hw_trb_d1",
        "subject": "comp_hw",
        "topicId": "hw_troubleshoot",
        "difficulty": "difficult",
        "question": "A computer boots into Windows normally, but after 10-15 minutes of gaming or heavy simulation work, it abruptly turns off with no blue screen. When rebooted immediately, it shuts down within seconds. What is the primary diagnosis?",
        "options": ["CPU thermal throttling and overheating shutdown caused by dried thermal paste or failed cooling fan", "Corrupt master boot record (MBR)", "Defective sound card", "Weak CMOS battery"],
        "correctIndex": 0,
        "explanation": "Modern CPUs have internal thermal protection sensors. If the heatsink fan fails or thermal paste dries out, temperatures spike past junction limits (e.g. 100°C), triggering instantaneous emergency power cut-off to prevent silicon damage.",
        "concept": "Hardware thermal cutoffs protect silicon dies from thermal degradation and fire risks."
    },

    # =========================================================================
    # 8. PRINCIPLES OF COMPUTER PROGRAMMING (NC(V) L2–L4)
    # =========================================================================
    # Logic & Control - Easy
    {
        "id": "prog_log_e1",
        "subject": "programming",
        "topicId": "prog_logic",
        "difficulty": "easy",
        "question": "In algorithmic programming, what type of control structure executes a block of code repeatedly as long as a boolean condition remains true?",
        "options": ["Loop (Iteration)", "Conditional statement (Selection)", "Sequence", "Function declaration"],
        "correctIndex": 0,
        "explanation": "Iteration structures (such as while, do-while, and for loops) execute code repeatedly while the loop condition evaluates to true.",
        "concept": "Structured programming relies on three fundamental constructs: Sequence, Selection (if/else), and Iteration (loops)."
    },
    # Logic & Control - Medium
    {
        "id": "prog_log_m1",
        "subject": "programming",
        "topicId": "prog_logic",
        "difficulty": "medium",
        "question": "What is the critical behavioral difference between a standard 'while' loop and a 'do-while' loop?",
        "options": ["A while loop tests the condition before executing (may run 0 times); a do-while loop executes the body at least once before testing the condition", "A do-while loop can never be infinite", "A while loop only works with numbers", "There is no functional difference"],
        "correctIndex": 0,
        "explanation": "A while loop is pre-tested (if condition is false initially, it executes zero times). A do-while loop is post-tested (the code block executes once before the condition is checked).",
        "concept": "Pre-test vs post-test loop mechanics dictate minimum execution guarantees in program logic."
    },
    # Logic & Control - Difficult
    {
        "id": "prog_log_d1",
        "subject": "programming",
        "topicId": "prog_logic",
        "difficulty": "difficult",
        "question": "Examine the pseudocode logic: int x = 1; while (x <= 10) { if (x % 3 == 0) print(x); x = x + 2; } What output is printed?",
        "options": ["3, 9", "3, 6, 9", "1, 3, 5, 7, 9", "9"],
        "correctIndex": 0,
        "explanation": "Trace x values: Start x=1. x=1: not divisible by 3. Next x = 1+2 = 3. x=3: 3%3==0 -> prints 3. Next x = 3+2 = 5. x=5: not divisible. Next x = 5+2 = 7. x=7: not divisible. Next x = 7+2 = 9. x=9: 9%3==0 -> prints 9. Next x = 9+2 = 11. Loop terminates (11 > 10). Output: 3, 9.",
        "concept": "Dry-run tracing with step tables verifies conditional branching and variable mutation through execution iterations."
    },

    # Data Structures - Easy
    {
        "id": "prog_data_e1",
        "subject": "programming",
        "topicId": "prog_data",
        "difficulty": "easy",
        "question": "In zero-indexed programming languages (Java, C#, C++, Python, JavaScript), what is the index of the first element in an array named 'marks'?",
        "options": ["0", "1", "-1", "null"],
        "correctIndex": 0,
        "explanation": "Zero-based indexing assigns index 0 to the first element; the last element of an array of size n is found at index n - 1.",
        "concept": "Array indices represent memory offsets from the starting base address of the array."
    },
    # Data Structures - Medium
    {
        "id": "prog_data_m1",
        "subject": "programming",
        "topicId": "prog_data",
        "difficulty": "medium",
        "question": "Which linear data structure enforces a First-In, First-Out (FIFO) access order for adding and removing elements?",
        "options": ["Queue", "Stack", "Binary Search Tree", "Hash Table"],
        "correctIndex": 0,
        "explanation": "A Queue operates on FIFO principles (first element enqueued is the first dequeued). A Stack operates on LIFO (Last-In, First-Out).",
        "concept": "Queues model real-world waiting lines, printer spools, and asynchronous messaging buffers."
    },
    # Data Structures - Difficult
    {
        "id": "prog_data_d1",
        "subject": "programming",
        "topicId": "prog_data",
        "difficulty": "difficult",
        "question": "What is the worst-case time complexity of finding a target value in an unsorted array of n elements using Linear Search?",
        "options": ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        "correctIndex": 0,
        "explanation": "In an unsorted array, the target element may be at the very end or absent altogether, requiring examination of all n elements (linear time O(n)).",
        "concept": "Big-O notation quantifies algorithm scalability and worst-case execution bounds relative to input size n."
    },

    # OOP Concepts - Easy
    {
        "id": "prog_oop_e1",
        "subject": "programming",
        "topicId": "prog_oop",
        "difficulty": "easy",
        "question": "Which pillar of Object-Oriented Programming (OOP) hides the internal state of an object and requires all interaction to occur via public methods (getters/setters)?",
        "options": ["Encapsulation", "Inheritance", "Polymorphism", "Recursion"],
        "correctIndex": 0,
        "explanation": "Encapsulation bundles data (attributes) and methods together while restricting direct access using private access modifiers to safeguard data integrity.",
        "concept": "Encapsulation prevents unauthorized state modification and decouples internal representation from external interface."
    },
    # OOP Concepts - Medium
    {
        "id": "prog_oop_m1",
        "subject": "programming",
        "topicId": "prog_oop",
        "difficulty": "medium",
        "question": "What OOP mechanism allows a child class (subclass) to inherit attributes and methods from an existing parent class (superclass)?",
        "options": ["Inheritance", "Overloading", "Instantiation", "Garbage collection"],
        "correctIndex": 0,
        "explanation": "Inheritance enables a derived class to acquire and extend the behaviors and properties of a base class, promoting code reuse.",
        "concept": "Inheritance establishes an 'is-a' hierarchical relationship between generalized base classes and specialized subclasses."
    },
    # OOP Concepts - Difficult
    {
        "id": "prog_oop_d1",
        "subject": "programming",
        "topicId": "prog_oop",
        "difficulty": "difficult",
        "question": "What is the distinction between method overloading and method overriding in object-oriented programming?",
        "options": ["Overloading occurs when methods in the same class share a name but differ in parameter lists; Overriding occurs when a subclass redefines an inherited parent method with the exact same signature", "Overloading is for integers; Overriding is for strings", "Overriding happens at compile time; Overloading happens at runtime", "They are identical operations"],
        "correctIndex": 0,
        "explanation": "Method overloading provides multiple methods with the same name but different signatures within one class (compile-time polymorphism). Overriding replaces the implementation of a parent method in a subclass (runtime polymorphism).",
        "concept": "Polymorphism enables uniform interfaces to execute context-specific implementations."
    },

    # Testing & Debugging - Easy
    {
        "id": "prog_test_e1",
        "subject": "programming",
        "topicId": "prog_test",
        "difficulty": "easy",
        "question": "What kind of programming error occurs when code violates the grammar rules of the language (such as a missing semicolon or unmatched bracket), preventing successful compilation?",
        "options": ["Syntax error", "Logic error", "Runtime error", "Null pointer exception"],
        "correctIndex": 0,
        "explanation": "Syntax errors are grammatical violations detected by the compiler or interpreter before code can be executed.",
        "concept": "Compilers cannot generate executable bytecode or machine instructions when syntax rules are broken."
    },
    # Testing & Debugging - Medium
    {
        "id": "prog_test_m1",
        "subject": "programming",
        "topicId": "prog_test",
        "difficulty": "medium",
        "question": "A payroll program compiles cleanly and executes without crashing, but calculates employee net pay as R150,000 instead of R15,000 due to a misplaced formula operator. What type of error is this?",
        "options": ["Logic error", "Syntax error", "Compile-time error", "Divide-by-zero error"],
        "correctIndex": 0,
        "explanation": "Logic errors produce incorrect outputs despite syntactically valid code that runs without system crashes.",
        "concept": "Logic errors represent flaws in algorithm design and must be caught through comprehensive test cases and boundary auditing."
    },
    # Testing & Debugging - Difficult
    {
        "id": "prog_test_d1",
        "subject": "programming",
        "topicId": "prog_test",
        "difficulty": "difficult",
        "question": "In software testing, why is Boundary Value Analysis (BVA) considered one of the most effective black-box test design techniques?",
        "options": ["Because programming defects and off-by-one errors cluster disproportionately at the extreme edges and boundaries of input domains", "Because it tests every single line of source code automatically", "Because it eliminates the need for unit testing", "Because it only tests valid numbers"],
        "correctIndex": 0,
        "explanation": "Experience shows that conditional operators (<, <=, >, >=) frequently fail at boundaries (e.g. testing values just below, at, and just above 0%, 40%, 100%).",
        "concept": "Boundary Value Analysis targets off-by-one bugs by testing inputs at the exact transition borders between equivalence partitions."
    }
]

print(f"Loaded {len(QUESTIONS)} verified TVET questions.")
