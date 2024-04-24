import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity , ScrollView} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

const URL = 'http://192.168.1.6:5000'; // Define the URL constant

const EventList = ({ route }) => {
  const [events, setEvents] = useState([]);
  const [geofences, setGeofences] = useState([]); // Added geofences state
  const navigation = useNavigation(); //to navigate to other screens
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const { email } = route.params; // Access the email parameter from the navigation route
  const [insideGeofence, setInsideGeofence] = useState(true);

  useEffect(() => {
    fetchEvents();
    fetchGeofences(); // Fetch geofences data on component mount
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${URL}/events`);
      if (response.status === 200) {
        alert('The event details are displayed');
        setEvents(response.data);
      } else {
        throw new Error('Error: Invalid response status');
      }
    } catch (error) {
      console.log(error);
      alert('Error in retrieving the event details');
    }
  };

  const fetchGeofences = async () => {
    try {
      const response = await axios.get(`${URL}/geofences`); // Replace with your geofences endpoint
      if (response.status === 200) {
        setGeofences(response.data);
      } else {
        throw new Error('Error: Invalid response status');
      }
    } catch (error) {
      console.log(error);
      alert('Error in retrieving the geofences');
    }
  };

  const handleRegisterButtonClick = () => {
    navigation.navigate('Registration Form');
  };

  const handleTrackLocationClick = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }
  
      let storedLocation = null;
  
      const options = {
        accuracy: Location.Accuracy.Balanced, // Adjust accuracy as per your requirement-BestForNavigation-for more accuracy
        distanceInterval: 10, // Set the desired distance interval (in meters)
         //timeInterval: 5000, // Set the desired time interval (in milliseconds)
      };
  
      Location.watchPositionAsync(options, async (location) => {
        const { latitude, longitude } = location.coords;
  
        setTrackingEnabled(!trackingEnabled);


       // Check the distance for each geofence
      geofences.forEach(async (geofence) => {
        const { radius, coordinates } = geofence;
        const [geofenceLat, geofenceLng] = coordinates;

        // Calculate the distance between user's location and geofence location
        const distance = calculateDistance(latitude, longitude, geofenceLat, geofenceLng);
        if (distance > radius) {
          // User is outside the geofence
          console.log('A User is outside the geofence');
          alert("Warning!..Attendee!..you are  outside the event");
          setInsideGeofence(false);
          // Perform your desired actions here, such as showing a notification or triggering an event
        } 
        else{
          setInsideGeofence(true);
        }
      });

        if (storedLocation) {
          if (
            latitude !== storedLocation.latitude ||
            longitude !== storedLocation.longitude
          ) {
            try {
              // handle a PUT request to  MongoDB API to update the location
              await axios.put(`${URL}/locations/${storedLocation._id}`, {
                latitude,
                longitude,
                insideGeofence,
              });
              console.log('Location updated successfully');
            } catch (error) {
              console.log(error);
              alert('Error updating location');
            }
          }
        } else {
          // Initial location, storing it in MongoDB
          try {
            const response = await axios.post(`${URL}/locations`, {
              email,
              latitude,
              longitude,
              insideGeofence,
            });
            storedLocation = response.data; // Storing the location object returned by the API
            console.log('Location stored successfully');
          } catch (error) {
            console.log(error);
            alert('Error storing location');
          }
        }
      });
  
      alert('Location tracking started');
    } catch (error) {
      console.log(error);
      alert('Error tracking location');
    }
  };

  const handleAddressClick = (geofence) => {
    // Display the radius and coordinates of the geofence
    alert(`Radius: ${geofence.radius} meters\nCoordinates: ${geofence.coordinates[0]}, ${geofence.coordinates[1]}.`);
  };

  const calculateDistance= (lat1, lon1, lat2, lon2) =>{
    const earthRadius = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
  
    return distance;
  }
  
  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  }
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.title}>
        <Text style={styles.title}>Event List</Text>
      </View>

      <Text>
        {'\n'}
        <Button  title="Track location" onPress={handleTrackLocationClick} />{'\n'}
        {'\n'}{trackingEnabled && (
  geofences.map((geofence) => (
    <TouchableOpacity
      key={geofence._id}
      onPress={() => handleAddressClick(geofence)}
      style={styles.addressContainer}
    >
      <Text style={styles.addressText}>Address: {'\n'}{geofence.address}</Text>
    </TouchableOpacity>
  ))
)}    {'\n'}
      </Text>

      {events.map((event) => (
        <View key={event._id} style={styles.detailsBox}>
          <Text>
            {'\n'}
            Event Name: {event.eventname},{'\n'}
            Date: {event.date},{'\n'}
            Time: {event.time},{'\n'}
            Address: {event.address}.{'\n'}
          </Text>
          <Button title="Registration for events" onPress={handleRegisterButtonClick} />
        </View>
      ))}
      {/*
      <Text>
        {'\n'}
        <Button  title="Track location" onPress={handleTrackLocationClick} />{'\n'}
        {'\n'}{trackingEnabled && (
  geofences.map((geofence) => (
    <TouchableOpacity
      key={geofence._id}
      onPress={() => handleAddressClick(geofence)}
      style={styles.addressContainer}
    >
      <Text style={styles.addressText}>Address: {geofence.address}</Text>
    </TouchableOpacity>
  ))
)}
      </Text> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    alignItems: 'center',
  },
  addressContainer: {
    backgroundColor: '#e8e8e8',
    padding: 10,
    marginVertical: 5,
  },
  detailsBox: {
    backgroundColor: 'lightblue', // Background color of the box
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  addressText: {
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
  },
  buttonContainer: {
    marginVertical: 50, // Separation between buttons
    width: '100%', // Adjust the width as needed
  },
});

export default EventList;