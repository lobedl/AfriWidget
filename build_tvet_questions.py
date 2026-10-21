# Python generator for 240 verified South African TVET curriculum questions
import json

QUESTIONS = []

def add_q(id, subjectId, programmeId, level, topicId, topicName, difficulty, question, options, correctIndex, explanation):
    assert len(options) == 4, f"Options count must be 4: {id}"
    assert 0 <= correctIndex <= 3, f"Invalid correctIndex: {id}"
    assert len(set(options)) == 4, f"Duplicate options in {id}"
    assert question.strip(), f"Empty question: {id}"
    assert explanation.strip(), f"Empty explanation: {id}"
    QUESTIONS.append({
        "id": id,
        "subjectId": subjectId,
        "programmeId": programmeId,
        "level": level,
        "topicId": topicId,
        "topicName": topicName,
        "difficulty": difficulty,
        "question": question,
        "options": options,
        "correctIndex": correctIndex,
        "explanation": explanation
    })

# =========================================================================
# 1. NATED MATHEMATICS (N1-N6)
# =========================================================================

# --- EASY (10 questions) ---
add_q(
    "math_e1", "maths", "nated_eng", "all", "diff_calc", "Differential Calculus & Derivatives", "easy",
    "What is the first derivative of the algebraic function f(x) = 5x^3 - 4x^2 + 7x - 9 with respect to x?",
    ["15x^2 - 8x + 7", "15x^3 - 8x^2 + 7", "5x^2 - 4x + 7", "15x^2 - 4x"],
    0,
    "Applying the power rule d/dx(a*x^n) = n*a*x^(n-1): d/dx(5x^3) = 15x^2, d/dx(-4x^2) = -8x, d/dx(7x) = 7, and the derivative of a constant (-9) is 0. Thus f'(x) = 15x^2 - 8x + 7."
)
add_q(
    "math_e2", "maths", "nated_eng", "all", "diff_calc", "Differential Calculus & Derivatives", "easy",
    "What is the derivative of the trigonometric function y = sin(3x) with respect to x?",
    ["3*cos(3x)", "-3*cos(3x)", "cos(3x)", "(1/3)*cos(3x)"],
    0,
    "Using the chain rule: d/dx[sin(u)] = cos(u) * du/dx. Here u = 3x, so du/dx = 3. Therefore, d/dx[sin(3x)] = 3*cos(3x)."
)
add_q(
    "math_e3", "maths", "nated_eng", "all", "int_calc", "Integral Calculus & Integration by Parts", "easy",
    "What is the indefinite integral of the function f(x) = 6x^2 + 4x - 5 with respect to x?",
    ["2x^3 + 2x^2 - 5x + C", "3x^3 + 4x^2 - 5x + C", "12x + 4 + C", "2x^3 + x^2 - 5x + C"],
    0,
    "Using the power rule of integration integral(x^n dx) = (x^(n+1))/(n+1): integral(6x^2 dx) = 6*(x^3/3) = 2x^3; integral(4x dx) = 4*(x^2/2) = 2x^2; integral(-5 dx) = -5x. Adding the constant of integration yields 2x^3 + 2x^2 - 5x + C."
)
add_q(
    "math_e4", "maths", "nated_eng", "all", "int_calc", "Integral Calculus & Integration by Parts", "easy",
    "What is the integral of the standard exponential term e^(4x) with respect to x?",
    ["(1/4)*e^(4x) + C", "4*e^(4x) + C", "e^(4x) + C", "(1/4)*e^(3x) + C"],
    0,
    "For any constant k != 0, integral(e^(kx) dx) = (1/k)*e^(kx) + C. With k = 4, the integral is (1/4)*e^(4x) + C."
)
add_q(
    "math_e5", "maths", "nated_eng", "all", "complex_trig", "Complex Numbers & De Moivre Theorem", "easy",
    "In electrical engineering and NATED mathematics, what is the value of the imaginary unit operator j^2?",
    ["-1", "1", "0", "-j"],
    0,
    "In engineering mathematics, j represents the imaginary unit sqrt(-1). By fundamental definition, j^2 = (sqrt(-1))^2 = -1."
)
add_q(
    "math_e6", "maths", "nated_eng", "all", "complex_trig", "Complex Numbers & De Moivre Theorem", "easy",
    "What is the modulus (magnitude) r of the complex number z = 3 + 4j?",
    ["5", "7", "25", "1"],
    0,
    "The modulus r of a complex number z = a + bj is given by r = sqrt(a^2 + b^2). Here r = sqrt(3^2 + 4^2) = sqrt(9 + 16) = sqrt(25) = 5."
)
add_q(
    "math_e7", "maths", "nated_eng", "all", "algebra_series", "Binomial Expansion & Partial Fractions", "easy",
    "How many terms exist in the full binomial expansion of (x + y)^6?",
    ["7 terms", "6 terms", "5 terms", "12 terms"],
    0,
    "For any positive integer power n, the binomial expansion of (a + b)^n contains exactly (n + 1) terms. For n = 6, there are 6 + 1 = 7 terms."
)
add_q(
    "math_e8", "maths", "nated_eng", "all", "algebra_series", "Binomial Expansion & Partial Fractions", "easy",
    "Which algebraic form is suitable for setting up partial fractions for 5 / ((x - 2)(x + 3))?",
    ["A / (x - 2) + B / (x + 3)", "(Ax + B) / ((x - 2)(x + 3))", "A / (x - 2)^2 + B / (x + 3)", "A / x + B / (x - 2)"],
    0,
    "When the denominator consists of distinct linear factors (x - a) and (x - b), the standard partial fraction decomposition uses single constants over each linear factor: A/(x - 2) + B/(x + 3)."
)
add_q(
    "math_e9", "maths", "nated_eng", "all", "diff_equations", "First-Order Differential Equations", "easy",
    "What is the order of the differential equation dy/dx + 4y = 8x?",
    ["First order", "Second order", "Zero order", "Third order"],
    0,
    "The order of a differential equation is determined by the highest derivative present. Since dy/dx is the first derivative, this is a first-order differential equation."
)
add_q(
    "math_e10", "maths", "nated_eng", "all", "diff_calc", "Differential Calculus & Derivatives", "easy",
    "At a local turning point (maximum or minimum) of a smooth curve y = f(x), what is the numerical value of the gradient dy/dx?",
    ["0", "1", "-1", "Infinity"],
    0,
    "At any stationary or turning point, the tangent to the curve is perfectly horizontal, meaning the first derivative (gradient) dy/dx equals 0."
)

# --- MEDIUM (10 questions) ---
add_q(
    "math_m1", "maths", "nated_eng", "all", "diff_calc", "Differential Calculus & Derivatives", "medium",
    "Using the product rule d/dx[u*v] = u'*v + u*v', what is the derivative of y = x^2 * ln(x)?",
    ["x * (2*ln(x) + 1)", "2x / x", "2x * ln(x)", "x^2 / x"],
    0,
    "Let u = x^2 (so u' = 2x) and v = ln(x) (so v' = 1/x). Applying the product rule: y' = 2x*ln(x) + x^2*(1/x) = 2x*ln(x) + x = x*(2*ln(x) + 1)."
)
add_q(
    "math_m2", "maths", "nated_eng", "all", "diff_calc", "Differential Calculus & Derivatives", "medium",
    "What is the gradient of the curve y = 2x^3 - 5x + 4 at the specific point where x = 2?",
    ["19", "12", "14", "24"],
    0,
    "Differentiating gives dy/dx = 6x^2 - 5. Substituting x = 2: dy/dx = 6(2^2) - 5 = 6(4) - 5 = 24 - 5 = 19."
)
add_q(
    "math_m3", "maths", "nated_eng", "all", "int_calc", "Integral Calculus & Integration by Parts", "medium",
    "Evaluate the definite integral integral from 1 to 3 of (4x - 1) dx.",
    ["14", "16", "12", "10"],
    0,
    "The antiderivative is 2x^2 - x. Evaluating at bounds: Upper bound (x=3): 2(3^2) - 3 = 18 - 3 = 15. Lower bound (x=1): 2(1^2) - 1 = 2 - 1 = 1. Value = 15 - 1 = 14."
)
add_q(
    "math_m4", "maths", "nated_eng", "all", "int_calc", "Integral Calculus & Integration by Parts", "medium",
    "Using the substitution method u = x^2 + 3, what is the integral of 2x * sqrt(x^2 + 3) dx?",
    ["(2/3)*(x^2 + 3)^(3/2) + C", "(1/2)*(x^2 + 3)^(3/2) + C", "(3/2)*(x^2 + 3)^(1/2) + C", "(x^2 + 3)^2 + C"],
    0,
    "Let u = x^2 + 3, then du = 2x dx. The integral transforms into integral(u^(1/2) du) = (u^(3/2)) / (3/2) + C = (2/3)*u^(3/2) + C = (2/3)*(x^2 + 3)^(3/2) + C."
)
add_q(
    "math_m5", "maths", "nated_eng", "all", "complex_trig", "Complex Numbers & De Moivre Theorem", "medium",
    "According to De Moivre's theorem, what is the simplified polar form of [2(cos 30° + j sin 30°)]^3?",
    ["8(cos 90° + j sin 90°)", "6(cos 90° + j sin 90°)", "8(cos 30° + j sin 30°)", "2(cos 90° + j sin 90°)"],
    0,
    "De Moivre's theorem states [r(cos theta + j sin theta)]^n = r^n * (cos(n*theta) + j sin(n*theta)). Here r^3 = 2^3 = 8 and 3 * 30° = 90°. Hence 8(cos 90° + j sin 90°)."
)
add_q(
    "math_m6", "maths", "nated_eng", "all", "complex_trig", "Complex Numbers & De Moivre Theorem", "medium",
    "What is the complex conjugate of the impedance Z = 12 - 5j ohms?",
    ["12 + 5j ohms", "-12 - 5j ohms", "-12 + 5j ohms", "5 - 12j ohms"],
    0,
    "The complex conjugate of a number z = a + bj is formed by changing the sign of the imaginary component: z* = a - bj. For 12 - 5j, the conjugate is 12 + 5j."
)
add_q(
    "math_m7", "maths", "nated_eng", "all", "algebra_series", "Binomial Expansion & Partial Fractions", "medium",
    "In the expansion of (1 + 2x)^5, what is the numerical coefficient of the x^2 term?",
    ["40", "20", "10", "80"],
    0,
    "The general term is C(5, 2) * (1)^3 * (2x)^2. C(5, 2) = 10. (2x)^2 = 4x^2. The coefficient is 10 * 4 = 40."
)
add_q(
    "math_m8", "maths", "nated_eng", "all", "diff_equations", "First-Order Differential Equations", "medium",
    "Solve the separable differential equation dy/dx = 3x^2 * y for y in terms of x.",
    ["y = A * e^(x^3)", "y = x^3 + C", "y = A * e^(3x)", "ln(y) = 6x + C"],
    0,
    "Separating variables: (1/y) dy = 3x^2 dx. Integrating both sides: ln|y| = x^3 + c. Exponentiating both sides: y = e^(x^3 + c) = e^c * e^(x^3) = A * e^(x^3)."
)
add_q(
    "math_m9", "maths", "nated_eng", "all", "diff_calc", "Differential Calculus & Derivatives", "medium",
    "If the displacement s of a machine component is given by s(t) = 4t^3 - 6t^2 + 2t, what is its acceleration at t = 2 seconds?",
    ["36 m/s^2", "48 m/s^2", "26 m/s^2", "12 m/s^2"],
    0,
    "Velocity is v(t) = ds/dt = 12t^2 - 12t + 2. Acceleration is a(t) = dv/dt = 24t - 12. At t = 2: a(2) = 24(2) - 12 = 48 - 12 = 36 m/s^2."
)
add_q(
    "math_m10", "maths", "nated_eng", "all", "int_calc", "Integral Calculus & Integration by Parts", "medium",
    "What is the result of using integration by parts on integral(x * e^x dx)?",
    ["x * e^x - e^x + C", "x * e^x + e^x + C", "(1/2)x^2 * e^x + C", "e^x - x + C"],
    0,
    "Let u = x (du = dx) and dv = e^x dx (v = e^x). Formula: integral(u dv) = u*v - integral(v du) = x*e^x - integral(e^x dx) = x*e^x - e^x + C."
)

# --- DIFFICULT (10 questions) ---
add_q(
    "math_d1", "maths", "nated_eng", "all", "diff_calc", "Differential Calculus & Derivatives", "difficult",
    "Using implicit differentiation on the relation x^2 + y^2 - 6xy = 0, what is dy/dx in terms of x and y?",
    ["(3y - x) / (y - 3x)", "(x - 3y) / (3x - y)", "(2x - 6y) / (6x - 2y)", "(6y - 2x) / (2y)"],
    0,
    "Differentiating implicitly: 2x + 2y*(dy/dx) - 6(1*y + x*(dy/dx)) = 0 -> 2x - 6y + (2y - 6x)*(dy/dx) = 0. Rearranging: (2y - 6x)*(dy/dx) = 6y - 2x. Dividing by 2: (y - 3x)*(dy/dx) = 3y - x -> dy/dx = (3y - x) / (y - 3x)."
)
add_q(
    "math_d2", "maths", "nated_eng", "all", "int_calc", "Integral Calculus & Integration by Parts", "difficult",
    "Evaluate the area enclosed between the parabola y = 4 - x^2 and the x-axis (from x = -2 to x = 2).",
    ["32/3 square units (approx 10.67)", "16 square units", "8/3 square units", "24 square units"],
    0,
    "The area is integral from -2 to 2 of (4 - x^2) dx. By symmetry = 2 * integral from 0 to 2 of (4 - x^2) dx = 2 * [4x - x^3/3] from 0 to 2 = 2 * [8 - 8/3] = 2 * (16/3) = 32/3."
)
add_q(
    "math_d3", "maths", "nated_eng", "all", "complex_trig", "Complex Numbers & De Moivre Theorem", "difficult",
    "What are the two square roots of the complex number z = -8j in polar form?",
    ["sqrt(8)/_-45° and sqrt(8)/_135°", "8/_90° and 8/_270°", "4/_0° and -4/_180°", "2*sqrt(2)/_45° and 2*sqrt(2)/_-45°"],
    0,
    "In polar form, -8j has modulus r = 8 and argument theta = -90° (or 270°). The roots have modulus sqrt(8) = 2*sqrt(2). The arguments are theta/2 = -45° and (-45° + 180°) = 135°."
)
add_q(
    "math_d4", "maths", "nated_eng", "all", "diff_equations", "First-Order Differential Equations", "difficult",
    "For the linear first-order differential equation dy/dx + (2/x)*y = 4x, what is the integrating factor I(x)?",
    ["x^2", "2*ln(x)", "e^(2x)", "x"],
    0,
    "The integrating factor for dy/dx + P(x)y = Q(x) is I(x) = e^(integral P(x) dx). Here P(x) = 2/x, so integral(2/x dx) = 2*ln(x) = ln(x^2). Therefore I(x) = e^(ln(x^2)) = x^2."
)
add_q(
    "math_d5", "maths", "nated_eng", "all", "diff_calc", "Differential Calculus & Derivatives", "difficult",
    "A cylindrical holding tank with an open top has a fixed volume of 54*pi m^3. What radius r minimizes the required surface area of sheet metal?",
    ["3 meters", "6 meters", "2.5 meters", "4.5 meters"],
    0,
    "Volume V = pi*r^2*h = 54*pi, so h = 54/r^2. Open top area A = pi*r^2 + 2*pi*r*h = pi*r^2 + 2*pi*r*(54/r^2) = pi*r^2 + 108*pi/r. dA/dr = 2*pi*r - 108*pi/r^2 = 0 -> 2*r = 108/r^2 -> r^3 = 54/2 = 27 -> r = 3 meters."
)
add_q(
    "math_d6", "maths", "nated_eng", "all", "algebra_series", "Binomial Expansion & Partial Fractions", "difficult",
    "Decompose (3x + 11) / (x^2 - x - 6) into partial fractions.",
    ["4 / (x - 3) - 1 / (x + 2)", "3 / (x - 3) + 2 / (x + 2)", "5 / (x - 3) - 2 / (x + 2)", "1 / (x - 3) + 4 / (x + 2)"],
    0,
    "Factor denominator: (x - 3)(x + 2). Set up A/(x - 3) + B/(x + 2) = (3x + 11)/((x - 3)(x + 2)) -> 3x + 11 = A(x + 2) + B(x - 3). If x = 3: 9 + 11 = 5A -> 20 = 5A -> A = 4. If x = -2: -6 + 11 = -5B -> 5 = -5B -> B = -1. Result: 4/(x - 3) - 1/(x + 2)."
)
add_q(
    "math_d7", "maths", "nated_eng", "all", "int_calc", "Integral Calculus & Integration by Parts", "difficult",
    "What is the integral of x * cos(x) dx evaluated using integration by parts?",
    ["x * sin(x) + cos(x) + C", "x * sin(x) - cos(x) + C", "-x * sin(x) + cos(x) + C", "cos(x) - x*sin(x) + C"],
    0,
    "Let u = x (du = dx) and dv = cos(x) dx (v = sin(x)). Formula: u*v - integral(v du) = x*sin(x) - integral(sin(x) dx) = x*sin(x) - (-cos(x)) + C = x*sin(x) + cos(x) + C."
)
add_q(
    "math_d8", "maths", "nated_eng", "all", "diff_calc", "Differential Calculus & Derivatives", "difficult",
    "What is the second derivative d^2y/dx^2 of the function y = e^(2x) * cos(x)?",
    ["e^(2x) * (3*cos(x) - 4*sin(x))", "e^(2x) * (4*cos(x) - sin(x))", "4*e^(2x) * cos(x)", "e^(2x) * (2*cos(x) - 2*sin(x))"],
    0,
    "First derivative: y' = 2*e^(2x)*cos(x) - e^(2x)*sin(x) = e^(2x)*(2*cos(x) - sin(x)). Differentiating again: y'' = 2*e^(2x)*(2*cos(x) - sin(x)) + e^(2x)*(-2*sin(x) - cos(x)) = e^(2x)*(4*cos(x) - 2*sin(x) - 2*sin(x) - cos(x)) = e^(2x)*(3*cos(x) - 4*sin(x))."
)
add_q(
    "math_d9", "maths", "nated_eng", "all", "diff_equations", "First-Order Differential Equations", "difficult",
    "In an electrical circuit with resistance R and inductance L, the current i(t) satisfies L*(di/dt) + R*i = V. What is the time constant tau of this system?",
    ["L / R", "R / L", "R * L", "sqrt(L / R)"],
    0,
    "Rewriting in standard first-order form: di/dt + (R/L)*i = V/L. The exponential decay or rise factor is e^(-(R/L)*t) = e^(-t/tau), proving that the characteristic time constant tau = L / R seconds."
)
add_q(
    "math_d10", "maths", "nated_eng", "all", "complex_trig", "Complex Numbers & De Moivre Theorem", "difficult",
    "Convert the impedance quotient Z = (10 + 10j) / (3 - j) ohms into standard rectangular form a + bj.",
    ["2 + 4j ohms", "4 + 2j ohms", "5 + 5j ohms", "1 + 3j ohms"],
    0,
    "Multiply numerator and denominator by the conjugate (3 + j): Denominator = 3^2 + (-1)^2 = 9 + 1 = 10. Numerator = (10 + 10j)(3 + j) = 30 + 10j + 30j + 10j^2 = 30 + 40j - 10 = 20 + 40j. Dividing by 10 gives 2 + 4j ohms."
)

