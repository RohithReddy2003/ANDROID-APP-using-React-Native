import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text,Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const URL = 'http://192.168.1.6:5000'; // Define the URL constant

const SignupPage = () => {
  const [account, setAccount] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignup = async () => {
    try {
      const response = await fetch(`${URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('User registered successfully', data.message);
      } else {
        Alert.alert('Error', 'This signup data is already saved.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred');
    }
  };

  const handleLoginButtonClick = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup Page</Text>
      <View style={styles.accountContainer}>
        <Text style={styles.accountText}>Account:</Text>
        <Button
          title="Host"
          onPress={() => setAccount('Host')}
          color={account === 'Host' ? '#007AFF' : '#CCCCCC'}
        />
        <Button
          title="Attendee"
          onPress={() => setAccount('Attendee')}
          color={account === 'Attendee' ? '#007AFF' : '#CCCCCC'}
        />
      </View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.buttonContainer}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.buttonContainer}
      />
      <Button title="Sign Up" onPress={handleSignup} />
      <Pressable onPress={handleLoginButtonClick}>
        <Text style={styles.loginText}>Already have an account? Login now</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignItems: 'center',
    backgroundColor: 'skyblue', // Background color of the box
    borderRadius: 0,
    marginBottom: 0,
  },
  accountContainer: {
    flexDirection: 'row',//column
    alignItems: 'center',
    marginBottom: 10,
  },
  accountText: {
    marginRight: 10,
    fontWeight: 'light',//bold
      fontSize: 14,

  },
    title: {
      fontWeight: 'bold',
      fontSize: 54,
      marginBottom: 50, // Optional margin bottom for the title
    },
    buttonContainer: {
      marginVertical: 20, // Separation between buttons
      width: '50%', // Adjust the width as needed
      height: 40, borderColor: 'black', borderWidth: 1, margin: 10, paddingHorizontal: 10 ,
    },
    loginText: {
      marginTop: 10,
      color: 'blue',
      textDecorationLine: 'underline',
    },
});

export default SignupPage;
