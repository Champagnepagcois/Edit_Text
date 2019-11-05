var ngTinymce = angular.module('ng-module', ['ui.tinymce']);

window.tinymce.PluginManager.add('sieToolbar', function (editor) {
        //fontType(editor);
        var inputFile = '<input type="file" id="sieImageInput" name="single-image" style="font-size:14px;" accept="image/png, image/gif, image/jpeg, image/jpg"/>';
        //document.body.appendChild(angular.element(inputFile)[0]);
        editor.addCommand("sieImage", function () {
            //document.getElementById('sieImageInput').click();
            var sieImage = '<div class="layout-row layout-wrap p-20">' + inputFile + '</div>' +
                    '<div class="layout-row layout-wrap p-20">' +
                    '<input type="checkbox" id="sieImageCheckbox"><label for="sieImageUrl">O url: </label>' +
                    '<input class="md-input flex b-b-grey-light m-l-5" id="sieImageUrl" disabled>' +
                    '</div>';
            var modalImage = editor.windowManager.open({
                title: "Insertar imagen",
                width: 450,
                height: 200,
                html: sieImage,
                buttons: [{
                        text: "Ok",
                        subtype: "primary",
                        onclick: function () {
                            var checkbox = document.getElementById('sieImageCheckbox');
                            var input = document.getElementById('sieImageInput');
                            var url = document.getElementById('sieImageUrl');
                            if (checkbox.checked) {//es url
                                editor.execCommand("mceInsertContent", false, "<img src='" + url.value + "' />");
                                editor.windowManager.close();
                                return false;
                            }

                            if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
                                alert("This feature needs a modern browser.");
                                editor.windowManager.close();
                                return;
                            }

                            var imagefile = input.files;
                            if (imagefile.length <= 0) {
                                // do nothing
                                editor.windowManager.close();
                                return;
                            }

                            if (imagefile[0].size > 512 * 1024) {
                                alert("The image cannot be larger than 500KB.");
                                return;
                            }

                            var classFilereader = new FileReader();
                            classFilereader.onload = function (base64) {
                                var imgData = base64.target.result;
                                var img = new Image();
                                img.src = imgData;
                                editor.execCommand("mceInsertContent", false, "<img src='" + imgData + "' />");
                                editor.windowManager.close();
                            };
                            classFilereader.onerror = function (err) {
                                alert("Error reading file - " + err.getMessage());
                            };
                            classFilereader.readAsDataURL(imagefile[0]);
                        }
                    }, {
                        text: "Cancel",
                        onclick: function () {
                            (this).parent().parent().close();
                        }
                    }]
            });
            setTimeout(function () {
                var checkbox = document.getElementById('sieImageCheckbox');
                var input = document.getElementById('sieImageInput');
                var url = document.getElementById('sieImageUrl');
                checkbox.onchange = function () {
                    if (checkbox.checked) {
                        url.removeAttribute('disabled');
                        url.className = url.className.replace('grey-light', 'blue');
                        input.setAttribute('disabled', 'disabled');
                    } else {
                        input.removeAttribute('disabled');
                        url.setAttribute('disabled', 'disabled');
                        url.className = url.className.replace('blue', 'grey-light');
                    }
                };
            }, 500);
        });
        editor.addButton("sieImage", {
            icon: "image",
            context: "insert",
            title: "Insertar imagen",
            cmd: "sieImage"
        });
        editor.addMenuItem("sieImage", {
            cmd: "sieImage",
            context: "insert",
            text: "Insertar imagen",
            icon: "image",
            prependToContext: true
        });
    });
    var setup = function (editor) {
        //fontType(editor);
    };
    var tinymceFactory = function () {
        var toolbar = {
            basico: 'bold italic underline strikethrough' +
                    ' | ' +
                    'alignleft aligncenter alignright alignjustify' +
                    ' | ' +
                    'forecolor backcolor' +
                    ' | ' +
                    'link unlink sieImage' +
                    ' | ' +
                    'fontselect | fontsizeselect',
            medio: 'bold italic underline strikethrough' +
                    ' | ' +
                    'alignleft aligncenter alignright alignjustify' +
                    ' | ' +
                    'bullist numlist | undo redo' +
                    ' | ' +
                    'forecolor backcolor' +
                    ' | ' +
                    'link unlink sieImage media' +
                    ' | ' +
                    'fontselect | fontsizeselect | table' + ' | ' +
                    'print preview' ,
            avanzado: 'bold italic underline strikethrough' +
                    ' | ' +
                    'alignleft aligncenter alignright alignjustify' +
                    ' | ' +
                    'spellchecker | formatselect | fontselect | fontsizeselect | forecolor backcolor | bullist numlist | undo redo' +
                    ' | ' +
                    'link unlink sieImage media' +
                    ' | ' +
                    'table autosave' +
                    ' | ' +
                    'print preview',
        };
        var configuracion = {
            statusbar: true,
            height: 100,
			      theme: 'modern',
			//skin: '',
            //language: localStorage.getItem('idioma') || 'en',
            elementpath: false,
            content_style: "p {margin: 0;} *{font-size: 13px;font-family: Helvetica,Arial,sans-serif;font-style: normal;letter-spacing:0.14px;color: rgba(0,0,0,0.87);}",
            //content_css: 'url.css',
            inline: false,
            setup: setup,
            plugins: ['advlist autolink lists link image charmap print preview hr anchor pagebreak ',
                'searchreplace wordcount visualblocks visualchars code fullscreen',
                'insertdatetime media nonbreaking save table directionality', //contextmenu
                'emoticons template paste textcolor colorpicker textpattern imagetools',
                'sieToolbar autosave' //spellchecker
            ],
          templates: [
            {title: 'Some title 1', description: 'Some desc 1', content: '<strong class="red">My content: {$username}</strong>'},
            {title: 'Some title 2', description: 'Some desc 2', url: 'development.html'}
          ],
            //browser_spellcheck: true,
            // spellchecker_languages: 'Spanish=es,English=en,French=fr_FR,' + 'German=de,Italian=it,Polish=pl,Portuguese=pt_BR,Swedish=sv',
            // spellchecker_language: 'en',
            // spellchecker_callback: function (method, text, success, failure) {
            //     var words = text.match(this.getWordCharPattern());
            //     if (method === "spellcheck") {
            //         var suggestions = {};
            //         if (words && words.length) {
            //             for (var i = 0; i < words.length; i++) {
            //                 suggestions[words[i]] = ["First", "Second"];
            //             }
            //         }
            //         success(suggestions);
            //     }
            //     tinymce.util.JSONRequest.sendRPC({
            //      url: "http://tinymcespellcheck.com/nanospell/server/ajax/php/tinyspell.php",
            //      method: "spellcheck",
            //      params: {
            //      lang: this.getLanguage(),
            //      words: text.match(this.getWordCharPattern())
            //      },
            //      success: function (result) {
            //      success(result);
            //      },
            //      error: function (error, xhr) {
            //      failure("Spellcheck error:" + xhr.status);
            //      }})
            // },
            menubar: true,
            image_advtab: true,
            paste_data_images: true,
            formats: {
                bold: {inline: 'strong'}, //, styles: {'font-weight': 'bold'}
                italic: {inline: 'i', styles: {'font-style': 'italic'}}
            },
            default_link_target: "_blank",
            target_list: true
            //file_browser_callback_types: 'file image media',
            //file_picker_types: 'file image media',
            /*toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
             toolbar2: 'print preview media | forecolor backcolor emoticons | fontType | codesample',
             toolbar3: 'bold italic underline fontselect fontsizeselect',
             toolbar1: "newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
             toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code | insertdatetime preview | forecolor backcolor",
             toolbar3: "table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft",*/
        };
        var factory = {};
        angular.forEach(toolbar, function (v, k) {
            factory[k] = angular.copy(configuracion);
            factory[k].toolbar = v;
        });
        factory.nivel = function (n, objeto) {
            if (typeof (objeto) !== 'object') {
                objeto = {};
            }
            return angular.extend({}, this[n], objeto);
        };
        return factory;
    };
    tinymceFactory.$inject = [];
    ngTinymce.factory('tinymce', tinymceFactory);
    var directiva = 'tinymceBind';
    ngTinymce.directive(directiva, function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return scope.$eval(attrs[directiva]);
                }, function (value) {
                    var resultado = '';
                    if (value) {
                        var htmlX = angular.element('<div>' + value + '</div>');
                        var script = htmlX.find('script');
                        script.remove();
                        resultado = htmlX[0].outerHTML;
                    }
                    element.html(resultado);
                });
            }
        };
    });

ngTinymce.controller('TinyMceController', function($scope, tinymce) {
  /*$scope.tinymceOptions = {
    plugins: 'link image code',
    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
  };*/
  $scope.tinymceOptions = tinymce.avanzado;
});