$(document).ready(function(){
    $('.updateprofile-form').on('submit',function(e){
            let url ="profile/updateprofile";
            let Nat_id = $('#national_id').val();
            let gateNumber = $('#gateNumber').val();
            let email = $('#email').val();
            let user_id = $('#user-id').val();
            if(Nat_id !="" || gateNumber != "" || email != ""){
                alert("profile details updated...")
                $.post(url,{
                NationalID:Nat_id,
                gateNumber:gateNumber,
                email:email,
                user_id:user_id
                }).done(function(data){
            })
        }else{
            alert("Fill empty field(s)");
        }
        })
    })
    