import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useToast } from './Toast';
import { onProductsChanged, onTicketsChanged, updateTicketStatus, createOrUpdateProduct, deleteProduct, onOrdersChanged, updateOrderStatus, onContactMessagesChanged, onMessagesChanged, deleteCommunityMessage, deleteContactMessage, getAdminPassword, setAdminPassword, setUserAdmin, onCoursesChanged, onJobsChanged, createOrUpdateCourse, createOrUpdateJob, deleteCourse, deleteJob, Course, Job, onMedicalRecordsChanged, onSOSRecordsChanged, onAllMedicalRecordsChanged, onAllSOSRecordsChanged, MedicalRecord, SOSRecord, updateSOSRecord, deleteMedicalRecord, deleteSOSRecord } from '../services/firestore';
import { KaderLogo } from './icons/KaderLogo';
import { uploadFile } from '../services/storage';

const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [contactMsgs, setContactMsgs] = useState<any[]>([]);
  const [communityMsgs, setCommunityMsgs] = useState<any[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [sosRecords, setSOSRecords] = useState<SOSRecord[]>([]);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState('');
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: string; name: string } | null>(null);

  useEffect(() => {
    const offTickets = onTicketsChanged(items => setTickets(items));
    const offProducts = onProductsChanged(items => setProducts(items));
    const offOrders = onOrdersChanged(items => setOrders(items));
    const offContact = onContactMessagesChanged(items => setContactMsgs(items));
    const offCommunity = onMessagesChanged(items => setCommunityMsgs(items));
    const offCourses = onCoursesChanged(items => setCourses(items));
    const offJobs = onJobsChanged(items => setJobs(items));
    const offMedical = onAllMedicalRecordsChanged((items) => setMedicalRecords(items));
    const offSOS = onAllSOSRecordsChanged((items) => setSOSRecords(items));
    return () => {
      offTickets(); offProducts(); offOrders(); offContact(); offCommunity(); offCourses(); offJobs(); offMedical?.(); offSOS?.();
    };
  }, []);

  const markClosed = async (id: string) => {
    await updateTicketStatus(id, 'closed');
    toast?.push('Ticket closed');
  };

  const markProcessing = async (id: string) => {
    await updateTicketStatus(id, 'in-progress');
    toast?.push('Ticket marked as in-progress');
  };

  const removeProduct = async (id: string) => {
    const product = products.find(p => p.id === id);
    handleDeleteWithConfirm('product', id, product?.title || 'Product');
  };

  const removeCommunity = async (id: string) => {
    handleDeleteWithConfirm('community', id, 'Community message');
  };

  const removeContact = async (id: string) => {
    handleDeleteWithConfirm('contact', id, 'Contact message');
  };

  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await createOrUpdateProduct({ title, description, price, stock, image } as any);
      toast?.push('Product added successfully!');
      setTitle(''); setDescription(''); setPrice(0); setStock(0); setImage('');
    } catch (err) {
      console.error('create product failed', err);
      toast?.push('Failed to add product');
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (p: any) => {
    setEditingProduct(p);
    setTitle(p.title || ''); setDescription(p.description || ''); setPrice(p.price || 0); setStock(p.stock || 0); setImage(p.base64Image || p.image || '');
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setAdding(true);
    try {
      await createOrUpdateProduct({ id: editingProduct.id, title, description, price, stock, image } as any);
      toast?.push('Product updated successfully!');
      setEditingProduct(null);
      setTitle(''); setDescription(''); setPrice(0); setStock(0); setImage('');
    } catch (err) {
      console.error('edit failed', err);
      toast?.push('Failed to update product');
    } finally {
      setAdding(false);
    }
  };

  const [activeTab, setActiveTab] = useState<'dashboard'|'products'|'tickets'|'orders'|'contact'|'community'|'courses'|'jobs'|'medical'|'sos'>('dashboard');
  const [unlocked, setUnlocked] = useState<boolean>(() => !!sessionStorage.getItem('admin_unlocked'));
  const [passwordInput, setPasswordInput] = useState('');

  const handleOrderAction = async (id: string, status: any) => {
    await updateOrderStatus(id, status);
    toast?.push(`Order marked as ${status}`);
  };

  const tryUnlock = async () => {
    const pwd = await getAdminPassword();
    if (!pwd) { alert('No admin password set. Please set it in Firestore admin_pass collection.'); return; }
    if (passwordInput === pwd) {
      sessionStorage.setItem('admin_unlocked', '1');
      setUnlocked(true);
      setPasswordInput('');
      toast?.push('Admin access granted');
    } else {
      toast?.push('Incorrect password');
    }
  };

  const { user } = useAuth();
  const toast = useToast();

  const handleSetAdminPassword = async () => {
    if (!passwordInput) return toast?.push('Enter a password');
    await setAdminPassword(passwordInput);
    toast?.push('Admin password saved to Firestore');
    setPasswordInput('');
  };

  const handleMakeMeAdmin = async () => {
    if (!user) return toast?.push('Sign in first');
    await setUserAdmin(user.uid, true);
    toast?.push('You are now an admin');
    sessionStorage.setItem('admin_unlocked', '1');
    setUnlocked(true);
  };

  const removeCourse = async (id: string) => {
    const course = courses.find(c => c.id === id);
    handleDeleteWithConfirm('course', id, course?.title || 'Course');
  };

  const removeJob = async (id: string) => {
    const job = jobs.find(j => j.id === id);
    handleDeleteWithConfirm('job', id, job?.title || 'Job');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        toast?.push('Image loaded successfully');
      };
      reader.onerror = () => {
        console.error('File read failed');
        toast?.push('Failed to read image file');
      };
      reader.readAsDataURL(file);
      e.target.value = ''; // reset input
    } catch (err) {
      console.error('Image loading failed:', err);
      toast?.push('Failed to load image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteWithConfirm = (type: string, id: string, name: string) => {
    setConfirmDelete({ type, id, name });
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    
    try {
      switch (confirmDelete.type) {
        case 'product':
          await deleteProduct(confirmDelete.id);
          toast?.push('Product deleted successfully');
          break;
        case 'course':
          await deleteCourse(confirmDelete.id);
          toast?.push('Course deleted successfully');
          setEditingCourse(null);
          break;
        case 'job':
          await deleteJob(confirmDelete.id);
          toast?.push('Job deleted successfully');
          setEditingJob(null);
          break;
        case 'community':
          await deleteCommunityMessage(confirmDelete.id);
          toast?.push('Community message deleted successfully');
          break;
        case 'contact':
          await deleteContactMessage(confirmDelete.id);
          toast?.push('Contact message deleted successfully');
          break;
      }
    } catch (err) {
      console.error('Delete failed:', err);
      toast?.push('Failed to delete item');
    } finally {
      setConfirmDelete(null);
    }
  };

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    openTickets: tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    communityMessages: communityMsgs.length,
    contactMessages: contactMsgs.length,
    totalCourses: courses.length,
    totalJobs: jobs.length,
    totalMedicalRecords: medicalRecords.length,
    criticalMedical: medicalRecords.filter(r => r.severity === 'Critical').length,
    highMedical: medicalRecords.filter(r => r.severity === 'High').length,
    totalSOSAlerts: sosRecords.length,
    pendingSOSAlerts: sosRecords.filter(r => r.status === 'Pending').length,
    respondedSOSAlerts: sosRecords.filter(r => r.status === 'Responded').length,
    resolvedSOSAlerts: sosRecords.filter(r => r.status === 'Resolved').length,
    criticalSOSAlerts: sosRecords.filter(r => r.priority === 'Critical').length,
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative p-4 bg-gradient-to-br from-red-500 to-orange-600 rounded-full">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white text-center mb-2">Admin Access</h2>
            <p className="text-gray-300 text-center mb-8">Enter your admin password to continue</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && tryUnlock()}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              <button
                onClick={tryUnlock}
                className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Unlock Dashboard
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-gray-400">Development Options</span>
                </div>
              </div>

              <button
                onClick={handleMakeMeAdmin}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium py-2 rounded-lg transition-all duration-300"
              >
                Make Me Admin (Dev)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg border-b border-white/10 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-lg opacity-50"></div>
                <div className="relative p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl">
                  <KaderLogo className="h-10" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-gray-400">Manage your platform in real-time</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Admin Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in space-y-8">
            {/* Core Metrics */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">📊 Core Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
                  title="Total Products"
                  value={stats.totalProducts}
                  color="blue"
                  trend="+12%"
                />
                <StatCard
                  icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                  title="Total Orders"
                  value={stats.totalOrders}
                  color="green"
                  subtitle={`${stats.pendingOrders} pending`}
                />
                <StatCard
                  icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                  title="Open Tickets"
                  value={stats.openTickets}
                  color="yellow"
                  subtitle={`of ${tickets.length} total`}
                />
                <StatCard
                  icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  title="Total Revenue"
                  value={`$${stats.totalRevenue.toFixed(2)}`}
                  color="purple"
                  trend="+23%"
                />
              </div>
            </div>

            {/* Healthcare Metrics */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">🏥 Healthcare System</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon="📋"
                  title="Medical Records"
                  value={stats.totalMedicalRecords}
                  color="blue"
                />
                <StatCard
                  icon="🔴"
                  title="Critical Medical"
                  value={stats.criticalMedical}
                  color="red"
                  subtitle="Needs immediate attention"
                />
                <StatCard
                  icon="🚨"
                  title="SOS Alerts"
                  value={stats.totalSOSAlerts}
                  color="orange"
                />
                <StatCard
                  icon="🚨"
                  title="Pending SOS"
                  value={stats.pendingSOSAlerts}
                  color="red"
                  subtitle="Awaiting response"
                />
              </div>
            </div>

            {/* Content Metrics */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">📚 Content & Community</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon="📚"
                  title="Total Courses"
                  value={stats.totalCourses}
                  color="indigo"
                />
                <StatCard
                  icon="💼"
                  title="Total Jobs"
                  value={stats.totalJobs}
                  color="cyan"
                />
                <StatCard
                  icon="💬"
                  title="Community Messages"
                  value={stats.communityMessages}
                  color="green"
                />
                <StatCard
                  icon="✉️"
                  title="Contact Messages"
                  value={stats.contactMessages}
                  color="blue"
                />
              </div>
            </div>

            {/* Status Breakdown Charts */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">📈 Status Distribution</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">SOS Alert Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-gray-300">Pending</span>
                      </div>
                      <span className="text-white font-bold">{stats.pendingSOSAlerts}</span>
                    </div>
                    <div className="w-full bg-red-500/20 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${stats.totalSOSAlerts > 0 ? (stats.pendingSOSAlerts / stats.totalSOSAlerts) * 100 : 0}%` }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-300">Responded</span>
                      </div>
                      <span className="text-white font-bold">{stats.respondedSOSAlerts}</span>
                    </div>
                    <div className="w-full bg-blue-500/20 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats.totalSOSAlerts > 0 ? (stats.respondedSOSAlerts / stats.totalSOSAlerts) * 100 : 0}%` }}></div>
                    </div>

                    <div className="flex items-center justify-between pt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-300">Resolved</span>
                      </div>
                      <span className="text-white font-bold">{stats.resolvedSOSAlerts}</span>
                    </div>
                    <div className="w-full bg-green-500/20 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.totalSOSAlerts > 0 ? (stats.resolvedSOSAlerts / stats.totalSOSAlerts) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Medical Records Severity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-gray-300">Critical</span>
                      </div>
                      <span className="text-white font-bold">{stats.criticalMedical}</span>
                    </div>
                    <div className="w-full bg-red-500/20 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${stats.totalMedicalRecords > 0 ? (stats.criticalMedical / stats.totalMedicalRecords) * 100 : 0}%` }}></div>
                    </div>

                    <div className="flex items-center justify-between pt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-300">High</span>
                      </div>
                      <span className="text-white font-bold">{stats.highMedical}</span>
                    </div>
                    <div className="w-full bg-orange-500/20 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${stats.totalMedicalRecords > 0 ? (stats.highMedical / stats.totalMedicalRecords) * 100 : 0}%` }}></div>
                    </div>

                    <div className="flex items-center justify-between pt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-300">Medium</span>
                      </div>
                      <span className="text-white font-bold">{stats.totalMedicalRecords - stats.criticalMedical - stats.highMedical}</span>
                    </div>
                    <div className="w-full bg-yellow-500/20 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${stats.totalMedicalRecords > 0 ? ((stats.totalMedicalRecords - stats.criticalMedical - stats.highMedical) / stats.totalMedicalRecords) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="mb-8 animate-fade-in-delay">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2 border border-white/10">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'products', label: 'Products', icon: '🛍️', count: products.length },
                { id: 'courses', label: 'Courses', icon: '📚', count: courses.length },
                { id: 'jobs', label: 'Jobs', icon: '💼', count: jobs.length },
                { id: 'medical', label: 'Medical Records', icon: '🏥', count: medicalRecords.length },
                { id: 'sos', label: 'SOS Alerts', icon: '🚨', count: sosRecords.filter(r => r.status === 'Pending').length },
                { id: 'tickets', label: 'Tickets', icon: '🎫', count: tickets.length },
                { id: 'orders', label: 'Orders', icon: '📦', count: orders.length },
                { id: 'contact', label: 'Contact', icon: '✉️', count: contactMsgs.length },
                { id: 'community', label: 'Community', icon: '💬', count: communityMsgs.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg shadow-red-500/30'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab.id ? 'bg-white/20' : 'bg-white/10'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in-delay-2">
          {activeTab === 'dashboard' && <DashboardOverview stats={stats} tickets={tickets} orders={orders} />}
          {activeTab === 'products' && (
            <ProductsSection
              products={products}
              editingProduct={editingProduct}
              title={title}
              setTitle={setTitle}
              price={price}
              setPrice={setPrice}
              stock={stock}
              setStock={setStock}
              image={image}
              setImage={setImage}
              description={description}
              setDescription={setDescription}
              submitAdd={submitAdd}
              submitEdit={submitEdit}
              adding={adding}
              startEdit={startEdit}
              setEditingProduct={setEditingProduct}
              removeProduct={removeProduct}
            />
          )}
          {activeTab === 'tickets' && <TicketsSection tickets={tickets} markProcessing={markProcessing} markClosed={markClosed} />}
          {activeTab === 'orders' && <OrdersSection orders={orders} handleOrderAction={handleOrderAction} />}
          {activeTab === 'contact' && <ContactSection messages={contactMsgs} removeContact={removeContact} />}
          {activeTab === 'community' && <CommunitySection messages={communityMsgs} removeCommunity={removeCommunity} />}
          {activeTab === 'courses' && (
            <CoursesSection
              courses={courses}
              editingCourse={editingCourse}
              setEditingCourse={setEditingCourse}
              removeCourse={removeCourse}
              toast={toast}
            />
          )}
          {activeTab === 'jobs' && (
            <JobsSection
              jobs={jobs}
              editingJob={editingJob}
              setEditingJob={setEditingJob}
              removeJob={removeJob}
              toast={toast}
            />
          )}
          {activeTab === 'medical' && (
            <MedicalRecordsAdminSection
              records={medicalRecords}
              toast={toast}
              onDelete={async (id) => {
                try {
                  await deleteMedicalRecord(id);
                  toast?.push('Medical record deleted');
                } catch (err) {
                  console.error('Delete failed', err);
                  toast?.push('Failed to delete record');
                }
              }}
            />
          )}
          {activeTab === 'sos' && (
            <SOSRecordsAdminSection
              records={sosRecords}
              toast={toast}
              onUpdate={async (id, status) => {
                try {
                  await updateSOSRecord(id, { status });
                  toast?.push('SOS status updated');
                } catch (err) {
                  console.error('Update failed', err);
                  toast?.push('Failed to update SOS');
                }
              }}
              onDelete={async (id) => {
                try {
                  await deleteSOSRecord(id);
                  toast?.push('SOS record deleted');
                } catch (err) {
                  console.error('Delete failed', err);
                  toast?.push('Failed to delete SOS');
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-red-500/20 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-500/20 rounded-full">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-2">Delete Confirmation</h3>
            <p className="text-gray-300 text-center mb-6">
              Are you sure you want to delete <span className="font-semibold text-red-400">"{confirmDelete.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAction}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg hover:shadow-red-500/50 text-white font-medium rounded-xl transition-all duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; color: string; trend?: string; subtitle?: string }> = ({
  icon, title, value, color, trend, subtitle
}) => {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-cyan-600',
    green: 'from-green-500 to-emerald-600',
    yellow: 'from-yellow-500 to-orange-600',
    purple: 'from-purple-500 to-pink-600',
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          {subtitle && <p className="text-gray-400 text-xs">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-green-400 text-sm font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 bg-gradient-to-br ${colorClasses[color]} rounded-xl text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const DashboardOverview: React.FC<{ stats: any; tickets: any[]; orders: any[] }> = ({ stats, tickets, orders }) => {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Recent Orders
          </h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order, idx) => (
              <div key={order.id} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{order.userEmail}</p>
                    <p className="text-gray-400 text-sm">${order.total}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    order.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Recent Tickets
          </h3>
          <div className="space-y-3">
            {tickets.slice(0, 5).map((ticket, idx) => (
              <div key={ticket.id} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-white font-medium">{ticket.subject}</p>
                    <p className="text-gray-400 text-sm">{ticket.userEmail}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    ticket.status === 'open' ? 'bg-yellow-500/20 text-yellow-400' :
                    ticket.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsSection: React.FC<any> = ({
  products, editingProduct, title, setTitle, price, setPrice, stock, setStock,
  image, setImage, description, setDescription, submitAdd, submitEdit, adding,
  startEdit, setEditingProduct, removeProduct
}) => {
  return (
    <div className="space-y-6">
      {/* Add/Edit Product Form */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h3>
        <form onSubmit={editingProduct ? submitEdit : submitAdd} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Product Title"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
            <input
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              placeholder="Price ($)"
              type="number"
              step="0.01"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
            <input
              value={stock}
              onChange={e => setStock(Number(e.target.value))}
              placeholder="Stock Quantity"
              type="number"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          {/* Image Upload Section */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-300 font-medium mb-2">Product Image (Local File)</label>
              <div className="flex gap-2">
                <label className="flex-1 flex items-center justify-center px-4 py-3 bg-white/5 border-2 border-dashed border-blue-500/30 rounded-xl cursor-pointer hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 text-blue-300 font-medium">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  <span>{uploadingImage ? 'Loading image...' : 'Click to Upload Image'}</span>
                </label>
              </div>
              {image && image.startsWith('data:image') && (
                <div className="mt-3">
                  <p className="text-xs text-green-400 mb-2">✅ Image loaded (stored in base64)</p>
                  <img src={image} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-300 font-medium mb-2">Or enter Image URL (Optional)</label>
              <input
                value={image.startsWith('data:image') ? '' : image}
                onChange={e => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              {image && !image.startsWith('data:image') && image.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">URL will be used as fallback if base64 not available</p>
              )}
            </div>
          </div>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Product Description"
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={adding}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {adding ? 'Processing...' : editingProduct ? 'Update Product' : 'Add Product'}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setTitle(''); setDescription(''); setPrice(0); setStock(0); setImage('');
                }}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium rounded-xl transition-all duration-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p, idx) => (
          <div key={p.id} className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
            {(p.base64Image || p.image) && (
              <div className="h-48 overflow-hidden">
                <img src={p.base64Image || p.image} alt={p.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4">
              <h4 className="text-white font-bold text-lg mb-1">{p.title}</h4>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{p.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-blue-400">${p.price}</span>
                <span className="text-sm text-gray-400">Stock: {p.stock}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(p)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeProduct(p.id)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TicketsSection: React.FC<{ tickets: any[]; markProcessing: (id: string) => void; markClosed: (id: string) => void }> = ({
  tickets, markProcessing, markClosed
}) => {
  return (
    <div className="space-y-4">
      {tickets.map((t, idx) => (
        <div key={t.id} className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-white font-bold text-lg">{t.subject}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  t.status === 'open' ? 'bg-yellow-500/20 text-yellow-400' :
                  t.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {t.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-2">{t.userEmail}</p>
              <p className="text-gray-300">{t.message}</p>
              <p className="text-gray-500 text-xs mt-2">
                {new Date(t.createdAt?.seconds ? t.createdAt.seconds * 1000 : Date.now()).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => markProcessing(t.id)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Mark In Progress
            </button>
            <button
              onClick={() => markClosed(t.id)}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Mark Closed
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const OrdersSection: React.FC<{ orders: any[]; handleOrderAction: (id: string, status: string) => void }> = ({
  orders, handleOrderAction
}) => {
  return (
    <div className="space-y-4">
      {orders.map((o, idx) => (
        <div key={o.id} className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-white font-bold text-xl">${o.total}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  o.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  o.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {o.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-3">{o.userEmail}</p>
              <div className="space-y-1">
                {o.items?.map((it: any, idx: number) => (
                  <div key={idx} className="text-gray-300 text-sm">
                    {it.qty}× {it.productId} — ${it.price}
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-2">
                {new Date(o.createdAt?.seconds ? o.createdAt.seconds * 1000 : Date.now()).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleOrderAction(o.id, 'paid')}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Mark Paid
            </button>
            <button
              onClick={() => handleOrderAction(o.id, 'shipped')}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Mark Shipped
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const ContactSection: React.FC<{ messages: any[]; removeContact: (id: string) => void }> = ({ messages, removeContact }) => {
  return (
    <div className="space-y-4">
      {messages.map((m, idx) => (
        <div key={m.id} className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-white font-semibold mb-1">{m.userEmail}</p>
              <p className="text-gray-300 mb-2">{m.text}</p>
              <p className="text-gray-500 text-xs">
                {new Date(m.createdAt?.seconds ? m.createdAt.seconds * 1000 : Date.now()).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => removeContact(m.id)}
              className="ml-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const CommunitySection: React.FC<{ messages: any[]; removeCommunity: (id: string) => void }> = ({ messages, removeCommunity }) => {
  return (
    <div className="space-y-4">
      {messages.map((m, idx) => (
        <div key={m.id} className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-white font-semibold mb-1">{m.userEmail}</p>
              <p className="text-gray-300 mb-2">{m.text}</p>
              <p className="text-gray-500 text-xs">
                {new Date(m.createdAt?.seconds ? m.createdAt.seconds * 1000 : Date.now()).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => removeCommunity(m.id)}
              className="ml-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const CoursesSection: React.FC<{ courses: Course[]; editingCourse: Course | null; setEditingCourse: (c: Course | null) => void; removeCourse: (id: string) => void; toast: any }> = ({
  courses, editingCourse, setEditingCourse, removeCourse, toast
}) => {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState(0);
  const [enrolled, setEnrolled] = useState(0);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (editingCourse) {
      setTitle(editingCourse.title || '');
      setDescription(editingCourse.description || '');
      setInstructor(editingCourse.instructor || '');
      setDuration(editingCourse.duration || '');
      setLevel(editingCourse.level || 'Beginner');
      setCategory(editingCourse.category || '');
      setImage(editingCourse.image || '');
      setPrice(editingCourse.price || 0);
      setEnrolled(editingCourse.enrolled || 0);
      setRating(editingCourse.rating || 0);
    }
  }, [editingCourse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !instructor.trim() || !duration.trim() || !category.trim()) {
      toast?.push('⚠️ Please fill all required fields');
      return;
    }

    setAdding(true);
    try {
      console.log('Creating/Updating course:', { title, instructor, duration, category });
      await createOrUpdateCourse({
        id: editingCourse?.id,
        title,
        description,
        instructor,
        duration,
        level,
        category,
        image,
        price,
        enrolled,
        rating,
      });
      toast?.push(editingCourse ? '✅ Course updated!' : '✅ Course added!');
      setEditingCourse(null);
      setTitle(''); setDescription(''); setInstructor(''); setDuration(''); setLevel('Beginner');
      setCategory(''); setImage(''); setPrice(0); setEnrolled(0); setRating(0);
    } catch (err: any) {
      console.error('Course save error:', err);
      toast?.push(`❌ Failed: ${err.message || 'Unknown error'}`);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {editingCourse ? 'Edit Course' : 'Add New Course'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Course Title" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300" required />
            <input value={instructor} onChange={e => setInstructor(e.target.value)} placeholder="Instructor Name" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300" required />
            <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration (e.g., 8 weeks)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300" required />
            <select value={level} onChange={e => setLevel(e.target.value as any)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300">
              <option value="Beginner" className="bg-gray-900">Beginner</option>
              <option value="Intermediate" className="bg-gray-900">Intermediate</option>
              <option value="Advanced" className="bg-gray-900">Advanced</option>
            </select>
            <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category (e.g., Web Development)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300" required />
            <input value={image} onChange={e => setImage(e.target.value)} placeholder="Image URL" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300" />
            <input value={price} onChange={e => setPrice(Number(e.target.value))} placeholder="Price ($)" type="number" step="0.01" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300" />
            <input value={enrolled} onChange={e => setEnrolled(Number(e.target.value))} placeholder="Enrolled Students" type="number" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300" />
            <input value={rating} onChange={e => setRating(Number(e.target.value))} placeholder="Rating (0-5)" type="number" step="0.1" min="0" max="5" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300" />
          </div>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Course Description" rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 resize-none" required />
          <div className="flex gap-3">
            <button type="submit" disabled={adding} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 transition-all duration-300 hover:scale-105 active:scale-95">
              {adding ? 'Processing...' : editingCourse ? 'Update Course' : 'Add Course'}
            </button>
            {editingCourse && (
              <button type="button" onClick={() => { setEditingCourse(null); setTitle(''); setDescription(''); setInstructor(''); setDuration(''); setCategory(''); setImage(''); setPrice(0); }} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium rounded-xl transition-all duration-300">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, idx) => (
          <div key={course.id} className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
            {course.image && <div className="h-40 overflow-hidden"><img src={course.image} alt={course.title} className="w-full h-full object-cover" /></div>}
            <div className="p-4">
              <h4 className="text-white font-bold text-lg mb-1">{course.title}</h4>
              <p className="text-cyan-400 text-sm mb-2">{course.instructor}</p>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{course.description}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">{course.level}</span>
                <span className="text-sm text-gray-400">{course.duration}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingCourse(course)} className="flex-1 px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 text-sm">
                  Edit
                </button>
                <button onClick={() => removeCourse(course.id!)} className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 text-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const JobsSection: React.FC<{ jobs: Job[]; editingJob: Job | null; setEditingJob: (j: Job | null) => void; removeJob: (id: string) => void; toast: any }> = ({
  jobs, editingJob, setEditingJob, removeJob, toast
}) => {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<'Full-time' | 'Part-time' | 'Contract' | 'Remote'>('Full-time');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [category, setCategory] = useState('');
  const [posted, setPosted] = useState('');

  useEffect(() => {
    if (editingJob) {
      setTitle(editingJob.title || '');
      setCompany(editingJob.company || '');
      setLocation(editingJob.location || '');
      setType(editingJob.type || 'Full-time');
      setSalary(editingJob.salary || '');
      setDescription(editingJob.description || '');
      setRequirements(editingJob.requirements || '');
      setCategory(editingJob.category || '');
      setPosted(editingJob.posted || '');
    }
  }, [editingJob]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !company.trim() || !location.trim() || !description.trim() || !requirements.trim() || !category.trim()) {
      toast?.push('⚠️ Please fill all required fields');
      return;
    }

    setAdding(true);
    try {
      console.log('Creating/Updating job:', { title, company, location, category });
      await createOrUpdateJob({
        id: editingJob?.id,
        title,
        company,
        location,
        type,
        salary,
        description,
        requirements,
        category,
        posted,
      });
      toast?.push(editingJob ? '✅ Job updated!' : '✅ Job added!');
      setEditingJob(null);
      setTitle(''); setCompany(''); setLocation(''); setType('Full-time');
      setSalary(''); setDescription(''); setRequirements(''); setCategory(''); setPosted('');
    } catch (err: any) {
      console.error('Job save error:', err);
      toast?.push(`❌ Failed: ${err.message || 'Unknown error'}`);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {editingJob ? 'Edit Job' : 'Add New Job'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Job Title" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300" required />
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company Name" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300" required />
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300" required />
            <select value={type} onChange={e => setType(e.target.value as any)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300">
              <option value="Full-time" className="bg-gray-900">Full-time</option>
              <option value="Part-time" className="bg-gray-900">Part-time</option>
              <option value="Contract" className="bg-gray-900">Contract</option>
              <option value="Remote" className="bg-gray-900">Remote</option>
            </select>
            <input value={salary} onChange={e => setSalary(e.target.value)} placeholder="Salary (e.g., $80k-$120k)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300" />
            <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category (e.g., Software Engineering)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300" required />
            <input value={posted} onChange={e => setPosted(e.target.value)} placeholder="Posted (e.g., 2 days ago)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300" />
          </div>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Job Description" rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 resize-none" required />
          <textarea value={requirements} onChange={e => setRequirements(e.target.value)} placeholder="Requirements" rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 resize-none" required />
          <div className="flex gap-3">
            <button type="submit" disabled={adding} className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-green-500/50 disabled:opacity-50 transition-all duration-300 hover:scale-105 active:scale-95">
              {adding ? 'Processing...' : editingJob ? 'Update Job' : 'Add Job'}
            </button>
            {editingJob && (
              <button type="button" onClick={() => { setEditingJob(null); setTitle(''); setCompany(''); setLocation(''); setSalary(''); setDescription(''); setRequirements(''); setCategory(''); }} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium rounded-xl transition-all duration-300">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {jobs.map((job, idx) => (
          <div key={job.id} className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-white font-bold text-lg mb-1">{job.title}</h4>
                <p className="text-green-400 font-semibold">{job.company}</p>
              </div>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">{job.type}</span>
            </div>
            <div className="space-y-1 mb-3 text-sm text-gray-400">
              <div>📍 {job.location}</div>
              {job.salary && <div>💰 {job.salary}</div>}
              <div>🏷️ {job.category}</div>
            </div>
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">{job.description}</p>
            <div className="flex gap-2">
              <button onClick={() => setEditingJob(job)} className="flex-1 px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 text-sm">
                Edit
              </button>
              <button onClick={() => removeJob(job.id!)} className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Medical Records Admin Section
interface MedicalRecordsAdminSectionProps {
  records: MedicalRecord[];
  toast: any;
  onDelete: (id: string) => Promise<void>;
}

const MedicalRecordsAdminSection: React.FC<MedicalRecordsAdminSectionProps> = ({
  records,
  toast,
  onDelete,
}) => {
  const [filter, setFilter] = useState<string>('All');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'High':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredRecords =
    filter === 'All' ? records : records.filter((r) => r.severity === filter);

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Medical Records Overview</h3>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<span className="text-3xl">📊</span>}
            title="Total Records"
            value={records.length}
            color="blue"
          />
          <StatCard
            icon={<span className="text-3xl">🔴</span>}
            title="Critical"
            value={records.filter((r) => r.severity === 'Critical').length}
            color="red"
          />
          <StatCard
            icon={<span className="text-3xl">🟠</span>}
            title="High"
            value={records.filter((r) => r.severity === 'High').length}
            color="orange"
          />
          <StatCard
            icon={<span className="text-3xl">📋</span>}
            title="Users"
            value={new Set(records.map((r) => r.uid)).size}
            color="purple"
          />
        </div>

        <div className="flex gap-2 mb-6">
          {['All', 'Low', 'Medium', 'High', 'Critical'].map((severity) => (
            <button
              key={severity}
              onClick={() => setFilter(severity)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                filter === severity
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {severity}
            </button>
          ))}
        </div>

        {filteredRecords.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg">No medical records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">User Email</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">Title</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">Medical Case</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">Severity</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">Date</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                  >
                    <td className="py-3 px-4 text-gray-300">{record.userEmail}</td>
                    <td className="py-3 px-4 text-white font-medium truncate">{record.title}</td>
                    <td className="py-3 px-4 text-gray-400">{record.medicalCase}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColor(
                          record.severity
                        )}`}
                      >
                        {record.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {record.createdAt
                        ? new Date(
                            (record.createdAt as any).toDate?.() || record.createdAt
                          ).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${record.title}"?`)) {
                            onDelete(record.id || '');
                          }
                        }}
                        className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs font-medium transition-all duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// SOS Records Admin Section
interface SOSRecordsAdminSectionProps {
  records: SOSRecord[];
  toast: any;
  onUpdate: (id: string, status: 'Pending' | 'Responded' | 'Resolved') => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const SOSRecordsAdminSection: React.FC<SOSRecordsAdminSectionProps> = ({
  records,
  toast,
  onUpdate,
  onDelete,
}) => {
  const [filter, setFilter] = useState<string>('All');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'High':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-red-500';
      case 'Responded':
        return 'bg-blue-500';
      case 'Resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredRecords = filter === 'All' ? records : records.filter((r) => r.status === filter);

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
        <h3 className="text-2xl font-bold text-white mb-4">🚨 SOS Emergency Alerts</h3>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<span className="text-3xl">📊</span>}
            title="Total Alerts"
            value={records.length}
            color="blue"
          />
          <StatCard
            icon={<span className="text-3xl">🚨</span>}
            title="Pending"
            value={records.filter((r) => r.status === 'Pending').length}
            color="red"
          />
          <StatCard
            icon={<span className="text-3xl">✓</span>}
            title="Responded"
            value={records.filter((r) => r.status === 'Responded').length}
            color="blue"
          />
          <StatCard
            icon={<span className="text-3xl">✓✓</span>}
            title="Resolved"
            value={records.filter((r) => r.status === 'Resolved').length}
            color="green"
          />
        </div>

        <div className="flex gap-2 mb-6">
          {['All', 'Pending', 'Responded', 'Resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                filter === status
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {filteredRecords.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg">No SOS alerts found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className={`rounded-xl p-4 border-l-4 ${
                  record.status === 'Pending'
                    ? 'bg-red-500/10 border-l-red-500'
                    : record.status === 'Responded'
                      ? 'bg-blue-500/10 border-l-blue-500'
                      : 'bg-green-500/10 border-l-green-500'
                } hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(
                          record.status
                        )}`}
                      >
                        {record.status === 'Pending' && '🚨'} {record.status}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(
                          record.priority
                        )}`}
                      >
                        {record.priority}
                      </span>
                    </div>
                    <p className="text-white mb-2">{record.message}</p>
                    <p className="text-sm text-gray-400">
                      User: {record.userEmail} •{' '}
                      {record.createdAt
                        ? new Date(
                            (record.createdAt as any).toDate?.() || record.createdAt
                          ).toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {record.status === 'Pending' && (
                      <button
                        onClick={() => record.id && onUpdate(record.id, 'Responded')}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg text-xs font-medium transition-all duration-300"
                      >
                        Respond
                      </button>
                    )}
                    {record.status !== 'Resolved' && (
                      <button
                        onClick={() => record.id && onUpdate(record.id, 'Resolved')}
                        className="px-3 py-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-xs font-medium transition-all duration-300"
                      >
                        Resolve
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm('Delete this SOS record?')) {
                          onDelete(record.id || '');
                        }
                      }}
                      className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs font-medium transition-all duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
