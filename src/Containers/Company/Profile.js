import React, {Component} from 'react';
import {Platform, StyleSheet, View, ScrollView, Image, Alert, TouchableOpacity, AsyncStorage} from 'react-native';
import styles from '../../../assets/styles/style.js';
import { Container, Header, Content, Button, Card, CardItem, Right,
	 Text, Body, Form, Item } from 'native-base';
import { CheckBox, Avatar, Input, Icon  } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import Errors from '../../Components/Errors';
import Loader from '../../Components/Loader';
import Common from '../../Containers/Common';
import Logout from '../../Components/Logout';

export default class Profile extends Component {
	constructor(props) {
        super(props)
        this.state = {
			avatarSource: '',
            errors:[],
            profilePic: '',
			fname: '',
			lname: '',
			email: '',
			phone: '',
			companyName: '',
			companyEmail: '',
            companyPhone: '',
            address: '',
            state: '',
            city: '',
            zipcode: '',
            inspectionType: '',
            bio: '',
            password: '',
            confirmPassword: '',
            availability: false,
            distance: 1,
            inspectionState: '',
            inspectionCity: '',
			role: 3,
            stateList: [],
            cityList: [],
            inspectioncityList: [],
            inspectionZipcode: '',
            loading: false,
            submit: false,
        }
        this.common = new Common();
    }
    
    componentDidMount() {
        this.setProfile()
    }

    async setProfile() {
        var profile = JSON.parse(await AsyncStorage.getItem("profile"));
        console.log('dfjsfj', profile);
        this.setState({
            fname: profile.Fname,
            lname: profile.Lname,
            title: profile.Title,
            email: profile.EmailId,
            phone: profile.MobileNumber,
            agencyName: profile.AgencyName,
            assistantName: profile.AssistanceName,
            assistantEmail: profile.AssistanceEmail,
			address: profile.Address,
			avatarSource: { uri: profile.ProfilePic },
			agencyName: profile.AgencyName,
        })
    }
    
    
  render() {
	  
	if(this.state.loading) {
		return <Loader />
	}
	var fname = !this.state.fname && this.state.submit ? true : false;
	var lname = !this.state.lname && this.state.submit ? true : false;
	var title = !this.state.title && this.state.submit ? true : false;
	var email = !this.state.email && this.state.submit ? true : false;
	var phone = !this.state.phone && this.state.submit ? true : false;
	var agencyName = !this.state.agencyName && this.state.submit ? true : false;
	var assistantName = !this.state.assistantName && this.state.submit ? true : false;
	var assistantEmail = !this.state.assistantEmail && this.state.submit ? true : false;
	var address = !this.state.address && this.state.submit ? true : false;
	
    return (
    	<ScrollView
		ref='_scrollView'
        onContentSizeChange={() => { this.refs._scrollView.scrollTo({x: 0, y: 0, animated: true}); }}
		>
	        <View style={styles.container}>
	        	<View style={styles.registerImageContainer}>
                    <Logout />
					<Avatar 
						size={100} 
						overlayContainerStyle={{backgroundColor:'#FFF'}} 
						rounded icon={{name: 'person', color: '#C39666', size:72}} 
						containerStyle={{borderColor:'#C39666',borderWidth:2}}
						source={this.state.avatarSource}
						imageProps={{resizeMode: 'cover'}}
						source={this.state.avatarSource}
                        showEditButton
                        
					/>
                </View>
				<View style={styles.registerFormContainer}>
					<Form>
						<Errors errors={this.state.errors} />
						<View style={styles.twoRow}>
							<Item style={[styles.formItem, styles.halfRow]}>
								<Input disabled inputContainerStyle={fname && styles.inputError} rightIcon={fname && this.common.getIcon()} errorMessage={fname && "First Name required"} value={this.state.fname} onChangeText={(text) => this.setState({'fname': text})} placeholder="First Name" inputStyle={[styles.font15]}  />
							</Item>
							<Item style={[styles.formItem, styles.halfRow]}>
								<Input disabled inputContainerStyle={lname && styles.inputError} rightIcon={lname && this.common.getIcon()} errorMessage={lname && "Last Name required"} value={this.state.lname} onChangeText={(text) => this.setState({'lname': text})} placeholder="Last Name" inputStyle={[styles.font15]} />
							</Item>
						</View>
						
						<Item style={[styles.formItem]}>
							<Input disabled inputContainerStyle={email && styles.inputError} rightIcon={email && this.common.getIcon()} errorMessage={email && "Email required"} value={this.state.email} onChangeText={(text) => this.setState({'email': text})}  placeholder="Email" inputStyle={[styles.font15]}  />
						</Item>
						<Item style={[styles.formItem]}>
							<Input disabled inputContainerStyle={phone && styles.inputError} rightIcon={phone && this.common.getIcon()} errorMessage={phone && "Phone No required"} value={this.state.phone} onChangeText={(text) => this.setState({'phone': text})}  placeholder="Phone No" inputStyle={[styles.font15]}  />
						</Item>
						<Item style={[styles.formItem]}>
							<Input disabled inputContainerStyle={agencyName && styles.inputError} rightIcon={agencyName && this.common.getIcon()} errorMessage={agencyName && "Agency name required"} value={this.state.agencyName} onChangeText={(text) => this.setState({'agencyName': text})}  placeholder="Agency Name" inputStyle={[styles.font15]}  />
						</Item>
                        <Item style={[styles.formItem]}>
							<Input disabled inputContainerStyle={title && styles.inputError} rightIcon={title && this.common.getIcon()} errorMessage={title && "Title required"} value={this.state.title} onChangeText={(text) => this.setState({'title': text})}  placeholder="Title (Real State Agent, Broker, etc)" inputStyle={[styles.font15]}  />
						</Item>
                        <Item style={[styles.formItem]}>
							<Input disabled inputContainerStyle={address && styles.inputError} rightIcon={address && this.common.getIcon()} errorMessage={address && "Address required"} value={this.state.address} onChangeText={(text) => this.setState({'address': text})}  placeholder="Address" inputStyle={[styles.font15]}  />
						</Item>
						<Item style={[styles.formItem]}>
							<Input disabled inputContainerStyle={assistantName && styles.inputError} rightIcon={assistantName && this.common.getIcon()} errorMessage={assistantName && "Assistance name required"} value={this.state.assistantName} onChangeText={(text) => this.setState({'assistantName': text})}  placeholder="Assistance Name" inputStyle={[styles.font15]}  />
						</Item>
						<Item style={[styles.formItem]}>
							<Input disabled inputContainerStyle={assistantEmail && styles.inputError} rightIcon={assistantEmail && this.common.getIcon()} errorMessage={assistantEmail && "Assistance email required"} value={this.state.assistantEmail} onChangeText={(text) => this.setState({'assistantEmail': text})}  placeholder="Assistance Email" inputStyle={[styles.font15]}  />
						</Item>
						<TouchableOpacity>
                            <Text style={styles.heading}>Change Password</Text>
                        </TouchableOpacity>
						
					</Form>
				</View>
	        </View>
	    </ScrollView>
    );
  }
}