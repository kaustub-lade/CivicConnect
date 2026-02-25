import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  Text,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { MdSearch, MdAssessment, MdCheckCircle, MdPeople, MdSpeed } from 'react-icons/md';
import ComplaintCard from '../components/ComplaintCard';
import ComplaintDetailsModal from '../components/ComplaintDetailsModal';
import StatsCard from '../components/StatsCard';
import { complaintAPI } from '../services/api';
import type { Complaint } from '../types';

// Mock data
const mockComplaints: Complaint[] = [
  {
    complaintId: '1',
    title: 'Overflowing garbage bins near park',
    description: 'The municipal garbage bins at Central Park are overflowing for the past 3 days causing unpleasant smell and attracting stray animals.',
    category: 'garbage',
    images: [
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1628863353691-0071c8c1874c?w=400&h=300&fit=crop',
    ],
    location: { lat: 19.0760, lng: 72.8777, area: 'Ward 12, Andheri West' },
    status: 'in-progress',
    createdBy: 'user123',
    assignedTo: 'BMC_Sanitation',
    createdAt: new Date('2026-02-20'),
    updatedAt: new Date('2026-02-23'),
    updates: [
      {
        updateId: '1',
        message: 'Complaint verified. Assigned to sanitation team.',
        timestamp: new Date('2026-02-21'),
        updatedBy: 'admin',
      },
      {
        updateId: '2',
        message: 'Team dispatched to location. Expected resolution within 24 hours.',
        timestamp: new Date('2026-02-23'),
        updatedBy: 'BMC_Sanitation',
      },
    ],
    upvotes: 45,
    priority: 'high',
  },
  {
    complaintId: '2',
    title: 'Street light not working',
    description: 'Street lights on MG Road have been non-functional for over a week, causing safety concerns at night.',
    category: 'electricity',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1509399693673-755307bfc4e1?w=400&h=300&fit=crop',
    ],
    location: { lat: 19.0760, lng: 72.8777, area: 'Ward 8, MG Road' },
    status: 'verified',
    createdBy: 'user456',
    createdAt: new Date('2026-02-22'),
    updatedAt: new Date('2026-02-23'),
    updates: [
      {
        updateId: '3',
        message: 'Complaint verified. Forwarded to electricity department.',
        timestamp: new Date('2026-02-23'),
        updatedBy: 'admin',
      },
    ],
    upvotes: 28,
    priority: 'medium',
  },
  {
    complaintId: '3',
    title: 'Water supply disruption',
    description: 'No water supply in our area for the past 2 days. Tanker requested urgently.',
    category: 'water',
    imageURL: 'https://images.unsplash.com/photo-1584267385494-9fdd9a71ad75?w=400&h=300&fit=crop',
    location: { lat: 19.0760, lng: 72.8777, area: 'Ward 5, Sector 3' },
    status: 'assigned',
    createdBy: 'user789',
    assignedTo: 'Water_Dept',
    createdAt: new Date('2026-02-23'),
    updatedAt: new Date('2026-02-24'),
    updates: [],
    upvotes: 67,
    priority: 'high',
  },
  {
    complaintId: '4',
    title: 'Pothole on main road',
    description: 'Large pothole causing traffic issues and vehicle damage.',
    category: 'roads',
    images: [
      'https://images.unsplash.com/photo-1625527575307-616f0bb84ad2?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1534398079543-7ae6d016b86a?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=400&h=300&fit=crop',
    ],
    location: { lat: 19.0760, lng: 72.8777, area: 'Ward 15, Station Road' },
    status: 'resolved',
    createdBy: 'user101',
    createdAt: new Date('2026-02-18'),
    updatedAt: new Date('2026-02-24'),
    updates: [
      {
        updateId: '4',
        message: 'Road repair work completed. Pothole has been filled.',
        timestamp: new Date('2026-02-24'),
        updatedBy: 'PWD_Team',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
      },
    ],
    upvotes: 92,
    priority: 'high',
  },
];

