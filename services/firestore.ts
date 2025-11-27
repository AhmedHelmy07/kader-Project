import { firestore } from '../firebase';
import firebase from 'firebase/compat/app';

// Collection refs
const productsCol = firestore.collection('products');
const ticketsCol = firestore.collection('tickets');
const messagesCol = firestore.collection('messages');
const contactCol = firestore.collection('contact_messages');
const ordersCol = firestore.collection('orders');
const usersCol = firestore.collection('users');
const cartsCol = firestore.collection('carts');
const coursesCol = firestore.collection('courses');
const jobsCol = firestore.collection('jobs');
const medicalRecordsCol = firestore.collection('medical_records');
const sosRecordsCol = firestore.collection('sos_records');

export type Product = {
  id?: string;
  title: string;
  description?: string;
  price: number;
  image?: string; // storage url or path
  stock?: number;
  createdAt?: firebase.firestore.FieldValue;
};

export type Ticket = {
  id?: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'closed';
  createdAt?: firebase.firestore.FieldValue;
  updatedAt?: firebase.firestore.FieldValue;
};

export type Message = {
  id?: string;
  userEmail: string;
  text: string;
  createdAt?: firebase.firestore.FieldValue;
};

export type Order = {
  id?: string;
  userEmail: string;
  items: Array<{ productId: string; qty: number; price: number }>; 
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  createdAt?: firebase.firestore.FieldValue;
};

export type Course = {
  id?: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  image?: string;
  price?: number;
  enrolled?: number;
  rating?: number;
  createdAt?: firebase.firestore.FieldValue;
};

export type Job = {
  id?: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  salary?: string;
  description: string;
  requirements: string;
  posted?: string;
  category: string;
  createdAt?: firebase.firestore.FieldValue;
};

export type MedicalRecord = {
  id?: string;
  uid: string;
  userEmail: string;
  title: string;
  description: string;
  medicalCase: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  recordDate?: firebase.firestore.FieldValue;
  createdAt?: firebase.firestore.FieldValue;
  updatedAt?: firebase.firestore.FieldValue;
};

export type SOSRecord = {
  id?: string;
  uid: string;
  userEmail: string;
  message: string;
  location?: { x: number; y: number };
  status: 'Pending' | 'Responded' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  respondedBy?: string;
  resolvedAt?: firebase.firestore.FieldValue;
  createdAt?: firebase.firestore.FieldValue;
  updatedAt?: firebase.firestore.FieldValue;
};

// Products
export const listProducts = async (): Promise<Product[]> => {
  const snap = await productsCol.get();
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Product) }));
};

export const getProduct = async (id: string): Promise<Product | null> => {
  const doc = await productsCol.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...(doc.data() as Product) };
};

export const createOrUpdateProduct = async (product: Product) => {
  const data = { ...product, createdAt: firebase.firestore.FieldValue.serverTimestamp() } as any;
  if (product.id) {
    await productsCol.doc(product.id).set(data, { merge: true });
    return product.id;
  }
  const ref = await productsCol.add(data);
  return ref.id;
};

export const deleteProduct = async (id: string) => {
  await productsCol.doc(id).delete();
};

// Tickets
export const createTicket = async (t: Ticket) => {
  const data = { ...t, status: t.status || 'open', createdAt: firebase.firestore.FieldValue.serverTimestamp() } as any;
  const ref = await ticketsCol.add(data);
  return ref.id;
};

export const listTickets = async () => {
  const snap = await ticketsCol.orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Ticket) }));
};

// Realtime listeners
export const onTicketsChanged = (cb: (tickets: Ticket[]) => void) => {
  return ticketsCol.orderBy('createdAt', 'desc').onSnapshot(snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Ticket) }));
    cb(items);
  });
};


export const updateTicketStatus = async (id: string, status: Ticket['status']) => {
  await ticketsCol.doc(id).set({ status, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
};

// Messages (community)
export const postMessage = async (m: Message) => {
  const data = { ...m, createdAt: firebase.firestore.FieldValue.serverTimestamp() } as any;
  const ref = await messagesCol.add(data);
  return ref.id;
};

export const postContactMessage = async (m: Message) => {
  const data = { ...m, createdAt: firebase.firestore.FieldValue.serverTimestamp() } as any;
  const ref = await contactCol.add(data);
  return ref.id;
};

export const listMessagesByEmail = async (email: string) => {
  const snap = await messagesCol.where('userEmail', '==', email).orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Message) }));
};

