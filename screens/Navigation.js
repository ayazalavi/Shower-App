import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Listing from "./Listing";
import QR from "./QR";
import Settings from "./Settings";

const { Navigator, Screen } = createStackNavigator();

const HomeNavigator = () => (
	<Navigator headerMode="none" initialRouteName="listing">
		<Screen name="qr" component={QR} />
		<Screen name="listing" component={Listing} />
		<Screen name="settings" component={Settings} />
	</Navigator>
);

export const AppNavigator = () => (
	<NavigationContainer>
		<HomeNavigator />
	</NavigationContainer>
);
