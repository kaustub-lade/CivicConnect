import { Box, HStack, VStack, Text, Circle, Flex } from '@chakra-ui/react';
import { MdCheck } from 'react-icons/md';
import type { ComplaintStatus } from '../types';

interface StatusTimelineProps {
  currentStatus: ComplaintStatus;
}

const steps = [
  { status: 'submitted', title: 'Submitted', description: 'Issue reported' },
  { status: 'verified', title: 'Verified', description: 'Complaint validated' },
  { status: 'assigned', title: 'Assigned', description: 'Authority assigned' },
  { status: 'in-progress', title: 'In Progress', description: 'Work underway' },
  { status: 'resolved', title: 'Resolved', description: 'Issue fixed' },
];

export default function StatusTimeline({ currentStatus }: StatusTimelineProps) {
  const currentIndex = steps.findIndex(step => step.status === currentStatus);

  return (
    <HStack spacing={0} align="stretch" justify="space-between" w="100%">
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isActive = index === currentIndex;
        
        return (
          <Flex key={index} flex={1} align="center" position="relative">
            <VStack spacing={2} flex={1}>
              <Circle
                size="40px"
                bg={isCompleted ? 'brand.500' : 'gray.200'}
                color="white"
                fontWeight="bold"
                transition="all 0.3s"
              >
                {isCompleted ? <MdCheck size={24} /> : index + 1}
              </Circle>
              <VStack spacing={0}>
                <Text
                  fontSize="sm"
                  fontWeight={isActive ? 'bold' : 'medium'}
                  color={isCompleted ? 'brand.600' : 'gray.500'}
                >
                  {step.title}
                </Text>
                <Text fontSize="xs" color="gray.500" textAlign="center">
                  {step.description}
                </Text>
              </VStack>
            </VStack>
            
            {index < steps.length - 1 && (
              <Box
                h="2px"
                flex={1}
                bg={index < currentIndex ? 'brand.500' : 'gray.200'}
                position="absolute"
                top="20px"
                left="50%"
                w="100%"
                zIndex={-1}
                transition="all 0.3s"
              />
            )}
          </Flex>
        );
      })}
    </HStack>
  );
}
