

$('#image-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"  
  }
  $.get('/images?' + search, function(data) {
    $('#image-grid').html('');
    data.forEach(function(image) {
      $('#image-grid').append(`
        <div class="col-md-3 col-sm-6">
          <div class="thumbnail">
            <img src="${ image.image }">
            <div class="caption">
              <h4>${ image.name }</h4>
            </div>
            <p>
              <a href="/images/${ image._id }" class="btn btn-primary">More Info</a>
            </p>
          </div>
        </div>
      `);
    });
  });
});

$('#image-search').submit(function(event) {
  event.preventDefault();
});