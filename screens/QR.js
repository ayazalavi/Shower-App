import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import { Actions } from "react-native-router-flux";
import { getData, storeData } from "./data";
import {
	Icon,
	Layout,
	MenuItem,
	OverflowMenu,
	TopNavigation,
	TopNavigationAction,
	Button,
	List,
	ListItem,
} from "@ui-kitten/components";
//import { Button } from "react-native-ui-kitten";

export default function QR({ navigation }) {
	var scanner = useRef(null);
	const [message, setMessage] = useState("");

	const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
	const renderBackAction = () => (
		<TopNavigationAction
			icon={BackIcon}
			onPress={() => {
				navigation.goBack();
			}}
		/>
	);

	onSuccess = (e) => {
		try {
			let scannedProduct = JSON.parse(e.data);
			if (scannedProduct.product_id !== undefined) {
				scannedProduct.time = 15;
				scannedProduct.password = "";
				getData("products").then(function (value) {
					if (value != null) {
						for (val in value) {
							if (value[val].product_id === scannedProduct.product_id) {
								setMessage("This product already exists");
								setTimeout(() => {
									scanner.current.reactivate();
									setMessage("");
								}, 2000);
								return;
							}
						}
						value[value.length] = scannedProduct;
					} else {
						value = [scannedProduct];
					}
					storeData(value, "products").then(function () {
						//scanner.current.reactivate();
						//Actions.listing({ param1: value });
						navigation.goBack();
					});
				});
			}
		} catch (e) {
			console.log(e);
		}
	};

	/* getData("products").then(function (value) {
		if (value != null) {
			//console.log(scanner);
			//Actions.listing({ param1: value });
			navigation.navigate("listing", { param1: value });
		}
	}); */
	return (
		<Layout style={styles.container} level="1">
			<Modal
				animationType="slide"
				transparent={true}
				visible={message.length > 0}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>{message}</Text>
					</View>
				</View>
			</Modal>
			<TopNavigation
				alignment="center"
				title="Scan QR code"
				subtitle="Add product to app by scanning its QR code"
				accessoryLeft={renderBackAction}
			/>
			<QRCodeScanner
				onRead={this.onSuccess}
				flashMode={RNCamera.Constants.FlashMode.auto}
				reactivate={false}
				ref={scanner}
				style={styles.qrscanner}
				/* bottomContent={
					//<Button>BUTTON</Button>}

					<Button
						onPress={() => {
							getData("products").then(function (value) {
								if (value != null) {
									//scanner.current.reactivate();
									//Actions.listing({ param1: value });
									navigation.navigate("listing", { param1: value });
								}
							});
						}}
					>
						Go To Products Listing
					</Button>
				} */
			/>
		</Layout>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 20,
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
	},
	qrscanner: {
		height: "100%",
		flex: 1,
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
	modalText: {
		marginBottom: 15,
		textAlign: "center",
	},
});
