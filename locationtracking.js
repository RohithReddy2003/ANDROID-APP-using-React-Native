import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const URL = 'http://192.168.1.6:5000'; // Define the URL constant

const Attendeelocation = () => {
  const [insideGeofenceEmails, setInsideGeofenceEmails] = useState([]);
  const [outsideGeofenceEmails, setOutsideGeofenceEmails] = useState([]);

  useEffect(() => {
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    try {
      const response = await axios.get(`${URL}/tracking`); // Replace with your backend API endpoint for fetching location data
      if (response.status === 200) {
        const locations = response.data;
        const insideEmails = locations
          .filter(location => location.insideGeofence)
          .map(location => location.email);
        const outsideEmails = locations
          .filter(location => !location.insideGeofence)
          .map(location => location.email);

        setInsideGeofenceEmails(insideEmails);
        setOutsideGeofenceEmails(outsideEmails);
      } else {
        throw new Error('Error: Invalid response status');
      }
    } catch (error) {
      console.log(error);
      alert('Error in retrieving location data');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.tableContainer}>
          <View style={styles.column}>
            <Text style={styles.title1}>Inside Geofence Emails:</Text>
            {insideGeofenceEmails.map(email => (
              <View key={email}>
                <Text style={styles.emailText}>{email}</Text>
              </View>
            ))}
          </View>
          <View style={styles.column}>
            <Text style={styles.title2}>Outside Geofence Emails:</Text>
            {outsideGeofenceEmails.map(email => (
              <View style={styles.emailBox} key={email}>
                <Text style={styles.emailText}>{email}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'lightgray',
  },
  box: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
  },
  tableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    flex: 1,
  },
  title1: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'green',
  },
  title2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'red',
  },
  emailBox: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginBottom: 9,
  },
  emailText: {
    fontSize: 10,
  },
});

export default Attendeelocation;
