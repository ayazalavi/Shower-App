import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
	//ActivityIndicator,
	Modal,
	Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getData, storeData } from "./data";
import { Actions } from "react-native-router-flux";
import { BleManager } from "react-native-ble-plx";
import base64 from "react-native-base64";

var bluetooth_on = false;
export default function Settings(props) {
	const [time, setTime] = useState(props.product.time);
	const [password, setPassword] = useState(props.product.password);
	const [processing, setProcessing] = useState(false);
	const [message, setMessage] = useState("");
	const [cdevice, setCdevice] = useState(null);
	const [poweredOff, setPoweredOff] = useState(false);
	const [resetSubscription, setResetSubscription] = useState(false);

	let manager = new BleManager();
	let service = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
	let characteristicW = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
	useEffect(() => {
		// Update the document title using the browser API
		if (Platform.OS === "ios") {
			//alert(1);
			manager.onStateChange((state) => {
				if (state === "PoweredOn") {
					//scanAndConnect();
					//subscription.remove();
					bluetooth_on = true;
				} else if (state === "PoweredOff") {
					bluetooth_on = false;
					//setMessage("Bluetooth is off, please turn it on...");
					//setResetSubscription(true);
				}
			}, true);
			return () => {
				//subscription.remove();
			};
		} else {
			//scanAndConnect();
		}
	}, []);

	scanAndConnect = async () => {
		//alert(1);
		let state = await manager.state();
		if (state == "PoweredOff") {
			setMessage(
				"Bluetooth is off, please turn it on and click submit again..."
			);
			console.log(
				"Bluetooth is off, please turn it on and click submit again..."
			);
			return;
		}
		// let devices = await manager.connectedDevices([service]);
		// if (devices.length > 0) {

		// }
		//setProcessing(true);
		setMessage("Scanning for devices...");
		console.log("Scanning for devices...");
		manager.startDeviceScan([service], null, (error, device) => {
			if (error) {
				//setProcessing(false);
				//setResetSubscription(true);
				//setMessage(error.message);
				console.log("scan error: " + error);
				scanAndConnect();
				return;
			}

			if (device.name === "Long name works now") {
				device.isConnected().then((connected) => {
					manager.stopDeviceScan();
					if (connected) {
						setMessage("Sending data ...");
						console.log("Sending data ...");

						writeData(device).then(
							(device) => {
								setMessage("Sent.");
								console.log("Sent.");
								setTimeout(() => {
									setProcessing(false);
								}, 500);
							},
							(error) => {
								scanAndConnect();
								console.log("write: " + error);
							}
						);
					} else {
						setMessage("Connecting to " + device.name);
						console.log("Connecting to " + device.name);
						connectToDevice(device).then(
							(device) => {
								console.log("Discovering services and characteristics");
								setMessage("Sending data ...");
								writeData(device).then(
									(device) => {
										setMessage("Sent.");
										console.log("Sent.");

										setTimeout(() => {
											setProcessing(false);
										}, 500);
									},
									(error) => {
										scanAndConnect();
										console.log("write: " + error);
									}
								);
							},
							(error) => {
								//setResetSubscription(true);
								scanAndConnect();
								console.log("device: " + error);
							}
						);
					}
				});

				// manager.cancelDeviceConnection(device.id).then(
				// 	() => {
				// 		console.log("cancelled");
				// 	},
				// 	(error) => {
				// 		console.log("error cancelling");
				// 	}
				// );
			}
		});
	};

	sendData = () => {
		manager.startDeviceScan([service], null, (error, device) => {
			if (error) {
				console.log("error", JSON.stringify(error));
			} else if (device) {
				if (device.localName === "Long name works now") {
					manager.stopDeviceScan();
					//localScanChange(false);
					device
						.isConnected()
						.then((bool) => console.log("isConnected0", bool));
					manager
						.isDeviceConnected(device.id)
						.then((bool) => console.log("isConnectedM0", bool));
					device
						.connect()
						.then(() => {
							device
								.isConnected()
								.then((bool) => console.log("isConnected1", bool));
							manager
								.isDeviceConnected(device.id)
								.then((bool) => console.log("isConnectedM1", bool));
							writeData(device).then(() => {
								setMessage("Sent");
								setTimeout(() => {
									setProcessing(false);
								}, 500);
							});
						})
						.then(() => {
							//setConnectedDevice(device);
							console.log("connected");
						});
					const sub = device.onDisconnected((error, device) => {
						console.log("disconnected");
						setProcessing(false);
						//setConnectedDevice(null);
						//sub.remove();
					});
				}
			}
		});
	};
	connectToDevice = async (device_) => {
		//await manager.cancelDeviceConnection(device_.id);
		let device = await manager.connectToDevice(device_.id);
		let connected = await device.isConnected();
		if (connected) {
			return device;
		} else {
			throw "Device not connected";
		}
	};
	writeData = async (device) => {
		await device.discoverAllServicesAndCharacteristics();
		const services = await device.services();
		const charactertistics = await device.characteristicsForService(
			services[0].uuid
		);
		//const connected = await device.isConnected();
		const characteristic = await device.writeCharacteristicWithResponseForService(
			services[0].uuid,
			charactertistics[0].uuid,
			base64.encode(
				`{time: ${time}, password: ${password}, product_id: ${props.product.product_id}}`
			)
		);
		console.log(services);
		console.log(charactertistics);
		console.log(services[0].uuid);
		console.log(charactertistics[0].uuid);
		//console.log(connected);
		console.log(characteristic);
		return characteristic;
	};

	setupNotifications = async (device) => {
		const connected = await device.isConnected();
		await device.discoverAllServicesAndCharacteristics();
		const services = await device.services();
		const charactertistics = await device.characteristicsForService(
			services[0].uuid
		);

		console.log(services);
		console.log(charactertistics);
		console.log(services[0].uuid);
		console.log(charactertistics[0].uuid);
		return device;
	};

	return (
		<View style={styles.container}>
			<Modal animationType="slide" transparent={true} visible={processing}>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>{message}</Text>
					</View>
				</View>
			</Modal>
			{/* <View style={[styles.container_1, styles.horizontal]}>
				<ActivityIndicator
					size="small"
					color="#0000ff"
					animating={processing}
				/>
			</View> */}
			<TextInput
				style={styles.input}
				underlineColorAndroid="transparent"
				placeholder="Password"
				placeholderTextColor="#ccc"
				autoCapitalize="none"
				secureTextEntry={true}
				maxLength={5}
				value={password}
				onChangeText={(text) => setPassword(text)}
				keyboardType="number-pad"
			/>

			<Picker
				selectedValue={time}
				style={styles.picker}
				onValueChange={
					(itemValue, itemIndex) => {
						setTime(itemValue);
					}
					//this.setState({ language: itemValue })
				}
			>
				<Picker.Item label="15 min" value="15" />
				<Picker.Item label="30 min" value="30" />
				<Picker.Item label="45 min" value="45" />
				<Picker.Item label="60 min" value="60" />
			</Picker>

			<TouchableOpacity
				style={styles.submitButton}
				onPress={() => {
					if (password.length == 5) {
						setProcessing(true);
						setMessage("Saving Data ...");
						getData("products").then(function (value) {
							if (value != null) {
								for (val in value) {
									if (value[val].product_id === props.product.product_id) {
										console.log("duplicate product");
										value[val].time = time;
										value[val].password = password;
										storeData(value, "products").then(function () {
											//scanner.current.reactivate();
											setMessage("Sending Data ... ");
											//console.log();
											sendData();
											// writeData(cdevice).then(() => {
											// 	setMessage("Sent.");
											// 	manager.cancelDeviceConnection(cdevice.id).then(
											// 		() => {
											// 			console.log("cancelled");
											// 		},
											// 		(error) => {
											// 			console.log("error cancelling");
											// 		}
											// 	);
											// 	Actions.pop();
											// });
										});
										return;
									}
								}
							}
						});
					}
				}}
			>
				<Text style={styles.submitButtonText}> Submit </Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 23,
	},
	input: {
		marginHorizontal: 15,
		height: 40,
		borderColor: "#cccccc",
		borderWidth: 1,
		paddingHorizontal: 10,
	},
	picker: {
		height: 200,
	},
	submitButton: {
		backgroundColor: "blue",
		padding: 10,
		margin: 15,
		height: 40,
	},
	submitButtonText: {
		color: "white",
	},
	container_1: {
		flex: 1,
		justifyContent: "center",
		position: "absolute",
	},
	horizontal: {
		flexDirection: "row",
		justifyContent: "space-around",
		padding: 10,
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	openButton: {
		backgroundColor: "#F194FF",
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
	},
});
