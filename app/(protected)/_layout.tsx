import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../lib/useAuth';
import { View, ActivityIndicator } from 'react-native';

export default function ProtectedLayout() {
    const { token, loading } = useAuth();
    const r = useRouter();

    useEffect(() => {
        if (!loading && !token) r.replace('/(auth)/login');
    }, [loading, token]);

    if (loading || !token) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    return <Stack screenOptions={{ headerTitle: '' }} />;
}
