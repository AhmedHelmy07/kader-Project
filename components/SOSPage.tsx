import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useToast } from './Toast';
import {
  createSOSRecord,
  getSOSRecordsByUser,
  updateSOSRecord,
  deleteSOSRecord,
  onSOSRecordsChanged,
  SOSRecord,
} from '../services/firestore';

const SOSPage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [records, setRecords] = useState<SOSRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const [formData, setFormData] = useState({
    message: '',
    priority: 'High' as const,
    location: '',
  });

  // Load SOS records
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSOSRecordsChanged(user.uid, (newRecords) => {
      setRecords(newRecords);
      setLoading(false);
    });

    return () => unsubscribe?.();
  }, [user]);

  const handleSendSOS = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !formData.message.trim()) {
      toast?.push('Please enter an SOS message');
      return;
    }

    try {
      if (editingId) {
        // Update existing SOS record
        await updateSOSRecord(editingId, {
          message: formData.message,
          priority: formData.priority,
        });
        toast?.push('🚨 SOS Alert updated successfully!');
      } else {
        // Create new SOS record
        await createSOSRecord({
          uid: user.uid,
          userEmail: user.email || '',
          message: formData.message,
          priority: formData.priority,
          status: 'Pending',
        });
        toast?.push('🚨 SOS Alert sent successfully!');
      }

      // Reset form
      setFormData({
        message: '',
        priority: 'High',
        location: '',
      });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error sending SOS:', error);
      toast?.push('Error sending SOS alert');
    }
  };

  const handleEdit = (record: SOSRecord) => {
    setFormData({
      message: record.message,
      priority: record.priority,
      location: '',
    });
    setEditingId(record.id || null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({
      message: '',
      priority: 'High',
      location: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleUpdateStatus = async (recordId: string, newStatus: 'Pending' | 'Responded' | 'Resolved') => {
    try {
      await updateSOSRecord(recordId, {
        status: newStatus,
      });
      toast?.push('SOS status updated');
    } catch (error) {
      console.error('Error updating SOS:', error);
      toast?.push('Error updating SOS record');
    }
  };

  const handleDelete = async (recordId: string) => {
    if (!confirm('Are you sure you want to delete this SOS record?')) return;

    try {
      await deleteSOSRecord(recordId);
      toast?.push('SOS record deleted');
    } catch (error) {
      console.error('Error deleting SOS:', error);
      toast?.push('Error deleting SOS record');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-red-500 text-white';
      case 'Responded':
        return 'bg-blue-500 text-white';
      case 'Resolved':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const filteredRecords = records.filter((r) => {
    const priorityMatch = priorityFilter === 'All' || r.priority === priorityFilter;
    const statusMatch = statusFilter === 'All' || r.status === statusFilter;
    return priorityMatch && statusMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading SOS alerts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🚨 Emergency SOS</h1>
            <p className="text-gray-600 mt-1">Send emergency alerts and track their status</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold"
          >
            {showForm ? 'Cancel' : '🚨 Send SOS Alert'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-2 border-red-500">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              {editingId ? 'Edit Emergency Alert' : 'Send Emergency Alert'}
            </h2>
            <form onSubmit={handleSendSOS} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your emergency situation..."
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority Level
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as 'Low' | 'Medium' | 'High' | 'Critical',
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High (Recommended)</option>
                  <option value="Critical">Critical - Emergency</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold text-lg"
                >
                  {editingId ? '✏️ Update Alert' : '🚨 Send SOS Alert'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <div>
            <span className="text-sm font-medium text-gray-700">Priority:</span>
            <div className="flex gap-2 mt-1">
              {['All', 'Low', 'Medium', 'High', 'Critical'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => setPriorityFilter(priority)}
                  className={`px-3 py-1 text-sm rounded-full transition ${
                    priorityFilter === priority
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <div className="flex gap-2 mt-1">
              {['All', 'Pending', 'Responded', 'Resolved'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 text-sm rounded-full transition ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Records List */}
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">
              {records.length === 0
                ? 'No SOS alerts yet. Stay safe!'
                : 'No alerts match the selected filters.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className={`rounded-lg shadow-md p-6 border-l-4 ${
                  record.status === 'Pending' ? 'bg-red-50 border-red-500' : 'bg-white border-blue-500'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold border text-white ${
                          record.status === 'Pending'
                            ? 'bg-red-500'
                            : record.status === 'Responded'
                              ? 'bg-blue-500'
                              : 'bg-green-500'
                        }`}
                      >
                        {record.status === 'Pending' && '🚨'} {record.status}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(
                          record.priority
                        )}`}
                      >
                        {record.priority}
                      </span>
                    </div>
                    <p className="text-gray-700">{record.message}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-200">
                  <span>
                    Sent:{' '}
                    {record.createdAt
                      ? new Date(
                          (record.createdAt as any).toDate?.() || record.createdAt
                        ).toLocaleString()
                      : 'N/A'}
                  </span>

                  {record.respondedBy && (
                    <span className="text-blue-600 font-medium">
                      ✓ Responded by: {record.respondedBy}
                    </span>
                  )}

                  <div className="flex gap-2">
                    {record.status === 'Pending' && (
                      <button
                        onClick={() => handleEdit(record)}
                        className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition text-xs font-medium"
                      >
                        Edit
                      </button>
                    )}
                    {record.status === 'Pending' && (
                      <button
                        onClick={() => record.id && handleUpdateStatus(record.id, 'Responded')}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs font-medium"
                      >
                        Mark Responded
                      </button>
                    )}
                    {record.status !== 'Resolved' && (
                      <button
                        onClick={() => record.id && handleUpdateStatus(record.id, 'Resolved')}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-xs font-medium"
                      >
                        Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={() => record.id && handleDelete(record.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-xs font-medium"
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

export default SOSPage;
