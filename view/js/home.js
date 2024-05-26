
var buttons;
getGeneralNews()
updateHome()
updateLeaderBoard()
updateHistory()
function updateHome(){
    $.ajax({
        url: '/getWatchlist',
        type: 'GET',
        contentType : 'application/json',
        success : function(response){
            let tableData='';
            for(let i of response.wlist){
                tableData +=` <tr>
                <div class="watchlist-item" ><button class="dataLink watchlist-stock-btn"><div class="stock-details"><img class="logo" src ="../../logos/${i.symbol}.png">  ${i.symbol}</div><div>Price: ${parseFloat(i.price).toFixed(2) }</div></button></div>
              </tr>`;
            }
            document.getElementById("wl-body").innerHTML = tableData;
            classActionListener();

        },
        error: function(xhr, status, error){
            $("#register-out").text(xhr.responseJSON);
            console.log(xhr.responseJSON)
        }
    })
    $.ajax({
        url: '/playerPortfolio',
        type: 'GET',
        contentType: 'application/json',

        success: function(response){
            $("#username").text(response[0].userName);

            let tableData='';
            let portfolioValue =0;
            if(response[0].portfolio.length ==0){
                tableData = `<tr>
                <td>Nothing to see here. Buy some stocks!</td></tr>`
            }
            for(let i of response[0].portfolio){
                portfolioValue += i.currValue;
                tableData +=` <tr >
                <td><button class="dataLink portfolio-dataLink"><img class="logo" src ="../../logos/${i.symbol}.png"> ${i.symbol}</button></td>
                <td>${parseFloat(i.avgPrice).toFixed(2)}</td>
                <td>${parseFloat(i.quantity).toFixed(2)}</td>
                <td>${parseFloat(i.currRate).toFixed(2)}</td>
                <td>${parseFloat(i.currValue).toFixed(2)}</td>
                <td>${i.pl}</td>
                
              </tr>`;
            }

            $("#value-tab").text("$"+portfolioValue.toFixed(2));
            $(".balance").text("Balance: $"+response[0].balance.toFixed(2));
            document.getElementById("table-body").innerHTML = tableData;
            classActionListener();

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
function getStockNews(stock){
    document.getElementById("stock-articles").innerHTML = "";
    $.ajax({
        url:'/getStockNews',
        type:'POST',
        data: JSON.stringify(stock),
        contentType: 'application/json',
        success: function(response){
            let articles = '';
            let a = 0;
            for(let i of response){
                let tStamp = i.publishedAt.split('T');
                let date = tStamp[0];

                let x =
                `<div id="article-card">
                    <img id="article-pic" src=${i.urlToImage} >
                    <div>
                        <a href= ${i.url}>
                            <h5 id="headline">${i.title}</h5>
                        </a>
                        <br>
                        <div><p id="article-date">${date}</p></div>
                    </div>
                </div>`
                articles += x;
                a++
                if(a>10){
                    break;
                }
            }
            document.getElementById("stock-articles").innerHTML = "";

            document.getElementById("stock-articles").innerHTML = articles;

        }
    })
}

function getGeneralNews(){
    $.ajax({
        url:'/getGeneralNews',
        type:'GET',
        contentType: 'application/json',
        success: function(response){
            let articles = '';
            let a = 0;
            for(let i of response){
                let tStamp = i.publishedAt.split('T');
                let date = tStamp[0];

                let x =
                `<div id="article-card">
                    <img id="article-pic" src=${i.urlToImage} >
                    <div>
                        <a href= ${i.url}>
                            <h5 id="headline">${i.title}</h5>
                        </a>
                        <br>
                        <div><p id="article-date">${date}</p></div>
                    </div>
                </div>`
                articles += x;
                a++
                if(a>10){
                    break;
                }
            }
            document.getElementById("articles").innerHTML = articles;

        }
    })
}
function updateHistory(){
    $.ajax({
        url:"/tradingHistory",
        type: 'GET',
        contentType: 'application/json',
        success: function(response){
            arr = response;
            
            let tableData='';
            for(let i of arr){
                let time = i.time.split("T")
                let date = time[0]
                let preciseTime = time[1].split(".")
                preciseTime = preciseTime[0];

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

    $('#logout').click(function(){
        $.ajax({
            url: '/logout',
            type: 'GET',
            contentType: 'application/json',
            success: function(response){            
                window.location.href = "index.html";
            },        
            //We can use the alert box to show if there's an error in the server-side
            error: function(xhr, status, error){
                $("#register-out").text(xhr.responseJSON);
                // var errorMessage = xhr.status + ': ' + xhr.statusText
                // alert('Error - ' + errorMessage);
                console.log(xhr.responseJSON)
            }
        });
    });

    $(".tablinks").click(function(){
        changeDivComponents($(this).text());

    });

    const quantity = document.getElementById("stockQuantity")
    quantity.addEventListener( "input", (e)=>{
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

    const searchBar = document.getElementById("searchbar");
    searchBar.addEventListener("focusout",(e)=>{
        setTimeout(clearContent,300)        
    })

    const watchlist= document.getElementById("watchlist-btn");
    watchlist.addEventListener("click",(e)=>{
        let stockData ={};
        if(watchlist.getElementsByClassName("fa-regular fa-star").length==1){
            watchlist.innerHTML = "";
            watchlist.innerHTML= `<i class="fa-solid fa-star">`
            stockData.symbol = $("#stockTicker").text();
            stockData.action ="add";
            
        }
        // (watchlist.getElementsByClassName("fa-solid fa-star").length==1){
        else{
            watchlist.innerHTML = "";
            watchlist.innerHTML= `<i class="fa-regular fa-star">`
            stockData.symbol = $("#stockTicker").text();
            stockData.action ="remove";
        }
        editWatchlist(stockData);

        updateHome();

    })  

    searchBar.addEventListener( "input", (e)=>{
        let stockName = $("#searchbar").val()
        if(stockName.length>1){
            let searchStock ={};
            searchStock.search = stockName;
            $.ajax({
                url:'searchStock',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(searchStock),
                success: function(response){
                    var searchItems= "";
                    if(response.message!="emptySearch"){
                        for(i of response){
                            try{
                                searchItems += `
                            <button class= "dataLink search-result-component "><div><img class="logo" src ="../../logos/${i.ticker}.png"> ${i.ticker}</div> ${i["company name"]}</button>`
                
                            }
                            catch{

                            }
                        }
                        document.getElementById("search-results").innerHTML = searchItems;
                        buttons = document.querySelectorAll('.dataLink');
                        for(let button of buttons){
                            button.addEventListener('click', (e)=>{
                                let x=0
                                if (e.target.classList.contains("dataLink")) {
                                    x++;
                                    let stockName = e.target.textContent;
                                    let stockTicker = stockName.split(" ");
                                    stockTicker = stockTicker[1];
                                    let stockData = {}
                                    stockData.symbol = stockTicker;
                                    stockData.name = stockName;
                                    getPrice(stockData);
                                    getStockNews(stockData);
                                    getFundamentals(stockData);
                                    $(".tabcontent").each(function(index){
                                        let this_id = $(this).attr('id');
                                        if (this_id.includes("trade")){
                                            $(this).show();
                                        }
                                        else{
                                            $(this).hide();
                                        }            
                                    });
                                }
                                
                            });
                        };

                    };  
                    
                } 
            })
        }
        
    })
   
    $("#buy-btn").click(function(){
        let tradeInfo= {};
        tradeInfo.symbol = $("#stockTicker").text()

        tradeInfo.quantity = parseInt($("#stockQuantity").val())
        tradeInfo.call ="buy";
        trade(tradeInfo);
        
    });
    $("#sell-btn").click(function(){
        let tradeInfo = {};
        tradeInfo.call = "sell";
        tradeInfo.symbol = $("#stockTicker").text()
        tradeInfo.quantity = parseInt($("#stockQuantity").val())
        trade(tradeInfo);

    });

});

function editWatchlist(stockData){
    $.ajax({
        url: '/editWatchlist',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(stockData),
        success: function(response){
            updateHome();
        },        
        //We can use the alert box to show if there's an error in the server-side
        error: function(xhr, status, error){
            var errorMessage = xhr.status + ': ' + xhr.statusText
        }

    })

}

function trade(trade){
    $.ajax({
        url: '/tradeStock',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(trade),
        success: function(response){

            $("#tradeAccomplished").text(trade.call+ " "+ trade.quantity+" "+trade.symbol )
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

function classActionListener(){
            buttons = document.querySelectorAll('.dataLink');
            for(let button of buttons){
                button.addEventListener('click', (e)=>{
                    let x=0
                    if (e.target.classList.contains("dataLink")) {
                        x++;
                        let stockName = e.target.textContent;
                        let stockTicker = stockName.split(" ");
                        stockTicker = stockTicker[1];
                        if(button.classList.contains("watchlist-stock-btn")){
                            stockTicker = stockName.split('Price: ');
                            stockTicker = stockTicker[0].trim();
                            console.log("stock ticker from watchlist button: "+stockName+ stockTicker);
                        }
                        stockName = stockTicker;
                        let stockData = {}
                        stockData.symbol = stockTicker;
                        stockData.name = stockName;
                        console.log(stockData);
                        getPrice(stockData);
                        getFundamentals(stockData);                        
                        $(".tabcontent").each(function(index){
                            let this_id = $(this).attr('id');
                            if (this_id.includes("trade")){
                                $(this).show();
                            }
                            else{
                                $(this).hide();
                            }            
                        });
                    }
                    
                });
            };
}

function getPrice(stockData){
    $.ajax({
        url: '/getPrice',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(stockData),
        success: function(response){
            $("#stock-price").text("$"+ response);
            $("#stockCost").text("$ "+ response);

        },        
        error: function(xhr, status, error){
            var errorMessage = xhr.status + ': ' + xhr.statusText
            console.log(errorMessage);
        }
    });
}

async function getFundamentals(stockData){
     $.ajax({
        url: '/getFundamentals',
        type: 'POST',
        data: JSON.stringify(stockData),
        contentType: 'application/json',
        success: function(response){
            $("#stockLogo").attr("src",`./logos/${response.symbol}.png`);
            $("#stockTicker").text(response.symbol);
            $("#stockSymbol").text(response.symbol)
            $("#stockName").text(response.name);
            $("#stockName").text(response.name);
            $("#open").text(parseFloat(response.open).toFixed(2));
            $("#high").text(parseFloat(response.high).toFixed(2));
            $("#low").text(parseFloat(response.low).toFixed(2));            
            $("#close").text(parseFloat(response.close).toFixed(2));
            $("#previous_close").text(parseFloat(response.previous_close).toFixed(2));
            $("#volume").text(parseFloat(response.volume).toFixed(2));
            $("#average_volume").text(parseFloat(response.average_volume).toFixed(2));
            
            $("#52low").text(parseFloat(response.fifty_two_week.low))
            $("#52high").text(parseFloat(response.fifty_two_week.high))
            $("#52low_change").text(parseFloat(response.fifty_two_week.low_change))
            $("#52high_change").text(parseFloat(response.fifty_two_week.high_change))
            $("#52range").text(parseFloat(response.fifty_two_week.range))


            let stockData = {}
            stockData.name = response.name

            getStockNews(stockData);

            console.log("checking in watchlist: "+ response.symbol);
            
            checkWatchlist(response.symbol);
           
            if(response.change>0){
                $("#change").css("color","green").text("up $"+ response.change+"("+response.percent_change+"%) past day");
            }
            else{
                $("#change").css("color","red").text("down $"+ ((-1)*response.change)+"("+(-1)*response.percent_change+"%) past day");
            }
            
            
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

function clearContent(){
    document.getElementById("search-results").innerHTML = "";
    $("#searchBar").value="";
}



 function checkWatchlist(ticker){
     $.ajax({
        url: '/getWatchlist',
        type: 'get',
        contentType: 'application/json',
        success: function(response){
            for(i of response.wlist){
                if(i.symbol == ticker){
                    document.getElementById("watchlist-btn").innerHTML = `<i class="fa-solid fa-star">`
                    break;
                    
                }
                else{
                    document.getElementById("watchlist-btn").innerHTML = `<i class="fa-regular fa-star">`
                }
            }   
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

