import React, { Component } from 'react';
import { Container, Tab, Tabs, ScrollableTab } from 'native-base';
import Upcoming from '../RealEstate/History/Upcoming';
import Past from '../RealEstate/History/Past';

export default class History extends Component {
    // static navigationOptions = {
    //     title: 'Home',
    //     headerStyle: {
    //       backgroundColor: '#f4511e',
    //     },
    //     headerTintColor: '#fff',
    //     headerTitleStyle: {
    //       fontWeight: 'bold',
    //     },
    //   };
  render() {
    return (
      <Container>
        <Tabs tabBarUnderlineStyle={{ backgroundColor: '#b3003b' }} tabBarBackgroundColor='white' renderTabBar={()=> <ScrollableTab />}>
          <Tab heading="Upcoming" activeTabStyle={{ backgroundColor: "#b3003b", width:'50%'}} tabStyle={{width:'50%', backgroundColor:'#28558E'}}>
            <Upcoming />
          </Tab>
          <Tab heading="Past" activeTabStyle={{ backgroundColor: "#b3003b", width:'50%'}} tabStyle={{width:'50%', backgroundColor:'#28558E' }}>
            <Past />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}