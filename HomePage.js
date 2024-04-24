import React from 'react';
import { View, Button, StyleSheet, Text , ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomePage() {
  const navigation = useNavigation();

  const handleLoginButtonClick = () => {
    navigation.navigate('Login');
  };

  return (
    
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Instructions to the users of the Event tracker</Text>
      <Text style={styles.section}>1. Sign Up:</Text>
      <Text style={styles.instruction}>
        - Tap on the "Sign Up" link to create a new account after clicking "Please Login".
      </Text>
      <Text style={styles.section}>2. Log In:</Text>
      <Text style={styles.instruction}>
        - Enter your username and password to log in to your account.
      </Text>
      <Text style={styles.section}>3. Organizing an event as host?:</Text>
      <Text style={styles.instruction}>
        Then you can,{'\n'}
        - Create an event which consists of event details such as Event name, address, time, date,etc.,{'\n'}
        - Update the existing event.{'\n'}
        - Delete an already created event.{'\n'}
        - Geofence the location of your event.{'\n'}
        - List out the attendees who have registered for the event.{'\n'}
        - Send the QR code to the emails of the registered attendees.{'\n'}
        - Scan the QR code of the attendees before they are welcomed into event.{'\n'}
        - List the attendees present inside the venue.
      </Text>
      <Text style={styles.section}>4. Attending an event?:</Text>
      <Text style={styles.instruction}>
        - Choose the event you are going to attend in the list of events displayed.{'\n'}
        - Register for the chosen event by providing the necessary details like Name,email,Event details.{'\n'}
        - You will be asked to turn on your device's location in the event.
      </Text>
      {/* Add more instructions for other tasks */}
      <View style={styles.buttonContainer}>
        <Button
          title="PLease Login"
          onPress={handleLoginButtonClick}
          color="#FF5722" // Orange color
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'lightgray', // Background color of the box
    borderRadius: 75,
    marginBottom: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  instruction: {
    fontSize: 16,
    marginLeft: 10,
    marginTop: 5,
  },
  buttonContainer: {
    marginVertical: 50, // Separation between buttons
    width: '100%', // Adjust the width as needed
  },
});

