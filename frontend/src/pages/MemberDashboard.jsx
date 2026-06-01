import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaDumbbell, FaListAlt, FaCalendarCheck, FaFileInvoiceDollar, FaTrashAlt, FaFileDownload, FaClock, FaAppleAlt, FaBarcode, FaCheckCircle, FaSpinner, FaRobot, FaPaperPlane, FaTint, FaHeartbeat } from 'react-icons/fa';
import confetti from 'canvas-confetti';

export default function MemberDashboard() {
  const { user, updateProfile, setUser } = useAuth();
  const { bookings, payments, cancelBooking } = useBooking();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'bookings', 'workout', 'diet', 'ai-coach', 'invoices', 'metrics', 'attendance'
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    gender: user?.gender || 'male',
    height: user?.metrics?.height || '',
    targetWeight: user?.metrics?.targetWeight || '',
    weight: ''
  });

  const [feedback, setFeedback] = useState('');
  const [viewInvoice, setViewInvoice] = useState(null);

  // 1. WORKOUT PLANNER STATE
  const [workoutLog, setWorkoutLog] = useState([
    { id: 'w1', day: 'Monday', exercise: 'Bench Press', sets: 4, reps: 8, weight: 80 },
    { id: 'w2', day: 'Monday', exercise: 'Incline Dumbbell Flyes', sets: 3, reps: 12, weight: 22 },
    { id: 'w3', day: 'Wednesday', exercise: 'Barbell Deadlifts', sets: 4, reps: 5, weight: 140 }
  ]);
  const [newWorkout, setNewWorkout] = useState({ day: 'Monday', exercise: '', sets: 3, reps: 10, weight: 60 });

  // 2. MACRO DIET & WATER TRACKER STATE
  const [mealLog, setMealLog] = useState([
    { id: 'm1', name: 'Morning Whey & Oats', protein: 35, carbs: 45, fats: 8 },
    { id: 'm2', name: 'Chicken Breast & Brown Rice', protein: 48, carbs: 55, fats: 6 }
  ]);
  const [newMeal, setNewMeal] = useState({ name: '', protein: 25, carbs: 30, fats: 5 });
  const [waterIntake, setWaterIntake] = useState(1500); // in ml
  const targetWater = 3000; // in ml

  // 3. AI FITNESS ASSISTANT STATE
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am Coach Newtown AI, your virtual fitness and nutrition coordinator. Ask me about muscle bulking, caloric cutting, supplements, or HIIT routines!"
    }
  ]);
  const [aiTyping, setAiTyping] = useState(false);

  // 4. BIA BODY DIAGNOSTICS SCANNER STATE
  const [biaScanning, setBiaScanning] = useState(false);
  const [biaResult, setBiaResult] = useState(null);

  // 5. VIRTUAL RFID GATE PASS ATTENDANCE STATE
  const [scanningGate, setScanningGate] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    const res = await updateProfile(profileForm);
    if (res.success) {
      setFeedback('Profile and health metrics successfully updated.');
      setProfileForm({ ...profileForm, weight: '' });
      setTimeout(() => setFeedback(''), 4000);
    }
  };

  const handleCancel = async (bkId) => {
    if (window.confirm('Are you sure you want to cancel this booking session?')) {
      const res = await cancelBooking(bkId);
      if (!res.success) {
        alert(res.message);
      }
    }
  };

  const printInvoice = () => {
    const printContent = document.getElementById('invoice-print-area').innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  // Workout additions
  const handleAddWorkout = (e) => {
    e.preventDefault();
    if (!newWorkout.exercise) return;
    const newEntry = {
      id: 'w_local_' + Math.random().toString(36).substr(2, 9),
      ...newWorkout,
      sets: Number(newWorkout.sets),
      reps: Number(newWorkout.reps),
      weight: Number(newWorkout.weight)
    };
    setWorkoutLog([...workoutLog, newEntry]);
    setNewWorkout({ day: 'Monday', exercise: '', sets: 3, reps: 10, weight: 60 });
  };

  const handleDeleteWorkout = (id) => {
    setWorkoutLog(workoutLog.filter(w => w.id !== id));
  };

  // Meal additions
  const handleAddMeal = (e) => {
    e.preventDefault();
    if (!newMeal.name) return;
    const newEntry = {
      id: 'm_local_' + Math.random().toString(36).substr(2, 9),
      name: newMeal.name,
      protein: Number(newMeal.protein),
      carbs: Number(newMeal.carbs),
      fats: Number(newMeal.fats)
    };
    setMealLog([...mealLog, newEntry]);
    setNewMeal({ name: '', protein: 25, carbs: 30, fats: 5 });
  };

  const handleDeleteMeal = (id) => {
    setMealLog(mealLog.filter(m => m.id !== id));
  };

  // Water logs increments
  const addWater = (amount) => {
    const newVal = Math.min(waterIntake + amount, 5000);
    setWaterIntake(newVal);

    if (newVal >= targetWater && waterIntake < targetWater) {
      // Trigger water splash confetti!
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.85 },
        colors: ['#3498db', '#9be2ff', '#FFFFFF']
      });
    }
  };

  // AI Chat dispatch
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setAiTyping(true);

    // Simulate smart bot response based on triggers
    setTimeout(() => {
      let botResponse = '';
      const text = chatInput.toLowerCase();

      if (text.includes('bulk') || text.includes('gain')) {
        botResponse = "For a successful athletic bulking cycle, target a mild caloric surplus of 300-500 kcal above maintenance, keeping proteins high (2.0g per kg of bodyweight). Structure heavy workouts around compound compound lifts (Squats, Bench, Deadlifts) 4-5 times weekly.";
      } else if (text.includes('cut') || text.includes('lose') || text.includes('fat') || text.includes('loss')) {
        botResponse = "To maximize fat loss while maintaining lean mass: 1. Maintain a caloric deficit of 400-500 kcal. 2. Push protein ratios up to 2.2g per kg. 3. Continue lifting heavy resistance weights to signal protein retention. 4. Add 2-3 HIIT intervals weekly.";
      } else if (text.includes('supplement') || text.includes('creatine') || text.includes('whey')) {
        botResponse = "Top scientifically backed athletic supplements: 1. Whey Isolate (excellent for meeting protein splits). 2. Creatine Monohydrate (5g daily for power outputs and cell volumization). 3. Caffeine / Beta-Alanine (pre-workout focus and lactic buffers). whole-foods always come first!";
      } else if (text.includes('water') || text.includes('hydration')) {
        botResponse = "Hydration splits determine cognitive and muscular output. Aim for 3-4 liters daily. Consume an extra 500ml for every 45 minutes of active, high-intensity sweating floors.";
      } else {
        botResponse = "That is an excellent training query! For physical re-composition, consistency is absolute. Focus on tracking daily macros, maintaining a progressive weight routine, scanning your biometric BIA stats, and getting 7-8 hours of deep physical rest. Let me know how else I can optimize your workouts today!";
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: botResponse }]);
      setAiTyping(false);
    }, 1200);
  };

  // Biometric BIA Scanner
  const triggerBiaScan = () => {
    setBiaScanning(true);
    setBiaResult(null);

    setTimeout(() => {
      setBiaScanning(false);
      setBiaResult({
        muscleMass: 44.2, // %
        bodyFat: 15.8, // %
        visceralFat: 4, // index
        metabolicAge: 21, // years
        hydration: 63.4 // %
      });

      confetti({
        particleCount: 70,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#f1c40f', '#e67e22', '#FFFFFF']
      });
    }, 2500);
  };

  // Barcode gate check-in
  const triggerBiometricScan = () => {
    setScanningGate(true);
    setScanSuccess(false);

    setTimeout(() => {
      setScanningGate(false);
      setScanSuccess(true);
      
      const updatedAttendance = user.attendance ? [...user.attendance] : [];
      const newAttendanceDate = new Date();
      updatedAttendance.push(newAttendanceDate);
      
      const updatedUser = { ...user, attendance: updatedAttendance };
      setUser(updatedUser);
      localStorage.setItem('ntf_user', JSON.stringify(updatedUser));

      confetti({
        particleCount: 80,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#E10600', '#2ecc71', '#FFFFFF']
      });

      setTimeout(() => {
        setScanSuccess(false);
      }, 3000);
    }, 2000);
  };

  // Calculations
  const totalProtein = mealLog.reduce((acc, m) => acc + m.protein, 0);
  const totalCarbs = mealLog.reduce((acc, m) => acc + m.carbs, 0);
  const totalFats = mealLog.reduce((acc, m) => acc + m.fats, 0);
  const totalLoggedCalories = Math.round((totalProtein * 4) + (totalCarbs * 4) + (totalFats * 9));

  const targetProtein = 160;
  const targetCarbs = 200;
  const targetFats = 70;
  const targetCalories = 2100;

  return (
    <div style={{
      minHeight: '100vh',
      padding: '120px 20px 80px 20px',
      background: 'radial-gradient(circle at center, #111111 0%, #000000 100%)'
    }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }} id="dashboard-grid">
        
        {/* SIDEBAR HUB */}
        <div className="glass-card" style={{ padding: '20px', height: 'fit-content' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#222222',
              color: 'var(--primary-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 800,
              margin: '0 auto 15px auto',
              border: '2px solid rgba(225,6,0,0.3)',
              boxShadow: 'var(--glow-shadow)'
            }}>
              {user?.fullName.charAt(0).toUpperCase()}
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{user?.fullName}</h4>
            <span style={{
              fontSize: '0.75rem',
              backgroundColor: user?.membership?.status === 'active' ? 'rgba(46,204,113,0.1)' : 'rgba(225,6,0,0.1)',
              color: user?.membership?.status === 'active' ? '#2ecc71' : 'var(--primary-red)',
              border: '1px solid',
              borderColor: user?.membership?.status === 'active' ? '#2ecc71' : 'var(--primary-red)',
              padding: '2px 8px',
              borderRadius: '10px',
              fontWeight: 700,
              display: 'inline-block',
              marginTop: '5px',
              textTransform: 'uppercase'
            }}>
              {user?.membership?.status === 'active' ? 'Active Club Pass' : 'No Active Pass'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => setActiveTab('profile')} style={activeTab === 'profile' ? activeBtnStyle : sidebarBtnStyle}>
              <FaUser />
              Profile
            </button>
            <button onClick={() => setActiveTab('bookings')} style={activeTab === 'bookings' ? activeBtnStyle : sidebarBtnStyle}>
              <FaDumbbell />
              Bookings ({bookings.filter(b => b.status === 'booked').length})
            </button>
            <button onClick={() => setActiveTab('workout')} style={activeTab === 'workout' ? activeBtnStyle : sidebarBtnStyle}>
              <FaDumbbell style={{ color: '#f1c40f' }} />
              Workout Split Builder
            </button>
            <button onClick={() => setActiveTab('diet')} style={activeTab === 'diet' ? activeBtnStyle : sidebarBtnStyle}>
              <FaAppleAlt style={{ color: '#2ecc71' }} />
              Diet & Hydration
            </button>
            <button onClick={() => setActiveTab('ai-coach')} style={activeTab === 'ai-coach' ? activeBtnStyle : sidebarBtnStyle}>
              <FaRobot style={{ color: '#00D2FF' }} />
              Coach Newtown AI
            </button>
            <button onClick={() => setActiveTab('invoices')} style={activeTab === 'invoices' ? activeBtnStyle : sidebarBtnStyle}>
              <FaFileInvoiceDollar />
              Invoices ({payments.length})
            </button>
            <button onClick={() => setActiveTab('metrics')} style={activeTab === 'metrics' ? activeBtnStyle : sidebarBtnStyle}>
              <FaListAlt />
              Metrics & Progress
            </button>
            <button onClick={() => setActiveTab('attendance')} style={activeTab === 'attendance' ? activeBtnStyle : sidebarBtnStyle}>
              <FaCalendarCheck />
              Attendance Gate RFID
            </button>
          </div>

        </div>

        {/* RIGHT DISPLAY PANEL */}
        <div className="glass-card" style={{ padding: '35px' }}>
          
          {feedback && (
            <div style={{
              backgroundColor: 'rgba(46,204,113,0.1)',
              border: '1px solid #2ecc71',
              color: '#FFFFFF',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              marginBottom: '20px'
            }}>{feedback}</div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h3 style={sectionHeadingStyle}>Profile Information</h3>
              <p style={{ color: '#888888', fontSize: '0.85rem', marginBottom: '25px' }}>Adjust your personal details, physical credentials, and weight limits.</p>

              <form onSubmit={handleProfileSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="profile-form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    disabled
                    className="form-input"
                    value={user?.email || ''}
                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="text"
                    disabled
                    className="form-input"
                    value={user?.mobileNumber || ''}
                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-input"
                    value={profileForm.gender}
                    onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                    style={{ backgroundColor: '#161616', cursor: 'pointer' }}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Height (cm)</label>
                  <input
                    type="number"
                    placeholder="Height in cm"
                    className="form-input"
                    value={profileForm.height}
                    onChange={(e) => setProfileForm({ ...profileForm, height: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="Target weight in kg"
                    className="form-input"
                    value={profileForm.targetWeight}
                    onChange={(e) => setProfileForm({ ...profileForm, targetWeight: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Log Current Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="Log weight today to update progress chart"
                    className="form-input"
                    value={profileForm.weight}
                    onChange={(e) => setProfileForm({ ...profileForm, weight: e.target.value })}
                  />
                </div>

                <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Update Profile Credentials</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div>
              <h3 style={sectionHeadingStyle}>Active Bookings</h3>
              <p style={{ color: '#888888', fontSize: '0.85rem', marginBottom: '25px' }}>Verify your personal trainer schedulers and booked class slot reservations.</p>

              {bookings.filter(b => b.status === 'booked').length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#555555' }}>
                  <FaCalendarCheck style={{ fontSize: '3rem', marginBottom: '15px' }} />
                  <p>You have no active class or trainer sessions scheduled currently.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {bookings.filter(b => b.status === 'booked').map((bk) => (
                    <div key={bk._id} style={bookingRowStyle}>
                      <div>
                        <span style={typeBadgeStyle(bk.bookingType)}>{bk.bookingType}</span>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '8px' }}>
                          {bk.bookingType === 'class' ? bk.classId?.title : bk.trainerId?.name}
                        </h4>
                        <div style={{ display: 'flex', gap: '15px', color: '#888888', fontSize: '0.8rem', marginTop: '5px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FaClock style={{ color: 'var(--primary-red)' }} />
                            Slot: {bk.timeSlot}
                          </span>
                          <span>Date: {new Date(bk.date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <button onClick={() => handleCancel(bk._id)} style={cancelBtnStyle}>
                        <FaTrashAlt />
                        <span>Cancel Booking</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* WORKOUT PLANNER */}
          {activeTab === 'workout' && (
            <div>
              <h3 style={sectionHeadingStyle}>Workout Split Builder</h3>
              <p style={{ color: '#888888', fontSize: '0.85rem', marginBottom: '25px' }}>Construct daily exercise splits, sets, reps, and track personal record weights.</p>

              <form onSubmit={handleAddWorkout} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr',
                gap: '12px',
                padding: '20px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid #1c1c1c',
                borderRadius: '8px',
                marginBottom: '35px'
              }} className="profile-form-grid">
                <div className="form-group">
                  <label className="form-label">Day</label>
                  <select className="form-input" style={{ backgroundColor: '#161616', padding: '10px' }} value={newWorkout.day} onChange={(e) => setNewWorkout({ ...newWorkout, day: e.target.value })}>
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Saturday</option>
                    <option>Sunday</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Exercise Name</label>
                  <input type="text" placeholder="e.g. Bench Press" className="form-input" required style={{ padding: '10px' }} value={newWorkout.exercise} onChange={(e) => setNewWorkout({ ...newWorkout, exercise: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Sets</label>
                  <input type="number" className="form-input" required style={{ padding: '10px', textAlign: 'center' }} value={newWorkout.sets} onChange={(e) => setNewWorkout({ ...newWorkout, sets: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Reps</label>
                  <input type="number" className="form-input" required style={{ padding: '10px', textAlign: 'center' }} value={newWorkout.reps} onChange={(e) => setNewWorkout({ ...newWorkout, reps: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input type="number" className="form-input" required style={{ padding: '10px', textAlign: 'center' }} value={newWorkout.weight} onChange={(e) => setNewWorkout({ ...newWorkout, weight: e.target.value })} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px 10px', fontSize: '0.8rem' }}>
                    Add
                  </button>
                </div>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                  const dayExercises = workoutLog.filter(w => w.day === day);
                  if (dayExercises.length === 0) return null;
                  return (
                    <div key={day} style={{ padding: '15px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid #1a1a1a', borderRadius: '8px' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-red)', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #1a1a1a', paddingBottom: '5px' }}>
                        {day} Split
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {dayExercises.map((w) => (
                          <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                            <span style={{ fontWeight: 600 }}>{w.exercise}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#aaaaaa' }}>
                              <span>{w.sets} Sets x {w.reps} Reps</span>
                              <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{w.weight} kg</span>
                              <button onClick={() => handleDeleteWorkout(w.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}>
                                <FaTrashAlt />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* DIET & HYDRATION TRACKER */}
          {activeTab === 'diet' && (
            <div>
              <h3 style={sectionHeadingStyle}>Diet & Hydration Tracker</h3>
              <p style={{ color: '#888888', fontSize: '0.85rem', marginBottom: '25px' }}>Log calories macros and track daily water goals with high-fidelity indicators.</p>

              {/* NUTRITION & HYDRATION GRIDS */}
              <div className="grid-2" style={{ gap: '30px', marginBottom: '40px' }}>
                
                {/* MACRO BREAKDOWN MODULE */}
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '15px' }}>Daily Macros Budget</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div style={macroBoxStyle('#E10600')}>
                      <span style={{ fontSize: '0.7rem', color: '#888888', textTransform: 'uppercase' }}>Calories</span>
                      <p style={{ fontSize: '1.25rem', fontWeight: 900, marginTop: '3px' }}>{totalLoggedCalories} / {targetCalories} kcal</p>
                    </div>
                    <div style={macroBoxStyle('#3498db')}>
                      <span style={{ fontSize: '0.7rem', color: '#888888', textTransform: 'uppercase' }}>Protein</span>
                      <p style={{ fontSize: '1.25rem', fontWeight: 900, marginTop: '3px' }}>{totalProtein}g / {targetProtein}g</p>
                    </div>
                    <div style={macroBoxStyle('#f1c40f')}>
                      <span style={{ fontSize: '0.7rem', color: '#888888', textTransform: 'uppercase' }}>Carbs</span>
                      <p style={{ fontSize: '1.25rem', fontWeight: 900, marginTop: '3px' }}>{totalCarbs}g / {targetCarbs}g</p>
                    </div>
                    <div style={macroBoxStyle('#2ecc71')}>
                      <span style={{ fontSize: '0.7rem', color: '#888888', textTransform: 'uppercase' }}>Fats</span>
                      <p style={{ fontSize: '1.25rem', fontWeight: 900, marginTop: '3px' }}>{totalFats}g / {targetFats}g</p>
                    </div>
                  </div>

                  {/* Log Meal Form */}
                  <form onSubmit={handleAddMeal} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    padding: '15px',
                    backgroundColor: 'rgba(255,255,255,0.01)',
                    border: '1px solid #1c1c1c',
                    borderRadius: '8px'
                  }}>
                    <input type="text" placeholder="Meal Description" className="form-input" required style={{ padding: '8px' }} value={newMeal.name} onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                      <input type="number" placeholder="Protein (g)" className="form-input" required style={{ padding: '8px', textAlign: 'center' }} value={newMeal.protein} onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })} />
                      <input type="number" placeholder="Carbs (g)" className="form-input" required style={{ padding: '8px', textAlign: 'center' }} value={newMeal.carbs} onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })} />
                      <input type="number" placeholder="Fats (g)" className="form-input" required style={{ padding: '8px', textAlign: 'center' }} value={newMeal.fats} onChange={(e) => setNewMeal({ ...newMeal, fats: e.target.value })} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '8px', fontSize: '0.85rem' }}>Log Meal</button>
                  </form>
                </div>

                {/* ANIMATED HYDRATION GAUGE */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '15px', width: '100%', textAlign: 'left' }}>
                    Hydration Tracker
                  </h4>
                  
                  {/* GLASS GAUGE */}
                  <div style={{
                    width: '120px',
                    height: '200px',
                    border: '4px solid #333333',
                    borderTop: 'none',
                    borderRadius: '0 0 25px 25px',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 10px 20px rgba(0,0,0,0.5)',
                    marginBottom: '20px'
                  }}>
                    {/* Water Level */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: `${Math.min((waterIntake / targetWater) * 100, 100)}%`,
                      backgroundColor: 'rgba(52, 152, 219, 0.75)',
                      boxShadow: '0 0 20px #3498db, inset 0 0 10px rgba(255,255,255,0.5)',
                      transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                    
                    {/* Dynamic text inside glass */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10,
                      textAlign: 'center',
                      pointerEvents: 'none'
                    }}>
                      <FaTint style={{ color: '#FFFFFF', fontSize: '1.8rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                      <strong style={{ display: 'block', fontSize: '1.1rem', color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                        {waterIntake} ml
                      </strong>
                    </div>
                  </div>

                  {/* Add buttons */}
                  <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                    <button onClick={() => addWater(250)} className="btn btn-secondary" style={{ flex: 1, padding: '10px 5px', fontSize: '0.8rem', borderColor: '#3498db', color: '#3498db' }}>
                      + 250ml Glass
                    </button>
                    <button onClick={() => addWater(750)} className="btn btn-primary" style={{ flex: 1, padding: '10px 5px', fontSize: '0.8rem', backgroundColor: '#3498db', boxShadow: '0 4px 10px rgba(52,152,219,0.2)' }}>
                      + 750ml Bottle
                    </button>
                  </div>
                  {waterIntake >= targetWater && (
                    <span style={{ color: '#2ecc71', fontWeight: 700, fontSize: '0.8rem', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      💧 Hydration Target Achieved!
                    </span>
                  )}
                </div>

              </div>

              {/* LIST DISPLAY */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {mealLog.map((m) => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid #141414', borderRadius: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem' }}>{m.name}</strong>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#666666', marginTop: '2px' }}>
                        Calories: {Math.round((m.protein * 4) + (m.carbs * 4) + (m.fats * 9))} kcal
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.85rem' }}>
                      <span style={{ color: '#3498db', fontWeight: 600 }}>P: {m.protein}g</span>
                      <span style={{ color: '#f1c40f', fontWeight: 600 }}>C: {m.carbs}g</span>
                      <span style={{ color: '#2ecc71', fontWeight: 600 }}>F: {m.fats}g</span>
                      <button onClick={() => handleDeleteMeal(m.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}>
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. COACH NEWTOWN AI FIT BOT */}
          {activeTab === 'ai-coach' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '480px', justifyContent: 'space-between' }}>
              <div>
                <h3 style={sectionHeadingStyle}>Coach Newtown AI</h3>
                <p style={{ color: '#888888', fontSize: '0.85rem', marginBottom: '20px' }}>Consult your virtual trainer splits for nutrition splits, cutting ratios, or heavy muscle progressions.</p>
              </div>

              {/* CHAT DISPLAY SCREEN */}
              <div style={{
                flex: 1,
                backgroundColor: '#0c0c0c',
                border: '1px solid #1c1c1c',
                borderRadius: '10px',
                padding: '20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                marginBottom: '20px'
              }}>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    backgroundColor: msg.sender === 'user' ? 'rgba(225,6,0,0.1)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid',
                    borderColor: msg.sender === 'user' ? 'var(--primary-red)' : '#222222',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    color: '#FFFFFF'
                  }}>
                    {msg.text}
                  </div>
                ))}

                {aiTyping && (
                  <div style={{
                    alignSelf: 'flex-start',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid #222222',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#aaaaaa'
                  }}>
                    <FaSpinner className="dumbbell-spinner" style={{ fontSize: '0.9rem' }} />
                    <span>Coach Newtown is typing recommendations...</span>
                  </div>
                )}
              </div>

              {/* INPUT SEND PANEL */}
              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Ask about: bulking tips, supplement guide, fat loss cut formulas..."
                  className="form-input"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '12px 25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaPaperPlane />
                  Send
                </button>
              </form>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div>
              <h3 style={sectionHeadingStyle}>Payment History & Invoices</h3>
              <p style={{ color: '#888888', fontSize: '0.85rem', marginBottom: '25px' }}>View billing logs, check renewal ranges, and print dynamic invoice receipts.</p>

              {payments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#555555' }}>
                  <FaFileInvoiceDollar style={{ fontSize: '3rem', marginBottom: '15px' }} />
                  <p>No billing or transaction records found for this account.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #222222', color: '#888888', fontSize: '0.85rem' }}>
                        <th style={{ padding: '12px' }}>INVOICE</th>
                        <th style={{ padding: '12px' }}>PLAN TIER</th>
                        <th style={{ padding: '12px' }}>AMOUNT</th>
                        <th style={{ padding: '12px' }}>DATE</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => (
                        <tr key={p._id} style={{ borderBottom: '1px solid #141414', fontSize: '0.9rem' }}>
                          <td style={{ padding: '12px', fontWeight: 600 }}>{p.invoiceNumber}</td>
                          <td style={{ padding: '12px' }}>{p.planType}</td>
                          <td style={{ padding: '12px', color: 'var(--primary-red)', fontWeight: 700 }}>₹{p.amount}</td>
                          <td style={{ padding: '12px', color: '#888888' }}>{new Date(p.purchaseDate).toLocaleDateString()}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <button
                              onClick={() => setViewInvoice(p)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#3498db',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                fontWeight: 600,
                                fontSize: '0.85rem'
                              }}
                            >
                              <FaFileDownload />
                              View Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* METRICS & BIO BIA BODY SCANNER */}
          {activeTab === 'metrics' && (
            <div>
              <h3 style={sectionHeadingStyle}>Metrics & BIA Diagnostics</h3>
              <p style={{ color: '#888888', fontSize: '0.85rem', marginBottom: '25px' }}>Track daily weight logger logs and perform simulated Bio-electrical Impedance Analysis scanner scans.</p>

              {/* BIO BIA SCANNER SECTION */}
              <div style={{
                padding: '25px',
                backgroundColor: 'rgba(255,255,255,0.01)',
                border: '1px solid #1a1a1a',
                borderRadius: '12px',
                marginBottom: '35px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <FaHeartbeat style={{ color: 'var(--primary-red)', fontSize: '1.5rem' }} />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase' }}>BIA Body Diagnostics Deck</h4>
                </div>

                {biaScanning ? (
                  <div style={{ textAlign: 'center', padding: '30px 0' }}>
                    <FaSpinner className="dumbbell-spinner" style={{ fontSize: '2.5rem', color: '#f1c40f', marginBottom: '15px' }} />
                    <p style={{ color: '#f1c40f', fontWeight: 600, fontSize: '0.95rem' }}>Scanning Visceral Lipid Levels & Hydration splits...</p>
                    <div style={{ width: '200px', height: '4px', backgroundColor: '#222', margin: '15px auto 0 auto', borderRadius: '2px', overflow: 'hidden' }}>
                      <div className="skeleton" style={{ width: '100%', height: '100%' }} />
                    </div>
                  </div>
                ) : biaResult ? (
                  <div>
                    {/* Diagnostic scoreboard grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', marginBottom: '20px' }} className="profile-form-grid">
                      <div style={biaMetricBoxStyle('#3498db')}>
                        <span style={{ fontSize: '0.7rem', color: '#888888' }}>Muscle Mass</span>
                        <h5 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '3px' }}>{biaResult.muscleMass}%</h5>
                        <span style={{ fontSize: '0.65rem', color: '#2ecc71' }}>Athletic Split</span>
                      </div>
                      <div style={biaMetricBoxStyle('#e67e22')}>
                        <span style={{ fontSize: '0.7rem', color: '#888888' }}>Body Fat</span>
                        <h5 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '3px' }}>{biaResult.bodyFat}%</h5>
                        <span style={{ fontSize: '0.65rem', color: '#3498db' }}>Fitness Range</span>
                      </div>
                      <div style={biaMetricBoxStyle('#9b59b6')}>
                        <span style={{ fontSize: '0.7rem', color: '#888888' }}>Visceral Fat</span>
                        <h5 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '3px' }}>Lvl {biaResult.visceralFat}</h5>
                        <span style={{ fontSize: '0.65rem', color: '#2ecc71' }}>Optimal healthy</span>
                      </div>
                      <div style={biaMetricBoxStyle('#f1c40f')}>
                        <span style={{ fontSize: '0.7rem', color: '#888888' }}>Metabolic Age</span>
                        <h5 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '3px' }}>{biaResult.metabolicAge} Yrs</h5>
                        <span style={{ fontSize: '0.65rem', color: '#2ecc71' }}>Younger (PR)</span>
                      </div>
                      <div style={biaMetricBoxStyle('#00D2FF')}>
                        <span style={{ fontSize: '0.7rem', color: '#888888' }}>Hydration Index</span>
                        <h5 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '3px' }}>{biaResult.hydration}%</h5>
                        <span style={{ fontSize: '0.65rem', color: '#2ecc71' }}>Optimal</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <button onClick={triggerBiaScan} className="btn btn-secondary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                        Scan Again
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <p style={{ color: '#aaaaaa', fontSize: '0.85rem', marginBottom: '20px' }}>No active biometric diagnostics record scanned for today.</p>
                    <button onClick={triggerBiaScan} className="btn btn-primary" style={{ padding: '10px 25px', fontSize: '0.9rem' }}>
                      Initiate Biometric BIA Full Body Scan
                    </button>
                  </div>
                )}
              </div>

              {/* Weight Logger Trends */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '15px' }}>Weight Logger Trends</h4>
                {(!user?.metrics?.weightLogs || user.metrics.weightLogs.length === 0) ? (
                  <p style={{ color: '#555555', fontSize: '0.85rem' }}>No logged weight entries found. Go to profile tab to log your current weight!</p>
                ) : (
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      height: '180px',
                      padding: '20px',
                      backgroundColor: '#0c0c0c',
                      borderRadius: '10px',
                      border: '1px solid #1c1c1c',
                      marginBottom: '15px'
                    }}>
                      {user.metrics.weightLogs.slice(-6).map((log, index) => {
                        const maxHeight = 100;
                        const barHeightPercentage = Math.min((log.weight / maxHeight) * 100, 100);
                        return (
                          <div key={index} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '45px'
                          }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '5px' }}>
                              {log.weight}kg
                            </span>
                            <div style={{
                              width: '18px',
                              height: `${barHeightPercentage}px`,
                              backgroundColor: 'var(--primary-red)',
                              borderRadius: '4px 4px 0 0',
                              boxShadow: 'var(--glow-shadow)'
                            }} />
                            <span style={{ fontSize: '0.65rem', color: '#666666', marginTop: '5px' }}>
                              {new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#888888', textAlign: 'center' }}>
                      Target Weight: <span style={{ color: 'var(--primary-red)', fontWeight: 700 }}>{user.metrics.targetWeight || 0} kg</span> | Height: <span style={{ color: 'var(--primary-red)', fontWeight: 700 }}>{user.metrics.height || 0} cm</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RFID Scanner Attendance */}
          {activeTab === 'attendance' && (
            <div>
              <h3 style={sectionHeadingStyle}>Gym Biometric Check-In</h3>
              <p style={{ color: '#888888', fontSize: '0.85rem', marginBottom: '25px' }}>Scan your active digital RFID membership card to record attendance entry logs.</p>

              <div className="grid-2" style={{ gap: '30px', alignItems: 'center', marginBottom: '40px' }}>
                <div style={{
                  padding: '25px',
                  background: 'linear-gradient(135deg, #1e1e1e 0%, #0a0a0a 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  boxShadow: 'var(--glow-shadow)',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '1px' }}>NEWTOWN FITNESS</span>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>MEMBER ACCESS</h4>
                    </div>
                    <FaDumbbell style={{ color: 'var(--primary-red)', fontSize: '1.8rem' }} />
                  </div>

                  {scanningGate ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
                      <FaSpinner className="dumbbell-spinner" style={{ fontSize: '2rem', color: 'var(--primary-red)' }} />
                      <span style={{ fontSize: '0.8rem', color: '#aaaaaa', marginTop: '10px' }}>Scanning RFID Frequency...</span>
                    </div>
                  ) : scanSuccess ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
                      <FaCheckCircle style={{ color: '#2ecc71', fontSize: '2.5rem' }} />
                      <span style={{ fontSize: '0.85rem', color: '#2ecc71', fontWeight: 700, marginTop: '8px' }}>ACCESS GRANTED</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '20px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#aaaaaa' }}>
                        <FaBarcode />
                        <span>Card: NTF-{user?.fullName.replace(/\s+/g, '').toUpperCase().substr(0,4)}-{user?.mobileNumber?.substr(-4)}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#666666' }}>Biometric RFID Gate Pass</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1c1c1c', paddingTop: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>{user?.fullName}</span>
                    <span style={{ fontSize: '0.75rem', color: user?.membership?.status === 'active' ? '#2ecc71' : 'var(--primary-red)', fontWeight: 700 }}>
                      {user?.membership?.status === 'active' ? 'STATUS: ACTIVE' : 'STATUS: EXPIRED'}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px' }}>RFID Scanning Deck</h4>
                  <p style={{ color: '#aaaaaa', fontSize: '0.85rem', marginBottom: '20px', lineHeight: '1.6' }}>
                    Click button below to simulate holding your digital access card directly over the biometric RFID scanner sensor at Newtown Gym main gate.
                  </p>
                  <button
                    onClick={triggerBiometricScan}
                    disabled={scanningGate || user?.membership?.status !== 'active'}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                  >
                    <FaBarcode />
                    {scanningGate ? 'Transmitting Barcode...' : 'Scan RFID Card (biometric check-in)'}
                  </button>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '15px' }}>Attendance Logs Calendar</h4>
                {(!user?.attendance || user.attendance.length === 0) ? (
                  <p style={{ color: '#555555', fontSize: '0.9rem' }}>No biometric scan entries recorded for this month.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: '15px' }}>
                    {user.attendance.map((att, i) => (
                      <div key={i} style={{
                        padding: '12px',
                        backgroundColor: 'rgba(46,204,113,0.05)',
                        border: '1px solid rgba(46,204,113,0.15)',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}>
                        <span style={{ fontSize: '0.75rem', color: '#2ecc71', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>Present</span>
                        <span style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 600, display: 'block', marginTop: '5px' }}>
                          {new Date(att).toLocaleDateString()}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#888888' }}>
                          {new Date(att).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* FULL INVOICE PREVIEW MODAL */}
      <AnimatePresence>
        {viewInvoice && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(8px)'
          }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: 0 }}>
              
              <div id="invoice-print-area" style={{ padding: '40px', backgroundColor: '#FFFFFF', color: '#000000', borderRadius: '12px 12px 0 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000000', paddingBottom: '20px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>NEWTOWN FITNESS</h2>
                    <p style={{ fontSize: '0.8rem', color: '#666666', marginTop: '2px' }}>Rajarhat Road, Kolkata, WB 700135</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>INVOICE RECEIPT</h3>
                    <p style={{ fontSize: '0.85rem', color: '#333333', marginTop: '4px', fontWeight: 600 }}>{viewInvoice.invoiceNumber}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '30px 0', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: '#666666', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Billed To:</span>
                    <strong style={{ display: 'block', marginTop: '4px', fontSize: '0.95rem' }}>{user?.fullName}</strong>
                    <span>Email: {user?.email}</span>
                    <br />
                    <span>Mobile: {user?.mobileNumber}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#666666', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Details:</span>
                    <span style={{ display: 'block', marginTop: '4px' }}>Date: {new Date(viewInvoice.purchaseDate).toLocaleDateString()}</span>
                    <span>Expiry: {new Date(viewInvoice.expiryDate).toLocaleDateString()}</span>
                    <br />
                    <span>Method: {viewInvoice.paymentMethod}</span>
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', margin: '30px 0', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #000000', backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: '10px', textAlign: 'left', fontWeight: 700 }}>DESCRIPTION</th>
                      <th style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>TOTAL AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '12px 10px' }}>
                        <strong>{viewInvoice.planType} Subscription</strong>
                        <p style={{ fontSize: '0.75rem', color: '#666666', marginTop: '3px' }}>Uncompromising full machine floor access, amenities lockers, showers and fitness schedulers.</p>
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 700 }}>₹{viewInvoice.amount}.00</td>
                    </tr>
                    <tr style={{ borderTop: '2px solid #000000', fontWeight: 800, fontSize: '1.05rem' }}>
                      <td style={{ padding: '12px 10px' }}>Total Paid</td>
                      <td style={{ padding: '12px 10px', textAlign: 'right', color: '#E10600' }}>₹{viewInvoice.amount}.00</td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ borderTop: '1px solid #dddddd', paddingTop: '20px', textAlign: 'center', fontSize: '0.75rem', color: '#666666' }}>
                  Thank you for training with Newtown Fitness. Build real strength, physical consistency, and mental endurance.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', padding: '20px', backgroundColor: '#0c0c0c', borderTop: '1px solid #222222', borderRadius: '0 0 12px 12px' }}>
                <button onClick={printInvoice} className="btn btn-primary" style={{ flex: 1, padding: '10px' }}>
                  Print PDF Receipt
                </button>
                <button onClick={() => setViewInvoice(null)} className="btn btn-secondary" style={{ flex: 1, padding: '10px' }}>
                  Close
                </button>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @media(max-width: 768px){
          #dashboard-grid {
            grid-template-columns: 1fr !important;
          }
          .profile-form-grid {
            grid-template-columns: 1fr !important;
          }
          .profile-form-grid > * {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
}

const sidebarBtnStyle = {
  width: '100%',
  padding: '12px 15px',
  backgroundColor: '#121212',
  border: '1px solid #1a1a1a',
  borderRadius: '8px',
  color: '#cccccc',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '0.9rem',
  fontWeight: 600,
  transition: 'all 0.2s',
  textAlign: 'left'
};

const activeBtnStyle = {
  ...sidebarBtnStyle,
  backgroundColor: 'rgba(225,6,0,0.12)',
  borderColor: 'var(--primary-red)',
  color: '#FFFFFF',
  boxShadow: '0 0 10px rgba(225,6,0,0.1)'
};

const sectionHeadingStyle = {
  fontSize: '1.4rem',
  fontWeight: 800,
  textTransform: 'uppercase',
  marginBottom: '5px'
};

const bookingRowStyle = {
  padding: '20px',
  backgroundColor: 'rgba(255,255,255,0.02)',
  border: '1px solid #1a1a1a',
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const cancelBtnStyle = {
  background: 'none',
  border: '1px solid var(--primary-red)',
  color: 'var(--primary-red)',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.8rem',
  fontWeight: 600,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: 'var(--primary-red)',
    color: '#FFFFFF'
  }
};

const typeBadgeStyle = (type) => ({
  fontSize: '0.7rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  backgroundColor: type === 'class' ? 'rgba(52,152,219,0.15)' : 'rgba(155,89,182,0.15)',
  color: type === 'class' ? '#3498db' : '#9b59b6',
  padding: '2px 8px',
  borderRadius: '4px'
});

const macroBoxStyle = (color) => ({
  padding: '15px',
  backgroundColor: 'rgba(255,255,255,0.01)',
  border: '1px solid #1a1a1a',
  borderTop: `3px solid ${color}`,
  borderRadius: '8px',
  textAlign: 'center'
});

const biaMetricBoxStyle = (color) => ({
  padding: '12px',
  backgroundColor: 'rgba(255,255,255,0.01)',
  border: '1px solid #1a1a1a',
  borderTop: `3px solid ${color}`,
  borderRadius: '8px',
  textAlign: 'center'
});
