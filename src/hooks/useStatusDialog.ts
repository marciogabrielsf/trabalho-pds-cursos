import { useState, useCallback } from "react";
import { StatusDialogState, DialogAction } from "@/types/ui";

const initialState: StatusDialogState = {
    isOpen: false,
    type: "info",
    title: "",
    description: "",
    primaryAction: undefined,
    secondaryAction: undefined,
};

export function useStatusDialog() {
    const [dialogState, setDialogState] = useState<StatusDialogState>(initialState);

    const openDialog = useCallback((state: Omit<StatusDialogState, "isOpen">) => {
        setDialogState({
            ...state,
            isOpen: true,
        });
    }, []);

    const closeDialog = useCallback(() => {
        setDialogState(initialState);
    }, []);

    const showSuccess = useCallback(
        (
            title: string,
            description?: string,
            primaryAction?: DialogAction,
            secondaryAction?: DialogAction
        ) => {
            openDialog({
                type: "success",
                title,
                description,
                primaryAction,
                secondaryAction,
            });
        },
        [openDialog]
    );

    const showError = useCallback(
        (
            title: string,
            description?: string,
            primaryAction?: DialogAction,
            secondaryAction?: DialogAction
        ) => {
            openDialog({
                type: "error",
                title,
                description,
                primaryAction,
                secondaryAction,
            });
        },
        [openDialog]
    );

    const showWarning = useCallback(
        (
            title: string,
            description?: string,
            primaryAction?: DialogAction,
            secondaryAction?: DialogAction
        ) => {
            openDialog({
                type: "warning",
                title,
                description,
                primaryAction,
                secondaryAction,
            });
        },
        [openDialog]
    );

    const showInfo = useCallback(
        (
            title: string,
            description?: string,
            primaryAction?: DialogAction,
            secondaryAction?: DialogAction
        ) => {
            openDialog({
                type: "info",
                title,
                description,
                primaryAction,
                secondaryAction,
            });
        },
        [openDialog]
    );

    return {
        dialogState,
        openDialog,
        closeDialog,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };
}
