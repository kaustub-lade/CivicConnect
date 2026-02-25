import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
  Button,
  Badge,
  HStack,
  Icon,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { MdPeople, MdLocationOn, MdCalendarToday, MdCheckCircle } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { volunteerAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const mockOpportunities = [
  {
    id: '1',
    title: 'Beach Cleanup Drive',
    category: 'Environment',
    location: 'Juhu Beach',
    date: 'Feb 28, 2026',
    volunteers: 12,
    needed: 20,
    points: 50,
  },
  {
    id: '2',
    title: 'Tree Plantation Campaign',
    category: 'Environment',
    location: 'Sanjay Gandhi National Park',
    date: 'Mar 5, 2026',
    volunteers: 8,
    needed: 15,
    points: 75,
  },
  {
    id: '3',
    title: 'Road Safety Awareness',
    category: 'Public Safety',
    location: 'Local Schools',
    date: 'Mar 10, 2026',
    volunteers: 5,
    needed: 10,
    points: 60,
  },
];

export default function VolunteerHub() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch volunteer opportunities
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await volunteerAPI.getOpportunities();
        setOpportunities(data);
      } catch (err) {
        console.error('Failed to fetch opportunities:', err);
        setError('Failed to load opportunities. Using demo data.');
        // Fallback to mock data
        setOpportunities(mockOpportunities);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const handleJoinInitiative = async (opportunityId: string) => {
    try {
      await volunteerAPI.join(opportunityId);
      // Refresh opportunities after joining
      const data = await volunteerAPI.getOpportunities();
      setOpportunities(data);
    } catch (err) {
      console.error('Failed to join initiative:', err);
      alert('Please login to join volunteer initiatives');
    }
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };
  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading size="xl" mb={2}>Volunteer Hub</Heading>
            <Text color="gray.600" fontSize="lg">
              Join community initiatives and make a difference
            </Text>
          </Box>

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
              <Text color="gray.600">Loading opportunities...</Text>
            </VStack>
          ) : (
            <>
              {/* Stats Cards */}
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card bg="purple.50" borderColor="purple.200" borderWidth={1}>
              <CardBody textAlign="center">
                <Text fontSize="4xl" fontWeight="bold" color="purple.600">324</Text>
                <Text color="purple.800" fontWeight="medium">Active Volunteers</Text>
              </CardBody>
            </Card>
            <Card bg="green.50" borderColor="green.200" borderWidth={1}>
              <CardBody textAlign="center">
                <Text fontSize="4xl" fontWeight="bold" color="green.600">156</Text>
                <Text color="green.800" fontWeight="medium">Completed Initiatives</Text>
              </CardBody>
            </Card>
            <Card bg="blue.50" borderColor="blue.200" borderWidth={1}>
              <CardBody textAlign="center">
                <Text fontSize="4xl" fontWeight="bold" color="blue.600">12</Text>
                <Text color="blue.800" fontWeight="medium">Upcoming Events</Text>
              </CardBody>
            </Card>
          </SimpleGrid>

          <Divider />

          {/* Available Opportunities */}
          <Box>
            <Heading size="md" mb={4}>Available Opportunities</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {opportunities.map(issue => (
                <Card
                  key={issue.id}
                  variant="outline"
                  _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                >
                  <CardBody>
                    <VStack align="stretch" spacing={3}>
                      <HStack justify="space-between">
                        <Badge colorScheme="purple" fontSize="xs" px={2} py={1}>
                          {issue.category}
                        </Badge>
                        <Badge colorScheme="green" fontSize="xs" px={2} py={1}>
                          +{issue.points} points
                        </Badge>
                      </HStack>

                      <Heading size="sm">{issue.title}</Heading>

                      <VStack align="stretch" spacing={2} fontSize="sm" color="gray.600">
                        <HStack>
                          <Icon as={MdLocationOn} />
                          <Text>{issue.location}</Text>
                        </HStack>
                        <HStack>
                          <Icon as={MdCalendarToday} />
                          <Text>{issue.date}</Text>
                        </HStack>
                        <HStack>
                          <Icon as={MdPeople} />
                          <Text>
                            {issue.volunteers}/{issue.needed} volunteers
                          </Text>
                        </HStack>
                      </VStack>

                      <Box>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          Progress
                        </Text>
                        <Box bg="gray.200" h={2} rounded="full">
                          <Box
                            bg="brand.500"
                            h={2}
                            rounded="full"
                            w={`${(issue.volunteers / issue.needed) * 100}%`}
                          />
                        </Box>
                      </Box>
                    </VStack>
                  </CardBody>

                  <CardFooter pt={0}>
                    <Button
                      colorScheme="brand"
                      w="100%"
                      leftIcon={<Icon as={MdCheckCircle} />}
                      onClick={() => handleJoinInitiative(issue.id)}
                    >
                      Join Initiative
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Leaderboard Teaser */}
          <Box bg="gradient" bgGradient="linear(to-r, purple.500, blue.500)" p={8} rounded="xl" color="white" textAlign="center">
            <Heading size="lg" mb={3}>
              🏆 Community Leaderboard
            </Heading>
            <Text mb={4}>
              Top volunteers get recognized and earn badges
            </Text>
            <Button 
              colorScheme="whiteAlpha" 
              variant="outline" 
              size="lg"
              onClick={handleViewLeaderboard}
            >
              View Leaderboard
            </Button>
          </Box>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
