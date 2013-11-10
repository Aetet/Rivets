var Me = Backbone.Model.extend();
var me = new Me({name: 'Mike Shinoda'});

var source,
    template,
    context,
    html;

source = document.querySelector('#appTemplate').innerHTML;
console.log('source', source);
template = Handlebars.compile(source);
context = me.toJSON();
html    = template(context);

console.log(me.get('name'), 'me', me);
    
var mskCoords = [55.753676, 37.619899];
var spbCoords = [59.939095, 30.315868];
ymaps.ready(function () {

    
 console.time('yaMaps MSK');




var domElement = document.querySelector('.jsToggleMap');
var isMapOpen = true;


 




    var yaMapsWrapper = new YaMapsWrapper({
        locationString: 'Россия, Москва',
        coords: mskCoords,
        deals: mskDeals
    });
    console.timeEnd('yaMaps MSK');
domElement.addEventListener('click', function () {
    if (isMapOpen) {
        console.log('close',document.querySelector('#map').style.display = 'none');
        isMapOpen = false;
        yaMapsWrapper.changeCenter({coords: spbCoords});
        yaMapsWrapper.resetGeoObjectCollection(spbDeals);
    } else {
        console.log('open', document.querySelector('#map').style.display = '');
        isMapOpen = true;
    }
});
    /*
        document.querySelector('#map').innerHTML = '';
         console.time('yaMaps SPB');
        var yaMapsWrapper2 = new YaMapsWrapper({
            coords: spbCoords,
            locationString: 'Россия, Санкт-Петербруг',
            deals: spbDeals
        });
        console.timeEnd('yaMaps SPB');
        */

    console.time('yaMaps SPB');
//    yaMapsWrapper.changeCenter({coords: spbCoords});
//    yaMapsWrapper.resetGeoObjectCollection(spbDeals);
    console.timeEnd('yaMaps SPB');
});


