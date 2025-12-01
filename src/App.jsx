import React, { useState, useEffect } from 'react';
import { 
  Users, Lock, PiggyBank, Calendar, CheckCircle, Plus, Trash2, LogOut, 
  Star, Target, Coins, Award, ChevronRight, ChevronLeft, ShieldCheck, X, History,
  Wallet, Edit2, Sparkles, Clock, ThumbsUp, ThumbsDown, Lock as LockIcon,
  CalendarDays, RotateCcw, AlertOctagon, Check, ClipboardList, KeyRound, Settings,
  PauseCircle, PlayCircle, UserPlus, UserMinus, FileText, ArrowRight, Gauge
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithCustomToken, 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit
} from 'firebase/firestore';

// --- FIREBASE CONFIGURATION ---
// TODO: Replace this object with your own keys from the Firebase Console!
const firebaseConfig = {
  apiKey: "AIzaSyA9-fxCiutjAuYtnhqkiiSGgFqPZ_hlOfM",
  authDomain: "chorepiggy-32df1.firebaseapp.com",
  projectId: "chorepiggy-32df1",
  storageBucket: "chorepiggy-32df1.firebasestorage.app",
  messagingSenderId: "998080774842",
  appId: "1:998080774842:web:6951d7c4696d74db02f883",
  measurementId: "G-7ZC94CFHVY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Utility Functions ---

const generateId = () => Math.random().toString(36).substr(2, 9);

const getLocalISODate = (date = new Date()) => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset*60*1000));
  return localDate.toISOString().split('T')[0];
};

const getStartOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay(); 
  const diff = d.getDate() - day; 
  const sunday = new Date(d.setDate(diff));
  sunday.setHours(0,0,0,0);
  return sunday;
};

const getWeekDays = (weekOffset = 0) => {
  const today = new Date();
  today.setDate(today.getDate() + (weekOffset * 7));
  const start = getStartOfWeek(today);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(getLocalISODate(d));
  }
  return days;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const formatDayDisplay = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
};

const getDayNameFromDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
};

const AVATARS = ['👶', '👧', '👦', '🦸', '🦸‍♀️', '🥷', '🧚', '🧜', '🧛', '🧟', '🤖', '👽', '🦊', '🐱', '🐶', '🦁', '🐯', '🦄', '🐲', '🦖'];

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', size = 'md', ...props }) => {
  const baseStyle = "rounded-lg font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed";
  
  const sizes = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200",
    secondary: "bg-purple-500 text-white hover:bg-purple-600 shadow-md shadow-purple-200",
    success: "bg-green-500 text-white hover:bg-green-600 shadow-md shadow-green-200",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-200",
    warning: "bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-200",
    ghost: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    outline: "border-2 border-gray-200 text-gray-600 hover:bg-gray-50",
    gold: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-orange-200 hover:scale-[1.02]",
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full text-gray-500"><X size={20} /></button>
        </div>
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

