import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";

const ReportEventScreen = () => {
  const [eventType, setEventType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [events, setEvents] = useState([]);

  const handleReportEvent = async () => {
    try {
      const eventData = {
        eventType,
        location,
        description,
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
          title="Report Event"
          onPress={handleReportEvent}
          style={styles.reportButton}
        />
        <View style={styles.space} />
        <Button
          title="View Previous Events"
          onPress={fetchEvents}
          style={styles.fetchButton}
        />
      </View>
      <Text style={styles.eventsTitle}>Events:</Text>
      {events.map((event) => (
        <View key={event.id} style={styles.eventContainer}>
          <Text style={styles.eventType}>Event Type: {event.eventType}</Text>
          <Text style={styles.location}>Location: {event.location}</Text>
          <Text style={styles.description}>
            Description: {event.description}
          </Text>
        </View>
      ))}
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
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  reportButton: {
    flex: 1,
    marginRight: 8,
  },
  fetchButton: {
    flex: 1,
    marginLeft: 8,
  },
  eventsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  space: {
    height: 10,
  },
  eventContainer: {
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
  space: {
    height: 10,
  },
});

export default ReportEventScreen;
