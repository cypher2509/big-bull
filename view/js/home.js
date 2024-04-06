updateHome()
updateLeaderBoard()
updateHistory()
function updateHome(){
    $.ajax({
        url: '/playerPortfolio',
        type: 'GET',
        contentType: 'application/json',

        success: function(response){
            console.log(response[0].portfolio)
            $("#username").text(response[0].userName);

            let tableData='';
            let portfolioValue =0;
            if(response[0].portfolio.length ==0){
                tableData = `<tr>
                <td>Nothing to see here. Buy some stocks!</td></tr>`
            }
            for(let i of response[0].portfolio){
                portfolioValue += i.currValue;
                tableData +=` <tr>
                <td>${i.symbol}</td>
                <td>${parseFloat(i.avgPrice).toFixed(2)}</td>
                <td>${parseFloat(i.quantity).toFixed(2)}</td>
                <td>${parseFloat(i.currRate).toFixed(2)}</td>
                <td>${parseFloat(i.currValue).toFixed(2)}</td>
                <td>${i.pl}</td>
              </tr>`;
            }
            $("#value-tab").text("$"+portfolioValue.toFixed(2));
            $(".balance").text("Balance: $"+response[0].balance);
            document.getElementById("table-body").innerHTML = tableData;
        },        
        //We can use the alert box to show if there's an error in the server-side
        error: function(xhr, status, error){
            $("#register-out").text(xhr.responseJSON);
            // var errorMessage = xhr.status + ': ' + xhr.statusText
            // alert('Error - ' + errorMessage);
            console.log(xhr.responseJSON)
        }
    });
    
    
}
function updateHistory(){
    $.ajax({
        url:"/tradingHistory",
        type: 'GET',
        contentType: 'application/json',
        success: function(response){
            arr = response;
            console.log(arr)
            
            let tableData='';
            for(let i of arr){
                let time = i.time.split("T")
                let date = time[0]
                let preciseTime = time[1].split(".")
                preciseTime = preciseTime[0];
                console.log(date,preciseTime);

                tableData +=` <tr>
                <td>${i.call}</td>
                <td>${i.symbol}</td>
                <td>${parseFloat(i.rate).toFixed(2)}</td>
                <td>${i.quantity}</td>
                <td>${parseFloat(i.cost).toFixed(2)}</td>
                <td>${date+" "+preciseTime}</td>

            </tr>`;
            }
            document.getElementById("history-table").innerHTML = tableData;
        },        
        //We can use the alert box to show if there's an error in the server-side
        error: function(xhr, status, error){
            $("#register-out").text(xhr.responseJSON);
            // var errorMessage = xhr.status + ': ' + xhr.statusText
            // alert('Error - ' + errorMessage);
            console.log(xhr.responseJSON)
        }
    })
}
function updateLeaderBoard(){
    $.ajax({
        url: '/portfolio',
        type: 'GET',
        contentType: 'application/json',
        success: function(response){
            arr = response;
            console.log(arr)
            // We can print in the front-end console to verify
            // what is coming back from the server side
            for (let i = 0; i < arr.length; i++) {
                let highest = i
                for (let j = i + 1; j < arr.length; j++) {
                  if (arr[j].portfolioValue > arr[highest].portfolioValue) {
                    highest = j
                  }
                }
                if (highest !== i) {
                  // Swap
                  ;[arr[i], arr[highest]] = [arr[highest], arr[i]]
                }
              }
            console.log(arr)
            let tableData='';
            let rank = 1
            for(let i of arr){
                tableData +=` <tr>
                <td>${rank}</td>
                <td>${i.userName}</td>
                <td>${parseFloat(i.portfolioValue).toFixed(2)}</td>
            </tr>`;
            rank++;
            }
            document.getElementById("board-body").innerHTML = tableData;
        },        
        //We can use the alert box to show if there's an error in the server-side
        error: function(xhr, status, error){
            $("#register-out").text(xhr.responseJSON);
            // var errorMessage = xhr.status + ': ' + xhr.statusText
            // alert('Error - ' + errorMessage);
            console.log(xhr.responseJSON)
        }
    });

}
$(document).ready(function(){
    function changeDivComponents(tab_element_clicked){
        $(".tabcontent").each(function(index){
            let this_id = $(this).attr('id');
            if (this_id.includes(tab_element_clicked.toLowerCase())){
                $(this).show();
            }else{
                $(this).hide();
            }                    
        });
    }

    $(".tablinks").click(function(){
        changeDivComponents($(this).text());
    });
//inputs
    $("#stockSymbol").focusout(function(){
        let stockSymbol = {}
        stockSymbol.symbol = $('#stockSymbol').val();
        $.ajax({
            url: '/getPrice',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(stockSymbol),
            success: function(response){
                // We can print in the front-end console to verify
                // what is coming back from the server side
                console.log(JSON.stringify(response));
                $("#stockCost").text("Current_Stock_price: "+response);
                document.getElementById("stockQuantity").disabled =false;
            },        
            //We can use the alert box to show if there's an error in the server-side
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                document.getElementById("stockQuantity").disabled =true;
                $("#stockCost").text("");
                console.log("error ::"+ error)
            }
        });
    })

    $("#stockQuantity").focusout(function(){
        let quantity = $('#stockQuantity').val()
        if(Number.isInteger(parseInt(quantity))){
            var node = document.getElementById('stockCost');
            let cost = node.textContent.split(" ");
            cost = cost[1]
            let amount = (parseInt(quantity)*parseFloat(cost)).toFixed(2);
            $("#amount").text("Amount: "+amount);
        }
        else{
            console.log("not working"+ quantity)
        }
    })
//trade
    function trade(trade){
        $.ajax({
            url: '/tradeStock',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(trade),
            success: function(response){

                $("#tradeAccomplished").text(trade.call+ " "+ trade.quantity+" "+trade.symbol )
                console.log(JSON.stringify(response));
                updateHome();
                updateLeaderBoard();
                updateHistory();
            },        
            //We can use the alert box to show if there's an error in the server-side
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                console.log(xhr.responseJSON)
                $("#tradeAccomplished").text(xhr.responseJSON)
            }

        });
    }
    $("#buy-btn").click(function(){
        let tradeInfo= {};
        tradeInfo.symbol = $("#stockSymbol").val()
        tradeInfo.quantity = parseInt($("#stockQuantity").val())
        tradeInfo.call ="buy";
        trade(tradeInfo);
        
    });
    $("#sell-btn").click(function(){
        let tradeInfo = {};
        tradeInfo.call = "sell";
        tradeInfo.symbol = $("#stockSymbol").val()
        tradeInfo.quantity = parseInt($("#stockQuantity").val())
        trade(tradeInfo);

    });

    
});




