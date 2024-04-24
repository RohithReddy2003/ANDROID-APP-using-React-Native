import React from 'react';
import { View, Text, StyleSheet, Button , ScrollView} from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

const URL = ''; // Define the URL constant

const EventDetails = ({ route }) => {
  const { event } = route.params;
  const navigation = useNavigation();

  const handleUpdateEvent = async (eventId) => {
    try {
      navigation.navigate('Updating Events', { eventId });
    } catch (error) {
      console.log(error);
      alert("Error in navigating to the update page");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await axios.delete(`${URL}/hostevents/${eventId}`);
      if (response.status === 200) {
        alert("Event deleted successfully.");
      } else {
        throw new Error("Error: Invalid response status");
      }
    } catch (error) {
      console.log(error);
      alert("Error in deleting the event");
    }
  };

  const handleRegistrationListButtonClick = () => {
    navigation.navigate('Email Requests', { eventname: event.eventname });
  };

  const handlelocationButtonClick = () => {
    navigation.navigate('location');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Event Details</Text>
      <View style={styles.detailsBox}>
        <Text style={styles.boldText}>Event Name: {event.eventname}</Text>
        <Text style={styles.boldText}>Date: {event.date}</Text>
        <Text style={styles.boldText}>Time: {event.time}</Text>
        <Text style={styles.boldText}>Address: {event.address}</Text>
        <Text style={styles.boldText}>Email: {event.email}</Text>
        <Text style={styles.boldText}>Description: {event.description}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button title="Update" onPress={() => handleUpdateEvent(event._id)} color="green"/>
        <Button title="Delete" onPress={() => handleDeleteEvent(event._id)} color="red"/>
        <Button title="Reg..List" onPress={handleRegistrationListButtonClick}  />
        <Button title="Geofence" onPress={handlelocationButtonClick} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black', // Background color of the box
    padding: 10,
    borderRadius: 0,
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    backgroundColor: 'yellow', // Background color of the box
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  detailsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  detailsBox: {
    backgroundColor: 'lightgrey', // Background color of the box
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default EventDetails;
