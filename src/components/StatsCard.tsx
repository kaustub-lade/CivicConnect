import { Box, Text, Icon, VStack, HStack } from '@chakra-ui/react';
import type { IconType } from 'react-icons';

interface StatsCardProps {
  label: string;
  value: string | number;
  helpText?: string;
  icon: IconType;
  colorScheme?: string;
}

export default function StatsCard({ 
  label, 
  value, 
  helpText, 
  icon,
  colorScheme = 'brand' 
}: StatsCardProps) {
  return (
    <Box
      bg="white"
      p={6}
      rounded="lg"
      shadow="sm"
      border="1px"
      borderColor="gray.100"
      _hover={{ shadow: 'md' }}
      transition="all 0.2s"
    >
      <VStack align="stretch" spacing={3}>
        <HStack>
          <Box
            bg={`${colorScheme}.50`}
            p={2}
            rounded="lg"
          >
            <Icon as={icon} w={6} h={6} color={`${colorScheme}.500`} />
          </Box>
          <Text fontSize="sm" color="gray.600" fontWeight="medium">
            {label}
          </Text>
        </HStack>
        <Text fontSize="3xl" fontWeight="bold">
          {value}
        </Text>
        {helpText && (
          <Text fontSize="xs" color="gray.500">
            {helpText}
          </Text>
        )}
      </VStack>
    </Box>
  );
}
