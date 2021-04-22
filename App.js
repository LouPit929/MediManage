import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Button, TextInput } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { FAB, Card, Title, Paragraph } from "react-native-paper";
import call from "react-native-phone-call";
import SwipeButton from "rn-swipe-button";

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home!</Text>
      <View style={styles.buttonContainer}>
        <Button onPress={() => { this.Call() }} style={{ borderWidth: 1 }} title="Call 911" />
      </View>
    </View>
  );
}

function Call() {
    console.log("Call called");
    const args = {
        number: '9085147186',
        prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
      }
    
    call(args).catch(console.error);
}

function MedicationsScreen() {
  var medCards = [];

  for (let i = 0; i < 10; i++) {
    medCards.push(
      <View style={styles.card}>
        <Card onPress={() => console.log("Edit Pressed")}>
          <Card.Content>
            <Title>Medication {i + 1}</Title>
            <Paragraph>Content {i + 1}</Paragraph>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}> 
      <ScrollView style={{ marginTop: 28 }}>{medCards}</ScrollView>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => console.log("Fab Pressed")}
      />
    </SafeAreaView>
  );
}

function AddMedication() {
    
}

function MedicationForm() {
  const [name, setName] = useState();
  const [dose, setDose] = useState();
  const handleSubmit = (e) => {      
    addMedication([name, dose])
    e.preventDefault();
  }
  return (
    <form onSubmit={e => { handleSubmit(e) }}>
      <label>Medication:</label>
      <label>Name:</label>
      <br />
      <input 
        name='name' 
        type='text' 
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <br />
      <label>Dose:</label>
      <br />
      <input
        name='dose' 
        type='text'
        value={date}
        onChange={e => setDose(e.target.value)}
      />
      <br/>
      <input 
        type='submit' 
        value='Add Log' 
      />
    </form>
  )
}

function CreateAppointmentsCard(aptCards) {
  aptCards.push(
    <View style={styles.card}>
      <Card onPress={() => console.log("Edit Pressed")}>
        <Card.Content>
          <Title>Appointment 0</Title>
          <Paragraph>Content</Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
}

function AppointmentsScreen() {
  var aptCards = [];

  for (let i = 0; i < 10; i++) {
    aptCards.push(
      <View style={styles.card}>
        <Card onPress={() => console.log("Edit Pressed")}>
          <Card.Content>
            <Title>Appointment {i + 1}</Title>
            <Paragraph>Content {i + 1}</Paragraph>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ marginTop: 28 }}>{aptCards}</ScrollView>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => CreateAppointmentsCard(aptCards)}
      />
    </SafeAreaView>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === "Home") {
              return (
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === "Medications") {
              return (
                <Ionicons
                  name={focused ? "medkit" : "medkit-outline"}
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === "Appointments") {
              return (
                <Ionicons
                  name={focused ? "calendar" : "calendar-outline"}
                  size={size}
                  color={color}
                />
              );
            }
          },
        })}
        tabBarOptions={{
          activeTintColor: "red",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Medications" component={MedicationsScreen} />
        <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  fab: {
    backgroundColor: "red",
    position: "absolute",
    margin: 20,
    right: 0,
    bottom: 10,
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    flexDirection: "column",
  },
  card: {
    paddingHorizontal: 10,
    paddingTop: 3,
    paddingBottom: 5,
    justifyContent: "flex-start",
    alignSelf: "stretch",
  },
  buttonContainer: {
    backgroundColor: 'lightgray',
    margin: 30,
    borderRadius: 20,
  },
});
