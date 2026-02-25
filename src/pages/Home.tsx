import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  MdAddCircle,
  MdDashboard,
  MdMap,
  MdPeople,
  MdVerified,
  MdSpeed,
  MdGroups,
} from 'react-icons/md';
import StatsCard from '../components/StatsCard';

export default function Home() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        bgGradient="linear(135deg, brand.500 0%, brand.700 100%)"
        color="white"
        py={{ base: 12, md: 16, lg: 20 }}
        px={{ base: 4, md: 6 }}
      >
        <Container maxW="6xl">
          <VStack spacing={6} align="center" textAlign="center">
            <Heading 
              size={{ base: 'xl', md: '2xl' }} 
              fontWeight="bold"
              px={{ base: 2, md: 0 }}
            >
              Your Voice, Our Action
            </Heading>
            <Text 
              fontSize={{ base: 'md', md: 'lg', lg: 'xl' }} 
              maxW="2xl"
              px={{ base: 4, md: 0 }}
            >
              Report civic issues, track progress transparently, and collaborate with your
              community to make your city better
            </Text>
            <HStack 
              spacing={4} 
              mt={4}
              flexDirection={{ base: 'column', sm: 'row' }}
              w={{ base: 'full', sm: 'auto' }}
              px={{ base: 4, sm: 0 }}
            >
              <Button
                as={RouterLink}
                to="/report"
                size="lg"
                bg="white"
                color="brand.700"
                leftIcon={<Icon as={MdAddCircle} />}
                _hover={{ transform: 'translateY(-2px)', shadow: 'xl', bg: 'gray.50' }}
                w={{ base: 'full', sm: 'auto' }}
              >
                Report an Issue
              </Button>
              <Button
                as={RouterLink}
                to="/map"
                size="lg"
                variant="outline"
                color="white"
                borderColor="white"
                leftIcon={<Icon as={MdMap} />}
                _hover={{ bg: 'whiteAlpha.200' }}
                w={{ base: 'full', sm: 'auto' }}
              >
                View Community Map
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxW="6xl" py={12}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <StatsCard
            label="Total Issues Reported"
            value="2,459"
            helpText="+12% from last month"
            icon={MdDashboard}
            colorScheme="blue"
          />
          <StatsCard
            label="Issues Resolved"
            value="1,847"
            helpText="75% resolution rate"
            icon={MdVerified}
            colorScheme="green"
          />
          <StatsCard
            label="Active Volunteers"
            value="324"
            helpText="Growing community"
            icon={MdPeople}
            colorScheme="purple"
          />
          <StatsCard
            label="Avg Response Time"
            value="4.2 days"
            helpText="Improving daily"
            icon={MdSpeed}
            colorScheme="orange"
          />
        </SimpleGrid>
      </Container>

      {/* Features Section */}
      <Box bg="gray.50" py={16}>
        <Container maxW="6xl">
          <VStack spacing={4} mb={12} textAlign="center">
            <Heading size="xl">How CivicConnect Works</Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              A transparent platform that connects citizens, volunteers, and authorities
              to solve civic issues together
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            <FeatureCard
              icon={MdAddCircle}
              title="Report Issues"
              description="Easily report civic problems with photos, location, and descriptions. Your voice matters."
              color="blue.500"
            />
            <FeatureCard
              icon={MdDashboard}
              title="Track Progress"
              description="Monitor the status of your complaints in real-time with complete transparency."
              color="purple.500"
            />
            <FeatureCard
              icon={MdGroups}
              title="Collaborate"
              description="Join as a volunteer, coordinate with community members, and drive change together."
              color="green.500"
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxW="6xl" py={16}>
        <Box
          bg="brand.600"
          color="white"
          p={12}
          rounded="2xl"
          textAlign="center"
        >
          <Heading size="lg" mb={4}>
            Ready to Make a Difference?
          </Heading>
          <Text fontSize="lg" mb={6}>
            Join thousands of citizens working towards a better community
          </Text>
          <Button
            as={RouterLink}
            to="/volunteer"
            size="lg"
            colorScheme="white"
            variant="solid"
            color="brand.600"
            leftIcon={<Icon as={MdPeople} />}
          >
            Become a Volunteer
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <VStack
      bg="white"
      p={8}
      rounded="xl"
      shadow="sm"
      align="start"
      spacing={4}
      _hover={{ shadow: 'md' }}
      transition="all 0.2s"
    >
      <Flex
        bg={`${color.split('.')[0]}.50`}
        p={3}
        rounded="lg"
      >
        <Icon as={icon} w={8} h={8} color={color} />
      </Flex>
      <Heading size="md">{title}</Heading>
      <Text color="gray.600">{description}</Text>
    </VStack>
  );
}
