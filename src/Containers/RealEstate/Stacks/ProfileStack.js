import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';

import Profile from '../Profile';
import EditProfile from '../EditProfile';
import ChangeRealEstatePassword from '../ChangeRealEstatePassword';

const ProfileStack = createStackNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Profile',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
    })
  },
  EditProfile: {
    screen: EditProfile,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Change Profile',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
    })
  },
  ChangeRealEstatePassword: {
    screen: EditProfile,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Change Password',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
    })
  },
},
{headerLayoutPreset: 'center'}
,{
    initialRouteName: 'Profile'
});

module.exports = ProfileStack;