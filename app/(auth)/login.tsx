import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../lib/useAuth';

export default function Login() {
    const { login } = useAuth();
    const r = useRouter();
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [busy, setBusy] = useState(false);

    async function onSubmit() {
        if (!email || !pw) return Alert.alert('Error', 'Email and password are required');
        setBusy(true);
        try {
            await login(email.trim(), pw);
            r.replace('/(protected)/home');
        } catch (e: any) {
            Alert.alert('Login failed', e?.message ?? 'Unknown error');
        } finally {
            setBusy(false);
        }
    }

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: 'center', gap: 12 }}>
            <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 8 }}>Sign in</Text>

            <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="email"
                style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
            />
            <TextInput
                value={pw}
                onChangeText={setPw}
                secureTextEntry
                placeholder="password"
                style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
            />

            <Pressable
                onPress={onSubmit}
                disabled={busy}
                style={{
                    backgroundColor: '#111827',
                    padding: 14,
                    borderRadius: 10,
                    alignItems: 'center',
                    opacity: busy ? 0.7 : 1,
                }}
            >
                {busy ? <ActivityIndicator /> : <Text style={{ color: 'white', fontWeight: '600' }}>Login</Text>}
            </Pressable>
        </View>
    );
}
