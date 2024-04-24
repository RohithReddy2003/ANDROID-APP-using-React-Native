import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet ,ScrollView} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const URL = 'http://192.168.1.6:5000'; // Define the URL constant

const EnrollList = ({ route }) => {
  const { eventname } = route.params;
  const [enrollList, setEnrollList] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${URL}/retrieve`);
      if (response.status === 200) {
        alert('Registration list is displayed');
        const filteredList = response.data.filter((enroll) => enroll.eventname === eventname);
        setEnrollList(filteredList);
      } else {
        throw new Error("Error: Invalid response status");
      }
    } catch (err) {
      console.log(err);
      alert('Error in retrieving the registration information');
    }
  };

  const saveQRCode = async (email, name, eventName, address) => {
    try {
      const response = await axios.post(`${URL}/saveqrcode`, { email, name, eventName, address });
      console.log('Email saved:', response.data);
      alert('QR code and email saved');
    } catch (err) {
      console.log(err);
      alert('Error! Already the email and QR code saved');
    }
  };

  const sendQRCodeEmail = async (email) => {
    try {
      const response = await axios.post(`${URL}/sendqrcodeemail`, { email });
      console.log('QR code email sent:', response.data);
      alert('QR code email sent successfully');
    } catch (err) {
      console.log(err);
      alert('Error sending QR code email');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registration List</Text>
      {enrollList.map((enroll) => (
        <View key={enroll._id} style={styles.detailsContainer}>
          <Text style={styles.boldText}>Email: {enroll.email}</Text> 
          <Text style={styles.boldText}>Name: {enroll.name}</Text>
          <Text style={styles.boldText}>Event Name: {enroll.eventname}</Text>
          <Text style={styles.boldText}>Address: {enroll.address}{'\n'}</Text>
          <View style={styles.buttonsContainer}>
          <Button color="#FF5722" onPress={() => saveQRCode(enroll.email, enroll.name, enroll.eventname, enroll.address)} title="Save QR Code" />
          <Button color="#4CAF50" onPress={() => sendQRCodeEmail(enroll.email)} title="Send Email" />
          </View>
        </View>
      ))}
    </ScrollView>
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
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: 'lightblue', // Background color of the box
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
    color: 'black', // Change this to the color you want for the labels (e.g., blue)
  },
  labelText: {
    fontWeight: 'bold',
    color: 'blue', // Change this to the color you want for the labels (e.g., blue)
  },
});


export default EnrollList;
