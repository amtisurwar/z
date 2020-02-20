import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, Alert, ActivityIndicator, AsyncStorage} from 'react-native';
import Loader from '../Components/Loader';
import { withNavigation } from 'react-navigation';
import { CheckBox, Avatar, Icon, Input } from 'react-native-elements';

class NotificationBell extends Component {
	constructor(props) {
		super(props)
	}
	
  render() {
    return (
      <Icon iconStyle={{ marginRight:15, fontWeight:'normal',}} size={20} color="#FFF" name='notifications' type='material' />
    );
  }
}
export default withNavigation(NotificationBell);