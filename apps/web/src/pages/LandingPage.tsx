import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { ArrowRight, Check, Menu, X, Shield, Zap, TrendingUp, Clock } from 'lucide-react';
import gsap from 'gsap';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

/* ── Status pill ── */
const Pill: React.FC<{ label: string; variant: 'black' | 'emerald' | 'gray' }> = ({ label, variant }) => {
  const cls = variant === 'black' ? 'badge badge-amber' : variant === 'emerald' ? 'badge badge-emerald' : 'badge badge-gray';
  return <span className={cls}><span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />{label}</span>;
};

export const LandingPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const stat1Ref = useRef<HTMLParagraphElement>(null);
  const stat2Ref = useRef<HTMLParagraphElement>(null);
  const stat3Ref = useRef<HTMLParagraphElement>(null);
  const stat4Ref = useRef<HTMLParagraphElement>(null);
  const statsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Initialize Locomotive Scroll for smooth inertia scrolling
    let scrollInstance: LocomotiveScroll | null = null;
    if (containerRef.current) {
      try {
        scrollInstance = new LocomotiveScroll({
          el: containerRef.current,
          smooth: true,
          multiplier: 1.0,
        });
      } catch (e) {
        console.log('Locomotive scroll fallback active');
      }
    }

    // 2. GSAP Smooth Continuous Animated Underline under "dispatch chaos"
    if (underlineRef.current) {
      gsap.fromTo(
        underlineRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 2.2,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
        }
      );
    }

    // 3. GSAP Floating Motion for Hero Mockup Card (Guarantees card NEVER disappears)
    if (heroCardRef.current) {
      gsap.to(heroCardRef.current, {
        y: -12,
        duration: 2.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }

    // 4. GSAP 3.0s Smooth Number Counter Animation (Triggers ONLY when user scrolls down)
    const el = statsSectionRef.current;
    if (el) {
      let hasRun = false;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasRun) {
            hasRun = true;

            // Stat 1: $0.0M+ -> $18.4M+
            const obj1 = { val: 0 };
            gsap.to(obj1, {
              val: 18.4,
              duration: 3.0,
              ease: 'power2.out',
              onUpdate: () => {
                if (stat1Ref.current) stat1Ref.current.innerText = `$${obj1.val.toFixed(1)}M+`;
              },
            });

            // Stat 2: < 0s -> < 45s
            const obj2 = { val: 0 };
            gsap.to(obj2, {
              val: 45,
              duration: 3.0,
              ease: 'power2.out',
              onUpdate: () => {
                if (stat2Ref.current) stat2Ref.current.innerText = `< ${Math.round(obj2.val)}s`;
              },
            });

            // Stat 3: 0.00% -> 99.82%
            const obj3 = { val: 0 };
            gsap.to(obj3, {
              val: 99.82,
              duration: 3.0,
              ease: 'power2.out',
              onUpdate: () => {
                if (stat3Ref.current) stat3Ref.current.innerText = `${obj3.val.toFixed(2)}%`;
              },
            });

            // Stat 4: Same Day
            if (stat4Ref.current) {
              gsap.fromTo(
                stat4Ref.current,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 3.0, ease: 'power2.out' }
              );
            }

            observer.unobserve(el);
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(el);

      return () => {
        observer.disconnect();
        if (scrollInstance) scrollInstance.destroy();
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      data-scroll-container
      className="min-h-screen bg-[#FFFDF2] text-[#0F0F0F] font-sans antialiased overflow-x-hidden relative"
    >
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-100" />
      </div>

      {/* ══ NAVBAR ══ */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FFFDF2]/95 border-b-2 border-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Logo size="md" darkText={true} />
          <nav className="hidden md:flex items-center gap-8 text-xs font-extrabold text-[#0F0F0F]">
            <a href="#features" className="hover:underline transition-all">Features</a>
            <a href="#workflow" className="hover:underline transition-all">Workflow</a>
            <a href="#pricing" className="hover:underline transition-all">Pricing</a>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-xs font-extrabold text-[#0F0F0F] hover:underline px-3 py-2">Sign in</Link>
            <Link to="/register" className="btn-amber px-5 py-2.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5">Start free trial <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="flex md:hidden items-center gap-2">
            <Link to="/register" className="btn-amber px-3 py-1.5 rounded-lg text-xs font-extrabold">Free Trial</Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="btn-ghost p-2 rounded-lg" aria-label="Menu">
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t-2 border-[#0F0F0F] bg-[#FFFDF2]">
            <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col gap-1">
              {[{ href: '#features', label: 'Features' }, { href: '#workflow', label: 'Workflow' }, { href: '#pricing', label: 'Pricing' }].map(l => (
                <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="text-xs font-extrabold py-2.5 text-[#0F0F0F] border-b border-[#0F0F0F]/15">{l.label}</a>
              ))}
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-xs font-extrabold py-2.5 text-[#0F0F0F]">Sign in</Link>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10" data-scroll-section>

        {/* ══ HERO ══ */}
        <section className="pt-20 pb-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F0F0F] text-[#FFFDF2]">
                <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
                <span className="label-ui text-[10px] text-[#FFFDF2]">FIELD OPERATIONS INFRASTRUCTURE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F0F0F] leading-[1.15]">
                Eliminate<br />
                <span className="relative inline-block my-1">
                  dispatch chaos
                  <span
                    ref={underlineRef}
                    className="absolute -bottom-1 left-0 w-full h-[5px] rounded-full bg-[#D97706] shadow-sm"
                  />
                </span>
                <br />
                for trade fleets.
              </h1>

              <p className="text-sm sm:text-base text-[#222222] font-semibold leading-relaxed max-w-lg">
                The technical field service management platform built for modern plumbing, electrical, HVAC, and cleaning businesses. High-contrast, clean, purpose-built.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <Link to="/register" className="btn-amber px-7 py-3.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2">Start free trial <ArrowRight className="w-4 h-4" /></Link>
                <a href="#features" className="btn-ghost px-7 py-3.5 rounded-lg text-xs font-extrabold text-center flex items-center justify-center">See how it works</a>
              </div>

              <div className="flex items-center gap-5 pt-1">
                {['No credit card required', '14-day free trial', 'Cancel anytime'].map(t => (
                  <div key={t} className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#047857]" /><span className="text-xs font-extrabold text-[#0F0F0F]">{t}</span></div>
                ))}
              </div>
            </div>

            {/* Right Column: Dispatch Board Mockup Panel with GSAP Floating Animation (ALWAYS VISIBLE) */}
            <div ref={heroCardRef} className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden shadow-2xl bg-[#FFFDF2] border-2 border-[#0F0F0F]">
                <div className="flex items-center justify-between px-4 py-3 border-b-2 border-[#0F0F0F] bg-[#0F0F0F] text-[#FFFDF2]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFFDF2]/30" /><span className="w-2.5 h-2.5 rounded-full bg-[#FFFDF2]/30" /><span className="w-2.5 h-2.5 rounded-full bg-[#FFFDF2]/30" />
                    <span className="ml-2 text-xs font-mono text-[#FFFDF2] font-bold">dispatch.fieldloop.io</span>
                  </div>
                  <Pill label="LIVE MATRIX" variant="black" />
                </div>
                <div className="p-4 space-y-3">
                  <p className="label-ui text-[10px] text-[#0F0F0F]">Active Work Orders</p>
                  {[
                    { id: '8492', title: 'Commercial HVAC Diagnostic', tech: 'M. Torres', status: 'EN ROUTE', pill: 'black' as const },
                    { id: '8493', title: '200A Panel Upgrade', tech: 'A. Rivera', status: 'COMPLETED', pill: 'emerald' as const },
                    { id: '8494', title: 'Main Line Leak Repair', tech: 'Unassigned', status: 'SCHEDULED', pill: 'gray' as const },
                  ].map(j => (
                    <div key={j.id} className="flex items-center justify-between gap-3 p-3.5 rounded-lg bg-[#F5F3E9] border-2 border-[#0F0F0F]">
                      <div className="min-w-0">
                        <p className="text-[10px] font-mono font-extrabold text-[#0F0F0F]">#{j.id}</p>
                        <p className="text-xs font-extrabold text-[#0F0F0F] truncate">{j.title}</p>
                        <p className="text-[11px] text-[#333333] font-bold mt-0.5">{j.tech}</p>
                      </div>
                      <Pill label={j.status} variant={j.pill} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ STATS STRIP WITH GSAP 3s ANIMATED COUNTERS ══ */}
        <section ref={statsSectionRef} className="py-12 border-y-2 border-[#0F0F0F] bg-[#0F0F0F] text-[#FFFDF2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 text-center">
              <p ref={stat1Ref} className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFFDF2]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                $0.0M+
              </p>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#E5E0D0] mt-1.5">Revenue Dispatched</p>
            </div>

            <div className="p-4 text-center">
              <p ref={stat2Ref} className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFFDF2]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                &lt; 0s
              </p>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#E5E0D0] mt-1.5">Avg Dispatch Time</p>
            </div>

            <div className="p-4 text-center">
              <p ref={stat3Ref} className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFFDF2]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                0.00%
              </p>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#E5E0D0] mt-1.5">On-Time Arrival</p>
            </div>

            <div className="p-4 text-center">
              <p ref={stat4Ref} className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFFDF2]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                Same Day
              </p>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#E5E0D0] mt-1.5">Billing Latency</p>
            </div>
          </div>
        </section>

        {/* ══ PROBLEM/SOLUTION ══ */}
        <section id="features" className="py-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F0F0F] mb-4">Built for trade businesses that demand sophistication.</h2>
              <p className="text-sm font-semibold text-[#222222]">Generic spreadsheets cause missed appointments, lost invoices, and unbilled labor hours.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { n: '01', title: 'Double-Bookings & Lost Jobs', body: 'Dispatchers manage schedules via phone calls while techs drive, causing overlapping work orders.', fix: 'Automated Skill & Conflict Guard' },
                { n: '02', title: 'Technicians Going Dark', body: 'Office managers spend hours texting field staff for ETAs while customers call asking where the van is.', fix: 'Live GPS Telemetry & Customer Sync' },
                { n: '03', title: 'Delayed Invoices & Lost Parts', body: 'Paper work orders sit in vans for weeks — unbilled fittings, forgotten fees, delayed cash flow.', fix: 'Instant On-Site Digital Sign-off & Billing' },
              ].map((item) => (
                <div key={item.n} className="panel-card p-6 rounded-xl h-full flex flex-col bg-[#FFFDF2] border-2 border-[#0F0F0F]">
                  <div className="flex items-start justify-between mb-4">
                    <span className="label-ui text-[10px] text-[#0F0F0F]">PAIN POINT {item.n}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#0F0F0F] mb-2">{item.title}</h3>
                  <p className="text-xs font-semibold text-[#333333] leading-relaxed flex-1">{item.body}</p>
                  <div className="mt-5 pt-4 border-t-2 border-[#0F0F0F] flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#047857] shrink-0" />
                    <span className="text-xs font-extrabold text-[#0F0F0F]">{item.fix}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PRICING ══ */}
        <section id="pricing" className="py-24 px-4 sm:px-6 border-t-2 border-[#0F0F0F] bg-[#F5F3E9]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F0F0F] mb-4">Predictable, transparent pricing.</h2>
              <p className="text-sm font-semibold text-[#222222]">No hidden fees. No per-job commissions. Cancel anytime.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
              {/* Starter */}
              <div className="panel-card p-6 rounded-xl flex flex-col h-full bg-[#FFFDF2] border-2 border-[#0F0F0F]">
                <h3 className="text-lg font-extrabold text-[#0F0F0F]">Starter</h3>
                <p className="text-xs font-bold text-[#555555] mt-0.5 mb-5">1–3 technicians</p>
                <div className="mb-5"><span className="text-3xl font-extrabold text-[#0F0F0F]" style={{ fontVariantNumeric: 'tabular-nums' }}>$49</span><span className="text-xs font-bold text-[#555555]"> /mo</span></div>
                <ul className="space-y-2.5 flex-1 text-xs font-bold text-[#0F0F0F]">
                  {['Up to 3 Technicians', 'Core Dispatch Board', 'Customer Directory', 'PDF Invoicing'].map(f => (<li key={f} className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0F0F0F] shrink-0" />{f}</li>))}
                </ul>
                <Link to="/register" className="btn-ghost mt-6 py-3 rounded-lg text-xs font-extrabold text-center block">Start Trial</Link>
              </div>
              {/* Pro — Featured */}
              <div className="panel-featured p-6 rounded-xl flex flex-col h-full bg-[#0F0F0F] text-[#FFFDF2] border-2 border-[#0F0F0F]">
                <span className="label-ui text-[10px] text-[#FFFDF2] mb-0.5">RECOMMENDED</span>
                <h3 className="text-lg font-extrabold text-[#FFFDF2]">Professional</h3>
                <p className="text-xs font-bold text-[#E5E0D0] mt-0.5 mb-5">Growing fleets</p>
                <div className="mb-5"><span className="text-3xl font-extrabold text-[#FFFDF2]" style={{ fontVariantNumeric: 'tabular-nums' }}>$129</span><span className="text-xs font-bold text-[#E5E0D0]"> /mo</span></div>
                <ul className="space-y-2.5 flex-1 text-xs font-bold text-[#FFFDF2]">
                  {['Up to 15 Technicians', 'Live GPS Telemetry', 'Digital Signatures', 'Revenue Reports', 'Priority Support'].map(f => (<li key={f} className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#FFFDF2] shrink-0" />{f}</li>))}
                </ul>
                <Link to="/register" className="btn-amber mt-6 py-3 rounded-lg text-xs font-extrabold text-center block bg-[#FFFDF2] text-[#0F0F0F] border-[#FFFDF2] hover:bg-[#0F0F0F] hover:text-[#FFFDF2]">Start Trial</Link>
              </div>
              {/* Enterprise */}
              <div className="panel-card p-6 rounded-xl flex flex-col h-full bg-[#FFFDF2] border-2 border-[#0F0F0F]">
                <h3 className="text-lg font-extrabold text-[#0F0F0F]">Enterprise</h3>
                <p className="text-xs font-bold text-[#555555] mt-0.5 mb-5">Multi-branch</p>
                <div className="mb-5"><span className="text-3xl font-extrabold text-[#0F0F0F]" style={{ fontVariantNumeric: 'tabular-nums' }}>$299</span><span className="text-xs font-bold text-[#555555]"> /mo</span></div>
                <ul className="space-y-2.5 flex-1 text-xs font-bold text-[#0F0F0F]">
                  {['Unlimited Technicians', 'Dedicated Account Manager', 'Custom Domain', '24/7 Phone Support'].map(f => (<li key={f} className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#0F0F0F] shrink-0" />{f}</li>))}
                </ul>
                <Link to="/register" className="btn-ghost mt-6 py-3 rounded-lg text-xs font-extrabold text-center block">Contact Sales</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ══ */}
        <section className="py-24 px-4 sm:px-6 border-t-2 border-[#0F0F0F]">
          <div className="max-w-7xl mx-auto">
            <div className="p-12 sm:p-16 rounded-xl text-center bg-[#0F0F0F] text-[#FFFDF2]">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto mb-6 text-[#FFFDF2]">Streamline your trade fleet today.</h2>
              <Link to="/register" className="btn-amber inline-flex items-center gap-2 px-8 py-4 rounded-lg text-xs font-extrabold bg-[#FFFDF2] text-[#0F0F0F] hover:bg-[#0F0F0F] hover:text-[#FFFDF2]">Start free trial <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </section>
      </main>

      {/* ══ FOOTER ══ */}
      <footer className="border-t-2 border-[#0F0F0F] py-8 px-4 sm:px-6 bg-[#0F0F0F] text-[#FFFDF2]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" darkText={false} />
          <p className="text-xs font-mono font-bold text-[#E5E0D0]">© 2026 Fieldloop Technologies Inc.</p>
          <div className="flex items-center gap-5 text-xs font-bold text-[#E5E0D0]">
            {['Privacy', 'Terms', 'Security'].map(l => (<a key={l} href="#" className="hover:text-[#FFFDF2] transition-colors">{l}</a>))}
          </div>
        </div>
      </footer>
    </div>
  );
};
