/**
 * Created by arun on 9/7/16.
 */
function _fetchAirportsList(selector){
    selector = $('#'+selector);
    selector.autocomplete({
        minLength: 2,
        delay : 500,
        source: '/flights/airports',
        focus: function( event, ui ) {
            selector.val( ui.item.airportName+' ('+ ui.item.airportCode +')' );
            return false;
        },
        select: function( event, ui ) {
            selector.val( ui.item.airportName+' ('+ ui.item.airportCode +')' );
            selector.attr('data-airport-code', ui.item.airportCode);
            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
        return $( "<li>" )
            .append( "<a>" + item.airportName + "<br>" + item.cityName +", "+ item.countryName + "</a>" )
            .appendTo( ul );
    };
}

$(function(){
    _fetchAirportsList('fromLocation');
    _fetchAirportsList('toLocation');
});