import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Text,
  Badge,
  Button,
  HStack,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { MdLocationOn, MdThumbUp, MdArrowForward, MdUpdate } from 'react-icons/md';
import type { Complaint } from '../types';

interface ComplaintCardProps {
  complaint: Complaint;
  onViewDetails?: () => void;
}

// Professional status colors matching civic trust palette
const statusColors: Record<string, string> = {
  submitted: 'gray',      // Gray - Information
  verified: 'blue',       // Blue - Action
  assigned: 'purple',     // Purple - Processing
  'in-progress': 'orange', // Amber - Attention
  resolved: 'green',      // Green - Success
  escalated: 'red',       // Red - Problem
};

const categoryIcons: Record<string, string> = {
  garbage: '🗑️',
  water: '💧',
  roads: '🛣️',
  electricity: '⚡',
  'public-safety': '🚨',
  other: '📋',
};

export default function ComplaintCard({ complaint, onViewDetails }: ComplaintCardProps) {
  const statusColor = statusColors[complaint.status] || 'gray';
  
  // Support both single imageURL and multiple images array
  const images = complaint.images || (complaint.imageURL ? [complaint.imageURL] : []);
  const displayImage = images[0];
  const hasMultipleImages = images.length > 1;
  
  return (
    <Card
      overflow="hidden"
      variant="outline"
      _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
    >
      {displayImage && (
        <Box position="relative">
          <Image
            src={displayImage}
            alt={complaint.title}
            h="200px"
            objectFit="cover"
          />
          {hasMultipleImages && (
            <Badge
              position="absolute"
              top={2}
              right={2}
              colorScheme="blackAlpha"
              bg="blackAlpha.700"
              color="white"
              fontSize="xs"
              px={2}
              py={1}
            >
              +{images.length - 1} more
            </Badge>
          )}
        </Box>
      )}
      
      <CardBody>
        <Stack spacing={3}>
          <HStack justify="space-between" align="start">
            <Heading size="md" noOfLines={2}>
              <Text as="span" mr={2}>
                {categoryIcons[complaint.category]}
              </Text>
              {complaint.title}
            </Heading>
            <Badge colorScheme={statusColor} fontSize="xs" px={2} py={1} rounded="full">
              {complaint.status.replace('-', ' ').toUpperCase()}
            </Badge>
          </HStack>

          <Text color="gray.600" noOfLines={3}>
            {complaint.description}
          </Text>

          <HStack spacing={4} fontSize="sm" color="gray.500">
            <HStack>
              <Icon as={MdLocationOn} />
              <Text>{complaint.location.area}</Text>
            </HStack>
            <HStack>
              <Icon as={MdThumbUp} />
              <Text>{complaint.upvotes} upvotes</Text>
            </HStack>
          </HStack>

          {/* Timeline Preview */}
          {complaint.updates && complaint.updates.length > 0 && (
            <Box
              bg="brand.50"
              borderLeft="3px solid"
              borderColor="brand.500"
              p={2}
              rounded="md"
            >
              <HStack spacing={2} mb={1}>
                <Icon as={MdUpdate} color="brand.500" boxSize={4} />
                <Text fontSize="xs" fontWeight="600" color="brand.700">
                  Latest Update
                </Text>
                <Badge colorScheme="brand" fontSize="2xs" ml="auto">
                  {complaint.updates.length} {complaint.updates.length === 1 ? 'update' : 'updates'}
                </Badge>
              </HStack>
              <Text fontSize="xs" color="gray.600" noOfLines={2}>
                {complaint.updates[complaint.updates.length - 1].message}
              </Text>
              <Text fontSize="2xs" color="gray.400" mt={1}>
                {new Date(complaint.updates[complaint.updates.length - 1].timestamp).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </Text>
            </Box>
          )}

          <Text fontSize="xs" color="gray.400">
            Reported {new Date(complaint.createdAt).toLocaleDateString()}
          </Text>
        </Stack>
      </CardBody>

      <CardFooter pt={0}>
        <Button
          rightIcon={<Icon as={MdArrowForward} />}
          colorScheme="brand"
          variant="ghost"
          size="sm"
          onClick={onViewDetails}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
