// Nuxt 3 global status state using useState()
export type StatusType = 'info' | 'success' | 'warning' | 'error';

export interface StatusState {
  message: string;
  type: StatusType;
  show: boolean;
  timeout: number; // milliseconds; 0 = sticky
  loading: boolean;
}

export const useStatus = () => {
  // Single global state entry
  const state = useState<StatusState>('status', () => ({
    message: '',
    type: 'info',
    show: false,
    timeout: 0,
    loading: false,
  }));

  function set(payload: Partial<StatusState> & { message: string }) {
    state.value.message = payload.message;
    if (payload.type) state.value.type = payload.type;
    state.value.show = payload.show ?? true;
    if (payload.timeout !== undefined) state.value.timeout = payload.timeout;
    if (payload.loading !== undefined) state.value.loading = payload.loading;
  }

  function clear() {
    state.value.show = false;
    state.value.loading = false;
  }

  return { state, set, clear };
};