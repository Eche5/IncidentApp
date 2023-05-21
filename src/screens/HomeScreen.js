import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";

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
        Alert.alert("Event Reported", "Thank you for reporting the event.", [
          {
            text: "OK",
            onPress: async () => {
              setEventType("");
              setLocation("");
              setDescription("");
              await scheduleNotification(eventData.eventType);
            },
          },
        ]);
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

  const scheduleNotification = async (eventType) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "New Event Added",
        body: `A new ${eventType} event has been reported!`,
      },
      trigger: null, // You can customize the trigger if needed
    });
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
      <Button title="Report Event" onPress={handleReportEvent} />
      <Button title="Fetch Events" onPress={fetchEvents} />
      <Text>Events:</Text>
      {events.map((event) => (
        <View key={event.id}>
          <Text>Event Type: {event.eventType}</Text>
          <Text>Location: {event.location}</Text>
          <Text>Description: {event.description}</Text>
        </View>
      ))}
    </View>
  );
};

export default ReportEventScreen;
