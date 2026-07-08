import React from 'react';

export interface AfterSalesService {
  id: number;
  title: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  sortOrder: number;
}

interface AfterSalesServicesProps {
  services: AfterSalesService[];
}

export default function AfterSalesServices({ services }: AfterSalesServicesProps) {
  if (!services || services.length === 0) return null;

  return (
    <section className="mb-16">
      <h2 className="text-lg font-black text-gray-950 mb-5">After Sales Services</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {services.map((service) => (
          <div key={service.id} className="flex flex-col">
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-gray-900">
              <img
                src={service.imageUrl}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-8 left-4 right-4">
                <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                  {service.title}
                </h3>
              </div>
            </div>

            <a
              href={service.buttonLink}
              className="relative -mt-6 mx-auto z-10 bg-[#3643ba] hover:bg-[#2d38a0] text-white text-xs font-bold uppercase tracking-wide px-6 py-2.5 rounded-full shadow-md transition-colors whitespace-nowrap"
            >
              {service.buttonText}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}