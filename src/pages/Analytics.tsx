import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Alert,
  AlertIcon,
  Select,
  HStack,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { complaintAPI } from '../services/api';
import StatsCard from '../components/StatsCard';
import { MdTrendingUp, MdPieChart, MdBarChart, MdTimeline } from 'react-icons/md';

const COLORS = {
  garbage: '#EF4444',
  water: '#3B82F6',
  roads: '#6B7280',
  electricity: '#EAB308',
  'public-safety': '#F97316',
  other: '#8B5CF6',
};

const STATUS_COLORS = {
  submitted: '#9CA3AF',
  verified: '#3B82F6',
  assigned: '#8B5CF6',
  'in-progress': '#F59E0B',
  resolved: '#10B981',
};

export default function Analytics() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await complaintAPI.getAll();
        setComplaints(data);
      } catch (err) {
        console.error('Failed to fetch analytics data:', err);
        setError('Failed to load analytics data.');
        // Use mock data for demo
        setComplaints(generateMockData());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data for charts
  const categoryData = Object.entries(
    complaints.reduce((acc: any, c: any) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const statusData = Object.entries(
    complaints.reduce((acc: any, c: any) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Trend data (last 7 days)
  const trendData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const count = complaints.filter(c => {
      const complaintDate = new Date(c.createdAt);
      return complaintDate.toDateString() === date.toDateString();
    }).length;

    return { date: dateStr, complaints: count };
  });

  // Resolution time data
  const resolutionData = complaints
    .filter(c => c.status === 'resolved')
    .map(c => {
      const created = new Date(c.createdAt).getTime();
      const updated = new Date(c.updatedAt).getTime();
      const hours = Math.round((updated - created) / (1000 * 60 * 60));
      return { id: c.complaintId.slice(-4), hours };
    })
    .slice(0, 10);

  const avgResolutionTime = resolutionData.length
    ? Math.round(resolutionData.reduce((sum, d) => sum + d.hours, 0) / resolutionData.length)
    : 0;

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={{ base: 4, md: 8 }}>
      <Container maxW="7xl" px={{ base: 4, md: 6 }}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between" flexWrap="wrap">
            <Box>
              <Heading size={{ base: 'lg', md: 'xl' }} mb={2}>
                📊 Analytics Dashboard
              </Heading>
              <Text color="gray.600" fontSize={{ base: 'sm', md: 'md' }}>
                Visual insights and statistics
              </Text>
            </Box>
            <Select maxW="200px" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </Select>
          </HStack>

          {/* Error Alert */}
          {error && (
            <Alert status="warning" rounded="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {loading ? (
            <VStack py={12} spacing={4}>
              <Spinner size="xl" color="brand.500" thickness="4px" />
              <Text color="gray.600">Loading analytics...</Text>
            </VStack>
          ) : (
            <>
              {/* Stats Cards */}
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                <StatsCard
                  label="Total Issues"
                  value={complaints.length}
                  icon={MdBarChart}
                  colorScheme="blue"
                />
                <StatsCard
                  label="Resolved Rate"
                  value={`${Math.round((complaints.filter(c => c.status === 'resolved').length / complaints.length) * 100)}%`}
                  icon={MdTrendingUp}
                  colorScheme="green"
                />
                <StatsCard
                  label="Avg Resolution"
                  value={`${avgResolutionTime}h`}
                  helpText="Average time to resolve"
                  icon={MdTimeline}
                  colorScheme="purple"
                />
                <StatsCard
                  label="Categories"
                  value={categoryData.length}
                  helpText="Active categories"
                  icon={MdPieChart}
                  colorScheme="orange"
                />
              </SimpleGrid>

              {/* Charts Grid */}
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {/* Category Distribution */}
                <Card>
                  <CardHeader>
                    <Heading size="md">Issues by Category</Heading>
                  </CardHeader>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry: any) => (
                            <Cell key={entry.name} fill={COLORS[entry.name as keyof typeof COLORS] || '#8B5CF6'} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>

                {/* Status Distribution */}
                <Card>
                  <CardHeader>
                    <Heading size="md">Issues by Status</Heading>
                  </CardHeader>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={statusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3B82F6">
                          {statusData.map((entry: any) => (
                            <Cell key={entry.name} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || '#8B5CF6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>

                {/* Trend Chart */}
                <Card>
                  <CardHeader>
                    <Heading size="md">7-Day Trend</Heading>
                  </CardHeader>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="complaints" stroke="#3B82F6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>

                {/* Resolution Time Chart */}
                <Card>
                  <CardHeader>
                    <Heading size="md">Resolution Time (hours)</Heading>
                  </CardHeader>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={resolutionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="id" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="hours" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
}

// Mock data generator for demo
function generateMockData() {
  const categories = ['garbage', 'water', 'roads', 'electricity', 'public-safety'];
  const statuses = ['submitted', 'verified', 'assigned', 'in-progress', 'resolved'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    complaintId: `mock-${i}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  }));
}
