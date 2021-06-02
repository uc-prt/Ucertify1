var icons_data = ["database-icon","table-icon","file-icon","user-group-icon","tools-icon","document-icon","key-icon","pencil-icon","circle-icon","square-icon"];

var icons_html = '<div class="table-responsive"><table class="table editor_table table-hover icons_table w-100"><thead><tr><th>Preview</th><th>Icon Name</th></tr></thead><tbody>'
for (var index = 0; index < icons_data.length; index ++) {
    icons_html += `<tr><td><span class="${icons_data[index]}"></span></td><td class="search">${icons_data[index]}</td></tr>`
}
icons_html += '</tbody></table></div>';
module.exports = {icons_html};