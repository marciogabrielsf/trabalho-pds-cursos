"use client";

import React from "react";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import Button from "@/components/ui/Button";
import { StatusDialogProps, StatusDialogType } from "@/types/ui";

// Re-export types for convenience
export type { StatusDialogType, StatusDialogProps } from "@/types/ui";

const getStatusConfig = (type: StatusDialogType) => {
    switch (type) {
        case "success":
            return {
                icon: CheckCircle,
                iconColor: "text-green-500",
                titleColor: "text-green-900",
                primaryButtonColor: "bg-green-600 hover:bg-green-700",
            };
        case "error":
            return {
                icon: XCircle,
                iconColor: "text-red-500",
                titleColor: "text-red-900",
                primaryButtonColor: "bg-red-600 hover:bg-red-700",
            };
        case "warning":
            return {
                icon: AlertCircle,
                iconColor: "text-yellow-500",
                titleColor: "text-yellow-900",
                primaryButtonColor: "bg-yellow-600 hover:bg-yellow-700",
            };
        case "info":
            return {
                icon: Info,
                iconColor: "text-blue-500",
                titleColor: "text-blue-900",
                primaryButtonColor: "bg-blue-600 hover:bg-blue-700",
            };
        default:
            return {
                icon: Info,
                iconColor: "text-blue-500",
                titleColor: "text-blue-900",
                primaryButtonColor: "bg-blue-600 hover:bg-blue-700",
            };
    }
};

export function StatusDialog({
    isOpen,
    onClose,
    type,
    title,
    description,
    primaryAction,
    secondaryAction,
    showCloseButton = true,
}: StatusDialogProps) {
    const config = getStatusConfig(type);
    const Icon = config.icon;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseButton={showCloseButton} className="sm:max-w-md">
                <DialogHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Icon size={48} className={config.iconColor} />
                    </div>
                    <DialogTitle className={`text-xl font-semibold ${config.titleColor}`}>
                        {title}
                    </DialogTitle>
                    {description && (
                        <DialogDescription className="text-base text-gray-600 mt-2">
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <DialogFooter className="mt-6">
                    {secondaryAction && (
                        <Button
                            variant="secondary"
                            onClick={secondaryAction.onClick}
                            className="mr-2"
                        >
                            {secondaryAction.label}
                        </Button>
                    )}
                    <Button
                        onClick={primaryAction?.onClick || onClose}
                        className={config.primaryButtonColor}
                    >
                        {primaryAction?.label || "OK"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Componentes especializados para facilitar o uso
export function SuccessDialog({
    isOpen,
    onClose,
    title,
    description,
    primaryAction,
    secondaryAction,
}: Omit<StatusDialogProps, "type">) {
    return (
        <StatusDialog
            isOpen={isOpen}
            onClose={onClose}
            type="success"
            title={title}
            description={description}
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
        />
    );
}

export function ErrorDialog({
    isOpen,
    onClose,
    title,
    description,
    primaryAction,
    secondaryAction,
}: Omit<StatusDialogProps, "type">) {
    return (
        <StatusDialog
            isOpen={isOpen}
            onClose={onClose}
            type="error"
            title={title}
            description={description}
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
        />
    );
}

export function WarningDialog({
    isOpen,
    onClose,
    title,
    description,
    primaryAction,
    secondaryAction,
}: Omit<StatusDialogProps, "type">) {
    return (
        <StatusDialog
            isOpen={isOpen}
            onClose={onClose}
            type="warning"
            title={title}
            description={description}
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
        />
    );
}

export function InfoDialog({
    isOpen,
    onClose,
    title,
    description,
    primaryAction,
    secondaryAction,
}: Omit<StatusDialogProps, "type">) {
    return (
        <StatusDialog
            isOpen={isOpen}
            onClose={onClose}
            type="info"
            title={title}
            description={description}
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
        />
    );
}
