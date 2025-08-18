// src/ws/StompClient.ts
import {
  Client,
  type IMessage,
  type IFrame,
  type StompSubscription,
  type IStompSocket,
} from '@stomp/stompjs';
// 환경에 따라 아래 import가 더 안정적일 수 있음:
// import SockJS from 'sockjs-client/dist/sockjs';
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

  get isConnected() {
    return this.connected;
  }

  private buildUrl() {
    const base = import.meta.env.VITE_API_BASE as string;
    const path = import.meta.env.VITE_WS_PATH as string;
    const useSock = (import.meta.env.VITE_USE_SOCKJS ?? 'true') === 'true';

    if (useSock) {
      // SockJS는 http(s) 스킴을 그대로 사용
      return { useSock: true, url: `${base}${path}` };
    }
    // native WebSocket은 ws(s) 스킴 필요
    const wsBase = base.replace(/^http/, 'ws');
    return { useSock: false, url: `${wsBase}${path}` };
  }

  connect(opts: ConnectOptions) {
    // 이미 활성 상태면 중복 연결 방지
    if (this.client?.active) return;

    const { useSock, url } = this.buildUrl();
    const connectHeaders: Record<string, string> = {};
    if (opts.token) connectHeaders.Authorization = `Bearer ${opts.token}`;

    const client = new Client({
      // 공통 설정
      connectHeaders,
      debug: (msg) => console.debug('[STOMP]', msg),
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      reconnectDelay: 3000,

      // 콜백들
      onConnect: (_frame: IFrame) => {
        this.connected = true;
        opts.onConnect?.();
        // 연결 전에 호출된 send() flush
        this.pendingSends.splice(0).forEach((fn) => fn());
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

    // ✅ 타입 충돌 해결 포인트: IStompSocket으로 단언
    if (useSock) {
      client.webSocketFactory = () =>
        new SockJS(url) as unknown as IStompSocket;
    } else {
      client.webSocketFactory = () =>
        new WebSocket(url) as unknown as IStompSocket;
      // (참고) 아래 brokerURL 방식도 가능하지만 타입 충돌 회피를 위해 factory로 통일
      // client.brokerURL = url;
    }

    this.client = client;
    client.activate();
  }

  disconnect() {
    if (!this.client) return;
    this.client.deactivate();
    this.client = null;
    this.connected = false;

    // 구독 및 대기 큐 정리
    this.subs.forEach((s) => s.unsubscribe());
    this.subs.clear();
    this.pendingSends = [];
  }

  subscribe(dest: string, cb: (msg: IMessage) => void, id?: string) {
    if (!this.client) throw new Error('STOMP not initialized');

    const sub = this.client.subscribe(dest, cb, id ? { id } : undefined);
    const key = id ?? dest;
    this.subs.set(key, sub);

    return () => {
      sub.unsubscribe();
      this.subs.delete(key);
    };
  }

  send(dest: string, body: unknown, headers: Record<string, string> = {}) {
    const exec = () =>
      this.client!.publish({
        destination: dest,
        headers,
        body: typeof body === 'string' ? body : JSON.stringify(body),
      });

    if (this.connected && this.client) exec();
    else this.pendingSends.push(exec);
  }
}

export const WS = new StompSingleton();
