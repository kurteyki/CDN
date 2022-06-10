/*!
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011â€“2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
 !function(a){function f(a,b){if(!(a.originalEvent.touches.length>1)){a.preventDefault();var c=a.originalEvent.changedTouches[0],d=document.createEvent("MouseEvents");d.initMouseEvent(b,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null),a.target.dispatchEvent(d)}}if(a.support.touch="ontouchend"in document,a.support.touch){var e,b=a.ui.mouse.prototype,c=b._mouseInit,d=b._mouseDestroy;b._touchStart=function(a){var b=this;!e&&b._mouseCapture(a.originalEvent.changedTouches[0])&&(e=!0,b._touchMoved=!1,f(a,"mouseover"),f(a,"mousemove"),f(a,"mousedown"))},b._touchMove=function(a){e&&(this._touchMoved=!0,f(a,"mousemove"))},b._touchEnd=function(a){e&&(f(a,"mouseup"),f(a,"mouseout"),this._touchMoved||f(a,"click"),e=!1)},b._mouseInit=function(){var b=this;b.element.bind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),c.call(b)},b._mouseDestroy=function(){var b=this;b.element.unbind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),d.call(b)}}}(jQuery);

 $(".sort-button").on("click", function(){

    const button = $(this),
    data = button.data('hash');

    ShowToast(lang.process, false);

    $.post(current_url + 'sortable-edit')
    .done(function(read){

        if (!read.status) {
            ShowToast(read.response, false);
            return false;
        }

        removeToast();

        var dialog = bootbox.dialog({
            title: `Sortir Bagian dan Konten`,
            message: read.response,
            centerVertical: true,
            size: 'medium',  
            buttons: {
                confirm: {
                    label: "Simpan",
                    className: 'btn-primary',
                    callback: function(){
                        var listItem = $('ol.sortable').nestedSortable('toHierarchy', {startDepthCount: 0});
                        var sortItem = JSON.stringify(listItem);
                        // console.info(sortItem);

                        $(".bootbox-accept").prop("disabled",true);    
                        $(".bootbox-accept").html($(".bootbox-accept").html() + xsetting.spinner);
                        let buttonspinner = $(".button-spinner");

                        $.post(current_url + 'sortable-update', {dataposition : sortItem}, {}, 'json')
                        .done(function(data){

                            if (data.status) {
                                dialog.modal('hide');
                                refreshContent(true);
                            }else{              
                                $(".bootbox-accept").prop("disabled",false);   
                                buttonspinner.remove();     
                            }

                            ShowToast(data.response, true, 5000);
                        })
                        .fail(function(xhr, statusText, errorThrown) {
                            let err_message = (xhr.responseJSON) ? xhr.responseJSON.response : statusText;
                            ShowToast(err_message, true, 3000);     
                            $(".bootbox-accept").prop("disabled",false);   
                            buttonspinner.remove();
                        });

                        return false;
                    }
                }
            },
            onShown : function(){
                $('.sortable').nestedSortable({
                    handle: 'div',
                    items: 'li',
                    helper: 'clone',
                    opacity: 1,
                    placeholder: 'placeholder',

                    // revert: 10,
                    // tabSize: 1000,

                    tolerance: 'pointer',
                    toleranceElement: '> div',

                    isTree: false,
                    expandOnHover: 1,

                    maxLevels: 2,
                    protectRoot: true,
                    // update: function(event, ui){
                    //     var serialized = $('ol.sortable').nestedSortable('toHierarchy', {startDepthCount: 0});
                    //     console.info(serialized);
                    // },
                });
            }
        })
    })
    .fail(function(xhr, statusText, errorThrown) {
        let err_message = (xhr.responseJSON) ? xhr.responseJSON.response : statusText;
        ShowToast(err_message, true, 3000);                       
    });
})