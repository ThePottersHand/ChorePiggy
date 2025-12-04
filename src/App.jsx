import QRCode from "react-qr-code";
import React, { useState, useEffect } from "react";
import {
  Users,
  Lock,
  PiggyBank,
  Calendar,
  CheckCircle,
  Plus,
  Trash2,
  LogOut,
  Star,
  Target,
  Coins,
  Award,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  X,
  History,
  Wallet,
  Edit2,
  Sparkles,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Lock as LockIcon,
  CalendarDays,
  RotateCcw,
  AlertOctagon,
  Check,
  ClipboardList,
  KeyRound,
  Settings,
  PauseCircle,
  PlayCircle,
  UserPlus,
  UserMinus,
  FileText,
  ArrowRight,
  Gauge,
  Share,
  Download,
  Minus,
  Copy,
  User,
  Link as LinkIcon,
  Power,
  RefreshCw,
  Monitor,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  QrCode,
} from "lucide-react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
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
  limit,
  getDoc,
  increment,
} from "firebase/firestore";

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyA9-fxCiutjAuYtnhqkiiSGgFqPZ_hlOfM",
  authDomain: "chorepiggy-32df1.firebaseapp.com",
  projectId: "chorepiggy-32df1",
  storageBucket: "chorepiggy-32df1.firebasestorage.app",
  messagingSenderId: "998080774842",
  appId: "1:998080774842:web:6951d7c4696d74db02f883",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- UTILITIES ---

const generateId = () => Math.random().toString(36).substr(2, 9);

const getLocalISODate = (date = new Date()) => {
  try {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  } catch (e) {
    return new Date().toISOString().split("T")[0];
  }
};

const getStartOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  const sunday = new Date(d.setDate(diff));
  sunday.setHours(0, 0, 0, 0);
  return sunday;
};

const getWeekDays = (weekOffset = 0) => {
  const today = new Date();
  today.setDate(today.getDate() + weekOffset * 7);
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
  if (isNaN(amount) || amount === null) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDayDisplay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
};

const getDayNameFromDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
};

