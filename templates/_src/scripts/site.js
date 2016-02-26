var $ = require('jquery');<% if(!cuttlefish && foundation){ %>
var foundation = require('foundation-sites/js/foundation.min');<% } %><% if(cuttlefish){ %>var cuttlefish = require('cuttlefish/scripts/cuttlefish');<% } %>

$(function(){
  <% if(!cuttlefish && foundation){ %>
  $(document).foundation();
  <% } %>
});
