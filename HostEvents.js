import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity ,ScrollView} from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

const URL = 'http://192.168.1.6:5000'; // Define the URL constant

const CreatedEventList = ({ route }) => {
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();
  const { email } = route.params; // Access the email parameter from the navigation route

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${URL}/hostevents?email=${email}`);
      if (response.status === 200) {
        alert("The Created event details are displayed.");
        setEvents(response.data);
      } else {
        throw new Error("Error: Invalid response status");
      }
    } catch (error) {
      console.log(error);
      alert("Error in retrieving the event details");
    }
  };

  const handlecreateeventButtonClick = () => {
    navigation.navigate('Create Events');
  };

  const handleEventDetails = (event) => {
    navigation.navigate('EventDetails', { event });
  };

  const handleScanButtonClick = () => {
    navigation.navigate('Scanning...');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Created Event List</Text>
      </View>
      {events.map((event) => (
        <View key={event._id}>
          <TouchableOpacity onPress={() => handleEventDetails(event)} style={styles.button}>
            <Text style={styles.buttonText}>{event.eventname}</Text>
          </TouchableOpacity>
        </View>
      ))}
        <Button
          title="Create Events"
          onPress={handlecreateeventButtonClick}
          color="#FF5722" // Orange color
        />
        <View style={styles.buttonContainer}>
        <Button 
          title="Scanner"
          onPress={handleScanButtonClick}
          color="black" // Orange color
        />
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    alignItems: 'center',
    backgroundColor: 'white', // Background color of the box
    padding: 10,
    borderRadius: 98,
    marginBottom: 20,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 24,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginVertical: 20,
    backgroundColor: 'black', // Background color of the box
    padding: 10,
    borderRadius: 18,
    marginBottom: 20, // Separation between buttons
  },
  container: {
    padding: 10,
    backgroundColor: 'lightgrey', // Background color of the box
    padding: 10,
    borderRadius: 50,
    marginBottom: 20,
  },
});

export default CreatedEventList;
