import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FaqItem {
  q: string;
  a: string;
}

export default function UsedFaqAccordion() {
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  const faqs: FaqItem[] = [
    {
      q: 'Is it a good choice to buy used transmission?',
      a: 'Yes! Buying a high-quality used or OEM remanufactured transmission is a highly cost-effective and smart choice. You can save up to 60-70% compared to brand-new dealer retail prices. Every unit we supply undergoes strict diagnostic testing and fluid checks to guarantee performance.'
    },
    {
      q: 'Why purchase used transmissions here?',
      a: 'At Turbo Auto Parts, we specialize in high-grade engines and transmissions. Every single part is meticulously certified, comes with a solid warranty of up to 36 months, and includes free delivery to commercial addresses. You bypass middleman fees and receive dedicated support from ASE-certified gear experts.'
    },
    {
      q: 'When is the time to replace transmission?',
      a: 'Common indicator signs include severe transmission fluid leaks, gear slipping, delays when shifting, burning smells, grinding noises, and an active dashboard Check Engine Light representing solenoid or hydraulic faults. Replacing early prevents sudden roadside breakdowns.'
    },
    {
      q: 'Why should you replace faulty transmission immediately?',
      a: 'Driving with a faulty transmission can cause severe stress on your vehicle\'s engine, damage drive axles, compromise road safety, and risk catastrophic complete mechanical failure. Upgrading immediately ensures safety and protects the overall structural integrity of the drivetrain.'
    },
    {
      q: 'Are used car engines cost-effective?',
      a: 'Absolutely. Replacing your engine with a tested, low-mileage used engine costs only a fraction of purchasing a brand-new vehicle or executing an extensive engine rebuild. It extends your car\'s lifespan instantly without committing to long-term auto loans.'
    },
    {
      q: 'Are used car engines reliable?',
      a: 'Yes, provided they are sourced from a reputable distributor like Turbo Auto Parts. Our team performs compression validation, leak-down tests, and visual internal bore scans to ensure every cylinder meets strict OEM quality thresholds.'
    },
    {
      q: 'How compatible are older engines?',
      a: 'Very compatible. Our extensive vehicle fitment database maps engines carefully across year ranges and chassis options. When you input your vehicle VIN or specifications in our search wizard, our systems verify physical engine bay clearances and electrical harness pin compatibility.'
    }
  ];

  return (
    <section id="faq-section" className="bg-slate-50 py-14 px-4 border-t border-slate-200">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-black text-slate-900 uppercase">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know about used engines and transmission fitting.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white border text-xs border-slate-200 rounded-xl overflow-hidden transition-all duration-200 shadow-xs"
              >
                <button
                  onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-slate-800 hover:bg-slate-50 transition select-none cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-orange-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-slate-500 text-xs leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
