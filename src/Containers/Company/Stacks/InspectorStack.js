import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';

import Inspector from '../inspector';
import CreateInspector from '../inspector/CreateInspector';
import { Icon, Button } from 'react-native-elements';
import InspectorDetail from '../inspector/InspectorDetail';
import InspectorRegisterMatrix from '../inspector/RegisterMatrix';

import Maps from "../../../Maps";


const InspectorStack = createStackNavigator({
  Inspector: {
    screen: Inspector,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Inspectors',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
    })
  },
  Maps:{
    screen: Maps,
    navigationOptions: ({ navigation }) => ({
      headerTitle:'Inspector Territory',
      headerStyle: {
        backgroundColor:'#28558E',
      },
      headerTintColor: '#fff',
      headerRight: <Icon iconStyle={{ marginRight:15, fontWeight:'normal',}} size={20} color="#FFF" name='notifications' type='material' />
    }),
  },
  CreateInspector: {
    screen: CreateInspector,
    navigationOptions: ({ navigation }) => ({
      headerTitle:'Create Inspector',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
      headerRight: <Icon iconStyle={{ marginRight:15, fontWeight:'normal',}} size={20} color="#FFF" name='notifications' type='material' />
    }),
  },
  InspectorDetail:{
    screen: InspectorDetail,
    navigationOptions: ({ navigation }) => ({
      headerTitle:'Inspector Detail',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
      headerRight: <Button title="Holiday Leave" type="clear" />
    }),
  },
  InspectorRegisterMatrix: {
    screen: InspectorRegisterMatrix,
    navigationOptions: ({ navigation }) => ({
      headerTitle:'Inspector Price Matrix',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
      headerLeft: null,
      headerRight: <Icon iconStyle={{ marginRight:15, fontWeight:'normal',}} size={20} color="#FFF" name='notifications' type='material' />
    }),
  },
  
 
},
{headerLayoutPreset: 'center'}
,{
    initialRouteName: 'Inspector'
});

module.exports = InspectorStack;