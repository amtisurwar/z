import React, {Component} from 'react';
import {Platform, StatusBar, StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import styles from '../../assets/styles/style.js';

export default class Splash extends Component {
	constructor(props) {
	   super(props);
	}
  	render() {
    	return (
        <View style={styles.splash}>
        	<Image style={styles.imageThumbnail} resizeMode="contain" source = {require('../../assets/images/splash.jpg')} />
			<Text style={{color:'#fff', position:'absolute', bottom:0,  alignSelf:'center', justifyContent:'center'}}>v 4.0.3</Text>
			<StatusBar backgroundColor="#28558E" barStyle="light-content" />
	    </View>
    	);
  	}

  getAuth() {
	this.props.navigation.navigate('AuthStack');
  }
}