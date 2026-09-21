import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

export default function AnnouncementBar() {
  const { announcement } = useAdmin();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('gadgetshop_announcement_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('gadgetshop_announcement_dismissed', 'true');
  };

  if (!announcement?.enabled || isDismissed) {
    return null;
  }

  return (
    <div className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2 text-center flex-wrap">
          <span className="font-semibold text-slate-200">
            {announcement.message}
          </span>
          {announcement.linkText && announcement.linkUrl && (
            <Link
              to={announcement.linkUrl}
              className="inline-flex items-center gap-1 font-bold text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors ml-1"
            >
              {announcement.linkText}
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-800"
          aria-label="Close announcement bar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
