function deleteContent()
{
    $(".delete-content").on("click",function(e){

        const button = $(this),
        title = button.data('title');
        hash = button.data('hash');

        let dialog = bootbox.confirm({
            title: "Konfirmasi Penghapusan ?",
            message: `Kamu yakin akan menghapus konten <b>${title}</b>`,
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

                    $.post(current_url + 'content-delete', {hash : hash} , {}, 'json')
                    .done(function(data){

                        if (data.status) {
                            dialog.modal('hide');
                            refreshContent();
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

deleteContent();