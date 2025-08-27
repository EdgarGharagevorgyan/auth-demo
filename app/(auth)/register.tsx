import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../lib/api';

export default function RegisterScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleRegister() {
        const trimmedEmail = email.trim();
        if (!trimmedEmail || !password || !confirmPassword) {
            return Alert.alert('Error', 'All fields are required');
        }
        if (password !== confirmPassword) {
            return Alert.alert('Error', 'Passwords do not match');
        }
        if (password.length < 6) {
            return Alert.alert('Error', 'Password should be at least 6 characters');
        }

        setIsSubmitting(true);
        try {
            await api('/api/auth/register', {
                method: 'POST',
                body: { email: trimmedEmail, password },
            });
            Alert.alert('Success', 'Account created. Please sign in.', [
                { text: 'OK', onPress: () => router.replace('/(auth)/login') },
            ]);
        } catch (error: any) {
            Alert.alert('Registration failed', error?.message ?? 'Unknown error');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: 'center', gap: 12 }}>
            <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 8 }}>Create account</Text>

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

            <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Confirm password"
                style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
            />

            <Pressable
                onPress={handleRegister}
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
                    <Text style={{ color: 'white', fontWeight: '600' }}>Sign up</Text>
                )}
            </Pressable>

            <Pressable
                onPress={() => router.replace('/(auth)/login')}
                style={{ alignItems: 'center', paddingTop: 8 }}
            >
                <Text style={{ textDecorationLine: 'underline' }}>Already have an account? Sign in</Text>
            </Pressable>
        </View>
    );
}
