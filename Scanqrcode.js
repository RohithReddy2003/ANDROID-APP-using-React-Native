//react-native-camera: This package provides access to the device's camera and allows you to scan QR codes.
//react-native-qrcode-svg: This package is used to generate SVG representations of the scanned QR codes.
/*expo-barcode-scanner provides a React component that renders a viewfinder for the device's camera (either front or back) and will scan bar codes that show up in the frame. */

import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';

const URL = ''; // Define the URL constant

export default function Scanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null); // Add scannedData state
  const navigation=useNavigation();
  
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setScannedData({ type, data }); // Save scanned data to scannedData state

    // Divide the data into separate values
    const [email, name, eventname, address] = data.split(',');

    try {
      const response = await fetch(`${URL}/verifyqrcode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, eventname, address }), // Send the divided data to the server
      });

      if (response.ok) {
        const result = await response.json();
        if (result.enrollment) {
          console.log('QR code data sent to server successfully');
          alert('Welcome! The QRCODE is verified');
          alert(`QR code with Type ${type} and data "${data}" has been scanned`);
          // First alert after pressing "OK" in the second alert
          // Schedule a notification
  
          console.log(data);
        } else if(response.status === 404) {
          console.log('QR code data not found in the collection');
          alert('QR code data not found. Data is not present.');
        }
      } else {
        console.log('Failed to send QR code data to server');
        console.log(data);
        alert('ERROR!...Identified Guest... SECURITY!!!');
      }
    } catch (error) {
      console.error('Error while sending QR code data to server:', error);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting Camera Permission</Text>;
  } else if (hasPermission === false) {
    return <Text>No Access to Camera</Text>;
  }

  const handletrackButtonClick = () => {
    navigation.navigate('Tracking...');
  };

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
      />
      {scannedData && (
        <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
      )}
      <View  style={styles.buttonContainer}>
        <Button
          title="Tracking in event"
          onPress={handletrackButtonClick}
          color="#FF5722" // Orange color
        />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  scanner: {
    aspectRatio: 1,
    width: 500, // Set the desired width
    alignSelf: 'center', // Center the scanner horizontally
  },
  buttonContainer: {
    marginVertical: 20, // Separation between buttons
    //width: '50%', // Adjust the width as needed
  },
});
