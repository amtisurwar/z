import React, { Component } from 'react';
import { Platform, StyleSheet, View, ScrollView, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import styles from '../../assets/styles/style.js';
import {
	Container, Header, Content, Button, Card, CardItem,
	Icon, Text, Body, Form, Item, Input
} from 'native-base';
import { CheckBox } from 'react-native-elements';
import Errors from '../Components/Errors';
import API from '../Api/Api';
import Loader from '../Components/Loader';
import Notification from '../Components/Notification';
import Social from '../Components/Social';
import Common from '../Containers/Common';

export default class Login extends Social {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			role: 0,
			errors: [],
			remember: false,
			roleLink: '',
			loading: false,
		}
		this.common = new Common();
	}

	componentDidMount() {
		var role = this.props.navigation.getParam('role');
		this.setState({ role: role });
		this.getRoleLink(role);
		this.setRemember();
	}

	async setRemember() {
		var credentials = this.props.navigation.getParam('credentials');
		if (credentials.rememberUsername && credentials.rememberPassword) {
			this.setState({
				username: credentials.rememberUsername,
				password: credentials.rememberPassword
			})
		}
	}

	async getRoleLink(role) {
		await AsyncStorage.clear();
		if (role == 2) {
			this.setState({ roleLink: 'Register' })
		}
		else if (role == 3) {
			this.setState({ roleLink: 'RegisterCompany' })
		}

	}

	navigateToRegister() {
		this.props.navigation.navigate(this.state.roleLink);
	}

	printFooter() {
		if (this.state.role == 2 || this.state.role == 3) {
			return (
				<View>
					<View style={styles.orWrapper}>
						<View style={styles.orLine}></View>
						<View style={styles.orTextContainer}>
							<Text>OR</Text>
						</View>
						<View style={styles.orLine}></View>
					</View>
					<Text style={styles.loginWithStyle}>LOGIN WITH</Text>
					<View style={styles.socialWrapper}>
						<TouchableOpacity onPress={() => this.facebookLogin()}><Image style={styles.loginSocialImage} source={require('../../assets/images/facebook.png')} /></TouchableOpacity>
						<TouchableOpacity onPress={() => this.twitterLogin()}><Image style={styles.loginSocialImage} source={require('../../assets/images/twitter.png')} /></TouchableOpacity>
						<TouchableOpacity onPress={() => this.googleLogin()}><Image style={styles.loginSocialImage} source={require('../../assets/images/googleplus.png')} /></TouchableOpacity>
					</View>
					<View style={styles.newUserWrapper}>
						<TouchableOpacity><Text>New User! </Text></TouchableOpacity>
						<Text>then </Text>
						<TouchableOpacity onPress={() => this.navigateToRegister()}><Text style={styles.primaryColor}>SIGN UP </Text></TouchableOpacity>
					</View>
				</View>
			)
		}
	}
	validateEmail(email) {
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
			return true;
		}
		return false;
	}

	validate() {
		var messages = [];
		messages.push(!this.state.username && 'Email required');
		messages.push(!this.state.password && 'Password required');
		if (this.state.username && !this.validateEmail(this.state.username)) {
			messages.push('Invalid Email');
		}

		messages = messages.filter((msg) => {
			if (msg) {
				return msg;
			}
		})
		this.setState({ errors: messages });
		if (messages.length > 0) {
			return false;
		}
		else {
			return true;
		}
	}

	async success(profile) {

		await AsyncStorage.setItem("roleid", profile.RoleId);
		await AsyncStorage.setItem("userid", profile.userid);
		await AsyncStorage.setItem("authToken", profile.AuthToken);
		await AsyncStorage.setItem("profile", JSON.stringify(profile));

		if (this.state.remember) {
			await AsyncStorage.setItem("rememberUsername", this.state.username);
			await AsyncStorage.setItem("rememberPassword", this.state.password);
		}

		if (this.state.role == 2) {
			this.props.navigation.navigate('RealEstateHome')
		}
		else if (this.state.role == 3) {
			this.props.navigation.navigate('CompanyHome')
		}
		else if (this.state.role == 4) {
			this.props.navigation.navigate('InspectorHome')
		}
		this.setState({ loading: false });
	}



	Login = async () => {
		if (!this.state.username) {
			this.common.showToast('Please Enter your Email ID')
			this.email.focus()
		}
		else if (this.state.username && !this.common.validateEmail(this.state.username)) {
			this.common.showToast('Please enter valid Email ID');
			this.email.focus()
		}
		else if (!this.state.password) {
			this.common.showToast('Please Enter your Password')
			this.password.focus()
		}
		else {
			this.setState({ loading: true });
			await this.getRequestData().then(data => {
				console.log("login request: ", data);
				var response = new API('Login', data).getResponse();
				console.log("login result: ", response);
				response.then(result => {
					if (result.statuscode == 200 && result.result.userid) {
						this.success(result.result);
					}
					else {
						var errors = [];
						errors.push(result.message);
						this.common.showToast(result.message)
						// this.setState({ errors: errors })
						this.setState({ loading: false });
					}
				})
			});
		}
	}

	async getRequestData() {
		const deviceId = await AsyncStorage.getItem("deviceId");
		const fcmToken = await AsyncStorage.getItem("fcmToken");

		return {
			"username": this.state.username,
			"password": this.state.password,
			"roleid": this.state.role
		}
	}




	render() {
		if (this.state.loading) {
			return <Loader />
		}
		return (
			<ScrollView>
				<View>
					<View style={styles.loginTopContainer}>
						<View style={styles.loginSearchIconWrapper}>
							<Image style={styles.loginSearchIcon} resizeMode="contain" source={require('../../assets/images/search.png')} />
						</View>
					</View>
					<View style={styles.loginCardContainer}>
						<Card style={styles.loginCard}>
							<View style={[styles.wid100, styles.loginCardWraper]}>
								<View style={styles.center}>
									<View style={styles.loginTextWrapper}><Text style={styles.loginText}>LOGIN</Text></View>
								</View>
								<View style={styles.loginFormWrapper}>
									<Form>
										<Errors errors={this.state.errors} />
										<Item>
											<Icon active name='person' style={styles.greyColor} />
											<Input autoCompleteType="off" ref={email => { this.email = email }} placeholder="Email" value={this.state.username} onChangeText={(text) => this.setState({ 'username': text })} style={styles.font15} />
										</Item>
										<Item>
											<Icon name='lock' style={styles.greyColor} />
											<Input autoCompleteType="off" ref={password => { this.password = password }} secureTextEntry={true} value={this.state.password} placeholder=" Password" onChangeText={(text) => this.setState({ 'password': text })} style={styles.font15} />
										</Item>
									</Form>
								</View>
								<View style={[styles.rememberAndForgotWrapper]}>
									<View style={styles.row}>
										<CheckBox checked={this.state.remember} onPress={() => this.setState({ remember: !this.state.remember })} checkedColor="#28558E" size={16} containerStyle={styles.loginContainerStyle} color="#808080" style={styles.loginCheckbox} />
										<Text style={[styles.greyColor, styles.font14]}>Remember Me</Text>
									</View>
									<View>
										<TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword', { role: this.state.role })}>
											<Text style={[styles.greyColor, styles.font14]}>Forgot Password?</Text>
										</TouchableOpacity>
									</View>
								</View>
								<View style={styles.center}>
									<Button style={styles.loginButton} onPress={() => this.Login()}>
										<Text style={styles.textCenter}>Login</Text>
									</Button>
								</View>
							</View>
						</Card>
					</View>
					<View style={styles.loginBottomContainer}>
						<View style={styles.loginFooter}>
							{this.printFooter()}
						</View>
					</View>
				</View>
				<Notification />
			</ScrollView>
		);
	}
}