const PinPad = ({ onSuccess, onCancel, targetPin, title, onForgot }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleNum = (num) => {
    if (input.length < 4) {
      const newInput = input + num;
      setInput(newInput);
      if (newInput.length === 4) {
        if (newInput === targetPin) {
          onSuccess();
        } else {
          setError(true);
          setTimeout(() => {
            setInput('');
            setError(false);
          }, 500);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-bold text-center mb-6 text-gray-800">{title || "Enter PIN"}</h3>
        <div className="flex justify-center gap-4 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-4 h-4 rounded-full border-2 ${
              input.length > i 
                ? (error ? 'bg-red-500 border-red-500' : 'bg-blue-600 border-blue-600')
                : 'border-gray-300'
            }`} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} onClick={() => handleNum(num)} className="h-16 rounded-xl bg-gray-50 text-2xl font-bold text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors">
              {num}
            </button>
          ))}
          <div />
          <button onClick={() => handleNum(0)} className="h-16 rounded-xl bg-gray-50 text-2xl font-bold text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors">0</button>
          <button onClick={() => setInput(prev => prev.slice(0, -1))} className="h-16 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:bg-gray-200">
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="ghost" className="w-full" onClick={onCancel}>Cancel</Button>
          <button onClick={onForgot} className="text-xs text-blue-500 hover:text-blue-700 hover:underline flex items-center justify-center gap-1">
            <KeyRound size={12}/> Forgot PIN?
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [authUser, setAuthUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [kids, setKids] = useState([]);
  const [chores, setChores] = useState([]);
  const [taskLog, setTaskLog] = useState([]); 
  const [bonuses, setBonuses] = useState([]);
  const [history, setHistory] = useState([]); 

  const [view, setView] = useState('login'); 
  const [currentUser, setCurrentUser] = useState(null); 
  const [showPinPad, setShowPinPad] = useState(false);
  const [pinTarget, setPinTarget] = useState(null);

  useEffect(() => {
    // Authenticate Anonymously to access Firestore
    signInAnonymously(auth).catch((error) => console.error("Auth Error:", error));
    return onAuthStateChanged(auth, setAuthUser);
  }, []);

  // Auto-login persistence for kids
  useEffect(() => {
    if (kids.length > 0 && view === 'login' && !currentUser) {
      const savedUserId = localStorage.getItem('chorePiggy_activeUser');
      if (savedUserId) {
        const kid = kids.find(k => k.id === savedUserId);
        if (kid) {
          setCurrentUser(kid);
          setView('kid');
        }
      }
    }
  }, [kids, view, currentUser]);

  // Data Listeners
  useEffect(() => {
    if (!authUser) return;
    
    // Using simple collection references. 
    // MAKE SURE YOU REPLACE 'firebaseConfig' at the top with your actual keys!
    const COLLECTIONS = { users: setUsers, kids: setKids, chores: setChores, task_log: setTaskLog, bonuses: setBonuses };
    
    const unsubscribers = Object.entries(COLLECTIONS).map(([key, setter]) => {
      return onSnapshot(collection(db, key), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setter(data);
        // Create default parent if none exist
        if (key === 'users' && data.length === 0) {
          const defaultParent = { id: 'parent1', name: 'Parent', role: 'parent', pin: '1234' };
          setDoc(doc(db, 'users', defaultParent.id), defaultParent);
        }
      });
    });

    const historyQuery = query(collection(db, 'history'), orderBy('date', 'desc'), limit(50));
    const historyUnsub = onSnapshot(historyQuery, (snapshot) => {
      setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubscribers.forEach(unsub => unsub()); historyUnsub(); };
  }, [authUser]);

  const data = { users, kids, chores, taskLog, bonuses, history };

  // --- Actions ---

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setView(user.role === 'parent' ? 'parent' : 'kid');
    setShowPinPad(false);
    setPinTarget(null);
    if (user.role === 'kid') {
      localStorage.setItem('chorePiggy_activeUser', user.id);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
    localStorage.removeItem('chorePiggy_activeUser');
  };

  const handleForgotPin = async () => {
    if (pinTarget?.role === 'parent') {
      const code = prompt("Enter Master Recovery Code (hint: admin):");
      if (code === 'admin') {
        await updateDoc(doc(db, 'users', pinTarget.id), {
          pin: '1234'
        });
        alert(`${pinTarget.name}'s PIN has been reset to: 1234`);
        setShowPinPad(false);
        setPinTarget(null);
      } else {
        alert("Incorrect recovery code.");
      }
    } else {
      alert("Please ask a parent to reset your PIN in the Family Members tab.");
    }
  };

  // --- CRUD Operations ---
  
  const logTransaction = async (kidId, amount, type, description, actorName) => {
    await addDoc(collection(db, 'history'), {
      kidId, amount, type, description, 
      date: new Date().toISOString(),
      by: actorName || 'Unknown' 
    });
  };

  const updateBalance = async (kidId, amount, type, description, actorName) => {
    const kid = kids.find(k => k.id === kidId);
    if (kid) {
      await updateDoc(doc(db, 'kids', kidId), {
        balance: kid.balance + amount
      });
      await logTransaction(kidId, amount, type, description, actorName);
    }
  };

  const addParent = async (name, pin) => {
    const id = generateId();
    await setDoc(doc(db, 'users', id), {
      name, pin, role: 'parent'
    });
  };

  const deleteParent = async (id) => {
    await deleteDoc(doc(db, 'users', id));
  };

  const updateParentPin = async (parentId, newPin) => {
    await updateDoc(doc(db, 'users', parentId), { pin: newPin });
  };

  // --- Chore Logic ---

  const submitChore = async (chore, kidId, dateString) => {
    const existingLog = taskLog.find(t => t.type === 'chore' && t.taskId === chore.id && t.kidId === kidId && t.dateString === dateString);
    if (existingLog) { await updateDoc(doc(db, 'task_log', existingLog.id), { status: 'pending', timestamp: new Date().toISOString() }); } 
    else { const id = generateId(); await setDoc(doc(db, 'task_log', id), { type: 'chore', taskId: chore.id, title: chore.title, kidId, dateString, status: 'pending', timestamp: new Date().toISOString() }); }
  };

  const parentOverrideTask = async (chore, kidId, dateString, action, parentName) => {
    const existingLog = taskLog.find(t => t.type === 'chore' && t.taskId === chore.id && t.kidId === kidId && t.dateString === dateString);
    let docRef = existingLog ? doc(db, 'task_log', existingLog.id) : doc(db, 'task_log', generateId());
    
    const baseData = { type: 'chore', taskId: chore.id, title: chore.title, kidId, dateString, timestamp: new Date().toISOString() };
    
    if (action === 'approve') {
      const stats = calculateWeeklyStats(kidId); 
      // Calculate value based on weight
      const weight = chore.weight || 1;
      const value = weight * stats.valuePerPoint;

      await setDoc(docRef, { ...baseData, status: 'approved', approvedAt: new Date().toISOString() }, { merge: true });
      if (!existingLog || existingLog.status !== 'approved') { 
        await updateBalance(kidId, value, 'chore', `${chore.title} (${formatDayDisplay(dateString)})`, parentName); 
      }
    } else if (action === 'fail') { 
      await setDoc(docRef, { ...baseData, status: 'failed', rejectedAt: new Date().toISOString() }, { merge: true }); 
    } else if (action === 'retry') { 
      await setDoc(docRef, { ...baseData, status: 'changes_requested', rejectedAt: new Date().toISOString() }, { merge: true }); 
    }
  };

  const submitBonus = async (bonus, kidId) => {
    const id = generateId(); await setDoc(doc(db, 'task_log', id), { type: 'bonus', taskId: bonus.id, title: bonus.title, reward: bonus.reward, kidId, status: 'pending', timestamp: new Date().toISOString() });
    await deleteDoc(doc(db, 'bonuses', bonus.id));
  };

  const approveTask = async (task, calculatedValue, parentName) => {
    await updateDoc(doc(db, 'task_log', task.id), { status: 'approved', approvedAt: new Date().toISOString() });
    const payout = task.type === 'bonus' ? task.reward : calculatedValue;
    const dateContext = task.dateString ? `(${formatDayDisplay(task.dateString)})` : '(Bonus)';
    await updateBalance(task.kidId, payout, task.type, `${task.title} ${dateContext}`, parentName);
  };

  const rejectTask = async (task, actionType) => {
    const newStatus = actionType === 'retry' ? 'changes_requested' : 'failed';
    await updateDoc(doc(db, 'task_log', task.id), { status: newStatus, rejectedAt: new Date().toISOString() });
  };

  const addKid = async (name, pin, allowanceAmount) => { 
    const id = generateId(); 
    await setDoc(doc(db, 'kids', id), { 
      name, 
      pin, 
      role: 'kid', 
      balance: 0, 
      savingsGoal: 0, // Unset default
      goalName: '', // Unset default
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)], 
      allowanceAmount: Number(allowanceAmount) 
    }); 
  };
  
  const updateKid = async (kidId, updates) => updateDoc(doc(db, 'kids', kidId), updates);
  
  const addChore = async (chore) => { 
    setDoc(doc(db, 'chores', generateId()), chore);
  };
  
  const updateChore = async (id, updates) => updateDoc(doc(db, 'chores', id), updates);
  const deleteChore = async (id) => deleteDoc(doc(db, 'chores', id));
  
  const addBonus = async (title, reward) => setDoc(doc(db, 'bonuses', generateId()), { title, reward, status: 'available' });
  const deleteBonus = async (id) => deleteDoc(doc(db, 'bonuses', id));

  // --- Statistics Calculations ---
  
  const isChoreActive = (chore) => {
    if (!chore.pausedUntil) return true; 
    const today = getLocalISODate();
    return chore.pausedUntil <= today;
  };

  const calculateWeeklyStats = (kidId, weekOffset = 0) => {
    const kid = kids.find(k => k.id === kidId);
    if (!kid) return { potential: 0, earned: 0, pending: 0, totalTasks: 0, valuePerPoint: 0 };
    const allowance = kid.allowanceAmount || 0;
    
    // 1. Calculate Total Weight of active chores
    const activeChores = chores.filter(c => c.kidId === kidId && isChoreActive(c));
    let totalScheduledWeight = 0;
    activeChores.forEach(c => { 
        const weight = c.weight || 1; 
        totalScheduledWeight += (weight * c.days.length); 
    });
    
    const valuePerPoint = totalScheduledWeight > 0 ? (allowance / totalScheduledWeight) : 0;

    // 2. Calculate Earned/Pending based on history logs
    const weekDays = getWeekDays(weekOffset);
    const weekLogs = taskLog.filter(t => t.kidId === kidId && t.type === 'chore' && weekDays.includes(t.dateString));
    
    let earned = 0;
    let pending = 0;

    weekLogs.forEach(log => {
      const choreDef = chores.find(c => c.id === log.taskId);
      const weight = choreDef?.weight || 1;
      const taskValue = weight * valuePerPoint;

      if (log.status === 'approved') earned += taskValue;
      if (log.status === 'pending') pending += taskValue;
    });

    return {
      potential: allowance,
      earned,
      pending,
      totalWeight: totalScheduledWeight,
      valuePerPoint
    };
  };

  // --- Views Switcher ---

  if (!authUser) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading secure database...</div>;

  if (showPinPad) {
    return <PinPad targetPin={pinTarget?.pin} onSuccess={() => handleLoginSuccess(pinTarget)} onCancel={() => { setShowPinPad(false); setPinTarget(null); }} title={`Enter ${pinTarget?.name}'s PIN`} onForgot={handleForgotPin} />;
  }

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-600 flex items-center justify-center gap-3 mb-2"><PiggyBank size={40} /> ChorePiggy</h1>
          <p className="text-gray-500">Weekly Allowance Tracker</p>
        </div>
        <div className="max-w-md w-full grid gap-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">Parents</h2>
          {users.map(u => (
            <button key={u.id} onClick={() => { setPinTarget(u); setShowPinPad(true); }} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-all group">
              <div className="flex items-center gap-4"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><ShieldCheck size={24} /></div><span className="font-bold text-lg text-gray-700">{u.name}</span></div><ChevronRight className="text-gray-300 group-hover:text-blue-500" />
            </button>
          ))}
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1 mt-4">Kids</h2>
          {kids.map(k => (
            <button key={k.id} onClick={() => { setPinTarget(k); setShowPinPad(true); }} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-all group">
              <div className="flex items-center gap-4"><div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">{k.avatar}</div><div className="text-left"><span className="font-bold text-lg text-gray-700 block">{k.name}</span><span className="text-xs text-gray-400 font-semibold">Kid Account</span></div></div><ChevronRight className="text-gray-300 group-hover:text-purple-500" />
            </button>
          ))}
          {kids.length === 0 && <div className="text-center p-6 bg-white rounded-xl border border-dashed text-gray-400">No kids yet. Login as parent to setup!</div>}
        </div>
      </div>
    );
  }

  if (view === 'parent') {
    return <ParentView data={data} user={currentUser} logout={handleLogout} addKid={addKid} addChore={addChore} updateChore={updateChore} deleteChore={deleteChore} addBonus={addBonus} deleteBonus={deleteBonus} updateBalance={updateBalance} updateKid={updateKid} approveTask={approveTask} rejectTask={rejectTask} parentOverrideTask={parentOverrideTask} calculateWeeklyStats={calculateWeeklyStats} updateParentPin={updateParentPin} addParent={addParent} deleteParent={deleteParent} />;
  }

  if (view === 'kid') {
    const freshUser = kids.find(k => k.id === currentUser.id) || currentUser;
    return <KidView user={freshUser} data={data} logout={handleLogout} submitChore={submitChore} submitBonus={submitBonus} updateKid={updateKid} calculateWeeklyStats={calculateWeeklyStats} isChoreActive={isChoreActive} />;
  }
}

