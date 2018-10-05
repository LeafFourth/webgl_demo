<html>
  <head>
    <title>3D show</title>
    
    <script> 
      var showMode = "";
      
      <?php
        $m = $_GET['mode'];
        if (!empty($m)) {
          echo "showMode = '$m';";
        }
      ?>
      
    </script>
    
	<script src="./matrix.js"> </script>
  <script src="./gl_draw.js"></script>
	<script src="./data.js">  </script>
	<script src="./shader_source.js"></script>
	<script src="./main.js"></script>
  <script src="./ray_pick.js"></script>
  <script src="./gl_common.js"></script>
  </head>
  
  <body onload="init()">
    <canvas id="model" height="600" width="600">The brower doesn't support WebGL</canvas>
  </body>
</html>
