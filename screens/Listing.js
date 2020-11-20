import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Actions } from "react-native-router-flux";
import { getData } from "./data";
import {
	Icon,
	Layout,
	TopNavigation,
	TopNavigationAction,
	Button,
	List,
	ListItem,
} from "@ui-kitten/components";

const CameraIcon = (props) => <Icon {...props} name="camera" />;

ListAccessoriesShowcase = () => {};

export default function Listing({ navigation }) {
	const renderRightActions = () => (
		<React.Fragment>
			<TopNavigationAction
				icon={CameraIcon}
				onPress={() => {
					navigation.navigate("qr");
				}}
			/>
		</React.Fragment>
	);
	const renderItemAccessory = (props) => {
		return (
			<Button
				size="tiny"
				onPress={() => {
					navigation.navigate("settings");
				}}
			>
				Settings
			</Button>
		);
	};

	const renderItem = ({ item, index }) => {
		console.log(item);
		return (
			<ListItem
				title={`Product ${item.product_id}`}
				description={`time: ${item.time}, Product ID: ${item.product_id}`}
				accessoryRight={() => (
					<Button
						size="tiny"
						onPress={() => {
							navigation.navigate("settings", { product: item });
						}}
					>
						Settings
					</Button>
				)}
			/>
		);
	};

	const [products, setProducts] = useState([]);

	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			getData("products").then(function (value) {
				setProducts(value);
			});
		});
		return unsubscribe;
	}, [navigation]);

	return (
		<Layout style={styles.container} level="1">
			<TopNavigation
				alignment="center"
				title="Product Listing"
				subtitle="Select shower to update its settings"
				accessoryRight={renderRightActions}
			/>
			<List data={products} renderItem={renderItem} />
		</Layout>
	);
	/* 	return (
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
	); */
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 20,
	},
	/* container: {
		padding: 20,
		marginTop: 3,
		borderBottomColor: "#cccccc",
		borderBottomWidth: 2,
	}, */
	text: {
		color: "#4f603c",
		fontSize: 20,
	},
});
