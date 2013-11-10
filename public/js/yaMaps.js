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
            initMapWithCoords(localOptions.coords, deals);
        } else if (localOptions.locationString) {
            initMapWithString(localOptions.locationString, deals);
        } else {
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
        map = new ymaps.Map('map', {center: coordsForCenter, zoom: 8});


        clusterer = new ymaps.Clusterer({
            gridSize: 150
        });

        dealPlaceGeoObjects = fillGeoObjectCollection(deals);

        clusterer.add(dealPlaceGeoObjects);
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
            var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
                '<div>$[properties.name]Hello</div>', {
               // '<table><tr><td>1</td><td>2</td></tr><tr><td>7</td><td>9</td></tr></table>', {
                    build: function () {
                        BalloonContentLayout.superclass.build.call(this);
                    },
                    clear: function () {
                        BalloonContentLayout.superclass.build.call(this);
                    }
                }

            );

            var geoObjectForAddress = new ymaps.GeoObject({
                geometry: {
                    type: "Point",
                    coordinates: [address.y, address.x]
                },
                properties: {
                    name: me.get('name'),
                    balloonContentBody: deal.name
                }
            }, {
                balloonContentLayout: BalloonContentLayout
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
