import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const URL = 'http://192.168.1.6:5000'; // Define the URL constant

const CreateEvents = () => {
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [eventname, setEventname] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleCreateEvents = async () => {
    try {
      const response = await fetch( `${URL}/createevents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, date, eventname, time ,description, email}),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Host created the events successfully.', data.message);
      } else {
        Alert.alert('Error', 'This event data is already created.\n If not created,please create the data.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Events</Text>
      <TextInput 
        placeholder="Event Name"
        value={eventname}
        onChangeText={setEventname}
        style={styles.buttonContainer} //style={{ height: 40, borderColor: 'black', borderWidth: 1, margin: 10, paddingHorizontal: 20 }}
      />
      <TextInput
        placeholder="Date"
        value={date}
        onChangeText={setDate}
        style={styles.buttonContainer}
      />
      <TextInput
        placeholder="Time"
        value={time}
        onChangeText={setTime}
        style={styles.buttonContainer}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.buttonContainer}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.buttonContainer}
      />
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={styles.buttonContainer}
      />
      <Button title="Submit" onPress={handleCreateEvents} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  buttonContainer: {
    marginVertical: 20, // Separation between buttons
    width: '50%', // Adjust the width as needed
    height: 40, borderColor: 'black', borderWidth: 1, margin: 10, paddingHorizontal: 10 ,
  },
});

export default CreateEvents;
