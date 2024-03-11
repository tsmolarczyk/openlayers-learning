import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import Overlay from 'ol//Overlay';
import {DragRotate, Draw} from 'ol/interaction';
import * as condition from 'ol/events/condition';

window.onload = init

function init() {
const map = new Map({
    view: new View({
        center: [-12080385, 7567433],
        zoom: 4,
        maxZoom: 60,
        minZoom: 2,
    }),
    layers: [
        new TileLayer({
            source: new OSM(),
        }),
    ],
    target: 'js-map',
    keyboardEventTarget: document
});

const popupContainerElement = document.getElementById('popup-coordinates');
const popup = new Overlay({
    element: popupContainerElement,
    positioning: "center-left"
})
    map.addOverlay(popup)
    map.on('click', e => {
        const clickedCoordinates = e.coordinate;
        popup.setPosition(undefined);
        popup.setPosition(clickedCoordinates);
        popupContainerElement.innerHTML = clickedCoordinates;
    })


    // DragRotate Interaction
    const dragRotateInteraction = new DragRotate({
        condition: condition.altKeyOnly
    });

    map.addInteraction(dragRotateInteraction)

    // Draw interaction
    const drawInteraction = new Draw({
        type: 'Polygon',
        freehand: true,
    })
    map.addInteraction(drawInteraction)
    
    drawInteraction.on("drawend", () =>console.log('finished drawing interaction'))

}
