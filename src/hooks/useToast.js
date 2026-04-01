import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

/**
 * Custom hook for toast notifications in admin panel
 * Provides consistent success, error, and loading states for form actions
 */
export const useToast = () => {
  /**
   * Show success toast
   * @param {string} message - Success message to display
   * @param {object} options - Additional toast options
   */
  const showSuccess = (message, options = {}) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
      ...options,
    })
  }

  /**
   * Show error toast
   * @param {string} message - Error message to display
   * @param {object} options - Additional toast options
   */
  const showError = (message, options = {}) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
      ...options,
    })
  }

  /**
   * Show info toast
   * @param {string} message - Info message to display
   * @param {object} options - Additional toast options
   */
  const showInfo = (message, options = {}) => {
    toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
      ...options,
    })
  }

  /**
   * Show warning toast
   * @param {string} message - Warning message to display
   * @param {object} options - Additional toast options
   */
  const showWarning = (message, options = {}) => {
    toast.warning(message, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
      ...options,
    })
  }

  /**
   * Show loading toast and return a function to dismiss/update it
   * @param {string} message - Loading message to display
   * @param {object} options - Additional toast options
   * @returns {function} Function to dismiss the toast
   */
  const showLoading = (message, options = {}) => {
    const toastId = toast.loading(message, {
      position: 'top-right',
      theme: 'light',
      ...options,
    })
    return {
      dismiss: () => toast.dismiss(toastId),
      updateToSuccess: (successMessage) =>
        toast.update(toastId, {
          render: successMessage,
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        }),
      updateToError: (errorMessage) =>
        toast.update(toastId, {
          render: errorMessage,
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        }),
    }
  }

  /**
   * Promise-based toast for async operations
   * @param {Promise} promise - Promise to track
   * @param {object} messages - Messages for pending, success, and error states
   * @param {object} options - Additional toast options
   */
  const showPromise = async (
    promise,
    { pending = 'Loading...', success = 'Success!', error = 'An error occurred' },
    options = {}
  ) => {
    return toast.promise(
      promise,
      {
        pending,
        success,
        error,
      },
      {
        position: 'top-right',
        theme: 'light',
        ...options,
      }
    )
  }

  /**
   * Form action helpers with consistent messaging
   */
  const formActions = {
    save: {
      success: (item = 'Item') => showSuccess(`${item} saved successfully!`),
      error: (item = 'item') => showError(`Failed to save ${item}. Please try again.`),
    },
    update: {
      success: (item = 'Item') => showSuccess(`${item} updated successfully!`),
      error: (item = 'item') => showError(`Failed to update ${item}. Please try again.`),
    },
    delete: {
      success: (item = 'Item') => showSuccess(`${item} deleted successfully!`),
      error: (item = 'item') => showError(`Failed to delete ${item}. Please try again.`),
      confirm: (item = 'item') =>
        showWarning(`Are you sure you want to delete this ${item}? This action cannot be undone.`),
    },
    add: {
      success: (item = 'Item') => showSuccess(`${item} added successfully!`),
      error: (item = 'item') => showError(`Failed to add ${item}. Please try again.`),
    },
    fetch: {
      success: (item = 'data') => showSuccess(`${item} loaded successfully!`),
      error: (item = 'data') => showError(`Failed to load ${item}. Please try again.`),
    },
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    showPromise,
    formActions,
    // Expose raw toast for custom cases
    toast,
  }
}

export default useToast
