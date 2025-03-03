
import { useToast as useToastOriginal } from "@/components/ui/use-toast";

// Notification queue with minimal spacing for testing
let notificationQueue: Array<{
  id: string;
  props: any;
  timestamp: number;
}> = [];

let isProcessingQueue = false;
const NOTIFICATION_SPACING = 1000; // Reduced spacing for faster testing
const MAX_VISIBLE_TOASTS = 3; // Limit visible toasts to prevent overcrowding

// Process notifications efficiently with minimal forced spacing
const processQueue = (originalToast: any) => {
  if (notificationQueue.length === 0) {
    isProcessingQueue = false;
    return;
  }
  
  isProcessingQueue = true;
  const nextNotification = notificationQueue.shift();
  
  if (nextNotification) {
    // Check current visible toasts to manage overcrowding
    const visibleToasts = document.querySelectorAll('[role="status"]').length;
    
    if (visibleToasts < MAX_VISIBLE_TOASTS) {
      // Display the notification with positioned offset
      originalToast.toast({
        ...nextNotification.props,
        id: nextNotification.id,
        duration: 1500, // Shorter duration for faster testing
        className: `toast-${visibleToasts}`, // Apply positioning class
      });
    }
    
    // Process next notification with minimal delay
    setTimeout(() => {
      processQueue(originalToast);
    }, Math.max(500, NOTIFICATION_SPACING - (visibleToasts * 200))); // Reduce spacing if queue is building up
  }
};

export function useToast() {
  const originalToast = useToastOriginal();
  
  return {
    ...originalToast,
    toast: (props: any) => {
      // For error notifications, show immediately
      if (props.variant === "destructive") {
        return originalToast.toast(props);
      }
      
      // For mining rewards, use queue system
      const notificationId = props.id || `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Add to queue
      notificationQueue.push({
        id: notificationId,
        props: props,
        timestamp: Date.now()
      });
      
      // Start processing if not already
      if (!isProcessingQueue) {
        processQueue(originalToast);
      }
      
      return {
        id: notificationId,
        dismiss: () => originalToast.dismiss(notificationId),
        update: (props: any) => originalToast.update({ ...props, id: notificationId })
      };
    },
    dismiss: originalToast.dismiss
  };
}
