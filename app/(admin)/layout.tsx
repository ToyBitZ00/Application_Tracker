'use client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#f4f7fb]">
      
      {/* 
        THE FIX: Added 'min-h-0 overflow-hidden' here. 
        This forces the wrapper to lock to the screen height 
        and allows the <main> tag inside your pages to scroll properly!
      */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {children}
      </div>

      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar { 
          display: none; 
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide { 
          -ms-overflow-style: none; 
          scrollbar-width: none; 
        }
      `}</style>
    </div>
  );
}