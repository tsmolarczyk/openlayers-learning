import Map from "ol/Map";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import Overlay from "ol/Overlay";
import { DragRotate, Draw } from "ol/interaction";
import * as condition from "ol/events/condition";
import { GeoJSON } from "ol/format";
import {
  defaults,
  FullScreen,
  MousePosition,
  OverviewMap,
  ZoomSlider,
  ZoomToExtent,
} from "ol/control";
import { Tile } from "ol/layer";
import { ScaleLine } from "ol/control";

window.onload = init;

function init() {
  const fullScreenControl = new FullScreen();
  const mousePosition = new MousePosition();
  const overViewMapControl = new OverviewMap({
    collapsed: false,
    layers: [
      new Tile({
        source: new OSM(),
      }),
    ],
  });

  const scaleLineControl = new ScaleLine({});
  const zoomSliderControl = new ZoomSlider();
  const zoomToExtentControl = new ZoomToExtent();

  const map = new Map({
    view: new View({
      center: [-12080385, 7567433],
      zoom: 4,
      maxZoom: 60,
      minZoom: 2,
      rotation: 0,
    }),
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    target: "js-map",
    keyboardEventTarget: document,
    controls: defaults().extend([
      fullScreenControl,
      mousePosition,
      overViewMapControl,
      scaleLineControl,
      zoomSliderControl,
      zoomToExtentControl,
    ]),
  });

  const popupContainerElement = document.getElementById("popup-coordinates");
  const popup = new Overlay({
    element: popupContainerElement,
    positioning: "center-left",
  });
  map.addOverlay(popup);
  map.on("click", (e) => {
    const clickedCoordinates = e.coordinate;
    popup.setPosition(undefined);
    popup.setPosition(clickedCoordinates);
    popupContainerElement.innerHTML = clickedCoordinates;
  });

  // DragRotate Interaction
  const dragRotateInteraction = new DragRotate({
    condition: condition.altKeyOnly,
  });

  map.addInteraction(dragRotateInteraction);

  // Draw interaction
  const drawInteraction = new Draw({
    type: "Polygon",
    freehand: false,
  });
  map.addInteraction(drawInteraction);

  drawInteraction.on("drawend", (e) => {
    let parser = new GeoJSON();
    let drawnFeatures = parser.writeFeatureObject(e.feature);
    console.log(drawnFeatures);
  });
}
