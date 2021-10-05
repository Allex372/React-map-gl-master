import React, {useRef, useState, useCallback} from "react";
import ReactMapGL, {Marker, Popup, Source, Layer, FlyToInterpolator} from 'react-map-gl';
import * as parkData from './data/Public_data.json';
import './App.css';
import marker_img from './img/marker.png';
// import ControlPanel from './control-panels';
// import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from './layers';

function App() {
    const token = 'pk.eyJ1IjoiYWxsZXgzNzIiLCJhIjoiY2t0OXRtYzlyMGJ1YzJ3bXdvN2c0Nmk2aiJ9.Z6G1NqH0YDqKwlBY11HzEA'

    const [viewport, setViewport] = useState({
        latitude: 49.8382600,
        longitude: 24.0232400,
        width: '100vw',
        height: '100vh',
        zoom: 10
    })

    const [selectedPark, setSelectedPark] = useState(null)

    const onSelectCity = useCallback(({longitude, latitude}) => {
        setViewport({
            longitude,
            latitude,
            zoom: 11,
            transitionInterpolator: new FlyToInterpolator({speed: 1.2}),
            transitionDuration: 'auto'
        });
    }, []);

    return <div>
        <ReactMapGL
            {...viewport}
            mapboxApiAccessToken={token}
            mapStyle='mapbox://styles/allex372/ckuchzkr720zt18qj1zvyihev'
            onViewportChange={viewport => {
                setViewport(viewport)
            }}>

            {/********************MARKER WITH POPUP VARIANT***************************/}


            {
                parkData.features.map(water => (
                    <Marker longitude={water.geometry.coordinates[0][0][0][0]} latitude={water.geometry.coordinates[0][0][0][1]}>
                        <button className='marker-btn'
                                onClick={event => {
                                    event.preventDefault()
                                    setSelectedPark(water)
                                }}>
                            <img src={marker_img} alt='marker-of-water'/>
                        </button>
                    </Marker>
                ))
            }

            {selectedPark ? (
                <Popup longitude={selectedPark.geometry.coordinates[0][0][0][0]}
                       latitude={selectedPark.geometry.coordinates[0][0][0][1]}
                       onClose={() => {
                           setSelectedPark(null)
                       }}
                >
                    <div>
                        <h2>{selectedPark.properties.name}</h2>
                        <p>{selectedPark.properties.area}</p>
                        <button className='apple-maps'><a href={`comgooglemaps://?center=${[selectedPark.geometry.coordinates[0][0][0][0],selectedPark.geometry.coordinates[0][0][0][1]]}&zoom=14&views=traffic`}>Open in Apple Maps</a></button>
                        <button className='google-maps'><a href={`//maps.apple.com/?q=${[selectedPark.geometry.coordinates[0][0][0][1],selectedPark.geometry.coordinates[0][0][0][0]]}`}>Open in Google Maps</a></button>
                        { console.log([selectedPark.geometry.coordinates[0][0][0][0],selectedPark.geometry.coordinates[0][0][0][1]]) }

                    </div>
                </Popup>
            ) : null}

            {/********************MARKER WITH POPUP VARIANT***************************/}


            {/*************** CLUSTERS VARIANT(FROM BIG TO SMALL***************/}


            {/*<Source*/}
            {/*    id="earthquakes"*/}
            {/*    type="geojson"*/}
            {/*    data="https://opendata.arcgis.com/datasets/0ea2af5b110045a28f500a0ba6a1b4a0_0.geojson"*/}
            {/*    cluster={true}*/}
            {/*    clusterMaxZoom={15}*/}
            {/*    clusterRadius={50}*/}
            {/*>*/}
            {/*    <Layer {...clusterLayer} />*/}
            {/*    <Layer {...clusterCountLayer} />*/}
            {/*    <Layer {...unclusteredPointLayer} />*/}
            {/*</Source>*/}

            {/*************** CLUSTERS VARIANT(FROM BIG TO SMALL***************/}

        </ReactMapGL>
    </div>
}

export default App;
