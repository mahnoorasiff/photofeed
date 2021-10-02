import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, Image, TouchableOpacity, ActivityIndicator, ImageBackground,
    StyleSheet, Keyboard, ScrollView, LogBox, Dimensions
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
const { width, height } = Dimensions.get("screen");
import { Alert, Modal } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import firebase from 'firebase'
import PhotoList from './photolist'
LogBox.ignoreAllLogs()

export default function Profile(props) {
    const [loggedin, setloggedin] = useState(false)
    const [ImageId, setImageId] = useState('')
    const [imageSelected, setImageSelected] = useState(false)
    const [uploading, setuploading] = useState(false)
    const [Caption, setCaption] = useState('')
    const [progress, setProgress] = useState(0)
    const [uri, seturi] = useState('')
    const [currentFileType, setcurrentFileType] = useState('')
    const [userId, setuserId] = useState('')
    const [username, setusername] = useState('')
    const [Name, setname] = useState('')
    const [avatar, setavatar] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProfile, seteditingProfile] = useState('')
    const [bio, setbio] = useState('Mother to two exceptional kids, Sarah and Mustafa.Sharing my life experiences with parents on a similar path!')

    const fetchUserInfo = (userId) => {
        firebase.database().ref('users').child(userId).once('value', (snapshot) => {
            if (snapshot.val() != undefined && snapshot.val() != null) {

                setusername(snapshot.val().username)
                setname(snapshot.val().name)
                setavatar(snapshot.val().avatar)
                setuserId(userId)
            }
            else {
                alert("cant fetch")
            }

        })
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                //loggedin
                fetchUserInfo(user.uid)
            }
        })

    }, [])

    const _checkPermissions = async () => {

        const {
            status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
        }
    }


    const s4 = () => {

        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)

    }



    const uniqueId = () => {
        return s4() + s4() + '-' + s4()

    }


    const findNewImage = async () => {
        _checkPermissions();

        let result = await ImagePicker.launchImageLibraryAsync(
            {
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

        console.log(result)


        if (!result.cancelled) {
            console.log("time to upload image..")

            setImageSelected(true),
                setImageId(uniqueId()),
                seturi(result.uri)

        }

        else {
            console.log('cancel')
            setImageSelected(false)

        }

    }



    const uploadImage = async (uri) => {
        console.log("uploading to db storage")
        var userid = firebase.auth().currentUser.uid
        var imageId = ImageId

        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(uri)[1];

        if( uri == null ) {
            return null;
          }

        setcurrentFileType(ext),
            setuploading(true)


        const response = await fetch(uri);
        console.log('response', response)
        const blob = await response.blob();


        var FilePath = imageId + '.' + currentFileType;

        const uploadTask = firebase.storage().ref('user/' + userid + '/img').child(FilePath).put(blob);

        uploadTask.on('state_changed', function (snapshot) {
            var progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
            console.log('Upload is ' + progress + "% complete");

            setProgress(progress)

        }, function (error) {
            console.log('error with upload' + error)
        }, function () {
            //upload complete now fetch url from db
            setProgress(100);
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log(downloadURL)
                processUpload(downloadURL)

            });
        });

    }

    const processUpload = (imageUrl) => {
        //Process here...

        //Set needed info
        var imageId = ImageId;
        var userId = firebase.auth().currentUser.uid;
        var caption = Caption;
        var dateTime = Date.now();
        var timestamp = Math.floor(dateTime / 1000);

        //Build photo object
        //author, caption, posted, url


        var photoObj = {
            id: imageId,
            author: userId,
            caption: caption,
            posted: timestamp,
            url: imageUrl

        };


        //Update database

        firebase.database().ref('/photos/' + imageId).set(photoObj);

        //Set user photos object
        firebase.database().ref('/users/' + userId + '/photos/' + imageId).set(photoObj);


        alert('Image Uploaded')

        setuploading(false),
            setImageSelected(false),
            setCaption(''),
            seturi('')

    }


    const uploadPublish = () => {
        console.log("upload button pressed, trying..")
        if (uploading == false) {
            if (Caption != '') {

                //
                uploadImage(uri)
            }
            else {
                alert('Enter text')
            }
        }
        else {
            console.log('Ignore button, uploading in process')

        }
    }


    const editProfile = () => {
        seteditingProfile(true)
    }

    const saveProfile = () => {
        console.log(userId)
        if (Name !== '') {
            firebase.database().ref('users').child(userId).child('name').set(Name);
        }
        if (username !== '') {
            firebase.database().ref('users').child(userId).child('username').set(username);

        }
        seteditingProfile(false)

    }


    console.log("we are passing...", userId)
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width, backgroundColor:"white" }}
        >

            <ImageBackground
                source={require("../assets/profile-screen-bg.png")}
                style={styles.profileContainer}
                imageStyle={styles.profileBackground}
            >
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Image style={styles.avatar}
                            source={{ uri: avatar }} />

                    </View>
                    <Text style={styles.name}>{Name}</Text>
                    
                 <Text style={{marginTop: 10, marginBottom:10, letterSpacing:0.5, fontSize: 13,
                    fontWeight: '200',color: "black", width:260}}>{bio} </Text>

                    {editingProfile == true ? (
                        <View style={{ justifyContent: "center", alignItems: "center" }}>

                            <Text style={{alignSelf:"flex-start", fontWeight:"600", color:"#9a57c5",
                             letterSpacing:-0.4,fontSize:15}}> Name</Text>
                            <TextInput
                                editable={true}
                                placeholder={"Enter your name"}
                                onChangeText={(text) => setname(text)}
                                value={Name}
                                style={{ width: 240, borderRadius: 10, marginVertical: 8,color:"grey", padding: 10, borderColor: "grey", borderWidth: 1 }}
                            />

                            <Text style={{alignSelf:"flex-start", fontWeight:"600", color:"#9a57c5", 
                            fontSize:15,letterSpacing:-0.4}}> Username</Text>

                            <TextInput
                                editable={true}
                                placeholder={"Enter your username"}
                                onChangeText={(text) => setusername(text)}
                                value={username}
                                style={{ width: 240, borderRadius: 10, color:"grey",marginVertical: 8, padding: 10, 
                                    borderColor: "grey", borderWidth: 1 }}
                            />

                            <Text style={{alignSelf:"flex-start", fontWeight:"500", 
                            fontWeight:"600", color:"#9a57c5",fontSize:15, letterSpacing:-0.4}}> Introduce yourself</Text>
                            <TextInput
                                editable={true}
                                placeholder={"Introduce yourself"}
                                onChangeText={(text) => setbio(text)}
                                value={bio}
                                style={{ width: 240, borderRadius: 10, color:"grey",marginVertical: 8,marginBottom:18,
                                 padding: 12,
                                     borderColor: "grey", borderWidth: 1 }}
                            />

                            <TouchableOpacity
                                style={{ backgroundColor: "#ba8cd7", borderRadius: 20, width:140, padding: 14 }}
                                onPress={() => saveProfile()}>
                                <Text style={{ color: "white", fontWeight:"400" , 
                                letterSpacing:-0.2,alignSelf:"center" }}>Save Changes</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => seteditingProfile(false)}>
                                <Text style={{ fontWeight:"300" ,alignSelf:"center", marginTop:10, fontSize:15 }}>cancel</Text>
                            </TouchableOpacity>        

                        </View>

                    ) : (
                        <View style={{alignItems:"center", justifyContent:"center"}}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center",   }}>

                                <TouchableOpacity onPress={() => setModalVisible(true)}>
                                    
              <MaterialIcons style={{  marginTop:2,  marginHorizontal:20 }} name="add-to-photos" color={'#a167c9'} size={35} />

                                    <Text style={{ color: 'grey', fontWeight: '400', letterSpacing: -0.5, fontSize: 15, 
                                    marginHorizontal:10, alignItems:"center" }}>
                                        Add Post</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress={() => editProfile()}>
              <MaterialCommunityIcons style={{  marginTop:2, marginHorizontal:20 }} name="account-edit" color={'#a167c9'} size={35} />

                                    <Text style={{ color: 'grey', fontWeight: '400',
                                     letterSpacing: -0.5, fontSize: 15,marginHorizontal:10 }}>Edit Profile</Text>
                                </TouchableOpacity>
                        </View>

            <View style={{ flex:1, width:width, marginTop:30}}>
                        <PhotoList isUser={true} userId={firebase.auth().currentUser.uid} />
                        </View>
                        </View>
                        
                    )}

                </View>
                <Modal
                
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible(!modalVisible);
                    
                    }}
                >


                    <View
                        style={styles.centeredView}
                    >
                        <View
                            style={styles.modalView}
                        >

                            <Ionicons name="md-close-outline"
                                size={25}
                                color={'grey'}
                                style={{ alignSelf: "flex-end", marginTop: 20,marginBottom:10, marginRight: 18 }}
                                onPress={() => setModalVisible(!modalVisible)}
                            />


                            <TextInput
                                editable={true}
                                onRequestClose
                                placeholder={'Enter your caption'}
                                maxLength={150}
                                multiline={true}
                                numberofLine={4}
                                onChangeText={(text) => setCaption(text)}
                                value={Caption}
                                style={{ borderWidth: 0.4, borderRadius:20, width:width/1.4,
                                    justifyContent: "center",marginVertical: 10, height: height/3,
                                     padding: 5, borderColor: 'grey' }}
                            />


                            <View style={{ flexDirection: "row", marginTop:15,
                            borderColor: "grey", borderWidth: 0.1, borderRadius:10, width:width/2,
                            justifyContent: "center", alignContent: "space-between" }}>
                                <TouchableOpacity  onPress={() => findNewImage()}>
                                    <Ionicons 
                                    style={{ marginHorizontal:width/6 }}name="md-camera" size={35} color="#2f3442" />
                                </TouchableOpacity>

                                <TouchableOpacity style={{  }}
                                 onPress={() => uploadPublish()}
        
                                >
                             <MaterialCommunityIcons
                             style={{  marginHorizontal:width/6 }} name="progress-upload" size={35} color="#2f3442" />
                                    
                                </TouchableOpacity>

                            </View>

                            {uploading == true ? (
                                <View style={{ marginTop: 15 }}>
                                    <Text>{progress} %</Text>
                                    {progress != 100 ? (
                                        <ActivityIndicator size="small" color="blue" />
                                    ) : (
                                        <Text> Processing</Text>
                                    )}
                                </View>
                            ) : (

                                <View>
                                </View>

                            )}

                        </View>
                    </View>
                </Modal>

            </ImageBackground>

        </ScrollView>

    );
}