// --- Sub-View Components ---

function ParentView({ data, user, logout, addKid, addChore, updateChore, deleteChore, addBonus, deleteBonus, updateBalance, updateKid, approveTask, rejectTask, parentOverrideTask, calculateWeeklyStats, updateParentPin, addParent, deleteParent }) {
  const [activeTab, setActiveTab] = useState('approvals');
  const [showAddKid, setShowAddKid] = useState(false);
  const [newKidName, setNewKidName] = useState('');
  const [newKidPin, setNewKidPin] = useState('');
  const [newKidAllowance, setNewKidAllowance] = useState('10');
  
  // Modals
  const [selectedKid, setSelectedKid] = useState(null); 
  const [editingKidProfile, setEditingKidProfile] = useState(null); 
  const [managingTasksKid, setManagingTasksKid] = useState(null);
  const [rejectingTask, setRejectingTask] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [editingChore, setEditingChore] = useState(null);

  // Bank Manager
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionDesc, setTransactionDesc] = useState('');
  const [transactionType, setTransactionType] = useState('add');
  // Task Manager
  const [managerWeekOffset, setManagerWeekOffset] = useState(0);
  
  // Forms
  const [choreKidIds, setChoreKidIds] = useState([]); // Multi-assign array
  const [choreTitle, setChoreTitle] = useState('');
  const [choreWeight, setChoreWeight] = useState('1'); 
  const [choreDays, setChoreDays] = useState([0,1,2,3,4]); 
  const [bonusTitle, setBonusTitle] = useState('');
  const [bonusReward, setBonusReward] = useState('2');
  
  // Settings Forms
  const [newParentPin, setNewParentPin] = useState('');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPin2, setNewParentPin2] = useState(''); 

  const pendingTasks = data.taskLog.filter(t => t.status === 'pending');
  pendingTasks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const pendingCount = pendingTasks.length;

  const handleTransaction = () => {
    if (!transactionAmount || !selectedKid) return;
    const amount = Number(transactionAmount);
    const finalAmount = transactionType === 'add' ? amount : -amount;
    const type = transactionType === 'add' ? 'manual_add' : 'manual_subtract';
    const defaultDesc = transactionType === 'add' ? 'Manual Deposit' : 'Cash Out / Purchase';
    updateBalance(selectedKid.id, finalAmount, type, transactionDesc || defaultDesc, user.name);
    setSelectedKid(null);
    setTransactionAmount('');
    setTransactionDesc('');
  };

  const approveAll = async () => {
    if (confirm(`Approve all ${pendingCount} tasks?`)) {
      for (const task of pendingTasks) {
        if(task.type === 'chore') {
           const stats = calculateWeeklyStats(task.kidId);
           const choreDef = data.chores.find(c => c.id === task.taskId);
           const weight = choreDef?.weight || 1;
           const val = weight * stats.valuePerPoint;
           await approveTask(task, val, user.name);
        } else {
           await approveTask(task, 0, user.name); 
        }
      }
    }
  };

  const handleAddKid = (e) => {
    e.preventDefault();
    if(newKidName && newKidPin) {
      addKid(newKidName, newKidPin, newKidAllowance);
      setShowAddKid(false); setNewKidName(''); setNewKidPin('');
    }
  };

  const handleAddChore = (e) => {
    e.preventDefault();
    if (choreTitle && choreKidIds.length > 0) {
      // Loop through selected kids and create chore for each
      choreKidIds.forEach(kidId => {
        addChore({ kidId, title: choreTitle, days: choreDays, weight: Number(choreWeight) });
      });
      setChoreTitle('');
      setChoreWeight('1');
      setChoreKidIds([]);
    }
  };

  const handleUpdateChore = () => {
    if (editingChore) {
      updateChore(editingChore.id, {
        title: editingChore.title,
        days: editingChore.days,
        weight: Number(editingChore.weight),
        pausedUntil: editingChore.pausedUntil || null
      });
      setEditingChore(null);
    }
  };

  const handleAddGuardian = () => {
    if (newParentName && newParentPin2.length === 4) {
      addParent(newParentName, newParentPin2);
      setNewParentName('');
      setNewParentPin2('');
    }
  };

  const toggleDay = (i) => setChoreDays(prev => prev.includes(i) ? prev.filter(d => d !== i) : [...prev, i].sort());
  
  const toggleMultiAssign = (kidId) => {
    setChoreKidIds(prev => prev.includes(kidId) ? prev.filter(id => id !== kidId) : [...prev, kidId]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-xl"><ShieldCheck /> {user.name}'s Dashboard</div>
          <div className="flex gap-2">
            <button onClick={() => setShowSettings(true)} className="text-gray-500 hover:text-blue-600"><Settings size={20}/></button>
            <button onClick={logout} className="text-gray-500 hover:text-red-500"><LogOut size={20}/></button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex p-1 bg-white rounded-xl shadow-sm">
          {['approvals', 'kids', 'chores', 'bonuses', 'history'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`relative flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-colors ${activeTab === tab ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}>
              {tab}
              {tab === 'approvals' && pendingCount > 0 && (
                <span className="absolute top-1 right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* SETTINGS MODAL */}
        <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Family Settings">
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-bold text-gray-700 text-sm uppercase">My PIN</h4>
              <div className="flex gap-2">
                <input type="text" maxLength="4" placeholder="New PIN" className="border p-2 rounded flex-1" value={newParentPin} onChange={e => setNewParentPin(e.target.value)} />
                <Button size="sm" onClick={() => { if(newParentPin.length===4) updateParentPin(user.id, newParentPin); setNewParentPin(''); alert('PIN updated'); }}>Update</Button>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="font-bold text-gray-700 text-sm uppercase">Manage Guardians</h4>
              <div className="space-y-2">
                {data.users.filter(u => u.role === 'parent').map(p => (
                  <div key={p.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span className="font-bold text-gray-700">{p.name} {p.id === user.id && '(You)'}</span>
                    {p.id !== user.id && (
                      <button onClick={() => deleteParent(p.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Name (e.g. Dad)" className="border p-2 rounded" value={newParentName} onChange={e => setNewParentName(e.target.value)} />
                <input maxLength="4" placeholder="PIN" className="border p-2 rounded" value={newParentPin2} onChange={e => setNewParentPin2(e.target.value)} />
              </div>
              <Button onClick={handleAddGuardian} className="w-full" variant="outline"><UserPlus size={16}/> Add Guardian</Button>
            </div>
          </div>
        </Modal>

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-700">Global Activity Log</h2>
            </div>
            {data.history.length === 0 && <p className="text-center py-10 text-gray-400">No activity yet.</p>}
            <div className="space-y-2">
              {data.history.map(h => {
                const kid = data.kids.find(k => k.id === h.kidId);
                return (
                  <div key={h.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center text-sm">
                     <div>
                       <div className="font-bold text-gray-700 flex items-center gap-2">
                         {kid && <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full">{kid.name}</span>}
                         <span>{h.description}</span>
                       </div>
                       <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                         <span>{new Date(h.date).toLocaleString()}</span>
                         <span>•</span>
                         <span className="font-medium text-blue-500">by {h.by || 'System'}</span>
                       </div>
                     </div>
                     {h.amount !== 0 && (
                       <span className={`font-bold ${h.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                         {h.amount > 0 ? '+' : ''}{formatCurrency(h.amount)}
                       </span>
                     )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* EDIT KID PROFILE MODAL */}
        <Modal isOpen={!!editingKidProfile} onClose={() => setEditingKidProfile(null)} title="Edit Profile">
          {editingKidProfile && (
            <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">Name</label>
                 <input className="w-full border p-2 rounded" value={editingKidProfile.name} onChange={e => setEditingKidProfile({...editingKidProfile, name: e.target.value})} />
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">PIN</label>
                 <input className="w-full border p-2 rounded" maxLength="4" value={editingKidProfile.pin} onChange={e => setEditingKidProfile({...editingKidProfile, pin: e.target.value})} />
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">Weekly Allowance Cap ($)</label>
                 <input className="w-full border p-2 rounded" type="number" value={editingKidProfile.allowanceAmount} onChange={e => setEditingKidProfile({...editingKidProfile, allowanceAmount: e.target.value})} />
               </div>
               <div className="flex gap-2 pt-2">
                 <Button variant="ghost" onClick={() => setEditingKidProfile(null)} className="flex-1">Cancel</Button>
                 <Button onClick={() => { 
                   updateKid(editingKidProfile.id, { 
                     name: editingKidProfile.name, 
                     pin: editingKidProfile.pin, 
                     allowanceAmount: Number(editingKidProfile.allowanceAmount) 
                   }); 
                   setEditingKidProfile(null); 
                 }} className="flex-1">Save Changes</Button>
               </div>
            </div>
          )}
        </Modal>

        {/* EDIT CHORE MODAL */}
        <Modal isOpen={!!editingChore} onClose={() => setEditingChore(null)} title="Edit Chore">
          {editingChore && (
            <div className="space-y-4">
              <div><label className="text-xs font-bold text-gray-500">Task Name</label><input className="w-full border p-2 rounded" value={editingChore.title} onChange={e => setEditingChore({...editingChore, title: e.target.value})} /></div>
              <div>
                <label className="text-xs font-bold text-gray-500">Weight (Points)</label>
                <div className="flex items-center gap-4 mt-1">
                  <input type="range" min="1" max="10" className="flex-1" value={editingChore.weight || 1} onChange={e => setEditingChore({...editingChore, weight: e.target.value})} />
                  <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">{editingChore.weight || 1}x</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">Days</label>
                <div className="flex justify-between gap-1 mt-1">
                  {['S','M','T','W','T','F','S'].map((day, i) => (
                    <button key={i} onClick={() => {
                        const days = editingChore.days.includes(i) ? editingChore.days.filter(d=>d!==i) : [...editingChore.days, i].sort();
                        setEditingChore({...editingChore, days});
                    }} className={`w-8 h-8 rounded-full text-xs font-bold ${editingChore.days.includes(i) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{day}</button>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-500">Status</label>
                <div className="flex gap-2 mt-1">
                  <button onClick={() => setEditingChore({...editingChore, pausedUntil: null})} className={`flex-1 p-2 rounded text-sm font-bold ${!editingChore.pausedUntil ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}><PlayCircle size={16} className="inline mr-1"/> Active</button>
                  <button onClick={() => setEditingChore({...editingChore, pausedUntil: '2099-12-31'})} className={`flex-1 p-2 rounded text-sm font-bold ${editingChore.pausedUntil ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}><PauseCircle size={16} className="inline mr-1"/> Paused</button>
                </div>
                {editingChore.pausedUntil && (
                   <div className="mt-2 text-xs text-amber-600">
                     Paused until: <input type="date" value={editingChore.pausedUntil === '2099-12-31' ? '' : editingChore.pausedUntil} onChange={e => setEditingChore({...editingChore, pausedUntil: e.target.value || '2099-12-31'})} className="border p-1 rounded ml-2" />
                   </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="ghost" onClick={() => setEditingChore(null)} className="flex-1">Cancel</Button>
                <Button onClick={handleUpdateChore} className="flex-1">Save Changes</Button>
              </div>
            </div>
          )}
        </Modal>

        {/* REJECT MODAL */}
        <Modal isOpen={!!rejectingTask} onClose={() => setRejectingTask(null)} title="Review Task">
           <div className="space-y-4">
              <p className="text-gray-600">How would you like to handle <strong>{rejectingTask?.title}</strong>?</p>
              <button onClick={() => { rejectTask(rejectingTask, 'retry'); setRejectingTask(null); }} className="w-full p-4 border-2 border-amber-200 bg-amber-50 rounded-xl flex items-center gap-3 hover:bg-amber-100 transition-colors text-left group">
                 <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-700"><RotateCcw size={20}/></div>
                 <div><span className="font-bold text-gray-800 block group-hover:text-amber-800">Try Again</span><span className="text-xs text-gray-500">Sends back to kid to redo.</span></div>
              </button>
              <button onClick={() => { rejectTask(rejectingTask, 'fail'); setRejectingTask(null); }} className="w-full p-4 border-2 border-red-200 bg-red-50 rounded-xl flex items-center gap-3 hover:bg-red-100 transition-colors text-left group">
                 <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center text-red-700"><AlertOctagon size={20}/></div>
                 <div><span className="font-bold text-gray-800 block group-hover:text-red-800">Fail Task</span><span className="text-xs text-gray-500">Task fails. Money lost. Cannot redo.</span></div>
              </button>
           </div>
        </Modal>

        <Modal isOpen={!!selectedKid} onClose={() => setSelectedKid(null)} title={`Bank Manager: ${selectedKid?.name}`}>
          <div className="space-y-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button onClick={() => setTransactionType('add')} className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 ${transactionType === 'add' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'}`}><Plus size={16} /> Deposit</button>
              <button onClick={() => setTransactionType('sub')} className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 ${transactionType === 'sub' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500'}`}><Wallet size={16} /> Cash Out</button>
            </div>
            <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase">Amount ($)</label><input type="number" autoFocus className="w-full text-3xl font-bold p-2 border-b-2 border-blue-500 focus:outline-none" placeholder="0.00" value={transactionAmount} onChange={e => setTransactionAmount(e.target.value)} /></div>
            <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase">Description</label><input type="text" className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200" placeholder={transactionType === 'add' ? "e.g. Birthday Gift" : "e.g. Bought Lego Set"} value={transactionDesc} onChange={e => setTransactionDesc(e.target.value)} /></div>
            <Button onClick={handleTransaction} className={`w-full ${transactionType === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>Confirm {transactionType === 'add' ? 'Deposit' : 'Withdrawal'}</Button>
            <div className="mt-4 pt-4 border-t border-gray-100">
               <h4 className="text-xs font-bold text-gray-400 mb-2">RECENT HISTORY</h4>
               <div className="space-y-2 max-h-40 overflow-y-auto">
                 {data.history.filter(h => h.kidId === selectedKid?.id).slice(0, 5).map(h => (
                   <div key={h.id} className="flex justify-between text-sm"><span className="text-gray-600 truncate max-w-[180px]">{h.description}</span><div className="text-right"><span className={`font-bold block ${h.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>{h.amount > 0 ? '+' : ''}{formatCurrency(h.amount)}</span><span className="text-[10px] text-gray-400">{h.by}</span></div></div>
                 ))}
               </div>
            </div>
          </div>
        </Modal>

        <Modal isOpen={!!managingTasksKid} onClose={() => setManagingTasksKid(null)} title={`Tasks: ${managingTasksKid?.name}`}>
           <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
                 <button onClick={() => setManagerWeekOffset(prev => prev - 1)} className="p-2 hover:bg-gray-200 rounded"><ChevronLeft size={16}/></button>
                 <span className="font-bold text-sm text-gray-700">{managerWeekOffset === 0 ? 'This Week' : 'Last Week'}</span>
                 <button onClick={() => setManagerWeekOffset(prev => prev + 1)} className="p-2 hover:bg-gray-200 rounded"><ChevronRight size={16}/></button>
              </div>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                 {getWeekDays(managerWeekOffset).map(dayISO => {
                    const dayChores = data.chores.filter(c => c.kidId === managingTasksKid?.id && c.days.includes(new Date(dayISO).getDay()));
                    if(dayChores.length === 0) return null;
                    return (
                       <div key={dayISO} className="space-y-2">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{getDayNameFromDate(dayISO)} ({formatDayDisplay(dayISO)})</h4>
                          {dayChores.map(chore => {
                             const log = data.taskLog.find(t => t.type === 'chore' && t.taskId === chore.id && t.kidId === managingTasksKid.id && t.dateString === dayISO);
                             const status = log ? log.status : 'todo';
                             let statusColor = 'bg-gray-100 border-gray-200';
                             if(status === 'approved') statusColor = 'bg-green-50 border-green-200';
                             if(status === 'pending') statusColor = 'bg-amber-50 border-amber-200';
                             if(status === 'failed') statusColor = 'bg-red-50 border-red-200';
                             if(status === 'changes_requested') statusColor = 'bg-yellow-50 border-yellow-200';
                             return (
                                <div key={`${chore.id}-${dayISO}`} className={`p-3 rounded-lg border ${statusColor} flex justify-between items-center`}>
                                   <div><div className="font-bold text-gray-800 text-sm">{chore.title} <span className="text-[10px] text-blue-500 bg-blue-50 px-1 rounded ml-1">{chore.weight || 1}x</span></div><div className="text-xs capitalize text-gray-500 font-medium">{status.replace('_', ' ')}</div></div>
                                   <div className="flex gap-1">
                                      {status !== 'approved' && (<button onClick={() => parentOverrideTask(chore, managingTasksKid.id, dayISO, 'approve', user.name)} className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200" title="Mark Done"><Check size={16}/></button>)}
                                      {status !== 'failed' && (<button onClick={() => parentOverrideTask(chore, managingTasksKid.id, dayISO, 'fail', user.name)} className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200" title="Fail Task"><X size={16}/></button>)}
                                      {status !== 'changes_requested' && status !== 'approved' && (<button onClick={() => parentOverrideTask(chore, managingTasksKid.id, dayISO, 'retry', user.name)} className="p-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200" title="Request Retry"><RotateCcw size={16}/></button>)}
                                   </div>
                                </div>
                             );
                          })}
                       </div>
                    );
                 })}
                 {data.chores.filter(c => c.kidId === managingTasksKid?.id).length === 0 && <div className="text-center text-gray-400 py-8">No chores assigned to this kid.</div>}
              </div>
           </div>
        </Modal>

        {activeTab === 'approvals' && (
           <div className="space-y-4">
              <div className="flex justify-between items-center"><h2 className="text-lg font-bold text-gray-700">Waiting for Approval</h2>{pendingCount > 0 && <Button size="sm" variant="success" onClick={approveAll}>Approve All ({pendingCount})</Button>}</div>
              {pendingCount === 0 && <div className="text-center py-10 bg-white rounded-xl border border-dashed text-gray-400">All caught up! No pending tasks.</div>}
              <div className="space-y-3">
                 {pendingTasks.map(task => {
                    const kid = data.kids.find(k => k.id === task.kidId);
                    const choreDef = data.chores.find(c => c.id === task.taskId);
                    const weight = choreDef?.weight || 1;
                    const stats = calculateWeeklyStats(task.kidId);
                    const estimatedValue = task.type === 'bonus' ? task.reward : (weight * stats.valuePerPoint);
                    return (
                       <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-l-4 border-l-amber-400 flex flex-col md:flex-row gap-4 justify-between items-center animate-in slide-in-from-left-2">
                          <div className="flex items-center gap-4 w-full md:w-auto">
                             <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl relative">{kid?.avatar}<div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-100"><Clock size={12} className="text-amber-500"/></div></div>
                             <div>
                               <div className="font-bold text-gray-800 flex items-center gap-2">
                                 {task.title}
                                 {task.type === 'chore' && weight > 1 && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{weight}x</span>}
                               </div>
                               <div className="text-sm text-gray-500 flex items-center gap-2"><span>{kid?.name}</span><span>•</span><span className={`font-bold ${task.dateString === getLocalISODate() ? 'text-green-600' : 'text-amber-600'}`}>{task.dateString ? formatDayDisplay(task.dateString) : 'Bonus Task'}</span></div>
                             </div>
                          </div>
                          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                             <span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">{formatCurrency(estimatedValue)}</span>
                             <button onClick={() => setRejectingTask(task)} className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors" title="Reject"><ThumbsDown size={20}/></button>
                             <button onClick={() => approveTask(task, estimatedValue, user.name)} className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg shadow-green-200 transition-colors" title="Approve"><ThumbsUp size={20}/></button>
                          </div>
                       </div>
                    );
                 })}
              </div>
           </div>
        )}

        {/* ... (KIDS TAB kept mostly same, just ensuring correct data passed) ... */}
        {activeTab === 'kids' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center"><h2 className="text-lg font-bold text-gray-700">Family Members</h2><Button onClick={() => setShowAddKid(true)} size="sm"><Plus size={16}/> Add Kid</Button></div>
            {showAddKid && (
              <Card className="p-4 animate-in slide-in-from-top-4">
                <form onSubmit={handleAddKid} className="space-y-4">
                  <h3 className="font-bold text-gray-700">New Kid Profile</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold block mb-1">Name</label><input className="w-full border p-2 rounded" value={newKidName} onChange={e => setNewKidName(e.target.value)} required /></div>
                    <div><label className="text-xs font-bold block mb-1">PIN</label><input maxLength="4" className="w-full border p-2 rounded" value={newKidPin} onChange={e => setNewKidPin(e.target.value)} required /></div>
                  </div>
                  <div><label className="text-xs font-bold block mb-1">Weekly Allowance Cap ($)</label><input type="number" className="w-full border p-2 rounded" value={newKidAllowance} onChange={e => setNewKidAllowance(e.target.value)} /></div>
                  <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setShowAddKid(false)}>Cancel</Button><Button type="submit">Save</Button></div>
                </form>
              </Card>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              {data.kids.map(kid => {
                const stats = calculateWeeklyStats(kid.id);
                return (
                <Card key={kid.id} className="p-4 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">{kid.avatar}</div>
                      <div>
                        <div className="font-bold text-lg">{kid.name}</div>
                        <div className="text-xs text-gray-500">Allowance Cap: {formatCurrency(kid.allowanceAmount || 0)}</div>
                        <div className="text-xs text-blue-500 font-bold">~ {formatCurrency(stats.valuePerPoint)} / point</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">{formatCurrency(kid.balance)}</div>
                      <div className="text-xs text-gray-400">Current Balance</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
                    <Button variant="outline" className="text-xs py-2 w-full" onClick={() => setEditingKidProfile(kid)}><Edit2 size={12}/> Edit Profile</Button>
                    <Button variant="ghost" className="text-xs py-2 w-full bg-blue-50 text-blue-700 hover:bg-blue-100" onClick={() => setSelectedKid(kid)}><Wallet size={14}/> Manage Funds</Button>
                  </div>
                  <Button variant="ghost" className="w-full text-xs bg-gray-50 hover:bg-gray-100 text-gray-700" onClick={() => setManagingTasksKid(kid)}><ClipboardList size={14}/> View Tasks</Button>
                </Card>
              )})}
            </div>
          </div>
        )}

        {/* --- CHORES TAB (UPDATED FOR MULTI ASSIGN & EDIT) --- */}
        {activeTab === 'chores' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-gray-700 mb-4">Assign New Chore</h3>
              <form onSubmit={handleAddChore} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Assign To</label>
                  <div className="flex gap-2 flex-wrap">
                    {data.kids.map(k => (
                      <button type="button" key={k.id} onClick={() => toggleMultiAssign(k.id)} className={`px-3 py-1 rounded-full text-sm font-bold border transition-colors ${choreKidIds.includes(k.id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}>
                        {k.name}
                      </button>
                    ))}
                  </div>
                  {choreKidIds.length === 0 && <p className="text-xs text-red-400 mt-1">Select at least one kid.</p>}
                </div>
                <div className="flex gap-4">
                  <div className="flex-1"><label className="block text-sm text-gray-500 mb-1">Task Name</label><input className="w-full border p-2 rounded-lg" placeholder="e.g. Clean Room" value={choreTitle} onChange={e => setChoreTitle(e.target.value)} required /></div>
                  <div className="w-24">
                    <label className="block text-sm text-gray-500 mb-1">Weight</label>
                    <div className="flex items-center border p-2 rounded-lg bg-white">
                      <input type="number" min="1" max="10" className="w-full outline-none" value={choreWeight} onChange={e => setChoreWeight(e.target.value)} />
                      <span className="text-gray-400 text-xs font-bold">x</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Schedule Days</label>
                  <div className="flex justify-between gap-1">
                    {['S','M','T','W','T','F','S'].map((day, i) => (
                      <button type="button" key={i} onClick={() => toggleDay(i)} className={`w-10 h-10 rounded-full font-bold text-sm transition-colors ${choreDays.includes(i) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>{day}</button>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={data.kids.length === 0}>Create Schedule</Button>
              </form>
            </Card>
            <div className="space-y-2">
              <h3 className="font-bold text-gray-700">Active Schedules</h3>
              {data.chores.map(chore => {
                const assignedKid = data.kids.find(k => k.id === chore.kidId);
                const isPaused = chore.pausedUntil && chore.pausedUntil > getLocalISODate();
                
                return (
                <div key={chore.id} className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center ${isPaused ? 'opacity-60 grayscale' : ''}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800">{chore.title}</span>
                      {chore.weight > 1 && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{chore.weight}x</span>}
                      {isPaused && <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><PauseCircle size={10}/> Paused</span>}
                    </div>
                    <div className="text-sm text-gray-500 flex gap-2 items-center">
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">{assignedKid?.name || 'Unknown'}</span>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{chore.days.length === 7 ? 'Everyday' : `${chore.days.length} days/wk`}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingChore(chore)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors"><Edit2 size={18}/></button>
                    <button onClick={() => deleteChore(chore.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              )})}
            </div>
          </div>
        )}

        {/* ... (BONUSES TAB remains same) ... */}
        {activeTab === 'bonuses' && (
          <div className="space-y-6">
            <Card className="p-6 bg-yellow-50 border-yellow-100">
              <h3 className="font-bold text-yellow-800 mb-4 flex items-center gap-2"><Star className="fill-yellow-500 text-yellow-500"/> Add Bonus Opportunity</h3>
              <div className="flex gap-2">
                <input className="flex-1 border border-yellow-200 p-2 rounded-lg" placeholder="Task (e.g. Wash Car)" value={bonusTitle} onChange={e => setBonusTitle(e.target.value)} />
                <input className="w-24 border border-yellow-200 p-2 rounded-lg" type="number" value={bonusReward} onChange={e => setBonusReward(e.target.value)} />
                <Button onClick={() => { if(bonusTitle) { addBonus(bonusTitle, Number(bonusReward)); setBonusTitle(''); } }} className="bg-yellow-500 hover:bg-yellow-600 text-white">Post</Button>
              </div>
            </Card>
            <div className="space-y-2">
              <h3 className="font-bold text-gray-700">Available Bonuses</h3>
              {data.bonuses.map(bonus => (
                <div key={bonus.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-3"><div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><Star size={16} className="fill-yellow-500" /></div><span className="font-semibold text-gray-700">{bonus.title}</span></div>
                  <div className="flex items-center gap-3"><span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">{formatCurrency(bonus.reward)}</span><button onClick={() => deleteBonus(bonus.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function KidView({ user, data, logout, submitChore, submitBonus, updateKid, calculateWeeklyStats, isChoreActive }) {
  // ... (KidView Logic identical to previous but needs 'isChoreActive' to filter UI) ...
  const [activeTab, setActiveTab] = useState('todo');
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalName, setGoalName] = useState(user.goalName || ''); // Default to empty
  const [goalAmount, setGoalAmount] = useState(user.savingsGoal || 0); // Default to 0
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const [weekOffset, setWeekOffset] = useState(0); 
  const weekDays = getWeekDays(weekOffset); 
  const stats = calculateWeeklyStats(user.id, weekOffset);
  
  const percentageEarned = Math.min((stats.earned / stats.potential) * 100, 100) || 0;
  const percentagePending = Math.min((stats.pending / stats.potential) * 100, 100) || 0;
  
  const getChoreStatus = (choreId, dateString) => {
    const log = data.taskLog.find(t => t.type === 'chore' && t.taskId === choreId && t.kidId === user.id && t.dateString === dateString);
    return log ? log.status : 'todo';
  };

  const isCurrentWeek = weekOffset === 0;

  return (
    <div className="min-h-screen bg-indigo-50 pb-20 font-sans">
      <Modal isOpen={avatarPickerOpen} onClose={() => setAvatarPickerOpen(false)} title="Choose Your Avatar">
        <div className="grid grid-cols-4 gap-4">
          {AVATARS.map(emoji => (<button key={emoji} onClick={() => { updateKid(user.id, { avatar: emoji }); setAvatarPickerOpen(false); }} className="text-4xl p-2 hover:bg-indigo-50 rounded-xl transition-colors">{emoji}</button>))}
        </div>
      </Modal>

      <Modal isOpen={showHistory} onClose={() => setShowHistory(false)} title="Your Money History">
        <div className="space-y-3">
          {data.history.filter(h => h.kidId === user.id).map(h => (
            <div key={h.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center"><div><div className="font-bold text-gray-700 text-sm">{h.description}</div><div className="text-xs text-gray-400">{new Date(h.date).toLocaleDateString()}</div></div><div className="text-right"><div className={`font-bold ${h.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>{h.amount > 0 ? '+' : ''}{formatCurrency(h.amount)}</div><div className="text-[10px] text-gray-400">{h.by}</div></div></div>
          ))}
          {data.history.filter(h => h.kidId === user.id).length === 0 && <p className="text-center text-gray-400">No transactions yet.</p>}
        </div>
      </Modal>

      {/* HEADER */}
      <div className="bg-indigo-600 text-white rounded-b-3xl shadow-xl p-6 pt-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setAvatarPickerOpen(true)} className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl border border-white/30 relative">{user.avatar}<div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5"><Edit2 size={10} className="text-indigo-600"/></div></button>
            <div><h1 className="font-bold text-xl opacity-90">Hi, {user.name}!</h1><p className="text-indigo-200 text-sm font-medium">Week of {formatDayDisplay(weekDays[0])}</p></div>
          </div>
          <button onClick={logout} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><LogOut size={18} /></button>
        </div>
        
        {/* WEEKLY ALLOWANCE PROGRESS & NAVIGATION */}
        <div className="relative z-10 mb-4 bg-indigo-800/30 p-4 rounded-xl border border-indigo-500/30">
           <div className="flex justify-between items-center mb-2">
             <button onClick={() => setWeekOffset(prev => prev - 1)} className="p-1 hover:bg-white/10 rounded"><ChevronLeft size={16}/></button>
             <span className="text-xs font-semibold text-indigo-100">
                {isCurrentWeek ? "This Week" : "Last Week"}
             </span>
             <button onClick={() => isCurrentWeek ? null : setWeekOffset(prev => prev + 1)} className={`p-1 rounded ${isCurrentWeek ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'}`}><ChevronRight size={16}/></button>
           </div>
           
           <div className="flex justify-between text-xs font-semibold text-indigo-100 mb-2">
             <span>Earned: {formatCurrency(stats.earned)}</span>
             <span>Weekly Cap: {formatCurrency(stats.potential)}</span>
           </div>
           <div className="h-4 bg-indigo-900 rounded-full overflow-hidden flex w-full">
             <div className="h-full bg-green-400 transition-all duration-500" style={{ width: `${percentageEarned}%` }}></div>
             <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${percentagePending}%` }}></div>
           </div>
           {percentagePending > 0 && <div className="text-[10px] text-right mt-1 text-amber-200 font-medium">({formatCurrency(stats.pending)} waiting approval)</div>}
        </div>

        <div className="flex flex-col items-center relative z-10">
          <button onClick={() => setShowHistory(true)} className="flex flex-col items-center group">
            <span className="text-indigo-200 text-sm font-medium mb-1 flex items-center gap-1 group-hover:text-white transition-colors">Bank Balance <History size={12}/></span>
            <span className="text-4xl font-extrabold tracking-tight">{formatCurrency(user.balance)}</span>
          </button>
        </div>
      </div>

      <main className="p-4 -mt-6 relative z-10 max-w-md mx-auto space-y-6">
        <Card className="flex p-1">
           <button onClick={() => setActiveTab('todo')} className={`flex-1 py-3 rounded-lg flex flex-col items-center gap-1 text-xs font-bold transition-all ${activeTab === 'todo' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:bg-gray-50'}`}><CalendarDays size={20} /> Tasks</button>
           <button onClick={() => setActiveTab('savings')} className={`flex-1 py-3 rounded-lg flex flex-col items-center gap-1 text-xs font-bold transition-all ${activeTab === 'savings' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:bg-gray-50'}`}><Target size={20} /> Goal</button>
           <button onClick={() => setActiveTab('bonus')} className={`flex-1 py-3 rounded-lg flex flex-col items-center gap-1 text-xs font-bold transition-all ${activeTab === 'bonus' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:bg-gray-50'}`}><Award size={20} /> Bonus</button>
        </Card>

        {activeTab === 'todo' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
             {weekDays.map((dayISO, dayIndex) => {
               // Filter chores: Must be assigned to kid, day matches, AND active (not paused)
               const dayChores = data.chores.filter(c => c.kidId === user.id && c.days.includes(new Date(dayISO).getDay()) && isChoreActive(c));
               if(dayChores.length === 0) return null;

               const isToday = dayISO === getLocalISODate();
               const isFuture = dayISO > getLocalISODate();
               
               return (
                 <div key={dayISO} className={`space-y-2 ${isFuture ? 'opacity-50 grayscale' : ''}`}>
                   <h3 className={`font-bold text-sm uppercase tracking-wider pl-2 ${isToday ? 'text-indigo-600' : 'text-gray-500'}`}>
                     {isToday ? 'Today' : getDayNameFromDate(dayISO)} <span className="text-xs font-normal opacity-70">({formatDayDisplay(dayISO)})</span>
                   </h3>
                   
                   {dayChores.map(chore => {
                     const status = getChoreStatus(chore.id, dayISO);
                     const isDone = status === 'approved';
                     const isPending = status === 'pending';
                     const isChangesRequested = status === 'changes_requested';
                     const isFailed = status === 'failed';
                     
                     return (
                        <div key={`${chore.id}-${dayISO}`} className="relative">
                          <button 
                            disabled={isDone || isPending || isFuture || isFailed} 
                            onClick={() => submitChore(chore, user.id, dayISO)} 
                            className={`w-full text-left p-3 rounded-xl border transition-all duration-300 shadow-sm flex items-center justify-between group overflow-hidden 
                            ${isDone ? 'bg-green-50 border-green-200' : 
                              isPending ? 'bg-amber-50 border-amber-200' : 
                              isChangesRequested ? 'bg-yellow-50 border-yellow-300 shadow-md' :
                              isFailed ? 'bg-red-50 border-red-200' : 
                              isFuture ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : 'bg-white border-indigo-100 hover:border-indigo-300'}`}
                          >
                            <div className="flex items-center gap-3 relative z-10">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors 
                                ${isDone ? 'bg-green-500 text-white' : 
                                  isPending ? 'bg-amber-400 text-white' :
                                  isChangesRequested ? 'bg-yellow-400 text-yellow-900' :
                                  isFailed ? 'bg-red-400 text-white' : 
                                  isFuture ? 'bg-gray-200 text-gray-400' : 'bg-gray-100 text-gray-300 group-hover:bg-indigo-100 group-hover:text-indigo-500'}`}>
                                {isDone ? <CheckCircle size={14} /> : isPending ? <Clock size={14} /> : isChangesRequested ? <RotateCcw size={14}/> : isFailed ? <X size={14} /> : isFuture ? <LockIcon size={12}/> : <div className="w-3 h-3 rounded-full border-2 border-current" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`font-bold block text-sm ${isDone ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{chore.title}</span>
                                  {chore.weight > 1 && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">{chore.weight}x</span>}
                                </div>
                                {isPending && <span className="text-[10px] font-bold text-amber-600">Waiting approval</span>}
                                {isChangesRequested && <span className="text-[10px] font-bold text-yellow-700">Try Again</span>}
                                {isFailed && <span className="text-[10px] font-bold text-red-500">Task Failed</span>}
                              </div>
                            </div>
                          </button>
                          {isChangesRequested && !isFuture && (
                              <button onClick={() => submitChore(chore, user.id, dayISO)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] bg-yellow-100 text-yellow-800 border border-yellow-300 px-3 py-1 rounded-full font-bold hover:bg-yellow-200 shadow-sm z-20">Redo</button>
                          )}
                        </div>
                     );
                   })}
                 </div>
               );
             })}
          </div>
        )}

        {/* ... (SAVINGS & BONUS TABS remain the same) ... */}
        {activeTab === 'savings' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <Card className="p-6 text-center space-y-4">
              <h2 className="text-gray-500 font-semibold uppercase tracking-wider text-xs">Saving For</h2>
              {editingGoal ? (
                <div className="space-y-4">
                  <input className="w-full text-center font-bold text-2xl border-b-2 border-indigo-200 focus:outline-none" value={goalName} onChange={(e) => setGoalName(e.target.value)} placeholder="Goal Name" />
                   <div className="flex items-center justify-center gap-2">
                    <span className="text-xl font-bold text-gray-400">$</span>
                    <input type="number" className="w-24 text-center font-bold text-2xl border-b-2 border-indigo-200 focus:outline-none" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} />
                  </div>
                  <div className="flex gap-2 justify-center pt-2">
                    <Button size="sm" variant="ghost" onClick={() => setEditingGoal(false)}>Cancel</Button>
                    <Button size="sm" onClick={() => { updateKid(user.id, { goalName, savingsGoal: Number(goalAmount) }); setEditingGoal(false); }}>Save</Button>
                  </div>
                </div>
              ) : (
                <>
                  {user.savingsGoal > 0 ? (
                    <>
                      <div className="flex items-center justify-center gap-2"><Target className="text-indigo-500" /><h3 className="text-3xl font-extrabold text-indigo-900">{user.goalName}</h3></div>
                      <p className="text-gray-500 font-medium">Goal: {formatCurrency(user.savingsGoal)}</p>
                      <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden w-full"><div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-indigo-600 transition-all duration-1000 ease-out" style={{ width: `${Math.min((user.balance / user.savingsGoal) * 100, 100)}%` }} /></div>
                      <p className="text-sm font-bold text-indigo-600">{Math.round(Math.min((user.balance / user.savingsGoal) * 100, 100))}% Reached</p>
                      <Button variant="outline" size="sm" onClick={() => setEditingGoal(true)} className="mx-auto mt-4">Change Goal</Button>
                    </>
                  ) : (
                    <div className="py-8 text-center space-y-4">
                      <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-300"><Target size={32}/></div>
                      <p className="text-gray-500">You haven't set a savings goal yet!</p>
                      <Button onClick={() => setEditingGoal(true)}>Set a Goal</Button>
                    </div>
                  )}
                </>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'bonus' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4">
            <h2 className="font-bold text-gray-700 text-lg px-1">Extra Tasks (Bonus)</h2>
            {data.bonuses.length === 0 && <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300"><p className="text-gray-400 font-medium">No extra tasks available.</p></div>}
            
            {data.taskLog.filter(t => t.kidId === user.id && t.type === 'bonus' && t.status === 'pending').map(pendingBonus => (
               <div key={pendingBonus.id} className="w-full bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between text-left opacity-80">
                <div className="flex items-center gap-4"><div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center"><Clock size={20} /></div><div><span className="font-bold text-gray-800 block">{pendingBonus.title}</span><span className="text-xs text-amber-700 font-bold uppercase tracking-wide">Waiting Approval</span></div></div>
                <div className="font-bold text-lg text-amber-600">+{formatCurrency(pendingBonus.reward)}</div>
              </div>
            ))}
            {data.bonuses.map(bonus => (
              <button key={bonus.id} onClick={() => submitBonus(bonus, user.id)} className="w-full bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-2xl border border-yellow-200 shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform text-left">
                <div className="flex items-center gap-4"><div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center"><Star className="fill-yellow-500 text-yellow-500" size={20} /></div><div><span className="font-bold text-gray-800 block">{bonus.title}</span><span className="text-xs text-yellow-700 font-semibold uppercase tracking-wide">Bonus Task</span></div></div>
                <div className="font-bold text-lg text-green-600 bg-white px-3 py-1 rounded-lg shadow-sm">+{formatCurrency(bonus.reward)}</div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}