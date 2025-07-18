"use client";

import React from "react";
import { Bell, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotificationContext } from "@/contexts/NotificationContext";
import NotificationPopoverContent from "./NotificationPopover";

const NotificationBadge: React.FC = () => {
    const { unreadCount, isConnected } = useNotificationContext();

    return (
        <div className="flex items-center p-2 bg-[#F9F9F9] rounded-lg">
            <Popover>
                <PopoverTrigger asChild>
                    <button className="relative text-highlight transition-colors group">
                        <Bell
                            size={24}
                            className={cn("transition-colors", !isConnected && "text-gray-400")}
                        />

                        {/* Badge de notificações não lidas */}
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[18px] h-[18px] animate-pulse">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}

                        {/* Indicador de status de conexão */}
                        <div className="absolute -bottom-1 -right-1">
                            {isConnected ? (
                                <Wifi
                                    size={10}
                                    className="text-green-500 bg-white rounded-full p-0.5"
                                />
                            ) : (
                                <WifiOff
                                    size={10}
                                    className="text-red-500 bg-white rounded-full p-0.5"
                                />
                            )}
                        </div>
                    </button>
                </PopoverTrigger>

                <PopoverContent className="p-0" align="end" sideOffset={8}>
                    <NotificationPopoverContent />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default NotificationBadge;