export const listRecentMessages = async (limit = 50) => {
  const snap = await messagesCol.orderBy('createdAt', 'desc').limit(limit).get();
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Message) }));
};

export const listContactMessages = async (limit = 200) => {
  const snap = await contactCol.orderBy('createdAt', 'desc').limit(limit).get();
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Message) }));
};

export const onMessagesChanged = (cb: (messages: Message[]) => void, limit = 100) => {
  return messagesCol.orderBy('createdAt', 'desc').limit(limit).onSnapshot(snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Message) }));
    cb(items);
  });
};

export const onContactMessagesChanged = (cb: (messages: Message[]) => void, limit = 200) => {
  return contactCol.orderBy('createdAt', 'desc').limit(limit).onSnapshot(snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Message) }));
    cb(items);
  });
};

export const onProductsChanged = (cb: (products: Product[]) => void) => {
  return productsCol.orderBy('createdAt', 'desc').onSnapshot(snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Product) }));
    cb(items);
  });
};

// Orders
export const createOrder = async (o: Order) => {
  const data = { ...o, status: 'pending', createdAt: firebase.firestore.FieldValue.serverTimestamp() } as any;
  const ref = await ordersCol.add(data);
  return ref.id;
};

export const listOrders = async () => {
  const snap = await ordersCol.orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Order) }));
};

export const updateOrderStatus = async (id: string, status: Order['status']) => {
  await ordersCol.doc(id).set({ status, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
};

// Users (admin flag)
export const getUserDoc = async (uid: string) => {
  const doc = await usersCol.doc(uid).get();
  return doc.exists ? { id: doc.id, ...(doc.data() as any) } : null;
};

export const setUserAdmin = async (uid: string, isAdmin: boolean) => {
  await usersCol.doc(uid).set({ admin: isAdmin }, { merge: true });
};

// Cart helpers: store per-user cart in `carts/{uid}` document for persistence
export const setCartForUser = async (uid: string, cart: any[]) => {
  await cartsCol.doc(uid).set({ items: cart, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
};

export const getCartForUser = async (uid: string) => {
  const doc = await cartsCol.doc(uid).get();
  return doc.exists ? (doc.data() as any).items || [] : [];
};

export const onCartChanged = (uid: string, cb: (items: any[]) => void) => {
  return cartsCol.doc(uid).onSnapshot(snap => {
    const data = snap.exists ? (snap.data() as any).items || [] : [];
    cb(data);
  });
};

// Orders realtime
export const onOrdersChanged = (cb: (orders: Order[]) => void) => {
  return ordersCol.orderBy('createdAt', 'desc').onSnapshot(snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Order) }));
    cb(items);
  });
};

export const deleteCommunityMessage = async (id: string) => {
  await messagesCol.doc(id).delete();
};

export const deleteContactMessage = async (id: string) => {
  await contactCol.doc(id).delete();
};

// Admin password store (single doc in collection 'admin_pass')
const adminPassCol = firestore.collection('admin_pass');
export const setAdminPassword = async (password: string) => {
  const docs = await adminPassCol.limit(1).get();
  if (!docs.empty) {
    const id = docs.docs[0].id;
    await adminPassCol.doc(id).set({ password }, { merge: true });
    return id;
  }
  const ref = await adminPassCol.add({ password });
  return ref.id;
};

export const getAdminPassword = async () => {
  const docs = await adminPassCol.limit(1).get();
  if (docs.empty) return null;
  const d = docs.docs[0];
  return (d.data() as any).password as string;
};

// Courses
export const createOrUpdateCourse = async (course: Course) => {
  const data = { ...course, createdAt: firebase.firestore.FieldValue.serverTimestamp() } as any;
  if (course.id) {
    await coursesCol.doc(course.id).set(data, { merge: true });
    return course.id;
  }
  const ref = await coursesCol.add(data);
  return ref.id;
};

export const listCourses = async (): Promise<Course[]> => {
  const snap = await coursesCol.orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Course) }));
};

export const getCourse = async (id: string): Promise<Course | null> => {
  const doc = await coursesCol.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...(doc.data() as Course) };
};

export const deleteCourse = async (id: string) => {
  await coursesCol.doc(id).delete();
};

