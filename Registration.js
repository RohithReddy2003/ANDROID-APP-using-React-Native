import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

const URL = 'http://192.168.1.6:5000'; // Define the URL constant

const Enroll = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    eventname: '',
    address: ''
  });

  const handleSaveData = async () => {
    try {
      const response = await fetch(`${URL}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        alert('Registration information saved successfully!');
        console.log('Registration message in server');
      } else {
        alert('WARNING! This registration information is already saved.');
      }
    } catch (err) {
      console.log(err);
      alert('Error saving registration information');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registration Form</Text>
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Event Name"
        value={formData.eventname}
        onChangeText={(text) => setFormData({ ...formData, eventname: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Address"
        value={formData.address}
        onChangeText={(text) => setFormData({ ...formData, address: text })}
        style={styles.input}
      />
      <Button title="Register" onPress={handleSaveData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24
  },
  input: {
    marginVertical: 20,
    width: '70%',
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: 10
  }
});

export default Enroll;
