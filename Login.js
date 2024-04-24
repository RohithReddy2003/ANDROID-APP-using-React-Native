import React, { useState } from 'react';
import { View, TextInput, Button, Alert , StyleSheet, Text,Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const URL = 'http://192.168.1.6:5000'; // Define the URL constant

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [account, setAccount] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    fetch(`${URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password , account }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Login successful
          Alert.alert('Login successful');
          if (account === 'Attendee') {
            navigation.navigate('Events for Attendees', { email }); // navigate to the Event.js file
          }
          else{
            navigation.navigate('Events Created', { email }); // navigate to the Event.js file   navigation.navigate('Email Requests', { email }); 
          }
        } else {
          // Login failed
          Alert.alert('Login failed', data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        Alert.alert('An error occurred');
      });
  };

  const handlesignupButtonClick = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Page</Text>
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
        secureTextEntry  //converts the words of password into dots
        style={styles.buttonContainer}
      />
      <Button title="Login" onPress={handleLogin} />
      <Pressable onPress={handlesignupButtonClick}>
        <Text style={styles.loginText}>Don't You Have An Account? Signup now</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
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

export default LoginScreen;
