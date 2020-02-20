import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, ActivityIndicator, StatusBar, AsyncStorage} from 'react-native';

export default class Auth extends Component {
	constructor(props) {
	   super(props);
	}
	componentDidMount() {
	   this._bootstrapAsync();
	}

	_bootstrapAsync = async () => {
		const userToken = await AsyncStorage.getItem('userToken');
	   	this.props.navigation.navigate(userToken ? 'DashboardStack' : 'LoginStack');
	};

  	render() {
    	return(
    		<View>
    			<StatusBar barStyle="light-content" />
    			<ActivityIndicator />
    		</View>
    	)
  	}
}

