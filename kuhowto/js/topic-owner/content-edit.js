 function editContent()
 {
    $(".edit-content").on("click",function(e){

        const button = $(this),
        hash = button.data('hash');

        ShowToast(lang.readContent, false);

        // read article 
        $.post(current_url + 'content-edit', {hash : hash})
        .done(function(read){

            if (!read.status) {
                ShowToast(read.response, false);
                return false;
            }

            removeToast();

            // success get data > build form edit

            let html = '';
            html += `
            <form id="form-content">

            <textarea id="summernote" name="article" placeholder="Tulis Konten..."></textarea>          

            <input type="hidden" name="title" value="${read['response']['title']}"/>      
            <input type="hidden" name="title_section" value="${read['response']['title_section']}"/>                  
            <input type="hidden" name="description" value="${read['response']['description']}"/>      
            <textarea class="d-none" name="tips">${read['response']['tips']}</textarea>
            <textarea class="d-none" name="faq">${read['response']['faq']}</textarea>            
            <textarea class="d-none" name="reference">${read['response']['reference']}</textarea>
            <input type="hidden" name="status" value="${read['response']['status']}"/>
            <input type="hidden" name="password" value="${read['response']['password']}"/>
            <input type="hidden" name="robots" value="${read['response']['robots']}"/>            
            <input type="hidden" name="permalink" value="${read['response']['permalink']}"/>
            <input type="hidden" value="${read['response']['hash']}" name="hash"/>

            </form>
            `;

            let html_title = `<div class="row g-3 align-items-center justify-content-between">
            <div class="col-auto">
            Edit konten <b>${read['response']['title']}</b>
            </div>

            <div class="col-auto text-center">
            <button data-toggle="tooltip" data-placement="bottom" title="Edit Title" class="btn btn-light border do-title"><i class="bi bi-newspaper"></i></button>
            <button data-toggle="tooltip" data-placement="top" title="Edit Deskripsi" class="btn btn-light border do-description"><i class="bi bi-card-text"></i></button>
            <button data-toggle="tooltip" data-placement="top" title="Edit Permalink" class="btn btn-light border do-permalink"><i class="bi bi-link-45deg"></i></button>
            <button data-toggle="tooltip" data-placement="bottom" title="Edit Robots" class="btn btn-light border do-robots"><i class="bi bi-sliders"></i></button>
            </div>

            <div class="col-auto">

            <div class="form-check form-check-inline">
            <input value="Draft" class="form-check-input" type="radio" name="status_h" id="status-draft" ${(read['response']['status'] == 'Draft') ? 'checked' : ''}>
            <label class="form-check-label" for="status-draft">Draft</label>
            </div>
            <div class="form-check form-check-inline">
            <input value="Published" class="form-check-input" type="radio" name="status_h" id="status-published" ${(read['response']['status'] == 'Published') ? 'checked' : ''}>
            <label class="form-check-label text-nowrap" for="status-published">Published</label>
            </div>

            <button data-toggle="tooltip" data-placement="bottom" title="Edit Title Bagian" class="btn btn-light border do-title-section"><i class="bi bi-layout-sidebar-inset-reverse"></i></button>
            <button data-toggle="tooltip" data-placement="top" title="Edit Tips" class="btn btn-light border do-tips">Tips</button>
            <button data-toggle="tooltip" data-placement="bottom" title="Edit FAQ" class="btn btn-light border do-faq">FAQ</button>       
            <button data-toggle="tooltip" data-placement="top" title="Edit Referensi" class="btn btn-light border do-reference">Referensi</button>  
            <button data-toggle="tooltip" data-placement="bottom" title="Proteksi Konten" class="btn btn-light border do-password"><i class="bi bi-key"></i></button>           

            </div><!--//col-auto-->
            </div>`; 

            let dialog = bootbox.dialog({
                title: html_title,
                message: html,
                centerVertical: true,
                closeButton: false,
                buttons: {
                    countword: {
                        label: "0",
                        className: 'text-start col total-words',
                        callback: function(){
                            return false;
                        }
                    },
                    cancel: {
                        label: "Batal",
                        className: 'btn-danger col-auto',
                        callback: function(){
                            $(window).unbind('beforeunload');
                        }
                    },
                    confirm: {
                        label: "Simpan",
                        className: 'btn-primary col-auto',
                        callback: function(){
                            $("#form-content").submit();
                            return false;
                        }
                    },
                    save: {
                        label: "<i class='bi bi-save'></i>",
                        className: "btn-dark border bootbox-save col-auto",
                        callback: function()
                        {
                            doSave('content-save');
                            return false;
                        }
                    }
                }
            });

            dialog.init(function() { 

                dialog.find('.modal-dialog').addClass('modal-fullscreen');
                dialog.find('.modal-header').addClass('d-block');
                dialog.find('.modal-body').addClass('p-0 overflow-hidden'); 
                dialog.find('.modal-footer').addClass('row'); 

                $(window).bind('beforeunload', function(){
                    return 'Are you sure you want to leave?';
                });

                $("input[name=status_h]").click(function() {
                    $("input[name=status]").val($(this).val());
                });

                $(function () {
                    $('[data-toggle="tooltip"]').tooltip()
                }) 

                initSummernote(read['response']['article']);
                formeditContent(dialog);
                doActionContent();
                doTitle();                
                doDescription();
                doPermalink();
                doRobots();
                doPassword();
            });


        }).fail(function(xhr, statusText, errorThrown) {
            let err_message = (xhr.responseJSON) ? xhr.responseJSON.response : statusText;
            ShowToast(err_message, true, 3000);                     
        });    

    })      
}

editContent();

function formeditContent(dialog)
{

    let form = $("#form-content");

    form.on("submit",function(e){   

        e.preventDefault(); 

        if ($('#summernote').summernote('isEmpty')) {
            alert('konten masih kosong');
            return false;
        }

        // animation
        $("input", form).prop("readonly",true); 
        $(".bootbox-accept, .bootbox-cancel").prop("disabled",true);    
        $(".bootbox-accept").html($(".bootbox-accept").html() + xsetting.spinner);

        let buttonspinner = $(".button-spinner");       

        $.post(current_url + 'content-update', form.serialize() , {}, 'json')
        .done(function(data){

            if (data.status) {
                dialog.modal('hide');
                refreshContent();
                $(window).unbind('beforeunload');
            }else{
                // animation
                $("input", form).prop("readonly",false);    
                $(".bootbox-accept, .bootbox-cancel").prop("disabled",false);   
                buttonspinner.remove();             
            }

            ShowToast(data.response, true, 5000);
        })
        .fail(function(xhr, statusText, errorThrown) {
            let err_message = (xhr.responseJSON) ? xhr.responseJSON.response : statusText;
            ShowToast(err_message, true, 3000);   
            // animation
            $("input", form).prop("readonly",false);    
            $(".bootbox-accept, .bootbox-cancel").prop("disabled",false);   
            buttonspinner.remove();
        });

    });             
}