<script context="module">
  import {AH} from '../helper/HelperAI.svelte';
  import l from '../src/libs/editorLib/language';
  let editorConfig = false;
  export const ucEditor = {
      getContent: function(selector, format="default") {
          if (tinyMCE) {
            try {
                switch(format) {
                  case 'default' : 
                      return tinyMCE.editors[document.getElementById(selector).getAttribute('id')].getContent();
                  default :
                      return tinyMCE.editors[document.getElementById(selector).getAttribute('id')].getContent({ format: 'raw' });
                }
            } catch(error) {
                console.log(error);
            }
              
          } else {
              console.log("TinyMCE is not found.");
          }
      },
      insertContent: function(insertData, format="default") {
          if (tinyMCE) {
              switch(format) {
                  case 'default' : 
                      return tinyMCE.activeEditor.insertContent(insertData);
                  default :
                      return tinyMCE.activeEditor.insertContent(insertData, { format: format });
              }
              
          } else {
              console.log("TinyMCE is not found.");
          }
      },
      initEditor: function(forPreview, selector = ".tinymce-editor") {
          forPreview = forPreview || false;
          let d = new Date();
          //selector = selector || ".tinymce-editor";
          tinymce.init({
            selector: selector,
            inline: true,
            theme: "modern",
            resize: true,
            menubar: false,
            toolbar: false,
            elementpath: false,
            statusbar: false,
            convert_urls: false, // For not let tinymce change url
            relative_urls: false, // For not let tinymce change url
            forced_root_block: false,
            extended_valid_elements : "uc:syntax[id|class|num|nonum|white|console|hidelinenums]", // For know tinymce that it is valid tags and attrs
            custom_elements: "uc:syntax", // For know tinymce that it is valid tags
            closed: /^(br|hr|input|meta|img|link|param|area|seq|snt)$/,
            preformatted: true,
            entity_encoding: "numeric",
            valid_elements: "*[*]",
            readonly: forPreview ? true : false,
            fixed_toolbar_container: forPreview ? "#toolbar_container_preview" : "#toolbar_container",
            visualblocks_default_state: false,
            external_plugins: { nanospell: "../lib/nanospell/plugin.js" },
            nanospell_server: "php", // choose "php" "asp" "asp.net" or "java"
            nanospell_ignore_char: "var",
            nanospell_ignore_block_caps: true,
            nanospell_autostart: false,
            paste_as_text: true,
            link_title: false,
            formats: {
              bold: {
                inline: "b"
              },
              italic: {
                inline: "i"
              }
            },
            setup: function (editor) {
              if (document.getElementById(editor.id) && document.getElementById(editor.id).getAttribute("readonly")) {
                editor.settings.readonly = true;
              }
        
              //@TODO:? @abhishek can we use array to add all the button and options
              editor.addButton("custom-alignleft", {
                icon: l.alignleft,
                onclick: function () {
                  let selectNode = tinyMCE.activeEditor.selection.getNode();
                  if (tinyMCE.activeEditor.selection.getSel().anchorNode.parentElement.innerHTML == selectNode.innerHTML) {
                    if (selectNode.classList.contains("ebook_item_text")) {
                      AH.alert(l.align_content_message);
                    } else {
                      editor.execCommand("mceToggleFormat", false, "alignleft");
                    }
                  } else {
                    if (tinyMCE.activeEditor.selection.getNode().nodeName == "IMG" && selectNode.parents('.uc-figure')[0]) {
                      selectNode.parents('.uc-figure').css({ 'text-align': 'left'});
                    } else {
                      editor.execCommand("mceToggleFormat", false, "div");
                      editor.execCommand("mceToggleFormat", false, "alignleft");
                    }
                  }
                }
              });
              editor.addButton("custom-aligncenter", {
                icon: l.aligncenter,
                onclick: function () {
                  let selectedNode = tinyMCE.activeEditor.selection.getNode();
                  if (tinyMCE.activeEditor.selection.getSel().anchorNode.parentElement.innerHTML == tinyMCE.activeEditor.selection.getNode().innerHTML) {
                    if (selectedNode?.classList?.value.includes("ebook_item_text")) {
                      AH.alert("Please select content first.");
                    } else {
                      editor.execCommand("mceToggleFormat", false, "aligncenter");
                    }
                  } else {
                    //AH.alert(l.align_content_message);
                    if (tinyMCE.activeEditor.selection.getNode().nodeName == "IMG" && AH.parent(selectedNode, '.uc-figure')) {
                      AH.parent(selectedNode, '.uc-figure').style.textAlign = 'center';
                    } else {
                      editor.execCommand("mceToggleFormat", false, "div");
                      editor.execCommand("mceToggleFormat", false, "aligncenter");
                    }
                  }
                }
              });
              editor.addButton("custom-alignright", {
                icon: l.alignright,
                onclick: function () {
                  let selectedNode = tinyMCE.activeEditor.selection.getNode();
                  if (tinyMCE.activeEditor.selection.getSel().anchorNode.parentElement.innerHTML == tinyMCE.activeEditor.selection.getNode().innerHTML) {
                    if (selectedNode.classList.contains("ebook_item_text")) {
                      AH.alert("Please select content first.");
                    } else {
                      editor.execCommand("mceToggleFormat", false, "alignright");
                    }
                  } else {
                    if (tinyMCE.activeEditor.selection.getNode().nodeName == "IMG" && AH.parent(selectedNode, '.uc-figure')) {
                      AH.parent(selectedNode, '.uc-figure').style.textAlign = 'right';
                    } else {
                      editor.execCommand("mceToggleFormat", false, "div");
                      editor.execCommand("mceToggleFormat", false, "alignright");
                    }
                  }
                }
              });
              editor.addButton("mybutton2", {
                text: l.formats,
                type: "menubutton",
                icon: false,
                menu: [
                  {
                    text: l.inline,
                    icon: l.inlineAlign,
                    menu: [
                      {
                        text: l.bold,
                        icon: l.bits,
                        onclick: function () {
                          editor.execCommand("mceToggleFormat", false, "bold");
                        }
                      },
                      {
                        text: l.italic,
                        icon: l.italics,
                        onclick: function () {
                          editor.execCommand("mceToggleFormat", false, "italic");
                        }
                      },
                      {
                        text: l.underline,
                        icon: l.underlines,
                        onclick: function () {
                          editor.execCommand("mceToggleFormat", false, "underline");
                        }
                      },
                      {
                        text: l.strikethrough,
                        icon: l.strikethroughs,
                        onclick: function () {
                          editor.execCommand("mceToggleFormat", false, "strikethrough");
                        }
                      },
                      {
                        text: l.superscript,
                        icon: l.superscripts,
                        onclick: function () {
                          editor.execCommand("mceToggleFormat", false, "superscript");
                        }
                      },
                      {
                        text: l.subscript,
                        icon: l.subscripts,
                        onclick: function () {
                          editor.execCommand("mceToggleFormat", false, "subscript");
                        }
                      },
                      {
                        text: l.small,
                        icon: l.smalls,
                        onclick: function () {
                          tinymce.activeEditor.formatter.register("customsmallformat", {
                            inline: "small"
                          });
                          tinymce.activeEditor.formatter.apply("customsmallformat");
                        }
                      }
                    ]
                  },
                  {
                    text: l.heading,
                    icon: l.headings,
                    menu: [
                      {
                        text: l.heading1,
                        onclick: function () {
                          registerFormatter("h1");
                          toggleFormat("h1");
                          // tinymce.activeEditor.formatter.register("customh1", {
                          //   inline: "h1"
                          // });
                          // tinymce.activeEditor.formatter.toggle("customh1");
                        }
                      },
                      {
                        text: l.heading2,
                        onclick: function () {
                          registerFormatter("h2");
                          toggleFormat("h2");
                          // tinymce.activeEditor.formatter.register("customh2", {
                          //   inline: "h2"
                          // });
                          // tinymce.activeEditor.formatter.toggle("customh2");
                        }
                      },
                      {
                        text: l.heading3,
                        onclick: function () {
                          registerFormatter("h3");
                          toggleFormat("h3");
                          // tinymce.activeEditor.formatter.register("customh3", {
                          //   inline: "h3"
                          // });
                          // tinymce.activeEditor.formatter.toggle("customh3");
                        }
                      },
                      {
                        text: l.heading4,
                        onclick: function () {
                          registerFormatter("h4");
                          toggleFormat("h4");
                        }
                      },
                      {
                        text: l.heading5,
                        onclick: function () {
                          registerFormatter("h5");
                          toggleFormat("h5");
                        }
                      },
                      {
                        text: l.heading6,
                        onclick: function () {
                          registerFormatter("h6");
                          toggleFormat("h6");
                        }
                      },
                      {
                        text: l.newspaper,
                        onclick: function () {
                          editor.focus();
                          var selected =
                            editor.selection.getContent() == ""
                              ? " "
                              : editor.selection.getContent();
                          // editor.insertContent('<div style="line-height:140%"><span class="newspaper_font">' + selected + '</span></div>');
                          editor.insertContent(
                            '<span class="font40 toll-num">' + selected + "</span>"
                          );
                        }
                      }
                    ]
                  },
                  {
                    text: l.blocks,
                    icon: l.block,
                    menu: [
                      {
                        text: l.para,
                        onclick: function () {
                          editor.focus();
                            var bookmark = tinymce.activeEditor.selection.getBookmark(
                              2,
                              true
                            );
                            var selected = "";
                            if (editor.selection.getContent() == "") {
                              selected += " ";
                            } else {
                              selected += editor.selection.getContent();
                            } 
                            editor.insertContent(
                              '<p>' + selected + "</p>"
                            );
                            tinymce.activeEditor.selection.moveToBookmark(bookmark);
                        }
                      },
                      {
                        text: l.div,
                        onclick: function () {
                          editor.focus();
                            var bookmark = tinymce.activeEditor.selection.getBookmark(
                              2,
                              true
                            );
                            var selected = "";
                            if (editor.selection.getContent() == "") {
                              selected += " ";
                            } else {
                              selected += editor.selection.getContent();
                            } 
                            editor.insertContent(
                              '<div>' + selected + "</div>"
                            );
                            tinymce.activeEditor.selection.moveToBookmark(bookmark);
                        }
                      },
                      {
                        text: l.block,
                        onclick: function () {
                            editor.focus();
                            var bookmark = tinymce.activeEditor.selection.getBookmark(
                              2,
                              true
                            );
                            var selected = "";
                            if (editor.selection.getContent() == "") {
                              selected += " ";
                            } else {
                              selected += editor.selection.getContent();
                            } 
                            editor.insertContent(
                              '<blockquote>' + selected + "</blockquote>"
                            );
                            tinymce.activeEditor.selection.moveToBookmark(bookmark);
                        }
                      },
                      {
                        text: l.code,
                        onclick: function () {
                          tinymce.activeEditor.formatter.register("codeformat", {
                            inline: "code",
                            remove: "all",
                            styles: { display: "inline" }
                          });
                          editor.execCommand("mceToggleFormat", false, "codeformat");
                        }
                      },
                      {
                        text: l.insnote,
                        onclick: function () {
                          editor.focus();
                          var bookmark = tinymce.activeEditor.selection.getBookmark(
                            2,
                            true
                          );
                          var selected = "Instructor Note: ";
                          if (editor.selection.getContent() == "") {
                            selected += " ";
                          } else {
                            selected += editor.selection.getContent();
                          } 
                          editor.insertContent(
                            '<div class="ins_note">' + selected + "</div>"
                          );
                          tinymce.activeEditor.selection.moveToBookmark(bookmark);
                        }
                      },
                      {
                        text: l.insans,
                        onclick: function () {
                          editor.focus();
                          var bookmark = tinymce.activeEditor.selection.getBookmark(
                            2,
                            true
                          );
                          var selected =
                            editor.selection.getContent() == ""
                              ? " "
                              : editor.selection.getContent();
                          editor.insertContent(
                            '<div class="ins_ans space-15">' + selected + "</div>"
                          );
                          tinymce.activeEditor.selection.moveToBookmark(bookmark);
                        }
                      }
                    ]
                  },
                  {
                    text: l.alignment,
                    icon: l.alginments,
                    menu: [
                      {
                        text: l.left,
                        icon: l.alignleft,
                        onclick: function () {
                          let currNode = tinyMCE.activeEditor.selection.getNode();
                          if (tinyMCE.activeEditor.selection.getSel().anchorNode.parentElement.innerHTML == currNode.innerHTML) {
                            if (currNode.classList.contains("ebook_item_text")) {
                              AH.alert(l.align_content_message);
                            } else {
                              editor.execCommand("mceToggleFormat", false, "alignleft");
                            }
                          } else {
                            AH.alert(l.align_content_message);
                          }
                        }
                      },
                      {
                        text: l.center,
                        icon: l.aligncenter,
                        onclick: function () {
                          let currNode = tinyMCE.activeEditor.selection.getNode();
                          if (tinyMCE.activeEditor.selection.getSel().anchorNode.parentElement.innerHTML == currNode.innerHTML) {
                            if (currNode.classList.contains("ebook_item_text")) {
                              AH.alert(l.align_content_message);
                            } else {
                              editor.execCommand(
                                "mceToggleFormat",
                                false,
                                "aligncenter"
                              );
                            }
                          } else {
                            AH.alert(l.align_content_message);
                          }
                        }
                      },
                      {
                        text: l.right,
                        icon: l.alignright,
                        onclick: function () {
                          let currNode = tinyMCE.activeEditor.selection.getNode();
                          if (tinyMCE.activeEditor.selection.getSel().anchorNode.parentElement.innerHTML == currNode.innerHTML) {
                            if (currNode.classList.contains("ebook_item_text")) {
                              AH.alert(l.align_content_message);
                            } else {
                              editor.execCommand("mceToggleFormat", false, "alignright");
                            }
                          } else {
                            AH.alert(l.align_content_message);
                          }
                        }
                      },
                      {
                        text: l.justify,
                        icon: l.alignjustify,
                        onclick: function () {
                          let currNode = tinyMCE.activeEditor.selection.getNode();
                          if (tinyMCE.activeEditor.selection.getSel().anchorNode.parentElement.innerHTML == currNode.innerHTML) {
                            if (currNode.classList.contains("ebook_item_text")) {
                              AH.alert(l.align_content_message);
                            } else {
                              editor.execCommand(
                                "mceToggleFormat",
                                false,
                                "alignjustify"
                              );
                            }
                          } else {
                            AH.alert(l.align_content_message);
                          }
                        }
                      }
                    ]
                  },
                  {
                    text: l.cases,
                    icon: l.case,
                    menu: [
                      {
                        text: l.uppercase,
                        onclick: function () {
                          editor.focus();
                          var bookmark = tinymce.activeEditor.selection.getBookmark(2, true);
                          var selected =editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                          selected = selected.toUpperCase();
                          tinyMCE.activeEditor.execCommand("mceInsertContent",false, "<span>" + selected + "</span>");
                          tinymce.activeEditor.selection.moveToBookmark(bookmark);
                        }
                      },
                      {
                        text: l.lowercase,
                        onclick: function () {
                          editor.focus();
                          var bookmark = tinymce.activeEditor.selection.getBookmark(
                            2,
                            true
                          );
                          var selected =
                            editor.selection.getContent() == ""
                              ? " "
                              : editor.selection.getContent();
                          selected = selected.toLowerCase();
                          tinyMCE.activeEditor.execCommand(
                            "mceInsertContent",
                            false,
                            "<span>" + selected + "</span>"
                          );
                          tinymce.activeEditor.selection.moveToBookmark(bookmark);
                        }
                      },
                      {
                        text: l.titlecase,
                        onclick: function () {
                          editor.focus();
                          var bookmark = tinymce.activeEditor.selection.getBookmark(
                            2,
                            true
                          );
                          var selected =
                            editor.selection.getContent() == ""
                              ? " "
                              : editor.selection.getContent();
                          //selected = selected.toLowerCase();
                          selected = selected.replace(/\w\S*/g, function (txt) {
                            return (
                              txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                            );
                          });
                          tinyMCE.activeEditor.execCommand(
                            "mceInsertContent",
                            false,
                            "<span>" + selected + "</span>"
                          );
                          tinymce.activeEditor.selection.moveToBookmark(bookmark);
                        }
                      },
                      {
                        text: l.sentence_case,
                        onclick: function () {
                          editor.focus();
                          var bookmark = tinymce.activeEditor.selection.getBookmark(
                            2,
                            true
                          );
                          var selected =
                            editor.selection.getContent() == ""
                              ? " "
                              : editor.selection.getContent();
                          selected =
                            selected.charAt(0).toUpperCase() +
                            selected.substr(1).toLowerCase();
                          tinyMCE.activeEditor.execCommand(
                            "mceInsertContent",
                            false,
                            "<span>" + selected + "</span>"
                          );
                          tinymce.activeEditor.selection.moveToBookmark(bookmark);
                        }
                      },
                      {
                        text: l.toggle_case,
                        onclick: function () {
                          editor.focus();
                          var bookmark = tinymce.activeEditor.selection.getBookmark(
                            2,
                            true
                          );
                          var selected =
                            editor.selection.getContent() == ""
                              ? " "
                              : editor.selection.getContent();
                          const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                          const LOWER = "abcdefghijklmnopqrstuvwxyz";
                          const result = [];
                          for (let x = 0; x < selected.length; x++) {
                            if (UPPER.includes(selected[x])) {
                              result.push(selected[x].toLowerCase());
                            } else if (LOWER.includes(selected[x])) {
                              result.push(selected[x].toUpperCase());
                            } else {
                              result.push(selected[x]);
                            }
                          }
                          tinyMCE.activeEditor.execCommand(
                            "mceInsertContent",
                            false,
                            "<span>" + result.join("") + "</span>"
                          );
                          tinymce.activeEditor.selection.moveToBookmark(bookmark);
                        }
                      }
                    ]
                  },
                  {
                    text: l.color,
                    icon: l.colors,
                    menu: [
                      {
                        text: l.blue_color,
                        icon: l.bsuccess,
                        onclick: function () {
                          tinymce.activeEditor.formatter.register("blue", {
                            inline: "span",
                            styles: { color: "#007bff" }
                          });
                          tinymce.activeEditor.formatter.apply("blue");
                        }
                      },
                      {
                        text: l.orange_color,
                        icon: l.bwarning,
                        onclick: function () {
                          tinymce.activeEditor.formatter.register("orange", {
                            inline: "span",
                            styles: { color: "#ffc107" }
                          });
                          tinymce.activeEditor.formatter.apply("orange");
                        }
                      },
                      {
                        text: l.red_color,
                        icon: l.bdanger,
                        onclick: function () {
                          tinymce.activeEditor.formatter.register("red", {
                            inline: "span",
                            styles: { color: "#dc3545" }
                          });
                          tinymce.activeEditor.formatter.apply("red");
                        }
                      },
                      {
                        text: l.white,
                        icon: l.bwhite,
                        onclick: function () {
                          tinymce.activeEditor.formatter.register("white", {
                            inline: "span",
                            styles: { color: "#fff" }
                          });
                          tinymce.activeEditor.formatter.apply("white");
                        }
                      },
                      {
                        text: l.green,
                        icon: l.bgreen,
                        onclick: function () {
                          tinymce.activeEditor.formatter.register("green", {
                            inline: "span",
                            styles: { color: "green" }
                          });
                          tinymce.activeEditor.formatter.apply("green");
                        }
                      },
                      {
                        text: l.golden_brown_color,
                        icon: l.borange,
                        onclick: function () {
                          tinymce.activeEditor.formatter.register("golden-brown", {
                            inline: "span",
                            styles: { color: "#f89406" }
                          });
                          tinymce.activeEditor.formatter.apply("golden-brown");
                        }
                      },
                      {
                        text: l.black_color,
                        icon: "b-black",
                        onclick: function () {
                          tinymce.activeEditor.formatter.register("black", {
                            inline: "span",
                            styles: { color: "#000" }
                          });
                          tinymce.activeEditor.formatter.apply("black");
                        }
                      }
                    ]
                  },
                  {
                    text: l.bgcolor,
                    icon: l.background,
                    menu: [
                      {
                        text: l.green_color,
                        icon: "bg-success",
                        onclick: function () {
                          tinymce.activeEditor.formatter.register("bg-green", {
                            inline: "span",
                            styles: {
                              "background-color": "#28a745",
                              color: "#000"
                              // 'border-radius' : "3px",
                              // 'padding' : "0 5px"
                            }
                          });
                          tinymce.activeEditor.formatter.apply("bg-green");
                        }
                      },
                      {
                        text: l.cyan_color,
                        icon: l.binfo,
                        onclick: function () {
                          tinymce.activeEditor.formatter.register("bg-cyan", {
                            inline: "span",
                            styles: {
                              "background-color": "#17a2b8",
                              color: "#000"
                              // 'border-radius' : "3px",
                              // 'padding' : "0 5px"
                            }
                          });
                          tinymce.activeEditor.formatter.apply("bg-cyan");
                        }
                      },
                      {
                        text: l.blue_color,
                        icon: l.bprimary,
                        onclick: function () {
                          tinymce.activeEditor.formatter.register("bg-blue", {
                            inline: "span",
                            styles: {
                              "background-color": "#007bff",
                              color: "#000"
                              // 'border-radius' : "3px",
                              // 'padding' : "0 5px"
                            }
                          });
                          tinymce.activeEditor.formatter.apply("bg-blue");
                        }
                      },
                      {
                        text: l.red_color,
                        icon: l.bdanger,
                        onclick: function () {
                          tinymce.activeEditor.formatter.register("bg-red", {
                            inline: "span",
                            styles: {
                              "background-color": "#dc3545",
                              color: "#000"
                              // 'border-radius' : "3px",
                              // 'padding' : "0 5px"
                            }
                          });
                          tinymce.activeEditor.formatter.apply("bg-red");
                        }
                      },
                      {
                        text: l.orange_color,
                        icon: l.bwarning,
                        onclick: function () {
                          tinymce.activeEditor.formatter.register("bg-orange", {
                            inline: "span",
                            styles: {
                              "background-color": "#ffc107",
                              color: "#000"
                              // 'border-radius' : "3px",
                              // 'padding' : "0 5px"
                            }
                          });
                          tinymce.activeEditor.formatter.apply("bg-orange");
                        }
                      },
                      {
                        text: l.black_color,
                        icon: "b-black",
                        onclick: function () {
                          tinymce.activeEditor.formatter.register("bg-black", {
                            inline: "span",
                            styles: {
                              "background-color": "#343a40",
                              color: "#fff"
                              // 'border-radius' : "3px",
                              // 'padding' : "0 5px"
                            }
                          });
                          tinymce.activeEditor.formatter.apply("bg-black");
                        }
                      },
                      {
                        text: l.white,
                        icon: "b-white",
                        onclick: function () {
                          tinymce.activeEditor.formatter.register("bg-white", {
                            inline: "span",
                            styles: {
                              "background-color": "#fff",
                              color: "#000"
                            }
                          });
                          tinymce.activeEditor.formatter.apply("bg-white");
                        }
                      }
                    ]
                  },
                  {
                    text: l.list,
                    icon: l.lists,
                    menu: [
                      {
                        text: l.numlist,
                        onclick: function () {
                          editor.focus();
                          let tag = tinyMCE.activeEditor.selection.getNode();
                          let tag_parent = getParent(tag);
                          if (tag_parent.length > 0) {
                            let tag_html = tag_parent.innerHTML;
                            AH.replaceWith(tag_parent, "<ol>" + tag_html + "</ol>");
                          } else {
                            var selected = editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                            selected = selected.split("<br />");
                            editor.selection.setContent("<ol>");
                            selected.map(function (data) {
                              editor.selection.setContent("<li>" + data + "</li>");
                            });
                            editor.selection.setContent("</ol>");
                          }
                        }
                      },
                      {
                        text: l.alphlist,
                        onclick: function () {
                          editor.focus();
                          let tag = tinyMCE.activeEditor.selection.getNode();
                          let tag_parent = getParent(tag);
                          if (tag_parent) {
                            tag_parent.setAttribute("class", "alpha-order ");
                          } else {
                            var selected = editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                            selected = selected.split("<br />");
                            editor.selection.setContent('<ul class="alpha-order ">');
                            selected.map(function (data) {
                              editor.selection.setContent("<li>" + data + "</li>");
                            });
                            editor.selection.setContent("</ul>");
                          }
                        }
                      },
                      {
                        text: l.romanlist,
                        onclick: function () {
                          editor.focus();
                          let tag = tinyMCE.activeEditor.selection.getNode();
                          let tag_parent = getParent(tag);
                          if (tag_parent) {
                            tag_parent.setAttribute("type", "I");
                          } else {
                            var selected = editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                            selected = selected.split("<br />");
                            editor.selection.setContent('<ol type="I">');
                            selected.map(function (data) {
                              editor.selection.setContent("<li>" + data + "</li>");
                            });
                            editor.selection.setContent("</ol>");
                          }
                        }
                      },
                      {
                        text: l.numalphlist,
                        onclick: function () {
                          editor.focus();
                          let tag = tinyMCE.activeEditor.selection.getNode();
                          let tag_parent = getParent(tag);
                          if (tag_parent.length > 0) {
                            let tag_html = tag_parent.innerHTML;
                            AH.replaceWith(tag_parent, '<ol nested="alpha-order">' + tag_html + "</ol>");
                          } else {
                            var selected =
                              editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                            selected = selected.split("<br />");
                            editor.selection.setContent('<ol nested="alpha-order">');
                            selected.map(function (data) {
                              editor.selection.setContent("<li>" + data + "</li>");
                            });
                            editor.selection.setContent("</ol>");
                          }
                        }
                      },
                      {
                        text: l.bullist,
                        onclick: function () {
                          editor.focus();
                          let tag = tinyMCE.activeEditor.selection.getNode();
                          let tag_parent = getParent(tag);
                          if (tag_parent.length > 0) {
                            let tag_html = tag_parent.innerHTML;
                            AH.replaceWith(tag_parent, "<ul>" + tag_html + "</ul>");
                          } else {
                            var selected = editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                            selected = selected.split("<br />");
                            editor.selection.setContent("<ul>");
                            selected.map(function (data) {
                              editor.selection.setContent("<li>" + data + "</li>");
                            });
                            editor.selection.setContent("</ul>");
                          }
                        }
                      },
                      {
                        text: l.blarlist,
                        onclick: function () {
                          editor.focus();
                          let tag = tinyMCE.activeEditor.selection.getNode();
                          let tag_parent = getParent(tag);
                          if (tag_parent.length > 0) {
                            tag_parent.setAttribute("class", "arrowlist-bullet");
                            tag_parent.setAttribute("nested", "arrow-bullet,circle-bullet darkblue-txt");
                          } else {
                            var selected =
                              editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                            selected = selected.split("<br />");
                            editor.selection.setContent('<ul nested="arrow-bullet,circle-bullet darkblue-txt" class="arrowlist-bullet">');
                            selected.map(function (data) {
                              editor.selection.setContent("<li>" + data + "</li>");
                            });
                            editor.selection.setContent("</ul>");
                          }
                        }
                      },
                      {
                        text: l.bluearlist,
                        onclick: function () {
                          editor.focus();
                          let tag = tinyMCE.activeEditor.selection.getNode();
                          let tag_parent = getParent(tag);
                          if (tag_parent.length > 0) {
                            tag_parent.setAttribute("class", "arrow-bullet");
                          } else {
                            var selected =
                              editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                            selected = selected.split("<br />");
                            editor.selection.setContent('<ul class="arrow-bullet">');
                            selected.map(function (data) {
                              editor.selection.setContent("<li>" + data + "</li>");
                            });
                            editor.selection.setContent("</ul>");
                          }
                        }
                      },
                      {
                        text: l.blarbullet,
                        onclick: function () {
                          editor.focus();
                          let tag = tinyMCE.activeEditor.selection.getNode();
                          let tag_parent = getParent(tag);
                          if (tag_parent.length > 0) {
                            tag_parent.setAttribute("class", "arrow-bullet arrow-bullet-list");
                          } else {
                            var selected = editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                            selected = selected.split("<br />");
                            editor.selection.setContent('<ul class="arrow-bullet arrow-bullet-list">');
                            selected.map(function (data) {
                              editor.selection.setContent("<li>" + data + "</li>");
                            });
                            editor.selection.setContent("</ul>");
                          }
                        }
                      },
                      {
                        text: l.blcrcbbullet,
                        onclick: function () {
                          editor.focus();
                          let tag = tinyMCE.activeEditor.selection.getNode();
                          let tag_parent = getParent(tag);
                          if (tag_parent.length > 0) {
                            tag_parent.setAttribute("class", "circle-bullet darkblue-txt");
                          } else {
                            var selected = editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                            selected = selected.split("<br />");
                            editor.selection.setContent('<ul class="circle-bullet darkblue-txt">');
                            selected.map(function (data) {
                              editor.selection.setContent("<li>" + data + "</li>");
                            });
                            editor.selection.setContent("</ul>");
                          }
                        }
                      },
                      {
                        text: l.bcbwbt,
                        onclick: function () {
                          editor.focus();
                          let tag = tinyMCE.activeEditor.selection.getNode();
                          let tag_parent = getParent(tag);
                          if (tag_parent.length > 0) {
                            tag_parent.setAttribute("class", "circle-bullet ");
                          } else {
                            var selected = editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                            selected = selected.split("<br />");
                            editor.selection.setContent('<ul class="circle-bullet ">');
                            selected.map(function (data) {
                              editor.selection.setContent("<li>" + data + "</li>");
                            });
                            editor.selection.setContent("</ul>");
                          }
                        }
                      },
                      {
                        text: l.whcrclist,
                        onclick: function () {
                          editor.focus();
                          let tag = tinyMCE.activeEditor.selection.getNode();
                          let tag_parent = getParent(tag);
                          if (tag_parent.length > 0) {
                            tag_parent.setAttribute("class", "whitecircle-list la");
                          } else {
                            var selected = editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                            selected = selected.split("<br />");
                            editor.selection.setContent('<ul class="whitecircle-list la ">');
                            selected.map(function (data) {
                              editor.selection.setContent("<li>" + data + "</li>");
                            });
                            editor.selection.setContent("</ul>");
                          }
                        }
                      },
                      {
                        text: l.tickbull,
                        onclick: function () {
                          editor.focus();
                          let tag = tinyMCE.activeEditor.selection.getNode();
                          let tag_parent = getParent(tag);
                          if (tag_parent.length > 0) {
                            tag_parent.setAttribute("class", "tick-bullet");
                          } else {
                            var selected = editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                            selected = selected.split("<br />");
                            editor.selection.setContent('<ul class="tick-bullet">');
                            selected.map(function (data) {
                              editor.selection.setContent("<li>" + data + "</li>");
                            });
                            editor.selection.setContent("</ul>");
                          }
                        }
                      },
                      {
                        text: l.withoutBullet,
                          onclick: function () {
                            editor.focus();
                            let tag = tinyMCE.activeEditor.selection.getNode();
                            let tag_parent = getParent(tag);
                            if (tag_parent.length > 0) {
                              let tag_html = tag_parent.innerHTML;
                              AH.replaceWith(tag_parent, "<ul class='list_nostyle'>" + tag_html + "</ul>");
                            } else {
                              var selected = editor.selection.getContent() == "" ? "Place your Text here" : editor.selection.getContent();
                              selected = selected.split("<br />");
                              editor.selection.setContent("<ul class='list_nostyle'>");
                              selected.map(function (data) {
                                editor.selection.setContent("<li>" + data + "</li>");
                              });
                              editor.selection.setContent("</ul>");
                            }
                        }
                      },
                      {
                        text: l.listtype1,
                        onclick: function () {
                          editor.focus();
                          let tag = tinyMCE.activeEditor.selection.getNode();
                          let tag_parent = getParent(tag);
                          if (tag_parent) {
                            tag_parent.setAttribute("class", "list1");
                          } else {
                            var selected =
                              editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                            selected = selected.split("<br />");
                            editor.selection.setContent('<ul class="list1">');
                            selected.map(function (data) {
                              editor.selection.setContent("<li>" + data + "</li>");
                            });
                            editor.selection.setContent("</ul>");
                          }
                        }
                      },
                      {
                        text: l.listtype2,
                        onclick: function () {
                          editor.focus();
                          let tag = tinyMCE.activeEditor.selection.getNode();
                          let tag_parent = getParent(tag);
                          if (tag_parent) {
                            tag_parent.setAttribute("class", "list2");
                          } else {
                            var selected = editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                            selected = selected.split("<br />");
                            editor.selection.setContent('<ul class="list2">');
                            selected.map(function (data) {
                              editor.selection.setContent("<li>" + data + "</li>");
                            });
                            editor.selection.setContent("</ul>");
                          }
                        }
                      },
                      {
                        text: l.listtype3,
                        onclick: function () {
                          editor.focus();
                          let tag = tinyMCE.activeEditor.selection.getNode();
                          let tag_parent = getParent(tag);
                          if (tag_parent) {
                            tag_parent.setAttribute("class", "list3");
                          } else {
                            var selected = editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                            selected = selected.split("<br />");
                            editor.selection.setContent('<ul class="list3">');
                            selected.map(function (data) {
                              editor.selection.setContent("<li>" + data + "</li>");
                            });
                            editor.selection.setContent("</ul>");
                          }
                        }
                      },
                      {
                        text: l.listtype4,
                        onclick: function () {
                          editor.focus();
                          let tag = tinyMCE.activeEditor.selection.getNode();
                          let tag_parent = getParent(tag);
                          if (tag_parent) {
                            tag_parent.setAttribute("class", "list4");
                          } else {
                            var selected = editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                            selected = selected.split("<br />");
                            editor.selection.setContent('<ul class="list4 ">');
                            selected.map(function (data) {
                              editor.selection.setContent("<li>" + data + "</li>");
                            });
                            editor.selection.setContent("</ul>");
                          }
                        }
                      },
                      {
                        text: l.listtype5,
                        onclick: function () {
                          editor.focus();
                          let tag = tinyMCE.activeEditor.selection.getNode();
                          let tag_parent = getParent(tag);
                          if (tag_parent) {
                            tag_parent.setAttribute("class", "list5");
                          } else {
                            var selected = editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                            selected = selected.split("<br />");
                            editor.selection.setContent('<ul class="list5">');
                            selected.map(function (data) {
                              editor.selection.setContent("<li>" + data + "</li>");
                            });
                            editor.selection.setContent("</ul>");
                          }
                        }
                      },
                      {
                        text: l.listtype6,
                        onclick: function () {
                          editor.focus();
                          let tag = tinyMCE.activeEditor.selection.getNode();
                          let tag_parent = getParent(tag);
                          if (tag_parent) {
                            tag_parent.setAttribute("class", "list6");
                          } else {
                            var selected = editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                            selected = selected.split("<br />");
                            editor.selection.setContent('<ul class="list6 ">');
                            selected.map(function (data) {
                              editor.selection.setContent("<li>" + data + "</li>");
                            });
                            editor.selection.setContent("</ul>");
                          }
                        }
                      }
                    ]
                  },
                  {
                    text: l.table,
                    icon: l.tables,
                    menu: createTable(editor, tinyMCE)
                  },
                  {
                    text: l.box,
                    icon: l.boxes,
                    menu: [
                      {
                        text: l.panelblue,
                        onclick: function () {
                          editor.focus();
                          var selected = editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                          editor.selection.setContent('<div class="box1">' + selected + "</div> ");
                        }
                      },
                      {
                        text: l.panelgreen,
                        onclick: function () {
                          editor.focus();
                          var selected = editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                          editor.selection.setContent('<div class="box2">' + selected + "</div> ");
                        }
                      },
                      {
                        text: l.panelsky,
                        onclick: function () {
                          editor.focus();
                          var selected = editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                          editor.selection.setContent('<div class="box3">' + selected + "</div> ");
                        }
                      },
                      {
                        text: l.panelgrad,
                        onclick: function () {
                          editor.focus();
                          var selected = editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                          editor.selection.setContent('<div class="box4">' + selected + "</div> ");
                        }
                      },
                      {
                        text: l.blockgrey,
                        onclick: function () {
                          editor.focus();
                          var selected = editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                          editor.selection.setContent('<div class="box5">' + selected + "</div> ");
                        }
                      }
                    ]
                  },
                  {
                    text: l.symbols,
                    icon: l.symbol,
                    onclick: function () {
                      editor.focus();
                      tinyMCE.activeEditor.execCommand("mceShowCharmap");
                    }
                  },
                  {
                    text: l.ucsyntax,
                    icon: l.ucsyntaxes,
                    menu: [
                      {
                        text: l.uc_syntax_format1,
                        onclick: function () {
                          editor.focus();
                          var selected = editor.selection.getContent() == "" ? l.dummyText : editor.selection.getContent();
                          editor.selection.setContent('<uc:syntax white="">' + selected + "</uc:syntax>");
                          editor.fire("change");
                        }
                      },
                      {
                        text: l.uc_syntax_format2,
                        onclick: function () {
                          editor.focus();
                          var selected = editor.selection.getContent() == "" ? l.dummyText : editor.selection.getContent();
                          editor.selection.setContent('<uc:syntax hidelinenums="">' + selected + "</uc:syntax>");
                          editor.fire("change");
                        }
                      },
                      {
                        text: l.uc_syntax_format3,
                        onclick: function () {
                          editor.focus();
                          var selected = editor.selection.getContent() == "" ? l.dummyText : editor.selection.getContent();
                          editor.selection.setContent('<uc:syntax console="">' + selected + "</uc:syntax>");
                          editor.fire("change");
                        }
                      },
                      {
                        text: l.uc_syntax_format4,
                        onclick: function () {
                          editor.focus();
                          var selected = editor.selection.getContent() == "" ? l.dummyText : editor.selection.getContent();
                          editor.selection.setContent(`<uc:syntax console="" hidelinenums="">${selected}</uc:syntax>`);
                          editor.fire("change");
                        }
                      }
                    ]
                  },
                  {
                    text: "UC Feedback",
                    icon: l.ucfeed,
                    onclick: function () {
                      editor.focus();
                      var selected = editor.selection.getContent() == "" ? " " : editor.selection.getContent();
                      editor.selection.setContent("<ucfeedback>" + selected + "</ucfeedback>");
                      editor.fire("change");
                    }
                  },
                  {
                    text: "|"
                  },
                  {
                    text: l.indentation,
                    icon: l.outdent,
                    onclick: function () {
                      if (tinyMCE.activeEditor.selection.getSel().anchorNode.textContent == tinyMCE.activeEditor.selection.getNode().innerHTML) {
                        if (tinyMCE.activeEditor.selection.getNode().classList.contains("ebook_item_text")) {
                          AH.showmsg("Wrap your text in block element to indent");
                        } else {
                          tinyMCE.activeEditor.dom.toggleClass(tinyMCE.activeEditor.selection.getNode(), "indent_pad");
                        }
                      } else {
                        AH.showmsg(l.wrap_text);
                      }
                    }
                  },
                  {
                    text: l.clear_formatting,
                    icon: l.removeformat,
                    onclick: function () {
                      editor.formatter.remove("removeformat");
                    }
                  }
                ]
              });
              editor.on("focus", function () {
                tinymce.EditorManager.execCommand("mceVisualBlocks", false);
              });
              editor.on("blur", function () {
                //@saquib: focus issue
                //tinymce.EditorManager.execCommand('mceVisualBlocks', true);
              });
            },
            table_default_styles: {
              width: "100%",
              height: "100%"
            },
            plugins: editorConfig.editorPlugin(selector),
            table_class_list: editorConfig.editorTable_class_list,
            contextmenu: editorConfig.contextMenuList,
            toolbar1: editorConfig.toolbaarContext,
            cache_suffix: '?v='+ d.getDate(),
          });
      },
      setConfig: function(ref) {
          editorConfig = ref;
      },
      initEditorFeatures: function() {
        
      }
  };

function createTable(editor, tinyMCE) {
    var editorTable = editorConfig.editorTable(l);
    var tableList = [];
    editorTable.forEach(item => {
      tableList.push(
        {
          text: item.text,
          onclick: function () {
            editor.focus();
            tinyMCE.activeEditor.execCommand("mceInsertContent", false, item.html);
          }
        }
      )
    });
    //@TODO:? @abhishek we should create array same as interactive_item.js to define table, 
    return tableList;
}

function toggleFormat(name) {
  tinymce.activeEditor.formatter.toggle("custom"+name);
}
function removeformat(name) {
  tinymce.activeEditor.formatter.remove("custom"+name);
}
function canApply(name){
  return tinymce.activeEditor.formatter.canApply("custom"+name);
}
function registerFormatter(name) {
    ["h1","h2","h3","h4","h5","h6"].forEach((formatName)=> {
      if (canApply(formatName)) {
        removeformat(formatName);
      }
    });
    tinymce.activeEditor.formatter.register("custom"+name, {
      inline: name
    });
}
</script>