print(f"Loaded {len(QUESTIONS)} maths questions.")

# =========================================================================
# 2. NATED ENGINEERING SCIENCE (N1-N4)
# =========================================================================

# --- EASY (10 questions) ---
add_q(
    "sci_e1", "eng_science", "nated_eng", "all", "statics_moments", "Statics, Moments & Equilibrium", "easy",
    "What is the SI unit of force in engineering science?",
    ["Newton (N)", "Joule (J)", "Watt (W)", "Pascal (Pa)"],
    0,
    "The standard SI unit of force is the Newton (N), defined as the force required to accelerate a 1-kilogram mass at a rate of 1 meter per second squared (1 N = 1 kg*m/s^2)."
)
add_q(
    "sci_e2", "eng_science", "nated_eng", "all", "statics_moments", "Statics, Moments & Equilibrium", "easy",
    "How is the moment of a force about a given fulcrum calculated mathematically?",
    ["Force multiplied by perpendicular distance (F * d)", "Force divided by distance (F / d)", "Mass multiplied by acceleration (m * a)", "Force multiplied by velocity (F * v)"],
    0,
    "The moment of a force measures its turning tendency about a point and equals the magnitude of the force multiplied by the perpendicular distance from the line of action to the pivot: M = F * d (measured in N*m)."
)
add_q(
    "sci_e3", "eng_science", "nated_eng", "all", "dynamics_motion", "Dynamics, Work, Energy & Power", "easy",
    "What is the formula used to calculate the kinetic energy (Ek) of a moving body?",
    ["Ek = 0.5 * m * v^2", "Ek = m * g * h", "Ek = m * v", "Ek = F * s"],
    0,
    "Kinetic energy is the energy possessed by a body due to its motion and is calculated by Ek = 0.5 * m * v^2, where m is mass in kilograms and v is linear velocity in m/s (expressed in Joules)."
)
add_q(
    "sci_e4", "eng_science", "nated_eng", "all", "dynamics_motion", "Dynamics, Work, Energy & Power", "easy",
    "A machine performs 12,000 Joules of mechanical work in 20 seconds. What is its power output?",
    ["600 Watts", "240 Watts", "6,000 Watts", "240,000 Watts"],
    0,
    "Power is the rate at which work is done: P = Work / Time = 12,000 J / 20 s = 600 W (or 0.6 kW)."
)
add_q(
    "sci_e5", "eng_science", "nated_eng", "all", "hydraulics", "Hydraulics & Hydrostatic Pressure", "easy",
    "According to Pascal's principle, how is pressure applied to an enclosed liquid transmitted?",
    ["Equally and undiminished in all directions", "Only in the downward direction toward the base", "Proportionally to the velocity of the pump", "Only along the walls of the vessel"],
    0,
    "Pascal's principle states that an external pressure applied to a confined static fluid is transmitted equally and undiminished in all directions throughout the fluid and to the walls of its container."
)
add_q(
    "sci_e6", "eng_science", "nated_eng", "all", "hydraulics", "Hydraulics & Hydrostatic Pressure", "easy",
    "What is the hydrostatic gauge pressure at a depth of 10 meters in fresh water (density = 1,000 kg/m^3, g = 9.8 m/s^2)?",
    ["98,000 Pa (98 kPa)", "9,800 Pa", "980 Pa", "980,000 Pa"],
    0,
    "Hydrostatic pressure P = rho * g * h = 1,000 kg/m^3 * 9.8 m/s^2 * 10 m = 98,000 Pa = 98 kPa."
)
add_q(
    "sci_e7", "eng_science", "nated_eng", "all", "thermodynamics", "Thermodynamics & Thermal Expansion", "easy",
    "What is the equivalent temperature in Kelvin (K) of 27 degrees Celsius (°C)?",
    ["300 K", "273 K", "246 K", "327 K"],
    0,
    "Absolute temperature in Kelvin is calculated by adding 273.15 (commonly rounded to 273 in TVET calculations) to the Celsius value: T(K) = 27 + 273 = 300 K."
)
add_q(
    "sci_e8", "eng_science", "nated_eng", "all", "thermodynamics", "Thermodynamics & Thermal Expansion", "easy",
    "Which method of heat transfer does not require a material medium and can travel through a vacuum?",
    ["Radiation", "Conduction", "Convection", "Advection"],
    0,
    "Thermal radiation transfers heat through electromagnetic waves (infrared) and does not require any physical particles or material medium, allowing it to travel through a vacuum (such as solar energy through space)."
)
add_q(
    "sci_e9", "eng_science", "nated_eng", "all", "electricity_dc", "Electricity & Kirchhoff Laws", "easy",
    "According to Ohm's law, what happens to the current in a pure resistive circuit if the applied voltage is doubled while resistance remains constant?",
    ["The current doubles", "The current is halved", "The current quadruples", "The current remains unchanged"],
    0,
    "Ohm's law states I = V / R. If voltage V is multiplied by 2 and resistance R remains constant, current I is directly proportional and also doubles."
)
add_q(
    "sci_e10", "eng_science", "nated_eng", "all", "electricity_dc", "Electricity & Kirchhoff Laws", "easy",
    "Three resistors of 10 ohms, 20 ohms, and 30 ohms are connected in series. What is the total equivalent resistance?",
    ["60 ohms", "5.45 ohms", "30 ohms", "180 ohms"],
    0,
    "In a series circuit, total resistance is the direct arithmetic sum of individual resistances: R_total = R1 + R2 + R3 = 10 + 20 + 30 = 60 ohms."
)

# --- MEDIUM (10 questions) ---
add_q(
    "sci_m1", "eng_science", "nated_eng", "all", "statics_moments", "Statics, Moments & Equilibrium", "medium",
    "A simply supported horizontal beam of length 6 meters carries a single concentrated load of 60 kN positioned 2 meters from the left support. What is the vertical reaction at the right support?",
    ["20 kN", "40 kN", "30 kN", "15 kN"],
    0,
    "Taking moments about the left support (anticlockwise = clockwise): R_right * 6 m = 60 kN * 2 m -> 6 * R_right = 120 -> R_right = 20 kN. (The left support reaction is 60 - 20 = 40 kN)."
)
add_q(
    "sci_m2", "eng_science", "nated_eng", "all", "statics_moments", "Statics, Moments & Equilibrium", "medium",
    "Two perpendicular forces of 30 N acting east and 40 N acting north act on a single point. What is the magnitude of the resultant force?",
    ["50 N", "70 N", "10 N", "1,200 N"],
    0,
    "By Pythagoras theorem for orthogonal forces: R = sqrt(Fx^2 + Fy^2) = sqrt(30^2 + 40^2) = sqrt(900 + 1,600) = sqrt(2,500) = 50 N."
)
add_q(
    "sci_m3", "eng_science", "nated_eng", "all", "dynamics_motion", "Dynamics, Work, Energy & Power", "medium",
    "A vehicle accelerates uniformly from rest to a velocity of 25 m/s over a distance of 125 meters. What is its linear acceleration?",
    ["2.5 m/s^2", "5.0 m/s^2", "1.25 m/s^2", "10 m/s^2"],
    0,
    "Using the motion equation v^2 = u^2 + 2as with u = 0: 25^2 = 0 + 2 * a * 125 -> 625 = 250a -> a = 625 / 250 = 2.5 m/s^2."
)
add_q(
    "sci_m4", "eng_science", "nated_eng", "all", "dynamics_motion", "Dynamics, Work, Energy & Power", "medium",
    "A crane lifts an 800 kg load vertically through a height of 15 meters in 12 seconds. Calculate the useful power expended (g = 9.8 m/s^2).",
    ["9.8 kW (9,800 W)", "12.0 kW", "6.5 kW", "117.6 kW"],
    0,
    "Work done = m * g * h = 800 kg * 9.8 m/s^2 * 15 m = 117,600 J. Power = Work / Time = 117,600 J / 12 s = 9,800 W = 9.8 kW."
)
add_q(
    "sci_m5", "eng_science", "nated_eng", "all", "hydraulics", "Hydraulics & Hydrostatic Pressure", "medium",
    "In a hydraulic press, the input plunger has an area of 0.005 m^2 and the output ram has an area of 0.25 m^2. If a force of 200 N is exerted on the plunger, what load can the ram lift?",
    ["10,000 N (10 kN)", "5,000 N", "1,000 N", "25,000 N"],
    0,
    "By Pascal's principle: F1 / A1 = F2 / A2 -> F2 = F1 * (A2 / A1) = 200 N * (0.25 / 0.005) = 200 * 50 = 10,000 N = 10 kN."
)
add_q(
    "sci_m6", "eng_science", "nated_eng", "all", "thermodynamics", "Thermodynamics & Thermal Expansion", "medium",
    "How much thermal energy is required to heat 4 kg of copper from 20°C to 80°C if the specific heat capacity of copper is 390 J/(kg*°C)?",
    ["93,600 Joules (93.6 kJ)", "124,800 Joules", "31,200 Joules", "15,600 Joules"],
    0,
    "Using Q = m * c * delta_T: delta_T = 80 - 20 = 60°C. Q = 4 kg * 390 J/(kg*°C) * 60°C = 93,600 J = 93.6 kJ."
)
add_q(
    "sci_m7", "eng_science", "nated_eng", "all", "thermodynamics", "Thermodynamics & Thermal Expansion", "medium",
    "A steel rail is 30 meters long at 15°C. What is its expansion when heated to 45°C if the linear expansion coefficient of steel is 12 x 10^-6 /°C?",
    ["10.8 mm (0.0108 m)", "5.4 mm", "21.6 mm", "1.08 mm"],
    0,
    "Linear expansion delta_L = L0 * alpha * delta_T = 30 m * (12 x 10^-6 /°C) * (45 - 15)°C = 30 * 12 x 10^-6 * 30 = 0.0108 m = 10.8 mm."
)
add_q(
    "sci_m8", "eng_science", "nated_eng", "all", "electricity_dc", "Electricity & Kirchhoff Laws", "medium",
    "Two resistors of 20 ohms and 30 ohms are connected in parallel across a 60 V DC power supply. What is the total supply current?",
    ["5 Amperes", "1.2 Amperes", "2 Amperes", "25 Amperes"],
    0,
    "Equivalent parallel resistance R_p = (R1 * R2) / (R1 + R2) = (20 * 30) / (20 + 30) = 600 / 50 = 12 ohms. Supply current I = V / R_p = 60 V / 12 ohms = 5 A."
)
add_q(
    "sci_m9", "eng_science", "nated_eng", "all", "dynamics_motion", "Dynamics, Work, Energy & Power", "medium",
    "A constant horizontal force of 150 N pulls a 50 kg metal crate across a rough floor at a constant velocity. What is the magnitude of the opposing frictional force?",
    ["150 N", "50 N", "490 N", "0 N"],
    0,
    "When a body moves at constant velocity, its acceleration is zero (a = 0). According to Newton's first law, net horizontal force = 0, which means the frictional force must exactly balance the applied force of 150 N."
)
add_q(
    "sci_m10", "eng_science", "nated_eng", "all", "electricity_dc", "Electricity & Kirchhoff Laws", "medium",
    "A battery has an open-circuit electromotive force (EMF) of 12 V and an internal resistance of 0.5 ohms. When connected to a 5.5 ohm load resistor, what is the terminal voltage?",
    ["11.0 Volts", "12.0 Volts", "6.0 Volts", "10.5 Volts"],
    0,
    "Total circuit resistance R_tot = R_load + r_int = 5.5 + 0.5 = 6.0 ohms. Current I = E / R_tot = 12 / 6 = 2 A. Internal voltage drop V_drop = I * r = 2 * 0.5 = 1 V. Terminal voltage V = E - V_drop = 12 - 1 = 11.0 V."
)

