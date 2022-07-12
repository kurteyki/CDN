function deleteTopic()
{
    $(".delete-topic").on("click",function(e){

        const button = $(this),
        data = button.data('hash');
        
        let dialog = bootbox.confirm({
            title: "Konfirmasi Penghapusan ?",
            message: `Kamu yakin akan menghapus topik <b>${button.data('title')}</b>`,
            centerVertical: true,
            closeButton: false,
            buttons: {
                cancel: {
                    className: 'btn-danger',
                    label: '<i class="bi bi-x"></i> Batal'
                },
                confirm: {
                    label: '<i class="bi bi-check"></i> Ya'
                }
            },
            callback: function (result) {
                if (result) {

                    // animation
                    $(".bootbox-accept, .bootbox-cancel").prop("disabled",true);    
                    $(".bootbox-accept").html($(".bootbox-accept").html() + xsetting.spinner);

                    let buttonspinner = $(".button-spinner");

                    ShowToast(lang.process, false);
                    
                    $.post(current_url + '/topic-delete', {hash : data} , {}, 'json')
                    .done(function(data){

                        if (data.status) {
                            dialog.modal('hide');
                            refreshTopic();
                        }else{
                            // animation
                            $(".bootbox-accept, .bootbox-cancel").prop("disabled",false);   
                            buttonspinner.remove();
                        }

                        ShowToast(data.response, true, 5000);
                    })
                    .fail(function(xhr, statusText, errorThrown) {
                        let err_message = (xhr.responseJSON) ? xhr.responseJSON.response : statusText;
                        ShowToast(err_message, true, 3000); 

                        // animation
                        $(".bootbox-accept, .bootbox-cancel").prop("disabled",false);   
                        buttonspinner.remove();
                    });

                    return false;
                }
                
            }
        });
    })  
}

deleteTopic();