const styles = StyleSheet.create({

    avatarContainer: {
        position: "relative",
        marginTop: -60
      },
      avatar: {
        width: 124,
        height: 124,
        borderRadius: 62,
        borderWidth: 0
      },
    
    card: {
        alignSelf: "center",
        width: "80%",
        height: 180,
        borderRadius: 15,
        marginBottom: 15
    },

    feed: {
        marginHorizontal: 12,
    },

    feedItem: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        padding: 12,
        flexDirection: 'column',
        marginVertical: 8
    },
    post: {
        marginTop: 16,
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
        marginTop: 10,
        fontSize: 22,
        fontWeight: '600',
        color: "black"
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"#899ed0"
    },

    modalView: {
        backgroundColor: "white",
        width: width/1.2,
        height: height/1.65,
        borderRadius: 20,
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

    buttonOpen: {
        backgroundColor: "#F194FF",
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

    fill: {

        paddingHorizontal: 20,
        paddingBottom: 8,
        alignItems: "center",
        borderWidth: 0.2,
        borderRadius: 12,
        backgroundColor: "#DEBA9D",
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 2

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
        flex:1
    },
    profileCard: {
        // position: "relative",
        padding: 80,
        marginHorizontal: 30,
        marginTop: 110,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        backgroundColor: "white",
        shadowColor: "black",
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 8,
        shadowOpacity: 0.2,
        zIndex: 2,
        justifyContent: "center",
        alignItems: "center"
    },



})
