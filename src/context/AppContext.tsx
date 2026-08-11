import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Platform,
  Order,
  Issue,
  AuditLogEntry,
  AppNotification,
  PlatformId,
  ActionStep,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_PLATFORMS,
  INITIAL_ORDERS,
  INITIAL_ISSUES,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  DEMO_SCENARIOS,
} from '../data/mockData';
import { resolveIssueWithAI } from '../services/api';
import { sendToDiscord } from '../services/escalation';
import {
  auth,
  db,
  signInWithGoogle,
  signInWithEmail,
  logoutFirebase,
  testConnection,
  handleFirestoreError,
  OperationType,
} from '../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

interface AppContextType {
  currentUser: UserProfile;
  firebaseUser: User | null;
  platforms: Platform[];
  orders: Order[];
  issues: Issue[];
  auditLogs: AuditLogEntry[];
  notifications: AppNotification[];
  activeIssue: Issue | null;
  activePage: string;
  isLoggedIn: boolean;
  activeFilterPlatform: string;
  searchQuery: string;
  isProcessingAI: boolean;
  processingStepIndex: number;
  navigate: (page: string) => void;
  setActiveIssue: (issue: Issue | null) => void;
  setActiveFilterPlatform: (platform: string) => void;
  setSearchQuery: (query: string) => void;
  connectPlatform: (platformId: PlatformId) => Promise<void>;
  disconnectPlatform: (platformId: PlatformId) => Promise<void>;
  submitIssue: (params: {
    description: string;
    platform?: PlatformId;
    orderId?: string;
    demoScenarioId?: string;
  }) => Promise<Issue>;
  escalateIssue: (issueId: string, reason: string) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  updateSettings: (newSettings: Partial<UserProfile>) => void;
  loginAsDemo: () => void;
  loginWithGoogleProvider: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  resetToInitialData: () => void;
  triggerDemoScenario: (scenarioId: string) => Promise<void>;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  // Load initial state from LocalStorage or mockData
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('resolvehub_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [platforms, setPlatforms] = useState<Platform[]>(() => {
    const saved = localStorage.getItem('resolvehub_platforms');
    return saved ? JSON.parse(saved) : INITIAL_PLATFORMS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('resolvehub_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [issues, setIssues] = useState<Issue[]>(() => {
    const saved = localStorage.getItem('resolvehub_issues');
    return saved ? JSON.parse(saved) : INITIAL_ISSUES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('resolvehub_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('resolvehub_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [activeFilterPlatform, setActiveFilterPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isProcessingAI, setIsProcessingAI] = useState<boolean>(false);
  const [processingStepIndex, setProcessingStepIndex] = useState<number>(0);

  // Theme State ('dark' | 'light')
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('resolvehub_theme');
    return savedTheme === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('resolvehub_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
  };

  // Test Firestore Connection on App Init
  useEffect(() => {
    testConnection();
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        setIsLoggedIn(true);
        const isGoogle = user.providerData?.some((p) => p.providerId.includes('google'));
        const userProfile: UserProfile = {
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'Hrithik',
          email: user.email || 'hrithikrocks124@gmail.com',
          photoURL: user.photoURL || undefined,
          authProvider: isGoogle ? 'google' : 'email',
          connectedPlatformsCount: 4,
          autoRefundThreshold: 1000,
          notificationsEnabled: true,
          autoExecuteEnabled: true,
          humanEscalationEnabled: true,
        };

        // Sync or fetch profile from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setCurrentUser({ ...userProfile, ...snap.data() });
          } else {
            await setDoc(userDocRef, userProfile);
            setCurrentUser(userProfile);
          }
        } catch (error) {
          console.warn('Firestore User Sync Notice:', error);
          setCurrentUser(userProfile);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('resolvehub_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('resolvehub_platforms', JSON.stringify(platforms));
  }, [platforms]);

  useEffect(() => {
    localStorage.setItem('resolvehub_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('resolvehub_issues', JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem('resolvehub_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('resolvehub_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const navigate = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginAsDemo = () => {
    setIsLoggedIn(true);
    setActivePage('dashboard');
  };

  const loginWithGoogleProvider = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        setIsLoggedIn(true);
        setActivePage('dashboard');
      }
    } catch (error: any) {
      if (
        error?.code === 'auth/popup-closed-by-user' ||
        error?.code === 'auth/cancelled-popup-request' ||
        error?.code === 'auth/popup-blocked'
      ) {
        return;
      }
      console.warn('Google Auth notice, switching to demo mode:', error?.message || error);
      loginAsDemo();
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      const user = await signInWithEmail(email, pass);
      if (user) {
        setIsLoggedIn(true);
        setActivePage('dashboard');
      }
    } catch (error: any) {
      console.warn('Email auth notice, falling back to instant access:', error);
      loginAsDemo();
    }
  };

  const logout = async () => {
    try {
      await logoutFirebase();
    } catch (error) {
      console.error('Sign-out error:', error);
    }
    setIsLoggedIn(false);
    setActivePage('landing');
  };

  const resetToInitialData = () => {
    setCurrentUser(INITIAL_USER);
    setPlatforms(INITIAL_PLATFORMS);
    setOrders(INITIAL_ORDERS);
    setIssues(INITIAL_ISSUES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveIssue(null);
    localStorage.clear();
  };

  const connectPlatform = async (platformId: PlatformId) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.platformId === platformId
          ? {
              ...p,
              connected: true,
              syncStatus: 'Synced',
              lastSynced: 'Just now',
              orderCount: p.orderCount || 12,
            }
          : p
      )
    );

    // Add Audit log entry
    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: 'USER',
      action: `Connected ${platformId.toUpperCase()} platform via OAuth simulation`,
      status: 'success',
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Add notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: `${platformId.toUpperCase()} Connected`,
      message: `Successfully connected ${platformId.toUpperCase()}. Imported orders & payments.`,
      type: 'success',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const disconnectPlatform = async (platformId: PlatformId) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.platformId === platformId
          ? { ...p, connected: false, syncStatus: 'Disconnected', lastSynced: 'Never' }
          : p
      )
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updateSettings = (newSettings: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...newSettings }));
  };

  // Autonomous Issue Resolution Orchestration with Animated Tool Execution!
  const submitIssue = async (params: {
    description: string;
    platform?: PlatformId;
    orderId?: string;
    demoScenarioId?: string;
  }): Promise<Issue> => {
    setIsProcessingAI(true);
    setProcessingStepIndex(0);

    const issueId = `ISS-${Math.floor(1000 + Math.random() * 9000)}`;

    // Initial draft issue
    const newIssue: Issue = {
      issueId,
      userId: currentUser.id,
      platform: params.platform || 'swiggy',
      orderId: params.orderId,
      description: params.description,
      issueType: 'other',
      status: 'investigating',
      confidence: 0,
      createdAt: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      actions: [
        {
          actionId: `act_1_${Date.now()}`,
          issueId,
          stepName: 'Understand issue',
          description: 'Analyzing natural language complaint...',
          tool: 'intentClassification',
          status: 'running',
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    };

    setActiveIssue(newIssue);
    setIssues((prev) => [newIssue, ...prev]);

    // Call server API (with Gemini AI)
    const aiData = await resolveIssueWithAI({
      prompt: params.description,
      platformHint: params.platform,
      orderIdHint: params.orderId,
    });

    // Simulate animated step-by-step tool execution for realistic AI agent UX
    const serverSteps = aiData?.steps || [
      { stepName: 'Understand issue', description: 'Complaint analyzed', tool: 'intentClassification', status: 'completed' },
      { stepName: 'Identify platform', description: `Matched platform: ${aiData?.platform || 'Swiggy'}`, tool: 'getConnectedPlatforms', status: 'completed' },
      { stepName: 'Find order', description: `Matched order #${aiData?.orderId || 'SWG-1284'}`, tool: 'getOrderDetails', status: 'completed' },
      { stepName: 'Inspect order', description: 'Verified details and line items', tool: 'inspectOrder', status: 'completed' },
      { stepName: 'Check policy', description: 'Policy check passed', tool: 'checkResolutionPolicy', status: 'completed' },
      { stepName: 'Calculate resolution', description: `Resolution calculated: ₹${aiData?.amount || 60}`, tool: 'calculateRefund', status: 'completed' },
      { stepName: 'Execute action', description: `Executed ${aiData?.recommendedAction || 'refund'}`, tool: 'initiateRefund', status: 'completed' },
      { stepName: 'Verify result', description: 'Verified via Gateway API', tool: 'verifyAction', status: 'completed' },
      { stepName: 'Notify customer', description: 'Customer notification dispatched', tool: 'sendCustomerNotification', status: 'completed' },
    ];

    const mappedActions: ActionStep[] = serverSteps.map((s: any, idx: number) => ({
      actionId: `act_${idx}_${Date.now()}`,
      issueId,
      stepName: s.stepName,
      description: s.description,
      tool: s.tool || 'systemTool',
      status: 'completed',
      timestamp: new Date().toLocaleTimeString(),
    }));

    // Step-by-step progress timer with live state update for realistic UI feedback
    for (let i = 0; i < mappedActions.length; i++) {
      setProcessingStepIndex(i);

      // Build live step statuses: prior steps completed, current step running, upcoming steps pending
      const liveActions: ActionStep[] = mappedActions.map((act, idx) => ({
        ...act,
        status: idx < i ? (serverSteps[idx]?.status || 'completed') : idx === i ? 'running' : 'pending',
      }));

      const partialIssue: Issue = {
        ...newIssue,
        platform: aiData?.platform || params.platform || 'swiggy',
        orderId: aiData?.orderId || params.orderId || 'SWG-1284',
        issueType: aiData?.issueType || 'missing_item',
        confidence: Math.round(((i + 1) / mappedActions.length) * (aiData?.confidence || 95)),
        actions: liveActions,
      };

      setActiveIssue(partialIssue);
      setIssues((prev) => prev.map((iss) => (iss.issueId === issueId ? partialIssue : iss)));

      await new Promise((r) => setTimeout(r, 400));
    }

    const finalStatus = aiData?.requiresHuman ? 'escalated' : 'resolved';
    const finalResolution =
      aiData?.explanation ||
      (aiData?.recommendedAction === 'refund'
        ? `Refund of ₹${aiData?.amount || 60} successfully issued to original account.`
        : aiData?.recommendedAction === 'replacement'
        ? 'Doorstep replacement approved & pickup scheduled.'
        : 'Escalated to Priority Support.');

    const finalActions: ActionStep[] = mappedActions.map((s, idx) => ({
      ...s,
      status: serverSteps[idx]?.status || 'completed',
    }));

    const updatedIssue: Issue = {
      ...newIssue,
      platform: aiData?.platform || params.platform || 'swiggy',
      orderId: aiData?.orderId || params.orderId || 'SWG-1284',
      issueType: aiData?.issueType || 'missing_item',
      status: finalStatus,
      resolution: finalResolution,
      confidence: aiData?.confidence || 95,
      confidenceBreakdown: aiData?.confidenceBreakdown || {
        classification: 98,
        orderId: 96,
        policy: 92,
        decision: 94,
      },
      refundAmount: aiData?.amount || 60,
      requiresHuman: aiData?.requiresHuman || false,
      escalationReason: aiData?.escalationReason,
      escalationTicket: aiData?.requiresHuman ? `RH-${Math.floor(10000 + Math.random() * 90000)}` : undefined,
      resolvedAt: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      actions: finalActions,
    };

    setActiveIssue(updatedIssue);
    setIssues((prev) => prev.map((i) => (i.issueId === issueId ? updatedIssue : i)));

    // Update order payment status if refund/replacement
    if (updatedIssue.orderId) {
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === updatedIssue.orderId
            ? {
                ...o,
                paymentStatus: updatedIssue.refundAmount
                  ? 'Refunded'
                  : updatedIssue.status === 'resolved'
                  ? 'Resolution Approved'
                  : o.paymentStatus,
              }
            : o
        )
      );
    }

    // Generate comprehensive step-by-step Audit Logs for full technical transparency
    const stepLogs: AuditLogEntry[] = finalActions.map((step, idx) => ({
      id: `log_step_${idx}_${Date.now()}`,
      issueId,
      timestamp: new Date().toLocaleTimeString(),
      actor: idx === 0 ? 'GEMINI' : 'TOOL',
      action: `${step.tool}: ${step.stepName}`,
      input: idx === 0 ? `"${params.description}"` : `Target Order #${updatedIssue.orderId || 'N/A'}`,
      output: step.description,
      status: step.status === 'warning' ? 'warning' : step.status === 'failed' ? 'error' : 'success',
    }));

    const userInitialLog: AuditLogEntry = {
      id: `log_usr_${Date.now()}`,
      issueId,
      timestamp: new Date().toLocaleTimeString(),
      actor: 'USER',
      action: 'Submitted customer complaint',
      input: `"${params.description}"`,
      status: 'info',
    };

    const finalSummaryLog: AuditLogEntry = {
      id: `log_summary_${Date.now()}`,
      issueId,
      timestamp: new Date().toLocaleTimeString(),
      actor: 'SYSTEM',
      action: `Final Resolution Outcome: ${finalStatus.toUpperCase()}`,
      output: updatedIssue.resolution,
      status: finalStatus === 'resolved' ? 'success' : 'warning',
    };

    setAuditLogs((prev) => [userInitialLog, ...stepLogs, finalSummaryLog, ...prev]);

    // Add notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: finalStatus === 'resolved' ? 'Issue Resolved' : 'Issue Escalated',
      message: updatedIssue.resolution || '',
      type: finalStatus === 'resolved' ? 'success' : 'warning',
      timestamp: 'Just now',
      read: false,
      issueId,
      amount: updatedIssue.refundAmount,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Dispatch to Discord Webhook if escalation or manual activity is required
    if (updatedIssue.requiresHuman || updatedIssue.status === 'escalated') {
      sendToDiscord({
        ticketNumber: updatedIssue.escalationTicket || `RH-${Math.floor(10000 + Math.random() * 90000)}`,
        orderId: updatedIssue.orderId || 'N/A',
        platform: updatedIssue.platform,
        issueType: updatedIssue.issueType,
        reason: updatedIssue.escalationReason || 'High Financial Risk (Amount >= ₹5,000) or manual investigation required.',
        prompt: params.description,
        amount: updatedIssue.refundAmount,
        confidence: updatedIssue.confidence,
      }).catch((err) => console.warn('Discord webhook post error during submission:', err));
    }

    setIsProcessingAI(false);
    return updatedIssue;
  };

  const triggerDemoScenario = async (scenarioId: string) => {
    const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;

    setActivePage('resolution_center');
    await submitIssue({
      description: scenario.query,
      platform: scenario.platform,
      orderId: scenario.orderId,
      demoScenarioId: scenario.id,
    });
  };

  const escalateIssue = (issueId: string, reason: string) => {
    const ticket = `RH-${Math.floor(10000 + Math.random() * 90000)}`;
    const targetIssue = issues.find((i) => i.issueId === issueId);

    setIssues((prev) =>
      prev.map((i) =>
        i.issueId === issueId
          ? {
              ...i,
              status: 'escalated',
              requiresHuman: true,
              escalationReason: reason,
              escalationTicket: ticket,
              resolution: `Case escalated to Priority Human Support via Discord Webhook (Ticket #${ticket}). Reason: ${reason}`,
            }
          : i
      )
    );

    if (activeIssue && activeIssue.issueId === issueId) {
      setActiveIssue((prev) =>
        prev
          ? {
              ...prev,
              status: 'escalated',
              requiresHuman: true,
              escalationReason: reason,
              escalationTicket: ticket,
              resolution: `Case escalated to Priority Human Support via Discord Webhook (Ticket #${ticket}). Reason: ${reason}`,
            }
          : null
      );
    }

    // Post live escalation alert to Discord Webhook
    sendToDiscord({
      ticketNumber: ticket,
      orderId: targetIssue?.orderId || 'N/A',
      platform: targetIssue?.platform || 'ResolveHub',
      issueType: targetIssue?.issueType || 'High Risk / Manual Review',
      reason,
      prompt: targetIssue?.description,
      amount: targetIssue?.amount,
      confidence: targetIssue?.confidenceScore,
    }).catch((err) => console.warn('Discord webhook post error:', err));

    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: 'Escalated to Discord',
      message: `Ticket #${ticket} created & posted to Discord Webhook for manual activity.`,
      type: 'warning',
      timestamp: 'Just now',
      read: false,
      issueId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        firebaseUser,
        platforms,
        orders,
        issues,
        auditLogs,
        notifications,
        activeIssue,
        activePage,
        isLoggedIn,
        activeFilterPlatform,
        searchQuery,
        isProcessingAI,
        processingStepIndex,
        navigate,
        setActiveIssue,
        setActiveFilterPlatform,
        setSearchQuery,
        connectPlatform,
        disconnectPlatform,
        submitIssue,
        escalateIssue,
        markNotificationRead,
        clearNotifications,
        updateSettings,
        loginAsDemo,
        loginWithGoogleProvider,
        loginWithEmail,
        logout,
        resetToInitialData,
        triggerDemoScenario,
        theme,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
