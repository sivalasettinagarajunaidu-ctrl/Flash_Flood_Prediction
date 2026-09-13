import React, { useState } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  CloudRain,
  BarChart3,
  ShieldCheck,
  Users,
  Mountain,
  Leaf,
  TreePine,
  ArrowRight,
  Check,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Volume2,
  Shield,
} from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole, username?: string) => void;
}

const generateCaptchaCode = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Captcha security states
  const [captchaCode, setCaptchaCode] = useState(() => generateCaptchaCode());
  const [userCaptcha, setUserCaptcha] = useState('');
  const [isRefreshingCaptcha, setIsRefreshingCaptcha] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const refreshCaptcha = () => {
    setIsRefreshingCaptcha(true);
    setCaptchaCode(generateCaptchaCode());
    setUserCaptcha('');
    setTimeout(() => setIsRefreshingCaptcha(false), 350);
  };

  const playCaptchaAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsAudioPlaying(true);
      const spelled = captchaCode.split('').join('. ');
      const utterance = new SpeechSynthesisUtterance(`Security captcha code: ${spelled}`);
      utterance.rate = 0.8;
      utterance.onend = () => setIsAudioPlaying(false);
      utterance.onerror = () => setIsAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Captcha validation
    if (!userCaptcha.trim()) {
      setError('Please enter the captcha code shown in the security box.');
      return;
    }

    if (userCaptcha.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setError('Incorrect captcha code. A new code has been generated. Please try again.');
      refreshCaptcha();
      return;
    }

    // If username is provided, determine or default role
    const effectiveUser = username.trim() || 'Citizen Officer';
    const effectiveRole = selectedRole;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(effectiveRole, effectiveUser);
    }, 400);
  };

  const handleQuickLogin = (role: UserRole, user: string) => {
    setSelectedRole(role);
    setUsername(user);
    setPassword('Sentinel@2025');
    setUserCaptcha(captchaCode);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(role, user);
    }, 300);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden select-none font-sans text-white bg-slate-950">
      {/* 1. PHOTOREALISTIC BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Authentic Himalayan River Valley Photo with Raging Mountain River */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2600&q=85')`,
          }}
        />

        {/* Secondary atmospheric color grading and contrast overlay matching the exact photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/40 to-slate-950/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/80" />

        {/* Dynamic river torrent spray & mountain mist effect */}
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent pointer-events-none" />
      </div>

      {/* 2. TOP OFFICIAL NAVIGATION HEADER */}
      <header className="relative z-20 w-full pt-4 sm:pt-6 px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Left: Ministry of Home Affairs / Government of India */}
        <div className="flex items-center gap-3">
          {/* Ashoka Lion Capital SVG Emblem */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <svg
              viewBox="0 0 100 130"
              className="h-11 w-9 text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] fill-current"
            >
              <path d="M50 5 C55 12 62 14 62 20 C62 26 58 30 50 32 C42 30 38 26 38 20 C38 14 45 12 50 5 Z" />
              <path d="M28 22 C34 26 36 32 35 38 C32 44 26 44 22 38 C18 32 22 26 28 22 Z" />
              <path d="M72 22 C66 26 64 32 65 38 C68 44 74 44 78 38 C82 32 78 26 72 22 Z" />
              <rect x="25" y="55" width="50" height="14" rx="3" />
              <circle cx="50" cy="62" r="5" fill="#0284c7" />
              <rect x="20" y="73" width="60" height="7" rx="2" />
              <text
                x="50"
                y="92"
                textAnchor="middle"
                fontSize="10"
                fontWeight="900"
                fill="#fef08a"
                fontFamily="serif"
              >
                सत्यमेव जयते
              </text>
            </svg>
          </div>

          <div className="leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            <span className="block text-[13px] font-bold text-slate-100 font-hindi">
              गृह मंत्रालय
            </span>
            <span className="block text-[11px] font-extrabold tracking-wider text-white">
              MINISTRY OF
            </span>
            <span className="block text-[11px] font-extrabold tracking-wider text-white">
              HOME AFFAIRS
            </span>
            <span className="block text-[9px] font-semibold text-slate-300 tracking-wide">
              GOVERNMENT OF INDIA
            </span>
          </div>
        </div>

        {/* Center: Slogan Banner */}
        <div className="hidden lg:flex flex-col items-center text-center">
          <span className="text-[11px] tracking-widest text-slate-200 uppercase font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            Towards a Safer, More Resilient India
          </span>
          <div className="h-0.5 w-28 bg-emerald-400 my-1 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="text-[13px] font-bold text-emerald-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] font-hindi">
            सुरक्षित पर्वत सुरक्षित भारत
          </span>
        </div>

        {/* Right: Navigation Links & Disaster Management Logo */}
        <div className="flex items-center gap-6 sm:gap-8">
          <nav className="flex items-center gap-5 sm:gap-7 text-xs font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            {[
              { id: 'Home', label: 'Home' },
              { id: 'About', label: 'About' },
              { id: 'Features', label: 'Features' },
              { id: 'Resources', label: 'Resources' },
              { id: 'Contact', label: 'Contact' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  if (item.id !== 'Home') {
                    setActiveModal(item.id);
                  }
                }}
                className={`transition-colors relative py-1 ${
                  activeNav === item.id
                    ? 'text-white font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
                {activeNav === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                )}
              </button>
            ))}
          </nav>

          {/* Disaster Management Official Emblem */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-700/60 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            <div className="h-9 w-9 rounded-full bg-slate-900/80 border border-teal-500/50 flex items-center justify-center p-1 shadow-md">
              <svg viewBox="0 0 100 100" className="h-7 w-7">
                <polygon points="50,15 80,75 20,75" fill="#059669" />
                <polygon points="50,22 72,70 28,70" fill="#0d9488" />
                <path
                  d="M15,70 Q50,60 85,70 Q50,85 15,70"
                  fill="#0284c7"
                  opacity="0.9"
                />
                <path
                  d="M20,80 Q50,72 80,80 Q50,92 20,80"
                  fill="#38bdf8"
                  opacity="0.8"
                />
              </svg>
            </div>
            <div className="leading-tight text-right hidden sm:block">
              <span className="block text-[11px] font-bold text-emerald-300 font-hindi">
                आपदा प्रबंधन
              </span>
              <span className="block text-[10px] font-black tracking-wider text-white">
                DISASTER MANAGEMENT
              </span>
              <span className="block text-[8px] font-semibold text-slate-300 uppercase tracking-wider">
                A Safer India
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. MAIN CENTER CONTENT: LEFT HERO + RIGHT ROAD SCENERY & FLOATING LOGIN CARD */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* LEFT COLUMN: HERO HEADLINE & 4 FEATURE BADGES (6 cols) */}
        <div className="lg:col-span-6 space-y-6 lg:space-y-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
          {/* Tracked Kicker */}
          <div className="text-[11px] sm:text-xs tracking-[0.25em] text-slate-300 uppercase font-semibold">
            MONITOR &nbsp;|&nbsp; PREDICT &nbsp;|&nbsp; PREPARE &nbsp;|&nbsp; PROTECT
          </div>

          {/* Giant Title */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none uppercase">
              FLASH FLOOD
            </h1>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 tracking-tight leading-none uppercase filter drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
              PREDICTION SYSTEM
            </h2>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-[0.18em] text-slate-100 uppercase pt-1">
              FOR HILLY REGIONS
            </h3>
          </div>

          {/* Subtitle */}
          <p className="text-slate-200 text-sm sm:text-base max-w-lg leading-relaxed font-normal">
            Leveraging multi-source data and advanced AI for safer hill communities across India.
          </p>

          {/* 4 Circular Feature Badges in a Row */}
          <div className="grid grid-cols-4 gap-3 sm:gap-5 pt-4 max-w-md">
            {/* 1. Weather Monitoring */}
            <div className="flex flex-col items-center text-center group">
              <div className="h-13 w-13 sm:h-14 sm:w-14 rounded-full bg-slate-900/70 border border-slate-600/60 backdrop-blur-md flex items-center justify-center text-white shadow-xl group-hover:border-emerald-400 group-hover:scale-105 transition-all">
                <CloudRain className="h-6 w-6 text-slate-100" />
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-200 font-medium leading-tight mt-2.5">
                Real-Time <br /> Weather Monitoring
              </span>
            </div>

            {/* 2. AI-Based Flood Prediction */}
            <div className="flex flex-col items-center text-center group">
              <div className="h-13 w-13 sm:h-14 sm:w-14 rounded-full bg-slate-900/70 border border-slate-600/60 backdrop-blur-md flex items-center justify-center text-white shadow-xl group-hover:border-emerald-400 group-hover:scale-105 transition-all">
                <BarChart3 className="h-6 w-6 text-slate-100" />
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-200 font-medium leading-tight mt-2.5">
                AI-Based <br /> Flood Prediction
              </span>
            </div>

            {/* 3. Early Warnings */}
            <div className="flex flex-col items-center text-center group">
              <div className="h-13 w-13 sm:h-14 sm:w-14 rounded-full bg-slate-900/70 border border-slate-600/60 backdrop-blur-md flex items-center justify-center text-white shadow-xl group-hover:border-emerald-400 group-hover:scale-105 transition-all">
                <ShieldCheck className="h-6 w-6 text-slate-100" />
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-200 font-medium leading-tight mt-2.5">
                Early <br /> Warnings
              </span>
            </div>

            {/* 4. Safer Communities */}
            <div className="flex flex-col items-center text-center group">
              <div className="h-13 w-13 sm:h-14 sm:w-14 rounded-full bg-slate-900/70 border border-slate-600/60 backdrop-blur-md flex items-center justify-center text-white shadow-xl group-hover:border-emerald-400 group-hover:scale-105 transition-all">
                <Users className="h-6 w-6 text-slate-100" />
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-200 font-medium leading-tight mt-2.5">
                Safer <br /> Communities
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FLOATING GLASSMORPHIC LOGIN CARD + HIMALAYAN MOUNTAIN ROADSIDE SAFETY BOARD (6 cols) */}
        <div className="lg:col-span-6 relative flex flex-col md:flex-row items-center justify-center lg:justify-end gap-6">
          {/* THE FLOATING LOGIN CARD */}
          <div className="w-full max-w-md bg-slate-900/75 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-7 sm:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative z-20 space-y-5">
            {/* Card Header */}
            <div className="text-center space-y-1">
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Welcome
              </h3>
              <p className="text-xs text-slate-300">
                Login to access the Flash Flood Prediction System
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/70 border border-slate-700/80 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 transition-all font-sans"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950/70 border border-slate-700/80 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Security Captcha Verification */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-[11px] text-slate-300 px-0.5">
                  <span className="font-semibold flex items-center gap-1.5 text-slate-200">
                    <Shield className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Security Verification</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-hindi">सुरक्षा कोड</span>
                </div>

                {/* Captcha Display Box & Action Controls */}
                <div className="flex items-center gap-2">
                  {/* SVG Distorted Captcha Image Canvas */}
                  <div
                    className="relative flex-1 h-11 bg-slate-950/90 border border-slate-700/90 rounded-xl overflow-hidden shadow-inner flex items-center justify-center select-none"
                    title="Security Verification Code"
                  >
                    {/* Background noise grid & curves */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                      <pattern id="captcha-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#64748b" strokeWidth="0.5" strokeOpacity="0.3" />
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#captcha-grid)" />
                      {/* Noise dots */}
                      <circle cx="20" cy="12" r="1.5" fill="#38bdf8" opacity="0.6" />
                      <circle cx="55" cy="30" r="1.2" fill="#34d399" opacity="0.6" />
                      <circle cx="90" cy="10" r="1.8" fill="#fbbf24" opacity="0.5" />
                      <circle cx="130" cy="32" r="1.5" fill="#f472b6" opacity="0.6" />
                      <circle cx="160" cy="18" r="1.2" fill="#a78bfa" opacity="0.7" />
                      {/* Interference wavy line */}
                      <path
                        d="M 5,22 Q 45,5 90,24 T 175,20"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="1.2"
                        strokeDasharray="4,2"
                        opacity="0.6"
                      />
                      <path
                        d="M 10,28 Q 50,38 100,16 T 170,26"
                        fill="none"
                        stroke="#6ee7b7"
                        strokeWidth="1"
                        opacity="0.4"
                      />
                    </svg>

                    {/* Styled & Distorted Captcha Characters */}
                    <div className="relative z-10 flex items-center justify-center gap-1.5 px-3">
                      {captchaCode.split('').map((char, index) => {
                        const rotations = [-10, 8, -6, 12, -9, 7];
                        const colors = [
                          'text-emerald-300',
                          'text-cyan-300',
                          'text-amber-300',
                          'text-teal-300',
                          'text-violet-300',
                          'text-pink-300',
                        ];
                        const fonts = ['font-mono', 'font-sans', 'font-serif'];

                        return (
                          <span
                            key={index}
                            style={{
                              transform: `rotate(${rotations[index % rotations.length]}deg) translateY(${
                                index % 2 === 0 ? '-1px' : '2px'
                              })`,
                              display: 'inline-block',
                            }}
                            className={`text-lg font-black tracking-wider ${
                              colors[index % colors.length]
                            } ${fonts[index % fonts.length]} drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] filter`}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Audio Reader Button */}
                  <button
                    type="button"
                    onClick={playCaptchaAudio}
                    title="Listen to security code"
                    className={`h-11 w-11 shrink-0 rounded-xl border flex items-center justify-center transition-all ${
                      isAudioPlaying
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-950/70 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Volume2 className={`h-4 w-4 ${isAudioPlaying ? 'animate-pulse text-cyan-300' : ''}`} />
                  </button>

                  {/* Refresh Captcha Button */}
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    title="Generate new captcha code"
                    className="h-11 w-11 shrink-0 rounded-xl bg-slate-950/70 border border-slate-700/80 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 flex items-center justify-center transition-all"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshingCaptcha ? 'animate-spin text-emerald-400' : ''}`} />
                  </button>
                </div>

                {/* Captcha Input Box */}
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Shield className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter captcha code shown above"
                    value={userCaptcha}
                    onChange={(e) => {
                      setUserCaptcha(e.target.value.toUpperCase());
                      if (error) setError(null);
                    }}
                    className={`w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950/70 border text-xs text-white placeholder-slate-400 font-mono uppercase tracking-widest font-semibold focus:outline-none focus:ring-1 transition-all ${
                      userCaptcha.length === 6 && userCaptcha === captchaCode
                        ? 'border-emerald-500/80 focus:border-emerald-400 focus:ring-emerald-400/40'
                        : 'border-slate-700/80 focus:border-emerald-400 focus:ring-emerald-400/40'
                    }`}
                  />
                  {userCaptcha.length === 6 && userCaptcha === captchaCode && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400 animate-fadeIn" title="Captcha matched">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>

              {/* Role Selector (Allows entering as Citizen, Hydrologist, or Rescue) */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Access Perspective:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('citizen')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                      selectedRole === 'citizen'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-800/80 text-slate-300 hover:text-white'
                    }`}
                  >
                    Citizen
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('hydrologist')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                      selectedRole === 'hydrologist'
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800/80 text-slate-300 hover:text-white'
                    }`}
                  >
                    Hydrologist
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('rescue')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                      selectedRole === 'rescue'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800/80 text-slate-300 hover:text-white'
                    }`}
                  >
                    Rescue
                  </button>
                </div>
              </div>

              {/* Login Button with Arrow */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Checkbox & Forgot Password */}
              <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert('For password recovery, please contact SDMA Command: 1070 or select one of the demo quick links below.')}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </form>

            {/* Quick 1-Click Access for Immediate Testing */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Quick Login:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuickLogin('citizen', 'ramesh_resident')}
                  className="text-emerald-400 hover:underline"
                >
                  Resident
                </button>
                <span>•</span>
                <button
                  onClick={() => handleQuickLogin('hydrologist', 'dr_ananya_cwc')}
                  className="text-cyan-400 hover:underline"
                >
                  Scientist
                </button>
                <span>•</span>
                <button
                  onClick={() => handleQuickLogin('rescue', 'cmdr_vikram_8bn')}
                  className="text-amber-400 hover:underline"
                >
                  NDRF
                </button>
              </div>
            </div>

            {/* Mountain Outline Graphic & Slogan at Bottom of Card */}
            <div className="pt-3 flex flex-col items-center justify-center text-center space-y-1">
              <svg viewBox="0 0 100 20" className="h-4 w-20 text-slate-500 fill-none stroke-current stroke-2">
                <path d="M5,18 L35,5 L50,14 L70,3 L95,18" />
              </svg>
              <span className="text-[9px] tracking-[0.25em] text-slate-400 uppercase font-mono">
                RESILIENT HILLS &nbsp;|&nbsp; SAFER TOMORROW
              </span>
            </div>
          </div>

          {/* THE EXACT YELLOW MOUNTAIN ROAD HAZARD WARNING BOARD AS IN PHOTO */}
          <div className="hidden xl:flex flex-col items-center space-y-3 shrink-0">
            {/* Orange Hill Temple Flag on Pole */}
            <div className="flex flex-col items-center self-end mr-4">
              <div
                className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[22px] border-l-amber-500 filter drop-shadow-md animate-pulse"
                title="Hill Temple Flag"
              />
              <div className="w-1 h-12 bg-slate-700 rounded-full" />
            </div>

            {/* Devanagari Inscription on Stone Wall */}
            <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-[11px] font-bold text-slate-200 text-center font-hindi shadow-lg">
              <span className="block text-amber-300">देवभूमि सुरक्षित रहे</span>
              <span className="block text-[10px] text-slate-300">हम सबका संकल्प</span>
            </div>

            {/* The Iconic Yellow Indian Mountain Hazard Sign */}
            <div className="w-48 bg-amber-400 border-4 border-slate-950 rounded-xl p-3.5 shadow-2xl text-slate-950 font-sans relative">
              {/* Bolt Rivets */}
              <div className="absolute top-1.5 left-1.5 h-1.5 w-1.5 rounded-full bg-slate-900" />
              <div className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-slate-900" />
              <div className="absolute bottom-1.5 left-1.5 h-1.5 w-1.5 rounded-full bg-slate-900" />
              <div className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-slate-900" />

              {/* Mountain Silhouette in Sign */}
              <div className="flex justify-center mb-1">
                <svg viewBox="0 0 60 20" className="h-4 w-12 fill-slate-950">
                  <polygon points="10,18 25,4 40,18" />
                  <polygon points="30,18 45,7 55,18" />
                </svg>
              </div>

              {/* English Big Warning */}
              <div className="text-center font-black tracking-tight leading-tight uppercase text-xs">
                <span className="block text-slate-950 font-extrabold text-[13px]">BE PREPARED</span>
                <span className="block text-slate-950 font-extrabold text-[13px]">BE SAFE</span>
                <span className="block text-slate-950 font-extrabold text-[13px]">BE RESILIENT</span>
              </div>

              {/* Divider */}
              <div className="h-0.5 w-full bg-slate-950 my-2" />

              {/* Hindi Mountain Slogan */}
              <div className="text-center font-bold text-[10px] leading-tight font-hindi text-slate-950">
                <span className="block">पहाड़ हमारी पहचान</span>
                <span className="block">इनकी सुरक्षा</span>
                <span className="block">हमारी जिम्मेदारी</span>
              </div>
            </div>

            {/* Black-and-Yellow Mountain Road Curb Barrier */}
            <div className="w-48 h-3.5 rounded-sm flex overflow-hidden border border-slate-950 shadow-md">
              <div className="flex-1 bg-amber-400" />
              <div className="flex-1 bg-slate-950" />
              <div className="flex-1 bg-amber-400" />
              <div className="flex-1 bg-slate-950" />
              <div className="flex-1 bg-amber-400" />
              <div className="flex-1 bg-slate-950" />
            </div>
          </div>
        </div>
      </main>

      {/* 4. BOTTOM DARK FOOTER BAR WITH 5 PILLARS & QUOTE */}
      <footer className="relative z-20 w-full bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 py-3.5 px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Left 5 Pillars with Icons */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-7 text-slate-300">
          {/* 1. Our Mountains */}
          <div className="flex items-center gap-2">
            <Mountain className="h-4 w-4 text-emerald-400 shrink-0" />
            <div className="leading-tight text-[10px] uppercase font-semibold">
              <span className="block text-white">OUR MOUNTAINS</span>
              <span className="block text-slate-400">OUR RESPONSIBILITY</span>
            </div>
          </div>

          {/* 2. People Safe */}
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-emerald-400 shrink-0" />
            <div className="leading-tight text-[10px] uppercase font-semibold">
              <span className="block text-white">PEOPLE</span>
              <span className="block text-slate-400">SAFE</span>
            </div>
          </div>

          {/* 3. Environment Protected */}
          <div className="flex items-center gap-2">
            <TreePine className="h-4 w-4 text-emerald-400 shrink-0" />
            <div className="leading-tight text-[10px] uppercase font-semibold">
              <span className="block text-white">ENVIRONMENT</span>
              <span className="block text-slate-400">PROTECTED</span>
            </div>
          </div>

          {/* 4. Communities Empowered */}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-400 shrink-0" />
            <div className="leading-tight text-[10px] uppercase font-semibold">
              <span className="block text-white">COMMUNITIES</span>
              <span className="block text-slate-400">EMPOWERED</span>
            </div>
          </div>

          {/* 5. A Disaster Resilient India */}
          <div className="flex items-center gap-2">
            {/* India Map / Chakra Icon */}
            <div className="h-4 w-4 rounded-full border border-cyan-400 flex items-center justify-center shrink-0">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </div>
            <div className="leading-tight text-[10px] uppercase font-semibold">
              <span className="block text-white">A DISASTER RESILIENT</span>
              <span className="block text-slate-400">INDIA</span>
            </div>
          </div>
        </div>

        {/* Right Italic Script Quote */}
        <div className="text-center md:text-right">
          <span className="text-xs sm:text-sm italic font-serif text-slate-200 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            “Preparedness today for a safer tomorrow”
          </span>
        </div>
      </footer>

      {/* Informational Modal for About / Features / Resources / Contact */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>{activeModal} — Flash Flood Early Warning System</span>
              </h4>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              {activeModal === 'About' && (
                <p>
                  The National Flash Flood Early Warning System for Hilly Regions is developed under the auspices of the Ministry of Home Affairs, Central Water Commission, and NDMA. It models steep terrain hydrodynamics, cloudburst torrents, and debris flow susceptibility to safeguard mountainous communities across Uttarakhand, Himachal Pradesh, the Western Ghats, and the Northeast.
                </p>
              )}
              {activeModal === 'Features' && (
                <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                  <li>Real-time Doppler radar & IMD rain assimilation</li>
                  <li>SRTM 30m Digital Elevation Model slope modeling</li>
                  <li>NASA SMAP volumetric soil moisture saturation tracking</li>
                  <li>AI neural flood wave routing & surge arrival ETA calculation</li>
                  <li>Evacuation shelter routing & NDRF battalion dispatching</li>
                </ul>
              )}
              {activeModal === 'Resources' && (
                <p>
                  Access public safety guidelines, disaster survival manuals, flood hazard zoning maps, and real-time river stage feeds for all major mountain basins.
                </p>
              )}
              {activeModal === 'Contact' && (
                <div className="space-y-1">
                  <p>National Emergency Number: <strong className="text-emerald-400">112</strong></p>
                  <p>NDMA Disaster Helpline: <strong className="text-emerald-400">1078</strong></p>
                  <p>State Disaster Control Room: <strong className="text-emerald-400">1070</strong></p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
