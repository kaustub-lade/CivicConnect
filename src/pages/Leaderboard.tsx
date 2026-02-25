import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Badge,
  Card,
  CardBody,
  SimpleGrid,
  Icon,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { MdEmojiEvents, MdStar, MdTrendingUp } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

// Mock leaderboard data as fallback
const mockLeaderboard = [
  {
    userId: '1',
    name: 'Kaustub Lade',
    points: 450,
    issuesReported: 12,
    issuesResolved: 8,
    rank: 1,
    badge: '🏆',
    avatar: '',
  },
  {
    userId: '2',
    name: 'Priya Sharma',
    points: 385,
    issuesReported: 10,
    issuesResolved: 7,
    rank: 2,
    badge: '🥈',
    avatar: '',
  },
  {
    userId: '3',
    name: 'Rahul Verma',
    points: 340,
    issuesReported: 9,
    issuesResolved: 6,
    rank: 3,
    badge: '🥉',
    avatar: '',
  },
  {
    userId: '4',
    name: 'Anita Desai',
    points: 295,
    issuesReported: 8,
    issuesResolved: 5,
    rank: 4,
    badge: '⭐',
    avatar: '',
  },
  {
    userId: '5',
    name: 'Vikram Singh',
    points: 270,
    issuesReported: 7,
    issuesResolved: 4,
    rank: 5,
    badge: '⭐',
    avatar: '',
  },
  {
    userId: '6',
    name: 'Sneha Patel',
    points: 245,
    issuesReported: 6,
    issuesResolved: 4,
    rank: 6,
    badge: '⭐',
    avatar: '',
  },
  {
    userId: '7',
    name: 'Amit Kumar',
    points: 220,
    issuesReported: 5,
    issuesResolved: 3,
    rank: 7,
    badge: '⭐',
    avatar: '',
  },
  {
    userId: '8',
    name: 'Deepika Rao',
    points: 195,
    issuesReported: 5,
    issuesResolved: 2,
    rank: 8,
    badge: '⭐',
    avatar: '',
  },
];

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'yellow.400';
    case 2:
      return 'gray.400';
    case 3:
      return 'orange.600';
    default:
      return 'purple.500';
  }
};

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUserId = localStorage.getItem('userId') || 'user123';

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userAPI.getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
        setError('Failed to load leaderboard. Using demo data.');
        // Fallback to mock data
        setLeaderboard(mockLeaderboard);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={{ base: 4, md: 8 }}>
      <Container maxW="6xl" px={{ base: 4, md: 6 }}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading size={{ base: 'lg', md: 'xl' }} mb={2}>
              🏆 Community Leaderboard
            </Heading>
            <Text color="gray.600" fontSize={{ base: 'sm', md: 'md' }}>
              Top contributors making a difference in our community
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
              <Text color="gray.600">Loading leaderboard...</Text>
            </VStack>
          ) : (
            <>
              {/* Top 3 Podium */}
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={4}>
                {leaderboard.slice(0, 3).map((user) => (
                  <Card
                    key={user.userId}
                    bg={user.rank === 1 ? 'yellow.50' : user.rank === 2 ? 'gray.50' : 'orange.50'}
                    borderColor={getRankColor(user.rank)}
                    borderWidth={2}
                    _hover={{ shadow: 'lg', transform: 'translateY(-4px)' }}
                    transition="all 0.2s"
                  >
                    <CardBody>
                      <VStack spacing={4}>
                        <Text fontSize="4xl">{user.badge}</Text>
                        <Avatar
                          size="xl"
                          name={user.name}
                          src={user.avatar}
                          border="4px solid"
                          borderColor={getRankColor(user.rank)}
                        />
                        <VStack spacing={1}>
                          <Heading size="md">{user.name}</Heading>
                          <Badge
                            colorScheme={user.rank === 1 ? 'yellow' : user.rank === 2 ? 'gray' : 'orange'}
                            fontSize="sm"
                            px={3}
                            py={1}
                            rounded="full"
                          >
                            Rank #{user.rank}
                          </Badge>
                        </VStack>
                        <Divider />
                        <SimpleGrid columns={3} spacing={4} w="full" textAlign="center">
                          <VStack spacing={0}>
                            <Icon as={MdStar} color="yellow.500" w={5} h={5} />
                            <Text fontSize="xl" fontWeight="bold">
                              {user.points}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              Points
                            </Text>
                          </VStack>
                          <VStack spacing={0}>
                            <Icon as={MdTrendingUp} color="green.500" w={5} h={5} />
                            <Text fontSize="xl" fontWeight="bold">
                              {user.issuesReported}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              Reports
                            </Text>
                          </VStack>
                          <VStack spacing={0}>
                            <Icon as={MdEmojiEvents} color="purple.500" w={5} h={5} />
                            <Text fontSize="xl" fontWeight="bold">
                              {user.issuesResolved}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              Resolved
                            </Text>
                          </VStack>
                        </SimpleGrid>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>

              {/* Rest of Leaderboard */}
              <Card>
                <CardBody>
                  <Heading size="md" mb={4}>
                    All Rankings
                  </Heading>
                  <VStack spacing={3} align="stretch">
                    {leaderboard.map((user, index) => (
                      <Box key={user.userId}>
                        <HStack
                          p={4}
                          bg={user.userId === currentUserId ? 'brand.50' : 'white'}
                          rounded="lg"
                          borderWidth={user.userId === currentUserId ? 2 : 1}
                          borderColor={user.userId === currentUserId ? 'brand.500' : 'gray.200'}
                          _hover={{ bg: 'gray.50' }}
                          transition="all 0.2s"
                        >
                          <Text fontSize="xl" fontWeight="bold" w={12} textAlign="center">
                            {user.badge}
                          </Text>
                          <Avatar size="md" name={user.name} src={user.avatar} />
                          <VStack align="start" flex={1} spacing={0}>
                            <HStack>
                              <Text fontWeight="bold">{user.name}</Text>
                              {user.userId === currentUserId && (
                                <Badge colorScheme="brand" fontSize="xs">
                                  You
                                </Badge>
                              )}
                            </HStack>
                            <Text fontSize="sm" color="gray.600">
                              {user.issuesReported} reports • {user.issuesResolved} resolved
                            </Text>
                          </VStack>
                          <VStack spacing={0} align="end">
                            <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                              {user.points}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              points
                            </Text>
                          </VStack>
                        </HStack>
                        {index < leaderboard.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </VStack>
                </CardBody>
              </Card>

              {/* Info Card */}
              <Card bg="brand.50" borderColor="brand.200" borderWidth={1}>
                <CardBody>
                  <HStack spacing={4} align="start">
                    <Icon as={MdEmojiEvents} color="brand.600" w={8} h={8} />
                    <VStack align="start" spacing={2}>
                      <Heading size="sm" color="brand.900">
                        How to Earn Points?
                      </Heading>
                      <Text fontSize="sm" color="brand.800">
                        • Report civic issues: +10 points
                        <br />
                        • Issue gets resolved: +20 bonus points
                        <br />
                        • Join volunteer initiatives: +50-75 points
                        <br />
                        • Upvote helpful reports: +2 points
                        <br />• Help verify issues: +5 points
                      </Text>
                    </VStack>
                  </HStack>
                </CardBody>
              </Card>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
