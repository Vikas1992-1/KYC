/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import React from 'react';
import { supabase } from './lib/supabaseClient';
import Login from './components/Login';
import { ArrowRight, CheckCircle, Zap, Shield, BarChart3, LayoutDashboard } from 'lucide-react';

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [view, setView] = useState<'home' | 'form' | 'list' | 'login' | 'landing'>('landing');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) {
        fetchCustomers();
        setView('home');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === 'SIGNED_IN' && session) {
        fetchCustomers();
        setView((prevView) => (prevView === 'landing' || prevView === 'login' ? 'home' : prevView));
      } else if (_event === 'SIGNED_OUT') {
        setCustomers([]);
        setView((prevView) => (prevView !== 'landing' ? 'landing' : prevView));
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

  if (view === 'login') return <Login />;
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-sans">
        {/* Sticky Navigation */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="text-2xl font-bold text-[#003D82] tracking-tighter">PayZipp</div>
            <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
              <button onClick={(e) => { e.preventDefault(); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#003D82] transition">Home</button>
              <button onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#003D82] transition">Features</button>
              <button onClick={(e) => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#003D82] transition">Pricing</button>
              <button onClick={(e) => { e.preventDefault(); document.getElementById('docs')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#003D82] transition">Docs</button>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setView('login')} className="text-sm font-semibold text-slate-600 hover:text-[#003D82] transition">Login</button>
              <button onClick={() => setView('login')} className="text-sm font-semibold bg-[#003D82] text-white px-6 py-2.5 rounded-full hover:bg-blue-900 transition shadow-sm hover:shadow-md">Get Started</button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <header id="home" className="py-16 md:py-20 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
          <div className="max-w-5xl mx-auto px-6 text-center relative">
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tighter mb-6 leading-tight">Digital KYC Made Simple</h1>
            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">Streamline your client onboarding with our secure, compliant, and automated KYC platform. Get verified in minutes, not days.</p>
            </div>
        </header>

        {/* Features */}
        <section id="features" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-extrabold text-center mb-16 tracking-tighter">Why Choose PayZipp?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Zap, title: 'Instant Verification', desc: 'Instant AI-powered document checks.' },
                { icon: Shield, title: 'Compliance Ready', desc: 'Stay ahead of regulatory requirements.' },
                { icon: BarChart3, title: 'Real-time Monitoring', desc: 'Monitor onboarding progress instantly.' },
                { icon: CheckCircle, title: 'API Integration', desc: 'API-first design for easy setup.' },
              ].map((f, i) => (
                <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#003D82]/20 transition-all duration-300">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                    <f.icon className="text-[#003D82]" size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{f.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 bg-blue-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-extrabold mb-16 tracking-tighter">Trusted by Industry Leaders</h2>
            <div className="grid md:grid-cols-3 gap-12 mb-16">
              <div><div className="text-5xl font-extrabold text-[#003D82] mb-2">10,000+</div><p className="text-slate-600 font-medium">Verified Customers</p></div>
              <div><div className="text-5xl font-extrabold text-[#003D82] mb-2">99.9%</div><p className="text-slate-600 font-medium">Platform Uptime</p></div>
              <div><div className="text-5xl font-extrabold text-[#003D82] mb-2">500+</div><p className="text-slate-600 font-medium">Companies Integrated</p></div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-extrabold text-center mb-16 tracking-tighter">What Our Customers Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Sarah J.', role: 'CTO at FinTech Corp', quote: 'PayZipp transformed our onboarding process. Truly seamless.' },
                { name: 'Mark T.', role: 'Founder at PayFlow', quote: 'Compliance was a nightmare until we found PayZipp.' },
                { name: 'Elena R.', role: 'Operations at GlobalBank', quote: 'The real-time dashboard is a game changer for our team.' },
              ].map((t, i) => (
                <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-[#003D82]/20 transition-all">
                  <p className="text-slate-600 mb-6 italic leading-relaxed">"{t.quote}"</p>
                  <div className="font-bold text-slate-900">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-slate-900 text-slate-400">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
            <div><div className="text-2xl font-bold text-white mb-4 tracking-tighter">PayZipp</div><p className="text-sm leading-relaxed">Simplifying KYC for the modern financial world.</p></div>
            <div><h4 className="font-bold text-white mb-4">Product</h4><ul className="space-y-2 text-sm"><li>Features</li><li>Pricing</li><li>API</li></ul></div>
            <div><h4 className="font-bold text-white mb-4">Company</h4><ul className="space-y-2 text-sm"><li>About</li><li>Careers</li><li>Contact</li></ul></div>
            <div><h4 className="font-bold text-white mb-4">Legal</h4><ul className="space-y-2 text-sm"><li>Privacy</li><li>Terms</li></ul></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-sm">&copy; 2026 PayZipp. All rights reserved.</div>
        </footer>
      </div>
    );
  }

  if (view === 'login') return <Login />;

  const handleUpload = async (file: File, folder: string) => {
    const { data, error } = await supabase.storage
      .from('KYC')
      .upload(`${formState.applicationId}_${folder}.${file.name.split('.').pop()}`, file, { upsert: true });
    
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
      const payload = {
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
      };

      const { error } = editingId 
        ? await supabase.from('kyc_applications').update(payload).eq('application_id', editingId)
        : await supabase.from('kyc_applications').insert([payload]);

      if (error) {
        console.error('Error submitting application:', error);
        alert('Error submitting application: ' + error.message);
        return;
      }

      fetchCustomers();
      setFormState({ applicationId: Math.random().toString(36).substr(2, 9).toUpperCase() });
      setEditingId(null);
      setStep(1);
      setView('list');
    }
  };

  const viewDocument = async (applicationId: string, folder: string) => {
    const { data, error } = await supabase.storage.from('KYC').list('', { search: applicationId + '_' + folder });
    if (error || !data || data.length === 0) {
      alert('Document not found');
      return;
    }
    const file = data[0];
    const { data: urlData } = supabase.storage.from('KYC').getPublicUrl(file.name);
    window.open(urlData.publicUrl, '_blank');
  };

  const editCustomer = async (customer: Customer) => {
    const { data, error } = await supabase
      .from('kyc_applications')
      .select('*')
      .eq('application_id', customer.id)
      .single();
    
    if (error) {
      console.error('Error fetching customer for edit:', error);
      alert('Error fetching customer data');
      return;
    }

    setFormState({
      applicationId: data.application_id,
      name: data.name,
      fatherName: data.father_name,
      motherName: data.mother_name,
      dob: data.dob,
      gender: data.gender,
      pan: data.pan,
      martialStatus: data.martial_status,
      citizenship: data.citizenship,
      residentialStatus: data.residential_status,
      aadhar: data.aadhar_number,
      panNumber: data.pan_number,
      voterId: data.voter_id,
      addressLine1: data.address_line1,
      addressLine2: data.address_line2,
      addressLine3: data.address_line3,
      district: data.district,
      pincode: data.pincode,
      state: data.state,
      country: data.country,
      natureOfEmployment: data.nature_of_employment,
      companyName: data.company_name,
      designation: data.designation,
      officeAddress: data.office_address,
    });
    setEditingId(customer.id);
    setView('form');
    setStep(1);
  };

  const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 text-text">
      <div className="max-w-5xl mx-auto">
        {view !== 'home' && (
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-bold text-primary tracking-tight">PayZipp</h1>
            <div className="flex gap-4">
              {view === 'form' && (
                <button type="button" onClick={(e) => { e.preventDefault(); setView('list'); }} className="px-5 py-2.5 bg-card border border-slate-200 text-text rounded-xl hover:bg-slate-50 transition font-medium shadow-sm">
                  View Applications
                </button>
              )}
              {view === 'list' && (
                <button type="button" onClick={(e) => { e.preventDefault(); setView('form'); setStep(1); }} className="px-5 py-2.5 bg-card border border-slate-200 text-text rounded-xl hover:bg-slate-50 transition font-medium shadow-sm">
                  New Application
                </button>
              )}
              <button type="button" onClick={(e) => { e.preventDefault(); setView('home'); }} className="px-5 py-2.5 bg-card border border-slate-200 text-text rounded-xl hover:bg-slate-50 transition font-medium shadow-sm">
                Back to Dashboard
              </button>
              <button onClick={() => supabase.auth.signOut()} className="px-5 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition font-medium">
                Logout
              </button>
            </div>
          </div>
        )}

        {view === 'home' ? (
          <div className="min-h-screen bg-white text-slate-900 font-sans">
            {/* Sticky Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
              <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="text-2xl font-bold text-[#003D82] tracking-tighter">PayZipp</div>
                <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
                  <button onClick={(e) => { e.preventDefault(); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#003D82] transition">Home</button>
                  <button onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#003D82] transition">Features</button>
                  <button onClick={(e) => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#003D82] transition">Pricing</button>
                  <button onClick={(e) => { e.preventDefault(); document.getElementById('docs')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#003D82] transition">Docs</button>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => supabase.auth.signOut()} className="text-sm font-semibold text-slate-600 hover:text-[#003D82] transition">Logout</button>
                </div>
              </div>
            </nav>

            {/* Hero Section */}
            <header className="py-24 bg-gradient-to-br from-blue-50 to-white">
              <div className="max-w-5xl mx-auto px-6 text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tighter mb-6 leading-tight">Digital KYC Made Simple</h1>
                <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">Streamline client onboarding with intelligent verification</p>
              </div>
            </header>

            {/* Split Layout */}
            <section className="py-16 bg-slate-50">
              <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-8">
                {/* Left Side (50%) */}
                <div className="md:col-span-5 bg-[#003D82] p-8 rounded-3xl text-white shadow-xl">
                  <h2 className="text-3xl font-extrabold mb-4 tracking-tighter">Onboard New Customer</h2>
                  <p className="text-blue-100 mb-8 leading-relaxed">Automated KYC verification in minutes</p>
                  <button type="button" onClick={() => { setView('form'); setStep(1); }} className="px-8 py-4 bg-white text-[#003D82] rounded-full font-semibold hover:bg-blue-50 transition shadow-lg">
                    Onboard New Customer
                  </button>
                </div>
                {/* Right Side (70%) */}
                <div className="md:col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h2 className="text-2xl font-bold mb-6 text-slate-900 tracking-tighter">Recent Applications</h2>
                  <div className="space-y-4">
                    {customers.slice(0, 4).map(c => (
                      <div key={c.id} className="p-4 border border-slate-100 rounded-xl flex justify-between items-center">
                        <div>
                          <div className="font-medium text-slate-900">{c.name}</div>
                          <div className="text-xs text-slate-500">ID: {c.id}</div>
                        </div>
                        <div className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">Verified</div>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => setView('list')} className="mt-6 text-sm font-semibold text-[#003D82] hover:underline">View All</button>
                </div>
              </div>
            </section>

            {/* Features */}
            <section id="features" className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-extrabold text-center mb-16 tracking-tighter">Why Choose PayZipp?</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { icon: Zap, title: 'Instant Verification', desc: 'Instant AI-powered document checks.' },
                    { icon: Shield, title: 'Compliance Ready', desc: 'Stay ahead of regulatory requirements.' },
                    { icon: BarChart3, title: 'Real-time Monitoring', desc: 'Monitor onboarding progress instantly.' },
                    { icon: CheckCircle, title: 'API Integration', desc: 'API-first design for easy setup.' },
                  ].map((f, i) => (
                    <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#003D82]/20 transition-all duration-300">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                        <f.icon className="text-[#003D82]" size={28} />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-slate-900">{f.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Stats Bar */}
            <section className="py-16 bg-blue-50">
              <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
                <div><div className="text-4xl font-extrabold text-[#003D82] mb-2">10,000+</div><p className="text-slate-600 font-medium">Verified Customers</p></div>
                <div><div className="text-4xl font-extrabold text-[#003D82] mb-2">99.9%</div><p className="text-slate-600 font-medium">Platform Uptime</p></div>
                <div><div className="text-4xl font-extrabold text-[#003D82] mb-2">&lt; 2 min</div><p className="text-slate-600 font-medium">Onboarding</p></div>
              </div>
            </section>

            {/* Footer */}
            <footer className="py-16 bg-slate-900 text-slate-400">
              <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
                <div><div className="text-2xl font-bold text-white mb-4 tracking-tighter">PayZipp</div><p className="text-sm leading-relaxed">Simplifying KYC for the modern financial world.</p></div>
                <div><h4 className="font-bold text-white mb-4">Product</h4><ul className="space-y-2 text-sm"><li>Features</li><li>Pricing</li><li>API</li></ul></div>
                <div><h4 className="font-bold text-white mb-4">Company</h4><ul className="space-y-2 text-sm"><li>About</li><li>Careers</li><li>Contact</li></ul></div>
                <div><h4 className="font-bold text-white mb-4">Legal</h4><ul className="space-y-2 text-sm"><li>Privacy</li><li>Terms</li></ul></div>
              </div>
              <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-sm">&copy; 2026 PayZipp. All rights reserved.</div>
            </footer>
          </div>
        ) : view === 'form' ? (
          <div className="bg-card p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold mb-8 text-text">New KYC Application</h2>
            <div className="mb-8 flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`flex items-center ${s < 3 ? 'flex-1' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {s}
                  </div>
                  {s < 3 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-primary' : 'bg-slate-200'}`}></div>}
                </div>
              ))}
            </div>
            {/* Form remains the same */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-text">1. Personal Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2"><label className={labelClass}>Application ID</label><input type="text" value={formState.applicationId} disabled className={`${inputClass} bg-slate-100`} /></div>
                    <div><label className={labelClass}>Full Name (as per Aadhar)</label><input type="text" value={formState.name || ''} className={inputClass} onChange={(e) => setFormState({...formState, name: e.target.value})} /></div>
                    <div><label className={labelClass}>Father Name</label><input type="text" value={formState.fatherName || ''} className={inputClass} onChange={(e) => setFormState({...formState, fatherName: e.target.value})} /></div>
                    <div><label className={labelClass}>Mother Name</label><input type="text" value={formState.motherName || ''} className={inputClass} onChange={(e) => setFormState({...formState, motherName: e.target.value})} /></div>
                    <div><label className={labelClass}>Date of Birth</label><input type="date" value={formState.dob || ''} className={inputClass} onChange={(e) => setFormState({...formState, dob: e.target.value})} /></div>
                    <div><label className={labelClass}>Gender</label><select value={formState.gender || ''} className={inputClass} onChange={(e) => setFormState({...formState, gender: e.target.value})}><option value="">Select</option><option value="male">Male</option><option value="female">Female</option></select></div>
                    <div><label className={labelClass}>PAN</label><input type="text" value={formState.pan || ''} className={inputClass} onChange={(e) => setFormState({...formState, pan: e.target.value})} /></div>
                    <div><label className={labelClass}>Martial Status</label><input type="text" value={formState.martialStatus || ''} className={inputClass} onChange={(e) => setFormState({...formState, martialStatus: e.target.value})} /></div>
                    <div><label className={labelClass}>Citizenship</label><input type="text" value={formState.citizenship || ''} className={inputClass} onChange={(e) => setFormState({...formState, citizenship: e.target.value})} /></div>
                    <div><label className={labelClass}>Residential Status</label><input type="text" value={formState.residentialStatus || ''} className={inputClass} onChange={(e) => setFormState({...formState, residentialStatus: e.target.value})} /></div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-text">2. Proof of Identity & Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelClass}>Aadhar Number</label><input type="text" value={formState.aadhar || ''} className={inputClass} onChange={(e) => setFormState({...formState, aadhar: e.target.value})} /></div>
                    <div><label className={labelClass}>Aadhar Upload</label><input type="file" className={inputClass} onChange={(e) => e.target.files && handleUpload(e.target.files[0], 'Aadhar')} /></div>
                    <div><label className={labelClass}>PAN Number</label><input type="text" value={formState.panNumber || ''} className={inputClass} onChange={(e) => setFormState({...formState, panNumber: e.target.value})} /></div>
                    <div><label className={labelClass}>PAN Upload</label><input type="file" className={inputClass} onChange={(e) => e.target.files && handleUpload(e.target.files[0], 'PAN')} /></div>
                    <div><label className={labelClass}>Voter ID Number</label><input type="text" value={formState.voterId || ''} className={inputClass} onChange={(e) => setFormState({...formState, voterId: e.target.value})} /></div>
                    <div><label className={labelClass}>Voter ID Upload</label><input type="file" className={inputClass} onChange={(e) => e.target.files && handleUpload(e.target.files[0], 'VoterID')} /></div>
                    <div><label className={labelClass}>Bank Details Upload</label><input type="file" className={inputClass} onChange={(e) => e.target.files && handleUpload(e.target.files[0], 'BankDetails')} /></div>
                    <div><label className={labelClass}>Selfie Upload</label><input type="file" className={inputClass} onChange={(e) => e.target.files && handleUpload(e.target.files[0], 'Selfie')} /></div>
                    <div className="md:col-span-2"><label className={labelClass}>Address Line 1</label><input type="text" value={formState.addressLine1 || ''} className={inputClass} onChange={(e) => setFormState({...formState, addressLine1: e.target.value})} /></div>
                    <div className="md:col-span-2"><label className={labelClass}>Address Line 2</label><input type="text" value={formState.addressLine2 || ''} className={inputClass} onChange={(e) => setFormState({...formState, addressLine2: e.target.value})} /></div>
                    <div className="md:col-span-2"><label className={labelClass}>Address Line 3</label><input type="text" value={formState.addressLine3 || ''} className={inputClass} onChange={(e) => setFormState({...formState, addressLine3: e.target.value})} /></div>
                    <div><label className={labelClass}>District</label><input type="text" value={formState.district || ''} className={inputClass} onChange={(e) => setFormState({...formState, district: e.target.value})} /></div>
                    <div><label className={labelClass}>Pincode</label><input type="text" value={formState.pincode || ''} className={inputClass} onChange={(e) => setFormState({...formState, pincode: e.target.value})} /></div>
                    <div><label className={labelClass}>State</label><input type="text" value={formState.state || ''} className={inputClass} onChange={(e) => setFormState({...formState, state: e.target.value})} /></div>
                    <div><label className={labelClass}>Country</label><input type="text" value={formState.country || ''} className={inputClass} onChange={(e) => setFormState({...formState, country: e.target.value})} /></div>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-text">3. Employment Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2"><label className={labelClass}>Nature of Employment</label><input type="text" value={formState.natureOfEmployment || ''} className={inputClass} onChange={(e) => setFormState({...formState, natureOfEmployment: e.target.value})} /></div>
                    <div><label className={labelClass}>Current Company Name</label><input type="text" value={formState.companyName || ''} className={inputClass} onChange={(e) => setFormState({...formState, companyName: e.target.value})} /></div>
                    <div><label className={labelClass}>Designation</label><input type="text" value={formState.designation || ''} className={inputClass} onChange={(e) => setFormState({...formState, designation: e.target.value})} /></div>
                    <div className="md:col-span-2"><label className={labelClass}>Office Address</label><input type="text" value={formState.officeAddress || ''} className={inputClass} onChange={(e) => setFormState({...formState, officeAddress: e.target.value})} /></div>
                  </div>
                </div>
              )}
              <div className="flex gap-4">
                {step > 1 && (
                  <button type="button" onClick={() => setStep(step - 1)} className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-300 transition">
                    Previous
                  </button>
                )}
                <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition">
                  {step < 3 ? 'Next Step' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-card p-6 rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <h2 className="text-2xl font-bold mb-6 text-text">Customer List</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600">
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">DOB</th>
                    <th className="p-3">Address</th>
                    <th className="p-3">Pincode</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Documents</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-500">{c.id}</td>
                      <td className="p-3 font-medium text-text">{c.name}</td>
                      <td className="p-3 text-slate-600">{c.dob}</td>
                      <td className="p-3 text-slate-600">{c.address}</td>
                      <td className="p-3 text-slate-600">{c.pincode}</td>
                      <td className="p-3">
                        <button onClick={() => editCustomer(c)} className="text-primary hover:underline">Edit</button>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button onClick={() => viewDocument(c.id, 'Aadhar')} className="text-xs bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">Aadhar</button>
                        <button onClick={() => viewDocument(c.id, 'PAN')} className="text-xs bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">PAN</button>
                        <button onClick={() => viewDocument(c.id, 'VoterID')} className="text-xs bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">VoterID</button>
                        <button onClick={() => viewDocument(c.id, 'Selfie')} className="text-xs bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">Selfie</button>
                        <button onClick={() => viewDocument(c.id, 'BankDetails')} className="text-xs bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">Bank</button>
                      </td>
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
