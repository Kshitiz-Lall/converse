import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  UsersIcon,
  SettingsIcon,
  DatabaseIcon,
  ShieldIcon,
  BarChartIcon,
  FileTextIcon,
  AlertCircleIcon,
  ActivityIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/apis/adminService';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for admin tools
const adminTools = [
  {
    id: 'user-management',
    title: 'User Management',
    description: 'Manage system users, roles and permissions',
    icon: <UsersIcon className="w-8 h-8" />,
    path: '/admin/users',
    available: true,
    category: 'Administration',
  },
  {
    id: 'system-settings',
    title: 'System Settings',
    description: 'Configure application settings and preferences',
    icon: <SettingsIcon className="w-8 h-8" />,
    path: '/admin/settings',
    available: true,
    category: 'Administration',
  },
  {
    id: 'database',
    title: 'Database',
    description: 'Access and manage application data',
    icon: <DatabaseIcon className="w-8 h-8" />,
    path: '/admin/database',
    available: true,
    category: 'Administration',
  },
  {
    id: 'security',
    title: 'Security',
    description: 'View security logs and configure access controls',
    icon: <ShieldIcon className="w-8 h-8" />,
    path: '/admin/security',
    available: true,
    category: 'Security',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'View system usage statistics and metrics',
    icon: <BarChartIcon className="w-8 h-8" />,
    path: '/admin/analytics',
    available: true,
    category: 'Monitoring',
  },
  {
    id: 'audit-logs',
    title: 'Audit Logs',
    description: 'Review system activity and changes',
    icon: <FileTextIcon className="w-8 h-8" />,
    path: '/admin/logs',
    available: true,
    category: 'Monitoring',
  },
  {
    id: 'alerts',
    title: 'Alerts',
    description: 'Configure and view system alerts',
    icon: <AlertCircleIcon className="w-8 h-8" />,
    path: '/admin/alerts',
    available: false,
    category: 'Monitoring',
  },
  {
    id: 'system-health',
    title: 'System Health',
    description: 'Monitor server status and performance',
    icon: <ActivityIcon className="w-8 h-8" />,
    path: '/admin/health',
    available: true,
    category: 'Monitoring',
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Group tools by category
  const toolsByCategory = adminTools.reduce<Record<string, typeof adminTools>>((acc, tool) => {
    const category = tool.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tool);
    return acc;
  }, {});

  // Quick stats data
  const quickStats = [
    { title: 'Total Users', value: '1,248', change: '+12%', positive: true },
    { title: 'Active Sessions', value: '84', change: '-5%', positive: false },
    { title: 'Storage Used', value: '78%', change: '+3%', positive: false },
    { title: 'Uptime', value: '99.9%', change: '0%', positive: true },
  ];

  // Recent activity data
  const recentActivity = [
    { id: 1, user: 'admin', action: 'Updated system settings', time: '2 minutes ago' },
    { id: 2, user: 'jane.doe', action: 'Reset password', time: '15 minutes ago' },
    { id: 3, user: 'system', action: 'Performed nightly backup', time: '1 hour ago' },
    { id: 4, user: 'john.smith', action: 'Created new project', time: '3 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your application and monitor system health</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Button variant="outline" className="w-full md:w-auto">
              View Documentation
            </Button>
            <Button className="w-full md:w-auto">System Settings</Button>
          </div>
        </header>

        {/* Quick Stats Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className={`text-sm ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tools Section */}
          <div className="lg:col-span-2 space-y-8">
            {Object.entries(toolsByCategory).map(([category, categoryTools]) => (
              <div key={category}>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryTools.map(tool => (
                    <Card
                      key={tool.id}
                      className={`relative overflow-hidden transition-all duration-200 hover:shadow-md ${
                        tool.available
                          ? 'border hover:border-primary cursor-pointer'
                          : 'opacity-70 border-gray-200'
                      }`}
                      onClick={() => tool.available && navigate(tool.path)}
                    >
                      {tool.available && (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                      )}
                      <div className="flex flex-row h-full p-4 relative">
                        {/* Icon */}
                        <div
                          className={`flex items-center justify-center p-3 mr-4 rounded-lg ${
                            tool.available ? 'bg-primary/10' : 'bg-gray-100'
                          }`}
                        >
                          {tool.icon}
                        </div>

                        {/* Content */}
                        <div className="flex flex-col">
                          <CardTitle className="text-lg">{tool.title}</CardTitle>
                          <CardDescription className="text-sm">{tool.description}</CardDescription>
                          {!tool.available && (
                            <span className="mt-2 bg-gray-200 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded self-start">
                              Coming Soon
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar with Recent Activity */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-start">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 mr-3">
                      <UsersIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Web Server</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Operational
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Operational
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Storage</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Warning
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Backup</span>
                    <span className="text-sm text-gray-500">Today, 02:00 AM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
