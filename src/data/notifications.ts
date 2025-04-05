interface NotificationItem {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'announcement' | 'maintenance' | 'update';
  priority?: boolean;
}

interface DiscoveryItem {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  type: 'discovery';
}

export const systemMessages: NotificationItem[] = [
  {
    id: 1,
    title: "Welcome to Hyperknow!",
    description: "Explore our latest version with improved AI understanding and faster response times.",
    date: "2025-03-13",
    type: "announcement",
    priority:true
  },
  {
    id: 2,
    title: "Scheduled Maintenance",
    description: "System will be undergoing maintenance on March 20, 2025, from 2:00 AM to 4:00 AM UTC.",
    date: "2025-03-15",
    type: "maintenance"
  },
  {
    id: 3,
    title: "New Features Released",
    description: "We've added enhanced visualization tools and improved search capabilities.",
    date: "2025-03-14",
    type: "update"
  }
];

export const discoveries: DiscoveryItem[] = [
  {
    id: 1,
    title: "First room-temperature superconductor confirmed",
    description: "Scientists have validated the first ambient-pressure, room-temperature superconductor, marking a major breakthrough in physics.",
    date: "2025-03-15",
    category: "Physics",
    type: "discovery"
  },
  {
    id: 2,
    title: "New type of quantum computer demonstrates superiority",
    description: "Researchers achieve quantum advantage using a novel photonic approach.",
    date: "2025-03-14",
    category: "Computing",
    type: "discovery"
  },
  {
    id: 3,
    title: "Breakthrough in fusion energy sustainability",
    description: "Latest fusion reactor maintains plasma for record duration, bringing sustainable fusion power closer to reality.",
    date: "2025-03-13",
    category: "Energy",
    type: "discovery"
  }
];