# --- DIFFICULT (10 questions) ---
add_q(
    "sci_d1", "eng_science", "nated_eng", "all", "statics_moments", "Statics, Moments & Equilibrium", "difficult",
    "A 100 kg mass rests on a rough ramp inclined at 30° to the horizontal. If the coefficient of static friction mu is 0.4, does the body slide down on its own (g = 9.8 m/s^2)?",
    ["Yes, because tan(30°) = 0.577 which exceeds mu = 0.4", "No, because the weight force is smaller than the normal force", "No, because static friction always prevents sliding on angles under 45°", "Yes, but only if external kinetic energy is added"],
    0,
    "A block on an incline slides freely when the angle of inclination theta exceeds the angle of friction phi, where tan(phi) = mu. Here tan(30°) ≈ 0.577. Since 0.577 > 0.4, the component of gravity down the slope (mg sin 30° = 490 N) exceeds maximum static friction (mu * mg cos 30° = 0.4 * 848.7 N = 339.5 N), causing it to slide."
)
add_q(
    "sci_d2", "eng_science", "nated_eng", "all", "statics_moments", "Statics, Moments & Equilibrium", "difficult",
    "A uniform 8-meter beam weighing 400 N is hinged at a vertical wall and supported horizontally by a cable at the outer end angled at 30° to the beam. What is the tension in the cable?",
    ["400 N", "800 N", "200 N", "346.4 N"],
    0,
    "Taking moments about the wall hinge: The beam's weight acts at its center of gravity (4 m from hinge). Clockwise moment = 400 N * 4 m = 1,600 N*m. The cable acts at 8 m with vertical component T * sin(30°). Anticlockwise moment = (T * sin 30°) * 8 m = T * 0.5 * 8 = 4T. Equating: 4T = 1,600 -> T = 400 N."
)
add_q(
    "sci_d3", "eng_science", "nated_eng", "all", "dynamics_motion", "Dynamics, Work, Energy & Power", "difficult",
    "A 1,200 kg vehicle traveling at 20 m/s brakes to a complete stop over a distance of 40 meters on a level road. What average braking force was exerted on the vehicle?",
    ["6,000 N (6 kN)", "12,000 N", "4,800 N", "24,000 N"],
    0,
    "By the work-energy theorem: Work done by friction = initial kinetic energy. F_brake * distance = 0.5 * m * v^2 -> F * 40 m = 0.5 * 1,200 kg * (20 m/s)^2 = 600 * 400 = 240,000 J. F_brake = 240,000 / 40 = 6,000 N."
)
add_q(
    "sci_d4", "eng_science", "nated_eng", "all", "hydraulics", "Hydraulics & Hydrostatic Pressure", "difficult",
    "A multi-stage hydraulic press with 85% mechanical efficiency requires 150 kJ of work to be done on the plunger to compress an industrial bale. How much useful work does the output ram perform?",
    ["127.5 kJ", "150 kJ", "176.5 kJ", "112.5 kJ"],
    0,
    "Efficiency eta = (Useful Work Output / Work Input) * 100%. Useful Work Output = Input Work * eta = 150 kJ * 0.85 = 127.5 kJ. The remaining 22.5 kJ is dissipated as heat through hydraulic friction and seal resistance."
)
add_q(
    "sci_d5", "eng_science", "nated_eng", "all", "thermodynamics", "Thermodynamics & Thermal Expansion", "difficult",
    "An ideal gas occupies 0.08 m^3 at a pressure of 200 kPa and temperature of 300 K. If it is compressed isothermally (constant temperature) to a volume of 0.02 m^3, what is its new pressure?",
    ["800 kPa", "400 kPa", "50 kPa", "1,600 kPa"],
    0,
    "By Boyle's law for an isothermal process (constant temperature): P1 * V1 = P2 * V2 -> 200 kPa * 0.08 m^3 = P2 * 0.02 m^3 -> 16 = 0.02 * P2 -> P2 = 16 / 0.02 = 800 kPa."
)
add_q(
    "sci_d6", "eng_science", "nated_eng", "all", "electricity_dc", "Electricity & Kirchhoff Laws", "difficult",
    "In an electrical circuit network, three branches meet at node X with currents I1 = 8 A entering and I2 = 3 A entering. What is the current I3 leaving node X?",
    ["11 A leaving", "5 A leaving", "24 A leaving", "8 A leaving"],
    0,
    "Kirchhoff's Current Law (KCL) based on conservation of charge states that the algebraic sum of currents entering a node equals the sum leaving: Sum(I_in) = Sum(I_out) -> 8 A + 3 A = I3 -> I3 = 11 A leaving."
)
add_q(
    "sci_d7", "eng_science", "nated_eng", "all", "thermodynamics", "Thermodynamics & Thermal Expansion", "difficult",
    "An aluminum transmission line has a length of 1,200 meters at -5°C on a winter morning. By afternoon, the temperature rises to 35°C. What is the increase in length (alpha for aluminum = 23 x 10^-6 /°C)?",
    ["1.104 meters", "0.828 meters", "2.208 meters", "0.552 meters"],
    0,
    "Temperature change delta_T = 35 - (-5) = 40°C. Linear expansion delta_L = L0 * alpha * delta_T = 1,200 m * (23 x 10^-6 /°C) * 40°C = 1,200 * 0.00092 = 1.104 meters."
)
add_q(
    "sci_d8", "eng_science", "nated_eng", "all", "dynamics_motion", "Dynamics, Work, Energy & Power", "difficult",
    "A 2 kg metal projectile moving horizontally at 150 m/s embeds itself into an initially stationary 28 kg wooden target suspended on cables. What is the common velocity of the combined mass immediately after impact?",
    ["10 m/s", "15 m/s", "5 m/s", "20 m/s"],
    0,
    "By the law of conservation of momentum: m1*u1 + m2*u2 = (m1 + m2)*v. (2 kg * 150 m/s) + (28 kg * 0) = (2 + 28)*v -> 300 = 30v -> v = 300 / 30 = 10 m/s."
)
add_q(
    "sci_d9", "eng_science", "nated_eng", "all", "statics_moments", "Statics, Moments & Equilibrium", "difficult",
    "Three coplanar forces acting at a point are in static equilibrium. The angle between Force A (60 N) and Force B is 90°. According to Lami's theorem and the triangle of forces, what is the magnitude of the balancing Force C if Force B is 80 N?",
    ["100 N", "140 N", "20 N", "70 N"],
    0,
    "When three forces are in equilibrium, they form a closed vector triangle. Since A and B are mutually perpendicular (at 90°), the resultant of A and B is R = sqrt(60^2 + 80^2) = sqrt(3,600 + 6,400) = sqrt(10,000) = 100 N. The balancing force C must be equal in magnitude and opposite in direction: |C| = 100 N."
)
add_q(
    "sci_d10", "eng_science", "nated_eng", "all", "hydraulics", "Hydraulics & Hydrostatic Pressure", "difficult",
    "Water flows through a horizontal pipe that constricts from a cross-sectional area of 0.04 m^2 to 0.01 m^2. If the water velocity in the wide section is 2 m/s, what is its velocity in the narrow constricted section?",
    ["8 m/s", "4 m/s", "0.5 m/s", "16 m/s"],
    0,
    "By the principle of continuity for an incompressible fluid: Q = A1 * v1 = A2 * v2 -> 0.04 m^2 * 2 m/s = 0.01 m^2 * v2 -> 0.08 = 0.01 * v2 -> v2 = 0.08 / 0.01 = 8 m/s."
)

print(f"Loaded {len(QUESTIONS)} questions so far (Maths + Science).")

# =========================================================================
# 3. NATED ELECTROTECHNICS & ELECTRICAL TRADE THEORY (N1-N4)
# =========================================================================

# --- EASY (10 questions) ---
add_q(
    "elec_e1", "electrotechnics", "nated_eng", "all", "dc_networks", "DC Networks & Resistor Theorems", "easy",
    "What is the mathematical equation representing electrical power P in terms of voltage V and current I?",
    ["P = V * I", "P = V / I", "P = I^2 / R", "P = V^2 * R"],
    0,
    "Electrical power consumed by a direct current circuit is the product of voltage and current: P = V * I (measured in Watts)."
)
add_q(
    "elec_e2", "electrotechnics", "nated_eng", "all", "dc_networks", "DC Networks & Resistor Theorems", "easy",
    "What instrument is strictly connected in parallel across a component to measure electrical potential difference?",
    ["Voltmeter", "Ammeter", "Series Ohmmeter", "Current transformer"],
    0,
    "A voltmeter possesses very high internal impedance and must always be connected in parallel across the two points between which potential difference is being measured to avoid drawing noticeable current."
)
add_q(
    "elec_e3", "electrotechnics", "nated_eng", "all", "ac_theory", "AC Circuits, Reactance & Power Factor", "easy",
    "What is the standard alternating current frequency supplied by Eskom in the South African national grid?",
    ["50 Hertz (Hz)", "60 Hertz (Hz)", "100 Hertz (Hz)", "25 Hertz (Hz)"],
    0,
    "South Africa, following British and IEC standards, utilizes a nominal grid frequency of 50 Hz (50 cycles per second) for single-phase and three-phase alternating current power."
)
add_q(
    "elec_e4", "electrotechnics", "nated_eng", "all", "ac_theory", "AC Circuits, Reactance & Power Factor", "easy",
    "What is the relationship between the root-mean-square (RMS) voltage and peak voltage (V_peak) for a pure sinusoidal waveform?",
    ["V_rms = 0.707 * V_peak", "V_rms = 1.414 * V_peak", "V_rms = 0.637 * V_peak", "V_rms = 0.5 * V_peak"],
    0,
    "For a pure sine wave, the effective or RMS voltage equals V_peak divided by sqrt(2): V_rms = V_peak / sqrt(2) ≈ 0.707 * V_peak."
)
add_q(
    "elec_e5", "electrotechnics", "nated_eng", "all", "transformers", "Transformers & Turns Ratio", "easy",
    "What is the function of an electrical step-down transformer?",
    ["It decreases voltage while increasing current proportionally", "It increases voltage while decreasing current", "It converts alternating current into direct current", "It increases electrical frequency"],
    0,
    "A step-down transformer has fewer turns on the secondary winding than the primary winding (Ns < Np), which steps down the secondary voltage while proportionally stepping up current capacity (Vp/Vs = Is/Ip)."
)
add_q(
    "elec_e6", "electrotechnics", "nated_eng", "all", "transformers", "Transformers & Turns Ratio", "easy",
    "Why are the magnetic cores of commercial transformers constructed from laminated thin sheets rather than solid cast iron?",
    ["To minimize eddy current power losses", "To reduce copper wire resistance", "To prevent electrostatic shock", "To increase dielectric permittivity"],
    0,
    "Alternating magnetic flux induces circulating currents (eddy currents) in magnetic cores, which cause I^2*R heating losses. Laminating the core with thin, insulated sheets restricts eddy current loops and drastically reduces core power loss."
)
add_q(
    "elec_e7", "electrotechnics", "nated_eng", "all", "ac_dc_machines", "AC Induction Motors & DC Machines", "easy",
    "What is the primary rotating component inside a standard squirrel-cage induction motor called?",
    ["Rotor", "Stator", "Commutator", "Slip ring assembly"],
    0,
    "The stationary magnetic field winding is the stator, while the rotating cylindrical core with embedded conductive bars is called the rotor."
)
add_q(
    "elec_e8", "electrotechnics", "nated_eng", "all", "ac_dc_machines", "AC Induction Motors & DC Machines", "easy",
    "What is the function of the split-ring commutator in a direct current (DC) generator?",
    ["It mechanically rectifies induced AC in the armature into pulsating DC for the external circuit", "It steps up the generated voltage", "It regulates the mechanical speed of the prime mover", "It grounds stray leakage currents"],
    0,
    "The armature windings of a DC generator physically generate alternating current. The split-ring commutator reverses the connection to the brushes every half-turn, producing unidirectional (DC) output."
)
add_q(
    "elec_e9", "electrotechnics", "nated_eng", "all", "sans_protection", "Earthing & SANS 10142 Wiring Standards", "easy",
    "Under South African National Standard SANS 10142-1 (Code of Practice for Wiring of Premises), what is the standard color for the protective earthing conductor?",
    ["Green and yellow striped (or green)", "Pure blue", "Brown", "Red"],
    0,
    "SANS 10142 mandates bi-color green/yellow (or solid green in legacy installations) strictly for protective earth conductors. Live conductors are brown (or red), and neutral conductors are light blue (or black)."
)
add_q(
    "elec_e10", "electrotechnics", "nated_eng", "all", "sans_protection", "Earthing & SANS 10142 Wiring Standards", "easy",
    "What is the maximum tripping rated residual operating current (I_delta_n) permitted for earth leakage circuit breakers protecting residential socket outlet circuits?",
    ["30 milliamperes (30 mA)", "100 milliamperes (100 mA)", "10 milliamperes (10 mA)", "300 milliamperes (300 mA)"],
    0,
    "SANS 10142 stipulates that earth leakage protection devices for standard 16 A socket outlet circuits must trip at a residual current not exceeding 30 mA within 300 milliseconds to protect human life from fatal ventricular fibrillation."
)

# --- MEDIUM (10 questions) ---
add_q(
    "elec_m1", "electrotechnics", "nated_eng", "all", "dc_networks", "DC Networks & Resistor Theorems", "medium",
    "A 230 V electric heater element draws a current of 10 A. What is the electrical resistance of the heating element?",
    ["23 ohms", "2,300 ohms", "0.043 ohms", "230 ohms"],
    0,
    "Applying Ohm's law: R = V / I = 230 V / 10 A = 23 ohms. The power dissipated is P = V * I = 2,300 W = 2.3 kW."
)
add_q(
    "elec_m2", "electrotechnics", "nated_eng", "all", "ac_theory", "AC Circuits, Reactance & Power Factor", "medium",
    "What is the inductive reactance X_L of an inductor with an inductance of 0.318 Henry in a 50 Hz AC power circuit?",
    ["100 ohms", "50 ohms", "31.8 ohms", "314 ohms"],
    0,
    "Inductive reactance X_L = 2 * pi * f * L. For f = 50 Hz and L = 0.318 H: X_L = 2 * 3.1416 * 50 * 0.318 ≈ 314.16 * 0.318 = 100 ohms."
)
add_q(
    "elec_m3", "electrotechnics", "nated_eng", "all", "ac_theory", "AC Circuits, Reactance & Power Factor", "medium",
    "In a single-phase AC series circuit, the resistance R is 30 ohms and the inductive reactance X_L is 40 ohms. What is the total circuit impedance Z?",
    ["50 ohms", "70 ohms", "10 ohms", "1,200 ohms"],
    0,
    "In an R-L series circuit, resistance and reactance are at right angles (90° phase displacement). The total impedance is Z = sqrt(R^2 + X_L^2) = sqrt(30^2 + 40^2) = sqrt(900 + 1,600) = sqrt(2,500) = 50 ohms."
)
add_q(
    "elec_m4", "electrotechnics", "nated_eng", "all", "transformers", "Transformers & Turns Ratio", "medium",
    "A single-phase transformer has 600 turns on its primary coil and 120 turns on its secondary coil. If the primary voltage is 240 V, what is the open-circuit secondary voltage?",
    ["48 Volts", "1,200 Volts", "12 Volts", "120 Volts"],
    0,
    "By the transformer turns ratio: V_s / V_p = N_s / N_p -> V_s = V_p * (N_s / N_p) = 240 V * (120 / 600) = 240 * 0.2 = 48 V."
)
add_q(
    "elec_m5", "electrotechnics", "nated_eng", "all", "ac_dc_machines", "AC Induction Motors & DC Machines", "medium",
    "What is the synchronous speed (N_s) in RPM of a 4-pole three-phase AC induction motor connected to a 50 Hz supply?",
    ["1,500 RPM", "3,000 RPM", "1,000 RPM", "750 RPM"],
    0,
    "Synchronous speed formula: N_s = (120 * f) / p, where f is supply frequency (50 Hz) and p is the number of magnetic poles (4). N_s = (120 * 50) / 4 = 6,000 / 4 = 1,500 RPM."
)
add_q(
    "elec_m6", "electrotechnics", "nated_eng", "all", "ac_dc_machines", "AC Induction Motors & DC Machines", "medium",
    "A 4-pole, 50 Hz induction motor has a synchronous speed of 1,500 RPM. Under full load, the rotor rotates at 1,440 RPM. What is the percentage slip S?",
    ["4.0%", "6.0%", "96.0%", "0.04%"],
    0,
    "Slip S = ((N_s - N_r) / N_s) * 100% = ((1,500 - 1,440) / 1,500) * 100% = (60 / 1,500) * 100% = 4.0%."
)
add_q(
    "elec_m7", "electrotechnics", "nated_eng", "all", "ac_theory", "AC Circuits, Reactance & Power Factor", "medium",
    "What is the power factor cos(theta) of an AC circuit where the active real power P is 4 kW and the apparent power S is 5 kVA?",
    ["0.80", "1.25", "0.60", "0.75"],
    0,
    "Power factor is the ratio of real active power (kW) to total apparent power (kVA): Power Factor = P / S = 4 kW / 5 kVA = 0.80."
)
add_q(
    "elec_m8", "electrotechnics", "nated_eng", "all", "dc_networks", "DC Networks & Resistor Theorems", "medium",
    "According to the maximum power transfer theorem, when does a DC source with internal resistance R_in transfer maximum power to an external load R_L?",
    ["When R_L equals R_in", "When R_L is zero (short circuit)", "When R_L is infinite (open circuit)", "When R_L is double R_in"],
    0,
    "The maximum power transfer theorem states that maximum power is transferred from a source to a load when the resistance of the load equals the internal resistance of the source (R_L = R_in)."
)
add_q(
    "elec_m9", "electrotechnics", "nated_eng", "all", "sans_protection", "Earthing & SANS 10142 Wiring Standards", "medium",
    "Why must electrical installations have an equipotential bonding conductor connected to incoming metallic water pipes?",
    ["To prevent dangerous touch potential differences between exposed conductive parts and earth", "To use the municipal water pipes as the primary electricity neutral", "To heat the water supply pipe electrically", "To measure electrical insulation resistance"],
    0,
    "Equipotential bonding connects extraneous conductive parts (like metal water and gas piping) to the main earthing terminal. This ensures that in the event of an electrical fault, all accessible metal remains at the same potential, preventing fatal shock hazards."
)
add_q(
    "elec_m10", "electrotechnics", "nated_eng", "all", "transformers", "Transformers & Turns Ratio", "medium",
    "A 10 kVA, 230 V single-phase transformer operates at rated full load with a lagging power factor of 0.8. What is the active power delivered to the load?",
    ["8.0 kW", "10.0 kW", "12.5 kW", "2.0 kW"],
    0,
    "Active power P (kW) = Apparent Power S (kVA) * Power Factor cos(theta) = 10 kVA * 0.8 = 8.0 kW."
)

