/**
 * Created by arun on 9/7/16.
 */

$(function(){
    // Events
    _fetchAirportsList('fromLocation');
    _fetchAirportsList('toLocation');

    $('#searchFlights').on('click', _searchFlights);

    // Function declaration
    /* fetch airports list on user input */
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

    /* validates user input and sends search API request */
    function _searchFlights(){
        var searchDetails = _getSearchDetails();
        console.log(searchDetails);
    }

    /* get user inputs */
    function _getSearchDetails(){
        return {
            from : $('#fromLocation').attr('data-airport-code'),
            to : $('#toLocation').attr('data-airport-code'),
            date : $('#travel-date').val()
        }
    }
});