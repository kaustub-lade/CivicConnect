import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Badge,
  Image,
  Box,
  Icon,
  Divider,
  Heading,
  SimpleGrid,
} from '@chakra-ui/react';
import { MdLocationOn, MdThumbUp, MdPerson, MdCalendarToday, MdCategory } from 'react-icons/md';
import type { Complaint } from '../types';
import { useState } from 'react';

interface ComplaintDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
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

const priorityColors: Record<string, string> = {
  low: 'green',
  medium: 'orange',
  high: 'red',
};

const categoryIcons: Record<string, string> = {
  garbage: '🗑️',
  water: '💧',
  roads: '🛣️',
  electricity: '⚡',
  'public-safety': '🚨',
  other: '📋',
};

export default function ComplaintDetailsModal({
  isOpen,
  onClose,
  complaint,
}: ComplaintDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!complaint) return null;

  const statusColor = statusColors[complaint.status] || 'gray';
  const priorityColor = priorityColors[complaint.priority] || 'gray';
  
  // Support both single imageURL and multiple images array
  const images = complaint.images || (complaint.imageURL ? [complaint.imageURL] : []);
  const hasMultipleImages = images.length > 1;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader>
          <HStack justify="space-between" pr={8}>
            <HStack>
              <Text fontSize="2xl">
                {categoryIcons[complaint.category]}
              </Text>
              <Heading size="md">{complaint.title}</Heading>
            </HStack>
            <HStack>
              <Badge colorScheme={statusColor} fontSize="sm" px={3} py={1} rounded="full">
                {complaint.status.replace('-', ' ').toUpperCase()}
              </Badge>
              <Badge colorScheme={priorityColor} fontSize="sm" px={3} py={1} rounded="full">
                {complaint.priority.toUpperCase()}
              </Badge>
            </HStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Image Gallery */}
            {images.length > 0 && (
              <Box position="relative">
                <Image
                  src={images[currentImageIndex]}
                  alt={`${complaint.title} - Image ${currentImageIndex + 1}`}
                  w="100%"
                  h="400px"
                  objectFit="cover"
                  rounded="md"
                  fallbackSrc="https://via.placeholder.com/800x400?text=No+Image"
                />
                
                {hasMultipleImages && (
                  <>
                    <Button
                      position="absolute"
                      left={2}
                      top="50%"
                      transform="translateY(-50%)"
                      onClick={handlePrevImage}
                      size="sm"
                      colorScheme="whiteAlpha"
                      bg="blackAlpha.600"
                      _hover={{ bg: 'blackAlpha.800' }}
                    >
                      ←
                    </Button>
                    <Button
                      position="absolute"
                      right={2}
                      top="50%"
                      transform="translateY(-50%)"
                      onClick={handleNextImage}
                      size="sm"
                      colorScheme="whiteAlpha"
                      bg="blackAlpha.600"
                      _hover={{ bg: 'blackAlpha.800' }}
                    >
                      →
                    </Button>
                    <Box
                      position="absolute"
                      bottom={2}
                      left="50%"
                      transform="translateX(-50%)"
                      bg="blackAlpha.700"
                      px={3}
                      py={1}
                      rounded="full"
                      color="white"
                      fontSize="sm"
                    >
                      {currentImageIndex + 1} / {images.length}
                    </Box>
                  </>
                )}
              </Box>
            )}

            {/* Image Thumbnails */}
            {hasMultipleImages && (
              <SimpleGrid columns={Math.min(images.length, 5)} spacing={2}>
                {images.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    h="60px"
                    w="100%"
                    objectFit="cover"
                    rounded="md"
                    cursor="pointer"
                    opacity={idx === currentImageIndex ? 1 : 0.6}
                    border={idx === currentImageIndex ? '2px solid' : 'none'}
                    borderColor="brand.500"
                    onClick={() => setCurrentImageIndex(idx)}
                    _hover={{ opacity: 1 }}
                    transition="all 0.2s"
                  />
                ))}
              </SimpleGrid>
            )}

            <Divider />

            {/* Description */}
            <Box>
              <Heading size="sm" mb={2}>Description</Heading>
              <Text color="gray.700" lineHeight="tall">
                {complaint.description}
              </Text>
            </Box>

            <Divider />

            {/* Details Grid */}
            <SimpleGrid columns={2} spacing={4}>
              <Box>
                <HStack color="gray.500" mb={1}>
                  <Icon as={MdLocationOn} />
                  <Text fontSize="sm" fontWeight="medium">Location</Text>
                </HStack>
                <Text>{complaint.location.area}</Text>
                {complaint.location.address && (
                  <Text fontSize="sm" color="gray.600">{complaint.location.address}</Text>
                )}
              </Box>

              <Box>
                <HStack color="gray.500" mb={1}>
                  <Icon as={MdCategory} />
                  <Text fontSize="sm" fontWeight="medium">Category</Text>
                </HStack>
                <Text textTransform="capitalize">{complaint.category.replace('-', ' ')}</Text>
              </Box>

              <Box>
                <HStack color="gray.500" mb={1}>
                  <Icon as={MdCalendarToday} />
                  <Text fontSize="sm" fontWeight="medium">Reported On</Text>
                </HStack>
                <Text>{new Date(complaint.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</Text>
              </Box>

              <Box>
                <HStack color="gray.500" mb={1}>
                  <Icon as={MdThumbUp} />
                  <Text fontSize="sm" fontWeight="medium">Community Support</Text>
                </HStack>
                <Text>{complaint.upvotes} upvotes</Text>
              </Box>

              {complaint.assignedTo && (
                <Box>
                  <HStack color="gray.500" mb={1}>
                    <Icon as={MdPerson} />
                    <Text fontSize="sm" fontWeight="medium">Assigned To</Text>
                  </HStack>
                  <Text>{complaint.assignedTo}</Text>
                </Box>
              )}
            </SimpleGrid>

            {/* Updates Timeline */}
            {complaint.updates && complaint.updates.length > 0 && (
              <>
                <Divider />
                <Box>
                  <Heading size="sm" mb={3}>Updates</Heading>
                  <VStack align="stretch" spacing={3}>
                    {complaint.updates.map((update, idx) => (
                      <Box
                        key={idx}
                        p={3}
                        bg="gray.50"
                        rounded="md"
                        borderLeft="3px solid"
                        borderColor="brand.500"
                      >
                        <Text fontSize="sm" color="gray.600" mb={1}>
                          {new Date(update.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Text>
                        <Text>{update.message}</Text>
                        {update.image && (
                          <Image
                            src={update.image}
                            alt="Update image"
                            mt={2}
                            maxH="200px"
                            objectFit="cover"
                            rounded="md"
                          />
                        )}
                      </Box>
                    ))}
                  </VStack>
                </Box>
              </>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button
              leftIcon={<Icon as={MdThumbUp} />}
              colorScheme="brand"
              variant="outline"
            >
              Upvote
            </Button>
            <Button onClick={onClose}>Close</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
