import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, TouchableHighlight } from 'react-native';
import * as Facebook from 'expo-facebook';
import firebase from 'firebase';
import MyStack from './screens/stacknav';
import { NavigationContainer } from '@react-navigation/native';


const config = {
  apiKey: "AIzaSyDqtbQcVzj16Jd1uFlNwu2qi0LrTVKa6Fg",
  authDomain: "photofeed-b119b.firebaseapp.com",
  databaseURL: "https://photofeed-b119b-default-rtdb.firebaseio.com",
  projectId: "photofeed-b119b",
  storageBucket: "photofeed-b119b.appspot.com",
  messagingSenderId: "657831769893",
  appId: "1:657831769893:web:aa9c33da2e08ca33ca4ccc",
  measurementId: "G-QBDGFGLS78"
};
// Initialize Firebase
// firebase.initializeApp(config);

if (!firebase.apps.length) {
  firebase.initializeApp(config);
} else {
  firebase.app(); // if already initialized, use that one
}


export default function App(props) {

  useEffect(() => {

    registerUser('testemail2@gmail.com', '123456')

  }, [])


  const registerUser = (email, password) => {

    console.log(email, password)
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userObj) => console.log(email, password, userObj))
      .catch((error) => console.log('error logging in', error))

  }

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
