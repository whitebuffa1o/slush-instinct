var $ = require('jquery');<% if(!cuttlefish && foundation){ %>
var foundation = require('foundation-sites/js/foundation.min');<% } %>

$(function(){
  <% if(!cuttlefish && foundation){ %>
  $(document).foundation();
  <% } %>
});
