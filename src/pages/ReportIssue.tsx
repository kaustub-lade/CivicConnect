import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  Select,
  Button,
  Image,
  HStack,
  useToast,
  Icon,
  SimpleGrid,
  IconButton,
  Badge,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdCloudUpload, MdLocationOn, MdSend, MdMyLocation, MdClose } from 'react-icons/md';
import { complaintAPI, uploadAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ReportIssue() {
  const toast = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    priority: 'medium',
    location: '',
    area: '',
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 5 images maximum
    const remainingSlots = 5 - imageFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast({
        title: 'Image Limit',
        description: `Maximum 5 images allowed. Adding first ${remainingSlots} images.`,
        status: 'warning',
        duration: 3000,
      });
    }

    // Create previews
    const newPreviews: string[] = [];
    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === filesToAdd.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImageFiles([...imageFiles, ...filesToAdd]);
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const getGPSLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'GPS Not Supported',
        description: 'Your browser does not support GPS location',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGpsLocation({ lat: latitude, lng: longitude });
        setFormData({
          ...formData,
          location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        });
        setLoadingLocation(false);
        
        toast({
          title: 'Location Detected',
          description: `GPS coordinates: ${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`,
          status: 'success',
          duration: 3000,
        });
      },
      (error) => {
        setLoadingLocation(false);
        let errorMessage = 'Failed to get location';
        
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Location permission denied. Please enable location access';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = 'Location information unavailable';
        } else if (error.code === error.TIMEOUT) {
          errorMessage = 'Location request timed out';
        }
        
        toast({
          title: 'Location Error',
          description: errorMessage,
          status: 'error',
          duration: 4000,
        });
      }
    );
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check authentication
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to report an issue',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }

    // Validation
    if (!formData.title || !formData.category || !formData.description || !formData.area) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload all images if they exist
      const imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        try {
          for (const file of imageFiles) {
            const uploadResponse = await uploadAPI.uploadImage(file);
            imageUrls.push(uploadResponse.data.url);
          }
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          toast({
            title: 'Some Images Failed to Upload',
            description: 'Proceeding with uploaded images',
            status: 'warning',
            duration: 2000,
          });
        }
      }

      // Prepare complaint data
      const complaintData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        location: {
          lat: gpsLocation?.lat || 0,
          lng: gpsLocation?.lng || 0,
          area: formData.area,
        },
        ...(imageUrls.length > 0 && { images: imageUrls }),
      };

      // Submit complaint
      const response = await complaintAPI.create(complaintData);

      toast({
        title: 'Issue Reported Successfully!',
        description: 'Your complaint has been submitted and will be reviewed shortly.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        title: '',
        category: '',
        description: '',
        priority: 'medium',
        location: '',
        area: '',
      });
      setImagePreviews([]);
      setImageFiles([]);
      setGpsLocation(null);

      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: 'Submission Failed',
        description: error.message || 'Failed to submit complaint. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box bg="gray.50" py={12} minH="calc(100vh - 64px)">
      <Container maxW="3xl">
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading size="xl" mb={2}>Report a Civic Issue</Heading>
            <Text color="gray.600">
              Help us improve your community by reporting problems
            </Text>
          </Box>

          {/* Form */}
          <Box bg="white" p={8} rounded="xl" shadow="sm">
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                {/* Title */}
                <FormControl isRequired>
                  <FormLabel>Issue Title</FormLabel>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Brief description of the issue"
                    size="lg"
                  />
                </FormControl>

                {/* Category and Priority */}
                <HStack spacing={4}>
                  <FormControl isRequired flex={1}>
                    <FormLabel>Category</FormLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="Select category"
                      size="lg"
                    >
                      <option value="garbage">🗑️ Garbage Management</option>
                      <option value="water">💧 Water Supply</option>
                      <option value="roads">🛣️ Roads & Infrastructure</option>
                      <option value="electricity">⚡ Electricity</option>
                      <option value="public-safety">🚨 Public Safety</option>
                      <option value="other">📋 Other</option>
                    </Select>
                  </FormControl>

                  <FormControl flex={1}>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      size="lg"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Select>
                  </FormControl>
                </HStack>

                {/* Description */}
                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide detailed information about the issue"
                    rows={5}
                    size="lg"
                  />
                </FormControl>

                {/* Location */}
                <FormControl isRequired>
                  <FormLabel>Area/Ward</FormLabel>
                  <Input
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="e.g., Ward 12, Sector 5, etc."
                    size="lg"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Exact Location (Optional)</FormLabel>
                  <HStack spacing={2}>
                    <InputGroup size="lg" flex={1}>
                      <InputLeftElement>
                        <Icon as={MdLocationOn} />
                      </InputLeftElement>
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Street address or landmark"
                      />
                    </InputGroup>
                    <Button
                      leftIcon={<Icon as={MdMyLocation} />}
                      colorScheme="blue"
                      variant="outline"
                      onClick={getGPSLocation}
                      isLoading={loadingLocation}
                      loadingText="Getting..."
                      size="lg"
                    >
                      GPS
                    </Button>
                  </HStack>
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    {gpsLocation 
                      ? `📍 GPS: ${gpsLocation.lat.toFixed(4)}°, ${gpsLocation.lng.toFixed(4)}°`
                      : 'Click GPS button to auto-detect your location'
                    }
                  </Text>
                </FormControl>

                {/* Image Upload */}
                <FormControl>
                  <FormLabel>
                    Upload Photos (Optional)
                    <Badge ml={2} colorScheme="blue">
                      {imageFiles.length}/5
                    </Badge>
                  </FormLabel>
                  
                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4} mb={4}>
                      {imagePreviews.map((preview, index) => (
                        <Box key={index} position="relative">
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            h="120px"
                            w="100%"
                            objectFit="cover"
                            rounded="md"
                            border="2px solid"
                            borderColor="brand.200"
                          />
                          <IconButton
                            aria-label="Remove image"
                            icon={<Icon as={MdClose} />}
                            size="sm"
                            colorScheme="red"
                            position="absolute"
                            top={1}
                            right={1}
                            onClick={() => removeImage(index)}
                          />
                        </Box>
                      ))}
                    </SimpleGrid>
                  )}
                  
                  {/* Upload Box */}
                  {imageFiles.length < 5 && (
                    <Box
                      border="2px dashed"
                      borderColor="gray.300"
                      rounded="lg"
                      p={8}
                      textAlign="center"
                      cursor="pointer"
                      _hover={{ borderColor: 'brand.500', bg: 'brand.50' }}
                      transition="all 0.2s"
                      position="relative"
                    >
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        position="absolute"
                        top={0}
                        left={0}
                        w="100%"
                        h="100%"
                        opacity={0}
                        cursor="pointer"
                      />
                      <VStack spacing={2}>
                        <Icon as={MdCloudUpload} w={12} h={12} color="gray.400" />
                        <Text color="gray.600">
                          Click to upload or drag and drop
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                          PNG, JPG up to 10MB each • Max 5 images
                        </Text>
                      </VStack>
                    </Box>
                  )}
                </FormControl>

                {/* Submit Button */}
                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  w="100%"
                  leftIcon={<Icon as={MdSend} />}
                  _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                  transition="all 0.2s"
                  isLoading={isSubmitting}
                  loadingText="Submitting..."
                >
                  Submit Report
                </Button>
              </VStack>
            </form>
          </Box>

          {/* Info Box */}
          <Box bg="blue.50" p={4} rounded="lg" border="1px" borderColor="blue.200">
            <Text fontSize="sm" color="blue.800">
              <strong>Note:</strong> All reports are reviewed before being made public.
              False reports may result in account suspension. Please provide accurate
              information to help solve community issues effectively.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
