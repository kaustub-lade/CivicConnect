import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Link,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  Divider,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FaUserCircle, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" py={20}>
      <Box
        bg={bgColor}
        p={8}
        borderRadius="xl"
        boxShadow="xl"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Stack spacing={6}>
          {/* Header */}
          <Stack spacing={2} align="center">
            <Icon as={FaUserCircle} boxSize={12} color="blue.500" />
            <Heading size="lg">Welcome Back</Heading>
            <Text color="gray.600">Sign in to your CivicConnect account</Text>
          </Stack>

          <Divider />

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  size="lg"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="lg">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      size="sm"
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  <Link as={RouterLink} to="/forgot-password" color="blue.500">
                    Forgot password?
                  </Link>
                </Text>
              </HStack>

              <Button
                type="submit"
                colorScheme="brand"
                size="lg"
                leftIcon={<FaLock />}
                isLoading={isLoading}
                loadingText="Signing in..."
                w="full"
              >
                Sign In
              </Button>
            </Stack>
          </form>

          <Divider />

          {/* Sign Up Link */}
          <Text textAlign="center" fontSize="sm">
            Don't have an account?{' '}
            <Link as={RouterLink} to="/signup" color="blue.500" fontWeight="semibold">
              Sign Up
            </Link>
          </Text>
        </Stack>
      </Box>
    </Container>
  );
}
