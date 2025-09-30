import { firestore } from '../firebase';
import firebase from 'firebase/compat/app';

// Collection refs
const productsCol = firestore.collection('products');
const ticketsCol = firestore.collection('tickets');
const messagesCol = firestore.collection('messages');
const ordersCol = firestore.collection('orders');
const usersCol = firestore.collection('users');

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

export const updateTicketStatus = async (id: string, status: Ticket['status']) => {
  await ticketsCol.doc(id).set({ status, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
};

// Messages (community)
export const postMessage = async (m: Message) => {
  const data = { ...m, createdAt: firebase.firestore.FieldValue.serverTimestamp() } as any;
  const ref = await messagesCol.add(data);
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
};
