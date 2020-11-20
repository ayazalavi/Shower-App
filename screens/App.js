import { StatusBar } from "expo-status-bar";
import React from "react";
/* import Listing from "./Listing";
import QR from "./QR";
import Settings from "./Settings";
import { Router, Scene } from "react-native-router-flux"; */

import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { AppNavigator } from "./Navigation";

export default function App() {
	return (
		<>
			<IconRegistry icons={EvaIconsPack} />
			<ApplicationProvider {...eva} theme={eva.light}>
				<AppNavigator />
			</ApplicationProvider>
		</>
	);
}

/* export default function App() {
	return (
		//<ApplicationProvider {...eva} theme={eva.light}>
		<Router>
			<Scene key="root">
				<Scene key="qr" component={QR} title="qr" initial={true} />
				<Scene key="listing" component={Listing} title="listing" />
				<Scene key="settings" component={Settings} title="settings" />
			</Scene>
		</Router>
		//</ApplicationProvider>
	);
} */
