import React, { useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Button } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import { Actions } from "react-native-router-flux";
import { getData, storeData } from "./data";
export default function QR(props) {
	var scanner = useRef(null);

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
								console.log("duplicate product");
								scanner.current.reactivate();
								return;
							}
						}
						value[value.length] = scannedProduct;
					} else {
						value = [scannedProduct];
					}
					storeData(value, "products").then(function () {
						//scanner.current.reactivate();
						Actions.listing({ param1: value });
					});
				});
			}
		} catch (e) {
			console.log(e);
		}
	};

	getData("products").then(function (value) {
		if (value != null) {
			//console.log(scanner);

			Actions.listing({ param1: value });
		}
	});
	return (
		<QRCodeScanner
			onRead={this.onSuccess}
			flashMode={RNCamera.Constants.FlashMode.auto}
			reactivate={false}
			ref={scanner}
			bottomContent={
				<Button
					style={styles.submitButton}
					title="Go To Products Listing"
					onPress={() => {
						getData("products").then(function (value) {
							if (value != null) {
								//scanner.current.reactivate();
								Actions.listing({ param1: value });
							}
						});
					}}
				/>
			}
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	input: {
		margin: 15,
		height: 40,
		borderColor: "#cccccc",
		borderWidth: 1,
	},
	submitButton: {
		backgroundColor: "#cccccc",
		padding: 10,
		margin: 15,
		height: 40,
	},
	submitButtonText: {
		color: "white",
	},
});
