import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';

import Profile from '../Profile';
import UpdatePriceMatrix from '../UpdatePriceMatrix';

const ProfileStack = createStackNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Profile',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
    })
  },
  UpdatePriceMatrix:{
    screen: UpdatePriceMatrix,
    navigationOptions: ({ navigation }) => ({
        headerTitle:'Price Martix',
        headerStyle: {backgroundColor:'#28558E'},
        headerTintColor: '#FFF',
    }),
  }
 
},
{headerLayoutPreset: 'center'}
,{
    initialRouteName: 'Profile'
});

module.exports = ProfileStack;