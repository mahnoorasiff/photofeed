import React, { useEffect, useState } from 'react';
import { View, Text, Modal, Image, TouchableOpacity, ActivityIndicator,Dimensions, Animated, StyleSheet, FlatList, LogBox } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from 'firebase'
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get("screen");
LogBox.ignoreAllLogs()

export default function PhotoList(props){

  const [loggedin, setloggedin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [photoFeed, setPhotoFeed] = useState([])
  const [users, setUsers] = useState([])
  const [profileentry, setprofileentry] = useState(false)
  const [count, setcount] = useState('')
  const [like_count, set_likecount]= useState(0)   
  const [likes, setlikes]= useState(false)  
  const Yscroll = React.useRef(new Animated.Value(0)).current;

useEffect(()=>{
const {isUser, userId} = props;
if (isUser == true){
//Profile
//userId
console.log(props)
    loadFeed(userId)
    
}
else{
  loadFeed('')
}
}, [])

//plural check
const pluralCheck = (s) => {
    if (s == 1) {
        return 'ago';
    }
    else {
        return 's ago';
    }
}

const timeConverter = (timestamp) => {

    var a = new Date(timestamp * 1000);
    var seconds = Math.floor((new Date() - a) / 1000)

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + 'year' + pluralCheck(interval)
    }
    interval = Math.floor(seconds / 2592000)
    if (interval > 1) {
        return interval + 'month' + pluralCheck(interval)
    }

    interval = Math.floor(seconds / 86400)
    if (interval > 1) {
        return interval + 'day' + pluralCheck(interval)
    }

    interval = Math.floor(seconds / 3600)
    if (interval > 1) {
        return interval + 'hour' + pluralCheck(interval)
    }


    interval = Math.floor(seconds / 60)
    if (interval > 1) {
        return interval + 'minute' + pluralCheck(interval)
    }

    return Math.floor(seconds) + 'second' + pluralCheck(seconds)
}

const loadFeed = (userId = '') => {
        
  console.log("id value that is passed",userId)
  if(userId != ''){
  
      console.log("profile entry")
      setprofileentry(true)
      firebase.database().ref('users').child(userId).on('value', (snapshot) => {
          if (snapshot.val() != undefined && snapshot.val() != null) {
           
              setUsers(snapshot.val())
              console.log(users)
          } else {
              setLoading(true)
          }
      })
  
      firebase.database().ref('users').child(userId).child('photos').on('value', (snapshot) => {
          if (snapshot.val() != undefined && snapshot.val() != null) {
              setPhotoFeed(Object.values(snapshot.val()))
              setLoading(false)
          } else {
              setLoading(true)
          }
      })
    
      
  }
  
  else {
      setprofileentry(false)
      console.log("feed entry")
      firebase.database().ref('users').on('value', (snapshot) => {
          if (snapshot.val() != undefined && snapshot.val() != null) {
              setUsers(snapshot.val())
              console.log("Users obj..",users)
          } else {
              setLoading(true)
          }
      })
  
  
  
      firebase.database().ref('photos').on('value', (snapshot) => {
              if (snapshot.val() != undefined && snapshot.val() != null) {
                  setPhotoFeed(Object.values(snapshot.val()))
                  setLoading(false)
              } else {
                  setLoading(true)
              }
          })
  
      }
  
  
          //clean up function
          return (() =>{
              setLoading(true);
              setPhotoFeed([]);
              setUsers([])
          })
  
      }
  
      
      const removePost = (photoid, userid) =>{
        console.log(userid, photoid)
        firebase.database().ref('/photos/' + photoid).remove()
    
        
          firebase.database().ref('/users/' + userid + '/photos/' + photoid).remove()
          console.log("removing..")
      }
  
  
  
  
  const liker = (photoId) =>{
  setlikes(true)
  set_likecount(like_count+1)
  
  console.log("like count..", like_count)
  firebase.database().ref('photos').child(photoId).child('likes').set(like_count);
  }
  
  
      const navigation = useNavigation();

      const marginBottomItem = 10;
      const paddingItem = 1000;
      const imgHeight = 100;
      const sizeOfItem = imgHeight + paddingItem * 2 + marginBottomItem;

      const renderItem = ({ item, index}) => {
        const scale = Yscroll.interpolate({
          inputRange: [
            -1, 0,
            sizeOfItem * index,
            sizeOfItem * (index + 2)
          ],
          outputRange: [1, 1, 1, 0]
        })

  
          return (
            
              <Animated.View style={{...styles.feedItem, 
                transform: [{ scale }]
              }}>
                      {profileentry == true ?
                        
                      <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"  }}>
                      <Text style={{...styles.name, fontWeight:"500"}}>{users.name}</Text> 
                      <Ionicons name="trash-outline" size= {22}
                      onPress={() => removePost(item.id, item.author)} />
                      </View>
                      
                      : (
                        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                        <Text style={{...styles.name, fontWeight:"500"}}>{users[item.author].name}</Text>
                         </View>
                      )}
                      
                      <Text style={styles.post}>{timeConverter(item.posted)}</Text>
                   <Image style={styles.postImage}
                      source={{ uri: item.url }}
                  />
                  <Text>{item.caption}</Text>
    
          <View style={{ flexDirection: 'row',  alignItems:"stretch", justifyContent:"space-around"  }}>
            <TouchableOpacity onPress= {()=>liker(item.id)}>
            
             {likes==true ?
             <View style={{flexDirection:"row", alignItems:"center"}}>
             <MaterialCommunityIcons style={{  marginTop:2 }} name="heart" color={'#FAA0A0'} size={25} />
            <Text >{item.likes} likes </Text>
            </View>
            :( 
              <View style={{flexDirection:"row", alignItems:"center"}}>
              <MaterialCommunityIcons style={{  marginTop:2 }} name="heart" color={'grey'} size={25} />
              <Text >{item.likes} likes </Text>
              </View>
              )
          }
            
            </TouchableOpacity>
            <View style={{flexDirection:"row", alignItems:"center"}}>
            <MaterialCommunityIcons style={{ marginTop:2.5, marginRight:4 }} name="comment" color={'skyblue'} size={25}
            onPress={() => {
              navigation.navigate('Comments', {
                photoid: item.id
              })}} />
            <Text style={{ marginTop:2 }}>Comment</Text>
            </View>
          </View>
  
          <TouchableOpacity style={styles.button} onPress={() => {
            navigation.navigate('Comments', {
              photoid: item.id
            });
          }}>
          <Text > View Comments</Text>
          </TouchableOpacity>
          
              </Animated.View>
          )
      }
  
      if (loading) {
          return (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size='large' color="#0000ff" />
                  <Text style={{ fontWeight: '800' }}>Loading</Text>
              </View>
          )
      } else {
          return (
                  <Animated.FlatList style={{ marginHorizontal: 12 
                  }}
                  showsVerticalScrollIndicator={false}
                      data={photoFeed}
                      keyExtractor={(item, index) => String(index)}
                      renderItem={renderItem}
                      onScroll={
                        Animated.event(
                          [{ nativeEvent: { contentOffset: { y: Yscroll } } }],
                          { useNativeDriver: true }
                        )}
                  />
              
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
      width: "90%",
      height: 180,
      borderRadius: 15,
      marginBottom: 15
    },
  
    button: {
      marginHorizontal: 20,
      backgroundColor: "#E9446A",
      borderRadius: 4,
      height: 35,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1
     
    },
    feed: {
      marginHorizontal: 5,
    },
    feedItem: {
      
      backgroundColor: '#FFF',
      borderRadius: 5,
      padding: 18,
      marginVertical: 6,
      marginHorizontal:5,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    
    post: {
      fontSize: 14,
      color: '#838899'
  
    },
  
    postImage: {
      width: "100%",
      height: 220,
      borderRadius: 5,
      marginVertical: 10,
      
    },
  
    name: {
      fontSize: 15,
      fontWeight: '300',
      color: '#454D65',

    },
  
    commentsModal: {
      alignSelf: "center",
      margin: 10,
      height:"90%",
      width:"90%",
      overflow:"hidden",
      backgroundColor: "white",
      borderRadius: 20,
      padding: 20,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
  
  
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    },
    profileContainer: {
      width: width,
      height: height,
      padding: 0,
      zIndex: 1, 
      
    },
    
    profileBackground: {
      width: width,
      height: height / 2,
    
    }
  
  })
  
  