const formatTime12hr = (timeString) => {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const AVATARS = [
  // Animals
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "🐮",
  "🐷",
  "🐸",
  "🐵",
  "🐔",
  "🐧",
  "🐦",
  "🐤",
  "🦆",
  "🦅",
  "🦉",
  "🦇",
  "🐺",
  "🐗",
  "🐴",
  "🦄",
  "🐝",
  "🐛",
  "🦋",
  "🐌",
  "🐞",
  "🐜",
  "🕷️",
  "🐢",
  "🐍",
  "🦎",
  "🦂",
  "🦀",
  "🦑",
  "🐙",
  "🦐",
  "🐠",
  "🐟",
  "🐡",
  "🐬",
  "🦈",
  "🐳",
  "🐋",
  "🐊",
  "🐆",
  "🦓",
  "🦍",
  "🐘",
  "🦛",
  "🦏",
  "🐪",
  "🐫",
  "🦒",
  "🦘",
  "🐃",
  "🐂",
  "🐏",
  "🐑",
  "🐐",
  "🦌",
  "🐕",
  "🐩",
  "🐈",
  "🐓",
  "🦃",
  "🦚",
  "🦜",
  "🦢",
  "🦩",
  "🕊️",
  "🐇",
  "🦝",
  "🦡",
  "🐁",
  "🐀",
  "🐿️",
  "🦔",
  // Fantasy & People
  "👶",
  "👧",
  "👦",
  "🦸",
  "🦸‍♀️",
  "🥷",
  "🧚",
  "🧜",
  "🧛",
  "🧟",
  "🤖",
  "👽",
  "👾",
  "👻",
  "💀",
  "💩",
  "🤡",
  "🤠",
  "👑",
  "💍",
  "💎",
  "🧠",
  "🦷",
  "🦴",
  "👀",
  "👁️",
  // Sports & Hobbies
  "⚽",
  "🏀",
  "🏈",
  "⚾",
  "🥎",
  "🎾",
  "🏐",
  "🏉",
  "🥏",
  "🎱",
  "🪀",
  "🏓",
  "🏸",
  "🏒",
  "🏑",
  "🥍",
  "🏏",
  "🥅",
  "⛳",
  "🪁",
  "🏹",
  "🎣",
  "🤿",
  "🥊",
  "🥋",
  "🎽",
  "🛹",
  "🛷",
  "⛸️",
  "🥌",
  "🎿",
  "⛷️",
  "🏂",
  "🎮",
  "🕹️",
  "🎲",
  "🎸",
  "🎹",
  "🎺",
  "🎻",
  "🥁",
  "🎤",
  "🎧",
  "🎨",
  "🎬",
  // Food
  "🍏",
  "🍎",
  "🍐",
  "🍊",
  "🍋",
  "🍌",
  "🍉",
  "🍇",
  "🍓",
  "🍈",
  "🍒",
  "🍑",
  "🥭",
  "🍍",
  "🥥",
  "🥝",
  "🍅",
  "🍆",
  "🥑",
  "🥦",
  "🥬",
  "🥒",
  "🌶️",
  "🌽",
  "🥕",
  "🥔",
  "🍠",
  "🥐",
  "🥯",
  "🍞",
  "🥖",
  "🥨",
  "🧀",
  "🥚",
  "🍳",
  "🥞",
  "🥓",
  "🥩",
  "🍗",
  "🍖",
  "🌭",
  "🍔",
  "🍟",
  "🍕",
  "🥪",
  "🥙",
  "🌮",
  "🌯",
  "🥗",
  "🥘",
  "🥫",
  "🍝",
  "🍜",
  "🍲",
  "🍛",
  "🍣",
  "🍱",
  "🥟",
  "🍤",
  "🍙",
  "🍚",
  "🍘",
  "🍥",
  "🥮",
  "🍡",
  "🥟",
  "🥠",
  "🥡",
  "🍦",
  "🍧",
  "🍨",
  "🍩",
  "🍪",
  "🎂",
  "🍰",
  "🧁",
  "🥧",
  "🍫",
  "🍬",
  "🍭",
  "🍮",
  "🍯",
  "🥤",
  "🧃",
  // Vehicles
  "🚗",
  "🚕",
  "🚙",
  "🚌",
  "🚎",
  "🏎️",
  "🚓",
  "🚑",
  "🚒",
  "🚐",
  "🚚",
  "🚛",
  "🚜",
  "🛴",
  "🚲",
  "🛵",
  "🏍️",
  "🚨",
  "🚔",
  "🚍",
  "🚘",
  "🚖",
  "🚡",
  "🚠",
  "🚟",
  "🚃",
  "🚋",
  "🚞",
  "🚝",
  "🚄",
  "🚅",
  "🚈",
  "🚂",
  "🚆",
  "🚇",
  "🚊",
  "🚉",
  "🚁",
  "🛩️",
  "✈️",
  "🛫",
  "🛬",
  "🚀",
  "🛸",
  "🛰️",
];

const THEME_COLORS = [
  {
    name: "Indigo",
    bg: "bg-indigo-600",
    light: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
  },
  {
    name: "Pink",
    bg: "bg-pink-500",
    light: "bg-pink-50",
    border: "border-pink-200",
    text: "text-pink-700",
  },
  {
    name: "Blue",
    bg: "bg-blue-500",
    light: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  {
    name: "Green",
    bg: "bg-green-500",
    light: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
  },
  {
    name: "Purple",
    bg: "bg-purple-600",
    light: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
  },
  {
    name: "Orange",
    bg: "bg-orange-500",
    light: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
  },
  {
    name: "Red",
    bg: "bg-red-500",
    light: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
  },
  {
    name: "Teal",
    bg: "bg-teal-500",
    light: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-700",
  },
  {
    name: "Yellow",
    bg: "bg-yellow-400",
    light: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-800",
  },
  {
    name: "Cyan",
    bg: "bg-cyan-500",
    light: "bg-cyan-50",
    border: "border-cyan-200",
    text: "text-cyan-700",
  },
  {
    name: "Lime",
    bg: "bg-lime-500",
    light: "bg-lime-50",
    border: "border-lime-200",
    text: "text-lime-700",
  },
  {
    name: "Fuchsia",
    bg: "bg-fuchsia-500",
    light: "bg-fuchsia-50",
    border: "border-fuchsia-200",
    text: "text-fuchsia-700",
  },
  {
    name: "Rose",
    bg: "bg-rose-500",
    light: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
  },
  {
    name: "Sky",
    bg: "bg-sky-500",
    light: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-700",
  },
];
// --- UI COMPONENTS ---

const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  size = "md",
  ...props
}) => {
  const baseStyle =
    "rounded-lg font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed";

  const sizes = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200",
    secondary:
      "bg-purple-500 text-white hover:bg-purple-600 shadow-md shadow-purple-200",
    success:
      "bg-green-500 text-white hover:bg-green-600 shadow-md shadow-green-200",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-200",
    warning:
      "bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-200",
    ghost: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    outline: "border-2 border-gray-200 text-gray-600 hover:bg-gray-50",
    gold: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-orange-200 hover:scale-[1.02]",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <h3 className="font-bold text-gray-800">{title}</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded-full text-gray-500"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <div className="p-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

const PinPad = ({
  onSuccess,
  onCancel,
  targetPin,
  title,
  onForgot,
  mode = "verify",
}) => {
  const [input, setInput] = useState("");
  const [confirmInput, setConfirmInput] = useState("");
  const [step, setStep] = useState(mode === "setup" ? "create" : "verify");
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState(
    mode === "setup" ? "Create a 4-digit PIN" : title || "Enter PIN"
  );

  const handleNum = (num) => {
    if (input.length < 4) {
      const newInput = input + num;
      setInput(newInput);

      if (newInput.length === 4) {
        if (step === "verify") {
          if (newInput === targetPin) {
            onSuccess(newInput);
          } else {
            triggerError();
          }
        } else if (step === "create") {
          setConfirmInput(newInput);
          setInput("");
          setStep("confirm");
          setMsg("Confirm your PIN");
        } else if (step === "confirm") {
          if (newInput === confirmInput) {
            onSuccess(newInput); // Pass back the new PIN
          } else {
            triggerError("PINs didn't match. Try again.");
            setStep("create");
            setMsg("Create a 4-digit PIN");
            setConfirmInput("");
          }
        }
      }
    }
  };

  const triggerError = (message = "Incorrect PIN") => {
    setError(true);
    const oldMsg = msg;
    setMsg(message);
    setTimeout(() => {
      setInput("");
      setError(false);
      if (step === "verify") setMsg(title || "Enter PIN");
      else if (step === "create") setMsg("Create a 4-digit PIN");
      else setMsg(oldMsg);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
        <h3
          className={`text-xl font-bold text-center mb-6 ${
            error ? "text-red-500" : "text-gray-800"
          }`}
        >
          {msg}
        </h3>
        <div className="flex justify-center gap-4 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 ${
                input.length > i
                  ? error
                    ? "bg-red-500 border-red-500"
                    : "bg-blue-600 border-blue-600"
                  : "border-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNum(num)}
              className="h-16 rounded-xl bg-gray-50 text-2xl font-bold text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleNum(0)}
            className="h-16 rounded-xl bg-gray-50 text-2xl font-bold text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            0
          </button>
          <button
            onClick={() => setInput((prev) => prev.slice(0, -1))}
            className="h-16 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:bg-gray-200"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="ghost" className="w-full" onClick={onCancel}>
            Cancel
          </Button>
          {mode === "verify" && (
            <button
              onClick={onForgot}
              className="text-xs text-blue-500 hover:text-blue-700 hover:underline flex items-center justify-center gap-1"
            >
              <KeyRound size={12} /> Forgot PIN?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// SETUP WIZARD
const SetupWizard = ({
  onComplete,
  onClose, // <--- NEW PROP
  mode = "create",
  inviteFamilyName = "",
}) => {
  const [step, setStep] = useState("parent"); // parent | kids | invite | nextSteps
  const [parentName, setParentName] = useState("");
  const [parentPin, setParentPin] = useState("");
  const [kidsList, setKidsList] = useState([]);
  const [kidName, setKidName] = useState("");
  const [kidPin, setKidPin] = useState("");
  const [familyName, setFamilyName] = useState("");

  const myNewFamilyId = getAuth().currentUser?.uid;
  const inviteLink = `${window.location.origin}${window.location.pathname}?join=${myNewFamilyId}`;
  
  // The "Login Only" link for the QR Code
  const kidLoginLink = `${window.location.origin}${window.location.pathname}?kid_login=true`;

  const handleAddKid = () => {
    if (kidName && kidPin.length === 4) {
      setKidsList([...kidsList, { name: kidName, pin: kidPin, allowance: 10 }]);
      setKidName("");
      setKidPin("");
    }
  };

  // Helper to gather all form data (avoids code duplication)
  const getFinalData = () => {
    let finalKids = [...kidsList];
    // If the user typed a kid name but didn't click "Add", include it anyway
    if (kidName && kidPin.length === 4) {
      finalKids.push({ name: kidName, pin: kidPin, allowance: 10 });
    }
    return { familyName, parentName, parentPin, kids: finalKids };
  };

  const handleNext = () => {
    if (mode === "create") setStep("invite");
    else handleFinalFinish(); // If joining, we just finish immediately
  };

  // NEW: Save data to DB, then show QR code
  const handleInviteNext = async () => {
    const data = getFinalData();
    // Pass 'true' as second arg to tell App.jsx to KEEP modal open
    await onComplete(data, true); 
    setStep("nextSteps");
  };

  // Used for Join mode or early exit
  const handleFinalFinish = () => {
    const data = getFinalData();
    // Pass 'false' (or undefined) to close modal immediately
    onComplete(data, false); 
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Link copied!");
  };

  return (
    <Modal
      isOpen={true}
      onClose={null}
      title={
        mode === "create"
          ? "Family Setup"
          : `Join ${inviteFamilyName || "Family"}`
      }
    >
      <div className="space-y-4">
        {step === "parent" && (
          <div className="space-y-4 animate-in fade-in">
            <p className="text-gray-600 text-sm">
              {mode === "create"
                ? "First, create the main parent profile."
                : "Set up your guardian profile to join."}
            </p>
            {mode === "create" && (
              <div>
                <label className="block text-xs font-bold text-gray-500">
                  Family Name
                </label>
                <input
                  className="w-full border p-2 rounded"
                  placeholder="The Potter Family"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-500">
                Display Name
              </label>
              <input
                className="w-full border p-2 rounded"
                placeholder="e.g. Mom"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500">
                Create PIN
              </label>
              <input
                className="w-full border p-2 rounded"
                placeholder="1234"
                maxLength="4"
                value={parentPin}
                onChange={(e) => setParentPin(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              onClick={() => {
                if (parentName && parentPin.length === 4) {
                  if (mode === "create") setStep("kids");
                  else handleFinalFinish();
                } else {
                  alert("Display Name and 4-digit PIN required.");
                }
              }}
            >
              {mode === "create" ? "Next: Add Kids" : "Join Family"}
            </Button>
          </div>
        )}

        {step === "kids" && (
          <div className="space-y-4 animate-in fade-in">
            <p className="text-gray-600 text-sm">
              Now, add profiles for your kids.
            </p>
            <div className="space-y-2">
              {kidsList.map((k, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-indigo-50 p-2 rounded text-sm text-indigo-800 font-bold"
                >
                  <span>{k.name}</span>
                  <span>PIN: {k.pin}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <input
                  className="w-full border p-2 rounded mb-2"
                  placeholder="Kid Name"
                  value={kidName}
                  onChange={(e) => setKidName(e.target.value)}
                />
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Kid PIN"
                  maxLength="4"
                  value={kidPin}
                  onChange={(e) => setKidPin(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className="h-24 border-dashed"
                onClick={handleAddKid}
              >
                <Plus size={20} /> Add
              </Button>
            </div>
            <div className="pt-4 flex gap-2">
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleNext}
              >
                Next: Invite Parents
              </Button>
            </div>
          </div>
        )}

        {step === "invite" && (
          <div className="space-y-6 animate-in fade-in text-center">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <h4 className="font-bold text-yellow-800 mb-2">
                Invite your Partner
              </h4>
              <p className="text-xs text-gray-600 mb-4">
                Share this link to add another guardian to the family account.
              </p>

              <div className="flex items-center gap-2 bg-white p-2 rounded border border-yellow-200 mb-2">
                <code className="text-xs text-gray-500 flex-1 truncate">
                  {inviteLink}
                </code>
                <button onClick={copyLink}>
                  <Copy size={16} className="text-blue-500" />
                </button>
              </div>
              <p className="text-[10px] text-gray-400">
                Family ID: {myNewFamilyId}
              </p>
            </div>
            {/* SAVES DATA HERE SO DB IS READY FOR NEXT STEP */}
            <Button className="w-full" onClick={handleInviteNext}>
              Next: Connect Kids' Devices
            </Button>
          </div>
        )}

        {/* NEW STEP: QR CODE & INSTRUCTIONS */}
        {step === "nextSteps" && (
          <div className="space-y-6 animate-in fade-in text-center">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-2">Scan with Kids' Devices</h3>
              
              <div className="bg-white p-4 rounded-xl shadow-sm inline-block mb-3 border border-blue-100">
                <QRCode value={kidLoginLink} size={160} />
              </div>
              
              <p className="text-xs text-blue-800 font-medium mb-1">
                Scan to open the Login Page on their device.
              </p>
              <p className="text-[10px] text-blue-600">
                (You will need to log them in with the family email/password once)
              </p>
            </div>

            <div className="text-left bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex items-start gap-2">
                <LockIcon size={14} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-700">iPad Locked Down?</p>
                  <p className="text-[10px] text-gray-500 leading-tight mt-1">
                    If your child has Screen Time limits, go to <strong>Settings &gt; Screen Time &gt; Content Restrictions</strong> and add this website to the allowed list so they can access it!
                  </p>
                </div>
              </div>
            </div>

            {/* JUST CLOSES THE MODAL NOW */}
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={onClose}>
              Done! Go to Dashboard
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

const DeviceSetupWizard = ({
  kids,
  users = [],
  onComplete,
  installEvent,
  isIOS,
  isStandalone,
  isMobile,
}) => {
  // If not installed, start at 'install-step', otherwise go straight to 'select-mode'
  const [step, setStep] = useState(
    !isStandalone ? "install-step" : "select-mode"
  );

  const handleInstallClick = () => {
    if (installEvent) {
      installEvent.prompt();
      installEvent.userChoice.then((choiceResult) => {
        // Whether they accepted or dismissed, move to next step
        setStep("select-mode");
      });
    }
  };

  const handleModeSelect = (mode) => {
    if (mode === "KID_SOLO") {
      setStep("select-kid");
    } else if (mode === "PARENT_SOLO") {
      setStep("select-parent");
    } else {
      onComplete({ mode, targetId: null });
    }
  };

  return (
    <Modal isOpen={true} onClose={null} title="Setup This Device">
      <div className="space-y-4">
{/* STEP 1: INSTALLATION */}
{step === "install-step" && (
  <div className="text-center space-y-6 animate-in fade-in">
    <div className="bg-indigo-50 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto text-indigo-600 mb-4">
      <Download size={40} />
    </div>
    <div>
      {/* SMART TITLE: Changes based on device */}
      <h3 className="font-bold text-lg text-gray-800">
        {isMobile ? "Install App?" : "Install to Desktop?"}
      </h3>
      <p className="text-sm text-gray-500 mt-2">
        {isMobile 
          ? "Add ChorePiggy to your home screen for the best experience!" 
          : "Install the ChorePiggy app to your computer for quick access!"}
      </p>
    </div>

    {isIOS ? (
      /* ... Keep iOS Instructions ... */
      <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 text-left space-y-2 border border-gray-200">
         {/* ... (Existing iOS code) ... */}
      </div>
    ) : (
       installEvent && (
        <Button 
          onClick={handleInstallClick} 
          className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
        >
          {isMobile ? "Install Now" : "Install App"}
        </Button>
       )
    )}

    <Button 
      variant="ghost" 
      onClick={() => setStep("select-mode")} 
      className="w-full text-gray-400 font-normal"
    >
      Skip / Already Installed
    </Button>
  </div>
)}

        {/* STEP 2: SELECT MODE */}
        {step === "select-mode" && (
          <div className="animate-in slide-in-from-right-4">
            <p className="text-gray-600 text-sm text-center mb-4">
              Who will be using this specific device?
            </p>
            <div className="grid gap-3">
              <button
                onClick={() => handleModeSelect("FAMILY")}
                className="p-4 border-2 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 text-left flex items-center gap-3 transition-colors group"
              >
                <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 group-hover:bg-indigo-200">
                  <Users size={24} />
                </div>
                <div>
                  <span className="font-bold block text-gray-800">
                    Whole Family
                  </span>
                  <span className="text-xs text-gray-500">
                    Parents & Kids. Requires PINs to switch.
                  </span>
                </div>
              </button>
              <button
                onClick={() => handleModeSelect("PARENT_SOLO")}
                className="p-4 border-2 rounded-xl hover:bg-blue-50 hover:border-blue-200 text-left flex items-center gap-3 transition-colors group"
              >
                <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-200">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <span className="font-bold block text-gray-800">Only Me</span>
                  <span className="text-xs text-gray-500">
                    Parent personal device. Auto-logins to dashboard.
                  </span>
                </div>
              </button>
              <button
                onClick={() => handleModeSelect("KID_SOLO")}
                className="p-4 border-2 rounded-xl hover:bg-green-50 hover:border-green-200 text-left flex items-center gap-3 transition-colors group"
              >
                <div className="bg-green-100 p-3 rounded-full text-green-600 group-hover:bg-green-200">
                  <User size={24} />
                </div>
                <div>
                  <span className="font-bold block text-gray-800">
                    Specific Kid
                  </span>
                  <span className="text-xs text-gray-500">
                    Kid personal device. Auto-logins.
                  </span>
                </div>
              </button>
            </div>
            {/* Back button to install step if they skipped it by accident */}
            {!isStandalone && (
              <Button
                variant="ghost"
                onClick={() => setStep("install-step")}
                className="w-full mt-2 text-xs"
              >
                Back to Install
              </Button>
            )}
          </div>
        )}

        {/* STEP 3: SELECT PERSON */}
        {(step === "select-kid" || step === "select-parent") && (
          <div className="space-y-2 animate-in fade-in slide-in-from-right-4">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">
              Select Profile:
            </p>
            {(step === "select-kid"
              ? kids
              : users.filter((u) => u.role === "parent")
            ).map((p) => (
              <button
                key={p.id}
                onClick={() =>
                  onComplete({
                    mode: step === "select-kid" ? "KID_SOLO" : "PARENT_SOLO",
                    targetId: p.id,
                  })
                }
                className="w-full p-3 bg-white border rounded-xl flex items-center gap-3 hover:bg-gray-50 shadow-sm"
              >
                <span className="text-2xl">
                  {p.avatar || (step === "select-kid" ? "🙂" : "🛡️")}
                </span>
                <span className="font-bold text-gray-700">{p.name}</span>
                <ChevronRight className="ml-auto text-gray-300" />
              </button>
            ))}
            <Button
              variant="ghost"
              onClick={() => setStep("select-mode")}
              className="w-full mt-2"
            >
              Back
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

const AuthScreen = ({ inviteInfo }) => {
  // 1. Detect "Kid Mode" from URL
  const params = new URLSearchParams(window.location.search);
  const isKidLoginMode = params.get("kid_login") === "true";

  // 2. Force Login state if in Kid Mode
  const [isLogin, setIsLogin] = useState(true); 
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-600 flex items-center justify-center gap-3 mb-2">
            <PiggyBank size={40} /> ChorePiggy
          </h1>
          
          {/* DYNAMIC HEADER MESSAGES */}
          {inviteInfo ? (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-yellow-800 text-sm font-semibold">
              You've been invited to join the <br />
              <span className="text-lg font-bold">{inviteInfo.name}</span>{" "}
              family!
            </div>
          ) : isKidLoginMode ? (
             <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-blue-800 text-sm font-semibold">
               <p>👋 Kid Device Setup</p>
               <p className="font-normal text-xs mt-1">Parent: Log in with the <strong>Family Account</strong>.</p>
             </div>
          ) : (
            <p className="text-gray-500">The smart family allowance tracker.</p>
          )}
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              {inviteInfo ? "Your Email" : "Family Email"}
            </label>
            <input
              type="email"
              required
              className="w-full border p-3 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={inviteInfo ? "you@example.com" : "family@example.com"}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-bold text-gray-700">
                Password
              </label>
              {isLogin && (
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="text-xs text-blue-500 hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <input
              type="password"
              required
              className="w-full border p-3 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {error}
            </p>
          )}
          {message && (
            <p className="text-green-600 text-sm bg-green-50 p-2 rounded">
              {message}
            </p>
          )}

          {!isLogin && (
            <div className="text-[11px] text-gray-500 bg-gray-50 p-3 rounded border border-gray-100 my-2 leading-relaxed">
              <p className="font-bold mb-2 text-gray-700">Terms & Conditions of Use:</p>
              <ul className="list-disc pl-4 space-y-1.5">
                <li>
                  <strong>Not a Financial Institution:</strong> This application is a tracking tool for virtual allowance only. It does not hold, transfer, or manage real currency.
                </li>
                <li>
                  <strong>No Warranty ("As Is"):</strong> This software is provided "as is," without warranty of any kind. The developers are not liable for any data loss, service interruptions, or errors.
                </li>
                <li>
                  <strong>Data Privacy:</strong> We respect your privacy. We do not sell, trade, or transfer your personal data to outside parties. Data is stored securely via Google Firebase.
                </li>
                <li>
                  <strong>User Responsibility:</strong> You acknowledge that you are the guardian responsible for managing family data and consents.
                </li>
              </ul>
            </div>
          )}

          <Button type="submit" className="w-full py-3 text-lg">
            {isLogin
              ? inviteInfo
                ? "Log In to Join"
                : "Log In"
              : inviteInfo
              ? "Create Your Account"
              : "Create Family Account"}
          </Button>
        </form>

        {!isKidLoginMode && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setMessage("");
              }}
              className="text-blue-600 hover:underline text-sm"
            >
              {isLogin
                ? inviteInfo 
                  ? "Need an account? Sign Up" 
                  : "Need a family account? Sign Up"
                : "Already have an account? Log In"}
            </button>
          </div>
        )}
        
        {isKidLoginMode && (
           <div className="mt-6 text-center">
             <a href="/" className="text-xs text-gray-400 hover:text-gray-600">
               Not a kid device? Go to standard login.
             </a>
           </div>
        )}
      </div>
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [kids, setKids] = useState([]);
  const [chores, setChores] = useState([]);
  const [taskLog, setTaskLog] = useState([]);
  const [bonuses, setBonuses] = useState([]);
  const [history, setHistory] = useState([]);
  const [invitesEnabled, setInvitesEnabled] = useState(true); // Default true

  const [view, setView] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [showPinPad, setShowPinPad] = useState(false);
  const [pinTarget, setPinTarget] = useState(null);
  const [isPinSetup, setIsPinSetup] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsUser, setSettingsUser] = useState(null);
  const [showInitModal, setShowInitModal] = useState(false);
  const [wizardMode, setWizardMode] = useState("create");
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [showJoinFamily, setShowJoinFamily] = useState(false);
  const [joinFamilyId, setJoinFamilyId] = useState("");
  const [currentFamilyId, setCurrentFamilyId] = useState(null);
  const [knownFamilyIds, setKnownFamilyIds] = useState([]);
  const [pendingInviteId, setPendingInviteId] = useState(null);
  const [inviteInfo, setInviteInfo] = useState(null);
  // ... existing state variables ...
  const [familyNames, setFamilyNames] = useState({});
const [showSettingsQr, setShowSettingsQr] = useState(false);
  // --- NEW: INSTALLATION STATE ---
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    // Check if already installed
    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;
    setIsStandalone(isStandaloneMode);

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const mobileCheck = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    setIsMobile(mobileCheck);

    // Listen for Android/Desktop install event
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPromptEvent(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const [deviceConfig, setDeviceConfig] = useState(() => {
    try {
      const saved = localStorage.getItem("chorePiggy_deviceConfig");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteCode = params.get("join");
    if (inviteCode) {
      setPendingInviteId(inviteCode);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Fetch family name info (publicly readable doc)
      getDoc(doc(db, "families", inviteCode)).then((snap) => {
        if (snap.exists())
          setInviteInfo({
            id: inviteCode,
            name: snap.data().familyName || "Unknown",
          });
      });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      if (user) {
        const stored = JSON.parse(
          localStorage.getItem("chorePiggy_knownFamilies") || "[]"
        );
        // Always ensure the user's OWN id is the default if nothing else exists
        const uniqueFamilies = [...new Set([user.uid, ...stored])];
        setKnownFamilyIds(uniqueFamilies);

        // Only set family ID if we aren't processing an invite AND it's not already set
        if (!pendingInviteId && !currentFamilyId) {
          setCurrentFamilyId(uniqueFamilies[0]);
        }
      } else {
        // LOGOUT DETECTED: Wipe state
        setKnownFamilyIds([]);
        setCurrentFamilyId(null);
        setUsers([]);
        setKids([]);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [pendingInviteId]); // Added dep to ensure invite logic doesn't fight auth logic

  // HANDLE PENDING INVITE (With "Already Member" Check)
  useEffect(() => {
    const processInvite = async () => {
      if (authUser && pendingInviteId) {
        // 1. Check if we already know this family locally
        if (knownFamilyIds.includes(pendingInviteId)) {
          setCurrentFamilyId(pendingInviteId);
          // Clean up URL
          setPendingInviteId(null);
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          return;
        }

        // 2. SERVER CHECK: Are we already in the database for this family?
        // (This fixes the issue where logging out makes the app forget you belong to the family)
        try {
          const memberRef = doc(
            db,
            "families",
            pendingInviteId,
            "users",
            authUser.uid
          );
          const memberSnap = await getDoc(memberRef);

          if (memberSnap.exists()) {
            // RECOVERY: User is already a member. Restore local data and log in.
            const newKnown = [...new Set([...knownFamilyIds, pendingInviteId])];
            setKnownFamilyIds(newKnown);
            localStorage.setItem(
              "chorePiggy_knownFamilies",
              JSON.stringify(newKnown)
            );
            setCurrentFamilyId(pendingInviteId);
            alert("Welcome back! You are already connected to this family.");
          } else {
            // REAL JOIN: User is not in database. Show Join Wizard.
            setJoinFamilyId(pendingInviteId);
            setWizardMode("join");
            setShowInitModal(true);
          }
        } catch (e) {
          console.error("Membership check error", e);
          // Fallback: If we can't check (e.g. network), assume we need to join
          setJoinFamilyId(pendingInviteId);
          setWizardMode("join");
          setShowInitModal(true);
        }

        // Final Cleanup
        setPendingInviteId(null);
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      } else if (authUser && !currentFamilyId && knownFamilyIds.length > 0) {
        // Default behavior: Load first known family
        setCurrentFamilyId(knownFamilyIds[0]);
      }
    };

    processInvite();
  }, [authUser, pendingInviteId, knownFamilyIds]);

  useEffect(() => {
    if (
      !loading &&
      authUser &&
      (kids.length > 0 || users.length > 0) && // Check if ANY data exists
      view === "login" &&
      !currentUser
    ) {
      // 1. KID SOLO
      if (deviceConfig?.mode === "KID_SOLO" && deviceConfig?.targetId) {
        const kid = kids.find((k) => k.id === deviceConfig.targetId);
        if (kid) {
          setCurrentUser(kid);
          setView("kid");
          return;
        }
      }

      // 2. PARENT SOLO (New)
      if (deviceConfig?.mode === "PARENT_SOLO" && deviceConfig?.targetId) {
        const parent = users.find((u) => u.id === deviceConfig.targetId);
        if (parent) {
          setCurrentUser(parent);
          setView("parent");
          return;
        }
      }

      // 3. SAVED USER IN FAMILY MODE (Optional convenience)
      const savedUserId = localStorage.getItem("chorePiggy_activeUser");
      if (savedUserId && deviceConfig?.mode === "FAMILY") {
        const kid = kids.find((k) => k.id === savedUserId);
        if (kid) {
          setCurrentUser(kid);
          setView("kid");
        }
      }
    }
  }, [loading, authUser, kids, users, view, currentUser, deviceConfig]);

  useEffect(() => {
    if (!authUser || !currentFamilyId) return;

    // 1. Reset loading state when family changes

    // 1. Fetch Family Name
    getDoc(doc(db, "families", currentFamilyId)).then((snap) => {
      if (snap.exists())
        setFamilyNames((prev) => ({
          ...prev,
          [currentFamilyId]: snap.data().familyName || "My Family",
        }));
    });

    const getSub = (name) => collection(db, "families", currentFamilyId, name);

    // 2. Define Standard Collections
    const COLLECTIONS = {
      users: getSub("users"),
      kids: getSub("kids"),
      chores: getSub("chores"),
      bonuses: getSub("bonuses"),
    };

    // 3. Define Config Listener
    getDoc(doc(db, "families", currentFamilyId, "settings", "config")).then(
      (snap) => {
        if (snap.exists()) setInvitesEnabled(snap.data().invitesEnabled);
        else setInvitesEnabled(true);
      }
    );

    // 4. Listen to Standard Collections
const unsubscribers = Object.entries(COLLECTIONS).map(([key, ref]) => {
  return onSnapshot(
    ref,
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (key === "users") {
        setUsers(data);
        setDataLoaded(true); // Success! Stop loading.

        // ... (Keep existing security check logic here) ...
        if (data.length > 0 && !data.find((u) => u.id === authUser.uid)) {
           // ... (Keep existing kick-out logic) ...
        }
      }
      if (key === "kids") setKids(data);
      if (key === "chores") setChores(data);
      if (key === "bonuses") setBonuses(data);
    },
    (error) => {
      console.log(`Error fetching ${key}:`, error);
      // FIX: If the listener fails (e.g. permission denied on new account),
      // we must still stop the loading screen so the user can see the "Create Family" button.
      if (key === "users") {
        setDataLoaded(true);
      }
    }
  );
});

    // ... (Keep the rest of the existing taskLog/history listeners logic below exactly as it was) ...
    // Note: If you copy-pasted this whole block, make sure you keep the taskLogQuery and historyQuery parts below this.

    // ... (Existing taskLog logic) ...
    const taskLogQuery = query(
      getSub("task_log"),
      orderBy("timestamp", "desc"),
      limit(150)
    );
    const taskLogUnsub = onSnapshot(taskLogQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTaskLog(data);
    });

    // ... (Existing history logic) ...
    const historyQuery = query(
      getSub("history"),
      orderBy("date", "desc"),
      limit(100)
    );
    const historyUnsub = onSnapshot(historyQuery, (snapshot) => {
      setHistory(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribers.forEach((unsub) => unsub());
      taskLogUnsub();
      historyUnsub();
    };
  }, [authUser, currentFamilyId]);

  const data = { users, kids, chores, taskLog, bonuses, history };

  const getFamilyDoc = (colName, docId) =>
    doc(db, "families", currentFamilyId, colName, docId || generateId());
  const getFamilyCol = (colName) =>
    collection(db, "families", currentFamilyId, colName);

  const handleLoginAttempt = (user) => {
    setPinTarget(user);
    if (!user.pin) {
      setIsPinSetup(true);
      setShowPinPad(true);
    } else {
      setIsPinSetup(false);
      setShowPinPad(true);
    }
  };

  const handlePinSuccess = (pinOrNewPin) => {
    if (isPinSetup) {
      const collectionName = pinTarget.role === "kid" ? "kids" : "users";
      updateDoc(getFamilyDoc(collectionName, pinTarget.id), {
        pin: pinOrNewPin,
      });
      setIsPinSetup(false);
    }
    setCurrentUser(pinTarget);
    setView(pinTarget.role === "parent" ? "parent" : "kid");
    setShowPinPad(false);
    setPinTarget(null);
    if (pinTarget.role === "kid")
      localStorage.setItem("chorePiggy_activeUser", pinTarget.id);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView("login");
    localStorage.removeItem("chorePiggy_activeUser");
  };
  const handleFullSignOut = () => {
    signOut(auth);
    setCurrentUser(null);
    setView("login");

    // CLEAR EVERYTHING
    localStorage.removeItem("chorePiggy_activeUser");
    localStorage.removeItem("chorePiggy_deviceConfig");
    localStorage.removeItem("chorePiggy_knownFamilies"); // <--- This was missing

    // Reset State immediately
    setDeviceConfig(null);
    setKnownFamilyIds([]);
    setCurrentFamilyId(null);
    setUsers([]);
    setKids([]);
  };
  const handleForgotPinRequest = () => {
    setShowPinPad(false);
    setShowPasswordRecovery(true);
  };

  const handlePasswordRecoverySubmit = async () => {
    if (!recoveryPassword) return;
    try {
      const credential = EmailAuthProvider.credential(
        authUser.email,
        recoveryPassword
      );
      await signInWithCredential(auth, credential);
      await updateDoc(getFamilyDoc("users", pinTarget.id), { pin: "1234" });
      alert("Success! Your PIN has been reset to: 1234");
      setRecoveryPassword("");
      setShowPasswordRecovery(false);
    } catch (e) {
      alert("Incorrect password.");
    }
  };

const handleWizardComplete = async (setupData, stayOpen = false) => {
    try {
      const targetFamilyId =
        wizardMode === "create" ? authUser.uid : joinFamilyId;

      if (!targetFamilyId) throw new Error("Invalid Family ID");

      // --- RESTORED DATABASE WRITE LOGIC ---
      
      // 1. If Creating: Initialize Family Root & Settings
      if (wizardMode === "create") {
        // Create Family Doc
        await setDoc(doc(db, "families", targetFamilyId), {
          familyName: setupData.familyName || "My Family",
          createdAt: new Date().toISOString(),
          ownerId: authUser.uid,
        });

        // Create Settings Config (Critical for Rules)
        await setDoc(doc(db, "families", targetFamilyId, "settings", "config"), {
          invitesEnabled: true,
        });
      }

      // 2. Create Parent Profile (Me)
      await setDoc(doc(db, "families", targetFamilyId, "users", authUser.uid), {
        name: setupData.parentName,
        pin: setupData.parentPin,
        role: "parent",
        email: authUser.email,
        joinedAt: new Date().toISOString(),
      });

      // 3. Create Kid Profiles
      if (setupData.kids && setupData.kids.length > 0) {
        const kidsCol = collection(db, "families", targetFamilyId, "kids");
        for (const kid of setupData.kids) {
          await addDoc(kidsCol, {
            name: kid.name,
            pin: kid.pin,
            role: "kid",
            balance: 0,
            savingsGoal: 0,
            goalName: "",
            avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
            allowanceAmount: Number(kid.allowance || 10),
            createdAt: new Date().toISOString(),
          });
        }
      }

      // --- END DATABASE LOGIC ---

      // Update Known Families in Local Storage
      const newKnown = [...new Set([...knownFamilyIds, targetFamilyId])];
      setKnownFamilyIds(newKnown);
      localStorage.setItem(
        "chorePiggy_knownFamilies",
        JSON.stringify(newKnown)
      );

      // Force state refresh
      setCurrentFamilyId(null);
      setTimeout(() => setCurrentFamilyId(targetFamilyId), 100);

      // Only close if we aren't waiting for the QR step
      if (!stayOpen) {
        setShowInitModal(false);
      }
    } catch (e) {
      console.error(e);
      alert(`Error creating family: ${e.message}`);
    }
  };

  const handleJoinStart = () => {
    if (!joinFamilyId) return;
    setShowJoinFamily(false);
    setWizardMode("join");
    setShowInitModal(true);
  };

  const toggleInvites = async () => {
    const newStatus = !invitesEnabled;
    setInvitesEnabled(newStatus);
    await setDoc(
      doc(db, "families", currentFamilyId, "settings", "config"),
      { invitesEnabled: newStatus },
      { merge: true }
    );
  };

  const updateDeviceConfig = (newConfig) => {
    setDeviceConfig(newConfig);
    localStorage.setItem("chorePiggy_deviceConfig", JSON.stringify(newConfig));
  };
  const handleParentGate = () => {
    const parent = users.find((u) => u.role === "parent");
    if (!parent) return;
    setPinTarget({ ...parent, isGateUnlock: true });
    setShowPinPad(true);
  };

  const onPinPadSuccess = (pin) => {
    if (pinTarget.isGateUnlock) {
      const matchingParent = users.find(
        (u) => u.role === "parent" && u.pin === pin
      );
      if (matchingParent) {
        setShowPinPad(false);
        setPinTarget(null);
        setSettingsUser(matchingParent); // Remember who unlocked it
        setShowSettingsModal(true); // Open the Global Settings
      } else {
        alert("Incorrect Parent PIN");
      }
    } else {
      handlePinSuccess(pin);
    }
  };

  // CRUD
  const logTransaction = async (
    kidId,
    amount,
    type,
    description,
    actorName,
    newBalance // <--- 1. Add this parameter
  ) => {
    await addDoc(getFamilyCol("history"), {
      kidId,
      amount,
      type,
      description,
      date: new Date().toISOString(),
      by: actorName || "Unknown",
      balance: newBalance, // <--- 2. Save it to the database
    });
  };
  const updateBalance = async (kidId, amount, type, description, actorName) => {
    const safeAmount = Number(amount) || 0;
    const kid = kids.find((k) => k.id === kidId);

    if (kid) {
      // Calculate what the new balance WILL be for the log
      // (Handle cases where current balance might be missing or NaN)
      const currentBalance = Number(kid.balance) || 0;
      const newBalance = currentBalance + safeAmount;

      await updateDoc(getFamilyDoc("kids", kidId), {
        balance: increment(safeAmount),
      });

      // Pass the calculated newBalance to the log
      await logTransaction(
        kidId,
        safeAmount,
        type,
        description,
        actorName,
        newBalance
      );
    }
  };
  const addParent = async (name, pin) => {
    await setDoc(getFamilyDoc("users"), { name, pin, role: "parent" });
  };
  const deleteParent = async (id) => {
    await deleteDoc(getFamilyDoc("users", id));
  };
  const updateParentPin = async (parentId, newPin) => {
    await updateDoc(getFamilyDoc("users", parentId), { pin: newPin });
  };
  const updateParentName = async (parentId, newName) => {
    await updateDoc(getFamilyDoc("users", parentId), { name: newName });
  };
  const submitChore = async (chore, kidId, dateString) => {
    const existingLog = taskLog.find(
      (t) =>
        t.type === "chore" &&
        t.taskId === chore.id &&
        t.kidId === kidId &&
        t.dateString === dateString
    );
    if (existingLog) {
      await updateDoc(getFamilyDoc("task_log", existingLog.id), {
        status: "pending",
        timestamp: new Date().toISOString(),
      });
    } else {
      await setDoc(getFamilyDoc("task_log"), {
        type: "chore",
        taskId: chore.id,
        title: chore.title,
        kidId,
        dateString,
        status: "pending",
        timestamp: new Date().toISOString(),
      });
    }
  };
  const parentOverrideTask = async (
    chore,
    kidId,
    dateString,
    action,
    parentName
  ) => {
    const existingLog = taskLog.find(
      (t) =>
        t.type === "chore" &&
        t.taskId === chore.id &&
        t.kidId === kidId &&
        t.dateString === dateString
    );
    let docRef = existingLog
      ? getFamilyDoc("task_log", existingLog.id)
      : getFamilyDoc("task_log");

    const baseData = {
      type: "chore",
      taskId: chore.id,
      title: chore.title,
      kidId,
      dateString,
      timestamp: new Date().toISOString(),
    };

    if (action === "approve") {
      // 1. Calculate Value Safely
      const stats = calculateWeeklyStats(kidId);
      const weight = chore.weight || 1;
      // Ensure valuePerPoint is a valid number, default to 0 if NaN
      const valuePerPoint = Number(stats.valuePerPoint) || 0;
      const value = weight * valuePerPoint;

      await setDoc(
        docRef,
        {
          ...baseData,
          status: "approved",
          approvedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      // 2. Only pay if it wasn't ALREADY approved (prevents double pay)
      if (!existingLog || existingLog.status !== "approved") {
        await updateBalance(
          kidId,
          value, // <--- Passing the safely calculated value
          "chore",
          `${chore.title} (${formatDayDisplay(dateString)})`,
          parentName
        );
      }
    } else if (action === "fail") {
      // ... (rest of fail logic remains same)
      await setDoc(
        docRef,
        { ...baseData, status: "failed", rejectedAt: new Date().toISOString() },
        { merge: true }
      );
    } else if (action === "retry") {
      // ... (rest of retry logic remains same)
      await setDoc(
        docRef,
        {
          ...baseData,
          status: "changes_requested",
          rejectedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  };
  const submitBonus = async (bonus, kidId) => {
    // 1. Create the pending log immediately
    await setDoc(getFamilyDoc("task_log"), {
      type: "bonus",
      taskId: bonus.id,
      title: bonus.title,
      reward: bonus.reward, // Fixed amount
      kidId,
      status: "pending",
      timestamp: new Date().toISOString(),
      isGroupTask: false, // No longer a group task
    });

    // 2. Delete the bonus from the board so no one else can grab it
    await deleteDoc(getFamilyDoc("bonuses", bonus.id));
  };
  const addBonus = async (title, reward) => {
    // Simple: Just title and reward. No workers array, no maxKids.
    setDoc(getFamilyDoc("bonuses"), {
      title,
      reward: Number(reward),
      status: "available",
    });
  };
  const approveTask = async (task, calculatedValue, parentName) => {
    await updateDoc(getFamilyDoc("task_log", task.id), {
      status: "approved",
      approvedAt: new Date().toISOString(),
    });
    const payout = calculatedValue;
    const dateContext = task.dateString
      ? `(${formatDayDisplay(task.dateString)})`
      : "(Bonus)";
    await updateBalance(
      task.kidId,
      payout,
      task.type,
      `${task.title} ${dateContext}`,
      parentName
    );
  };
  const rejectTask = async (task, actionType) => {
    const newStatus = actionType === "retry" ? "changes_requested" : "failed";
    await updateDoc(getFamilyDoc("task_log", task.id), {
      status: newStatus,
      rejectedAt: new Date().toISOString(),
    });
  };
  const addKid = async (name, pin, allowanceAmount) => {
    await setDoc(getFamilyDoc("kids"), {
      name,
      pin,
      role: "kid",
      balance: 0,
      savingsGoal: 0,
      goalName: "",
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      allowanceAmount: Number(allowanceAmount),
    });
  };
  const updateKid = async (kidId, updates) =>
    updateDoc(getFamilyDoc("kids", kidId), updates);
  const addChore = async (chore) => {
    setDoc(getFamilyDoc("chores"), { ...chore, createdAt: getLocalISODate() });
  };
  const updateChore = async (id, updates) =>
    updateDoc(getFamilyDoc("chores", id), updates);
  const deleteChore = async (id) => deleteDoc(getFamilyDoc("chores", id));
  const deleteBonus = async (id) => deleteDoc(getFamilyDoc("bonuses", id));
  const isChoreActive = (chore) => {
    if (!chore.pausedUntil) return true;
    const today = getLocalISODate();
    return chore.pausedUntil <= today;
  };
  const calculateWeeklyStats = (kidId, weekOffset = 0) => {
    const kid = kids.find((k) => k.id === kidId);
    if (!kid)
      return {
        potential: 0,
        earned: 0,
        pending: 0,
        totalTasks: 0,
        valuePerPoint: 0,
      };

    const allowance = kid.allowanceAmount || 0;
    const weekDays = getWeekDays(weekOffset);
    let totalScheduledWeight = 0;

    const activeChores = chores.filter(
      (c) => c.kidId === kidId && isChoreActive(c)
    );

    activeChores.forEach((c) => {
      const weight = c.weight || 1;
      const createdDate = c.createdAt || "1970-01-01";

      if (c.type === "one_off") {
        // ONE-OFF LOGIC:
        // Only count if the date is in this week AND it wasn't created in the future relative to that date
        if (c.date && weekDays.includes(c.date) && createdDate <= c.date) {
          totalScheduledWeight += weight;
        }
      } else {
        // RECURRING LOGIC:
        c.days.forEach((dayIndex) => {
          const targetDateISO = weekDays.find(
            (d) => new Date(d).getDay() === dayIndex
          );
          if (targetDateISO && createdDate <= targetDateISO) {
            totalScheduledWeight += weight;
          }
        });
      }
    });

    const valuePerPoint =
      totalScheduledWeight > 0 ? allowance / totalScheduledWeight : 0;

    // Calculate Earned (Logic remains same, just relies on taskLog)
    const weekLogs = taskLog.filter(
      (t) =>
        t.kidId === kidId &&
        t.type === "chore" &&
        weekDays.includes(t.dateString)
    );
    let earned = 0,
      pending = 0;

    weekLogs.forEach((log) => {
      const choreDef = chores.find((c) => c.id === log.taskId);
      const weight = choreDef?.weight || 1;
      const taskValue = weight * valuePerPoint;
      if (log.status === "approved") earned += taskValue;
      if (log.status === "pending") pending += taskValue;
    });

    return {
      potential: allowance,
      earned,
      pending,
      totalWeight: totalScheduledWeight,
      valuePerPoint,
    };
  };

  if (loading || (authUser && !dataLoaded && knownFamilyIds.length > 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 animate-pulse">
        Loading ChorePiggy...
      </div>
    );
  }

  if (!authUser) {
    return <AuthScreen inviteInfo={inviteInfo} />;
  }

  // Safe copy link wrapper
  const safeCopyLink = () => {
    if (window && window.location && currentFamilyId) {
      const link = `${window.location.origin}${window.location.pathname}?join=${currentFamilyId}`;
      navigator.clipboard.writeText(link);
      alert("Invite link copied!");
    }
  };

  return (
    <>
      {showPinPad && (
        <PinPad
          targetPin={pinTarget?.pin}
          onSuccess={onPinPadSuccess}
          onCancel={() => {
            setShowPinPad(false);
            setPinTarget(null);
            setIsPinSetup(false);
          }}
          title={
            isPinSetup
              ? "Create PIN"
              : pinTarget.isGateUnlock
              ? "Enter Parent PIN"
              : `Enter ${pinTarget?.name}'s PIN`
          }
          onForgot={handleForgotPinRequest}
          mode={isPinSetup ? "setup" : "verify"}
        />
      )}
{showInitModal && (
  <SetupWizard
    onComplete={handleWizardComplete}
    onClose={() => setShowInitModal(false)} // <--- Add this new prop
    mode={wizardMode}
    inviteFamilyName={inviteInfo?.name}
  />
)}
      {authUser && !deviceConfig && users.length > 0 && (
        <DeviceSetupWizard
          kids={kids}
          users={users}
          onComplete={updateDeviceConfig}
          installEvent={installPromptEvent} // Pass the event
          isIOS={isIOS} // Pass iOS status
          isStandalone={isStandalone} // Pass standalone status
          isMobile={isMobile}
        />
      )}
      {showPasswordRecovery && (
        <Modal
          isOpen={true}
          onClose={() => setShowPasswordRecovery(false)}
          title="Reset PIN"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              To reset this PIN, please enter your Family Account Password:
            </p>
            <input
              type="password"
              className="w-full border p-2 rounded"
              value={recoveryPassword}
              onChange={(e) => setRecoveryPassword(e.target.value)}
              placeholder="Password"
            />
            <Button onClick={handlePasswordRecoverySubmit} className="w-full">
              Verify & Reset PIN to 1234
            </Button>
          </div>
        </Modal>
      )}
      {showJoinFamily && (
        <Modal
          isOpen={true}
          onClose={() => setShowJoinFamily(false)}
          title="Join Existing Family"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Enter the Family ID from the other parent.
            </p>
            <input
              className="w-full border p-2 rounded text-center font-mono"
              value={joinFamilyId}
              onChange={(e) => setJoinFamilyId(e.target.value)}
              placeholder="Paste ID here"
            />
            <Button className="w-full" onClick={handleJoinStart}>
              Join Family
            </Button>
          </div>
        </Modal>
      )}

      {/* --- GLOBAL FAMILY SETTINGS MODAL --- */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Family Settings"
      >
        <div className="space-y-6">
          {/* 1. NEW: MY PROFILE SECTION */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 animate-in fade-in slide-in-from-top-2">
            <h4 className="font-bold text-blue-800 text-sm uppercase mb-3">
              My Profile
            </h4>
            <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <span className="font-bold text-gray-800 block">
                    {settingsUser?.name || "Parent"}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-gray-400">
                    Admin Access
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => {
                  setShowSettingsModal(false); // Close settings
                  setPinTarget(settingsUser); // Target the current user
                  setIsPinSetup(true); // Enable "Setup Mode" (allows typing new PIN)
                  setShowPinPad(true); // Open the Pin Pad
                }}
              >
                <KeyRound size={16} /> Update PIN
              </Button>
            </div>
          </div>

          {/* 2. DEVICE MODE SETTINGS */}
          <div className="space-y-2 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
            <h4 className="font-bold text-indigo-800 text-sm uppercase">
              This Device Mode
            </h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={() =>
                  updateDeviceConfig({ mode: "FAMILY", targetId: null })
                }
                className={`p-3 text-left rounded-lg border-2 transition-all flex items-center gap-3 ${
                  deviceConfig?.mode === "FAMILY"
                    ? "border-indigo-600 bg-white ring-2 ring-indigo-100"
                    : "border-gray-100 hover:border-indigo-200 bg-white"
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    deviceConfig?.mode === "FAMILY"
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Monitor size={20} />
                </div>
                <div className="flex-1">
                  <span className="font-bold block text-sm text-gray-800">
                    Family (Default)
                  </span>
                  <span className="text-[10px] text-gray-500">
                    Standard login screen.
                  </span>
                </div>
                {deviceConfig?.mode === "FAMILY" && (
                  <CheckCircle size={18} className="text-indigo-600" />
                )}
              </button>

              <button
                onClick={() =>
                  updateDeviceConfig({
                    mode: "PARENT_SOLO",
                    targetId: settingsUser?.id,
                  })
                }
                className={`p-3 text-left rounded-lg border-2 transition-all flex items-center gap-3 ${
                  deviceConfig?.mode === "PARENT_SOLO"
                    ? "border-blue-600 bg-white ring-2 ring-blue-100"
                    : "border-gray-100 hover:border-blue-200 bg-white"
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    deviceConfig?.mode === "PARENT_SOLO"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <ShieldCheck size={20} />
                </div>
                <div className="flex-1">
                  <span className="font-bold block text-sm text-gray-800">
                    Only Me
                  </span>
                  <span className="text-[10px] text-gray-500">
                    Auto-login as {settingsUser?.name || "Parent"}.
                  </span>
                </div>
                {deviceConfig?.mode === "PARENT_SOLO" && (
                  <CheckCircle size={18} className="text-blue-600" />
                )}
              </button>

              <div className="mt-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                  Kid Solo Mode
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {kids.map((k) => (
                    <button
                      key={k.id}
                      onClick={() =>
                        updateDeviceConfig({ mode: "KID_SOLO", targetId: k.id })
                      }
                      className={`p-2 text-left text-xs rounded border flex items-center gap-2 ${
                        deviceConfig?.mode === "KID_SOLO" &&
                        deviceConfig?.targetId === k.id
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <span className="text-xl">{k.avatar}</span>
                      <span className="font-bold truncate">{k.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. FAMILY ACCESS (INVITES) */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h4 className="font-bold text-gray-700 text-sm uppercase">
              Family Access
            </h4>
            <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg text-sm text-gray-600 space-y-3">
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <LinkIcon size={16} className="text-yellow-600" />
                  <span className="text-xs font-semibold text-yellow-800">
                    Invite Link
                  </span>
                </div>
                <button
                  onClick={safeCopyLink}
                  className="px-3 py-1 bg-white border border-yellow-200 rounded text-xs font-bold text-yellow-700 hover:bg-yellow-100"
                  disabled={invitesEnabled === false}
                >
                  <Copy size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-yellow-200">
                <span className="text-xs font-bold text-yellow-800">
                  Allow Invites
                </span>
                <button
                  onClick={toggleInvites}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    invitesEnabled ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      invitesEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
            {/* List other parents */}
            {/* List other parents */}
            <div className="space-y-2">
              {users
                .filter((u) => u.role === "parent" && u.id !== settingsUser?.id)
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded"
                  >
                    <span className="font-bold text-gray-700">{p.name}</span>

                    {/* NEW CHECK: If this parent ID matches the Family ID, they are the owner */}
                    {p.id === currentFamilyId ? (
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-full border border-blue-200">
                        Owner
                      </span>
                    ) : (
                      <button
                        onClick={() => deleteParent(p.id)}
                        className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
<div className="pt-2 mt-2 border-t border-gray-100">
  <button
    onClick={() => setShowSettingsQr(!showSettingsQr)}
    className="flex items-center justify-between w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-xl text-blue-800 transition-colors group"
  >
    <div className="flex items-center gap-3">
      <div className="bg-white p-1.5 rounded-lg text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
        <QrCode size={18} />
      </div>
      <div className="text-left">
        <span className="text-xs font-bold block">Kid Login QR</span>
        <span className="text-[10px] opacity-70 block font-normal">
          Scan to open login page
        </span>
      </div>
    </div>
    {showSettingsQr ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
  </button>

  {showSettingsQr && (
    <div className="mt-3 bg-white p-4 rounded-xl border border-blue-100 shadow-inner flex flex-col items-center animate-in slide-in-from-top-2">
      <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 mb-2">
        <QRCode
          value={`${window.location.origin}${window.location.pathname}?kid_login=true`}
          size={140}
        />
      </div>
      <p className="text-[10px] text-center text-gray-400 max-w-[200px]">
        Scan with a child's device to instantly open the Kid Login screen.
      </p>
    </div>
  )}
</div>
          {/* 4. FULL LOGOUT */}
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                handleFullSignOut();
                setShowSettingsModal(false);
              }}
              className="w-full p-3 bg-red-50 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100"
            >
              <LogOut size={18} /> Full Sign Out
            </button>
            <p className="text-[10px] text-center text-red-300 mt-2">
              Disconnects device from family account.
            </p>
          </div>

          {/* SAVE BUTTON */}
          <div className="pt-2">
            <Button
              className="w-full"
              onClick={() => {
                setShowSettingsModal(false);

                // --- NEW LOGIC: Immediate View Switch ---
                if (
                  deviceConfig?.mode === "PARENT_SOLO" &&
                  deviceConfig.targetId
                ) {
                  const target = users.find(
                    (u) => u.id === deviceConfig.targetId
                  );
                  if (target) {
                    setCurrentUser(target);
                    setView("parent");
                  }
                } else if (
                  deviceConfig?.mode === "KID_SOLO" &&
                  deviceConfig.targetId
                ) {
                  const target = kids.find(
                    (k) => k.id === deviceConfig.targetId
                  );
                  if (target) {
                    setCurrentUser(target);
                    setView("kid");
                  }
                } else if (deviceConfig?.mode === "FAMILY") {
                  // If switching to Family mode, log out to show the Profile Picker
                  setCurrentUser(null);
                  setView("login");
                }
              }}
            >
              Save & Close
            </Button>
          </div>
        </div>
      </Modal>
      {/* NEW DEVICE ADMIN MENU (Triggered by Parent PIN) */}

      {view === "login" && (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
          {/* --- UPDATED HEADER SECTION --- */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => {
                if (users.length > 0) handleParentGate();
              }}
              className="flex items-center gap-2 text-gray-400 hover:text-blue-500 text-xs font-bold"
            >
              <Settings size={14} /> Device
            </button>
          </div>
          <div className="max-w-md w-full text-center mb-10">
            <h1 className="text-4xl font-extrabold text-blue-600 flex items-center justify-center gap-3 mb-2">
              <PiggyBank size={40} /> ChorePiggy
            </h1>
            <p className="text-gray-500">
              {familyNames[currentFamilyId] || "Weekly Allowance Tracker"}
            </p>
            <p className="text-xs text-gray-400 mt-1">{authUser.email}</p>
          </div>
          <div className="max-w-md w-full grid gap-4">
            {users.length === 0 && kids.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">
                  Welcome! No family data found.
                </p>
                <Button
                  onClick={() => {
                    setWizardMode("create");
                    setShowInitModal(true);
                  }}
                  className="w-full py-3"
                >
                  Create New Family
                </Button>
                <button
                  onClick={() => setShowJoinFamily(true)}
                  className="mt-4 text-sm text-blue-500 hover:underline"
                >
                  Or Join Existing Family
                </button>
              </div>
            ) : (
              <>
                {(deviceConfig?.mode === "FAMILY" ||
                  deviceConfig?.mode === "PARENT_SOLO") && (
                  <>
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">
                      Parents
                    </h2>
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleLoginAttempt(u)}
                        className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <ShieldCheck size={24} />
                          </div>
                          <span className="font-bold text-lg text-gray-700">
                            {u.name}
                          </span>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-blue-500" />
                      </button>
                    ))}
                  </>
                )}
                {(deviceConfig?.mode === "FAMILY" ||
                  deviceConfig?.mode === "KIDS_SHARED" ||
                  deviceConfig?.mode === "KID_SOLO") && (
                  <>
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1 mt-4">
                      Kids
                    </h2>
                    {kids.map((k) => (
                      <button
                        key={k.id}
                        onClick={() => handleLoginAttempt(k)}
                        className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                            {k.avatar}
                          </div>
                          <div className="text-left">
                            <span className="font-bold text-lg text-gray-700 block">
                              {k.name}
                            </span>
                            <span className="text-xs text-gray-400 font-semibold">
                              Kid Account
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-purple-500" />
                      </button>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
          {/* ADDED: Create New Family button always visible at bottom if needed */}
          {!knownFamilyIds.includes(authUser.uid) && users.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setWizardMode("create");
                  setShowInitModal(true);
                }}
                className="text-xs font-bold text-blue-500 flex items-center gap-1 justify-center hover:underline"
              >
                <Plus size={12} /> Create New Family
              </button>
            </div>
          )}
        </div>
      )}

      {view === "parent" && (
        <ParentView
          data={data}
          user={currentUser}
          logout={handleLogout}
          addKid={addKid}
          addChore={addChore}
          updateChore={updateChore}
          deleteChore={deleteChore}
          addBonus={addBonus}
          deleteBonus={deleteBonus}
          updateBalance={updateBalance}
          updateKid={updateKid}
          approveTask={approveTask}
          rejectTask={rejectTask}
          parentOverrideTask={parentOverrideTask}
          calculateWeeklyStats={calculateWeeklyStats}
          updateParentPin={updateParentPin}
          addParent={addParent}
          deleteParent={deleteParent}
          updateParentName={updateParentName}
          deviceConfig={deviceConfig}
          updateDeviceConfig={updateDeviceConfig}
          currentFamilyId={currentFamilyId}
          knownFamilyIds={knownFamilyIds}
          setCurrentFamilyId={setCurrentFamilyId}
          copyInviteLink={safeCopyLink}
          invitesEnabled={invitesEnabled}
          toggleInvites={toggleInvites}
          familyNames={familyNames}
          onOpenSettings={() => {
            setSettingsUser(currentUser);
            setShowSettingsModal(true);
          }}
        />
      )}
      {view === "kid" && (
        <KidView
          user={kids.find((k) => k.id === currentUser.id) || currentUser}
          data={data}
          logout={handleLogout}
          submitChore={submitChore}
          submitBonus={submitBonus}
          // joinBonus removed
          updateKid={updateKid}
          calculateWeeklyStats={calculateWeeklyStats}
          isChoreActive={isChoreActive}
          deviceConfig={deviceConfig}
          handleParentGate={handleParentGate}
        />
      )}
    </>
  );
}

// --- Sub-View Components ---

function ParentView({
  data,
  user,
  logout,
  addKid,
  addChore,
  updateChore,
  deleteChore,
  addBonus,
  deleteBonus,
  updateBalance,
  updateKid,
  approveTask,
  rejectTask,
  parentOverrideTask,
  calculateWeeklyStats,
  updateParentPin,
  addParent,
  deleteParent,
  updateParentName,
  deviceConfig,
  updateDeviceConfig,
  currentFamilyId,
  knownFamilyIds = [],
  setCurrentFamilyId,
  copyInviteLink,
  invitesEnabled,
  toggleInvites,
  familyNames,
  onOpenSettings,
}) {
  // SAFETY CHECK: If user is missing, don't render to prevent crash
  if (!user) return null;

  const [activeTab, setActiveTab] = useState("approvals");
  const [showAddKid, setShowAddKid] = useState(false);
  const [newKidName, setNewKidName] = useState("");
  const [newKidPin, setNewKidPin] = useState("");
  const [newKidAllowance, setNewKidAllowance] = useState("10");
  const [selectedKid, setSelectedKid] = useState(null);
  const [editingKidProfile, setEditingKidProfile] = useState(null);
  const [managingTasksKid, setManagingTasksKid] = useState(null);
  const [rejectingTask, setRejectingTask] = useState(null);
  const [editingChore, setEditingChore] = useState(null);
  const [splitRewardTask, setSplitRewardTask] = useState(null);
  const [splitAmount, setSplitAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionDesc, setTransactionDesc] = useState("");
  const [transactionType, setTransactionType] = useState("add");
  const [managerWeekOffset, setManagerWeekOffset] = useState(0);
  const [choreKidIds, setChoreKidIds] = useState([]);
  const [choreTitle, setChoreTitle] = useState("");
  const [choreWeight, setChoreWeight] = useState("1");
  const [choreStartTime, setChoreStartTime] = useState("");
  const [choreDoByTime, setChoreDoByTime] = useState("");
  const [choreDays, setChoreDays] = useState([1, 2, 3, 4, 5]);
  const [choreType, setChoreType] = useState("recurring"); // 'recurring' | 'one_off'
  const [oneOffDate, setOneOffDate] = useState("");
  const [bonusTitle, setBonusTitle] = useState("");
  const [bonusReward, setBonusReward] = useState("2");
  const [newParentPin, setNewParentPin] = useState("");
  const [newParentName, setNewParentName] = useState("");
  const [newParentPin2, setNewParentPin2] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  // Ensure kids data is available before running effect
  useEffect(() => {
    if (data && data.kids && data.kids.length > 0 && !choreKidIds.length) {
      setChoreKidIds([]);
    }
  }, [data]);

  // Safety check for taskLog
  const pendingTasks =
    data && data.taskLog
      ? data.taskLog.filter((t) => t.status === "pending")
      : [];
  pendingTasks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const pendingCount = pendingTasks.length;

  const handleTransaction = () => {
    if (!transactionAmount || !selectedKid) return;
    const amount = Number(transactionAmount);
    const finalAmount = transactionType === "add" ? amount : -amount;
    const type = transactionType === "add" ? "manual_add" : "manual_subtract";
    const defaultDesc =
      transactionType === "add" ? "Manual Deposit" : "Cash Out / Purchase";
    updateBalance(
      selectedKid.id,
      finalAmount,
      type,
      transactionDesc || defaultDesc,
      user.name
    );
    setSelectedKid(null);
    setTransactionAmount("");
    setTransactionDesc("");
  };
  const approveAll = async () => {
    if (isProcessing) return; // Prevent double clicks
    if (confirm(`Approve all ${pendingCount} tasks?`)) {
      setIsProcessing(true); // Lock
      try {
        for (const task of pendingTasks) {
          let val = 0;
          if (task.type === "chore") {
            // ... (existing calculation logic) ...
            // ... make sure you use the FIXED logic from our previous step here ...
            const stats = calculateWeeklyStats(task.kidId);
            const choreDef = data.chores.find((c) => c.id === task.taskId);
            const weight = choreDef?.weight || 1;
            const valuePerPoint = Number(stats.valuePerPoint) || 0;
            val = weight * valuePerPoint;
          } else if (task.type === "bonus") {
            val = Number(task.reward) || 0;
          }
          await approveTask(task, val, user.name);
        }
      } finally {
        setIsProcessing(false); // Unlock
      }
    }
  };
  const handleBonusApproval = (task) => {
    // 1. Calculate Payout
    let payout = 0;

    if (task.type === "chore") {
      const stats = calculateWeeklyStats(task.kidId);
      const choreDef = data.chores.find((c) => c.id === task.taskId);
      const weight = choreDef?.weight || 1;
      const valuePerPoint = Number(stats.valuePerPoint) || 0;
      payout = weight * valuePerPoint;
    } else {
      // Bonus: Pay the full amount stored on the task
      payout = Number(task.reward) || 0;
    }

    // 2. Approve
    approveTask(task, payout, user.name);
  };
  const handleAddKid = (e) => {
    e.preventDefault();
    if (newKidName && newKidPin) {
      addKid(newKidName, newKidPin, newKidAllowance);
      setShowAddKid(false);
      setNewKidName("");
      setNewKidPin("");
    }
  };
  const handleAddChore = (e) => {
    e.preventDefault();
    if (choreTitle && choreKidIds.length > 0) {
      // Validation for one-off
      if (choreType === "one_off" && !oneOffDate) {
        alert("Please select a date for the one-off chore.");
        return;
      }

      choreKidIds.forEach((kidId) => {
        addChore({
          kidId,
          title: choreTitle,
          // Save Type and Date
          type: choreType,
          date: choreType === "one_off" ? oneOffDate : null,
          // If one-off, save empty days array
          days: choreType === "recurring" ? choreDays : [],
          weight: Number(choreWeight),
          startTime: choreStartTime,
          doByTime: choreDoByTime,
        });
      });

      // Reset
      setChoreTitle("");
      setChoreWeight("1");
      setChoreStartTime("");
      setChoreDoByTime("");
      setChoreKidIds([]);
      setChoreDays([1, 2, 3, 4, 5]);
      setChoreType("recurring"); // Reset to default
      setOneOffDate("");
    }
  };
  const handleUpdateChore = () => {
    if (editingChore) {
      updateChore(editingChore.id, {
        title: editingChore.title,
        days: editingChore.days,
        weight: Number(editingChore.weight),
        startTime: editingChore.startTime,
        doByTime: editingChore.doByTime,
        pausedUntil: editingChore.pausedUntil || null,
      });
      setEditingChore(null);
    }
  };
  const handleAddGuardian = () => {
    if (newParentName && newParentPin2.length === 4) {
      addParent(newParentName, newParentPin2);
      setNewParentName("");
      setNewParentPin2("");
    }
  };
  const toggleDay = (i) =>
    setChoreDays((prev) =>
      prev.includes(i) ? prev.filter((d) => d !== i) : [...prev, i].sort()
    );
  const toggleMultiAssign = (kidId) => {
    setChoreKidIds((prev) =>
      prev.includes(kidId)
        ? prev.filter((id) => id !== kidId)
        : [...prev, kidId]
    );
  };

  // Robust Copy Function
  const executeCopy = () => {
    if (copyInviteLink) {
      copyInviteLink();
    } else {
      // Fallback logic to prevent crash
      const link = `${window.location.origin}${window.location.pathname}?join=${currentFamilyId}`;
      navigator.clipboard.writeText(link);
      alert("Invite link copied!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-xl">
            <ShieldCheck /> {user.name}'s Dashboard
          </div>
          <div className="flex gap-2">
            {/* 1. HELP BUTTON */}
            <button
              onClick={() => setShowHelp(true)}
              className="text-gray-400 hover:text-blue-600 transition-colors p-1"
              title="User Guide"
            >
              <HelpCircle size={20} />
            </button>

            {/* 2. SETTINGS BUTTON */}
            <button
              onClick={onOpenSettings}
              className="text-gray-500 hover:text-blue-600 p-1"
              title="Settings"
            >
              <Settings size={20} />
            </button>

            {/* 3. SWITCH USER BUTTON (Only show if NOT in Parent Solo mode) */}
            {deviceConfig?.mode !== "PARENT_SOLO" && (
              <button
                onClick={logout}
                className="text-red-400 hover:text-red-600 transition-colors p-1"
                title="Switch User / Logout"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex p-1 bg-white rounded-xl shadow-sm">
          {["approvals", "kids", "chores", "bonuses", "history"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-colors ${
                activeTab === tab
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab}
              {tab === "approvals" && pendingCount > 0 && (
                <span className="absolute top-1 right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* SETTINGS MODAL */}

        {/* Reuse all other sections (Approvals, Kids, Chores, Bonuses, History, Modals) */}

        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-700">
                Global Activity Log
              </h2>
            </div>
            {data.history.length === 0 && (
              <p className="text-center py-10 text-gray-400">
                No activity yet.
              </p>
            )}
            <div className="space-y-2">
              {data.history.map((h) => {
                const kid = data.kids.find((k) => k.id === h.kidId);
                return (
                  <div
                    key={h.id}
                    className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center text-sm"
                  >
                    <div>
                      <div className="font-bold text-gray-700 flex items-center gap-2">
                        {kid && (
                          <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full">
                            {kid.name}
                          </span>
                        )}
                        <span>{h.description}</span>
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <span>{new Date(h.date).toLocaleString()}</span>
                        <span>•</span>
                        <span className="font-medium text-blue-500">
                          by {h.by || "System"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      {h.amount !== 0 && (
                        <span
                          className={`font-bold block ${
                            h.amount > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {h.amount > 0 ? "+" : ""}
                          {formatCurrency(h.amount)}
                        </span>
                      )}
                      {/* NEW: Display Running Balance if it exists */}
                      {h.balance !== undefined && (
                        <span className="text-[10px] text-gray-400 font-mono">
                          Bal: {formatCurrency(h.balance)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <Modal
          isOpen={!!editingKidProfile}
          onClose={() => setEditingKidProfile(null)}
          title="Edit Profile"
        >
          {editingKidProfile && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  Name
                </label>
                <input
                  className="w-full border p-2 rounded"
                  value={editingKidProfile.name}
                  onChange={(e) =>
                    setEditingKidProfile({
                      ...editingKidProfile,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  PIN
                </label>
                <input
                  className="w-full border p-2 rounded"
                  maxLength="4"
                  value={editingKidProfile.pin}
                  onChange={(e) =>
                    setEditingKidProfile({
                      ...editingKidProfile,
                      pin: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  Weekly Allowance Cap ($)
                </label>
                <input
                  className="w-full border p-2 rounded"
                  type="number"
                  value={editingKidProfile.allowanceAmount}
                  onChange={(e) =>
                    setEditingKidProfile({
                      ...editingKidProfile,
                      allowanceAmount: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setEditingKidProfile(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    updateKid(editingKidProfile.id, {
                      name: editingKidProfile.name,
                      pin: editingKidProfile.pin,
                      allowanceAmount: Number(
                        editingKidProfile.allowanceAmount
                      ),
                    });
                    setEditingKidProfile(null);
                  }}
                  className="flex-1"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </Modal>
        <Modal
          isOpen={!!editingChore}
          onClose={() => setEditingChore(null)}
          title="Edit Chore"
        >
          {editingChore && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500">
                  Task Name
                </label>
                <input
                  className="w-full border p-2 rounded"
                  value={editingChore.title}
                  onChange={(e) =>
                    setEditingChore({ ...editingChore, title: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-500">
                    Start Time
                  </label>
                  <input
                    type="time"
                    className="w-full border p-2 rounded"
                    value={editingChore.startTime || ""}
                    onChange={(e) =>
                      setEditingChore({
                        ...editingChore,
                        startTime: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-500">
                    Do By
                  </label>
                  <input
                    type="time"
                    className="w-full border p-2 rounded"
                    value={editingChore.doByTime || ""}
                    onChange={(e) =>
                      setEditingChore({
                        ...editingChore,
                        doByTime: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">
                  Weight (Points)
                </label>
                <div className="flex items-center gap-4 mt-1">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    className="flex-1"
                    value={editingChore.weight || 1}
                    onChange={(e) =>
                      setEditingChore({
                        ...editingChore,
                        weight: e.target.value,
                      })
                    }
                  />
                  <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {editingChore.weight || 1}x
                  </span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">Days</label>
                <div className="flex justify-between gap-1 mt-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const days = editingChore.days.includes(i)
                          ? editingChore.days.filter((d) => d !== i)
                          : [...editingChore.days, i].sort();
                        setEditingChore({ ...editingChore, days });
                      }}
                      className={`w-8 h-8 rounded-full text-xs font-bold ${
                        editingChore.days.includes(i)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-500">
                  Status
                </label>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() =>
                      setEditingChore({ ...editingChore, pausedUntil: null })
                    }
                    className={`flex-1 p-2 rounded text-sm font-bold ${
                      !editingChore.pausedUntil
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <PlayCircle size={16} className="inline mr-1" /> Active
                  </button>
                  <button
                    onClick={() =>
                      setEditingChore({
                        ...editingChore,
                        pausedUntil: "2099-12-31",
                      })
                    }
                    className={`flex-1 p-2 rounded text-sm font-bold ${
                      editingChore.pausedUntil
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <PauseCircle size={16} className="inline mr-1" /> Paused
                  </button>
                </div>
                {editingChore.pausedUntil && (
                  <div className="mt-2 text-xs text-amber-600">
                    Paused until:{" "}
                    <input
                      type="date"
                      value={
                        editingChore.pausedUntil === "2099-12-31"
                          ? ""
                          : editingChore.pausedUntil
                      }
                      onChange={(e) =>
                        setEditingChore({
                          ...editingChore,
                          pausedUntil: e.target.value || "2099-12-31",
                        })
                      }
                      className="border p-1 rounded ml-2"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setEditingChore(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateChore} className="flex-1">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </Modal>
        <Modal
          isOpen={!!rejectingTask}
          onClose={() => setRejectingTask(null)}
          title="Review Task"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              How would you like to handle{" "}
              <strong>{rejectingTask?.title}</strong>?
            </p>
            <button
              onClick={() => {
                rejectTask(rejectingTask, "retry");
                setRejectingTask(null);
              }}
              className="w-full p-4 border-2 border-amber-200 bg-amber-50 rounded-xl flex items-center gap-3 hover:bg-amber-100 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-700">
                <RotateCcw size={20} />
              </div>
              <div>
                <span className="font-bold text-gray-800 block group-hover:text-amber-800">
                  Try Again
                </span>
                <span className="text-xs text-gray-500">
                  Sends back to kid to redo.
                </span>
              </div>
            </button>
            <button
              onClick={() => {
                rejectTask(rejectingTask, "fail");
                setRejectingTask(null);
              }}
              className="w-full p-4 border-2 border-red-200 bg-red-50 rounded-xl flex items-center gap-3 hover:bg-red-100 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center text-red-700">
                <AlertOctagon size={20} />
              </div>
              <div>
                <span className="font-bold text-gray-800 block group-hover:text-red-800">
                  Fail Task
                </span>
                <span className="text-xs text-gray-500">
                  Task fails. Money lost. Cannot redo.
                </span>
              </div>
            </button>
          </div>
        </Modal>
        <Modal
          isOpen={!!selectedKid}
          onClose={() => setSelectedKid(null)}
          title={`Bank Manager: ${selectedKid?.name}`}
        >
          <div className="space-y-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setTransactionType("add")}
                className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 ${
                  transactionType === "add"
                    ? "bg-white shadow-sm text-green-600"
                    : "text-gray-500"
                }`}
              >
                <Plus size={16} /> Deposit
              </button>
              <button
                onClick={() => setTransactionType("sub")}
                className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 ${
                  transactionType === "sub"
                    ? "bg-white shadow-sm text-red-600"
                    : "text-gray-500"
                }`}
              >
                <Wallet size={16} /> Cash Out
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Amount ($)
              </label>
              <input
                type="number"
                autoFocus
                className="w-full text-3xl font-bold p-2 border-b-2 border-blue-500 focus:outline-none"
                placeholder="0.00"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Description
              </label>
              <input
                type="text"
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200"
                placeholder={
                  transactionType === "add"
                    ? "e.g. Birthday Gift"
                    : "e.g. Bought Lego Set"
                }
                value={transactionDesc}
                onChange={(e) => setTransactionDesc(e.target.value)}
              />
            </div>
            <Button
              onClick={handleTransaction}
              className={`w-full ${
                transactionType === "add"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Confirm {transactionType === "add" ? "Deposit" : "Withdrawal"}
            </Button>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 mb-2">
                RECENT HISTORY
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {data.history
                  .filter((h) => h.kidId === selectedKid?.id)
                  .slice(0, 5)
                  .map((h) => {
                    // SAFE GUARD: Ensure amount is a number for display
                    const displayAmount = Number(h.amount) || 0;

                    return (
                      <div key={h.id} className="flex justify-between text-sm">
                        <span className="text-gray-600 truncate max-w-[180px]">
                          {h.description}
                        </span>
                        <div className="text-right">
                          <span
                            className={`font-bold block ${
                              displayAmount > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {displayAmount > 0 ? "+" : ""}
                            {formatCurrency(displayAmount)}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {h.by}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={!!managingTasksKid}
          onClose={() => setManagingTasksKid(null)}
          title={`Tasks: ${managingTasksKid?.name}`}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
              <button
                onClick={() => setManagerWeekOffset((prev) => prev - 1)}
                className="p-2 hover:bg-gray-200 rounded"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-bold text-sm text-gray-700">
                {managerWeekOffset === 0 ? "This Week" : "Last Week"}
              </span>
              <button
                onClick={() => setManagerWeekOffset((prev) => prev + 1)}
                className="p-2 hover:bg-gray-200 rounded"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {getWeekDays(managerWeekOffset).map((dayISO) => {
                const dayChores = data.chores.filter((c) => {
                  const createdDate = c.createdAt || "1970-01-01";
                  if (c.kidId !== managingTasksKid?.id) return false;
                  if (createdDate > dayISO) return false;

                  if (c.type === "one_off") {
                    return c.date === dayISO;
                  } else {
                    return c.days.includes(new Date(dayISO).getDay());
                  }
                });
                if (dayChores.length === 0) return null;
                return (
                  <div key={dayISO} className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {getDayNameFromDate(dayISO)} ({formatDayDisplay(dayISO)})
                    </h4>
                    {dayChores.map((chore) => {
                      const log = data.taskLog.find(
                        (t) =>
                          t.type === "chore" &&
                          t.taskId === chore.id &&
                          t.kidId === managingTasksKid.id &&
                          t.dateString === dayISO
                      );
                      const status = log ? log.status : "todo";
                      let statusColor = "bg-gray-100 border-gray-200";
                      if (status === "approved")
                        statusColor = "bg-green-50 border-green-200";
                      if (status === "pending")
                        statusColor = "bg-amber-50 border-amber-200";
                      if (status === "failed")
                        statusColor = "bg-red-50 border-red-200";
                      if (status === "changes_requested")
                        statusColor = "bg-yellow-50 border-yellow-200";
                      return (
                        <div
                          key={`${chore.id}-${dayISO}`}
                          className={`p-3 rounded-lg border ${statusColor} flex justify-between items-center`}
                        >
                          <div>
                            <div className="font-bold text-gray-800 text-sm">
                              {chore.title}{" "}
                              <span className="text-[10px] text-blue-500 bg-blue-50 px-1 rounded ml-1">
                                {chore.weight || 1}x
                              </span>
                            </div>
                            <div className="text-xs capitalize text-gray-500 font-medium">
                              {status.replace("_", " ")}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {status !== "approved" && (
                              <button
                                onClick={() =>
                                  parentOverrideTask(
                                    chore,
                                    managingTasksKid.id,
                                    dayISO,
                                    "approve",
                                    user.name
                                  )
                                }
                                className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                                title="Mark Done"
                              >
                                <Check size={16} />
                              </button>
                            )}
                            {status !== "failed" && (
                              <button
                                onClick={() =>
                                  parentOverrideTask(
                                    chore,
                                    managingTasksKid.id,
                                    dayISO,
                                    "fail",
                                    user.name
                                  )
                                }
                                className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                title="Fail Task"
                              >
                                <X size={16} />
                              </button>
                            )}
                            {status !== "changes_requested" &&
                              status !== "approved" && (
                                <button
                                  onClick={() =>
                                    parentOverrideTask(
                                      chore,
                                      managingTasksKid.id,
                                      dayISO,
                                      "retry",
                                      user.name
                                    )
                                  }
                                  className="p-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                                  title="Request Retry"
                                >
                                  <RotateCcw size={16} />
                                </button>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              {data.chores.filter((c) => c.kidId === managingTasksKid?.id)
                .length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  No chores assigned to this kid.
                </div>
              )}
            </div>
          </div>
        </Modal>

        {activeTab === "approvals" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-700">
                Waiting for Approval
              </h2>
              {pendingCount > 0 && (
                <Button
                  size="sm"
                  variant="success"
                  onClick={approveAll}
                  disabled={isProcessing} // <--- Disable visual
                >
                  {isProcessing
                    ? "Processing..."
                    : `Approve All (${pendingCount})`}
                </Button>
              )}
            </div>
            {pendingCount === 0 && (
              <div className="text-center py-10 bg-white rounded-xl border border-dashed text-gray-400">
                All caught up! No pending tasks.
              </div>
            )}
            <div className="space-y-3">
              {pendingTasks.map((task) => {
                const kid = data.kids.find((k) => k.id === task.kidId);
                const choreDef = data.chores.find((c) => c.id === task.taskId);
                const weight = choreDef?.weight || 1;
                const stats = calculateWeeklyStats(task.kidId);
                const estimatedValue =
                  task.type === "bonus"
                    ? task.reward
                    : weight * stats.valuePerPoint;
                return (
                  <div
                    key={task.id}
                    className="bg-white p-4 rounded-xl shadow-sm border border-l-4 border-l-amber-400 flex flex-col md:flex-row gap-4 justify-between items-center animate-in slide-in-from-left-2"
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl relative">
                        {kid?.avatar}
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-100">
                          <Clock size={12} className="text-amber-500" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 flex items-center gap-2">
                          {task.title}
                          {task.type === "chore" && weight > 1 && (
                            <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                              {weight}x
                            </span>
                          )}
                          {task.isGroupTask && (
                            <span className="bg-yellow-100 text-yellow-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                              Group
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span>{kid?.name}</span>
                          <span>•</span>
                          <span
                            className={`font-bold ${
                              task.dateString === getLocalISODate()
                                ? "text-green-600"
                                : "text-amber-600"
                            }`}
                          >
                            {task.dateString
                              ? formatDayDisplay(task.dateString)
                              : "Bonus Task"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                      <span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                        {formatCurrency(estimatedValue)}
                      </span>
                      <button
                        onClick={() => setRejectingTask(task)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                        title="Reject"
                      >
                        <ThumbsDown size={20} />
                      </button>
                      <button
                        onClick={() => handleBonusApproval(task)}
                        className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg shadow-green-200 transition-colors"
                        title="Approve"
                      >
                        <ThumbsUp size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {activeTab === "kids" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-700">
                Family Members
              </h2>
              <Button onClick={() => setShowAddKid(true)} size="sm">
                <Plus size={16} /> Add Kid
              </Button>
            </div>
            {showAddKid && (
              <Card className="p-4 animate-in slide-in-from-top-4">
                <form onSubmit={handleAddKid} className="space-y-4">
                  <h3 className="font-bold text-gray-700">New Kid Profile</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold block mb-1">
                        Name
                      </label>
                      <input
                        className="w-full border p-2 rounded"
                        value={newKidName}
                        onChange={(e) => setNewKidName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-1">
                        PIN
                      </label>
                      <input
                        maxLength="4"
                        className="w-full border p-2 rounded"
                        value={newKidPin}
                        onChange={(e) => setNewKidPin(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">
                      Weekly Allowance Cap ($)
                    </label>
                    <input
                      type="number"
                      className="w-full border p-2 rounded"
                      value={newKidAllowance}
                      onChange={(e) => setNewKidAllowance(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowAddKid(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              </Card>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              {data.kids.map((kid) => {
                const stats = calculateWeeklyStats(kid.id);
                return (
                  <Card key={kid.id} className="p-4 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                          {kid.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-lg">{kid.name}</div>
                          <div className="text-xs text-gray-500">
                            Allowance Cap:{" "}
                            {formatCurrency(kid.allowanceAmount || 0)}
                          </div>
                          <div className="text-xs text-blue-500 font-bold">
                            ~ {formatCurrency(stats.valuePerPoint)} / point
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-600">
                          {formatCurrency(kid.balance)}
                        </div>
                        <div className="text-xs text-gray-400">
                          Current Balance
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="text-xs py-2 w-full"
                        onClick={() => setEditingKidProfile(kid)}
                      >
                        <Edit2 size={12} /> Edit Profile
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-xs py-2 w-full bg-blue-50 text-blue-700 hover:bg-blue-100"
                        onClick={() => setSelectedKid(kid)}
                      >
                        <Wallet size={14} /> Manage Funds
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full text-xs bg-gray-50 hover:bg-gray-100 text-gray-700"
                      onClick={() => setManagingTasksKid(kid)}
                    >
                      <ClipboardList size={14} /> View Tasks
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
        {activeTab === "chores" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-gray-700 mb-4">Assign New Chore</h3>
              <form onSubmit={handleAddChore} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Assign To
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {data.kids.map((k) => (
                      <button
                        type="button"
                        key={k.id}
                        onClick={() => toggleMultiAssign(k.id)}
                        className={`px-3 py-1 rounded-full text-sm font-bold border transition-colors ${
                          choreKidIds.includes(k.id)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 border-gray-200"
                        }`}
                      >
                        {k.name}
                      </button>
                    ))}
                  </div>
                  {choreKidIds.length === 0 && (
                    <p className="text-xs text-red-400 mt-1">
                      Select at least one kid.
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-500 mb-1">
                      Task Name
                    </label>
                    <input
                      className="w-full border p-2 rounded-lg"
                      placeholder="e.g. Clean Room"
                      value={choreTitle}
                      onChange={(e) => setChoreTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-full sm:w-24">
                    <label className="block text-sm text-gray-500 mb-1">
                      Weight
                    </label>
                    <div className="flex items-center border p-2 rounded-lg bg-white">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        className="w-full outline-none"
                        value={choreWeight}
                        onChange={(e) => setChoreWeight(e.target.value)}
                      />
                      <span className="text-gray-400 text-xs font-bold">x</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-500 mb-1">
                      Start Time (Optional)
                    </label>
                    <input
                      type="time"
                      className="w-full border p-2 rounded-lg"
                      value={choreStartTime}
                      onChange={(e) => setChoreStartTime(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-500 mb-1">
                      Do By (Optional)
                    </label>
                    <input
                      type="time"
                      className="w-full border p-2 rounded-lg"
                      value={choreDoByTime}
                      onChange={(e) => setChoreDoByTime(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-2">
                    Frequency
                  </label>
                  <div className="flex bg-gray-100 p-1 rounded-lg mb-3">
                    <button
                      type="button"
                      onClick={() => setChoreType("recurring")}
                      className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${
                        choreType === "recurring"
                          ? "bg-white shadow text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Repeat Weekly
                    </button>
                    <button
                      type="button"
                      onClick={() => setChoreType("one_off")}
                      className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${
                        choreType === "one_off"
                          ? "bg-white shadow text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      One Time
                    </button>
                  </div>

                  {choreType === "recurring" ? (
                    <div className="flex justify-between gap-1">
                      {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => toggleDay(i)}
                          className={`w-10 h-10 rounded-full font-bold text-sm transition-colors ${
                            choreDays.includes(i)
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="date"
                      required={choreType === "one_off"}
                      className="w-full border p-2 rounded-lg font-bold text-gray-700"
                      min={new Date().toISOString().split("T")[0]}
                      value={oneOffDate}
                      onChange={(e) => setOneOffDate(e.target.value)}
                    />
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={data.kids.length === 0}
                >
                  {choreType === "one_off"
                    ? "Schedule One-Time Task"
                    : "Create Schedule"}
                </Button>
              </form>
            </Card>
            <div className="space-y-2">
              <h3 className="font-bold text-gray-700">Active Schedules</h3>
              {data.chores
                .sort((a, b) => {
                  const kidA =
                    data.kids.find((k) => k.id === a.kidId)?.name || "z";
                  const kidB =
                    data.kids.find((k) => k.id === b.kidId)?.name || "z";

                  // 1. Sort by Kid Name
                  if (kidA < kidB) return -1;
                  if (kidA > kidB) return 1;

                  // 2. If same kid, sort by Chore Title
                  return a.title.localeCompare(b.title);
                })
                .map((chore) => {
                  const assignedKid = data.kids.find(
                    (k) => k.id === chore.kidId
                  );
                  const isPaused =
                    chore.pausedUntil && chore.pausedUntil > getLocalISODate();
                  return (
                    <div
                      key={chore.id}
                      className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center ${
                        isPaused ? "opacity-60 grayscale" : ""
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800">
                            {chore.title}
                          </span>
                          {chore.weight > 1 && (
                            <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                              {chore.weight}x
                            </span>
                          )}
                          {isPaused && (
                            <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                              <PauseCircle size={10} /> Paused
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 flex gap-2 items-center">
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                            {assignedKid?.name || "Unknown"}
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                            {chore.type === "one_off"
                              ? `One-off: ${formatDayDisplay(chore.date)}`
                              : chore.days.length === 7
                              ? "Everyday"
                              : `${chore.days.length} days/wk`}
                          </span>
                        </div>
                        {(chore.startTime || chore.doByTime) && (
                          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Clock size={10} />
                            {chore.startTime
                              ? formatTime12hr(chore.startTime)
                              : "Start"}{" "}
                            {chore.startTime && chore.doByTime && " - "}
                            {chore.doByTime
                              ? `Due ${formatTime12hr(chore.doByTime)}`
                              : ""}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingChore(chore)}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => deleteChore(chore.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        {activeTab === "bonuses" && (
          <div className="space-y-6">
            <Card className="p-6 bg-yellow-50 border-yellow-100">
              <h3 className="font-bold text-yellow-800 mb-4 flex items-center gap-2">
                <Star className="fill-yellow-500 text-yellow-500" /> Add Bonus
                Opportunity
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <input
                    className="w-full border border-yellow-200 p-2 rounded-lg"
                    placeholder="Task (e.g. Wash Car)"
                    value={bonusTitle}
                    onChange={(e) => setBonusTitle(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  {/* Amount Input */}
                  <div className="flex items-center border border-yellow-200 p-2 rounded-lg bg-white w-24">
                    <span className="text-gray-400 mr-1">$</span>
                    <input
                      className="w-full outline-none"
                      type="number"
                      value={bonusReward}
                      onChange={(e) => setBonusReward(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (bonusTitle) {
                        addBonus(bonusTitle, bonusReward); // Simplified call
                        setBonusTitle("");
                      }
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    Post
                  </Button>
                </div>
              </div>
            </Card>
            <div className="space-y-2">
              <h3 className="font-bold text-gray-700">Available Bonuses</h3>
              {data.bonuses.map((bonus) => (
                <div
                  key={bonus.id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                      <Star size={16} className="fill-yellow-500" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">
                        {bonus.title}
                      </span>
                      <span className="text-[10px] text-gray-400 block">
                        First come, first served
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      {formatCurrency(bonus.reward)}
                    </span>
                    <button
                      onClick={() => deleteBonus(bonus.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      {showHelp && <UserGuideModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
function KidView({
  user,
  data,
  logout,
  submitChore,
  submitBonus,
  updateKid,
  calculateWeeklyStats,
  isChoreActive,
  deviceConfig,
  handleParentGate,
}) {
  const currentTheme =
    THEME_COLORS.find((c) => c.name === user.themeColor) || THEME_COLORS[0];

  const [activeTab, setActiveTab] = useState("todo");
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalName, setGoalName] = useState(user.goalName || "");
  const [goalAmount, setGoalAmount] = useState(user.savingsGoal || 0);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const weekDays = getWeekDays(weekOffset);
  const stats = calculateWeeklyStats(user.id, weekOffset);

  const isGoalReached =
    user.savingsGoal > 0 && user.balance >= user.savingsGoal;
  const hasAvailableBonuses = data.bonuses.length > 0;

  const percentageEarned =
    Math.min((stats.earned / stats.potential) * 100, 100) || 0;
  const percentagePending =
    Math.min((stats.pending / stats.potential) * 100, 100) || 0;

  const getChoreStatus = (choreId, dateString) => {
    const log = data.taskLog.find(
      (t) =>
        t.type === "chore" &&
        t.taskId === choreId &&
        t.kidId === user.id &&
        t.dateString === dateString
    );
    return log ? log.status : "todo";
  };

  const isCurrentWeek = weekOffset === 0;

  return (
    <div className={"min-h-screen pb-20 font-sans " + currentTheme.light}>
      {/* AVATAR PICKER MODAL */}
      {/* AVATAR & THEME PICKER MODAL */}
      <Modal
        isOpen={avatarPickerOpen}
        onClose={() => setAvatarPickerOpen(false)}
        title="Customize Your Profile"
      >
        <div className="space-y-6">
          {/* 1. COLOR PICKER */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">
              Pick Your Color
            </h4>
            <div className="flex flex-wrap gap-3 justify-center">
              {THEME_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => updateKid(user.id, { themeColor: color.name })}
                  className={`w-10 h-10 rounded-full ${
                    color.bg
                  } border-4 transition-transform hover:scale-110 ${
                    user.themeColor === color.name
                      ? "border-white shadow-lg ring-2 ring-gray-300"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* 2. AVATAR PICKER */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">
              Pick Your Avatar
            </h4>
            <div className="grid grid-cols-4 gap-4 max-h-60 overflow-y-auto p-2">
              {AVATARS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    updateKid(user.id, { avatar: emoji });
                    // Optional: Close modal on avatar pick, or let them pick color too
                    // setAvatarPickerOpen(false);
                  }}
                  className={`text-4xl p-2 rounded-xl transition-colors ${
                    user.avatar === emoji
                      ? currentTheme.light +
                        " ring-2 ring-offset-1 ring-" +
                        currentTheme.name.toLowerCase() +
                        "-300"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={() => setAvatarPickerOpen(false)} className="w-full">
            Done
          </Button>
        </div>
      </Modal>

      {/* HISTORY MODAL */}
      <Modal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        title="Your Money History"
      >
        <div className="space-y-3">
          {data.history
            .filter((h) => h.kidId === user.id)
            .map((h) => (
              <div
                key={h.id}
                className="bg-gray-50 p-3 rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="font-bold text-gray-700 text-sm">
                    {h.description}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(h.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-bold ${
                      h.amount > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {h.amount > 0 ? "+" : ""}
                    {formatCurrency(h.amount)}
                  </div>

                  {/* NEW: This shows the running balance if available */}
                  {h.balance !== undefined && (
                    <div className="text-[10px] text-gray-500 font-medium">
                      = {formatCurrency(h.balance)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          {data.history.filter((h) => h.kidId === user.id).length === 0 && (
            <p className="text-center text-gray-400">No transactions yet.</p>
          )}
        </div>
      </Modal>

      {/* HEADER SECTION */}
      <div
        className={
          currentTheme.bg +
          " text-white rounded-b-3xl shadow-xl p-6 pt-8 relative overflow-hidden"
        }
      >
        <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAvatarPickerOpen(true)}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl border border-white/30 relative"
            >
              {user.avatar}
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <Edit2 size={10} className="text-indigo-600" />
              </div>
            </button>
            <div>
              <h1 className="font-bold text-xl opacity-90">Hi, {user.name}!</h1>
              <p className="text-indigo-200 text-sm font-medium">
                Week of {formatDayDisplay(weekDays[0])}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE BUTTONS (Device Settings & Logout) */}
          <div className="flex gap-2">
            {/* 1. NEW HELP BUTTON */}
            <button
              onClick={() => setShowHelp(true)}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-indigo-100 hover:text-white"
              title="User Guide"
            >
              <HelpCircle size={18} />
            </button>

            {/* 2. Parent Settings (Existing) */}
            <button
              onClick={handleParentGate}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-indigo-100 hover:text-white"
              title="Parent Settings"
            >
              <Settings size={18} />
            </button>

            {/* 2. Switch User (NO PIN) - Only for Family/Shared modes */}
            {deviceConfig?.mode !== "KID_SOLO" && (
              <button
                onClick={logout}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-indigo-100 hover:text-white"
                title="Switch User"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>

        {/* PROGRESS BAR CARD */}
        <div className="relative z-10 mb-4 bg-indigo-800/30 p-4 rounded-xl border border-indigo-500/30">
          <div className="flex justify-between items-center mb-2">
            {/* LEFT ARROW (Go Back) */}
            <button
              onClick={() => setWeekOffset((prev) => Math.max(prev - 1, -1))}
              className={`p-1 rounded ${
                weekOffset <= -1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-white/10"
              }`}
              disabled={weekOffset <= -1}
            >
              <ChevronLeft size={16} />
            </button>

            {/* LABEL */}
            <span className="text-xs font-semibold text-indigo-100">
              {weekOffset === 0
                ? "This Week"
                : weekOffset === 1
                ? "Next Week"
                : "Last Week"}
            </span>

            {/* RIGHT ARROW (Go Forward) - Limit to +1 */}
            <button
              onClick={() => setWeekOffset((prev) => Math.min(prev + 1, 1))}
              className={`p-1 rounded ${
                weekOffset >= 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-white/10"
              }`}
              disabled={weekOffset >= 1}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex justify-between text-xs font-semibold text-indigo-100 mb-2">
            <span>Earned: {formatCurrency(stats.earned)}</span>
            <span>Weekly Cap: {formatCurrency(stats.potential)}</span>
          </div>

          <div className="h-4 bg-indigo-900 rounded-full overflow-hidden flex w-full">
            <div
              className="h-full bg-green-400 transition-all duration-500"
              style={{ width: `${percentageEarned}%` }}
            ></div>
            <div
              className="h-full bg-amber-400 transition-all duration-500"
              style={{ width: `${percentagePending}%` }}
            ></div>
          </div>

          {percentagePending > 0 && (
            <div className="text-[10px] text-right mt-1 text-amber-200 font-medium">
              ({formatCurrency(stats.pending)} waiting approval)
            </div>
          )}
        </div>

        {/* BALANCE DISPLAY */}
        <div className="flex flex-col items-center relative z-10">
          <button
            onClick={() => setShowHistory(true)}
            className="flex flex-col items-center group"
          >
            <span className="text-indigo-200 text-sm font-medium mb-1 flex items-center gap-1 group-hover:text-white transition-colors">
              Bank Balance <History size={12} />
            </span>
            <span className="text-4xl font-extrabold tracking-tight">
              {formatCurrency(user.balance)}
            </span>
          </button>
        </div>
      </div>

      <main className="p-4 -mt-6 relative z-10 max-w-md mx-auto space-y-6">
        {/* TABS */}
        <Card className="flex p-1">
          <button
            onClick={() => setActiveTab("todo")}
            className={`flex-1 py-3 rounded-lg flex flex-col items-center gap-1 text-xs font-bold transition-all ${
              activeTab === "todo"
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-400 hover:bg-gray-50"
            }`}
          >
            <CalendarDays size={20} /> Tasks
          </button>
          <button
            onClick={() => setActiveTab("savings")}
            className={`flex-1 py-3 rounded-lg flex flex-col items-center gap-1 text-xs font-bold transition-all relative ${
              activeTab === "savings"
                ? `bg-${currentTheme.light.split("-")[1]}-100 text-${
                    currentTheme.text.split("-")[1]
                  }-700`
                : "text-gray-400 hover:bg-gray-50"
            } ${
              isGoalReached && activeTab !== "savings"
                ? "animate-pulse bg-yellow-100 text-yellow-600 ring-2 ring-yellow-400"
                : ""
            }`}
          >
            <Target
              size={20}
              className={isGoalReached ? "fill-yellow-500 text-yellow-600" : ""}
            />
            {isGoalReached ? "GOAL!" : "Goal"}

            {/* Notification Dot */}
            {isGoalReached && activeTab !== "savings" && (
              <span className="absolute top-1 right-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("bonus")}
            className={`flex-1 py-3 rounded-lg flex flex-col items-center gap-1 text-xs font-bold transition-all relative ${
              activeTab === "bonus"
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-400 hover:bg-gray-50"
            } ${
              hasAvailableBonuses && activeTab !== "bonus"
                ? "animate-pulse bg-yellow-100 text-yellow-600 ring-2 ring-yellow-400"
                : ""
            }`}
          >
            <Award
              size={20}
              className={
                hasAvailableBonuses && activeTab !== "bonus"
                  ? "fill-yellow-500 text-yellow-600"
                  : ""
              }
            />
            Bonus
            {/* Notification Dot */}
            {hasAvailableBonuses && activeTab !== "bonus" && (
              <span className="absolute top-1 right-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
              </span>
            )}
          </button>
        </Card>

        {/* TAB CONTENT: TODO */}
        {activeTab === "todo" && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            {weekDays.map((dayISO, dayIndex) => {
              // 1. Filter chores for this day
              let dayChores = data.chores.filter((c) => {
                const createdDate = c.createdAt || "1970-01-01";

                // Universal checks
                if (c.kidId !== user.id) return false;
                if (!isChoreActive(c)) return false;
                if (createdDate > dayISO) return false; // Retroactive check

                // Type-specific check
                if (c.type === "one_off") {
                  return c.date === dayISO;
                } else {
                  return c.days.includes(new Date(dayISO).getDay());
                }
              });

              if (dayChores.length === 0) return null;

              // 2. Sort chores
              dayChores.sort((a, b) => {
                if (a.startTime && !b.startTime) return -1;
                if (!a.startTime && b.startTime) return 1;
                if (a.startTime && b.startTime) {
                  if (a.startTime !== b.startTime)
                    return a.startTime.localeCompare(b.startTime);
                }
                if (a.doByTime && b.doByTime) {
                  if (a.doByTime !== b.doByTime)
                    return a.doByTime.localeCompare(b.doByTime);
                }
                return a.title.localeCompare(b.title);
              });

              const isToday = dayISO === getLocalISODate();
              const isFuture = dayISO > getLocalISODate();

              // 3. Render
              return (
                <div
                  key={dayISO}
                  className={`space-y-2 ${
                    isFuture ? "opacity-50 grayscale" : ""
                  }`}
                >
                  <h3
                    className={`font-bold text-sm uppercase tracking-wider pl-2 ${
                      isToday ? "text-indigo-600" : "text-gray-500"
                    }`}
                  >
                    {isToday ? "Today" : getDayNameFromDate(dayISO)}{" "}
                    <span className="text-xs font-normal opacity-70">
                      ({formatDayDisplay(dayISO)})
                    </span>
                  </h3>
                  {dayChores.map((chore) => {
                    const status = getChoreStatus(chore.id, dayISO);
                    const isDone = status === "approved";
                    const isPending = status === "pending";
                    const isChangesRequested = status === "changes_requested";
                    const isFailed = status === "failed";
                    return (
                      <div key={`${chore.id}-${dayISO}`} className="relative">
                        <button
                          disabled={isDone || isPending || isFuture || isFailed}
                          onClick={() => submitChore(chore, user.id, dayISO)}
                          className={`w-full text-left p-3 rounded-xl border transition-all duration-300 shadow-sm flex items-center justify-between group overflow-hidden ${
                            isDone
                              ? "bg-green-50 border-green-200"
                              : isPending
                              ? "bg-amber-50 border-amber-200"
                              : isChangesRequested
                              ? "bg-yellow-50 border-yellow-300 shadow-md"
                              : isFailed
                              ? "bg-red-50 border-red-200"
                              : isFuture
                              ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                              : "bg-white border-indigo-100 hover:border-indigo-300"
                          }`}
                        >
                          <div className="flex items-center gap-3 relative z-10">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                isDone
                                  ? "bg-green-500 text-white"
                                  : isPending
                                  ? "bg-amber-400 text-white"
                                  : isChangesRequested
                                  ? "bg-yellow-400 text-yellow-900"
                                  : isFailed
                                  ? "bg-red-400 text-white"
                                  : isFuture
                                  ? "bg-gray-200 text-gray-400"
                                  : "bg-gray-100 text-gray-300 group-hover:bg-indigo-100 group-hover:text-indigo-500"
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle size={14} />
                              ) : isPending ? (
                                <Clock size={14} />
                              ) : isChangesRequested ? (
                                <RotateCcw size={14} />
                              ) : isFailed ? (
                                <X size={14} />
                              ) : isFuture ? (
                                <LockIcon size={12} />
                              ) : (
                                <div className="w-3 h-3 rounded-full border-2 border-current" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 justify-between">
                                <span
                                  className={`font-bold block text-sm ${
                                    isDone
                                      ? "text-gray-500 line-through"
                                      : "text-gray-800"
                                  }`}
                                >
                                  {chore.title}
                                </span>
                                {chore.weight > 1 && (
                                  <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">
                                    {chore.weight}x
                                  </span>
                                )}
                              </div>
                              {(chore.startTime || chore.doByTime) && (
                                <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                  <Clock size={10} />
                                  {chore.startTime
                                    ? formatTime12hr(chore.startTime)
                                    : "Start"}{" "}
                                  {chore.startTime && chore.doByTime && " - "}
                                  {chore.doByTime
                                    ? `Due ${formatTime12hr(chore.doByTime)}`
                                    : ""}
                                </div>
                              )}
                              {isPending && (
                                <span className="text-[10px] font-bold text-amber-600">
                                  Waiting approval
                                </span>
                              )}
                              {isChangesRequested && (
                                <span className="text-[10px] font-bold text-yellow-700">
                                  Try Again
                                </span>
                              )}
                              {isFailed && (
                                <span className="text-[10px] font-bold text-red-500">
                                  Task Failed
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                        {isChangesRequested && !isFuture && (
                          <button
                            onClick={() => submitChore(chore, user.id, dayISO)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] bg-yellow-100 text-yellow-800 border border-yellow-300 px-3 py-1 rounded-full font-bold hover:bg-yellow-200 shadow-sm z-20"
                          >
                            Redo
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB CONTENT: SAVINGS */}
        {/* TAB CONTENT: SAVINGS */}
        {activeTab === "savings" && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 relative">
            {/* --- FIREWORKS CELEBRATION --- */}
            {isGoalReached && (
              <div className="absolute inset-x-0 -top-4 z-50 text-center pointer-events-none">
                <Confetti />
                <div className="bg-yellow-400 text-yellow-900 font-black text-xl py-2 px-4 rounded-full shadow-lg border-4 border-white inline-block animate-bounce relative z-50 transform -rotate-2">
                  🎉 GOAL REACHED! 🎉
                </div>
              </div>
            )}

            <Card
              className={`p-6 text-center space-y-4 ${
                isGoalReached
                  ? "border-4 border-yellow-400 shadow-yellow-200 shadow-xl bg-yellow-50"
                  : ""
              }`}
            >
              <h2 className="text-gray-500 font-semibold uppercase tracking-wider text-xs">
                Saving For
              </h2>
              {/* ... (Keep the rest of your existing logic for editingGoal/Viewing Goal exactly as it was) ... */}
              {editingGoal ? (
                /* ... your existing editing form ... */
                <div className="space-y-4">
                  <input
                    className="w-full text-center font-bold text-2xl border-b-2 border-indigo-200 focus:outline-none bg-transparent"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    placeholder="Goal Name"
                  />
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl font-bold text-gray-400">$</span>
                    <input
                      type="number"
                      className="w-24 text-center font-bold text-2xl border-b-2 border-indigo-200 focus:outline-none bg-transparent"
                      value={goalAmount}
                      onChange={(e) => setGoalAmount(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 justify-center pt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingGoal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        updateKid(user.id, {
                          goalName,
                          savingsGoal: Number(goalAmount),
                        });
                        setEditingGoal(false);
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {user.savingsGoal > 0 ? (
                    <>
                      <div className="flex items-center justify-center gap-2">
                        <Target
                          className={
                            isGoalReached
                              ? "text-yellow-600 animate-spin-slow"
                              : "text-indigo-500"
                          }
                        />
                        <h3 className="text-3xl font-extrabold text-indigo-900">
                          {user.goalName}
                        </h3>
                      </div>
                      <p className="text-gray-500 font-medium">
                        Goal: {formatCurrency(user.savingsGoal)}
                      </p>
                      <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden w-full border border-gray-200">
                        <div
                          className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${
                            isGoalReached
                              ? "bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 animate-pulse"
                              : "bg-gradient-to-r from-blue-400 to-indigo-600"
                          }`}
                          style={{
                            width: `${Math.min(
                              (user.balance / user.savingsGoal) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <p
                        className={`text-sm font-bold ${
                          isGoalReached
                            ? "text-yellow-700 text-lg"
                            : "text-indigo-600"
                        }`}
                      >
                        {Math.round(
                          Math.min((user.balance / user.savingsGoal) * 100, 100)
                        )}
                        % Reached
                      </p>

                      {isGoalReached && (
                        <div className="text-xs font-bold text-green-600 bg-green-100 p-2 rounded-lg animate-pulse">
                          You did it! Ask your parent to cash out!
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingGoal(true)}
                        className="mx-auto mt-4"
                      >
                        Change Goal
                      </Button>
                    </>
                  ) : (
                    <div className="py-8 text-center space-y-4">
                      {/* ... existing empty state ... */}
                      <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-300">
                        <Target size={32} />
                      </div>
                      <p className="text-gray-500">
                        You haven't set a savings goal yet!
                      </p>
                      <Button
                        onClick={() => setEditingGoal(true)}
                        className="mx-auto"
                      >
                        Set a Goal
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Card>
          </div>
        )}

        {/* TAB CONTENT: BONUS */}
        {activeTab === "bonus" && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4">
            <h2 className="font-bold text-gray-700 text-lg px-1">
              Extra Tasks (Bonus)
            </h2>
            {data.bonuses.length === 0 && (
              <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-400 font-medium">
                  No extra tasks available.
                </p>
              </div>
            )}
            {data.taskLog
              .filter(
                (t) =>
                  t.kidId === user.id &&
                  t.type === "bonus" &&
                  t.status === "pending"
              )
              .map((pendingBonus) => (
                <div
                  key={pendingBonus.id}
                  className="w-full bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between text-left opacity-80"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                      <Clock size={20} />
                    </div>
                    <div>
                      <span className="font-bold text-gray-800 block">
                        {pendingBonus.title}
                      </span>
                      <span className="text-xs text-amber-700 font-bold uppercase tracking-wide">
                        Waiting Approval
                      </span>
                    </div>
                  </div>
                  <div className="font-bold text-lg text-amber-600">
                    +{formatCurrency(pendingBonus.reward)}
                  </div>
                </div>
              ))}
            {data.bonuses.map((bonus) => (
              <div
                key={bonus.id}
                className="w-full bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-2xl border border-yellow-200 shadow-sm flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                    <Star
                      size={20}
                      className="fill-yellow-500 text-yellow-500"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block">
                      {bonus.title}
                    </span>
                    <span className="text-xs text-yellow-700 font-bold uppercase tracking-wide">
                      First Come, First Served
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="font-bold text-lg text-green-600 bg-white px-3 py-1 rounded-lg shadow-sm">
                    +{formatCurrency(bonus.reward)}
                  </div>
                  <button
                    onClick={() => submitBonus(bonus, user.id)}
                    className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-bold shadow-sm transition-all active:scale-95"
                  >
                    I Did It!
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {showHelp && <UserGuideModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
const UserGuideModal = ({ onClose }) => (
  <Modal isOpen={true} onClose={onClose} title="ChorePiggy User Guide">
    <div className="space-y-6 text-sm text-gray-700 leading-relaxed pb-4">
      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-indigo-900">
        <strong>ChorePiggy</strong> is a smart family allowance tracker that
        teaches financial literacy. Unlike simple chore charts, it calculates
        the value of chores dynamically based on a weekly allowance cap.
      </div>

      <section>
        <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
          🚀 Getting Started
        </h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Create Family Account:</strong> One parent creates the main
            account using an email and password.
          </li>
          <li>
            <strong>Setup Profiles:</strong> Create a profile for yourself
            (Admin) and each of your children. Set a PIN for everyone.
          </li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
          📱 Connect Other Devices
        </h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>For Kids' Devices:</strong> Open the app on their device and{" "}
            <strong>Log In</strong> using the main Family Email & Password. Do
            not create a new account. Once logged in, go to Settings to lock it
            to their profile.
          </li>
          <li>
            <strong>For Partners/Guardians:</strong> In the Parent Dashboard, go
            to <strong>Settings</strong> and copy the{" "}
            <strong>Invite Link</strong>. Send this to them so they can create
            their own login joined to this family.
          </li>
          <li>
            <strong>App Install:</strong> Tap "Share" (iOS) or Menu (Android)
            and select <strong>"Add to Home Screen"</strong> for a full-screen
            experience.
          </li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
          ⚙️ Device Modes
        </h3>
        <p className="mb-2 text-xs text-gray-500">
          Go to <strong>Settings &gt; Device</strong> (Requires Parent PIN):
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>🖥️ Family Mode (Default):</strong> Best for a shared kitchen
            tablet. Shows everyone. Requires PIN to switch users.
          </li>
          <li>
            <strong>🛡️ Parent Solo:</strong> Best for your personal phone.
            Auto-logs directly into the Parent Dashboard.
          </li>
          <li>
            <strong>🙂 Kid Solo:</strong> Best for a child's personal device.
            Auto-logs directly into that child's view.
          </li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
          🛡️ For Parents
        </h3>
        <div className="space-y-3">
          <div>
            <strong className="block text-gray-900">
              The "Smart Allowance" System
            </strong>
            <p>
              We use a <strong>Weight System</strong>. You set a Weekly Cap
              (e.g., $20) and assign chores weights (1x, 2x, 3x difficulty). If
              a kid does 100% of tasks, they get 100% of the cap. If they skip
              tasks, they earn less. You never overpay!
            </p>
          </div>
          <div>
            <strong className="block text-gray-900">Bonuses 🌟</strong>
            <p>
              Extra tasks that earn money <strong>on top</strong> of the
              allowance. These are "First Come, First Served." If you want two
              kids to wash the car, simply add the task twice!
            </p>
          </div>
          <div>
            <strong className="block text-gray-900">Approvals</strong>
            <p>
              When kids mark tasks done, check the <strong>Approvals</strong>{" "}
              tab. You can Approve (pay), Reject (fail), or request a Retry.
            </p>
          </div>
          <div>
            <strong className="block text-gray-900">The Bank Manager</strong>
            <p>
              Go to the <strong>Kids</strong> tab and click{" "}
              <strong>Manage Funds</strong> to deposit manual cash (birthdays)
              or cash out when they spend money in the real world.
            </p>
          </div>
        </div>
      </section>

      <div className="pt-6 border-t">
        <Button onClick={onClose} className="w-full">
          Close Guide
        </Button>
      </div>
    </div>
  </Modal>
);

// --- SIMPLE FIREWORKS COMPONENT ---
const Confetti = () => {
  // Create 50 particles with random positions and colors
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100, // random % left
    y: Math.random() * 100, // random % top
    color: ["#FFD700", "#FF69B4", "#00BFFF", "#32CD32", "#FFA500"][
      Math.floor(Math.random() * 5)
    ],
    delay: Math.random() * 2, // random animation delay
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-2 h-2 rounded-full animate-ping opacity-75"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            animationDuration: "1s",
            animationDelay: `${p.delay}s`,
            animationIterationCount: "infinite",
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center animate-bounce">
        <span className="text-6xl filter drop-shadow-lg">🎆</span>
      </div>
    </div>
  );
};
