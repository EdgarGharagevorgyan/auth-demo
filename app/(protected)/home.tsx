import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useAuth } from '../../lib/useAuth';
import { useRouter } from 'expo-router';

export default function Home() {
    const { logout } = useAuth();
    const r = useRouter();

    function onLogout() {
        logout();
        r.replace('/(auth)/login');
    }

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: 'center', gap: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: '700' }}>Welcome 👋</Text>
            <Pressable
                onPress={onLogout}
                style={{ backgroundColor: '#ef4444', padding: 14, borderRadius: 10, alignItems: 'center' }}
            >
                <Text style={{ color: 'white', fontWeight: '600' }}>Logout</Text>
            </Pressable>
        </View>
    );
}
