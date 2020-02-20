import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';

import Favorites from '../Favorites';
import { Button, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import NotificationBell from '../../../Components/NotificationBell';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

const FavoritesStack = createStackNavigator({
    Favorites: {
    screen: Favorites,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Favorite List',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
      headerRight: <NotificationBell />
    })
  },
},
{headerLayoutPreset: 'center'}
,{
    initialRouteName: 'Favorites'
});

module.exports = FavoritesStack;