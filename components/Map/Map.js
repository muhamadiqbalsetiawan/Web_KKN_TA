import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function Map() {
    return (
        // Pakai Position dari Google Maps
        <MapContainer className="w-full h-64 md:h-96 z-0" center={[0.5658613815513727, 113.67062264422545]} zoom={4} scrollWheelZoom={true}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[-6.924262745129648, 107.47997368430184]}>
                <Popup>
                    Kabupaten Bandung Barat
                </Popup>
                
            </Marker>
            <Marker position={[-6.562011114133785, 107.76093560600587]}>
                <Popup>
                    Subang
                </Popup>
            </Marker>
            <Marker position={[-7.084913106274536, 107.44702610146295]}>
                <Popup>
                    Kabupaten Bandung
                </Popup>
            </Marker>
            <Marker position={[-7.966632539492749, 110.59633530591144]}>
                <Popup>
                    Yogyakarta
                </Popup>
            </Marker>
            <Marker position={[-6.988344022355765, 110.34159902763339]}>
                <Popup>
                    Semarang
                </Popup>
            </Marker>
            <Marker position={[-3.200128872600369, 119.68903313700532]}>
                <Popup>
                    Tana Toraja
                </Popup>
            </Marker>
            <Marker position={[-8.613584360813391, 116.08658597889813]}>
                <Popup>
                    Mataram
                </Popup>
            </Marker>
            <Marker position={[3.605932906703484, 98.72108755086518]}>
                <Popup>
                    Medan
                </Popup>
            </Marker>
            <Marker position={[-6.177153328760311, 106.15301103765442]}>
                <Popup>
                    Banten
                </Popup>
            </Marker>
            <Marker position={[3.137808689151334, 101.6886744610846]}>
                <Popup>
                    Malaysia
                </Popup>
            </Marker>
            <Marker position={[34.68947200828878, 135.48466376749514]}>
                <Popup>
                    Jepang
                </Popup>
            </Marker>
        </MapContainer>
    )
}