import React, { Component } from 'react';
import { Platform, ActivityIndicator, RefreshControl, StyleSheet, View, AsyncStorage, ScrollView, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import style from '../../assets/styles/style.js';
import {
    Container, Header, Content, Button, Card, CardItem,
    Text, Body, Form, Item, Picker,
} from 'native-base';
import { withNavigation } from 'react-navigation';
import { CheckBox, Avatar, SearchBar, Input, Icon } from 'react-native-elements';
import Rating from './Rating';

export default class FavoritesSchedule extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        
        return(
            <View>
                <View style={[style.favInspectorWrappers]}>
                    <View style={[style.center, { width: 100 }]}>
                        {this.props.item.ProfilePic ? <Avatar
                            overlayContainerStyle={{ backgroundColor: '#ebebe0' }}
                            rounded icon={{ name: 'person', color: '#C39666', size: 40 }}
                            size={60}
                            containerStyle={{ borderColor: '#C39666', borderWidth: 1, }}
                            source={{uri: this.props.item.ProfilePic}}
                        /> : <Avatar
                            overlayContainerStyle={{ backgroundColor: '#ebebe0' }}
                            rounded icon={{ name: 'person', color: '#C39666', size: 40 }}
                            size={60}
                            containerStyle={{ borderColor: '#C39666', borderWidth: 1, }}
                            
                        /> }
                        <Text style={[styles.nameTxt, { textAlign: 'center', marginTop: 6, textDecorationLine: 'underline', color: '#28558E' }]}>{this.props.item.InspectorName}</Text>
                        <Rating rating={this.props.item.InspectorRating ? parseInt(this.props.item.Rating) : 0} />
                    </View>
                    <View style={style.flatListItemTextRow}>
                        <Text style={[style.nameTxt, { color: '#28558E' }]}>{this.props.item.CompanyName}</Text>
                        <Text numberOfLines={3} style={[style.nameTxt2, { color: '#706c6c' }]}>{this.props.item.CompanyBio} </Text>
                    </View>
                    <View style={{ width: 40, alignItems: 'flex-end' }}>
                        <Icon size={15} name="heart" type='font-awesome' color="#B9183A" />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    nameTxt: {
        fontSize: 12,
    },
    nameTxtname: {
        fontSize: 12,
    }
});  