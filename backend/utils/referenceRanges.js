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

  // Add more ranges as needed (e.g., creatinine, TSH, etc.)

  return ranges;
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