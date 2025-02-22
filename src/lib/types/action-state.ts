export interface ActionState {
  status: 'idle' | 'pending' | 'error' | 'valid' | null;
  message: string | null;
}