# --- DIFFICULT (10 questions) ---
add_q(
    "elec_d1", "electrotechnics", "nated_eng", "all", "ac_theory", "AC Circuits, Reactance & Power Factor", "difficult",
    "In a series R-L-C circuit with R = 20 ohms, X_L = 80 ohms, and X_C = 35 ohms connected across a 230 V, 50 Hz supply, what is the total circuit impedance Z?",
    ["49.24 ohms", "135 ohms", "25 ohms", "65 ohms"],
    0,
    "Net reactance X = X_L - X_C = 80 - 35 = 45 ohms. Total impedance Z = sqrt(R^2 + X^2) = sqrt(20^2 + 45^2) = sqrt(400 + 2,025) = sqrt(2,425) ≈ 49.24 ohms."
)
add_q(
    "elec_d2", "electrotechnics", "nated_eng", "all", "ac_theory", "AC Circuits, Reactance & Power Factor", "difficult",
    "What condition defines electrical resonance in an AC series R-L-C circuit?",
    ["X_L equals X_C, causing total impedance to equal minimum pure resistance R", "Total circuit current drops to zero", "Power factor drops to 0 lagging", "Inductive reactance becomes double capacitive reactance"],
    0,
    "Series resonance occurs when inductive reactance equals capacitive reactance (X_L = X_C). The reactive components cancel out completely, yielding a pure resistive impedance (Z = R) which results in maximum current and a unity power factor (cos theta = 1.0)."
)
add_q(
    "elec_d3", "electrotechnics", "nated_eng", "all", "transformers", "Transformers & Turns Ratio", "difficult",
    "A 25 kVA single-phase transformer has full-load copper losses of 400 W and constant iron core losses of 250 W. What is its operating efficiency at full load with a unity power factor (cos theta = 1.0)?",
    ["97.47%", "98.50%", "95.00%", "96.25%"],
    0,
    "Full-load active output = 25 kVA * 1.0 = 25,000 W. Total losses = Copper loss (400 W) + Iron loss (250 W) = 650 W. Input power = Output + Losses = 25,000 + 650 = 25,650 W. Efficiency = (25,000 / 25,650) * 100% ≈ 97.466% ≈ 97.47%."
)
add_q(
    "elec_d4", "electrotechnics", "nated_eng", "all", "ac_dc_machines", "AC Induction Motors & DC Machines", "difficult",
    "A 6-pole, 50 Hz three-phase induction motor operates at a slip of 5%. What is the frequency of the rotor induced electromotive force (rotor frequency f_r)?",
    ["2.5 Hz", "50 Hz", "5.0 Hz", "25 Hz"],
    0,
    "The frequency of induced rotor EMF and current equals slip multiplied by the stator supply frequency: f_r = S * f_s = 0.05 * 50 Hz = 2.5 Hz."
)
add_q(
    "elec_d5", "electrotechnics", "nated_eng", "all", "ac_theory", "AC Circuits, Reactance & Power Factor", "difficult",
    "An industrial factory consumes 120 kW at a low lagging power factor of 0.6. Why does the municipal electricity supplier penalize the company or demand power factor correction capacitors?",
    ["The low power factor draws excessive reactive kVAR current, increasing line losses and overburdening transformers", "Low power factor damages the electricity meters", "It reduces the active kWh energy consumed", "It generates dangerous direct current on the transmission lines"],
    0,
    "At pf = 0.6, apparent power is 120 / 0.6 = 200 kVA (requiring 200 kVA cable and transformer capacity). The excessive lagging reactive current creates higher I^2*R transmission losses and voltage drops. Installing shunt capacitors supplies the reactive power locally."
)
add_q(
    "elec_d6", "electrotechnics", "nated_eng", "all", "dc_networks", "DC Networks & Resistor Theorems", "difficult",
    "According to Thevenin's theorem, any linear two-terminal DC network containing voltage sources and resistors can be replaced by which equivalent circuit?",
    ["A single equivalent voltage source (V_th) in series with an equivalent resistance (R_th)", "A single current source in parallel with a capacitor", "Two independent voltage sources in parallel with an inductor", "A pure resistance connected across earth"],
    0,
    "Thevenin's theorem states that any linear resistive network with energy sources can be represented between two open terminals as an ideal open-circuit voltage source V_th in series with an internal equivalent resistance R_th."
)
add_q(
    "elec_d7", "electrotechnics", "nated_eng", "all", "ac_dc_machines", "AC Induction Motors & DC Machines", "difficult",
    "What dangerous condition occurs if the field winding of a loaded DC shunt motor suddenly becomes open-circuited while running?",
    ["The motor dangerously accelerates to an excessively high, destructive runaway speed", "The motor stops rotating immediately", "The motor reverses direction smoothly", "The armature voltage drops to zero"],
    0,
    "In a DC shunt motor, motor speed N is inversely proportional to magnetic field flux (N proportional to E_b / Phi). If the field breaks (Phi -> 0), the motor attempts to develop back-EMF by accelerating exponentially to dangerous speeds, leading to centrifugal mechanical destruction."
)
add_q(
    "elec_d8", "electrotechnics", "nated_eng", "all", "ac_theory", "AC Circuits, Reactance & Power Factor", "difficult",
    "In a balanced three-phase star-connected (Y) electrical distribution system, what is the exact mathematical relationship between line voltage (V_L) and phase voltage (V_ph)?",
    ["V_L = sqrt(3) * V_ph and line current equals phase current", "V_L = V_ph and line current equals sqrt(3) * phase current", "V_L = 3 * V_ph", "V_L = V_ph / sqrt(3)"],
    0,
    "In a balanced star connection, line voltage across two phases is the vector difference of the phase voltages: V_L = sqrt(3) * V_ph (e.g. 230 V * sqrt(3) ≈ 400 V in South Africa). The line current is identical to the phase current (I_L = I_ph)."
)
add_q(
    "elec_d9", "electrotechnics", "nated_eng", "all", "sans_protection", "Earthing & SANS 10142 Wiring Standards", "difficult",
    "Why must electrical installations employ a dedicated earth continuity conductor rather than relying solely on the structural steel frame of a building?",
    ["Steel structural joints may corrode or lack guaranteed low electrical impedance to trip protection devices during a fault", "Steel is an electrical insulator", "Structural steel creates high magnetic back-EMF", "SANS regulations require structural steel to carry only lightning currents"],
    0,
    "Structural steel connections (bolts, paint, oxidation) have unpredictable and potentially high resistance. SANS 10142 mandates low-impedance copper earth continuity conductors to ensure fault currents are large enough to rapidly trip circuit breakers before lethal potentials develop."
)
add_q(
    "elec_d10", "electrotechnics", "nated_eng", "all", "transformers", "Transformers & Turns Ratio", "difficult",
    "During an open-circuit test on a power transformer performed at rated voltage on the low-voltage side, what primary power loss is measured by the wattmeter?",
    ["Core (iron) losses only, because no-load current is tiny and copper losses are negligible", "Full-load winding copper losses only", "Dielectric breakdown in oil insulation", "Mechanical friction in the core"],
    0,
    "In an open-circuit test, the secondary is open so current is purely the tiny no-load magnetizing current (2-5% of rated). Winding copper loss (I^2*R) is practically zero, meaning the wattmeter measures almost purely the core hysteresis and eddy current (iron) losses."
)

print(f"Loaded {len(QUESTIONS)} questions so far (Maths + Science + Electrotechnics).")

# =========================================================================
# 4. NATED FINANCIAL ACCOUNTING (N4-N6)
# =========================================================================

# --- EASY (10 questions) ---
add_q(
    "acc_e1", "financial_acc", "nated_bus", "all", "acc_principles", "Accounting Concepts & Ledger Postings", "easy",
    "What is the fundamental accounting equation that governs all double-entry bookkeeping?",
    ["Assets = Equity + Liabilities", "Assets = Equity - Liabilities", "Equity = Assets + Liabilities", "Liabilities = Assets + Equity"],
    0,
    "The fundamental accounting equation states that a business's total economic resources (Assets) must always be financed either by creditors/debt (Liabilities) or owners' capital (Equity): Assets = Equity + Liabilities."
)
add_q(
    "acc_e2", "financial_acc", "nated_bus", "all", "acc_principles", "Accounting Concepts & Ledger Postings", "easy",
    "Under the double-entry system, what is the correct entry to record cash received from a trade debtor settling their account?",
    ["Debit Bank Account, Credit Debtors Control Account", "Debit Debtors Control, Credit Bank", "Debit Sales, Credit Bank", "Debit Bank, Credit Creditors Control"],
    0,
    "Cash received increases an asset (Bank is debited), while the outstanding claim against trade debtors decreases (Debtors Control asset is credited)."
)
add_q(
    "acc_e3", "financial_acc", "nated_bus", "all", "acc_adjustments", "Year-End Adjustments & Income Statements", "easy",
    "What is the basic purpose of recording a year-end adjustment for accrued expenses (expenses incurred but not yet paid)?",
    ["To ensure expenses are recorded in the accounting period in which they occurred (matching principle)", "To artificially increase reported net profit", "To reduce tax liability illegally", "To reconcile the bank statement balance"],
    0,
    "Under the accrual concept and matching principle, expenses must be matched against the revenue of the period they helped generate, regardless of when physical payment takes place."
)
add_q(
    "acc_e4", "financial_acc", "nated_bus", "all", "acc_adjustments", "Year-End Adjustments & Income Statements", "easy",
    "A company purchases equipment for R100,000 with an expected useful life of 5 years and zero scrap value. Using the straight-line depreciation method, what is the annual depreciation expense?",
    ["R20,000 per year", "R10,000 per year", "R50,000 per year", "R5,000 per year"],
    0,
    "Straight-line depreciation = (Cost - Residual Value) / Useful Life = (R100,000 - 0) / 5 years = R20,000 per year."
)
add_q(
    "acc_e5", "financial_acc", "nated_bus", "all", "acc_cashflow", "Statement of Cash Flows (IAS 7)", "easy",
    "In a Statement of Cash Flows prepared in accordance with IAS 7, into which three standard activity categories are cash flows classified?",
    ["Operating, Investing, and Financing activities", "Current, Non-current, and Equity activities", "Trading, Profit & Loss, and Balance Sheet activities", "Cash sales, Credit sales, and Sundry receipts"],
    0,
    "IAS 7 mandates categorizing all cash inflows and outflows into: (1) Operating activities (core revenue generating), (2) Investing activities (acquisition/disposal of long-term assets), and (3) Financing activities (equity capital and borrowings)."
)
add_q(
    "acc_e6", "financial_acc", "nated_bus", "all", "acc_cashflow", "Statement of Cash Flows (IAS 7)", "easy",
    "Why is non-cash depreciation added back to net profit before tax in the operating activities section of a cash flow statement?",
    ["Because depreciation was deducted as an expense but did not involve an actual outflow of liquid cash", "Because depreciation represents cash stored in a bank account", "Because assets appreciate over time", "To reduce reported cash flow"],
    0,
    "Depreciation is an accounting adjustment that reduces profit without any physical money leaving the business bank account. To determine actual cash generated from operations, it must be added back."
)
add_q(
    "acc_e7", "financial_acc", "nated_bus", "all", "acc_partnerships", "Partnership Accounts & Profit Sharing", "easy",
    "Where is the residual net profit of a partnership transferred after meeting partnership agreement stipulations like salaries and interest on capital?",
    ["Appropriation Account to distribute to partner current accounts", "Directly into Creditors Control", "Into a statutory reserve fund for SARS", "Retained in the Trading Account"],
    0,
    "In partnership accounting, net profit from the Income Statement is transferred to the Profit and Loss Appropriation Account. After allowing for partner salaries, bonuses, and interest on capital, remaining profit is divided according to the agreed profit-sharing ratio."
)
add_q(
    "acc_e8", "financial_acc", "nated_bus", "all", "acc_partnerships", "Partnership Accounts & Profit Sharing", "easy",
    "What is the primary difference between a partner's Capital Account and Current Account in the fixed capital method?",
    ["The Capital Account records permanent initial/additional investment, while the Current Account tracks ongoing drawings, interest, and profit share", "The Capital Account is for liabilities and the Current Account is for assets", "Capital is for cash and Current is for credit", "There is no difference; they are interchangeable"],
    0,
    "Under the fixed capital system, the Capital Account remains constant with initial capital contributions, while fluctuations due to drawings, salary entitlements, interest on capital/drawings, and profit distributions are recorded in the partner's Current Account."
)
add_q(
    "acc_e9", "financial_acc", "nated_bus", "all", "cost_breakeven", "Cost Accounting & Break-Even Analysis", "easy",
    "How is the prime cost of a manufactured product calculated in cost accounting?",
    ["Direct Materials + Direct Labour (plus direct expenses)", "Total Fixed Costs + Variable Overheads", "Selling Price - Gross Profit", "Factory Overheads + Administrative Costs"],
    0,
    "Prime cost represents all direct manufacturing costs directly traceable to a unit of production: Prime Cost = Direct Raw Materials + Direct Productive Labour + Direct Production Expenses."
)
add_q(
    "acc_e10", "financial_acc", "nated_bus", "all", "cost_breakeven", "Cost Accounting & Break-Even Analysis", "easy",
    "What defines the break-even point in business and cost accounting?",
    ["The volume of sales where total revenue exactly equals total costs (profit is zero)", "The point where profit is maximized", "The volume where variable cost equals fixed cost", "The point where inventory runs out"],
    0,
    "The break-even point is the operating level at which total sales revenue equals the sum of total fixed costs and total variable costs, resulting in neither profit nor loss (net profit = R0)."
)

# --- MEDIUM (10 questions) ---
add_q(
    "acc_m1", "financial_acc", "nated_bus", "all", "acc_principles", "Accounting Concepts & Ledger Postings", "medium",
    "A business receives an invoice for R11,500 inclusive of 15% South African VAT for inventory purchased on credit. What is the amount debited to the Purchases / Inventory account?",
    ["R10,000", "R11,500", "R1,500", "R13,225"],
    0,
    "To extract the net cost excluding VAT: R11,500 * (100 / 115) = R10,000. The R1,500 is debited to VAT Input (claimable asset from SARS), and the gross R11,500 is credited to Creditors Control."
)
add_q(
    "acc_m2", "financial_acc", "nated_bus", "all", "acc_adjustments", "Year-End Adjustments & Income Statements", "medium",
    "On 1 March, a business paid annual insurance of R24,000 covering 12 months to 28 February of the following year. If the financial year ends on 31 October (8 months elapsed), what is the prepaid insurance asset adjustment at year end?",
    ["R8,000 (prepaid expense)", "R16,000 (insurance expense)", "R24,000", "R4,000"],
    0,
    "Monthly insurance is R24,000 / 12 = R2,000 per month. 8 months relate to the current year (8 * R2,000 = R16,000 expense). The remaining 4 months (November to February) relate to the next financial year: 4 * R2,000 = R8,000 prepaid insurance asset."
)
add_q(
    "acc_m3", "financial_acc", "nated_bus", "all", "acc_adjustments", "Year-End Adjustments & Income Statements", "medium",
    "Equipment costing R80,000 has accumulated depreciation of R30,000 at the start of the year. The business writes off depreciation at 20% per annum on the diminishing balance (carrying value) method. What is the depreciation expense for the year?",
    ["R10,000", "R16,000", "R6,000", "R14,000"],
    0,
    "Carrying value = Cost - Accumulated Depreciation = R80,000 - R30,000 = R50,000. Depreciation = 20% of R50,000 = R10,000."
)
add_q(
    "acc_m4", "financial_acc", "nated_bus", "all", "acc_cashflow", "Statement of Cash Flows (IAS 7)", "medium",
    "At the start of the year, trade debtors were R45,000. At the end of the year, trade debtors were R60,000. In the operating activities cash flow reconciliation, how is this R15,000 change treated?",
    ["Deducted as a cash outflow / use of cash (-R15,000)", "Added as a cash inflow (+R15,000)", "Ignored as non-cash", "Recorded under financing activities"],
    0,
    "An increase in trade debtors indicates that more sales revenue was tied up on credit and not yet collected in cash. Therefore, an increase in debtors represents a cash outflow / deduction (-R15,000) from net profit."
)
add_q(
    "acc_m5", "financial_acc", "nated_bus", "all", "acc_partnerships", "Partnership Accounts & Profit Sharing", "medium",
    "Partners Sipho and Thabo share profits in the ratio 3:2. For the year, partnership net profit after partner salaries is R150,000. What is Thabo's share of the residual profit?",
    ["R60,000", "R90,000", "R75,000", "R50,000"],
    0,
    "Total ratio parts = 3 + 2 = 5 parts. Thabo's share = (2 / 5) * R150,000 = 2 * R30,000 = R60,000. (Sipho receives (3 / 5) * R150,000 = R90,000)."
)
add_q(
    "acc_m6", "financial_acc", "nated_bus", "all", "cost_breakeven", "Cost Accounting & Break-Even Analysis", "medium",
    "A manufacturer sells widgets for R50 each. The variable cost per unit is R30, and total annual fixed costs are R120,000. What is the break-even volume in units?",
    ["6,000 units", "4,000 units", "2,400 units", "12,000 units"],
    0,
    "Contribution margin per unit = Selling Price - Variable Cost = R50 - R30 = R20 per unit. Break-Even Point = Total Fixed Costs / Contribution per unit = R120,000 / R20 = 6,000 units."
)
add_q(
    "acc_m7", "financial_acc", "nated_bus", "all", "cost_breakeven", "Cost Accounting & Break-Even Analysis", "medium",
    "If a business sells 10,000 units where the break-even point is 7,000 units, what is its margin of safety?",
    ["3,000 units (30% of sales)", "7,000 units", "10,000 units", "17,000 units"],
    0,
    "Margin of safety measures how much sales can fall before reaching the break-even point: Margin of Safety = Actual Sales - Break-Even Sales = 10,000 - 7,000 = 3,000 units (or 30%)."
)
add_q(
    "acc_m8", "financial_acc", "nated_bus", "all", "acc_principles", "Accounting Concepts & Ledger Postings", "medium",
    "A bank reconciliation statement prepared at month-end shows a bank statement balance differing from the cash book. Which item is entered in the Cash Book (not the reconciliation statement)?",
    ["Direct bank charges and interest debited by the bank", "Outstanding cheques not yet presented for payment", "Deposits made but not yet cleared by the bank", "Bank errors made by the teller"],
    0,
    "Bank charges, interest, and direct debits are verified transactions already processed by the bank that the business was unaware of. They must be recorded directly in the Cash Book to update its balance."
)
add_q(
    "acc_m9", "financial_acc", "nated_bus", "all", "acc_adjustments", "Year-End Adjustments & Income Statements", "medium",
    "A debtor owing R4,000 is officially declared bankrupt and the debt is written off as irrecoverable. What is the correct journal entry?",
    ["Debit Bad Debts Expense R4,000; Credit Debtors Control R4,000", "Debit Debtors Control R4,000; Credit Bad Debts R4,000", "Debit Bank R4,000; Credit Bad Debts R4,000", "Debit Provision for Bad Debts R4,000; Credit Bank R4,000"],
    0,
    "Writing off a bad debt recognizes an expense (Bad Debts is debited) and eliminates the uncollectible asset from the books (Debtors Control is credited)."
)
add_q(
    "acc_m10", "financial_acc", "nated_bus", "all", "acc_cashflow", "Statement of Cash Flows (IAS 7)", "medium",
    "During the financial year, a company purchased machinery for R250,000 cash and received R40,000 from selling old delivery vehicles. What is the net cash flow from investing activities?",
    ["Net cash outflow of -R210,000", "Net cash outflow of -R290,000", "Net cash inflow of +R210,000", "R0 because machinery is capitalized"],
    0,
    "Investing cash flows include purchases of fixed assets (-R250,000) and proceeds from asset disposals (+R40,000). Net investing cash flow = -R250,000 + R40,000 = -R210,000 (net cash used)."
)

