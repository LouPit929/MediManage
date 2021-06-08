//import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Button,
  TextInput,
  StatusBar,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { FAB, Card, Title, Paragraph } from "react-native-paper";
import call from "react-native-phone-call";
import SwipeButton from "rn-swipe-button";
import { useForm, Controller } from "react-hook-form";
import { startDetecting } from "react-native/Libraries/Utilities/PixelRatio";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationEvents } from "react-navigation";
//import { PushNotificationIOS } from '@react-native-community/push-notification-ios';
//import { PushNotification } from 'react-native-push-notification';
//create function that returns a stack nav ( first content is the appt cards )



//Demo change
function HomeScreen() {
  const phoneIcon = () => <Ionicons name={"call"} size={40} color={"white"} />;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 50,
      }}
    >
      <SwipeButton
        onSwipeSuccess={() => Call()}
        thumbIconComponent={phoneIcon}
        height={70}
        width={375}
        title="Emergency Services"
        railBackgroundColor="#dedede"
        railFillBackgroundColor="#949494"
        railFillBorderColor="#949494"
        thumbIconBackgroundColor="#ff8400"
        thumbIconBorderColor="#ff8400"
      />
      <Text></Text><Text></Text><Text></Text><Text></Text><Text></Text>
      <Text></Text><Text></Text><Text></Text><Text></Text><Text></Text>
      <Text></Text><Text></Text><Text></Text><Text></Text><Text></Text>
      <Text style={styles.title}>Hello.</Text>
      <Text></Text>
      <Text style={styles.title}>Welcome to MediManage.</Text>
    </View>
  );
}

function Call() {
  const debug = false; // does not call phone number in debug mode

  const args = {
    number: "9085147186",
    prompt: false, // Optional boolean property. Determines if the user should be prompt prior to the call
  };

  if (debug != true) {
    call(args).catch(console.error);
  }
  //console.log("Calling Emergency Services...");
  alert("Calling Emergency Services...");
}

var medCardNum = 0; //Globar varible to keep track of the number of medication cards

