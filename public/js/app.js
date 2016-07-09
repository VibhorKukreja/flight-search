/**
 * Created by arun on 9/7/16.
 */
$(function() {

    $( "#from" ).autocomplete({
        minLength: 2,
        source: 'http://node.locomote.com/code-task/airports',
        focus: function( event, ui ) {
            $( "#from" ).val( ui.item.label );
            return false;
        },
        select: function( event, ui ) {
            $( "#from" ).val( ui.item.label );

            return false;
        }
    })
        .autocomplete( "instance" )._renderItem = function( ul, item ) {
        console.log(item);
        /*return $( "<li>" )
            .append( "<a>" + item.label + "<br>" + item.desc + "</a>" )
            .appendTo( ul );*/
    };
});