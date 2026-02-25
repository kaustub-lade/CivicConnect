import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToast } from '@chakra-ui/react';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const useSocket = () => useContext(SocketContext);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Only connect if user is authenticated
    if (!token) return;

    const socketInstance = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected:', socketInstance.id);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    // Listen for new complaint notifications
    socketInstance.on('complaint:new', (data: any) => {
      toast({
        title: '🆕 New Issue Reported',
        description: `${data.title} in ${data.location.area}`,
        status: 'info',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    });

    // Listen for complaint update notifications
    socketInstance.on('complaint:updated', (data: any) => {
      toast({
        title: '📝 Issue Updated',
        description: `${data.title} - Status: ${data.status}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    });

    // Listen for complaint resolution notifications
    socketInstance.on('complaint:resolved', (data: any) => {
      toast({
        title: '✅ Issue Resolved',
        description: `${data.title} has been resolved!`,
        status: 'success',
        duration: 7000,
        isClosable: true,
        position: 'top-right',
      });
    });

    // Listen for volunteer opportunity notifications
    socketInstance.on('volunteer:new', (data: any) => {
      toast({
        title: '🤝 New Volunteer Opportunity',
        description: `${data.title} - +${data.points} points`,
        status: 'info',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [toast]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
