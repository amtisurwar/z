import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';

import Inspections from '../Inspections';
import InspectionDetail from '../../Company/Services/InspectionDetail';
import CreateOfflineBooking from '../../Company/Services/CreateOfflineBooking';
import NotificationBell from '../../../Components/NotificationBell';

const InspectionsStack = createStackNavigator({
  Service: {
    screen: Inspections,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Inspections',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
      headerRight: <NotificationBell />
    })
  },
  InspectionDetail: {
    screen: InspectionDetail,
    navigationOptions: ({ navigation }) => ({
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
      headerRight: <NotificationBell />
    })
  },
  CreateOfflineBooking: {
    screen: CreateOfflineBooking,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Create Offline Booking',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
      headerRight: <NotificationBell />
    })
  }
 
},
{headerLayoutPreset: 'center'}
,{
    initialRouteName: 'Service'
});

module.exports = InspectionsStack;