export const onCoursesChanged = (cb: (courses: Course[]) => void) => {
  return coursesCol.orderBy('createdAt', 'desc').onSnapshot(snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Course) }));
    cb(items);
  });
};

// Jobs
export const createOrUpdateJob = async (job: Job) => {
  const data = { ...job, createdAt: firebase.firestore.FieldValue.serverTimestamp() } as any;
  if (job.id) {
    await jobsCol.doc(job.id).set(data, { merge: true });
    return job.id;
  }
  const ref = await jobsCol.add(data);
  return ref.id;
};

export const listJobs = async (): Promise<Job[]> => {
  const snap = await jobsCol.orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Job) }));
};

export const getJob = async (id: string): Promise<Job | null> => {
  const doc = await jobsCol.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...(doc.data() as Job) };
};

export const deleteJob = async (id: string) => {
  await jobsCol.doc(id).delete();
};

export const onJobsChanged = (cb: (jobs: Job[]) => void) => {
  return jobsCol.orderBy('createdAt', 'desc').onSnapshot(snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Job) }));
    cb(items);
  });
};

// Medical Records
export const createMedicalRecord = async (record: MedicalRecord) => {
  const data = {
    ...record,
    recordDate: firebase.firestore.FieldValue.serverTimestamp(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  } as any;
  const ref = await medicalRecordsCol.add(data);
  return ref.id;
};

export const getMedicalRecordsByUser = async (uid: string): Promise<MedicalRecord[]> => {
  const snap = await medicalRecordsCol.where('uid', '==', uid).orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as MedicalRecord) }));
};

export const onMedicalRecordsChanged = (cb: (records: MedicalRecord[]) => void) => {
  return medicalRecordsCol.orderBy('createdAt', 'desc').limit(100).onSnapshot(snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as MedicalRecord) }));
    cb(items);
  });
};

export const deleteMedicalRecord = async (id: string) => {
  await medicalRecordsCol.doc(id).delete();
};

export const updateMedicalRecord = async (id: string, data: Partial<MedicalRecord>) => {
  await medicalRecordsCol.doc(id).update({
    ...data,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
};

// SOS Records
export const createSOSRecord = async (record: SOSRecord) => {
  const data = {
    ...record,
    status: 'Pending',
    priority: record.priority || 'High',
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  } as any;
  const ref = await sosRecordsCol.add(data);
  return ref.id;
};

export const getSOSRecordsByUser = async (uid: string): Promise<SOSRecord[]> => {
  const snap = await sosRecordsCol.where('uid', '==', uid).orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as SOSRecord) }));
};

export const onSOSRecordsChanged = (cb: (records: SOSRecord[]) => void) => {
  return sosRecordsCol.orderBy('createdAt', 'desc').limit(100).onSnapshot(snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as SOSRecord) }));
    cb(items);
  });
};

export const updateSOSRecord = async (id: string, data: Partial<SOSRecord>) => {
  await sosRecordsCol.doc(id).update({
    ...data,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
};

export const deleteSOSRecord = async (id: string) => {
  await sosRecordsCol.doc(id).delete();
};

// Users - Create user record on registration
export type User = {
  uid?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  emergencyContact?: string;
  wheelChairId?: string;
  authProviders?: string[];
  createdAt?: firebase.firestore.FieldValue;
  updatedAt?: firebase.firestore.FieldValue;
};

export const createUserRecord = async (uid: string, userData: User) => {
  const data = {
    ...userData,
    authProviders: userData.authProviders || ['email'],
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  } as any;
  await usersCol.doc(uid).set(data, { merge: true });
};

export default {
  listProducts,
  getProduct,
  createOrUpdateProduct,
  deleteProduct,
  createTicket,
  listTickets,
  updateTicketStatus,
  postMessage,
  listMessagesByEmail,
  listRecentMessages,
  createOrder,
  listOrders,
  updateOrderStatus,
  getUserDoc,
  setUserAdmin,
  onOrdersChanged,
  deleteCommunityMessage,
  deleteContactMessage,
  setAdminPassword,
  getAdminPassword,
  createMedicalRecord,
  getMedicalRecordsByUser,
  onMedicalRecordsChanged,
  deleteMedicalRecord,
  updateMedicalRecord,
  createSOSRecord,
  getSOSRecordsByUser,
  onSOSRecordsChanged,
  updateSOSRecord,
  deleteSOSRecord,
};
