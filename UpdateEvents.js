import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const URL = 'http://192.168.1.6:5000'; // Define the URL constant

const UpdateEvent = ({ route }) => {
  const { eventId } = route.params;
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState(''); 
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Fetch the existing event details
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`${URL}/hostevents/${eventId}`);
      if (response.status === 200) {
        const eventDetails = response.data;
        setEventName(eventDetails.eventname);
        setDate(eventDetails.date);
        setTime(eventDetails.time);
        setAddress(eventDetails.address);
        setDescription(eventDetails.description);
        setEmail(eventDetails.email);

      } else {
        throw new Error("Error: Invalid response status");
      }
    } catch (error) {
      console.log(error);
      alert("Error in retrieving the event details");
    }
  };

  const handleUpdateEvent = async () => {
    try {
      const updatedEvent = {
        eventname: eventName,
        date: date,
        time: time,
        address: address,
        description: description,
        email: email
      };

      const response = await axios.put(`${URL}/hostevents/${eventId}`, updatedEvent);
      if (response.status === 200) {
        alert("Event updated successfully.");
        // Navigate back to the previous page or perform any other action as needed
      } else {
        throw new Error("Error: Invalid response status");
      }
    } catch (error) {
      console.log(error);
      alert("Error in updating the event");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Event</Text>
      <TextInput
        style={styles.input}
        placeholder="Event Name"
        value={eventName}
        onChangeText={text => setEventName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Date"
        value={date}
        onChangeText={text => setDate(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Time"
        value={time}
        onChangeText={text => setTime(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={text => setAddress(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={text => setDescription(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <Button title="Update" onPress={handleUpdateEvent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default UpdateEvent;
