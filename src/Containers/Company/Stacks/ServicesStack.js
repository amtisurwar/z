import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';

import Services from '../Services';
import CreateOfflineBooking from '../Services/CreateOfflineBooking';
import InspectionDetail from '../Services/InspectionDetail';
import { Icon, Button } from 'react-native-elements';

const ServicesStack = createStackNavigator({
  Service: {
    screen: Services,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Inspections',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
      headerRight: <Icon iconStyle={{ marginRight:15, fontWeight:'normal',}} size={20} color="#FFF" name='notifications' type='material' />
    })
  },
  CreateOfflineBooking: {
    screen: CreateOfflineBooking,
    navigationOptions: ({ navigation }) => ({
      headerTitle:'Create Offline Booking',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
    }),
  },
  InspectionDetail: {
    screen: InspectionDetail,
    navigationOptions: ({ navigation }) => ({
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
    }),
  },
 
},
{headerLayoutPreset: 'center'}
,{
    initialRouteName: 'Service'
});

module.exports = ServicesStack;