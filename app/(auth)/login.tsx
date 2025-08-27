import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../lib/useAuth';

export default function LoginScreen() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleLogin() {
        if (!email || !password) return Alert.alert('Error', 'Email and password are required');
        setIsSubmitting(true);
        try {
            await login(email.trim(), password);
            router.replace('/(protected)/home');
        } catch (error: any) {
            Alert.alert('Login failed', error?.message ?? 'Unknown error');
        } finally {
            setIsSubmitting(false);
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
                placeholder="Email"
                style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
            />
            <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Password"
                style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
            />

            <Pressable
                onPress={handleLogin}
                disabled={isSubmitting}
                style={{
                    backgroundColor: '#111827',
                    padding: 14,
                    borderRadius: 10,
                    alignItems: 'center',
                    opacity: isSubmitting ? 0.7 : 1,
                }}
            >
                {isSubmitting ? (
                    <ActivityIndicator />
                ) : (
                    <Text style={{ color: 'white', fontWeight: '600' }}>Login</Text>
                )}
            </Pressable>

            <Pressable
                onPress={() => router.replace('/(auth)/register')}
                style={{ alignItems: 'center', paddingTop: 8 }}
            >
                <Text style={{ textDecorationLine: 'underline' }}>Create an account</Text>
            </Pressable>
        </View>
    );
}
