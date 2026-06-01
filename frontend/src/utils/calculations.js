export const calculateBmiScore = (weight, height) => {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

export const calculateBmrScore = (weight, height, age, gender) => {
  if (gender === 'male') {
    return Math.round(88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age));
  } else {
    return Math.round(447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age));
  }
};

export const calculateCalorieScore = (bmr, activityMultiplier) => {
  return Math.round(bmr * parseFloat(activityMultiplier));
};

export const calculateWaterScore = (weight, exerciseMinutes) => {
  const basicWater = weight * 35;
  const exerciseWater = (exerciseMinutes / 30) * 350;
  return Number(((basicWater + exerciseWater) / 1000).toFixed(1));
};

export const calculateBodyFatScore = (gender, waist, neck, height, hip = 90) => {
  let bodyFat = 0;
  if (gender === 'male') {
    bodyFat = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
  } else {
    bodyFat = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
  }
  return Number(Math.max(2, bodyFat).toFixed(1));
};
