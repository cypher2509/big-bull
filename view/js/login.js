
$(document).ready(function(){

    /**
     * This function will get all the values in the inputs
     * and will create a valid object to be send to the server-side
     */
    function assemblePlayer(){
        let c = {};
        c.gameId = $("#gameId").val();
        c.userName = $("#userName").val();
        c.password = $("#password").val();
        console.log(c);
        return c;
    }
    /**
     * This function binds an event to the add button.
     * The idea is that we assemble a valid object from the form
     * and send it to the server-side.
     */
    
    $("#login-btn").click(function(event){
        event.preventDefault();
        console.log('working');
        let player = assemblePlayer();
        $.ajax({
            url: '/login',
            type: 'POST',
            data: JSON.stringify(player),
            contentType: 'application/json',

            success: function(response){
                // We can print in the front-end console to verify
                // what is coming back from the server side
                console.log(JSON.stringify(response));
                window.location.href = "home.html";
            },        
            //We can use the alert box to show if there's an error in the server-side
            error: function(xhr, status, error){
                $("#login-out").text(xhr.responseJSON);
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
                console.log(xhr.responseJSON);
            }
        });
    });
    $("#register-btn").click(function(event){
        event.preventDefault();
        window.location.href = "register.html";
    });
    $("#admin").click(function(event){
        event.preventDefault();
        window.location.href = "admin.html";
    })
});