import React, { useMemo } from 'react';
import { Eye, ChevronRight, Sparkles } from 'lucide-react';
import { Part } from '../types';

interface UsedArrivalsCarouselProps {
  onAddToCart: (part: Part) => void;
  onViewDetails: (part: Part) => void;
  onScrollCategory: (category: 'Engine' | 'Transmission') => void;
}

export default function UsedArrivalsCarousel({ onAddToCart, onViewDetails, onScrollCategory }: UsedArrivalsCarouselProps) {
  const engineArrivals = useMemo<Part[]>(() => [
    {
      id: 'arr-en-1',
      sku: 'BMW-M2-S58',
      name: '2024 BMW M2 3.0L Used Engine',
      category: 'Engine',
      condition: 'Used - Grade A',
      price: 22800,
      cost: 11000,
      stock: 3,
      warehouseLocation: 'Bay 4, Row A',
      fitment: { yearStart: 2021, yearEnd: 2024, make: 'BMW', models: ['M2', 'M3', 'M4'], engines: ['3.0L S58'] },
      description: 'High performance S58 twin turbo inline-6 engine. Pulled from low-mileage 2024 BMW M2. Tested with excellent compression.',
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop',
      oemNumber: 'BMW-S58-B30A',
      brand: 'BMW OEM',
      weightLbs: 380,
    },
    {
      id: 'arr-en-2',
      sku: 'TOY-SUP-B58',
      name: '2023 Toyota Supra 3.0L Used Engine',
      category: 'Engine',
      condition: 'Used - Grade A',
      price: 9400,
      cost: 4900,
      stock: 2,
      warehouseLocation: 'Bay 4, Row B',
      fitment: { yearStart: 2020, yearEnd: 2024, make: 'Toyota', models: ['Supra'], engines: ['3.0L B58'] },
      description: 'B58 TwinScroll Turbo engine assembly from late-model Supra. Thoroughly tested, runs clean.',
      image: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=600&auto=format&fit=crop',
      oemNumber: 'TOY-19000-W001',
      brand: 'Toyota OEM',
      weightLbs: 360,
    },
    {
      id: 'arr-en-3',
      sku: 'FOR-RAP-V6',
      name: '2022 Ford F-150 Raptor 3.5L Used Engine',
      category: 'Engine',
      condition: 'Used - Grade B',
      price: 6850,
      cost: 3500,
      stock: 4,
      warehouseLocation: 'Bay 5, Row C',
      fitment: { yearStart: 2021, yearEnd: 2023, make: 'Ford', models: ['F-150 Raptor'], engines: ['3.5L EcoBoost'] },
      description: '3.5L High Out V6 EcoBoost engine. Grade B with minor scuffs on intake casing, perfect internals.',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop',
      oemNumber: 'FOR-JL3Z-6006-A',
      brand: 'Ford OEM',
      weightLbs: 410,
    },
    {
      id: 'arr-en-4',
      sku: 'CHE-COR-LS3',
      name: '2021 Chevy Corvette 6.2L Used Engine',
      category: 'Engine',
      condition: 'OEM Remanufactured',
      price: 11200,
      cost: 6000,
      stock: 2,
      warehouseLocation: 'Bay 1, Row A',
      fitment: { yearStart: 2014, yearEnd: 2022, make: 'Chevrolet', models: ['Corvette', 'Camaro SS'], engines: ['6.2L LT1 V8'] },
      description: '6.2L LT1 naturally aspirated V8. Direct replacement for modern Corvettes or custom hotrod swap core.',
      image: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=600&auto=format&fit=crop',
      oemNumber: 'GM-19355573',
      brand: 'Chevrolet OEM',
      weightLbs: 450,
    }
  ], []);

  const transmissionArrivals = useMemo<Part[]>(() => [
    {
      id: 'arr-tx-1',
      sku: 'BMW-ZF-8HP',
      name: '2023 BMW M340i ZF 8HP51 Used Transmission',
      category: 'Transmission',
      condition: 'Used - Grade A',
      price: 3850,
      cost: 1900,
      stock: 3,
      warehouseLocation: 'Transmission Bay 2',
      fitment: { yearStart: 2019, yearEnd: 2024, make: 'BMW', models: ['3-Series', '4-Series', 'Z4'], engines: ['3.0L B58'] },
      description: 'Excellent condition 8-speed automatic transmission. Synced mechatronics unit, shifts sharp like original.',
      image: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=600&auto=format&fit=crop',
      oemNumber: 'BMW-240086960',
      brand: 'ZF OEM',
      weightLbs: 180,
    },
    {
      id: 'arr-tx-2',
      sku: 'SUB-WRX-6MT',
      name: '2022 Subaru WRX 6-Speed Manual Transmission',
      category: 'Transmission',
      condition: 'Used - Grade A',
      price: 2950,
      cost: 1400,
      stock: 2,
      warehouseLocation: 'Transmission Bay 3',
      fitment: { yearStart: 2015, yearEnd: 2023, make: 'Subaru', models: ['WRX'], engines: ['2.0L H4 Turbo', '2.4L H4 Turbo'] },
      description: 'Tough, driver-focused 6-speed manual gearbox with standard center differential of WRX chassis.',
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop',
      oemNumber: 'SUB-32000AJ580',
      brand: 'Subaru OEM',
      weightLbs: 165,
    },
    {
      id: 'arr-tx-3',
      sku: 'FORD-10R80',
      name: '2022 Ford Mustang 10R80 10-Speed Transmission',
      category: 'Transmission',
      condition: 'Used - Grade B',
      price: 2600,
      cost: 1200,
      stock: 4,
      warehouseLocation: 'Transmission Bay 1',
      fitment: { yearStart: 2018, yearEnd: 2024, make: 'Ford', models: ['Mustang GT', 'F-150'], engines: ['5.0L V8', '3.5L V6'] },
      description: 'Innovative Ford-engineered 10-speed overdrive automatic. High strength clutch packs post inspection.',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=600&auto=format&fit=crop',
      oemNumber: 'FOR-JL1p-7000-AD',
      brand: 'Ford OEM',
      weightLbs: 230,
    }
  ], []);

  // Curated specs helpers so mock arrivals represent accurate Miles and Grade as described
  const specMap: Record<string, { options: string; miles: string; grade: string }> = {
    'arr-en-1': { options: '3.0L Twin-Turbo', miles: '6,570 mi', grade: 'A' },
    'arr-en-2': { options: '3.0L Inline-6', miles: '18,450 mi', grade: 'A' },
    'arr-en-3': { options: '3.5L EcoBoost', miles: '24,700 mi', grade: 'B' },
    'arr-en-4': { options: '6.2L LT1 V8', miles: '1,200 mi', grade: 'A+' },
    'arr-tx-1': { options: 'ZF 8-Speed Auto', miles: '11,400 mi', grade: 'A' },
    'arr-tx-2': { options: '6-Speed Manual', miles: '15,320 mi', grade: 'A' },
    'arr-tx-3': { options: '10R80 10-Speed', miles: '34,900 mi', grade: 'B' },
  };

  return (
    <div id="used-arrivals-carousels-container" className="space-y-12">
      {/* 1. Used Engines Arrival Carousel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase flex items-center gap-1.5 font-display">
              <span className="w-2.5 h-2.5 bg-orange-600 rounded-full" />
              New Arrival Used Engines
            </h2>
            <p className="text-[10px] text-slate-400">Tested assemblies matching strict cylinder and oil pan validations.</p>
          </div>
          <button
            onClick={() => onScrollCategory('Engine')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5"
          >
            <span>View All Engines</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Scrolling horizontal container */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {engineArrivals.map((part) => {
            const spec = specMap[part.id] || { options: 'OEM Spec', miles: 'Low-Mile', grade: 'A' };
            return (
              <div
                key={part.id}
                className="w-72 bg-white rounded-xl border border-slate-200 flex-none flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md transition group"
              >
                <div className="relative h-44 bg-slate-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={part.image}
                    alt={part.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(part.sku)}/600/400`;
                    }}
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-1 text-[9px] text-amber-400 font-bold border border-amber-400/30 rounded flex items-center justify-center text-center">
                    !!Important! This is not the real image!
                  </div>
                  <button
                    onClick={() => onViewDetails(part)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white text-slate-700 shadow-sm transition duration-200"
                    title="View details & specs"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider font-mono">SKU: {part.sku}</span>
                    <h3
                      className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 hover:text-orange-600 transition cursor-pointer"
                      onClick={() => onViewDetails(part)}
                    >
                      {part.name}
                    </h3>

                    {/* Specifications list box */}
                    <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-500 font-sans border-t border-b border-slate-100 py-1.5 mt-2">
                      <div>
                        <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">Options</span>
                        <strong className="text-slate-950 text-[10px] truncate block font-extrabold">{spec.options}</strong>
                      </div>
                      <div className="border-l border-slate-100 pl-1.5">
                        <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">Miles</span>
                        <strong className="text-slate-950 text-[10px] block font-extrabold">{spec.miles}</strong>
                      </div>
                      <div className="border-l border-slate-100 pl-1.5">
                        <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">Grade</span>
                        <strong className="text-emerald-700 text-[10px] block font-black">{spec.grade}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] text-slate-400 block uppercase font-bold tracking-wider leading-none">Price</span>
                      <strong className="text-sm font-black text-slate-900 block">${part.price.toLocaleString()}</strong>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => onViewDetails(part)}
                        className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg transition"
                      >
                        More Opts
                      </button>
                      <button
                        onClick={() => onAddToCart(part)}
                        className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-[10px] rounded-lg shadow-xs transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Used Transmissions Arrival Carousel */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase flex items-center gap-1.5 font-display">
              <span className="w-2.5 h-2.5 bg-orange-600 rounded-full" />
              New Arrival Used Transmissions
            </h2>
            <p className="text-[10px] text-slate-400">Dyno-tested torque converters and active hydraulics.</p>
          </div>
          <button
            onClick={() => onScrollCategory('Transmission')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5"
          >
            <span>View All Transmissions</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Scrolling horizontal container */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {transmissionArrivals.map((part) => {
            const spec = specMap[part.id] || { options: 'OEM Spec', miles: 'Low-Mile', grade: 'A' };
            return (
              <div
                key={part.id}
                className="w-72 bg-white rounded-xl border border-slate-200 flex-none flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md transition group"
              >
                <div className="relative h-44 bg-slate-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={part.image}
                    alt={part.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(part.sku)}/600/400`;
                    }}
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-1 text-[9px] text-amber-400 font-bold border border-amber-400/30 rounded flex items-center justify-center text-center">
                    !!Important! This is not the real image!
                  </div>
                  <button
                    onClick={() => onViewDetails(part)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white text-slate-700 shadow-sm transition duration-200"
                    title="View details & specs"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider font-mono">SKU: {part.sku}</span>
                    <h3
                      className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 hover:text-orange-600 transition cursor-pointer"
                      onClick={() => onViewDetails(part)}
                    >
                      {part.name}
                    </h3>

                    {/* Specifications list box */}
                    <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-500 font-sans border-t border-b border-slate-100 py-1.5 mt-2">
                      <div>
                        <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">Options</span>
                        <strong className="text-slate-950 text-[10px] truncate block font-extrabold">{spec.options}</strong>
                      </div>
                      <div className="border-l border-slate-100 pl-1.5">
                        <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">Miles</span>
                        <strong className="text-slate-950 text-[10px] block font-extrabold">{spec.miles}</strong>
                      </div>
                      <div className="border-l border-slate-100 pl-1.5">
                        <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">Grade</span>
                        <strong className="text-emerald-700 text-[10px] block font-black">{spec.grade}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] text-slate-400 block uppercase font-bold tracking-wider leading-none">Price</span>
                      <strong className="text-sm font-black text-slate-900 block">${part.price.toLocaleString()}</strong>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => onViewDetails(part)}
                        className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg transition"
                      >
                        More Opts
                      </button>
                      <button
                        onClick={() => onAddToCart(part)}
                        className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-[10px] rounded-lg shadow-xs transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
