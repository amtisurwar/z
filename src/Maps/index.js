import React, {Component} from 'react';
import {Platform, Dimensions, StyleSheet, Text, View, ScrollView, ActivityIndicator, StatusBar, AsyncStorage} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Circle, AnimatedRegion, Animated} from 'react-native-maps';

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 1;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// const LONGITUDE_DELTA = 1;
const LATITUDE = 28.5355;
const LONGITUDE = 77.391;
const CONVERSION = 1610;
const KEY = "AIzaSyCe2Vwdo6y6kyp4hAdNboe638M_YR2HvHQ";

import { CheckBox, Avatar, Icon, Input, Button, Slider } from 'react-native-elements';
import style from '../../assets/styles/style.js';
import axios from 'axios';
import Errors from '../Components/Errors';
import API from '../Api/Api';
import Common from '../Containers/Common';
import Loader from '../Components/Loader';

export default class Maps extends Component {
	
	constructor(props) {
	   super(props);
	   this.state = {
			mile: 5,
			zip:'',
			latitudeDelta: LATITUDE_DELTA,
			longitudeDelta: LONGITUDE_DELTA,
			latitude: LATITUDE,
			longitude: LONGITUDE,
			loading: false,
		}
		this.common = new Common();
	}
	

	search = (text) => {
		this.setState({'zip': text})
		if(text.length != 5) return null;
		var queryString = "https://maps.googleapis.com/maps/api/geocode/json?address="+text+"&key="+KEY;
		axios.get(queryString).then(response => {
			var data = response.data.results[0].geometry;
			var { location } = data;
			// var coordinate = {latitude: location.lat, longitude: location.lng,latitudeDelta: LATITUDE_DELTA,longitudeDelta: LONGITUDE_DELTA}
			this.setState({
				latitude: location.lat,
				longitude: location.lng,
				// latitudeDelta: location.latitudeDelta,
				// longitudeDelta: location.latitudeDelta
			})
			// this.map.region = coordinate;
			// this.circle.center = {latitude: location.lat, longitude: location.lng};
			// this.circle.key = {latitude: location.lat, longitude: location.lng}.toString();
			// this.circle.radius = this.state.mile * CONVERSION;
			
		})
	}

	getInitialRegion() {
		return {
			latitude: this.state.latitude,
			longitude: this.state.longitude,
			latitudeDelta: this.state.latitudeDelta,
			longitudeDelta: this.state.longitudeDelta
		}
	}

	onRegionChange(region) {
		this.changePosition(region)
		// this.setState({
		// 	latitude: region.latitude,
		// 	longitude: region.longitude,
		// })
	}

	DragEnd = (response) => {
		this.changePosition(response)
	}

	changePosition(response) {
		var { coordinate } = response.nativeEvent;
		this.setState({
			latitude: coordinate.latitude,
			longitude: coordinate.longitude
		})
	}



	onRegister = async () => {
		if(!this.state.zip) {
			this.common.showToast("Please Enter Zip");
		}
		else if(this.state.zip && !this.common.validateZipCode(this.state.zip)) {
			this.common.showToast("Please Enter Valid Zip");
		}
        else {
			this.setState({ loading: true });
			var authToken = await AsyncStorage.getItem("authToken");
			await this.getRequestData().then(data => {
				console.log("request data: ", data);
				var header = { "authentication": authToken };
				var response = new API('RegisterInspector', data, header).getResponse();
				response.then(result => {
					console.log("response: ", result);
					if (result.statuscode == 200) {
						this.setState({ loading: false });
						this.props.navigation.navigate('InspectorRegisterMatrix', { "request": result.result })
					}
					else {
						this.setState({ loading: false });
						this.common.showToast(result.message)
					}
				})
			}).catch(e => {
				this.common.showToast("Failed to save Inspector, try again later")
				this.setState({ loading: false });
			});
		}
	}
		

	async getRequestData() {
		var request = this.props.navigation.getParam('profile');
		request.flag = 0
		var newRequest = {
			...request,
			"zipcode": this.state.zip,
			"geofencingradius": this.state.mile,
			"latitude": this.state.latitude,
			"longitude": this.state.longitude
		}
		return newRequest;
	}

	
  	render() {
		if (this.state.loading) return <Loader />
		return(
			<View style={{flex:1}}>
    			<View>
					<Input 
						value={this.state.zip} 
						onChangeText={(text) => this.search(text)}
						placeholder="Enter USC Zip"
						keyboardType="numeric"
						inputStyle={style.font14}
						
					/>
					<View style={{margin:10}}>
						<View style={style.row}>
							<Text style={style.registerOtherComponentsText}>Set Geofencing Radius</Text>
							<Text style={[style.registerOtherComponentsText,{color:'#BE780F'}]}> {this.state.mile} miles</Text>
						</View>
						<Slider
							value={this.state.mile}
							onValueChange={value => this.setState({mile: value })}
							thumbTintColor="#28558E"
							minimumValue={1}
							maximumValue={50}
							step={1}
							minimumTrackTintColor="#28558E"
						/>
						<View style={[style.row]}>
							<Text style={[style.registerOtherComponentsText,style.twoRow]}>1 mile</Text>
							<Text style={[style.registerOtherComponentsText,style.twoRow,{textAlign:'right'}]}>50 miles</Text>
						</View>
						<View style={[style.row,{marginTop:15}]}>
							<Text style={[style.registerOtherComponentsText,{fontWeight:'bold'}]}>Note</Text>
							<Text style={[style.registerOtherComponentsText]}> - Drag the map to mark you accurate territory.</Text>
						</View>
					</View>
				</View>
				<View style={{flex:1}}>
					<MapView
						provider={PROVIDER_GOOGLE}
						style={styles.map}
						ref={map => { this.map = map }}
						onPress={(region) => this.onRegionChange(region)}
						region={this.getInitialRegion()}
						mapType="standard"
						initialRegion={this.getInitialRegion()}
						showsBuildings
						showsTraffic
						zoomEnabled
						zoomControlEnabled
						loadingEnabled={true}
						moveOnMarkerPress={false}
						onRegionChangeComplete={(coor) => console.log("onRegionChange: ",coor)}
				
					>
						
						<Circle
							center={{latitude: this.state.latitude, longitude: this.state.longitude}}
							radius={CONVERSION * this.state.mile}
							fillColor="rgba(000,000,000,0.2)"
							strokeWidth={1}
							strokeColor="#000"
							zIndex={1}
							ref={circle => { this.circle = circle }}
						/>
						<MapView.Marker.Animated
							draggable
							ref={marker => { this.marker = marker }}
							coordinate={this.getInitialRegion()}
							onDragEnd={(e) => this.DragEnd(e)}
						/>
					</MapView>
					
				</View>
				<View style={style.center}>
					<Button
						title="Save"
						buttonStyle={style.btnNext}
						onPress={() => this.onRegister()}>
					</Button>
				</View>
			</View>
    	)
  	}
}


const styles = StyleSheet.create({
	container: {
	  ...StyleSheet.absoluteFillObject,
	  height: 400,
	  width: 400,
	  justifyContent: 'flex-end',
	  alignItems: 'center',
	},
	map: {
	  ...StyleSheet.absoluteFillObject,
	},
});