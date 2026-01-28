import { useState } from 'react';
import { MediaDashboardLayout } from '@/components/media-dashboard/MediaDashboardLayout';
import { AlertCard } from '@/components/media-dashboard/AlertCard';
import { Week4EvaluationPanel } from '@/components/media-dashboard/Week4EvaluationPanel';
import { RetargetingPoolMonitor } from '@/components/media-dashboard/RetargetingPoolMonitor';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { useAlertsDashboard } from '@/hooks/useAlertsDashboard';
import { Loader2, Bell, BellOff } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MediaDashboardAlerts = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('adminAuthenticated') === 'true';
  });

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return <MediaDashboardAlertsContent onLogout={() => {
    sessionStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
  }} />;
};

const MediaDashboardAlertsContent = ({ onLogout }: { onLogout: () => void }) => {
  const {
    isLoading,
    alerts,
    criticalAlerts,
    triggers,
    currentWeek,
    currentPhase,
    retargetingPoolStatus,
    week4Evaluation,
    updateAlertStatus,
  } = useAlertsDashboard();

  const openAlerts = alerts.filter(a => a.status === 'open');
  const acknowledgedAlerts = alerts.filter(a => a.status === 'acknowledged');

  // Find action message for alert
  const getActionMessage = (alert: typeof alerts[0]) => {
    const trigger = triggers.find(t => t.id === alert.trigger_id);
    return trigger?.action_fail || undefined;
  };

  return (
    <MediaDashboardLayout onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Decision Triggers & Alerts
            </h1>
            <p className="text-slate-500 mt-1">
              {currentPhase.name} • Week {currentWeek}/13
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {criticalAlerts.length > 0 ? (
              <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                <Bell className="h-4 w-4" />
                {criticalAlerts.length} critical
              </span>
            ) : (
              <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                <BellOff className="h-4 w-4" />
                No critical alerts
              </span>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <>
            {/* Active Alerts Section */}
            <Tabs defaultValue="open" className="w-full">
              <TabsList>
                <TabsTrigger value="open" className="flex items-center gap-2">
                  Open Alerts
                  {openAlerts.length > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {openAlerts.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="acknowledged">
                  Acknowledged ({acknowledgedAlerts.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="open" className="mt-4">
                {openAlerts.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <BellOff className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>Geen open alerts</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {openAlerts.map(alert => (
                      <AlertCard
                        key={alert.id}
                        alert={alert}
                        actionMessage={getActionMessage(alert)}
                        onAcknowledge={() => updateAlertStatus(alert.id, 'acknowledged')}
                        onResolve={() => updateAlertStatus(alert.id, 'resolved', 'Admin')}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="acknowledged" className="mt-4">
                {acknowledgedAlerts.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <p>Geen acknowledged alerts</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {acknowledgedAlerts.map(alert => (
                      <AlertCard
                        key={alert.id}
                        alert={alert}
                        actionMessage={getActionMessage(alert)}
                        onAcknowledge={() => {}}
                        onResolve={() => updateAlertStatus(alert.id, 'resolved', 'Admin')}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Week 4 Evaluation & Retargeting Pool */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentWeek >= 4 && (
                <Week4EvaluationPanel
                  evaluations={week4Evaluation}
                  currentWeek={currentWeek}
                  currentPhase={currentPhase}
                />
              )}
              <RetargetingPoolMonitor status={retargetingPoolStatus} />
            </div>
          </>
        )}
      </div>
    </MediaDashboardLayout>
  );
};

export default MediaDashboardAlerts;
