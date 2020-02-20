import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';

import History from '../History';
import InspectorDetail from '../History/InspectorDetail';
import { Button, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import NotificationBell from '../../../Components/NotificationBell';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

const HistoryStack = createStackNavigator({
  History2: {
    screen: History,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Inspection History',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
      headerRight: <NotificationBell />
    })
  },
  InspectorDetail: {
    screen: InspectorDetail,
    navigationOptions: ({ navigation }) => ({
        headerTitle: 'Inspector Detail',
        headerStyle: {backgroundColor:'#28558E'},
        headerTintColor: '#FFF',
        headerRight: <Text style={{color:'#FFF', marginRight:10, fontSize:12}}>Holiday / Leave</Text>
    })
  }
},
{headerLayoutPreset: 'center'}
,{
    initialRouteName: 'History2'
});

module.exports = HistoryStack;