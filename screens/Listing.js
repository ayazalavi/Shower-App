import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Actions } from "react-native-router-flux";
import { getData } from "./data";

export default function Listing(props) {
	const [products, setProducts] = useState(props.param1);
	getData("products").then(function (value) {
		setProducts(value);
	});
	return (
		<View>
			{products.map((item, index) => (
				<TouchableOpacity
					key={item.product_id}
					style={styles.container}
					onPress={() => Actions.settings({ product: item })}
				>
					<Text style={styles.text}>
						Product {item.product_id}, time: {item.time}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		marginTop: 3,
		borderBottomColor: "#cccccc",
		borderBottomWidth: 2,
	},
	text: {
		color: "#4f603c",
		fontSize: 20,
	},
});
