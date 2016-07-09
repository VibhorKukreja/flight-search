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
            },
            change : function( event, ui ){
                if(!ui.item){
                    selector.attr('data-airport-code', '');
                }
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
        if(_isValidInput(searchDetails)){
            _showLoader();
            $.getJSON('/flights/search', searchDetails)
                .done(function(response) {

                    $('.dates li').each(function(index){
                        var date  = new Date(searchDetails.date);
                        date.setDate(date.getDate()+(index-2));
                        $(this).html('<a class="dates-link">'+date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear()+'</a>');
                    });

                    $(".data-container").addClass('data-container-visible');
                    _renderFlightsList(response);
                    _hideLoader();
                })
                .fail(function( jqxhr, textStatus, error ) {
                    var err = JSON.parse(jqxhr.responseText).error;
                    _toggleErrorMsg(err);
                    _hideLoader();
                });

        }
    }

    /* Display loader while waiting for API response */
    function _showLoader(){
        $('.loader').addClass('show-loader');
    }

    /* hide loader */
    function _hideLoader(){
        $('.loader').removeClass('show-loader');
    }

    /* Rendering Table data */
    function _renderFlightsList(flightsList){
        /* converting list into local time-zone and sorting on start time */
        flightsList.forEach(function(flight){
            flight.start.dateTime = new moment(flight.start.dateTime);
            flight.finish.dateTime = new moment(flight.finish.dateTime);
        });

        flightsList.sort(function(a,b){
            return a.start.dateTime - b.start.dateTime
        });

        /* creating flight list html */
        var tableHtml = '';
        flightsList.forEach(function(flight){
            tableHtml += '<tr>' +
            '<td>' + flight.airline.name + '</td>' +
            '<td>' + flight.flightNum + '</td>' +
            '<td>' + flight.start.dateTime.format("MMMM Do YY, h:mm a") + '</td>' +
            '<td>' + flight.finish.dateTime.format("MMMM Do YY, h:mm a") + '</td>' +
            '<td>' + flight.price + '</td>' +
            '</tr>'
        });
        $('#flight-list-table').append(tableHtml);
    }

    /* get user inputs */
    function _getSearchDetails(){
        return {
            from : $('#fromLocation').attr('data-airport-code'),
            to : $('#toLocation').attr('data-airport-code'),
            date : $('#travel-date').val()
        }
    }

    /* validate search input */
    function _isValidInput(input){
        if(!input.from){
            _toggleErrorMsg('Invalid source location.');
            return false;
        }

        if(!input.to){
            _toggleErrorMsg('Invalid destination location.');
            return false;
        }

        if(input.from == input.to){
            _toggleErrorMsg('Source and Destination should be different.');
            return false;
        }

        if(!input.date){
            _toggleErrorMsg('Please select a travel date.');
            return false;
        }

        var selectedDate = new Date(input.date).getTime(),
            currentDate = new Date().getTime();
        selectedDate += 86400000;

        if(selectedDate < currentDate){
            _toggleErrorMsg('Please select a future travel date.');
            return false;
        }

        _toggleErrorMsg("");
        return true;
    }

    /* toggle error message */
    function _toggleErrorMsg(msg){
        $('.error-msg').html(msg);
        if(msg) {
            $('.error-msg').show();
            $(".data-container").removeClass('data-container-visible');
            $('.dates li').html("");
        }else {
            $('.error-msg').hide();
        }
    }
});