# --- DIFFICULT (10 questions) ---
add_q(
    "acc_d1", "financial_acc", "nated_bus", "all", "cost_breakeven", "Cost Accounting & Break-Even Analysis", "difficult",
    "A company has total fixed overheads of R180,000 and sells a single product for R100 with a variable cost of R60 per unit. How many units must be sold to earn a targeted net profit of R60,000?",
    ["6,000 units", "4,500 units", "3,000 units", "8,000 units"],
    0,
    "Contribution per unit = R100 - R60 = R40. Required units = (Fixed Costs + Target Profit) / Contribution per unit = (R180,000 + R60,000) / R40 = R240,000 / R40 = 6,000 units."
)
add_q(
    "acc_d2", "financial_acc", "nated_bus", "all", "acc_adjustments", "Year-End Adjustments & Income Statements", "difficult",
    "A company holds inventory of 500 units purchased at R40 each (cost = R20,000). At year-end, damaged packaging means they can only be sold for R35 each, with repackaging costs of R5 per unit. In accordance with IAS 2, at what value must the inventory be reported?",
    ["R15,000 (at Net Realizable Value)", "R20,000 (at historical cost)", "R17,500", "R22,500"],
    0,
    "Under IAS 2, inventory must be valued at the lower of Cost and Net Realizable Value (NRV). Cost = R40. NRV = Estimated selling price (R35) - completion/selling costs (R5) = R30. Since NRV (R30) < Cost (R40), inventory must be written down to 500 * R30 = R15,000, recognizing an expense of R5,000."
)
add_q(
    "acc_d3", "financial_acc", "nated_bus", "all", "acc_partnerships", "Partnership Accounts & Profit Sharing", "difficult",
    "Partners A and B share profits equally. Partner C is admitted and buys into a 1/5 share of the partnership. Goodwill is valued at R60,000 but the partners agree not to retain a Goodwill account in the permanent ledger. How is goodwill handled between the old partners?",
    ["Credit Partner A Capital R30,000 and Partner B Capital R30,000", "Debit Cash R60,000 and Credit General Reserve R60,000", "Credit Partner C Capital R60,000", "No entry is recorded anywhere"],
    0,
    "When goodwill is created on admission of a partner, old partners are credited in their old profit-sharing ratio (1:1 -> R30,000 each). If goodwill is not to be maintained in the books, it is immediately written off across all partners in the new profit-sharing ratio, adjusting capital balances."
)
add_q(
    "acc_d4", "financial_acc", "nated_bus", "all", "acc_cashflow", "Statement of Cash Flows (IAS 7)", "difficult",
    "Company X issued 50,000 ordinary shares of R2 each at a premium of R1 per share, and repaid a R60,000 long-term bank debenture loan. What is the net cash flow from financing activities?",
    ["+R90,000 net cash inflow", "+R40,000 net cash inflow", "+R150,000 net cash inflow", "-R60,000 net cash outflow"],
    0,
    "Share issue proceeds = 50,000 shares * R3 (R2 nominal + R1 premium) = +R150,000 inflow. Loan repayment = -R60,000 outflow. Net financing cash flow = +R150,000 - R60,000 = +R90,000."
)
add_q(
    "acc_d5", "financial_acc", "nated_bus", "all", "cost_breakeven", "Cost Accounting & Break-Even Analysis", "difficult",
    "In a manufacturing environment, a factory produced 12,000 units but budgeted for 10,000 units. If budgeted fixed factory overhead was R100,000 (predetermined overhead absorption rate R10/unit) and actual fixed overhead incurred was R105,000, what is the overhead variance?",
    ["R15,000 over-absorbed overhead", "R5,000 under-absorbed overhead", "R10,000 over-absorbed overhead", "R20,000 under-absorbed overhead"],
    0,
    "Absorbed overhead = Actual output (12,000 units) * Predetermined rate (R10/unit) = R120,000. Actual overhead incurred = R105,000. Because absorbed overhead (R120,000) > actual overhead (R105,000), factory overhead is over-absorbed by R15,000 (which increases profit in standard cost reconciliations)."
)
add_q(
    "acc_d6", "financial_acc", "nated_bus", "all", "acc_principles", "Accounting Concepts & Ledger Postings", "difficult",
    "Which accounting standard principles prevent a business from recording internally generated goodwill on its Statement of Financial Position?",
    ["Prudence and Reliable Measurement (IAS 38)", "The Going Concern Concept", "Historical Cost of Land", "Materiality Principle"],
    0,
    "Under IAS 38 (Intangible Assets) and the prudence principle, internally generated goodwill cannot be recognized as an asset because it is not an identifiable resource controlled by the entity that can be reliably measured at cost."
)
add_q(
    "acc_d7", "financial_acc", "nated_bus", "all", "acc_adjustments", "Year-End Adjustments & Income Statements", "difficult",
    "On 1 January 2024, a delivery van was acquired for R200,000. On 30 June 2026 (2.5 years later), it was sold for R90,000 cash. Depreciation has been recorded at 20% per year on cost (straight-line). What is the profit or loss on disposal?",
    ["Loss of R10,000", "Profit of R10,000", "Profit of R30,000", "Loss of R30,000"],
    0,
    "Depreciation per year = 20% of R200,000 = R40,000. Accumulated depreciation for 2.5 years = 2.5 * R40,000 = R100,000. Carrying value at date of sale = R200,000 - R100,000 = R100,000. Selling price = R90,000. Loss on disposal = Carrying value (R100,000) - Sale proceeds (R90,000) = R10,000."
)
add_q(
    "acc_d8", "financial_acc", "nated_bus", "all", "cost_breakeven", "Cost Accounting & Break-Even Analysis", "difficult",
    "Product A has a contribution-to-sales (marginal income) ratio of 40%. If total fixed costs are R320,000, what is the break-even sales turnover in Rands?",
    ["R800,000", "R480,000", "R1,280,000", "R640,000"],
    0,
    "Break-Even Turnover (Rands) = Total Fixed Costs / Marginal Income Ratio = R320,000 / 0.40 = R800,000."
)
add_q(
    "acc_d9", "financial_acc", "nated_bus", "all", "acc_cashflow", "Statement of Cash Flows (IAS 7)", "difficult",
    "Net profit before tax is R300,000. Depreciation is R50,000. Trade receivables increased by R20,000. Inventories decreased by R15,000. Trade payables decreased by R25,000. Tax paid was R70,000. What is the net cash flow generated from operating activities?",
    ["R250,000", "R320,000", "R280,000", "R190,000"],
    0,
    "Operating profit before working capital = 300,000 + 50,000 (depreciation) = 350,000. Working capital changes: Increase in receivables (-20,000) + Decrease in inventories (+15,000) + Decrease in payables (-25,000) = -30,000. Cash generated from operations = 350,000 - 30,000 = 320,000. Less tax paid (-70,000) = R250,000."
)
add_q(
    "acc_d10", "financial_acc", "nated_bus", "all", "acc_partnerships", "Partnership Accounts & Profit Sharing", "difficult",
    "In partnership dissolution, if a partner's capital account ends up with a debit balance (they owe the firm) and the partner is legally declared insolvent, how is the deficiency absorbed under the rule in Garner v Murray?",
    ["Solvent partners absorb the deficiency in the ratio of their last agreed capital balances", "Solvent partners absorb it equally regardless of capital", "Creditors absorb the loss immediately", "The bank account is debited"],
    0,
    "Under the famous rule in Garner v Murray, any loss arising from the default of an insolvent partner is treated as a capital loss and must be borne by the solvent partners in proportion to their respective capital contributions (not their profit-sharing ratio)."
)

print(f"Loaded {len(QUESTIONS)} questions so far (Maths + Science + Electrotechnics + Financial Accounting).")

# =========================================================================
# 5. NATED ENTREPRENEURSHIP & BUSINESS MANAGEMENT (N4-N6)
# =========================================================================

# --- EASY (10 questions) ---
add_q(
    "ebm_e1", "entrepreneurship", "nated_bus", "all", "swot_strategy", "SWOT, PESTLE & Market Feasibility", "easy",
    "In a formal SWOT analysis matrix for a new enterprise, which two elements analyze internal organizational factors?",
    ["Strengths and Weaknesses", "Opportunities and Threats", "Strengths and Opportunities", "Weaknesses and Threats"],
    0,
    "In SWOT analysis, Strengths and Weaknesses originate internally within the venture (e.g. skills, proprietary technology, capital), whereas Opportunities and Threats stem from the external market environment."
)
add_q(
    "ebm_e2", "entrepreneurship", "nated_bus", "all", "swot_strategy", "SWOT, PESTLE & Market Feasibility", "easy",
    "What does the acronym PESTLE stand for in external macro-environmental business analysis?",
    ["Political, Economic, Social, Technological, Legal, Environmental", "Product, Enterprise, Strategy, Team, Logistics, Efficiency", "Personnel, Expenses, Sales, Taxes, Leases, Equipment", "Price, Elasticity, Supply, Turnover, Liquidity, Equity"],
    0,
    "PESTLE analysis systematically scans the macro-environment across Political, Economic, Social, Technological, Legal, and Environmental external drivers."
)
add_q(
    "ebm_e3", "entrepreneurship", "nated_bus", "all", "marketing_mix", "Marketing Mix (4Ps) & Customer Targeting", "easy",
    "What are the traditional Four Ps of the operational marketing mix?",
    ["Product, Price, Place, Promotion", "Planning, Production, People, Profit", "Purchase, Packaging, Performance, Payment", "Positioning, Policy, Process, Publicity"],
    0,
    "E. Jerome McCarthy's classic 4Ps framework comprises Product (offering), Price (pricing model), Place (distribution channels), and Promotion (advertising and sales communication)."
)
add_q(
    "ebm_e4", "entrepreneurship", "nated_bus", "all", "marketing_mix", "Marketing Mix (4Ps) & Customer Targeting", "easy",
    "What is the term for dividing a broad consumer market into distinct subgroups with shared needs, demographics, or behaviors?",
    ["Market segmentation", "Market skimming", "Diversification", "Benchmarking"],
    0,
    "Market segmentation divides heterogeneous markets into distinct customer groups sharing demographic, geographic, psychographic, or behavioral traits to allow tailored marketing."
)
add_q(
    "ebm_e5", "entrepreneurship", "nated_bus", "all", "financial_budgeting", "Cash Flow Budgets vs Profitability", "easy",
    "Why is a monthly cash flow budget essential for a newly established startup business?",
    ["To forecast expected cash inflows and outflows and avoid insolvency due to cash shortages", "To compute the corporate income tax rate payable to SARS", "To replace the need for customer marketing", "To guarantee positive profit in the first month"],
    0,
    "A cash flow budget anticipates when cash will physically enter and leave the business bank account, allowing management to take preventative action before liquidity shortfalls cause bounced payments or bankruptcy."
)
add_q(
    "ebm_e6", "entrepreneurship", "nated_bus", "all", "financial_budgeting", "Cash Flow Budgets vs Profitability", "easy",
    "What constitutes working capital in business management?",
    ["Current Assets minus Current Liabilities", "Total Assets minus Total Liabilities", "Fixed Assets minus Long-term Loans", "Net Profit minus Taxes"],
    0,
    "Working capital measures short-term operating liquidity: Working Capital = Current Assets (Cash, Debtors, Stock) - Current Liabilities (Creditors, Short-term Overdraft)."
)
add_q(
    "ebm_e7", "entrepreneurship", "nated_bus", "all", "statutory_compliance", "Statutory Registration (SARS, CIPC, COIDA)", "easy",
    "In South Africa, with which government institution must all formal companies (such as a Private Company Pty Ltd) be registered?",
    ["Companies and Intellectual Property Commission (CIPC)", "South African Reserve Bank (SARB)", "Commission for Conciliation, Mediation and Arbitration (CCMA)", "Statistics South Africa (Stats SA)"],
    0,
    "CIPC is the statutory agency of the Department of Trade, Industry and Competition responsible for the registration of companies, co-operatives, and intellectual property rights in South Africa."
)
add_q(
    "ebm_e8", "entrepreneurship", "nated_bus", "all", "statutory_compliance", "Statutory Registration (SARS, CIPC, COIDA)", "easy",
    "Under South African Value-Added Tax (VAT) legislation, at what annual taxable turnover threshold is VAT registration legally compulsory?",
    ["R1,000,000 (R1 million)", "R50,000", "R500,000", "R5,000,000"],
    0,
    "Under the VAT Act, registration as a VAT vendor is mandatory if total taxable turnover has exceeded R1 million in any 12-month period, or will reasonably exceed R1 million in terms of a contractual obligation."
)
add_q(
    "ebm_e9", "entrepreneurship", "nated_bus", "all", "operations_management", "Operations, Inventory & Staff Management", "easy",
    "What is the statutory purpose of the Unemployment Insurance Fund (UIF) in South African labor practice?",
    ["To provide short-term financial relief to workers during unemployment, illness, or maternity leave", "To fund annual employee bonuses", "To pay university tuition fees", "To cover medical malpractice claims"],
    0,
    "The UIF gives short-term financial assistance to registered workers who lose their jobs, become ill, or go on maternity leave. Contributions are 2% of salary (1% deducted from employee, 1% paid by employer)."
)
add_q(
    "ebm_e10", "entrepreneurship", "nated_bus", "all", "operations_management", "Operations, Inventory & Staff Management", "easy",
    "What document provides a written outline of the tasks, duties, and responsibilities associated with a specific job position?",
    ["Job description", "Job specification", "Curriculum vitae", "Employment equity plan"],
    0,
    "A job description details the key tasks, reporting lines, and operational duties of a post, whereas a job specification defines the human qualifications, skills, and experience needed to perform it."
)

