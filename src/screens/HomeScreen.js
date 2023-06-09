import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from "expo-notifications";

const ReportEventScreen = () => {
  const [eventType, setEventType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleReportEvent = async () => {
    try {
      const eventData = {
        eventType,
        location,
        description,
        image: selectedImage ? selectedImage.uri : null,
      };

      const response = await fetch(
        "https://starwars-83f39-default-rtdb.firebaseio.com/events.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        }
      );

      if (response.ok) {
        Alert.alert("Event Reported", "Thank you for reporting the event.");
        setEventType("");
        setLocation("");
        setDescription("");
        setSelectedImage(null);
      } else {
        Alert.alert(
          "Error",
          "Failed to report the event. Please try again later."
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        "https://starwars-83f39-default-rtdb.firebaseio.com/events.json"
      );
      const data = await response.json();
      if (data) {
        const eventArray = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }));
        setEvents(eventArray);
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "An error occurred while fetching events. Please try again later."
      );
    }
  };

  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "Please grant permission to access the device's image library."
      );
      return;
    }

    const imagePickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!imagePickerResult.cancelled) {
      setSelectedImage(imagePickerResult.assets[0]);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report Event</Text>
      <TextInput
        style={styles.input}
        placeholder="Event Type"
        value={eventType}
        onChangeText={(text) => setEventType(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={(text) => setLocation(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Add Picture"
          onPress={handleImagePicker}
          style={styles.button}
        />
        {selectedImage && (
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.imagePreview}
          />
        )}
      </View>
      <Button
        title="Report Event"
        onPress={handleReportEvent}
        style={styles.button}
      />
      <View style={styles.space} />
      <Button
        title="View Previous Events"
        onPress={fetchEvents}
        style={styles.button}
      />
      <Text style={styles.eventsTitle}>Events:</Text>
      <ScrollView style={styles.eventContainer}>
        {events.map((event) => (
          <View key={event.id} style={styles.event}>
            <Text style={styles.eventType}>Event Type: {event.eventType}</Text>
            <Text style={styles.location}>Location: {event.location}</Text>
            <Text style={styles.description}>
              Description: {event.description}
            </Text>
            {event.image && (
              <Image source={{ uri: event.image }} style={styles.eventImage} />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  button: {
    marginRight: 8,
  },
  space: {
    height: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    marginRight: 8,
  },
  eventsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  eventContainer: {
    flex: 1,
  },
  event: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 8,
    marginBottom: 8,
  },
  eventType: {
    fontWeight: "bold",
  },
  location: {
    fontStyle: "italic",
  },
  description: {},
  eventImage: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    marginTop: 8,
  },
});

export default ReportEventScreen;
