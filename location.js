import React, { useState } from 'react';
import { View, Button, TextInput } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';

const API_KEY = 'ArablP1SZqKhTWKq7-EHSkoo3MNsHnMfOpd_HWGwwas2l8V0p_wMwpHPNG7_n37_';

const URL = 'http://192.168.1.6:5000'; // Define the URL constant

const GeofenceMap = () => {
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState(100); // Default radius is 100 meters
  const [geofenceCenter, setGeofenceCenter] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 17.3850,
    longitude: 78.4867,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const handleGeofence = async () => {
    try {
      const response = await fetch(
        `http://dev.virtualearth.net/REST/v1/Locations/${encodeURIComponent(address)}?key=${API_KEY}`
      );

      if (response.ok) {
        const data = await response.json();

        if (
          data &&
          data.resourceSets &&
          data.resourceSets.length > 0 &&
          data.resourceSets[0].resources &&
          data.resourceSets[0].resources.length > 0
        ) {
          const { coordinates } = data.resourceSets[0].resources[0].point;

          setGeofenceCenter(coordinates);
          setMapRegion({
            ...mapRegion,
            latitude: coordinates[0],
            longitude: coordinates[1],
          });
        } else {
          throw new Error('Invalid address or no results found');
        }
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleMarkerDragEnd = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setGeofenceCenter([latitude, longitude]);
  };

  const handleSaveCoordinates = async () => {
    try {
      const response = await fetch(`${URL}/saveCoordinates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coordinates: geofenceCenter,radius, address}),
      });

      if (response.ok) {
        // Coordinates saved successfully
        alert('Coordinates saved successfully.');
      } else {
        throw new Error('Failed to save coordinates');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} region={mapRegion}>
        {geofenceCenter && (
          <>
            <Marker
              coordinate={{
                latitude: geofenceCenter[0],
                longitude: geofenceCenter[1],
              }}
              draggable
              onDragEnd={handleMarkerDragEnd}
            />
            <Circle
              center={{
                latitude: geofenceCenter[0],
                longitude: geofenceCenter[1],
              }}
              radius={radius}
              fillColor="rgba(0, 128, 255, 0.2)"
              strokeColor="rgba(0, 128, 255, 0.5)"
            />
          </>
        )}
      </MapView>

      <TextInput
        placeholder="Enter address"
        value={address}
        onChangeText={setAddress}
        style={{
          height: 40,
          borderColor: 'black',
          borderWidth: 1,
          margin: 10,
          paddingHorizontal: 10,
        }}
      />
      <TextInput
        placeholder="Enter radius (in meters)"
        value={radius?.toString() ?? ''}
        onChangeText={(value) => setRadius(parseFloat(value))}
        keyboardType="numeric"
        style={{
          height: 40,
          borderColor: 'black',
          borderWidth: 1,
          margin: 10,
          paddingHorizontal: 10,
        }}
      />

      <Button title="Geofence" onPress={handleGeofence} />
      {geofenceCenter && (
        <Button title="Save Coordinates" onPress={handleSaveCoordinates} />
      )}
    </View>
  );
};

export default GeofenceMap;
