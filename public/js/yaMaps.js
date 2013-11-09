(function () {
    var map,
        clusterer,
        dealPlaceGeoObjects = [];

    function YaMapsWrapper(options) {
        initMap(options);
    }
    function initMap(options) {
        var localOptions = options || {};
        var deals = localOptions.deals || mskDeals;
        if (localOptions.coords) {
            console.log('coords');
            initMapWithCoords(localOptions.coords, deals);
        } else if (localOptions.locationString) {
            console.log('location');
            initMapWithString(localOptions.locationString, deals);
        } else {
            console.log('default');
            initMapWithString('Россия, Москва', deals);
        }
    }
    function initMapWithString(parseString, deals) {
        var myGeocoder = ymaps.geocode(parseString);
        myGeocoder.then(
            function (res) {
                coordsForCenter = res.geoObjects.get(0).geometry.getCoordinates();
                initMapWithCoords(coordsForCenter, deals);
            },
            function (err) {
                alert('Ошибка');
            }
        );
    }

    function initMapWithCoords(coordsForCenter, deals) {

        var myGeoObjects;
        console.log('center coords', coordsForCenter);
        map = new ymaps.Map('map', {center: coordsForCenter, zoom: 8});


        clusterer = new ymaps.Clusterer({
            gridSize: 150
        });

        dealPlaceGeoObjects = fillGeoObjectCollection(deals);

        clusterer.add(dealPlaceGeoObjects);
        console.log('clusta', clusterer);
        map.geoObjects.add(clusterer);
    }

    YaMapsWrapper.prototype = {

        changeCenter: function(options) {
            //TODO обработать все исключительные ситуации в аргументах, в частности отсутствие coords
            var localOptions = options || {};
            var deals = localOptions.deals || mskDeals;
            if (!map) {
                if (localOptions.coords) {
                    initMap(localOptions.coords, deals);
                } else if (localOptions.locationString) {
                    initMapWithString(localOptions.locationString, deals);
                } else {
                    initMapWithString('Россия, Москва', deals);
                }
            } else {
                map.setCenter(options.coords);
            }
        },

        resetGeoObjectCollection: function(newDealsObjects) {
            console.log('clusterer', clusterer);
            clusterer.remove(dealPlaceGeoObjects);

            dealPlaceGeoObjects = fillGeoObjectCollection(newDealsObjects);
            clusterer.add(dealPlaceGeoObjects);

            //Посмотреть изменяются ли объекты на карте
        }
    };


    function fillGeoObjectCollection (deals) {
        var dealPlaceGeoObjects = [];

        function processEveryDeal(deal) {
            var addresses = deal.addresses;

            for (var i = addresses.length - 1; i >= 0; i--) {
                processEveryAddress(addresses[i], deal);
            }
        }

        function processEveryAddress(address, deal) {
            var geoObjectForAddress = new ymaps.GeoObject({
                geometry: {
                    type: "Point",
                    coordinates: [address.y, address.x]
                },
                properties: {
                    balloonContentBody: deal.name
                }
            });
            dealPlaceGeoObjects.push(geoObjectForAddress);
        }

        for (var i = deals.length - 1; i >= 0; i--) {
            processEveryDeal(deals[i]);
        }

        return dealPlaceGeoObjects;
    }


    window.YaMapsWrapper = YaMapsWrapper;

    return YaMapsWrapper;
})();
