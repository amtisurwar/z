import React, { Component } from 'react';
import { Platform, ActivityIndicator, RefreshControl, StyleSheet, View, AsyncStorage, ScrollView, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import style from '../../../assets/styles/style.js';
import {
    Container, Header, Content, Button, Card, CardItem,
    Text, Body, Form, Item, Picker,
} from 'native-base';
import { CheckBox, Avatar, SearchBar, Input, Icon } from 'react-native-elements';
import FavoritesSchedule from '../../Components/FavoritesSchedule';
import API from '../../Api/Api';
import Loader from '../../Components/Loader';
import EmpltyResult from '../../Components/EmpltyResult';

export default class Schedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            data: [],
            refreshing: false,
        }
    }

    componentDidMount() {
        this.refresh()
    }

    refresh = async () => {
        var token = await AsyncStorage.getItem('authToken');
        var profile = JSON.parse(await AsyncStorage.getItem("profile"));
        var header = { 'authentication': token };
        var data = {agent: profile.AgentId};

        this.setState({ loading: true });
        var response = new API('AgentFavouriteList', data, header).getResponse();
        response.then(result => {
            console.log("AgentFavouriteList result: ", result,data,header);
            if (result.statuscode == 200) {
                this.setState({
                    data: result.result,
                    loading: false,
                })
            }
            else {
                console.log("error: ",result)
                this.setState({ loading: false });
            }
        })
    }

    renderItem = ({ item, index }) => {
        return <FavoritesSchedule item={item} />
    }

    render() {
        if(this.state.loading) return <Loader />
        return (
            <Container style={{backgroundColor:'#ccc'}}>
                <FlatList
                   data={this.state.data}
                   keyExtractor={(item, index) => `${index}`}
                   renderItem={this.renderItem}
                   refreshing={this.state.refreshing}
                   onRefresh={this.refresh}
                   ListEmptyComponent={<EmpltyResult />}
                />
            </Container>
        )
    }
}
