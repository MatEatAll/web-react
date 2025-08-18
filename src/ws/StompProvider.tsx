import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { IMessage } from '@stomp/stompjs';
import { WS } from './StompClient';

type StompContextType = {
  status: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';
  connect: (token?: string) => void;
  disconnect: () => void;
  subscribe: (dest: string, cb: (msg: IMessage) => void, id?: string) => () => void;
  send: (dest: string, body: unknown, headers?: Record<string,string>) => void;
};

const StompCtx = createContext<StompContextType | null>(null);

export const StompProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [status, setStatus] = useState<StompContextType['status']>('idle');

  const connect = (token?: string) => {
    setStatus('connecting');
    WS.connect({
      token,
      onConnect: () => setStatus('connected'),
      onDisconnect: () => setStatus('disconnected'),
      onError: () => setStatus('error'),
    });
  };

  const disconnect = () => {
    WS.disconnect();
    setStatus('disconnected');
  };

  useEffect(() => () => WS.disconnect(), []);

  const value = useMemo<StompContextType>(() => ({
    status,
    connect,
    disconnect,
    subscribe: (dest, cb, id) => WS.subscribe(dest, cb, id),
    send: (dest, body, headers) => WS.send(dest, body, headers),
  }), [status]);

  return <StompCtx.Provider value={value}>{children}</StompCtx.Provider>;
};

export const useStomp = () => {
  const ctx = useContext(StompCtx);
  if (!ctx) throw new Error('useStomp must be used inside <StompProvider>');
  return ctx;
};