# --- MEDIUM (10 questions) ---
add_q(
    "ebm_m1", "entrepreneurship", "nated_bus", "all", "swot_strategy", "SWOT, PESTLE & Market Feasibility", "medium",
    "A South African solar installation startup experiences rising grid tariffs (Eskom price hikes). In a SWOT matrix, how is this external factor classified?",
    ["An external Opportunity", "An internal Strength", "An external Threat", "An internal Weakness"],
    0,
    "Rising municipal electricity tariffs are an external economic trend outside the company's control that directly drives consumer demand for alternate solar power, presenting a prime market Opportunity."
)
add_q(
    "ebm_m2", "entrepreneurship", "nated_bus", "all", "marketing_mix", "Marketing Mix (4Ps) & Customer Targeting", "medium",
    "What pricing strategy involves setting an artificially high introductory price for a novel tech product to recover R&D expenses before competitors enter?",
    ["Price skimming", "Penetration pricing", "Loss leader pricing", "Cost-plus pricing"],
    0,
    "Price skimming targets innovators and early adopters willing to pay premium prices, maximizing initial profit margins ('skimming the cream') before gradually lowering prices as the market matures."
)
add_q(
    "ebm_m3", "entrepreneurship", "nated_bus", "all", "financial_budgeting", "Cash Flow Budgets vs Profitability", "medium",
    "A business forecasts opening cash of R25,000 for May. Cash sales are R70,000, credit collections are R30,000, supplier payments are R65,000, and rent/salaries total R45,000. What is the closing cash balance at the end of May?",
    ["R15,000", "R25,000", "-R10,000", "R35,000"],
    0,
    "Total inflows = R70,000 + R30,000 = R100,000. Total outflows = R65,000 + R45,000 = R110,000. Net monthly cash flow = R100,000 - R110,000 = -R10,000. Closing balance = Opening (R25,000) - R10,000 = R15,000."
)
add_q(
    "ebm_m4", "entrepreneurship", "nated_bus", "all", "statutory_compliance", "Statutory Registration (SARS, CIPC, COIDA)", "medium",
    "Under the Compensation for Occupational Injuries and Diseases Act (COIDA), why must South African employers register with the Compensation Fund?",
    ["To insure employees against medical expenses and disablement compensation resulting from on-the-job injuries", "To pay retirement pensions to senior executives", "To replace company motor vehicle insurance", "To provide severance packages for retrenched staff"],
    0,
    "COIDA is a statutory no-fault insurance system that compensates workers or their dependents for workplace injuries, diseases, or death sustained in the course of employment, while protecting employers from civil litigation."
)
add_q(
    "ebm_m5", "entrepreneurship", "nated_bus", "all", "operations_management", "Operations, Inventory & Staff Management", "medium",
    "A retail store consumes 50 bags of cement daily. Delivery from the supplier takes 4 working days, and the store maintains a safety buffer of 60 bags. At what inventory level should the store place a re-order?",
    ["260 bags", "200 bags", "110 bags", "310 bags"],
    0,
    "Re-order Level = (Lead Time * Average Daily Usage) + Safety Stock = (4 days * 50 bags) + 60 bags = 200 + 60 = 260 bags."
)
add_q(
    "ebm_m6", "entrepreneurship", "nated_bus", "all", "marketing_mix", "Marketing Mix (4Ps) & Customer Targeting", "medium",
    "A boutique bakery uses high-end organic cocoa, handcrafted packaging, and charges R120 per small cake. Which combination of the 4Ps is being targeted?",
    ["Premium product positioning with prestige pricing and specialty place/promotion", "Mass market cost leadership with penetration pricing", "Intensive distribution with loss-leader pricing", "Commodity product with discount pricing"],
    0,
    "This strategy relies on premium product differentiation, premium pricing that signals luxury quality, and selective distribution catering to an upscale market segment."
)
add_q(
    "ebm_m7", "entrepreneurship", "nated_bus", "all", "statutory_compliance", "Statutory Registration (SARS, CIPC, COIDA)", "medium",
    "What legal characteristic distinguishes a Private Company (Pty Ltd) from a Sole Proprietorship regarding business liabilities?",
    ["A Pty Ltd has limited liability (shareholders risk only their invested capital), while a sole proprietor faces unlimited personal liability", "A sole proprietor has zero liability", "A Pty Ltd cannot sign commercial lease contracts", "A sole proprietor must issue audited shares to the public"],
    0,
    "A Private Company is an independent juristic person with limited liability, meaning creditors cannot claim shareholders' personal assets. A sole proprietor and their business are legally identical, making personal assets vulnerable to business debt."
)
add_q(
    "ebm_m8", "entrepreneurship", "nated_bus", "all", "operations_management", "Operations, Inventory & Staff Management", "medium",
    "Under the Basic Conditions of Employment Act (BCEA) in South Africa, what is the standard overtime pay rate for an employee working on an ordinary weekday beyond normal hours?",
    ["1.5 times the normal wage rate (time and a half)", "Normal wage rate with no premium", "Double the normal wage rate (2.0 times)", "Triple the normal wage rate"],
    0,
    "Under section 10 of the BCEA, an employer must pay an employee at least 1.5 times their normal hourly wage for overtime worked during the standard working week (Sundays and public holidays require double time)."
)
add_q(
    "ebm_m9", "entrepreneurship", "nated_bus", "all", "financial_budgeting", "Cash Flow Budgets vs Profitability", "medium",
    "A startup enterprise generates R500,000 in accounting sales revenue in its first quarter with costs of R350,000 (net profit R150,000). However, the bank balance is overdrawn by R20,000. What is the most likely cause?",
    ["Customers were granted generous credit terms and have not yet paid their invoices", "The business understated its corporate income tax", "The cost of goods sold was calculated improperly", "Depreciation was omitted from the balance sheet"],
    0,
    "This is the classic 'cash flow vs profit' trap: revenue recognized on credit (accrual accounting) reports healthy accounting profit, but if debtor collections lag while cash outflows (suppliers, wages) must be paid immediately, liquid cash collapses."
)
add_q(
    "ebm_m10", "entrepreneurship", "nated_bus", "all", "swot_strategy", "SWOT, PESTLE & Market Feasibility", "medium",
    "In Porter's Five Forces model of industry competitive analysis, what factor increases the bargaining power of buyers/customers?",
    ["When buyers can easily switch to substitute products with negligible switching costs", "When there are very few alternate suppliers in the industry", "When the product is highly customized and patented", "When the customer base is highly fragmented"],
    0,
    "Buyer power rises significantly when products are standardized or commoditized, switching costs are negligible, and alternate suppliers are readily available, allowing customers to dictate price and terms."
)

# --- DIFFICULT (10 questions) ---
add_q(
    "ebm_d1", "entrepreneurship", "nated_bus", "all", "financial_budgeting", "Cash Flow Budgets vs Profitability", "difficult",
    "An entrepreneur plans to invest R200,000 in a new automated packaging machine that will generate constant net cash inflows of R60,000 per year. What is the simple payback period?",
    ["3.33 years (3 years and 4 months)", "2.5 years", "4.0 years", "5.0 years"],
    0,
    "Payback Period = Initial Capital Investment / Annual Cash Inflow = R200,000 / R60,000 = 3.333 years, which corresponds to 3 years and 4 months."
)
add_q(
    "ebm_d2", "entrepreneurship", "nated_bus", "all", "statutory_compliance", "Statutory Registration (SARS, CIPC, COIDA)", "difficult",
    "Under South African income tax legislation, what tax regime allows qualifying micro-businesses with annual turnover under R1 million to pay a simplified single tax in place of income tax, CGT, and standard VAT?",
    ["Turnover Tax for Micro Businesses", "Small Business Corporation (SBC) Section 12E", "Pay As You Earn (PAYE)", "Capital Gains Tax (CGT)"],
    0,
    "Turnover Tax is an elective simplified tax regime administered by SARS for small qualifying micro-enterprises with a turnover of up to R1 million per year. It replaces income tax, capital gains tax, and standard VAT with a low progressive turnover levy."
)
add_q(
    "ebm_d3", "entrepreneurship", "nated_bus", "all", "operations_management", "Operations, Inventory & Staff Management", "difficult",
    "Using the Economic Order Quantity (EOQ) formula sqrt((2*D*S) / H), if annual demand D = 8,000 units, order cost S = R50 per order, and annual holding cost H = R5 per unit, what is the optimal order quantity?",
    ["400 units", "800 units", "200 units", "1,600 units"],
    0,
    "EOQ = sqrt((2 * D * S) / H) = sqrt((2 * 8,000 * 50) / 5) = sqrt(800,000 / 5) = sqrt(160,000) = 400 units per order."
)
add_q(
    "ebm_d4", "entrepreneurship", "nated_bus", "all", "marketing_mix", "Marketing Mix (4Ps) & Customer Targeting", "difficult",
    "When evaluating customer lifetime value (CLV) against customer acquisition cost (CAC), what standard ratio indicates a healthy, sustainable business model?",
    ["CLV should be at least 3 times CAC (3:1 or higher)", "CAC should exceed CLV by 2:1", "CLV and CAC must equal 1:1 exactly", "CAC must be zero"],
    0,
    "In venture finance and marketing economics, a CLV:CAC ratio of at least 3:1 is standard. A 1:1 ratio leaves zero margin for operating overheads, while <1:1 means the venture loses money on every acquired customer."
)
add_q(
    "ebm_d5", "entrepreneurship", "nated_bus", "all", "swot_strategy", "SWOT, PESTLE & Market Feasibility", "difficult",
    "An entrepreneur conducts a feasibility study using Net Present Value (NPV) at a 12% discount rate. Project A yields an NPV of +R45,000, while Project B yields an NPV of -R12,000. What is the correct financial decision?",
    ["Accept Project A because positive NPV increases the net wealth of the enterprise; reject Project B", "Accept Project B because negative NPV indicates tax savings", "Accept both projects because any investment builds market share", "Reject both projects"],
    0,
    "NPV discounts future expected cash flows back to present value using the cost of capital. A positive NPV (+R45,000) creates shareholder value above the required 12% return, while a negative NPV fails to recover the cost of capital and destroys value."
)
add_q(
    "ebm_d6", "entrepreneurship", "nated_bus", "all", "statutory_compliance", "Statutory Registration (SARS, CIPC, COIDA)", "difficult",
    "Which South African legal contract establishes the internal corporate governance, shareholder rights, and powers of directors for a registered Private Company?",
    ["Memorandum of Incorporation (MOI)", "Shareholders Agreement only", "Basic Conditions of Employment Act", "Company Annual Return"],
    0,
    "Under the Companies Act 71 of 2008, the Memorandum of Incorporation (MOI) is the foundational statutory document of every company, setting out rights, duties, and responsibilities of shareholders and directors."
)
add_q(
    "ebm_d7", "entrepreneurship", "nated_bus", "all", "operations_management", "Operations, Inventory & Staff Management", "difficult",
    "In total quality management (TQM), what does the continuous improvement philosophy 'Kaizen' emphasize?",
    ["Small, ongoing, incremental improvements involving employees at all levels of the enterprise", "Occasional radical organizational restructurings by external consultants", "Replacing human labor entirely with robotic automation", "Accepting a fixed 5% defect rate in finished goods"],
    0,
    "Originating in Japanese manufacturing, Kaizen is a business philosophy focusing on continuous, incremental improvements in operational efficiency, waste reduction, and quality through the proactive involvement of every team member."
)
add_q(
    "ebm_d8", "entrepreneurship", "nated_bus", "all", "swot_strategy", "SWOT, PESTLE & Market Feasibility", "difficult",
    "In business strategic planning, what is the key difference between a company's Vision statement and its Mission statement?",
    ["The Vision describes where the enterprise aspires to be in the long-term future, while the Mission describes its present core purpose, customers, and operations", "The Vision is for internal staff only, while the Mission is an advertisement", "The Mission is future-looking and the Vision is financial", "They are identical under South African King IV governance"],
    0,
    "A Mission statement defines the organization's present purpose, what it does, for whom, and how. A Vision statement articulates its aspirational long-term future state (what the company strives to become)."
)
add_q(
    "ebm_d9", "entrepreneurship", "nated_bus", "all", "financial_budgeting", "Cash Flow Budgets vs Profitability", "difficult",
    "A retail enterprise has an average debtor collection period of 60 days, while its trade suppliers demand payment within 30 days. If sales grow rapidly, what liquidity crisis is the firm at risk of encountering?",
    ["Overtrading (cash starvation caused by working capital deficits despite high sales growth)", "Under-capitalization of fixed machinery", "Involuntary deflation", "Excessive liquidity reserves"],
    0,
    "Overtrading occurs when a business expands sales too rapidly without adequate working capital. Because supplier outflows occur in 30 days while customer inflows take 60 days, working capital drains rapidly, potentially causing insolvency."
)
add_q(
    "ebm_d10", "entrepreneurship", "nated_bus", "all", "marketing_mix", "Marketing Mix (4Ps) & Customer Targeting", "difficult",
    "An entrepreneur develops a unique, patented agricultural sensor. Instead of manufacturing and distributing the sensor independently, the entrepreneur sells rights to an established global equipment company in return for 5% of gross wholesale turnover. What business model is being executed?",
    ["Technology Licensing & Royalty model", "Direct-to-consumer (D2C) retail", "Franchising", "Joint Venture partnership"],
    0,
    "In a licensing agreement, the intellectual property owner grants permission to an external commercial entity to manufacture, distribute, and sell the innovation in exchange for ongoing royalty fees (e.g. 5% of turnover), avoiding heavy capital expenditure."
)

print(f"Loaded {len(QUESTIONS)} questions so far (Maths + Science + Electrotechnics + Financial Accounting + Entrepreneurship).")

# =========================================================================
# 6. NATED MANAGEMENT COMMUNICATION (N4-N6)
# =========================================================================

# --- EASY (10 questions) ---
add_q(
    "comm_e1", "management_comm", "nated_bus", "all", "comm_theory", "Communication Process & Barriers", "easy",
    "In the fundamental linear communication model, what role does the 'encoder' play?",
    ["The sender who translates ideas and intentions into symbolic messages (words, symbols, graphics)", "The technological medium carrying the sound", "The recipient who interprets the message", "The static interference interrupting radio waves"],
    0,
    "Encoding is the cognitive process whereby the sender formulates thoughts, concepts, and intentions into a structured symbolic code or language for transmission."
)
add_q(
    "comm_e2", "management_comm", "nated_bus", "all", "comm_theory", "Communication Process & Barriers", "easy",
    "What term describes anything that distorts, interrupts, or impedes the clear transmission and understanding of a message?",
    ["Barrier or Noise", "Feedback loop", "Channel bandwidth", "Proxemics"],
    0,
    "Noise or barriers represent any psychological, physiological, physical, or semantic disruption that distorts the clarity or fidelity of the message between sender and receiver."
)
add_q(
    "comm_e3", "management_comm", "nated_bus", "all", "business_letters", "Business Letters, Memos & Email Etiquette", "easy",
    "What is the standard internal written communication tool used between departments within the same company?",
    ["Memorandum (Memo)", "Formal Business Letter with letterhead", "Press Release", "Notice of Annual General Meeting"],
    0,
    "A memorandum (memo) is designed for short, official internal communication within an organization between colleagues, managers, and departments, whereas formal letters are addressed to external stakeholders."
)
add_q(
    "comm_e4", "management_comm", "nated_bus", "all", "business_letters", "Business Letters, Memos & Email Etiquette", "easy",
    "What is the conventional complimentary close for a formal business letter that begins with the salutation 'Dear Sir' or 'Dear Madam'?",
    ["Yours faithfully", "Yours sincerely", "Cheers", "Warmest personal regards"],
    0,
    "In standard formal South African and British business English, letters opened with an impersonal salutation ('Dear Sir/Madam') must close with 'Yours faithfully'. Letters opened with a personal name ('Dear Mr Khumalo') close with 'Yours sincerely'."
)
add_q(
    "comm_e5", "management_comm", "nated_bus", "all", "meetings_procedures", "Meeting Notices, Agendas & Minutes", "easy",
    "What official document lists the chronological sequence of topics and business to be addressed during a formal business meeting?",
    ["Agenda", "Minutes", "Constitution", "Attendance register"],
    0,
    "An agenda is the structured, itemized list of matters, motions, and discussions planned for a meeting, distributed to attendees in advance alongside the formal notice."
)
add_q(
    "comm_e6", "management_comm", "nated_bus", "all", "meetings_procedures", "Meeting Notices, Agendas & Minutes", "easy",
    "What constitutes a 'quorum' in formal corporate and committee meetings?",
    ["The minimum number of voting members legally required to be present to validate proceedings", "The majority vote required to pass a resolution", "The official speech delivered by the chairperson", "The financial balance sheet presented by the treasurer"],
    0,
    "A quorum is the minimum statutory or constitutional threshold of qualified members who must be in attendance for business to be transacted and for resolutions to carry legal binding force."
)
add_q(
    "comm_e7", "management_comm", "nated_bus", "all", "report_writing", "Formal Reports & Terms of Reference", "easy",
    "Which section of a formal business report defines the exact scope, mandate, and parameters of the investigation assigned to the author?",
    ["Terms of Reference", "Executive Summary", "Appendix", "Table of Authorities"],
    0,
    "The Terms of Reference (TOR) specify who commissioned the report, the exact problem to be investigated, the parameters or boundaries of the investigation, and the deadline for submission."
)
add_q(
    "comm_e8", "management_comm", "nated_bus", "all", "report_writing", "Formal Reports & Terms of Reference", "easy",
    "In formal corporate reports, what grammatical person is conventionally used to maintain objectivity?",
    ["Third person (e.g. 'The committee investigated...', 'It was observed that...')", "First person singular ('I found that...')", "Second person ('You must look at...')", "First person plural ('We decided...')"],
    0,
    "Formal investigative reports require objective, neutral tone and are traditionally drafted in the third person or passive voice to avoid personal bias."
)
add_q(
    "comm_e9", "management_comm", "nated_bus", "all", "interpersonal_skills", "Non-Verbal Communication & Conflict Management", "easy",
    "What does the study of 'kinesics' focus on in non-verbal communication?",
    ["Body language, facial expressions, gestures, and eye movements", "The physical distance maintained between speakers (personal space)", "The vocal pitch and speech speed of the speaker", "The written font choices in printed documents"],
    0,
    "Kinesics is the study of non-verbal communication expressed through bodily movement, including posture, hand gestures, facial expressions, and eye contact."
)
add_q(
    "comm_e10", "management_comm", "nated_bus", "all", "interpersonal_skills", "Non-Verbal Communication & Conflict Management", "easy",
    "In active listening, what technique involves restating the speaker's main points in your own words to confirm mutual understanding?",
    ["Paraphrasing", "Interrupting", "Selective filtering", "Defensive listening"],
    0,
    "Paraphrasing is reflecting back the essence of the sender's message in the listener's own vocabulary, verifying accuracy and demonstrating genuine active listening without immediate judgment."
)

