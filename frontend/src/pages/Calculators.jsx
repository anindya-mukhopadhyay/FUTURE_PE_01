import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWeight, FaFireAlt, FaTint, FaCalculator, FaPercent } from 'react-icons/fa';

export default function Calculators() {
  const [activeTab, setActiveTab] = useState('bmi'); // 'bmi', 'bmr', 'calorie', 'water', 'fat'

  // BMI state
  const [bmiHeight, setBmiHeight] = useState(175); // cm
  const [bmiWeight, setBmiWeight] = useState(70); // kg
  const [bmiResult, setBmiResult] = useState(null);

  // BMR state
  const [bmrAge, setBmrAge] = useState(25);
  const [bmrGender, setBmrGender] = useState('male');
  const [bmrHeight, setBmrHeight] = useState(175);
  const [bmrWeight, setBmrWeight] = useState(70);
  const [bmrResult, setBmrResult] = useState(null);

  // Calorie state
  const [calActivity, setCalActivity] = useState('1.55'); // active multiplier
  const [calResult, setCalResult] = useState(null);

  // Water state
  const [waterWeight, setWaterWeight] = useState(70);
  const [waterExercise, setWaterExercise] = useState(45); // minutes
  const [waterResult, setWaterResult] = useState(null);

  // Body Fat state
  const [fatGender, setFatGender] = useState('male');
  const [fatHeight, setFatHeight] = useState(175);
  const [fatNeck, setFatNeck] = useState(38);
  const [fatWaist, setFatWaist] = useState(85);
  const [fatHip, setFatHip] = useState(90); // for female
  const [fatResult, setFatResult] = useState(null);

  // Calculation Functions
  const calculateBMI = (e) => {
    e.preventDefault();
    const heightInMeters = bmiHeight / 100;
    const bmi = (bmiWeight / (heightInMeters * heightInMeters)).toFixed(1);
    let category = '';
    let color = '';

    if (bmi < 18.5) { category = 'Underweight'; color = '#3498db'; }
    else if (bmi >= 18.5 && bmi < 25) { category = 'Normal Weight'; color = '#2ecc71'; }
    else if (bmi >= 25 && bmi < 30) { category = 'Overweight'; color = '#f1c40f'; }
    else { category = 'Obese'; color = '#e74c3c'; }

    setBmiResult({ score: bmi, category, color });
  };

  const calculateBMR = (e) => {
    e.preventDefault();
    let bmr = 0;
    if (bmrGender === 'male') {
      bmr = 88.362 + (13.397 * bmrWeight) + (4.799 * bmrHeight) - (5.677 * bmrAge);
    } else {
      bmr = 447.593 + (9.247 * bmrWeight) + (3.098 * bmrHeight) - (4.330 * bmrAge);
    }
    const finalBmr = Math.round(bmr);
    setBmrResult(finalBmr);
    
    // Auto-calculate Calorie intake based on current BMR
    const cal = Math.round(finalBmr * parseFloat(calActivity));
    setCalResult(cal);
  };

  const calculateWater = (e) => {
    e.preventDefault();
    // Formula: Weight in kg * 35 ml + 350 ml per 30 mins exercise
    const basicWater = waterWeight * 35;
    const exerciseWater = (waterExercise / 30) * 350;
    const totalLiters = ((basicWater + exerciseWater) / 1000).toFixed(1);
    setWaterResult(totalLiters);
  };

  const calculateBodyFat = (e) => {
    e.preventDefault();
    let bodyFat = 0;
    
    if (fatGender === 'male') {
      // US Navy Formula
      bodyFat = 86.010 * Math.log10(fatWaist - fatNeck) - 70.041 * Math.log10(fatHeight) + 36.76;
    } else {
      bodyFat = 163.205 * Math.log10(fatWaist + fatHip - fatNeck) - 97.684 * Math.log10(fatHeight) - 78.387;
    }
    
    const score = Math.max(2, bodyFat).toFixed(1);
    let category = '';
    if (fatGender === 'male') {
      if (score < 6) category = 'Essential Fat';
      else if (score < 14) category = 'Athletic Split';
      else if (score < 18) category = 'Fitness Range';
      else if (score < 25) category = 'Average';
      else category = 'High Bodyfat';
    } else {
      if (score < 14) category = 'Essential Fat';
      else if (score < 21) category = 'Athletic Split';
      else if (score < 25) category = 'Fitness Range';
      else if (score < 32) category = 'Average';
      else category = 'High Bodyfat';
    }

    setFatResult({ score, category });
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '120px 20px 80px 20px',
      background: 'radial-gradient(circle at center, #111111 0%, #000000 100%)'
    }}>
      <div className="container">
        
        <div className="section-title">
          <h2>Fitness <span>Calculators</span></h2>
          <p>Scientific diagnostic calculators to assess physical stats, metabolic logs, and fitness targets.</p>
        </div>

        {/* TAB CONTROLS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '10px',
          maxWidth: '800px',
          margin: '0 auto 40px auto'
        }} className="calc-tabs">
          <button
            onClick={() => setActiveTab('bmi')}
            style={activeTab === 'bmi' ? activeTabStyle : tabStyle}
          >
            <FaWeight />
            <span>BMI</span>
          </button>
          <button
            onClick={() => setActiveTab('bmr')}
            style={activeTab === 'bmr' ? activeTabStyle : tabStyle}
          >
            <FaCalculator />
            <span>BMR</span>
          </button>
          <button
            onClick={() => setActiveTab('calorie')}
            style={activeTab === 'calorie' ? activeTabStyle : tabStyle}
          >
            <FaFireAlt />
            <span>Calorie</span>
          </button>
          <button
            onClick={() => setActiveTab('water')}
            style={activeTab === 'water' ? activeTabStyle : tabStyle}
          >
            <FaTint />
            <span>Water</span>
          </button>
          <button
            onClick={() => setActiveTab('fat')}
            style={activeTab === 'fat' ? activeTabStyle : tabStyle}
          >
            <FaPercent />
            <span>Body Fat</span>
          </button>
        </div>

        {/* TAB GRID CONTAINERS */}
        <div className="grid-2" style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          {/* CALCULATOR PANEL */}
          <div className="glass-card">
            {activeTab === 'bmi' && (
              <form onSubmit={calculateBMI}>
                <h3 style={titleStyle}>BMI Calculator</h3>
                <p style={descStyle}>Body Mass Index determines if your weight is proportional to height.</p>
                <div style={{ marginBottom: '20px' }}>
                  <div style={flexLabelStyle}>
                    <label className="form-label">Height</label>
                    <span style={spanStyle}>{bmiHeight} cm</span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="220"
                    value={bmiHeight}
                    onChange={(e) => setBmiHeight(Number(e.target.value))}
                    style={rangeInputStyle}
                  />
                </div>
                <div style={{ marginBottom: '25px' }}>
                  <div style={flexLabelStyle}>
                    <label className="form-label">Weight</label>
                    <span style={spanStyle}>{bmiWeight} kg</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="150"
                    value={bmiWeight}
                    onChange={(e) => setBmiWeight(Number(e.target.value))}
                    style={rangeInputStyle}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Calculate BMI</button>
              </form>
            )}

            {activeTab === 'bmr' && (
              <form onSubmit={calculateBMR}>
                <h3 style={titleStyle}>BMR Calculator</h3>
                <p style={descStyle}>Basal Metabolic Rate is the daily calories burned at absolute rest.</p>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-input" value={bmrGender} onChange={(e) => setBmrGender(e.target.value)} style={{ backgroundColor: '#161616' }}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Age (Years)</label>
                  <input type="number" min="15" max="80" className="form-input" value={bmrAge} onChange={(e) => setBmrAge(Number(e.target.value))} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <div style={flexLabelStyle}>
                    <label className="form-label">Height (cm)</label>
                    <input type="number" className="form-input" value={bmrHeight} onChange={(e) => setBmrHeight(Number(e.target.value))} style={{ width: '100px', textAlign: 'center', padding: '8px' }} />
                  </div>
                </div>
                <div style={{ marginBottom: '25px' }}>
                  <div style={flexLabelStyle}>
                    <label className="form-label">Weight (kg)</label>
                    <input type="number" className="form-input" value={bmrWeight} onChange={(e) => setBmrWeight(Number(e.target.value))} style={{ width: '100px', textAlign: 'center', padding: '8px' }} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Calculate BMR</button>
              </form>
            )}

            {activeTab === 'calorie' && (
              <div>
                <h3 style={titleStyle}>Daily Calories Target</h3>
                <p style={descStyle}>Assess BMR calories factored with daily physical activity routines.</p>
                
                {bmrResult === null ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p style={{ color: '#aaaaaa', fontSize: '0.9rem' }}>Please calculate your BMR first using the BMR tab, which automatically loads physical stats!</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); calculateBMR(e); }}>
                    <div className="form-group">
                      <label className="form-label">Activity Level</label>
                      <select
                        className="form-input"
                        value={calActivity}
                        onChange={(e) => setCalActivity(e.target.value)}
                        style={{ backgroundColor: '#161616', cursor: 'pointer' }}
                      >
                        <option value="1.2">Sedentary (Little/no rest)</option>
                        <option value="1.375">Lightly Active (1-3 days/week gym)</option>
                        <option value="1.55">Moderately Active (3-5 days/week gym)</option>
                        <option value="1.725">Very Active (6-7 days/week gym)</option>
                        <option value="1.9">Elite Athlete (Two sessions/day)</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Re-Calculate Calories</button>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'water' && (
              <form onSubmit={calculateWater}>
                <h3 style={titleStyle}>Water Intake Calculator</h3>
                <p style={descStyle}>Determine required water intake based on weight and active daily exercise logs.</p>
                <div style={{ marginBottom: '20px' }}>
                  <div style={flexLabelStyle}>
                    <label className="form-label">Body Weight</label>
                    <span style={spanStyle}>{waterWeight} kg</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="150"
                    value={waterWeight}
                    onChange={(e) => setWaterWeight(Number(e.target.value))}
                    style={rangeInputStyle}
                  />
                </div>
                <div style={{ marginBottom: '25px' }}>
                  <div style={flexLabelStyle}>
                    <label className="form-label">Daily Active Training</label>
                    <span style={spanStyle}>{waterExercise} Mins</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="15"
                    value={waterExercise}
                    onChange={(e) => setWaterExercise(Number(e.target.value))}
                    style={rangeInputStyle}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Calculate Water Intake</button>
              </form>
            )}

            {activeTab === 'fat' && (
              <form onSubmit={calculateBodyFat}>
                <h3 style={titleStyle}>Body Fat Calculator</h3>
                <p style={descStyle}>Assess body composition percentage using the US Navy Circumference Method.</p>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-input" value={fatGender} onChange={(e) => setFatGender(e.target.value)} style={{ backgroundColor: '#161616' }}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Height (cm)</label>
                  <input type="number" className="form-input" value={fatHeight} onChange={(e) => setFatHeight(Number(e.target.value))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Neck Circumference (cm)</label>
                  <input type="number" className="form-input" value={fatNeck} onChange={(e) => setFatNeck(Number(e.target.value))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Waist Circumference (cm)</label>
                  <input type="number" className="form-input" value={fatWaist} onChange={(e) => setFatWaist(Number(e.target.value))} />
                </div>
                {fatGender === 'female' && (
                  <div className="form-group">
                    <label className="form-label">Hip Circumference (cm)</label>
                    <input type="number" className="form-input" value={fatHip} onChange={(e) => setFatHip(Number(e.target.value))} />
                  </div>
                )}
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Calculate Body Fat</button>
              </form>
            )}
          </div>

          {/* RESULTS DISPLAY PANEL */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            
            {activeTab === 'bmi' && (
              <div>
                {bmiResult ? (
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#aaaaaa', textTransform: 'uppercase', marginBottom: '10px' }}>Your BMI Result</h4>
                    <p style={{ fontSize: '4.5rem', fontWeight: 900, color: bmiResult.color, lineHeight: '1.2' }}>{bmiResult.score}</p>
                    <h5 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '15px 0' }}>{bmiResult.category}</h5>
                    <div style={{ padding: '15px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.9rem', color: '#aaaaaa' }}>
                      {bmiResult.category === 'Normal Weight' 
                        ? 'Congratulations! You are inside the ideal healthy metric window. Maintain active macros and resistance schedules!'
                        : 'Your weight is not in the ideal healthy range. Consider checking out our tailored personal training packages to reach your target!'}
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#666666' }}>
                    <FaWeight style={{ fontSize: '4rem', marginBottom: '15px' }} />
                    <p>Enter weight and height details to see your body mass indexes.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bmr' && (
              <div>
                {bmrResult ? (
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#aaaaaa', textTransform: 'uppercase', marginBottom: '10px' }}>Your BMR Result</h4>
                    <p style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary-red)', lineHeight: '1.2' }}>{bmrResult}</p>
                    <h5 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '15px 0', color: '#FFFFFF' }}>kCal / Day Required</h5>
                    <div style={{ padding: '15px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.9rem', color: '#aaaaaa' }}>
                      This represents the minimum calorie payload your body consumes to maintain functional organ life while inactive.
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#666666' }}>
                    <FaCalculator style={{ fontSize: '4rem', marginBottom: '15px' }} />
                    <p>Enter gender, age, and skeletal metrics to compute rest metabolic capacities.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'calorie' && (
              <div>
                {calResult ? (
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#aaaaaa', textTransform: 'uppercase', marginBottom: '10px' }}>Daily Calories Target</h4>
                    <p style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary-red)', lineHeight: '1.2' }}>{calResult}</p>
                    <h5 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '15px 0', color: '#FFFFFF' }}>Calories Needed</h5>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
                      <div style={{ padding: '10px', backgroundColor: 'rgba(46, 204, 113, 0.1)', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#aaaaaa', display: 'block' }}>Weight Loss (Cut)</span>
                        <span style={{ color: '#2ecc71', fontWeight: 700 }}>{calResult - 500} kcal</span>
                      </div>
                      <div style={{ padding: '10px', backgroundColor: 'rgba(241, 196, 15, 0.1)', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#aaaaaa', display: 'block' }}>Weight Gain (Bulk)</span>
                        <span style={{ color: '#f1c40f', fontWeight: 700 }}>{calResult + 500} kcal</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#666666' }}>
                    <FaFireAlt style={{ fontSize: '4rem', marginBottom: '15px' }} />
                    <p>Unlock daily active calorie burns once BMR parameters are loaded.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'water' && (
              <div>
                {waterResult ? (
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#aaaaaa', textTransform: 'uppercase', marginBottom: '10px' }}>Target Water Intake</h4>
                    <p style={{ fontSize: '4.5rem', fontWeight: 900, color: '#3498db', lineHeight: '1.2' }}>{waterResult}</p>
                    <h5 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '15px 0' }}>Liters / Day</h5>
                    <div style={{ padding: '15px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.9rem', color: '#aaaaaa' }}>
                      Ensures high kinetic efficiency, cellular regeneration, hydration splits, and dynamic joint protections during physical stressors.
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#666666' }}>
                    <FaTint style={{ fontSize: '4rem', marginBottom: '15px' }} />
                    <p>Slide weight metrics and workout durations to retrieve target hydration schedules.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'fat' && (
              <div>
                {fatResult ? (
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#aaaaaa', textTransform: 'uppercase', marginBottom: '10px' }}>Computed Body Fat</h4>
                    <p style={{ fontSize: '4.5rem', fontWeight: 900, color: '#e67e22', lineHeight: '1.2' }}>{fatResult.score}%</p>
                    <h5 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '15px 0' }}>{fatResult.category}</h5>
                    <div style={{ padding: '15px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.9rem', color: '#aaaaaa' }}>
                      Body composition ratios define lean muscle split targets and guide personalized calorie deficit splits.
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#666666' }}>
                    <FaPercent style={{ fontSize: '4rem', marginBottom: '15px' }} />
                    <p>Input accurate circumferences measurements to estimate physical fat indices.</p>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
      {/* Tab responsive layout override styles */}
      <style>{`
        @media(max-width:768px){
          .calc-tabs {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media(max-width:480px){
          .calc-tabs {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}

const tabStyle = {
  padding: '12px 10px',
  backgroundColor: '#121212',
  border: '1px solid #1a1a1a',
  borderRadius: '8px',
  color: '#aaaaaa',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  fontSize: '0.85rem',
  fontWeight: 600,
  transition: 'all 0.3s'
};

const activeTabStyle = {
  ...tabStyle,
  backgroundColor: 'rgba(225, 6, 0, 0.12)',
  borderColor: 'var(--primary-red)',
  color: '#FFFFFF',
  boxShadow: '0 0 10px rgba(225, 6, 0, 0.15)'
};

const titleStyle = {
  fontSize: '1.4rem',
  fontWeight: 800,
  textTransform: 'uppercase',
  marginBottom: '8px'
};

const descStyle = {
  fontSize: '0.85rem',
  color: '#888888',
  marginBottom: '20px',
  lineHeight: '1.5'
};

const flexLabelStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '5px'
};

const spanStyle = {
  fontWeight: 700,
  color: 'var(--primary-red)',
  fontSize: '1rem'
};

const rangeInputStyle = {
  width: '100%',
  accentColor: 'var(--primary-red)',
  cursor: 'pointer',
  height: '6px',
  backgroundColor: '#222222',
  borderRadius: '3px'
};
