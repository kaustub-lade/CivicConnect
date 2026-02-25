import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Select,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Complaint } from '../types';
import ComplaintDetailsModal from '../components/ComplaintDetailsModal';
import { complaintAPI } from '../services/api';

// Custom colored markers for different categories
const createColoredIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });
};

// Category color mapping matching the legend
const categoryColors: Record<string, string> = {
  garbage: '#EF4444',      // red.500
  water: '#3B82F6',        // blue.500
  roads: '#374151',        // gray.700
  electricity: '#EAB308',  // yellow.500
  'public-safety': '#F97316', // orange.500
  other: '#6B7280',        // gray.500
};

const getCategoryIcon = (category: string) => {
  const color = categoryColors[category] || categoryColors.other;
  return createColoredIcon(color);
};

// Mock data for map markers
const mockMapComplaints: Complaint[] = [
  {
    complaintId: '1',
    title: 'Overflowing garbage bins',
    description: 'Garbage issue at Central Park',
    category: 'garbage',
    location: { lat: 19.0760, lng: 72.8777, area: 'Ward 12, Andheri West' },
    status: 'in-progress',
    createdBy: 'user123',
    createdAt: new Date('2026-02-20'),
    updatedAt: new Date('2026-02-23'),
    updates: [],
    upvotes: 45,
    priority: 'high',
  },
  {
    complaintId: '2',
    title: 'Street light not working',
    description: 'Street lights issue on MG Road',
    category: 'electricity',
    location: { lat: 19.0800, lng: 72.8800, area: 'Ward 8, MG Road' },
    status: 'verified',
    createdBy: 'user456',
    createdAt: new Date('2026-02-22'),
    updatedAt: new Date('2026-02-23'),
    updates: [],
    upvotes: 28,
    priority: 'medium',
  },
  {
    complaintId: '3',
    title: 'Water supply disruption',
    description: 'No water supply for 2 days',
    category: 'water',
    location: { lat: 19.0720, lng: 72.8850, area: 'Ward 5, Sector 3' },
    status: 'assigned',
    createdBy: 'user789',
    createdAt: new Date('2026-02-23'),
    updatedAt: new Date('2026-02-24'),
    updates: [],
    upvotes: 67,
    priority: 'high',
  },
  {
    complaintId: '4',
    title: 'Pothole on main road',
    description: 'Large pothole causing traffic issues',
    category: 'roads',
    location: { lat: 19.0780, lng: 72.8750, area: 'Ward 15, Station Road' },
    status: 'resolved',
    createdBy: 'user101',
    createdAt: new Date('2026-02-18'),
    updatedAt: new Date('2026-02-24'),
    updates: [],
    upvotes: 92,
    priority: 'high',
  },
];

const statusColors: Record<string, string> = {
  submitted: 'gray',
  verified: 'blue',
  assigned: 'purple',
  'in-progress': 'orange',
  resolved: 'green',
};

export default function CommunityMap() {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch complaints from API
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await complaintAPI.getAll();
        setAllComplaints(data);
        setComplaints(data);
      } catch (err) {
        console.error('Failed to fetch complaints:', err);
        setError('Failed to load complaints. Using demo data.');
        // Fallback to mock data
        setAllComplaints(mockMapComplaints);
        setComplaints(mockMapComplaints);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Filter complaints by category
  useEffect(() => {
    if (filterCategory === 'all') {
      setComplaints(allComplaints);
    } else {
      setComplaints(allComplaints.filter(c => c.category === filterCategory));
    }
  }, [filterCategory, allComplaints]);

  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
  };

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)">
      <Container maxW="7xl" py={{ base: 4, md: 8 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Box>
            <Heading size={{ base: 'lg', md: 'xl' }} mb={2}>Community Map</Heading>
            <Text color="gray.600" fontSize={{ base: 'sm', md: 'md' }}>
              View civic issues reported in your area
            </Text>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert status="warning" rounded="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {/* Filter Controls */}
          <HStack 
            spacing={4} 
            flexWrap="wrap"
            flexDirection={{ base: 'column', sm: 'row' }}
            align={{ base: 'stretch', sm: 'center' }}
          >
            <Text fontWeight="medium" display={{ base: 'none', sm: 'block' }}>
              Filter by Category:
            </Text>
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              maxW={{ base: 'full', sm: '200px' }}
              bg="white"
            >
              <option value="all">All Categories</option>
              <option value="garbage">🗑️ Garbage</option>
              <option value="water">💧 Water</option>
              <option value="roads">🛣️ Roads</option>
              <option value="electricity">⚡ Electricity</option>
              <option value="public-safety">🚨 Public Safety</option>
              <option value="other">📋 Other</option>
            </Select>
            <Text color="gray.500" fontSize={{ base: 'sm', md: 'md' }}>
              Showing {complaints.length} issues
            </Text>
          </HStack>

          {/* Map Container */}
          <Box 
            height={{ base: '400px', md: '500px', lg: '600px' }}
            borderRadius="lg" 
            overflow="hidden" 
            boxShadow="md"
            border="1px solid"
            borderColor="gray.200"
            position="relative"
          >
            {loading ? (
              <VStack justify="center" h="full" bg="gray.100">
                <Spinner size="xl" color="brand.500" thickness="4px" />
                <Text color="gray.600">Loading map...</Text>
              </VStack>
            ) : (
              <MapContainer
                center={[19.0760, 72.8777]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {complaints.map((complaint) => (
                <Marker
                  key={complaint.complaintId}
                  position={[complaint.location.lat, complaint.location.lng]}
                  icon={getCategoryIcon(complaint.category)}
                >
                  <Popup>
                    <Box p={2} minW="200px">
                      <Heading size="sm" mb={2}>{complaint.title}</Heading>
                      <Text fontSize="sm" color="gray.600" mb={2}>
                        {complaint.description.substring(0, 100)}...
                      </Text>
                      <HStack spacing={2} mb={2}>
                        <Badge colorScheme={statusColors[complaint.status]}>
                          {complaint.status.toUpperCase()}
                        </Badge>
                        <Badge>{complaint.category}</Badge>
                      </HStack>
                      <Text fontSize="xs" color="gray.500">
                        📍 {complaint.location.area}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        👍 {complaint.upvotes} upvotes
                      </Text>
                      <Button 
                        size="xs" 
                        colorScheme="brand" 
                        mt={2} 
                        width="full"
                        onClick={() => handleViewDetails(complaint)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Popup>
                </Marker>
              ))}
              </MapContainer>
            )}
          </Box>

          {/* Legend */}
          <Box bg="white" p={6} rounded="xl" shadow="sm">
            <Heading size="sm" mb={4}>Map Legend</Heading>
            <HStack spacing={8} flexWrap="wrap">
              <HStack>
                <Box w={4} h={4} bg="red.500" rounded="full" />
                <Text fontSize="sm">🗑️ Garbage</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="blue.500" rounded="full" />
                <Text fontSize="sm">💧 Water</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="gray.700" rounded="full" />
                <Text fontSize="sm">🛣️ Roads</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="yellow.500" rounded="full" />
                <Text fontSize="sm">⚡ Electricity</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="orange.500" rounded="full" />
                <Text fontSize="sm">🚨 Safety</Text>
              </HStack>
            </HStack>
          </Box>
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
