import React, { Component } from 'react';
import { Container, Tab, Tabs, ScrollableTab, Header, Body, Title, Right } from 'native-base';
import Upcoming from './Upcoming';
import Past from './Past';
import { CheckBox, Avatar, Icon, Input } from 'react-native-elements';


export default class History extends Component {

    constructor(props) {
      super(props)
      this.state = {
        upcoming: 0,
        past: 0
      }
    }

    componentDidMount() {
      console.log("params1: ",this.props.navigation.state.params)
    }
    
      componentDidUpdate(prevProps, prevState) {
        console.log("params: ",this.props.navigation.state.params)
        if(this.props.navigation.getParam('success') !== prevProps.navigation.getParam('success')) {
          this.setState({
            upcoming: this.props.navigation.getParam('success'),
          })    
        }
      }
    
      
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
        {/* <Header style={{backgroundColor:'#28558E'}}>
            
            <Body style={{justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
                <Title>Inspection History</Title>
                <Icon iconStyle={{ marginRight:15, fontWeight:'normal', float:'right'}} containerStyle={{ float:'right', position:'absolute',right:0}} size={20} color="#FFF" name='notifications' type='material' />
            </Body>
            
              
            </Header> */}
        <Tabs tabBarUnderlineStyle={{ backgroundColor: '#b3003b' }} tabBarBackgroundColor='white' renderTabBar={()=> <ScrollableTab />}>
          <Tab heading="Upcoming"  activeTabStyle={{ backgroundColor: "#b3003b", width:'50%'}} tabStyle={{width:'50%', backgroundColor:'#28558E'}}>
            <Upcoming success={this.state.upcoming} />
          </Tab>
          <Tab heading="Past" activeTabStyle={{ backgroundColor: "#b3003b", width:'50%'}} tabStyle={{width:'50%', backgroundColor:'#28558E' }}>
            <Past />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}