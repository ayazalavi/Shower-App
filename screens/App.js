import { StatusBar } from "expo-status-bar";
import React from "react";
import Listing from "./Listing";
import QR from "./QR";
import Settings from "./Settings";
import { Router, Scene } from "react-native-router-flux";

export default function App() {
	return (
		<Router>
			<Scene key="root">
				<Scene key="qr" component={QR} title="qr" initial={true} />
				<Scene key="listing" component={Listing} title="listing" />
				<Scene key="settings" component={Settings} title="settings" />
			</Scene>
		</Router>
	);
}