function MedicationsScreen({ navigation }) {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    try {
      AsyncStorage.getAllKeys().then((keys) => {
        AsyncStorage.multiGet(keys).then((res) => {
          var data = res;
          setDataSource(data);
        });
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const ItemView = (item, key) => {
    const aptCard = "MedicationDataDict";
    console.log("Index "+item[0]);
    console.log("Json"+item[1]);
    
    // Json parsing
    var cardJson = JSON.parse(item[1]);
    var med = cardJson.Medication;
    var doc = cardJson.doctorName;
    var dos = cardJson.dose;
    var tim = cardJson.Time;
    var rfill = cardJson.Refill;
    var pharma = cardJson.Pharmacy;
    var note = cardJson.Notes;
    var output =  "Medication: "+ med +"\nDoctor: " + doc;
    var cardDisplay = "Medication: "+med+ "\nDoctor: "+doc+"\nDosage: "+dos+"\nTime: "+tim+"\nRefill: "+rfill+"\nPharmacy: "+pharma+"\nNotes: "+note;
    console.log(cardDisplay);

    if (aptCard == item[0].split("~")[0]) {
      medCardNum++;
      return (
        // Flat List Item
        <View key={key} style={styles.card}>
          <Card onPress={() => getItem(item)}>
            <Card.Content>
              <Title>{output}</Title>
              <Paragraph></Paragraph>
            </Card.Content>
          </Card>
        </View>
      );
    }
  };

  const getItem = (item) => {
    // Function for click on an item
    var cardJson = JSON.parse(item[1]);
    var med = cardJson.Medication;
    var doc = cardJson.doctorName;
    var dos = cardJson.dose;
    var tim = cardJson.Time;
    var rfill = cardJson.Refill;
    var pharma = cardJson.Pharmacy;
    var note = cardJson.Notes;
    var cardDisplay = "Medication: "+med+ "\nDoctor: "+doc+"\nDosage: "+dos+"\nTime: "+tim+"\nRefill: "+rfill+"\nPharmacy: "+pharma+"\nNotes: "+note;
    alert(cardDisplay);
  };

  clearAsyncStorage = async () => {
    AsyncStorage.clear();
    aptCardNum = 0;
    medCardNum = 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>{dataSource.map(ItemView)}</ScrollView>
      <Text style={styles.instructions}>Refresh so see new changes</Text>
      <Button title='Clear Async' onPress={clearAsyncStorage}></Button>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate("Add a New Medication")}
        //push to stack and go to appt form screen
      />
    </SafeAreaView>
  );
}

function SetMedicationInfo(data) {
  medCardNum++;
  data = JSON.stringify(data);
  var medKey = "MedicationDataDict~" + medCardNum;
  AsyncStorage.setItem(medKey, data);
  console.log(data);
  // data is datatype ReadableNativeMap
}

function MedicationForm({ navigation }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    SetMedicationInfo(data);
    navigation.goBack();
  };
  //const onSubmit = (data) => SetMedicationInfo(data);
  //   AsyncStorage.setItem('DataDict', data)
  //   console.log(data)
  // };

  return (
    <View>
      <Text></Text>
      <Text style={styles.title}>NEW MEDICATION</Text>
      <Text></Text>
      <Text></Text>
      <Text style={styles.label}>Medication:</Text>
      {errors.Medication && <Text>Medication Name is required.</Text>}
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="Medication"
        rules={{ required: true }}
        defaultValue=""
      />
      <Text style={styles.label}>Perscribing Doctor:</Text>
      {errors.doctorName && <Text>Perscribing doctor is required.</Text>}
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="doctorName"
        rules={{ required: true }}
        defaultValue=""
      />

      <Text style={styles.label}>Dose:</Text>
      {errors.dose && <Text>Dose is required.</Text>}
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="dose"
        rules={{ required: true }}
        defaultValue=""
      />

      <Text style={styles.label}>Time:</Text>
      {errors.Time && <Text>Time is required.</Text>}
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="Time"
        rules={{ required: true }}
        defaultValue=""
      />

      <Text style={styles.label}>Refill Date:</Text>
      {errors.Refill && <Text>Refill Date is required.</Text>}
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="Refill"
        rules={{ required: true }}
        defaultValue=""
      />

      <Text style={styles.label}>Pharmacy:</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="Pharmacy"
        defaultValue=""
      />

      <Text style={styles.label}>Notes:</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="Notes"
        defaultValue=""
      />

      <Button 
      color = "red"
      title="Save" 
      onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

var aptCardNum = 0; //Globar varible to keep track of the number of cards

//Appt screen/apptList with come fron appt stack nav always be the intial contents
//Appt form will be pushed to stacked when + is pressed
function AppointmentsScreen({ navigation }) {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    try {
      AsyncStorage.getAllKeys().then((keys) => {
        AsyncStorage.multiGet(keys).then((res) => {
          var data = res;
          setDataSource(data);
        });
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const ItemView = (item, key) => {
    const aptCard = "AppointmentDataDict";
    console.log(item[0]);
    //console.log(item[1]);

    // Json parsing
    var cardJson = JSON.parse(item[1]);
    var doc = cardJson.Doctor;
    var date = cardJson.Date;
    var time = cardJson.Time;
    var output =  "Appointment with: "+ doc +"\nDate: " + date + "  @  " + time;
    console.log(output);

    if (aptCard == item[0].split("~")[0]) {
      aptCardNum++;
      return (
        // Flat List Item
        <View key={key} style={styles.card}>
          <Card onPress={() => getItem(item)}>
            <Card.Content>
              <Title>{output}</Title>
              <Paragraph></Paragraph>
            </Card.Content>
          </Card>
        </View>
      );
    }
  };

  const getItem = (item) => {
    // Function for click on an item
    var cardJson = JSON.parse(item[1]);
    var doc = cardJson.Doctor;
    var spec = cardJson.Specialty;
    var date = cardJson.Date;
    var time = cardJson.Time;
    var loc = cardJson.Location;
    var pnum = cardJson.Phone;
    var note = cardJson.Notes;
    var cardDisplay =  "Appointment: "+ doc +"\nSpecialty: " + spec+"\nDate: " + date + "\nTime: " + time +"\nLocation: " + loc +"\nPhone Number: " + pnum +"\nNotes: " + note;
    alert(cardDisplay);
  };

  clearAsyncStorage = async () => {
    AsyncStorage.clear();
    aptCardNum = 0;
    medCardNum = 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>{dataSource.map(ItemView)}</ScrollView>
      <Text style={styles.instructions}>Refresh so see new changes</Text>
      <Button title='Clear Async' onPress={clearAsyncStorage}></Button>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate("Add a New Appointment")}
        //push to stack and go to appt form screen
      />
    </SafeAreaView>
  );
}

function SetAppointmentInfo(data) {
  //const [data] = AppointmentForm();  //'data' is containing the view of the form
  aptCardNum++;
  data = JSON.stringify(data);
  var aptKey = "AppointmentDataDict~" + aptCardNum;
  AsyncStorage.setItem(aptKey, data);
  console.log(data);
  // data is datatype ReadableNativeMap
}

function AppointmentForm({ navigation }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    SetAppointmentInfo(data);
    navigation.goBack();
  };

  return (
    //<Button title="Save" onPress={ () => Navigation.goBack() }/>
    <View>
      <Text></Text>
      <Text style={styles.title}>NEW APPOINTMENT</Text>
      <Text></Text>
      <Text></Text>
      <Text style={styles.label}>Doctor:</Text>
      {errors.doctorName && <Text>Doctor Name is required.</Text>}
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="Doctor"
        rules={{ required: true }}
        defaultValue=""
      />

      <Text style={styles.label}>Field / Specialty:</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="Specialty"
        defaultValue=""
      />

      <Text style={styles.label}>Date of Upcoming Appointment:</Text>
      {errors.Date && <Text>Date is required.</Text>}
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="Date"
        rules={{ required: true }}
        defaultValue=""
      />

      <Text style={styles.label}>Time:</Text>
      {errors.Time && <Text>Time is required.</Text>}
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="Time"
        rules={{ required: true }}
        defaultValue=""
      />

      <Text style={styles.label}>Location:</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="Location"
        defaultValue=""
      />

      <Text style={styles.label}>Phone:</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="Phone"
        defaultValue=""
      />

      <Text style={styles.label}>Notes:</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="Notes"
        defaultValue=""
      />

      <Button
        color ="red"
        title="Save"
        onPress={handleSubmit(onSubmit)}
        style={styles.buttonContainer}
      />
    </View>
  );
}

const Tab = createBottomTabNavigator();
const AppointmentStack = createStackNavigator();
const MedicationStack = createStackNavigator();

function AppointmentStackSetUp() {
  return (
    <AppointmentStack.Navigator initialRouteName="AppointmentCards">
      <AppointmentStack.Screen
        name="Appointments"
        component={AppointmentsScreen}
      />
      <AppointmentStack.Screen
        name="Add a New Appointment"
        component={AppointmentForm}
      />
    </AppointmentStack.Navigator>
  );
}

function MedicationStackSetUp() {
  return (
    <MedicationStack.Navigator initialRouteName="Medications">
      <MedicationStack.Screen
        name="Medications"
        component={MedicationsScreen}
      />
      <MedicationStack.Screen
        name="Add a New Medication"
        component={MedicationForm}
      />
    </MedicationStack.Navigator>
  );
}

/*function MedicationNotif() {
    PushNotification.localNotificationSchedule({
        title: "Medication Reminder",
        message: "Don't forget to take your medication today!", // (required)
        date: new Date(Date.now() + 60*60*24 * 1000), // in 1 day
        allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
      });
    
}

function AppointmentNotif() {
    PushNotification.localNotificationSchedule({
        title: "Upcoming Appointment",
        message: "You have an appointment tomorrow! Open MediManage for more details.", // (required)
        date: new Date(Date.now() + 60*60*24 * 1000), // in 1 day
        allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
      });
} */

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
        <Tab.Screen name="Medications" component={MedicationStackSetUp} />
        <Tab.Screen name="Appointments" component={AppointmentStackSetUp} />
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
    backgroundColor: "lightgray",
    margin: 30,
    borderRadius: 20,
  },
  input: {
    color: "black",
    fontSize: 15,
    borderColor: "black",
    borderWidth: 1,
  },
  label: {
    color: "red",
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    color: "red",
    fontSize: 30,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "red",
    borderRadius: 10,
    paddingVertical: 10,
  },
  instructions: {
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: 'center',
  },
});
