// Types for UI components, specifically for dialogs and status components

export type StatusDialogType = "success" | "error" | "warning" | "info";

export interface DialogAction {
    label: string;
    onClick: () => void;
}

export interface StatusDialogProps {
    isOpen: boolean;
    onClose: () => void;
    type: StatusDialogType;
    title: string;
    description?: string;
    primaryAction?: DialogAction;
    secondaryAction?: DialogAction;
    showCloseButton?: boolean;
}

export interface StatusDialogState {
    isOpen: boolean;
    type: StatusDialogType;
    title: string;
    description?: string;
    primaryAction?: DialogAction;
    secondaryAction?: DialogAction;
}

export interface StatusDialogHook {
    dialogState: StatusDialogState;
    openDialog: (state: Omit<StatusDialogState, "isOpen">) => void;
    closeDialog: () => void;
    showSuccess: (
        title: string,
        description?: string,
        primaryAction?: DialogAction,
        secondaryAction?: DialogAction
    ) => void;
    showError: (
        title: string,
        description?: string,
        primaryAction?: DialogAction,
        secondaryAction?: DialogAction
    ) => void;
    showWarning: (
        title: string,
        description?: string,
        primaryAction?: DialogAction,
        secondaryAction?: DialogAction
    ) => void;
    showInfo: (
        title: string,
        description?: string,
        primaryAction?: DialogAction,
        secondaryAction?: DialogAction
    ) => void;
}
