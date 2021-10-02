import React, { useEffect, useState } from 'react';
import { View, Text,  TouchableOpacity,Dimensions, TextInput,Image, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from 'firebase'
const { width, height } = Dimensions.get("screen");

export default function Comments({ route}) {
    const [loading, setLoading] = useState(true)
    const [comments_list, setcomments_list] = useState([])
    const [Comment, setcomment] = useState('')    
    const [username, setusername]= useState('')
    const [count, setcount] = useState('')


    var photoid= route.params.photoid
    useEffect (()=>{
      // const photoid = route.params.photoid;
            
         console.log("photo id passed",photoid)
         fetchComments(photoid)
            
        }, [])
        
      
    const fetchComments = (photoid) =>{
      console.log("photoid that is passed..",photoid)
      
  firebase.database().ref('comments').child(photoid).on('value', (snapshot) => {
      if (snapshot.val() != undefined && snapshot.val() != null) {
        
          // setnumberofComments(Object.values(snapshot.val).length)
          setcomments_list(Object.values(snapshot.val()))
          console.log("comments list fetched..", comments_list)
          for(var property in comments_list) {
              console.log(property + "=" + comments_list[property].author);
       
              var count =property;
              
              setcount(count)
              firebase.database().ref('users').child(comments_list[property].author).child('username').once('value', (snapshot) => {
                  if (snapshot.val() != undefined && snapshot.val() != null) {
                      console.log(".....", snapshot.val())
                    setusername(snapshot.val())
                    }
             
              }
          )   
    
          }
          
          console.log("...")          
          setLoading(false)
      
  }
  
  else{
  // empty comment list
  setLoading(true)
  console.log("empty comment list")
  setcomments_list([])
  }
  
  })
  
  }


const reloadCommentList =()=>{
setcomments_list([])

fetchComments(photoid)
}

  
const postComment =() =>{
  // var photoid=route.params.photoid
  var comment = Comment
  //Set needed info
  if (comment != ''){
    var imageId = photoid;
    var userId = firebase.auth().currentUser.uid;
    var commentId = photoid+Math.floor(Math.random() * 10);
    var dateTime = Date.now();
    var timestamp = Math.floor(dateTime / 1000);

setcomment('')
  

var commentObj= {
  posted:timestamp,
  author:userId,
  comment:comment

}

  
//Update database; add to database
firebase.database().ref('/comments/'+imageId+'/'+commentId).set(commentObj)
console.log("adding comment")
//reload comment
reloadCommentList()

}
else{
  alert("please enter a comment before posting!")
}


}




  const rendering = ({ item} ) => {
        console.log("rendering..")
    return (
      <View style={styles.container}>
      
        <Image style={styles.image} source={{uri:"https://source.unsplash.com/user/erondu/1600x900"}}/>
      
      <View style={styles.content}>
        <View style={styles.contentHeader}>
          <Text  style={styles.name}>{item.author}</Text>
          <Text style={styles.time}>
            {item.posted}
          </Text>
        </View>
        <Text style={{fontSize:16, fontWeight:"300", letterSpacing:-.01}} >{item.comment}</Text>
      </View>
    </View>
)}



    return(
<View style={{flex:1,backgroundColor: '#ebecf0'}}>

<FlatList
data={comments_list}
renderItem={rendering}
keyExtractor={(item, index) => String(index)}
ItemSeparatorComponent={() => {
  return (
    <View style={styles.separator}/>
  )
}}/>

<View style={{...styles.feedItem, borderRadius:22, flexDirection:"row", justifyContent:"center", 
 alignItems:"center"}}>
<Image style={styles.image} source={{uri:"https://source.unsplash.com/user/erondu/1600x900"}}/>
<TextInput
            editable={true}
            onRequestClose
            placeholder={'Enter comment'}
            maxLength={120}
            multiline={true}
            numberofLine={3}
            onChangeText={(text) => setcomment(text)}
            value={Comment}
            style={{ alignItems:"center", justifyContent:"center", padding:15, height: 40,width:width/1.45,
             borderRadius:20,borderColor: 'grey', borderWidth: 0.5}}


/>
<TouchableOpacity style={{borderRadius:18, padding:2}} onPress={()=>postComment()}>
  <Text style={{ color:"blue", fontWeight:"400",marginLeft:3, fontSize:15 }}>Post</Text>
</TouchableOpacity>
</View>
            

</View>
    )

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
      backgroundColor: '#ebecf0',
      borderRadius: 5,
      padding: 12,
      marginVertical: 10,
      marginBottom: 10,
    },

    post: {
      fontSize: 14,
      color: '#838899'
  
    },
  
    root: {
      backgroundColor: "#ffffff",
      marginTop:10,
    },
    container: {
      backgroundColor: 'white',
      paddingLeft: 2,
      paddingRight: 0,
      width:width,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: 'white',
      shadowColor: '#151734',
      shadowRadius: 12,
      shadowOpacity: 0.4,
      borderRadius: 5
    },
    content: {
      marginLeft: 16,
      flex: 1,
      shadowColor: '#151734',
      shadowRadius: 15,
      shadowOpacity: 0.4


    },
    contentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6
    },
    separator: {
      height: 1,
      backgroundColor: "#CCCCCC"
    },
    image:{
      width:45,
      height:45,
      borderRadius:20,
      marginRight:2
    },
    time:{
      fontSize:11,
      color:"#808080",
    },
    name:{
      fontSize:15,
      fontWeight:"500",
      letterSpacing:-1.2
    }
  
  
  })
  
  