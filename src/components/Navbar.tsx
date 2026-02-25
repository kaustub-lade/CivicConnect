import {
  Box,
  Flex,
  Button,
  HStack,
  Text,
  IconButton,
  useDisclosure,
  Stack,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Badge,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { MdHome, MdAddCircle, MdDashboard, MdMap, MdPeople, MdPerson, MdLogout, MdEmojiEvents } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const NavLink = ({ children, to }: { children: React.ReactNode; to: string }) => (
  <Button
    as={RouterLink}
    to={to}
    px={4}
    py={2}
    rounded="md"
    variant="ghost"
    color="white"
    _hover={{
      textDecoration: 'none',
      bg: 'whiteAlpha.200',
    }}
    fontWeight="medium"
  >
    {children}
  </Button>
);

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box bg="brand.700" px={4} shadow="lg" position="sticky" top={0} zIndex={1000}>
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="7xl" mx="auto">
        {/* Logo */}
        <HStack 
          as={RouterLink} 
          to="/" 
          spacing={3}
          cursor="pointer"
          _hover={{ opacity: 0.8 }}
          transition="opacity 0.2s"
        >
          <Icon as={MdHome} w={8} h={8} color="white" />
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="white"
          >
            CivicConnect
          </Text>
        </HStack>

        {/* Desktop Navigation */}
        <HStack as="nav" spacing={1} display={{ base: 'none', lg: 'flex' }}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/report">Report Issue</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/map">Map View</NavLink>
          <NavLink to="/volunteer">Volunteer Hub</NavLink>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
        </HStack>

        {/* Right side actions */}
        <HStack spacing={3} display={{ base: 'none', lg: 'flex' }}>
          {isAuthenticated ? (
            <>
              <IconButton
                aria-label="Notifications"
                icon={<BellIcon />}
                variant="ghost"
                rounded="full"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
              />
              
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  variant="ghost"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  <HStack>
                    <Avatar size="sm" name={user?.name} src={user?.avatar} />
                    <Box textAlign="left">
                      <Text fontSize="sm" fontWeight="medium">{user?.name}</Text>
                      <Badge colorScheme="green" fontSize="xs">{user?.points} pts</Badge>
                    </Box>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/profile" icon={<Icon as={MdPerson} />}>
                    My Profile
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/dashboard" icon={<Icon as={MdDashboard} />}>
                    My Reports
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/leaderboard" icon={<Icon as={MdEmojiEvents} />}>
                    Leaderboard
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem icon={<Icon as={MdLogout} />} onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <>
              <Button
                as={RouterLink}
                to="/login"
                variant="ghost"
                size="sm"
              >
                Login
              </Button>
              <Button
                as={RouterLink}
                to="/signup"
                colorScheme="brand"
                size="sm"
              >
                Sign Up
              </Button>
            </>
          )}
        </HStack>

        {/* Mobile menu button */}
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ lg: 'none' }}
          onClick={onToggle}
        />
      </Flex>

      {/* Mobile Navigation */}
      {isOpen && (
        <Box pb={4} display={{ lg: 'none' }}>
          <Stack as="nav" spacing={2}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/report">Report Issue</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/map">Map View</NavLink>
            <NavLink to="/volunteer">Volunteer Hub</NavLink>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/profile">Profile</NavLink>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  leftIcon={<Icon as={MdLogout} />}
                  w="full"
                  justifyContent="flex-start"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <Button
                  as={RouterLink}
                  to="/signup"
                  colorScheme="brand"
                  w="full"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
