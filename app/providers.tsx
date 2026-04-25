"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                {children}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: "#1e1b4b",
                            color: "#fff",
                            borderRadius: "8px",
                        },
                    }}
                />
            </QueryClientProvider>
        </Provider>
    );
}