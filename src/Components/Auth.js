import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, ActivityIndicator, StatusBar, AsyncStorage} from 'react-native';
import Splash from '../Containers/Splash';
import { withNavigation } from 'react-navigation';
import Notification from './Notification';

class Auth extends Component {
	constructor(props) {
	   super(props);
	}
	componentDidMount() {
	   this._bootstrapAsync();
	}

	_bootstrapAsync = async () => {
		var role = await AsyncStorage.getItem("roleid");
		setTimeout( () => {
			if(role) {
				if(role == 3) {
					this.props.navigation.navigate('CompanyHome');
					// this.props.navigation.navigate('Maps');
				}
				else if(role == 2) {
					this.props.navigation.navigate('RealEstateHome');
				}
				else if(role == 4) {
					this.props.navigation.navigate('InspectorHome');
				}
			}
			else {
				this.props.navigation.navigate('UserSelection');
			}
		},2000)
	};

  	render() {
    	return(
    		<View>
    			<StatusBar backgroundColor="#28558E" barStyle="light-content" />
    			<Splash />
				<Notification />
    		</View>
    	)
  	}
}

export default withNavigation(Auth);