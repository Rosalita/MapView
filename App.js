import React from 'react';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { Dimensions, StyleSheet, View } from 'react-native';

export default class App extends React.Component {

  state = {
    location: null,
    whereAmIName: null,
    whereAmIPostcode: null,
    workLocation: null,
  }

  getLocation = async () => {
    const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      const workLocation = (await Location.geocodeAsync("NE12 8BU"))[0]
      this.setState({ workLocation });

      const location = await Location.getCurrentPositionAsync({});
      this.setState({ location });

      const whereAmI = (await Location.reverseGeocodeAsync(location.coords))[0]
      this.setState({ whereAmIName: whereAmI.name });
      this.setState({ whereAmIPostcode: whereAmI.postalCode })

    } else {
      alert('Location permission not granted, enable location for this app to work correctly');
    }
  }

  componentDidMount() {
    this.getLocation();

  }

  render() {
    if (!this.state.location) {
      return (<View />)
    }
    return (
      <View style={styles.container}>
        <MapView style={styles.mapStyle}
          initialRegion={{
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}>
          <Marker
            title="You are here"
            description={`${this.state.whereAmIName} ${this.state.whereAmIPostcode}`}
            coordinate={this.state.location.coords}
          />
          <Marker
            title="Work"
            coordinate={this.state.workLocation}
            pinColor="green"
          />
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
