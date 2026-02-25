import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Select,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  Spinner,
  Alert,
  AlertIcon,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { MdEdit, MdCheckCircle, MdPerson, MdLocationOn } from 'react-icons/md';
import { complaintAPI } from '../services/api';
import type { Complaint } from '../types';

const statusColors: Record<string, string> = {
  submitted: 'gray',
  verified: 'blue',
  assigned: 'purple',
  'in-progress': 'orange',
  resolved: 'green',
};

export default function AdminPanel() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [updateMessage, setUpdateMessage] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await complaintAPI.getAll();
      setComplaints(data);
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
      setError('Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setUpdateMessage('');
    onOpen();
  };

  const handleUpdateComplaint = async () => {
    if (!selectedComplaint) return;

    try {
      await complaintAPI.update(selectedComplaint.complaintId, {
        status: newStatus,
      });

      if (updateMessage) {
        await complaintAPI.addUpdate(selectedComplaint.complaintId, {
          text: updateMessage,
        });
      }

      toast({
        title: 'Complaint Updated',
        description: 'Status and update added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
      fetchComplaints();
    } catch (err) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update complaint',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredComplaints = complaints.filter(c => 
    filterStatus === 'all' || c.status === filterStatus
  );

  const stats = {
    total: complaints.length,
    submitted: complaints.filter(c => c.status === 'submitted').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={{ base: 4, md: 8 }}>
      <Container maxW="7xl" px={{ base: 4, md: 6 }}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Heading size={{ base: 'lg', md: 'xl' }} mb={2}>
              🛡️ Admin Panel
            </Heading>
            <Text color="gray.600" fontSize={{ base: 'sm', md: 'md' }}>
              Manage complaints and update statuses
            </Text>
          </Box>

          {/* Stats */}
          <HStack spacing={4} flexWrap="wrap">
            <Badge colorScheme="blue" p={3} rounded="lg" fontSize="md">
              Total: {stats.total}
            </Badge>
            <Badge colorScheme="gray" p={3} rounded="lg" fontSize="md">
              New: {stats.submitted}
            </Badge>
            <Badge colorScheme="orange" p={3} rounded="lg" fontSize="md">
              In Progress: {stats.inProgress}
            </Badge>
            <Badge colorScheme="green" p={3} rounded="lg" fontSize="md">
              Resolved: {stats.resolved}
            </Badge>
          </HStack>

          {/* Filter */}
          <HStack spacing={4}>
            <Text fontWeight="medium">Filter:</Text>
            <Select
              maxW="200px"
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

          {/* Error Alert */}
          {error && (
            <Alert status="error" rounded="md">
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
            /* Table */
            <Box overflowX="auto" bg="white" rounded="lg" shadow="sm">
              <Table variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th>ID</Th>
                    <Th>Title</Th>
                    <Th>Category</Th>
                    <Th>Location</Th>
                    <Th>Status</Th>
                    <Th>Date</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredComplaints.map((complaint) => (
                    <Tr key={complaint.complaintId} _hover={{ bg: 'gray.50' }}>
                      <Td fontFamily="mono" fontSize="sm">
                        {complaint.complaintId.slice(-6)}
                      </Td>
                      <Td maxW="200px" isTruncated>
                        {complaint.title}
                      </Td>
                      <Td>
                        <Badge>{complaint.category}</Badge>
                      </Td>
                      <Td>
                        <HStack fontSize="sm">
                          <Icon as={MdLocationOn} />
                          <Text isTruncated maxW="150px">
                            {complaint.location.area}
                          </Text>
                        </HStack>
                      </Td>
                      <Td>
                        <Badge colorScheme={statusColors[complaint.status]}>
                          {complaint.status}
                        </Badge>
                      </Td>
                      <Td fontSize="sm">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </Td>
                      <Td>
                        <Button
                          size="sm"
                          leftIcon={<Icon as={MdEdit} />}
                          colorScheme="brand"
                          onClick={() => handleEditClick(complaint)}
                        >
                          Update
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </VStack>
      </Container>

      {/* Update Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Complaint</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {selectedComplaint && (
                <>
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      {selectedComplaint.title}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {selectedComplaint.description}
                    </Text>
                  </Box>

                  <Box>
                    <Text fontWeight="medium" mb={2}>
                      Update Status
                    </Text>
                    <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                      <option value="submitted">Submitted</option>
                      <option value="verified">Verified</option>
                      <option value="assigned">Assigned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </Select>
                  </Box>

                  <Box>
                    <Text fontWeight="medium" mb={2}>
                      Add Update Message (Optional)
                    </Text>
                    <Textarea
                      placeholder="Enter update message for the user..."
                      value={updateMessage}
                      onChange={(e) => setUpdateMessage(e.target.value)}
                      rows={4}
                    />
                  </Box>
                </>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleUpdateComplaint}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
