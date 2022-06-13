/**
 * edit Section Button
 */
 function editSection()
 {
    $(".edit-section").on("click",function(e){

        const button = $(this),
        hash = button.data('hash');

        ShowToast(lang.readSection, false);

        $.post(current_url + 'section-edit', {hash : hash})
        .done(function(read){

            if (!read.status) {
                ShowToast(read.response, false);
                return false;
            }

            removeToast();

            // build form edit
            let html = '';
            html += `
            <form id="form-section">

            <!--  general -->
            <div class="mb-3">
            <label class="form-label">Bagian</label>
            <input required="" name="title" type="text" class="form-control" placeholder="masukan nama bagian" value="${read['response']['title']}">
            </div>

            <div class="mb-3">
            <label class="form-label">Jenis</label>
            <div class="form-check">
            <input value='Single' class="form-check-input" type="radio" name="type" id="inlineRadio1" ${(read['response']['type'] == 'Single') ? 'checked' : ''}>
            <label class="form-check-label" for="inlineRadio1">Single</label>
            </div>
            <div class="form-check">
            <input value='Part' class="form-check-input" type="radio" name="type" id="inlineRadio2" ${(read['response']['type'] == 'Part') ? 'checked' : ''}>
            <label class="form-check-label text-nowrap" for="inlineRadio2">Part</label>
            </div>                                  
            </div>        

            <div class="mb-3">
            <label class="form-label d-flex justify-content-between">

            <div>
            Ilustrasi
            </div>

            <div>
            <div class="form-check form-check-inline">
            <input required value="icon" class="form-check-input" type="radio" name="ilustrator_select" id="status-icon" ${(read['response']['ilustrator'].substr(0,2) == 'bi') ? 'checked' : ''}>
            <label class="form-check-label" for="status-icon">Icon</label>
            </div>
            <div class="form-check form-check-inline">
            <input required value="image" class="form-check-input" type="radio" name="ilustrator_select" id="status-image" ${(read['response']['ilustrator'].substr(0,2) != 'bi') ? 'checked' : ''}>
            <label class="form-check-label text-nowrap" for="status-image">Image</label>
            </div>
            </div>

            </label>

            <div class="input-group input-icon-ilustrator ${(read['response']['ilustrator'].substr(0,2) == 'bi') ? '' : 'd-none'}">
            <div class="input-group-prepend">
            <span class="input-group-text h-100 selected-icon"></span>
            </div>
            <input type="text" class="form-control iconpicker" name="ilustrator_icon" value="${(read['response']['ilustrator'].substr(0,2) == 'bi') ? read['response']['ilustrator'] : ''}"/>
            </div>
            </div>

            <div class="mb-3 input-image-ilustrator ${(read['response']['ilustrator'].substr(0,2) != 'bi') ? '' : 'd-none'}">
            <input name="ilustrator_image" type="text" class="form-control" placeholder="https://..." value="${(read['response']['ilustrator'].substr(0,2) != 'bi') ? read['response']['ilustrator'] : ''}">
            </div>  
            <!--  general -->                      
            
            <input type="hidden" value="${button.data('hash')}" name="hash"/>
            <button class="btn btn-primary btn-submit" type="submit">Simpan</button>

            </form>
            `;

            var dialog = bootbox.dialog({
                title: `Edit bagian <b>${read['response']['title']}</b>`,
                message: html,
                centerVertical: true,
                size: 'small',
                onShown : function(){
                    $("input[name=title]", $("#form-section")).focus();
                    $("input[name=ilustrator_select]").click(function() {
                        if ($(this).val() == 'image') {
                            $(".input-icon-ilustrator").addClass('d-none');
                            $(".input-image-ilustrator").removeClass('d-none');
                        }else{
                            $(".input-icon-ilustrator").removeClass('d-none');
                            $(".input-image-ilustrator").addClass('d-none');
                        }
                    });
                    formeditSection(dialog);

                    // init picker
                    if (read['response']['ilustrator'].substr(0,2) == 'bi') {                       
                        createPicker(read['response']['ilustrator']);               
                    }else{
                        createPicker();
                    }          
                }
            })            

        }).fail(function(xhr, statusText, errorThrown) {
            console.info(xhr);
            let err_message = (xhr.responseJSON) ? xhr.responseJSON.response : statusText;
            ShowToast(err_message, true, 3000);                       
        });        

    })  
}

editSection();

function formeditSection(dialog)
{
    let form = $("#form-section");

    form.on("submit",function(e){               

        e.preventDefault();     

        if ($("input[name=title]", $("#form-section")).val() == false) {
            $("input[name=title]", $("#form-section")).focus();
            return false;
        }        

        // animation
        $("input", form).prop("readonly",true); 
        $(".btn-submit").prop("disabled",true); 
        $(".btn-submit").html($(".btn-submit").html() + xsetting.spinner);
        $(".bootbox-close-button").hide();

        let buttonspinner = $(".button-spinner");       

        $.post(current_url + 'section-update', form.serialize() , {}, 'json')
        .done(function(data){

            if (data.status) {
                dialog.modal('hide');
                refreshContent();
            }else{
                // animation
                $("input", form).prop("readonly",false);    
                $(".btn-submit").prop("disabled",false);
                $(".bootbox-close-button").show();  
                buttonspinner.remove();       
            }

            ShowToast(data.response, true, 5000);
        })
        .fail(function(xhr, statusText, errorThrown) {
            let err_message = (xhr.responseJSON) ? xhr.responseJSON.response : statusText;
            ShowToast(err_message, true, 3000);   
            // animation
            $("input", form).prop("readonly",false);    
            $(".btn-submit").prop("disabled",false);
            $(".bootbox-close-button").show();  
            buttonspinner.remove();
        });

    });         

}