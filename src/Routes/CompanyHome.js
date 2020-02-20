import React from 'react';
import { Button, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckBox, Avatar, Input, Icon  } from 'react-native-elements';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
 
import Notification from '../Containers/Company/Notification';
import ServicesStack from '../Containers/Company/Stacks/ServicesStack';
import ProfileStack from '../Containers/Company/Stacks/ProfileStack';
import InspectorStack from '../Containers/Company/Stacks/InspectorStack';
//import CreateInspector from '../Containers/Company/inspector/CreateInspector';

export default createBottomTabNavigator(
  {
    Services: ServicesStack,
    Inspectors: InspectorStack,
    Profile: ProfileStack,
    
  },
  {
    initialRoutename: 'Services',
    defaultNavigationOptions: ({ navigation }) => ({
        
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Profile') {
          iconName = 'user';
        } else if (routeName === 'Services') {
          iconName = 'gear';
        }
        else if (routeName === 'Inspectors') {
          iconName = 'user-secret';
        }
        else if (routeName === 'History') {
          iconName = 'history';
        }
        else if (routeName === 'Notification') {
          iconName = 'bell';
        }
        return <Icon type='font-awesome' name={iconName}  size={20} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#fff',
      activeBackgroundColor:'red',
      inactiveTintColor: '#fff',
      style: {
        backgroundColor: '#28558E',
      },
      labelStyle: {
        fontSize: 12,
        marginBottom:3
      },
      // tabStyle: {
      //   justifyContent:'space-around'
      // }
    },
  }
);