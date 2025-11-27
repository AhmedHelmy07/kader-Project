import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useToast } from './Toast';
import {
  createMedicalRecord,
  getMedicalRecordsByUser,
  updateMedicalRecord,
  deleteMedicalRecord,
  onMedicalRecordsChanged,
  MedicalRecord,
} from '../services/firestore';

const MedicalRecordsPage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    medicalCase: '',
    severity: 'Medium' as const,
  });

  // Load medical records
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onMedicalRecordsChanged(user.uid, (newRecords) => {
      setRecords(newRecords);
      setLoading(false);
    });

    return () => unsubscribe?.();
  }, [user]);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !formData.title.trim() || !formData.description.trim()) {
      toast?.push('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        // Update existing record
        await updateMedicalRecord(editingId, {
          title: formData.title,
          description: formData.description,
          medicalCase: formData.medicalCase,
          severity: formData.severity,
        });
        toast?.push('Medical record updated successfully');
      } else {
        // Create new record
        await createMedicalRecord({
          uid: user.uid,
          userEmail: user.email || '',
          title: formData.title,
          description: formData.description,
          medicalCase: formData.medicalCase,
          severity: formData.severity,
        });
        toast?.push('Medical record created successfully');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        medicalCase: '',
        severity: 'Medium',
      });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving record:', error);
      toast?.push('Error saving medical record');
    }
  };

  const handleEdit = (record: MedicalRecord) => {
    setFormData({
      title: record.title,
      description: record.description,
      medicalCase: record.medicalCase,
      severity: record.severity,
    });
    setEditingId(record.id || null);
    setShowForm(true);
  };

  const handleDelete = async (recordId: string) => {
    if (!confirm('Are you sure you want to delete this medical record?')) return;

    try {
      await deleteMedicalRecord(recordId);
      toast?.push('Medical record deleted');
    } catch (error) {
      console.error('Error deleting record:', error);
      toast?.push('Error deleting medical record');
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      medicalCase: '',
      severity: 'Medium',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const filteredRecords =
    severityFilter === 'All' ? records : records.filter((r) => r.severity === severityFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading medical records...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {showForm ? 'Cancel' : 'Add New Record'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              {editingId ? 'Edit Medical Record' : 'New Medical Record'}
            </h2>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Record Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Annual Checkup, Injury Report"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the medical situation, symptoms, or treatment..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Case
                </label>
                <input
                  type="text"
                  value={formData.medicalCase}
                  onChange={(e) => setFormData({ ...formData, medicalCase: e.target.value })}
                  placeholder="e.g., Chronic Back Pain, Diabetes Management"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity Level
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      severity: e.target.value as 'Low' | 'Medium' | 'High' | 'Critical',
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  {editingId ? 'Update Record' : 'Create Record'}
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
        <div className="mb-6 flex gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700 self-center">Filter by severity:</span>
          {['All', 'Low', 'Medium', 'High', 'Critical'].map((severity) => (
            <button
              key={severity}
              onClick={() => setSeverityFilter(severity)}
              className={`px-3 py-1 text-sm rounded-full transition ${
                severityFilter === severity
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {severity}
            </button>
          ))}
        </div>

        {/* Records List */}
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">
              {severityFilter === 'All'
                ? 'No medical records yet. Click "Add New Record" to create one.'
                : `No ${severityFilter} severity records found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                    {record.medicalCase && (
                      <p className="text-sm text-gray-600 mt-1">{record.medicalCase}</p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(
                      record.severity
                    )}`}
                  >
                    {record.severity}
                  </span>
                </div>

                <p className="text-gray-700 mb-3">{record.description}</p>

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>
                    Created:{' '}
                    {record.createdAt
                      ? new Date(
                          (record.createdAt as any).toDate?.() || record.createdAt
                        ).toLocaleDateString()
                      : 'N/A'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => record.id && handleDelete(record.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
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

export default MedicalRecordsPage;
