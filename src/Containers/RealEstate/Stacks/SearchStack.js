import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';

import CompanyListing from '../Search/CompanyListing';
import CompanyDetail from '../Search/CompanyDetail';
import SearchSummary from '../Search/SearchSummary';
import Search from '../Search';
import { Avatar, Icon} from 'react-native-elements';
import NotificationBell from '../../../Components/NotificationBell';

const SearchStack = createStackNavigator({
    Search: {
        screen: Search,
        navigationOptions: ({ navigation }) => ({
        headerTitle: 'Inspection Request',
        headerStyle: {backgroundColor:'#28558E'},
        headerTintColor: '#FFF',
        headerRight: <NotificationBell />
        })
    },
    CompanyListing:{
        screen: CompanyListing,
        navigationOptions: ({ navigation }) => ({
          headerTitle:'Inspector list',
          headerStyle: {
            backgroundColor:'#28558E',
          },
          headerTintColor: '#fff',
          headerRight: <NotificationBell />
        }),
    },
    SearchSummary: {
        screen: SearchSummary,
        navigationOptions: ({ navigation }) => ({
          headerTitle:'Confirmation',
          headerStyle: {
            backgroundColor:'#28558E',
          },
          headerTintColor: '#fff',
          headerRight: <NotificationBell />
        }),
    },
    CompanyDetail:{
        screen: CompanyDetail,
        navigationOptions: ({ navigation }) => ({
          headerTitle:'TIC Inspection',
          headerStyle: {
            backgroundColor:'#28558E',
          },
          headerTintColor: '#fff',
          headerRight: <NotificationBell />
        }),
    }
 
},
{headerLayoutPreset: 'center'}
,{
    initialRouteName: 'Search'
});

module.exports = SearchStack;