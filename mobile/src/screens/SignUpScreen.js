import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../utils/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignUp = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    if (!email || !password) {
      setErrorMessage('Please enter email and password.');
      return;
    }
    
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
      Alert.alert('Sign up Error', error.message);
    } else {
      if (data?.session) {
        navigation.replace('Onboarding');
      } else {
        setSuccessMessage('Please check your email to verify your account.');
        Alert.alert('Success', 'Please check your email to verify your account.');
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <LinearGradient colors={['rgba(79, 70, 229, 0.15)', '#030712']} style={StyleSheet.absoluteFillObject} />
      <View style={styles.content}>
        <BlurView intensity={20} tint="dark" style={styles.card}>
          <View style={styles.header}>
            <LinearGradient colors={['#6366f1', '#9333ea']} style={styles.logoContainer}>
              <Text style={styles.logoText}>B</Text>
            </LinearGradient>
            <Text style={styles.title}>Join Bartr</Text>
            <Text style={styles.subtitle}>Create an account to start trading</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#6b7280"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#6b7280"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign up</Text>
              )}
            </TouchableOpacity>
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Log in</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    padding: 32,
    borderRadius: 24,
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    borderColor: 'rgba(55, 65, 81, 0.5)',
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  form: {
    width: '100%',
  },
  label: {
    color: '#d1d5db',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ef4444',
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  successText: {
    color: '#10b981',
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  footerText: {
    color: '#9ca3af',
  },
  linkText: {
    color: '#818cf8',
    fontWeight: 'bold',
  },
});
