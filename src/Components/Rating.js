import React, { Component } from 'react';
import { Platform, ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native';
import style from '../../assets/styles/style.js';
import { Rating, AirbnbRating, Icon } from 'react-native-elements';

export default class Ratings extends Component {
    constructor(props) {
        super(props)
    }
    render() {
       return(
            <Rating
                style={{marginTop:4}}
                ratingCount={5}
                imageSize={15}
                readonly
                startingValue={this.props.rating}
            />
       )
    }

}