export default function Dashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch complaints from API
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await complaintAPI.getAll();
        setComplaints(data);
      } catch (err) {
        console.error('Failed to fetch complaints:', err);
        setError('Failed to load complaints. Using demo data.');
        // Fallback to mock data on error
        setComplaints(mockComplaints);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || complaint.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get current user ID from localStorage (set during login)
  const currentUserId = localStorage.getItem('userId') || 'user123';
  const myComplaints = filteredComplaints.filter(c => c.createdBy === currentUserId);
  const allComplaints = filteredComplaints;
  const resolvedComplaints = filteredComplaints.filter(c => c.status === 'resolved');

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Heading size="xl" mb={2}>Dashboard</Heading>
            <Box color="gray.600">Track and manage civic issues</Box>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert status="warning" rounded="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {/* Loading State */}
          {loading ? (
            <VStack py={12} spacing={4}>
              <Spinner size="xl" color="brand.500" thickness="4px" />
              <Text color="gray.600">Loading complaints...</Text>
            </VStack>
          ) : (
            <>
              {/* Stats */}
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                <StatsCard
                  label="Total Issues"
                  value={complaints.length}
                  icon={MdAssessment}
                  colorScheme="blue"
                />
                <StatsCard
                  label="Resolved"
                  value={complaints.filter(c => c.status === 'resolved').length}
                  helpText={`${Math.round((complaints.filter(c => c.status === 'resolved').length / complaints.length) * 100)}% success rate`}
                  icon={MdCheckCircle}
                  colorScheme="green"
                />
                <StatsCard
                  label="In Progress"
                  value={complaints.filter(c => c.status === 'in-progress').length}
                  icon={MdSpeed}
                  colorScheme="orange"
                />
                <StatsCard
                  label="Community Engagement"
                  value={complaints.reduce((sum, c) => sum + c.upvotes, 0)}
                  helpText="Total upvotes"
                  icon={MdPeople}
                  colorScheme="purple"
                />
              </SimpleGrid>

          {/* Filters */}
          <HStack spacing={4} flexWrap="wrap">
            <InputGroup maxW="400px">
              <InputLeftElement>
                <Icon as={MdSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search issues..."
                bg="white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <Select
              maxW="200px"
              bg="white"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="garbage">Garbage</option>
              <option value="water">Water</option>
              <option value="roads">Roads</option>
              <option value="electricity">Electricity</option>
              <option value="public-safety">Public Safety</option>
            </Select>

            <Select
              maxW="200px"
              bg="white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="verified">Verified</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </Select>
          </HStack>

          {/* Tabs */}
          <Tabs colorScheme="brand" variant="enclosed">
            <TabList>
              <Tab>All Issues ({allComplaints.length})</Tab>
              <Tab>My Reports ({myComplaints.length})</Tab>
              <Tab>Resolved ({resolvedComplaints.length})</Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {allComplaints.map(complaint => (
                    <ComplaintCard 
                      key={complaint.complaintId} 
                      complaint={complaint}
                      onViewDetails={() => handleViewDetails(complaint)}
                    />
                  ))}
                </SimpleGrid>
              </TabPanel>

              <TabPanel px={0}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {myComplaints.map(complaint => (
                    <ComplaintCard 
                      key={complaint.complaintId} 
                      complaint={complaint}
                      onViewDetails={() => handleViewDetails(complaint)}
                    />
                  ))}
                </SimpleGrid>
              </TabPanel>

              <TabPanel px={0}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {resolvedComplaints.map(complaint => (
                    <ComplaintCard 
                      key={complaint.complaintId} 
                      complaint={complaint}
                      onViewDetails={() => handleViewDetails(complaint)}
                    />
                  ))}
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
            </>
          )}
        </VStack>
      </Container>

      {/* Complaint Details Modal */}
      <ComplaintDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        complaint={selectedComplaint}
      />
    </Box>
  );
}