# --- MEDIUM (10 questions) ---
add_q(
    "comm_m1", "management_comm", "nated_bus", "all", "comm_theory", "Communication Process & Barriers", "medium",
    "When a senior technician uses complex engineering jargon with a junior finance clerk who misunderstands the message, what specific communication barrier has occurred?",
    ["Semantic barrier", "Physical barrier", "Physiological barrier", "Technological hardware breakdown"],
    0,
    "Semantic barriers arise when the sender uses vocabulary, technical terminology, acronyms, or symbols whose meanings are unfamiliar or ambiguous to the receiver, leading to misinterpretation."
)
add_q(
    "comm_m2", "management_comm", "nated_bus", "all", "meetings_procedures", "Meeting Notices, Agendas & Minutes", "medium",
    "In meeting procedure, what is the role of a 'proxy'?",
    ["An authorized representative appointed by an absent member to vote on their behalf", "The audio recording device used to capture proceedings", "An amendment proposed to cancel the previous motion", "The gavel used by the chairperson"],
    0,
    "A proxy is a formal legal authorization whereby a voting member who cannot personally attend a meeting appoints another individual to cast votes and represent their interests."
)
add_q(
    "comm_m3", "management_comm", "nated_bus", "all", "business_letters", "Business Letters, Memos & Email Etiquette", "medium",
    "When drafting a formal letter of complaint to a supplier regarding defective components, what tone and structure achieves the best commercial outcome?",
    ["Objective, professional tone detailing dates, part numbers, factual defects, and specific requested redress", "Aggressive, hostile threats to sue immediately", "Informal conversational slang with humorous sarcasm", "A one-line complaint demanding an immediate full refund with no proof"],
    0,
    "Effective business complaint letters adhere to constructive assertiveness: stating facts, reference numbers, delivery dates, exact discrepancies, and a clear, reasonable request for remedy (repair, replacement, or credit note)."
)
add_q(
    "comm_m4", "management_comm", "nated_bus", "all", "interpersonal_skills", "Non-Verbal Communication & Conflict Management", "medium",
    "According to Edward T. Hall's proxemics framework, what distance range defines 'Social Space' appropriate for impersonal business transactions and meetings?",
    ["1.2 meters to 3.6 meters (approx 4 to 12 feet)", "0 to 45 centimeters (intimate space)", "45 centimeters to 1.2 meters (personal space)", "Over 7 meters (public distance)"],
    0,
    "Hall classified spatial zones into Intimate (0-45 cm), Personal (45 cm - 1.2 m), Social (1.2 m - 3.6 m, standard for business discussions and meetings), and Public (>3.6 m, for large presentations)."
)
add_q(
    "comm_m5", "management_comm", "nated_bus", "all", "report_writing", "Formal Reports & Terms of Reference", "medium",
    "In a formal analytical report, where do the author's deductive conclusions and proposed practical solutions belong?",
    ["Conclusions summarize factual findings, and Recommendations propose future corrective actions", "Both must be placed inside the Terms of Reference", "Recommendations come before Findings", "Conclusions are written by the client, not the author"],
    0,
    "In professional report structure, the 'Findings' present objective gathered facts, the 'Conclusions' interpret what those facts mean, and the 'Recommendations' propose concrete, prioritized actionable steps."
)
add_q(
    "comm_m6", "management_comm", "nated_bus", "all", "comm_theory", "Communication Process & Barriers", "medium",
    "What is the downward communication flow in a formal corporate organizational hierarchy?",
    ["Information and directives traveling from executive leadership down to frontline operational employees", "Employees submitting grievances up to directors", "Communication between peer department managers at the same hierarchical tier", "Rumors circulating through the informal grapevine"],
    0,
    "Downward communication transmits organizational policies, instructions, job mandates, corporate strategies, and official feedback from senior management down to subordinate operational staff."
)
add_q(
    "comm_m7", "management_comm", "nated_bus", "all", "interpersonal_skills", "Non-Verbal Communication & Conflict Management", "medium",
    "In the Thomas-Kilmann Conflict Mode Instrument, which conflict handling mode seeks a win-win solution where both parties' vital needs are fully explored and satisfied?",
    ["Collaborating", "Competing (forcing)", "Avoiding", "Accommodating"],
    0,
    "Collaborating is both assertive and cooperative: both parties work together to discover creative integrative solutions that satisfy 100% of both sets of concerns (win-win), unlike compromise which requires mutual concessions."
)
add_q(
    "comm_m8", "management_comm", "nated_bus", "all", "meetings_procedures", "Meeting Notices, Agendas & Minutes", "medium",
    "What legal significance do approved and signed meeting minutes possess?",
    ["They serve as the official prima facie legal and historical record of decisions and actions taken by the body", "They are informal drafts that can be destroyed after one month", "They supersede national labor legislation", "They represent personal opinions of the recording secretary"],
    0,
    "Once verified, adopted, and signed by the chairperson, meeting minutes constitute prima facie evidence in law of the resolutions passed and decisions taken at a duly constituted meeting."
)
add_q(
    "comm_m9", "management_comm", "nated_bus", "all", "business_letters", "Business Letters, Memos & Email Etiquette", "medium",
    "In corporate electronic mail (email) communication, what is the professional purpose of the Blind Carbon Copy (BCC) field?",
    ["To send copies to multiple recipients while keeping their email addresses confidential from one another", "To guarantee that the email bypasses spam filters", "To send an automated read receipt", "To attach encrypted files"],
    0,
    "BCC conceals recipient addresses from other recipients, ensuring compliance with privacy standards (such as POPIA in South Africa) and preventing mass reply-all clutter."
)
add_q(
    "comm_m10", "management_comm", "nated_bus", "all", "interpersonal_skills", "Non-Verbal Communication & Conflict Management", "medium",
    "What vocal aspects are studied under 'paralanguage' in oral communication?",
    ["Tone of voice, pitch, pacing, volume, and pauses", "The grammatical structure of sentences", "The written layout of visual slides", "Facial micro-expressions"],
    0,
    "Paralanguage comprises vocal cues that accompany verbal speech (not the words themselves), including volume, pitch, vocal inflection, rate of speech, and meaningful pauses."
)

# --- DIFFICULT (10 questions) ---
add_q(
    "comm_d1", "management_comm", "nated_bus", "all", "comm_theory", "Communication Process & Barriers", "difficult",
    "How does the Shannon-Weaver mathematical model of communication differ fundamentally from modern transactional communication models?",
    ["Shannon-Weaver was primarily a linear, one-way transmission model, whereas transactional models view communication as continuous, simultaneous, and mutually influential", "Shannon-Weaver only applies to non-verbal cues", "Transactional models do not acknowledge feedback", "Shannon-Weaver was developed exclusively for interpersonal psychotherapy"],
    0,
    "Originally designed for telecommunications engineering in 1949, Shannon-Weaver framed communication as a linear pipeline (Source -> Transmitter -> Channel/Noise -> Receiver -> Destination). Modern transactional frameworks recognize that communicators simultaneously act as senders and receivers creating shared meaning."
)
add_q(
    "comm_d2", "management_comm", "nated_bus", "all", "meetings_procedures", "Meeting Notices, Agendas & Minutes", "difficult",
    "In formal committee procedure, what procedural distinction exists between a 'substantive motion' and a 'point of order'?",
    ["A substantive motion proposes an action or decision on the business topic, while a point of order challenges a breach of meeting rules or constitution", "A point of order is voted on by secret ballot while motions are not", "Substantive motions can only be made by the chairperson", "A point of order adjourns the meeting permanently"],
    0,
    "A substantive motion is a formal proposition put forward for debate and voting on an item on the agenda. A point of order draws the chairperson's immediate attention to an alleged violation of standing orders, constitution, or meeting protocol."
)
add_q(
    "comm_d3", "management_comm", "nated_bus", "all", "interpersonal_skills", "Non-Verbal Communication & Conflict Management", "difficult",
    "In cross-cultural management communication, how does a 'High-Context' communication culture (such as traditional African and Asian cultures) differ from a 'Low-Context' culture (such as Germanic or North American business cultures)?",
    ["High-context cultures rely heavily on shared history, non-verbal cues, and relationships, whereas low-context cultures prioritize explicit, direct, unambiguous verbal precision", "High-context cultures do not speak languages", "Low-context cultures never sign written contracts", "High-context cultures avoid interpersonal hierarchy"],
    0,
    "Anthropologist Edward T. Hall showed that in high-context communication, much of the meaning resides in the physical context, relational history, and non-verbal nuances. In low-context cultures, the message is explicitly spelled out in direct words, written contracts, and precise declarations."
)
add_q(
    "comm_d4", "management_comm", "nated_bus", "all", "business_letters", "Business Letters, Memos & Email Etiquette", "difficult",
    "A client disputes an outstanding R85,000 invoice due to delayed delivery. Under the South African Protection of Personal Information Act (POPIA) and formal debt collection ethics, what must a management credit adjustment letter strictly avoid?",
    ["Disclosing the debtor's private financial data or debt status to third parties or unauthorized staff", "Stating the original purchase order number", "Offering a structured settlement payment plan", "Providing the company's verified banking details"],
    0,
    "POPIA strictly prohibits the unlawful disclosure of a client's private personal information and financial records. Debt adjustment communications must be handled strictly between the authorized parties with data protection compliance."
)
add_q(
    "comm_d5", "management_comm", "nated_bus", "all", "report_writing", "Formal Reports & Terms of Reference", "difficult",
    "Why must an Executive Summary in a technical engineering report be written strictly after the entire report has been drafted, despite appearing on page one?",
    ["Because it must provide an accurate, self-contained condensation of the entire report including findings, conclusions, and strategic recommendations", "Because Word software corrupts summaries written early", "Because it is drafted exclusively by external auditors", "Because the table of contents dictates page numbers"],
    0,
    "An executive summary is a miniature version of the complete report for busy executives who may not read the full technical body. It can only accurately synthesize the methodologies, key findings, conclusions, and final recommendations once the full report is complete."
)
add_q(
    "comm_d6", "management_comm", "nated_bus", "all", "comm_theory", "Communication Process & Barriers", "difficult",
    "What psychological communication barrier occurs when an employee interprets a manager's neutral comment as a malicious personal attack because of past unresolved grievances?",
    ["Psychological perceptual projection and defensive filtering", "Semantic barrier", "Channel attenuation", "Physical distance noise"],
    0,
    "Perceptual bias and defensive filtering distort incoming communication through the lens of pre-existing emotional attitudes, past grievances, prejudices, or anxiety, preventing objective evaluation of the actual message."
)
add_q(
    "comm_d7", "management_comm", "nated_bus", "all", "interpersonal_skills", "Non-Verbal Communication & Conflict Management", "difficult",
    "In the Johari Window model of interpersonal communication, what does the 'Blind Spot' quadrant represent?",
    ["Information known to others about you, but unknown to yourself", "Information known to you, but hidden from others", "Information known to both you and others", "Information completely unknown to anyone"],
    0,
    "The Johari Window has four quadrants: Open/Arena (known to self & others), Blind Spot (known to others, unknown to self), Hidden/Façade (known to self, hidden from others), and Unknown (unknown to both)."
)
add_q(
    "comm_d8", "management_comm", "nated_bus", "all", "meetings_procedures", "Meeting Notices, Agendas & Minutes", "difficult",
    "What is the statutory requirement regarding notice periods for an Annual General Meeting (AGM) of a South African company under the Companies Act 71 of 2008?",
    ["At least 15 business days' notice for private companies (unless a longer period is specified in the MOI)", "24 hours' notice by WhatsApp", "No notice is required if a quorum attends", "Notice can only be published in the Government Gazette"],
    0,
    "Under Section 62 of the Companies Act, a company must deliver notice of a shareholders meeting at least 15 business days before the meeting is to begin (or 10 business days in the case of a private company with specific MOI rules), ensuring adequate preparation time."
)
add_q(
    "comm_d9", "management_comm", "nated_bus", "all", "report_writing", "Formal Reports & Terms of Reference", "difficult",
    "In empirical research and investigative business reports, what is the primary risk associated with relying exclusively on 'secondary data' without primary empirical verification?",
    ["Secondary data may be outdated, biased, gathered under different parameters, or unverified in your specific operational context", "Secondary data is illegal under copyright law", "Secondary data cannot be quoted in references", "Secondary data never contains statistical tables"],
    0,
    "Secondary data (published reports, articles, census data) was collected by third parties for different original objectives. Relying on it uncritically risks incorporating hidden biases, outmoded figures, or irrelevant context into current operational decisions."
)
add_q(
    "comm_d10", "management_comm", "nated_bus", "all", "interpersonal_skills", "Non-Verbal Communication & Conflict Management", "difficult",
    "In negotiation theory, what does the acronym BATNA represent, and why is it crucial for commercial negotiations?",
    ["Best Alternative To a Negotiated Agreement: it defines the benchmark minimum threshold below which you should walk away rather than accept a poor deal", "Business Accounting Tax Net Asset", "Baseline Annual Target for New Appointments", "Broadband Allocation for Telecommunications Network Access"],
    0,
    "Developed by Fisher and Ury in the Harvard Negotiation Project, BATNA (Best Alternative To a Negotiated Agreement) is your standard of comparison. Knowing your BATNA protects you from accepting an unfavorable agreement and gives you leverage during bargaining."
)

print(f"Loaded {len(QUESTIONS)} questions so far (Maths + Science + Electrotechnics + Financial Accounting + Entrepreneurship + Management Comm).")

# =========================================================================
# 7. NC(V) FITTING & TURNING / ENGINEERING FUNDAMENTALS (L2-L4)
# =========================================================================

