
$('#f').submit(function(e){
    e.preventDefault();
    var value = $('#username').val()
    console.log(value);
    $.ajax({
        url: 'chat/',
        type: "POST",
        data: {'username' :value},
        success: function(data){
            window.location.href = data.url;

        },
        error : function (data) {
            console.log(data)
        }
    })


});