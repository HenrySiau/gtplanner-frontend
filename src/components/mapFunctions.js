export function makeMarker(markerInfo) {
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
            console.log('you clicked different marker');
            if (window.activeMarker) {
                window.activeMarker.setIcon(window.googleMapDefaultIcon);
            }
            populateInfoWindow(marker, window.googleMapInfoWindow, window.map);
            this.setIcon(window.googleMapHighlightedIcon);
            window.activeMarker = this;
        }
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
