var $ = require('jquery');
<% if(foundation){ %>
var foundation = require('foundation-sites/js/foundation.min');
<% } %>

$(function(){
  <% if(foundation){ %>
  $(document).foundation();
  <% } %>
});
