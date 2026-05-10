// utils/referenceRanges.js

/**
 * Get age and gender-adjusted reference ranges for common lab tests
 * Based on Mayo Clinic and NIH guidelines
 * @param {number} age - Age in years
 * @param {string} gender - 'male', 'female', 'other'
 * @returns {object} Reference ranges for common tests
 */
export function getReferenceRanges(age, gender) {
  const ranges = {};

  // Hemoglobin (g/dL)
  if (gender === 'female') {
    if (age >= 12 && age <= 49) ranges.hemoglobin = { min: 12.0, max: 15.5 };
    else if (age >= 50) ranges.hemoglobin = { min: 12.0, max: 15.5 }; // Same as adult
    else if (age >= 6 && age < 12) ranges.hemoglobin = { min: 11.5, max: 15.5 };
    else if (age >= 2 && age < 6) ranges.hemoglobin = { min: 11.0, max: 14.0 };
    else ranges.hemoglobin = { min: 9.5, max: 14.0 }; // Infants
  } else if (gender === 'male') {
    if (age >= 12) ranges.hemoglobin = { min: 13.5, max: 17.5 };
    else if (age >= 6 && age < 12) ranges.hemoglobin = { min: 11.5, max: 15.5 };
    else if (age >= 2 && age < 6) ranges.hemoglobin = { min: 11.0, max: 14.0 };
    else ranges.hemoglobin = { min: 9.5, max: 14.0 };
  } else {
    // Other/unknown: use average
    ranges.hemoglobin = { min: 12.0, max: 16.0 };
  }

  // Glucose (mg/dL, fasting)
  ranges.glucose = { min: 70, max: 100 };
  if (age >= 65) ranges.glucose = { min: 70, max: 110 }; // Elderly adjustment

  // Cholesterol Total (mg/dL)
  ranges.cholesterol = { min: 0, max: 200 }; // Desirable
  ranges.hdl = gender === 'male' ? { min: 40, max: 999 } : { min: 50, max: 999 };
  ranges.ldl = { min: 0, max: 100 };
  ranges.triglycerides = { min: 0, max: 150 };
  ranges.a1c = { min: 4.0, max: 5.6 };
  ranges.wbc = { min: 4.0, max: 11.0 };
  ranges.platelets = { min: 150, max: 450 };
  ranges.hematocrit = gender === 'male' ? { min: 41, max: 50 } : { min: 36, max: 44 };
  ranges.creatinine = gender === 'male' ? { min: 0.74, max: 1.35 } : { min: 0.59, max: 1.04 };
  ranges.egfr = { min: 60, max: 999 };
  ranges.tsh = { min: 0.4, max: 4.0 };
  ranges.alt = { min: 7, max: 56 };
  ranges.ast = { min: 10, max: 40 };
  ranges.ferritin = gender === 'female' ? { min: 12, max: 150 } : { min: 24, max: 336 };
  ranges.vitaminD = { min: 20, max: 100 };
  if (gender === 'male') {
    ranges.psa = age >= 50 ? { min: 0, max: 4.0 } : { min: 0, max: 2.5 };
    ranges.testosterone = { min: 300, max: 1000 };
  }

  // Add more ranges as needed (e.g., creatinine, TSH, etc.)

  return ranges;
}

export function colorCodeLabs(labResults = {}, referenceRanges = {}) {
  return Object.entries(labResults).reduce((acc, [marker, result]) => {
    const value = typeof result === "object" ? Number(result.value) : Number(result);
    const range = referenceRanges[marker];

    if (!Number.isFinite(value) || !range) {
      acc[marker] = { status: "Unknown", value: result, message: "No reference range available" };
      return acc;
    }

    if (value < range.min || value > range.max) {
      const distance = value < range.min ? range.min - value : value - range.max;
      const span = Math.max(range.max - range.min, 1);
      acc[marker] = {
        status: distance / span > 0.25 ? "Red" : "Yellow",
        value: result,
        range,
      };
      return acc;
    }

    acc[marker] = { status: "Green", value: result, range };
    return acc;
  }, {});
}

/**
 * Get menstrual cycle insights if applicable
 * @param {object} input - User input
 * @returns {string} Cycle insights or empty string
 */
export function getMenstrualInsights(input) {
  if (input.gender !== 'female' || !input.menstrualCycle) return '';

  const cycle = input.menstrualCycle;
  let insights = '';

  if (cycle.lastPeriod && cycle.cycleLength) {
    const lastPeriod = new Date(cycle.lastPeriod);
    const now = new Date();
    const daysSince = Math.floor((now - lastPeriod) / (1000 * 60 * 60 * 24));
    const cycleDay = daysSince % cycle.cycleLength;

    insights += `Menstrual cycle: Day ${cycleDay} of ${cycle.cycleLength}-day cycle. `;

    if (cycleDay <= 5) insights += 'Early follicular phase - estrogen rising. ';
    else if (cycleDay <= 14) insights += 'Late follicular phase - ovulation approaching. ';
    else if (cycleDay <= 21) insights += 'Luteal phase - progesterone dominant. ';
    else insights += 'Late luteal phase - pre-menstrual. ';

    if (cycle.symptoms && cycle.symptoms.length > 0) {
      insights += `Reported symptoms: ${cycle.symptoms.join(', ')}. `;
    }
  }

  return insights;
}
