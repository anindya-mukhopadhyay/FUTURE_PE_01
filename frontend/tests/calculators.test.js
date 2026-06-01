import { describe, it, expect } from 'vitest';
import {
  calculateBmiScore,
  calculateBmrScore,
  calculateCalorieScore,
  calculateWaterScore,
  calculateBodyFatScore
} from '../src/utils/calculations';

describe('Newtown Fitness Gym Calculators Math Suite', () => {
  
  it('should compute BMI correctly proportional to weight & height', () => {
    // 70kg at 175cm -> BMI ~ 22.9
    const score = calculateBmiScore(70, 175);
    expect(score).toBe(22.9);
  });

  it('should compute BMR properly for both genders', () => {
    // Male: 70kg, 175cm, 25 years old
    const maleBmr = calculateBmrScore(70, 175, 25, 'male');
    expect(maleBmr).toBe(1724);

    // Female: 60kg, 165cm, 30 years old
    const femaleBmr = calculateBmrScore(60, 165, 30, 'female');
    expect(femaleBmr).toBe(1384);
  });

  it('should calculate active calorie requirements correctly', () => {
    // BMR 1724, moderately active (1.55) -> ~2672 kcal
    const calories = calculateCalorieScore(1724, '1.55');
    expect(calories).toBe(2672);
  });

  it('should compute water intake target properly including exercise minutes', () => {
    // 70kg weight, 45 mins exercise -> 70*35 + (45/30)*350 = 2450 + 525 = 2975 ml -> 3.0L
    const liters = calculateWaterScore(70, 45);
    expect(liters).toBe(3.0);
  });

  it('should calculate Body Fat Percentage correctly via Navy formulas', () => {
    // Male: 175cm height, 85cm waist, 38cm neck
    const fatPercent = calculateBodyFatScore('male', 85, 38, 175);
    expect(fatPercent).toBe(23.5);
  });

});
