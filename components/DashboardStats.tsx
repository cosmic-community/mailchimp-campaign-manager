interface DashboardStatsProps {
  stats: {
    total_contacts: number;
    subscribed_contacts: number;
    total_templates: number;
    total_campaigns: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Total Contacts',
      value: stats.total_contacts.toLocaleString(),
      icon: '👥',
      color: 'bg-blue-500',
    },
    {
      title: 'Active Subscribers',
      value: stats.subscribed_contacts.toLocaleString(),
      icon: '✅',
      color: 'bg-green-500',
    },
    {
      title: 'Email Templates',
      value: stats.total_templates.toLocaleString(),
      icon: '📧',
      color: 'bg-purple-500',
    },
    {
      title: 'Campaigns',
      value: stats.total_campaigns.toLocaleString(),
      icon: '📮',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat) => (
        <div key={stat.title} className="card">
          <div className="flex items-center">
            <div className={`flex-shrink-0 w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
              <span className="text-white text-xl">{stat.icon}</span>
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}