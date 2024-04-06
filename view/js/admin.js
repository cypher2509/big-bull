function createGame(game){

    $.ajax({
        url:"/newGame",
        type:"POST",
        data:JSON.stringify(game),
        contentType: 'application/json',
        success: function(response){
            $("#gameResponse").text(response.data);

        },
        error: function(xhr, status, error){
            $("#gameResponse").text(xhr.responseJSON.data);
            console.log(xhr.responseJSON)
        }
    })
}

function provideCash(game){
    $.ajax({
        url:"/provideCash",
        type:"POST",
        data:JSON.stringify(game),
        contentType: 'application/json',
        success: function(response){
            $("#cashResponse").text(response);
        },
        error: function(xhr, status, error){
            $("#cashResponse").text(xhr.responseJSON);
            console.log(xhr.responseJSON)
        }
    })
}
function declare(game){
    $.ajax({
        url:"/declareWinner",
        type:"POST",
        data:JSON.stringify(game),
        contentType: 'application/json',
        success: function(response){
            $("#winner").text(response.userName);
            console.log(response.data)
        },
        error: function(xhr, status, error){
            $("#winner").text(xhr.responseJSON.data);
        }
    })
}

$("#provideCash-btn").click(function(){
    let gameName = $("#cashGameName").val();
    let cash = $("#cash").val();
    let passkey =$("#passkeyCash").val();
    let c= {}
    c.gameId = gameName;
    c.cash = cash;
    c.passkey = passkey;
    provideCash(c);
})

$("#createGame-btn").click(function(){
    let gameName = $("#gameName").val()
    let passkey = $("#passkeyGame").val()
    let cash = $("#startingCash").val()
    let c ={}
    c.gameId = gameName;
    c.passkey = passkey;
    c.startingCash = cash;
    createGame(c)
})

$("#declareWinner-btn").click(function(){
    let gameName = $("#gameId").val()
    let passkey = $("#passkeyWinner").val()
    c = {}
    c.gameId = gameName;
    c.passkey = passkey;
    declare(c);
})