import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Badge,
  SimpleGrid,
  Card,
  CardBody,
  Divider,
  Icon,
  Button,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import {
  MdVerified,
  MdStar,
  MdTrendingUp,
  MdEmojiEvents,
  MdEditNote,
} from 'react-icons/md';
import { useState, useEffect } from 'react';
import StatusTimeline from '../components/StatusTimeline';
import { userAPI, complaintAPI } from '../services/api';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({
    issuesReported: 12,
    issuesResolved: 8,
    volunteerHours: 24,
    impactScore: 8.5,
  });

  // Default user data (fallback)
  const user = {
    name: localStorage.getItem('userName') || 'Kaustub Lade',
    email: localStorage.getItem('userEmail') || 'kaustub@example.com',
    role: 'Citizen',
    joinedDate: 'January 2026',
    points: 450,
    avatar: '',
  };

  const badges = [
    { name: 'Early Adopter', icon: '🌟', earned: true },
    { name: 'Issue Reporter', icon: '📢', earned: true },
    { name: 'Community Hero', icon: '🦸', earned: false },
    { name: 'Super Volunteer', icon: '💪', earned: false },
  ];

  // Fetch user stats
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userId = localStorage.getItem('userId') || 'user123';
        
        // Try to fetch user complaints for stats
        const complaints = await complaintAPI.getAll();
        const userComplaints = complaints.filter((c: any) => c.createdBy === userId);
        const resolvedComplaints = userComplaints.filter((c: any) => c.status === 'resolved');
        
        setUserStats({
          issuesReported: userComplaints.length,
          issuesResolved: resolvedComplaints.length,
          volunteerHours: 24, // Static for now
          impactScore: 8.5, // Static for now
        });
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError('Failed to load profile data. Using cached information.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={{ base: 4, md: 8 }}>
      <Container maxW="6xl" px={{ base: 4, md: 6 }}>
        <VStack spacing={8} align="stretch">
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
              <Text color="gray.600">Loading profile...</Text>
            </VStack>
          ) : (
            <>
              {/* Profile Header */}
              <Card>
            <CardBody>
              <HStack 
                spacing={{ base: 4, md: 6 }}
                flexDirection={{ base: 'column', md: 'row' }}
                align={{ base: 'center', md: 'flex-start' }}
              >
                <Avatar
                  size={{ base: 'xl', md: '2xl' }}
                  name={user.name}
                  src={user.avatar}
                  bg="brand.500"
                />
                <VStack 
                  align={{ base: 'center', md: 'start' }}
                  flex={1} 
                  spacing={2}
                  textAlign={{ base: 'center', md: 'left' }}
                >
                  <HStack>
                    <Heading size={{ base: 'md', md: 'lg' }}>{user.name}</Heading>
                    <Icon as={MdVerified} color="blue.500" w={{ base: 5, md: 6 }} h={{ base: 5, md: 6 }} />
                  </HStack>
                  <Text color="gray.600" fontSize={{ base: 'sm', md: 'md' }}>
                    {user.email}
                  </Text>
                  <HStack 
                    spacing={4}
                    flexWrap="wrap"
                    justify={{ base: 'center', md: 'flex-start' }}
                  >
                    <Badge colorScheme="purple" px={3} py={1} rounded="full">
                      {user.role}
                    </Badge>
                    <Text fontSize="sm" color="gray.500">
                      Member since {user.joinedDate}
                    </Text>
                  </HStack>
                </VStack>
                <Button 
                  leftIcon={<Icon as={MdEditNote} />} 
                  colorScheme="brand" 
                  variant="outline"
                  size={{ base: 'sm', md: 'md' }}
                  w={{ base: 'full', md: 'auto' }}
                >
                  Edit Profile
                </Button>
              </HStack>
            </CardBody>
          </Card>

          {/* Stats */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Card>
              <CardBody>
                <VStack align="stretch" spacing={2}>
                  <HStack>
                    <Icon as={MdStar} color="yellow.500" w={5} h={5} />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">Civic Points</Text>
                  </HStack>
                  <Text fontSize="3xl" fontWeight="bold" color="brand.600">{user.points}</Text>
                  <Text fontSize="sm" color="gray.500">Top 15% in your area</Text>
                </VStack>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <VStack align="stretch" spacing={2}>
                  <HStack>
                    <Icon as={MdTrendingUp} color="green.500" w={5} h={5} />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">Issues Reported</Text>
                  </HStack>
                  <Text fontSize="3xl" fontWeight="bold">{userStats.issuesReported}</Text>
                  <Text fontSize="sm" color="gray.500">{userStats.issuesResolved} resolved</Text>
                </VStack>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <VStack align="stretch" spacing={2}>
                  <HStack>
                    <Icon as={MdEmojiEvents} color="purple.500" w={5} h={5} />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">Volunteer Hours</Text>
                  </HStack>
                  <Text fontSize="3xl" fontWeight="bold">{userStats.volunteerHours}</Text>
                  <Text fontSize="sm" color="gray.500">Last 30 days</Text>
                </VStack>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <VStack align="stretch" spacing={2}>
                  <HStack>
                    <Icon as={MdVerified} color="blue.500" w={5} h={5} />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">Impact Score</Text>
                  </HStack>
                  <Text fontSize="3xl" fontWeight="bold">{userStats.impactScore}/10</Text>
                  <Text fontSize="sm" color="gray.500">Community rating</Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Badges */}
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>Achievements & Badges</Heading>
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                {badges.map((badge, index) => (
                  <Box
                    key={index}
                    p={4}
                    bg={badge.earned ? 'brand.50' : 'gray.100'}
                    rounded="lg"
                    textAlign="center"
                    border="2px"
                    borderColor={badge.earned ? 'brand.200' : 'gray.200'}
                    opacity={badge.earned ? 1 : 0.5}
                  >
                    <Text fontSize="3xl" mb={2}>{badge.icon}</Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {badge.name}
                    </Text>
                    {!badge.earned && (
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        Locked
                      </Text>
                    )}
                  </Box>
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>Recent Activity</Heading>
              <VStack align="stretch" spacing={4}>
                <HStack>
                  <Box w={2} h={2} bg="green.500" rounded="full" />
                  <Text>Reported "Overflowing garbage bins" - Status: In Progress</Text>
                  <Text fontSize="sm" color="gray.500" ml="auto">2 days ago</Text>
                </HStack>
                <Divider />
                <HStack>
                  <Box w={2} h={2} bg="blue.500" rounded="full" />
                  <Text>Joined volunteer initiative "Beach Cleanup"</Text>
                  <Text fontSize="sm" color="gray.500" ml="auto">5 days ago</Text>
                </HStack>
                <Divider />
                <HStack>
                  <Box w={2} h={2} bg="purple.500" rounded="full" />
                  <Text>Earned badge "Issue Reporter"</Text>
                  <Text fontSize="sm" color="gray.500" ml="auto">1 week ago</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Sample Complaint Timeline */}
          <Card>
            <CardBody>
              <Heading size="md" mb={6}>Sample Issue Tracking</Heading>
              <StatusTimeline currentStatus="in-progress" />
            </CardBody>
          </Card>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
