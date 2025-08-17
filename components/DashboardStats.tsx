import { getDashboardStats } from '@/lib/cosmic';

export default async function DashboardStats() {
  const stats = await getDashboardStats();

  const statItems = [
    {
      label: 'Total Contacts',
      value: stats.totalContacts,
      icon: '👥',
      color: 'text-blue-600'
    },
    {
      label: 'Subscribed',
      value: stats.subscribedContacts,
      icon: '✅',
      color: 'text-green-600'
    },
    {
      label: 'Templates',
      value: stats.totalTemplates,
      icon: '📝',
      color: 'text-purple-600'
    },
    {
      label: 'Campaigns',
      value: stats.totalCampaigns,
      icon: '📮',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat, index) => (
        <div key={index} className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {stat.label}
              </p>
              <p className={`text-2xl font-bold ${stat.color}`}>
                {stat.value.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}