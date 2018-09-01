$(document).ready(function(){

var socket = io.connect('http://localhost:3000');

$('.newTransaction-form').on('submit',function(e){
    
   
        e.preventDefault();
        let url ="createtransaction";
        let transcode = $('#trans-code').val();
        let from = $('#from').val();
        let to = $('#to').val();
        let amount = $('#amount').val();
        if(transcode !=""&& from != "" && amount != "" && to!=""){
        $.post(url,{
            transcode:transcode,
            from:from,
            to:to,
            amount:amount,
            timestamp:Date.now()
            }).done(function(data){
                alert('block emmitted')
                 socket.emit('newblock')
                $('.new-block').empty();
                $('.new-block').css('display','block')
                $('.new-block').append(`
                    <h3>Successfully added a new transaction</h3>
                 `)
                  $('#trans-code').val('');
                  $('#from').val('');
                  $('#to').val('');
                  $('#amount').val('');
        })
    }else{
        alert("Fill empty field(s)");
    }
    })
})
