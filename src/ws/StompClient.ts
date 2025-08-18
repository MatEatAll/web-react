import { Client, type IMessage, type IFrame, type StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

type ConnectOptions = {
  token?: string;
  onConnect?: () => void;
  onDisconnect?: (reason?: string) => void;
  onError?: (err: unknown) => void;
};

class StompSingleton {
  private client: Client | null = null;
  private connected = false;
  private pendingSends: Array<() => void> = [];
  private subs: Map<string, StompSubscription> = new Map();

  get isConnected() { return this.connected; }

  private buildUrl() {
    const base = import.meta.env.VITE_API_BASE as string;
    const path = import.meta.env.VITE_WS_PATH as string;
    const useSock = (import.meta.env.VITE_USE_SOCKJS ?? 'true') === 'true';
    if (useSock) return { useSock: true, url: `${base}${path}` };
    const wsBase = base.replace(/^http/, 'ws');
    return { useSock: false, url: `${wsBase}${path}` };
  }

  connect(opts: ConnectOptions) {
    if (this.client?.active) return;

    const { useSock, url } = this.buildUrl();
    const connectHeaders: Record<string, string> = {};
    if (opts.token) connectHeaders.Authorization = `Bearer ${opts.token}`;

    const client = new Client({
      connectHeaders,
      debug: (msg) => console.debug('[STOMP]', msg),
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      reconnectDelay: 3000,
      onConnect: (_frame: IFrame) => {
        this.connected = true;
        opts.onConnect?.();
        this.pendingSends.splice(0).forEach(fn => fn());
      },
      onStompError: (frame: IFrame) => {
        console.error('[STOMP ERROR]', frame.headers['message'], frame.body);
        opts.onError?.(new Error(frame.headers['message'] ?? 'stomp-error'));
      },
      onDisconnect: () => {
        this.connected = false;
        opts.onDisconnect?.('broker-disconnect');
      },
      onWebSocketClose: (evt) => {
        this.connected = false;
        opts.onDisconnect?.(`ws-close ${evt.code}`);
      },
    });

    if (useSock) client.webSocketFactory = () => new SockJS(url);
    else client.brokerURL = url;

    this.client = client;
    client.activate();
  }

  disconnect() {
    if (!this.client) return;
    this.client.deactivate();
    this.client = null;
    this.connected = false;
    this.subs.forEach(s => s.unsubscribe());
    this.subs.clear();
    this.pendingSends = [];
  }

  subscribe(dest: string, cb: (msg: IMessage) => void, id?: string) {
    if (!this.client) throw new Error('STOMP not initialized');
    const sub = this.client.subscribe(dest, cb, id ? { id } : undefined);
    const key = id ?? dest;
    this.subs.set(key, sub);
    return () => { sub.unsubscribe(); this.subs.delete(key); };
  }

  send(dest: string, body: unknown, headers: Record<string,string> = {}) {
    const exec = () => this.client!.publish({
      destination: dest,
      headers,
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
    if (this.connected && this.client) exec();
    else this.pendingSends.push(exec);
  }
}

export const WS = new StompSingleton();
