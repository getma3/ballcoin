$(document).ready(function(){
    $.ajax({
        method:"GET",
        url:"/profile/mytransactions?id="+$('#user-id').val(),
        dataType:"json"
    }).then(data=>{
        if(data.length == 0){
            $('#myTrans').append(`
            <div style="margin-top:10%;text-align: center;" class="new-block">
                <p >No Transactions available</p> 
            </div>
        `)
            
        }
       data.forEach(function(data){
           let date = new Date(data.timestamp);
        $('#myTrans').append(`
            <div style="display: block" class="new-block" style="width:400px;">
                <p><strong>From:</strong> ${data.from} </p>
                <p><strong>To:</strong> ${data.to} </p>
                <p><strong>Amount: </strong>${data.amount}</p>
                <p><strong>Hash: </strong>${data.hash}</p>
                <p><strong>Date: </strong> ${date}</p> 
            </div>
        `)
    })
    })
})