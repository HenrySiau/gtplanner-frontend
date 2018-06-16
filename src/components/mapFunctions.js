import settings from '../config';

export function makeMarker(markerInfo, onClick) {
    let marker = new window.google.maps.Marker({
        id: markerInfo.id,
        position: markerInfo.position,
        title: markerInfo.title,
        icon: markerInfo.icon,
        map: markerInfo.map,
        coverImageUrl: markerInfo.coverImageUrl,
        description: markerInfo.description,
    });
    marker.addListener('click', function () {
        // window.map.panTo(this.position);
        if (window.activeMarker != this) {
            if (window.activeMarker) {
                window.activeMarker.setIcon(window.googleMapDefaultIcon);
            }
            populateInfoWindow(marker, window.googleMapInfoWindow, window.map);
            this.setIcon(window.googleMapHighlightedIcon);
            window.activeMarker = this;
        }else{
            populateInfoWindow(marker, window.googleMapInfoWindow, window.map);
            this.setIcon(window.googleMapHighlightedIcon);
        }
        // markerInfo.updateFocusedIdea(markerInfo.id);
        onClick(markerInfo.id);
    });
    marker.addListener('mouseover', function () {
        this.setIcon(window.googleMapHighlightedIcon);
    });
    marker.addListener('mouseout', function () {
        if (window.activeMarker !== marker) {
            this.setIcon(window.window.googleMapDefaultIcon);
        }
    });
    return marker
}

export function makeMarkerIcon(markerColor) {
    var markerImage = new window.google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new window.google.maps.Size(21, 34),
        new window.google.maps.Point(0, 0),
        new window.google.maps.Point(10, 34),
        new window.google.maps.Size(21, 34));
    return markerImage;
}

export function populateInfoWindow(marker, infoWindow, map) {
    let content = `<div style="width: 100px, margin: 0">
    <h4>${marker.title}</h4>
    <img src="${marker.coverImageUrl}" alt="" style="width: 100px"/>
    </div>`;

    infoWindow.setContent(content);
    infoWindow.open(map, marker);
}

export function populateMarkers(ideas, onClick, map) {
    ideas.forEach(idea => {
        let marker = window.markers.get(idea.id);
        if (!marker) {
            let markerInfo = {
                id: idea.id,
                position: { lat: Number(idea.lat), lng: Number(idea.lng) },
                title: idea.title,
                icon: window.googleMapDefaultIcon,
                map: map,
                coverImageUrl: settings.imageServerUrl + settings.imagePath + idea.coverImage,
                description: idea.description,
                // updateFocusedIdea: updateFocusedIdea
            }
            marker = makeMarker(markerInfo, onClick);
            window.markers.set(idea.id, marker);
            window.googleMapBounds.extend(markerInfo.position);
        } else {
            marker.setMap(map);
            window.googleMapBounds.extend(marker.position);
        }
    });
    map.fitBounds(window.googleMapBounds);
}

export function populateMarker(idea, onClick, map) {
    let markerInfo = {
        id: idea.id,
        position: { lat: Number(idea.lat), lng: Number(idea.lng) },
        title: idea.title,
        icon: window.googleMapDefaultIcon,
        map: map,
        coverImageUrl: settings.imageServerUrl + settings.imagePath + idea.coverImage,
        description: idea.description,
    }
    let marker = makeMarker(markerInfo, onClick);
    window.markers.set(idea.id, marker);
    window.googleMapBounds.extend(markerInfo.position);
    map.fitBounds(window.googleMapBounds);
}

export function clearMarkers(markerMap) {
    markerMap.forEach(((value, key) => {
        value.setMap(null);
    }));

}