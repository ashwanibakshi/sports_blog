$(document).ready(function(){
    $('#show').hide();
    $('#pimage').hide();
    $('#showvideo').hide();
    
      $("#imgInp").change(function() {
        alert('sdfs')
        readURL1(this);
      });

      function demo(){
           alert('demo');
      }

      function readURL1(input) {
        alert('input')
        var catg = $("#selct").val();
        if(catg !== "videos"){
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          
          reader.onload = function(e) {
            $('#showvideo').hide()
            $('#show').attr('src', e.target.result);
            $('#pimage').attr('src', e.target.result);
            $('#show').show();
            $('#pimage').show()
          }
          reader.readAsDataURL(input.files[0]); // convert to base64 string
        }
       }
       else{
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          
          reader.onload = function(e) {
            
            $('#showvideo').attr('src', e.target.result);
            $('#showvideo').show()
            // $('#pimage').attr('src', e.target.result);
            $('#show').hide();
            // $('#pimage').show()
          }
          reader.readAsDataURL(input.files[0]); // convert to base64 string
        }
       }
      }

      $("#imgInp2").change(function() {
      readURL(this);
    });

    function readURL(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function(e) {
          $('#show2').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]); // convert to base64 string
      }
    }


      //slug
      $("#title").keyup(function(){
        var Text = $("#title").val();
        // alert(Text);
        Text = Text.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
        $("#slug").val(Text);    
        $("#url").val('http://localhost:3000/'+Text); 
    });

    //slug edit
    $("#title2").keyup(function(){
       var Text = $('#title2').val();
       Text = Text.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
        $("#slugg").val(Text); 
        
    })

   //change
     $("#selct").change(function(){
          // var text = $(this).val();
          if(text=='videos'){
              $show('#show').hide();
              $('#showvideo').show();
          }
          // else{
          //   $('#photo').show();
          //   $('#ppreview').show();
          $('#showvideo').hide();
          $show('#show').shows();
          // }
     }); 
 
   //display the editor data
   $(".preview").click(function(){
     alert('dsfsdf');
    //  var text = 
     var html = $('#example').val();
     var title = $('#title').val();
    
     
     
     $('#titlePreview').html(title);    
     $('#editorPreview').html(html);
     $('#PreviewModal').modal('show');
   });

});