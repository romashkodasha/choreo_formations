export enum SnackbarMessageGoalsType {
    success = 'success',
    error = 'error',
  }
  
  export type SnackbarMessageType = {
    text: React.ReactNode;
    goal?: SnackbarMessageGoalsType;
    duration?: number;
  };
  
  export const DEFAULT_SNACKBAR_MESSAGES = {
    error: {
      text: 'Произошла ошибка',
      goal: SnackbarMessageGoalsType.error,
    },
    success: {
      text: 'Действие успешно выполнено',
      goal: SnackbarMessageGoalsType.success,
    },
    email: {
      text: 'Пользователь с таким email уже существует',
      goal: SnackbarMessageGoalsType.error,
    },
  };
  