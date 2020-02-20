import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, Alert, ActivityIndicator, AsyncStorage} from 'react-native';
import Loader from '../Components/Loader';
import { withNavigation } from 'react-navigation';
import { CheckBox, Avatar, Icon, Input } from 'react-native-elements';

class Logout extends Component {
	constructor(props) {
		super(props)
	}
	componentDidMount() {
    // this.getData();
  }

  signout() {
    Alert.alert(
      '',
      'Are you sure you want to logout?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => this.getData()},
      ],
      {cancelable: false},
    );
  }
  
  async getData() {
    // var deviceId = await AsyncStorage.getItem("deviceId");
    // var fcmToken = await AsyncStorage.getItem("fcmToken");
    // console.log("deviceId: ",deviceId, "fcmToken", fcmToken);
    // var rememberUsername = await AsyncStorage.getItem("rememberUsername");
    // var rememberPassword = await AsyncStorage.getItem("rememberPassword");
    // await AsyncStorage.setItem("deviceId", deviceId);
    // AsyncStorage.clear();
    // await AsyncStorage.setItem("rememberUsername",rememberUsername);
    // await AsyncStorage.setItem("rememberPassword",rememberPassword);
    // console.log("rememberUsername: ",await AsyncStorage.getItem("rememberUsername"),"rememberPassword: ",await AsyncStorage.getItem("rememberPassword"));
    await AsyncStorage.removeItem('roleid');
    await AsyncStorage.removeItem('userid');
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('profile');
    var rememberUsername = await AsyncStorage.getItem("rememberUsername");
		var rememberPassword = await AsyncStorage.getItem("rememberPassword");

    this.props.navigation.navigate('UserSelection');
  }

  render() {
    return (
      <Icon
        reverse
        name='power-off'
        type='font-awesome'
        color='#28558E'
        size={16}
        containerStyle={{position:'absolute',right:20,top:10}}
        onPress={() => this.signout()}
      />
    );
  }
}
export default withNavigation(Logout);