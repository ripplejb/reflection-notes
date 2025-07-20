import { useState, useCallback } from "react";

interface PasswordState {
  isModalOpen: boolean;
  modalTitle: string;
  modalMessage: string;
  isLoading: boolean;
  error: string | null;
}

interface UsePasswordManagerReturn {
  passwordState: PasswordState;
  requestPassword: (title: string, message: string) => Promise<string>;
  closePasswordModal: () => void;
  handlePasswordSubmit: (password: string) => Promise<void>;
}

export function usePasswordManager(): UsePasswordManagerReturn {
  const [passwordState, setPasswordState] = useState<PasswordState>({
    isModalOpen: false,
    modalTitle: "",
    modalMessage: "",
    isLoading: false,
    error: null
  });

  const [pendingResolver, setPendingResolver] = useState<{
    resolve: (password: string) => void;
    reject: (error: Error) => void;
  } | null>(null);

  const requestPassword = useCallback((title: string, message: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      setPasswordState({
        isModalOpen: true,
        modalTitle: title,
        modalMessage: message,
        isLoading: false,
        error: null
      });
      setPendingResolver({ resolve, reject });
    });
  }, []);

  const closePasswordModal = useCallback(() => {
    setPasswordState(prev => ({ ...prev, isModalOpen: false, error: null }));
    if (pendingResolver) {
      pendingResolver.reject(new Error('Password input cancelled'));
      setPendingResolver(null);
    }
  }, [pendingResolver]);

  const handlePasswordSubmit = useCallback(async (password: string) => {
    if (!pendingResolver) return;

    setPasswordState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Password validation can be added here if needed
      if (!password.trim()) {
        throw new Error('Password cannot be empty');
      }

      // Resolve with the password
      pendingResolver.resolve(password);
      setPendingResolver(null);
      
      // Close modal
      setPasswordState(prev => ({ ...prev, isModalOpen: false, isLoading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid password';
      setPasswordState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
    }
  }, [pendingResolver]);

  return {
    passwordState,
    requestPassword,
    closePasswordModal,
    handlePasswordSubmit
  };
}

export default usePasswordManager;
