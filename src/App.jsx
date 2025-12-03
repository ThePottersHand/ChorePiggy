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
  "🦊",
  "🐱",
  "🐶",
  "🦁",
  "🐯",
  "🦄",
  "🐲",
  "🦖",
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
  mode = "create",
  inviteFamilyName = "",
}) => {
  const [step, setStep] = useState("parent"); // parent | kids | invite
  const [parentName, setParentName] = useState("");
  const [parentPin, setParentPin] = useState("");
  const [kidsList, setKidsList] = useState([]);
  const [kidName, setKidName] = useState("");
  const [kidPin, setKidPin] = useState("");
  const [familyName, setFamilyName] = useState("");

  // Calculate the ID immediately for display
  const myNewFamilyId = getAuth().currentUser?.uid;
  const inviteLink = `${window.location.origin}${window.location.pathname}?join=${myNewFamilyId}`;

  const handleAddKid = () => {
    if (kidName && kidPin.length === 4) {
      setKidsList([...kidsList, { name: kidName, pin: kidPin, allowance: 10 }]);
      setKidName("");
      setKidPin("");
    }
  };

  const handleNext = () => {
    // If creating, go to Invite step. If joining, finish.
    if (mode === "create") setStep("invite");
    else handleSubmit();
  };

  const handleSubmit = () => {
    let finalKids = [...kidsList];
    if (kidName && kidPin.length === 4) {
      finalKids.push({ name: kidName, pin: kidPin, allowance: 10 });
    }
    onComplete({ familyName, parentName, parentPin, kids: finalKids });
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
                  else handleSubmit();
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
            <Button className="w-full" onClick={handleSubmit}>
              Finish Setup
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
const DeviceSetupWizard = ({ kids, users = [], onComplete }) => {
  const [step, setStep] = useState("select-mode");
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
        <p className="text-gray-600 text-sm text-center">
          Who will be using this specific device?
        </p>

        {step === "select-mode" && (
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
        )}

        {(step === "select-kid" || step === "select-parent") && (
          <div className="space-y-2 animate-in fade-in slide-in-from-right-4">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">
              Select Profile:
            </p>
            {(step === "select-kid" ? kids : users.filter(u => u.role === 'parent')).map((p) => (
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

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;

    if (isIosDevice && !isStandalone) {
      setIsIOS(true);
      setShowPrompt(true);
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          setShowPrompt(false);
        }
        setDeferredPrompt(null);
      });
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-white rounded-xl shadow-2xl border border-indigo-100 p-4 flex flex-col gap-3 relative">
        <button
          onClick={() => setShowPrompt(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Download className="text-indigo-600" size={20} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Install App</h4>
            <p className="text-sm text-gray-500 leading-tight mt-1">
              Add to your home screen for full screen view and easier access!
            </p>
          </div>
        </div>

        {isIOS ? (
          <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span>1. Tap the</span>
              <span className="inline-flex items-center gap-1 font-bold text-blue-600">
                <Share size={14} /> Share
              </span>
              <span>button in your browser bar.</span>
            </div>
            <div className="flex items-center gap-2">
              <span>2. Scroll down and tap</span>
              <span className="inline-flex items-center gap-1 font-bold text-gray-800">
                <Plus
                  size={14}
                  className="border border-gray-400 rounded-[4px] p-[1px]"
                />{" "}
                Add to Home Screen
              </span>
              .
            </div>
          </div>
        ) : (
          <Button
            onClick={handleInstallClick}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Install Now
          </Button>
        )}
      </div>
    </div>
  );
};

const AuthScreen = ({ inviteInfo }) => {
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
          {inviteInfo ? (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-yellow-800 text-sm font-semibold">
              You've been invited to join the <br />
              <span className="text-lg font-bold">{inviteInfo.name}</span>{" "}
              family!
            </div>
          ) : (
            <p className="text-gray-500">The smart family allowance tracker.</p>
          )}
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Family Email
            </label>
            <input
              type="email"
              required
              className="w-full border p-3 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="family@example.com"
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

          <Button type="submit" className="w-full py-3 text-lg">
            {isLogin
              ? inviteInfo
                ? "Log In to Join"
                : "Log In"
              : inviteInfo
              ? "Register to Join"
              : "Create Family Account"}
          </Button>
        </form>

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
              ? "Need a family account? Sign Up"
              : "Already have an account? Log In"}
          </button>
        </div>
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
  const [familyNames, setFamilyNames] = useState({});

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

    // 1. Fetch Family Name
    getDoc(doc(db, "families", currentFamilyId)).then((snap) => {
      if (snap.exists())
        setFamilyNames((prev) => ({
          ...prev,
          [currentFamilyId]: snap.data().familyName || "My Family",
        }));
    });

    const getSub = (name) => collection(db, "families", currentFamilyId, name);

    // 2. Define Standard Collections (Small data, okay to read all)
    const COLLECTIONS = {
      users: getSub("users"),
      kids: getSub("kids"),
      chores: getSub("chores"),
      bonuses: getSub("bonuses"),
      // Note: 'task_log' is removed from here to handle separately below
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
          if (key === "users") setUsers(data);
          if (key === "kids") setKids(data);
          if (key === "chores") setChores(data);
          if (key === "bonuses") setBonuses(data);
        },
        (error) => console.log(`Error fetching ${key}:`, error)
      );
    });

    // 5. OPTIMIZED TASK LOG LISTENER (Limit to last 150 items)
    // This prevents hitting the Firestore 'Read' limit after months of usage
    const taskLogQuery = query(
      getSub("task_log"),
      orderBy("timestamp", "desc"),
      limit(150)
    );

    const taskLogUnsub = onSnapshot(
      taskLogQuery,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTaskLog(data);
      },
      (error) => console.log("Error fetching task_log:", error)
    );

    // 6. History Listener (Already limited)
    const historyQuery = query(
      getSub("history"),
      orderBy("date", "desc"),
      limit(100)
    );
    const historyUnsub = onSnapshot(
      historyQuery,
      (snapshot) => {
        setHistory(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      },
      (error) => console.log("History Error", error)
    );

    // Cleanup all listeners on unmount
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

  const handleWizardComplete = async (setupData) => {
    try {
      const targetFamilyId =
        wizardMode === "create" ? authUser.uid : joinFamilyId;

      if (!targetFamilyId) throw new Error("Invalid Family ID");

      // 1. Create Family Root Meta (Name)
      if (wizardMode === "create") {
        const name = setupData.familyName || "My Family";
        await setDoc(
          doc(db, "families", targetFamilyId),
          { familyName: name },
          { merge: true }
        );
        setFamilyNames((prev) => ({ ...prev, [targetFamilyId]: name }));
      }

      // 2. Check invites if joining
      if (wizardMode === "join") {
        try {
          const configSnap = await getDoc(
            doc(db, "families", targetFamilyId, "settings", "config")
          );
          if (
            configSnap.exists() &&
            configSnap.data().invitesEnabled === false
          ) {
            alert("This family has disabled new invites.");
            return;
          }
        } catch (e) {
          console.log("Could not verify invite settings, proceeding...");
        }
      }

      // 3. Create Parent Profile
      const parentData = {
        id: authUser.uid,
        name: setupData.parentName,
        role: "parent",
        pin: setupData.parentPin,
      };
      await setDoc(
        doc(db, "families", targetFamilyId, "users", authUser.uid),
        parentData
      );

      // 4. Add Kids
      const newKids = [];
      if (setupData.kids && setupData.kids.length > 0) {
        for (const k of setupData.kids) {
          const kidId = generateId();
          const kidData = {
            name: k.name,
            pin: k.pin,
            role: "kid",
            balance: 0,
            savingsGoal: 0,
            goalName: "",
            avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
            allowanceAmount: Number(10),
          };
          await setDoc(
            doc(db, "families", targetFamilyId, "kids", kidId),
            kidData
          );
          newKids.push({ id: kidId, ...kidData });
        }
      }

      // 5. CRITICAL FIX: Optimistic UI Update & Listener Restart
      // Manually set state so the "Welcome" screen vanishes immediately
      setUsers([parentData]);
      setKids(newKids);

      // Update Known Families
      const newKnown = [...new Set([...knownFamilyIds, targetFamilyId])];
      setKnownFamilyIds(newKnown);
      localStorage.setItem(
        "chorePiggy_knownFamilies",
        JSON.stringify(newKnown)
      );

      // Toggle Family ID to force the database listeners to restart/retry
      // (This fixes the issue where listeners died due to 'missing permissions' before creation)
      setCurrentFamilyId(null);
      setTimeout(() => setCurrentFamilyId(targetFamilyId), 50);

      setShowInitModal(false);
    } catch (e) {
      alert(`Error: ${e.message}`);
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
    const matchingParent = users.find((u) => u.role === "parent" && u.pin === pin);
    if (matchingParent) {
      setShowPinPad(false);
      setPinTarget(null);
      setSettingsUser(matchingParent); // Remember who unlocked it
      setShowSettingsModal(true);      // Open the Global Settings
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
    actorName
  ) => {
    await addDoc(getFamilyCol("history"), {
      kidId,
      amount,
      type,
      description,
      date: new Date().toISOString(),
      by: actorName || "Unknown",
    });
  };
  const updateBalance = async (kidId, amount, type, description, actorName) => {
    const kid = kids.find((k) => k.id === kidId);
    if (kid) {
      await updateDoc(getFamilyDoc("kids", kidId), {
        balance: kid.balance + amount,
      });
      await logTransaction(kidId, amount, type, description, actorName);
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
      const stats = calculateWeeklyStats(kidId);
      const weight = chore.weight || 1;
      const value = weight * stats.valuePerPoint;
      await setDoc(
        docRef,
        {
          ...baseData,
          status: "approved",
          approvedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      if (!existingLog || existingLog.status !== "approved") {
        await updateBalance(
          kidId,
          value,
          "chore",
          `${chore.title} (${formatDayDisplay(dateString)})`,
          parentName
        );
      }
    } else if (action === "fail") {
      await setDoc(
        docRef,
        { ...baseData, status: "failed", rejectedAt: new Date().toISOString() },
        { merge: true }
      );
    } else if (action === "retry") {
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
    await setDoc(getFamilyDoc("task_log"), {
      type: "bonus",
      taskId: bonus.id,
      title: bonus.title,
      reward: bonus.reward,
      kidId,
      status: "pending",
      timestamp: new Date().toISOString(),
      isGroupTask: bonus.maxKids > 1,
    });
    if (!bonus.maxKids || bonus.maxKids <= 1) {
      await deleteDoc(getFamilyDoc("bonuses", bonus.id));
    }
  };
  const joinBonus = async (bonusId, kidId) => {
    const bonusRef = getFamilyDoc("bonuses", bonusId);
    const bonus = bonuses.find((b) => b.id === bonusId);
    const currentWorkers = bonus.workers || [];
    if (!currentWorkers.includes(kidId)) {
      await updateDoc(bonusRef, { workers: [...currentWorkers, kidId] });
    }
  };
  const addBonus = async (title, reward, maxKids = 1) => {
    setDoc(getFamilyDoc("bonuses"), {
      title,
      reward,
      status: "available",
      maxKids,
      workers: [],
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

  if (loading) {
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
          mode={wizardMode}
          inviteFamilyName={inviteInfo?.name}
        />
      )}
{authUser && !deviceConfig && users.length > 0 && (
  <DeviceSetupWizard kids={kids} users={users} onComplete={updateDeviceConfig} />
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
      <InstallPrompt />
      {/* --- GLOBAL FAMILY SETTINGS MODAL --- */}
<Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="Family Settings">
        <div className="space-y-6">

          {/* 1. NEW: MY PROFILE SECTION */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 animate-in fade-in slide-in-from-top-2">
            <h4 className="font-bold text-blue-800 text-sm uppercase mb-3">My Profile</h4>
            <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <span className="font-bold text-gray-800 block">{settingsUser?.name || "Parent"}</span>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Admin Access</span>
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
            <h4 className="font-bold text-indigo-800 text-sm uppercase">This Device Mode</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => updateDeviceConfig({ mode: "FAMILY", targetId: null })} className={`p-3 text-left rounded-lg border-2 transition-all flex items-center gap-3 ${deviceConfig?.mode === "FAMILY" ? "border-indigo-600 bg-white ring-2 ring-indigo-100" : "border-gray-100 hover:border-indigo-200 bg-white"}`}>
                <div className={`p-2 rounded-full ${deviceConfig?.mode === "FAMILY" ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-500"}`}><Monitor size={20} /></div>
                <div className="flex-1"><span className="font-bold block text-sm text-gray-800">Family (Default)</span><span className="text-[10px] text-gray-500">Standard login screen.</span></div>
                {deviceConfig?.mode === "FAMILY" && <CheckCircle size={18} className="text-indigo-600" />}
              </button>

              <button onClick={() => updateDeviceConfig({ mode: "PARENT_SOLO", targetId: settingsUser?.id })} className={`p-3 text-left rounded-lg border-2 transition-all flex items-center gap-3 ${deviceConfig?.mode === "PARENT_SOLO" ? "border-blue-600 bg-white ring-2 ring-blue-100" : "border-gray-100 hover:border-blue-200 bg-white"}`}>
                <div className={`p-2 rounded-full ${deviceConfig?.mode === "PARENT_SOLO" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}><ShieldCheck size={20} /></div>
                <div className="flex-1"><span className="font-bold block text-sm text-gray-800">Only Me</span><span className="text-[10px] text-gray-500">Auto-login as {settingsUser?.name || 'Parent'}.</span></div>
                {deviceConfig?.mode === "PARENT_SOLO" && <CheckCircle size={18} className="text-blue-600" />}
              </button>

              <div className="mt-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Kid Solo Mode</p>
                <div className="grid grid-cols-2 gap-2">
                  {kids.map((k) => (
                    <button key={k.id} onClick={() => updateDeviceConfig({ mode: "KID_SOLO", targetId: k.id })} className={`p-2 text-left text-xs rounded border flex items-center gap-2 ${deviceConfig?.mode === "KID_SOLO" && deviceConfig?.targetId === k.id ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-200 hover:border-green-300"}`}>
                      <span className="text-xl">{k.avatar}</span><span className="font-bold truncate">{k.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. FAMILY ACCESS (INVITES) */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
             <h4 className="font-bold text-gray-700 text-sm uppercase">Family Access</h4>
             <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg text-sm text-gray-600 space-y-3">
                <div className="flex justify-between items-center gap-2">
                   <div className="flex items-center gap-2"><LinkIcon size={16} className="text-yellow-600"/><span className="text-xs font-semibold text-yellow-800">Invite Link</span></div>
                   <button onClick={safeCopyLink} className="px-3 py-1 bg-white border border-yellow-200 rounded text-xs font-bold text-yellow-700 hover:bg-yellow-100" disabled={invitesEnabled === false}><Copy size={14}/></button>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-yellow-200">
                   <span className="text-xs font-bold text-yellow-800">Allow Invites</span>
                   <button onClick={toggleInvites} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${invitesEnabled ? 'bg-green-500' : 'bg-gray-300'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${invitesEnabled ? 'translate-x-6' : 'translate-x-1'}`}/></button>
                </div>
             </div>
             {/* List other parents */}
             <div className="space-y-2">
                {users.filter(u => u.role === 'parent' && u.id !== settingsUser?.id).map(p => (
                  <div key={p.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span className="font-bold text-gray-700">{p.name}</span>
                    <button onClick={() => deleteParent(p.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                  </div>
                ))}
             </div>
          </div>

          {/* 4. FULL LOGOUT */}
          <div className="pt-4 border-t border-gray-100">
            <button onClick={() => { handleFullSignOut(); setShowSettingsModal(false); }} className="w-full p-3 bg-red-50 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100">
              <LogOut size={18}/> Full Sign Out
            </button>
            <p className="text-[10px] text-center text-red-300 mt-2">Disconnects device from family account.</p>
          </div>

          {/* SAVE BUTTON */}
          <div className="pt-2">
             <Button onClick={() => setShowSettingsModal(false)} className="w-full">Save & Close</Button>
          </div>
        </div>
      </Modal>
{/* NEW DEVICE ADMIN MENU (Triggered by Parent PIN) */}
  
      {view === "login" && (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
          {/* --- UPDATED HEADER SECTION --- */}
<div className="absolute top-4 right-4">
            <button
              onClick={() => { if (users.length > 0) handleParentGate(); }}
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
          joinBonus={joinBonus}
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
  const [bonusMaxKids, setBonusMaxKids] = useState("1");
  const [newParentPin, setNewParentPin] = useState("");
  const [newParentName, setNewParentName] = useState("");
  const [newParentPin2, setNewParentPin2] = useState("");
  

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
    if (confirm(`Approve all ${pendingCount} tasks?`)) {
      for (const task of pendingTasks) {
        if (task.type === "chore") {
          const stats = calculateWeeklyStats(task.kidId);
          const choreDef = data.chores.find((c) => c.id === task.taskId);
          const weight = choreDef?.weight || 1;
          const val = weight * stats.valuePerPoint;
          await approveTask(task, val, user.name);
        } else {
          await approveTask(task, 0, user.name);
        }
      }
    }
  };
  const handleBonusApproval = (task) => {
    if (task.isGroupTask) {
      setSplitAmount(Math.floor(task.reward / 2));
      setSplitRewardTask(task);
    } else {
      approveTask(task, task.reward, user.name);
    }
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
            <button
onClick={onOpenSettings} // <--- CHANGE THIS
  className="text-gray-500 hover:text-blue-600"
>
  <Settings size={20} />
            </button>
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
        <Modal
          isOpen={!!splitRewardTask}
          onClose={() => setSplitRewardTask(null)}
          title="Split Group Reward"
        >
          <div className="space-y-4">
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <h4 className="font-bold text-gray-800">
                {splitRewardTask?.title}
              </h4>
              <p className="text-sm text-gray-600">
                Total Pool: {formatCurrency(splitRewardTask?.reward)}
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Multiple kids might be working on this. How much should{" "}
              <strong>
                {data.kids.find((k) => k.id === splitRewardTask?.kidId)?.name}
              </strong>{" "}
              get?
            </p>
            <div className="flex items-center gap-3 justify-center py-4">
              <button
                onClick={() => setSplitAmount((s) => Math.max(0, s - 1))}
                className="p-3 bg-gray-100 rounded-full"
              >
                <Minus size={20} />
              </button>
              <span className="text-4xl font-bold text-green-600">
                {formatCurrency(splitAmount)}
              </span>
              <button
                onClick={() => setSplitAmount((s) => s + 1)}
                className="p-3 bg-gray-100 rounded-full"
              >
                <Plus size={20} />
              </button>
            </div>
            <Button
              className="w-full bg-green-600"
              onClick={() => {
                approveTask(splitRewardTask, splitAmount, user.name);
                setSplitRewardTask(null);
              }}
            >
              Approve {formatCurrency(splitAmount)}
            </Button>
          </div>
        </Modal>
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
                    {h.amount !== 0 && (
                      <span
                        className={`font-bold ${
                          h.amount > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {h.amount > 0 ? "+" : ""}
                        {formatCurrency(h.amount)}
                      </span>
                    )}
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
                  .map((h) => (
                    <div key={h.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate max-w-[180px]">
                        {h.description}
                      </span>
                      <div className="text-right">
                        <span
                          className={`font-bold block ${
                            h.amount > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {h.amount > 0 ? "+" : ""}
                          {formatCurrency(h.amount)}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {h.by}
                        </span>
                      </div>
                    </div>
                  ))}
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
                <Button size="sm" variant="success" onClick={approveAll}>
                  Approve All ({pendingCount})
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
          <label className="block text-sm text-gray-500 mb-2">Frequency</label>
          <div className="flex bg-gray-100 p-1 rounded-lg mb-3">
             <button type="button" onClick={()=>setChoreType('recurring')} className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${choreType==='recurring'?'bg-white shadow text-blue-600':'text-gray-500 hover:text-gray-700'}`}>Repeat Weekly</button>
             <button type="button" onClick={()=>setChoreType('one_off')} className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${choreType==='one_off'?'bg-white shadow text-blue-600':'text-gray-500 hover:text-gray-700'}`}>One Time</button>
          </div>

          {choreType === 'recurring' ? (
             <div className="flex justify-between gap-1">
               {['S','M','T','W','T','F','S'].map((day, i) => (
                 <button type="button" key={i} onClick={() => toggleDay(i)} className={`w-10 h-10 rounded-full font-bold text-sm transition-colors ${choreDays.includes(i) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>{day}</button>
               ))}
             </div>
          ) : (
             <input type="date" required={choreType === 'one_off'} className="w-full border p-2 rounded-lg font-bold text-gray-700" min={new Date().toISOString().split('T')[0]} value={oneOffDate} onChange={e=>setOneOffDate(e.target.value)} />
          )}
        </div>

        <Button type="submit" className="w-full" disabled={data.kids.length === 0}>
            {choreType === 'one_off' ? 'Schedule One-Time Task' : 'Create Schedule'}
        </Button>
              </form>
            </Card>
            <div className="space-y-2">
              <h3 className="font-bold text-gray-700">Active Schedules</h3>
              {data.chores.map((chore) => {
                const assignedKid = data.kids.find((k) => k.id === chore.kidId);
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
   {chore.type === 'one_off' 
      ? `One-off: ${formatDayDisplay(chore.date)}` 
      : (chore.days.length === 7 ? 'Everyday' : `${chore.days.length} days/wk`)
   }
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
                  <div
                    className="flex items-center border border-yellow-200 p-2 rounded-lg bg-white"
                    title="Max Kids"
                  >
                    <Users size={16} className="text-yellow-500 mr-2" />
                    <input
                      className="w-8 text-center outline-none"
                      type="number"
                      min="1"
                      max="10"
                      value={bonusMaxKids || 1}
                      onChange={(e) => setBonusMaxKids(e.target.value)}
                    />
                  </div>
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
                        addBonus(
                          bonusTitle,
                          Number(bonusReward),
                          Number(bonusMaxKids || 1)
                        );
                        setBonusTitle("");
                        setBonusMaxKids(1);
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
                      {bonus.maxKids > 1 && (
                        <span className="text-[10px] text-yellow-600 flex items-center gap-1">
                          <Users size={10} /> Group Task (
                          {bonus.workers?.length || 0}/{bonus.maxKids})
                        </span>
                      )}
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
    </div>
  );
}
function KidView({
  user,
  data,
  logout,
  submitChore,
  submitBonus,
  joinBonus,
  updateKid,
  calculateWeeklyStats,
  isChoreActive,
  deviceConfig,
  handleParentGate,
}) {
  const [activeTab, setActiveTab] = useState("todo");
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalName, setGoalName] = useState(user.goalName || "");
  const [goalAmount, setGoalAmount] = useState(user.savingsGoal || 0);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [weekOffset, setWeekOffset] = useState(0);
  const weekDays = getWeekDays(weekOffset);
  const stats = calculateWeeklyStats(user.id, weekOffset);

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
    <div className="min-h-screen bg-indigo-50 pb-20 font-sans">
      {/* AVATAR PICKER MODAL */}
      <Modal
        isOpen={avatarPickerOpen}
        onClose={() => setAvatarPickerOpen(false)}
        title="Choose Your Avatar"
      >
        <div className="grid grid-cols-4 gap-4">
          {AVATARS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                updateKid(user.id, { avatar: emoji });
                setAvatarPickerOpen(false);
              }}
              className="text-4xl p-2 hover:bg-indigo-50 rounded-xl transition-colors"
            >
              {emoji}
            </button>
          ))}
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
                  <div className="text-[10px] text-gray-400">{h.by}</div>
                </div>
              </div>
            ))}
          {data.history.filter((h) => h.kidId === user.id).length === 0 && (
            <p className="text-center text-gray-400">No transactions yet.</p>
          )}
        </div>
      </Modal>

      {/* HEADER SECTION */}
      <div className="bg-indigo-600 text-white rounded-b-3xl shadow-xl p-6 pt-8 relative overflow-hidden">
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
            {/* 1. Parent Settings (Always requires PIN) */}
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
            className={`flex-1 py-3 rounded-lg flex flex-col items-center gap-1 text-xs font-bold transition-all ${
              activeTab === "savings"
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-400 hover:bg-gray-50"
            }`}
          >
            <Target size={20} /> Goal
          </button>
          <button
            onClick={() => setActiveTab("bonus")}
            className={`flex-1 py-3 rounded-lg flex flex-col items-center gap-1 text-xs font-bold transition-all ${
              activeTab === "bonus"
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-400 hover:bg-gray-50"
            }`}
          >
            <Award size={20} /> Bonus
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
        {activeTab === "savings" && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <Card className="p-6 text-center space-y-4">
              <h2 className="text-gray-500 font-semibold uppercase tracking-wider text-xs">
                Saving For
              </h2>
              {editingGoal ? (
                <div className="space-y-4">
                  <input
                    className="w-full text-center font-bold text-2xl border-b-2 border-indigo-200 focus:outline-none"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    placeholder="Goal Name"
                  />
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl font-bold text-gray-400">$</span>
                    <input
                      type="number"
                      className="w-24 text-center font-bold text-2xl border-b-2 border-indigo-200 focus:outline-none"
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
                        <Target className="text-indigo-500" />
                        <h3 className="text-3xl font-extrabold text-indigo-900">
                          {user.goalName}
                        </h3>
                      </div>
                      <p className="text-gray-500 font-medium">
                        Goal: {formatCurrency(user.savingsGoal)}
                      </p>
                      <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden w-full">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-indigo-600 transition-all duration-1000 ease-out"
                          style={{
                            width: `${Math.min(
                              (user.balance / user.savingsGoal) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="text-sm font-bold text-indigo-600">
                        {Math.round(
                          Math.min((user.balance / user.savingsGoal) * 100, 100)
                        )}
                        % Reached
                      </p>
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
                      <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-300">
                        <Target size={32} />
                      </div>
                      <p className="text-gray-500">
                        You haven't set a savings goal yet!
                      </p>
                      <Button onClick={() => setEditingGoal(true)}>
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
            {data.bonuses.map((bonus) => {
              const workers = bonus.workers || [];
              const isWorking = workers.includes(user.id);
              const isFull = workers.length >= (bonus.maxKids || 1);
              const hasSubmitted = data.taskLog.some(
                (t) => t.taskId === bonus.id && t.kidId === user.id
              );
              if (hasSubmitted) return null;
              return (
                <div
                  key={bonus.id}
                  className="w-full bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-2xl border border-yellow-200 shadow-sm flex flex-col gap-3 text-left"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isWorking
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {isWorking ? (
                          <CheckCircle size={20} />
                        ) : (
                          <Star
                            className="fill-yellow-500 text-yellow-500"
                            size={20}
                          />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 block">
                          {bonus.title}
                        </span>
                        <span className="text-xs text-yellow-700 font-semibold uppercase tracking-wide flex items-center gap-1">
                          {bonus.maxKids > 1 ? <Users size={12} /> : null}
                          {isWorking ? "In Progress" : "Bonus Task"}
                        </span>
                      </div>
                    </div>
                    <div className="font-bold text-lg text-green-600 bg-white px-3 py-1 rounded-lg shadow-sm">
                      +{formatCurrency(bonus.reward)}
                    </div>
                  </div>
                  {bonus.maxKids > 1 && (
                    <div className="text-xs text-gray-500 px-1 flex gap-2 items-center">
                      <div className="flex -space-x-2">
                        {workers.map((wId) => {
                          const worker = data.kids.find((k) => k.id === wId);
                          return (
                            <div
                              key={wId}
                              className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px]"
                              title={worker?.name}
                            >
                              {worker?.avatar}
                            </div>
                          );
                        })}
                      </div>
                      <span>
                        {workers.length}/{bonus.maxKids} Kids working
                      </span>
                    </div>
                  )}
                  {isWorking ? (
                    <button
                      onClick={() => submitBonus(bonus, user.id)}
                      className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-md transition-all active:scale-95"
                    >
                      Mark Done
                    </button>
                  ) : (
                    <button
                      disabled={isFull}
                      onClick={() => joinBonus(bonus.id, user.id)}
                      className={`w-full py-2 rounded-xl font-bold border-2 transition-all active:scale-95 ${
                        isFull
                          ? "bg-gray-100 text-gray-400 border-transparent"
                          : "bg-white border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                      }`}
                    >
                      {isFull ? "Team Full" : "Start Working"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}