import React from 'react';
import { Button, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckBox, Avatar, Input, Icon  } from 'react-native-elements';
import {createBottomTabNavigator} from 'react-navigation-tabs';
 
import ProfileStack from '../Containers/Inspector/Stacks/ProfileStack';
import InspectionStack from '../Containers/Inspector/Stacks/InspectionStack';


export default createBottomTabNavigator(
  {
    Inspections: InspectionStack,
    Profile: ProfileStack,
  },
  {
    initialRouteName:'Inspections',
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Inspections') {
          iconName = 'user-secret';
        }
        else if (routeName === 'Profile') {
          iconName = 'user';
        }
        return <Icon type='font-awesome' name={iconName}  size={20} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#fff',
      activeBackgroundColor:'#B9183A',
      inactiveTintColor: '#fff',
      style: {
        backgroundColor: '#28558E',
      },
      labelStyle: {
        fontSize: 12,
        marginBottom:3
      },
    },
  }
);