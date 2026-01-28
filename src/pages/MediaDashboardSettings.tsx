import { useState } from 'react';
import { MediaDashboardLayout } from '@/components/media-dashboard/MediaDashboardLayout';
import { MetaSyncSettings } from '@/components/media-dashboard/MetaSyncSettings';
import { AdminLogin } from '@/components/admin/AdminLogin';

const MediaDashboardSettings = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('adminAuthenticated') === 'true';
  });

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <MediaDashboardLayout onLogout={handleLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600">Configure Meta Ads sync and dashboard settings</p>
        </div>

        <MetaSyncSettings />
      </div>
    </MediaDashboardLayout>
  );
};

export default MediaDashboardSettings;
