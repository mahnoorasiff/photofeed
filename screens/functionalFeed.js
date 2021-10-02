import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import firebase from 'firebase'
const { width, height } = Dimensions.get("screen");
import PhotoList from './photolist'


export default function Feed(props) {

    const [loading, setLoading] = useState(false)
        

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='large' color="#0000ff" />
                <Text style={{ fontWeight: '800' }}>Loading</Text>
            </View>
        )
    } 
    else {
        return (
          <View style={{flex:1, backgroundColor:"#fccdd4", justifyContent:"center"}}>
            <View style={{flexDirection:"row",  alignItems:"center", marginTop: 42}}>
            <Text style={{color:"white", alignSelf:"left", marginLeft:20,  fontSize: 30, letterSpacing:-1.5,
            fontWeight: '600',
}}>DOSY COMMUNITY </Text>
          <FontAwesome5 style={{alignSelf:"right", marginLeft:10,marginTop:-2}} name="hands-helping" color={"white"} size={42}/>
          </View>

          <Text style={{alignSelf:"right",marginLeft:20, marginBottom:10, letterSpacing:0.2, fontSize: 16,
                    fontWeight: '300',color: "#696969"}}>Connect with parents around the world! </Text>
                <PhotoList isUser={false}   />
                </View>
        )
    }
}



const styles = StyleSheet.create({

avatarContainer: {
    shadowColor: '#151734',
    shadowRadius: 15,
    shadowOpacity: 0.4
  },
  avatar: {
    width: 152,
    height: 136,
    borderRadius: 68
  },

  card: {
    alignSelf: "center",
    width: "80%",
    height: 180,
    borderRadius: 15,
    marginBottom: 15
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 32
  },
  stat: {
    alignItems: 'center',
    flex: 1
  },
  statAmount: {
    color: '#4F566D',
    fontSize: 18,
    fontWeight: '300'
  },
  statTitle: {
    color: '#C3C5CD',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4

  },
  button: {
    marginHorizontal: 30,
    backgroundColor: "#E9446A",
    borderRadius: 4,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1

  },
  feed: {
    marginHorizontal: 12,

  },
  feedItem: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 12,
    marginVertical: 8,
    marginBottom: 10
  },
  post: {
    fontSize: 14,
    color: '#838899'

  },

  postImage: {
    width: "100%",
    height: 175,
    borderRadius: 5,
    marginVertical: 16
  },

  name: {
    fontSize: 15,
    fontWeight: '500',
    color: '#454D65',
    marginRight: 135
  }

})

