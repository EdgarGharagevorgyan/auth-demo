import { Stack } from 'expo-router';
import { AuthProvider } from '../lib/useAuth';
import React from 'react';

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
    );
}