# --- EASY (10 questions) ---
add_q(
    "fit_e1", "fitting_turning", "ncv", "all", "workshop_safety", "OHS Act Safety & Hazard Prevention", "easy",
    "What is the first fundamental safety rule before performing any maintenance, cleaning, or blade change on an electrical workshop machine?",
    ["Isolate and lock out / tag out the electrical power source", "Put on gloves while the spindle is still spinning", "Call the workshop foreman after finishing", "Spray lubricant over the electrical motor"],
    0,
    "The primary OHS safety protocol mandates complete electrical isolation (Lock-Out / Tag-Out) to eliminate the risk of accidental startup while working on machine components."
)
add_q(
    "fit_e2", "fitting_turning", "ncv", "all", "workshop_safety", "OHS Act Safety & Hazard Prevention", "easy",
    "Why must workshop technicians strictly avoid wearing loose-fitting clothing, ties, neck chains, or rings when operating a center lathe or drilling machine?",
    ["They present severe entanglement hazards with rotating chucks and spindles, risking catastrophic injury or amputation", "They get stained with soluble cutting oil", "They violate the formal corporate dress code", "They reduce electrical insulation on the floor"],
    0,
    "Rotating spindles, chucks, and lead screws generate intense rotational suction that can instantly snag loose sleeves, ties, or jewelry, violently pulling the operator into the machinery."
)
add_q(
    "fit_e3", "fitting_turning", "ncv", "all", "precision_measurement", "Vernier Calipers & Micrometer Reading", "easy",
    "What is the standard measurement resolution (accuracy) of a typical metric outside micrometer?",
    ["0.01 mm (one-hundredth of a millimeter)", "0.1 mm", "1.0 mm", "0.0001 mm"],
    0,
    "Standard metric micrometers have a spindle thread pitch of 0.5 mm with a thimble graduated into 50 equal divisions around its circumference, yielding 0.5 mm / 50 = 0.01 mm resolution."
)
add_q(
    "fit_e4", "fitting_turning", "ncv", "all", "precision_measurement", "Vernier Calipers & Micrometer Reading", "easy",
    "What is the purpose of the ratchet stop at the end of a precision micrometer thimble?",
    ["To ensure uniform, repeatable measuring pressure and prevent over-tightening the spindle on the workpiece", "To lock the spindle permanently during storage", "To zero the sleeve markings", "To adjust the vernier scale depth gauge"],
    0,
    "The ratchet stop slips with an audible click when the calibrated contact force is reached, preventing operator-induced deformation of the workpiece or anvil strain."
)
add_q(
    "fit_e5", "fitting_turning", "ncv", "all", "engineering_materials", "Materials, Ferrous Metals & Heat Treatment", "easy",
    "What core element differentiates ferrous metals from non-ferrous metals in engineering metallurgy?",
    ["Ferrous metals contain iron as their main constituent, whereas non-ferrous metals contain no significant iron", "Ferrous metals never conduct electricity", "Non-ferrous metals are always magnetic", "Ferrous metals have much lower melting points than copper"],
    0,
    "Ferrous metals (such as mild steel, cast iron, and tool steel) are iron-based and generally magnetic and susceptible to rust. Non-ferrous metals (such as aluminum, brass, copper, and bronze) contain no iron base."
)
add_q(
    "fit_e6", "fitting_turning", "ncv", "all", "engineering_materials", "Materials, Ferrous Metals & Heat Treatment", "easy",
    "What thermal heat treatment process is used to soften hardened steel, relieve internal stresses, and refine its crystal grain structure?",
    ["Annealing", "Quenching", "Carburizing", "Cold rolling"],
    0,
    "Annealing involves heating the steel to above its critical transformation temperature, soaking it, and cooling it very slowly (typically inside a furnace), softening the metal for easy machining."
)
add_q(
    "fit_e7", "fitting_turning", "ncv", "all", "lathe_machining", "Lathe Operations, Cutting Speeds & Tooling", "easy",
    "What lathe machining operation produces a flat, smooth, perpendicular surface at the end of a cylindrical workpiece?",
    ["Facing", "Knurling", "Taper turning", "Parting off"],
    0,
    "Facing involves feeding the cutting tool radially across the end face of the revolving workpiece perpendicular to the lathe bed axis, producing a flat, square datum face."
)
add_q(
    "fit_e8", "fitting_turning", "ncv", "all", "lathe_machining", "Lathe Operations, Cutting Speeds & Tooling", "easy",
    "What primary purpose does soluble cutting fluid (coolant) serve during heavy lathe turning operations?",
    ["It lubricates the chip-tool interface and carries away frictional heat to prolong tool life and preserve surface finish", "It softens the steel chemically", "It prevents the motor from stalling", "It cleans the lathe bed ways permanently"],
    0,
    "Cutting fluid cools both the cutting tool and workpiece, reduces friction between chip and rake face, washes away metal chips, and prevents thermal distortion."
)
add_q(
    "fit_e9", "fitting_turning", "ncv", "all", "precision_measurement", "Vernier Calipers & Micrometer Reading", "easy",
    "Which part of a metric vernier caliper is specifically designed to measure internal bore diameters and hole widths?",
    ["Internal measuring nibs / upper jaws", "Main external lower jaws", "Depth gauge rod at the rear", "Locking thumbscrew"],
    0,
    "The upper internal jaws (nibs) of a vernier caliper are ground with outer knife-edges specifically to measure internal diameters of cylinders, bores, and slot widths."
)
add_q(
    "fit_e10", "fitting_turning", "ncv", "all", "engineering_materials", "Materials, Ferrous Metals & Heat Treatment", "easy",
    "Why is high-carbon steel subjected to 'tempering' immediately after undergoing rapid water or oil quenching?",
    ["To reduce excessive brittleness and relieve internal stress while retaining hardness and toughness", "To make the steel completely soft like lead", "To increase carbon content on the surface", "To paint the metal chemically"],
    0,
    "Quenched martensitic steel is extremely hard but dangerously brittle like glass. Tempering (reheating to between 200°C and 350°C and cooling) reduces brittleness and imparts required operational toughness."
)

# --- MEDIUM (10 questions) ---
add_q(
    "fit_m1", "fitting_turning", "ncv", "all", "lathe_machining", "Lathe Operations, Cutting Speeds & Tooling", "medium",
    "A 50 mm diameter mild steel shaft is to be turned at a recommended cutting speed of 30 m/min. What spindle rotational speed in RPM should be selected? (Formula: N = (1,000 * V) / (pi * D))",
    ["191 RPM", "300 RPM", "600 RPM", "150 RPM"],
    0,
    "N = (1,000 * V) / (pi * D) = (1,000 * 30) / (3.1416 * 50) = 30,000 / 157.08 ≈ 190.98 ≈ 191 RPM."
)
add_q(
    "fit_m2", "fitting_turning", "ncv", "all", "precision_measurement", "Vernier Calipers & Micrometer Reading", "medium",
    "On a standard metric vernier caliper, the main beam is graduated in millimeters (1 mm) and the vernier plate has 50 equal divisions spanning 49 mm. What is the reading accuracy (least count)?",
    ["0.02 mm", "0.05 mm", "0.01 mm", "0.5 mm"],
    0,
    "Least Count = 1 Main Scale Division - 1 Vernier Division = 1.0 mm - (49 / 50) mm = 1.0 - 0.98 mm = 0.02 mm."
)
add_q(
    "fit_m3", "fitting_turning", "ncv", "all", "workshop_safety", "OHS Act Safety & Hazard Prevention", "medium",
    "Under the General Machinery Regulations of the OHS Act in South Africa, what safety device is legally mandatory on all bench grinders?",
    ["An adjustable tool rest set within 3 mm of the abrasive wheel and a shatterproof eye shield", "A water cooling bath submerged under the motor", "A leather dust cover placed over the wheel during grinding", "A remote emergency telephone next to the switch"],
    0,
    "The OHS Act requires an adjustable tool rest maintained at no more than 3 mm clearance from the wheel face (to prevent work from being trapped), along with safety transparent eye visors."
)
add_q(
    "fit_m4", "fitting_turning", "ncv", "all", "engineering_materials", "Materials, Ferrous Metals & Heat Treatment", "medium",
    "What surface engineering process introduces carbon into the outer skin of low-carbon mild steel at elevated temperature so that only the case hardens while the core remains tough and shock-resistant?",
    ["Case hardening / Carburizing", "Full through-hardening", "Normalizing", "Spheroidizing"],
    0,
    "Mild steel has insufficient carbon (<0.25% C) to harden by quenching. Carburizing diffuses carbon into the surface layer at 900°C, producing a wear-resistant high-carbon outer 'case' around a ductile, shock-absorbing low-carbon core."
)
add_q(
    "fit_m5", "fitting_turning", "ncv", "all", "lathe_machining", "Lathe Operations, Cutting Speeds & Tooling", "medium",
    "Which lathe workholding accessory is ideal for accurately holding irregular, non-cylindrical, or rectangular metal castings for turning?",
    ["Four-jaw independent chuck", "Three-jaw self-centering scroll chuck", "Collet chuck", "Magnetic chuck"],
    0,
    "In a 4-jaw independent chuck, each jaw is moved individually by its own lead screw, allowing asymmetric, square, rectangular, and off-center workpieces to be gripped and aligned using a dial test indicator."
)
add_q(
    "fit_m6", "fitting_turning", "ncv", "all", "precision_measurement", "Vernier Calipers & Micrometer Reading", "medium",
    "A 25-50 mm metric outside micrometer shows a zero reading error where the thimble zero line is 0.02 mm past the datum line when fully closed onto the 25 mm test standard (negative zero error). If an object reads 38.45 mm, what is the corrected measurement?",
    ["38.47 mm", "38.43 mm", "38.45 mm", "38.25 mm"],
    0,
    "When a tool has a negative zero error (-0.02 mm), it under-reads the true dimension by 0.02 mm. The correction requires adding the error: Corrected Dimension = Observed (38.45) + 0.02 = 38.47 mm."
)
add_q(
    "fit_m7", "fitting_turning", "ncv", "all", "lathe_machining", "Lathe Operations, Cutting Speeds & Tooling", "medium",
    "What method of taper turning on a center lathe is most suitable for cutting steep, short tapers (such as chamfers and bevels up to 45°)?",
    ["Swivelling the compound slide (top slide)", "Offsetting the tailstock body", "Using the automatic cross-feed only", "Bending the boring bar"],
    0,
    "Swivelling the compound rest to the desired half-angle and feeding the tool manually along the compound slide is ideal for steep, short tapers up to 45° or more, though longitudinal feed is limited by top-slide travel."
)
add_q(
    "fit_m8", "fitting_turning", "ncv", "all", "engineering_materials", "Materials, Ferrous Metals & Heat Treatment", "medium",
    "What mechanical property represents a metal's ability to resist indentation, scratching, and abrasive wear?",
    ["Hardness", "Ductility", "Malleability", "Elasticity"],
    0,
    "Hardness is the property of a material enabling it to resist surface indentation, penetration, and abrasion (measured via Brinell, Rockwell, or Vickers tests). Ductility is the ability to be drawn into wire."
)
add_q(
    "fit_m9", "fitting_turning", "ncv", "all", "workshop_safety", "OHS Act Safety & Hazard Prevention", "medium",
    "What class of fire extinguisher is strictly designated and certified for suppressing electrical fires involving live energized equipment in an engineering workshop?",
    ["Carbon Dioxide (CO2) or Dry Chemical Powder (Class C/E)", "Water stream (Class A)", "Foam extinguisher (Class B)", "Wet chemical spray"],
    0,
    "Water conducts electricity and creates lethal shock risks. CO2 and Dry Powder are non-conductive and starve the fire of oxygen without short-circuiting live electrical components."
)
add_q(
    "fit_m10", "fitting_turning", "ncv", "all", "lathe_machining", "Lathe Operations, Cutting Speeds & Tooling", "medium",
    "Why must a lathe turning tool be positioned with its cutting tip set exactly at the workpiece center line axis height?",
    ["Setting below center causes the tool to dig in and rub, while setting above center reduces clearance and causes tool deflection and poor finish", "To save electrical energy", "To prevent the lathe chuck from unscrewing", "To allow reverse motor rotation"],
    0,
    "Tool height dictates effective rake and clearance angles. Setting off-center alters the cutting geometry: if below center the tool tends to rub and ride under the cut; if above center the front clearance angle drops to zero, producing chatter."
)

# --- DIFFICULT (10 questions) ---
add_q(
    "fit_d1", "fitting_turning", "ncv", "all", "lathe_machining", "Lathe Operations, Cutting Speeds & Tooling", "difficult",
    "A 200 mm long shaft requires a taper over its full length, tapering from a major diameter D = 48 mm down to minor diameter d = 40 mm. Using the tailstock offset method (Offset = L * (D - d) / (2 * L_taper)), what tailstock offset x is required?",
    ["4.0 mm", "8.0 mm", "2.0 mm", "1.0 mm"],
    0,
    "When the taper spans the full length (L = L_taper = 200 mm): Tailstock Offset x = (D - d) / 2 = (48 - 40) / 2 = 8 / 2 = 4.0 mm."
)
add_q(
    "fit_d2", "fitting_turning", "ncv", "all", "precision_measurement", "Vernier Calipers & Micrometer Reading", "difficult",
    "In precision engineering metrology, what instrument combination is used with a 100 mm sine bar to measure an exact angular taper of 30° on a hardened gauge block?",
    ["Gauge blocks (slip gauges) calculated by height H = L * sin(theta) = 100 * sin(30°) = 50.000 mm, along with a surface plate and dial test indicator", "A standard protractor and steel rule", "A 150 mm outside micrometer", "A magnetic spirit level"],
    0,
    "A sine bar establishes precision angles using trigonometry: sin(theta) = H / L -> H = L * sin(theta) = 100 mm * 0.5000 = 50.000 mm. Precision slip gauges wrung to 50.000 mm elevate one cylinder above the granite surface plate."
)
add_q(
    "fit_d3", "fitting_turning", "ncv", "all", "lathe_machining", "Lathe Operations, Cutting Speeds & Tooling", "difficult",
    "When cutting a metric single-start screw thread with a pitch of 2.5 mm on an engine lathe with an 8 TPI (threads per inch) lead screw, why must the half-nut remain engaged (or the threading dial indicator followed precisely) during multi-pass threading?",
    ["To ensure the cutting tool tracks precisely into the exact same thread helix path on successive passes without cross-threading", "To prevent motor overheating", "To lubricate the carriage feed gears", "To reverse the rotation of the workpiece"],
    0,
    "Engaging the half-nut locks the carriage travel in exact mechanical synchronism with the spindle rotation. Disengaging arbitrarily on non-integral gear ratios would cause the tool to re-enter out of phase, destroying the thread pitch."
)
add_q(
    "fit_d4", "fitting_turning", "ncv", "all", "engineering_materials", "Materials, Ferrous Metals & Heat Treatment", "difficult",
    "In the iron-carbon equilibrium phase diagram, what crystalline phase structure forms when medium-carbon steel is heated above the upper critical temperature (A3 line, approx 723°C–910°C)?",
    ["Austenite (face-centered cubic gamma-iron)", "Ferrite (body-centered cubic alpha-iron)", "Martensite", "Cementite (iron carbide)"],
    0,
    "Heating steel above its upper critical transformation temperature changes its crystal lattice from body-centered cubic (BCC ferrite) to face-centered cubic (FCC austenite), allowing high carbon solubility prior to hardening."
)
add_q(
    "fit_d5", "fitting_turning", "ncv", "all", "precision_measurement", "Vernier Calipers & Micrometer Reading", "difficult",
    "What engineering term describes a fit system where a shaft of diameter 40.025 mm is assembled into a bore (hole) of diameter 40.000 mm, requiring thermal expansion or hydraulic press fitting?",
    ["Interference fit", "Clearance fit", "Transition fit", "Running loose fit"],
    0,
    "In an interference fit, the minimum shaft diameter exceeds the maximum hole diameter. The assembly results in permanent mechanical compression and grip without keyways, requiring press fitting or freeze-fitting."
)
add_q(
    "fit_d6", "fitting_turning", "ncv", "all", "lathe_machining", "Lathe Operations, Cutting Speeds & Tooling", "difficult",
    "Why does high-speed steel (HSS) lose its cutting hardness above approximately 600°C, whereas tungsten carbide inserts can operate reliably at cutting temperatures up to 1,000°C?",
    ["Tungsten carbide possesses superior 'red hardness' (hot hardness) and thermal stability, resisting thermal softening and crater wear at high speeds", "Carbide is softer than high speed steel", "High speed steel contains no tungsten", "Carbide dissolves cutting fluids"],
    0,
    "Red hardness (hot hardness) is the ability to retain cutting edge hardness at red-heat temperatures generated by high-speed friction. Sintered tungsten carbide retains high compressive strength and micro-hardness up to 1,000°C."
)
add_q(
    "fit_d7", "fitting_turning", "ncv", "all", "engineering_materials", "Materials, Ferrous Metals & Heat Treatment", "difficult",
    "What destructive phenomenon occurs when rotating engineering components (like crankshafts or turbine shafts) are subjected to millions of cyclic stress reversals below their ultimate tensile strength?",
    ["Fatigue failure initiated by micro-cracks at stress concentration notches", "Creep deformation at ambient room temperature", "Hydrogen embrittlement from oil", "Galvanic bimetallic corrosion"],
    0,
    "Fatigue failure occurs when dynamic cyclic loads cause progressive microscopic crack propagation from surface stress raisers (keyways, sharp radii, scratches) until the remaining cross-section abruptly fractures under normal service loads."
)
add_q(
    "fit_d8", "fitting_turning", "ncv", "all", "precision_measurement", "Vernier Calipers & Micrometer Reading", "difficult",
    "In the ISO 286 limit and fit tolerance specification '50 H7/g6', what does the symbol 'H7' designate?",
    ["A hole tolerance class with fundamental deviation zero (lower limit at nominal 50.000 mm) and IT7 tolerance grade", "A shaft tolerance grade with negative clearance", "A hardened surface treatment depth of 7 mm", "A hydraulic high-pressure fitting"],
    0,
    "In the ISO system, uppercase letters designate holes ('H' indicates the lower limit equals nominal basic size). '7' specifies the International Tolerance Grade (IT7). The lowercase 'g6' specifies the mating shaft with an allowance for running clearance."
)
add_q(
    "fit_d9", "fitting_turning", "ncv", "all", "workshop_safety", "OHS Act Safety & Hazard Prevention", "difficult",
    "Under South African safety legislation, what is the maximum permissible continuous noise exposure level permitted in a manufacturing workshop over an 8-hour shift before mandatory hearing protection (earmuffs/earplugs) must be enforced?",
    ["85 dBA (decibels A-weighted)", "105 dBA", "65 dBA", "120 dBA"],
    0,
    "The Noise-Induced Hearing Loss Regulations under the OHS Act establish an occupational exposure limit of 85 dBA. Employers must demarcate noise zones and provide approved hearing PPE where levels equal or exceed 85 dBA."
)
add_q(
    "fit_d10", "fitting_turning", "ncv", "all", "lathe_machining", "Lathe Operations, Cutting Speeds & Tooling", "difficult",
    "When boring a deep internal cylinder on a center lathe, severe vibration and cutting chatter occur. What corrective machining adjustment directly dampens this vibration?",
    ["Shortening the boring bar overhang as much as possible, selecting a larger diameter bar, and reducing cutting speed", "Increasing spindle speed to maximum RPM", "Extending the boring bar further out of the tool post", "Applying a dry cut with no lubrication"],
    0,
    "Boring bar deflection increases with the cube of overhang length (Deflection proportional to L^3). Minimizing overhang, maximizing bar diameter/rigidity, and lowering rotational speed effectively suppresses regenerative chatter vibration."
)

print(f"Loaded {len(QUESTIONS)} questions so far (7 subjects).")
