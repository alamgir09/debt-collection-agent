export interface MyUserMessage {
    role: 'user' | 'assistant';
    content: string;
    id: string;
  }
  
  export interface ChatState {
    messages: MyUserMessage[];
    isLoading: boolean;
    error: string | null;
  }