import type React from 'react';
import { createContext, useContext } from 'react';
import { toast, Toaster } from 'sonner';

type ToastProps = {
  title?: string;
  description?: React.ReactNode;
  duration?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  action?: {
    label: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  };
  cancel?: {
    label: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  };
  onDismiss?: () => void;
  onAutoClose?: () => void;
};

interface NotificationContextType {
  success: (title: string, props?: Omit<ToastProps, 'title'>) => void;
  error: (title: string, props?: Omit<ToastProps, 'title'>) => void;
  info: (title: string, props?: Omit<ToastProps, 'title'>) => void;
  warning: (title: string, props?: Omit<ToastProps, 'title'>) => void;
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    },
    opts?: Omit<ToastProps, 'title'>
  ) => Promise<T>;
  dismiss: (toastId?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const success = (title: string, props?: Omit<ToastProps, 'title'>) => {
    toast.success(title, {
      ...props,
      className: "toast-success",
    });
  };

  const error = (title: string, props?: Omit<ToastProps, 'title'>) => {
    toast.error(title, {
      ...props,
      className: "toast-error",
    });
  };

  const info = (title: string, props?: Omit<ToastProps, 'title'>) => {
    toast.info(title, {
      ...props,
      className: "toast-info",
    });
  };

  const warning = (title: string, props?: Omit<ToastProps, 'title'>) => {
    toast.warning(title, {
      ...props,
      className: "toast-warning",
    });
  };

  const promise = <T,>(
    promiseObj: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    },
    opts?: Omit<ToastProps, 'title'>
  ): Promise<T> => {
    // Combine options with opts when calling toast.promise
    toast.promise(promiseObj, {
      ...opts,
      loading: options.loading,
      success: options.success,
      error: options.error,
    });
    return promiseObj;
  };

  const dismiss = (toastId?: string) => {
    toast.dismiss(toastId);
  };

  const value = {
    success,
    error,
    info,
    warning,
    promise,
    dismiss,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          className: "toast-container",
        }}
        theme="system"
      />
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }

  return context;
};
