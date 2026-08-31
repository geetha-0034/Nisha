import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Phone,
  Mail,
  Heart,
  Trash2,
  Edit2,
  Send,
  Star,
  Check,
  AlertCircle,
  X,
  Bell,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { TrustedContact } from '../types';
import { useSafety } from '../context/SafetyContext';

export const ContactsPage: React.FC = () => {
  const { contacts, refreshContacts } = useSafety();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingContact, setEditingContact] = useState<TrustedContact | null>(null);

  // Form states
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [relationship, setRelationship] = useState<string>('Friend');
  const [isPrimary, setIsPrimary] = useState<boolean>(false);
  const [notifyOnSOS, setNotifyOnSOS] = useState<boolean>(true);
  const [notifyOnSessionStart, setNotifyOnSessionStart] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Testing Alert State
  const [testingContactId, setTestingContactId] = useState<string | null>(null);
  const [testSuccessMessage, setTestSuccessMessage] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingContact(null);
    setName('');
    setPhone('');
    setEmail('');
    setRelationship('Family');
    setIsPrimary(contacts.length === 0);
    setNotifyOnSOS(true);
    setNotifyOnSessionStart(true);
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (c: TrustedContact) => {
    setEditingContact(c);
    setName(c.name);
    setPhone(c.phone || '');
    setEmail(c.email || '');
    setRelationship(c.relationship || 'Friend');
    setIsPrimary(Boolean(c.isPrimary));
    setNotifyOnSOS(c.notifyOnSOS !== false);
    setNotifyOnSessionStart(c.notifyOnSessionStart !== false);
    setFormError(null);
    setShowModal(true);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (!phone && !email)) {
      setFormError('Please enter a name and at least a phone number or email.');
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      if (editingContact) {
        await api.updateContact(editingContact.id, {
          name,
          phone,
          email,
          relationship,
          isPrimary,
          notifyOnSOS,
          notifyOnSessionStart,
        });
      } else {
        await api.createContact({
          name,
          phone,
          email,
          relationship,
          isPrimary,
          notifyOnSOS,
          notifyOnSessionStart,
        });
      }

      await refreshContacts();
      setShowModal(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save contact.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to remove this trusted emergency contact?')) return;
    try {
      await api.deleteContact(id);
      await refreshContacts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendTestAlert = async (c: TrustedContact) => {
    setTestingContactId(c.id);
    setTestSuccessMessage(null);
    try {
      const res = await api.testContactAlert(c.id);
      setTestSuccessMessage(`Simulated alert successfully dispatched to ${c.name} (${c.phone || c.email})!`);
      setTimeout(() => {
        setTestSuccessMessage(null);
      }, 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to test contact alert');
    } finally {
      setTestingContactId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Trusted Emergency Contacts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            People who receive your live GPS route updates, night-walk alerts, and emergency SOS broadcasts
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow transition active:scale-95 w-fit"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Trusted Contact</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {testSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-150">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{testSuccessMessage}</span>
        </div>
      )}

      {/* Contacts List */}
      {contacts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">No Trusted Contacts Configured</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add close friends, family members, or flatmates so NISHA can notify them immediately during safety walks or emergencies.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700 transition"
          >
            Add Your First Contact
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 hover:border-slate-300 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-800 text-sm">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">{contact.name}</h3>
                      {contact.isPrimary && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-rose-600 text-rose-600" /> Primary
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{contact.relationship || 'Friend'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(contact)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition"
                    title="Edit Contact"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteContact(contact.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Remove Contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contact info details */}
              <div className="space-y-1.5 text-xs text-slate-600">
                {contact.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{contact.phone}</span>
                  </p>
                )}
                {contact.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{contact.email}</span>
                  </p>
                )}
              </div>

              {/* Notification Preferences */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-500">
                {contact.notifyOnSOS && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100">
                    SOS Alerts Active
                  </span>
                )}
                {contact.notifyOnSessionStart && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                    Night-Walk Route Alerts
                  </span>
                )}
              </div>

              {/* Test Notification Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleSendTestAlert(contact)}
                  disabled={testingContactId === contact.id}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{testingContactId === contact.id ? 'Dispatching Test...' : 'Send Test Alert'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-slate-900 text-lg">
                {editingContact ? 'Edit Trusted Contact' : 'Add Trusted Contact'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveContact} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aanya Patel"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Relationship</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
                  >
                    <option value="Family">Family</option>
                    <option value="Friend">Friend</option>
                    <option value="Partner">Partner</option>
                    <option value="Roommate">Roommate</option>
                    <option value="Coworker">Coworker</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@example.com"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="h-4 w-4 text-rose-600 rounded"
                  />
                  <span className="text-xs font-bold text-slate-800">Set as Primary Emergency Contact</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyOnSOS}
                    onChange={(e) => setNotifyOnSOS(e.target.checked)}
                    className="h-4 w-4 text-rose-600 rounded"
                  />
                  <span className="text-xs font-medium text-slate-700">Dispatch live coordinates during SOS</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyOnSessionStart}
                    onChange={(e) => setNotifyOnSessionStart(e.target.checked)}
                    className="h-4 w-4 text-rose-600 rounded"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Notify when I start an active safety walk
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition active:scale-95"
                >
                  {isSaving ? 'Saving Contact...' : 'Save Trusted Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
