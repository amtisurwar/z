import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';

import CompanyHome from './CompanyHome';
import RealEstateHome from './RealEstateHome';
import InspectorHome from './InspectorHome';
import RegisterPriceMatrix from '../Containers/RegisterPriceMatrix';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
const HomeStack = createSwitchNavigator({
  RealEstateHome: RealEstateHome,
  InspectorHome: InspectorHome,
  CompanyHome: CompanyHome,
  RegisterPriceMatrix: RegisterPriceMatrix,
    
});

module.exports = HomeStack;