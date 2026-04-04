/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import React from 'react';
import { supabase } from './lib/supabaseClient';
import Login from './components/Login';

type Customer = {
  id: string;
  name: string;
  dob: string;
  address: string;
  pincode: string;
};

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState<any>({ applicationId: Math.random().toString(36).substr(2, 9).toUpperCase() });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [view, setView] = useState<'form' | 'list'>('form');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) {
        fetchCustomers();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchCustomers();
      } else {
        setCustomers([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCustomers = async () => {
    const { data, error } = await supabase.from('kyc_applications').select('*');
    if (error) {
      console.error('Error fetching customers:', error);
    } else {
      setCustomers(data.map(c => ({
        id: c.application_id,
        name: c.name,
        dob: c.dob,
        address: c.address_line1,
        pincode: c.pincode,
      })));
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!session) return <Login />;

  const handleUpload = async (file: File, folder: string) => {
    const { data, error } = await supabase.storage
      .from('KYC')
      .upload(`${folder}/${formState.applicationId}.${file.name.split('.').pop()}`, file);
    
    if (error) {
      console.error('Error uploading file:', error);
      return { error: error.message };
    }
    return { data };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      const { error } = await supabase.from('kyc_applications').insert([
        {
          application_id: formState.applicationId,
          name: formState.name,
          father_name: formState.fatherName,
          mother_name: formState.motherName,
          dob: formState.dob,
          gender: formState.gender,
          pan: formState.pan,
          martial_status: formState.martialStatus,
          citizenship: formState.citizenship,
          residential_status: formState.residentialStatus,
          aadhar_number: formState.aadhar,
          pan_number: formState.panNumber,
          voter_id: formState.voterId,
          address_line1: formState.addressLine1,
          address_line2: formState.addressLine2,
          address_line3: formState.addressLine3,
          district: formState.district,
          pincode: formState.pincode,
          state: formState.state,
          country: formState.country,
          nature_of_employment: formState.natureOfEmployment,
          company_name: formState.companyName,
          designation: formState.designation,
          office_address: formState.officeAddress,
        }
      ]);

      if (error) {
        console.error('Error inserting data:', error);
        alert('Error submitting application: ' + error.message);
        return;
      }

      setCustomers([...customers, {
        id: formState.applicationId,
        name: formState.name,
        dob: formState.dob,
        address: formState.addressLine1,
        pincode: formState.pincode,
      }]);
      setFormState({ applicationId: Math.random().toString(36).substr(2, 9).toUpperCase() });
      setStep(1);
      setView('list');
    }
  };

  const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">PayZipp KYC Onboarding</h1>
          <div className="flex gap-4">
            <button onClick={() => setView(view === 'form' ? 'list' : 'form')} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium">
              {view === 'form' ? 'View Customers' : 'New Application'}
            </button>
            <button onClick={() => supabase.auth.signOut()} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition font-medium">
              Logout
            </button>
          </div>
        </div>

        {view === 'form' ? (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-sm text-slate-600 mb-6 bg-indigo-50 p-4 rounded-lg">PayZipp KYC Onboarding: Secure, fast, and compliant verification for your loan application.</p>
            <div className="mb-8 flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`flex items-center ${s < 3 ? 'flex-1' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {s}
                  </div>
                  {s < 3 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-slate-900">1. Personal Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2"><label className={labelClass}>Application ID</label><input type="text" value={formState.applicationId} disabled className={`${inputClass} bg-slate-100`} /></div>
                    <div><label className={labelClass}>Full Name (as per Aadhar)</label><input type="text" className={inputClass} onChange={(e) => setFormState({...formState, name: e.target.value})} /></div>
                    <div><label className={labelClass}>Father Name</label><input type="text" className={inputClass} onChange={(e) => setFormState({...formState, fatherName: e.target.value})} /></div>
                    <div><label className={labelClass}>Mother Name</label><input type="text" className={inputClass} onChange={(e) => setFormState({...formState, motherName: e.target.value})} /></div>
                    <div><label className={labelClass}>Date of Birth</label><input type="date" className={inputClass} onChange={(e) => setFormState({...formState, dob: e.target.value})} /></div>
                    <div><label className={labelClass}>Gender</label><select className={inputClass} onChange={(e) => setFormState({...formState, gender: e.target.value})}><option value="">Select</option><option value="male">Male</option><option value="female">Female</option></select></div>
                    <div><label className={labelClass}>PAN</label><input type="text" className={inputClass} onChange={(e) => setFormState({...formState, pan: e.target.value})} /></div>
                    <div><label className={labelClass}>Martial Status</label><input type="text" className={inputClass} onChange={(e) => setFormState({...formState, martialStatus: e.target.value})} /></div>
                    <div><label className={labelClass}>Citizenship</label><input type="text" className={inputClass} onChange={(e) => setFormState({...formState, citizenship: e.target.value})} /></div>
                    <div><label className={labelClass}>Residential Status</label><input type="text" className={inputClass} onChange={(e) => setFormState({...formState, residentialStatus: e.target.value})} /></div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-slate-900">2. Proof of Identity & Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelClass}>Aadhar Number</label><input type="text" className={inputClass} onChange={(e) => setFormState({...formState, aadhar: e.target.value})} /></div>
                    <div><label className={labelClass}>Aadhar Upload</label><input type="file" className={inputClass} onChange={(e) => e.target.files && handleUpload(e.target.files[0], 'Aadhar')} /></div>
                    <div><label className={labelClass}>PAN Number</label><input type="text" className={inputClass} onChange={(e) => setFormState({...formState, panNumber: e.target.value})} /></div>
                    <div><label className={labelClass}>PAN Upload</label><input type="file" className={inputClass} onChange={(e) => e.target.files && handleUpload(e.target.files[0], 'PAN')} /></div>
                    <div><label className={labelClass}>Voter ID Number</label><input type="text" className={inputClass} onChange={(e) => setFormState({...formState, voterId: e.target.value})} /></div>
                    <div><label className={labelClass}>Voter ID Upload</label><input type="file" className={inputClass} onChange={(e) => e.target.files && handleUpload(e.target.files[0], 'VoterID')} /></div>
                    <div><label className={labelClass}>Bank Details Upload</label><input type="file" className={inputClass} onChange={(e) => e.target.files && handleUpload(e.target.files[0], 'BankDetails')} /></div>
                    <div><label className={labelClass}>Selfie Upload</label><input type="file" className={inputClass} onChange={(e) => e.target.files && handleUpload(e.target.files[0], 'Selfie')} /></div>
                    <div className="md:col-span-2"><label className={labelClass}>Address Line 1</label><input type="text" className={inputClass} onChange={(e) => setFormState({...formState, addressLine1: e.target.value})} /></div>
                    <div className="md:col-span-2"><label className={labelClass}>Address Line 2</label><input type="text" className={inputClass} onChange={(e) => setFormState({...formState, addressLine2: e.target.value})} /></div>
                    <div className="md:col-span-2"><label className={labelClass}>Address Line 3</label><input type="text" className={inputClass} onChange={(e) => setFormState({...formState, addressLine3: e.target.value})} /></div>
                    <div><label className={labelClass}>District</label><input type="text" className={inputClass} onChange={(e) => setFormState({...formState, district: e.target.value})} /></div>
                    <div><label className={labelClass}>Pincode</label><input type="text" className={inputClass} onChange={(e) => setFormState({...formState, pincode: e.target.value})} /></div>
                    <div><label className={labelClass}>State</label><input type="text" className={inputClass} onChange={(e) => setFormState({...formState, state: e.target.value})} /></div>
                    <div><label className={labelClass}>Country</label><input type="text" className={inputClass} onChange={(e) => setFormState({...formState, country: e.target.value})} /></div>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-slate-900">3. Employment Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2"><label className={labelClass}>Nature of Employment</label><input type="text" className={inputClass} onChange={(e) => setFormState({...formState, natureOfEmployment: e.target.value})} /></div>
                    <div><label className={labelClass}>Current Company Name</label><input type="text" className={inputClass} onChange={(e) => setFormState({...formState, companyName: e.target.value})} /></div>
                    <div><label className={labelClass}>Designation</label><input type="text" className={inputClass} onChange={(e) => setFormState({...formState, designation: e.target.value})} /></div>
                    <div className="md:col-span-2"><label className={labelClass}>Office Address</label><input type="text" className={inputClass} onChange={(e) => setFormState({...formState, officeAddress: e.target.value})} /></div>
                  </div>
                </div>
              )}
              <div className="flex gap-4">
                {step > 1 && (
                  <button type="button" onClick={() => setStep(step - 1)} className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-300 transition">
                    Previous
                  </button>
                )}
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                  {step < 3 ? 'Next Step' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <h2 className="text-xl font-semibold mb-6 text-slate-900">Customer List</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600">
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">DOB</th>
                    <th className="p-3">Address</th>
                    <th className="p-3">Pincode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-500">{c.id}</td>
                      <td className="p-3 font-medium text-slate-900">{c.name}</td>
                      <td className="p-3 text-slate-600">{c.dob}</td>
                      <td className="p-3 text-slate-600">{c.address}</td>
                      <td className="p-3 text-slate-600">{c.pincode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
